import { Stack, Typography } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonOutlined } from "./ButtonOutlined.js";

const meta = {
  title: "Components / Buttons / Outlined",
  component: ButtonOutlined,
  args: { children: "Kembali", colorType: "primary" },
  argTypes: {
    colorType: { control: "select", options: ["primary", "secondary", "default", "danger"] },
    children: { control: "text" },
  },
  parameters: { layout: "centered" },
} satisfies Meta<typeof ButtonOutlined>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ActionStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack spacing={2.5} alignItems="flex-start">
      <Typography variant="overline" color="text.secondary">Secondary actions</Typography>
      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
        <ButtonOutlined colorType="primary">Kembali</ButtonOutlined>
        <ButtonOutlined colorType="secondary">Ubah</ButtonOutlined>
        <ButtonOutlined colorType="default">Batal</ButtonOutlined>
        <ButtonOutlined colorType="danger">Hapus</ButtonOutlined>
        <ButtonOutlined disabled>Nonaktif</ButtonOutlined>
      </Stack>
    </Stack>
  ),
};
