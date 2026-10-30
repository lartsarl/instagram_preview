import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createMetaAuth} from './meta-auth.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
try{const env=await readFile(path.join(root,'.env'),'utf8');for(const line of env.split(/\r?\n/)){const m=line.match(/^([A-Z_]+)=(.*)$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].trim().replace(/^(["'])(.*)\1$/,'$2')}}catch(e){if(e.code!=='ENOENT')throw e}
const config={appId:process.env.META_APP_ID||'28911133625163405',configId:process.env.META_CONFIG_ID||'1142718088621731',accountId:process.env.INSTAGRAM_ACCOUNT_ID||'17841420312901672',secret:process.env.META_APP_SECRET||'',loginUrl:process.env.META_LOGIN_URL||'',redirect:process.env.META_REDIRECT_URI||'http://localhost:4317/auth/callback',version:process.env.META_API_VERSION||'v25.0'};
const auth=createMetaAuth(config);
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css'};
const server=http.createServer(async(req,res)=>{
  res.setHeader('Cache-Control','no-store');res.setHeader('Referrer-Policy','no-referrer');
  function json(value,status=200){res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(value))}
  try{
  const allowed=new Set(['localhost:4317','127.0.0.1:4317',new URL(config.redirect).host]);
  if(!allowed.has(req.headers.host)){json({error:'Unknown host'},403);return}
  if(req.method!=='GET'&&!['http://localhost:4317','http://127.0.0.1:4317',auth.origin].includes(req.headers.origin)){json({error:'Origin rejected'},403);return}
  const url=new URL(req.url,'http://127.0.0.1');
  if(req.method==='GET'&&url.pathname==='/api/connection'){json(auth.status(req));return;}
  if(req.method==='GET'&&url.pathname==='/auth/start'){if(req.headers.host!==new URL(auth.origin).host){res.writeHead(302,{Location:auth.origin+'/auth/start'});res.end();return}auth.start(req,res);return;}
  if(req.method==='GET'&&url.pathname==='/auth/callback'){await auth.callback(req,res,url);return;}
  if(req.method==='GET'&&url.pathname==='/api/instagram/feed'){json(await auth.feed(req,url.searchParams.get('after')));return;}
  if(req.method==='POST'&&url.pathname==='/api/disconnect'){auth.disconnect(req,res);json({connected:false});return;}
  const file={'/':'index.html','/app.js':'app.js','/archive.js':'archive.js','/style.css':'style.css'}[url.pathname];
  if(!file||req.method!=='GET'){res.writeHead(404);res.end('Not found');return;}
  try{res.setHeader('Content-Type',types[path.extname(file)]);res.setHeader('X-Content-Type-Options','nosniff');res.end(await readFile(path.join(root,file)));}catch{res.writeHead(500);res.end('Unable to load file');}
  }catch(error){const known=/^(Meta rejected|Add META_|Use the HTTPS|Too many|Login expired|Authorization was|Meta did not|Connect Instagram first|Invalid page)/.test(error.message);json({error:known?error.message:'Connection failed. Check server configuration and try again.'},400)}
});
server.listen(4317,'127.0.0.1',()=>console.log('Feed Studio: http://127.0.0.1:4317'));



