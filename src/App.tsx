import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Linkedin, Terminal, Crosshair, Cpu, RotateCcw, Play, ChevronUp, ChevronDown, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

type GameState = 'menu' | 'playing' | 'won' | 'lost';

interface GuessHistory {
  guess: number;
  status: 'high' | 'low' | 'correct';
}

const GITHUB_URL = "https://github.com/Barrsum/Neon-Decrypt-Game";
const LINKEDIN_URL = "https://www.linkedin.com/in/ram-bapat-barrsum-diamos";
const MAX_ATTEMPTS = 10;

export default function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [history, setHistory] = useState<GuessHistory[]>([]);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(MAX_ATTEMPTS);
  const inputRef = useRef<HTMLInputElement>(null);

  const initializeGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setHistory([]);
    setAttemptsLeft(MAX_ATTEMPTS);
    setCurrentGuess('');
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameState !== 'playing') return;

    const guessNum = parseInt(currentGuess, 10);
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      // Invalid input, just clear it
      setCurrentGuess('');
      return;
    }

    let status: 'high' | 'low' | 'correct' = 'correct';
    if (guessNum > targetNumber) status = 'high';
    else if (guessNum < targetNumber) status = 'low';

    const newHistory = [{ guess: guessNum, status }, ...history];
    setHistory(newHistory);
    setCurrentGuess('');

    if (status === 'correct') {
      setGameState('won');
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0ff', '#f0f', '#00f']
      });
    } else {
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);
      if (newAttempts === 0) {
        setGameState('lost');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col scanlines selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      {/* Header */}
      <header className="p-4 sm:p-6 z-10 border-b border-cyan-900/50 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 neon-border bg-slate-900 text-cyan-400">
              <Terminal size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold neon-text leading-none">NEON_DECRYPT</h1>
              <p className="text-xs font-mono text-cyan-600 uppercase tracking-widest mt-1">
                SYS_ADMIN: <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors">Ram Bapat</a>
              </p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-4">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-400 transition-colors p-2"><Github size={20} /></a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-400 transition-colors p-2"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8 z-10">
        <AnimatePresence mode="wait">
          {gameState === 'menu' ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl w-full p-8 sm:p-12 neon-border bg-slate-900/80 backdrop-blur-sm text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/20"></div>
              
              <div className="mb-8">
                <motion.div 
                  className="text-6xl mb-6 text-cyan-400 flex justify-center glitch-anim"
                >
                  <ShieldAlert size={64} />
                </motion.div>
                <h2 className="text-4xl sm:text-5xl font-display font-bold neon-text mb-4">SYSTEM BREACH</h2>
                <p className="text-lg text-cyan-200/70 font-mono mb-2">
                  WARNING: UNAUTHORIZED ACCESS DETECTED.
                </p>
                <p className="text-sm text-cyan-600 font-mono">
                  DECRYPT THE SECURITY PIN (1-100) TO REGAIN CONTROL.
                </p>
              </div>
              
              <div className="space-y-4 mt-10">
                <button
                  onClick={initializeGame}
                  className="w-full py-4 neon-border-magenta bg-fuchsia-950/30 text-fuchsia-400 hover:bg-fuchsia-900/50 hover:text-fuchsia-300 rounded-none font-display text-2xl flex items-center justify-center gap-3 transition-all group"
                >
                  <Play size={28} className="group-hover:scale-110 transition-transform" /> INITIATE DECRYPTION
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl w-full"
            >
              {/* Status Bar */}
              <div className="mb-6 flex justify-between items-center gap-4 neon-border bg-slate-900/80 p-4">
                <div className="flex-1 text-center border-r border-cyan-900/50">
                  <p className="text-xs uppercase font-bold text-cyan-600 tracking-widest mb-1">Target Range</p>
                  <p className="text-xl font-display text-cyan-400 flex items-center justify-center gap-2">
                    <Crosshair size={18} /> 1 - 100
                  </p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-xs uppercase font-bold text-cyan-600 tracking-widest mb-1">Attempts Left</p>
                  <p className={`text-2xl font-display ${attemptsLeft <= 3 ? 'neon-text-red text-red-400' : 'neon-text-magenta text-fuchsia-400'}`}>
                    {attemptsLeft} / {MAX_ATTEMPTS}
                  </p>
                </div>
              </div>

              {/* Game Interface */}
              <div className="neon-border bg-slate-900/80 p-6 sm:p-8 relative">
                
                {/* Input Area */}
                <form onSubmit={handleGuessSubmit} className="mb-8 relative">
                  <div className="flex gap-4">
                    <input
                      ref={inputRef}
                      type="number"
                      min="1"
                      max="100"
                      value={currentGuess}
                      onChange={(e) => setCurrentGuess(e.target.value)}
                      disabled={gameState !== 'playing'}
                      placeholder="ENTER PIN..."
                      className="flex-1 bg-slate-950 border border-cyan-800 text-cyan-300 text-3xl font-display p-4 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-cyan-900/50 text-center"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={gameState !== 'playing' || !currentGuess}
                      className="px-8 bg-cyan-950 border border-cyan-700 text-cyan-400 font-display text-xl hover:bg-cyan-900 hover:text-cyan-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <Cpu size={24} />
                    </button>
                  </div>
                </form>

                {/* History Log */}
                <div className="border border-cyan-900/50 bg-slate-950 p-4 h-64 overflow-y-auto font-mono text-sm">
                  <div className="text-cyan-700 mb-4 pb-2 border-b border-cyan-900/30 flex justify-between">
                    <span>&gt; DECRYPTION_LOG</span>
                    <span>STATUS</span>
                  </div>
                  
                  <AnimatePresence initial={false}>
                    {history.length === 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-cyan-800 text-center mt-8 italic">
                        Awaiting input sequence...
                      </motion.div>
                    )}
                    {history.map((item, index) => (
                      <motion.div
                        key={`${item.guess}-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex justify-between items-center mb-3 p-2 bg-slate-900/50 border-l-2 border-cyan-800"
                      >
                        <span className="text-cyan-300 text-lg">[{item.guess}]</span>
                        <span className={`flex items-center gap-2 font-bold uppercase tracking-wider ${
                          item.status === 'high' ? 'text-fuchsia-400' : 
                          item.status === 'low' ? 'text-cyan-400' : 
                          'text-green-400 neon-text'
                        }`}>
                          {item.status === 'high' && <><ChevronDown size={16} /> TOO HIGH</>}
                          {item.status === 'low' && <><ChevronUp size={16} /> TOO LOW</>}
                          {item.status === 'correct' && <><CheckCircle2 size={16} /> MATCH FOUND</>}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => setGameState('menu')}
                  className="px-6 py-2 border border-cyan-800 text-cyan-600 font-mono text-sm hover:bg-cyan-950 hover:text-cyan-400 transition-colors"
                >
                  ABORT_MISSION
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* End Game Modals */}
      <AnimatePresence>
        {(gameState === 'won' || gameState === 'lost') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`max-w-md w-full p-8 text-center bg-slate-900 ${gameState === 'won' ? 'neon-border' : 'neon-border-red'}`}
            >
              {gameState === 'won' ? (
                <>
                  <div className="text-cyan-400 flex justify-center mb-6"><CheckCircle2 size={64} /></div>
                  <h2 className="text-3xl font-display font-bold neon-text mb-2">SYSTEM SECURED</h2>
                  <p className="text-cyan-200 mb-6 font-mono">
                    PIN <span className="text-fuchsia-400 font-bold text-xl">[{targetNumber}]</span> successfully decrypted in {MAX_ATTEMPTS - attemptsLeft} attempts.
                  </p>
                </>
              ) : (
                <>
                  <div className="text-red-500 flex justify-center mb-6 glitch-anim"><AlertTriangle size={64} /></div>
                  <h2 className="text-3xl font-display font-bold neon-text-red mb-2 text-red-500">ACCESS DENIED</h2>
                  <p className="text-red-300 mb-6 font-mono">
                    Security lockout initiated. The correct PIN was <span className="text-white font-bold text-xl">[{targetNumber}]</span>.
                  </p>
                </>
              )}
              
              <div className="space-y-3 mt-8">
                <button
                  onClick={initializeGame}
                  className={`w-full py-3 font-display font-bold flex items-center justify-center gap-2 transition-all ${
                    gameState === 'won' 
                      ? 'neon-border bg-cyan-950/50 text-cyan-400 hover:bg-cyan-900' 
                      : 'neon-border-red bg-red-950/50 text-red-400 hover:bg-red-900'
                  }`}
                >
                  <RotateCcw size={20} /> {gameState === 'won' ? 'NEW_DECRYPTION' : 'RETRY_BREACH'}
                </button>
                <button
                  onClick={() => setGameState('menu')}
                  className="w-full py-3 border border-slate-700 text-slate-400 font-mono hover:bg-slate-800 transition-colors"
                >
                  RETURN_TO_MAIN
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="p-6 z-10 border-t border-cyan-900/50 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-display font-bold text-cyan-600 mb-1">OPEN_SOURCE_PROTOCOL</h3>
            <p className="text-cyan-800 text-xs max-w-sm font-mono">
              Built with React, Tailwind CSS, and Framer Motion. Part of the April Vibe Coding Challenge.
            </p>
          </div>
          
          <div className="flex gap-4">
            <a 
              href={GITHUB_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 border border-cyan-900 text-cyan-700 hover:text-cyan-400 hover:border-cyan-500 transition-all"
              title="View Source on GitHub"
            >
              <Github size={20} />
            </a>
            <a 
              href={LINKEDIN_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 border border-cyan-900 text-cyan-700 hover:text-cyan-400 hover:border-cyan-500 transition-all"
              title="Connect on LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
        <div className="mt-6 text-center text-[10px] font-mono text-cyan-900 uppercase tracking-widest">
          © 2026 NEON_DECRYPT • SYS_ADMIN: RAM BAPAT
        </div>
      </footer>
    </div>
  );
}

