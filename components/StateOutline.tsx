import { geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import statesAtlas from 'us-atlas/states-10m.json';

const STATE_FIPS: Record<string, string> = {
  AL: '01', AK: '02', AZ: '04', AR: '05', CA: '06', CO: '08', CT: '09', DE: '10',
  DC: '11', FL: '12', GA: '13', HI: '15', ID: '16', IL: '17', IN: '18', IA: '19',
  KS: '20', KY: '21', LA: '22', ME: '23', MD: '24', MA: '25', MI: '26', MN: '27',
  MS: '28', MO: '29', MT: '30', NE: '31', NV: '32', NH: '33', NJ: '34', NM: '35',
  NY: '36', NC: '37', ND: '38', OH: '39', OK: '40', OR: '41', PA: '42', RI: '44',
  SC: '45', SD: '46', TN: '47', TX: '48', UT: '49', VT: '50', VA: '51', WA: '53',
  WV: '54', WI: '55', WY: '56',
};

interface StateOutlineProps {
  abbreviation: string;
  accentFrom: string;
  accentTo: string;
}

export function StateOutline({
  abbreviation,
  accentFrom,
  accentTo,
}: StateOutlineProps) {
  const topology = statesAtlas as any;
  const stateGeometry = topology.objects.states.geometries.find(
    (geometry: { id: string }) => geometry.id === STATE_FIPS[abbreviation]
  );

  if (!stateGeometry) return null;

  // us-atlas is derived from U.S. Census Bureau cartographic boundary files.
  const stateFeature = feature(topology, stateGeometry) as any;
  const pathGenerator = geoPath();
  const pathData = pathGenerator(stateFeature);
  const [[x0, y0], [x1, y1]] = pathGenerator.bounds(stateFeature);
  const width = Math.max(x1 - x0, 1);
  const height = Math.max(y1 - y0, 1);
  const padding = Math.max(width, height) * 0.08;

  return (
    <div className="relative flex min-h-[230px] items-center justify-center md:min-h-[280px]" aria-hidden="true">
      <div
        className="absolute inset-0 flex items-center justify-center text-[10rem] font-black tracking-[-0.12em] opacity-20 md:text-[15rem]"
        style={{ color: accentTo }}
      >
        {abbreviation}
      </div>
      <svg
        viewBox={`${x0 - padding} ${y0 - padding} ${width + padding * 2} ${height + padding * 2}`}
        className="relative z-10 h-[225px] w-full overflow-visible drop-shadow-[0_0_24px_rgba(56,189,248,0.4)] md:h-[270px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d={pathData || undefined}
          fill={`${accentTo}0a`}
          stroke={accentTo}
          strokeWidth={Math.max(width, height) / 150}
          vectorEffect="non-scaling-stroke"
          opacity="0.9"
        />
        <path
          d={pathData || undefined}
          fill={`${accentFrom}0a`}
          stroke={accentFrom}
          strokeWidth={Math.max(width, height) / 300}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
