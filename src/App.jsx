import React, { useEffect, useMemo, useState } from "react";

const monthBands = [
  { label: "1~6개월", value: "1~6개월" },
  { label: "7~12개월", value: "7~12개월" },
  { label: "13~18개월", value: "13~18개월" },
  { label: "19~24개월", value: "19~24개월" },
];

const stageKeywords = {
  "1~6개월": ["흥미 탐색", "공간 적응", "표현 시작", "강점 발견", "도구 경험", "짧은 연작 시작"],
  "7~12개월": ["연작 적응", "반복 경험", "디테일 강화", "재료 확장", "문제 해결", "1차 완성 경험"],
  "13~18개월": ["난이도 상승", "실패 경험", "재도전", "자기주도 강화", "대형 작업 준비", "대형 결과물 도전"],
  "19~24개월": ["관계 인식", "상호작용", "역할 수행", "협동 경험", "갈등 조율", "공동 성취"],
};

const ageBands = ["6–7세", "8–10세", "11–13세"];

const ageDomains = {
  "6–7세": {
    "조절": ["자기조절", "감정조절", "충동조절", "지연만족", "주의집중", "전환능력", "회복탄력성"],
    "규칙": ["경계인식", "일관성경험", "예측가능성", "결과인식", "순서지키기", "타인인식"],
    "안정감": ["애착안정", "정서안정", "부모신뢰", "환경예측성"],
  },
  "8–10세": {
    "생활자립": ["자기관리", "시간관리", "과제습관", "책임감", "루틴형성", "문제해결기초"],
    "기본사회성": ["협력", "규칙준수", "갈등경험", "조율능력", "양보", "공감기초", "관계형성"],
  },
  "11–13세": {
    "자립": ["심리적분리", "자기결정", "자기관리확장", "선택책임"],
    "정체성": ["자기탐색", "가치형성", "강점인식", "약점인식", "비교의식"],
    "심화경험": ["몰입", "성취", "실패경험", "회복경험", "지속성", "자기효능감", "또래관계", "친밀감"],
  },
};

const projects = ["연작", "100호캔버스", "협동작업"];

const projectKeywords = {
  "연작": ["주제지속", "반복탐구", "관찰심화", "표현확장", "몰입", "발전경험"],
  "협동작업": ["협력", "역할분담", "의사소통", "조율", "갈등해결", "공동책임"],
  "100호캔버스": ["스케일확장", "공간이해", "계획력", "몰입지속", "도전극복", "자기효능감"],
};

const coreKeywords = {
  자기조절: ["기다리기", "충동 멈추기", "감정 표현하기", "좌절 버티기", "도전 유지하기"],
  활동조절: ["도구 사용 조절", "힘/속도 조절", "반복 연습", "단계 수행", "끝까지 마무리"],
  관계인식: ["차례 지키기", "거리 조절", "방해 인식", "상황 살피기", "기본 배려"],
  상호작용: ["기다렸다 말하기", "요청하기", "도움 요청", "도움 주기", "긍정 피드백"],
  관계조율: ["허락 구하기", "양해 구하기", "의견 표현", "의견 수용", "사과하기", "갈등 해결"],
  협동: ["역할 수행", "역할 분담", "의견 조율", "협력 수행", "도움 주고받기"],
  자아실현: ["자발적 시작", "자발적 지속", "선택하기", "책임지기", "끝까지 완성"],
};

const easyWords = {
  자기조절: "스스로 행동을 조절해보는 힘",
  감정조절: "감정을 다뤄보는 힘",
  충동조절: "하고 싶은 마음을 잠시 멈춰보는 힘",
  지연만족: "기다려보는 경험",
  주의집중: "집중해서 이어가는 힘",
  전환능력: "상황에 맞게 바꿔보는 힘",
  회복탄력성: "어려운 뒤에도 다시 해보는 힘",
  경계인식: "상황과 공간을 살펴보는 힘",
  일관성경험: "같은 방식으로 반복해보는 경험",
  예측가능성: "다음을 예상해보는 경험",
  결과인식: "행동의 결과를 이해해보는 경험",
  순서지키기: "차례를 기다리고 지키는 모습",
  타인인식: "다른 사람을 의식하는 모습",
  생활자립: "스스로 해보는 생활 습관",
  기본사회성: "친구와 함께 지내는 기본 태도",
  자립: "스스로 결정하고 책임지는 모습",
  정체성: "자신을 알아가는 과정",
  심화경험: "한 가지를 깊이 있게 해보는 경험",
  협력: "함께 해보는 경험",
  규칙준수: "약속을 지켜보는 모습",
  갈등경험: "부딪히는 상황을 겪어보는 경험",
  조율능력: "생각을 맞춰보는 힘",
  양보: "한 번 물러나보는 경험",
  공감기초: "다른 마음을 헤아려보는 시작",
  관계형성: "친구와 관계를 만들어가는 과정",
  심리적분리: "부모와 생각이 조금씩 분리되는 과정",
  자기결정: "스스로 선택해보는 경험",
  선택책임: "선택한 것을 책임져보는 태도",
  몰입: "깊이 빠져드는 경험",
  성취: "해냈다는 느낌",
  실패경험: "뜻대로 되지 않는 경험",
  회복경험: "다시 일어나 해보는 경험",
  지속성: "계속 이어가는 힘",
  자기효능감: "할 수 있다고 느끼는 자신감",
  또래관계: "친구 관계 속 여러 경험",
  친밀감: "가까운 친구와 느끼는 편안함",
};

const defaultForm = {
  student: "",
  date: new Date().toISOString().slice(0, 10),
  months: "1~6개월",
  stage: "흥미 탐색",
  ageBand: "6–7세",
  ageDomain: "조절",
  ageSubKeyword: "자기조절",
  project: "연작",
  projectKeyword: "주제지속",
  core: "자기조절",
  action: "기다리기",
  memo: "",
  images: [],
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function refineMemo(text) {
  if (!text) return "";
  return text
    .replace(/만드는 중/g, "만들어가는 모습")
    .replace(/작업 중/g, "작업을 이어가는 모습")
    .replace(/구상/g, "구상하는 모습")
    .replace(/스케치/g, "스케치해보는 모습")
    .replace(/이어서/g, "이어")
    .trim();
}

function splitMemo(memo) {
  return memo
    .replace(/\n/g, ",")
    .split(/[,.]/)
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, 3)
    .map(refineMemo);
}

function actionSentence(action) {
  const map = {
    "기다리기": "기다려보는 모습",
    "충동 멈추기": "하고 싶은 행동을 잠시 멈춰보는 모습",
    "감정 표현하기": "감정을 말이나 행동으로 표현해보는 모습",
    "좌절 버티기": "쉽지 않은 순간에도 버텨보는 모습",
    "도전 유지하기": "어려워도 계속 시도해보는 모습",
    "도구 사용 조절": "도구를 상황에 맞게 조절하는 모습",
    "힘/속도 조절": "힘과 속도를 조절해보는 모습",
    "반복 연습": "같은 과정을 반복해보는 모습",
    "단계 수행": "순서에 맞춰 따라가는 모습",
    "끝까지 마무리": "끝까지 마무리해보는 모습",
    "차례 지키기": "차례를 지켜보는 모습",
    "거리 조절": "친구와의 거리를 조절하는 모습",
    "방해 인식": "다른 사람에게 방해가 될 수 있는 상황을 알아차리는 모습",
    "상황 살피기": "주변 상황을 살펴보는 모습",
    "기본 배려": "기본적인 배려를 보여주는 모습",
    "기다렸다 말하기": "기다렸다가 말해보는 모습",
    "요청하기": "필요한 것을 요청해보는 모습",
    "도움 요청": "도움이 필요할 때 요청해보는 모습",
    "도움 주기": "다른 친구를 도와주는 모습",
    "긍정 피드백": "긍정적으로 반응해주는 모습",
    "허락 구하기": "먼저 허락을 구해보는 모습",
    "양해 구하기": "상황에 맞게 양해를 구해보는 모습",
    "의견 표현": "자기 생각을 말해보는 모습",
    "의견 수용": "다른 의견을 받아들이는 모습",
    "사과하기": "사과가 필요한 상황에서 표현해보는 모습",
    "갈등 해결": "부딪힌 상황을 풀어보는 경험",
    "역할 수행": "맡은 역할을 해보는 모습",
    "역할 분담": "역할을 나누어 맡아보는 경험",
    "의견 조율": "의견을 맞춰보는 모습",
    "협력 수행": "함께 결과를 만들어가는 모습",
    "도움 주고받기": "서로 도움을 주고받는 모습",
    "자발적 시작": "스스로 시작해보는 모습",
    "자발적 지속": "스스로 이어가려는 모습",
    "선택하기": "스스로 선택해보는 모습",
    "책임지기": "선택한 것을 책임지려는 모습",
    "끝까지 완성": "끝까지 완성해보는 모습",
  };
  return map[action] || action;
}

function titleFor(form) {
  const byProject = {
    "연작": [
      "끝까지 이어가는 힘이 보인 연작",
      "한 가지를 깊이 있게 이어간 연작",
      "스스로 발전시켜가는 흐름이 보인 연작",
    ],
    "협동작업": [
      "함께 맞춰가며 완성한 협동작업",
      "친구와 함께 해보는 경험이 보인 협동작업",
      "관계 속에서 배워간 협동작업",
    ],
    "100호캔버스": [
      "도전하며 완성해가는 100호캔버스",
      "크게 시도해보는 경험이 보인 100호캔버스",
      "몰입과 도전이 함께한 100호캔버스",
    ],
  };
  return pick(byProject[form.project] || ["오늘의 성장 브리핑"]);
}

function meaningFor(form) {
  const stageEasy = easyWords[form.ageSubKeyword] || form.ageSubKeyword;
  const ageLine = {
    "6–7세": "이 시기에는 규칙과 기다림을 자연스럽게 연습해가는 과정이 중요합니다.",
    "8–10세": "이 시기에는 스스로 해보는 과정에서 시행착오를 겪으며 배우는 경험이 중요합니다.",
    "11–13세": "이 시기에는 자기 생각이 분명해지는 만큼 선택과 관계를 함께 배워가는 경험이 중요합니다.",
  }[form.ageBand];

  const projectLine = {
    "연작": "연작은 한 가지를 이어가며 몰입과 발전 경험을 쌓는 데 의미가 있습니다.",
    "협동작업": "협동작업은 또래와 함께 맞춰가며 관계 속 경험을 배우는 데 의미가 있습니다.",
    "100호캔버스": "100호캔버스는 크게 시도하고 끝까지 이어가며 도전 경험을 쌓는 데 의미가 있습니다.",
  }[form.project];

  return `${form.stage} 단계 안에서 ${stageEasy}과 연결되는 모습이 조금씩 쌓이고 있다는 점이 의미 있었습니다. ${projectLine} ${ageLine}`;
}

function nextPlanFor(form) {
  const projectPlan = {
    "연작": "다음 시간에는 오늘 이어간 흐름을 바탕으로 주제를 더 깊이 발전시켜볼 수 있도록 도울 예정입니다.",
    "협동작업": "다음 시간에는 함께 맞춰가는 경험이 자연스럽게 이어질 수 있도록 역할과 관계 흐름을 더 살펴볼 예정입니다.",
    "100호캔버스": "다음 시간에는 크게 시도하는 과정 안에서 스스로 계획하고 이어가는 힘이 더 드러날 수 있도록 도울 예정입니다.",
  };
  return projectPlan[form.project] || "다음 시간에도 오늘의 흐름을 이어가며 성장의 경험을 쌓을 수 있도록 도울 예정입니다.";
}

function imagePlanLine(imageCount) {
  if (imageCount >= 4) {
    return "첨부된 작품 흐름을 함께 보면, 아이가 시도하고 수정하며 조금씩 발전시켜가는 과정까지 더 분명하게 살펴볼 수 있었습니다.";
  }
  if (imageCount > 0) {
    return "첨부된 작품 사진을 바탕으로 오늘의 시도와 결과를 함께 살펴볼 수 있었습니다.";
  }
  return "";
}

function generatePrompt(form) {
  return `너는 자라다교육의 남아 전문 상담 교사다.
입력된 정보를 바탕으로 학부모에게 전달할 상담 브리핑을 작성하라.

[브리핑의 핵심 방향]
- 브리핑은 아이의 성장에 초점을 맞춘다.
- 재원기간별, 연령별, 프로젝트별 메인 키워드를 중심으로 현재 아이에게 필요한 경험이 무엇인지 자연스럽게 담아낸다.
- 오늘 수업의 교육적 의미와 아이의 성장 흐름이 보이도록 작성한다.
- 다음 시간에 어떤 방향으로 이어갈지 계획이 느껴지도록 작성한다.
- 메모가 짧더라도 교사의 관찰과 해석을 통해 전문적인 상담 브리핑으로 완성한다.

[작성 기준]
1. 어려운 용어는 학부모가 이해하기 쉬운 말로 풀어서 설명한다.
2. 평가가 아니라 관찰을 중심으로 쓴다.
3. 아이의 행동을 단순히 적는 데서 끝나지 않고, 왜 그런 모습이 나왔는지 한 번 더 생각하는 교사의 시선이 드러나야 한다.
4. 문장은 짧아도 의미가 분명해야 한다.
5. 아이의 가능성을 긍정적으로 전달하되, 과장하지 않고 신뢰감 있게 작성한다.
6. 메모가 짧더라도 그 안의 의미를 잘 해석해 자연스럽고 전문적인 상담 브리핑으로 이어가야 한다.
7. 어색한 표현 없이, 실제 교사가 학부모에게 보내는 것처럼 자연스럽게 작성한다.
8. 사진이 첨부된 경우 결과만 보지 말고 과정의 흐름과 변화도 함께 반영한다.

[문장 구성 원칙]
- 오늘 수업에서 보인 구체적인 장면
- 그 장면의 교육적 의미
- 현재 재원기간/연령/프로젝트 흐름 안에서의 성장 해석
- 다음 시간에 어떻게 이어갈지에 대한 계획

[주의사항]
- 어려운 전문용어를 그대로 쓰지 않는다.
- 같은 표현을 반복하지 않는다.
- '효능감', '소속감' 같은 단어는 꼭 필요한 경우에만 자연스럽게 풀어서 사용한다.
- 아이를 단정하거나 평가하지 않는다.
- 메모를 그대로 옮기지 말고, 의미를 해석해 문장으로 재구성한다.
- 제목은 짧고 눈에 띄되, 수업의 핵심 의미가 담기게 작성한다.

[출력 형식]
- 학부모가 읽기 쉬운 자연스러운 문단
- 제목 1줄 + 본문 5~7문장
- 짧지만 의미가 정확한 문장
- 마지막 문장에는 다음 시간의 방향이 자연스럽게 담기도록 작성
- 어머니(또는 학부모님)께 인사하는 문장으로 시작

[입력값]
- 학생명: ${form.student}
- 재원기간: ${form.months}
- 재원기간별 키워드: ${form.stage}
- 연령대: ${form.ageBand}
- 발달 영역: ${form.ageDomain}
- 세부 발달 키워드: ${form.ageSubKeyword}
- 프로젝트: ${form.project}
- 프로젝트 키워드: ${form.projectKeyword}
- 사회성훈련: ${form.core}
- 행동 키워드: ${form.action}
- 관찰 메모: ${form.memo}
- 첨부 이미지 수: ${form.images.length}장

위 기준에 따라, 학부모에게 바로 전달할 수 있는 자연스럽고 전문적인 브리핑을 작성하라.`;
}

function generatePreview(form) {
  if (!form.memo.trim()) return "관찰 메모를 입력하면 브리핑 초안이 여기에 표시됩니다.";

  const memoParts = splitMemo(form.memo);
  const title = titleFor(form);
  const greeting = "어머님, 안녕하세요. 오늘 수업 내용을 공유드립니다.";
  const projectLine = `${form.project} 활동 안에서 ${form.projectKeyword}와 관련된 흐름이 이어졌고, ${actionSentence(form.action)} 장면이 자연스럽게 드러났습니다.`;

  let observationLine = "";
  if (memoParts.length >= 2) {
    observationLine = `${memoParts[0]}이 보였고, 이어 ${memoParts[1]} 흐름으로 자연스럽게 연결되었습니다. 짧은 장면 안에서도 아이가 다음 과정으로 스스로 이어가려는 의도가 드러났습니다.`;
  } else if (memoParts.length === 1) {
    observationLine = `${memoParts[0]}이 특히 인상적이었고, 그 안에서 아이가 자신의 방식으로 계속 시도해보는 모습이 보였습니다. 메모는 짧지만 오늘 수업의 중심 장면이 분명하게 드러난 순간이었습니다.`;
  }

  const meaningLine = meaningFor(form);
  const imageLine = imagePlanLine(form.images.length);
  const nextLine = nextPlanFor(form);

  return `"${title}"

${greeting}

${projectLine}
${observationLine}
${meaningLine}
${imageLine}
${nextLine}`;
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-slate-700">{label}</div>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border px-3 py-2 text-sm transition ${
        active ? "border-slate-900 bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

export default function App() {
  const [form, setForm] = useState(defaultForm);
  const [records, setRecords] = useState([]);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("jarada-briefing-records-v3");
    if (saved) setRecords(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("jarada-briefing-records-v3", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    const list = stageKeywords[form.months] || [];
    if (!list.includes(form.stage)) setForm((prev) => ({ ...prev, stage: list[0] || "" }));
  }, [form.months]);

  useEffect(() => {
    const domains = Object.keys(ageDomains[form.ageBand] || {});
    if (!domains.includes(form.ageDomain)) {
      const nextDomain = domains[0] || "";
      const nextSub = ageDomains[form.ageBand]?.[nextDomain]?.[0] || "";
      setForm((prev) => ({ ...prev, ageDomain: nextDomain, ageSubKeyword: nextSub }));
      return;
    }
    const subs = ageDomains[form.ageBand]?.[form.ageDomain] || [];
    if (!subs.includes(form.ageSubKeyword)) setForm((prev) => ({ ...prev, ageSubKeyword: subs[0] || "" }));
  }, [form.ageBand, form.ageDomain]);

  useEffect(() => {
    const list = projectKeywords[form.project] || [];
    if (!list.includes(form.projectKeyword)) setForm((prev) => ({ ...prev, projectKeyword: list[0] || "" }));
  }, [form.project]);

  useEffect(() => {
    const list = coreKeywords[form.core] || [];
    if (!list.includes(form.action)) setForm((prev) => ({ ...prev, action: list[0] || "" }));
  }, [form.core]);

  const prompt = useMemo(() => generatePrompt(form), [form]);
  const preview = useMemo(() => generatePreview(form), [form]);

  const copyText = async (text, key) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  const saveRecord = () => {
    if (!form.memo.trim()) return alert("관찰 메모를 입력해 주세요.");
    const item = {
      id: crypto.randomUUID(),
      ...form,
      prompt,
      preview,
    };
    setRecords((prev) => [item, ...prev]);
  };

  const onImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const results = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        results.push(reader.result);
        if (results.length === files.length) {
          setForm((prev) => ({ ...prev, images: results.slice(0, 8) }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="mb-8 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-2 text-sm font-semibold text-slate-500">자라다 브리핑 MVP</div>
            <h1 className="text-3xl font-bold tracking-tight">교사용 브리핑 입력 + 프롬프트 생성기</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              재원기간별, 연령별, 프로젝트별 키워드를 중심으로 교육적 의미와 다음 시간 계획까지 담긴 브리핑 초안을 만들 수 있습니다.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm">
            <div className="text-sm font-semibold text-slate-300">작성 기준</div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-100">
              <li>• 어려운 용어는 쉽게 풀어 설명</li>
              <li>• 평가보다 관찰 중심</li>
              <li>• 짧은 메모도 자연스럽게 해석</li>
              <li>• 다음 시간의 계획까지 포함</li>
              <li>• 작품 사진은 최소 4장 첨부 권장</li>
            </ul>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
          <div className="space-y-6">
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold">브리핑 입력</h2>
              <p className="mt-1 text-sm text-slate-500">교사가 선택과 짧은 메모만 입력하면 됩니다.</p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Field label="학생명">
                  <input
                    value={form.student}
                    onChange={(e) => setForm((prev) => ({ ...prev, student: e.target.value }))}
                    placeholder="예: 최민준"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                  />
                </Field>
                <Field label="날짜">
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                  />
                </Field>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 p-4">
                <div className="mb-3 text-sm font-semibold text-slate-800">연령 / 발달 기준</div>
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="연령대">
                    <div className="flex flex-wrap gap-2">
                      {ageBands.map((band) => (
                        <Chip key={band} active={form.ageBand === band} onClick={() => setForm((prev) => ({ ...prev, ageBand: band }))}>
                          {band}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                  <Field label="발달 영역">
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(ageDomains[form.ageBand] || {}).map((domain) => (
                        <Chip
                          key={domain}
                          active={form.ageDomain === domain}
                          onClick={() => setForm((prev) => ({ ...prev, ageDomain: domain, ageSubKeyword: ageDomains[form.ageBand][domain][0] }))}
                        >
                          {domain}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                  <Field label="세부 발달 키워드">
                    <div className="flex flex-wrap gap-2">
                      {(ageDomains[form.ageBand]?.[form.ageDomain] || []).map((sub) => (
                        <Chip key={sub} active={form.ageSubKeyword === sub} onClick={() => setForm((prev) => ({ ...prev, ageSubKeyword: sub }))}>
                          {sub}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Field label="프로젝트">
                  <div className="flex flex-wrap gap-2">
                    {projects.map((project) => (
                      <Chip key={project} active={form.project === project} onClick={() => setForm((prev) => ({ ...prev, project }))}>
                        {project}
                      </Chip>
                    ))}
                  </div>
                </Field>
                <Field label="프로젝트 키워드">
                  <div className="flex flex-wrap gap-2">
                    {(projectKeywords[form.project] || []).map((keyword) => (
                      <Chip key={keyword} active={form.projectKeyword === keyword} onClick={() => setForm((prev) => ({ ...prev, projectKeyword: keyword }))}>
                        {keyword}
                      </Chip>
                    ))}
                  </div>
                </Field>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Field label="재원기간">
                  <div className="flex flex-wrap gap-2">
                    {monthBands.map((band) => (
                      <Chip key={band.value} active={form.months === band.value} onClick={() => setForm((prev) => ({ ...prev, months: band.value }))}>
                        {band.label}
                      </Chip>
                    ))}
                  </div>
                </Field>
                <Field label="재원기간별 키워드">
                  <div className="flex flex-wrap gap-2">
                    {(stageKeywords[form.months] || []).map((stage) => (
                      <Chip key={stage} active={form.stage === stage} onClick={() => setForm((prev) => ({ ...prev, stage }))}>
                        {stage}
                      </Chip>
                    ))}
                  </div>
                </Field>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Field label="사회성훈련">
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(coreKeywords).map((core) => (
                      <Chip key={core} active={form.core === core} onClick={() => setForm((prev) => ({ ...prev, core, action: coreKeywords[core][0] }))}>
                        {core}
                      </Chip>
                    ))}
                  </div>
                </Field>
                <Field label="행동 키워드">
                  <div className="flex flex-wrap gap-2">
                    {(coreKeywords[form.core] || []).map((action) => (
                      <Chip key={action} active={form.action === action} onClick={() => setForm((prev) => ({ ...prev, action }))}>
                        {action}
                      </Chip>
                    ))}
                  </div>
                </Field>
              </div>

              <div className="mt-5">
                <Field label="작품 사진 첨부 (최소 4장 권장)">
                  <input type="file" accept="image/*" multiple onChange={onImageChange} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
                  {form.images.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                      {form.images.map((img, idx) => (
                        <img key={idx} src={img} alt={`preview-${idx}`} className="h-32 w-full rounded-xl object-cover ring-1 ring-slate-200" />
                      ))}
                    </div>
                  )}
                </Field>
              </div>

              <div className="mt-5">
                <Field label="관찰 메모">
                  <textarea
                    value={form.memo}
                    onChange={(e) => setForm((prev) => ({ ...prev, memo: e.target.value }))}
                    rows={5}
                    placeholder="예: 도라에몽 다리 만드는 중, 다음 시간 아이디어 스케치 구상"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
                  />
                </Field>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={saveRecord} className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">기록 저장</button>
                <button onClick={() => copyText(prompt, "prompt")} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
                  {copied === "prompt" ? "프롬프트 복사됨" : "프롬프트 복사"}
                </button>
                <button onClick={() => copyText(preview, "preview")} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
                  {copied === "preview" ? "초안 복사됨" : "브리핑 초안 복사"}
                </button>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold">GPT 프롬프트</h2>
              <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">{prompt}</pre>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold">브리핑 초안 미리보기</h2>
              <div className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{preview}</div>
            </section>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-semibold">저장된 기록</h2>
            <div className="mt-4 space-y-3">
              {records.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">저장된 기록이 없습니다.</div>
              ) : (
                records.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="font-semibold">{item.student || "이름 미입력"}</div>
                    <div className="mt-1 text-xs text-slate-500">{item.date} · {item.project} · {item.stage}</div>
                    <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{item.memo}</div>
                    <div className="mt-2 text-xs text-slate-500">첨부 사진 {item.images?.length || 0}장</div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => copyText(item.prompt, `p-${item.id}`)} className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">
                        {copied === `p-${item.id}` ? "복사됨" : "프롬프트 복사"}
                      </button>
                      <button onClick={() => copyText(item.preview, `v-${item.id}`)} className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">
                        {copied === `v-${item.id}` ? "복사됨" : "초안 복사"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
