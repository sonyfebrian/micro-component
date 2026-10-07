import Home from "./index";

// Rendered on every request, like mks_webapp pages that use getServerSideProps.
export async function getServerSideProps() {
  return { props: { renderedAt: new Date().toISOString() } };
}

export default function SsrPage({ renderedAt }) {
  return (
    <>
      <p data-testid="rendered-at">rendered at {renderedAt}</p>
      <Home />
    </>
  );
}
