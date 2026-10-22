/* ari-dashboard v1: 57 blocks from agency-custom-js.tkb2 (6074f435), each isolated */
try{

(function(w){'use strict';
var RX=/^\/v2\/location\/([A-Za-z0-9]+)/,ASK_NAME=/^\s*ask ari\s*$/i,ASK_FALLBACK='1fd2f1f1-6b33-4f91-b8bd-61d8f1f8c854';
function cur(){var m=w.location.pathname.match(RX);return m?m[1]:'';}
var loc=cur();try{if(!loc)loc=w.sessionStorage.getItem('ari-loc')||'';else w.sessionStorage.setItem('ari-loc',loc);}catch(e){}
w.__ariLOC=loc;
var ask='';try{ask=w.localStorage.getItem('ari-ask-menu-id')||'';}catch(e){}
w.__ariAskId=ask||ASK_FALLBACK;
function findAsk(){var as=w.document.querySelectorAll('a[href*="/custom-menu-link/"]');for(var i=0;i<as.length;i++){if(ASK_NAME.test(as[i].textContent||'')){var m=as[i].getAttribute('href').match(/custom-menu-link\/([0-9a-f-]+)/i);if(m)return m[1];}}return '';}
var tries=0,t=w.setInterval(function(){
 var now=cur();
 if(now&&now!==w.__ariLOC){try{var g='ari-loc-reload-'+now;if(!w.sessionStorage.getItem(g)){w.sessionStorage.setItem(g,'1');w.sessionStorage.setItem('ari-loc',now);w.location.reload();return;}}catch(e){}}
 var id=findAsk();if(id){try{w.localStorage.setItem('ari-ask-menu-id',id);}catch(e){} if(id!==w.__ariAskId){w.__ariAskId=id;}}
 if(++tries>240)w.clearInterval(t);
},500);
})(window);


}catch(e){console.warn("ari block 1",e)}
try{

(function(w,d){'use strict';try{if(w.__ariLoadCoverV1)return;
var B='/v2/location/'+window.__ariLOC+'/',H=d.documentElement,A='data-ari-lc',TICK=150,cap=null,poll=null,fadeT=null,stopped=false,lastSec=null,t0=0,limit=0,okN=0,why='',flip=0;
function host(){return ['app.gohighlevel.com','app.zdsihq.com'].indexOf(w.location.hostname)>=0;}
function sub(p){p=p||w.location.pathname;if(!host()||p.indexOf('agency_dashboard')>=0||p.indexOf(B)!==0)return null;return p.slice(B.length);}
function sec(s){if(s==null)return null;
if(/^dashboard(\/|$)/.test(s))return 'home';
if(/^conversations(\/|$)/.test(s))return 'msg';
if(/^calendars(\/|$)/.test(s))return 'cal';
if(/^contacts\/smart_list/.test(s))return 'clients';
if(/^contacts\/detail\//.test(s))return 'client';
if(/^(contacts|custom-menu-link)(\/|$)/.test(s))return 'other';
return null;}
function q(s){return d.querySelector(s);}
function ba(a){return d.body?d.body.getAttribute(a):null;}
function no(r){why=r;return false;}
/* markers taken from the live skin code (cal1+ft1): msg7 sets data-ari-conv-row on list rows; cal8 builds #ari-cal-bar + #ari-ag;
   cl7 / clients-luxe flag the body once #crm-contacts-view is there. */
var READY={
home:function(){if(!(ba('data-ari-shell')==='v1'&&!!ba('data-ari-home1')&&!!(q('.ari-h3-x')||q('#ari-h'))))return no('home-cards');
  if(!q('#location_dashboard-main-content [data-ari-native-widgets="hidden"]'))return no('home-widgets');
  var sk=d.querySelectorAll('#location_dashboard-main-content .n-skeleton,#location_dashboard-main-content [class*="skeleton"]');
  for(var i=0;i<sk.length&&i<25;i++){var e=sk[i];if(e.closest('[data-ari-native-widgets="hidden"],#ari-h,[id^="ari-"],[class*="ari-"]')||e.offsetParent===null)continue;if(e.offsetWidth>40&&e.offsetHeight>8)return no('home-skeleton');}
  return true;},
msg:function(){if(ba('data-ari-msg7')!=='v1')return no('msg7');
  if(q('[data-ari-conv-row],[data-ari-composer-input],[data-ari-composer-bar]'))return true;
  var l=q('#conversations-list');if(l&&!l.querySelector('a[href*="/conversations/conversations/"],input[type="checkbox"]')&&w.performance.now()-t0>1500)return true; /* empty inbox */
  return no('msg-content');},
cal:function(){if(ba('data-ari-cal8')!=='v1')return no('cal8');if(ba('data-ari-cal8-busy'))return no('cal-busy');
  var ag=q('#ari-ag');if(q('#ari-cal-bar')&&ag&&ag.querySelector('.ari-ag-day')&&ag.querySelector('.ari-ag-list'))return true;
  if(q('#ari-cal-bar')&&ba('data-ari-cal-view')==='grid'&&(w.__ariCalFallback||ba('data-ari-cal-mode')!=='month')&&q('.fc-daygrid-day,.fc-timegrid-slot'))return true;
  return no('cal-agenda');},
clients:function(){if(ba('data-ari-cl7')!=='v1'&&ba('data-ari-clients-luxe')!=='v1')return no('cl7');
  if(q('.tabulator-row,.tabulator-placeholder,#crm-contacts-view tbody tr'))return true;
  if(q('[data-ari-col]')&&!q('.tabulator-loader')&&w.performance.now()-t0>1200)return true;
  return no('cl-rows');},
client:function(){return ba('data-ari-cd3')==='v1'||ba('data-ari-contact-card')==='v1'||no('client-card');},
other:function(){return ba('data-ari-shell')==='v1'||no('shell');}};
function clear(){w.clearTimeout(cap);w.clearInterval(poll);cap=poll=null;okN=0;}
function off(r){clear();var v=H.getAttribute(A);if(!v||v==='off')return;H.setAttribute(A,'off');
  w.__ariLoadCoverV1&&(w.__ariLoadCoverV1.last={sec:lastSec,ms:Math.round(w.performance.now()-t0),end:r,wait:why});
  w.clearTimeout(fadeT);fadeT=w.setTimeout(function(){if(H.getAttribute(A)==='off')H.removeAttribute(A);},400);}
function cover(s,ms,first){if(stopped)return;clear();w.clearTimeout(fadeT);t0=w.performance.now();limit=ms;
  if(!s){off('uncovered');return;}
  H.setAttribute(A,first?'f':((flip^=1)?'na':'nb'));cap=w.setTimeout(function(){off('cap');},ms);
  var chk=function(){if(w.performance.now()-t0>=limit){off('cap-late');return;}
    var cur=sec(sub());if(!cur){off('left');return;}if(cur!==lastSec)lastSec=cur; /* follow redirects instead of stalling */
    if(READY[cur]()){why='';if(++okN>=(cur==='home'?3:2))off('ready');}else okN=0;};
  poll=w.setInterval(chk,TICK);}
function nav(p){var s=sec(sub(p));if(s===lastSec)return;lastSec=s;cover(s,4000,false);}
['pushState','replaceState'].forEach(function(k){var o=w.history[k];if(typeof o!=='function')return;w.history[k]=function(){var r=o.apply(this,arguments);try{nav();}catch(e){}return r;};});
w.addEventListener('popstate',function(){try{nav();}catch(e){}});
/* sidebar items may be buttons (phone drawer) rather than links: map their ids too */
var SB={sb_dashboard:'dashboard',sb_conversations:'conversations/conversations',sb_calendars:'calendars/view',sb_contacts:'contacts/smart_list/All'};
d.addEventListener('click',function(e){try{if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey)return;var t=e.target.closest&&e.target.closest('a[href],[id^="sb_"]');if(!t||t.target==='_blank')return;
  var path=null;if(t.tagName==='A'){var u=new URL(t.href,w.location.href);if(u.host!==w.location.host)return;path=u.pathname;}else if(SB[t.id])path=B+SB[t.id];if(!path)return;
  var s=sec(sub(path));if(!s)return;
  if(s!==lastSec||(t.tagName==='A'&&path!==w.location.pathname)){lastSec=s;cover(s,4000,false);return;}
  /* same section (e.g. tapping Messages while already there): cover only if the page is being rebuilt */
  w.setTimeout(function(){try{var v=H.getAttribute(A);if(v&&v!=='off')return;if(sec(sub())===s&&!READY[s]())cover(s,4000,false);}catch(_){}},120);}catch(_){}},true);
lastSec=sec(sub());cover(lastSec,8000,true);
w.__ariLoadCoverV1={version:'v1.4',stop:function(){stopped=true;clear();w.clearTimeout(fadeT);H.removeAttribute(A);},
  status:function(){var s=sec(sub());why='';return {sec:s,state:H.getAttribute(A),ready:s?READY[s]():null,waitingOn:why};},last:null};
}catch(e){try{document.documentElement.removeAttribute('data-ari-lc');}catch(_){}}})(window,document);

}catch(e){console.warn("ari block 2",e)}
try{

(function(w,d){'use strict';var K='__ariClientPageCD3';if(w[K]){w[K].sync();return;}
var B='/v2/location/'+window.__ariLOC+'/contacts/detail/',M='data-ari-cd3',T='data-ari-cd3-t',frame=null,body=null,stopped=false;
var PLAT_SEC=/^(opportunit(y|ies)|workflows?|client portal|payments?|invoices?|memberships?|courses?|communities|affiliate.*|documents? & contracts|proposals?|estimates?|subscriptions?)$/i;
var PLAT_TAB=/^(dnd|actions)$/i;
function txt(n){return (n&&n.textContent||'').replace(/\s+/g,' ').trim();}
function on(){var p=w.location.pathname;return ['app.gohighlevel.com','app.zdsihq.com'].indexOf(w.location.hostname)>-1&&p.indexOf(B)===0&&/^[A-Za-z0-9_-]+\/?$/.test(p.slice(B.length));}
function tag(n,v){if(n&&n.getAttribute(T)!==v)n.setAttribute(T,v);}
function clear(){var m=d.querySelectorAll('['+T+']');for(var i=0;i<m.length;i++)m[i].removeAttribute(T);var h=d.getElementById('ari-cd3-hint');if(h)h.remove();if(body){body.removeAttribute(M);body=null;}}
function sync(){frame=null;if(stopped)return;
 var lhs=on()&&d.body&&!d.getElementById('crm-contacts-view')?d.getElementById('record-details-lhs'):null;
 if(!lhs){if(body)clear();return;}
 if(body&&body!==d.body)clear();body=d.body;if(body.getAttribute(M)!=='v1')body.setAttribute(M,'v1');
 /* tabs */
 var tabs=lhs.querySelectorAll('.hr-tabs-tab,[role="tab"]'),platOpen=false;
 for(var i=0;i<tabs.length;i++){var t=tabs[i],l=txt(t),act=/--active|is-active/.test(t.className)||t.getAttribute('aria-selected')==='true';
  if(PLAT_TAB.test(l)){tag(t,'hide');if(act)platOpen=true;}else if(/^all fields$/i.test(l))tag(t,act?'tab-on':'tab');}
 /* platform sections (by header text) */
 var hs=lhs.querySelectorAll('.hr-collapse-item__header');for(i=0;i<hs.length;i++){var it=hs[i].closest('.hr-collapse-item');var name=txt(hs[i]).replace(/\s*\+?\s*add\s*$/i,'').trim();if(it&&PLAT_SEC.test(name))tag(it,'hide');}
 /* owner / followers / tags / created-by (leaf labels only) */
 var ps=lhs.querySelectorAll('p,span,div');for(i=0;i<ps.length&&i<1500;i++){var n=ps[i];if(n.children.length)continue;var s=txt(n);
  if(/^(owner|followers?)$/i.test(s)){var b=n.closest('.space-y-1')||n.parentElement;if(b&&!b.contains(lhs.querySelector('.record-avatar')))tag(b,'hide');}
  else if(/^tags( ?\(\d+\))?$/i.test(s)){var r=n.closest('.record-tags')||n.parentElement&&n.parentElement.parentElement;if(r&&!r.querySelector('.record-avatar'))tag(r,'hide');}
  else if(/^created (by|on)\b/i.test(s)){var f=n.closest('.mt-auto')||n.parentElement;if(f&&!f.querySelector('#record-blocks-container,.record-avatar'))tag(f,'hide');}}
 var panes=lhs.querySelectorAll('.hr-tab-pane,.hr-tabs-pane-wrapper>*,[role="tabpanel"]');for(i=0;i<panes.length;i++){if(platOpen&&panes[i].offsetParent!==null)tag(panes[i],'hide');else if(!platOpen&&panes[i].getAttribute(T)==='hide')panes[i].removeAttribute(T);}
 var root=d.getElementById('record-details-new-ui');if(root){var hd=root.querySelectorAll('h1,h2,h3,h4,p,span');for(i=0;i<hd.length&&i<800;i++){var h=hd[i];if(h.children.length||!/^associations?$/i.test(txt(h)))continue;
   var p=h;for(var z=0;z<8&&p.parentElement&&p.parentElement!==root;z++){p=p.parentElement;if(/rounded|bg-white|panel/.test(String(p.className||''))&&p.offsetWidth>150)break;}tag(p,'assoc');break;}}
 /* friendly hint when a platform tab is open (its sections are hidden) */
 var hint=d.getElementById('ari-cd3-hint');
 if(platOpen&&!hint){hint=d.createElement('p');hint.id='ari-cd3-hint';hint.textContent='Tap All fields to see this customer\u2019s details.';var tb=lhs.querySelector('#record-details-tabs')||tabs[0]&&tabs[0].parentElement;if(tb&&tb.parentElement)tb.parentElement.insertBefore(hint,tb.nextSibling);}
 else if(!platOpen&&hint)hint.remove();}
function queue(){if(!stopped&&frame===null)frame=w.requestAnimationFrame(sync);}
var mo=new w.MutationObserver(function(){if(on()||body)queue();});mo.observe(d.documentElement,{childList:true,subtree:true});
var tm=w.setInterval(function(){if(on()||body)queue();},500);w.addEventListener('popstate',queue);queue();
w[K]={version:'v2',sync:sync,stop:function(){stopped=true;mo.disconnect();w.clearInterval(tm);clear();delete w[K];},
 get status(){return {on:on(),flag:!!(d.body&&d.body.getAttribute(M)),hidden:d.querySelectorAll('['+T+'="hide"]').length,hint:!!d.getElementById('ari-cd3-hint')};}};
})(window,document);

}catch(e){console.warn("ari block 3",e)}
try{

/* ARI clients1 (Oct 18 2026): speed1 + Clients list/phone fit, Add client drawer, Calendar buttons, Messages tidy, Home "Your day" (block at the end + Home card text). */
/* ARI speed1 (Oct 17 2026): fix6l + 2 speed edits (__ariSoftV1 searches only the open notification drawer; __ariSettingsSkinV1 skips work off Settings). */
/* ARI fix6l (Oct 17 2026): CSS-only change (no gold branch/sprig art); JS = fix6k. */
/* ARI fix6k (Oct 17 2026): Clients list v3.2 waits for a slow platform instead of reloading or going back to All; cell-copy observer idle off the client lists. */
/* ARI raw switch v2 (fix6h): plain view for the admin login only. Runs before everything (also before the fix6g switch, which it
   takes over: it removes ari_raw from the address so the fix6g copy never sees it). ari_raw=1 in the address asks for plain view
   in THIS tab. All Ari scripts wait while the login is checked: the address in the header's profile menu must be on the admin list
   (stored only as a short fingerprint). Admin: the Ari stylesheet goes off and the yellow "Plain view" note shows. Anyone else, or
   no answer within 10 s: the request is dropped and the page reloads normally. A small safety stylesheet stays on the whole time
   in plain view, so the phone/dialer, megaphone, Ask AI, location switcher and Settings are never shown. Tab only, 2 h at most;
   ari_raw=0 or a tap on the note ends it. Nothing is saved in the account. */
(function(w,d){'use strict';
var S='ari-raw-v2',TTL=2*36e5,ADMINS=['0caf16b9'],WAIT=10000;
var src=(w.location.search||'')+(w.location.hash||''),m=/[?&#]ari_raw=([01])(?![0-9A-Za-z_])/.exec(src),want=false;
try{w.sessionStorage.removeItem('ari-raw-v1');}catch(e){}
if(m){try{var u=new w.URL(w.location.href);u.searchParams.delete('ari_raw');u.hash=u.hash.replace(/[#&]?ari_raw=[01]/,'');w.history.replaceState(w.history.state,'',u.pathname+u.search+u.hash);}catch(e){}}
try{if(m){if(m[1]==='1')w.sessionStorage.setItem(S,String(Date.now()));else w.sessionStorage.removeItem(S);}
 var t=+w.sessionStorage.getItem(S)||0;want=t>0&&Date.now()-t<TTL;if(!want&&t)w.sessionStorage.removeItem(S);}catch(e){want=false;}
if(!want){w.__ariRawV2={raw:false};return;}
var noop=function(){},stub={raw:true,sync:noop,reconcile:noop,stop:noop,tick:noop,on:noop,off:noop,openCalendarView:function(){return false;},status:{raw:true}};
var KEYS=['__ariOwnerHomeReviewV1','__ariMessagesSkinV1','__ariMessagesLayoutV2','__ariBookingsSkinV1','__ariBookingsListV2','__ariNavCleanupV1',
 '__ariClientsSkinV1','__ariAskSkinV1','__ariAskBrandV2','__ariMessagesDMV3','__ariSettingsRowV1','__ariNativeDrawerV1','__ariInboxToolsV1',
 '__ariClientMessageChooserV1','__ariSettingsSkinV1','__ariCalmBookingsV1','__ariClientsCalmV1','__ariClientsEmptyV2','__ariChatDrawerV1',
 '__ariPersistentMusicV1','__ariProductLabelsV1','__ariHideCrmAiV1','__ariBellStyleV1','__ariNotifPrivacyV2','__ariSoftV1','__ariLuxeV1',
 '__ariLuxeInstallV1','__ariTopAskV2','__ariDetailsTidyV1','__ariMessagesLuxeV2','__ariCalendarV1','__ariClientsLuxeV1','__ariClientsListV1',
 '__ariHeaderTidyV1','__ariClientsNavV1','__ariContactCardV1','__ariViewportV1'];
for(var i=0;i<KEYS.length;i++)w[KEYS[i]]=stub;
w.__ariHomeScreen=1;
if(!d.getElementById('ari-domain-location-switcher-v1')){var x=d.createElement('style');x.id='ari-domain-location-switcher-v1';(d.head||d.documentElement).appendChild(x);}
/* safety layer: on for the whole plain view (also while the login is checked) */
var safe=d.createElement('style');safe.id='ari-raw-safety';
safe.textContent='button[aria-label="Voice Calling"],#template-power-dialer,[id*="power-dialer"],[id*="dialer" i],#canny_logs-toggle,#PaymentsFeatureDiscovery,#CalendarOnboardingChat,#hl_header--copilot-icon,[aria-label="Ask AI Assistant"],[aria-label="Ask Ari Assistant"],#sb_ask-ai,a[href*="/ask-ai"],.hr-wrapper-container.askai,#location-switcher-sidbar-v2,#sb_settings,#sidebar-v2 a[href*="/settings"]{display:none!important;visibility:hidden!important;pointer-events:none!important}';
(d.head||d.documentElement).appendChild(safe);
var A=['data-ari-no-crm-ai','data-ari-soft','data-ari-luxe','data-ari-lx-canvas','data-ari-msg-luxe','data-ari-login-luxe'];
for(i=0;i<A.length;i++)d.documentElement.removeAttribute(A[i]);
function fnv(s){var h=0x811c9dc5;for(var k=0;k<s.length;k++){h^=s.charCodeAt(k);h=Math.imul(h,0x01000193)>>>0;}return ('0000000'+h.toString(16)).slice(-8);}
/* the login address from the header's profile menu; text pieces are joined with spaces so a name next to it can't run into it */
function login(){var h=d.querySelector('header.hl_header');if(!h)return null;var tw=d.createTreeWalker(h,4),parts=[],nd;while((nd=tw.nextNode())&&parts.length<4000)parts.push(nd.nodeValue);var mm=/(?:^|\s)([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})(?=\s|$)/.exec(parts.join(' '));return mm?mm[1].toLowerCase():null;}
var state='checking',t0=Date.now(),fr=null;
function drop(){state='dropped';try{w.sessionStorage.removeItem(S);}catch(e){}w.location.replace(w.location.pathname+w.location.search+w.location.hash);}
function cssOff(){var s=d.querySelectorAll('style:not([data-ari-raw-off]):not(#ari-raw-safety)');for(var j=0;j<s.length;j++){var c=s[j].textContent||'';
 if(c.indexOf('END ARI LUXE DASHBOARD')>-1||c.indexOf('ARI polish')>-1||c.indexOf('data-ari-no-crm-ai')>-1){s[j].setAttribute('data-ari-raw-off','1');s[j].media='not all';if(s[j].sheet)s[j].sheet.disabled=true;}}}
function note(){if(!d.body||d.getElementById('ari-raw-note'))return;var b=d.createElement('button');b.id='ari-raw-note';b.type='button';
 b.textContent='Plain view (Ari off in this tab). Tap to turn Ari back on.';
 b.setAttribute('style','position:fixed;left:12px;bottom:12px;z-index:2147483647;padding:10px 14px;border:2px solid #111;border-radius:10px;background:#fff8d6;color:#111;font:600 14px/1.3 Arial,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.25)');
 b.addEventListener('click',function(){try{w.sessionStorage.removeItem(S);}catch(e){}w.location.replace(w.location.pathname+w.location.search+w.location.hash);});d.body.appendChild(b);}
function pass(){if(state==='dropped')return;if(!safe.isConnected)(d.head||d.documentElement).appendChild(safe);
 for(var k=0;k<A.length;k++)if(d.documentElement.hasAttribute(A[k]))d.documentElement.removeAttribute(A[k]);
 if(state==='checking'){var e=login();if(e){if(ADMINS.indexOf(fnv(e))>-1)state='admin';else{drop();return;}}else if(Date.now()-t0>WAIT){drop();return;}}
 if(state==='admin'){cssOff();note();}}
function queue(){if(fr===null)fr=w.requestAnimationFrame(function(){fr=null;pass();});}
pass();new w.MutationObserver(queue).observe(d.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:A});var iv=w.setInterval(function(){pass();if(state!=='checking')w.clearInterval(iv);},500);
w.__ariRawV2={raw:true,get state(){return state;}};
})(window,document);

}catch(e){console.warn("ari block 4",e)}
try{

(function(w,d){'use strict';var K='__ariCellDupV1';if(w[K]){w[K].sync();return;}
if(w.__ariRawV2&&w.__ariRawV2.raw)return;
var B='/v2/location/'+window.__ariLOC+'/contacts/smart_list/',A='data-ari-cell-dup',deb=null,frame=null,stopped=false,seen=new WeakMap(),marks=0,list=[],pos=0;
var HIDE=/(^|\s)(opacity-0|invisible|text-transparent|sr-only|hidden|tooltip|copy|overlay|measure)(\s|$)|group-hover:|hover:opacity|peer-hover:/;
function norm(s){return (s||'').replace(/\s+/g,' ').trim().toLowerCase();}
function scoped(){return w.location.protocol==='https:'&&['app.gohighlevel.com','app.zdsihq.com'].indexOf(w.location.hostname)>-1&&w.location.pathname.indexOf(B)===0;}
function clear(){seen=new WeakMap();list=[];pos=0;if(!marks)return;marks=0;var m=d.querySelectorAll('['+A+']');for(var i=0;i<m.length;i++)m[i].removeAttribute(A);}
function cls(x){var c=x.className;return String(c&&c.baseVal!==undefined?c.baseVal:c||'');}
function flagged(e,c){for(var x=e;x&&x!==c;x=x.parentElement){if(HIDE.test(cls(x)))return x;var cs=w.getComputedStyle(x);if(cs.position==='absolute'||cs.position==='fixed')return x;}return null;}
function cell(c){var sig=c.textContent;if(seen.get(c)===sig)return;seen.set(c,sig);var g={},tw=d.createTreeWalker(c,4),nd,dup=false;
 while((nd=tw.nextNode())){var t=norm(nd.nodeValue);if(t.length<3)continue;var e=nd.parentElement;if(!e||e===c)continue;if(g[t])dup=true;(g[t]=g[t]||[]).push(e);}
 if(!dup)return;
 for(var t in g){var es=g[t];if(es.length<2)continue;var f=[],plain=0;
  for(var i=0;i<es.length;i++){var x=flagged(es[i],c);if(x){var other=false;for(var k=0;k<es.length;k++)if(k!==i&&x.contains(es[k]))other=true;if(!other)f.push(x);}else plain++;}
  for(var j=plain?0:1;j<f.length;j++)if(f[j].getAttribute(A)!=='1'){f[j].setAttribute(A,'1');marks++;}}}
function step(){frame=null;if(stopped||!scoped())return;var end=Math.min(pos+80,list.length);for(;pos<end;pos++){try{if(list[pos].isConnected)cell(list[pos]);}catch(e){}}if(pos<list.length)frame=w.requestAnimationFrame(step);}
function sync(){deb=null;if(stopped)return;if(!scoped()||!d.body||d.body.getAttribute('data-ari-clients-luxe')!=='v1'){clear();return;}
 list=d.querySelectorAll('#table-container .tabulator-row .tabulator-cell:is([data-ari-col="email"],[data-ari-col="phone"])');pos=0;if(frame===null)frame=w.requestAnimationFrame(step);}
function queue(){if(stopped)return;w.clearTimeout(deb);deb=w.setTimeout(sync,250);}
var obs=new w.MutationObserver(function(ms){if(!scoped()){if(marks)queue();return;}for(var i=0;i<ms.length;i++){if(ms[i].attributeName===A)continue;queue();return;}});
obs.observe(d.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-ari-col','data-ari-clients-luxe']});
var timer=w.setInterval(function(){if(scoped()||marks)queue();},2000);
w[K]={version:'v2',sync:sync,stop:function(){stopped=true;obs.disconnect();w.clearInterval(timer);w.clearTimeout(deb);if(frame!==null)w.cancelAnimationFrame(frame);clear();delete w[K];},get status(){return {marked:d.querySelectorAll('['+A+']').length};}};
queue();})(window,document);

}catch(e){console.warn("ari block 5",e)}
try{

(function(w,d){'use strict';
var ARI_CLIENTS_LIST={'8otTGBxdVFDsQ1gNhDg0':'QwWXS455gH3irU8rntds'},LIST_NAME=/^(clients|customers)$/i,IDP='ari-clients-list-id-v1:'; /* the id is only a hint now */
var K='__ariClientsListV1',FB='ari-clients-list-fallback-v2',NL='ari-clients-nolist-v1',VIA='ari-clients-list-via-v1',HOPS='ari-clients-list-hops-v1',OKP='ari-clients-list-ok-v1:',
 SETTLE=1200,TAB_WAIT=2000,ROUTER_WAIT=4000,FAST=20000,WAIT=20000,CAP=45000,BUSY_NET=1500;
/* fix6k: the give-up timers below only count time while the platform is not visibly loading (loader on screen or a network
   response in the last 1.5 s), at most 45 s, so a cold, slow platform is waited for instead of reloaded or left for All. */
var netAt=0;try{new w.PerformanceObserver(function(l){var e=l.getEntries();for(var q=0;q<e.length;q++){var t=e[q].responseEnd||0;if(t>netAt)netAt=t;}}).observe({type:'resource',buffered:true});}catch(e){}
var LOADER='.hl-loader-container,.hl-loader,.lds-ring,.tabulator-loader,.n-spin,.n-spin-body,.n-skeleton,[class*="skeleton" i],[class*="spinner" i],[aria-busy="true"]';
function busy(){if(performance.now()-netAt<BUSY_NET)return true;var ls=d.querySelectorAll(LOADER);for(var q=0;q<ls.length&&q<40;q++){var b=ls[q].getBoundingClientRect();if(b.width>0&&b.height>0&&!own(ls[q]))return true;}return false;}
var first=null;
if(w[K]||(w.__ariRawV2&&w.__ariRawV2.raw))return;
var store=(function(){try{var k='ari-ss-test';w.sessionStorage.setItem(k,'1');w.sessionStorage.removeItem(k);return w.sessionStorage;}catch(e){return null;}})();
function get(k){return store?store.getItem(k):null;}function put(k,v){if(!store)return;if(v===null)store.removeItem(k);else store.setItem(k,v);}
function lget(k){try{return w.localStorage.getItem(k);}catch(e){return null;}}function lput(k,v){try{if(v===null)w.localStorage.removeItem(k);else w.localStorage.setItem(k,v);}catch(e){}}
function fnv(s){var h=0x811c9dc5;for(var k=0;k<s.length;k++){h^=s.charCodeAt(k);h=Math.imul(h,0x01000193)>>>0;}return ('0000000'+h.toString(16)).slice(-8);}
var userKeyCache=null;function userKey(){if(userKeyCache)return userKeyCache;var h=d.querySelector('header.hl_header');if(!h)return null;var tw=d.createTreeWalker(h,4),parts=[],nd;while((nd=tw.nextNode())&&parts.length<4000)parts.push(nd.nodeValue);var mm=/(?:^|\s)([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})(?=\s|$)/.exec(parts.join(' '));if(mm)userKeyCache=fnv(mm[1].toLowerCase());return userKeyCache;}
function target(loc){var u=userKey();return u?lget(IDP+u+':'+loc):null;}
function setTarget(loc,id){var u=userKey();if(u)lput(IDP+u+':'+loc,id);}
function isLoc(loc){return Object.prototype.hasOwnProperty.call(ARI_CLIENTS_LIST,loc);}
var flag=/[?&#]ari_nolist=([01])(?![0-9A-Za-z_])/.exec((w.location.search||'')+(w.location.hash||''));
if(flag){if(flag[1]==='1')put(NL,'1');else{put(NL,null);put(FB,null);put(VIA,null);put(HOPS,null);}}
var why=null,timer=null,landed=null,seen=null,barAt=null,lastMove=0,moveVia=null,moveTo=null,lastEvidence=null;
function parse(path){var m=/^\/v2\/location\/([A-Za-z0-9]+)\/contacts\/smart_list\/([A-Za-z0-9_-]+)\/?$/.exec(path||'');return m?{loc:m[1],list:m[2]}:null;}
function listPath(loc,id){return '/v2/location/'+loc+'/contacts/smart_list/'+id;}
function nolist(){return get(NL)==='1';}function fellBack(){return get(FB)==='1';}function off(){return nolist()||fellBack();}
function fallBack(reason){put(FB,'1');why=reason;}
function hops(){var a;try{a=JSON.parse(get(HOPS)||'[]');}catch(e){a=[];}var now=Date.now();return a.filter(function(t){return now-t<600000;});}
function hard(path){/* one full page load, counted; never without session storage (no way to guard a loop) */
 var h=hops();if(!store||h.length>=2){why='page loads used up';return false;}h.push(Date.now());put(HOPS,JSON.stringify(h));
 lastMove=performance.now();moveVia='page';moveTo=path;w.location.assign(path);return true;}
function router(){var a=d.getElementById('app');if(!a)return null;var r=null;
 try{var g=a.__vue_app__&&a.__vue_app__.config&&a.__vue_app__.config.globalProperties;r=g&&g.$router;}catch(e){}
 if(!r)try{r=a.__vue__&&a.__vue__.$router;}catch(e){}
 return r&&typeof r.push==='function'?r:null;}
function viaRouter(path){var r=get(VIA)==='page'?null:router();if(!r)return false;
 try{lastMove=performance.now();moveVia='router';moveTo=path;landed=null;seen=null;var p=r.push(path);if(p&&p.catch)p.catch(function(){});return true;}catch(e){return false;}}
function go(path){return viaRouter(path)?'router':(hard(path)?'page':null);}
function own(n){for(var e=n;e;e=e.parentElement){if(e.id&&/^ari-/.test(e.id))return true;}return false;}
/* The platform's smart-list tab set: the views bar (visible, tucked or hidden tabs) and any open list menu. */
function evidence(id){var bar=d.getElementById('smart-list-views-bar');if(!bar)return null;
 var scopes=[bar];/* fix6i: only the tab row itself (no menus or popovers) */
 for(var s=0;s<scopes.length;s++){var all=scopes[s].querySelectorAll('*');
  for(var i=0;i<all.length;i++){var n=all[i];if(own(n))continue;
   for(var j=0;j<n.attributes.length;j++){if(String(n.attributes[j].value).indexOf(id)>-1)return {how:'id',el:n};}
   if(n.children.length===0&&LIST_NAME.test((n.textContent||'').replace(/\s+/g,' ').trim()))return {how:'name',el:n};}}
 return {how:'none',el:null};}
function root(){return d.getElementById('crm-contacts-view');}
function drawn(){return !!d.querySelector('#crm-contacts-view #table-container,#crm-contacts-view .tabulator');}
function ok(r){return !!r&&!!r.querySelector('.tabulator .tabulator-row,.tabulator .tabulator-placeholder,table tbody tr');}
function denied(r){var s=((r||d.body).textContent||'').replace(/\s+/g,' ');return /smart ?list (was )?not found|list (does not|doesn't) exist|no access to this (smart )?list|(don't|do not) have (access|permission)/i.test(s);}
var pendingId=null;
function txt(n){return (n.textContent||'').replace(/\s+/g,' ').trim();}
function activeIsClients(){var bar=d.getElementById('smart-list-views-bar');if(!bar)return false;var all=bar.querySelectorAll('*');
 for(var i=0;i<all.length;i++){var n=all[i];if(n.children.length||own(n)||!LIST_NAME.test(txt(n)))continue;
  for(var e=n,k=0;e&&e!==bar&&k<4;e=e.parentElement,k++){if(/active|selected/i.test(String(e.className||''))||e.getAttribute('aria-selected')==='true'||e.hasAttribute('aria-current'))return true;}}return false;}
function forget(loc){var u=userKey();if(u)lput(IDP+u+':'+loc,null);}
function onAll(p){landed=null;seen=null;if(off())return;var tgt=target(p.loc),now=performance.now(),here=w.location.href;
 if(moveTo&&moveVia!=='tab'&&now-lastMove<15000){fallBack('the platform went back to All');forget(p.loc);moveTo=null;return;}
 /* fix6i: one move per visit to All. After a tab click: wait; never a second move on top of it (two lists drawn over each other) */
 if(moveVia==='tab'){if(now-lastMove>TAB_WAIT){moveVia=null;tabDoneFor=here;why='the Clients tab did not open a list';}return;}
 if(tabDoneFor===here||movedFor===here)return;
 var bar=d.getElementById('smart-list-views-bar');if(!bar){barAt=null;return;}if(barAt===null)barAt=now;if(now-barAt<SETTLE)return;
 if(activeIsClients()){why='Clients tab already open';movedFor=here;return;}
 if(recentMove())return;
 var ev=evidence(ARI_CLIENTS_LIST[p.loc]);lastEvidence=ev?ev.how:null;
 if(ev&&ev.el){put('ari-clients-list-avail-v1','yes');lastMove=now;moveVia='tab';moveTo=null;movedFor=here;noteMove();try{ev.el.click();}catch(e){moveVia=null;}return;}
 if(tgt){put('ari-clients-list-avail-v1','yes');lastEvidence='remembered';movedFor=here;noteMove();go(listPath(p.loc,tgt));return;}
 movedFor=here;put('ari-clients-list-avail-v1','no');why='no Clients tab for this login';}
var tabDoneFor=null,movedFor=null;
function noteMove(){try{w.sessionStorage.setItem('ari-clients-move-at-v1',String(Date.now()));}catch(e){}}
function recentMove(){try{return Date.now()-(+w.sessionStorage.getItem('ari-clients-move-at-v1')||0)<4000;}catch(e){return false;}}
function tick(){var p=parse(w.location.pathname);if(!p){landed=null;seen=null;barAt=null;tabDoneFor=null;movedFor=null;return;}if(!isLoc(p.loc))return;
 if(/^all$/i.test(p.list)){onAll(p);return;}
 tabDoneFor=null;movedFor=null;
 barAt=null;var tgt=target(p.loc);
 if(moveVia==='tab'){pendingId=p.list;moveVia='tabbed';}
 var mine=p.list===tgt||p.list===pendingId||activeIsClients();if(!mine)return;
 var r=root(),now=performance.now();
 if(ok(r)){setTarget(p.loc,p.list);put('ari-clients-list-avail-v1','yes');if(moveVia==='page')put(VIA,'page');landed=null;seen=null;moveVia=null;moveTo=null;pendingId=null;return;}
 if(landed===null){landed=now;first=now;}if(drawn()&&seen===null)seen=now;if(now-first<CAP&&busy()){landed=now;if(seen!==null)seen=now;}var total=now-landed;
 /* already fell back once in this tab: no new tries; only lead away from a page with nothing drawn (page loads stay counted) */
 if(fellBack()){if(seen===null&&total>FAST){landed=null;go(listPath(p.loc,'All'));}return;}
 if(denied(r)){fallBack('list not accessible');forget(p.loc);landed=null;go(listPath(p.loc,'All'));return;}
 if(moveVia==='router'&&!drawn()&&total>ROUTER_WAIT){put(VIA,'page');landed=null;if(!hard(listPath(p.loc,p.list))){fallBack(why);forget(p.loc);go(listPath(p.loc,'All'));}return;}
 if((seen===null&&total>FAST)||(seen!==null&&now-seen>WAIT)){fallBack(seen===null?'nothing drawn after '+Math.round(total/1000)+' s':'no rows after '+Math.round((now-seen)/1000)+' s');forget(p.loc);landed=null;moveVia=null;pendingId=null;go(listPath(p.loc,'All'));}}
function onClick(e){if(off()||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a||(a.target&&a.target!=='_self'))return;
 var u;try{u=new w.URL(a.href,w.location.href);}catch(_){return;}if(u.origin!==w.location.origin)return;var p=parse(u.pathname);if(!p||!/^all$/i.test(p.list)||!isLoc(p.loc))return;
 /* straight to this login's own Clients list only when it is remembered; otherwise the platform opens All and the tab check runs there */
 var tgt=target(p.loc),here=parse(w.location.pathname);if(!tgt)return;
 e.preventDefault();e.stopImmediatePropagation();if(here&&here.list===tgt)return;go(listPath(p.loc,tgt));}
/* Clients sidebar highlight on every client list (All, all, the shared list): the platform only marks it on /All. */
var NAV='data-ari-nav-current',navLink=null;
function nav(){var p=parse(w.location.pathname),want=!!p&&!!ARI_CLIENTS_LIST[p.loc],a=d.getElementById('sb_contacts');
 if(navLink&&navLink!==a){navLink.classList.remove('active');navLink.removeAttribute(NAV);navLink=null;}
 if(!a)return;
 if(want){if(a.getAttribute(NAV)!=='1'&&!a.classList.contains('active')&&!a.classList.contains('exact-active')){a.setAttribute(NAV,'1');navLink=a;}
  if(a.getAttribute(NAV)==='1'&&!a.classList.contains('active'))a.classList.add('active');}
 else if(a.getAttribute(NAV)==='1'){a.classList.remove('active');a.removeAttribute(NAV);navLink=null;}}
var mo=new w.MutationObserver(function(){nav();}),navEl=null;
function watchNav(){var a=d.getElementById('sb_contacts');if(a&&a!==navEl){mo.disconnect();mo.observe(a,{attributes:true,attributeFilter:['class']});navEl=a;}}
function beat(){try{tick();}catch(e){}try{watchNav();nav();}catch(e){}}
d.addEventListener('click',onClick,true);timer=w.setInterval(beat,250);w.addEventListener('popstate',function(){setTimeout(beat,0);});beat();
w[K]={version:'v3.2',lists:ARI_CLIENTS_LIST,tick:tick,
 off:function(){put(NL,'1');why='turned off by hand';var p=parse(w.location.pathname);if(p&&isLoc(p.loc)&&p.list===target(p.loc))go(listPath(p.loc,'All'));},
 on:function(){put(NL,null);put(FB,null);put(VIA,null);put(HOPS,null);why=null;tick();},
 stop:function(){w.clearInterval(timer);mo.disconnect();d.removeEventListener('click',onClick,true);if(navLink){navLink.classList.remove('active');navLink.removeAttribute(NAV);}delete w[K];},
 get status(){var p=parse(w.location.pathname),tgt=p&&isLoc(p.loc)?target(p.loc):null;return {version:'v3.2',target:tgt,hint:p?ARI_CLIENTS_LIST[p.loc]||null:null,onList:!!p&&!!tgt&&tgt===p.list,user:userKey(),usingAll:off(),nolist:nolist(),fellBack:fellBack(),
  available:get('ari-clients-list-avail-v1'),evidence:lastEvidence,why:why||(fellBack()?'set earlier in this tab':nolist()?'ari_nolist=1':null),via:get(VIA)||(router()?'router':'page'),pageLoads:hops().length};}};
})(window,document);

}catch(e){console.warn("ari block 6",e)}
try{

(function(w,d){'use strict';var K='__ariContactCardV1';if(w[K]){w[K].sync();return;}
var B='/v2/location/'+window.__ariLOC+'/contacts/detail/',ROUTE='data-ari-contact-route',CARD='data-ari-contact-card',T='data-ari-cd',F='data-ari-cd-field',FO='data-ari-cd-folder',PR='data-ari-cd-promo';
var KEY_L=/^(first|last|full|client|contact)? ?name$|phone|mobile|cell|e-?mail|birth|^dob$|^d\.o\.b\.?$|zodiac|star sign|sun sign|^notes?$|^client notes?$|chat summary|^ari /;
var KEY_ID=/(^|[._-])(first_?name|last_?name|full_?name|name|e?mail|phone|mobile|date_?of_?birth|dob|birth_?day|birthday|zodiac\w*|star_?sign|notes?)$/i;
var PLATFORM=/^(contact source|source|contact type|type|time ?zone|company( name)?|business name|street address|address( line \d)?|city|state|postal code|zip( code)?|country|website|dnd.*|assigned to|owner|followers?|created( by| on)?.*|updated.*|last activity|tags?|opportunit.*|lead.*|ip address|referr?er.*|campaign.*|attribution.*|utm.*)$/;
var PROMO=/ask ai|let ai|with ai\b|ai draft|draft (your )?repl|ai assistant|ai agent|ai employee|conversation ai|try ai|ai suggest|powered by ai/i;
var frame=null,timer=null,obs=null,stopped=false,body=null,texts=[];
function txt(n){return (n&&n.textContent||'').replace(/\s+/g,' ').trim();}
function norm(s){return (s||'').replace(/\(\s*\+?\s*\)/g,' ').replace(/[*:+]/g,' ').replace(/\s+/g,' ').trim().toLowerCase();}
function onRoute(){var p=w.location.pathname;return w.location.protocol==='https:'&&['app.gohighlevel.com','app.zdsihq.com'].indexOf(w.location.hostname)>-1&&p.indexOf(B)===0&&/^[A-Za-z0-9_-]+\/?$/.test(p.slice(B.length));}
function tag(n,a,v){if(n&&n.getAttribute(a)!==v)n.setAttribute(a,v);}
function untagAll(){var m=d.querySelectorAll('['+T+'],['+F+'],['+FO+'],['+PR+']');for(var i=0;i<m.length;i++){m[i].removeAttribute(T);m[i].removeAttribute(F);m[i].removeAttribute(FO);m[i].removeAttribute(PR);}
 texts.forEach(function(x){if(x.n.nodeValue===x.to)x.n.nodeValue=x.was;});texts=[];}
function clear(){untagAll();if(body){body.removeAttribute(ROUTE);body.removeAttribute(CARD);body.removeAttribute('data-ari-cd-search');body=null;}}
/* ---- reading a field ---- */
function label(item){var l=item.querySelector('.hr-form-item-label__text')||item.querySelector('.hr-form-item-label')||item.querySelector('label');return l?norm(txt(l)):'';}
function ids(item,box){var s=[];[box,item].concat([].slice.call(item.querySelectorAll('[id],[name],[data-pendo-id]'))).forEach(function(e){if(!e||!e.getAttribute)return;['id','name','data-pendo-id'].forEach(function(a){var v=e.getAttribute(a);if(v)s.push(v);});});return s;}
function isKey(lab,idl){if(lab&&KEY_L.test(lab))return true;for(var i=0;i<idl.length;i++){var v=idl[i].replace(/^contact-details-field-/,'').replace(/^contact\./,'');if(KEY_ID.test(v))return true;}return false;}
function filled(item){
 var f=item.querySelectorAll('input,textarea,select');
 for(var i=0;i<f.length;i++){var e=f[i],t=(e.type||'').toLowerCase();
  if(t==='checkbox'||t==='radio'){if(e.checked)return true;continue;}
  if(t==='hidden'||t==='file')continue;
  if(e.tagName==='SELECT'){if(e.value||e.selectedIndex>0)return true;continue;}
  if(String(e.value||'').trim())return true;}
 if(item.querySelector('img,video,audio,canvas,a[href^="http"],a[href^="mailto"],a[href^="tel"],.hr-tag,.n-tag,.hr-base-selection-tag'))return true;
 /* shown text that isn't the label or a placeholder ("--", "Select…") */
 var blank=item.querySelector('.hr-form-item-blank')||item,tw=d.createTreeWalker(blank,4),nd;
 while((nd=tw.nextNode())){var v=nd.nodeValue.replace(/\s+/g,' ').trim();if(!v)continue;var p=nd.parentElement;
  if(p&&p.closest('label,.hr-form-item-label,[class*="placeholder"],.hr-form-item-feedback,button,.sr-only'))continue;
  if(/^(--|-|—|n\/a|none|select( an option| one)?\.?|choose\.?|upload.*|drag.*|drop.*|browse.*|click to upload.*)$/i.test(v))continue;return true;}
 return false;}
function fields(root){var items=root.querySelectorAll('#record-blocks-container .hr-form-item'),keys=0;
 for(var i=0;i<items.length;i++){var it=items[i],box=it.closest('#field-container,[id="field-container"]')||it,lab=label(it),idl=ids(it,box);
  var kind=isKey(lab,idl)?'key':filled(it)?(lab&&PLATFORM.test(lab)?'platform':'filled'):(lab?(PLATFORM.test(lab)?'platform':'empty'):'unread');
  if(kind==='key')keys++;tag(box,F,kind);}
 return keys;}
function folders(root){var all=[].slice.call(root.querySelectorAll('#record-blocks-container .hr-collapse-item')),contact=null;
 all.forEach(function(f){var h=f.querySelector('.hr-collapse-item__header');var name=norm(h?txt(h):'');if(!contact&&/^contact( info(rmation)?| details)?$/.test(name))contact=f;});
 if(!contact)all.forEach(function(f){if(!contact&&f.querySelector('['+F+'="key"]')&&/first ?name|e-?mail|phone/.test(norm(txt(f))))contact=f;});
 all.forEach(function(f){var fs=f.querySelectorAll('['+F+']'),items=f.querySelectorAll('.hr-form-item');var hide=false;
  if(contact&&f!==contact&&fs.length&&fs.length===items.length){hide=true;for(var k=0;k<fs.length;k++){var c=fs[k].getAttribute(F);if(c!=='empty'&&c!=='platform'){hide=false;break;}}}
  tag(f,FO,f===contact?'contact':hide?'empty':'shown');});
 return !!contact;}
/* ---- the rest of the page ---- */
function card(lhs){var av=lhs.querySelector('.record-avatar');var c=av&&(av.closest('.rounded-md')||av.parentElement&&av.parentElement.parentElement);if(c&&lhs.contains(c))tag(c,T,'card');
 var ps=lhs.querySelectorAll('p,span');for(var i=0;i<ps.length;i++){var n=ps[i],t=txt(n);if(n.children.length)continue;
  if(/^(owner|followers?)$/i.test(t)){var b=n.closest('.space-y-1');if(b&&c&&c.contains(b)){tag(b,T,'hide');var row=b.parentElement;if(row&&row!==c&&[].every.call(row.children,function(x){return x.getAttribute(T)==='hide';}))tag(row,T,'hide');}}
  else if(/^tags( ?\(\d+\))?$/i.test(t)){var r=n.closest('.record-tags');if(r)tag(r,T,'hide');}
  else if(/^created on:/i.test(t)){var fo=n.closest('.mt-auto');if(fo&&!fo.querySelector('#record-blocks-container'))tag(fo,T,'hide');}}}
function relabel(){/* "Contact Details" -> "Client": any text piece reading exactly that on this page, outside the menu, fields and messages */
 var scope=d.getElementById('app')||d.body,tw=d.createTreeWalker(scope,4),nd,list=[];
 while((nd=tw.nextNode()))if(/^\s*contact details\s*$/i.test(nd.nodeValue)&&!(nd.parentElement&&nd.parentElement.closest('#record-blocks-container,#sidebar-v2,#contact-conversation-panel,.message-item,[contenteditable],textarea,script,style')))list.push(nd);
 list.forEach(function(n){var to=n.nodeValue.replace(/contact details/i,'Customer');texts.push({n:n,was:n.nodeValue,to:to});n.nodeValue=to;if(n.parentElement)tag(n.parentElement,T,'title');});}
function pager(root){/* the "1/107" counter: styled quietly, not hidden (its markup isn't confirmed) */
 var scope=root.parentElement||root,tw=d.createTreeWalker(scope,4),nd;while((nd=tw.nextNode())){if(!/^\s*\d+\s*\/\s*\d+\s*$/.test(nd.nodeValue))continue;var e=nd.parentElement;if(!e||e.closest('#record-details-lhs,#contact-conversation-panel,[data-ari-cd="activity"],#record-blocks-container'))continue;tag(e,T,'pager');}}
function promos(){/* AI promo banners anywhere on this page (also before our parts are found) */
 var main=d.querySelector('#app')||d.body,tw=d.createTreeWalker(main,4),nd,hits=[];
 while((nd=tw.nextNode())){if(nd.nodeValue.length>200||!PROMO.test(nd.nodeValue))continue;var e=nd.parentElement;if(!e||e.closest('#sidebar-v2,header.hl_header,textarea,[contenteditable="true"],.message-item,[class*="message"],[class*="bubble"],#record-details-lhs,['+PR+']'))continue;hits.push(e);}
 hits.forEach(function(e){var box=e;for(var k=0;k<6&&box.parentElement;k++){var p=box.parentElement;
   if(txt(p).length>260||p.querySelector('textarea,[contenteditable="true"],#record-details-lhs,.message-item,[class*="chat-bubble"],input[type="text"]')||p.id==='record-details-new-ui'||p===d.body)break;box=p;}
  tag(box,PR,'1');});}
function layout(root,lhs){var rail=null,ic=root.querySelector('#sidebar-contact-icon');if(ic)rail=ic.closest('nav');var act=d.getElementById('contact-conversation-panel');
 if(rail)tag(rail,T,'rail');if(act&&root.contains(act))tag(act,T,'activity');var other=act||rail;if(!other)return;
 var a=lhs;while(a.parentElement&&a.parentElement!==root&&!a.parentElement.contains(other))a=a.parentElement;var row=a.parentElement;
 if(!row||!row.contains(other)||!(root.contains(row)||row===root))return;tag(row,T,'row');tag(a,T,'info');}
function searching(){var i=d.querySelector('#record-tabs-search input');var on=!!(i&&String(i.value||'').trim());var box=d.getElementById('record-tabs-search');if(box)tag(box,T,on?'search-on':'search');return on;}
function sync(){frame=null;if(stopped)return;
 if(!onRoute()||!d.body||d.getElementById('crm-contacts-view')){if(body)clear();return;}
 if(body&&body!==d.body)clear();body=d.body;tag(body,ROUTE,'v1');
 try{promos();}catch(e){}
 try{relabel();}catch(e){}
 var root=d.getElementById('record-details-new-ui'),lhs=root&&root.querySelector('#record-details-lhs');
 if(!root||!lhs||d.body.getAttribute('data-ari-clients-skin')!=='detail'){if(body.hasAttribute(CARD)){body.removeAttribute(CARD);}return;}
 try{if(searching()){var q=root.querySelectorAll('['+F+'],['+FO+']');for(var z=0;z<q.length;z++){q[z].removeAttribute(F);q[z].removeAttribute(FO);}tag(body,CARD,'v1');body.setAttribute('data-ari-cd-search','on');card(lhs);layout(root,lhs);return;}body.removeAttribute('data-ari-cd-search');
  var keys=fields(root);if(!keys){/* not one client field recognised: plain page */var m=root.querySelectorAll('['+F+']');for(var i=0;i<m.length;i++)m[i].removeAttribute(F);body.removeAttribute(CARD);return;}
  folders(root);card(lhs);pager(root);layout(root,lhs);}
 catch(e){untagAll();body.removeAttribute(CARD);return;}
 tag(body,CARD,'v1');}
function queue(){if(!stopped&&frame===null)frame=w.requestAnimationFrame(sync);}
obs=new w.MutationObserver(function(){if(onRoute()||body)queue();});obs.observe(d.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['data-ari-clients-skin']});
timer=w.setInterval(queue,400);w.addEventListener('popstate',queue);
w[K]={version:'v2',sync:sync,stop:function(){stopped=true;obs.disconnect();w.clearInterval(timer);w.removeEventListener('popstate',queue);if(frame!==null)w.cancelAnimationFrame(frame);clear();delete w[K];},
 get status(){var q=function(s){return d.querySelectorAll(s).length;};return {route:!!body,card:!!(body&&body.hasAttribute(CARD)),fields:q('['+F+']'),key:q('['+F+'="key"]'),filled:q('['+F+'="filled"]'),empty:q('['+F+'="empty"]'),platform:q('['+F+'="platform"]'),unread:q('['+F+'="unread"]'),contactFolder:q('['+FO+'="contact"]'),hiddenFolders:q('['+FO+'="empty"]'),promos:q('['+PR+']'),relabeled:texts.length};}};
sync();})(window,document);

}catch(e){console.warn("ari block 7",e)}
try{

(function(w,d){'use strict';var K='__ariViewportV1';if(w[K])return;var t1=null,t2=null,own=false;
function scoped(){return /^\/v2\/location\/[A-Za-z0-9]+\/(conversations|calendars)\//.test(w.location.pathname);}
function nudge(){if(!scoped())return;own=true;try{w.dispatchEvent(new Event('resize'));}catch(e){}own=false;
 ['__ariMessagesLayoutV2','__ariMessagesSkinV1','__ariMessagesLuxeV2','__ariCalendarV1'].forEach(function(k){var a=w[k];try{if(a&&a.reconcile)a.reconcile();else if(a&&a.sync)a.sync();}catch(e){}});
 w.__ariViewportV1.nudges++;}
function on(){if(own)return;if(t1)w.clearTimeout(t1);if(t2)w.clearTimeout(t2);t1=w.setTimeout(nudge,350);t2=w.setTimeout(nudge,1300);}
w.addEventListener('resize',on);w.addEventListener('orientationchange',on);if(w.visualViewport)w.visualViewport.addEventListener('resize',on);
w[K]={nudges:0,stop:function(){w.removeEventListener('resize',on);w.removeEventListener('orientationchange',on);if(w.visualViewport)w.visualViewport.removeEventListener('resize',on);if(t1)w.clearTimeout(t1);if(t2)w.clearTimeout(t2);delete w[K];}};
})(window,document);

}catch(e){console.warn("ari block 8",e)}
try{

(function(w,d){'use strict';
var S='ari-raw-v1',TTL=2*36e5,src=(w.location.search||'')+(w.location.hash||''),m=/[?&#]ari_raw=([01])(?![0-9A-Za-z_])/.exec(src),on=false;
try{if(m){if(m[1]==='1')w.sessionStorage.setItem(S,String(Date.now()));else w.sessionStorage.removeItem(S);}
 var t=+w.sessionStorage.getItem(S)||0;on=t>0&&Date.now()-t<TTL;if(!on&&t)w.sessionStorage.removeItem(S);}catch(e){on=!!m&&m[1]==='1';}
if(!on){w.__ariRawV1={raw:false};return;}
var noop=function(){},stub={raw:true,sync:noop,reconcile:noop,stop:noop,tick:noop,on:noop,off:noop,openCalendarView:function(){return false;},status:{raw:true}};
var KEYS=['__ariOwnerHomeReviewV1','__ariMessagesSkinV1','__ariMessagesLayoutV2','__ariBookingsSkinV1','__ariBookingsListV2','__ariNavCleanupV1',
 '__ariClientsSkinV1','__ariAskSkinV1','__ariAskBrandV2','__ariMessagesDMV3','__ariSettingsRowV1','__ariNativeDrawerV1','__ariInboxToolsV1',
 '__ariClientMessageChooserV1','__ariSettingsSkinV1','__ariCalmBookingsV1','__ariClientsCalmV1','__ariClientsEmptyV2','__ariChatDrawerV1',
 '__ariPersistentMusicV1','__ariProductLabelsV1','__ariHideCrmAiV1','__ariBellStyleV1','__ariNotifPrivacyV2','__ariSoftV1','__ariLuxeV1',
 '__ariLuxeInstallV1','__ariTopAskV2','__ariDetailsTidyV1','__ariMessagesLuxeV2','__ariCalendarV1','__ariClientsLuxeV1','__ariClientsListV1',
 '__ariHeaderTidyV1','__ariClientsNavV1'];
for(var i=0;i<KEYS.length;i++)w[KEYS[i]]=stub;
w.__ariHomeScreen=1;
if(!d.getElementById('ari-domain-location-switcher-v1')){var x=d.createElement('style');x.id='ari-domain-location-switcher-v1';(d.head||d.documentElement).appendChild(x);}
var A=['data-ari-no-crm-ai','data-ari-soft','data-ari-luxe','data-ari-lx-canvas','data-ari-msg-luxe','data-ari-login-luxe'];
for(i=0;i<A.length;i++)d.documentElement.removeAttribute(A[i]);
function cssOff(){var s=d.querySelectorAll('style:not([data-ari-raw-off])');for(var j=0;j<s.length;j++){var c=s[j].textContent||'';
 if(c.indexOf('END ARI LUXE DASHBOARD')>-1||c.indexOf('ARI polish')>-1||c.indexOf('data-ari-no-crm-ai')>-1){s[j].setAttribute('data-ari-raw-off','1');s[j].media='not all';if(s[j].sheet)s[j].sheet.disabled=true;}}}
function note(){if(!d.body||d.getElementById('ari-raw-note'))return;var b=d.createElement('button');b.id='ari-raw-note';b.type='button';
 b.textContent='Plain view (Ari off in this tab). Tap to turn Ari back on.';
 b.setAttribute('style','position:fixed;left:12px;bottom:12px;z-index:2147483647;padding:10px 14px;border:2px solid #111;border-radius:10px;background:#fff8d6;color:#111;font:600 14px/1.3 Arial,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.25)');
 b.addEventListener('click',function(){try{w.sessionStorage.removeItem(S);}catch(e){}var u=new w.URL(w.location.href);u.searchParams.delete('ari_raw');u.hash=u.hash.replace(/[#&]?ari_raw=1/,'');w.location.replace(u.href);});
 d.body.appendChild(b);}
function pass(){cssOff();note();for(var k=0;k<A.length;k++)if(d.documentElement.hasAttribute(A[k]))d.documentElement.removeAttribute(A[k]);}
var fr=null;function queue(){if(fr===null)fr=w.requestAnimationFrame(function(){fr=null;pass();});}
pass();new w.MutationObserver(queue).observe(d.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:A});
w.__ariRawV1={raw:true,since:+w.sessionStorage.getItem(S)||Date.now()};
})(window,document);

}catch(e){console.warn("ari block 9",e)}
try{

(function(w,d){'use strict';
var ARI_CLIENTS_LIST={'8otTGBxdVFDsQ1gNhDg0':'QwWXS455gH3irU8rntds'},LIST_NAME=/^(clients|customers)$/i;
var K='__ariClientsListV1',FB='ari-clients-list-fallback-v2',NL='ari-clients-nolist-v1',VIA='ari-clients-list-via-v1',HOPS='ari-clients-list-hops-v1',OKP='ari-clients-list-ok-v1:',
 SETTLE=1200,TAB_WAIT=2500,ROUTER_WAIT=4000,FAST=5000,WAIT=9000;
if(w[K]||(w.__ariRawV1&&w.__ariRawV1.raw))return;
var store=(function(){try{var k='ari-ss-test';w.sessionStorage.setItem(k,'1');w.sessionStorage.removeItem(k);return w.sessionStorage;}catch(e){return null;}})();
function get(k){return store?store.getItem(k):null;}function put(k,v){if(!store)return;if(v===null)store.removeItem(k);else store.setItem(k,v);}
function lget(k){try{return w.localStorage.getItem(k);}catch(e){return null;}}function lput(k,v){try{if(v===null)w.localStorage.removeItem(k);else w.localStorage.setItem(k,v);}catch(e){}}
var flag=/[?&#]ari_nolist=([01])(?![0-9A-Za-z_])/.exec((w.location.search||'')+(w.location.hash||''));
if(flag){if(flag[1]==='1')put(NL,'1');else{put(NL,null);put(FB,null);put(VIA,null);put(HOPS,null);}}
var why=null,timer=null,landed=null,seen=null,barAt=null,lastMove=0,moveVia=null,moveTo=null,lastEvidence=null;
function parse(path){var m=/^\/v2\/location\/([A-Za-z0-9]+)\/contacts\/smart_list\/([A-Za-z0-9_-]+)\/?$/.exec(path||'');return m?{loc:m[1],list:m[2]}:null;}
function listPath(loc,id){return '/v2/location/'+loc+'/contacts/smart_list/'+id;}
function nolist(){return get(NL)==='1';}function fellBack(){return get(FB)==='1';}function off(){return nolist()||fellBack();}
function fallBack(reason,loc,id){put(FB,'1');why=reason;if(loc&&id)lput(OKP+loc+':'+id,null);}
function remembered(loc,id){return !!lget(OKP+loc+':'+id);}
function hops(){var a;try{a=JSON.parse(get(HOPS)||'[]');}catch(e){a=[];}var now=Date.now();return a.filter(function(t){return now-t<600000;});}
function hard(path){/* one full page load, counted; never without session storage (no way to guard a loop) */
 var h=hops();if(!store||h.length>=2){why='page loads used up';return false;}h.push(Date.now());put(HOPS,JSON.stringify(h));
 lastMove=performance.now();moveVia='page';moveTo=path;w.location.assign(path);return true;}
function router(){var a=d.getElementById('app');if(!a)return null;var r=null;
 try{var g=a.__vue_app__&&a.__vue_app__.config&&a.__vue_app__.config.globalProperties;r=g&&g.$router;}catch(e){}
 if(!r)try{r=a.__vue__&&a.__vue__.$router;}catch(e){}
 return r&&typeof r.push==='function'?r:null;}
function viaRouter(path){var r=get(VIA)==='page'?null:router();if(!r)return false;
 try{lastMove=performance.now();moveVia='router';moveTo=path;landed=null;seen=null;var p=r.push(path);if(p&&p.catch)p.catch(function(){});return true;}catch(e){return false;}}
function go(path){return viaRouter(path)?'router':(hard(path)?'page':null);}
function own(n){for(var e=n;e;e=e.parentElement){if(e.id&&/^ari-/.test(e.id))return true;}return false;}
/* The platform's smart-list tab set: the views bar (visible, tucked or hidden tabs) and any open list menu. */
function evidence(id){var bar=d.getElementById('smart-list-views-bar');if(!bar)return null;
 var scopes=[bar].concat([].slice.call(d.querySelectorAll('[role="menu"],[role="listbox"],.n-dropdown-menu,.hr-dropdown-menu,.n-popover')));
 for(var s=0;s<scopes.length;s++){var all=scopes[s].querySelectorAll('*');
  for(var i=0;i<all.length;i++){var n=all[i];if(own(n))continue;
   for(var j=0;j<n.attributes.length;j++){if(String(n.attributes[j].value).indexOf(id)>-1)return {how:'id',el:n};}
   if(n.children.length===0&&LIST_NAME.test((n.textContent||'').replace(/\s+/g,' ').trim()))return {how:'name',el:n};}}
 return {how:'none',el:null};}
function root(){return d.getElementById('crm-contacts-view');}
function drawn(){return !!d.querySelector('#crm-contacts-view #table-container,#crm-contacts-view .tabulator');}
function ok(r){return !!r&&!!r.querySelector('.tabulator .tabulator-row,.tabulator .tabulator-placeholder,table tbody tr');}
function denied(r){var s=((r||d.body).textContent||'').replace(/\s+/g,' ');return /smart ?list (was )?not found|list (does not|doesn't) exist|no access to this (smart )?list|(don't|do not) have (access|permission)/i.test(s);}
function onAll(p,id){landed=null;seen=null;if(off())return;
 if(moveTo&&performance.now()-lastMove<15000&&(parse(moveTo)||{}).list===id){fallBack('the platform went back to All',p.loc,id);moveTo=null;return;}
 if(moveVia==='tab'){if(performance.now()-lastMove>TAB_WAIT){moveVia=null;go(listPath(p.loc,id));}return;}
 var bar=d.getElementById('smart-list-views-bar');if(!bar){barAt=null;return;}if(barAt===null)barAt=performance.now();
 if(performance.now()-barAt<SETTLE)return;
 var ev=evidence(id);lastEvidence=ev?ev.how:null;
 if(ev&&ev.el){put('ari-clients-list-avail-v1','yes');lastMove=performance.now();moveVia='tab';moveTo=listPath(p.loc,id);try{ev.el.click();}catch(e){moveVia=null;go(moveTo);}return;}
 if(remembered(p.loc,id)){put('ari-clients-list-avail-v1','yes');lastEvidence='remembered';go(listPath(p.loc,id));return;}
 put('ari-clients-list-avail-v1','no');why='list not available to this login (no tab)';}
function tick(){var p=parse(w.location.pathname);if(!p){landed=null;seen=null;barAt=null;return;}var id=ARI_CLIENTS_LIST[p.loc];if(!id)return;
 if(/^all$/i.test(p.list)){onAll(p,id);return;}
 barAt=null;if(p.list!==id)return;
 var r=root(),now=performance.now();
 if(ok(r)){lput(OKP+p.loc+':'+id,String(Date.now()));put('ari-clients-list-avail-v1','yes');if(moveVia==='page')put(VIA,'page');landed=null;seen=null;moveVia=null;moveTo=null;return;}
 if(landed===null)landed=now;if(drawn()&&seen===null)seen=now;var total=now-landed;
 /* already fell back once in this tab: no new tries; only lead away from a page with nothing drawn (page loads stay counted) */
 if(fellBack()){if(seen===null&&total>FAST){landed=null;go(listPath(p.loc,'All'));}return;}
 if(denied(r)){fallBack('list not accessible',p.loc,id);landed=null;go(listPath(p.loc,'All'));return;}
 if(moveVia==='router'&&!drawn()&&total>ROUTER_WAIT&&(remembered(p.loc,id)||get('ari-clients-list-avail-v1')==='yes')){put(VIA,'page');landed=null;if(!hard(listPath(p.loc,id))){fallBack(why,p.loc,id);go(listPath(p.loc,'All'));}return;}
 if((seen===null&&total>FAST)||(seen!==null&&now-seen>WAIT)){fallBack(seen===null?'nothing drawn after '+Math.round(total/1000)+' s':'no rows after '+Math.round((now-seen)/1000)+' s',p.loc,id);landed=null;moveVia=null;go(listPath(p.loc,'All'));}}
function onClick(e){if(off()||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a||(a.target&&a.target!=='_self'))return;
 var u;try{u=new w.URL(a.href,w.location.href);}catch(_){return;}if(u.origin!==w.location.origin)return;var p=parse(u.pathname);if(!p||!/^all$/i.test(p.list)||!ARI_CLIENTS_LIST[p.loc])return;
 var id=ARI_CLIENTS_LIST[p.loc],here=parse(w.location.pathname);
 if(here&&here.list===id){e.preventDefault();e.stopImmediatePropagation();return;}
 /* straight to the list only when it is known to open for this login; otherwise the platform opens All and the check runs there */
 if(get('ari-clients-list-avail-v1')!=='yes'&&!remembered(p.loc,id))return;
 e.preventDefault();e.stopImmediatePropagation();go(listPath(p.loc,id));}
/* Clients sidebar highlight on every client list (All, all, the shared list): the platform only marks it on /All. */
var NAV='data-ari-nav-current',navLink=null;
function nav(){var p=parse(w.location.pathname),want=!!p&&!!ARI_CLIENTS_LIST[p.loc],a=d.getElementById('sb_contacts');
 if(navLink&&navLink!==a){navLink.classList.remove('active');navLink.removeAttribute(NAV);navLink=null;}
 if(!a)return;
 if(want){if(a.getAttribute(NAV)!=='1'&&!a.classList.contains('active')&&!a.classList.contains('exact-active')){a.setAttribute(NAV,'1');navLink=a;}
  if(a.getAttribute(NAV)==='1'&&!a.classList.contains('active'))a.classList.add('active');}
 else if(a.getAttribute(NAV)==='1'){a.classList.remove('active');a.removeAttribute(NAV);navLink=null;}}
var mo=new w.MutationObserver(function(){nav();}),navEl=null;
function watchNav(){var a=d.getElementById('sb_contacts');if(a&&a!==navEl){mo.disconnect();mo.observe(a,{attributes:true,attributeFilter:['class']});navEl=a;}}
function beat(){try{tick();}catch(e){}try{watchNav();nav();}catch(e){}}
d.addEventListener('click',onClick,true);timer=w.setInterval(beat,250);w.addEventListener('popstate',function(){setTimeout(beat,0);});beat();
w[K]={version:'v2',lists:ARI_CLIENTS_LIST,tick:tick,
 off:function(){put(NL,'1');why='turned off by hand';var p=parse(w.location.pathname);if(p&&ARI_CLIENTS_LIST[p.loc]&&p.list===ARI_CLIENTS_LIST[p.loc])go(listPath(p.loc,'All'));},
 on:function(){put(NL,null);put(FB,null);put(VIA,null);put(HOPS,null);why=null;tick();},
 stop:function(){w.clearInterval(timer);mo.disconnect();d.removeEventListener('click',onClick,true);if(navLink){navLink.classList.remove('active');navLink.removeAttribute(NAV);}delete w[K];},
 get status(){var p=parse(w.location.pathname),id=p?ARI_CLIENTS_LIST[p.loc]||null:null;return {version:'v2',listId:id,onList:!!p&&id===p.list,usingAll:off(),nolist:nolist(),fellBack:fellBack(),
  available:get('ari-clients-list-avail-v1'),evidence:lastEvidence,remembered:!!(p&&id&&remembered(p.loc,id)),
  why:why||(fellBack()?'set earlier in this tab':nolist()?'ari_nolist=1':null),via:get(VIA)||(router()?'router':'page'),pageLoads:hops().length};}};
})(window,document);

}catch(e){console.warn("ari block 10",e)}
try{

(function(global){
'use strict';
const KEY='__ariOwnerHomeReviewV1';
if(global[KEY]){global[KEY].reconcile();return;}
const doc=global.document,MARKER='data-ari-owner-theme';
const target=Object.freeze({locationId:''+window.__ariLOC+'',pathname:'/v2/location/'+window.__ariLOC+'/dashboard',hosts:['app.gohighlevel.com','app.zdsihq.com']});
const HOME_TEMPLATE = "<div class=\"lx-home\"><section class=\"lx-hero\" aria-label=\"Welcome\"><span class=\"lx-abs lx-stars\" aria-hidden=\"true\"><svg viewBox=\"0 0 300 200\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"m40 30 1.8 5 5 1.8-5 1.8-1.8 5-1.8-5-5-1.8 5-1.8Z\"/><path d=\"m250 22 1.2 3.3 3.3 1.2-3.3 1.2-1.2 3.3-1.2-3.3-3.3-1.2 3.3-1.2Z\"/><path d=\"m210 150 1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5Z\"/><circle cx=\"150\" cy=\"40\" r=\"1.4\"/><circle cx=\"95\" cy=\"80\" r=\"1\"/><circle cx=\"280\" cy=\"95\" r=\"1.3\"/><circle cx=\"18\" cy=\"120\" r=\"1\"/><circle cx=\"180\" cy=\"100\" r=\".9\"/><circle cx=\"120\" cy=\"170\" r=\"1.1\"/><circle cx=\"60\" cy=\"160\" r=\".8\"/><circle cx=\"230\" cy=\"60\" r=\".8\"/></svg></span><span class=\"lx-abs lx-sprig\" aria-hidden=\"true\"><svg viewBox=\"0 0 160 220\" fill=\"none\" stroke=\"currentColor\" stroke-width=\".9\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M30 215C52 160 80 108 140 14\"/><path d=\"M52 170c-18-3-29-16-28-32 17 3 27 15 28 32Z\"/><path d=\"M57 162c16-10 33-10 42 0-14 12-30 11-42 0Z\"/><path d=\"M73 128c-17-5-25-20-22-36 16 6 24 19 22 36Z\"/><path d=\"M78 120c14-12 32-14 42-5-13 13-29 15-42 5Z\"/><path d=\"M98 86c-14-8-19-22-14-37 14 8 19 21 14 37Z\"/><path d=\"M102 78c13-13 29-17 39-9-12 14-27 17-39 9Z\"/><circle cx=\"140\" cy=\"14\" r=\"2.4\"/><path d=\"M118 52c6-6 6-14 1-20\"/><circle cx=\"119\" cy=\"30\" r=\"1.6\"/></svg></span><span class=\"lx-portrait\" aria-hidden=\"true\"><span class=\"lx-medal\"><img src=\"https://assets.cdn.filesafe.space/8otTGBxdVFDsQ1gNhDg0/media/6ad2e881f9a985d42cca5479.webp\" alt=\"\"></span></span><p class=\"lx-date\"><svg viewBox=\"0 0 24 24\" width=\"15\" height=\"15\" fill=\"#E9D08F\" aria-hidden=\"true\"><path d=\"M15.5 3.5a8.5 8.5 0 1 0 5 15.3A7 7 0 0 1 15.5 3.5Z\"/></svg><span data-ari-moon>Today</span></p><h1><span data-ari-greet>Hello</span>, <em>welcome back</em></h1><p class=\"lx-lede\">Your appointments, conversations and daily work, in one place.</p><a class=\"lx-cta\" href=\"/v2/location/"+window.__ariLOC+"/custom-menu-link/"+window.__ariAskId+"\" data-ari-ask-home-link><svg viewBox=\"0 0 24 24\" width=\"19\" height=\"19\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"10.2\" r=\"6.4\"/><path d=\"M7.6 18.6h8.8l1.1 2.4h-11Z\"/><path d=\"m13.6 7.4.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5Z\"/><path d=\"M8.9 9.6a3.3 3.3 0 0 1 1.7-2.3\"/></svg> Ask Ari</a></section><nav class=\"lx-tiles\" aria-label=\"Main actions\"><a class=\"lx-tile\" href=\"/v2/location/"+window.__ariLOC+"/conversations/conversations\"><span class=\"lx-ic\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 4.5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7.2L7 21v-3.5H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z\"/><path d=\"M8 11h.01M12 11h.01M16 11h.01\" stroke-width=\"2.2\"/></svg></span><strong>Ari Chats</strong><small>Read and reply</small><span class=\"lx-arr\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 12h14M13 6l6 6-6 6\"/></svg></span></a><a class=\"lx-tile\" href=\"/v2/location/"+window.__ariLOC+"/calendars/view\"><span class=\"lx-ic sage\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3.5\" y=\"5\" width=\"17\" height=\"15.5\" rx=\"2.5\"/><path d=\"M8 3v4M16 3v4M3.5 10h17\"/><path d=\"M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01\" stroke-width=\"2\"/></svg></span><strong>Calendar</strong><small>Your appointments</small><span class=\"lx-arr\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 12h14M13 6l6 6-6 6\"/></svg></span></a><a class=\"lx-tile\" href=\"/v2/location/"+window.__ariLOC+"/contacts/smart_list/All\"><span class=\"lx-ic sage\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"9\" cy=\"8.5\" r=\"3.2\"/><path d=\"M3.5 19.5c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5\"/><circle cx=\"16.6\" cy=\"9.4\" r=\"2.5\"/><path d=\"M15.6 14.6c2.4-.3 4.3 1.3 5 4.4\"/></svg></span><strong>Customers</strong><small>Your customer list</small><span class=\"lx-arr\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 12h14M13 6l6 6-6 6\"/></svg></span></a><a class=\"lx-tile\" href=\"/v2/location/"+window.__ariLOC+"/custom-menu-link/"+window.__ariAskId+"\" data-ari-ask-home-link aria-label=\"Ask Ari\"><span class=\"lx-ic\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"10.2\" r=\"6.4\"/><path d=\"M7.6 18.6h8.8l1.1 2.4h-11Z\"/><path d=\"m13.6 7.4.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5Z\"/><path d=\"M8.9 9.6a3.3 3.3 0 0 1 1.7-2.3\"/></svg></span><strong>Ask Ari</strong><small>Your psychic assistant</small><span class=\"lx-arr\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 12h14M13 6l6 6-6 6\"/></svg></span></a></nav><section class=\"lx-update\" aria-label=\"Your day\"><span class=\"lx-abs lx-fili\" aria-hidden=\"true\"><svg viewBox=\"0 0 90 90\" fill=\"none\" stroke=\"currentColor\" stroke-width=\".8\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M2 88V40C2 18 18 2 40 2h48\"/><path d=\"M8 88V44C8 24 24 8 44 8h44\" opacity=\".55\"/><path d=\"M14 30c8 0 14 6 14 14M30 14c0 8 6 14 14 14\"/><circle cx=\"28\" cy=\"28\" r=\"2.2\"/><path d=\"m28 18 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z\" fill=\"currentColor\"/></svg></span><p class=\"lx-eyebrow\">✦ Your day</p><h2><span class=\"lx-day-date\" data-ari-today>Today</span></h2><p>Your readings for today are waiting in your calendar, and new Ari chats are one tap away.</p><div class=\"lx-row\"><a class=\"lx-link\" href=\"/v2/location/"+window.__ariLOC+"/calendars/view\">Today's readings <svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 12h14M13 6l6 6-6 6\"/></svg></a><a class=\"lx-link\" href=\"/v2/location/"+window.__ariLOC+"/conversations/conversations\">Open Ari Chats <svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 12h14M13 6l6 6-6 6\"/></svg></a></div></section></div>";
function mountHomeView(){
const doc=global.document;
const roots=doc.querySelectorAll('#location_dashboard-main-content');
if(roots.length!==1)throw new Error('Expected one verified dashboard root.');
const dashboard=roots[0],regions=dashboard.querySelectorAll('[aria-label="Dashboard widgets"]');
if(regions.length!==1||doc.getElementById('ari-owner-preview'))throw new Error('Dashboard structure differs or preview already exists.');
const widgets=regions[0];
if(widgets.hasAttribute('data-ari-native-widgets'))throw new Error('Widget marker already owned.');
const previousHidden=widgets.getAttribute('hidden');
const container=doc.createElement('section');
container.id='ari-owner-preview';container.className='ari-native-home';container.setAttribute('aria-label','Ari owner home design preview');container.innerHTML=HOME_TEMPLATE;


const restoreLabels=[];const labels=[['sb_dashboard','Home'],['sb_conversations','Ari Chats'],['sb_calendars','Calendar'],['sb_contacts','Customers']];let inserted=false;
function cleanup(){if(inserted)container.remove();widgets.removeAttribute('data-ari-native-widgets');if(previousHidden===null)widgets.removeAttribute('hidden');else widgets.setAttribute('hidden',previousHidden);for(const item of restoreLabels){item.title.replaceChildren(...item.children);if(item.label===null)item.link.removeAttribute('aria-label');else item.link.setAttribute('aria-label',item.label);}}
try{widgets.before(container);inserted=true;for(const[id,label]of labels){const link=doc.getElementById(id),title=link?.querySelector('.nav-title');if(!link||!title)continue;restoreLabels.push({link,title,children:Array.from(title.childNodes),label:link.getAttribute('aria-label')});title.replaceChildren(doc.createTextNode(label));link.setAttribute('aria-label',label);}widgets.setAttribute('data-ari-native-widgets','hidden');widgets.setAttribute('hidden','');return cleanup;}catch(error){cleanup();throw error;}
}
let stopped=false,frame=null,viewCleanup=null,activeBody=null,activeDashboard=null,observer=null,poll=null,lastURL='',lastError=null;
const originals={pushState:global.history.pushState,replaceState:global.history.replaceState};const wrappers={};
function inScope(){return global.location.protocol==='https:'&&target.hosts.includes(global.location.hostname)&&global.location.pathname===target.pathname;}
function clear(){const cleanup=viewCleanup;viewCleanup=null;try{if(cleanup)cleanup();}finally{if(activeBody)activeBody.removeAttribute(MARKER);activeBody=null;activeDashboard=null;}}
function syncLabels(){for(const[id,label]of [['sb_dashboard','Home'],['sb_conversations','Ari Chats'],['sb_calendars','Calendar'],['sb_contacts','Customers']]){const link=doc.getElementById(id),title=link?.querySelector('.nav-title');if(title&&title.textContent!==label)title.textContent=label;if(link&&link.getAttribute('aria-label')!==label)link.setAttribute('aria-label',label);}}
function reconcile(){if(stopped)return;lastURL=global.location.href;if(!inScope()||!doc.body||doc.getElementById('hr-tag-count-wrapper-location-dashboard_tag-edit_mode')){clear();return;}const dashboards=doc.querySelectorAll('#location_dashboard-main-content');const dashboard=dashboards.length===1?dashboards[0]:null;if(viewCleanup&&activeBody===doc.body&&activeDashboard===dashboard&&dashboard?.contains(doc.getElementById('ari-owner-preview'))&&dashboard.querySelector('[data-ari-native-widgets="hidden"]')){syncLabels();return;}clear();if(!dashboard)return;if(doc.body.hasAttribute(MARKER)){lastError='Theme marker already owned';return;}activeBody=doc.body;activeDashboard=dashboard;activeBody.setAttribute(MARKER,'v1');try{viewCleanup=mountHomeView();lastError=null;}catch(error){lastError=error.message;clear();}}
function schedule(){if(stopped||frame!==null)return;frame=global.requestAnimationFrame(()=>{frame=null;reconcile();});}
function routeChange(){clear();schedule();}
function forwardHomeLink(event){
 const owned=event.target.closest?.('#ari-owner-preview a[href]');
 if(!owned||!inScope()||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||owned.hasAttribute('download')||owned.target&&owned.target!=='_self')return false;
 const base=target.pathname.replace(/dashboard$/,'');
 const routes={
  [base+'conversations/conversations']:{id:'sb_conversations',paths:[base+'conversations/conversations']},
  [base+'calendars/appointments']:{id:'sb_calendars',paths:[base+'calendars/appointments',base+'calendars/view']},
  [base+'contacts/smart_list/All']:{id:'sb_contacts',paths:[base+'contacts/smart_list/All',base+'contacts/smart_list/all',base+'contacts/smart_list/QwWXS455gH3irU8rntds']},
  [base+'ask-ai']:{id:'sb_ask-ai',paths:[base+'ask-ai']}
 };
 let destination;try{destination=new global.URL(owned.href,global.location.href);}catch(_){return false;}
 if(destination.origin!==global.location.origin||destination.search||destination.hash)return false;
 if(destination.pathname===base+'calendars/view'){
  const navigation=global.__ariCalmBookingsV1;
  if(typeof navigation?.openCalendarView!=='function'||!navigation.openCalendarView())return false;
  event.preventDefault();return true;
 }
 const route=routes[destination.pathname];if(!route)return false;
 const sidebar=doc.getElementById('sidebar-v2');
 const matches=sidebar?sidebar.querySelectorAll('a#'+route.id+'[href]'):[];
 if(matches.length!==1)return false;
 const native=matches[0];if(native===owned||native.hasAttribute('download')||native.getAttribute('aria-disabled')==='true'||native.target&&native.target!=='_self')return false;
 let url;try{url=new global.URL(native.href,global.location.href);}catch(_){return false;}
 if(url.origin!==global.location.origin||!route.paths.includes(url.pathname)||url.search||url.hash)return false;
 event.preventDefault();native.click();return true;
}
function onLink(event){if(forwardHomeLink(event))return;const link=event.target.closest?.('a[href]');if(!link)return;let url;try{url=new global.URL(link.href,global.location.href);}catch(_){return;}if(url.origin!==global.location.origin||url.pathname!==target.pathname)clear();schedule();}
function stop(){if(stopped)return;stopped=true;if(frame!==null)global.cancelAnimationFrame(frame);if(observer)observer.disconnect();if(poll!==null)global.clearInterval(poll);doc.removeEventListener('click',onLink,true);global.removeEventListener('popstate',routeChange);global.removeEventListener('hashchange',routeChange);doc.removeEventListener('visibilitychange',schedule);for(const key of Object.keys(originals))if(global.history[key]===wrappers[key])global.history[key]=originals[key];clear();if(global[KEY]===api)delete global[KEY];}
const api=Object.freeze({reconcile,stop,target,get status(){return{mounted:!!viewCleanup,inScope:inScope(),lastError};}});global[KEY]=api;
try{for(const key of Object.keys(originals)){wrappers[key]=function(...args){clear();const result=originals[key].apply(this,args);schedule();return result;};global.history[key]=wrappers[key];}global.addEventListener('popstate',routeChange);global.addEventListener('hashchange',routeChange);doc.addEventListener('click',onLink,true);doc.addEventListener('visibilitychange',schedule);observer=new global.MutationObserver(records=>{if(!inScope()){if(viewCleanup)clear();return;}if(records.some(record=>activeDashboard?.contains(record.target)||doc.getElementById('sidebar-v2')?.contains(record.target)||record.target===activeDashboard||(activeDashboard&&record.target.contains?.(activeDashboard))||(!activeDashboard&&record.addedNodes.length>0)||(activeDashboard&&activeDashboard.contains(record.target)&&Array.from(record.removedNodes).some(node=>node.id==='ari-owner-preview'||node.getAttribute?.('aria-label')==='Dashboard widgets'))))schedule();});observer.observe(doc.documentElement,{childList:true,subtree:true});poll=global.setInterval(()=>{if(global.location.href!==lastURL){clear();schedule();}},250);reconcile();}catch(error){stop();throw error;}
})(window);

}catch(e){console.warn("ari block 11",e)}
try{

(function(global){'use strict';const KEY='__ariMessagesSkinV1',MARKER='data-ari-messages-skin',doc=global.document;if(global[KEY]){global[KEY].reconcile();return;}const BASE='/v2/location/'+window.__ariLOC+'/conversations/conversations';const HOSTS=['app.gohighlevel.com','app.zdsihq.com'];let stopped=false,ownedBody=null,frame=null,observer=null,timer=null,lastURL='',gone=0;const labels=[['sb_dashboard','Home'],['sb_conversations','Ari Chats'],['sb_calendars','Calendar'],['sb_contacts','Customers']];let labelBackups=[];
function matches(url){return url.protocol==='https:'&&HOSTS.includes(url.hostname)&&(url.pathname===BASE||url.pathname===BASE+'/');}
function syncLabels(){for(const[id,label]of labels){const link=doc.getElementById(id),title=link?.querySelector('.nav-title');if(!link||!title)continue;if(!labelBackups.some(item=>item.title===title))labelBackups.push({link,title,children:Array.from(title.childNodes),aria:link.getAttribute('aria-label'),label});if(title.textContent!==label)title.replaceChildren(doc.createTextNode(label));if(link.getAttribute('aria-label')!==label)link.setAttribute('aria-label',label);}}
function clear(){const homeOwnsLabels=doc.body?.hasAttribute('data-ari-owner-theme');if(!homeOwnsLabels){for(const item of labelBackups){if(item.title.textContent===item.label)item.title.replaceChildren(...item.children);if(item.link.getAttribute('aria-label')===item.label){if(item.aria===null)item.link.removeAttribute('aria-label');else item.link.setAttribute('aria-label',item.aria);}}}labelBackups=[];if(ownedBody){ownedBody.removeAttribute(MARKER);ownedBody=null;}}
function reconcile(){if(stopped)return;lastURL=global.location.href;if(!matches(global.location)||!doc.body){gone=0;clear();return;}if(!doc.getElementById('conversations-layout')){/* fix6m: the platform briefly rebuilds the list (Unread/All filter). Keep the skin on through that gap; drop it only if the page is still missing after 4 s. */if(ownedBody&&ownedBody===doc.body){const now=global.performance.now();if(!gone)gone=now;else if(now-gone>4000){gone=0;clear();}return;}clear();return;}gone=0;if(ownedBody&&ownedBody!==doc.body)clear();if(!ownedBody){if(doc.body.hasAttribute(MARKER))return;ownedBody=doc.body;}if(ownedBody.getAttribute(MARKER)!=='v1')ownedBody.setAttribute(MARKER,'v1');syncLabels();}
function schedule(){if(stopped||frame!==null)return;frame=global.requestAnimationFrame(()=>{frame=null;reconcile();});}function onRoute(){reconcile();schedule();}function onClick(event){const link=event.target.closest?.('a[href]');if(!link)return;let url;try{url=new global.URL(link.href,global.location.href);}catch(_){return;}if(!matches(url))clear();schedule();}
function stop(){if(stopped)return;stopped=true;if(frame!==null)global.cancelAnimationFrame(frame);if(observer)observer.disconnect();if(timer!==null)global.clearInterval(timer);doc.removeEventListener('click',onClick,true);doc.removeEventListener('visibilitychange',onRoute);global.removeEventListener('popstate',onRoute);global.removeEventListener('hashchange',onRoute);clear();if(global[KEY]===api)delete global[KEY];}
const api=Object.freeze({reconcile,stop,get status(){return{active:!!ownedBody,inScope:matches(global.location)};}});global[KEY]=api;try{doc.addEventListener('click',onClick,true);doc.addEventListener('visibilitychange',onRoute);global.addEventListener('popstate',onRoute);global.addEventListener('hashchange',onRoute);observer=new global.MutationObserver(()=>{if(!matches(global.location)){clear();lastURL=global.location.href;return;}schedule();});observer.observe(doc.documentElement,{childList:true,subtree:true});timer=global.setInterval(()=>{if(gone||global.location.href!==lastURL)reconcile();},150);reconcile();}catch(error){stop();throw error;}})(window);

}catch(e){console.warn("ari block 12",e)}
try{

(function(global){'use strict';const KEY='__ariMessagesLayoutV2',MARK='data-ari-messages-layout',doc=global.document;if(global[KEY]){global[KEY].reconcile();return;}const PATH='/v2/location/'+window.__ariLOC+'/conversations/conversations';const TOOL_IDS=['tb_manial-actions','tb_conversations-templates','tb_trigger-links','tb_conversations-analytics','tb_settings'];let intro=null;let body=null,toolbar=null,host=null,titleRecord=null,tools=[],emptyRecords=[],timer=null,observer=null,frame=null,stopped=false;let toolsOpen=false,threadOpen=false,detailsOpen=false,listOpen=false,convId=null,gone=0;
function inScope(){return global.location.protocol==='https:'&&['app.gohighlevel.com','app.zdsihq.com'].includes(global.location.hostname)&&ROUTE.test(global.location.pathname);}const ROUTE=/^\/v2\/location\/[A-Za-z0-9]+\/conversations\/conversations(?:\/[A-Za-z0-9_-]{6,64})?\/?$/;
function rememberText(node,records){let saved=records.find(r=>r.node===node);if(!saved){saved={node,children:Array.from(node.childNodes),written:null};records.push(saved);}return saved;}
function writeText(saved,text){if(saved.node.textContent!==text)saved.node.replaceChildren(doc.createTextNode(text));saved.written=text;}
function restoreText(saved){if(saved&&saved.node.textContent===saved.written)saved.node.replaceChildren(...saved.children);}
function clear(){if(toolbar)toolbar.remove();toolbar=null;host=null;if(intro)intro.remove();intro=null;for(const link of tools)link.removeAttribute('data-ari-extra-tool');tools=[];restoreText(titleRecord);titleRecord=null;emptyRecords.forEach(restoreText);emptyRecords=[];if(body){body.removeAttribute(MARK);body.removeAttribute('data-ari-list-focus');body.removeAttribute('data-ari-hide-thread');body.removeAttribute('data-ari-hide-details');body.removeAttribute('data-ari-conv-open');body.removeAttribute('data-ari-show-list');}body=null;toolsOpen=false;threadOpen=false;detailsOpen=false;listOpen=false;convId=null;}
function makeButton(text,id,controls){const b=doc.createElement('button');b.type='button';b.id=id;b.textContent=text;b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls',controls);return b;}
function reconcile(){if(stopped)return;const root=doc.getElementById('conversations-layout'),current=doc.getElementById('tb_conversations-tab');if(!inScope()||!doc.body){gone=0;clear();return;}const nav=current?.parentElement;if(!root||!nav?.classList.contains('topmenu-nav')){/* fix6m: list or top bar is being rebuilt (Unread/All filter). Keep the layout on through the gap; give up after 4 s. */if(body&&body===doc.body){const now=global.performance.now();if(!gone)gone=now;else if(now-gone>4000){gone=0;clear();}return;}clear();return;}gone=0;if(body&&(body!==doc.body||host!==nav||!toolbar?.isConnected))clear();if(!body){if(doc.body.hasAttribute(MARK))return;body=doc.body;host=nav;const title=nav.querySelector('.topmenu-navtitle');if(title)titleRecord={node:title,children:Array.from(title.childNodes),written:null};toolbar=doc.createElement('div');toolbar.id='ari-messages-layout-controls';const toolsButton=makeButton('Tools','ari-messages-tools-toggle',TOOL_IDS.join(' '));const threadButton=makeButton('Show conversation panel','ari-messages-thread-toggle','conversations-central-panel-viewer');const detailButton=makeButton('Show customer details','ari-messages-details-toggle','conversations-right-column');toolsButton.addEventListener('click',()=>{toolsOpen=!toolsOpen;reconcile();});threadButton.addEventListener('click',()=>{threadOpen=!threadOpen;reconcile();});detailButton.addEventListener('click',()=>{detailsOpen=!detailsOpen;reconcile();});const listButton=makeButton('All chats','ari-messages-list-toggle','conversations-list');listButton.addEventListener('click',()=>{listOpen=!listOpen;reconcile();});toolbar.append(listButton,toolsButton,threadButton,detailButton);nav.append(toolbar);}
body.setAttribute(MARK,'v2');const openId=global.location.pathname.slice(PATH.length).replace(/^\/|\/$/g,'')||null;if(openId!==convId){convId=openId;listOpen=false;}body.toggleAttribute('data-ari-conv-open',!!openId);body.toggleAttribute('data-ari-show-list',!!openId&&listOpen);const listToggle=doc.getElementById('ari-messages-list-toggle');if(listToggle){listToggle.hidden=!openId;listToggle.setAttribute('aria-expanded',String(listOpen));const listLabel=listOpen?'Back to chat':'All chats';if(listToggle.textContent!==listLabel)listToggle.textContent=listLabel;}const list=doc.getElementById('conversations-list');if(list&&(!intro||!intro.isConnected)){intro=doc.createElement('div');intro.id='ari-messages-list-intro';const symbol=doc.createElement('span');symbol.textContent='\u2727';symbol.setAttribute('aria-hidden','true');const text=doc.createElement('p');text.textContent='Your conversations, in one place.';intro.append(symbol,text);list.prepend(intro);}if(titleRecord)writeText(titleRecord,'Ari Chats');for(const id of TOOL_IDS){const link=doc.getElementById(id);if(!link||link.parentElement!==nav)continue;if(!tools.includes(link))tools.push(link);const value=toolsOpen?'shown':'hidden';if(link.getAttribute('data-ari-extra-tool')!==value)link.setAttribute('data-ari-extra-tool',value);}const empty=doc.getElementById('conversations-empty-state');const emptyVisible=!!empty&&global.getComputedStyle(empty).display!=='none'&&global.getComputedStyle(empty).visibility!=='hidden'&&empty.getAttribute('aria-hidden')!=='true';if(intro)intro.hidden=!emptyVisible;body.toggleAttribute('data-ari-list-focus',emptyVisible);body.toggleAttribute('data-ari-hide-thread',emptyVisible&&!threadOpen);body.toggleAttribute('data-ari-hide-details',emptyVisible&&!detailsOpen);const toolsButton=doc.getElementById('ari-messages-tools-toggle'),threadButton=doc.getElementById('ari-messages-thread-toggle'),detailButton=doc.getElementById('ari-messages-details-toggle');toolsButton.setAttribute('aria-expanded',String(toolsOpen));threadButton.hidden=!emptyVisible;detailButton.hidden=!emptyVisible;threadButton.setAttribute('aria-expanded',String(threadOpen));detailButton.setAttribute('aria-expanded',String(detailsOpen));const threadLabel=threadOpen?'Hide conversation panel':'Show conversation panel',detailsLabel=detailsOpen?'Hide customer details':'Show customer details';if(threadButton.textContent!==threadLabel)threadButton.textContent=threadLabel;if(detailButton.textContent!==detailsLabel)detailButton.textContent=detailsLabel;if(emptyVisible){const selected=root.querySelector('.conversation-list-header button[aria-current="true"]');const unread=selected?.getAttribute('aria-label')==='Unread';const title=doc.getElementById('conversations-empty-title'),message=doc.getElementById('conversations-empty-message');if(title)writeText(rememberText(title,emptyRecords),unread?'You are all caught up.':'Your conversations start here.');if(message)writeText(rememberText(message,emptyRecords),unread?'There are no unread conversations in this inbox.':'Choose a conversation to read and reply. Your inbox controls are still available.');}}
function schedule(){if(stopped||frame!==null)return;frame=global.requestAnimationFrame(()=>{frame=null;reconcile();});}function route(){if(!inScope())clear();schedule();}function stop(){if(stopped)return;stopped=true;if(frame!==null)global.cancelAnimationFrame(frame);if(observer)observer.disconnect();if(timer!==null)global.clearInterval(timer);global.removeEventListener('popstate',route);global.removeEventListener('hashchange',route);doc.removeEventListener('click',pick,true);clear();if(global[KEY]===api)delete global[KEY];}function pick(e){if(!listOpen)return;const t=e.target;if(!t||!t.closest||!t.closest('#conversations-list'))return;if(t.closest('.conversation-list-header,input,label,[role="checkbox"],#ari-messages-list-intro'))return;global.setTimeout(()=>{listOpen=false;reconcile();},250);}doc.addEventListener('click',pick,true);const api=Object.freeze({reconcile,stop});global[KEY]=api;global.addEventListener('popstate',route);global.addEventListener('hashchange',route);observer=new global.MutationObserver(records=>{if(!inScope()){clear();return;}if(records.some(r=>!toolbar?.contains(r.target)))schedule();});observer.observe(doc.documentElement,{childList:true,subtree:true});let lastHref=global.location.href;timer=global.setInterval(()=>{if(global.location.href!==lastHref){lastHref=global.location.href;route();}},250);/* chatsfix3 */reconcile();})(window);

}catch(e){console.warn("ari block 13",e)}
try{

(function(global){'use strict';const KEY='__ariBookingsSkinV1',MARKER='data-ari-bookings-skin',doc=global.document;if(global[KEY]){global[KEY].reconcile();return;}const BASE='/v2/location/'+window.__ariLOC+'/calendars/';const HOSTS=['app.gohighlevel.com','app.zdsihq.com'];const labels=[['sb_dashboard','Home'],['sb_conversations','Ari Chats'],['sb_calendars','Calendar'],['sb_contacts','Customers']];let stopped=false,ownedBody=null,frame=null,observer=null,timer=null,lastURL='',labelBackups=[],headingBackups=[];
function route(url){if(url.protocol!=='https:'||!HOSTS.includes(url.hostname))return null;const path=url.pathname.endsWith('/')?url.pathname.slice(0,-1):url.pathname;if(path===BASE+'view')return 'view';if(path===BASE+'appointments')return 'appointments';return null;}
function restoreText(item){if(item.node.textContent===item.written)item.node.replaceChildren(...item.children);}
function clear(){const otherSkinOwnsLabels=doc.body?.hasAttribute('data-ari-owner-theme')||doc.body?.hasAttribute('data-ari-messages-skin');if(!otherSkinOwnsLabels){for(const item of labelBackups){if(item.title.textContent===item.label)item.title.replaceChildren(...item.children);if(item.link.getAttribute('aria-label')===item.label){if(item.aria===null)item.link.removeAttribute('aria-label');else item.link.setAttribute('aria-label',item.aria);}}}headingBackups.forEach(restoreText);headingBackups=[];labelBackups=[];if(ownedBody){ownedBody.removeAttribute(MARKER);ownedBody=null;}}
function syncLabels(){for(const[id,label]of labels){const link=doc.getElementById(id),title=link?.querySelector('.nav-title');if(!link||!title)continue;if(!labelBackups.some(item=>item.title===title))labelBackups.push({link,title,children:Array.from(title.childNodes),aria:link.getAttribute('aria-label'),label});if(title.textContent!==label)title.replaceChildren(doc.createTextNode(label));if(link.getAttribute('aria-label')!==label)link.setAttribute('aria-label',label);}const tab=doc.getElementById('tb_calendars-tab'),nav=tab?.parentElement;const heading=nav?.classList.contains('topmenu-nav')?nav.querySelector('.topmenu-navtitle'):null;if(heading){if(!headingBackups.some(item=>item.node===heading))headingBackups.push({node:heading,children:Array.from(heading.childNodes),written:'Calendar'});if(heading.textContent!=='Calendar')heading.replaceChildren(doc.createTextNode('Calendar'));}}
function reconcile(){if(stopped)return;lastURL=global.location.href;const mode=route(global.location),root=mode==='view'?'calendar-page-parent-container':mode==='appointments'?'AppointmentList':null;if(!root||!doc.body||!doc.getElementById(root)){clear();return;}if(ownedBody&&ownedBody!==doc.body)clear();if(!ownedBody){if(doc.body.hasAttribute(MARKER))return;ownedBody=doc.body;}if(ownedBody.getAttribute(MARKER)!==mode)ownedBody.setAttribute(MARKER,mode);syncLabels();}
function schedule(){if(stopped||frame!==null)return;frame=global.requestAnimationFrame(()=>{frame=null;reconcile();});}function onRoute(){reconcile();schedule();}function onClick(event){const link=event.target.closest?.('a[href]');if(!link)return;let url;try{url=new global.URL(link.href,global.location.href);}catch(_){return;}if(!route(url))clear();schedule();}
function stop(){if(stopped)return;stopped=true;if(frame!==null)global.cancelAnimationFrame(frame);if(observer)observer.disconnect();if(timer!==null)global.clearInterval(timer);doc.removeEventListener('click',onClick,true);doc.removeEventListener('visibilitychange',onRoute);global.removeEventListener('popstate',onRoute);global.removeEventListener('hashchange',onRoute);clear();if(global[KEY]===api)delete global[KEY];}const api=Object.freeze({reconcile,stop,get status(){return{active:!!ownedBody,view:route(global.location)};}});global[KEY]=api;try{doc.addEventListener('click',onClick,true);doc.addEventListener('visibilitychange',onRoute);global.addEventListener('popstate',onRoute);global.addEventListener('hashchange',onRoute);observer=new global.MutationObserver(()=>{if(!route(global.location)){clear();lastURL=global.location.href;return;}schedule();});observer.observe(doc.documentElement,{childList:true,subtree:true});timer=global.setInterval(()=>{if(global.location.href!==lastURL)reconcile();},150);reconcile();}catch(error){stop();throw error;}})(window);

}catch(e){console.warn("ari block 14",e)}
try{

(function(global){'use strict';const KEY='__ariBookingsListV2',MARK='data-ari-bookings-list',doc=global.document;if(global[KEY]){global[KEY].reconcile();return;}const PATH='/v2/location/'+window.__ariLOC+'/calendars/appointments',BASE='/v2/location/'+window.__ariLOC+'';let body=null,root=null,toolbar=null,status=null,selected=null,busy=false,epoch=0,stopped=false,frame=null,observer=null,timer=null,labelBackup=null,emptyBackup=null,emptyMessageBackup=null,lastURL='',moreOpen=false,toolBackups=[];const norm=s=>(s||'').replace(/\s+/g,' ').trim();function scope(){return global.location.protocol==='https:'&&['app.gohighlevel.com','app.zdsihq.com'].includes(global.location.hostname)&&(global.location.pathname===PATH||global.location.pathname===PATH+'/');}function visible(el){return !!el&&el.isConnected&&el.getClientRects().length>0&&global.getComputedStyle(el).visibility!=='hidden';}function say(text){if(status)status.textContent=text;}function currentDrawer(){const nodes=doc.querySelectorAll('#calendar-advanced-filter-drawer');return nodes.length===1&&visible(nodes[0])?nodes[0]:null;}function one(node,selector){const nodes=node.querySelectorAll(selector);return nodes.length===1?nodes[0]:null;}function openNativeSelect(control){const target=control.matches('.n-base-selection-label')?control:control.querySelector('.n-base-selection-label');if(!target)throw Error('Open the native filter and choose the date manually.');target.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,cancelable:true,button:0,buttons:1}));target.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,cancelable:true,button:0,buttons:0}));target.click();}function inspectFilter(drawer){const form=one(drawer,'#smartlist-filter');if(!form||drawer.querySelectorAll('#field-value').length!==1)return null;const field=one(form,'#field-value .n-base-selection-label'),operator=one(form,'[id="2"] .n-base-selection-label'),date=one(form,'#date-operator-select .n-base-selection-label'),fieldBox=one(form,'#field-value'),fieldName=norm(field?.getAttribute('title')||field?.textContent),disabledOperator=form.querySelectorAll('[id="2"] input:disabled').length>0||form.querySelectorAll('input[id="2"]:disabled').length===1,blankField=!fieldName||fieldName.toLowerCase()==='please select';if(fieldBox&&blankField&&!date&&(!operator||disabledOperator))return{blank:true,field:fieldBox};if(!field||!operator||!date)return null;if(fieldName!=='Appointment time'||norm(operator.getAttribute('title')||operator.textContent)!=='Is')return null;return{blank:false,date,value:norm(date.getAttribute('title')||date.textContent)};}function refreshButtons(){if(!toolbar)return;toolbar.querySelectorAll('[data-ari-day]').forEach(b=>{b.disabled=busy;b.setAttribute('aria-pressed',String(selected===b.getAttribute('data-ari-day')));});const choose=toolbar.querySelector('#ari-bookings-choose-day');if(choose)choose.disabled=busy;}function invalidate(){selected=null;refreshButtons();}function cancelPending(){epoch++;busy=false;invalidate();}function waitFor(read,token){return new Promise((resolve,reject)=>{const until=Date.now()+2500;function check(){if(stopped||token!==epoch||!scope())return reject(new Error('Canceled'));let value;try{value=read();}catch(_){}if(value)return resolve(value);if(Date.now()>=until)return reject(new Error('Native filter did not become ready'));global.setTimeout(check,60);}check();});}async function openDrawer(token){if(currentDrawer())return currentDrawer();const trigger=doc.getElementById('btn-toggle-filter-list');if(!trigger)throw Error('Filter control unavailable');trigger.click();return waitFor(currentDrawer,token);}async function applyRelative(day){if(busy||!scope())return;busy=true;selected=null;const token=++epoch;refreshButtons();say('Opening appointment filters...');try{let drawer=await openDrawer(token),filter=inspectFilter(drawer);if(!filter)throw Error('Use the native filters: this view has additional or unrecognized filters.');if(filter.blank){openNativeSelect(filter.field);const fieldOption=await waitFor(()=>{const matches=Array.from(doc.querySelectorAll('.n-base-select-option')).filter(el=>visible(el)&&norm(el.querySelector('p')?.textContent)==='Appointment time');return matches.length===1?matches[0]:null;},token);fieldOption.click();filter=await waitFor(()=>{const next=inspectFilter(drawer);return next&&!next.blank?next:null;},token);}openNativeSelect(filter.date);const option=await waitFor(()=>{const matches=Array.from(doc.querySelectorAll('.n-base-select-option')).filter(el=>visible(el)&&norm(el.querySelector('p')?.textContent)===day);return matches.length===1?matches[0]:null;},token);option.click();await waitFor(()=>{const current=inspectFilter(drawer);return current?.value===day?current:null;},token);const apply=one(drawer,'#drawer-component-btn-positive-action');if(!apply||apply.disabled)throw Error('Apply is not available. Finish in the native filters.');apply.click();await waitFor(()=>!currentDrawer(),token);drawer=await openDrawer(token);filter=inspectFilter(drawer);if(!filter||filter.value!==day)throw Error('The applied day could not be verified. Check the native filters.');const close=one(drawer,'#drawer-component-btn-negative-action');if(!close||close.disabled)throw Error('The day is visible in native filters; close the drawer to continue.');close.click();await waitFor(()=>!currentDrawer(),token);selected=day;say('Showing '+day.toLowerCase()+' using your native appointment filter.');}catch(error){if(token===epoch&&scope())say(error.message==='Canceled'?'Filter shortcut canceled.':error.message);}finally{if(token===epoch){busy=false;refreshButtons();}}}async function chooseDay(){if(busy||!scope())return;cancelPending();const token=epoch;busy=true;refreshButtons();try{await openDrawer(token);say('Choose Appointment time > Is > On, select a date, then Apply. Existing filters are preserved.');}catch(error){if(scope()&&token===epoch)say(error.message);}finally{if(token===epoch){busy=false;refreshButtons();}}}function restore(){cancelPending();if(toolbar)toolbar.remove();toolbar=null;status=null;if(labelBackup){if(labelBackup.node.nodeValue==='Add booking')labelBackup.node.nodeValue=labelBackup.text;if(labelBackup.button.getAttribute('aria-label')==='Add booking'){if(labelBackup.aria===null)labelBackup.button.removeAttribute('aria-label');else labelBackup.button.setAttribute('aria-label',labelBackup.aria);}}labelBackup=null;if(emptyBackup&&emptyBackup.node.textContent==='No appointments to show in this view.')emptyBackup.node.replaceChildren(...emptyBackup.children);emptyBackup=null;if(emptyMessageBackup&&emptyMessageBackup.node.textContent==='Use Add booking when you are ready, or try a different day.')emptyMessageBackup.node.replaceChildren(...emptyMessageBackup.children);emptyMessageBackup=null;toolBackups.forEach(el=>el.removeAttribute('data-ari-booking-tool'));toolBackups=[];moreOpen=false;if(body){body.removeAttribute(MARK);body.removeAttribute('data-ari-bookings-empty');}body=null;root=null;}function syncTools(){const ids=['btn-add-smart-list','btn-toggle-smart-list','btn-toggle-filter-list','btn-toggle-sort-list','btn-toggle-column-list','btn-save-smart-list'],found=ids.map(id=>doc.getElementById(id)).filter(el=>el&&root.contains(el));for(const el of found){if(!toolBackups.includes(el))toolBackups.push(el);const value=moreOpen?'shown':'hidden';if(el.getAttribute('data-ari-booking-tool')!==value)el.setAttribute('data-ari-booking-tool',value);}const toggle=toolbar?.querySelector('#ari-bookings-more-options');if(toggle)toggle.setAttribute('aria-expanded',String(moreOpen));const empty=doc.getElementById('appointmentsEmptyState'),noRows=root.querySelectorAll('.n-data-table-table tbody tr').length===0;body.toggleAttribute('data-ari-bookings-empty',visible(empty)&&noRows);}function syncNativeCopy(){const button=doc.getElementById('book-appointment');if(button){const walker=doc.createTreeWalker(button,global.NodeFilter.SHOW_TEXT);let textNode;while((textNode=walker.nextNode())){if(norm(textNode.nodeValue)==='New appointment'){if(!labelBackup||labelBackup.node!==textNode)labelBackup={node:textNode,text:textNode.nodeValue,button,aria:button.getAttribute('aria-label')};textNode.nodeValue='Add booking';button.setAttribute('aria-label','Add booking');break;}}}const empty=doc.getElementById('appointmentsEmptyState'),leafDivs=empty?Array.from(empty.children).filter(el=>el.tagName==='DIV'&&el.childElementCount===0&&norm(el.textContent)):[],heading=leafDivs.length===2?leafDivs[0]:null,paragraph=leafDivs.length===2?leafDivs[1]:null;if(paragraph){if(!emptyMessageBackup||emptyMessageBackup.node!==paragraph)emptyMessageBackup={node:paragraph,children:Array.from(paragraph.childNodes)};if(paragraph.textContent!=='Use Add booking when you are ready, or try a different day.')paragraph.replaceChildren(doc.createTextNode('Use Add booking when you are ready, or try a different day.'));}if(heading){if(!emptyBackup||emptyBackup.node!==heading)emptyBackup={node:heading,children:Array.from(heading.childNodes)};if(heading.textContent!=='No appointments to show in this view.')heading.replaceChildren(doc.createTextNode('No appointments to show in this view.'));}}function reconcile(){if(stopped)return;lastURL=global.location.href;const found=doc.getElementById('AppointmentList');if(!scope()||!doc.body||!found){restore();return;}if(body&&(body!==doc.body||root!==found||!toolbar?.isConnected))restore();if(!body){if(doc.body.hasAttribute(MARK))return;body=doc.body;root=found;body.setAttribute(MARK,'v2');toolbar=doc.createElement('section');toolbar.id='ari-bookings-list-toolbar';toolbar.setAttribute('aria-label','Booking day shortcuts');const heading=doc.createElement('h2');heading.textContent='Your appointments';const controls=doc.createElement('div');controls.className='ari-bookings-day-controls';for(const day of ['Today','Tomorrow']){const b=doc.createElement('button');b.type='button';b.textContent=day;b.setAttribute('data-ari-day',day);b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>applyRelative(day));controls.append(b);}const choose=doc.createElement('button');choose.type='button';choose.id='ari-bookings-choose-day';choose.textContent='Choose day';choose.addEventListener('click',chooseDay);controls.append(choose);const full=doc.createElement('a');full.href=BASE+'/calendars/view';full.textContent='Full calendar';full.className='ari-full-calendar';controls.append(full);const more=doc.createElement('button');more.type='button';more.id='ari-bookings-more-options';more.textContent='More options';more.setAttribute('aria-expanded','false');more.setAttribute('aria-controls','btn-add-smart-list btn-toggle-smart-list btn-toggle-filter-list btn-toggle-sort-list btn-toggle-column-list btn-save-smart-list');more.addEventListener('click',()=>{moreOpen=!moreOpen;syncTools();});controls.append(more);status=doc.createElement('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.textContent='Use a day shortcut or your existing list filters.';toolbar.append(heading,controls,status);root.prepend(toolbar);}syncNativeCopy();syncTools();refreshButtons();}function schedule(){if(stopped||frame!==null)return;frame=global.requestAnimationFrame(()=>{frame=null;reconcile();});}function route(){if(!scope())restore();schedule();}function userAction(event){if(toolbar?.contains(event.target))return;if(busy&&event.isTrusted){cancelPending();say('Shortcut stopped. Continue with the native controls.');return;}if(!busy&&selected){invalidate();say('Native controls changed. Choose a day to verify its filter again.');}if(event.type==='click'){const link=event.target.closest?.('a[href]');if(link){let url;try{url=new global.URL(link.href,global.location.href);}catch(_){return;}if(url.pathname!==PATH&&url.pathname!==PATH+'/')restore();}}}function stop(){if(stopped)return;stopped=true;if(frame!==null)global.cancelAnimationFrame(frame);if(observer)observer.disconnect();if(timer!==null)global.clearInterval(timer);['click','input','change'].forEach(name=>doc.removeEventListener(name,userAction,true));global.removeEventListener('popstate',route);global.removeEventListener('hashchange',route);restore();if(global[KEY]===api)delete global[KEY];}const api=Object.freeze({reconcile,stop,get status(){return{active:!!body,selectedDay:selected,busy};}});global[KEY]=api;try{['click','input','change'].forEach(name=>doc.addEventListener(name,userAction,true));global.addEventListener('popstate',route);global.addEventListener('hashchange',route);observer=new global.MutationObserver(records=>{if(!scope()){restore();return;}if(records.some(r=>!toolbar?.contains(r.target)))schedule();});observer.observe(doc.documentElement,{childList:true,subtree:true});timer=global.setInterval(()=>{if(global.location.href!==lastURL)route();},150);reconcile();}catch(error){stop();throw error;}})(window);

}catch(e){console.warn("ari block 15",e)}
try{

(function(w){'use strict';const K='__ariNavCleanupV1',d=w.document,B='/v2/location/'+window.__ariLOC+'/',M='data-ari-nav-cleanup',R='data-ari-calendar-tool';if(w[K]){w[K].sync();return;}let mode='',closed=false,expanded=false,links=[],toggle=null,body=null,frame=null,stopped=false,last='';function route(){if(w.location.protocol!=='https:'||!['app.gohighlevel.com','app.zdsihq.com'].includes(w.location.hostname))return '';const p=w.location.pathname.replace(/\/$/,'');if(p===B+'calendars/view')return 'view';if(p===B+'settings/calendars'||p.startsWith(B+'settings/calendars/'))return 'settings';return '';}function unmount(){links.forEach(link=>link.removeAttribute(R));if(toggle)toggle.remove();links=[];toggle=null;if(body)body.removeAttribute(M);body=null;}function visible(el){return !!el&&el.getClientRects().length>0&&w.getComputedStyle(el).visibility!=='hidden';}function sync(){if(stopped)return;last=w.location.href;const next=route();if(next!==mode){unmount();mode=next;closed=false;expanded=false;}if(!mode||!d.body)return;if(body!==d.body){unmount();body=d.body;body.setAttribute(M,mode);}if(mode==='view'){if(!closed&&d.getElementById('calendar-page-parent-container')){const drawer=d.getElementById('calendar-view-filter-drawer'),close=d.getElementById('close-filter-drawer');if(visible(drawer)&&visible(close)&&drawer.contains(close)){closed=true;close.click();}}return;}const candidates=[['tb_rentals','rentals'],['tb_connections','connections-new']].map(([id,path])=>{const a=d.querySelector('a#'+id);if(!a)return null;try{const u=new w.URL(a.href,w.location.href);return u.origin===w.location.origin&&u.pathname===B+'settings/calendars/'+path?a:null;}catch(_){return null;}}).filter(Boolean);if(!candidates.length){if(links.length||toggle){unmount();body=d.body;body.setAttribute(M,mode);}return;}if(candidates.length!==links.length||candidates.some((a,i)=>a!==links[i])||!toggle?.isConnected){links.forEach(a=>a.removeAttribute(R));if(toggle)toggle.remove();links=candidates;toggle=d.createElement('button');toggle.type='button';toggle.id='ari-calendar-more-tools';toggle.textContent='More tools';toggle.setAttribute('aria-controls',links.map(a=>a.id).join(' '));toggle.addEventListener('click',()=>{expanded=!expanded;sync();});links[links.length-1].insertAdjacentElement('afterend',toggle);}const state=expanded?'shown':'hidden';links.forEach(a=>{if(a.getAttribute(R)!==state)a.setAttribute(R,state);});if(toggle.getAttribute('aria-expanded')!==String(expanded))toggle.setAttribute('aria-expanded',String(expanded));}function queue(){if(!stopped&&frame===null)frame=w.requestAnimationFrame(()=>{frame=null;sync();});}function click(e){if(route()==='view'&&e.target.closest?.('#customizations-button')){if(mode!=='view'){unmount();mode='view';expanded=false;}closed=true;}const a=e.target.closest?.('a[href]');if(a&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey&&e.button===0&&(!a.target||a.target==='_self')){try{const u=new w.URL(a.href,w.location.href);if(u.origin!==w.location.origin||u.pathname.replace(/\/$/,'')!==w.location.pathname.replace(/\/$/,'')){unmount();mode='';closed=false;expanded=false;}}catch(_){}}queue();}const obs=new w.MutationObserver(queue);obs.observe(d.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','hidden']});d.addEventListener('click',click,true);w.addEventListener('popstate',queue);w.addEventListener('hashchange',queue);const timer=w.setInterval(()=>{if(last!==w.location.href)sync();},150);w[K]={sync,stop(){stopped=true;obs.disconnect();w.clearInterval(timer);if(frame!==null)w.cancelAnimationFrame(frame);d.removeEventListener('click',click,true);w.removeEventListener('popstate',queue);w.removeEventListener('hashchange',queue);unmount();delete w[K];}};sync();})(window);

}catch(e){console.warn("ari block 16",e)}
try{

(function(global){'use strict';const KEY='__ariClientsSkinV1',MARKER='data-ari-clients-skin',doc=global.document;if(global[KEY]){global[KEY].reconcile();return;}const BASE='/v2/location/'+window.__ariLOC+'/contacts/',HOSTS=['app.gohighlevel.com','app.zdsihq.com'],labels=[['sb_dashboard','Home'],['sb_conversations','Ari Chats'],['sb_calendars','Calendar'],['sb_contacts','Customers']];let addBackup=null,addLabel=null,stopped=false,ownedBody=null,frame=null,observer=null,timer=null,lastURL='',labelBackups=[],headingBackups=[];function route(url){if(url.protocol!=='https:'||!HOSTS.includes(url.hostname))return null;const path=url.pathname.endsWith('/')?url.pathname.slice(0,-1):url.pathname;if(path.startsWith(BASE+'smart_list/')&&/^[A-Za-z0-9_-]+$/.test(path.slice((BASE+'smart_list/').length)))return 'list';if(path.startsWith(BASE+'detail/')&&/^[A-Za-z0-9_-]+$/.test(path.slice((BASE+'detail/').length)))return 'detail';return null;}function restoreText(item){if(item.node.textContent===item.written)item.node.replaceChildren(...item.children);}function clear(){if(addLabel){addLabel.remove();addLabel=null;}if(addBackup){const {node,aria}=addBackup;if(node.getAttribute('aria-label')==='Add customer'){if(aria===null)node.removeAttribute('aria-label');else node.setAttribute('aria-label',aria);}addBackup=null;}const otherSkinOwnsLabels=doc.body?.hasAttribute('data-ari-owner-theme')||doc.body?.hasAttribute('data-ari-messages-skin')||doc.body?.hasAttribute('data-ari-bookings-skin');if(!otherSkinOwnsLabels){for(const item of labelBackups){if(item.title.textContent===item.label)item.title.replaceChildren(...item.children);if(item.link.getAttribute('aria-label')===item.label){if(item.aria===null)item.link.removeAttribute('aria-label');else item.link.setAttribute('aria-label',item.aria);}}}headingBackups.forEach(restoreText);headingBackups=[];labelBackups=[];if(ownedBody){ownedBody.removeAttribute(MARKER);ownedBody=null;}}function syncLabels(){for(const[id,label]of labels){const link=doc.getElementById(id),title=link?.querySelector('.nav-title');if(!link||!title)continue;if(!labelBackups.some(item=>item.title===title))labelBackups.push({link,title,children:Array.from(title.childNodes),aria:link.getAttribute('aria-label'),label});if(title.textContent!==label)title.replaceChildren(doc.createTextNode(label));if(link.getAttribute('aria-label')!==label)link.setAttribute('aria-label',label);}const heading=doc.getElementById('tb_lists')?.parentElement.querySelector('.topmenu-navtitle[role="heading"]');if(heading&&(heading.textContent.trim()==='Contacts'||headingBackups.some(item=>item.node===heading))){if(!headingBackups.some(item=>item.node===heading))headingBackups.push({node:heading,children:Array.from(heading.childNodes),written:'Customers'});if(heading.textContent!=='Customers')heading.replaceChildren(doc.createTextNode('Customers'));}const add=route(global.location)==='list'?doc.getElementById('add-contact-btn'):null;if(add&&add.tagName==='BUTTON'){if(addBackup?.node!==add){if(addLabel)addLabel.remove();if(addBackup&&addBackup.node.getAttribute('aria-label')==='Add customer'){if(addBackup.aria===null)addBackup.node.removeAttribute('aria-label');else addBackup.node.setAttribute('aria-label',addBackup.aria);}addBackup={node:add,aria:add.getAttribute('aria-label')};addLabel=null;}if(add.getAttribute('aria-label')!=='Add customer')add.setAttribute('aria-label','Add customer');if(!addLabel||!add.contains(addLabel)){addLabel=doc.createElement('span');addLabel.setAttribute('data-ari-add-client-label','');addLabel.textContent='Add customer';add.appendChild(addLabel);}}}function reconcile(){if(stopped)return;lastURL=global.location.href;const mode=route(global.location),root=mode==='list'?'crm-contacts-view':mode==='detail'?'record-details-new-ui':null;if(!root||!doc.body||!doc.getElementById(root)){clear();return;}if(ownedBody&&(ownedBody!==doc.body||ownedBody.getAttribute(MARKER)!==mode))clear();if(!ownedBody){if(doc.body.hasAttribute(MARKER))return;ownedBody=doc.body;}if(ownedBody.getAttribute(MARKER)!==mode)ownedBody.setAttribute(MARKER,mode);syncLabels();}function schedule(){if(stopped||frame!==null)return;frame=global.requestAnimationFrame(()=>{frame=null;reconcile();});}function onRoute(){reconcile();schedule();}function onClick(event){const link=event.target.closest?.('a[href]');if(!link)return;let url;try{url=new global.URL(link.href,global.location.href);}catch(_){return;}if(!route(url))clear();schedule();}function stop(){if(stopped)return;stopped=true;if(frame!==null)global.cancelAnimationFrame(frame);if(observer)observer.disconnect();if(timer!==null)global.clearInterval(timer);doc.removeEventListener('click',onClick,true);doc.removeEventListener('visibilitychange',onRoute);global.removeEventListener('popstate',onRoute);global.removeEventListener('hashchange',onRoute);clear();if(global[KEY]===api)delete global[KEY];}const api=Object.freeze({reconcile,stop,get status(){return{active:!!ownedBody,view:route(global.location)};}});global[KEY]=api;try{doc.addEventListener('click',onClick,true);doc.addEventListener('visibilitychange',onRoute);global.addEventListener('popstate',onRoute);global.addEventListener('hashchange',onRoute);observer=new global.MutationObserver(()=>{if(!route(global.location)){clear();lastURL=global.location.href;return;}schedule();});observer.observe(doc.documentElement,{childList:true,subtree:true});timer=global.setInterval(()=>{if(global.location.href!==lastURL)reconcile();},150);reconcile();}catch(error){stop();throw error;}})(window);

}catch(e){console.warn("ari block 17",e)}
try{

(function(w){'use strict';const d=w.document,K='__ariAskSkinV1',B='/v2/location/'+window.__ariLOC+'/',ASK='/v2/location/'+window.__ariLOC+'/custom-menu-link/'+window.__ariAskId+'',NAV='data-ari-ask-nav',SKIN='data-ari-ask-skin';if(w[K]){w[K].reconcile();return;}let body=null,navBackup=null,cardBackup=null,brandCopy=null,frame=null,observer=null,timer=null,stopped=false,last='';function inLocation(){return w.location.protocol==='https:'&&['app.gohighlevel.com','app.zdsihq.com'].includes(w.location.hostname)&&w.location.pathname.startsWith(B);}function askPath(path){const p=path.replace(/\/$/,'');const base=B+'ask-ai';return p===base||(p.startsWith(base+'/')&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p.slice(base.length+1)));}function chatRoute(){return inLocation()&&askPath(w.location.pathname);}function restoreNav(){if(!navBackup)return;const{node,children,anchor,aria}=navBackup;if(node.textContent==='Ask Ari')node.replaceChildren(...children);if(anchor.getAttribute('aria-label')==='Ask Ari'){if(aria===null)anchor.removeAttribute('aria-label');else anchor.setAttribute('aria-label',aria);}navBackup=null;}function restoreCard(){if(!cardBackup)return;const{link,original}=cardBackup;if(link.parentNode)link.replaceWith(original);cardBackup=null;}function clearChat(){if(brandCopy)brandCopy.remove();brandCopy=null;if(body)body.removeAttribute(SKIN);}function clear(){clearChat();restoreCard();restoreNav();if(body)body.removeAttribute(NAV);body=null;}function syncNav(){restoreNav();}function syncCard(){if(w.location.pathname.replace(/\/$/,'')!==B+'dashboard'||d.getElementById('hr-tag-count-wrapper-location-dashboard_tag-edit_mode')){restoreCard();return;}const home=d.getElementById('ari-owner-preview');if(cardBackup&&(!home?.contains(cardBackup.link)||!cardBackup.link.isConnected))restoreCard();if(cardBackup||!home)return;const candidates=Array.from(home.querySelectorAll('.ari-quick-actions button[disabled]')).filter(el=>el.querySelector('strong')?.textContent.trim()==='Ask Ari');if(candidates.length!==1)return;const original=candidates[0],link=d.createElement('a');link.href=ASK;link.className=original.className;link.setAttribute('data-ari-ask-home-link','');link.setAttribute('aria-label','Ask Ari');for(const child of Array.from(original.childNodes))link.appendChild(child.cloneNode(true));const hint=link.querySelector('small');if(hint)hint.textContent='Your psychic assistant';original.replaceWith(link);cardBackup={link,original};}function reconcile(){if(stopped)return;last=w.location.href;if(!inLocation()||!d.body){clear();return;}if(body!==d.body){clear();body=d.body;}if(!body.hasAttribute(NAV))body.setAttribute(NAV,'v1');syncNav();syncCard();const root=chatRoute()?d.getElementById('ask-ai-container-pmd'):null;if(!root){clearChat();return;}if(body.getAttribute(SKIN)!=='v1')body.setAttribute(SKIN,'v1');const brand=root.querySelector('.askai-left-panel__brand');if(brandCopy&&(!brand||!brand.contains(brandCopy))){brandCopy.remove();brandCopy=null;}}function schedule(){if(!stopped&&frame===null)frame=w.requestAnimationFrame(()=>{frame=null;reconcile();});}function onRoute(){reconcile();schedule();}function onClick(e){const a=e.target.closest?.('a[href]');if(!a)return;try{const u=new w.URL(a.href,w.location.href);if(u.origin!==w.location.origin||!u.pathname.startsWith(B))clear();else if(!askPath(u.pathname))clearChat();}catch(_){}schedule();}function stop(){if(stopped)return;stopped=true;if(frame!==null)w.cancelAnimationFrame(frame);observer?.disconnect();if(timer!==null)w.clearInterval(timer);d.removeEventListener('click',onClick,true);w.removeEventListener('popstate',onRoute);w.removeEventListener('hashchange',onRoute);d.removeEventListener('visibilitychange',onRoute);clear();if(w[K]===api)delete w[K];}const api=Object.freeze({reconcile,stop});w[K]=api;try{d.addEventListener('click',onClick,true);w.addEventListener('popstate',onRoute);w.addEventListener('hashchange',onRoute);d.addEventListener('visibilitychange',onRoute);observer=new w.MutationObserver(()=>{if(!inLocation()){clear();return;}schedule();});observer.observe(d.documentElement,{childList:true,subtree:true});timer=w.setInterval(()=>{if(last!==w.location.href)reconcile();},150);reconcile();}catch(error){stop();throw error;}})(window);

}catch(e){console.warn("ari block 18",e)}
try{
(function(w){'use strict';const d=w.document,K='__ariAskBrandV2',P='/v2/location/'+window.__ariLOC+'/ask-ai',SRC='https://images.leadconnectorhq.com/image/f_webp/q_80/r_320/u_https://assets.cdn.filesafe.space/8otTGBxdVFDsQ1gNhDg0/media/6ac1a89fbbad531ac8970eea.jpeg';if(w[K]){w[K].sync();return;}let body=null,brand=null,brandImage=null,welcome=null,frame=null,stopped=false;function clear(){brand?.removeAttribute('data-ari-portrait-ready');brandImage?.remove();welcome?.remove();brand=brandImage=welcome=null;body?.removeAttribute('data-ari-ask-brand');body=null;}function portrait(kind){const img=d.createElement('img');img.className='ari-ask-portrait ari-ask-portrait--'+kind;img.alt=kind==='welcome'?'Ari':'';img.decoding='async';img.addEventListener('error',()=>{img.hidden=true;if(img===brandImage)brand?.removeAttribute('data-ari-portrait-ready');});return img;}function askPath(path){const p=path.replace(/\/$/,'');const base=P;return p===base||(p.startsWith(base+'/')&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p.slice(base.length+1)));}function sync(){if(stopped)return;const allowed=w.location.protocol==='https:'&&['app.gohighlevel.com','app.zdsihq.com'].includes(w.location.hostname)&&askPath(w.location.pathname);const root=allowed?d.getElementById('ask-ai-container-pmd'):null;if(!root||!d.body){clear();return;}if(body!==d.body){clear();body=d.body;}if(body.getAttribute('data-ari-ask-brand')!=='v2')body.setAttribute('data-ari-ask-brand','v2');const next=root.querySelector('.askai-left-panel__brand');if(brand!==next||brandImage&&!next?.contains(brandImage)){brand?.removeAttribute('data-ari-portrait-ready');brandImage?.remove();brandImage=null;brand=next;}if(brand&&!brandImage){const host=brand,img=portrait('brand');brandImage=img;img.addEventListener('load',()=>{if(!stopped&&brand===host&&brandImage===img&&host.contains(img))host.setAttribute('data-ari-portrait-ready','');});host.insertBefore(img,host.firstChild);img.src=SRC;}const title=root.querySelector('.askai-welcome-header__title');if(welcome&&(!title||welcome.nextElementSibling!==title)){welcome.remove();welcome=null;}if(title&&!welcome){welcome=portrait('welcome');title.insertAdjacentElement('beforebegin',welcome);welcome.src=SRC;}}function queue(){if(!stopped&&frame===null)frame=w.requestAnimationFrame(()=>{frame=null;sync();});}const observer=new MutationObserver(queue);observer.observe(d.documentElement,{childList:true,subtree:true});let last=w.location.href;const timer=w.setInterval(()=>{if(last!==w.location.href){last=w.location.href;sync();}},150);w.addEventListener('popstate',queue);w[K]={sync,stop(){stopped=true;observer.disconnect();w.clearInterval(timer);if(frame!==null)w.cancelAnimationFrame(frame);w.removeEventListener('popstate',queue);clear();delete w[K];}};sync();})(window);
}catch(e){console.warn("ari block 19",e)}
try{
(function(w){'use strict';const d=w.document,K='__ariMessagesDMV3',M='data-ari-messages-dm',P='/v2/location/'+window.__ariLOC+'/conversations/conversations';if(w[K]){w[K].sync();return;}let body=null,frame=null,stopped=false,last='';function clear(){if(body)body.removeAttribute(M);body=null;}function sync(){if(stopped)return;last=w.location.href;const ok=w.location.protocol==='https:'&&['app.gohighlevel.com','app.zdsihq.com'].includes(w.location.hostname)&&/^\/v2\/location\/[A-Za-z0-9]+\/conversations\/conversations(?:\/[A-Za-z0-9_-]{6,64})?\/?$/.test(w.location.pathname)&&d.getElementById('conversations-layout')&&d.body?.getAttribute('data-ari-messages-layout')==='v2';if(!ok){clear();return;}if(body!==d.body){clear();body=d.body;}if(body.getAttribute(M)!=='v3')body.setAttribute(M,'v3');}function queue(){if(!stopped&&frame===null)frame=w.requestAnimationFrame(()=>{frame=null;sync();});}const observer=new w.MutationObserver(queue);observer.observe(d.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-ari-messages-layout']});const timer=w.setInterval(()=>{if(last!==w.location.href)sync();},150);w.addEventListener('popstate',queue);w.addEventListener('hashchange',queue);w[K]={sync,stop(){stopped=true;observer.disconnect();w.clearInterval(timer);if(frame!==null)w.cancelAnimationFrame(frame);w.removeEventListener('popstate',queue);w.removeEventListener('hashchange',queue);clear();delete w[K];}};sync();})(window);
}catch(e){console.warn("ari block 20",e)}
try{

(function(w){'use strict';var d=w.document,K='__ariSettingsRowV1',B='/v2/location/'+window.__ariLOC+'/settings',LOC=''+window.__ariLOC+'',ROW='data-ari-idrow',SIDE='data-ari-idrow-side',TTL='data-ari-idrow-title',SID='ari-idrow-style';
if(w[K]){w[K].sync();return;}
var LABEL=/^(location|sub[\s-]?account|company|business|account)\s*id\s*:?$/i;
var CSS='@media(max-width:760px){[data-ari-idrow="flex"]{flex-wrap:wrap!important;height:auto!important;min-height:0!important;row-gap:8px!important;align-items:flex-start!important}[data-ari-idrow="grid"]{grid-template-columns:minmax(0,1fr)!important;height:auto!important;row-gap:8px!important}[data-ari-idrow]>[data-ari-idrow-title]{flex:1 1 100%!important;width:auto!important;min-width:0!important;max-width:100%!important;white-space:normal!important;position:static!important;overflow:visible!important}[data-ari-idrow]>[data-ari-idrow-side]{flex:1 1 100%!important;position:static!important;inset:auto!important;transform:none!important;margin-left:0!important;width:auto!important;min-width:0!important;max-width:100%!important;justify-content:flex-start!important;flex-wrap:wrap!important}:is(.hr-card-header,.n-card-header){flex-wrap:wrap!important;row-gap:8px!important;height:auto!important}:is(.hr-card-header__main,.n-card-header__main){flex:1 1 100%!important;min-width:0!important}:is(.hr-card-header__extra,.n-card-header__extra){flex:1 1 100%!important;flex-wrap:wrap!important;justify-content:flex-start!important;margin-left:0!important;min-width:0!important}}';
var frame=null,stopped=false,marked=[],observed=[],timer=null,tries=0,lastURL='';
function scoped(){var p=w.location.pathname;return w.location.protocol==='https:'&&['app.gohighlevel.com','app.zdsihq.com'].indexOf(w.location.hostname)>=0&&(p===B||p.indexOf(B+'/')===0);}
function norm(s){return (s||'').replace(/[\s\u00a0\u200b]+/g,' ').trim();}
function gcs(e){return (e.ownerDocument.defaultView||w).getComputedStyle(e);}
function unmark(){marked.forEach(function(e){e.removeAttribute(ROW);e.removeAttribute(SIDE);e.removeAttribute(TTL);});marked=[];}
function mark(e,a,v){e.setAttribute(a,v);marked.push(e);}
/* every place the settings content can live: this page, same-origin frames, open shadow roots */
function roots(){var out=[d],i=0;while(i<out.length&&out.length<40){var r=out[i++],all;try{all=r.querySelectorAll('*');}catch(e){continue;}for(var j=0;j<all.length;j++){var el=all[j];if(el.shadowRoot&&out.indexOf(el.shadowRoot)<0)out.push(el.shadowRoot);if(el.tagName==='IFRAME'){try{var fd=el.contentDocument;if(fd&&fd.body&&out.indexOf(fd)<0)out.push(fd);}catch(e){}}}}return out;}
function ensure(r){if(r===d)return;var host=r.head||r;if(!r.getElementById||r.getElementById(SID))return;var s=(r.ownerDocument||r).createElement('style');s.id=SID;s.textContent=CSS;host.appendChild(s);}
function watch(r){if(observed.indexOf(r)>=0)return;observed.push(r);try{obs.observe(r.documentElement||r,{childList:true,subtree:true,characterData:true});}catch(e){}}
function anchors(r){var out=[],seen=[],doc=r.ownerDocument||r;function add(e){if(e&&seen.indexOf(e)<0&&out.length<6){seen.push(e);out.push(e);}}
 var tw=doc.createTreeWalker(r,4,{acceptNode:function(n){var v=n.nodeValue||'';return (/id/i.test(v)||v.indexOf(LOC)>=0)?1:3;}}),n;
 while((n=tw.nextNode())&&out.length<6){var v=norm(n.nodeValue);if(v===LOC||v.indexOf(LOC)>=0&&v.length<=LOC.length+4){add(n.parentElement);continue;}for(var e=n.parentElement,k=0;e&&k<3;e=e.parentElement,k++){var t=norm(e.textContent);if(t.length>24)break;if(LABEL.test(t)){add(e);break;}}}
 r.querySelectorAll('[aria-label],[title],[placeholder]').forEach(function(e){var a=e.getAttribute('aria-label')||e.getAttribute('title')||e.getAttribute('placeholder')||'';if(LABEL.test(norm(a)))add(e);});
 r.querySelectorAll('input').forEach(function(e){if(e.value===LOC)add(e);});return out;}
function titled(el){var t=norm(el.textContent).toLowerCase();if(t.indexOf(LOC.toLowerCase())>=0||/^(button|svg|input)$/i.test(el.tagName))return false;return /[a-z]{5,}/.test(t.replace(/\b(location|sub[\s-]?account|company|business|account|id)\b:?/g,''));}
function findRow(a){for(var el=a,i=0;el&&el.parentElement&&el.parentElement.tagName!=='BODY'&&i<8;el=el.parentElement,i++){var p=el.parentElement,disp=gcs(p).display;if(p.children.length<2||!/flex|grid/.test(disp))continue;var others=Array.prototype.filter.call(p.children,function(c){return c!==el&&c.getClientRects().length&&titled(c);});if(others.length)return{row:p,side:el,titles:others,kind:/grid/.test(disp)?'grid':'flex'};}return null;}
function sync(){if(stopped)return;if(!scoped()||!d.body){unmark();return;}if(w.location.href!==lastURL){lastURL=w.location.href;tries=0;unmark();}
 if(marked.length&&marked.every(function(e){return e.isConnected;}))return;unmark();
 roots().forEach(function(r){ensure(r);watch(r);anchors(r).forEach(function(a){var x=findRow(a);if(!x||x.row.hasAttribute(ROW))return;mark(x.row,ROW,x.kind);mark(x.side,SIDE,'');x.titles.forEach(function(t){mark(t,TTL,'');});});});}
function queue(){if(!stopped&&frame===null)frame=w.requestAnimationFrame(function(){frame=null;sync();});}
var obs=new MutationObserver(queue);watch(d);
timer=w.setInterval(function(){if(w.location.href!==lastURL){queue();return;}if(scoped()&&!marked.length&&tries++<40)queue();},750);
w.addEventListener('popstate',queue);d.addEventListener('load',function(e){if(e.target&&e.target.tagName==='IFRAME')queue();},true);
w[K]={sync:sync,stop:function(){stopped=true;obs.disconnect();w.clearInterval(timer);if(frame!==null)w.cancelAnimationFrame(frame);w.removeEventListener('popstate',queue);unmark();delete w[K];}};sync();})(window);

}catch(e){console.warn("ari block 21",e)}
try{

(function(w){'use strict';const d=w.document,K='__ariNativeDrawerV1',B='/v2/location/'+window.__ariLOC+'/',M='data-ari-shell';if(w[K])return;let active=null,originalOpen=false,backdrop=null,frame=null,last='',stopped=false,wantedOpen=false;
function scoped(){return w.location.protocol==='https:'&&['app.gohighlevel.com','app.zdsihq.com'].includes(w.location.hostname)&&w.location.pathname.startsWith(B);}
function toggle(label){return active?.querySelector('button[aria-label="'+label+' sidebar"]');}
function isOpen(){return !!toggle('Collapse');}
function close(restoreFocus){wantedOpen=false;const b=toggle('Collapse');if(b)b.click();if(restoreFocus)w.requestAnimationFrame(()=>toggle('Expand')?.focus());}
function clear(){if(backdrop){backdrop.remove();backdrop=null;}d.body?.removeAttribute(M);if(active?.isConnected&&originalOpen&&toggle('Expand'))toggle('Expand').click();active=null;}
function sync(){frame=null;if(stopped)return;if(last!==w.location.href)wantedOpen=false;last=w.location.href;if(!scoped()){clear();return;}const s=d.getElementById('sidebar-v2');if(!s||!d.body)return;if(active!==s){active=s;originalOpen=!!toggle('Collapse');close(false);}if(d.body.getAttribute(M)!=='v1')d.body.setAttribute(M,'v1');if(!wantedOpen&&isOpen())close(false);if(isOpen()){if(!backdrop){backdrop=d.createElement('button');backdrop.type='button';backdrop.id='ari-nav-backdrop';backdrop.tabIndex=-1;backdrop.setAttribute('aria-label','Close navigation');backdrop.addEventListener('click',()=>close(true));d.body.appendChild(backdrop);}}else if(backdrop){backdrop.remove();backdrop=null;}}
function queue(){if(!stopped&&frame===null)frame=w.requestAnimationFrame(sync);}
function capture(e){if(!scoped()||!active)return;const b=e.composedPath().find(n=>n&&n.nodeType===1&&n.matches?.('button[aria-label$=" sidebar"]')&&active.contains(n));if(b)wantedOpen=b.getAttribute('aria-label')==='Expand sidebar';}
function click(e){if(!scoped())return;const link=e.target.closest?.('#sidebar-v2 a[href]');if(link){w.requestAnimationFrame(()=>close(false));}else if(isOpen()&&active&&!e.composedPath().includes(active)&&e.target!==backdrop){close(false);}queue();}
function key(e){if(!scoped()||!isOpen())return;const dialog=Array.from(d.querySelectorAll('[role="dialog"],[role="alertdialog"]')).some(n=>n.getClientRects().length>0);if(dialog)return;if(e.key==='Escape'){e.preventDefault();close(true);return;}if(e.key==='Tab'){const nodes=Array.from(active.querySelectorAll('button,a[href],input,select,textarea,[tabindex]')).filter(n=>!n.disabled&&n.tabIndex>=0&&n.getBoundingClientRect().width>0&&n.getBoundingClientRect().height>0&&w.getComputedStyle(n).visibility!=="hidden");const first=nodes[0],last=nodes[nodes.length-1];if(first&&e.shiftKey&&d.activeElement===first){e.preventDefault();last.focus();}else if(last&&!e.shiftKey&&d.activeElement===last){e.preventDefault();first.focus();}}}
const observer=new w.MutationObserver(queue);observer.observe(d.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','aria-label']});d.addEventListener('click',capture,true);d.addEventListener('click',click);d.addEventListener('keydown',key);function route(){close(false);queue();}w.addEventListener('popstate',route);const timer=w.setInterval(()=>{if(w.location.href!==last)queue();},250);w[K]={stop(){stopped=true;observer.disconnect();w.clearInterval(timer);if(frame!==null)w.cancelAnimationFrame(frame);d.removeEventListener('click',capture,true);d.removeEventListener('click',click);d.removeEventListener('keydown',key);w.removeEventListener('popstate',route);clear();delete w[K];}};sync();})(window);

}catch(e){console.warn("ari block 22",e)}
try{

(function(){if(window.location.hostname!=="app.zdsihq.com")return;var id="ari-domain-location-switcher-v1";if(document.getElementById(id))return;var style=document.createElement("style");style.id=id;style.textContent="#location-switcher-sidbar-v2,#sidebar-v2 #globalSearchOpener,#sidebar-v2 #quickActions,#sidebar-v2 div:has(>#globalSearchOpener):has(>#quickActions),#sidebar-v2 #sb_reporting{display:none!important}";(document.head||document.documentElement).appendChild(style);})();

}catch(e){console.warn("ari block 23",e)}
try{

(function(w,d){
'use strict';
if(w.location.hostname!=='app.zdsihq.com')return;
const KEY='__ariInboxToolsV1',prefix='/v2/location/'+window.__ariLOC+'/conversations/conversations';
if(w[KEY])return;
let layout=null,panel=null,header=null,bar=null,closer=null,backdrop=null,opened=false,frame=null,last=w.location.href,focusPending=false;
const style=d.createElement('style');style.id='ari-inbox-tools-style-v1';style.textContent=
'#conversations-layout[data-ari-inbox-tools="v1"]>.inbox-panel{display:none!important}'+
'#conversations-layout[data-ari-inbox-tools="v1"]>#conversations-content{flex:1 1 auto!important;width:100%!important;min-width:0!important}'+
'#conversations-layout[data-ari-inbox-tools="v1"] #conv-inbox-panel-toggle-button{display:none!important}'+
'#conversations-layout[data-ari-inbox-tools="v1"][data-ari-tools-open="true"]>.inbox-panel{display:flex!important;position:fixed!important;top:110px!important;left:12px!important;width:min(340px,calc(100vw - 24px))!important;max-width:calc(100vw - 24px)!important;height:calc(100dvh - 126px)!important;max-height:640px!important;padding:12px!important;border:1px solid #decda3!important;border-radius:16px!important;background:#faf8f1!important;box-shadow:0 12px 36px #163e3426!important;z-index:141!important;overflow:auto!important;box-sizing:border-box!important}'+
'#ari-inbox-tools-backdrop{position:fixed;inset:50px 0 0;border:0;background:#14392e40;z-index:140}'+
'#ari-inbox-tools-bar{display:flex;flex-wrap:wrap;gap:8px;width:100%;margin:0 0 10px;min-width:0}'+
'#ari-inbox-tools-bar button,#ari-inbox-tools-close{min-height:44px;padding:8px 12px;border:1px solid #decda3;border-radius:12px;background:#f8f3e7;color:#29463b;font-size:12px;font-weight:600;cursor:pointer}'+
'#ari-inbox-tools-bar button{flex:1 1 auto}#ari-inbox-tools-bar button:disabled{opacity:.45;cursor:default}'+
'#ari-inbox-tools-close{align-self:flex-end;flex-shrink:0;margin-bottom:10px}'+
'#ari-inbox-tools-bar button:focus-visible,#ari-inbox-tools-close:focus-visible{outline:2px solid #8a6b2c;outline-offset:2px}';
style.textContent+="@media(max-width:760px){#conversations-layout[data-ari-inbox-tools=\"v1\"]{min-width:0!important;max-width:100%!important}#conversations-layout[data-ari-inbox-tools=\"v1\"]:has(#conversations-empty-state) #conversations-list{width:100%!important;min-width:0!important;max-width:none!important;flex:1 1 100%!important;border-right:0!important}#conversations-layout[data-ari-inbox-tools=\"v1\"]:has(#conversations-empty-state) #conversations-central-panel-viewer,#conversations-layout[data-ari-inbox-tools=\"v1\"]:has(#conversations-empty-state) #conversations-right-column{display:none!important}body:has(#conversations-layout[data-ari-inbox-tools=\"v1\"]:has(#conversations-empty-state)) button:is([aria-label=\"Show client details\"],[aria-label=\"Show customer details\"]){display:none!important}#conversations-layout[data-ari-inbox-tools=\"v1\"] .conversation-list-container>div{padding:10px!important}#conversations-layout[data-ari-inbox-tools=\"v1\"] .conversation-list-header{padding:0!important;gap:6px!important}#conversations-layout[data-ari-inbox-tools=\"v1\"] #ari-inbox-tools-bar{gap:6px!important;margin:0!important;flex-wrap:nowrap!important}#conversations-layout[data-ari-inbox-tools=\"v1\"] #ari-inbox-tools-bar button{min-height:44px!important;padding:6px 8px!important;font-size:12px!important;border-radius:10px!important}#conversations-layout[data-ari-inbox-tools=\"v1\"] .conversation-list-header button:is([aria-label=\"Unread\"],[aria-label=\"All\"],[aria-label=\"Recent\"],[aria-label=\"Starred\"]){min-height:44px!important;height:44px!important;padding:3px 2px!important;font-size:12px!important}#conversations-layout[data-ari-inbox-tools=\"v1\"] .conversation-list-header button:is([aria-label=\"Unread\"],[aria-label=\"All\"],[aria-label=\"Recent\"],[aria-label=\"Starred\"]) svg{width:16px!important;height:16px!important}#conversations-layout[data-ari-inbox-tools=\"v1\"] .conversation-list-header button:is([aria-label=\"Unread\"],[aria-label=\"All\"],[aria-label=\"Recent\"],[aria-label=\"Starred\"])>div{font-size:12px!important;margin-bottom:0!important}}";
(d.head||d.documentElement).appendChild(style);
function scoped(){return w.location.pathname===prefix||w.location.pathname.startsWith(prefix+'/');}
function nativeNew(){return panel?.querySelector('#new-conversation-btn-collapsed,#new-conversation-btn');}
function close(restore){opened=false;focusPending=false;layout?.removeAttribute('data-ari-tools-open');backdrop?.remove();backdrop=null;bar?.querySelector('[data-ari-tools-toggle]')?.setAttribute('aria-expanded','false');if(restore)bar?.querySelector('[data-ari-tools-toggle]')?.focus();}
function clear(){close(false);layout?.removeAttribute('data-ari-inbox-tools');bar?.remove();closer?.remove();layout=panel=header=bar=closer=null;}
function open(){if(!layout||!panel)return;opened=true;focusPending=true;layout.setAttribute('data-ari-tools-open','true');bar.querySelector('[data-ari-tools-toggle]').setAttribute('aria-expanded','true');const toggle=panel.querySelector('#conv-inbox-panel-toggle-button');if(toggle?.getAttribute('aria-label')==='Expand Inbox Panel')toggle.click();if(!backdrop){backdrop=d.createElement('button');backdrop.id='ari-inbox-tools-backdrop';backdrop.type='button';backdrop.tabIndex=-1;backdrop.setAttribute('aria-label','Close Search & filters');backdrop.addEventListener('click',()=>close(true));d.body.appendChild(backdrop);}queue();}
function button(label,fn){const b=d.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',fn);return b;}
function sync(){frame=null;if(last!==w.location.href){last=w.location.href;close(false);}if(!scoped()){clear();return;}const next=d.querySelector('#conversations-layout'),nextPanel=next?.querySelector(':scope>.inbox-panel'),nextHeader=next?.querySelector('.conversation-list-header');if(!next||!nextPanel||!nextHeader){clear();return;}if(layout!==next||panel!==nextPanel||header!==nextHeader){clear();layout=next;panel=nextPanel;header=nextHeader;}if(!panel.querySelector('#conv-inbox-panel-toggle-button')){clear();return;}if(!bar?.isConnected){bar=d.createElement('div');bar.id='ari-inbox-tools-bar';bar.setAttribute('role','toolbar');bar.setAttribute('aria-label','Message actions');const add=button('New message',()=>{const target=nativeNew();if(target&&!target.disabled){close(false);target.click();}});add.setAttribute('data-ari-new-message','');const tools=button('Search & filters',()=>opened?close(true):open());tools.setAttribute('data-ari-tools-toggle','');tools.setAttribute('aria-expanded','false');tools.setAttribute('aria-controls','conversations-layout');bar.append(add,tools);header.prepend(bar);}const add=bar.querySelector('[data-ari-new-message]'),native=nativeNew();const disabled=!native||native.disabled;if(add.disabled!==disabled)add.disabled=disabled;if(!closer?.isConnected){closer=button('Close',()=>close(true));closer.id='ari-inbox-tools-close';closer.setAttribute('aria-label','Close Search & filters');panel.prepend(closer);}if(layout.getAttribute('data-ari-inbox-tools')!=='v1')layout.setAttribute('data-ari-inbox-tools','v1');if(opened&&focusPending){const input=panel.querySelector('input[placeholder="Search"]');if(input){focusPending=false;input.focus();}}}
function queue(){if(frame===null)frame=w.requestAnimationFrame(sync);}
function key(e){if(!opened)return;const dialog=Array.from(d.querySelectorAll('[role="dialog"],[role="alertdialog"]')).some(n=>n.getBoundingClientRect().width&&n.getBoundingClientRect().height);if(dialog)return;if(e.key==='Escape'){e.preventDefault();close(true);}if(e.key==='Tab'&&panel){const items=Array.from(panel.querySelectorAll('button,input,select,textarea,a[href],[tabindex]')).filter(n=>!n.disabled&&n.tabIndex>=0&&n.getBoundingClientRect().width&&n.getBoundingClientRect().height&&getComputedStyle(n).visibility!=='hidden');if(!items.length)return;const first=items[0],end=items[items.length-1];if(e.shiftKey&&(d.activeElement===first||!panel.contains(d.activeElement))){e.preventDefault();end.focus();}else if(!e.shiftKey&&(d.activeElement===end||!panel.contains(d.activeElement))){e.preventDefault();first.focus();}}}
const observer=new MutationObserver(queue);observer.observe(d.body,{childList:true,subtree:true});const timer=w.setInterval(()=>{if(last!==w.location.href)queue();},250);d.addEventListener('keydown',key);w.addEventListener('popstate',queue);w[KEY]={stop(){observer.disconnect();w.clearInterval(timer);if(frame!==null)w.cancelAnimationFrame(frame);d.removeEventListener('keydown',key);w.removeEventListener('popstate',queue);clear();style.remove();delete w[KEY];}};sync();
})(window,document);

}catch(e){console.warn("ari block 24",e)}
try{

(function(w,d){
'use strict';
const K='__ariClientMessageChooserV1',P='/v2/location/'+window.__ariLOC+'/conversations/conversations',M='data-ari-client-message';
if(w[K])return;
let root=null,records=[],closeRecord=null,frame=null,last=w.location.href,stopped=false;
function scoped(){return w.location.protocol==='https:'&&w.location.hostname==='app.zdsihq.com'&&(w.location.pathname===P||w.location.pathname.startsWith(P+'/'));}
function clear(){if(root)root.removeAttribute(M);for(const r of records){if(r.node.textContent===r.written)r.node.textContent=r.original;}records=[];if(closeRecord){const r=closeRecord;if(r.node.getAttribute('aria-label')==='Close'){if(r.label===null)r.node.removeAttribute('aria-label');else r.node.setAttribute('aria-label',r.label);}if(!r.node.hasAttribute('aria-labelledby')&&r.labelledby!==null)r.node.setAttribute('aria-labelledby',r.labelledby);}closeRecord=null;root=null;}
function text(node,value){let r=records.find(r=>r.node===node);if(!r){r={node,original:node.textContent,written:value};records.push(r);}if(node.textContent!==value)node.textContent=value;}
function sync(){frame=null;if(stopped)return;last=w.location.href;const next=scoped()?d.getElementById('create-conversation-modal'):null;const contact=next?.querySelector('#contacts-btn'),heading=next?.querySelector('#create-conversation-modal-title h2'),copy=next?.querySelector('#create-conversation-modal-title p'),label=next?.querySelector('#contacts-btn-label>span'),close=next?.querySelector('#hr-modal__close-button');if(!next||!contact||!heading||!copy||!label||!close){clear();return;}if(root&&root!==next)clear();root=next;text(heading,'New message');text(copy,'Choose a customer to start a conversation.');text(label,'Message a customer');if(closeRecord?.node!==close){if(closeRecord){const r=closeRecord;if(r.labelledby!==null&&!r.node.hasAttribute('aria-labelledby'))r.node.setAttribute('aria-labelledby',r.labelledby);}closeRecord={node:close,label:close.getAttribute('aria-label'),labelledby:close.getAttribute('aria-labelledby')};}close.setAttribute('aria-label','Close');close.removeAttribute('aria-labelledby');if(root.getAttribute(M)!=='v1')root.setAttribute(M,'v1');}
function queue(){if(!stopped&&frame===null)frame=w.requestAnimationFrame(sync);}
const observer=new w.MutationObserver(queue);observer.observe(d.documentElement,{childList:true,subtree:true});
const timer=w.setInterval(()=>{if(last!==w.location.href)queue();},250);w.addEventListener('popstate',queue);
w[K]={stop(){stopped=true;observer.disconnect();w.clearInterval(timer);if(frame!==null)w.cancelAnimationFrame(frame);w.removeEventListener('popstate',queue);clear();delete w[K];}};sync();
})(window,document);

}catch(e){console.warn("ari block 25",e)}
try{

(function(w,d){'use strict';
const K='__ariSettingsSkinV1',M='data-ari-settings-skin',B='/v2/location/'+window.__ariLOC+'/';
if(w[K])return;
let sidebar=null,button=null,backdrop=null,open=false,frame=null,last=w.location.href,stopped=false;
function scoped(){return w.location.protocol==='https:'&&['app.gohighlevel.com','app.zdsihq.com'].includes(w.location.hostname)&&(w.location.pathname===B+'settings'||w.location.pathname.startsWith(B+'settings/'))&&!!d.querySelector('#sidebar-v2 #sb_business_info');}
function paint(){if(!sidebar||!button)return;d.body.setAttribute('data-ari-settings-open',String(open));button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Close settings navigation':'Open settings navigation');const glyph=open?'×':'☰';if(button.textContent!==glyph)button.textContent=glyph;if(open&&!backdrop){backdrop=d.createElement('button');backdrop.id='ari-settings-backdrop';backdrop.type='button';backdrop.tabIndex=-1;backdrop.setAttribute('aria-label','Close settings navigation');backdrop.addEventListener('click',()=>close(true));d.body.appendChild(backdrop);}else if(!open&&backdrop){backdrop.remove();backdrop=null;}}
function close(focus){open=false;paint();if(focus)button?.focus();}
function clear(){backdrop?.remove();button?.remove();backdrop=button=sidebar=null;open=false;d.body?.removeAttribute(M);d.body?.removeAttribute('data-ari-settings-open');}
function sync(){frame=null;if(stopped)return;if(!sidebar&&!button&&!(w.location.pathname===B+'settings'||w.location.pathname.startsWith(B+'settings/'))){if(last!==w.location.href){last=w.location.href;open=false;}return;} /* SPEED: off Settings with nothing to undo */
if(w.innerWidth>760)open=false;if(last!==w.location.href){last=w.location.href;open=false;}const next=scoped()?d.getElementById('sidebar-v2'):null;if(!next||!d.body){clear();return;}if(sidebar!==next){clear();sidebar=next;}if(!button?.isConnected){button=d.createElement('button');button.id='ari-settings-navigation-toggle';button.type='button';button.setAttribute('aria-controls','sidebar-v2');button.addEventListener('click',()=>{open=!open;paint();if(open)sidebar.querySelector('a.active,a.exact-active,a[href]')?.focus();});d.body.appendChild(button);}if(d.body.getAttribute(M)!=='v1')d.body.setAttribute(M,'v1');paint();}
function queue(){if(!stopped&&frame===null)frame=w.requestAnimationFrame(sync);}
function click(e){if(open&&e.target.closest?.('#sidebar-v2 a[href],#sidebar-v2 #backButtonv2'))close(true);}
function key(e){if(!open||!sidebar)return;if(Array.from(d.querySelectorAll('[role="dialog"],[role="alertdialog"]')).some(n=>n.getClientRects().length&&w.getComputedStyle(n).visibility!=='hidden'))return;if(e.key==='Escape'){e.preventDefault();close(true);}else if(e.key==='Tab'){const items=[button,...sidebar.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')].filter(n=>!n.disabled&&n.tabIndex>=0&&n.getClientRects().length&&w.getComputedStyle(n).visibility!=='hidden');if(items.length){e.preventDefault();const current=items.indexOf(d.activeElement),next=current<0?(e.shiftKey?items.length-1:0):(current+(e.shiftKey?-1:1)+items.length)%items.length;items[next].focus();}}}
const obs=new w.MutationObserver(queue);obs.observe(d.documentElement,{childList:true,subtree:true});const timer=w.setInterval(()=>{if(last!==w.location.href)queue();},200);d.addEventListener('click',click);d.addEventListener('keydown',key);w.addEventListener('popstate',queue);w.addEventListener('resize',queue);
w[K]={stop(){stopped=true;obs.disconnect();w.clearInterval(timer);if(frame!==null)w.cancelAnimationFrame(frame);d.removeEventListener('click',click);d.removeEventListener('keydown',key);w.removeEventListener('popstate',queue);w.removeEventListener('resize',queue);clear();delete w[K];}};sync();
})(window,document);

}catch(e){console.warn("ari block 26",e)}
try{

(function(w,d){'use strict';
const K='__ariCalmBookingsV1',B='/v2/location/'+window.__ariLOC+'/',P=B+'calendars/appointments',M='data-ari-bookings-calm';
if(w[K])return;
let root=null,header=null,panel=null,toggle=null,toolsToggle=null,toolsBar=null,advanced=false,open=false,marked=[],navRecords=[],frame=null,last=w.location.href,stopped=false;
const V=B+'calendars/view';const CAL_FIRST=true;/* fix6: the tab opens on the calendar grid, not the list */let pendingNavigation=null,suppressListFirst=false;
function target(){return w.location.protocol==='https:'&&['app.gohighlevel.com','app.zdsihq.com'].includes(w.location.hostname)&&w.location.pathname.startsWith(B);}
function list(){return target()&&w.location.pathname.replace(/\/$/,'')===P;}
function mark(node,name){if(node&&!marked.some(r=>r.node===node&&r.name===name)){marked.push({node,name,previous:node.getAttribute(name)});node.setAttribute(name,'');}}
function paint(){if(!root||!toggle)return;d.body.setAttribute('data-ari-bookings-options',String(open));toggle.setAttribute('aria-expanded',String(open));panel.hidden=!open;d.body.setAttribute('data-ari-bookings-advanced',String(advanced));if(toolsToggle)toolsToggle.setAttribute('aria-expanded',String(advanced));if(toolsBar)toolsBar.hidden=!advanced;}
function clearList(){for(const r of marked){if(r.previous===null)r.node.removeAttribute(r.name);else r.node.setAttribute(r.name,r.previous);}marked=[];header?.remove();header=panel=toggle=toolsToggle=toolsBar=root=null;open=advanced=false;d.body?.removeAttribute(M);d.body?.removeAttribute('data-ari-bookings-options');d.body?.removeAttribute('data-ari-bookings-advanced');d.body?.removeAttribute('data-ari-bookings-simple');}
function restoreNav(){for(const r of navRecords)if(r.node.getAttribute('href')===P)r.node.setAttribute('href',r.href);navRecords=[];}
function nav(){if(CAL_FIRST||!target()){restoreNav();return;}const a=d.querySelector('a#sb_calendars');if(!a)return;let u;try{u=new w.URL(a.href,w.location.href);}catch(_){return;}if(u.origin!==w.location.origin||![B+'calendars/view',P].includes(u.pathname))return;if(!navRecords.some(r=>r.node===a))navRecords.push({node:a,href:a.getAttribute('href')});if(a.getAttribute('href')!==P)a.setAttribute('href',P);}
function link(id,label,path){const native=d.getElementById(id);if(!native)return null;let u;try{u=new w.URL(native.href,w.location.href);}catch(_){return null;}if(u.origin!==w.location.origin||u.pathname!==path)return null;const a=d.createElement('a');a.href=native.href;a.textContent=label;a.setAttribute('data-ari-native-link',id);return a;}
function sync(){frame=null;if(stopped)return;if(last!==w.location.href){last=w.location.href;open=advanced=false;}followNativeBookings();nav();const next=list()?d.getElementById('AppointmentList'):null;if(!next||!d.body){clearList();return;}if(root!==next||!header?.isConnected){clearList();root=next;header=d.createElement('section');header.id='ari-calm-bookings-header';const row=d.createElement('div');row.className='ari-calm-heading-row';const title=d.createElement('h1');title.textContent='Calendar';toggle=d.createElement('button');toggle.type='button';toggle.id='ari-calm-bookings-options';toggle.textContent='Options';toggle.setAttribute('aria-controls','ari-calm-bookings-options-panel');toggle.addEventListener('click',()=>{open=!open;paint();});row.append(title,toggle);panel=d.createElement('nav');panel.id='ari-calm-bookings-options-panel';panel.setAttribute('aria-label','Booking options');toolsToggle=d.createElement('button');toolsToggle.type='button';toolsToggle.id='ari-bookings-list-tools-toggle';toolsToggle.textContent='More list tools';toolsToggle.setAttribute('aria-controls','ari-bookings-tools-bar');toolsToggle.addEventListener('click',()=>{advanced=!advanced;open=false;paint();if(advanced)toolsBar.querySelector('button').focus();});panel.append(toolsToggle);toolsBar=d.createElement('div');toolsBar.id='ari-bookings-tools-bar';toolsBar.hidden=true;const toolsTitle=d.createElement('span');toolsTitle.textContent='List tools';const done=d.createElement('button');done.type='button';done.textContent='Done';done.addEventListener('click',()=>{advanced=false;paint();toggle.focus();});toolsBar.append(toolsTitle,done);header.append(row,panel,toolsBar);root.prepend(header);}
for(const[id,label,path]of [['tb_calendars-tab','Calendar view',B+'calendars/view'],['tb_calendar-settings-top','Calendar settings',B+'settings/calendars']]){const nextLink=link(id,label,path),current=panel.querySelector('[data-ari-native-link="'+id+'"]');if(nextLink&&!current)panel.insertBefore(nextLink,toolsToggle);else if(nextLink&&current&&current.href!==nextLink.href)current.href=nextLink.href;else if(!nextLink&&current)current.remove();}if(d.body.getAttribute(M)!=='v1')d.body.setAttribute(M,'v1');if(d.body.getAttribute('data-ari-bookings-simple')!=='v2')d.body.setAttribute('data-ari-bookings-simple','v2');const add=d.getElementById('book-appointment');const nativeHeader=add?.parentElement?.parentElement;if(nativeHeader&&root.contains(nativeHeader)&&nativeHeader.querySelector('#select-appointment-type-dropdown'))mark(nativeHeader,'data-ari-bookings-native-header');const tab=d.getElementById('btn-add-smart-list')?.closest('.n-space.border-b');if(tab&&root.contains(tab))mark(tab,'data-ari-bookings-native-tabs');const tableTools=root.querySelector('.ghl-table-custom-header');if(tableTools?.querySelector('#hl-table-calendar-list-table-filter-text-search'))mark(tableTools,'data-ari-bookings-native-tools');paint();}
function queue(){if(!stopped&&frame===null)frame=w.requestAnimationFrame(sync);}
// List-first Bookings uses the native sidebar and the verified native list tab.
// A sidebar click (including an owned Home shortcut) arms one follow only.
function followNativeBookings(){
 const request=pendingNavigation;if(!request)return;
 if(stopped||!target()||w.location.origin!==request.origin||Date.now()>=request.deadline){pendingNavigation=null;return;}
 const path=w.location.pathname.replace(/\/$/,'');
 if(path===P){if(w.location.href!==request.startHref)pendingNavigation=null;return;}
 if(path!==V){if(w.location.href!==request.startHref)pendingNavigation=null;return;}
 const matches=d.querySelectorAll('a#tb_apppontment-tab');if(matches.length!==1)return;
 const tab=matches[0];
 if(!tab.isConnected||!tab.getClientRects().length||w.getComputedStyle(tab).visibility==='hidden'||tab.getAttribute('aria-disabled')==='true'||tab.hasAttribute('disabled')||tab.hasAttribute('download')||tab.target&&tab.target!=='_self')return;
 let destination;try{destination=new w.URL(tab.href,w.location.href);}catch(_){return;}
 if(destination.origin!==request.origin||destination.pathname!==P||destination.search||destination.hash)return;
 // Consume before dispatch so delayed or failed native navigation cannot click-loop.
 pendingNavigation=null;tab.click();
}
// Explicit owned Calendar-view links reuse native navigation without list-first intent.
function calendarLink(node,paths){
 if(!node||!node.isConnected||node.hasAttribute('download')||node.hasAttribute('disabled')||node.getAttribute('aria-disabled')==='true'||node.target&&node.target!=='_self')return false;
 let u;try{u=new w.URL(node.href,w.location.href);}catch(_){return false;}
 return u.origin===w.location.origin&&paths.includes(u.pathname)&&!u.search&&!u.hash;
}
function openCalendarView(){
 if(stopped||!target())return false;
 const tabs=d.querySelectorAll('a#tb_calendars-tab');let native=null;
 if(tabs.length){if(tabs.length!==1||!calendarLink(tabs[0],[V]))return false;native=tabs[0];}
 else{
  const sidebar=d.getElementById('sidebar-v2');
  const links=sidebar?sidebar.querySelectorAll('a#sb_calendars'):[];
  // The skin presents an appointments href, but this native handler was verified
  // to open Calendar view. Suppress only this synchronous forwarded click.
  if(links.length!==1||!calendarLink(links[0],[V,P]))return false;native=links[0];
 }
 pendingNavigation=null;const previous=suppressListFirst;suppressListFirst=true;
 try{native.click();return true;}finally{suppressListFirst=previous;}
}
function cancelNavigation(){pendingNavigation=null;queue();}
function click(e){
 if(open&&!header?.contains(e.target)){open=false;paint();}
 const grid=e.target.closest?.('a[data-ari-native-link="tb_calendars-tab"]');
 if(grid&&panel?.contains(grid)&&list()&&!e.defaultPrevented&&e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey&&calendarLink(grid,[V])&&openCalendarView()){e.preventDefault();return;}
 const link=e.target.closest?.('a[href]');
 if(link&&!e.defaultPrevented)pendingNavigation=null;
 const a=e.target.closest?.('a#sb_calendars');
 if(!a||suppressListFirst||e.defaultPrevented||!target()||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.hasAttribute('download')||a.getAttribute('aria-disabled')==='true'||a.target&&a.target!=='_self')return;
 let u;try{u=new w.URL(a.href,w.location.href);}catch(_){return;}
 if(u.origin!==w.location.origin||![P,V].includes(u.pathname)||u.search||u.hash)return;
 if(!CAL_FIRST)pendingNavigation={startHref:w.location.href,origin:w.location.origin,deadline:Date.now()+8000};
 // Let the real sidebar handler run unchanged. Its Calendar view can arrive later.
 queue();
}
function key(e){if(list()&&open&&e.key==='Escape'&&!Array.from(d.querySelectorAll('[role="dialog"]')).some(n=>n.getClientRects().length)){open=false;paint();toggle?.focus();}}
const obs=new w.MutationObserver(queue);obs.observe(d.documentElement,{childList:true,subtree:true});const timer=w.setInterval(()=>{if(last!==w.location.href||pendingNavigation)queue();},200);d.addEventListener('click',click,true);d.addEventListener('keydown',key);w.addEventListener('popstate',cancelNavigation);w.addEventListener('pagehide',cancelNavigation);
w[K]={calendarFirst:CAL_FIRST,openCalendarView,stop(){stopped=true;pendingNavigation=null;obs.disconnect();w.clearInterval(timer);if(frame!==null)w.cancelAnimationFrame(frame);d.removeEventListener('click',click,true);d.removeEventListener('keydown',key);w.removeEventListener('popstate',cancelNavigation);w.removeEventListener('pagehide',cancelNavigation);clearList();restoreNav();delete w[K];}};sync();
})(window,document);

}catch(e){console.warn("ari block 27",e)}
try{

(function (w) {
  'use strict';
  const KEY = '__ariClientsCalmV1', d = w.document;
  if (w[KEY]) { w[KEY].reconcile(); return; }
  const PATH = '/v2/location/'+window.__ariLOC+'/contacts/smart_list/';
  const MARK = 'data-ari-clients-calm', OPEN = 'data-ari-clients-options';
  const TOOL = 'data-ari-clients-option', EMPTY = 'data-ari-clients-empty';
  const DUPLICATE = 'data-ari-clients-duplicate-add';
  let body = null, root = null, bar = null, button = null, heading = null;
  let expanded = false, stopped = false, frame = null, lastURL = '';
  const attributes = new Map(), textBackups = new Map();
  const norm = s => (s || '').replace(/\s+/g, ' ').trim();
  function scoped() {
    const path = w.location.pathname.replace(/\/$/, '');
    return w.location.protocol === 'https:' &&
      ['app.gohighlevel.com', 'app.zdsihq.com'].includes(w.location.hostname) &&
      (path.startsWith(PATH) && /^[A-Za-z0-9_-]+$/.test(path.slice(PATH.length))) &&
      d.body?.getAttribute('data-ari-clients-skin') === 'list';
  }
  function write(node, name, value) {
    let saved = attributes.get(node);
    if (!saved) { saved = new Map(); attributes.set(node, saved); }
    if (!saved.has(name)) saved.set(name, { original: node.getAttribute(name), written: value });
    const item = saved.get(name);
    item.written = value;
    if (node.getAttribute(name) !== value) node.setAttribute(name, value);
  }
  function restoreOne(node, name) {
    const saved = attributes.get(node), item = saved?.get(name);
    if (!item) return;
    if (node.getAttribute(name) === item.written) {
      if (item.original === null) node.removeAttribute(name);
      else node.setAttribute(name, item.original);
    }
    saved.delete(name);
    if (!saved.size) attributes.delete(node);
  }
  function plainCopy(node, from, to) {
    if (!node || node.children.length || norm(node.textContent) !== from) return;
    if (!textBackups.has(node)) textBackups.set(node, { original: node.textContent, written: to });
    if (node.textContent !== to) node.textContent = to;
  }
  function clear() {
    button?.remove(); heading?.remove();
    button = null; heading = null;
    for (const [node, saved] of Array.from(attributes)) {
      for (const name of Array.from(saved.keys())) restoreOne(node, name);
    }
    for (const [node, item] of textBackups) {
      if (node.textContent === item.written) node.textContent = item.original;
    }
    textBackups.clear(); body = null; root = null; bar = null; expanded = false;
  }
  function syncTools() {
    const found = new Set();
    const add = (node, role) => { if (node) { found.add(node); write(node, TOOL, role); } };
    // Structural selectors are from the captured native Clients DOM.
    add(bar.querySelector('.left-container'), 'views');
    add(root.querySelector('#import-contact-btn'), 'import');
    bar.querySelectorAll('.right-container > svg').forEach(node => add(node, 'menu'));
    add(root.querySelector('.quick-filter-bar .advanced-container'), 'filters');
    add(root.querySelector('.quick-filter-bar .columns-count'), 'columns');
    // These native top-tab IDs also exist in the installed Clients skin.
    ['tb_lists', 'tb_bulk-actions', 'tb_contact-custom-fields-settings', 'tb_tasks', 'tb_business']
      .forEach(id => add(d.getElementById(id), 'top-tab'));
    for (const [node, saved] of Array.from(attributes)) {
      if (saved.has(TOOL) && !found.has(node)) restoreOne(node, TOOL);
    }
    write(body, OPEN, expanded ? 'open' : 'closed');
    const value = String(expanded);
    if (button.getAttribute('aria-expanded') !== value) button.setAttribute('aria-expanded', value);
  }
  function syncEmpty() {
    const empties = root.querySelectorAll('#table-container .tabulator-placeholder');
    const duplicateButtons = new Set(), placeholders = new Set();
    empties.forEach(empty => {
      placeholders.add(empty); write(empty, EMPTY, 'native');
      // Do not hide unknown controls or infer state from rows. Only this exact
      // native placeholder Add Contact control can duplicate #add-contact-btn.
      const matches = Array.from(empty.querySelectorAll('button,[role="button"]'))
        .filter(node => /^(add contact|add client|add customer)$/i.test(norm(node.textContent)));
      if (matches.length === 1 && root.querySelector('#add-contact-btn')) {
        duplicateButtons.add(matches[0]); write(matches[0], DUPLICATE, 'true');
      }
      empty.querySelectorAll('.tabulator-placeholder-contents div').forEach(node => {
        plainCopy(node, "It's so lonely in here!", 'Your booked customers will show here');
        plainCopy(node, 'No Contacts in sight! Ready to create a fresh one?', 'When someone books a reading with you, they will appear here.');
      });
    });
    for (const [node, saved] of Array.from(attributes)) {
      if (saved.has(EMPTY) && !placeholders.has(node)) restoreOne(node, EMPTY);
      if (saved.has(DUPLICATE) && !duplicateButtons.has(node)) restoreOne(node, DUPLICATE);
    }
  }
  function reconcile() {
    if (stopped) return;
    lastURL = w.location.href;
    const next = scoped() ? d.getElementById('crm-contacts-view') : null;
    const nextBar = next?.querySelector('#smart-list-views-bar');
    const nativeAdd = next?.querySelector('#add-contact-btn');
    const search = next?.querySelector('input#list-view-record-search');
    const host = nextBar?.querySelector('.right-container');
    const row = nextBar?.querySelector('.bar');
    if (!next || !nativeAdd || !search || !host || !row) { clear(); return; }
    if (body && (body !== d.body || next !== root || nextBar !== bar ||
        button?.parentElement !== host || heading?.parentElement !== row)) clear();
    if (!body) {
      if (d.body.hasAttribute(MARK) || d.getElementById('ari-clients-options-toggle')) return;
      body = d.body; root = next; bar = nextBar;
      heading = d.createElement('h2'); heading.id = 'ari-clients-list-heading';
      heading.textContent = 'Customers'; row.insertBefore(heading, row.firstChild);
      button = d.createElement('button'); button.id = 'ari-clients-options-toggle';
      button.type = 'button'; button.textContent = 'Options';
      button.setAttribute('aria-label', 'Customer list options');
      button.setAttribute('aria-expanded', 'false');
      button.addEventListener('click', () => { expanded = !expanded; syncTools(); });
      host.appendChild(button); write(body, MARK, 'v1');
    }
    if (search.getAttribute('placeholder') === 'Search contacts') write(search, 'placeholder', 'Search customers');
    if (!search.hasAttribute('aria-label')) write(search, 'aria-label', 'Search customers');
    syncTools(); syncEmpty();
  }
  function schedule() {
    if (stopped || frame !== null) return;
    frame = w.requestAnimationFrame(() => { frame = null; reconcile(); });
  }
  function onRoute() { reconcile(); schedule(); }
  function onKey(event) {
    if (event.key !== 'Escape' || !expanded || !root?.contains(event.target)) return;
    // Native dialogs, popovers and filter drawers retain their own Escape.
    if (Array.from(d.querySelectorAll('[role="dialog"],[role="alertdialog"],[role="menu"],.hr-drawer-container'))
      .some(node => node.getClientRects().length > 0 && w.getComputedStyle(node).visibility !== 'hidden')) return;
    expanded = false; syncTools(); button?.focus();
  }
  const observer = new w.MutationObserver(schedule);
  observer.observe(d.documentElement, { childList: true, subtree: true, attributes: true,
    attributeFilter: ['data-ari-clients-skin'] });
  const timer = w.setInterval(() => { if (lastURL !== w.location.href) reconcile(); }, 150);
  d.addEventListener('visibilitychange', onRoute); d.addEventListener('keydown', onKey);
  w.addEventListener('popstate', onRoute); w.addEventListener('hashchange', onRoute);
  const api = Object.freeze({ reconcile, stop() {
    if (stopped) return;
    stopped = true; observer.disconnect(); w.clearInterval(timer);
    if (frame !== null) w.cancelAnimationFrame(frame);
    d.removeEventListener('visibilitychange', onRoute); d.removeEventListener('keydown', onKey);
    w.removeEventListener('popstate', onRoute); w.removeEventListener('hashchange', onRoute);
    clear(); if (w[KEY] === api) delete w[KEY];
  }, get status() { return { active: !!body, optionsOpen: expanded }; } });
  w[KEY] = api;
  try { reconcile(); } catch (error) { api.stop(); throw error; }
})(window);

}catch(e){console.warn("ari block 28",e)}
try{

(function (w) {
  'use strict';
  const KEY = '__ariClientsEmptyV2', d = w.document;
  if (w[KEY]) { w[KEY].reconcile(); return; }
  const PATH = '/v2/location/'+window.__ariLOC+'/contacts/smart_list/';
  const STATE = 'data-ari-clients-empty-v2', WRAP = 'data-ari-clients-empty-wrap';
  const COPY = 'data-ari-clients-empty-copy', FRAME = 'data-ari-clients-empty-frame';
  const owned = new Map();
  let stopped = false, active = false;
  const norm = value => (value || '').replace(/\s+/g, ' ').trim();
  const all = (node, selector) => Array.from(node.querySelectorAll(selector));
  const one = (node, selector) => { const nodes = all(node, selector); return nodes.length === 1 ? nodes[0] : null; };
  function route(url) {
    const path = url.pathname.replace(/\/$/, '');
    return url.protocol === 'https:' && ['app.zdsihq.com', 'app.gohighlevel.com'].includes(url.hostname) &&
      (path.startsWith(PATH) && /^[A-Za-z0-9_-]+$/.test(path.slice(PATH.length)));
  }
  function evidence() {
    if (!route(w.location) || d.body?.getAttribute('data-ari-clients-skin') !== 'list' ||
        d.body?.getAttribute('data-ari-clients-calm') !== 'v1') return null;
    const root = one(d, '#crm-contacts-view');
    if (!root) return null;
    const container = one(root, '#table-container');
    const search = one(root, 'input#list-view-record-search');
    const primary = one(root, '#add-contact-btn');
    if (!container || !search || search.value !== '' || !primary) return null;
    const table = one(container, '.my-table.tabulator');
    if (!table || container.querySelector('.tabulator-row')) return null;
    const empty = one(table, '.tabulator-placeholder');
    if (!empty || empty.getAttribute('data-ari-clients-empty') !== 'native' || empty.contains(primary)) return null;
    const holder = empty.parentElement;
    if (!holder?.classList.contains('tabulator-tableholder') || holder.parentElement !== table) return null;
    const contents = one(empty, '.tabulator-placeholder-contents');
    if (!contents || /No contacts found/i.test(norm(empty.textContent))) return null;
    const leaves = all(contents, 'div').filter(node => node.children.length === 0);
    const titles = leaves.filter(node => ['Your booked customers will show here', "It's so lonely in here!"].includes(norm(node.textContent)));
    const descriptions = leaves.filter(node => ['When someone books a reading with you, they will appear here.', 'No Contacts in sight! Ready to create a fresh one?'].includes(norm(node.textContent)));
    if (titles.length !== 1 || descriptions.length !== 1) return null;
    const duplicate = one(empty, '[data-ari-clients-duplicate-add="true"]');
    const adds = all(empty, 'button,[role="button"]').filter(node => /^(add contact|add client|add customer)$/i.test(norm(node.textContent)));
    if (!duplicate || adds.length !== 1 || adds[0] !== duplicate) return null;
    const wraps = new Set([contents]);
    for (const leaf of [titles[0], descriptions[0]]) {
      let node = leaf;
      while (node && node !== contents) {
        if (node.tagName !== 'DIV') return null;
        wraps.add(node); node = node.parentElement;
      }
      if (node !== contents) return null;
    }
    return { container, table, holder, empty, contents, title: titles[0], description: descriptions[0], wraps };
  }
  function restore(node, name) {
    const saved = owned.get(node), item = saved?.get(name);
    if (!item) return;
    // Never overwrite a later external change when relinquishing ownership.
    if (node.getAttribute(name) === item.written) {
      if (item.original === null) node.removeAttribute(name);
      else node.setAttribute(name, item.original);
    }
    saved.delete(name); if (!saved.size) owned.delete(node);
  }
  function clear() {
    active = false;
    for (const [node, saved] of Array.from(owned)) {
      for (const name of Array.from(saved.keys())) restore(node, name);
    }
  }
  function reconcile() {
    if (stopped) return;
    const found = evidence();
    if (!found) { clear(); return; }
    const desired = new Map();
    const add = (node, name, value) => {
      if (!desired.has(node)) desired.set(node, new Map());
      desired.get(node).set(name, value);
    };
    for (const role of ['container', 'table', 'holder', 'empty', 'contents']) add(found[role], FRAME, role);
    for (const node of found.wraps) add(node, WRAP, 'v2');
    add(found.title, COPY, 'title'); add(found.description, COPY, 'description');
    add(found.table, STATE, 'no-records');
    for (const [node, saved] of Array.from(owned)) {
      for (const name of Array.from(saved.keys())) if (!desired.get(node)?.has(name)) restore(node, name);
    }
    for (const [node, attrs] of desired) for (const [name, value] of attrs) {
      if (!owned.has(node)) owned.set(node, new Map());
      const saved = owned.get(node);
      if (!saved.has(name)) saved.set(name, { original: node.getAttribute(name), written: value });
      if (node.getAttribute(name) !== value) node.setAttribute(name, value);
    }
    active = true;
  }
  function onInput(event) {
    if (event.target?.id === 'list-view-record-search') reconcile();
  }
  function onClick(event) {
    const link = event.target?.closest?.('a[href]');
    if (!link) return;
    try { if (!route(new w.URL(link.href, w.location.href))) clear(); } catch (_) { /* Native navigation owns malformed links. */ }
  }
  // Own presentation attributes are deliberately absent from the observer
  // filter, so marking/restoration does not generate another observer pass.
  const observer = new w.MutationObserver(reconcile);
  observer.observe(d.documentElement, { childList: true, subtree: true, characterData: true, attributes: true,
    attributeFilter: ['class', 'id', 'role', 'value', 'data-ari-clients-skin', 'data-ari-clients-calm',
      'data-ari-clients-empty', 'data-ari-clients-duplicate-add'] });
  d.addEventListener('input', onInput, true); d.addEventListener('change', onInput, true);
  d.addEventListener('click', onClick, true); d.addEventListener('visibilitychange', reconcile);
  w.addEventListener('popstate', reconcile); w.addEventListener('hashchange', reconcile);
  // Covers native history changes and programmatic search-value changes that
  // emit neither an event nor a DOM mutation, matching the existing skin cadence.
  const timer = w.setInterval(reconcile, 150);
  const api = Object.freeze({ reconcile, stop() {
    if (stopped) return;
    stopped = true; observer.disconnect(); w.clearInterval(timer);
    d.removeEventListener('input', onInput, true); d.removeEventListener('change', onInput, true);
    d.removeEventListener('click', onClick, true); d.removeEventListener('visibilitychange', reconcile);
    w.removeEventListener('popstate', reconcile); w.removeEventListener('hashchange', reconcile);
    clear(); if (w[KEY] === api) delete w[KEY];
  }, get status() { return { active }; } });
  w[KEY] = api;
  try { reconcile(); } catch (error) { api.stop(); throw error; }
})(window);

}catch(e){console.warn("ari block 29",e)}
try{

(function(w){
'use strict';
const d=w.document,K='__ariChatDrawerV1',M='data-ari-chat-drawer',O='data-ari-chat-menu-open';
const P='/v2/location/'+window.__ariLOC+'/ask-ai';
if(w[K]){w[K].reconcile();return;}
let root=null,content=null,panel=null,main=null,toolbar=null,toggle=null,backdrop=null;
let open=false,session=false,frame=null,stopped=false,last=w.location.href,observer=null,timer=null;
let savedPanel=null,savedMain=null,savedClose=null;
function askPath(path){const p=path.replace(/\/$/,'');const base=P;return p===base||(p.startsWith(base+'/')&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p.slice(base.length+1)));}function inScope(){return w.location.protocol==='https:'&&['app.gohighlevel.com','app.zdsihq.com'].includes(w.location.hostname)&&askPath(w.location.pathname);}
function attr(el,key,value){if(!el)return;if(value===null){if(el.hasAttribute(key))el.removeAttribute(key);}else if(el.getAttribute(key)!==value)el.setAttribute(key,value);}
function restore(el,key,old,written){if(el&&el.getAttribute(key)===written)attr(el,key,old);}
function visible(el){return !!el&&el.getClientRects().length>0&&w.getComputedStyle(el).visibility!=='hidden';}
function focusables(){return panel?Array.from(panel.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')).filter(el=>!el.disabled&&el.getAttribute('tabindex')!=='-1'&&visible(el)):[];}
function nativeButton(){return panel?.querySelector('#askai-left-panel__recent-header-close');}
function nativeCollapsed(){return !!panel?.querySelector('.askai-left-panel--collapsed');}
function restoreMain(){if(!main||!savedMain)return;restore(main,'inert',savedMain.inert,'');restore(main,'aria-hidden',savedMain.ariaHidden,'true');}
function paint(){
 if(!root||!panel||!main)return;
 attr(d.body,M,'v1');attr(d.body,O,String(open));attr(toggle,'aria-expanded',String(open));
 backdrop.hidden=!open;
 if(open){attr(panel,'role','dialog');attr(panel,'aria-modal','true');attr(panel,'aria-label','Chat menu');attr(panel,'tabindex','-1');attr(main,'inert','');attr(main,'aria-hidden','true');}
 else{restore(panel,'role',savedPanel.role,'dialog');restore(panel,'aria-modal',savedPanel.modal,'true');restore(panel,'aria-label',savedPanel.label,'Chat menu');restore(panel,'tabindex',savedPanel.tabindex,'-1');restoreMain();}
 const close=nativeButton();
 if(savedClose?.node!==close){if(savedClose)restore(savedClose.node,'aria-label',savedClose.label,'Close chat menu');savedClose=close?{node:close,label:close.getAttribute('aria-label')}:null;}
 if(close&&!nativeCollapsed())attr(close,'aria-label','Close chat menu');
}
function closeMenu(focus){open=false;paint();if(focus&&toggle?.isConnected)toggle.focus();}
function openMenu(){
 if(!panel||open)return;
 if(nativeCollapsed()){const native=nativeButton();if(!native)return;native.click();}
 open=true;paint();
 w.requestAnimationFrame(()=>{if(!open||!panel)return;if(nativeCollapsed()){closeMenu(true);return;}const target=nativeButton()||focusables()[0]||panel;target.focus();});
}
function unmount(){
 toolbar?.remove();backdrop?.remove();restoreMain();
 if(savedClose)restore(savedClose.node,'aria-label',savedClose.label,'Close chat menu');
 if(panel&&savedPanel){restore(panel,'id',savedPanel.id,'ari-chat-menu-panel');restore(panel,'role',savedPanel.role,'dialog');restore(panel,'aria-modal',savedPanel.modal,'true');restore(panel,'aria-label',savedPanel.label,'Chat menu');restore(panel,'tabindex',savedPanel.tabindex,'-1');}
 d.body?.removeAttribute(M);d.body?.removeAttribute(O);
 root=content=panel=main=toolbar=toggle=backdrop=savedPanel=savedMain=savedClose=null;
}
function mount(nextRoot,nextContent,nextPanel,nextMain){
 root=nextRoot;content=nextContent;panel=nextPanel;main=nextMain;
 savedPanel={id:panel.getAttribute('id'),role:panel.getAttribute('role'),modal:panel.getAttribute('aria-modal'),label:panel.getAttribute('aria-label'),tabindex:panel.getAttribute('tabindex')};
 savedMain={inert:main.getAttribute('inert'),ariaHidden:main.getAttribute('aria-hidden')};
 if(!panel.id)panel.id='ari-chat-menu-panel';
 toolbar=d.createElement('div');toolbar.id='ari-chat-toolbar';toolbar.setAttribute('aria-label','Chat controls');
 toggle=d.createElement('button');toggle.id='ari-chat-menu-toggle';toggle.type='button';toggle.setAttribute('aria-label','Open chat menu');toggle.setAttribute('aria-controls',panel.id);toggle.setAttribute('aria-expanded','false');
 const icon=d.createElement('span');icon.className='ari-chat-menu-icon';icon.setAttribute('aria-hidden','true');icon.textContent='☰';
 const label=d.createElement('span');label.textContent='Chats';toggle.append(icon,label);toggle.addEventListener('click',openMenu);toolbar.append(toggle);main.prepend(toolbar);
 backdrop=d.createElement('button');backdrop.id='ari-chat-menu-backdrop';backdrop.type='button';backdrop.tabIndex=-1;backdrop.setAttribute('aria-label','Close chat menu');backdrop.hidden=true;backdrop.addEventListener('click',()=>closeMenu(true));content.append(backdrop);
 paint();
}
function reconcile(){
 if(stopped)return;last=w.location.href;
 if(!inScope()||!d.body){unmount();open=false;session=false;return;}
 if(!session){session=true;open=false;}
 const nextRoot=d.getElementById('ask-ai-container-pmd'),nextContent=nextRoot?.querySelector('.askai-sidebar__content'),nextPanel=nextContent?.querySelector('.askai-sidebar__left-panel'),nextMain=nextContent?.querySelector('.askai-sidebar__main');
 if(!nextRoot||!nextContent||!nextPanel||!nextMain){unmount();return;}
 if(root!==nextRoot||content!==nextContent||panel!==nextPanel||main!==nextMain||!main.contains(toolbar)||!content.contains(backdrop)){unmount();mount(nextRoot,nextContent,nextPanel,nextMain);}
 else paint();
}
function schedule(){if(!stopped&&frame===null)frame=w.requestAnimationFrame(()=>{frame=null;reconcile();});}
function externalPopup(){return Array.from(d.querySelectorAll('[role="dialog"],[role="alertdialog"],[role="menu"],[role="listbox"]')).some(el=>el!==panel&&!panel?.contains(el)&&visible(el));}
function keydown(e){
 if(!open||e.defaultPrevented||!panel||externalPopup())return;
 if(e.key==='Escape'){e.preventDefault();closeMenu(true);return;}
 if(e.key!=='Tab')return;
 const items=focusables();if(!items.length){e.preventDefault();panel.focus();return;}
 const first=items[0],last=items[items.length-1],active=d.activeElement;
 if(e.shiftKey&&(active===first||!panel.contains(active))){e.preventDefault();last.focus();}
 else if(!e.shiftKey&&(active===last||!panel.contains(active))){e.preventDefault();first.focus();}
}
function click(e){
 const target=e.target?.closest?.('#askai-left-panel__recent-header-close');
 if(open&&target&&panel?.contains(target)){closeMenu(true);return;}
 if(open&&content&&!content.contains(e.target)&&!externalPopup())closeMenu(false);
 const link=e.target?.closest?.('a[href]');if(!link)return;
 try{const u=new w.URL(link.href,w.location.href);if(u.origin!==w.location.origin||!askPath(u.pathname)){unmount();open=false;session=false;}}catch(_){}
 schedule();
}
function route(){reconcile();schedule();}
function stop(){if(stopped)return;stopped=true;if(frame!==null)w.cancelAnimationFrame(frame);observer?.disconnect();if(timer!==null)w.clearInterval(timer);d.removeEventListener('click',click,true);d.removeEventListener('keydown',keydown);d.removeEventListener('visibilitychange',route);w.removeEventListener('popstate',route);w.removeEventListener('hashchange',route);unmount();if(w[K]===api)delete w[K];}
const api=Object.freeze({reconcile,stop});w[K]=api;
try{d.addEventListener('click',click,true);d.addEventListener('keydown',keydown);d.addEventListener('visibilitychange',route);w.addEventListener('popstate',route);w.addEventListener('hashchange',route);observer=new w.MutationObserver(schedule);observer.observe(d.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','aria-label']});timer=w.setInterval(()=>{if(last!==w.location.href)reconcile();},150);reconcile();}catch(error){stop();throw error;}
})(window);

}catch(e){console.warn("ari block 30",e)}
try{

(function(w){
'use strict';
const d=w.document,K='__ariPersistentMusicV1';
const B='/v2/location/'+window.__ariLOC+'/';
const SRC='https://embed.music.apple.com/us/playlist/ari-playlist/pl.u-r2yBBYBFPKgjJM1';
if(w[K]){w[K].reconcile();return;}
let body=null,panel=null,playerHost=null,player=null,toggle=null,hideButton=null,stopButton=null;
let opened=false,stopped=false,suspended=false,animation=null,last=w.location.href;
function scoped(){return w.location.protocol==='https:'&&['app.gohighlevel.com','app.zdsihq.com'].includes(w.location.hostname)&&w.location.pathname.startsWith(B);}
function attr(node,name,value){if(node&&node.getAttribute(name)!==value)node.setAttribute(name,value);}
function make(tag,id,text){const n=d.createElement(tag);if(id)n.id=id;if(text)n.textContent=text;return n;}
function button(id,text,handler){const n=make('button',id,text);n.type='button';n.addEventListener('click',handler);return n;}
function paint(){
 if(panel){
  attr(panel,'data-open',String(opened));attr(panel,'aria-hidden',String(!opened));
  if(opened)panel.removeAttribute('inert');else attr(panel,'inert','');
 }
 if(toggle){
  attr(toggle,'aria-expanded',String(opened));
  attr(toggle,'aria-label',opened?'Hide music player':'Open music player');
  // "Loaded" means retained, never an unverified claim that audio is playing.
  attr(toggle,'data-player-loaded',String(!!player));
  attr(toggle,'title',player?'Music player loaded. Open for playback controls.':'Open music player');
 }
 if(stopButton&&stopButton.disabled!==!player)stopButton.disabled=!player;
}
function hide(focus){
 opened=false;
 // Never leave keyboard focus inside an inert/aria-hidden iframe.
 if(focus||panel?.contains(d.activeElement))toggle?.focus();
 paint();
}
function unload(){
 // Removing the native frame is the only supported stop/reset operation.
 // Hiding and route changes do not call this.
 if(player){player.remove();player=null;}
 paint();
}
function clear(){
 unload();toggle?.remove();panel?.remove();
 toggle=panel=playerHost=hideButton=stopButton=null;body=null;opened=false;
}
function mountPanel(){
 body=d.body;panel=make('section','ari-persistent-music-panel');
 panel.setAttribute('role','region');panel.setAttribute('aria-labelledby','ari-persistent-music-title');
 const row=make('div');row.className='ari-persistent-music-heading';
 const title=make('h2','ari-persistent-music-title','Music');
 stopButton=button('ari-persistent-music-stop','Stop',()=>{unload();hide(true);});
 stopButton.setAttribute('aria-label','Stop and reset music player');
 hideButton=button('ari-persistent-music-hide','Hide',()=>hide(true));
 hideButton.setAttribute('aria-label','Hide music player without stopping');
 row.append(title,stopButton,hideButton);
 playerHost=make('div','ari-persistent-music-frame');
 const help=make('p','ari-persistent-music-help','Use Apple Music’s controls to play, pause or choose a song. Hiding keeps the player loaded while you move around Ari.');
 const note=make('p','ari-persistent-music-note','Apple Music previews. Full songs may require sign-in and a subscription. Refreshing or leaving this app stops playback; your phone may pause it in the background.');
 panel.append(row,playerHost,help,note);
 // Append exactly once, outside GHL/Vue route and header trees. Moving a live
 // iframe to another parent can reload it, even if the element object is kept.
 body.appendChild(panel);paint();
}
function open(){
 if(stopped||!scoped())return;
 reconcile();if(!panel||!toggle?.isConnected)return;
 if(!player){
  const iframe=make('iframe','ari-persistent-music-iframe');
  iframe.title='Music — Apple Music playlist player';
  iframe.setAttribute('allow','autoplay *; encrypted-media *;');
  iframe.setAttribute('frameborder','0');iframe.height='450';
  iframe.setAttribute('sandbox','allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation');
  // Same existing official native embed. Creation is only on this user click;
  // no autoplay query, playback call, or request to bypass browser policies.
  iframe.src=SRC;player=iframe;playerHost.appendChild(iframe);
 }
 opened=true;paint();hideButton.focus();
}
function mountToggle(host){
 toggle?.remove();
 toggle=button('ari-persistent-music-toggle','',()=>opened?hide(true):open());
 toggle.setAttribute('aria-controls','ari-persistent-music-panel');
 const icon=make('span',null,'♫');icon.setAttribute('aria-hidden','true');icon.className='ari-persistent-music-icon';
 const label=make('span',null,'Music');label.className='ari-persistent-music-label';
 toggle.append(icon,label);host.prepend(toggle);paint();
}
function reconcile(){
 if(stopped||suspended)return;
 const changed=last!==w.location.href;last=w.location.href;
 if(!scoped()||!d.body){clear();return;}
 // An entire document/body replacement cannot preserve an iframe browsing
 // context. Reset quietly and require another user tap, never auto-resume.
 if(body&&(body!==d.body||!panel?.isConnected))clear();
 const hosts=d.querySelectorAll('header.hl_header > .container-fluid > .hl_header--controls');
 const host=hosts.length===1?hosts[0]:null;
 if(!panel&&host)mountPanel();
 if(!panel)return;
 if(host&&(!toggle?.isConnected||toggle.parentElement!==host))mountToggle(host);
 else if(!host&&toggle){toggle.remove();toggle=null;}
 if(changed||!host)hide(false);
 paint();
}
function queue(){if(!stopped&&!suspended&&animation===null)animation=w.requestAnimationFrame(()=>{animation=null;reconcile();});}
function onClick(e){
 if(!opened||panel?.contains(e.target)||toggle?.contains(e.target))return;
 hide(false);
}
function onKey(e){
 if(!opened||e.defaultPrevented||e.key!=='Escape')return;
 // Do not consume Escape from another native modal/menu.
 if(!panel?.contains(d.activeElement)&&d.activeElement!==toggle)return;
 e.preventDefault();hide(true);
}
function onPageHide(){suspended=true;if(animation!==null){w.cancelAnimationFrame(animation);animation=null;}clear();}
function onPageShow(){suspended=false;queue();}
const observer=new w.MutationObserver(queue);
observer.observe(d.documentElement,{childList:true,subtree:true});
const timer=w.setInterval(()=>{if(last!==w.location.href)reconcile();},150);
d.addEventListener('click',onClick);d.addEventListener('keydown',onKey);
w.addEventListener('popstate',queue);w.addEventListener('hashchange',queue);
w.addEventListener('pageshow',onPageShow);w.addEventListener('pagehide',onPageHide);
const api=Object.freeze({reconcile,stop(){
 if(stopped)return;stopped=true;observer.disconnect();w.clearInterval(timer);
 if(animation!==null)w.cancelAnimationFrame(animation);
 d.removeEventListener('click',onClick);d.removeEventListener('keydown',onKey);
 w.removeEventListener('popstate',queue);w.removeEventListener('hashchange',queue);
 w.removeEventListener('pageshow',onPageShow);w.removeEventListener('pagehide',onPageHide);
 clear();if(w[K]===api)delete w[K];
},get status(){return{inScope:scoped(),mounted:!!toggle?.isConnected,open:opened,playerLoaded:!!player?.isConnected};}});
w[K]=api;
try{reconcile();}catch(error){api.stop();throw error;}
})(window);

}catch(e){console.warn("ari block 31",e)}
try{

(function (w) {
  'use strict';
  const d = w.document, KEY = '__ariProductLabelsV1';
  const BASE = '/v2/location/'+window.__ariLOC+'/';
  const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
  const CHAT = new RegExp('^' + BASE + 'ask-ai(?:/' + UUID + ')?/?$', 'i');
  // Vetted against the native UI on 2026-10-06; no global text replacement.
  // Ask AI -> Ask Ari renames removed (built-in assistant must never be called Ari).
  const product = new Map();
  const SHELL_RULES = [];
  const RULES = [];
  const EXCLUDE = '[role="log"], [contenteditable], textarea, input, .askai-left-panel__history, .chat-view__messages, .chat-message';
  if (w[KEY]) { w[KEY].reconcile(); return; }
  const edits = new Map();
  let stopped = false, frame = null, observer = null, timer = null, lastURL = '';
  function allowed() {
    return w.location.protocol === 'https:' &&
      ['app.zdsihq.com', 'app.gohighlevel.com'].includes(w.location.hostname) &&
      w.location.pathname.startsWith(BASE);
  }
  function get(node, field) { return field === '#text' ? node.nodeValue : node.getAttribute(field); }
  function put(node, field, value) {
    if (field === '#text') node.nodeValue = value;
    else if (value === null) node.removeAttribute(field);
    else node.setAttribute(field, value);
  }
  function restore(node, fields) {
    for (const [field, entry] of fields) {
      if (get(node, field) === entry.written) put(node, field, entry.original);
    }
  }
  function clear() {
    for (const [node, fields] of edits) restore(node, fields);
    edits.clear();
  }
  function write(node, field, pairs, seen) {
    const current = get(node, field);
    if (typeof current !== 'string') return;
    const next = typeof pairs === 'function' ? pairs(current) : pairs.get(current);
    let fields = edits.get(node), previous = fields?.get(field);
    if (previous && current === previous.written) {
      if (!seen.has(node)) seen.set(node, new Set());
      seen.get(node).add(field);
      return;
    }
    if (next === undefined || next === current) return;
    if (!fields) { fields = new Map(); edits.set(node, fields); }
    fields.set(field, { original: current, written: next });
    if (!seen.has(node)) seen.set(node, new Set());
    seen.get(node).add(field);
    put(node, field, next);
  }
  function reconcile() {
    if (stopped) return;
    lastURL = w.location.href;
    if (!allowed()) { clear(); return; }
    const root = CHAT.test(w.location.pathname) ? d.getElementById('ask-ai-container-pmd') : null;
    const seen = new Map();
    function apply(container, rules) {
      for (const rule of rules) {
        for (const el of container.querySelectorAll(rule.selector)) {
          if (el.closest(EXCLUDE)) continue;
          if (rule.text) {
            for (const node of el.childNodes) {
              if (node.nodeType === 3) write(node, '#text', rule.text, seen);
            }
          }
          if (rule.attributes) {
            for (const [field, pairs] of Object.entries(rule.attributes)) write(el, field, pairs, seen);
          }
        }
      }
    }
    apply(d, SHELL_RULES);
    // Both native full-page and header-opened panels share this fixed UI root.
    for (const panel of d.querySelectorAll('.hr-wrapper-container.askai > .hr-config-provider > .askai-sidebar')) apply(panel, RULES);
    // Only the empty-chat product title. Native conversation titles are never changed.
    if (root && w.location.pathname.replace(/\/$/, '') === BASE + 'ask-ai' && !w.location.search) {
      const title = d.querySelector('head > title');
      if (title) for (const node of title.childNodes) if (node.nodeType === 3) write(node, '#text', product, seen);
    }
    for (const [node, fields] of edits) {
      for (const [field, entry] of fields) {
        if (!seen.get(node)?.has(field)) {
          if (get(node, field) === entry.written) put(node, field, entry.original);
          fields.delete(field);
        }
      }
      if (!fields.size) edits.delete(node);
    }
  }
  // Content excluded from label replacement does not need fixed-UI rescans.
  // Fail open for unknown targets and preserve cleanup of owned nodes moved
  // into or out of an excluded subtree by the native application.
  function relevantMutation(record) {
    const target = record.target;
    const element = target?.nodeType === 1 ? target : target?.parentElement;
    if (!element || !element.closest(EXCLUDE) || edits.has(target)) return true;
    for (const owned of edits.keys()) if (target.contains?.(owned)) return true;
    if (record.type === 'childList') {
      for (const changed of [...record.addedNodes, ...record.removedNodes]) {
        for (const owned of edits.keys()) {
          if (changed === owned || changed.contains?.(owned)) return true;
        }
      }
    }
    return false;
  }
  function schedule() {
    if (!stopped && frame === null) frame = w.requestAnimationFrame(() => { frame = null; reconcile(); });
  }
  function route() { reconcile(); schedule(); }
  function stop() {
    if (stopped) return;
    stopped = true;
    if (frame !== null) w.cancelAnimationFrame(frame);
    observer?.disconnect();
    if (timer !== null) w.clearInterval(timer);
    w.removeEventListener('popstate', route);
    w.removeEventListener('hashchange', route);
    d.removeEventListener('visibilitychange', route);
    clear();
    if (w[KEY] === api) delete w[KEY];
  }
  const api = Object.freeze({ reconcile, stop });
  w[KEY] = api;
  try {
    observer = new w.MutationObserver(records => {
      if (lastURL !== w.location.href || records.some(relevantMutation)) schedule();
    });
    observer.observe(d.documentElement, { childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ['aria-label', 'title', 'alt', 'placeholder'] });
    timer = w.setInterval(() => { if (lastURL !== w.location.href) reconcile(); }, 150);
    w.addEventListener('popstate', route);
    w.addEventListener('hashchange', route);
    d.addEventListener('visibilitychange', route);
    reconcile();
  } catch (error) { stop(); throw error; }
})(window);


}catch(e){console.warn("ari block 32",e)}
try{

(function(){'use strict';if(window.__ariHomeScreen)return;window.__ariHomeScreen=1;
var ICON_URL='https://assets.cdn.filesafe.space/8otTGBxdVFDsQ1gNhDg0/media/6ad2ab1686f4a10b2fad5c32.png',NAME='Ari',COLOR='#1B5E3B',d=document;
function tag(sel,make){var el=d.head.querySelector(sel);if(!el){el=make();d.head.appendChild(el);}return el;}
function meta(n,c){var m=tag('meta[name="'+n+'"]',function(){var x=d.createElement('meta');x.name=n;return x;});if(m.content!==c)m.content=c;}
function apply(){if(!d.head)return;
 var l=tag('link[rel="apple-touch-icon"]',function(){var x=d.createElement('link');x.rel='apple-touch-icon';x.sizes='180x180';return x;});if(l.href!==ICON_URL)l.href=ICON_URL;
 meta('apple-mobile-web-app-title',NAME);meta('application-name',NAME);meta('theme-color',COLOR);
 meta('apple-mobile-web-app-capable','yes');meta('mobile-web-app-capable','yes');meta('apple-mobile-web-app-status-bar-style','default');
 if(d.title!==NAME)d.title=NAME;}
apply();new MutationObserver(apply).observe(d.head,{childList:true,subtree:true,characterData:true});})();


}catch(e){console.warn("ari block 33",e)}
try{

(function(w){'use strict';var K='__ariHideCrmAiV1';if(w[K]){w[K].sync();return;}
var d=w.document,B='/v2/location/'+window.__ariLOC+'/',ASK='/v2/location/'+window.__ariLOC+'/custom-menu-link/'+window.__ariAskId+'',A='data-ari-no-crm-ai',H='html['+A+']';
var CSS=[
 H+' body #sb_ask-ai',
 H+' body #sidebar-v2 a#sb_ask-ai',
 H+' body #hl_header--copilot-icon#hl_header--copilot-icon',
 H+' body .hl_header--controls #hl_header--copilot-icon',
 H+' body [aria-label="Ask AI Assistant"]',
 H+' body [aria-label="Ask Ari Assistant"]',
 H+' body a[href*="/v2/location/'+window.__ariLOC+'/ask-ai"]',
 H+' body .hr-wrapper-container.askai'
].join(',')+'{display:none!important;visibility:hidden!important;pointer-events:none!important}';
var style=null,last='',timer=null,obs=null;
function on(){return /^https:$/.test(w.location.protocol)&&w.location.pathname.indexOf(B)===0;}
function sync(){last=w.location.href;var root=d.documentElement;if(!root)return;
 if(on()){if(!root.hasAttribute(A))root.setAttribute(A,'v1');
  if(!style||!style.isConnected){style=d.getElementById('ari-no-crm-ai-style')||d.createElement('style');style.id='ari-no-crm-ai-style';style.textContent=CSS;(d.head||root).appendChild(style);}}
 else if(root.hasAttribute(A))root.removeAttribute(A);}
function askReady(){return ASK.indexOf('__')!==0;}
function onClick(e){if(!askReady()||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||!on())return;
 var a=e.target&&e.target.closest?e.target.closest('a[data-ari-ask-home-link][href]'):null;if(!a)return;
 var want;try{want=new w.URL(a.href,w.location.href);}catch(_){return;}
 var sb=d.getElementById('sidebar-v2');if(!sb)return;
 var m=Array.prototype.filter.call(sb.querySelectorAll('a[href]'),function(x){try{var u=new w.URL(x.href,w.location.href);return u.origin===want.origin&&u.pathname.replace(/\/$/,'')===want.pathname.replace(/\/$/,'');}catch(_){return false;}});
 if(m.length!==1||m[0]===a)return;e.preventDefault();m[0].click();}
w[K]={sync:sync,stop:function(){if(timer!==null)w.clearInterval(timer);if(obs)obs.disconnect();w.removeEventListener('click',onClick,true);w.removeEventListener('popstate',sync);if(style)style.remove();if(d.documentElement)d.documentElement.removeAttribute(A);delete w[K];}};
w.addEventListener('click',onClick,true);w.addEventListener('popstate',sync);
timer=w.setInterval(function(){if(last!==w.location.href||(on()&&(!style||!style.isConnected)))sync();},200);
if(d.head){obs=new w.MutationObserver(function(){if(on()&&style&&!style.isConnected)sync();});obs.observe(d.head,{childList:true});}
sync();})(window);

}catch(e){console.warn("ari block 34",e)}
try{

(function(w){'use strict';var K='__ariBellStyleV1';if(w[K]){w[K].sync();return;}
var d=w.document,B='/v2/location/'+window.__ariLOC+'/',A='data-ari-bell-v1',H='html['+A+'] body .hl_header--controls',T=H+' #recent_activities-toggle';
var CSS=[
 T+'{display:inline-flex!important;align-items:center!important;justify-content:center!important;position:relative!important;isolation:isolate;width:44px!important;height:44px!important;min-width:44px!important;min-height:44px!important;margin:0!important;padding:0!important;border:0!important;border-radius:14px!important;background:#fff!important;box-shadow:inset 0 0 0 50px #fff!important;color:#80682f!important;line-height:1!important;overflow:visible!important}',
 T+'::before{content:""!important;display:block!important;position:absolute!important;top:3px!important;right:3px!important;bottom:3px!important;left:3px!important;width:auto!important;height:auto!important;border:1px solid #decda3!important;border-radius:12px!important;background:#f8f3e7;box-sizing:border-box!important;pointer-events:none!important;z-index:0!important}',
 T+':hover::before{background:#efe5ce}',
 T+':focus-visible{outline:3px solid #80682f!important;outline-offset:2px}',
 T+' i{position:relative!important;z-index:1!important;width:16px!important;height:16px!important;font-size:16px!important;line-height:16px!important;color:#80682f!important;text-align:center}',
 T+'.-notification::after{content:""!important;display:block!important;position:absolute!important;top:8px!important;right:8px!important;width:8px!important;height:8px!important;border-radius:50%!important;background:#b3261e!important;box-shadow:0 0 0 1.5px #f8f3e7!important;pointer-events:none!important;z-index:2!important}',
 H+' #canny_logs-toggle .Canny_BadgeContainer{display:none!important}'
].join('\n');
var style=null,last='',timer=null,obs=null;
function on(){return w.location.protocol==='https:'&&w.location.pathname.indexOf(B)===0;}
function sync(){last=w.location.href;var root=d.documentElement;if(!root)return;
 if(on()){if(!root.hasAttribute(A))root.setAttribute(A,'');
  if(!style||!style.isConnected){style=d.getElementById('ari-bell-style-v1')||d.createElement('style');style.id='ari-bell-style-v1';style.textContent=CSS;(d.head||root).appendChild(style);}}
 else if(root.hasAttribute(A))root.removeAttribute(A);}
w[K]={sync:sync,stop:function(){if(timer!==null)w.clearInterval(timer);if(obs)obs.disconnect();w.removeEventListener('popstate',sync);if(style)style.remove();if(d.documentElement)d.documentElement.removeAttribute(A);delete w[K];}};
w.addEventListener('popstate',sync);
timer=w.setInterval(function(){if(last!==w.location.href||(on()&&(!style||!style.isConnected)))sync();},200);
if(d.head){obs=new w.MutationObserver(function(){if(on()&&style&&!style.isConnected)sync();});obs.observe(d.head,{childList:true});}
sync();})(window);

}catch(e){console.warn("ari block 35",e)}
try{

(function(w){'use strict';var K='__ariNotifPrivacyV2';if(w[K]){w[K].sync();return;}
var d=w.document,B='/v2/location/'+window.__ariLOC+'/',A='data-ari-hide-sub',LOC=/5501/,
 LABEL=/^sub[\s\u00a0-]?account(?![a-z])/i,ONLY=/^sub[\s\u00a0-]?account\s*[:\-\u2013\u2014]?\s*$/i,
 CTX='[aria-label="Notification Drawer"],.hl_recent-activities,#notification-list-containrer,[id^="notification-drawer"],[id^="notification_drawer"]',
 BAD='a,button,input,select,textarea,[role="button"],[contenteditable="true"]',SKIP={SCRIPT:1,STYLE:1,NOSCRIPT:1,TEXTAREA:1,INPUT:1,TITLE:1,TEMPLATE:1},
 XP='descendant-or-self::text()[contains(translate(.,"SUBACOUNT","subacount"),"sub")][contains(translate(.,"SUBACOUNT","subacount"),"account")]',
 hidden=[],pending=[],frame=null,last='',timer=null,obs=null,stopped=false;
function on(){return w.location.protocol==='https:'&&w.location.pathname.indexOf(B)===0;}
function txt(el){return (el.textContent||'').replace(/\s+/g,' ').trim();}
function line(t){var el=t.parentElement,i=0;if(!el||SKIP[el.tagName]||el.closest('#sidebar-v2,header.hl_header'))return null;
 /* the text node may hold only the label ("Sub-account" in its own span): climb to the small element that holds the whole line */
 while(el&&ONLY.test(txt(el))&&i<3){var p=el.parentElement;if(!p||p===d.body||txt(p).length>100||p.children.length>4)return null;el=p;i++;}
 var s=txt(el);if(!el||!LABEL.test(s)||s.length>100||el.children.length>4||el.matches(BAD)||el.querySelector(BAD))return null;
 if(!el.closest(CTX)&&!LOC.test(s))return null;return el;}
function hide(el){if(el.hasAttribute(A))return;el.setAttribute(A,'');el.style.setProperty('display','none','important');hidden.push(el);}
function show(el){el.removeAttribute(A);el.style.removeProperty('display');}
function scan(root){var x;try{x=d.evaluate(XP,root,null,7,null);}catch(_){return;}
 for(var i=0;i<x.snapshotLength;i++){var el=line(x.snapshotItem(i));if(el)hide(el);}}
function recheck(){hidden=hidden.filter(function(el){if(!el.isConnected)return false;var s=txt(el);
 if(LABEL.test(s)&&s.length<=100&&(el.closest(CTX)||LOC.test(s)))return true;show(el);return false;});} /* recycled nodes whose text changed are shown again */
function run(){frame=null;if(stopped)return;var list=pending;pending=[];if(!on()){restore();return;}
 recheck();for(var i=0;i<list.length;i++){var n=list[i];if(n.isConnected!==false)scan(n);}}
function queue(n){if(stopped||!on())return;pending.push(n);if(frame===null)frame=w.requestAnimationFrame(run);}
function restore(){hidden.forEach(show);hidden=[];}
function sync(){last=w.location.href;if(on())queue(d.body||d.documentElement);else restore();}
obs=new w.MutationObserver(function(rs){for(var i=0;i<rs.length;i++){var r=rs[i];
 if(r.type==='characterData'){if(r.target.parentNode)queue(r.target.parentNode);}
 else for(var j=0;j<r.addedNodes.length;j++){var n=r.addedNodes[j];if(n.nodeType===1||n.nodeType===3)queue(n.nodeType===3&&n.parentNode?n.parentNode:n);}}});
obs.observe(d.documentElement,{childList:true,subtree:true,characterData:true});
w.addEventListener('popstate',sync);timer=w.setInterval(function(){if(last!==w.location.href)sync();},300);
w[K]={sync:sync,stop:function(){stopped=true;obs.disconnect();if(timer!==null)w.clearInterval(timer);w.removeEventListener('popstate',sync);if(frame!==null)w.cancelAnimationFrame(frame);restore();delete w[K];}};
sync();})(window);

}catch(e){console.warn("ari block 36",e)}
try{

(function(w){'use strict';var K='__ariSoftV1';if(w[K]){w[K].sync();return;}
var d=w.document,B='/v2/location/'+window.__ariLOC+'/',FLAG='data-ari-soft',FONT_ID='ari-soft-fonts',stopped=false,frame=null,last='',tagged=[],texts=[];
function scoped(){try{if(w.localStorage.getItem('ari-soft-off')==='1')return false;}catch(e){}
 return w.location.protocol==='https:'&&['app.zdsihq.com','app.gohighlevel.com'].indexOf(w.location.hostname)>-1&&w.location.pathname.indexOf(B)===0;}
function fonts(on){var l=d.getElementById(FONT_ID);if(on&&!l){l=d.createElement('link');l.id=FONT_ID;l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Jost:wght@400;450;500;600&display=swap';d.head.appendChild(l);}if(!on&&l)l.remove();}
function tag(el,a,v){if(!el||el.hasAttribute(a))return;el.setAttribute(a,v||'');tagged.push([el,a]);}
function setText(node,txt){if(node.nodeValue===txt)return;texts.push([node,node.nodeValue]);node.nodeValue=txt;}
function byText(root,xp){var r=d.evaluate(xp,root,null,7,null),o=[];for(var i=0;i<r.snapshotLength;i++)o.push(r.snapshotItem(i));return o;}
/* Find the notifications panel: the nearest ancestor of "Mark all as read" that also contains the "Notifications" heading. */
function notif(){var dw=d.querySelector('[aria-label="Notification Drawer"]');if(!dw)return; /* SPEED: drawer not open, nothing to tag */
 var R=(dw.closest&&dw.closest('.drawer-panel'))||dw.parentElement||dw;var mk=byText(R,'.//*[normalize-space(text())="Mark all as read"]')[0];if(!mk)return;
 var p=mk;while(p&&p!==d.body&&!byText(p,'.//*[normalize-space(text())="Notifications"]').length)p=p.parentElement;var dr=d.querySelector('[aria-label="Notification Drawer"] .hl_recent-activities');if(dr&&dr.contains(mk))p=dr; /* install patch: real drawer root */
 if(!p||p===d.body)return;
 tag(p,'data-ari-notif','v1');tag(mk,'data-ari-notif-markall');
 byText(p,'.//*[normalize-space(text())="Notifications"]').forEach(function(h){tag(h,'data-ari-notif-title');});
 byText(p,'.//*[normalize-space(text())="System" or normalize-space(text())="Alert"]').forEach(function(t){tag(t,'data-ari-notif-tab');if(t.parentElement)tag(t.parentElement,'data-ari-notif-tabs');
   var sel=t.getAttribute('aria-selected')==='true'||/active|selected/.test(t.className||'')||(t.parentElement&&/active|selected/.test(t.parentElement.className||''));if(sel)t.setAttribute('data-on','');else t.removeAttribute('data-on');
   t.childNodes.forEach(function(n){if(n.nodeType===3){var v=n.nodeValue.trim();if(v==='System')setText(n,'Updates');if(v==='Alert')setText(n,'Alerts');}});});
 /* cards: each "System Notification" label's card = the ancestor that is a direct child of the shared list */
 var kinds=byText(p,'.//*[normalize-space(text())="System Notification" or normalize-space(text())="Message"][not(ancestor::*[@data-ari-notif-tabs])]');
 kinds.forEach(function(k){tag(k,'data-ari-notif-kind');});
 var LIST=p.querySelector('#notification-list-containrer')||p; /* install patch: never climb past the list */
 kinds.forEach(function(k){var c=k;while(c.parentElement&&c.parentElement!==p&&c.parentElement!==LIST&&c.parentElement.querySelectorAll('[data-ari-notif-kind]').length<2)c=c.parentElement;
   tag(c,'data-ari-notif-card');if(c.parentElement)tag(c.parentElement,'data-ari-notif-list');
   c.querySelectorAll('*').forEach(function(e){var r=e.getBoundingClientRect();if(r.width>0&&r.width<=12&&Math.abs(r.width-r.height)<2&&!e.children.length&&!e.textContent.trim())tag(e,'data-ari-notif-dot');
     else if(r.width>=30&&r.width<=56&&Math.abs(r.width-r.height)<3&&e.querySelector('svg,i,img'))tag(e,'data-ari-notif-icon');});
   /* unread = the card still has its little dot (the dashboard removes it once read) */
   if(c.querySelector('[data-ari-notif-dot]'))c.setAttribute('data-ari-unread','');else c.removeAttribute('data-ari-unread');
   k.childNodes.forEach(function(n){if(n.nodeType===3&&n.nodeValue.trim()==='System Notification')setText(n,'Message');});
   byText(c,'.//*[starts-with(normalize-space(text()),"New Live Chat message from")]').forEach(function(h){tag(h,'data-ari-notif-head');h.childNodes.forEach(function(n){if(n.nodeType!==3)return;var v=n.nodeValue.trim(),m;
     if(/^New Live Chat message from Guest Visitor\b/.test(v))setText(n,'New message from a guest');else if((m=v.match(/^New Live Chat message from (.+)$/)))setText(n,'New message from '+m[1]);});});
   byText(c,'.//*[contains(normalize-space(text())," ago")]').forEach(function(t){tag(t,'data-ari-notif-time');});
   byText(c,'.//*[starts-with(normalize-space(text()),"Sub-account ")]').forEach(function(s){tag(s,'data-ari-hide');});});}
function clear(){d.querySelectorAll('[data-ari-unread],[data-on]').forEach(function(e){e.removeAttribute('data-ari-unread');e.removeAttribute('data-on');});tagged.forEach(function(x){x[0].removeAttribute(x[1]);});tagged=[];texts.forEach(function(x){if(x[0].isConnected)x[0].nodeValue=x[1];});texts=[];}
function sync(){frame=null;if(stopped)return;last=w.location.href;var on=scoped();if(on){d.documentElement.setAttribute(FLAG,'v1');fonts(true);try{notif();}catch(e){}}else{d.documentElement.removeAttribute(FLAG);fonts(false);clear();}}
function queue(){if(!stopped&&frame===null)frame=w.requestAnimationFrame(sync);}
var obs=new MutationObserver(queue);obs.observe(d.documentElement,{childList:true,subtree:true});var timer=w.setInterval(function(){if(last!==w.location.href)sync();},200);
w[K]={sync:sync,stop:function(){stopped=true;obs.disconnect();w.clearInterval(timer);d.documentElement.removeAttribute(FLAG);fonts(false);clear();delete w[K];}};sync();})(window);

}catch(e){console.warn("ari block 37",e)}
try{

(function(w){'use strict';var K='__ariLuxeV1';if(w[K]){w[K].sync();return;}var d=w.document,F='data-ari-luxe',stopped=false,frame=null,filled=[];
function off(){try{return w.localStorage.getItem('ari-luxe-off')==='1';}catch(e){return false;}}
function phase(){var age=((Date.now()-Date.UTC(2000,0,6,18,14))/864e5)%29.530588;if(age<0)age+=29.530588;
 /* named phases only within about a day of the exact moment, the way calendars say it */
 if(age<1||age>28.5)return 'New moon';if(age<6.4)return 'Waxing crescent';if(age<=8.4)return 'First quarter';if(age<13.8)return 'Waxing gibbous';
 if(age<=15.8)return 'Full moon';if(age<21.1)return 'Waning gibbous';if(age<=23.1)return 'Last quarter';return 'Waning crescent';}
function login(){var on=w.location.hostname==='app.zdsihq.com'&&!!d.querySelector('section.hl_login')&&!off();
 if(on){d.documentElement.setAttribute('data-ari-login-luxe','v1');if(!d.getElementById('ari-luxe-fonts')){var l=d.createElement('link');l.id='ari-luxe-fonts';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Jost:wght@400;500;600&display=swap';d.head.appendChild(l);}}
 else d.documentElement.removeAttribute('data-ari-login-luxe');}
function sync(){frame=null;if(stopped)return;login();var on=d.documentElement.getAttribute('data-ari-soft')==='v1'&&!off();
 if(on){if(d.documentElement.getAttribute(F)!=='v1')d.documentElement.setAttribute(F,'v1');
  var day=new Date().toLocaleDateString('en-US',{weekday:'short'});d.querySelectorAll('[data-ari-moon]').forEach(function(el){var t=day+' · '+phase();if(el.textContent!==t){if(filled.indexOf(el)<0)filled.push(el);el.textContent=t;}});}
 else d.documentElement.removeAttribute(F);}
function queue(){if(!stopped&&frame===null)frame=w.requestAnimationFrame(sync);}
var obs=new MutationObserver(queue);obs.observe(d.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-ari-soft']});
w[K]={sync:sync,stop:function(){stopped=true;obs.disconnect();d.documentElement.removeAttribute(F);d.documentElement.removeAttribute('data-ari-login-luxe');var lf=d.getElementById('ari-luxe-fonts');if(lf)lf.remove();filled.forEach(function(el){el.textContent='';});delete w[K];}};sync();})(window);

}catch(e){console.warn("ari block 38",e)}
try{

(function(w){'use strict';var K='__ariLuxeInstallV1';if(w[K]){w[K].sync();return;}
var d=w.document,CANVAS='all',A='data-ari-lx-canvas',LA='data-ari-lx-link',stopped=false,frame=null;
function mode(){try{var v=w.localStorage.getItem('ari-luxe-canvas');if(v==='home'||v==='all'||v==='off')return v;}catch(e){}return CANVAS;}
function greet(){var h=new Date().getHours();return h>=5&&h<12?'Good morning':h>=12&&h<17?'Good afternoon':'Good evening';}
function link(){var mm=w.location.pathname.match(/\/custom-menu-link\/([0-9a-f-]{36})/);return mm?mm[1]:null;}
function sync(){frame=null;if(stopped)return;var r=d.documentElement;
 if(r.getAttribute('data-ari-luxe')==='v1'){var m=mode();if(r.getAttribute(A)!==m)r.setAttribute(A,m);var lk=link();if(lk){if(r.getAttribute(LA)!==lk)r.setAttribute(LA,lk);}else if(r.hasAttribute(LA))r.removeAttribute(LA);var g=greet();
  d.querySelectorAll('#ari-owner-preview [data-ari-greet]').forEach(function(el){if(el.textContent!==g)el.textContent=g;});}
 else{if(r.hasAttribute(A))r.removeAttribute(A);if(r.hasAttribute(LA))r.removeAttribute(LA);}}
function queue(){if(!stopped&&frame===null)frame=w.requestAnimationFrame(sync);}
var obs=new MutationObserver(queue);obs.observe(d.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-ari-luxe']});
w[K]={sync:sync,stop:function(){stopped=true;obs.disconnect();if(frame!==null)w.cancelAnimationFrame(frame);d.documentElement.removeAttribute(A);d.documentElement.removeAttribute(LA);delete w[K];}};w.addEventListener('popstate',queue);sync();})(window);

}catch(e){console.warn("ari block 39",e)}
try{

(function(w){'use strict';var K='__ariTopAskV2';if(w[K]){w[K].sync();return;}
if(w.__ariTopAskV1&&w.__ariTopAskV1.stop)w.__ariTopAskV1.stop();
var d=w.document,B='/v2/location/'+window.__ariLOC+'/',ASK=B+'custom-menu-link/'+window.__ariAskId+'',ID='ari-topbar-ask',HIDE='data-ari-platform-hide';
var btn=null,obs=null,timer=null,frame=null,last='',qf=null;
function on(){return w.location.pathname.indexOf(B)===0;}
function host(){var h=d.querySelectorAll('header.hl_header > .container-fluid > .hl_header--controls');return h.length===1?h[0]:null;}
function make(){var a=d.createElement('a');a.id=ID;a.href=ASK;a.setAttribute('data-ari-ask-home-link','');a.setAttribute('aria-label','Ask Ari');a.title='Ask Ari';
 var f=d.createElement('span');f.className='ari-topbar-ask-face';f.setAttribute('aria-hidden','true');a.appendChild(f);return a;}
function here(){var p=w.location.pathname.replace(/\/+$/,'');return p===ASK||p.indexOf(ASK+'/')===0;}
/* the host's direct child that holds the bell (or the profile menu when there is no bell); null = append at the end */
function anchor(h){var t=h.querySelector('#recent_activities-toggle')||h.querySelector('.hl_header--dropdown,[aria-label="Open Profile Menu"]');
 while(t&&t.parentElement!==h)t=t.parentElement;return t||null;}
function tidyHome(){if(!/\/dashboard\/?$/.test(w.location.pathname))return;if(qf&&qf.isConnected)return;qf=null;
 var root=d.getElementById('location_dashboard-main-content')||d.querySelector('main')||d.body;if(!root)return;
 var c=root.querySelectorAll('button,a,[role="button"],span,div'),norm=function(e){return (e.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();};
 for(var i=0;i<c.length;i++){var e=c[i];if(e.childElementCount>4||norm(e)!=='quick filters')continue;
  while(e.parentElement&&e.parentElement!==root&&norm(e.parentElement)==='quick filters')e=e.parentElement;
  if(!e.hasAttribute(HIDE))e.setAttribute(HIDE,'quick-filters');qf=e;return;}}
function sync(){frame=null;last=w.location.href;var all=d.querySelectorAll('#'+ID),i;
 if(!on()){for(i=0;i<all.length;i++)all[i].remove();btn=null;return;}
 tidyHome();
 var h=host();if(!h)return;
 if(!btn||btn.parentElement!==h){btn=null;for(i=0;i<all.length;i++)if(all[i].parentElement===h&&all[i].getAttribute('href')===ASK){btn=all[i];break;}}
 if(!btn)btn=make();
 var ref=anchor(h);if(ref===btn)ref=btn.nextElementSibling;
 if(btn.parentElement!==h||(ref?btn.nextElementSibling!==ref:h.lastElementChild!==btn))h.insertBefore(btn,ref);
 all=d.querySelectorAll('#'+ID);for(i=0;i<all.length;i++)if(all[i]!==btn)all[i].remove();
 var cur=here();if(cur&&btn.getAttribute('aria-current')!=='page')btn.setAttribute('aria-current','page');else if(!cur&&btn.hasAttribute('aria-current'))btn.removeAttribute('aria-current');}
function queue(){if(frame===null)frame=w.requestAnimationFrame(sync);}
function misplaced(){var h=host();if(!h)return false;if(!btn||!btn.isConnected||btn.parentElement!==h)return true;var r=anchor(h);return r&&r!==btn&&btn.nextElementSibling!==r;}
w[K]={sync:sync,stop:function(){if(timer!==null)w.clearInterval(timer);if(obs)obs.disconnect();if(frame!==null)w.cancelAnimationFrame(frame);w.removeEventListener('popstate',queue);var all=d.querySelectorAll('#'+ID+',['+HIDE+']');for(var i=0;i<all.length;i++){if(all[i].id===ID)all[i].remove();else all[i].removeAttribute(HIDE);}btn=null;qf=null;delete w[K];}};
w.addEventListener('popstate',queue);
timer=w.setInterval(function(){if(last!==w.location.href||(on()&&(misplaced()||(/\/dashboard\/?$/.test(w.location.pathname)&&!(qf&&qf.isConnected)))))queue();},250);
function watch(){if(!d.body)return w.setTimeout(watch,50);obs=new w.MutationObserver(function(){if(on()?misplaced():!!btn)queue();});obs.observe(d.body,{childList:true,subtree:true});}
watch();sync();})(window);

}catch(e){console.warn("ari block 40",e)}
try{

(function(w){'use strict';var K='__ariDetailsTidyV1';if(w[K]){w[K].sync();return;}
var d=w.document,B='/v2/location/'+window.__ariLOC+'/',P=B+'conversations',M='data-ari-platform-hide',COL='conversations-right-column';
var HIDE=[[/^owner$/,'owner'],[/^followers?$/,'followers'],[/^tags( ?\(\d+\))?$/,'tags'],[/^dnd$/,'dnd'],[/^actions$/,'actions'],
 [/^created by:?( .*)?$/,'created-by'],[/^created on:?( .*)?$/,'created-on'],[/^audit logs?$/,'audit-logs'],[/^ask ai$/,'ask-ai'],
 [/^(automations?|workflows?|active workflows?|campaigns?|triggers?)$/,'automation'],[/^opportunit(y|ies)$/,'opportunity']];
var KEEP=/^(contact details|all fields|additional info|contact|general info(rmation)?|notes?|appointments?|search)$/;
var RAIL=/(\bai\b|\btasks?\b|copilot|conversation ai|content ai|automation|workflow|campaign|opportunit|payment|invoice|transaction|document|contract|audit|activit|trigger|pipeline)/i;
var frame=null,obs=null,timer=null,last='',stopped=false;
function on(){return w.location.pathname.indexOf(P)===0;}
function norm(e){return (e.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();}
function clean(t){return t.replace(/[^a-z0-9:() ]+/g,' ').replace(/\s+/g,' ').trim();}
function hideKind(t){t=clean(t);for(var i=0;i<HIDE.length;i++)if(HIDE[i][0].test(t))return HIDE[i][1];return null;}
function isLabel(t){return !!hideKind(t)||KEEP.test(clean(t));}
function hits(el){var n=0,all=el.querySelectorAll('*');for(var i=0;i<all.length;i++){var e=all[i];if(e.childElementCount>3)continue;var t=norm(e);if(t.length>60||!isLabel(t))continue;
  var p=e.parentElement;if(p&&p!==el&&p.childElementCount<=3&&clean(norm(p))===clean(t))continue;n++;}return n;}
function mark(e,why){if(e.getAttribute(M)!==why)e.setAttribute(M,why);}
function filled(c){/* a child that still shows something: text, a field, a picture or an icon, and isn't one of our hides */
 return !c.hasAttribute(M)&&(!!norm(c)||!!c.querySelector('input,textarea,select,img,svg,button,i,[role="img"]'));}
function railish(a){return a.tagName==='NAV'||!!(a.querySelector&&a.querySelector('[id^="sidebar-"][id$="-icon"]'));}
function collapse(col){/* a wrapper whose visible children are all hidden (or empty) goes too, e.g. the footer or the owner/followers row.
   fix5f: wrappers are re-checked on every pass, so a box marked while the panel was still loading (the client's name card)
   comes back once its content arrives; and the icon rail is never wrapped. */
 for(var p=0;p<3;p++){var ws=col.querySelectorAll('['+M+'="wrapper"]'),undone=0;for(var i=0;i<ws.length;i++){var a=ws[i],kids=a.children,keep=kids.length===0||railish(a);
  for(var j=0;j<kids.length&&!keep;j++)if(filled(kids[j]))keep=true;if(keep){a.removeAttribute(M);undone++;}}if(!undone)break;}
 var m=col.querySelectorAll('['+M+']');for(var i=0;i<m.length;i++){var a=m[i].parentElement;for(var k=0;k<3&&a&&a!==col;k++){if(railish(a))break;var kids=a.children,ok=kids.length>0;
  for(var j=0;j<kids.length&&ok;j++){var c=kids[j];if(!(c.hasAttribute(M)||!filled(c)))ok=false;}
  if(!ok)break;if(a.parentElement===col||a.querySelector('input,textarea,select'))break;/* chatsfix1 */mark(a,'wrapper');a=a.parentElement;}}}
function tidyColumn(col){var all=col.querySelectorAll('*');
 for(var i=0;i<all.length;i++){var e=all[i];if(e.childElementCount>3||e.hasAttribute(M))continue;var t=norm(e);if(!t||t.length>60)continue;var why=hideKind(t);if(!why)continue;
  if(e.closest('['+M+']'))continue;
  while(e.parentElement&&e.parentElement!==col&&e.parentElement.parentElement!==col&&!e.parentElement.querySelector('input,textarea,select,[contenteditable="true"]')&&hits(e.parentElement)<=1)e=e.parentElement;/* chatsfix1: stop two levels below the panel */
  if(e.parentElement===col)continue;
  if(e.querySelector('input,textarea')&&/^(created-by|created-on|audit-logs|ask-ai|automation|opportunity)$/.test(why))continue;/* never swallow an editable field */
  mark(e,why);}
 collapse(col);}
function rail(col){var host=col.parentElement;if(!host)return;var cr=col.getBoundingClientRect();
 var c=host.querySelectorAll('button,a,[role="button"],[role="tab"],li');
 for(var i=0;i<c.length;i++){var e=c[i];if(col.contains(e)||e.hasAttribute(M))continue;var r=e.getBoundingClientRect();if(r.width===0||r.left<cr.right-4)continue;
  var name=[e.getAttribute('aria-label'),e.getAttribute('title'),e.getAttribute('data-tooltip'),e.getAttribute('data-original-title'),e.getAttribute('data-title'),e.id,norm(e)].filter(Boolean).join(' ');
  if(RAIL.test(name))mark(e,'rail');}}
function failOpen(col){/* chatsfix1: if our hiding left the panel with nothing to show, undo it */var vis=false,k=col.querySelectorAll('input,textarea,select,a,button,p,span,h1,h2,h3,label');for(var i=0;i<k.length&&!vis;i++){var e=k[i];if(e.closest('['+M+']'))continue;if((e.textContent||'').trim()||/^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName))vis=true;}
 if(vis||!k.length)return;var m=col.querySelectorAll('['+M+']');for(i=0;i<m.length;i++)if(m[i].getAttribute(M)!=='rail')m[i].removeAttribute(M);}
function sync(){frame=null;last=w.location.href;if(stopped)return;if(!on())return;var col=d.getElementById(COL);if(!col)return;tidyColumn(col);rail(col);failOpen(col);}
function queue(){if(frame===null&&!stopped)frame=w.requestAnimationFrame(sync);}
w[K]={sync:sync,stop:function(){stopped=true;if(timer!==null)w.clearInterval(timer);if(obs)obs.disconnect();if(frame!==null)w.cancelAnimationFrame(frame);w.removeEventListener('popstate',queue);
 var m=d.querySelectorAll('['+M+']');for(var i=0;i<m.length;i++){var v=m[i].getAttribute(M);if(v!=='quick-filters')m[i].removeAttribute(M);}delete w[K];}};
w.addEventListener('popstate',queue);
timer=w.setInterval(function(){if(last!==w.location.href)queue();},1000);
function watch(){if(!d.body)return w.setTimeout(watch,50);obs=new w.MutationObserver(function(recs){if(!on())return;var col=d.getElementById(COL);if(!col)return;for(var i=0;i<recs.length;i++){var t=recs[i].target;if(t&&(col.contains(t)||t.contains&&t.contains(col))){queue();return;}}/* chatsfix3 */});obs.observe(d.body,{childList:true,subtree:true});}
watch();sync();})(window);

}catch(e){console.warn("ari block 41",e)}
try{

(function(w){'use strict';var K='__ariMessagesLuxeV2',THEME='b';if(w[K]){w[K].sync();return;}
var d=w.document,P='/v2/location/'+window.__ariLOC+'/conversations',SW='data-ari-msg-luxe',LAY='conversations-layout',LIST='conversations-list',VIEW='conversations-central-panel-viewer',COL='conversations-right-column';
var TIME=/^(\d{1,2}:\d{2}\s?(am|pm)?|\d{1,2}\s?(am|pm)|yesterday|today|now|just now|\d+\s?(m|h|d|w|min|mins|hr|hrs)( ago)?|(mon|tue|wed|thu|fri|sat|sun)[a-z]*|(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{1,2}(,? \d{4})?(,? \d{1,2}:\d{2}\s?(am|pm)?)?|\d{1,2}\/\d{1,2}(\/\d{2,4})?)$/i;
var DAY=/^(today|yesterday|(mon|tues|wednes|thurs|fri|satur|sun)day|(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{1,2}(,? \d{4})?|\d{1,2}\/\d{1,2}\/\d{2,4})$/i;
var AIBTN=/(\bai\b|copilot|sparkle|magic|suggest|regenerate|rewrite|thumb|like|dislike|feedback|rate|translate)/i,HEADHIDE=/(star|trash|delete|archive|snooze|mark( as)? (un)?read|unread|spam|block)/i;
var ALL=['data-ari-conv-row','data-ari-conv-card','data-ari-inbox-tab','data-ari-tab-on','data-ari-tab-badge','data-ari-conv-name','data-ari-conv-time','data-ari-conv-preview','data-ari-conv-av','data-ari-unread','data-ari-conv-unread','data-ari-row-tick','data-ari-row-star','data-ari-msg-hide','data-ari-msg-search','data-ari-msg-new','data-ari-thread-head','data-ari-thread-name','data-ari-thread-av','data-ari-head-btn','data-ari-bubble','data-ari-sys','data-ari-msg-time','data-ari-day','data-ari-new-divider','data-ari-msg-scroll','data-ari-composer','data-ari-composer-input','data-ari-composer-bar','data-ari-send','data-ari-ai-btn','data-ari-dname','data-ari-dav','data-ari-dlabel','data-ari-dfield','data-ari-dsection','data-ari-dhead','data-ari-rail','data-ari-blue'];
var seen=new WeakSet(),seenB=new WeakSet(),frame=null,timer=null,obs=null,last='',stopped=false,lastRun=0;
function on(){return w.location.pathname.indexOf(P)===0;}
function txt(e){return (e.textContent||'').replace(/\s+/g,' ').trim();}
function own(e){for(var n=e.firstChild;n;n=n.nextSibling)if(n.nodeType===3&&n.nodeValue.trim())return true;return false;}
function lab(e){return [e.getAttribute('aria-label'),e.getAttribute('title'),e.getAttribute('data-tooltip'),e.getAttribute('data-original-title'),e.id,txt(e)].filter(Boolean).join(' ');}
function rgb(s){var m=/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/.exec(s||'');return m?{r:+m[1],g:+m[2],b:+m[3],a:m[4]===undefined?1:+m[4]}:null;}
function blue(c){return !!c&&c.a>.15&&c.b>140&&c.b-c.r>45&&c.b-c.g>18;}
function lum(c){return (.299*c.r+.587*c.g+.114*c.b)/255;}
function set(e,a,v){if(e.getAttribute(a)!==v)e.setAttribute(a,v);if(a!=='data-ari-blue'&&a!=='data-ari-conv-row'&&e.hasAttribute('data-ari-blue'))e.removeAttribute('data-ari-blue');}
function vis(e){var r=e.getBoundingClientRect();return r.width>0&&r.height>0?r:null;}
function hue(t){var h=0;for(var i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))>>>0;return String(1+h%3);}
function leafs(root){var out=[],a=root.querySelectorAll('*');for(var i=0;i<a.length;i++){var e=a[i];if(/^(SCRIPT|STYLE|SVG|PATH|INPUT|TEXTAREA|BUTTON|SELECT)$/i.test(e.tagName))continue;var t=txt(e);if(t&&t.length<=400&&own(e))out.push(e);}return out;}
/* (a) list: header controls and rows */
function header(list){var hdr=list.querySelector('.conversation-list-header')||list;var bs=hdr.querySelectorAll('button,a,[role="button"]');
 for(var i=0;i<bs.length;i++){var b=bs[i],t=lab(b).toLowerCase();if(b.id==='new-conversation-btn'||b.id==='new-conversation-btn-collapsed'||/^new (message|conversation)/.test(txt(b).toLowerCase()))set(b,'data-ari-msg-new','1');
  else if(b.id==='conv-inbox-panel-search-button'||/search/.test(t))set(b,'data-ari-msg-search','1');}
 var all=list.querySelectorAll('label,div,span');for(i=0;i<all.length;i++){var e=all[i];if(e.childElementCount>3)continue;if(/^select all$/i.test(txt(e))){var x=e;while(x.parentElement&&x.parentElement!==list&&txt(x.parentElement)===txt(e))x=x.parentElement;set(x,'data-ari-msg-hide','select-all');}}
 tabsPass(hdr);var bulk=list.querySelector('[data-name="bulk-select-bar"]');if(bulk)set(bulk,'data-ari-msg-hide','bulk');}
function rows(list){var conv=(/\/conversations\/conversations\/([A-Za-z0-9]+)/.exec(w.location.pathname)||[])[1]||'',hdr=list.querySelector('.conversation-list-header'),found=[];
 var seeds=list.querySelectorAll('input[type="checkbox"],[role="checkbox"],a[href*="/conversations/conversations/"],[data-conversation-id]');
 for(var i=0;i<seeds.length;i++){var s=seeds[i];if(hdr&&hdr.contains(s))continue;if(s.closest('[data-ari-msg-hide]'))continue;var row=s,p=s.parentElement;
  while(p&&p!==list){var sib=0;for(var c=p.firstElementChild;c;c=c.nextElementSibling)if(c!==row&&c.tagName===row.tagName&&c.querySelector&&(c.querySelector('input[type="checkbox"],[role="checkbox"]')||c.matches('a[href*="/conversations/conversations/"],[data-conversation-id]')))sib++;
   var r=vis(row);if(sib>0&&r&&r.height>=40&&r.height<=160&&/[a-z]/i.test(txt(row)))break;row=p;p=p.parentElement;}
  var rr=vis(row);if(!rr||rr.height<40||rr.height>160||/^select all$/i.test(txt(row))||found.indexOf(row)!==-1)continue;found.push(row);}
 found.forEach(function(row){var cls=(typeof row.className==='string'?row.className:'')+' '+Array.prototype.map.call(row.querySelectorAll('[class]'),function(x){return typeof x.className==='string'?x.className:'';}).slice(0,6).join(' ');
  var sel=row.getAttribute('aria-selected')==='true'||row.hasAttribute('aria-current')||/(^|[\s_-])(active|selected|is-active|is-selected)(\s|$)/.test(cls)||(conv&&row.outerHTML.indexOf(conv)!==-1);
  set(row,'data-ari-conv-row',sel?'selected':'1');
  var tk=row.querySelectorAll('input[type="checkbox"],[role="checkbox"]');for(var j=0;j<tk.length;j++){var t=tk[j],wrap=t;while(wrap.parentElement&&wrap.parentElement!==row&&!txt(wrap.parentElement)&&!wrap.parentElement.querySelector('img'))wrap=wrap.parentElement;set(wrap,'data-ari-row-tick','1');}
  var bt=row.querySelectorAll('button,[role="button"],svg');for(j=0;j<bt.length;j++){var b=bt[j];if(/star|favou?rite/i.test(lab(b))||/^[☆★]$/.test(txt(b)))set(b.closest('button,[role="button"]')||b,'data-ari-row-star','1');}
  if(seen.has(row)){tagCard(row);return;}var L=leafs(row),name=null,time=null,prev=null,badge=null,av=null;
  L.forEach(function(e){var t=txt(e),cs=w.getComputedStyle(e);if(/^\d{1,3}\+?$/.test(t)){var bg=rgb(cs.backgroundColor);if(bg&&bg.a>.3)badge=e;return;}
   if(TIME.test(t)){if(!time)time=e;return;}if(/^[A-Z]{1,2}$/.test(t)){if(!av)av=e;return;}
   if(!name&&parseInt(cs.fontWeight,10)>=500&&t.length<=60){name=e;return;}if(!prev||t.length>txt(prev).length)prev=e;});
  if(name)set(name,'data-ari-conv-name','1');if(time)set(time,'data-ari-conv-time','1');if(prev&&prev!==name)set(prev,'data-ari-conv-preview','1');
  if(!av){var im=row.querySelector('img');if(im)av=im;}if(av){var circ=av,k=0;while(k<3&&circ.parentElement&&circ.parentElement!==row){var cr=vis(circ.parentElement);if(!cr||cr.width>64)break;circ=circ.parentElement;k++;}set(circ,'data-ari-conv-av',hue(name?txt(name):txt(row)));}
  if(badge){set(badge,'data-ari-unread','1');set(row,'data-ari-conv-unread','1');}else row.removeAttribute('data-ari-conv-unread');
  if(name)seen.add(row);tagCard(row);});}
/* (a2) fix6b: the visible card inside a list row. The row is the platform's list slot (fixed height in its virtual list), so the
   card look goes on the card inside it ("inner"), or on the row itself when it has no inner card ("row"). */
function cardOf(row){var t=row.querySelector('[data-ari-conv-card]');if(t)return t;var e=row;for(var k=0;k<4;k++){if(e.childElementCount!==1)break;e=e.firstElementChild;var c=w.getComputedStyle(e),bg=rgb(c.backgroundColor);
 if((bg&&bg.a>.02)||parseFloat(c.borderTopWidth)+parseFloat(c.borderBottomWidth)>0||parseFloat(c.borderTopLeftRadius)>0||/transition-colors/.test(typeof e.className==='string'?e.className:''))return e;}return null;}
function tagCard(row){var card=cardOf(row);set(card||row,'data-ari-conv-card',card?'inner':'row');}
/* (b2) fix6b: bubbles found from the message words up: the nearest painted box around them (any corner shape) that stands out
   from what is under it. Unpainted centred lines are system notes. */
function under(e,stop){for(var p=e.parentElement;p&&p!==stop;p=p.parentElement){var c=rgb(w.getComputedStyle(p).backgroundColor);if(c&&c.a>.3)return c;}return null;}
function leafPass(view,vr,bubbles){var L=leafs(view),mid=(vr.left+vr.right)/2,cb=view.querySelector('textarea,[contenteditable="true"],[role="textbox"]'),zone=cb;
 while(zone&&zone.parentElement&&zone.parentElement!==view){var zr=vis(zone.parentElement);if(!zr||zr.height>200)break;zone=zone.parentElement;}
 for(var i=0;i<L.length;i++){var e=L[i];if(e.closest('[data-ari-composer-bar],[data-ari-composer],[data-ari-thread-head],[data-ari-thread-av],#conversations-right-column,[data-ari-bubble],[data-ari-sys],[data-ari-msg-time],[data-ari-day],[data-ari-new-divider],button,[role="button"],textarea,[contenteditable="true"]'))continue;
  var t=txt(e);if(t.length<2||TIME.test(t)||/^[A-Z]{1,2}$/.test(t)||/^\d{1,3}\+?$/.test(t))continue;if(zone&&zone.contains(e))continue;var r=vis(e);if(!r)continue;
  var a=e,host=null;for(var k=0;k<7&&a&&a!==view;k++){var c=w.getComputedStyle(a),bg=rgb(c.backgroundColor);if((bg&&bg.a>.02)||(c.backgroundImage&&c.backgroundImage!=='none')){host=a;break;}a=a.parentElement;}
  var hr=host&&vis(host);if(host&&(!hr||hr.width>=vr.width*.9||hr.height>vr.height*.8))host=null;/* a big painted box is the chat panel itself, not a bubble */
  if(host){if(hr.width<24||host.querySelector('textarea,input,[contenteditable="true"]'))continue;
   var hc=w.getComputedStyle(host),hb=rgb(hc.backgroundColor),un=under(host,view.parentElement),img=hc.backgroundImage&&hc.backgroundImage!=='none';
   if(!img&&hb&&hb.a>=1&&un&&Math.abs(hb.r-un.r)+Math.abs(hb.g-un.g)+Math.abs(hb.b-un.b)<=6)continue;if(!img&&hb&&lum(hb)<.5)continue;
   var cx=(hr.left+hr.right)/2;if(Math.abs(cx-mid)<vr.width*.08&&hr.height<48&&(host.querySelector('svg,i,img')||parseFloat(hc.borderTopLeftRadius)>=hr.height/2-1))set(host,'data-ari-sys','1');else{set(host,'data-ari-bubble',(hr.left-vr.left)>(vr.right-hr.right)?'out':'in');bubbles.push(host);}seen.add(host);}
  else{var b=e,best=null;for(var q=0;q<5&&b&&b!==view;q++){var br=vis(b);if(!br||br.width>vr.width*.75)break;if(Math.abs((br.left+br.right)/2-mid)<vr.width*.1&&br.height<60)best=b;b=b.parentElement;}
   if(best&&!best.querySelector('[data-ari-bubble]')){set(best,'data-ari-sys','1');seen.add(best);}}}}
/* (b3) fix6d: the platform names its bubbles (chat-bubble-inbound / chat-bubble-outbound); those are tagged first, whatever their
   corners or depth, and any system mark left inside a bubble is taken off. */
function classPass(view,bubbles){var B=view.querySelectorAll('[class*="chat-bubble-inbound"],[class*="chat-bubble-outbound"]');
 for(var i=0;i<B.length;i++){var e=B[i],c=typeof e.className==='string'?e.className:(e.getAttribute('class')||'');if(e.parentElement&&e.parentElement.closest('[class*="chat-bubble-"]'))continue;
  set(e,'data-ari-bubble',/chat-bubble-outbound/.test(c)?'out':'in');if(bubbles.indexOf(e)<0)bubbles.push(e);seen.add(e);
  var s=e.querySelectorAll('[data-ari-sys]');for(var j=0;j<s.length;j++)s[j].removeAttribute('data-ari-sys');if(e.hasAttribute('data-ari-sys'))e.removeAttribute('data-ari-sys');}
 /* a message row with no bubble is a system note ("Name updated", "Your chat has ended"): its rounded pill is the system line */
 var M=view.querySelectorAll('.message-item');for(var q=0;q<M.length;q++){var it=M[q];if(it.querySelector('[class*="chat-bubble-"]'))continue;var pill=it.querySelector('.justify-center>[class*="rounded-"]');
  if(!pill||pill.closest('button'))continue;if(pill.hasAttribute('data-ari-bubble'))pill.removeAttribute('data-ari-bubble');set(pill,'data-ari-sys','1');seen.add(pill);}}
/* (a3) fix6d: inbox tabs (Unread, All, Recent, Starred). Which one is open comes from the page address (?tab=unread), else from the
   tab's own selected/pressed state; the count inside a tab is tagged so it can be drawn in gold. */
function tabsPass(hdr){var bs=hdr.querySelectorAll('button,[role="tab"]'),cand=[];
 for(var i=0;i<bs.length;i++){var b=bs[i];if(b.closest('#conversations-list [data-ari-conv-row]'))continue;var l=((b.getAttribute('aria-label')||'')+' '+txt(b)).toLowerCase().replace(/[\d,+]+/g,' ').replace(/conversations?/g,' ').replace(/\s+/g,' ').trim();
  var m=/^(unread|all|recent|starred)\b/.exec(l);if(m&&txt(b).length<=24)cand.push([b,m[1]]);}
 if(cand.length<2)return;var q=((/[?&]tab=([a-z]+)/i.exec(w.location.search)||[])[1]||'').toLowerCase(),on=-1,k;
 for(k=0;k<cand.length;k++)if(q&&cand[k][1]===q)on=k;
 if(on<0)for(k=0;k<cand.length;k++){var c=cand[k][0],cl=typeof c.className==='string'?c.className:'';if(on<0&&(c.getAttribute('aria-selected')==='true'||c.getAttribute('aria-pressed')==='true'||c.getAttribute('aria-current')==='true'||c.getAttribute('aria-current')==='page'||c.getAttribute('data-state')==='active'||/\b(active|selected|is-active)\b/.test(cl)))on=k;}
 if(on<0&&!q)for(k=0;k<cand.length;k++)if(cand[k][0].getAttribute('data-ari-tab-on')==='1')on=k;
 for(k=0;k<cand.length;k++){var t=cand[k][0];set(t,'data-ari-inbox-tab',cand[k][1]);set(t,'data-ari-tab-on',k===on?'1':'0');
  var n=t.querySelectorAll('span,div,p');for(var j=0;j<n.length;j++){var x=n[j];if(/^\d{1,5}\+?$/.test(txt(x))&&own(x)){var y=x,pick=null;while(y&&y!==t&&txt(y)===txt(x)){var yc=w.getComputedStyle(y),yb=rgb(yc.backgroundColor);if(y.hasAttribute('data-ari-tab-badge')||(yb&&yb.a>.1)||yc.backgroundImage!=='none'){pick=y;break;}y=y.parentElement;}set(pick||x,'data-ari-tab-badge','1');}}}}
/* (b) open chat */
function thread(view){var vr=vis(view);if(!vr)return;var all=view.querySelectorAll('div,p,span,li,section,article');
 var box=view.querySelector('textarea,[contenteditable="true"],[role="textbox"]');
 if(box&&!box.hasAttribute('data-ari-composer-input')){set(box,'data-ari-composer-input','1');var c=box,shell=null;for(var k=0;k<6&&c&&c!==view;k++){var cs=w.getComputedStyle(c);if(parseFloat(cs.borderTopWidth)>0||parseFloat(cs.borderTopLeftRadius)>=6)shell=c;var r=vis(c);if(r&&r.height>160)break;c=c.parentElement;}
  if(shell)set(shell,'data-ari-composer','1');var zone=shell||box;for(k=0;k<4&&zone.parentElement&&zone.parentElement!==view;k++){zone=zone.parentElement;var zr=vis(zone);if(zr&&zr.height>200)break;}
  var bs=zone.querySelectorAll('button,[role="button"]'),best=null,bx=-1;for(var j=0;j<bs.length;j++){var br=vis(bs[j]);if(br&&br.right>bx&&br.width<=64&&br.height<=64){bx=br.right;best=bs[j];}}
  if(best)set(best,'data-ari-send','1');for(j=0;j<bs.length;j++)if(bs[j]!==best&&AIBTN.test(lab(bs[j])))set(bs[j],'data-ari-ai-btn','1');
  var footer=shell||box;while(footer.parentElement&&footer.parentElement!==view){var fr=vis(footer.parentElement);if(fr&&fr.height>220)break;footer=footer.parentElement;}set(footer,'data-ari-composer-bar','1');}
 var top=null,ty=1e9,bubbles=[];classPass(view,bubbles);
 for(var i=0;i<all.length;i++){var e=all[i];if(e.closest('[data-ari-composer-bar],[data-ari-thread-head],[data-ari-thread-av],#conversations-right-column'))continue;if(seen.has(e)){if(e.hasAttribute('data-ari-bubble'))bubbles.push(e);continue;}var r=vis(e);if(!r)continue;var t=txt(e);if(!t)continue;
  var cs=w.getComputedStyle(e),bg=rgb(cs.backgroundColor),rad=parseFloat(cs.borderTopLeftRadius)||parseFloat(cs.borderTopRightRadius)||parseFloat(cs.borderBottomLeftRadius)||0,o=own(e);
  if(o&&t.length<=40&&r.top-vr.top<72&&parseInt(cs.fontWeight,10)>=500&&!/^[A-Z]{1,2}$/.test(t)&&!TIME.test(t)&&r.top<ty){top=e;ty=r.top;}
  if(o&&TIME.test(t)&&t.length<=24){var pr0=e.parentElement?e.parentElement.getBoundingClientRect():vr;set(e,DAY.test(t)&&Math.abs((r.left+r.right)/2-(pr0.left+pr0.right)/2)<8&&pr0.width>r.width+60?'data-ari-day':'data-ari-msg-time','1');seen.add(e);continue;}
  if(o&&/^new( messages?)?$/i.test(t)){set(e,'data-ari-new-divider','1');seen.add(e);continue;}
  if(bg&&bg.a>.3&&lum(bg)>.55&&!(bg.r>250&&bg.g>250&&bg.b>250)&&rad>=6&&r.width<vr.width*.88&&r.width>=36&&r.height>=22&&t.length>=2&&!e.querySelector('textarea,input,[contenteditable="true"]')&&!e.closest('[data-ari-bubble]')){
   var pr=e.parentElement?e.parentElement.getBoundingClientRect():vr,cx=(r.left+r.right)/2;
   if(Math.abs(cx-(pr.left+pr.right)/2)<6&&pr.width>r.width+40&&r.width<vr.width*.8&&r.height<52)set(e,'data-ari-sys','1');else{set(e,'data-ari-bubble',(r.left-vr.left)>(vr.right-r.right)?'out':'in');bubbles.push(e);}seen.add(e);}}
 leafPass(view,vr,bubbles);
 if(top&&!view.querySelector('[data-ari-thread-name]')){set(top,'data-ari-thread-name','1');var head=top;while(head.parentElement&&head.parentElement!==view){var hr=vis(head.parentElement);if(!hr||hr.height>90)break;head=head.parentElement;}set(head,'data-ari-thread-head','1');
  var hb=head.querySelectorAll('button,[role="button"],a');for(var q=0;q<hb.length;q++)set(hb[q],'data-ari-head-btn',HEADHIDE.test(lab(hb[q]))||/^[☆★]$/.test(txt(hb[q]))?'hide':'1');
  var ha=leafs(head).filter(function(x){return /^[A-Z]{1,2}$/.test(txt(x));})[0];if(ha)set(ha,'data-ari-thread-av',hue(txt(top)));}
 /* platform AI and feedback buttons next to the messages */
 var tb=view.querySelectorAll('button,[role="button"]');for(i=0;i<tb.length;i++){var b=tb[i];if(b.closest('[data-ari-composer-bar],[data-ari-thread-head]'))continue;if(AIBTN.test(lab(b)))set(b,'data-ari-ai-btn','1');}
 /* the scroll box that holds the bubbles: its sides get padding so the messages sit in a centred column */
 if(bubbles.length&&!view.querySelector('[data-ari-msg-scroll]')){var s=bubbles[0].parentElement;while(s&&s!==view){var oy=w.getComputedStyle(s).overflowY;if((oy==='auto'||oy==='scroll')&&s.contains(bubbles[bubbles.length-1]))break;s=s.parentElement;}if(s&&s!==view)set(s,'data-ari-msg-scroll','1');}}
/* (c0) side icons while the details card is closed (phones): only when their box holds no list or chat */
function hiddenRail(col,list,view){if(vis(col))return;var host=col.parentElement;if(!host||(list&&host.contains(list))||(view&&host.contains(view)))return;var bs=host.querySelectorAll('button,a,[role="button"]');for(var i=0;i<bs.length;i++){var b=bs[i];if(col.contains(b)||b.hasAttribute('data-ari-platform-hide'))continue;set(b,'data-ari-rail','off');}}
/* (c) client details: a tidy card */
function details(col){if(!vis(col))return;var L=leafs(col);var first=true;
 L.forEach(function(e){if(e.closest('[data-ari-platform-hide]'))return;var t=txt(e),low=t.toLowerCase();
  if(/^(contact details|client details|customer details)$/.test(low)){set(e,'data-ari-dhead','1');return;}
  if(/^(contact|additional info|general info(rmation)?)$/.test(low)){set(e,'data-ari-dsection','1');return;}
  if(/^[A-Z]{1,2}$/.test(t)&&first){set(e,'data-ari-dav',hue(t));return;}});
 var f=col.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]),select,textarea');
 for(var i=0;i<f.length;i++){var x=f[i];if(x.closest('[data-ari-platform-hide]'))continue;
  if(/search/i.test((x.getAttribute('placeholder')||'')+' '+(x.getAttribute('aria-label')||''))){var sw=x;while(sw.parentElement&&sw.parentElement!==col&&!txt(sw.parentElement))sw=sw.parentElement;set(sw,'data-ari-msg-hide','field-search');continue;}
  set(x,'data-ari-dfield','1');var lb=x.id&&col.querySelector('label[for="'+x.id+'"]');if(!lb){var p=x.previousElementSibling;if(p&&txt(p)&&txt(p).length<40)lb=p;}if(!lb){var q=x.parentElement;for(var k=0;k<3&&q&&!lb;k++){var c=q.querySelector('label');if(c&&txt(c).length<40)lb=c;q=q.parentElement;}}
  if(lb)set(lb,'data-ari-dlabel','1');}
 /* the name: first bold short words in the top part that aren't a heading or a label */
 if(!col.querySelector('[data-ari-dname]')){var cr=col.getBoundingClientRect();for(i=0;i<L.length;i++){var e=L[i],t=txt(e),r=vis(e);if(!r||r.top-cr.top>200||e.closest('[data-ari-platform-hide]')||e.hasAttribute('data-ari-dhead')||e.hasAttribute('data-ari-dav')||e.hasAttribute('data-ari-dlabel'))continue;if(parseInt(w.getComputedStyle(e).fontWeight,10)>=500&&t.length<=40&&!/details|info|fields/i.test(t)){set(e,'data-ari-dname','1');break;}}}
 /* a tab strip that only has "All fields" left after the tidy */
 var tl=col.querySelectorAll('[role="tablist"]');for(i=0;i<tl.length;i++){var shown=Array.prototype.filter.call(tl[i].querySelectorAll('[role="tab"]'),function(t){return !t.closest('[data-ari-platform-hide]')&&vis(t);});if(shown.length<=1&&shown.every(function(t){return /all fields/i.test(txt(t));}))set(tl[i],'data-ari-msg-hide','one-tab');}
 /* side icons right of the card */
 var host=col.parentElement,cr=col.getBoundingClientRect();if(host){var bs=host.querySelectorAll('button,a,[role="button"],[role="tab"]');for(i=0;i<bs.length;i++){var b=bs[i];if(col.contains(b))continue;var br=vis(b);if(!br||br.left<cr.right-4)continue;if(b.hasAttribute('data-ari-platform-hide'))continue;set(b,'data-ari-rail',b.querySelector('svg,img,i')||txt(b)?'1':'empty');}}}
/* (d) the platform's default blue on this page */
function blues(root){var a=[root].concat(Array.prototype.slice.call(root.querySelectorAll('*'),0,5000));
 for(var i=0;i<a.length;i++){var e=a[i];if(seenB.has(e))continue;seenB.add(e);if(e.closest('[data-ari-bubble],[data-ari-inbox-tab],[data-ari-send],[data-ari-unread],#ari-messages-layout-controls,[data-ari-platform-hide],[data-ari-conv-av],[data-ari-dav],[data-ari-thread-av],[data-ari-rail],[data-ari-msg-new],[data-ari-msg-search]'))continue;
  if(e.hasAttribute('data-ari-blue'))e.removeAttribute('data-ari-blue');
  var cs=w.getComputedStyle(e),m='';if(blue(rgb(cs.color)))m+='c';var bg=rgb(cs.backgroundColor);if(blue(bg))m+=lum(bg)<.72?'B':'b';
  if(parseFloat(cs.borderTopWidth)+parseFloat(cs.borderBottomWidth)+parseFloat(cs.borderLeftWidth)>0&&(blue(rgb(cs.borderTopColor))||blue(rgb(cs.borderLeftColor))||blue(rgb(cs.borderBottomColor))))m+='d';
  if(e instanceof w.SVGElement&&(blue(rgb(cs.fill))||blue(rgb(cs.stroke))))m+='f';
  if(m)set(e,'data-ari-blue',m);}}
function sync(){frame=null;lastRun=Date.now();last=w.location.href;if(stopped)return;var h=d.documentElement;
 if(!on()){if(h.hasAttribute(SW)){h.removeAttribute(SW);h.removeAttribute('data-ari-msg-theme');}return;}set(h,SW,'v2');set(h,'data-ari-msg-theme',THEME);
 var lay=d.getElementById(LAY);if(!lay)return;var list=d.getElementById(LIST),view=d.getElementById(VIEW),col=d.getElementById(COL);
 try{if(list){header(list);rows(list);}if(view)thread(view);if(col){details(col);hiddenRail(col,list,view);}blues(lay);var nav=d.querySelector('header.hl_header .topmenu-nav');if(nav)blues(nav);}catch(e){}}
function queue(){if(frame!==null||stopped)return;var wait=Math.max(0,250-(Date.now()-lastRun));frame=w.setTimeout(function(){frame=null;w.requestAnimationFrame(sync);},wait);}
w[K]={sync:sync,theme:function(t){THEME=t==='a'?'a':'b';sync();},stop:function(){stopped=true;if(timer!==null)w.clearInterval(timer);if(obs)obs.disconnect();if(frame!==null)w.clearTimeout(frame);w.removeEventListener('popstate',queue);
 d.documentElement.removeAttribute(SW);d.documentElement.removeAttribute('data-ari-msg-theme');ALL.forEach(function(a){var m=d.querySelectorAll('['+a+']');for(var i=0;i<m.length;i++)m[i].removeAttribute(a);});delete w[K];}};
w.addEventListener('popstate',queue);
timer=w.setInterval(function(){if(last!==w.location.href){seen=new WeakSet();seenB=new WeakSet();['data-ari-thread-name','data-ari-thread-head','data-ari-composer-input','data-ari-msg-scroll','data-ari-dname'].forEach(function(a){var m=d.querySelectorAll('['+a+']');for(var i=0;i<m.length;i++)m[i].removeAttribute(a);});queue();return;}
 if(on()){var l=d.getElementById(LIST);if(l&&l.getClientRects().length&&!l.querySelector('[data-ari-conv-row]')&&l.querySelectorAll('input[type="checkbox"],a[href*="/conversations/conversations/"]').length>1)queue();}},700);
function watch(){if(!d.body)return w.setTimeout(watch,50);obs=new w.MutationObserver(function(recs){if(!on()){if(d.documentElement.hasAttribute(SW))queue();return;}
  for(var i=0;i<recs.length;i++){var t=recs[i].target;if(!t||!t.closest)continue;if(t===d.body||t===d.documentElement){queue();continue;}
   if(recs[i].type==='attributes'){if(t.closest('#'+LAY+',header.hl_header')){seen.delete(t);seenB.delete(t);var dd=t.querySelectorAll('*');for(var j=0;j<dd.length&&j<200;j++){seen.delete(dd[j]);seenB.delete(dd[j]);}queue();}continue;}
   if(t.closest('#'+LAY+',header.hl_header')||(t.querySelector&&t.querySelector('#'+LAY))){queue();return;}}});
 obs.observe(d.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','aria-selected','aria-current','data-ari-show-list','data-ari-list-focus','data-ari-hide-thread','data-ari-conv-open','hidden']});}
watch();sync();})(window);

}catch(e){console.warn("ari block 42",e)}
try{

(function(w,d){'use strict';
const K='__ariCalendarV1',B='/v2/location/'+window.__ariLOC+'/',V=B+'calendars/view',P=B+'calendars/appointments';/* The browser tab title stays "Ari" (home-screen script owns it). */
if(w[K]){w[K].sync();return;}
const FAIRS0={"updated":"2026-10-16","users":{},"admins":["b3d7951b61fa42bcf84df58e"],"psychics":{"lilah":{"name":"Delilah","events":[{"id":"soulsearch-la-2026-10","name":"SoulSearch Los Angeles Enlightenment Expo","url":"https://events.soulsearch.io/los-angeles-ca/","start":"2026-10-24","end":"2026-10-25","city":"Los Angeles","venue":"Embassy Suites LAX North","time":"","ari_note":"A whole expo built around readers, so the crowd is already looking for readings. Booths are going fast, so apply soon."},{"id":"monarca-sol-2026","name":"Monarca Sol Día de los Muertos Festival","url":"https://www.eventbrite.com/e/monarca-sol-presents-dia-de-los-muertos-festival-altar-exhibit-tickets-2002173235043","start":"2026-10-24","end":"2026-10-24","city":"Pasadena","venue":"The Paseo, 300 E Colorado Blvd","time":"3-9 PM","ari_note":"Only about 4 miles from you, and the festival is free to attend."},{"id":"witches-market-2026-10","name":"Witches' Magick Market: Witching Hour Anniversary","url":"https://www.eventbrite.com/e/witches-magick-market-the-witching-hour-5-year-anniversary-tickets-1998266689460","start":"2026-10-24","end":"2026-10-24","city":"Glendale","venue":"UNEARTHED, 1728 Victory Blvd","time":"1-6 PM","ari_note":"They list readers and healers right on the page, and it's about 12 miles away."},{"id":"olvera-ddlm-2026","name":"Día de los Muertos on Olvera Street","url":"https://www.olveraevents.com/day-of-the-dead-olvera-street","start":"2026-10-25","end":"2026-11-02","city":"Downtown LA","venue":"Olvera Street","time":"10 AM-9 PM daily","ari_note":"Nine nights of festival crowds about 10 miles from you. Worth one quick ask about a booth."},{"id":"divine-marketplace-2026-11","name":"Divine Marketplace","url":"https://www.eventbrite.com/e/divine-marketplace-november-tickets-2002984262849","start":"2026-11-14","end":"2026-11-14","city":"Pomona","venue":"Todd Family Community Center","time":"11 AM-5 PM","ari_note":"A free monthly fair with tarot and mediums already on the lineup, so you'd fit right in."},{"id":"witches-market-2026-11","name":"Witches' Magick Market: Embers of Autumn","url":"https://www.eventbrite.com/e/witches-magick-market-embers-of-autumn-market-tickets-2001011956628","start":"2026-11-14","end":"2026-11-14","city":"Glendale","venue":"UNEARTHED","time":"1-6 PM","ari_note":"Same friendly market as October, with readers and healers on the lineup."},{"id":"backyard-brujerias-2026-11","name":"Backyard Brujerias","url":"https://www.eventbrite.com/e/backyard-brujerias-tickets-2003328331969","start":"2026-11-14","end":"2026-11-14","city":"Long Beach","venue":"3210 Chestnut Ave","time":"12-5 PM","ari_note":"Tarot and astrology readers are already part of this one."},{"id":"cosmic-travelers-2026-11","name":"Cosmic Travelers Expo Spiritual Fair","url":"https://www.eventbrite.com/e/cosmic-travelers-expo-spiritual-fair-nov-14-15-2026-palmdale-ca-tickets-2001093730215","start":"2026-11-14","end":"2026-11-15","city":"Palmdale","venue":"DoubleTree","time":"10 AM-6 PM","ari_note":"Two full days of people who came for intuitive readers. It's a longer drive, about 55 miles."},{"id":"divine-marketplace-2026-12","name":"Divine Marketplace","url":"https://www.eventbrite.com/e/divine-marketplace-tickets-2002991098294","start":"2026-12-12","end":"2026-12-12","city":"Pomona","venue":"Todd Family Community Center","time":"11 AM-5 PM","ari_note":"The same free fair as November, so if you like it, you can come back."},{"id":"witches-market-2026-12","name":"Witches' Magick Market: Grand Yule Celebration","url":"https://www.eventbrite.com/e/witches-magick-market-the-grand-yule-celebration-tickets-2002981812520","start":"2026-12-12","end":"2026-12-12","city":"Glendale","venue":"Venue to confirm","time":"12-5 PM","ari_note":"Their last market of the year, with readers and healers. Just confirm the venue when you email."},{"id":"winter-glow-2026-12","name":"Winter Glow Village Wellness Market","url":"https://www.eventbrite.com/e/winter-glow-village-a-beauty-wellness-market-los-angeles-pop-up-dec-13-tickets-2002904910504","start":"2026-12-13","end":"2026-12-13","city":"Pasadena","venue":"One Colorado","time":"12-5 PM","ari_note":"Not a psychic fair, but it's about 5 miles away and full of holiday shoppers."}]}}};/* build-time snapshot of the Spiritual Events data; the live copy comes through the bridge page */
const BRIDGE='https://clients.zdsihq.com/ari-events-bridge',BRIDGE_ORIGIN='https://clients.zdsihq.com',CACHE='ari-fairs-v1';
const glyph=()=>'\u2605';
let stopped=false,frame=null,obs=null,timer=null,last='',body=null,pop=null,fairByDate=new Map(),fairs={status:'idle',source:'none',who:'unknown',code:'',shown:0},bridge=null;
const norm=v=>(v||'').replace(/\s+/g,' ').trim();const pad=n=>(n<10?'0':'')+n,key=t=>{const x=new Date(t);return x.getFullYear()+'-'+pad(x.getMonth()+1)+'-'+pad(x.getDate());};
function inScope(){return w.location.protocol==='https:'&&['app.gohighlevel.com','app.zdsihq.com'].includes(w.location.hostname)&&w.location.pathname.startsWith(B);}
function route(){if(!inScope())return '';const p=w.location.pathname.replace(/\/$/,'');return p===V?'view':p===P?'appointments':'';}
/* Only two kinds on this calendar: reading appointments (circle) and Spiritual Events (star). No moons, sky or seasonal days. */
function eventsFor(date){return ISO.test(date||'')?(fairByDate.get(date)||[]):[];}
/* Psychic fairs, expos and markets from the Spiritual Events data. Each psychic sees her own list, an admin sees everyone's,
   anyone else sees none. Who is signed in comes from the profile card in the header (the email is only hashed, never stored). */
const ISO=/^\d{4}-\d\d-\d\d$/;
function fairDays(e){if(Array.isArray(e.dates)&&e.dates.length)return e.dates.filter(x=>ISO.test(x));if(!ISO.test(e.start||''))return [];
 const end=ISO.test(e.end||'')?e.end:e.start;if(e.repeat==='Select dates'||end<e.start)return [e.start];const out=[];const [y,m,dd]=e.start.split('-').map(Number);
 for(let i=0;i<3;i++){const k=key(new Date(y,m-1,dd+i,12));if(k>end)break;out.push(k);}return (out[out.length-1]===end)?out:[e.start];}/* up to 3 days: every day; longer runs: the first day (the note gives the range) */
function fairWhen(e,days){const f=k=>{const [y,m,dd]=k.split('-').map(Number);return new Date(y,m-1,dd).toLocaleDateString(undefined,{month:'short',day:'numeric'});};
 if(Array.isArray(e.dates)&&e.dates.length>1)return (e.repeat?e.repeat+': ':'')+e.dates.map(f).join(', ');if(e.repeat==='Select dates')return 'Select dates, '+f(e.start)+' to '+f(e.end||e.start);
 return days.length>1?f(days[0])+' to '+f(days[days.length-1]):f(days[0]);}
function shortFair(n){const t=norm(n).replace(/\s*\(.*?\)\s*/g,' ').replace(/\s*[:\u2013\u2014]\s.*$|\s+-\s.*$/,'').trim();return t||norm(n);}
function txt(v,max){return typeof v==='string'?norm(v).slice(0,max||300):'';}
function setFairs(data,source){fairByDate=new Map();fairs.source=source;fairs.shown=0;
 if(!data||typeof data!=='object'||!data.psychics||typeof data.psychics!=='object'){fairs.status='no-data';return;}
 const admins=Array.isArray(data.admins)?data.admins:[],users=data.users&&typeof data.users==='object'?data.users:{};
 const admin=!!fairs.code&&admins.includes(fairs.code),mine=fairs.code?users[fairs.code]:'';fairs.who=admin?'admin':mine?'psychic':'unknown';fairs.updated=txt(data.updated,20);
 const keys=admin?Object.keys(data.psychics):mine&&data.psychics[mine]?[mine]:[];fairs.psychics=keys.slice();
 for(const pk of keys){const p=data.psychics[pk];if(!p||!Array.isArray(p.events))continue;
  for(const e of p.events.slice(0,200)){if(!e||typeof e!=='object')continue;const name=txt(e.name,120);if(!name)continue;const days=fairDays(e);if(!days.length)continue;
   const url=/^https:\/\/[^\s"'<>]+$/.test(e.url||'')?e.url:'';
   const ev={id:'fair-'+pk+'-'+txt(e.id,80),kind:'fair',title:name,short:shortFair(name),city:txt(e.city,80),venue:txt(e.venue,120),time:txt(e.time,40),
    when:fairWhen(e,days),sum:txt(e.ari_note,300)||txt(e.note,300),url,who:admin?txt(p.name,40):'',t:Date.parse(days[0]+'T12:00:00')};
   for(const k of days){if(!fairByDate.has(k))fairByDate.set(k,[]);fairByDate.get(k).push(ev);}fairs.shown++;}}
 fairs.status=fairs.who==='unknown'?'not-yours':'ok';queue();}
function whoEmail(){const card=d.querySelector('header.hl_header .user-info-card, .hl_header--dropdown .user-info-card');if(!card)return '';
 for(const el of card.querySelectorAll('*')){if(el.children.length)continue;const t=(el.textContent||'').trim();if(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(t))return t.toLowerCase();}return '';}
async function sha24(s){const b=await w.crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('').slice(0,24);}
function readCache(){try{const c=JSON.parse(w.sessionStorage.getItem(CACHE)||'null');return c&&Date.now()-c.at<6*36e5?c.data:null;}catch(e){return null;}}
function loadFairs(){if(fairs.status!=='idle')return;fairs.status='loading';
 (async()=>{const em=whoEmail();try{fairs.code=em&&w.crypto&&w.crypto.subtle?await sha24(em):'';}catch(e){fairs.code='';}
  if(!fairs.code){fairs.who='unknown';fairs.tries=(fairs.tries||0)+1;fairs.status=fairs.tries<40?'idle':'no-sign-in';return;}
  const cached=readCache();if(cached){setFairs(cached,'live (cached this session)');return;}
  if(FAIRS0)setFairs(FAIRS0,'snapshot (build '+(txt(FAIRS0.updated,20)||'?')+')');
  const done=(data,src)=>{w.removeEventListener('message',onMsg);if(bridge){bridge.remove();bridge=null;}if(data){try{w.sessionStorage.setItem(CACHE,JSON.stringify({at:Date.now(),data}));}catch(e){}setFairs(data,src);}};
  const onMsg=e=>{if(e.origin!==BRIDGE_ORIGIN||!bridge||e.source!==bridge.contentWindow)return;const m=e.data;if(!m||m.type!=='ari-events')return;if(m.error)fairs.bridge='bridge: '+txt(m.error,80);done(m.data&&m.data.psychics?m.data:null,'live');};
  w.addEventListener('message',onMsg);bridge=d.createElement('iframe');bridge.src=BRIDGE+'?v='+key(Date.now());bridge.title='';bridge.setAttribute('aria-hidden','true');bridge.tabIndex=-1;
  bridge.setAttribute('sandbox','allow-scripts allow-same-origin');bridge.style.cssText='position:absolute;width:1px;height:1px;left:-9999px;top:0;border:0;opacity:0;pointer-events:none';
  d.body.appendChild(bridge);setTimeout(()=>{if(bridge){fairs.bridge='no answer in 8s';done(null);}},8000);})();}
function fmt(date){const [y,m,dd]=date.split('-').map(Number);return new Date(y,m-1,dd).toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'});}
function fmtO(date,o){const [y,m,dd]=date.split('-').map(Number);return new Date(y,m-1,dd,12).toLocaleDateString(undefined,o);}
const STOP=['pointerdown','pointerup','mousedown','mouseup','touchstart','touchend','click','dblclick','contextmenu'];
/* Our own pieces swallow pointer events so the calendar under them never sees a click (no booking form); links still open. */
function shield(el){for(const t of STOP)el.addEventListener(t,ev=>{ev.stopPropagation();if((t==='click'||t==='dblclick'||t==='contextmenu')&&!(ev.target.closest&&ev.target.closest('a[href]')))ev.preventDefault();});return el;}
function el(tag,cls,text){const e=d.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;}
function btn(cls,text){const b=el('button',cls,text);b.type='button';return b;}
const grp=()=>'fair';
function calRoot(){return d.querySelector('#calendar-page-parent-container .fc')||d.getElementById('fc-calendar-container-v2');}
function viewMode(cal){if(!cal)return 'none';const v=cal.querySelector('.fc-view');if(!v)return 'none';const c=v.className;
 return /dayGridMonth|multiMonth/.test(c)?'month':/timeGridWeek|dayGridWeek|resourceTimeGridWeek/.test(c)?'week':/timeGridDay|dayGridDay|resourceTimeGridDay/.test(c)?'day':/fc-list/.test(c)?'list':'other';}
/* ---- note sheet (a Spiritual Event, or a day's list) ---- */
function closePop(){if(pop){pop.remove();pop=null;}}
function mount(sh,anchor){shield(sh);d.body.appendChild(sh);pop=sh;if(w.innerWidth>760&&anchor&&anchor.isConnected){const r=anchor.getBoundingClientRect(),sw=sh.offsetWidth,shh=sh.offsetHeight;
 let l=Math.min(Math.max(12,r.left),w.innerWidth-sw-12),t=r.bottom+8;if(t+shh>w.innerHeight-12)t=Math.max(12,r.top-shh-8);sh.style.left=l+'px';sh.style.top=t+'px';}
 const c=sh.querySelector('.ari-cx-close');if(c)c.focus();}
function closeBtn(){const c=btn('ari-cx-close','Close');c.addEventListener('click',closePop);return c;}
function openPop(ev,anchor){if(ev.kind==='appt'){closePop();if(ev.el&&ev.el.isConnected)ev.el.click();return;}
 closePop();const sh=el('div','ari-cx-sheet ari-cx-'+grp(ev));sh.id='ari-cal-note';sh.setAttribute('role','dialog');sh.setAttribute('aria-label',ev.title);
 sh.append(el('div','ari-cx-sheet-date','Spiritual Event \u00b7 '+(ev.when||fmt(key(ev.t)))));const h=el('h3','',ev.title);h.prepend(el('span','ari-cx-sheet-gl',glyph(ev)));sh.append(h);
 if(ev.kind==='fair'){const where=[ev.city,ev.venue].filter(Boolean).join(' \u00b7 ');if(where||ev.time)sh.append(el('div','ari-cx-sheet-where',where+(ev.time?(where?' \u00b7 ':'')+ev.time:'')));}
 if(ev.sum)sh.append(el('p','',ev.sum));if(ev.who)sh.append(el('div','ari-cx-sheet-for','For '+ev.who));
 const row=el('div','ari-cx-sheet-row');if(ev.url){const a=el('a','','View event');a.href=ev.url;a.target='_blank';a.rel='noopener noreferrer';row.append(a);}row.append(closeBtn());sh.append(row);mount(sh,anchor);}
function openDay(date,items,anchor){closePop();const sh=el('div','ari-cx-sheet ari-cx-list');sh.id='ari-cal-note';sh.setAttribute('role','dialog');sh.setAttribute('aria-label',fmt(date));
 sh.append(el('div','ari-cx-sheet-date',fmt(date)));
 for(const it of items){const b=btn('ari-cx-li ari-cx-li-'+(it.kind==='appt'?'appt':grp(it)));b.append(el('span','ari-cx-li-gl',it.kind==='appt'?'':'\u2605'),el('span','ari-cx-li-tx',it.kind==='appt'?[it.time,it.name].filter(Boolean).join('  '):it.title));
  b.addEventListener('click',()=>openPop(it,anchor));sh.append(b);}
 sh.append(closeBtn());mount(sh,anchor);}
/* ---- reading the GHL grid (DOM only) ---- */
const SEP=/\s+[\u00b7|\-\u2013\u2014:]\s+|\s*[\u00b7|]\s*/;
function minsN(t){const m=/(\d{1,2})(?::(\d\d))?\s*([ap])?/i.exec(t||'');if(!m)return 9999;let h=+m[1]%12;if(m[3]&&/p/i.test(m[3]))h+=12;if(!m[3]&&+m[1]===12)h=12;return h*60+(+m[2]||0);}
function clock(t){const m=minsN(t);if(m===9999)return {t:'',ap:''};const h=Math.floor(m/60),mm=m%60;return {t:((h%12)||12)+(mm?':'+pad(mm):''),ap:h<12?'AM':'PM'};}
function firstName(t){const h=norm(t).split(SEP)[0]||'';return h.split(' ').filter(Boolean)[0]||h;}
function shortTitles(cal){cal.querySelectorAll('.fc-daygrid-event .fc-event-title').forEach(e=>{if(e.childElementCount)return;const cur=e.textContent;
 if(e.getAttribute('data-ari-short')===cur)return;const sh=firstName(cur);if(!sh||sh===cur){e.setAttribute('data-ari-short',cur);return;}
 e.setAttribute('data-ari-full',cur);e.setAttribute('data-ari-short',sh);e.textContent=sh;const ev=e.closest('.fc-event');if(ev&&!ev.title)ev.title=cur;});}
function monthInfo(cal){const cells=[...cal.querySelectorAll('td.fc-daygrid-day[data-date]')];const inM=cells.filter(c=>!c.classList.contains('fc-day-other'));
 const first=inM[0]?inM[0].getAttribute('data-date'):'';return {cells,first,ym:first.slice(0,7),days:inM.map(c=>c.getAttribute('data-date'))};}
function appts(cal){const out=[];cal.querySelectorAll('td.fc-daygrid-day[data-date]').forEach(td=>{const date=td.getAttribute('data-date');
 td.querySelectorAll('.fc-daygrid-event').forEach(ev=>{const tt=ev.querySelector('.fc-event-title'),tm=ev.querySelector('.fc-event-time');
  const full=norm((tt&&tt.getAttribute('data-ari-full'))||ev.getAttribute('title')||(tt&&tt.textContent)||'');if(!full)return;const parts=full.split(/\s+[\u00b7|\-\u2013\u2014:]\s+/);
  const time=norm(tm?tm.textContent:'');out.push({kind:'appt',date,time,mins:minsN(time),name:parts[0]||full,service:parts.slice(1).join(' \u00b7 '),el:ev});});});
 return out.sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:a.mins-b.mins);}
function dayLabel(k){const t=new Date(),tk=key(t),tm=key(new Date(t.getFullYear(),t.getMonth(),t.getDate()+1));return k===tk?'Today':k===tm?'Tomorrow':'';}
function whenShort(e,k){const w0=e.when||'';const i=w0.indexOf(':');return i>0&&w0.split(',').length>2?w0.slice(0,i)+', next '+fmtO(k,{month:'short',day:'numeric'}):w0;}
const notesFor=k=>eventsFor(k);
/* GHL's own controls, found by role and text (used only to switch month or view, exactly as a click would) */
const MONTH=/^\s*month(\s+view)?\s*$/i,VIEWWORD=/\b(day|week|month|list)(\s+view)?\b/i;
function ghl(){const box=d.getElementById('calendar-page-parent-container');if(!box)return {};const bs=[...box.querySelectorAll('button,[role="radio"],[role="tab"],[role="option"],[role="menuitem"]')].filter(b=>!b.closest('.fc,#ari-cal-bar,#ari-ag'));
 const t=d.getElementById('today-button')||bs.find(b=>/^\s*today\s*$/i.test(b.textContent||''));const lab=b=>((b.getAttribute('aria-label')||'')+' '+(b.title||'')+' '+(b.textContent||'')).trim();
 let prev=bs.find(b=>/\bprev(ious)?\b/i.test(lab(b))),next=bs.find(b=>/\bnext\b/i.test(lab(b)));
 if((!prev||!next)&&t){const sib=[...t.parentElement.querySelectorAll('button')].filter(b=>b!==t);prev=prev||sib[0];next=next||sib[1];}
 const month=bs.find(b=>MONTH.test(b.textContent||'')||MONTH.test(b.getAttribute('aria-label')||'')||MONTH.test(b.title||''));
 const select=d.getElementById('view-select')||[...box.querySelectorAll('.n-base-selection,.hr-base-selection,[role="combobox"]')].find(e=>!e.closest('.fc,#ari-cal-bar,#ari-ag')&&VIEWWORD.test(e.textContent||''))||null;
 return {today:t,prev,next,month,select};}
/* Switch GHL to its month grid (the Agenda reads it): a Month button if there is one, otherwise the view dropdown's "Month" option,
   exactly as a click would. A few tries, spaced out; never opens Manage view (that is a panel the psychic would see). */
let lastNav=-1e9;
function press(e){for(const t of ['pointerdown','mousedown','pointerup','mouseup','click'])e.dispatchEvent(new MouseEvent(t,{bubbles:true,cancelable:true,view:w}));}
function monthOption(){return [...d.querySelectorAll('[role="option"],.n-base-select-option,.hr-base-select-option,.n-dropdown-option,.hr-dropdown-option,[role="menuitem"]')].find(o=>!o.closest('.fc,#ari-cal-bar,#ari-ag')&&MONTH.test(o.textContent||''));}
function toMonth(){const now=w.performance.now();if(navTried>=4)return;if(now-lastNav<1200){w.setTimeout(queue,1250-(now-lastNav));return;}navTried++;lastNav=now;w.setTimeout(queue,1300);const g=ghl();
 if(g.month){press(g.month);return;}const o0=monthOption();if(o0){press(o0);return;}if(!g.select)return;
 press(g.select.querySelector('.n-base-selection,.hr-base-selection,[role="combobox"]')||g.select);
 w.setTimeout(()=>{const o=monthOption();if(o)press(o);else{d.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));}queue();},250);}
/* ---- view choice: Agenda (default) or the GHL grid ---- */
const VKEY='ari-cal-view',WAIT=5000;let anchorDay='',agendaYm='',navTried=0,waitFrom=0,fallback=false,waitTimer=null;
function calView(){try{return w.localStorage.getItem(VKEY)==='grid'?'grid':'agenda';}catch(e){return 'agenda';}}
function setCalView(v){try{w.localStorage.setItem(VKEY,v);}catch(e){}if(v==='agenda'){fallback=false;waitFrom=0;navTried=0;}closePop();sync();w.requestAnimationFrame(()=>w.dispatchEvent(new Event('resize')));}/* the grid re-measures on resize */
/* ---- top bar: hello + toggle (agenda), month title + toggle (grid month), toggle (grid week/day) ---- */
function bar(cal,v,m){let b=d.getElementById('ari-cal-bar');if(!b){b=shield(el('div'));b.id='ari-cal-bar';}if(b.nextElementSibling!==cal)cal.before(b);
 const mi=v==='grid'&&m==='month'?monthInfo(cal):null; const sig=[v,m,key(Date.now()),mi?mi.ym:''].join('|');if(b.getAttribute('data-sig')===sig)return;b.setAttribute('data-sig',sig);b.textContent='';b.className='is-'+v+' is-'+m;
 const left=el('div','ari-cal-bar-l');
 if(v==='agenda'){left.append(el('div','ari-cal-eyebrow','Today is'),el('h2','ari-cal-hello',fmt(key(Date.now()))));}
 else if(mi&&mi.first){const t=el('h2','ari-cal-month',fmtO(mi.first,{month:'long'}));t.append(el('em','',' '+mi.first.slice(0,4)));left.append(el('div','ari-cal-eyebrow','Your month'),t);
}
 const tg=el('div','ari-cal-toggle');tg.setAttribute('role','group');tg.setAttribute('aria-label','Calendar view');
 for(const [k2,lab] of [['agenda','Agenda'],['grid','Calendar grid']]){const x=btn('',lab);x.setAttribute('aria-pressed',String(v===k2));x.addEventListener('click',()=>setCalView(k2));tg.append(x);}
 b.append(left,tg);}
/* ---- glyph button by a date (month cells and week/day headers) ---- */
function glyphButton(k){const n=notesFor(k);if(!n.length)return null;const b=btn('ari-cal-glb');
 b.setAttribute('aria-label',(n.length>1?n.length+' Spiritual Events':'Spiritual Event')+': '+n.map(e=>e.title).join(', ')+', '+fmt(k));b.title=n.map(e=>e.title).join(' \u00b7 ');
 b.append(el('span','ari-g-fair','\u2605'+(n.length>1?n.length:'')));b.addEventListener('click',()=>n.length===1?openPop(n[0],b):openDay(k,n,b));return b;}
function gridMonth(cal){const mi=monthInfo(cal);const by={};for(const a of appts(cal))(by[a.date]=by[a.date]||[]).push(a);
 for(const td of mi.cells){const k=td.getAttribute('data-date'),top=td.querySelector('.fc-daygrid-day-top'),evs=td.querySelector('.fc-daygrid-day-events');if(!top)continue;
  const sig=k+'|'+eventsFor(k).map(e=>e.id).join();let g=top.querySelector('.ari-cal-gl');
  if(!g||g.getAttribute('data-sig')!==sig){if(g)g.remove();g=shield(el('span','ari-cal-gl'));g.setAttribute('data-sig',sig);const gb=glyphButton(k);if(gb)g.append(gb);top.prepend(g);}
  const hs=[...td.querySelectorAll('.fc-daygrid-event-harness')].filter(h=>h.querySelector('.fc-daygrid-event'));
  hs.forEach((h,i)=>{if((i>=2)!==h.hasAttribute('data-ari-hide'))h.toggleAttribute('data-ari-hide',i>=2);});
  let more=td.querySelector('.ari-cal-more');const extra=hs.length-2;
  if(extra>0&&evs){if(!more||more.getAttribute('data-n')!==String(extra)||more.parentNode!==evs){if(more)more.remove();more=shield(btn('ari-cal-more','+'+extra+' more'));more.setAttribute('data-n',String(extra));
    more.setAttribute('aria-label',extra+' more on '+fmt(k));more.addEventListener('click',()=>openDay(k,[...(by[k]||[]),...notesFor(k)],more));evs.append(more);}}
  else if(more)more.remove();}}
function gridHeads(cal){cal.querySelectorAll('th.fc-col-header-cell[data-date]').forEach(th=>{const k=(th.getAttribute('data-date')||'').slice(0,10);if(!ISO.test(k))return;
 const sig=k+'|'+eventsFor(k).map(e=>e.id).join();let g=th.querySelector('.ari-cal-gl');if(g&&g.getAttribute('data-sig')===sig)return;if(g)g.remove();
 g=shield(el('span','ari-cal-gl'));g.setAttribute('data-sig',sig);const gb=glyphButton(k);if(gb)g.append(gb);(th.querySelector('.fc-scrollgrid-sync-inner')||th).append(g);});}
/* ---- agenda + mini month ---- */
function mini(cal,mi,list){const by={};for(const a of list)(by[a.date]=by[a.date]||[]).push(a);const today=key(Date.now());const g0=ghl();
 const card=el('section','ari-ag-mini');card.setAttribute('aria-label','Month');const hd=el('div','ari-ag-mini-hd');
 const arrow=(t,lab,target)=>{const b=btn('ari-ag-arrow',t);b.setAttribute('aria-label',lab);if(!target)b.hidden=true;b.addEventListener('click',()=>{anchorDay='';closePop();const x=ghl()[target===g0.prev?'prev':'next'];if(x)x.click();});return b;};
 const tt=el('h3','',fmtO(mi.first,{month:'long'}));tt.append(el('em','',' '+mi.first.slice(0,4)));hd.append(arrow('\u2039','Previous month',g0.prev),tt,arrow('\u203A','Next month',g0.next));card.append(hd);
 const grid=el('div','ari-ag-grid');for(const k of ['S','M','T','W','T','F','S'])grid.append(el('span','ari-ag-wd',k));
 for(const td of mi.cells){const k=td.getAttribute('data-date'),other=td.classList.contains('fc-day-other');const b=btn('ari-ag-day');
  if(other)b.classList.add('is-other');if(k===today)b.classList.add('is-today');if(k===anchorDay)b.classList.add('is-sel');
  const fair=eventsFor(k).length,cnt=(by[k]||[]).length;
  b.setAttribute('aria-label',fmt(k)+(cnt?', '+cnt+' appointment'+(cnt>1?'s':''):'')+(fair?', '+(fair>1?fair+' Spiritual Events':'Spiritual Event'):''));if(other)b.tabIndex=-1;
  b.append(el('span','ari-ag-num',String(+k.slice(8))));const mk=el('span','ari-ag-marks');
  for(let i=0;i<Math.min(cnt,3);i++)mk.append(el('i','ari-ag-dot'));if(fair)mk.append(el('i','ari-ag-star','\u2605'));b.append(mk);
  b.addEventListener('click',()=>{if(other)return;anchorDay=k;closePop();sync(true);const t=d.querySelector('#ari-ag .ari-ag-list');if(t&&w.innerWidth<=760)t.scrollIntoView({block:'start',behavior:'smooth'});});grid.append(b);}
 card.append(grid);const lg=el('div','ari-ag-legend');lg.append(el('span','ari-ag-lg-dot','Reading appointments'),el('span','ari-ag-lg-star','Spiritual events'));card.append(lg);return card;}
function card(it){const b=btn('ari-ag-card is-'+(it.kind==='appt'?'appt':grp(it)));
 if(it.kind==='appt'){const c=clock(it.time);const tm=el('span','ari-ag-time');tm.append(el('b','',c.t),el('small','',c.ap));const bd=el('span','ari-ag-body');
  bd.append(el('span','ari-ag-name',it.name),el('span','ari-ag-sub',it.service||'Appointment'));b.append(tm,bd,el('span','ari-ag-chev','\u203A'));b.setAttribute('aria-label',[c.t+' '+c.ap,it.name,it.service].filter(Boolean).join(', '));b.addEventListener('click',()=>openPop(it,b));return b;}
 const g='fair',bd=el('span','ari-ag-body');const tag='Spiritual Event';
 bd.append(el('span','ari-ag-tag',tag),el('span','ari-ag-name',it.title));if(g==='fair')bd.append(el('span','ari-ag-sub',[it.city,whenShort(it,it.date)].filter(Boolean).join(' \u00b7 ')));
 if(it.sum)bd.append(el('span','ari-ag-note',it.sum));
 b.append(el('span','ari-ag-gl',glyph(it)),bd,el('span','ari-ag-chev','\u203A'));b.addEventListener('click',()=>openPop(it,b));return b;}
function agendaList(mi,list){const main=el('section','ari-ag-list');main.setAttribute('aria-label','Agenda');const today=key(Date.now());
 const start=anchorDay||(mi.days.includes(today)?today:mi.days[0]);let any=false;
 for(const k of mi.days){if(k<start)continue;const ap=list.filter(a=>a.date===k),n=notesFor(k).map(e=>Object.assign({},e,{date:k}));if(!ap.length&&!n.length)continue;any=true;
  const day=el('div','ari-ag-dayblock');day.setAttribute('data-date',k);const h=el('h3','ari-ag-dayhd');const rel=dayLabel(k);
  h.append(el('span','',rel||fmtO(k,{weekday:'long'})),el('small','',rel?fmt(k):fmtO(k,{month:'long',day:'numeric'})));day.append(h);
  for(const it of [...ap,...n])day.append(card(it));main.append(day);}
 if(!any)main.append(el('p','ari-ag-empty','Nothing on your calendar for the rest of this month.'));
 main.append(el('p','ari-ag-end',ghl().next?'That\u2019s the month. Use the arrows on the month card for the next one.':'That\u2019s the month.'));return main;}
function agenda(cal,force){let box=d.getElementById('ari-ag');const mi=monthInfo(cal);if(!mi.first)return;
 if(mi.ym!==agendaYm){agendaYm=mi.ym;if(anchorDay&&anchorDay.slice(0,7)!==mi.ym)anchorDay='';}
 const list=appts(cal);const sig=[mi.ym,anchorDay,key(Date.now()),list.map(a=>a.date+a.time+a.name+a.service).join(),mi.cells.map(c=>eventsFor(c.getAttribute('data-date')).map(e=>e.id).join()).join(';')].join('|');
 if(!force&&box&&box.getAttribute('data-sig')===sig&&box.parentElement===cal.parentElement)return;
 const fresh=shield(el('div'));fresh.id='ari-ag';fresh.setAttribute('data-sig',sig);fresh.append(mini(cal,mi,list),agendaList(mi,list));if(box)box.replaceWith(fresh);else cal.after(fresh);}
function flag(v){if(body.getAttribute('data-ari-cal-view')!==v)body.setAttribute('data-ari-cal-view',v);}
function agendaReady(){const b=d.getElementById('ari-cal-bar'),a=d.getElementById('ari-ag');return !!(b&&b.isConnected&&a&&a.isConnected&&a.querySelectorAll('.ari-ag-day').length>0&&a.querySelector('.ari-ag-list'));}
/* Agenda wanted: draw it while GHL's grid stays on screen; only when the bar and a drawn Agenda exist does the agenda flag go on (that
   flag is what moves the grid off-screen and tucks GHL's view controls away). Not ready after WAIT ms: the grid and GHL's controls stay. */
function decorate(cal,mode){const want=calView();
 if(want==='agenda'&&!fallback){
  if(mode==='month'){shortTitles(cal);agenda(cal);bar(cal,'agenda',mode);if(agendaReady()){navTried=0;waitFrom=0;flag('agenda');return;}}
  else toMonth();
  if(!waitFrom){waitFrom=w.performance.now();w.clearTimeout(waitTimer);waitTimer=w.setTimeout(queue,WAIT+50);}
  if(w.performance.now()-waitFrom>WAIT){fallback=true;w.__ariCalFallback='agenda not ready after '+WAIT/1000+'s (mode '+mode+', '+(ghl().month?'Month button found but did not switch':ghl().select?'view dropdown found, no Month option took':'no Month control found')+')';}
  else{flag('grid');gridBar(cal,mode,true);return;}}
 flag('grid');gridBar(cal,mode,false);}
function gridBar(cal,mode,waiting){if(waiting){const b=d.getElementById('ari-cal-bar');if(b&&b.nextElementSibling!==cal)cal.before(b);if(mode==='week'||mode==='day')gridHeads(cal);return;}
 const ag=d.getElementById('ari-ag');if(ag)ag.remove();bar(cal,'grid',mode);if(mode==='month'){shortTitles(cal);gridMonth(cal);}else if(mode==='week'||mode==='day')gridHeads(cal);}
function listButton(){const row=d.querySelector('#ari-calm-bookings-header .ari-calm-heading-row');if(!row||row.querySelector('#ari-cal-open'))return;
 const a=d.createElement('a');a.id='ari-cal-open';a.href=V;a.textContent='Calendar view';
 a.addEventListener('click',e=>{if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const nav=w.__ariCalmBookingsV1;try{if(nav&&typeof nav.openCalendarView==='function'&&nav.openCalendarView())e.preventDefault();}catch(_){}});
 const opt=row.querySelector('#ari-calm-bookings-options');if(opt)row.insertBefore(a,opt);else row.appendChild(a);}
function clearAll(){closePop();d.querySelectorAll('.ari-cal-gl,.ari-cal-more,#ari-cal-bar,#ari-ag,#ari-cal-open').forEach(n=>n.remove());d.querySelectorAll('[data-ari-hide]').forEach(n=>n.removeAttribute('data-ari-hide'));
 if(body){for(const a of ['data-ari-calendar','data-ari-cal-mode','data-ari-cal-view'])body.removeAttribute(a);body=null;}waitFrom=0;fallback=false;navTried=0;w.clearTimeout(waitTimer);}
function sync(force){frame=null;if(stopped)return;if(last!==w.location.href){last=w.location.href;closePop();}const r=route();if(!r||!d.body){clearAll();return;}
 if(body!==d.body){if(body)clearAll();body=d.body;}if(body.getAttribute('data-ari-calendar')!==r)body.setAttribute('data-ari-calendar',r);
 if(r==='view'){loadFairs();const cal=calRoot(),m=viewMode(cal);if(body.getAttribute('data-ari-cal-mode')!==m)body.setAttribute('data-ari-cal-mode',m);if(cal){if(force===true){const a=d.getElementById('ari-ag');if(a)a.removeAttribute('data-sig');}decorate(cal,m);}}
 else{body.removeAttribute('data-ari-cal-mode');body.removeAttribute('data-ari-cal-view');d.querySelectorAll('.ari-cal-gl,.ari-cal-more,#ari-cal-bar,#ari-ag').forEach(n=>n.remove());listButton();}}
function queue(){if(!stopped&&frame===null)frame=w.requestAnimationFrame(()=>sync());}
function key2(e){if(e.key==='Escape'&&pop)closePop();}
function outside(e){if(pop&&!pop.contains(e.target)&&!(e.target.closest&&e.target.closest('.ari-cal-glb,.ari-cal-more,.ari-ag-card')))closePop();}
obs=new w.MutationObserver(queue);obs.observe(d.documentElement,{childList:true,subtree:true});timer=w.setInterval(()=>{if(last!==w.location.href)queue();},250);
d.addEventListener('keydown',key2);d.addEventListener('pointerdown',outside,true);w.addEventListener('popstate',queue);w.addEventListener('resize',closePop);
w[K]={sync:queue,events:eventsFor,view:calView,setView:setCalView,status(){const cal=calRoot(),g=ghl();return{route:route(),mode:viewMode(cal),view:calView(),agendaDays:d.querySelectorAll('#ari-ag .ari-ag-dayblock').length,agendaCards:d.querySelectorAll('#ari-ag .ari-ag-card').length,
 gridGlyphs:d.querySelectorAll('.ari-cal-glb').length,gridMore:d.querySelectorAll('.ari-cal-more').length,ghlControls:{today:!!g.today,prev:!!g.prev,next:!!g.next,month:!!g.month,viewSelect:!!g.select},agendaReady:agendaReady(),flag:d.body?d.body.getAttribute('data-ari-cal-view'):null,waiting:!!waitFrom&&!fallback,fallback:fallback?(w.__ariCalFallback||true):false,monthTries:navTried,
 kinds:'reading appointments + Spiritual Events',fairs:{status:fairs.status,source:fairs.source,who:fairs.who,signInCode:fairs.code,psychics:fairs.psychics||[],events:fairs.shown,dataUpdated:fairs.updated||'',snapshot:FAIRS0?txt(FAIRS0.updated,20)||'yes':'none',bridge:fairs.bridge||''}};},
 stop(){stopped=true;obs.disconnect();w.clearInterval(timer);if(frame!==null)w.cancelAnimationFrame(frame);d.removeEventListener('keydown',key2);d.removeEventListener('pointerdown',outside,true);w.removeEventListener('popstate',queue);w.removeEventListener('resize',closePop);clearAll();delete w[K];}};
sync();
})(window,document);

}catch(e){console.warn("ari block 43",e)}
try{

(function(w,d){'use strict';
const K='__ariClientsLuxeV1',B='/v2/location/'+window.__ariLOC+'/contacts/',M='data-ari-clients-luxe',C='data-ari-col',H='data-ari-platform-hide';
if(w[K]){w[K].reconcile();return;}
let stopped=false,frame=null,body=null,last='';const texts=new Map(),marked=new Set(),attrs=new Map();
const norm=s=>(s||'').replace(/\s+/g,' ').trim(),low=s=>norm(s).toLowerCase();
function scoped(){const p=w.location.pathname.replace(/\/$/,'');return w.location.protocol==='https:'&&['app.gohighlevel.com','app.zdsihq.com'].includes(w.location.hostname)&&p.startsWith(B+'smart_list/');}
const RULES=[['name',/^(contact |client |customer )?name$|^client$|^customer$|^full name$|^contact$/,'Customer'],['phone',/phone|mobile/,'Phone'],['email',/e-?mail/,'Email'],
 ['birthday',/birth|^dob$|birthday|^d\.o\.b\.?$/,'Birthday'],['zodiac',/zodiac|star sign|sun sign|^sign$|astro/,'Zodiac sign'],['appt',/appointment/,null],['activity',/last activity|last active|last contacted|last message|activity/,'Last activity']];
function kind(col){if(col.querySelector('input[type="checkbox"]')||col.classList.contains('tabulator-row-handle'))return 'select';const t=low((col.querySelector('.tabulator-col-title')||col).textContent);
 if(!t)return col.getAttribute('tabulator-field')?'hide':'select';for(const [k,re] of RULES)if(re.test(t))return k;return 'hide';}
function setAttr(n,name,v){if(!attrs.has(n))attrs.set(n,new Map());const s=attrs.get(n);if(!s.has(name))s.set(name,n.getAttribute(name));if(n.getAttribute(name)!==v)n.setAttribute(name,v);}
function relabel(col,k){const r=RULES.find(x=>x[0]===k);if(!r||!r[2])return;const t=col.querySelector('.tabulator-col-title');if(!t)return;
 const leaf=t.children.length?[...t.querySelectorAll('*')].find(e=>!e.children.length&&norm(e.textContent))||null:t;if(!leaf)return;if(norm(leaf.textContent)===r[2])return;
 if(!texts.has(leaf))texts.set(leaf,{original:leaf.textContent,written:r[2]});leaf.textContent=r[2];}
function hide(n){if(!n||n.hasAttribute(H))return;n.setAttribute(H,'');marked.add(n);}
function restore(){for(const [n,s] of attrs)for(const [name,v] of s){if(v===null)n.removeAttribute(name);else n.setAttribute(name,v);}attrs.clear();
 for(const [n,t] of texts)if(n.textContent===t.written)n.textContent=t.original;texts.clear();for(const n of marked)n.removeAttribute(H);marked.clear();
 if(body){body.removeAttribute(M);body.removeAttribute('data-ari-clients-cols');body=null;}}
const CLUTTER=/\b(ai|workflows?|campaigns?|automations?|bulk|export|import|smart ?lists?|opportunit\w*|add to|send review|merge|trigger|manage smart)\b|sparkle|copilot/i;
function reconcile(){frame=null;if(stopped)return;last=w.location.href;const root=scoped()?d.getElementById('crm-contacts-view'):null;if(!root||!d.body){restore();return;}
 if(body!==d.body){restore();body=d.body;}for(const n of [...attrs.keys()])if(!n.isConnected)attrs.delete(n);for(const n of [...texts.keys()])if(!n.isConnected)texts.delete(n);if(body.getAttribute(M)!=='v1')body.setAttribute(M,'v1');
 const table=root.querySelector('#table-container .tabulator');const cols=table?[...table.querySelectorAll('.tabulator-headers .tabulator-col')]:[];
 const kinds=cols.map(kind);const ok=kinds.includes('name');body.setAttribute('data-ari-clients-cols',cols.length?(ok?'tidy':'unknown'):'none');
 if(ok){const byField=new Map();cols.forEach((c,i)=>{setAttr(c,C,kinds[i]);relabel(c,kinds[i]);const f=c.getAttribute('tabulator-field');if(f)byField.set(f,kinds[i]);else if(kinds[i]==='select')byField.set('',kinds[i]);});
  table.querySelectorAll('.tabulator-row .tabulator-cell').forEach(cell=>{const f=cell.getAttribute('tabulator-field');let k=f!==null&&byField.has(f)?byField.get(f):null;
   if(k===null&&(cell.classList.contains('tabulator-row-handle')||cell.querySelector(':scope>input[type="checkbox"]')))k='select';if(k&&cell.getAttribute(C)!==k)setAttr(cell,C,k);if(k==='phone'||k==='email'||k==='birthday'||k==='zodiac'){const em=norm(cell.textContent)?'0':'1';if(cell.getAttribute('data-ari-empty')!==em)setAttr(cell,'data-ari-empty',em);}});}
 const s=root.querySelector('input#list-view-record-search');if(s){if(/search/i.test(s.getAttribute('placeholder')||'')&&s.getAttribute('placeholder')!=='Search customers')setAttr(s,'placeholder','Search customers');if(s.getAttribute('aria-label')!=='Search customers')setAttr(s,'aria-label','Search customers');}
 root.querySelectorAll('button,[role="button"],a.hr-button,.n-button').forEach(b=>{if(b.id==='add-contact-btn'||b.closest('#table-container .tabulator-row')||b.closest('.tabulator-footer')||b.closest('.search-box'))return;
  const words=norm([b.getAttribute('aria-label'),b.getAttribute('title'),b.getAttribute('data-tooltip'),b.children.length>3?'':b.textContent].join(' '));if(words&&CLUTTER.test(words))hide(b);});}
function schedule(){if(!stopped&&frame===null)frame=w.requestAnimationFrame(reconcile);}
const obs=new w.MutationObserver(schedule);obs.observe(d.documentElement,{childList:true,subtree:true});const timer=w.setInterval(()=>{if(last!==w.location.href)schedule();},200);
w[K]={reconcile:schedule,stop(){stopped=true;obs.disconnect();w.clearInterval(timer);if(frame!==null)w.cancelAnimationFrame(frame);restore();delete w[K];},get status(){return{active:!!body,emptyCells:d.querySelectorAll('[data-ari-empty="1"]').length,cols:body?body.getAttribute('data-ari-clients-cols'):null,hiddenButtons:marked.size};}};
reconcile();
})(window,document);
/* ARI Clients list (fix6f). The Clients page opens the shared "Clients" smart list (Birthday and Zodiac sign columns) instead of
   the platform's "All" list. ARI_CLIENTS_LIST maps this location to that list; the new-psychic kit adds a line per location.
   The sidebar Clients link and any in-app move to smart_list/All go to the list (same page, no reload). If the list cannot be
   opened (no table after 9 s, or a "not found / no access" message), it goes back to All for the rest of this browser session.
   Nothing is saved or changed in the account; __ariClientsListV1.off() uses All for this session, .on() goes back to the list. */
(function(w,d){'use strict';
var ARI_CLIENTS_LIST={'8otTGBxdVFDsQ1gNhDg0':'QwWXS455gH3irU8rntds'};
var K='__ariClientsListV1',FB='ari-clients-list-fallback',WAIT=9000;if(w[K])return;
var bounce=0,landed=null,why=null,timer=null,lastMove=0;
function parse(path){var m=/^\/v2\/location\/([A-Za-z0-9]+)\/contacts\/smart_list\/([A-Za-z0-9_-]+)\/?$/.exec(path||'');return m?{loc:m[1],list:m[2]}:null;}
function off(){try{return w.sessionStorage.getItem(FB)==='1';}catch(e){return false;}}
function setOff(v,reason){try{if(v)w.sessionStorage.setItem(FB,'1');else w.sessionStorage.removeItem(FB);}catch(e){}why=v?reason:null;}
function listPath(loc,id){return '/v2/location/'+loc+'/contacts/smart_list/'+id;}
function router(){var a=d.getElementById('app'),app=a&&a.__vue_app__,g=app&&app.config&&app.config.globalProperties,r=g&&g.$router;return r&&typeof r.push==='function'?r:null;}
function go(path,replace){lastMove=performance.now();var r=router();if(r){try{var p=r[replace?'replace':'push'](path);if(p&&p.catch)p.catch(function(){});return 'router';}catch(e){}}
 try{w.history[replace?'replaceState':'pushState'](w.history.state,'',path);w.dispatchEvent(new PopStateEvent('popstate',{state:w.history.state}));return 'history';}catch(e){w.location.assign(path);return 'reload';}}
function ok(root){var t=root&&root.querySelector('#table-container .tabulator');return !!t&&!!(t.querySelector('.tabulator-row,.tabulator-placeholder'));}
function denied(root){var s=((root||d.body).textContent||'').replace(/\s+/g,' ');return /smart ?list (was )?not found|list (does not|doesn't) exist|no access to this (smart )?list|(don't|do not) have (access|permission)/i.test(s);}
function tick(){var p=parse(w.location.pathname);if(!p){landed=null;return;}var id=ARI_CLIENTS_LIST[p.loc];if(!id)return;
 if(/^all$/i.test(p.list)){landed=null;if(off())return;if(bounce>=2){setOff(true,'the platform kept sending the page back to All');return;}
  if(performance.now()-lastMove<1500)bounce++;go(listPath(p.loc,id),true);return;}
 if(p.list!==id)return;var root=d.getElementById('crm-contacts-view');
 if(ok(root)){landed=null;bounce=0;return;}
 if(landed===null)landed=performance.now();
 if(denied(root)||performance.now()-landed>WAIT){setOff(true,denied(root)?'list not accessible':'no table after '+(WAIT/1000)+' s');landed=null;go(listPath(p.loc,'All'),true);}}
function onClick(e){if(off()||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a||(a.target&&a.target!=='_self'))return;
 var u;try{u=new w.URL(a.href,w.location.href);}catch(_){return;}if(u.origin!==w.location.origin)return;var p=parse(u.pathname);if(!p||!/^all$/i.test(p.list)||!ARI_CLIENTS_LIST[p.loc])return;
 e.preventDefault();e.stopImmediatePropagation();go(listPath(p.loc,ARI_CLIENTS_LIST[p.loc]),false);}
d.addEventListener('click',onClick,true);timer=w.setInterval(tick,250);w.addEventListener('popstate',function(){setTimeout(tick,0);});tick();
w[K]={lists:ARI_CLIENTS_LIST,tick:tick,off:function(){setOff(true,'turned off by hand');var p=parse(w.location.pathname);if(p&&ARI_CLIENTS_LIST[p.loc]&&p.list===ARI_CLIENTS_LIST[p.loc])go(listPath(p.loc,'All'),false);},
 on:function(){setOff(false);bounce=0;tick();},stop:function(){w.clearInterval(timer);d.removeEventListener('click',onClick,true);delete w[K];},
 get status(){var p=parse(w.location.pathname);return {listId:p?ARI_CLIENTS_LIST[p.loc]||null:null,onList:!!p&&ARI_CLIENTS_LIST[p.loc]===p.list,usingAll:off(),why:why||(off()?'set earlier this session':null),via:router()?'router':'history'};}};
})(window,document);

}catch(e){console.warn("ari block 44",e)}
try{

(function(w,d){'use strict';var K='__ariHeaderTidyV1';if(w[K])return;var ro=w.ResizeObserver?new w.ResizeObserver(function(){head();}):null;var H='data-ari-platform-hide',G='data-ari-ghost',PILL=/^(what'?s new|contact updates?|new updates?)$/i,marked=new Set(),timer=null;
function words(e){return (e.textContent||'').replace(/\s+/g,' ').trim();}
function visible(e){var r=e.getBoundingClientRect();return r.width>=1&&r.height>=1;}
function head(){var h=d.querySelector('header.hl_header'),root=d.documentElement,on=!!h&&/\/calendars\/view/.test(w.location.pathname)&&w.innerWidth<=760;if(!on){if(root.style.getPropertyValue('--ari-cal-head'))root.style.removeProperty('--ari-cal-head');return;}var b=Math.ceil(h.getBoundingClientRect().bottom);if(b>40&&b<400){var v=b+'px';if(root.style.getPropertyValue('--ari-cal-head')!==v)root.style.setProperty('--ari-cal-head',v);}if(w.ResizeObserver&&ro&&!h.__ariHeadRO){h.__ariHeadRO=1;ro.observe(h);}}
function run(){if(!/^\/v2\/location\/[A-Za-z0-9]+(\/|$)/.test(w.location.pathname))return;head();var host=d.querySelector('header.hl_header .hl_header--controls');if(!host)return;
 var c=host.querySelectorAll('button,a,[role="button"],span,div');for(var i=0;i<c.length;i++){var e=c[i];if(e.childElementCount>4||e.hasAttribute(H)||e.closest('[data-ari-platform-hide]'))continue;
  if(PILL.test(words(e))&&!e.closest('#ari-topbar-ask,#ari-persistent-music-toggle,#recent_activities-toggle,.hl_header--avatar')){var box=e;
   while(box.parentElement&&box.parentElement!==host&&box.parentElement.getBoundingClientRect().width<360&&!box.parentElement.querySelector('#ari-topbar-ask,#ari-persistent-music-toggle,#recent_activities-toggle,.hl_header--avatar'))box=box.parentElement;
   box.setAttribute(H,'');marked.add(box);}}
 var row=d.querySelector('header.hl_header > .container-fluid > .hl_header--controls');if(!row)return;
 for(var j=0;j<row.children.length;j++){var k=row.children[j];if(k.hasAttribute(H))continue;var cs=w.getComputedStyle(k);if(cs.display==='none')continue;
  var has=false,all=k.querySelectorAll('*');for(var q=0;q<all.length&&!has;q++)if(visible(all[q]))has=true;
  if(k.hasAttribute(G)){if(has)k.removeAttribute(G);}else if(!has&&k.getBoundingClientRect().width<1&&!k.matches('#ari-topbar-ask,#ari-persistent-music-toggle,#recent_activities-toggle,.hl_header--avatar'))k.setAttribute(G,'1');}}
timer=w.setInterval(run,1000);w.addEventListener('resize',head);run();
w[K]={run:run,stop:function(){w.clearInterval(timer);w.removeEventListener('resize',head);if(ro)ro.disconnect();d.documentElement.style.removeProperty('--ari-cal-head');marked.forEach(function(e){e.removeAttribute(H);});marked.clear();var g=d.querySelectorAll('['+G+']');for(var i=0;i<g.length;i++)g[i].removeAttribute(G);delete w[K];},
 get status(){return{calHead:d.documentElement.style.getPropertyValue('--ari-cal-head')||null,pillsHidden:marked.size,ghosts:d.querySelectorAll('['+G+']').length};}};
})(window,document);

}catch(e){console.warn("ari block 45",e)}
try{

(function(w,d){'use strict';var K='__ariTidy7V1';if(w[K]){w[K].sync();return;}
var B='/v2/location/'+window.__ariLOC+'/',PHONE=w.matchMedia('(max-width:760px)');
var owned=new Set(),frame=null,timer=null,obs=null,stopped=false,lastAdd=0,infoBtn=null;
function on(){return w.location.pathname.indexOf(B)===0;}
function path(){return w.location.pathname.slice(B.length);}
function norm(t){return String(t||'').replace(/[\u00a0\s]+/g,' ').replace(/\s*\*\s*$/,'').trim();}
function vis(e){return !!e&&!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length);}
function mark(e,a,v){if(e.getAttribute(a)!==v)e.setAttribute(a,v);owned.add(e);}
function unmarkAll(a){var n=d.querySelectorAll('['+a+']');for(var i=0;i<n.length;i++)n[i].removeAttribute(a);}
function flag(a,v){var b=d.body;if(!b)return;if(v){if(b.getAttribute(a)!==v)b.setAttribute(a,v);}else if(b.hasAttribute(a))b.removeAttribute(a);}
/* ---------- (1) Clients list ---------- */
var SIGNS={aries:'\u2648',taurus:'\u2649',gemini:'\u264A',cancer:'\u264B',leo:'\u264C',virgo:'\u264D',libra:'\u264E',scorpio:'\u264F',sagittarius:'\u2650',capricorn:'\u2651',aquarius:'\u2652',pisces:'\u2653'};
function clients(){var list=/^contacts\/smart_list\//.test(path());flag('data-ari-cl7',list?'v1':'');
 var fit=list&&PHONE.matches&&!!d.getElementById('crm-contacts-view');flag('data-ari-cl7-fit',fit?'v1':'');if(fit)d.documentElement.setAttribute('data-ari-cl7-fit','v1');else d.documentElement.removeAttribute('data-ari-cl7-fit');
 var freed=d.querySelectorAll('[data-ari-cl7-free]'),i;
 if(!fit){for(i=0;i<freed.length;i++)freed[i].removeAttribute('data-ari-cl7-free');}
 else{var v=d.getElementById('crm-contacts-view');for(var e=v.parentElement;e&&e!==d.body&&e!==d.documentElement;e=e.parentElement){if(e.hasAttribute('data-ari-cl7-free'))continue;
   var cs=w.getComputedStyle(e),clip=/(hidden|clip)/.test(cs.overflowY),box=/(auto|scroll)/.test(cs.overflowY)&&e.scrollHeight>e.clientHeight+1;if(cs.position!=='fixed'&&(clip||box))mark(e,'data-ari-cl7-free','1');}}
 if(!list)return;var z=d.querySelectorAll('#table-container .tabulator-cell[data-ari-col="zodiac"]');
 for(i=0;i<z.length;i++){var g=SIGNS[norm(z[i].textContent).toLowerCase()]||'';if(g){mark(z[i],'data-ari-glyph',g+'\uFE0E');}else if(z[i].hasAttribute('data-ari-glyph'))z[i].removeAttribute('data-ari-glyph');}}
/* ---------- (2) Add client drawer ---------- */
var KEEP=[[/^first ?name$/i,'First name'],[/^last ?name$/i,'Last name'],[/^(phone|phone number|mobile|mobile phone)$/i,'Phone'],[/^(email|email address)$/i,'Email'],[/^(date of birth|birthday|birth date|dob)$/i,'Birthday'],[/^(notes?|description)$/i,'Notes']];
var LABEL_SEL='label,.n-form-item-label,.hr-form-item-label,[class*="form-item-label"],[class*="field-label"]';
function labelText(l){var t=l.querySelector('.n-form-item-label__text,.hr-form-item-label__text');return norm((t||l).textContent);}
function rowOf(l,root){var r=l.closest('.n-form-item,.hr-form-item,.form-group,[class*="form-item"]:not([class*="label"])');if(r&&root.contains(r)&&r!==root)return r;
 var e=l;while(e.parentElement&&e.parentElement!==root&&e.parentElement.querySelectorAll(LABEL_SEL).length===1)e=e.parentElement;return e;}
function drawers(){var c=d.querySelectorAll('.n-drawer,.hr-drawer,[role="dialog"]'),out=[];for(var i=0;i<c.length;i++){var x=c[i];if(!vis(x)||out.some(function(o){return o.contains(x);}))continue;
  var ls=x.querySelectorAll(LABEL_SEL),f=false,l=false;for(var j=0;j<ls.length;j++){var t=labelText(ls[j]);if(/^first ?name$/i.test(t))f=true;if(/^last ?name$/i.test(t))l=true;}
  if(!f||!l)continue;var title=norm((x.querySelector('.n-drawer-header__main,.hr-drawer-header__main,[class*="drawer-header"] [class*="title"],h1,h2,h3')||{}).textContent);
  if(/^(add|create)( a)?( new)? (contact|client|customer|record)$/i.test(title)||x.hasAttribute('data-ari-ac')||Date.now()-lastAdd<8000)out.push(x);}return out;}
function emptyRequired(el){var req=el.querySelectorAll('[required],[aria-required="true"],.n-form-item--required,.hr-form-item--required,.n-form-item-label__asterisk,.hr-form-item-label__asterisk');
 if(!req.length)return false;
 var ins=el.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]),textarea,select');if(!ins.length)return true;
 for(var i=0;i<ins.length;i++)if(!String(ins[i].value||'').trim())return true;return false;}
function drawer(x){mark(x,'data-ari-ac','v1');var m=x.parentElement&&x.parentElement.querySelector(':scope>.n-drawer-mask,:scope>[class*="mask"]');if(m)mark(m,'data-ari-ac-mask','v1');
 var keep=[];var ls=x.querySelectorAll(LABEL_SEL);for(var i=0;i<ls.length;i++){var t=labelText(ls[i]);for(var k=0;k<KEEP.length;k++)if(KEEP[k][0].test(t)){var r=rowOf(ls[i],x);if(keep.indexOf(r)<0){keep.push(r);mark(r,'data-ari-ac-row',KEEP[k][1]);mark(ls[i],'data-ari-ac-label','1');
     var tt=ls[i].querySelector('.n-form-item-label__text,.hr-form-item-label__text')||ls[i];if(tt.childElementCount===0&&tt.textContent!==KEEP[k][1])tt.textContent=KEEP[k][1];}break;}}
 if(keep.length<2)return;
 var hd=x.querySelector('.n-drawer-header,.hr-drawer-header,[class*="drawer-header"]');if(hd){keep.push(hd);mark(hd,'data-ari-ac-part','header');var ti=hd.querySelector('.n-drawer-header__main,.hr-drawer-header__main,[class*="title"]')||hd.firstElementChild;if(ti){mark(ti,'data-ari-ac-part','title');var tx=ti.childElementCount===0?ti:null;if(!tx){var tc=ti.querySelectorAll('p,span,h1,h2,h3,h4,div');for(var q=0;q<tc.length;q++)if(tc[q].childElementCount===0&&/^(add|create)( a)?( new)? (contact|client|customer|record)$/i.test(norm(tc[q].textContent))){tx=tc[q];break;}}if(tx&&tx.textContent!=='New customer')tx.textContent='New customer';}}
 var bt=x.querySelectorAll('button,[role="button"]');for(i=0;i<bt.length;i++){var bx=norm(bt[i].textContent)||norm(bt[i].getAttribute('aria-label'));var kind=/^(save|save client|save customer|add|create)$/i.test(bx)?'save':/^cancel$/i.test(bx)?'cancel':/^(close|×|✕)$/i.test(bx)||bt[i].matches('.n-base-close,[class*="close"]')?'close':'';
   if(kind){mark(bt[i],'data-ari-ac-btn',kind);if(!hd||!hd.contains(bt[i]))keep.push(bt[i]);if(kind==='save'&&!bt[i].__ari7){bt[i].__ari7=1;bt[i].addEventListener('click',function(){w.setTimeout(function(){reveal(x);},450);w.setTimeout(function(){reveal(x);},1200);},true);}}}
 var ft=x.querySelector('.n-drawer-footer,.hr-drawer-footer,[class*="drawer-footer"]');if(ft)mark(ft,'data-ari-ac-part','footer');
 var bd=x.querySelector('.n-drawer-body,.hr-drawer-body,[class*="drawer-body"]');if(bd)mark(bd,'data-ari-ac-part','body');
 /* inside a kept row, hide only "+ Add phone/email" extras */
 keep.forEach(function(r){if(!r.hasAttribute('data-ari-ac-row'))return;var b=r.querySelectorAll('button,[role="button"]');for(var j=0;j<b.length;j++)if(/^\+?\s*add (another )?(phone|email)/i.test(norm(b[j].textContent)))mark(b[j],'data-ari-ac-hide','extra');var ex=r.querySelectorAll('[id^="add-email"],[id^="add-phone"],.add-email-btn,.add-phone-btn');for(j=0;j<ex.length;j++)if(/^\+?\s*add (another )?(phone|email)/i.test(norm(ex[j].textContent)))mark(ex[j],'data-ari-ac-hide','extra');});
 prune(x,keep);}
function prune(node,keep){var kids=node.children;for(var i=0;i<kids.length;i++){var c=kids[i];if(c.tagName==='STYLE'||c.tagName==='SCRIPT')continue;
  if(keep.indexOf(c)>=0){if(c.getAttribute('data-ari-ac-hide')==='1')c.removeAttribute('data-ari-ac-hide');continue;}
  var has=false;for(var k=0;k<keep.length;k++)if(c.contains(keep[k])){has=true;break;}
  if(has){if(c.getAttribute('data-ari-ac-hide')==='1')c.removeAttribute('data-ari-ac-hide');prune(c,keep);continue;}
  if(c.hasAttribute('data-ari-ac-reveal'))continue;
  if(c.matches('.n-drawer-mask,[class*="mask"]'))continue;
  if(emptyRequired(c)){mark(c,'data-ari-ac-reveal','required');plain(c);if(c.getAttribute('data-ari-ac-hide')==='1')c.removeAttribute('data-ari-ac-hide');continue;}
  mark(c,'data-ari-ac-hide','1');}}
function plain(el){var ls=el.querySelectorAll(LABEL_SEL);for(var i=0;i<ls.length;i++){var t=ls[i].querySelector('.n-form-item-label__text,.hr-form-item-label__text')||ls[i];if(t.childElementCount===0&&/^contact\s+/i.test(t.textContent.trim()))t.textContent=t.textContent.trim().replace(/^contact\s+/i,'').replace(/^./,function(m){return m.toUpperCase();});}}
function reveal(x){var h=x.querySelectorAll('[data-ari-ac-hide="1"]');for(var i=0;i<h.length;i++){var err=h[i].querySelector('.n-form-item-feedback--error,.hr-form-item-feedback--error,[class*="feedback"] [class*="error"],[class*="error-message"],[role="alert"],.n-form-item--error,.hr-form-item--error');
  if(err&&norm(err.textContent)!==''||h[i].matches('.n-form-item--error,.hr-form-item--error')){h[i].removeAttribute('data-ari-ac-hide');mark(h[i],'data-ari-ac-reveal','error');plain(h[i]);}}}
function addClient(){var x=drawers();for(var i=0;i<x.length;i++){try{drawer(x[i]);}catch(e){}}}
/* ---------- (3) Calendar ---------- */
var CAL_TXT=/^(manage view|settings|calendar settings|calendars settings)$/i;
function calendar(){if(!/^calendars\//.test(path()))return;var c=d.querySelectorAll('#calendar-page-parent-container button,#calendar-page-parent-container a,#CalendarPage button,#CalendarPage a,header.hl_header .topmenu-nav a,.n-dropdown-option,[role="menuitem"]');
 for(var i=0;i<c.length;i++){var e=c[i];if(e.closest('#sidebar-v2'))continue;var t=norm(e.textContent).replace(/^[^A-Za-z]+/,''),al=norm(e.getAttribute('aria-label')),ti=norm(e.getAttribute('title'));var h=e.getAttribute('href')||'';
  if(e.id==='customizations-button'||/^(calendar-)?settings(-button)?$/i.test(e.id||'')||CAL_TXT.test(t)||CAL_TXT.test(al)||CAL_TXT.test(ti)||/\/settings\/calendars/.test(h))mark(e,'data-ari-cal7-hide','1');}}
/* ---------- (4) Messages ---------- */
function messages(){var here=/^conversations\//.test(path())&&!!d.getElementById('conversations-layout');flag('data-ari-msg7',here?'v1':'');if(!here){if(infoBtn){infoBtn.remove();infoBtn=null;}flag('data-ari-msg7-info','');return;}
 var list=d.getElementById('conversations-list');if(list){var hs=list.querySelectorAll('h1,h2,h3,p,span,div');for(var i=0;i<hs.length;i++){var e=hs[i];if(e.childElementCount>1)continue;var t=norm(e.textContent);
   if(/^(team inbox|my inbox|inbox|unassigned)$/i.test(t))mark(e,'data-ari-msg7-hide','1');}
  var tabs=list.querySelectorAll('[aria-label^="Unread"],[aria-label="All"],[aria-label^="All,"]');for(i=0;i<tabs.length;i++){var n=tabs[i].querySelectorAll('span,div');for(var j=0;j<n.length;j++)if(n[j].childElementCount===0&&/^\d[\d,+]*$/.test(norm(n[j].textContent)))mark(n[j],'data-ari-msg7-hide','count');}}
 /* platform update pills in the chat ("Name updated · Details", tag/owner changes) */
 var det=d.querySelectorAll('#conversations-layout [role="button"]');for(i=0;i<det.length;i++){if(norm(det[i].textContent)!=='Details')continue;if(det[i].closest('#conversations-right-column'))continue;/* chatsfix1: never hide inside Customer info */var row=det[i].parentElement;if(!row)continue;var tx=norm(row.textContent);
   if(!/(updated|created|added|removed|assigned|merged|changed|deleted)/i.test(tx)||row.querySelector('.chat-bubble-inbound,.chat-bubble-outbound'))continue;var top=row;for(var u=0;u<4&&top.parentElement&&norm(top.parentElement.textContent).length<140&&!top.parentElement.querySelector('.chat-bubble-inbound,.chat-bubble-outbound');u++)top=top.parentElement;mark(top,'data-ari-msg7-hide','update');}
 var rc=d.getElementById('conversations-right-column'),lay=d.getElementById('conversations-layout');
 if(rc&&lay){mark(rc,'data-ari-msg7-panel','1');var heads=rc.querySelectorAll('p,h2,h3,span');for(i=0;i<heads.length;i++)if(heads[i].childElementCount===0&&/^contact details$/i.test(norm(heads[i].textContent)))heads[i].textContent='Customer info';
  if(!infoBtn||!infoBtn.isConnected){infoBtn=d.getElementById('ari-msg7-info')||d.createElement('button');infoBtn.id='ari-msg7-info';infoBtn.type='button';infoBtn.setAttribute('aria-expanded','false');
   infoBtn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c1-3.6 3.8-5.5 7-5.5s6 1.9 7 5.5"/></svg><span>Customer info</span>';
   infoBtn.addEventListener('click',function(){var open=d.body.getAttribute('data-ari-msg7-info')!=='open';flag('data-ari-msg7-info',open?'open':'');infoBtn.setAttribute('aria-expanded',String(open));});lay.appendChild(infoBtn);}
  var close=rc.querySelector('#close-panel-button');if(close&&!close.__ari7){close.__ari7=1;close.addEventListener('click',function(){flag('data-ari-msg7-info','');if(infoBtn)infoBtn.setAttribute('aria-expanded','false');});}}}
/* ---------- (5) Home ---------- */
function home(){var el=d.querySelector('#ari-owner-preview [data-ari-today]');if(!el)return;var t;try{t=new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});}catch(_){t='';}if(t&&el.textContent!==t)el.textContent=t;}
function sync(){frame=null;if(stopped)return;if(!on()||!d.body){clear();return;}try{clients();}catch(e){}try{addClient();}catch(e){}try{calendar();}catch(e){}try{messages();}catch(e){}try{home();}catch(e){}}
function clear(){['data-ari-cl7','data-ari-cl7-fit','data-ari-msg7','data-ari-msg7-info'].forEach(function(a){flag(a,'');});d.documentElement.removeAttribute('data-ari-cl7-fit');['data-ari-cl7-free','data-ari-cal7-hide','data-ari-msg7-hide','data-ari-msg7-panel'].forEach(unmarkAll);if(infoBtn){infoBtn.remove();infoBtn=null;}}
var t7=0;function queue(){if(stopped||frame!==null)return;var wait=Math.max(0,200-(Date.now()-t7));frame=w.setTimeout(function(){w.requestAnimationFrame(function(){t7=Date.now();sync();});},wait);}/* chatsfix3 */
function click(e){if(e.target&&e.target.closest&&e.target.closest('#add-contact-btn,[data-ari-add-client]'))lastAdd=Date.now();}
w[K]={sync:sync,stop:function(){stopped=true;if(frame!==null){w.cancelAnimationFrame(frame);w.clearTimeout(frame);}if(timer!==null)w.clearInterval(timer);if(obs)obs.disconnect();d.removeEventListener('click',click,true);clear();
  ['data-ari-ac','data-ari-ac-mask','data-ari-ac-row','data-ari-ac-label','data-ari-ac-part','data-ari-ac-btn','data-ari-ac-hide','data-ari-ac-reveal','data-ari-glyph'].forEach(unmarkAll);delete w[K];},
 get status(){return{clients:d.body&&d.body.getAttribute('data-ari-cl7'),phoneFit:d.body&&d.body.getAttribute('data-ari-cl7-fit'),freed:d.querySelectorAll('[data-ari-cl7-free]').length,drawer:d.querySelectorAll('[data-ari-ac="v1"]').length,drawerRows:Array.prototype.map.call(d.querySelectorAll('[data-ari-ac-row]'),function(r){return r.getAttribute('data-ari-ac-row');}),drawerHidden:d.querySelectorAll('[data-ari-ac-hide="1"]').length,keptRequired:d.querySelectorAll('[data-ari-ac-reveal]').length,calHidden:d.querySelectorAll('[data-ari-cal7-hide]').length,msg:d.body&&d.body.getAttribute('data-ari-msg7'),msgHidden:d.querySelectorAll('[data-ari-msg7-hide]').length};}};
d.addEventListener('click',click,true);
if(PHONE.addEventListener)PHONE.addEventListener('change',queue);
timer=w.setInterval(queue,700);
function watch(){if(!d.body)return w.setTimeout(watch,50);obs=new w.MutationObserver(queue);obs.observe(d.body,{childList:true,subtree:true});queue();}
watch();})(window,document);

}catch(e){console.warn("ari block 46",e)}
try{

(function(w,d){'use strict';var K='__ariCal8V1';if(w[K]){w[K].sync();return;}
var B='/v2/location/'+window.__ariLOC+'/calendars/view',frame=null,obs=null,timer=null,stopped=false,last='';
var RX={day:/^\s*day(\s+view)?\s*$/i,week:/^\s*week(\s+view)?\s*$/i,month:/^\s*month(\s+view)?\s*$/i};
var SKIP='.fc,#ari-cal-bar,#ari-ag,#ari-cal-seg';
function on(){return w.location.pathname.indexOf(B)===0;}
function press(e){['pointerdown','mousedown','pointerup','mouseup','click'].forEach(function(t){e.dispatchEvent(new MouseEvent(t,{bubbles:true,cancelable:true,view:w}));});}
function arr(n){return Array.prototype.slice.call(n||[]);}
function opt(m){return arr(d.querySelectorAll('[role="option"],.n-base-select-option,.hr-base-select-option,.n-dropdown-option,.hr-dropdown-option,[role="menuitem"]')).filter(function(o){return !o.closest(SKIP)&&RX[m].test(o.textContent||'');})[0]||null;}
function radio(m){var box=d.getElementById('calendar-page-parent-container');if(!box)return null;return arr(box.querySelectorAll('[role="radio"],[role="tab"],button')).filter(function(b){return !b.closest(SKIP)&&RX[m].test(b.textContent||'');})[0]||null;}
function ghlView(m){var r=radio(m);if(r){press(r);return;}var o=opt(m);if(o){press(o);return;}var s=d.getElementById('view-select');if(!s)return;
 d.body.setAttribute('data-ari-cal8-busy','1');press(s.querySelector('.n-base-selection,.hr-base-selection,[role="combobox"]')||s);
 w.setTimeout(function(){var o2=opt(m);if(o2)press(o2);else d.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));w.setTimeout(function(){d.body.removeAttribute('data-ari-cal8-busy');queue();},250);},250);}
function state(){var b=d.body;return b.getAttribute('data-ari-cal-view')==='agenda'?'agenda':(b.getAttribute('data-ari-cal-mode')||'');}
function choose(v){var A=w.__ariCalendarV1,b=d.body,grid=b.getAttribute('data-ari-cal-view')==='grid';
 if(v==='agenda'){autoDone=false;if(A&&A.setView)A.setView('agenda');if(b.getAttribute('data-ari-cal-mode')!=='month')w.setTimeout(function(){ghlView('month');},120);queue();return;}
 autoDone=true;if(!grid&&A&&A.setView)A.setView('grid');if(b.getAttribute('data-ari-cal-mode')!==v)w.setTimeout(function(){ghlView(v);},grid?0:120);queue();}
function cset(){try{return (w.getComputedStyle(d.body).getPropertyValue('--ari-cal8-set')||'').replace(/["'\s]/g,'');}catch(e){return '';}}
var SETS={'':[['agenda','Agenda'],['day','Day'],['week','Week'],['month','Month']],c3:[['agenda','Month'],['week','Week'],['day','Day']]};
function build(set){var g=d.createElement('div');g.id='ari-cal-seg';g.setAttribute('data-set',set);g.setAttribute('role','group');g.setAttribute('aria-label','Calendar view');
 (SETS[set]||SETS['']).forEach(function(p){var x=d.createElement('button');x.type='button';x.setAttribute('data-v',p[0]);x.textContent=p[1];
  x.addEventListener('click',function(){choose(p[0]);});g.appendChild(x);});return g;}
function place(){var t=d.getElementById('today-button'),n=d.getElementById('new-appointment-button');if(!t||!n)return null;
 var row=t.parentElement;while(row&&!row.contains(n))row=row.parentElement;if(!row||row===d.body)return null;
 var right=n;while(right.parentElement&&right.parentElement!==row)right=right.parentElement;if(right.parentElement!==row)return null;
 var set=cset(),g=d.getElementById('ari-cal-seg');if(g&&g.getAttribute('data-set')!==set){g.remove();g=null;}if(!g)g=build(set);if(right===n){if(g.nextElementSibling!==n||g.parentElement!==row)row.insertBefore(g,n);}else if(right.firstElementChild!==g)right.insertBefore(g,right.firstElementChild);return g;}
var SEP=/\s+[\u00b7|\-\u2013\u2014:]\s+|\s*[\u00b7|]\s*/;
function names(){if(d.body.getAttribute('data-ari-cal-mode')!=='month')return;arr(d.querySelectorAll('#calendar-page-parent-container .fc-daygrid-event .fc-event-title[data-ari-short]')).forEach(function(e){var ev=e.closest('.fc-event'),full=ev&&ev.title;if(!full||e.childElementCount)return;
 var h=String(full).replace(/\s+/g,' ').trim().split(SEP)[0]||'',sh=h.split(' ').filter(Boolean)[0]||h;if(!sh)return;if(e.textContent!==sh)e.textContent=sh;if(e.getAttribute('data-ari-short')!==sh)e.setAttribute('data-ari-short',sh);if(e.getAttribute('data-ari-full')!==full)e.setAttribute('data-ari-full',full);});}
var autoDone=false;
function dkey(dt){return dt.getFullYear()+'-'+('0'+(dt.getMonth()+1)).slice(-2)+'-'+('0'+dt.getDate()).slice(-2);}
function nice(k){try{return new Date(k+'T12:00:00').toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});}catch(e){return k;}}
function mk(tag,cls,txt){var e=d.createElement(tag);e.className='ari-c3-x '+cls;if(txt)e.textContent=txt;return e;}
function c3(){if(cset()!=='c3')return;var b=d.body,A=w.__ariCalendarV1;
 if(b.getAttribute('data-ari-cal-view')==='grid'&&b.getAttribute('data-ari-cal-mode')==='month'&&!autoDone&&!w.__ariCalFallback&&!b.hasAttribute('data-ari-cal8-busy')&&A&&A.setView){autoDone=true;A.setView('agenda');return;}
 if(b.getAttribute('data-ari-cal-view')!=='agenda')return;var ag=d.getElementById('ari-ag'),list=ag&&ag.querySelector('.ari-ag-list'),mini=ag&&ag.querySelector('.ari-ag-mini');if(!list||!mini)return;
 var days=arr(mini.querySelectorAll('.ari-ag-day')),idx=-1;for(var i=0;i<days.length;i++)if(days[i].classList.contains('is-sel')){idx=i;break;}
 if(idx<0)for(var j=0;j<days.length;j++)if(days[j].classList.contains('is-today')){idx=j;break;}
 var cells=arr(d.querySelectorAll('#calendar-page-parent-container .fc .fc-daygrid-day[data-date]')),key=(idx>=0&&cells.length===days.length&&cells[idx])?cells[idx].getAttribute('data-date'):'';
 var sig=(ag.getAttribute('data-sig')||'')+'|'+key;if(list.getAttribute('data-ari-c3')===sig&&list.querySelector('.ari-c3-x'))return;
 arr(list.querySelectorAll('.ari-c3-x')).forEach(function(n){n.remove();});arr(list.querySelectorAll('[data-ari-c3-sel]')).forEach(function(n){n.removeAttribute('data-ari-c3-sel');});
 list.setAttribute('data-ari-c3',sig);if(!key)return;
 var blocks=arr(list.querySelectorAll('.ari-ag-dayblock')),first=blocks[0]||null,has=!!(first&&first.getAttribute('data-date')===key);
 var head=mk('div','ari-c3-head');head.appendChild(mk('span','ari-c3-eyebrow',key===dkey(new Date())?'Today':'Selected day'));head.appendChild(mk('h3','ari-c3-title',nice(key)));
 list.insertBefore(head,list.firstChild);
 if(has)first.setAttribute('data-ari-c3-sel','1');else head.after(mk('p','ari-c3-none','No readings booked for this day.'));
 var rest=blocks.filter(function(x){return x.getAttribute('data-date')!==key;})[0];if(rest)list.insertBefore(mk('div','ari-c3-next','Coming up'),rest);}
/* C4.1 day pop-up: only when the calendar CSS sets --ari-cal8-pop:1. Lists the tapped day's readings from the Agenda's own cards; a row taps the original card (which opens the booking). */
var popEl=null,popFrom=null;
function popOn(){try{return (w.getComputedStyle(d.body).getPropertyValue('--ari-cal8-pop')||'').trim()==='1';}catch(e){return false;}}
function popClose(back){if(!popEl)return;popEl.remove();var bd=d.getElementById('ari-c4-pop-bd');if(bd)bd.remove();popEl=null;if(back&&popFrom&&popFrom.isConnected){try{popFrom.focus();}catch(e){}}popFrom=null;}
function popKey(day){var ag=d.getElementById('ari-ag'),days=arr(ag?ag.querySelectorAll('.ari-ag-mini .ari-ag-day'):[]),i=days.indexOf(day),cells=arr(d.querySelectorAll('#calendar-page-parent-container .fc .fc-daygrid-day[data-date]'));
 if(i>=0&&cells.length===days.length&&cells[i])return cells[i].getAttribute('data-date');var t=day.getAttribute('aria-label')||'';var m=Date.parse(t.replace(/^[A-Za-z]+,\s*/,'').replace(/,.*$/,'')+' '+(new Date()).getFullYear());return isNaN(m)?'':dkey(new Date(m));}
function popOpen(day){var key=popKey(day);if(!key)return;popClose(false);popFrom=day;
 var ag=d.getElementById('ari-ag'),blk=ag&&ag.querySelector('.ari-ag-list .ari-ag-dayblock[data-date="'+key+'"]'),cards=arr(blk?blk.querySelectorAll('.ari-ag-card'):[]);
 var p=d.createElement('div');p.id='ari-c4-pop';p.setAttribute('role','dialog');p.setAttribute('aria-modal','false');p.setAttribute('aria-label','Readings on '+nice(key));
 var hd=d.createElement('div');hd.className='ari-c4-pop-hd';var h=d.createElement('h3');h.textContent=nice(key);var x=d.createElement('button');x.type='button';x.className='ari-c4-pop-x';x.setAttribute('aria-label','Close');x.textContent='\u00d7';x.addEventListener('click',function(){popClose(true);});hd.appendChild(h);hd.appendChild(x);p.appendChild(hd);
 if(!cards.length){var e=d.createElement('p');e.className='ari-c4-pop-none';e.textContent='No readings booked for this day.';p.appendChild(e);}
 cards.forEach(function(c){var r=d.createElement('button');r.type='button';r.className='ari-c4-row'+(c.classList.contains('is-appt')?' is-appt':' is-ev');
  var tb=c.querySelector('.ari-ag-time b'),ts=c.querySelector('.ari-ag-time small'),nm=c.querySelector('.ari-ag-name'),sv=c.querySelector('.ari-ag-sub,.ari-ag-note'),tg=c.querySelector('.ari-ag-tag');
  var tm=d.createElement('span');tm.className='ari-c4-t';if(tb){var b1=d.createElement('b');b1.textContent=tb.textContent;tm.appendChild(b1);}if(ts){var s1=d.createElement('small');s1.textContent=ts.textContent;tm.appendChild(s1);}
  if(!tb&&tg){var s2=d.createElement('small');s2.textContent=tg.textContent;tm.appendChild(s2);}
  var bd=d.createElement('span');bd.className='ari-c4-b';var n=d.createElement('span');n.className='ari-c4-n';n.textContent=(nm||c.querySelector('h4,strong')||c).textContent.trim();bd.appendChild(n);
  if(sv){var s3=d.createElement('span');s3.className='ari-c4-s';s3.textContent=sv.textContent.trim();bd.appendChild(s3);}
  var ch=d.createElement('span');ch.className='ari-c4-c';ch.setAttribute('aria-hidden','true');ch.textContent='\u203a';
  r.appendChild(tm);r.appendChild(bd);r.appendChild(ch);r.setAttribute('aria-label',c.getAttribute('aria-label')||n.textContent);
  r.addEventListener('click',function(){popClose(false);c.click();});p.appendChild(r);});
 var phone=w.innerWidth<=760;if(phone){var bk=d.createElement('div');bk.id='ari-c4-pop-bd';bk.addEventListener('click',function(){popClose(true);});d.body.appendChild(bk);p.className='is-sheet';}
 d.body.appendChild(p);popEl=p;
 if(!phone){var rc=day.getBoundingClientRect(),pw=p.offsetWidth,ph=p.offsetHeight,l=Math.min(Math.max(12,rc.left+rc.width/2-pw/2),w.innerWidth-pw-12),t=rc.bottom+8;if(t+ph>w.innerHeight-12)t=Math.max(12,rc.top-ph-8);p.style.left=l+'px';p.style.top=t+'px';}
 try{x.focus({preventScroll:true});}catch(e){}}
d.addEventListener('click',function(ev){if(stopped||!on()||!popOn())return;var day=ev.target&&ev.target.closest&&ev.target.closest('#ari-ag .ari-ag-mini .ari-ag-day');if(!day||day.classList.contains('is-other'))return;
 w.setTimeout(function(){var ag=d.getElementById('ari-ag');var days=arr(ag?ag.querySelectorAll('.ari-ag-mini .ari-ag-day'):[]);var lbl=day.getAttribute('aria-label');var cur=day.isConnected?day:days.filter(function(x){return x.getAttribute('aria-label')===lbl;})[0];if(cur)popOpen(cur);},90);},true);
d.addEventListener('pointerdown',function(ev){if(!popEl)return;var t=ev.target;if(popEl.contains(t))return;if(t.closest&&t.closest('#ari-ag .ari-ag-mini .ari-ag-day'))return;popClose(false);},true);
d.addEventListener('keydown',function(ev){if(popEl&&ev.key==='Escape'){ev.stopPropagation();popClose(true);}},true);
w.addEventListener('resize',function(){popClose(false);});
function clear(){popClose(false);var g=d.getElementById('ari-cal-seg');if(g)g.remove();if(d.body){d.body.removeAttribute('data-ari-cal8');d.body.removeAttribute('data-ari-cal8-busy');}}
function sync(){frame=null;if(stopped)return;if(!d.body)return;if(!on()){clear();return;}
 if(d.body.getAttribute('data-ari-cal8')!=='v1')d.body.setAttribute('data-ari-cal8','v1');
 names();c3();if(popEl&&d.body.getAttribute('data-ari-cal-view')!=='agenda')popClose(false);var g=place();if(!g)return;var s=state();arr(g.children).forEach(function(x){var p=String(x.getAttribute('data-v')===s);if(x.getAttribute('aria-pressed')!==p)x.setAttribute('aria-pressed',p);});}
function queue(){if(!stopped&&frame===null)frame=w.requestAnimationFrame(sync);}
obs=new w.MutationObserver(function(){if(on()||d.getElementById('ari-cal-seg'))queue();});
obs.observe(d.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['data-ari-cal-view','data-ari-cal-mode']});
timer=w.setInterval(function(){if(last!==w.location.href){last=w.location.href;queue();}},300);w.addEventListener('popstate',queue);
w[K]={sync:queue,choose:choose,stop:function(){stopped=true;if(obs)obs.disconnect();w.clearInterval(timer);clear();},status:function(){var g=d.getElementById('ari-cal-seg');return {route:on(),seg:!!g,state:state(),viewSelect:!!d.getElementById('view-select')};}};
sync();})(window,document);

}catch(e){console.warn("ari block 47",e)}
try{

(function(w,d){'use strict';var K='__ariHome1V1';if(w[K]){w[K].sync();return;}
var LOC='/v2/location/'+window.__ariLOC+'/',HOME=LOC+'dashboard',FLAG='ari-home-add',frame=null,stopped=false,obs=null,tick=null;
function arr(n){return Array.prototype.slice.call(n||[]);}
function hset(){try{return (w.getComputedStyle(d.body).getPropertyValue('--ari-home-set')||'').replace(/["'\s]/g,'');}catch(e){return '';}}
function el(t,c,x){var e=d.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e;}
var SV={cal:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
 msg:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a7.5 7.5 0 0 1-11 6.6L4 20l1.4-4.6A7.5 7.5 0 1 1 20 12Z"/></svg>',
 ppl:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.6a3 3 0 0 1 0 5.8M17.5 14.2a5 5 0 0 1 3 4.8"/></svg>',
 plus:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
 star:'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="m12 2.8 1.9 5.6 5.6 1.9-5.6 1.9L12 17.8l-1.9-5.6-5.6-1.9 5.6-1.9Z"/><path d="m19 15 .8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8Z"/></svg>',
 cal2:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
 moon:'<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M15.5 3.5a8.5 8.5 0 1 0 5 15.3A7 7 0 0 1 15.5 3.5Z"/></svg>'};
function icon(k){var s=el('span','ari-h-svg');s.setAttribute('aria-hidden','true');s.innerHTML=SV[k];return s;}
function on(){return w.location.pathname===HOME;}
function src(){var p=d.getElementById('ari-owner-preview');if(!p)return null;var q=function(s){return p.querySelector(s);};
 return {root:p,home:q('.lx-home'),ask:q('.lx-cta[data-ari-ask-home-link]')||q('[data-ari-ask-home-link]'),cal:q('.lx-tile[href$="/calendars/view"]'),msg:q('.lx-tile[href$="/conversations/conversations"]'),
  cli:q('.lx-tile[href*="/contacts/smart_list/"]'),greet:q('[data-ari-greet]'),moon:q('[data-ari-moon]'),portrait:q('.lx-portrait')};}
function greet(s){var t=s.greet&&s.greet.textContent.trim();if(t&&t!=='Hello')return t;var h=new Date().getHours();return h>=5&&h<12?'Good morning':h>=12&&h<17?'Good afternoon':'Good evening';}
function phase(s){var t=(s.moon&&s.moon.textContent||'').split('\u00b7');return t.length>1?t[t.length-1].trim():'';}
function longDate(dt){return dt.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});}
function unread(){var a=d.getElementById('sb_conversations');if(!a)return null;var c=arr(a.querySelectorAll('[class*="badge"],[class*="count"],[class*="notification"],[class*="unread"]'));
 for(var i=0;i<c.length;i++){var t=(c[i].textContent||'').trim();if(/^\d{1,3}\+?$/.test(t)&&t!=='0'&&w.getComputedStyle(c[i]).visibility!=='hidden')return t;}return null;}
function extras(){var out=[];arr(d.querySelectorAll('#sidebar-v2 a[href]')).forEach(function(a){var t=((a.querySelector('.nav-title')||a).textContent||'').replace(/\s+/g,' ').trim();if(/^morning note$/i.test(t)||/^spiritual events$/i.test(t))out.push([t,a]);});return out;}
function press(a){if(a)a.click();}
function act(kind,s){if(kind==='add'){try{w.sessionStorage.setItem(FLAG,String(Date.now()));}catch(e){}press(s.cli);}else press(s[kind]);}
function btn(cls,label,kind,s,ic){var b=el('button',cls);b.type='button';if(ic)b.appendChild(icon(ic));b.appendChild(el('span','ari-h-bl',label));b.addEventListener('click',function(){act(kind,s);});return b;}
function week(s,light){var g=el('div','ari-h-week'+(light?' is-light':''));g.setAttribute('role','group');g.setAttribute('aria-label','This week');var t=new Date(),st=new Date(t.getFullYear(),t.getMonth(),t.getDate()-t.getDay());
 for(var i=0;i<7;i++){var x=new Date(st.getFullYear(),st.getMonth(),st.getDate()+i),b=el('button','ari-h-d'+(i===t.getDay()?' is-today':''));b.type='button';
  b.setAttribute('aria-label',(i===t.getDay()?'Today, ':'')+longDate(x)+'. Open your calendar');b.appendChild(el('span','ari-h-wd','SMTWTFS'.charAt(i)));b.appendChild(el('b','ari-h-dn',String(x.getDate())));
  b.addEventListener('click',function(){press(s.cal);});g.appendChild(b);}return g;}
function eyebrow(s){var p=el('p','ari-h-eyebrow');p.appendChild(icon('moon'));var ph=phase(s);p.appendChild(el('span','',longDate(new Date())+(ph?' \u00b7 '+ph:'')));return p;}
function h1(s){var h=el('h1','ari-h-title');h.appendChild(d.createTextNode(greet(s)+', '));h.appendChild(el('em','','welcome back'));return h;}
function actions(s){var n=el('nav','ari-h-actions');n.setAttribute('aria-label','Quick actions');
 n.appendChild(btn('ari-h-pill','Add customer','add',s,'plus'));if(s.ask)n.appendChild(btn('ari-h-pill','Ask Ari','ask',s,'star'));n.appendChild(btn('ari-h-pill','Open calendar','cal',s,'cal2'));return n;}
function todayLine(s,light){var r=el('div','ari-h-today');r.appendChild(el('span','ari-h-today-t','Your readings for today are in your calendar.'));var b=el('button','ari-h-link');b.type='button';b.appendChild(el('span','','Open today'));b.appendChild(el('span','ari-h-chev','\u203a'));b.addEventListener('click',function(){press(s.cal);});r.appendChild(b);return r;}
function more(s){var x=extras();if(!x.length)return null;var r=el('nav','ari-h-more');r.setAttribute('aria-label','More for today');x.forEach(function(p){var b=el('button','ari-h-link');b.type='button';b.appendChild(el('span','',p[0]));b.appendChild(el('span','ari-h-chev','\u203a'));b.addEventListener('click',function(){p[1].click();});r.appendChild(b);});return r;}
function buildH1(s){var root=el('div','ari-h is-h1');root.id='ari-h';
 var hero=el('section','ari-h-hero');hero.setAttribute('aria-label','Today');var main=el('div','ari-h-main');main.appendChild(eyebrow(s));main.appendChild(h1(s));
 var tb=el('div','ari-h-todaybox');tb.appendChild(el('p','ari-h-label','This week'));tb.appendChild(week(s,false));tb.appendChild(todayLine(s,false));main.appendChild(tb);hero.appendChild(main);
 if(s.portrait){var pc=s.portrait.cloneNode(true);pc.className='ari-h-portrait';hero.appendChild(pc);}root.appendChild(hero);root.appendChild(actions(s));
 var m=el('section','ari-h-msg');m.setAttribute('aria-label','Ari Chats');var ic=el('span','ari-h-coin');ic.appendChild(icon('msg'));m.appendChild(ic);var tx=el('div','ari-h-msg-t');tx.appendChild(el('h2','','Ari Chats'));var u=unread();
 tx.appendChild(el('p','',u?(u+' new message'+(u==='1'?'':'s')+' waiting for you.'):'Read and reply to your customers.'));m.appendChild(tx);var ob=el('button','ari-h-link');ob.type='button';ob.appendChild(el('span','','Open Ari Chats'));ob.appendChild(el('span','ari-h-chev','\u203a'));ob.addEventListener('click',function(){press(s.msg);});m.appendChild(ob);root.appendChild(m);
 var mo=more(s);if(mo)root.appendChild(mo);return root;}
function stat(cls,title,sub,num,ic,kind,s){var b=el('button','ari-h-stat '+cls);b.type='button';var c=el('span','ari-h-coin'+(num?' has-num':''));if(num)c.appendChild(el('b','',num));else c.appendChild(icon(ic));b.appendChild(c);
 var t=el('span','ari-h-stat-t');t.appendChild(el('strong','',title));t.appendChild(el('small','',sub));b.appendChild(t);b.appendChild(el('span','ari-h-chev','\u203a'));b.addEventListener('click',function(){act(kind,s);});return b;}
function buildH2(s){var root=el('div','ari-h is-h2');root.id='ari-h';var g=el('header','ari-h-greet');g.appendChild(eyebrow(s));g.appendChild(h1(s));g.appendChild(el('p','ari-h-sub','Here is your day at a glance.'));root.appendChild(g);
 var st=el('div','ari-h-stats');var u=unread();st.appendChild(stat('is-cal',"Today's readings",'Open your calendar',null,'cal','cal',s));st.appendChild(stat('is-msg',u?'New Ari chats':'Ari Chats',u?'Waiting for your reply':'Read and reply',u,'msg','msg',s));if(s.cli)st.appendChild(stat('is-cli','Customers','Find or add a customer',null,'ppl','cli',s));root.appendChild(st);
 var day=el('section','ari-h-day');day.setAttribute('aria-label',"Today's readings");var hd=el('div','ari-h-day-hd');hd.appendChild(el('h2','',"Today's readings"));hd.appendChild(el('span','',longDate(new Date())));day.appendChild(hd);day.appendChild(week(s,true));day.appendChild(todayLine(s,true));root.appendChild(day);
 root.appendChild(actions(s));var mo=more(s);if(mo)root.appendChild(mo);return root;}
function sig(s,set){return [set,greet(s),phase(s),new Date().toDateString(),unread(),extras().map(function(x){return x[0];}).join('|'),!!s.ask,!!s.cli,!!s.portrait].join('~');}
function addWatch(){var f=null;try{f=w.sessionStorage.getItem(FLAG);}catch(e){}if(!f)return;if(Date.now()-(+f)>20000){try{w.sessionStorage.removeItem(FLAG);}catch(e){}return;}
 if(!/\/contacts\/smart_list\//.test(w.location.pathname))return;var b=d.getElementById('add-contact-btn');if(b&&b.offsetParent!==null){try{w.sessionStorage.removeItem(FLAG);}catch(e){}b.click();}}
function x3(n){n.classList.add('ari-h3-x');return n;}
function h3(s){var hero=s.home.querySelector('.lx-hero'),upd=s.home.querySelector('.lx-update'),sg=sig(s,'h3');
 if(hero){var a=hero.querySelector('.ari-h3-actions');if(!a||a.getAttribute('data-sig')!==sg){var n=x3(actions(s));n.classList.add('ari-h3-actions');n.setAttribute('data-sig',sg);if(a)a.replaceWith(n);else{var cta=hero.querySelector('.lx-cta');if(cta)cta.after(n);else hero.appendChild(n);}}
  var dl=hero.querySelector('.lx-date'),ds=dl&&dl.querySelector('.ari-h3-date'),txt=longDate(new Date())+(phase(s)?' \u00b7 '+phase(s):'');if(dl&&(!ds||ds.textContent!==txt)){var sp=x3(el('span','ari-h3-date',txt));if(ds)ds.replaceWith(sp);else dl.appendChild(sp);}}
 if(upd){var wk=upd.querySelector('.ari-h3-week');if(!wk||wk.getAttribute('data-sig')!==sg){var box=x3(el('div','ari-h3-week'));box.setAttribute('data-sig',sg);box.appendChild(el('p','ari-h3-label','This week'));box.appendChild(week(s,true));var row=upd.querySelector('.lx-row');if(wk)wk.replaceWith(box);else if(row)row.before(box);else upd.appendChild(box);}}}
function sb(id,f){var a=d.getElementById(id);return a&&a.tagName==='A'?a:(a&&a.querySelector('a'))||f;}
function actions31(s){var n=el('nav','ari-h-actions ari-h3-actions ari-h31-actions');n.setAttribute('aria-label','Quick actions');
 var m={msg:sb('sb_conversations',s.msg),cli:sb('sb_contacts',s.cli)};
 var go=function(l,a,ic){var b=el('button','ari-h-pill');b.type='button';b.appendChild(icon(ic));b.appendChild(el('span','ari-h-bl',l));b.addEventListener('click',function(){press(a);});return b;};
 n.appendChild(go('Ari Chats',m.msg,'msg'));n.appendChild(go('Customers',m.cli,'ppl'));
 if(s.ask)n.appendChild(btn('ari-h-pill','Ask Ari','ask',s,'star'));n.appendChild(btn('ari-h-pill','Calendar','cal',s,'cal2'));return n;}
function h31(s){var hero=s.home.querySelector('.lx-hero'),sg=sig(s,'h31');if(!hero)return;
 var a=hero.querySelector('.ari-h31-actions');if(!a||a.getAttribute('data-sig')!==sg){var n=x3(actions31(s));n.setAttribute('data-sig',sg);if(a)a.replaceWith(n);else{var cta=hero.querySelector('.lx-cta');if(cta)cta.after(n);else hero.appendChild(n);}}
 var dl=hero.querySelector('.lx-date'),ds=dl&&dl.querySelector('.ari-h3-date'),nw=new Date(),ph=phase(s)?' \u00b7 '+phase(s):'',txt=longDate(nw)+ph,st=nw.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})+ph;if(dl&&(!ds||ds.getAttribute('data-t')!==txt+'|'+st)){var sp=x3(el('span','ari-h3-date'));sp.setAttribute('data-t',txt+'|'+st);sp.appendChild(el('span','ari-h3-dl',txt));sp.appendChild(el('span','ari-h3-ds',st));if(ds)ds.replaceWith(sp);else dl.appendChild(sp);}
 if(hvar('--ari-home-greet')==='1'){var g5=g35(),nm=fname(),key=g5+'|'+nm,hh=hero.querySelector('h1.ari-h35-h1');if(!hh||hh.getAttribute('data-t')!==key){var nh=x3(el('h1','ari-h35-h1'));nh.setAttribute('data-t',key);nh.appendChild(d.createTextNode(g5+', '));nh.appendChild(el('em','',nm||'welcome back'));var oh=hero.querySelector('h1:not(.ari-h35-h1)');if(hh)hh.replaceWith(nh);else if(oh)oh.after(nh);else hero.appendChild(nh);hh=nh;}
  if(!hero.querySelector('.ari-h35-lede')){var lp=x3(el('p','ari-h35-lede','Here\u2019s what\u2019s waiting for you today.'));hh.after(lp);}}
 else{arr(hero.querySelectorAll('.ari-h35-h1,.ari-h35-lede')).forEach(function(n){n.remove();});}
 var tb=hero.querySelector('.ari-h31-today');if(!tb||tb.getAttribute('data-sig')!==sg){var box=x3(el('div','ari-h31-today'));box.setAttribute('data-sig',sg);box.appendChild(el('p','ari-h-label','This week'));box.appendChild(week(s,false));var ac=hero.querySelector('.ari-h31-actions');if(tb)tb.replaceWith(box);else if(ac)ac.after(box);else hero.appendChild(box);}
 var at=s.home.querySelector('.ari-h31-attn');if(!at||at.getAttribute('data-sig')!==sg){var c=x3(attn(s));c.setAttribute('data-sig',sg);if(at)at.replaceWith(c);else{var tl=s.home.querySelector('.lx-tiles');if(tl)tl.after(c);else s.home.appendChild(c);}at=c;}
 if(hin()==='1'){var ac2=hero.querySelector('.ari-h31-actions');if(ac2&&(at.parentNode!==hero||at.nextElementSibling!==ac2))hero.insertBefore(at,ac2);}else if(at.parentNode===hero){var tl2=s.home.querySelector('.lx-tiles');if(tl2)tl2.after(at);else s.home.appendChild(at);}}
function arow(ic,label,sub,a){var b=el('button','ari-h31-row');b.type='button';var i=el('span','ari-h31-ic');i.appendChild(icon(ic));b.appendChild(i);var t=el('span','ari-h31-tx');t.appendChild(el('span','ari-h31-lb',label));t.appendChild(el('span','ari-h31-sub',sub));b.appendChild(t);b.appendChild(el('span','ari-h31-chev','\u203a'));b.addEventListener('click',function(){press(a);});return b;}
function attn(s){var c=el('section','ari-h31-attn');c.setAttribute('aria-label','What needs your attention');c.appendChild(el('p','ari-h31-eye','\u2726 Today'));c.appendChild(el('h2','ari-h31-h','What needs your attention'));
 var L=el('div','ari-h31-list'),u=unread(),n=u?parseInt(u,10):0;
 L.appendChild(arow('msg',u?(u+' unread message'+(n===1&&u.indexOf('+')<0?'':'s')):'Check your Ari chats','Ari Chats',sb('sb_conversations',s.msg)));
 L.appendChild(arow('cal2',"See who\u2019s booked today",'Calendar',s.cal));
 extras().forEach(function(x){L.appendChild(arow(/note/i.test(x[0])?'moon':'star',/note/i.test(x[0])?"Read today\u2019s Morning Note":'See upcoming Spiritual Events',x[0],x[1]));});
 c.appendChild(L);return c;}
function hvar(n){try{return (w.getComputedStyle(d.body).getPropertyValue(n)||'').replace(/[\"'\s]/g,'');}catch(e){return '';}}
function g35(){var h=new Date().getHours();return h>=5&&h<12?'Good morning':h>=12&&h<17?'Good afternoon':h>=17&&h<22?'Good evening':'Hello';}
function fname(){var c=d.querySelector('.user-info-card .text-gray-900:not(.text-xs)'),t=c&&(c.textContent||'').replace(/\s+/g,' ').trim();if(!t||/@/.test(t))return '';var f=t.split(' ')[0];if(!/^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF'\u2019-]{2,20}$/.test(f))return '';var av=d.querySelector('.avatar .avatar_img'),ini=av&&(av.textContent||'').trim();if(ini&&ini.charAt(0).toUpperCase()!==f.charAt(0).toUpperCase())return '';return f;}
function hin(){try{return (w.getComputedStyle(d.body).getPropertyValue('--ari-home-in')||'').replace(/[\"'\s]/g,'');}catch(e){return '';}}
function hfit(){try{return (w.getComputedStyle(d.body).getPropertyValue('--ari-home-fit')||'').replace(/[\"'\s]/g,'');}catch(e){return '';}}
function fit(s){var h=s&&s.home;if(!h)return;if(hfit()!=='1'){if(h.style.getPropertyValue('--ari-fit-h'))h.style.removeProperty('--ari-fit-h');return;}
 var vh=Math.min(w.innerHeight||0,(d.documentElement&&d.documentElement.clientHeight)||1e5);if(w.visualViewport&&w.visualViewport.height)vh=Math.min(vh,Math.round(w.visualViewport.height));
 var top=h.getBoundingClientRect().top+(w.scrollY||0),ex=0,e=h.parentElement;while(e&&e!==d.body&&e!==d.documentElement){var cs=w.getComputedStyle(e);ex+=(parseFloat(cs.paddingBottom)||0)+(parseFloat(cs.borderBottomWidth)||0);e=e.parentElement;}
 ex+=(parseFloat(w.getComputedStyle(h).marginBottom)||0);var v=Math.max(320,Math.floor(vh-top-ex))+'px';if(h.style.getPropertyValue('--ari-fit-h')!==v)h.style.setProperty('--ari-fit-h',v);}
function clear(){var h=d.getElementById('ari-h');if(h)h.remove();var lh=d.querySelector('#ari-owner-preview .lx-home');if(lh&&lh.style.getPropertyValue('--ari-fit-h'))lh.style.removeProperty('--ari-fit-h');arr(d.querySelectorAll('.ari-h3-x')).forEach(function(n){n.remove();});if(d.body)d.body.removeAttribute('data-ari-home1');}
function sync(){frame=null;if(stopped||!d.body)return;addWatch();if(!on()){clear();return;}var set=hset();if(set!=='h1'&&set!=='h2'&&set!=='h3'&&set!=='h31'){clear();return;}var s=src();if(!s||!s.home||!s.cal||!s.msg){clear();return;}
 if(set==='h3'||set==='h31'){var o=d.getElementById('ari-h');if(o)o.remove();if(d.body.getAttribute('data-ari-home1')!==set)arr(d.querySelectorAll('.ari-h3-x')).forEach(function(n){n.remove();});if(set==='h3')h3(s);else{h31(s);fit(s);}if(d.body.getAttribute('data-ari-home1')!==set)d.body.setAttribute('data-ari-home1',set);return;}
 arr(d.querySelectorAll('.ari-h3-x')).forEach(function(n){n.remove();});
 var cur=d.getElementById('ari-h'),sg=sig(s,set);if(cur&&cur.parentElement===s.home&&cur.getAttribute('data-sig')===sg)return;var n=set==='h1'?buildH1(s):buildH2(s);n.setAttribute('data-sig',sg);
 if(cur)cur.replaceWith(n);s.home.insertBefore(n,s.home.firstChild);if(d.body.getAttribute('data-ari-home1')!==set)d.body.setAttribute('data-ari-home1',set);}
function queue(){if(!stopped&&frame===null)frame=w.requestAnimationFrame(sync);}
obs=new w.MutationObserver(function(m){for(var i=0;i<m.length;i++){var t=m[i].target;if(t&&t.closest&&(t.closest('#ari-h')||t.closest('.ari-h3-x')))continue;queue();return;}});
obs.observe(d.documentElement,{childList:true,subtree:true,characterData:true});tick=w.setInterval(queue,30000);w.addEventListener('popstate',queue);w.addEventListener('resize',queue);if(w.visualViewport)w.visualViewport.addEventListener('resize',queue);
w[K]={sync:queue,stop:function(){stopped=true;if(obs)obs.disconnect();w.clearInterval(tick);clear();},status:function(){var h=d.getElementById('ari-h');return {route:on(),set:hset(),mounted:!!h,unread:unread()};}};
sync();})(window,document);

}catch(e){console.warn("ari block 48",e)}
try{

(function(w,d){'use strict';try{
var K='__ariFirstType1';if(w[K])return;
var TA='conv-composer-textarea-input',WAIT=3000,TICK=30;
var armed=false,buf='',pend='',typedKeys=false,taKeys=0,t0=0,timer=null,lastCarry=null,stopped=false,stats={armed:0,carried:0,focused:0,skipped:0};
function gate(){try{return /\/conversations\//.test(w.location.pathname)&&!!d.body&&d.body.getAttribute('data-ari-msg7')==='v1';}catch(e){return false;}}
function isClosed(e){return !!e&&e.tagName==='INPUT'&&/^composer-input-/.test(e.id||'');}
function inTrigger(e){try{return !!(e&&e.closest&&e.closest('#conv-composer-inline-expand-trigger,#composer-deferred-footer'));}catch(x){return false;}}
function editable(e){return !!e&&(e.tagName==='TEXTAREA'||(e.tagName==='INPUT'&&!e.readOnly&&!e.disabled)||e.isContentEditable);}
function disarm(){armed=false;buf='';pend='';typedKeys=false;taKeys=0;if(timer){w.clearInterval(timer);timer=null;}}
function arm(src){if(stopped||!gate())return;if(!armed){armed=true;t0=Date.now();stats.armed++;buf=isClosed(src)&&src.value?String(src.value):'';typedKeys=false;taKeys=0;pend='';if(!timer)timer=w.setInterval(check,TICK);}}
function setVal(ta,v){var desc=Object.getOwnPropertyDescriptor(w.HTMLTextAreaElement.prototype,'value');if(desc&&desc.set)desc.set.call(ta,v);else ta.value=v;ta.dispatchEvent(new Event('input',{bubbles:true}));try{ta.setSelectionRange(v.length,v.length);}catch(x){}}
function check(){try{
 if(!armed)return;if(!gate()||Date.now()-t0>WAIT){disarm();return;}
 var ta=d.getElementById(TA);if(!ta||!ta.isConnected||ta.disabled||ta.readOnly)return;var r=ta.getBoundingClientRect();if(!r.width||!r.height)return;
 var text=buf+pend;
 if(d.activeElement!==ta){try{ta.focus({preventScroll:true});stats.focused++;}catch(x){}}
 if(text){var cur=ta.value||'';
  if(!cur||text.indexOf(cur)===0){setVal(ta,text);stats.carried++;lastCarry={ta:ta,text:text,at:Date.now()};}
  else if(taKeys>0&&cur.length<=taKeys){setVal(ta,text+cur);stats.carried++;lastCarry={ta:ta,text:text+cur,at:Date.now()};}/* she already typed a bit into the new box: put the earlier letters in front */
  else if(cur.indexOf(text)!==0){stats.skipped++;}/* the box already holds other words (e.g. a saved draft): leave it alone */}
 disarm();
 /* one re-check: if the page clears the new box right after it opens, put the letters back once */
 if(lastCarry)w.setTimeout(function(){try{var c=lastCarry;lastCarry=null;if(!c||!gate()||!c.ta.isConnected)return;if(c.ta.value===''&&d.activeElement===c.ta&&Date.now()-c.at<1500)setVal(c.ta,c.text);}catch(x){}},250);
}catch(e){disarm();}}
function onDown(e){try{if(stopped||!gate())return;var t=e.target;if(isClosed(t)||inTrigger(t))arm(t);}catch(x){}}
function onFocus(e){try{if(stopped||!gate())return;if(isClosed(e.target))arm(e.target);}catch(x){}}
function onInput(e){try{if(!armed)return;var t=e.target;if(isClosed(t)){buf=String(t.value||'');pend='';typedKeys=false;t0=Date.now();}}catch(x){}}
function onKey(e){try{
 if(stopped)return;var t=e.target;if(!armed){if(isClosed(t)&&gate())arm(t);else return;}t0=Date.now();if(t&&t.id===TA){if(!e.isComposing&&!e.ctrlKey&&!e.metaKey&&typeof e.key==='string'&&e.key.length===1)taKeys++;return;}/* the new box takes it natively; just count */
 if(e.isComposing||e.ctrlKey||e.metaKey||e.altKey)return;
 if(editable(t)&&!isClosed(t)&&!inTrigger(t))return;                           /* some other field: never touch */
 var k=e.key;if(k==='Enter'||k==='Tab'||k==='Escape')return;                   /* Enter is never caught, never replayed */
 if(isClosed(t)&&editable(t)){                                                /* the bar may be swapped out before this letter lands: note it; its input event confirms it */
  if(k==='Backspace'){if(pend)pend=pend.slice(0,-1);return;}
  if(typeof k==='string'&&k.length===1)pend+=k;return;}
 if(pend){buf+=pend;pend='';}                                                  /* the bar is gone: its unconfirmed letters come first, in order */
 if(k==='Backspace'){if(buf)buf=buf.slice(0,-1);e.preventDefault();return;}
 if(typeof k==='string'&&k.length===1){buf+=k;typedKeys=true;e.preventDefault();}
}catch(x){}}
d.addEventListener('pointerdown',onDown,true);d.addEventListener('mousedown',onDown,true);d.addEventListener('touchstart',onDown,{capture:true,passive:true});
d.addEventListener('focusin',onFocus,true);d.addEventListener('input',onInput,true);d.addEventListener('keydown',onKey,true);
w[K]={version:'FT1.1',status:function(){return {gate:gate(),armed:armed,pending:(buf+pend).length,stats:stats};},stop:function(){stopped=true;disarm();d.removeEventListener('pointerdown',onDown,true);d.removeEventListener('mousedown',onDown,true);d.removeEventListener('touchstart',onDown,{capture:true});d.removeEventListener('focusin',onFocus,true);d.removeEventListener('input',onInput,true);d.removeEventListener('keydown',onKey,true);delete w[K];}};
}catch(e){}})(window,document);

}catch(e){console.warn("ari block 49",e)}
try{

(function(w,d){'use strict';var K='__ariCalTrim1';try{if(w[K]&&w[K].check){w[K].check();return;}
var RX=/^\/v2\/location\/[^\/]+\/calendars\/view/,tries=0,href='',timer=null,obs=null,stopped=false,lastTry=0,q=null;
function on(){return RX.test(w.location.pathname);}
function mode(){var v=d.querySelector('#calendar-page-parent-container .fc .fc-view')||d.querySelector('.fc .fc-view');if(!v)return '';var c=v.className;
 return /dayGridMonth|multiMonth/.test(c)?'month':/Week/.test(c)?'week':/Day/.test(c)?'day':/fc-list/.test(c)?'list':'other';}
function check(){q=null;try{if(stopped||!d.body)return;if(w.location.href!==href){href=w.location.href;tries=0;}if(!on()||tries>=4)return;
 var m=mode();if(!m||m==='month')return;var b=d.body;if(b.hasAttribute('data-ari-cal8-busy'))return;
 var C=w.__ariCal8V1;if(!C||typeof C.choose!=='function')return;if(Date.now()-lastTry<900)return;
 tries++;lastTry=Date.now();C.choose('agenda');}catch(e){}}
function soon(){if(!stopped&&q===null)q=w.setTimeout(check,60);}
timer=w.setInterval(check,250);
try{obs=new w.MutationObserver(function(){if(on())soon();});obs.observe(d.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-ari-cal-mode','data-ari-cal8']});}catch(e){}
w[K]={check:check,stop:function(){stopped=true;w.clearInterval(timer);if(obs)obs.disconnect();},status:function(){return {route:on(),mode:mode(),tries:tries};}};
check();}catch(e){}})(window,document);

}catch(e){console.warn("ari block 50",e)}
try{

(function(w,d){'use strict';var K='__ariEarlyFitV1';if(w[K])return;var B='/v2/location/'+window.__ariLOC+'/contacts/smart_list/',PHONE=w.matchMedia('(max-width:760px)'),mo=null;
function set(){var fit=w.location.pathname.indexOf(B)===0&&PHONE.matches&&!!d.getElementById('crm-contacts-view');
 [d.documentElement,d.body].forEach(function(n){if(!n)return;if(fit){if(n.getAttribute('data-ari-cl7-fit')!=='v1')n.setAttribute('data-ari-cl7-fit','v1');}});
 if(fit&&w.__ariTidy7V1&&w.__ariTidy7V1.sync)try{w.__ariTidy7V1.sync();}catch(e){}}
function start(){if(mo||!d.body)return;mo=new MutationObserver(set);mo.observe(d.body,{childList:true,subtree:true});set();}
if(d.body)start();else d.addEventListener('DOMContentLoaded',start);
w[K]={stop:function(){if(mo)mo.disconnect();mo=null;delete w[K];}};})(window,document);

}catch(e){console.warn("ari block 51",e)}
try{

(function(w,d){'use strict';var K='__ariMsgCombineV1';if(w[K]){w[K].sync();return;}
var WIDE=w.matchMedia('(min-width: 1180px)'),frame=null,mo=null;
function flag(a,v){if(!d.body)return;if(v){if(d.body.getAttribute(a)!==v)d.body.setAttribute(a,v);}else if(d.body.hasAttribute(a))d.body.removeAttribute(a);}
function sync(){frame=null;if(!d.body)return;
 if(w.location.pathname.indexOf('/v2/location/'+w.__ariLOC+'/conversations/')!==0){flag('data-ari-mc','');flag('data-ari-mc-wide','');return;}
 flag('data-ari-mc','v1');flag('data-ari-mc-wide',WIDE.matches?'1':'');}
function q(){if(!frame)frame=w.requestAnimationFrame(sync);}
function start(){if(mo||!d.body)return;mo=new MutationObserver(q);mo.observe(d.body,{childList:true,subtree:true});
 w.addEventListener('popstate',q);if(WIDE.addEventListener)WIDE.addEventListener('change',q);sync();}
if(d.body)start();else d.addEventListener('DOMContentLoaded',start);
w[K]={sync:q,stop:function(){if(mo)mo.disconnect();mo=null;flag('data-ari-mc','');flag('data-ari-mc-wide','');delete w[K];}};})(window,document);

}catch(e){console.warn("ari block 52",e)}
try{

(function(w,d){'use strict';var K='__ariClientsBookedV1';if(w[K]){w[K].sync();return;}
var B='/v2/location/'+w.__ariLOC+'/contacts/smart_list/',FAIL=4500,PHONE=w.matchMedia?w.matchMedia('(max-width: 760px)'):null;
var mo=null,timer=null,waitSince=0,stopped=false,styleEl=null,styleKey='',card=null,texts=new Map();
var KINDS=[['last',/^last[ _-]?reading(s)?([ _-]?date)?$/i,'Last reading'],['next',/^next[ _-]?reading(s)?([ _-]?date)?$/i,'Next reading'],
 ['total',/^total[ _-]?readings?$|^readings$|^reading[ _-]?count$/i,'Total readings'],['name',/^(contact |client |customer )?name$|^client$|^customer$|^full name$|^contact$/i,'Customer']];
var ORDER={name:1,last:2,next:3,total:4};
function norm(s){return String(s||'').replace(/[\u00a0\s]+/g,' ').trim();}
function on(){var p=w.location.pathname.replace(/\/$/,'');return p.indexOf(B)===0&&/^[A-Za-z0-9_-]+$/.test(p.slice(B.length));}
function flag(a,v){var b=d.body;if(!b)return;if(v){if(b.getAttribute(a)!==v)b.setAttribute(a,v);}else if(b.hasAttribute(a))b.removeAttribute(a);}
function attr(e,a,v){if(v===null||v===undefined||v===''){if(e.hasAttribute(a))e.removeAttribute(a);}else if(e.getAttribute(a)!==v)e.setAttribute(a,v);}
function kindOf(col){var t=col.querySelector('.tabulator-col-title');var s=norm((t||col).textContent);
 var known=null;texts.forEach(function(v,n){if(t&&t.contains(n))known=v.kind;});if(known)return known;
 for(var k=0;k<KINDS.length;k++)if(KINDS[k][1].test(s))return KINDS[k][0];return null;}
function relabel(col,k){var t=col.querySelector('.tabulator-col-title');if(!t)return;var leaf=t.children.length?[].slice.call(t.querySelectorAll('*')).filter(function(e){return !e.children.length&&norm(e.textContent);})[0]:t;
 if(!leaf)return;var lab=KINDS.filter(function(x){return x[0]===k;})[0][2];if(norm(leaf.textContent)===lab){if(!texts.has(leaf))texts.set(leaf,{orig:null,kind:k});return;}
 if(!texts.has(leaf))texts.set(leaf,{orig:leaf.textContent,kind:k});else texts.get(leaf).kind=k;leaf.textContent=lab;}
function writeStyle(map){var key=JSON.stringify(map);if(key===styleKey&&styleEl&&styleEl.isConnected)return;styleKey=key;
 if(!styleEl||!styleEl.isConnected){styleEl=d.createElement('style');styleEl.setAttribute('data-ari-cb-style','v1');(d.head||d.documentElement).appendChild(styleEl);}
 var css='';Object.keys(map).forEach(function(f){var k=map[f],sel='[tabulator-field="'+f.replace(/["\\]/g,'\\$&')+'"]';
  css+='html body[data-ari-cb="v1"] #crm-contacts-view#crm-contacts-view #table-container#table-container :is(.tabulator-col,.tabulator-cell)'+sel+'{display:flex!important;order:'+ORDER[k]+'!important}\n';});
 styleEl.textContent=css;}
function sub(row){var g=function(k){var c=row.querySelector('.tabulator-cell[data-ari-cb-col="'+k+'"]');return c?norm(c.textContent):'';};
 var nx=g('next'),la=g('last'),tt=g('total'),n=parseInt(tt,10);if(!(n>=0))n=0;var a=nx?'Next reading '+nx:la?'Last reading '+la:'';
 return (a?a+' \u00b7 ':'')+n+' total reading'+(n===1?'':'s');}
function ensureCard(view,empty,search){var host=view.querySelector('#table-container');if(!host)return;
 if(!empty){if(card&&card.isConnected)card.remove();return;}
 if(!card){card=d.createElement('div');card.setAttribute('data-ari-cb-card','v1');card.setAttribute('role','status');
  card.innerHTML='<div class="ari-cb-ic" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4.5" width="14" height="12.5" rx="2"/><path d="M7 3v3M13 3v3M3 8.5h14"/></svg></div><h2 class="ari-cb-h"></h2><p class="ari-cb-p"></p>';}
 var h=search?'No customers match your search':'Your booked customers will show here',p=search?'Try another name, or clear the search to see everyone.':'When someone books a reading with you, they will appear here.';
 var hh=card.querySelector('.ari-cb-h'),pp=card.querySelector('.ari-cb-p');if(hh.textContent!==h)hh.textContent=h;if(pp.textContent!==p)pp.textContent=p;
 if(card.parentNode!==host.parentNode||card.nextSibling!==host)host.parentNode.insertBefore(card,host);}
function restore(){texts.forEach(function(v,n){if(v.orig!==null&&n.isConnected)n.textContent=v.orig;});texts.clear();
 if(card&&card.isConnected)card.remove();if(styleEl&&styleEl.isConnected)styleEl.textContent='';styleKey='';
 var n=d.querySelectorAll('[data-ari-cb-col],[data-ari-cb-blank],[data-ari-cb-sub]');for(var i=0;i<n.length;i++){if(n[i].hasAttribute('data-ari-cb-sub'))n[i].remove();else{n[i].removeAttribute('data-ari-cb-col');n[i].removeAttribute('data-ari-cb-blank');}}
 ['data-ari-cb','data-ari-cb-ready','data-ari-cb-empty','data-ari-cb-failsafe','data-ari-cb-cols'].forEach(function(a){flag(a,'');});waitSince=0;}
function sync(){if(stopped||!d.body)return;
 if(!on()){if(d.body.hasAttribute('data-ari-cb'))restore();return;}
 flag('data-ari-cb','v1');
 var view=d.getElementById('crm-contacts-view'),table=view&&view.querySelector('#table-container .tabulator'),ready=false,empty=false;
 if(table){var cols=[].slice.call(table.querySelectorAll('.tabulator-headers .tabulator-col')),map={},have={};
  cols.forEach(function(c){var k=kindOf(c),f=c.getAttribute('tabulator-field');attr(c,'data-ari-cb-col',k);if(k){relabel(c,k);have[k]=1;if(f)map[f]=k;}});
  writeStyle(map);flag('data-ari-cb-cols',have.name?(have.last&&have.next&&have.total?'all':'name'):'');
  var rows=table.querySelectorAll('.tabulator-row'),i;
  for(i=0;i<rows.length;i++){var cells=rows[i].querySelectorAll('.tabulator-cell');for(var j=0;j<cells.length;j++){var f2=cells[j].getAttribute('tabulator-field'),k2=f2&&map[f2]||null;
    attr(cells[j],'data-ari-cb-col',k2);if(k2&&k2!=='name')attr(cells[j],'data-ari-cb-blank',norm(cells[j].textContent)?null:'1');}
   var nc=rows[i].querySelector('.tabulator-cell[data-ari-cb-col="name"]');if(nc){var s=nc.querySelector('[data-ari-cb-sub]'),t=sub(rows[i]);
    if(!s){s=d.createElement('span');s.setAttribute('data-ari-cb-sub','v1');(nc.firstElementChild||nc).appendChild(s);}if(s.textContent!==t)s.textContent=t;}}
  var ph=table.querySelector('.tabulator-placeholder'),txt=norm(view.textContent),loading=!!table.querySelector('.tabulator-loader')||!!view.querySelector('#table-container .n-spin-container .n-spin');
  empty=!rows.length&&!loading&&(!!ph||/no contacts found/i.test(txt));
  ready=!!have.name&&(rows.length>0||empty);if(!rows.length&&!loading&&!have.name&&(ph||/no contacts found/i.test(txt))){empty=true;ready=true;}}
 else if(view&&/no contacts found/i.test(norm(view.textContent))){empty=true;ready=true;}
 if(view){var se=view.querySelector('input#list-view-record-search,input[placeholder*="earch"]');ensureCard(view,empty,!!(se&&se.value));}
 flag('data-ari-cb-empty',empty?'1':'');
 /* ready stays on while the list re-renders (pagination, filter, search) so the page never blinks back to cream */
 if(ready)flag('data-ari-cb-ready','1');
 var b=d.body,shown=b.hasAttribute('data-ari-cb-ready')&&b.hasAttribute('data-ari-clients-luxe')&&b.hasAttribute('data-ari-clients-skin');
 /* fail-safe: anything keeping the view hidden for 4.5 s in a row (not ready, or another skin part missing) shows it anyway */
 if(shown){waitSince=0;flag('data-ari-cb-failsafe','');}
 else{if(!waitSince)waitSince=Date.now();else if(Date.now()-waitSince>=FAIL)flag('data-ari-cb-failsafe','1');}}
function start(){if(mo||!d.body)return;mo=new MutationObserver(sync);mo.observe(d.documentElement,{childList:true,subtree:true,characterData:true});
 w.addEventListener('popstate',sync);if(PHONE&&PHONE.addEventListener)PHONE.addEventListener('change',sync);timer=w.setInterval(sync,250);sync();}
if(d.body){start();}else d.addEventListener('DOMContentLoaded',start);
w[K]={sync:sync,stop:function(){stopped=true;if(mo)mo.disconnect();mo=null;w.clearInterval(timer);w.removeEventListener('popstate',sync);restore();delete w[K];},
 get status(){var b=d.body||{getAttribute:function(){return null;}};return {on:on(),ready:b.getAttribute('data-ari-cb-ready'),empty:b.getAttribute('data-ari-cb-empty'),failsafe:b.getAttribute('data-ari-cb-failsafe'),cols:b.getAttribute('data-ari-cb-cols'),style:styleKey};}};
})(window,document);

}catch(e){console.warn("ari block 53",e)}
try{

(function(w,d){'use strict';var K='__ariCustomersGuardV1';if(w[K])return;
var LOC='8otTGBxdVFDsQ1gNhDg0',A='data-ari-cust-guard',card=null;
/* has this login got its own Customers tab? (null = tab row not drawn yet, kept hidden) */
function admin(){if(w.__ariCbTestNonAdmin)return false;var bar=d.getElementById('smart-list-views-bar');if(!bar)return null;
 var all=bar.querySelectorAll('*');for(var i=0;i<all.length;i++){var n=all[i];if(!n.children.length&&/^(clients|customers)$/i.test((n.textContent||'').replace(/\s+/g,' ').trim()))return true;}return false;}
function onAll(){return new RegExp('^/v2/location/'+LOC+'/contacts/smart_list/all/?$','i').test(w.location.pathname);}
function sync(){var b=d.body;if(!b)return;var g=onAll()&&admin()!==true;
 if(g){if(b.getAttribute(A)!=='1')b.setAttribute(A,'1');var host=d.querySelector('#crm-contacts-view #table-container');
  if(host){if(!card){card=d.createElement('div');card.setAttribute('data-ari-cust-guard-card','v1');card.setAttribute('role','status');
   card.innerHTML='<h2 class="ari-cb-h">Your booked customers will show here</h2><p class="ari-cb-p">When someone books a reading with you, they will appear here.</p>';}
   if(card.parentNode!==host.parentNode||card.nextSibling!==host)host.parentNode.insertBefore(card,host);}}
 else{if(b.hasAttribute(A))b.removeAttribute(A);if(card&&card.isConnected)card.remove();}}
var mo=new MutationObserver(sync);function start(){mo.observe(d.documentElement,{childList:true,subtree:true});w.setInterval(sync,300);w.addEventListener('popstate',sync);sync();}
if(d.body)start();else d.addEventListener('DOMContentLoaded',start);
w[K]={sync:sync,get status(){return {on:onAll(),admin:admin(),guard:!!(d.body&&d.body.hasAttribute(A))};}};
})(window,document);

}catch(e){console.warn("ari block 54",e)}
try{

(function(w,d){'use strict';var K='__ariDashFixV1';
if(w[K]&&w[K].stop)w[K].stop();
var LOC='8otTGBxdVFDsQ1gNhDg0',B='/v2/location/'+LOC+'/',H='data-ari-dfx-hide',stats={},obs=[],timer=null,stopped=false,lastUrl='',q=false;
function on(){return w.location.pathname.indexOf(B)===0&&!(w.__ariRawV2&&w.__ariRawV2.raw);}
function sub(){return w.location.pathname.slice(B.length);}
function norm(s){return (s||'').replace(/[\s\u00a0\u200b]+/g,' ').trim();}
function hit(k){stats[k]=(stats[k]||0)+1;}
/* every place content can live: this page, open shadow roots, same-origin frames */
function roots(){var out=[d],i=0;while(i<out.length&&out.length<60){var r=out[i++],all;try{all=r.querySelectorAll('*');}catch(e){continue;}
 for(var j=0;j<all.length;j++){var el=all[j];if(el.shadowRoot&&out.indexOf(el.shadowRoot)<0)out.push(el.shadowRoot);
  if(el.tagName==='IFRAME'){try{var fd=el.contentDocument;if(fd&&fd.body&&out.indexOf(fd)<0)out.push(fd);}catch(e){}}}}return out;}
function qa(sel){var res=[];roots().forEach(function(r){try{res.push.apply(res,r.querySelectorAll(sel));}catch(e){}});return res;}
/* text nodes whose trimmed text matches re */
function texts(re,scope){var res=[];(scope?[scope]:roots()).forEach(function(r){var base=r.body||r;if(!base)return;
 var tw=(r.ownerDocument||r).createTreeWalker?((r.ownerDocument||r).createTreeWalker(base,4,null)):null;if(!tw)return;var n;
 while((n=tw.nextNode())){var p=n.parentNode;if(!p||/^(SCRIPT|STYLE|TEXTAREA|NOSCRIPT)$/.test(p.nodeName))continue;if(re.test(norm(n.nodeValue)))res.push(n);}});return res;}
function up(n,sel,max){var i=0;n=n&&n.nodeType===3?n.parentElement:n;while(n&&i++<(max||8)){if(n.matches&&n.matches(sel))return n;n=n.parentElement||(n.parentNode&&n.parentNode.host)||null;}return null;}
/* hide = marker + inline display:none !important (inline beats any stylesheet rule, including the platform's and ours). Only acts on a change. */
function hide(n,why){if(!n||!n.getAttribute)return;var ch=false;if(n.getAttribute(H)!==why){n.setAttribute(H,why);ch=true;}
 if(n.style.getPropertyValue('display')!=='none'||n.style.getPropertyPriority('display')!=='important'){n.style.setProperty('display','none','important');ch=true;}if(ch)hit(why);}
function unhide(n,why){if(n&&n.getAttribute&&n.getAttribute(H)===why){n.removeAttribute(H);n.style.removeProperty('display');hit(why+'_undo');}}
/* fight guard: if something keeps writing a text back, stop after 10 changes in 10 s for that spot */
var FG=new WeakMap();function allow(n){var r=FG.get(n),t=Date.now();if(!r||t-r.t>10000){r={t:t,c:0};FG.set(n,r);}r.c++;if(r.c>10){stats.rename_fight=(stats.rename_fight||0)+(r.c===11?1:0);return false;}return true;}
function setText(t,v){if(t.nodeValue!==v){t.nodeValue=v;return true;}return false;}
function inChat(n){return !!up(n,'#conversations-central-panel [class*="message"],[contenteditable],textarea,input,.ProseMirror',30);}
/* hide rule must also exist inside shadow roots / frames */
var CSS='['+H+']{display:none!important}';
function ensureCss(r){if(r===d)return;try{var host=r.head||r;if(host.querySelector&&host.querySelector('style[data-ari-dfx]'))return;var s=(r.ownerDocument||r).createElement('style');s.setAttribute('data-ari-dfx','1');s.textContent=CSS;host.appendChild(s);}catch(e){}}
var P={};
/* rename: menu item, home card, pills, links, header, tab title */
P.rename=function(){qa('#sb_conversations .nav-title, #sb_conversations [class*="title"]').forEach(function(t){if(norm(t.textContent)==='Messages'&&allow(t)){t.textContent='Ari Chats';hit('rename');}});
 qa('.conversation-list-header h1').forEach(function(h){if(/^(My inbox|Team inbox|All chats)$/i.test(norm(h.textContent))&&allow(h)){h.textContent='Ari Chats';hit('rename');}});
 qa('#sb_conversations,[aria-label="Messages"]').forEach(function(a){if(a.getAttribute('aria-label')==='Messages'){a.setAttribute('aria-label','Ari Chats');hit('rename');}});
 var MAP=[[/^Messages$/,'Ari Chats'],[/^Open messages$/i,'Open Ari Chats'],[/^Check your customer messages$/i,'Check your Ari chats'],[/^New messages$/,'New Ari chats']];
 texts(/^(Messages|Open messages|Check your customer messages|New messages)$/i).forEach(function(t){if(inChat(t))return;var v=norm(t.nodeValue);
  for(var i=0;i<MAP.length;i++)if(MAP[i][0].test(v)){if(allow(t.parentElement||t)&&setText(t,MAP[i][1]))hit('rename');break;}});
 texts(/new customer messages are one tap away/).forEach(function(t){if(setText(t,t.nodeValue.replace('new customer messages','new Ari chats')))hit('rename');});
 if(/^conversations/.test(sub())&&/Messages|Conversations/.test(d.title)&&allow(d)){d.title='Ari Chats';hit('rename');}};
P.warn=function(){texts(/make sure you have entered a message/i).forEach(function(t){hide(up(t,'[role="tooltip"],[class*="tooltip"],[class*="popover"]',8)||t.parentElement,'warn');});};
P.plus=function(){if(!/^conversations/.test(sub()))return;
 var RC='#conversations-right-column,#conversations-contact-details,[aria-label="Contact details"],#new-conversation-right-side-bar';
 qa('#conversations-right-column,#conversations-contact-details,[aria-label="Contact details"],#new-conversation-right-side-bar').forEach(function(r){[r].concat([].slice.call(r.querySelectorAll('['+H+'="plus"]'))).forEach(function(n){unhide(n,'plus');});});
 function inRC(b){return !!(b.closest&&b.closest(RC));}
 function small(b){var tg=b.tagName;if(!(tg==='BUTTON'||tg==='A'||(b.getAttribute('role')||'')==='button'))return false;if(b.querySelectorAll('*').length>12)return false;var r=b.getBoundingClientRect();return !(r.width>=80||r.height>=80);}
 function ok(b){return b&&!inRC(b)&&small(b);}
 qa('#new-conversation-btn-collapsed,#new-conversation-btn,[id^="new-conversation"],[aria-label="Add conversation"],[aria-label*="new conversation" i],[aria-label*="compose" i]').forEach(function(b){if(!ok(b)){var c=b.closest&&b.closest('button,a,[role="button"]');if(c&&c!==b&&ok(c))b=c;else return;}hide(b,'plus');});
 qa('#conversations-layout button').forEach(function(b){if(/^ari-/.test(b.id||''))return;if(!ok(b))return;var t=norm(b.textContent),a=norm(b.getAttribute('aria-label')||b.getAttribute('title')||'');
  if(t==='+'||/^(add|new|plus|\+)$/i.test(a)||(b.closest('.conversation-list-header')&&b.classList.contains('hr-button--primary')&&!t))hide(b,'plus');});
 texts(/^(My inbox|Views|Internal chat|Team inbox)$/i).forEach(function(t){var m=up(t,'[role="menu"],[role="listbox"],.hr-dropdown-menu,.n-dropdown-menu,[class*="dropdown-menu"],.hr-popover,[class*="popover"]',8);if(m&&!inRC(m))hide(m,'plus');});};
/* info box: text only. Field boxes are left alone (changing them could save into the customer). */
P.info=function(){var rc=qa('#conversations-right-column')[0]||(/^contacts\/detail/.test(sub())?d.body:null);if(!rc)return;
 texts(/\bAI assistant\b/i,rc).forEach(function(t){if(setText(t,t.nodeValue.replace(/\bthe AI assistant\b/gi,'Ari').replace(/\bAI assistant\b/gi,'Ari')))hit('info');});
 texts(/^(Total Readings|Last Reading( Date)?|Next Reading( Date)?)\s*\*?$/i,rc).forEach(function(t){var row=up(t,'.hr-form-item,.n-form-item,.form-group',6),i=0;
  if(!row){row=t.parentElement;while(row&&i++<5&&!row.querySelector('input,textarea,[class*="value"]'))row=row.parentElement;}if(!row)return;
  var f=row.querySelector('input,textarea'),v=f?norm(f.value):norm(row.textContent).replace(norm(t.nodeValue),'').trim();
  if(!v||/^(-|--|n\/a)$/i.test(v))hide(row,'info');else if(row.getAttribute(H)==='info')row.removeAttribute(H);});
 [].forEach.call((rc.querySelectorAll?rc:d).querySelectorAll('.hr-collapse-item,.n-collapse-item'),function(s){var hd=s.querySelector('.hr-collapse-item__header,.n-collapse-item__header');var h=norm(hd&&hd.textContent);
  if(!/^(Form \| Booking details|Ari(?![a-z])(?! ?Chat Summary))/i.test(h))return;
  var filled=[].some.call(s.querySelectorAll('input,textarea'),function(f){return norm(f.value);});if(!filled)hide(s,'info');else unhide(s,'info');});};
/* simple customer panel (panel-simple-v1): the right column shows only name, birthday, email, phone, readings/booking info, Psychic Notes and Ari Chat Summary.
   Matches by label text. Hides only pieces INSIDE the panel, never the panel itself or anything holding a kept field. Empty kept fields stay visible ("--"). */
P.simple=function(){if(!/^conversations/.test(sub()))return;var rc=qa('#conversations-right-column')[0];if(!rc||!rc.querySelectorAll)return;
 var KEEP=/^(email|e-mail|phone|phone number|mobile|date of birth|birthday|birth ?date|dob|ari chat summary|psychic notes?|total readings?|last reading( date)?|next reading( date)?|past readings?|upcoming readings?)\s*\*?$/i,
  SEC=/^(form \| booking details|psychic notes?|readings?|bookings?|upcoming|appointments?)\b/i,W='simple',keep=[],drop=[];
 function safe(n){return n&&n!==rc&&rc.contains(n)&&!keep.some(function(k){return n.contains(k)||k.contains(n);});}
 function label(f){var l=f.querySelector('.hr-form-item-label__text,.n-form-item-label__text,label');return norm(l&&l.textContent);}
 [].forEach.call(rc.querySelectorAll('.hr-form-item,.n-form-item'),function(f){var t=label(f);if(!t)return;
  var box=up(f,'#field-container,[data-pendo-id^="contact-details-field-"]',4)||f;if(!rc.contains(box))box=f;(KEEP.test(t)?keep:drop).push(box);});
 keep.forEach(function(n){unhide(n,W);});
 drop.forEach(function(n){if(safe(n))hide(n,W);});
 [].forEach.call(rc.querySelectorAll('.hr-collapse-item,.n-collapse-item'),function(s){var hd=s.querySelector('.hr-collapse-item__header,.n-collapse-item__header');var h=norm(hd&&hd.textContent);
  var has=keep.some(function(k){return s.contains(k);});if(has!==s.hasAttribute('data-ari-simple-open'))s.toggleAttribute('data-ari-simple-open',has);
  if(SEC.test(h)){unhide(s,W);return;}if(safe(s))hide(s,W);else unhide(s,W);});
 /* clutter: field tabs + field search, record link, owner/followers/tags/DND/actions, created/audit footer */
 var C=[];
 [].forEach.call(rc.querySelectorAll('[role="tablist"],.hr-tabs-nav,.n-tabs-nav'),function(n){C.push(n);});
 [].forEach.call(rc.querySelectorAll('input[placeholder]'),function(i){if(/^search fields/i.test(i.getAttribute('placeholder')))C.push(up(i,'.hr-input-container,.n-input',4)||i);});
 texts(/^(All fields|View contact details|Owner|Followers|Tags( \(\d+\))?|DND|Actions|Audit logs|CONVERSATIONS|Created (by|on):.*)$/i,rc).forEach(function(t){var e=t.parentElement;
  var b=up(e,'button,a,[role="tab"],[role="button"]',3);C.push(b||e);});
 [].forEach.call(rc.querySelectorAll('a[href*="/contacts/detail/"]'),function(a){C.push(a);});
 C.forEach(function(n){if(safe(n))hide(n,W);});
 if(rc.getAttribute('data-ari-simple-panel')!=='v1')rc.setAttribute('data-ari-simple-panel','v1');
 if(rc.getAttribute(H)===W){rc.removeAttribute(H);rc.style.removeProperty('display');}};
/* You / Ari labels. Ari's replies carry the platform's AI marker. */
var AIMARK='[class*="sparkle" i],[id*="sparkle" i],[aria-label],[title],[data-testid],[class*="ai-generated" i],[class*="ai-badge" i],[class*="bot-" i],[class*="-bot" i]';
/* try 5: Ari's replies carry the platform's small purple badge (bg #EBE9FE / text #6938EF); the psychic's carry her initials avatar (.hr-avatar). */
function whoOf(it){if(it.querySelector('[class*="bg-[#EBE9FE]"],[class*="text-[#6938EF]"]'))return 'ari';if(it.querySelector('.hr-avatar,.hr-avatar__container'))return 'you';return isAi(it)?'ari':null;}
function isAi(it){return [].some.call(it.querySelectorAll(AIMARK),function(e){var c=String(e.getAttribute('class')||'')+' '+(e.id||'');
 if(/sparkle|ai-generated|ai-badge|(^|[\s-])bot(-|\s|$)/i.test(c))return true;var l=(e.getAttribute('aria-label')||'')+' '+(e.getAttribute('title')||'')+' '+(e.getAttribute('data-testid')||'');
 return /\bAI\b|Conversation AI|AI (agent|employee|assistant)|\bbot\b/.test(l)||/(^|[-_])ai([-_]|$)/i.test(e.getAttribute('data-testid')||'');});}
P.who=function(){var cp=qa('#conversations-content')[0];if(!cp)return;var out=[];
 [].forEach.call(cp.querySelectorAll('.message-item'),function(it){var b=it.querySelector('.chat-message');if(!b)return;var ir=it.getBoundingClientRect(),br=b.getBoundingClientRect();if(!br.width)return;
  if((br.left-ir.left)>(ir.right-br.right))out.push(it);});
 var kinds=out.map(whoOf);stats.who_out=out.length;stats.who_ai=kinds.filter(function(k){return k==='ari';}).length;stats.who_you=kinds.filter(function(k){return k==='you';}).length;
 if(out.length&&!stats.who_ai&&!stats.who_you)stats.who_unsure=1;else delete stats.who_unsure;
 out.forEach(function(it,i){var k=kinds[i];if(!k)return;var old=it.querySelector('[data-ari-who]');if(old){if(old.getAttribute('data-ari-who')===k)return;old.remove();}
  var l=d.createElement('span');l.setAttribute('data-ari-who',k);l.textContent=k==='ari'?'Ari':'You';var b=it.querySelector('.chat-message');b.parentElement.insertBefore(l,b);hit('who');});};
/* Customers: hide Ask Ari guest rows (screen only) */
function rowOf(t){var r=up(t,'tr,[role="row"],[class*="table-row"],[class*="tr-"],li',10);if(r)return r;
 var n=t.parentElement,i=0;while(n&&n.parentElement&&i++<10){var p=n.parentElement,same=0;for(var c=p.firstElementChild;c;c=c.nextElementSibling)if(c.tagName===n.tagName&&c.className===n.className)same++;if(same>=3)return n;n=p;}return null;}
P.guests=function(){if(!/^contacts\/smart_list/.test(sub()))return;
 qa('#crm-contacts-view .tabulator-row').forEach(function(r){var nm=r.querySelector('.contact-name-link,.contact-name-wrapper');var g=/^Guest Visitor\b/i.test(norm(nm?nm.textContent:''));if(g)hide(r,'guests');else unhide(r,'guests');});};
var RAIL=/^(Associations|Companies|Activity( \([A-Z]{2,4}\))?|Add|Add association|Companies \(\d+\)|Associations \(\d+\))$/,TIP=new WeakMap(),QD=new WeakSet(),probing=false;
/* read an icon button's tooltip once: hover it, read the tooltip text, unhover. Nothing is clicked. */
function probe(list){if(!list.length)return;if(probing){w.setTimeout(function(){probe(list);},250);return;}probing=true;var b=list.shift();
 b.dispatchEvent(new MouseEvent('mouseenter',{bubbles:false}));b.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));
 w.setTimeout(function(){var tips=qa('[role="tooltip"],.hr-tooltip,.n-tooltip,[class*="tooltip"]').filter(function(t){return t.getClientRects().length;});
  var tx=tips.length?norm(tips[tips.length-1].textContent):'';TIP.set(b,tx||'?');b.setAttribute('data-ari-dfx-tip',tx.slice(0,40));
  b.dispatchEvent(new MouseEvent('mouseleave',{bubbles:false}));b.dispatchEvent(new MouseEvent('mouseout',{bubbles:true}));probing=false;sched();probe(list);},180);}
P.rail=function(){if(!/^contacts|^conversations/.test(sub()))return;
 texts(RAIL).forEach(function(t){hide(up(t,'button,a,[role="tab"],[role="button"],[role="menuitem"],li,[class*="nav-item"],[class*="tab"]',6),'rail');});
 qa('#tb_business,[aria-label],[title],[data-tooltip],[data-title]').forEach(function(e){if(e.id==='tb_business'){hide(e,'rail');return;}
  var l=norm(e.getAttribute('aria-label')||e.getAttribute('title')||e.getAttribute('data-tooltip')||e.getAttribute('data-title'));if(l&&RAIL.test(l))hide(up(e,'button,a,[role="tab"],[role="button"],li',3)||e,'rail');});
 if(!/^contacts\/detail/.test(sub()))return;
 var icons=qa('button.w-8.h-8').filter(function(b){return !b.id||!/^ari-/.test(b.id);}),todo=[];
 icons.forEach(function(b){var t=TIP.get(b);if(t===undefined){if(b.getClientRects().length&&!QD.has(b)){QD.add(b);todo.push(b);}}else if(RAIL.test(t))hide(b,'rail');});
 if(todo.length)w.setTimeout(function(){probe(todo);},400);
 /* the side panel that opens on its own: smallest box holding the Companies heading and its empty/Create text */
 texts(/^(No Company created|Create new|Companies \(\d+\)|Associations)$/i).forEach(function(t){if(up(t,'header.hl_header,#sidebar-v2',20))return;var n=t.parentElement,i=0,best=null;
  while(n&&i++<12&&n!==d.body){var x=norm(n.textContent);if(/Companies( \(\d+\))?/i.test(x)&&/(No Company created|Create new)/i.test(x)){best=n;break;}n=n.parentElement;}
  if(!best)return;var pnl=up(best,'aside,[class*="panel" i],[class*="drawer" i],[class*="sidebar" i],[class*="association" i]',6);
  if(pnl&&!pnl.contains(qa('#field-container')[0]||null)&&pnl.getBoundingClientRect().width<w.innerWidth*0.6)best=pnl;hide(best,'assocpanel');});};
/* Calendar "+ New": clear a leftover {{...}} title, hide two extra fields */
P.calnew=function(){qa('[role="dialog"],.hr-modal,.n-modal,.hr-drawer,.n-drawer,[class*="modal-container"],[class*="drawer-content"]').forEach(function(dl){
 if(!dl.getClientRects().length)return;
 [].forEach.call(dl.querySelectorAll('input:not([type="hidden"])'),function(i){if(/\{\{[^}]*\}\}/.test(i.value||'')&&!i.hasAttribute('data-ari-dfx-cleared')){i.setAttribute('data-ari-dfx-cleared','1');i.value='';i.dispatchEvent(new Event('input',{bubbles:true}));i.placeholder='Reading with your customer';hit('calnew');}});
 texts(/^(Associated objects|Internal notes?)\s*\*?$/i,dl).forEach(function(t){var f=t.parentElement,i=0;while(f&&i++<5&&!f.querySelector('input,textarea,select,[contenteditable],[class*="select"]'))f=f.parentElement;hide(f,'calnew');});});};
/* Notifications: READING for appointments, ARI CHAT for chats */
var CTX='[aria-label="Notification Drawer"],.hl_recent-activities,#notification-list-containrer,[id^="notification-drawer"],[id^="notification_drawer"],[class*="notification"]';
function notice(t){var lab=norm(t.nodeValue),n=t.parentElement,i=0;while(n&&i++<10){if(n.matches&&n.matches('.drawer-panel,'+CTX.replace(',[class*="notification"]','')))break;
  if(norm(n.textContent).length>lab.length+12)return n;n=n.parentElement;}return null;}
P.notif=function(){texts(/^(message|ari chat|reading)$/i).forEach(function(t){if(!up(t,CTX+',.drawer-panel',15))return;var it=notice(t);if(!it)return;
 var v=/\b(book|booked|booking|appointment|resched\w*|cancel+ed|confirmed|reading)\b/i.test(norm(it.textContent).replace(norm(t.nodeValue),''))?'READING':'ARI CHAT';if(setText(t,v))hit('notif');});};
/* Ask Ari: let the frame and its wrappers fill the width */
P.askfill=function(){qa('iframe[src*="ari-advisor"]').forEach(function(f){var n=f,i=0;while(n&&i++<6){var p=n.parentElement;if(!p||p.id==='app'||p===d.body)break;
 var pr=p.getBoundingClientRect(),nr=n.getBoundingClientRect();if(pr.width-nr.width>20&&!n.hasAttribute('data-ari-dfx-fill')){n.setAttribute('data-ari-dfx-fill','');hit('askfill');}n=p;}
 if(!f.hasAttribute('data-ari-dfx-fill'))f.setAttribute('data-ari-dfx-fill','');});};
function run(){q=false;if(stopped||!on())return;roots().forEach(ensureCss);for(var k in P){try{P[k]();}catch(e){stats['err_'+k]=String(e&&e.message||e).slice(0,80);}}}
function sched(){if(!q){q=true;w.setTimeout(run,250);}}
function watch(){roots().forEach(function(r){if(r.__ariDfxObs)return;var t=r.body||r;try{var o=new MutationObserver(sched);o.observe(t,{childList:true,subtree:true,characterData:true});r.__ariDfxObs=o;obs.push(o);}catch(e){}});}
function tick(){if(stopped)return;if(w.location.href!==lastUrl){lastUrl=w.location.href;sched();}watch();}
['pushState','replaceState'].forEach(function(m){var o=w.history[m];if(o&&!o.__ariDfx){var f=function(){var r=o.apply(this,arguments);sched();return r;};f.__ariDfx=1;w.history[m]=f;}});
w.addEventListener('popstate',sched);
function start(){watch();run();timer=w.setInterval(tick,700);}
if(d.body)start();else d.addEventListener('DOMContentLoaded',start);
function shown(e){if(!e||!e.getClientRects().length)return false;var r=e.getBoundingClientRect(),cs=getComputedStyle(e);return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&+cs.opacity>0&&r.bottom>0&&r.top<w.innerHeight&&r.right>0&&r.left<w.innerWidth;}
function check(){var a=sub(),o=[];
 var nav=qa('#sb_conversations .nav-title')[0];o.push('menu "'+norm(nav&&nav.textContent)+'"');
 if(/^contacts\/smart_list/.test(a))o.push('guestVisibleOnScreen '+qa('#crm-contacts-view .tabulator-row').filter(function(r){return shown(r)&&/^Guest Visitor/i.test(norm((r.querySelector('.contact-name-link')||{}).textContent));}).length);
 if(/^conversations/.test(a)){o.push('plusVisible '+(qa('#conversations-layout [id^="new-conversation"],#conversations-layout .conversation-list-header .hr-button--primary').some(shown)?'y':'n'));
  o.push('labels you '+qa('[data-ari-who="you"]').filter(shown).length+' ari '+qa('[data-ari-who="ari"]').filter(shown).length+(stats.who_unsure?' (unsure: out '+stats.who_out+' ai '+stats.who_ai+')':''));}
 if(/^contacts\/detail|^conversations/.test(a)){o.push('assocVisible '+(qa('button.w-8.h-8').some(function(b){return /^(Associations|Companies|Add)/.test(b.getAttribute('data-ari-dfx-tip')||'')&&shown(b);})?'y':'n'));
  o.push('companiesPanelVisible '+(texts(/^(No Company created|Create new)$/i).some(function(t){return shown(t.parentElement);})?'y':'n'));
  o.push('emptyAriSectionVisible '+(qa('.hr-collapse-item').some(function(c){var h=norm((c.querySelector('.hr-collapse-item__header')||{}).textContent);var f=[].slice.call(c.querySelectorAll('input,textarea'));return /^Ari(?![a-z])(?! ?Chat Summary)/i.test(h)&&!f.some(function(x){return norm(x.value);})&&shown(c);})?'y':'n'));
  o.push('AIassistantVisible '+(texts(/\bAI assistant\b/i).some(function(t){return shown(t.parentElement);})?'y':'n'));}
 var nl=texts(/^(message|reading|ari chat)$/i).filter(function(t){return up(t,'.drawer-panel',15)&&shown(t.parentElement);});if(nl.length)o.push('notif MESSAGE '+nl.filter(function(t){return /^message$/i.test(norm(t.nodeValue));}).length+' READING '+nl.filter(function(t){return /^reading$/i.test(norm(t.nodeValue));}).length+' ARI CHAT '+nl.filter(function(t){return /^ari chat$/i.test(norm(t.nodeValue));}).length);
 if(/^calendars/.test(a))o.push('curlyVisible '+(qa('input').some(function(i){return /\{\{/.test(i.value||'')&&shown(i);})?'y':'n'));
 var f=qa('iframe[src*="ari-advisor"]')[0];if(f&&shown(f))o.push('askGapRight '+Math.round(w.innerWidth-f.getBoundingClientRect().right)+'px');
 var errs=Object.keys(stats).filter(function(k){return /^err_/.test(k);});o.push('errors '+(errs.length?errs.join(','):'none'));
 return 'CHECK '+a.replace(/[A-Za-z0-9]{20,}/g,'<id>')+' | '+o.join(' | ');}
w[K]={check:check,version:'dfx1f',run:run,stats:function(){return JSON.parse(JSON.stringify(stats));},
 stop:function(){stopped=true;w.clearInterval(timer);obs.forEach(function(o){o.disconnect();});roots().forEach(function(r){delete r.__ariDfxObs;});}};
})(window,document);

}catch(e){console.warn("ari block 55",e)}
try{

(function(w,d){var K='__ariJoin';if(w[K])return;
var HOOK='https://services.leadconnectorhq.com/hooks/8otTGBxdVFDsQ1gNhDg0/webhook-trigger/e246fb28-08ce-4aa4-b165-0cbc23ba9da5'; /* Karen pastes the URL from workflow "Ari - join chat hook" */
var st={};
function loc(){var m=location.pathname.match(/\/location\/([^\/]+)\//);return m?m[1]:'';}
function onChats(){return /\/conversations\/conversations/.test(location.pathname);}
function contactId(){var a=d.querySelector('a[href*="/contacts/detail/"]');if(!a)return '';var m=a.getAttribute('href').match(/contacts\/detail\/([A-Za-z0-9]+)/);return m?m[1]:'';}
function hasTag(){return [].some.call(d.querySelectorAll('.tag, .n-tag, [class*="tag"]'),function(e){return /psychic-took-over/.test(e.textContent||'');});}
function notes(){try{var cp=d.querySelector('#conversations-content');if(!cp)return '';
 var it=[].slice.call(cp.querySelectorAll('.message-item')),st0=0,i,out=[];
 for(i=0;i<it.length;i++){if(/has joined the chat/i.test(it[i].textContent||''))st0=i+1;}
 for(i=st0;i<it.length;i++){var e=it[i],b=e.querySelector('.chat-message');if(!b)continue;
  var you=e.querySelector('[data-ari-who="you"]')||(!e.querySelector('[data-ari-who="ari"],[class*="bg-[#EBE9FE]"],[class*="text-[#6938EF]"]')&&e.querySelector('.hr-avatar,.hr-avatar__container'));if(!you)continue;
  var t=(b.innerText||b.textContent||'').replace(/\s+$/,'').split('\n');
  if(t.length&&/^[^\s]{1,40}\u2728$/.test(t[t.length-1].trim()))t.pop();
  t=t.join(' ').replace(/\s+/g,' ').trim();if(t&&!/has joined the chat/i.test(t))out.push(t);}
 var s=out.join(' | ');return s.length>800?s.slice(-800):s;}catch(x){return '';}}
function call(action,cid,cb){var body={contact_id:cid,location_id:loc(),action:action};
 if(action==='handback'){try{body.notes=notes();}catch(x){body.notes='';}}
 fetch(HOOK,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
 .then(function(r){cb(r.ok);}).catch(function(){cb(false);});}
function render(){
 if(!onChats()){var o=d.getElementById('ari-join');if(o)o.remove();return;}
 var cid=contactId();var box=d.getElementById('ari-join');
 if(!cid){if(box)box.remove();return;}
 if(!box){box=d.createElement('div');box.id='ari-join';d.body.appendChild(box);}
 var paused=(st[cid]==='on')||(st[cid]!=='off'&&hasTag());
 if(box.dataset.cid===cid&&box.dataset.p===String(paused))return;
 box.dataset.cid=cid;box.dataset.p=String(paused);
 box.innerHTML=paused?'<span class="ari-join-note">Ari paused for this client</span><button type="button" class="ari-join-btn ari-join-back">Hand back to Ari</button>'
  :'<button type="button" class="ari-join-btn">Join chat</button>';
 box.querySelector('button').onclick=function(){var b=this;b.disabled=true;b.textContent='One moment...';
  call(paused?'handback':'join',cid,function(ok){b.disabled=false;
   if(ok){st[cid]=paused?'off':'on';}else{alert('That did not go through. Please try again.');}
   box.dataset.p='';render();});};}
var q=false,lr=0;new MutationObserver(function(){if(q)return;if(!onChats()&&!d.getElementById('ari-join'))return;q=true;w.setTimeout(function(){w.requestAnimationFrame(function(){q=false;lr=Date.now();try{render();}catch(e){}});},Math.max(0,250-(Date.now()-lr)));}).observe(d.body,{childList:true,subtree:true});/* chatsfix3 */
w[K]={version:'tkb1',render:render};render();
})(window,document);

}catch(e){console.warn("ari block 56",e)}
try{

(function(w,d){var K='__ariSig';if(w[K])return;
var SIG={'8otTGBxdVFDsQ1gNhDg0':'Lilah✨'};
function loc(){var m=location.pathname.match(/\/location\/([^\/]+)\//);return m?m[1]:'';}
function joined(){var b=d.getElementById('ari-join');return !!(b&&b.dataset.p==='true'&&/\/conversations\/conversations/.test(location.pathname));}
function label(){if(SIG[loc()])return SIG[loc()];
 var t=(d.body.innerText||'').match(/✨\s*([^\n✨]{1,40}?)\s+has joined the chat/g);
 if(!t)return '';var m=t[t.length-1].match(/✨\s*(.+?)\s+has joined the chat/);return m?m[1]+'✨':'';}
function isSend(el){var b=el&&el.closest&&el.closest('button,[role="button"]');if(!b||b.closest('#ari-join'))return null;
 var s=((b.getAttribute('aria-label')||'')+' '+(b.id||'')+' '+(b.className||'')+' '+(b.textContent||'')).toLowerCase();
 return /\bsend\b|send-?btn|send-?message/.test(s)&&!/schedul|later/.test(s)?b:null;}
function box(){var c=d.querySelectorAll('textarea, [contenteditable="true"]');for(var i=c.length-1;i>=0;i--){var e=c[i];if(e.offsetParent&&!e.closest('#ari-join'))return e;}return null;}
function sign(){var lb=label();if(!lb)return;var e=box();if(!e)return;
 var v=e.tagName==='TEXTAREA'?e.value:e.innerText;if(!v||!v.trim())return;
 var r=v.replace(/\s+$/,'');if(r.slice(-lb.length)===lb)return;var n=r+'\n'+lb;
 if(e.tagName==='TEXTAREA'){Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(e,n);}
 else{e.focus();var s=w.getSelection(),g=d.createRange();g.selectNodeContents(e);g.collapse(false);s.removeAllRanges();s.addRange(g);d.execCommand('insertText',false,'\n'+lb);}
 e.dispatchEvent(new Event('input',{bubbles:true}));}
d.addEventListener('pointerdown',function(ev){if(joined()&&isSend(ev.target)){try{sign();}catch(x){}}},true);
d.addEventListener('keydown',function(ev){if(ev.key==='Enter'&&(ev.ctrlKey||ev.metaKey)&&joined()){try{sign();}catch(x){}}},true);
w[K]={version:'tkb2',label:label};
})(window,document);

}catch(e){console.warn("ari block 57",e)}

try{
/* crd2: Ari Chats redesign (G.B.3.0 designs). Chats page only. Adds a banner, marks the panel name card, keeps Join chat above the input. */
(function(w,d){'use strict';var K='__ariChatsRedesignV1';if(w[K]){w[K].sync();return;}
var A='data-ari-crd',BID='ari-crd-banner',stopped=false,frame=null,obs=null,timer=null;
function on(){return /\/conversations\/conversations/.test(w.location.pathname)&&!!d.getElementById('conversations-layout');}
function mk(){var b=d.createElement('div');b.id=BID;b.setAttribute('aria-hidden','false');
 var s='';for(var i=0;i<26;i++){var x=(i*37+11)%100,y=(i*53+7)%90,z=i%5===0?'b':'';s+='<i class="ari-crd-star'+(z?' ari-crd-star--b':'')+'" style="left:'+x+'%;top:'+y+'%"></i>';}
 b.innerHTML='<div class="ari-crd-stars" aria-hidden="true">'+s+'</div><div class="ari-crd-eyebrow">YOUR CHATS</div><h1 class="ari-crd-title">Ari Chats</h1><div class="ari-crd-dots" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>';return b;}
function off(){var h=d.documentElement;h.removeAttribute(A);var b=d.getElementById(BID);if(b)b.remove();d.querySelectorAll('[data-ari-crd-name]').forEach(function(e){e.removeAttribute('data-ari-crd-name');});d.querySelectorAll('.ari-crd-spark').forEach(function(e){e.remove();});h.style.removeProperty('--ari-crd-join-b');}
function sync(){frame=null;if(stopped)return;if(!on()){if(d.documentElement.hasAttribute(A))off();return;}var h=d.documentElement;if(h.getAttribute(A)!=='v1')h.setAttribute(A,'v1');
 var lay=d.getElementById('conversations-layout');var b=d.getElementById(BID);if(!b||b.nextElementSibling!==lay){if(b)b.remove();lay.parentElement.insertBefore(mk(),lay);}
 /* panel name card: smallest box holding both the avatar and the name */
 var col=d.getElementById('conversations-right-column');if(col){var nm=col.querySelector('[data-ari-dname]'),av=col.querySelector('[data-ari-dav]');
  if(nm){var box=nm.parentElement;if(av){while(box&&box!==col&&!box.contains(av))box=box.parentElement;}if(box&&box!==col&&!box.hasAttribute('data-ari-crd-name')){var o=col.querySelector('[data-ari-crd-name]');if(o)o.removeAttribute('data-ari-crd-name');box.setAttribute('data-ari-crd-name','1');}
   if(box&&box!==col&&!box.querySelector('.ari-crd-spark')){var sp=d.createElement('span');sp.className='ari-crd-spark';sp.setAttribute('aria-hidden','true');sp.textContent='\u2726';box.appendChild(sp);}}}
 /* Join chat sits above the message input, never over it */
 var cb=d.querySelector('#conversations-central-panel-viewer [data-ari-composer-bar]');if(cb){var r=cb.getBoundingClientRect();if(r.height>0){var v=Math.max(16,Math.round(w.innerHeight-r.top+12))+'px';if(h.style.getPropertyValue('--ari-crd-join-b')!==v)h.style.setProperty('--ari-crd-join-b',v);}}
 /* banner reaches the right edge on desktop */
 b=d.getElementById(BID);if(b&&b.parentElement){var pr=b.parentElement.getBoundingClientRect(),g=w.innerWidth>767?Math.max(0,Math.min(80,Math.round(d.documentElement.clientWidth-pr.right))):0,gv=g+'px';if(h.style.getPropertyValue('--ari-crd-bgap')!==gv)h.style.setProperty('--ari-crd-bgap',gv);}
 /* phone: open each chat at the bottom, and stay there if already at the bottom */
 if(w.innerWidth<=767){var cp=d.querySelector('#conversations-central-panel-viewer .conversation-panel')||d.querySelector('.conversation-panel');if(cp){var key=w.location.pathname;
  if(!cp.__ariB){cp.__ariB=1;cp.__ariAt=true;cp.addEventListener('scroll',function(){cp.__ariAt=cp.scrollHeight-cp.scrollTop-cp.clientHeight<60;},{passive:true});}
  if(cp.__ariKey!==key){cp.__ariKey=key;cp.__ariAt=true;cp.__ariT=Date.now();}
  if((cp.__ariAt||Date.now()-cp.__ariT<2500)&&cp.scrollHeight-cp.scrollTop-cp.clientHeight>2){cp.scrollTop=cp.scrollHeight;cp.__ariAt=true;}}}}
function queue(){if(frame===null&&!stopped)frame=w.setTimeout(function(){w.requestAnimationFrame(sync);},200);}
function watch(){if(!d.body)return w.setTimeout(watch,50);obs=new w.MutationObserver(function(){if(on()||d.documentElement.hasAttribute(A))queue();});obs.observe(d.body,{childList:true,subtree:true});}
w.addEventListener('resize',queue);w.addEventListener('popstate',queue);timer=w.setInterval(queue,1500);watch();sync();
w[K]={version:'crd2',sync:sync,stop:function(){stopped=true;w.clearInterval(timer);if(obs)obs.disconnect();off();delete w[K];}};
})(window,document);
}catch(e){console.warn("ari block crd2",e)}
