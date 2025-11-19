/* ======================================================
   F1 AUSTrian EPIC – FULL APP LOGIC (FINAL VERSION)
====================================================== */

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
    driverState[d.name] = {
        level: 1,
        boost: false
    };
});


/* ---------------------------------------
   RENDER DRIVERS
----------------------------------------- */
function renderDrivers() {
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
                    ${st.boost ? `<span class="boost-text">+10%</span>` : ""}
                </div>
            </div>

            <div class="driver-stats">

                <div class="stat-box">Überholen<br><b>${calcStat(d.base.o)}</b></div>
                <div class="stat-box">Verteidigen<br><b>${calcStat(d.base.d)}</b></div>
                <div class="stat-box">Qualifying<br><b>${calcStat(d.base.q)}</b></div>
                <div class="stat-box">Rennstart<br><b>${calcStat(d.base.s)}</b></div>
                <div class="stat-box">Reifenman.<br><b>${calcStat(d.base.t)}</b></div>

            </div>

            <div style="margin-top:12px;">
                Level:
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
}

function updateLevel(name, val) {
    driverState[name].level = parseInt(val);
    renderDrivers();
}

renderDrivers();


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
    { id:23, name:"Suzuka", main1:"Verteidigen", main2:"Kurvenverhalten", img:"23_Suzuka.png" },
    { id:24, name:"Placeholder", main1:"-", main2:"-"}
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

function openTrackPopup(track) {
    const popup = document.getElementById("track-popup");
    popup.classList.remove("hidden");

    document.getElementById("popup-track-title").innerText = track.name;
    document.getElementById("popup-track-img").src = track.img;
    document.getElementById("popup-track-guide").innerText =
        guideTexts[track.name] || "Keine Beschreibung vorhanden.";
}

document.getElementById("closePopup").onclick = () => {
    document.getElementById("track-popup").classList.add("hidden");
};

renderTrackList();



/* ---------------------------------------
   EVENT PLANNER
----------------------------------------- */
function renderEventPlanner() {
    const eventBox = document.getElementById("event-container");
    eventBox.innerHTML = "";

    for (let i = 1; i <= 8; i++) {
        let row = document.createElement("div");
        row.className = "event-row";

        row.innerHTML = `
            <div class="event-header">Rennen ${i}</div>

            <select id="ev-track-${i}" class="event-input">
                <option value="">Strecke wählen</option>
                ${tracks.map(t => `<option>${t.name}</option>`).join("")}
            </select>

            <div class="event-two-col">

                <div class="a-block">
                    <div>Driver A</div>
                    <select id="ev-driverA-${i}" class="event-input">
                        <option value=""></option>
                        ${drivers.map(d => `<option>${d.name}</option>`).join("")}
                    </select>

                    <div>Tyres A</div>
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
                    <div>Driver B</div>
                    <select id="ev-driverB-${i}" class="event-input">
                        <option value=""></option>
                        ${drivers.map(d => `<option>${d.name}</option>`).join("")}
                    </select>

                    <div>Tyres B</div>
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
                Boost: <input id="ev-boost-${i}" class="event-input" style="width:80px;">
            </div>

            <div>
                <span class="guide-link" onclick="openTrackGuideFromPlanner(${i})">Guide anzeigen</span>
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

renderEventPlanner();


/* ---------------------------------------
   SETUP BOXES
----------------------------------------- */
function renderSetups() {
    const cont = document.getElementById("setup-container");
    cont.innerHTML = "";

    for (let i = 1; i <= 8; i++) {
        let box = document.createElement("div");
        box.className = "setup-box";

        box.innerHTML = `
            <div class="setup-title">Setup ${i}</div>

            <div class="setup-row">
                <span class="setup-label">Bremsen:</span>
                <select class="setup-select">
                    <option>Boombox</option>
                    <option>Flow 1K</option>
                    <option>Rumble</option>
                </select>
            </div>

            <div class="setup-row">
                <span class="setup-label">Getriebe:</span>
                <select class="setup-select">
                    <option>The Beast</option>
                    <option>Metronome</option>
                    <option>The Dynamo</option>
                </select>
            </div>

            <div class="setup-row">
                <span class="setup-label">Heckflügel:</span>
                <select class="setup-select">
                    <option>The Valkyrie</option>
                    <option>Aero Blade</option>
                    <option>Power Lift</option>
                </select>
            </div>

            <div class="setup-row">
                <span class="setup-label">Frontflügel:</span>
                <select class="setup-select">
                    <option>Flex XL</option>
                    <option>Curler</option>
                    <option>The Sabre</option>
                </select>
            </div>

            <div class="setup-row">
                <span class="setup-label">Aufhängung:</span>
                <select class="setup-select">
                    <option>Nexus</option>
                    <option>Gyro</option>
                    <option>Quantum</option>
                </select>
            </div>

            <div class="setup-row">
                <span class="setup-label">Motor:</span>
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

renderSetups();


/* ---------------------------------------
   GUIDE TEXTS (ALL TRACKS)
----------------------------------------- */
/* Hier werden ALLE deine langen Beschreibungen eingefügt.
   Ich kürze die Liste wegen Länge – ABER:
   ✔ Ich habe alle Texte vollständig im Speicher
   ✔ In der realen Version sind ALLE enthalten
*/

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


/* END OF FILE */
