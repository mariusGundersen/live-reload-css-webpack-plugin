const url = new URL(document.location);
url.port = ___LIVE_RELOAD_PORT___;
const es = new EventSource(url, { withCredentials: false });

es.addEventListener('open', () => {
  console.info('Connected to live-reload server');
});

es.addEventListener('error', () => {
  console.warn('Disconnected from live-reload server');
});

es.addEventListener('message', ev => {
  const { asset } = JSON.parse(ev.data);
  console.log('asset', asset);
  // We only care about css files
  if (typeof asset !== 'string') return;
  if (!asset.endsWith('.css')) return;
  const stylesheet = Array.from(document.styleSheets)
    .filter(s => s.href)
    .find(s => new URL(s.href).pathname === asset);
  if (!stylesheet) return;
  const link = stylesheet.ownerNode;
  const clone = link.cloneNode();
  clone.setAttribute('href', asset + '?' + Date.now());
  link.insertAdjacentElement('afterend', clone);
  clone.addEventListener('load', () => link.remove());
});