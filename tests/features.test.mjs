import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const entry=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const closet=Buffer.from(entry.match(/const CLOSET_B64="([A-Za-z0-9+/=]+)";/)?.[1]||'','base64').toString();
function source(name){const start=closet.indexOf(`function ${name}(`);assert.ok(start>=0,name);const end=closet.indexOf('\nfunction ',start+1);return closet.slice(start,end<0?undefined:end)}
function run(ctx,names){vm.runInContext(names.map(source).join('\n'),ctx)}

// Named revisions are immutable snapshots, even while an older version is reviewed.
test('saved versions retain unique IDs, timestamps and snapshots on review',()=>{
  let serial=0,db={projects:[{id:'p',state:{points:[{x:0,y:0}]},revisions:[],closetState:{runs:[]}}]};
  const state={record:structuredClone(db.projects[0]),doc:{runs:[{id:'first'}]},rooms:[],selected:{kind:null},multiSelected:[],dirty:true};
  const ctx=vm.createContext({state,Date,Array,Math,JSON,uid:()=>`rev-${++serial}`,n:Number,clone:structuredClone,readDB:()=>structuredClone(db),writeDB:d=>{db=structuredClone(d)},render:()=>{},renderVersions:()=>{},toast:()=>{},migrate:x=>structuredClone(x),roomSnapshots:()=>[],normalizeRoom:x=>x,ensureViewerCamera:()=>{}});
  run(ctx,['createRevision','reviewVersion','returnWorkingVersion']);
  ctx.createRevision();state.doc.runs[0].id='second';ctx.createRevision();
  assert.equal(db.projects[0].revisions.length,2);
  assert.notEqual(db.projects[0].revisions[0].id,db.projects[0].revisions[1].id);
  assert.ok(db.projects[0].revisions.every(v=>!Number.isNaN(Date.parse(v.createdAt))));
  ctx.reviewVersion('rev-1');assert.equal(state.doc.runs[0].id,'first');assert.equal(db.projects[0].revisions[1].closetState.runs[0].id,'second');
  ctx.returnWorkingVersion();assert.equal(state.doc.runs[0].id,'second');
});

test('fronts ease across one second, with travel and swing bounded by room clearance',()=>{
  let time=0;const state={doc:{runs:[]}},w={id:'w',roomKey:'room',a:{x:0,y:0},ux:1,uy:0,nx:0,ny:1,length:100};
  const room={key:'room',closed:true,points:[{x:0,y:0},{x:100,y:0},{x:100,y:60},{x:0,y:60}],walls:[w],obstacles:[]};
  const ctx=vm.createContext({state,Math,Map,performance:{now:()=>time},requestAnimationFrame:()=>1,renderCanvas:()=>{},wall:()=>w,pointInPoly:p=>p.x>0&&p.x<100&&p.y>0&&p.y<60,obstacleBasis:x=>x,runWidth:r=>r.width,sectionDepth:(r,s)=>s.depth,n:Number});
  state.rooms=[room];vm.runInContext('const frontAnimations=new Map();let frontAnimationRAF=0;',ctx);
  run(ctx,['frontProgress','startFrontAnimation','frontPointFits','frontClearance','doorSwingLimit']);
  ctx.startFrontAnimation('front',0,1);assert.equal(ctx.frontProgress('front',true),0);
  time=500;assert.equal(ctx.frontProgress('front',true),.5);
  time=1000;assert.equal(ctx.frontProgress('front',true),1);
  const own={id:'own',wallId:'w',offset:5,width:40,depth:16,sections:[{depth:16}]};state.doc.runs=[own];
  assert.equal(ctx.frontClearance(own,own.sections[0],6,24,16,20),20);
  room.obstacles=[{x:18,y:30,width:22,depth:3,z:0,height:70,ux:1,uy:0,vx:0,vy:1}];
  assert.ok(ctx.frontClearance(own,own.sections[0],6,24,16,20)<20);
  assert.ok(ctx.doorSwingLimit(own,own.sections[0],6,24,16,1)<Math.PI/2);
});

test('material preview changes the selected room surfaces only after Keep',()=>{
  const doc={runs:[{id:'run',materialCode:'M1'}]},state={doc,rooms:[{key:'room',walls:[{id:'wall'}]}]};
  const controls={materialWall:{value:'wall'},materialFloor:{value:'room'},rouletteStatus:{textContent:''},rouletteKeep:{disabled:true},rouletteCancel:{disabled:true}};
  const ctx=vm.createContext({state,Math,ROOM_MATERIALS:{paint:{name:'Paint',hex:'#eeeeee'},oak:{name:'Oak',hex:'#aaaaaa'},concrete:{name:'Concrete',hex:'#aaaaaa'},plaster:{name:'Plaster',hex:'#dddddd'},stone:{name:'Stone',hex:'#bbbbbb'},grasscloth:{name:'Grasscloth',hex:'#cccccc'},walnut:{name:'Walnut',hex:'#777777'},wallOak:{name:'Wall Oak',hex:'#aaaaaa'},slate:{name:'Slate',hex:'#666666'},brick:{name:'Brick',hex:'#aaaaaa'}},$:id=>controls[id],renderCanvas:()=>{}});
  vm.runInContext('let materialPreview=null;',ctx);run(ctx,['roomVisual','surfaceMaterial','renderRouletteStatus','rouletteShuffle','clearRoulette']);
  ctx.rouletteShuffle();const first=ctx.surfaceMaterial('walls','wall').name;
  assert.deepEqual({...doc.roomVisual.walls},{});assert.deepEqual({...doc.roomVisual.floors},{});
  ctx.rouletteShuffle();assert.notEqual(ctx.surfaceMaterial('walls','wall').name,first);
  assert.equal(doc.runs[0].materialCode,'M1');ctx.clearRoulette();assert.equal(ctx.surfaceMaterial('walls','wall').name,'Paint');
});

test('layout shuffle creates three valid, distinct alternatives without replacing current design',()=>{
  const original={runs:[{id:'run',height:84,depth:16,sections:[{id:'s1',width:24,type:'Open',components:[]},{id:'s2',width:24,type:'Open',components:[]}]}]};
  const state={doc:original,layoutDraft:null};let renders=0;const buttons={preview:[],apply:[]};const root={innerHTML:'',querySelectorAll:s=>s==='[data-preview-layout]'?buttons.preview:s==='[data-apply-layout]'?buttons.apply:[]};
  const ctx=vm.createContext({state,Math,clone:structuredClone,presetComponents:type=>[{type}],sectionDepth:()=>16,rebuildPartitions:()=>{},projectIssues:()=>[],toast:()=>{},render:()=>{renders++},$:()=>root,esc:x=>String(x),fmt:n=>String(n),commit:(_label,fn)=>fn()});
  vm.runInContext('let layoutVariants=[];',ctx);run(ctx,['generateLayoutVariants','renderLayoutList','returnLayout']);
  ctx.generateLayoutVariants();const variants=vm.runInContext('layoutVariants',ctx);
  assert.equal(variants.length,3);assert.equal(new Set(variants.map(v=>JSON.stringify(v.runs.map(r=>r.sections.map(s=>s.type))))).size,3);
  assert.equal(state.doc,original);assert.equal(original.runs[0].sections[0].type,'Open');
  const preview={dataset:{previewLayout:'1'}};buttons.preview=[preview];ctx.renderLayoutList();preview.onclick();assert.notEqual(state.doc,original);assert.equal(original.runs[0].sections[0].type,'Open');
  ctx.returnLayout();assert.equal(state.doc,original);assert.ok(renders>0);
});

test('visual props and dog positions stay clear of runs, walls and obstacles',()=>{
  const wall={id:'w',roomKey:'room',a:{x:0,y:0},ux:1,uy:0,nx:0,ny:1,length:100};
  const state={doc:{runs:[{id:'run',wallId:'w',offset:0,width:40,depth:16,sections:[{depth:16}]}],visualProps:[{id:'rug',type:'Rug',x:70,y:40}]},rooms:[{key:'room',closed:true,points:[{x:0,y:0},{x:100,y:0},{x:100,y:80},{x:0,y:80}],walls:[wall],obstacles:[]}]};
  const ctx=vm.createContext({state,Math,wall:()=>wall,pointInPoly:p=>p.x>0&&p.x<100&&p.y>0&&p.y<80,runWidth:r=>r.width,sectionDepth:()=>16,obstacleBasis:x=>x});run(ctx,['visualProps','visualPositionFits']);
  assert.equal(ctx.visualPositionFits({x:20,y:15},8),false);
  assert.equal(ctx.visualPositionFits({x:70,y:40},8),false);
  assert.equal(ctx.visualPositionFits({x:55,y:62},8),true);
  assert.equal(ctx.visualPositionFits({x:70,y:40},8,'rug'),true);
});

test('build reveal places every part in order without skipping later pieces',()=>{
  const doc={runs:[{id:'run'}]},ctx=vm.createContext({Math,reveal:{active:true,paused:false,elapsed:0,duration:0,interval:350,totals:[1,20,1,1]},state:{doc},revealCounts:[0,0,0,0]});
  run(ctx,['revealStage','revealAllows']);
  assert.equal(ctx.revealAllows({'data-occluder':'partition'}),true);
  assert.equal(ctx.revealAllows({'data-occluder':'drawer-front'}),false);
  ctx.reveal.elapsed=18*350;vm.runInContext('revealCounts.fill(0)',ctx);
  for(let i=0;i<20;i++)assert.equal(ctx.revealAllows({'data-occluder':'shelf'}),i<=17,`piece ${i+1}`);
  ctx.reveal.elapsed=21*350;vm.runInContext('revealCounts.fill(0)',ctx);assert.equal(ctx.revealAllows({'data-occluder':'drawer-front'}),true);
  assert.equal(ctx.revealAllows({'data-occluder':'door-front'}),false);
  ctx.reveal.elapsed=22*350;vm.runInContext('revealCounts.fill(0)',ctx);assert.equal(ctx.revealAllows({'data-occluder':'door-front'}),true);
  assert.deepEqual(doc,{runs:[{id:'run'}]});
});

test('mood changes illumination without writing to closet or material state',()=>{
  const doc={runs:[{id:'run'}],roomVisual:{walls:{w:'brick'},floors:{r:'oak'}}};
  const state={doc,rooms:[]},povImage={brightness:1,ambient:0,shadows:0,contrast:1,warmth:0};
  const MOODS={Ideal:{brightness:1,warmth:0,contrast:1,ambient:0,shadows:0},'Golden Hour':{brightness:1.02,warmth:15,contrast:1.05,ambient:.08,shadows:.26}};
  const ctx=vm.createContext({state,Math,Number,n:Number,povImage,MOODS,visualMood:'Ideal'});
  run(ctx,['povFaceColor']);const face={pts:[{x:0,y:0,z:0},{x:10,y:0,z:0},{x:10,y:10,z:0}],fill:'#b29f84'},before=Array.from(ctx.povFaceColor(face));
  ctx.visualMood='Golden Hour';assert.notDeepEqual(Array.from(ctx.povFaceColor(face)),before);assert.deepEqual(doc,{runs:[{id:'run'}],roomVisual:{walls:{w:'brick'},floors:{r:'oak'}}});
});

test('Murphy and Sunny advance independently and stop before a blocked floor position',()=>{
  const actors=new Map([['Murphy',{x:20,y:40,target:{x:30,y:40},heading:0,pause:0,pose:'walk',stride:0}],['Sunny',{x:43.9,y:40,target:{x:60,y:40},heading:0,pause:0,pose:'walk',stride:0}]]);
  const state={doc:{runs:[],visualDogs:{Murphy:true,Sunny:true}},view:'3d'};let rendered=0;
  const ctx=vm.createContext({state,Math,Map,dogActors:actors,dogNames:['Murphy','Sunny'],visualDogs:()=>state.doc.visualDogs,visualPositionFits:p=>p.x<44,randomDogTarget:()=>null,renderCanvas:()=>rendered++,requestAnimationFrame:()=>1,reveal:{active:false,paused:false,elapsed:0,duration:8000},renderRevealStatus:()=>{}});
  vm.runInContext('let visualLast=0,visualRAF=0;',ctx);run(ctx,['animateVisuals']);
  ctx.animateVisuals(100);ctx.animateVisuals(150);
  assert.ok(actors.get('Murphy').x>20);assert.equal(actors.get('Sunny').x,43.9);assert.equal(actors.get('Sunny').target,null);
  assert.equal(state.doc.runs.length,0);assert.ok(rendered>0);
});
