import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Welcome back, Manan!', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0e17] relative overflow-hidden p-4">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-600/20 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-glass-100/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative z-10"
      >
        <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
                <span className="text-3xl font-bold text-white">S</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to manage your inventory</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                <input 
                    type="email" 
                    className="w-full bg-[#16161e] border border-white/10 rounded-xl px-5 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                    placeholder="admin@stockmaster.com"
                />
            </div>
            <div className="space-y-2">
                <div className="flex justify-between ml-1">
                    <label className="text-sm font-medium text-gray-300">Password</label>
                    <a href="#" className="text-xs text-purple-400 hover:text-purple-300">Forgot password?</a>
                </div>
                <input 
                    type="password" 
                    className="w-full bg-[#16161e] border border-white/10 rounded-xl px-5 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                    placeholder="••••••••"
                />
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 group transition-all active:scale-95">
                Sign In
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
            Don't have an account? <Link to="/signup" className="text-purple-400 font-medium hover:text-purple-300">Create one now</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;