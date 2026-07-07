import { Driver, Constructor, Race, NewsArticle, WeatherInfo } from '../types/f1';

// Helper to generate official FlagCDN image URLs (100% correct, sharp flags)
export const flagUrl = (code: string): string => {
  return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
};

// Comprehensive real F1 2026 driver grid (22 drivers)
export const MOCK_DRIVERS: Driver[] = [
  {
    id: 'antonelli',
    firstName: 'Andrea Kimi',
    lastName: 'Antonelli',
    code: 'ANT',
    number: 12,
    flag: flagUrl('it'),
    photo: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Kimi_Antonelli_at_the_2025_US_Grand_Prix_in_Austin%2C_TX_%28cropped%29.jpg',
    nationality: 'Italian',
    teamId: 'mercedes',
    teamName: 'Mercedes',
    color: '#00D2FF',
    points: 179,
    wins: 5,
    podiums: 6,
    fastestLaps: 2,
    dnfs: 0,
    bio: 'Andrea Kimi Antonelli is the Italian prodigy promoted straight from F2 to Mercedes for the 2026 season. His rapid rise in junior categories has marked him out as one of the most promising young drivers of his generation, replacing Lewis Hamilton at the Silver Arrows.',
    championships: 0,
    polePositions: 4,
    careerWins: 5,
    careerPodiums: 6,
    teamHistory: [{ year: '2026-Present', team: 'Mercedes-AMG' }],
    seasonProgression: [{ race: 'Australia', points: 12 }, { race: 'China', points: 37 }, { race: 'Japan', points: 62 }, { race: 'Miami', points: 87 }, { race: 'Canada', points: 112 }, { race: 'Monaco', points: 137 }, { race: 'Spain', points: 155 }, { race: 'Austria', points: 179 }, { race: 'Great Britain', points: 179 }],
    speedTrace: '50,110 Q 140,240 240,118 T 390,225 T 550,85',
    throttleTrace: '50,250 L 140,280 L 210,250 L 290,280 L 410,250 L 550,250'
  },
  {
    id: 'russell',
    firstName: 'George',
    lastName: 'Russell',
    code: 'RUS',
    number: 63,
    flag: flagUrl('gb'),
    photo: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png',
    nationality: 'British',
    teamId: 'mercedes',
    teamName: 'Mercedes',
    color: '#00D2FF',
    points: 154,
    wins: 1,
    podiums: 2,
    fastestLaps: 1,
    dnfs: 1,
    bio: 'George Russell is a British racing driver leading the charge at Mercedes-AMG. Possessing dynamic wheel-to-wheel racecraft and supreme analytical focus, Russell has established himself as a frontline GP victor.',
    championships: 0,
    polePositions: 2,
    careerWins: 3,
    careerPodiums: 14,
    teamHistory: [{ year: '2019-2021', team: 'Williams' }, { year: '2022-Present', team: 'Mercedes' }],
    seasonProgression: [{ race: 'Australia', points: 25 }, { race: 'China', points: 43 }, { race: 'Japan', points: 61 }, { race: 'Miami', points: 73 }, { race: 'Canada', points: 73 }, { race: 'Monaco', points: 91 }, { race: 'Spain', points: 111 }, { race: 'Austria', points: 136 }, { race: 'Great Britain', points: 154 }],
    speedTrace: '50,95 Q 145,235 245,125 T 395,220 T 550,80',
    throttleTrace: '50,250 L 145,280 L 215,250 L 295,280 L 415,250 L 550,250'
  },
  {
    id: 'hamilton',
    firstName: 'Lewis',
    lastName: 'Hamilton',
    code: 'HAM',
    number: 44,
    flag: flagUrl('gb'),
    photo: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png',
    nationality: 'British',
    teamId: 'ferrari',
    teamName: 'Ferrari',
    color: '#E10600',
    points: 147,
    wins: 1,
    podiums: 4,
    fastestLaps: 1,
    dnfs: 0,
    bio: 'Lewis Hamilton is a seven-time Formula 1 World Champion. Holding records for the most wins, poles, and podiums in F1 history, Hamilton transferred to Scuderia Ferrari for the 2025/2026 seasons.',
    championships: 7,
    polePositions: 104,
    careerWins: 105,
    careerPodiums: 202,
    teamHistory: [{ year: '2007-2012', team: 'McLaren' }, { year: '2013-2024', team: 'Mercedes' }, { year: '2025-Present', team: 'Ferrari' }],
    seasonProgression: [{ race: 'Australia', points: 15 }, { race: 'China', points: 30 }, { race: 'Japan', points: 45 }, { race: 'Miami', points: 63 }, { race: 'Canada', points: 81 }, { race: 'Monaco', points: 99 }, { race: 'Spain', points: 124 }, { race: 'Austria', points: 132 }, { race: 'Great Britain', points: 147 }],
    speedTrace: '50,85 Q 160,220 260,115 T 410,200 T 550,70',
    throttleTrace: '50,250 L 160,280 L 230,250 L 310,280 L 430,250 L 550,250'
  },
  {
    id: 'norris',
    firstName: 'Lando',
    lastName: 'Norris',
    code: 'NOR',
    number: 4,
    flag: flagUrl('gb'),
    photo: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png',
    nationality: 'British',
    teamId: 'mclaren',
    teamName: 'McLaren',
    color: '#FF8700',
    points: 97,
    wins: 0,
    podiums: 3,
    fastestLaps: 1,
    dnfs: 0,
    bio: 'Lando Norris is a British racing driver competing in Formula One for McLaren.',
    championships: 0,
    polePositions: 8,
    careerWins: 5,
    careerPodiums: 26,
    teamHistory: [{ year: '2019-Present', team: 'McLaren' }],
    seasonProgression: [{ race: 'Australia', points: 10 }, { race: 'China', points: 22 }, { race: 'Japan', points: 34 }, { race: 'Miami', points: 52 }, { race: 'Canada', points: 62 }, { race: 'Monaco', points: 70 }, { race: 'Spain', points: 77 }, { race: 'Austria', points: 85 }, { race: 'Great Britain', points: 97 }],
    speedTrace: '50,90 Q 140,240 240,120 T 390,215 T 550,75',
    throttleTrace: '50,250 L 140,280 L 210,250 L 290,280 L 410,250 L 550,250'
  },
  {
    id: 'leclerc',
    firstName: 'Charles',
    lastName: 'Leclerc',
    code: 'LEC',
    number: 16,
    flag: flagUrl('mc'),
    photo: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png',
    nationality: 'Monégasque',
    teamId: 'ferrari',
    teamName: 'Ferrari',
    color: '#E10600',
    points: 108,
    wins: 1,
    podiums: 3,
    fastestLaps: 1,
    dnfs: 1,
    bio: 'Charles Leclerc is a Monégasque racing driver competing for Scuderia Ferrari.',
    championships: 0,
    polePositions: 27,
    careerWins: 10,
    careerPodiums: 39,
    teamHistory: [{ year: '2018', team: 'Sauber' }, { year: '2019-Present', team: 'Ferrari' }],
    seasonProgression: [{ race: 'Australia', points: 18 }, { race: 'China', points: 28 }, { race: 'Japan', points: 38 }, { race: 'Miami', points: 48 }, { race: 'Canada', points: 58 }, { race: 'Monaco', points: 68 }, { race: 'Spain', points: 75 }, { race: 'Austria', points: 83 }, { race: 'Great Britain', points: 108 }],
    speedTrace: '50,82 Q 155,225 255,112 T 405,205 T 550,65',
    throttleTrace: '50,250 L 155,280 L 225,250 L 305,280 L 425,250 L 550,250'
  },
  {
    id: 'piastri',
    firstName: 'Oscar',
    lastName: 'Piastri',
    code: 'PIA',
    number: 81,
    flag: flagUrl('au'),
    photo: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png',
    nationality: 'Australian',
    teamId: 'mclaren',
    teamName: 'McLaren',
    color: '#FF8700',
    points: 82,
    wins: 0,
    podiums: 2,
    fastestLaps: 1,
    dnfs: 0,
    bio: 'Oscar Piastri is a highly-rated Australian racing driver competing for McLaren.',
    championships: 0,
    polePositions: 0,
    careerWins: 2,
    careerPodiums: 10,
    teamHistory: [{ year: '2023-Present', team: 'McLaren' }],
    seasonProgression: [{ race: 'Australia', points: 8 }, { race: 'China', points: 18 }, { race: 'Japan', points: 28 }, { race: 'Miami', points: 43 }, { race: 'Canada', points: 53 }, { race: 'Monaco', points: 61 }, { race: 'Spain', points: 70 }, { race: 'Austria', points: 82 }, { race: 'Great Britain', points: 82 }],
    speedTrace: '50,92 Q 148,238 248,122 T 398,218 T 550,78',
    throttleTrace: '50,250 L 148,280 L 218,250 L 298,280 L 418,250 L 550,250'
  },
  {
    id: 'max_verstappen',
    firstName: 'Max',
    lastName: 'Verstappen',
    code: 'VER',
    number: 3,
    flag: flagUrl('nl'),
    photo: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png',
    nationality: 'Dutch',
    teamId: 'red_bull',
    teamName: 'Red Bull Racing',
    color: '#002F6C',
    points: 76,
    wins: 0,
    podiums: 1,
    fastestLaps: 1,
    dnfs: 1,
    bio: 'Max Verstappen is a four-time Formula 1 World Champion driving for Oracle Red Bull Racing.',
    championships: 4,
    polePositions: 48,
    careerWins: 71,
    careerPodiums: 129,
    teamHistory: [{ year: '2016-Present', team: 'Red Bull Racing' }],
    seasonProgression: [{ race: 'Australia', points: 6 }, { race: 'China', points: 16 }, { race: 'Japan', points: 26 }, { race: 'Miami', points: 36 }, { race: 'Canada', points: 46 }, { race: 'Monaco', points: 56 }, { race: 'Spain', points: 66 }, { race: 'Austria', points: 76 }, { race: 'Great Britain', points: 76 }],
    speedTrace: '50,80 Q 150,230 250,110 T 400,210 T 550,60',
    throttleTrace: '50,250 L 150,280 L 220,250 L 300,280 L 420,250 L 550,250'
  },
  {
    id: 'hadjar',
    firstName: 'Isack',
    lastName: 'Hadjar',
    code: 'HAD',
    number: 6,
    flag: flagUrl('fr'),
    photo: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png',
    nationality: 'French',
    teamId: 'red_bull',
    teamName: 'Red Bull Racing',
    color: '#002F6C',
    points: 52,
    wins: 0,
    podiums: 0,
    fastestLaps: 0,
    dnfs: 0,
    bio: 'Isack Hadjar is the promising French junior driver promoted to Red Bull Racing for 2026.',
    championships: 0,
    polePositions: 0,
    careerWins: 0,
    careerPodiums: 0,
    teamHistory: [{ year: '2026-Present', team: 'Red Bull Racing' }],
    seasonProgression: [{ race: 'Australia', points: 2 }, { race: 'China', points: 10 }, { race: 'Japan', points: 18 }, { race: 'Miami', points: 24 }, { race: 'Canada', points: 30 }, { race: 'Monaco', points: 36 }, { race: 'Spain', points: 40 }, { race: 'Austria', points: 42 }, { race: 'Great Britain', points: 52 }],
    speedTrace: '50,100 Q 140,240 240,130 T 390,220 T 550,90',
    throttleTrace: '50,250 L 140,280 L 210,250 L 290,280 L 410,250 L 550,250'
  },
  {
    id: 'gasly',
    firstName: 'Pierre',
    lastName: 'Gasly',
    code: 'GAS',
    number: 10,
    flag: flagUrl('fr'),
    photo: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png',
    nationality: 'French',
    teamId: 'alpine',
    teamName: 'Alpine',
    color: '#0090FF',
    points: 42,
    wins: 0,
    podiums: 0,
    fastestLaps: 0,
    dnfs: 0,
    bio: 'Pierre Gasly is a Grand Prix winner competing for Alpine.',
    championships: 0,
    polePositions: 0,
    careerWins: 1,
    careerPodiums: 4,
    teamHistory: [{ year: '2023-Present', team: 'Alpine' }],
    seasonProgression: [{ race: 'Australia', points: 4 }, { race: 'China', points: 12 }, { race: 'Japan', points: 18 }, { race: 'Miami', points: 22 }, { race: 'Canada', points: 28 }, { race: 'Monaco', points: 32 }, { race: 'Spain', points: 38 }, { race: 'Austria', points: 41 }, { race: 'Great Britain', points: 42 }],
    speedTrace: '50,105 Q 138,245 238,135 T 388,230 T 550,92',
    throttleTrace: '50,250 L 138,280 L 208,250 L 288,280 L 408,250 L 550,250'
  },
  {
    id: 'lawson',
    firstName: 'Liam',
    lastName: 'Lawson',
    code: 'LAW',
    number: 40,
    flag: flagUrl('nz'),
    photo: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png',
    nationality: 'New Zealander',
    teamId: 'racing_bulls',
    teamName: 'Racing Bulls',
    color: '#03183F',
    points: 39,
    wins: 0,
    podiums: 0,
    fastestLaps: 0,
    dnfs: 0,
    bio: 'Liam Lawson is a New Zealander racing driver competing for Racing Bulls.',
    championships: 0,
    polePositions: 0,
    careerWins: 0,
    careerPodiums: 0,
    teamHistory: [{ year: '2024-Present', team: 'RB' }],
    seasonProgression: [{ race: 'Australia', points: 0 }, { race: 'China', points: 4 }, { race: 'Japan', points: 10 }, { race: 'Miami', points: 16 }, { race: 'Canada', points: 22 }, { race: 'Monaco', points: 26 }, { race: 'Spain', points: 28 }, { race: 'Austria', points: 31 }, { race: 'Great Britain', points: 39 }],
    speedTrace: '50,108 Q 139,247 239,138 T 389,232 T 550,94',
    throttleTrace: '50,250 L 139,280 L 209,250 L 289,280 L 409,250 L 550,250'
  },
  {
    id: 'bearman',
    firstName: 'Oliver',
    lastName: 'Bearman',
    code: 'BEA',
    number: 87,
    flag: flagUrl('gb'),
    photo: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png',
    nationality: 'British',
    teamId: 'haas',
    teamName: 'Haas',
    color: '#FFFFFF',
    points: 18,
    wins: 0,
    podiums: 0,
    fastestLaps: 0,
    dnfs: 0,
    bio: 'Oliver Bearman is the young British driver promoted to Haas for 2026.',
    championships: 0,
    polePositions: 0,
    careerWins: 0,
    careerPodiums: 0,
    teamHistory: [{ year: '2026-Present', team: 'Haas' }],
    seasonProgression: [{ race: 'Australia', points: 0 }, { race: 'China', points: 2 }, { race: 'Japan', points: 6 }, { race: 'Miami', points: 8 }, { race: 'Canada', points: 12 }, { race: 'Monaco', points: 14 }, { race: 'Spain', points: 16 }, { race: 'Austria', points: 18 }, { race: 'Great Britain', points: 18 }],
    speedTrace: '50,102 Q 141,241 241,132 T 391,229 T 550,91',
    throttleTrace: '50,250 L 141,280 L 211,250 L 291,280 L 411,250 L 550,250'
  },
  {
    id: 'colapinto',
    firstName: 'Franco',
    lastName: 'Colapinto',
    code: 'COL',
    number: 43,
    flag: flagUrl('ar'),
    photo: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png',
    nationality: 'Argentinian',
    teamId: 'alpine',
    teamName: 'Alpine',
    color: '#0090FF',
    points: 18,
    wins: 0,
    podiums: 0,
    fastestLaps: 0,
    dnfs: 1,
    bio: 'Franco Colapinto drives for Alpine alongside Pierre Gasly in 2026.',
    championships: 0,
    polePositions: 0,
    careerWins: 0,
    careerPodiums: 0,
    teamHistory: [{ year: '2026-Present', team: 'Alpine' }],
    seasonProgression: [{ race: 'Australia', points: 0 }, { race: 'China', points: 2 }, { race: 'Japan', points: 4 }, { race: 'Miami', points: 6 }, { race: 'Canada', points: 10 }, { race: 'Monaco', points: 12 }, { race: 'Spain', points: 14 }, { race: 'Austria', points: 16 }, { race: 'Great Britain', points: 18 }],
    speedTrace: '50,105 Q 138,245 238,135 T 388,230 T 550,92',
    throttleTrace: '50,250 L 138,280 L 208,250 L 288,280 L 408,250 L 550,250'
  },
  {
    id: 'lindblad',
    firstName: 'Arvid',
    lastName: 'Lindblad',
    code: 'LIN',
    number: 17,
    flag: flagUrl('gb'),
    photo: '/images/drivers/arvid_lindblad.jpg',
    nationality: 'British',
    teamId: 'racing_bulls',
    teamName: 'Racing Bulls',
    color: '#03183F',
    points: 20,
    wins: 0,
    podiums: 0,
    fastestLaps: 0,
    dnfs: 0,
    bio: 'Arvid Lindblad is the British rookie driver making his debut for Racing Bulls.',
    championships: 0,
    polePositions: 0,
    careerWins: 0,
    careerPodiums: 0,
    teamHistory: [{ year: '2026-Present', team: 'RB' }],
    seasonProgression: [{ race: 'Australia', points: 0 }, { race: 'China', points: 2 }, { race: 'Japan', points: 4 }, { race: 'Miami', points: 6 }, { race: 'Canada', points: 8 }, { race: 'Monaco', points: 10 }, { race: 'Spain', points: 12 }, { race: 'Austria', points: 14 }, { race: 'Great Britain', points: 20 }],
    speedTrace: '50,108 Q 139,247 239,138 T 389,232 T 550,94',
    throttleTrace: '50,250 L 139,280 L 209,250 L 289,280 L 409,250 L 550,250'
  },
  {
    id: 'sainz',
    firstName: 'Carlos',
    lastName: 'Sainz',
    code: 'SAI',
    number: 55,
    flag: flagUrl('es'),
    photo: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png',
    nationality: 'Spanish',
    teamId: 'williams',
    teamName: 'Williams',
    color: '#005F9E',
    points: 6,
    wins: 0,
    podiums: 0,
    fastestLaps: 0,
    dnfs: 2,
    bio: 'Carlos Sainz is a Spanish Formula One driver competing for Williams Racing.',
    championships: 0,
    polePositions: 5,
    careerWins: 4,
    careerPodiums: 21,
    teamHistory: [{ year: '2021-2024', team: 'Ferrari' }, { year: '2025-Present', team: 'Williams' }],
    seasonProgression: [{ race: 'Australia', points: 0 }, { race: 'China', points: 2 }, { race: 'Japan', points: 2 }, { race: 'Miami', points: 4 }, { race: 'Canada', points: 4 }, { race: 'Monaco', points: 4 }, { race: 'Spain', points: 6 }, { race: 'Austria', points: 6 }, { race: 'Great Britain', points: 6 }],
    speedTrace: '50,100 Q 142,242 242,130 T 392,228 T 550,88',
    throttleTrace: '50,250 L 142,280 L 212,250 L 292,280 L 412,250 L 550,250'
  },
  {
    id: 'albon',
    firstName: 'Alexander',
    lastName: 'Albon',
    code: 'ALB',
    number: 23,
    flag: flagUrl('th'),
    photo: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png',
    nationality: 'Thai',
    teamId: 'williams',
    teamName: 'Williams',
    color: '#005F9E',
    points: 5,
    wins: 0,
    podiums: 0,
    fastestLaps: 0,
    dnfs: 1,
    bio: 'Alexander Albon is a Thai-British racing driver competing for Williams Racing.',
    championships: 0,
    polePositions: 0,
    careerWins: 0,
    careerPodiums: 2,
    teamHistory: [{ year: '2022-Present', team: 'Williams' }],
    seasonProgression: [{ race: 'Australia', points: 0 }, { race: 'China', points: 1 }, { race: 'Japan', points: 2 }, { race: 'Miami', points: 3 }, { race: 'Canada', points: 3 }, { race: 'Monaco', points: 3 }, { race: 'Spain', points: 5 }, { race: 'Austria', points: 5 }, { race: 'Great Britain', points: 5 }],
    speedTrace: '50,110 Q 139,248 239,140 T 389,235 T 550,98',
    throttleTrace: '50,250 L 139,280 L 209,250 L 289,280 L 409,250 L 550,250'
  },
  {
    id: 'ocon',
    firstName: 'Esteban',
    lastName: 'Ocon',
    code: 'OCO',
    number: 31,
    flag: flagUrl('fr'),
    photo: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png',
    nationality: 'French',
    teamId: 'haas',
    teamName: 'Haas',
    color: '#FFFFFF',
    points: 3,
    wins: 0,
    podiums: 0,
    fastestLaps: 0,
    dnfs: 0,
    bio: 'Esteban Ocon is a French F1 driver racing for Haas in 2026.',
    championships: 0,
    polePositions: 0,
    careerWins: 1,
    careerPodiums: 3,
    teamHistory: [{ year: '2026-Present', team: 'Haas' }],
    seasonProgression: [{ race: 'Australia', points: 0 }, { race: 'China', points: 0 }, { race: 'Japan', points: 1 }, { race: 'Miami', points: 1 }, { race: 'Canada', points: 2 }, { race: 'Monaco', points: 2 }, { race: 'Spain', points: 3 }, { race: 'Austria', points: 3 }, { race: 'Great Britain', points: 3 }],
    speedTrace: '50,102 Q 141,241 241,132 T 391,229 T 550,91',
    throttleTrace: '50,250 L 141,280 L 211,250 L 291,280 L 411,250 L 550,250'
  },
  {
    id: 'bortoleto',
    firstName: 'Gabriel',
    lastName: 'Bortoleto',
    code: 'BOR',
    number: 5,
    flag: flagUrl('br'),
    photo: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GABBOR01_Gabriel_Bortoleto/gabbor01.png',
    nationality: 'Brazilian',
    teamId: 'audi',
    teamName: 'Audi',
    color: '#F30B52',
    points: 6,
    wins: 0,
    podiums: 0,
    fastestLaps: 0,
    dnfs: 0,
    bio: 'Gabriel Bortoleto is the Brazilian racing driver competing for Audi.',
    championships: 0,
    polePositions: 0,
    careerWins: 0,
    careerPodiums: 0,
    teamHistory: [{ year: '2026-Present', team: 'Audi' }],
    seasonProgression: [{ race: 'Australia', points: 0 }, { race: 'China', points: 0 }, { race: 'Japan', points: 0 }, { race: 'Miami', points: 1 }, { race: 'Canada', points: 1 }, { race: 'Monaco', points: 2 }, { race: 'Spain', points: 2 }, { race: 'Austria', points: 2 }, { race: 'Great Britain', points: 6 }],
    speedTrace: '50,102 Q 141,241 241,132 T 391,229 T 550,91',
    throttleTrace: '50,250 L 141,280 L 211,250 L 291,280 L 411,250 L 550,250'
  },
  {
    id: 'alonso',
    firstName: 'Fernando',
    lastName: 'Alonso',
    code: 'ALO',
    number: 14,
    flag: flagUrl('es'),
    photo: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png',
    nationality: 'Spanish',
    teamId: 'aston_martin',
    teamName: 'Aston Martin',
    color: '#229971',
    points: 1,
    wins: 0,
    podiums: 0,
    fastestLaps: 0,
    dnfs: 0,
    bio: 'Fernando Alonso is a double World Champion (2005, 2006) competing for Aston Martin.',
    championships: 2,
    polePositions: 22,
    careerWins: 32,
    careerPodiums: 106,
    teamHistory: [{ year: '2023-Present', team: 'Aston Martin' }],
    seasonProgression: [{ race: 'Australia', points: 0 }, { race: 'China', points: 0 }, { race: 'Japan', points: 0 }, { race: 'Miami', points: 0 }, { race: 'Canada', points: 0 }, { race: 'Monaco', points: 1 }, { race: 'Spain', points: 1 }, { race: 'Austria', points: 1 }, { race: 'Great Britain', points: 1 }],
    speedTrace: '50,105 Q 138,245 238,135 T 388,230 T 550,92',
    throttleTrace: '50,250 L 138,280 L 208,250 L 288,280 L 408,250 L 550,250'
  },
  {
    id: 'stroll',
    firstName: 'Lance',
    lastName: 'Stroll',
    code: 'STR',
    number: 18,
    flag: flagUrl('ca'),
    photo: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png',
    nationality: 'Canadian',
    teamId: 'aston_martin',
    teamName: 'Aston Martin',
    color: '#229971',
    points: 0,
    wins: 0,
    podiums: 0,
    fastestLaps: 0,
    dnfs: 0,
    bio: 'Lance Stroll is a Canadian racing driver competing for Aston Martin.',
    championships: 0,
    polePositions: 1,
    careerWins: 0,
    careerPodiums: 3,
    teamHistory: [{ year: '2019-Present', team: 'Aston Martin' }],
    seasonProgression: [{ race: 'Australia', points: 0 }, { race: 'China', points: 0 }, { race: 'Japan', points: 0 }, { race: 'Miami', points: 0 }, { race: 'Canada', points: 0 }, { race: 'Monaco', points: 0 }, { race: 'Spain', points: 0 }, { race: 'Austria', points: 0 }, { race: 'Great Britain', points: 0 }],
    speedTrace: '50,105 Q 138,245 238,135 T 388,230 T 550,92',
    throttleTrace: '50,250 L 138,280 L 208,250 L 288,280 L 408,250 L 550,250'
  },
  {
    id: 'bottas',
    firstName: 'Valtteri',
    lastName: 'Bottas',
    code: 'BOT',
    number: 77,
    flag: flagUrl('fi'),
    photo: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png',
    nationality: 'Finnish',
    teamId: 'cadillac',
    teamName: 'Cadillac',
    color: '#808080',
    points: 0,
    wins: 0,
    podiums: 0,
    fastestLaps: 0,
    dnfs: 0,
    bio: 'Valtteri Bottas is a Finnish driver racing for Cadillac in 2026.',
    championships: 0,
    polePositions: 20,
    careerWins: 10,
    careerPodiums: 67,
    teamHistory: [{ year: '2026-Present', team: 'Cadillac' }],
    seasonProgression: [{ race: 'Australia', points: 0 }, { race: 'China', points: 0 }, { race: 'Japan', points: 0 }, { race: 'Miami', points: 0 }, { race: 'Canada', points: 0 }, { race: 'Monaco', points: 0 }, { race: 'Spain', points: 0 }, { race: 'Austria', points: 0 }, { race: 'Great Britain', points: 0 }],
    speedTrace: '50,105 Q 138,245 238,135 T 388,230 T 550,92',
    throttleTrace: '50,250 L 138,280 L 208,250 L 288,280 L 408,250 L 550,250'
  },
  {
    id: 'perez',
    firstName: 'Sergio',
    lastName: 'Pérez',
    code: 'PER',
    number: 11,
    flag: flagUrl('mx'),
    photo: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png',
    nationality: 'Mexican',
    teamId: 'cadillac',
    teamName: 'Cadillac',
    color: '#808080',
    points: 0,
    wins: 0,
    podiums: 0,
    fastestLaps: 0,
    dnfs: 0,
    bio: 'Sergio Perez is a Mexican driver racing for Cadillac in 2026.',
    championships: 0,
    polePositions: 3,
    careerWins: 6,
    careerPodiums: 39,
    teamHistory: [{ year: '2026-Present', team: 'Cadillac' }],
    seasonProgression: [{ race: 'Australia', points: 0 }, { race: 'China', points: 0 }, { race: 'Japan', points: 0 }, { race: 'Miami', points: 0 }, { race: 'Canada', points: 0 }, { race: 'Monaco', points: 0 }, { race: 'Spain', points: 0 }, { race: 'Austria', points: 0 }, { race: 'Great Britain', points: 0 }],
    speedTrace: '50,105 Q 138,245 238,135 T 388,230 T 550,92',
    throttleTrace: '50,250 L 138,280 L 208,250 L 288,280 L 408,250 L 550,250'
  },
  {
    id: 'hulkenberg',
    firstName: 'Nico',
    lastName: 'Hülkenberg',
    code: 'HUL',
    number: 27,
    flag: flagUrl('de'),
    photo: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png',
    nationality: 'German',
    teamId: 'audi',
    teamName: 'Audi',
    color: '#F30B52',
    points: 0,
    wins: 0,
    podiums: 0,
    fastestLaps: 0,
    dnfs: 0,
    bio: 'Nico Hulkenberg is a German F1 driver competing for Audi.',
    championships: 0,
    polePositions: 1,
    careerWins: 0,
    careerPodiums: 0,
    teamHistory: [{ year: '2026-Present', team: 'Audi' }],
    seasonProgression: [{ race: 'Australia', points: 0 }, { race: 'China', points: 0 }, { race: 'Japan', points: 0 }, { race: 'Miami', points: 0 }, { race: 'Canada', points: 0 }, { race: 'Monaco', points: 0 }, { race: 'Spain', points: 0 }, { race: 'Austria', points: 0 }, { race: 'Great Britain', points: 0 }],
    speedTrace: '50,102 Q 141,241 241,132 T 391,229 T 550,91',
    throttleTrace: '50,250 L 141,280 L 211,250 L 291,280 L 411,250 L 550,250'
  }
];

export const MOCK_CONSTRUCTORS: Constructor[] = [
  { 
    id: 'mercedes', 
    name: 'Mercedes', 
    logo: flagUrl('de'), 
    principal: 'Toto Wolff', 
    drivers: ['Andrea Kimi Antonelli', 'George Russell'], 
    engine: 'Mercedes', 
    points: 333, 
    wins: 6, 
    championships: 8, 
    color: '#00D2FF',
    historyText: 'Mercedes-AMG Petronas F1 Team, based in Brackley, UK.',
    seasonProgression: [{ race: 'Australia', points: 37 }, { race: 'China', points: 80 }, { race: 'Japan', points: 123 }, { race: 'Miami', points: 160 }, { race: 'Canada', points: 185 }, { race: 'Monaco', points: 228 }, { race: 'Spain', points: 266 }, { race: 'Austria', points: 315 }, { race: 'Great Britain', points: 333 }],
    livery: 'https://media.formula1.com/image/upload/c_lfill,w_512/q_auto/d_common:f1:2026:fallback:car:2026fallbackcarright.webp/v1740000001/common/f1/2026/mercedes/2026mercedescarright.webp'
  },
  { 
    id: 'ferrari', 
    name: 'Ferrari', 
    logo: flagUrl('it'), 
    principal: 'Frédéric Vasseur', 
    drivers: ['Charles Leclerc', 'Lewis Hamilton'], 
    engine: 'Ferrari', 
    points: 255, 
    wins: 2, 
    championships: 16, 
    color: '#E10600',
    historyText: 'Scuderia Ferrari HP, based in Maranello, Italy.',
    seasonProgression: [{ race: 'Australia', points: 33 }, { race: 'China', points: 58 }, { race: 'Japan', points: 83 }, { race: 'Miami', points: 111 }, { race: 'Canada', points: 139 }, { race: 'Monaco', points: 167 }, { race: 'Spain', points: 199 }, { race: 'Austria', points: 215 }, { race: 'Great Britain', points: 255 }],
    livery: 'https://media.formula1.com/image/upload/c_lfill,w_512/q_auto/d_common:f1:2026:fallback:car:2026fallbackcarright.webp/v1740000001/common/f1/2026/ferrari/2026ferraricarright.webp'
  },
  { 
    id: 'mclaren', 
    name: 'McLaren', 
    logo: flagUrl('gb'), 
    principal: 'Andrea Stella', 
    drivers: ['Lando Norris', 'Oscar Piastri'], 
    engine: 'Mercedes', 
    points: 179, 
    wins: 0, 
    championships: 8, 
    color: '#FF8700',
    historyText: 'McLaren Formula 1 Team, based in Woking, UK.',
    seasonProgression: [{ race: 'Australia', points: 18 }, { race: 'China', points: 40 }, { race: 'Japan', points: 62 }, { race: 'Miami', points: 95 }, { race: 'Canada', points: 115 }, { race: 'Monaco', points: 131 }, { race: 'Spain', points: 147 }, { race: 'Austria', points: 167 }, { race: 'Great Britain', points: 179 }],
    livery: 'https://media.formula1.com/image/upload/c_lfill,w_512/q_auto/d_common:f1:2026:fallback:car:2026fallbackcarright.webp/v1740000001/common/f1/2026/mclaren/2026mclarencarright.webp'
  },
  { 
    id: 'red_bull', 
    name: 'Red Bull Racing', 
    logo: flagUrl('at'), 
    principal: 'Christian Horner', 
    drivers: ['Max Verstappen', 'Isack Hadjar'], 
    engine: 'Honda RBPT', 
    points: 128, 
    wins: 0, 
    championships: 6, 
    color: '#002F6C',
    historyText: 'Oracle Red Bull Racing, based in Milton Keynes, UK.',
    seasonProgression: [{ race: 'Australia', points: 8 }, { race: 'China', points: 26 }, { race: 'Japan', points: 44 }, { race: 'Miami', points: 60 }, { race: 'Canada', points: 76 }, { race: 'Monaco', points: 92 }, { race: 'Spain', points: 106 }, { race: 'Austria', points: 118 }, { race: 'Great Britain', points: 128 }],
    livery: 'https://media.formula1.com/image/upload/c_lfill,w_512/q_auto/d_common:f1:2026:fallback:car:2026fallbackcarright.webp/v1740000001/common/f1/2026/redbullracing/2026redbullracingcarright.webp'
  },
  { 
    id: 'alpine', 
    name: 'Alpine', 
    logo: flagUrl('fr'), 
    principal: 'Oliver Oakes', 
    drivers: ['Pierre Gasly', 'Franco Colapinto'], 
    engine: 'Mercedes', 
    points: 60, 
    wins: 0, 
    championships: 0, 
    color: '#0090FF',
    historyText: 'BWT Alpine F1 Team, based in Enstone, UK.',
    seasonProgression: [{ race: 'Australia', points: 4 }, { race: 'China', points: 14 }, { race: 'Japan', points: 22 }, { race: 'Miami', points: 28 }, { race: 'Canada', points: 38 }, { race: 'Monaco', points: 44 }, { race: 'Spain', points: 52 }, { race: 'Austria', points: 57 }, { race: 'Great Britain', points: 60 }],
    livery: 'https://media.formula1.com/image/upload/c_lfill,w_512/q_auto/d_common:f1:2026:fallback:car:2026fallbackcarright.webp/v1740000001/common/f1/2026/alpine/2026alpinecarright.webp'
  },
  { 
    id: 'racing_bulls', 
    name: 'Racing Bulls', 
    logo: flagUrl('it'), 
    principal: 'Laurent Mekies', 
    drivers: ['Liam Lawson', 'Arvid Lindblad'], 
    engine: 'Honda RBPT', 
    points: 59, 
    wins: 0, 
    championships: 0, 
    color: '#03183F',
    historyText: 'Visa Cash App RB F1 Team, based in Faenza, Italy.',
    seasonProgression: [{ race: 'Australia', points: 0 }, { race: 'China', points: 6 }, { race: 'Japan', points: 14 }, { race: 'Miami', points: 22 }, { race: 'Canada', points: 30 }, { race: 'Monaco', points: 36 }, { race: 'Spain', points: 40 }, { race: 'Austria', points: 45 }, { race: 'Great Britain', points: 59 }],
    livery: 'https://media.formula1.com/image/upload/c_lfill,w_512/q_auto/d_common:f1:2026:fallback:car:2026fallbackcarright.webp/v1740000001/common/f1/2026/racingbulls/2026racingbullscarright.webp'
  },
  { 
    id: 'haas', 
    name: 'Haas', 
    logo: flagUrl('us'), 
    principal: 'Ayao Komatsu', 
    drivers: ['Oliver Bearman', 'Esteban Ocon'], 
    engine: 'Ferrari', 
    points: 21, 
    wins: 0, 
    championships: 0, 
    color: '#FFFFFF',
    historyText: 'MoneyGram Haas F1 Team, based in Kannapolis, USA.',
    seasonProgression: [{ race: 'Australia', points: 0 }, { race: 'China', points: 2 }, { race: 'Japan', points: 7 }, { race: 'Miami', points: 9 }, { race: 'Canada', points: 14 }, { race: 'Monaco', points: 16 }, { race: 'Spain', points: 19 }, { race: 'Austria', points: 21 }, { race: 'Great Britain', points: 21 }],
    livery: 'https://media.formula1.com/image/upload/c_lfill,w_512/q_auto/d_common:f1:2026:fallback:car:2026fallbackcarright.webp/v1740000001/common/f1/2026/haasf1team/2026haasf1teamcarright.webp'
  },
  { 
    id: 'williams', 
    name: 'Williams', 
    logo: flagUrl('gb'), 
    principal: 'James Vowles', 
    drivers: ['Carlos Sainz', 'Alexander Albon'], 
    engine: 'Mercedes', 
    points: 11, 
    wins: 0, 
    championships: 9, 
    color: '#005F9E',
    historyText: 'Williams Racing, based in Grove, UK.',
    seasonProgression: [{ race: 'Australia', points: 0 }, { race: 'China', points: 3 }, { race: 'Japan', points: 4 }, { race: 'Miami', points: 7 }, { race: 'Canada', points: 7 }, { race: 'Monaco', points: 7 }, { race: 'Spain', points: 11 }, { race: 'Austria', points: 11 }, { race: 'Great Britain', points: 11 }],
    livery: 'https://media.formula1.com/image/upload/c_lfill,w_512/q_auto/d_common:f1:2026:fallback:car:2026fallbackcarright.webp/v1740000001/common/f1/2026/williams/2026williamscarright.webp'
  },
  { 
    id: 'audi', 
    name: 'Audi', 
    logo: flagUrl('de'), 
    principal: 'Mattia Binotto', 
    drivers: ['Gabriel Bortoleto', 'Nico Hulkenberg'], 
    engine: 'Audi', 
    points: 6, 
    wins: 0, 
    championships: 0, 
    color: '#F30B52',
    historyText: 'Audi F1 Team, based in Neuburg, Germany.',
    seasonProgression: [{ race: 'Australia', points: 0 }, { race: 'China', points: 0 }, { race: 'Japan', points: 0 }, { race: 'Miami', points: 1 }, { race: 'Canada', points: 1 }, { race: 'Monaco', points: 2 }, { race: 'Spain', points: 2 }, { race: 'Austria', points: 2 }, { race: 'Great Britain', points: 6 }],
    livery: 'https://media.formula1.com/image/upload/c_lfill,w_512/q_auto/d_common:f1:2026:fallback:car:2026fallbackcarright.webp/v1740000001/common/f1/2026/audi/2026audicarright.webp'
  },
  { 
    id: 'aston_martin', 
    name: 'Aston Martin', 
    logo: flagUrl('gb'), 
    principal: 'Mike Krack', 
    drivers: ['Fernando Alonso', 'Lance Stroll'], 
    engine: 'Honda', 
    points: 1, 
    wins: 0, 
    championships: 0, 
    color: '#229971',
    historyText: 'Aston Martin Aramco F1 Team, based in Silverstone, UK.',
    seasonProgression: [{ race: 'Australia', points: 0 }, { race: 'China', points: 0 }, { race: 'Japan', points: 0 }, { race: 'Miami', points: 0 }, { race: 'Canada', points: 0 }, { race: 'Monaco', points: 1 }, { race: 'Spain', points: 1 }, { race: 'Austria', points: 1 }, { race: 'Great Britain', points: 1 }],
    livery: 'https://media.formula1.com/image/upload/c_lfill,w_512/q_auto/d_common:f1:2026:fallback:car:2026fallbackcarright.webp/v1740000001/common/f1/2026/astonmartin/2026astonmartincarright.webp'
  },
  { 
    id: 'cadillac', 
    name: 'Cadillac', 
    logo: flagUrl('us'), 
    principal: 'Mario Andretti', 
    drivers: ['Valtteri Bottas', 'Sergio Perez'], 
    engine: 'Ferrari', 
    points: 0, 
    wins: 0, 
    championships: 0, 
    color: '#808080',
    historyText: 'Andretti Cadillac F1 Team, based in Fishers, USA.',
    seasonProgression: [{ race: 'Australia', points: 0 }, { race: 'China', points: 0 }, { race: 'Japan', points: 0 }, { race: 'Miami', points: 0 }, { race: 'Canada', points: 0 }, { race: 'Monaco', points: 0 }, { race: 'Spain', points: 0 }, { race: 'Austria', points: 0 }, { race: 'Great Britain', points: 0 }],
    livery: 'https://media.formula1.com/image/upload/c_lfill,w_512/q_auto/d_common:f1:2026:fallback:car:2026fallbackcarright.webp/v1740000001/common/f1/2026/cadillac/2026cadillaccarright.webp'
  }
];

export const MOCK_CALENDAR: Race[] = [
  { 
    round: 1, 
    gpName: 'Australian Grand Prix', 
    country: 'Australia', 
    flag: flagUrl('au'), 
    status: 'completed', 
    winnerName: 'George Russell', 
    winnerId: 'russell', 
    secondPlaceName: 'Charles Leclerc', 
    thirdPlaceName: 'Lewis Hamilton', 
    poleName: 'George Russell', 
    poleId: 'russell', 
    fastestLapName: 'Max Verstappen', 
    fastestLapId: 'max_verstappen', 
    circuit: { 
      name: 'Albert Park Circuit', 
      length: '5.278 km', 
      laps: 58, 
      recordTime: '1:20.260', 
      recordHolder: 'Charles Leclerc',
      corners: 14,
      avgSpeed: '235 km/h',
      weather: '24°C, Sunny',
      historicalWinners: ['Charles Leclerc (2022)', 'Max Verstappen (2023)', 'George Russell (2026)']
    },
    date: '2026-03-08T05:00:00Z' 
  },
  { 
    round: 2, 
    gpName: 'Chinese Grand Prix', 
    country: 'China', 
    flag: flagUrl('cn'), 
    status: 'completed', 
    winnerName: 'Andrea Kimi Antonelli', 
    winnerId: 'antonelli', 
    secondPlaceName: 'George Russell', 
    thirdPlaceName: 'Lewis Hamilton', 
    poleName: 'Andrea Kimi Antonelli', 
    poleId: 'antonelli', 
    fastestLapName: 'Kimi Antonelli', 
    fastestLapId: 'antonelli', 
    circuit: { 
      name: 'Shanghai International Circuit', 
      length: '5.451 km', 
      laps: 56, 
      recordTime: '1:32.238', 
      recordHolder: 'Michael Schumacher',
      corners: 16,
      avgSpeed: '205 km/h',
      weather: '18°C, Clear',
      historicalWinners: ['Lewis Hamilton (2019)', 'Max Verstappen (2024)', 'Kimi Antonelli (2026)']
    },
    date: '2026-03-15T07:00:00Z' 
  },
  { 
    round: 3, 
    gpName: 'Japanese Grand Prix', 
    country: 'Japan', 
    flag: flagUrl('jp'), 
    status: 'completed', 
    winnerName: 'Andrea Kimi Antonelli', 
    winnerId: 'antonelli', 
    secondPlaceName: 'George Russell', 
    thirdPlaceName: 'Lewis Hamilton', 
    poleName: 'Andrea Kimi Antonelli', 
    poleId: 'antonelli', 
    fastestLapName: 'George Russell', 
    fastestLapId: 'russell', 
    circuit: { 
      name: 'Suzuka International Racing Course', 
      length: '5.807 km', 
      laps: 53, 
      recordTime: '1:30.983', 
      recordHolder: 'Lewis Hamilton',
      corners: 18,
      avgSpeed: '230 km/h',
      weather: '16°C, Cloudy',
      historicalWinners: ['Max Verstappen (2023)', 'Max Verstappen (2024)', 'Kimi Antonelli (2026)']
    },
    date: '2026-03-29T05:00:00Z' 
  },
  { 
    round: 4, 
    gpName: 'Miami Grand Prix', 
    country: 'United States', 
    flag: flagUrl('us'), 
    status: 'completed', 
    winnerName: 'Andrea Kimi Antonelli', 
    winnerId: 'antonelli', 
    secondPlaceName: 'Lando Norris', 
    thirdPlaceName: 'Oscar Piastri', 
    poleName: 'Kimi Antonelli', 
    poleId: 'antonelli', 
    fastestLapName: 'Lando Norris', 
    fastestLapId: 'norris', 
    circuit: { 
      name: 'Miami International Autodrome', 
      length: '5.412 km', 
      laps: 57, 
      recordTime: '1:29.708', 
      recordHolder: 'Max Verstappen',
      corners: 19,
      avgSpeed: '218 km/h',
      weather: '30°C, Hot',
      historicalWinners: ['Max Verstappen (2023)', 'Lando Norris (2024)', 'Kimi Antonelli (2026)']
    },
    date: '2026-05-03T20:00:00Z' 
  },
  { 
    round: 5, 
    gpName: 'Canadian Grand Prix', 
    country: 'Canada', 
    flag: flagUrl('ca'), 
    status: 'completed', 
    winnerName: 'Andrea Kimi Antonelli', 
    winnerId: 'antonelli', 
    secondPlaceName: 'Lewis Hamilton', 
    thirdPlaceName: 'George Russell', 
    poleName: 'George Russell', 
    poleId: 'russell', 
    fastestLapName: 'Lewis Hamilton', 
    fastestLapId: 'hamilton', 
    circuit: { 
      name: 'Circuit Gilles Villeneuve', 
      length: '4.361 km', 
      laps: 70, 
      recordTime: '1:13.078', 
      recordHolder: 'Valtteri Bottas',
      corners: 14,
      avgSpeed: '215 km/h',
      weather: '20°C, Rain Showers',
      historicalWinners: ['Max Verstappen (2023)', 'Max Verstappen (2024)', 'Kimi Antonelli (2026)']
    },
    date: '2026-05-24T13:00:00Z' 
  },
  { 
    round: 6, 
    gpName: 'Monaco Grand Prix', 
    country: 'Monaco', 
    flag: flagUrl('mc'), 
    status: 'completed', 
    winnerName: 'Andrea Kimi Antonelli', 
    winnerId: 'antonelli', 
    secondPlaceName: 'Lewis Hamilton', 
    thirdPlaceName: 'Charles Leclerc', 
    poleName: 'Kimi Antonelli', 
    poleId: 'antonelli', 
    fastestLapName: 'Charles Leclerc', 
    fastestLapId: 'leclerc', 
    circuit: { 
      name: 'Circuit de Monaco', 
      length: '3.337 km', 
      laps: 78, 
      recordTime: '1:12.909', 
      recordHolder: 'Lewis Hamilton',
      corners: 19,
      avgSpeed: '160 km/h',
      weather: '22°C, Warm',
      historicalWinners: ['Max Verstappen (2023)', 'Charles Leclerc (2024)', 'Kimi Antonelli (2026)']
    },
    date: '2026-06-07T13:00:00Z' 
  },
  { 
    round: 7, 
    gpName: 'Spanish Grand Prix', 
    country: 'Spain', 
    flag: flagUrl('es'), 
    status: 'completed', 
    winnerName: 'Lewis Hamilton', 
    winnerId: 'hamilton', 
    secondPlaceName: 'George Russell', 
    thirdPlaceName: 'Lando Norris', 
    poleName: 'Lewis Hamilton', 
    poleId: 'hamilton', 
    fastestLapName: 'George Russell', 
    fastestLapId: 'russell', 
    circuit: { 
      name: 'Circuit de Barcelona-Catalunya', 
      length: '4.657 km', 
      laps: 66, 
      recordTime: '1:16.330', 
      recordHolder: 'Max Verstappen',
      corners: 16,
      avgSpeed: '210 km/h',
      weather: '27°C, Sunny',
      historicalWinners: ['Max Verstappen (2023)', 'Max Verstappen (2024)', 'Lewis Hamilton (2026)']
    },
    date: '2026-06-14T13:00:00Z' 
  },
  { 
    round: 8, 
    gpName: 'Austrian Grand Prix', 
    country: 'Austria', 
    flag: flagUrl('at'), 
    status: 'completed', 
    winnerName: 'George Russell', 
    winnerId: 'russell', 
    secondPlaceName: 'Kimi Antonelli', 
    thirdPlaceName: 'Lewis Hamilton', 
    poleName: 'Kimi Antonelli', 
    poleId: 'antonelli', 
    fastestLapName: 'George Russell', 
    fastestLapId: 'russell', 
    circuit: { 
      name: 'Red Bull Ring', 
      length: '4.318 km', 
      laps: 71, 
      recordTime: '1:05.619', 
      recordHolder: 'Carlos Sainz',
      corners: 10,
      avgSpeed: '240 km/h',
      weather: '25°C, Warm',
      historicalWinners: ['Max Verstappen (2023)', 'George Russell (2024)', 'George Russell (2026)']
    },
    date: '2026-06-28T13:00:00Z' 
  },
  { 
    round: 9, 
    gpName: 'British Grand Prix', 
    country: 'United Kingdom', 
    flag: flagUrl('gb'), 
    status: 'live', 
    winnerName: 'Session Live', 
    winnerId: '', 
    secondPlaceName: '', 
    thirdPlaceName: '', 
    poleName: 'Pending', 
    poleId: '', 
    fastestLapName: '', 
    fastestLapId: '', 
    circuit: { 
      name: 'Silverstone Circuit', 
      length: '5.891 km', 
      laps: 52, 
      recordTime: '1:27.097', 
      recordHolder: 'Max Verstappen (2020)',
      corners: 18,
      avgSpeed: '242 km/h',
      weather: '18°C, Scattered Clouds',
      historicalWinners: ['Lando Norris (2025)', 'Lewis Hamilton (2024)', 'Max Verstappen (2023)']
    },
    date: '2026-07-05T14:00:00Z',
    sessions: [
      { name: 'Practice 1', date: '2026-07-03T11:30:00Z', duration: '1 hour' },
      { name: 'Sprint Qualifying', date: '2026-07-03T15:30:00Z', duration: '1 hour' },
      { name: 'Sprint', date: '2026-07-04T12:00:00Z', duration: '1 hour' },
      { name: 'Qualifying', date: '2026-07-04T15:00:00Z', duration: '1 hour' },
      { name: 'Race', date: '2026-07-05T14:00:00Z', duration: '2 hours' }
    ] 
  },
  { 
    round: 10, 
    gpName: 'Belgian Grand Prix', 
    country: 'Belgium', 
    flag: flagUrl('be'), 
    status: 'upcoming', 
    winnerName: 'TBD', 
    winnerId: '', 
    circuit: { 
      name: 'Circuit de Spa-Francorchamps', 
      length: '7.004 km', 
      laps: 44, 
      recordTime: '1:46.286', 
      recordHolder: 'Valtteri Bottas',
      corners: 19,
      avgSpeed: '230 km/h',
      weather: '16°C, Rainy Risk',
      historicalWinners: ['Max Verstappen (2023)', 'Lewis Hamilton (2024)']
    },
    date: '2026-07-19T13:00:00Z',
    sessions: [
      { name: 'Practice 1', date: '2026-07-17T11:30:00Z', duration: '1 hour' },
      { name: 'Practice 2', date: '2026-07-17T15:00:00Z', duration: '1 hour' },
      { name: 'Practice 3', date: '2026-07-18T10:30:00Z', duration: '1 hour' },
      { name: 'Qualifying', date: '2026-07-18T14:00:00Z', duration: '1 hour' },
      { name: 'Race', date: '2026-07-19T13:00:00Z', duration: '2 hours' }
    ]
  },
  { 
    round: 11, 
    gpName: 'Hungarian Grand Prix', 
    country: 'Hungary', 
    flag: flagUrl('hu'), 
    status: 'upcoming', 
    winnerName: 'TBD', 
    winnerId: '', 
    circuit: { 
      name: 'Hungaroring', 
      length: '4.381 km', 
      laps: 70, 
      recordTime: '1:16.627', 
      recordHolder: 'Lewis Hamilton',
      corners: 14,
      avgSpeed: '190 km/h',
      weather: '29°C, Sunny',
      historicalWinners: ['Max Verstappen (2023)', 'Oscar Piastri (2024)']
    },
    date: '2026-07-26T13:00:00Z' 
  },
  { 
    round: 12, 
    gpName: 'Dutch Grand Prix', 
    country: 'Netherlands', 
    flag: flagUrl('nl'), 
    status: 'upcoming', 
    winnerName: 'TBD', 
    winnerId: '', 
    circuit: { 
      name: 'Circuit Zandvoort', 
      length: '4.259 km', 
      laps: 72, 
      recordTime: '1:11.097', 
      recordHolder: 'Lewis Hamilton',
      corners: 14,
      avgSpeed: '204 km/h',
      weather: '21°C, Windy',
      historicalWinners: ['Max Verstappen (2023)', 'Lando Norris (2024)']
    },
    date: '2026-08-23T13:00:00Z' 
  },
  { 
    round: 13, 
    gpName: 'Italian Grand Prix', 
    country: 'Italy', 
    flag: flagUrl('it'), 
    status: 'upcoming', 
    winnerName: 'TBD', 
    winnerId: '', 
    circuit: { 
      name: 'Monza Circuit', 
      length: '5.793 km', 
      laps: 53, 
      recordTime: '1:18.887', 
      recordHolder: 'Lewis Hamilton',
      corners: 11,
      avgSpeed: '255 km/h',
      weather: '26°C, Sunny',
      historicalWinners: ['Max Verstappen (2023)', 'Charles Leclerc (2024)']
    },
    date: '2026-09-06T13:00:00Z' 
  },
  { 
    round: 14, 
    gpName: 'Spanish Grand Prix (Madrid)', 
    country: 'Spain', 
    flag: flagUrl('es'), 
    status: 'upcoming', 
    winnerName: 'TBD', 
    winnerId: '', 
    circuit: { 
      name: 'Madrid Street Circuit', 
      length: '5.474 km', 
      laps: 55, 
      recordTime: 'TBD', 
      recordHolder: 'New Circuit',
      corners: 20,
      avgSpeed: '215 km/h',
      weather: '24°C, Clear',
      historicalWinners: ['Inaugural Race (2026)']
    },
    date: '2026-09-13T13:00:00Z' 
  },
  { 
    round: 15, 
    gpName: 'Azerbaijan Grand Prix', 
    country: 'Azerbaijan', 
    flag: flagUrl('az'), 
    status: 'upcoming', 
    winnerName: 'TBD', 
    winnerId: '', 
    circuit: { 
      name: 'Baku City Circuit', 
      length: '6.003 km', 
      laps: 51, 
      recordTime: '1:43.009', 
      recordHolder: 'Charles Leclerc',
      corners: 20,
      avgSpeed: '205 km/h',
      weather: '23°C, Sunny',
      historicalWinners: ['Sergio Perez (2023)', 'Oscar Piastri (2024)']
    },
    date: '2026-09-26T11:00:00Z' 
  },
  { 
    round: 16, 
    gpName: 'Singapore Grand Prix', 
    country: 'Singapore', 
    flag: flagUrl('sg'), 
    status: 'upcoming', 
    winnerName: 'TBD', 
    winnerId: '', 
    circuit: { 
      name: 'Marina Bay Street Circuit', 
      length: '4.940 km', 
      laps: 62, 
      recordTime: '1:35.867', 
      recordHolder: 'Lewis Hamilton',
      corners: 19,
      avgSpeed: '185 km/h',
      weather: '29°C, Night Race Humid',
      historicalWinners: ['Carlos Sainz (2023)', 'Lando Norris (2024)']
    },
    date: '2026-10-11T12:00:00Z' 
  },
  { 
    round: 17, 
    gpName: 'United States Grand Prix', 
    country: 'United States', 
    flag: flagUrl('us'), 
    status: 'upcoming', 
    winnerName: 'TBD', 
    winnerId: '', 
    circuit: { 
      name: 'Circuit of the Americas', 
      length: '5.513 km', 
      laps: 56, 
      recordTime: '1:36.169', 
      recordHolder: 'Charles Leclerc',
      corners: 20,
      avgSpeed: '220 km/h',
      weather: '24°C, Sunny',
      historicalWinners: ['Max Verstappen (2023)', 'Charles Leclerc (2024)']
    },
    date: '2026-10-25T19:00:00Z' 
  },
  { 
    round: 18, 
    gpName: 'Las Vegas Grand Prix', 
    country: 'United States', 
    flag: flagUrl('us'), 
    status: 'upcoming', 
    winnerName: 'TBD', 
    winnerId: '', 
    circuit: { 
      name: 'Las Vegas Strip Circuit', 
      length: '6.201 km', 
      laps: 50, 
      recordTime: '1:35.490', 
      recordHolder: 'Oscar Piastri',
      corners: 17,
      avgSpeed: '237 km/h',
      weather: '14°C, Cold Night Race',
      historicalWinners: ['Max Verstappen (2023)', 'George Russell (2024)']
    },
    date: '2026-11-21T06:00:00Z' 
  },
  { 
    round: 19, 
    gpName: 'Qatar Grand Prix', 
    country: 'Qatar', 
    flag: flagUrl('qa'), 
    status: 'upcoming', 
    winnerName: 'TBD', 
    winnerId: '', 
    circuit: { 
      name: 'Lusail International Circuit', 
      length: '5.419 km', 
      laps: 57, 
      recordTime: '1:24.319', 
      recordHolder: 'Max Verstappen',
      corners: 16,
      avgSpeed: '230 km/h',
      weather: '28°C, Dry Desert',
      historicalWinners: ['Max Verstappen (2023)', 'Max Verstappen (2024)']
    },
    date: '2026-11-29T17:00:00Z' 
  },
  { 
    round: 20, 
    gpName: 'Abu Dhabi Grand Prix', 
    country: 'United Arab Emirates', 
    flag: flagUrl('ae'), 
    status: 'upcoming', 
    winnerName: 'TBD', 
    winnerId: '', 
    circuit: { 
      name: 'Yas Marina Circuit', 
      length: '5.281 km', 
      laps: 58, 
      recordTime: '1:26.103', 
      recordHolder: 'Max Verstappen',
      corners: 16,
      avgSpeed: '220 km/h',
      weather: '25°C, Clear Night',
      historicalWinners: ['Max Verstappen (2023)', 'Max Verstappen (2024)']
    }, 
    date: '2026-12-06T13:00:00Z' 
  }
];

export const MOCK_NEWS: NewsArticle[] = [
  { 
    id: '1', 
    title: 'Antonelli secures sensational maiden pole for the British Grand Prix', 
    summary: 'Mercedes rookie Andrea Kimi Antonelli mastered changing conditions at Silverstone to secure his first ever Formula 1 pole position ahead of Charles Leclerc and Lewis Hamilton.', 
    category: 'Racing', 
    readTime: '3 min read', 
    source: 'Formula1.com', 
    date: 'Jul 4, 2026' 
  },
  { 
    id: '2', 
    title: 'Gasly hit with 50-place grid penalty after Alpine power unit changes', 
    summary: "Alpine's Pierre Gasly is set to start the British Grand Prix from the back of the grid after the team opted to change multiple power unit elements on his car.", 
    category: 'Paddock', 
    readTime: '2 min read', 
    source: 'Formula1.com', 
    date: 'Jul 4, 2026' 
  },
  { 
    id: '3', 
    title: 'Wolff reacts to intense qualifying battle and Silver Arrows front-row pace', 
    summary: "Toto Wolff praised his team's rapid developmental progress as Mercedes locks out the front of the grid, pointing out the incredible progression of rookie Kimi Antonelli.", 
    category: 'Tech', 
    readTime: '4 min read', 
    source: 'Formula1.com', 
    date: 'Jul 4, 2026' 
  },
  { 
    id: '4', 
    title: 'Audi bring comprehensive aero upgrade package to Silverstone in search of points', 
    summary: 'Audi F1 Team introduced a significantly revised sidepod entry and floor geometry at the British GP in their bid to score their first points of the 2026 season.', 
    category: 'Tech', 
    readTime: '5 min read', 
    source: 'Formula1.com', 
    date: 'Jul 3, 2026' 
  }
];

export const MOCK_WEATHER: WeatherInfo = {
  temperature: '22°C',
  trackTemp: '34°C',
  windSpeed: '12 km/h NW',
  rainProbability: '10%',
  humidity: '55%'
};

// Caching structure
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL = 1000 * 60 * 60; // 1 Hour

function getCached<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(`f1_cache_${key}`);
  if (!raw) return null;
  try {
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp < CACHE_TTL) {
      return entry.data;
    }
  } catch (e) {
    // Ignore cache error
  }
  return null;
}

function setCache<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    localStorage.setItem(`f1_cache_${key}`, JSON.stringify(entry));
  } catch (e) {
    // Ignore cache writing error
  }
}

// Global API Client wrapper
const API_BASE = process.env.NEXT_PUBLIC_F1_API_URL || 'https://api.jolpica.info/ergast/v1';

async function fetchWithRetry<T>(url: string, retries = 2): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error code ${res.status}`);
    return await res.json() as T;
  } catch (err) {
    if (retries > 0) {
      console.warn(`Fetch failed. Retrying... (${retries} left)`);
      return fetchWithRetry(url, retries - 1);
    }
    throw err;
  }
}

export const f1ApiService = {
  getDrivers: async (): Promise<Driver[]> => {
    if (typeof window !== 'undefined') {
      const dynamic = localStorage.getItem('f1_drivers_dynamic');
      if (dynamic) return JSON.parse(dynamic);
    }
    return MOCK_DRIVERS;
  },

  getConstructors: async (): Promise<Constructor[]> => {
    if (typeof window !== 'undefined') {
      const dynamic = localStorage.getItem('f1_constructors_dynamic');
      if (dynamic) return JSON.parse(dynamic);
    }
    return MOCK_CONSTRUCTORS;
  },

  getCalendar: async (): Promise<Race[]> => {
    const ensureSessions = (race: Race): Race => {
      if (race.sessions && race.sessions.length > 0) return race;
      
      const raceDate = new Date(race.date);
      if (isNaN(raceDate.getTime())) return race;
      
      const friday = new Date(raceDate);
      friday.setDate(raceDate.getDate() - 2);
      
      const saturday = new Date(raceDate);
      saturday.setDate(raceDate.getDate() - 1);
      
      const fStr = friday.toISOString().split('T')[0];
      const sStr = saturday.toISOString().split('T')[0];
      
      return {
        ...race,
        sessions: [
          { name: 'Practice 1', date: `${fStr}T11:30:00Z`, duration: '1 hour' },
          { name: 'Practice 2', date: `${fStr}T15:00:00Z`, duration: '1 hour' },
          { name: 'Practice 3', date: `${sStr}T10:30:00Z`, duration: '1 hour' },
          { name: 'Qualifying', date: `${sStr}T14:00:00Z`, duration: '1 hour' },
          { name: 'Race', date: race.date, duration: '2 hours' }
        ]
      };
    };

    const applyDynamicStatus = (racesList: Race[]): Race[] => {
      const now = Date.now();
      return racesList.map(r => {
        const raceStartTime = new Date(r.date).getTime();
        if (isNaN(raceStartTime)) return r;
        const raceEndTime = raceStartTime + 2 * 60 * 60 * 1000;
        
        let status = r.status;
        let winnerName = r.winnerName;
        let winnerId = r.winnerId;
        let secondPlaceName = r.secondPlaceName;
        let thirdPlaceName = r.thirdPlaceName;
        let poleName = r.poleName;
        let poleId = r.poleId;
        let fastestLapName = r.fastestLapName;
        let fastestLapId = r.fastestLapId;

        if (r.round < 9 || now > raceEndTime) {
          status = 'completed';
          if (r.round === 9) {
            if (!winnerName || winnerName === 'Session Live' || winnerName === 'TBD') {
              winnerName = 'Charles Leclerc';
              winnerId = 'leclerc';
            }
            if (!secondPlaceName) secondPlaceName = 'George Russell';
            if (!thirdPlaceName) thirdPlaceName = 'Lewis Hamilton';
            if (poleName === 'Pending' || !poleName) {
              poleName = 'Andrea Kimi Antonelli';
              poleId = 'antonelli';
            }
            if (!fastestLapName) {
              fastestLapName = 'Andrea Kimi Antonelli';
              fastestLapId = 'antonelli';
            }
          }
        } else if (now >= raceStartTime && now <= raceEndTime) {
          status = 'live';
        } else {
          status = 'upcoming';
        }

        return {
          ...r,
          status,
          winnerName,
          winnerId,
          secondPlaceName,
          thirdPlaceName,
          poleName,
          poleId,
          fastestLapName,
          fastestLapId
        };
      });
    };

    if (typeof window !== 'undefined') {
      const dynamic = localStorage.getItem('f1_calendar_dynamic');
      if (dynamic) return applyDynamicStatus(JSON.parse(dynamic).map(ensureSessions));
    }

    return applyDynamicStatus(MOCK_CALENDAR.map(ensureSessions));
  },

  getNews: async (): Promise<NewsArticle[]> => {
    try {
      const res = await fetch('/api/news');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch (err) {
      console.error('Failed to fetch live RSS news, falling back to mock news', err);
    }
    return MOCK_NEWS;
  },

  getWeather: async (): Promise<WeatherInfo> => {
    return MOCK_WEATHER;
  }
};
