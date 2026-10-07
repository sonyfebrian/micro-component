"use client";

import type { ReactNode } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

// Differs from MKS on purpose so theme fallback is observable.
const theme = createTheme({
  palette: { primary: { main: "#2E7D32" } },
  typography: { fontFamily: "Verdana, sans-serif" },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
