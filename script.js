/***********************
 * STORAGE KEYS
 ***********************/
const LS = { EXERCISES:"tp_exercises", TEMPLATES:"tp_templates", CALENDAR:"tp_calendar" };

/***********************
 * GLOBAL STATE
 ***********************/
let exercises = JSON.parse(localStorage.getItem(LS.EXERCISES)) || [];
let templates = JSON.parse(localStorage.getItem(LS.TEMPLATES)) || [];
let plan = [];
let timerSeconds = 0;
let timerStage = 'stopped'; // exercise / rest / stopped
let currentExerciseIndex = 0;
let calendarData = JSON.parse(localStorage.getItem("calendarData")) || {};


/***********************
 * DOM
 ***********************/
const exerciseList = document.getElementById("exerciseList");
const planDiv = document.getElementById("plan");
const templateList = document.getElementById("templateList");
const calendarDiv = document.getElementById("calendar");
const monthLabel = document.getElementById("monthLabel");
const newName = document.getElementById("newName");
const newLink = document.getElementById("newLink");
const newCat = document.getElementById("newCat");
const templateName = document.getElementById("templateName");

let currentDate = new Date();

/* =========================
   TIMER
========================= */

let timeline = [];
let currentStageIndex = 0;
let timeLeft = 0;
let timerInterval = null;
let isPaused = false;

const timeEl = document.getElementById("time");
const labelEl = document.getElementById("timerLabel");
const beep = document.getElementById("beep");

/* =========================
   BUDOWANIE TIMELINE
========================= */

function buildTimeline(plan) {
  timeline = [];

  plan.forEach(ex => {
    const sets = Number(ex.sets) || 1;
    const work = Number(ex.time) || 0;
    const rest = Number(ex.rest) || 0;

    for (let s = 1; s <= sets; s++) {
      if (work > 0) {
        timeline.push({
          type: "work",
          duration: work * 60,
          label: `${ex.name} – seria ${s}`
        });
      }

      if (rest > 0) {
        timeline.push({
          type: "rest",
          duration: rest * 60,
          label: `Odpoczynek po ${ex.name}`
        });
      }
    }
  });
}

/* =========================
   START TRENINGU
========================= */

function startTraining() {
  console.log(plan);

  if (!plan || plan.length === 0) {
    alert("Brak ćwiczeń w planie");
    return;
  }

  clearInterval(timerInterval);
  isPaused = false;

  buildTimeline(plan);
  currentStageIndex = 0;

  startStage();
}

/* =========================
   START ETAPU
========================= */

function startStage() {
  clearInterval(timerInterval);

  if (currentStageIndex >= timeline.length) {
    labelEl.innerText = "Trening zakończony 💪";
    timeEl.innerText = "00:00.0";
    return;
  }

  const stage = timeline[currentStageIndex];

  if (!stage || stage.duration <= 0) {
    currentStageIndex++;
    startStage();
    return;
  }

  timeLeft = stage.duration;
  labelEl.innerText = stage.label;
  renderTime(timeLeft);

  timerInterval = setInterval(tick, 100);
}

/* =========================
   TICK
========================= */

function tick() {
  if (isPaused) return;

  timeLeft -= 0.1;

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    beep.currentTime = 0;
    beep.play();
    currentStageIndex++;
    startStage();
    return;
  }

  renderTime(timeLeft);
}

/* =========================
   FORMAT CZASU
========================= */

function renderTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const d = Math.floor((sec % 1) * 10);

  timeEl.innerText =
    `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${d}`;
}

/* =========================
   KONTROLA
========================= */

function pauseTimer() {
  isPaused = !isPaused;
}

function skipStage() {
  clearInterval(timerInterval);
  beep.currentTime = 0;
  beep.play();
  currentStageIndex++;
  startStage();
}

function resetTimer() {
  clearInterval(timerInterval);
  timeline = [];
  currentStageIndex = 0;
  timeLeft = 0;
  isPaused = false;

  labelEl.innerText = "Timer";
  timeEl.innerText = "00:00.0";
}


/***********************
 * INIT DEFAULT EXERCISES
 ***********************/
if(exercises.length===0){
  exercises = [
    {name:"Podciągnięcia na drążku", cat:"Na ręce", yt:"https://youtu.be/DB0dtKEGOpk"},
    {name:"Dipy", cat:"Na ręce", yt:"https://youtube.com/shorts/CrbIq-T-h8I"},
    {name:"Ring reverse flys", cat:"Na ręce", yt:"https://youtube.com/shorts/A6G6g-Qhal8"},
    {name:"Ring fallout", cat:"Na ręce", yt:"https://youtube.com/shorts/naNaNzjCsRg"},
    {name:"One Arm Kettlebell Snatch", cat:"Na ręce", yt:"https://youtu.be/6l2Iu26oWW8"},
    {name:"Pistolet", cat:"Na nogi", yt:"https://www.youtube.com/watch?v=HjVNbH0HJwI"},
    {name:"Przysiad wyskok", cat:"Na nogi", yt:"https://www.youtube.com/watch?v=_vZYz8YXNCk"},
    {name:"Single arm swing", cat:"Na nogi", yt:"https://youtube.com/shorts/ZeNBDDdzlvc"},
    {name:"Wskok na skrzynię", cat:"Na nogi", yt:"https://www.youtube.com/watch?v=N7BKcgM11iw"},
    {name:"Przysiad z hantlem", cat:"Na nogi", yt:"https://youtube.com/shorts/9HwZm0cTzyI"},
    {name:"Burpee / Pompka wyskok", cat:"Cardio", yt:"https://www.youtube.com/watch?v=e9V2-uCQRSo"},
    {name:"Mountain Climber", cat:"Cardio", yt:"https://www.youtube.com/watch?v=KI3wEJueuhI"},
    {name:"Kajak", cat:"Cardio", yt:""},
    {name:"Rowerek", cat:"Cardio", yt:""},
    {name:"Toes to bar (bok)", cat:"Mobilnościowe", yt:""},
    {name:"Toes to bar", cat:"Mobilnościowe", yt:"https://youtube.com/shorts/9Tx0QKP1A0I"},
    {name:"Skok w dal", cat:"Mobilnościowe", yt:"https://www.youtube.com/watch?v=t8LeZ5CzvtE"},
    {name:"Gąsienica", cat:"Mobilnościowe", yt:"https://www.youtube.com/watch?v=V3eQlnFt1pQ"},
    {name:"Back extension", cat:"Mobilnościowe", yt:"https://www.youtube.com/watch?v=k0o-bp7kM1s"}
  ];
  localStorage.setItem(LS.EXERCISES, JSON.stringify(exercises));
}


/***********************
 * PLAN
 ***********************/
function renderPlan() {
  planDiv.innerHTML = "";

  plan.forEach((p, i) => {
    const d = document.createElement("div");
    d.className = "plan-item";

    const thumb = p.yt
      ? `<iframe width="120" height="68"
          src="https://www.youtube.com/embed/${extractYTId(p.yt)}"
          frameborder="0" allowfullscreen></iframe>`
      : "";

    d.innerHTML = `
      ${thumb}
      <b>${p.name}</b>

      <div>
        Serie
        <input type="number" min="1"
          value="${p.sets ?? 1}"
          onchange="plan[${i}].sets = Number(this.value)">

        Powt
        <input type="number" min="1"
          value="${p.reps ?? 0}"
          onchange="plan[${i}].reps = Number(this.value)">

        Czas (min)
        <input type="number" step="0.1" min="0"
          value="${p.time ?? 0}"
          onchange="plan[${i}].time = Number(this.value)">

        Odp (sek)
        <input type="number" min="0"
          value="${(p.rest ?? 0) * 60}"
          onchange="plan[${i}].rest = Number(this.value) / 60">

        <button onclick="plan.splice(${i},1);renderPlan()">❌</button>
      </div>
    `;

    planDiv.appendChild(d);
  });
}



function extractYTId(url){
  const match=url.match(/(?:v=|\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match?match[1]:"";
}

/***********************
 * TEMPLATES
 ***********************/
function saveTemplate(){
  if(!templateName.value)return;
  templates.push({name:templateName.value, plan:JSON.parse(JSON.stringify(plan))});
  templateName.value="";
  saveTemplates();
  renderTemplates();
}

function renderTemplates(){
  templateList.innerHTML="";
  templates.forEach((t,i)=>{
    const d=document.createElement("div");
    d.innerHTML=`${t.name}
      <button onclick="plan=JSON.parse(JSON.stringify(templates[${i}].plan));renderPlan()">▶</button>
      <button onclick="templates.splice(${i},1);saveTemplates();renderTemplates()">❌</button>`;
    templateList.appendChild(d);
  });
}

/***********************
 KALENDARZ
 ***********************/
function saveTrainingToDate(dateStr) {
  if (plan.length === 0) {
    alert("Brak ćwiczeń w planie");
    return;
  }

  const name = prompt("Nazwa treningu:");
  if (!name) return;

  calendarData[dateStr] = {
    name,
    plan: JSON.parse(JSON.stringify(plan))
  };
/***********************
 wczytywanie i zapisywanie kalendarza

***********************/
  localStorage.setItem("calendarData", JSON.stringify(calendarData));
  renderCalendar();
}
function loadTrainingFromDate(dateStr) {
  const entry = calendarData[dateStr];
  if (!entry) return;

  if (!confirm(`Wczytać trening: "${entry.name}"?`)) return;

  plan = JSON.parse(JSON.stringify(entry.plan));
  renderPlan();
}
/***********************
 usuwanie i zapisywanie treningu z kalendarza

***********************/
function deleteTrainingFromDate(dateStr) {
  const entry = calendarData[dateStr];
  if (!entry) return;

  if (!confirm(`Usunąć trening "${entry.name}"?`)) return;

  delete calendarData[dateStr];
  localStorage.setItem("calendarData", JSON.stringify(calendarData));
  renderCalendar();
}

function renderCalendar() {
  const cal = document.getElementById("calendar");
  if (!cal) return;

  cal.innerHTML = "";

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);

  const startDay = (firstDay.getDay() + 6) % 7; // pon=0
  const daysInMonth = lastDay.getDate();

  const header = document.createElement("div");
  header.className = "calendar-header";
  header.innerHTML = `
    <button onclick="prevMonth()">◀</button>
    <span>${currentYear} – ${currentMonth + 1}</span>
    <button onclick="nextMonth()">▶</button>
  `;
  cal.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "calendar-grid";

  ["Pn","Wt","Śr","Cz","Pt","Sb","Nd"].forEach(d => {
    const h = document.createElement("div");
    h.className = "calendar-day header";
    h.textContent = d;
    grid.appendChild(h);
  });

  for (let i = 0; i < startDay; i++) {
    grid.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr =
      `${currentYear}-${String(currentMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

    const cell = document.createElement("div");
    cell.className = "calendar-day";
    cell.innerHTML = `<b>${day}</b>`;

    if (calendarData[dateStr]) {
      cell.innerHTML += `<div class="cal-training">${calendarData[dateStr].name}</div>`;
      cell.onclick = () => loadTrainingFromDate(dateStr);
    } else {
      cell.onclick = () => saveTrainingToDate(dateStr);
    }

    grid.appendChild(cell);
  }

  cal.appendChild(grid);
}



function addToPlan(exercise) {
  plan.push({
    name: exercise.name,
    sets: 1,
    time: 0.5,
    rest: 0.5,
    reps: 0,
    yt: exercise.yt || ""
  });

  renderPlan();
}

/***********************
 * SAVE FUNCTIONS
 ***********************/
function saveExercises(){localStorage.setItem(LS.EXERCISES,JSON.stringify(exercises))}
function saveTemplates(){localStorage.setItem(LS.TEMPLATES,JSON.stringify(templates))}
function saveCalendar(){localStorage.setItem(LS.CALENDAR,JSON.stringify(calendarData))}
function saveExercises() {
  localStorage.setItem("exercises", JSON.stringify(exercises));
}


/***********************
 * RENDER
 ***********************/
function renderAll(){renderExercises(); renderPlan(); renderTemplates(); renderCalendar()}

/***********************
 * EXERCISES
 ***********************/
function renderExercises(){
  exerciseList.innerHTML="";
  const categories=["Na ręce","Na nogi","Cardio","Mobilnościowe"];
  categories.forEach(cat=>{
    const details=document.createElement("details");
    details.open=true;
    const summary=document.createElement("summary");
    summary.textContent=cat;
    details.appendChild(summary);
    exercises.filter(e=>e.cat===cat).forEach((e,i)=>{
      const div=document.createElement("div");
      div.className="exercise";
      div.innerHTML=`<strong>${e.name}</strong> ${e.yt?`<a href="${e.yt}" target="_blank">🎥</a>`:""} 
        <button onclick="editExercise(${i})">✏️</button>`;
      div.onclick=(ev)=>{if(ev.target.tagName!=="BUTTON") addToPlan(e);};
      details.appendChild(div);
    });
    exerciseList.appendChild(details);
  });
}

function addExercise(){
  const name=newName.value.trim();
  if(!name)return;
  exercises.push({name,yt:newLink.value.trim(),cat:newCat.value});
  newName.value=""; newLink.value="";
  saveExercises();
  renderExercises();
}

function deleteExercise(index){
  exercises.splice(index,1);
  saveExercises();
  renderExercises();
}
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
}
/***********************
   EDIT EXERCISE
 ***********************/
function editExercise(index) {
  const ex = exercises[index];

  const newName = prompt("Nowa nazwa ćwiczenia:", ex.name);
  if (!newName) return;

  const newYT = prompt("Link do YouTube (opcjonalnie):", ex.yt || "");

  ex.name = newName;
  ex.yt = newYT;

  if (confirm("Czy chcesz usunąć to ćwiczenie?")) {
    if (confirm("Na pewno usunąć ćwiczenie?")) {
      exercises.splice(index, 1);
    }
  }

  saveExercises();
  renderExercises();
}

/***********************
 * INITIAL RENDER
 ***********************/
renderAll();
