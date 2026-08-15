// The three-ring "gerak / tidur / relaksasi" card on the home screen. All
// geometry comes from buildRings(); this component only draws it.

import { buildRings } from "@shared/rings";
import { formatInteger, formatDecimal } from "@shared/format";
import Icon from "./Icon";

export default function DailyRings({ rings: ringsSummary }) {
  const rings = buildRings(ringsSummary);

  return (
    <div className="cincin-kartu">
      <svg className="cincin-svg" width="240" height="160" viewBox="0 0 240 160">
        {rings.map((ring) => (
          <circle
            key={`shadow-${ring.key}`}
            cx={ring.cx}
            cy={ring.cy}
            r={ring.targetRadius}
            fill={`var(${ring.cssVar})`}
            fillOpacity=".10"
            stroke={`var(${ring.cssVar})`}
            strokeOpacity=".28"
            strokeWidth="1.5"
          />
        ))}
        {rings.map((ring) => (
          <circle
            key={`active-${ring.key}`}
            className="cincin-aktif"
            style={{ animationDelay: ring.pulseDelay }}
            cx={ring.cx}
            cy={ring.cy}
            r={ring.radius}
            fill={`var(${ring.cssVar})`}
            opacity=".8"
          />
        ))}
        {rings.map((ring) => (
          <g key={`icon-${ring.key}`} style={{ color: "var(--putih)" }}>
            <Icon name={ring.icon} size={22} x={ring.cx - 11} y={ring.cy - 11} />
          </g>
        ))}
      </svg>
      <div className="cincin-legenda">
        {rings.map((ring) => {
          const isDecimal = ring.key === "tidur";
          const format = isDecimal ? formatDecimal : formatInteger;
          return (
            <div key={ring.key}>
              <div className="l">
                <i style={{ background: `var(${ring.cssVar})` }} />
                {ring.label}
              </div>
              <div className="n">
                {format(ring.achieved)}
                <span className="tgt">/{format(ring.target)}</span>
              </div>
              <div className="sat">{ring.unit}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
