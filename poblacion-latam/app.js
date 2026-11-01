/* /poblacion-latam/ · Lógica de la página. Lee el contrato de latam-population-official vía PopData.
   Regla de la pieza: nada se empalma, interpola ni ajusta aquí; solo se dibuja lo que publica el repositorio de datos. */
"use strict";
const $=id=>document.getElementById(id);
const TR=window.TR_EN||{};
let LANG='es';
const T=s=>{if(LANG!=='en'||s==null)return s;const v=TR[s];return v!==undefined?v:s;};
const F=(s,o)=>T(s).replace(/\{(\w+)\}/g,(m,k)=>(o&&o[k]!==undefined)?o[k]:m);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LOC=()=>LANG==='en'?'en-US':'es-CO';
const NOW=new Date().getFullYear();
/* Año inicial: el último múltiplo de 5, el único que tienen todas las series, incluidas las quinquenales. */
const DEFAULT_YEAR=Math.floor(NOW/5)*5;
const safeStore={get(k){try{return localStorage.getItem(k);}catch(e){return null;}},set(k,v){try{localStorage.setItem(k,v);}catch(e){}}};
const css=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const fmtN=(v,d)=>v==null?'—':Number(v).toLocaleString(LOC(),{maximumFractionDigits:d||0});
const fmtPct=(p,d)=>p==null?'—':(p>0?'+':'')+(p*100).toLocaleString(LOC(),{minimumFractionDigits:d==null?2:d,maximumFractionDigits:d==null?2:d})+' %';
const fmtDate=iso=>{if(!iso)return '—';const[y,m,d]=iso.split('-');return new Date(Date.UTC(+y,+m-1,+d)).toLocaleDateString(LOC(),{timeZone:'UTC',year:'numeric',month:'short',day:'numeric'});};

const S={status:null,region:null,countries:{},failed:[],fromCache:false,year:NOW,country:'COL',compare:['COL','BRA','ARG','PER'],compareRegion:true,compareRange:'common',slots:{},base:2025,cagrA:null,cagrB:null,playing:null,plotly:null};
const REG='REG';
const SLOTS=['--s1','--s2','--s3','--s4','--s5','--s6','--s7'];
const BINS=[[5e6,'--q1','< 5 M'],[1e7,'--q2','5–10 M'],[2e7,'--q3','10–20 M'],[5e7,'--q4','20–50 M'],[1e8,'--q5','50–100 M'],[Infinity,'--q6','≥ 100 M']];

/* ---------- Acceso a datos ---------- */
const doc=iso=>S.countries[iso];
const recs=iso=>(doc(iso)&&doc(iso).records)||[];
const byYear=iso=>{const m={};recs(iso).forEach(r=>{m[r.year]=r;});return m;};
const name=iso=>{if(iso===REG)return T('Región (20 países)');const c=(S.status.countries||{})[iso]||doc(iso)||{};return LANG==='en'?(c.name_en||iso):(c.name_es||iso);};
const ISOS=()=>PopData.ISO3.slice().sort((a,b)=>name(a).localeCompare(name(b),LOC()));
const segKey=r=>r.source_id+'|'+r.vintage;
const segInfo=(iso,r)=>{const d=doc(iso);return d?(d.segments.find(s=>s.source_id===r.source_id&&s.year_from<=r.year&&r.year<=s.year_to)||d.segments.find(s=>s.source_id===r.source_id)):null;};
const isCepal=t=>t==='regional_fallback';
const blob=p=>p?PopData.REPO_BLOB+p.split('/').map(encodeURIComponent).join('/'):null;
function reason(iso){
  const d=doc(iso);
  const pick=o=>o&&(o[LANG]||o.es);
  if(!d)return T('El archivo de este país no cargó.');
  return pick(d.reasons&&(d.reasons.projection||d.reasons.historical))||T('Sin datos disponibles.');
}
const refText=c=>({'07-01':T('1 de julio'),'06-30':T('30 de junio'),'01-01':T('1 de enero'),'mid-year':T('mitad de año'),'census':T('fecha de cada censo')}[c]||T('no declarada'));
const typeText=t=>t==='projection'?T('Proyección'):(t==='observed'?T('Observado'):T('Estimado'));
const statusLabel=s=>({ok:T('Verificado'),manual:T('Carga manual'),manual_pendiente:T('Falta carga manual'),stale:T('Fuente caída: último dato válido'),error:T('Error'),pendiente:T('Pendiente')}[s]||s);
const statusClass=s=>({ok:'ok',manual:'ok',stale:'warn',manual_pendiente:'warn',pendiente:'warn',error:'err'}[s]||'');
const firstProj=iso=>{const r=recs(iso).find(x=>x.series_type==='projection');return r?r.year:null;};

/* ---------- Región: todo viene calculado en region.json; aquí solo se dibuja ---------- */
const isReg=i=>i===REG;
const regPoints=()=>S.region?S.region.points:[];
const regPoint=y=>regPoints().find(p=>p.year===y)||null;
const regPeriods=()=>S.region?S.region.periods:[];
const regShare=(iso,y)=>{const p=regPoint(y);return p?p.shares[iso]:null;};
const regCurrentYear=()=>{const ys=regPoints().map(p=>p.year).filter(y=>y<=NOW);return ys.length?ys[ys.length-1]:(regPoints()[0]||{}).year;};
const regCurrentPeriod=()=>{const g=regPeriods().filter(p=>p.from_year<=NOW);return g.length?g[g.length-1]:regPeriods()[0];};
const nameList=a=>a.map(name).join(', ');
/* Lo elegido va primero: en móvil la fila de chips se desplaza y lo activo no debe quedar fuera de vista. */
const chipOrder=sel=>sel.concat(ISOS().filter(i=>!sel.includes(i)));
const fmtM=v=>v==null?'—':fmtN(v/1e6,1)+' M';
const NO_REGION='El total regional no está disponible porque falta la cifra de algún país. Los datos por país siguen en las demás pestañas.';

/* ---------- Idioma y tema ---------- */
function i18nStatic(){
  document.documentElement.lang=LANG;
  document.querySelectorAll('[data-i18n]').forEach(n=>{if(n.dataset.es==null)n.dataset.es=n.textContent.trim();n.textContent=T(n.dataset.es);});
  document.querySelectorAll('.lang-opt').forEach(o=>o.setAttribute('aria-pressed',String(o.dataset.lang===LANG)));
  document.title=LANG==='en'?(TR.__title||window.__titleEs):window.__titleEs;
  const m=$('map');if(m)m.setAttribute('aria-label',T('Mapa de población de América Latina'));
  const g=$('langToggle');if(g)g.setAttribute('aria-label',T('Idioma'));
  const tb=$('tabs');if(tb)tb.setAttribute('aria-label',T('Análisis disponibles'));
}
function applyTheme(t,silent){
  document.documentElement.setAttribute('data-theme',t);
  const b=$('themeToggle');b.textContent=t==='dark'?'☀️':'🌙';b.setAttribute('aria-pressed',String(t==='dark'));
  b.setAttribute('aria-label',T(t==='dark'?'Cambiar a tema claro':'Cambiar a tema oscuro'));
  if(!silent)safeStore.set('jf-theme',t);
}
function applyLang(l,silent){
  LANG=l==='en'?'en':'es';i18nStatic();applyTheme(document.documentElement.getAttribute('data-theme')||'light',true);
  if(!silent){safeStore.set('jf-lang',LANG);safeStore.set('iac_lang',LANG);
    try{const u=new URL(location.href);if(LANG==='en')u.searchParams.set('lang','en');else u.searchParams.delete('lang');history.replaceState(null,'',u.pathname+u.search+u.hash);}catch(e){}
    track('lang_switch',{lang:LANG});}
  if(S.status)renderAll();
}

/* ---------- Pestañas: cada análisis se dibuja al abrirse, porque un gráfico oculto no conoce su ancho ---------- */
const TABS=['region','mapa','pais','piramides','indice','crecimiento','maximo','fuentes'];
const UI={tab:'region',dirty:new Set(TABS)};
const RENDER={region:()=>renderRegion(),mapa:()=>renderMap(),pais:()=>renderCountry(),piramides:()=>renderPyr(),indice:()=>renderCompare(),crecimiento:()=>renderGrowth(),maximo:()=>renderPeak(),fuentes:()=>{renderMatrix();renderLicenses();}};
function flushTab(){if(UI.dirty.delete(UI.tab))RENDER[UI.tab]();}
function touch(...tabs){(tabs.length?tabs:TABS).forEach(t=>UI.dirty.add(t));flushTab();}
const hashTab=()=>{const h=location.hash.slice(1);return TABS.includes(h)?h:'region';};
function tabFade(){const b=$('tabs');b.classList.toggle('more-l',b.scrollLeft>4);b.classList.toggle('more-r',b.scrollLeft+b.clientWidth<b.scrollWidth-4);}
function tabDom(id,instant){
  TABS.forEach(t=>{const on=t===id,b=$('t-'+t);b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;$('p-'+t).hidden=!on;});
  const bar=$('tabs'),b=$('t-'+id);bar.scrollTo({left:Math.max(0,b.offsetLeft-(bar.clientWidth-b.offsetWidth)/2),behavior:instant?'auto':'smooth'});tabFade();
}
function setTab(id,o){
  o=o||{};if(!TABS.includes(id))id='region';
  if(id===UI.tab)return;
  stopPlay();pyrStop();hideTip();UI.tab=id;tabDom(id);flushTab();
  const top=$('content').getBoundingClientRect().top+scrollY;if(scrollY>top)scrollTo(0,top);
  if(o.push!==false)try{history.pushState(null,'',location.pathname+location.search+'#'+id);}catch(e){}
  track('tab_view',{tab:id});
}
function wireTabs(){
  const bar=$('tabs');
  bar.addEventListener('click',e=>{const b=e.target.closest('.tab');if(b)setTab(b.dataset.tab);});
  bar.addEventListener('scroll',tabFade,{passive:true});
  bar.addEventListener('keydown',e=>{
    const i=TABS.indexOf(UI.tab),n=TABS.length,next={ArrowRight:(i+1)%n,ArrowLeft:(i-1+n)%n,Home:0,End:n-1}[e.key];
    if(next==null)return;e.preventDefault();setTab(TABS[next]);$('t-'+TABS[next]).focus();});
  addEventListener('popstate',()=>setTab(hashTab(),{push:false}));
  document.addEventListener('click',e=>{const b=e.target.closest('[data-go-tab]');if(b)setTab(b.dataset.goTab);});
}

/* ---------- CSV ---------- */
function downloadCSV(name,rows){
  if(!rows.length)return;
  const cols=[...new Set(rows.flatMap(r=>Object.keys(r)))];
  const q=v=>{const s=v==null?'':String(v);return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};
  const text='﻿'+[cols.join(',')].concat(rows.map(r=>cols.map(c=>q(r[c])).join(','))).join('\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/csv;charset=utf-8'}));a.download=name;
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),2000);
  track('csv_download',{file:name});
}
function csvRow(iso,r,extra){
  const s=segInfo(iso,r)||{};
  return Object.assign({iso3:iso,country:name(iso),year:r.year,population:r.population,series_type:r.series_type},extra||{},
    {growth:r.growth,source_id:r.source_id,source_tier:r.source_tier,institution:s.institution||'',vintage:r.vintage,reference_date:r.reference_date,scenario:r.scenario,
     retrieved_at:r.retrieved_at,interpolated:r.interpolated,raw_file:r.raw_file,source_url:s.source_url||'',attribution:(lic(s.license)||{}).attribution||''});
}

/* ---------- Mapa ---------- */
function buildMap(){
  const M=window.LATAM_MAP,svg=$('map');svg.setAttribute('viewBox',M.viewBox);
  $('ctxLayer').innerHTML=M.context.map(d=>`<path class="ctx" d="${d}"></path>`).join('');
  $('countryLayer').innerHTML=PopData.ISO3.map(i=>`<path class="c" data-iso="${i}" tabindex="0" role="button" d="${M.paths[i]}"></path>`).join('');
  $('hatchLayer').innerHTML=PopData.ISO3.map(i=>`<path data-hatch="${i}" fill="url(#hatch)" d="${M.paths[i]}" style="display:none"></path>`).join('');
  const lay=$('countryLayer');
  const show=(ev,iso)=>{const r=byYear(iso)[S.year];tip(ev,`<b>${esc(name(iso))}</b> · ${S.year}<br>`+(r?`${fmtN(r.population)} · ${esc(typeText(r.series_type))}<br>${esc((segInfo(iso,r)||{}).institution||'')} · ${esc(r.vintage)}`:esc(recs(iso).length?T('Sin dato para este año'):reason(iso))));};
  lay.addEventListener('mousemove',e=>{const i=e.target.dataset&&e.target.dataset.iso;if(i)show(e,i);});
  lay.addEventListener('mouseleave',hideTip);
  lay.addEventListener('click',e=>{const i=e.target.dataset&&e.target.dataset.iso;if(i)selectCountry(i);});
  lay.addEventListener('keydown',e=>{const i=e.target.dataset&&e.target.dataset.iso;if(i&&(e.key==='Enter'||e.key===' ')){e.preventDefault();selectCountry(i);}});
}
function renderMap(){
  $('yearOut').textContent=S.year;
  PopData.ISO3.forEach(iso=>{
    const r=byYear(iso)[S.year],p=document.querySelector(`path.c[data-iso="${iso}"]`),h=document.querySelector(`path[data-hatch="${iso}"]`);
    let fill=css('--none');
    if(r&&r.population!=null)fill=css(BINS.find(b=>r.population<b[0])[1]);
    p.setAttribute('fill',fill);p.classList.toggle('sel',iso===S.country);
    p.style.strokeDasharray=recs(iso).length?'':'3 2';
    h.style.display=r&&r.series_type==='projection'?'':'none';
    p.setAttribute('aria-label',`${name(iso)}, ${S.year}: `+(r?`${fmtN(r.population)}, ${typeText(r.series_type)}`:T('sin dato')));
  });
  $('mapLegend').innerHTML=BINS.map(b=>`<span class="lg"><span class="sw" style="background:var(${b[1]})"></span>${b[2]}</span>`).join('')
    +`<span class="lg"><svg width="18" height="12" aria-hidden="true"><rect width="18" height="12" rx="3" fill="var(--q3)"></rect><rect width="18" height="12" rx="3" fill="url(#hatch)"></rect></svg>${esc(T('Proyección'))}</span>`
    +`<span class="lg"><span class="sw" style="background:var(--none)"></span>${esc(T('Sin dato ese año o pendiente'))}</span>`;
  const rows=PopData.ISO3.map(i=>({iso:i,r:byYear(i)[S.year]}));
  const have=rows.filter(x=>x.r).sort((a,b)=>b.r.population-a.r.population),miss=rows.filter(x=>!x.r).sort((a,b)=>name(a.iso).localeCompare(name(b.iso),LOC()));
  const rp=regPoint(S.year);
  const regRow=rp?`<tr><td><b>${esc(name(REG))}</b></td><td class="n"><b>${fmtN(rp.population)}</b></td><td><span class="badge">${esc(T('Suma propia'))}</span></td><td class="src">${esc(F('Suma de las 20 cifras oficiales; {n} en proyección.',{n:rp.n_projection}))}</td></tr>`
    :(S.region&&miss.length?`<tr><td colspan="4" class="src full">${esc(F('Sin total regional en {y}: faltan {n} países ({c}).',{y:S.year,n:miss.length,c:nameList(miss.map(x=>x.iso))}))}</td></tr>`:'');
  $('yearTable').innerHTML=`<caption class="sr-only">${esc(F('Población por país en {y}',{y:S.year}))}</caption><thead><tr><th>${esc(T('País'))}</th><th class="n">${esc(T('Población'))}</th><th>${esc(T('Tipo'))}</th><th>${esc(T('Fuente'))}</th></tr></thead><tbody>`+regRow
   +have.map(({iso,r})=>{const s=segInfo(iso,r)||{};return `<tr class="click${iso===S.country?' sel':''}" data-iso="${iso}"><td>${esc(name(iso))}</td><td class="n">${fmtN(r.population)}${rp?`<br><span class="src">${fmtPct2(rp.shares[iso])}</span>`:''}</td><td><span class="badge${r.series_type==='projection'?' proj':''}">${esc(typeText(r.series_type))}</span></td><td class="src"><a href="${esc(s.source_url)}" rel="noopener">${esc(s.institution)}</a> · ${esc(r.vintage)} · ${esc(refText(r.reference_date))}${isCepal(r.source_tier)?` <span class="badge cepal">${esc(T('Fuente regional: CEPAL/CELADE'))}</span>`:''}</td></tr>`;}).join('')
   +miss.map(({iso})=>{const d=recs(iso);const span=d.length?F('Serie disponible: {a}–{b}',{a:d[0].year,b:d[d.length-1].year}):reason(iso);return `<tr class="click${iso===S.country?' sel':''}" data-iso="${iso}"><td>${esc(name(iso))}</td><td class="n">—</td><td><span class="badge warn">${esc(d.length?T('Sin dato'):T('Pendiente'))}</span></td><td class="src">${esc(span)}</td></tr>`;}).join('')+'</tbody>';
  const pr=byYear(S.country)[S.year],sh=regShare(S.country,S.year);
  $('mapPick').innerHTML=`<span><b>${esc(name(S.country))}</b> · ${S.year} · ${pr?fmtN(pr.population):esc(T('sin dato'))}${sh!=null?' · '+esc(F('{p} de la región',{p:fmtPct2(sh)})):''}</span><button type="button" class="btn" data-go-tab="pais">${esc(T('Ver el país'))} →</button>`;
}

/* ---------- Plotly (mismo paquete que /tasas-cambio/) ---------- */
const PLOTLY_SRC=['https://cdn.jsdelivr.net/npm/plotly.js-cartesian-dist-min@2.35.2/plotly-cartesian.min.js','https://cdn.plot.ly/plotly-cartesian-2.35.2.min.js'];
function loadPlotly(){
  if(S.plotly)return S.plotly;
  S.plotly=new Promise((res,rej)=>{let i=0;const next=()=>{if(i>=PLOTLY_SRC.length)return rej(new Error('Plotly'));const s=document.createElement('script');s.src=PLOTLY_SRC[i++];s.onload=()=>res(window.Plotly);s.onerror=next;document.head.appendChild(s);};next();});
  return S.plotly;
}
function baseLayout(){
  const wide=window.innerWidth>=700;
  return {paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{family:css('--font'),color:css('--text-soft'),size:12},
    margin:{l:wide?64:48,r:wide?24:10,t:18,b:wide?70:92},separators:LANG==='en'?'.,':',.',hovermode:'x unified',
    hoverlabel:{bgcolor:css('--surface'),bordercolor:css('--border'),font:{color:css('--text'),family:css('--font')}},
    legend:{orientation:'h',y:-0.14,x:0,font:{size:11}},
    xaxis:{gridcolor:css('--grid'),linecolor:css('--border'),tickformat:'d',fixedrange:true,zeroline:false},
    yaxis:{gridcolor:css('--grid'),linecolor:css('--border'),fixedrange:true,zeroline:false}};
}
const PCONF={displayModeBar:false,responsive:true};
function plotFail(id){$(id).innerHTML=`<p class="banner warn">${esc(T('La librería de gráficos no cargó. Los datos siguen disponibles en la tabla de abajo.'))}</p>`;const d=$(id).parentElement.querySelector('details');if(d)d.open=true;}

/* Parte una lista de registros en trazos: una por serie (fuente+vintage) y tipo. El tramo proyectado arranca en el último
   estimado de la MISMA serie para que no haya hueco visual; entre series distintas nunca hay línea. */
function splitTraces(rows){
  const groups=[];let cur=null;
  rows.forEach(r=>{if(!cur||cur.key!==segKey(r)){cur={key:segKey(r),rows:[],src:r};groups.push(cur);}cur.rows.push(r);});
  const out=[];
  groups.forEach(g=>{
    let prev=null;
    ['observed','estimate','projection'].forEach(t=>{
      const part=g.rows.filter(r=>r.series_type===t);
      if(!part.length)return;
      out.push({group:g,type:t,rows:(prev?[prev]:[]).concat(part)});
      prev=part[part.length-1];
    });
  });
  return out;
}

/* ---------- País ---------- */
function selectCountry(iso){
  S.country=iso;S.cagrA=null;S.cagrB=null;$('countrySel').value=iso;$('pyrCountry').value=iso;
  touch('region','mapa','pais','piramides','crecimiento');track('country_select',{iso3:iso});
}
function cagrText(iso){
  const by=byYear(iso),a=by[S.cagrA],b=by[S.cagrB];
  if(!a||!b||S.cagrB<=S.cagrA)return {v:'—',why:T('Elige dos años, el segundo posterior al primero.')};
  if(segKey(a)!==segKey(b))return {v:'—',why:T('No se calcula: los dos años están separados por una ruptura de serie.')};
  return {v:fmtPct(Math.pow(b.population/a.population,1/(S.cagrB-S.cagrA))-1),why:F('CAGR {a}–{b}, misma serie',{a:S.cagrA,b:S.cagrB})};
}
function peakText(iso){
  const p=(doc(iso)||{}).peak;
  if(!p||p.status==='no_projection')return {main:'—',sub:T('Sin proyección verificada')};
  if(p.status==='no_peak_in_horizon')return {main:T('No alcanza máximo en el horizonte'),sub:F('Horizonte: {y}',{y:p.horizon_end})};
  return {main:String(p.year),sub:(p.year<=NOW?T('Máximo ya alcanzado')+' · ':'')+fmtN(p.population)};
}
function renderCountry(){
  const iso=S.country,rows=recs(iso),box=$('countryChart'),tbl=$('countryTable');
  const opts=rows.map(r=>r.year);
  if(!rows.length){
    if(window.Plotly)try{Plotly.purge(box);}catch(e){}
    box.innerHTML=`<p class="banner warn"><b>${esc(name(iso))}.</b> ${esc(reason(iso))} ${esc(T('No se muestra ninguna cifra sin fuente verificada.'))}</p>`;
    box.style.minHeight='0';$('countryKpis').innerHTML='';$('countrySrc').innerHTML='';tbl.innerHTML='';
    $('cagrA').innerHTML='';$('cagrB').innerHTML='';$('csvCountry').disabled=true;return;
  }
  box.style.minHeight='';$('csvCountry').disabled=false;
  const curRow=rows.filter(r=>r.year<=NOW).pop()||rows[0];
  if(S.cagrA==null||!opts.includes(S.cagrA)){S.cagrA=curRow.year;const same=rows.filter(r=>segKey(r)===segKey(curRow));S.cagrB=same[same.length-1].year;if(S.cagrB===S.cagrA&&same.length>1)S.cagrA=same[0].year;}
  ['cagrA','cagrB'].forEach(id=>{$(id).innerHTML=opts.map(y=>`<option value="${y}"${y===S[id]?' selected':''}>${y}</option>`).join('');});
  const c=cagrText(iso),pk=peakText(iso);
  const ry=regCurrentYear(),rsh=regShare(iso,ry),gp=regCurrentPeriod(),regKpis=[];
  if(rsh!=null)regKpis.push([fmtPct2(rsh),F('Peso en la región en {y}',{y:ry})]);
  if(gp){const cr=gp.country_rates[iso];regKpis.push([fmtPct(cr),F('Crecimiento anual medio {a}–{b} · Región: {r}',{a:gp.from_year,b:gp.to_year,r:fmtPct(gp.rate)})+(cr==null?' · '+T('Este país cambia de serie en el periodo.'):'')]);}
  $('countryKpis').innerHTML=[[fmtN(curRow.population),F('Población {y} · {t}',{y:curRow.year,t:typeText(curRow.series_type)})],
    [fmtPct(curRow.growth),F('Crecimiento anual {y}',{y:curRow.year})],[c.v,c.why],[pk.main,T('Año de máxima población')+' · '+pk.sub]].concat(regKpis)
    .map(k=>`<div class="kpi"><b>${esc(k[0])}</b><span>${esc(k[1])}</span></div>`).join('');
  $('countrySrc').innerHTML=sourceBoxes(iso);
  tbl.innerHTML=`<caption class="sr-only">${esc(name(iso))}</caption><thead><tr><th>${esc(T('Año'))}</th><th class="n">${esc(T('Población'))}</th><th class="n">${esc(T('Crecimiento'))}</th><th>${esc(T('Tipo'))}</th><th>${esc(T('Fuente'))}</th><th>${esc(T('Archivo'))}</th></tr></thead><tbody>`
    +rows.map(r=>{const s=segInfo(iso,r)||{};return `<tr><td>${r.year}</td><td class="n">${fmtN(r.population)}</td><td class="n">${fmtPct(r.growth)}</td><td>${esc(typeText(r.series_type))}</td><td class="src">${esc(s.institution)} · ${esc(r.vintage)}</td><td class="src"><a href="${esc(blob(r.raw_file))}" rel="noopener">${esc(T('crudo'))}</a></td></tr>`;}).join('')+'</tbody>';
  box.setAttribute('aria-label',F('Serie de población de {c}. Los valores están en la tabla de abajo.',{c:name(iso)}));
  loadPlotly().then(()=>{
    if($('p-pais').hidden){UI.dirty.add('pais');return;}
    const palette=[css('--s1'),css('--s7'),css('--s3')];let n=0;const colors={};
    const data=splitTraces(rows).map(t=>{
      const k=t.group.key,cep=isCepal(t.group.src.source_tier);
      if(!colors[k])colors[k]=cep?css('--s4'):palette[n++%palette.length];
      const step=t.rows.length>1?(t.rows[t.rows.length-1].year-t.rows[0].year)/(t.rows.length-1):0;
      /* Censos separados por años: solo puntos, porque una línea sugeriría una serie que la fuente no publica. */
      const pointsOnly=step>=8;
      return {type:'scatter',mode:pointsOnly?'markers':((step>1.5||t.rows.length<3)?'lines+markers':'lines'),x:t.rows.map(r=>r.year),y:t.rows.map(r=>r.population),
        name:`${t.group.src.vintage} · ${typeText(t.type)}${cep?' · CEPAL':''}`,
        line:{color:colors[k],width:2,dash:t.type==='projection'?'dot':'solid'},marker:{size:8,color:colors[k]},
        customdata:t.rows.map(r=>[typeText(r.series_type),r.vintage,fmtPct(r.growth)]),
        hovertemplate:'%{y:,.0f} · %{customdata[0]} · %{customdata[1]} · %{customdata[2]}<extra></extra>'};
    });
    const L=baseLayout();L.yaxis.rangemode='tozero';L.yaxis.tickformat='~s';L.shapes=[];L.annotations=[];
    const fp=firstProj(iso),last=rows[rows.length-1].year;
    if(fp!=null)L.shapes.push({type:'rect',xref:'x',yref:'paper',x0:fp-.5,x1:last,y0:0,y1:1,fillcolor:css('--proj-bg'),line:{width:0},layer:'below'});
    (doc(iso).breaks||[]).forEach((b,i)=>{
      L.shapes.push({type:'line',xref:'x',yref:'paper',x0:b.year-.5,x1:b.year-.5,y0:0,y1:1,line:{color:css('--text-muted'),width:1.5,dash:'dash'}});
      L.annotations.push({xref:'x',yref:'paper',x:b.year-.5,y:1-i*.08,yanchor:'top',xanchor:'right',showarrow:false,bgcolor:css('--surface'),font:{size:11,color:css('--text-soft')},text:F('Ruptura {y}',{y:b.year})});
    });
    box.innerHTML='';Plotly.newPlot(box,data,L,PCONF);
  }).catch(()=>plotFail('countryChart'));
}
function sourceBoxes(iso){
  const merged={};
  doc(iso).segments.forEach(s=>{const k=s.source_id+'|'+s.vintage;
    if(!merged[k])merged[k]=Object.assign({},s,{files:[]});
    merged[k].year_from=Math.min(merged[k].year_from,s.year_from);merged[k].year_to=Math.max(merged[k].year_to,s.year_to);
    if(!merged[k].files.includes(s.raw_file))merged[k].files.push(s.raw_file);
    if(s.note&&!merged[k].notes)merged[k].notes=[];if(s.note&&!merged[k].notes.some(n=>n.es===s.note.es))merged[k].notes.push(s.note);
    if(!merged[k].url2&&s.source_url!==merged[k].source_url)merged[k].url2=s.source_url;});
  const breaks=(doc(iso).breaks||[]).map(b=>`<div class="srcbox"><b>${esc(F('Ruptura de serie en {y}:',{y:b.year}))}</b> ${esc(b.from_vintage)} → ${esc(b.to_vintage)} (${fmtN(b.last_value)} → ${fmtN(b.first_value)}). ${esc(T('Son fuentes o ediciones distintas: no se empalman ni se ajustan, y el crecimiento no se calcula a través de la ruptura.'))}</div>`).join('');
  const seenNotes=new Set();
  return Object.values(merged).map(s=>{const cep=isCepal(s.source_tier);
    s.notes=(s.notes||[]).filter(n=>{if(seenNotes.has(n.es))return false;seenNotes.add(n.es);return true;});
    const files=s.files.map((f,i)=>`<a href="${esc(blob(f))}" rel="noopener">${esc(s.files.length>1?F('archivo crudo {n}',{n:i+1}):T('archivo crudo'))}</a>`).join(' · ');
    const notes=(s.notes||[]).map(n=>`<br>${esc(n[LANG]||n.es)}`).join('');
    return `<div class="srcbox${cep?' cepal':''}">${cep?`<span class="badge cepal">${esc(T('Fuente regional: CEPAL/CELADE'))}</span> `:''}<b>${esc(s.institution)}</b> · ${esc(s.vintage)} · ${s.year_from}–${s.year_to} · ${esc(T('referencia:'))} ${esc(refText(s.reference_date))}<br><a href="${esc(s.source_url)}" rel="noopener">${esc(T('fuente'))}</a> · ${files} · ${esc(T('descargado:'))} ${esc(fmtDate(s.retrieved_at))}${s.retrieved_by==='manual'?' · '+esc(T('carga manual')):''}${s.license&&lic(s.license)?'<br>'+licLine(s.license):''}${notes}</div>`;
  }).join('')+breaks;
}

/* ---------- Pirámides ---------- */
const PYR={docs:{},loading:{},mode:'region',countries:[REG,'COL','BRA','GTM'],year:NOW,scale:'share',layout:'side',playing:null};
const PYR_MAX=4;
const pyrInfo=iso=>((S.status.countries||{})[iso]||{}).pyramid||{};
const pyrAvailable=iso=>isReg(iso)?!!(PYR.docs[REG]&&Object.keys(PYR.docs[REG].years).length):(pyrInfo(iso).years||0)>0;
const pyrList=()=>PYR.mode==='region'?[S.country,REG]:PYR.countries;
const pyrColor=(iso,slot)=>isReg(iso)?'var(--heading)':`var(${SLOTS[slot]})`;
const pick=o=>o&&(o[LANG]||o.es);
const sum=a=>a.reduce((x,y)=>x+y,0);
const pyrTotal=v=>sum(v.m)+sum(v.f);
function pyrLoad(iso){
  if(PYR.docs[iso]||PYR.loading[iso])return;
  PYR.loading[iso]=true;
  PopData.loadPyramid(iso).then(d=>{PYR.docs[iso]=d;}).catch(()=>{PYR.docs[iso]={error:true};}).finally(()=>{delete PYR.loading[iso];touch('piramides');});
}
const pyrAt=(iso,y)=>{const d=PYR.docs[iso];return d&&d.years?d.years[y]:null;};
const pyrYears=iso=>{const d=PYR.docs[iso];return d&&d.years?Object.keys(d.years).map(Number).sort((a,b)=>a-b):[];};
/* Tope estable en %: el mayor grupo de los países elegidos en todos sus años, para que la escala no salte al mover el año. */
function pyrShareMax(list){
  let mx=0;
  (list||PYR.countries).forEach(i=>{const d=PYR.docs[i];if(!d||!d.years)return;Object.values(d.years).forEach(v=>{const t=pyrTotal(v);v.m.concat(v.f).forEach(x=>{if(x/t>mx)mx=x/t;});});});
  return mx||.1;
}
function niceMax(v){const e=Math.pow(10,Math.floor(Math.log10(v)));const f=v/e;return [1,1.2,1.5,2,2.5,3,4,5,6,8,10].find(s=>f<=s)*e;}
const pyrFmt=v=>PYR.scale==='share'?fmtN(v*100,1)+' %':(v>=1e6?fmtN(v/1e6,1)+' M':v>=1e3?fmtN(v/1e3,0)+' k':fmtN(v));
function pyrFrame(max,rows,bars){
  const W=320,top=4,rowH=14,cg=34,half=(W-cg)/2,H=top+rowH*17+20;
  const xL=v=>half-(v/max)*half,xR=v=>half+cg+(v/max)*half;
  const ages=window.__ageGroups||[];
  let g='';
  [0,.5,1].forEach(f=>{const v=max*f;
    [xL(v),xR(v)].forEach(x=>{g+=`<line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${top}" y2="${top+rowH*17}" stroke="var(--grid)" stroke-width="1"></line>`;});
    /* En el borde el rótulo se ancla hacia adentro para que no se corte. */
    if(f>0)[[xL(v),f===1?'start':'middle'],[xR(v),f===1?'end':'middle']].forEach(([x,an])=>{g+=`<text x="${x.toFixed(1)}" y="${H-7}" text-anchor="${an}" font-size="9" fill="var(--text-muted)">${esc(pyrFmt(v))}</text>`;});
  });
  const labels=ages.map((a,i)=>`<text x="${W/2}" y="${top+rowH*(16-i)+rowH*.72}" text-anchor="middle" font-size="9" fill="var(--text-soft)">${esc(a)}</text>`).join('');
  const hits=ages.map((a,i)=>`<rect class="pyr-hit" data-i="${i}" x="0" y="${top+rowH*(16-i)}" width="${W}" height="${rowH}"></rect>`).join('');
  return {W,H,top,rowH,xL,xR,half,cg,inner:g+bars({xL,xR,top,rowH,half,cg,W})+labels+hits};
}
const pyrStep=(arr,t,x,top,rowH)=>{let d='';for(let i=0;i<17;i++){const X=x(arr[i]/t).toFixed(1),y1=top+rowH*(16-i),y2=y1+rowH;d+=(i?'L':'M')+X+','+y2+'L'+X+','+y1;}return d;};
function pyrSvg(iso,v,max,ref){
  const t=pyrTotal(v),val=x=>PYR.scale==='share'?x/t:x,proj=v.series_type==='projection',op=ref?' opacity=".62"':'';
  const f=pyrFrame(max,17,({xL,xR,top,rowH,half,cg})=>{
    let b='';
    for(let i=0;i<17;i++){
      const y=(top+rowH*(16-i)+1).toFixed(1),h=rowH-2,lm=xL(val(v.m[i])),rf=xR(val(v.f[i]));
      b+=`<rect x="${lm.toFixed(1)}" y="${y}" width="${(half-lm).toFixed(1)}" height="${h}" rx="1.5" fill="var(--s1)"${op}></rect>`;
      b+=`<rect x="${(half+cg).toFixed(1)}" y="${y}" width="${(rf-half-cg).toFixed(1)}" height="${h}" rx="1.5" fill="var(--s2)"${op}></rect>`;
      if(proj){b+=`<rect x="${lm.toFixed(1)}" y="${y}" width="${(half-lm).toFixed(1)}" height="${h}" fill="url(#hatch)"></rect><rect x="${(half+cg).toFixed(1)}" y="${y}" width="${(rf-half-cg).toFixed(1)}" height="${h}" fill="url(#hatch)"></rect>`;}
    }
    if(ref){const rt=pyrTotal(ref);b+=`<path d="${pyrStep(ref.m,rt,xL,top,rowH)}" fill="none" stroke="var(--heading)" stroke-width="2"></path><path d="${pyrStep(ref.f,rt,xR,top,rowH)}" fill="none" stroke="var(--heading)" stroke-width="2"></path>`;}
    return b;
  });
  const [y0,y1,y2]=pyrBroad(v);
  const lbl=F('Pirámide de {c} en {y}: {a} menores de 15 años, {b} de 65 años y más. Los valores están en la tabla de abajo.',{c:name(iso),y:PYR.year,a:fmtPct2(y0),b:fmtPct2(y2)});
  return `<svg viewBox="0 0 ${f.W} ${f.H}" data-iso="${iso}"${ref?' data-ref="1"':''} role="img" tabindex="0" aria-label="${esc(lbl)}">${f.inner}</svg>`;
}
const fmtPct2=p=>(p*100).toLocaleString(LOC(),{minimumFractionDigits:1,maximumFractionDigits:1})+' %';
function pyrBroad(v){const t=pyrTotal(v),s=(a,b)=>sum(v.m.slice(a,b))+sum(v.f.slice(a,b));return [s(0,3)/t,s(3,13)/t,s(13,17)/t];}
function pyrOverlaySvg(items,max){
  const f=pyrFrame(max,17,({xL,xR,top,rowH})=>items.map(it=>{
    const t=pyrTotal(it.v),col=pyrColor(it.iso,it.slot),dash=it.v.series_type==='projection'?' stroke-dasharray="3 2"':'',w=isReg(it.iso)?3:2;
    return `<path d="${pyrStep(it.v.m,t,xL,top,rowH)}" fill="none" stroke="${col}" stroke-width="${w}"${dash}></path><path d="${pyrStep(it.v.f,t,xR,top,rowH)}" fill="none" stroke="${col}" stroke-width="${w}"${dash}></path>`;
  }).join(''));
  return `<svg viewBox="0 0 ${f.W} ${f.H}" data-overlay="1" role="img" tabindex="0" aria-label="${esc(F('Pirámides superpuestas en {y}. Los valores están en la tabla de abajo.',{y:PYR.year}))}">${f.inner}</svg>`;
}
function pyrPart(iso,v){if(isReg(iso))return {institution:T('Suma propia de los 20 países'),source_url:'',raw_files:[]};const d=PYR.docs[iso];return (d.parts&&d.parts[v.part])||{institution:d.institution,license:d.license,source_url:d.source_url,raw_files:d.raw_files||[]};}
function pyrSource(iso,v){
  if(isReg(iso))return `<p class="src"><b>${esc(name(REG))}:</b> ${esc(F('suma propia de las 20 pirámides publicadas en {y}, con {n} países en proyección.',{y:PYR.year,n:v.n_projection}))}${v.regional_fallback.length?' '+esc(F('Incluye CEPAL/CELADE para {c}.',{c:nameList(v.regional_fallback)})):''}</p>`;
  const d=PYR.docs[iso],p=pyrPart(iso,v),fs=p.raw_files||[];
  const files=fs.map((f,i)=>`<a href="${esc(blob(f.path))}" rel="noopener">${esc(fs.length>1?F('archivo crudo {n}',{n:i+1}):T('archivo crudo'))}</a>`).join(' · ');
  return `<p class="src">${isCepal(v.source_tier)?`<span class="badge cepal">${esc(T('Fuente regional: CEPAL/CELADE'))}</span> `:''}<a href="${esc(p.source_url)}" rel="noopener">${esc(p.institution)}</a> · ${esc(v.vintage)} · ${esc(refText(v.reference_date))}${files?' · '+files:''}${lic(p.license)?'<br>'+licLine(p.license):''}${d.note?'<br>'+esc(pick(d.note)):''}</p>`;
}
function pyrEmpty(iso){
  const d=PYR.docs[iso];
  if(isReg(iso)){
    const ys=pyrYears(REG),miss=(d&&d.missing&&d.missing[PYR.year])||[];
    return `<p class="pyr-empty">${esc(miss.length?F('Sin pirámide regional en {y}: falta {c}. La región solo se compara cuando publican los 20 países.',{y:PYR.year,c:nameList(miss)}):F('Sin pirámide regional en {y}.',{y:PYR.year}))}<br>${ys.map(y=>`<button type="button" class="btn" data-go="${y}">${esc(F('Ver {y}',{y}))}</button>`).join(' ')}</p>`;
  }
  if(!d||PYR.loading[iso])return `<p class="pyr-empty">${esc(T('Cargando pirámide…'))}</p>`;
  if(d.error)return `<p class="pyr-empty">${esc(T('No se pudo cargar esta pirámide. Los demás datos siguen disponibles.'))}</p>`;
  const ys=pyrYears(iso);if(!ys.length)return `<p class="pyr-empty">${esc(pick(d.reason)||T('Sin datos disponibles.'))}</p>`;
  const near=ys.reduce((a,c)=>Math.abs(c-PYR.year)<Math.abs(a-PYR.year)?c:a);
  return `<p class="pyr-empty">${esc(F('Sin pirámide para {y}. Años disponibles: {a}–{b}.',{y:PYR.year,a:ys[0],b:ys[ys.length-1]}))}<br><button type="button" class="btn" data-go="${near}">${esc(F('Ver {y}',{y:near}))}</button></p>`;
}
function pyrRegionDoc(){
  const g=S.region&&S.region.pyramid;if(!g)return;
  const years={};
  Object.entries(g.years).forEach(([y,v])=>{years[y]=Object.assign({},v,{series_type:v.n_projection>v.n_countries/2?'projection':'estimate',source_id:'region_sum',source_tier:'derived',vintage:'',reference_date:''});});
  PYR.docs[REG]={age_groups:g.age_groups,years,missing:g.missing_by_year};
}
function pyrCompare(iso,v,R){
  const a=pyrBroad(v),b=pyrBroad(R),fem=x=>sum(x.f)/pyrTotal(x);
  const near=d=>Math.abs(d)<.0005;
  const pp=d=>(near(d)?'':d>0?'+':'−')+Math.abs(d*100).toLocaleString(LOC(),{minimumFractionDigits:1,maximumFractionDigits:1})+' pp';
  const more=(d,same)=>near(d)?T(same):(d>0?T('más'):T('menos'));
  const rows=[[T('Menores de 15'),a[0],b[0]],[T('15 a 64 años'),a[1],b[1]],[T('65 años y más'),a[2],b[2]],[T('Mujeres'),fem(v),fem(R)]];
  return `<p class="pyr-read">${esc(F('{c} tiene {d1} menores de 15 que la región ({a}) y {d2} personas de 65 años y más ({b}).',{c:name(iso),d1:more(a[0]-b[0],'casi los mismos'),a:pp(a[0]-b[0]),d2:more(a[2]-b[2],'casi las mismas'),b:pp(a[2]-b[2])}))}</p>`
    +`<table class="pyr-cmp"><caption class="sr-only">${esc(F('{c} frente a la región en {y}',{c:name(iso),y:PYR.year}))}</caption><thead><tr><th>${esc(T('% de la población'))}</th><th class="n">${esc(name(iso))}</th><th class="n">${esc(T('Región'))}</th><th class="n">${esc(T('Dif.'))}</th></tr></thead><tbody>`
    +rows.map(r=>`<tr><td>${esc(r[0])}</td><td class="n">${fmtPct2(r[1])}</td><td class="n">${fmtPct2(r[2])}</td><td class="n">${pp(r[1]-r[2])}</td></tr>`).join('')+'</tbody></table>';
}
function pyrRenderRegion(grid){
  const iso=S.country,v=pyrAt(iso,PYR.year),R=pyrAt(REG,PYR.year);
  $('pyrLegend').innerHTML=`<span class="lg"><span class="sw" style="background:var(--s1);opacity:.62"></span>${esc(T('Hombres'))}</span><span class="lg"><span class="sw" style="background:var(--s2);opacity:.62"></span>${esc(T('Mujeres'))}</span><span class="lg"><svg width="18" height="12" aria-hidden="true"><path d="M1 6H17" stroke="var(--heading)" stroke-width="2"></path></svg>${esc(name(REG))}</span><span class="lg"><svg width="18" height="12" aria-hidden="true"><rect width="18" height="12" rx="3" fill="var(--sx)"></rect><rect width="18" height="12" rx="3" fill="url(#hatch)"></rect></svg>${esc(T('Proyección'))}</span>`;
  grid.style.gridTemplateColumns='minmax(0,1fr)';
  const left=v?pyrSvg(iso,v,niceMax(pyrShareMax([iso,REG])),R||null):pyrEmpty(iso);
  const right=v&&R?pyrCompare(iso,v,R):(v?pyrEmpty(REG):'');
  grid.innerHTML=`<div class="pyr-panel pyr-one"><h3>${esc(F('{c} frente a la región',{c:name(iso)}))}${v?`<span class="badge${v.series_type==='projection'?' proj':''}">${esc(typeText(v.series_type))}</span>`:''}</h3><div class="pyr-one-body"><div>${left}</div><div>${right}</div></div>${v?pyrSource(iso,v):''}${R?pyrSource(REG,R):''}</div>`;
}
function renderPyr(){
  if(!S.status)return;
  const region=PYR.mode==='region',list=pyrList();
  list.forEach(pyrLoad);
  const loaded=list.concat(REG).find(i=>PYR.docs[i]&&PYR.docs[i].age_groups);
  if(loaded)window.__ageGroups=PYR.docs[loaded].age_groups;
  /* Comparar contra la región o superponer solo tiene sentido en porcentaje. */
  const saved=PYR.scale;if(region||PYR.layout==='overlay')PYR.scale='share';
  $('pyrYearOut').textContent=PYR.year;$('pyrYear').value=PYR.year;
  $('pyrMode').value=PYR.mode;$('pyrScale').value=saved;$('pyrLayout').value=PYR.layout;$('pyrCountry').value=S.country;
  $('pyrCountryField').hidden=!region;$('pyrLayoutField').hidden=region;$('pyrScaleField').hidden=region;$('pyrChipsWrap').hidden=region;
  $('pyrScale').disabled=PYR.layout==='overlay';
  $('pyrChips').innerHTML=[REG].concat(chipOrder(PYR.countries.filter(i=>!isReg(i)))).map(i=>{const on=PYR.countries.includes(i),ok=pyrAvailable(i);
    return `<button type="button" class="chip" data-iso="${i}" aria-pressed="${on}"${!ok||(!on&&PYR.countries.length>=PYR_MAX)?' disabled':''}${ok||isReg(i)?'':` title="${esc(pick(pyrInfo(i).reason)||'')}"`}>${on&&PYR.layout==='overlay'?`<span class="dot" style="background:${pyrColor(i,PYR.countries.indexOf(i))}"></span>`:''}${esc(name(i))}</button>`;}).join('');
  const grid=$('pyrGrid');
  if(region)pyrRenderRegion(grid);
  else if(PYR.layout==='overlay'){
    const items=PYR.countries.map((iso,slot)=>({iso,slot,v:pyrAt(iso,PYR.year)})).filter(x=>x.v);
    const miss=PYR.countries.filter(i=>!pyrAt(i,PYR.year));
    $('pyrLegend').innerHTML=`<span class="lg">${esc(T('Izquierda: hombres · Derecha: mujeres'))}</span>`+items.map(x=>`<span class="lg"><span class="dot" style="background:${pyrColor(x.iso,x.slot)}"></span>${esc(name(x.iso))}${x.v.series_type==='projection'?' ('+esc(T('proyección'))+')':''}</span>`).join('');
    grid.style.gridTemplateColumns='minmax(0,1fr)';
    grid.innerHTML=`<div class="pyr-panel" style="max-width:640px;margin:0 auto;width:100%">${items.length?pyrOverlaySvg(items,niceMax(pyrShareMax())):pyrEmpty(PYR.countries[0])}${items.map(x=>pyrSource(x.iso,x.v).replace('<p class="src">',`<p class="src"><b>${esc(name(x.iso))}:</b> `)).join('')}${miss.map(i=>`<p class="src"><b>${esc(name(i))}:</b> ${esc(F('sin dato para {y}',{y:PYR.year}))}</p>`).join('')}</div>`;
  }else{
    grid.style.gridTemplateColumns='';
    $('pyrLegend').innerHTML=`<span class="lg"><span class="sw" style="background:var(--s1)"></span>${esc(T('Hombres'))}</span><span class="lg"><span class="sw" style="background:var(--s2)"></span>${esc(T('Mujeres'))}</span><span class="lg"><svg width="18" height="12" aria-hidden="true"><rect width="18" height="12" rx="3" fill="var(--sx)"></rect><rect width="18" height="12" rx="3" fill="url(#hatch)"></rect></svg>${esc(T('Proyección'))}</span>`;
    const shared=niceMax(pyrShareMax());
    grid.innerHTML=PYR.countries.map(iso=>{
      const v=pyrAt(iso,PYR.year);
      if(!v)return `<div class="pyr-panel"><h3>${esc(name(iso))}</h3>${pyrEmpty(iso)}</div>`;
      const b=pyrBroad(v);
      const mx=PYR.scale==='share'?shared:niceMax(Math.max(...v.m,...v.f));
      return `<div class="pyr-panel"><h3>${esc(name(iso))}<span class="badge${v.series_type==='projection'?' proj':''}">${esc(typeText(v.series_type))}</span></h3>`
        +`<p class="pyr-stats">${esc(F('Población: {p}',{p:fmtN(pyrTotal(v))}))}<br>${esc(F('{a} menores de 15 · {b} de 15 a 64 · {c} de 65 y más',{a:fmtPct2(b[0]),b:fmtPct2(b[1]),c:fmtPct2(b[2])}))}</p>`
        +pyrSvg(iso,v,mx)+pyrSource(iso,v)+`</div>`;
    }).join('');
  }
  $('pyrNote').textContent=PYR.scale==='abs'?T('En personas, cada pirámide usa su propia escala: compara su forma, no su tamaño. Para comparar países entre sí usa porcentajes.'):T('Último grupo: 80 años y más, el común a todas las fuentes. Las fechas de referencia difieren entre países; cada panel declara la suya.');
  const ages=window.__ageGroups||[];
  const withV=list.map(i=>({i,v:pyrAt(i,PYR.year)})).filter(x=>x.v);
  $('pyrTable').innerHTML=`<caption class="sr-only">${esc(F('Población por edad y sexo en {y}',{y:PYR.year}))}</caption><thead><tr><th>${esc(T('Edad'))}</th>${withV.map(x=>`<th class="n">${esc(name(x.i))} · ${esc(T('H'))}</th><th class="n">${esc(name(x.i))} · ${esc(T('M'))}</th>`).join('')}</tr></thead><tbody>`
    +ages.map((a,k)=>({a,k})).reverse().map(({a,k})=>`<tr><td>${esc(a)}</td>${withV.map(x=>{const t=pyrTotal(x.v),f=n=>PYR.scale==='share'?fmtPct2(n/t):fmtN(n);return `<td class="n">${f(x.v.m[k])}</td><td class="n">${f(x.v.f[k])}</td>`;}).join('')}</tr>`).join('')+'</tbody>';
  $('pyrPending').innerHTML=ISOS().filter(i=>!pyrAvailable(i)).map(i=>`<li><b>${esc(name(i))}:</b> ${esc(pick(pyrInfo(i).reason)||T('Sin datos disponibles.'))}</li>`).join('');
  $('pyrPending').closest('details').hidden=!ISOS().some(i=>!pyrAvailable(i));
  $('csvPyr').disabled=!withV.length;
  PYR.scale=saved;
}
function pyrTip(ev,svg){
  const r=ev.target.closest&&ev.target.closest('[data-i]');if(!r)return hideTip();
  const k=+r.dataset.i,a=(window.__ageGroups||[])[k];
  const compared=svg.dataset.overlay||svg.dataset.ref;
  const list=compared?pyrList().map(i=>({i,v:pyrAt(i,PYR.year)})).filter(x=>x.v):[{i:svg.dataset.iso,v:pyrAt(svg.dataset.iso,PYR.year)}];
  tip(ev,`<b>${esc(a)}</b> · ${PYR.year}<br>`+list.map(x=>{const t=pyrTotal(x.v);return `${compared?esc(name(x.i))+'<br>':''}${esc(T('Hombres'))}: ${fmtN(x.v.m[k])} (${fmtPct2(x.v.m[k]/t)})<br>${esc(T('Mujeres'))}: ${fmtN(x.v.f[k])} (${fmtPct2(x.v.f[k]/t)})`;}).join('<br>'));
}
function pyrStop(){if(PYR.playing){clearInterval(PYR.playing);PYR.playing=null;const b=$('pyrPlay');b.dataset.es='▶ Recorrer';b.textContent=T('▶ Recorrer');}}
function wirePyr(){
  const infos=PopData.ISO3.map(pyrInfo).filter(x=>x.years);
  const minY=Math.min(...infos.map(x=>x.year_from)),maxY=Math.max(...infos.map(x=>x.year_to));
  const yr=$('pyrYear');yr.min=minY;yr.max=maxY;PYR.year=Math.min(maxY,Math.max(minY,DEFAULT_YEAR));
  PYR.countries=PYR.countries.filter(pyrAvailable);
  if(!pyrAvailable(REG)){PYR.mode='multi';$('pyrMode').querySelector('[value=region]').disabled=true;}
  $('pyrMode').addEventListener('change',e=>{PYR.mode=e.target.value;renderPyr();track('pyramid_mode',{mode:PYR.mode});});
  $('pyrCountry').addEventListener('change',e=>selectCountry(e.target.value));
  yr.addEventListener('input',()=>{pyrStop();PYR.year=+yr.value;renderPyr();});
  $('pyrScale').addEventListener('change',e=>{PYR.scale=e.target.value;renderPyr();});
  $('pyrLayout').addEventListener('change',e=>{PYR.layout=e.target.value;renderPyr();track('pyramid_layout',{layout:PYR.layout});});
  $('pyrPlay').addEventListener('click',()=>{
    if(PYR.playing)return pyrStop();
    if(PYR.year>=maxY)PYR.year=minY;
    const b=$('pyrPlay');b.dataset.es='❚❚ Pausa';b.textContent=T('❚❚ Pausa');
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    PYR.playing=setInterval(()=>{PYR.year=Math.min(maxY,PYR.year+(reduce?10:1));renderPyr();if(PYR.year>=maxY)pyrStop();},reduce?900:220);
    track('pyramid_play');
  });
  $('pyrChips').addEventListener('click',e=>{const c=e.target.closest('.chip');if(!c||c.disabled)return;const i=c.dataset.iso;
    PYR.countries=PYR.countries.includes(i)?PYR.countries.filter(x=>x!==i):PYR.countries.concat(i);track('pyramid_country',{iso3:i});renderPyr();});
  const grid=$('pyrGrid');
  grid.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b){PYR.year=+b.dataset.go;renderPyr();return;}const s=e.target.closest&&e.target.closest('svg');if(s)pyrTip(e,s);});
  grid.addEventListener('pointermove',e=>{const s=e.target.closest&&e.target.closest('svg');if(s)pyrTip(e,s);});
  grid.addEventListener('pointerleave',hideTip);
  $('csvPyr').addEventListener('click',()=>{
    const ages=window.__ageGroups||[];
    const rows=[];pyrList().forEach(i=>{const v=pyrAt(i,PYR.year),d=PYR.docs[i];if(!v)return;const t=pyrTotal(v);
      ages.forEach((a,k)=>[['m',v.m[k]],['f',v.f[k]]].forEach(([s,n])=>rows.push({iso3:i,country:name(i),year:PYR.year,age_group:a,sex:s==='m'?'male':'female',population:n,share_of_total:n/t,series_type:v.series_type,source_id:v.source_id,source_tier:v.source_tier,institution:pyrPart(i,v).institution,vintage:v.vintage,reference_date:v.reference_date,source_url:pyrPart(i,v).source_url,raw_files:(pyrPart(i,v).raw_files||[]).map(f=>f.path).join(' | ')})));});
    downloadCSV(`piramides-${PYR.year}.csv`,rows);
  });
}

/* ---------- Comparador base 100 ---------- */
function slotOf(iso){if(S.slots[iso]==null){const used=new Set(S.compare.map(i=>S.slots[i]));for(let i=0;i<SLOTS.length;i++)if(!used.has(i)){S.slots[iso]=i;break;}}return S.slots[iso];}
function indexed(iso){
  const base=byYear(iso)[S.base];if(!base||!base.population)return null;
  return recs(iso).filter(r=>segKey(r)===segKey(base)).map(r=>Object.assign({},r,{index:r.population/base.population*100}));
}
function renderCompare(){
  const chips=$('compareChips'),hasReg=regPoints().length>0,regOn=S.compareRegion&&hasReg;
  chips.innerHTML=`<button type="button" class="chip" data-iso="${REG}" aria-pressed="${regOn}"${hasReg?'':' disabled'}>${regOn?'<span class="dot" style="background:var(--heading)"></span>':''}${esc(name(REG))}</button>`+chipOrder(S.compare).map(i=>{const on=S.compare.includes(i),none=!recs(i).length;
    return `<button type="button" class="chip" data-iso="${i}" aria-pressed="${on}"${none||(!on&&S.compare.length>=SLOTS.length)?' disabled':''}${none?` title="${esc(reason(i))}"`:''}>${on?`<span class="dot" style="background:var(${SLOTS[slotOf(i)]})"></span>`:''}${esc(name(i))}</button>`;}).join('');
  const series=S.compare.map(i=>({iso:i,rows:indexed(i)}));
  const ok=series.filter(s=>s.rows),bad=series.filter(s=>!s.rows);
  const regIdx=regOn?(S.region.index[String(S.base)]||null):null,msgs=[];
  if(bad.length)msgs.push(F('Sin dato en {y}, no se dibuja: {c}.',{y:S.base,c:bad.map(s=>name(s.iso)).join(', ')}));
  if(regOn&&!regIdx)msgs.push(F('La región solo tiene total en {list}: elige uno de esos años como base para verla.',{list:regPoints().map(p=>p.year).join(', ')}));
  if(regIdx){const ns=regIdx.map(r=>r.n_countries);msgs.push(F('Región: cada punto compara solo los países con la misma serie en el año base y en ese año ({a} a {b} de 20).',{a:Math.min(...ns),b:Math.max(...ns)}));}
  $('compareExcluded').textContent=msgs.join(' ');
  $('compareSrc').innerHTML=ok.map(s=>{const seg=segInfo(s.iso,s.rows[0])||{};return `<b>${esc(name(s.iso))}:</b> <a href="${esc(seg.source_url)}" rel="noopener">${esc(seg.institution)}</a> · ${esc(s.rows[0].vintage)}${isCepal(s.rows[0].source_tier)?' · '+esc(T('Fuente regional: CEPAL/CELADE')):''}`;}).join(' &nbsp;|&nbsp; ');
  const years=[...new Set(ok.flatMap(s=>s.rows.map(r=>r.year)).concat(regIdx?regIdx.map(r=>r.year):[]))].sort((a,b)=>a-b);
  $('compareTable').innerHTML=`<thead><tr><th>${esc(T('Año'))}</th>${regIdx?`<th class="n">${esc(T('Región'))}</th>`:''}${ok.map(s=>`<th class="n">${esc(name(s.iso))}</th>`).join('')}</tr></thead><tbody>`
    +years.map(y=>{const rr=regIdx&&regIdx.find(x=>x.year===y);return `<tr><td>${y}</td>${regIdx?`<td class="n">${rr?fmtN(rr.index,1):'—'}</td>`:''}${ok.map(s=>{const r=s.rows.find(x=>x.year===y);return `<td class="n">${r?fmtN(r.index,1)+(r.series_type==='projection'?' *':''):'—'}</td>`;}).join('')}</tr>`;}).join('')+`</tbody><caption class="src" style="caption-side:bottom;text-align:left">${esc(T('* Proyección'))}</caption>`;
  const box=$('compareChart');box.setAttribute('aria-label',F('Índice base 100 en {y}. Los valores están en la tabla de abajo.',{y:S.base}));
  if(!ok.length&&!regIdx){box.innerHTML=`<p class="banner warn">${esc(T('Ningún país elegido tiene dato en ese año. Elige otro año base.'))}</p>`;box.style.minHeight='0';return;}
  box.style.minHeight='';
  loadPlotly().then(()=>{
    if($('p-indice').hidden){UI.dirty.add('indice');return;}
    const data=[];const L=baseLayout();L.shapes=[];L.annotations=[];
    const wide=window.innerWidth>=700&&ok.length<=4;if(wide)L.margin.r=110;
    /* Por defecto, la ventana de la región: con 1950-2070 las diferencias contra ella no se leen. */
    const pts=regPoints(),win=S.compareRange==='common'&&regIdx&&pts.length?[pts[0].year,pts[pts.length-1].year]:null,inWin=r=>!win||(r.year>=win[0]&&r.year<=win[1]);
    const shown=ok.map(s=>({iso:s.iso,rows:s.rows.filter(inWin)})).filter(s=>s.rows.length);
    shown.forEach(s=>{const col=css(SLOTS[S.slots[s.iso]]);
      splitTraces(s.rows).forEach((t,i)=>data.push({type:'scatter',mode:t.rows.length<8?'lines+markers':'lines',x:t.rows.map(r=>r.year),y:t.rows.map(r=>r.index),
        name:name(s.iso),legendgroup:s.iso,showlegend:i===0,line:{color:col,width:2,dash:t.type==='projection'?'dot':'solid'},marker:{size:8,color:col},
        customdata:t.rows.map(r=>[name(s.iso),typeText(r.series_type)]),hovertemplate:'%{customdata[0]}: %{y:.1f} · %{customdata[1]}<extra></extra>'}));
      if(wide){const e=s.rows[s.rows.length-1];L.annotations.push({x:e.year,y:e.index,xanchor:'left',yanchor:'middle',showarrow:false,xshift:6,yshift:0,text:name(s.iso),font:{size:11,color:css('--text-soft')}});}
    });
    if(regIdx){const col=css('--heading');
      data.push({type:'scatter',mode:'lines+markers',x:regIdx.map(r=>r.year),y:regIdx.map(r=>r.index),name:T('Región'),line:{color:col,width:3.5},marker:{size:9,color:col,symbol:'diamond'},
        customdata:regIdx.map(r=>[r.n_countries,r.excluded.length?nameList(r.excluded):'—']),hovertemplate:`${esc(T('Región'))}: %{y:.1f} · %{customdata[0]}/20<extra></extra>`});
      if(wide){const e=regIdx[regIdx.length-1];L.annotations.push({x:e.year,y:e.index,xanchor:'left',yanchor:'middle',showarrow:false,xshift:8,yshift:0,text:T('Región'),font:{size:11,color:css('--heading')}});}
    }
    /* Etiquetas al final de cada línea: separa las que quedarían una encima de otra. */
    const allY=shown.flatMap(s=>s.rows.map(r=>r.index)).concat(regIdx?regIdx.map(r=>r.index):[]),span=(Math.max(...allY)-Math.min(...allY))||1;
    L.annotations.sort((a,b)=>a.y-b.y).forEach((n,i,arr)=>{if(i&&Math.abs(n.x-arr[i-1].x)<8&&(n.y-arr[i-1].y)/span<.05)n.yshift=(arr[i-1].yshift||0)+13;});
    const fps=shown.map(s=>{const r=s.rows.find(x=>x.series_type==='projection');return r?r.year:null;}).filter(y=>y!=null);
    if(regIdx){const q=regPoints().find(p=>p.n_projection>p.n_countries/2);if(q)fps.push(q.year);}
    const xmax=win?win[1]:Math.max(...years);
    if(fps.length)L.shapes.push({type:'rect',xref:'x',yref:'paper',x0:Math.min(...fps)-.5,x1:xmax,y0:0,y1:1,fillcolor:css('--proj-bg'),line:{width:0},layer:'below'});
    L.shapes.push({type:'line',xref:'paper',x0:0,x1:1,y0:100,y1:100,line:{color:css('--text-muted'),width:1}});
    box.innerHTML='';Plotly.newPlot(box,data,L,PCONF);
  }).catch(()=>plotFail('compareChart'));
}

/* ---------- Gráficos pequeños ---------- */
const GR={period:null,range:'common'};
function renderGrowth(){renderGrowthRank();renderMultiples();}
function growthPeriod(){const ps=regPeriods();if(!ps.length)return null;return ps.find(p=>p.from_year===GR.period)||regCurrentPeriod();}
function renderGrowthRank(){
  const g=growthPeriod(),box=$('growthRank'),ps=regPeriods();
  $('growthPeriods').innerHTML=ps.map(p=>`<button type="button" class="chip" data-from="${p.from_year}" aria-pressed="${g&&p.from_year===g.from_year}">${p.from_year}–${p.to_year}</button>`).join('');
  $('csvGrowthPeriods').disabled=!g;
  if(!g){box.innerHTML=`<p class="banner warn">${esc(T(NO_REGION))}</p>`;$('growthRankNote').textContent='';$('growthPeriodTable').innerHTML='';return;}
  const rows=ISOS().map(iso=>({iso,r:g.country_rates[iso]})).filter(x=>x.r!=null).sort((a,b)=>b.r-a.r);
  const W=Math.min(760,Math.max(300,box.clientWidth||340)),rowH=24,top=26,labelW=Math.min(150,Math.max(128,W*.33)),valW=58,H=top+rowH*rows.length+4;
  const vals=rows.map(x=>x.r).concat(g.rate,0),lo=Math.min(...vals),hi=Math.max(...vals);
  const X=v=>labelW+(v-lo)/((hi-lo)||1)*(W-labelW-valW);
  const zero=X(0),rx=X(g.rate),anchor=rx>W-90?'end':(rx<labelW+60?'start':'middle');
  const bars=rows.map((x,i)=>{const y=top+rowH*i,x0=Math.min(zero,X(x.r)),w=Math.max(1.5,Math.abs(X(x.r)-zero)),sel=x.iso===S.country;
    return `<text x="${labelW-6}" y="${y+rowH*.68}" text-anchor="end" font-size="12" fill="var(--text${sel?'':'-soft'})"${sel?' font-weight="700"':''}>${esc(x.iso==='DOM'&&W<420?T('Rep. Dominicana'):name(x.iso))}</text>`
      +`<rect x="${x0.toFixed(1)}" y="${y+5}" width="${w.toFixed(1)}" height="${rowH-10}" rx="3" fill="var(${sel?'--s2':'--s1'})"></rect>`
      +`<text x="${W}" y="${y+rowH*.68}" text-anchor="end" font-size="12" fill="var(--text)" style="font-variant-numeric:tabular-nums">${fmtPct(x.r)}</text>`
      +`<rect class="bar-hit" data-iso="${x.iso}" x="0" y="${y}" width="${W}" height="${rowH}"></rect>`;}).join('');
  box.innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(F('Crecimiento anual medio {a}–{b} por país. Región: {r}. Los valores están en la tabla de abajo.',{a:g.from_year,b:g.to_year,r:fmtPct(g.rate)}))}">`
    +`<line x1="${zero.toFixed(1)}" x2="${zero.toFixed(1)}" y1="${top-4}" y2="${H-2}" stroke="var(--border)" stroke-width="1"></line>`+bars
    +`<line x1="${rx.toFixed(1)}" x2="${rx.toFixed(1)}" y1="${top-6}" y2="${H-2}" stroke="var(--heading)" stroke-width="2"></line>`
    +`<text x="${rx.toFixed(1)}" y="13" text-anchor="${anchor}" font-size="12" font-weight="700" fill="var(--heading)">${esc(F('Región {r}',{r:fmtPct(g.rate)}))}</text></svg>`;
  const cover=F('Región: {n} de 20 países, {p} de la población del periodo.',{n:g.n_countries,p:fmtPct2(g.covers_share)});
  $('growthRankNote').textContent=cover+(g.excluded.length?' '+F('Sin tasa comparable por cambio de serie: {c}.',{c:g.excluded.map(e=>`${name(e.iso3)} (${e.from_vintage} → ${e.to_vintage})`).join(', ')}):'');
  $('growthPeriodTable').innerHTML=`<caption class="sr-only">${esc(T('Crecimiento anual medio por quinquenio'))}</caption><thead><tr><th>${esc(T('País'))}</th>${ps.map(p=>`<th class="n">${p.from_year}–${String(p.to_year).slice(2)}</th>`).join('')}</tr></thead><tbody>`
    +`<tr><td><b>${esc(name(REG))}</b></td>${ps.map(p=>`<td class="n"><b>${fmtPct(p.rate)}</b></td>`).join('')}</tr>`
    +ISOS().map(iso=>`<tr><td>${esc(name(iso))}</td>${ps.map(p=>`<td class="n">${fmtPct(p.country_rates[iso])}</td>`).join('')}</tr>`).join('')+'</tbody>';
}
function renderMultiples(){
  const W=200,H=84,pts=regPoints(),common=GR.range==='common'&&pts.length>0,periods=regPeriods();
  const x0=common?pts[0].year:1950,x1=common?pts[pts.length-1].year:2100,inRange=y=>y>=x0&&y<=x1;
  const annual=iso=>recs(iso).filter(r=>r.growth!=null&&inRange(r.year));
  const quin=iso=>periods.map(g=>({a:g.from_year,b:g.to_year,r:g.country_rates[iso]})).filter(q=>q.r!=null);
  const noAnnual=PopData.ISO3.filter(i=>recs(i).length&&!annual(i).length&&quin(i).length);
  const all=PopData.ISO3.flatMap(i=>annual(i).map(r=>r.growth)).concat(periods.map(g=>g.rate),noAnnual.flatMap(i=>quin(i).map(q=>q.r)));
  const ymax=all.length?Math.max(...all):.04,ymin=all.length?Math.min(0,...all):-.01;
  const X=y=>(y-x0)/(x1-x0)*W,Y=v=>H-6-(v-ymin)/((ymax-ymin)||1)*(H-12);
  const regLine=periods.map(g=>`<path d="M${X(g.from_year).toFixed(1)},${Y(g.rate).toFixed(1)}L${X(g.to_year).toFixed(1)},${Y(g.rate).toFixed(1)}" fill="none" stroke="var(--heading)" stroke-width="1.6"></path>`).join('');
  $('multiples').innerHTML=`<div class="legend" style="grid-column:1/-1;margin-top:0"><span class="lg"><svg width="18" height="12" aria-hidden="true"><path d="M1 6H17" stroke="var(--s1)" stroke-width="2"></path></svg>${esc(T('País'))}</span><span class="lg"><svg width="18" height="12" aria-hidden="true"><path d="M1 6H17" stroke="var(--heading)" stroke-width="2"></path></svg>${esc(T('Región: media de cada quinquenio'))}</span></div>`
    +`<p class="src" style="grid-column:1/-1">${esc(F('Escala común: {a} a {b} · eje horizontal {c}–{d}.',{a:fmtPct(ymin,1),b:fmtPct(ymax,1),c:x0,d:x1}))}${noAnnual.length?' '+esc(F('{c} solo publica cada cinco años: se muestra su media quinquenal.',{c:nameList(noAnnual)})):''}</p>`+ISOS().map(iso=>{
    const rows=recs(iso);
    if(!rows.length)return `<div class="mini"><h3>${esc(name(iso))}<span class="badge warn">${esc(T('Pendiente'))}</span></h3><p class="why">${esc(reason(iso))}</p></div>`;
    const withG=annual(iso);
    const fp=firstProj(iso);let parts='';let cur=[],curKey=null;
    const flush=()=>{if(cur.length>1){const d=cur.map((r,i)=>(i?'L':'M')+X(r.year).toFixed(1)+','+Y(r.growth).toFixed(1)).join('');const pr=cur[cur.length-1].series_type==='projection';parts+=`<path d="${d}" fill="none" stroke="var(--s1)" stroke-width="1.5"${pr?' stroke-dasharray="2 2"':''}></path>`;}else if(cur.length===1){parts+=`<circle cx="${X(cur[0].year).toFixed(1)}" cy="${Y(cur[0].growth).toFixed(1)}" r="1.2" fill="var(--s1)"></circle>`;}cur=[];};
    withG.forEach((r,i)=>{const prev=withG[i-1];const k=segKey(r)+r.series_type;
      if(prev&&(r.year!==prev.year+1||curKey!==k)){const carry=(prev&&r.year===prev.year+1&&segKey(prev)===segKey(r))?prev:null;flush();if(carry)cur.push(carry);}
      curKey=k;cur.push(r);});
    flush();
    if(noAnnual.includes(iso))parts=quin(iso).map(q=>`<path d="M${X(q.a).toFixed(1)},${Y(q.r).toFixed(1)}L${X(q.b).toFixed(1)},${Y(q.r).toFixed(1)}" fill="none" stroke="var(--s1)" stroke-width="1.5"></path>`).join('');
    const brk=(doc(iso).breaks||[]).filter(b=>inRange(b.year)).map(b=>`<line x1="${X(b.year-.5).toFixed(1)}" x2="${X(b.year-.5).toFixed(1)}" y1="2" y2="${H-2}" stroke="var(--text-muted)" stroke-dasharray="2 2" stroke-width="1"></line>`).join('');
    const lastY=Math.min(x1,rows[rows.length-1].year),fx=fp==null?null:Math.max(x0,fp);
    const shade=fx!=null&&fx<lastY?`<rect x="${X(fx).toFixed(1)}" y="0" width="${(X(lastY)-X(fx)).toFixed(1)}" height="${H}" fill="var(--proj-bg)"></rect>`:'';
    const cepal=rows.some(r=>isCepal(r.source_tier));
    const cur0=withG.filter(r=>r.year<=NOW).pop();
    const lbl=F('{c}: crecimiento anual de {a} a {b}. Valor reciente {v}.',{c:name(iso),a:rows[0].year,b:rows[rows.length-1].year,v:cur0?fmtPct(cur0.growth):'—'});
    const empty=!withG.length&&!noAnnual.includes(iso);
    return `<div class="mini"><h3>${esc(name(iso))}${cepal?'<span class="badge cepal" title="'+esc(T('Fuente regional: CEPAL/CELADE'))+'">CEPAL</span>':''}</h3>`
      +`<svg viewBox="0 0 ${W} ${H}" data-iso="${iso}" tabindex="0" role="img" aria-label="${esc(lbl)}">${shade}<line x1="0" x2="${W}" y1="${Y(0).toFixed(1)}" y2="${Y(0).toFixed(1)}" stroke="var(--border)" stroke-width="1"></line>${brk}${regLine}${parts}${empty?`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="9" fill="var(--text-muted)">${esc(T('Sin tramo anual'))}</text>`:''}</svg></div>`;
  }).join('');
  $('multiples').querySelectorAll('svg[data-iso]').forEach(svg=>{
    const show=e=>{const b=svg.getBoundingClientRect(),y=Math.round(x0+(e.clientX-b.left)/b.width*(x1-x0)),iso=svg.dataset.iso;
      const g=periods.find(p=>y>p.from_year&&y<=p.to_year),regTxt=g?`<br>${esc(F('Región {a}–{b}: {r}',{a:g.from_year,b:g.to_year,r:fmtPct(g.rate)}))}`:'';
      const rows=annual(iso);
      if(!rows.length){const q=quin(iso).find(x=>y>x.a&&y<=x.b);if(!q)return hideTip();return tip(e,`<b>${esc(name(iso))}</b> · ${q.a}–${q.b}<br>${fmtPct(q.r)} · ${esc(T('media quinquenal'))}${regTxt}`);}
      const r=rows.reduce((a,c)=>Math.abs(c.year-y)<Math.abs(a.year-y)?c:a);const s=segInfo(iso,r)||{};tip(e,`<b>${esc(name(iso))}</b> · ${r.year}<br>${fmtPct(r.growth)} · ${esc(typeText(r.series_type))}<br>${esc(s.institution)} · ${esc(r.vintage)}${regTxt}`);};
    svg.addEventListener('pointermove',show);svg.addEventListener('click',show);
    svg.addEventListener('pointerleave',hideTip);
  });
  const ys=[1960,1980,2000,2010,2020,2025,2030,2040,2050];
  $('growthTable').innerHTML=`<thead><tr><th>${esc(T('País'))}</th>${ys.map(y=>`<th class="n">${y}</th>`).join('')}</tr></thead><tbody>`
    +ISOS().map(iso=>{const by=byYear(iso);return `<tr><td>${esc(name(iso))}</td>${ys.map(y=>`<td class="n">${by[y]?fmtPct(by[y].growth):'—'}</td>`).join('')}</tr>`;}).join('')+'</tbody>';
}

/* ---------- Año máximo ---------- */
function renderPeak(){
  const items=ISOS().map(iso=>({iso,p:(doc(iso)||{}).peak})).sort((a,b)=>{const v=x=>x.p&&x.p.status==='peak'?x.p.year:(x.p&&x.p.status==='no_peak_in_horizon'?9000+x.p.horizon_end:99999);return v(a)-v(b);});
  $('peakTable').innerHTML=`<thead><tr><th>${esc(T('País'))}</th><th>${esc(T('Año de máxima población'))}</th><th class="n">${esc(T('Población'))}</th><th class="n">${esc(T('Horizonte'))}</th><th>${esc(T('Fuente'))}</th></tr></thead><tbody>`
   +items.map(({iso,p})=>{
     if(!p||p.status==='no_projection')return `<tr><td>${esc(name(iso))}</td><td colspan="4" class="src">${esc(reason(iso))}</td></tr>`;
     const r=recs(iso).find(x=>x.source_id===p.source_id&&x.series_type==='projection')||recs(iso)[0];const s=segInfo(iso,r)||{};
     return `<tr><td>${esc(name(iso))}</td><td>${p.status==='peak'?`<b>${p.year}</b>${p.year<=NOW?` <span class="badge">${esc(T('ya alcanzado'))}</span>`:''}`:esc(T('No alcanza máximo en el horizonte'))}</td><td class="n">${fmtN(p.population)}</td><td class="n">${p.horizon_end}</td><td class="src"><a href="${esc(s.source_url)}" rel="noopener">${esc(s.institution)}</a> · ${esc(r.vintage)}${isCepal(r.source_tier)?` <span class="badge cepal">${esc(T('Fuente regional: CEPAL/CELADE'))}</span>`:''}</td></tr>`;
   }).join('')+'</tbody>';
  const lastReg=regPoints().length?regPoints()[regPoints().length-1].year:null;
  $('peakRegion').textContent=lastReg?F('La región no tiene año máximo calculable: su última cifra con los 20 países es {y} y no todas las proyecciones llegan más lejos.',{y:lastReg}):'';
}

/* ---------- Transparencia ---------- */
function renderMatrix(){
  const cell=(e,label)=>{
    if(!e)return `<td data-th="${esc(label)}">—</td>`;
    const pick=o=>o&&(o[LANG]||o.es);
    const tier=e.source_tier==='regional_fallback'?`<span class="badge cepal">${esc(T('Fuente regional: CEPAL/CELADE'))}</span>`:(e.status==='pendiente'?`<span class="badge">${esc(T('Sin fuente verificada'))}</span>`:`<span class="badge">${esc(T('Nacional'))}</span>`);
    const msg=pick(e.reason);
    return `<td data-th="${esc(label)}"><span class="badge ${statusClass(e.status)}">${esc(statusLabel(e.status))}</span> ${tier}<div class="src"><a href="${esc(e.url)}" rel="noopener">${esc(e.institution)}</a>${e.vintage?' · '+esc(e.vintage):''}<br>${esc(T('Última fecha:'))} ${esc(fmtDate(e.retrieved_at))}${e.status==='stale'&&e.error?'<br>'+esc(e.error):''}${msg?'<br>'+esc(msg):''}</div></td>`;
  };
  const h=T('Serie histórica'),p=T('Proyección');
  $('matrix').innerHTML=`<caption class="sr-only">${esc(T('Panel de transparencia'))}</caption><thead><tr><th>${esc(T('País'))}</th><th>${esc(h)}</th><th>${esc(p)}</th></tr></thead><tbody>`
    +ISOS().map(iso=>{const c=(S.status.countries||{})[iso]||{series:{}};return `<tr><td class="iso">${esc(name(iso))}</td>${cell(c.series.historical,h)}${cell(c.series.projection,p)}</tr>`;}).join('')+'</tbody>';
}

/* ---------- Licencias ---------- */
const lic=k=>S.lic&&S.lic.licenses&&S.lic.licenses[k];
const LIC_ORDER=['restricted','no_license','own_terms','open_license'];
const licLabel=s=>({open_license:T('Licencia abierta'),own_terms:T('Condiciones propias'),no_license:T('Sin licencia localizada'),restricted:T('Restringe')}[s]||s);
const licClass=s=>({open_license:'ok',no_license:'warn',restricted:'err'}[s]||'');
const licHow=h=>({direct:T('Leído en la fuente'),browser:T('Leído en navegador'),in_file:T('Aviso dentro del archivo'),search_excerpt:T('Solo extracto de buscador'),provided_by_owner:T('Texto aportado por Javier Forero')}[h]||'');
const licLine=k=>{const l=lic(k);return `${esc(T('Condiciones:'))} <a href="${esc(l.license_url||l.terms_url)}" rel="noopener">${esc(T(l.name))}</a> · ${esc(l.attribution)}`;};
function renderLicenses(){
  const box=$('licBox');
  if(!S.lic){box.innerHTML=S.licFailed?`<p>${esc(T('No se pudo cargar la revisión de términos.'))} <a href="${esc(blob('data/processed/licenses.json'))}" rel="noopener">licenses.json</a></p>`:`<p>${esc(T('Cargando datos…'))}</p>`;return;}
  const all=Object.values(S.lic.licenses),n=s=>all.filter(l=>l.status===s).length,pick=o=>o&&(o[LANG]||o.es);
  const rows=all.slice().sort((a,b)=>LIC_ORDER.indexOf(a.status)-LIC_ORDER.indexOf(b.status)||a.institution.localeCompare(b.institution,LOC()));
  const hI=T('Institución'),hS=T('Estado'),hW=T('Qué dice'),hC=T('Cita');
  box.innerHTML=`<p>${esc(F('Revisado el {d}: {a} instituciones con licencia abierta, {b} con condiciones propias, {c} sin licencia localizada y {e} que restringe la reutilización.',{d:fmtDate(S.lic.review.reviewed),a:n('open_license'),b:n('own_terms'),c:n('no_license'),e:n('restricted')}))} ${esc(pick(S.lic.review.caveat))}</p>`
    +rows.filter(l=>l.status==='restricted').map(l=>`<div class="srcbox cepal"><b>${esc(l.institution)}:</b> ${esc(pick(l.summary))}</div>`).join('')
    +`<details><summary>${esc(T('Ver las condiciones de cada institución'))}</summary><div class="tablewrap" tabindex="0" role="region"><table id="licTable" class="matrix"><caption class="sr-only">${esc(T('Licencias y atribución'))}</caption><thead><tr><th>${esc(hI)}</th><th>${esc(hS)}</th><th>${esc(hW)}</th><th>${esc(hC)}</th></tr></thead><tbody>`
    +rows.map(l=>`<tr><td class="iso">${esc(l.institution)}<div class="src">${esc(l.countries.map(name).join(', '))}</div></td><td data-th="${esc(hS)}"><span class="badge ${licClass(l.status)}">${esc(licLabel(l.status))}</span><div class="src">${esc(licHow(l.read_how))}</div></td><td data-th="${esc(hW)}">${esc(pick(l.summary))} <a href="${esc(l.terms_url)}" rel="noopener">${esc(T('ver texto'))}</a>${l.license_url&&l.license_url!==l.terms_url?` · <a href="${esc(l.license_url)}" rel="noopener">${esc(T('ver licencia'))}</a>`:''}</td><td data-th="${esc(hC)}">${esc(l.attribution)}</td></tr>`).join('')
    +'</tbody></table></div></details>';
}

/* ---------- Encabezado ---------- */
function renderHead(){
  const withData=PopData.ISO3.filter(i=>recs(i).length);
  const series=PopData.ISO3.flatMap(i=>Object.values(((S.status.countries||{})[i]||{series:{}}).series));
  const live=series.filter(s=>s.retrieved_at);
  const dates=live.map(s=>s.retrieved_at).sort();const last=S.status.last_data_update||dates[dates.length-1];
  const pd=$('pillDate');delete pd.dataset.es;pd.removeAttribute('data-i18n');pd.textContent=F('Última actualización: {d}',{d:fmtDate(last)});
  $('pillCoverage').textContent=F('{n} de 20 países con datos',{n:withData.length});
  const nat=live.filter(s=>s.source_tier==='national').length,reg=live.filter(s=>s.source_tier==='regional_fallback').length;
  $('pillTier').textContent=F('{n} series nacionales · {r} con CEPAL de respaldo',{n:nat,r:reg});
  const stale=series.filter(s=>s.status==='stale').length;
  const b=$('banner');
  if(S.fromCache){b.hidden=false;b.className='banner warn';b.textContent=F('No se pudo leer el repositorio de datos. Se muestran los últimos datos guardados en este navegador, con fecha {d}.',{d:fmtDate(last)});}
  else if(S.failed.length){b.hidden=false;b.className='banner warn';b.textContent=F('No cargaron estos países: {c}. El resto está al día.',{c:S.failed.join(', ')});}
  else if(stale){b.hidden=false;b.className='banner warn';b.textContent=F('Series con su último dato válido porque la fuente no respondió en la última corrida: {n}. Revisa el panel de transparencia.',{n:stale});}
  else b.hidden=true;
  $('footOrigin').textContent=T('Datos:')+' github.com/jaforero/latam-population-official';
}

/* ---------- Región ---------- */
const REGION={year:null,all:false};
function renderRegion(){
  const pts=regPoints(),has=pts.length>0;
  $('regionEmpty').hidden=has;$('regionBody').hidden=!has;$('regionSpan').textContent='';
  if(!has)return;
  if(REGION.year==null||!regPoint(REGION.year))REGION.year=regCurrentYear();
  const y=REGION.year,p=regPoint(y),ps=regPeriods(),g=ps.find(x=>x.from_year===y)||ps.find(x=>x.to_year===y);
  const top=Object.entries(p.shares).sort((a,b)=>b[1]-a[1]);
  $('regionSpan').textContent=F('Años con total: {list}.',{list:pts.map(x=>x.year).join(', ')});
  $('regionKpis').innerHTML=[
    [fmtM(p.population),F('Población en {y} · {n} de 20 países',{y,n:p.n_countries})],
    [g?fmtPct(g.rate):'—',g?F('Crecimiento anual medio {a}–{b} · {n} de 20 países comparables',{a:g.from_year,b:g.to_year,n:g.n_countries}):''],
    [fmtPct2(top[0][1]+top[1][1]),F('{a} y {b} en el total de {y}',{a:name(top[0][0]),b:name(top[1][0]),y})],
    [F('{n} de 20',{n:p.n_projection}),F('países con cifra proyectada en {y}',{y})]
  ].map(k=>`<div class="kpi"><b>${esc(k[0])}</b><span>${esc(k[1])}</span></div>`).join('');
  renderRegionBars();
  $('regionWeightsTitle').textContent=F('Cuánto pesa cada país en {y}',{y});
  const mx=top[0][1];
  $('regionWeights').innerHTML=(REGION.all?top:top.slice(0,6)).map(([iso,s])=>`<li><button type="button" class="wrow${iso===S.country?' sel':''}" data-iso="${iso}" aria-label="${esc(F('{c}: {p} de la región en {y}. Ver el país.',{c:name(iso),p:fmtPct2(s),y}))}"><span class="wname">${esc(name(iso))}</span><span class="wtrack"><span class="wbar" style="width:${(s/mx*100).toFixed(1)}%"></span></span><span class="wval">${fmtPct2(s)}</span></button></li>`).join('');
  const more=$('regionMore');more.textContent=REGION.all?T('Ver menos'):T('Ver los 20 países');more.setAttribute('aria-expanded',String(REGION.all));
  const odd=p.components.filter(c=>!['07-01','06-30','mid-year'].includes(c.reference_date));
  const notes=[T('Funciona como una media ponderada por población: los países grandes mueven más el total. No es el promedio simple de 20 países.')];
  if(p.regional_fallback.length)notes.push(F('En {y} incluye series de CEPAL/CELADE para {c}, cuyo permiso de reutilización falta confirmar. Sin esas cifras no habría total de los 20 países.',{y,c:nameList(p.regional_fallback)}));
  if(odd.length)notes.push(F('No todas las cifras van a mitad de año: {c}.',{c:odd.map(c=>`${name(c.iso3)} (${refText(c.reference_date)})`).join(', ')}));
  if(g&&g.excluded.length)notes.push(F('Entre {a} y {b}, {c} cambia de serie: queda fuera del crecimiento, pero su cifra oficial sí suma en cada total.',{a:g.from_year,b:g.to_year,c:nameList(g.excluded.map(e=>e.iso3))}));
  notes.push(T('Es una base derivada que combina fuentes con condiciones de uso distintas, incluidas CC BY-SA y ODbL: cada cifra conserva las de su fuente. Ver la pestaña Fuentes.'));
  const li=a=>a.map(n=>`<li>${esc(n)}</li>`).join('');
  $('regionNotes').innerHTML=li(notes.slice(0,2));$('regionNotesMore').innerHTML=li(notes.slice(2));
  const nxt=q=>ps.find(x=>x.from_year===q.year);
  $('regionTable').innerHTML=`<caption class="sr-only">${esc(T('Total regional por año'))}</caption><thead><tr><th>${esc(T('Año'))}</th><th class="n">${esc(T('Población'))}</th><th class="n">${esc(T('Países'))}</th><th class="n">${esc(T('En proyección'))}</th><th>${esc(T('Con CEPAL/CELADE'))}</th><th class="n">${esc(T('Crecimiento anual medio hasta el siguiente'))}</th><th class="n">${esc(T('Países en esa tasa'))}</th></tr></thead><tbody>`
    +pts.map(q=>{const n=nxt(q);return `<tr><td>${q.year}</td><td class="n">${fmtN(q.population)}</td><td class="n">${q.n_countries}</td><td class="n">${q.n_projection}</td><td class="src">${esc(nameList(q.regional_fallback))}</td><td class="n">${n?fmtPct(n.rate):'—'}</td><td class="n">${n?n.n_countries:'—'}</td></tr>`;}).join('')+'</tbody>';
}
function renderRegionBars(){
  const pts=regPoints(),box=$('regionBars'),W=Math.max(300,box.clientWidth||340),H=196,top=22,bot=24,band=W/pts.length,bw=Math.min(46,band*.68);
  const max=Math.max(...pts.map(p=>p.population)),Y=v=>top+(1-v/max)*(H-top-bot),base=H-bot;
  const path=(x,y)=>{const r=Math.min(4,bw/2);return `M${x.toFixed(1)},${base}V${(y+r).toFixed(1)}Q${x.toFixed(1)},${y.toFixed(1)} ${(x+r).toFixed(1)},${y.toFixed(1)}H${(x+bw-r).toFixed(1)}Q${(x+bw).toFixed(1)},${y.toFixed(1)} ${(x+bw).toFixed(1)},${(y+r).toFixed(1)}V${base}Z`;};
  box.innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="group" aria-label="${esc(T('Población total de la región por año. Los valores están en la tabla de abajo.'))}"><line x1="0" x2="${W}" y1="${base}" y2="${base}" stroke="var(--border)" stroke-width="1"></line>`
    +pts.map((p,i)=>{const x=band*i+(band-bw)/2,y=Y(p.population),sel=p.year===REGION.year,d=path(x,y),proj=p.n_projection>p.n_countries/2;
      return `<path d="${d}" fill="${sel?'var(--primary)':'color-mix(in srgb,var(--primary) 42%,var(--surface))'}"></path>${proj?`<path d="${d}" fill="url(#hatch)"></path>`:''}`
        +`<text x="${(band*i+band/2).toFixed(1)}" y="${(y-6).toFixed(1)}" text-anchor="middle" font-size="12" fill="var(--text)"${sel?' font-weight="700"':''}>${fmtN(p.population/1e6,0)}</text>`
        +`<text x="${(band*i+band/2).toFixed(1)}" y="${H-7}" text-anchor="middle" font-size="12" fill="var(--text${sel?'':'-soft'})"${sel?' font-weight="700"':''}>${p.year}</text>`
        +`<rect class="bar-hit" data-year="${p.year}" x="${(band*i).toFixed(1)}" y="0" width="${band.toFixed(1)}" height="${H}" tabindex="0" role="button" aria-pressed="${sel}" aria-label="${esc(F('{y}: {p} de personas, {n} de 20 países en proyección.',{y:p.year,p:fmtM(p.population),n:p.n_projection}))}"></rect>`;}).join('')+'</svg>';
  $('regionLegend').innerHTML=`<span class="lg">${esc(T('Millones de personas'))}</span><span class="lg"><svg width="18" height="12" aria-hidden="true"><rect width="18" height="12" rx="3" fill="var(--q3)"></rect><rect width="18" height="12" rx="3" fill="url(#hatch)"></rect></svg>${esc(T('Mayoría de países en proyección'))}</span>`;
}
function wireRegion(){
  const bars=$('regionBars');
  const pickYear=y=>{REGION.year=y;track('region_year',{year:y});renderRegion();};
  bars.addEventListener('click',e=>{const b=e.target.closest('[data-year]');if(b)pickYear(+b.dataset.year);});
  bars.addEventListener('keydown',e=>{const b=e.target.closest('[data-year]');if(b&&(e.key==='Enter'||e.key===' ')){e.preventDefault();pickYear(+b.dataset.year);}});
  bars.addEventListener('pointermove',e=>{const b=e.target.closest&&e.target.closest('[data-year]');if(!b)return hideTip();const p=regPoint(+b.dataset.year);tip(e,`<b>${p.year}</b> · ${fmtN(p.population)}<br>${esc(F('{n} de 20 países en proyección',{n:p.n_projection}))}${p.regional_fallback.length?'<br>'+esc(F('Con CEPAL/CELADE: {c}',{c:nameList(p.regional_fallback)})):''}`);});
  bars.addEventListener('pointerleave',hideTip);
  $('regionWeights').addEventListener('click',e=>{const b=e.target.closest('[data-iso]');if(b){selectCountry(b.dataset.iso);setTab('pais');}});
  $('regionMore').addEventListener('click',()=>{REGION.all=!REGION.all;renderRegion();});
  $('csvRegion').addEventListener('click',()=>{
    const rows=[];const nx=y=>regPeriods().find(g=>g.from_year===y);
    regPoints().forEach(p=>{const g=nx(p.year);
      rows.push({year:p.year,scope:'REG',country:name(REG),population:p.population,share_of_region:1,series_type:'',source_id:'region_sum',source_tier:'',vintage:'',reference_date:'',license:'',raw_file:'',n_countries:p.n_countries,n_projection:p.n_projection,annual_rate_to_next:g?g.rate:'',countries_in_rate:g?g.n_countries:'',excluded_from_rate:g?g.excluded.map(e=>e.iso3).join(' '):''});
      p.components.forEach(c=>rows.push({year:p.year,scope:c.iso3,country:name(c.iso3),population:c.population,share_of_region:p.shares[c.iso3],series_type:c.series_type,source_id:c.source_id,source_tier:c.source_tier,vintage:c.vintage,reference_date:c.reference_date,license:c.license||'',raw_file:c.raw_file}));});
    downloadCSV('poblacion-region-20-paises.csv',rows);
  });
  $('growthPeriods').addEventListener('click',e=>{const c=e.target.closest('[data-from]');if(c){GR.period=+c.dataset.from;track('growth_period',{from:GR.period});renderGrowthRank();}});
  const rank=$('growthRank');
  rank.addEventListener('click',e=>{const b=e.target.closest('[data-iso]');if(b)selectCountry(b.dataset.iso);});
  rank.addEventListener('pointermove',e=>{const b=e.target.closest&&e.target.closest('[data-iso]');const g=growthPeriod();if(!b||!g)return hideTip();tip(e,`<b>${esc(name(b.dataset.iso))}</b> · ${g.from_year}–${g.to_year}<br>${fmtPct(g.country_rates[b.dataset.iso])}<br>${esc(T('Región'))}: ${fmtPct(g.rate)}`);});
  rank.addEventListener('pointerleave',hideTip);
  $('growthRange').addEventListener('change',e=>{GR.range=e.target.value;renderMultiples();});
  $('csvGrowthPeriods').addEventListener('click',()=>downloadCSV('poblacion-crecimiento-quinquenal.csv',regPeriods().flatMap(g=>[{scope:'REG',country:name(REG),from_year:g.from_year,to_year:g.to_year,annual_rate:g.rate,region_rate:g.rate,countries_in_rate:g.n_countries,share_of_population:g.covers_share,excluded:g.excluded.map(e=>e.iso3).join(' ')}].concat(PopData.ISO3.map(i=>({scope:i,country:name(i),from_year:g.from_year,to_year:g.to_year,annual_rate:g.country_rates[i],region_rate:g.rate}))))));
}

/* ---------- Tooltip ---------- */
const tipEl=()=>$('tip');
function tip(ev,html){const t=tipEl();t.innerHTML=html;t.style.display='block';const r=t.getBoundingClientRect();let x=ev.clientX+12,y=ev.clientY+12;if(x+r.width>innerWidth-8)x=ev.clientX-r.width-12;if(x<8)x=8;if(y+r.height>innerHeight-8)y=ev.clientY-r.height-12;t.style.left=x+'px';t.style.top=y+'px';}
function hideTip(){tipEl().style.display='none';}

function renderAll(){
  renderHead();
  const sel=$('countrySel');sel.innerHTML=ISOS().map(i=>`<option value="${i}">${esc(name(i))}${recs(i).length?'':' · '+esc(T('pendiente'))}</option>`).join('');sel.value=S.country;
  const pc=$('pyrCountry');pc.innerHTML=ISOS().filter(pyrAvailable).map(i=>`<option value="${i}">${esc(name(i))}</option>`).join('');pc.value=S.country;
  touch();
}
function stopPlay(){if(S.playing){clearInterval(S.playing);S.playing=null;const b=$('playBtn');b.dataset.es='▶ Recorrer';b.textContent=T('▶ Recorrer');}}

function wire(){
  const yr=$('yearRange');
  const allY=PopData.ISO3.flatMap(i=>recs(i).map(r=>r.year));
  const minY=Math.min(...allY),maxY=Math.max(...allY);yr.min=minY;yr.max=maxY;S.year=Math.min(maxY,Math.max(minY,DEFAULT_YEAR));yr.value=S.year;
  yr.addEventListener('input',()=>{stopPlay();S.year=+yr.value;renderMap();});
  $('playBtn').addEventListener('click',()=>{
    if(S.playing)return stopPlay();
    if(S.year>=maxY){S.year=minY;}
    const b=$('playBtn');b.dataset.es='❚❚ Pausa';b.textContent=T('❚❚ Pausa');
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    S.playing=setInterval(()=>{S.year=Math.min(maxY,S.year+(reduce?10:1));yr.value=S.year;renderMap();if(S.year>=maxY)stopPlay();},reduce?900:160);
    track('map_play');
  });
  $('yearTable').addEventListener('click',e=>{const tr=e.target.closest('tr[data-iso]');if(tr&&!e.target.closest('a'))selectCountry(tr.dataset.iso);});
  $('countrySel').addEventListener('change',e=>selectCountry(e.target.value));
  $('cagrA').addEventListener('change',e=>{S.cagrA=+e.target.value;renderCountry();});
  $('cagrB').addEventListener('change',e=>{S.cagrB=+e.target.value;renderCountry();});
  const baseSel=$('baseYear');baseSel.innerHTML=Array.from({length:2070-1950+1},(_,i)=>1950+i).map(y=>`<option value="${y}">${y}</option>`).join('');baseSel.value=S.base;
  baseSel.addEventListener('change',e=>{S.base=+e.target.value;renderCompare();});
  $('compareRange').addEventListener('change',e=>{S.compareRange=e.target.value;renderCompare();});
  $('compareChips').addEventListener('click',e=>{const c=e.target.closest('.chip');if(!c||c.disabled)return;const i=c.dataset.iso;
    if(i===REG){S.compareRegion=!S.compareRegion;renderCompare();return;}
    if(S.compare.includes(i)){S.compare=S.compare.filter(x=>x!==i);delete S.slots[i];}else{S.compare.push(i);slotOf(i);}renderCompare();});
  $('csvMap').addEventListener('click',()=>downloadCSV(`poblacion-latam-${S.year}.csv`,PopData.ISO3.flatMap(i=>{const r=byYear(i)[S.year];return r?[csvRow(i,r)]:[];})));
  $('csvCountry').addEventListener('click',()=>downloadCSV(`poblacion-${S.country}.csv`,recs(S.country).map(r=>csvRow(S.country,r))));
  $('csvCompare').addEventListener('click',()=>downloadCSV(`poblacion-indice-base-${S.base}.csv`,S.compare.flatMap(i=>(indexed(i)||[]).map(r=>csvRow(i,r,{index_base_100:r.index,base_year:S.base}))).concat(S.compareRegion&&S.region?(S.region.index[String(S.base)]||[]).map(r=>({iso3:REG,country:name(REG),year:r.year,index_base_100:r.index,base_year:S.base,countries_in_index:r.n_countries,excluded_from_index:r.excluded.join(' ')})):[])));
  $('csvGrowth').addEventListener('click',()=>downloadCSV('poblacion-latam-crecimiento.csv',PopData.ISO3.flatMap(i=>recs(i).filter(r=>r.growth!=null).map(r=>csvRow(i,r)))));
  let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{touch('region','pais','indice','crecimiento');tabFade();},250);});
  addEventListener('scroll',hideTip,{passive:true});
}

function showFatal(err){
  const b=$('banner');b.hidden=false;b.className='banner error';
  b.innerHTML=`<b>${esc(T('No se pudieron cargar los datos.'))}</b> ${esc(F('Ni el repositorio de datos ni su respaldo respondieron. El último dato publicado que conoce esta página es del {d}. No se muestra ningún gráfico porque no hay cifras verificadas que dibujar.',{d:fmtDate(PopData.PUBLISHED_DATA_DATE)}))} <button type="button" class="btn" id="retry">${esc(T('Reintentar'))}</button>`;
  const p=$('pillDate');p.removeAttribute('data-i18n');delete p.dataset.es;p.textContent=T('Sin conexión con los datos');p.className='pill err';
  $('retry').addEventListener('click',()=>location.reload());
  if(window.console)console.error(err);
}

document.addEventListener('DOMContentLoaded',()=>{
  applyTheme(document.documentElement.getAttribute('data-theme')||'light',true);
  LANG=window.__lang0==='en'?'en':'es';i18nStatic();
  $('langToggle').addEventListener('click',e=>{const o=e.target.closest('.lang-opt');if(o)applyLang(o.dataset.lang,false);});
  $('themeToggle').addEventListener('click',()=>{applyTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark');if(S.status)touch();});
  const q=(()=>{try{return new URLSearchParams(location.search).get('datos');}catch(e){return null;}})();
  /* ?datos=prueba-error simula una caída para revisar el mensaje; no afecta a nadie más. */
  PopData.loadAll(q==='prueba-error'?{sources:['https://raw.githubusercontent.com/jaforero/latam-population-official/main/no-existe']}:{}).then(r=>{
    S.status=r.status;S.region=r.region;S.countries=r.countries;S.failed=r.failed;S.fromCache=r.fromCache;
    S.compare=S.compare.filter(i=>recs(i).length);S.compare.forEach(slotOf);
    if(!recs(S.country).length)S.country=PopData.ISO3.find(i=>recs(i).length);
    pyrRegionDoc();buildMap();wire();wirePyr();wireRegion();wireTabs();
    /* El rótulo sale de los datos; sin total regional solo queda la serie completa. */
    ['compareRange','growthRange'].forEach(id=>{const sel=$(id),o=sel.querySelector('[value=common]'),p=regPoints();
      if(p.length)o.textContent=`${p[0].year}–${p[p.length-1].year}`;else{o.remove();sel.value='all';}});
    $('content').hidden=false;UI.tab=hashTab();tabDom(UI.tab,true);renderAll();
    PopData.loadLicenses().then(d=>{S.lic=d;}).catch(()=>{S.licFailed=true;}).finally(()=>touch('fuentes','pais','piramides'));
  }).catch(showFatal);
});
