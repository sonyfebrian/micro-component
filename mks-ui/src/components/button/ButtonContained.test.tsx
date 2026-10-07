import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { PointerEventsCheckLevel, userEvent } from "@testing-library/user-event";
import { ThemeProvider, createTheme, darken } from "@mui/material";
import { describe, expect, it, vi } from "vitest";
import { ButtonContained } from "./ButtonContained.js";
import { css, cssRulesFor, effectiveStyles } from "../../test-utils/css.js";

const PRIMARY = "#00529C";
const SECONDARY = "#ED6E12";

describe("ButtonContained", () => {
  it("renders its children inside a button", () => {
    render(<ButtonContained colorType="primary">Simpan</ButtonContained>);
    expect(screen.getByRole("button", { name: "Simpan" })).toBeInTheDocument();
  });

  it("calls onClick with the click event", async () => {
    const onClick = vi.fn();
    render(<ButtonContained onClick={onClick}>Simpan</ButtonContained>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0]?.[0]).toHaveProperty("type", "click");
  });

  it("does not fire onClick and applies disabled styling when disabled", async () => {
    const onClick = vi.fn();
    render(
      <ButtonContained colorType="primary" disabled onClick={onClick}>
        Simpan
      </ButtonContained>,
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    await userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never }).click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(effectiveStyles(button, ":disabled")).toMatchObject({
      "background-color": "rgba(0, 0, 0, 0.12)",
      color: "rgba(0, 0, 0, 0.26)",
      "box-shadow": "none",
    });
  });

  it.each([
    ["primary", PRIMARY],
    ["secondary", SECONDARY],
  ] as const)("applies the %s brand color with darkened hover and active", (colorType, hex) => {
    render(<ButtonContained colorType={colorType}>Simpan</ButtonContained>);
    const button = screen.getByRole("button");
    expect(button).toHaveStyle({ backgroundColor: hex, color: "#FFFFFF" });
    expect(effectiveStyles(button, ":hover")["background-color"]).toBe(darken(hex, 0.1));
    expect(effectiveStyles(button, ":active")["background-color"]).toBe(darken(hex, 0.1));
  });

  it("keeps the mks_webapp base styles without needing the mks theme", () => {
    render(<ButtonContained colorType="primary">Simpan</ButtonContained>);
    expect(screen.getByRole("button")).toHaveStyle({
      borderRadius: "7px",
      fontWeight: "500",
      textTransform: "none",
      boxShadow: "none",
    });
  });

  it("reproduces the mks_webapp theme shadows on hover, active and focus", () => {
    render(<ButtonContained colorType="primary">Simpan</ButtonContained>);
    const button = screen.getByRole("button");
    expect(effectiveStyles(button, ":hover")["box-shadow"]).toBe(css("0 0 1px 0 rgba(0,0,0,0.31), 0 3px 4px -2px rgba(0,0,0,0.25)"));
    expect(effectiveStyles(button, ":active")["box-shadow"]).toBe(css("0 9px 17.5px rgb(0,0,0,0.05)"));
    expect(effectiveStyles(button, ".Mui-focusVisible")["box-shadow"]).toBe(css("0 0 1px 0 rgba(0,0,0,0.31), 0 4px 6px -2px rgba(0,0,0,0.25)"));
  });

  it("falls back to the theme primary color when colorType is omitted", () => {
    render(
      <ThemeProvider theme={createTheme({ palette: { primary: { main: "#7B1FA2" } } })}>
        <ButtonContained>Simpan</ButtonContained>
      </ThemeProvider>,
    );
    expect(screen.getByRole("button")).toHaveStyle({ backgroundColor: "#7B1FA2", color: "#FFFFFF" });
  });

  it("passes className through without adding Tailwind classes", () => {
    render(<ButtonContained className="consumer-class w-full">Simpan</ButtonContained>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("consumer-class", "w-full");
    expect(button).not.toHaveClass("cursor-pointer");
  });

  it("lets object sx override the base styles", () => {
    render(
      <ButtonContained colorType="primary" sx={{ backgroundColor: "#010203", minWidth: "164px" }}>
        Simpan
      </ButtonContained>,
    );
    expect(screen.getByRole("button")).toHaveStyle({ backgroundColor: "#010203", minWidth: "164px" });
  });

  it("accepts function sx", () => {
    render(
      <ButtonContained colorType="primary" sx={(theme) => ({ minWidth: theme.spacing(20) })}>
        Simpan
      </ButtonContained>,
    );
    expect(screen.getByRole("button")).toHaveStyle({ minWidth: "160px" });
  });

  it("accepts array sx and applies entries in order", () => {
    render(
      <ButtonContained colorType="primary" sx={[{ minWidth: "100px" }, false, { minWidth: "150px", color: "#000000" }]}>
        Simpan
      </ButtonContained>,
    );
    expect(screen.getByRole("button")).toHaveStyle({ minWidth: "150px", color: "#000000" });
  });

  it("lets hover and active sx override the base (mks_webapp ApprovalActionButtons pattern)", () => {
    const red = "#D64748";
    render(
      <ButtonContained
        sx={{
          backgroundColor: red,
          "&:hover": { backgroundColor: darken(red, 0.1) },
          "&:active": { backgroundColor: darken(red, 0.1) },
        }}
      >
        Kembalikan
      </ButtonContained>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveStyle({ backgroundColor: red });
    expect(effectiveStyles(button, ":hover")["background-color"]).toBe(darken(red, 0.1));
    expect(effectiveStyles(button, ":active")["background-color"]).toBe(darken(red, 0.1));
    expect(cssRulesFor(button)).not.toContain(darken(PRIMARY, 0.1));
  });

  it("forwards refs to the underlying button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<ButtonContained ref={ref}>Simpan</ButtonContained>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toBe(screen.getByRole("button"));
  });

  it("passes other MUI Button props through", () => {
    render(
      <ButtonContained type="submit" aria-label="Kirim" startIcon={<span data-testid="icon" />}>
        Simpan
      </ButtonContained>,
    );
    const button = screen.getByRole("button", { name: "Kirim" });
    expect(button).toHaveAttribute("type", "submit");
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("has a displayName", () => {
    expect(ButtonContained.displayName).toBe("ButtonContained");
  });
});
