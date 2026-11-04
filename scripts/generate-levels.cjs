const fs=require('fs'),vm=require('vm'),path=require('path');
process.chdir(path.join(__dirname,'..'));
const source=fs.readFileSync('index.html','utf8'),sandbox={module:{exports:{}}};
vm.runInNewContext(source.slice(source.indexOf('const DIRS'),source.indexOf('const LEVELS'))+';module.exports={parse,move,solve,solved}',sandbox);
const {parse,move,solve,solved}=sandbox.module.exports;
const html=source;
const levels=JSON.parse(html.match(/const LEVELS = (\[.*?\]);/s)[1]).slice(0,60);
let seed=20261104;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
const seen=new Set(levels.map(l=>l.g.join('/')));let attempts=0;
while(levels.length<500){
 attempts++;const n=levels.length+1,t=(n-61)/440,w=7+(t>.35?1:0)+(t>.8?1:0),h=w+1,k=t<.22?2:t<.65?3:4;
 let a=Array.from({length:w*h},(_,i)=>i<w||i>=w*(h-1)||i%w===0||i%w===w-1?'#':rand()<.15?'#':'.');
 let cells=a.map((v,i)=>v==='.'?i:-1).filter(i=>i>=0);let q=[cells[0]],visited=new Set(q);
 for(let i=0;i<q.length;i++)for(let d of [-1,1,-w,w]){let p=q[i]+d;if(a[p]==='.'&&!visited.has(p)){visited.add(p);q.push(p)}}
 if(visited.size!==cells.length)continue;
 for(let i=cells.length-1;i>0;i--){let j=Math.floor(rand()*(i+1));[cells[i],cells[j]]=[cells[j],cells[i]]}
 for(let j=0;j<k;j++){a[cells.pop()]=String.fromCharCode(65+j);a[cells.pop()]=String.fromCharCode(97+j)}
 if(n%4===0)for(let j=0;j<2;j++)a[cells.pop()]='*';
 const g=Array.from({length:h},(_,y)=>a.slice(y*w,(y+1)*w).join('')),key=g.join('/');if(seen.has(key))continue;
 const L=parse(g),path=solve(L,L.start,21,22000),min=5+Math.floor(t*5);
 if(!path||path.length<min)continue;
 let p=L.start;for(const d of path)p=move(L,p,d).pos;if(!solved(p))throw Error('invalid');
 seen.add(key);levels.push({g,o:path.length,s:path.join('')});
 if(levels.length%50===0)console.log(levels.length,'levels',attempts,'candidates');
}
// Recompute original optimal paths too, preserving every original grid and index.
for(const l of levels){if(l.s)continue;const L=parse(l.g),p=solve(L,L.start);if(!p)throw Error('old unsolved');l.s=p.join('');l.o=p.length}
fs.writeFileSync('index.html',html.replace(/const LEVELS = \[.*?\];/s,()=> 'const LEVELS = '+JSON.stringify(levels)+';'));console.log('Verified',levels.length,'unique levels');
