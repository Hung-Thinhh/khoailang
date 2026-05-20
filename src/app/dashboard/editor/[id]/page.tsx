"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TEMPLATE_HTML } from "@/data/template-html";

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sắp Ra Mắt</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#0f4c3a,#1a6b4a,#0d3d2f);color:#fff;font-family:system-ui,sans-serif;padding:40px 20px}
.badge{background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);border-radius:20px;padding:6px 16px;font-size:.85rem;margin-bottom:24px;display:inline-block}
h1{font-size:clamp(2rem,6vw,3.5rem);font-weight:900;text-align:center;margin-bottom:12px;line-height:1.2}
.sub{color:rgba(255,255,255,.75);font-size:1.05rem;text-align:center;max-width:480px;line-height:1.6;margin-bottom:32px}
.clock{display:flex;gap:20px;margin-bottom:40px;flex-wrap:wrap;justify-content:center}
.unit{text-align:center;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);border-radius:12px;padding:16px 20px;min-width:80px}
.num{font-size:2.4rem;font-weight:900;line-height:1;display:block}
.lbl{font-size:.7rem;opacity:.7;margin-top:4px;text-transform:uppercase;letter-spacing:.08em}
.form{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;max-width:420px;width:100%}
.form input{flex:1;min-width:200px;padding:14px 20px;border-radius:12px;border:none;font-size:1rem}
.form input::placeholder{color:rgba(255,255,255,.5)}
.form button{padding:14px 24px;border-radius:12px;border:none;background:#fff;color:#1a4a0a;font-weight:700;cursor:pointer}
.form button:hover{transform:translateY(-2px)}
.dots{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:hidden}
.dot{position:absolute;border-radius:50%;background:rgba(255,255,255,0.15);opacity:1;animation:rise linear infinite}
@keyframes rise{from{transform:translateY(100vh)}to{transform:translateY(-200px)}}
.content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center}
</style>
</head>
<body>
<div class="dots"></div>
<div class="content">
<span class="badge">🌱 SẮP RA MẮT</span>
<h1>Điều gì đó tuyệt vời đang đến</h1>
<p class="sub">Chúng tôi đang chuẩn bị thứ gì đó đặc biệt. Đăng ký để nhận thông báo sớm nhất!</p>
<div class="clock" id="clock"></div>
<div class="form">
<input type="email" placeholder="Nhập email của bạn...">
<button>Thông báo tôi 🔔</button>
</div>
</div>
<script>
const target=new Date();target.setDate(target.getDate()+30);
function update(){const n=target-new Date();const d=Math.floor(n/864e5);const h=Math.floor(n%864e5/36e5);const m=Math.floor(n%36e5/6e4);const s=Math.floor(n%6e4/1e3);document.getElementById('clock').innerHTML=[[d,'NGÀY'],[h,'GIỜ'],[m,'PHÚT'],[s,'GIÂY']].map(([v,l])=>\`<div class="unit"><span class="num">\${String(v).padStart(2,'0')}</span><span class="lbl">\${l}</span></div>\`).join('')}
update();setInterval(update,1000);
for(let i=0;i<20;i++){const d=document.createElement('div');d.className='dot';d.style.width=d.style.height=Math.random()*60+20+'px';d.style.left=Math.random()*100+'%';d.style.animationDuration=Math.random()*10+8+'s';d.style.animationDelay=Math.random()*5+'s';document.querySelector('.dots').appendChild(d)}
</script>
</body>
</html>`;

export default function EditorPage() {
  const params = useParams();
  const subdomainId = Number(params.id);
  
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [lastSaved, setLastSaved] = useState("");
  const [viewMode, setViewMode] = useState<"split" | "code" | "preview">("split");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [subdomain, setSubdomain] = useState("loading");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const header = document.getElementById("header");
    const footer = document.querySelector("footer.footer");
    if (header) header.style.display = "none";
    if (footer) (footer as HTMLElement).style.display = "none";

    // Load subdomain data from DB
    async function loadData() {
      const res = await fetch(`/api/subdomains/${subdomainId}`);
      if (res.ok) {
        const data = await res.json();
        setCode(data.html_content || DEFAULT_HTML);
        setStatus(data.status || "draft");
        setSubdomain(data.name || "subdomain");
      } else {
        // Fallback: try loading from template
        const templateHtml = TEMPLATE_HTML[subdomainId];
        if (templateHtml) setCode(templateHtml);
        else setCode(DEFAULT_HTML);
        setSubdomain(localStorage.getItem("editor_subdomain") || "subdomain");
      }
    }
    loadData();

    return () => {
      if (header) header.style.display = "";
      if (footer) (footer as HTMLElement).style.display = "";
    };
  }, [subdomainId]);

  const lineCount = code.split("\n").length;

  const handlePublish = async () => {
    setSaving(true);
    const res = await fetch(`/api/subdomains/${subdomainId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html_content: code, status: "published" }),
    });
    if (res.ok) {
      setStatus("published");
      setLastSaved("Đã lưu " + new Date().toLocaleTimeString("vi-VN"));
      alert("✅ Đã publish thành công!");
    } else {
      const data = await res.json();
      alert(`❌ Lỗi: ${data.error}`);
    }
    setSaving(false);
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    const res = await fetch(`/api/subdomains/${subdomainId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html_content: code }),
    });
    if (res.ok) {
      setLastSaved("Đã lưu " + new Date().toLocaleTimeString("vi-VN"));
    }
    setSaving(false);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".html,.htm";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setCode(ev.target?.result as string);
          setStatus("draft");
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="editor-page">
      {/* Editor Header */}
      <div className="editor-header">
        <div className="editor-header-left">
          <Link href="/garden" className="editor-back">← Dashboard</Link>
          <span className="editor-domain">🌿 {subdomain}.khoai.to</span>
          <span className={`editor-status ${status}`}>
            ● {status === "draft" ? "Draft" : "Published"}
          </span>
        </div>
        <div className="editor-header-center">
          <button
            className={`view-btn ${viewMode === "code" ? "active" : ""}`}
            onClick={() => setViewMode("code")}
            title="Code only"
          >
            &lt;/&gt;
          </button>
          <button
            className={`view-btn ${viewMode === "split" ? "active" : ""}`}
            onClick={() => setViewMode("split")}
            title="Split view"
          >
            ⊞
          </button>
          <button
            className={`view-btn ${viewMode === "preview" ? "active" : ""}`}
            onClick={() => setViewMode("preview")}
            title="Preview only"
          >
            👁
          </button>
        </div>
        <div className="editor-header-right">
          <button className="editor-btn editor-btn--preview" onClick={() => setViewMode("preview")}>
            👁 Preview
          </button>
          <button className="editor-btn editor-btn--import" onClick={handleSaveDraft} disabled={saving}>
            💾 Lưu nháp
          </button>
          <button className="editor-btn editor-btn--publish" onClick={handlePublish} disabled={saving}>
            🚀 Publish
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className={`editor-body editor-body--${viewMode}`}>
        {/* Code Panel */}
        {viewMode !== "preview" && (
          <div className="editor-code-panel">
            <div className="code-panel-header">
              <span>📄 index.html</span>
              <span className="code-info">{lineCount} dòng · {code.length.toLocaleString()} ký tự · Ctrl+S Lưu nhập</span>
            </div>
            <div className="code-editor-wrapper">
              <div className="line-numbers">
                {Array.from({ length: lineCount }, (_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>
              <textarea
                className="code-textarea"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setStatus("draft");
                }}
                spellCheck={false}
              />
            </div>
          </div>
        )}

        {/* Preview Panel */}
        {viewMode !== "code" && (
          <div className="editor-preview-panel">
            <div className="preview-panel-header">
              <span>👁 Preview (live)</span>
              <span className="preview-info">{lastSaved}</span>
            </div>
            <iframe
              ref={iframeRef}
              className="preview-iframe"
              srcDoc={code}
              sandbox="allow-scripts allow-same-origin"
              title="Preview"
            />
          </div>
        )}
      </div>

      {/* Editor Footer */}
      <div className="editor-footer">
        <span>HTML Editor · {subdomain}.khoai.to</span>
        <span>{status === "draft" ? "Draft — Nhấn Publish để xuất bản" : "✅ Published"}</span>
      </div>
    </div>
  );
}
