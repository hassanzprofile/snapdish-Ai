/* Snapdish AI - vanilla HTML/CSS/JavaScript conversion of the original React/TypeScript app. */
const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];
const D = window.SNAPDISH_DATA;

const store = {
  get(key,fallback){try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch{return fallback}},
  set(key,value){localStorage.setItem(key,JSON.stringify(value))}
};
function user(){return store.get("snapdish_user",null)}
function theme(){return store.get("snapdish_theme","dark")}
function applyTheme(){document.documentElement.dataset.theme=theme()}
function displayName(u){
 const name=(u?.name||"").trim();
 if(name)return name;
 const email=(u?.email||"").trim();
 return email?email.split("@")[0].replace(/[._-]+/g," ").replace(/\b\w/g,m=>m.toUpperCase()):"User";
}
function escapeHTML(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function toast(text){const t=$("#toast");t.textContent=text;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function navigate(path){location.hash=path.startsWith("#")?path:path; window.scrollTo(0,0)}
function currentPath(){return location.hash.replace(/^#/,"")||"/"}
function isProtected(path){return ["/home","/image-to-recipe","/generate","/saved","/bookmarks","/collections","/profile","/settings"].includes(path)}
function icon(name){return ({home:"⌂",camera:"◉",wand:"✦",bookmark:"🔖",bookmarked:"★",folder:"♡",user:"●",settings:"⚙",logout:"↪",menu:"☰",search:"⌕",bell:"●",arrow:"→",upload:"↑",chat:"✦",close:"×"})[name]||"•"}

const navItems=[
 ["/home","Home","home"],["/image-to-recipe","Image to Recipe","camera"],["/generate","Generate Recipe","wand"],
 ["/saved","Saved Recipes","bookmark"],["/bookmarks","Bookmarked Recipes","bookmarked"],["/collections","My Collections","folder"],
 ["/profile","Profile","user"],["/settings","Settings","settings"]
];

function landing(){
 return `<div class="landing">
  <nav class="landing-nav"><div class="logo">snapdish <span>AI</span></div><div><button class="btn btn-outline" onclick="navigate('/login')">Log in</button><button class="btn btn-primary" onclick="navigate('/signup')" style="margin-left:8px">Get started</button></div></nav>
  <section class="hero"><div class="feature-icon">🍳</div><h1>Your kitchen, <span>smarter.</span></h1><p>Turn food photos and simple ideas into delicious, personalized recipes with AI. Save your favorites and cook with confidence.</p><div class="hero-actions"><button class="btn btn-primary" onclick="navigate('/signup')">Start cooking ${icon("arrow")}</button><button class="btn btn-outline" onclick="navigate('/login')">I already have an account</button></div></section>
  <div class="grid feature-grid">
   <div class="feature"><div class="feature-icon">📷</div><h3>Image to Recipe</h3><p class="muted">Upload a food photo and let AI identify it and build a complete recipe.</p></div>
   <div class="feature"><div class="feature-icon">✨</div><h3>Generate Anything</h3><p class="muted">Describe what you're craving and get a recipe tailored to your cuisine, diet, and time.</p></div>
   <div class="feature"><div class="feature-icon">🔖</div><h3>Your Recipe Library</h3><p class="muted">Keep generated recipes organized and bookmark the ones you love.</p></div>
  </div>
 </div>`;
}
function auth(mode){
 const signup=mode==="signup";
 return `<div class="form-wrap"><div class="auth-card">
  <div class="logo">snapdish <span>AI</span></div>
  <h1 style="font-size:30px;margin-bottom:7px">${signup?"Create your account":"Welcome back"}</h1>
  <p class="muted" style="margin-bottom:24px">${signup?"Save recipes, build collections, and cook smarter.":"Log in to continue cooking with Snapdish AI."}</p>
  <form id="authForm">
   ${signup?`<div class="field"><label>Name</label><input id="authName" required placeholder="Your name"></div>`:""}
   <div class="field"><label>Email</label><input id="authEmail" type="email" required placeholder="you@example.com"></div>
   <div class="field"><label>Password</label><input id="authPassword" type="password" required placeholder="••••••••"></div>
   <button class="btn btn-primary full" type="submit">${signup?"Create account":"Log in"}</button>
  </form>
  <p class="muted" style="text-align:center;margin-top:20px">${signup?"Already have an account?":"Don't have an account?"} <a style="color:var(--orange);font-weight:700" href="#${signup?"/login":"/signup"}">${signup?"Log in":"Sign up"}</a></p>
  <p class="muted" style="font-size:11px;margin-top:20px;text-align:center">Demo auth: credentials are stored only in this browser.</p>
 </div></div>`;
}
function sidebar(){
 return `<aside class="sidebar" id="sidebar"><div class="logo">snapdish <span>AI</span></div><nav class="nav">${navItems.map(([p,l,i])=>`<a href="#${p}" class="${currentPath()===p?"active":""}">${icon(i)} ${l}</a>`).join("")}</nav><div class="logout"><button id="logout">${icon("logout")} &nbsp;Log Out</button></div></aside>`;
}
function appLayout(content){
 const u=user();
 const name=displayName(u);
 const email=u?.email||"";
 return `<div class="app-shell">${sidebar()}<section class="main-area"><header class="topbar"><button class="mobile-menu" id="mobileMenu">${icon("menu")}</button><input class="search" placeholder="Search for recipes, ingredients, cuisines..." id="globalSearch"><div class="top-spacer"></div><button class="user-btn" onclick="navigate('/profile')"><img class="avatar" src="${escapeHTML(u?.avatar||"")}" alt=""><span class="top-user-copy"><strong>${escapeHTML(name)}</strong><small>${escapeHTML(email)}</small></span><span class="user-chevron">⌄</span></button></header><main class="main-scroll">${content}</main></section></div>${chatWidget()}`;
}
function pageHead(title,sub){return `<div class="page-head"><h1>${title}</h1><p class="muted">${sub}</p></div>`}
function recipeCard(r,bookmarkable=false){
 const id=r.id||"";
 const active=id && isBookmarked(id);
 return `<article class="recipe-card"><img src="${escapeHTML(r.image||"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop")}" alt="${escapeHTML(r.title)}"><button class="bookmark ${active?"active":""}" data-bookmark="${escapeHTML(id)}">${active?"★":"☆"}</button><div class="recipe-info"><div class="recipe-title">${escapeHTML(r.title)}</div><div class="recipe-meta"><span>${escapeHTML(r.meta||r.cuisine||"Recipe")}</span><span>◷ ${escapeHTML(r.time||r.cookTime||"")}</span></div></div></article>`;
}
function home(){
 return `<div class="container">${pageHead("Good food starts here.","What are you cooking today? Turn a photo, craving, or a few ingredients into a recipe.")}<div class="grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:32px">
  <div class="card" onclick="navigate('/image-to-recipe')" style="cursor:pointer"><div class="feature-icon">📷</div><h3>Image to Recipe</h3><p class="muted">Have a dish photo? Upload it and get the recipe.</p></div>
  <div class="card" onclick="navigate('/generate')" style="cursor:pointer"><div class="feature-icon">✨</div><h3>Generate a Recipe</h3><p class="muted">Tell AI what you're craving and customize it.</p></div>
  <div class="card" onclick="navigate('/generate?surprise=1')" style="cursor:pointer"><div class="feature-icon">🎲</div><h3>Surprise Me</h3><p class="muted">Let AI choose something delicious for you.</p></div>
 </div><h2 class="section-title">Popular right now</h2><p class="section-sub">A few ideas to get you inspired.</p><div class="grid recipe-grid">${D.popular.map(recipeCard).join("")}</div></div>`;
}
function generatePage(){
 return `<div class="container narrow">${pageHead("Generate Recipe","Describe what you're craving and preferences — the AI will build a custom recipe.")}${!hasApiKey()?`<div class="notice">⚠ No Gemini API key configured — generation will fail until you add one on the <a href="#/settings" style="font-weight:700;text-decoration:underline">Settings page</a>.</div>`:""}<div class="card">
 <div class="field"><label>What do you want to cook?</label><textarea id="genQuery" rows="4" placeholder="e.g. a spicy chicken curry with coconut milk, or a quick dinner using eggs, spinach, and cheese"></textarea></div>
 <div class="form-row"><div class="field"><label>Cuisine</label><select id="genCuisine">${["Any","Italian","Indian","Mexican","Chinese","Thai","Mediterranean","American","Japanese"].map(x=>`<option>${x}</option>`).join("")}</select></div><div class="field"><label>Diet</label><select id="genDiet">${["None","Vegetarian","Vegan","Gluten-Free","Keto","High-Protein","Low-Carb"].map(x=>`<option>${x}</option>`).join("")}</select></div><div class="field"><label>Time</label><select id="genTime">${["Any","Under 20 mins","20–40 mins","40–60 mins","60+ mins"].map(x=>`<option>${x}</option>`).join("")}</select></div></div>
 <div id="genError" class="muted" style="color:#d33;margin-bottom:10px"></div><div style="display:flex;gap:10px"><button id="generateBtn" class="btn btn-primary" style="flex:1">✦ Generate Recipe</button><button id="surpriseBtn" class="btn btn-outline">🎲 Surprise Me</button></div></div><div id="generatedResult"></div></div>`;
}
function imagePage(){
 return `<div class="container narrow">${pageHead("Image to Recipe","Upload a food photo and let Snapdish AI identify it and create a complete recipe.")}${!hasApiKey()?`<div class="notice">⚠ Add your Gemini API key in <a href="#/settings" style="font-weight:700;text-decoration:underline">Settings</a> before analyzing a photo.</div>`:""}<div class="card"><div class="upload" id="dropzone"><div id="uploadContent"><div class="big">📷</div><h3>Upload a food photo</h3><p class="muted" style="margin:8px 0 18px">PNG, JPG or WEBP — choose a clear photo of the dish.</p><label class="btn btn-primary">Choose image<input id="imageFile" type="file" accept="image/*" hidden></label></div><img id="imagePreview" class="preview hidden"><div class="field" style="text-align:left;margin-top:18px"><label>Optional notes</label><input id="imageNotes" placeholder="e.g. Make it vegetarian, less spicy, or serves 4"></div><button id="analyzeImage" class="btn btn-primary" style="margin-top:8px">✦ Analyze & Create Recipe</button></div><div id="imageResult"></div></div></div>`;
}
function resultHTML(r,id){
 return `<div class="card recipe-result"><div style="display:flex;justify-content:space-between;gap:15px;align-items:flex-start"><div><h2>${escapeHTML(r.title)}</h2><p class="recipe-desc">${escapeHTML(r.description)}</p></div><button class="btn btn-outline" id="resultBookmark" data-id="${escapeHTML(id||"")}">☆ Bookmark</button></div><div class="recipe-stats"><span class="pill">${escapeHTML(r.cuisine)}</span><span class="pill">Prep: ${escapeHTML(r.prepTime)}</span><span class="pill">Cook: ${escapeHTML(r.cookTime)}</span><span class="pill">${escapeHTML(r.servings)}</span><span class="pill">${escapeHTML(r.difficulty)}</span><span class="pill">${escapeHTML(r.calories)}</span></div><div class="recipe-columns"><div><h3>Ingredients</h3><ul class="ingredient-list">${(r.ingredients||[]).map(x=>`<li>${escapeHTML(x)}</li>`).join("")}</ul></div><div><h3>Instructions</h3><ol class="instruction-list">${(r.instructions||[]).map(x=>`<li>${escapeHTML(x)}</li>`).join("")}</ol>${r.tips?.length?`<h3>Chef Tips</h3><ul class="ingredient-list">${r.tips.map(x=>`<li>${escapeHTML(x)}</li>`).join("")}</ul>`:""}</div></div></div>`;
}
function savedPage(bookmarks=false){
 const key=bookmarks?"snapdish_bookmarked":"snapdish_saved"; const list=store.get(key,[]);
 const seed=bookmarks?D.bookmarkedSeed:D.savedSeed;
 const title=bookmarks?"Bookmarked Recipes":"Saved Recipes"; const sub=bookmarks?"Recipes you've starred to come back to later.":"Every recipe you've generated, all in one place.";
 return `<div class="container">${pageHead(title,sub)}<div class="grid recipe-grid">${(list.length?list:seed).map(recipeCard).join("")}${!list.length?`<div class="empty-note">${bookmarks?"★ Sample recipes shown — bookmark a generated recipe to save it here.":"🔖 Sample recipes shown — generate your first recipe to replace these."}</div>`:""}</div></div>`;
}
function collections(){return `<div class="container">${pageHead("My Collections","Organize recipes into your own little food worlds.")}<div class="grid collection-grid"><div class="card collection"><div><div class="feature-icon">❤️</div><h3>Weeknight Favorites</h3><p class="muted">Quick meals for busy days.</p></div><strong>0 recipes</strong></div><div class="card collection"><div><div class="feature-icon">🌶️</div><h3>Spicy Things</h3><p class="muted">Recipes with a little extra heat.</p></div><strong>0 recipes</strong></div><div class="card collection"><div><div class="feature-icon">🥗</div><h3>Healthy & Fresh</h3><p class="muted">Light, balanced ideas.</p></div><strong>0 recipes</strong></div></div></div>`}
function profile(){const u=user()||{};const saved=store.get("snapdish_saved",[]);const bm=store.get("snapdish_bookmarked",[]);return `<div class="container small-narrow">${pageHead("Profile","Your Snapdish account.")}<div class="card" style="text-align:center"><img class="avatar" style="width:84px;height:84px;margin:auto" src="${escapeHTML(u.avatar||"")}" alt=""><h2 style="font-size:25px;margin:14px 0 4px">${escapeHTML(u.name||"User")}</h2><p class="muted">${escapeHTML(u.email||"")}</p><div class="grid" style="grid-template-columns:repeat(3,1fr);margin-top:24px"><div class="card"><h2>${saved.length}</h2><p class="muted">Saved</p></div><div class="card"><h2>${bm.length}</h2><p class="muted">Bookmarks</p></div><div class="card"><h2>0</h2><p class="muted">Collections</p></div></div></div></div>`}
function settings(){const current=theme();return `<div class="settings-shell"><div class="settings-inner">${pageHead("Settings","Manage your app preferences and account settings.")}<section class="settings-card"><div class="settings-card-title"><span class="settings-icon">⚙</span><h2>Preferences</h2></div><div class="settings-row"><div class="settings-row-icon">🌐</div><div class="settings-row-copy"><strong>Language</strong><p class="muted">Choose your preferred language</p></div><select class="settings-select"><option>English</option></select></div><div class="settings-row"><div class="settings-row-icon">◐</div><div class="settings-row-copy"><strong>Theme</strong><p class="muted">Select your preferred theme</p></div><select class="settings-select" id="themeSelect"><option value="dark" ${current==="dark"?"selected":""}>Dark</option><option value="light" ${current==="light"?"selected":""}>Light</option></select></div><div class="settings-row"><div class="settings-row-icon">🔔</div><div class="settings-row-copy"><strong>Notifications</strong><p class="muted">Receive updates and tips</p></div><button class="toggle on" data-toggle><i></i></button></div></section><section class="settings-card account-card"><div class="settings-card-title"><span class="settings-icon">♙</span><h2>Account</h2></div><div class="settings-row action-row"><div class="settings-row-icon">🔒</div><div class="settings-row-copy"><strong>Change Password</strong><p class="muted">Update your account password</p></div><span class="settings-arrow">›</span></div><div class="settings-row action-row"><div class="settings-row-icon">♲</div><div class="settings-row-copy"><strong>Clear Local Data</strong><p class="muted">Remove saved recipes, bookmarks and collections</p></div><span class="settings-arrow">›</span></div><div class="settings-row action-row logout-setting" id="settingsLogout"><div class="settings-row-icon">↪</div><div class="settings-row-copy"><strong>Log Out</strong><p class="muted">Sign out from your account</p></div><span class="settings-arrow">›</span></div></section><p class="settings-safe">🛡 Your data is safe with us. All your information is stored locally in your browser.</p></div></div>`}
function toggleRow(i,l,d,on=false,disabled=false){return `<div class="toggle-row"><div style="font-size:20px">${i}</div><div class="toggle-text"><strong>${l}</strong><p class="muted" style="font-size:12px">${d}</p></div><button class="toggle ${on?"on":""}" data-toggle ${disabled?"disabled":""}><i></i></button></div>`}
function chatWidget(){return `<div class="chat"><div class="chat-panel hidden" id="chatPanel"><div class="chat-head"><strong>Chef Bot</strong><button id="chatClose" style="background:none;border:0;color:#fff;font-size:20px">×</button></div><div class="chat-messages" id="chatMessages"><div class="msg model">Hi! I'm Chef Bot. Ask me about recipes, substitutions, cooking techniques, or meal planning.</div></div><form class="chat-form" id="chatForm"><input id="chatInput" placeholder="Ask Chef Bot..."><button>→</button></form></div><button class="chat-toggle" id="chatToggle">✦</button></div>`}

function isBookmarked(id){return !!id && store.get("snapdish_bookmarked",[]).some(r=>r.id===id)}
function saveGenerated(r){
 const entry={...r,id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,savedAt:Date.now()};
 const list=store.get("snapdish_saved",[]);store.set("snapdish_saved",[entry,...list]);return entry;
}
function toggleBookmarkById(id){
 const saved=store.get("snapdish_saved",[]);const recipe=saved.find(x=>x.id===id);if(!recipe)return;
 let list=store.get("snapdish_bookmarked",[]);
 if(list.some(x=>x.id===id))list=list.filter(x=>x.id!==id);else list=[recipe,...list];
 store.set("snapdish_bookmarked",list);render();
}
async function handleGenerate(surprise=false){
 const btn=surprise?$("#surpriseBtn"):$("#generateBtn"); if(!btn)return;btn.disabled=true;btn.textContent="Generating…";
 $("#genError").textContent="";$("#generatedResult").innerHTML="";
 try{const r=surprise?await surpriseRecipe():await recipeFromPrompt({query:$("#genQuery").value||"a delicious, well-balanced meal",cuisine:$("#genCuisine").value!=="Any"?$("#genCuisine").value:undefined,diet:$("#genDiet").value!=="None"?$("#genDiet").value:undefined,time:$("#genTime").value!=="Any"?$("#genTime").value:undefined});const entry=saveGenerated(r);$("#generatedResult").innerHTML=resultHTML(r,entry.id);$("#resultBookmark").onclick=()=>{toggleBookmarkById(entry.id);};}
 catch(e){$("#genError").textContent=e.message||"Something went wrong."} finally{btn.disabled=false;btn.textContent=surprise?"🎲 Surprise Me":"✦ Generate Recipe";}
}
function setupImage(){
 const file=$("#imageFile"),preview=$("#imagePreview");
 file?.addEventListener("change",()=>{const f=file.files[0];if(!f)return;preview.src=URL.createObjectURL(f);preview.classList.remove("hidden");$("#uploadContent").classList.add("hidden")});
 $("#analyzeImage")?.addEventListener("click",async()=>{const f=file.files[0];if(!f){toast("Choose an image first");return}const btn=$("#analyzeImage");btn.disabled=true;btn.textContent="Analyzing…";$("#imageResult").innerHTML="";try{const r=await recipeFromImage(f,$("#imageNotes").value);const entry=saveGenerated(r,f.type.startsWith("image/")?preview.src:"");$("#imageResult").innerHTML=resultHTML(r,entry.id);$("#resultBookmark").onclick=()=>toggleBookmarkById(entry.id)}catch(e){$("#imageResult").innerHTML=`<p style="color:#c33;margin-top:15px">${escapeHTML(e.message)}</p>`}finally{btn.disabled=false;btn.textContent="✦ Analyze & Create Recipe"}});
}
function setupChat(){
 $("#chatToggle")?.addEventListener("click",()=>$("#chatPanel").classList.toggle("hidden"));
 $("#chatClose")?.addEventListener("click",()=>$("#chatPanel").classList.add("hidden"));
 $("#chatForm")?.addEventListener("submit",async e=>{e.preventDefault();const input=$("#chatInput"),text=input.value.trim();if(!text)return;const box=$("#chatMessages");box.innerHTML+=`<div class="msg user">${escapeHTML(text)}</div>`;input.value="";const history=store.get("snapdish_chat",[]);history.push({role:"user",content:text});try{const answer=await chatWithAssistant(history);box.innerHTML+=`<div class="msg model">${escapeHTML(answer)}</div>`;history.push({role:"model",content:answer});store.set("snapdish_chat",history)}catch(err){box.innerHTML+=`<div class="msg model">${escapeHTML(err.message)}</div>`}box.scrollTop=box.scrollHeight});
}
function bindCommon(){
 $("#logout")?.addEventListener("click",()=>{localStorage.removeItem("snapdish_user");navigate("/login")});
 $("#mobileMenu")?.addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
 $$("[data-bookmark]").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();const id=b.dataset.bookmark;if(id)toggleBookmarkById(id);else toast("Sample recipe — generate it to bookmark.")}));

 $$("[data-toggle]").forEach(b=>b.addEventListener("click",()=>b.classList.toggle("on")));
 const themeSelect=$("#themeSelect");
 themeSelect?.addEventListener("change",()=>{store.set("snapdish_theme",themeSelect.value);applyTheme();render()});
 $("#settingsLogout")?.addEventListener("click",()=>{localStorage.removeItem("snapdish_user");navigate("/login")});
 setupChat();
}
function bindAuth(){
 $("#authForm")?.addEventListener("submit",async e=>{e.preventDefault();const mode=currentPath()==="/signup";const email=$("#authEmail").value.trim(),password=$("#authPassword").value;const name=mode?$("#authName").value.trim():email.split("@")[0].replace(/[._]/g," ");await new Promise(r=>setTimeout(r,350));store.set("snapdish_user",{name:name.charAt(0).toUpperCase()+name.slice(1),email,avatar:`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(email)}`});navigate("/home")});
}
function render(){
 let path=currentPath(); const protectedPath=isProtected(path);
 if(protectedPath&&!user()){navigate("/login");return}
 if((path==="/login"||path==="/signup")&&user()){navigate("/home");return}
 let html;
 if(path==="/")html=landing();else if(path==="/login")html=auth("login");else if(path==="/signup")html=auth("signup");
 else if(path==="/home")html=appLayout(home());else if(path==="/generate")html=appLayout(generatePage());else if(path==="/image-to-recipe")html=appLayout(imagePage());
 else if(path==="/saved")html=appLayout(savedPage(false));else if(path==="/bookmarks")html=appLayout(savedPage(true));else if(path==="/collections")html=appLayout(collections());else if(path==="/profile")html=appLayout(profile());else if(path==="/settings")html=appLayout(settings());else html=landing();
 $("#app").innerHTML=html;bindCommon();bindAuth();
 if(path==="/generate"&&new URLSearchParams(location.hash.split("?")[1]||"").get("surprise")==="1")setTimeout(()=>handleGenerate(true),100);
 if(path==="/generate"){$("#generateBtn")?.addEventListener("click",()=>handleGenerate(false));$("#surpriseBtn")?.addEventListener("click",()=>handleGenerate(true))}
 if(path==="/image-to-recipe")setupImage();
}
window.addEventListener("hashchange",render);window.addEventListener("DOMContentLoaded",()=>{applyTheme();render()});