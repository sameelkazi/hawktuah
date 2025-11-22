
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, Activity, Cpu, Network, Send, Sparkles, 
  Zap, Globe, ShieldAlert, Terminal, Fingerprint, Image as ImageIcon, Loader2, Maximize2
} from 'lucide-react';
import { ShimmerButton } from '../components/ui/ShimmerButton';
import Card from '../components/ui/Card';
import { useData } from '../context/DataContext';
import { generateAIResponse, generateMarketingImage } from '../services/ai';

// --- NEURAL CANVAS COMPONENT ---
const NeuralGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const particles: { x: number, y: number, vx: number, vy: number, size: number }[] = [];
    const particleCount = 60;
    const connectionDistance = 150;
    let mouse = { x: -1000, y: -1000 };

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse repulsion/attraction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 200) {
            p.x -= dx * 0.01;
            p.y -= dy * 0.01;
        }

        // Draw particle
        ctx.fillStyle = 'rgba(139, 92, 246, 0.5)'; // Violet-500
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect particles
        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < connectionDistance) {
                ctx.strokeStyle = `rgba(139, 92, 246, ${1 - dist/connectionDistance})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-30" />;
};

type Message = {
    role: 'user' | 'ai';
    text?: string;
    image?: string;
    grounding?: any[];
};

const Nexus: React.FC = () => {
  const { products, kpi, operations, simulateScenario } = useData();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'NEXUS Link established. Neural Core online. I have full access to your real-time inventory. Initiating secure handshake...' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'Stable' | 'Critical' | 'Optimizing'>('Stable');
  const [activeMode, setActiveMode] = useState<'analysis' | 'visuals'>('analysis');
  const [useSearch, setUseSearch] = useState(false);
  
  // Image Config State
  const [imgRatio, setImgRatio] = useState('1:1');
  const [imgSize, setImgSize] = useState('1K');

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const buildSystemContext = () => {
    const productSummary = products.slice(0, 10).map(p => `${p.name} (${p.stock} in stock)`).join(', ');
    const lowStock = products.filter(p => p.stock <= p.minStock).map(p => p.name).join(', ');
    
    return `
      You are NEXUS, a hyper-intelligent supply chain AI.
      Current System Time: ${new Date().toLocaleString()}
      
      REAL-TIME INVENTORY DATA:
      - Total Value: $${kpi.totalValue.toLocaleString()}
      - Total SKUs: ${kpi.totalProducts}
      - Pending Receipts: ${kpi.pendingReceipts}
      - Pending Deliveries: ${kpi.pendingDeliveries}
      - Low Stock Alerts: ${kpi.lowStockItems} ${lowStock ? `(${lowStock})` : ''}
      
      Sample Products: ${productSummary}...
      
      If the user asks about "market crash" or "viral surge", explain that these are simulation modes available in the dashboard.
      Be concise, futuristic, and professional. Use Markdown for formatting.
    `;
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
        if (activeMode === 'analysis') {
            const response = await generateAIResponse(userMsg, {
                useSearch,
                systemInstruction: buildSystemContext()
            });

            setMessages(prev => [...prev, { 
                role: 'ai', 
                text: response.text,
                grounding: response.grounding
            }]);
        } else {
            // Visuals Mode
            const imageBase64 = await generateMarketingImage(userMsg, {
                aspectRatio: imgRatio,
                imageSize: imgSize
            });
            
            setMessages(prev => [...prev, {
                role: 'ai',
                text: `Render complete. Specs: ${imgSize} | ${imgRatio}`,
                image: imageBase64
            }]);
        }
    } catch (error) {
        setMessages(prev => [...prev, { role: 'ai', text: 'ERROR: Neural Link Disrupted. API Connection Failed.' }]);
    } finally {
        setIsTyping(false);
    }
  };

  const triggerSimulation = (mode: 'crash' | 'viral' | 'hack') => {
    setSystemStatus('Critical');
    simulateScenario(mode);
    setMessages(prev => [...prev, { role: 'ai', text: `WARNING: INITIATING ${mode.toUpperCase()} SCENARIO. Real-time database values have been modified. Check Dashboard for impact analysis.` }]);
    
    setTimeout(() => setSystemStatus('Stable'), 5000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden -m-4 md:-m-8 bg-[#020617] text-white font-mono selection:bg-violet-500/30">
      <NeuralGrid />
      
      {/* Overlay Gradient */}
      <div className="fixed inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/50 pointer-events-none z-0" />

      {/* Main Container */}
      <div className="relative z-10 p-6 md:p-12 h-screen flex flex-col">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8 border-b border-violet-500/20 pb-4">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-violet-500 blur animate-pulse"></div>
                    <BrainCircuit size={32} className="relative text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                        NEXUS CORE <span className="text-[10px] px-2 py-0.5 border border-violet-500/50 rounded bg-violet-500/10 text-violet-300 tracking-widest">V.9.0.1</span>
                    </h1>
                    <p className="text-xs text-violet-400/60 tracking-[0.2em]">GEMINI POWERED SUPPLY CHAIN ORCHESTRATION</p>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="text-right hidden md:block">
                    <div className="text-xs text-gray-500">SYSTEM STATUS</div>
                    <div className={`font-bold ${systemStatus === 'Stable' ? 'text-green-400' : 'text-red-500 animate-pulse'}`}>{systemStatus.toUpperCase()}</div>
                </div>
                <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 w-2/3 animate-pulse"></div>
                </div>
            </div>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
            
            {/* Left Col: Visualization & Tools */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Mode Switcher */}
                <div className="grid grid-cols-2 gap-4 p-1 bg-white/5 rounded-2xl border border-white/10">
                    <button 
                        onClick={() => setActiveMode('analysis')}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${activeMode === 'analysis' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'hover:bg-white/5 text-gray-400'}`}
                    >
                        <Cpu size={18} />
                        <span className="font-bold">Data Analysis</span>
                    </button>
                    <button 
                        onClick={() => setActiveMode('visuals')}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${activeMode === 'visuals' ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/20' : 'hover:bg-white/5 text-gray-400'}`}
                    >
                        <ImageIcon size={18} />
                        <span className="font-bold">Visualizer</span>
                    </button>
                </div>

                {/* The Core Visualization */}
                <div className="flex-1 relative rounded-3xl border border-violet-500/20 bg-[#0a0a1f]/80 backdrop-blur-xl overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
                    
                    {/* Dynamic Center Visual based on Mode */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        {activeMode === 'analysis' ? (
                             <div className={`relative w-64 h-64 rounded-full border border-violet-500/30 flex items-center justify-center transition-all duration-1000 ${systemStatus === 'Critical' ? 'scale-110 border-red-500/50' : ''}`}>
                                <div className="absolute inset-0 rounded-full border-t-2 border-violet-500 animate-spin-around" style={{ animationDuration: '3s' }}></div>
                                <div className="absolute inset-4 rounded-full border-r-2 border-fuchsia-500 animate-spin-around" style={{ animationDuration: '5s', animationDirection: 'reverse' }}></div>
                                <div className="absolute inset-0 bg-violet-500/5 blur-3xl rounded-full"></div>
                                <div className="text-center z-10">
                                    <div className="text-4xl font-bold text-white tabular-nums">
                                        {systemStatus === 'Critical' ? 'CRITICAL' : '98.4%'}
                                    </div>
                                    <div className="text-xs text-violet-400 tracking-widest mt-1">OPTIMIZATION</div>
                                </div>
                            </div>
                        ) : (
                             <div className="relative w-full h-full flex items-center justify-center p-10">
                                <div className="grid grid-cols-2 gap-4 w-full max-w-md opacity-50">
                                    <div className="aspect-square rounded-lg border border-fuchsia-500/30 bg-fuchsia-500/5 animate-pulse"></div>
                                    <div className="aspect-square rounded-lg border border-fuchsia-500/30 bg-fuchsia-500/5 animate-pulse delay-100"></div>
                                    <div className="aspect-square rounded-lg border border-fuchsia-500/30 bg-fuchsia-500/5 animate-pulse delay-200"></div>
                                    <div className="aspect-square rounded-lg border border-fuchsia-500/30 bg-fuchsia-500/5 animate-pulse delay-300"></div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center text-fuchsia-300 font-bold tracking-widest">
                                    CREATIVE ENGINE STANDBY
                                </div>
                             </div>
                        )}
                    </div>

                    {/* Stats Overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end">
                        <div>
                            <div className="text-xs text-gray-400 mb-1">ACTIVE MODEL</div>
                            <div className="text-sm font-bold text-white flex items-center gap-2">
                                <Sparkles size={14} className={activeMode === 'visuals' ? 'text-fuchsia-400' : 'text-violet-400'} />
                                {activeMode === 'analysis' ? 'Gemini 2.5 Flash' : 'Gemini 3 Pro Image'}
                            </div>
                        </div>
                        {activeMode === 'analysis' && (
                             <div className="text-right">
                                <div className="text-xs text-gray-400 mb-1">INVENTORY VALUE</div>
                                <div className="text-xl font-mono font-bold text-white">${kpi.totalValue.toLocaleString()}</div>
                             </div>
                        )}
                    </div>
                </div>

                {/* Control Deck */}
                <div className="grid grid-cols-3 gap-4">
                    <ShimmerButton
                        onClick={() => triggerSimulation('crash')}
                        background="#0f172a"
                        className="h-24 border border-white/10 hover:border-red-500/50 transition-colors"
                        shimmerColor="#ef4444"
                        borderRadius="1rem"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <ShieldAlert size={24} className="text-red-500" />
                            <span className="text-xs font-bold tracking-wider text-center">MARKET CRASH</span>
                        </div>
                    </ShimmerButton>
                    
                    <ShimmerButton
                        onClick={() => triggerSimulation('viral')}
                        background="#0f172a"
                        className="h-24 border border-white/10 hover:border-amber-500/50 transition-colors"
                        shimmerColor="#f59e0b"
                        borderRadius="1rem"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <Zap size={24} className="text-amber-500" />
                            <span className="text-xs font-bold tracking-wider text-center">VIRAL SURGE</span>
                        </div>
                    </ShimmerButton>

                    <ShimmerButton
                        onClick={() => triggerSimulation('hack')}
                        background="#0f172a"
                        className="h-24 border border-white/10 hover:border-cyan-500/50 transition-colors"
                        shimmerColor="#06b6d4"
                        borderRadius="1rem"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <Terminal size={24} className="text-cyan-500" />
                            <span className="text-xs font-bold tracking-wider text-center">DATA CORRUPTION</span>
                        </div>
                    </ShimmerButton>
                </div>
            </div>

            {/* Right Col: Chat Interface */}
            <Card className="flex flex-col !bg-[#0a0a1f]/90 !border-violet-500/20 relative overflow-hidden" noPadding>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50"></div>
                
                {/* Options Header */}
                <div className="p-3 border-b border-white/10 flex items-center justify-between bg-black/20">
                    {activeMode === 'analysis' ? (
                        <button 
                            onClick={() => setUseSearch(!useSearch)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${useSearch ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}
                        >
                            <Globe size={12} />
                            GLOBAL UPLINK {useSearch ? 'ON' : 'OFF'}
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <select 
                                value={imgRatio} 
                                onChange={(e) => setImgRatio(e.target.value)}
                                className="bg-black/40 border border-white/10 text-xs rounded px-2 py-1 text-gray-300 outline-none"
                            >
                                <option value="1:1">1:1 Square</option>
                                <option value="16:9">16:9 Landscape</option>
                                <option value="9:16">9:16 Portrait</option>
                                <option value="4:3">4:3 Classic</option>
                            </select>
                            <select 
                                value={imgSize}
                                onChange={(e) => setImgSize(e.target.value)}
                                className="bg-black/40 border border-white/10 text-xs rounded px-2 py-1 text-gray-300 outline-none"
                            >
                                <option value="1K">1K Res</option>
                                <option value="2K">2K Res</option>
                                <option value="4K">4K Res</option>
                            </select>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-violet-500 animate-ping' : 'bg-green-500'}`}></div>
                        ONLINE
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar relative z-10">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                        >
                            <div className={`max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed backdrop-blur-md ${
                                msg.role === 'user' 
                                ? 'bg-violet-600 text-white rounded-br-none shadow-lg shadow-violet-500/20' 
                                : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-none'
                            }`}>
                                {msg.role === 'ai' && (
                                    <div className="flex items-center gap-2 mb-2 text-violet-400 text-xs font-bold tracking-wider uppercase">
                                        <Cpu size={12} /> Nexus_AI
                                    </div>
                                )}
                                {msg.image ? (
                                    <div className="mt-2 rounded-xl overflow-hidden border border-white/20 group relative">
                                        <img src={msg.image} alt="Generated" className="w-full h-auto object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button className="p-2 bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20 text-white"><Maximize2 size={20} /></button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                                )}
                                
                                {msg.grounding && (
                                    <div className="mt-3 pt-3 border-t border-white/10 grid gap-1">
                                        <div className="text-[10px] text-gray-400 font-bold">SOURCES:</div>
                                        {msg.grounding.map((g: any, idx: number) => (
                                            g.web?.uri && (
                                                <a key={idx} href={g.web.uri} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:underline truncate flex items-center gap-1">
                                                    <Globe size={8} /> {g.web.title || g.web.uri}
                                                </a>
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-bl-none flex gap-2 items-center text-xs text-gray-400">
                                <Loader2 size={14} className="animate-spin text-violet-500" />
                                {activeMode === 'visuals' ? 'Rendering neural assets...' : 'Processing data streams...'}
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-md">
                    <form onSubmit={handleSend} className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={activeMode === 'analysis' ? "Query supply chain intelligence..." : "Describe visual asset to generate..."}
                            className={`w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-5 pr-12 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-all font-mono text-sm ${activeMode === 'visuals' ? 'focus:border-fuchsia-500/50' : 'focus:border-violet-500/50'}`}
                        />
                        <button 
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className={`absolute right-2 top-2 p-2 rounded-lg text-white transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${activeMode === 'visuals' ? 'bg-fuchsia-600 hover:bg-fuchsia-500 shadow-fuchsia-500/20' : 'bg-violet-600 hover:bg-violet-500 shadow-violet-500/20'}`}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                    <div className="mt-3 flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Network size={10} /> {activeMode === 'analysis' ? 'Text Stream' : 'Image Stream'}</span>
                        <span className="flex items-center gap-1"><Fingerprint size={10} /> Secure</span>
                    </div>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default Nexus;
