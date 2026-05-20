export default function SubdomainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#fff" }}>
      {children}
    </div>
  );
}
