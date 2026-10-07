"use client";

import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import { TablePagination } from "@mui/material";
import { ButtonContained, TablePaginationActions } from "@npm-scope/mks-ui";

export function ClickCounter() {
  const [clicks, setClicks] = useState(0);
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <>
      <ButtonContained
        ref={ref}
        data-testid="contained-primary"
        colorType="primary"
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          setClicks((n) => n + 1);
          event.currentTarget.blur();
        }}
      >
        Simpan
      </ButtonContained>
      <p data-testid="clicks">clicks: {clicks}</p>
    </>
  );
}

export function PaginationDemo() {
  const [page, setPage] = useState(0);
  const [lastCall, setLastCall] = useState("none");
  return (
    <>
      <TablePagination
        component="div"
        count={50}
        page={page}
        rowsPerPage={10}
        rowsPerPageOptions={[10]}
        onPageChange={(event: MouseEvent<HTMLButtonElement> | null, nextPage: number) => {
          setLastCall(`${event ? event.type : "null"}:${nextPage}`);
          setPage(nextPage);
        }}
        ActionsComponent={TablePaginationActions}
      />
      <p data-testid="page">page index: {page}</p>
      <p data-testid="last-call">last call: {lastCall}</p>
    </>
  );
}
