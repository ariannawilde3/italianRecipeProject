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
}

const LABEL_CONFIG: Record<RegioneItaliana, LabelConfig> = {
  "Valle d'Aosta": {
    lines: ["V. d'Aosta"],
    x: 42,
    y: 100,
    fontSize: 6,
  },
  Piemonte: {
    lines: ["Piemonte"],
    x: 82,
    y: 148,
    fontSize: 11,
  },
  Lombardia: {
    lines: ["Lombardia"],
    x: 192,
    y: 112,
    fontSize: 11,
  },
  "Trentino-Alto Adige": {
    lines: ["Trentino-", "Alto Adige"],
    x: 255,
    y: 40,
    fontSize: 8,
  },
  Veneto: {
    lines: ["Veneto"],
    x: 280,
    y: 128,
    fontSize: 11,
  },
  "Friuli Venezia Giulia": {
    lines: ["Friuli", "Venezia G."],
    x: 338,
    y: 62,
    fontSize: 7,
  },
  Liguria: {
    lines: ["Liguria"],
    x: 128,
    y: 218,
    fontSize: 7,
  },
  "Emilia-Romagna": {
    lines: ["Emilia-Romagna"],
    x: 220,
    y: 198,
    fontSize: 10,
  },
  Toscana: {
    lines: ["Toscana"],
    x: 232,
    y: 300,
    fontSize: 12,
  },
  Umbria: {
    lines: ["Umbria"],
    x: 300,
    y: 318,
    fontSize: 7,
  },
  Marche: {
    lines: ["Marche"],
    x: 348,
    y: 288,
    fontSize: 8,
  },
  Lazio: {
    lines: ["Lazio"],
    x: 300,
    y: 390,
    fontSize: 12,
  },
  Abruzzo: {
    lines: ["Abruzzo"],
    x: 370,
    y: 340,
    fontSize: 8,
  },
  Molise: {
    lines: ["Molise"],
    x: 400,
    y: 380,
    fontSize: 6,
  },
  Campania: {
    lines: ["Campania"],
    x: 385,
    y: 442,
    fontSize: 9,
  },
  Puglia: {
    lines: ["Puglia"],
    x: 500,
    y: 430,
    fontSize: 11,
  },
  Basilicata: {
    lines: ["Basilicata"],
    x: 468,
    y: 478,
    fontSize: 7,
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
    fontSize: 12,
  },
  Sardegna: {
    lines: ["Sardegna"],
    x: 98,
    y: 498,
    fontSize: 11,
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

              <text
                x={lbl.x}
                y={lbl.y}
                textAnchor="middle"
                fontSize={lbl.fontSize}
                fill="#2c1810"
                fontWeight={isHovered ? "800" : "700"}
                pointerEvents="none"
                className="regione-label"
              >
                {lbl.lines.length === 1 ? (
                  lbl.lines[0]
                ) : (
                  <>
                    {lbl.lines.map((line, i) => (
                      <tspan
                        key={i}
                        x={lbl.x}
                        dy={i === 0 ? 0 : lbl.fontSize + 1}
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
                    cx={lbl.x + 25}
                    cy={lbl.y - 14}
                    r="10"
                    fill="#c9402d"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={lbl.x + 25}
                    y={lbl.y - 10}
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
