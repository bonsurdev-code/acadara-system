import React, { useState } from 'react';
import { motion as Motion } from "framer-motion";
import { ChevronRight, Loader2, CheckCircle, Target, Zap, ShieldCheck, Globe } from "lucide-react";
import { adminService } from '../core/api-services/admin.service';

export default function MentorOnboarding() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    expertise: 'Software Engineering',
    linkedin_url: '',
    bio: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await adminService.submitPublicApplication(formData);
      if (res.success) {
        setIsSuccess(true);
        // Optional: Redirect after 3 seconds
        setTimeout(() => window.location.href = '/', 3000);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6">
        <Motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 rounded-3xl text-center max-w-md border border-emerald-500/20"
        >
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Application Sent!</h2>
          <p className="text-slate-400">Thank you for your interest. Our team will review your profile and contact you via email within 48 hours.</p>
        </Motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column (Content) - Keep your original UI here */}
          <Motion.div 
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-8"
          >
            <Motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/30">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm text-blue-200 font-medium tracking-wide uppercase">Expert Community</span>
            </Motion.div>

            <Motion.h1 variants={fadeInUp} className="text-5xl lg:text-6xl font-bold leading-tight">
              Share Your Wisdom. <br />
              <span className="linear-text">Shape the Future.</span>
            </Motion.h1>

            <Motion.p variants={fadeInUp} className="text-xl text-slate-400 leading-relaxed">
              Join Acadara's elite network of mentors. Our semantic matching ensures you’re paired with students who resonate with your specific expertise and leadership style.
            </Motion.p>

            <Motion.div variants={fadeInUp} className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: Target, title: "Curated Matches", desc: "No random pairings. Only relevant connections." },
                { icon: Zap, title: "Flexible Schedule", desc: "You decide when and how often you mentor." },
                { icon: ShieldCheck, title: "Verified Network", desc: "Connect with high-potential, verified students." },
                { icon: Globe, title: "Global Impact", desc: "Mentor talent from across the digital world." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </Motion.div>
          </Motion.div>

          {/* Right Column: Public Application Form */}
          <Motion.div className="relative">
            <div className="glass p-8 lg:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-white">Apply to Mentor</h3>
              
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Full Name</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" 
                      placeholder="John Doe"
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Email Address</label>
                    <input 
                      required
                      type="email"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" 
                      placeholder="john@example.com"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Primary Expertise</label>
                  <select 
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 outline-none"
                    onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                  >
                    <option>Software Engineering</option>
                    <option>UI/UX Design</option>
                    <option>Cybersecurity</option>
                    <option>Data Science</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">LinkedIn URL</label>
                  <input 
                    required
                    type="url"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" 
                    placeholder="https://linkedin.com/in/username"
                    onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">About your Mentorship Style</label>
                  <textarea 
                    required
                    rows="3"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none resize-none" 
                    placeholder="Describe your expertise..."
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 font-bold text-lg hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit Application"}
                  {!isSubmitting && <ChevronRight size={20} />}
                </button>
              </form>
            </div>
          </Motion.div>
        </div>
        {/* Success Stories Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How it Works for Mentors</h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Apply & Verify", text: "Submit your credentials and pass our quality check." },
              { step: "02", title: "Semantic Matching", text: "Our AI pairs you with mentees based on goals and vibes." },
              { step: "03", title: "Start Mentoring", text: "Use our built-in tools for scheduling and communication." }
            ].map((step, i) => (
              <div key={i} className="p-8 glass rounded-3xl border border-slate-800 text-center group hover:border-blue-500/30 transition-all">
                <span className="text-4xl font-black text-slate-700 mb-4 block group-hover:text-blue-500/20 transition-colors">{step.step}</span>
                <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                <p className="text-slate-400">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}