import type { SxProps, Theme } from "@mui/material";

/**
 * Internal POC color map copied from mks_webapp
 * (src/components/atoms/buttons/{contained,outlined}.jsx).
 * Not exported from the package. The final token/theme architecture comes later.
 */
export const BUTTON_COLORS = {
  primary: "#00529C",
  secondary: "#ED6E12",
  default: "#BDBDBD",
  danger: "#D64748",
} as const;

export type ButtonColorKey = keyof typeof BUTTON_COLORS;

export const WHITE = "#FFFFFF";

/**
 * Shadows that mks_webapp's MUI theme applies to contained buttons
 * (src/utils/theme/Shadows.jsx, theme.shadows[2], [4], [6] and [8]).
 * Hardcoded so the buttons look the same under any consumer theme.
 */
export const BUTTON_SHADOWS = {
  touchHover: "0 0 1px 0 rgba(0,0,0,0.31), 0 2px 2px -2px rgba(0,0,0,0.25)",
  hover: "0 0 1px 0 rgba(0,0,0,0.31), 0 3px 4px -2px rgba(0,0,0,0.25)",
  focusVisible: "0 0 1px 0 rgba(0,0,0,0.31), 0 4px 6px -2px rgba(0,0,0,0.25)",
  active: "0 9px 17.5px rgb(0,0,0,0.05)",
} as const;

/**
 * Base styles shared by both buttons. textTransform and the resting boxShadow
 * come from mks_webapp's theme override (MuiButton.styleOverrides.root).
 */
export const baseButtonSx = {
  borderRadius: "7px",
  fontWeight: "500",
  textTransform: "none",
  boxShadow: "none",
} as const;

export const disabledButtonSx = {
  color: "rgba(0, 0, 0, 0.26)",
  boxShadow: "none",
  backgroundColor: "rgba(0, 0, 0, 0.12)",
} as const;

type SxArray = Extract<SxProps<Theme>, ReadonlyArray<unknown>>;

function isSxArray(sx: SxProps<Theme>): sx is SxArray {
  return Array.isArray(sx);
}

/**
 * Composes the package's base sx with the consumer's sx using MUI's array form.
 * Later entries win, so consumer object, function and array sx all override the base.
 */
export function composeSx(base: SxProps<Theme>, sx: SxProps<Theme> | undefined): SxProps<Theme> {
  const baseEntries = isSxArray(base) ? base : [base];
  if (sx === undefined || sx === null) {
    return [...baseEntries];
  }
  const consumerEntries = isSxArray(sx) ? sx : [sx];
  return [...baseEntries, ...consumerEntries];
}
