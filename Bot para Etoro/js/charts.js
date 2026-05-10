// ========================================
// CHARTS.JS - Visualizaciones de rendimiento
// Canvas API sparklines y risk gauges
// ========================================

function drawSparkline(canvas, data, color = '#00c853') {
  if (!canvas || !data || !data.length) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.offsetWidth * 2;
  const h = canvas.height = canvas.offsetHeight * 2;
  ctx.scale(2, 2);
  const cw = canvas.offsetWidth;
  const ch = canvas.offsetHeight;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = cw / (data.length - 1);

  // Gradient fill
  const grad = ctx.createLinearGradient(0, 0, 0, ch);
  grad.addColorStop(0, color + '30');
  grad.addColorStop(1, color + '00');

  ctx.beginPath();
  ctx.moveTo(0, ch);
  data.forEach((v, i) => {
    const x = i * stepX;
    const y = ch - ((v - min) / range) * (ch * 0.8) - ch * 0.1;
    if (i === 0) ctx.lineTo(x, y);
    else {
      const prevX = (i - 1) * stepX;
      const prevY = ch - ((data[i - 1] - min) / range) * (ch * 0.8) - ch * 0.1;
      const cpx = (prevX + x) / 2;
      ctx.bezierCurveTo(cpx, prevY, cpx, y, x, y);
    }
  });
  ctx.lineTo(cw, ch);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = i * stepX;
    const y = ch - ((v - min) / range) * (ch * 0.8) - ch * 0.1;
    if (i === 0) ctx.moveTo(x, y);
    else {
      const prevX = (i - 1) * stepX;
      const prevY = ch - ((data[i - 1] - min) / range) * (ch * 0.8) - ch * 0.1;
      const cpx = (prevX + x) / 2;
      ctx.bezierCurveTo(cpx, prevY, cpx, y, x, y);
    }
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function drawPerformanceBars(canvas, perf) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.offsetWidth * 2;
  const h = canvas.height = canvas.offsetHeight * 2;
  ctx.scale(2, 2);
  const cw = canvas.offsetWidth;
  const ch = canvas.offsetHeight;
  const labels = ['1 Año', '3 Años', '5 Años'];
  const values = [perf.y1, perf.y3, perf.y5];
  const maxVal = Math.max(...values.map(Math.abs)) || 1;
  const barW = Math.min(60, (cw - 80) / 3);
  const gap = (cw - barW * 3) / 4;

  values.forEach((v, i) => {
    const x = gap + i * (barW + gap);
    const barH = (Math.abs(v) / maxVal) * (ch - 50);
    const y = ch - 30 - barH;
    const color = v >= 0 ? '#00c853' : '#ff1744';

    // Bar with rounded top
    const radius = 4;
    ctx.beginPath();
    ctx.moveTo(x, ch - 30);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.lineTo(x + barW - radius, y);
    ctx.quadraticCurveTo(x + barW, y, x + barW, y + radius);
    ctx.lineTo(x + barW, ch - 30);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, y, 0, ch - 30);
    grad.addColorStop(0, color);
    grad.addColorStop(1, color + '40');
    ctx.fillStyle = grad;
    ctx.fill();

    // Value label
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '600 12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText((v >= 0 ? '+' : '') + v.toFixed(1) + '%', x + barW / 2, y - 8);

    // Bottom label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 11px Inter';
    ctx.fillText(labels[i], x + barW / 2, ch - 12);
  });
}

function renderRiskDots(container, riskKey) {
  const risk = RISK_LEVELS[riskKey];
  if (!risk) return;
  container.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const dot = document.createElement('span');
    dot.className = 'inv-risk-dot';
    if (i <= risk.value) {
      dot.classList.add('filled');
      if (risk.value >= 4) dot.classList.add('danger');
      else if (risk.value >= 3) dot.classList.add('warn');
    }
    container.appendChild(dot);
  }
}
