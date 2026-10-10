import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import type { Preview } from "@storybook/react-vite";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#00529C" },
    background: { default: "#F5F8FC" },
  },
  typography: { fontFamily: "Inter, system-ui, sans-serif" },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#72B8F2" },
    background: { default: "#101827", paper: "#172033" },
  },
  typography: { fontFamily: "Inter, system-ui, sans-serif" },
});

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Preview color scheme",
      defaultValue: "light",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
      },
    },
  },
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
    layout: "centered",
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme === "dark" ? darkTheme : lightTheme;
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div
            style={{
              minWidth: "min(100%, 320px)",
              padding: "32px",
              background: theme.palette.background.default,
              transition: "background 160ms ease",
            }}
          >
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
