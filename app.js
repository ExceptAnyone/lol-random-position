const POSITIONS = ['탑', '정글', '미드', '원딜', '서폿'];
const STORAGE_KEY = 'lol-random-position:names';

const inputsEl = document.getElementById('name-inputs');
const resultEl = document.getElementById('result');
const messageEl = document.getElementById('message');
const shuffleBtn = document.getElementById('shuffle-btn');
const clearBtn = document.getElementById('clear-btn');

function loadNames() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) {
      return POSITIONS.map((_, i) => (typeof saved[i] === 'string' ? saved[i] : ''));
    }
  } catch (e) {
    // 저장된 값이 없거나 손상된 경우 빈 값으로 시작
  }
  return POSITIONS.map(() => '');
}

function saveNames(names) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(names));
  } catch (e) {
    // 저장 실패 시 무시 (시크릿 모드 등)
  }
}

function getNames() {
  return Array.from(inputsEl.querySelectorAll('input'), (input) => input.value);
}

function renderInputs(names) {
  inputsEl.innerHTML = '';
  names.forEach((name, i) => {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `친구 ${i + 1}`;
    input.value = name;
    input.maxLength = 20;
    input.addEventListener('input', () => saveNames(getNames()));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') shuffle();
    });
    inputsEl.appendChild(input);
  });
}

function renderResult(assignment) {
  resultEl.innerHTML = '';
  POSITIONS.forEach((position) => {
    const li = document.createElement('li');
    const posEl = document.createElement('span');
    posEl.className = 'position';
    posEl.textContent = position;

    const playerEl = document.createElement('span');
    const player = assignment ? assignment[position] : null;
    playerEl.className = player ? 'player' : 'player empty';
    playerEl.textContent = player || '-';

    li.append(posEl, playerEl);
    resultEl.appendChild(li);
  });
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

function shuffle() {
  const names = getNames().map((n) => n.trim()).filter(Boolean);
  messageEl.textContent = '';

  if (names.length === 0) {
    messageEl.textContent = '친구 이름을 한 명 이상 입력해주세요.';
    renderResult(null);
    return;
  }

  if (new Set(names).size !== names.length) {
    messageEl.textContent = '중복된 이름이 있어요.';
    return;
  }

  // 인원이 5명 미만이면 남는 포지션은 비워둠
  const positions = shuffleArray(POSITIONS).slice(0, names.length);
  const assignment = {};
  positions.forEach((position, i) => {
    assignment[position] = names[i];
  });
  renderResult(assignment);
}

function clearAll() {
  const empty = POSITIONS.map(() => '');
  saveNames(empty);
  renderInputs(empty);
  renderResult(null);
  messageEl.textContent = '';
}

shuffleBtn.addEventListener('click', shuffle);
clearBtn.addEventListener('click', clearAll);

renderInputs(loadNames());
renderResult(null);
