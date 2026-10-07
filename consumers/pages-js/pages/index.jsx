import { useState } from "react";
import { TablePagination } from "@mui/material";
import { ButtonContained, ButtonOutlined, TablePaginationActions } from "@npm-scope/mks-ui";

export default function Home() {
  const [clicks, setClicks] = useState(0);
  const [page, setPage] = useState(0);
  const [lastCall, setLastCall] = useState("none");

  return (
    <main style={{ padding: 24, display: "grid", gap: 16, maxWidth: 720 }}>
      <h1>Consumer A: JavaScript, Pages Router</h1>

      <section style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <ButtonContained data-testid="contained-primary" colorType="primary" onClick={() => setClicks((n) => n + 1)}>
          Simpan
        </ButtonContained>
        <ButtonContained data-testid="contained-secondary" colorType="secondary">Kirim</ButtonContained>
        <ButtonContained data-testid="contained-theme">Tema</ButtonContained>
        <ButtonContained data-testid="contained-disabled" colorType="primary" disabled>Nonaktif</ButtonContained>
      </section>

      <section style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <ButtonOutlined data-testid="outlined-primary" colorType="primary">Kembali</ButtonOutlined>
        <ButtonOutlined data-testid="outlined-secondary" colorType="secondary">Ubah</ButtonOutlined>
        <ButtonOutlined data-testid="outlined-default" colorType="default">Batal</ButtonOutlined>
        <ButtonOutlined data-testid="outlined-danger" colorType="danger">Hapus</ButtonOutlined>
        <ButtonOutlined data-testid="outlined-theme">Tema</ButtonOutlined>
      </section>

      <p data-testid="clicks">clicks: {clicks}</p>

      <TablePagination
        component="div"
        count={50}
        page={page}
        rowsPerPage={10}
        rowsPerPageOptions={[10]}
        onPageChange={(event, nextPage) => {
          setLastCall(`${event ? event.type : "null"}:${nextPage}`);
          setPage(nextPage);
        }}
        ActionsComponent={TablePaginationActions}
      />
      <p data-testid="page">page index: {page}</p>
      <p data-testid="last-call">last call: {lastCall}</p>
    </main>
  );
}
