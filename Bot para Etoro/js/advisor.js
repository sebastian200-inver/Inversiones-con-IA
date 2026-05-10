// ========================================
// ADVISOR.JS - Chatbot Asesor Inteligente
// ========================================

const ADVISOR_RESPONSES = {
  greeting: [
    '¡Hola! 👋 Soy tu asesor de inversiones para eToro. ¿En qué te puedo ayudar hoy?',
    '¡Bienvenido! Estoy aquí para ayudarte a invertir de forma inteligente en eToro. ¿Qué querés saber?'
  ],
  etf: '📊 Un ETF es como una "canasta" de inversiones. En vez de comprar una sola acción, comprás un paquete con muchas empresas a la vez.\n\nPor ejemplo, VOO incluye las 500 empresas más grandes de EE.UU. (Apple, Microsoft, Google, etc.) en una sola compra.\n\n✅ Ventaja: Menos riesgo porque si una empresa baja, las otras compensan.',
  cfd: '⚠️ Un CFD (Contrato por Diferencia) es cuando NO comprás la acción real, sino que apostás a si el precio sube o baja.\n\n❌ Los CFDs pueden tener comisiones nocturnas y más riesgo.\n\n✅ En eToro, si comprás acciones con apalancamiento x1 (sin multiplicador) y en posición de COMPRA, estás comprando la acción REAL, no un CFD.\n\n💡 Consejo: Siempre usá apalancamiento x1 para comprar acciones reales.',
  start: '🚀 Para empezar a invertir en eToro desde Costa Rica:\n\n1️⃣ Creá tu cuenta en etoro.com\n2️⃣ Verificá tu identidad (cédula + comprobante de domicilio)\n3️⃣ Depositá mínimo $50 (tarjeta Visa/Mastercard)\n4️⃣ Buscá la inversión que te interesa\n5️⃣ Invertí con apalancamiento x1 (inversión real)\n\n⏱️ Todo el proceso toma menos de 15 minutos.',
  howmuch: '💰 La regla de oro: invertí SOLO dinero que no necesités para tus gastos.\n\n📌 Sugerencia para principiantes:\n• Empezá con $50-$100 para aprender\n• Invertí de forma constante cada mes (aunque sea poco)\n• Nunca inviertas dinero prestado o de emergencia\n• La consistencia importa más que la cantidad',
  risk: '⚖️ Toda inversión tiene riesgo. Sí, podés perder dinero.\n\nPero hay formas de reducir el riesgo:\n\n1️⃣ Diversificá: No pongas todo en una sola acción\n2️⃣ Invertí a largo plazo: Las caídas temporales se recuperan\n3️⃣ Usá ETFs: Ya están diversificados\n4️⃣ No uses apalancamiento: Comprá acciones reales (x1)\n\n📈 El S&P 500 ha dado ~10% anual promedio en los últimos 50 años, a pesar de varias crisis.',
  voo_vs_spy: '🔍 VOO vs SPY - Ambos siguen el S&P 500:\n\n📊 VOO (Vanguard): Comisión más baja (0.03%)\n📊 SPY (SPDR): Más volumen de trading (0.09%)\n\n✅ Para inversiones a largo plazo, VOO es ligeramente mejor por su menor costo.\n\n💡 La diferencia es mínima. Cualquiera de los dos es excelente para principiantes.',
  deposit_cr: '🇨🇷 Depositar en eToro desde Costa Rica:\n\n💳 Tarjeta de crédito/débito: Mínimo $50\n🏦 Transferencia bancaria: Mínimo $500\n\n⚠️ Importante:\n• Todo se maneja en dólares (USD)\n• Si depositás en colones, eToro cobra comisión por cambio de moneda\n• Algunos bancos costarricenses pueden dificultar retiros desde eToro\n• Verificá con tu banco antes de depositar montos grandes',
  banks_cr: '🏦 Bancos en Costa Rica y eToro:\n\n⚠️ Algunos bancos en Costa Rica pueden tener problemas para procesar transferencias desde eToro.\n\n💡 Consejos:\n• Verificá con tu banco antes de depositar\n• Las tarjetas Visa/Mastercard generalmente funcionan mejor\n• Empezá con montos pequeños para probar\n• Considerá abrir una cuenta en un banco que facilite transferencias internacionales',
  nvidia: '🟢 NVIDIA (NVDA) en eToro:\n\nNVIDIA fabrica los chips más potentes para inteligencia artificial. Sus GPUs son el "cerebro" de ChatGPT y la mayoría de sistemas de IA.\n\n📈 Rendimiento: Ha crecido enormemente gracias al boom de la IA.\n\n⚠️ Riesgo medio-alto: Es una sola empresa, así que es más volátil que un ETF.\n\n💡 Consejo: Si te interesa NVIDIA pero querés menos riesgo, considerá QQQ o VGT que incluyen NVIDIA junto con otras empresas tech.',
  gold: '🥇 Oro como inversión:\n\nEl oro es un "refugio seguro". Cuando la economía está mal, el oro generalmente sube.\n\n📊 En eToro podés invertir en oro de dos formas:\n• GOLD - Commodity directo (⚠️ es CFD, tiene comisiones nocturnas)\n• GLD - ETF de oro (✅ inversión real, sin comisiones nocturnas)\n\n💡 Recomendación: Para principiantes, GLD es mejor opción que GOLD directo.',
  default: '🤔 No estoy seguro de entender tu pregunta. Podés preguntarme sobre:\n\n• ¿Qué es un ETF?\n• ¿Cómo empezar en eToro?\n• ¿Cuánto debo invertir?\n• ¿Puedo perder dinero?\n• ¿VOO o SPY?\n• ¿Cómo depositar desde Costa Rica?\n• Cualquier inversión del catálogo (ej: "NVIDIA", "QQQ")'
};

const CHAT_SUGGESTIONS = [
  '¿Qué es un ETF?',
  '¿Cómo empezar?',
  '¿Cuánto invertir?',
  '¿VOO o SPY?',
  'Depositar desde CR',
  '¿Puedo perder?'
];

let chatOpen = false;

function initChat() {
  const msgs = document.getElementById('chat-messages');
  if (msgs && msgs.children.length === 0) {
    const greet = ADVISOR_RESPONSES.greeting[Math.floor(Math.random() * ADVISOR_RESPONSES.greeting.length)];
    
    addBotMessage(greet);
    
    renderSuggestions();
  }
}

function toggleChat() {
  chatOpen = !chatOpen;
  const panel = document.getElementById('chat-panel');
  const btn = document.getElementById('chat-toggle');
  if (chatOpen) {
    panel.classList.add('open');
    btn.style.display = 'none';
    initChat();
  } else {
    panel.classList.remove('open');
    btn.style.display = 'flex';
  }
}

function addBotMessage(text) {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.style.display = 'flex';
  div.style.gap = '8px';
  div.style.marginBottom = '12px';
  div.style.alignItems = 'flex-start';
  
  div.innerHTML = `
    <div style="width:28px;height:28px;border-radius:50%;background:var(--accent-green);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;margin-top:4px">🤖</div>
    <div class="chat-msg bot" style="margin:0">${text.replace(/\n/g, '<br>')}</div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function addUserMessage(text) {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg user';
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg bot';
  div.id = 'typing-indicator';
  div.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function hideTyping() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

// Conversation history for context
let chatHistory = [];

async function getGeminiResponse(text) {
  const apiKey = localStorage.getItem('gemini_api_key') || 'AIzaSyD32F4mIwu0slmPPyezFe6jyeEdSyGCnmw';
  if (!apiKey) return null;

  try {
    const systemPrompt = "Eres el Asesor de Inversiones, un experto financiero en eToro. Respondes en español, amigable, claro, sin jerga. Fomentas siempre la inversión responsable. Destacas mucho que las acciones y ETFs recomendados son de ALTA LIQUIDEZ (se pueden retirar cuando el usuario quiera, ya sea en 15 días, 1 mes o 1 año). Si te piden un plan, haz un plan DETALLADO paso a paso con porcentajes sugeridos, enfocado en el tiempo que diga el usuario (ej: 15 días, 1 mes). Nunca recomiendes binarias o apalancamiento. Siempre x1. Opciones comunes: VOO, QQQ, AAPL, NVDA, TSLA, GOLD, SILVER.";
    
    // Add current message to history
    chatHistory.push({ role: "user", parts: [{ text }] });
    
    // Build history for API
    const contents = chatHistory.map(msg => ({
      role: msg.role === 'bot' ? 'model' : 'user',
      parts: msg.parts
    }));

    // Inject system prompt into the first message
    if (contents.length > 0 && contents[0].role === 'user') {
      contents[0].parts[0].text = `[Instrucciones del sistema: ${systemPrompt}]\n\nUsuario: ${contents[0].parts[0].text}`;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    if (!response.ok) {
      const errText = await response.text();
      return `❌ Error de API Gemini (${response.status}): ${errText}`;
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const botText = data.candidates[0].content.parts[0].text;
      chatHistory.push({ role: "bot", parts: [{ text: botText }] });
      return botText;
    }
    return "❌ Error: La IA no devolvió un mensaje válido.";
  } catch (e) {
    console.error("Gemini API Error:", e);
    return `❌ Error de conexión: ${e.message}`;
  }
}

async function processMessage(text) {
  const q = text.toLowerCase().trim();

  // 1. Check if we have Gemini Key for REAL AI
  const apiKey = localStorage.getItem('gemini_api_key') || 'AIzaSyD32F4mIwu0slmPPyezFe6jyeEdSyGCnmw';
  if (apiKey) {
    const aiResponse = await getGeminiResponse(text);
    if (aiResponse) {
      // Parse markdown to HTML
      let formatted = aiResponse
        .replace(/^#{1,6}\s*(.*?)$/gm, '<strong style="color:var(--accent-green);font-size:15px;display:block;margin-top:12px;margin-bottom:4px">$1</strong>')
        .replace(/^[\*\-]\s+/gm, '• ')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
      return formatted;
    }
  }

  // 2. Fallback Advanced Simulator if NO key is provided
  // Check for specific investments
  const inv = INVESTMENTS.find(i =>
    q.includes(i.symbol.toLowerCase()) ||
    q.includes(i.name.toLowerCase().split(' ')[0].toLowerCase())
  );
  if (inv) {
    return `📊 <strong>${inv.name} (${inv.symbol})</strong>\n\n${inv.description}\n\n📈 Rendimiento:\n• 1 año: ${inv.performance.y1 >= 0 ? '+' : ''}${inv.performance.y1}%\n• 5 años: ${inv.performance.y5 >= 0 ? '+' : ''}${inv.performance.y5}%\n\n⚖️ Riesgo: ${RISK_LEVELS[inv.risk].label}\n${inv.cfdWarning ? '\n⚠️ Este activo se compra como CFD en eToro.' : '\n✅ Se compra como inversión real (no CFD) con apalancamiento x1.'}\n\n💡 ${inv.whyInvest}\n\n<a href="${getEtoroUrl(inv.symbol)}" target="_blank" style="color:#00c853;font-weight:600">→ Ver en eToro</a>`;
  }

  // Advanced Custom Plan Generator Simulation
  if (q.includes('plan') || q.includes('quincena') || q.includes('mes') || q.includes('dias') || q.includes('días')) {
    return `📋 <strong>Plan de Inversión a Corto Plazo (Alta Liquidez)</strong>\n\nComo mencionaste que buscas resultados y flexibilidad a corto plazo (quincenas/meses), aquí tienes un plan detallado donde <strong>puedes retirar tu dinero cuando tú quieras</strong> sin penalizaciones:\n\n<strong>Estrategia "Flexibilidad Máxima":</strong>\n• <strong>40% en AAPL (Apple) o MSFT:</strong> Son acciones muy estables. No fluctuarán locamente en un mes, protegiendo tu base.\n• <strong>30% en QQQ (Nasdaq 100):</strong> ETF tecnológico. Sube más rápido en el corto plazo si el mercado está verde.\n• <strong>30% en Acciones Volátiles (NVDA, TSLA, NFLX):</strong> Aquí buscarás el "salto" quincenal. Si en 15 días suben un 5-10%, puedes vender solo esta parte y retirar la ganancia.\n\n<strong>Instrucciones:</strong>\n1. Entra a eToro y busca estos activos.\n2. Asegúrate de comprar con <strong>Apalancamiento x1 (Sin apalancamiento)</strong>.\n3. Revisa en 15 días. Si necesitas el dinero, simplemente le das "Cerrar operación" e inmediatamente tendrás tus dólares listos para retirar.\n\n💡 <em>(Nota: Para que yo pueda crear planes hiper-personalizados usando Inteligencia Artificial real de Google, por favor ingresa una API Key de Gemini en Configuración ⚙️)</em>`;
  }

  // Keyword matching
  if (q.includes('etf') || q.includes('fondo')) return ADVISOR_RESPONSES.etf;
  if (q.includes('cfd') || q.includes('contrato')) return ADVISOR_RESPONSES.cfd;
  if (q.includes('empezar') || q.includes('inicio') || q.includes('comenzar') || q.includes('abrir cuenta')) return ADVISOR_RESPONSES.start;
  if (q.includes('cuánto') || q.includes('cuanto') || q.includes('cantidad') || q.includes('mínimo')) return ADVISOR_RESPONSES.howmuch;
  if (q.includes('riesgo') || q.includes('perder') || q.includes('peligro') || q.includes('seguro')) return ADVISOR_RESPONSES.risk;
  if (q.includes('voo') && q.includes('spy')) return ADVISOR_RESPONSES.voo_vs_spy;
  if (q.includes('deposit') || q.includes('pago') || q.includes('tarjeta') || (q.includes('costa') && q.includes('rica'))) return ADVISOR_RESPONSES.deposit_cr;
  if (q.includes('banco')) return ADVISOR_RESPONSES.banks_cr;
  if (q.includes('nvidia') || q.includes('nvda')) return ADVISOR_RESPONSES.nvidia;
  if (q.includes('oro') || q.includes('gold')) return ADVISOR_RESPONSES.gold;

  return ADVISOR_RESPONSES.default;
}

async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  input.value = '';

  showTyping();
  
  try {
    const response = await processMessage(text);
    hideTyping();
    addBotMessage(response || ADVISOR_RESPONSES.default);
  } catch (err) {
    console.error("Chat Error:", err);
    hideTyping();
    addBotMessage("Ups, tuve un pequeño fallo técnico. ¿Podés repetir la pregunta?");
  }
}

function sendSuggestion(text) {
  const input = document.getElementById('chat-input');
  input.value = text;
  sendChatMessage();
}

// Drag functionality for the chat panel
document.addEventListener('DOMContentLoaded', () => {
  const chatPanel = document.getElementById('chat-panel');
  const chatHeader = document.getElementById('chat-header');
  
  if (!chatPanel || !chatHeader) return;
  
  let isDragging = false;
  let offsetX, offsetY;

  chatHeader.addEventListener('mousedown', (e) => {
    // Don't drag if clicking the close button
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
    
    isDragging = true;
    const rect = chatPanel.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    
    // Temporarily disable transition for smooth dragging
    chatPanel.style.transition = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    let newX = e.clientX - offsetX;
    let newY = e.clientY - offsetY;
    
    // Prevent dragging off screen
    const maxX = window.innerWidth - chatPanel.offsetWidth;
    const maxY = window.innerHeight - chatPanel.offsetHeight;
    
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    // Override right/bottom positioning with explicit left/top
    chatPanel.style.right = 'auto';
    chatPanel.style.bottom = 'auto';
    chatPanel.style.left = newX + 'px';
    chatPanel.style.top = newY + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      // Re-enable any transitions if needed, or keep none
    }
  });
});

function renderSuggestions() {
  const container = document.getElementById('chat-suggestions');
  if (!container) return;
  container.innerHTML = CHAT_SUGGESTIONS.map(s =>
    `<button class="chat-suggestion" onclick="sendSuggestion('${s}')">${s}</button>`
  ).join('');
}
