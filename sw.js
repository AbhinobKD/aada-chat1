/* AADAmeet watch-together: answers the video element's range requests with bytes supplied by the open page. Keep this file next to the app's HTML. */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{const m=/\/vstream\/([\w-]+)$/.exec(new URL(e.request.url).pathname);if(m)e.respondWith(serve(e,m[1]))});
async function serve(e,sid){
 const r=/bytes=(\d+)-(\d*)/.exec(e.request.headers.get('range')||''),start=r?+r[1]:0,end=r&&r[2]?+r[2]:start+4194303;
 const c=(e.clientId&&await self.clients.get(e.clientId))||(await self.clients.matchAll({type:'window'}))[0];
 if(!c)return new Response('',{status:503});
 const rep=await new Promise(ok=>{const ch=new MessageChannel;ch.port1.onmessage=ev=>ok(ev.data);c.postMessage({sid,start,end},[ch.port2]);setTimeout(()=>ok(0),90000)});
 if(rep===0)return new Response('',{status:504});
 if(!rep)return new Response('',{status:404});
 const n=rep.buf.byteLength;
 if(!n)return new Response('',{status:416,headers:{'Content-Range':'bytes */'+rep.size}});
 return new Response(rep.buf,{status:206,headers:{'Content-Type':rep.type,'Accept-Ranges':'bytes','Content-Length':n,'Content-Range':'bytes '+start+'-'+(start+n-1)+'/'+rep.size}})}
