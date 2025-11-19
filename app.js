/* ============================================================
    F1 CLASH — FULL APP LOGIC
=============================================================== */

/* ---------------- APP NAVIGATION ---------------- */
function openTab(tab) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById("screen-" + tab).classList.add("active");
}

/* ============================================================
   📌 DRIVER DATA
=============================================================== */

const drivers = [
    { name: "Max Verstappen",  base: { o:62, d:72, q:67, s:52, r:57 }, level: 4, boost: false },
    { name: "Lando Norris",    base: { o:57, d:67, q:62, s:52, r:72 }, level: 4, boost: false },
    { name: "Lewis Hamilton",  base: { o:72, d:52, q:62, s:57, r:67 }, level: 4, boost: false },
    { name: "George Russell",  base: { o:67, d:52, q:72, s:57, r:62 }, level: 5, boost: false },
    { name: "Fernando Alonso", base: { o:61, d:66, q:56, s:71, r:51 }, level: 6, boost: false },
    { name: "Charles Leclerc", base: { o:57, d:52, q:67, s:62, r:47 }, level: 5, boost: false },
    { name: "Oscar Piastri",   base: { o:67, d:62, q:52, s:57, r:47 }, level: 7, boost: false },
    { name: "Carlos Sainz",    base: { o:47, d:67, q:52, s:57, r:62 }, level: 5, boost: false },
    { name: "Pierre Gasly",    base: { o:52, d:47, q:62, s:57, r:67 }, level: 5, boost: false },
    { name: "Nico Hülkenberg", base:{ o:57, d:47, q:67, s:52, r:62 }, level: 3, boost: false }
];

function calcStat(base, level, boosted) {
    let val = base + (level - 1) * 4;
    if (boosted) val = Math.round(val * 1.10);
    return val;
}

/* Sortier-Logik für Drivers */
let driverSortKey = "name"; // name | o | d | q | s | r

function setDriverSortKey(key) {
    driverSortKey = key;
    renderDrivers();
}

function renderDrivers() {
    let html = `
      <h2>Drivers</h2>
      <div style="margin-bottom:8px;font-size:14px;">
        Sortieren nach:
        <select onchange="setDriverSortKey(this.value)">
          <option value="name" ${driverSortKey==="name"?"selected":""}>Name</option>
          <option value="o" ${driverSortKey==="o"?"selected":""}>Überholen</option>
          <option value="d" ${driverSortKey==="d"?"selected":""}>Verteidigen</option>
          <option value="q" ${driverSortKey==="q"?"selected":""}>Qualifying</option>
          <option value="s" ${driverSortKey==="s"?"selected":""}>Rennstart</option>
          <option value="r" ${driverSortKey==="r"?"selected":""}>Reifenmanagement</option>
        </select>
      </div>
    `;

    // sortierte Kopie der Fahrer
    const sorted = [...drivers].sort((a, b) => {
        if (driverSortKey === "name") {
            return a.name.localeCompare(b.name);
        }
        // nach aktuellem Stat sortieren (inkl. Level & Boost)
        const aStats = {
            o: calcStat(a.base.o, a.level, a.boost),
            d: calcStat(a.base.d, a.level, a.boost),
            q: calcStat(a.base.q, a.level, a.boost),
            s: calcStat(a.base.s, a.level, a.boost),
            r: calcStat(a.base.r, a.level, a.boost)
        };
        const bStats = {
            o: calcStat(b.base.o, b.level, b.boost),
            d: calcStat(b.base.d, b.level, b.boost),
            q: calcStat(b.base.q, b.level, b.boost),
            s: calcStat(b.base.s, b.level, b.boost),
            r: calcStat(b.base.r, b.level, b.boost)
        };
        // absteigend: bester Fahrer oben
        return bStats[driverSortKey] - aStats[driverSortKey];
    });

    sorted.forEach((d) => {
        const idx = drivers.findIndex(x => x.name === d.name);
        const stats = {
            o: calcStat(d.base.o, d.level, d.boost),
            d: calcStat(d.base.d, d.level, d.boost),
            q: calcStat(d.base.q, d.level, d.boost),
            s: calcStat(d.base.s, d.level, d.boost),
            r: calcStat(d.base.r, d.level, d.boost)
        };

        html += `
        <div class="driver-card">
            <div class="driver-row" style="font-size:18px;">
                <strong>${d.name}</strong>
                <span class="boost" onclick="toggleBoost(${idx})">
                    ${d.boost ? "⭐" : "☆"}
                </span>
            </div>

            <div class="driver-row">
                Level:
                <input type="number" min="1" max="20" value="${d.level}"
                       onchange="updateLevel(${idx}, this.value)"
                       style="width:60px;">
            </div>

            <div class="driver-row"><span>Überholen:</span> <strong>${stats.o}</strong></div>
            <div class="driver-row"><span>Verteidigen:</span> <strong>${stats.d}</strong></div>
            <div class="driver-row"><span>Qualifying:</span> <strong>${stats.q}</strong></div>
            <div class="driver-row"><span>Rennstart:</span> <strong>${stats.s}</strong></div>
            <div class="driver-row"><span>Reifenmanagement:</span> <strong>${stats.r}</strong></div>
        </div>
        `;
    });

    document.getElementById("screen-drivers").innerHTML = html;
}

function updateLevel(i, val) {
    let lvl = parseInt(val || "1", 10);
    if (isNaN(lvl) || lvl < 1) lvl = 1;
    drivers[i].level = lvl;
    renderDrivers();
}

function toggleBoost(i) {
    drivers[i].boost = !drivers[i].boost;
    renderDrivers();
}

/* ============================================================
   📌 TRACKS (inkl. Main/Sub & GUIDE TEXT)
=============================================================== */

const tracks = [
  {
    id:"01", name:"Melbourne", img:"01_Melbourne.png",
    main1:"Rennstart", main2:"Tempo",
    guide:`Start: Direkt boosten.
T1–2: Boost.
T2–3: Aufladen.
T3–7: Boost.
T7–kurz vor T11: Neutral.
T11–Ausgang T14: Boost.
Ausgang T14: Neutral + DRS.

Hinweis: Muster wiederholen, Verkehr & Situation lesen – je nach Position mehr boosten oder öfter laden.`
  },
  {
    id:"02", name:"Jeddah", img:"02_Jeddah.png",
    main1:"Reifenmanagement", main2:"Tempo",
    guide:`Start: Boost bis Ausgang T2.
T1–2: Boost.
T3–12: Neutral.
T12–13: Aufladen.
T14–18: Boost.
Ausgang T18–T26: Neutral.
Eingang T27: Boost.
Ausgang T27: Neutral + DRS.

Hinweise:
– In T1–2 oft Stau wegen Boxenausfahrt → auf Lücke achten.
– Bei wenig Boost: zwischen T24–27 gut laden, aber nicht mit Gegner direkt hinten dran.`
  },
  {
    id:"03", name:"Miami", img:"03_Miami.png",
    main1:"Verteidigen", main2:"Tempo",
    guide:`Start: Vom Start weg boosten.
T1–2: Boost.
T3–6: Neutral.
T7–Ausgang T8: Boost.
Ausgang T8–Eingang T11: Neutral.
T11–Ausgang T16: Boost.
Lange Gerade bis T17: Neutral + DRS.
T17–Ausgang T18: Boost.
T19–T1: Aufladen.

Wichtig:
– Runde 1 auf der langen Geraden Boost aufladen, da das Spiel erst ab Runde 2 volle Pace gibt.
– Gut zum Laden: Ausgang T8–T11.
– Nicht zwischen T11–16 aufladen.`
  },
  {
    id:"04", name:"Silverstone", img:"04_Silverstone.png",
    main1:"Reifenmanagement", main2:"Tempo",
    guide:`Start: Bei gutem Boost boosten, sonst neutral.
T1–2: Neutral.
Eingang T3–Ausgang T5: Boost.
Ausgang T5–Eingang T6: Neutral + DRS.
T6–Ausgang T7: Boost.
T8–T14: Neutral.
T14–T15: Neutral (oder Aufladen).
T15–T18: Boost.
Ausgang T18–T1: Aufladen.

Hinweis: Bei viel Verkehr in DRS-Zone T5–6 ggf. DRS/Boost eher zwischen T14–15 nutzen.`
  },
  {
    id:"05", name:"Monaco", img:"05_Monaco.png",
    main1:"Verteidigen", main2:"Kurvenverhalten",
    guide:`Start: Bei gutem Start bis Ausgang T1 boosten.
T1: Boost.
Ausgang T1–T4: Neutral.
Ausgang T4–Ausgang T8: Boost.
Ausgang T8–Eingang T10: Aufladen.
T10–11: Boost.
Ausgang T11–T18: Neutral.
T19–T1: Neutral + DRS.

Hinweis: Sehr startabhängig; Verkehr in der Haarnadel (T6–7) genau beobachten.`
  },
  {
    id:"06", name:"Spielberg", img:"06_Spielberg.png",
    main1:"Verteidigen", main2:"Tempo",
    guide:`Start: Direkt Boost bis Ausgang T1.
Ausgang T1–T3: Neutral.
T3–Eingang T4: Neutral + DRS.
T4–Ausgang T6: Boost.
Ausgang T6–T10: Neutral.
T10–T1: Aufladen.

Hinweis: DRS ideal zwischen T3–4. Ab Runde 2 DRS T1–3, ab Runde 3 lädt Valkyrie zwischen T2–3 und kann wieder T3–4 genutzt werden.`
  },
  {
    id:"07", name:"Monza", img:"07_Monza.png",
    main1:"Verteidigen", main2:"Tempo",
    guide:`Start:
– Innenbahn: Boost.
– Außenbahn: Neutral, danach nach T2 bis T4 boosten.

T1–2: 
– Ohne Verkehr: immer Boost.
– Bei Verkehr: Neutral.

T3–Eingang T4: Ab Runde 2 aufladen.
T4–Ausgang T7: Boost.
Ausgang T7–T10: Neutral.
Ausgang T10–Eingang T11: Aufladen.
T11: Boost.
Ausgang T11–T1: Neutral + DRS.

Hinweis: Starkes DRS T7–8; DRS-Logik ähnlich Spielberg.`
  },
  {
    id:"08", name:"Montreal", img:"08_Montreal.png",
    main1:"Überholen", main2:"Kurvenverhalten",
    guide:`Start:
– Innenbahn T1: Neutral.
– Außenbahn: Boost (Chance, viele Autos bis T3 zu kassieren).

T1–T4: Boost.
Ausgang T4–Eingang T6: Neutral.
T6–Ausgang T7: Boost.
Ausgang T7–Eingang T10: Neutral.
T10–11: Boost.
T11–Ausgang T14: Neutral + DRS.
Ausgang T14–T1: Aufladen.

Hinweis: Erstes DRS (R2) vor T11 zünden, damit du R3 & R4 die Zone voll nutzen kannst, dann Box & wiederholen.`
  },
  {
    id:"09", name:"Hungaroring", img:"09_Hungaroring.png",
    main1:"Rennstart", main2:"Kurvenverhalten",
    guide:`Start: Direkt Boost bis T3.
T1: Boost.
Ausgang T1–T2: Neutral.
T2–T3: Boost.
T3–Eingang T4: Aufladen.
T4–T5: Neutral.
Ausgang T5–Ausgang T7: Boost.
Ausgang T7–T11: Neutral.
T11–T12: Aufladen.
Ausgang T12–Ausgang T14: Boost.
Ausgang T14–T1: Neutral + DRS.

Hinweis: Ab Runde 3 DRS zwischen Ausgang T2–T4 nutzen; nach Box wie am Anfang.`
  },
  {
    id:"10", name:"Zandvoort", img:"10_Zandvoort.png",
    main1:"Verteidigen", main2:"Kurvenverhalten",
    guide:`Start:
– Innenbahn: Boost.
– Außenbahn: Neutral.

T1–T2: Neutral.
T2–Ausgang T3: Boost.
Ausgang T3–Ausgang T7: Aufladen.
Ausgang T7–Ausgang T10: Boost.
Ausgang T10–T11: Aufladen.
T11–T13: Neutral (bei Überholmöglichkeit hier boosten).
Ausgang T13–T1: Neutral + DRS.

Hinweis: Zwischen T8–10 unbedingt boost, hier kommt der größte Pace-Gewinn.`
  },
  {
    id:"11", name:"Austin", img:"11_Austin.png",
    main1:"Reifenmanagement", main2:"Kurvenverhalten",
    guide:`Start: Boost und hoffen, dass du T1 besser erwischst als Piastri 😄.
T1: Boost.
Ausgang T1–T10: Neutral.
T10–T11: Ab Runde 2 aufladen (in R1 hier boosten möglich).
T11–Eingang T12: Neutral + DRS.
Eingang T12–T15: Boost.
T15–Eingang T19: Neutral.
Eingang T19–Ausgang T20: Neutral.
Ausgang T20–Eingang T1: Aufladen.

Hinweis: R1 zwischen T10–Ausgang T11 boosten, ab R2 eher laden wenn Feld sortiert ist.`
  },
  {
    id:"12", name:"Shanghai", img:"12_Shangai.png",
    main1:"Überholen", main2:"Antrieb",
    guide:`Start: Boost bis T6.
T1–T4: Boost.
Ausgang T4–T6: Aufladen.
Ausgang T6–T8: Neutral.
Ausgang T8–Ausgang T10: Boost.
Ausgang T10–Eingang T11:
– R1: Boost.
– Ab R2: Aufladen.
Eingang T11–T13: Boost.
Ausgang T13–T14:
– R1: Aufladen.
– Ab R2: Neutral + DRS.
Ausgang T14–Ausgang T16: Boost.
Ausgang T16–T1: Aufladen.

Hinweis: In R1 ruhig mehr Boost riskieren, in der langen Geraden lieber 20–25 % Antrieb regenerieren.`
  },
  {
    id:"13", name:"Baku", img:"13_Baku.png",
    main1:"Überholen", main2:"Tempo",
    guide:`Start:
– Guter Start: Boost.
– Sonst: Neutral.

T1–Eingang T3: Neutral.
Eingang T3–Ausgang T6: Boost.
Ausgang T6–Ausgang T12: Neutral.
Ausgang T12–T14: Ab R2 aufladen.
T14–Ausgang T16: Boost.
Ausgang T16–T1: Neutral + DRS.

Hinweis: Ab R2 in T1 boosten, wenn ein klarer Überholmove möglich ist.`
  },
  {
    id:"14", name:"São Paulo", img:"14_SaoPaulo.png",
    main1:"Überholen", main2:"Kurvenverhalten",
    guide:`Start:
– Guter Start: Boost.
– Sonst: Neutral.

T1–T2: Boost.
Ausgang T2–T4: Neutral + DRS.
T4–T6: Neutral.
Ausgang T6–Ausgang T10: Boost.
Ausgang T10–Ausgang T13: Neutral.
Ausgang T13–Eingang T1: Aufladen.

Hinweis: Zwischen T6–10 holst du am meisten aus dem Antrieb; Boost ab R2 aggressiver nutzen.`
  },
  {
    id:"15", name:"Las Vegas", img:"15_LasVegas.png",
    main1:"Überholen", main2:"Tempo",
    guide:`Start: Boost.
T1–Eingang T3: Boost.
T3–Eingang T5: Aufladen + DRS.
T5–Eingang T7: Neutral.
Eingang T7–Ausgang T9: Boost.
Ausgang T9–T12: Neutral.
Ausgang T12–T13: Boost.
T13–T14: Aufladen + DRS.
T14–T16: Boost.
T16–T1: Neutral + DRS.

Wichtige DRS-Logik:
– R2: DRS T3–5, später in der Runde noch mal T16–1.
– Nach Pitstop wiederholbar, wenn du DRS zw. T12–13 auslässt und wieder T3–5 priorisierst.`
  },
  {
    id:"16", name:"Imola", img:"16_Imola.png",
    main1:"Rennstart", main2:"Antrieb",
    guide:`Start: Voll boosten, hoffen dass du T2 ohne Einschlag schaffst.
T1–T2: Neutral.
T2–T6: Boost.
T6–Eingang T7: Ab R2 aufladen.
Eingang T7–Ausgang T7: Boost.
Ausgang T7–Eingang T9: Ab R2 aufladen.
Eingang T9–Ausgang T13: Neutral.
Ausgang T13–Ausgang T15: Boost.
Ausgang T15–Eingang T17: Ab R2 aufladen.
Eingang T17–Ausgang T18: Boost.
Ausgang T18–T2: Neutral + DRS.

Runde-1-Tipp:
Bis T7 durchboosten, T7–9 neutral, T9–15 boosten, danach kurz laden, T17–18 wieder Boost, dann bis T2 laden.`
  },
  {
    id:"17", name:"Singapur", img:"17_Singapur.png",
    main1:"Rennstart", main2:"Antrieb",
    guide:`Start:
– Innenbahn: Neutral.
– Außenbahn: Boost (mit Glück innen nach T3).

T1–Ausgang T3: Boost.
Ausgang T3–Ausgang T9: Ab R2 aufladen.
Ausgang T9–Ausgang T13: Boost.
Ausgang T13–Ausgang T14: Neutral.
Ausgang T14–Ausgang T17: Neutral + DRS.
Ausgang T17–Ausgang T18: Boost.
Ausgang T18–T1: Aufladen.

Hinweis:
DRS je nach Situation T5–7 oder T14–16. Zwischen T7–9 möglichst nicht boosten; zwischen T10–13 ist der Boost am effektivsten.`
  },
  {
    id:"18", name:"Mexico City", img:"18_Mexico.png",
    main1:"Rennstart", main2:"Antrieb",
    guide:`Start: Direkt Boost bis Ausgang T3.
T1–Ausgang T3: Boost.
Ausgang T3–Eingang T4: Aufladen.
Eingang T4–Ausgang T6: Boost.
Ausgang T6–Eingang T12: Neutral (ab R2 eher aufladen).
Eingang T12–Ausgang T16: Boost.
Ausgang T16–T1: Neutral + DRS.

Hinweis: Zwischen T12–16 möglichst immer etwas Boost übrig haben.`
  },
  {
    id:"19", name:"Spa", img:"19_Spa.png",
    main1:"Reifenmanagement", main2:"Antrieb",
    guide:`Start:
– Innenbahn: Boost bis Ausgang T1.
– Außenbahn: Neutral.

Eingang T1–Ausgang T1: Boost.
Ausgang T1–Eingang T4: Neutral.
T4–T5: Neutral + DRS.
T5–T9: Boost.
Ausgang T9–Eingang T12: Neutral.
Eingang T12–Ausgang T14: Boost.
Ausgang T14–Eingang T18: Aufladen.
Eingang T18–Eingang T1: Neutral.

Hinweis: DRS T4–7 ist extrem stark, du trägst es mit in die Schikane (5–7).`
  },
  {
    id:"20", name:"Abu Dhabi", img:"20_AbuDhabi.png",
    main1:"Überholen", main2:"Antrieb",
    guide:`Start: Boost bis T3.
Eingang T1–Ausgang T2: Boost.
Ausgang T2–Eingang T4: Neutral.
T4–Eingang T5: Ab R2 aufladen.
Ausgang T5–Eingang T6: Neutral + DRS.
Eingang T6–Ausgang T7: Boost.
Ausgang T7–Eingang T9: Ab R2 aufladen.
Eingang T9–Eingang T12: Neutral.
Eingang T12–Ausgang T16: Boost.
Ausgang T16–Eingang T1: Ab R2 aufladen.

Hinweis: Wenn sich DRS verschiebt, kann es zwischen T8–9 genutzt werden; Boost wirkt am meisten zwischen T12–16.`
  },
  {
    id:"21", name:"Sakhir", img:"21_Sakhir.png",
    main1:"Reifenmanagement", main2:"Antrieb",
    guide:`Start: Boost bis Ausgang T2.
T1–Ausgang T2: Boost.
Ausgang T2–Eingang T4: Aufladen.
Eingang T4–Ausgang T8: Boost.
Ausgang T8–Eingang T10: Ab R2 aufladen.
Eingang T10–Ausgang T10: Boost.
Ausgang T10–Eingang T13: Neutral.
Eingang T13–Ausgang T13: Boost.
Ausgang T13–Eingang T14: Ab R2 aufladen.
Eingang T14–T1: Neutral + DRS.

Hinweis: DRS je nach Verschiebung T3–4, 10–11 oder 13–14; zwischen T5–8 ist Boost extrem stark.`
  },
  {
    id:"22", name:"Barcelona", img:"22_Barcelona.png",
    main1:"Reifenmanagement", main2:"Kurvenverhalten",
    guide:`Start: Neutral.
Eingang T1–Ausgang T2: Boost.
Ausgang T2–Eingang T4: Neutral.
Eingang T4–Ausgang T5: Boost.
Ausgang T5–Ausgang T9: Neutral.
Ausgang T9–Eingang T10: Ab R2 aufladen.
Eingang T10–Ausgang T12: Boost.
Ausgang T12–T14: Neutral.
T14–T1: Neutral + DRS.

Hinweis: Wenn sich DRS verschiebt, DRS zwischen T9–10 zünden und zwischen T14–1 laden.`
  },
  {
    id:"23", name:"Suzuka", img:"23_Suzuka.png",
    main1:"Verteidigen", main2:"Kurvenverhalten",
    guide:`Start: Boost bis Ausgang T2.
Eingang T1–Ausgang T2: Boost.
Ausgang T2–Eingang T9: Neutral.
Eingang T9–Ausgang T11: Boost.
Ausgang T11–T14: Neutral.
T14–Eingang T16: Neutral + DRS.
Eingang T16–T18: Boost.
T18–Eingang T1: Aufladen.

Hinweis: Zwischen T9–11 unbedingt boosten – beste Überholzone. DRS bevorzugt T14–16 einsetzen.`
  }
];

/* Helper für farbige Attribute im Event Planner */
function attrClass(attr) {
    const a = attr.toLowerCase();
    if (a.includes("rennstart")) return "attr-rennstart";
    if (a.includes("tempo")) return "attr-tempo";
    if (a.includes("reifen")) return "attr-reifen";
    if (a.includes("überholen")) return "attr-ueberholen";
    if (a.includes("verteidigen")) return "attr-verteidigen";
    if (a.includes("kurven")) return "attr-kurven";
    if (a.includes("antrieb")) return "attr-antrieb";
    return "";
}

/* ============================================================
   📌 EVENT PLANNER (8 Slots, mit Werten & Driver A/B & Guide)
=============================================================== */

const tyreOptions = [
    "Soft/Soft",
    "Soft/Med",
    "Soft/Hard",
    "Med/Soft",
    "Med/Med",
    "Med/Hard",
    "Hard/Soft",
    "Hard/Med",
    "Hard/Hard",
    "Soft/Soft/Soft",
    "Soft/Med/Soft",
    "Med/Soft/Soft"
];

let eventData = Array.from({ length: 8 }).map(() => ({
    track: "",
    driverA: "",
    driverB: "",
    tyresA: "",
    tyresB: "",
    boost: ""
}));

function renderEventPlanner() {
    let html = `<h2>Event Planner</h2>
    <table class="event-table">
        <tr>
            <th>#</th>
            <th>Strecke</th>
            <th>Werte</th>
            <th>Driver A</th>
            <th>Tyres A</th>
            <th>Driver B</th>
            <th>Tyres B</th>
            <th>Boost</th>
            <th>Guide</th>
        </tr>`;

    for (let i = 0; i < 8; i++) {
        const slot = eventData[i];
        const trackObj = tracks.find(t => t.name === slot.track);

        let valuesHtml = "–";
        if (trackObj) {
            const c1 = attrClass(trackObj.main1);
            const c2 = attrClass(trackObj.main2);
            valuesHtml = `
              <span class="attr-chip ${c1}">${trackObj.main1}</span>
              <span class="attr-chip ${c2}">${trackObj.main2}</span>
            `;
        }

        html += `
        <tr>
            <td>${i+1}</td>

            <td>
                <select class="event-input" onchange="updateEvent(${i}, 'track', this.value)">
                    <option value="">-- Select --</option>
                    ${tracks.map(t => `
                        <option value="${t.name}" ${slot.track===t.name?"selected":""}>
                            ${t.name}
                        </option>
                    `).join("")}
                </select>
            </td>

            <td>${valuesHtml}</td>

            <td>
                <select class="event-input" onchange="updateEvent(${i}, 'driverA', this.value)">
                    <option value="">-- Driver --</option>
                    ${drivers.map(d => `
                        <option value="${d.name}" ${slot.driverA===d.name?"selected":""}>
                            ${d.name}
                        </option>
                    `).join("")}
                </select>
            </td>

            <td>
                <select class="event-input" onchange="updateEvent(${i}, 'tyresA', this.value)">
                    <option value="">--</option>
                    ${tyreOptions.map(x => `
                        <option value="${x}" ${slot.tyresA===x?"selected":""}>${x}</option>
                    `).join("")}
                </select>
            </td>

            <td>
                <select class="event-input" onchange="updateEvent(${i}, 'driverB', this.value)">
                    <option value="">-- Driver --</option>
                    ${drivers.map(d => `
                        <option value="${d.name}" ${slot.driverB===d.name?"selected":""}>
                            ${d.name}
                        </option>
                    `).join("")}
                </select>
            </td>

            <td>
                <select class="event-input" onchange="updateEvent(${i}, 'tyresB', this.value)">
                    <option value="">--</option>
                    ${tyreOptions.map(x => `
                        <option value="${x}" ${slot.tyresB===x?"selected":""}>${x}</option>
                    `).join("")}
                </select>
            </td>

            <td>
                <input type="text"
                       class="event-input event-boost-input"
                       value="${slot.boost}"
                       maxlength="20"
                       oninput="updateEvent(${i}, 'boost', this.value)">
            </td>

            <td>
                ${slot.track
                    ? `<button onclick="openMapByName('${slot.track}')">🔍 Guide</button>`
                    : `<span style="color:#aaa;">–</span>`
                }
            </td>
        </tr>`;
    }

    html += `</table>`;
    document.getElementById("screen-event").innerHTML = html;
}

/* Wichtig: nach jeder Änderung neu rendern,
   damit Werte & Guide-Button aktualisiert werden */
function updateEvent(i, field, val) {
    eventData[i][field] = val;
    renderEventPlanner();
}

/* ============================================================
   📌 TRACK MAP LIST + MODAL
=============================================================== */

function renderTrackList() {
    let html = `<h2>Track Maps</h2>`;

    tracks.forEach(t => {
        html += `
        <div class="track-card" onclick="openMap('${t.id}')">
            ${t.name}
        </div>`;
    });

    document.getElementById("screen-maps").innerHTML = html;
}

function openMap(id) {
    const t = tracks.find(x => x.id === id);
    if (!t) return;
    document.getElementById("mapImage").src = t.img;
    document.getElementById("mapGuide").innerText = t.guide;
    document.getElementById("mapModal").classList.remove("hidden");
}

function openMapByName(name) {
    const t = tracks.find(x => x.name === name);
    if (t) openMap(t.id);
}

function closeMap() {
    document.getElementById("mapModal").classList.add("hidden");
}

/* ============================================================
   📌 COMPONENTS SETUP (Text only)
=============================================================== */

const components = {
    Bremsen:    ["Boombox", "Flow 1K", "Rumble"],
    Getriebe:   ["The Beast", "Metronome", "The Dynamo"],
    Heckflügel: ["The Valkyrie", "Aero Blade", "Power Lift"],
    Frontflügel:["Flex XL", "Curler", "The Sabre"],
    Aufhängung: ["Nexus", "Gyro", "Quantum"],
    Motor:      ["Turbo Jet", "Behemoth", "Mach III"]
};

function renderComponents() {
    let html = `<h2>Komponenten</h2>`;

    Object.keys(components).forEach(cat => {
        html += `<h3>${cat}</h3>`;
        components[cat].forEach(c => {
            html += `<div class="track-card">${c}</div>`;
        });
    });

    document.getElementById("screen-components").innerHTML = html;
}

/* ============================================================
   INIT APP
=============================================================== */

renderDrivers();
renderEventPlanner();
renderTrackList();
renderComponents();
