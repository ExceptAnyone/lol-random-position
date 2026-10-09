import { useEffect, useState } from 'react';

const POSITIONS = ['탑', '정글', '미드', '원딜', '서폿'];
const STORAGE_KEY = 'lol-random-position:names';
const EMPTY_NAMES = POSITIONS.map(() => '');

function loadNames() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) {
      return POSITIONS.map((_, i) => (typeof saved[i] === 'string' ? saved[i] : ''));
    }
  } catch {
    // 저장된 값이 없거나 손상된 경우 빈 값으로 시작
  }
  return EMPTY_NAMES;
}

// Fisher-Yates 셔플
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function App() {
  const [names, setNames] = useState(loadNames);
  const [assignment, setAssignment] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(names));
    } catch {
      // 저장 실패 시 무시 (시크릿 모드 등)
    }
  }, [names]);

  const handleChange = (index, value) => {
    setNames((prev) => prev.map((n, i) => (i === index ? value : n)));
  };

  const shuffle = () => {
    const filled = names.map((n) => n.trim()).filter(Boolean);
    setMessage('');

    if (filled.length === 0) {
      setMessage('친구 이름을 한 명 이상 입력해주세요.');
      setAssignment(null);
      return;
    }

    if (new Set(filled).size !== filled.length) {
      setMessage('중복된 이름이 있어요.');
      return;
    }

    // 인원이 5명 미만이면 남는 포지션은 비워둠
    const positions = shuffleArray(POSITIONS).slice(0, filled.length);
    const next = {};
    positions.forEach((position, i) => {
      next[position] = filled[i];
    });
    setAssignment(next);
  };

  const clearAll = () => {
    setNames(EMPTY_NAMES);
    setAssignment(null);
    setMessage('');
  };

  return (
    <main className="container">
      <h1>롤 포지션 랜덤 배치</h1>
      <p className="desc">친구들 이름을 입력하고 버튼을 누르면 포지션이 랜덤으로 배정됩니다.</p>

      <section className="card">
        <h2>참가자</h2>
        <div className="name-inputs">
          {names.map((name, i) => (
            <input
              key={i}
              type="text"
              placeholder={`친구 ${i + 1}`}
              value={name}
              maxLength={20}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') shuffle();
              }}
            />
          ))}
        </div>
        <div className="actions">
          <button className="primary" onClick={shuffle}>
            랜덤 배치
          </button>
          <button className="secondary" onClick={clearAll}>
            초기화
          </button>
        </div>
        <p className="message" role="alert">
          {message}
        </p>
      </section>

      <section className="card">
        <h2>결과</h2>
        <ul className="result">
          {POSITIONS.map((position) => {
            const player = assignment?.[position];
            return (
              <li key={position}>
                <span className="position">{position}</span>
                <span className={player ? 'player' : 'player empty'}>{player || '-'}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
