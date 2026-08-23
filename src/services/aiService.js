/**
 * MentorPath AI Black-Box Service
 * 
 * Treat `generatePersonalizedContent` as a single black box function that accepts
 * structured prompt parameters or prompt string and returns AI-generated content.
 * 
 * Includes realistic intelligent mock fallbacks tailored to any goal/domain/persona,
 * while allowing user to plug in a direct LLM API key (OpenAI/Anthropic/Gemini) if desired.
 */

// Debug log store for the Prompt Debugger Modal
export const promptLogs = [];

export function logPromptCall(callDetails) {
  promptLogs.unshift({
    id: Date.now() + Math.random().toString(36).substr(2, 4),
    timestamp: new Date().toLocaleTimeString(),
    ...callDetails
  });
  if (promptLogs.length > 20) promptLogs.pop();
}

/**
 * Core AI function requested by prompt requirements:
 * generatePersonalizedContent(promptData)
 * 
 * @param {Object|string} promptData - Can be a raw prompt string or an object { type, systemPrompt, userPrompt, context }
 * @returns {Promise<string|Object>} Generated text response or parsed structured JSON
 */
export async function generatePersonalizedContent(promptData) {
  const apiKey = typeof window !== 'undefined' ? window.__MENTOR_PATH_API_KEY__ : null;
  const apiEndpoint = typeof window !== 'undefined' ? window.__MENTOR_PATH_API_ENDPOINT__ || 'https://api.openai.com/v1/chat/completions' : null;
  const modelName = typeof window !== 'undefined' ? window.__MENTOR_PATH_MODEL__ || 'gpt-4o-mini' : null;

  let systemPrompt = typeof promptData === 'object' ? promptData.systemPrompt : 'You are an expert AI Mentor.';
  const userPrompt = typeof promptData === 'object' ? promptData.userPrompt : String(promptData);
  const taskType = typeof promptData === 'object' ? promptData.type : 'general';

  // Include Adaptive Learner Model in System Prompt if available
  const learnerModel = promptData?.context?.learnerModel || promptData?.learnerModel;
  if (learnerModel) {
    const weakTopicsStr = learnerModel.weakTopics?.length > 0 ? learnerModel.weakTopics.join(', ') : 'None so far';
    systemPrompt += `\n\n[ADAPTIVE LEARNER MODEL CONTEXT]:
- Preferred Complexity Depth: ${learnerModel.preferredLevel || 'ELI10'}
- Best-Fit Explanation Style: ${learnerModel.preferredStyle || 'Analogy'}
- Topics Learner Struggled With (Needs Review): ${weakTopicsStr}
- Pace & Confusion Signals: Learner cycling styles ${learnerModel.avgCycles || 0} times per topic.
INSTRUCTION: Adapt your explanation style accordingly. If this topic is conceptually related to something they struggled with (${weakTopicsStr}), build a helpful cognitive bridge from it.`;
  }


  // If real API key is configured, execute live fetch
  if (apiKey) {
    try {
      logPromptCall({
        type: taskType,
        systemPrompt,
        userPrompt,
        status: 'sending_to_api'
      });

      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7
        })
      });

      const data = await res.json();
      const textResult = data.choices?.[0]?.message?.content || JSON.stringify(data);

      logPromptCall({
        type: taskType,
        systemPrompt,
        userPrompt,
        response: textResult,
        status: 'success_api'
      });

      return textResult;
    } catch (err) {
      console.error('LLM API call failed, falling back to mock generator:', err);
    }
  }

  // --- MOCK GENERATOR FALLBACK ---
  // Simulates realistic network delay (400-800ms) for high-fidelity interactive feel
  await new Promise((resolve) => setTimeout(resolve, 550));

  const mockResponse = generateSmartMockContent(taskType, promptData);

  logPromptCall({
    type: taskType,
    systemPrompt,
    userPrompt,
    response: typeof mockResponse === 'object' ? JSON.stringify(mockResponse, null, 2) : mockResponse,
    status: 'mock_fallback'
  });

  return mockResponse;
}

/**
 * Intelligent Mock Response Synthesizer
 */
function generateSmartMockContent(type, data) {
  const { goal = 'Software Engineering', domain = 'cooking', persona = 'Patient Teacher', level = 'ELI10', style = 'Analogy', topicName = '', jobDescription = '' } = data?.context || {};

  if (type === 'path_generation') {
    return generateMockPath(goal, domain, data?.context?.role, jobDescription);
  }

  if (type === 'topic_explanation') {
    return generateMockExplanation(topicName, goal, domain, persona, level, style);
  }

  if (type === 'flashcard_generation') {
    return generateMockFlashcards(goal, domain, data?.context?.coveredTopics || []);
  }

  if (type === 'doubt_resolution') {
    return generateMockDoubtResolution(data?.userPrompt, data?.context);
  }

  return `Here is a personalized response regarding ${topicName || goal} tailored to your background in ${domain}.`;
}

/**
 * Generate intelligent doubt resolution responses tailored to topic, persona, and analogy domain
 */
function generateMockDoubtResolution(userPrompt = '', context = {}) {
  const { goal = 'Software Engineering', domain = 'cooking', persona = 'Patient Teacher', topicName = '' } = context || {};
  const queryLower = (userPrompt || '').toLowerCase();
  
  let header = '';
  if (persona === 'Strict Senior Engineer') {
    header = `⚡ **Strict Senior Tech Brief:**\n`;
  } else if (persona === 'Socratic Questioner') {
    header = `🔍 **Socratic Perspective:**\n`;
  } else {
    header = `💚 **AI Mentor Guidance:**\n`;
  }

  let coreAnswer = '';
  if (queryLower.includes('example') || queryLower.includes('code') || queryLower.includes('how to')) {
    coreAnswer = `Here is a practical code example demonstrating **${topicName || goal}**:\n\n` +
      `\`\`\`javascript\n` +
      `// Production Example: ${topicName || goal}\n` +
      `function executeProcess(inputData) {\n` +
      `  // 1. Guard check (Analogy: verifying ingredients in ${domain})\n` +
      `  if (!inputData) throw new Error("Missing payload");\n\n` +
      `  // 2. Perform transformation\n` +
      `  const result = {\n` +
      `    id: Date.now(),\n` +
      `    data: inputData,\n` +
      `    processedAt: new Date().toISOString()\n` +
      `  };\n\n` +
      `  return result;\n` +
      `}\n\n` +
      `// Test invocation:\n` +
      `const outcome = executeProcess({ step: 'Mastery' });\n` +
      `console.log('Outcome:', outcome);\n` +
      `\`\`\`\n\n` +
      `**Why this matters:** Keeping computations pure and predictable prevents side-effects across components.`;
  } else if (queryLower.includes('why') || queryLower.includes('vs') || queryLower.includes('difference') || queryLower.includes('instead')) {
    coreAnswer = `Great question regarding **${topicName || 'this concept'}**!\n\n` +
      `Here is why this approach is preferred over legacy patterns:\n\n` +
      `• **1. Unidirectional Data Flow:** State flows predictably, making debugging much simpler.\n` +
      `• **2. Reusability:** Modular abstractions can be tested independently without relying on global state.\n` +
      `• **3. Scalability:** Fits into large codebase standards without unexpected re-render bottlenecks.\n\n` +
      `*Analogy Bridge (${domain}):* Think of it like pre-measuring ingredients before heating the pan—it guarantees consistent results every single time!`;
  } else if (queryLower.includes('bug') || queryLower.includes('error') || queryLower.includes('issue') || queryLower.includes('wrong')) {
    coreAnswer = `When working with **${topicName || goal}**, keep an eye out for these 3 common bugs:\n\n` +
      `⚠️ **1. Direct State Mutation:** Modifying objects directly breaks change detection. Always return fresh updated copies.\n` +
      `⚠️ **2. Uncleaned Async Effects:** Forgetting to cancel timers or subscriptions can lead to memory leaks.\n` +
      `⚠️ **3. Incorrect Dependency Arrays:** Missing dependency variables causes stale closures.`;
  } else {
    coreAnswer = `Regarding your doubt: **"${userPrompt}"**\n\n` +
      `When tackling **${topicName || goal}**, keep these key principles in mind:\n\n` +
      `1. **Focus on Core Mechanics:** Understand the input-to-output flow before adding complex abstractions.\n` +
      `2. **Real-World Mental Model:** In your **${domain}** analogy, every step in the pipeline must execute cleanly in sequence.\n` +
      `3. **Incremental Progress:** Test each small block in isolation before combining them into a full feature.\n\n` +
      `If you'd like, I can write a custom code snippet, give another real-world metaphor, or break down potential edge cases!`;
  }

  let followUp = '';
  if (persona === 'Socratic Questioner') {
    followUp = `\n\n> 💬 **Follow-up reflection for you:** How would you modify this approach if the input data was streamable or asynchronous?`;
  } else if (persona === 'Strict Senior Engineer') {
    followUp = `\n\n> 📌 **Senior Rule:** Ensure you write unit tests covering edge cases before deploying this code to production.`;
  } else {
    followUp = `\n\n> 🌟 **Tip:** Feel free to ask me follow-up questions or paste any code you want me to review!`;
  }

  return `${header}${coreAnswer}${followUp}`;
}

/**
 * Synthesize AI Resume based on completed topics & onboarding goals
 */
function generateMockResume(goal = 'Frontend Engineering', role = 'Developer', completedTopics = [], skillGapMap = null) {
  const title = goal ? `${goal} Specialist` : 'Adaptive Tech Candidate';
  
  const summary = `Results-driven ${role || 'Professional'} actively mastering modern ${goal || 'software engineering'} competencies through AI-guided adaptive learning pathways. Demonstrated expertise in architectural patterns, reactive state management, and real-world domain problem solving.`;

  const skillsList = completedTopics.length > 0 
    ? completedTopics.map(t => typeof t === 'string' ? t : t.title)
    : [
        'Component Architecture & Props Flow',
        'State Management with useState & useReducer',
        'Effect Lifecycles & Async Data Fetching',
        'Custom Hooks & Modular Business Logic',
        'Performance Tuning & Memoization'
      ];

  const projects = [
    {
      title: `${goal} Adaptive Architecture Project`,
      period: '2026 • Live Project',
      description: `Architected and implemented a high-performance web prototype demonstrating mastery of ${skillsList.slice(0, 3).join(', ')}. Built using modern React, Tailwind CSS, and AI orchestration.`,
      highlights: [
        `Mastered ${skillsList[0] || 'core concepts'} with verified self-assessment rating of 'Got it!'.`,
        `Integrated adaptive state management to handle dynamic user inputs and zero-latency UI updates.`,
        `Addressed high-priority skill requirements matching target job specifications.`
      ]
    }
  ];

  const certifications = [
    {
      title: `MentorPath Master Learning Certificate: ${goal}`,
      issuer: 'MentorPath AI Platform',
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    }
  ];

  return {
    name: 'Alex Vance',
    targetTitle: title,
    summary,
    skills: skillsList,
    projects,
    certifications
  };
}


/**
 * Generate 5-8 topics roadmap + optional Skill Gap Map
 */
function generateMockPath(goal, domain, role, jobDescription) {
  const goalLower = goal.toLowerCase();
  
  let topics = [];
  if (goalLower.includes('react') || goalLower.includes('frontend')) {
    topics = [
      { id: 't1', title: 'Component Architecture & Props Flow', description: 'Understanding reusable UI blocks and data passing like recipes and ingredients.', estMinutes: 12, category: 'Core' },
      { id: 't2', title: 'State Management with useState & useReducer', description: 'Handling reactive user inputs, temporary state, and state transitions cleanly.', estMinutes: 15, category: 'Core' },
      { id: 't3', title: 'Effect Lifecycles & Data Fetching', description: 'Synchronizing components with external APIs and managing async side effects.', estMinutes: 18, category: 'Advanced' },
      { id: 't4', title: 'Custom Hooks & Reusable Logic', description: 'Extracting stateful business logic out of UI components for clean separation.', estMinutes: 15, category: 'Architecture' },
      { id: 't5', title: 'Performance Tuning & Memoization', description: 'Preventing unnecessary re-renders with useMemo, useCallback, and React DevTools.', estMinutes: 20, category: 'Optimization' },
      { id: 't6', title: 'Testing & Production Deployment', description: 'Unit testing components with React Testing Library and automated deployment pipelines.', estMinutes: 15, category: 'DevOps' }
    ];
  } else if (goalLower.includes('data') || goalLower.includes('python') || goalLower.includes('analysis')) {
    topics = [
      { id: 't1', title: 'Exploratory Data Analysis with Pandas', description: 'Cleaning raw datasets, handling missing values, and summarizing statistics.', estMinutes: 12, category: 'Foundations' },
      { id: 't2', title: 'Data Visualization & Storytelling', description: 'Creating clear charts and visual insights using Matplotlib and Seaborn.', estMinutes: 15, category: 'Analytics' },
      { id: 't3', title: 'SQL Aggregations & Complex Joins', description: 'Querying relational databases to answer key business performance questions.', estMinutes: 18, category: 'Database' },
      { id: 't4', title: 'Statistical Inference & Hypothesis Testing', description: 'Validating metrics, p-values, and A/B testing experiment outcomes.', estMinutes: 20, category: 'Statistics' },
      { id: 't5', title: 'Feature Engineering & Baseline ML Models', description: 'Transforming categorical & numerical variables for predictive modeling.', estMinutes: 22, category: 'Machine Learning' },
      { id: 't6', title: 'Dashboard Building & Executive Reporting', description: 'Packaging data pipelines into interactive executive summaries.', estMinutes: 15, category: 'Reporting' }
    ];
  } else {
    // Generic high-quality tech/business path
    topics = [
      { id: 't1', title: `Foundations of ${goal}`, description: `Core concepts, terminology, and key mental models in ${goal}.`, estMinutes: 10, category: 'Foundations' },
      { id: 't2', title: 'Mental Models & Framework Design', description: `Structuring complex workflows and problem solving techniques.`, estMinutes: 15, category: 'Core' },
      { id: 't3', title: 'Applied Hands-on Patterns', description: `Practical execution of key tasks with real-world constraints.`, estMinutes: 18, category: 'Practice' },
      { id: 't4', title: 'Error Handling & Edge Cases', description: `Diagnosing bottlenecks, edge cases, and troubleshooting common failures.`, estMinutes: 15, category: 'Problem Solving' },
      { id: 't5', title: 'Advanced Systems & Architecture', description: `Scalability, optimization, and industry best practices.`, estMinutes: 20, category: 'Advanced' },
      { id: 't6', title: 'Portfolio Project & Capstone Review', description: `Building a tangible asset demonstrating mastery of ${goal}.`, estMinutes: 25, category: 'Capstone' }
    ];
  }

  let skillGapMap = null;
  if (role === 'Working Professional' || jobDescription.trim().length > 0) {
    skillGapMap = {
      targetRole: jobDescription.slice(0, 45) || 'Target Senior Role',
      matchedSkills: [
        { name: 'Core Conceptual Understanding', level: 'Strong' },
        { name: 'Basic Tooling & Workflow', level: 'Intermediate' }
      ],
      missingSkills: [
        { name: 'Production State & Performance Optimization', priority: 'High', reason: 'Frequently cited in job posting for senior autonomy' },
        { name: 'System Architecture & Design Patterns', priority: 'High', reason: 'Key requirement for leading cross-functional projects' },
        { name: 'Automated Testing & CI/CD Pipelines', priority: 'Medium', reason: 'Essential for production release quality' },
        { name: 'Scalability & Performance Monitoring', priority: 'Low', reason: 'Good to have for high-scale enterprise applications' }
      ]
    };
  }

  return { topics, skillGapMap };
}

/**
 * Generate explanation based on Persona, ELI level, and Analogy style
 */
function generateMockExplanation(topicName, goal, domain, persona, level, style) {
  const domainText = domain || 'cooking';
  
  // Style-specific variations
  let headline = '';
  let analogySection = '';
  let mainBody = '';
  let keyTakeaway = '';

  if (persona === 'Strict Senior Engineer') {
    headline = `Strict Engineering Breakdown: ${topicName}`;
    keyTakeaway = `Key Takeaway: Eliminate ambiguity. Clean abstractions save debugging hours down the line.`;
  } else if (persona === 'Socratic Questioner') {
    headline = `Socratic Inquiry: Deep Dive into ${topicName}`;
    keyTakeaway = `Reflective Question: Why do you think choosing this pattern prevents subtle side-effects?`;
  } else {
    headline = `Guide to ${topicName}`;
    keyTakeaway = `Pro Tip: Master this concept first, and everything downstream becomes intuitive.`;
  }

  // Level adjustments
  let complexityExplanation = '';
  if (level === 'ELI5') {
    complexityExplanation = `Imagine you are explaining ${topicName} to a 5-year-old child. We use zero jargon, super clear everyday images, and friendly steps.`;
  } else if (level === 'ELI10') {
    complexityExplanation = `Explained for a middle-school student: plain language with intuitive examples, skipping heavy formal specifications.`;
  } else if (level === 'ELI20') {
    complexityExplanation = `Peer-to-peer technical discussion: professional tone, proper industry terms, clean code patterns, and practical trade-offs.`;
  } else {
    complexityExplanation = `Expert Deep Dive: internal mechanics, memory layout, algorithmic trade-offs, and edge case optimization rules.`;
  }

  // Analogy Engine tailoring
  if (style === 'Analogy') {
    analogySection = `
### 🍳 The ${domainText.toUpperCase()} Analogy Engine
Think of **${topicName}** just like in **${domainText}**:
- When you set up your core setup in ${domainText}, you prepare all components in advance so every step is predictable.
- In ${topicName}, each function or block operates like a specialized recipe station—it receives raw input (ingredients), applies precise transformations, and returns a refined output without making a mess of the global kitchen!
    `;
  } else if (style === 'Story') {
    analogySection = `
### 📖 Scenario Story
Picture a busy ${domainText} expert facing a rush order. Suddenly, inputs start coming in simultaneously from three different sources. Without **${topicName}**, chaos erupts! But by applying a structured queue pattern, every order gets processed smoothly in sequence.
    `;
  } else if (style === 'Visual') {
    analogySection = `
### 📐 Visual Diagram Description
\`\`\`text
[ Raw Inputs / Trigger ]
         │
         ▼
┌───────────────────────────────┐
│ ${topicName} Pipeline         │
│ ┌──────────────┐              │
│ │  Validation  │ ──► [ Pass ] │
│ └──────────────┘              │
│        │                      │
│        ▼                      │
│ ┌──────────────┐              │
│ │  State Sync  │ ──► [ Output]│
│ └──────────────┘              │
└───────────────────────────────┘
\`\`\`
    `;
  } else if (style === 'Worked Example') {
    analogySection = `
### 🛠 Worked Step-by-Step Example
**Step 1: Input Setup**  
Initialize state variables and set up parameters.

**Step 2: Processing Transformation**  
Execute core logic: `+ "`" + `const result = computeTransformation(data);` + "`" + `

**Step 3: Verification & Output**  
Verify output bounds and push updated state to the consumer.
    `;
  } else {
    analogySection = `
### 🔬 Expert Architectural Analysis
In high-throughput environments, **${topicName}** minimizes lock contention and guarantees temporal consistency. By isolating reactive mutations, we maintain low memory overhead while preserving idempotent behavior across concurrent worker threads.
    `;
  }

  mainBody = `
**Complexity Level:** ${level} (${complexityExplanation})

**Concept Overview:**  
${topicName} provides the structural foundation required for mastering ${goal}. When designing system components, separating concerns allows for modular maintainability and rapid debugging.

${analogySection}

**Why This Matters for Your Goal:**  
By mastering this topic, you unlock the ability to design resilient workflows that scale cleanly.
  `;

  return {
    headline,
    body: mainBody.trim(),
    keyTakeaway,
    persona,
    level,
    style,
    domainUsed: domainText
  };
}

/**
 * Generate 3-5 flashcards for session recap
 */
function generateMockFlashcards(goal, domain, coveredTopics) {
  const topicsStr = coveredTopics.length > 0 ? coveredTopics.join(', ') : goal;
  
  return [
    {
      id: 'fc1',
      question: `What is the primary role of ${coveredTopics[0] || 'the core concept'} in system architecture?`,
      answer: `It encapsulates logic and state so components stay modular, predictable, and easy to maintain without side effects.`
    },
    {
      id: 'fc2',
      question: `How does the ${domain || 'cooking'} analogy help explain state transitions?`,
      answer: `Just like ingredients changing state when cooked, data transforms through predefined pipeline steps without altering original inputs.`
    },
    {
      id: 'fc3',
      question: `What is a key difference when applying ELI5 simplicity vs Expert level depth?`,
      answer: `ELI5 focuses on high-level intuitive metaphors, while Expert level dives into memory lifecycle, performance trade-offs, and edge cases.`
    },
    {
      id: 'fc4',
      question: `Why is tracking confidence ("Got it" vs "Still lost") vital during learning sessions?`,
      answer: `It flags weak mental models early, allowing targeted resurfacing of shaky concepts before moving on to dependent topics.`
    }
  ];
}
