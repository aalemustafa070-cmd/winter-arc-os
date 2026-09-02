import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app=express();
app.use(express.json({limit:"2mb"}));
app.use(express.static("."));
const PORT=process.env.PORT||3000;
const MODEL=process.env.OPENAI_MODEL||"gpt-5.6-luna";
const AI_HYBRID = {
  provider: "openai",
  model: MODEL,
  mode: process.env.OPENAI_API_KEY ? "ai+free-fallback" : "free-offline",
};

function classifyAIError(err) {
  const msg = String(err?.message || err || "");
  const lower = msg.toLowerCase();
  if (lower.includes("openai_api_key is missing")) return "missing_key";
  if (lower.includes("429") || lower.includes("quota") || lower.includes("rate limit") ||
      lower.includes("insufficient_quota") || lower.includes("billing")) return "quota";
  if (lower.includes("401") || lower.includes("invalid api key") || lower.includes("authentication")) return "auth";
  if (lower.includes("403") || lower.includes("permission")) return "permission";
  if (lower.includes("fetch failed") || lower.includes("network") || lower.includes("timeout") ||
      lower.includes("econn") || lower.includes("etimedout")) return "network";
  return "api_error";
}

function sendAIError(res, err) {
  const code = classifyAIError(err);
  const status = code === "quota" || code === "rate_limit" ? 429 : 500;
  res.status(status).json({
    error: String(err?.message || err),
    aiAvailable: false,
    hybridMode: "free-fallback",
    reason: code
  });
}


async function webResearch(query){
  const url="https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="+encodeURIComponent(query)+"&format=json&origin=*";
  const r=await fetch(url); if(!r.ok) throw new Error("Research source unavailable");
  const j=await r.json(); const pages=(j.query?.search||[]).slice(0,5); const docs=[];
  for(const p of pages){
    const u="https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&pageids="+p.pageid+"&format=json&origin=*";
    const rr=await fetch(u); if(!rr.ok) continue; const x=await rr.json(); const page=x.query?.pages?.[String(p.pageid)];
    if(page?.extract) docs.push({title:page.title,text:page.extract.slice(0,6000),url:"https://en.wikipedia.org/wiki/"+encodeURIComponent(page.title.replaceAll(" ","_"))});
  } return docs;
}
async function aiJSON(prompt){
  if(!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is missing on the server.");
  const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+process.env.OPENAI_API_KEY},body:JSON.stringify({model:MODEL,input:prompt,text:{format:{type:"json_object"}}})});
  const data=await response.json(); if(!response.ok) throw new Error(data.error?.message||"OpenAI request failed.");
  if(!data.output_text) throw new Error("AI returned no text."); return JSON.parse(data.output_text);
}

app.get("/api/ai-status", (req,res)=>{
  res.json({
    ok:true,
    version:"3.9",
    aiAvailable:Boolean(process.env.OPENAI_API_KEY),
    hybridMode:process.env.OPENAI_API_KEY ? "ai+free-fallback" : "free-offline",
    model:MODEL,
    message:process.env.OPENAI_API_KEY
      ? "AI enabled. Free offline fallback remains available."
      : "No AI key configured. Free offline mode is active."
  });
});

app.post("/api/generate-quiz",async(req,res)=>{try{
  const {topic,goal,difficulty="Medium",count=8}=req.body||{}; if(!topic)return res.status(400).json({error:"Topic is required."});
  const sources=await webResearch(topic); if(!sources.length)return res.status(404).json({error:"No research sources found for this topic."});
  const sourceText=sources.map((s,i)=>`SOURCE ${i+1}: ${s.title}\n${s.text}\nURL: ${s.url}`).join("\n\n");
  const prompt=`Create a rigorous study-verification multiple-choice quiz.\nTopic: ${topic}\nGoal: ${goal||topic}\nDifficulty: ${difficulty}\nQuestions: ${Math.min(Math.max(Number(count)||8,4),12)}\nUse ONLY the supplied research text for factual claims. Do not invent facts. Test understanding, application and misconception-checking where supported. Exactly 4 options, one correct answer, concise explanation. Return JSON only: {"topic":"...","questions":[{"question":"...","options":["...","...","...","..."],"answer":0,"explanation":"...","source":0}],"sources":[{"title":"...","url":"..."}]}\nanswer is zero-based. source is zero-based.\n\nRESEARCH:\n${sourceText}`;
  const quiz=await aiJSON(prompt); quiz.sources=sources.map(s=>({title:s.title,url:s.url})); res.json(quiz);
}catch(e){console.error(e);res.status(500).json({error:e.message||"Unknown server error"});}});

app.post("/api/generate-tasks",async(req,res)=>{try{
  const {goal,topic,difficulty="Medium",minutes=60}=req.body||{}; if(!goal||!topic)return res.status(400).json({error:"Goal and topic are required."});
  const prompt=`Break this personal learning goal into 6-8 concrete, sequential, actionable study tasks.\nGoal: ${goal}\nTopic: ${topic}\nDifficulty: ${difficulty}\nPlanned minutes: ${minutes}\nTasks must be doable by one person, specific, measurable, and collectively lead toward the goal. Include active recall/application and a final verification task. Do not claim that completing a task proves real-world study outside the app. Return JSON only: {"tasks":[{"name":"...","text":"...","minutes":10,"type":"learn|practice|recall|apply|verify|review"}]}`;
  const data=await aiJSON(prompt); res.json({tasks:Array.isArray(data.tasks)?data.tasks.slice(0,8):[]});
}catch(e){console.error(e);res.status(500).json({error:e.message||"Task generation failed"});}});

app.post("/api/analyze-mistakes",async(req,res)=>{try{
  const {topic,goal,wrongAnswers=[]}=req.body||{}; if(!topic)return res.status(400).json({error:"Topic is required."});
  const prompt=`Analyze these quiz mistakes for a learner. Topic: ${topic}\nGoal: ${goal||topic}\nMistakes (JSON): ${JSON.stringify(wrongAnswers.slice(-12))}\nIdentify the underlying concepts likely misunderstood, distinguish careless/selection errors from conceptual gaps when evidence allows, and recommend a focused retest plan. Do not invent facts not present in the supplied mistake explanations/questions. Return JSON only: {"summary":"...","weakConcepts":[{"concept":"...","reason":"...","priority":"High|Medium|Low"}],"retestFocus":["..."],"nextAction":"..."}`;
  res.json(await aiJSON(prompt));
}catch(e){console.error(e);res.status(500).json({error:e.message||"Mistake analysis failed"});}});

app.post("/api/coach-plan",async(req,res)=>{try{
  const {targets=[],sessions=[],quizzes=[],wrong=[],tasks=[],today=""}=req.body||{};
  const snapshot={targets:targets.slice(-8),sessions:sessions.slice(-20),quizzes:quizzes.slice(-12),wrong:wrong.slice(-12),tasks:tasks.slice(-20),today};
  const prompt=`You are the personal learning coach inside Winter Arc OS. Create a realistic plan for TODAY using ONLY the learner data below. Prioritize weak topics and unfinished target tasks. Do not invent achievements or facts. Study-time verification is only timer evidence. Return JSON only: {"summary":"...","priorityTopic":"...","plan":[{"title":"...","action":"...","minutes":10,"reason":"...","type":"study|recall|practice|retest|review"}],"coachNote":"..."}. Keep 3-6 plan items, total planned minutes <= 120 unless the data clearly supports more.
LEARNER DATA:
${JSON.stringify(snapshot)}`;
  res.json(await aiJSON(prompt));
}catch(e){console.error(e);res.status(500).json({error:e.message||"Coach plan failed"});}});

app.listen(PORT,()=>console.log(`Winter Arc OS V3.9 running at http://localhost:${PORT}`));
