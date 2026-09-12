---
type: decisions
title: F1 Live Dashboard — Architectural Decision Records
project: f1-live-dashboard
tags:
  - decisions
  - adr
  - architecture
  - f1
last_updated: 2026-09-09
---

# ⚖️ Architectural Decision Records (ADRs)

## ADR-001: Vite + React + TypeScript Frontend Stack
- **Status**: Accepted
- **Context**: The project requires high-performance real-time telemetry rendering, fast hot-module replacement (HMR) for interactive learning, and strict type safety across intricate telemetry packets.
- **Decision**: Use Vite + React 18/19 with TypeScript.
- **Consequences**: Instantaneous dev server startup, rapid interactive feedback loop for student learning, zero bundler bloat, and end-to-end type safety for OpenF1 API payloads.

---

## ADR-002: Dual Data Layer (Live OpenF1 Stream + Offline Replay Engine)
- **Status**: Accepted
- **Context**: Live F1 Grand Prix races only take place across ~24 weekends per year during specific 2-hour windows. Building and learning cannot stall waiting for a live event.
- **Decision**: Implement a unified `TelemetryStream` interface with two swappable adapters:
  1. `LiveOpenF1Adapter`: Streams real-time REST/SSE from openf1.org.
  2. `SessionReplayAdapter`: Replays recorded multi-lap JSON telemetry fixtures with play, pause, scrubbing, and speed multipliers (1x, 2x, 5x).
- **Consequences**: Deterministic offline development and testing anytime, anywhere, with complete live-ready capability.

---

## ADR-003: SVG Vector Track Map with Dynamic ViewBox Normalization
- **Status**: Accepted
- **Context**: We need to render 2D circuit layouts and driver positions. Alternatives included HTML5 Canvas or WebGL.
- **Decision**: Use Scalable Vector Graphics (SVG) with a dynamically calculated `viewBox` derived from raw GPS bounding boxes (`minX, minY, width, height`).
- **Consequences**:
  - Crisp, infinite vector scaling on Retina displays.
  - Native CSS styling, hover tooltips, and driver labels without manual Canvas hit-testing math.
  - Excellent pedagogical clarity: learners can inspect track nodes and driver markers directly in Chrome DevTools DOM.

---

## ADR-004: Decoupled requestAnimationFrame Lerp Loop via Refs
- **Status**: Accepted
- **Context**: GPS coordinates arrive at 2.5–3.5 Hz. Calling React `setState` at 60 FPS to animate 20 cars re-renders the entire virtual DOM 60 times a second, causing severe UI jank.
- **Decision**: Keep car marker coordinates in mutable `useRef` arrays and drive position translation directly on SVG element transforms (`markerRef.setAttribute('transform', ...)`) inside a `requestAnimationFrame` interpolation loop.
- **Consequences**: Rock-solid 60 FPS car movement, zero CPU waste, and clean separation between high-frequency visual animation and low-frequency React business state.

---

## ADR-005: Interactive Pair-Programming Tutoring Protocol
- **Status**: Accepted
- **Context**: The user's primary goal is to actively learn how every system in this dashboard works. Monolithic code dumps hinder comprehension.
- **Decision**: The Coder Agent is strictly bound to pedagogical directives:
  - Maximum 1 file or sub-module per step.
  - Conceptual explanation & mental model provided before code is written.
  - Interactive checkpoint and verification after each atomic step before proceeding.
- **Consequences**: Slower, highly engaging, deep learning retention for the user.

---

## ADR-006: Dual-Layer Design Token Architecture (Tailwind v4 @theme + TypeScript Constants)
- **Status**: Accepted
- **Context**: F1 dashboard requires broadcast-grade visual fidelity across both standard DOM UI (Tailwind utility classes) and dynamic graphics contexts (SVG `<path>` and `<circle>` fill colors, Canvas charts, sparklines) where CSS classes cannot be directly interpolated or dynamically passed into canvas APIs.
- **Decision**: Define design tokens in `@theme` inside `src/index.css` for Tailwind CSS v4, and mirror them in `src/constants/theme.ts` as typed TypeScript constants (`F1_COLORS`).
- **Consequences**: Single source of truth with typed programmatic access for SVG/Canvas rendering plus rapid declarative styling in React components.

---

## ADR-007: 2026 Grid Alignment & Multi-Season Constructor Compatibility (Audi & Cadillac)
- **Status**: Accepted
- **Context**: The Formula 1 2026 regulations expand the constructor grid from 10 to 11 teams (22 cars). Audi officially enters as the factory works team taking over the Sauber entry, and Cadillac F1 joins as the 11th constructor. However, historical replay sessions recorded via OpenF1 (e.g. 2024/2025 Monza, Silverstone) use Kick Sauber and 20 cars.
- **Decision**: 
  1. Add first-class tokens for Audi (`#F50537`) and Cadillac (`#D4AF37`) in both Tailwind `@theme` and `F1_COLORS.teams`.
  2. Implement `resolveTeamColor(teamName, fallbackHex)` in `src/constants/theme.ts` to normalize constructor names dynamically across both 2026 live streams and 2024–2025 historical replay sessions.
  3. Ensure all timing towers, map markers, and telemetry inspectors are dynamically sized to handle 20 to 22 cars without hardcoded row assumptions.
- **Consequences**: Future-proof 2026 regulation compliance while maintaining 100% backward compatibility with recorded 2024/2025 OpenF1 session fixtures.
