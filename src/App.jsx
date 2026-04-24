import React, { useEffect, useMemo, useState } from "react";

const monthBands = ["1~6개월", "7~12개월", "13~18개월", "19~24개월 이상"];

const stageKeywords = {
  "1~6개월": ["흥미 탐색", "공간 적응", "표현 시작", "강점 발견", "도구 경험"],
  "7~12개월": ["반복 경험", "디테일 강화", "재료 확장", "문제 해결", "완성 경험"],
  "13~18개월": ["난이도 상승", "재도전", "자기주도", "대형 작업 준비", "완수 경험"],
  "19~24개월 이상": ["관계 인식", "상호작용", "역할 수행", "협동 경험", "갈등 조율"],
};

const ageBands = ["6–7세", "8–11세", "12–13세"];

const ageDomains = {
  "6–7세": {
    감정이해: ["감정인식", "감정표현", "감정말하기"],
    충동조절: ["멈추기", "기다리기", "차례지키기"],
    규칙: ["규칙이해", "순서지키기", "교실규칙"],
    안정감: ["분리안정", "교사신뢰", "환경안정"],
  },
  "8–11세": {
    과제설정: ["목표정하기", "시작하기", "선택하기"],
    계획: ["단계나누기", "순서생각", "방법정리"],
    수행: ["단계수행", "반복연습", "도구사용"],
    지속: ["과제지속", "몰입유지", "끝까지하기"],
    조율: ["의견조율", "양보하기", "차이조정"],
    역할: ["역할수행", "역할분담", "책임맡기"],
  },
  "12–13세": {
    자기이해: ["강점이해", "약점이해", "상태파악"],
    자기조정: ["방향설정", "방법선택", "자기조절"],
    한계돌파: ["어려움버티기", "기준넘기", "재도전"],
    내적동기: ["의미찾기", "스스로시작", "주도유지"],
    역할정체성: ["역할찾기", "역할수행", "팀기여"],
  },
};

const projects = ["연작", "협동작업", "100호캔버스"];

const projectKeywords = {
  연작: ["주제지속", "반복탐구", "관찰심화", "표현확장", "몰입경험", "발전흐름"],
  협동작업: ["협력경험", "역할분담", "의사소통", "관계조율", "갈등해결", "공동성취"],
  "100호캔버스": ["스케일확장", "공간이해", "계획구성", "몰입지속", "도전극복", "완수경험"],
};

const socialMainKeywords = {
  관계인식: ["차례지키기", "거리조절", "방해인식", "상황살피기", "기본배려"],
  상호작용: ["요청하기", "도움요청", "도움주기", "의견표현", "기다렸다말하기"],
  관계조율: ["의견조율", "양해구하기", "의견수용", "갈등해결", "사과하기"],
  협동: ["역할수행", "역할분담", "협력수행", "도움주고받기", "공동성취"],
  자아실현: ["자발적시작", "자발적지속", "선택하기", "책임지기", "끝까지완성"],
};

const needOptions = {
  homeDirection: [
    "자기표현",
    "감정표현",
    "감정이해",
    "정서안정",
    "자기효능감",
    "자신감",
    "도전정신",
    "표현흥미",
    "미술자신감",
    "공동체이해",
  ],
  classFlow: [
    "감정조절",
    "충동조절",
    "집중유지",
    "과제지속",
    "문제해결",
    "자기주도성",
    "계획하기",
    "선택하기",
    "몰입경험",
    "반복탐구",
    "표현확장",
    "완수경험",
    "도전경험",
  ],
  peerBehavior: [
    "관계진입",
    "관계유지",
    "관계조율",
    "의사소통",
    "의견표현",
    "차례지키기",
    "기다리기",
    "양보하기",
    "갈등조절",
    "갈등해결",
    "협력하기",
    "역할수행",
    "책임지기",
  ],
};

const needMeaningMap = {
  자기표현: "자신의 생각과 감정을 관계 안에서 표현해보는 힘",
  감정표현: "감정을 말과 행동으로 건강하게 드러내보는 힘",
  감정이해: "자신의 마음 상태를 알아차리는 힘",
  정서안정: "감정이 흔들릴 때 다시 안정으로 돌아오는 힘",
  자기효능감: "스스로 해낼 수 있다는 감각",
  자신감: "자신의 시도를 긍정적으로 바라보는 힘",
  도전정신: "낯선 시도 앞에서도 물러서지 않고 해보는 힘",
  표현흥미: "표현 활동 안에서 즐거움과 관심을 찾아가는 힘",
  미술자신감: "그리기와 만들기에서 자신 있게 시도해보는 힘",
  공동체이해: "함께하는 공간의 약속과 흐름을 이해하는 힘",

  감정조절: "감정을 알아차리고 조절해보는 경험",
  충동조절: "하고 싶은 행동을 잠시 멈추고 조절해보는 경험",
  집중유지: "한 가지 흐름을 일정 시간 붙잡아보는 경험",
  과제지속: "쉽지 않아도 과제를 이어가보는 경험",
  문제해결: "막히는 지점에서 방법을 찾아보는 경험",
  자기주도성: "스스로 선택하고 이어가보는 경험",
  계획하기: "과정을 생각하고 순서를 잡아보는 경험",
  선택하기: "자신의 방식으로 선택해보는 경험",
  몰입경험: "작업 안으로 깊이 들어가보는 경험",
  반복탐구: "반복 속에서 차이를 발견하고 발전시키는 경험",
  표현확장: "표현 방식을 넓혀가는 경험",
  완수경험: "끝까지 해내며 성취감을 쌓는 경험",
  도전경험: "익숙하지 않은 영역에도 시도해보는 경험",

  관계진입: "또래 관계 안으로 자연스럽게 들어가보는 행동",
  관계유지: "관계를 안정적으로 이어가보는 행동",
  관계조율: "서로 다른 생각과 흐름을 맞춰가는 행동",
  의사소통: "말과 반응을 주고받으며 관계를 이어가는 행동",
  의견표현: "자기 생각을 관계 안에서 말해보는 행동",
  차례지키기: "관계 안에서 자신의 순서를 지켜보는 행동",
  기다리기: "상대와 흐름을 위해 기다려보는 행동",
  양보하기: "자신의 입장만 고집하지 않고 조정해보는 행동",
  갈등조절: "부딪히는 상황에서 감정을 다뤄보는 행동",
  갈등해결: "문제 상황을 관계 안에서 풀어보는 행동",
  협력하기: "친구와 함께 결과를 만들어가는 행동",
  역할수행: "맡은 역할을 책임 있게 이어가는 행동",
  책임지기: "자신이 선택한 일을 끝까지 감당해보는 행동",
};

const surveyMapping = [
  {
    patterns: ["의견을 잘 표현하지 못", "싫다는 표현", "자신의 생각을 잘 표현"],
    homeDirection: "자기표현",
    peerBehavior: "의견표현",
    reason: "친구 관계 안에서 자신의 생각을 표현하는 데 어려움이 관찰됨",
  },
  {
    patterns: ["감정을 잘 표현하지 못", "감정을 잘 표현"],
    homeDirection: "감정표현",
    classFlow: "감정조절",
    reason: "감정을 말이나 행동으로 표현하고 조절하는 경험이 필요함",
  },
  {
    patterns: ["화를 자주", "감정 기복", "감정 충돌", "예민"],
    homeDirection: "정서안정",
    classFlow: "감정조절",
    peerBehavior: "갈등조절",
    reason: "감정 변화가 관계와 행동에 영향을 줄 수 있음",
  },
  {
    patterns: ["충동적으로", "허락받지 않고", "손이 나갈"],
    classFlow: "충동조절",
    peerBehavior: "차례지키기",
    reason: "행동으로 먼저 반응하기보다 잠시 멈추는 경험이 필요함",
  },
  {
    patterns: ["친구와 갈등", "자주 다투", "싸우"],
    homeDirection: "공동체이해",
    classFlow: "문제해결",
    peerBehavior: "관계조율",
    reason: "또래 관계 안에서 차이를 조율하는 경험이 필요함",
  },
  {
    patterns: ["먼저 다가가기 어려", "낯을 가리", "혼자", "또래를 좋아하지만"],
    homeDirection: "자기표현",
    classFlow: "도전경험",
    peerBehavior: "관계진입",
    reason: "관계 안으로 들어가는 시도와 표현 경험이 필요함",
  },
  {
    patterns: ["친구 눈치", "양보하는 편"],
    homeDirection: "자기표현",
    peerBehavior: "의사소통",
    reason: "관계 안에서 자기 기준을 표현하는 힘이 필요함",
  },
  {
    patterns: ["규칙을 잘 지키지", "규칙을 잘 지키는"],
    homeDirection: "공동체이해",
    classFlow: "충동조절",
    peerBehavior: "차례지키기",
    reason: "공동체 안의 약속과 순서를 이해하는 경험이 필요함",
  },
  {
    patterns: ["집중 시간이 짧", "집중해서 끝까지"],
    classFlow: "집중유지",
    peerBehavior: "책임지기",
    reason: "한 가지 흐름을 지속하고 끝까지 이어가는 경험이 필요함",
  },
  {
    patterns: ["쉽게 포기", "금방 포기"],
    homeDirection: "자기효능감",
    classFlow: "과제지속",
    peerBehavior: "책임지기",
    reason: "어려운 지점에서도 다시 이어가며 해냈다는 감각이 필요함",
  },
  {
    patterns: ["새로운 시도", "시도를 꺼리", "실패를 두려워", "도전하는 아이"],
    homeDirection: "도전정신",
    classFlow: "도전경험",
    reason: "익숙하지 않은 과제 앞에서도 시도해보는 경험이 필요함",
  },
  {
    patterns: ["자신감", "못한다고"],
    homeDirection: "자기효능감",
    classFlow: "완수경험",
    reason: "스스로 해낼 수 있다는 감각을 쌓는 경험이 필요함",
  },
  {
    patterns: ["미술을 좋아", "표현을 어려워", "흥미가 적", "미술 자신감"],
    homeDirection: "미술자신감",
    classFlow: "표현확장",
    reason: "미술 활동 안에서 표현 자신감을 쌓는 경험이 필요함",
  },
  {
    patterns: ["몰입"],
    homeDirection: "표현흥미",
    classFlow: "몰입경험",
    reason: "흥미를 바탕으로 작업에 깊이 들어가는 경험을 확장할 수 있음",
  },
  {
    patterns: ["협력", "함께", "역할"],
    classFlow: "자기주도성",
    peerBehavior: "협력하기",
    reason: "함께하는 과정에서 역할과 협력 경험이 필요함",
  },
];

const defaultNeeds = {
  homeDirection: "",
  classFlow: "",
  peerBehavior: "",
  longTermGoal: "",
  evidence: [],
};

const defaultForm = {
  student: "",
  date: new Date().toISOString().slice(0, 10),
  months: "1~6개월",
  stage: "흥미 탐색",
  ageBand: "6–7세",
  ageDomain: "감정이해",
  ageSubKeywords: [],
  project: "연작",
  projectKeywordsSelected: [],
  socialDomain: "관계인식",
  socialKeywordsSelected: [],
  memo: "",
  artworkFlow: "",
  images: [],
  parentNeeds: defaultNeeds,
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #eef2ff 0%, #f8fafc 45%, #ffffff 100%)",
    color: "#0f172a",
    fontFamily: "Arial, sans-serif",
  },
  container: { maxWidth: 1400, margin: "0 auto", padding: "28px 20px 40px" },
  grid: { display: "grid", gridTemplateColumns: "1.08fr 0.92fr", gap: 24, alignItems: "start" },
  topGrid: { display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 16, marginBottom: 24 },
  card: {
    background: "white",
    borderRadius: 28,
    padding: 28,
    boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
    border: "1px solid #e2e8f0",
  },
  darkCard: {
    background: "#0f172a",
    color: "white",
    borderRadius: 28,
    padding: 28,
    boxShadow: "0 8px 24px rgba(15,23,42,0.14)",
  },
  title: { fontSize: 42, fontWeight: 800, margin: 0 },
  subtitle: { fontSize: 16, lineHeight: 1.8, color: "#475569", marginTop: 12 },
  sectionTitle: { fontSize: 28, fontWeight: 800, margin: 0 },
  sectionHint: { color: "#64748b", fontSize: 14, marginTop: 6 },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 18 },
  row3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 18 },
  label: { fontSize: 14, fontWeight: 700, marginBottom: 8 },
  hint: { fontSize: 12, color: "#94a3b8", marginTop: 6 },
  input: {
    width: "100%",
    borderRadius: 16,
    border: "1px solid #cbd5e1",
    padding: "14px 16px",
    fontSize: 14,
    boxSizing: "border-box",
    background: "white",
  },
  textarea: {
    width: "100%",
    minHeight: 130,
    borderRadius: 16,
    border: "1px solid #cbd5e1",
    padding: 16,
    fontSize: 14,
    boxSizing: "border-box",
    lineHeight: 1.6,
    resize: "vertical",
    background: "white",
  },
  softBox: {
    marginTop: 20,
    padding: 20,
    borderRadius: 24,
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
  },
  chips: { display: "flex", flexWrap: "wrap", gap: 8 },
  primaryBtn: {
    background: "#0f172a",
    color: "white",
    border: "none",
    borderRadius: 16,
    padding: "13px 16px",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryBtn: {
    background: "white",
    color: "#334155",
    border: "1px solid #cbd5e1",
    borderRadius: 16,
    padding: "13px 16px",
    fontWeight: 700,
    cursor: "pointer",
  },
  dangerBtn: {
    background: "white",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: 16,
    padding: "12px 14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  previewBox: {
    marginTop: 16,
    borderRadius: 24,
    background: "#f8fafc",
    padding: 20,
    fontSize: 14,
    lineHeight: 1.9,
    whiteSpace: "pre-wrap",
    border: "1px solid #e2e8f0",
  },
  promptBox: {
    marginTop: 16,
    borderRadius: 24,
    background: "#020617",
    color: "#e2e8f0",
    padding: 20,
    fontSize: 13,
    lineHeight: 1.75,
    whiteSpace: "pre-wrap",
    maxHeight: 460,
    overflow: "auto",
  },
  imageGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 12 },
  image: { width: "100%", height: 120, objectFit: "cover", borderRadius: 16, border: "1px solid #e2e8f0" },
  recordCard: {
    borderRadius: 22,
    border: "1px solid #e2e8f0",
    padding: 16,
    background: "white",
    marginTop: 14,
  },
};

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        borderRadius: 999,
        border: active ? "1px solid #0f172a" : "1px solid #cbd5e1",
        background: active ? "#0f172a" : "white",
        color: active ? "white" : "#334155",
        padding: "10px 14px",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function Field({ label, children, hint }) {
  return (
    <div>
      <div style={styles.label}>{label}</div>
      {children}
      {hint ? <div style={styles.hint}>{hint}</div> : null}
    </div>
  );
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function parseCSV(text) {
  const rows = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseCSVLine);

  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim());

  return rows.slice(1).map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index]?.trim() || "";
    });
    return obj;
  });
}

function findStudentName(row) {
  const keys = Object.keys(row);
  const nameKey =
    keys.find((key) => key.includes("아이 이름")) ||
    keys.find((key) => key.includes("학생명")) ||
    keys.find((key) => key.includes("이름"));

  return nameKey ? row[nameKey] : "이름없음";
}

function analyzeSurvey(rawText) {
  const text = String(rawText || "");
  const scores = {
    homeDirection: {},
    classFlow: {},
    peerBehavior: {},
  };
  const evidence = [];

  surveyMapping.forEach((rule) => {
    const matched = rule.patterns.some((pattern) => text.includes(pattern));
    if (!matched) return;

    if (rule.homeDirection) {
      scores.homeDirection[rule.homeDirection] = (scores.homeDirection[rule.homeDirection] || 0) + 1;
    }
    if (rule.classFlow) {
      scores.classFlow[rule.classFlow] = (scores.classFlow[rule.classFlow] || 0) + 1;
    }
    if (rule.peerBehavior) {
      scores.peerBehavior[rule.peerBehavior] = (scores.peerBehavior[rule.peerBehavior] || 0) + 1;
    }

    evidence.push(rule.reason);
  });

  const top = (obj, fallback) => {
    const sorted = Object.entries(obj).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || fallback;
  };

  const longTermGoal = text.includes("친구") || text.includes("또래")
    ? "안정적인 또래 관계 형성"
    : text.includes("자신감") || text.includes("못한다고")
    ? "자기효능감과 미술 자신감 형성"
    : text.includes("감정") || text.includes("조절")
    ? "정서안정과 자기조절력 향상"
    : text.includes("도전") || text.includes("포기")
    ? "도전정신과 완수 경험 확장"
    : "아이의 강점이 수업과 관계 안에서 자연스럽게 확장되는 성장";

  return {
    homeDirection: top(scores.homeDirection, "자기표현"),
    classFlow: top(scores.classFlow, "감정조절"),
    peerBehavior: top(scores.peerBehavior, "관계조율"),
    longTermGoal,
    evidence: Array.from(new Set(evidence)).slice(0, 6),
  };
}

function interpretMemo(memo, form) {
  const text = String(memo || "").trim();
  if (!text) return "";

  const hasFriend = /친구|같이|함께|갈등|양보|의견|다툼|싸우/.test(text);
  const hasEmotion = /화|감정|울|짜증|멈춤|충동|기다/.test(text);
  const hasChallenge = /어려|포기|다시|재도전|실패|힘들/.test(text);
  const hasFocus = /집중|몰입|계속|끝까지|반복/.test(text);
  const hasExpression = /말|표현|설명|선택|생각/.test(text);

  if (hasFriend) {
    return `수업 중 ${text} 장면이 있었습니다. 이 장면은 단순히 친구와 함께 있었다는 기록이라기보다, 또래 관계 안에서 자신의 생각과 상대의 흐름을 맞춰보는 경험으로 볼 수 있습니다.`;
  }

  if (hasEmotion) {
    return `수업 중 ${text} 장면이 있었습니다. 이 과정은 아이가 감정이나 행동을 바로 드러내기보다, 잠시 멈추고 다시 이어가보는 조절 경험으로 해석할 수 있습니다.`;
  }

  if (hasChallenge) {
    return `수업 중 ${text} 장면이 있었습니다. 이 장면은 어려운 지점에서 멈추지 않고 다시 시도해보는 흐름으로, 스스로 해낼 수 있다는 감각을 쌓아가는 과정으로 볼 수 있습니다.`;
  }

  if (hasFocus) {
    return `수업 중 ${text} 모습이 관찰되었습니다. 이는 한 가지 작업 흐름을 일정 시간 붙잡고 이어가려는 시도로, 몰입과 지속 경험이 함께 나타난 장면으로 볼 수 있습니다.`;
  }

  if (hasExpression) {
    return `수업 중 ${text} 모습이 관찰되었습니다. 이 장면은 아이가 자신의 생각을 표현하고 선택해보는 과정으로, 수업 안에서 자기 방식이 조금씩 드러나는 흐름으로 볼 수 있습니다.`;
  }

  return `수업 중 ${text} 모습이 관찰되었습니다. 이 장면은 아이가 자신의 방식으로 수업 흐름에 참여하고, 경험을 통해 다음 단계로 이어가려는 시도로 해석할 수 있습니다.`;
}

function buildNeedLine(form) {
  const home = form.parentNeeds.homeDirection;
  const meaning = needMeaningMap[home] || home;

  if (!home) {
    return "이번 달은 아이가 수업 안에서 보인 변화와 관계 경험을 중심으로 브리핑드립니다.";
  }

  return `이번 달은 아이가 ${meaning}을 수업과 관계 안에서 어떻게 경험해가고 있는지 중심으로 브리핑드립니다.`;
}

function buildAgeLine(form) {
  const map = {
    "6–7세": "현재 아이에게는 감정을 알아차리고, 기다림과 규칙을 경험하며 안정적으로 수업에 참여하는 흐름이 중요합니다.",
    "8–11세": "현재 아이에게는 스스로 과제를 정하고, 계획한 흐름을 끝까지 이어가며 관계 안에서 조율해보는 경험이 중요합니다.",
    "12–13세": "현재 아이에게는 자신의 상태와 강점을 이해하고, 스스로 방향을 조정하며 역할을 찾아가는 경험이 중요합니다.",
  };

  return map[form.ageBand] || "";
}

function buildStageLine(form) {
  const map = {
    "1~6개월": "재원 흐름에서는 새로운 환경과 재료에 익숙해지며 자신의 표현을 하나씩 시도해보는 과정이 자연스럽게 나타나고 있습니다.",
    "7~12개월": "재원 흐름에서는 익숙해진 방식 안에서 반복하고 보완하며, 자신의 작업을 조금 더 안정적으로 이어가는 힘이 쌓이고 있습니다.",
    "13~18개월": "재원 흐름에서는 조금 더 어려운 과제 앞에서도 멈추지 않고 다시 시도해보려는 태도가 점차 중요해지고 있습니다.",
    "19~24개월 이상": "재원 흐름에서는 자신의 작업을 이어가는 것에 더해, 친구와 함께 맞추고 조율하며 넓게 바라보는 경험이 중요해지고 있습니다.",
  };

  return map[form.months] || "";
}

function buildProjectLine(form) {
  const map = {
    연작: "이번 프로젝트는 한 가지 주제를 반복해서 바라보고 발전시키며, 아이가 스스로 작업의 흐름을 이어가보는 데 의미가 있습니다.",
    협동작업: "이번 프로젝트는 친구와 함께 역할을 나누고 조율하며, 관계 안에서 공동의 결과를 만들어보는 데 의미가 있습니다.",
    "100호캔버스": "이번 프로젝트는 큰 규모의 작업을 계획하고 끝까지 이어가며, 도전과 완수 경험을 쌓는 데 의미가 있습니다.",
  };

  return map[form.project] || "";
}

function buildSocialLine(form) {
  const peer = form.parentNeeds.peerBehavior;
  const socialKeywords = form.socialKeywordsSelected.join(", ");
  const peerMeaning = needMeaningMap[peer] || peer;

  if (peer && socialKeywords) {
    return `사회성코칭에서는 ${peerMeaning}이 중요한 흐름으로 보였고, 선택된 코칭 요소인 ${socialKeywords}와도 자연스럽게 연결됩니다.`;
  }

  if (peer) {
    return `사회성코칭에서는 ${peerMeaning}이 실제 관계 안에서 조금씩 나타날 수 있도록 살펴보는 것이 중요합니다.`;
  }

  if (socialKeywords) {
    return `사회성코칭에서는 ${socialKeywords} 흐름을 중심으로 아이의 관계 경험을 살펴볼 수 있었습니다.`;
  }

  return "";
}

function buildArtworkLine(form, visionResult) {
  if (visionResult?.flow_summary) return visionResult.flow_summary;

  if (form.artworkFlow.trim()) {
    return `미술활동과 작품 흐름을 보면, ${form.artworkFlow.trim()}`;
  }

  if (form.images.length >= 4) {
    return "미술활동과 작품 흐름을 보면, 한 번에 결과를 내기보다 주차가 지나며 시도와 수정, 보완이 조금씩 쌓여가는 과정이 드러났습니다.";
  }

  return "";
}

function buildIntegratedLine(form) {
  const home = form.parentNeeds.homeDirection;
  const classFlow = form.parentNeeds.classFlow;
  const peer = form.parentNeeds.peerBehavior;

  const homeMeaning = needMeaningMap[home] || home;
  const classMeaning = needMeaningMap[classFlow] || classFlow;
  const peerMeaning = needMeaningMap[peer] || peer;

  const parts = [homeMeaning, classMeaning, peerMeaning].filter(Boolean);

  if (parts.length === 0) {
    return "전체적으로 이번 달 수업은 아이가 자신의 방식으로 시도하고, 경험을 통해 다음 단계로 이어가려는 흐름을 확인할 수 있었던 시간입니다.";
  }

  return `통합적으로 보면 이번 달 수업은 ${parts.join(", ")}이 하나의 흐름으로 연결된 시간이었습니다. 결과보다 중요한 것은 아이가 경험 안에서 스스로 조절하고, 관계와 작업 속에서 조금씩 다음 단계로 나아가고 있다는 점입니다.`;
}

function buildNextMonthPlan(form) {
  const classFlow = form.parentNeeds.classFlow;
  const peer = form.parentNeeds.peerBehavior;
  const classMeaning = needMeaningMap[classFlow] || classFlow;
  const peerMeaning = needMeaningMap[peer] || peer;

  if (classMeaning && peerMeaning) {
    return `다음달 수업계획은 ${classMeaning}을 수업 안에서 반복 경험하고, ${peerMeaning}이 또래 관계 속에서도 자연스럽게 이어질 수 있도록 구성할 예정입니다.`;
  }

  return "다음달 수업계획은 이번 달에 관찰된 흐름을 바탕으로 아이가 스스로 시도하고 관계 안에서 경험을 확장할 수 있도록 구성할 예정입니다.";
}

function buildThreeMonthExpectation(form) {
  const home = form.parentNeeds.homeDirection;
  const peer = form.parentNeeds.peerBehavior;
  const homeMeaning = needMeaningMap[home] || home;
  const peerMeaning = needMeaningMap[peer] || peer;

  if (homeMeaning && peerMeaning) {
    return `3개월 뒤에는 ${homeMeaning}이 조금 더 안정적으로 자리 잡고, ${peerMeaning}이 수업과 또래 관계 속에서 보다 자연스럽게 드러나는 모습을 기대해볼 수 있습니다.`;
  }

  return "3개월 뒤에는 아이가 수업 안에서 더 안정적으로 시도하고, 관계 속에서도 자신의 생각과 행동을 조금 더 자연스럽게 조절해가는 모습을 기대해볼 수 있습니다.";
}

function generatePreview(form, visionResult) {
  if (!form.memo.trim() && !form.artworkFlow.trim() && !visionResult?.flow_summary) {
    return "관찰 메모 또는 작품 흐름 분석 결과가 있으면 브리핑 초안이 여기에 표시됩니다.";
  }

  const title =
    form.project === "협동작업"
      ? "관계 안에서 함께 맞춰간 이번 달 성장 흐름"
      : form.project === "100호캔버스"
      ? "도전과 완수를 경험한 이번 달 성장 흐름"
      : "반복과 보완으로 이어간 이번 달 성장 흐름";

  return [
    `"${title}"`,
    "",
    `안녕하세요. ${buildNeedLine(form)}`,
    "",
    buildAgeLine(form),
    buildStageLine(form),
    buildProjectLine(form),
    buildSocialLine(form),
    interpretMemo(form.memo, form),
    buildArtworkLine(form, visionResult),
    buildIntegratedLine(form),
    buildNextMonthPlan(form),
    buildThreeMonthExpectation(form),
  ]
    .filter(Boolean)
    .join("\n\n");
}

function generatePrompt(form, visionResult) {
  return `너는 자라다교육의 남아 전문 상담 교사다.
입력된 정보를 바탕으로 학부모에게 전달할 월간 심화 브리핑을 작성하라.

[브리핑 우선순위]
브리핑은 반드시 아래 순서로 구성한다.

1. 학부모님 니즈
2. 연령
3. 재원기간
4. 프로젝트
5. 사회성코칭
6. 미술활동 / 작품 흐름
7. 통합성장 해석
8. 다음달 수업계획
9. 3개월 뒤 기대 모습

[문장 시작 규칙]
- “어머님, 안녕하세요.” 금지
- 반드시 “안녕하세요. 이번 달은...”으로 시작한다.
- “오늘 수업”보다 “이번 달 수업 흐름”을 사용한다.
- “다음 시간”보다 “다음달 수업계획은”을 사용한다.
- 마지막에는 반드시 “3개월 뒤 기대 모습”을 포함한다.

[최상위 구조]
설문은 정보를 수집하는 도구가 아니라, 아이의 성장 방향을 결정하는 기준이다.
부모의 니즈를 방향으로 설정하고, 수업에서 경험으로 만들고, 또래 관계에서 행동으로 완성한다.

[3축 성장 구조]
- 가정에서 함께 세워가는 성장 방향: ${form.parentNeeds.homeDirection}
- 수업 안에서 이어가는 성장 흐름: ${form.parentNeeds.classFlow}
- 또래 관계 속에서 보완해가는 행동 변화: ${form.parentNeeds.peerBehavior}
- 장기 목표: ${form.parentNeeds.longTermGoal}

[입력 정보]
- 학생명: ${form.student}
- 날짜: ${form.date}
- 재원기간: ${form.months}
- 재원기간 키워드: ${form.stage}
- 연령대: ${form.ageBand}
- 연령 키워드: ${form.ageSubKeywords.join(", ")}
- 프로젝트: ${form.project}
- 프로젝트 키워드: ${form.projectKeywordsSelected.join(", ")}
- 사회성 키워드: ${form.socialKeywordsSelected.join(", ")}
- 관찰 메모: ${form.memo}
- 작품 흐름 메모: ${form.artworkFlow}
- Vision 분석: ${visionResult?.flow_summary || ""}

[설문 기반 근거]
${(form.parentNeeds.evidence || []).map((e) => `- ${e}`).join("\n")}

[작성 원칙]
- 학부모님 니즈가 가장 먼저 읽히게 작성한다.
- 그 다음 사회성코칭, 미술활동/작품 흐름 순서로 자연스럽게 연결한다.
- 교사 메모를 그대로 붙여넣지 말고 반드시 학부모용 해석 문장으로 바꾼다.
- 결과보다 과정과 변화 흐름을 중심으로 작성한다.
- '설문', '니즈', '발달단계', '재원기간'이라는 표현은 직접 쓰지 않는다.
- 키워드는 직접 나열하지 말고 의미만 자연스럽게 녹인다.
- '메모는 짧지만', '요약하면', '간단히 보면' 같은 메타 표현은 쓰지 않는다.
- 학부모가 이해하기 쉬운 언어로 작성한다.
- 제목 1줄, 본문 7~9문장으로 작성한다.

위 기준을 반영해 학부모에게 바로 전달 가능한 자라다식 월간 심화 브리핑을 작성하라.`;
}

export default function App() {
  const [form, setForm] = useState(defaultForm);
  const [studentProfiles, setStudentProfiles] = useState({});
  const [records, setRecords] = useState([]);
  const [csvStudents, setCsvStudents] = useState([]);
  const [recordSearch, setRecordSearch] = useState("");
  const [visionResult, setVisionResult] = useState(null);
  const [visionLoading, setVisionLoading] = useState(false);
  const [visionError, setVisionError] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const profiles = localStorage.getItem("jarada-student-profiles-v3");
    const savedRecords = localStorage.getItem("jarada-briefing-records-v9");

    if (profiles) setStudentProfiles(JSON.parse(profiles));
    if (savedRecords) setRecords(JSON.parse(savedRecords));
  }, []);

  useEffect(() => {
    localStorage.setItem("jarada-student-profiles-v3", JSON.stringify(studentProfiles));
  }, [studentProfiles]);

  useEffect(() => {
    localStorage.setItem("jarada-briefing-records-v9", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    const list = stageKeywords[form.months] || [];
    if (!list.includes(form.stage)) {
      setForm((prev) => ({ ...prev, stage: list[0] || "" }));
    }
  }, [form.months, form.stage]);

  useEffect(() => {
    const domains = Object.keys(ageDomains[form.ageBand] || {});
    if (!domains.includes(form.ageDomain)) {
      const next = domains[0] || "";
      setForm((prev) => ({ ...prev, ageDomain: next, ageSubKeywords: [] }));
    }
  }, [form.ageBand, form.ageDomain]);

  const prompt = useMemo(() => generatePrompt(form, visionResult), [form, visionResult]);
  const preview = useMemo(() => generatePreview(form, visionResult), [form, visionResult]);

  const savedStudentNames = useMemo(() => Object.keys(studentProfiles).sort(), [studentProfiles]);

  const filteredRecords = useMemo(() => {
    const q = recordSearch.trim();
    if (!q) return records;
    return records.filter((record) => (record.student || "").includes(q));
  }, [records, recordSearch]);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateNeeds = (key, value) => {
    setForm((prev) => ({
      ...prev,
      parentNeeds: {
        ...prev.parentNeeds,
        [key]: value,
      },
    }));
  };

  const toggle = (list, value) => {
    return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
  };

  const handleCSVUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const text = String(readerEvent.target?.result || "");
      const rows = parseCSV(text);

      const analyzed = rows.map((row) => {
        const name = findStudentName(row);
        const raw = Object.values(row).join(" ");
        const result = analyzeSurvey(raw);

        return {
          name,
          raw,
          parentNeeds: result,
        };
      });

      setCsvStudents(analyzed);
    };

    reader.readAsText(file, "utf-8");
  };

  const applyCSVStudent = (student) => {
    setForm((prev) => ({
      ...prev,
      student: student.name,
      parentNeeds: student.parentNeeds,
    }));
  };

  const saveAllCSVProfiles = () => {
    if (csvStudents.length === 0) {
      alert("먼저 CSV 파일을 업로드해 주세요.");
      return;
    }

    const nextProfiles = { ...studentProfiles };

    csvStudents.forEach((student) => {
      if (!student.name || student.name === "이름없음") return;

      nextProfiles[student.name] = {
        parentNeeds: student.parentNeeds,
        updatedAt: new Date().toISOString(),
      };
    });

    setStudentProfiles(nextProfiles);
    alert("CSV 분석 결과를 학생 기본값으로 저장했습니다.");
  };

  const saveStudentProfile = () => {
    const name = form.student.trim();

    if (!name) {
      alert("학생명을 먼저 입력해 주세요.");
      return;
    }

    setStudentProfiles((prev) => ({
      ...prev,
      [name]: {
        parentNeeds: form.parentNeeds,
        updatedAt: new Date().toISOString(),
      },
    }));

    alert(`${name} 학생의 기본값을 저장했습니다.`);
  };

  const loadStudentProfile = (name) => {
    if (!name) return;

    const profile = studentProfiles[name];

    setForm((prev) => ({
      ...prev,
      student: name,
      parentNeeds: profile?.parentNeeds || defaultNeeds,
    }));
  };

  const copyText = async (text, key) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  const saveRecord = () => {
    const item = {
      id: crypto.randomUUID(),
      ...form,
      prompt,
      preview,
      visionResult,
      createdAt: new Date().toISOString(),
    };

    setRecords((prev) => [item, ...prev]);
  };

  const onImageChange = (event) => {
    const files = Array.from(event.target.files || []).slice(0, 4);

    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();

            reader.onload = () => {
              resolve({
                preview: String(reader.result),
                dataUrl: String(reader.result),
              });
            };

            reader.readAsDataURL(file);
          })
      )
    ).then((images) => {
      setForm((prev) => ({ ...prev, images }));
      setVisionResult(null);
      setVisionError("");
    });
  };

  const runVisionAnalysis = async () => {
    if (!form.images.length) {
      alert("작품 사진을 먼저 업로드해 주세요.");
      return;
    }

    try {
      setVisionLoading(true);
      setVisionError("");

      const response = await fetch("/api/vision-briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: form.images.map((image) => image.dataUrl),
          project: form.project,
          months: form.months,
          stage: form.stage,
          ageBand: form.ageBand,
          ageDomain: form.ageDomain,
          ageSubKeywords: form.ageSubKeywords,
          projectKeywordsSelected: form.projectKeywordsSelected,
          socialDomain: form.socialDomain,
          socialKeywordsSelected: form.socialKeywordsSelected,
          memo: form.memo,
          parentNeeds: form.parentNeeds,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || data?.error || "작품 분석에 실패했습니다.");
      }

      setVisionResult(data);

      if (data?.artwork_flow_memo) {
        update("artworkFlow", data.artwork_flow_memo);
      }
    } catch (error) {
      setVisionError(error.message || "작품 분석 중 오류가 발생했습니다.");
    } finally {
      setVisionLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topGrid}>
          <div
            style={{
              ...styles.card,
              textAlign: "center",
              minHeight: 220,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1 style={styles.title}>JARADA MVP 심화브리핑</h1>
            <p style={{ ...styles.subtitle, maxWidth: 720 }}>
              구글폼 설문, 학부모가 중요하게 보는 성장 방향, 사회성코칭, 미술활동과 작품 흐름을 연결해 월간 심화 브리핑을 구성합니다.
            </p>
          </div>

          <div style={styles.darkCard}>
            <div style={{ fontWeight: 800, marginBottom: 14 }}>브리핑 흐름</div>
            <div style={{ display: "grid", gap: 10, lineHeight: 1.7 }}>
              <div>1. 학부모님 니즈</div>
              <div>2. 연령 · 재원기간 · 프로젝트</div>
              <div>3. 사회성코칭</div>
              <div>4. 미술활동 / 작품 흐름</div>
              <div>5. 통합성장 해석 · 다음달 계획 · 3개월 뒤 기대 모습</div>
            </div>
          </div>
        </div>

        <div style={styles.grid}>
          <div>
            <section style={styles.card}>
              <h2 style={styles.sectionTitle}>브리핑 입력</h2>
              <div style={styles.sectionHint}>CSV 설문 결과를 업로드해 아이별 기본값을 만들고, 매월 브리핑에 반영합니다.</div>

              <div style={styles.row}>
                <Field label="학생명 직접 입력">
                  <input
                    style={styles.input}
                    value={form.student}
                    onChange={(event) => update("student", event.target.value)}
                    onBlur={(event) => {
                      const name = event.target.value.trim();
                      if (studentProfiles[name]) loadStudentProfile(name);
                    }}
                    placeholder="예: 최민준"
                  />
                </Field>

                <Field label="저장된 학생 불러오기">
                  <select style={styles.input} value="" onChange={(event) => loadStudentProfile(event.target.value)}>
                    <option value="">저장된 학생 선택</option>
                    {savedStudentNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div style={styles.row}>
                <Field label="날짜">
                  <input
                    type="date"
                    style={styles.input}
                    value={form.date}
                    onChange={(event) => update("date", event.target.value)}
                  />
                </Field>

                <div style={{ display: "flex", gap: 10, alignItems: "end" }}>
                  <button style={styles.primaryBtn} onClick={saveStudentProfile}>
                    학생 기본값 저장
                  </button>
              <button
  style={styles.secondaryBtn}
  onClick={() =>
    setForm((prev) => ({
      ...prev,
      parentNeeds: {
        homeDirection: "",
        classFlow: "",
        peerBehavior: "",
        longTermGoal: "",
        evidence: [],
      },
    }))
  }
>
  기본값 초기화
</button>
                </div>
              </div>

              <div style={styles.softBox}>
                <h3>구글폼 CSV 설문 파일 업로드</h3>
                <Field label="구글폼 응답 스프레드시트에서 CSV로 다운로드한 파일을 업로드하세요.">
                  <input type="file" accept=".csv" onChange={handleCSVUpload} style={styles.input} />
                </Field>

                {csvStudents.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                      <strong>분석된 학생 {csvStudents.length}명</strong>
                      <button style={styles.primaryBtn} onClick={saveAllCSVProfiles}>
                        전체 학생 기본값 저장
                      </button>
                    </div>

                    {csvStudents.map((student, index) => (
                      <div key={`${student.name}-${index}`} style={styles.recordCard}>
                        <strong>{student.name}</strong>
                        <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.7 }}>
                          가정에서 함께 세워가는 성장 방향: {student.parentNeeds.homeDirection}
                          <br />
                          수업 안에서 이어가는 성장 흐름: {student.parentNeeds.classFlow}
                          <br />
                          또래 관계 속에서 보완해가는 행동 변화: {student.parentNeeds.peerBehavior}
                          <br />
                          장기 목표: {student.parentNeeds.longTermGoal}
                        </div>
                        <button style={{ ...styles.secondaryBtn, marginTop: 10 }} onClick={() => applyCSVStudent(student)}>
                          이 학생 불러오기
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={styles.softBox}>
                <h3>아이별 3축 성장 기본값</h3>

                <div style={styles.row3}>
                  <Field label="가정에서 함께 세워가는 성장 방향">
                    <input
                      list="home-options"
                      style={styles.input}
                      value={form.parentNeeds.homeDirection}
                      onChange={(event) => updateNeeds("homeDirection", event.target.value)}
                    />
                  </Field>

                  <Field label="수업 안에서 이어가는 성장 흐름">
                    <input
                      list="class-options"
                      style={styles.input}
                      value={form.parentNeeds.classFlow}
                      onChange={(event) => updateNeeds("classFlow", event.target.value)}
                    />
                  </Field>

                  <Field label="또래 관계 속에서 보완해가는 행동 변화">
                    <input
                      list="peer-options"
                      style={styles.input}
                      value={form.parentNeeds.peerBehavior}
                      onChange={(event) => updateNeeds("peerBehavior", event.target.value)}
                    />
                  </Field>
                </div>

                <div style={{ marginTop: 16 }}>
                  <Field label="장기 목표">
                    <input
                      style={styles.input}
                      value={form.parentNeeds.longTermGoal}
                      onChange={(event) => updateNeeds("longTermGoal", event.target.value)}
                    />
                  </Field>
                </div>

                <datalist id="home-options">
                  {needOptions.homeDirection.map((value) => (
                    <option key={value} value={value} />
                  ))}
                </datalist>

                <datalist id="class-options">
                  {needOptions.classFlow.map((value) => (
                    <option key={value} value={value} />
                  ))}
                </datalist>

                <datalist id="peer-options">
                  {needOptions.peerBehavior.map((value) => (
                    <option key={value} value={value} />
                  ))}
                </datalist>

                {form.parentNeeds.evidence?.length > 0 && (
                  <div style={styles.previewBox}>
                    <strong>설문 기반 근거</strong>
                    {"\n"}
                    {form.parentNeeds.evidence.map((item) => `- ${item}`).join("\n")}
                  </div>
                )}
              </div>

              <div style={styles.row}>
                <Field label="재원기간">
                  <div style={styles.chips}>
                    {monthBands.map((month) => (
                      <Chip key={month} active={form.months === month} onClick={() => update("months", month)}>
                        {month}
                      </Chip>
                    ))}
                  </div>
                </Field>

                <Field label="재원기간별 키워드">
                  <div style={styles.chips}>
                    {(stageKeywords[form.months] || []).map((stage) => (
                      <Chip key={stage} active={form.stage === stage} onClick={() => update("stage", stage)}>
                        {stage}
                      </Chip>
                    ))}
                  </div>
                </Field>
              </div>

              <div style={styles.softBox}>
                <h3>연령 / 발달 기준</h3>

                <div style={styles.row3}>
                  <Field label="연령대">
                    <div style={styles.chips}>
                      {ageBands.map((age) => (
                        <Chip key={age} active={form.ageBand === age} onClick={() => update("ageBand", age)}>
                          {age}
                        </Chip>
                      ))}
                    </div>
                  </Field>

                  <Field label="메인키워드">
                    <div style={styles.chips}>
                      {Object.keys(ageDomains[form.ageBand] || {}).map((domain) => (
                        <Chip key={domain} active={form.ageDomain === domain} onClick={() => update("ageDomain", domain)}>
                          {domain}
                        </Chip>
                      ))}
                    </div>
                  </Field>

                  <Field label="파생키워드">
                    <div style={styles.chips}>
                      {(ageDomains[form.ageBand]?.[form.ageDomain] || []).map((keyword) => (
                        <Chip
                          key={keyword}
                          active={form.ageSubKeywords.includes(keyword)}
                          onClick={() => update("ageSubKeywords", toggle(form.ageSubKeywords, keyword))}
                        >
                          {keyword}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                </div>
              </div>

              <div style={styles.row}>
                <Field label="프로젝트">
                  <div style={styles.chips}>
                    {projects.map((project) => (
                      <Chip key={project} active={form.project === project} onClick={() => update("project", project)}>
                        {project}
                      </Chip>
                    ))}
                  </div>
                </Field>

                <Field label="프로젝트 키워드">
                  <div style={styles.chips}>
                    {(projectKeywords[form.project] || []).map((keyword) => (
                      <Chip
                        key={keyword}
                        active={form.projectKeywordsSelected.includes(keyword)}
                        onClick={() => update("projectKeywordsSelected", toggle(form.projectKeywordsSelected, keyword))}
                      >
                        {keyword}
                      </Chip>
                    ))}
                  </div>
                </Field>
              </div>

              <div style={styles.softBox}>
                <h3>사회성코칭</h3>

                <div style={styles.row}>
                  <Field label="메인키워드">
                    <div style={styles.chips}>
                      {Object.keys(socialMainKeywords).map((domain) => (
                        <Chip key={domain} active={form.socialDomain === domain} onClick={() => update("socialDomain", domain)}>
                          {domain}
                        </Chip>
                      ))}
                    </div>
                  </Field>

                  <Field label="파생키워드">
                    <div style={styles.chips}>
                      {(socialMainKeywords[form.socialDomain] || []).map((keyword) => (
                        <Chip
                          key={keyword}
                          active={form.socialKeywordsSelected.includes(keyword)}
                          onClick={() => update("socialKeywordsSelected", toggle(form.socialKeywordsSelected, keyword))}
                        >
                          {keyword}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                </div>
              </div>

              <div style={styles.softBox}>
                <Field label="작품 사진 첨부" hint="4장 권장">
                  <input type="file" accept="image/*" multiple onChange={onImageChange} style={styles.input} />

                  {form.images.length > 0 && (
                    <div style={styles.imageGrid}>
                      {form.images.map((image, index) => (
                        <img key={index} src={image.preview} alt={`preview-${index}`} style={styles.image} />
                      ))}
                    </div>
                  )}
                </Field>

                <div style={{ marginTop: 12 }}>
                  <button style={styles.secondaryBtn} onClick={runVisionAnalysis}>
                    {visionLoading ? "작품 분석 중..." : "작품 흐름 분석"}
                  </button>
                </div>

                {visionError && <div style={{ color: "#b91c1c", marginTop: 10 }}>{visionError}</div>}
              </div>

              <div style={styles.row}>
                <Field label="작품 흐름 메모">
                  <textarea
                    style={styles.textarea}
                    value={form.artworkFlow}
                    onChange={(event) => update("artworkFlow", event.target.value)}
                    placeholder={`예시) 처음에는 형태를 잡는 데 집중하던 모습이었고, 이후 반복하며 디테일을 보완하는 흐름으로 이어졌습니다. 작업을 이어가며 스스로 수정하고 발전시키려는 시도가 나타났습니다.`}
                  />
                </Field>

                <Field label="관찰 메모">
                  <textarea
                    style={styles.textarea}
                    value={form.memo}
                    onChange={(event) => update("memo", event.target.value)}
                    placeholder={`예시) 친구의 작업을 보며 따라 해보려는 시도를 보였고, 어려운 부분에서는 도움을 받아 다시 이어가려는 모습이 나타났습니다.

예시) 자신의 생각을 말로 표현하기보다 행동으로 먼저 드러내는 모습이 있었으며, 반복 경험을 통해 점차 조절하려는 시도가 보였습니다.`}
                  />
                </Field>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
                <button style={styles.primaryBtn} onClick={saveRecord}>
                  기록 저장
                </button>
                <button style={styles.secondaryBtn} onClick={() => copyText(prompt, "prompt")}>
                  {copied === "prompt" ? "프롬프트 복사됨" : "프롬프트 복사"}
                </button>
                <button style={styles.secondaryBtn} onClick={() => copyText(preview, "preview")}>
                  {copied === "preview" ? "초안 복사됨" : "브리핑 초안 복사"}
                </button>
              </div>
            </section>

            <section style={{ ...styles.card, marginTop: 24 }}>
              <h2 style={styles.sectionTitle}>GPT 프롬프트</h2>
              <div style={styles.promptBox}>{prompt}</div>
            </section>

            <section style={{ ...styles.card, marginTop: 24 }}>
              <h2 style={styles.sectionTitle}>브리핑 초안 미리보기</h2>
              <div style={styles.previewBox}>{preview}</div>
            </section>
          </div>

          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>저장된 기록</h2>
            <input
              style={styles.input}
              value={recordSearch}
              onChange={(event) => setRecordSearch(event.target.value)}
              placeholder="아이 이름 검색"
            />

            <div style={{ marginTop: 12 }}>
              <button style={styles.dangerBtn} onClick={() => setRecords([])}>
                전체 삭제
              </button>
            </div>

            {filteredRecords.length === 0 ? (
              <div style={styles.recordCard}>저장된 기록이 없습니다.</div>
            ) : (
              filteredRecords.map((record) => (
                <div key={record.id} style={styles.recordCard}>
                  <strong>{record.student || "이름 미입력"}</strong>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                    {record.date} · {record.project} · {record.stage}
                  </div>
                  <div style={styles.previewBox}>{record.preview}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                    <button style={styles.secondaryBtn} onClick={() => copyText(record.prompt, `p-${record.id}`)}>
                      프롬프트 복사
                    </button>
                    <button style={styles.secondaryBtn} onClick={() => copyText(record.preview, `v-${record.id}`)}>
                      초안 복사
                    </button>
                    <button style={styles.dangerBtn} onClick={() => setRecords((prev) => prev.filter((item) => item.id !== record.id))}>
                      삭제
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
