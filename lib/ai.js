const OPENROUTER_ENDPOINT = process.env.OPENROUTER_ENDPOINT || 'https://api.openrouter.ai/v1/chat/completions'
const MODEL = process.env.OPENROUTER_MODEL || process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
const KEY = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY

function getGradeBand(grade){
  const level = Number.parseInt(grade, 10)
  if(Number.isNaN(level)) return 'middle'
  if(level <= 3) return 'early'
  if(level <= 6) return 'middle'
  if(level <= 9) return 'upper'
  return 'advanced'
}

function buildMockSummary(topic, grade){
  const band = getGradeBand(grade)
  if(band === 'early'){
    return `${topic} is an amazing process that helps plants make their own food from sunlight! Plants are very special living things because they don't need to eat other organisms like animals do. Instead, they use three simple ingredients to create their own food energy: sunlight from the sun, water from the soil through their roots, and carbon dioxide from the air. This food helps them grow bigger and stronger, make beautiful green leaves, and create colorful flowers and yummy fruits. The green color in leaves called chlorophyll is what catches the sunlight and captures its energy for the plant to use. When plants use sunlight to make food through this amazing process, they also release fresh oxygen into the air, which is what we and all animals breathe every moment! This is why plants are so incredibly important to all life on Earth. Without plants doing photosynthesis every single day, there would be no oxygen for us to breathe, and we would have no food to eat because almost all food chains start with plants. Every time you eat an apple, orange, carrot, or any vegetable, you are eating food that a plant created using this wonderful process! Plants also provide us with wood, cotton, paper, and many other things we use in our daily lives. The beautiful green color on our planet is from all these amazing plants doing photosynthesis together, creating the world we call home. Scientists have discovered that photosynthesis is one of the most important processes in nature and without it, humans and most animals would not survive on Earth.`
  }
  if(band === 'middle'){
    return `${topic} is the fundamental process by which plants convert light energy from the sun into chemical energy stored in glucose molecules. This critical biological process occurs primarily in the leaves of green plants, where chlorophyll molecules absorb photons of light energy. During ${topic}, plants take in water through their root systems and carbon dioxide from the air through tiny pores in the leaves called stomata. Through a series of complex chemical reactions occurring inside the chloroplasts, these raw materials are transformed into glucose sugar, which serves as fuel for plant growth and metabolism. The energy from sunlight is stored inside these sugar molecules through chemical bonds. Simultaneously, oxygen gas is produced as a byproduct of these reactions and released back into the atmosphere through the stomata. This oxygen is used by most living organisms, including humans, for respiration and survival. The process is essential not only for plant survival and growth, but also for maintaining oxygen levels in our atmosphere that sustain most life forms on Earth. Without this process, life as we know it would not be possible, as plants form the base of nearly all food chains and food webs. Plants produce sugars that animals eat, and they produce oxygen that animals breathe. Additionally, prehistoric photosynthesis by ancient organisms is responsible for the fossil fuels we use today like coal, oil, and natural gas, making photosynthesis indirectly responsible for most of our planet's energy resources. Understanding photosynthesis is crucial for developing new agricultural techniques and sustainable energy sources for our growing population.`
  }
  if(band === 'upper'){
    return `${topic} is a critical metabolic pathway that converts photonic energy into chemical potential energy stored in ATP and NADPH, which subsequently drive the synthesis of glucose through the Calvin cycle. The process occurs in two main stages: the light-dependent reactions embedded in the thylakoid membranes and the light-independent reactions in the stroma. During the light reactions, photosystem II absorbs photons, leading to water photolysis at the oxygen-evolving complex, generating electrons, protons, and molecular oxygen. These high-energy electrons traverse the electron transport chain through plastoquinone complexes and cytochrome b6f, driving proton translocation across the thylakoid membrane into the lumen. This establishes a significant proton gradient that drives chemiosmotic ATP synthesis via ATP synthase. Concurrently, electrons are transferred through plastocyanin to photosystem I, where additional photons reduce NADP+ to NADPH via ferredoxin and ferredoxin-NADP+ reductase. The generated ATP and NADPH power the carboxylation of ribulose-1,5-bisphosphate by the enzyme RuBisCO, initiating the reduction and regeneration phases of the Calvin cycle. This cyclic process is vital for carbon sequestration and oxygen production on a global scale and represents one of the most important processes in biosphere. The quantum yield of photosynthesis and the efficiency of light absorption are influenced by numerous factors including wavelength of incident light and the composition of the photosynthetic apparatus. Variations in these factors directly impact global primary productivity.`
  }
  return `${topic} is the fundamental biochemical process by which autotrophic organisms harness photonic energy to drive reduction-oxidation reactions, generating reducing power and ATP for biosynthesis and maintenance functions. This process consists of light-dependent reactions anchored in the thylakoid membrane system and the light-independent Calvin cycle localized to the stroma compartment. Photon absorption by photosystem II triggers charge separation in the reaction center, initiating vectorial electron transport through cytochrome b6f complexes with concurrent proton translocation establishing a proton-motive force across the membrane. This electrochemical gradient drives ATP synthase and generates ATP via oxidative phosphorylation mechanisms similar to mitochondrial respiration. Concurrently, electrons are transferred through plastocyanin to photosystem I, where additional photons reduce NADP+ to NADPH via ferredoxin-dependent pathways. The generated ATP and NADPH serve as reducing power for the carboxylation of ribulose-1,5-bisphosphate catalyzed by RuBisCO, initiating the reduction and regeneration phases of the Calvin cycle with exquisite regulation. The stoichiometric conversion of CO2 into hexose sugars represents the fundamental mechanism of planetary carbon fixation and primary productivity in ecosystems. Factors including photosynthetic photon flux density, wavelength composition, temperature, and CO2 concentration regulate photosynthetic rates and the efficiency of quantum conversion through complex regulatory mechanisms and feedback circuits.`
}

async function callOpenRouter(messages){
  if(!KEY) throw new Error('OPENROUTER_API_KEY (or OPENAI_API_KEY) not set in environment')
  const res = await fetch(OPENROUTER_ENDPOINT, {
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Authorization': `Bearer ${KEY}`
    },
    body: JSON.stringify({model: MODEL, messages, temperature:0.2, max_tokens:800})
  })
  if(!res.ok){
    const txt = await res.text()
    throw new Error(`OpenRouter error: ${res.status} ${txt}`)
  }
  const j = await res.json()
  return j.choices?.[0]?.message?.content || j.output || JSON.stringify(j)
}

export async function generateStructuredContent(topic, grade){
  // If mock mode is enabled, return a canned JSON string for local development
  if(process.env.USE_MOCK_AI === 'true'){
    const summary = buildMockSummary(topic, grade)
    const band = getGradeBand(grade)
    const keyPoints = band === 'early'
      ? [
          'Plants make food from sunlight using chlorophyll.',
          'They need water from soil, air, and sunlight to survive.',
          'Photosynthesis creates the oxygen we breathe.',
          'Plants use the food they make to grow bigger and stronger.',
          'Green plants are special because they make their own food.'
        ]
      : band === 'middle'
        ? [
            'Photosynthesis converts light energy into chemical energy in glucose.',
            'Plants absorb water through roots and carbon dioxide through leaves.',
            'Chlorophyll in leaf cells captures photons from sunlight.',
            'Oxygen is released as a byproduct into the atmosphere.',
            'Glucose produced is used for plant growth and energy.'
          ]
        : band === 'upper'
          ? [
              'Light-dependent reactions occur in thylakoid membranes and produce ATP and NADPH.',
              'Photosystem II catalyzes photolysis of water, releasing oxygen electrons and protons.',
              'Electron transport chains establish proton gradients for ATP synthesis via chemiosmosis.',
              'The Calvin cycle uses ATP and NADPH to fix CO2 into glucose via RuBisCO.',
              'Ribulose-1,5-bisphosphate regeneration sustains continuous carbon fixation cycles.'
            ]
          : [
              'Photon absorption by photosystem II initiates charge separation and electron transport.',
              'Thylakoid membrane organization enables efficient proton gradient and electrochemical coupling.',
              'RuBisCO catalyzes carboxylation of C5 sugars with unprecedented catalytic precision.',
              'Photorespiration competes with photosynthesis, affecting net carbon fixation efficiency.',
              'Light intensity, CO2 concentration, and temperature regulate photosynthetic rate and quantum yield.'
            ]
    const mock = {
      summary,
      keyPoints,
      quiz: [
        { question: 'What do plants need for photosynthesis?', options: ['Sunlight','Soil only','Wind','Rocks'], correctAnswer: 'Sunlight' },
        { question: 'Which gas do plants take in for photosynthesis?', options: ['Oxygen','Carbon dioxide','Nitrogen','Helium'], correctAnswer: 'Carbon dioxide' },
        { question: 'What is produced during photosynthesis?', options: ['Oxygen','Gold','Plastic','Iron'], correctAnswer: 'Oxygen' }
      ]
    }
    return JSON.stringify(mock)
  }

  const sys = `You are a helpful assistant that outputs ONLY JSON. Produce a JSON object with keys: summary, keyPoints, quiz. summary: a short explanation. keyPoints: an array of 3-5 short bullets. quiz: array of 3 questions, each question object must have 'question', 'options' (4 strings), and 'correctAnswer' (either the correct option string or the index 0-3). Respond with JSON only.`
  const user = `Topic: ${topic}\nGrade: ${grade}`
  const raw = await callOpenRouter([{role:'system', content: sys}, {role:'user', content: user}])
  return raw
}

export function tryParseJson(text){
  try{ return JSON.parse(text) }catch(e){
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if(start!==-1 && end!==-1){
      const sub = text.slice(start, end+1)
      try{ return JSON.parse(sub) }catch(e2){ return null }
    }
    return null
  }
}

export async function repairToJson(malformed, topic, grade){
  const sys = `You are a JSON fixer. Given some text, extract and return a valid JSON object that matches this schema: {summary: string, keyPoints: [string], quiz: [{question:string, options:[string], correctAnswer: string|number}]}. Do NOT include any extra fields.`
  const user = `Original content:\n${malformed}\nTopic:${topic}\nGrade:${grade}`
  const raw = await callOpenRouter([{role:'system',content:sys},{role:'user',content:user}])
  return raw
}

export async function simplifySummary(summary, grade){
  const sys = `You are a tutor. Rewrite the following text in simpler language suitable for a younger student in grade ${grade}. Keep it short and use simple sentences. Output only the rewritten summary.`
  const user = `Text:\n${summary}`
  const raw = await callOpenRouter([{role:'system',content:sys},{role:'user',content:user}])
  return raw
}
