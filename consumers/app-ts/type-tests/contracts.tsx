// Consumer-side type contract. `tsc --noEmit` fails if any @ts-expect-error
// line stops being an error, or if any valid line stops compiling.
import { createRef } from "react";
import type { MouseEvent } from "react";
import { TablePagination } from "@mui/material";
import type { TablePaginationProps } from "@mui/material";
import { ButtonContained, ButtonOutlined, TablePaginationActions } from "@npm-scope/mks-ui";
import type {
  ButtonContainedColorType,
  ButtonContainedProps,
  ButtonOutlinedColorType,
  ButtonOutlinedProps,
  TablePaginationActionsProps,
} from "@npm-scope/mks-ui";

const ref = createRef<HTMLButtonElement>();

export const valid = [
  <ButtonContained key="1" ref={ref} colorType="primary" type="submit" startIcon={<span />} className="a" sx={{ px: 2 }} />,
  <ButtonContained key="2" sx={(theme) => ({ color: theme.palette.error.main })} disabled />,
  <ButtonOutlined key="3" colorType="danger" size="small" sx={[{ px: 1 }, { py: 1 }]} aria-label="Hapus" />,
  <TablePagination
    key="4"
    component="div"
    count={10}
    page={0}
    rowsPerPage={5}
    onPageChange={(_event: MouseEvent<HTMLButtonElement> | null, page: number) => page}
    ActionsComponent={TablePaginationActions}
  />,
];

export const contained: ButtonContainedColorType = "secondary";
export const outlined: ButtonOutlinedColorType = "default";
export const containedProps: ButtonContainedProps = { colorType: "primary", children: "x" };
export const outlinedProps: ButtonOutlinedProps = { colorType: "danger" };
export const slot: TablePaginationProps["ActionsComponent"] = TablePaginationActions;
export const handler: TablePaginationActionsProps["onPageChange"] = (_event, page) => void page;

export const invalid = [
  // @ts-expect-error invalid colorType
  <ButtonContained key="a" colorType="purple" />,
  // @ts-expect-error ButtonContained has no danger color
  <ButtonContained key="b" colorType="danger" />,
  // @ts-expect-error invalid colorType
  <ButtonOutlined key="c" colorType="purple" />,
  // @ts-expect-error variant is fixed by the component
  <ButtonOutlined key="d" variant="contained" />,
  // @ts-expect-error unknown prop
  <ButtonContained key="e" colour="primary" />,
];

// @ts-expect-error the legacy one-argument pagination callback is rejected
export const legacy: TablePaginationActionsProps["onPageChange"] = (page: number) => page;
