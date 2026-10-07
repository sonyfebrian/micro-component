import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { PointerEventsCheckLevel, userEvent } from "@testing-library/user-event";
import { ThemeProvider, createTheme } from "@mui/material";
import { describe, expect, it, vi } from "vitest";
import { ButtonOutlined } from "./ButtonOutlined.js";
import { effectiveStyles } from "../../test-utils/css.js";

describe("ButtonOutlined", () => {
  it("renders its children inside a button", () => {
    render(<ButtonOutlined colorType="primary">Kembali</ButtonOutlined>);
    expect(screen.getByRole("button", { name: "Kembali" })).toBeInTheDocument();
  });

  it("calls onClick with the click event", async () => {
    const onClick = vi.fn();
    render(<ButtonOutlined onClick={onClick}>Kembali</ButtonOutlined>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0]?.[0]).toHaveProperty("type", "click");
  });

  it("does not fire onClick and applies disabled styling when disabled", async () => {
    const onClick = vi.fn();
    render(
      <ButtonOutlined colorType="danger" disabled onClick={onClick}>
        Hapus
      </ButtonOutlined>,
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    await userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never }).click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(effectiveStyles(button, ":disabled")["background-color"]).toBe("rgba(0, 0, 0, 0.12)");
  });

  it.each([
    ["primary", "#00529C"],
    ["secondary", "#ED6E12"],
    ["default", "#BDBDBD"],
    ["danger", "#D64748"],
  ] as const)("applies the %s color to text, border and hover fill", (colorType, hex) => {
    render(<ButtonOutlined colorType={colorType}>Aksi</ButtonOutlined>);
    const button = screen.getByRole("button");
    expect(button).toHaveStyle({ color: hex });
    expect(effectiveStyles(button)).toMatchObject({ color: hex, border: `1px solid ${hex}` });
    expect(effectiveStyles(button, ":hover")).toMatchObject({
      "background-color": hex,
      border: `1px solid ${hex}`,
      color: "#FFFFFF",
    });
    expect(effectiveStyles(button, ":active").border).toBe(`1px solid ${hex}`);
  });

  it("keeps the mks_webapp base styles without needing the mks theme", () => {
    render(<ButtonOutlined colorType="primary">Kembali</ButtonOutlined>);
    expect(screen.getByRole("button")).toHaveStyle({
      borderRadius: "7px",
      fontWeight: "500",
      textTransform: "none",
      boxShadow: "none",
    });
  });

  it("uses the theme primary color for the hover fill when colorType is omitted", () => {
    render(
      <ThemeProvider theme={createTheme({ palette: { primary: { main: "#7B1FA2" } } })}>
        <ButtonOutlined>Kembali</ButtonOutlined>
      </ThemeProvider>,
    );
    expect(effectiveStyles(screen.getByRole("button"), ":hover")).toMatchObject({
      "background-color": "#7B1FA2",
      color: "#FFFFFF",
    });
  });

  it("passes className through without adding Tailwind classes", () => {
    render(<ButtonOutlined className="w-full mb-4">Kembali</ButtonOutlined>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("w-full", "mb-4");
    expect(button).not.toHaveClass("cursor-pointer");
  });

  it("lets object, function and array sx override the base styles", () => {
    render(
      <>
        <ButtonOutlined colorType="primary" sx={{ color: "#010203" }}>A</ButtonOutlined>
        <ButtonOutlined colorType="primary" sx={() => ({ color: "#040506" })}>B</ButtonOutlined>
        <ButtonOutlined colorType="primary" sx={[{ color: "#070809" }, { minWidth: "120px" }]}>C</ButtonOutlined>
      </>,
    );
    expect(screen.getByRole("button", { name: "A" })).toHaveStyle({ color: "#010203" });
    expect(screen.getByRole("button", { name: "B" })).toHaveStyle({ color: "#040506" });
    expect(screen.getByRole("button", { name: "C" })).toHaveStyle({ color: "#070809", minWidth: "120px" });
  });

  it("lets hover sx override the base hover colors", () => {
    render(
      <ButtonOutlined colorType="primary" sx={{ "&:hover": { color: "#000000", backgroundColor: "#EEEEEE" } }}>
        Kembali
      </ButtonOutlined>,
    );
    expect(effectiveStyles(screen.getByRole("button"), ":hover")).toMatchObject({
      color: "#000000",
      "background-color": "#EEEEEE",
    });
  });

  it("forwards refs to the underlying button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<ButtonOutlined ref={ref}>Kembali</ButtonOutlined>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("passes other MUI Button props through", () => {
    render(
      <ButtonOutlined size="small" aria-label="Unduh" startIcon={<span data-testid="icon" />}>
        Excel
      </ButtonOutlined>,
    );
    expect(screen.getByRole("button", { name: "Unduh" })).toHaveClass("MuiButton-sizeSmall");
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("has a displayName", () => {
    expect(ButtonOutlined.displayName).toBe("ButtonOutlined");
  });
});
