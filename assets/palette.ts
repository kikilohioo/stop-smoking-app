// Base de colores
export const baseColors = {
  fireBrick: "#bb0a21ff",
  fluorescentCyan: "#03f7ebff",
  marianBlue: "#2b4570ff",
  teal: "#218380ff",
  dutchWhite: "#f3dfbfff",
};

// Función para convertir HEX a HSL
const hexToHsl = (hex: string): [number, number, number] => {
  const sanitizedHex = hex.replace("#", "");
  const bigint = parseInt(sanitizedHex.slice(0, 6), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / delta + 4;
        break;
    }
    h *= 60;
  }

  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
};

// Función para convertir HSL a HEX
const hslToHex = (h: number, s: number, l: number): string => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const to255 = (n: number) => Math.round((n + m) * 255);
  return `#${to255(r).toString(16).padStart(2, "0")}${to255(g)
    .toString(16)
    .padStart(2, "0")}${to255(b).toString(16).padStart(2, "0")}`;
};

// Función para generar colores dinámicamente
const createColor = (hex: string) => {
  return (luminosity: number): string => {
    const [h, s] = hexToHsl(hex); // Obtenemos el H y S del color base
    const l = Math.min(100, Math.max(0, 100 - luminosity)); // Ajustamos la luminosidad (0 = más blanco, 100 = más oscuro)
    return hslToHex(h, s / 100, l / 100);
  };
};

// Crear funciones de colores dinámicas
export const fireBrick = createColor(baseColors.fireBrick);
export const fluorescentCyan = createColor(baseColors.fluorescentCyan);
export const marianBlue = createColor(baseColors.marianBlue);
export const teal = createColor(baseColors.teal);
export const dutchWhite = createColor(baseColors.dutchWhite);
