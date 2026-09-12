/**
 * F1 Theme & Broadcast Design Tokens
 * 
 * Centralized color palette matching FIA broadcast standards,
 * Pirelli tire compounds, and F1 carbon cockpit styling.
 * 
 * Fully verified for the 2026 Formula 1 Grid (11 Teams • 22 Cars)
 * with backward compatibility for 2024/2025 historical sessions.
 */

export const F1_COLORS = {
  // Cockpit & Base UI
  carbon: '#15151e',
  dark: '#101017',
  tarmac: '#1e1e24',
  card: '#1a1a24',
  cardHover: '#232332',
  border: '#2e2f3e',
  red: '#e10600',
  text: '#f3f4f6',
  muted: '#8b8f9a',

  // FIA Constructor Colors (2026 Grid + Historical)
  teams: {
    // 2026 Formula 1 11-Team Grid
    mclaren: '#FF8000',   // Papaya Orange
    ferrari: '#E80020',   // Rosso Corsa
    redbull: '#3671C6',   // Racing Blue
    mercedes: '#27F4D2',  // Petronas Emerald / Silver
    aston: '#229971',     // British Racing Green
    alpine: '#0093CC',    // Alpine Blue / BWT Pink
    haas: '#B6BABD',      // Haas Titanium White / Red
    rb: '#6692FF',        // RB Electric Blue
    williams: '#64C4FF',  // Williams Blue
    audi: '#F50537',      // Audi Sport Infrared / Titanium (takes over Sauber)
    cadillac: '#D4AF37',  // Cadillac Gold / Yellow (11th Constructor)

    // Historical Replay Aliases (2024-2025)
    sauber: '#52E252',    // Kick Sauber Fluro Green
  },

  // Pirelli Tire Compounds
  tires: {
    SOFT: {
      color: '#e10600',
      label: 'S',
      name: 'Soft',
      bgClass: 'bg-red-600 text-white',
    },
    MEDIUM: {
      color: '#ffd12e',
      label: 'M',
      name: 'Medium',
      bgClass: 'bg-amber-400 text-black',
    },
    HARD: {
      color: '#ffffff',
      label: 'H',
      name: 'Hard',
      bgClass: 'bg-white text-black',
    },
    INTERMEDIATE: {
      color: '#39b54a',
      label: 'I',
      name: 'Intermediate',
      bgClass: 'bg-green-600 text-white',
    },
    WET: {
      color: '#0072bb',
      label: 'W',
      name: 'Wet',
      bgClass: 'bg-blue-600 text-white',
    },
  },

  // Sector Splits
  sectors: {
    purple: '#b138dd', // Fastest overall / session best
    green: '#00d2be',  // Personal best
    yellow: '#ffe500', // Slower / normal
    none: '#2d2e3d',   // Inactive
  },

  // Race Control Flags
  flags: {
    green: '#00d2be',
    yellow: '#ffe500',
    red: '#e10600',
    safetyCar: '#ff9800',
    vsc: '#ff9800',
  },
} as const;

export interface VerifiedConstructor {
  id: string;
  name: string;
  fullName: string;
  hex: string;
  engineSupplier: string;
  chassis: string;
  drivers: Array<{
    number: number;
    name: string;
    tla: string;
    country: string;
  }>;
}

/**
 * Verified 2026 Formula 1 Grid (11 Teams • 22 Cars)
 */
export const F1_GRID_2026: VerifiedConstructor[] = [
  {
    id: 'mclaren',
    name: 'McLaren',
    fullName: 'McLaren Mastercard F1 Team',
    hex: F1_COLORS.teams.mclaren,
    engineSupplier: 'Mercedes-AMG',
    chassis: 'MCL40',
    drivers: [
      { number: 4, name: 'Lando Norris', tla: 'NOR', country: 'GBR' },
      { number: 81, name: 'Oscar Piastri', tla: 'PIA', country: 'AUS' },
    ],
  },
  {
    id: 'ferrari',
    name: 'Ferrari',
    fullName: 'Scuderia Ferrari HP',
    hex: F1_COLORS.teams.ferrari,
    engineSupplier: 'Ferrari',
    chassis: 'SF-26',
    drivers: [
      { number: 16, name: 'Charles Leclerc', tla: 'LEC', country: 'MON' },
      { number: 44, name: 'Lewis Hamilton', tla: 'HAM', country: 'GBR' },
    ],
  },
  {
    id: 'redbull',
    name: 'Red Bull Racing',
    fullName: 'Oracle Red Bull Racing',
    hex: F1_COLORS.teams.redbull,
    engineSupplier: 'Red Bull Ford Powertrains',
    chassis: 'RB22',
    drivers: [
      { number: 1, name: 'Max Verstappen', tla: 'VER', country: 'NED' },
      { number: 6, name: 'Isack Hadjar', tla: 'HAD', country: 'FRA' },
    ],
  },
  {
    id: 'mercedes',
    name: 'Mercedes',
    fullName: 'Mercedes-AMG PETRONAS F1 Team',
    hex: F1_COLORS.teams.mercedes,
    engineSupplier: 'Mercedes-AMG',
    chassis: 'F1 W17',
    drivers: [
      { number: 63, name: 'George Russell', tla: 'RUS', country: 'GBR' },
      { number: 12, name: 'Kimi Antonelli', tla: 'ANT', country: 'ITA' },
    ],
  },
  {
    id: 'aston',
    name: 'Aston Martin',
    fullName: 'Aston Martin Aramco F1 Team',
    hex: F1_COLORS.teams.aston,
    engineSupplier: 'Honda Works (RA626H)',
    chassis: 'AMR26',
    drivers: [
      { number: 14, name: 'Fernando Alonso', tla: 'ALO', country: 'ESP' },
      { number: 18, name: 'Lance Stroll', tla: 'STR', country: 'CAN' },
    ],
  },
  {
    id: 'alpine',
    name: 'Alpine',
    fullName: 'BWT Alpine F1 Team',
    hex: F1_COLORS.teams.alpine,
    engineSupplier: 'Mercedes-AMG',
    chassis: 'A526',
    drivers: [
      { number: 10, name: 'Pierre Gasly', tla: 'GAS', country: 'FRA' },
      { number: 43, name: 'Franco Colapinto', tla: 'COL', country: 'ARG' },
    ],
  },
  {
    id: 'haas',
    name: 'Haas',
    fullName: 'TGR Haas F1 Team',
    hex: F1_COLORS.teams.haas,
    engineSupplier: 'Ferrari',
    chassis: 'VF-26',
    drivers: [
      { number: 31, name: 'Esteban Ocon', tla: 'OCO', country: 'FRA' },
      { number: 87, name: 'Oliver Bearman', tla: 'BEA', country: 'GBR' },
    ],
  },
  {
    id: 'rb',
    name: 'Racing Bulls',
    fullName: 'Racing Bulls F1 Team',
    hex: F1_COLORS.teams.rb,
    engineSupplier: 'Red Bull Ford Powertrains',
    chassis: 'VCARB 03',
    drivers: [
      { number: 30, name: 'Liam Lawson', tla: 'LAW', country: 'NZL' },
      { number: 41, name: 'Arvid Lindblad', tla: 'LIN', country: 'GBR' },
    ],
  },
  {
    id: 'williams',
    name: 'Williams',
    fullName: 'Atlassian Williams F1 Team',
    hex: F1_COLORS.teams.williams,
    engineSupplier: 'Mercedes-AMG',
    chassis: 'FW48',
    drivers: [
      { number: 23, name: 'Alexander Albon', tla: 'ALB', country: 'THA' },
      { number: 55, name: 'Carlos Sainz Jr.', tla: 'SAI', country: 'ESP' },
    ],
  },
  {
    id: 'audi',
    name: 'Audi',
    fullName: 'Audi Revolut F1 Team',
    hex: F1_COLORS.teams.audi,
    engineSupplier: 'Audi Works (AFR 26 Hybrid)',
    chassis: 'R26',
    drivers: [
      { number: 27, name: 'Nico Hülkenberg', tla: 'HUL', country: 'GER' },
      { number: 5, name: 'Gabriel Bortoleto', tla: 'BOR', country: 'BRA' },
    ],
  },
  {
    id: 'cadillac',
    name: 'Cadillac',
    fullName: 'Cadillac Formula 1 Team',
    hex: F1_COLORS.teams.cadillac,
    engineSupplier: 'Ferrari (Customer)',
    chassis: 'MAC-26',
    drivers: [
      { number: 11, name: 'Sergio Pérez', tla: 'PER', country: 'MEX' },
      { number: 77, name: 'Valtteri Bottas', tla: 'BOT', country: 'FIN' },
    ],
  },
];

export type F1TeamKey = keyof typeof F1_COLORS.teams;
export type TireCompoundKey = keyof typeof F1_COLORS.tires;
export type SectorColorKey = keyof typeof F1_COLORS.sectors;

/**
 * Resolves a team hex color from team name or returns a fallback.
 */
export function resolveTeamColor(teamName: string, fallbackHex?: string): string {
  const normalized = teamName.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (normalized.includes('audi')) return F1_COLORS.teams.audi;
  if (normalized.includes('cadillac') || normalized.includes('andretti')) return F1_COLORS.teams.cadillac;
  if (normalized.includes('redbull')) return F1_COLORS.teams.redbull;
  if (normalized.includes('ferrari')) return F1_COLORS.teams.ferrari;
  if (normalized.includes('mercedes')) return F1_COLORS.teams.mercedes;
  if (normalized.includes('mclaren')) return F1_COLORS.teams.mclaren;
  if (normalized.includes('aston')) return F1_COLORS.teams.aston;
  if (normalized.includes('alpine')) return F1_COLORS.teams.alpine;
  if (normalized.includes('williams')) return F1_COLORS.teams.williams;
  if (normalized.includes('rb') || normalized.includes('racingbulls') || normalized.includes('visacashapp')) return F1_COLORS.teams.rb;
  if (normalized.includes('sauber') || normalized.includes('kick')) return F1_COLORS.teams.sauber;
  if (normalized.includes('haas')) return F1_COLORS.teams.haas;

  return fallbackHex || '#8b8f9a';
}
