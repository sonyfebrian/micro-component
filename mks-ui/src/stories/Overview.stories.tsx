import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonContained, ButtonOutlined } from "../index.js";

const meta = {
  title: "Welcome / Overview",
  tags: ["!autodocs"],
  parameters: {
    controls: { disable: true },
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Introduction: Story = {
  render: () => (
    <Box sx={{ width: "min(100%, 920px)", mx: "auto", py: { xs: 3, sm: 6 } }}>
      <Paper
        elevation={0}
        sx={{
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 4,
          background:
            "radial-gradient(circle at top right, rgba(0, 82, 156, 0.20), transparent 38%), linear-gradient(135deg, rgba(0,82,156,0.08), transparent 55%)",
        }}
      >
        <Stack spacing={4} sx={{ p: { xs: 3, sm: 6 } }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label="v0.1.0" color="primary" size="small" />
            <Typography variant="overline" color="text.secondary">React + Material UI</Typography>
          </Stack>
          <Box>
            <Typography variant="h2" component="h1" sx={{ fontWeight: 700, letterSpacing: "-0.04em" }}>
              MKS UI
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 1, maxWidth: 560, fontWeight: 400 }}>
              A focused set of reliable interface primitives, ready for React 18 and 19 applications.
            </Typography>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <ButtonContained colorType="primary">Explore components</ButtonContained>
            <ButtonOutlined colorType="primary">Read the API</ButtonOutlined>
          </Stack>
        </Stack>
      </Paper>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mt: 2 }}>
        {[
          ["Theme aware", "Omit colorType to use the host application’s primary color."],
          ["Consumer friendly", "Use Controls to explore props, states, and responsive behavior."],
          ["Accessible by default", "Inspect keyboard, disabled, and pagination behavior in isolation."],
        ].map(([title, description]) => (
          <Paper key={title} variant="outlined" sx={{ flex: 1, p: 2.5, borderRadius: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>{description}</Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  ),
};
