/* Standalone composer geometry readout. Runs only when the query is exactly ari_debug=composer.
   It does not load the skin, does not write the composer, and does not store text.
   Readback nodes, by id only: #conv-composer-textarea-input (field), its parent,
   #composer-textarea that contains the field (card), and that card's parent (box).
   Missing is unknown. More than one match is ambig. */
!function(w,d){try{
if(w.__ariComposerDebug)return;
var q;try{q=new URLSearchParams(w.location.search)}catch(e){return}
if(!q||q.getAll("ari_debug").length!==1||q.get("ari_debug")!=="composer")return;
var FR=8,KEEP=6,alive=1,raf=0,running=0,seq=0,rows=[],boxEl=null;
function allow(s){return typeof s==="string"&&/^[a-zA-Z]{1,32}$/.test(s)?s:"other"}
function rect(el){if(!el||!el.getBoundingClientRect)return null;var r=el.getBoundingClientRect();return{h:Math.round(r.height),t:Math.round(r.top)}}
function locate(){
  var fields=d.querySelectorAll("#conv-composer-textarea-input");
  var field=fields.length===1?fields[0]:null;
  var cards=d.querySelectorAll("#composer-textarea");
  var hits=[];
  if(field){for(var i=0;i<cards.length;i++)if(cards[i].contains(field))hits.push(cards[i])}
  var card=hits.length===1?hits[0]:null;
  return{
    field:{el:field,st:fields.length===0?"unknown":fields.length>1?"ambig":"ok"},
    parent:{el:field?field.parentElement:null,st:field?"ok":"unknown"},
    card:{el:card,st:!field?"unknown":hits.length===0?"unknown":hits.length>1?"ambig":"ok"},
    box:{el:card?card.parentElement:null,st:card?"ok":"unknown"}
  };
}
function vvInfo(){
  var v=w.visualViewport;
  return{h:v?Math.round(v.height):Math.round(w.innerHeight),t:v?Math.round(v.offsetTop):0,l:v?Math.round(v.offsetLeft):0,y:Math.round(w.scrollY||0)};
}
function bump(slot,sample){
  if(!sample){slot.miss=1;return}
  if(slot.hMin==null||sample.h<slot.hMin)slot.hMin=sample.h;
  if(slot.hMax==null||sample.h>slot.hMax)slot.hMax=sample.h;
  if(slot.tMin==null||sample.t<slot.tMin)slot.tMin=sample.t;
  if(slot.tMax==null||sample.t>slot.tMax)slot.tMax=sample.t;
}
function paint(){
  if(!boxEl)return;
  var lines=["dbg composer"];
  for(var i=0;i<rows.length;i++){
    var r=rows[i],n=r.nodes,parts=[String(r.seq),r.kind,r.inputType,String(r.dt)];
    ["field","parent","card","box"].forEach(function(k){
      var s=n[k];
      if(!s||s.st!=="ok")parts.push(k[0]+" "+(s&&s.st?s.st:"unknown"));
      else parts.push(k[0]+" "+s.hMin+(s.hMin===s.hMax?"":".."+s.hMax)+"/"+s.tMin+(s.tMin===s.tMax?"":".."+s.tMax));
    });
    var v=r.vv;
    parts.push("vv "+v.hMin+(v.hMin===v.hMax?"":".."+v.hMax)+" o "+v.l+","+v.tMin+(v.tMin===v.tMax?"":".."+v.tMax)+" y "+v.y);
    lines.push(parts.join(" "));
  }
  boxEl.textContent=lines.join("\n");
}
function sample(row){
  var loc=locate(),v=vvInfo();
  row.frames++;
  row.dt=Math.round(performance.now()-row.t0);
  if(!row.vv)row.vv=v;
  if(v.h<row.vv.hMin||row.vv.hMin==null)row.vv.hMin=v.h;
  if(v.h>row.vv.hMax||row.vv.hMax==null)row.vv.hMax=v.h;
  if(v.t<row.vv.tMin||row.vv.tMin==null)row.vv.tMin=v.t;
  if(v.t>row.vv.tMax||row.vv.tMax==null)row.vv.tMax=v.t;
  row.vv.h=v.h;row.vv.t=v.t;row.vv.l=v.l;row.vv.y=v.y;
  ["field","parent","card","box"].forEach(function(k){
    var item=loc[k];
    if(!row.nodes[k])row.nodes[k]={st:item.st,hMin:null,hMax:null,tMin:null,tMax:null};
    var slot=row.nodes[k];
    slot.st=item.st;
    if(item.st==="ok")bump(slot,rect(item.el));
  });
}
function arm(kind,inputType){
  if(!alive)return;
  var row={seq:++seq,t0:performance.now(),dt:0,kind:allow(kind),inputType:allow(inputType||""),frames:0,nodes:{},vv:vvInfo()};
  rows.push(row);
  if(rows.length>KEEP)rows.shift();
  sample(row);
  paint();
  pump();
}
function pump(){
  if(running||!alive)return;
  running=1;
  var n=0;
  function step(){
    if(!alive){running=0;raf=0;return}
    var row=rows[rows.length-1];
    if(row)sample(row);
    paint();
    if(++n<FR)raf=w.requestAnimationFrame(step);
    else{running=0;raf=0}
  }
  raf=w.requestAnimationFrame(step);
}
function onEdit(e){
  if(!alive||!e)return;
  var t=e.target;
  if(!t||t.id!=="conv-composer-textarea-input")return;
  arm(e.type,e.inputType||"");
}
function onVv(){if(alive&&!running)arm("vv","")}
function onScroll(){if(alive&&!running)arm("scroll","")}
function onRoute(){
  try{if(!/\/conversations\/conversations/.test(w.location.pathname))stop()}catch(e){stop()}
}
function ui(){
  if(boxEl)return;
  boxEl=d.createElement("pre");
  boxEl.id="ari-composer-debug";
  boxEl.setAttribute("aria-hidden","true");
  boxEl.style.cssText="position:fixed;left:8px;top:8px;z-index:2147483646;width:300px;height:168px;margin:0;overflow:hidden;pointer-events:none;contain:strict;font:11px/14px ui-monospace,monospace;color:#102218;background:rgba(255,250,240,.94);border:1px solid #243;padding:4px 6px;box-sizing:border-box";
  (d.documentElement||d.body).appendChild(boxEl);
}
function stop(){
  alive=0;
  if(raf){w.cancelAnimationFrame(raf);raf=0}
  running=0;
  d.removeEventListener("beforeinput",onEdit,!0);
  d.removeEventListener("input",onEdit,!0);
  d.removeEventListener("compositionstart",onEdit,!0);
  d.removeEventListener("compositionupdate",onEdit,!0);
  d.removeEventListener("compositionend",onEdit,!0);
  w.removeEventListener("scroll",onScroll,!0);
  w.removeEventListener("popstate",onRoute);
  if(w.visualViewport){w.visualViewport.removeEventListener("resize",onVv);w.visualViewport.removeEventListener("scroll",onVv)}
  if(boxEl&&boxEl.parentNode)boxEl.parentNode.removeChild(boxEl);
  boxEl=null;
  try{delete w.__ariComposerDebug}catch(e){w.__ariComposerDebug=null}
}
function start(){
  ui();
  d.addEventListener("beforeinput",onEdit,!0);
  d.addEventListener("input",onEdit,!0);
  d.addEventListener("compositionstart",onEdit,!0);
  d.addEventListener("compositionupdate",onEdit,!0);
  d.addEventListener("compositionend",onEdit,!0);
  w.addEventListener("scroll",onScroll,!0);
  w.addEventListener("popstate",onRoute);
  if(w.visualViewport){w.visualViewport.addEventListener("resize",onVv);w.visualViewport.addEventListener("scroll",onVv)}
  arm("open","");
}
w.__ariComposerDebug={start:start,stop:stop,rows:function(){return rows.map(function(r){return{seq:r.seq,kind:r.kind,inputType:r.inputType,dt:r.dt,frames:r.frames,nodes:r.nodes,vv:r.vv}})},running:function(){return alive===1}};
start();
}catch(e){}}(window,document);
