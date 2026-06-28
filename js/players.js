const players = [
  {name:"Amir Rrahmani",    apiId:1314,   tm:"https://www.transfermarkt.com/amir-rrahmani/profil/spieler/257732",    pos:"DEF", club:"SSC Napoli",              country:"Italy",        flag:"🇽🇰", lat:40.83, lng:14.25},
  {name:"Toma Bašić",       apiId:1266,   tm:"https://www.transfermarkt.com/toma-basic/profil/spieler/334835",       pos:"MID", club:"SS Lazio",                country:"Italy",        flag:"🇭🇷", lat:41.90, lng:12.46},
  {name:"Mërgim Vojvoda",   apiId:8586,   tm:"https://www.transfermarkt.com/mergim-vojvoda/profil/spieler/336125",   pos:"DEF", club:"Como 1907",               country:"Italy",        flag:"🇽🇰", lat:45.81, lng:9.08},
  {name:"Moris Valincic",   apiId:288319, tm:"https://www.transfermarkt.com/moris-valincic/profil/spieler/502686",   pos:"DEF", club:"GNK Dinamo Zagreb",       country:"Croatia",      flag:"🇭🇷", lat:45.82, lng:16.02},
  {name:"Bosko Sutalo",     apiId:14316,  tm:"https://www.transfermarkt.com/bosko-sutalo/profil/spieler/431698",     pos:"DEF", club:"Cracovia",                country:"Poland",       flag:"🇭🇷", lat:50.06, lng:19.94},
  {name:"Lindon Selahi",    apiId:108453, tm:"https://www.transfermarkt.com/lindon-selahi/profil/spieler/340172",    pos:"MID", club:"Widzew Lodz",             country:"Poland",       flag:"🇦🇱", lat:51.76, lng:19.46},
  {name:"Ermal Krasniqi",   apiId:271921, tm:"https://www.transfermarkt.com/ermal-krasniqi/profil/spieler/606893",   pos:"MID", club:"Legia Warszawa",          country:"Poland",       flag:"🇽🇰", lat:52.22, lng:21.00},
  {name:"Amar Gerxhaliu",   apiId:382221, tm:"https://www.transfermarkt.com/amar-gerxhaliu/profil/spieler/866177",   pos:"DEF", club:"Erzurumspor FK",          country:"Turkey",       flag:"🇽🇰", lat:39.90, lng:41.27},
  {name:"Luka Lijeskic",    apiId:342328, tm:"https://www.transfermarkt.com/luka-lijeskic/profil/spieler/674169",    pos:"GK",  club:"FK Radnicki 1923",        country:"Serbia",       flag:"🇷🇸", lat:43.99, lng:20.93},
  {name:"Milos Degenek",    apiId:2742,   tm:"https://www.transfermarkt.com/milos-degenek/profil/spieler/187353",    pos:"DEF", club:"APOEL Nicosia",           country:"Cyprus",       flag:"🇦🇺", lat:35.17, lng:33.36},
  {name:"Luka Dajcer",      apiId:276285, tm:"https://www.transfermarkt.com/luka-dajcer/profil/spieler/809157",      pos:"DEF", club:"NK Lokomotiva Zagreb",    country:"Croatia",      flag:"🇭🇷", lat:45.82, lng:16.02},
  {name:"Luka Marjanac",    apiId:364359, tm:"https://www.transfermarkt.com/luka-marjanac/profil/spieler/583024",    pos:"MID", club:"Slask Wroclaw",           country:"Poland",       flag:"🇧🇦", lat:51.11, lng:17.04},
  {name:"Lamine Ba",        apiId:null,   tm:"https://www.transfermarkt.com/lamine-ba/profil/spieler/353374",        pos:"DEF", club:"Slask Wroclaw",           country:"Poland",       flag:"🇲🇷", lat:51.11, lng:17.04},
  {name:"Marcelino Preka",  apiId:282899, tm:"https://www.transfermarkt.com/marcelino-preka/profil/spieler/726112",  pos:"DEF", club:"FK Partizani",            country:"Albania",      flag:"🇦🇱", lat:41.33, lng:19.83},
  {name:"Luka Savatovic",   apiId:381712, tm:"https://www.transfermarkt.com/luka-savatovic/profil/spieler/1046001",   pos:"GK",  club:"NK Lokomotiva Zagreb",    country:"Croatia",      flag:"🇭🇷", lat:45.82, lng:16.02},
  {name:"Rron Krueziu",     apiId:608898, tm:"https://www.transfermarkt.com/rron-krueziu/profil/spieler/1046466",     pos:"DEF", club:"FC Lugano II",            country:"Switzerland",  flag:"🇨🇭", lat:46.00, lng:8.95},
  {name:"Metodi Maksimov",  apiId:215947, tm:"https://www.transfermarkt.com/metodi-maksimov/profil/spieler/624033",  pos:"DEF", club:"LASK Amateure OÖ",        country:"Austria",      flag:"🇲🇰", lat:48.31, lng:14.28},
  {name:"Ardi Trshani",     apiId:437184, tm:"https://www.transfermarkt.com/ardi-trshani/profil/spieler/1064023",     pos:"MID", club:"NK Uljanik",              country:"Croatia",      flag:"🇽🇰", lat:44.87, lng:13.85}
];

// Store fetched stats, keyed by player name: { playerName: { appearances, minutes } }
const playerStats = {};

async function fetchPlayerStats(player) {
  try {
    const res = await fetch(`/stats?id=${player.apiId}`);
    const data = await res.json();

    if (data.appearances !== null && (data.appearances > 0 || data.minutes > 0)) {
      playerStats[player.name] = { appearances: data.appearances, minutes: data.minutes };
    } else {
      playerStats[player.name] = null;
    }
  } catch(e) {
    console.warn("Stats fetch failed for", player.name, e);
    playerStats[player.name] = null;
  }
}

async function loadAllPlayerStats() {
  const playersWithIds = players.filter(p => p.apiId);
  await Promise.all(playersWithIds.map(fetchPlayerStats));
  // Re-render whichever filter is active
  const activeBtn = document.querySelector('.f-btn.active');
  const pos = activeBtn ? activeBtn.textContent.trim() : 'all';
  renderPlayers(pos === 'All' ? 'all' : pos);
}

function renderPlayers(filter){
  const grid=document.getElementById('players-grid');
  const list=filter==='all'?players:players.filter(p=>p.pos===filter);
  grid.innerHTML=list.map(p=>{
    const tag   = p.tm ? '<a class="player-card" href="' + p.tm + '" target="_blank" rel="noopener noreferrer">' : '<div class="player-card">';
    const close = p.tm ? '</a>' : '</div>';
    const tmLink = p.tm ? '<div class="p-tm-link">View on Transfermarkt →</div>' : '';
    const stats = playerStats[p.name];
    const statsHtml = stats
      ? '<div class="p-stats">' +
          '<span class="p-stat"><span class="p-stat-val">' + stats.appearances + '</span><span class="p-stat-lbl">Apps</span></span>' +
          '<span class="p-stat-div"></span>' +
          '<span class="p-stat"><span class="p-stat-val">' + stats.minutes + '</span><span class="p-stat-lbl">Mins</span></span>' +
        '</div>'
      : (stats === undefined && p.apiId ? '<div class="p-stats-loading">Loading…</div>' : '');
    return tag +
      '<div class="p-flag">'  + p.flag + '</div>' +
      '<div class="p-pos">'   + p.pos  + '</div>' +
      '<div class="p-name">'  + p.name + '</div>' +
      '<div class="p-club">'  + p.club + '</div>' +
      statsHtml +
      tmLink + close;
  }).join('');
}
renderPlayers('all');
loadAllPlayerStats();

function filterP(pos,btn){
  document.querySelectorAll('.f-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderPlayers(pos);
}