let data; // globale Variable, damit sie auch in der Suche verwendet werden kann

const map = L.map('map').setView([52.52, 13.405], 13);

// OSM-Tiles (oder später OpenHistoricalMap Tiles)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

fetch('karten.json') // Pfad zu deinem JSON
  .then(res => res.json())
  .then(data => {
    data.forEach(k => {
      // Marker setzen
      if(k.lat && k.lon) {
        L.marker([k.lat, k.lon])
          .bindPopup(`
            <b>${k.titel}</b> (${k.jahr || 'unbekannt'})<br>
            <p>${k.beschreibung}</p>
            <img src="${k.vorderseite}" width="200"><br>
            ${k.rueckseite ? `<img src="${k.rueckseite}" width="200"><br>` : ''}
            <a href="${k.ohm_node_link}" target="_blank">In OHM ansehen</a>
          `)
          .addTo(map);
      }
    });
  })
  .catch(err => console.error('Fehler beim Laden der Karten:', err));


// JSON laden
fetch('karten.json')
  .then(response => response.json())
  .then(json => {
    data = json; // speichern
    renderCards(data); // alle Karten anzeigen
  })
  .catch(err => console.error('Fehler beim Laden der Karten:', err));

// Funktion zum Rendern der Karten
function renderCards(cards) {
  const container = document.getElementById('karten-liste');
  container.innerHTML = ''; // vorherige Inhalte löschen

  cards.forEach(k => {
    const section = document.createElement('section');
    section.innerHTML = `
      <h2>${k.titel} (${k.jahr || 'unbekannt'})</h2>
      <p><strong>Verlag:</strong> ${k.verlag || 'unbekannt'}</p>
      <img src="${k.vorderseite}" alt="Vorderseite von ${k.titel}" width="350">
      <img src="${k.rueckseite}" alt="Rückseite von ${k.titel}" width="350">
      <p>${k.beschreibung}</p>
      <p><strong>Quelle:</strong> <a href="${k.quelle}" target="_blank">Wayback/eBay</a></p>
    `;
    container.appendChild(section);
  });
}

// Suchfeld abfangen
const searchInput = document.getElementById('search');
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


