interface ReviewStepProps {
  sessionData: any;
  participants: any[];
  targets: any[];
  validationErrors: string[];
}

export default function ReviewStep({ sessionData, participants, targets, validationErrors }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div
        className={`border rounded-lg p-4 ${
          validationErrors.length > 0
            ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
        }`}
      >
        <h4
          className={`text-base font-semibold mb-2 ${
            validationErrors.length > 0 ? "text-red-800 dark:text-red-200" : "text-green-800 dark:text-green-200"
          }`}
        >
          {validationErrors.length > 0 ? "⚠️ Review Required" : "✅ Ready to Submit"}
        </h4>
        {validationErrors.length > 0 ? (
          <>
            <p className="text-sm text-red-700 dark:text-red-300 mb-2">Please fix the following errors:</p>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 list-disc list-inside">
              {validationErrors.map((error: string, index: number) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm text-green-700 dark:text-green-300">
            All information is complete. Review your session details below before submitting.
          </p>
        )}
      </div>

      {/* Session Summary */}
      <div className="space-y-4">
        <div className="border border-gray-200 dark:border-neutral-700 rounded-lg p-4">
          <h5 className="font-medium text-gray-800 dark:text-neutral-200 mb-3">Session Information</h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-neutral-400">Assignment:</span>
              <span className="ml-2 text-gray-700 dark:text-neutral-300">{sessionData.assignment_id ? "Selected" : "Not selected"}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-neutral-400">Day Period:</span>
              <span className="ml-2 text-gray-700 dark:text-neutral-300 capitalize">{sessionData.dayPeriod || "Not set"}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-neutral-400">Time to First Shot:</span>
              <span className="ml-2 text-gray-700 dark:text-neutral-300">
                {sessionData.timeToFirstShot ? `${sessionData.timeToFirstShot}s` : "Not set"}
              </span>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 dark:border-neutral-700 rounded-lg p-4">
          <h5 className="font-medium text-gray-800 dark:text-neutral-200 mb-3">Participants ({participants.length})</h5>
          <div className="space-y-2">
            {participants.map((p: any) => (
              <div key={p.userId} className="flex items-center gap-4 text-sm">
                <span className="text-gray-700 dark:text-neutral-300">{p.name}</span>
                <span className="text-gray-500 dark:text-neutral-400">• {p.userDuty}</span>
                <span className="text-gray-500 dark:text-neutral-400">• {p.position}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-gray-200 dark:border-neutral-700 rounded-lg p-4">
          <h5 className="font-medium text-gray-800 dark:text-neutral-200 mb-3">Targets ({targets.length})</h5>
          <div className="space-y-2">
            {targets.map((t: any, index: number) => (
              <div key={t.id} className="flex items-center gap-4 text-sm">
                <span className="text-gray-700 dark:text-neutral-300">Target {index + 1}</span>
                <span className="text-gray-500 dark:text-neutral-400">• {t.distance}m</span>
                <span className="text-gray-500 dark:text-neutral-400">• {t.totalHits || 0} hits</span>
                {t.totalHits >= 2 && <span className="text-green-600 dark:text-green-400">• Eliminated</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}