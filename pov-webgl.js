(()=>{
const legacyRenderPOV=window.renderPOV;
function gpuPovSize(canvas){const rect=canvas.getBoundingClientRect?.(),width=Math.max(1,rect?.width||640),height=Math.max(1,rect?.height||400),still=!!window.__povStill,cap=still?2200000:950000,density=Math.min(still?3:2,window.devicePixelRatio||1),scale=Math.min(density,Math.sqrt(cap/(width*height)));return{width:Math.max(1,Math.round(width*scale)),height:Math.max(1,Math.round(height*scale))};}
function gpuPovBuildFaces(){povFaces=[];render3D();povWallFaces();const faces=povFaces||[];povFaces=null;return faces;}
function gpuPovCameraFrame(cam){const cy=Math.cos(cam.yaw),sy=Math.sin(cam.yaw),cp=Math.cos(cam.pitch??-.18),sp=Math.sin(cam.pitch??-.18);const forward={x:cy*cp,y:sy*cp,z:sp},right={x:-sy,y:cy,z:0},up={x:-cy*sp,y:-sy*sp,z:cp};return{forward,right,up};}
function gpuPovCameraPoint(p,cam,frame){const dx=p.x-cam.x,dy=p.y-cam.y,dz=p.z-CAMERA_EYE;return{x:dx*frame.right.x+dy*frame.right.y+dz*frame.right.z,y:dx*frame.up.x+dy*frame.up.y+dz*frame.up.z,z:-(dx*frame.forward.x+dy*frame.forward.y+dz*frame.forward.z)};}
function gpuPovClipFace(points,cam,frame,near=.35){const out=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length],qa=gpuPovCameraPoint(a,cam,frame),qb=gpuPovCameraPoint(b,cam,frame),da=-qa.z,db=-qb.z,insideA=da>=near,insideB=db>=near;if(insideA)out.push(a);if(insideA!==insideB){const t=(near-da)/(db-da);out.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:a.z+(b.z-a.z)*t})}}return out;}
function gpuPovFaceNormal(points){const a=points[0],b=points[1],c=points[2],u={x:b.x-a.x,y:b.y-a.y,z:b.z-a.z},v={x:c.x-a.x,y:c.y-a.y,z:c.z-a.z},nx=u.y*v.z-u.z*v.y,ny=u.z*v.x-u.x*v.z,nz=u.x*v.y-u.y*v.x,m=Math.hypot(nx,ny,nz)||1;return{x:nx/m,y:ny/m,z:nz/m};}
function gpuPovFaceRGB(face){const h=String(face.fill||'#d8d2c8').replace('#',''),hex=h.length===3?h.split('').map(x=>x+x).join(''):h;return[0,2,4].map(i=>(parseInt(hex.slice(i,i+2),16)||0)/255);}
function gpuPovProjection(W,H,cam){const focal=W*.78*Math.max(.65,Math.min(2.6,Number(cam.zoom)||1));return{focal,matrix:new Float32Array([2*focal/W,0,0,0,0,2*focal/H,0,0,0,0,(10000+.35)/(.35-10000),-1,0,0,(2*10000*.35)/(.35-10000),0])};}
function gpuPovUpdateHit(faces,cam,canvas){const rect=canvas.getBoundingClientRect?.()||{width:640,height:400},W=Math.max(160,Math.min(720,Math.round(rect.width*.72))),H=Math.max(120,Math.min(520,Math.round(rect.height*.72))),depths=new Float32Array(W*H),hitIds=new Int32Array(W*H),frame=gpuPovCameraFrame(cam),projection=gpuPovProjection(W,H,cam);depths.fill(Infinity);const draw=(a,b,c,id)=>{const minX=Math.max(0,Math.floor(Math.min(a.x,b.x,c.x))),maxX=Math.min(W-1,Math.ceil(Math.max(a.x,b.x,c.x))),minY=Math.max(0,Math.floor(Math.min(a.y,b.y,c.y))),maxY=Math.min(H-1,Math.ceil(Math.max(a.y,b.y,c.y))),area=(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);if(Math.abs(area)<.01)return;for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){const u=((b.x-x)*(c.y-y)-(b.y-y)*(c.x-x))/area,v=((c.x-x)*(a.y-y)-(c.y-y)*(a.x-x))/area,w=1-u-v;if(u<-.0001||v<-.0001||w<-.0001)continue;const d=1/(u/a.d+v/b.d+w/c.d),i=y*W+x;if(d<depths[i]){depths[i]=d;hitIds[i]=id}}};for(let faceId=0;faceId<faces.length;faceId++){const poly=gpuPovClipFace(faces[faceId].pts,cam,frame).map(p=>{const q=gpuPovCameraPoint(p,cam,frame),d=-q.z;return{x:W/2+q.x*projection.focal/d,y:H/2-q.y*projection.focal/d,d};});for(let i=1;i<poly.length-1;i++)draw(poly[0],poly[i],poly[i+1],faceId+1);}povHit={width:W,height:H,hitIds,faces};}
function gpuPovCreateGL(canvas){const gl=canvas.getContext('webgl2',{alpha:false,antialias:true,preserveDrawingBuffer:true})||canvas.getContext('webgl',{alpha:false,antialias:true,preserveDrawingBuffer:true});if(!gl||typeof gl.createShader!=='function')return null;const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(shader)||'POV shader failed');return shader};const vertex=compile(gl.VERTEX_SHADER,'attribute vec3 aPosition;attribute vec3 aColor;attribute vec3 aNormal;uniform mat4 uProjection;varying vec3 vColor;varying vec3 vNormal;varying vec3 vPosition;void main(){gl_Position=uProjection*vec4(aPosition,1.0);vColor=aColor;vNormal=aNormal;vPosition=aPosition;}');const fragment=compile(gl.FRAGMENT_SHADER,'precision mediump float;uniform vec3 uLightDir;uniform float uFill;varying vec3 vColor;varying vec3 vNormal;varying vec3 vPosition;void main(){vec3 N=normalize(vNormal),L=normalize(uLightDir),V=normalize(-vPosition);float diffuse=max(dot(N,L),0.0);float spec=pow(max(dot(reflect(-L,N),V),0.0),28.0);vec3 base=pow(max(vColor,vec3(0.0)),vec3(2.2));vec3 lit=base*(0.18+uFill+diffuse*.68)+vec3(spec*.09);lit=lit/(lit+vec3(1.0));gl_FragColor=vec4(pow(lit,vec3(.454545)),1.0);}');const program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program)||'POV program failed');return{gl,program,position:gl.getAttribLocation(program,'aPosition'),color:gl.getAttribLocation(program,'aColor'),normal:gl.getAttribLocation(program,'aNormal'),projection:gl.getUniformLocation(program,'uProjection'),light:gl.getUniformLocation(program,'uLightDir'),fill:gl.getUniformLocation(program,'uFill'),positionBuffer:gl.createBuffer(),colorBuffer:gl.createBuffer(),normalBuffer:gl.createBuffer()};}
function gpuPovRender(){const canvas=$('povCanvas'),cam=state.viewerCamera;if(!window.__povGLState){try{window.__povGLState=gpuPovCreateGL(canvas);}catch(err){window.__povGLState=null;return false;}}if(!window.__povGLState)return false;const gl=window.__povGLState.gl,size=gpuPovSize(canvas);if(canvas.width!==size.width)canvas.width=size.width;if(canvas.height!==size.height)canvas.height=size.height;gl.viewport(0,0,size.width,size.height);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LESS);gl.disable(gl.CULL_FACE);gl.clearColor(.86,.9,.93,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);if(!cam){povHit=null;return true;}const faces=gpuPovBuildFaces(),frame=gpuPovCameraFrame(cam),projection=gpuPovProjection(size.width,size.height,cam),positions=[],colors=[],normals=[];for(const face of faces){const polygon=gpuPovClipFace(face.pts,cam,frame);if(polygon.length<3)continue;const nrm=gpuPovFaceNormal(face.pts),normal={x:nrm.x*frame.right.x+nrm.y*frame.right.y+nrm.z*frame.right.z,y:nrm.x*frame.up.x+nrm.y*frame.up.y+nrm.z*frame.up.z,z:-(nrm.x*frame.forward.x+nrm.y*frame.forward.y+nrm.z*frame.forward.z)},rgb=gpuPovFaceRGB(face);for(let i=1;i<polygon.length-1;i++)for(const p of [polygon[0],polygon[i],polygon[i+1]]){const q=gpuPovCameraPoint(p,cam,frame);positions.push(q.x,q.y,q.z);colors.push(rgb[0],rgb[1],rgb[2]);normals.push(normal.x,normal.y,normal.z);}}gl.useProgram(window.__povGLState.program);const bind=(buffer,attribute,data)=>{gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,3,gl.FLOAT,false,0,0);};bind(window.__povGLState.positionBuffer,window.__povGLState.position,positions);bind(window.__povGLState.colorBuffer,window.__povGLState.color,colors);bind(window.__povGLState.normalBuffer,window.__povGLState.normal,normals);gl.uniformMatrix4fv(window.__povGLState.projection,false,projection.matrix);const lightWorld={x:-.42,y:-.58,z:.78},lightCam=[lightWorld.x*frame.right.x+lightWorld.y*frame.right.y,lightWorld.x*frame.up.x+lightWorld.y*frame.up.y,-(lightWorld.x*frame.forward.x+lightWorld.y*frame.forward.y+lightWorld.z*frame.forward.z)];gl.uniform3fv(window.__povGLState.light,new Float32Array(lightCam));const lights=(state.rooms||[]).reduce((count,room)=>count+(room.raw?.lights||[]).filter(l=>l.surface==='ceiling').length,0);gl.uniform1f(window.__povGLState.fill,lights?.08:.045);gl.drawArrays(gl.TRIANGLES,0,positions.length/3);gpuPovUpdateHit(faces,cam,canvas);return true;}
function gpuPovStill(){if(state.view!=='pov')return;const prior=window.__povStill;window.__povStill=true;render();requestAnimationFrame(()=>{const canvas=$('povCanvas'),link=document.createElement('a');link.download=`space-organization-pov-${Date.now()}.png`;link.href=canvas.toDataURL('image/png');link.click();window.__povStill=prior;render();});}
window.renderPOV=function(){if(gpuPovRender())return;return legacyRenderPOV?.();};function installPOVStill(){const bottom=document.querySelector('.bottom');if(!bottom||document.getElementById('stillBtn'))return;const b=document.createElement('button');b.id='stillBtn';b.type='button';b.textContent='STILL';b.title='Download a high-resolution POV render';b.addEventListener('click',gpuPovStill);bottom.appendChild(b);}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installPOVStill,{once:true});else installPOVStill();})();

(()=>{
function gpuPovDrawerAction(picked,resolve=component){
  if(!picked||picked.kind!=='component')return null;
  const found=resolve(picked.id);
  if(!found?.component||found.component.type!=='drawer')return null;
  return{found,opening:!found.component.open};
}
function gpuPovDrawerClick(picked){
  const action=gpuPovDrawerAction(picked);
  if(!action)return false;
  const{found,opening}=action;
  commit(opening?'Opened drawer':'Closed drawer',()=>{
    state.selected={kind:'section',id:found.section.id,parentId:found.run.id};
    toggleDrawer(found.component.id);
  });
  return true;
}
const canvas=$('povCanvas');
if(canvas&&!canvas.dataset.povDrawerClick){
  canvas.dataset.povDrawerClick='1';
  canvas.addEventListener('click',event=>{
    if(state.view!=='pov')return;
    const picked=povPickAt(event.clientX,event.clientY,true);
    if(!gpuPovDrawerClick(picked))return;
    event.preventDefault();
    event.stopImmediatePropagation();
  },true);
}
})();


(()=>{
  const canvas=window.document.getElementById('povCanvas');
  if(!canvas||canvas.dataset.povDrawerBridge==='1')return;
  canvas.dataset.povDrawerBridge='1';
  canvas.addEventListener('click',event=>{
    if(window.state?.view!=='pov')return;
    const picked=window.povPickAt?.(event.clientX,event.clientY,true);
    if(!picked||picked.kind!=='component')return;
    const found=window.component?.(picked.id);
    if(!found?.component||found.component.type!=='drawer')return;
    const opening=!found.component.open;
    window.commit?.(opening?'Opened drawer':'Closed drawer',()=>{
      window.state.selected={kind:'section',id:found.section.id,parentId:found.run.id};
      window.toggleDrawer?.(found.component.id);
    });
    event.preventDefault();
    event.stopImmediatePropagation();
  },true);
})();
