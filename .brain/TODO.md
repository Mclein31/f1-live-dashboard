---
type: todo
title: F1 Live Dashboard — Phased Learning Roadmap & Checklist
project: f1-live-dashboard
tags:
  - todo
  - roadmap
  - milestones
  - pair-programming
last_updated: 2026-09-09
---

# 📋 Phased Learning Roadmap & Task Checklist

## 🏁 Phase 1: Environment Setup, Dependencies & Project Structure
- [x] **Lesson 1.1: Project Scaffolding & Tooling**
  - Concept: Why Vite + React + TypeScript, bundle mechanics, and rapid HMR for telemetry.
  - Action: Scaffold project with Vite, setup TypeScript config, and verify dev server runs.
  - Checkpoint: Dev server runs at `localhost:5173` showing starter screen.
- [x] **Lesson 1.2: Design Tokens & F1 Theme Configuration**
  - Concept: Dark mode contrast, broadcast graphics hierarchy, FIA standard team & tire colors.
  - Action: Configure Tailwind CSS with F1 color tokens (carbon dark, team hex codes, tire compound badges).
  - Checkpoint: Inspect styled design tokens in browser preview.
- [ ] **Lesson 1.3: Core Domain TypeScript Definitions**
  - Concept: Strongly typing OpenF1 payloads, separating raw network packets from domain models.
  - Action: Define domain models in `src/domain/` (`driver.ts`, `timing.ts`, `telemetry.ts`, `circuit.ts`, `session.ts`, `tyre.ts`, `raceControl.ts`, `weather.ts`).
  - Checkpoint: TypeScript compilation passes with zero type errors.

---

## 📡 Phase 2: Data Ingestion Layer & Offline Session Replay
- [ ] **Lesson 2.1: OpenF1 API Schemas & Telemetry Contracts**
  - Concept: Understanding OpenF1 REST endpoints (`/drivers`, `/intervals`, `/car_data`, `/location`, `/stints`).
  - Action: Implement lightweight fetch client with error handling and typing.
  - Checkpoint: Fetch and log active drivers or sample session data in console.
- [ ] **Lesson 2.2: The Offline Session Replay Fixture Engine**
  - Concept: Why offline fixtures are essential in motorsports dev; building a deterministic virtual clock.
  - Action: Create `public/data/monza-sample.json` and build `useSessionReplay.ts` hook (play/pause/scrub).
  - Checkpoint: Replay timeline ticks from 0 to session end, controllable via console or basic UI.
- [ ] **Lesson 2.3: Unified Telemetry Stream Hook**
  - Concept: The Adapter Pattern — seamlessly switching between Live API stream and Offline Replay without altering UI code.
  - Action: Create `useTelemetryStream.ts` providing standard reactive streams for timing and car metrics.
  - Checkpoint: Toggle between Mock and Live mode; consumers receive identical formatted packets.

---

## ⏱️ Phase 3: Timing Tower & Driver Telemetry Inspector
- [ ] **Lesson 3.1: Timing Tower Structure & Driver Rows**
  - Concept: Information hierarchy of F1 broadcast timing towers (positions, gaps, team colors).
  - Action: Build `TimingTower.tsx` and `DriverRow.tsx` displaying P1..P20 rankings.
  - Checkpoint: Timing tower renders all 20 cars with correct team pills and initials.
- [ ] **Lesson 3.2: Gaps, Intervals & Dynamic Overtake Reordering**
  - Concept: Difference between Gap-to-Leader and Interval-to-Car-Ahead; animating reorders smoothly.
  - Action: Compute deltas and integrate CSS transition for position swaps.
  - Checkpoint: Cars animate smoothly between positions during simulated overtakes.
- [ ] **Lesson 3.3: Sector Timing Splits & Tire Compound Badges**
  - Concept: Purple (Fastest overall), Green (Personal best), Yellow (Slower) sector split rules; tire compounds & stint age.
  - Action: Build micro sector boxes (S1, S2, S3) and tire pill indicators (S, M, H, I, W).
  - Checkpoint: Sector boxes illuminate purple/green/yellow as drivers complete sectors.
- [ ] **Lesson 3.4: Driver Telemetry Inspector UI**
  - Concept: Reading speed, throttle percentage, brake pressure, RPM, and gear traces in real-time.
  - Action: Build `TelemetryInspector.tsx` with speed gauge, pedal meters, and gear display.
  - Checkpoint: Selecting a driver row updates telemetry dials in sync with the replay clock.

---

## 🗺️ Phase 4: Circuit Coordinate Parsing & Track Map Rendering
- [ ] **Lesson 4.1: Understanding F1 GPS Coordinates & Bounding Box Math**
  - Concept: World millimeter coordinate space to SVG screen space; bounding boxes, padding, and aspect ratio.
  - Action: Write `utils/circuitMath.ts` calculating `minX`, `maxX`, `minY`, `maxY`, and viewBox dimensions.
  - Checkpoint: Test math against sample coordinate array and inspect computed viewBox values.
- [ ] **Lesson 4.2: Tracing the SVG Track Path**
  - Concept: Generating SVG `<path d="M... L... Z">` strings from continuous GPS points; asphalt stroke vs racing line stroke.
  - Action: Create `CircuitMap.tsx` rendering the static Monza/Bahrain circuit outline.
  - Checkpoint: Clean, crisp track layout renders inside SVG container on the screen.
- [ ] **Lesson 4.3: Sector Markers, Speed Traps & Start/Finish Line**
  - Concept: Marking key track sectors (S1, S2, S3 boundaries), DRS activation zones, and pit lane entry/exit.
  - Action: Add sector division lines, DRS detection points, and checkered finish line icon.
  - Checkpoint: Sector lines and finish line display at exact geographic track coordinates.

---

## 🏎️ Phase 5: Real-Time Driver Interpolation (Lerping) & Animation
- [ ] **Lesson 5.1: The Jitter Problem & Linear Interpolation (Lerp) Fundamentals**
  - Concept: Why 3 Hz packets jump; the mathematics of linear interpolation: $P(t) = P_0 + (P_1 - P_0) \times \alpha$.
  - Action: Implement `utils/interpolation.ts` with `lerp()` and heading angle calculations.
  - Checkpoint: Unit test lerp function against sample coordinate steps.
- [ ] **Lesson 5.2: Decoupled 60 FPS requestAnimationFrame Render Loop**
  - Concept: Why React state cannot drive 60 FPS animations; using SVG element refs and direct DOM matrix transforms.
  - Action: Build `useDriverInterpolation.ts` managing car marker DOM refs inside `requestAnimationFrame`.
  - Checkpoint: A single car marker glides continuously and smoothly around the track without jitter.
- [ ] **Lesson 5.3: Full 20-Car Grid Multi-Interpolation**
  - Concept: Managing simultaneous interpolation state for all 20 cars with packet buffering and dead-reckoning.
  - Action: Mount all 20 driver markers with team-colored dots, number labels, and forward-facing orientation chevrons.
  - Checkpoint: Entire 20-car grid navigates the circuit simultaneously at 60 FPS.

---

## 💎 Phase 6: Polish, UI Styling & Edge Case Handling
- [ ] **Lesson 6.1: Race Control Messages & Flags (Safety Car, VSC, Red Flag)**
  - Concept: OpenF1 `/race_control` events; global track status badges, Safety Car delta rules.
  - Action: Build `RaceControlBar.tsx` and track-wide status banners (Green, Yellow, Safety Car, Red Flag).
  - Checkpoint: Simulated Safety Car deploys, speed limits apply, and visual banner pulses yellow.
- [ ] **Lesson 6.2: Driver Comparison Head-to-Head Mode**
  - Concept: Overlaying two drivers' speed/throttle/brake telemetry traces on the same circuit distance axis.
  - Action: Implement dual-driver telemetry comparison chart with delta time scrub line.
  - Checkpoint: Toggle VER vs HAM; compare braking points into Turn 1 side-by-side.
- [ ] **Lesson 6.3: Responsive Bento Grid Layout & Broadcast Dark Theme Hardening**
  - Concept: Broadcast TV styling, widescreen monitor optimization, keyboard shortcuts (Space to pause, arrow keys to scrub).
  - Action: Polish CSS layout, contrast ratios, smooth transitions, and keyboard controls.
  - Checkpoint: Complete dashboard operates flawlessly in fullscreen and responsive views.
