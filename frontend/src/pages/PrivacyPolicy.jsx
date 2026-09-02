import { motion as Motion } from 'framer-motion'
import { Shield, ArrowLeft, Brain } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans selection:bg-blue-500/30">
      <nav className="py-6 bg-transparent border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Acadara</span>
          </a>
          <a href="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </a>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-3xl p-8 md:p-12 border border-slate-800"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
              <p className="text-slate-400 text-sm mt-1">Effective Date: September 3, 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-slate-300 leading-relaxed text-sm md:text-base border-t border-slate-800/80 pt-8">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
              <p>
                This Privacy Policy applies to Acadara System, an academic thesis project developed under the{' '}
                <strong className="text-white">Society of Programming Enthusiasts in Computer Science (SPECS)</strong>,
                College of Computer Science, <strong className="text-white">Gordon College</strong>, located in Olongapo City, Philippines.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
              <p className="mb-3">We collect minimal account information strictly necessary to authenticate users and operate the peer mentorship platform:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-white">Personal Data:</strong> Full name and email address provided during registration or retrieved via Google OAuth.</li>
                <li><strong className="text-white">Authentication Data:</strong> Encrypted password hashes, Google profile IDs, and temporary One-Time Passwords (OTPs) sent via email.</li>
              </ul>
              <p className="mt-3 text-slate-400">We do not collect payment details, academic transcripts, telephone numbers, or profile photos. We do not use third-party analytics trackers (such as Google Analytics or Mixpanel).</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Data</h2>
              <p className="mb-2">Your information is used strictly to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create and authenticate user accounts (Mentee, Mentor, Admin).</li>
                <li>Verify user email address through OTP verification.</li>
                <li>Facilitate academic peer mentorship connections within Gordon College.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Data Sharing and Security</h2>
              <p>
                We do not sell, rent, or trade user data. Access to administrative tools is restricted to authorized project student developers and faculty administrators. Standard encryption protocols are used for handling user credentials and database communication.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Contact Information</h2>
              <p>
                For questions regarding this policy, contact the project maintainer at{' '}
                <a href="mailto:bonsurdev@gmail.com" className="text-blue-400 hover:underline">bonsurdev@gmail.com</a>.
              </p>
            </section>
          </div>
        </Motion.div>
      </main>
    </div>
  )
}