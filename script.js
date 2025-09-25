const smoothScroll = target => {
  const element = document.querySelector(target);
  if (!element) return;
  window.scrollTo({
    top: element.offsetTop - 80,
    behavior: 'smooth'
  });
};

document.querySelectorAll('[data-target]').forEach(btn => {
  btn.addEventListener('click', () => smoothScroll(btn.dataset.target));
});

const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tabId = button.dataset.tab;
    tabButtons.forEach(btn => btn.classList.toggle('active', btn === button));
    tabContents.forEach(content => content.classList.toggle('active', content.id === tabId));
  });
});

const strategyDetails = {
  1: [
    '记录局部形变数据，持续追踪趋势。',
    '维持液压系统待命，未触发调整。'
  ],
  2: [
    '声光预警提醒操作员关注高亮区域。',
    '启动微调模式，采用低增益PID参数稳定跟踪。'
  ],
  3: [
    '自动进入主动控制模式，匹配高增益PID参数。',
    '给出暂停浇筑或调整顺序建议。'
  ],
  4: [
    '触发最高级别安全机制，锁定当前状态。',
    '建议立即停止浇筑，启动应急预案。'
  ]
};

const gaugeNeedle = document.getElementById('gaugeNeedle');
const strategyList = document.getElementById('strategyDetails');
const strategyButtons = document.querySelectorAll('.strategy-btn');

const updateStrategy = level => {
  strategyButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.level === level));
  strategyList.innerHTML = strategyDetails[level].map(item => `<li>${item}</li>`).join('');
  const angle = -90 + (parseInt(level, 10) - 1) * 60;
  gaugeNeedle.style.transform = `rotate(${angle}deg)`;
};

strategyButtons.forEach(btn => {
  btn.addEventListener('click', () => updateStrategy(btn.dataset.level));
});

updateStrategy('1');

const sensorData = [
  { name: '倾角传感器 A1', type: '倾角', position: '顶板-北侧', value: 0.12, unit: '°' },
  { name: '倾角传感器 B4', type: '倾角', position: '侧墙-东侧', value: 0.21, unit: '°' },
  { name: '位移传感器 C2', type: '位移', position: '接缝-西北', value: 1.6, unit: 'mm' },
  { name: '位移传感器 D3', type: '位移', position: '接缝-东南', value: 2.9, unit: 'mm' },
  { name: '液压支撑 E1', type: '液压', position: '支撑-中部', value: 68, unit: 'kN' },
  { name: '液压支撑 F2', type: '液压', position: '支撑-南端', value: 74, unit: 'kN' }
];

const sensorList = document.getElementById('sensorList');

const renderSensors = () => {
  sensorList.innerHTML = sensorData
    .map(sensor => `
      <li>
        <div class="sensor-status">
          <span class="status-dot"></span>
          <div>
            <strong>${sensor.name}</strong>
            <div>${sensor.position} · ${sensor.type}</div>
          </div>
        </div>
        <span>${sensor.value.toFixed(2)} ${sensor.unit}</span>
      </li>
    `)
    .join('');
};

renderSensors();

const alerts = [
  { level: '二级', message: '北侧侧墙形变量 3.6mm，已进入微调状态', time: '16:28:24' },
  { level: '三级', message: '顶板局部下沉 5.4mm，执行快速校正', time: '16:24:11' },
  { level: '二级', message: '东南接缝错台 3.1mm，提示检查液压杆F2', time: '16:19:53' }
];

const alertList = document.getElementById('alertList');

const renderAlerts = () => {
  alertList.innerHTML = alerts
    .map(alert => `
      <li>
        <span class="alert-level">${alert.level}</span>
        <span>${alert.message}</span>
        <time>${alert.time}</time>
      </li>
    `)
    .join('');
};

renderAlerts();

const cycleStages = ['数据采集', '数据处理', '决策分析', '执行反馈'];
let cycleIndex = 0;
let cycleTime = 60;

const cycleStage = document.getElementById('cycleStage');
const cycleCountdown = document.getElementById('cycleCountdown');
const cycleProgress = document.getElementById('cycleProgress');

setInterval(() => {
  cycleTime -= 1;
  if (cycleTime <= 0) {
    cycleIndex = (cycleIndex + 1) % cycleStages.length;
    cycleTime = 60;
  }
  const stage = cycleStages[cycleIndex];
  cycleStage.textContent = stage;
  cycleCountdown.textContent = cycleTime;
  const progress = ((60 - cycleTime) / 60) * 100;
  cycleProgress.style.width = `${progress}%`;
}, 1000);

const hydraulicLevel = document.getElementById('hydraulicLevel');
const hydraulicDisplacement = document.getElementById('hydraulicDisplacement');
const hydraulicEfficiency = document.getElementById('hydraulicEfficiency');

setInterval(() => {
  const displacement = 2 + Math.random() * 6;
  const level = Math.min(100, displacement * 12);
  hydraulicLevel.style.height = `${level}%`;
  hydraulicDisplacement.textContent = displacement.toFixed(2);
  hydraulicEfficiency.textContent = `${(95 + Math.random() * 4).toFixed(0)}%`;
}, 3000);

const scanRate = document.getElementById('scanRate');
const actuatorDelay = document.getElementById('actuatorDelay');
const stabilityScore = document.getElementById('stabilityScore');

setInterval(() => {
  scanRate.textContent = (1.4 + Math.random() * 0.6).toFixed(1);
  actuatorDelay.textContent = (16 + Math.random() * 6).toFixed(0);
  stabilityScore.textContent = `${(95 + Math.random() * 4).toFixed(0)}%`;
}, 4000);

const kpRange = document.getElementById('kpRange');
const tiRange = document.getElementById('tiRange');
const tdRange = document.getElementById('tdRange');
const kpValue = document.getElementById('kpValue');
const tiValue = document.getElementById('tiValue');
const tdValue = document.getElementById('tdValue');

const updatePidValues = () => {
  if (!kpRange) return;
  kpValue.textContent = parseFloat(kpRange.value).toFixed(1);
  tiValue.textContent = parseInt(tiRange.value, 10);
  tdValue.textContent = parseInt(tdRange.value, 10);
};

[kpRange, tiRange, tdRange].forEach(range => {
  if (!range) return;
  range.addEventListener('input', () => {
    updatePidValues();
    const level = 1 + Math.round((kpRange.value - 0.5) / 0.9);
    const clamped = Math.min(4, Math.max(1, level));
    updateStrategy(String(clamped));
  });
});

updatePidValues();

const actuatorGrid = document.getElementById('actuatorGrid');

if (actuatorGrid) {
  const actuators = Array.from({ length: 8 }).map((_, index) => ({
    name: `液压杆 ${String.fromCharCode(65 + index)}`,
    displacement: 1.2 + Math.random() * 4,
    pressure: 60 + Math.random() * 20
  }));

  const renderActuators = () => {
    actuatorGrid.innerHTML = actuators
      .map(actuator => `
        <div class="actuator-card">
          <h4>${actuator.name}</h4>
          <div class="actuator-bar"><span style="width:${Math.min(100, actuator.displacement * 20)}%"></span></div>
          <div class="actuator-stats">
            <span>${actuator.displacement.toFixed(2)} mm</span>
            <span>${actuator.pressure.toFixed(1)} kN</span>
          </div>
        </div>
      `)
      .join('');
  };

  renderActuators();

  setInterval(() => {
    actuators.forEach(actuator => {
      actuator.displacement = Math.max(0.8, actuator.displacement + (Math.random() - 0.5) * 0.6);
      actuator.pressure = Math.max(55, Math.min(85, actuator.pressure + (Math.random() - 0.5) * 4));
    });
    renderActuators();
  }, 3200);
}

const canvas = document.getElementById('twinCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const drawTwin = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0d1730';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(56, 241, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 50, canvas.width - 80, canvas.height - 100);

    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.moveTo(40, 50 + i * 30);
      ctx.lineTo(canvas.width - 40, 50 + i * 30);
      ctx.strokeStyle = 'rgba(56, 241, 255, 0.1)';
      ctx.stroke();
    }

    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.moveTo(40 + i * 80, 50);
      ctx.lineTo(40 + i * 80, canvas.height - 50);
      ctx.stroke();
    }

    for (let i = 0; i < 16; i += 1) {
      const x = 60 + Math.random() * (canvas.width - 120);
      const y = 70 + Math.random() * (canvas.height - 140);
      const deviation = Math.random();
      let color = '#4dd97a';
      if (deviation > 0.6) color = '#ffae45';
      if (deviation > 0.82) color = '#ff4d6d';
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(x, y, 6 + deviation * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  drawTwin();
  setInterval(drawTwin, 3500);
}

const heatmapCanvas = document.getElementById('heatmap');
if (heatmapCanvas) {
  const ctx = heatmapCanvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, heatmapCanvas.width, heatmapCanvas.height);
  gradient.addColorStop(0, 'rgba(77, 217, 122, 0.1)');
  gradient.addColorStop(0.5, 'rgba(255, 174, 69, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 77, 109, 0.4)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, heatmapCanvas.width, heatmapCanvas.height);

  ctx.strokeStyle = 'rgba(56, 241, 255, 0.25)';
  ctx.lineWidth = 1.6;
  ctx.strokeRect(30, 30, heatmapCanvas.width - 60, heatmapCanvas.height - 60);

  for (let i = 0; i < 50; i += 1) {
    const x = 30 + Math.random() * (heatmapCanvas.width - 60);
    const y = 30 + Math.random() * (heatmapCanvas.height - 60);
    const intensity = Math.random();
    ctx.beginPath();
    ctx.fillStyle = `rgba(56, 241, 255, ${0.1 + intensity * 0.4})`;
    ctx.arc(x, y, 4 + intensity * 6, 0, Math.PI * 2);
    ctx.fill();
  }
}

const pidCanvas = document.getElementById('pidChart');
if (pidCanvas) {
  const ctx = pidCanvas.getContext('2d');
  const drawChart = () => {
    ctx.clearRect(0, 0, pidCanvas.width, pidCanvas.height);
    ctx.fillStyle = '#0e172f';
    ctx.fillRect(0, 0, pidCanvas.width, pidCanvas.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    for (let i = 0; i < 6; i += 1) {
      ctx.beginPath();
      ctx.moveTo(20, 30 + i * 30);
      ctx.lineTo(pidCanvas.width - 20, 30 + i * 30);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(30, pidCanvas.height - 40);
    for (let x = 0; x < 20; x += 1) {
      const time = x / 3;
      const response = 1 - Math.exp(-time) * Math.cos(time * 1.8);
      const y = pidCanvas.height - 40 - response * 120;
      ctx.lineTo(30 + x * 15, y);
    }
    ctx.strokeStyle = 'rgba(56, 241, 255, 0.8)';
    ctx.lineWidth = 2.4;
    ctx.stroke();
  };

  drawChart();
}

const tourSteps = [
  { target: '#hero', text: '了解系统愿景与性能指标，点击操作按钮即可跳转到对应模块。' },
  { target: '#architecture', text: '查看多层架构设计，切换标签了解各项关键技术。' },
  { target: '#dashboard', text: '实时面板展示点云映射、传感网络与调控状态。' },
  { target: '#deployment', text: '熟悉施工阶段部署流程与运维规范。' },
  { target: '#outcome', text: '审视系统成效、经济价值与未来展望。' }
];

const tourOverlay = document.getElementById('tourOverlay');
const tourText = document.getElementById('tourText');
const tourNext = document.getElementById('tourNext');
const tourSkip = document.getElementById('tourSkip');
const startTour = document.getElementById('startTour');
let tourIndex = 0;

const showTourStep = index => {
  const step = tourSteps[index];
  if (!step) {
    tourOverlay.hidden = true;
    return;
  }
  tourText.textContent = step.text;
  tourOverlay.hidden = false;
  smoothScroll(step.target);
};

startTour.addEventListener('click', () => {
  tourIndex = 0;
  showTourStep(tourIndex);
});

tourNext.addEventListener('click', () => {
  tourIndex += 1;
  if (tourIndex >= tourSteps.length) {
    tourOverlay.hidden = true;
  } else {
    showTourStep(tourIndex);
  }
});

tourSkip.addEventListener('click', () => {
  tourOverlay.hidden = true;
});

const twinCanvas = document.querySelector('.digital-twin');
if (twinCanvas) {
  twinCanvas.addEventListener('mousemove', e => {
    const rect = twinCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    twinCanvas.style.setProperty('--mouse-x', `${x}px`);
    twinCanvas.style.setProperty('--mouse-y', `${y}px`);
  });
}
