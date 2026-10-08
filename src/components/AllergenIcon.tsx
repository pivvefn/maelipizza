import type { ReactNode } from "react";

export const ALLERGEN_NAMES: Record<number, string> = {
  1: "Arachidi",
  2: "Crostacei",
  3: "Frutta a guscio",
  4: "Glutine",
  5: "Latte e derivati",
  6: "Lupini",
  7: "Molluschi",
  8: "Pesce",
  9: "Senape",
  10: "Sedano",
  11: "Sesamo",
  12: "Soia",
  13: "Anidride solforosa e solfiti",
  14: "Uova e derivati",
};

export const ALLERGEN_COLORS: Record<number, string> = {
  1: "#8B5E34", 
  2: "#F4511E", 
  3: "#C9A063", 
  4: "#F9A825", 
  5: "#4FC3F7", 
  6: "#F57C00", 
  7: "#1FA08C", 
  8: "#1E88E5", 
  9: "#FF8F00", 
  10: "#2E7D32", 
  11: "#4E342E", 
  12: "#43A047", 
  13: "#1565C0", 
  14: "#EFD9B4", 
};

const ICON_SHAPES: Record<number, (bg: string) => ReactNode> = {

  1: (bg) => (
    <g fill="#fff">
      <circle cx="8" cy="12" r="4.2" />
      <circle cx="16" cy="12" r="4.2" />
      <rect x="8" y="9.6" width="8" height="4.8" />
      <path
        d="M9.6 9.9 14.4 14.1M14.4 9.9 9.6 14.1"
        stroke={bg}
        strokeWidth="1"
        fill="none"
        opacity=".55"
      />
    </g>
  ),

  2: () => (
    <g fill="#fff">
      <ellipse cx="12" cy="14.2" rx="3" ry="5" />
      <circle cx="12" cy="8.8" r="2.7" />
      <circle cx="6.8" cy="6.4" r="2.7" />
      <circle cx="17.2" cy="6.4" r="2.7" />
      <path
        d="M8.6 8.4 10.6 11.2M15.4 8.4 13.4 11.2"
        stroke="#fff"
        strokeWidth="1.7"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M10.4 18.6 12 21.6l1.6-3z" />
      <path
        d="M11 6.4 9.7 4M13 6.4l1.3-2.4"
        stroke="#fff"
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  ),

  3: (bg) => (
    <g fill="#fff">
      <path d="M12 3.8c3.6 2.8 5.8 5.9 5.8 9 0 3.4-2.6 5.9-5.8 5.9s-5.8-2.5-5.8-5.9c0-3.1 2.2-6.2 5.8-9z" />
      <path
        d="M12 6.5v11M9.3 9.4l5.4 4.9M14.7 9.4l-5.4 4.9"
        stroke={bg}
        strokeWidth="1"
        fill="none"
        opacity=".5"
      />
    </g>
  ),

  4: () => (
    <g fill="#fff">
      <rect x="11.2" y="6.5" width="1.6" height="15" rx=".8" />
      <path d="M11.4 9C9.3 9 7.6 7.4 7.6 5.2 9.8 5.2 11.4 6.8 11.4 9z" />
      <path d="M12.6 9c2.1 0 3.8-1.6 3.8-3.8C14.2 5.2 12.6 6.8 12.6 9z" />
      <path d="M11.4 12.6c-2.1 0-3.8-1.6-3.8-3.8 2.2 0 3.8 1.6 3.8 3.8z" />
      <path d="M12.6 12.6c2.1 0 3.8-1.6 3.8-3.8-2.2 0-3.8 1.6-3.8 3.8z" />
      <path d="M11.4 16.2c-2.1 0-3.8-1.6-3.8-3.8 2.2 0 3.8 1.6 3.8 3.8z" />
      <path d="M12.6 16.2c2.1 0 3.8-1.6 3.8-3.8-2.2 0-3.8 1.6-3.8 3.8z" />
      <path d="M11.4 19.8c-2.1 0-3.8-1.6-3.8-3.8 2.2 0 3.8 1.6 3.8 3.8z" />
      <path d="M12.6 19.8c2.1 0 3.8-1.6 3.8-3.8-2.2 0-3.8 1.6-3.8 3.8z" />
    </g>
  ),

  5: () => (
    <g fill="#fff">
      <rect x="9.9" y="1.5" width="4.2" height="2.5" rx=".6" />
      <rect x="11" y="3.8" width="2" height="2.2" />
      <path d="M11 6h2l2.2 3.4v9.6a3 3 0 0 1-3 3h-.4a3 3 0 0 1-3-3V9.4z" />
    </g>
  ),

  6: () => (
    <g fill="#fff">
      <ellipse cx="8.4" cy="15.2" rx="4.8" ry="3.2" transform="rotate(-14 8.4 15.2)" />
      <ellipse cx="15.6" cy="15.2" rx="4.8" ry="3.2" transform="rotate(14 15.6 15.2)" />
      <ellipse cx="12" cy="9.4" rx="4.8" ry="3.2" />
    </g>
  ),

  7: (bg) => (
    <g fill="#fff">
      <path d="M12 21 4.6 9.5C4.6 5.4 7.9 3 12 3s7.4 2.4 7.4 6.5z" />
      <rect x="11.3" y="20.6" width="1.4" height="2.4" rx=".7" />
      <path
        d="M12 21 7.3 8.4M12 21V4.2M12 21l4.7-12.6"
        stroke={bg}
        strokeWidth="1.1"
        fill="none"
        opacity=".7"
      />
    </g>
  ),

  8: (bg) => (
    <g fill="#fff">
      <path d="M3.8 12C6.6 8.2 10.8 6 14.4 6c2.2 0 4.2.8 5.7 2l2.5-2-.9 6 .9 6-2.5-2c-1.5 1.2-3.5 2-5.7 2C10.8 18 6.6 15.8 3.8 12z" />
      <circle cx="7.2" cy="10.6" r="1.1" fill={bg} />
    </g>
  ),

  9: () => (
    <g fill="#fff">
      <path d="M12 1.8 13.6 5.2h-3.2z" />
      <path d="M10.9 5.2h2.2l.9 2.2H10z" />
      <rect x="7.6" y="7.2" width="8.8" height="14" rx="2.6" />
    </g>
  ),

  10: () => (
    <g fill="#fff">
      <rect x="11.3" y="14.6" width="1.4" height="7.2" rx=".7" />
      <path d="M12 4.6c1.3 1.7 2 3.5 2 5.2 0 1.4-.7 2.6-2 3.8-1.3-1.2-2-2.4-2-3.8 0-1.7.7-3.5 2-5.2z" />
      <path
        transform="rotate(-48 12 15)"
        d="M12 5.4c1.3 1.7 2 3.5 2 5.2 0 1.4-.7 2.6-2 3.8-1.3-1.2-2-2.4-2-3.8 0-1.7.7-3.5 2-5.2z"
      />
      <path
        transform="rotate(48 12 15)"
        d="M12 5.4c1.3 1.7 2 3.5 2 5.2 0 1.4-.7 2.6-2 3.8-1.3-1.2-2-2.4-2-3.8 0-1.7.7-3.5 2-5.2z"
      />
    </g>
  ),

  11: () => (
    <g fill="#fff">
      <path d="M8.6 5.4c1.9 2.4 2.9 4.8 2.9 7 0 2.1-1.3 3.6-3.1 3.6S5.3 14.5 5.3 12.4c0-2.2 1.4-4.6 3.3-7z" />
      <path d="M15.4 5.4c1.9 2.4 3 4.8 3 7 0 2.1-1.4 3.6-3.2 3.6s-3.1-1.5-3.1-3.6c0-2.2 1.4-4.6 3.3-7z" />
    </g>
  ),

  12: (bg) => (
    <g transform="rotate(-38 12 12)">
      <rect x="3.5" y="9.4" width="17" height="5.2" rx="2.6" fill="#fff" />
      <circle cx="7.4" cy="12" r="1.5" fill={bg} />
      <circle cx="12" cy="12" r="1.5" fill={bg} />
      <circle cx="16.6" cy="12" r="1.5" fill={bg} />
    </g>
  ),

  13: (bg) => (
    <g fill="#fff">
      <rect x="10.3" y="2.4" width="3.4" height="5" rx=".6" />
      <path d="M12 7.4l5.6 11.6c.6 1.2-.3 2.6-1.7 2.6H8.1c-1.4 0-2.3-1.4-1.7-2.6L12 7.4z" />
      <text
        x="12"
        y="18.6"
        textAnchor="middle"
        fontSize="5.4"
        fontWeight="700"
        fontFamily="sans-serif"
        fill={bg}
      >
        SO₂
      </text>
    </g>
  ),

  14: () => (
    <path
      fill="#fff"
      d="M12 2.4c3.7 0 6.7 5.2 6.7 9.8a6.7 6.7 0 0 1-13.4 0c0-4.6 3-9.8 6.7-9.8z"
    />
  ),
};

type AllergenIconProps = {
  id: number;
  className?: string;
};

export function AllergenIcon({ id, className = "w-6 h-6" }: AllergenIconProps) {
  const name = ALLERGEN_NAMES[id] ?? `Allergene ${id}`;
  const bg = ALLERGEN_COLORS[id] ?? "#9E9E9E";
  const shape = ICON_SHAPES[id];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      role="img"
      aria-label={`Allergene: ${name}`}
    >

      <title>{name}</title>
      <circle cx="12" cy="12" r="12" fill={bg} />
      {shape ? (
        shape(bg)
      ) : (
        <circle
          cx="12"
          cy="12"
          r="7.5"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeDasharray="3 3"
        />
      )}
    </svg>
  );
}

type AllergeniPizzaProps = {
  ids: number[];
  className?: string;
  /** Dimensione di ogni simbolo (classe Tailwind, default 16px). */
  iconClassName?: string;
};

/**
 * Simboli di una pizza (tra nome e prezzo): deduplica e ordina gli id,
 * poi disegna un simbolo per allergene. Restituisce null se non ce ne sono.
 */
export function AllergeniPizza({
  ids,
  className = "",
  iconClassName = "h-4 w-4",
}: AllergeniPizzaProps) {
  if (ids.length === 0) return null;
  const unique = [...new Set(ids)].sort((a, b) => a - b);

  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`}>
      {unique.map((id) => (
        <AllergenIcon key={id} id={id} className={`${iconClassName} shrink-0`} />
      ))}
    </span>
  );
}
