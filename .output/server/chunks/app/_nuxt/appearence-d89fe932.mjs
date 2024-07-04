import { tailwindcssPaletteGenerator } from '@bobthered/tailwindcss-palette-generator';
import { r as useStorage } from '../server.mjs';

function useAppearance() {
  const color = useStorage("golem-base-color", "#a633cc");
  const navigationBarPosition = useStorage("golem-navbar-position", "left");
  function setPalette(newColor) {
    if (newColor) {
      color.value = newColor;
    }
    const palette = tailwindcssPaletteGenerator(color.value);
    for (const [shade, color2] of Object.entries(palette.primary)) {
      const hexToRgb = (hex) => {
        hex = hex.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
      };
      document.documentElement.style.setProperty(`--color-primary-${shade}`, hexToRgb(color2));
    }
  }
  return {
    color,
    setPalette,
    navigationBarPosition
  };
}

export { useAppearance as u };
//# sourceMappingURL=appearence-d89fe932.mjs.map
