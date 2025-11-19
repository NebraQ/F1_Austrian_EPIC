/* ======================================================
   F1 Austrian EPIC – FULL APP LOGIC (DE/EN)
====================================================== */
/* ---------------------------------------
   TRANSLATIONS
----------------------------------------- */
function translateAttrLabel(attr) {
    const map = {
        de: {
            "Rennstart": "Rennstart",
            "Tempo": "Tempo",
            "Verteidigen": "Verteidigen",
            "Überholen": "Überholen",
            "Reifenmanagement": "Reifenman.",
            "Kurvenverhalten": "Kurvenverhalten",
            "Antrieb": "Antrieb"
        },
        en: {
            "Rennstart": "Race Start",
            "Tempo": "Pace",
            "Verteidigen": "Defending",
            "Überholen": "Overtaking",
            "Reifenmanagement": "Tyre Mgmt",
            "Kurvenverhalten": "Cornering",
            "Antrieb": "Engine Power"
        }
    };
    return map[currentLang]?.[attr] || attr;
}

function formatTrackAttrs(track) {
    const a1 = translateAttrLabel(track.main1);
    const a2 = translateAttrLabel(track.main2);
    return `${a1} | ${a2}`;
}

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
        lapsLabel: "Laps",

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
    { id:1,  name:"Melbourne",  main1:"Rennstart",        main2:"Tempo",           img:"01_Melbourne.png",  laps: 9 },
    { id:2,  name:"Jeddah",     main1:"Reifenmanagement", main2:"Tempo",           img:"02_Jeddah.png",     laps: 8 },
    { id:3,  name:"Miami",      main1:"Verteidigen",      main2:"Tempo",           img:"03_Miami.png",      laps: 6 },
    { id:4,  name:"Silverstone",main1:"Reifenmanagement", main2:"Tempo",           img:"04_Silverstone.png",laps: 8 },
    { id:5,  name:"Monaco",     main1:"Verteidigen",      main2:"Kurvenverhalten", img:"05_Monaco.png",     laps: 7 },
    { id:6,  name:"Spielberg",  main1:"Verteidigen",      main2:"Tempo",           img:"06_Spielberg.png",  laps: 10 },
    { id:7,  name:"Monza",      main1:"Verteidigen",      main2:"Tempo",           img:"07_Monza.png",      laps: 9 },
    { id:8,  name:"Montreal",   main1:"Überholen",        main2:"Kurvenverhalten", img:"08_Montreal.png",   laps: 8 },
    { id:9,  name:"Hungaroring",main1:"Rennstart",        main2:"Kurvenverhalten", img:"09_Hungaroring.png",laps: 9 },
    { id:10, name:"Zandvoort",  main1:"Verteidigen",      main2:"Kurvenverhalten", img:"10_Zandvoort.png",  laps: 8 },
    { id:11, name:"Austin",     main1:"Reifenmanagement", main2:"Kurvenverhalten", img:"11_Austin.png",     laps: 6 },
    { id:12, name:"Shanghai",   main1:"Überholen",        main2:"Antrieb",         img:"12_Shanghai.png",   laps: 7 },
    { id:13, name:"Baku",       main1:"Überholen",        main2:"Tempo",           img:"13_Baku.png",       laps: 7 },
    { id:14, name:"SaoPaulo",   main1:"Überholen",        main2:"Kurvenverhalten", img:"14_SaoPaulo.png",   laps: 9 },
    { id:15, name:"Las Vegas",  main1:"Überholen",        main2:"Tempo",           img:"15_LasVegas.png",   laps: 6 },
    { id:16, name:"Imola",      main1:"Rennstart",        main2:"Antrieb",         img:"16_Imola.png",      laps: 9 },
    { id:17, name:"Singapur",   main1:"Rennstart",        main2:"Antrieb",         img:"17_Singapur.png",   laps: 6 },
    { id:18, name:"Mexico",     main1:"Rennstart",        main2:"Antrieb",         img:"18_Mexico.png",     laps: 9 },
    { id:19, name:"Spa",        main1:"Reifenmanagement", main2:"Antrieb",         img:"19_Spa.png",        laps: 6 },
    { id:20, name:"AbuDhabi",   main1:"Überholen",        main2:"Antrieb",         img:"20_AbuDhabi.png",   laps: 8 },
    { id:21, name:"Sakhir",     main1:"Reifenmanagement", main2:"Antrieb",         img:"21_Sakhir.png",     laps: 8 },
    { id:22, name:"Barcelona",  main1:"Reifenmanagement", main2:"Kurvenverhalten", img:"22_Barcelona.png",  laps: 10 },
    { id:23, name:"Suzuka",     main1:"Verteidigen",      main2:"Kurvenverhalten", img:"23_Suzuka.png",     laps: 7 }
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
    // aktuell nur DE – später EN-Variante möglich
    return guideTexts[trackName] || (currentLang === "en" ? "No guide yet." : "Keine Beschreibung vorhanden.");
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
       <div class="event-attrs" id="ev-attrs-${i}"></div>

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
                        <option>Wets/Wets</option>
                        <option>Soft/Soft/Soft</option>
                        <option>Soft/Soft/Med</option>
                        <option>Soft/Med/Soft</option>
                        <option>Med/Soft/Soft</option>
                        <option>Hard/Soft/Soft</option>
                        <option>Soft/Hard/Soft</option>
                        <option>Soft/Soft/Hard</option>
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
                        <option>Wets/Wets</option>
                        <option>Soft/Soft/Soft</option>
                        <option>Soft/Soft/Med</option>
                        <option>Soft/Med/Soft</option>
                        <option>Med/Soft/Soft</option>
                        <option>Hard/Soft/Soft</option>
                        <option>Soft/Hard/Soft</option>
                        <option>Soft/Soft/Hard</option>
                    </select>
                </div>

            </div>

            <div style="margin-top:8px;">
                ${t.boost}: <input id="ev-boost-${i}" class="event-input" style="width:140px;">
            </div>

            <div>
                <span class="guide-link" onclick="openTrackGuideFromPlanner(${i})">${t.showGuide}</span>
            </div>
        `;

        eventBox.appendChild(row);
    }
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



    // ...
    eventBox.appendChild(row);{
}
updateAllEventAttrs();


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
    "Miami": `
🏁 Start: ⚡ bis T1–2

T1–2: ⚡
T3–6: 💤
T7–8: ⚡
T8–11: 💤
T11–16: ⚡ (wichtige Push-Zone)
lange Gerade: 🟢 + 💤
T17–18: ⚡
T19–1: 🔋

Runde 1: lange Gerade unbedingt nutzen zum 🔋.
`,

    "Silverstone": `
🏁 Start: je nach Position kurz ⚡, sonst 💤

T1–2: 💤
T3–5: ⚡
T5–6: 🟢 + 💤
T6–7: ⚡
T8–14: 💤 (flüssig)
T14–15: situativ 🔋 oder 💤
T15–18: ⚡
Start/Ziel: 🔋

Wichtig: DRS-Zonen je nach Verkehr geschickt einsetzen.
`,

    "Monaco": `
🏁 Start: bei guter Linie ⚡ bis Ausgang T1

T1: ⚡
T1–4: 💤
T4–8: ⚡
T8–10: 🔋
T10–11: ⚡
T11–18: 💤
T19–1: 💤 + 🟢

Sehr abhängig vom Start + Verkehr in der Haarnadel – immer Situation lesen.
`,

    "Spielberg": `
🏁 Start: ⚡ bis Ausgang T1

Ausgang T1–T3: 💤
T3–4: 🟢 + 💤
T4–6: ⚡ (wichtig für Positionen)
T6–10: 💤
T10–1: 🔋

DRS verschiebt sich – oft stark zwischen T3–4 und T1–3 nutzbar.
`,

    "Monza": `
🏁 Start: Innenbahn ⚡, Außenbahn eher 💤 und nach T2 ⚡

T1–2: wenn frei ⚡, sonst 💤
T3–4: 🔋
T4–7: ⚡
T7–10: 💤
T10–11: 🔋
T11–1: 💤 + 🟢

DRS stark zwischen T7–8 oder T11–1 – je nach Runde und Verkehr.
`,

    "Montreal": `
🏁 Start: Innenbahn 💤, Außenbahn ⚡ (Überraschung bis T3 möglich)

T1–4: ⚡
T4–6: 💤
T6–7: ⚡
T7–10: 💤
T10–11: ⚡
T11–14: 💤 + 🟢
T14–1: 🔋

DRS + Antrieb gut timen, erste DRS-Zone ab Runde 2 vor T11 nutzen.
`,

    "Hungaroring": `
🏁 Start: ⚡ bis T3

T1: ⚡
T1–2: 💤
T2–3: ⚡
T3–4: 🔋
T4–5: 💤
T5–7: ⚡
T7–11: 💤
T11–12: 🔋
T12–14: ⚡
Start/Ziel: 💤 + 🟢

DRS ab Runde 3 gut zwischen T2–4 einplanen.
`,

    "Zandvoort": `
🏁 Start: Innen ⚡, Außen 💤

T1–2: 💤
T2–3: ⚡
T3–7: 🔋
T7–10: ⚡ (sehr stark)
T10–11: 🔋
T11–13: 💤 (bei Chance: voll ⚡)
T13–1: 💤 + 🟢

Zwischen T8–10 immer gut boosten, dort holst du viel raus.
`,

    "Austin": `
🏁 Start: ⚡, hoffen auf gute Linie in T1

T1–10: eher 💤
T10–11: ab Runde 2 🔋
T11–12: 🟢 + 💤
T12–15: ⚡
T15–19: 💤
T19–20: neutral/leicht ⚡
T20–1: 🔋

Runde 1: zwischen T10–11 ruhig einmal ⚡, ab Runde 2 eher 🔋.
`,

    "Shanghai": `
🏁 Start: ⚡ bis ca. T6

T1–4: ⚡
T4–6: 🔋
T6–8: 💤
T8–10: ⚡
T10–11: ab Runde 2 🔋 (Runde 1 eher ⚡)
T11–13: ⚡
T13–14: 💤 + 🟢 (Runde 1 auch 🔋 ok)
T14–16: ⚡
T16–1: 🔋

Runde 1 aggressiv, danach lange Gerade eher zum 🔋 nutzen.
`,

    "Baku": `
🏁 Start: bei gutem Start ⚡, sonst 💤

T1–3: 💤
T3–6: ⚡
T6–12: 💤
T12–14: ab Runde 2 🔋
T14–16: ⚡
T16–1: 💤 + 🟢

Ab Runde 2 kann man auch T1 zum Überholen nutzen, wenn Platz ist.
`,

    "SaoPaulo": `
🏁 Start: bei guter Position ⚡, sonst 💤

T1–2: ⚡
T2–4: 💤 + 🟢
T4–6: 💤
T6–10: ⚡ (Haupt-Push-Zone)
T10–13: 💤
T13–1: 🔋

Boost ab Runde 2 intensiver nutzen, wenn das Feld auseinander ist.
`,

    "Las Vegas": `
🏁 Start: ⚡

T1–3: ⚡
T3–5: 🔋 + ggf. 🟢
T5–7: 💤
T7–9: ⚡
T9–12: 💤
T12–13: ⚡
T13–14: 🔋 + 🟢
T14–16: ⚡
T16–1: 💤 + 🟢

Wichtig: ab Runde 2 DRS zwischen T3–5 nutzen und kurz vor Runde-Ende nochmal.
`,

    "Imola": `
🏁 Start: groß ⚡, durch T2 nicht auffahren

T1–2: 💤
T2–6: ⚡
T6–7: ab Runde 2 🔋
T7–9: kurz ⚡, dann 🔋
T9–13: 💤
T13–15: ⚡
T15–17: ab Runde 2 🔋
T17–18: ⚡
Start/Ziel: 💤 + 🟢

Runde 1: deutlich aggressiver boosten, ab Runde 2 strukturiert fahren.
`,

    "Singapur": `
🏁 Start: Innen 💤, Außen ⚡ (auf Innenlinie zielen)

T1–3: ⚡
T3–9: ab Runde 2 🔋 (Runde 1 ggf. leicht ⚡)
T9–13: ⚡
T13–14: 💤
T14–17: 💤 + 🟢
T17–18: ⚡
T18–1: 🔋

Boost zwischen T10–13 sehr effektiv – vermeide sinnlosen ⚡ zwischen T7–9.
`,

    "Mexico": `
🏁 Start: ⚡ bis Ausgang T3

T1–3: ⚡
T3–4: 🔋
T4–6: ⚡
T6–12: ab Runde 2 💤/🔋
T12–16: ⚡
T16–1: 💤 + 🟢

Zwischen T12–16 am meisten Pace holen – immer etwas Antrieb übrig lassen.
`,

    "Spa": `
🏁 Start: innen ⚡ bis Ausgang T1, außen eher 💤

T1–4: 💤
T4–5: 🟢
T5–9: ⚡ (Schlüsselpassage)
T9–12: 💤
T12–14: ⚡
T14–18: 🔋
T18–1: 💤

DRS T4–7 ist fast Pflicht – kombiniert mit ⚡ kannst du mehrere Autos schnappen.
`,

    "AbuDhabi": `
🏁 Start: ⚡ bis ca. T3

T1–2: ⚡
T2–4: 💤
T4–5: ab Runde 2 🔋
T5–6: 🟢 + 💤
T6–7: ⚡
T7–9: ab Runde 2 🔋
T9–12: 💤
T12–16: ⚡
T16–1: ab Runde 2 🔋

Zwischen T12–16 maximalen Boost-Einsatz, DRS je nach Verschiebung anpassen.
`,

    "Sakhir": `
🏁 Start: ⚡ bis Ausgang T2

T1–2: ⚡
T2–4: 🔋
T4–8: ⚡
T8–10: ab Runde 2 🔋
T10: ⚡
T10–13: 💤
T13: ⚡
T13–14: ab Runde 2 🔋
T14–1: 💤 + 🟢

Besonders T5–8 mit ⚡ sehr stark – dort immer etwas Antrieb einplanen.
`,

    "Barcelona": `
🏁 Start: 💤 (Start ist nicht alles)

T1–2: ⚡
T2–4: 💤
T4–5: ⚡
T5–9: 💤
T9–10: ab Runde 2 🔋
T10–12: ⚡
T12–14: 💤
T14–1: 💤 + 🟢

Wenn DRS sich verschiebt, zwischen T9–10 nutzen und vor Start/Ziel etwas 🔋.
`,

    "Suzuka": `
🏁 Start: ⚡ bis Ausgang T2

T1–2: ⚡
T2–9: 💤 (S-Kurven sauber fahren)
T9–11: ⚡
T11–14: 💤
T14–16: 💤 + 🟢
T16–18: ⚡
T18–1: 🔋

Zwischen T9–11 ist Boost der Schlüssel zum Überholen. DRS meist besser T14–16.
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
       // ... nach dem Wiederherstellen von Event & Setups
    updateAllEventAttrs();
}

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
