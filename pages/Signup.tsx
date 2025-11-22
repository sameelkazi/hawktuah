
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Account created successfully! Welcome aboard.', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0e17] relative overflow-hidden p-4">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/20 blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-glass-100/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative z-10"
      >
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400">Join StockMaster today</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                <input 
                    type="text" 
                    className="w-full bg-[#16161e] border border-white/10 rounded-xl px-5 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                    placeholder="John Doe"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                <input 
                    type="email" 
                    className="w-full bg-[#16161e] border border-white/10 rounded-xl px-5 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                    placeholder="john@example.com"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                <input 
                    type="password" 
                    className="w-full bg-[#16161e] border border-white/10 rounded-xl px-5 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                    placeholder="Create a strong password"
                />
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 group transition-all mt-4 active:scale-95">
                Sign Up
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
            Already have an account? <Link to="/login" className="text-cyan-400 font-medium hover:text-cyan-300">Sign In</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
