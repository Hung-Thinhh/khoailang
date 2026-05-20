const https = require('https');
const fs = require('fs');
const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjExLCJlbWFpbCI6Imh1bmd0aGluaGgyMDAzQGdtYWlsLmNvbSIsImlzQWRtaW4iOmZhbHNlLCJleHAiOjE3Nzk3NzUwOTN9.oWAwoZ2ehJFZDUXLrGCIyOOpsCWrUcs3Nho31y-r5fI';

const TEMPLATES_META = [
  {id:1,name:"Sắp Ra Mắt – Xanh Lá",category:"Coming Soon",description:"Trang chờ chủ đề xanh lá tươi, có đồng hồ đếm ngược JS và ô nhập email.",thumbnail:"🌱",sort_order:1},
  {id:2,name:"Sắp Ra Mắt – Tối Giản",category:"Coming Soon",description:"Thiết kế tối giản kiểu dark, chữ to, đẹp mắt và sang trọng.",thumbnail:"🌑",sort_order:2},
  {id:3,name:"Sắp Ra Mắt – Gradient",category:"Coming Soon",description:"Nền gradient tím-hồng sống động, phong cách hiện đại.",thumbnail:"💜",sort_order:3},
  {id:4,name:"Portfolio Lập Trình Viên",category:"Portfolio",description:"Portfolio dành cho developer: giới thiệu bản thân, kỹ năng, dự án và liên hệ.",thumbnail:"💻",sort_order:10},
  {id:5,name:"CV Cá Nhân",category:"Portfolio",description:"CV online dạng một trang, có ảnh đại diện, kinh nghiệm và học vấn.",thumbnail:"📄",sort_order:11},
  {id:6,name:"Portfolio Sáng Tạo",category:"Portfolio",description:"Portfolio nghệ thuật với layout bất đối xứng, phong cách bold.",thumbnail:"🎨",sort_order:12},
  {id:7,name:"Landing Page Sản Phẩm",category:"Landing Page",description:"Trang giới thiệu sản phẩm với hero section, tính năng và CTA.",thumbnail:"🚀",sort_order:20},
  {id:8,name:"Landing Page Dịch Vụ",category:"Landing Page",description:"Giới thiệu dịch vụ chuyên nghiệp với testimonials và pricing.",thumbnail:"🏢",sort_order:21},
  {id:9,name:"Nhà Hàng",category:"Nhà Hàng & Ẩm Thực",description:"Trang giới thiệu nhà hàng với menu nổi bật.",thumbnail:"🍽️",sort_order:30},
  {id:10,name:"Quán Cà Phê",category:"Nhà Hàng & Ẩm Thực",description:"Landing page cho quán cà phê.",thumbnail:"☕",sort_order:31},
  {id:11,name:"Sự Kiện / Hội Nghị",category:"Sự Kiện",description:"Trang giới thiệu sự kiện với lịch trình và đăng ký.",thumbnail:"🎤",sort_order:40},
  {id:12,name:"Tiệc / Buổi Biểu Diễn",category:"Sự Kiện",description:"Trang sự kiện nhạc sống, party.",thumbnail:"🎵",sort_order:41},
  {id:13,name:"Blog Cá Nhân",category:"Cá Nhân",description:"Trang blog cá nhân với danh sách bài viết.",thumbnail:"✍️",sort_order:50},
  {id:14,name:"Link in Bio",category:"Cá Nhân",description:"Trang tổng hợp link kiểu Linktree.",thumbnail:"🔗",sort_order:51},
  {id:15,name:"Giới Thiệu Công Ty",category:"Doanh Nghiệp",description:"Trang giới thiệu công ty chuyên nghiệp.",thumbnail:"🏢",sort_order:60},
  {id:16,name:"Cửa Hàng Online",category:"Doanh Nghiệp",description:"Trang giới thiệu cửa hàng online.",thumbnail:"🛍️",sort_order:61},
  {id:17,name:"CV Matrix Dark",category:"CV Cá Nhân",description:"CV nền đen với hiệu ứng mưa ký tự matrix.",thumbnail:"💻",sort_order:30},
  {id:18,name:"CV Timeline Reveal",category:"CV Cá Nhân",description:"CV với timeline dọc animated.",thumbnail:"📋",sort_order:31},
  {id:19,name:"CV Neon Cyberpunk",category:"CV Cá Nhân",description:"CV phong cách cyberpunk neon.",thumbnail:"⚡",sort_order:32},
  {id:20,name:"CV 3D Glass Card",category:"CV Cá Nhân",description:"CV glassmorphism với hiệu ứng 3D tilt.",thumbnail:"🔮",sort_order:33},
  {id:21,name:"Portfolio Particle Network",category:"Portfolio",description:"Portfolio với particles canvas tương tác.",thumbnail:"✨",sort_order:34},
  {id:22,name:"Portfolio 3D Tilt",category:"Portfolio",description:"Portfolio với 3D perspective tilt.",thumbnail:"🎯",sort_order:35},
  {id:23,name:"Portfolio Neon Glitch",category:"Portfolio",description:"Portfolio neon với glitch text.",thumbnail:"🌈",sort_order:36},
  {id:24,name:"Portfolio Typewriter",category:"Portfolio",description:"Portfolio với hiệu ứng typewriter.",thumbnail:"⌨️",sort_order:37},
  {id:25,name:"Landing SaaS Counter",category:"Landing Page",description:"Landing page SaaS với animated counter.",thumbnail:"📈",sort_order:38},
  {id:26,name:"Landing Wave Hero",category:"Landing Page",description:"Landing page với sóng SVG động.",thumbnail:"🌊",sort_order:39},
  {id:27,name:"Landing Particle Mouse",category:"Landing Page",description:"Landing page với hạt sáng bay theo chuột.",thumbnail:"🎆",sort_order:40},
  {id:28,name:"Landing 3D CSS Hero",category:"Landing Page",description:"Landing page với 3D CSS perspective.",thumbnail:"🎭",sort_order:41},
  {id:29,name:"Blog Dark Progress",category:"Blog Cá Nhân",description:"Blog tối với thanh tiến trình đọc.",thumbnail:"📖",sort_order:42},
  {id:30,name:"Blog Glassmorphism",category:"Blog Cá Nhân",description:"Blog glassmorphism trong suốt.",thumbnail:"💎",sort_order:43},
  {id:31,name:"Blog Magazine Grid",category:"Blog Cá Nhân",description:"Blog bố cục magazine grid.",thumbnail:"📰",sort_order:44},
  {id:32,name:"Blog Terminal",category:"Blog Cá Nhân",description:"Blog phong cách terminal hacker.",thumbnail:"💾",sort_order:45},
  {id:33,name:"Link in Bio Neon",category:"Link in Bio",description:"Link in Bio neon cyberpunk.",thumbnail:"⚡",sort_order:46},
  {id:34,name:"Link in Bio 3D Tilt",category:"Link in Bio",description:"Link in Bio với 3D tilt hover.",thumbnail:"🎪",sort_order:47},
  {id:35,name:"Link in Bio Matrix",category:"Link in Bio",description:"Link in Bio với mưa matrix.",thumbnail:"🟩",sort_order:48},
  {id:36,name:"Link in Bio Aurora",category:"Link in Bio",description:"Link in Bio với aurora borealis.",thumbnail:"🌌",sort_order:49},
];

function getHtml(id) {
  return new Promise((resolve) => {
    const req = https.get('https://khoai.to/api/templates/' + id, {
      headers: { Cookie: 'token=' + token }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(d);
          resolve(j.html || '');
        } catch(e) { resolve(''); }
      });
    });
    req.on('error', () => resolve(''));
  });
}

function escapeSQL(str) {
  return str.replace(/'/g, "''");
}

async function main() {
  let sql = '-- Seed templates data\n-- Run in Supabase SQL Editor\n\n';
  
  for (const t of TEMPLATES_META) {
    const html = await getHtml(t.id);
    console.error('Fetched template ' + t.id);
    
    sql += `INSERT INTO public.templates (id, name, category, description, thumbnail, html, sort_order, is_active)\nVALUES (${t.id}, '${escapeSQL(t.name)}', '${escapeSQL(t.category)}', '${escapeSQL(t.description)}', '${t.thumbnail}', '${escapeSQL(html)}', ${t.sort_order}, TRUE)\nON CONFLICT (id) DO UPDATE SET html = EXCLUDED.html, name = EXCLUDED.name;\n\n`;
  }
  
  sql += "SELECT setval('templates_id_seq', (SELECT MAX(id) FROM public.templates));\n";
  
  fs.writeFileSync('c:/Users/HT90/Desktop/ht90/job/outside/khoailang/supabase-seed-templates.sql', sql);
  console.log('Done! Written supabase-seed-templates.sql with ' + TEMPLATES_META.length + ' templates');
}

main();
