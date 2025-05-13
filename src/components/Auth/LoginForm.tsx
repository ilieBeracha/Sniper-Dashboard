import React, { useState } from "react";
import BaseInput from "@/components/BaseInput";

export function ModernLogin({ AuthSubmit }: { AuthSubmit: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    AuthSubmit({ email, password });
  };

  const emailIcon = (
    <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
      />
    </svg>
  );

  const passwordIcon = (
    <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );

  const togglePasswordIcon = (
    <button type="button" onClick={() => setShowPassword(!showPassword)} className="h-5 w-5 text-gray-600 hover:text-gray-200 transition-colors">
      {showPassword ? (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ) : (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
          />
        </svg>
      )}
    </button>
  );

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <BaseInput
        label="Email address"
        type="email"
        id="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        leftIcon={emailIcon}
      />

      <BaseInput
        label="Password"
        type={showPassword ? "text" : "password"}
        id="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        leftIcon={passwordIcon}
        rightIcon={togglePasswordIcon}
      />

      <div className="space-y-4">
        <button
          type="submit"
          className="w-full flex justify-center items-center px-4 py-4 rounded-2xl bg-white text-[#0A0A0A] font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] transition-all duration-200"
        >
          Sign In
        </button>
      </div>
    </form>
  );
}
