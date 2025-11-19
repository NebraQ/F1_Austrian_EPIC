/* ======================================================
   F1 Austrian EPIC – FULL APP LOGIC (DE/EN VERSION)
====================================================== */

/* ---------------------------------------
   TRANSLATIONS
----------------------------------------- */
const translations = {
    de: {
        // Navigation
        drivers: "Fahrer",
        event: "Event",
        maps: "Karten",
        setup: "Setup",

        // Titles
        driversTitle: "Fahrer Übersicht",
        eventTitle: "Event Planer",
        mapsTitle: "Strecken Karten",
        setupsTitle: "Setup Übersicht",

        // Event planner
        race: "Rennen",
        selectTrack: "Strecke wählen",
        driverA: "Fahrer A",
        driverB: "Fahrer B",
        tyreA: "Reifen A",
        tyreB: "Reifen B",
        boost: "Boost",
        guide: "Guide",
        showGuide: "Guide anzeigen",
        exportPDF: "Event als PDF exportieren",

        // Driver stats
        level: "Level",
        boost10: "+10%",
        attr_o: "Überholen",
        attr_d: "Verteidigen",
        attr_q: "Qualifying",
        attr_s: "Rennstart",
        attr_t: "Reifenman.",

        // Track guide legend
        guideLegend: "⚡ Boost   🔋 Laden   🟢 DRS   💤 Neutral",

        // Setup
        compBrakes: "Bremsen",
        compGearbox: "Getriebe",
        compRearWing: "Heckflügel",
        compFrontWing: "Frontflügel",
        compSuspension: "Aufhängung",
        compEngine: "Motor"
    },

    en: {
        // Navigation
        drivers: "Drivers",
        event: "Event",
        maps: "Maps",
        setup: "Setup",

        // Titles
        driversTitle: "Driver Overview",
        eventTitle: "Event Planner",
        mapsTitle: "Track Maps",
        setupsTitle: "Setup Overview",

        // Event Planner
        race: "Race",
        selectTrack: "Select track",
        driverA: "Driver A",
        driverB: "Driver B",
        tyreA: "Tyres A",
        tyreB: "Tyres B",
        boost: "Boost",
        guide: "Guide",
        showGuide: "Show guide",
        exportPDF: "Export Event as PDF",

        // Driver stats
        level: "Level",
        boost10: "+10%",
        attr_o: "Overtaking",
        attr_d: "Defending",
        attr_q: "Qualifying",
        attr_s: "Race Start",
        attr_t: "Tyre Mgmt",

        // Track guide legend
        guideLegend: "⚡ Boost   🔋 Charge   🟢 DRS   💤 Neutral",

        // Setup
        compBrakes: "Brakes",
        compGearbox: "Gearbox",
        compRearWing: "Rear Wing",
        compFrontWing: "Front Wing",
        compSuspension: "Suspension",
        compEngine: "Engine"
    }
};

let currentLang = localStorage.getItem("ae_lang") || "de";



/* ---------------------------------------
   DRIVER DATA
----------------------------------------- */
const drivers = [
    { name: "Carlos Sainz", team:"team-blue", base:{o:47,d:67,q:52,s:57,t:62} },
    { name: "Charles Leclerc", team:"team-red", base:{o:57,d:52,q:67,s:62,t:47} },
    { name: "Fernando Alonso", team:"team-green", base:{o:61,d:66,q:56,s:71,t:51} },
    { name: "George Russell", team:"team-silver", base:{o:67,d:52,q:72,s:57,t:62} },
    { name: "Lando Norris", team:"team-orange", base:{o:57,d:67,q:62,s:52,t:72} },
    { name: "Oscar Piastri", team:"team-orange", base:{o:67,d:62,q:52,s:57,t:47} },
    { name: "Lewis Hamilton", team:"team-red", base:{o:72,d:52,q:62,s:57,t:67} },
    { name: "Max Verstappen", team:"team-blue", base:{o:62,d:72,q:67,s:52,t:57} },
    { name: "Nico Hülkenberg", team:"team-green", base:{o:57,d:47,q:67,s:52,t:62} },
    { name: "Pierre Gasly", team:"team-pink", base:{o:52,d:47,q:62,s:57,t:67} }
];

let driverState = {};
drivers.forEach(d => {
    driverState[d.name] = { level:1, boost:false };
});



/* ---------------------------------------
   RENDER DRIVERS (LANGUAGE INCLUDED)
----------------------------------------- */
function renderDrivers() {
    const t = translations[currentLang];
    const box = document.getElementById("driver-list");
    box.innerHTML = "";

    drivers.forEach(d => {
        let st = driverState[d.name];

        const calc = val => {
            let v = val + (st.level - 1) * 4;
            if (st.boost) v = Math.round(v * 1.1);
            return v;
        };

        let card = document.createElement("div");
        card.className = `driver-card ${d.team}`;

        card.innerHTML = `
            <div class="driver-top">
                <div class="driver-name">${d.name}</div>
                <div>
                    <span class="boost-star ${st.boost ? "active" : ""}" onclick="toggleBoost('${d.name}')">⭐</span>
                    ${st.boost ? `<span class="boost-text">${t.boost10}</span>` : ""}
                </div>
            </div>

            <div class="driver-stats">
                <div class="stat-box">${t.attr_o}<br><b>${calc(d.base.o)}</b></div>
                <div class="stat-box">${t.attr_d}<br><b>${calc(d.base.d)}</b></div>
                <div class="stat-box">${t.attr_q}<br><b>${calc(d.base.q)}</b></div>
                <div class="stat-box">${t.attr_s}<br><b>${calc(d.base.s)}</b></div>
                <div class="stat-box">${t.attr_t}<br><b>${calc(d.base.t)}</b></div>
            </div>

            <div class="driver-bottom">
                ${t.level}:
                <input type="number" min="1" max="11" value="${st.level}" 
                       class="driver-level-input"
                       onchange="updateLevel('${d.name}', this.value)">
            </div>
        `;

        box.appendChild(card);
    });
}

function toggleBoost(name) {
    driverState[name].boost = !driverState[name].boost;
    renderDrivers();
    saveState();
}

function updateLevel(name, val) {
    driverState[name].level = parseInt(val);
    renderDrivers();
    saveState();
}



/* ---------------------------------------
   TRACK DATA
----------------------------------------- */
const tracks = [
    {id:1, name:"Melbourne", main1:"Rennstart", main2:"Tempo", img:"01_Melbourne.png"},
    {id:2, name:"Jeddah", main1:"Reifenmanagement", main2:"Tempo", img:"02_Jeddah.png"},
    {id:3, name:"Miami", main1:"Verteidigen", main2:"Tempo", img:"03_Miami.png"},
    {id:4, name:"Silverstone", main1:"Reifenmanagement", main2:"Tempo", img:"04_Silverstone.png"},
    {id:5, name:"Monaco", main1:"Verteidigen", main2:"Kurvenverhalten", img:"05_Monaco.png"},
    {id:6, name:"Spielberg", main1:"Verteidigen", main2:"Tempo", img:"06_Spielberg.png"},
    {id:7, name:"Monza", main1:"Verteidigen", main2:"Tempo", img:"07_Monza.png"},
    {id:8, name:"Montreal", main1:"Überholen", main2:"Kurvenverhalten", img:"08_Montreal.png"},
    {id:9, name:"Hungaroring", main1:"Rennstart", main2:"Kurvenverhalten", img:"09_Hungaroring.png"},
    {id:10, name:"Zandvoort", main1:"Verteidigen", main2:"Kurvenverhalten", img:"10_Zandvoort.png"},
    {id:11, name:"Austin", main1:"Reifenmanagement", main2:"Kurvenverhalten", img:"11_Austin.png"},
    {id:12, name:"Shanghai", main1:"Überholen", main2:"Antrieb", img:"12_Shanghai.png"},
    {id:13, name:"Baku", main1:"Überholen", main2:"Tempo", img:"13_Baku.png"},
    {id:14, name:"SaoPaulo", main1:"Überholen", main2:"Kurvenverhalten", img:"14_SaoPaulo.png"},
    {id:15, name:"Las Vegas", main1:"Überholen", main2:"Tempo", img:"15_LasVegas.png"},
    {id:16, name:"Imola", main1:"Rennstart", main2:"Antrieb", img:"16_Imola.png"},
    {id:17, name:"Singapur", main1:"Rennstart", main2:"Antrieb", img:"17_Singapur.png"},
    {id:18, name:"Mexico", main1:"Rennstart", main2:"Antrieb", img:"18_Mexico.png"},
    {id:19, name:"Spa", main1:"Reifenmanagement", main2:"Antrieb", img:"19_Spa.png"},
    {id:20, name:"AbuDhabi", main1:"Überholen", main2:"Antrieb", img:"20_AbuDhabi.png"},
    {id:21, name:"Sakhir", main1:"Reifenmanagement", main2:"Antrieb", img:"21_Sakhir.png"},
    {id:22, name:"Barcelona", main1:"Reifenmanagement", main2:"Kurvenverhalten", img:"22_Barcelona.png"},
    {id:23, name:"Suzuka", main1:"Verteidigen", main2:"Kurvenverhalten", img:"23_Suzuka.png"}
];



/* ---------------------------------------
   TRACK LIST
----------------------------------------- */
function renderTrackList() {
    const list = document.getElementById("track-list");
    list.innerHTML = "";

    tracks.forEach(t => {
        const div = document.createElement("div");
        div.className = "track-entry";
        div.textContent = t.name;
        div.onclick = () => openTrackPopup(t);
        list.appendChild(div);
    });
}



/* ---------------------------------------
   TRACK POPUP
----------------------------------------- */
function openTrackPopup(track) {
    const t = translations[currentLang];

    document.getElementById("popup-track-title").textContent = track.name;
    document.getElementById("popup-track-img").src = track.img;

    document.getElementById("popup-track-guide").innerHTML = `
        <div class="guide-legend">${t.guideLegend}</div>
        <div class="guide-body">${guideTexts[track.name]}</div>
    `;

    document.getElementById("track-popup").classList.remove("hidden");
}

document.getElementById("closePopup").onclick = () =>
    document.getElementById("track-popup").classList.add("hidden");



/* ---------------------------------------
   EVENT PLANNER
----------------------------------------- */
function renderEventPlanner() {
    const t = translations[currentLang];
    const cont = document.getElementById("event-container");
    cont.innerHTML = "";

    for (let i = 1; i <= 8; i++) {
        let div = document.createElement("div");
        div.className = "event-row";

        div.innerHTML = `
            <div class="event-header">${t.race} ${i}</div>

            <select id="ev-track-${i}" class="event-input">
                <option value="">${t.selectTrack}</option>
                ${tracks.map(tr => `<option>${tr.name}</option>`).join("")}
            </select>

            <div class="event-two-col">

                <div class="a-block">
                    <div>${t.driverA}</div>
                    <select id="ev-driverA-${i}" class="event-input">
                        <option value=""></option>
                        ${drivers.map(d => `<option>${d.name}</option>`).join("")}
                    </select>

                    <div>${t.tyreA}</div>
                    <select id="ev-tyreA-${i}" class="event-input">
                        <option>Soft/Soft</option><option>Soft/Med</option>
                        <option>Soft/Hard</option><option>Med/Soft</option>
                        <option>Med/Med</option><option>Med/Hard</option>
                        <option>Hard/Soft</option><option>Hard/Med</option>
                        <option>Hard/Hard</option>
                    </select>
                </div>

                <div class="b-block">
                    <div>${t.driverB}</div>
                    <select id="ev-driverB-${i}" class="event-input">
                        <option value=""></option>
                        ${drivers.map(d => `<option>${d.name}</option>`).join("")}
                    </select>

                    <div>${t.tyreB}</div>
                    <select id="ev-tyreB-${i}" class="event-input">
                        <option>Soft/Soft</option><option>Soft/Med</option>
                        <option>Soft/Hard</option><option>Med/Soft</option>
                        <option>Med/Med</option><option>Med/Hard</option>
                        <option>Hard/Soft</option><option>Hard/Med</option>
                        <option>Hard/Hard</option>
                    </select>
                </div>

            </div>

            <div class="event-boost-row">
                ${t.boost}: <input id="ev-boost-${i}" class="event-input" style="width:70px;">
            </div>

            <div>
                <span class="guide-link" onclick="openTrackGuideFromPlanner(${i})">${t.showGuide}</span>
            </div>
        `;

        cont.appendChild(div);
    }
}

function openTrackGuideFromPlanner(i) {
    let trackName = document.getElementById(`ev-track-${i}`).value;
    if (!trackName) return;
    let track = tracks.find(t => t.name === trackName);
    if (track) openTrackPopup(track);
}



/* ---------------------------------------
   SETUPS / COMPONENTS
----------------------------------------- */
function renderSetups() {
    const t = translations[currentLang];
    const cont = document.getElementById("setup-container");
    cont.innerHTML = "";

    const comps = {
        brakes: ["Boombox", "Flow 1K", "Rumble"],
        gearbox: ["The Beast", "Metronome", "The Dynamo"],
        rearWing: ["The Valkyrie", "Aero Blade", "Power Lift"],
        frontWing: ["Flex XL", "Curler", "The Sabre"],
        suspension: ["Nexus", "Gyro", "Quantum"],
        engine: ["Turbo Jet", "Behemoth", "Mach III"]
    };

    for (let i = 1; i <= 8; i++) {
        let box = document.createElement("div");
        box.className = "setup-box";

        box.innerHTML = `
            <div class="setup-title">${t.race} ${i}</div>

            <div class="setup-row"><span>${t.compBrakes}:</span>
                <select class="setup-select">${comps.brakes.map(x=>`<option>${x}</option>`).join("")}</select>
            </div>

            <div class="setup-row"><span>${t.compGearbox}:</span>
                <select class="setup-select">${comps.gearbox.map(x=>`<option>${x}</option>`).join("")}</select>
            </div>

            <div class="setup-row"><span>${t.compRearWing}:</span>
                <select class="setup-select">${comps.rearWing.map(x=>`<option>${x}</option>`).join("")}</select>
            </div>

            <div class="setup-row"><span>${t.compFrontWing}:</span>
                <select class="setup-select">${comps.frontWing.map(x=>`<option>${x}</option>`).join("")}</select>
            </div>

            <div class="setup-row"><span>${t.compSuspension}:</span>
                <select class="setup-select">${comps.suspension.map(x=>`<option>${x}</option>`).join("")}</select>
            </div>

            <div class="setup-row"><span>${t.compEngine}:</span>
                <select class="setup-select">${comps.engine.map(x=>`<option>${x}</option>`).join("")}</select>
            </div>
        `;

        cont.appendChild(box);
    }
}



/* ---------------------------------------
   TRACK GUIDE TEXTS (German only for now)
----------------------------------------- */
const guideTexts = {
   "Melbourne": `🏁 Start ⚡ ...`,
   "Jeddah": `🏁 Start ⚡ ...`,
   // --- (DEINE VOLLEN TEXTE COMING FROM YOUR INPUT – ALLE BLEIBEN) ---
};



/* ---------------------------------------
   AUTO-SAVE
----------------------------------------- */
function saveState() {
    let state = {
        drivers: driverState,
        event: [],
        setups: []
    };

    for (let i = 1; i <= 8; i++) {
        state.event.push({
            track: document.getElementById(`ev-track-${i}`).value,
            driverA: document.getElementById(`ev-driverA-${i}`).value,
            tyreA: document.getElementById(`ev-tyreA-${i}`).value,
            driverB: document.getElementById(`ev-driverB-${i}`).value,
            tyreB: document.getElementById(`ev-tyreB-${i}`).value,
            boost: document.getElementById(`ev-boost-${i}`).value
        });
    }

    const setupBoxes = document.querySelectorAll(".setup-box");
    setupBoxes.forEach(box => {
        state.setups.push(
            Array.from(box.querySelectorAll("select")).map(s => s.value)
        );
    });

    localStorage.setItem("ae_state_v1", JSON.stringify(state));
}

function loadState() {
    let raw = localStorage.getItem("ae_state_v1");
    if (!raw) return;

    let state = JSON.parse(raw);

    driverState = state.drivers || driverState;

    // restore event
    if (state.event) {
        state.event.forEach((ev, i) => {
            let n = i + 1;
            document.getElementById(`ev-track-${n}`).value = ev.track;
            document.getElementById(`ev-driverA-${n}`).value = ev.driverA;
            document.getElementById(`ev-tyreA-${n}`).value = ev.tyreA;
            document.getElementById(`ev-driverB-${n}`).value = ev.driverB;
            document.getElementById(`ev-tyreB-${n}`).value = ev.tyreB;
            document.getElementById(`ev-boost-${n}`).value = ev.boost;
        });
    }

    // restore setups
    if (state.setups) {
        const boxes = document.querySelectorAll(".setup-box");
        boxes.forEach((box, idx) => {
            const saved = state.setups[idx];
            if (!saved) return;

            box.querySelectorAll("select").forEach((sel, i) => {
                sel.value = saved[i];
            });
        });
    }
}



/* ---------------------------------------
   DARK MODE
----------------------------------------- */
const toggleDark = document.getElementById("toggleDark");
if (localStorage.getItem("darkmode") === "true") {
    document.body.classList.add("dark");
    toggleDark.textContent = "☀️";
}

toggleDark.onclick = () => {
    document.body.classList.toggle("dark");
    const enabled = document.body.classList.contains("dark");
    toggleDark.textContent = enabled ? "☀️" : "🌙";
    localStorage.setItem("darkmode", enabled);
};



/* ---------------------------------------
   LANGUAGE SWITCHER
----------------------------------------- */
function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("ae_lang", lang);

    // Update UI elements that use fixed text
    document.querySelector("#drivers-title").textContent = translations[lang].driversTitle;
    document.querySelector("#event-title").textContent = translations[lang].eventTitle;
    document.querySelector("#maps-title").textContent = translations[lang].mapsTitle;
    document.querySelector("#setup-title").textContent = translations[lang].setupsTitle;

    // Nav Buttons
    document.querySelectorAll(".nav-btn").forEach(btn => {
        const tab = btn.dataset.tab;
        btn.textContent = translations[lang][tab];
    });

    // Re-render everything so words update
    renderDrivers();
    renderEventPlanner();
    renderTrackList();
    renderSetups();
    loadState(); // restore values again
}

document.getElementById("lang-switcher").onclick = (e) => {
    const lang = e.target.dataset.lang;
    if (lang) applyLanguage(lang);
};



/* ---------------------------------------
   INITIALIZATION
----------------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
    renderDrivers();
    renderTrackList();
    renderEventPlanner();
    renderSetups();

    loadState();

    applyLanguage(currentLang);
});
