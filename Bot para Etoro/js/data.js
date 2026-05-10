// ========================================
// BASE DE DATOS DE INVERSIONES - eToro
// 15 ETFs, 15 Acciones, 15 Commodities
// ========================================

const ETORO_BASE_URL = 'https://www.etoro.com/markets/';

const CATEGORIES = {
  ETF: { label: 'ETF', color: '#3b82f6', icon: '⌬' },
  STOCK: { label: 'Acción', color: '#8b5cf6', icon: '◈' },
  COMMODITY: { label: 'Commodity', color: '#f59e0b', icon: '⬢' },
  CRYPTO: { label: 'Criptomoneda', color: '#ef4444', icon: '₿' },
  INDEX: { label: 'Índice', color: '#06b6d4', icon: '⎈' }
};

const RISK_LEVELS = {
  LOW: { label: 'Bajo', value: 1, color: '#22c55e' },
  LOW_MED: { label: 'Bajo-Medio', value: 2, color: '#84cc16' },
  MEDIUM: { label: 'Medio', value: 3, color: '#eab308' },
  MED_HIGH: { label: 'Medio-Alto', value: 4, color: '#f97316' },
  HIGH: { label: 'Alto', value: 5, color: '#ef4444' }
};

// Generador de sparklines simuladas para no tener que escribirlas a mano
function generateSparkline(trend) {
  let arr = [50];
  for (let i = 1; i < 24; i++) {
    let change = (Math.random() * 10) - 5 + trend;
    arr.push(Math.max(10, arr[i-1] + change));
  }
  return arr;
}

const INVESTMENTS = [
  // ==========================================
  // 15 ETFs
  // ==========================================
  {
    symbol: 'VOO', name: 'Vanguard S&P 500 ETF', category: 'ETF', risk: 'LOW_MED', sector: 'Índice S&P 500',
    description: 'Invierte en las 500 empresas más grandes de Estados Unidos. Es como comprar un pedacito de toda la economía americana.',
    whyInvest: 'Históricamente ha crecido un promedio de 10% al año. Alta liquidez: puedes vender y retirar tu dinero cuando quieras.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 22.5, y3: 35.8, y5: 87.2 }, sparkline: generateSparkline(1), tags: ['principiante', 'largo plazo', 'liquidez'], dividends: true, expenseRatio: '0.03%', profiles: ['conservador', 'moderado', 'crecimiento', 'corto-plazo']
  },
  {
    symbol: 'SPY', name: 'SPDR S&P 500 ETF', category: 'ETF', risk: 'LOW_MED', sector: 'Índice S&P 500',
    description: 'El ETF más famoso del mundo. Sigue al S&P 500, igual que VOO pero con más volumen de trading.',
    whyInvest: 'Es el ETF más líquido del mundo. Ideal si quieres exposición al mercado americano con facilidad instantánea de retiro.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 22.3, y3: 35.5, y5: 86.8 }, sparkline: generateSparkline(1), tags: ['principiante', 'liquidez', 's&p500'], dividends: true, expenseRatio: '0.09%', profiles: ['conservador', 'moderado']
  },
  {
    symbol: 'QQQ', name: 'Invesco QQQ Trust', category: 'ETF', risk: 'MEDIUM', sector: 'Tecnología (Nasdaq)',
    description: 'Invierte en las 100 empresas tecnológicas más grandes: Apple, Microsoft, NVIDIA, Amazon, etc.',
    whyInvest: 'Acceso a las mejores empresas tech. Puedes retirar tu dinero en cualquier momento (quincena, mes, etc).',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 28.1, y3: 42.3, y5: 122.5 }, sparkline: generateSparkline(1.5), tags: ['tecnología', 'crecimiento', 'liquidez'], dividends: true, expenseRatio: '0.20%', profiles: ['moderado', 'crecimiento', 'corto-plazo']
  },
  {
    symbol: 'VTI', name: 'Vanguard Total Stock Market', category: 'ETF', risk: 'LOW_MED', sector: 'Mercado Total EE.UU.',
    description: 'Invierte en TODAS las empresas del mercado de EE.UU., grandes, medianas y pequeñas.',
    whyInvest: 'Máxima diversificación. Retirable al 100% en semanas o meses si necesitas liquidez.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 21.8, y3: 33.2, y5: 82.5 }, sparkline: generateSparkline(0.8), tags: ['diversificado', 'liquidez'], dividends: true, expenseRatio: '0.03%', profiles: ['conservador']
  },
  {
    symbol: 'VGT', name: 'Vanguard Information Tech', category: 'ETF', risk: 'MEDIUM', sector: 'Tecnología',
    description: 'ETF enfocado 100% en el sector tecnológico estadounidense.',
    whyInvest: 'Exposición directa al sector tech con costos bajos. Muy líquido.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 30.2, y3: 45.1, y5: 142.8 }, sparkline: generateSparkline(1.2), tags: ['tecnología', 'crecimiento'], dividends: true, expenseRatio: '0.10%', profiles: ['crecimiento']
  },
  {
    symbol: 'GLD', name: 'SPDR Gold Shares', category: 'ETF', risk: 'LOW', sector: 'Oro',
    description: 'ETF que sigue el precio del oro. Es como comprar oro físico pero digital.',
    whyInvest: 'Refugio seguro. Retirable en cualquier momento sin las complicaciones de vender oro físico.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 18.5, y3: 42.1, y5: 68.3 }, sparkline: generateSparkline(0.5), tags: ['oro', 'conservador'], dividends: false, expenseRatio: '0.40%', profiles: ['conservador']
  },
  {
    symbol: 'DIA', name: 'SPDR Dow Jones Industrial', category: 'ETF', risk: 'LOW_MED', sector: 'Dow Jones',
    description: 'Sigue a las 30 empresas industriales más grandes de Estados Unidos.',
    whyInvest: 'Empresas históricas y súper estables. Ideal para proteger capital a corto plazo.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 15.2, y3: 28.4, y5: 65.2 }, sparkline: generateSparkline(0.6), tags: ['dowjones', 'estable'], dividends: true, expenseRatio: '0.16%', profiles: ['conservador']
  },
  {
    symbol: 'IWM', name: 'iShares Russell 2000', category: 'ETF', risk: 'MED_HIGH', sector: 'Pequeñas Empresas',
    description: 'Invierte en 2000 empresas pequeñas de Estados Unidos con alto potencial.',
    whyInvest: 'Mayor volatilidad que el S&P 500, ideal para buscar ganancias más rápidas.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 12.5, y3: 15.2, y5: 45.0 }, sparkline: generateSparkline(0.2), tags: ['small-cap', 'crecimiento'], dividends: true, expenseRatio: '0.19%', profiles: ['crecimiento']
  },
  {
    symbol: 'ARKK', name: 'ARK Innovation ETF', category: 'ETF', risk: 'HIGH', sector: 'Innovación',
    description: 'Fondo de gestión activa que invierte en empresas de tecnología disruptiva.',
    whyInvest: 'Altamente volátil. Perfecto si buscas un movimiento agresivo a corto plazo.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: -5.2, y3: -45.5, y5: 25.0 }, sparkline: generateSparkline(-0.5), tags: ['innovación', 'volátil'], dividends: false, expenseRatio: '0.75%', profiles: ['crecimiento', 'corto-plazo']
  },
  {
    symbol: 'VNQ', name: 'Vanguard Real Estate', category: 'ETF', risk: 'MEDIUM', sector: 'Bienes Raíces',
    description: 'Invierte en bienes raíces (REITs) comerciales y residenciales en EE.UU.',
    whyInvest: 'Altos dividendos y exposición a bienes raíces con liquidez instantánea.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 8.5, y3: 12.4, y5: 35.2 }, sparkline: generateSparkline(0.4), tags: ['inmuebles', 'dividendos'], dividends: true, expenseRatio: '0.12%', profiles: ['moderado']
  },
  {
    symbol: 'VYM', name: 'Vanguard High Dividend Yield', category: 'ETF', risk: 'LOW_MED', sector: 'Dividendos',
    description: 'Empresas que pagan altos dividendos de forma consistente.',
    whyInvest: 'Excelente para generar ingresos pasivos y proteger el capital inicial.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 14.2, y3: 25.8, y5: 55.4 }, sparkline: generateSparkline(0.5), tags: ['dividendos', 'conservador'], dividends: true, expenseRatio: '0.06%', profiles: ['conservador']
  },
  {
    symbol: 'XLE', name: 'Energy Select Sector SPDR', category: 'ETF', risk: 'HIGH', sector: 'Energía',
    description: 'Sigue a las empresas de energía más grandes (petróleo, gas).',
    whyInvest: 'Muy sensible al precio del petróleo. Bueno para operaciones a corto plazo si el petróleo sube.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 5.4, y3: 65.2, y5: 45.8 }, sparkline: generateSparkline(0.3), tags: ['energía', 'petróleo'], dividends: true, expenseRatio: '0.09%', profiles: ['crecimiento']
  },
  {
    symbol: 'XLF', name: 'Financial Select Sector SPDR', category: 'ETF', risk: 'MEDIUM', sector: 'Finanzas',
    description: 'Bancos y aseguradoras (JPMorgan, Bank of America, etc).',
    whyInvest: 'Sector sólido que se beneficia de tasas de interés altas.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 18.5, y3: 35.2, y5: 75.0 }, sparkline: generateSparkline(0.6), tags: ['bancos', 'finanzas'], dividends: true, expenseRatio: '0.09%', profiles: ['moderado']
  },
  {
    symbol: 'XLV', name: 'Health Care Select Sector SPDR', category: 'ETF', risk: 'LOW_MED', sector: 'Salud',
    description: 'Farmacéuticas y empresas de salud (J&J, Pfizer, etc).',
    whyInvest: 'Sector defensivo que no cae tanto durante las crisis económicas.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 12.4, y3: 28.5, y5: 65.2 }, sparkline: generateSparkline(0.5), tags: ['salud', 'defensivo'], dividends: true, expenseRatio: '0.09%', profiles: ['conservador']
  },
  {
    symbol: 'EEM', name: 'iShares MSCI Emerging Markets', category: 'ETF', risk: 'MED_HIGH', sector: 'Mercados Emergentes',
    description: 'Invierte en empresas de China, India, Brasil, Taiwán, etc.',
    whyInvest: 'Diversificación internacional fuera de EE.UU. con alto potencial de crecimiento.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 5.2, y3: -2.5, y5: 15.0 }, sparkline: generateSparkline(0.1), tags: ['emergentes', 'internacional'], dividends: true, expenseRatio: '0.68%', profiles: ['crecimiento']
  },

  // ==========================================
  // 15 ACCIONES
  // ==========================================
  {
    symbol: 'NVDA', name: 'NVIDIA', category: 'STOCK', risk: 'MED_HIGH', sector: 'IA / Chips',
    description: 'Líder en chips para inteligencia artificial.',
    whyInvest: 'Excelente para planes agresivos. Alta liquidez: puedes comprar hoy y vender la próxima quincena.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 145.2, y3: 580.5, y5: 2450.0 }, sparkline: generateSparkline(2.5), tags: ['ia', 'tecnología', 'liquidez'], dividends: true, expenseRatio: null, profiles: ['crecimiento', 'corto-plazo']
  },
  {
    symbol: 'TSLA', name: 'Tesla', category: 'STOCK', risk: 'HIGH', sector: 'Automotriz / IA',
    description: 'Empresa líder en vehículos eléctricos y tecnología autónoma.',
    whyInvest: 'Ideal si buscas rendimientos rápidos. Retirable 100% en el momento que desees.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 18.5, y3: 45.2, y5: 850.0 }, sparkline: generateSparkline(1.8), tags: ['ev', 'alta volatilidad', 'corto-plazo'], dividends: false, expenseRatio: null, profiles: ['crecimiento', 'corto-plazo']
  },
  {
    symbol: 'AAPL', name: 'Apple', category: 'STOCK', risk: 'MEDIUM', sector: 'Tecnología',
    description: 'Una de las marcas más valiosas del planeta. Muy estable.',
    whyInvest: 'Si quieres invertir por solo un mes y proteger tu dinero, Apple es mucho menos volátil.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 18.8, y3: 32.5, y5: 195.0 }, sparkline: generateSparkline(0.8), tags: ['estable', 'liquidez'], dividends: true, expenseRatio: null, profiles: ['moderado', 'conservador']
  },
  {
    symbol: 'MSFT', name: 'Microsoft', category: 'STOCK', risk: 'MEDIUM', sector: 'Tecnología / IA',
    description: 'Gigante detrás de Windows, Azure y Copilot AI.',
    whyInvest: 'Sólida y estable, ideal para mantener un mes o más y retirar con seguridad.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 15.2, y3: 38.8, y5: 175.0 }, sparkline: generateSparkline(0.9), tags: ['ia', 'cloud', 'estable'], dividends: true, expenseRatio: null, profiles: ['moderado']
  },
  {
    symbol: 'GOOGL', name: 'Alphabet (Google)', category: 'STOCK', risk: 'MEDIUM', sector: 'Tecnología / IA',
    description: 'Empresa madre de Google y YouTube.',
    whyInvest: 'Gran potencial en IA con Gemini. Puedes retirar ganancias en semanas.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 20.5, y3: 55.2, y5: 190.0 }, sparkline: generateSparkline(1.0), tags: ['tecnología', 'ia'], dividends: true, expenseRatio: null, profiles: ['moderado', 'crecimiento']
  },
  {
    symbol: 'AMZN', name: 'Amazon', category: 'STOCK', risk: 'MEDIUM', sector: 'E-commerce / Cloud',
    description: 'Tienda online más grande del mundo y líder en servicios de nube (AWS).',
    whyInvest: 'Domina el comercio y la nube. Alta facilidad de retiro.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 25.3, y3: 45.8, y5: 125.0 }, sparkline: generateSparkline(1.1), tags: ['ecommerce', 'cloud'], dividends: false, expenseRatio: null, profiles: ['moderado', 'crecimiento']
  },
  {
    symbol: 'META', name: 'Meta (Facebook)', category: 'STOCK', risk: 'MEDIUM', sector: 'Redes Sociales',
    description: 'Empresa detrás de Facebook, Instagram y WhatsApp.',
    whyInvest: 'Alta volatilidad reciente, lo que permite ganancias (y pérdidas) rápidas a corto plazo.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 35.8, y3: 120.5, y5: 210.0 }, sparkline: generateSparkline(1.4), tags: ['redes sociales', 'metaverso'], dividends: true, expenseRatio: null, profiles: ['crecimiento']
  },
  {
    symbol: 'JPM', name: 'JPMorgan Chase', category: 'STOCK', risk: 'LOW_MED', sector: 'Banca',
    description: 'El banco más grande de Estados Unidos.',
    whyInvest: 'Roca sólida financiera. Protege tu capital con bajo riesgo a corto plazo.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 28.5, y3: 52.3, y5: 115.0 }, sparkline: generateSparkline(0.6), tags: ['finanzas', 'estable'], dividends: true, expenseRatio: null, profiles: ['conservador']
  },
  {
    symbol: 'JNJ', name: 'Johnson & Johnson', category: 'STOCK', risk: 'LOW', sector: 'Salud',
    description: 'Gigante farmacéutico y de salud con más de 130 años.',
    whyInvest: 'Una de las inversiones más seguras. No se moverá bruscamente en 1 mes.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 5.2, y3: 8.5, y5: 22.0 }, sparkline: generateSparkline(0.2), tags: ['salud', 'conservador'], dividends: true, expenseRatio: null, profiles: ['conservador']
  },
  {
    symbol: 'KO', name: 'Coca-Cola', category: 'STOCK', risk: 'LOW', sector: 'Consumo',
    description: 'La marca de bebidas más famosa del mundo.',
    whyInvest: 'Extremadamente estable. Ideal para "guardar" el dinero y ganar pequeños dividendos.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 12.5, y3: 18.2, y5: 35.0 }, sparkline: generateSparkline(0.3), tags: ['consumo', 'buffett'], dividends: true, expenseRatio: null, profiles: ['conservador']
  },
  {
    symbol: 'AMD', name: 'Advanced Micro Devices', category: 'STOCK', risk: 'MED_HIGH', sector: 'Semiconductores',
    description: 'Principal competidor de NVIDIA en chips y gráficas.',
    whyInvest: 'Liquidez inmediata para retirar cuando gustes tras movimientos agresivos.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 45.2, y3: 88.5, y5: 420.0 }, sparkline: generateSparkline(1.6), tags: ['semiconductores', 'corto-plazo'], dividends: false, expenseRatio: null, profiles: ['crecimiento', 'corto-plazo']
  },
  {
    symbol: 'NFLX', name: 'Netflix', category: 'STOCK', risk: 'MEDIUM', sector: 'Entretenimiento',
    description: 'El gigante del streaming mundial.',
    whyInvest: 'Puedes invertir y sacar tus ganancias en semanas si reportan buenos resultados.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 65.4, y3: 22.1, y5: 110.0 }, sparkline: generateSparkline(1.2), tags: ['streaming', 'liquidez'], dividends: false, expenseRatio: null, profiles: ['moderado', 'crecimiento']
  },
  {
    symbol: 'COIN', name: 'Coinbase', category: 'STOCK', risk: 'HIGH', sector: 'Criptomonedas',
    description: 'Exchange de criptomonedas. Su acción sigue el precio del Bitcoin.',
    whyInvest: 'Muy volátil, ideal para entrar y salir en 15 días siguiendo tendencias de cripto.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 120.5, y3: 45.2, y5: 85.0 }, sparkline: generateSparkline(2.0), tags: ['crypto', 'corto-plazo'], dividends: false, expenseRatio: null, profiles: ['crecimiento', 'corto-plazo']
  },
  {
    symbol: 'UBER', name: 'Uber Technologies', category: 'STOCK', risk: 'MEDIUM', sector: 'Transporte',
    description: 'Líder global en viajes compartidos y delivery.',
    whyInvest: 'Buena opción para mantener por 1 mes y luego retirar el dinero sin problema.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 85.2, y3: 65.4, y5: 140.0 }, sparkline: generateSparkline(1.3), tags: ['transporte', 'tech'], dividends: false, expenseRatio: null, profiles: ['moderado']
  },
  {
    symbol: 'PLTR', name: 'Palantir Technologies', category: 'STOCK', risk: 'HIGH', sector: 'Software / Defensa',
    description: 'Software de análisis de datos e IA usado por gobiernos.',
    whyInvest: 'Acción de culto con movimientos rápidos, perfecta para trading corto.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 165.2, y3: 85.4, y5: 250.0 }, sparkline: generateSparkline(1.9), tags: ['ia', 'defensa', 'volátil'], dividends: false, expenseRatio: null, profiles: ['crecimiento', 'corto-plazo']
  },

  // ==========================================
  // 15 COMMODITIES
  // ==========================================
  {
    symbol: 'GOLD', name: 'Oro', category: 'COMMODITY', risk: 'LOW', sector: 'Metal Precioso',
    description: 'El refugio seguro por excelencia.',
    whyInvest: 'Seguro si quieres dejar tu dinero por 1 mes y no quieres que baje. Liquidez total.',
    minInvestment: 50, isRealAsset: false, cfdWarning: true,
    performance: { y1: 20.2, y3: 45.5, y5: 72.0 }, sparkline: generateSparkline(0.4), tags: ['refugio', 'liquidez'], dividends: false, expenseRatio: null, profiles: ['conservador', 'corto-plazo']
  },
  {
    symbol: 'SILVER', name: 'Plata', category: 'COMMODITY', risk: 'MEDIUM', sector: 'Metal Industrial',
    description: 'Reserva de valor y material tecnológico.',
    whyInvest: 'Más volátil que el oro, da ganancias más rápidas en periodos de semanas.',
    minInvestment: 50, isRealAsset: false, cfdWarning: true,
    performance: { y1: 35.4, y3: 25.2, y5: 65.0 }, sparkline: generateSparkline(0.8), tags: ['metales', 'liquidez'], dividends: false, expenseRatio: null, profiles: ['moderado']
  },
  {
    symbol: 'COPPER', name: 'Cobre', category: 'COMMODITY', risk: 'MEDIUM', sector: 'Metal Industrial',
    description: 'Esencial para vehículos eléctricos y redes de energía.',
    whyInvest: 'Sube cuando la economía mejora. Puedes entrar y salir en cualquier quincena.',
    minInvestment: 50, isRealAsset: false, cfdWarning: true,
    performance: { y1: 15.2, y3: 42.5, y5: 85.0 }, sparkline: generateSparkline(0.7), tags: ['industria', 'liquidez'], dividends: false, expenseRatio: null, profiles: ['moderado']
  },
  {
    symbol: 'NATGAS', name: 'Gas Natural', category: 'COMMODITY', risk: 'HIGH', sector: 'Energía',
    description: 'Energía altamente volátil dependiendo del clima.',
    whyInvest: 'Ideal EXCLUSIVAMENTE para inversiones de muy corto plazo (días/semanas).',
    minInvestment: 50, isRealAsset: false, cfdWarning: true,
    performance: { y1: -25.4, y3: 15.2, y5: -10.0 }, sparkline: generateSparkline(-0.5), tags: ['energía', 'volátil', 'corto-plazo'], dividends: false, expenseRatio: null, profiles: ['crecimiento', 'corto-plazo']
  },
  {
    symbol: 'PLATINUM', name: 'Platino', category: 'COMMODITY', risk: 'MEDIUM', sector: 'Metal Precioso',
    description: 'Usado en joyería y convertidores catalíticos de autos.',
    whyInvest: 'Alta liquidez y diversificación fuera del oro.',
    minInvestment: 50, isRealAsset: false, cfdWarning: true,
    performance: { y1: -5.2, y3: -12.5, y5: 18.0 }, sparkline: generateSparkline(0.1), tags: ['metales', 'autos'], dividends: false, expenseRatio: null, profiles: ['moderado']
  },
  {
    symbol: 'PALLADIUM', name: 'Paladio', category: 'COMMODITY', risk: 'HIGH', sector: 'Metal Industrial',
    description: 'Metal extremadamente escaso usado en la industria automotriz.',
    whyInvest: 'Ha tenido movimientos muy bruscos, perfecto para trading quincenal.',
    minInvestment: 50, isRealAsset: false, cfdWarning: true,
    performance: { y1: -35.2, y3: -50.5, y5: -20.0 }, sparkline: generateSparkline(-1.0), tags: ['metales', 'volátil'], dividends: false, expenseRatio: null, profiles: ['crecimiento']
  },
  {
    symbol: 'OIL', name: 'Petróleo (WTI)', category: 'COMMODITY', risk: 'HIGH', sector: 'Energía',
    description: 'El crudo estándar de Estados Unidos.',
    whyInvest: 'Si hay noticias de geopolítica, sube o baja rapidísimo. Muy líquido.',
    minInvestment: 50, isRealAsset: false, cfdWarning: true,
    performance: { y1: 12.5, y3: 85.2, y5: 45.0 }, sparkline: generateSparkline(0.6), tags: ['energía', 'volátil'], dividends: false, expenseRatio: null, profiles: ['crecimiento', 'corto-plazo']
  },
  {
    symbol: 'BRENT', name: 'Petróleo (Brent)', category: 'COMMODITY', risk: 'HIGH', sector: 'Energía',
    description: 'El estándar de petróleo europeo y global.',
    whyInvest: 'Similar al WTI, excelente para periodos cortos.',
    minInvestment: 50, isRealAsset: false, cfdWarning: true,
    performance: { y1: 10.2, y3: 80.5, y5: 42.0 }, sparkline: generateSparkline(0.5), tags: ['energía', 'global'], dividends: false, expenseRatio: null, profiles: ['crecimiento']
  },
  {
    symbol: 'WHEAT', name: 'Trigo', category: 'COMMODITY', risk: 'MEDIUM', sector: 'Agricultura',
    description: 'Grano esencial mundial.',
    whyInvest: 'Depende de las cosechas. Entra y sal del mercado en un clic.',
    minInvestment: 50, isRealAsset: false, cfdWarning: true,
    performance: { y1: -15.2, y3: 45.2, y5: 25.0 }, sparkline: generateSparkline(-0.2), tags: ['alimentos', 'agricultura'], dividends: false, expenseRatio: null, profiles: ['moderado']
  },
  {
    symbol: 'CORN', name: 'Maíz', category: 'COMMODITY', risk: 'MEDIUM', sector: 'Agricultura',
    description: 'Producto agrícola básico.',
    whyInvest: 'Oportunidades estacionales claras. Muy líquido en eToro.',
    minInvestment: 50, isRealAsset: false, cfdWarning: true,
    performance: { y1: -18.5, y3: 35.2, y5: 15.0 }, sparkline: generateSparkline(-0.3), tags: ['alimentos', 'agricultura'], dividends: false, expenseRatio: null, profiles: ['moderado']
  },
  {
    symbol: 'SOYBEAN', name: 'Soya', category: 'COMMODITY', risk: 'MEDIUM', sector: 'Agricultura',
    description: 'Materia prima agrícola clave.',
    whyInvest: 'Volatilidad moderada, fácil de vender a la quincena.',
    minInvestment: 50, isRealAsset: false, cfdWarning: true,
    performance: { y1: -12.4, y3: 42.5, y5: 35.0 }, sparkline: generateSparkline(0.1), tags: ['alimentos', 'agricultura'], dividends: false, expenseRatio: null, profiles: ['moderado']
  },
  {
    symbol: 'SUGAR', name: 'Azúcar', category: 'COMMODITY', risk: 'HIGH', sector: 'Agricultura',
    description: 'Azúcar cruda.',
    whyInvest: 'A veces tiene repuntes muy grandes en cuestión de semanas.',
    minInvestment: 50, isRealAsset: false, cfdWarning: true,
    performance: { y1: 25.2, y3: 55.4, y5: 45.0 }, sparkline: generateSparkline(0.8), tags: ['alimentos', 'volátil'], dividends: false, expenseRatio: null, profiles: ['crecimiento']
  },
  {
    symbol: 'COFFEE', name: 'Café', category: 'COMMODITY', risk: 'HIGH', sector: 'Agricultura',
    description: 'Granos de café arábica.',
    whyInvest: 'Muy volátil por el clima en Brasil. Ideal para trades rápidos.',
    minInvestment: 50, isRealAsset: false, cfdWarning: true,
    performance: { y1: 45.2, y3: 85.2, y5: 125.0 }, sparkline: generateSparkline(1.5), tags: ['alimentos', 'volátil', 'corto-plazo'], dividends: false, expenseRatio: null, profiles: ['crecimiento']
  },
  {
    symbol: 'COTTON', name: 'Algodón', category: 'COMMODITY', risk: 'MEDIUM', sector: 'Agricultura',
    description: 'Materia prima textil.',
    whyInvest: 'Ciclos de precio estables que puedes aprovechar mensualmente.',
    minInvestment: 50, isRealAsset: false, cfdWarning: true,
    performance: { y1: -8.5, y3: 25.2, y5: 15.0 }, sparkline: generateSparkline(0.2), tags: ['textil', 'agricultura'], dividends: false, expenseRatio: null, profiles: ['moderado']
  },
  {
    symbol: 'COCOA', name: 'Cacao', category: 'COMMODITY', risk: 'HIGH', sector: 'Agricultura',
    description: 'Materia prima del chocolate. Históricamente muy volátil recientemente.',
    whyInvest: 'Increíbles subidas recientes. Si buscas riesgo a 15 días, es una opción.',
    minInvestment: 50, isRealAsset: false, cfdWarning: true,
    performance: { y1: 150.5, y3: 250.2, y5: 350.0 }, sparkline: generateSparkline(3.0), tags: ['alimentos', 'volátil', 'corto-plazo'], dividends: false, expenseRatio: null, profiles: ['crecimiento', 'corto-plazo']
  },

  // ==========================================
  // 15 CRIPTOMONEDAS
  // ==========================================
  {
    symbol: 'BTC', name: 'Bitcoin', category: 'CRYPTO', risk: 'HIGH', sector: 'Criptomonedas',
    description: 'La primera y más grande criptomoneda del mundo.',
    whyInvest: 'Alta volatilidad y potencial de ganancias masivas a corto/largo plazo.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 120.5, y3: 45.2, y5: 450.0 }, sparkline: generateSparkline(2.5), tags: ['crypto', 'oro digital'], dividends: false, expenseRatio: null, profiles: ['crecimiento', 'corto-plazo']
  },
  {
    symbol: 'ETH', name: 'Ethereum', category: 'CRYPTO', risk: 'HIGH', sector: 'Criptomonedas / Plataforma',
    description: 'Plataforma líder para contratos inteligentes y finanzas descentralizadas.',
    whyInvest: 'Segunda cripto más grande. Gran potencial si crees en el futuro de la web3.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 85.4, y3: 35.8, y5: 650.0 }, sparkline: generateSparkline(2.0), tags: ['crypto', 'web3'], dividends: false, expenseRatio: null, profiles: ['crecimiento']
  },
  {
    symbol: 'SOL', name: 'Solana', category: 'CRYPTO', risk: 'HIGH', sector: 'Criptomonedas / Plataforma',
    description: 'Red de altísima velocidad y bajas comisiones competidora de Ethereum.',
    whyInvest: 'Famosa por repuntes agresivos. Excelente para inversiones de muy corto plazo.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 450.2, y3: 15.4, y5: 850.0 }, sparkline: generateSparkline(3.0), tags: ['crypto', 'alta volatilidad'], dividends: false, expenseRatio: null, profiles: ['crecimiento', 'corto-plazo']
  },
  {
    symbol: 'ADA', name: 'Cardano', category: 'CRYPTO', risk: 'HIGH', sector: 'Criptomonedas / Plataforma',
    description: 'Blockchain enfocada en sostenibilidad e investigación científica.',
    whyInvest: 'Comunidad fuerte. Movimientos bruscos dependientes del mercado general cripto.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: -15.4, y3: 5.2, y5: 120.0 }, sparkline: generateSparkline(0.2), tags: ['crypto'], dividends: false, expenseRatio: null, profiles: ['crecimiento']
  },
  {
    symbol: 'XRP', name: 'Ripple', category: 'CRYPTO', risk: 'HIGH', sector: 'Criptomonedas / Pagos',
    description: 'Cripto enfocada en transferencias bancarias internacionales.',
    whyInvest: 'Suele tener repuntes cuando hay noticias sobre sus juicios y regulaciones.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 25.5, y3: -10.2, y5: 85.0 }, sparkline: generateSparkline(0.5), tags: ['crypto', 'bancos'], dividends: false, expenseRatio: null, profiles: ['crecimiento']
  },
  {
    symbol: 'DOT', name: 'Polkadot', category: 'CRYPTO', risk: 'HIGH', sector: 'Criptomonedas / Infraestructura',
    description: 'Proyecto que conecta diferentes blockchains entre sí.',
    whyInvest: 'Alta tecnología pero muy volátil. Buena si apuestas al largo plazo en cripto.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 15.2, y3: -25.5, y5: 50.0 }, sparkline: generateSparkline(0.3), tags: ['crypto'], dividends: false, expenseRatio: null, profiles: ['crecimiento']
  },
  {
    symbol: 'DOGE', name: 'Dogecoin', category: 'CRYPTO', risk: 'HIGH', sector: 'Criptomonedas / Memecoin',
    description: 'La memecoin original, muy influenciada por Elon Musk.',
    whyInvest: 'Para "apuestas" de alto riesgo a cortísimo plazo buscando bombazos virales.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 85.2, y3: -45.5, y5: 1200.0 }, sparkline: generateSparkline(-0.5), tags: ['crypto', 'meme', 'muy volátil'], dividends: false, expenseRatio: null, profiles: ['corto-plazo']
  },
  {
    symbol: 'SHIB', name: 'Shiba Inu', category: 'CRYPTO', risk: 'HIGH', sector: 'Criptomonedas / Memecoin',
    description: 'Rival de Dogecoin. Extrema volatilidad.',
    whyInvest: 'Especulación pura. Puedes duplicar o perder todo en 15 días.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 45.2, y3: -65.4, y5: 5000.0 }, sparkline: generateSparkline(-1.0), tags: ['crypto', 'meme', 'muy volátil'], dividends: false, expenseRatio: null, profiles: ['corto-plazo']
  },
  {
    symbol: 'MATIC', name: 'Polygon', category: 'CRYPTO', risk: 'HIGH', sector: 'Criptomonedas / Escala',
    description: 'Solución para hacer a Ethereum más rápido y barato.',
    whyInvest: 'Fundamental para la red de Ethereum, con buenas subidas en mercados alcistas.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 5.2, y3: 45.8, y5: 350.0 }, sparkline: generateSparkline(0.8), tags: ['crypto', 'web3'], dividends: false, expenseRatio: null, profiles: ['crecimiento']
  },
  {
    symbol: 'AVAX', name: 'Avalanche', category: 'CRYPTO', risk: 'HIGH', sector: 'Criptomonedas / Plataforma',
    description: 'Blockchain ultrarrápida rival de Ethereum y Solana.',
    whyInvest: 'Suele tener rebotes muy fuertes. Ideal para seguimiento quincenal.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 155.2, y3: 15.4, y5: 280.0 }, sparkline: generateSparkline(1.5), tags: ['crypto'], dividends: false, expenseRatio: null, profiles: ['crecimiento', 'corto-plazo']
  },
  {
    symbol: 'LINK', name: 'Chainlink', category: 'CRYPTO', risk: 'HIGH', sector: 'Criptomonedas / Oráculos',
    description: 'Conecta los contratos inteligentes con datos del mundo real.',
    whyInvest: 'Tecnología crucial para el ecosistema. Volatilidad alta pero consistente.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 85.4, y3: -15.2, y5: 450.0 }, sparkline: generateSparkline(0.6), tags: ['crypto'], dividends: false, expenseRatio: null, profiles: ['crecimiento']
  },
  {
    symbol: 'LTC', name: 'Litecoin', category: 'CRYPTO', risk: 'HIGH', sector: 'Criptomonedas',
    description: 'La plata digital, versión más ligera y rápida de Bitcoin.',
    whyInvest: 'Cripto clásica, menos volátil que las nuevas, pero sigue siendo de alto riesgo.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: -5.4, y3: -25.2, y5: 85.0 }, sparkline: generateSparkline(0.1), tags: ['crypto'], dividends: false, expenseRatio: null, profiles: ['crecimiento']
  },
  {
    symbol: 'TRX', name: 'Tron', category: 'CRYPTO', risk: 'HIGH', sector: 'Criptomonedas / Contenido',
    description: 'Red popular para transferir dólares digitales (USDT) barato.',
    whyInvest: 'Mucho uso real. Sorprendentemente estable para ser una cripto.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 65.2, y3: 45.8, y5: 125.0 }, sparkline: generateSparkline(1.0), tags: ['crypto'], dividends: false, expenseRatio: null, profiles: ['crecimiento']
  },
  {
    symbol: 'BCH', name: 'Bitcoin Cash', category: 'CRYPTO', risk: 'HIGH', sector: 'Criptomonedas',
    description: 'Bifurcación de Bitcoin diseñada para pagos rápidos.',
    whyInvest: 'Sube cuando el Bitcoin sube demasiado y las comisiones encarecen.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 15.2, y3: -45.5, y5: 55.0 }, sparkline: generateSparkline(0.2), tags: ['crypto'], dividends: false, expenseRatio: null, profiles: ['crecimiento']
  },
  {
    symbol: 'UNI', name: 'Uniswap', category: 'CRYPTO', risk: 'HIGH', sector: 'Criptomonedas / DeFi',
    description: 'El mayor intercambio descentralizado de criptomonedas.',
    whyInvest: 'Apuesta directa al futuro de las finanzas descentralizadas.',
    minInvestment: 10, isRealAsset: true, cfdWarning: false,
    performance: { y1: 45.2, y3: -35.4, y5: 180.0 }, sparkline: generateSparkline(0.4), tags: ['crypto', 'defi'], dividends: false, expenseRatio: null, profiles: ['crecimiento']
  }
];

// Información específica de Costa Rica
const COSTA_RICA_INFO = {
  minDeposit: 50,
  minDepositBank: 500,
  currency: 'USD',
  localCurrency: 'CRC (Colones)',
  paymentMethods: [
    { method: 'Tarjeta de Crédito/Débito', min: 50, note: 'Visa o Mastercard' },
    { method: 'Transferencia Bancaria', min: 500, note: 'Mínimo más alto' },
  ],
  warnings: [
    'Algunos bancos en Costa Rica pueden rechazar transferencias desde eToro. Verificá con tu banco antes de hacer depósitos grandes.',
    'eToro opera en dólares (USD). Si depositás en colones, se aplica una comisión por conversión de moneda.',
    'eToro no tiene licencia local en Costa Rica, opera bajo regulaciones internacionales (FCA, CySEC, ASIC).',
  ],
  verification: [
    'Cédula de identidad o pasaporte vigente',
    'Comprobante de domicilio (recibo de servicios recientes)',
    'Completar el formulario de conocimiento financiero'
  ],
  taxNote: 'Consultá con un contador en Costa Rica sobre tus obligaciones tributarias por ganancias de inversiones internacionales.'
};

// Función para obtener URL de eToro
function getEtoroUrl(symbol) {
  return ETORO_BASE_URL + symbol.toLowerCase();
}

function getInvestmentsByProfile(profileType) {
  return INVESTMENTS.filter(inv => inv.profiles.includes(profileType));
}

function searchInvestments(query) {
  const q = query.toLowerCase();
  return INVESTMENTS.filter(inv =>
    inv.symbol.toLowerCase().includes(q) ||
    inv.name.toLowerCase().includes(q) ||
    inv.sector.toLowerCase().includes(q) ||
    inv.tags.some(tag => tag.includes(q))
  );
}

function getInvestment(symbol) {
  return INVESTMENTS.find(inv => inv.symbol === symbol.toUpperCase());
}
