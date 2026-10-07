import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

// A theme that differs from MKS on purpose: buttons without colorType must pick
// up this primary color, which proves the package shares the app's MUI context.
const theme = createTheme({
  palette: { primary: { main: "#7B1FA2" } },
  typography: { fontFamily: "Georgia, serif" },
});

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
