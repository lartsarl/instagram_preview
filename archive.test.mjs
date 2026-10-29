import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readInstagramArchive} from './archive.js';
function file(path,content=''){const blob=new Blob([content]);return Object.assign(blob,{name:path.split('/').pop(),webkitRelativePath:path})}
test('imports posts and reels by date, groups carousels and ignores private messages',async()=>{
 const files=[file('export/your_instagram_activity/content/posts_1.json',JSON.stringify([{title:'A caption',media:[{uri:'media/posts/a.jpg',creation_timestamp:10},{uri:'media/posts/b.jpg'}]}])),file('export/your_instagram_activity/content/reels.json',JSON.stringify({ig_reels_media:[{media:[{uri:'media/reels/r.mp4',creation_timestamp:20,title:'Reel'}]}]})),file('export/messages/posts_ignored.json','{}'),file('export/messages/inbox.json','{"media":[{"uri":"media/private.jpg"}]}'),file('export/media/posts/a.jpg'),file('export/media/reels/r.mp4')];
 const result=await readInstagramArchive(files);assert.equal(result.items.length,2);assert.equal(result.items[0].caption,'Reel');assert.equal(result.items[1].mediaCount,2);assert.equal(result.items[1].caption,'A caption');assert.equal(result.items[0].status,'published');
 const again=await readInstagramArchive(files,new Set(result.items.map(x=>x.sourceKey)));assert.equal(again.items.length,0);assert.equal(again.duplicates,2);
});
test('reports malformed JSON and missing media without inventing posts',async()=>{
 const r=await readInstagramArchive([file('export/posts_1.json','broken'),file('export/posts_2.json',JSON.stringify([{media:[{uri:'media/missing.jpg'}]}]))]);assert.equal(r.invalid,1);assert.equal(r.missing,1);assert.equal(r.items.length,0);
});
test('rejects HTML-only exports with useful instructions',async()=>{await assert.rejects(()=>readInstagramArchive([file('export/posts.html')]),/JSON download/)});
test('does not substitute files with matching basenames',async()=>{const r=await readInstagramArchive([file('export/posts_1.json',JSON.stringify([{media:[{uri:'media/posts/a.jpg'}]}])),file('export/media/messages/a.jpg')]);assert.equal(r.missing,1);assert.equal(r.items.length,0)});
