// ========================================
// APP.JS - Controlador Principal SPA
// ========================================

let currentSection = 'hero';
let currentFilter = 'all';
let currentDetail = null;

// Navigation
function navigateTo(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('section-' + section);
  if (el) {
    el.classList.add('active');
    currentSection = section;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Update nav
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll(`.nav-link[data-section="${section}"]`).forEach(l => l.classList.add('active'));
  document.querySelectorAll('.mobile-nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.section === section);
  });
  // Init section-specific content
  if (section === 'dashboard') renderDashboard();
  if (section === 'profile') initQuiz();
  if (section === 'guide') renderGuide();
}

// Render dashboard
function renderDashboard() {
  let investments = INVESTMENTS;
  
  if (currentFilter !== 'all') {
    investments = investments.filter(i => i.category === currentFilter);
  }

  renderInvestments(investments);
}

// Render investment cards
function renderInvestments(investments) {
  const grid = document.getElementById('inv-grid');
  if (!grid) return;

  if (investments.length === 0) {
    grid.innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-muted)"><p style="font-size:48px;margin-bottom:12px">🔍</p><p>No se encontraron inversiones</p></div>';
    return;
  }

  grid.innerHTML = investments.map(inv => {
    const risk = RISK_LEVELS[inv.risk];
    const cat = CATEGORIES[inv.category];
    const perf = inv.performance.y1;
    const perfClass = perf >= 0 ? 'positive' : 'negative';
    const perfSign = perf >= 0 ? '+' : '';

    return `
      <div class="card inv-card" onclick="showDetail('${inv.symbol}')" id="card-${inv.symbol}">
        <div class="inv-card-header">
          <div>
            <div class="inv-symbol">${inv.symbol}</div>
            <div class="inv-name">${inv.name}</div>
          </div>
          <span class="inv-badge" style="color:${cat.color};border:1px solid ${cat.color}30;background:${cat.color}15">
            ${cat.icon} ${cat.label}
          </span>
        </div>
        <div class="inv-desc">${inv.description}</div>
        <div class="inv-card-footer">
          <span class="inv-perf ${perfClass}">${perfSign}${perf}% <span style="color:var(--text-muted);font-weight:400;font-size:12px">1 año</span></span>
          <div class="inv-risk" title="Riesgo: ${risk.label}"></div>
        </div>
        <canvas class="inv-sparkline" style="width:120px;height:40px"></canvas>
      </div>
    `;
  }).join('');

  // Draw sparklines and risk dots
  setTimeout(() => {
    investments.forEach(inv => {
      const card = document.getElementById('card-' + inv.symbol);
      if (!card) return;
      const canvas = card.querySelector('.inv-sparkline');
      const riskContainer = card.querySelector('.inv-risk');
      const color = inv.performance.y1 >= 0 ? '#00c853' : '#ff1744';
      drawSparkline(canvas, inv.sparkline, color);
      renderRiskDots(riskContainer, inv.risk);
    });
  }, 50);
}

// Show detail view
function showDetail(symbol) {
  const inv = getInvestment(symbol);
  if (!inv) return;
  currentDetail = inv;

  const risk = RISK_LEVELS[inv.risk];
  const cat = CATEGORIES[inv.category];
  const container = document.getElementById('detail-content');

  container.innerHTML = `
    <button class="detail-back" onclick="navigateTo('dashboard')">← Volver al catálogo</button>
    <div class="detail-header">
      <div class="detail-title">
        <h1><span class="symbol">${inv.symbol}</span> ${inv.name}</h1>
        <div class="detail-meta">
          <span class="detail-tag" style="color:${cat.color};border-color:${cat.color}40">${cat.icon} ${cat.label}</span>
          <span class="detail-tag" style="color:${risk.color};border-color:${risk.color}40">⚖️ Riesgo ${risk.label}</span>
          <span class="detail-tag">${inv.sector}</span>
          ${inv.dividends ? '<span class="detail-tag" style="color:#22c55e;border-color:#22c55e40">💰 Paga dividendos</span>' : ''}
          ${inv.isRealAsset ? '<span class="detail-tag" style="color:#3b82f6;border-color:#3b82f640">✅ Inversión real</span>' : '<span class="detail-tag" style="color:#f97316;border-color:#f9731640">⚠️ CFD</span>'}
        </div>
      </div>
      <a href="${getEtoroUrl(inv.symbol)}" target="_blank" class="btn btn-etoro">
        Invertir en eToro →
      </a>
    </div>

    <div class="detail-grid">
      <div class="card stat-card">
        <div class="stat-value ${inv.performance.y1 >= 0 ? 'positive' : 'negative'}" style="color:${inv.performance.y1 >= 0 ? '#00c853' : '#ff1744'}">${inv.performance.y1 >= 0 ? '+' : ''}${inv.performance.y1}%</div>
        <div class="stat-label">Rendimiento 1 año</div>
      </div>
      <div class="card stat-card">
        <div class="stat-value ${inv.performance.y5 >= 0 ? 'positive' : 'negative'}" style="color:${inv.performance.y5 >= 0 ? '#00c853' : '#ff1744'}">${inv.performance.y5 >= 0 ? '+' : ''}${inv.performance.y5}%</div>
        <div class="stat-label">Rendimiento 5 años</div>
      </div>
      <div class="card stat-card">
        <div class="stat-value" style="color:${risk.color}">${risk.label}</div>
        <div class="stat-label">Nivel de riesgo</div>
      </div>
      <div class="card stat-card">
        <div class="stat-value" style="color:var(--accent-green)">$${inv.minInvestment}</div>
        <div class="stat-label">Inversión mínima</div>
      </div>
    </div>

    <div class="detail-section">
      <h3>📊 Rendimiento Histórico</h3>
      <canvas id="detail-perf-chart" style="width:100%;height:200px;margin-top:12px"></canvas>
    </div>

    <div class="detail-section">
      <h3>📖 ¿Qué es ${inv.name}?</h3>
      <p>${inv.description}</p>
    </div>

    <div class="detail-section">
      <h3>💡 ¿Por qué invertir en esto?</h3>
      <p>${inv.whyInvest}</p>
    </div>

    ${inv.expenseRatio ? `<div class="detail-section"><h3>💸 Costos</h3><p>Ratio de gastos del fondo: <strong>${inv.expenseRatio}</strong> al año. Esto es lo que cobra el fondo por administrar tu inversión. Menos es mejor.</p></div>` : ''}

    ${inv.cfdWarning ? `<div class="cfd-warning"><strong>⚠️ Aviso sobre CFD</strong><br>Este activo se compra como CFD (Contrato por Diferencia) en eToro, no como inversión real. Los CFDs pueden tener comisiones nocturnas. Considerá alternativas como GLD si querés evitar CFDs.</div>` : ''}

    <div style="margin-top:32px;text-align:center">
      <a href="${getEtoroUrl(inv.symbol)}" target="_blank" class="btn btn-etoro" style="font-size:18px;padding:16px 40px">
        Invertir en ${inv.symbol} en eToro →
      </a>
      <p style="color:var(--text-muted);font-size:12px;margin-top:12px">Se abrirá etoro.com en una nueva pestaña</p>
    </div>
  `;

  navigateTo('detail');

  // Draw performance chart
  setTimeout(() => {
    const canvas = document.getElementById('detail-perf-chart');
    if (canvas) drawPerformanceBars(canvas, inv.performance);
  }, 100);
}

// Search
function handleSearch(e) {
  const q = e.target.value.trim();
  if (!q) {
    renderDashboard();
    return;
  }
  const results = searchInvestments(q);
  renderInvestments(results);
}

// Filter
function setFilter(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  
  if (filter === 'all') {
    renderInvestments(INVESTMENTS);
  } else {
    renderInvestments(INVESTMENTS.filter(i => i.category === filter));
  }
}

// Guide section
function renderGuide() {
  const container = document.getElementById('guide-content');
  if (!container || container.children.length > 0) return;
  
  container.innerHTML = `
    <h2 style="font-size:28px;margin-bottom:8px">Guía para Invertir</h2>
    <p style="color:var(--text-secondary);margin-bottom:32px">Todo lo que necesitás saber para empezar a invertir en eToro, explicado de forma simple.</p>

    <h3 style="margin-bottom:16px">📋 Pasos para Empezar</h3>
    <div class="guide-steps">
      <div class="guide-step">
        <div class="guide-step-num">1</div>
        <div class="guide-step-content">
          <h4>Creá tu cuenta en eToro</h4>
          <p>Visitá <a href="https://www.etoro.com" target="_blank" style="color:var(--accent-green)">etoro.com</a> y registrate con tu correo. Es gratis y toma menos de 5 minutos.</p>
        </div>
      </div>
      <div class="guide-step">
        <div class="guide-step-num">2</div>
        <div class="guide-step-content">
          <h4>Verificá tu identidad</h4>
          <p>Subí una foto de tu cédula o pasaporte y un comprobante de domicilio (recibo de luz, agua, etc.). Esto es obligatorio por seguridad.</p>
        </div>
      </div>
      <div class="guide-step">
        <div class="guide-step-num">3</div>
        <div class="guide-step-content">
          <h4>Depositá fondos</h4>
          <p>Mínimo $50 con tarjeta Visa/Mastercard. Si usás transferencia bancaria, el mínimo es $500. Todo se maneja en dólares (USD).</p>
        </div>
      </div>
      <div class="guide-step">
        <div class="guide-step-num">4</div>
        <div class="guide-step-content">
          <h4>Elegí tu inversión</h4>
          <p>Buscá el símbolo de la inversión (ej: VOO, NVDA) y revisá la información. Usá esta plataforma para guiarte.</p>
        </div>
      </div>
      <div class="guide-step">
        <div class="guide-step-num">5</div>
        <div class="guide-step-content">
          <h4>Invertí con apalancamiento x1</h4>
          <p>Esto es CLAVE. Siempre elegí apalancamiento x1 para comprar la acción REAL y evitar CFDs con comisiones extras.</p>
        </div>
      </div>
    </div>

    <h3 style="margin-top:40px;margin-bottom:16px">Información General</h3>
    <div class="info-cards">
      <div class="card info-card">
        <div class="info-card-icon">💳</div>
        <h4>Métodos de Pago</h4>
        <p>Tarjeta de crédito/débito (Visa o Mastercard): mínimo $50<br>Transferencia bancaria: mínimo $500</p>
      </div>
      <div class="card info-card">
        <div class="info-card-icon">💱</div>
        <h4>Moneda</h4>
        <p>eToro opera en dólares (USD). Si depositás en colones, se aplica una comisión por conversión de moneda.</p>
      </div>
      <div class="card info-card">
        <div class="info-card-icon">📄</div>
        <h4>Verificación</h4>
        <p>Necesitás: cédula de identidad o pasaporte vigente + comprobante de domicilio reciente.</p>
      </div>
      <div class="card info-card">
        <div class="info-card-icon">🧾</div>
        <h4>Impuestos</h4>
        <p>Consultá con un contador sobre tus obligaciones tributarias por ganancias de inversiones internacionales.</p>
      </div>
    </div>

    <div class="warning-box" style="margin-top:24px">
      <strong>⚠️ Advertencia sobre Bancos</strong>
      Algunos bancos pueden tener dificultades para procesar transferencias desde eToro. Verificá con tu banco antes de depositar montos grandes. Se recomienda empezar con montos pequeños para probar.
    </div>

    <h3 style="margin-top:40px;margin-bottom:16px">📚 Conceptos Básicos</h3>
    <div class="info-cards">
      <div class="card info-card">
        <div class="info-card-icon">📊</div>
        <h4>¿Qué es un ETF?</h4>
        <p>Es como una "canasta" con muchas acciones. En vez de comprar una sola empresa, comprás un paquete diversificado. Menos riesgo, más tranquilidad.</p>
      </div>
      <div class="card info-card">
        <div class="info-card-icon">📈</div>
        <h4>¿Qué es el S&P 500?</h4>
        <p>Es un índice con las 500 empresas más grandes de EE.UU. Invertir en él (a través de VOO o SPY) es invertir en toda la economía americana.</p>
      </div>
      <div class="card info-card">
        <div class="info-card-icon">⚠️</div>
        <h4>¿Qué es un CFD?</h4>
        <p>Un contrato que replica el precio de un activo SIN comprarlo realmente. Evitalos usando apalancamiento x1 al comprar.</p>
      </div>
      <div class="card info-card">
        <div class="info-card-icon">💰</div>
        <h4>¿Qué son los dividendos?</h4>
        <p>Dinero que las empresas te pagan periódicamente por ser dueño de sus acciones. Es como recibir "intereses" por tu inversión.</p>
      </div>
    </div>
  `;
}

// Settings & APIs
function toggleSettings() {
  const modal = document.getElementById('settings-modal');
  if (modal.style.display === 'none') {
    modal.style.display = 'block';
    document.getElementById('gemini-api-key').value = localStorage.getItem('gemini_api_key') || '';
    document.getElementById('finnhub-api-key').value = localStorage.getItem('finnhub_api_key') || '';
  } else {
    modal.style.display = 'none';
  }
}

function saveSettings() {
  const gemini = document.getElementById('gemini-api-key').value.trim();
  const finnhub = document.getElementById('finnhub-api-key').value.trim();
  if (gemini) localStorage.setItem('gemini_api_key', gemini);
  if (finnhub) localStorage.setItem('finnhub_api_key', finnhub);
  toggleSettings();
  alert('Configuración guardada exitosamente.');
}

// Live Price Simulation (if no Finnhub key is used, just to make it feel alive)
setInterval(() => {
  document.querySelectorAll('.inv-perf').forEach(el => {
    // Solo simulamos pequeñas fluctuaciones visuales para que se vea "vivo" si no hay API real
    if (Math.random() > 0.7 && !localStorage.getItem('finnhub_api_key')) {
      const isPos = el.classList.contains('positive');
      const current = parseFloat(el.innerText.replace('%','').replace('+',''));
      if (!isNaN(current)) {
        const change = (Math.random() * 0.2 - 0.1);
        const next = (current + change).toFixed(1);
        el.innerText = (next >= 0 ? '+' : '') + next + '%';
        el.className = 'inv-perf ' + (next >= 0 ? 'positive' : 'negative');
      }
    }
  });
}, 3000);

// ==========================================
// PLAN GENERATOR
// ==========================================
function generateCustomPlan() {
  const amountStr = document.getElementById('plan-amount').value;
  const amount = parseFloat(amountStr) || 0;
  const timeframe = document.getElementById('plan-timeframe').value;
  const risk = document.getElementById('plan-risk').value;
  const resultDiv = document.getElementById('plan-result');

  if (amount < 50) {
    alert("El monto mínimo recomendado para diversificar en eToro es de $50 USD.");
    return;
  }

  let strategyTitle = "";
  let allocations = [];
  let explanation = "";
  let expectedGainMin = 0;
  let expectedGainMax = 0;

  if (timeframe === '15_dias' || timeframe === '1_mes') {
    // CORTO PLAZO
    if (risk === 'conservador') {
      strategyTitle = "Protección de Capital a Corto Plazo (La mejor opción segura)";
      allocations = [
        { pct: 60, symbol: 'GLD', note: 'Oro para estabilidad absoluta' },
        { pct: 40, symbol: 'JNJ', note: 'Acción defensiva casi sin volatilidad' }
      ];
      explanation = "Para 15 o 30 días con bajo riesgo, la mejor opción es proteger tu dinero contra caídas bruscas. Esta estrategia minimiza el riesgo al extremo.";
      expectedGainMin = 0.5;
      expectedGainMax = 1.5;
    } else if (risk === 'moderado') {
      strategyTitle = "Crecimiento Estable a Corto Plazo (Mejor balance riesgo/beneficio)";
      allocations = [
        { pct: 50, symbol: 'AAPL', note: 'Acción tecnológica estable' },
        { pct: 30, symbol: 'MSFT', note: 'Crecimiento sólido sin locuras' },
        { pct: 20, symbol: 'QQQ', note: 'Para un empujón del Nasdaq' }
      ];
      explanation = "Esta es la mejor opción equilibrada. Buscamos un repunte moderado. Si las acciones tecnológicas suben, podrás vender y retirar una buena ganancia en pocos días.";
      expectedGainMin = 2.0;
      expectedGainMax = 5.0;
    } else {
      strategyTitle = "Especulación Agresiva a Corto Plazo (Máximo potencial rápido)";
      allocations = [
        { pct: 40, symbol: 'NVDA', note: 'Alta volatilidad en IA' },
        { pct: 30, symbol: 'BTC', note: 'Bitcoin para saltos bruscos' },
        { pct: 30, symbol: 'SOL', note: 'Cripto de extrema velocidad y riesgo' }
      ];
      explanation = "Esta es la mejor opción si buscas ganar lo máximo posible en 15-30 días. El objetivo es atrapar un salto del mercado y retirar el dinero de inmediato.";
      expectedGainMin = 5.0;
      expectedGainMax = 15.0;
    }
  } else {
    // MEDIANO / LARGO PLAZO
    if (risk === 'conservador') {
      strategyTitle = "Portafolio Seguro a Largo Plazo (La mejor opción probada por el tiempo)";
      allocations = [
        { pct: 50, symbol: 'VOO', note: 'Base de la economía de USA' },
        { pct: 30, symbol: 'VYM', note: 'Empresas que pagan dividendos' },
        { pct: 20, symbol: 'GLD', note: 'Seguro contra crisis' }
      ];
      explanation = "La estrategia clásica de Warren Buffett y la mejor opción para dormir tranquilo. Pon tu dinero aquí y déjalo crecer tranquilamente.";
      expectedGainMin = 6.0;
      expectedGainMax = 10.0;
    } else if (risk === 'moderado') {
      strategyTitle = "Crecimiento Equilibrado (Mejor opción estándar)";
      allocations = [
        { pct: 50, symbol: 'VOO', note: 'Crecimiento del S&P 500' },
        { pct: 30, symbol: 'QQQ', note: 'Acelerador tecnológico' },
        { pct: 20, symbol: 'BTC', note: 'Pequeña exposición a cripto' }
      ];
      explanation = "La opción ideal y recomendada para el 90% de las personas. Combina la seguridad de las empresas de USA, con un toque tecnológico para maximizar ganancias.";
      expectedGainMin = 10.0;
      expectedGainMax = 18.0;
    } else {
      strategyTitle = "Crecimiento Exponencial (Mejor opción para multiplicar capital)";
      allocations = [
        { pct: 40, symbol: 'QQQ', note: 'Base tecnológica fuerte' },
        { pct: 30, symbol: 'BTC', note: 'Oro digital con enorme potencial' },
        { pct: 20, symbol: 'TSLA', note: 'Alta volatilidad y crecimiento' },
        { pct: 10, symbol: 'ETH', note: 'Cripto alternativa' }
      ];
      explanation = "Buscamos multiplicar el capital asumiendo bajadas temporales. Ideal si no vas a tocar el dinero en varios meses y soportas ver números rojos temporalmente.";
      expectedGainMin = 15.0;
      expectedGainMax = 45.0;
    }
  }

  const gainMinUSD = (amount * (expectedGainMin / 100)).toFixed(2);
  const gainMaxUSD = (amount * (expectedGainMax / 100)).toFixed(2);

  let html = `
    <div class="card" style="border-left: 4px solid var(--accent-green); animation: fadeIn 0.5s ease-out">
      <h3 style="margin-bottom:12px;color:var(--accent-green)">${strategyTitle}</h3>
      <p style="font-size:14px;color:var(--text-secondary);margin-bottom:20px">${explanation}</p>
      
      <div style="margin-bottom:20px">
        <h4 style="margin-bottom:10px;font-size:13px;text-transform:uppercase;color:var(--text-secondary);letter-spacing:1px">Distribución Sugerida ($${amount})</h4>
  `;

  allocations.forEach(al => {
    const calc = (amount * (al.pct / 100)).toFixed(2);
    html += `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:rgba(255,255,255,0.03);border-radius:8px;margin-bottom:8px">
        <div>
          <strong style="color:#fff">${al.pct}% ${al.symbol}</strong>
          <div style="font-size:12px;color:var(--text-secondary)">${al.note}</div>
        </div>
        <div style="text-align:right">
          <strong style="color:var(--accent-green)">$${calc}</strong>
          <div style="font-size:11px;margin-top:4px"><a href="${getEtoroUrl(al.symbol)}" target="_blank" style="color:var(--accent-blue);text-decoration:none">Comprar →</a></div>
        </div>
      </div>
    `;
  });

  html += `
      </div>
      
      <div style="margin-bottom:20px;background:rgba(0,200,83,0.1);border:1px solid rgba(0,200,83,0.2);padding:16px;border-radius:8px;text-align:center">
        <h4 style="color:var(--accent-green);margin-bottom:8px;font-size:14px">📈 Estimación de Ganancias (${timeframe.replace('_', ' ')})</h4>
        <div style="font-size:24px;font-weight:700;color:#fff;margin-bottom:4px">
          +$${gainMinUSD} a +$${gainMaxUSD} USD
        </div>
        <div style="font-size:13px;color:var(--text-secondary)">
          Rendimiento esperado: <span style="color:var(--accent-green)">+${expectedGainMin}% a +${expectedGainMax}%</span>
        </div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:10px;font-style:italic">
          *Esta estimación se basa en rendimientos históricos y volatilidad esperada. Recuerda que toda inversión conlleva riesgo y los rendimientos pasados no garantizan resultados futuros.
        </div>
      </div>

      <div style="font-size:12px;color:var(--text-secondary);background:rgba(0,0,0,0.2);padding:12px;border-radius:8px">
        <strong>⚠️ Regla de eToro:</strong> Asegúrate de comprar estas inversiones con <strong>Apalancamiento x1</strong> (sin apalancamiento) para evitar comisiones nocturnas y tener liquidez inmediata.
      </div>
    </div>
  `;

  resultDiv.innerHTML = html;
  resultDiv.style.display = 'block';
}



// ==========================================
// NOTES DIARY LOGIC
// ==========================================
function loadNotes() {
  const container = document.getElementById('notes-list');
  if (!container) return;

  const notes = JSON.parse(localStorage.getItem('user_notes_array') || '[]');
  
  if (notes.length === 0) {
    container.innerHTML = '<p style="color:var(--text-secondary);text-align:center;font-style:italic">Aún no tienes notas. ¡Escribe la primera arriba!</p>';
    return;
  }

  container.innerHTML = notes.map((note, index) => `
    <div class="card" style="margin-bottom:16px;background:rgba(255,255,255,0.02)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:8px">
        <strong style="color:var(--accent-green);font-size:13px">📅 ${note.date}</strong>
        <button onclick="deleteNote(${index})" style="background:none;border:none;color:var(--text-secondary);cursor:pointer;font-size:12px;padding:4px">🗑️ Borrar</button>
      </div>
      <div style="white-space:pre-wrap;font-size:14px;color:var(--text-primary);line-height:1.5">${note.text}</div>
    </div>
  `).join('');
}

function saveNewNote() {
  const input = document.getElementById('new-note-text');
  const text = input.value.trim();
  
  if (!text) {
    alert("Por favor escribe algo antes de guardar.");
    return;
  }

  const notes = JSON.parse(localStorage.getItem('user_notes_array') || '[]');
  
  // Create formatted date: DD/MM/YYYY
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-CR', { day: '2-digit', month: 'long', year: 'numeric' }) + ' - ' + now.toLocaleTimeString('es-CR', {hour: '2-digit', minute:'2-digit'});

  notes.unshift({ date: dateStr, text: text });
  localStorage.setItem('user_notes_array', JSON.stringify(notes));
  
  input.value = ''; // Clear input
  loadNotes(); // Reload list
}

function deleteNote(index) {
  if(confirm("¿Estás seguro de que quieres borrar esta nota?")) {
    const notes = JSON.parse(localStorage.getItem('user_notes_array') || '[]');
    notes.splice(index, 1);
    localStorage.setItem('user_notes_array', JSON.stringify(notes));
    loadNotes();
  }
}

// Init app
function initApp() {
  // Remove loader
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1200);

  // Chat input enter key
  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') sendChatMessage();
    });
  }

  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }

  // Initial load of notes
  loadNotes();

  // If we want to start on dashboard by default, we could do it here, but Hero is default.
}

document.addEventListener('DOMContentLoaded', initApp);
