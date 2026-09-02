import { motion as Motion } from 'framer-motion'
import { Cookie, ArrowLeft, Brain } from 'lucide-react'

export default function CookiePolicy() {
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
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
              <Cookie className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Cookie Policy</h1>
              <p className="text-slate-400 text-sm mt-1">Effective Date: September 3, 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-slate-300 leading-relaxed text-sm md:text-base border-t border-slate-800/80 pt-8">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. What Are Cookies?</h2>
              <p>
                Cookies and similar storage technologies (such as HTML5 <code className="text-blue-400 font-mono">localStorage</code> and <code className="text-blue-400 font-mono">sessionStorage</code>) are small text files or data entries placed on your device by a website when you visit it. They are widely used to make websites work efficiently and provide secure authentication mechanisms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. How Acadara System Uses Cookies</h2>
              <p className="mb-3">
                Acadara System uses cookies and local storage <strong className="text-white">strictly for essential authentication and security functions</strong>. We do not use advertising cookies, third-party tracking pixels, or cross-site analytics identifiers.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-white">Authentication & Session Cookies (HTTP-Only):</strong> Encrypted session tokens used to maintain your logged-in state across page reloads.</li>
                <li><strong className="text-white">Security & CSRF Protection:</strong> Temporary security tokens used during authentication and OTP validation routines.</li>
                <li><strong className="text-white">Session Storage:</strong> Temporary browser memory used during login and OTP verification flows to track verification state.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Cookies We Do NOT Use</h2>
              <p className="mb-2">To protect student privacy, Acadara System explicitly refrains from using:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Analytics Cookies (e.g., Google Analytics, Hotjar)</li>
                <li>Advertising or Marketing Cookies</li>
                <li>Social Media Tracking Cookies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Managing Cookies</h2>
              <p>
                Since all cookies used on Acadara System are <strong className="text-white">Strictly Necessary</strong> for authenticating your account and securing system endpoints, disabling cookies in your browser settings will prevent you from logging in or receiving OTP verifications.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Contact Us</h2>
              <p>
                If you have questions regarding our use of authentication cookies, contact the project maintainer at{' '}
                <a href="mailto:bonsurdev@gmail.com" className="text-blue-400 hover:underline">bonsurdev@gmail.com</a>.
              </p>
            </section>
          </div>
        </Motion.div>
      </main>
    </div>
  )
}