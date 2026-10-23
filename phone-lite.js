/* Ari phone-lite v3.40: opens on list, menu drawer, pills in GHL top menu, fixed Join pill, Lilah signature */
try{!function(w,d){if(w.__ariLite)return;w.__ariLite=1;
function onChat(){return/\/conversations\/conversations/.test(location.pathname)}
/* opens on All, once per load, stops on user tap */
var allDone=0,user=0;d.addEventListener("pointerdown",function(e){try{if(e.isTrusted&&e.target.closest&&e.target.closest(".conversation-list-header"))user=1}catch(x){}},!0);
function all(){if(allDone||user)return;var h=d.querySelector(".conversation-list-header");if(!h)return;var c=h.querySelector('button[aria-current="true"]'),a=h.querySelector('button[aria-label="All"],button[aria-label^="All,"]');if(!c||!a)return;if(/^Unread/.test(c.getAttribute("aria-label")||""))a.click();allDone=1}
/* Join chat / Hand back */
var st={},mo=null,pend=0;
function cid(){var t=d.querySelector('#conversations-layout a[href*="/contacts/detail/"]')||d.querySelector('a[href*="/contacts/detail/"]');if(!t)return"";var m=t.getAttribute("href").match(/contacts\/detail\/([A-Za-z0-9]+)/);return m?m[1]:""}
function took(){return[].some.call(d.querySelectorAll('#conversations-layout .tag,#conversations-layout .n-tag,#conversations-layout [class*="tag"]'),function(t){return/psychic-took-over/.test(t.textContent||"")})}
function notes(){try{var t=d.querySelector("#conversations-content");if(!t)return"";var n=[].slice.call(t.querySelectorAll(".message-item")),r=0,o=[],a;for(a=0;a<n.length;a++)/has joined the chat/i.test(n[a].textContent||"")&&(r=a+1);for(a=r;a<n.length;a++){var m=n[a],l=m.querySelector(".chat-message");if(l&&m.querySelector(".chat-bubble-outbound")){var s=(l.innerText||l.textContent||"").replace(/\s+$/,"").split("\n");s.length&&/^[^\s]{1,40}\u2728$/.test(s[s.length-1].trim())&&s.pop();s=s.join(" ").replace(/\s+/g," ").trim();s&&!/has joined the chat/i.test(s)&&o.push(s)}}var c=o.join(" | ");return c.length>800?c.slice(-800):c}catch(x){return""}}
function post(act,c,cb){var m=location.pathname.match(/\/location\/([^\/]+)\//),b={contact_id:c,location_id:m?m[1]:"",action:act};if(act==="handback")b.notes=notes();fetch("https://services.leadconnectorhq.com/hooks/8otTGBxdVFDsQ1gNhDg0/webhook-trigger/e246fb28-08ce-4aa4-b165-0cbc23ba9da5",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)}).then(function(r){cb(r.ok)}).catch(function(){cb(!1)})}
function render(){try{all();lay();var j=d.getElementById("ari-join");if(!onChat()){j&&j.remove();return}var c=cid();if(!c){j&&j.remove();return}if(!j){j=d.createElement("div");j.id="ari-join"}if(j.parentNode!==d.body)d.body.appendChild(j);
var p=st[c]==="on"||st[c]!=="off"&&took();if(j.dataset.cid===c&&j.dataset.p===String(p))return;j.dataset.cid=c;j.dataset.p=String(p);
j.innerHTML=p?'<span class="ari-join-note">Ari paused for this client</span> <button type="button" class="ari-join-btn ari-join-back">Hand back to Ari</button>':'<button type="button" class="ari-join-btn">Join chat</button>';
j.querySelector("button").onclick=function(){var b=this;b.disabled=!0;b.textContent="One moment...";post(p?"handback":"join",c,function(ok){b.disabled=!1;ok?st[c]=p?"off":"on":alert("That did not go through. Please try again.");j.dataset.p="";render()})}}catch(x){}}
/* v3.36 one pane at a time; opens on the list (GHL auto-opens the last chat), row tap opens chat */
var lp=null,showList=1,info=0,nav=0,tapRow=0;
d.addEventListener("pointerdown",function(e){try{var t=e.target;if(t.closest&&t.closest("#conversations-list")&&!t.closest(".conversation-list-header")&&!t.closest("#ari-lite-bar"))tapRow=1}catch(x){}},!0);
function tog(b,n,on){on?b.setAttribute(n,""):b.removeAttribute(n)}
function lay(){try{var b=d.body;if(!b)return;var on=onChat(),id=on&&location.pathname.replace(/^.*\/conversations\/conversations\/?/,"").replace(/\/.*$/,"");if(id!==lp){if(lp!==null&&tapRow)showList=0;else if(lp===null)showList=1;tapRow=0;lp=id;info=0}
if(!on)nav=0;tog(b,"data-arl-chat",on);tog(b,"data-arl-open",!!id);tog(b,"data-arl-list",!!id&&showList);tog(b,"data-arl-info",!!id&&info);tog(b,"data-arl-nav",on&&nav);
var bar=d.getElementById("ari-lite-bar");if(!on){bar&&bar.remove();return}
var tab=d.getElementById("tb_conversations-tab"),top=tab&&tab.parentElement,lay0=d.getElementById("conversations-layout");
if(!bar){bar=d.createElement("div");bar.id="ari-lite-bar";bar.innerHTML='<button type="button" data-k="m">Menu</button><button type="button" data-k="l"></button><button type="button" data-k="i">Details</button>';bar.onclick=function(e){var k=e.target&&e.target.getAttribute("data-k");if(k==="l"){showList=!(showList||info);info=0}else if(k==="i"){info=!info;showList=0}else if(k==="m"){nav=!nav}else return;lay()}}
var host=top||(lay0&&lay0.parentNode);if(!host)return;if(top){top.setAttribute("data-arl-top","");if(bar.parentNode!==top)top.appendChild(bar)}else if(bar.parentNode!==host||bar.nextSibling!==lay0)host.insertBefore(bar,lay0);
var hd=d.querySelector(".hl_header"),tp=hd?Math.max(0,Math.round(hd.getBoundingClientRect().bottom)):0,rs=d.documentElement.style;if(rs.getPropertyValue("--arl-top")!==tp+"px")rs.setProperty("--arl-top",tp+"px");
var bs=bar.children,t1=showList||info?"Back to chat":"All chats";if(bs[1].textContent!==t1)bs[1].textContent=t1;bs[1].hidden=!id;bs[2].hidden=!id||!!(showList||info)}catch(x){}}
function q(){if(pend)return;pend=1;setTimeout(function(){pend=0;render()},250)}
/* page-scoped: watch only #conversations-layout while on the chat page */
var path="";function route(){try{if(location.pathname===path&&(!onChat()||mo&&d.getElementById("conversations-layout")===mo.__el))return;path=location.pathname;if(mo){mo.disconnect();mo=null}var el=onChat()&&d.getElementById("conversations-layout");if(el){mo=new MutationObserver(q);mo.__el=el;mo.observe(el,{childList:!0,subtree:!0})}render()}catch(x){}}
function vh(){try{var v=w.visualViewport,h=v?Math.round(v.height):w.innerHeight;d.documentElement.style.setProperty("--arl-vh",h+"px")}catch(x){}}vh();w.visualViewport&&w.visualViewport.addEventListener("resize",vh);
setInterval(function(){if(!d.hidden)route()},1000);route();
}(window,document)}catch(x){try{console.warn("ari lite",x)}catch(y){}}
try{!function(w,d){var K="__ariSig";if(w[K])return;var M={"8otTGBxdVFDsQ1gNhDg0":"Lilah✨"};
function loc(){var m=location.pathname.match(/\/location\/([^\/]+)\//);return m?m[1]:""}
function on(){var j=d.getElementById("ari-join");return!(!j||"true"!==j.dataset.p||!/\/conversations\/conversations/.test(location.pathname))}
function label(){if(M[loc()])return M[loc()];var t=(d.body.innerText||"").match(/✨\s*([^\n✨]{1,40}?)\s+has joined the chat/g);if(!t)return"";var a=t[t.length-1].match(/✨\s*(.+?)\s+has joined the chat/);return a?a[1]+"✨":""}
function vis(n){return n&&n.offsetParent&&!n.closest("#ari-join")&&!n.closest("#record-details-lhs,[data-ari-notes],.ari-notes")}
function isSend(t){var e=t&&t.closest&&t.closest('button,[role="button"]');if(!e||e.closest("#ari-join"))return null;var a=((e.getAttribute("aria-label")||"")+" "+(e.id||"")+" "+(e.className||"")+" "+(e.textContent||"")).toLowerCase();return/\bsend\b|send-?btn|send-?message/.test(a)&&!/schedul|later/.test(a)?e:null}
var F='textarea,[contenteditable="true"],input[id^="composer-input"]';
function scope(n){return n&&n.closest&&n.closest("#conversations-central-panel-viewer,#conversations-messages,[data-ari-composer],[data-ari-composer-bar]")}
function field(n){return vis(n)&&!n.closest("#conversations-right-column,#record-details-lhs")&&!!scope(n)}
function composer(from){var c=d.getElementById("composer-textarea");if(c){var x=c.matches(F)?c:c.querySelector(F);if(field(x))return x}
var root=from&&(from.closest("#conversations-central-panel-viewer")||from.closest("#conversations-messages"));
var fb=null;for(var p=from&&from.parentElement;p&&p!==d.body;p=p.parentElement){var q=p.querySelectorAll(F);for(var i=q.length-1;i>=0;i--)if(field(q[i])){if("INPUT"!==q[i].tagName)return q[i];fb=fb||q[i]}if(p===root)break}return fb}
function txt(n){return"TEXTAREA"===n.tagName||"INPUT"===n.tagName?n.value:n.innerText}
function put(n,v){Object.getOwnPropertyDescriptor(("INPUT"===n.tagName?HTMLInputElement:HTMLTextAreaElement).prototype,"value").set.call(n,v);n.dispatchEvent(new Event("input",{bubbles:!0}))}
function sign(from,n){var a=label();if(!a)return null;n=n||composer(from);if(!n)return null;var v=txt(n);if(!v||!v.trim())return null;var s=v.replace(/\s+$/,"");if(s.slice(-a.length)===a)return null;
if("TEXTAREA"===n.tagName)put(n,s+"\n"+a);else if("INPUT"===n.tagName)put(n,s+" "+a);else{n.focus();var g=w.getSelection(),r=d.createRange();r.selectNodeContents(n),r.collapse(!1),g.removeAllRanges(),g.addRange(r),d.execCommand("insertText",!1,"\n"+a);n.dispatchEvent(new Event("input",{bubbles:!0}))}return{n:n,a:a,v:v}}
function btn(ev){if(!on())return;var b=isSend(ev.target);if(b)try{sign(b)}catch(x){}}
d.addEventListener("pointerdown",btn,!0);d.addEventListener("mousedown",btn,!0);d.addEventListener("click",btn,!0);
d.addEventListener("keydown",function(ev){if("Enter"!==ev.key&&" "!==ev.key||!on()||ev.isComposing)return;try{
var b=isSend(ev.target);if(b)return void sign(b);if("Enter"!==ev.key||ev.shiftKey||ev.altKey)return;var n=ev.target&&ev.target.closest&&ev.target.closest(F);if(!n||!field(n))return;
var r=sign(n,n);if(r&&!(ev.ctrlKey||ev.metaKey)){/* plain Enter: undo if GHL did not send (Enter was a new line) */w.setTimeout(function(){try{var now=txt(r.n);if(now&&now.trim()&&now.indexOf("\n"+r.a)>=0&&"TEXTAREA"===r.n.tagName){put(r.n,now.replace("\n"+r.a,""))}}catch(x){}},350)}}catch(x){}},!0);
w[K]={version:"v40",label:label}}(window,document)}catch(t){console.warn("ari sig",t)}
