import { OTPVerification } from "@/components/otp-verification"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            OTP Verification Service
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Secure phone number verification with one-time passwords
          </p>
        </div>
        
        <OTPVerification />
        
        <div className="mt-16 mx-auto max-w-3xl">
          <div className="rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
              Features
            </h2>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Secure OTP generation and verification</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Redis-based OTP storage with automatic expiration</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Rate limiting to prevent abuse</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Twilio SMS integration (configurable)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Beautiful, accessible UI with shadcn/ui</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>JWT token generation on successful verification</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-8 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-6">
            <h3 className="text-lg font-semibold mb-2 text-yellow-900 dark:text-yellow-100">
              Development Mode
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              In development mode without Twilio configured, the OTP will be displayed in the UI for testing purposes. 
              Configure Twilio credentials to enable real SMS sending.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}