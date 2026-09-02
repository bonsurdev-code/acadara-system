import { motion as Motion } from 'framer-motion'
import { FileText, ArrowLeft, Brain } from 'lucide-react'

export default function TermsOfService() {
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
            <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
              <p className="text-slate-400 text-sm mt-1">Effective Date: September 3, 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-slate-300 leading-relaxed text-sm md:text-base border-t border-slate-800/80 pt-8">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Acadara System, you agree to these Terms of Service. This platform is a non-commercial academic thesis project governed by the local regulations of <strong className="text-white">Olongapo City, Philippines</strong> and applicable Philippine policies (including the Data Privacy Act of 2012 / RA 10173).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Eligibility</h2>
              <p>
                Acadara System is intended primarily for college students and academic participants. You must be at least <strong className="text-white">18 years of age</strong> (or currently enrolled as a college/university student) to create an account and use this platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Acceptable Use and Community Standards</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-white">Free Service:</strong> Acadara System is completely free. There are no paid subscriptions, booking fees, or financial transactions.</li>
                <li><strong className="text-white">Account Integrity:</strong> You are responsible for maintaining the confidentiality of your credentials and OTP verification codes.</li>
                <li><strong className="text-white">Prohibited Conduct:</strong> Users must treat peers and mentors with respect. Any attempt to abuse authentication endpoints, exploit software bugs, or breach user privacy is strictly prohibited.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Intellectual Property & Academic Notice</h2>
              <p>
                Acadara System is owned and operated under the academic supervision of the SPECS Organization, College of Computer Science at Gordon College. The system is provided "as-is" for educational and evaluation purposes without guarantees of continuous operational availability.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Limitation of Liability</h2>
              <p>
                The developers, SPECS Organization, and Gordon College are not liable for temporary service interruptions, network packet drops, or unauthorized access arising from external DNS or service provider failures beyond reasonable project control.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Contact Information</h2>
              <p>
                For technical inquiries or account issues, contact{' '}
                <a href="mailto:bonsurdev@gmail.com" className="text-blue-400 hover:underline">bonsurdev@gmail.com</a>.
              </p>
            </section>
          </div>
        </Motion.div>
      </main>
    </div>
  )
}