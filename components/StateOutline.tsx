import { geoAlbersUsa, geoPath } from 'd3-geo';
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
}

export function StateOutline({ abbreviation }: StateOutlineProps) {
  const topology = statesAtlas as any;
  const stateGeometry = topology.objects.states.geometries.find(
    (geometry: { id: string }) => geometry.id === STATE_FIPS[abbreviation]
  );

  if (!stateGeometry) return null;

  // us-atlas is derived from U.S. Census Bureau cartographic boundary files.
  const stateFeature = feature(topology, stateGeometry) as any;
  const projection = geoAlbersUsa().fitExtent([[54, 44], [586, 276]], stateFeature);
  const pathGenerator = geoPath(projection);
  const pathData = pathGenerator(stateFeature);

  return (
    <div className="relative flex min-h-[220px] items-center justify-center md:min-h-[300px]" aria-hidden="true">
      <svg
        viewBox="0 0 640 320"
        className="h-[220px] w-full overflow-visible drop-shadow-[0_0_20px_rgba(56,189,248,0.48)] md:h-[290px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d={pathData || undefined}
          fill="rgba(14, 165, 233, 0.08)"
          stroke="#38bdf8"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
