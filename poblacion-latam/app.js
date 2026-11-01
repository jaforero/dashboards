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

const S={status:null,countries:{},failed:[],fromCache:false,year:NOW,country:'COL',compare:['COL','BRA','ARG','PER'],slots:{},base:2025,cagrA:null,cagrB:null,playing:null,plotly:null};
const SLOTS=['--s1','--s2','--s3','--s4','--s5','--s6','--s7'];
const BINS=[[5e6,'--q1','< 5 M'],[1e7,'--q2','5–10 M'],[2e7,'--q3','10–20 M'],[5e7,'--q4','20–50 M'],[1e8,'--q5','50–100 M'],[Infinity,'--q6','≥ 100 M']];

/* ---------- Acceso a datos ---------- */
const doc=iso=>S.countries[iso];
const recs=iso=>(doc(iso)&&doc(iso).records)||[];
const byYear=iso=>{const m={};recs(iso).forEach(r=>{m[r.year]=r;});return m;};
const name=iso=>{const c=(S.status.countries||{})[iso]||doc(iso)||{};return LANG==='en'?(c.name_en||iso):(c.name_es||iso);};
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

/* ---------- Idioma y tema ---------- */
function i18nStatic(){
  document.documentElement.lang=LANG;
  document.querySelectorAll('[data-i18n]').forEach(n=>{if(n.dataset.es==null)n.dataset.es=n.textContent.trim();n.textContent=T(n.dataset.es);});
  document.querySelectorAll('.lang-opt').forEach(o=>o.setAttribute('aria-pressed',String(o.dataset.lang===LANG)));
  document.title=LANG==='en'?(TR.__title||window.__titleEs):window.__titleEs;
  const m=$('map');if(m)m.setAttribute('aria-label',T('Mapa de población de América Latina'));
  const g=$('langToggle');if(g)g.setAttribute('aria-label',T('Idioma'));
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

/* ---------- CSV ---------- */
function downloadCSV(name,rows){
  if(!rows.length)return;
  const cols=Object.keys(rows[0]);
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
     retrieved_at:r.retrieved_at,interpolated:r.interpolated,raw_file:r.raw_file,source_url:s.source_url||''});
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
  $('yearTable').innerHTML=`<caption class="sr-only">${esc(F('Población por país en {y}',{y:S.year}))}</caption><thead><tr><th>${esc(T('País'))}</th><th class="n">${esc(T('Población'))}</th><th>${esc(T('Tipo'))}</th><th>${esc(T('Fuente'))}</th></tr></thead><tbody>`
   +have.map(({iso,r})=>{const s=segInfo(iso,r)||{};return `<tr class="click${iso===S.country?' sel':''}" data-iso="${iso}"><td>${esc(name(iso))}</td><td class="n">${fmtN(r.population)}</td><td><span class="badge${r.series_type==='projection'?' proj':''}">${esc(typeText(r.series_type))}</span></td><td class="src"><a href="${esc(s.source_url)}" rel="noopener">${esc(s.institution)}</a> · ${esc(r.vintage)} · ${esc(refText(r.reference_date))}${isCepal(r.source_tier)?` <span class="badge cepal">${esc(T('Fuente regional: CEPAL/CELADE'))}</span>`:''}</td></tr>`;}).join('')
   +miss.map(({iso})=>{const d=recs(iso);const span=d.length?F('Serie disponible: {a}–{b}',{a:d[0].year,b:d[d.length-1].year}):reason(iso);return `<tr class="click${iso===S.country?' sel':''}" data-iso="${iso}"><td>${esc(name(iso))}</td><td class="n">—</td><td><span class="badge warn">${esc(d.length?T('Sin dato'):T('Pendiente'))}</span></td><td class="src">${esc(span)}</td></tr>`;}).join('')+'</tbody>';
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
  S.country=iso;S.cagrA=null;S.cagrB=null;$('countrySel').value=iso;
  renderMap();renderCountry();track('country_select',{iso3:iso});
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
  $('countryKpis').innerHTML=[[fmtN(curRow.population),F('Población {y} · {t}',{y:curRow.year,t:typeText(curRow.series_type)})],
    [fmtPct(curRow.growth),F('Crecimiento anual {y}',{y:curRow.year})],[c.v,c.why],[pk.main,T('Año de máxima población')+' · '+pk.sub]]
    .map(k=>`<div class="kpi"><b>${esc(k[0])}</b><span>${esc(k[1])}</span></div>`).join('');
  $('countrySrc').innerHTML=sourceBoxes(iso);
  tbl.innerHTML=`<caption class="sr-only">${esc(name(iso))}</caption><thead><tr><th>${esc(T('Año'))}</th><th class="n">${esc(T('Población'))}</th><th class="n">${esc(T('Crecimiento'))}</th><th>${esc(T('Tipo'))}</th><th>${esc(T('Fuente'))}</th><th>${esc(T('Archivo'))}</th></tr></thead><tbody>`
    +rows.map(r=>{const s=segInfo(iso,r)||{};return `<tr><td>${r.year}</td><td class="n">${fmtN(r.population)}</td><td class="n">${fmtPct(r.growth)}</td><td>${esc(typeText(r.series_type))}</td><td class="src">${esc(s.institution)} · ${esc(r.vintage)}</td><td class="src"><a href="${esc(blob(r.raw_file))}" rel="noopener">${esc(T('crudo'))}</a></td></tr>`;}).join('')+'</tbody>';
  box.setAttribute('aria-label',F('Serie de población de {c}. Los valores están en la tabla de abajo.',{c:name(iso)}));
  loadPlotly().then(()=>{
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
    return `<div class="srcbox${cep?' cepal':''}">${cep?`<span class="badge cepal">${esc(T('Fuente regional: CEPAL/CELADE'))}</span> `:''}<b>${esc(s.institution)}</b> · ${esc(s.vintage)} · ${s.year_from}–${s.year_to} · ${esc(T('referencia:'))} ${esc(refText(s.reference_date))}<br><a href="${esc(s.source_url)}" rel="noopener">${esc(T('fuente'))}</a> · ${files} · ${esc(T('descargado:'))} ${esc(fmtDate(s.retrieved_at))}${s.retrieved_by==='manual'?' · '+esc(T('carga manual')):''}${notes}</div>`;
  }).join('')+breaks;
}

/* ---------- Pirámides ---------- */
const PYR={docs:{},loading:{},countries:['COL','GTM','URY','BRA'],year:NOW,scale:'share',layout:'side',playing:null};
const PYR_MAX=4;
const pyrInfo=iso=>((S.status.countries||{})[iso]||{}).pyramid||{};
const pyrAvailable=iso=>(pyrInfo(iso).years||0)>0;
const pick=o=>o&&(o[LANG]||o.es);
const sum=a=>a.reduce((x,y)=>x+y,0);
const pyrTotal=v=>sum(v.m)+sum(v.f);
function pyrLoad(iso){
  if(PYR.docs[iso]||PYR.loading[iso])return;
  PYR.loading[iso]=true;
  PopData.loadPyramid(iso).then(d=>{PYR.docs[iso]=d;}).catch(()=>{PYR.docs[iso]={error:true};}).finally(()=>{delete PYR.loading[iso];renderPyr();});
}
const pyrAt=(iso,y)=>{const d=PYR.docs[iso];return d&&d.years?d.years[y]:null;};
const pyrYears=iso=>{const d=PYR.docs[iso];return d&&d.years?Object.keys(d.years).map(Number).sort((a,b)=>a-b):[];};
/* Tope estable en %: el mayor grupo de los países elegidos en todos sus años, para que la escala no salte al mover el año. */
function pyrShareMax(){
  let mx=0;
  PYR.countries.forEach(i=>{const d=PYR.docs[i];if(!d||!d.years)return;Object.values(d.years).forEach(v=>{const t=pyrTotal(v);v.m.concat(v.f).forEach(x=>{if(x/t>mx)mx=x/t;});});});
  return mx||.1;
}
function niceMax(v){const e=Math.pow(10,Math.floor(Math.log10(v)));const f=v/e;return [1,1.5,2,2.5,3,4,5,6,8,10].find(s=>f<=s)*e;}
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
function pyrSvg(iso,v,max){
  const t=pyrTotal(v),val=x=>PYR.scale==='share'?x/t:x,proj=v.series_type==='projection';
  const f=pyrFrame(max,17,({xL,xR,top,rowH,half,cg})=>{
    let b='';
    for(let i=0;i<17;i++){
      const y=(top+rowH*(16-i)+1).toFixed(1),h=rowH-2,lm=xL(val(v.m[i])),rf=xR(val(v.f[i]));
      b+=`<rect x="${lm.toFixed(1)}" y="${y}" width="${(half-lm).toFixed(1)}" height="${h}" rx="1.5" fill="var(--s1)"></rect>`;
      b+=`<rect x="${(half+cg).toFixed(1)}" y="${y}" width="${(rf-half-cg).toFixed(1)}" height="${h}" rx="1.5" fill="var(--s2)"></rect>`;
      if(proj){b+=`<rect x="${lm.toFixed(1)}" y="${y}" width="${(half-lm).toFixed(1)}" height="${h}" fill="url(#hatch)"></rect><rect x="${(half+cg).toFixed(1)}" y="${y}" width="${(rf-half-cg).toFixed(1)}" height="${h}" fill="url(#hatch)"></rect>`;}
    }
    return b;
  });
  const [y0,y1,y2]=pyrBroad(v);
  const lbl=F('Pirámide de {c} en {y}: {a} menores de 15 años, {b} de 65 años y más. Los valores están en la tabla de abajo.',{c:name(iso),y:PYR.year,a:fmtPct2(y0),b:fmtPct2(y2)});
  return `<svg viewBox="0 0 ${f.W} ${f.H}" data-iso="${iso}" role="img" tabindex="0" aria-label="${esc(lbl)}">${f.inner}</svg>`;
}
const fmtPct2=p=>fmtN(p*100,1)+' %';
function pyrBroad(v){const t=pyrTotal(v),s=(a,b)=>sum(v.m.slice(a,b))+sum(v.f.slice(a,b));return [s(0,3)/t,s(3,13)/t,s(13,17)/t];}
function pyrOverlaySvg(items,max){
  const f=pyrFrame(max,17,({xL,xR,top,rowH})=>items.map(it=>{
    const t=pyrTotal(it.v),col=`var(${SLOTS[it.slot]})`,dash=it.v.series_type==='projection'?' stroke-dasharray="3 2"':'';
    const path=(arr,x)=>{let d='';for(let i=0;i<17;i++){const X=x(arr[i]/t).toFixed(1),y1=top+rowH*(16-i),y2=y1+rowH;d+=(i?'L':'M')+X+','+y2+'L'+X+','+y1;}return d;};
    return `<path d="${path(it.v.m,xL)}" fill="none" stroke="${col}" stroke-width="2"${dash}></path><path d="${path(it.v.f,xR)}" fill="none" stroke="${col}" stroke-width="2"${dash}></path>`;
  }).join(''));
  return `<svg viewBox="0 0 ${f.W} ${f.H}" data-overlay="1" role="img" tabindex="0" aria-label="${esc(F('Pirámides superpuestas en {y}. Los valores están en la tabla de abajo.',{y:PYR.year}))}">${f.inner}</svg>`;
}
function pyrSource(iso,v){
  const d=PYR.docs[iso];const files=(d.raw_files||[]).map((f,i)=>`<a href="${esc(blob(f.path))}" rel="noopener">${esc((d.raw_files.length>1)?F('archivo crudo {n}',{n:i+1}):T('archivo crudo'))}</a>`).join(' · ');
  return `<p class="src"><a href="${esc(d.source_url)}" rel="noopener">${esc(d.institution)}</a> · ${esc(v.vintage)} · ${esc(refText(v.reference_date))}${files?' · '+files:''}${d.note?'<br>'+esc(pick(d.note)):''}</p>`;
}
function pyrEmpty(iso){
  const d=PYR.docs[iso];
  if(!d||PYR.loading[iso])return `<p class="pyr-empty">${esc(T('Cargando pirámide…'))}</p>`;
  if(d.error)return `<p class="pyr-empty">${esc(T('No se pudo cargar esta pirámide. Los demás datos siguen disponibles.'))}</p>`;
  const ys=pyrYears(iso);if(!ys.length)return `<p class="pyr-empty">${esc(pick(d.reason)||T('Sin datos disponibles.'))}</p>`;
  const near=ys.reduce((a,c)=>Math.abs(c-PYR.year)<Math.abs(a-PYR.year)?c:a);
  return `<p class="pyr-empty">${esc(F('Sin pirámide para {y}. Años disponibles: {a}–{b}.',{y:PYR.year,a:ys[0],b:ys[ys.length-1]}))}<br><button type="button" class="btn" data-go="${near}">${esc(F('Ver {y}',{y:near}))}</button></p>`;
}
function renderPyr(){
  if(!S.status)return;
  PYR.countries.forEach(pyrLoad);
  const loaded=PYR.countries.find(i=>PYR.docs[i]&&PYR.docs[i].age_groups);
  if(loaded)window.__ageGroups=PYR.docs[loaded].age_groups;
  $('pyrYearOut').textContent=PYR.year;$('pyrYear').value=PYR.year;
  $('pyrScale').value=PYR.scale;$('pyrLayout').value=PYR.layout;
  $('pyrScale').disabled=PYR.layout==='overlay';
  $('pyrChips').innerHTML=ISOS().map(i=>{const on=PYR.countries.includes(i),ok=pyrAvailable(i);
    return `<button type="button" class="chip" data-iso="${i}" aria-pressed="${on}"${!ok||(!on&&PYR.countries.length>=PYR_MAX)?' disabled':''}${ok?'':` title="${esc(pick(pyrInfo(i).reason)||'')}"`}>${on&&PYR.layout==='overlay'?`<span class="dot" style="background:var(${SLOTS[PYR.countries.indexOf(i)]})"></span>`:''}${esc(name(i))}</button>`;}).join('');
  const shareScale=PYR.scale==='share'||PYR.layout==='overlay';
  const grid=$('pyrGrid');
  if(PYR.layout==='overlay'){
    const saved=PYR.scale;PYR.scale='share';
    const items=PYR.countries.map((iso,slot)=>({iso,slot,v:pyrAt(iso,PYR.year)})).filter(x=>x.v);
    const miss=PYR.countries.filter(i=>!pyrAt(i,PYR.year));
    $('pyrLegend').innerHTML=`<span class="lg">${esc(T('Izquierda: hombres · Derecha: mujeres'))}</span>`+items.map(x=>`<span class="lg"><span class="dot" style="background:var(${SLOTS[x.slot]})"></span>${esc(name(x.iso))}${x.v.series_type==='projection'?' ('+esc(T('proyección'))+')':''}</span>`).join('');
    grid.style.gridTemplateColumns='minmax(0,1fr)';
    grid.innerHTML=`<div class="pyr-panel" style="max-width:640px;margin:0 auto;width:100%">${items.length?pyrOverlaySvg(items,niceMax(pyrShareMax())):pyrEmpty(PYR.countries[0])}${items.map(x=>pyrSource(x.iso,x.v).replace('<p class="src">',`<p class="src"><b>${esc(name(x.iso))}:</b> `)).join('')}${miss.map(i=>`<p class="src"><b>${esc(name(i))}:</b> ${esc(F('sin dato para {y}',{y:PYR.year}))}</p>`).join('')}</div>`;
    PYR.scale=saved;
  }else{
    grid.style.gridTemplateColumns='';
    $('pyrLegend').innerHTML=`<span class="lg"><span class="sw" style="background:var(--s1)"></span>${esc(T('Hombres'))}</span><span class="lg"><span class="sw" style="background:var(--s2)"></span>${esc(T('Mujeres'))}</span><span class="lg"><svg width="18" height="12" aria-hidden="true"><rect width="18" height="12" rx="3" fill="var(--sx)"></rect><rect width="18" height="12" rx="3" fill="url(#hatch)"></rect></svg>${esc(T('Proyección'))}</span>`;
    const shared=niceMax(pyrShareMax());
    grid.innerHTML=PYR.countries.map(iso=>{
      const v=pyrAt(iso,PYR.year);
      if(!v)return `<div class="pyr-panel"><h3>${esc(name(iso))}</h3>${pyrEmpty(iso)}</div>`;
      const b=pyrBroad(v);
      const mx=shareScale?shared:niceMax(Math.max(...v.m,...v.f));
      return `<div class="pyr-panel"><h3>${esc(name(iso))}<span class="badge${v.series_type==='projection'?' proj':''}">${esc(typeText(v.series_type))}</span></h3>`
        +`<p class="pyr-stats">${esc(F('Población: {p}',{p:fmtN(pyrTotal(v))}))}<br>${esc(F('{a} menores de 15 · {b} de 15 a 64 · {c} de 65 y más',{a:fmtPct2(b[0]),b:fmtPct2(b[1]),c:fmtPct2(b[2])}))}</p>`
        +pyrSvg(iso,v,mx)+pyrSource(iso,v)+`</div>`;
    }).join('');
  }
  $('pyrNote').textContent=PYR.scale==='abs'&&PYR.layout==='side'?T('En personas, cada pirámide usa su propia escala: compara su forma, no su tamaño. Para comparar países entre sí usa porcentajes.'):T('Último grupo: 80 años y más, el común a todas las fuentes. Las fechas de referencia difieren entre países; cada panel declara la suya.');
  const ages=window.__ageGroups||[];
  const withV=PYR.countries.map(i=>({i,v:pyrAt(i,PYR.year)})).filter(x=>x.v);
  $('pyrTable').innerHTML=`<caption class="sr-only">${esc(F('Población por edad y sexo en {y}',{y:PYR.year}))}</caption><thead><tr><th>${esc(T('Edad'))}</th>${withV.map(x=>`<th class="n">${esc(name(x.i))} · ${esc(T('H'))}</th><th class="n">${esc(name(x.i))} · ${esc(T('M'))}</th>`).join('')}</tr></thead><tbody>`
    +ages.map((a,k)=>({a,k})).reverse().map(({a,k})=>`<tr><td>${esc(a)}</td>${withV.map(x=>{const t=pyrTotal(x.v),f=n=>PYR.scale==='share'||PYR.layout==='overlay'?fmtPct2(n/t):fmtN(n);return `<td class="n">${f(x.v.m[k])}</td><td class="n">${f(x.v.f[k])}</td>`;}).join('')}</tr>`).join('')+'</tbody>';
  $('pyrPending').innerHTML=ISOS().filter(i=>!pyrAvailable(i)).map(i=>`<li><b>${esc(name(i))}:</b> ${esc(pick(pyrInfo(i).reason)||T('Sin datos disponibles.'))}</li>`).join('');
  $('csvPyr').disabled=!withV.length;
}
function pyrTip(ev,svg){
  const r=ev.target.closest&&ev.target.closest('[data-i]');if(!r)return hideTip();
  const k=+r.dataset.i,a=(window.__ageGroups||[])[k];
  const list=svg.dataset.overlay?PYR.countries.map(i=>({i,v:pyrAt(i,PYR.year)})).filter(x=>x.v):[{i:svg.dataset.iso,v:pyrAt(svg.dataset.iso,PYR.year)}];
  tip(ev,`<b>${esc(a)}</b> · ${PYR.year}<br>`+list.map(x=>{const t=pyrTotal(x.v);return `${list.length>1||svg.dataset.overlay?esc(name(x.i))+'<br>':''}${esc(T('Hombres'))}: ${fmtN(x.v.m[k])} (${fmtPct2(x.v.m[k]/t)})<br>${esc(T('Mujeres'))}: ${fmtN(x.v.f[k])} (${fmtPct2(x.v.f[k]/t)})`;}).join('<br>'));
}
function pyrStop(){if(PYR.playing){clearInterval(PYR.playing);PYR.playing=null;const b=$('pyrPlay');b.dataset.es='▶ Recorrer';b.textContent=T('▶ Recorrer');}}
function wirePyr(){
  const infos=PopData.ISO3.map(pyrInfo).filter(x=>x.years);
  const minY=Math.min(...infos.map(x=>x.year_from)),maxY=Math.max(...infos.map(x=>x.year_to));
  const yr=$('pyrYear');yr.min=minY;yr.max=maxY;PYR.year=Math.min(maxY,Math.max(minY,DEFAULT_YEAR));
  PYR.countries=PYR.countries.filter(pyrAvailable);
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
  grid.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b){PYR.year=+b.dataset.go;renderPyr();}});
  grid.addEventListener('pointermove',e=>{const s=e.target.closest&&e.target.closest('svg');if(s)pyrTip(e,s);});
  grid.addEventListener('pointerleave',hideTip);
  $('csvPyr').addEventListener('click',()=>{
    const ages=window.__ageGroups||[];
    const rows=[];PYR.countries.forEach(i=>{const v=pyrAt(i,PYR.year),d=PYR.docs[i];if(!v)return;const t=pyrTotal(v);
      ages.forEach((a,k)=>[['m',v.m[k]],['f',v.f[k]]].forEach(([s,n])=>rows.push({iso3:i,country:name(i),year:PYR.year,age_group:a,sex:s==='m'?'male':'female',population:n,share_of_total:n/t,series_type:v.series_type,source_id:v.source_id,source_tier:v.source_tier,institution:d.institution,vintage:v.vintage,reference_date:v.reference_date,source_url:d.source_url,raw_files:(d.raw_files||[]).map(f=>f.path).join(' | ')})));});
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
  const chips=$('compareChips');
  chips.innerHTML=ISOS().map(i=>{const on=S.compare.includes(i),none=!recs(i).length;
    return `<button type="button" class="chip" data-iso="${i}" aria-pressed="${on}"${none||(!on&&S.compare.length>=SLOTS.length)?' disabled':''}${none?` title="${esc(reason(i))}"`:''}>${on?`<span class="dot" style="background:var(${SLOTS[slotOf(i)]})"></span>`:''}${esc(name(i))}</button>`;}).join('');
  const series=S.compare.map(i=>({iso:i,rows:indexed(i)}));
  const ok=series.filter(s=>s.rows),bad=series.filter(s=>!s.rows);
  $('compareExcluded').textContent=bad.length?F('Sin dato en {y}, no se dibuja: {c}.',{y:S.base,c:bad.map(s=>name(s.iso)).join(', ')}):'';
  $('compareSrc').innerHTML=ok.map(s=>{const seg=segInfo(s.iso,s.rows[0])||{};return `<b>${esc(name(s.iso))}:</b> <a href="${esc(seg.source_url)}" rel="noopener">${esc(seg.institution)}</a> · ${esc(s.rows[0].vintage)}${isCepal(s.rows[0].source_tier)?' · '+esc(T('Fuente regional: CEPAL/CELADE')):''}`;}).join(' &nbsp;|&nbsp; ');
  const years=[...new Set(ok.flatMap(s=>s.rows.map(r=>r.year)))].sort((a,b)=>a-b);
  $('compareTable').innerHTML=`<thead><tr><th>${esc(T('Año'))}</th>${ok.map(s=>`<th class="n">${esc(name(s.iso))}</th>`).join('')}</tr></thead><tbody>`
    +years.map(y=>`<tr><td>${y}</td>${ok.map(s=>{const r=s.rows.find(x=>x.year===y);return `<td class="n">${r?fmtN(r.index,1)+(r.series_type==='projection'?' *':''):'—'}</td>`;}).join('')}</tr>`).join('')+`</tbody><caption class="src" style="caption-side:bottom;text-align:left">${esc(T('* Proyección'))}</caption>`;
  const box=$('compareChart');box.setAttribute('aria-label',F('Índice base 100 en {y}. Los valores están en la tabla de abajo.',{y:S.base}));
  if(!ok.length){box.innerHTML=`<p class="banner warn">${esc(T('Ningún país elegido tiene dato en ese año. Elige otro año base.'))}</p>`;box.style.minHeight='0';return;}
  box.style.minHeight='';
  loadPlotly().then(()=>{
    const data=[];const L=baseLayout();L.shapes=[];L.annotations=[];
    const wide=window.innerWidth>=700&&ok.length<=4;if(wide)L.margin.r=96;
    ok.forEach(s=>{const col=css(SLOTS[S.slots[s.iso]]);
      splitTraces(s.rows).forEach((t,i)=>data.push({type:'scatter',mode:t.rows.length<8?'lines+markers':'lines',x:t.rows.map(r=>r.year),y:t.rows.map(r=>r.index),
        name:name(s.iso),legendgroup:s.iso,showlegend:i===0,line:{color:col,width:2,dash:t.type==='projection'?'dot':'solid'},marker:{size:8,color:col},
        customdata:t.rows.map(r=>[name(s.iso),typeText(r.series_type)]),hovertemplate:'%{customdata[0]}: %{y:.1f} · %{customdata[1]}<extra></extra>'}));
      if(wide){const e=s.rows[s.rows.length-1];L.annotations.push({x:e.year,y:e.index,xanchor:'left',yanchor:'middle',showarrow:false,xshift:6,yshift:0,text:name(s.iso),font:{size:11,color:css('--text-soft')}});}
    });
    /* Etiquetas al final de cada línea: separa las que quedarían una encima de otra. */
    const allY=ok.flatMap(s=>s.rows.map(r=>r.index)),span=(Math.max(...allY)-Math.min(...allY))||1;
    L.annotations.sort((a,b)=>a.y-b.y).forEach((n,i,arr)=>{if(i&&Math.abs(n.x-arr[i-1].x)<8&&(n.y-arr[i-1].y)/span<.05)n.yshift=(arr[i-1].yshift||0)+13;});
    const fps=ok.map(s=>{const r=s.rows.find(x=>x.series_type==='projection');return r?r.year:null;}).filter(y=>y!=null);
    const xmax=Math.max(...years);
    if(fps.length)L.shapes.push({type:'rect',xref:'x',yref:'paper',x0:Math.min(...fps)-.5,x1:xmax,y0:0,y1:1,fillcolor:css('--proj-bg'),line:{width:0},layer:'below'});
    L.shapes.push({type:'line',xref:'paper',x0:0,x1:1,y0:100,y1:100,line:{color:css('--text-muted'),width:1}});
    box.innerHTML='';Plotly.newPlot(box,data,L,PCONF);
  }).catch(()=>plotFail('compareChart'));
}

/* ---------- Gráficos pequeños ---------- */
function renderMultiples(){
  const W=200,H=84,x0=1950,x1=2100;
  const all=PopData.ISO3.flatMap(i=>recs(i).map(r=>r.growth)).filter(v=>v!=null);
  const ymax=all.length?Math.max(...all):.04,ymin=all.length?Math.min(0,...all):-.01;
  const X=y=>(y-x0)/(x1-x0)*W,Y=v=>H-6-(v-ymin)/(ymax-ymin)*(H-12);
  $('multiples').innerHTML=`<p class="src" style="grid-column:1/-1">${esc(F('Escala común: {a} a {b} · eje horizontal 1950–2100.',{a:fmtPct(ymin,1),b:fmtPct(ymax,1)}))}</p>`+ISOS().map(iso=>{
    const rows=recs(iso);
    if(!rows.length)return `<div class="mini"><h3>${esc(name(iso))}<span class="badge warn">${esc(T('Pendiente'))}</span></h3><p class="why">${esc(reason(iso))}</p></div>`;
    const withG=rows.filter(r=>r.growth!=null);
    const fp=firstProj(iso);let parts='';let cur=[],curKey=null;
    const flush=()=>{if(cur.length>1){const d=cur.map((r,i)=>(i?'L':'M')+X(r.year).toFixed(1)+','+Y(r.growth).toFixed(1)).join('');const pr=cur[cur.length-1].series_type==='projection';parts+=`<path d="${d}" fill="none" stroke="var(--s1)" stroke-width="1.5"${pr?' stroke-dasharray="2 2"':''}></path>`;}else if(cur.length===1){parts+=`<circle cx="${X(cur[0].year).toFixed(1)}" cy="${Y(cur[0].growth).toFixed(1)}" r="1.2" fill="var(--s1)"></circle>`;}cur=[];};
    withG.forEach((r,i)=>{const prev=withG[i-1];const k=segKey(r)+r.series_type;
      if(prev&&(r.year!==prev.year+1||curKey!==k)){const carry=(prev&&r.year===prev.year+1&&segKey(prev)===segKey(r))?prev:null;flush();if(carry)cur.push(carry);}
      curKey=k;cur.push(r);});
    flush();
    const brk=(doc(iso).breaks||[]).map(b=>`<line x1="${X(b.year-.5).toFixed(1)}" x2="${X(b.year-.5).toFixed(1)}" y1="2" y2="${H-2}" stroke="var(--text-muted)" stroke-dasharray="2 2" stroke-width="1"></line>`).join('');
    const shade=fp!=null?`<rect x="${X(fp).toFixed(1)}" y="0" width="${(X(rows[rows.length-1].year)-X(fp)).toFixed(1)}" height="${H}" fill="var(--proj-bg)"></rect>`:'';
    const cepal=rows.some(r=>isCepal(r.source_tier));
    const cur0=withG.filter(r=>r.year<=NOW).pop();
    const lbl=F('{c}: crecimiento anual de {a} a {b}. Valor reciente {v}.',{c:name(iso),a:rows[0].year,b:rows[rows.length-1].year,v:cur0?fmtPct(cur0.growth):'—'});
    return `<div class="mini"><h3>${esc(name(iso))}${cepal?'<span class="badge cepal" title="'+esc(T('Fuente regional: CEPAL/CELADE'))+'">CEPAL</span>':''}</h3>`
      +`<svg viewBox="0 0 ${W} ${H}" data-iso="${iso}" tabindex="0" role="img" aria-label="${esc(lbl)}">${shade}<line x1="0" x2="${W}" y1="${Y(0).toFixed(1)}" y2="${Y(0).toFixed(1)}" stroke="var(--border)" stroke-width="1"></line>${brk}${parts}${withG.length?'':`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="9" fill="var(--text-muted)">${esc(T('Sin tramo anual'))}</text>`}</svg></div>`;
  }).join('');
  $('multiples').querySelectorAll('svg').forEach(svg=>{
    svg.addEventListener('pointermove',e=>{const b=svg.getBoundingClientRect(),y=Math.round(x0+(e.clientX-b.left)/b.width*(x1-x0)),iso=svg.dataset.iso;const rows=recs(iso).filter(r=>r.growth!=null);if(!rows.length)return hideTip();const r=rows.reduce((a,c)=>Math.abs(c.year-y)<Math.abs(a.year-y)?c:a);const s=segInfo(iso,r)||{};tip(e,`<b>${esc(name(iso))}</b> · ${r.year}<br>${fmtPct(r.growth)} · ${esc(typeText(r.series_type))}<br>${esc(s.institution)} · ${esc(r.vintage)}`);});
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

/* ---------- Tooltip ---------- */
const tipEl=()=>$('tip');
function tip(ev,html){const t=tipEl();t.innerHTML=html;t.style.display='block';const r=t.getBoundingClientRect();let x=ev.clientX+12,y=ev.clientY+12;if(x+r.width>innerWidth-8)x=ev.clientX-r.width-12;if(x<8)x=8;if(y+r.height>innerHeight-8)y=ev.clientY-r.height-12;t.style.left=x+'px';t.style.top=y+'px';}
function hideTip(){tipEl().style.display='none';}

function renderAll(){
  renderHead();
  const sel=$('countrySel');sel.innerHTML=ISOS().map(i=>`<option value="${i}">${esc(name(i))}${recs(i).length?'':' · '+esc(T('pendiente'))}</option>`).join('');sel.value=S.country;
  renderMap();renderCountry();renderPyr();renderCompare();renderMultiples();renderPeak();renderMatrix();
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
  $('compareChips').addEventListener('click',e=>{const c=e.target.closest('.chip');if(!c||c.disabled)return;const i=c.dataset.iso;
    if(S.compare.includes(i)){S.compare=S.compare.filter(x=>x!==i);delete S.slots[i];}else{S.compare.push(i);slotOf(i);}renderCompare();});
  $('csvMap').addEventListener('click',()=>downloadCSV(`poblacion-latam-${S.year}.csv`,PopData.ISO3.flatMap(i=>{const r=byYear(i)[S.year];return r?[csvRow(i,r)]:[];})));
  $('csvCountry').addEventListener('click',()=>downloadCSV(`poblacion-${S.country}.csv`,recs(S.country).map(r=>csvRow(S.country,r))));
  $('csvCompare').addEventListener('click',()=>downloadCSV(`poblacion-indice-base-${S.base}.csv`,S.compare.flatMap(i=>(indexed(i)||[]).map(r=>csvRow(i,r,{index_base_100:r.index,base_year:S.base})))));
  $('csvGrowth').addEventListener('click',()=>downloadCSV('poblacion-latam-crecimiento.csv',PopData.ISO3.flatMap(i=>recs(i).filter(r=>r.growth!=null).map(r=>csvRow(i,r)))));
  let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{renderCountry();renderCompare();},250);});
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
  $('themeToggle').addEventListener('click',()=>{applyTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark');if(S.status){renderMap();renderCountry();renderPyr();renderCompare();}});
  const q=(()=>{try{return new URLSearchParams(location.search).get('datos');}catch(e){return null;}})();
  /* ?datos=prueba-error simula una caída para revisar el mensaje; no afecta a nadie más. */
  PopData.loadAll(q==='prueba-error'?{sources:['https://raw.githubusercontent.com/jaforero/latam-population-official/main/no-existe']}:{}).then(r=>{
    S.status=r.status;S.countries=r.countries;S.failed=r.failed;S.fromCache=r.fromCache;
    S.compare=S.compare.filter(i=>recs(i).length);S.compare.forEach(slotOf);
    if(!recs(S.country).length)S.country=PopData.ISO3.find(i=>recs(i).length);
    buildMap();wire();wirePyr();$('content').hidden=false;renderAll();
  }).catch(showFatal);
});
