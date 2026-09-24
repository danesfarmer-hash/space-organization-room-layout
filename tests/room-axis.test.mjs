import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const entry=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const room=Buffer.from(entry.match(/const ROOM_B64="([A-Za-z0-9+/=]+)";/)?.[1]||'','base64').toString();
function source(name){const start=room.indexOf(`function ${name}(`);assert.ok(start>=0,name);const end=room.indexOf('\nfunction ',start+1);return room.slice(start,end<0?undefined:end)}

function wallHarness(points){
  const state={points:structuredClone(points),closed:true,selectedWall:0,selectedWalls:[0]};
  const wallByIndex=i=>({index:i,a:state.points[i],b:state.points[(i+1)%state.points.length]});
  const ctx=vm.createContext({state,Math,Number,gridSnapEnabled:false,GRID_SIZE:6,wallByIndex,
    selectedWallIndices:()=>[0],splitWallSlideInfo:()=>null,classifyAxisEdge:()=>null,
    round8:v=>Math.round(v*256)/256,snapWallDrawIncrement:v=>Math.round(v*16)/16,
    syncSegmentFeaturesToWalls:()=>{},syncPendingDimensions:()=>{}});
  vm.runInContext([source('cadBeginWall'),source('cadMoveWall')].join('\n'),ctx);
  const start=ctx.cadBeginWall({id:0});start.startPoint={x:0,y:0};
  return {ctx,state,start};
}

test('horizontal wall gesture ignores perpendicular travel and translates only along its tangent',()=>{
  const h=wallHarness([{x:0,y:0},{x:100,y:0},{x:100,y:80},{x:0,y:80}]);
  assert.equal(h.ctx.cadMoveWall({start:h.start},null,{x:0,y:20},{}),false);
  assert.deepEqual(JSON.parse(JSON.stringify(h.state.points.slice(0,2))),[{x:0,y:0},{x:100,y:0}]);
  assert.equal(h.ctx.cadMoveWall({start:h.start},null,{x:12,y:20},{}),true);
  assert.deepEqual(JSON.parse(JSON.stringify(h.state.points.slice(0,2))),[{x:12,y:0},{x:112,y:0}]);
});

test('angled wall movement projects onto its original direction without normal drift',()=>{
  const h=wallHarness([{x:0,y:0},{x:30,y:40},{x:0,y:60}]);
  assert.equal(h.ctx.cadMoveWall({start:h.start},null,{x:-8,y:6},{}),false);
  assert.equal(h.ctx.cadMoveWall({start:h.start},null,{x:6,y:8},{}),true);
  assert.deepEqual(JSON.parse(JSON.stringify(h.state.points.slice(0,2))),[{x:6,y:8},{x:36,y:48}]);
});

test('length geometry changes on its original axis and keeps the wall midpoint',()=>{
  const state={points:[{x:0,y:0},{x:100,y:0},{x:100,y:80},{x:0,y:80}],selectedWall:0,wallDimensionText:{}};
  const wallByIndex=i=>({index:i,a:state.points[i],b:state.points[(i+1)%state.points.length]});
  const ctx=vm.createContext({state,Math,Number,wallByIndex,dist:(a,b)=>Math.hypot(b.x-a.x,b.y-a.y),precise:v=>Math.round(v*256)/256,
    parseMeasurement:Number,resizeSplitSegmentWithinBounds:()=>false,rectangleMirrorPairForWall:()=>null,
    syncSegmentFeaturesToWalls:()=>{},syncPendingDimensions:()=>{},render:()=>{throw Error('interactive drag must defer full render')}});
  vm.runInContext([source('wallLength'),source('resizeWallStandalone'),source('changeWallLength')].join('\n'),ctx);
  ctx.changeWallLength(112,false);
  assert.deepEqual(JSON.parse(JSON.stringify(state.points.slice(0,2))),[{x:-6,y:0},{x:106,y:0}]);
  assert.equal(ctx.wallLength(wallByIndex(0)),112);
});
