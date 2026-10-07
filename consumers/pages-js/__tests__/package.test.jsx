import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TablePagination, ThemeProvider, createTheme } from "@mui/material";
import { ButtonContained, ButtonOutlined, TablePaginationActions } from "@npm-scope/mks-ui";

describe("@npm-scope/mks-ui in a CommonJS Jest environment (like mks_webapp)", () => {
  it("resolves the package to its CommonJS build", () => {
    expect(require.resolve("@npm-scope/mks-ui")).toMatch(/dist[\\/]index\.cjs$/);
    const cjs = require("@npm-scope/mks-ui");
    expect(Object.keys(cjs).sort()).toEqual(["ButtonContained", "ButtonOutlined", "TablePaginationActions"]);
  });

  it("renders the buttons and handles clicks", async () => {
    const onClick = jest.fn();
    render(
      <>
        <ButtonContained colorType="primary" onClick={onClick}>Simpan</ButtonContained>
        <ButtonOutlined colorType="danger">Hapus</ButtonOutlined>
      </>,
    );
    const save = screen.getByRole("button", { name: "Simpan" });
    expect(save).toHaveStyle({ backgroundColor: "#00529C", textTransform: "none", boxShadow: "none" });
    expect(screen.getByRole("button", { name: "Hapus" })).toHaveStyle({ color: "#D64748" });
    await userEvent.click(save);
    expect(onClick).toHaveBeenCalledTimes(1);
    // jsdom treats the clicked button as :hover/:active, so the darkened color applies.
    expect(save).toHaveStyle({ backgroundColor: "rgb(0, 73, 140)" });
  });

  it("uses the app theme when colorType is omitted", () => {
    render(
      <ThemeProvider theme={createTheme({ palette: { primary: { main: "#7B1FA2" } } })}>
        <ButtonContained>Tema</ButtonContained>
      </ThemeProvider>,
    );
    expect(screen.getByRole("button", { name: "Tema" })).toHaveStyle({ backgroundColor: "#7B1FA2" });
  });

  it("drives MUI TablePagination with the standard (event, page) callback", async () => {
    const calls = [];
    function Pager() {
      const [page, setPage] = useState(0);
      return (
        <TablePagination
          component="div"
          count={30}
          page={page}
          rowsPerPage={10}
          rowsPerPageOptions={[10]}
          onPageChange={(event, next) => {
            calls.push([event && event.type, next]);
            setPage(next);
          }}
          ActionsComponent={TablePaginationActions}
        />
      );
    }
    render(<Pager />);
    const next = screen.getByRole("button", { name: "Halaman Berikutnya" });
    await userEvent.click(next);
    await userEvent.click(next);
    expect(next).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Halaman Sebelumnya" }));
    expect(calls).toEqual([["click", 1], ["click", 2], ["click", 1]]);
  });
});
