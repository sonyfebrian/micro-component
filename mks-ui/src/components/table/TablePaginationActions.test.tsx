import { render, screen } from "@testing-library/react";
import { PointerEventsCheckLevel, userEvent } from "@testing-library/user-event";
import { TablePagination } from "@mui/material";
import type { TablePaginationProps } from "@mui/material";
import { describe, expect, it, vi } from "vitest";
import { TablePaginationActions } from "./TablePaginationActions.js";

type PaginationOverrides = Partial<Pick<TablePaginationProps, "count" | "page" | "rowsPerPage" | "disabled">>;

function renderPagination(overrides: PaginationOverrides = {}) {
  const onPageChange = vi.fn();
  render(
    <TablePagination
      component="div"
      count={50}
      page={0}
      rowsPerPage={10}
      rowsPerPageOptions={[10]}
      onPageChange={onPageChange}
      ActionsComponent={TablePaginationActions}
      {...overrides}
    />,
  );
  return {
    onPageChange,
    previous: screen.getByRole("button", { name: "Halaman Sebelumnya" }),
    next: screen.getByRole("button", { name: "Halaman Berikutnya" }),
  };
}

describe("TablePaginationActions", () => {
  it("renders Indonesian aria labels instead of MUI's English defaults", () => {
    renderPagination();
    expect(screen.getByRole("button", { name: "Halaman Sebelumnya" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Halaman Berikutnya" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Go to next page")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Go to previous page")).not.toBeInTheDocument();
  });

  it("renders the same arrow icons as before", () => {
    renderPagination();
    expect(screen.getByTestId("KeyboardArrowLeftIcon")).toBeInTheDocument();
    expect(screen.getByTestId("KeyboardArrowRightIcon")).toBeInTheDocument();
  });

  it("disables previous and enables next on the first page", () => {
    const { previous, next } = renderPagination({ page: 0 });
    expect(previous).toBeDisabled();
    expect(next).toBeEnabled();
  });

  it("disables next and enables previous on the last page", () => {
    const { previous, next } = renderPagination({ page: 4 });
    expect(previous).toBeEnabled();
    expect(next).toBeDisabled();
  });

  it("calls onPageChange(event, page + 1) when next is clicked", async () => {
    const { onPageChange, next } = renderPagination({ page: 1 });
    await userEvent.click(next);
    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(expect.objectContaining({ type: "click" }), 2);
  });

  it("calls onPageChange(event, page - 1) when previous is clicked", async () => {
    const { onPageChange, previous } = renderPagination({ page: 2 });
    await userEvent.click(previous);
    expect(onPageChange).toHaveBeenCalledWith(expect.objectContaining({ type: "click" }), 1);
  });

  it("uses MUI's two-argument callback signature with a React mouse event", async () => {
    const { onPageChange, next } = renderPagination({ page: 0 });
    await userEvent.click(next);
    const args = onPageChange.mock.calls[0] ?? [];
    expect(args).toHaveLength(2);
    expect(args[0]).toHaveProperty("nativeEvent");
    expect(args[0]).toHaveProperty("currentTarget");
    expect(typeof args[1]).toBe("number");
  });

  it("disables both buttons and never calls back when TablePagination is disabled", async () => {
    const { onPageChange, previous, next } = renderPagination({ page: 2, disabled: true });
    expect(previous).toBeDisabled();
    expect(next).toBeDisabled();
    await userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never }).click(next);
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("disables both buttons when there are no rows", () => {
    const { previous, next } = renderPagination({ count: 0, page: 0 });
    expect(previous).toBeDisabled();
    expect(next).toBeDisabled();
  });

  it("keeps next enabled when the total count is unknown (-1)", () => {
    const { next } = renderPagination({ count: -1, page: 7 });
    expect(next).toBeEnabled();
  });

  it("has a displayName", () => {
    expect(TablePaginationActions.displayName).toBe("TablePaginationActions");
  });
});
