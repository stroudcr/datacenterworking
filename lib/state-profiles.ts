import { getStateSlug } from '@/lib/locations';

export interface StateProfile {
  abbreviation: string;
  name: string;
  accentFrom: string;
  accentTo: string;
  energy: string;
  climate: string;
  workforce: string;
}

export interface StateFaq {
  question: string;
  answer: string;
}

type StateProfileSeed = Omit<StateProfile, 'abbreviation' | 'name'>;

/**
 * State-specific editorial inputs for the evergreen career guides.
 *
 * These intentionally avoid volatile company and city claims. Energy context is
 * reviewed against EIA state profiles, climate context against NOAA state
 * summaries, and workforce context against BLS state occupational profiles.
 */
const STATE_PROFILE_SEEDS: Record<string, StateProfileSeed> = {
  AL: {
    accentFrom: '#4cc9f0', accentTo: '#f25f5c',
    energy: 'Alabama combines natural gas, nuclear generation, hydroelectric power, and other resources, giving critical-facilities teams a varied power-system context.',
    climate: 'Hot, humid summers, severe thunderstorms, and tropical-weather exposure make cooling performance, backup power, and emergency procedures especially relevant.',
    workforce: 'Advanced manufacturing, aerospace, automotive production, utilities, and military experience can transfer into electrical, mechanical, controls, logistics, and operations roles.',
  },
  AK: {
    accentFrom: '#4cc9f0', accentTo: '#ffd166',
    energy: 'Alaska relies on a mix of natural gas, petroleum, hydroelectric power, and isolated local grids, making energy resilience a practical operating concern.',
    climate: 'Long cold seasons, large temperature swings, snow, ice, and geographic isolation put added emphasis on weatherization, maintenance planning, and dependable backup systems.',
    workforce: 'Oil and gas, maritime, aviation, utilities, construction, and military backgrounds can translate well to power, facilities, communications, and remote operations work.',
  },
  AZ: {
    accentFrom: '#38bdf8', accentTo: '#ff7b54',
    energy: 'Arizona uses a mix that includes natural gas, nuclear power, and rapidly growing solar generation, creating a useful setting for power and energy-management skills.',
    climate: 'Extreme summer heat, dust, and monsoon storms make efficient cooling, air filtration, water awareness, and heat-ready maintenance central operating themes.',
    workforce: 'Semiconductor manufacturing, aerospace, utilities, construction, logistics, and technical services provide transferable experience for facilities and infrastructure teams.',
  },
  AR: {
    accentFrom: '#4cc9f0', accentTo: '#ef476f',
    energy: 'Arkansas draws on natural gas, coal, nuclear, and hydroelectric generation, so applicants benefit from understanding multiple power and reliability systems.',
    climate: 'Humid summers, strong thunderstorms, tornadoes, flooding, and occasional winter weather reward disciplined preventive maintenance and emergency readiness.',
    workforce: 'Manufacturing, transportation, food processing, utilities, construction, and military service build skills that transfer into maintenance, controls, safety, and operations.',
  },
  CA: {
    accentFrom: '#38bdf8', accentTo: '#f4d35e',
    energy: 'California combines natural gas, solar, hydroelectric, wind, geothermal, and other generation while operating under detailed energy-efficiency requirements.',
    climate: 'Heat, drought, wildfire smoke, earthquakes, and varied coastal and inland conditions make resilience planning, filtration, water strategy, and seismic awareness important.',
    workforce: 'Technology, semiconductor, entertainment infrastructure, aerospace, advanced manufacturing, utilities, and construction support a broad range of transferable technical skills.',
  },
  CO: {
    accentFrom: '#38bdf8', accentTo: '#f72585',
    energy: 'Colorado is transitioning across natural gas, wind, solar, coal, and other resources, creating demand for flexible power, controls, and energy-management knowledge.',
    climate: 'Altitude, dry air, large temperature swings, snow, hail, wildfire smoke, and severe storms shape cooling, filtration, and continuity planning.',
    workforce: 'Aerospace, technology, energy, telecommunications, advanced manufacturing, utilities, and military experience can transfer into infrastructure and reliability roles.',
  },
  CT: {
    accentFrom: '#60a5fa', accentTo: '#f8fafc',
    energy: 'Connecticut relies heavily on nuclear and natural-gas generation within the interconnected New England grid, keeping power quality and regional reliability in focus.',
    climate: 'Humid summers, freezing winters, coastal storms, heavy rain, and snow require year-round HVAC readiness and tested emergency-power procedures.',
    workforce: 'Aerospace, defense manufacturing, insurance technology, utilities, life sciences, and skilled trades provide strong pathways into technical and operational work.',
  },
  DE: {
    accentFrom: '#60a5fa', accentTo: '#f59e0b',
    energy: 'Delaware participates in the wider regional power market and uses natural gas, solar, and imported electricity, making grid coordination and backup systems relevant.',
    climate: 'Humid summers, coastal storms, flooding, salt air, and occasional snow put attention on moisture control, corrosion prevention, and business continuity.',
    workforce: 'Chemicals, financial services, logistics, manufacturing, utilities, and construction offer transferable experience in process control, compliance, safety, and maintenance.',
  },
  FL: {
    accentFrom: '#22d3ee', accentTo: '#f97316',
    energy: 'Florida uses substantial natural-gas generation alongside nuclear and growing solar resources, placing continuous power and storm restoration at the center of reliability planning.',
    climate: 'High heat, humidity, lightning, flooding, salt air, and hurricanes make cooling, moisture management, generators, fuel planning, and emergency response essential.',
    workforce: 'Aerospace, defense, tourism infrastructure, utilities, construction, logistics, and maritime work develop valuable operations, electrical, mechanical, and customer-support skills.',
  },
  GA: {
    accentFrom: '#4cc9f0', accentTo: '#ef476f',
    energy: 'Georgia combines natural gas, nuclear, solar, hydroelectric, and other generation, offering a broad critical-power environment for facilities professionals.',
    climate: 'Long humid summers, thunderstorms, tornadoes, flooding, and tropical-weather effects make cooling capacity, backup power, and emergency planning important.',
    workforce: 'Advanced manufacturing, logistics, film production infrastructure, utilities, aerospace, and military backgrounds transfer into facilities, network, security, and operations roles.',
  },
  HI: {
    accentFrom: '#22d3ee', accentTo: '#f472b6',
    energy: 'Hawaii is balancing petroleum-based generation with expanding solar, wind, storage, and other renewable resources across island grids.',
    climate: 'Warm humid conditions, salt air, tropical storms, volcanic hazards, and island logistics emphasize corrosion control, spares planning, cooling efficiency, and self-sufficiency.',
    workforce: 'Military, hospitality infrastructure, utilities, maritime, telecommunications, construction, and renewable-energy experience can transfer into resilient facility operations.',
  },
  ID: {
    accentFrom: '#38bdf8', accentTo: '#84cc16',
    energy: 'Idaho benefits from substantial hydroelectric generation along with wind, natural gas, and other resources, giving power and water systems a visible role.',
    climate: 'Cold winters, hot dry summers, snow, wildfire smoke, and varied elevation make economization, filtration, freeze protection, and seasonal maintenance important.',
    workforce: 'Semiconductor, food processing, agriculture technology, energy, utilities, construction, and manufacturing provide transferable controls and maintenance experience.',
  },
  IL: {
    accentFrom: '#38bdf8', accentTo: '#ef476f',
    energy: 'Illinois has a major nuclear fleet alongside wind, natural gas, coal, and solar, creating a diverse setting for critical-power and energy-management work.',
    climate: 'Hot humid summers, freezing winters, thunderstorms, tornadoes, and ice require facilities to perform across wide seasonal extremes.',
    workforce: 'Manufacturing, transportation, finance technology, utilities, construction, telecommunications, and logistics build relevant electrical, mechanical, network, and operations skills.',
  },
  IN: {
    accentFrom: '#60a5fa', accentTo: '#facc15',
    energy: 'Indiana is transitioning from a coal-heavy system toward more natural gas, wind, solar, storage, and other resources, increasing the value of adaptable power skills.',
    climate: 'Humid summers, cold winters, severe thunderstorms, tornadoes, flooding, and ice make preventive maintenance and all-season resilience important.',
    workforce: 'Automotive, steel, advanced manufacturing, logistics, utilities, construction, and life sciences offer strong pathways into industrial maintenance and facility operations.',
  },
  IA: {
    accentFrom: '#60a5fa', accentTo: '#ef476f',
    energy: 'Iowa is a national wind-generation leader and also uses natural gas, coal, solar, and other resources, making grid variability and energy management relevant.',
    climate: 'Hot humid summers, very cold winters, strong winds, tornadoes, flooding, and ice require robust HVAC, envelope, and emergency-power planning.',
    workforce: 'Advanced manufacturing, agriculture technology, food processing, insurance technology, utilities, and construction develop useful automation and maintenance skills.',
  },
  KS: {
    accentFrom: '#38bdf8', accentTo: '#f59e0b',
    energy: 'Kansas combines extensive wind generation with nuclear, natural gas, coal, solar, and other resources, supporting varied power and controls experience.',
    climate: 'Heat, cold, high winds, severe thunderstorms, tornadoes, hail, drought, and ice place a premium on structural, cooling, and continuity readiness.',
    workforce: 'Aviation, agriculture, energy, manufacturing, utilities, telecommunications, and military backgrounds can transfer into critical-facilities and network work.',
  },
  KY: {
    accentFrom: '#60a5fa', accentTo: '#f8fafc',
    energy: 'Kentucky continues to use coal while adding natural gas, hydroelectric, solar, and other resources, so power-system transition and reliability are practical themes.',
    climate: 'Humid summers, variable winters, flooding, severe storms, tornadoes, and ice make water management and emergency procedures important.',
    workforce: 'Automotive, aerospace, logistics, manufacturing, utilities, mining, and construction provide transferable electrical, mechanical, safety, and operations experience.',
  },
  LA: {
    accentFrom: '#38bdf8', accentTo: '#f59e0b',
    energy: 'Louisiana has substantial natural-gas generation alongside nuclear and other resources, connecting data center reliability with a deep energy workforce.',
    climate: 'Extreme humidity, heat, hurricanes, flooding, lightning, and salt exposure make moisture control, cooling, backup generation, and disaster planning central concerns.',
    workforce: 'Energy, petrochemicals, maritime, ports, utilities, construction, and process manufacturing build valuable controls, safety, maintenance, and logistics skills.',
  },
  ME: {
    accentFrom: '#38bdf8', accentTo: '#22c55e',
    energy: 'Maine uses hydroelectric, wind, biomass, natural gas, and other resources within the New England grid, giving renewable and regional power coordination added relevance.',
    climate: 'Long cold winters, snow, ice, coastal storms, salt air, and forest smoke make freeze protection, economization, generators, and access planning important.',
    workforce: 'Maritime, forestry products, advanced materials, utilities, telecommunications, construction, and defense manufacturing provide transferable technical experience.',
  },
  MD: {
    accentFrom: '#facc15', accentTo: '#ef4444',
    energy: 'Maryland combines nuclear, natural gas, solar, imported electricity, and other resources within the regional PJM power market.',
    climate: 'Humid summers, coastal flooding, tropical systems, thunderstorms, and occasional snow make moisture management and tested continuity plans important.',
    workforce: 'Cybersecurity, defense, life sciences, government technology, utilities, construction, and telecommunications offer broad pathways into secure infrastructure work.',
  },
  MA: {
    accentFrom: '#60a5fa', accentTo: '#f8fafc',
    energy: 'Massachusetts relies on the New England grid, natural gas, solar, offshore-wind development, imports, and efficiency programs, keeping energy management prominent.',
    climate: 'Humid summers, cold winters, nor\'easters, coastal flooding, snow, and ice require flexible HVAC operation and winter-ready backup systems.',
    workforce: 'Technology, robotics, life sciences, advanced manufacturing, education, utilities, and construction support strong engineering and technician pipelines.',
  },
  MI: {
    accentFrom: '#38bdf8', accentTo: '#facc15',
    energy: 'Michigan combines nuclear, natural gas, coal, wind, solar, and other resources, giving critical-power teams experience across a changing generation mix.',
    climate: 'Cold winters, lake-effect snow, ice, humid summers, storms, and flooding make winterization, heat recovery, drainage, and reliable access important.',
    workforce: 'Automotive, mobility, advanced manufacturing, battery technology, utilities, construction, and industrial automation transfer directly into facilities and controls roles.',
  },
  MN: {
    accentFrom: '#38bdf8', accentTo: '#a78bfa',
    energy: 'Minnesota uses wind, nuclear, natural gas, solar, and other resources, creating a varied power and sustainability context for infrastructure teams.',
    climate: 'Very cold winters, snow, ice, summer heat and humidity, severe storms, and flooding reward heat recovery, freeze protection, and resilient maintenance.',
    workforce: 'Medical technology, manufacturing, agriculture technology, utilities, construction, finance technology, and industrial controls offer transferable skills.',
  },
  MS: {
    accentFrom: '#f97316', accentTo: '#38bdf8',
    energy: 'Mississippi relies largely on natural gas and nuclear generation with other resources in the mix, supporting careers in power, electrical, and mechanical reliability.',
    climate: 'Long hot humid seasons, hurricanes, tornadoes, flooding, and severe storms make cooling, moisture control, and emergency power especially important.',
    workforce: 'Shipbuilding, aerospace, automotive, energy, utilities, agriculture processing, and construction provide relevant safety, maintenance, and operations experience.',
  },
  MO: {
    accentFrom: '#38bdf8', accentTo: '#ef476f',
    energy: 'Missouri uses coal, nuclear, wind, natural gas, solar, and hydroelectric resources, giving facilities teams a diverse power-system backdrop.',
    climate: 'Hot humid summers, cold winters, tornadoes, severe thunderstorms, flooding, and ice demand strong seasonal maintenance and emergency readiness.',
    workforce: 'Aerospace, automotive, logistics, financial technology, utilities, construction, and manufacturing offer transferable electrical, network, and operations skills.',
  },
  MT: {
    accentFrom: '#38bdf8', accentTo: '#facc15',
    energy: 'Montana combines hydroelectric, wind, coal, natural gas, and other resources, connecting critical-power work with a strong energy and utility base.',
    climate: 'Cold winters, heavy snow, high winds, wildfire smoke, dry summers, and large temperature swings make winterization and filtration essential.',
    workforce: 'Energy, mining, agriculture, forestry, utilities, telecommunications, construction, and military experience can translate into resilient infrastructure operations.',
  },
  NE: {
    accentFrom: '#38bdf8', accentTo: '#ef476f',
    energy: 'Nebraska uses coal, wind, nuclear, natural gas, hydroelectric, and other resources, creating opportunities for broad electrical and power-operations knowledge.',
    climate: 'Hot summers, very cold winters, high winds, tornadoes, hail, drought, flooding, and ice require facilities built for wide operating extremes.',
    workforce: 'Agriculture technology, food processing, manufacturing, finance technology, utilities, telecommunications, and construction offer useful automation and maintenance backgrounds.',
  },
  NV: {
    accentFrom: '#38bdf8', accentTo: '#f97316',
    energy: 'Nevada combines natural gas with substantial solar, geothermal, hydroelectric, and other resources, making energy and water efficiency visible operating concerns.',
    climate: 'Extreme heat, dry air, dust, drought, wildfire smoke, and large daily temperature swings emphasize cooling efficiency, filtration, and water-aware design.',
    workforce: 'Hospitality infrastructure, mining, logistics, renewable energy, utilities, construction, and technology operations offer transferable facility and customer-service skills.',
  },
  NH: {
    accentFrom: '#60a5fa', accentTo: '#facc15',
    energy: 'New Hampshire relies on nuclear power along with hydroelectric, natural gas, biomass, wind, solar, and regional imports.',
    climate: 'Cold snowy winters, ice, nor\'easters, humid summers, flooding, and high winds make winterization and backup-power testing essential.',
    workforce: 'Advanced manufacturing, defense electronics, technology, utilities, construction, life sciences, and skilled trades support technical infrastructure careers.',
  },
  NJ: {
    accentFrom: '#facc15', accentTo: '#60a5fa',
    energy: 'New Jersey combines nuclear, natural gas, solar, imported electricity, and emerging offshore-wind resources within the regional power market.',
    climate: 'Humid summers, coastal storms, flooding, salt air, snow, and extreme rainfall make drainage, corrosion control, and continuity planning important.',
    workforce: 'Pharmaceuticals, telecommunications, financial technology, logistics, utilities, construction, and advanced manufacturing offer relevant regulated-operations experience.',
  },
  NM: {
    accentFrom: '#facc15', accentTo: '#ef4444',
    energy: 'New Mexico has strong wind and solar resources alongside natural gas and other generation, making grid integration and energy management valuable skills.',
    climate: 'High elevation, dry air, intense sun, dust, wildfire smoke, monsoon storms, and large temperature swings shape cooling and filtration strategies.',
    workforce: 'National-laboratory work, aerospace, defense, energy, semiconductor, utilities, construction, and military experience can transfer into secure technical operations.',
  },
  NY: {
    accentFrom: '#38bdf8', accentTo: '#f59e0b',
    energy: 'New York combines hydroelectric, natural gas, nuclear, wind, solar, and imported power across a large and varied electric system.',
    climate: 'Conditions range from humid summers and coastal storms to heavy snow, ice, flooding, and cold inland winters, demanding flexible regional resilience.',
    workforce: 'Finance technology, semiconductor, media infrastructure, advanced manufacturing, utilities, construction, telecommunications, and skilled trades support many career pathways.',
  },
  NC: {
    accentFrom: '#38bdf8', accentTo: '#ef476f',
    energy: 'North Carolina combines nuclear, natural gas, solar, hydroelectric, and other resources, creating a strong setting for power and energy-management experience.',
    climate: 'Hot humid summers, hurricanes, flooding, thunderstorms, and mountain winter weather make cooling and disaster readiness important across the state.',
    workforce: 'Advanced manufacturing, life sciences, finance technology, aerospace, utilities, construction, and military backgrounds transfer into technical and secure operations.',
  },
  ND: {
    accentFrom: '#60a5fa', accentTo: '#facc15',
    energy: 'North Dakota combines coal, wind, natural gas, hydroelectric, and other resources, connecting data center reliability with a deep energy workforce.',
    climate: 'Very cold winters, blizzards, high winds, flooding, summer heat, and large temperature swings place emphasis on winterization and dependable access.',
    workforce: 'Energy, agriculture technology, utilities, construction, manufacturing, telecommunications, and logistics offer transferable industrial and maintenance experience.',
  },
  OH: {
    accentFrom: '#38bdf8', accentTo: '#ef476f',
    energy: 'Ohio uses natural gas, coal, nuclear, wind, solar, and other resources, creating a changing power landscape for critical-infrastructure teams.',
    climate: 'Humid summers, cold winters, severe storms, tornadoes, flooding, snow, and ice require broad seasonal operating readiness.',
    workforce: 'Advanced manufacturing, automotive, aerospace, logistics, financial services, utilities, construction, and skilled trades provide strong transfer pathways.',
  },
  OK: {
    accentFrom: '#38bdf8', accentTo: '#f59e0b',
    energy: 'Oklahoma combines extensive wind generation with natural gas, coal, solar, and other resources, supporting power and controls careers.',
    climate: 'Heat, drought, high winds, severe thunderstorms, tornadoes, hail, ice, and rapid weather changes make robust emergency procedures essential.',
    workforce: 'Energy, aerospace, aviation maintenance, manufacturing, agriculture, utilities, construction, and military service translate well into infrastructure roles.',
  },
  OR: {
    accentFrom: '#38bdf8', accentTo: '#22c55e',
    energy: 'Oregon benefits from substantial hydroelectric generation alongside wind, natural gas, solar, and other resources, keeping power and water systems closely linked.',
    climate: 'Wet coastal winters, snow and cold inland, summer heat, drought, wildfire smoke, and seismic risk require varied regional resilience planning.',
    workforce: 'Semiconductor, clean technology, forestry products, utilities, advanced manufacturing, construction, and software infrastructure offer transferable technical skills.',
  },
  PA: {
    accentFrom: '#38bdf8', accentTo: '#facc15',
    energy: 'Pennsylvania combines natural gas, nuclear, coal, wind, solar, hydroelectric, and other resources within the regional PJM market.',
    climate: 'Humid summers, cold winters, snow, ice, flooding, and severe storms demand reliable HVAC and tested backup systems.',
    workforce: 'Energy, manufacturing, health technology, logistics, utilities, construction, telecommunications, and skilled trades support broad critical-infrastructure pathways.',
  },
  RI: {
    accentFrom: '#60a5fa', accentTo: '#facc15',
    energy: 'Rhode Island relies on natural gas, offshore-wind development, solar, and regional electricity flows within the New England grid.',
    climate: 'Coastal storms, salt air, flooding, humid summers, snow, and high winds make corrosion control and continuity planning especially relevant.',
    workforce: 'Maritime, defense, advanced manufacturing, health technology, utilities, construction, and design engineering offer useful technical backgrounds.',
  },
  SC: {
    accentFrom: '#38bdf8', accentTo: '#f8fafc',
    energy: 'South Carolina relies heavily on nuclear power alongside natural gas, hydroelectric, solar, and other resources, creating a strong critical-power context.',
    climate: 'Hot humid summers, hurricanes, flooding, lightning, and salt exposure make cooling, moisture control, and emergency power central operating concerns.',
    workforce: 'Automotive, aerospace, advanced manufacturing, ports, utilities, construction, and military backgrounds translate into facilities and operations careers.',
  },
  SD: {
    accentFrom: '#38bdf8', accentTo: '#facc15',
    energy: 'South Dakota combines wind and hydroelectric generation with natural gas, coal, solar, and other resources, making renewable integration relevant.',
    climate: 'Very cold winters, summer heat, high winds, blizzards, hail, tornadoes, and flooding require facilities designed for wide weather extremes.',
    workforce: 'Agriculture technology, finance services, energy, utilities, manufacturing, construction, and telecommunications offer transferable operations and automation skills.',
  },
  TN: {
    accentFrom: '#38bdf8', accentTo: '#ef476f',
    energy: 'Tennessee combines nuclear, hydroelectric, natural gas, solar, and other resources within the Tennessee Valley power system.',
    climate: 'Hot humid summers, severe storms, tornadoes, flooding, and occasional winter ice make cooling and emergency readiness important.',
    workforce: 'Automotive, advanced manufacturing, logistics, healthcare technology, utilities, construction, and music-production infrastructure offer varied technical pathways.',
  },
  TX: {
    accentFrom: '#38bdf8', accentTo: '#ef476f',
    energy: 'Texas has a large and diverse power system spanning natural gas, wind, solar, nuclear, coal, storage, and other resources.',
    climate: 'Extreme heat, drought, hurricanes, flooding, hail, tornadoes, dust, and winter cold snaps make grid, cooling, water, and continuity planning highly visible.',
    workforce: 'Energy, semiconductor, aerospace, telecommunications, construction, logistics, manufacturing, and military experience support nearly every data center discipline.',
  },
  UT: {
    accentFrom: '#38bdf8', accentTo: '#f59e0b',
    energy: 'Utah combines coal, natural gas, solar, wind, geothermal, hydroelectric, and other resources while its power system continues to evolve.',
    climate: 'Dry air, high elevation, heat, snow, wildfire smoke, drought, and large temperature swings shape cooling, filtration, and water-efficiency decisions.',
    workforce: 'Technology, aerospace, defense, mining, financial technology, utilities, construction, and advanced manufacturing provide broad transferable skills.',
  },
  VT: {
    accentFrom: '#38bdf8', accentTo: '#22c55e',
    energy: 'Vermont uses hydroelectric imports, in-state solar, wind, biomass, and other resources within the New England grid, giving efficiency a prominent role.',
    climate: 'Cold snowy winters, ice, flooding, humid summers, and changing freeze-thaw conditions make heat recovery and resilient site access important.',
    workforce: 'Advanced manufacturing, renewable energy, utilities, telecommunications, construction, agriculture technology, and skilled trades offer useful technical foundations.',
  },
  VA: {
    accentFrom: '#38bdf8', accentTo: '#f72585',
    energy: 'Virginia combines natural gas, nuclear, solar, hydroelectric, and other resources, while regional grid coordination keeps reliability and capacity planning in focus.',
    climate: 'Hot humid summers, coastal storms, flooding, mountain winter weather, and severe thunderstorms make cooling and continuity planning essential across the Commonwealth.',
    workforce: 'Defense, military, cybersecurity, shipbuilding, utilities, construction, telecommunications, and advanced manufacturing create unusually broad pathways into secure infrastructure work.',
  },
  WA: {
    accentFrom: '#38bdf8', accentTo: '#22c55e',
    energy: 'Washington benefits from substantial hydroelectric generation alongside wind, natural gas, nuclear, solar, and other resources.',
    climate: 'Wet western winters, dry hot inland summers, snow, wildfire smoke, flooding, and seismic risk require varied cooling and resilience strategies.',
    workforce: 'Cloud technology, aerospace, maritime, advanced manufacturing, utilities, construction, and clean energy provide deep technical and operational experience.',
  },
  WV: {
    accentFrom: '#60a5fa', accentTo: '#facc15',
    energy: 'West Virginia uses coal, natural gas, wind, hydroelectric, and other resources, connecting critical-power work to an experienced energy workforce.',
    climate: 'Mountain terrain, flooding, snow, ice, humid summers, and severe storms make drainage, site access, and backup-power planning important.',
    workforce: 'Energy, chemicals, manufacturing, utilities, telecommunications, construction, and skilled trades offer transferable safety and maintenance experience.',
  },
  WI: {
    accentFrom: '#38bdf8', accentTo: '#facc15',
    energy: 'Wisconsin combines natural gas, coal, nuclear, wind, solar, hydroelectric, and other resources, creating a varied power environment.',
    climate: 'Cold winters, snow, ice, humid summers, severe storms, and flooding require winter-ready facilities and efficient seasonal operation.',
    workforce: 'Advanced manufacturing, water technology, food processing, utilities, construction, healthcare technology, and industrial automation provide strong transfer pathways.',
  },
  WY: {
    accentFrom: '#38bdf8', accentTo: '#f59e0b',
    energy: 'Wyoming combines coal, wind, natural gas, hydroelectric, solar, and other resources, pairing critical-power careers with a deep energy base.',
    climate: 'High elevation, cold winters, strong winds, snow, dry air, wildfire smoke, and large temperature swings emphasize weatherization and reliable site access.',
    workforce: 'Energy, mining, utilities, construction, agriculture, telecommunications, and industrial maintenance provide practical experience for facilities operations.',
  },
  DC: {
    accentFrom: '#38bdf8', accentTo: '#ef476f',
    energy: 'The District of Columbia depends on the interconnected regional grid and distributed energy resources, making continuity and public-sector resilience especially important.',
    climate: 'Hot humid summers, heavy rain, coastal-storm effects, and occasional snow and ice require dependable cooling and emergency operations.',
    workforce: 'Federal technology, cybersecurity, telecommunications, building engineering, utilities, public safety, and defense contracting offer strong pathways into secure infrastructure roles.',
  },
};

const STATE_NAMES_BY_CODE: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'District of Columbia',
};

export const STATE_PROFILES: Record<string, StateProfile> = Object.fromEntries(
  Object.entries(STATE_PROFILE_SEEDS).map(([abbreviation, profile]) => [
    abbreviation,
    {
      abbreviation,
      name: STATE_NAMES_BY_CODE[abbreviation],
      ...profile,
    },
  ])
);

export function getStateProfile(abbreviation: string | null): StateProfile | null {
  if (!abbreviation) return null;
  return STATE_PROFILES[abbreviation.toUpperCase()] || null;
}

export function getStateSourceLinks(profile: StateProfile) {
  const code = profile.abbreviation.toLowerCase();
  const climateUrl = profile.abbreviation === 'DC'
    ? 'https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/'
    : `https://statesummaries.ncics.org/chapter/${code}/`;

  return [
    {
      label: 'U.S. Energy Information Administration',
      shortLabel: 'EIA state energy profile',
      href: `https://www.eia.gov/state/?sid=${profile.abbreviation}`,
    },
    {
      label: 'NOAA National Centers for Environmental Information',
      shortLabel: 'NOAA state climate summary',
      href: climateUrl,
    },
    {
      label: 'U.S. Bureau of Labor Statistics',
      shortLabel: 'BLS state employment estimates',
      href: `https://www.bls.gov/oes/current/oes_${code}.htm`,
    },
    {
      label: 'U.S. Department of Labor',
      shortLabel: 'Registered apprenticeship resources',
      href: 'https://www.apprenticeship.gov/career-seekers',
    },
  ];
}

export function getRelatedStateProfiles(profile: StateProfile, limit = 4) {
  const profiles = Object.values(STATE_PROFILES);
  const currentIndex = profiles.findIndex((item) => item.abbreviation === profile.abbreviation);

  return Array.from({ length: limit }, (_, offset) => {
    return profiles[(currentIndex + offset + 1) % profiles.length];
  }).map((item) => ({
    ...item,
    slug: getStateSlug(item.name),
  }));
}

export function possessiveStateName(stateName: string) {
  return stateName.endsWith('s') ? `${stateName}'` : `${stateName}'s`;
}

export function buildStateFaqs(
  profile: StateProfile,
  activeCategories: string[] = []
): StateFaq[] {
  const categorySummary = activeCategories.length > 0
    ? `Current listings include ${activeCategories.slice(0, 3).join(', ')}. `
    : '';

  return [
    {
      question: `What types of data center jobs are available in ${profile.name}?`,
      answer: `${categorySummary}Data center employers commonly recruit for critical facilities, electrical and mechanical maintenance, network and IT infrastructure, security, construction, logistics, operations, and technical leadership. The listings above are updated as active roles change.`,
    },
    {
      question: `Which backgrounds transfer well into ${profile.name} data center careers?`,
      answer: profile.workforce,
    },
    {
      question: `How does ${possessiveStateName(profile.name)} operating environment affect data center work?`,
      answer: profile.climate,
    },
    {
      question: `How can I prepare for a data center job in ${profile.name}?`,
      answer: `Build a foundation in electrical, mechanical, HVAC, networking, or IT systems; practice structured troubleshooting and safety procedures; and consider role-relevant credentials. ${profile.name} job seekers can also explore registered apprenticeships, community or technical college programs, and state licensing requirements for regulated trades.`,
    },
  ];
}
