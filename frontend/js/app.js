const API_URL = 'http://localhost:8000';
let token = null;
// Elements
const authSection = document.getElementById('auth');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const themeToggle = document.getElementById('themeToggle');
// Logs
const addLogBtn = document.getElementById('addLogBtn');
const logError = document.getElementById('logError');
const totalTimeEl = document.getElementById('totalTime');
const totalProblemsEl = document.getElementById('totalProblems');
const logsList = document.getElementById('logsList');
// Goals
const addGoalBtn = document.getElementById('addGoalBtn');
const goalError = document.getElementById('goalError');
const goalsList = document.getElementById('goalsList');
// Integrations
const fetchGithubBtn = document.getElementById('fetchGithubBtn');
const fetchLeetBtn = document.getElementById('fetchLeetBtn');
const integrationOutput = document.getElementById('integrationOutput');

// Theme Toggle
function loadTheme() {
  if (localStorage.theme === 'dark') document.body.classList.add('dark-mode');
}
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
});

// Display logic
function showDashboard() {
  authSection.style.display = 'none';
  dashboard.style.display = 'block';
  logoutBtn.style.display = 'inline';
  fetchStats(); fetchLogs(); fetchGoals();
}
function showLogin() {
  authSection.style.display = 'block';
  dashboard.style.display = 'none';
  logoutBtn.style.display = 'none';
}

// Login
loginForm.addEventListener('submit', async e => {
  e.preventDefault(); loginError.textContent = '';
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const res = await fetch(`${API_URL}/token`, { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:new URLSearchParams({username,password}) });
  if (!res.ok) { loginError.textContent='Login failed'; return; }
  token = (await res.json()).access_token;
  showDashboard();
});
logoutBtn.addEventListener('click', ()=>{ token=null; showLogin(); });

// Logs
addLogBtn.addEventListener('click', async ()=>{
  logError.textContent='';
  const payload={ date:document.getElementById('logDate').value, platform:document.getElementById('logPlatform').value, topics:document.getElementById('logTopics').value, time_spent:parseFloat(document.getElementById('logTime').value), problems_solved:parseInt(document.getElementById('logProblems').value) };
  const r=await fetch(`${API_URL}/log`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},body:JSON.stringify(payload)});
  if(!r.ok) logError.textContent='Failed to add log'; else fetchStats(),fetchLogs();
});
async function fetchStats(){const r=await fetch(`${API_URL}/stats`,{headers:{'Authorization':`Bearer ${token}`}});if(r.ok){const{total_time,total_problems}=await r.json();totalTimeEl.textContent=total_time;totalProblemsEl.textContent=total_problems;}}
async function fetchLogs(){const r=await fetch(`${API_URL}/logs`,{headers:{'Authorization':`Bearer ${token}`}});if(r.ok){const logs=await r.json();logsList.innerHTML=logs.map(l=>`<li>${l.date}: ${l.platform} — ${l.problems_solved} problems in ${l.time_spent}h</li>`).join('');}}

// Goals
addGoalBtn.addEventListener('click', async ()=>{
  goalError.textContent='';
  const payload={ description:document.getElementById('goalDesc').value, target_problems:parseInt(document.getElementById('goalTarget').value), deadline:document.getElementById('goalDeadline').value };
  const r=await fetch(`${API_URL}/goal`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},body:JSON.stringify(payload)});
  if(!r.ok) goalError.textContent='Failed to add goal'; else fetchGoals();
});
async function fetchGoals(){const r=await fetch(`${API_URL}/goals`,{headers:{'Authorization':`Bearer ${token}`}});if(r.ok){const goals=await r.json();goalsList.innerHTML=goals.map(g=>`<li>${g.description} (${g.target_problems} by ${g.deadline})</li>`).join('');}}

// Integrations placeholders
fetchGithubBtn.addEventListener('click',()=>integrationOutput.textContent='GitHub integration coming soon…');
fetchLeetBtn.addEventListener('click',()=>integrationOutput.textContent='LeetCode integration coming soon…');

// Init
loadTheme();showLogin();