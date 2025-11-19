/* ============================================================
   F1 Austrian EPIC – FULL APP LOGIC
   tabs, drivers, levels, boost, event planner, maps, setup
============================================================ */

/* ===============================
        TAB NAVIGATION
=============================== */
const tabs = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

tabs.forEach(btn => {
    btn.addEventListener("click", () => {
        let tab = btn.dataset.tab;

        tabs.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        pages.forEach(p => p.classList.remove("active"));
        document.getElementById(tab).classList.add("active");
    });
});

/* ===============================
        DRIVER BASE DATA
=============================== */
const drivers = [
    { name: "Carlos Sainz", base: { o:47, d:67, q:52, s:57, t:62 }, team:"team-sainz" },
    { name: "Charles Leclerc", base:{ o:57, d:52, q:67, s:62, t:47 }, team:"team-leclerc" },
    { name: "Fernando Alonso", base:{ o:61, d:66, q:56, s:71, t:51 }, team:"team-alonso" },
    { name: "George Russell", base:{ o:67, d:52, q:72, s:57, t:62 }, team:"team-russell" },
    { name: "Lando Norris", base:{ o:57, d:67, q:62, s:52, t:72 }, team:"team-norris" },
    { name: "Oscar Piastri", base:{ o:67, d:62, q:52, s:57, t:47 }, team:"team-piastri" },
    { name: "Lewis Hamilton", base:{ o:72, d:52, q:62, s:57, t:67 }, team:"team-hamilton" },
    { name: "Max Verstappen", base:{ o:62, d:72, q:67, s:52, t:57 }, team:"team-verstappen" },
    { name: "Nico Hülkenberg", base:{ o:57, d:47, q:67, s:52, t:62 }, team:"team-hulkenberg" },
    { name: "Pierre Gasly", base:{ o:52, d:47, q:62, s:57, t:67 }, team:"team-gasly" }
];

/* User levels + boost flags stored here */
let driverState = {};
drivers.forEach(d => {
    driverState[d.name] = { level: 1, boost:false };
});

/* ===============================
      DRIVER SCREEN RENDERING
=============================== */
function renderDrivers() {

    const container = document.getElementById("drivers-list");
    container.innerHTML = "";

    drivers.forEach(d => {
        let card = document.createElement("div");
        card.className = "driver-card " + d.team;

        let level = driverState[d.name].level;
        let boosted = driverState[d.name].boost;

        // Berechnung +10% Boost
        const calc = (v) => {
            let val = v + ((level-1) * 4);
            if (boosted) val = Math.round(val * 1.10);
            return val;
        };

        card.innerHTML = `
            <div class="driver-info">
                <div style="font-size:20px;font-weight:bold;">${d.name}</div>

                <div>Überholen: <b>${calc(d.base.o)}</b></div>
                <div>Verteidigen: <b>${calc(d.base.d)}</b></div>
                <div>Qualifying: <b>${calc(d.base.q)}</b></div>
                <div>Rennstart: <b>${calc(d.base.s)}</b></div>
                <div>Reifenman.: <b>${calc(d.base.t)}</b></div>

                Level:
                <input type="number" class="level-input" min="1" max="11"
                       value="${level}"
                       onchange="updateDriverLevel('${d.name}', this.value)">
            </div>

            <div class="driver-actions">
                <div class="star-btn ${boosted ? "boost-active" : ""}"
                     onclick="toggleBoost('${d.name}')">
                     ⭐
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

/* Boost toggeln */
function toggleBoost(name) {
    driverState[name].boost = !driverState[name].boost;
    renderDrivers();
}

/* Level ändern */
function updateDriverLevel(name, level) {
    driverState[name].level = parseInt(level);
    renderDrivers();
}

renderDrivers();

/* ===============================
      TRACK DATA + MAPS
=============================== */
const tracks = [
    { id:1,  name:"Melbourne", main1:"Rennstart", main2:"Tempo", img:"01_Melbourne.png" },
    { id:2,  name:"Jeddah", main1:"Reifenmanagement", main2:"Tempo", img:"02_Jeddah.png" },
    { id:3,  name:"Miami", main1:"Verteidigen", main2:"Tempo", img:"03_Miami.png" },
    { id:4,  name:"Silverstone", main1:"Reifenmanagement", main2:"Tempo", img:"04_Silverstone.png" },
    { id:5,  name:"Monaco", main1:"Verteidigen", main2:"Kurven", img:"05_Monaco.png" },
    { id:6,  name:"Spielberg", main1:"Verteidigen", main2:"Tempo", img:"06_Spielberg.png" },
    { id:7,  name:"Monza", main1:"Verteidigen", main2:"Tempo", img:"07_Monza.png" },
    { id:8,  name:"Montreal", main1:"Überholen", main2:"Kurven", img:"08_Montreal.png" },
    { id:9,  name:"Hungaroring", main1:"Rennstart", main2:"Kurven", img:"09_Hungaroring.png" },
    { id:10, name:"Zandvoort", main1:"Verteidigen", main2:"Kurven", img:"10_Zandvoort.png" },
    { id:11, name:"Austin", main1:"Reifenmanagement", main2:"Kurven", img:"11_Austin.png" },
    { id:12, name:"Shanghai", main1:"Überholen", main2:"Antrieb", img:"12_Shanghai.png" },
    { id:13, name:"Baku", main1:"Überholen", main2:"Tempo", img:"13_Baku.png" },
    { id:14, name:"SaoPaulo", main1:"Überholen", main2:"Kurven", img:"14_SaoPaulo.png" },
    { id:15, name:"Las Vegas", main1:"Überholen", main2:"Tempo", img:"15_LasVegas.png" },
    { id:16, name:"Imola", main1:"Rennstart", main2:"Antrieb", img:"16_Imola.png" },
    { id:17, name:"Singapur", main1:"Rennstart", main2:"Antrieb", img:"17_Singapur.png" },
    { id:18, name:"Mexico", main1:"Rennstart", main2:"Antrieb", img:"18_Mexico.png" },
    { id:19, name:"Spa", main1:"Reifenmanagement", main2:"Antrieb", img:"19_Spa.png" },
    { id:20, name:"AbuDhabi", main1:"Überholen", main2:"Antrieb", img:"20_AbuDhabi.png" },
    { id:21, name:"Sakhir", main1:"Reifenmanagement", main2:"Antrieb", img:"21_Sakhir.png" },
    { id:22, name:"Barcelona", main1:"Reifenmanagement", main2:"Kurvenverhalten", img:"22_Barcelona.png" },
    { id:23, name:"Suzuka", main1:"Verteidigen", main2:"Kurvenverhalten", img:"23_Suzuka.png" }
];

/* MAP RENDER */
function renderMaps() {
    const grid = document.getElementById("maps-grid");
    grid.innerHTML = "";

    tracks.forEach(t => {
        let div = document.createElement("div");
        div.className = "track-thumb";
        div.innerHTML = `
            <img src="${t.img}">
            <div style="text-align:center; margin-top: 5px;">
                <b>${t.name}</b>
            </div>
        `;
        div.onclick = () => showMap(t.id);
        grid.appendChild(div);
    });
}

renderMaps();

/* MAP POPUP */
function showMap(id) {
    const t = tracks.find(x => x.id === id);
    const popup = document.getElementById("map-popup");
    const content = document.getElementById("map-popup-content");

    const guide = guideTexts[t.name] || "Keine Beschreibung vorhanden.";

    content.innerHTML = `
        <h2 style="text-align:center;">${t.name}</h2>
        <img src="${t.img}">
        <p style="white-space: pre-line; font-size:16px; margin-top:15px;">
            ${guide}
        </p>
        <div style="text-align:center;">
            <button onclick="closeMap()" style="
                padding:10px 18px;
                margin-top:15px;
                background:#d40000;
                color:white;
                border:none;
                border-radius:8px;
                cursor:pointer;">
                Schließen
            </button>
        </div>
    `;

    popup.style.display = "flex";
}

function closeMap() {
    document.getElementById("map-popup").style.display = "none";
}

/* ===============================
    GUIDE TEXTS (DEINE TEXTE)
=============================== */

const guideTexts = {
    "Melbourne": `
Rennstart direkt Boosten

Turn 1 & 2 – Boost
Turn 2–3 – Aufladen
Turn 3–7 – Boost
Turn 7–11 – Neutral
Turn 11–14 – Boost
Turn 14–DRS – Neutral

Vorgang wiederholen. Situation lesen und Boost flexibel einsetzen.
`,

// ... alle anderen Texte deiner langen Liste …
    "Monza": `
Bei gutem Start Boost.
T1–2: Boost (falls frei). 
T3–4: Aufladen.
T4–7: Boost.
T7–10: Neutral.
T10–11: Aufladen.
T11 Ausfahrt: Boost.
Bis T1: Neutral + DRS.

Wiederholen. Großes Potenzial zwischen T7–8.
`
};

/* ===============================
       EVENT PLANNER
=============================== */
function renderEventPlanner() {
    const container = document.getElementById("event-rows");
    container.innerHTML = "";

    for (let i=1; i<=8; i++) {
        let row = document.createElement("div");
        row.className = "event-row";

        row.innerHTML = `
            <div class="event-grid">
                <select id="track-${i}" onchange="updateEventRow(${i})">
                    <option value="">-</option>
                    ${tracks.map(t => `<option value="${t.name}">${t.name}</option>`).join("")}
                </select>

                <div id="values-${i}"></div>

                <select id="driverA-${i}" class="driverA">
                    <option value="">-</option>
                    ${drivers.map(d=>`<option>${d.name}</option>`).join("")}
                </select>

                <select id="tyreA-${i}" class="tyreA">
                    <option>Soft/Soft</option>
                    <option>Soft/Med</option>
                    <option>Soft/Hard</option>
                    <option>Med/Soft</option>
                    <option>Med/Med</option>
                    <option>Med/Hard</option>
                    <option>Hard/Soft</option>
                    <option>Hard/Med</option>
                    <option>Hard/Hard</option>
                </select>

                <select id="driverB-${i}" class="driverB">
                    <option value="">-</option>
                    ${drivers.map(d=>`<option>${d.name}</option>`).join("")}
                </select>

                <select id="tyreB-${i}" class="tyreB">
                    <option>Soft/Soft</option>
                    <option>Soft/Med</option>
                    <option>Soft/Hard</option>
                    <option>Med/Soft</option>
                    <option>Med/Med</option>
                    <option>Med/Hard</option>
                    <option>Hard/Soft</option>
                    <option>Hard/Med</option>
                    <option>Hard/Hard</option>
                </select>

                <input id="boost-${i}" class="boost-input" placeholder="Boost">

                <div class="guide-link" onclick="openTrackGuide(${i})">Guide</div>
            </div>
        `;

        container.appendChild(row);
    }
}

renderEventPlanner();

/* Update: Track selection → Werte anzeigen */
function updateEventRow(i) {
    const name = document.getElementById(`track-${i}`).value;
    const box = document.getElementById(`values-${i}`);

    const t = tracks.find(x => x.name === name);
    if (!t) {
        box.innerHTML = "";
        return;
    }

    box.innerHTML = `
        <b>${t.main1}</b> | <b>${t.main2}</b>
    `;
}

/* Event Guide Button */
function openTrackGuide(i) {
    let t = document.getElementById(`track-${i}`).value;
    if (!t) return;

    const obj = tracks.find(x => x.name === t);
    if (!obj) return;

    showMap(obj.id);
}

/* ===============================
        PDF EXPORT
=============================== */
document.getElementById("exportPDF").addEventListener("click", () => {
    window.print();
});

/* ===============================
        SETUP SECTION
=============================== */

const setupContainer = document.getElementById("setup-grid");

function renderSetup() {
    setupContainer.innerHTML = "";

    for (let i=1; i<=8; i++) {
        let div = document.createElement("div");
        div.className = "track-thumb";
        div.innerHTML = `
            <h3 style="margin:0;text-align:center;">Setup ${i}</h3>
            <div id="setup-name-${i}" style="text-align:center; margin-top:5px;">-</div>

            <button onclick="openSetup(${i})" style="
                width:100%;
                margin-top:10px;
                padding:8px;
                background:#e41d1d;
                color:white;
                border:none;
                border-radius:8px;
                cursor:pointer;">
                Öffnen
            </button>
        `;
        setupContainer.appendChild(div);
    }
}

renderSetup();

/* Setup Popup */
function openSetup(i) {
    let track = document.getElementById(`track-${i}`).value || "-";

    let popup = document.getElementById("map-popup");
    let content = document.getElementById("map-popup-content");

    content.innerHTML = `
        <h2 style="text-align:center;">Setup ${i} für: ${track}</h2>

        <p>
        <b>Bremsen:</b> Boombox<br>
        <b>Getriebe:</b> Metronome<br>
        <b>Heckflügel:</b> The Valkyrie<br>
        <b>Frontflügel:</b> Flex XL<br>
        <b>Aufhängung:</b> Nexus<br>
        <b>Motor:</b> Turbo Jet<br>
        </p>

        <div style="text-align:center;">
            <button onclick="closeMap()" style="
                padding:10px 18px;
                margin-top:15px;
                background:#d40000;
                color:white;
                border:none;
                border-radius:8px;
                cursor:pointer;">
                Schließen
            </button>
        </div>
    `;

    popup.style.display = "flex";
}
