"use client";

import { useState } from "react";
import { RegioneItaliana } from "@/types";

interface MappaItaliaProps {
  onRegioneClick: (regione: RegioneItaliana) => void;
  conteggio?: Record<string, number>;
}

const REGIONI_DATA: Record<
  RegioneItaliana,
  { d: string; label: { x: number; y: number }; colore: string }
> = {
  "Valle d'Aosta": {
    d: "M105,115 L115,105 L130,108 L135,118 L125,128 L110,125 Z",
    label: { x: 90, y: 100 },
    colore: "#7CB9E8",
  },
  Piemonte: {
    d: "M110,125 L125,128 L135,118 L155,115 L170,130 L175,155 L165,180 L145,195 L120,190 L105,175 L95,155 L100,140 Z",
    label: { x: 130, y: 160 },
    colore: "#4CAF50",
  },
  Lombardia: {
    d: "M155,115 L175,100 L200,95 L225,100 L240,110 L245,130 L235,150 L215,155 L195,150 L175,155 L170,130 Z",
    label: { x: 200, y: 130 },
    colore: "#F48FB1",
  },
  "Trentino-Alto Adige": {
    d: "M225,100 L240,75 L260,65 L280,70 L290,85 L280,100 L260,110 L240,110 Z",
    label: { x: 255, y: 85 },
    colore: "#CE93D8",
  },
  Veneto: {
    d: "M240,110 L260,110 L280,100 L310,105 L320,120 L310,140 L290,150 L270,148 L255,145 L245,130 Z",
    label: { x: 280, y: 130 },
    colore: "#FF9800",
  },
  "Friuli Venezia Giulia": {
    d: "M310,105 L330,95 L350,100 L360,115 L350,130 L330,135 L310,140 L320,120 Z",
    label: { x: 330, y: 115 },
    colore: "#009688",
  },
  Liguria: {
    d: "M105,175 L120,190 L145,195 L170,200 L195,195 L200,205 L180,215 L150,218 L120,210 L100,200 L95,188 Z",
    label: { x: 145, y: 210 },
    colore: "#CDDC39",
  },
  "Emilia-Romagna": {
    d: "M175,155 L195,150 L215,155 L235,150 L255,145 L290,150 L300,165 L290,180 L260,190 L230,195 L200,200 L195,195 L170,200 L165,180 Z",
    label: { x: 230, y: 175 },
    colore: "#81C784",
  },
  Toscana: {
    d: "M200,200 L200,205 L230,195 L260,190 L270,200 L275,220 L265,245 L250,260 L230,265 L210,255 L195,240 L190,220 Z",
    label: { x: 230, y: 235 },
    colore: "#FFD54F",
  },
  Umbria: {
    d: "M265,245 L275,220 L290,225 L300,240 L295,260 L280,265 L265,260 Z",
    label: { x: 280, y: 245 },
    colore: "#4DD0E1",
  },
  Marche: {
    d: "M270,200 L290,180 L300,165 L320,180 L325,200 L315,220 L300,230 L290,225 L275,220 Z",
    label: { x: 300, y: 205 },
    colore: "#42A5F5",
  },
  Lazio: {
    d: "M230,265 L250,260 L265,260 L280,265 L295,260 L300,280 L295,305 L280,320 L260,315 L240,305 L230,290 L225,275 Z",
    label: { x: 260, y: 290 },
    colore: "#FFAB91",
  },
  Abruzzo: {
    d: "M295,260 L300,240 L300,230 L315,220 L330,235 L335,255 L325,270 L310,275 Z",
    label: { x: 315, y: 255 },
    colore: "#F06292",
  },
  Molise: {
    d: "M310,275 L325,270 L340,280 L340,295 L330,305 L315,300 L305,290 Z",
    label: { x: 322, y: 290 },
    colore: "#388E3C",
  },
  Campania: {
    d: "M280,320 L295,305 L305,290 L315,300 L330,305 L340,320 L335,340 L320,355 L305,350 L290,340 Z",
    label: { x: 310, y: 330 },
    colore: "#AB47BC",
  },
  Puglia: {
    d: "M330,305 L340,295 L340,280 L355,275 L375,285 L395,300 L410,320 L415,345 L405,360 L385,365 L365,355 L350,340 L335,340 L340,320 Z",
    label: { x: 375, y: 325 },
    colore: "#EF5350",
  },
  Basilicata: {
    d: "M335,340 L350,340 L365,355 L360,375 L345,380 L330,375 L320,365 L320,355 Z",
    label: { x: 340, y: 365 },
    colore: "#26A69A",
  },
  Calabria: {
    d: "M320,365 L330,375 L345,380 L350,400 L345,425 L335,450 L320,465 L305,455 L300,430 L305,405 L310,385 Z",
    label: { x: 325, y: 425 },
    colore: "#5C6BC0",
  },
  Sicilia: {
    d: "M220,460 L245,445 L270,440 L295,445 L310,455 L305,470 L290,480 L265,485 L240,480 L220,475 Z",
    label: { x: 265, y: 465 },
    colore: "#8BC34A",
  },
  Sardegna: {
    d: "M120,340 L140,330 L160,335 L170,355 L168,380 L162,405 L150,420 L135,425 L120,415 L112,395 L110,370 L112,350 Z",
    label: { x: 140, y: 380 },
    colore: "#FFC107",
  },
};

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  const b = Math.max(0, (num & 0x0000ff) - amount);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
}

export default function MappaItalia({ onRegioneClick, conteggio = {} }: MappaItaliaProps) {
  const [regioneHover, setRegioneHover] = useState<RegioneItaliana | null>(null);

  return (
    <div className="mappa-container">
      <svg
        viewBox="60 50 380 460"
        className="mappa-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="ombra-regione" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor="#00000030" />
          </filter>
          <filter id="ombra-hover" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="1.5" dy="2" stdDeviation="2.5" floodColor="#00000050" />
          </filter>
        </defs>

        {(
          Object.entries(REGIONI_DATA) as [
            RegioneItaliana,
            (typeof REGIONI_DATA)[RegioneItaliana],
          ][]
        ).map(([regione, { d, label, colore }]) => {
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
                filter={isHovered ? "url(#ombra-hover)" : "url(#ombra-regione)"}
                className="regione-path"
                onMouseEnter={() => setRegioneHover(regione)}
                onMouseLeave={() => setRegioneHover(null)}
                onClick={() => onRegioneClick(regione)}
                style={{
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  transformOrigin: `${label.x}px ${label.y}px`,
                  transform: isHovered ? "scale(1.03)" : "scale(1)",
                }}
              />
              <text
                x={label.x}
                y={label.y}
                textAnchor="middle"
                fontSize="7"
                fill="#2c1810"
                fontWeight={isHovered ? "700" : "600"}
                pointerEvents="none"
                className="regione-label"
                style={{
                  textShadow: "0 0 3px rgba(255,255,255,0.8)",
                }}
              >
                {regione}
              </text>
              {count > 0 && (
                <g pointerEvents="none">
                  <circle
                    cx={label.x + 18}
                    cy={label.y - 12}
                    r="8"
                    fill="#c9402d"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <text
                    x={label.x + 18}
                    y={label.y - 9}
                    textAnchor="middle"
                    fontSize="7"
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
              backgroundColor:
                REGIONI_DATA[regioneHover].colore,
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
