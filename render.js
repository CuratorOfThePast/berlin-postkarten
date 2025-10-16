let data; // globale Variable für Suche & Karte

const map = L.map('map').setView([52.52, 13.405], 13);

L.tileLayer('https://tiles.codefor.de/berlin/geoportal/historische-karten/straubeplan/{z}/{x}/{y}.png', {
  attribution: '"<a href=\"https://gdi.berlin.de/geonetwork/srv/ger/catalog.search#/metadata/9271450c-f95a-358a-9cff-093484cb73ae\" target=\"_blank\">Senatsverwaltung für Stadtentwicklung, Bauen und Wohnen Berlin / Straubes Übersichtsplan von Berlin (Historische Mitte)</a>"'
}).addTo(map);

// JSON laden
fetch('karten.json')
  .then(res => res.json())
  .then(json => {
    data = json; // speichern

    // Karte rendern
    data.forEach(k => {
      if(k.lat && k.lon) {
        L.marker([k.lat, k.lon])
          .bindPopup(`
            <b>${k.titel}</b> (${k.jahr || 'unbekannt'})<br>
            <p>${k.beschreibung}</p>
            <img src="${k.vorderseite}" width="200"><br>
            ${k.rueckseite ? `<img src="${k.rueckseite}" width="200"><br>` : ''}
            ${k.ohm_node_link ? `<a href="${k.ohm_node_link}" target="_blank">In OHM ansehen</a>` : ''}
          `)
          .addTo(map);
      }
    });

    // Liste rendern
    renderCards(data);
  })
  .catch(err => console.error('Fehler beim Laden der Karten:', err));

// Funktion zum Rendern der Karten-Liste
function renderCards(cards) {
  const container = document.getElementById('karten-liste');
  if(!container) return;
  container.innerHTML = '';

  cards.forEach(k => {
    const section = document.createElement('section');
    section.innerHTML = `
      <h2>${k.titel} (${k.jahr || 'unbekannt'})</h2>
      <p><strong>Verlag:</strong> ${k.verlag || 'unbekannt'}</p>
      <img src="${k.vorderseite}" alt="Vorderseite von ${k.titel}" width="350">
      ${k.rueckseite ? `<img src="${k.rueckseite}" alt="Rückseite von ${k.titel}" width="350">` : ''}
      <p>${k.beschreibung}</p>
      <p><strong>Quelle:</strong> <a href="${k.quelle}" target="_blank">Wayback/eBay</a></p>
      ${k.ohm_node_link ? `<p><a href="${k.ohm_node_link}" target="_blank">In OHM ansehen</a></p>` : ''}
    `;
    container.appendChild(section);
  });
}

// Suchfeld
const searchInput = document.getElementById('search');
if(searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = data.filter(k => {
      return (
        k.titel.toLowerCase().includes(query) ||
        (k.stadtteil && k.stadtteil.toLowerCase().includes(query)) ||
        (k.verlag && k.verlag.toLowerCase().includes(query))
      );
    });
    renderCards(filtered);
  });
}

