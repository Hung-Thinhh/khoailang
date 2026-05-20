import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SubdomainPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return <div>Configuration error</div>;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: subdomain, error } = await supabase
    .from("subdomains")
    .select("*")
    .eq("name", name)
    .maybeSingle();

  if (error) {
    console.error("Subdomain query error:", error);
  }

  if (!subdomain) {
    notFound();
  }

  // If hosting_type = "ip", show info page
  if (subdomain.hosting_type === "ip") {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        color: "#e2e8f0",
        fontFamily: "system-ui, sans-serif",
        padding: "40px 20px",
        textAlign: "center",
      }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "16px" }}>🔗 {name}.khoai.to</h1>
        <p style={{ opacity: 0.7, marginBottom: "24px" }}>Subdomain này trỏ về IP:</p>
        <code style={{
          background: "rgba(255,255,255,0.1)",
          padding: "12px 24px",
          borderRadius: "8px",
          fontSize: "1.5rem",
          fontWeight: 700,
        }}>
          {subdomain.ip_address}
        </code>
        <p style={{ opacity: 0.5, marginTop: "32px", fontSize: "0.85rem" }}>
          DNS A record: {name}.khoai.to → {subdomain.ip_address}
        </p>
      </div>
    );
  }

  // If hosting_type = "html" but not published yet
  if (subdomain.status !== "published") {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fef3c7",
        color: "#92400e",
        fontFamily: "system-ui, sans-serif",
        padding: "40px 20px",
        textAlign: "center",
      }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "16px" }}>🚧 {name}.khoai.to</h1>
        <p>Trang này đang ở chế độ Draft.</p>
        <p style={{ opacity: 0.7, marginTop: "8px" }}>Chủ sở hữu chưa publish trang này.</p>
      </div>
    );
  }

  // Serve the published HTML
  return (
    <iframe
      srcDoc={subdomain.html_content}
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
        display: "block",
      }}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      title={`${name}.khoai.to`}
    />
  );
}
