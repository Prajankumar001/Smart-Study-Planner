const LS_KEY = 'smartStudyPlanner.tasks';
let tasks = [];
let editingId = null;

// DOM
const taskForm = document.getElementById('taskForm');
const titleInput = document.getElementById('title');
const subjectInput = document.getElementById('subject');
const dueInput = document.getElementById('due');
const durationInput = document.getElementById('duration');
const priorityInput = document.getElementById('priority');
const notesInput = document.getElementById('notes');
const progressInput = document.getElementById('progress');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const tasksList = document.getElementById('tasksList');
const timelineScale = document.getElementById('timelineScale');

// utils
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2);}
function save(){localStorage.setItem(LS_KEY, JSON.stringify(tasks));}
function load(){tasks = JSON.parse(localStorage.getItem(LS_KEY)||'[]');}
function fmt(d){return d?new Date(d).toLocaleString():'—';}

// CRUD
function addTask(){
  const t={
    id:uid(),
    title:titleInput.value,
    subject:subjectInput.value,
    due:dueInput.value,
    duration:durationInput.value,
    priority:priorityInput.value,
    notes:notesInput.value,
    progress:progressInput.value,
    completed:false
  };
  tasks.push(t);save();render();taskForm.reset();
}
function updateTask(){
  const t=tasks.find(x=>x.id===editingId);if(!t)return;
  Object.assign(t,{
    title:titleInput.value,
    subject:subjectInput.value,
    due:dueInput.value,
    duration:durationInput.value,
    priority:priorityInput.value,
    notes:notesInput.value,
    progress:progressInput.value
  });
  save();render();editingId=null;saveBtn.textContent='➕ Add Task';taskForm.reset();
}
function deleteTask(id){tasks=tasks.filter(t=>t.id!==id);save();render();}
function toggleComplete(id){const t=tasks.find(x=>x.id===id);t.completed=!t.completed;save();render();}
function editTask(id){
  const t=tasks.find(x=>x.id===id);if(!t)return;
  editingId=id;
  titleInput.value=t.title;
  subjectInput.value=t.subject;
  dueInput.value=t.due;
  durationInput.value=t.duration;
  priorityInput.value=t.priority;
  notesInput.value=t.notes;
  progressInput.value=t.progress;
  saveBtn.textContent='💾 Update Task';
}

// render
function render(){
  tasksList.innerHTML='';
  tasks.forEach(t=>{
    const el=document.createElement('div');el.className='task';

    const checkbox=document.createElement('input');
    checkbox.type='checkbox';checkbox.checked=t.completed;
    checkbox.addEventListener('change',()=>toggleComplete(t.id));

    const main=document.createElement('div');main.className='main';
    main.innerHTML=`<div class='task-title'>${t.title}</div>
      <div class='task-meta'>${t.subject||''} • Due: ${fmt(t.due)} • ${t.duration}h</div>
      <div class='progress-bar'><i style='width:${t.progress}%'></i></div>`;

    const editBtn=document.createElement('button');
    editBtn.textContent='✏️';
    editBtn.addEventListener('click',()=>editTask(t.id));

    const delBtn=document.createElement('button');
    delBtn.textContent='🗑️';
    delBtn.addEventListener('click',()=>deleteTask(t.id));

    el.appendChild(checkbox);
    el.appendChild(main);
    el.appendChild(editBtn);
    el.appendChild(delBtn);

    tasksList.appendChild(el);
  });
  renderTimeline();
}
function renderTimeline(){
  timelineScale.innerHTML='';
  const withDue=tasks.filter(t=>t.due);
  if(withDue.length===0){timelineScale.textContent='No dated tasks';return;}
  withDue.forEach((t,i)=>{
    const div=document.createElement('div');
    div.className='t-item';
    div.style.left=(i*20)+'%';
    div.textContent=t.title;
    timelineScale.appendChild(div);
  });
}

// events
taskForm.addEventListener('submit',e=>{
  e.preventDefault();
  editingId?updateTask():addTask();
});
resetBtn.addEventListener('click',()=>{
  taskForm.reset();editingId=null;saveBtn.textContent='➕ Add Task';
});

// init
load();render();
