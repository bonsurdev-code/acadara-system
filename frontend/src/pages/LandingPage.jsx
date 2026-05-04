import { useState, useEffect } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Users, 
  Zap, 
  Shield, 
  ChevronRight, 
  Star, 
  Quote, 
  ArrowRight,
  Sparkles,
  Target,
  MessageCircle,
  BarChart3,
  Menu,
  X
} from 'lucide-react'
import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
}

export default function LandingPage(){
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);

    const openLogin = () => {
        setIsSignupOpen(false);
        setIsLoginOpen(true);
    };

    const openSignup = () => {
        setIsLoginOpen(false);
        setIsSignupOpen(true);
    };

    useEffect(() => {
        const handleScroll = () => {
        setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How It Works', href: '#how-it-works' },
        // { name: 'Testimonials', href: '#testimonials' }
    ]

    const features = [
        {
        icon: Brain,
        title: 'AI Semantic Analysis',
        description: 'Our proprietary NLP engine analyzes communication patterns, goals, and expertise to find truly compatible mentor-mentee pairs.',
        color: 'from-blue-500 to-cyan-500',
        glow: 'glow-blue'
        },
        {
        icon: Target,
        title: 'Precision Matching',
        description: 'Go beyond surface-level criteria. We match based on learning styles, career aspirations, personality compatibility, and growth objectives.',
        color: 'from-violet-500 to-purple-500',
        glow: 'glow-purple'
        },
        {
        icon: Zap,
        title: 'Instant Connections',
        description: 'Get matched within minutes, not weeks. Our real-time algorithm continuously learns and improves match quality with every interaction.',
        color: 'from-amber-500 to-orange-500',
        glow: 'shadow-amber-500/30'
        },
        {
        icon: Shield,
        title: 'Safe & Verified',
        description: 'Every mentor undergoes rigorous background checks and credential verification. Your safety and privacy are our top priorities.',
        color: 'from-emerald-500 to-teal-500',
        glow: 'shadow-emerald-500/30'
        },
        {
        icon: MessageCircle,
        title: 'Smart Communication',
        description: 'Built-in messaging with AI-suggested conversation starters, goal tracking, and progress analytics to maximize every session.',
        color: 'from-pink-500 to-rose-500',
        glow: 'shadow-pink-500/30'
        },
        {
        icon: BarChart3,
        title: 'Progress Analytics',
        description: 'Track your growth with detailed insights. Visualize skill development, goal completion, and mentorship impact over time.',
        color: 'from-indigo-500 to-blue-500',
        glow: 'shadow-indigo-500/30'
        }
    ]

    const steps = [
        {
        number: '01',
        title: 'Create Your Profile',
        description: 'Tell us about your goals, interests, and what you are looking for in a mentorship relationship. Our AI analyzes your input deeply.',
        icon: Users
        },
        {
        number: '02',
        title: 'AI Analysis',
        description: 'Our semantic engine processes your profile, comparing it against thousands of mentors to find the perfect alignment of skills and chemistry.',
        icon: Brain
        },
        {
        number: '03',
        title: 'Get Matched',
        description: 'Receive curated mentor recommendations with compatibility scores. Review profiles and choose your ideal mentorship match.',
        icon: Target
        },
        {
        number: '04',
        title: 'Start Growing',
        description: 'Begin your journey with structured goals, regular check-ins, and AI-powered insights to maximize your development.',
        icon: Zap
        }
    ]

    // const testimonials = [
    //     {
    //     quote: "Acadara matched me with a mentor who understood exactly where I wanted to take my career. The AI matching was spot-on – it felt like they knew me better than I knew myself.",
    //     author: "Sarah Chen",
    //     role: "Computer Science Student",
    //     rating: 5,
    //     avatar: "SC"
    //     },
    //     {
    //     quote: "As a mentor, I've seen platforms come and go. Acadara's semantic matching means I spend less time figuring out if we're compatible and more time actually mentoring.",
    //     author: "Dr. James Wilson",
    //     role: "Senior Data Scientist",
    //     rating: 5,
    //     avatar: "JW"
    //     },
    //     {
    //     quote: "The progress tracking and AI insights helped me stay accountable. Six months in, I've achieved goals that felt impossible before finding my mentor through Acadara.",
    //     author: "Maya Patel",
    //     role: "MBA Candidate",
    //     rating: 5,
    //     avatar: "MP"
    //     }
    // ]

    const links = {
        Product: ['Features', 'How It Works', 'Pricing', 'API', 'Security'],
        Company: ['About', 'Blog', 'Careers', 'Press', 'Partners'],
        Resources: ['Documentation', 'Help Center', 'Community', 'Templates', 'Webinars'],
        Legal: ['Privacy', 'Terms', 'Cookie Policy', 'Licenses']
    }

    return (
        <div className="min-h-screen bg-[#0F172A] text-white font-sans selection:bg-blue-500/30">
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled ? 'glass py-4' : 'py-6 bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                    >
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white tracking-tight">Acadara</span>
                    </Motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                        key={link.name}
                        href={link.href}
                        className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
                        >
                        {link.name}
                        </a>
                    ))}
                    {/* <Motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2.5 rounded-full bg-linear-to-r from-blue-600 to-violet-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                    >
                        Get Our App!
                    </Motion.button> */}
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                    <Motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass mt-4 mx-6 rounded-2xl overflow-hidden"
                    >
                        <div className="p-6 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <a
                            key={link.name}
                            href={link.href}
                            className="text-slate-300 hover:text-white transition-colors py-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                            >
                            {link.name}
                            </a>
                        ))}
                        <button 
                            onClick={openLogin}
                            className="w-full py-3 rounded-full bg-linear-to-r from-blue-600 to-violet-600 text-white font-medium mt-2">
                            Get Started
                        </button>
                        </div>
                    </Motion.div>
                    )}
                </AnimatePresence>
            </nav>
            <main>
                <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-[#0F172A]">
                    {/* Background Effects */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-800px h-800px bg-cyan-600/10 rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                        <Motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="space-y-8"
                        >
                        <Motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/30">
                            <Sparkles className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-blue-200 font-medium">AI-Powered Mentorship Matching</span>
                        </Motion.div>

                        <Motion.h1 
                            variants={fadeInUp}
                            className="text-5xl md:text-7xl font-bold text-white leading-tight max-w-5xl mx-auto"
                        >
                            Connect with the Perfect Mentor Using{' '}
                            <span className="linear-text">Semantic Intelligence</span>
                        </Motion.h1>

                        <Motion.p 
                            variants={fadeInUp}
                            className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
                        >
                            Acadara uses advanced AI to analyze goals, personalities, and learning styles to match students with mentors who truly understand their journey.
                        </Motion.p>

                        <Motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={openSignup}
                            className="px-8 py-4 rounded-full bg-linear-to-r from-blue-600 to-violet-600 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all flex items-center gap-2 group"
                        >
                            Start Your Journey
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Motion.button>
                        <Motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.href = "/onboarding"}
                            className="px-8 py-4 rounded-full glass text-white font-semibold text-lg hover:bg-slate-800/50 transition-all border border-slate-700"
                        >
                            Become a Mentor
                        </Motion.button>
                        </Motion.div>

                        {/* Stats */}
                        <Motion.div 
                            variants={fadeInUp}
                            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 border-t border-slate-800/50 mt-12"
                        >
                            {[
                            { value: '10', label: 'Active Mentors' },
                            { value: '2', label: 'Students Matched' },
                            { value: '98%', label: 'Match Satisfaction' },
                            ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-slate-500">{stat.label}</div>
                            </div>
                            ))}
                        </Motion.div>
                        </Motion.div>
                    </div>

                    {/* Scroll Indicator */}
                    {/* <Motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    >
                        <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex justify-center pt-2">
                        <Motion.div 
                            animate={{ y: [0, 8, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-1.5 h-1.5 rounded-full bg-blue-500"
                        />
                        </div>
                    </Motion.div> */}
                </section>

                <section id="features" className="py-24 bg-[#0F172A] relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <Motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="text-center mb-20"
                        >
                        <Motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Why Choose <span className="linear-text">Acadara</span>?
                        </Motion.h2>
                        <Motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-2xl mx-auto">
                            Revolutionary technology meets human connection. Experience mentorship reimagined for the modern learner.
                        </Motion.p>
                        </Motion.div>

                        <Motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                        {features.map((feature, index) => (
                            <Motion.div
                            key={index}
                            variants={scaleIn}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="group relative p-8 rounded-3xl glass border border-slate-800 hover:border-slate-700 transition-all duration-300"
                            >
                            <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg ${feature.glow}`}>
                                <feature.icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">{feature.description}</p>
                            
                            <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-blue-600/5 to-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            </Motion.div>
                        ))}
                        </Motion.div>
                    </div>
                </section>
                
                <section id="how-it-works" className="py-24 bg-[#1E293B] relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-linear(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                        }} />
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <Motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="text-center mb-20"
                        >
                        <Motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white mb-6">
                            How <span className="linear-text">It Works</span>
                        </Motion.h2>
                        <Motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-2xl mx-auto">
                            From signup to success in four simple steps. Our AI handles the complexity while you focus on growth.
                        </Motion.p>
                        </Motion.div>

                        <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-linear-to-r from-blue-600/20 via-violet-600/20 to-cyan-600/20 hidden lg:block" />

                        <Motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {steps.map((step, index) => (
                            <Motion.div
                                key={index}
                                variants={fadeInUp}
                                className="relative"
                            >
                                <div className="glass rounded-3xl p-8 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 group h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-5xl font-bold text-slate-700 group-hover:text-blue-500/30 transition-colors">{step.number}</span>
                                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                                    <step.icon className="w-6 h-6 text-blue-400" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                                </div>
                            </Motion.div>
                            ))}
                        </Motion.div>
                        </div>
                    </div>
                </section>

                {/* <section id="testimonials" className="py-24 bg-[#0F172A]">
                    <div className="max-w-7xl mx-auto px-6">
                        <Motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="text-center mb-20"
                        >
                        <Motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Success <span className="linear-text">Stories</span>
                        </Motion.h2>
                        <Motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-2xl mx-auto">
                            Join thousands of students and mentors who have found their perfect match.
                        </Motion.p>
                        </Motion.div>

                        <Motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-3 gap-8"
                        >
                        {testimonials.map((testimonial, index) => (
                            <Motion.div
                            key={index}
                            variants={scaleIn}
                            className="glass rounded-3xl p-8 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all duration-300"
                            >
                            <Quote className="absolute top-6 right-6 w-10 h-10 text-slate-700 group-hover:text-blue-500/20 transition-colors" />
                            
                            <div className="flex gap-1 mb-6">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            
                            <p className="text-slate-300 mb-8 leading-relaxed relative z-10">"{testimonial.quote}"</p>
                            
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                                {testimonial.avatar}
                                </div>
                                <div>
                                <div className="text-white font-semibold">{testimonial.author}</div>
                                <div className="text-slate-500 text-sm">{testimonial.role}</div>
                                </div>
                            </div>
                            </Motion.div>
                        ))}
                        </Motion.div>
                    </div>
                </section> */}
                
                <section className="py-24 bg-[#0F172A] relative overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
                    </div>
                    
                    <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                        <Motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        >
                        <Motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Ready to Find Your Perfect <span className="linear-text">Mentor</span>?
                        </Motion.h2>
                        <Motion.p variants={fadeInUp} className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                            Join the next generation of learners and leaders. Your AI-powered mentorship journey starts now.
                        </Motion.p>
                        <Motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Motion.button
                            onClick={openSignup}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-5 rounded-full bg-linear-to-r from-blue-600 to-violet-600 text-white font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group"
                            >
                            Get Started
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Motion.button>
                            <Motion.button
                            onClick={() => window.location.href = "/onboarding"}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-5 rounded-full glass text-white font-bold text-lg hover:bg-slate-800/50 transition-all border border-slate-700"
                            >
                            Become a Mentor
                            </Motion.button>
                        </Motion.div>
                        </Motion.div>
                    </div>
                </section>
            </main>
                <footer className="bg-[#0F172A] border-t border-slate-800 pt-20 pb-10">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">Acadara</span>
                            </div>
                            <p className="text-slate-400 mb-6 max-w-sm">
                            Revolutionizing mentorship through AI-powered semantic matching. Connecting the right minds for exponential growth.
                            </p>
                            <div className="flex gap-4">
                            {['Twitter', 'LinkedIn', 'GitHub', 'Discord'].map((social) => (
                                <a
                                key={social}
                                href="#"
                                className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                                >
                                <span className="text-xs font-bold">{social[0]}</span>
                                </a>
                            ))}
                            </div>
                        </div>
                        
                        {Object.entries(links).map(([category, items]) => (
                            <div key={category}>
                            <h4 className="text-white font-semibold mb-4">{category}</h4>
                            <ul className="space-y-3">
                                {items.map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                                    {item}
                                    </a>
                                </li>
                                ))}
                            </ul>
                            </div>
                        ))}
                        </div>
                        
                        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">
                            © 2025 Acadara. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
                            <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Terms of Service</a>
                            <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Cookies</a>
                        </div>
                        </div>
                    </div>
                </footer>
            <LoginModal
                isOpen={isLoginOpen} 
                onClose={() => setIsLoginOpen(false)}
                onSwitchToSignup={openSignup}
            />
            <SignupModal 
                isOpen={isSignupOpen} 
                onClose={() => setIsSignupOpen(false)}
                onSwitchToLogin={openLogin}
            />
        </div>
    )
}