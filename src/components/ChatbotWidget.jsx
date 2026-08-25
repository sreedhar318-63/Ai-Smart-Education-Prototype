import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, Trash2, Bot, User, Code, HelpCircle, AlertCircle, Copy, Check, Minimize2, Maximize2, RefreshCw } from 'lucide-react';
import { generatePersonalizedContent } from '../services/aiService';
import { PERSONAS } from './Navbar';

export default function ChatbotWidget({
 persona,
 onboardingData,
 currentTopic,
 learnerModel,
 isOpen,
 onToggle
}) {
 const activePersonaObj = PERSONAS.find(p => p.id === persona) || PERSONAS[0];

 const [messages, setMessages] = useState([
 {
 id: 'init-1',
 sender: 'mentor',
 text: `Hello! I'm your **${activePersonaObj.name}** AI Mentor ${activePersonaObj.icon}.\n\nGot a doubt or question about **${currentTopic?.title || onboardingData.goal || 'your learning roadmap'}**? Ask me anything—I can give you code examples, analogies, or break down tricky concepts!`,
 timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
 }
 ]);

 const [inputQuery, setInputQuery] = useState('');
 const [isTyping, setIsTyping] = useState(false);
 const [copiedCodeId, setCopiedCodeId] = useState(null);
 const messagesEndRef = useRef(null);
 const inputRef = useRef(null);

 // Auto-scroll to bottom of chat when new messages arrive
 const scrollToBottom = () => {
 messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
 };

 useEffect(() => {
 if (isOpen) {
 scrollToBottom();
 // Focus input field on open
 setTimeout(() => inputRef.current?.focus(), 150);
 }
 }, [messages, isOpen]);

 // Update initial message tone if persona changes and chat has only 1 message
 useEffect(() => {
 if (messages.length === 1 && messages[0].id === 'init-1') {
 setMessages([
 {
 id: 'init-1',
 sender: 'mentor',
 text: `Hello! I'm your **${activePersonaObj.name}** AI Mentor ${activePersonaObj.icon}.\n\nGot a doubt or question about **${currentTopic?.title || onboardingData.goal || 'your learning roadmap'}**? Ask me anything—I can give you code examples, analogies, or break down tricky concepts!`,
 timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
 }
 ]);
 }
 }, [persona, currentTopic?.id]);

 // Suggested Doubt Prompt Pills
 const suggestedDoubts = [
 { label: '💡 Practical Code Example', text: `Can you show me a practical code example for ${currentTopic?.title || onboardingData.goal}?` },
 { label: '❓ Why use this pattern?', text: `Why is ${currentTopic?.title || 'this approach'} preferred over legacy alternatives?` },
 { label: '⚠️ Common Bugs & Pitfalls', text: `What are common real-world bugs or mistakes developers make with ${currentTopic?.title || onboardingData.goal}?` },
 { label: `🍳 Explain with ${onboardingData?.domain || 'cooking'} analogy`, text: `Can you explain ${currentTopic?.title || onboardingData.goal} using a ${onboardingData?.domain || 'cooking'} analogy?` }
 ];

 // Send doubt query to AI Mentor
 const handleSendMessage = async (queryText) => {
 const textToSend = queryText || inputQuery;
 if (!textToSend.trim() || isTyping) return;

 const userMsgId = 'msg-' + Date.now();
 const userMessage = {
 id: userMsgId,
 sender: 'user',
 text: textToSend.trim(),
 timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
 };

 setMessages(prev => [...prev, userMessage]);
 setInputQuery('');
 setIsTyping(true);

 try {
 const systemPrompt = `${activePersonaObj.systemPrompt}\n\nYou are an AI Doubts Resolution Chatbot for MentorPath. The learner is working on goal "${onboardingData.goal}" with domain analogy "${onboardingData.domain}". Current topic: "${currentTopic?.title || 'General Roadmap'}". Answer their doubt directly, concisely, and helpfully with code snippets or bullet points where appropriate.`;

 const userPrompt = textToSend.trim();

 const aiResponse = await generatePersonalizedContent({
 type: 'doubt_resolution',
 systemPrompt,
 userPrompt,
 learnerModel,
 context: {
 topicName: currentTopic?.title || onboardingData.goal,
 goal: onboardingData.goal,
 domain: onboardingData.domain,
 persona: persona,
 learnerModel
 }
 });

 let responseText = '';
 if (typeof aiResponse === 'object') {
 responseText = aiResponse.body || aiResponse.text || JSON.stringify(aiResponse);
 } else {
 responseText = aiResponse;
 }

 const mentorMessage = {
 id: 'msg-' + (Date.now() + 1),
 sender: 'mentor',
 text: responseText,
 timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
 };

 setMessages(prev => [...prev, mentorMessage]);
 } catch (err) {
 console.error('Failed to resolve doubt:', err);
 setMessages(prev => [
 ...prev,
 {
 id: 'msg-err-' + Date.now(),
 sender: 'mentor',
 text: `⚠️ Sorry, I encountered an issue connecting to the AI doubt resolution service. Please try again!`,
 timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
 }
 ]);
 } finally {
 setIsTyping(false);
 }
 };

 // Handle Form Submission
 const handleSubmit = (e) => {
 e.preventDefault();
 handleSendMessage();
 };

 // Clear chat history
 const handleClearChat = () => {
 setMessages([
 {
 id: 'init-' + Date.now(),
 sender: 'mentor',
 text: `Chat cleared! How else can I assist you with **${currentTopic?.title || onboardingData.goal}**?`,
 timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
 }
 ]);
 };

 // Helper to copy code block to clipboard
 const handleCopyCode = (codeText, blockId) => {
 navigator.clipboard.writeText(codeText);
 setCopiedCodeId(blockId);
 setTimeout(() => setCopiedCodeId(null), 2000);
 };

 // Rich formatting renderer for mentor messages (renders code blocks, bold, lists, quotes cleanly)
 const renderFormattedText = (text, messageId) => {
 if (!text) return null;

 // Check for markdown code blocks ```js ... ```
 const codeBlockRegex = /```(?:[a-z]+)?\n([\s\S]*?)```/g;
 const parts = [];
 let lastIndex = 0;
 let match;

 while ((match = codeBlockRegex.exec(text)) !== null) {
 // Text before code block
 if (match.index > lastIndex) {
 parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
 }
 // Code block
 parts.push({ type: 'code', content: match[1].trim() });
 lastIndex = match.index + match[0].length;
 }

 if (lastIndex < text.length) {
 parts.push({ type: 'text', content: text.substring(lastIndex) });
 }

 return (
 <div className="space-y-3">
 {parts.map((part, pIdx) => {
 if (part.type === 'code') {
 const blockId = `${messageId}-code-${pIdx}`;
 return (
 <div key={blockId} className="relative my-2 rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden text-xs">
 <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-950/80 border-b border-neutral-800 text-neutral-400 font-mono-code text-[11px]">
 <span>Code Snippet</span>
 <button
 onClick={() => handleCopyCode(part.content, blockId)}
 className="flex items-center space-x-1 text-neutral-300 hover:text-warning-300 transition-colors cursor-pointer"
 >
 {copiedCodeId === blockId ? (
 <>
 <Check className="w-3.5 h-3.5 text-success-400" />
 <span className="text-success-400">Copied!</span>
 </>
 ) : (
 <>
 <Copy className="w-3.5 h-3.5" />
 <span>Copy</span>
 </>
 )}
 </button>
 </div>
 <pre className="p-3.5 text-warning-200 font-mono-code leading-relaxed overflow-x-auto whitespace-pre">
 <code>{part.content}</code>
 </pre>
 </div>
 );
 }

 // Format regular text lines (bold, bullet points, quotes)
 const lines = part.content.split('\n');
 return (
 <div key={pIdx} className="space-y-1.5">
 {lines.map((line, lIdx) => {
 if (!line.trim()) return <div key={lIdx} className="h-1" />;
 
 // Bullet points
 if (line.trim().startsWith('•') || line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
 const content = line.trim().replace(/^[•\-*]\s*/, '');
 return (
 <div key={lIdx} className="flex items-start space-x-2 pl-1">
 <span className="text-warning-600 font-bold shrink-0">•</span>
 <span>{renderInlineMarkdown(content)}</span>
 </div>
 );
 }

 // Blockquotes
 if (line.trim().startsWith('>')) {
 const content = line.trim().replace(/^>\s*/, '');
 return (
 <div key={lIdx} className="border-l-3 border-warning-600 bg-warning-50/60 p-2.5 rounded-r-xl italic text-neutral-800 text-[12px] my-1">
 {renderInlineMarkdown(content)}
 </div>
 );
 }

 return <p key={lIdx} className="leading-relaxed">{renderInlineMarkdown(line)}</p>;
 })}
 </div>
 );
 })}
 </div>
 );
 };

 // Simple inline markdown renderer for **bold**, *italic*, and `code`
 const renderInlineMarkdown = (textStr) => {
 // Replace **bold** with <strong>
 const boldParts = textStr.split(/(\*\*.*?\*\*)/g);
 return boldParts.map((part, i) => {
 if (part.startsWith('**') && part.endsWith('**')) {
 return <strong key={i} className="font-bold text-neutral-900">{part.slice(2, -2)}</strong>;
 }
 // Replace `code` with inline code tag
 const codeParts = part.split(/(`.*?`)/g);
 return codeParts.map((cPart, j) => {
 if (cPart.startsWith('`') && cPart.endsWith('`')) {
 return (
 <code key={j} className="bg-neutral-100 text-warning-900 border border-neutral-200 font-mono-code text-[11px] px-1.5 py-0.5 rounded-md">
 {cPart.slice(1, -1)}
 </code>
 );
 }
 return cPart;
 });
 });
 };

 return (
 <>
 {/* FLOATING LAUNCHER BUTTON (ALWAYS VISIBLE AT BOTTOM-RIGHT) */}
 {!isOpen && (
 <button
 onClick={onToggle}
 className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 bg-[#DEB887] hover:bg-[#DDB480] text-[#1A0F05] px-4 py-3 rounded-full border border-[#C59B67] transition-all duration-300 transform hover:scale-105 cursor-pointer group shadow-lg"
 title="Ask AI Mentor a Doubt"
 >
 <div className="relative">
 <div className="w-8 h-8 rounded-full bg-[#F5E2C8] text-[#5A2A00] flex items-center justify-center border border-[#C59B67]">
 <MessageSquare className="w-4 h-4 text-[#5A2A00] group-hover:rotate-12 transition-transform" />
 </div>
 <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#8A2BE2] rounded-full border-2 border-[#DEB887] animate-pulse"></span>
 </div>
 <div className="text-left pr-1">
 <span className="block text-xs font-bold leading-tight text-[#1A0F05]">Clear Doubts</span>
 <span className="block text-[10px] text-[#5C4228] font-medium">AI {activePersonaObj.name} {activePersonaObj.icon}</span>
 </div>
 </button>
 )}

 {/* EXPANDED CHATBOT MODAL / DRAWER */}
 {isOpen && (
 <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-[94vw] sm:w-[440px] h-[580px] max-h-[85vh] bg-neutral-100 rounded-lg border border-neutral-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 font-sans">
 
 {/* HEADER */}
 <div className="bg-neutral-900 text-neutral-100 px-5 py-3.5 flex items-center justify-between border-b border-neutral-800">
 <div className="flex items-center space-x-3">
 <div className="relative">
 <div className="w-9 h-9 rounded-lg bg-warning-600 text-neutral-50 flex items-center justify-center font-bold text-base ">
 {activePersonaObj.icon}
 </div>
 <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success-400 rounded-full border-2 border-neutral-900"></span>
 </div>
 <div>
 <div className="flex items-center space-x-1.5">
 <h3 className="font-editorial text-base font-bold text-neutral-50 leading-tight">
 AI Doubt Solver
 </h3>
 <span className="bg-warning-500/20 text-warning-300 border border-warning-500/30 text-[10px] px-2 py-0.5 rounded-full font-semibold">
 {activePersonaObj.name}
 </span>
 </div>
 <p className="text-[11px] text-neutral-400 truncate max-w-[210px]">
 Topic: <strong className="text-neutral-200">{currentTopic?.title || onboardingData.goal}</strong>
 </p>
 </div>
 </div>

 <div className="flex items-center space-x-1">
 <button
 onClick={handleClearChat}
 className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-50 hover:bg-neutral-800 transition-colors cursor-pointer"
 title="Clear Chat History"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 <button
 onClick={onToggle}
 className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-50 hover:bg-neutral-800 transition-colors cursor-pointer"
 title="Minimize Chatbot"
 >
 <X className="w-5 h-5" />
 </button>
 </div>
 </div>

 {/* CHAT MESSAGES BODY */}
 <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FCFBF9]">
 
 {messages.map((msg) => (
 <div
 key={msg.id}
 className={`flex gap-2.5 max-w-[90%] ${
 msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
 }`}
 >
 {/* Avatar */}
 <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
 msg.sender === 'user'
 ? 'bg-warning-700 text-neutral-50'
 : 'bg-neutral-900 text-warning-300 border border-neutral-800'
 }`}>
 {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : activePersonaObj.icon}
 </div>

 {/* Message Bubble */}
 <div className={`rounded-lg px-4 py-3 text-xs ${
 msg.sender === 'user'
 ? 'bg-warning-700 text-neutral-50 font-medium rounded-tr-none '
 : 'bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-tl-none space-y-2'
 }`}>
 {msg.sender === 'user' ? (
 <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
 ) : (
 renderFormattedText(msg.text, msg.id)
 )}
 
 <span className={`block text-[10px] mt-1 text-right ${
 msg.sender === 'user' ? 'text-warning-200/80' : 'text-neutral-400'
 }`}>
 {msg.timestamp}
 </span>
 </div>
 </div>
 ))}

 {/* TYPING INDICATOR */}
 {isTyping && (
 <div className="flex gap-2.5 max-w-[80%] mr-auto items-center">
 <div className="w-7 h-7 rounded-lg bg-neutral-900 text-warning-300 flex items-center justify-center shrink-0 text-xs ">
 {activePersonaObj.icon}
 </div>
 <div className="bg-neutral-100 border border-neutral-200 rounded-lg rounded-tl-none px-4 py-3 text-xs flex items-center space-x-2">
 <span className="text-neutral-500 font-medium">{activePersonaObj.name} is thinking</span>
 <div className="flex space-x-1">
 <span className="w-1.5 h-1.5 bg-warning-600 rounded-full animate-bounce"></span>
 <span className="w-1.5 h-1.5 bg-warning-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
 <span className="w-1.5 h-1.5 bg-warning-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
 </div>
 </div>
 </div>
 )}

 <div ref={messagesEndRef} />
 </div>

 {/* SUGGESTED DOUBT PILLS */}
 <div className="px-3 py-2 bg-neutral-100 border-t border-neutral-100 overflow-x-auto whitespace-nowrap scrollbar-none flex space-x-2">
 {suggestedDoubts.map((s, idx) => (
 <button
 key={idx}
 onClick={() => handleSendMessage(s.text)}
 disabled={isTyping}
 className="shrink-0 bg-neutral-100 hover:bg-warning-100 text-neutral-700 hover:text-warning-900 border border-neutral-200 hover:border-warning-300 text-[11px] px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer disabled:opacity-50"
 >
 {s.label}
 </button>
 ))}
 </div>

 {/* INPUT FORM */}
 <form onSubmit={handleSubmit} className="p-3 bg-neutral-100 border-t border-neutral-200 flex items-center space-x-2">
 <input
 ref={inputRef}
 type="text"
 value={inputQuery}
 onChange={(e) => setInputQuery(e.target.value)}
 placeholder={`Ask a doubt about ${currentTopic?.title || 'your goal'}...`}
 disabled={isTyping}
 className="flex-1 bg-neutral-50 border border-neutral-300 focus:border-warning-600 focus:bg-neutral-100 text-neutral-900 text-xs rounded-lg px-3.5 py-2.5 focus:outline-hidden transition-all placeholder:text-neutral-400"
 />

 <button
 type="submit"
 disabled={!inputQuery.trim() || isTyping}
 className="bg-neutral-900 hover:bg-warning-700 disabled:bg-neutral-300 text-neutral-50 p-2.5 rounded-lg transition-colors cursor-pointer shrink-0"
 title="Send doubt message"
 >
 <Send className="w-4 h-4" />
 </button>
 </form>

 </div>
 )}
 </>
 );
}
