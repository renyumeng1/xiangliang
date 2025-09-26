// 全局变量
let sensorData = [];
let alertsData = [];
let chartInstances = {};
let updateIntervals = {};

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

// 应用初始化
function initializeApp() {
  initializeNavigation();
  initializeTimeDisplay();
  initializeFakeData();
  initializeDashboard();
  initializeMonitoring();
  initializeSensors();
  initializeControl();
  initializeAnalysis();
  initializeSettings();
  startDataUpdates();
}

// 导航功能初始化
function initializeNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const views = document.querySelectorAll('.view');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetView = item.dataset.view;
      
      // 更新导航状态
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      // 切换视图
      views.forEach(view => {
        view.classList.remove('active');
        if (view.id === targetView) {
          view.classList.add('active');
        }
      });
      
      // 触发视图特定的初始化
      onViewChange(targetView);
    });
  });
}

// 视图切换处理
function onViewChange(viewName) {
  switch(viewName) {
    case 'dashboard':
      updateDashboard();
      break;
    case 'monitoring':
      updateMonitoring();
      break;
    case 'sensors':
      updateSensorsTable();
      break;
    case 'control':
      updateControlPanels();
      break;
    case 'analysis':
      updateAnalysisCharts();
      break;
  }
}

// 时间显示初始化
function initializeTimeDisplay() {
  function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    document.getElementById('currentTime').textContent = timeString;
  }
  
  updateTime();
  setInterval(updateTime, 1000);
}

// 假数据初始化
function initializeFakeData() {
  // 初始化传感器数据
  sensorData = generateSensorData();
  
  // 初始化告警数据
  alertsData = generateAlertsData();
}

// 生成传感器数据
function generateSensorData() {
  const sensors = [];
  const sensorTypes = [
    { type: 'displacement', name: '位移传感器', unit: 'mm', range: [0, 10] },
    { type: 'strain', name: '应变传感器', unit: 'με', range: [0, 500] },
    { type: 'pressure', name: '压力传感器', unit: 'MPa', range: [0, 100] },
    { type: 'temperature', name: '温度传感器', unit: '°C', range: [20, 35] }
  ];
  
  const positions = [
    '顶板-北侧', '顶板-南侧', '顶板-中央',
    '侧墙-东侧', '侧墙-西侧',
    '底板-北端', '底板-南端', '底板-中央'
  ];
  
  for (let i = 0; i < 128; i++) {
    const typeIndex = i % sensorTypes.length;
    const type = sensorTypes[typeIndex];
    const positionIndex = i % positions.length;
    
    sensors.push({
      id: `S${String(i + 1).padStart(3, '0')}`,
      name: `${type.name}${Math.floor(i / sensorTypes.length) + 1}`,
      type: type.type,
      typeName: type.name,
      position: positions[positionIndex],
      unit: type.unit,
      value: generateRandomValue(type.range[0], type.range[1]),
      status: Math.random() > 0.85 ? (Math.random() > 0.5 ? 'warning' : 'critical') : 'normal',
      lastUpdate: new Date(),
      isOnline: Math.random() > 0.02
    });
  }
  
  return sensors;
}

// 生成告警数据
function generateAlertsData() {
  const alerts = [];
  const alertMessages = [
    '传感器S001位移超出阈值',
    '液压缸C3压力异常',
    '温度传感器T12通信中断',
    '应变传感器ST05数值波动',
    '系统自检发现异常',
    '数据采集延迟',
    '控制器响应超时'
  ];
  
  for (let i = 0; i < 15; i++) {
    alerts.push({
      id: `A${String(i + 1).padStart(3, '0')}`,
      level: Math.random() > 0.7 ? 'critical' : (Math.random() > 0.5 ? 'warning' : 'info'),
      message: alertMessages[Math.floor(Math.random() * alertMessages.length)],
      time: new Date(Date.now() - Math.random() * 86400000), // 24小时内随机时间
      acknowledged: Math.random() > 0.3
    });
  }
  
  return alerts.sort((a, b) => b.time - a.time);
}

// 生成随机数值
function generateRandomValue(min, max, decimals = 2) {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

// 仪表板初始化
function initializeDashboard() {
  updateMetricCards();
  initializeTrendChart();
  updateDeviceList();
  updateAlertsList();
}

// 更新指标卡片
function updateMetricCards() {
  const totalSensors = sensorData.length;
  const onlineSensors = sensorData.filter(s => s.isOnline).length;
  const activeAlerts = alertsData.filter(a => !a.acknowledged && a.level !== 'info').length;
  const onlineRate = ((onlineSensors / totalSensors) * 100).toFixed(1);
  
  document.getElementById('totalSensors').textContent = totalSensors;
  document.getElementById('activeAlerts').textContent = activeAlerts;
  document.getElementById('deviceOnlineRate').textContent = `${onlineRate}%`;
  document.getElementById('dataIntegrity').textContent = '99.7%';
}

// 初始化趋势图表
function initializeTrendChart() {
  const ctx = document.getElementById('trendChart');
  if (!ctx) return;
  
  const hours = [];
  const displacementData = [];
  const strainData = [];
  
  for (let i = 23; i >= 0; i--) {
    const hour = new Date(Date.now() - i * 3600000);
    hours.push(hour.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
    displacementData.push(generateRandomValue(1, 8, 1));
    strainData.push(generateRandomValue(50, 300, 0));
  }
  
  if (chartInstances.trendChart) {
    chartInstances.trendChart.destroy();
  }
  
  chartInstances.trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: hours,
      datasets: [
        {
          label: '位移 (mm)',
          data: displacementData,
          borderColor: '#3182ce',
          backgroundColor: 'rgba(49, 130, 206, 0.1)',
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: '应变 (με)',
          data: strainData,
          borderColor: '#ed8936',
          backgroundColor: 'rgba(237, 137, 54, 0.1)',
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: '位移 (mm)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: '应变 (με)'
          },
          grid: {
            drawOnChartArea: false,
          }
        }
      },
      plugins: {
        legend: {
          position: 'top'
        }
      }
    }
  });
}

// 更新设备列表
function updateDeviceList() {
  const deviceList = document.getElementById('deviceList');
  if (!deviceList) return;
  
  const criticalSensors = sensorData.filter(s => s.status === 'critical').slice(0, 8);
  const warningSensors = sensorData.filter(s => s.status === 'warning').slice(0, 5);
  const normalSensors = sensorData.filter(s => s.status === 'normal').slice(0, 10);
  
  const displaySensors = [...criticalSensors, ...warningSensors, ...normalSensors].slice(0, 15);
  
  deviceList.innerHTML = displaySensors.map(sensor => `
    <div class="device-item">
      <div class="device-info">
        <div class="device-status-dot ${sensor.status}"></div>
        <div>
          <div class="device-name">${sensor.name}</div>
          <div class="device-location">${sensor.position}</div>
        </div>
      </div>
      <div class="device-value">${sensor.value} ${sensor.unit}</div>
    </div>
  `).join('');
}

// 更新告警列表
function updateAlertsList() {
  const alertsList = document.getElementById('alertsList');
  if (!alertsList) return;
  
  const recentAlerts = alertsData.slice(0, 10);
  
  alertsList.innerHTML = recentAlerts.map(alert => `
    <div class="alert-item">
      <div class="alert-level ${alert.level}">${alert.level}</div>
      <div class="alert-message">${alert.message}</div>
      <div class="alert-time">${alert.time.toLocaleTimeString('zh-CN')}</div>
    </div>
  `).join('');
}

// 监测视图初始化
function initializeMonitoring() {
  initializeSensorPoints();
  initializeDataTabs();
  updateSensorGrid();
  updateHistoryTable();
}

// 初始化传感器点位
function initializeSensorPoints() {
  const sensorPoints = document.querySelectorAll('.sensor-point');
  sensorPoints.forEach(point => {
    point.addEventListener('click', () => {
      const sensorId = point.dataset.sensor;
      showSensorModal(sensorId);
    });
  });
}

// 初始化数据标签页
function initializeDataTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.dataset.tab;
      
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${targetTab}-tab`) {
          content.classList.add('active');
        }
      });
    });
  });
}

// 更新传感器网格
function updateSensorGrid() {
  const sensorGrid = document.getElementById('sensorGrid');
  if (!sensorGrid) return;
  
  const recentSensors = sensorData.slice(0, 12);
  
  sensorGrid.innerHTML = recentSensors.map(sensor => `
    <div class="sensor-card">
      <div class="sensor-header">
        <div>
          <div class="sensor-name">${sensor.name}</div>
          <div class="sensor-type">${sensor.position}</div>
        </div>
        <div class="device-status-dot ${sensor.status}"></div>
      </div>
      <div class="sensor-value">
        ${sensor.value}<span class="sensor-unit">${sensor.unit}</span>
      </div>
    </div>
  `).join('');
}

// 更新历史记录表格
function updateHistoryTable() {
  const historyTableBody = document.getElementById('historyTableBody');
  if (!historyTableBody) return;
  
  const historyEvents = [
    { time: new Date(Date.now() - 300000), event: '传感器S045数据更新', status: 'normal' },
    { time: new Date(Date.now() - 600000), event: '液压缸C2执行调整', status: 'info' },
    { time: new Date(Date.now() - 900000), event: '系统自动校准完成', status: 'success' },
    { time: new Date(Date.now() - 1200000), event: '告警S023已处理', status: 'success' },
    { time: new Date(Date.now() - 1800000), event: '数据采集异常恢复', status: 'warning' }
  ];
  
  historyTableBody.innerHTML = historyEvents.map(event => `
    <tr>
      <td>${event.time.toLocaleTimeString('zh-CN')}</td>
      <td>${event.event}</td>
      <td><span class="badge badge-${event.status === 'normal' || event.status === 'success' ? 'success' : event.status}">${event.status}</span></td>
    </tr>
  `).join('');
}

// 传感器管理初始化
function initializeSensors() {
  initializeSensorSearch();
  initializeSensorFilters();
  updateSensorsTable();
}

// 初始化传感器搜索
function initializeSensorSearch() {
  const searchInput = document.getElementById('sensorSearch');
  if (!searchInput) return;
  
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    updateSensorsTable(searchTerm);
  });
}

// 初始化传感器筛选器
function initializeSensorFilters() {
  const typeFilter = document.getElementById('sensorTypeFilter');
  if (!typeFilter) return;
  
  typeFilter.addEventListener('change', (e) => {
    const filterType = e.target.value;
    const searchTerm = document.getElementById('sensorSearch')?.value || '';
    updateSensorsTable(searchTerm, filterType);
  });
}

// 更新传感器表格
function updateSensorsTable(searchTerm = '', filterType = 'all') {
  const sensorsTableBody = document.getElementById('sensorsTableBody');
  if (!sensorsTableBody) return;
  
  let filteredSensors = sensorData;
  
  if (searchTerm) {
    filteredSensors = filteredSensors.filter(sensor => 
      sensor.name.toLowerCase().includes(searchTerm) ||
      sensor.id.toLowerCase().includes(searchTerm) ||
      sensor.position.toLowerCase().includes(searchTerm)
    );
  }
  
  if (filterType !== 'all') {
    filteredSensors = filteredSensors.filter(sensor => sensor.type === filterType);
  }
  
  sensorsTableBody.innerHTML = filteredSensors.map(sensor => `
    <tr>
      <td>${sensor.id}</td>
      <td>${sensor.name}</td>
      <td>${sensor.typeName}</td>
      <td>${sensor.position}</td>
      <td>${sensor.value} ${sensor.unit}</td>
      <td>
        <span class="badge badge-${sensor.status === 'normal' ? 'success' : sensor.status === 'warning' ? 'warning' : 'danger'}">
          ${sensor.isOnline ? (sensor.status === 'normal' ? '正常' : sensor.status === 'warning' ? '警告' : '异常') : '离线'}
        </span>
      </td>
      <td>${sensor.lastUpdate.toLocaleString('zh-CN')}</td>
      <td>
        <button class="btn-icon" onclick="showSensorModal('${sensor.id}')">
          <i class="fas fa-eye"></i>
        </button>
        <button class="btn-icon">
          <i class="fas fa-edit"></i>
        </button>
      </td>
    </tr>
  `).join('');
  
  // 更新统计信息
  updateSensorStats(filteredSensors);
}

// 更新传感器统计
function updateSensorStats(sensors = sensorData) {
  const totalCount = sensors.length;
  const onlineCount = sensors.filter(s => s.isOnline).length;
  const offlineCount = totalCount - onlineCount;
  
  document.getElementById('totalSensorCount').textContent = totalCount;
  document.getElementById('onlineSensorCount').textContent = onlineCount;
  document.getElementById('offlineSensorCount').textContent = offlineCount;
}

// 控制面板初始化
function initializeControl() {
  initializeHydraulicControls();
  initializeParameterSettings();
  updateCylinderGrid();
  updateControlLog();
}

// 初始化液压控制
function initializeHydraulicControls() {
  const controlButtons = document.querySelectorAll('.btn-control');
  controlButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const action = button.dataset.action;
      handleHydraulicAction(action);
    });
  });
}

// 处理液压动作
function handleHydraulicAction(action) {
  const timestamp = new Date().toLocaleTimeString('zh-CN');
  let message = '';
  
  switch(action) {
    case 'start':
      message = `液压泵启动 - ${timestamp}`;
      updateMainPressure(85 + Math.random() * 10);
      break;
    case 'stop':
      message = `液压泵停止 - ${timestamp}`;
      updateMainPressure(0);
      break;
  }
  
  addControlLogEntry(message);
}

// 更新主液压压力
function updateMainPressure(pressure) {
  document.getElementById('mainPressure').textContent = Math.round(pressure);
}

// 初始化参数设置
function initializeParameterSettings() {
  const applyButtons = document.querySelectorAll('.btn-apply');
  applyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const setting = button.parentElement.previousElementSibling;
      const value = setting.value;
      const label = button.parentElement.parentElement.querySelector('label').textContent;
      
      addControlLogEntry(`参数更新: ${label} = ${value} - ${new Date().toLocaleTimeString('zh-CN')}`);
    });
  });
}

// 更新液压缸网格
function updateCylinderGrid() {
  const cylinderGrid = document.getElementById('cylinderGrid');
  if (!cylinderGrid) return;
  
  const cylinders = Array.from({ length: 6 }, (_, i) => ({
    id: `C${i + 1}`,
    pressure: generateRandomValue(60, 90, 1),
    position: generateRandomValue(10, 90, 1)
  }));
  
  cylinderGrid.innerHTML = cylinders.map(cylinder => `
    <div class="cylinder-control">
      <div style="font-weight: 500; margin-bottom: 8px;">${cylinder.id}</div>
      <div style="font-size: 12px; margin-bottom: 4px;">压力: ${cylinder.pressure} bar</div>
      <div style="font-size: 12px;">位置: ${cylinder.position}%</div>
    </div>
  `).join('');
}

// 更新控制日志
function updateControlLog() {
  const controlLog = document.getElementById('controlLog');
  if (!controlLog) return;
  
  const logEntries = [
    '系统初始化完成 - 14:23:45',
    '液压泵启动 - 14:25:12',
    '传感器校准完成 - 14:27:33',
    '自动控制模式激活 - 14:30:01'
  ];
  
  controlLog.innerHTML = logEntries.map(entry => `
    <div class="log-entry">[INFO] ${entry}</div>
  `).join('');
}

// 添加控制日志条目
function addControlLogEntry(message) {
  const controlLog = document.getElementById('controlLog');
  if (!controlLog) return;
  
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.textContent = `[INFO] ${message}`;
  
  controlLog.insertBefore(entry, controlLog.firstChild);
  
  // 限制日志条目数量
  while (controlLog.children.length > 50) {
    controlLog.removeChild(controlLog.lastChild);
  }
}

// 数据分析初始化
function initializeAnalysis() {
  initializeAnalysisCharts();
  updateAnalysisSummary();
}

// 初始化分析图表
function initializeAnalysisCharts() {
  initializeDisplacementChart();
  initializeAlertsChart();
}

// 初始化位移图表
function initializeDisplacementChart() {
  const ctx = document.getElementById('displacementChart');
  if (!ctx) return;
  
  const days = [];
  const avgDisplacement = [];
  const maxDisplacement = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    days.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
    avgDisplacement.push(generateRandomValue(2, 5, 1));
    maxDisplacement.push(generateRandomValue(6, 10, 1));
  }
  
  if (chartInstances.displacementChart) {
    chartInstances.displacementChart.destroy();
  }
  
  chartInstances.displacementChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: days,
      datasets: [
        {
          label: '平均位移',
          data: avgDisplacement,
          backgroundColor: 'rgba(49, 130, 206, 0.8)',
          borderColor: '#3182ce',
          borderWidth: 1
        },
        {
          label: '最大位移',
          data: maxDisplacement,
          backgroundColor: 'rgba(237, 137, 54, 0.8)',
          borderColor: '#ed8936',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: '位移 (mm)'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top'
        }
      }
    }
  });
}

// 初始化告警统计图表
function initializeAlertsChart() {
  const ctx = document.getElementById('alertsChart');
  if (!ctx) return;
  
  if (chartInstances.alertsChart) {
    chartInstances.alertsChart.destroy();
  }
  
  chartInstances.alertsChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['严重', '警告', '信息'],
      datasets: [{
        data: [
          alertsData.filter(a => a.level === 'critical').length,
          alertsData.filter(a => a.level === 'warning').length,
          alertsData.filter(a => a.level === 'info').length
        ],
        backgroundColor: [
          '#f56565',
          '#ed8936',
          '#3182ce'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// 更新分析摘要
function updateAnalysisSummary() {
  const analysisSummary = document.getElementById('analysisSummary');
  if (!analysisSummary) return;
  
  const summaryItems = [
    '平均位移值较上周下降12%，系统稳定性提升',
    '高风险传感器数量减少至3个，较昨日下降2个',
    '液压系统响应时间平均15.2秒，满足设计要求',
    '数据完整率保持在99.7%以上，通信稳定',
    '预测模型准确率达到94.3%，持续优化中'
  ];
  
  analysisSummary.innerHTML = summaryItems.map(item => `
    <div class="summary-item">${item}</div>
  `).join('');
}

// 系统设置初始化
function initializeSettings() {
  initializeSettingsNavigation();
  initializeAlertRules();
}

// 初始化设置导航
function initializeSettingsNavigation() {
  const settingsNavItems = document.querySelectorAll('.settings-nav-item');
  const settingsSections = document.querySelectorAll('.settings-section');
  
  settingsNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetSection = item.dataset.section;
      
      settingsNavItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      settingsSections.forEach(section => {
        section.classList.remove('active');
        if (section.id === `${targetSection}-settings`) {
          section.classList.add('active');
        }
      });
    });
  });
}

// 初始化告警规则
function initializeAlertRules() {
  const alertRules = document.getElementById('alertRules');
  if (!alertRules) return;
  
  const rules = [
    { parameter: '位移', threshold: '5.0mm', action: '发送邮件通知' },
    { parameter: '应变', threshold: '100με', action: '触发声音告警' },
    { parameter: '压力', threshold: '90bar', action: '自动调整液压' },
    { parameter: '温度', threshold: '35°C', action: '发送短信通知' }
  ];
  
  alertRules.innerHTML = rules.map((rule, index) => `
    <div class="form-group">
      <label>${rule.parameter}告警规则</label>
      <div class="input-group">
        <input type="text" value="${rule.threshold}">
        <select>
          <option selected>${rule.action}</option>
          <option>仅记录日志</option>
          <option>发送邮件通知</option>
          <option>触发声音告警</option>
          <option>自动调整液压</option>
        </select>
        <button class="btn-apply">保存</button>
      </div>
    </div>
  `).join('');
}

// 显示传感器模态框
function showSensorModal(sensorId) {
  const sensor = sensorData.find(s => s.id === sensorId);
  if (!sensor) return;
  
  const modal = document.getElementById('sensorModal');
  const modalBody = document.getElementById('sensorModalBody');
  
  modalBody.innerHTML = `
    <div class="sensor-detail">
      <h4>${sensor.name} (${sensor.id})</h4>
      <div class="detail-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px;">
        <div>
          <strong>类型:</strong> ${sensor.typeName}
        </div>
        <div>
          <strong>位置:</strong> ${sensor.position}
        </div>
        <div>
          <strong>当前值:</strong> ${sensor.value} ${sensor.unit}
        </div>
        <div>
          <strong>状态:</strong> <span class="status-${sensor.status}">${sensor.status === 'normal' ? '正常' : sensor.status === 'warning' ? '警告' : '异常'}</span>
        </div>
        <div>
          <strong>最后更新:</strong> ${sensor.lastUpdate.toLocaleString('zh-CN')}
        </div>
        <div>
          <strong>在线状态:</strong> ${sensor.isOnline ? '在线' : '离线'}
        </div>
      </div>
      <div style="margin-top: 20px;">
        <h5>历史数据</h5>
        <canvas id="sensorHistoryChart" width="400" height="200"></canvas>
      </div>
    </div>
  `;
  
  modal.classList.add('active');
  
  // 初始化传感器历史图表
  setTimeout(() => {
    initializeSensorHistoryChart(sensor);
  }, 100);
}

// 初始化传感器历史图表
function initializeSensorHistoryChart(sensor) {
  const ctx = document.getElementById('sensorHistoryChart');
  if (!ctx) return;
  
  const hours = [];
  const values = [];
  
  for (let i = 23; i >= 0; i--) {
    const hour = new Date(Date.now() - i * 3600000);
    hours.push(hour.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
    
    // 基于传感器类型生成合理的历史数据
    let baseValue = sensor.value;
    let variation = baseValue * 0.2;
    values.push(generateRandomValue(baseValue - variation, baseValue + variation, 2));
  }
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: hours,
      datasets: [{
        label: `${sensor.name} (${sensor.unit})`,
        data: values,
        borderColor: '#3182ce',
        backgroundColor: 'rgba(49, 130, 206, 0.1)',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          title: {
            display: true,
            text: sensor.unit
          }
        }
      }
    }
  });
}

// 关闭模态框
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal')) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.classList.remove('active'));
  }
});

// 开始数据更新
function startDataUpdates() {
  // 每5秒更新传感器数据
  updateIntervals.sensors = setInterval(() => {
    updateSensorData();
    updateCurrentView();
  }, 5000);
  
  // 每30秒生成新告警
  updateIntervals.alerts = setInterval(() => {
    generateNewAlert();
  }, 30000);
  
  // 每10秒更新液压数据
  updateIntervals.hydraulic = setInterval(() => {
    updateHydraulicData();
  }, 10000);
}

// 更新传感器数据
function updateSensorData() {
  sensorData.forEach(sensor => {
    if (sensor.isOnline && Math.random() > 0.1) { // 90%概率更新在线传感器
      const variation = sensor.value * 0.1;
      sensor.value = generateRandomValue(
        Math.max(0, sensor.value - variation), 
        sensor.value + variation, 
        2
      );
      sensor.lastUpdate = new Date();
      
      // 随机改变状态
      if (Math.random() > 0.95) {
        const statuses = ['normal', 'warning', 'critical'];
        sensor.status = statuses[Math.floor(Math.random() * statuses.length)];
      }
    }
  });
}

// 生成新告警
function generateNewAlert() {
  const messages = [
    '传感器数据异常波动',
    '液压系统压力超限',
    '通信延迟检测',
    '设备响应超时',
    '数据完整性检查失败'
  ];
  
  const newAlert = {
    id: `A${String(alertsData.length + 1).padStart(3, '0')}`,
    level: Math.random() > 0.7 ? 'critical' : (Math.random() > 0.5 ? 'warning' : 'info'),
    message: messages[Math.floor(Math.random() * messages.length)],
    time: new Date(),
    acknowledged: false
  };
  
  alertsData.unshift(newAlert);
  
  // 限制告警数量
  if (alertsData.length > 50) {
    alertsData = alertsData.slice(0, 50);
  }
}

// 更新液压数据
function updateHydraulicData() {
  const mainPressure = generateRandomValue(80, 95, 0);
  document.getElementById('mainPressure').textContent = mainPressure;
}

// 更新当前视图
function updateCurrentView() {
  const activeView = document.querySelector('.view.active');
  if (!activeView) return;
  
  switch(activeView.id) {
    case 'dashboard':
      updateDashboard();
      break;
    case 'monitoring':
      updateMonitoring();
      break;
    case 'sensors':
      updateSensorsTable();
      break;
  }
}

// 更新仪表板
function updateDashboard() {
  updateMetricCards();
  updateDeviceList();
  updateAlertsList();
}

// 更新监测视图
function updateMonitoring() {
  updateSensorGrid();
  
  // 更新分析结果
  const deformationValue = document.getElementById('deformationValue');
  const stressValue = document.getElementById('stressValue');
  const stabilityScore = document.getElementById('stabilityScore');
  
  if (deformationValue) {
    deformationValue.textContent = `位移: ${generateRandomValue(1.5, 4.0, 1)}mm`;
  }
  if (stressValue) {
    stressValue.textContent = `最大应力: ${generateRandomValue(40, 50, 1)} MPa`;
  }
  if (stabilityScore) {
    stabilityScore.textContent = `评分: ${generateRandomValue(80, 95, 0)}/100`;
  }
}

// 更新控制面板
function updateControlPanels() {
  updateCylinderGrid();
}

// 更新分析图表
function updateAnalysisCharts() {
  // 重新初始化图表以显示最新数据
  setTimeout(() => {
    initializeAnalysisCharts();
    updateAnalysisSummary();
  }, 100);
}

// 刷新设备按钮功能
document.addEventListener('click', (e) => {
  if (e.target.id === 'refreshDevices' || e.target.parentElement.id === 'refreshDevices') {
    e.target.classList.add('loading');
    setTimeout(() => {
      updateDeviceList();
      e.target.classList.remove('loading');
    }, 1000);
  }
});

// 导出功能模拟
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('fa-download') || e.target.closest('.btn-icon')?.querySelector('.fa-download')) {
    alert('导出功能已触发（模拟）');
  }
});

// 清除日志功能
document.addEventListener('click', (e) => {
  if (e.target.id === 'clearLog' || e.target.parentElement.id === 'clearLog') {
    const controlLog = document.getElementById('controlLog');
    if (controlLog && confirm('确定要清除所有日志吗？')) {
      controlLog.innerHTML = '<div class="log-entry">[INFO] 日志已清除</div>';
    }
  }
});

// 生成报告功能
document.addEventListener('click', (e) => {
  if (e.target.id === 'generateReport') {
    alert('报告生成功能已触发（模拟）\n\n将包含以下内容：\n- 传感器数据统计\n- 告警分析报告\n- 系统性能评估\n- 维护建议');
  }
});

// 工具提示功能
document.addEventListener('mouseover', (e) => {
  if (e.target.classList.contains('tooltip')) {
    // 工具提示逻辑已在CSS中实现
  }
});

// 页面可见性变化处理
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // 页面隐藏时暂停更新
    Object.values(updateIntervals).forEach(interval => clearInterval(interval));
  } else {
    // 页面显示时恢复更新
    startDataUpdates();
  }
});

// 错误处理
window.addEventListener('error', (e) => {
  console.error('应用错误:', e.error);
  // 这里可以添加错误报告逻辑
});

// 资源清理
window.addEventListener('beforeunload', () => {
  Object.values(updateIntervals).forEach(interval => clearInterval(interval));
  Object.values(chartInstances).forEach(chart => {
    if (chart && typeof chart.destroy === 'function') {
      chart.destroy();
    }
  });
});