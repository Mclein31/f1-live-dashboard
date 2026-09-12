import { useState, useEffect } from 'react'
import { Activity, Flag, Gauge, ShieldCheck, Zap } from 'lucide-react'
import { F1_COLORS, F1_GRID_2026 } from './constants/theme'

export default function App() {
  const [speed, setSpeed] = useState(294)
  const [rpm, setRpm] = useState(11850)
  const [gear, setGear] = useState(7)
  const [throttle, setThrottle] = useState(98)
  const [brake, setBrake] = useState(0)
  const [drsActive, setDrsActive] = useState(true)
  const [packetTick, setPacketTick] = useState(142)

  // High-frequency telemetry pulse simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPacketTick((t) => t + 1)
      const isCornering = Math.random() > 0.7
      if (isCornering) {
        setSpeed((s) => Math.max(140, Math.min(330, s - Math.floor(Math.random() * 20))))
        setGear((g) => Math.max(3, Math.min(8, g - 1)))
        setThrottle(Math.floor(Math.random() * 40))
        setBrake(Math.floor(60 + Math.random() * 40))
        setDrsActive(false)
        setRpm(9800 + Math.floor(Math.random() * 1200))
      } else {
        const nextSpeed = Math.min(335, speed + Math.floor(Math.random() * 8))
        setSpeed(nextSpeed)
        setGear(nextSpeed > 300 ? 8 : 7)
        setThrottle(95 + Math.floor(Math.random() * 5))
        setBrake(0)
        setDrsActive(nextSpeed > 270)
        setRpm(11400 + Math.floor(Math.random() * 800))
      }
    }, 200)

    return () => clearInterval(interval)
  }, [speed])

  const tires = Object.entries(F1_COLORS.tires)

  return (
    <div className="min-h-screen bg-[#101017] text-[#f3f4f6] px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Broadcast Header */}
        <header className="border-b border-[#2e2f3e] pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-600/10 text-red-500 border border-red-500/30 mb-2">
              <Zap className="w-3.5 h-3.5" />
              Phase 1 • Lesson 1.2
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
              🏎️ F1 LIVE DASHBOARD
            </h1>
            <p className="text-sm text-[#8b8f9a] mt-1">
              Design Tokens & Broadcast Graphics Hierarchy Showcase
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#15151e] border border-[#2e2f3e] px-4 py-2 rounded-lg text-xs font-mono">
            <div>
              <span className="text-[#8b8f9a] block">SYSTEM</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> ONLINE
              </span>
            </div>
            <div className="h-6 w-px bg-[#2e2f3e]"></div>
            <div>
              <span className="text-[#8b8f9a] block">VIRTUAL CLOCK</span>
              <span className="font-bold text-white tabular-nums">#{packetTick}</span>
            </div>
          </div>
        </header>

        {/* Live Telemetry Component Demo */}
        <section className="bg-[#15151e] border border-[#2e2f3e] rounded-xl p-5 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              Live Cockpit Telemetry HUD (Tailwind + Monospace Tabular)
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800">
              5 Hz LIVE STREAM
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {/* Speed */}
            <div className="bg-[#101017] p-3 rounded-lg border-l-4 border-red-600">
              <span className="text-[11px] text-[#8b8f9a] block uppercase font-medium">Speed</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl md:text-3xl font-black font-mono tabular-nums text-white">
                  {speed}
                </span>
                <span className="text-[11px] text-[#8b8f9a] font-bold">KM/H</span>
              </div>
            </div>

            {/* Gear */}
            <div className="bg-[#101017] p-3 rounded-lg border-l-4 border-amber-500">
              <span className="text-[11px] text-[#8b8f9a] block uppercase font-medium">Gear</span>
              <div className="text-2xl md:text-3xl font-black font-mono tabular-nums text-white mt-1">
                {gear}
              </div>
            </div>

            {/* RPM */}
            <div className="bg-[#101017] p-3 rounded-lg border-l-4 border-blue-500">
              <span className="text-[11px] text-[#8b8f9a] block uppercase font-medium">RPM</span>
              <div className="text-2xl md:text-3xl font-black font-mono tabular-nums text-white mt-1">
                {rpm}
              </div>
            </div>

            {/* Throttle */}
            <div className="bg-[#101017] p-3 rounded-lg border-l-4 border-emerald-500">
              <span className="text-[11px] text-[#8b8f9a] block uppercase font-medium">Throttle</span>
              <div className="text-xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
                {throttle}%
              </div>
              <div className="w-full bg-[#1e1e2d] h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-150"
                  style={{ width: `${throttle}%` }}
                ></div>
              </div>
            </div>

            {/* Brake */}
            <div className="bg-[#101017] p-3 rounded-lg border-l-4 border-rose-500">
              <span className="text-[11px] text-[#8b8f9a] block uppercase font-medium">Brake</span>
              <div className="text-xl font-bold font-mono tabular-nums text-rose-400 mt-1">
                {brake}%
              </div>
              <div className="w-full bg-[#1e1e2d] h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-rose-500 h-full transition-all duration-150"
                  style={{ width: `${brake}%` }}
                ></div>
              </div>
            </div>

            {/* DRS */}
            <div className="bg-[#101017] p-3 rounded-lg border-l-4 border-purple-500 flex flex-col justify-between">
              <span className="text-[11px] text-[#8b8f9a] block uppercase font-medium">DRS Status</span>
              <span
                className={`inline-block text-center py-1 px-2 rounded text-xs font-black tracking-wider transition-colors ${
                  drsActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                }`}
              >
                {drsActive ? 'DRS OPEN' : 'AVAILABLE'}
              </span>
            </div>
          </div>
        </section>

        {/* Sector Timing & Flag Tokens */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sector Splits */}
          <div className="bg-[#15151e] border border-[#2e2f3e] rounded-xl p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Timing Tower Sector Split Tokens
            </h2>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#101017] p-3 rounded-lg border border-[#2e2f3e]">
                <div className="w-4 h-4 rounded-full mx-auto mb-2 bg-[#b138dd] shadow-[0_0_12px_#b138dd]"></div>
                <div className="text-xs font-bold text-white">PURPLE</div>
                <div className="text-[11px] text-[#8b8f9a]">Session Best</div>
                <div className="mt-2 text-xs font-mono font-bold text-[#b138dd]">27.420</div>
              </div>
              <div className="bg-[#101017] p-3 rounded-lg border border-[#2e2f3e]">
                <div className="w-4 h-4 rounded-full mx-auto mb-2 bg-[#00d2be] shadow-[0_0_12px_#00d2be]"></div>
                <div className="text-xs font-bold text-white">GREEN</div>
                <div className="text-[11px] text-[#8b8f9a]">Personal Best</div>
                <div className="mt-2 text-xs font-mono font-bold text-[#00d2be]">27.891</div>
              </div>
              <div className="bg-[#101017] p-3 rounded-lg border border-[#2e2f3e]">
                <div className="w-4 h-4 rounded-full mx-auto mb-2 bg-[#ffe500] shadow-[0_0_12px_#ffe500]"></div>
                <div className="text-xs font-bold text-white">YELLOW</div>
                <div className="text-[11px] text-[#8b8f9a]">Slower / Normal</div>
                <div className="mt-2 text-xs font-mono font-bold text-[#ffe500]">28.315</div>
              </div>
            </div>
          </div>

          {/* Pirelli Tire Compounds */}
          <div className="bg-[#15151e] border border-[#2e2f3e] rounded-xl p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
              <Flag className="w-4 h-4" />
              Pirelli Tire Compound Tokens
            </h2>
            <div className="grid grid-cols-5 gap-2 text-center">
              {tires.map(([compound, info]) => (
                <div key={compound} className="bg-[#101017] p-2.5 rounded-lg border border-[#2e2f3e] flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shadow-md ${info.bgClass}`}
                  >
                    {info.label}
                  </div>
                  <span className="text-[11px] font-bold mt-2 text-white">{info.name}</span>
                  <span className="text-[9px] font-mono text-[#8b8f9a]">{info.color}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FIA Formula 1 Constructor Colors */}
        <section className="bg-[#15151e] border border-[#2e2f3e] rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-rose-400">
              FIA Formula 1 Constructor Palette (2026 Grid • 11 Teams • Audi & Cadillac)
            </h2>
            <span className="text-[11px] font-mono text-[#8b8f9a]">
              22 Cars on Grid • Multi-Season Replay Ready
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {F1_GRID_2026.map((team) => (
              <div
                key={team.id}
                className="bg-[#101017] p-3.5 rounded-lg border border-[#2e2f3e] hover:border-[#424458] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-3.5 h-3.5 rounded-sm shadow flex-shrink-0"
                        style={{ backgroundColor: team.hex }}
                      />
                      <span className="text-xs font-bold text-white truncate">{team.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded">
                      {team.chassis}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#8b8f9a] truncate mb-2">
                    PU: <span className="text-zinc-300">{team.engineSupplier}</span>
                  </div>
                </div>

                <div className="border-t border-[#232332] pt-2 flex justify-between items-center text-[11px] font-mono">
                  <div className="flex gap-2">
                    {team.drivers.map((d) => (
                      <span key={d.number} className="text-white font-medium">
                        <span className="text-[#8b8f9a]">#{d.number}</span> {d.tla}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-semibold">{team.hex}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
