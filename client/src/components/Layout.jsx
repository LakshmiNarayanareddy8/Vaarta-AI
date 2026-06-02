import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="layout-container" style={{ marginTop: '100px', paddingBottom: '60px' }}>
        {children}
      </main>
    </div>
  );
}