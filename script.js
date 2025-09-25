const navButtons = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view');

navButtons.forEach(button => {
  button.addEventListener('click', () => {
    const target = button.dataset.target;
    navButtons.forEach(btn => btn.classList.toggle('active', btn === button));
    views.forEach(view => view.classList.toggle('active', view.id === target));
  });
});

const toggleTheme = document.getElementById('toggleTheme');
toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  toggleTheme.textContent = document.body.classList.contains('dark') ? '日间模式' : '夜间模式';
});

const summarySnapshot = document.getElementById('summarySnapshot');
const snapshotMetrics = [
  { label: '累计监测箱梁', value: '1876 片' },
  { label: '累计报警处理', value: '368 次' },
  { label: '算法模型版本', value: 'v2.4.7' },
  { label: '系统在线时长', value: '29,640 小时' }
];
summarySnapshot.innerHTML = snapshotMetrics
  .map(item => `
    <div>
      <span>${item.label}</span>
      <strong>${item.value}</strong>
    </div>
  `)
  .join('');

const operationSteps = document.querySelectorAll('#operationSteps li');
let stepIndex = 0;
setInterval(() => {
  operationSteps.forEach((step, index) => {
    step.classList.toggle('active', index === stepIndex);
  });
  stepIndex = (stepIndex + 1) % operationSteps.length;
}, 5000);

const alerts = [
  { level: '二级', message: '北侧侧墙形变量 3.6mm，已进入微调状态', time: '16:28:24' },
  { level: '三级', message: '顶板局部下沉 5.4mm，执行快速校正', time: '16:24:11' },
  { level: '二级', message: '东南接缝错台 3.1mm，提示检查液压杆F2', time: '16:19:53' }
];

const alertList = document.getElementById('alertList');
const alertCount = document.getElementById('alertCount');

const renderAlerts = () => {
  alertList.innerHTML = alerts
    .map(alert => `
      <li>
        <span class="alert-level level-${alert.level}">${alert.level}</span>
        <span>${alert.message}</span>
        <time>${alert.time}</time>
      </li>
    `)
    .join('');
  alertCount.textContent = alerts.length;
};

renderAlerts();

const addAlert = () => {
  const now = new Date();
  const time = now.toTimeString().split(' ')[0];
  const randomLevel = Math.random() > 0.7 ? '三级' : '二级';
  alerts.unshift({
    level: randomLevel,
    message: randomLevel === '三级' ? '检测到顶板异常下沉，执行快速校正' : '侧墙形变量达预警阈值，建议关注',
    time
  });
  if (alerts.length > 6) alerts.pop();
  renderAlerts();
};

setInterval(addAlert, 18000);

const sensorList = document.getElementById('sensorList');
const sensorData = Array.from({ length: 10 }).map((_, index) => ({
  name: index < 4 ? `倾角传感器 A${index + 1}` : index < 8 ? `位移传感器 B${index - 3}` : `液压支撑 C${index - 7}`,
  type: index < 4 ? '倾角' : index < 8 ? '位移' : '液压',
  position: ['顶板-北侧', '顶板-南侧', '侧墙-东侧', '侧墙-西侧', '接缝-东北', '接缝-西南', '接缝-中部', '接缝-南端', '支撑-中部', '支撑-南端'][index],
  value: 0,
  unit: index < 4 ? '°' : index < 8 ? 'mm' : 'kN',
  status: 'normal'
}));

const renderSensors = () => {
  sensorList.innerHTML = sensorData
    .map(sensor => `
      <li class="${sensor.status}">
        <div class="sensor-status">
          <span class="status-dot"></span>
          <div>
            <strong>${sensor.name}</strong>
            <div>${sensor.position} · ${sensor.type}</div>
          </div>
        </div>
        <span>${sensor.value.toFixed(sensor.type === '液压' ? 1 : 2)} ${sensor.unit}</span>
      </li>
    `)
    .join('');
};

const updateSensors = () => {
  sensorData.forEach(sensor => {
    if (sensor.type === '倾角') {
      sensor.value = 0.1 + Math.random() * 0.4;
    } else if (sensor.type === '位移') {
      sensor.value = 1.2 + Math.random() * 3;
    } else {
      sensor.value = 60 + Math.random() * 20;
    }
    if (sensor.type === '位移' && sensor.value > 4.5) {
      sensor.status = 'danger';
    } else if (sensor.type === '位移' && sensor.value > 3.5) {
      sensor.status = 'warning';
    } else if (sensor.type === '倾角' && sensor.value > 0.35) {
      sensor.status = 'warning';
    } else if (sensor.type === '液压' && sensor.value < 62) {
      sensor.status = 'warning';
    } else {
      sensor.status = 'normal';
    }
  });
  renderSensors();
};

updateSensors();
setInterval(updateSensors, 5000);

const eventLog = document.getElementById('eventLog');
const logEntries = [
  { time: '16:28', detail: '液压杆 F2 执行 0.8mm 微调，状态恢复正常' },
  { time: '16:24', detail: '系统完成点云配准并更新数字孪生模型' },
  { time: '16:16', detail: '触发二级预警，提醒检查侧墙倾角传感器' }
];

const renderLog = () => {
  eventLog.innerHTML = logEntries
    .map(entry => `
      <li>
        <span>${entry.time}</span>
        <p>${entry.detail}</p>
      </li>
    `)
    .join('');
};

renderLog();

const addLogEntry = message => {
  const now = new Date();
  logEntries.unshift({ time: now.toTimeString().slice(0, 5), detail: message });
  if (logEntries.length > 6) logEntries.pop();
  renderLog();
};

setInterval(() => addLogEntry('完成新一轮数据融合，形变模型更新'), 24000);

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
  cycleStage.textContent = cycleStages[cycleIndex];
  cycleCountdown.textContent = cycleTime;
  cycleProgress.style.width = `${((60 - cycleTime) / 60) * 100}%`;
}, 1000);

const hydraulicLevel = document.getElementById('hydraulicLevel');
const hydraulicDisplacement = document.getElementById('hydraulicDisplacement');
const efficiencyIndicator = document.getElementById('efficiencyIndicator');
const hydraulicEfficiency = document.getElementById('hydraulicEfficiency');

setInterval(() => {
  const displacement = 2 + Math.random() * 6;
  const level = Math.min(100, displacement * 12);
  hydraulicLevel.style.height = `${level}%`;
  hydraulicDisplacement.textContent = displacement.toFixed(2);
  const efficiency = 95 + Math.random() * 4;
  efficiencyIndicator.textContent = efficiency > 96.5 ? '高效' : efficiency > 95.5 ? '稳定' : '关注';
  hydraulicEfficiency.textContent = `${efficiency.toFixed(0)}%`;
}, 3500);

const scanRate = document.getElementById('scanRate');
const actuatorDelay = document.getElementById('actuatorDelay');
const stabilityScore = document.getElementById('stabilityScore');
const onlineBeams = document.getElementById('onlineBeams');

setInterval(() => {
  scanRate.textContent = (1.4 + Math.random() * 0.6).toFixed(1);
  actuatorDelay.textContent = (16 + Math.random() * 6).toFixed(0);
  stabilityScore.textContent = `${(95 + Math.random() * 4).toFixed(0)}%`;
  onlineBeams.textContent = (10 + Math.floor(Math.random() * 4)).toString();
}, 4200);

const syncNow = document.getElementById('syncNow');
syncNow.addEventListener('click', () => {
  syncNow.classList.add('loading');
  syncNow.textContent = '同步中...';
  setTimeout(() => {
    syncNow.classList.remove('loading');
    syncNow.textContent = '同步数据';
    addLogEntry('完成手动同步，数据已与中央控制站对齐');
  }, 1800);
});

const exportReport = document.getElementById('exportReport');
exportReport.addEventListener('click', () => {
  addLogEntry('生成日报成功，已推送至管理平台');
});

const kpRange = document.getElementById('kpRange');
const tiRange = document.getElementById('tiRange');
const tdRange = document.getElementById('tdRange');
const kpValue = document.getElementById('kpValue');
const tiValue = document.getElementById('tiValue');
const tdValue = document.getElementById('tdValue');

const updatePidValues = () => {
  kpValue.textContent = parseFloat(kpRange.value).toFixed(1);
  tiValue.textContent = parseInt(tiRange.value, 10);
  tdValue.textContent = parseInt(tdRange.value, 10);
};

[kpRange, tiRange, tdRange].forEach(range => {
  range.addEventListener('input', () => {
    updatePidValues();
    const gain = parseFloat(kpRange.value);
    let level = 1;
    if (gain > 1.6 && gain <= 2.4) level = 2;
    if (gain > 2.4 && gain <= 3.1) level = 3;
    if (gain > 3.1) level = 4;
    updateStrategy(level.toString());
    drawPidChart();
  });
});

updatePidValues();

const strategyDetails = {
  1: ['记录局部形变数据，持续追踪趋势。', '维持液压系统待命，未触发调整。'],
  2: ['声光预警提醒操作员关注高亮区域。', '启动微调模式，采用低增益PID参数稳定跟踪。'],
  3: ['自动进入主动控制模式，匹配高增益PID参数。', '给出暂停浇筑或调整顺序建议。'],
  4: ['触发最高级别安全机制，锁定当前状态。', '建议立即停止浇筑，启动应急预案。']
};

const strategyButtons = document.querySelectorAll('.strategy-btn');
const strategyList = document.getElementById('strategyDetails');
const gaugeNeedle = document.getElementById('gaugeNeedle');

const updateStrategy = level => {
  strategyButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.level === level));
  strategyList.innerHTML = strategyDetails[level]
    .map(item => `<li>${item}</li>`)
    .join('');
  const angle = -100 + (parseInt(level, 10) - 1) * 60;
  gaugeNeedle.style.transform = `rotate(${angle}deg)`;
};

strategyButtons.forEach(btn => {
  btn.addEventListener('click', () => updateStrategy(btn.dataset.level));
});

updateStrategy('1');

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
  }, 3600);
}

const twinCanvas = document.getElementById('twinCanvas');
if (twinCanvas) {
  const ctx = twinCanvas.getContext('2d');
  const drawTwin = () => {
    ctx.clearRect(0, 0, twinCanvas.width, twinCanvas.height);
    ctx.fillStyle = '#0d1730';
    ctx.fillRect(0, 0, twinCanvas.width, twinCanvas.height);

    ctx.strokeStyle = 'rgba(56, 241, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 40, twinCanvas.width - 60, twinCanvas.height - 80);

    for (let i = 0; i < 6; i += 1) {
      ctx.beginPath();
      ctx.moveTo(30, 40 + i * 45);
      ctx.lineTo(twinCanvas.width - 30, 40 + i * 45);
      ctx.strokeStyle = 'rgba(56, 241, 255, 0.08)';
      ctx.stroke();
    }

    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.moveTo(30 + i * 120, 40);
      ctx.lineTo(30 + i * 120, twinCanvas.height - 40);
      ctx.stroke();
    }

    const points = sensorData.map(sensor => ({
      x: 60 + Math.random() * (twinCanvas.width - 120),
      y: 60 + Math.random() * (twinCanvas.height - 120),
      status: sensor.status
    }));

    points.forEach(point => {
      ctx.beginPath();
      let color = '#4dd97a';
      if (point.status === 'warning') color = '#ffae45';
      if (point.status === 'danger') color = '#ff4d6d';
      ctx.fillStyle = color;
      ctx.arc(point.x, point.y, point.status === 'danger' ? 10 : 7, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  drawTwin();
  setInterval(drawTwin, 3200);
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
let pidCtx;
if (pidCanvas) {
  pidCtx = pidCanvas.getContext('2d');
}

const drawPidChart = () => {
  if (!pidCtx) return;
  pidCtx.clearRect(0, 0, pidCanvas.width, pidCanvas.height);
  pidCtx.fillStyle = '#0e172f';
  pidCtx.fillRect(0, 0, pidCanvas.width, pidCanvas.height);

  pidCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  for (let i = 0; i < 6; i += 1) {
    pidCtx.beginPath();
    pidCtx.moveTo(20, 30 + i * 30);
    pidCtx.lineTo(pidCanvas.width - 20, 30 + i * 30);
    pidCtx.stroke();
  }

  const kp = parseFloat(kpRange.value);
  const ti = parseFloat(tiRange.value);
  const td = parseFloat(tdRange.value);

  pidCtx.beginPath();
  pidCtx.moveTo(30, pidCanvas.height - 40);
  for (let x = 0; x < 22; x += 1) {
    const time = x / 3;
    const response = 1 - Math.exp(-time * (kp / 3)) * Math.cos(time * (td / 12));
    const y = pidCanvas.height - 40 - response * (ti / 2);
    pidCtx.lineTo(30 + x * 15, y);
  }
  pidCtx.strokeStyle = 'rgba(56, 241, 255, 0.8)';
  pidCtx.lineWidth = 2.4;
  pidCtx.stroke();
};

drawPidChart();

const forecastCanvas = document.getElementById('forecastChart');
if (forecastCanvas) {
  const ctx = forecastCanvas.getContext('2d');
  const drawForecast = () => {
    ctx.clearRect(0, 0, forecastCanvas.width, forecastCanvas.height);
    ctx.fillStyle = '#0e172f';
    ctx.fillRect(0, 0, forecastCanvas.width, forecastCanvas.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    for (let i = 0; i < 6; i += 1) {
      ctx.beginPath();
      ctx.moveTo(20, 30 + i * 30);
      ctx.lineTo(forecastCanvas.width - 20, 30 + i * 30);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(30, forecastCanvas.height - 50);
    for (let x = 0; x < 18; x += 1) {
      const t = x / 2.2;
      const predicted = 2 + Math.sin(t) * 1.2 + Math.cos(t * 0.6) * 0.8;
      const y = forecastCanvas.height - 50 - predicted * 18;
      ctx.lineTo(30 + x * 16, y);
    }
    ctx.strokeStyle = 'rgba(255, 174, 69, 0.9)';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  drawForecast();
  setInterval(drawForecast, 6000);
}

const trendCanvas = document.getElementById('trendChart');
if (trendCanvas) {
  const ctx = trendCanvas.getContext('2d');
  const trendData = Array.from({ length: 30 }).map((_, index) => ({
    time: index,
    value: 1.5 + Math.sin(index / 4) * 0.5 + Math.random() * 0.2
  }));

  const drawTrend = () => {
    ctx.clearRect(0, 0, trendCanvas.width, trendCanvas.height);
    ctx.fillStyle = '#0e172f';
    ctx.fillRect(0, 0, trendCanvas.width, trendCanvas.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.moveTo(20, 20 + i * 40);
      ctx.lineTo(trendCanvas.width - 20, 20 + i * 40);
      ctx.stroke();
    }

    ctx.beginPath();
    trendData.forEach((point, index) => {
      const x = 20 + (index / (trendData.length - 1)) * (trendCanvas.width - 40);
      const y = trendCanvas.height - 20 - point.value * 35;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = 'rgba(77, 217, 122, 0.85)';
    ctx.lineWidth = 2.2;
    ctx.stroke();
  };

  const updateTrend = () => {
    trendData.shift();
    const last = trendData[trendData.length - 1];
    const nextValue = 1.5 + Math.sin((last.time + 1) / 4) * 0.5 + Math.random() * 0.3;
    trendData.push({ time: last.time + 1, value: nextValue });
    drawTrend();
  };

  drawTrend();
  setInterval(updateTrend, 4000);
}

const reportCanvas = document.getElementById('reportChart');
if (reportCanvas) {
  const ctx = reportCanvas.getContext('2d');
  const drawReport = () => {
    ctx.clearRect(0, 0, reportCanvas.width, reportCanvas.height);
    ctx.fillStyle = '#0e172f';
    ctx.fillRect(0, 0, reportCanvas.width, reportCanvas.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.moveTo(20, 20 + i * 40);
      ctx.lineTo(reportCanvas.width - 20, 20 + i * 40);
      ctx.stroke();
    }

    const quality = [90, 92, 95, 97, 99.5, 99.8];
    const efficiency = [0, 5, 10, 15, 20, 25];

    ctx.beginPath();
    quality.forEach((value, index) => {
      const x = 30 + (index / (quality.length - 1)) * (reportCanvas.width - 60);
      const y = reportCanvas.height - 30 - (value - 85) * 3;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = 'rgba(56, 241, 255, 0.85)';
    ctx.lineWidth = 2.4;
    ctx.stroke();

    ctx.beginPath();
    efficiency.forEach((value, index) => {
      const x = 30 + (index / (efficiency.length - 1)) * (reportCanvas.width - 60);
      const y = reportCanvas.height - 30 - value * 4;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = 'rgba(255, 174, 69, 0.85)';
    ctx.lineWidth = 2.4;
    ctx.stroke();
  };

  drawReport();
}

const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const target = button.dataset.tab;
    tabButtons.forEach(btn => btn.classList.toggle('active', btn === button));
    tabContents.forEach(content => content.classList.toggle('active', content.id === target));
  });
});

const tourSteps = [
  { target: 'overview', text: '系统总览模块，概览痛点剖析与关键指标。' },
  { target: 'monitoring', text: '实时监测中心，查看数字孪生、传感器与日志。' },
  { target: 'analysis', text: '数字孪生与算法模块，了解关键技术流程。' },
  { target: 'control', text: '调控中心，体验 PID 参数整定与分级策略。' },
  { target: 'operations', text: '施工运营模块，掌握部署方案与运维规范。' },
  { target: 'reports', text: '成效评估面板，对比智能系统与传统方法。' },
  { target: 'summary', text: '总结展望，查看成果档案与未来规划。' }
];

const tourOverlay = document.getElementById('tourOverlay');
const tourText = document.getElementById('tourText');
const tourNext = document.getElementById('tourNext');
const tourSkip = document.getElementById('tourSkip');
const startTour = document.getElementById('startTour');
let tourIndex = 0;

const switchView = id => {
  views.forEach(view => view.classList.toggle('active', view.id === id));
  navButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.target === id));
};

const showTourStep = index => {
  const step = tourSteps[index];
  if (!step) {
    tourOverlay.hidden = true;
    return;
  }
  tourText.textContent = step.text;
  switchView(step.target);
  tourOverlay.hidden = false;
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
