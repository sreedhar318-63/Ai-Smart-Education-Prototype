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
      
      {/* HEADER BAR (BURLYWOOD BACKGROUND) */}
      <div className="bg-[#DEB887] border border-[#C59B67] text-[#1A0F05] p-4 md:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-[#8A2BE2] text-white flex items-center justify-center font-bold text-xl shadow-md border border-[#6b1cb9]">
            {activePersonaObj.icon}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-[#1A0F05]">AI Personal Tutor</h1>
              <span className="bg-[#8A2BE2] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase shadow-2xs">
                {activePersonaObj.name}
              </span>
            </div>
            <p className="text-xs text-[#3D2714] font-medium mt-0.5">
              Interactive voice, camera OCR, and Socratic "Teach Me" learning engine.
            </p>
          </div>
        </div>

        {/* MODE SWITCHER PILLS (BISQUE CONTAINER) */}
        <div className="flex items-center space-x-2 bg-[#FFE4C4] p-1.5 rounded-xl border border-[#C59B67] self-start md:self-auto">
          <button
            onClick={() => setMode('tutor')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'tutor'
                ? 'bg-[#8A2BE2] text-white shadow-sm'
                : 'text-[#5C4228] hover:text-[#1A0F05]'
            }`}
          >
            Direct Tutor
          </button>
          <button
            onClick={() => startTeachMeMode('Recursion & Base Cases')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === 'teach_me'
                ? 'bg-[#8A2BE2] text-white shadow-sm'
                : 'text-[#5C4228] hover:text-[#1A0F05]'
            }`}
          >
            🧠 "Teach Me" Socratic
          </button>
        </div>
      </div>

      {/* QUICK SUGGESTED ACTION CARDS (LIGHTBLUE CARDS WITH DARK TEXT) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => handleSend("Explain recursion with a simple real-world analogy and code example.")}
          className="p-3 bg-[#ADD8E6] border border-[#91c4d5] hover:border-[#8A2BE2] rounded-xl text-left transition-all cursor-pointer space-y-1 group shadow-2xs"
        >
          <Lightbulb className="w-4 h-4 text-[#8A2BE2] group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-[#161512]">Explain Recursion</p>
          <p className="text-[10px] text-[#334155] font-semibold">Analogy + Code</p>
        </button>

        <button
          onClick={() => toggleVoiceListen()}
          className={`p-3 border rounded-xl text-left transition-all cursor-pointer space-y-1 group shadow-2xs ${
            isListening
              ? 'bg-[#8A2BE2] border-[#8A2BE2] text-white ring-2 ring-[#8A2BE2]/50'
              : 'bg-[#ADD8E6] border-[#91c4d5] hover:border-[#8A2BE2]'
          }`}
        >
          <Mic className={`w-4 h-4 ${isListening ? 'text-white animate-pulse' : 'text-[#8A2BE2]'}`} />
          <p className={`text-xs font-bold ${isListening ? 'text-white' : 'text-[#161512]'}`}>{isListening ? 'Listening...' : 'Ask by Voice'}</p>
          <p className={`text-[10px] ${isListening ? 'text-white/80' : 'text-[#334155]'} font-semibold`}>Tap to speak</p>
        </button>

        <button
          onClick={() => setIsCameraOpen(true)}
          className="p-3 bg-[#ADD8E6] border border-[#91c4d5] hover:border-[#8A2BE2] rounded-xl text-left transition-all cursor-pointer space-y-1 group shadow-2xs"
        >
          <Camera className="w-4 h-4 text-[#8A2BE2] group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-[#161512]">Scan Question</p>
          <p className="text-[10px] text-[#334155] font-semibold">Learn from Camera</p>
        </button>

        <button
          onClick={() => startTeachMeMode('Python Loops')}
          className="p-3 bg-[#ADD8E6] border border-[#91c4d5] hover:border-[#8A2BE2] rounded-xl text-left transition-all cursor-pointer space-y-1 group shadow-2xs"
        >
          <BookOpen className="w-4 h-4 text-[#8A2BE2] group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-[#161512]">Test My Knowledge</p>
          <p className="text-[10px] text-[#334155] font-semibold">Socratic check</p>
        </button>
      </div>

      {/* CHAT CONTAINER (BISQUE CONTAINER) */}
      <div className="bg-[#FFE4C4] border border-[#E3C6A2] rounded-2xl h-[480px] flex flex-col overflow-hidden shadow-lg">
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-[#FFF8F0]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[90%] ${
                m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs ${
                m.sender === 'user'
                  ? 'bg-[#8A2BE2] text-white'
                  : 'bg-[#DEB887] text-[#1A0F05] border border-[#C59B67]'
              }`}>
                {m.sender === 'user' ? 'You' : activePersonaObj.icon}
              </div>

              {/* CHAT BUBBLES: USER = LIGHTBLUE (#ADD8E6), AI = BISQUE (#FFE4C4) / BURLYWOOD (#DEB887) */}
              <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#ADD8E6] text-[#0F172A] font-semibold rounded-tr-none border border-[#91c4d5]'
                  : 'bg-[#FFE4C4] text-[#1A0F05] border border-[#E3C6A2] rounded-tl-none space-y-2 font-medium'
              }`}>
                <div className="whitespace-pre-wrap">{m.text}</div>

                <div className={`flex items-center justify-between pt-1 border-t mt-2 text-[10px] ${
                  m.sender === 'user' ? 'border-[#91c4d5] text-[#334155]' : 'border-[#E3C6A2] text-[#5C4228]'
                }`}>
                  <span>{m.timestamp}</span>
                  {m.sender === 'ai' && (
                    <button
                      onClick={() => speakText(m.text)}
                      className="hover:text-[#8A2BE2] transition-colors cursor-pointer flex items-center space-x-1 font-bold text-[#8A2BE2]"
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
            <div className="flex items-center space-x-2 text-xs text-[#5A2A00] bg-[#DEB887] border border-[#C59B67] px-4 py-2.5 rounded-xl w-fit font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#8A2BE2] animate-spin" />
              <span>AI Personal Tutor is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT BAR (BURLYWOOD CONTAINER WITH DARK TEXT INPUT) */}
        <div className="p-3 bg-[#DEB887] border-t border-[#C59B67] flex items-center space-x-2">
          <button
            onClick={toggleVoiceListen}
            className={`p-3 rounded-xl transition-all cursor-pointer ${
              isListening
                ? 'bg-[#8A2BE2] text-white animate-pulse'
                : 'bg-[#FFE4C4] text-[#1A0F05] hover:bg-[#8A2BE2] hover:text-white border border-[#C59B67]'
            }`}
            title="Voice input"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsCameraOpen(true)}
            className="p-3 rounded-xl bg-[#FFE4C4] text-[#1A0F05] hover:bg-[#8A2BE2] hover:text-white border border-[#C59B67] transition-colors cursor-pointer"
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
            className="flex-1 bg-[#FFF8F0] border border-[#C59B67] text-[#1A0F05] font-semibold text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[#8A2BE2] placeholder:text-[#5C4228]"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isTyping}
            className="bg-[#8A2BE2] hover:bg-[#7823c6] disabled:opacity-50 text-white p-3 rounded-xl transition-all cursor-pointer font-bold shrink-0 shadow-2xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CAMERA SCAN MODAL */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#FFE4C4] border border-[#C59B67] rounded-2xl p-6 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E3C6A2] pb-3">
              <div className="flex items-center space-x-2 text-[#8A2BE2]">
                <Camera className="w-5 h-5" />
                <h3 className="text-base font-bold text-[#1A0F05]">Learn From Camera</h3>
              </div>
              <button
                onClick={() => setIsCameraOpen(false)}
                className="text-[#5C4228] hover:text-[#1A0F05] p-1 font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PREVIEW OR UPLOAD DROPZONE */}
            {!cameraImage ? (
              <div className="border-2 border-dashed border-[#C59B67] hover:border-[#8A2BE2] rounded-xl p-8 text-center space-y-4 bg-[#FFF8F0] transition-colors">
                <div className="w-12 h-12 rounded-full bg-[#ADD8E6] text-[#8A2BE2] flex items-center justify-center mx-auto border border-[#91c4d5]">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1A0F05]">Take Photo or Upload Image</p>
                  <p className="text-xs text-[#5C4228] mt-1 font-medium">Scan math derivative, Python code error, or textbook concept.</p>
                </div>
                <label className="inline-flex items-center space-x-2 bg-[#8A2BE2] hover:bg-[#7823c6] text-white font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer transition-all shadow-2xs">
                  <span>Browse File</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <img src={cameraImage} alt="Scanned problem preview" className="w-full h-44 object-cover rounded-xl border border-[#C59B67]" />
                {isAnalyzingImage && (
                  <div className="flex items-center justify-center space-x-2 text-xs text-[#8A2BE2] font-bold py-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>OCR Vision AI is analyzing textbook problem...</span>
                  </div>
                )}
              </div>
            )}

            {/* SCAN RESULT PREVIEW */}
            {scanResult && (
              <div className="bg-[#ADD8E6] border border-[#91c4d5] rounded-xl p-4 space-y-3 text-xs text-[#161512]">
                <div className="flex items-center space-x-2 text-[#8A2BE2] font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{scanResult.title}</span>
                </div>
                <p><strong className="text-[#1A0F05]">UNDERSTAND:</strong> {scanResult.understand}</p>
                <p><strong className="text-[#1A0F05]">SOLUTION:</strong> <code className="text-[#8A2BE2] bg-white px-2 py-0.5 rounded font-bold">{scanResult.solution}</code></p>
                <p><strong className="text-[#1A0F05]">WHY:</strong> {scanResult.why}</p>
                <div className="pt-2 border-t border-[#91c4d5]">
                  <button
                    onClick={applyScanResultToChat}
                    className="w-full bg-[#8A2BE2] hover:bg-[#7823c6] text-white font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1 shadow-2xs"
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
