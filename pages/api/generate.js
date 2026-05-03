import { generateStructuredContent, tryParseJson, repairToJson, simplifySummary } from '../../lib/ai'

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
  return `${topic} is the fundamental biochemical process by which autotrophic organisms harness photonic energy to drive reduction-oxidation reactions, generating reducing power and ATP for biosynthesis and maintenance functions essential to cellular operations. This process consists of two major stages: the light-dependent reactions anchored in the thylakoid membrane system and the light-independent Calvin cycle localized to the stroma compartment. Photon absorption by photosystem II triggers charge separation in the reaction center, initiating vectorial electron transport through cytochrome b6f complexes with concurrent proton translocation establishing a proton-motive force across the membrane. This electrochemical gradient drives ATP synthase and generates ATP via oxidative phosphorylation mechanisms similar to mitochondrial respiration. Concurrently, electrons are transferred through plastocyanin to photosystem I, where additional photons reduce NADP+ to NADPH via ferredoxin-dependent pathways. The generated ATP and NADPH serve as reducing power for the carboxylation of ribulose-1,5-bisphosphate catalyzed by RuBisCO, initiating the reduction and regeneration phases of the Calvin cycle with exquisite allosteric regulation. The stoichiometric conversion of CO2 into hexose sugars represents the fundamental mechanism of planetary carbon fixation and primary productivity in ecosystems worldwide. Factors including photosynthetic photon flux density, wavelength composition, temperature, and CO2 concentration regulate photosynthetic rates and the efficiency of quantum conversion through complex regulatory mechanisms and feedback circuits. Recent research demonstrates that photosynthetic efficiency variations directly impact global food security and carbon sequestration capacity.`
}

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end()
  const { topic, grade } = req.body || {}
  if(!topic || !grade) return res.status(400).json({error:'topic and grade are required'})

  try{
    // Server-side mock shortcut to avoid external calls when developing locally
    if(process.env.USE_MOCK_AI === 'true'){
      const originalSummary = buildMockSummary(topic, grade)
      const band = getGradeBand(grade)
      const keyPoints = band === 'early'
        ? [
            'Plants make food from sunlight using chlorophyll, a special green pigment in their leaves.',
            'They need water from soil through roots, sunlight from the sky, and carbon dioxide from the air.',
            'Photosynthesis creates the oxygen we breathe, which comes out of the leaves as a waste product.',
            'Plants use the food they make to grow bigger, taller, stronger and to create flowers and fruits.',
            'Green plants are special because they make their own food from sunlight, unlike animals that must eat.',
            'This process is so important that almost all life on Earth depends on plants for oxygen and food.'
          ]
        : band === 'middle'
          ? [
              'Photosynthesis converts light energy into chemical energy stored in glucose, a sugar plants use as food.',
              'Plants absorb water through roots from soil and carbon dioxide through stomata (tiny pores) in leaves.',
              'Chlorophyll in leaf cells captures photons from sunlight and uses this energy to power chemical reactions.',
              'Oxygen is released as a byproduct into the atmosphere during the light reactions phase of photosynthesis.',
              'Glucose produced is used by plants for growth, energy, and creating structures like stems, roots, and leaves.',
              'The chloroplast is the special organelle where photosynthesis happens, similar to a factory making food.'
            ]
          : band === 'upper'
            ? [
                'Light-dependent reactions occur in thylakoid membranes of chloroplasts and produce ATP and NADPH needed for the Calvin cycle.',
                'Photosystem II catalyzes water photolysis, releasing oxygen, electrons, and protons that fuel the electron transport chain.',
                'Electron transport chains establish a proton gradient across the thylakoid membrane, driving chemiosmotic ATP synthesis.',
                'The Calvin cycle uses ATP and NADPH to fix CO2 into glucose via RuBisCO carboxylation in the stroma.',
                'Ribulose-1,5-bisphosphate regeneration sustains continuous carbon fixation cycles, making photosynthesis an efficient energy conversion process.',
                'Photosynthesis achieves approximately 11% energy conversion efficiency under optimal conditions, competing with most engineered solar cells.'
              ]
            : [
                'Photon absorption by photosystem II initiates charge separation and electron transport through the cytochrome b6f complex system.',
                'Thylakoid membrane organization enables efficient proton gradient establishment and vectorial electron transport with minimal energy loss.',
                'RuBisCO catalyzes carboxylation of ribulose-1,5-bisphosphate with unprecedented catalytic precision despite having low turnover rates.',
                'Photorespiration competes with photosynthesis when O2 concentration exceeds CO2, reducing net carbon fixation efficiency by 25-40%.',
                'Light intensity, CO2 concentration, temperature, and photosynthetic pigment composition regulate photosynthetic rate and quantum yield efficiency.',
                'Alternative pathways including C4 and CAM photosynthesis evolved to maximize efficiency in specific environmental conditions.'
              ]
      const mock = {
        originalSummary,
        summary: originalSummary,
        keyPoints,
        quiz: [
          { question: 'What do plants need for photosynthesis?', options: ['Sunlight','Soil only','Wind','Rocks'], correctAnswer: 'Sunlight' },
          { question: 'Which gas do plants take in for photosynthesis?', options: ['Oxygen','Carbon dioxide','Nitrogen','Helium'], correctAnswer: 'Carbon dioxide' },
          { question: 'What is produced during photosynthesis?', options: ['Oxygen','Gold','Plastic','Iron'], correctAnswer: 'Oxygen' }
        ]
      }
      return res.status(200).json(mock)
    }

    // 1. ask AI for structured JSON
    const raw = await generateStructuredContent(topic, grade)
    let parsed = tryParseJson(raw)
    if(!parsed){
      // attempt repair
      const repaired = await repairToJson(raw, topic, grade)
      parsed = tryParseJson(repaired)
    }
    if(!parsed) return res.status(500).json({error:'Failed to parse AI response into JSON'})

    // basic validation
    const { summary, keyPoints, quiz } = parsed
    if(!summary || !Array.isArray(keyPoints) || !Array.isArray(quiz)) return res.status(500).json({error:'AI returned invalid structure'})

    // ensure keyPoints 3-5
    parsed.keyPoints = keyPoints.slice(0,5)

    // normalize quiz: ensure each has question, options (4), correctAnswer
    parsed.quiz = quiz.slice(0,3).map(q=>{
      const opts = Array.isArray(q.options) ? q.options.slice(0,4) : []
      return { question: q.question || 'Question', options: opts.length?opts:['A','B','C','D'], correctAnswer: q.correctAnswer }
    })

    const originalSummary = parsed.summary
    // paraphrase simplified summary
    const simplified = await simplifySummary(originalSummary, grade)

    const out = { originalSummary, summary: simplified, keyPoints: parsed.keyPoints, quiz: parsed.quiz }
    return res.status(200).json(out)
  }catch(err){
    console.error(err)
    return res.status(500).json({error: err.message})
  }
}
