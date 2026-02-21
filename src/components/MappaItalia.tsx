"use client";

import { useState } from "react";
import { RegioneItaliana } from "@/types";
import { REGIONI_SVG_DATA } from "./italy-svg-data";

interface MappaItaliaProps {
  onRegioneClick: (regione: RegioneItaliana) => void;
  conteggio?: Record<string, number>;
}

interface LabelConfig {
  lines: string[];
  x: number;
  y: number;
  fontSize: number;
  leader?: { fromX: number; fromY: number };
}

const LABEL_CONFIG: Record<RegioneItaliana, LabelConfig> = {
  "Valle d'Aosta": {
    lines: ["Valle d'Aosta"],
    x: -45,
    y: 72,
    fontSize: 9,
    leader: { fromX: 40, fromY: 95 },
  },
  Piemonte: {
    lines: ["Piemonte"],
    x: 82,
    y: 150,
    fontSize: 10,
  },
  Lombardia: {
    lines: ["Lombardia"],
    x: 190,
    y: 112,
    fontSize: 10,
  },
  "Trentino-Alto Adige": {
    lines: ["Trentino-", "Alto Adige"],
    x: 255,
    y: 45,
    fontSize: 9,
  },
  Veneto: {
    lines: ["Veneto"],
    x: 278,
    y: 128,
    fontSize: 10,
  },
  "Friuli Venezia Giulia": {
    lines: ["Friuli V.G."],
    x: 340,
    y: 72,
    fontSize: 8,
  },
  Liguria: {
    lines: ["Liguria"],
    x: -15,
    y: 228,
    fontSize: 9,
    leader: { fromX: 80, fromY: 222 },
  },
  "Emilia-Romagna": {
    lines: ["Emilia-Romagna"],
    x: 225,
    y: 198,
    fontSize: 9,
  },
  Toscana: {
    lines: ["Toscana"],
    x: 232,
    y: 300,
    fontSize: 11,
  },
  Umbria: {
    lines: ["Umbria"],
    x: 300,
    y: 318,
    fontSize: 8,
  },
  Marche: {
    lines: ["Marche"],
    x: 348,
    y: 290,
    fontSize: 8,
  },
  Lazio: {
    lines: ["Lazio"],
    x: 302,
    y: 390,
    fontSize: 11,
  },
  Abruzzo: {
    lines: ["Abruzzo"],
    x: 370,
    y: 342,
    fontSize: 8,
  },
  Molise: {
    lines: ["Molise"],
    x: 445,
    y: 365,
    fontSize: 9,
    leader: { fromX: 405, fromY: 378 },
  },
  Campania: {
    lines: ["Campania"],
    x: 380,
    y: 442,
    fontSize: 9,
  },
  Puglia: {
    lines: ["Puglia"],
    x: 505,
    y: 435,
    fontSize: 10,
  },
  Basilicata: {
    lines: ["Basilicata"],
    x: 467,
    y: 478,
    fontSize: 8,
  },
  Calabria: {
    lines: ["Calabria"],
    x: 488,
    y: 568,
    fontSize: 9,
  },
  Sicilia: {
    lines: ["Sicilia"],
    x: 395,
    y: 698,
    fontSize: 11,
  },
  Sardegna: {
    lines: ["Sardegna"],
    x: 98,
    y: 498,
    fontSize: 10,
  },
};

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
        viewBox="-80 -10 720 810"
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
        ).map(([regione, { d, colore }]) => {
          const count = conteggio[regione] || 0;
          const isHovered = regioneHover === regione;
          const fillColor = isHovered ? darkenColor(colore, 40) : colore;
          const lbl = LABEL_CONFIG[regione];

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

              {lbl.leader && (
                <line
                  x1={lbl.leader.fromX}
                  y1={lbl.leader.fromY}
                  x2={lbl.x + 20}
                  y2={lbl.y - 2}
                  stroke="#555"
                  strokeWidth="1"
                  strokeDasharray="3,2"
                  pointerEvents="none"
                />
              )}

              <text
                x={lbl.x}
                y={lbl.y}
                textAnchor={lbl.leader ? "end" : "middle"}
                fontSize={lbl.fontSize}
                fill="#2c1810"
                fontWeight={isHovered ? "700" : "600"}
                pointerEvents="none"
                className="regione-label"
                style={{
                  textShadow:
                    "0 0 3px rgba(255,255,255,0.95), 0 0 3px rgba(255,255,255,0.95), 0 0 6px rgba(255,255,255,0.7)",
                }}
              >
                {lbl.lines.length === 1 ? (
                  lbl.lines[0]
                ) : (
                  <>
                    {lbl.lines.map((line, i) => (
                      <tspan
                        key={i}
                        x={lbl.x}
                        dy={i === 0 ? 0 : lbl.fontSize + 2}
                      >
                        {line}
                      </tspan>
                    ))}
                  </>
                )}
              </text>

              {count > 0 && (
                <g pointerEvents="none">
                  <circle
                    cx={lbl.x + (lbl.leader ? -15 : 30)}
                    cy={lbl.y - 16}
                    r="10"
                    fill="#c9402d"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={lbl.x + (lbl.leader ? -15 : 30)}
                    y={lbl.y - 12}
                    textAnchor="middle"
                    fontSize="9"
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
