export interface CandidateMetrics {
  communication: number;
  communicationReason?: string;

  comprehension: number;
  comprehensionReason?: string;

  english: number;
  englishReason?: string;

  interpersonalEQ: number;
  interpersonalEQReason?: string;

  /* DISC profile */
  discD: number;
  discI: number;
  discS: number;
  discC: number;

  latestFeedback: string;
  recommendation: string; // 'Strong Fit' | 'Fit' | 'Potential Fit' | 'No Fit' | 'Pending'
  recommendationReason: string;

  suggestedRole?: string;
  roleFitAnalysis?: string;
  securityAlert?: string;
  potentialConcerns?: string;
  customQuestions?: string;
}

export const INITIAL_METRICS: CandidateMetrics = {
  communication: 0,
  communicationReason: 'Pending assessment...',
  comprehension: 0,
  comprehensionReason: 'Pending assessment...',
  english: 0,
  englishReason: 'Pending assessment...',
  interpersonalEQ: 0,
  interpersonalEQReason: 'Pending assessment...',
  discD: 0,
  discI: 0,
  discS: 0,
  discC: 0,
  latestFeedback: 'Waiting for interview to begin...',
  recommendation: 'Pending',
  recommendationReason: 'Insufficient data to form a recommendation.',
  suggestedRole: 'Pending Analysis',
  roleFitAnalysis: 'Evaluating candidate skills against organizational roles...',
  securityAlert: '',
  potentialConcerns: '',
  customQuestions: ''
};

export interface LogEntry {
  timestamp: string;
  source: string; // 'user' | 'ai' | 'system'
  message: string;
}

export interface MediaDeviceOption {
  deviceId: string;
  label: string;
}

/** Response schema handed to Gemini so it answers with strict JSON. */
export const METRICS_SCHEMA: any = {
  type: 'OBJECT',
  properties: {
    communication: { type: 'NUMBER', description: 'Score 1-5. Structure (STAR/PREP), Signal-to-Noise, Flow.' },
    communicationReason: { type: 'STRING' },
    comprehension: { type: 'NUMBER', description: 'Score 1-5. Addressing multi-part prompts, inferring intent, constraints.' },
    comprehensionReason: { type: 'STRING' },
    english: { type: 'NUMBER', description: 'Score 1-5. Grammar, vocabulary breadth, avoidance of "text-speak".' },
    englishReason: { type: 'STRING' },
    interpersonalEQ: { type: 'NUMBER', description: 'Score 1-5. Self-awareness, social awareness, influence, psychological safety.' },
    interpersonalEQReason: { type: 'STRING' },
    discD: { type: 'NUMBER', description: 'Score 1.0 to 5.0. Dominance.' },
    discI: { type: 'NUMBER', description: 'Score 1.0 to 5.0. Influence.' },
    discS: { type: 'NUMBER', description: 'Score 1.0 to 5.0. Steadiness.' },
    discC: { type: 'NUMBER', description: 'Score 1.0 to 5.0. Conscientiousness.' },
    latestFeedback: { type: 'STRING', description: 'Overall executive summary of the interview.' },
    recommendation: {
      type: 'STRING',
      enum: ['Strong Fit', 'Fit', 'Potential Fit', 'No Fit', 'Pending']
    },
    recommendationReason: { type: 'STRING' },
    suggestedRole: { type: 'STRING' },
    roleFitAnalysis: { type: 'STRING' },
    potentialConcerns: { type: 'STRING' },
    securityAlert: { type: 'STRING', description: 'Any suspicious behavior detected in the video.' },
    customQuestions: { type: 'STRING' }
  },
  required: [
    'communication', 'comprehension', 'english', 'interpersonalEQ',
    'recommendation', 'latestFeedback', 'discD', 'discI', 'discS', 'discC'
  ]
};

export const INTRO_TEXT =
  'Hi, I am the AI Assistant for People Partners. I will be asking 5 questions today, ' +
  'and the interview may take between 5 to 15 minutes. After the interview, an assessment ' +
  'will be shared with the HR Team for further processing.';

export const INTERVIEW_QUESTIONS: string[] = [
  'Walk us through your professional journey by highlighting two or three pivotal decisions you’ve made. Why did you make them, and how have they shaped your current career trajectory?',
  'What is the most difficult professional challenge you’ve solved in the last 12 months? Specifically, what was your unique contribution to the solution, and what was the measurable outcome?',
  'Describe a time you had to rapidly adopt a new technology, software, or complex methodology to stay effective. How did you manage the learning curve, and how did it change your workflow?',
  'Tell us about a time you disagreed with a colleague or leader’s approach. How did you voice your perspective, and how did you ensure the team still achieved its objective despite the friction?',
  'Looking at this role, what is one specific process or area you feel most equipped to improve within your first 90 days, and what would your first step be to initiate that change?'
];

export const OUTRO_TEXT = 'Thank you. We are now ending the interview.';
