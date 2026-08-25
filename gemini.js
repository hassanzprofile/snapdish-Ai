/* Gemini API helper. API key is stored in localStorage for this demo. */
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const GEMINI_MODEL = "gemini-3.6-flash";

//will hide API key in production, but for demo purposes we can use a default key that is rate-limited and read-only. Users can add their own key in Settings to avoid rate limits.
const DEFAULT_GEMINI_KEY = "(your own gemini API key)";

function getApiKey() {
  return localStorage.getItem("snapdish_gemini_key") || DEFAULT_GEMINI_KEY;
}
function setApiKey(key) {
  localStorage.setItem("snapdish_gemini_key", (key || "").trim());
}
function hasApiKey() { return !!getApiKey(); }

const RECIPE_INSTRUCTIONS = `Respond ONLY with raw JSON (no markdown fences, no commentary) matching exactly:
{"title":string,"description":string,"cuisine":string,"prepTime":string,"cookTime":string,"servings":string,"difficulty":"Easy"|"Medium"|"Hard","calories":string,"ingredients":string[],"instructions":string[],"tips":string[]}`;

async function callGemini(body) {
  const key = getApiKey();
  if (!key) throw new Error("No Gemini API key found. Add one on the Settings page.");
  const res = await fetch(`${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`, {
    method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Gemini request failed (${res.status}). ${await res.text()}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned an empty response.");
  return text;
}
function parseJSON(raw) {
  return JSON.parse(raw.replace(/```json/gi,"").replace(/```/g,"").trim());
}
async function recipeFromPrompt({query,cuisine,diet,time}) {
  const prompt = `You are a professional chef. Create an original, detailed recipe based on: "${query}".
${cuisine ? `Preferred cuisine: ${cuisine}.` : ""}
${diet ? `Dietary preference: ${diet}.` : ""}
${time ? `Target total time: ${time}.` : ""}
${RECIPE_INSTRUCTIONS}`;
  return parseJSON(await callGemini({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:.85}}));
}
async function recipeFromImage(file, notes="") {
  const data = await new Promise((resolve,reject)=>{
    const r=new FileReader(); r.onload=()=>resolve(r.result.split(",")[1]); r.onerror=reject; r.readAsDataURL(file);
  });
  const prompt = `You are a professional chef and food recognition expert. Identify the dish in this photo and write a complete cookable recipe.${notes ? ` User context: "${notes}".`:""}\n${RECIPE_INSTRUCTIONS}`;
  return parseJSON(await callGemini({contents:[{parts:[{text:prompt},{inline_data:{mime_type:file.type||"image/jpeg",data}}]}],generationConfig:{temperature:.6}}));
}
async function surpriseRecipe() {
  const styles=["a comforting weeknight dinner","an impressive dinner-party main","a quick 20-minute lunch","a healthy high-protein bowl","a decadent dessert","a street-food-style snack"];
  return recipeFromPrompt({query:`Surprise me with ${styles[Math.floor(Math.random()*styles.length)]} from a cuisine you don't usually get asked about.`});
}
async function chatWithAssistant(history) {
  const system={role:"model",content:"I'm Chef Bot, Snapdish AI's cooking assistant. I answer questions about recipes, ingredient substitutions, cooking techniques, nutrition, meal planning, and food safety. I keep answers practical and concise."};
  const contents=[system,...history].map(m=>({role:m.role,parts:[{text:m.content}]}));
  return callGemini({contents,generationConfig:{temperature:.7}});
}
