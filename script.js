/* ===== DANE ===== */
let exercises = JSON.parse(localStorage.getItem("exercises")) || [
  {name:"Podciągnięcia", cat:"arms", yt:"https://youtu.be/DB0dtKEGOpk"},
  {name:"Dipy", cat:"arms", yt:"https://youtube.com/shorts/CrbIq-T-h8I"},
  {name:"Pistolet", cat:"legs", yt:"https://www.youtube.com/watch?v=HjVNbH0HJwI"},
  {name:"Burpee", cat:"cardio", yt:"https://www.youtube.com/watch?v=e9V2-uCQRSo"},
  {name:"Toes to bar", cat:"mobility", yt:"https://youtube.com/shorts/9Tx0QKP1A0I"}
];

let plan = [];
let templates = JSON.parse(localStorage.getItem("templates")) || {};
let calendar = JSON.parse(localStorage.getItem("calendar")) || {};

/* ===== UI ===== */
document.querySelectorAll(".cat-btn").forEach(btn=>{
  btn.onclick=()=>btn.nextElementSibling.classList.toggle("show");
});

/* ===== RENDER ===== */
function ytThumb(url){
  if(!url) return "";
  let id = url.split("v=")[1] || url.split("/").pop();
  return `https://img.youtube.com/vi/${id}/0.jpg`;
}

function renderExercises(){
  ["arms","legs","cardio","mobility"].forEach(c=>{
    const box=document.getElementById("cat-"+c);
    box.innerHTML="";
    exercises.filter(e=>e.cat===c).forEach(e=>{
      const div=document.createElement("div");
      div.className="exercise";
      div.innerHTML=`
        <span>${e.name}</span>
        ${e.yt?`<img src="${ytThumb(e.yt)}">`:""}
        <button onclick='addToPlan("${e.name}")'>+</button>
      `;
      box.appendChild(div);
    });
  });
}

function addToPlan(name){
  plan.push({name, sets:3, reps:10, time:1, rest:0.5});
  renderPlan();
}

function renderPlan(){
  const p=document.getElementById("plan");
  p.innerHTML="";
  plan.forEach((e,i)=>{
    p.innerHTML+=`
      <div class="card">
        <b>${e.name}</b><br>
        Serie <input value="${e.sets}">
        Powt <input value="${e.reps}">
        Czas(min) <input value="${e.time}">
        Odp(min) <input value="${e.rest}">
        <button onclick="plan.splice(${i},1);renderPlan()">❌</button>
      </div>
    `;
  });
}

function addExercise(){
  exercises.push({
    name:newName.value,
    yt:newYT.value,
    cat:newCat.value
  });
  localStorage.setItem("exercises",JSON.stringify(exercises));
  renderExercises();
}

/* ===== SZABLONY ===== */
function saveTemplate(){
  templates[templateName.value]=JSON.parse(JSON.stringify(plan));
  localStorage.setItem("templates",JSON.stringify(templates));
  renderTemplates();
}

function renderTemplates(){
  const t=document.getElementById("templates");
  t.innerHTML="";
  Object.keys(templates).forEach(k=>{
    t.innerHTML+=`
      <div>
        ${k}
        <button onclick='plan=JSON.parse(JSON.stringify(templates["${k}"]));renderPlan()'>▶</button>
        <button onclick='delete templates["${k}"];localStorage.setItem("templates",JSON.stringify(templates));renderTemplates()'>❌</button>
      </div>
    `;
  });
}

/* ===== TIMER ===== */
let timer=null, timeLeft=0;
function startTimer(){
  if(!plan.length) return;
  timeLeft = plan[0].time*60;
  tick();
}
function tick(){
  if(timeLeft<=0){
    beep.play();
    return;
  }
  timeLeft-=0.1;
  document.getElementById("time").innerText=timeLeft.toFixed(1);
  timer=setTimeout(tick,100);
}
function pauseTimer(){ clearTimeout(timer); }
function resetTimer(){ clearTimeout(timer); document.getElementById("time").innerText="00:00.0"; }

/* ===== KALENDARZ ===== */
function renderCalendar(){
  const cal=document.getElementById("calendar");
  cal.innerHTML="";
  for(let i=1;i<=30;i++){
    const d=document.createElement("div");
    d.className="day";
    d.innerHTML=i;
    d.onclick=()=>{
      const name=prompt("Nazwa treningu");
      if(!name) return;
      calendar[i]=name;
      localStorage.setItem("calendar",JSON.stringify(calendar));
      renderCalendar();
    };
    if(calendar[i]){
      d.innerHTML+=`<div class="event">${calendar[i]}</div>`;
    }
    cal.appendChild(d);
  }
}

/* INIT */
renderExercises();
renderTemplates();
renderCalendar();
