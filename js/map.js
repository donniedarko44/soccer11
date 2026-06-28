const map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {
      'carto-dark': {
        type: 'raster',
        tiles: ['https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
                'https://b.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
                'https://c.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© <a href="https://carto.com/">CARTO</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      },
      'carto-labels': {
        type: 'raster',
        tiles: ['https://a.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png',
                'https://b.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png'],
        tileSize: 256
      }
    },
    layers: [
      { id: 'carto-dark-layer',   type: 'raster', source: 'carto-dark',   minzoom: 0, maxzoom: 22 },
      { id: 'carto-labels-layer', type: 'raster', source: 'carto-labels', minzoom: 0, maxzoom: 22 }
    ]
  },
  center: [14, 48],
  zoom: 4,
  minZoom: 3,
  maxZoom: 10
});

map.addControl(new maplibregl.NavigationControl(), 'top-right');
map.scrollZoom.disable();

players.forEach(p => {
  if (!p.lat || !p.lng) return;

  // Custom red marker — scale via CSS transform-origin center so it doesn't flee
  const el = document.createElement('div');
  el.style.cssText = [
    'width:16px',
    'height:16px',
    'background:#8b0000',
    'border:2.5px solid #fff',
    'border-radius:50%',
    'cursor:pointer',
    'box-shadow:0 0 8px rgba(139,0,0,0.7)',
    'transition:transform 0.15s ease',
    'transform-origin:center center',
    'position:relative'
  ].join(';');

  // Scale without shifting anchor — use wrapper trick
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'width:16px;height:16px;display:flex;align-items:center;justify-content:center;';
  wrapper.appendChild(el);

  wrapper.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.6)'; });
  wrapper.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)'; });

  const popupHTML = `
    <span class="pop-name">${p.name}</span>
    <span class="pop-pos">${p.pos} &nbsp;${p.flag}</span>
    <span class="pop-club">${p.club} · ${p.country}</span>
    ${p.tm ? '<a class="pop-link" href="' + p.tm + '" target="_blank" rel="noopener">View on Transfermarkt →</a>' : ''}
  `;

  const popup = new maplibregl.Popup({
    closeButton: true,
    closeOnClick: true,
    offset: 14,
    maxWidth: '220px'
  }).setHTML(popupHTML);

  // Attach popup to marker using the wrapper as element
  const marker = new maplibregl.Marker({ element: wrapper, anchor: 'center' })
    .setLngLat([p.lng, p.lat])
    .setPopup(popup)
    .addTo(map);

  // Open popup on click — let MapLibre handle it natively
  wrapper.addEventListener('click', (e) => {
    e.stopPropagation();
    if (popup.isOpen()) {
      popup.remove();
    } else {
      popup.addTo(map);
      popup.setLngLat([p.lng, p.lat]);
    }
  });
});