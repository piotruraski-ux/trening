/***********************
 * STORAGE KEYS
 ***********************/
const LS = { EXERCISES:"tp_exercises", TEMPLATES:"tp_templates", CALENDAR:"tp_calendar" };

/***********************
 * GLOBAL STATE
 ***********************/
let exercises = JSON.parse(localStorage.getItem(LS.EXERCISES)) || [];
let templates = JSON.parse(localStorage.getItem(LS.TEMPLATES)) || [];
let calendarData = JSON.parse(localStorage.getItem(LS.CALENDAR)) || [];
let plan = [];
let timerInterval = null;
let timerSeconds = 0;
let timerStage = 'stopped'; // exercise / rest / stopped
let currentExerciseIndex = 0;
let currentStageIndex = 0;
let timeLeft = 0;
let isPaused = false;

/***********************
 * DOM
 ***********************/
const exerciseList = document.getElementById("exerciseList");
const planDiv = document.getElementById("plan");
const templateList = document.getElementById("templateList");
const calendarDiv = document.getElementById("calendar");
const monthLabel = document.getElementById("monthLabel");
const beep = document.getElementById("beep");
const newName = document.getElementById("newName");
const newLink = document.getElementById("newLink");
const newCat = document.getElementById("newCat");
const templateName = document.getElementById("templateName");

let currentDate = new Date();

/* =========================
   TIMER – LOGIKA ETAPOWA
========================= */

let timeline = [];

const timeEl = document.getElementById("time");
const labelEl = document.getElementById("timerLabel");

/* =========================
   BUDOWANIE TIMELINE
========================= */
/*
  plan = [
    {
      name: "Przysiady",
      sets: 3,
      time: 1,      // minuty
      rest: 0.5     // minuty
    }
  ]
*/

function buildTimeline(plan) {
  timeline = [];

  plan.forEach(ex => {
  const sets = Number(ex.sets) || 1;
    for (let s = 1; s <= sets; s++) {
        timeline.push({
          type: "work",
          duration: Number(ex.time) * 60,
          label: `${ex.name} – seria ${s}`
        });
  
        timeline.push({
          type: "rest",
          duration: Number(ex.rest) * 60,
          label: `Odpoczynek po ${ex.name}`
        });
      }
    });
  }


/* =========================
   START TRENINGU
========================= */

function startTraining() {
  if (!plan || plan.length === 0) {
    alert("Brak ćwiczeń w planie");
    return;
  }

  clearInterval(timerInterval);
  buildTimeline(plan);

  currentStageIndex = 0;
  startStage();
}

/* =========================
   START ETAPU
========================= */

function startStage() {
  if (currentStageIndex >= timeline.length) {
    labelEl.innerText = "Trening zakończony 💪";
    timeEl.innerText = "00:00.0";
    clearInterval(timerInterval);
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
  tick();
}



/* =========================
   TICK (0.1s)
========================= */

function tick() {
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (isPaused) return;

    timeLeft -= 0.1;

    if (timeLeft <= 0) {
      beep.play();
      clearInterval(timerInterval);
      currentStageIndex++;
      startStage();
      return;
    }

    renderTime(timeLeft);
  }, 100);
}

/* =========================
   FORMAT CZASU
========================= */

function renderTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const d = Math.floor((seconds % 1) * 10);

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
 * SAVE FUNCTIONS
 ***********************/
function saveExercises(){localStorage.setItem(LS.EXERCISES,JSON.stringify(exercises))}
function saveTemplates(){localStorage.setItem(LS.TEMPLATES,JSON.stringify(templates))}
function saveCalendar(){localStorage.setItem(LS.CALENDAR,JSON.stringify(calendarData))}

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
        <button onclick="deleteExercise(${i})">❌</button>`;
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

/***********************
 * PLAN
 ***********************/
function addToPlan(e){
  plan.push({...e, series:3, reps:10, time:1, rest:30});
  renderPlan();
}

function renderPlan(){
  planDiv.innerHTML="";
  plan.forEach((p,i)=>{
    const d=document.createElement("div");
    d.className="plan-item";
    const thumb = p.yt?`<iframe width="120" height="68" src="https://www.youtube.com/embed/${extractYTId(p.yt)}" frameborder="0" allowfullscreen></iframe>`:"";
    d.innerHTML=`${thumb}<b>${p.name}</b>
      <div>
      Serie <input type="number" value="${p.series}" onchange="plan[${i}].series=this.value">
      Powt <input type="number" value="${p.reps}" onchange="plan[${i}].reps=this.value">
      Czas (min) <input type="number" step="0.1" value="${p.time}" onchange="plan[${i}].time=this.value">
      Odp (s) <input type="number" value="${p.rest}" onchange="plan[${i}].rest=this.value">
      <button onclick="plan.splice(${i},1);renderPlan()">❌</button>
      </div>`;
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
 * TIMER
 ***********************/
function startTimer(){
  if(plan.length===0) return;
  currentExerciseIndex=0;
  timerStage='exercise';
  timerSeconds=plan[0].time*60;
  runTimer();
}

function runTimer(){
  clearInterval(timerInterval);
  timerInterval=setInterval(()=>{
    if(timerSeconds<=0){
      beep.play();
      if(timerStage==='exercise'){
        timerStage='rest';
        timerSeconds=plan[currentExerciseIndex].rest;
      }else{
        currentExerciseIndex++;
        if(currentExerciseIndex>=plan.length){clearInterval(timerInterval);timerStage='stopped';updateTimer();return;}
        timerStage='exercise';
        timerSeconds=plan[currentExerciseIndex].time*60;
      }
    }
    updateTimer();
    timerSeconds-=0.1;
  },100);
}

function updateTimer(){
  const m=Math.floor(timerSeconds/60);
  const s=Math.floor(timerSeconds%60);
  document.getElementById("time").textContent=`${m}:${String(s).padStart(2,"0")}`;
}

function pauseTimer(){clearInterval(timerInterval);}
function resetTimer(){pauseTimer(); document.getElementById("time").textContent="00:00"; timerStage='stopped';}
function skipTimer(){beep.play();currentExerciseIndex++; if(currentExerciseIndex>=plan.length){resetTimer(); return;} timerStage='exercise'; timerSeconds=plan[currentExerciseIndex].time*60; updateTimer();}

/***********************
 * CALENDAR
 ***********************/
function renderCalendar(){
  calendarDiv.innerHTML="";
  const year=currentDate.getFullYear();
  const month=currentDate.getMonth();
  monthLabel.textContent=currentDate.toLocaleDateString("pl-PL",{month:"long",year:"numeric"});
  const firstDay=new Date(year,month,1).getDay()||7;
  const daysInMonth=new Date(year,month+1,0).getDate();

  for(let i=1;i<firstDay;i++){calendarDiv.appendChild(document.createElement("div"));}

  for(let d=1;d<=daysInMonth;d++){
    const cell=document.createElement("div");
    cell.className="day";
    cell.innerHTML=`<span>${d}</span>`;
    const key=`${year}-${month}-${d}`;
    if(!calendarData[key]) calendarData[key]=[];
    calendarData[key].forEach((ev,idx)=>{
      const e=document.createElement("div");
      e.className="event";
      e.textContent=ev.name;
      e.onclick=(evclick)=>{evclick.stopPropagation(); editEvent(key,idx);};
      cell.appendChild(e);
    });
    cell.onclick=()=>{
      const name=prompt("Nazwa treningu:");
      if(!name)return;
      calendarData[key].push({name,plan:JSON.parse(JSON.stringify(plan))});
      saveCalendar();
      renderCalendar();
    };
    calendarDiv.appendChild(cell);
  }
}

function editEvent(key,idx){
  const action=prompt("Edytuj: wpisz nową nazwę lub wpisz DELETE aby usunąć");
  if(action===null)return;
  if(action.toUpperCase()==="DELETE"){
    calendarData[key].splice(idx,1);
  }else{
    calendarData[key][idx].name=action;
  }
  saveCalendar();
  renderCalendar();
}

function prevMonth(){currentDate.setMonth(currentDate.getMonth()-1); renderCalendar();}
function nextMonth(){currentDate.setMonth(currentDate.getMonth()+1); renderCalendar();}

/***********************
 * INITIAL RENDER
 ***********************/
renderAll();
