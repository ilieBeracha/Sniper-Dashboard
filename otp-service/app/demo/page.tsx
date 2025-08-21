"use client"

import { useState } from "react"
import { OTPVerification } from "@/components/otp-verification"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-xl font-semibold">SecureAuth OTP</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Enterprise-grade OTP Service</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Hero Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300">
                  🔐 Secure • Fast • Reliable
                </div>
                <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Phone Verification
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Made Simple
                  </span>
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300">
                  Protect your users with our enterprise-grade OTP verification system. 
                  SMS delivery in under 2 seconds worldwide.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">Bank-Level Security</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">256-bit encryption with Redis-backed storage</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">Global SMS Delivery</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Powered by Twilio's worldwide network</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">Smart Rate Limiting</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Prevent abuse with intelligent throttling</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="flex -space-x-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 ring-2 ring-white dark:ring-slate-900" />
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 ring-2 ring-white dark:ring-slate-900" />
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 ring-2 ring-white dark:ring-slate-900" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-slate-900 dark:text-white">Trusted by 10,000+ developers</p>
                  <p className="text-slate-600 dark:text-slate-400">5 billion OTPs delivered</p>
                </div>
              </div>
            </div>

            {/* Right Side - OTP Component */}
            <div className="relative">
              {/* Decorative Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-3xl transform rotate-3" />
              <div className="relative">
                <OTPVerification />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">99.9%</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">2s</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">Avg. Delivery Time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">180+</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">256-bit</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">Encryption</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}