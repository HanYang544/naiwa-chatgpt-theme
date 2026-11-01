import fs from 'node:fs/promises';
const port=Number(process.argv[2]);
if(!Number.isInteger(port)||port<1024||port>65535)throw Error('Invalid local port');
const targets=await(await fetch(`http://127.0.0.1:${port}/json/list`)).json();
const target=targets.find(t=>t.type==='page' && t.webSocketDebuggerUrl && !/devtools/i.test(t.url));
if(!target)throw Error('No app page');
const socket=new WebSocket(target.webSocketDebuggerUrl);
await new Promise((ok,no)=>{socket.onopen=ok;socket.onerror=no;});
let seq=0;const pending=new Map();
socket.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}};
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));});
if(process.argv.includes('--restore')){
 await send('Runtime.evaluate',{expression:"document.getElementById('naiwa-enhanced-style')?.remove();document.getElementById('naiwa-visible-character')?.remove();"});
 console.log('Naiwa enhancement removed');socket.close();process.exit(0);
}
const asset=await fs.readFile(new URL('../theme/assets/naiwa.png',import.meta.url));
const img='data:image/png;base64,'+asset.toString('base64');
const css=`
:root{--naiwa-ink:#432b1b;--naiwa-bg:#fff6d9;--naiwa-line:#b47b2c}
body{background:var(--naiwa-bg)!important;color:var(--naiwa-ink)!important}
main{background:#fff6d9!important}
[data-composer-body]{border-radius:26px!important;border:2px solid #c28c3a!important;background:#fffbea!important;}
button,[role="button"]{border-radius:16px!important;transition:none!important}
button:not(:disabled):hover,[role="button"]:not([aria-disabled="true"]):hover{background-color:#ffe6a0!important;color:#432b1b!important}
button:focus-visible,[role="button"]:focus-visible{outline:3px solid #995200!important;outline-offset:2px!important}
[role="tab"][aria-selected="true"],button[aria-pressed="true"],[aria-current="page"]{background:#ffdc79!important;color:#432b1b!important;border-radius:16px!important;}
.composer-surface-chrome,[data-open-chatgpt-skin-surface="composer"]{border-radius:26px!important;border:2px solid #c28c3a!important;background:#fffbea!important;}
[role="menu"],[role="dialog"]{border-radius:20px!important;border-color:#c28c3a!important}
#naiwa-visible-character{position:fixed;right:20px;bottom:150px;width:clamp(96px,12vw,180px);z-index:30;pointer-events:none;user-select:none;filter:none;contain:layout style}
#naiwa-visible-character img{display:block;width:100%;height:auto}
#naiwa-visible-character span{display:block;text-align:center;color:#68411d;background:#fff1bc;border:1px solid #c28c3a;border-radius:999px;padding:4px 8px;font-size:12px}
@media(max-width:1000px){#naiwa-visible-character{width:84px;right:8px;bottom:180px;opacity:.75}#naiwa-visible-character span{display:none}}
@media(max-width:650px){#naiwa-visible-character{width:54px;bottom:180px;opacity:.5}}
`;
const expression=`(()=>{document.getElementById('naiwa-enhanced-style')?.remove();document.getElementById('naiwa-visible-character')?.remove();const style=document.createElement('style');style.id='naiwa-enhanced-style';style.textContent=${JSON.stringify(css)};document.head.append(style);const host=document.createElement('div');host.id='naiwa-visible-character';host.setAttribute('aria-hidden','true');const img=document.createElement('img');img.src=${JSON.stringify(img)};img.alt='';host.append(img);const label=document.createElement('span');label.textContent='奶娃陪你 · 齁齁齁';host.append(label);document.body.append(host);return {installed:true,buttons:document.querySelectorAll('button').length,characterWidth:Math.round(host.getBoundingClientRect().width),buttonRadius:document.querySelector('button')?getComputedStyle(document.querySelector('button')).borderRadius:null};})()`;
const r=await send('Runtime.evaluate',{expression,returnByValue:true});
if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));
console.log(JSON.stringify(r.result.value));

socket.close();


