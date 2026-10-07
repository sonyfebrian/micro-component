// A Server Component. The package's components are imported directly, with no
// local "use client" wrapper. ButtonOutlined without colorType builds a
// function-valued sx internally, which would fail across a server/client
// boundary if the package's "use client" directive were missing.
import { ButtonContained, ButtonOutlined } from "@npm-scope/mks-ui";
import { ClickCounter, PaginationDemo } from "./interactive";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main style={{ padding: 24, display: "grid", gap: 16, maxWidth: 720 }}>
      <h1>Consumer B: TypeScript, App Router</h1>
      <p data-testid="rendered-at">rendered at {new Date().toISOString()}</p>

      <section style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <ClickCounter />
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

      <PaginationDemo />
    </main>
  );
}
