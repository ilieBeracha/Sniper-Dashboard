import { Check, Timer } from "lucide-react";

interface SessionSetupStepProps {
  sessionData: any;
  setSessionData: (data: any) => void;
  assignments: any[];
}

export default function SessionSetupStep({ sessionData, setSessionData, assignments }: SessionSetupStepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-base font-semibold text-blue-800 dark:text-blue-200 mb-2">📋 Session Information</h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">Set up the basic information about your training session. All fields are required.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Assignment Select */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
            Assignment <span className="text-red-500">*</span>
            <span className="block text-xs text-gray-500 dark:text-neutral-400 mt-1">The training exercise being performed</span>
          </label>
          <select
            value={sessionData.assignment_id || ""}
            onChange={(e) => setSessionData({ ...sessionData, assignment_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
          >
            <option value="">Select Assignment</option>
            {assignments.map((assignment: any) => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.assignment_name}
              </option>
            ))}
          </select>
        </div>

        {/* Day Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
            Day Period <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSessionData({ ...sessionData, dayPeriod: "day" })}
              className={`relative flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                sessionData.dayPeriod === "day"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                  : "border-gray-300 bg-white hover:border-gray-400 dark:border-neutral-600 dark:bg-neutral-800 dark:hover:border-neutral-500"
              }`}
            >
              <svg
                className={`w-8 h-8 mb-2 ${sessionData.dayPeriod === "day" ? "text-yellow-500" : "text-gray-400 dark:text-neutral-500"}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
              <span
                className={`text-sm font-medium ${
                  sessionData.dayPeriod === "day" ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-neutral-300"
                }`}
              >
                Day
              </span>
              {sessionData.dayPeriod === "day" && (
                <div className="absolute top-2 right-2">
                  <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => setSessionData({ ...sessionData, dayPeriod: "night" })}
              className={`relative flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                sessionData.dayPeriod === "night"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                  : "border-gray-300 bg-white hover:border-gray-400 dark:border-neutral-600 dark:bg-neutral-800 dark:hover:border-neutral-500"
              }`}
            >
              <svg
                className={`w-8 h-8 mb-2 ${
                  sessionData.dayPeriod === "night" ? "text-blue-400 dark:text-blue-300" : "text-gray-400 dark:text-neutral-500"
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                  clipRule="evenodd"
                />
              </svg>
              <span
                className={`text-sm font-medium ${
                  sessionData.dayPeriod === "night" ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-neutral-300"
                }`}
              >
                Night
              </span>
              {sessionData.dayPeriod === "night" && (
                <div className="absolute top-2 right-2">
                  <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Time to First Shot - Enhanced Timer Style */}
        <div className="md:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
            Time to First Shot <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-1 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 animate-pulse" />
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    value={sessionData.timeToFirstShot ?? ""}
                    onChange={(e) => {
                      const value = e.target.value === "" ? null : parseInt(e.target.value);
                      setSessionData({ ...sessionData, timeToFirstShot: value });
                    }}
                    className="w-16 sm:w-20 text-2xl sm:text-3xl font-bold text-center bg-transparent border-b-2 border-blue-300 dark:border-blue-600 focus:outline-none focus:border-blue-500 dark:text-blue-100"
                    placeholder="0"
                    min="0"
                    max="999"
                  />
                  <span className="text-lg sm:text-xl font-semibold text-blue-700 dark:text-blue-300">sec</span>
                </div>
              </div>
              <div className="sm:ml-auto flex flex-col items-center sm:items-end">
                <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">Quick presets:</span>
                <div className="flex gap-1">
                  {[3, 5, 10].map((seconds) => (
                    <button
                      key={seconds}
                      type="button"
                      onClick={() => setSessionData({ ...sessionData, timeToFirstShot: seconds })}
                      className="px-2 py-1 text-xs font-medium rounded bg-blue-100 hover:bg-blue-200 dark:bg-blue-800/50 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 transition-colors"
                    >
                      {seconds}s
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <div draggable={true} className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
            Session Note <span className="text-gray-400">(Optional)</span>
          </label>
          <textarea
            value={sessionData.note || ""}
            onChange={(e) => setSessionData({ ...sessionData, note: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
            rows={3}
            placeholder="Add any session notes..."
          />
        </div>
      </div>
    </div>
  );
}
