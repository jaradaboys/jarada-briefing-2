import React, { useMemo, useState } from "react";

/* ===================== 기본 데이터 ===================== */

const monthBands = [
  { label: "1~6개월", value: "1~6개월" },
  { label: "7~12개월", value: "7~12개월" },
  { label: "13~18개월", value: "13~18개월" },
  { label: "19~24개월 이상", value: "19~24개월 이상" },
];

const projects = ["연작", "협동작업", "100호캔버스"];

const projectKeywords = {
  연작: ["주제지속", "반복탐구", "표현확장", "몰입경험"],
  협동작업: ["협력경험", "의사소통", "갈등해결"],
  "100호캔버스": ["도전극복", "몰입지속", "완수경험"],
};

const ageDomains = {
  "6–7세": {
    감정이해: ["감정인식", "감정표현"],
  },
  "8–11세": {
    과제설정: ["목표정하기", "시작하기"],
  },
  "12–13세": {
    자기이해: ["강점이해", "약점이해"],
  },
};

/* ===================== 키워드 → 문장 ===================== */

const keywordPhraseMap = {
  감정인식: ["감정을 스스로 알아차리며 이어가는 모습"],
  감정표현: ["감정을 자연스럽게 표현해보는 모습"],
  목표정하기: ["스스로 방향을 정해보는 모습"],
  시작하기: ["망설임보다 먼저 시도해보는 모습"],
  주제지속: ["한 가지를 계속 이어가는 흐름"],
  반복탐구: ["반복하며 발전해보는 모습"],
  표현확장: ["표현을 넓혀가는 흐름"],
  몰입경험: ["작업에 깊게 몰입하는 모습"],
  협력경험: ["함께 맞춰가는 경험"],
  의사소통: ["의견을 주고받는 모습"],
  갈등해결: ["갈등을 풀어보는 경험"],
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildKeywordLine(keywords = []) {
  const phrases = keywords
    .map((k) => pick(keywordPhraseMap[k] || []))
    .filter(Boolean)
    .slice(0, 2);

  if (phrases.length >= 2) {
    return `오늘은 특히 ${phrases[0]}과 ${phrases[1]}이 함께 드러났습니다.`;
  }
  if (phrases.length === 1) {
    return `오늘은 특히 ${phrases[0]}이 인상적이었습니다.`;
  }
  return "";
}

/* ===================== 브리핑 생성 ===================== */

function generatePreview(form) {
  const keywordLine = buildKeywordLine([
    ...form.ageKeywords,
    ...form.projectKeywords,
  ]);

  return `
어머님, 안녕하세요.

${form.memo}

${keywordLine}

아이는 자신의 방식으로 시도하고 이어가며 성장의 흐름을 만들어가고 있습니다.

다음 시간에도 이 흐름이 자연스럽게 이어질 수 있도록 도울 예정입니다.
`;
}

/* ===================== UI ===================== */

export default function App() {
  const [form, setForm] = useState({
    student: "",
    months: "1~6개월",
    project: "연작",
    memo: "",
    ageKeywords: [],
    projectKeywords: [],
  });

  const preview = useMemo(() => generatePreview(form), [form]);

  const toggle = (list, value) =>
    list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value];

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      
      {/* 🔥 상단 */}
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
        }}
      >
        <h1>JARADA MVP 심화브리핑</h1>
        <p style={{ maxWidth: 500 }}>
          수업 안에서 드러난 아이의 행동과 작품의 흐름을 연결해,
          성장의 과정을 해석하고 학부모가 이해할 수 있는 언어로 브리핑을 구성합니다.
        </p>
      </div>

      {/* 입력 */}
      <div style={{ marginTop: 30 }}>
        <input
          placeholder="학생명"
          value={form.student}
          onChange={(e) =>
            setForm({ ...form, student: e.target.value })
          }
        />

        <select
          value={form.months}
          onChange={(e) =>
            setForm({ ...form, months: e.target.value })
          }
        >
          {monthBands.map((m) => (
            <option key={m.value}>{m.label}</option>
          ))}
        </select>

        <select
          value={form.project}
          onChange={(e) =>
            setForm({ ...form, project: e.target.value })
          }
        >
          {projects.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <textarea
          placeholder="관찰 메모"
          value={form.memo}
          onChange={(e) =>
            setForm({ ...form, memo: e.target.value })
          }
        />
      </div>

      {/* 키워드 */}
      <div>
        <h3>프로젝트 키워드</h3>
        {projectKeywords[form.project].map((k) => (
          <button
            key={k}
            onClick={() =>
              setForm({
                ...form,
                projectKeywords: toggle(form.projectKeywords, k),
              })
            }
          >
            {k}
          </button>
        ))}
      </div>

      {/* 결과 */}
      <div style={{ marginTop: 40, whiteSpace: "pre-wrap" }}>
        {preview}
      </div>
    </div>
  );
}
