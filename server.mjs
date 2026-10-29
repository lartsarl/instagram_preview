import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css'};
const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1');
  if(url.pathname==='/api/connection'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({connected:false,message:'Instagram connection requires a Meta developer app. See the included connection guide.'}));return;}
  const file={'/':'index.html','/app.js':'app.js','/style.css':'style.css'}[url.pathname];
  if(!file){res.writeHead(404);res.end('Not found');return;}
  try{res.setHeader('Content-Type',types[path.extname(file)]);res.setHeader('X-Content-Type-Options','nosniff');res.end(await readFile(path.join(root,file)));}catch{res.writeHead(500);res.end('Unable to load file');}
});
server.listen(4317,'127.0.0.1',()=>console.log('Feed Studio: http://127.0.0.1:4317'));


