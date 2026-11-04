const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8'),sandbox={module:{exports:{}}};
vm.runInNewContext(html.slice(html.indexOf('const DIRS'),html.indexOf('const LEVELS'))+';module.exports={parse,move,solve,solved}',sandbox);
const {parse,move,solve,solved}=sandbox.module.exports,levels=JSON.parse(html.match(/const LEVELS = (\[.*?\]);/s)[1]);
assert.equal(levels.length,500);const keys=new Set();
for(const [i,l] of levels.entries()){
 assert(!keys.has(l.g.join('/')));keys.add(l.g.join('/'));
 const L=parse(l.g);let p=L.start.slice();
 assert.equal(l.s.length,l.o);
 for(const d of l.s){const r=move(L,p,d);assert.notEqual(r.pos.join(),p.join());p=r.pos;}
 assert(solved(p),'Unsolved level '+(i+1));
 assert(!solve(L,L.start,l.o-1,30000),'Nonoptimal par '+(i+1));
 if(i>=60){const cells=L.cell.map((c,j)=>c!==1?j:-1).filter(j=>j>=0),q=[cells[0]],v=new Set(q);for(let j=0;j<q.length;j++)for(const d of [-1,1,-L.w,L.w]){const n=q[j]+d;if(L.cell[n]!==undefined&&L.cell[n]!==1&&!v.has(n)){v.add(n);q.push(n)}}assert.equal(v.size,cells.length);}
}
console.log('PASS: 500 unique solvable levels; solution replay, connected new boards, bounded shorter-path search.');
