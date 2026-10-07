/**
 * Compile-time contract tests. Checked by `tsc --noEmit`, never executed.
 * Every @ts-expect-error must produce an error, otherwise tsc fails.
 */
import { createRef } from "react";
import type { MouseEvent } from "react";
import { TablePagination } from "@mui/material";
import type { TablePaginationProps } from "@mui/material";
import {
  ButtonContained,
  ButtonOutlined,
  TablePaginationActions,
} from "../src/index.js";
import type {
  ButtonContainedColorType,
  ButtonOutlinedColorType,
  TablePaginationActionsProps,
} from "../src/index.js";

// ---- Valid usage -----------------------------------------------------------

const ref = createRef<HTMLButtonElement>();

export const valid = [
  <ButtonContained key="a" colorType="primary">Simpan</ButtonContained>,
  <ButtonContained key="b" colorType="secondary" disabled type="submit" />,
  <ButtonContained key="c" ref={ref} className="x" startIcon={<span />} />,
  <ButtonContained key="d" sx={{ minWidth: 164 }} />,
  <ButtonContained key="e" sx={(theme) => ({ color: theme.palette.error.main })} />,
  <ButtonContained key="f" sx={[{ px: 2 }, (theme) => ({ py: theme.spacing(1) })]} />,
  <ButtonContained key="g" onClick={(event: MouseEvent<HTMLButtonElement>) => event.preventDefault()} />,
  <ButtonOutlined key="h" colorType="danger" size="small" aria-label="Hapus" />,
  <ButtonOutlined key="i" colorType="default" ref={ref} fullWidth />,
  <TablePagination
    key="j"
    component="div"
    count={50}
    page={0}
    rowsPerPage={10}
    onPageChange={(_event, page: number) => page}
    ActionsComponent={TablePaginationActions}
  />,
];

// Union members stay exactly as in mks_webapp.
export const containedColors: ButtonContainedColorType[] = ["primary", "secondary"];
export const outlinedColors: ButtonOutlinedColorType[] = ["primary", "secondary", "default", "danger"];

// The package component must be assignable to MUI's ActionsComponent slot.
export const actionsSlot: TablePaginationProps["ActionsComponent"] = TablePaginationActions;

// The derived props type must not collapse to `never` and must use MUI's callback contract.
type OnPageChange = TablePaginationActionsProps["onPageChange"];
export const onPageChange: OnPageChange = (_event: MouseEvent<HTMLButtonElement> | null, page: number) => {
  void page;
};

// ---- Invalid usage: each line below must be a type error -------------------

export const invalid = [
  // @ts-expect-error colorType "purple" is not a valid ButtonContained color
  <ButtonContained key="1" colorType="purple" />,
  // @ts-expect-error ButtonContained does not support the "danger" color
  <ButtonContained key="2" colorType="danger" />,
  // @ts-expect-error colorType "purple" is not a valid ButtonOutlined color
  <ButtonOutlined key="3" colorType="purple" />,
  // @ts-expect-error variant is fixed by the component
  <ButtonContained key="4" variant="outlined" />,
  // @ts-expect-error variant is fixed by the component
  <ButtonOutlined key="5" variant="text" />,
  // @ts-expect-error disabled must be a boolean
  <ButtonContained key="6" disabled="yes" />,
  // @ts-expect-error ref must point to a button element
  <ButtonContained key="7" ref={createRef<HTMLDivElement>()} />,
];

// @ts-expect-error the legacy one-argument callback is not the package contract
export const legacyCallback: OnPageChange = (page: number) => page;
