import { Send } from "lucide-react";

export default function SubmitStep() {
  return (
    <div className="text-center py-12">
      <div className="mb-6">
        <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
          <Send className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-200 mb-2">Ready to Submit</h3>
      <p className="text-gray-600 dark:text-neutral-400">
        Your session statistics are ready to be saved. Click the Submit button below to complete the process.
      </p>
    </div>
  );
}