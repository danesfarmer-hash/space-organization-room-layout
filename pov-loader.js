(() => {
  const build = new URLSearchParams(location.search).get('v');
  const src = new URL(`./pov-webgl.js${build ? `?v=${encodeURIComponent(build)}` : ''}`, document.baseURI).href;
  const inject = (frame) => {
    if (!frame?.contentDocument || frame.dataset.povGpuLoaded === '1') return;
    const script = frame.contentDocument.createElement('script');
    script.src = src;
    script.onload = () => { frame.dataset.povGpuLoaded = '1'; };
    frame.contentDocument.head.appendChild(script);
  };
  const wire = () => {
    const frame = document.getElementById('closetFrame');
    if (!frame || frame.dataset.povGpuWired === '1') return;
    frame.dataset.povGpuWired = '1';
    frame.addEventListener('load', () => { frame.dataset.povGpuLoaded = '0'; inject(frame); }, { passive: true });
    inject(frame);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire, { once: true });
  else wire();
  new MutationObserver(wire).observe(document.documentElement, { childList: true, subtree: true });
})();
