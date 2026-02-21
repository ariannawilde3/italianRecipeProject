"use client";

import { useState } from "react";
import { RegioneItaliana } from "@/types";
import { REGIONI_SVG_DATA } from "./italy-svg-data";

interface MappaItaliaProps {
  onRegioneClick: (regione: RegioneItaliana) => void;
  conteggio?: Record<string, number>;
}

const REGIONI_NUMBERED: { regione: RegioneItaliana; x: number; y: number }[] = [
  { regione: "Valle d'Aosta", x: 42, y: 100 },
  { regione: "Piemonte", x: 80, y: 150 },
  { regione: "Lombardia", x: 185, y: 108 },
  { regione: "Trentino-Alto Adige", x: 252, y: 50 },
  { regione: "Veneto", x: 278, y: 125 },
  { regione: "Friuli Venezia Giulia", x: 335, y: 68 },
  { regione: "Liguria", x: 128, y: 218 },
  { regione: "Emilia-Romagna", x: 220, y: 195 },
  { regione: "Toscana", x: 235, y: 300 },
  { regione: "Umbria", x: 300, y: 315 },
  { regione: "Marche", x: 348, y: 285 },
  { regione: "Lazio", x: 298, y: 388 },
  { regione: "Abruzzo", x: 370, y: 340 },
  { regione: "Molise", x: 400, y: 378 },
  { regione: "Campania", x: 385, y: 440 },
  { regione: "Puglia", x: 502, y: 432 },
  { regione: "Basilicata", x: 468, y: 476 },
  { regione: "Calabria", x: 488, y: 565 },
  { regione: "Sicilia", x: 395, y: 695 },
  { regione: "Sardegna", x: 98, y: 495 },
];

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
    <div className="mappa-layout">
      <div className="mappa-map-side">
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

          {REGIONI_NUMBERED.map(({ regione, x, y }, index) => {
            const { d, colore } = REGIONI_SVG_DATA[regione];
            const isHovered = regioneHover === regione;
            const fillColor = isHovered ? darkenColor(colore, 40) : colore;
            const num = index + 1;

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
                <circle
                  cx={x}
                  cy={y}
                  r="11"
                  fill="white"
                  stroke="#2c1810"
                  strokeWidth="1.5"
                  pointerEvents="none"
                  opacity="0.9"
                />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#2c1810"
                  fontWeight="700"
                  pointerEvents="none"
                >
                  {num}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mappa-legend-side">
        <h3 className="mappa-legend-title">Regioni d&apos;Italia</h3>
        <ol className="mappa-legend-list">
          {REGIONI_NUMBERED.map(({ regione }, index) => {
            const { colore } = REGIONI_SVG_DATA[regione];
            const isHovered = regioneHover === regione;
            const count = conteggio[regione] || 0;

            return (
              <li
                key={regione}
                className={`mappa-legend-item ${isHovered ? "mappa-legend-item-active" : ""}`}
                onMouseEnter={() => setRegioneHover(regione)}
                onMouseLeave={() => setRegioneHover(null)}
                onClick={() => onRegioneClick(regione)}
              >
                <span className="mappa-legend-num">{index + 1}</span>
                <span
                  className="mappa-legend-dot"
                  style={{ backgroundColor: colore }}
                />
                <span className="mappa-legend-name">{regione}</span>
                {count > 0 && (
                  <span className="mappa-legend-count">{count}</span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
