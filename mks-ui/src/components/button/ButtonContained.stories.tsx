import { Stack, Typography } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonContained } from "./ButtonContained.js";

const meta = {
  title: "Components / Buttons / Contained",
  component: ButtonContained,
  args: { children: "Simpan", colorType: "primary" },
  argTypes: {
    colorType: { control: "select", options: ["primary", "secondary"] },
    children: { control: "text" },
  },
  parameters: { layout: "centered" },
} satisfies Meta<typeof ButtonContained>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const BrandPalette: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={2.5} alignItems="flex-start">
      <Typography variant="overline" color="text.secondary">Brand actions</Typography>
      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
        <ButtonContained colorType="primary">Simpan perubahan</ButtonContained>
        <ButtonContained colorType="secondary">Kirim sekarang</ButtonContained>
        <ButtonContained disabled>Menunggu</ButtonContained>
      </Stack>
    </Stack>
  ),
};

export const ThemeFallback: Story = {
  args: { children: "Uses theme primary" },
  parameters: {
    docs: { description: { story: "Without `colorType`, the button inherits the active MUI theme primary color." } },
  },
};
