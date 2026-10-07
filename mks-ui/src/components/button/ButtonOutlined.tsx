"use client";

import { forwardRef } from "react";
import { Button } from "@mui/material";
import type { ButtonProps, SxProps, Theme } from "@mui/material";
import {
  BUTTON_COLORS,
  WHITE,
  baseButtonSx,
  composeSx,
  disabledButtonSx,
} from "./buttonStyles.js";

export type ButtonOutlinedColorType = "primary" | "secondary" | "default" | "danger";

export interface ButtonOutlinedProps extends Omit<ButtonProps, "variant"> {
  /**
   * Brand color for text, border and hover fill. When omitted, the colors fall
   * back to the MUI theme's primary color, as in mks_webapp.
   */
  colorType?: ButtonOutlinedColorType;
}

function outlinedSx(colorType: ButtonOutlinedColorType | undefined): SxProps<Theme> {
  const color = colorType === undefined ? undefined : BUTTON_COLORS[colorType];
  const border = color === undefined ? {} : { border: `1px solid ${color}` };

  // The white hover text and the theme-primary hover fill reproduce
  // mks_webapp's theme override (MuiButton.styleOverrides.outlinedPrimary).
  return (theme: Theme) => ({
    ...baseButtonSx,
    ...(color === undefined ? {} : { color, ...border }),
    "&:hover": {
      ...border,
      backgroundColor: color ?? theme.palette.primary.main,
      color: WHITE,
    },
    "&:active": { ...border },
    "&:disabled": disabledButtonSx,
  });
}

/** Outlined MUI button with MKS brand colors. All other MUI Button props pass through. */
export const ButtonOutlined = forwardRef<HTMLButtonElement, ButtonOutlinedProps>(
  function ButtonOutlined({ colorType, sx, ...rest }, ref) {
    return (
      <Button
        ref={ref}
        variant="outlined"
        {...rest}
        sx={composeSx(outlinedSx(colorType), sx)}
      />
    );
  },
);

ButtonOutlined.displayName = "ButtonOutlined";
