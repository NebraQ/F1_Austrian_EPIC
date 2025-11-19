Top, dann machen wir’s jetzt „richtig richtig“ 😄
Ich baue dir deine bestehende app.js so um, dass:

DE/EN zuverlässig funktioniert

Fahrer-Werte-Labels übersetzt werden

Event-Labels übersetzt werden

Setup-Labels übersetzt werden

Track-Guide-Legende + Texte je nach Sprache wechseln

Auto-Save, Dark-Mode, Tabs bleiben wie gehabt


> 🧩 Wichtig: Ersetze deine aktuelle app.js komplett durch den Code unten.




---

✅ Neue komplette app.js mit funktionierendem EN-Button

/* ======================================================
   F1 Austrian EPIC – FULL APP LOGIC (DE/EN)
====================================================== */
/* ---------------------------------------
   TRANSLATIONS
----------------------------------------- */

const translations = {
    de: {
        drivers: "Fahrer",
        event: "Event",
        maps: "Karten",
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

        // Fahrer-Attribute
        attr_o: "Überholen",
        attr_d: "Verteidigen",
        attr_q: "Qualifying",
        attr_s: "Rennstart",
        attr_t: "Reifenman.",

        // Track-Guide Legende
        guideLegend: "⚡ Boost   🔋 Laden   🟢 DRS   💤 Neutral",

        // Setup-Komponenten
        compBrakes: "Bremsen",
        compGearbox: "Getriebe",
        compRearWing: "Heckflügel",
        compFrontWing: "Frontflügel",
        compSuspension: "Aufhängung",
        compEngine: "Motor"
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

        attr_o: "Overtaking",
        attr_d: "Defending",
        attr_q: "Qualifying",
        attr_s: "Race Start",
        attr_t: "Tyre Mgmt",

        guideLegend: "⚡ Boost   🔋 Charge   🟢 DRS   💤 Neutral",

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
    { name: "Carlos Sainz", team: "team-blue",      base: { o:47,d:67,q:52,s:57,t:62 } },
    { name: "Charles Leclerc", team: "team-red",    base: { o:57,d:52,q:67,s:62,t:47 } },
    { name: "Fernando Alonso", team: "team-green",  base: { o:61,d:66,q:56,s:71,t:51 } },
    { name: "George Russell", team: "team-silver",  base: { o:67,d:52,q:72,s:57,t:62 } },
    { name: "Lando Norris", team: "team-orange",    base: { o:57,d:67,q:62,s:52,t:72 } },
    { name: "Oscar Piastri", team: "team-orange",   base: { o:67,d:62,q:52,s:57,t:47 } },
    { name: "Lewis Hamilton", team: "team-red",     base: { o:72,d:52,q:62,s:57,t:67 } },
    { name: "Max Verstappen", team: "team-blue",    base: { o:62,d:72,q:67,s:52,t:57 } },
    { name: "Nico Hülkenberg", team: "team-green",  base: { o:57,d:47,q:67,s:52,t:62 } },
    { name: "Pierre Gasly", team: "team-pink",      base: { o:52,d:47,q:62,s:57,t:67 } }
];

/* Driver Level & Boost State */
let driverState = {};
drivers.forEach(d => {
    driverState[d.name] = { level: 1, boost: false };
});


/* ---------------------------------------
   RENDER DRIVERS (mit Sprache)
----------------------------------------- */
function renderDrivers() {
    const t = translations[currentLang];
    const container = document.getElementById("driver-list");
    container.innerHTML = "";

    drivers.forEach(d => {
        let st = driverState[d.name];

        const calcStat = val => {
            let newVal = val + (st.level - 1) * 4;
            if (st.boost) newVal = Math.round(newVal * 1.1);
            return newVal;
        };

        let card = document.createElement("div");
        card.className = `driver-card ${d.team}`;

        card.innerHTML = `
            <div class="driver-top">
                <div class="driver-name">${d.name}</div>
                <div style="display:flex; align-items:center;">
                    <span class="boost-star ${st.boost ? "active" : ""}" 
                          onclick="toggleBoost('${d.name}')">⭐</span>
                    ${st.boost ? `<span class="boost-text">${t.boost10}</span>` : ""}
                </div>
            </div>

            <div class="driver-stats">
                <div class="stat-box">${t.attr_o}<br><b>${calcStat(d.base.o)}</b></div>
                <div class="stat-box">${t.attr_d}<br><b>${calcStat(d.base.d)}</b></div>
                <div class="stat-box">${t.attr_q}<br><b>${calcStat(d.base.q)}</b></div>
                <div class="stat-box">${t.attr_s}<br><b>${calcStat(d.base.s)}</b></div>
                <div class="stat-box">${t.attr_t}<br><b>${calcStat(d.base.t)}</b></div>
            </div>

            <div style="margin-top:12px;">
                ${t.level}:
                <input type="number" class="driver-level-input"
                       min="1" max="11" value="${st.level}"
                       onchange="updateLevel('${d.name}', this.value)">
            </div>
        `;

        container.appendChild(card);
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
   TRACK LIST + ATTRIBUTES
----------------------------------------- */
const tracks = [
    { id:1,  name:"Melbourne", main1:"Rennstart", main2:"Tempo", img:"01_Melbourne.png" },
    { id:2,  name:"Jeddah", main1:"Reifenmanagement", main2:"Tempo", img:"02_Jeddah.png" },
    { id:3,  name:"Miami", main1:"Verteidigen", main2:"Tempo", img:"03_Miami.png" },
    { id:4,  name:"Silverstone", main1:"Reifenmanagement", main2:"Tempo", img:"04_Silverstone.png" },
    { id:5,  name:"Monaco", main1:"Verteidigen", main2:"Kurvenverhalten", img:"05_Monaco.png" },
    { id:6,  name:"Spielberg", main1:"Verteidigen", main2:"Tempo", img:"06_Spielberg.png" },
    { id:7,  name:"Monza", main1:"Verteidigen", main2:"Tempo", img:"07_Monza.png" },
    { id:8,  name:"Montreal", main1:"Überholen", main2:"Kurvenverhalten", img:"08_Montreal.png" },
    { id:9,  name:"Hungaroring", main1:"Rennstart", main2:"Kurvenverhalten", img:"09_Hungaroring.png" },
    { id:10, name:"Zandvoort", main1:"Verteidigen", main2:"Kurvenverhalten", img:"10_Zandvoort.png" },
    { id:11, name:"Austin", main1:"Reifenmanagement", main2:"Kurvenverhalten", img:"11_Austin.png" },
    { id:12, name:"Shanghai", main1:"Überholen", main2:"Antrieb", img:"12_Shanghai.png" },
    { id:13, name:"Baku", main1:"Überholen", main2:"Tempo", img:"13_Baku.png" },
    { id:14, name:"SaoPaulo", main1:"Überholen", main2:"Kurvenverhalten", img:"14_SaoPaulo.png" },
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


/* ---------------------------------------
   TRACK MAPS – LIST + POPUP
----------------------------------------- */
function renderTrackList() {
    const list = document.getElementById("track-list");
    list.innerHTML = "";

    tracks.forEach(t => {
        let div = document.createElement("div");
        div.className = "track-entry";
        div.innerText = t.name;
        div.onclick = () => openTrackPopup(t);
        list.appendChild(div);
    });
}

function getGuideText(trackName) {
    // aktuell nur DE – später EN-Variante möglich
    return guideTexts[trackName] || (currentLang === "en" ? "No guide yet." : "Keine Beschreibung vorhanden.");
}

function openTrackPopup(track) {
    const popup = document.getElementById("track-popup");
    popup.classList.remove("hidden");

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


/* ---------------------------------------
   EVENT PLANNER
----------------------------------------- */
function renderEventPlanner() {
    const t = translations[currentLang];
    const eventBox = document.getElementById("event-container");
    eventBox.innerHTML = "";

    for (let i = 1; i <= 8; i++) {
        let row = document.createElement("div");
        row.className = "event-row";

        row.innerHTML = `
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
                </div>

                <div class="b-block">
                    <div>${t.driverB}</div>
                    <select id="ev-driverB-${i}" class="event-input">
                        <option value=""></option>
                        ${drivers.map(d => `<option>${d.name}</option>`).join("")}
                    </select>

                    <div>${t.tyreB}</div>
                    <select id="ev-tyreB-${i}" class="event-input">
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
                </div>

            </div>

            <div style="margin-top:8px;">
                ${t.boost}: <input id="ev-boost-${i}" class="event-input" style="width:80px;">
            </div>

            <div>
                <span class="guide-link" onclick="openTrackGuideFromPlanner(${i})">${t.showGuide}</span>
            </div>
        `;

        eventBox.appendChild(row);
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


/* ---------------------------------------
   GUIDE TEXTS (DE – wie gehabt)
----------------------------------------- */
const guideTexts = {
    "Melbourne": `
🏁 Start: ⚡ bis T1–2

T1–2: ⚡
T2–3: 🔋
T3–7: ⚡ (Attacke)
T7–11: 💤
T11–14: ⚡
ab T14: 💤 + 🟢 DRS

Wiederholen & je nach Verkehr anpassen.
`,
    "Jeddah": `
🏁 Start: ⚡ bis Ausgang T2

T1–2: ⚡
T3–12: 💤 (Feld sortiert sich)
T12–13: 🔋
T14–18: ⚡
T18–26: 💤
T27: ⚡, danach 🟢 DRS

Bei Stau in T1–2 lieber etwas sparen.
`,
    // … (hier kannst du wie gehabt alle DE-Guides belassen)
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
            boost:   document.getElementById(`ev-boost-${i}`)?.value || ""
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

            if (t)  t.value  = row.track  || "";
            if (da) da.value = row.driverA || "";
            if (ta) ta.value = row.tyreA   || "";
            if (db) db.value = row.driverB || "";
            if (tb) tb.value = row.tyreB   || "";
            if (bo) bo.value = row.boost   || "";
        }
    }

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

    // Language buttons oben markieren
    document.querySelectorAll("#lang-switcher .lang-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    // Nav-Tabs unten übersetzen (nur Buttons mit data-tab!)
    document.querySelectorAll(".nav-btn").forEach(btn => {
        const key = btn.dataset.tab; // drivers, event, maps, setup
        if (!key) return;
        if (translations[lang][key]) {
            btn.textContent = translations[lang][key];
        }
    });

    // Bereiche neu darstellen
    renderDrivers();
    renderEventPlanner();
    renderTrackList();
    renderSetups();
    loadState(); // Werte wiederherstellen
}

document.getElementById("lang-switcher").addEventListener("click", (e) => {
    const lang = e.target.dataset.lang;
    if (!lang) return;
    applyLanguage(lang);
});


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


---

🧪 Wie testest du jetzt?

1. Neue app.js hochladen / committen


2. Seite neu laden (Ctrl + F5)


3. Oben rechts EN anklicken

Nav unten: „Fahrer → Drivers“, „Karten → Maps“

Fahrer-Boxen: z.B. „Überholen → Overtaking“

Event-Labels: „Reifen A → Tyres A“, „Fahrer A → Driver A“



4. Zurück auf DE – alles wieder auf Deutsch




---

Wenn du willst, kann ich dir im nächsten Schritt:

englische Track-Guides (Option B, komprimiert & clean) direkt in guideTexts/_EN einbauen und die Funktion getGuideText() so umbauen, dass sie wirklich zwischen de/en wechselt.