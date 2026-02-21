"use client";

import { useState } from "react";
import { RegioneItaliana } from "@/types";
import { REGIONI_SVG_DATA } from "./italy-svg-data";

interface MappaItaliaProps {
  onRegioneClick: (regione: RegioneItaliana) => void;
  conteggio?: Record<string, number>;
}

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  const b = Math.max(0, (num & 0x0000ff) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export default function MappaItalia({
  onRegioneClick,
  conteggio = {},
}: MappaItaliaProps) {
  const [regioneHover, setRegioneHover] = useState<RegioneItaliana | null>(
    null
  );

  return (
    <div className="mappa-container">
      <svg
        viewBox="0 0 610 793"
        className="mappa-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter
            id="ombra-regione"
            x="-5%"
            y="-5%"
            width="110%"
            height="110%"
          >
            <feDropShadow
              dx="1"
              dy="1"
              stdDeviation="1.5"
              floodColor="#00000030"
            />
          </filter>
          <filter
            id="ombra-hover"
            x="-5%"
            y="-5%"
            width="110%"
            height="110%"
          >
            <feDropShadow
              dx="2"
              dy="2"
              stdDeviation="3"
              floodColor="#00000050"
            />
          </filter>
        </defs>

        {(
          Object.entries(REGIONI_SVG_DATA) as [
            RegioneItaliana,
            (typeof REGIONI_SVG_DATA)[RegioneItaliana],
          ][]
        ).map(([regione, { d, colore, label }]) => {
          const count = conteggio[regione] || 0;
          const isHovered = regioneHover === regione;
          const fillColor = isHovered ? darkenColor(colore, 40) : colore;

          return (
            <g key={regione}>
              <path
                d={d}
                fill={fillColor}
                stroke={isHovered ? "#2c1810" : "#ffffff"}
                strokeWidth={isHovered ? "2.5" : "1.5"}
                strokeLinejoin="round"
                filter={
                  isHovered ? "url(#ombra-hover)" : "url(#ombra-regione)"
                }
                className="regione-path"
                onMouseEnter={() => setRegioneHover(regione)}
                onMouseLeave={() => setRegioneHover(null)}
                onClick={() => onRegioneClick(regione)}
                style={{
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              />
              <text
                x={label.x}
                y={label.y}
                textAnchor="middle"
                fontSize="11"
                fill="#2c1810"
                fontWeight={isHovered ? "700" : "600"}
                pointerEvents="none"
                className="regione-label"
                style={{
                  textShadow:
                    "0 0 4px rgba(255,255,255,0.9), 0 0 4px rgba(255,255,255,0.9)",
                }}
              >
                {regione}
              </text>
              {count > 0 && (
                <g pointerEvents="none">
                  <circle
                    cx={label.x + 30}
                    cy={label.y - 16}
                    r="12"
                    fill="#c9402d"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={label.x + 30}
                    y={label.y - 12}
                    textAnchor="middle"
                    fontSize="10"
                    fill="white"
                    fontWeight="bold"
                  >
                    {count}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {regioneHover && (
        <div className="mappa-tooltip">
          <span
            className="mappa-tooltip-dot"
            style={{
              backgroundColor: REGIONI_SVG_DATA[regioneHover].colore,
            }}
          />
          <strong>{regioneHover}</strong>
          <span className="mappa-tooltip-count">
            {conteggio[regioneHover] || 0} ricette
          </span>
        </div>
      )}
    </div>
  );
}
