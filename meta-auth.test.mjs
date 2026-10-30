import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createMetaAuth} from './meta-auth.mjs';
const config={appId:'123',configId:'456',accountId:'789',secret:'test-secret',loginUrl:'https://www.facebook.com/dialog/oauth',redirect:'http://localhost:4317/auth/callback',version:'v25.0'};
function response(){return {headers:{},writeHead(status,headers){this.status=status;Object.assign(this.headers,headers)},setHeader(k,v){this.headers[k]=v},end(){}}}
test('rejects missing or forged OAuth state without making token requests',async()=>{let calls=0;const auth=createMetaAuth(config,async()=>{calls++;});await assert.rejects(()=>auth.callback({headers:{}},response(),new URL('http://localhost/auth/callback?code=x&state=bad')),/mismatch/);assert.equal(calls,0)});
test('binds OAuth state to browser, consumes once and keeps token out of status',async()=>{
 const requests=[];const auth=createMetaAuth(config,async(url,opts)=>{requests.push({url,opts});return {ok:true,json:async()=>({access_token:'private-token',expires_in:3600})}});
 const r=response();auth.start({headers:{}},r);const state=new URL(r.headers.Location).searchParams.get('state');const req={headers:{cookie:r.headers['Set-Cookie'].split(';')[0]}};const url=new URL(`http://localhost/auth/callback?state=${state}&code=valid`);const done=response();await auth.callback(req,done,url);
 assert.equal(done.status,303);assert.equal(requests[0].opts.body.get('client_secret'),'test-secret');assert.equal(requests[0].opts.body.get('redirect_uri'),config.redirect);
 const connected={headers:{cookie:done.headers['Set-Cookie'].split(';')[0]}};assert.equal(auth.status(connected).connected,true);assert.ok(!JSON.stringify(auth.status(connected)).includes('private-token'));
 await assert.rejects(()=>auth.callback(req,response(),url),/mismatch/);auth.disconnect(connected,response());assert.equal(auth.status(connected).connected,false);
});
test('rejects non-Meta login URLs and hides upstream secrets on error',async()=>{
 assert.throws(()=>createMetaAuth({...config,loginUrl:'https://evil.test'}).start({headers:{}},response()),/HTTPS login URL/);
 const auth=createMetaAuth(config,async()=>({ok:false,json:async()=>({error:{message:'private-token'}})}));const r=response();auth.start({headers:{}},r);const state=new URL(r.headers.Location).searchParams.get('state');await assert.rejects(()=>auth.callback({headers:{cookie:r.headers['Set-Cookie'].split(';')[0]}},response(),new URL(`http://localhost/?code=a&state=${state}`)),e=>!e.message.includes('private-token'));
});
