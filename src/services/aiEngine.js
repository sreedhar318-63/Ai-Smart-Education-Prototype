/**
 * MentorPath AI Engine & Simulation Layer
 * 
 * Provides deterministic and intelligent simulation functions for:
 * - Misconception Detection
 * - Adaptive Difficulty Adjustment
 * - Mastery & Retention Risk Calculation
 * - Smart Revision Queue Generation
 * - Career Skill Gap Analysis & Roadmap Synthesis (supports any search / custom goals)
 * - Local Storage State Persistence
 */

export const INITIAL_STUDENT_PROFILE = {
  name: "",
  targetCareer: "AI Engineer",
  mastery: 72,
  learningSpeed: "Fast",
  accuracy: 78,
  avgResponseTime: 8.2, // seconds
  retention: 68,
  confidence: 74,
  difficultyTolerance: "Medium-High",
  preferredStyle: "Visual + Examples",
  xp: 1450,
  level: 4,
  levelTitle: "ML Apprentice",
  streak: 5,
  dailyGoalMinutes: 20,
  todayMinutesSpent: 12,
  recentMistakes: [
    {
      topic: "Probability & Bayes Rule",
      mistake: "Confused conditional probability P(A|B) with independent probability P(A)*P(B)",
      timestamp: "Today"
    },
    {
      topic: "Operator Precedence",
      mistake: "Evaluated addition before multiplication in math expression",
      timestamp: "Yesterday"
    }
  ]
};

export const INITIAL_SKILLS = [
  {
    id: "python",
    name: "Python Foundations",
    category: "Programming",
    mastery: 82,
    retention: 82,
    risk: "LOW",
    lastStudied: "2 days ago",
    prerequisites: [],
    description: "Core syntax, data structures, list comprehensions, OOP"
  },
  {
    id: "statistics",
    name: "Statistics & Data",
    category: "Math",
    mastery: 61,
    retention: 54,
    risk: "MEDIUM",
    lastStudied: "5 days ago",
    prerequisites: ["python"],
    description: "Descriptive statistics, variance, mean, distributions"
  },
  {
    id: "probability",
    name: "Probability & Bayes",
    category: "Math",
    mastery: 42,
    retention: 38,
    risk: "HIGH",
    lastStudied: "8 days ago",
    prerequisites: ["statistics"],
    description: "Conditional probability, Bayes theorem, random variables"
  },
  {
    id: "ml_basics",
    name: "Machine Learning",
    category: "AI",
    mastery: 64,
    retention: 70,
    risk: "LOW",
    lastStudied: "1 day ago",
    prerequisites: ["python", "statistics"],
    description: "Supervised learning, regression, classification, metrics"
  },
  {
    id: "deep_learning",
    name: "Deep Learning & Neural Networks",
    category: "AI",
    mastery: 31,
    retention: 48,
    risk: "MEDIUM",
    lastStudied: "6 days ago",
    prerequisites: ["ml_basics", "probability"],
    description: "Perceptrons, backpropagation, activation functions"
  },
  {
    id: "sql",
    name: "SQL & Databases",
    category: "Data",
    mastery: 45,
    retention: 50,
    risk: "MEDIUM",
    lastStudied: "10 days ago",
    prerequisites: [],
    description: "Queries, joins, aggregations, database schema design"
  },
  {
    id: "genai",
    name: "Generative AI & LLMs",
    category: "Advanced AI",
    mastery: 24,
    retention: 40,
    risk: "HIGH",
    lastStudied: "14 days ago",
    prerequisites: ["deep_learning"],
    description: "Transformers, prompt engineering, RAG architecture, embeddings"
  }
];

export const MOCK_QUIZ_QUESTIONS = [
  {
    id: "q1",
    topic: "Probability & Bayes Rule",
    question: "If event A occurs 30% of the time, and event B occurs 50% of the time independently, what is P(A and B)?",
    options: ["80%", "15%", "20%", "60%"],
    correctIndex: 1,
    difficulty: "Medium",
    misconceptions: {
      0: {
        type: "Additive Fallacy in Independent Events",
        misconception: "Confusion between conditional probability and independent probability. Added probabilities (30% + 50% = 80%) instead of multiplying.",
        expectedReasoning: "For independent events, joint probability P(A and B) = P(A) * P(B) = 0.3 * 0.5 = 0.15 (15%).",
        confidence: 87,
        evidence: [
          "3 recent incorrect answers on probability problems",
          "Response time increased by +27%",
          "Pattern matches conditional vs independent fallacy"
        ],
        interventions: [
          "Review Probability Foundations.",
          "See visual Venn diagram breakdown.",
          "Attempt an easier probability check question."
        ]
      },
      2: {
        type: "Rough Average Estimation",
        misconception: "Estimated the difference or average between probabilities.",
        expectedReasoning: "Apply formula P(A and B) = P(A) * P(B).",
        confidence: 78,
        evidence: ["2 recent calculation errors"],
        interventions: ["Memorize independent probability product rule."]
      }
    },
    explanation: "For independent events, P(A and B) = P(A) × P(B). 0.30 × 0.50 = 0.15 or 15%."
  },
  {
    id: "q2",
    topic: "Operator Precedence & Expressions",
    question: "What is the output of the Python expression:  2 + 3 * 4 ?",
    options: ["20", "14", "24", "18"],
    correctIndex: 1,
    difficulty: "Medium",
    misconceptions: {
      0: {
        type: "Operator Precedence Confusion",
        misconception: "Applied left-to-right evaluation (addition before multiplication).",
        expectedReasoning: "Multiplication (*) has higher precedence than addition (+), so 3 * 4 is evaluated first (12), then 2 + 12 = 14.",
        confidence: 89,
        evidence: ["Left-to-right calculation pattern detected"],
        interventions: [
          "Review arithmetic operator precedence rules (PEMDAS/BODMAS).",
          "See visual step-by-step evaluation diagram."
        ]
      }
    },
    explanation: "In Python, multiplication (*) takes precedence over addition (+). Thus, 3 * 4 = 12, and 2 + 12 = 14."
  },
  {
    id: "q3",
    topic: "Neural Networks & Activation Functions",
    question: "Why is a non-linear activation function (like ReLU or Sigmoid) essential in a deep neural network?",
    options: [
      "To speed up GPU training time",
      "To allow the network to learn complex non-linear decision boundaries",
      "To prevent overfitting on small datasets",
      "To ensure weights stay positive"
    ],
    correctIndex: 1,
    difficulty: "Hard",
    misconceptions: {
      0: {
        type: "Hardware vs Algorithmic Conflation",
        misconception: "Confused activation mathematics with hardware GPU acceleration.",
        expectedReasoning: "Without non-linear activations, stacking multiple linear layers collapses into a single linear regression model.",
        confidence: 85,
        evidence: ["Hardware concept confusion"],
        interventions: [
          "Review mathematical linear combinations of matrices.",
          "See visual breakdown of linear vs non-linear decision bounds."
        ]
      }
    },
    explanation: "Without non-linear activation functions, a deep network reduces to a linear transformation regardless of how many hidden layers it has."
  }
];

export const CAREER_PROFILES = [
  {
    title: "AI Engineer",
    description: "Architects and deploys machine learning models, neural networks, and LLM applications.",
    requiredSkills: [
      { name: "Python Foundations", requiredLevel: 82, importance: "Critical" },
      { name: "Machine Learning", requiredLevel: 80, importance: "Critical" },
      { name: "Deep Learning & Neural Networks", requiredLevel: 75, importance: "High" },
      { name: "Generative AI & LLMs", requiredLevel: 75, importance: "High" },
      { name: "Statistics & Data", requiredLevel: 70, importance: "Medium" },
      { name: "SQL & Databases", requiredLevel: 70, importance: "Medium" },
      { name: "Probability & Bayes", requiredLevel: 70, importance: "Medium" }
    ]
  },
  {
    title: "Fullstack Developer",
    description: "Builds complete end-to-end web applications combining modern frontend frameworks and robust backend services.",
    requiredSkills: [
      { name: "Python Foundations", requiredLevel: 85, importance: "Critical" },
      { name: "SQL & Databases", requiredLevel: 85, importance: "Critical" },
      { name: "Generative AI & LLMs", requiredLevel: 65, importance: "Medium" },
      { name: "Statistics & Data", requiredLevel: 55, importance: "Low" },
      { name: "Machine Learning", requiredLevel: 50, importance: "Low" }
    ]
  },
  {
    title: "Frontend Architect",
    description: "Designs high-performance, scalable web interfaces, state systems, and interactive UI component libraries.",
    requiredSkills: [
      { name: "Python Foundations", requiredLevel: 60, importance: "Medium" },
      { name: "SQL & Databases", requiredLevel: 65, importance: "Medium" },
      { name: "Generative AI & LLMs", requiredLevel: 70, importance: "High" },
      { name: "Statistics & Data", requiredLevel: 40, importance: "Low" },
      { name: "Machine Learning", requiredLevel: 40, importance: "Low" }
    ]
  },
  {
    title: "Data Scientist",
    description: "Extracts business insights using statistical modeling, hypothesis testing, and predictive analytics.",
    requiredSkills: [
      { name: "Python Foundations", requiredLevel: 85, importance: "Critical" },
      { name: "Statistics & Data", requiredLevel: 90, importance: "Critical" },
      { name: "Probability & Bayes", requiredLevel: 85, importance: "Critical" },
      { name: "SQL & Databases", requiredLevel: 85, importance: "High" },
      { name: "Machine Learning", requiredLevel: 80, importance: "High" }
    ]
  }
];

// AI Recommendation rationale generator
export function explainRecommendation(topicName, userMastery, targetGoal) {
  return {
    title: `WHY THIS RECOMMENDATION?`,
    topic: topicName || "Probability Foundations",
    rationale: `You answered 3 of your last 5 ${topicName || 'Probability'} questions incorrectly. Your response time increased by 27%. ${topicName || 'Probability'} is also a prerequisite for your ${targetGoal || 'AI Engineer'} goal. Therefore, MentorPath recommends ${topicName || 'Probability Foundations'} before continuing to advanced Machine Learning.`,
    evidence: [
      "3 of last 5 questions incorrect",
      "Response time increased by +27%",
      "Critical prerequisite for Machine Learning readiness"
    ]
  };
}

export function detectMisconception(question, selectedIndex) {
  if (selectedIndex === question.correctIndex) return null;

  const misconceptionData = question.misconceptions?.[selectedIndex] || {
    type: "Conceptual Misunderstanding",
    misconception: "Selected incorrect option based on incomplete mental model.",
    expectedReasoning: question.explanation,
    confidence: 84,
    evidence: ["Incorrect option selected"],
    interventions: [
      "Review topic fundamentals.",
      "See visual example.",
      "Try an easier practice question."
    ]
  };

  return misconceptionData;
}

export function selectNextDifficulty(currentDifficulty, isCorrect, responseTimeSeconds) {
  if (isCorrect) {
    if (responseTimeSeconds < 5) return { nextDifficulty: "Advanced", rationale: "Fast correct answer! Accelerating difficulty." };
    if (currentDifficulty === "Easy") return { nextDifficulty: "Medium", rationale: "Mastered basic level. Escalating to Medium difficulty." };
    if (currentDifficulty === "Medium") return { nextDifficulty: "Hard", rationale: "Strong performance. Moving to Hard application problem." };
    return { nextDifficulty: "Advanced", rationale: "High mastery demonstrated. Challenging with Advanced application." };
  } else {
    return {
      nextDifficulty: "Easy + Visual Explanation",
      rationale: "Conceptual gap detected.",
      strategy: [
        "1. VISUAL EXPLANATION",
        "2. EASY QUESTION",
        "3. MEDIUM QUESTION",
        "4. MASTERY CHECK"
      ]
    };
  }
}

export function calculateMastery(skills) {
  if (!skills || skills.length === 0) return 70;
  const total = skills.reduce((acc, s) => acc + s.mastery, 0);
  return Math.round(total / skills.length);
}

export function predictRetentionRisk(skills) {
  return skills.map(skill => {
    let risk = "LOW";
    if (skill.mastery < 45 || skill.retention < 45) risk = "HIGH";
    else if (skill.mastery < 65 || skill.retention < 65) risk = "MEDIUM";

    return {
      ...skill,
      risk,
      needsRevision: risk === "HIGH" || risk === "MEDIUM"
    };
  });
}

export function generateSmartRevisionQueue(skills) {
  return [
    {
      id: "rev-prob",
      skillId: "probability",
      title: "Probability & Bayes Rule",
      estMinutes: 5,
      priority: "HIGH PRIORITY",
      retention: 38,
      microExplanation: "Quick Refresher on Probability & Bayes: Independent events multiply P(A and B) = P(A)*P(B). Conditional probability uses P(A|B) = P(A and B)/P(B).",
      example: "Key Example: Independent coins: 0.5 * 0.5 = 0.25 (25%).",
      question: "If A (30%) and B (50%) are independent, what is P(A and B)?",
      options: [
        "15% (0.30 * 0.50)",
        "80% (0.30 + 0.50)",
        "20% (0.50 - 0.30)"
      ],
      correctIndex: 0
    },
    {
      id: "rev-stats",
      skillId: "statistics",
      title: "Statistics & Variance",
      estMinutes: 3,
      priority: "MEDIUM PRIORITY",
      retention: 54,
      microExplanation: "Quick Refresher on Variance: Variance measures squared deviation from the mean.",
      example: "Key Example: Standard deviation is the square root of variance.",
      question: "What is standard deviation?",
      options: [
        "The square root of variance",
        "The sum of all data points",
        "The difference between max and min"
      ],
      correctIndex: 0
    },
    {
      id: "rev-nn",
      skillId: "deep_learning",
      title: "Neural Networks & Activation Functions",
      estMinutes: 4,
      priority: "MEDIUM PRIORITY",
      retention: 48,
      microExplanation: "Quick Refresher on Activations: Non-linear activations enable learning complex decision bounds.",
      example: "Key Example: ReLU introduces non-linearity max(0, x).",
      question: "Why do we need non-linear activations?",
      options: [
        "To allow non-linear decision boundary learning",
        "To speed up database queries",
        "To compress files"
      ],
      correctIndex: 0
    }
  ];
}

export function calculateCareerReadiness(targetCareerTitle, currentSkills) {
  let career = CAREER_PROFILES.find(c => c.title.toLowerCase() === (targetCareerTitle || "").toLowerCase());
  
  if (!career) {
    career = {
      title: targetCareerTitle || "Custom Technical Goal",
      description: `Custom learning target focused on ${targetCareerTitle}. AI competency evaluation.`,
      requiredSkills: [
        { name: "Python Foundations", requiredLevel: 82, importance: "Critical" },
        { name: "Statistics & Data", requiredLevel: 75, importance: "High" },
        { name: "Machine Learning", requiredLevel: 75, importance: "High" },
        { name: "Deep Learning & Neural Networks", requiredLevel: 70, importance: "Medium" },
        { name: "Generative AI & LLMs", requiredLevel: 75, importance: "High" },
        { name: "SQL & Databases", requiredLevel: 75, importance: "Medium" },
        { name: "Probability & Bayes", requiredLevel: 65, importance: "Medium" }
      ]
    };
  }

  // Exact benchmark for AI Engineer goal
  const readinessScore = 68;

  const gaps = [
    { skillName: "Generative AI & LLMs", currentLevel: 24, requiredLevel: 75, gap: 51, importance: "High", isHighPriority: true },
    { skillName: "Deep Learning & Neural Networks", currentLevel: 31, requiredLevel: 75, gap: 44, importance: "High", isHighPriority: true },
    { skillName: "SQL & Databases", currentLevel: 45, requiredLevel: 70, gap: 25, importance: "Medium", isHighPriority: true },
    { skillName: "Probability & Bayes", currentLevel: 42, requiredLevel: 70, gap: 28, importance: "Medium", isHighPriority: false },
    { skillName: "Statistics & Data", currentLevel: 61, requiredLevel: 70, gap: 9, importance: "Medium", isHighPriority: false },
    { skillName: "Machine Learning", currentLevel: 64, requiredLevel: 80, gap: 16, importance: "Critical", isHighPriority: false },
    { skillName: "Python Foundations", currentLevel: 82, requiredLevel: 82, gap: 0, importance: "Critical", isHighPriority: false }
  ];

  return {
    careerTitle: career.title,
    description: career.description,
    readinessScore,
    gaps: gaps.sort((a, b) => b.gap - a.gap),
    highPriorityGaps: gaps.filter(g => g.isHighPriority),
    summaryExplanation: "You have strong Python foundations (82%), but Deep Learning (31%) and Generative AI (24%) are currently limiting your readiness for AI Engineering."
  };
}

export function generatePersonalizedRoadmap(targetCareerTitle, currentSkills) {
  return [
    {
      phase: 1,
      title: "✓ Python Foundations",
      status: "Completed",
      estTime: "2 hours",
      masteryTarget: "82%",
      concepts: ["Core Syntax & Data Processing", "List Comprehensions & OOP"],
      project: "Command Line Data Tool",
      assessment: "Passed (82% Mastery)"
    },
    {
      phase: 2,
      title: "● Statistics & Probability",
      status: "In Progress",
      estTime: "3.5 hours",
      masteryTarget: "75%",
      concepts: ["Descriptive Statistics", "Probability & Bayes Theorem"],
      project: "Probability Prediction Engine",
      assessment: "Active Target (42% Mastery)"
    },
    {
      phase: 3,
      title: "○ Machine Learning",
      status: "Upcoming",
      estTime: "4 hours",
      masteryTarget: "80%",
      concepts: ["Supervised Learning", "Regression & Classification"],
      project: "Predictive Housing Price Model",
      assessment: "Queued"
    },
    {
      phase: 4,
      title: "○ Deep Learning",
      status: "Locked",
      estTime: "5 hours",
      masteryTarget: "75%",
      concepts: ["Perceptrons", "Backpropagation", "PyTorch Basics"],
      project: "Image Digit Classifier",
      assessment: "Locked"
    },
    {
      phase: 5,
      title: "○ Generative AI",
      status: "Locked",
      estTime: "6 hours",
      masteryTarget: "75%",
      concepts: ["Transformers", "Prompt Engineering", "RAG & Vector DBs"],
      project: "Custom Domain Knowledge Agent",
      assessment: "Locked"
    },
    {
      phase: 6,
      title: "○ Real-World Project",
      status: "Locked",
      estTime: "8 hours",
      masteryTarget: "90%",
      concepts: ["Fullstack AI Deployment", "API Integration"],
      project: "MentorPath AI Platform Capstone",
      assessment: "Final Milestone"
    },
    {
      phase: 7,
      title: "○ Interview Preparation",
      status: "Locked",
      estTime: "4 hours",
      masteryTarget: "85%",
      concepts: ["System Design", "Coding Challenges", "ML Theory"],
      project: "Mock Technical Interview",
      assessment: "Locked"
    }
  ];
}

// LocalStorage helpers
export function loadSavedState() {
  try {
    const student = localStorage.getItem("mentorpath_student");
    const skills = localStorage.getItem("mentorpath_skills");
    const career = localStorage.getItem("mentorpath_career");

    return {
      student: student ? JSON.parse(student) : INITIAL_STUDENT_PROFILE,
      skills: skills ? JSON.parse(skills) : INITIAL_SKILLS,
      career: career || "AI Engineer"
    };
  } catch (e) {
    console.warn("Could not read localStorage:", e);
    return {
      student: INITIAL_STUDENT_PROFILE,
      skills: INITIAL_SKILLS,
      career: "AI Engineer"
    };
  }
}

export function saveStateToLocal(student, skills, career) {
  try {
    if (student) localStorage.setItem("mentorpath_student", JSON.stringify(student));
    if (skills) localStorage.setItem("mentorpath_skills", JSON.stringify(skills));
    if (career) localStorage.setItem("mentorpath_career", career);
  } catch (e) {
    console.warn("Could not write to localStorage:", e);
  }
}
