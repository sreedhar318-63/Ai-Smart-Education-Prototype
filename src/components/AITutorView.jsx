import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Mic, MicOff, Camera, Upload, Send, Sparkles, Volume2, VolumeX,
  BookOpen, HelpCircle, Code, Lightbulb, CheckCircle2, ArrowRight, RefreshCw, X
} from 'lucide-react';
import { generatePersonalizedContent } from '../services/aiService';
import { voiceService } from '../services/voiceService';
import { analyzeQuestionImage } from '../services/visionService';
import { PERSONAS } from './Navbar';

export default function AITutorView({
  studentProfile,
  persona = 'Patient Teacher',
  onboardingData,
  learnerModel,
  onNavigate
}) {
  const activePersonaObj = PERSONAS.find(p => p.id === persona) || PERSONAS[0];

  const [mode, setMode] = useState('tutor'); // 'tutor' | 'teach_me' (Socratic)
  const tutorGreeting = (studentProfile?.name && studentProfile.name !== 'Sreedhar')
    ? `Hi ${studentProfile.name}!`
    : `Hi!`;

  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'ai',
      text: `${tutorGreeting} I'm your AI Personal Tutor ${activePersonaObj.icon}.\n\nYou can ask me to explain any topic, click **🎤 Speak** to ask by voice, or **📷 Learn from Camera** to scan a textbook question!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Teach Me Socratic State
  const [socraticTopic, setSocraticTopic] = useState('Recursion & Base Cases');
  const [socraticStep, setSocraticStep] = useState(1);

  // Camera / Scan Modal State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraImage, setCameraImage] = useState(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Voice Speech-to-Text Toggle
  const toggleVoiceListen = () => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      voiceService.startListening(
        (transcript) => {
          setInputQuery(transcript);
        },
        (err) => {
          setIsListening(false);
          alert(err);
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  // Text-to-Speech Read Aloud
  const speakText = (text) => {
    if (isSpeaking) {
      voiceService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      voiceService.speak(text, () => setIsSpeaking(false));
    }
  };

  // Send query to AI
  const handleSend = async (customText = null) => {
    const query = customText || inputQuery;
    if (!query.trim() || isTyping) return;

    const userMsg = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      if (mode === 'teach_me') {
        // Socratic mode
        const aiResponse = await generatePersonalizedContent({
          type: 'doubt_resolution',
          systemPrompt: `You are an expert Socratic tutor. The student responded: "${query}" to your question about "${socraticTopic}". Evaluate their understanding, compliment what they got right, correct any misconception, and then build on it with a brief follow-up question.`,
          userPrompt: query,
          learnerModel,
          context: { topicName: socraticTopic, persona: 'Socratic Questioner', domain: onboardingData?.domain || 'cooking' }
        });

        const replyText = typeof aiResponse === 'object' ? aiResponse.body || JSON.stringify(aiResponse) : aiResponse;
        setMessages(prev => [
          ...prev,
          {
            id: 'ai-' + Date.now(),
            sender: 'ai',
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setSocraticStep(prev => prev + 1);
      } else {
        // Tutor mode with structured response format
        const aiResponse = await generatePersonalizedContent({
          type: 'doubt_resolution',
          systemPrompt: `You are an AI Personal Tutor. Give a structured response with 1. Simple Explanation, 2. Analogy (${onboardingData?.domain || 'cooking'}), 3. Code/Example, 4. Check Question.`,
          userPrompt: query,
          learnerModel,
          context: { topicName: onboardingData?.goal || 'AI Engineering', persona, domain: onboardingData?.domain || 'cooking' }
        });

        const replyText = typeof aiResponse === 'object' ? aiResponse.body || JSON.stringify(aiResponse) : aiResponse;
        setMessages(prev => [
          ...prev,
          {
            id: 'ai-' + Date.now(),
            sender: 'ai',
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  // Start "Teach Me" Socratic Session
  const startTeachMeMode = (topicName) => {
    setMode('teach_me');
    setSocraticTopic(topicName);
    setSocraticStep(1);
    setMessages([
      {
        id: 'socratic-init',
        sender: 'ai',
        text: `🧠 **Socratic "Teach Me" Mode Activated**\n\nLet's test your understanding of **${topicName}**.\n\n**Question for you:** What do you already understand about how ${topicName} works? (Answer in your own words!)`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Image Upload / Camera Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target.result;
      setCameraImage(dataUrl);
      setIsAnalyzingImage(true);

      const result = await analyzeQuestionImage(dataUrl, "Find derivative of x^2");
      setScanResult(result);
      setIsAnalyzingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const applyScanResultToChat = () => {
    if (!scanResult) return;
    setIsCameraOpen(false);

    const formattedText = `📷 **Scanned Problem Solution: ${scanResult.title}**\n\n` +
      `### UNDERSTAND\n${scanResult.understand}\n\n` +
      `### SOLUTION\n\`\`\`\n${scanResult.solution}\n\`\`\`\n\n` +
      `### WHY\n${scanResult.why}\n\n` +
      `### TRY THIS\n${scanResult.tryThis}`;

    setMessages(prev => [
      ...prev,
      {
        id: 'scan-' + Date.now(),
        sender: 'ai',
        text: formattedText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setScanResult(null);
    setCameraImage(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-4 font-sans animate-in fade-in duration-300">
      
      {/* HEADER BAR */}
      <div className="bg-neutral-900 border border-neutral-800 text-neutral-50 p-4 md:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold text-xl shadow-lg">
            {activePersonaObj.icon}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-neutral-50">AI Personal Tutor</h1>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase">
                {activePersonaObj.name}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Interactive voice, camera OCR, and Socratic "Teach Me" learning engine.
            </p>
          </div>
        </div>

        {/* MODE SWITCHER PILLS */}
        <div className="flex items-center space-x-2 bg-neutral-950 p-1.5 rounded-xl border border-neutral-800 self-start md:self-auto">
          <button
            onClick={() => setMode('tutor')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'tutor'
                ? 'bg-amber-500 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Direct Tutor
          </button>
          <button
            onClick={() => startTeachMeMode('Recursion & Base Cases')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'teach_me'
                ? 'bg-amber-500 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            🧠 "Teach Me" Socratic
          </button>
        </div>
      </div>

      {/* QUICK SUGGESTED ACTION CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => handleSend("Explain recursion with a simple real-world analogy and code example.")}
          className="p-3 bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-xl text-left transition-all cursor-pointer space-y-1 group"
        >
          <Lightbulb className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-neutral-100">Explain Recursion</p>
          <p className="text-[10px] text-neutral-400">Analogy + Code</p>
        </button>

        <button
          onClick={() => toggleVoiceListen()}
          className={`p-3 border rounded-xl text-left transition-all cursor-pointer space-y-1 group ${
            isListening
              ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/50'
              : 'bg-neutral-900 border-neutral-800 hover:border-amber-500/50'
          }`}
        >
          <Mic className={`w-4 h-4 ${isListening ? 'text-amber-400 animate-pulse' : 'text-amber-400'}`} />
          <p className="text-xs font-bold text-neutral-100">{isListening ? 'Listening...' : 'Ask by Voice'}</p>
          <p className="text-[10px] text-neutral-400">Tap to speak</p>
        </button>

        <button
          onClick={() => setIsCameraOpen(true)}
          className="p-3 bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-xl text-left transition-all cursor-pointer space-y-1 group"
        >
          <Camera className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-neutral-100">Scan Question</p>
          <p className="text-[10px] text-neutral-400">Learn from Camera</p>
        </button>

        <button
          onClick={() => startTeachMeMode('Python Loops')}
          className="p-3 bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-xl text-left transition-all cursor-pointer space-y-1 group"
        >
          <BookOpen className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-neutral-100">Test My Knowledge</p>
          <p className="text-[10px] text-neutral-400">Socratic check</p>
        </button>
      </div>

      {/* CHAT CONTAINER */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl h-[480px] flex flex-col overflow-hidden shadow-2xl">
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-neutral-950/40">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[90%] ${
                m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                m.sender === 'user'
                  ? 'bg-amber-500 text-neutral-950'
                  : 'bg-neutral-800 text-amber-400 border border-neutral-700'
              }`}>
                {m.sender === 'user' ? 'You' : activePersonaObj.icon}
              </div>

              <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-amber-500 text-neutral-950 font-medium rounded-tr-none'
                  : 'bg-neutral-900 text-neutral-200 border border-neutral-800 rounded-tl-none space-y-2'
              }`}>
                <div className="whitespace-pre-wrap">{m.text}</div>

                <div className="flex items-center justify-between pt-1 border-t border-neutral-800/40 mt-2 text-[10px] text-neutral-400">
                  <span>{m.timestamp}</span>
                  {m.sender === 'ai' && (
                    <button
                      onClick={() => speakText(m.text)}
                      className="hover:text-amber-400 transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Read Aloud</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-xs text-neutral-400 bg-neutral-900 border border-neutral-800 px-4 py-2.5 rounded-xl w-fit">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>AI Personal Tutor is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT BAR */}
        <div className="p-3 bg-neutral-900 border-t border-neutral-800 flex items-center space-x-2">
          <button
            onClick={toggleVoiceListen}
            className={`p-3 rounded-xl transition-all cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-neutral-800 text-neutral-300 hover:text-amber-400 hover:bg-neutral-700'
            }`}
            title="Voice input"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsCameraOpen(true)}
            className="p-3 rounded-xl bg-neutral-800 text-neutral-300 hover:text-amber-400 hover:bg-neutral-700 transition-colors cursor-pointer"
            title="Camera scan"
          >
            <Camera className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              mode === 'teach_me'
                ? `Answer step ${socraticStep}: What do you understand about ${socraticTopic}?`
                : "Ask AI Tutor a question..."
            }
            className="flex-1 bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 placeholder:text-neutral-500"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isTyping}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 p-3 rounded-xl transition-all cursor-pointer font-bold shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CAMERA SCAN MODAL */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center space-x-2 text-amber-400">
                <Camera className="w-5 h-5" />
                <h3 className="text-base font-bold text-neutral-50">Learn From Camera</h3>
              </div>
              <button
                onClick={() => setIsCameraOpen(false)}
                className="text-neutral-400 hover:text-neutral-100 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PREVIEW OR UPLOAD DROPZONE */}
            {!cameraImage ? (
              <div className="border-2 border-dashed border-neutral-700 hover:border-amber-500/60 rounded-xl p-8 text-center space-y-4 bg-neutral-950/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-200">Take Photo or Upload Image</p>
                  <p className="text-xs text-neutral-400 mt-1">Scan math derivative, Python code error, or textbook concept.</p>
                </div>
                <label className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer transition-all">
                  <span>Browse File</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <img src={cameraImage} alt="Scanned problem preview" className="w-full h-44 object-cover rounded-xl border border-neutral-800" />
                {isAnalyzingImage && (
                  <div className="flex items-center justify-center space-x-2 text-xs text-amber-400 py-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>OCR Vision AI is analyzing textbook problem...</span>
                  </div>
                )}
              </div>
            )}

            {/* SCAN RESULT PREVIEW */}
            {scanResult && (
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3 text-xs text-neutral-200">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{scanResult.title}</span>
                </div>
                <p><strong>UNDERSTAND:</strong> {scanResult.understand}</p>
                <p><strong>SOLUTION:</strong> <code className="text-amber-300 bg-neutral-900 px-2 py-0.5 rounded">{scanResult.solution}</code></p>
                <p><strong>WHY:</strong> {scanResult.why}</p>
                <div className="pt-2 border-t border-neutral-800">
                  <button
                    onClick={applyScanResultToChat}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1"
                  >
                    <span>Import Explanation into Chat</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
