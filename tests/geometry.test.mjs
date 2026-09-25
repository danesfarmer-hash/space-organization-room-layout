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
  'planPoint', 'svg', 'renderPlanOverlays', 'fillerShelfLevels',
  'fillerBridge3', 'saveToProject'
];

function harness() {
  let serial = 0;
  let db = {projects: []};
  const elements = [];
  const boxes = [];
  const state = {rooms: [], doc: {settings: {target: 24}, runs: []}, record: null, dirty: false};
  const ctx = vm.createContext({
    state, window: {}, Date, Math, Number, String, Array, SVG: 'http://www.w3.org/2000/svg',
    DEFAULTS: {toeKick: 64 / 25.4, toeSetback: .75, shelf: .75},
    materialHex: () => '#ffffff', shadeHex: color => color,
    box3: (_canvas, x, y, z, width, depth, height, _fill, attrs) => boxes.push({x, y, z, width, depth, height, attrs}),
    n: (v, fallback = 0) => Number.isFinite(Number(v)) ? Number(v) : fallback,
    round: (v, step) => Math.round(v / step) * step,
    uid: () => `test-${++serial}`,
    clone: value => structuredClone(value),
    readDB: () => structuredClone(db),
    writeDB: value => { db = structuredClone(value); },
    projectIssues: () => [], toast: () => {}, render: () => {},
    visualProps: () => [], visualDogs: () => ({}), dogNames: [], dogActors: new Map(),
    document: {createElementNS: (_ns, tag) => {
      const el = {tag, attributes: {}, setAttribute(k, v) {this.attributes[k] = String(v);}};
      elements.push(el);
      return el;
    }}
  });
  vm.runInContext(`const CORNER_FILLER_MIN=10, CORNER_FILLER_MAX=13; const PREFERRED_SECTION_WIDTHS=[18,24,30,36]; ${names.map(sourceOf).join('\n')}`, ctx);
  const call = (name, ...args) => ctx[name](...args);
  return {state, ctx, call, elements, boxes, db: () => db, setDB: value => { db = structuredClone(value); }};
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
  const face = h.elements.find(e => e.tag === 'line' && e.attributes['data-filler-front-edge'] === 'true');
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
  const face = h.elements.find(e => e.tag === 'line' && e.attributes['data-filler-front-edge'] === 'true');
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

test('corner fillers on three layouts contain KB, KT, and toe kick without a full face panel', () => {
  for (const [owner, depth] of [['bottom', 16], ['left', 12], ['bottom', 24]]) {
    const h = corner(owner, depth);
    h.call('resolveCornerAccessFillers');
    const r = owner === 'bottom' ? h.leftRun : h.bottomRun;
    const side = owner === 'bottom' ? 'end' : 'start';
    h.call('fillerBridge3', {}, r, side, 0, h.call('cornerFillerInfo', r, side));
    assert.deepEqual(h.boxes.map(box => box.attrs['data-filler-piece']), ['KB', 'KT', 'toe-kick']);
    assert.ok(h.boxes.every(box => box.height < 3.3), `${owner}/${depth}: no full-height filler face`);
    const [kb, kt, toe] = h.boxes;
    near(kb.z, 64 / 25.4, 'KB above toe kick');
    near(kt.z, r.height - .75, 'KT at run top');
    near(toe.height, 64 / 25.4, 'toe kick height');
    assert.ok(toe.z + toe.height <= kb.z + .001, 'toe kick does not intersect KB');
    assert.equal(toe.width, kb.width);
  }
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
