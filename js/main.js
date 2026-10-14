// FIT3179 A2: Vega-Lite JSON specs rendered with Vega-Embed.
// All asset paths are relative to the published index.html.
const chartIds = [
  'map-reserves', 'map-bins', 'region-distribution', 'latitude-years',
  'world-tour', 'tour-flow', 'event-windows', 'participation',
  'timeline', 'world-calendar', 'intersection', 'matrix'
];

async function renderChart(id, state = 'ALL') {
  const container = document.getElementById(id);
  if (!container) {
    console.error(`[FIT3179] Missing HTML container: #${id}`);
    return;
  }
  const specUrl = new URL(`specs/${id}.json`, document.baseURI);
  try {
    const response = await fetch(specUrl);
    if (!response.ok) throw new Error(`Cannot fetch ${specUrl.pathname}: HTTP ${response.status}`);
    const spec = await response.json();
    const available = Math.max(320, Math.floor(container.getBoundingClientRect().width) - 32);
    if (Array.isArray(spec.hconcat)) {
      const gap = Number(spec.spacing || 14);
      const each = Math.max(165, Math.floor((available - gap * (spec.hconcat.length - 1) - 42) / spec.hconcat.length));
      spec.hconcat.forEach(child => { child.width = each; });
    } else {
      spec.width = Math.max(260, available);
    }
    if (!spec.$schema?.includes("vega-lite/v6.json")) throw new Error(`Not a Vega-Lite 6 specification: ${id}`);
    if (id === 'map-reserves' && state !== 'ALL') {
      const reserveLayer = (spec.layer || []).find(layer => layer.data?.url === 'data/reserves.csv');
      if (reserveLayer) reserveLayer.transform = [
        ...(reserveLayer.transform || []),
        { filter: `datum.state === ${JSON.stringify(state)}` }
      ];
    }
    // Vega-Embed uses the page base URL to resolve CSV/GeoJSON references.
    await window.vegaEmbed(`#${id}`, spec, {
      actions: false,
      renderer: 'svg',
      loader: { baseURL: document.baseURI }
    });
    console.info(`[FIT3179] Rendered ${id}`);
  } catch (error) {
    console.error(`[FIT3179] Failed to render ${id}`, error);
    const msg = document.createElement('p');
    msg.className = 'empty-chart';
    msg.setAttribute('role', 'alert');
    msg.textContent = `Chart unavailable (${id}). ${error.message}. Open the browser console for details.`;
    container.replaceChildren(msg);
  }
}

async function start() {
  if (typeof window.vegaEmbed !== 'function') {
    const message = 'Vega-Embed did not load. Check the three CDN script requests in the Network panel.';
    console.error('[FIT3179]', message);
    for (const id of chartIds) {
      const el = document.getElementById(id);
      if (el) el.textContent = message;
    }
    return;
  }
  const buttons = [...document.querySelectorAll('#state-filters button')];
  for (const button of buttons) {
    button.addEventListener('click', () => {
      for (const b of buttons) {
        const selected = b === button;
        b.classList.toggle('active', selected);
        b.setAttribute('aria-pressed', String(selected));
      }
      void renderChart('map-reserves', button.dataset.state || 'ALL');
    });
  }
  await Promise.all(chartIds.map(id => renderChart(id)));
}
start().catch(error => console.error('[FIT3179] Dashboard initialization failed:', error));
