"use client";

import type { ElementType, ReactElement } from "react";
import { IconButton } from "@mui/material";
import type { TablePaginationProps } from "@mui/material";
import { KeyboardArrowLeftIcon, KeyboardArrowRightIcon } from "./icons.js";

type MuiActionsComponent = NonNullable<TablePaginationProps["ActionsComponent"]>;

/**
 * The props MUI's TablePagination passes to its ActionsComponent.
 * Derived from the public TablePaginationProps because MUI 5 does not export
 * TablePaginationActionsProps from the package root.
 */
export type TablePaginationActionsProps =
  MuiActionsComponent extends ElementType<infer P> ? P : never;

const PREVIOUS_LABEL = "Halaman Sebelumnya";
const NEXT_LABEL = "Halaman Berikutnya";

/**
 * Previous/next actions for MUI TablePagination.
 *
 * Uses MUI's standard callback contract: onPageChange(event, page).
 * Aria labels are fixed in Indonesian for this POC, so MUI's default
 * English getItemAriaLabel is intentionally not used.
 */
export function TablePaginationActions(props: TablePaginationActionsProps): ReactElement {
  const { count, page, rowsPerPage, onPageChange, disabled = false } = props;

  const isFirstPage = page <= 0;
  const isLastPage = count !== -1 && page >= Math.ceil(count / rowsPerPage) - 1;

  return (
    <>
      <IconButton
        onClick={(event) => onPageChange(event, page - 1)}
        disabled={disabled || isFirstPage}
        aria-label={PREVIOUS_LABEL}
      >
        <KeyboardArrowLeftIcon />
      </IconButton>
      <IconButton
        onClick={(event) => onPageChange(event, page + 1)}
        disabled={disabled || isLastPage}
        aria-label={NEXT_LABEL}
      >
        <KeyboardArrowRightIcon />
      </IconButton>
    </>
  );
}

TablePaginationActions.displayName = "TablePaginationActions";
