import React, { useState } from "react";

export default function TeamMemberRegisterForm({
  AuthSubmit,
}: {
  AuthSubmit: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    invite_code: string;
  }) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    AuthSubmit({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      invite_code: inviteCode,
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="first-name"
          className="block text-sm font-medium text-gray-400"
        >
          First name
        </label>
        <div className="mt-2">
          <input
            type="text"
            id="first-name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="block w-full rounded-md bg-gray-800 px-3 py-1.5 text-base text-gray-300 outline-1 outline-gray-600 focus:outline-indigo-600 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="last-name"
          className="block text-sm font-medium text-gray-400"
        >
          Last name
        </label>
        <div className="mt-2">
          <input
            type="text"
            id="last-name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="block w-full rounded-md bg-gray-800 px-3 py-1.5 text-base text-gray-300 outline-1 outline-gray-600 focus:outline-indigo-600 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-400"
        >
          Email address
        </label>
        <div className="mt-2">
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-md bg-gray-800 px-3 py-1.5 text-base text-gray-300 outline-1 outline-gray-600 focus:outline-indigo-600 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-400"
        >
          Password
        </label>
        <div className="mt-2">
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-md bg-gray-800 px-3 py-1.5 text-base text-gray-300 outline-1 outline-gray-600 focus:outline-indigo-600 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="invite-code"
          className="block text-sm font-medium text-gray-400"
        >
          Team Invite Code
        </label>
        <div className="mt-2">
          <input
            type="text"
            id="invite-code"
            required
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            className="block w-full rounded-md bg-gray-800 px-3 py-1.5 text-base text-gray-300 outline-1 outline-gray-600 focus:outline-indigo-600 sm:text-sm"
            placeholder="Enter the invite code from your team leader"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-all"
        >
          Join Team
        </button>
      </div>
    </form>
  );
}
