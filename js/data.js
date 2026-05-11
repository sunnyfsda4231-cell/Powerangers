// 게임 마스터 데이터

const GAME_DATA = {
    reds: [
        { id: 1, name: "밸런스 레드", combat: 3, mental: 3, teamwork: 3, support: 3, prefStat: "teamwork", prefThemes: ["마법", "동물", "음악", "경찰"] },
        { id: 2, name: "어썰트 레드", combat: 5, mental: 2, teamwork: 3, support: 2, prefStat: "combat", prefThemes: ["공룡", "닌자", "스포츠"] },
        { id: 3, name: "가디언 레드", combat: 2, mental: 5, teamwork: 3, support: 2, prefStat: "mental", prefThemes: ["우주", "음악", "신화"] },
        { id: 4, name: "서포트 레드", combat: 2, mental: 2, teamwork: 3, support: 5, prefStat: "support", prefThemes: ["음악", "신화", "사이버"] },
        { id: 5, name: "리더 레드", combat: 3, mental: 2, teamwork: 5, support: 2, prefStat: "teamwork", prefThemes: ["사이버", "경찰", "마법", "중장비"] },
        { id: 6, name: "스트라이크 레드", combat: 6, mental: 2, teamwork: 2, support: 2, prefStat: "combat", prefThemes: ["닌자", "공룡", "스포츠"] },
        { id: 7, name: "멘탈 레드", combat: 2, mental: 6, teamwork: 2, support: 2, prefStat: "mental", prefThemes: ["우주", "신화", "마법"] },
        { id: 8, name: "오퍼레이터 레드", combat: 2, mental: 2, teamwork: 2, support: 6, prefStat: "support", prefThemes: ["사이버", "경찰", "라이드"] },
        { id: 9, name: "커맨더 레드", combat: 4, mental: 3, teamwork: 4, support: 1, prefStat: "combat", prefThemes: ["라이드", "사이버", "마법", "중장비"] },
        { id: 10, name: "치프 레드", combat: 1, mental: 4, teamwork: 3, support: 4, prefStat: "support", prefThemes: ["스포츠", "라이드", "공룡", "중장비"] }
    ],
    
    events: [
        { type: "ATK", name: "시장 짐꾼", diff: 17, desc: "시장 상인들의 무거운 짐을 옮겨주며 체력을 씁니다.", successNarrative: "상인들이 고마워하며 싱싱한 과일을 한가득 주셨다! 노동의 보람이 느껴진다.", failNarrative: "짐이 너무 무거워 그만 놓치고 말았다. 다행히 다친 사람은 없지만 민망함은 덤이다." },
        { type: "ATK", name: "조깅 대회", diff: 19, desc: "전대원들과 함께 동네 마라톤 대회에 출전합니다.", successNarrative: "상위권으로 결승선을 통과하며 마을 사람들의 열렬한 응원을 받았다!", failNarrative: "중간에 페이스 조절에 실패해 꼴찌로 들어왔다. 체력 훈련이 더 필요해 보인다." },
        { type: "ATK", name: "이삿짐 센터", diff: 20, desc: "동료의 이사를 도와주며 거대 가구와 사투를 벌입니다.", successNarrative: "가구 배치를 완벽하게 끝냈다! 새집 증후군 따위는 우리의 힘으로 극복했다.", failNarrative: "계단을 오르다 소파가 끼어버렸다... 결국 사다리차를 부르고 말았다." },
        { type: "ATK", name: "날치기 추격", diff: 22, desc: "길거리에서 마주친 날치기를 잡기 위해 전력 질주합니다.", successNarrative: "바람 같은 속도로 날치기를 낚아챘다! 시민들의 박수갈채가 쏟아진다.", failNarrative: "골목길이 너무 복잡해 범인을 놓치고 말았다. 분한 마음에 주먹을 쥔다." },
        { type: "ATK", name: "동네 체육대회", diff: 23, desc: "마을 줄다리기 결승전에서 전대의 힘을 보여줍니다.", successNarrative: "압도적인 괴력으로 줄다리기 우승! 전대의 이름이 온 동네에 울려 퍼졌다.", failNarrative: "상대 팀 어르신들의 짬바이브를 이기지 못하고 속절없이 끌려가 버렸다." },
        { type: "WILL", name: "강아지 보호", diff: 17, desc: "길 잃은 강아지를 보살피며 소중함을 깨닫습니다.", successNarrative: "강아지가 원래 주인의 품으로 무사히 돌아갔다. 따뜻한 마음이 차오른다.", failNarrative: "강아지가 갑자기 도망가 버려서 온 동네를 땀나도록 뛰어다녀야 했다." },
        { type: "WILL", name: "시험 공부", diff: 18, desc: "낙제 위기 멤버의 공부를 도와주며 인내심을 기릅니다.", successNarrative: "밤샘 과외 끝에 기적적으로 낙제를 면했다! 서로 부둥켜안고 환호했다.", failNarrative: "가르치다 말고 둘 다 책상에 엎드려 자버렸다... 재시험 확정이다." },
        { type: "WILL", name: "한밤중 대화", diff: 20, desc: "리더로서 멤버의 고민을 들어주며 신뢰를 쌓습니다.", successNarrative: "속 깊은 이야기를 나누며 앙금이 풀렸다. 서로의 눈빛만 봐도 마음을 알 것 같다.", failNarrative: "조언을 해주려다 오히려 가벼운 말다툼으로 번졌다. 서먹한 아침을 맞이했다." },
        { type: "WILL", name: "진상 손님 응대", diff: 22, desc: "알바 중 무례한 손님 앞에서도 평정심을 유지합니다.", successNarrative: "미소와 논리로 진상 손님을 완벽히 돌려보냈다. 알바생들의 영웅으로 등극했다!", failNarrative: "결국 화를 참지 못하고 테이블을 내리쳤다... 사장님께 된통 혼나고 말았다." },
        { type: "WILL", name: "리더의 격려", diff: 23, desc: "절망적인 상황에서 팀원들의 전의를 다시 불태웁니다.", successNarrative: "진심 어린 외침에 팀원들의 눈동자에 다시 불꽃이 타오른다. 사기 충천!", failNarrative: "너무 뻔한 감성팔이에 다들 하품만 한다. 분위기를 띄우기가 쉽지 않다." },
        { type: "TEAM", name: "치킨 회식", diff: 17, desc: "맛있는 음식을 나눠 먹으며 어색함을 허뭅니다.", successNarrative: "마지막 남은 닭다리를 서로 양보하는 훈훈한 장면이 연출되었다. 팀워크 상승!", failNarrative: "취향 차이(순살파 vs 뼈파)로 격렬한 토론이 벌어져 회식 분위기가 싸해졌다." },
        { type: "TEAM", name: "노래방 타임", diff: 18, desc: "다 함께 노래를 부르며 완벽한 호흡을 맞춥니다.", successNarrative: "완벽한 화음과 칼군무 탬버린으로 100점을 받았다! 우리는 환상의 그룹이다.", failNarrative: "서로 고음을 지르려다 마이크가 혼선을 빚어 고막 테러만 당했다." },
        { type: "TEAM", name: "놀이공원", diff: 20, desc: "무서운 놀이기구를 함께 타며 동질감을 느낍니다.", successNarrative: "무서움을 극복하고 롤러코스터 맨 앞자리 정복! 이제 어떤 적도 두렵지 않다.", failNarrative: "기구 탑승 전부터 몇몇이 겁에 질려 도망가는 바람에 츄러스만 먹고 돌아왔다." },
        { type: "TEAM", name: "보드게임", diff: 21, desc: "사소한 게임에도 열중하며 서로의 성향을 파악합니다.", successNarrative: "고도의 심리전 끝에 웃으며 게임을 마무리했다. 서로의 전략적 사고를 이해했다.", failNarrative: "규칙을 두고 언성을 높이다 엎어버릴 뻔했다. 한동안 보드게임 금지령이 내렸다." },
        { type: "TEAM", name: "온천 여행", diff: 23, desc: "함께 온천욕을 즐기며 몸과 마음의 벽을 허뭅니다.", successNarrative: "노천탕에서 피로를 씻어내며 앞으로의 결의를 다졌다. 최고의 힐링!", failNarrative: "온천물이 너무 뜨거워 1분 만에 다들 뛰쳐나오고 말았다. 감기에 걸릴 것 같다." },
        { type: "SUP", name: "PC 수리", diff: 17, desc: "기지의 노후된 컴퓨터를 고쳐 효율을 높입니다.", successNarrative: "먼지를 털고 부품을 교체하자 PC가 날아다닌다! 정보 처리 속도가 비약적으로 올랐다.", failNarrative: "잘못 건드리는 바람에 랜섬웨어에 감염되었다... 포맷하느라 밤을 새웠다." },
        { type: "SUP", name: "특급 레시피", diff: 18, desc: "멤버들을 위한 고영양 도시락을 정성껏 준비합니다.", successNarrative: "맛과 영양을 모두 잡은 환상의 도시락! 멤버들이 냄비를 싹싹 비워냈다.", failNarrative: "소금 대신 설탕을 왕창 부어버렸다. 먹어본 멤버들의 표정이 굳어간다." },
        { type: "SUP", name: "창고 쇼핑", diff: 20, desc: "할인 매장에서 전투에 유용한 소모품을 챙깁니다.", successNarrative: "마감 세일을 노려 특급 회복약과 폭탄을 반값에 쓸어 담았다! 가성비 최고!", failNarrative: "충동구매로 쓸모없는 장난감만 잔뜩 사버렸다. 예산이 낭비되었다." },
        { type: "SUP", name: "DIY 가구 조립", diff: 22, desc: "복잡한 가구를 함께 만들며 분석력을 발휘합니다.", successNarrative: "설명서를 완벽히 해독해 튼튼하고 멋진 작전용 테이블을 완성했다!", failNarrative: "다 조립하고 나니 나사가 3개나 남았다... 테이블 다리가 위태롭게 흔들린다." },
        { type: "SUP", name: "구급함 정비", diff: 23, desc: "만약의 부상을 대비해 의료 물품을 완벽히 세팅합니다.", successNarrative: "유통기한을 확인하고 최신 지혈제까지 완벽히 세팅 완료. 든든한 보험이 생겼다.", failNarrative: "정비 도중 실수로 아까운 연막탄을 터뜨려 기지가 한바탕 난리가 났다." }
    ],

    monsters: [
        { name: "고철 로봇", hp: 270, patterns: [
            { type: "ATK", diff: 18, damage: 15, name: "고철 주먹" },
            { type: "SUP", diff: 17, damage: 13, name: "잔해 던지기" },
            { type: "TEAM", diff: 19, damage: 16, name: "합체 고철빔" }
        ]},
        { name: "환영술사", hp: 248, patterns: [
            { type: "WILL", diff: 17, damage: 12, name: "환영의 춤" },
            { type: "TEAM", diff: 18, damage: 14, name: "분신 공격" },
            { type: "SUP", diff: 16, damage: 10, name: "거짓된 이정표" }
        ]},
        { name: "거대 슬라임", hp: 315, patterns: [
            { type: "TEAM", diff: 19, damage: 18, name: "끈적한 포옹" },
            { type: "ATK", diff: 20, damage: 20, name: "점액 덩어리 투척" },
            { type: "WILL", diff: 18, damage: 15, name: "강산성 가스" }
        ]},
        { name: "맹독 포자", hp: 293, patterns: [
            { type: "SUP", diff: 18, damage: 14, name: "독안개 분사" },
            { type: "WILL", diff: 19, damage: 15, name: "신경 마비 독" },
            { type: "ATK", diff: 21, damage: 18, name: "가시 덩굴 채찍" }
        ]},
        { name: "강화 기계병", hp: 338, patterns: [
            { type: "ATK", diff: 21, damage: 20, name: "에너지 캐논" },
            { type: "SUP", diff: 19, damage: 16, name: "목표 록온" },
            { type: "TEAM", diff: 22, damage: 21, name: "과열 폭발" }
        ]},
        { name: "악몽의 정령", hp: 293, patterns: [
            { type: "WILL", diff: 20, damage: 15, name: "악몽 주입" },
            { type: "TEAM", diff: 21, damage: 18, name: "공포의 메아리" },
            { type: "SUP", diff: 19, damage: 14, name: "시야 차단" }
        ]},
        { name: "쌍두 오크", hp: 383, patterns: [
            { type: "TEAM", diff: 22, damage: 22, name: "양방향 휩쓸기" },
            { type: "ATK", diff: 24, damage: 25, name: "대형 철퇴 강타" },
            { type: "WILL", diff: 20, damage: 18, name: "전투의 함성" }
        ]},
        { name: "해킹 드론", hp: 315, patterns: [
            { type: "SUP", diff: 21, damage: 16, name: "시스템 마비" },
            { type: "WILL", diff: 20, damage: 15, name: "교란 전파" },
            { type: "TEAM", diff: 23, damage: 20, name: "동기화 오류" }
        ]},
        { name: "광폭화 고릴라", hp: 405, patterns: [
            { type: "ATK", diff: 23, damage: 25, name: "대지 강타" },
            { type: "TEAM", diff: 24, damage: 26, name: "무차별 난동" },
            { type: "WILL", diff: 22, damage: 20, name: "위협적인 포효" }
        ]},
        { name: "절망의 눈", hp: 360, patterns: [
            { type: "WILL", diff: 23, damage: 20, name: "절망 광선" },
            { type: "SUP", diff: 22, damage: 18, name: "마력 착취" },
            { type: "ATK", diff: 25, damage: 24, name: "파멸의 시선" }
        ]}
    ],

    bosses: [
        {
            id: "zeros", name: "제로스 황제", org: "기계 제국 제로스", hp: 900, pow: 25,
            introText: "차가운 강철의 군대가 도시를 뒤덮는다. 모든 것을 데이터와 기계로 통제하려는 '기계 제국 제로스'의 무자비한 침략이 시작되었다! 감정이 없는 그들에게 자비란 없다.",
            patterns: [
                { type: "ATK", name: "일제 사격", damage: 70, diff: 12 },
                { type: "SUP", name: "시스템 오버로드", damage: 75, diff: 10 },
                { type: "ATK", name: "강철 돌격", damage: 80, diff: 15 },
                { type: "SUP", name: "데이터 마이닝", damage: 65, diff: 8 },
                { type: "WILL", name: "에너지 충전", damage: 60, diff: 5 },
                { type: "ATK", name: "정밀 타격", damage: 85, diff: 18 },
                { type: "SUP", name: "나노 기계 폭풍", damage: 90, diff: 20, special: true },
                { type: "ATK", name: "초고출력 입자포", damage: 105, diff: 25, special: true },
                { type: "SUP", name: "무한 연산 레이저", damage: 95, diff: 22, special: true },
                { type: "WILL", name: "황제의 위압", damage: 85, diff: 18, special: true },
                { type: "ATK", name: "강철의 심판", damage: 100, diff: 23, special: true }
            ]
        },
        {
            id: "belladonna", name: "여왕 벨라돈나", org: "환상 여왕 벨라돈나", hp: 810, pow: 22,
            introText: "달콤한 향기와 함께 피어오르는 검은 안개. 사람들의 마음속 깊은 곳에 있는 공포와 의심을 먹고 자라는 '환상 여왕 벨라돈나'가 악몽의 연회를 열기 위해 나타났다!",
            patterns: [
                { type: "WILL", name: "검은 안개", damage: 70, diff: 10 },
                { type: "TEAM", name: "의심의 씨앗", damage: 75, diff: 12 },
                { type: "WILL", name: "매혹의 춤", damage: 80, diff: 15 },
                { type: "SUP", name: "거울의 방", damage: 65, diff: 8 },
                { type: "TEAM", name: "넝쿨 구속", damage: 70, diff: 14 },
                { type: "WILL", name: "심장 찌르기", damage: 85, diff: 20 },
                { type: "WILL", name: "악몽의 거울", damage: 90, diff: 20, special: true },
                { type: "WILL", name: "영혼의 장례곡", damage: 100, diff: 22, special: true },
                { type: "SUP", name: "환상 분신술", damage: 95, diff: 18, special: true },
                { type: "ATK", name: "가시 넝쿨의 춤", damage: 85, diff: 19, special: true },
                { type: "TEAM", name: "금지된 유혹", damage: 100, diff: 25, special: true }
            ]
        },
        {
            id: "desmos", name: "맹수 데스모스", org: "원시 맹수 데스모스", hp: 990, pow: 28,
            introText: "대지가 갈라지고 원시의 굉음이 울려 퍼진다! 먹이사슬의 정점에 군림하며 모든 문명을 파괴하려는 '원시 맹수 데스모스'가 끝없는 굶주림을 채우려 강림했다!",
            patterns: [
                { type: "WILL", name: "야성 포효", damage: 65, diff: 12 },
                { type: "ATK", name: "대지 분쇄", damage: 80, diff: 16 },
                { type: "TEAM", name: "포식자 추격", damage: 75, diff: 14 },
                { type: "SUP", name: "독니 습격", damage: 70, diff: 15 },
                { type: "ATK", name: "필사 발악", damage: 75, diff: 18 },
                { type: "ATK", name: "원시의 힘", damage: 90, diff: 22 },
                { type: "TEAM", name: "대지 진동", damage: 85, diff: 16, special: true },
                { type: "ATK", name: "야성의 난타", damage: 95, diff: 22, special: true },
                { type: "TEAM", name: "초중력 블랙홀", damage: 105, diff: 25, special: true },
                { type: "ATK", name: "멸망의 발톱", damage: 100, diff: 24, special: true },
                { type: "WILL", name: "포식자의 끝", damage: 90, diff: 21, special: true }
            ]
        }
    ],

    // 새롭게 추가된 세부 데이터베이스
    rawMembers: [
        "공룡,블루,티라노 팽,5,2,4,1,",
        "공룡,옐로,트리케라 혼,3,4,3,2,",
        "공룡,그린,스테고 슬래시,4,1,4,3,",
        "공룡,핑크,프테라 윙,2,3,5,2,",
        "공룡,블랙,모사 헌터,6,2,2,2,",
        "공룡,화이트,랩터 엣지,4,2,4,2,",
        "공룡,골드,브라키오 가디언,5,4,3,4,식스맨",
        "공룡,실버,안킬로 해머,6,3,2,2,식스맨",
        "경찰,블루,패트롤 블래스터,3,5,2,2,",
        "경찰,옐로,가드 쉴드,2,4,3,3,",
        "경찰,그린,체이서 바이크,3,2,3,4,",
        "경찰,핑크,사이렌 메딕,1,4,2,5,",
        "경찰,블랙,나이트 잠복,4,3,2,3,",
        "경찰,화이트,저스티스 레이더,3,5,3,1,",
        "경찰,실버,스와트 커맨더,5,4,4,2,식스맨",
        "경찰,바이올렛,인터폴 섀도우,4,4,2,5,식스맨",
        "우주,블루,갤럭시 블루,2,6,2,2,",
        "우주,옐로,노바 옐로,2,5,3,2,",
        "우주,그린,혜성 그린,3,5,2,2,",
        "우주,핑크,펄서 핑크,1,6,3,2,",
        "우주,블랙,보이드 블랙,3,5,2,2,",
        "우주,화이트,스타 화이트,2,4,4,2,",
        "우주,골드,슈퍼노바 골드,4,5,3,3,식스맨",
        "우주,바이올렛,네뷸라 바이올렛,2,6,4,3,식스맨",
        "닌자,블루,수둔 블루,3,2,6,1,",
        "닌자,옐로,뇌둔 옐로,4,1,5,2,",
        "닌자,그린,목둔 그린,2,3,5,2,",
        "닌자,핑크,화둔 핑크,3,2,6,1,",
        "닌자,블랙,암둔 블랙,4,1,7,1,",
        "닌자,화이트,풍둔 화이트,2,3,4,3,",
        "닌자,실버,메카 닌자 실버,5,2,5,3,식스맨",
        "닌자,바이올렛,환술 바이올렛,3,4,5,3,식스맨",
        "라이드,블루,포뮬러 블루,5,2,2,3,",
        "라이드,옐로,모토 옐로,3,3,3,3,",
        "라이드,그린,카고 그린,2,1,4,5,",
        "라이드,핑크,제트 핑크,1,2,3,6,",
        "라이드,블랙,탱크 블랙,6,1,2,3,",
        "라이드,화이트,구급 화이트,3,2,4,3,",
        "라이드,골드,하이퍼 트레인,5,3,4,4,식스맨",
        "라이드,실버,마하 실버,6,2,3,4,식스맨",
        "마법,블루,위자드 블루,2,5,2,3,",
        "마법,옐로,소서러 옐로,1,5,2,4,",
        "마법,그린,드루이드 그린,3,4,3,2,",
        "마법,핑크,위치 핑크,1,6,2,3,",
        "마법,블랙,워록 블랙,4,4,2,2,",
        "마법,화이트,프리스트 화이트,2,5,3,2,",
        "마법,골드,현자 골드,3,6,4,2,식스맨",
        "마법,바이올렛,미스틱 바이올렛,2,7,4,2,식스맨",
        "동물,블루,샤크 블루,5,1,3,3,",
        "동물,옐로,비 옐로,3,3,4,2,",
        "동물,그린,스파이더 그린,4,2,4,2,",
        "동물,핑크,버터플라이 핑크,2,3,5,2,",
        "동물,블랙,라이언 블랙,6,1,3,2,",
        "동물,화이트,울프 화이트,4,2,4,2,",
        "동물,실버,라이노 실버,5,2,5,3,식스맨",
        "동물,바이올렛,스콜피온 바이올렛,4,3,4,4,식스맨",
        "사이버,블루,스트림 블루,2,3,2,5,",
        "사이버,옐로,코드 옐로,3,2,3,4,",
        "사이버,그린,링크 그린,1,2,3,6,",
        "사이버,핑크,하트 핑크,2,3,2,5,",
        "사이버,블랙,로그 블랙,3,1,2,6,",
        "사이버,화이트,픽셀 화이트,2,3,3,4,",
        "사이버,골드,서버 골드,3,4,4,5,식스맨",
        "사이버,실버,메인프레임 실버,2,3,5,6,식스맨",
        "신화,블루,포세이돈 블루,3,5,2,2,",
        "신화,옐로,이카루스 옐로,2,4,3,3,",
        "신화,그린,가이아 그린,4,3,3,2,",
        "신화,핑크,아프로디테 핑크,1,5,4,2,",
        "신화,블랙,하데스 블랙,4,3,2,3,",
        "신화,화이트,제우스 화이트,3,4,3,2,",
        "신화,골드,오딘 골드,5,5,4,2,식스맨",
        "신화,바이올렛,헤라 바이올렛,3,6,4,3,식스맨",
        "스포츠,블루,스트라이커 블루,4,2,4,2,",
        "스포츠,옐로,슬러거 옐로,3,3,3,3,",
        "스포츠,그린,덩커 그린,2,2,6,2,",
        "스포츠,핑크,스파이커 핑크,2,2,5,3,",
        "스포츠,블랙,쿼터백 블랙,5,1,4,2,",
        "스포츠,화이트,에이스 화이트,3,3,3,3,",
        "스포츠,실버,메달 실버,5,3,5,2,식스맨",
        "스포츠,바이올렛,챔피언 바이올렛,3,3,6,4,식스맨",
        "음악,블루,베이스 블루,2,4,3,3,",
        "음악,옐로,심벌즈 옐로,3,3,4,2,",
        "음악,그린,드럼 그린,1,3,5,3,",
        "음악,핑크,보컬 핑크,1,4,3,4,",
        "음악,블랙,기타 블랙,3,3,3,3,",
        "음악,화이트,건반 화이트,2,4,4,2,",
        "음악,골드,마에스트로 골드,3,5,4,4,식스맨",
        "음악,실버,템포 실버,2,4,4,5,식스맨",
        "중장비,블루,크레인 블루,4,2,3,3,",
        "중장비,옐로,드릴 옐로,5,1,2,4,",
        "중장비,그린,쇼벨 그린,4,1,4,3,",
        "중장비,핑크,믹서 핑크,2,2,4,4,",
        "중장비,블랙,불도저 블랙,6,1,2,3,",
        "중장비,화이트,덤프 화이트,3,2,3,4,",
        "중장비,실버,아머 실버,5,2,4,5,식스맨",
        "중장비,바이올렛,크러셔 바이올렛,4,3,4,5,식스맨"
    ],

    legends: [
        { theme: "레전드", color: "골드", name: "얼티밋 골드", stats: [6,6,6,6], isSpecial: true, isLegend: true },
        { theme: "레전드", color: "실버", name: "얼티밋 실버", stats: [5,5,5,5], isSpecial: true, isLegend: true },
        { theme: "레전드", color: "바이올렛", name: "얼티밋 바이올렛", stats: [4,7,4,5], isSpecial: true, isLegend: true },
        { theme: "레전드", color: "화이트", name: "얼티밋 화이트", stats: [4,4,7,3], isSpecial: true, isLegend: true }
    ]
};

const THEME_WORDS = {
    "공룡": { concept: "고대 공룡의 야성", action: "원시의 포효", weapon: "날카로운 발톱과 이빨", fail: "화석이 되어버릴 위기" },
    "경찰": { concept: "정의로운 치안 유지", action: "완벽한 범인 검거", weapon: "경찰봉과 블래스터", fail: "치명적인 수사 실패" },
    "우주": { concept: "끝없는 은하의 신비", action: "미지의 행성 탐사", weapon: "우주의 별빛을 담은 레이저", fail: "블랙홀로의 끝없는 추락" },
    "닌자": { concept: "어둠에 숨겨진 닌자의 길", action: "완벽한 은신과 잠입", weapon: "보이지 않는 표창과 검풍", fail: "그림자 속으로의 영원한 실종" },
    "라이드": { concept: "한계를 넘는 질주", action: "최고 속도 돌파", weapon: "엔진의 굉음을 담은 돌격", fail: "엔진 과열과 전면 대파" },
    "마법": { concept: "신비로운 마나의 흐름", action: "고위 마법 영창", weapon: "원소를 엮어낸 마법진", fail: "마력 고갈로 인한 붕괴" },
    "동물": { concept: "자연의 거친 본능", action: "야생의 감각을 활용한 추적", weapon: "야수 같은 맹공", fail: "치명적인 상처와 사냥 실패" },
    "사이버": { concept: "정교한 시스템 네트워크", action: "보안 방화벽 해킹", weapon: "데이터를 실체화한 픽셀 타격", fail: "치명적인 시스템 다운" },
    "신화": { concept: "신들의 위대한 전설", action: "신성한 기적의 현현", weapon: "천벌을 내리는 신물", fail: "신화의 몰락과 잊혀짐" },
    "스포츠": { concept: "포기하지 않는 스포츠 정신", action: "짜릿한 역전승", weapon: "땀과 노력의 결정타", fail: "뼈아픈 연패와 체력 방전" },
    "음악": { concept: "심장을 울리는 리듬", action: "완벽한 하모니의 공연", weapon: "고막을 찢는 음파 공격", fail: "불협화음과 악기 파손" },
    "중장비": { concept: "모든 것을 부수는 압도적 하중", action: "완벽한 철거 작업", weapon: "강철의 크레인과 드릴", fail: "구동축 파괴와 작동 불능" },
    "레전드": { concept: "전설 속에 깃든 무한한 힘", action: "기적을 부르는 영웅의 증명", weapon: "세계를 구원할 궁극의 일격", fail: "전설의 빛이 꺼져가는 절망" }
};

function getCharacterQuotes(theme, color, name) {
    const t = THEME_WORDS[theme] || THEME_WORDS["레전드"];

    switch (color) {
        case '블루':
            return {
                namingQuote: `전대 이름이 [NAME]이라... 분석 결과, 시민들에게 긍정적인 인상을 줄 확률 87%입니다. 채택하죠.`,
                encounterQuote: `목표물 포착! [NAME] 전대, 데이터 분석에 따라 전술 대형으로 전환합니다!`,
                recruit: `저 ${name}의 합류는 ${t.concept} 분석에 따른 최적의 선택입니다.`,
                event: `${t.action}에 성공했습니다. 이 데이터는 다음 작전에 유용하겠군요.`,
                combat: `적의 패턴을 파악 완료. ${t.weapon} 공격을 개시합니다.`,
                defeat: `${t.fail} 도달... 변수 통제 불능. 전술적 후퇴가 필요합니다.`,
                bossDefeat: `최종 보스 제압 완료. ${t.concept}의 전술적 승리입니다.`,
                rank1: `1위 달성. 확률 계산을 뛰어넘는 완벽한 결과군요.`,
                rank2: `2위. 나쁘지 않은 결과지만, 다음에는 더 효율적인 작전이 필요합니다.`,
                rank3: `3위라... ${t.concept}의 데이터를 다시 분석해 봐야겠군요.`,
                rank4: `4위... 굴욕적이군요. 변수 통제에 완전히 실패했습니다.`
            };
        case '그린':
            return {
                namingQuote: `우와, [NAME]!! 이름 진짜 폼나는데? 내가 무조건 캐리할 테니까 잘 봐둬!`,
                encounterQuote: `야! 무고한 사람 괴롭히지 마! [NAME] 전대가 널 묵사발로 만들어 주마!`,
                recruit: `짜잔! ${t.concept} 담당 ${name} 등장! 근데 내 자리가 어디지? 밥은 주겠지?`,
                event: `아, ${t.action} 하느라 허리 아파... 그래도 내가 캐리한 거 인정? 완전 인정!`,
                combat: `내 ${t.weapon} 맛 좀 봐라! 다 덤벼! 제발 좀 쓰러져라!`,
                defeat: `으악, ${t.fail}라니! 나 먼저 퇴근할게... 산재 처리 되나요...?`,
                bossDefeat: `아싸! 끝판왕 물리쳤다! ${t.concept} 파워 제대로 보여줬지!`,
                rank1: `우리가 1등?! 와하하! 내가 캐리한 거 인정? 완전 쩔었어!`,
                rank2: `아깝다 2등! 다음엔 내가 더 빡세게 구를 테니까 밥이나 먹자!`,
                rank3: `3등... 음, 꼴찌는 아니니까 괜찮은 거 아냐? 긍정적으로 살자고!`,
                rank4: `으아악 4등 꼴찌라니! 이거 몰래카메라지? 나 진짜 울 거다!`
            };
        case '옐로':
            return {
                namingQuote: `[NAME] 전대! 이름만 들어도 힘이 불끈불끈 솟아올라! 우리 다 같이 힘내자!`,
                encounterQuote: `거기 나쁜 악당 멈춰라! 우리 [NAME] 전대가 절대 가만두지 않을 거야!`,
                recruit: `안녕! 난 ${t.concept} 넘치는 ${name}이야! 우리가 힘을 합치면 무조건 이길 거야!`,
                event: `앗싸! ${t.action} 대성공! 다들 내 활약 봤지? 봤지?!`,
                combat: `가만 안 둘 거야! 내 ${t.weapon} 공격을 받아랏!`,
                defeat: `아얏... ${t.fail}라니... 진짜 너무해... 꼭 복수할 거야!`,
                bossDefeat: `해냈어! 드디어 끝났어! ${t.concept} 만세!`,
                rank1: `야호! 1등이야! 역시 우리가 최고라니까!`,
                rank2: `아쉽게 2등! 그래도 이 정도면 완전 잘한 거지! 안 그래?`,
                rank3: `음~ 3등이네. 다음엔 더 분발해서 꼭 1등 하자구!`,
                rank4: `4등... 우으... 진짜 분해! 다음엔 절대 안 져!`
            };
        case '블랙':
            return {
                namingQuote: `...[NAME]라. 촌스럽지만 기억하기는 쉽군. 뭐, 이름 따윈 상관없다.`,
                encounterQuote: `어리석은 녀석들. [NAME] 전대의 이름 아래 모조리 쓸어버리겠다.`,
                recruit: `...${name}다. ${t.concept} 따위, 귀찮은 일에 휘말렸군. 적당히 끝내자.`,
                event: `흥, ${t.action} 정도로 호들갑 떨긴. 이 정도는 기본이다.`,
                combat: `어설프군. ${t.weapon}의 힘으로 순식간에 끝내주마.`,
                defeat: `칫... ${t.fail}이라니... 방심했나. 다음엔 안 당한다.`,
                bossDefeat: `...흥, 생각보다 싱거운 녀석이었군. 끝났다.`,
                rank1: `1위인가. 당연한 결과다. 호들갑 떨지 마라.`,
                rank2: `2위. 거슬리는군. 다음엔 용서하지 않겠다.`,
                rank3: `3위... 한심하군. 내 ${t.weapon}이 무뎌졌나.`,
                rank4: `4위라니... 최악이군. 혼자 있고 싶으니 말 걸지 마라.`
            };
        case '화이트':
            return {
                namingQuote: `[NAME] 전대... 모두를 지킬 수 있는 따뜻한 이름이네요. 마음에 들어요.`,
                encounterQuote: `더 이상 다치는 사람이 나오게 둘 순 없어요! [NAME] 전대 출동합니다!`,
                recruit: `반가워요, ${t.concept}의 길을 걷는 ${name}이랍니다. 제가 여러분의 힘이 되어 드릴게요.`,
                event: `다들 다친 곳은 없으신가요? ${t.action}도 무사히 끝나서 다행이에요.`,
                combat: `상처 입히고 싶진 않지만... 모두를 지키기 위해 ${t.weapon}의 힘을 빌릴게요!`,
                defeat: `죄송해요... 저의 ${t.fail} 때문에 모두가 위험해지다니... 윽...`,
                bossDefeat: `드디어 평화가 찾아왔네요. 모두 무사해서 정말 다행이에요.`,
                rank1: `1위를 했네요! 여러분 모두가 힘을 합친 덕분이에요.`,
                rank2: `2위도 정말 훌륭한 성과랍니다. 다들 고생 많으셨어요.`,
                rank3: `3위네요. 순위보다 중요한 건 우리가 함께했다는 사실이죠.`,
                rank4: `4위라 아쉽겠지만... 상처 입지 않은 것만으로도 감사해요.`
            };
        case '핑크':
            return {
                namingQuote: `[NAME]이라니, 조금 더 우아했으면 좋았겠지만... 제가 빛내드리면 되겠죠.`,
                encounterQuote: `어머나, 예의 없는 불청객이네요. [NAME] 전대의 이름으로 청소해 드릴게요!`,
                recruit: `어머나, 저를 부르셨나요? ${t.concept}의 수호자 ${name}, 기꺼이 함께해 드리지요.`,
                event: `호호호! ${t.action}에서 보인 제 활약, 정말 우아하지 않았나요?`,
                combat: `무례하시군요! ${t.weapon}의 예의를 가르쳐 드려야겠어요!`,
                defeat: `이런 ${t.fail} 같은 수모를 겪다니... 정말 최악이네요...`,
                bossDefeat: `어머, 보스도 별거 아니군요. 수고하셨어요.`,
                rank1: `1위! 호호호, 이 완벽하고 우아한 승리! 당연한 일이죠.`,
                rank2: `어머나, 2위? 조금만 더 신경 썼으면 1위였을 텐데 아쉽군요.`,
                rank3: `3위라뇨... 제 ${t.concept}에 금이 가는 결과네요. 우울해요.`,
                rank4: `4위... 이런 끔찍한 성적이라니. 당장 재평가를 요구하겠어요!`
            };
        case '실버':
            return {
                namingQuote: `전대명 [NAME] 등록 완료. 감정을 배제하고 완벽한 임무 수행을 약속한다.`,
                encounterQuote: `타겟 확인. [NAME] 전대 소속으로서 배제 프로토콜을 가동한다.`,
                recruit: `나는 ${name}. ${t.concept} 모드 가동. 감정은 배제하고 임무에만 집중하겠다.`,
                event: `${t.action} 확인. 불필요한 대화는 삼가라.`,
                combat: `표적 록온. 자비 없이 ${t.weapon} 배제 프로토콜 실행.`,
                defeat: `경고. ${t.fail} 발생. 전투 속행 불가능... 시스템 절전...`,
                bossDefeat: `최종 타겟 완전 침묵. ${t.concept} 임무 성공.`,
                rank1: `1위 달성. 목표 수치 100% 충족. 아주 훌륭하다.`,
                rank2: `2위 기록. 목표 달성률 85%. 향상된 퍼포먼스가 요구됨.`,
                rank3: `3위. 평균 이하의 성과. 대대적인 시스템 점검 요망.`,
                rank4: `4위 최하위 기록. 치명적 오류. 존재 의의 재고 필요.`
            };
        case '골드':
            return {
                namingQuote: `하하하! [NAME] 전대! 이 몸이 속하기엔 살짝 부족하지만, 내가 황금빛으로 물들여주지!`,
                encounterQuote: `감히 이 몸 앞을 가로막다니! [NAME] 전대의 압도적인 힘에 엎드려라!`,
                recruit: `하하하! ${t.concept}의 지배자, 이 몸 ${name}님이 오셨다! 승리는 이미 따 놓은 당상이지!`,
                event: `봤느냐! 이 완벽하고 눈부신 ${t.action}의 성과를!`,
                combat: `내 압도적인 ${t.weapon} 앞에 무릎 꿇고 절망해라!!`,
                defeat: `이, 이 몸이 ${t.fail}하다니... 말도 안 돼...!!`,
                bossDefeat: `하하하! 내 압도적인 힘 앞에 무릎 꿇는 건 당연한 이치지!`,
                rank1: `이 몸이 1위인 건 세상이 아는 상식이다! 영광을 누려라!`,
                rank2: `2위?! 감히 내 앞길을 막은 녀석이 있다니! 인정할 수 없다!`,
                rank3: `3위라니... 내 ${t.concept}이 겨우 이 정도 평가를 받다니!`,
                rank4: `4위?! 으아아악!! 이 몸이 꼴찌라니!! 당장 재경기해!!`
            };
        case '바이올렛':
            return {
                namingQuote: `[NAME] 전대! 에헤헤, 이름 엄청 귀엽다! 나 이 팀 짱 맘에 들어써!`,
                encounterQuote: `나쁜 짓 하면 혼내줄 거야! 우리 [NAME] 전대가 다 찌그러트릴 꼬야!`,
                recruit: `안냥! ${t.concept} 파워 듬뿍 담아서 ${name}(이)가 도와주러 와써! 에헤헤~ 나 불렀어?`,
                event: `우와아! ${t.action} 해냈어! 신난다! 나 머리 쓰다듬어 줘!`,
                combat: `내 ${t.weapon} 매운맛을 보여줄 테야! 나 화나면 무섭다구! 얍!`,
                defeat: `훌쩍... ${t.fail} 너무 무서워... 아파서 더 못 싸우게써...`,
                bossDefeat: `에헤헤~ 나빠서 혼내줬어! 우리 짱 쎄지!`,
                rank1: `우와! 1등! 1등! 짱 신난다! 나 칭찬해 줘어!`,
                rank2: `헤헤 2등도 짱 조아! 다들 너무너무 고생해써!`,
                rank3: `우으... 3등이네. 쪼끔 아쉽지만 담엔 더 잘할 거야!`,
                rank4: `훌쩍... 4등... 꼴찌야... 나 슬퍼서 울 거 가태...`
            };
        default: // RED or others
            return {
                namingQuote: `좋아! [NAME] 전대, 정의를 위해 불태워보자! 우리의 유대를 보여주겠어!`,
                encounterQuote: `우리의 평화를 위협하는 악당 녀석들! [NAME] 전대의 이름으로 용서치 않겠다!`,
                recruit: `불타오른다!! ${t.concept}의 열정으로! ${name}, 정의의 이름으로 전력을 다해 싸우겠다!`,
                event: `좋아! ${t.action} 기세가 올랐어! 내 열혈 파워 덕분이지!`,
                combat: `나의 불타는 ${t.weapon} 공격을 받아라!! 한계 따위 돌파해 주마!!`,
                defeat: `크아악!! 아직... ${t.fail} 앞에서도 내 불꽃은 절대 꺼지지 않는다...!!`,
                bossDefeat: `우리의 뜨거운 우정이 승리를 이끌었다! 해냈다!!`,
                rank1: `1위!! 이것이 바로 우리의 불타오르는 전력이다!! 최고다!!`,
                rank2: `크윽 2위! 분하지만 좋은 승부였다! 다음엔 꼭 1위를!`,
                rank3: `3위! 아직 우리의 열혈 파워는 여기서 끝이 아니다! 분발하자!`,
                rank4: `4위라니... 제길!! 내 한계를 부수고 반드시 복수하겠다!!`
            };
    }
}

// 100명의 멤버 풀 생성
function generateMemberPool() {
    let pool = [];
    let idCounter = 1;
    
    GAME_DATA.rawMembers.forEach(row => {
        const parts = row.split(',');
        const isSpecial = parts[7] === '식스맨';
        const name = parts[2];
        const quotes = getCharacterQuotes(parts[0], parts[1], name);
        pool.push({
            id: idCounter++,
            theme: parts[0],
            color: parts[1],
            name: name,
            imgUrl: `img/${name}.png`, // 커스텀 이미지 경로 지원
            stats: [parseInt(parts[3]), parseInt(parts[4]), parseInt(parts[5]), parseInt(parts[6])],
            isSpecial: isSpecial,
            isLegend: false,
            namingQuote: quotes.namingQuote,
            encounterQuote: quotes.encounterQuote,
            recruitQuote: quotes.recruit,
            eventQuote: quotes.event,
            combatQuote: quotes.combat,
            defeatQuote: quotes.defeat,
            bossDefeatQuote: quotes.bossDefeat,
            rank1Quote: quotes.rank1,
            rank2Quote: quotes.rank2,
            rank3Quote: quotes.rank3,
            rank4Quote: quotes.rank4
        });
    });

    GAME_DATA.legends.forEach(legend => {
        const quotes = getCharacterQuotes(legend.theme, legend.color, legend.name);
        pool.push({
            id: idCounter++,
            ...legend,
            imgUrl: `img/${legend.name}.png`, // 커스텀 이미지 경로 지원
            namingQuote: quotes.namingQuote,
            encounterQuote: quotes.encounterQuote,
            recruitQuote: quotes.recruit,
            eventQuote: quotes.event,
            combatQuote: quotes.combat,
            defeatQuote: quotes.defeat,
            bossDefeatQuote: quotes.bossDefeat,
            rank1Quote: quotes.rank1,
            rank2Quote: quotes.rank2,
            rank3Quote: quotes.rank3,
            rank4Quote: quotes.rank4
        });
    });

    return pool;
}

GAME_DATA.fullMemberPool = generateMemberPool();
