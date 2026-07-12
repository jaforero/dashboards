# -*- coding: utf-8 -*-
"""Genera la página web comparativa (Claude vs ChatGPT vs Gemini + Consenso)."""
import json

DATA = json.load(open("/home/claude/wc2026/consolidated.json", encoding="utf-8"))
BLOB = json.dumps(DATA, ensure_ascii=False)
try:
    RESULTS_FB = json.dumps(json.load(open("/home/claude/wc2026/results.json", encoding="utf-8")), ensure_ascii=False)
except Exception:
    RESULTS_FB = '{"results":[]}'

HTML = r"""<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Benchmark IA · Pronósticos Mundial FIFA 2026 — Claude · ChatGPT · Gemini</title>
<!-- Google tag (gtag.js) — GA4 propiedad G-MQ3K8EVKV0 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-MQ3K8EVKV0"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-MQ3K8EVKV0');
</script>

<!-- ============ SEO ============ -->
<meta name="description" content="Claude, ChatGPT y Gemini pronostican el Mundial FIFA 2026 y un consenso las combina: 48 selecciones, 72 partidos y modelos de ciencia de datos comparados.">
<meta name="author" content="Javier Forero">
<meta name="keywords" content="Mundial 2026, pronóstico Mundial 2026, IA fútbol, Claude ChatGPT Gemini, ciencia de datos deportiva, Dixon-Coles, machine learning fútbol, Javier Forero">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#4e00ff">
<link rel="canonical" href="https://mundial.javierforero.co/">
<link rel="icon" type="image/svg+xml" href="favicon.svg">

<!-- ============ Open Graph (LinkedIn, Facebook, WhatsApp) ============ -->
<meta property="og:type" content="website">
<meta property="og:locale" content="es_CO">
<meta property="og:site_name" content="Javier Forero">
<meta property="og:url" content="https://mundial.javierforero.co/">
<meta property="og:title" content="Benchmark IA · Mundial 2026 — Claude vs ChatGPT vs Gemini">
<meta property="og:description" content="Tres IAs pronostican la Copa Mundial 2026 y un consenso las combina. Compara 48 selecciones y 72 partidos con modelos estadísticos y de machine learning.">
<meta property="og:image" content="https://mundial.javierforero.co/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Benchmark IA · Mundial 2026 — Claude, ChatGPT y Gemini">

<!-- ============ Twitter / X ============ -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Benchmark IA · Mundial 2026 — Claude vs ChatGPT vs Gemini">
<meta name="twitter:description" content="Tres IAs pronostican la Copa Mundial 2026 y un consenso las combina. 48 selecciones, 72 partidos, ciencia de datos.">
<meta name="twitter:image" content="https://mundial.javierforero.co/og-image.png">

<!-- ============ Datos estructurados (GEO / motores de IA) ============ -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Benchmark IA · Mundial 2026 — Claude vs ChatGPT vs Gemini",
  "url": "https://mundial.javierforero.co/",
  "inLanguage": "es",
  "description": "Comparación de los pronósticos de Claude, ChatGPT y Gemini para la Copa Mundial de la FIFA 2026, con un consenso construido sobre los tres modelos.",
  "author": {"@type": "Person", "name": "Javier Forero", "url": "https://www.javierforero.co"},
  "creator": {"@type": "Person", "name": "Javier Forero", "url": "https://www.linkedin.com/in/jforero/"},
  "about": ["Copa Mundial de la FIFA 2026", "Inteligencia Artificial", "Ciencia de datos deportiva"]
}
</script>
<style>
@font-face{font-family:'IgraSans';src:url('IgraSans.woff2') format('woff2'),url('https://javierforero.co/fonts/IgraSans.woff2') format('woff2');font-display:swap;}
:root{--purple:#4e00ff;--purple-light:#7c4dff;--deep-blue:#041c59;--vibrant-blue:#0048ff;
--bg:#f5f7fb;--white:#fff;--border:#e3e8f5;--soft-lilac:#f6f3ff;--text:#1f2937;--muted:#5f6b7a;
--grad-hero:linear-gradient(135deg,#041c59 0%,#4e00ff 68%,#7c4dff 100%);
--c-claude:#D9622D;--c-chatgpt:#10a37f;--c-gemini:#1A73E8;--c-cons:#4e00ff;
--tip-bg:#0e1430;--track:#f1f3fa;--range:#d8def0;--bartrack:#eef1f8;}
/* ===== tema oscuro ===== */
[data-theme="dark"]{--deep-blue:#cfd9f7;--bg:#0a1020;--white:#121b33;--border:#26324d;
--soft-lilac:#1b2138;--text:#e8edf9;--muted:#9fabc4;--vibrant-blue:#7aa2ff;
--tip-bg:#1b2440;--track:#161d33;--range:#2a3656;--bartrack:#1b2440;}
[data-theme="dark"] .tab,[data-theme="dark"] .card,[data-theme="dark"] .gcard,
[data-theme="dark"] .h2h-sel,[data-theme="dark"] .reachscroll thead th,
[data-theme="dark"] .tk{background:var(--white);}
[data-theme="dark"] .tab{color:var(--deep-blue);}
[data-theme="dark"] .dot{border-color:var(--white);}
[data-theme="dark"] .cidx{background:linear-gradient(135deg,#1a2138,#16203a);}
[data-theme="dark"] .scorechips .s{background:var(--soft-lilac);}
[data-theme="dark"] .mtab td{border-bottom-color:#222c46;}
[data-theme="dark"] .tabs{background:rgba(10,16,32,.92);}
/* ===== pie de página ===== */
.footer{background:var(--grad-hero);color:#fff;padding:28px 20px;text-align:center;font-size:13.5px;margin-top:40px;border-radius:28px 28px 0 0;}
.footer a{color:#ffd84d;text-decoration:none;font-weight:700;} .footer a:hover{text-decoration:underline;}
.footer .f-sub{opacity:.72;font-size:12px;margin-top:6px;}
/* ===== barra de controles (idioma + tema) ===== */
.topbar{display:flex;justify-content:flex-end;align-items:center;gap:10px;margin:0 0 14px;}
.seg{display:inline-flex;border:1px solid var(--border);border-radius:999px;overflow:hidden;background:var(--white);}
.seg-btn{border:0;background:transparent;color:var(--muted);font-family:inherit;font-weight:800;
font-size:13px;padding:7px 14px;cursor:pointer;transition:.15s;}
.seg-btn.active{background:var(--purple);color:#fff;}
.icon-btn{border:1px solid var(--border);background:var(--white);border-radius:999px;width:38px;height:34px;
cursor:pointer;font-size:16px;line-height:1;display:inline-flex;align-items:center;justify-content:center;}
.icon-btn:hover{border-color:var(--purple-light);}
*{box-sizing:border-box;}
body{margin:0;background:var(--bg);font-family:'IgraSans',Aptos,Helvetica,Arial,sans-serif;color:var(--text);line-height:1.5;
transition:background .3s,color .3s;}
.wrap{max-width:1120px;margin:0 auto;padding:24px 20px 70px;}
.hero{background:var(--grad-hero);color:#fff;border-radius:28px;padding:38px 42px;}
.hero .eyebrow{font-size:12.5px;letter-spacing:2px;text-transform:uppercase;opacity:.88;margin:0 0 12px;}
.hero h1{margin:0;font-size:36px;line-height:1.1;font-weight:800;}
.hero .sub{margin:14px 0 0;font-size:16.5px;line-height:1.5;opacity:.94;max-width:820px;}
.hero .meta{margin:18px 0 0;font-size:13px;opacity:.9;}
.hero-cta{display:flex;flex-wrap:wrap;gap:10px;margin:20px 0 0;}
.cta-btn{font-family:inherit;font-size:14px;font-weight:700;border-radius:999px;padding:11px 20px;cursor:pointer;border:1.5px solid rgba(255,255,255,.55);transition:transform .12s ease,background .12s ease;}
.cta-btn.primary{background:#ffd84d;color:#1a1340;border-color:#ffd84d;}
.cta-btn.ghost{background:rgba(255,255,255,.10);color:#fff;}
.cta-btn:hover{transform:translateY(-1px);}
.cta-btn.primary:hover{background:#ffdf6b;}
.cta-btn.ghost:hover{background:rgba(255,255,255,.20);}
/* tabs */
.tabs{display:flex;flex-wrap:wrap;gap:8px;margin:24px 0 8px;}
.tab{border:1px solid var(--border);background:#fff;color:var(--deep-blue);font-family:inherit;
font-size:14.5px;font-weight:800;padding:11px 20px;border-radius:999px;cursor:pointer;transition:.15s;}
.tab:hover{border-color:var(--purple-light);}
.tab.active{background:var(--purple);color:#fff;border-color:var(--purple);}
.tab .dotc{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:7px;vertical-align:middle;}
.panel{display:none;} .panel.active{display:block;}
.section-title{color:var(--deep-blue);text-transform:uppercase;letter-spacing:.12em;font-weight:800;
font-size:14px;border-left:4px solid var(--purple);padding-left:12px;margin:34px 0 16px;}
.card{background:#fff;border:1px solid var(--border);border-radius:18px;padding:20px 22px;
box-shadow:0 12px 32px rgba(4,28,89,.06);margin:14px 0;transition:background .3s,border-color .3s,transform .2s,box-shadow .2s;}
.card:hover{transform:translateY(-2px);box-shadow:0 16px 40px rgba(4,28,89,.10);}
.card h3{margin:0 0 10px;color:var(--deep-blue);font-size:17px;font-weight:800;}
.insight{background:var(--soft-lilac);border:1px solid var(--border);border-left:5px solid var(--purple);
border-radius:16px;padding:16px 18px;margin:16px 0;transition:background .3s,border-color .3s;}
.insight p{margin:0;color:var(--deep-blue);font-weight:600;font-size:15px;}
.lead{font-size:16px;}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
table{width:100%;border-collapse:collapse;font-size:13px;}
th{text-align:left;color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.4px;
padding:8px 7px;border-bottom:2px solid var(--border);font-weight:700;}
td{padding:6px 7px;border-bottom:1px solid var(--border);}
td.tm{font-weight:700;color:var(--deep-blue);} td.hl{font-weight:800;color:var(--purple);}
.barwrap{display:inline-block;height:9px;background:var(--bartrack);border-radius:999px;vertical-align:middle;overflow:hidden;}
.barfill{display:block;height:100%;border-radius:999px;}
.wdl{display:inline-flex;width:118px;height:9px;border-radius:999px;overflow:hidden;vertical-align:middle;}
.wdl span{display:block;height:100%;}
.legend{font-size:11.5px;color:var(--muted);margin:8px 0 0;}
.badge{display:inline-block;background:var(--soft-lilac);color:var(--deep-blue);border:1px solid var(--border);
border-radius:999px;padding:3px 10px;font-size:11px;font-weight:700;margin:2px 4px 2px 0;}
/* champion divergence rows */
.chrow{display:grid;grid-template-columns:130px 1fr 150px;align-items:center;gap:12px;margin:8px 0;}
.chteam{font-weight:700;color:var(--deep-blue);font-size:13.5px;}
.chteam .elo{font-size:10.5px;color:var(--muted);font-weight:600;}
.track{position:relative;height:26px;background:var(--track);border-radius:8px;}
.range{position:absolute;height:6px;top:10px;background:var(--range);border-radius:999px;}
.dot{position:absolute;width:13px;height:13px;border-radius:50%;top:6px;transform:translateX(-50%);border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.2);}
.medmark{position:absolute;width:3px;height:26px;background:var(--purple);top:0;transform:translateX(-50%);border-radius:2px;}
.chnums{font-size:12.5px;text-align:right;}
.chnums .med{font-size:17px;font-weight:800;color:var(--purple);}
.chnums .mn{color:var(--muted);font-size:11px;}
.gcard{background:#fff;border:1px solid var(--border);border-radius:16px;padding:14px 16px;margin:12px 0;box-shadow:0 10px 28px rgba(4,28,89,.05);transition:background .3s,border-color .3s,transform .2s,box-shadow .2s;}
.gcard:hover{transform:translateY(-2px);box-shadow:0 14px 34px rgba(4,28,89,.09);}
.gh{font-size:16px;font-weight:800;color:var(--deep-blue);margin-bottom:8px;}
.mtab td{font-size:12.5px;padding:5px 7px;border-bottom:1px solid #f0f3fa;}
.mtab tbody tr:nth-child(even) td{background:var(--soft-lilac);}
.mtab .ta{font-weight:700;color:var(--deep-blue);width:30%;} .mtab .tb{font-weight:700;color:var(--deep-blue);text-align:right;width:30%;}
.mtab .sc{text-align:center;font-weight:800;color:var(--purple);width:56px;}
.agree{display:inline-flex;gap:3px;}
.agree i{width:7px;height:7px;border-radius:50%;background:var(--range);display:inline-block;}
.agree i.on{background:var(--vibrant-blue);}
.wdltxt{font-size:10.5px;color:var(--muted);margin-left:7px;}
.note{font-size:13px;color:var(--muted);line-height:1.5;margin:-2px 0 12px;max-width:820px;}
/* jornada oficial (separador en tabla de partidos) */
.md-sep td{border:none!important;padding:6px 0 2px!important;}
.md-label{font-size:11px;font-weight:700;color:var(--muted);letter-spacing:.3px;text-transform:uppercase;}
/* colores de clasificación en la proyección de grupos */
.grp-q{background:var(--soft-lilac);}
.grp-3rd{background:#fff8e1;}
.grp-out{opacity:.55;}
/* ancla de tasa de empates · histórico vs proyección */
.anchor-card{background:var(--card);padding:14px 16px;border-radius:14px;border:1px solid var(--border);margin:0 0 14px 0;}
.anchor-title{font-weight:800;color:var(--deep-blue);font-size:14px;margin-bottom:6px;}
.anchor-band-text{font-size:12.5px;color:var(--muted);margin-bottom:10px;line-height:1.55;}
.anchor-band-text b{color:var(--deep-blue);font-weight:700;}
.anchor-row{display:grid;grid-template-columns:80px 1fr 56px 96px;align-items:center;gap:10px;padding:5px 0;font-size:13px;}
.anchor-row .ai{font-weight:700;}
.anchor-bar{position:relative;height:10px;background:var(--soft-lilac);border-radius:5px;}
.anchor-bar .band{position:absolute;top:0;bottom:0;background:rgba(26,158,92,0.32);border-radius:5px;}
.anchor-bar .marker{position:absolute;top:-3px;width:6px;height:16px;border-radius:2px;transform:translateX(-50%);box-shadow:0 0 0 2px var(--card);}
.anchor-row .val{text-align:right;font-weight:800;color:var(--deep-blue);}
.anchor-row .stat{font-size:11px;font-weight:700;padding:2px 8px;border-radius:8px;text-align:center;}
.anchor-row .stat.in{background:#e6f7ee;color:#1a9e5c;}
.anchor-row .stat.hi{background:#fff3da;color:#b58900;}
.anchor-row .stat.lo{background:#e6efff;color:#0048ff;}
.anchor-row .stat.real{background:var(--deep-blue);color:#fff;}
.anchor-row .stat.under{background:#fdeaea;color:#c0392b;}
.anchor-row .stat.close{background:#e6f7ee;color:#1a9e5c;}
.anchor-row.anchor-real{background:linear-gradient(90deg,rgba(4,28,89,.08),rgba(4,28,89,0));border-radius:8px;}
.anchor-bar .real-line{position:absolute;top:-4px;bottom:-4px;width:0;border-left:2px dashed var(--deep-blue);opacity:.5;transform:translateX(-1px);}
.anchor-bar .marker.real{width:9px;height:20px;top:-5px;background:var(--deep-blue);box-shadow:0 0 0 2px var(--card),0 0 0 3px rgba(4,28,89,.22);}
.anchor-row .ai .closeflag{font-size:9.5px;font-weight:800;color:#1a9e5c;white-space:nowrap;}
@media(max-width:640px){.anchor-row{grid-template-columns:70px 1fr 50px;}.anchor-row .stat{display:none;}.anchor-row .ai .closeflag{display:none;}}
/* ===== panel de precisión (predicción vs realidad) ===== */
.acc-hero{background:linear-gradient(135deg,var(--purple),var(--deep-blue));color:#fff;border-radius:18px;padding:20px 22px;margin-bottom:16px;}
.acc-hero h2{margin:0 0 4px;font-size:20px;font-weight:800;}
.acc-hero p{margin:0;font-size:13px;opacity:.92;line-height:1.5;}
.acc-progress{margin-top:14px;}
.acc-progress .track{height:9px;background:rgba(255,255,255,.25);border-radius:5px;overflow:hidden;}
.acc-progress .fill{height:100%;background:#ffd84d;border-radius:5px;transition:width .6s ease;}
.acc-progress .lbl{font-size:12px;margin-top:6px;opacity:.95;}
/* ===== diferenciación de fases: actual (16avos) vs cerrada (grupos) ===== */
.acc-hero.ko-live{background:linear-gradient(135deg,#0048ff,#041c59);border:2px solid #ffd84d;}
.phase-tag{display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;padding:4px 11px;border-radius:999px;margin-bottom:8px;}
.phase-tag.live{background:#ffd84d;color:#7a2e00;}
.phase-sep{display:flex;align-items:center;gap:10px;margin:28px 0 12px;}
.phase-sep::after{content:"";flex:1;height:1px;background:var(--border);}
.phase-sep .phase-tag.closed{background:var(--soft-lilac);color:var(--muted);border:1px solid var(--border);margin-bottom:0;}
details.phase-closed-d{border:1px dashed var(--border);border-radius:12px;background:var(--soft-lilac);margin-top:14px;overflow:hidden;transition:background .2s;}
details.phase-closed-d>summary{cursor:pointer;font-weight:700;color:var(--deep-blue);font-size:13.5px;padding:12px 14px;list-style:none;display:flex;align-items:center;gap:8px;}
details.phase-closed-d>summary::-webkit-details-marker{display:none;}
details.phase-closed-d>summary::before{content:"▸";color:var(--purple);font-size:12px;}
details.phase-closed-d[open]>summary::before{content:"▾";}
details.phase-closed-d>summary:hover{background:var(--hover);}
details.phase-closed-d[open]{padding-bottom:14px;}
details.phase-closed-d .h2h-table,details.phase-closed-d .h2h-table-head{margin-left:12px;margin-right:12px;}
.lb-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:18px;}
.lb-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:16px;position:relative;overflow:hidden;}
.lb-card.lead{border-color:var(--purple);box-shadow:0 6px 22px rgba(78,0,255,.18);}
.lb-card .rank{position:absolute;top:12px;right:14px;font-size:22px;}
.lb-card .who{display:flex;align-items:center;gap:8px;font-weight:800;font-size:15px;color:var(--deep-blue);}
.lb-card .who .dotc{width:11px;height:11px;border-radius:50%;display:inline-block;}
.lb-card .pts{font-size:34px;font-weight:800;line-height:1.1;margin:8px 0 2px;}
.lb-card .pts small{font-size:13px;font-weight:600;color:var(--muted);}
.lb-card .mini{display:flex;gap:12px;margin-top:8px;font-size:12px;color:var(--muted);flex-wrap:wrap;}
.lb-card .mini b{color:var(--deep-blue);font-size:14px;display:block;}
.acc-md{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:var(--muted);margin:16px 0 8px;}
.acc-match{background:var(--card);border:1px solid var(--border);border-radius:13px;padding:11px 13px;margin-bottom:9px;}
.acc-match .top{display:flex;align-items:center;justify-content:center;gap:12px;font-weight:700;font-size:15px;margin-bottom:9px;}
.acc-match .top .sc{background:var(--deep-blue);color:#fff;border-radius:8px;padding:3px 11px;font-weight:800;letter-spacing:.5px;}
.acc-match .top .nm{flex:1;}
.acc-match .top .nm.r{text-align:left;}
.acc-match .top .nm.l{text-align:right;}
.acc-chips{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;}
.acc-chip{border-radius:9px;padding:6px 4px;text-align:center;font-size:11px;border:1px solid var(--border);}
.acc-chip .cn{font-weight:700;display:block;margin-bottom:2px;font-size:10.5px;}
.acc-chip .cs{font-weight:800;font-size:13px;}
.acc-chip.exact{background:#e6f7ee;border-color:#1a9e5c;}
.acc-chip.exact .cs{color:#1a9e5c;}
.acc-chip.out{background:#fff8e1;border-color:#e0b400;}
.acc-chip.out .cs{color:#b58900;}
.acc-chip.miss{background:#fdecea;border-color:#d9534f;}
.acc-chip.miss .cs{color:#c0392b;}
.acc-chip .ico{font-size:11px;}
.acc-legend{font-size:12px;color:var(--muted);margin:6px 0 16px;line-height:1.7;}
.acc-legend span{white-space:nowrap;margin-right:14px;}
.acc-empty{text-align:center;padding:40px 20px;color:var(--muted);}
.acc-empty .big{font-size:42px;margin-bottom:10px;}
[data-theme="dark"] .acc-chip.exact{background:rgba(26,158,92,.16);}
[data-theme="dark"] .acc-chip.out{background:rgba(224,180,0,.14);}
[data-theme="dark"] .acc-chip.miss{background:rgba(217,83,79,.16);}
@media(max-width:640px){.acc-chips{grid-template-columns:repeat(2,1fr);}.lb-card .pts{font-size:28px;}}
/* ===== Bota de Oro · goleadores ===== */
.scorers{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:7px;}
.sk{display:grid;grid-template-columns:30px 1fr auto;align-items:center;gap:12px;padding:10px 14px;
border:1px solid var(--border);border-radius:14px;background:var(--card);transition:transform .15s,box-shadow .15s;}
.sk:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(78,0,255,.10);}
.sk-rank{font-weight:800;font-size:16px;color:var(--purple);text-align:center;}
.sk-rank.gold{color:#d4a017;}.sk-rank.sil{color:#9aa3b2;}.sk-rank.bro{color:#b06a3b;}
.sk-main{min-width:0;}
.sk-name{font-weight:700;color:var(--deep-blue);font-size:15px;}
.sk-team{font-size:12.5px;color:var(--muted);margin-left:2px;}
.sk-bar{height:7px;border-radius:5px;background:var(--soft-lilac);margin-top:6px;overflow:hidden;}
.sk-bar>span{display:block;height:100%;border-radius:5px;background:linear-gradient(90deg,#7c4dff,#0048ff);}
.sk-right{text-align:right;white-space:nowrap;}
.sk-prob{font-weight:800;color:var(--deep-blue);font-size:16px;}
.sk-chips{margin-top:3px;font-size:10.5px;color:var(--muted);}
.sk-chip{display:inline-block;padding:1px 6px;border-radius:7px;background:var(--soft-lilac);margin-left:4px;font-weight:700;}
.sk-agree{display:inline-block;font-size:10px;font-weight:800;padding:1px 7px;border-radius:8px;margin-left:6px;}
.sk-agree.three{background:#dcfce7;color:#15803d;}.sk-agree.two{background:#e6f7ee;color:#1a9e5c;}.sk-agree.one{background:#fff3da;color:#b58900;}
@media(max-width:640px){
  .sk{grid-template-columns:24px 1fr;grid-template-areas:"rank main" ". right";gap:2px 10px;padding:12px;}
  .sk-rank{grid-area:rank;align-self:start;}
  .sk-main{grid-area:main;}
  .sk-right{grid-area:right;text-align:left;white-space:normal;margin-top:8px;}
  .sk-prob{display:inline-block;font-size:15px;margin-right:8px;}
  .sk-chips{display:block;margin-top:5px;line-height:2;}
  .sk-chip{margin-left:0;margin-right:5px;}
}
.dotleg{display:inline-block;width:10px;height:10px;border-radius:50%;margin:0 4px 0 10px;vertical-align:middle;}
/* head to head */
.h2h-sel{width:100%;max-width:480px;padding:11px 14px;border:1px solid var(--border);border-radius:12px;
font-family:inherit;font-size:14.5px;color:var(--deep-blue);font-weight:700;background:#fff;}
.h2h-row{display:grid;grid-template-columns:96px 1fr 64px;align-items:center;gap:12px;margin:10px 0;}
.h2h-row .nm{font-weight:800;font-size:13px;}
.h2h-big{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:6px 0 14px;border-bottom:1px solid var(--border);margin-bottom:14px;}
.h2h-team{font-size:20px;font-weight:800;color:var(--deep-blue);}
.h2h-vs{color:var(--muted);font-weight:700;}
.fixture-meta{font-size:13px;color:var(--text);margin:-4px 0 14px;display:flex;flex-wrap:wrap;gap:4px 14px;align-items:center;line-height:1.4;}
.fixture-meta .ven{color:var(--muted);} .fixture-meta b{color:var(--deep-blue);}
.h2h-filters{display:grid;gap:12px;margin-bottom:18px;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));}
.h2h-filters input,.h2h-filters select{width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;font-size:13px;background:var(--bg);color:var(--text);}
.h2h-filters label{font-size:12px;font-weight:600;color:var(--muted);display:block;margin-bottom:4px;}
.h2h-table{margin-top:12px;max-height:600px;overflow-y:auto;border:1px solid var(--border);border-radius:8px;}
.h2h-table-head{display:grid;grid-template-columns:120px 1.4fr 50px 2.4fr;gap:8px;}
.h2h-table-head .preds-head{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
.h2h-row-compact{display:grid;grid-template-columns:120px 1.4fr 50px 2.4fr;gap:8px;padding:10px 12px;border-bottom:1px solid var(--border);align-items:center;font-size:12px;}
.h2h-row-compact:hover{background:var(--hover);cursor:pointer;}
.h2h-row-compact .date{color:var(--muted);font-weight:600;} .h2h-row-compact .date .venue{font-weight:400;font-size:10px;color:var(--muted);opacity:.8;margin-top:2px;line-height:1.2;}
.h2h-row-compact .teams{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.h2h-row-compact .score{font-weight:700;color:var(--muted);text-align:center;}
.h2h-row-compact.played{background:var(--hover);} .h2h-row-compact.played .score{font-weight:900;color:var(--deep-blue);font-size:14px;}
.h2h-row-compact .preds{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
.h2h-row-compact .pred{font-size:11px;text-align:center;padding:2px 4px;border-radius:4px;}
.h2h-row-compact .plabel{display:none;}
.h2h-row-compact .pred.exact{background:#e6f7ee;color:#1a9e5c;font-weight:800;border:1px solid #1a9e5c;}
.h2h-row-compact .pred.out{background:#fff8e1;color:#b58900;font-weight:700;border:1px solid #e0b400;}
.h2h-row-compact .pred.miss{background:#fdecea;color:#c0392b;border:1px solid #d9534f;}
[data-theme="dark"] .h2h-row-compact .pred.exact{background:rgba(26,158,92,.16);}
[data-theme="dark"] .h2h-row-compact .pred.out{background:rgba(224,180,0,.14);}
[data-theme="dark"] .h2h-row-compact .pred.miss{background:rgba(217,83,79,.16);}
@media(max-width:640px){
  .h2h-table-head{display:none;}
  .h2h-row-compact{grid-template-columns:1fr auto;grid-template-areas:"date score" "teams score" "preds preds";gap:4px 10px;padding:12px;align-items:center;}
  .h2h-row-compact .date{grid-area:date;font-size:11px;}
  .h2h-row-compact .teams{grid-area:teams;white-space:normal;font-size:13.5px;font-weight:600;}
  .h2h-row-compact .score{grid-area:score;font-size:20px;align-self:center;justify-self:end;}
  .h2h-row-compact.played .score{font-size:22px;}
  .h2h-row-compact .preds{grid-area:preds;margin-top:8px;}
  .h2h-row-compact .pred{padding:5px 4px;}
  .h2h-row-compact .plabel{display:block;font-size:9px;font-weight:700;opacity:.65;margin-bottom:2px;}
}
.h2h-filters-clear{font-size:12px;color:var(--link);cursor:pointer;text-decoration:underline;margin-top:-6px;}
.rich{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px;}
.rich .m{background:var(--soft-lilac);border:1px solid var(--border);border-radius:12px;padding:10px 12px;}
.rich .m .v{font-size:18px;font-weight:800;color:var(--purple);} .rich .m .l{font-size:10.5px;color:var(--muted);text-transform:uppercase;letter-spacing:.4px;margin-top:3px;}
.scorechips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}
.scorechips .s{background:#fff;border:1px solid var(--border);border-radius:8px;padding:4px 9px;font-size:12px;font-weight:700;color:var(--deep-blue);}
.scorechips .s em{font-style:normal;color:var(--muted);font-weight:600;margin-left:4px;}
.foot{text-align:center;margin-top:46px;padding-top:18px;border-top:1px solid var(--border);font-size:12.5px;color:var(--muted);}
.foot a{color:var(--vibrant-blue);text-decoration:none;} .foot .dot{color:var(--purple);}
.methclassic{font-size:14px;color:var(--text);} .methclassic b{color:var(--deep-blue);}
.reachscroll{max-height:560px;overflow-y:auto;border:1px solid var(--border);border-radius:12px;}
.reachscroll table{font-size:12.5px;} .reachscroll thead th{position:sticky;top:0;background:#fff;z-index:2;box-shadow:0 1px 0 var(--border);}
.reachscroll tbody tr:nth-child(even) td{background:var(--soft-lilac);}
.reachscroll tbody tr:nth-child(-n+3) td.tm{color:var(--purple);}
details.meth{margin:10px 0 0;border:1px solid var(--border);border-radius:12px;background:#fbfcff;}
details.meth>summary{cursor:pointer;padding:11px 16px;font-weight:800;color:var(--deep-blue);font-size:13.5px;list-style:none;}
details.meth>summary::-webkit-details-marker{display:none;}
details.meth>summary::before{content:"▸ ";color:var(--purple);}
details.meth[open]>summary::before{content:"▾ ";}
details.meth .methbody{padding:4px 18px 16px;font-size:13.5px;color:var(--text);}
details.meth .methbody p{margin:8px 0;} details.meth .methbody b{color:var(--deep-blue);}
details.meth .methbody pre{background:#0e1430;color:#cdd6f4;border-radius:10px;padding:11px 13px;font-size:11.5px;
overflow-x:auto;line-height:1.45;white-space:pre-wrap;}
details.meth .methbody .methlim{background:var(--soft-lilac);border-left:3px solid var(--purple-light);
border-radius:8px;padding:8px 11px;color:var(--deep-blue);}
.cidx{display:flex;gap:16px;align-items:center;margin-top:14px;background:linear-gradient(135deg,#f3efff,#eef3ff);
border:1px solid var(--border);border-radius:14px;padding:14px 16px;}
.cidx .ring{width:74px;height:74px;border-radius:50%;flex:0 0 auto;display:flex;align-items:center;justify-content:center;
font-weight:900;font-size:22px;color:#fff;}
.cidx .meta{font-size:13px;color:var(--text);} .cidx .meta b{color:var(--deep-blue);}
.cidx .meta .legend{margin-top:5px;}
.cchip{display:inline-block;min-width:30px;text-align:center;border-radius:7px;padding:1px 6px;font-weight:800;
font-size:11px;color:#fff;margin-left:6px;}
.cidx-h{font-size:14px;color:var(--deep-blue);display:flex;align-items:center;}
.cidx-v{font-weight:800;font-size:15px;margin-top:1px;}
.tip{position:relative;display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;
border-radius:50%;background:var(--purple-light);color:#fff;font-size:10px;font-weight:800;font-style:normal;
cursor:help;margin-left:7px;user-select:none;}
.tip::after{content:attr(data-tip);position:absolute;bottom:150%;left:50%;transform:translateX(-50%);
width:265px;max-width:72vw;background:var(--tip-bg);color:#e8ecff;font-size:12px;font-weight:500;line-height:1.5;
padding:10px 12px;border-radius:10px;opacity:0;visibility:hidden;transition:opacity .15s;z-index:60;
box-shadow:0 10px 28px rgba(0,0,0,.28);text-align:left;white-space:normal;pointer-events:none;}
.tip::before{content:"";position:absolute;bottom:150%;left:50%;transform:translate(-50%,98%);border:6px solid transparent;
border-top-color:var(--tip-bg);opacity:0;visibility:hidden;transition:opacity .15s;z-index:61;}
.tip:hover::after,.tip:hover::before,.tip:focus::after,.tip:focus::before{opacity:1;visibility:visible;}
.tip{outline:none;}
/* Tecnicismo inline con explicación (hover en escritorio, tap/foco en móvil) */
.term{position:relative;border-bottom:1px dotted currentColor;cursor:help;outline:none;}
.term::after{content:attr(data-tip);position:absolute;bottom:150%;left:50%;transform:translateX(-50%);
width:250px;max-width:74vw;background:var(--tip-bg);color:#e8ecff;font-size:12px;font-weight:500;line-height:1.5;
padding:10px 12px;border-radius:10px;opacity:0;visibility:hidden;transition:opacity .15s;z-index:60;
box-shadow:0 10px 28px rgba(0,0,0,.28);text-align:left;white-space:normal;pointer-events:none;}
.term::before{content:"";position:absolute;bottom:150%;left:50%;transform:translate(-50%,98%);border:6px solid transparent;
border-top-color:var(--tip-bg);opacity:0;visibility:hidden;transition:opacity .15s;z-index:61;}
.term:hover::after,.term:hover::before,.term:focus::after,.term:focus::before{opacity:1;visibility:visible;}
/* ===== UX: banda de veredicto + podio ===== */
.verdict{background:var(--grad-hero);color:#fff;border-radius:24px;padding:26px 28px;margin:8px 0 6px;
box-shadow:0 18px 40px rgba(78,0,255,.18);}
.verdict .vlead{font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:.85;margin:0 0 6px;font-weight:700;}
.verdict .vmain{font-size:23px;font-weight:800;line-height:1.3;margin:0;}
.verdict .vmain b{color:#ffd84d;}
.podium{display:grid;grid-template-columns:1fr 1.18fr 1fr;gap:14px;align-items:end;margin-top:20px;}
.pod{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.22);border-radius:16px;padding:15px 10px;text-align:center;}
.pod .rk{font-size:26px;line-height:1;}
.pod .tm{font-size:16px;font-weight:800;margin:3px 0 1px;}
.pod .pc{font-size:25px;font-weight:900;line-height:1;}
.pod .pl{font-size:11px;opacity:.8;}
.pod.p1{transform:translateY(-12px);background:rgba(255,216,77,.16);border-color:rgba(255,216,77,.55);padding-bottom:24px;}
.pod.p1 .pc{color:#ffd84d;font-size:30px;}
/* ===== UX: tarjetas de hallazgos clave ===== */
.takeaways{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:16px 0 6px;}
.tk{background:#fff;border:1px solid var(--border);border-radius:16px;padding:14px 15px;border-top:4px solid var(--purple);
box-shadow:0 10px 26px rgba(4,28,89,.05);transition:background .3s,border-color .3s,transform .2s;}
.tk:hover{transform:translateY(-2px);}
.tk .lab{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);font-weight:800;}
.tk .big{font-size:18px;font-weight:900;color:var(--deep-blue);margin:5px 0 2px;line-height:1.15;}
.tk .sub{font-size:12px;color:var(--muted);}
.tk.green{border-top-color:#1a9e5c;} .tk.red{border-top-color:#c0392b;} .tk.blue{border-top-color:var(--vibrant-blue);}
/* ===== UX: tabs fijas al hacer scroll ===== */
.tabs{position:sticky;top:0;z-index:45;background:rgba(247,248,252,.92);backdrop-filter:blur(8px);
padding:10px 0;border-bottom:1px solid var(--border);}
@media(max-width:760px){.grid2,.grid3,.rich{grid-template-columns:1fr;}.hero h1{font-size:27px;}
.hero{padding:26px 22px;border-radius:22px;} .wrap{padding:14px 13px 60px;}
.chrow{grid-template-columns:96px 1fr 92px;}.h2h-row{grid-template-columns:74px 1fr 56px;}
.takeaways{grid-template-columns:1fr 1fr;} .verdict .vmain{font-size:18px;} .verdict{padding:20px 18px;}
.pod .pc{font-size:21px;} .pod.p1 .pc{font-size:25px;} .pod .tm{font-size:14px;}
.section-title{font-size:12.5px;margin:26px 0 12px;} .card{padding:15px 15px;border-radius:15px;}
.mtab{font-size:11.5px;} .tab{padding:9px 14px;font-size:13px;}
table{font-size:12px;} .reachscroll{max-height:440px;}}
@media(max-width:430px){.takeaways{grid-template-columns:1fr;} .podium{gap:8px;} .pod{padding:11px 6px;}}
/* ===== Bracket (Camino a la final) ===== */
.bk-seltabs{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 16px;}
.bk-seltab{border:1.5px solid var(--border);background:var(--white);border-radius:999px;padding:7px 15px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:7px;color:var(--deep-blue);transition:all .15s;}
.bk-seltab .dot{width:10px;height:10px;border-radius:50%;position:static;top:auto;transform:none;}
.bk-seltab.on{color:#fff;border-color:transparent;}
.bk-champ{border-radius:16px;padding:15px 19px;margin:0 0 18px;display:flex;align-items:center;gap:13px;color:#fff;}
.bk-champ .cup{font-size:29px} .bk-champ .lbl{font-size:11px;text-transform:uppercase;letter-spacing:.07em;opacity:.85}
.bk-champ .nm{font-size:22px;font-weight:800} .bk-champ .ru{font-size:12px;opacity:.85;margin-top:2px}
.bk-elobox{background:var(--soft-lilac);border:1px solid var(--border);border-radius:12px;padding:12px 15px;margin:0 0 16px;font-size:12.5px;color:var(--muted);line-height:1.55;}
.bk-elobox b{color:var(--deep-blue);}
.bk-live{margin-bottom:22px;}
.bk-live-head{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px;}
.bk-live-head h3{margin:0;font-size:17px;color:var(--deep-blue);}
.bk-live-desc{margin:0 0 8px;font-size:13px;color:var(--muted);line-height:1.5;}
.bk-live-stat{margin:0 0 10px;font-size:12.5px;color:var(--deep-blue);}
.bk-livesc{float:right;font-weight:800;font-size:10px;opacity:.92;}
.bk-livechamp{background:linear-gradient(135deg,#1a9e5c,#0d6b3c);color:#fff;border-radius:10px;padding:8px 14px;font-size:15px;margin-bottom:10px;font-weight:700;}
.bk-tbd{color:var(--muted);font-style:italic;}
.bk-live-leg{font-size:11.5px;color:var(--muted);margin-top:8px;line-height:1.7;}
.bk-alive{display:flex;flex-wrap:wrap;gap:12px 14px;margin:0 0 14px;padding:12px 14px;background:linear-gradient(135deg,rgba(78,0,255,.07),rgba(0,72,255,.05));border:1px solid var(--border);border-radius:14px;align-items:flex-end;}
.bk-alive-h{width:100%;font-size:11px;font-weight:800;color:var(--purple);letter-spacing:.6px;margin-bottom:2px;}
.bk-alive-t{display:flex;flex-direction:column;align-items:center;gap:3px;min-width:54px;}
.bk-alive-f{font-size:32px;line-height:1;filter:drop-shadow(0 2px 5px rgba(4,28,89,.3));transition:transform .15s;}
.bk-alive-t:hover .bk-alive-f{transform:scale(1.18);}
.bk-alive-n{font-size:9.5px;font-weight:700;color:var(--deep-blue);text-align:center;white-space:nowrap;}
.bk-alive-r{font-size:8.5px;color:var(--muted);font-weight:600;}
.bk-trophy{display:flex;flex-direction:column;align-items:center;gap:5px;margin-bottom:8px;}
.bk-trophy svg{animation:trGlow 3.2s ease-in-out infinite;}
@keyframes trGlow{0%,100%{filter:drop-shadow(0 4px 10px rgba(255,180,0,.35))}50%{filter:drop-shadow(0 7px 22px rgba(255,200,40,.7))}}
.bk-trophy-cap{font-size:10.5px;font-weight:800;color:var(--deep-blue);letter-spacing:.5px;text-align:center;line-height:1.5;}
.bk-team.l{opacity:.42;}
.bk-team.w{font-size:13.5px;}
.bk-scroll{overflow-x:auto;padding-bottom:14px;-webkit-overflow-scrolling:touch;}
.bk-board{display:flex;gap:14px;align-items:stretch;min-width:1080px;}
.bk-side{display:flex;gap:14px;flex:1;}
.bk-col{display:flex;flex-direction:column;justify-content:space-around;gap:9px;flex:1;min-width:124px;}
.bk-rhead{font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;text-align:center;margin-bottom:3px;}
.bk-match{background:var(--white);border:1px solid var(--border);border-radius:10px;padding:7px 9px;position:relative;box-shadow:0 1px 3px rgba(4,28,89,.05);}
.bk-match.prov{border-style:dashed;border-color:var(--range);background:transparent;}
.bk-code{position:absolute;top:-7px;left:8px;color:#fff;font-size:8px;font-weight:700;padding:1px 5px;border-radius:6px;}
.bk-team{display:flex;align-items:center;gap:6px;padding:3px 2px;font-size:12px;border-radius:5px;color:var(--deep-blue);}
.bk-team+.bk-team{margin-top:2px;border-top:1px dashed var(--border);padding-top:5px;}
.bk-team.w{font-weight:800;}
.bk-seed{font-size:9px;color:var(--muted);min-width:30px;font-weight:700;}
.bk-nm{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.bk-final{display:flex;flex-direction:column;justify-content:center;align-items:center;gap:8px;padding:0 4px;}
.bk-fmatch{background:var(--deep-blue);color:#fff;border-radius:12px;padding:10px 12px;min-width:120px;}
[data-theme="dark"] .bk-fmatch{background:#1a2138;}
.bk-fmatch .bk-team{color:#fff} .bk-fmatch .bk-code{background:#ffd84d;color:#041c59}
.bk-fmatch .bk-team.w{background:rgba(255,255,255,.16);color:#ffd84d;}
.bk-legend{font-size:11px;color:var(--muted);margin-top:8px}
.bk-note{font-size:12px;color:var(--muted);margin-top:18px;line-height:1.55;border-top:1px solid var(--border);padding-top:13px;}
.bk-note b{color:var(--deep-blue);}
/* leaderboard estructural */
.strb{background:var(--white);border:1px solid var(--border);border-radius:16px;padding:18px 18px;margin:8px 0 22px;}
.strb h3{margin:0 0 4px;font-size:16px;color:var(--deep-blue);}
.strb .desc{font-size:12.5px;color:var(--muted);margin:0 0 14px;line-height:1.5;}
.strb-rules{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 14px;}
.strb-rule{background:var(--soft-lilac);border-radius:8px;padding:5px 10px;font-size:11.5px;color:var(--deep-blue);font-weight:600;}
.strb-pend{background:var(--soft-lilac);border:1px dashed var(--range);border-radius:12px;padding:18px;text-align:center;color:var(--muted);font-size:13px;line-height:1.55;}
.strb-pend .big{font-size:26px;margin-bottom:6px;}
.strb-prog{height:8px;background:var(--bartrack);border-radius:6px;overflow:hidden;margin:12px auto 4px;max-width:340px;}
.strb-prog>span{display:block;height:100%;background:var(--purple);border-radius:6px;}
.strb-row{display:grid;grid-template-columns:30px 1fr 70px;align-items:center;gap:10px;padding:9px 6px;border-bottom:1px solid var(--border);}
.strb-row:last-child{border-bottom:none;}
.strb-rank{font-weight:800;color:var(--muted);text-align:center;}
.strb-name{font-weight:700;color:var(--deep-blue);display:flex;align-items:center;gap:8px;}
.strb-name .dot{width:10px;height:10px;border-radius:50%;position:static;top:auto;transform:none;}
.strb-pts{font-weight:800;text-align:right;font-size:15px;}
@media(max-width:760px){.bk-champ .nm{font-size:19px}}
.bk-metric{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0 0 14px;}
.bk-metric-lbl{font-size:12px;font-weight:700;color:var(--deep-blue);}
.bk-mbtn{border:1.5px solid var(--border);background:var(--white);border-radius:999px;padding:5px 14px;font-size:12.5px;font-weight:700;cursor:pointer;color:var(--muted);transition:all .15s;}
.bk-mbtn.on{background:var(--deep-blue);color:#fff;border-color:transparent;}
[data-theme="dark"] .bk-mbtn.on{background:var(--purple);}
.bk-metric-note{flex-basis:100%;font-size:11.5px;color:var(--muted);line-height:1.45;background:#fff7e6;border:1px solid #ffe2a8;border-radius:8px;padding:7px 10px;margin-top:2px;}
[data-theme="dark"] .bk-metric-note{background:#2a2410;border-color:#5a4a1a;color:#e8d9a8;}
</style></head>
<body><div class="wrap">

<div class="topbar">
  <div class="seg" id="langSeg" role="group" aria-label="Idioma / Language">
    <button class="seg-btn active" data-lang="es">ES</button>
    <button class="seg-btn" data-lang="en">EN</button>
  </div>
  <button class="icon-btn" id="themeBtn" aria-label="Cambiar tema claro/oscuro" title="Tema claro/oscuro">🌙</button>
</div>

<div class="hero">
  <p class="eyebrow" data-en="Artificial Intelligence Benchmark · Sports Analytics">Benchmark de Inteligencia Artificial · Sports Analytics</p>
  <h1 data-en="FIFA World Cup 2026 — Three AIs, one consensus">Mundial FIFA 2026 — Tres IAs, un consenso</h1>
  <p class="sub" data-en="Three artificial intelligences —<b>Claude</b>, <b>ChatGPT</b> and <b>Gemini</b>— forecast the 2026 World Cup: who will lift the trophy, how each group will end, the road to the final and who wins the Golden Boot. A fourth forecast, the <b>consensus</b>, combines all three. Each AI reaches its numbers in a different way; in every tab you can open its full explanation.">Tres inteligencias artificiales —<b>Claude</b>, <b>ChatGPT</b> y <b>Gemini</b>— pronostican el Mundial 2026:
  quién levantará la copa, cómo terminará cada grupo, el camino hasta la final y quién ganará la Bota de Oro. Un cuarto pronóstico, el <b>consenso</b>,
  combina los tres. Cada IA llega a sus números de una forma distinta; en cada pestaña puedes abrir su explicación completa.</p>
  <p class="meta" data-en="Quantitative analysis · June 2026 · full data from the three tools">Análisis cuantitativo · junio de 2026 · datos completos de las tres herramientas</p>
  <div class="hero-cta">
    <button class="cta-btn primary" data-go="consenso"><span data-en="See the consensus prediction →">Ver la predicción del consenso →</span></button>
    <button class="cta-btn ghost" data-go="precision"><span data-en="🏆 AI World Cup (live)">🏆 Mundial de las IAs (en vivo)</span></button>
  </div>
</div>

<div class="tabs" id="tabs">
  <button class="tab active" data-t="precision"><span data-en="🏆 AI World Cup">🏆 Mundial de las IAs</span></button>
  <button class="tab" data-t="bracket"><span data-en="🗺️ Road to the final">🗺️ Camino a la final</span></button>
  <button class="tab" data-t="consenso"><span class="dotc" style="background:var(--c-cons)"></span><span data-en="Consensus">Consenso</span></button>
  <button class="tab" data-t="claude"><span class="dotc" style="background:var(--c-claude)"></span>Claude</button>
  <button class="tab" data-t="chatgpt"><span class="dotc" style="background:var(--c-chatgpt)"></span>ChatGPT</button>
  <button class="tab" data-t="gemini"><span class="dotc" style="background:var(--c-gemini)"></span>Gemini</button>
</div>

<div id="precision" class="panel active"></div>
<div id="consenso" class="panel"></div>
<div id="claude" class="panel"></div>
<div id="chatgpt" class="panel"></div>
<div id="gemini" class="panel"></div>
<div id="bracket" class="panel"></div>

<div class="footer">
  <div data-en="Javier Forero · Statistician and AI & Analytics Consultant">Javier Forero · Estadístico y consultor en IA y Analítica</div>
  <div class="f-sub"><a href="https://www.javierforero.co">javierforero.co</a> · <a href="https://www.linkedin.com/in/jforero/">LinkedIn</a> · <a href="https://github.com/jaforero/mundial2026-ai-benchmark">GitHub</a> · <span data-en="June 2026">junio 2026</span></div>
  <div class="f-sub" style="margin-top:8px;opacity:.58" data-en="The probabilities are model estimates, not certainties. Consensus = combination of the three tools.">Las probabilidades son estimaciones de modelos, no certezas. Consenso = combinación de las tres herramientas.</div>
</div>

</div>

<script>
const DATA = __BLOB__;
const COL = {Claude:'#D9622D', ChatGPT:'#10a37f', Gemini:'#1A73E8', Consenso:'#4e00ff'};
const ELO = DATA.elo || {};
const FIFA = DATA.fifa || {};
const fmt = x => (x==null?'—':(Math.round(x*10)/10).toFixed(1)+'%');

/* ============ i18n ============ */
let LANG='es';
const TEAM_EN={'Alemania':'Germany','Arabia Saudí':'Saudi Arabia','Argelia':'Algeria','Argentina':'Argentina','Australia':'Australia','Austria':'Austria','Bosnia':'Bosnia & H.','Brasil':'Brazil','Bélgica':'Belgium','Cabo Verde':'Cape Verde','Canadá':'Canada','Chequia':'Czechia','Colombia':'Colombia','Corea del Sur':'South Korea','Costa de Marfil':'Ivory Coast','Croacia':'Croatia','Curazao':'Curaçao','Ecuador':'Ecuador','Egipto':'Egypt','Escocia':'Scotland','España':'Spain','Estados Unidos':'United States','Francia':'France','Ghana':'Ghana','Haití':'Haiti','Inglaterra':'England','Iraq':'Iraq','Irán':'Iran','Japón':'Japan','Jordania':'Jordan','Marruecos':'Morocco','México':'Mexico','Noruega':'Norway','Nueva Zelanda':'New Zealand','Panamá':'Panama','Paraguay':'Paraguay','Países Bajos':'Netherlands','Portugal':'Portugal','Qatar':'Qatar','RD Congo':'DR Congo','Senegal':'Senegal','Sudáfrica':'South Africa','Suecia':'Sweden','Suiza':'Switzerland','Túnez':'Tunisia','Türkiye':'Turkey','Uruguay':'Uruguay','Uzbekistán':'Uzbekistan'};
function tx(es,en){return LANG==='en'?en:es;}          /* texto UI */
function term(label,tip){return `<span class="term" tabindex="0" role="note" aria-label="${tip}" data-tip="${tip}">${label}</span>`;}  /* tecnicismo con tooltip */
const TEAM_ES={'Türkiye':'Turquía'};
function tn(n){return LANG==='en'?(TEAM_EN[n]||n):(TEAM_ES[n]||n);}   /* nombre de selección (solo para mostrar) */const FLAG={'Alemania':'🇩🇪','Arabia Saudí':'🇸🇦','Argelia':'🇩🇿','Argentina':'🇦🇷','Australia':'🇦🇺','Austria':'🇦🇹','Bosnia':'🇧🇦','Brasil':'🇧🇷','Bélgica':'🇧🇪','Cabo Verde':'🇨🇻','Canadá':'🇨🇦','Chequia':'🇨🇿','Colombia':'🇨🇴','Corea del Sur':'🇰🇷','Costa de Marfil':'🇨🇮','Croacia':'🇭🇷','Curazao':'🇨🇼','Ecuador':'🇪🇨','Egipto':'🇪🇬','Escocia':'🇬🇧','España':'🇪🇸','Estados Unidos':'🇺🇸','Francia':'🇫🇷','Ghana':'🇬🇭','Haití':'🇭🇹','Inglaterra':'🇬🇧','Iraq':'🇮🇶','Irán':'🇮🇷','Japón':'🇯🇵','Jordania':'🇯🇴','Marruecos':'🇲🇦','México':'🇲🇽','Noruega':'🇳🇴','Nueva Zelanda':'🇳🇿','Panamá':'🇵🇦','Paraguay':'🇵🇾','Países Bajos':'🇳🇱','Portugal':'🇵🇹','Qatar':'🇶🇦','RD Congo':'🇨🇩','Senegal':'🇸🇳','Sudáfrica':'🇿🇦','Suecia':'🇸🇪','Suiza':'🇨🇭','Túnez':'🇹🇳','Türkiye':'🇹🇷','Uruguay':'🇺🇾','Uzbekistán':'🇺🇿'};
function tf(n){return (FLAG[n]||'')+'  '+tn(n);}  /* bandera + nombre (tablas/tarjetas) */

function bar(p, max, color){
  const w = Math.max(0, Math.min(100, 100*p/max));
  return `<span class="barwrap" style="width:150px"><span class="barfill" style="width:${w.toFixed(1)}%;background:${color}"></span></span>`;
}
function wdlBar(pA,pD,pB){
  return `<span class="wdl"><span style="width:${pA}%;background:#0048ff"></span>`+
         `<span style="width:${pD}%;background:#b9c2d6"></span>`+
         `<span style="width:${pB}%;background:#4e00ff"></span></span>`;
}
function sortByTitle(obj){ return Object.entries(obj).sort((a,b)=>b[1]-a[1]); }

/* ---------- CHAMPION divergence chart (consensus) ---------- */
function champDivergence(){
  const st = DATA.consensus.title_stat;
  const med = DATA.consensus.title_median, mean = DATA.consensus.title;
  const top = Object.entries(med).sort((a,b)=>b[1]-a[1]).slice(0,16);
  const MAX = 24;
  let h = '';
  for(const [t,m] of top){
    const s = st[t]; const cl=DATA.claude.title[t], ch=DATA.chatgpt.title[t], gm=DATA.gemini.title[t];
    const pos = v => (100*v/MAX);
    h += `<div class="chrow">
      <div class="chteam">${tf(t)}<br><span class="elo">${tx('nivel','strength')} ${ELO[t]||'—'}</span></div>
      <div class="track">
        <div class="range" style="left:${pos(s.min)}%;width:${pos(s.max-s.min)}%"></div>
        <div class="medmark" style="left:${pos(m)}%"></div>
        <div class="dot" style="left:${pos(cl)}%;background:${COL.Claude}" title="Claude ${fmt(cl)}"></div>
        <div class="dot" style="left:${pos(ch)}%;background:${COL.ChatGPT}" title="ChatGPT ${fmt(ch)}"></div>
        <div class="dot" style="left:${pos(gm)}%;background:${COL.Gemini}" title="Gemini ${fmt(gm)}"></div>
      </div>
      <div class="chnums"><span class="med">${fmt(m)}</span><br><span class="mn">${tx('media','avg')} ${fmt(mean[t])} · ${s.min}–${s.max}</span></div>
    </div>`;
  }
  return h;
}

/* ---------- Bota de Oro: goleadores ---------- */
function medalCls(i){return i===0?'gold':(i===1?'sil':(i===2?'bro':''));}
function scorersConsensus(){
  const list=(DATA.consensus&&DATA.consensus.scorers)||[]; if(!list.length) return '';
  const MAX=Math.max.apply(null,list.map(s=>s.prob))*1.08;
  let h='<ol class="scorers">';
  list.forEach((s,i)=>{
    const chips=[s.cl!=null?`<span class="sk-chip">Claude ${s.cl}%</span>`:'',
                 s.cg!=null?`<span class="sk-chip">ChatGPT ${s.cg}%</span>`:'',
                 s.gm!=null?`<span class="sk-chip">Gemini ${s.gm}%</span>`:''].join('');
    const agcls=s.models>=3?'three':(s.models===2?'two':'one');
    const agtip=s.models>=3?tx('Las tres IAs lo incluyen en su Top 10','All three AIs list him in their Top 10')
              :(s.models===2?tx('Dos de las tres IAs lo incluyen','Two of the three AIs list him')
                            :tx('Solo una IA lo incluye','Only one AI lists him'));
    const agree=`<span class="sk-agree ${agcls}" tabindex="0" data-tip="${agtip}">${s.models} IA</span>`;
    h+=`<li class="sk"><span class="sk-rank ${medalCls(i)}">${i+1}</span>
      <div class="sk-main"><span class="sk-name">${s.player}</span> <span class="sk-team">${tf(s.team)}</span>${agree}
        <div class="sk-bar"><span style="width:${100*s.prob/MAX}%"></span></div></div>
      <div class="sk-right"><div class="sk-prob">${fmt(s.prob)}</div><div class="sk-chips">${chips}</div></div></li>`;
  });
  return h+'</ol>';
}
function scorersAI(aiKey){
  const list=(DATA[aiKey]&&DATA[aiKey].scorers)||[]; if(!list.length) return '';
  const MAX=Math.max.apply(null,list.map(s=>s.prob))*1.08;
  let h='<ol class="scorers">';
  list.forEach((s,i)=>{
    const note=s.note?` <span class="term" tabindex="0" role="note" aria-label="${s.note}" data-tip="${s.note}">ⓘ</span>`:'';
    const extra=(s.xg!=null)?`<div class="sk-chips">${tx('goles esperados','expected goals')} ${s.xg}</div>`:'';
    h+=`<li class="sk"><span class="sk-rank ${medalCls(i)}">${s.rank||i+1}</span>
      <div class="sk-main"><span class="sk-name">${s.player}</span> <span class="sk-team">${tf(s.team)}</span>${note}
        <div class="sk-bar"><span style="width:${100*s.prob/MAX}%"></span></div></div>
      <div class="sk-right"><div class="sk-prob">${fmt(s.prob)}</div>${extra}</div></li>`;
  });
  return h+'</ol>';
}

/* ---------- reach table ---------- */
function reachTable(reach, teams){
  let h = `<div class="reachscroll"><table><thead><tr><th>${tx('Selección','Team')}</th><th>R32</th><th>${tx('Octavos','R16')}</th><th>${tx('Cuartos','QF')}</th><th>${tx('Semis','SF')}</th><th>${tx('Final','Final')}</th><th>${tx('Campeón','Champion')}</th></tr></thead><tbody>`;
  for(const t of teams){
    const r = k => reach[k] && reach[k][t]!=null ? fmt(reach[k][t]) : '—';
    h += `<tr><td class="tm">${tf(t)}</td><td>${r('R32')}</td><td>${r('R16')}</td><td>${r('QF')}</td><td>${r('SF')}</td><td>${r('FINAL')}</td><td class="hl">${r('CAMPEON')}</td></tr>`;
  }
  return h+'</tbody></table></div>';
}
// las 48 selecciones ordenadas por una tabla de campeón dada
function all48(titleObj){ return Object.entries(titleObj).sort((a,b)=>b[1]-a[1]).map(x=>x[0]); }
// panel desplegable con la metodología completa de una IA
function methPanel(aiKey){
  const m = DATA.meth[aiKey]; if(!m) return '';
  const title=(LANG==='en'&&m.title_en)?m.title_en:m.title;
  const html=(LANG==='en'&&m.html_en)?m.html_en:m.html;
  return `<div style="margin-top:12px"><div style="font-weight:700;font-size:12.5px;color:var(--deep-blue);margin-bottom:6px;padding-top:10px;border-top:1px solid var(--border)">⚙️ ${tx('Algoritmo y metodología completa','Full algorithm and methodology')} · ${title}</div><div class="methbody">${html}</div></div>`;
}
function backtestPanel(aiKey){
  const b = (DATA.backtest||{})[aiKey]; if(!b) return '';
  const title=(LANG==='en'&&b.title_en)?b.title_en:b.title;
  const html=(LANG==='en'&&b.html_en)?b.html_en:b.html;
  return `<div style="margin-top:12px"><div style="font-weight:700;font-size:12.5px;color:var(--deep-blue);margin-bottom:6px;padding-top:10px;border-top:1px solid var(--border)">📊 ${tx('Backtesting y validación estadística','Backtesting and statistical validation')} · ${title}</div><div class="methbody">${html}</div></div>`;
}

/* ---------- champion bars (per AI) ---------- */
function champBars(title, color){
  const all = sortByTitle(title); const MAX=Math.max(...all.map(x=>x[1]));
  let h='<div class="reachscroll" style="padding:6px 12px">';
  let r=0;
  for(const [t,p] of all){
    r++;
    h += `<div style="display:flex;align-items:center;gap:10px;margin:5px 0">
      <span style="width:26px;color:var(--muted);font-size:11px;text-align:right">${r}</span>
      <span style="width:118px;font-weight:700;color:var(--deep-blue);font-size:12.5px">${tf(t)}</span>
      ${bar(p,MAX,color)}<span style="font-weight:800;color:var(--deep-blue);font-size:12.5px">${fmt(p)}</span></div>`;
  }
  return h+`<div class="legend" style="margin:6px 2px 2px">${tx('Las 48 selecciones, ordenadas por probabilidad de campeón.','All 48 teams, ranked by title probability.')}</div></div>`;
}

/* ---------- group projection (consensus tab) ---------- */
function groupProjection(){
  const bt=DATA.best_thirds||[];
  let h='<div class="grid2">';
  for(const gl of Object.keys(DATA.groups)){
    const row = DATA.group_proj[gl];
    const cons = row.Consenso;
    h += `<div class="gcard"><div class="gh">${tx('Grupo','Group')} ${gl}</div>
      <table class="mtab"><thead><tr><th>#</th><th>${tx('Selección','Team')}</th><th>${tx('Pts esp. (cons.)','Exp. pts (cons.)')}</th><th></th></tr></thead><tbody>`;
    const w = {Claude:row.Claude[0][0],ChatGPT:row.ChatGPT[0][0],Gemini:row.Gemini[0][0]};
    cons.forEach((pair,i)=>{
      const [t,pts]=pair;
      const cls = i<2?'grp-q':(i===2&&bt.includes(gl)?'grp-3rd':'grp-out');
      const badge = i<2?'✓':(i===2&&bt.includes(gl)?'③':'');
      h+=`<tr class="${cls}"><td style="font-weight:800">${i+1}</td><td class="ta">${tf(t)}</td><td>${pts}</td><td style="font-size:12px">${badge}</td></tr>`;
    });
    const same = (w.Claude===w.ChatGPT)&&(w.ChatGPT===w.Gemini);
    h+=`</tbody></table><div class="legend">${same?(tx('✓ Las 3 IAs coinciden en el 1.º: ','✓ The 3 AIs agree on 1st: ')+'<b>'+tf(w.Claude)+'</b>'):(tx('⚠ Disputa por el 1.º — ','⚠ Dispute for 1st — ')+'Claude: '+tf(w.Claude)+' · ChatGPT: '+tf(w.ChatGPT)+' · Gemini: '+tf(w.Gemini))}</div></div>`;
  }
  h+=`</div><p class="note" style="margin-top:12px">${tx('🟣 Top 2 clasificados directamente · 🟡 ③ = mejor tercero (8 de 12 pasan) · Atenuado = no clasifica.','🟣 Top 2 qualify directly · 🟡 ③ = best third (8 of 12 advance) · Dimmed = does not qualify.')}</p>`;
  return h;
}

/* ---------- match table per AI ---------- */
/* ---------- ANCLA: tasa de empates histórica vs proyección ---------- */
function drawRateAnchor(){
  const meanD = arr => arr.reduce((s,m)=>s+m.pD,0)/arr.length;
  // Resultado real de la fase de grupos 2026 (completa, 72/72, verificada): 20 empates.
  const REAL_DRAWS=20, REAL_PLAYED=72, REAL=100*REAL_DRAWS/REAL_PLAYED; // 27.78 %
  const items = [
    {name:'Claude',  v: meanD(DATA.claude.fixtures), c:'var(--c-claude)'},
    {name:'ChatGPT', v: meanD(DATA.chatgpt.matches), c:'var(--c-chatgpt)'},
    {name:'Gemini',  v: meanD(DATA.gemini.matches),  c:'var(--c-gemini)'},
    {name: tx('Consenso','Consensus'), v: meanD(DATA.consensus.matches), c:'var(--purple)'},
  ];
  const MIN=15, MAX=32, BLO=19.44, BHI=24.10;
  const pct = v => Math.max(0,Math.min(100, 100*(v-MIN)/(MAX-MIN)));
  let best=items[0]; items.forEach(it=>{ if(Math.abs(it.v-REAL)<Math.abs(best.v-REAL)) best=it; }); // modelo + cercano al real
  const rows = items.map(it=>{
    const d = it.v-REAL;                                            // negativo = subestimó
    const dTxt = (d>=0?'+':'−')+Math.abs(d).toFixed(1)+' pp';
    return `<div class="anchor-row">
      <span class="ai" style="color:${it.c}">${it.name}${it===best?' <span class="closeflag">◀ '+tx('+ cercano','closest')+'</span>':''}</span>
      <div class="anchor-bar">
        <div class="band" style="left:${pct(BLO)}%;right:${100-pct(BHI)}%"></div>
        <div class="real-line" style="left:${pct(REAL)}%"></div>
        <div class="marker" style="left:${pct(it.v)}%;background:${it.c}"></div>
      </div>
      <span class="val">${it.v.toFixed(1)}%</span>
      <span class="stat ${it===best?'close':'under'}" title="${tx('vs real','vs actual')}">${dTxt}</span>
    </div>`;
  }).join('');
  const realRow = `<div class="anchor-row anchor-real">
      <span class="ai" style="color:var(--deep-blue);font-weight:800">${tx('Real 2026','Actual 2026')}</span>
      <div class="anchor-bar">
        <div class="band" style="left:${pct(BLO)}%;right:${100-pct(BHI)}%"></div>
        <div class="marker real" style="left:${pct(REAL)}%"></div>
      </div>
      <span class="val">${REAL.toFixed(1)}%</span>
      <span class="stat real">${REAL_DRAWS}/${REAL_PLAYED}</span>
    </div>`;
  return `<div class="anchor-card">
    <div class="anchor-title">🎯 ${tx('Tasa de empates · ancla histórica de los Mundiales','Draw rate · historical anchor of the World Cups')}</div>
    <div class="anchor-band-text">${tx(
      'Fase de grupos · era moderna 1998–2022 (336 partidos, 81 empates): <b>banda empírica 19.4 % – 24.1 %</b>. <b>Resultado real del Mundial 2026: 27.8 % (20/72)</b> — la fase de grupos más empatada del siglo XXI, por encima de Sudáfrica 2010 (27.08 %) y solo superada en la era moderna por Francia 1998 (33.33 %). Los cuatro modelos quedaron por debajo del dato real: la línea punteada marca el 27.8 % real y el marcador, lo que proyectó cada uno.',
      'Group stage · modern era 1998–2022 (336 matches, 81 draws): <b>empirical band 19.4 % – 24.1 %</b>. <b>Actual 2026 result: 27.8 % (20/72)</b> — the draw-heaviest group stage of the 21st century, above South Africa 2010 (27.08 %) and surpassed in the modern era only by France 1998 (33.33 %). All four models landed below the real figure: the dashed line marks the real 27.8 % and each marker shows what each one projected.'
    )}</div>
    ${realRow}
    ${rows}
    <details style="margin-top:10px"><summary style="cursor:pointer;font-size:12px;color:var(--muted)">${tx('Desglose por Mundial · 1998–2026','Breakdown by World Cup · 1998–2026')}</summary>
      <div style="margin-top:6px;font-size:12px;color:var(--muted);line-height:1.7">
        Francia 1998 — 33.33 % (16/48) · ${tx('Corea–Japón','Korea–Japan')} 2002 — 25.00 % (12/48) · ${tx('Alemania','Germany')} 2006 — 25.00 % (12/48) · ${tx('Sudáfrica','South Africa')} 2010 — 27.08 % (13/48) · ${tx('Brasil','Brazil')} 2014 — 18.75 % (9/48) · ${tx('Rusia','Russia')} 2018 — 18.75 % (9/48) · Qatar 2022 — 20.83 % (10/48) · <b style="color:var(--deep-blue)">${tx('Canadá–EE.UU.–México','Canada–USA–Mexico')} 2026 — 27.78 % (20/72)</b>.
        <br><br>${tx('El dato real de 2026 (27.78 %) cae por encima de la banda histórica y de lo que proyectó cualquier modelo: el más cercano fue Gemini (25.3 %) y el más alejado, ChatGPT (22.6 %); el delta de cada modelo frente al 27.8 % real aparece a la derecha de su fila. Por jornada: J1 fue la más empatada (9 de 24), seguida de J3 (6) y J2 (5). Nota metodológica: 2026 estrena el formato de 48 selecciones (72 partidos de grupos), frente a los 48 partidos por edición de 1998–2022; la tasa es comparable, pero el cambio de formato y el mayor tamaño de muestra son factores a considerar.','The real 2026 figure (27.78 %) lands above the historical band and above every model: closest was Gemini (25.3 %), furthest ChatGPT (22.6 %); each model’s gap to the real 27.8 % is shown at the right of its row. By matchday: MD1 was the most drawn (9 of 24), then MD3 (6) and MD2 (5). Methodological note: 2026 debuts the 48-team format (72 group matches) versus 48 matches per edition in 1998–2022; the rate is comparable, but the format change and larger sample are factors to weigh.')}
        <br><br>${tx('Subconjuntos relevantes: contemporáneo 2014–2022 = 19.4 % (28/144); siglo XXI sin 1998 = 22.6 % (65/288); global 1930–2022 (incluye eliminación a 90′) = 22.0 % (198/900).','Relevant subsets: contemporary 2014–2022 = 19.4 % (28/144); 21st century without 1998 = 22.6 % (65/288); historical global 1930–2022 (includes knockouts at 90′) = 22.0 % (198/900).')}
      </div>
    </details>
  </div>`;
}

function matchTableByAI(matches, showXg){
  // matches: array {a,b,pA,pD,pB,score,(xa,xb),md,date} ; agrupar por grupo, ordenar por jornada oficial
  let h='<div class="grid2">';
  for(const gl of Object.keys(DATA.groups)){
    const teams=DATA.groups[gl];
    const grp=matches.filter(m=>teams.includes(m.a)&&teams.includes(m.b)).sort((a,b)=>(a.md||0)-(b.md||0));
    h+=`<div class="gcard"><div class="gh">${tx('Grupo','Group')} ${gl}</div><table class="mtab"><tbody>`;
    let prevMd=0;
    for(const m of grp){
      if(m.md && m.md!==prevMd){ h+=`<tr class="md-sep"><td colspan="4"><span class="md-label">${tx('Jornada','Matchday')} ${m.md} · ${m.date||''}</span></td></tr>`; prevMd=m.md; }
      const xg = (showXg && m.xa!=null) ? `<span class="wdltxt" style="margin-left:0">xG ${m.xa}–${m.xb}</span>` : '';
      h+=`<tr><td class="ta">${tf(m.a)}</td><td class="sc">${m.score}${m.j3?'<sup style="color:#7c4dff;font-weight:800;font-size:8.5px;margin-left:2px" title="actualizado fecha 3">J3</sup>':''}</td><td class="tb">${tf(m.b)}</td>
        <td>${wdlBar(m.pA,m.pD,m.pB)}<span class="wdltxt">${Math.round(m.pA)}·${Math.round(m.pD)}·${Math.round(m.pB)}</span>${xg?'<br>'+xg:''}</td></tr>`;
    }
    h+='</tbody></table></div>';
  }
  return h+'</div>';
}

/* ---------- consensus match table with agreement ---------- */
function consensusMatchTable(){
  let h='<div class="grid2">';
  for(const gl of Object.keys(DATA.groups)){
    const teams=DATA.groups[gl];
    const grp=DATA.consensus.matches.filter(m=>teams.includes(m.a)&&teams.includes(m.b)).sort((a,b)=>(a.md||0)-(b.md||0));
    h+=`<div class="gcard"><div class="gh">${tx('Grupo','Group')} ${gl}</div><table class="mtab"><tbody>`;
    let prevMd=0;
    for(const m of grp){
      if(m.md && m.md!==prevMd){ h+=`<tr class="md-sep"><td colspan="4"><span class="md-label">${tx('Jornada','Matchday')} ${m.md} · ${m.date||''}</span></td></tr>`; prevMd=m.md; }
      const dots=`<span class="agree"><i class="${m.agree>=1?'on':''}"></i><i class="${m.agree>=2?'on':''}"></i><i class="${m.agree>=3?'on':''}"></i></span>`;
      const ci=m.conf_idx, ccol = ci>=75?'#1a9e5c':(ci>=55?'#0048ff':(ci>=45?'#b58900':'#c0392b'));
      const chip=`<span class="cchip" style="background:${ccol}" title="${tx('Confianza del pronóstico (0–100)','Forecast confidence (0–100)')}">${ci}</span>`;
      h+=`<tr><td class="ta">${tf(m.a)}</td><td class="sc">${m.score}</td><td class="tb">${tf(m.b)}</td>
        <td>${wdlBar(m.pA,m.pD,m.pB)} ${dots}${chip}</td></tr>`;
    }
    h+='</tbody></table></div>';
  }
  return h+'</div>';
}

/* ---------- HEAD TO HEAD ---------- */
const _MES={Ene:0,Feb:1,Mar:2,Abr:3,May:4,Jun:5,Jul:6,Ago:7,Sep:8,Oct:9,Nov:10,Dic:11,Jan:0,Apr:3,Aug:7,Dec:11};
function _matchDate(m){
  if(!m||!m.date) return null;
  const p=m.date.trim().split(/\s+/); const mo=_MES[p[0]]; const d=parseInt(p[1],10);
  if(mo==null||isNaN(d)) return null;
  return new Date(2026,mo,d);
}
// índices de los 72 partidos ordenados cronológicamente (fecha · grupo · jornada)
function h2hOrder(){
  return DATA.consensus.matches.map((m,idx)=>({idx,m})).sort((a,b)=>{
    const da=_matchDate(a.m), db=_matchDate(b.m);
    const ta=da?da.getTime():Infinity, tb=db?db.getTime():Infinity;
    if(ta!==tb) return ta-tb;
    const ga=a.m.group||a.m.grp||'', gb=b.m.group||b.m.grp||'';
    if(ga!==gb) return ga.localeCompare(gb);
    return (a.m.md||0)-(b.m.md||0);
  });
}
// ¿qué partidos ya se jugaron? señal principal: tienen marcador en results.json
function _finishedMap(){
  const arr = REAL_RESULTS || (typeof RESULTS_FALLBACK!=='undefined' ? _normResults(RESULTS_FALLBACK) : []);
  const mp={};
  (arr||[]).forEach(r=>{ if(r.ga!=null&&r.gb!=null) mp[[r.a,r.b].sort().join('|')]={fin:true,k:r.kickoff?new Date(r.kickoff):null};
                         else if(r.kickoff) mp[[r.a,r.b].sort().join('|')]={fin:false,k:new Date(r.kickoff)}; });
  return mp;
}
// un partido cuenta como "ya jugado/empezado" si tiene marcador final, o si tiene hora de inicio y ya pasó
function _isPlayed(m, fin){
  const e=fin[[m.a,m.b].sort().join('|')]; if(!e) return false;
  if(e.fin) return true;
  if(e.k && !isNaN(e.k) && Date.now()>=e.k.getTime()) return true;  // hora de inicio ya pasó
  return false;
}
// partido por defecto: el primero AÚN NO JUGADO desde hoy (usa fecha del sistema)
function defaultH2HIndex(){
  const order=h2hOrder(); if(!order.length) return 0;
  const today=new Date(); today.setHours(0,0,0,0);
  const fin=_finishedMap();
  const next=order.find(o=>{const d=_matchDate(o.m); return d && d.getTime()>=today.getTime() && !_isPlayed(o.m,fin);});
  if(next) return next.idx;                       // primer partido de hoy (o siguiente) sin jugar
  return order[order.length-1].idx;               // todo jugado -> último
}
function h2hOptions(){
  let html='', cur=null;
  h2hOrder().forEach(({idx,m})=>{
    const dt=m.date||'—';
    if(dt!==cur){ if(cur!==null) html+='</optgroup>'; html+=`<optgroup label="${dt}">`; cur=dt; }
    const g=m.group||m.grp||'';
    html+=`<option value="${idx}">${g} · ${tf(m.a)} vs ${tf(m.b)}</option>`;
  });
  if(cur!==null) html+='</optgroup>';
  return html;
}
let _h2hAuto=true;                          // true mientras el usuario no elija manualmente
function h2hPick(v){ _h2hAuto=false; renderH2H(v); }
function applyH2HDefault(){
  const i=defaultH2HIndex();
  const s=document.getElementById('h2h-sel'); if(s) s.value=String(i);
  renderH2H(i);
}
// filtros del comparador
let h2h_filters = {group: '', team: ''};
function h2hApplyFilters(){
  const gv = document.getElementById('h2h-group')?.value || '';
  const tv = document.getElementById('h2h-team')?.value || '';
  h2h_filters = {group: gv, team: tv.toLowerCase()};
  h2hRenderTable();
}
function h2hClearFilters(){ document.getElementById('h2h-group').value=''; document.getElementById('h2h-team').value=''; h2h_filters={group:'',team:''}; h2hRenderTable(); }
function h2hRenderTable(){
  let rows = DATA.consensus.matches.filter(m=>{
    if(h2h_filters.group && (m.grp||m.group)!==h2h_filters.group) return false;
    if(h2h_filters.team && !(m.a.toLowerCase().includes(h2h_filters.team) || m.b.toLowerCase().includes(h2h_filters.team))) return false;
    return true;
  });
  let html = '<div class="h2h-table">';
  rows.forEach((m,i)=>{
    const g=m.by['Gemini']||{}; const c=m.by['Claude']||{}; const ch=m.by['ChatGPT']||{};
    const rz = REAL_RESULTS?.find(r=>(r.a===m.a&&r.b===m.b)||(r.a===m.b&&r.b===m.a));
    const jugado = rz && rz.ga!=null && rz.gb!=null;
    const sc = jugado ? `${rz.ga}-${rz.gb}` : '';            // en blanco si no se ha jugado
    const ven = m.venue ? `<div class="venue">📍 ${m.venue}</div>` : '';
    html+=`<div class="h2h-row-compact${jugado?' played':''}" onclick="h2hShowDetail(${DATA.consensus.matches.indexOf(m)})">
      <div class="date">${m.date||''}${ven}</div>
      <div class="teams"><b>${tf(m.a)}</b> vs <b>${tf(m.b)}</b></div>
      <div class="score">${sc}</div>
      <div class="preds">
        <div class="pred" style="background:${COL.Claude}20;color:${COL.Claude}"><span class="plabel">Claude</span>${c.score||'—'}</div>
        <div class="pred" style="background:${COL.ChatGPT}20;color:${COL.ChatGPT}"><span class="plabel">ChatGPT</span>${ch.score||'—'}</div>
        <div class="pred" style="background:${COL.Gemini}20;color:${COL.Gemini}"><span class="plabel">Gemini</span>${g.score||'—'}</div>
        <div class="pred" style="background:${COL.Consenso}20;color:${COL.Consenso}"><span class="plabel">Consenso</span>${m.score||'—'}</div>
      </div>
    </div>`;
  });
  html+=`</div><div style="margin-top:8px;font-size:11px;color:var(--muted);">${rows.length} ${tx('de','of')} ${DATA.consensus.matches.length} ${tx('partidos','matches')}</div>`;
  document.getElementById('h2h-out').innerHTML = html;
}
function h2hShowDetail(idx){ _h2hAuto=false; renderH2H(idx); window.scrollTo({top: document.querySelector('.h2h-big')?.offsetTop - 100, behavior:'smooth'}); }
// hora local del estadio (viene en el ISO con su offset) + conversión a Colombia (UTC-5)
function _hhmm(iso){ return (iso && iso.length>=16) ? iso.slice(11,16) : ''; }
function _coTime(iso){ try{ return new Date(iso).toLocaleTimeString('es-CO',{timeZone:'America/Bogota',hour:'2-digit',minute:'2-digit',hour12:false}); }catch(e){ return ''; } }
function fixtureMeta(m){
  if(!m.kickoff && !m.venue) return '';
  let bits=[];
  const loc=_hhmm(m.kickoff), co=_coTime(m.kickoff);
  if(m.date && loc) bits.push(`${m.date} · ${loc} ${tx('hora local','local time')} <b>(${co} ${tx('hora Colombia','Colombia time')})</b>`);
  else if(m.date) bits.push(m.date);
  let s=bits.join('');
  if(m.venue) s+=`${s?' &nbsp;·&nbsp; ':''}<span class="ven">📍 ${m.venue}</span>`;
  return `<div class="fixture-meta">${s}</div>`;
}
function renderH2H(idx){
  const m = DATA.consensus.matches[idx];
  const claudeRich = DATA.claude.fixtures.find(f=>(f.a===m.a&&f.b===m.b)||(f.a===m.b&&f.b===m.a));
  let rows='';
  for(const ai of ['Claude','ChatGPT','Gemini']){
    const r=m.by[ai];
    rows+=`<div class="h2h-row"><span class="nm" style="color:${COL[ai]}">${ai}</span>
      <span>${wdlBar(r.pA,r.pD,r.pB)}<span class="wdltxt">${r.pA}% · ${r.pD}% · ${r.pB}%</span></span>
      <span style="font-weight:800;color:var(--purple);text-align:right">${r.score}</span></div>`;
  }
  rows+=`<div class="h2h-row" style="border-top:1px solid var(--border);padding-top:10px;margin-top:6px">
    <span class="nm" style="color:var(--c-cons)">${tx('Consenso','Consensus')}</span>
    <span>${wdlBar(m.pA,m.pD,m.pB)}<span class="wdltxt">${m.pA}% · ${m.pD}% · ${m.pB}%</span></span>
    <span style="font-weight:800;color:var(--purple);text-align:right">${m.score}</span></div>`;
  const agreeTxt = m.agree===3?tx('Las 3 IAs coinciden en el favorito','All 3 AIs agree on the favorite'):(m.agree===2?tx('2 de 3 coinciden en el favorito','2 of 3 agree on the favorite'):tx('Las 3 difieren en el favorito','The 3 AIs differ on the favorite'));
  // nota si el marcador de consenso es empate pero la barra inclina a un equipo
  const hg=parseInt(m.score.split('-')[0]), ag=parseInt(m.score.split('-')[1]);
  const favWin = (m.pA>m.pD && m.pA>=m.pB) || (m.pB>m.pD && m.pB>=m.pA);
  const drawNote = (hg===ag && favWin) ? tx(` El marcador de consenso (${m.score}) es el resultado exacto más probable (voto mayoritario de las 3 IAs); la barra muestra que un equipo es ligero favorito a ganar — son métricas distintas.`,` The consensus scoreline (${m.score}) is the single most likely exact result (majority vote of the 3 AIs); the bar shows one team is a slight favorite to win — these are different metrics.`) : '';
  // goles esperados por IA (Claude y Gemini v2 los publican)
  let xgline='';
  if(m.xg && m.xg.Claude){
    xgline=`<div class="legend" style="margin-top:10px">${tx('Goles esperados (xG)','Expected goals (xG)')} — <b style="color:${COL.Claude}">Claude</b> ${m.xg.Claude[0]}–${m.xg.Claude[1]} &nbsp;·&nbsp; <span style="color:var(--muted)">${tx('ChatGPT v5 y Gemini v5 publican marcador modal y 1·X·2, sin xG','ChatGPT v5 and Gemini v5 publish modal scoreline and 1·X·2, no xG')}</span></div>`;
  }
  let rich='';
  if(claudeRich){
    const f=claudeRich;
    const chips = f.top_scores.map(s=>`<span class="s">${s[0]}<em>${s[1]}%</em></span>`).join('');
    rich = `<div style="margin-top:14px"><div class="legend" style="margin-bottom:6px"><b>${tx('Detalle distribucional de Claude','Claude distributional detail')}</b> ${tx('(motor Dixon-Coles): marcadores más probables','(Dixon-Coles engine): most likely scorelines')}</div>
      <div class="scorechips">${chips}</div>
      <div class="rich">
        <div class="m"><div class="v">${f.over25}%</div><div class="l">${tx('+2.5 goles','Over 2.5 goals')}</div></div>
        <div class="m"><div class="v">${f.btts}%</div><div class="l">${tx('Ambos marcan','Both teams score')}</div></div>
        <div class="m"><div class="v">${f.conf}%</div><div class="l">${tx('Confianza (entropía)','Confidence (entropy)')}</div></div>
        <div class="m"><div class="v">${f.cs_a}%</div><div class="l">${tx('Sin gol en contra','Clean sheet')} · ${tf(f.a)}</div></div>
        <div class="m"><div class="v">${f.cs_b}%</div><div class="l">${tx('Sin gol en contra','Clean sheet')} · ${tf(f.b)}</div></div>
        <div class="m"><div class="v">${f.xpts_a}/${f.xpts_b}</div><div class="l">${tx('Puntos esperados','Expected points')}</div></div>
      </div></div>`;
  }
  // índice de consenso: cifra + veredicto en lenguaje claro; teoría en tooltip
  const ci=m.conf_idx, col = ci>=75?'#1a9e5c':(ci>=55?'#0048ff':(ci>=45?'#b58900':'#c0392b'));
  const verdict = ci>=75?tx('Favorito claro · las 3 IAs coinciden','Clear favorite · all 3 AIs agree'):(ci>=55?tx('Favorito moderado','Moderate favorite'):(ci>=45?tx('Partido igualado','Close match'):tx('Muy igualado · difícil de predecir','Very close · hard to call')));
  const favName = (m.pA>=m.pD&&m.pA>=m.pB)?m.a:((m.pB>=m.pD&&m.pB>=m.pA)?m.b:null);
  const favLine = favName?`${tx('Favorito del consenso','Consensus favorite')}: <b>${tf(favName)}</b> (${Math.round(Math.max(m.pA,m.pB))}%)`:tx('El empate es el resultado más probable','A draw is the most likely result');
  const tipTxt = tx(`Resume en una cifra cuán claro y consensuado es el resultado. Combina la fuerza del favorito con el acuerdo entre las 3 IAs — acuerdo ${m.agree_idx}/100; probabilidades combinadas (pool logarítmico) ${m.p_log[0]}% · ${m.p_log[1]}% · ${m.p_log[2]}%. Más alto = más claro y consensuado; más bajo = parejo o disputado.`,`A single figure for how clear and agreed the result is. It combines the favorite's strength with the agreement among the 3 AIs — agreement ${m.agree_idx}/100; combined probabilities (logarithmic pool) ${m.p_log[0]}% · ${m.p_log[1]}% · ${m.p_log[2]}%. Higher = clearer and more agreed; lower = close or disputed.`);
  const cidx=`<div class="cidx"><div class="ring" style="background:${col}">${ci}</div>
    <div class="meta">
      <div class="cidx-h">${tx('Confianza del pronóstico','Forecast confidence')}: <b style="margin-left:4px">${ci}/100</b><span class="tip" data-tip="${tipTxt}">i</span></div>
      <div class="cidx-v" style="color:${col}">${verdict}</div>
      <div class="legend" style="margin-top:2px">${favLine}</div>
    </div></div>`;
  document.getElementById('h2h-out').innerHTML =
    `<div class="h2h-big"><span class="h2h-team">${tf(m.a)}</span><span class="h2h-vs">vs</span><span class="h2h-team">${tf(m.b)}</span></div>
     ${fixtureMeta(m)}
     ${rows}<div class="insight" style="margin-top:14px"><p>${agreeTxt}. ${tx(`Barra: azul gana ${tn(m.a)} · gris empate · morado gana ${tn(m.b)}.`,`Bar: blue = ${tn(m.a)} wins · grey = draw · purple = ${tn(m.b)} wins.`)}${drawNote}</p></div>${cidx}${xgline}${rich}`;
}

/* ============ RENDER PANELS ============ */
// ranking de título por consenso (promedio de las 3 IAs): pre-Mundial vs actual
function consTitleRanks(){
  const E=DATA.title_evo&&DATA.title_evo.ais; if(!E) return null;
  const ais=['claude','chatgpt','gemini'];
  const cn=t=>{const v=ais.map(a=>(E[a].now||{})[t]).filter(x=>x!=null);return v.length?v.reduce((s,x)=>s+x,0)/v.length:null;};
  const cp=t=>{const v=ais.map(a=>(DATA[a].title||{})[t]).filter(x=>x!=null);return v.length?v.reduce((s,x)=>s+x,0)/v.length:0;};
  const sp=t=>{const v=ais.map(a=>(E[a].now||{})[t]).filter(x=>x!=null);return v.length?{min:Math.min.apply(null,v),max:Math.max.apply(null,v),d:Math.max.apply(null,v)-Math.min.apply(null,v)}:{min:0,max:0,d:0};};
  let teams={}; ais.forEach(a=>Object.keys(E[a].now||{}).forEach(t=>teams[t]=true));
  const arr=Object.keys(teams).map(t=>({t,now:cn(t),pre:cp(t),sp:sp(t)})).filter(x=>x.now!=null);
  return {arr, nowRank:arr.slice().sort((a,b)=>b.now-a.now), preRank:arr.slice().sort((a,b)=>b.pre-a.pre)};
}
function consensusVerdict(){
  const c=DATA.consensus, R=consTitleRanks();
  if(!R){ // respaldo: comportamiento anterior si no hay title_evo
    const top=Object.entries(c.title_median).sort((a,b)=>b[1]-a[1]).slice(0,3), t1=top[0],t2=top[1],t3=top[2];
    const cont=Object.values(c.title_median).filter(v=>v>=5).length;
    const pod0=(rk,t,cls)=>`<div class="pod ${cls}"><div class="rk">${rk}</div><div class="tm">${tf(t[0])}</div><div class="pc">${fmt(t[1])}</div><div class="pl">${tx('campeón','champion')}</div></div>`;
    return `<div class="verdict"><p class="vlead">${tx('El veredicto del consenso · Mundial 2026','The consensus verdict · World Cup 2026')}</p><p class="vmain">${tx(`Las tres IAs coinciden: <b>${tn(t1[0])}</b> es la favorita (${fmt(t1[1])}).`,`The three AIs agree: <b>${tn(t1[0])}</b> is the favorite (${fmt(t1[1])}).`)}</p><div class="podium">${pod0('🥈',t2,'p2')}${pod0('🥇',t1,'p1')}${pod0('🥉',t3,'p3')}</div></div>`;
  }
  const preFav=R.preRank[0], now=R.nowRank, n1=now[0],n2=now[1],n3=now[2];
  const same=preFav.t===n1.t;
  const verdict = same
    ? tx(`Antes y después de la fase de grupos, las tres IAs coinciden: <b>${tn(n1.t)}</b> es la favorita al título. Con resultados y cuadro reales, el consenso la sitúa en <b>${fmt(n1.now)}</b> (era ${fmt(preFav.pre)} pre-Mundial), por delante de ${tn(n2.t)} y ${tn(n3.t)}.`,`Before and after the group stage, the three AIs agree: <b>${tn(n1.t)}</b> is the title favorite. With real results and bracket, the consensus puts it at <b>${fmt(n1.now)}</b> (was ${fmt(preFav.pre)} pre-tournament), ahead of ${tn(n2.t)} and ${tn(n3.t)}.`)
    : tx(`<b>Pre-Mundial</b>, las tres IAs daban como favorita a <b>${tn(preFav.t)}</b> (${fmt(preFav.pre)}). <b>Tras la fase de grupos</b>, con resultados y cuadro reales, el consenso actualizado pone al frente a <b>${tn(n1.t)}</b> (${fmt(n1.now)}), por delante de ${tn(n2.t)} y ${tn(n3.t)}. Sigue siendo un Mundial abierto.`,`<b>Pre-tournament</b>, the three AIs had <b>${tn(preFav.t)}</b> as favorite (${fmt(preFav.pre)}). <b>After the group stage</b>, with real results and bracket, the updated consensus puts <b>${tn(n1.t)}</b> in front (${fmt(n1.now)}), ahead of ${tn(n2.t)} and ${tn(n3.t)}. It remains an open World Cup.`);
  const pod=(rk,x,cls)=>{const d=x.now-x.pre,up=d>0.3,dn=d<-0.3,col=up?'#7CFFB2':(dn?'#FF9C9C':'rgba(255,255,255,.6)'),arr=up?'▲':(dn?'▼':'–');
    return `<div class="pod ${cls}"><div class="rk">${rk}</div><div class="tm">${tf(x.t)}</div><div class="pc">${fmt(x.now)}</div><div class="pl">${tx('campeón · actual','champion · now')}</div><div style="font-size:10.5px;color:${col};margin-top:3px;font-weight:700">${arr}${Math.abs(d).toFixed(1)} · ${tx('pre','pre')} ${fmt(x.pre)}</div></div>`;};
  return `<div class="verdict">
    <p class="vlead">${tx('El veredicto del consenso · Mundial 2026 · actualizado tras la fase de grupos','The consensus verdict · World Cup 2026 · updated after the group stage')}</p>
    <p class="vmain">${verdict}</p>
    <div class="podium">${pod('🥈',n2,'p2')}${pod('🥇',n1,'p1')}${pod('🥉',n3,'p3')}</div>
  </div>`;
}
function keyTakeaways(){
  const c=DATA.consensus, R=consTitleRanks();
  if(!R){ // respaldo anterior
    const fav=Object.entries(c.title_median).sort((a,b)=>b[1]-a[1])[0];
    let dis=null; for(const t in c.title_stat){const s=c.title_stat[t]; if(s.median<3)continue; const sp=s.max-s.min; if(!dis||sp>dis.sp)dis={t,sp,min:s.min,max:s.max};}
    let safe=null,coin=null; for(const m of c.matches){if(!safe||m.conf_idx>safe.conf_idx)safe=m; if(!coin||m.conf_idx<coin.conf_idx)coin=m;}
    return `<div class="takeaways"><div class="tk blue"><div class="lab">${tx('Favorito del consenso','Consensus favorite')}</div><div class="big">${tf(fav[0])}</div><div class="sub">${fmt(fav[1])}</div></div><div class="tk"><div class="lab">${tx('Mayor desacuerdo','Biggest disagreement')}</div><div class="big">${tf(dis.t)}</div><div class="sub">${fmt(dis.min)}–${fmt(dis.max)}</div></div><div class="tk green"><div class="lab">${tx('Más seguro','Safest')}</div><div class="big">${tf(safe.a)} vs ${tf(safe.b)}</div><div class="sub">${safe.conf_idx}/100</div></div><div class="tk red"><div class="lab">${tx('Moneda al aire','Coin flip')}</div><div class="big">${tf(coin.a)} vs ${tf(coin.b)}</div><div class="sub">${coin.conf_idx}/100</div></div></div>`;
  }
  const preFav=R.preRank[0], nowFav=R.nowRank[0];
  const faller=R.arr.slice().sort((a,b)=>(a.now-a.pre)-(b.now-b.pre))[0];
  const dis=R.arr.filter(x=>x.now>=3).slice().sort((a,b)=>b.sp.d-a.sp.d)[0]||R.arr[0];
  return `<div class="takeaways">
    <div class="tk"><div class="lab">${tx('Favorito PRE-MUNDIAL','Pre-tournament favorite')}</div><div class="big">${tf(preFav.t)}</div><div class="sub">${fmt(preFav.pre)} ${tx('· antes del torneo','· before the tournament')}</div></div>
    <div class="tk blue"><div class="lab">${tx('Favorito ACTUAL · tras grupos','Current favorite · after groups')}</div><div class="big">${tf(nowFav.t)}</div><div class="sub">${fmt(nowFav.now)} · ${tx('era','was')} ${fmt(nowFav.pre)} ▲</div></div>
    <div class="tk red"><div class="lab">${tx('Mayor caída tras grupos','Biggest drop after groups')}</div><div class="big">${tf(faller.t)}</div><div class="sub">${tx('de','from')} ${fmt(faller.pre)} ${tx('a','to')} ${fmt(faller.now)} ▼</div></div>
    <div class="tk green"><div class="lab">${tx('Mayor desacuerdo entre IAs','Biggest disagreement between AIs')}</div><div class="big">${tf(dis.t)}</div><div class="sub">${fmt(dis.sp.min)} ${tx('a','to')} ${fmt(dis.sp.max)} ${tx('· actual','· current')}</div></div>
  </div>`;
}
function renderConsenso(){
  const c=DATA.consensus;
  const champTop = Object.entries(c.title_median).sort((a,b)=>b[1]-a[1]).slice(0,12).map(x=>x[0]);
  const el=document.getElementById('consenso');
  el.innerHTML = `
  ${consensusVerdict()}
  ${keyTakeaways()}

  ${consensusExplainer()}

  ${koSection('cons','var(--c-cons)',tx('Consenso','Consensus'))}

  ${titleConsolidated()}

  <div class="section-title">${tx('Probabilidad de campeón PRE-MUNDIAL — las 3 IAs y el consenso','Champion probability PRE-TOURNAMENT — the 3 AIs and the consensus')}</div>
  <p class="note">${tx('Esta es la línea base <b>previa al Mundial</b> (antes del sorteo y de cualquier partido). La probabilidad <b>actual</b>, ya con resultados y cuadro real, está en el cuadro «Probabilidad de campeón · consolidado» de más arriba.','This is the <b>pre-tournament</b> baseline (before the draw and any match). The <b>current</b> probability, with real results and bracket, is in the «Champion probability · consolidated» panel above.')}</p>
  <div class="card">
    <div class="legend" style="margin-bottom:10px">
      <span class="dotleg" style="background:var(--c-claude)"></span>Claude
      <span class="dotleg" style="background:var(--c-chatgpt)"></span>ChatGPT
      <span class="dotleg" style="background:var(--c-gemini)"></span>Gemini
      <span style="margin-left:14px">${tx('línea morada vertical = <b>mediana de consenso</b> · barra gris = rango entre IAs','purple vertical line = <b>consensus median</b> · grey bar = range across AIs')}</span>
      <span style="margin-left:14px">${term(tx('¿qué es el «nivel»?','what is «strength»?'), tx('Medida de fuerza de cada selección que se recalcula tras cada partido, parecida a un ranking dinámico. Técnicamente, un sistema Elo.','A strength measure for each team recomputed after every match, like a dynamic ranking. Technically, an Elo system.'))}</span>
    </div>
    ${champDivergence()}
  </div>
  <div class="insight"><p>${tx(`Por qué difieren: cada IA cree que un Mundial lo decide algo distinto. <b>Gemini</b> mira el ${term('estado físico actual','Minutos de alta exigencia jugados en clubes esta temporada (Champions, Libertadores) como señal de desgaste y rodaje de cada plantilla')} de los jugadores y penaliza al campeón vigente: baja a Argentina y sube a Francia. <b>ChatGPT</b> confía en la ${term('historia y los rankings','Posición en el ranking FIFA, valor de las plantillas y resultados de Mundiales anteriores')} y encabeza con España. <b>Claude</b> combina el ${term('rendimiento real de goles','Goles marcados y recibidos en partidos internacionales reales, analizados partido a partido')} con el ${term('nivel actualizado de cada equipo','Una medida de fuerza que se recalcula tras cada partido, parecida a un ranking dinámico. Técnicamente se llama sistema Elo.')}, y realza a Brasil, Inglaterra y Colombia. El <b>consenso</b> toma el punto medio de las tres y modera los extremos.`,`Why they differ: each AI believes a World Cup is decided by something different. <b>Gemini</b> looks at the players' ${term('current physical state','High-intensity minutes played at clubs this season (Champions League, Libertadores) as a sign of each squads wear and match sharpness')} and penalizes the reigning champion: Argentina drops, France rises. <b>ChatGPT</b> trusts ${term('history and the rankings','FIFA ranking position, squad market value and results from previous World Cups')} and leads with Spain. <b>Claude</b> combines ${term('real goal performance','Goals scored and conceded in real international matches, analyzed game by game')} with an ${term('up-to-date team strength','A strength measure recomputed after every match, like a dynamic ranking. Technically it is called an Elo system.')}, raising Brazil, England and Colombia. The <b>consensus</b> takes the middle ground of the three and tempers the extremes.`)}</p></div>

  <div class="section-title">🥇 ${tx('Bota de Oro — Top 10 goleadores (consenso)','Golden Boot — Top 10 scorers (consensus)')}</div>
  <p class="note">${tx('Una dimensión nueva: ya no solo qué selección gana, sino qué jugador marca más. Ahora las <b>tres IAs</b> pronostican goleadores —incluido el <b>nuevo modelo de jugador de Claude</b>, que parte de los goles que su modelo de selección proyecta para cada equipo—. El consenso promedia las probabilidades e indica en cuántas IAs coincide cada nombre.','A new dimension: not just which team wins, but which player scores most. Now <b>all three AIs</b> forecast scorers —including <b>the new Claude player-level model</b>, built on the goals its team model projects for each side—. The consensus averages the probabilities and shows how many AIs agree on each name.')}</p>
  <div class="card scorers-track" data-scorers-src="consenso">${scorersConsensus()}</div>

  <div class="section-title">${tx('Comparador cara a cara — partido por partido','Head-to-head comparator — match by match')}</div>
  <div class="card">
    <p class="legend" style="margin-bottom:14px">${tx('Filtra y busca entre los 72 partidos. Haz clic en cualquiera para ver el detalle completo.','Filter and search among all 72 matches. Click any match to see full details.')}</p>
    <div class="h2h-filters">
      <div>
        <label>${tx('Grupo','Group')}</label>
        <select id="h2h-group" onchange="h2hApplyFilters()">
          <option value="">${tx('Todos','All')}</option>
          ${['A','B','C','D','E','F','G','H','I','J','K','L'].map(g=>`<option value="${g}">${tx(`Grupo ${g}`,`Group ${g}`)}</option>`).join('')}
        </select>
      </div>
      <div>
        <label>${tx('Búsqueda (equipo)','Search (team)')}</label>
        <input id="h2h-team" type="text" placeholder="${tx('ej: Brasil','e.g.: Brazil')}" onchange="h2hApplyFilters()" oninput="h2hApplyFilters()">
      </div>
    </div>
    <div class="h2h-filters-clear" onclick="h2hClearFilters()">${tx('Limpiar filtros','Clear filters')}</div>
    <div class="h2h-table-head" style="font-size:11px;color:var(--muted);margin-top:12px;margin-bottom:8px;padding:0 12px;font-weight:600;">
      <div>${tx('Fecha · Sede','Date · Venue')}</div><div>${tx('Partidos','Matches')}</div><div>${tx('Real','Result')}</div>
      <div class="preds-head"><div style="color:${COL.Claude}">Claude</div><div style="color:${COL.ChatGPT}">ChatGPT</div><div style="color:${COL.Gemini}">Gemini</div><div style="color:${COL.Consenso}">Consenso</div></div>
    </div>
    <div id="h2h-out"></div>
  </div>

  ${drawRateAnchor()}
  <div class="section-title">${tx('Los 72 partidos — consenso y confianza','The 72 matches — consensus and confidence')}</div>
  <p class="legend" style="margin-bottom:6px">${tx(`El <b>chip de color</b> resume la confianza del pronóstico: verde = favorito claro y las IAs de acuerdo · azul = favorito moderado · ámbar = parejo · rojo = muy parejo. Los tres puntos: en cuántas IAs coincide el favorito. En partidos muy parejos el marcador de consenso puede ser 1-1 aunque la barra incline a un equipo (la barra es quién gana; el marcador es el resultado exacto más probable).`,`The <b>colored chip</b> sums up forecast confidence: green = clear favorite and AIs agree · blue = moderate favorite · amber = close · red = very close. The three dots: how many AIs agree on the favorite. In very tight matches the consensus score can be 1-1 even if the bar leans to one team (the bar is who wins; the score is the single most likely exact result).`)}</p>
  ${consensusMatchTable()}

  <div class="section-title">${tx('Proyección de grupos — quién pasa','Group projection — who advances')}</div>
  ${groupProjection()}

  <div class="section-title">${tx('Camino al título — las 48 selecciones','Road to the title — all 48 teams')}</div>
  <div class="card">${reachTable(c.reach, all48(c.title_median))}
  <p class="legend">${tx('Probabilidad media de las tres IAs de alcanzar cada ronda, de Treintaidosavos a Campeón.','Average probability across the three AIs of reaching each round, from the Round of 32 to Champion.')}</p></div>

  <div class="section-title">${tx('Cómo se construye el consenso','How the consensus is built')}</div>
  <p class="lead">${tx(`Combina las versiones más avanzadas de las tres IAs. Para el título usa la <b>${term('mediana','El valor del medio de las tres IAs: si un modelo se va a un extremo, no arrastra el resultado.')}</b> de las tres; para los grupos, los <b>${term('puntos esperados','Promedio de puntos que sumaría cada equipo en sus 3 partidos de grupo, según las probabilidades de cada resultado.')}</b> de los 72 partidos; y para cada partido, el promedio de probabilidades con el marcador más votado. El <b>índice de confianza</b> de cada partido aparece explicado al pasar el cursor sobre su cifra.`,`It combines the most advanced versions of the three AIs. For the title it uses the <b>${term('median','The middle value of the three AIs: if one model goes to an extreme, it does not drag the result.')}</b> of the three; for the groups, the <b>${term('expected points','Average points each team would earn in its 3 group matches, given the probability of each result.')}</b> from the 72 matches; and for each match, the average of the probabilities with the most-voted scoreline. The <b>confidence index</b> for each match is explained on hover over its figure.`)}</p>`;
  _h2hAuto=true; h2hRenderTable();
}

// tabla de pronóstico de dieciseisavos para una IA (field: pred/cg/gm/cons)
function koPredHTML(field,color){
  const KR=DATA.ko_real||[]; if(!KR.length) return '';
  const ex=q=>(q&&(q.et==='Sí'||q.et==='Yes')?' <span style="color:var(--muted);font-size:11px">'+tx('+pró','+ET')+'</span>':'')+(q&&(q.pens==='Sí'||q.pens==='Yes')?' <span style="color:var(--muted);font-size:11px">'+tx('+pen','+pk')+'</span>':'');
  let _kph=null;
  const _RK={'F':5,'SF':4,'QF':3,'R16':2,'R32':1};
  KR.sort((x,y)=>(_RK[y.phase||'R32']||0)-(_RK[x.phase||'R32']||0)||(+x.code.slice(1))-(+y.code.slice(1)));
  const rows=KR.map(s=>{const p=s[field]; if(!p)return '';
    let div='';
    const ph=s.phase||'R32';
    if(ph!==_kph){_kph=ph;const _PN={'R16':['Octavos','Round of 16'],'R32':['Dieciseisavos','Round of 32'],'QF':['Cuartos','Quarterfinals'],'SF':['Semifinales','Semifinals'],'F':['Final','Final']};const nm=_PN[ph]?tx(_PN[ph][0],_PN[ph][1]):ph;div=`<tr><td colspan="5" style="padding:9px 8px 3px;font-size:10.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--purple)">${nm}</td></tr>`;}
    return div+`<tr style="border-top:1px solid var(--border)"><td style="padding:6px 8px;font-weight:700;color:var(--muted)">${s.code}</td><td style="padding:6px 8px">${tf(s.a)} <span style="color:var(--muted)">vs</span> ${tf(s.b)}</td><td style="padding:6px 8px;text-align:center;font-variant-numeric:tabular-nums;white-space:nowrap">${p.sc90}${ex(p)}</td><td style="padding:6px 8px;font-weight:700;color:${color}">${tf(p.winner)}</td><td style="padding:6px 8px;text-align:right;color:var(--muted)">${p.conf}%</td></tr>`;}).join('');
  return `<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12.5px">
    <thead><tr style="text-align:left;color:var(--muted);font-size:11px;font-weight:600"><th style="padding:4px 8px">#</th><th style="padding:4px 8px">${tx('Cruce','Tie')}</th><th style="padding:4px 8px;text-align:center">90′</th><th style="padding:4px 8px">${tx('Clasifica','Advances')}</th><th style="padding:4px 8px;text-align:right">${tx('Conf.','Conf.')}</th></tr></thead>
    <tbody>${rows}</tbody></table></div>`;
}
function koSection(field,color,label){
  if(!(DATA.ko_real||[]).length) return '';
  return `<div class="section-title" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:6px">⚽ ${tx('Fase eliminatoria · '+label,'Knockout stage · '+label)} <span style="font-size:10px;font-weight:800;color:#fff;background:var(--purple);padding:2px 9px;border-radius:10px;letter-spacing:.03em">${tx('OCTAVOS Y CUARTOS','R16 & QUARTERS')}</span></div>
  <p class="note">${tx('La predicción más reciente — '+label+' para los 16 cruces oficiales de la fase eliminatoria en curso: marcador a 90′, prórroga o penaltis si aplica, clasificado y confianza.','The most recent prediction — '+label+' for the 16 official knockout ties underway: 90-minute score, extra time or penalties if applicable, qualifier and confidence.')}</p>
  <div class="card">${koPredHTML(field,color)}</div>`;
}
// destacado compacto: top 3 al título (pronóstico PRE-Mundial de cada IA)
function champTop3Highlight(title,color){
  const t=sortByTitle(title).slice(0,3), m=['🥇','🥈','🥉'];
  return `<div class="card" style="padding:10px 14px;margin-bottom:10px"><span style="font-size:11px;color:var(--muted);font-weight:700;letter-spacing:.04em">${tx('TOP 3 AL TÍTULO · pronóstico previo al Mundial','TOP 3 TO WIN · pre-tournament forecast')}</span><div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:5px">${t.map((x,i)=>`<span style="font-weight:700">${m[i]} ${tf(x[0])} <span style="color:${color};font-weight:800">${fmt(x[1])}</span></span>`).join('')}</div></div>`;
}
// nota interpretativa por IA para el panel de evolución de título
function aiTitleNote(aiKey){
  if(aiKey==='claude') return tx('El gran salto es <b>Argentina</b>, favorita clara para Claude. Se confirma que <b>España baja</b> y <b>Francia sube</b>; aun así, el modelo de Claude todavía ubica a España por encima de Francia (Elo interno: España 2184 vs Francia 2142), a diferencia de ChatGPT, Gemini y el ranking oficial FIFA, que ya colocan a Francia por delante.','The big jump is <b>Argentina</b>, a clear favorite for Claude. It confirms that <b>Spain falls</b> and <b>France rises</b>; even so, the Claude model still ranks Spain above France (internal Elo: Spain 2184 vs France 2142), unlike ChatGPT, Gemini and the official FIFA ranking, which already place France ahead.');
  if(aiKey==='chatgpt') return tx('ChatGPT coincide en <b>Argentina</b> como favorita y es el más optimista con <b>Francia</b>, que sube al 2.º puesto por encima de España. Sus mayores caídas: España, Portugal y Marruecos.','ChatGPT agrees on <b>Argentina</b> as favorite and is the most optimistic about <b>France</b>, which rises to 2nd above Spain. Its biggest drops: Spain, Portugal and Morocco.');
  if(aiKey==='gemini') return tx('Gemini reparte más la probabilidad: <b>Argentina</b> favorita, pero ubica a <b>Inglaterra</b> (2.ª) y <b>Brasil</b> (3.º) por encima de Francia y España. Es el más conservador con Argentina (18.5 % frente al 25–33 % de los otros).','Gemini spreads probability more: <b>Argentina</b> favorite, but it places <b>England</b> (2nd) and <b>Brazil</b> (3rd) above France and Spain. It is the most conservative on Argentina (18.5% vs 25-33% from the others).');
  return '';
}
// evolución de la probabilidad de título de UNA IA: pre-Mundial → actual (tras fase de grupos)
function titleEvolutionAI(aiKey,color,label){
  const ev=DATA.title_evo&&DATA.title_evo.ais&&DATA.title_evo.ais[aiKey]; if(!ev||!ev.now) return '';
  const pre=DATA[aiKey].title||{}, now=ev.now;
  let rows=Object.keys(now).map(t=>({t,pre:pre[t]||0,now:now[t],d:now[t]-(pre[t]||0)}))
            .filter(r=>r.now>=0.5||Math.abs(r.d)>=0.5).sort((a,b)=>b.now-a.now).slice(0,14);
  const mx=Math.max.apply(null,rows.map(r=>Math.max(r.now,r.pre)))||1;
  const bar=(v,c)=>`<div style="height:8px;width:${(v/mx*100).toFixed(1)}%;min-width:2px;background:${c};border-radius:3px"></div>`;
  const body=rows.map(r=>{
    const up=r.d>0.3, dn=r.d<-0.3, col=up?'#16a34a':(dn?'#dc2626':'var(--muted)'), arr=up?'▲':(dn?'▼':'–');
    return `<div style="display:grid;grid-template-columns:128px 1fr 92px;gap:10px;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">
      <div style="font-weight:700;font-size:12.5px">${tf(r.t)}</div>
      <div style="display:flex;flex-direction:column;gap:3px">${bar(r.pre,'var(--border)')}${bar(r.now,color)}</div>
      <div style="text-align:right;font-size:12px"><b>${fmt(r.now)}</b> <span style="color:${col};font-weight:700">${arr}${Math.abs(r.d).toFixed(1)}</span></div>
    </div>`;
  }).join('');
  const note=aiTitleNote(aiKey);
  return `<div class="section-title" style="margin-top:6px">📈 ${tx('Probabilidad de título · '+label+' · pre-Mundial → actual','Title probability · '+label+' · pre-tournament → current')}</div>
  <p class="note">${tx('Probabilidad de ser campeón según '+label+': barra clara = pronóstico <b>pre-Mundial</b> (línea base fija, sin cambios) · barra de color = <b>actual</b> tras la fase de grupos, propagando el cuadro real de eliminatorias. La cifra y la flecha muestran la probabilidad actual y su cambio en puntos porcentuales.','Champion probability per '+label+': light bar = <b>pre-tournament</b> forecast (fixed baseline) · colored bar = <b>current</b> after the group stage, propagating the real knockout bracket. The number and arrow show the current probability and its change in percentage points.')}</p>
  <div class="card">
    <div style="display:flex;gap:16px;font-size:11px;color:var(--muted);margin-bottom:8px"><span>⬜ ${tx('pre-Mundial','pre-tournament')}</span><span style="color:${color}">▮ ${tx('actual','current')}</span></div>
    ${body}
    ${note?`<p style="font-size:11.5px;color:var(--muted);margin:10px 0 0;line-height:1.55">${note}</p>`:''}
  </div>`;
}
// recuadro que explica con claridad qué es el consenso (varias personas preguntan)
function consensusExplainer(){
  return `<div class="card" style="border-left:4px solid var(--purple)">
    <div style="font-weight:800;font-size:14px;margin-bottom:6px">🤝 ${tx('¿Qué es el «consenso»?','What is the «consensus»?')}</div>
    <p style="margin:0;font-size:12.5px;line-height:1.65">${tx('El consenso <b>combina a las tres IAs (Claude, ChatGPT y Gemini) en una sola visión</b>, para no depender de un único modelo. Se calcula de dos maneras, según el dato:<br>&nbsp;&nbsp;•&nbsp;<b>En quién clasifica y el marcador</b> (dieciseisavos, octavos…): es lo que eligen <b>la mayoría</b> de las IAs —2 de 3, o las 3— con el marcador más repetido.<br>&nbsp;&nbsp;•&nbsp;<b>En la probabilidad de campeón</b>: es el <b>promedio</b> de las probabilidades de las tres IAs para cada selección.<br>No es una cuarta IA ni una predicción propia: es <b>el punto de encuentro</b> de las tres.','The consensus <b>combines the three AIs (Claude, ChatGPT and Gemini) into one view</b>, so it does not depend on a single model. It is computed two ways, depending on the figure:<br>&nbsp;&nbsp;•&nbsp;<b>For who advances and the score</b> (Round of 32/16…): it is what <b>most</b> AIs pick —2 of 3, or all 3— with the most repeated scoreline.<br>&nbsp;&nbsp;•&nbsp;<b>For champion probability</b>: it is the <b>average</b> of the three AIs probabilities for each team.<br>It is not a fourth AI nor its own prediction: it is <b>where the three meet</b>.')}</p>
  </div>`;
}
// consolidado: las 3 IAs (pre-Mundial → actual) + consenso por promedio, ordenado por consenso actual
function titleConsolidated(){
  const E=DATA.title_evo&&DATA.title_evo.ais; if(!E) return '';
  const ais=['claude','chatgpt','gemini'];
  const consNow=t=>{const v=ais.map(a=>(E[a].now||{})[t]).filter(x=>x!=null); return v.length?v.reduce((s,x)=>s+x,0)/v.length:null;};
  const consPre=t=>{const v=ais.map(a=>(DATA[a].title||{})[t]).filter(x=>x!=null); return v.length?v.reduce((s,x)=>s+x,0)/v.length:0;};
  let teams={}; ais.forEach(a=>Object.keys(E[a].now||{}).forEach(t=>teams[t]=true));
  let rows=Object.keys(teams).map(t=>({t,cn:consNow(t),cp:consPre(t)})).filter(r=>r.cn!=null&&r.cn>=0.5).sort((a,b)=>b.cn-a.cn).slice(0,14);
  const cell=v=>v==null?'<td style="text-align:center;color:var(--muted)">—</td>':`<td style="text-align:center">${fmt(v)}</td>`;
  const body=rows.map(r=>{
    const d=r.cn-r.cp, up=d>0.3, dn=d<-0.3, col=up?'#16a34a':(dn?'#dc2626':'var(--muted)'), arr=up?'▲':(dn?'▼':'–');
    return `<tr style="border-bottom:1px solid var(--border)"><td style="text-align:left;font-weight:700;white-space:nowrap;padding:6px 4px">${tf(r.t)}</td>${cell(r.cp)}${cell((E.claude.now||{})[r.t])}${cell((E.chatgpt.now||{})[r.t])}${cell((E.gemini.now||{})[r.t])}<td style="text-align:center;font-weight:800;color:var(--purple)">${fmt(r.cn)}</td><td style="text-align:center;color:${col};font-weight:700;white-space:nowrap">${arr}${Math.abs(d).toFixed(1)}</td></tr>`;
  }).join('');
  return `<div class="section-title" style="margin-top:6px">🏆 ${tx('Probabilidad de campeón · consolidado de las 3 IAs','Champion probability · consolidated across the 3 AIs')}</div>
  <p class="note">${tx('Probabilidad <b>actual</b> de ser campeón (tras la fase de grupos, ya con el cuadro real) según cada IA, y el <b>consenso</b> = promedio de las tres. La columna <b>Pre</b> es la línea base pre-Mundial (promedio de las tres IAs antes del torneo) y <b>Δ</b> es el cambio del consenso frente a esa base. Ordenado por consenso actual.','<b>Current</b> champion probability (after the group stage, with the real bracket) per AI, and the <b>consensus</b> = average of the three. The <b>Pre</b> column is the pre-tournament baseline (average of the three AIs before the tournament) and <b>Δ</b> is the change of the consensus versus that baseline. Sorted by current consensus.')}</p>
  <div class="card" style="overflow-x:auto">
    <table style="width:100%;min-width:460px;border-collapse:collapse;font-size:12px">
      <thead><tr style="border-bottom:2px solid var(--border);font-size:11px;color:var(--muted)">
        <th style="text-align:left;padding:4px">${tx('Equipo','Team')}</th><th style="padding:4px">Pre</th>
        <th style="padding:4px;color:var(--c-claude)">Claude</th><th style="padding:4px;color:var(--c-chatgpt)">ChatGPT</th><th style="padding:4px;color:var(--c-gemini)">Gemini</th>
        <th style="padding:4px;color:var(--purple)">${tx('Consenso','Consensus')}</th><th style="padding:4px">Δ</th>
      </tr></thead><tbody>${body}</tbody>
    </table>
    <p style="font-size:11.5px;color:var(--muted);margin:10px 0 0;line-height:1.6">${tx('Las tres IAs y el ranking oficial FIFA coinciden en lo esencial: <b>Argentina es la favorita</b> tras ganar su grupo con autoridad — el consenso la sube de ~11 % a ~26 %. <b>España cae</b> del primer grupo de favoritas, y a nivel de consenso <b>Francia queda apenas por encima de España</b>, igual que el ranking FIFA (aunque Claude, por sí solo, todavía las invierte). Donde más difieren las IAs: Argentina (18.5–33.3 %), Francia (8.5–16.8 %) e Inglaterra (7.6–15.2 %), señal de que el favoritismo es claro pero su magnitud no.','The three AIs and the official FIFA ranking agree on the essentials: <b>Argentina is the favorite</b> after winning its group convincingly — the consensus lifts it from ~11% to ~26%. <b>Spain drops</b> out of the top favorites tier, and at the consensus level <b>France edges just above Spain</b>, like the FIFA ranking (though Claude alone still inverts them). Where the AIs differ most: Argentina (18.5-33.3%), France (8.5-16.8%) and England (7.6-15.2%), a sign that the favorite is clear but its magnitude is not.')}</p>
  </div>`;
}
// apertura/cierre del panel desplegable de metodología
function methOpen(){ return `<details style="margin:8px 0 16px;border:1px solid var(--border);border-radius:12px;background:var(--card);overflow:hidden"><summary style="cursor:pointer;padding:12px 16px;font-weight:700;color:var(--ink);font-size:13px;list-style:none">📐 ${tx('Metodología completa del modelo — algoritmo y backtesting','Full model methodology — algorithm and backtesting')} <span style="font-weight:400;color:var(--muted)">· ${tx('toca para desplegar','tap to expand')}</span></summary><div style="padding:0 16px 8px">`; }
function methClose(){ return `</div></details>`; }
function renderClaude(){
  const d=DATA.claude;
  const champTop=sortByTitle(d.title).slice(0,16).map(x=>x[0]);
  document.getElementById('claude').innerHTML = `${DATA.claude.j3_note?`<div class="card" style="border-left:4px solid var(--c-claude);margin-bottom:10px"><p style="margin:0;font-size:12.5px;line-height:1.5"><b style="color:var(--c-claude)">⟳ </b>${DATA.claude.j3_note}</p></div>`:''}
  ${koSection('pred','var(--c-claude)','Claude')}
  ${titleEvolutionAI('claude','var(--c-claude)','Claude')}
  ${methOpen()}
  <div class="insight"><p>${tx(`<b>Recalibración v7 (Fase 7), auditada con datos.</b> Probamos las transformaciones contra <b>192 partidos reales</b> de Mundiales pasados (2010–2022, validación fuera de muestra). El resultado fue revelador: el motor base <b>ya está bien calibrado</b> (RPS 0.2002, 17% mejor que el azar) y los ajustes por criterio <b>no se sostenían</b> —inflar el empate empeoraba el acierto (el modelo ya sobre-predice empates) y el encogimiento no mejoraba nada—. Así que los <b>retiramos</b>: las probabilidades que ves son las del motor validado, sin maquillaje. Lo que sí aporta valor y se conserva: la <b>bandera de incertidumbre</b> por partido y el <b>desglose de riesgos</b> por goleador. Todo se expresa como probabilidad, no como certeza.`,`<b>Recalibration v7 (Phase 7), data-audited.</b> We tested the transformations against <b>192 real matches</b> from past World Cups (2010–2022, out-of-sample). The result was telling: the base engine is <b>already well-calibrated</b> (RPS 0.2002, 17% better than chance) and the criterion-based tweaks <b>did not hold up</b> —inflating draws made accuracy worse (the model already over-predicts draws) and shrinking helped nothing—. So we <b>removed them</b>: the probabilities you see come straight from the validated engine, unembellished. What does add value and stays: the per-match <b>uncertainty flag</b> and the per-scorer <b>risk breakdown</b>. Everything is expressed as probability, not certainty.`)}</p></div>
  <div class="section-title">${tx('Metodología','Methodology')} · Claude <span style="color:var(--c-claude)">v7</span></div>
  <div class="card methclassic">
    <p>${tx(`Motor de <b>ensamble</b> que promedia un <b>Dixon-Coles data-driven</b> (ataque/defensa por equipo estimados de miles de partidos reales) con un <b>modelo de Machine Learning</b> (gradient boosting con pérdida de Poisson) que integra <b>Elo actual a junio-2026, forma reciente e histórico de Mundiales</b>. El ensamble es el que mejor valida.`,`An <b>ensemble</b> engine that averages a <b>data-driven Dixon-Coles</b> model (per-team attack/defense estimated from thousands of real matches) with a <b>Machine Learning model</b> (gradient boosting with Poisson loss) integrating <b>current Elo as of June 2026, recent form and World Cup history</b>. The ensemble validates best.`)}</p>
    <p>${tx(`Desempeño medido fuera de muestra con código sobre <b>4 Mundiales reales (2010–2022, 192 partidos)</b>: ensamble RPS 0.2002 vs 0.2413 (azar), <b>mejora del 17.0%</b> — supera al ML solo (0.2012) y al Dixon-Coles solo (0.2016). Detalle en el panel de backtesting.`,`Out-of-sample performance measured with code over <b>4 real World Cups (2010–2022, 192 matches)</b>: ensemble RPS 0.2002 vs 0.2413 (chance), a <b>17.0% improvement</b> — beating ML alone (0.2012) and Dixon-Coles alone (0.2016). Detail in the backtesting panel.`)}</p>
    <div style="margin-top:8px">
      <span class="badge">${tx('Ensamble Dixon-Coles + Machine Learning','Dixon-Coles + Machine Learning ensemble')}</span><span class="badge">${tx('Elo · forma · histórico Mundiales','Elo · form · World Cup history')}</span>
      <span class="badge">${tx('Validado OOS 2010–2022 (192 partidos)','Validated OOS 2010–2022 (192 matches)')}</span><span class="badge">${tx('Bracket R32 corregido (v5)','R32 bracket fixed (v5)')}</span><span class="badge">${tx('Distribución completa por partido','Full per-match distribution')}</span>
    </div>
  </div>
  <div class="insight"><p>${tx(`Honestidad metodológica: sobre 4 Mundiales reales, el ML solo y el estadístico quedan <b>parejos</b>, pero el ensamble de ambos <b>supera a los dos</b>; "deep learning" no es automáticamente mejor con datos escasos. El resultado: España (${fmt(d.title['España'])}) y un top plano con <b>Brasil (${fmt(d.title['Brasil'])}), Inglaterra (${fmt(d.title['Inglaterra'])}) y Colombia (${fmt(d.title['Colombia'])})</b> realzados por datos.`,`Methodological honesty: across 4 real World Cups, ML alone and the statistical model are <b>roughly tied</b>, but the ensemble of the two <b>beats both</b>; "deep learning" is not automatically better with scarce data. The result: Spain (${fmt(d.title['España'])}) and a flat top tier with <b>Brazil (${fmt(d.title['Brasil'])}), England (${fmt(d.title['Inglaterra'])}) and Colombia (${fmt(d.title['Colombia'])})</b> lifted by the data.`)}</p></div>

  ${methPanel("claude")}
  ${backtestPanel("claude")}
  ${methClose()}
  <div class="section-title">${tx('Camino al título · Claude · las 48 selecciones','Road to the title · Claude · all 48 teams')}</div>
  <div class="card">${reachTable(d.reach, all48(d.title))}</div>

  ${drawRateAnchor()}
  <div class="section-title">${tx('Los 72 partidos · Claude v7 (recalibrado, distribución por partido)','The 72 matches · Claude v7 (recalibrated, per-match distribution)')}</div>
  <p class="note">${tx('El marcador y las probabilidades V/E/D salen de la <b>distribución de Poisson completa</b> del modelo, y se muestra además el <b>xG (goles esperados)</b> de cada selección por partido.','The scoreline and W/D/L probabilities come from the model <b>full Poisson distribution</b>, and the <b>xG (expected goals)</b> of each team per match is also shown.')}</p>
  ${matchTableByAI(d.fixtures.map(f=>({a:f.a,b:f.b,pA:f.pA,pD:f.pD,pB:f.pB,score:f.score,j3:f.j3,xa:f.eg_a,xb:f.eg_b,md:f.md,date:f.date,grp:f.grp})), true)}

  <div class="section-title">🥇 ${tx('Bota de Oro · Top 10 goleadores — Claude v7','Golden Boot · Top 10 scorers — Claude v7')}</div>
  <p class="note">${tx('Modelo nuevo de jugador montado sobre el de selección. Los goles esperados de cada jugador parten de los <b>goles que su equipo proyecta marcar en el torneo</b> (partidos esperados según su avance × goles por partido del modelo) y se reparten por <b>cuota de rol y penales</b>, ajustados por <b>titularidad</b>, <b>disponibilidad física</b> y <b>forma</b>. La Bota de Oro se estima por simulación. Pasa el cursor sobre la ⓘ para ver el detalle de cada jugador.','New player-level model built on top of the team model. Each player expected goals start from the <b>goals their team is projected to score in the tournament</b> (expected matches from its run × goals per match) and are split by <b>role share and penalties</b>, adjusted for <b>starting probability</b>, <b>physical availability</b> and <b>form</b>. The Golden Boot is estimated by simulation. Hover the ⓘ for the detail of each player.')}</p>
  <div class="insight"><p>${tx(`Por qué <b>riesgo físico</b> y <b>forma</b> son factores <b>separados</b>: el ${term('riesgo físico','Lesiones recientes, carga y edad: afecta cuántos minutos juega y si lo reservan para fases finales.')} ajusta los <b>minutos</b> (cuánto juega), mientras que la ${term('forma','Racha goleadora y afinación: afecta su eficacia por minuto cuando sí está en cancha.')} ajusta la <b>tasa</b> de gol por minuto. Un jugador puede estar fino pero con riesgo de rotación, o sano pero frío; mezclarlos en una sola variable perdería esa diferencia.`,`Why <b>physical risk</b> and <b>form</b> are <b>separate</b> factors: ${term('physical risk','Recent injuries, load and age: it affects how many minutes he plays and whether he is rested for later rounds.')} adjusts the <b>minutes</b> (how much he plays), while ${term('form','Scoring streak and sharpness: it affects his efficiency per minute when he is on the pitch.')} adjusts the <b>scoring rate</b> per minute. A player can be sharp but at rotation risk, or fit but cold; merging them into one variable would lose that distinction.`)}</p></div>
  <div class="card scorers-track" data-scorers-src="claude">${scorersAI("claude")}</div>`;
}

function renderChatGPT(){
  const d=DATA.chatgpt;
  const champTop=sortByTitle(d.title).slice(0,16).map(x=>x[0]);
  document.getElementById('chatgpt').innerHTML = `${DATA.chatgpt.j3_note?`<div class="card" style="border-left:4px solid var(--c-chatgpt);margin-bottom:10px"><p style="margin:0;font-size:12.5px;line-height:1.5"><b style="color:var(--c-chatgpt)">⟳ </b>${DATA.chatgpt.j3_note}</p></div>`:''}
  ${koSection('cg','var(--c-chatgpt)','ChatGPT')}
  ${titleEvolutionAI('chatgpt','var(--c-chatgpt)','ChatGPT')}
  ${methOpen()}
  <div class="section-title">${tx('Metodología','Methodology')} · ChatGPT <span style="color:var(--c-chatgpt)">v8.5</span></div>
  <div class="card methclassic">
    <p>${tx(`Ensamble <b>calibrado histórico</b> con los ajustes del <b>Backtesting Nivel 2</b>: refuerza el núcleo <b>FIFA/Elo</b> (sube a 24%), reduce el clima a contextual (4%) y añade una <b>penalización de sesgo de mercado</b> para no sobrevalorar a las ligas europeas más líquidas. Plantilla, player-level, forma y experiencia entran como capas de ajuste, no como dominantes.`,`A <b>historically-calibrated</b> ensemble with the <b>Level 2 Backtesting</b> adjustments: it reinforces the <b>FIFA/Elo</b> core (up to 24%), reduces climate to contextual (4%) and adds a <b>market-bias penalty</b> so the most liquid European leagues are not overvalued. Squad, player-level, form and experience enter as adjustment layers, not as dominant ones.`)}</p>
    <div style="margin-top:8px"><span class="badge">${tx('Núcleo FIFA/Elo reforzado','Reinforced FIFA/Elo core')}</span><span class="badge">${tx('Anti-sesgo de mercado','Anti-market-bias')}</span><span class="badge">${tx('Calibración histórica','Historical calibration')}</span><span class="badge">${tx('Outsiders tácticos corregidos','Tactical outsiders corrected')}</span></div>
  </div>
  <div class="insight"><p>${tx(`Rasgo de la v6.2: la IA <b>más prudente y mejor calibrada</b>. Contiene a España (${fmt(d.title['España'])}) sin ventaja excesiva y forma un bloque de élite con Francia (${fmt(d.title['Francia'])}), Inglaterra (${fmt(d.title['Inglaterra'])}) y Argentina (${fmt(d.title['Argentina'])}). El Nivel 2 sube moderadamente a outsiders tácticos (Marruecos, Colombia, Senegal, Japón). El detalle está en el backtesting.`,`v6.2 trait: the <b>most prudent and best-calibrated</b> model. It caps Spain (${fmt(d.title['España'])}) without an excessive edge and forms an elite block with France (${fmt(d.title['Francia'])}), England (${fmt(d.title['Inglaterra'])}) and Argentina (${fmt(d.title['Argentina'])}). Level 2 moderately lifts tactical outsiders (Morocco, Colombia, Senegal, Japan). The detail is in the backtesting.`)}</p></div>

  ${methPanel("chatgpt")}
  ${backtestPanel("chatgpt")}
  ${methClose()}
  <div class="section-title">${tx('Camino al título · ChatGPT · las 48 selecciones','Road to the title · ChatGPT · all 48 teams')}</div>
  <div class="card">${reachTable(d.reach, all48(d.title))}</div>

  ${drawRateAnchor()}
  <div class="section-title">${tx('Los 72 partidos · ChatGPT v8.5 (8.4B-Consensus · Odds API + SofaScore)','The 72 matches · ChatGPT v8.5 (8.4B-Consensus · Odds API + SofaScore)')}</div>
  ${matchTableByAI(d.matches)}

  <div class="section-title">🥇 ${tx('Bota de Oro · Top 10 goleadores — ChatGPT','Golden Boot · Top 10 scorers — ChatGPT')}</div>
  <p class="note">${tx('Probabilidad de ganar la Bota de Oro por jugador, con sus goles esperados. Pasa el cursor sobre la ⓘ para ver la justificación de cada caso.','Probability of winning the Golden Boot per player, with expected goals. Hover the ⓘ for the rationale of each pick.')}</p>
  <div class="card scorers-track" data-scorers-src="chatgpt">${scorersAI("chatgpt")}</div>`;
}

function renderGemini(){
  const d=DATA.gemini;
  const champTop=sortByTitle(d.title).slice(0,16).map(x=>x[0]);
  document.getElementById('gemini').innerHTML = `${DATA.gemini.j3_note?`<div class="card" style="border-left:4px solid var(--c-gemini);margin-bottom:10px"><p style="margin:0;font-size:12.5px;line-height:1.5"><b style="color:var(--c-gemini)">⟳ </b>${DATA.gemini.j3_note}</p></div>`:''}
  ${koSection('gm','var(--c-gemini)','Gemini')}
  ${titleEvolutionAI('gemini','var(--c-gemini)','Gemini')}
  ${methOpen()}
  <div class="section-title">${tx('Metodología','Methodology')} · Gemini <span style="color:var(--c-gemini)">v10</span></div>
  <div class="card methclassic">
    <p>${tx(`Ensamble físico-estadístico que <b>abandona la "memoria histórica de los escudos"</b> del v6. Mide la resiliencia por la <b>carga de estrés cognitivo actual</b> de las plantillas (minutos de eliminación directa en Champions/Libertadores = <b>Redes de Presión Local</b>), aplica un <b>Factor de Decaimiento</b> al campeón defensor y reconfigura el <b>Aura de Localía</b> de forma asimétrica, sobre el motor bio-termodinámico UTCI.`,`A physics-statistical ensemble that <b>abandons the v6 "crest historical memory"</b>. It measures resilience via each squad's <b>current cognitive stress load</b> (knockout minutes in the Champions League/Libertadores = <b>Local Pressure Networks</b>), applies a <b>Champion Decay Factor</b> to the defending champion and reshapes the <b>Home Aura</b> asymmetrically, on top of the UTCI bio-thermodynamic engine.`)}</p>
    <div style="margin-top:8px"><span class="badge">${tx('Redes de Presión Local','Local Pressure Networks')}</span><span class="badge">${tx('Decaimiento del campeón (−8%)','Champion decay (−8%)')}</span><span class="badge">${tx('Aura de localía asimétrica','Asymmetric home aura')}</span><span class="badge">${tx('Motor bio-termodinámico UTCI','UTCI bio-thermodynamic engine')}</span></div>
  </div>
  <div class="insight"><p>${tx(`Giro del v7: <b>castiga el dogma histórico</b>. <b>Francia toma el nº 1</b> (${fmt(d.title['Francia'])}) por el volumen de minutos de élite de su plantilla; <b>Argentina cae al 3º</b> (${fmt(d.title['Argentina'])}) por el decaimiento del campeón; y <b>Brasil baja</b> (${fmt(d.title['Brasil'])}) al neutralizar su "gravedad de escudo". España se sostiene 2ª (${fmt(d.title['España'])}). El detalle empírico está en el backtesting.`,`v7 shift: it <b>punishes historical dogma</b>. <b>France takes #1</b> (${fmt(d.title['Francia'])}) on its squad's elite-minutes volume; <b>Argentina drops to 3rd</b> (${fmt(d.title['Argentina'])}) from champion decay; and <b>Brazil falls</b> (${fmt(d.title['Brasil'])}) as its "crest gravity" is neutralized. Spain holds 2nd (${fmt(d.title['España'])}). The empirical detail is in the backtesting.`)}</p></div>

  ${methPanel("gemini")}
  ${backtestPanel("gemini")}
  ${methClose()}
  <div class="section-title">${tx('Camino al título · Gemini · las 48 selecciones','Road to the title · Gemini · all 48 teams')}</div>
  <div class="card">${reachTable(d.reach, all48(d.title))}</div>

  ${drawRateAnchor()}
  <div class="section-title">${tx('Los 72 partidos · Gemini v10 (Fase 10, ancla 21.88%)','The 72 matches · Gemini v10 (Phase 10, 21.88% anchor)')}</div>
  ${matchTableByAI(d.matches)}

  <div class="section-title">🥇 ${tx('Bota de Oro · Top 10 goleadores — Gemini','Golden Boot · Top 10 scorers — Gemini')}</div>
  <p class="note">${tx('Probabilidad de Bota de Oro con ajuste por estado de forma y riesgo de titularidad. Pasa el cursor sobre la ⓘ para ver el análisis de cada jugador.','Golden Boot probability adjusted for form and starting-role risk. Hover the ⓘ for the analysis of each player.')}</p>
  <div class="card scorers-track" data-scorers-src="gemini">${scorersAI("gemini")}</div>`;
}

/* ============ PRECISIÓN: predicción vs resultado real ============ */
let REAL_RESULTS = null;   // se carga desde results.json
let KO_RESULTS = null;     // se carga en vivo desde ko_results.json (resultados de eliminatorias)
const ACC_MODELS = [
  {key:'consenso', name:'Consenso', color:'var(--c-cons)',    get:()=>DATA.consensus.matches},
  {key:'claude',   name:'Claude',   color:'var(--c-claude)',  get:()=>DATA.claude.fixtures},
  {key:'chatgpt',  name:'ChatGPT',  color:'var(--c-chatgpt)', get:()=>DATA.chatgpt.matches},
  {key:'gemini',   name:'Gemini',   color:'var(--c-gemini)',  get:()=>DATA.gemini.matches},
];
function _ocFromScore(x,y){ return x>y?'A':(x<y?'B':'D'); }
function _rps(pA,pD,pB,oc){
  const p=[pA/100,pD/100,pB/100], o=[oc==='A'?1:0, oc==='D'?1:0, oc==='B'?1:0];
  let c=0,cp=0,co=0; for(let k=0;k<3;k++){cp+=p[k];co+=o[k];c+=(cp-co)*(cp-co);} return 0.5*c;
}
// predicción de un modelo para el par (a,b), reorientada para que A=a, B=b
function _predFor(getArr,a,b){
  const m=getArr().find(x=>(x.a===a&&x.b===b)||(x.a===b&&x.b===a)); if(!m)return null;
  if(m.a===a) return {score:m.score,pA:m.pA,pD:m.pD,pB:m.pB};
  const pr=(m.score||'').split('-'); return {score:(pr[1]||'?')+'-'+(pr[0]||'?'),pA:m.pB,pD:m.pD,pB:m.pA};
}
function _evalPred(pred, ga, gb){
  if(!pred) return null;
  const pr=pred.score.split('-'), px=parseInt(pr[0],10), py=parseInt(pr[1],10);
  const realOC=_ocFromScore(ga,gb), predOC=isNaN(px)?null:_ocFromScore(px,py);
  const exact = !isNaN(px)&&px===ga&&py===gb;
  const outHit = predOC===realOC;
  return {score:pred.score, exact, outHit, pts: exact?3:(outHit?1:0),
          rps:_rps(pred.pA,pred.pD,pred.pB,realOC), cls: exact?'exact':(outHit?'out':'miss')};
}
function computeAccuracy(){
  const played=(REAL_RESULTS||[]).filter(r=>r.ga!=null&&r.gb!=null);
  const agg={}; ACC_MODELS.forEach(m=>agg[m.key]={n:0,exact:0,out:0,pts:0,rps:0});
  const rows=[];
  played.forEach(r=>{
    const cells={};
    ACC_MODELS.forEach(m=>{
      const ev=_evalPred(_predFor(m.get,r.a,r.b), r.ga, r.gb);
      cells[m.key]=ev;
      if(ev){const A=agg[m.key]; A.n++; A.exact+=ev.exact?1:0; A.out+=ev.outHit?1:0; A.pts+=ev.pts; A.rps+=ev.rps;}
    });
    rows.push({r,cells});
  });
  return {played, agg, rows, total:(REAL_RESULTS||[]).length};
}
// posiciones de grupo: orden ORIGINAL predicho (group_proj) vs orden real final (DATA.real_standings)
// 3 pts por clasificado (1º/2º) en posición exacta, 1 pt por no-clasificado (3º/4º) en posición exacta
function computeStandings(){
  const RS=DATA.real_standings||{}, W=[3,3,1,1];
  const agg={}; ACC_MODELS.forEach(m=>agg[m.key]={pts:0,pos:0,win:0,qual:0,groups:0});
  Object.keys(RS).forEach(g=>{
    const real=RS[g], gpg=DATA.group_proj[g]; if(!real||!gpg) return;
    ACC_MODELS.forEach(m=>{
      const proj=gpg[m.name]; if(!proj) return;
      const pred=proj.map(x=>x[0]), A=agg[m.key]; A.groups++;
      for(let i=0;i<4;i++){ if(pred[i]===real[i]){A.pts+=W[i]; A.pos++; if(i===0)A.win++;} }
      if(pred[0]===real[0]&&pred[1]===real[1]) A.qual++;
    });
  });
  return agg;
}
// === ELIMINATORIAS: clasificado (3) + marcador 90' exacto (2) / resultado (1) — máx 5/llave ===
const KO_FIELD={consenso:'cons',claude:'pred',chatgpt:'cg',gemini:'gm'};
function computeKO(){
  const KR=DATA.ko_real||[], RES=((typeof KO_RESULTS!=='undefined'&&KO_RESULTS!=null)?KO_RESULTS:(DATA.ko_results||[]));
  const real={}; RES.forEach(r=>{ if(r&&r.code&&r.ga!=null&&r.gb!=null) real[r.code]=r; });
  const agg={}; ACC_MODELS.forEach(m=>agg[m.key]={pts:0,qual:0,exact:0,res:0,n:0});
  const rows=[];
  KR.forEach(s=>{
    const r=real[s.code]; if(!r) return;
    const realSc=r.ga+'-'+r.gb, realSign=Math.sign(r.ga-r.gb), rw=r.winner;
    const row={code:s.code,ph:s.phase||'R32',a:s.a,b:s.b,real:realSc,rw,via:r.via||null,xsc:r.xsc||null,fecha:r.fecha||'',venue:r.venue||''};
    ACC_MODELS.forEach(m=>{
      const p=s[KO_FIELD[m.key]]; if(!p){row[m.key]=null;return;}
      const A=agg[m.key]; A.n++;
      let qp=0,sp=0;
      if(p.winner===rw){qp=3;A.qual++;}
      const pr=(p.sc90||'').split('-'), pa=parseInt(pr[0],10), pb=parseInt(pr[1],10);
      if(p.sc90===realSc){sp=2;A.exact++;}
      else if(!isNaN(pa)&&Math.sign(pa-pb)===realSign){sp=1;A.res++;}
      A.pts+=qp+sp;
      row[m.key]={sc:p.sc90,w:p.winner,qp,sp,tot:qp+sp};
    });
    rows.push(row);
  });
  return {agg,rows,played:Object.keys(real).length,total:KR.length};
}
function koScoreHTML(){
  const {agg,rows,played,total}=computeKO();
  const head=`<div class="acc-hero ko-live" style="margin-top:0"><span class="phase-tag live">⚡ ${tx('Fase actual','Live round')}</span><h2>🥊 ${tx('Eliminatorias · predicción vs realidad','Knockouts · prediction vs reality')}</h2>
    <p>${tx('Dieciseisavos en adelante. Cada IA suma por <b>acertar el clasificado</b> (3 pts) y por el <b>marcador a 90′</b>: exacto (2 pts) o solo el resultado —gana/empata/pierde— aunque falle el marcador (1 pt). Máximo 5 pts por llave.','From the Round of 32 onward. Each AI scores for <b>the correct qualifier</b> (3 pts) and the <b>90-minute score</b>: exact (2 pts) or just the outcome (1 pt). Max 5 pts per tie.')}</p></div>`;
  if(played===0){
    return head+`<div class="acc-empty"><div class="big">⚽</div>${tx('Aún no se juegan los dieciseisavos. Este tablero se activa solo con el primer resultado oficial, comparando las predicciones ya congeladas de las cuatro contendientes (las 3 IAs y el consenso).','The Round of 32 has not started. This board activates with the first official result, comparing the already-frozen predictions of the four contenders (the 3 AIs and the consensus).')}</div>`;
  }
  const medals=['🥇','🥈','🥉',''];
  const board=ACC_MODELS.map(m=>({...m,...agg[m.key]})).filter(x=>x.n>0).sort((a,b)=>b.pts-a.pts||b.qual-a.qual||b.exact-a.exact);
  const cards=board.map((x,i)=>`<div class="lb-card ${i===0?'lead':''}"><div class="rank">${medals[i]||''}</div><div class="who"><span class="dotc" style="background:${x.color}"></span>${x.name}</div><div class="pts">${x.pts}<small> ${tx('pts','pts')}</small></div><div class="mini"><span><b>${x.qual}/${x.n}</b>${tx('clasificados','qualifiers')}</span><span><b>${x.exact}</b>${tx('exactos','exact')}</span></div></div>`).join('');
  const cell=(r,k,label)=>{const c=r[k];if(!c)return `<div class="pred"><span class="plabel">${label}</span>—</div>`;
    const ic=c.qp===3?(c.sp===2?'★':(c.sp===1?'✓':'◓')):(c.sp>=1?'◐':'✗');
    const cls=c.tot>=4?'exact':(c.tot>=1?'out':'miss');
    return `<div class="pred ${cls}"><span class="plabel">${label}</span>${c.sc} ${ic}</div>`;};
  const koHead=`<div class="h2h-table-head" style="font-size:11px;color:var(--muted);margin-top:6px;margin-bottom:8px;padding:0 12px;font-weight:600;">
      <div>${tx('Fecha · Sede','Date · Venue')}</div><div>${tx('Partidos','Matches')}</div><div>${tx('Real','Result')}</div>
      <div class="preds-head"><div style="color:${COL.Claude}">Claude</div><div style="color:${COL.ChatGPT}">ChatGPT</div><div style="color:${COL.Gemini}">Gemini</div><div style="color:${COL.Consenso}">Consenso</div></div>
    </div>`;
  const PHN={'R32':[ 'Dieciseisavos','Round of 32'],'R16':['Octavos','Round of 16'],'QF':['Cuartos','Quarterfinals'],'SF':['Semifinales','Semifinals'],'F':['Final','Final']};
  const RANK={'F':5,'SF':4,'QF':3,'R16':2,'R32':1};
  const mkRow=r=>{const ven=r.venue?`<div class="venue">📍 ${r.venue}</div>`:'';
    return `<div class="h2h-row-compact played">
      <div class="date">${r.fecha||''}${ven}</div>
      <div class="teams"><b>${tf(r.a)}</b> vs <b>${tf(r.b)}</b></div>
      <div class="score">${r.real}${r.via?`<div style="font-size:9.5px;color:var(--muted);font-weight:600">${r.via==='pen'?tx('pen','pk'):tx('pró','aet')} ${r.xsc||''}</div>`:''}</div>
      <div class="preds">${cell(r,'claude','Claude')}${cell(r,'chatgpt','ChatGPT')}${cell(r,'gemini','Gemini')}${cell(r,'consenso','Consenso')}</div>
    </div>`;};
  const sepOf=ph=>{const nm=PHN[ph]?PHN[ph][LANG==='en'?1:0]:ph;return `<div style="font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--purple);padding:10px 12px 4px">${nm}</div>`;};
  // rondas superiores arriba (más avanzada primero); dieciseisavos comprimidos como referencia
  const hi=rows.filter(r=>r.ph!=='R32').sort((a,b)=>(RANK[b.ph]||0)-(RANK[a.ph]||0)||(+a.code.slice(1))-(+b.code.slice(1)));
  const lo=rows.filter(r=>r.ph==='R32');
  let _ph=null, hiRows='';
  hi.forEach(r=>{if(r.ph!==_ph){_ph=r.ph;hiRows+=sepOf(r.ph);}hiRows+=mkRow(r);});
  const loPts=ACC_MODELS.map(m=>{let p=0;lo.forEach(r=>{const c=r[m.key];if(c)p+=c.tot;});return `${m.name} ${p}`;}).join(' · ');
  const loRows=lo.map(mkRow).join('');
  const loBlock=lo.length?`<details class="phase-closed-d" style="margin-top:12px"><summary style="cursor:pointer;font-weight:800;font-size:12.5px">📁 ${tx('Dieciseisavos de final · fase cerrada','Round of 32 · closed phase')} (${lo.length}/16) — ${tx('puntos de la ronda','round points')}: ${loPts}</summary><div class="h2h-table" style="margin-top:8px">${loRows}</div></details>`:'';
  return head+`<div class="acc-progress"><div class="track"><div class="fill" style="width:${Math.round(100*played/total)}%"></div></div><div class="lbl">${played}/${total} ${tx('llaves jugadas','ties played')}</div></div>
    <div class="lb-grid">${cards}</div>
    <div class="acc-legend"><span>★ <b style="color:#1a9e5c">${tx('clasificado + marcador exacto','qualifier + exact')}</b> (5)</span><span>✓ <b style="color:#1a9e5c">${tx('clasificado + resultado','qualifier + outcome')}</b> (4)</span><span>◓ <b style="color:#b58900">${tx('solo clasificado','qualifier only')}</b> (3)</span><span>◐ <b style="color:#b58900">${tx('solo marcador','score only')}</b></span><span>✗ <b style="color:#c0392b">${tx('fallo','miss')}</b></span></div>
    ${koHead}<div class="h2h-table">${hiRows}</div>${loBlock}`;
}
function renderAccuracy(){
  const host=document.getElementById('precision'); if(!host) return;
  if(REAL_RESULTS===null){ host.innerHTML=`<div class="acc-empty"><div class="big">⏳</div>${tx('Cargando resultados oficiales…','Loading official results…')}</div>`; return; }
  const {played,agg,rows,total}=computeAccuracy();
  if(played.length===0){
    host.innerHTML=`<div class="acc-hero"><h2>🏆 ${tx('Mundial de las IAs · predicción vs realidad','AI World Cup · prediction vs reality')}</h2>
      <p>${tx('Aquí se comparará cada pronóstico con el resultado oficial de la FIFA a medida que terminen los partidos.','Each forecast will be compared against the official FIFA result as matches finish.')}</p></div>
      <div class="acc-empty"><div class="big">⚽</div>${tx('Aún no hay partidos jugados. Esta sección se actualiza sola cuando se publican los resultados oficiales.','No matches played yet. This section updates itself once official results are published.')}</div>`;
    return;
  }
  // leaderboard ordenado por puntos, desempate por RPS
  const board=ACC_MODELS.map(m=>{const A=agg[m.key];return{...m,...A,
      accPct:A.n?100*A.out/A.n:0, exPct:A.n?100*A.exact/A.n:0, avgRps:A.n?A.rps/A.n:0};})
    .filter(x=>x.n>0).sort((a,b)=> b.pts-a.pts || a.avgRps-b.avgRps);
  const medals=['🥇','🥈','🥉',''];
  const cards=board.map((x,i)=>`<div class="lb-card ${i===0?'lead':''}">
      <div class="rank">${medals[i]||''}</div>
      <div class="who"><span class="dotc" style="background:${x.color}"></span>${x.name}</div>
      <div class="pts">${x.pts}<small> ${tx('pts','pts')}</small></div>
      <div class="mini">
        <span><b>${x.accPct.toFixed(0)}%</b>${tx('resultado','outcome')}</span>
        <span><b>${x.exPct.toFixed(0)}%</b>${tx('marcador','exact')}</span>
        <span><b>${x.avgRps.toFixed(3)}</b>RPS</span>
      </div></div>`).join('');
  const pctPlayed=100*played.length/Math.max(total,1);
  // tabla compacta — solo partidos finalizados, con semáforo por IA
  const cellFor=(cells,key,label)=>{ const ev=cells[key]; if(!ev) return `<div class="pred"><span class="plabel">${label}</span>—</div>`;
    const ico=ev.exact?'✓':(ev.outHit?'◐':'✗');
    return `<div class="pred ${ev.cls}"><span class="plabel">${label}</span>${ev.score} ${ico}</div>`; };
  let tableRows='';
  // orden inverso por hora real: el más reciente en cerrarse arriba; la inauguración (México vs Sudáfrica) al final
  const ordered=[...rows].sort((x,y)=>{
    const kx=x.r.kickoff||x.r.iso||'', ky=y.r.kickoff||y.r.iso||'';
    return kx<ky?-1:(kx>ky?1:0);
  }).reverse();
  ordered.forEach(({r,cells})=>{
    const ven = r.venue ? `<div class="venue">📍 ${r.venue}</div>` : '';
    tableRows+=`<div class="h2h-row-compact played">
      <div class="date">${r.fecha||''}${ven}</div>
      <div class="teams"><b>${tf(r.a)}</b> vs <b>${tf(r.b)}</b></div>
      <div class="score">${r.ga}-${r.gb}</div>
      <div class="preds">${cellFor(cells,'claude','Claude')}${cellFor(cells,'chatgpt','ChatGPT')}${cellFor(cells,'gemini','Gemini')}${cellFor(cells,'consenso','Consenso')}</div>
    </div>`;
  });
  const matchHtml = `
    <div class="h2h-table-head" style="font-size:11px;color:var(--muted);margin-top:6px;margin-bottom:8px;padding:0 12px;font-weight:600;">
      <div>${tx('Fecha · Sede','Date · Venue')}</div><div>${tx('Partidos','Matches')}</div><div>${tx('Real','Result')}</div>
      <div class="preds-head"><div style="color:${COL.Claude}">Claude</div><div style="color:${COL.ChatGPT}">ChatGPT</div><div style="color:${COL.Gemini}">Gemini</div><div style="color:${COL.Consenso}">Consenso</div></div>
    </div>
    <div class="h2h-table">${tableRows}</div>`;
  // === paneles nuevos: posiciones de grupo + ranking consolidado ===
  const sAgg=computeStandings();
  const nClosed=Object.keys(DATA.real_standings||{}).filter(g=>DATA.group_proj[g]).length;
  let standingsBlock='', combinedBlock='';
  if(nClosed>0){
    const sBoard=ACC_MODELS.map(m=>({...m,...sAgg[m.key]})).sort((a,b)=>b.pts-a.pts||b.win-a.win);
    const sCards=sBoard.map((x,i)=>`<div class="lb-card ${i===0?'lead':''}"><div class="rank">${medals[i]||''}</div><div class="who"><span class="dotc" style="background:${x.color}"></span>${x.name}</div><div class="pts">${x.pts}<small> ${tx('pts','pts')}</small></div><div class="mini"><span><b>${x.win}/${x.groups}</b>${tx('1ºs de grupo','group winners')}</span><span><b>${x.pos}/${x.groups*4}</b>${tx('posiciones','positions')}</span></div></div>`).join('');
    standingsBlock=`<div class="acc-hero" style="margin-top:18px"><h2>📊 ${tx('Aciertos de posiciones de grupo','Group standings accuracy')}</h2><p>${tx('El orden 1º-2º-3º-4º que cada IA pronosticó <b>originalmente</b> se compara con la tabla final real: 3 pts por cada clasificado (1º/2º) en posición exacta y 1 pt por cada no-clasificado. <b>'+nClosed+' grupos cerrados.</b>','The order each AI predicted <b>originally</b> is compared with the real final table: 3 pts per qualifier (1st/2nd) in exact position, 1 pt per non-qualifier. <b>'+nClosed+' groups closed.</b>')}</p></div><div class="lb-grid">${sCards}</div>`;
    const cBoard=ACC_MODELS.map(m=>({...m,mpts:agg[m.key].pts,spts:sAgg[m.key].pts,tot:agg[m.key].pts+sAgg[m.key].pts})).sort((a,b)=>b.tot-a.tot);
    const cCards=cBoard.map((x,i)=>`<div class="lb-card ${i===0?'lead':''}"><div class="rank">${medals[i]||''}</div><div class="who"><span class="dotc" style="background:${x.color}"></span>${x.name}</div><div class="pts">${x.tot}<small> ${tx('pts','pts')}</small></div><div class="mini"><span><b>${x.mpts}</b>${tx('partidos','matches')}</span><span><b>${x.spts}</b>${tx('posiciones','positions')}</span></div></div>`).join('');
    combinedBlock=`<div class="acc-hero" style="margin-top:18px"><h2>🏆 ${tx('Ranking consolidado · gran total','Combined ranking · grand total')}</h2><p>${tx('Suma de los puntos por <b>acertar partidos</b> más los puntos por <b>predecir las posiciones de grupo</b>.','Sum of <b>match accuracy</b> points plus <b>group standings</b> points.')}</p></div><div class="lb-grid">${cCards}</div>`;
  }
  host.innerHTML=`
    <div class="acc-hero">
      <h2>🏆 ${tx('Mundial de las IAs · predicción vs realidad','AI World Cup · prediction vs reality')}</h2>
      <p>${tx('Cada modelo y el consenso se comparan con el resultado oficial de la FIFA. Se premia tanto acertar el <b>marcador exacto</b> (3 pts) como acertar solo el <b>resultado</b> —ganar, empatar o perder— aunque falle el marcador (1 pt).','Each model and the consensus are compared against the official FIFA result. Points reward both the <b>exact score</b> (3 pts) and getting just the <b>outcome</b> —win, draw or loss— even if the score is wrong (1 pt).')}</p>
    </div>
    ${koScoreHTML()}
    <div class="phase-sep"><span class="phase-tag closed">📋 ${tx('Fase de grupos · cerrada','Group stage · closed')}</span></div>
    <div class="acc-hero" style="padding:15px 20px;background:linear-gradient(135deg,#5b4a9e,#2a2350)">
      <p style="margin:0">${tx('Resultados finales de la fase de grupos: qué tan bien cada IA anticipó los <b>marcadores</b> y las <b>posiciones</b> de los 72 partidos ya cerrados.','Final group-stage results: how well each AI anticipated the <b>scores</b> and <b>standings</b> across the 72 closed matches.')}</p>
      <div class="acc-progress"><div class="track"><div class="fill" style="width:${pctPlayed}%"></div></div>
        <div class="lbl">${played.length} / ${total} ${tx('partidos de grupos jugados','group matches played')}</div></div>
    </div>
    <div class="lb-grid">${cards}</div>
    <div class="acc-legend">
      <span>✓ <b style="color:#1a9e5c">${tx('marcador exacto','exact score')}</b> (3 pts)</span>
      <span>◐ <b style="color:#b58900">${tx('resultado acertado','outcome correct')}</b> (1 pt)</span>
      <span>✗ <b style="color:#c0392b">${tx('fallo','miss')}</b> (0)</span>
      <span>RPS = ${tx('error probabilístico (menor es mejor)','probabilistic error (lower is better)')}</span>
    </div>
    ${standingsBlock}${combinedBlock}
    <details class="phase-closed-d"><summary>📅 ${tx('Ver los 72 partidos de la fase de grupos','View all 72 group-stage matches')} · ${played.length}/${total}</summary>${matchHtml}</details>`;
}
const RESULTS_FALLBACK = __RESULTS_FALLBACK__;
function _normResults(j){ return Array.isArray(j) ? j : (j && j.results ? j.results : []); }
function loadResults(){
  const fj=fetch('./results.json?ts='+Date.now()).then(r=>r.ok?r.json():Promise.reject()).catch(()=>RESULTS_FALLBACK);
  const fk=fetch('./ko_results.json?ts='+Date.now()).then(r=>r.ok?r.json():Promise.reject()).catch(()=>null);
  Promise.all([fj,fk]).then(([j,k])=>{
    REAL_RESULTS=_normResults(j);
    if(Array.isArray(k)) KO_RESULTS=k;            // resultados de eliminatorias en vivo (sin regenerar el sitio)
    renderAccuracy(); renderBracket(); if(_h2hAuto) h2hRenderTable();
  });
}


/* ============ ANALÍTICA (GA4) ============ */
function gaEvent(name, params){ try{ if(typeof gtag==='function') gtag('event', name, params||{}); }catch(e){} }
const AI_LABELS={consenso:'Consenso',claude:'Claude',chatgpt:'ChatGPT',gemini:'Gemini',precision:'Mundial de las IAs'};
function trackTab(tabId){
  gaEvent('select_tab', {
    ai_tab: tabId,                                                   // consenso|claude|chatgpt|gemini
    ai_name: AI_LABELS[tabId]||tabId,
    tab_type: tabId==='precision' ? 'results' : (tabId==='consenso' ? 'consensus' : 'individual_model')
  });
}
/* goleadores: dispara una vez por fuente y sesión cuando el panel se ve */
const _scorersSeen={};
let _scorersObs=null;
function setupScorersTracking(){
  if(!('IntersectionObserver' in window)) return;
  if(!_scorersObs){
    _scorersObs=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          const src=en.target.getAttribute('data-scorers-src')||'desconocido';
          if(!_scorersSeen[src]){ _scorersSeen[src]=true;
            gaEvent('view_scorers', {scorers_source:src, ai_name:AI_LABELS[src]||src}); }
          _scorersObs.unobserve(en.target);
        }
      });
    }, {threshold:0.35});
  }
  document.querySelectorAll('.scorers-track').forEach(function(el){
    if(!el._obs){ el._obs=true; _scorersObs.observe(el); }
  });
}

/* ============ BRACKET · Camino a la final ============ */
const BK_MODELS=['Consenso','Claude','ChatGPT','Gemini'];
const BK_COL={Consenso:'var(--c-cons)',Claude:'var(--c-claude)',ChatGPT:'var(--c-chatgpt)',Gemini:'var(--c-gemini)'};
const BK_THIRD_SLOTS={M74:'ABCDF',M77:'CDFGH',M79:'CEFHI',M80:'EHIJK',M81:'BEFIJ',M82:'AEHIJ',M85:'EFGIJ',M87:'DEIJL'};
const BK_R32=[['M74','1E','3'],['M77','1I','3'],['M73','2A','2B'],['M75','1F','2C'],
  ['M83','2K','2L'],['M84','1H','2J'],['M81','1D','3'],['M82','1G','3'],
  ['M76','1C','2F'],['M78','2E','2I'],['M79','1A','3'],['M80','1L','3'],
  ['M86','1J','2H'],['M88','2D','2G'],['M85','1B','3'],['M87','1K','3']];
const BK_NEXT=[['M89','M74','M77'],['M90','M73','M75'],['M93','M83','M84'],['M94','M81','M82'],
  ['M91','M76','M78'],['M92','M79','M80'],['M95','M86','M88'],['M96','M85','M87'],
  ['M97','M89','M90'],['M98','M93','M94'],['M99','M91','M92'],['M100','M95','M96'],
  ['M101','M97','M98'],['M102','M99','M100'],['M104','M101','M102']];
const BK_R32C=BK_R32.map(x=>x[0]);
const BK_LAYOUT={
  left:[['R32',['M74','M77','M73','M75','M83','M84','M81','M82']],['8vos',['M89','M90','M93','M94']],['4tos',['M97','M98']],['SF',['M101']]],
  right:[['R32',['M76','M78','M79','M80','M86','M88','M85','M87']],['8vos',['M91','M92','M95','M96']],['4tos',['M99','M100']],['SF',['M102']]]};
const BK_RNAME={'R32':['Ronda de 32','Round of 32'],'8vos':['Octavos','Round of 16'],'4tos':['Cuartos','Quarterfinals'],'SF':['Semifinal','Semifinal']};
let BK_CUR='Consenso';
let BK_METRIC='elo';
function bkStrong(metric){
  if(metric==='fifa') return (a,b)=>((FIFA[a]||999)<=(FIFA[b]||999)?a:b); // menor rango FIFA = más fuerte
  return (a,b)=>((ELO[a]||1500)>=(ELO[b]||1500)?a:b);                     // mayor Elo = más fuerte
}

function bkThirdMatch(qual){
  const slots=Object.keys(BK_THIRD_SLOTS), q=new Set(qual);
  function solve(i,used,assign){
    if(i===slots.length) return Object.assign({},assign);
    const s=slots[i];
    const elig=[...BK_THIRD_SLOTS[s]].filter(g=>q.has(g)&&!used.has(g)).sort();
    for(const g of elig){ assign[s]=g; used.add(g);
      const r=solve(i+1,used,assign); if(r) return r; used.delete(g); delete assign[s]; }
    return null;
  }
  return solve(0,new Set(),{})||{};
}
function bkR32RealHTML(){
  const KR=(DATA.ko_real||[]).filter(s=>(s.phase||'R32')==='R32'); if(!KR.length) return '';
  const lab=s=>s==='3'?tx('3.º (mejor tercero)','3rd (best third)'):(s[0]+'.º '+s[1]);
  const tbd=`<span style="color:var(--muted);font-style:italic">${tx('Por definir','TBD')}</span>`;
  const base='background:var(--card);border:1px solid var(--border);border-radius:12px;padding:10px 12px;';
  const card=s=>{
    if(s.status==='confirmed'){
      const ps=[['Claude','var(--c-claude)',s.pred],['ChatGPT','var(--c-chatgpt)',s.cg],['Gemini','var(--c-gemini)',s.gm]].filter(x=>x[2]);
      const ex=q=>(q&&(q.et==='Sí'||q.et==='Yes')?' '+tx('+pró','+ET'):'')+(q&&(q.pens==='Sí'||q.pens==='Yes')?' '+tx('+pen','+pk'):'');
      const lines=ps.map(([lbl,col,q])=>`<div style="font-size:12px;margin-top:2px"><span style="color:${col};font-weight:800">${lbl}</span> ${q.sc90} → <b>${tf(q.winner)}</b> <span style="color:var(--muted)">${q.conf}%${ex(q)}</span></div>`).join('');
      const cnt={}; ps.forEach(x=>cnt[x[2].winner]=(cnt[x[2].winner]||0)+1);
      const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0], unan=top[1]===ps.length;
      const badge=`<span style="font-size:10px;font-weight:700;color:${unan?'#1a9e5c':'#b58900'}">${unan?'✓ '+tx('los 3 coinciden','all 3 agree'):top[1]+'-'+(ps.length-top[1])+' '+tf(top[0])}</span>`;
      const cc=s.cons;
      const consLine=cc?`<div style="font-size:12px;margin-top:5px;padding-top:5px;border-top:1px dashed var(--border)"><span style="color:var(--purple);font-weight:800">${tx('Consenso','Consensus')}</span> ${cc.sc90} → <b>${tf(cc.winner)}</b> <span style="color:var(--muted)">${cc.conf}%${ex(cc)}</span></div>`:'';
      return `<div style="${base}border-left:4px solid var(--purple)">
        <div style="font-size:11px;color:var(--purple);font-weight:800;margin-bottom:4px;display:flex;justify-content:space-between;gap:6px">${s.code} · ${tx('CONFIRMADO','CONFIRMED')} ${badge}</div>
        <div style="font-weight:700;margin-bottom:2px"><b>${tf(s.a)}</b> <span style="color:var(--muted);font-weight:400">vs</span> <b>${tf(s.b)}</b></div>
        ${lines}${consLine}</div>`;
    }
    const side=(t,sl)=>(t?`<b>${tf(t)}</b>`:tbd)+` <span style="font-size:11px;color:var(--muted)">(${lab(sl)})</span>`;
    return `<div style="${base}opacity:${s.status==='pending'?0.6:1}">
      <div style="font-size:11px;color:var(--muted);font-weight:700;margin-bottom:4px">${s.code}</div>
      <div>${side(s.a,s.sa)} <span style="color:var(--muted)">vs</span> ${side(s.b,s.sb)}</div></div>`;
  };
  const nC=KR.filter(s=>s.status==='confirmed').length;
  return `<div style="margin-bottom:20px">
    <h3 style="margin:0 0 4px">⚽ ${tx('Dieciseisavos de final · cuadro oficial','Round of 32 · official bracket')} <span style="font-size:13px;color:var(--muted);font-weight:600">(${nC}/16 ${tx('confirmados','confirmed')})</span></h3>
    <p style="margin:0 0 10px;font-size:13px;color:var(--muted)">${tx('Los 16 cruces oficiales tras el cierre de los 12 grupos. Cada llave compara el pronóstico de las tres IAs (Claude · ChatGPT · Gemini) con el clasificado por consenso. Las tres coinciden en 14 de 16; las únicas divididas son Países Bajos–Marruecos y Australia–Egipto, donde Gemini se separa por su submodelo de penaltis.','The 16 official ties after all 12 groups closed. Each tie compares the three AIs (Claude · ChatGPT · Gemini) with the consensus qualifier. All three agree on 14 of 16; the only splits are Netherlands–Morocco and Australia–Egypt, where Gemini diverges via its penalty submodel.')}</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px">${KR.map(card).join('')}</div></div>`;
}
function bkKORealHTML(ph,tES,tEN,tot,intro){
  const KR=(DATA.ko_real||[]).filter(s=>s.phase===ph); if(!KR.length) return '';
  const tbd=`<span style="color:var(--muted);font-style:italic">${tx('Por definir','TBD')}</span>`;
  const base='background:var(--card);border:1px solid var(--border);border-radius:12px;padding:10px 12px;';
  const meta=s=>(s.fecha||s.venue)?`<div style="font-size:10.5px;color:var(--muted);margin-top:4px">📅 ${s.fecha||''}${s.venue?' · 📍 '+s.venue:''}</div>`:'';
  const card=s=>{
    if(s.status==='formed'&&s.pred){
      const ps=[['Claude','var(--c-claude)',s.pred],['ChatGPT','var(--c-chatgpt)',s.cg],['Gemini','var(--c-gemini)',s.gm]].filter(x=>x[2]);
      const ex=q=>(q&&(q.et==='Sí'||q.et==='Yes')?' '+tx('+pró','+ET'):'')+(q&&(q.pens==='Sí'||q.pens==='Yes')?' '+tx('+pen','+pk'):'');
      const lines=ps.map(([lbl,col,q])=>`<div style="font-size:12px;margin-top:2px"><span style="color:${col};font-weight:800">${lbl}</span> ${q.sc90} → <b>${tf(q.winner)}</b> <span style="color:var(--muted)">${q.conf}%${ex(q)}</span></div>`).join('');
      const cnt={}; ps.forEach(x=>cnt[x[2].winner]=(cnt[x[2].winner]||0)+1);
      const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0], unan=top[1]===ps.length;
      const badge=`<span style="font-size:10px;font-weight:700;color:${unan?'#1a9e5c':'#b58900'}">${unan?'✓ '+tx('los 3 coinciden','all 3 agree'):top[1]+'-'+(ps.length-top[1])+' '+tf(top[0])}</span>`;
      const cc=s.cons;
      const consLine=cc?`<div style="font-size:12px;margin-top:5px;padding-top:5px;border-top:1px dashed var(--border)"><span style="color:var(--purple);font-weight:800">${tx('Consenso','Consensus')}</span> ${cc.sc90} → <b>${tf(cc.winner)}</b> <span style="color:var(--muted)">${cc.conf}%${ex(cc)}</span></div>`:'';
      return `<div style="${base}border-left:4px solid #1a9e5c">
        <div style="font-size:11px;color:#1a9e5c;font-weight:800;margin-bottom:4px;display:flex;justify-content:space-between;gap:6px">${s.code} · ${tx('CONFIRMADO','CONFIRMED')} ${badge}</div>
        <div style="font-weight:700;margin-bottom:2px"><b>${tf(s.a)}</b> <span style="color:var(--muted);font-weight:400">vs</span> <b>${tf(s.b)}</b></div>
        ${lines}${consLine}${meta(s)}</div>`;
    }
    if(s.status==='formed'){
      return `<div style="${base}border-left:4px solid var(--vibrant-blue)">
        <div style="font-size:11px;color:var(--vibrant-blue);font-weight:800;margin-bottom:4px">${s.code} · ${tx('CONFIRMADO · pronóstico en curso','CONFIRMED · forecast pending')}</div>
        <div style="font-weight:700"><b>${tf(s.a)}</b> <span style="color:var(--muted);font-weight:400">vs</span> <b>${tf(s.b)}</b></div>${meta(s)}</div>`;
    }
    const fdr=x=>x?`<span style="font-size:11px;color:var(--muted)">(${tx('ganador','winner')} ${x.replace('G-','')})</span>`:'';
    const side=(t,sl)=>t?`<b>${tf(t)}</b>`:`${tbd} ${fdr(sl)}`;
    return `<div style="${base}opacity:${s.status==='pending'?0.6:1}">
      <div style="font-size:11px;color:var(--muted);font-weight:700;margin-bottom:4px">${s.code}</div>
      <div>${side(s.a,s.sa)} <span style="color:var(--muted)">vs</span> ${side(s.b,s.sb)}</div>${meta(s)}</div>`;
  };
  const nF=KR.filter(s=>s.status==='formed').length;
  const nP=KR.filter(s=>s.status==='formed'&&s.pred).length;
  return `<div style="margin-bottom:20px">
    <h3 style="margin:0 0 4px">⚽ ${tx(tES,tEN)} <span style="font-size:13px;color:var(--muted);font-weight:600">(${nF}/${tot} ${tx('confirmados','confirmed')})</span></h3>
    <p style="margin:0 0 10px;font-size:13px;color:var(--muted)">${intro||tx('El cuadro se arma con cada ronda que termina. Los cruces confirmados incluyen el <b>pronóstico oficial de las tres IAs</b> emitido con la información real del torneo; los demás se completan al definirse. El consenso combina las tres (mayoría para el clasificado, mediana para el marcador).','The bracket fills in as each round ends. Confirmed ties include the <b>three AIs\' official forecast</b> issued with real tournament information; the rest are added as they are set. The consensus combines all three (majority qualifier, median score).')}</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px">${KR.map(card).join('')}</div></div>`;
}
function bkR16RealHTML(){return bkKORealHTML('R16','Octavos de final · cuadro temporal','Round of 16 · provisional bracket',8);}
function bkQFRealHTML(){return bkKORealHTML('QF','Cuartos de final · cuadro temporal','Quarter-finals · provisional bracket',4);}
function bkSFRealHTML(){return bkKORealHTML('SF','Semifinales · cuadro temporal','Semifinals · provisional bracket',2,tx('Pronósticos definitivos de las tres IAs con el <b>ranking FIFA en vivo</b> post-cuartos (Francia 1ª, Argentina 2ª, España 3ª, Inglaterra 4ª). Claude v4.6, ChatGPT v14 y Gemini (HMM). Divergencia cruzada: en M101 Claude sostiene España en solitario (2/3 dan Francia); en M102 Gemini apuesta por Inglaterra en solitario (2/3 dan Argentina). El consenso refleja la mayoría 2/3.','Final forecasts from all three AIs using the <b>live FIFA ranking</b> after the quarterfinals (France 1st, Argentina 2nd, Spain 3rd, England 4th). Claude v4.6, ChatGPT v14 and Gemini (HMM). Split disagreement: in M101 Claude alone holds Spain (2/3 pick France); in M102 Gemini alone backs England (2/3 pick Argentina). The consensus reflects the 2/3 majority.'));}
function bkR16HTML(){
  const W=DATA.ko_r32_win||{}; if(!Object.keys(W).length) return '';
  const base='background:var(--card);border:1px solid var(--border);border-radius:12px;padding:10px 12px;';
  const NEXT=[['M89','M74','M77'],['M90','M73','M75'],['M91','M76','M78'],['M92','M79','M80'],
              ['M93','M83','M84'],['M94','M81','M82'],['M95','M86','M88'],['M96','M85','M87']];
  const CONF={M73:1,M74:1,M75:1,M76:1,M77:1,M78:1,M79:1,M80:1,M81:1,M82:1,M83:1,M84:1,M85:1,M86:1,M87:1,M88:1};
  const AIs=[['claude','Claude','var(--c-claude)'],['chatgpt','ChatGPT','var(--c-chatgpt)'],['gemini','Gemini','var(--c-gemini)']];
  const cards=NEXT.map(([slot,f1,f2])=>{
    const rows=AIs.map(([k,lbl,col])=>{
      const w=W[k]||{}, a=w[f1], b=w[f2];
      const t=(a&&b)?`<b>${tf(a)}</b> <span style="color:var(--muted);font-weight:400">vs</span> <b>${tf(b)}</b>`
                    :`<span style="color:var(--muted);font-style:italic">${tx('por definir','TBD')}</span>`;
      return `<div style="font-size:12px;margin-top:2px"><span style="color:${col};font-weight:800">${lbl}</span> ${t}</div>`;
    }).join('');
    const sigs=AIs.map(([k])=>{const w=W[k]||{};return (w[f1]&&w[f2])?[w[f1],w[f2]].slice().sort().join(' / '):null}).filter(Boolean);
    const uniq=[...new Set(sigs)];
    const flag = sigs.length>=2
      ? (uniq.length===1?`<span style="font-size:10px;color:#1a9e5c;font-weight:700">✓ ${tx('mismo cruce','same tie')}</span>`
                        :`<span style="font-size:10px;color:#b58900;font-weight:700">⚠ ${tx('cruces distintos','different ties')}</span>`)
      : '';
    const conf=(f1 in CONF)&&(f2 in CONF);
    return `<div style="${base}border-left:4px solid ${conf?'var(--blue)':'var(--border)'}">
      <div style="font-size:11px;color:var(--blue);font-weight:800;margin-bottom:2px;display:flex;justify-content:space-between;gap:6px">${slot}${conf?' · '+tx('formable','formable'):''} ${flag}</div>
      <div style="font-size:10px;color:var(--muted);margin-bottom:4px">${tx('ganador','winner')} ${f1} × ${tx('ganador','winner')} ${f2}</div>
      ${rows}</div>`;
  }).join('');
  const cov=AIs.map(([k,lbl])=>{const w=W[k]||{};const n=NEXT.filter(([s,a,b])=>w[a]&&w[b]).length;return `${lbl} ${n}/8`;}).join(' · ');
  return `<div style="margin-bottom:20px">
    <h3 style="margin:0 0 4px">🔗 ${tx('Octavos de final · cruce proyectado por cada IA','Round of 16 · projected tie per AI')}</h3>
    <p style="margin:0 0 6px;font-size:13px;color:var(--muted)">${tx('Enganche derivado de los <b>ganadores de dieciseisavos</b> de cada IA, independiente de las predicciones de grupos, para trazabilidad completa. Un cruce solo se forma si la IA pronosticó ambos clasificados; si no, queda «por definir».','Hookup derived from the <b>Round-of-32 winners</b> of each AI, independent of the group-stage predictions, for full traceability. A tie forms only if the AI predicted both qualifiers; otherwise it stays TBD.')}</p>
    <p style="margin:0 0 10px;font-size:12px;color:var(--muted)">${tx('Cobertura','Coverage')}: ${cov}</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px">${cards}</div></div>`;
}
function bkLiveHTML(){
  const KR=(DATA.ko_real||[]).filter(s=>(s.phase||'R32')==='R32'); if(!KR.length) return '';
  const RES=(typeof KO_RESULTS!=='undefined'&&KO_RESULTS!=null)?KO_RESULTS:(DATA.ko_results||[]);
  const rByC={}; RES.forEach(r=>{rByC[r.code]=r;});
  const win={}, teams={};
  for(const s of KR){ teams[s.code]=[s.a,s.b]; const r=rByC[s.code]; if(r&&r.winner) win[s.code]=r.winner; }
  for(const [code,f1,f2] of BK_NEXT){ const a=win[f1]||null,b=win[f2]||null; teams[code]=[a,b]; const r=rByC[code]; if(r&&r.winner&&a&&b) win[code]=r.winner; }
  const R32played=KR.filter(s=>win[s.code]).length;
  const r16=['M89','M90','M91','M92','M93','M94','M95','M96'];
  const r16formed=r16.filter(c=>{const p=teams[c]||[];return p[0]&&p[1];}).length;
  const tbd=`<span class="bk-tbd">${tx('Por definir','TBD')}</span>`;
  const card=(code,isFinal)=>{
    const p=teams[code]||[null,null], a=p[0], b=p[1], w=win[code], r=rByC[code];
    const trow=(t,on,out)=>`<div class="bk-team${on?' w':''}${out?' l':''}"${on?' style="background:rgba(26,158,92,.15);color:#128a4f"':''}><span class="bk-nm">${t?tf(t):tbd}</span></div>`;
    const via=r&&r.via?(r.via==='pen'?' <small>'+tx('pen','pk')+' '+(r.xsc||'')+'</small>':' <small>'+tx('pró','aet')+' '+(r.xsc||'')+'</small>'):'';
    const sc=r?`<span class="bk-livesc">${r.ga}-${r.gb}${via}</span>`:'';
    const cs=isFinal?'':(w?'style="background:#1a9e5c"':(a&&b?'style="background:var(--vibrant-blue)"':'style="background:var(--muted)"'));
    return `<div class="bk-match${isFinal?' bk-fmatch':''}" title="${code}"><div class="bk-code" ${cs}>${code}${sc}</div>${trow(a,!!w&&w===a,!!w&&w!==a)}${trow(b,!!w&&w===b,!!w&&w!==b)}</div>`;
  };
  const cols=side=>{let h='';for(const [key,codes] of BK_LAYOUT[side]){const name=BK_RNAME[key][LANG==='en'?1:0];let cc='';for(const code of codes)cc+=card(code,false);h+=`<div class="bk-col"><div class="bk-rhead" style="color:var(--deep-blue)">${name}</div>${cc}</div>`;}return h;};
  const champLine = win['M104'] ? `<div class="bk-livechamp">🏆 ${tx('Campeón','Champion')}: ${tf(win['M104'])}</div>` : '';
  // supervivientes: aparecen en el cuadro y no han perdido ninguna llave jugada
  const losers=new Set(); Object.keys(win).forEach(c=>{const p=teams[c]||[];p.forEach(t=>{if(t&&t!==win[c])losers.add(t);});});
  const RND=c=>{const n=+c.slice(1);return n>=104?5:(n>=101?4:(n>=97?3:(n>=89?2:1)));};
  const RLBL=[,['16avos','R32'],['octavos','R16'],['cuartos','QF'],['semis','SF'],['final','F']];
  const best={};
  Object.entries(teams).forEach(([c,p])=>{(p||[]).forEach(t=>{if(t&&!losers.has(t)){const r=RND(c);if(!best[t]||r>best[t])best[t]=r;}});});
  const alive=Object.entries(best).sort((x,y)=>y[1]-x[1]||x[0].localeCompare(y[0]));
  const aliveHTML=alive.length?`<div class="bk-alive"><div class="bk-alive-h">🔥 ${tx('SIGUEN VIVOS','STILL ALIVE')} (${alive.length})</div>${alive.map(([t,r])=>`<div class="bk-alive-t" title="${tn(t)}"><span class="bk-alive-f">${FLAG[t]||'🏳️'}</span><span class="bk-alive-n">${tn(t)}</span><span class="bk-alive-r">${tx('en '+RLBL[r][0],'in '+RLBL[r][1])}</span></div>`).join('')}</div>`:'';
  const trophySVG=`<svg width="58" height="88" viewBox="0 0 58 88" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="au" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe98a"/><stop offset=".5" stop-color="#f2c23e"/><stop offset="1" stop-color="#b8811a"/></linearGradient><linearGradient id="au2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a8760f"/><stop offset=".5" stop-color="#ffeda0"/><stop offset="1" stop-color="#a8760f"/></linearGradient><radialGradient id="gl" cx=".38" cy=".32" r=".95"><stop offset="0" stop-color="#ffefad"/><stop offset=".6" stop-color="#f0bd35"/><stop offset="1" stop-color="#c08a18"/></radialGradient><linearGradient id="mal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#12684a"/><stop offset="1" stop-color="#083d2b"/></linearGradient></defs>
<circle cx="29" cy="16" r="13" fill="url(#gl)" stroke="#a8760f" stroke-width="1.2"/>
<ellipse cx="29" cy="16" rx="13" ry="5" fill="none" stroke="#a8760f" stroke-width=".9" opacity=".75"/>
<ellipse cx="29" cy="16" rx="5" ry="13" fill="none" stroke="#a8760f" stroke-width=".9" opacity=".75"/>
<path d="M16.5 16h25" stroke="#a8760f" stroke-width=".8" opacity=".6"/>
<circle cx="24" cy="11" r="3.2" fill="#fff" opacity=".5"/>
<path d="M15 30 C11 40 15 47 21 52 C25 55 25 60 24 64 h10 C33 60 33 55 37 52 C43 47 47 40 43 30 C39 25 34 27 29 27 C24 27 19 25 15 30Z" fill="url(#au)" stroke="#a8760f" stroke-width="1.1"/>
<path d="M20 33 C17 40 20 46 25 50" fill="none" stroke="#a8760f" stroke-width="1" opacity=".55"/>
<path d="M38 33 C41 40 38 46 33 50" fill="none" stroke="#a8760f" stroke-width="1" opacity=".55"/>
<path d="M21 64h16l2 5H19Z" fill="url(#au)" stroke="#a8760f" stroke-width="1"/>
<rect x="13" y="69" width="32" height="13" rx="2.5" fill="url(#mal)" stroke="#06301f" stroke-width="1"/>
<rect x="13" y="71.5" width="32" height="2.2" fill="url(#au2)" opacity=".9"/>
<rect x="13" y="77.5" width="32" height="2.2" fill="url(#au2)" opacity=".9"/>
</svg>`;
  const trophyHTML=`<div class="bk-trophy">${trophySVG}<div class="bk-trophy-cap">${tx('LA GRAN FINAL','THE GRAND FINAL')}<br><span style="color:var(--muted);font-weight:700">19 Jul · New York/NJ</span></div></div>`;
  return `<div class="bk-live">
    <div class="bk-live-head"><span class="phase-tag live">⚡ ${tx('En vivo','Live')}</span><h3>🗺️ ${tx('Cuadro actual · se arma con los resultados reales','Current bracket · built from real results')}</h3></div>
    <p class="bk-live-desc">${tx('A medida que se juegan los <b>dieciseisavos</b>, cada clasificado avanza por el cuadro oficial hacia la final. Un cruce se <b>forma</b> cuando sus dos equipos ya están definidos; los demás quedan «por definir». <b>Este cuadro será la base del nuevo pronóstico</b> que pediremos a las tres IAs al cerrar los 16avos.','As the <b>Round of 32</b> is played, each qualifier advances through the official bracket toward the final. A tie is <b>formed</b> once both its teams are known; the rest stay «TBD». <b>This bracket will be the base for the new forecast</b> we\'ll request from the three AIs when the Round of 32 ends.')}</p>
    <p class="bk-live-stat">${tx('Dieciseisavos jugados','Round-of-32 played')}: <b>${R32played}/16</b> · ${tx('octavos formados','Round-of-16 ties formed')}: <b>${r16formed}/8</b></p>
    ${aliveHTML}${champLine}
    <div class="bk-scroll"><div class="bk-board">
      <div class="bk-side">${cols('left')}</div>
      <div class="bk-final">${trophyHTML}<div class="bk-rhead" style="color:var(--deep-blue)">${tx('Final','Final')}</div>${card('M104',true)}</div>
      <div class="bk-side" style="flex-direction:row-reverse">${cols('right')}</div>
    </div></div>
    <div class="bk-live-leg">${tx('<b style="color:#1a9e5c">■</b> avanzó (resultado real) &nbsp; <b style="color:var(--vibrant-blue)">■</b> cruce formado, aún por jugar &nbsp; <b style="color:var(--muted)">■</b> por definir &nbsp; · &nbsp; «pró» = definido en prórroga (marcador a 120′) · «pen» = definido por penales','<b style="color:#1a9e5c">■</b> advanced (real result) &nbsp; <b style="color:var(--vibrant-blue)">■</b> formed tie, not yet played &nbsp; <b style="color:var(--muted)">■</b> TBD &nbsp; · &nbsp; «aet» = decided in extra time (120′ score) · «pk» = decided on penalties')}</div>
  </div>`;
}
function bkBuild(model,metric){
  const gp=DATA.group_proj, groups=Object.keys(gp).sort();
  const st=(g,pos)=>gp[g][model][pos][0];
  const thirds=groups.map(g=>[g,gp[g][model][2][1]]).sort((a,b)=>b[1]-a[1]).slice(0,8).map(x=>x[0]);
  const assign=bkThirdMatch(thirds);
  const strong=bkStrong(metric);
  const M={}, W={};
  for(const [code,la,lb] of BK_R32){
    const resolve=(lab)=>{ if(lab==='3'){const g=assign[code]; return g?[st(g,2),'3º '+g]:['?','3º'];}
      return [st(lab[1],(+lab[0])-1), lab]; };
    const [a,sa]=resolve(la),[b,sb]=resolve(lb); const w=strong(a,b);
    M[code]={a,b,sa,sb,w}; W[code]=w;
  }
  for(const [code,fa,fb] of BK_NEXT){ const a=W[fa],b=W[fb],w=strong(a,b); M[code]={a,b,sa:'',sb:'',w}; W[code]=w; }
  const fm=M['M104']; const ru=(W['M104']===fm.a)?fm.b:fm.a;
  return {champion:W['M104'],runnerup:ru,matches:M};
}
function bkCard(B,model,code,isFinal,prov){
  const m=B.matches[code], c=BK_COL[model], isR32=BK_R32C.indexOf(code)>=0;
  const row=(team,seed,win)=>{
    const sd=(isR32&&seed)?'<span class="bk-seed">'+seed+'</span>':'';
    const ws=win?(isFinal?'style="background:rgba(255,255,255,.16);color:#ffd84d"':'style="background:'+c+'18;color:'+c+'"'):'';
    return '<div class="bk-team '+(win?'w':'')+'" '+ws+'>'+sd+'<span class="bk-nm">'+tf(team)+'</span></div>';
  };
  const cs=isFinal?'':'style="background:'+(prov?'var(--range)':c)+'"';
  return '<div class="bk-match '+(isFinal?'bk-fmatch':'')+(prov?' prov':'')+'" title="'+code+'"><div class="bk-code" '+cs+'>'+code+'</div>'+row(m.a,m.sa,m.w===m.a)+row(m.b,m.sb,m.w===m.b)+'</div>';
}
function bkCols(B,model,side){
  let h='';
  for(const [key,codes] of BK_LAYOUT[side]){
    const prov=key!=='R32', name=BK_RNAME[key][LANG==='en'?1:0];
    const hc=prov?'var(--muted)':BK_COL[model];
    const tag=prov?' <span style="font-weight:600;opacity:.85">· '+tx('prov.','prov.')+'</span>':'';
    let cards=''; for(const code of codes) cards+=bkCard(B,model,code,false,prov);
    h+='<div class="bk-col"><div class="bk-rhead" style="color:'+hc+'">'+name+tag+'</div>'+cards+'</div>';
  }
  return h;
}
/* ---- standings reales por grupo (desde resultados oficiales) ---- */
function bkStandings(){
  const res=REAL_RESULTS||[], G=DATA.groups, out={};
  for(const g of Object.keys(G)){
    const tbl={}; G[g].forEach(t=>tbl[t]={t,pts:0,gf:0,ga:0});
    let played=0;
    for(const r of res){
      if(r.grupo!==g||r.ga==null||r.gb==null||!tbl[r.a]||!tbl[r.b]) continue;
      played++; tbl[r.a].gf+=r.ga; tbl[r.a].ga+=r.gb; tbl[r.b].gf+=r.gb; tbl[r.b].ga+=r.ga;
      if(r.ga>r.gb) tbl[r.a].pts+=3; else if(r.ga<r.gb) tbl[r.b].pts+=3; else {tbl[r.a].pts++; tbl[r.b].pts++;}
    }
    const rows=Object.values(tbl).sort((a,b)=>b.pts-a.pts||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf);
    out[g]={rows,complete:played>=6};
  }
  return out;
}
/* ---- puntaje estructural (1º=3, 2º=2, 3º=2 si entra entre los 8 mejores, orden completo +2) ---- */
function bkStructural(){
  const stand=bkStandings(), gp=DATA.group_proj, groups=Object.keys(gp).sort();
  const complete=groups.filter(g=>stand[g].complete);
  const scores={}; BK_MODELS.forEach(m=>scores[m]=0);
  let best8=null;
  if(complete.length===groups.length){
    const thirds=groups.map(g=>({g,r:stand[g].rows[2]})).map(o=>({g:o.g,t:o.r.t,pts:o.r.pts,gd:o.r.gf-o.r.ga,gf:o.r.gf}))
      .sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf);
    best8=new Set(thirds.slice(0,8).map(o=>o.t));
  }
  for(const g of complete){
    const real=stand[g].rows.map(r=>r.t);
    for(const m of BK_MODELS){
      const pred=gp[g][m].map(x=>x[0]); let s=0;
      if(pred[0]===real[0]) s+=3;
      if(pred[1]===real[1]) s+=2;
      if(pred[2]===real[2] && (best8===null || best8.has(real[2]))) s+=2;
      if(pred[0]===real[0]&&pred[1]===real[1]&&pred[2]===real[2]) s+=2;
      scores[m]+=s;
    }
  }
  return {scores,done:complete.length,total:groups.length};
}
function bkStructuralHTML(){
  const S=bkStructural();
  const rules='<div class="strb-rules">'+
    '<span class="strb-rule">'+tx('1º del grupo','Group 1st')+': +3</span>'+
    '<span class="strb-rule">'+tx('2º','2nd')+': +2</span>'+
    '<span class="strb-rule">'+tx('3º (entre los 8 mejores)','3rd (among best 8)')+': +2</span>'+
    '<span class="strb-rule">'+tx('orden 1-2-3 completo','full 1-2-3 order')+': +2</span></div>';
  let body;
  if(S.done<S.total){
    const pct=Math.round(100*S.done/S.total);
    body='<div class="strb-pend"><div class="big">⏳</div>'+
      tx('Se activa al cerrar la fase de grupos. Aquí se puntúa a cada IA por <b>acertar el orden final de cada grupo</b>, comparado con los resultados oficiales.',
         'Activates when the group stage ends. Each AI is scored for <b>correctly predicting each group\'s final order</b> against the official results.')+
      '<div class="strb-prog"><span style="width:'+pct+'%"></span></div>'+
      '<div style="font-size:12px;margin-top:4px">'+tx('Grupos definidos','Groups decided')+': '+S.done+'/'+S.total+'</div></div>';
  } else {
    const ord=BK_MODELS.slice().sort((a,b)=>S.scores[b]-S.scores[a]);
    body=ord.map((m,i)=>'<div class="strb-row"><div class="strb-rank">'+(i+1)+'</div>'+
      '<div class="strb-name"><span class="dot" style="background:'+BK_COL[m]+'"></span>'+m+'</div>'+
      '<div class="strb-pts" style="color:'+BK_COL[m]+'">'+S.scores[m]+'</div></div>').join('');
  }
  return '<div class="strb"><h3>📐 '+tx('Predicción estructural','Structural prediction')+'</h3>'+
    '<p class="desc">'+tx('Tablero separado del «Mundial de las IAs». Mide qué tan bien cada IA anticipó el <b>orden de los grupos</b> (no los marcadores sueltos).',
        'A board separate from the «AI World Cup». It measures how well each AI anticipated the <b>group order</b> (not individual scorelines).')+'</p>'+
    rules+body+'</div>';
}
function renderBracket(){
  const host=document.getElementById('bracket'); if(!host) return;
  const model=BK_CUR, c=BK_COL[model], metric=BK_METRIC, B=bkBuild(model,metric);
  const metricName = metric==='fifa' ? tx('Ranking FIFA','FIFA Ranking') : 'Elo';
  const tabs='<div class="bk-seltabs">'+BK_MODELS.map(m=>
    '<button class="bk-seltab '+(m===model?'on':'')+'" '+(m===model?'style="background:'+BK_COL[m]+'"':'')+' data-bk="'+m+'"><span class="dot" style="background:'+BK_COL[m]+'"></span>'+m+'</button>').join('')+'</div>';
  const mtoggle='<div class="bk-metric"><span class="bk-metric-lbl">'+tx('Métrica de avance','Advancement metric')+':</span>'+
    '<button class="bk-mbtn '+(metric==='elo'?'on':'')+'" data-metric="elo">Elo</button>'+
    '<button class="bk-mbtn '+(metric==='fifa'?'on':'')+'" data-metric="fifa">'+tx('Ranking FIFA','FIFA Ranking')+'</button>'+
    '<span class="bk-metric-note">⚠️ '+tx('No es predicción: solo muestra quién <b>avanzaría según ese ranking</b>, sin los demás factores de un pronóstico completo. El cuadro de abajo es una referencia de fuerza <b>pre-Mundial</b>.',
       'Not a prediction: it only shows who <b>would advance per that ranking</b>, without the other factors of a full forecast. The bracket below is a <b>pre-tournament</b> strength reference.')+'</span></div>';
  const champ='<div class="bk-champ" style="background:linear-gradient(135deg,#041c59,'+c+' 78%)">'+
    '<span class="cup">🏆</span><div><div class="lbl">'+tx('Campeón proyectado · pre-Mundial','Projected champion · pre-tournament')+' · '+model+' · '+metricName+'</div>'+
    '<div class="nm">'+tf(B.champion)+'</div><div class="ru">'+tx('Subcampeón','Runner-up')+': '+tf(B.runnerup)+'</div></div></div>';
  const advText = metric==='fifa'
    ? tx('las IAs no han emitido una predicción actualizada de estas rondas. Aquí avanza la selección <b>mejor ubicada en el Ranking FIFA</b> (oficial, 11 jun) — es una referencia de fuerza, no la predicción de cada IA.',
         'the AIs have not issued an updated prediction for these rounds. Here the team <b>higher in the FIFA Ranking</b> (official, 11 Jun) advances — a strength reference, not each AI\'s prediction.')
    : tx('las IAs no han emitido una predicción actualizada de estas rondas. Se rellenan por <b>Elo</b> — un número que mide la fuerza de cada selección según su historial; avanza el de mayor Elo. Es una referencia de fuerza, no la predicción de cada IA.',
         'the AIs have not issued an updated prediction for these rounds. They are filled by <b>Elo</b> — a number rating each team\'s strength from its track record; the higher-Elo team advances. It is a strength reference, not each AI\'s prediction.');
  const elobox='<div class="bk-elobox">'+
    '<div style="background:#fff3da;border:1px solid #f0d98a;color:#7a5b00;border-radius:10px;padding:9px 12px;margin-bottom:10px;font-weight:600;line-height:1.5">⏳ '+
    tx('Proyección <b>PRE-MUNDIAL</b>: el cuadro de abajo hasta la final usa los <b>grupos que cada IA proyectó antes del torneo</b> y la fuerza Elo/FIFA; <b>no incorpora los resultados reales</b>. La <b>Ronda de 32 de arriba sí es el cuadro oficial</b>; el seguimiento en vivo (resultados y puntajes) está en la pestaña «Mundial de las IAs».',
       '<b>PRE-TOURNAMENT</b> projection: the bracket below to the final uses the <b>groups each AI projected before the tournament</b> plus Elo/FIFA strength; it <b>does not incorporate the real results</b>. The <b>Round of 32 above is the official bracket</b>; live tracking (results and scores) lives in the «AI World Cup» tab.')+'</div>'+
    '<b>'+tx('Ronda de 32','Round of 32')+':</b> '+
    tx('predicción firme de cada IA — sale de su orden de grupos proyectado y sus 8 mejores terceros (por puntos esperados).',
       'each AI\'s firm prediction — from its projected group order and its 8 best third-placed teams (by expected points).')+
    '<br><b>'+tx('Octavos → Final','Round of 16 → Final')+':</b> '+advText+
    '<br><span style="font-size:11.5px;opacity:.85">🔎 '+
    tx('El <b>Elo</b> (eloratings.net, previo al Mundial) y el <b>Ranking FIFA</b> (oficial, 11 jun) son sistemas distintos: por Elo, España es nº1; por FIFA, Argentina es nº1. Cambia la métrica arriba para comparar. Para predecir partidos, el Elo suele ser más fiable.',
       'Both <b>Elo</b> (eloratings.net, pre-tournament) and the <b>FIFA Ranking</b> (official, 11 Jun) are different systems: by Elo, Spain is no.1; by FIFA, Argentina is no.1. Switch the metric above to compare. For match prediction, Elo tends to be more reliable.')+'</span></div>';
  const fm=bkCard(B,model,'M104',true,false);
  const board='<div class="bk-scroll"><div class="bk-board">'+
    '<div class="bk-side">'+bkCols(B,model,'left')+'</div>'+
    '<div class="bk-final"><div class="bk-rhead" style="color:var(--deep-blue)">'+tx('Final','Final')+'</div>'+fm+'</div>'+
    '<div class="bk-side" style="flex-direction:row-reverse">'+bkCols(B,model,'right')+'</div></div></div>';
  const legend='<div class="bk-legend">'+tx('Resaltado = avanza según ','Highlighted = advances per ')+metricName+
    tx('. Etiquetas (1A, 2B, 3º X) = origen del clasificado. Desliza horizontalmente para ver todo el bracket.',
       '. Labels (1A, 2B, 3rd X) = the qualifier\'s origin. Scroll horizontally to see the full bracket.')+'</div>';
  const note='<p class="bk-note"><b>'+tx('Es una proyección, no el bracket oficial.','It is a projection, not the official bracket.')+'</b> '+
    tx('La asignación de los terceros sigue una matriz oficial FIFA de 495 combinaciones; aquí se usa una asignación válida que respeta los grupos elegibles de cada casilla y puede diferir de la oficial en algún caso.',
       'The third-placed allocation follows an official FIFA matrix of 495 combinations; here a valid assignment is used that respects each slot\'s eligible groups and may differ from the official one in some cases.')+'</p>';
  host.innerHTML=bkLiveHTML()+bkSFRealHTML()+bkQFRealHTML()+bkR16RealHTML()+(function(){const h=bkR32RealHTML();return h?`<details class="phase-closed-d" style="margin-bottom:20px"><summary style="cursor:pointer;font-weight:800">📁 ${tx('Dieciseisavos de final · fase cerrada (16/16) — abrir como referencia','Round of 32 · closed phase (16/16) — open for reference')}</summary>${h}</details>`:''})()+bkStructuralHTML()+tabs+mtoggle+champ+elobox+board+legend+note;
  const sel=host.querySelector('.bk-seltabs');
  if(sel) sel.addEventListener('click',e=>{const b=e.target.closest('[data-bk]'); if(!b)return; BK_CUR=b.dataset.bk; renderBracket(); gaEvent('bracket_model',{model:BK_CUR});});
  const mt=host.querySelector('.bk-metric');
  if(mt) mt.addEventListener('click',e=>{const b=e.target.closest('[data-metric]'); if(!b)return; BK_METRIC=b.dataset.metric; renderBracket(); gaEvent('bracket_metric',{metric:BK_METRIC});});
}

/* ============ TABS ============ */
function goTab(id){
  const b=document.querySelector('.tab[data-t="'+id+'"]'); if(!b)return;
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));
  b.classList.add('active'); const p=document.getElementById(id); if(p)p.classList.add('active');
  trackTab(id); setupScorersTracking();
}
document.getElementById('tabs').addEventListener('click', e=>{
  const b=e.target.closest('.tab'); if(!b)return;
  goTab(b.dataset.t);
});
/* accesos rápidos del hero */
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>{
  goTab(b.dataset.go);
  gaEvent('hero_cta',{target:b.dataset.go});
  const t=document.getElementById('tabs'); if(t&&t.scrollIntoView) t.scrollIntoView({behavior:'smooth',block:'start'});
}));

/* ============ IDIOMA + TEMA ============ */
function applyLang(lang){
  LANG=lang; document.documentElement.lang=lang;
  document.querySelectorAll('[data-en]').forEach(el=>{
    if(el._es===undefined) el._es=el.innerHTML;
    el.innerHTML = lang==='en' ? el.getAttribute('data-en') : el._es;
  });
  document.querySelectorAll('#langSeg .seg-btn').forEach(b=>b.classList.toggle('active', b.dataset.lang===lang));
  renderConsenso(); renderClaude(); renderChatGPT(); renderGemini(); renderAccuracy(); renderBracket();
  try{localStorage.setItem('jf_lang',lang)}catch(e){}
}
document.querySelectorAll('#langSeg .seg-btn').forEach(b=>b.addEventListener('click',()=>{applyLang(b.dataset.lang); gaEvent('toggle_language',{language:b.dataset.lang}); setupScorersTracking();}));

function applyTheme(t){
  document.documentElement.setAttribute('data-theme',t);
  const btn=document.getElementById('themeBtn');
  btn.textContent = t==='dark'?'☀️':'🌙'; btn.setAttribute('aria-pressed', t==='dark');
  try{localStorage.setItem('jf_theme',t)}catch(e){}
}
const savedTheme=(function(){try{return localStorage.getItem('jf_theme')}catch(e){return null}})()||((window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light');
applyTheme(savedTheme);
document.getElementById('themeBtn').addEventListener('click',()=>{const nt=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark'; applyTheme(nt); gaEvent('toggle_theme',{theme:nt});});

const savedLang=(function(){try{return localStorage.getItem('jf_lang')}catch(e){return null}})()||'es';
applyLang(savedLang);
loadResults();

/* analítica: registrar la pestaña activa inicial y activar el seguimiento de goleadores */
(function(){
  const act=document.querySelector('.tab.active');
  trackTab(act && act.dataset.t ? act.dataset.t : 'consenso');
  setupScorersTracking();
})();
</script>
</body></html>"""

HTML = HTML.replace("__BLOB__", BLOB)
HTML = HTML.replace("__RESULTS_FALLBACK__", RESULTS_FB)
open("/home/claude/wc2026/Benchmark_IA_Mundial2026.html","w",encoding="utf-8").write(HTML)
print("Generado:", len(HTML), "bytes")
