// Parse only post/reel metadata, never messages or unrelated account data.
const metadataPattern=/(?:^|\/)(?:posts(?:_\d+)?|reels(?:_\d+)?|your_posts(?:_\d+)?|your_reels(?:_\d+)?)\.json$/i;
const normalize=p=>decodeURI(p).replaceAll('\\','/').replace(/^\.\//,'');
function mediaType(name){const ext=name.split('.').pop().toLowerCase();return ({jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp',heic:'image/heic',mp4:'video/mp4',mov:'video/quicktime',m4v:'video/mp4'})[ext]||''}
function records(value){if(Array.isArray(value))return value.flatMap(records);if(!value||typeof value!=='object')return [];if(Array.isArray(value.media))return [value];return Object.values(value).flatMap(records)}
export async function readInstagramArchive(files,existingKeys=new Set()){
  const all=[...files],index=new Map();
  for(const file of all){let name;try{name=normalize(file.webkitRelativePath||file.name)}catch{continue}index.set(name,file)}
  function find(uri){let target;try{target=normalize(uri)}catch{return null}if(index.has(target))return index.get(target);const matches=[...index].filter(([key])=>key.endsWith('/'+target));return matches.length===1?matches[0][1]:null}
  const metadata=all.filter(f=>{const p=(f.webkitRelativePath||f.name).replaceAll('\\','/');return metadataPattern.test(p)&&!/(?:^|\/)(?:messages|inbox|stories|archived_posts)(?:\/|$)/i.test(p)});
  if(!metadata.length)throw new Error('No posts/reels JSON found. Request a JSON download, unzip it, then select the entire extracted folder.');
  const additions=[],seen=new Set(existingKeys);let missing=0,duplicates=0,invalid=0;
  for(const file of metadata){let data;try{data=JSON.parse(await file.text())}catch{invalid++;continue}
    for(const post of records(data)){
      const first=post.media[0];if(!first||typeof first.uri!=='string'){missing++;continue}
      const key='instagram:'+first.uri; if(seen.has(key)){duplicates++;continue}
      const blob=find(first.uri),type=mediaType(first.uri);if(!blob||!type){missing++;continue}
      seen.add(key);const time=Number(first.creation_timestamp||post.creation_timestamp)||0;
      additions.push({id:crypto.randomUUID(),sourceKey:key,name:blob.name,type,blob,status:'published',caption:typeof post.title==='string'&&post.title?post.title:(typeof first.title==='string'?first.title:''),crop:50,timestamp:time,mediaCount:post.media.length});
    }
  }
  additions.sort((a,b)=>b.timestamp-a.timestamp);
  return {items:additions,missing,duplicates,invalid,metadataFiles:metadata.length};
}
