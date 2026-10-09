// timer.js
document.addEventListener('DOMContentLoaded', () => {
  const presetSelect = document.getElementById('timer-preset');
  const loadPresetBtn = document.getElementById('load-preset-btn');
  
  const currentStepEl = document.getElementById('timer-current-step');
  const nextStepEl = document.getElementById('timer-next-step');
  const displayEl = document.getElementById('timer-display');
  
  const btnStart = document.getElementById('timer-start');
  const btnPause = document.getElementById('timer-pause');
  const btnSkip = document.getElementById('timer-skip');
  const btnReset = document.getElementById('timer-reset');
  const audioToggle = document.getElementById('timer-audio');

  if (!presetSelect) return;

  const routines = window.store.get('routines').filter(r => r.status === 'published');
  
  let activeRoutine = null;
  let currentStepIndex = 0;
  let remainingSeconds = 0;
  let timerInterval = null;
  let endTime = null;

  // Audio Context (created on first interaction)
  let audioCtx = null;

  function beep() {
    if (!audioToggle.checked) return;
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  }

  function initPresets() {
    presetSelect.innerHTML = '<option value="">Select a preset routine...</option>' + 
      routines.map(r => `<option value="${r.id}">${r.name} (${formatTime(r.steps.reduce((a,b)=>a+b.seconds,0))})</option>`).join('');
  }

  function loadRoutine(routine) {
    pauseTimer();
    activeRoutine = routine;
    currentStepIndex = 0;
    updateStepUI();
  }

  function updateStepUI() {
    if (!activeRoutine || activeRoutine.steps.length === 0) {
      currentStepEl.textContent = 'Ready';
      nextStepEl.textContent = 'Next: --';
      displayEl.textContent = '00:00';
      return;
    }

    if (currentStepIndex >= activeRoutine.steps.length) {
      currentStepEl.textContent = 'Routine Complete!';
      nextStepEl.textContent = 'Great job.';
      displayEl.textContent = '00:00';
      beep();
      return;
    }

    const step = activeRoutine.steps[currentStepIndex];
    const nextStep = activeRoutine.steps[currentStepIndex + 1];

    currentStepEl.textContent = `Rolling: ${step.area}`;
    nextStepEl.textContent = nextStep ? `Next: ${nextStep.area}` : 'Next: Finish';
    
    remainingSeconds = step.seconds;
    renderTime();
    
    // Announce to screen readers
    displayEl.setAttribute('aria-label', `Timer for ${step.area}. ${formatTime(remainingSeconds)} remaining.`);
  }

  function renderTime() {
    displayEl.textContent = formatTime(remainingSeconds);
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function startTimer() {
    if (!activeRoutine || currentStepIndex >= activeRoutine.steps.length) return;
    
    btnStart.style.display = 'none';
    btnPause.style.display = 'inline-flex';
    
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    endTime = Date.now() + (remainingSeconds * 1000);
    
    timerInterval = setInterval(() => {
      const now = Date.now();
      const left = Math.ceil((endTime - now) / 1000);
      
      if (left <= 0) {
        // Step complete
        beep();
        currentStepIndex++;
        updateStepUI();
        if (currentStepIndex < activeRoutine.steps.length) {
          endTime = Date.now() + (remainingSeconds * 1000); // auto start next
        } else {
          pauseTimer(); // actually stops it
        }
      } else {
        remainingSeconds = left;
        renderTime();
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(timerInterval);
    btnStart.style.display = 'inline-flex';
    btnPause.style.display = 'none';
  }

  function skipStep() {
    if (!activeRoutine) return;
    pauseTimer();
    currentStepIndex++;
    updateStepUI();
  }

  function resetTimer() {
    if (!activeRoutine) return;
    pauseTimer();
    currentStepIndex = 0;
    updateStepUI();
  }

  // Events
  loadPresetBtn.addEventListener('click', () => {
    const id = presetSelect.value;
    const r = routines.find(x => x.id === id);
    if (r) loadRoutine(r);
  });

  btnStart.addEventListener('click', startTimer);
  btnPause.addEventListener('click', pauseTimer);
  btnSkip.addEventListener('click', skipStep);
  btnReset.addEventListener('click', resetTimer);

  document.addEventListener('routine-loaded', () => {
    const custom = JSON.parse(localStorage.getItem('rollora_active_routine'));
    if (custom) {
      loadRoutine(custom);
      localStorage.removeItem('rollora_active_routine');
      presetSelect.value = '';
    }
  });

  initPresets();
});
