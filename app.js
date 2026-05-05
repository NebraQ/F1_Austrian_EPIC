/* ======================================================
   F1 Austrian EPIC – FULL APP LOGIC (DE/EN)
====================================================== */

const driverImages = {
    "Max Verstappen": "Verstappen.png",
    "Lando Norris": "Norris.png",
    "Gabriel Bortoleto": "Bortoleto.png",
    "Lance Stroll": "Stroll.png",
    "Esteban Ocon": "Ocon.png",
    "Nico Hülkenberg": "Hülkenberg.png",
    "Alex Albon": "Albon.png",
    "Sergio Pérez": "Perez.png",
    "Oliver Bearman": "Bearman.png",
    "Isack Hadjar": "Hadjar.png",
    "Fernando Alonso": "Alonso.png",
    "Carlos Sainz": "Sainz.png",
    "Andrea Kimi Antonelli": "Kimi.png",
    "Lewis Hamilton": "Hamilton.png",
    "Charles Leclerc": "Lecler.png",
    "George Russell": "Rus.png",
    "Oscar Piastri": "Piastri.png"
};

const translations = {
    de: {
        drivers: "Fahrer",
        event: "Event",
        maps: "Strecken",
        setup: "Setup",

        // Labels / Titel
        tyreA: "Reifen A",
        tyreB: "Reifen B",
        driverA: "Fahrer A",
        driverB: "Fahrer B",
        track: "Strecke",
        race: "Rennen",
        selectTrack: "Strecke wählen",
        boost: "Boost",
        guide: "Guide",
        showGuide: "Guide anzeigen",
        exportPDF: "Event als PDF exportieren",
        level: "Level",
        select: "Auswählen",
        boost10: "+10%",
        lapsLabel: "Runden",
        showSetup: "Setup anzeigen",
        setupForRace: "Setup für Rennen",   // Titel im Popup

        // Fahrer-Attribute
        attr_o: "Überholen",
        attr_d: "Verteidigen",
        attr_q: "Qualifying",
        attr_s: "Rennstart",
        attr_t: "Reifenman.",

        // Track-Guide Legende
        guideLegend: "⚡ Boost   🔋 Laden   🟢 Overtake   💤 Neutral",

        // Setup-Komponenten
        compBrakes: "Bremsen",
        compGearbox: "Getriebe",
        compRearWing: "Heckflügel",
        compFrontWing: "Frontflügel",
        compSuspension: "Aufhängung",
        compEngine: "Motor",
        compBattery: "Batterie",

        // Sortierung
    sortLabel: "Sortierung",
    sort_name: "Name",
    sort_overtake: "Überholen",
    sort_defend: "Verteidigen",
    sort_quali: "Qualifying",
    sort_start: "Rennstart",
    sort_tyre: "Reifenman.",
    sort_overall: "Best Overall",
   
    },
    en: {
        drivers: "Drivers",
        event: "Event",
        maps: "Maps",
        setup: "Setup",

        tyreA: "Tyres A",
        tyreB: "Tyres B",
        driverA: "Driver A",
        driverB: "Driver B",
        track: "Track",
        race: "Race",
        selectTrack: "Select track",
        boost: "Boost",
        guide: "Guide",
        showGuide: "Show guide",
        exportPDF: "Export event as PDF",
        level: "Level",
        select: "Select",
        boost10: "+10%",
        lapsLabel: "Laps",
        showSetup: "Show setup",
        setupForRace: "Setup for race",

        attr_o: "Overtaking",
        attr_d: "Defending",
        attr_q: "Qualifying",
        attr_s: "Race Start",
        attr_t: "Tyre Mgmt",

        guideLegend: "⚡ Boost   🔋 Charge   🟢 Overtake   💤 Neutral",

        compBrakes: "Brakes",
        compGearbox: "Gearbox",
        compRearWing: "Rear Wing",
        compFrontWing: "Front Wing",
        compSuspension: "Suspension",
        compEngine: "Engine",
        compBattery: "Battery",

        // Sort
        sortLabel: "Sort by",
        sort_name: "Name",
        sort_overtake: "Overtaking",
        sort_defend: "Defending",
        sort_quali: "Qualifying",
        sort_start: "Race Start",
        sort_tyre: "Tyre Mgmt",
        sort_overall: "Best Overall"
    }
};

let currentLang = localStorage.getItem("ae_lang") || "de";


/* ---------------------------------------
   TAB NAVIGATION (BOTTOM NAV – FIXED)
----------------------------------------- */
const tabs = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".tab");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        let target = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove("active"));
        sections.forEach(s => s.classList.remove("active"));

        tab.classList.add("active");
        document.getElementById(target).classList.add("active");
    });
});


/* ---------------------------------------
   DRIVER BASE DATA (Level 1 Stats)
----------------------------------------- */
const drivers = [
    { name: "Gabriel Bortoleto",     series: 10, team: "team-green",  base: { o:33,d:32,q:45,s:34,t:31 } },
    { name: "Lance Stroll",          series: 10, team: "team-green",  base: { o:29,d:48,q:41,s:22,t:35 } },
    { name: "Esteban Ocon",          series: 10, team: "team-pink",   base: { o:25,d:36,q:37,s:34,t:43 } },
    { name: "Nico Hülkenberg",       series: 10, team: "team-green",  base: { o:25,d:45,q:55,s:25,t:25 } },
    { name: "Alex Albon",            series: 10, team: "team-blue",   base: { o:15,d:50,q:50,s:25,t:35 } },
    { name: "Sergio Pérez",          series: 10, team: "team-blue",   base: { o:15,d:40,q:40,s:40,t:40 } },
    { name: "Oliver Bearman",        series: 11, team: "team-red",    base: { o:25,d:45,q:55,s:45,t:30 } },
    { name: "Isack Hadjar",          series: 11, team: "team-blue",   base: { o:35,d:55,q:40,s:35,t:35 } },
    { name: "Fernando Alonso",       series: 11, team: "team-green",  base: { o:40,d:40,q:40,s:40,t:40 } },
    { name: "Carlos Sainz",          series: 11, team: "team-blue",   base: { o:25,d:50,q:50,s:25,t:50 } },
    { name: "Andrea Kimi Antonelli", series: 11, team: "team-silver", base: { o:30,d:35,q:60,s:40,t:35 } },
    { name: "Lewis Hamilton",        series: 12, team: "team-red",    base: { o:39,d:44,q:54,s:29,t:54 } },
    { name: "Charles Leclerc",       series: 12, team: "team-red",    base: { o:24,d:49,q:59,s:49,t:39 } },
    { name: "George Russell",        series: 12, team: "team-silver", base: { o:44,d:39,q:49,s:39,t:49 } },
    { name: "Oscar Piastri",         series: 12, team: "team-orange", base: { o:34,d:59,q:44,s:44,t:39 } },
    { name: "Max Verstappen",        series: 12, team: "team-blue",   base: { o:39,d:44,q:64,s:29,t:44 } },
    { name: "Lando Norris",          series: 12, team: "team-orange", base: { o:34,d:39,q:59,s:34,t:54 } },
];

const driverStatMeta = [
    { key: "o", labelDE: "Überholen",     labelEN: "Overtaking" },
    { key: "d", labelDE: "Verteidigen",   labelEN: "Defending" },
    { key: "q", labelDE: "Qualifikation", labelEN: "Qualifying" },
    { key: "s", labelDE: "Rennstart",     labelEN: "Race Start" },
    { key: "t", labelDE: "Reifen",        labelEN: "Tyres" }
];

let driverState = {};

drivers.forEach(driver => {
    driverState[driver.name] = {
        level: 1,
        boost: false,
        stats: { ...driver.base }
    };
});

let driverSortMode = localStorage.getItem("ae_driver_sort_mode") || "name";

function getDriverStatLabel(stat) {
    return currentLang === "en" ? stat.labelEN : stat.labelDE;
}

function calcDriverStat(name, key) {
    const st = driverState[name];
    if (!st || !st.stats) return 0;

    let val = Number(st.stats[key]) || 0;

    if (st.boost) {
        val = Math.round(val * 1.1);
    }

    return val;
}

function calcSuggestedStatsFromLevel(driver, newLevel) {
    const safeLevel = Math.max(1, parseInt(newLevel, 10) || 1);
    const levelDiff = safeLevel - 1;
    const nextStats = {};

    driverStatMeta.forEach(stat => {
        nextStats[stat.key] = Number(driver.base[stat.key] || 0) + (levelDiff * 4);
    });

    return nextStats;
}

function renderDriverSortBar() {
    const t = translations[currentLang];
    const bar = document.getElementById("driver-sort-bar");
    if (!bar) return;

    bar.innerHTML = `
        <span>${t.sortLabel}:</span>
        <select id="driver-sort-select" class="driver-sort-select"
                onchange="setDriverSortMode(this.value)">
            <option value="name" ${driverSortMode === "name" ? "selected" : ""}>${t.sort_name}</option>
            <option value="o" ${driverSortMode === "o" ? "selected" : ""}>${t.sort_overtake}</option>
            <option value="d" ${driverSortMode === "d" ? "selected" : ""}>${t.sort_defend}</option>
            <option value="q" ${driverSortMode === "q" ? "selected" : ""}>${t.sort_quali}</option>
            <option value="s" ${driverSortMode === "s" ? "selected" : ""}>${t.sort_start}</option>
            <option value="t" ${driverSortMode === "t" ? "selected" : ""}>${t.sort_tyre}</option>
            <option value="overall" ${driverSortMode === "overall" ? "selected" : ""}>${t.sort_overall}</option>
        </select>
    `;
}

function setDriverSortMode(mode) {
    driverSortMode = mode;
    localStorage.setItem("ae_driver_sort_mode", mode);
    renderDrivers();
}

function renderDrivers() {
    const container = document.getElementById("driver-list");
    if (!container) return;

    renderDriverSortBar();
    container.innerHTML = "";

    const sorted = [...drivers].sort((a, b) => {
        if (driverSortMode === "name") {
            return a.name.localeCompare(b.name, "de");
        }

        let va;
        let vb;

        if (driverSortMode === "overall") {
            va = driverStatMeta.reduce((sum, stat) => sum + calcDriverStat(a.name, stat.key), 0);
            vb = driverStatMeta.reduce((sum, stat) => sum + calcDriverStat(b.name, stat.key), 0);
        } else {
            va = calcDriverStat(a.name, driverSortMode);
            vb = calcDriverStat(b.name, driverSortMode);
        }

        return vb - va;
    });

    sorted.forEach(driver => {
        const state = driverState[driver.name];
        const imageFile = driverImages[driver.name] || "default.png";

        const card = document.createElement("div");
        card.className = `driver-card ${driver.team || ""}`;

        card.innerHTML = `
            <div class="driver-left">
                <img
                    src="assets/drivers/${imageFile}"
                    alt="${driver.name}"
                    class="driver-img"
                    loading="lazy"
                >
                <div class="driver-name">${driver.name}</div>
                <div class="driver-series">
                    S${driver.series} · Level ${state.level}
                </div>
            </div>

            <div class="driver-right">
                <div class="driver-boost-row">
                    <span class="boost-star ${state.boost ? "active" : ""}"
                          onclick="toggleBoost('${driver.name}')">⭐</span>
                    <span class="boost-text">${translations[currentLang].boost10}</span>
                    <button class="driver-edit-btn"
                            onclick="openDriverEditPopup('${driver.name}')">
                        Werte / Level
                    </button>
                </div>

                <div class="driver-stats">
                    ${driverStatMeta.map(stat => {
                        const value = calcDriverStat(driver.name, stat.key);
                        const percent = Math.min(100, Math.max(0, value));

                        return `
                            <div class="driver-stat">
                                <div class="driver-stat-top">
                                    <span>${getDriverStatLabel(stat)}</span>
                                    <strong>${value}</strong>
                                </div>
                                <div class="driver-stat-bar">
                                    <div class="driver-stat-fill" style="width:${percent}%"></div>
                                </div>
                            </div>
                        `;
                    }).join("")}
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

function toggleBoost(name) {
    driverState[name].boost = !driverState[name].boost;
    saveState();
    renderDrivers();
}

function openDriverEditPopup(name) {
    const driver = drivers.find(d => d.name === name);
    const state = driverState[name];

    if (!driver || !state) return;

    let popup = document.getElementById("driver-edit-popup");

    if (!popup) {
        popup = document.createElement("div");
        popup.id = "driver-edit-popup";
        popup.className = "popup hidden";

        popup.innerHTML = `
            <div class="popup-content driver-edit-popup-content">
                <span id="closeDriverEditPopup" class="close-btn">✖</span>
                <h2 id="driver-edit-title"></h2>
                <div id="driver-edit-body"></div>
            </div>
        `;

        document.body.appendChild(popup);

        document.getElementById("closeDriverEditPopup").addEventListener("click", closeDriverEditPopup);
    }

    const body = document.getElementById("driver-edit-body");
    const title = document.getElementById("driver-edit-title");

    title.textContent = `${driver.name} bearbeiten`;

    body.innerHTML = `
        <div class="driver-edit-level-row">
            <label>Aktuelles Level:</label>
            <strong>${state.level}</strong>
        </div>

        <div class="driver-edit-level-row">
            <label for="driver-edit-level">Neues Level:</label>
            <input id="driver-edit-level"
                   type="number"
                   min="1"
                   max="99"
                   value="${state.level}">
        </div>

        <div class="driver-edit-hint">
            Vorschlag rechnet aktuell mit +4 pro Level. Du kannst jeden Wert danach manuell überschreiben.
        </div>

        <div id="driver-edit-stats"></div>

        <div class="driver-edit-actions">
            <button type="button" class="driver-cancel-btn" onclick="closeDriverEditPopup()">Abbrechen</button>
            <button type="button" class="driver-save-btn" onclick="saveDriverEdit('${driver.name}')">Speichern</button>
        </div>
    `;

    const levelInput = document.getElementById("driver-edit-level");
    levelInput.addEventListener("input", () => updateDriverEditPreview(driver.name));

    popup.dataset.driverName = driver.name;
    updateDriverEditPreview(driver.name);

    document.body.classList.add("modal-open");
    popup.classList.remove("hidden");
}

function updateDriverEditPreview(name) {
    const driver = drivers.find(d => d.name === name);
    const state = driverState[name];

    if (!driver || !state) return;

    const levelInput = document.getElementById("driver-edit-level");
    const statsBox = document.getElementById("driver-edit-stats");

    if (!levelInput || !statsBox) return;

    const newLevel = Math.max(1, parseInt(levelInput.value, 10) || 1);
    const suggestedStats = calcSuggestedStatsFromLevel(driver, newLevel);

    statsBox.innerHTML = driverStatMeta.map(stat => {
        const oldValue = Number(state.stats[stat.key]) || 0;
        const newValue = suggestedStats[stat.key];
        const diff = newValue - oldValue;
        const diffText = diff > 0 ? `+${diff}` : `${diff}`;

        return `
            <div class="driver-edit-stat-row">
                <label>${getDriverStatLabel(stat)}</label>

                <div class="driver-edit-old">
                    Alt: <strong>${oldValue}</strong>
                </div>

                <input type="number"
                       min="0"
                       max="999"
                       id="driver-edit-stat-${stat.key}"
                       value="${newValue}">

                <div class="driver-edit-diff ${diff >= 0 ? "positive" : "negative"}">
                    ${diffText}
                </div>
            </div>
        `;
    }).join("");
}

function saveDriverEdit(name) {
    const state = driverState[name];
    if (!state) return;

    const levelInput = document.getElementById("driver-edit-level");
    const newLevel = Math.max(1, parseInt(levelInput?.value, 10) || 1);

    state.level = newLevel;

    driverStatMeta.forEach(stat => {
        const input = document.getElementById(`driver-edit-stat-${stat.key}`);
        state.stats[stat.key] = Math.max(0, parseInt(input?.value, 10) || 0);
    });

    saveState();
    closeDriverEditPopup();
    renderDrivers();
}

function closeDriverEditPopup() {
    document.getElementById("driver-edit-popup")?.classList.add("hidden");
    document.body.classList.remove("modal-open");
}

function renderStatInput(name, key, label) {
    const rawValue = driverState[name].stats[key];

    return `
        <div class="stat-box">
            ${label}<br>
            <input type="number"
                   class="driver-stat-input"
                   min="0"
                   max="999"
                   value="${rawValue}"
                   onchange="updateDriverStat('${name}', '${key}', this.value)">
        </div>
    `;
}

function updateDriverStat(name, key, val) {
    driverState[name].stats[key] = parseInt(val, 10) || 0;
    saveState();
    renderDrivers();
}


/* ---------------------------------------
   TRACK LIST + ATTRIBUTES
----------------------------------------- */
/* ---------------------------------------
   HELPER – Attribute übersetzen
----------------------------------------- */
function translateAttrLabel(attr) {
    const map = {
        de: {
            "Rennstart": "Rennstart",
            "Tempo": "Tempo",
            "Verteidigen": "Verteidigen",
            "Überholen": "Überholen",
            "Reifenmanagement": "Reifenman.",
            "Reifen-Management": "Reifenman.",
            "Kurvenverhalten": "Kurvenverhalten",
            "Antrieb": "Antrieb"
        },
        en: {
            "Rennstart": "Race Start",
            "Tempo": "Pace",
            "Verteidigen": "Defending",
            "Überholen": "Overtaking",
            "Reifenmanagement": "Tyre Mgmt",
            "Reifen-Management": "Tyre Mgmt",
            "Kurvenverhalten": "Cornering",
            "Antrieb": "Engine Power"
        }
    };

    const m = map[currentLang] || map.de;
    return m[attr] || attr;
}

function formatTrackAttrs(track) {
    if (!track) return "";
    const a1 = translateAttrLabel(track.main1);
    const a2 = translateAttrLabel(track.main2);
    return `${a1} | ${a2}`;
}
function formatLaps(track) {
    if (!track || !track.laps) return "";
    const t = translations[currentLang];
    return `${t.lapsLabel}: ${track.laps}`;
}

const tracks = [
    { id:1,  name:"Melbourne",   main1:"Rennstart",         main2:"Kurvenverhalten", img:"01_Melbourne.png",   laps: 9 },
    { id:2,  name:"Jeddah",      main1:"Verteidigen",       main2:"Tempo",           img:"02_Jeddah.png",      laps: 4 },
    { id:3,  name:"Miami",       main1:"Überholen",         main2:"Tempo",           img:"03_Miami.png",       laps: 6 },
    { id:4,  name:"Silverstone", main1:"Reifenmanagement",  main2:"Tempo",           img:"04_Silverstone.png", laps: 7 },
    { id:5,  name:"Monaco",      main1:"Verteidigen",       main2:"Kurvenverhalten", img:"05_Monaco.png",      laps: 5 },
    { id:6,  name:"Spielberg",   main1:"Rennstart",         main2:"Kurvenverhalten", img:"06_Spielberg.png",   laps: 7 },
    { id:7,  name:"Monza",       main1:"Verteidigen",       main2:"Tempo",           img:"07_Monza.png",       laps: 6 },
    { id:8,  name:"Montreal",    main1:"Rennstart",         main2:"Antrieb",         img:"08_Montreal.png",    laps: 8 },
    { id:9,  name:"Hungaroring", main1:"Überholen",         main2:"Kurvenverhalten", img:"09_Hungaroring.png", laps: 6 },
    { id:10, name:"Zandvoort",   main1:"Verteidigen",       main2:"Kurvenverhalten", img:"10_Zandvoort.png",   laps: 8 },
    { id:11, name:"Austin",      main1:"Rennstart",         main2:"Kurvenverhalten", img:"11_Austin.png",      laps: 6 },
    { id:12, name:"Shanghai",    main1:"Verteidigen",       main2:"Antrieb",         img:"12_Shanghai.png",    laps: 7 },
    { id:13, name:"Baku",        main1:"Reifenmanagement",  main2:"Antrieb",         img:"13_Baku.png",        laps: 7 },
    { id:14, name:"São Paulo",   main1:"Überholen",         main2:"Antrieb",         img:"14_SaoPaulo.png",    laps: 5 },
    { id:15, name:"Las Vegas",   main1:"Überholen",         main2:"Tempo",           img:"15_LasVegas.png",    laps: 6 },
    { id:16, name:"Singapur",    main1:"Rennstart",         main2:"Tempo",           img:"17_Singapur.png",    laps: 6 },
    { id:17, name:"Mexico City", main1:"Reifenmanagement",  main2:"Antrieb",         img:"18_Mexico.png",      laps: 9 },
    { id:18, name:"Spa",         main1:"Überholen",         main2:"Antrieb",         img:"19_Spa.png",         laps: 6 },
    { id:19, name:"Abu Dhabi",   main1:"Überholen",         main2:"Tempo",           img:"20_AbuDhabi.png",    laps: 8 },
    { id:20, name:"Sakhir",      main1:"Reifenmanagement",  main2:"Antrieb",         img:"21_Sakhir.png",      laps: 8 },
    { id:21, name:"Barcelona",   main1:"Reifenmanagement",  main2:"Tempo",           img:"22_Barcelona.png",   laps: 10 },
    { id:22, name:"Suzuka",      main1:"Reifenmanagement",  main2:"Kurvenverhalten", img:"23_Suzuka.png",      laps: 5 }
];



/* ---------------------------------------
   TRACK MAPS – LIST + POPUP
----------------------------------------- */
function renderTrackList() {
    const list = document.getElementById("track-list");
    list.innerHTML = "";

    tracks.forEach(t => {
        let div = document.createElement("div");
        div.className = "track-entry";

        const attrs = formatTrackAttrs(t);
        // Anzeige: Melbourne — Rennstart | Tempo
        div.textContent = attrs ? `${t.name} — ${attrs}` : t.name;

        div.onclick = () => openTrackPopup(t);
        list.appendChild(div);
    });
}


function getGuideText(trackName) {
    const guideNameMap = {
        "São Paulo": "SaoPaulo",
        "Mexico City": "Mexico",
        "Abu Dhabi": "AbuDhabi"
    };

    const key = guideNameMap[trackName] || trackName;
    return guideTexts[key] || (currentLang === "en" ? "No guide yet." : "Keine Beschreibung vorhanden.");
}

function openTrackPopup(track) {
    const popup = document.getElementById("track-popup");
    popup.classList.remove("hidden");  // -> :not(.hidden) → Animation

    document.getElementById("popup-track-title").innerText = track.name;
    document.getElementById("popup-track-img").src = track.img;

    const guideEl = document.getElementById("popup-track-guide");
    const t = translations[currentLang];
    const text = getGuideText(track.name);

    guideEl.innerHTML = `
        <div class="guide-legend">
            ${t.guideLegend}
        </div>
        <div class="guide-body"></div>
    `;
    guideEl.querySelector(".guide-body").textContent = text;
}

document.getElementById("closePopup").onclick = () => {
    document.getElementById("track-popup").classList.add("hidden");
};


document.getElementById("closePopup").onclick = () => {
    document.getElementById("track-popup").classList.add("hidden");
};


/* ---------------------------------------
   EVENT PLANNER
----------------------------------------- */
function renderEventPlanner() {
    const t = translations[currentLang];
    const eventBox = document.getElementById("event-container");
    if (!eventBox) return;

    eventBox.innerHTML = "";

    // Tyre-Optionen inkl. Wets
    const tyreOptions = [
        "Soft/Soft","Soft/Med","Soft/Hard",
        "Med/Soft","Med/Med","Med/Hard",
        "Hard/Soft","Hard/Med","Hard/Hard",
        "Wet/Wet",
        "Soft/Soft/Soft","Soft/Soft/Med","Soft/Med/Soft","Med/Soft/Soft"
    ];

    for (let i = 1; i <= 8; i++) {
        const row = document.createElement("div");
        row.className = "event-card";

        row.innerHTML = `
            <div class="event-card-header">
                <span class="event-race-label">${t.race} ${i}</span>
                <span class="event-laps" id="ev-laps-${i}"></span>
                <button type="button" id="ev-rain-${i}" class="rain-btn rain-off" onclick="toggleRain(${i})">
                    🌧️
                </button>
            </div>

            <div class="event-track-row">
                <select id="ev-track-${i}" class="event-input">
                    <option value="">${t.selectTrack}</option>
                    ${tracks.map(tr => `<option>${tr.name}</option>`).join("")}
                </select>
                <div class="event-attrs" id="ev-attrs-${i}"></div>
            </div>

            <div class="event-drivers-row">
                <div class="event-driver-col driver-a">
                    <div class="event-subtitle">${t.driverA}</div>
                    <select id="ev-driverA-${i}" class="event-input">
                        <option value=""></option>
                        ${drivers.map(d => `<option>${d.name}</option>`).join("")}
                    </select>

                    <div class="event-subtitle tyres-label">${t.tyreA}</div>
                    <select id="ev-tyreA-${i}" class="event-input">
                        ${tyreOptions.map(o => `<option>${o}</option>`).join("")}
                    </select>
                </div>

                <div class="event-driver-col driver-b">
                    <div class="event-subtitle">${t.driverB}</div>
                    <select id="ev-driverB-${i}" class="event-input">
                        <option value=""></option>
                        ${drivers.map(d => `<option>${d.name}</option>`).join("")}
                    </select>

                    <div class="event-subtitle tyres-label">${t.tyreB}</div>
                    <select id="ev-tyreB-${i}" class="event-input">
                        ${tyreOptions.map(o => `<option>${o}</option>`).join("")}
                    </select>
                </div>
            </div>

            <div class="event-boost-row">
                <span>${t.boost}:</span>
                <textarea id="ev-boost-${i}" class="event-boost-input" rows="2"
                    placeholder="z.B. Push Runde 1 in Sektor 2, danach sparen…"></textarea>
            </div>

         <div class="event-footer">
             <span class="guide-link" onclick="openTrackGuideFromPlanner(${i})">
                 ${t.showGuide}
             </span>
             <span class="guide-link" onclick="openSetupFromPlanner(${i})" style="margin-left:12px;">
                 ${t.showSetup}
             </span>
        </div>
        `;

        eventBox.appendChild(row);
    }

    // Nach dem Rendern direkt Attribute + Runden aktualisieren
    updateAllEventAttrsAndLaps();
}


function updateEventAttrsRow(i) {
    const sel = document.getElementById(`ev-track-${i}`);
    const out = document.getElementById(`ev-attrs-${i}`);
    const lapsEl = document.getElementById(`ev-laps-${i}`);
    if (!sel || !out || !lapsEl) return;

    const track = tracks.find(t => t.name === sel.value);
    out.textContent = track ? formatTrackAttrs(track) : "";
    lapsEl.textContent = track ? formatLaps(track) : "";
}

function updateAllEventAttrsAndLaps() {
    for (let i = 1; i <= 8; i++) {
        updateEventAttrsRow(i);
    }
}


function openTrackGuideFromPlanner(i) {
    let name = document.getElementById(`ev-track-${i}`).value;
    if (!name) return;

    let track = tracks.find(t => t.name === name);
    if (!track) return;

    openTrackPopup(track);
}


/* ---------------------------------------
   SETUP BOXES
----------------------------------------- */
function renderSetups() {
    const t = translations[currentLang];
    const cont = document.getElementById("setup-container");
    cont.innerHTML = "";

    for (let i = 1; i <= 8; i++) {
        let box = document.createElement("div");
        box.className = "setup-box";

        box.innerHTML = `
            <div class="setup-title">Setup ${i}</div>

            <div class="setup-row">
                <span class="setup-label">${t.compBrakes}:</span>
                <select class="setup-select">
                    <option>Boombox</option>
                    <option>Flow 1K</option>
                    <option>Rumble</option>
                </select>
            </div>

            <div class="setup-row">
                <span class="setup-label">${t.compGearbox}:</span>
                <select class="setup-select">
                    <option>The Beast</option>
                    <option>Metronome</option>
                    <option>The Dynamo</option>
                </select>
            </div>

            <div class="setup-row">
                <span class="setup-label">${t.compRearWing}:</span>
                <select class="setup-select">
                    <option>The Valkyrie</option>
                    <option>Aero Blade</option>
                    <option>Power Lift</option>
                </select>
            </div>

            <div class="setup-row">
                <span class="setup-label">${t.compFrontWing}:</span>
                <select class="setup-select">
                    <option>Flex XL</option>
                    <option>Curler</option>
                    <option>The Sabre</option>
                </select>
            </div>

            <div class="setup-row">
                <span class="setup-label">${t.compSuspension}:</span>
                <select class="setup-select">
                    <option>Nexus</option>
                    <option>Gyro</option>
                    <option>Quantum</option>
                </select>
            </div>

            <div class="setup-row">
                <span class="setup-label">${t.compEngine}:</span>
                <select class="setup-select">
                    <option>Turbo Jet</option>
                    <option>Behemoth</option>
                    <option>Mach III</option>
                </select>
            </div>
        `;

        cont.appendChild(box);
    }
}
function getSetupForIndex(i) {
    // Setup-Box Nummer i (1–8)
    const setupBoxes = document.querySelectorAll("#setup-container .setup-box");
    const box = setupBoxes[i - 1];
    if (!box) return null;

    const selects = box.querySelectorAll("select");
    if (selects.length < 6) return null;

    return {
        brakes: selects[0].value,
        gearbox: selects[1].value,
        rearWing: selects[2].value,
        frontWing: selects[3].value,
        suspension: selects[4].value,
        engine: selects[5].value
    };
}

function openSetupPopup(i, setupData) {
    const t = translations[currentLang];
    const popup = document.getElementById("setup-popup");
    const titleEl = document.getElementById("popup-setup-title");
    const bodyEl  = document.getElementById("popup-setup-body");

    if (!popup || !titleEl || !bodyEl) return;

    titleEl.textContent = `${t.setupForRace} ${i}`;

    if (!setupData) {
        bodyEl.innerHTML = `<p>Kein Setup gefunden. Bitte im Tab "Setup" zuerst etwas auswählen.</p>`;
    } else {
        bodyEl.innerHTML = `
            <div class="setup-line">
                <span class="setup-label">${t.compBrakes}:</span>
                <span>${setupData.brakes}</span>
            </div>
            <div class="setup-line">
                <span class="setup-label">${t.compGearbox}:</span>
                <span>${setupData.gearbox}</span>
            </div>
            <div class="setup-line">
                <span class="setup-label">${t.compRearWing}:</span>
                <span>${setupData.rearWing}</span>
            </div>
            <div class="setup-line">
                <span class="setup-label">${t.compFrontWing}:</span>
                <span>${setupData.frontWing}</span>
            </div>
            <div class="setup-line">
                <span class="setup-label">${t.compSuspension}:</span>
                <span>${setupData.suspension}</span>
            </div>
            <div class="setup-line">
                <span class="setup-label">${t.compEngine}:</span>
                <span>${setupData.engine}</span>
            </div>
        `;
    }

    popup.classList.remove("hidden");
}

// Event-Tab ruft das hier auf:
function openSetupFromPlanner(i) {
    const setup = getSetupForIndex(i);
    openSetupPopup(i, setup);
}

// Close-Button vom Setup-Popup verbinden
document.getElementById("closeSetupPopup")?.addEventListener("click", () => {
    document.getElementById("setup-popup").classList.add("hidden");
});


/* ---------------------------------------
   GUIDE TEXTS (DE – wie gehabt)
----------------------------------------- */
const guideTexts = {
    "Melbourne": `
Boost empfehlung:
S: Prinz / Cuppa / Herold / Nazar
A: Haken / Zeitlos / Kawaii / Kürbis
Basic: Basic Boosts (Nur bei Duellen)
Tipp: Achtet auf das Reifenmanagment.
Immer versuchen NICHT auf Hard-Reifen zu Fahren!
z.B.: Nazar & Kürbis (mit Reifenm.) > Kurvenverhalten & Rennstart
`,
    "Jeddah": `
Boost empfehlung:
S: Regenbogen / Vice / Ursprung
A: Tulpe
Basic: Hex , Basic Boosts (Nur bei Duellen)
Tipp: Tulpe bei hoher Boxenstopp Zeit UND wenn mehr als 1x in die Box muss.
(Boxenstopp Boost +20)
`,
    "Miami": `
Boost empfehlung:
S: Unaufhaltsam / Ewiges Feuer (Reifenman.) / Schädel
A: Feuerwerk / Strassenhai / Herzensbrecher / Eklipse / Weihnachten
Basic: Basic Boosts (Nur bei Duellen)
Tipp: Je nach Fahrer, macht es Sinn den Rennstart oder Reifen mit zu Boosten!
Bei Fahrer mit guten Reifenman. und Rennstart, unbedingt voll Überholen Boosten!
`,

    "Silverstone": `
Boost empfehlung:
S: Adler / Temperament /
A: Tödlich Schnell / Ewiges Feuer / Rookie Rausch / Krone
Basic: Basic Boosts (Nur bei Duellen)
Tipp: Leider sind Adler und der neue Boost Temperament die einzigen wirklich brauchbaren!
`,

    "Monaco": `
Boost empfehlung:
S: Ursprung / Lenker / Rentier / 
A: Haken / Prinz / Dschinn / Preiselbeere / Zar / Movember
Basic: Basic Boosts (Nur bei Duellen)
Tipp: Mit einem S12 Norris und Lenker, könnte man sogar mit Medium reifen 5/5 Runden fahren :)
`,

    "Spielberg": `
Boost empfehlung:
S: Prinz / Cuppa / Herold / Nazar
A: Haken / Zeitlos / Kawaii / Kürbis
Basic: Basic Boosts (Nur bei Duellen)
Tipp: Achtet auf das Reifenmanagment.
Immer versuchen NICHT auf Hard-Reifen zu Fahren!
z.B.: Nazar & Kürbis (mit Reifenm.) > Kurvenverhalten & Rennstart
`,

    "Monza": `
Boost empfehlung:
S: Regenbogen / Vice / Ursprung
A: Tulpe
Basic: Hex , Basic Boosts (Nur bei Duellen)
Tipp: Tulpe bei hoher Boxenstopp Zeit UND wenn mehr als 1x in die Box muss.
(Boxenstopp Boost +20)
`,

    "Montreal": `
Boost empfehlung:
S: Startrampe / Surfer / Frost (Reifenman.)
A: Konfetti / Sherryglas / Gladiator
Basic: Basic Boosts (Nur bei Duellen)
Tipp: Achtet auf das Reifenmanagment, keine Hard-Reifen!
`,

    "Hungaroring": `
Boost empfehlung:
S: Drache / Oud / Glitter / Preiselbeere
A: Weihnachten / Herlod / Cuppa / Wild
Basic: Basic Boosts (Nur bei Duellen)
Tipp: Achtet auf das Reifenmanagment, keine Hard-Reifen!
`,

    "Zandvoort": `
S: Ursprung / Lenker / Rentier / 
A: Haken / Prinz / Dschinn / Preiselbeere / Zar / Movember
Basic: Basic Boosts (Nur bei Duellen)
Tipp: Achtet auf das Reifenmanagment, keine Hard-Reifen!
`,

    "Austin": `
Boost empfehlung:
S: Prinz / Cuppa / Herold / Nazar
A: Haken / Zeitlos / Kawaii / Kürbis
Basic: Basic Boosts (Nur bei Duellen)
Tipp: Achtet auf das Reifenmanagment.
Immer versuchen NICHT auf Hard-Reifen zu Fahren!
z.B.: Nazar & Kürbis (mit Reifenm.) > Kurvenverhalten & Rennstart
`,

    "Shanghai": `
Boost empfehlung:
S: Eiserne Macht / Gladiator
A: Osterei / Dschinn
Basic: Basic Boosts (Nur bei Duellen)
Tipp: Mit Eiserne Macht S/S Reifen möglich
`,

    "Baku": `
Boost empfehlung:
S: Schmetterling / Brezel / Frost
A: Drache / Eiserne Macht / Rookie-Rausch
Basic: Basic Boosts (Nur bei Duellen)
Tipp: Tipp: Achtet auf das Reifenmanagment, keine Hard-Reifen!
`,

    "SaoPaulo": `
Boost empfehlung:
S: Ghoultreibstoff / Drache / Unaufhaltsam /
A: Glitter / Schädel / Hahn
Basic: Basic Boosts (Nur bei Duellen)
Tipp: Achtet auf das Reifenmanagment, keine Hard-Reifen!
`,

    "Las Vegas": `
Boost empfehlung:
S: Unaufhaltsam / Ewiges Feuer (Reifenman.) / Schädel
A: Feuerwerk / Strassenhai / Herzensbrecher / Eklipse / Weihnachten
Basic: Basic Boosts (Nur bei Duellen)
Tipp: Je nach Fahrer, macht es Sinn den Rennstart oder Reifen mit zu Boosten!
Bei Fahrer mit guten Reifenman. und Rennstart, unbedingt voll Überholen Boosten!
`,
   
    "Singapur": `
Boost empfehlung:
S: Strassenhai / Herzensbrecher / Überladen
A: Feuerwerk / Champion / Zeitlos
Basic: Basic Boosts (Nur bei Duellen)
Tipp: Je nachdem, macht es Sinn 2x in die Box zu fahren.
H/H oder S/H/S
`,

    "Mexico": `
Boost empfehlung:
S: Schmetterling / Brezel / Frost
A: Drache / Eiserne Macht / Rookie-Rausch
Basic: Basic Boosts (Nur bei Duellen)
Tipp: Tipp: Achtet auf das Reifenmanagment, keine Hard-Reifen!
`,

    "Spa": `
Boost empfehlung:
S: Ghoultreibstoff / Drache / Unaufhaltsam / Taurus
A: Glitter / Schädel / Hahn
Basic: Basic Boosts (Nur bei Duellen)
Tipp: Achtet auf das Reifenmanagment, keine Hard-Reifen!
`,

    "AbuDhabi": `
Boost empfehlung:
S: Unaufhaltsam / Ewiges Feuer (Reifenman.) / Schädel
A: Feuerwerk / Strassenhai / Herzensbrecher / Eklipse / Weihnachten
Basic: Basic Boosts (Nur bei Duellen)
Tipp: Je nach Fahrer, macht es Sinn den Rennstart oder Reifen mit zu Boosten!
Bei Fahrer mit guten Reifenman. und Rennstart, unbedingt voll Überholen Boosten!
`,

    "Sakhir": `
Boost empfehlung:
S: Schmetterling / Brezel / Frost
A: Drache / Eiserne Macht / Rookie-Rausch
Basic: Basic Boosts (Nur bei Duellen)
Tipp: Tipp: Achtet auf das Reifenmanagment, keine Hard-Reifen!
`,

    "Barcelona": `
Boost empfehlung:
S: Adler / Temperament /
A: Tödlich Schnell / Ewiges Feuer / Rookie Rausch / Krone
Basic: Basic Boosts (Nur bei Duellen)
Tipp: Leider sind Adler und der neue Boost Temperament die einzigen wirklich brauchbaren!
`,

    "Suzuka": `
Boost empfehlung:
S: Zar / Kürbis / Movember
A: Krone / Nazar
Basic: Basic Boosts (Nur bei Duellen)
Tipp: Tipp: Achtet auf das Reifenmanagment, keine Hard-Reifen!
`
};


/* ---------------------------------------
   AUTO-SAVE (localStorage)
----------------------------------------- */

function saveState() {
    const state = {
        drivers: driverState,
        event: [],
        setups: []
    };

    // Event Planner (8 Rennen)
    for (let i = 1; i <= 8; i++) {
        state.event.push({
            track:  document.getElementById(`ev-track-${i}`)?.value || "",
            driverA: document.getElementById(`ev-driverA-${i}`)?.value || "",
            tyreA:   document.getElementById(`ev-tyreA-${i}`)?.value || "",
            driverB: document.getElementById(`ev-driverB-${i}`)?.value || "",
            tyreB:   document.getElementById(`ev-tyreB-${i}`)?.value || "",
            boost:   document.getElementById(`ev-boost-${i}`)?.value || "",
            rain:    !!eventRainState[i]
        });
    }

    // Setups (8 Boxen)
    const setupBoxes = document.querySelectorAll(".setup-box");
    setupBoxes.forEach(box => {
        const selects = Array.from(box.querySelectorAll("select")).map(s => s.value);
        state.setups.push(selects);
    });

    try {
        localStorage.setItem("ae_state_v1", JSON.stringify(state));
    } catch (e) {
        console.warn("Konnte App-State nicht speichern:", e);
    }
}

function loadState() {
    let raw = localStorage.getItem("ae_state_v1");
    if (!raw) return;

    let state;
    try {
        state = JSON.parse(raw);
    } catch (e) {
        console.warn("Konnte App-State nicht lesen:", e);
        return;
    }

    // Fahrer
    if (state.drivers) {
        Object.keys(state.drivers).forEach(name => {
            if (driverState[name]) {
                driverState[name] = state.drivers[name];
            }
        });
        renderDrivers();
    }

    // Event‐Planner
if (state.event && state.event.length) {
    for (let i = 1; i <= 8; i++) {
        const row = state.event[i-1];
        if (!row) continue;

        const t  = document.getElementById(`ev-track-${i}`);
        const da = document.getElementById(`ev-driverA-${i}`);
        const ta = document.getElementById(`ev-tyreA-${i}`);
        const db = document.getElementById(`ev-driverB-${i}`);
        const tb = document.getElementById(`ev-tyreB-${i}`);
        const bo = document.getElementById(`ev-boost-${i}`);
        const rb = document.getElementById(`ev-rain-${i}`);

        if (t)  t.value  = row.track  || "";
        if (da) da.value = row.driverA || "";
        if (ta) ta.value = row.tyreA   || "";
        if (db) db.value = row.driverB || "";
        if (tb) tb.value = row.tyreB   || "";
        if (bo) bo.value = row.boost   || "";

        eventRainState[i] = !!row.rain;

        if (rb) {
            rb.classList.toggle("rain-on", !!row.rain);
            rb.classList.toggle("rain-off", !row.rain);
        }
    }
}
updateAllEventAttrsAndLaps();


    // Setups
    if (state.setups && state.setups.length) {
        const setupBoxes = document.querySelectorAll(".setup-box");
        setupBoxes.forEach((box, idx) => {
            const saved = state.setups[idx];
            if (!saved) return;
            const selects = box.querySelectorAll("select");
            selects.forEach((sel, i) => {
                if (saved[i]) sel.value = saved[i];
            });
        });
    }
}


/* ---------------------------------------
   EXPORT PDF (via Browser Print)
----------------------------------------- */
document.getElementById("exportPDF").onclick = () => {
    window.print();
};


/* ---------------------------------------
   DARK MODE TOGGLE
----------------------------------------- */

const toggleDark = document.getElementById("toggleDark");

if (localStorage.getItem("darkmode") === "true") {
    document.body.classList.add("dark");
    toggleDark.innerText = "☀️";
}

toggleDark.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const enabled = document.body.classList.contains("dark");
    toggleDark.innerText = enabled ? "☀️" : "🌙";
    localStorage.setItem("darkmode", enabled);
});


/* ---------------------------------------
   LANGUAGE SWITCHER
----------------------------------------- */

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("ae_lang", lang);

    // Language-Buttons markieren
    document.querySelectorAll(".lang-btn").forEach(btn =>
        btn.classList.remove("active")
    );
    document.querySelector(`.lang-btn[data-lang="${lang}"]`)?.classList.add("active");

    // Tabs neu rendern
    renderDrivers();
    renderEventPlanner();
    renderTrackList();
    renderSetups();

    // Attribute & Laps aktualisieren
    updateAllEventAttrsAndLaps();

    // Nav-Buttons unten übersetzen (optional)
    document.querySelectorAll(".nav-btn").forEach(btn => {
        const key = btn.dataset.tab; // drivers, event, maps, setup
        if (!key) return;
        if (translations[lang][key]) {
            btn.textContent = translations[lang][key];
        }
    });
}

document.getElementById("lang-switcher").addEventListener("click", (e) => {
    const lang = e.target.dataset.lang;
    if (!lang) return;
    applyLanguage(lang);
});





let eventRainState = {};  // Rennen -> true/false

function toggleRain(i) {
    const btn = document.getElementById(`ev-rain-${i}`);
    if (!btn) return;

    const current = !!eventRainState[i];
    const next = !current;
    eventRainState[i] = next;

    if (next) {
        btn.classList.remove("rain-off");
        btn.classList.add("rain-on");
    } else {
        btn.classList.remove("rain-on");
        btn.classList.add("rain-off");
    }
    saveState();
}


document.getElementById("lang-switcher").addEventListener("click", (e) => {
    const lang = e.target.dataset.lang;
    if (!lang) return;
    applyLanguage(lang);
});

/* ---------------------------------------
   EVENT CHANGE LISTENER (TRACK ATTRIBUTES)
----------------------------------------- */

const eventContainer = document.getElementById("event-container");

if (eventContainer) {
    eventContainer.addEventListener("change", (e) => {
        if (e.target && e.target.id && e.target.id.startsWith("ev-track-")) {
            const idx = parseInt(e.target.id.replace("ev-track-",""), 10);
            if (!isNaN(idx)) updateEventAttrsRow(idx);
        }
        saveState();
    });
}

/* ---------------------------------------
   INIT – Alles einmal beim Laden ausführen
----------------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
    renderDrivers();
    renderTrackList();
    renderEventPlanner();
    renderSetups();
    loadState();
    applyLanguage(currentLang);
});
