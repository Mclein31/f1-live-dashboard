---
type: architecture
title: F1 Live Dashboard — Architecture & Technical Design
project: f1-live-dashboard
tags:
  - architecture
  - f1
  - telemetry
  - data-flow
  - svg
  - math
  - interpolation
  - lerp
last_updated: 2026-09-09
---

# 🏛️ F1 Live Dashboard — Architecture & Technical Design

## 📐 High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                DATA INGESTION LAYER                                    │
├───────────────────────────────────────────┬────────────────────────────────────────────┤
│           Live OpenF1 API Source          │        Offline Session Replay Engine       │
│  - REST Polling / SSE / WebSocket Stream  │  - Cached JSON Fixtures (Monza / Sakhir)   │
│  - Endpoint: /location, /car_data, /laps  │  - Controlled Clock (Play/Pause, 1x/2x/5x) │
└─────────────────────┬─────────────────────┴──────────────────────┬─────────────────────┘
                      │                                            │
                      ▼                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        DATA NORMALIZATION & DISPATCH BUFFER                            │
│  - Timestamp Synchronization: Align coordinate packets with telemetry & lap clocks     │
│  - Data Adapters: Transform raw OpenF1 schema to typed domain models                   │
│  - Ring Buffer: Cache past N packets for smooth temporal interpolation                 │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               │ Low-Frequency (~1 Hz)      │ High-Frequency (~3-4 Hz)   │ High-Frequency (~10 Hz)
               ▼                            ▼                            ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌──────────────────────┐
│     TIMING TOWER STATE       │ │    INTERPOLATION ENGINE      │ │  TELEMETRY INSPECTOR │
│  - Positions & Rankings      │ │  - 60 FPS requestAnimation   │ │  - Speed, RPM, Gear  │
│  - Gaps (Leader & Interval)  │ │  - Linear Lerp Math          │ │  - Throttle & Brake  │
│  - Sector Colors (Y/G/P)     │ │  - Heading / Tangent Angle   │ │  - DRS Active State  │
│  - Tire Compound & Stint Age │ │  - Position Buffer Window    │ │  - SVG Sparklines    │
│  - Pit Status & Pit Counters │ │  - Smooth Coordinate Drift   │ │    / Canvas Traces   │
└──────────────┬───────────────┘ └──────────────┬───────────────┘ └──────────┬───────────┘
               │                                │                            │
               ▼                                ▼                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                             REACT PRESENTATION LAYER                                   │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐  ┌────────────────────┐  │
│  │   TimingTower.tsx       │  │    CircuitMap.tsx           │  │ TelemetryView.tsx  │  │
│  │   - P1..P20 Rows        │  │    - Normalized SVG Canvas  │  │ - Line Traces      │  │
│  │   - Team Color Accents  │  │    - Static Track Path      │  │ - Driver Select    │  │
│  │   - Sector Micro-boxes  │  │    - Animated Car Markers   │  │ - Comparative View │  │
│  │   - Interval Indicators │  │    - Sector Markers & DRS   │  │ - Gauge HUDs       │  │
│  └─────────────────────────┘  └─────────────────────────────┘  └────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                         ReplayControlBar.tsx                                     │  │
│  │   - Play / Pause Toggle   - Timeline Scrubber   - Speed Multiplier (1x, 2x, 5x)  │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Domain Data Models & API Specifications

### 1. Driver Profile & State (`types/driver.ts`)
```typescript
export interface Driver {
  driverNumber: number;
  broadcastName: string;      // e.g., "M VERSTAPPEN"
  tla: string;                // Three-letter abbreviation, e.g. "VER"
  teamName: string;           // e.g., "Red Bull Racing"
  teamColorHex: string;       // e.g., "#3671C6"
  countryCode: string;        // e.g., "NED"
  headshotUrl?: string;
}
```

### 2. Timing & Intervals (`types/timing.ts`)
```typescript
export type SectorStatus = 'none' | 'yellow' | 'green' | 'purple';
export type TireCompound = 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE' | 'WET';

export interface SectorTimes {
  sector1: { time: number | null; status: SectorStatus };
  sector2: { time: number | null; status: SectorStatus };
  sector3: { time: number | null; status: SectorStatus };
}

export interface DriverTimingRow {
  position: number;
  driverNumber: number;
  gapToLeader: string;        // e.g., "LEADER", "+1.423"
  interval: string;           // e.g., "-", "+0.312"
  lastLapTime: string;        // e.g., "1:21.432"
  bestLapTime: string;
  sectors: SectorTimes;
  currentCompound: TireCompound;
  tyreAgeLaps: number;
  pitStopsCount: number;
  inPit: boolean;
  retired: boolean;
}
```

### 3. Car Telemetry (`types/telemetry.ts`)
```typescript
export interface CarTelemetrySample {
  timestamp: number;          // Epoch milliseconds
  driverNumber: number;
  speed: number;              // km/h (0 - 360)
  rpm: number;                // 0 - 15000
  gear: number;               // 0 (Neutral), 1 - 8, -1 (Reverse)
  throttle: number;           // 0 - 100 percentage
  brake: number;              // 0 or 100 (or analog 0-100)
  drs: boolean;               // DRS opened / closed
}
```

### 4. Circuit Coordinate Sample (`types/circuit.ts`)
```typescript
export interface RawCoordinateSample {
  timestamp: number;
  driverNumber: number;
  x: number;                  // Raw world/track X coordinate
  y: number;                  // Raw world/track Y coordinate
  z?: number;
}
```

---

## 🗺️ Live Circuit Map: Coordinate Math & SVG Projection

Raw F1 track coordinates (from OpenF1/FastF1) are expressed in world coordinate space (typically meters or millimeters centered at an arbitrary GPS datum). To render these crisp and responsive on an SVG canvas, we implement a **Normalized Bounding Box Projection**.

### Step 1: Track Extents & Bounding Box
From the circuit coordinate dataset (a reference lap collection of points):
$$\min X = \min_{p \in Points}(p.x), \quad \max X = \max_{p \in Points}(p.x)$$
$$\min Y = \min_{p \in Points}(p.y), \quad \max Y = \max_{p \in Points}(p.y)$$

$$\text{rawWidth} = \max X - \min X$$
$$\text{rawHeight} = \max Y - \min Y$$

### Step 2: Aspect-Preserving Viewport Scaling with Padding
To prevent cars from cutting off at the edges when swinging wide on curbs:
1. Apply padding factor (e.g. $p = 0.08$ for 8% margin).
2. Set virtual SVG viewBox coordinate space:
$$\text{viewBoxX} = \min X - (\text{rawWidth} \times p)$$
$$\text{viewBoxY} = \min Y - (\text{rawHeight} \times p)$$
$$\text{viewBoxW} = \text{rawWidth} \times (1 + 2p)$$
$$\text{viewBoxH} = \text{rawHeight} \times (1 + 2p)$$

```typescript
// SVG ViewBox string format
const viewBox = `${viewBoxX} ${viewBoxY} ${viewBoxW} ${viewBoxH}`;
```

### Step 3: Y-Axis Orientation Guard
In cartographic/GPS systems, $Y$ increases Northward (upwards). In SVG / Web Screen coordinates, $Y$ increases downwards. If the raw circuit coordinates appear upside down, we invert $Y$ via an SVG transform or by inverting the projection mapping:
$$y_{\text{screen}} = \max Y - (y_{\text{raw}} - \min Y)$$

### Step 4: Track SVG Path Tracing
The track line is rendered as an SVG `<path>`:
$$\text{d} = \text{"M } x_0 \text{ } y_0 \text{ L } x_1 \text{ } y_1 \dots \text{ Z"}$$
Using two overlapping paths:
- **Track Base**: Thick stroke (`#2a2a35`, stroke-width: `18`) representing the asphalt track boundary.
- **Track Centerline / Racing Line**: Thinner accent line (`#4a4a58`, stroke-width: `4`) with sector division tick markers.

---

## 🏎️ Driver Interpolation Engine: 60 FPS Lerp

### The Jitter Problem
OpenF1 broadcast data emits driver coordinates at approximately **2.5 Hz to 3.5 Hz** (one update every 300–400ms). If markers simply jump between received coordinates, cars will teleport across the screen in discrete, jagged hops.

### The Solution: Linear Interpolation (Lerping) with Render Buffer
To achieve a silky-smooth **60 FPS** (16.6ms frame time), we decouple network packet ingestion from the screen rendering loop.

```
Incoming Packets (~3Hz):  [P_0, t_0] -------------> [P_1, t_1] -------------> [P_2, t_2]
Render Frames (60Hz):       |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
Interpolated Point:        P(t) calculates smooth translation between P_0 and P_1
```

### The Math
Given two adjacent coordinate packets:
- $P_0 = (x_0, y_0)$ at timestamp $t_0$
- $P_1 = (x_1, y_1)$ at timestamp $t_1$

For the current render clock time $t_{\text{render}}$ where $t_0 \le t_{\text{render}} \le t_1$:
$$\alpha = \frac{t_{\text{render}} - t_0}{t_1 - t_0}, \quad \text{clamped to } [0, 1]$$

The interpolated coordinate $(x_t, y_t)$ is:
$$x_t = x_0 + \alpha \cdot (x_1 - x_0)$$
$$y_t = y_0 + \alpha \cdot (y_1 - y_0)$$

### Rotation & Heading Angle
To point car badges or directional chevrons forward:
$$\theta = \text{atan2}(y_1 - y_0, x_1 - x_0) \times \frac{180}{\pi}$$

### Decoupled Animation Loop
The interpolation loop runs inside a dedicated `requestAnimationFrame` loop that mutates an SVG `<g>` transform attribute directly via `useRef`, completely bypassing React component re-renders for maximum rendering efficiency.

---

## ⏱️ Offline Session Replay Engine Architecture

```typescript
export interface ReplayState {
  isPlaying: boolean;
  currentTimeMs: number;
  sessionDurationMs: number;
  playbackSpeed: 1 | 2 | 4 | 8;
}
```

1. **Virtual Clock**: A high-resolution virtual timestamp clock tracks current session progress.
2. **Deterministic Time Scrubbing**: When the user drags the timeline scrubber, the replay engine binary-searches the dataset for the closest lap and coordinate indices and emits the state snapshot instantly.
3. **Data Independence**: Both the Replay Engine and the Live Streaming Hook adhere to the identical `TelemetryStream` interface, allowing hot-swapping between Offline Mock and Live API without changing a single UI line.

---

## 🧩 Component Architecture & Tree

```
App
├── DashboardHeader
│   ├── SessionInfo (Track Name, Weather, Session Type, Clock)
│   ├── FlagIndicator (Green, Yellow, SC, VSC, Red Flag)
│   └── ReplayControlBar (Play, Pause, Scrubber, Speed Multipliers)
│
├── DashboardGrid (Responsive 3-Column Bento Grid)
│   ├── Left Column (w-80 / w-96):
│   │   └── TimingTower
│   │       ├── TimingTowerHeader
│   │       ├── DriverRow (P1..P20)
│   │       │   ├── DriverRank & TeamColorPill
│   │       │   ├── DriverTLA & Number
│   │       │   ├── IntervalDelta & GapToLeader
│   │       │   ├── SectorSplitBoxes (S1, S2, S3 with status colors)
│   │       │   └── TyreBadge (Compound letter + stint age)
│   │       └── PitStatusFooter
│   │
│   ├── Center Column (flex-1):
│   │   ├── CircuitMapContainer
│   │   │   ├── CircuitToolbar (Zoom, Center Leader, Driver Trails Toggle)
│   │   │   └── CircuitMapSVG
│   │   │       ├── StaticTrackPath (Asphalt & Line)
│   │   │       ├── SectorDividers & SpeedTraps
│   │   │       ├── PitLanePath
│   │   │       └── AnimatedDriverMarkers (20 x SVG <g> with Team Color & TLA)
│   │   └── TrackStatsBar (Track Temp, Air Temp, Wind Speed, Humidity)
│   │
│   └── Right Column (w-96 / w-1/3):
│       └── TelemetryInspector
│           ├── DriverSelectorDropdown (Compare Driver A vs Driver B)
│           ├── CurrentGauges (Speed km/h, Gear, RPM dial)
│           ├── PedalsBar (Throttle % Green, Brake % Red)
│           └── TelemetryCharts
│               ├── SpeedTraceChart
│               ├── ThrottleBrakeOverlayChart
│               └── GearStepChart
```

---

## 🛡️ Performance Guardrails
1. **No React State on 60 FPS Math**: Car position coordinates are updated via direct DOM/SVG matrix transforms or Canvas contexts using refs inside `requestAnimationFrame`. React state is reserved for discrete events (lap completion, position overtake, pit entry, flag change).
2. **Memoized SVG Paths**: Circuit path SVG strings are generated once on dataset load and memoized with `useMemo`.
3. **Throttled Replay Scrubber**: Scrubber dragging utilizes `requestAnimationFrame` or 16ms throttling to ensure instantaneous UI feedback without frame drops.
