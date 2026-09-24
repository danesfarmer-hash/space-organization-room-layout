(()=>{
  const install=()=>{
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
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
