---
type: project-brain
title: F1 Live Dashboard — Project Context
project: f1-live-dashboard
status: planning
tags:
  - project
  - f1
  - motorsport
  - dashboard
  - real-time
  - telemetry
  - react
  - typescript
  - svg
  - learning
last_updated: 2026-09-09
---

# 🏎️ F1 Live Dashboard — Project Context

## 📌 Overview & Purpose
**F1 Live Dashboard** is a real-time Formula 1 telemetry and race-tracking web application. It delivers an interactive broadcast-grade timing tower, live 2D circuit map with smoothly interpolated car markers, sector timing splits, tire stint progression, driver telemetry inspection (speed, throttle, brake, gear, RPM), and an offline session replay engine.

Beyond delivering a high-performance race viewer, the project is structured as an **interactive educational pair-programming journey**. Every module—from telemetry streaming and SVG coordinate transformation to 60fps linear interpolation (lerping) and state management—is built incrementally with conceptual explanations, interactive checkpoints, and zero monolithic code dumps.

---

## 🎯 Current Status
- **Status**: `Phase 1 — Project Initialization & Scaffolding Planned`
- **Active Track**: Setting up clean React + TypeScript + Vite project structure, foundational design tokens, and mock data replay contracts.
- **Next Step**: Lesson 1.1 — Scaffold Vite + React + TypeScript in `f1-live-dashboard`, install dependencies (Tailwind CSS, Lucide icons, lightweight chart utilities), and establish the project directory layout.

---

## 💻 Tech Stack & Architecture Choices

### Frontend Core
- **Framework & Bundler**: React 18 / 19 with Vite + TypeScript
- **Styling**: Tailwind CSS with custom Formula 1 dark theme design tokens (carbon dark `#15151e`, track tarmac `#1e1e24`, timing board contrast)
- **Icons**: `lucide-react`
- **Data Visualization & Canvas**:
  - **Live Circuit Map**: Scalable Vector Graphics (SVG) with dynamic viewBox scaling, `<path>` track tracing, and animated `<g>` driver dots with micro-labels.
  - **Telemetry Inspector**: Custom SVG / Canvas sparkline graphs or Recharts for synchronized RPM, Speed, Gear, Throttle, and Brake traces.
- **State Management**: React Context + custom hooks (`useTelemetryStream`, `useSessionReplay`, `useTimingTower`) with decoupled high-frequency animation loops via `requestAnimationFrame`.

### Data Ingestion & Live Sources
- **Live Data Source**: OpenF1 API (v1 REST and real-time streaming endpoints).
- **Session Replay Engine**: Local JSON telemetry fixtures (e.g., recorded multi-lap samples from Monza / Silverstone) enabling 100% offline development, testing, and deterministic learning when no Grand Prix session is live.
- **Interpolation Engine**: Client-side Linear Interpolation (`lerp`) and dead-reckoning buffer to transform ~3 Hz raw GPS coordinate packets into butter-smooth 60 FPS car movement along the circuit line.

---

## 📂 Key Architecture & Directory Layout

```
f1-live-dashboard/
│
├── .brain/
│   ├── PROJECT_CONTEXT.md
│   ├── ARCHITECTURE.md
│   ├── DECISIONS.md
│   ├── TODO.md
│   └── PROJECT_STATUS.md
│
├── public/
│   ├── data/
│   │   ├── sessions/
│   │   │   └── sample-session.json
│   │   │
│   │   └── circuits/
│   │       ├── bahrain.json
│   │       └── monza.json
│   │
│   └── assets/
│       └── ...
│
├── src/
│   │
│   ├── app/
│   │   ├── App.tsx
│   │   └── routes.tsx
│   │
│   ├── components/
│   │   │
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── SessionHeader.tsx
│   │   │   └── SessionSelector.tsx
│   │   │
│   │   ├── timing/
│   │   │   ├── TimingTower.tsx
│   │   │   ├── DriverRow.tsx
│   │   │   ├── SectorIndicator.tsx
│   │   │   ├── TyreBadge.tsx
│   │   │   └── PitStopIndicator.tsx
│   │   │
│   │   ├── track/
│   │   │   ├── TrackMap.tsx
│   │   │   ├── TrackPath.tsx
│   │   │   ├── DriverMarker.tsx
│   │   │   ├── SectorMarkers.tsx
│   │   │   └── TrackControls.tsx
│   │   │
│   │   ├── telemetry/
│   │   │   ├── TelemetryInspector.tsx
│   │   │   ├── SpeedChart.tsx
│   │   │   ├── RPMChart.tsx
│   │   │   ├── ThrottleChart.tsx
│   │   │   ├── BrakeChart.tsx
│   │   │   └── GearDisplay.tsx
│   │   │
│   │   ├── race-control/
│   │   │   ├── RaceControlBanner.tsx
│   │   │   └── RaceControlFeed.tsx
│   │   │
│   │   ├── weather/
│   │   │   └── WeatherPanel.tsx
│   │   │
│   │   └── replay/
│   │       ├── ReplayControls.tsx
│   │       ├── ReplayTimeline.tsx
│   │       └── PlaybackSpeed.tsx
│   │
│   ├── data/
│   │   │
│   │   ├── adapters/
│   │   │   ├── F1DataSource.ts
│   │   │   ├── OpenF1Adapter.ts
│   │   │   ├── JolpicaAdapter.ts
│   │   │   └── ReplayAdapter.ts
│   │   │
│   │   ├── api/
│   │   │   ├── openf1.ts
│   │   │   ├── jolpica.ts
│   │   │   └── httpClient.ts
│   │   │
│   │   ├── replay/
│   │   │   ├── ReplayEngine.ts
│   │   │   ├── ReplayClock.ts
│   │   │   ├── ReplayLoader.ts
│   │   │   └── ReplayController.ts
│   │   │
│   │   └── parsers/
│   │       ├── driverParser.ts
│   │       ├── timingParser.ts
│   │       ├── telemetryParser.ts
│   │       └── raceControlParser.ts
│   │
│   ├── domain/
│   │   │
│   │   ├── driver.ts
│   │   ├── timing.ts
│   │   ├── telemetry.ts
│   │   ├── circuit.ts
│   │   ├── session.ts
│   │   ├── tyre.ts
│   │   ├── raceControl.ts
│   │   └── weather.ts
│   │
│   ├── telemetry/
│   │   │
│   │   ├── TelemetryBuffer.ts
│   │   ├── SnapshotBuffer.ts
│   │   ├── DriverInterpolator.ts
│   │   ├── TelemetryClock.ts
│   │   └── telemetryUtils.ts
│   │
│   ├── rendering/
│   │   │
│   │   ├── TrackRenderer.ts
│   │   ├── DriverRenderer.ts
│   │   ├── RenderLoop.ts
│   │   └── CanvasRenderer.ts
│   │
│   ├── geometry/
│   │   │
│   │   ├── CircuitProjector.ts
│   │   ├── BoundingBox.ts
│   │   ├── CoordinateTransform.ts
│   │   ├── interpolation.ts
│   │   └── geometryUtils.ts
│   │
│   ├── stores/
│   │   ├── useF1Store.ts
│   │   ├── useSessionStore.ts
│   │   └── useReplayStore.ts
│   │
│   ├── hooks/
│   │   ├── useF1Session.ts
│   │   ├── useTelemetry.ts
│   │   ├── useReplay.ts
│   │   ├── useTrackMap.ts
│   │   └── useSelectedDriver.ts
│   │
│   ├── utils/
│   │   ├── formatLapTime.ts
│   │   ├── formatGap.ts
│   │   ├── formatSpeed.ts
│   │   ├── formatTelemetry.ts
│   │   └── constants.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── theme.css
│   │
│   └── main.tsx
│
├── tests/
│   │
│   ├── geometry/
│   │   ├── CircuitProjector.test.ts
│   │   └── interpolation.test.ts
│   │
│   ├── telemetry/
│   │   ├── TelemetryBuffer.test.ts
│   │   └── DriverInterpolator.test.ts
│   │
│   ├── replay/
│   │   └── ReplayEngine.test.ts
│   │
│   └── data/
│       └── adapters.test.ts
│
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── LICENSE
```

---

## 🔗 Related Projects & Links
- 🗺️ [[_BRAIN/PROJECT_INDEX|Master Project Index]]
- 📊 [[_BRAIN/PROJECT_STATUS|Ecosystem Status Dashboard]]
- 🌐 OpenF1 Documentation: `https://openf1.org`
- 🏎️ FastF1 Reference: Open telemetry schemas and coordinate normalization formulas

---

## ⚠️ Known Constraints & Development Rules
1. **Interactive Pair-Programming Mentorship**: The Coder agent must NOT output monolithic files or complete entire features without guiding the user. Each milestone must explain concepts first, write concise modular code, verify compilation, and checkpoint with the user.
2. **Offline-First Replay Requirement**: The app must never depend solely on live race weekends. Development is driven by rich replay fixtures.
3. **High-Frequency Performance Guard**: Raw coordinate data updates must NOT trigger unneeded React component tree re-renders. Render loops for car coordinates are isolated to refs / canvas / direct SVG updates via `requestAnimationFrame`.
