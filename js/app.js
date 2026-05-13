// 게임 상태 관리
const state = {
    phase: -1,
    teamName: "지구방위대",
    red: { name: "커스텀 레드", color: "레드", combat: 1, mental: 1, teamwork: 1, support: 1, prefThemes: [], imgUrl: "img/레드.png" },
    gold: 500,
    team: [],
    tokens: { combat: 0, mental: 0, teamwork: 0, support: 0 },
    tokenBonuses: { combat: 0, mental: 0, teamwork: 0, support: 0 },
    vp: 0,
    energy: 100,
    day: 1,
    maxDays: 5,
    boss: null,
    bossHp: 0,
    currentMonster: null,
    monsterHp: 0,
    
    // 경매 상태
    auctionPool: [],
    currentAuctionIndex: 0,
    currentBid: 0,
    highestBidder: null, // 'player' or rival id
    npcRivals: [],
    auctionTimer: 10.0,
    auctionInterval: null,
    
    logs: [],
    eventDeck: [],
    currentEventIndex: 0,
    bossPatternIndex: 0,
};

const THEMES = ["공룡", "경찰", "우주", "닌자", "라이드", "마법", "동물", "사이버", "신화", "스포츠", "음악", "중장비"];

// 유틸리티
function log(msg) {
    state.logs.push(msg);
    const logBox = document.getElementById('log-box');
    if (logBox) {
        logBox.innerHTML = state.logs.map(l => `<div class="log-entry">${l}</div>`).join('');
        logBox.scrollTop = logBox.scrollHeight;
    }
}

function getDiceHTML(num, isRolling, isSmall) {
    if (!num) num = 1;
    let sizeClass = isSmall ? 'small' : '';
    let animClass = isRolling ? 'rolling' : `show-${num}`;
    
    const pipsLayouts = {
        1: '<div class="pip"></div>',
        2: '<div class="pip"></div><div class="pip"></div>',
        3: '<div class="pip"></div><div class="pip"></div><div class="pip"></div>',
        4: '<div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div>',
        5: '<div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div>',
        6: '<div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div>'
    };

    return `
    <div class="dice-scene ${sizeClass}">
        <div class="dice ${animClass}">
            <div class="dice__face dice__face--1"><div class="dice-pips">${pipsLayouts[1]}</div></div>
            <div class="dice__face dice__face--2"><div class="dice-pips">${pipsLayouts[2]}</div></div>
            <div class="dice__face dice__face--3"><div class="dice-pips">${pipsLayouts[3]}</div></div>
            <div class="dice__face dice__face--4"><div class="dice-pips">${pipsLayouts[4]}</div></div>
            <div class="dice__face dice__face--5"><div class="dice-pips">${pipsLayouts[5]}</div></div>
            <div class="dice__face dice__face--6"><div class="dice-pips">${pipsLayouts[6]}</div></div>
        </div>
    </div>
    `;
}

window.handleImageError = function(imgElement, color, sizeClass, name) {
    window.missingImages = window.missingImages || new Set();
    window.missingImages.add(name);
    imgElement.outerHTML = `<div class="color-indicator c-${color} ${sizeClass}"></div>`;
};

function getCharAvatarHTML(m, sizeClass = '') {
    const size = sizeClass === 'small' ? 'small' : '';
    window.missingImages = window.missingImages || new Set();
    if (window.missingImages.has(m.name)) {
        return `<div class="color-indicator c-${m.color} ${size}"></div>`;
    }
    return `<img src="${m.imgUrl || 'img/' + m.name + '.png'}" onerror="window.handleImageError(this, '${m.color}', '${size}', '${m.name}')" class="char-img ${size}">`;
}

function rollDice(sides = 6) { return Math.floor(Math.random() * sides) + 1; }

function getMemberStatTable(stats) {
    return `
    <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:0.2rem 0.5rem; text-align:center; background:rgba(0,0,0,0.4); padding:0.3rem 0.5rem; border-radius:6px; margin-top:0.5rem;">
        <span style="color:var(--text-muted); font-size:0.7rem; white-space:nowrap;">전투력</span>
        <span style="color:var(--text-muted); font-size:0.7rem; white-space:nowrap;">정신력</span>
        <span style="color:var(--text-muted); font-size:0.7rem; white-space:nowrap;">팀워크</span>
        <span style="color:var(--text-muted); font-size:0.7rem; white-space:nowrap;">전투 지원</span>
        <span style="font-weight:bold; font-size:0.8rem;">${stats[0]}</span>
        <span style="font-weight:bold; font-size:0.8rem;">${stats[1]}</span>
        <span style="font-weight:bold; font-size:0.8rem;">${stats[2]}</span>
        <span style="font-weight:bold; font-size:0.8rem;">${stats[3]}</span>
    </div>`;
}

function getStatString(teamArr, red) {
    let s = [0,0,0,0];
    if (red) {
        s[0] += red.combat || 0;
        s[1] += red.mental || 0;
        s[2] += red.teamwork || 0;
        s[3] += red.support || 0;
        if (red === state.red) {
            s[0] += state.tokenBonuses.combat;
            s[1] += state.tokenBonuses.mental;
            s[2] += state.tokenBonuses.teamwork;
            s[3] += state.tokenBonuses.support;
        }
    }
    teamArr.forEach(m => {
        s[0] += m.stats[0]; s[1] += m.stats[1]; s[2] += m.stats[2]; s[3] += m.stats[3];
    });
    return `
    <span style="display:inline-grid; grid-template-columns: repeat(4, 1fr); gap:0.2rem 0.5rem; text-align:center; background:rgba(0,0,0,0.4); padding:0.3rem 0.5rem; border-radius:6px; line-height:1.2; vertical-align:middle; border:1px solid rgba(255,255,255,0.1);">
        <span style="color:var(--text-muted); font-size:0.7rem; white-space:nowrap;">전투력</span>
        <span style="color:var(--text-muted); font-size:0.7rem; white-space:nowrap;">정신력</span>
        <span style="color:var(--text-muted); font-size:0.7rem; white-space:nowrap;">팀워크</span>
        <span style="color:var(--text-muted); font-size:0.7rem; white-space:nowrap;">전투 지원</span>
        <span style="color:var(--neon-blue); font-weight:bold; font-size:0.85rem;">${s[0]}</span>
        <span style="color:var(--neon-blue); font-weight:bold; font-size:0.85rem;">${s[1]}</span>
        <span style="color:var(--neon-blue); font-weight:bold; font-size:0.85rem;">${s[2]}</span>
        <span style="color:var(--neon-blue); font-weight:bold; font-size:0.85rem;">${s[3]}</span>
    </span>`;
}

// 렌더링 컨트롤러
function render() {
    const app = document.getElementById('app');
    let html = '';

    if (state.phase > 0.5) {
        html += `
        <div class="status-bar">
            <div class="status-item">Red: <span>${state.red.name}</span></div>
            <div class="status-item">자금: <span>${state.gold}G</span></div>
            <div class="status-item">팀원: <span>${state.team.length}/5</span></div>
            <div class="status-item">토큰: <span style="font-size:0.8rem;">[전투:${state.tokens.combat} 정신:${state.tokens.mental} 팀:${state.tokens.teamwork} 지원:${state.tokens.support}]</span></div>
            <div class="status-item">진행: <span>Day ${state.day}/${state.maxDays}</span></div>
            <div class="status-item">에너지: <span>${state.energy}</span></div>
            <div class="status-item">VP: <span>${state.vp}</span></div>
        </div>`;
    }

    if (state.phase >= 1.5) {
        html += `
        <div class="team-overview fade-in">
            <div class="overview-myteam">
                <h3 style="color:var(--neon-blue); margin-bottom:0.5rem; text-align:center;">내 전대 현황</h3>
                <div style="text-align:center; margin-bottom:0.5rem; font-size:0.9rem; color:var(--text-muted);">${getStatString(state.team, state.red)}</div>
                <div style="display:flex; gap:0.5rem; justify-content:center; flex-wrap:wrap;">
                    <div class="card" style="padding:0.5rem; text-align:center; min-width:70px;">
                        ${getCharAvatarHTML(state.red, 'small')}
                        <div style="font-size:0.75rem; font-weight:bold;">${state.red.name}</div>
                    </div>
                    ${state.team.map(m => `
                        <div class="card" style="padding:0.5rem; text-align:center; min-width:70px;">
                            ${getCharAvatarHTML(m, 'small')}
                            <div style="font-size:0.75rem; font-weight:bold;">${m.name}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="overview-npcs">
                <h4 style="color:var(--neon-yellow); margin-bottom:0.5rem; text-align:center;">라이벌 전대</h4>
                ${state.npcRivals.map(npc => `
                    <div class="npc-overview-item">
                        <span style="color:var(--neon-pink); font-weight:bold;">${npc.name}</span>
                        <span style="color:var(--text-muted); font-size:0.8rem;">${getStatString(npc.team, npc)} | VP: <span style="color:var(--neon-blue)">${npc.vp || 0}</span> | HP: <span style="color:${npc.energy > 0 ? 'var(--neon-green)' : 'red'}">${npc.energy > 0 ? Math.floor(npc.energy) : '전멸'}</span></span>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
    }

    if (state.phase === -1) html += renderPhase_minus1();
    else if (state.phase === -0.5) html += renderPhase_minus0_5();
    else if (state.phase === 0) html += renderPhase0();
    else if (state.phase === 0.5) html += renderPhase0_5();
    else if (state.phase === 1) html += renderPhase1();
    else if (state.phase === 1.5) html += renderPhase1_5();
    else if (state.phase === 1.6) html += renderPhase1_6();
    else if (state.phase === 1.8) html += renderPhase1_8();
    else if (state.phase === 2) html += renderPhase2();
    else if (state.phase === 2.1) html += renderPhase2_1();
    else if (state.phase === 2.2) html += renderPhase2_2();
    else if (state.phase === 2.3) html += renderPhase2_3();
    else if (state.phase === 2.31) html += renderPhase2_3();
    else if (state.phase === 2.4) html += renderPhase2_4();
    else if (state.phase === 2.5) html += renderPhase2_5();
    else if (state.phase === 3) html += renderPhase3();
    else if (state.phase === 3.1) html += renderPhase3();
    else if (state.phase === 3.2) html += renderPhase3_2();
    else if (state.phase === 4) html += renderPhase4();

    if (state.phase > 0.5) {
        html += `<div class="glass-panel mt-2"><div id="log-box" class="log-box"></div></div>`;
    }

    app.innerHTML = html;
    if (state.phase > 0.5) {
        const logBox = document.getElementById('log-box');
        if (logBox) {
            logBox.innerHTML = state.logs.map(l => `<div class="log-entry">${l}</div>`).join('');
            logBox.scrollTop = logBox.scrollHeight;
        }
    }
}

window.startGameSequence = function() {
    state.boss = GAME_DATA.bosses[Math.floor(Math.random() * GAME_DATA.bosses.length)];
    state.bossHp = state.boss.hp;
    state.bossPatternIndex = 0;
    state.boss.patterns.sort(() => 0.5 - Math.random());
    state.phase = -0.5;
    render();
}

window.goToRedCustom = function() {
    state.phase = 0;
    render();
}

function renderPhase_minus1() {
    return `
    <div class="title-screen fade-in">
        <h1 class="title-glow" style="font-size: 4rem;">덱 메이킹 전대물</h1>
        <button class="btn btn-primary" onclick="startGameSequence()">시작</button>
        <button class="btn" style="border-color:var(--neon-blue); color:var(--neon-blue);" onclick="alert('경매를 통해 5인 전대를 구성하고, 일상 이벤트로 성장하며 악의 조직을 물리치는 게임입니다.')">설명</button>
    </div>
    `;
}

function renderPhase_minus0_5() {
    // 보스 패턴 기반 요구 스탯 분석
    const typeCount = { "ATK": 0, "WILL": 0, "TEAM": 0, "SUP": 0 };
    state.boss.patterns.forEach(p => { typeCount[p.type] = (typeCount[p.type] || 0) + 1; });
    const typeNames = { "ATK": "전투력", "WILL": "정신력", "TEAM": "팀워크", "SUP": "전투 지원" };
    
    // 가장 많이 등장하는 패턴 타입 2개 추출
    const topStats = Object.entries(typeCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(entry => typeNames[entry[0]])
        .join(', ');

    return `
    <div class="glass-panel text-center fade-in" style="max-width: 600px; margin: 4rem auto;">
        <h2 style="color:var(--neon-red); margin-bottom: 2rem;">[긴급 경보] 악의 조직 침략!</h2>
        <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">${state.boss.org}</h3>
        <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 1rem; color: var(--text-muted);">
            ${state.boss.introText}
        </p>
        <div style="background:rgba(255,255,255,0.1); padding: 1rem; border-radius:8px; margin-bottom: 2rem;">
            <p style="color:var(--neon-yellow); font-weight:bold; margin-bottom:0.5rem;">[분석 완료] 권장 파티 스테이터스</p>
            <p style="color:white; font-size:1.1rem;">주요 요구 스탯: <strong>${topStats}</strong></p>
            <p style="color:var(--text-muted); font-size:0.9rem; margin-top:0.5rem;">경매 페이즈에서 해당 스탯이 높은 멤버를 우선적으로 영입하세요!</p>
        </div>
        <button class="btn btn-primary" onclick="goToRedCustom()">전대 결성하기</button>
    </div>
    `;
}

// --- Phase 0: 레드 커스텀 ---
window.changeStat = function(stat, delta) {
    const currentTotal = state.red.combat + state.red.mental + state.red.teamwork + state.red.support;
    if (delta > 0 && currentTotal >= 12) return;
    if (delta < 0 && state.red[stat] <= 1) return;
    state.red[stat] += delta;
    updatePhase0UI();
}

window.toggleTheme = function(theme) {
    const idx = state.red.prefThemes.indexOf(theme);
    if (idx > -1) state.red.prefThemes.splice(idx, 1);
    else if (state.red.prefThemes.length < 3) state.red.prefThemes.push(theme);
    updatePhase0UI();
}

function updatePhase0UI() {
    const total = state.red.combat + state.red.mental + state.red.teamwork + state.red.support;
    const remain = 12 - total;
    document.getElementById('remain-points').innerText = `잔여 포인트: ${remain}`;
    ['combat', 'mental', 'teamwork', 'support'].forEach(s => { document.getElementById(`stat-${s}`).innerText = state.red[s]; });
    document.getElementById('theme-buttons').innerHTML = THEMES.map(t => {
        const isSel = state.red.prefThemes.includes(t);
        return `<button class="btn btn-small ${isSel ? 'btn-primary' : ''}" style="margin:0.2rem;" onclick="toggleTheme('${t}')">${t}</button>`;
    }).join('');
    const startBtn = document.getElementById('start-preview-btn');
    startBtn.disabled = (remain > 0 || state.red.prefThemes.length === 0);
}

window.startPreviewPhase = function() {
    // 20인 추출 로직 (동일 색상 최대 4인)
    let pool = [...GAME_DATA.fullMemberPool].sort(() => 0.5 - Math.random());
    let selected = [];
    let colorCounts = {};
    for (let m of pool) {
        if (!colorCounts[m.color]) colorCounts[m.color] = 0;
        if (colorCounts[m.color] < 4) {
            colorCounts[m.color]++;
            selected.push(m);
        }
        if (selected.length === 20) break;
    }
    state.auctionPool = selected;

    // 라이벌 3명 선정
    let shuffledReds = [...GAME_DATA.reds].sort(() => 0.5 - Math.random());
    state.npcRivals = shuffledReds.slice(0, 3).map(r => ({ ...r, gold: 500, team: [], lastRollText: null, energy: 100, vp: 0 }));

    state.phase = 0.5;
    render();
}

function renderPhase0() {
    const total = state.red.combat + state.red.mental + state.red.teamwork + state.red.support;
    const remain = 12 - total;
    return `
    <h1 class="title-glow fade-in">전대 전개!</h1>
    <div class="glass-panel fade-in" style="max-width: 600px; margin: 0 auto;">
        <h2 class="text-center">당신만의 레드를 생성하세요</h2>
        <div class="points-display" id="remain-points">잔여 포인트: ${remain}</div>
        
        <div class="grid-container" style="gap:1rem; margin-bottom: 2rem;">
            ${['combat', 'mental', 'teamwork', 'support'].map((s, i) => `
                <div class="card text-center" style="padding: 1rem;">
                    <h4>${['전투', '정신', '팀웍', '지원'][i]}</h4>
                    <div class="stat-controls" style="justify-content:center; margin-top:0.5rem;">
                        <button class="btn btn-small" onclick="changeStat('${s}', -1)">-</button>
                        <span id="stat-${s}" style="font-size:1.2rem; font-weight:bold">${state.red[s]}</span>
                        <button class="btn btn-small" onclick="changeStat('${s}', 1)">+</button>
                    </div>
                </div>
            `).join('')}
        </div>

        <h3 class="mt-2 text-center">선호 테마 선택 (최대 3개)</h3>
        <div class="theme-tags" id="theme-buttons" style="justify-content:center;">
            ${THEMES.map(t => `<button class="btn btn-small ${state.red.prefThemes.includes(t) ? 'btn-primary' : ''}" style="margin:0.2rem;" onclick="toggleTheme('${t}')">${t}</button>`).join('')}
        </div>

        <div class="text-center mt-2">
            <button id="start-preview-btn" class="btn btn-primary" style="width: 100%; font-size: 1.2rem;" 
                ${remain > 0 || state.red.prefThemes.length === 0 ? 'disabled' : ''} 
                onclick="startPreviewPhase()">경매 프리뷰 보기</button>
        </div>
    </div>`;
}

// --- Phase 0.5: 프리뷰 ---
window.startAuctionPhase = function() {
    state.phase = 1;
    log(`[시스템] 커스텀 레드가 생성되었습니다.`);
    state.npcRivals.forEach(r => log(`[경쟁자] ${r.name}이(가) 경매에 참여합니다!`));
    nextAuctionItem();
}

window.skipAuctionPhase = function() {
    let pool = [...state.auctionPool].sort(() => 0.5 - Math.random());
    let teams = [state, ...state.npcRivals];
    
    for (let i = 0; i < 5; i++) {
        for (let team of teams) {
            let memberIdx = pool.findIndex(m => !team.team.some(tm => tm.color === m.color));
            if (memberIdx !== -1) {
                team.team.push(pool.splice(memberIdx, 1)[0]);
            } else {
                team.team.push(pool.splice(0, 1)[0]);
            }
            team.gold -= (Math.floor(Math.random() * 20) + 30);
        }
    }
    
    log(`[시스템] 경매가 스킵되고 멤버가 자동 배정되었습니다.`);
    state.phase = 1.6;
    render();
}

function renderPhase0_5() {
    return `
    <h2 class="text-center mb-2 fade-in">경매 출품 명단 (총 20명)</h2>
    <div class="glass-panel fade-in text-center" style="margin-bottom: 2rem; padding: 1rem;">
        <h3 style="color:var(--neon-yellow); margin-bottom:0.5rem;">[안내] 경매 페이즈</h3>
        <p>각 전대가 자금을 사용하여 원하는 멤버를 낙찰받습니다. NPC들은 각자의 선호 테마와 스탯에 맞춰 전략적으로 입찰합니다.</p>
        <p>한정된 자금(500G)과 5개의 슬롯을 효율적으로 분배하여 최고의 전대를 구성하세요!</p>
    </div>
    <div class="grid-container fade-in" style="gap: 1rem;">
        ${state.auctionPool.map((m, idx) => `
            <div class="card" style="padding: 1rem; text-align: center;">
                ${getCharAvatarHTML(m, 'small')}
                <h4 style="font-size:1rem; margin-bottom:0.2rem;">${m.name}</h4>
                <p style="font-size:0.8rem; color:var(--text-muted);">${m.theme} ${m.color}</p>
                ${getMemberStatTable(m.stats)}
            </div>
        `).join('')}
    </div>
    <div class="text-center mt-2 fade-in">
        <button class="btn btn-primary" style="font-size: 1.5rem; padding: 1rem 3rem;" onclick="startAuctionPhase()">경매 시작!</button>
        <button class="btn" style="font-size: 1.2rem; padding: 1rem 2rem; margin-left: 1rem; border-color:var(--neon-yellow); color:var(--neon-yellow)" onclick="skipAuctionPhase()">경매 스킵 (자동 배정)</button>
    </div>
    `;
}

// --- Phase 1: 경매 ---
window.nextAuctionItem = function() {
    if (state.auctionInterval) clearInterval(state.auctionInterval);
    state.recruitChat = null;
    if (state.team.length >= 5 || state.currentAuctionIndex >= state.auctionPool.length) {
        endAuctionPhase();
        return;
    }
    state.currentBid = 10;
    state.highestBidder = null;
    state.auctionTimer = 10.0;
    const member = state.auctionPool[state.currentAuctionIndex];
    log(`[경매] #${state.currentAuctionIndex + 1} 출품: ${member.name} (${member.theme} ${member.color})`);
    render();
    state.auctionInterval = setInterval(auctionTick, 100);
}

function calculateNPCIS(npc, member) {
    let IS = 0;
    let maxStat = Math.max(...member.stats);
    let typeIndex = { "combat": 0, "mental": 1, "teamwork": 2, "support": 3 };
    let npcPrefIdx = typeIndex[npc.prefStat];
    
    if (member.stats[npcPrefIdx] === maxStat) IS += 1;
    if (npc.prefThemes.includes(member.theme)) IS += 1;
    if (member.isLegend) IS += 2;
    if (npc.team.some(m => m.color === member.color)) IS -= 5;
    
    let sumStats = member.stats.reduce((a,b)=>a+b, 0);
    if (state.currentBid <= sumStats * 5) IS += 1;
    if (IS === 1 && state.currentBid >= sumStats * 5) IS -= 1;
    
    if (npc.team.length >= 5) IS = -99;
    if (npc.gold < state.currentBid + 5) IS = -99;
    return IS;
}

function auctionTick() {
    state.auctionTimer -= 0.1;
    
    const bar = document.getElementById('auction-timer-bar');
    if (bar) {
        let pct = (state.auctionTimer / 10.0) * 100;
        bar.style.width = `${pct}%`;
        bar.style.backgroundColor = state.auctionTimer < 3 ? 'var(--neon-red)' : 'var(--neon-green)';
    }

    if (state.auctionTimer > 0 && Math.random() < 0.05) {
        const member = state.auctionPool[state.currentAuctionIndex];
        let randomNpcIndex = Math.floor(Math.random() * 3);
        let npc = state.npcRivals[randomNpcIndex];
        
        if (state.highestBidder !== npc.id) {
            let IS = calculateNPCIS(npc, member);
            if (IS > 0) {
                let roll = rollDice(6);
                let willBid = false;
                
                if (IS === 1 && roll >= 4) willBid = true;
                else if (IS === 2) {
                    if (state.currentBid <= 100 && roll >= 2) willBid = true;
                    if (state.currentBid > 100 && roll >= 5) willBid = true;
                } else if (IS >= 3) {
                    if (state.currentBid <= 100) willBid = true;
                    if (state.currentBid > 100 && roll >= 3) willBid = true;
                }

                if (willBid) {
                    state.currentBid += 5;
                    state.highestBidder = npc.id;
                    state.auctionTimer = 10.0;
                    npc.lastRollText = `🎲[${roll}] 입찰! (+5G)`;
                    log(`[입찰] ${npc.name}이(가) 주사위[${roll}]로 ${state.currentBid}G를 불렀습니다!`);
                } else {
                    npc.lastRollText = `🎲[${roll}] 포기..`;
                }
                
                // 임시 텍스트 노출 및 재렌더링
                render();
                setTimeout(() => { npc.lastRollText = null; render(); }, 1000);
            }
        }
    }

    if (state.auctionTimer <= 0) {
        clearInterval(state.auctionInterval);
        resolveAuctionItem();
    }
}



window.skipCurrentAuction = function() {
    clearInterval(state.auctionInterval);
    const member = state.auctionPool[state.currentAuctionIndex];
    const statSum = member.stats.reduce((a,b)=>a+b, 0);
    const price = statSum * 5;

    let availableNPCs = state.npcRivals.filter(npc => 
        !npc.team.some(m => m.color === member.color) && npc.team.length < 5
    );
    
    if (availableNPCs.length > 0) {
        let npc = availableNPCs[Math.floor(Math.random() * availableNPCs.length)];
        npc.gold -= price;
        npc.team.push(member);
        log(`[패스] ${npc.name}이(가) ${price}G에 ${member.name}을(를) 영입했습니다.`);
    } else {
        log(`[패스] 조건에 맞는 전대가 없어 유찰되었습니다.`);
    }

    state.currentAuctionIndex++;
    setTimeout(window.nextAuctionItem, 2000);
    render();
}

window.playerBid = function() {
    if (state.team.length >= 5) {
        alert("이미 5명의 팀원을 모두 구성했습니다!");
        return;
    }
    const member = state.auctionPool[state.currentAuctionIndex];
    if (state.team.some(m => m.color === member.color)) {
        alert("이미 같은 색상의 멤버를 보유하고 있습니다!");
        return;
    }
    if (state.gold >= state.currentBid + 5) {
        state.currentBid += 5;
        state.highestBidder = 'player';
        state.auctionTimer = 10.0;
        log(`[입찰] 플레이어가 ${state.currentBid}G를 불렀습니다!`);
        render();
    }
}

function resolveAuctionItem() {
    const member = state.auctionPool[state.currentAuctionIndex];
    if (state.highestBidder === 'player') {
        state.gold -= state.currentBid;
        state.team.push(member);
        state.recruitChat = member;
        log(`[낙찰] 플레이어가 ${member.name} 카드를 ${state.currentBid}G에 낙찰받았습니다!`);
    } else if (state.highestBidder !== null) {
        let npc = state.npcRivals.find(r => r.id === state.highestBidder);
        if (npc) {
            npc.gold -= state.currentBid;
            npc.team.push(member);
            log(`[낙찰] ${npc.name}이(가) 카드를 ${state.currentBid}G에 가져갑니다.`);
        }
    } else {
        log(`[유찰] 아무도 입찰하지 않았습니다.`);
    }
    
    state.currentAuctionIndex++;
    setTimeout(window.nextAuctionItem, 2000);
    render();
}

function endAuctionPhase() {
    log(`[시스템] 경매 페이즈가 종료되었습니다. 남은 멤버를 배정합니다.`);
    
    let allAssignedMembers = new Set();
    state.team.forEach(m => allAssignedMembers.add(m.id));
    state.npcRivals.forEach(npc => npc.team.forEach(m => allAssignedMembers.add(m.id)));
    
    let unassignedPool = state.auctionPool.filter(m => !allAssignedMembers.has(m.id));
    unassignedPool.sort(() => 0.5 - Math.random());
    
    let teams = [state, ...state.npcRivals];
    
    for (let team of teams) {
        while (team.team.length < 5) {
            let memberIdx = unassignedPool.findIndex(m => !team.team.some(tm => tm.color === m.color));
            
            if (memberIdx !== -1) {
                let selectedMember = unassignedPool.splice(memberIdx, 1)[0];
                team.team.push(selectedMember);
            } else {
                let currentAssigned = new Set();
                teams.forEach(t => t.team.forEach(tm => currentAssigned.add(tm.id)));
                
                let validPulls = GAME_DATA.fullMemberPool.filter(m => 
                    !currentAssigned.has(m.id) && 
                    !team.team.some(tm => tm.color === m.color)
                );
                
                if (validPulls.length > 0) {
                    validPulls.sort(() => 0.5 - Math.random());
                    team.team.push(validPulls[0]);
                }
                
                if (unassignedPool.length > 0) {
                    unassignedPool.shift(); 
                }
            }
        }
    }

    state.phase = 1.5;
    state.eventDeck = [...GAME_DATA.events].sort(() => 0.5 - Math.random()).slice(0, 5);
    state.currentEventIndex = 0;
    render();
}

window.startEventPhase = function() {
    state.phase = 2;
    render();
}



function renderPhase1() {
    if (state.currentAuctionIndex >= state.auctionPool.length) return `<h2 class="text-center">경매 종료 중...</h2>`;
    const member = state.auctionPool[state.currentAuctionIndex];
    const statSum = member.stats.reduce((a,b)=>a+b, 0);
    
    let bidderName = "없음";
    if (state.highestBidder === 'player') bidderName = `<span style="color:var(--neon-blue)">플레이어</span>`;
    else if (state.highestBidder !== null) {
        let npc = state.npcRivals.find(r => r.id === state.highestBidder);
        bidderName = `<span style="color:var(--neon-red)">${npc ? npc.name : ''}</span>`;
    }

    const hasSameColor = state.team.some(m => m.color === member.color);

    return `
    <h2 class="text-center mb-2">실시간 경매 (남은 슬롯: ${5 - state.team.length})</h2>
    
    <div class="rivals-grid">
        ${state.npcRivals.map(npc => `
            <div class="rival-card ${state.highestBidder === npc.id ? 'active-bidder' : ''}" style="position:relative;">
                ${npc.lastRollText ? `<div class="roll-badge">${npc.lastRollText}</div>` : ''}
                <h4 style="color:var(--neon-pink)">${npc.name}</h4>
                <div class="mt-2 text-sm" style="font-size:0.8rem">
                    <div>자금: <span style="color:var(--neon-yellow)">${npc.gold}G</span></div>
                    <div>팀원: ${npc.team.length}/5 <span style="color:var(--neon-blue)">${getStatString(npc.team, npc)}</span></div>
                    <div style="display:flex; gap:0.2rem; margin-top:0.2rem">
                        ${npc.team.map(m => `<div class="color-indicator c-${m.color}" style="width:12px;height:12px;margin:0" title="${m.name}"></div>`).join('')}
                    </div>
                    <div style="color:var(--text-muted); margin-top:0.2rem">선호: ${npc.prefThemes.join(',')} / ${npc.prefStat}</div>
                </div>
            </div>
        `).join('')}
    </div>

    <div class="glass-panel text-center">
        <h3>출품 번호: #${state.currentAuctionIndex + 1} / 20</h3>
        <div class="card" style="max-width: 300px; margin: 1rem auto; display: block;">
            ${getCharAvatarHTML(member)}
            <h3 style="margin-bottom: 0.2rem">${member.name}</h3>
            <p style="color:var(--text-muted); margin-bottom: 0.5rem">${member.theme} ${member.color}</p>
            ${member.isSpecial ? '<span class="tag" style="background:var(--neon-pink)">스페셜</span>' : ''}
            ${member.isLegend ? '<span class="tag" style="background:var(--neon-yellow); color:black;">레전드</span>' : ''}
            <div class="mt-2 text-left">
                ${getMemberStatTable(member.stats)}
                <div class="stat-row" style="margin-top:0.5rem; justify-content:center; background:rgba(255,255,255,0.1); padding:0.5rem; border-radius:6px;">
                    <span style="color:var(--neon-yellow)">스탯 총합</span><span style="font-weight:bold;">${statSum}</span>
                </div>
            </div>
        </div>
        
        <div class="timer-container"><div id="auction-timer-bar" class="timer-bar" style="width: ${state.auctionTimer*10}%"></div></div>
        
        <div class="mt-2">
            <h2 style="color: var(--neon-yellow); font-size:2.5rem;">${state.currentBid}G</h2>
            <p style="font-size:1.2rem">최고 입찰자: ${bidderName}</p>
        </div>
        
        ${state.recruitChat ? `
        <div class="chat-container c-${state.recruitChat.color}">
            <div class="chat-avatar" style="background-color: var(--c-${state.recruitChat.color})">${state.recruitChat.name.substring(0,1)}</div>
            <div class="chat-bubble">
                <div class="chat-name">${state.recruitChat.name}</div>
                ${state.recruitChat.recruitQuote}
            </div>
        </div>
        ` : ''}

        <div class="mt-2" style="display:flex; justify-content:center; gap:1rem">
            <button class="btn btn-primary" style="font-size: 1.5rem; padding: 1rem 3rem;" 
                onclick="playerBid()" ${state.team.length >= 5 || state.gold < state.currentBid + 5 || hasSameColor ? 'disabled' : ''}>
                ${state.team.length >= 5 ? '편성 완료' : (hasSameColor ? '중복 색상 불가' : '+5G 입찰!')}
            </button>
            <button class="btn" style="font-size: 1.5rem; padding: 1rem 2rem; border-color:var(--neon-red); color:var(--neon-red)" 
                onclick="skipCurrentAuction()">
                패스
            </button>
        </div>
    </div>
    
    ${state.team.length > 0 ? `
    <h3 class="mt-2">내 전대 현황 <span style="color:var(--neon-blue)">${getStatString(state.team, state.red)}</span></h3>
    <div class="grid-container" style="gap:0.5rem; margin-top:1rem;">
        ${state.team.map(m => `
            <div class="card" style="padding:0.5rem; text-align:center">
                ${getCharAvatarHTML(m, 'small')}
                <div style="font-size:0.8rem; font-weight:bold;">${m.name}</div>
            </div>
        `).join('')}
    </div>
    ` : ''}
    `;
}



window.submitTeamName = function() {
    const input = document.getElementById('team-name-input').value.trim();
    if (input) state.teamName = input;
    state.phase = 1.8;
    log(`[시스템] '${state.teamName}' 전대 결성!`);
    render();
}

window.finishNaming = function() {
    state.phase = 1.5;
    state.eventDeck = [...GAME_DATA.events].sort(() => 0.5 - Math.random()).slice(0, 5);
    state.currentEventIndex = 0;
    render();
}

function renderPhase1_6() {
    return `
    <h2 class="text-center mb-2 fade-in">전대 결성 완료!</h2>
    <div class="glass-panel text-center fade-in" style="max-width:500px; margin: 0 auto;">
        <h3 style="margin-bottom:1rem; color:var(--neon-yellow);">우리 전대의 이름을 정해주세요</h3>
        <input type="text" id="team-name-input" class="team-name-input" value="${state.teamName}" style="width:80%; padding:0.8rem; font-size:1.2rem; background:rgba(0,0,0,0.5); color:white; border:1px solid var(--neon-blue); border-radius:8px; text-align:center; margin-bottom:1.5rem;">
        <div>
            <button class="btn btn-primary" onclick="submitTeamName()">결정</button>
        </div>
    </div>
    `;
}

function renderPhase1_8() {
    const redHtml = `
    <div class="chat-container c-레드">
        <div class="chat-avatar">${getCharAvatarHTML(state.red)}</div>
        <div class="chat-bubble">
            <div class="chat-name">${state.red.name}</div>
            좋아! ${state.teamName} 전대, 정의를 위해 불태워보자! 우리의 유대를 보여주겠어!
        </div>
    </div>`;
    
    const teamHtml = state.team.map(m => {
        let quote = m.namingQuote || "";
        quote = quote.replace(/\[NAME\]/g, state.teamName);
        return `
        <div class="chat-container c-${m.color}">
            <div class="chat-avatar">${getCharAvatarHTML(m)}</div>
            <div class="chat-bubble">
                <div class="chat-name">${m.name}</div>
                ${quote}
            </div>
        </div>`;
    }).join('');

    return `
    <h2 class="text-center mb-2 fade-in">${state.teamName} 전대 출동 준비!</h2>
    <div class="fade-in">
        ${redHtml}
        ${teamHtml}
    </div>
    <div class="text-center mt-2 fade-in">
        <button class="btn btn-primary" style="padding:1rem 2rem; font-size:1.2rem;" onclick="finishNaming()">본격적인 활동 시작</button>
    </div>
    `;
}

window.startEventPhase = function() {
    state.phase = 2.0;
    state.eventChoices = [...GAME_DATA.events].sort(() => 0.5 - Math.random()).slice(0, 3);
    render();
}

function renderPhase1_5() {
    return `
    <h2 class="text-center mb-2 fade-in">Day ${state.day} 시작 대기</h2>
    <div class="glass-panel fade-in text-center" style="margin-bottom: 2rem; padding: 2rem;">
        <h3 style="color:var(--neon-yellow); margin-bottom:1rem;">[안내] 일상 이벤트 페이즈</h3>
        <p style="margin-bottom:0.5rem;">전대원들이 일상을 보내며 유대를 다집니다.</p>
        <p style="margin-bottom:0.5rem;">요구되는 판정 타입(전투력, 정신력, 팀워크, 전투 지원)에 해당하는 아군의 스탯 합과 주사위(2d6)를 더해 난이도를 극복하세요.</p>
        <p style="margin-bottom:1rem;">성공 시 <strong>각성 토큰</strong>을 획득합니다. 같은 토큰을 2개 모으면 해당 스탯이 영구적으로 3 오릅니다.</p>
        <button class="btn btn-primary" style="font-size: 1.2rem; padding: 0.8rem 2rem;" onclick="startEventPhase()">Day ${state.day} 일상 시작</button>
    </div>
    `;
}

function renderPhase2() {
    return `
    <h2 class="text-center mb-2 fade-in">일상 이벤트 선택 (Day ${state.day})</h2>
    <div class="glass-panel text-center fade-in">
        <h3 style="color: var(--neon-pink); margin-bottom:1rem;">어떤 일상을 보낼까요?</h3>
        <div class="grid-container" style="gap:1rem;">
            ${state.eventChoices.map((event, idx) => `
                <div class="card" style="padding:1.5rem; cursor:pointer; border-color:var(--neon-blue);" onclick="selectEvent(${idx})">
                    <h4 style="color:var(--neon-blue); font-size:1.2rem; margin-bottom:0.5rem;">${event.name} [${event.type}]</h4>
                    <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:1rem;">${event.desc}</p>
                    <div style="font-weight:bold; font-size:1.1rem; color:var(--neon-yellow);">난이도(D): ${event.diff}</div>
                </div>
            `).join('')}
        </div>
    </div>`;
}

window.selectEvent = function(idx) {
    state.currentEvent = state.eventChoices[idx];
    state.phase = 2.1;
    state.diceRolling = true;
    state.diceStopping = false;
    state.pendingRolls = { player: [rollDice(), rollDice()] };
    render();
    
    setTimeout(() => {
        state.diceRolling = false;
        state.diceStopping = true;
        render();
        setTimeout(() => {
            state.diceStopping = false;
            resolveEvent();
        }, 1000);
    }, 1000);
}

window.resolveEvent = function() {
    const event = state.currentEvent;
    const typeIndex = { "ATK": 0, "WILL": 1, "TEAM": 2, "SUP": 3 };
    const typeNames = { "ATK": "combat", "WILL": "mental", "TEAM": "teamwork", "SUP": "support" };
    const statIdx = typeIndex[event.type];
    const statName = typeNames[event.type];

    let teamStatSum = state.team.reduce((acc, m) => acc + m.stats[statIdx], 0);
    let redStat = statIdx === 0 ? state.red.combat : statIdx === 1 ? state.red.mental : statIdx === 2 ? state.red.teamwork : state.red.support;
    redStat += state.tokenBonuses[statName];

    let dice1 = state.pendingRolls.player[0];
    let dice2 = state.pendingRolls.player[1];
    let diceSum = dice1 + dice2;
    let total = teamStatSum + redStat + diceSum;
    let success = total >= event.diff;
    state.eventNarrativeText = success ? event.successNarrative : event.failNarrative;

    state.eventResult = { dice1, dice2, total, success, type: event.type, statName };
    
    log(`[일상] ${event.name} 판정: 팀(${teamStatSum}) + 레드(${redStat}) + 주사위(${diceSum}) = ${total}`);
    if (success) {
        state.tokens[statName]++;
        if (state.team.length > 0) state.eventChat = state.team[Math.floor(Math.random() * state.team.length)];
        log(`[성공] ${event.type} 토큰 1개 획득! (현재 ${state.tokens[statName]}개)`);
        
        if (state.tokens[statName] >= 2) {
            state.tokens[statName] -= 2;
            state.tokenBonuses[statName] += 3;
            log(`[각성!] ${event.type} 토큰 2개를 소모하여 해당 스탯 총합이 영구적으로 3 올랐습니다!`);
        }
    } else {
        log(`[실패] 판정 실패.`);
    }

    render();
}

function renderPhase2_1() {
    if (state.diceRolling || state.diceStopping) {
        let roll1 = state.pendingRolls.player[0];
        let roll2 = state.pendingRolls.player[1];
        let isRolling = state.diceRolling;
        return `
        <h2 class="text-center mb-2 fade-in">일상 판정 중...</h2>
        <div class="glass-panel text-center" style="padding:4rem;">
            <div style="display:flex; justify-content:center; gap:2rem; margin-bottom:2rem;">
                ${getDiceHTML(roll1, isRolling, false)}
                ${getDiceHTML(roll2, isRolling, false)}
            </div>
            <h3 class="mt-2" style="color:var(--neon-yellow);">${isRolling ? '주사위를 굴리고 있습니다...' : '결과 확인 중!'}</h3>
        </div>
        `;
    }

    const res = state.eventResult;
    return `
    <h2 class="text-center mb-2 fade-in">일상 판정 결과</h2>
    <div class="glass-panel text-center fade-in" style="padding:2rem;">
        <h3 style="color:var(--neon-blue); margin-bottom:1rem; display:flex; justify-content:center; align-items:center; gap:0.5rem;">
            결과: ${getDiceHTML(res.dice1, false, true)} + ${getDiceHTML(res.dice2, false, true)} = ${res.dice1 + res.dice2}
        </h3>
        <h2 style="margin-bottom:1rem;">최종 합산: <span style="color:var(--neon-yellow);">${res.total}</span> vs 난이도 <span style="color:var(--neon-pink);">${state.currentEvent.diff}</span></h2>
        <p style="font-size:1.1rem; line-height:1.5; margin:1.5rem 0; color:white;">${state.eventNarrativeText}</p>
        
        ${res.success 
            ? `<h2 style="color:var(--neon-yellow); margin-bottom:1rem; font-size:2rem;">대성공!</h2>
               <p style="font-size:1.2rem; color:var(--text-muted);">[${res.type}] 토큰을 획득했습니다.</p>`
            : `<h2 style="color:var(--neon-red); margin-bottom:1rem; font-size:2rem;">실패...</h2>
               <p style="font-size:1.2rem; color:var(--text-muted);">아무것도 얻지 못했습니다.</p>`
        }
        
        ${state.eventChat ? `
        <div class="chat-container c-${state.eventChat.color}">
            <div class="chat-avatar" style="background-color: var(--c-${state.eventChat.color})">${state.eventChat.name.substring(0,1)}</div>
            <div class="chat-bubble">
                <div class="chat-name">${state.eventChat.name}</div>
                ${res.success ? state.eventChat.eventQuote : state.eventChat.defeatQuote}
            </div>
        </div>
        ` : ''}
        
        <button class="btn btn-primary mt-2" style="font-size: 1.2rem; padding: 0.8rem 2rem;" onclick="prepareMonsterPhase()">다음으로</button>
    </div>
    `;
}

window.prepareMonsterPhase = function() {
    state.eventChat = null;
    state.combatChat = null;
    if (state.day >= state.maxDays) {
        prepareBossPhase();
        return;
    }
    state.currentMonster = JSON.parse(JSON.stringify(GAME_DATA.monsters[Math.floor(Math.random() * GAME_DATA.monsters.length)]));
    if(state.team.length > 0) state.encounterChat = state.team[Math.floor(Math.random() * state.team.length)];
    state.currentMonster.patterns.sort(() => 0.5 - Math.random());
    state.monsterPatternIndex = 0;
    state.monsterHp = state.currentMonster.hp;
    state.phase = 2.2;
    render();
}

function renderPhase2_2() {
    return `
    <h2 class="text-center mb-2 fade-in">일반 괴인 출현!</h2>
    <div class="glass-panel fade-in text-center" style="margin-bottom: 2rem; padding: 2rem; border-color:var(--neon-red)">
        <h3 style="color:var(--neon-red); margin-bottom:1rem;">[경고] 일반 괴인 전투 (Day ${state.day})</h3>
        <p style="margin-bottom:0.5rem;"><strong>${state.currentMonster.name}</strong>이(가) 나타났습니다!</p>
        <p style="margin-bottom:1rem;">괴인의 공격 패턴 타입에 맞춰 아군의 해당 스탯 합계가 방어력으로 적용됩니다.</p>
        ${state.encounterChat ? `
        <div class="chat-container c-${state.encounterChat.color}" style="max-width: 400px; margin-top: 1rem;">
            <div class="chat-avatar">${getCharAvatarHTML(state.encounterChat)}</div>
            <div class="chat-bubble" style="font-size:0.9rem;">
                <div class="chat-name">${state.encounterChat.name}</div>
                ${state.encounterChat.encounterQuote ? state.encounterChat.encounterQuote.replace(/\[NAME\]/g, state.teamName) : ''}
            </div>
        </div>
        ` : ''}
        <button class="btn btn-primary" style="font-size: 1.2rem; padding: 0.8rem 2rem; border-color:var(--neon-red);" onclick="startMonsterPhase()">전투 돌입</button>
    </div>
    `;
}

window.startMonsterPhase = function() {
    state.phase = 2.3;
    log(`[전투] 일반 괴인 ${state.currentMonster.name} 전투 개시!`);
    render();
}

window.rollMonsterCombat = function() {
    state.phase = 2.31;
    state.combatRolling = true;
    state.combatStopping = false;
    
    let teams = [{ id: 'player' }, ...state.npcRivals];
    state.pendingRolls = {};
    for (let t of teams) {
        state.pendingRolls[t.id] = [rollDice(), rollDice()];
    }

    render();
    
    setTimeout(() => {
        state.combatRolling = false;
        state.combatStopping = true;
        render();
        setTimeout(() => {
            state.combatStopping = false;
            resolveMonsterCombat();
        }, 1000);
    }, 1000);
}

window.resolveMonsterCombat = function() {
    const pattern = state.currentMonster.patterns[state.monsterPatternIndex % state.currentMonster.patterns.length];
    const typeIndex = { "ATK": 0, "WILL": 1, "TEAM": 2, "SUP": 3 };
    const typeNames = { "ATK": "combat", "WILL": "mental", "TEAM": "teamwork", "SUP": "support" };
    const statIdx = typeIndex[pattern.type];
    const statName = typeNames[pattern.type];

    let raidResults = [];
    let teams = [{ id: 'player', name: state.red.name, team: state.team, red: state.red, energy: state.energy, vp: state.vp }];
    state.npcRivals.forEach(npc => teams.push({ id: npc.id, name: npc.name, team: npc.team, red: npc, energy: npc.energy, vp: npc.vp }));

    for (let t of teams) {
        if (t.energy <= 0) continue;

        let teamStatSum = t.team.reduce((acc, m) => acc + m.stats[statIdx], 0);
        let redStat = statIdx === 0 ? t.red.combat : statIdx === 1 ? t.red.mental : statIdx === 2 ? t.red.teamwork : t.red.support;
        if (t.id === 'player') redStat += state.tokenBonuses[statName];

        let dice1 = state.pendingRolls[t.id][0];
        let dice2 = state.pendingRolls[t.id][1];
        let diceSum = dice1 + dice2;
        let total = teamStatSum + redStat + diceSum;
        let success = total >= pattern.diff;
        
        let dmgDealt = 0;
        let dmgTaken = 0;
        let vpEarned = 0;

        if (success) {
            dmgDealt = 20 + (total - pattern.diff) * 2;
            state.monsterHp -= dmgDealt;
            vpEarned = 5 + Math.floor(dmgDealt / 5);
            if (t.id === 'player') {
                state.vp += vpEarned;
                log(`[성공] ${t.name} 팀 괴인에게 ${dmgDealt} 데미지! (+${vpEarned} VP)`);
            } else {
                let npcObj = state.npcRivals.find(r => r.id === t.id);
                npcObj.vp += vpEarned;
            }
        } else {
            dmgTaken = pattern.damage;
            if (t.id === 'player') {
                state.energy -= dmgTaken;
                log(`[피격] ${t.name} 팀 ${dmgTaken} 데미지 피격. (남은 에너지: ${state.energy})`);
            } else {
                let npcObj = state.npcRivals.find(r => r.id === t.id);
                npcObj.energy -= dmgTaken;
            }
        }

        raidResults.push({
            name: t.name,
            isPlayer: t.id === 'player',
            dice1,
            dice2,
            diceSum,
            total,
            success,
            dmgDealt,
            dmgTaken,
            vpEarned,
            energyLeft: t.id === 'player' ? state.energy : state.npcRivals.find(r => r.id === t.id).energy,
            totalVp: t.id === 'player' ? state.vp : state.npcRivals.find(r => r.id === t.id).vp
        });
    }

    state.combatResultMsg = raidResults;
    if (state.team.length > 0) {
        state.combatChat = state.team[Math.floor(Math.random() * state.team.length)];
        state.combatChatIsDefeat = state.energy <= 0;
    }
    state.monsterPatternIndex++;
    state.phase = 2.4;
    render();
}

function renderPhase2_3() {
    if (state.combatRolling || state.combatStopping) {
        let roll1 = state.pendingRolls.player[0];
        let roll2 = state.pendingRolls.player[1];
        let isRolling = state.combatRolling;
        return `
        <h2 class="text-center mb-2 fade-in">전투 판정 중...</h2>
        <div class="glass-panel text-center" style="padding:4rem;">
            <div style="display:flex; justify-content:center; gap:2rem; margin-bottom:2rem;">
                ${getDiceHTML(roll1, isRolling, false)}
                ${getDiceHTML(roll2, isRolling, false)}
            </div>
            <h3 class="mt-2" style="color:var(--neon-red);">${isRolling ? '4팀이 동시에 공격/방어 판정을 진행합니다...' : '결과 확인 중!'}</h3>
        </div>
        `;
    }

    if (state.energy <= 0) return `<h2 class="text-center" style="color:var(--neon-red)">에너지 고갈... 전멸했습니다.</h2><div class="text-center mt-2"><button class="btn btn-primary" onclick="finishGame()">결과 확인</button></div>`;
    
    const pattern = state.currentMonster.patterns[state.monsterPatternIndex % state.currentMonster.patterns.length];
    const hpPercent = Math.max(0, (state.monsterHp / state.currentMonster.hp) * 100);
    
    return `
    <h2 class="text-center mb-2">괴인 전투 (Day ${state.day})</h2>
    <div class="glass-panel text-center">
        <h3 style="color:var(--neon-red); font-size:2rem; margin-bottom:1rem;">${state.currentMonster.name}</h3>
        <div class="hp-bar-container" style="max-width:300px; margin:0 auto;"><div class="hp-bar" style="width:${hpPercent}%"></div></div>
        <p style="margin-top:0.5rem; color:var(--text-muted)">HP: ${Math.floor(state.monsterHp)} / ${state.currentMonster.hp}</p>
        
        <div class="card mt-2" style="border-color:var(--neon-red); max-width:400px; margin: 1rem auto;">
            <h3 style="color:var(--neon-pink)">괴인의 패턴: ${pattern.name} [${pattern.type}]</h3>
            <p style="font-size:1.5rem; margin-top:0.5rem; font-weight:bold;">요구 돌파력: ${pattern.diff}</p>
            <p style="color:var(--text-muted); font-size:0.9rem">실패 시 피해: ${pattern.damage}</p>
        </div>
        
        <div class="mt-2 text-center">
            <button class="btn btn-primary" style="font-size: 1.2rem; padding: 0.8rem 2rem;" onclick="rollMonsterCombat()">4팀 일제 판정 (2d6)</button>
        </div>
    </div>
    `;
}

window.nextDay = function() {
    state.day++;
    if (state.day >= state.maxDays) {
        prepareBossPhase();
    } else {
        state.phase = 1.5;
        render();
    }
}

function renderPhase2_4() {
    const isDead = state.monsterHp <= 0;
    
    let tableRows = state.combatResultMsg.map(r => `
        <tr style="${r.isPlayer ? 'background:rgba(255,255,255,0.1); font-weight:bold;' : ''}">
            <td style="padding:0.5rem;">${r.name}</td>
            <td style="padding:0.5rem;">
                <div style="display:flex; justify-content:center; align-items:center; gap:0.2rem;">
                    ${getDiceHTML(r.dice1, false, true)} ${getDiceHTML(r.dice2, false, true)} (${r.total})
                </div>
            </td>
            <td style="padding:0.5rem; color:${r.success ? 'var(--neon-yellow)' : 'var(--neon-red)'}">
                ${r.success ? `+${r.dmgDealt} DMG` : `-${r.dmgTaken} HP`}
            </td>
            <td style="padding:0.5rem;">${r.energyLeft <= 0 ? '<span style="color:red">전멸</span>' : r.energyLeft}</td>
            <td style="padding:0.5rem; color:var(--neon-blue)">+${r.vpEarned} (총 ${r.totalVp})</td>
        </tr>
    `).join('');

    return `
    <h2 class="text-center mb-2 fade-in">전투 턴 결과</h2>
    <div class="glass-panel text-center fade-in">
        <table style="width:100%; border-collapse: collapse; margin-bottom: 1rem;">
            <thead>
                <tr style="border-bottom:1px solid var(--text-muted);">
                    <th style="padding:0.5rem">팀</th>
                    <th style="padding:0.5rem">주사위(총합)</th>
                    <th style="padding:0.5rem">판정 결과</th>
                    <th style="padding:0.5rem">잔여 체력</th>
                    <th style="padding:0.5rem">VP</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
        
        ${state.combatChat ? `
        <div class="chat-container c-${state.combatChat.color}">
            <div class="chat-avatar" style="background-color: var(--c-${state.combatChat.color})">${state.combatChat.name.substring(0,1)}</div>
            <div class="chat-bubble">
                <div class="chat-name">${state.combatChat.name}</div>
                ${state.combatChatIsDefeat ? state.combatChat.defeatQuote : state.combatChat.combatQuote}
            </div>
        </div>
        ` : ''}
        
        ${isDead 
            ? `<div class="finish-blow"></div><h3 class="mt-2 shake" style="color:var(--neon-blue);">괴인을 쓰러뜨렸습니다!</h3>
               <button class="btn btn-primary mt-2" onclick="nextDay()">다음 날로</button>`
            : state.energy > 0 ? `<button class="btn btn-primary mt-2" onclick="startMonsterPhase()">다음 턴 (계속 전투)</button>` : `<button class="btn btn-primary mt-2" onclick="finishGame()">결과 확인</button>`
        }
    </div>
    `;
}

window.prepareBossPhase = function() {
    state.bossHp = state.boss.hp;
    state.bossPatternIndex = 0;
    if(state.team.length > 0) state.encounterChat = state.team[Math.floor(Math.random() * state.team.length)];
    state.boss.patterns.sort(() => 0.5 - Math.random());
    state.phase = 2.5;
    render();
}

window.startBossPhase = function() {
    state.phase = 3;
    log(`[보스전] ${state.boss.org}의 ${state.boss.name} 등장!`);
    render();
}

function renderPhase2_5() {
    return `
    <h2 class="text-center mb-2 fade-in">보스 출현 경고</h2>
    <div class="glass-panel fade-in text-center" style="margin-bottom: 2rem; padding: 2rem; border-color:var(--neon-red)">
        <h3 style="color:var(--neon-red); margin-bottom:1rem;">[안내] 보스 전투 페이즈</h3>
        <p style="margin-bottom:0.5rem;"><strong>${state.boss.org}의 ${state.boss.name}</strong>이(가) 나타났습니다!</p>
        <p style="margin-bottom:0.5rem;">보스의 공격 패턴 타입에 맞춰 아군의 해당 스탯 합계가 방어력으로 적용됩니다.</p>
        <p style="margin-bottom:1rem;">모든 에너지가 소진되기 전에 보스의 패턴을 막아내고 쓰러뜨리세요!</p>
        ${state.encounterChat ? `
        <div class="chat-container c-${state.encounterChat.color}" style="max-width: 400px; margin-top: 1rem;">
            <div class="chat-avatar">${getCharAvatarHTML(state.encounterChat)}</div>
            <div class="chat-bubble" style="font-size:0.9rem;">
                <div class="chat-name">${state.encounterChat.name}</div>
                ${state.encounterChat.encounterQuote ? state.encounterChat.encounterQuote.replace(/\[NAME\]/g, state.teamName) : ''}
            </div>
        </div>
        ` : ''}
        <button class="btn btn-primary" style="font-size: 1.2rem; padding: 0.8rem 2rem; border-color:var(--neon-red);" onclick="startBossPhase()">전투 돌입</button>
    </div>
    `;
}

window.rollBossCombat = function() {
    state.phase = 3.1;
    state.combatRolling = true;
    state.combatStopping = false;
    
    let teams = [{ id: 'player' }, ...state.npcRivals];
    state.pendingRolls = {};
    for (let t of teams) {
        state.pendingRolls[t.id] = [rollDice(), rollDice()];
    }

    render();
    
    setTimeout(() => {
        state.combatRolling = false;
        state.combatStopping = true;
        render();
        setTimeout(() => {
            state.combatStopping = false;
            resolveCombat();
        }, 1000);
    }, 1000);
}

window.resolveCombat = function() {
    const pattern = state.boss.patterns[state.bossPatternIndex % state.boss.patterns.length];
    const typeIndex = { "ATK": 0, "WILL": 1, "TEAM": 2, "SUP": 3 };
    const typeNames = { "ATK": "combat", "WILL": "mental", "TEAM": "teamwork", "SUP": "support" };
    const statIdx = typeIndex[pattern.type];
    const statName = typeNames[pattern.type];

    let raidResults = [];
    let teams = [{ id: 'player', name: state.red.name, team: state.team, red: state.red, energy: state.energy, vp: state.vp }];
    state.npcRivals.forEach(npc => teams.push({ id: npc.id, name: npc.name, team: npc.team, red: npc, energy: npc.energy, vp: npc.vp }));

    for (let t of teams) {
        if (t.energy <= 0) continue;

        let teamStatSum = t.team.reduce((acc, m) => acc + m.stats[statIdx], 0);
        let redStat = statIdx === 0 ? t.red.combat : statIdx === 1 ? t.red.mental : statIdx === 2 ? t.red.teamwork : t.red.support;
        if (t.id === 'player') redStat += state.tokenBonuses[statName];

        let dice1 = state.pendingRolls[t.id][0];
        let dice2 = state.pendingRolls[t.id][1];
        let diceRoll = dice1 + dice2;
        let resultPersonal = teamStatSum + redStat + diceRoll;
        
        let dmgDealt = 0;
        let dmgTaken = 0;
        let vpEarned = 0;

        if (resultPersonal >= pattern.diff) {
            vpEarned = 10;
            let counterDmg = Math.floor(resultPersonal * 1.5);
            state.bossHp -= counterDmg;
            vpEarned += Math.floor(counterDmg / 2);
            dmgDealt = counterDmg;

            if (t.id === 'player') {
                state.vp += vpEarned;
                log(`[방어 성공] ${t.name} 보스에게 ${counterDmg} 데미지! (+${vpEarned} VP)`);
            } else {
                let npcObj = state.npcRivals.find(r => r.id === t.id);
                npcObj.vp += vpEarned;
            }
        } else {
            let damageToTeam = Math.max(0, pattern.damage - Math.floor(resultPersonal / 10));
            dmgTaken = damageToTeam;
            let resistDmg = Math.floor(resultPersonal / 2);
            state.bossHp -= resistDmg;
            vpEarned = Math.floor(resistDmg / 2);

            if (t.id === 'player') {
                state.energy -= damageToTeam;
                state.vp += vpEarned;
                log(`[피격] ${t.name} 팀 ${damageToTeam} 데미지 피격. (남은 에너지: ${state.energy})`);
            } else {
                let npcObj = state.npcRivals.find(r => r.id === t.id);
                npcObj.energy -= damageToTeam;
                npcObj.vp += vpEarned;
            }
        }

        raidResults.push({
            name: t.name,
            isPlayer: t.id === 'player',
            dice1,
            dice2,
            diceSum: diceRoll,
            total: resultPersonal,
            success: resultPersonal >= pattern.diff,
            dmgDealt: dmgDealt > 0 ? dmgDealt : Math.floor(resultPersonal / 2),
            dmgTaken,
            vpEarned,
            energyLeft: t.id === 'player' ? state.energy : state.npcRivals.find(r => r.id === t.id).energy,
            totalVp: t.id === 'player' ? state.vp : state.npcRivals.find(r => r.id === t.id).vp
        });
    }

    if (state.bossHp <= 0) {
        raidResults.forEach(r => {
            if (r.energyLeft > 0) {
                if (r.isPlayer) state.vp += 20;
                else {
                    let npcObj = state.npcRivals.find(npc => npc.name === r.name);
                    npcObj.vp += 20;
                }
                r.totalVp += 20;
                r.vpEarned += 20;
            }
        });
    }

    state.combatResultMsg = raidResults;
    if (state.team.length > 0) {
        state.combatChat = state.team[Math.floor(Math.random() * state.team.length)];
        state.combatChatIsDefeat = state.energy <= 0;
    }
    state.bossPatternIndex++;
    state.phase = 3.2;
    render();
}

function renderPhase3() {
    if (state.combatRolling || state.combatStopping) {
        let roll1 = state.pendingRolls.player[0];
        let roll2 = state.pendingRolls.player[1];
        let isRolling = state.combatRolling;
        return `
        <h2 class="text-center mb-2 fade-in" style="color:var(--neon-red)">보스 전투 판정 중...</h2>
        <div class="glass-panel text-center" style="padding:4rem;">
            <div style="display:flex; justify-content:center; gap:2rem; margin-bottom:2rem;">
                ${getDiceHTML(roll1, isRolling, false)}
                ${getDiceHTML(roll2, isRolling, false)}
            </div>
            <h3 class="mt-2" style="color:var(--neon-red);">${isRolling ? '4팀이 동시에 보스의 패턴을 방어합니다...' : '결과 확인 중!'}</h3>
        </div>
        `;
    }

    let isGameOver = state.bossHp <= 0 || (state.energy <= 0 && state.npcRivals.every(npc => npc.energy <= 0));
    if (isGameOver) {
        return `
        <div class="glass-panel text-center fade-in">
            <h2>전투 종료</h2>
            <button class="btn btn-primary mt-2" onclick="finishGame()">결과 확인</button>
        </div>`;
    }

    const pattern = state.boss.patterns[state.bossPatternIndex % state.boss.patterns.length];
    const hpPercent = Math.max(0, (state.bossHp / state.boss.hp) * 100);
    const energyPercent = Math.max(0, (state.energy / 100) * 100);

    return `
    <h2 class="text-center mb-2 fade-in" style="color:var(--neon-red)">보스 전투</h2>
    
    <div class="boss-area fade-in">
        <h3 style="font-size: 2rem;">${state.boss.name}</h3>
        <div class="hp-bar-container"><div class="hp-bar" style="width: ${hpPercent}%"></div></div>
        <p class="mt-2">HP: ${Math.floor(state.bossHp)} / ${state.boss.hp}</p>
    </div>

    <div class="boss-area fade-in" style="margin-top: 1rem">
        <h4 style="color:var(--neon-blue)">내 팀 에너지</h4>
        <div class="hp-bar-container"><div class="hp-bar team-hp-bar" style="width: ${energyPercent}%"></div></div>
        <p class="mt-2">ENERGY: ${state.energy} / 100</p>
    </div>

    <div class="glass-panel text-center fade-in mt-2">
        <h3 style="color: var(--neon-yellow)">[패턴] ${pattern.name}</h3>
        <p>${pattern.special ? '<span class="tag" style="background:var(--neon-red)">필살기</span>' : ''} ${pattern.type} 판정 | 기본 데미지: ${pattern.damage} | 난이도: ${pattern.diff}</p>
        
        <div class="mt-2" style="display:flex; justify-content:center; gap:1rem">
            <button class="btn btn-primary" onclick="rollBossCombat()">4팀 일제 방어 (2d6)</button>
        </div>
    </div>`;
}

window.nextBossTurn = function() {
    state.phase = 3;
    render();
}

function renderPhase3_2() {
    const isDead = state.bossHp <= 0;
    
    let tableRows = state.combatResultMsg.map(r => `
        <tr style="${r.isPlayer ? 'background:rgba(255,255,255,0.1); font-weight:bold;' : ''}">
            <td style="padding:0.5rem;">${r.name}</td>
            <td style="padding:0.5rem;">
                <div style="display:flex; justify-content:center; align-items:center; gap:0.2rem;">
                    ${getDiceHTML(r.dice1, false, true)} ${getDiceHTML(r.dice2, false, true)} (${r.total})
                </div>
            </td>
            <td style="padding:0.5rem; color:${r.success ? 'var(--neon-yellow)' : 'var(--neon-red)'}">
                ${r.success ? `+${r.dmgDealt} DMG` : `-${r.dmgTaken} HP`}
            </td>
            <td style="padding:0.5rem;">${r.energyLeft <= 0 ? '<span style="color:red">전멸</span>' : r.energyLeft}</td>
            <td style="padding:0.5rem; color:var(--neon-blue)">+${r.vpEarned} (총 ${r.totalVp})</td>
        </tr>
    `).join('');

    let isGameOver = isDead || (state.energy <= 0 && state.npcRivals.every(npc => npc.energy <= 0));

    return `
    <h2 class="text-center mb-2 fade-in ${isDead ? 'shake' : ''}">보스 턴 결과</h2>
    <div class="glass-panel text-center fade-in">
        <table style="width:100%; border-collapse: collapse; margin-bottom: 1rem;">
            <thead>
                <tr style="border-bottom:1px solid var(--text-muted);">
                    <th style="padding:0.5rem">팀</th>
                    <th style="padding:0.5rem">주사위(총합)</th>
                    <th style="padding:0.5rem">판정 결과</th>
                    <th style="padding:0.5rem">잔여 체력</th>
                    <th style="padding:0.5rem">VP</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
        
        ${(isDead || state.energy <= 0) && state.team.length > 0 ? state.team.map(m => `
        <div class="chat-container c-${m.color}">
            <div class="chat-avatar">${getCharAvatarHTML(m)}</div>
            <div class="chat-bubble">
                <div class="chat-name">${m.name}</div>
                ${state.energy <= 0 ? m.defeatQuote : m.bossDefeatQuote}
            </div>
        </div>
        `).join('') : (state.combatChat ? `
        <div class="chat-container c-${state.combatChat.color}">
            <div class="chat-avatar">${getCharAvatarHTML(state.combatChat)}</div>
            <div class="chat-bubble">
                <div class="chat-name">${state.combatChat.name}</div>
                ${state.combatChatIsDefeat ? state.combatChat.defeatQuote : state.combatChat.combatQuote}
            </div>
        </div>
        ` : '')}
        
        ${isGameOver
            ? `${isDead ? '<div class="finish-blow"></div>' : ''}<h3 class="mt-2" style="color:var(--neon-blue);">전투 종료!</h3>
               <button class="btn btn-primary mt-2" onclick="finishGame()">최종 정산 확인</button>` 
            : `<button class="btn btn-primary mt-2" onclick="nextBossTurn()">다음 턴</button>`
        }
    </div>
    `;
}

window.finishGame = function() {
    state.phase = 4;
    // Calculate final VP for all teams
    let teams = [{ id: 'player', name: state.red.name, isPlayer: true, energy: state.energy, vp: state.vp, team: state.team }];
    state.npcRivals.forEach(npc => teams.push({ id: npc.id, name: npc.name, isPlayer: false, energy: npc.energy, vp: npc.vp, team: npc.team }));

    teams.forEach(t => {
        if (t.energy > 0) t.vp += Math.floor(t.energy);
        let specialCount = t.team.filter(m => m.isSpecial || m.isLegend).length;
        t.vp += specialCount * 5;
    });

    teams.sort((a, b) => b.vp - a.vp);
    state.finalRankings = teams;

    render();
}

function renderPhase4() {
    const isWin = state.bossHp <= 0;
    const isPlayerDead = state.energy <= 0;
    const title = isWin ? "최종 보스 처치 성공!" : "인류의 패배...";
    const color = isWin ? "var(--neon-green)" : "var(--neon-red)";

    let rankHtml = state.finalRankings.map((r, i) => `
        <div class="card" style="margin-bottom:0.5rem; display:flex; justify-content:space-between; align-items:center; ${r.isPlayer ? 'border-color:var(--neon-yellow); background:rgba(255,255,255,0.1);' : ''}">
            <h3 style="margin:0;">
                ${i===0 ? '🏆 1위' : i+1+'위'} 
                <span style="color:${r.isPlayer ? 'var(--neon-yellow)' : 'var(--neon-blue)'}">${r.name}</span>
            </h3>
            <div style="font-size:1.5rem; font-weight:bold;">${r.vp} VP</div>
            <div style="color:var(--text-muted)">${r.energy > 0 ? `생존 (HP ${Math.floor(r.energy)})` : '전멸'}</div>
        </div>
    `).join('');

    return `
    <div class="glass-panel text-center fade-in" style="max-width: 600px; margin: 0 auto;">
        <h1 style="color: ${color}; font-size: 3rem;">${title}</h1>
        ${isPlayerDead ? `<p style="color:var(--neon-red)">당신의 전대는 전투 중 전멸했습니다.</p>` : ''}
        
        ${(function() {
            let playerRank = state.finalRankings.findIndex(r => r.isPlayer) + 1;
            return state.team.length > 0 ? state.team.map(m => `
            <div class="chat-container c-${m.color}">
                <div class="chat-avatar" style="background-color: var(--c-${m.color})">${m.name.substring(0,1)}</div>
                <div class="chat-bubble">
                    <div class="chat-name">${m.name}</div>
                    ${isPlayerDead ? m.defeatQuote : (playerRank === 1 ? m.rank1Quote : (playerRank === 2 ? m.rank2Quote : (playerRank === 3 ? m.rank3Quote : m.rank4Quote)))}
                </div>
            </div>
            `).join('') : '';
        })()}

        <h2 class="mt-2">최종 공헌도(VP) 랭킹</h2>
        
        <div class="mt-2" style="text-align:left;">
            ${rankHtml}
        </div>
        
        <div class="mt-2"><button class="btn btn-primary" onclick="location.reload()">새 게임</button></div>
    </div>`;
}

window.onload = () => render();
