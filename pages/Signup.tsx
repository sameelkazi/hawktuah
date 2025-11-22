
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { SignUpPage } from '../components/ui/SignUpPage';
import { Testimonial } from '../components/ui/SignInPage';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
        showToast('Account created successfully! Welcome aboard.', 'success');
        navigate('/dashboard');
    }, 800);
  };

  const handleGoogleSignUp = () => {
    showToast('Redirecting to Google Authentication...', 'info');
  };

  const handleSignInClick = () => {
    navigate('/login');
  };

  const testimonials: Testimonial[] = [
    {
      avatarSrc: "https://randomuser.me/api/portraits/men/41.jpg",
      name: "Michael Foster",
      handle: "Operations Manager",
      text: "Setting up my warehouse took less than 10 minutes. The UI is intuitive and fast."
    },
    {
      avatarSrc: "https://randomuser.me/api/portraits/women/63.jpg",
      name: "Lisa Wong",
      handle: "Inventory Specialist",
      text: "I love the dark mode and the mobile responsiveness. I can manage stock from anywhere."
    },
    {
      avatarSrc: "https://randomuser.me/api/portraits/men/86.jpg",
      name: "Robert Key",
      handle: "Small Business Owner",
      text: "Best investment for my business this year. Tracking stock flow has never been this beautiful."
    }
  ];

  return (
    <SignUpPage
      title={<span className="font-bold text-slate-900 dark:text-white tracking-tight">Join <span className="text-blue-600">StockMaster</span></span>}
      description="Create your account and start optimizing your inventory today."
      heroImageSrc="https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=2832&auto=format&fit=crop"
      testimonials={testimonials}
      onSignUp={handleSignUp}
      onGoogleSignUp={handleGoogleSignUp}
      onSignInClick={handleSignInClick}
    />
  );
};

export default Signup;