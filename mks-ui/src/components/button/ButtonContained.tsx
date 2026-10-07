"use client";

import { forwardRef } from "react";
import { Button, darken } from "@mui/material";
import type { ButtonProps, SxProps, Theme } from "@mui/material";
import {
  BUTTON_COLORS,
  BUTTON_SHADOWS,
  WHITE,
  baseButtonSx,
  composeSx,
  disabledButtonSx,
} from "./buttonStyles.js";

export type ButtonContainedColorType = "primary" | "secondary";

export interface ButtonContainedProps extends Omit<ButtonProps, "variant"> {
  /**
   * Brand color. When omitted, the background falls back to the MUI theme's
   * primary color, as in mks_webapp.
   */
  colorType?: ButtonContainedColorType;
}

function containedSx(colorType: ButtonContainedColorType | undefined): SxProps<Theme> {
  const color = colorType === undefined ? undefined : BUTTON_COLORS[colorType];
  const pressedBackground = color === undefined ? {} : { backgroundColor: darken(color, 0.1) };

  return {
    ...baseButtonSx,
    ...(color === undefined ? {} : { backgroundColor: color }),
    color: WHITE,
    "&:hover": {
      ...pressedBackground,
      boxShadow: BUTTON_SHADOWS.hover,
      "@media (hover: none)": { boxShadow: BUTTON_SHADOWS.touchHover },
    },
    "&:active": { ...pressedBackground, boxShadow: BUTTON_SHADOWS.active },
    "&.Mui-focusVisible": { boxShadow: BUTTON_SHADOWS.focusVisible },
    "&:disabled": disabledButtonSx,
  };
}

/** Filled MUI button with MKS brand colors. All other MUI Button props pass through. */
export const ButtonContained = forwardRef<HTMLButtonElement, ButtonContainedProps>(
  function ButtonContained({ colorType, sx, ...rest }, ref) {
    return (
      <Button
        ref={ref}
        variant="contained"
        {...rest}
        sx={composeSx(containedSx(colorType), sx)}
      />
    );
  },
);

ButtonContained.displayName = "ButtonContained";
