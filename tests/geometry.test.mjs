import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

// Exercise the functions shipped inside the Pages entry, rather than a second
// copy of the geometry algorithm. Expected coordinates below are independent.
const entry = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const encoded = entry.match(/const CLOSET_B64="([A-Za-z0-9+/=]+)";/)?.[1];
assert.ok(encoded, 'index.html must embed the active Closet Builder');
const closet = Buffer.from(encoded, 'base64').toString('utf8');

function sourceOf(name) {
  const start = closet.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `${name} must exist in the embedded build`);
  const next = closet.indexOf('\nfunction ', start + 1);
  return closet.slice(start, next < 0 ? undefined : next);
}

const names = [
  'allWalls', 'runWidth', 'runInterval', 'partitionPositions', 'samePoint',
  'cornerAccessFiller', 'cornerFillerInfo', 'cornerBridgeGeometry',
  'sectionDepth', 'rebuildPartitions', 'runTouchesWallCorner',
  'sharedRunCorners', 'preferredWidthPlan', 'attachCorner',
  'resolveCornerAccessFillers', 'preferredWidthPenalty', 'avoidElectrical',
  'planPoint', 'svg', 'renderPlanOverlays', 'saveToProject',
  'overlayExtent', 'faceDimensions', 'frontGeometry', 'fillerSolidGeometry',
  'solidOverlap', 'constructionSolids', 'constructionGeometryIssues'
];

function harness() {
  let serial = 0;
  let db = {projects: []};
  const elements = [];
  const state = {rooms: [], doc: {settings: {target: 24}, runs: []}, record: null, dirty: false};
  const ctx = vm.createContext({
    state, window: {}, Date, Math, Number, String, Array, SVG: 'http://www.w3.org/2000/svg',
    n: (v, fallback = 0) => Number.isFinite(Number(v)) ? Number(v) : fallback,
    round: (v, step) => Math.round(v / step) * step,
    uid: () => `test-${++serial}`,
    clone: value => structuredClone(value),
    readDB: () => structuredClone(db),
    writeDB: value => { db = structuredClone(value); },
    projectIssues: () => [], toast: () => {}, render: () => {},
    document: {createElementNS: (_ns, tag) => {
      const el = {tag, attributes: {}, setAttribute(k, v) {this.attributes[k] = String(v);}};
      elements.push(el);
      return el;
    }}
  });
  vm.runInContext(`const MM=1/25.4, CORNER_FILLER_MIN=10, CORNER_FILLER_MAX=13; const DEFAULTS={partition:.75,shelf:.75,toeKick:64*MM,toeSetback:.75,faceGap:4*MM}; ${names.map(sourceOf).join('\n')}`, ctx);
  const call = (name, ...args) => ctx[name](...args);
  return {state, ctx, call, elements, db: () => db, setDB: value => { db = structuredClone(value); }};
}

function corner(owner = 'bottom', ownerDepth = 16) {
  const h = harness();
  const bottom = {id: 'bottom-wall', roomKey: 'main', a: {x: 0, y: 0}, b: {x: 120, y: 0}, length: 120, ux: 1, uy: 0, nx: 0, ny: 1, items: []};
  const left = {id: 'left-wall', roomKey: 'main', a: {x: 0, y: 96}, b: {x: 0, y: 0}, length: 96, ux: 0, uy: -1, nx: 1, ny: 0, items: []};
  h.state.rooms = [{walls: [bottom, left]}];
  const makeRun = (id, wallId, length, depth) => {
    const widths = Array(3).fill((length - 3) / 3);
    const r = {id, wallId, offset: 0, depth, height: 84, thickness: .75,
      fillerStart: 0, fillerEnd: 0, sections: widths.map((width, i) => ({id: `${id}-${i}`, width, depth, components: []})), partitions: []};
    h.call('rebuildPartitions', r);
    return r;
  };
  const bottomRun = makeRun('bottom-run', bottom.id, 120, owner === 'bottom' ? ownerDepth : 16);
  const leftRun = makeRun('left-run', left.id, 96, owner === 'left' ? ownerDepth : 12);
  h.state.doc.runs = owner === 'bottom' ? [bottomRun, leftRun] : [leftRun, bottomRun];
  return {...h, bottomRun, leftRun};
}

function near(actual, expected, label) {
  assert.ok(Math.abs(actual - expected) < .04, `${label}: expected ${expected}, got ${actual}`);
}

test('C-06: three contiguous sections have four shared partitions at independent coordinates', () => {
  const h = corner();
  const r = h.bottomRun;
  assert.equal(r.partitions.length, 4);
  assert.deepEqual(Array.from(h.call('partitionPositions', r)), [0, 39.75, 79.5, 119.25]);
  near(h.call('runWidth', r), 120, 'outside width');
});

test('C-05/C-06/C-07: two custom openings preserve outside width and nonoverlapping partition bounds', () => {
  const h = corner();
  const r = h.bottomRun;
  r.offset = 3;
  r.fillerStart = .5;
  r.fillerEnd = 12;
  r.sections = [{id: 'a', width: 18, depth: 16, components: []}, {id: 'b', width: 24, depth: 16, components: []}];
  h.call('rebuildPartitions', r);
  assert.equal(r.partitions.length, 3);
  assert.deepEqual(Array.from(h.call('partitionPositions', r)), [3.5, 22.25, 47]);
  near(h.call('runWidth', r), 56.75, '18 + 24 + 3 × .75 + .5 + 12');
  const openings = [[4.25, 22.25], [23, 47]];
  assert.equal(openings[0][1] + r.thickness, openings[1][0], 'shared partition fills the opening gap');
  assert.equal(openings[1][1] + r.thickness + r.fillerEnd, r.offset + h.call('runWidth', r));
});

test('C-01/C-02/C-03: bottom owner, left terminates at actual 16 in depth with visible room-facing filler', () => {
  const h = corner('bottom', 16);
  assert.equal(h.call('resolveCornerAccessFillers'), 1);
  near(h.call('runInterval', h.bottomRun)[0], 0, 'owner reaches back corner');
  near(h.call('runInterval', h.leftRun)[1], 80, 'left wall end (96 minus 16)');
  assert.equal(h.leftRun.cornerEnd.ownerRunId, h.bottomRun.id);
  assert.equal(h.leftRun.cornerEnd.ownerDepth, 16);
  assert.equal(h.leftRun.fillerEnd, 13);
  const canvas = {append: el => h.elements.push(el)};
  h.call('renderPlanOverlays', canvas);
  const filler = h.elements.find(e => e.tag === 'polygon' && e.attributes['data-filler'] === h.leftRun.id);
  const face = h.elements.find(e => e.tag === 'line' && e.attributes['data-filler-face'] === 'true');
  assert.ok(filler, 'plan filler must exist');
  assert.equal(face.attributes['data-owner-run'], h.bottomRun.id);
  near(Number(face.attributes.x1), 12, 'filler front x: terminating run depth');
  near(Number(face.attributes.x2), 12, 'filler front x2');
});

test('C-01/C-02/C-03: mirrored ownership, bottom begins 12 in from corner and filler faces room', () => {
  const h = corner('left', 12);
  assert.equal(h.call('resolveCornerAccessFillers'), 1);
  near(h.call('runInterval', h.leftRun)[1], 96, 'owner reaches back corner');
  near(h.call('runInterval', h.bottomRun)[0], 12, 'bottom start = owner depth');
  assert.equal(h.bottomRun.cornerStart.ownerRunId, h.leftRun.id);
  assert.equal(h.bottomRun.cornerStart.ownerDepth, 12);
  assert.equal(h.bottomRun.fillerStart, 12);
  h.call('renderPlanOverlays', {append: () => {}});
  const face = h.elements.find(e => e.tag === 'line' && e.attributes['data-filler-face'] === 'true');
  assert.equal(face.attributes['data-owner-run'], h.leftRun.id);
  near(Number(face.attributes.y1), 16, 'filler front y: terminating run depth');
  near(Number(face.attributes.y2), 16, 'filler front y2');
});

test('C-02: changing the owner return depth repositions an existing terminating run', () => {
  const h = corner('bottom', 16);
  h.call('resolveCornerAccessFillers');
  h.bottomRun.depth = 24;
  for (const s of h.bottomRun.sections) s.depth = 24;
  assert.equal(h.call('resolveCornerAccessFillers'), 1);
  near(h.call('runInterval', h.leftRun)[1], 72, '96 in wall minus actual 24 in return');
  assert.equal(h.leftRun.cornerEnd.ownerDepth, 24);
  near(h.call('runInterval', h.bottomRun)[0], 0, 'owner remains at back corner');
});

test('P-02/P-03: save retains custom dimensions and room state in same project record', () => {
  const h = corner();
  h.bottomRun.sections[0].width = 23.5;
  const roomState = {points: [{x: 0, y: 0}, {x: 120, y: 0}], closed: false};
  h.setDB({projects: [{id: 'fixture', state: roomState, closetState: null, clientName: 'Fixture Client', jobName: 'Corner A', closetName: 'Two Wall'}]});
  h.state.record = {id: 'fixture'};
  h.state.dirty = true;
  const result = h.call('saveToProject');
  assert.equal(result.ok, true);
  const saved = h.db().projects[0];
  assert.deepEqual(saved.state, roomState);
  assert.equal(saved.closetState.runs[0].sections[0].width, 23.5);
  assert.equal(saved.clientName, 'Fixture Client');
  assert.equal(h.state.dirty, false);
});

test('overlay contract: half overlay leaves a centered four millimeter partition gap', () => {
  const h = harness(), thickness = .75, gap = 4 / 25.4;
  const half = h.call('overlayExtent', 'half', thickness), full = h.call('overlayExtent', 'full', thickness);
  assert.ok(Math.abs(half - (thickness / 2 - 2 / 25.4)) < 1e-9);
  assert.ok(Math.abs(full - (thickness - gap)) < 1e-9);
  const left = {id:'left', width:24}, right = {id:'right', width:24};
  const r = {thickness, sections:[left,right], height:84};
  const lf = h.call('frontGeometry', r, left), rf = h.call('frontGeometry', r, right);
  const partitionInner = left.width;
  const leftEdge = lf.xOffset + lf.width;
  const rightEdge = left.width + thickness + rf.xOffset;
  assert.ok(Math.abs(rightEdge - leftEdge - gap) < 1e-9, 'the gap is exactly four millimeters');
  assert.ok(leftEdge < partitionInner + thickness / 2 && rightEdge > partitionInner + thickness / 2, 'fronts stop on opposite sides of the centerline');
});

test('overlay contract: full overlay uses the physical panel thickness on outside edges', () => {
  const h = harness(), r = {thickness:.75, sections:[{id:'only',width:24}], height:84};
  const face = h.call('faceDimensions', r, r.sections[0]);
  assert.equal(face.overlayModeLeft, 'full');
  assert.equal(face.overlayModeRight, 'full');
  assert.ok(Math.abs(face.overlayLeft - (.75 - 4 / 25.4)) < 1e-9);
  assert.equal(face.overlayLeft, face.overlayRight);
  assert.equal(face.width, 24 + 2 * face.overlayLeft);
});

test('filler contract: only KT, KB, and a matching toe kick are solids', () => {
  const h = harness();
  h.ctx.cornerBridgeGeometry = () => ({originOffset:0, depth:14, width:12});
  h.ctx.fillerShelfLevels = () => ({bottomZ:2.5,bottomThickness:.75,topZ:83.25,topThickness:.75});
  const r = {id:'terminating', offset:0, depth:14, wallId:'wall', fillerStart:12, fillerEnd:0};
  const parts = h.call('fillerSolidGeometry', r, 'start', {ownerRunId:'owner'});
  assert.deepEqual(Array.from(parts.map(p => p.kind)), ['KB','KT','toe-kick']);
  assert.equal(parts.length, 3);
  assert.equal(parts.some(p => /face|panel/i.test(p.kind)), false);
  assert.equal(parts[2].w, parts[0].w);
});

test('solid validator distinguishes boundary contact from unintended volume intersection', () => {
  const h = harness();
  const base = {center:{x:0,y:0},ux:1,uy:0,vx:0,vy:1,w:10,d:10,z:0,h:10};
  const touching = {...base,center:{x:10,y:0}};
  const overlap = {...base,center:{x:9.9,y:0}};
  assert.equal(h.call('solidOverlap', base, touching), false);
  assert.equal(h.call('solidOverlap', base, overlap), true);
});

test('construction geometry validator catches a real drawer-box and shelf intersection', () => {
  const h = harness(), host = {id:'wall', a:{x:0,y:0}, ux:1, uy:0, nx:0, ny:1};
  h.ctx.wall = id => id === 'wall' ? host : null;
  h.ctx.run = id => h.state.doc.runs.find(r => r.id === id) || null;
  h.ctx.componentTransform = (_r,s,c) => ({xOffset:0,width:s.width,depth:s.depth});
  h.ctx.drawerBox = () => ({width:22,depth:13,height:4});
  h.ctx.drawerPresentation = () => ({extension:0});
  h.ctx.accessoryTransform = () => ({xOffset:0,width:1,depth:1,height:1,z:60});
  const s = {id:'section',width:24,depth:14,components:[{id:'drawer',type:'drawer',z:4,height:6,boxWidth:22,boxDepth:13,boxHeight:4}],accessories:[]};
  const r = {id:'run',wallId:'wall',offset:0,thickness:.75,depth:14,height:84,fillerStart:0,fillerEnd:0,sections:[s],partitions:[{id:'p0',depth:14},{id:'p1',depth:14}]};
  h.state.doc.runs=[r];
  assert.deepEqual(Array.from(h.call('constructionGeometryIssues')), []);
  s.components.push({id:'bad-shelf',type:'shelf',z:5,thickness:.75,depth:14});
  const issues = h.call('constructionGeometryIssues');
  assert.ok(issues.some(issue => /drawer-box.*bad-shelf|bad-shelf.*drawer-box/.test(issue.message)));
});
