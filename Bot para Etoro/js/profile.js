// ========================================
// PROFILE.JS - Cuestionario de Perfil de Riesgo
// ========================================

const QUIZ_QUESTIONS = [
  {
    question: '¿Cuánto dinero podés invertir sin afectar tus gastos del mes?',
    options: [
      { text: 'Menos de $50', score: 1 },
      { text: 'Entre $50 y $200', score: 2 },
      { text: 'Entre $200 y $500', score: 3 },
      { text: 'Más de $500', score: 4 }
    ]
  },
  {
    question: '¿Cuánto tiempo podés dejar tu dinero invertido sin necesitarlo?',
    options: [
      { text: 'Menos de 6 meses', score: 1 },
      { text: 'De 1 a 2 años', score: 2 },
      { text: 'De 3 a 5 años', score: 3 },
      { text: 'Más de 5 años', score: 4 }
    ]
  },
  {
    question: 'Si tu inversión baja un 20% en un mes, ¿qué harías?',
    options: [
      { text: '😰 Retiro todo inmediatamente', score: 1 },
      { text: '😟 Espero pero con nervios', score: 2 },
      { text: '😌 Espero tranquilo, es normal', score: 3 },
      { text: '💪 Aprovecho y compro más barato', score: 4 }
    ]
  },
  {
    question: '¿Cuál es tu objetivo principal al invertir?',
    options: [
      { text: '🛡️ Proteger mi dinero de la inflación', score: 1 },
      { text: '🌱 Crecimiento lento pero seguro', score: 2 },
      { text: '📈 Crecimiento moderado y constante', score: 3 },
      { text: '🚀 Máximo crecimiento posible', score: 4 }
    ]
  },
  {
    question: '¿Cuánta experiencia tenés con inversiones?',
    options: [
      { text: 'Es mi primera vez', score: 1 },
      { text: 'He leído sobre el tema', score: 2 },
      { text: 'He invertido un poco', score: 3 },
      { text: 'Tengo experiencia', score: 4 }
    ]
  }
];

const PROFILE_TYPES = {
  conservador: {
    icon: '🛡️',
    name: 'Conservador',
    color: '#22c55e',
    description: 'Priorizás la seguridad de tu dinero. Te recomendamos inversiones estables con buen historial y bajo riesgo, como ETFs del S&P 500, oro y acciones de empresas con dividendos sólidos.',
    investments: ['VOO', 'SPY', 'VTI', 'GLD', 'GOLD', 'JNJ', 'KO', 'JPM']
  },
  moderado: {
    icon: '⚖️',
    name: 'Moderado',
    color: '#3b82f6',
    description: 'Buscás un balance entre seguridad y crecimiento. Te recomendamos una mezcla de ETFs estables con algunas acciones tecnológicas fuertes.',
    investments: ['VOO', 'QQQ', 'VTI', 'GLD', 'AAPL', 'MSFT', 'GOOGL', 'JPM']
  },
  crecimiento: {
    icon: '🚀',
    name: 'Crecimiento',
    color: '#f59e0b',
    description: 'Estás dispuesto a asumir más riesgo para buscar mayor crecimiento. Te recomendamos ETFs tecnológicos y acciones líderes en inteligencia artificial y tecnología.',
    investments: ['QQQ', 'VGT', 'NVDA', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META']
  }
};

let quizState = { current: 0, answers: [] };

function getProfileType(totalScore) {
  if (totalScore <= 8) return 'conservador';
  if (totalScore <= 14) return 'moderado';
  return 'crecimiento';
}

function initQuiz() {
  quizState = { current: 0, answers: [] };
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const container = document.getElementById('quiz-content');
  if (!container) return;

  if (quizState.current >= QUIZ_QUESTIONS.length) {
    showQuizResult();
    return;
  }

  const q = QUIZ_QUESTIONS[quizState.current];
  const progress = ((quizState.current) / QUIZ_QUESTIONS.length) * 100;

  container.innerHTML = `
    <div class="quiz-progress"><div class="quiz-progress-bar" style="width:${progress}%"></div></div>
    <p class="quiz-step">Pregunta ${quizState.current + 1} de ${QUIZ_QUESTIONS.length}</p>
    <h2 class="quiz-question">${q.question}</h2>
    <div class="quiz-options">
      ${q.options.map((opt, i) => `
        <button class="quiz-option" data-score="${opt.score}" data-index="${i}" onclick="selectQuizOption(this)">
          ${opt.text}
        </button>
      `).join('')}
    </div>
  `;
}

function selectQuizOption(btn) {
  const score = parseInt(btn.dataset.score);
  quizState.answers.push(score);
  
  // Visual feedback
  btn.classList.add('selected');
  document.querySelectorAll('.quiz-option').forEach(b => b.style.pointerEvents = 'none');
  
  setTimeout(() => {
    quizState.current++;
    renderQuizQuestion();
  }, 400);
}

function showQuizResult() {
  const total = quizState.answers.reduce((a, b) => a + b, 0);
  const profileKey = getProfileType(total);
  const profile = PROFILE_TYPES[profileKey];

  // Save to localStorage
  localStorage.setItem('etoro_profile', profileKey);
  localStorage.setItem('etoro_profile_score', total);

  const container = document.getElementById('quiz-content');
  container.innerHTML = `
    <div class="quiz-progress"><div class="quiz-progress-bar" style="width:100%"></div></div>
    <div class="profile-result" style="animation: fadeIn 0.5s">
      <div class="profile-icon">${profile.icon}</div>
      <h2 class="profile-type" style="color:${profile.color}">Perfil: ${profile.name}</h2>
      <p class="profile-desc">${profile.description}</p>
      <div style="margin-top:24px; display:flex; gap:12px; justify-content:center; flex-wrap:wrap">
        <button class="btn btn-primary" onclick="showProfileInvestments('${profileKey}')">
          📊 Ver mis inversiones recomendadas
        </button>
        <button class="btn btn-secondary" onclick="initQuiz()">
          🔄 Repetir cuestionario
        </button>
      </div>
    </div>
  `;
}

function showProfileInvestments(profileKey) {
  const profile = PROFILE_TYPES[profileKey];
  if (profile) {
    currentFilter = 'all';
    navigateTo('dashboard');
    setTimeout(() => {
      const filtered = INVESTMENTS.filter(inv => profile.investments.includes(inv.symbol));
      renderInvestments(filtered);
    }, 100);
  }
}

function getSavedProfile() {
  return localStorage.getItem('etoro_profile');
}
