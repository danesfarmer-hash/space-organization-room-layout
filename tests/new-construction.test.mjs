import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const entry=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const closet=Buffer.from(entry.match(/const CLOSET_B64="([A-Za-z0-9+/=]+)";/)?.[1]||'','base64').toString();
function source(name){const start=closet.indexOf(`function ${name}(`);assert.ok(start>=0,name);const end=closet.indexOf('\nfunction ',start+1);return closet.slice(start,end<0?undefined:end)}
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} differs from ${b}`);

test('KB bottom meets the 64 mm toe kick at a boundary, including normalized old shelves',()=>{
  const MM=1/25.4,DEFAULTS={toeKick:64*MM,shelf:.75};let id=0;
  const ctx=vm.createContext({MM,DEFAULTS,uid:()=>`part-${++id}`,n:(x,d=0)=>Number.isFinite(Number(x))?Number(x):d,system32:{snapDown:x=>x-0.25}});
  vm.runInContext([source('makeComponent'),source('fixedShelf'),source('enforceTopShelfRule')].join('\n'),ctx);
  const kb=ctx.fixedShelf('KB',10);near(kb.z,64*MM);
  kb.z=2;const section={type:'Shelves',components:[kb]};ctx.enforceTopShelfRule({height:84},section);
  near(kb.z,64*MM);near(0+DEFAULTS.toeKick,kb.z);
  assert.equal(kb.fixed,true);
});

test('shoe board rises exactly 64 mm toward back, with the front lip on its leading edge',()=>{
  const faces=[],ctx=vm.createContext({MM:1/25.4,revealAllows:()=>true,spacePoint:(x,y,z)=>({x,y,z}),face3:(_canvas,face)=>faces.push(face)});
  vm.runInContext([source('cuboidFaces'),source('shoeShelf3')].join('\n'),ctx);
  ctx.shoeShelf3({},0,0,20,24,16,.75,'#fff',{});
  assert.equal(faces.length,6);
  const bottom=faces[0],top=faces[1];
  near(bottom[0].z-bottom[1].z,64/25.4);
  near(top[0].z-top[3].z,64/25.4);
  near(top[2].z,20+.75);faces.length=0;ctx.shoeShelf3({},0,15,20+.75,24,1,1.25,'#fff',{},64/25.4/16);near(faces[0][0].z,top[3].z+64/25.4/16);near(faces[0][1].z,top[2].z);
  assert.match(closet,/shoeShelf3\(c,x\+tf\.xOffset,tf\.depth-1,comp\.z\+comp\.thickness,tf\.width,1,n\(comp\.lip,1\.25\)/);
  assert.match(closet,/'data-shoe-lip':'front'/);
});

function panelHarness(){
  let serial=0;const r={id:'run',wallId:'wall',offset:10,depth:16,height:84,thickness:.75,fillerStart:0,fillerEnd:0,sections:[{id:'a',width:24,type:'Double Hang',locked:false,depth:16},{id:'b',width:24,type:'Shelves',locked:false,depth:16},{id:'c',width:24,type:'Double Hang',locked:false,depth:16}],partitions:[]};
  const state={doc:{settings:{target:24},runs:[r]},selected:{kind:'run',id:r.id},multiSelected:[]},wall={id:'wall',length:100};
  const ctx=vm.createContext({state,Math,Number,Error,PREFERRED_SECTION_WIDTHS:[18,24,30,36],uid:()=>`ep-${++serial}`,clone:structuredClone,n:(x,d=0)=>Number.isFinite(Number(x))?Number(x):d,wall:()=>wall,sharedRunCorners:()=>[],sectionDepth:(_r,s)=>s.depth,preferredWidthPlan:()=>null,validateRun:run=>run.offset+ctx.runWidth(run)>wall.length+.01?['Out of wall']:[]});
  vm.runInContext([source('endPanel'),source('runWidth'),source('runInterval'),source('endPanelEligible'),source('fitEndPanelWidths'),source('addEndPanel'),source('removeEndPanel'),source('partitionPositions'),source('rebuildPartitions')].join('\n'),ctx);
  ctx.rebuildPartitions(r);return{ctx,state,r};
}

test('separate end panels preserve shared partitions, finish-relative depth, outside width and restore exact widths',()=>{
  const {ctx,r}=panelHarness(),outside=ctx.runWidth(r),ids=r.partitions.map(p=>p.id);
  const start=ctx.addEndPanel(r,'start');assert.equal(start.side,'start');near(ctx.runWidth(r),outside);near(r.sections[1].width,23.25);
  near(ctx.partitionPositions(r)[0],r.offset+r.thickness);assert.deepEqual(r.partitions.map(p=>p.id),ids);
  const end=ctx.addEndPanel(r,'end');near(ctx.runWidth(r),outside);near(r.sections[1].width,22.5);
  assert.equal(ctx.endPanelEligible(r,'start'),false);assert.equal(ctx.endPanelEligible(r,'end'),false);
  ctx.removeEndPanel(start.id);near(ctx.runWidth(r),outside);near(r.sections[1].width,23.25);
  ctx.removeEndPanel(end.id);near(ctx.runWidth(r),outside);assert.deepEqual(r.sections.map(s=>s.width),[24,24,24]);assert.deepEqual(r.partitions.map(p=>p.id),ids);
  assert.match(closet,/box3\(c,x,0,0,r\.thickness,sectionDepth\(r,sec\)\+1,r\.height,materialHex\(r,sec\)/);
});

test('end panel snapping rejects both filler corners and occupied ends',()=>{
  const {ctx,r,state}=panelHarness();
  r.fillerStart=10;assert.equal(ctx.endPanelEligible(r,'start'),false);r.fillerStart=0;
  r.cornerStart={ownerRunId:'corner'};assert.equal(ctx.endPanelEligible(r,'start'),false);r.cornerStart=null;
  r.sections[0].endPanelLeft=true;assert.equal(ctx.endPanelEligible(r,'start'),false);r.sections[0].endPanelLeft=false;
  state.doc.runs.push({id:'neighbor',wallId:'wall',offset:r.offset+ctx.runWidth(r),sections:[{width:10}],thickness:.75});
  assert.equal(ctx.endPanelEligible(r,'end'),false);
  state.doc.runs.pop();state.doc.runs.push({id:'return',wallId:'other',cornerStart:{ownerRunId:r.id,ownerSide:'start'}});
  assert.equal(ctx.endPanelEligible(r,'start'),false,'owner side of a filler corner is not an open end');
});

test('Front View wording and label controls are present in the active build',()=>{
  assert.match(closet,/id="elevationBtn">FRONT VIEW<\/button>/);
  assert.match(closet,/state\.view==='elevation'\?'Front View'/);
  assert.doesNotMatch(closet,/>ELEVATION<\/button>|in Elevation\./);
  assert.match(closet,/data-tool-label/);assert.match(closet,/function setupPropertyCards\(/);
});

test('renaming toolbar labels leaves icons and click handlers intact',()=>{
  const icon={name:'icon'},label={textContent:'Select'},button={onclick:()=>42,attrs:{},querySelector:()=>label,setAttribute(k,v){this.attrs[k]=v},removeAttribute(k){delete this.attrs[k]}},state={frontsOpen:false};
  const ctx=vm.createContext({TOOL_CATALOG:[['selectTool','Select']],toolLabels:{selectTool:'Pick'},defaultToolText:new Map([['selectTool','Select']]),state,document:{body:{dataset:{theme:'light'}}},$:()=>button});
  vm.runInContext(source('applyToolLabels'),ctx);ctx.applyToolLabels();assert.equal(label.textContent,'Pick');assert.equal(button.onclick(),42);assert.equal(icon.name,'icon');
  delete ctx.toolLabels.selectTool;ctx.applyToolLabels();assert.equal(label.textContent,'Select');
});

test('property cards can move by heading and restore their order without editing fields',()=>{
  const saved=new Map(),store={getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,value)};
  const card=name=>{const listeners={};const head={dataset:{},querySelector:selector=>selector==='.card-head strong'?{textContent:name}:null,addEventListener:(event,handler)=>listeners[event]=handler,removeEventListener:(event)=>delete listeners[event],setPointerCapture:()=>{}};return{head,listeners,classList:{add(){},remove(){}},querySelector:selector=>selector==='.card-head strong'?{textContent:name}:head,getBoundingClientRect:()=>({top:100,height:20})}};
  const a=card('Section 2'),b=card('Construction'),c=card('Add Components'),cards=[a,b,c];
  const body={querySelectorAll:()=>cards.slice(),append(item){cards.splice(cards.indexOf(item),1);cards.push(item)},insertBefore(item,target){cards.splice(cards.indexOf(item),1);const index=target?cards.indexOf(target):cards.length;cards.splice(index,0,item)}};
  const documentListeners={};
  const document={elementFromPoint:()=>({closest:()=>a}),addEventListener:(event,handler)=>documentListeners[event]=handler,removeEventListener:event=>delete documentListeners[event]};
  const ctx=vm.createContext({state:{selected:{kind:'section'}},localStorage:store,PROP_ORDER_KEY:'order:',document,$:()=>body});
  vm.runInContext([source('propertyCardKey'),source('setupPropertyCards')].join('\n'),ctx);
  ctx.setupPropertyCards();b.listeners.pointerdown({button:0,preventDefault(){},pointerId:1,target:{closest:()=>null}});
  documentListeners.pointermove({clientX:10,clientY:100});documentListeners.pointerup({});
  assert.deepEqual(cards.map(x=>x.head.querySelector('.card-head strong').textContent),['Construction','Section 2','Add Components']);
  cards.splice(0,3,a,b,c);ctx.setupPropertyCards();assert.equal(cards[0],b);assert.equal(saved.get('order:section'),'["Construction","Section","Add Components"]');
});
