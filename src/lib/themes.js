export const themes = {
  light: {
    primary: {
      DEFAULT: "#2563eb", // Indigo 600
      foreground: "#ffffff",
      hover: "#1d4ed8", // Indigo 700
      muted: "#dbeafe", // Indigo 100
      "muted-foreground": "#1e40af", // Indigo 800
    },
    background: "#ffffff",
    foreground: "#020617", // Slate 950
    muted: "#f1f5f9", // Slate 100
    "muted-foreground": "#64748b", // Slate 500
    border: "#e2e8f0", // Slate 200
    accent: "#f8fafc", // Slate 50
  },
  dark: {
    primary: {
      DEFAULT: "#3b82f6", // Blue 500
      foreground: "#ffffff",
      hover: "#60a5fa", // Blue 400
      muted: "#1e3a8a", // Blue 900
      "muted-foreground": "#93c5fd", // Blue 300
    },
    background: "#020617", // Slate 950
    foreground: "#f8fafc", // Slate 50
    muted: "#1f2937", // Slate 800 - Changed for better contrast
    "muted-foreground": "#94a3b8", // Slate 400
    border: "#1e293b", // Slate 800
    accent: "#0f172a", // Slate 900
  },
} 