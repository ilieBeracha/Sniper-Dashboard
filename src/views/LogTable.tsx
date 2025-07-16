import BaseDashboardCard from "@/components/base/BaseDashboardCard";

export default function LogTable() {
  return (
    <BaseDashboardCard header="Feeds" tooltipContent="View and manage your feeds">
      <div className="py-3 px-5 flex flex-wrap justify-between items-center gap-2 border-b border-gray-200 dark:border-neutral-700">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-medium text-gray-800 dark:text-neutral-200">Feeds</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="py-1.5 px-2.5 inline-flex items-center gap-x-2 text-[13px] rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-200 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
          >
            <svg
              className="shrink-0 size-3.5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              <path d="M12 18v-6" />
              <path d="m9 15 3 3 3-3" />
            </svg>
            Export
          </button>

          <button
            type="button"
            className="py-1.5 px-2.5 inline-flex items-center gap-x-2 text-[13px] rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-200 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
          >
            <svg
              className="shrink-0 size-3.5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="21" x2="14" y1="4" y2="4" />
              <line x1="10" x2="3" y1="4" y2="4" />
              <line x1="21" x2="12" y1="12" y2="12" />
              <line x1="8" x2="3" y1="12" y2="12" />
              <line x1="21" x2="16" y1="20" y2="20" />
              <line x1="12" x2="3" y1="20" y2="20" />
              <line x1="14" x2="14" y1="2" y2="6" />
              <line x1="8" x2="8" y1="10" y2="14" />
              <line x1="16" x2="16" y1="18" y2="22" />
            </svg>
            Filter
          </button>
        </div>
      </div>

      <div className="py-3 px-5 border-b border-gray-200 dark:border-neutral-700">
        <div className="flex justify-between gap-x-3">
          <div className="w-1/2">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
                <svg
                  className="shrink-0 size-4 text-gray-500 dark:text-neutral-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <input
                type="text"
                className="py-1 sm:py-1.5 ps-10 pe-8 block w-full bg-gray-100 border-transparent rounded-lg sm:text-sm focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:placeholder:text-neutral-400 dark:focus:bg-neutral-800 dark:focus:ring-neutral-600"
                placeholder="Search..."
              />
              <div className="absolute inset-y-0 end-0 flex items-center z-20 pe-1">
                <button
                  type="button"
                  className="inline-flex shrink-0 justify-center items-center size-6 rounded-full text-gray-500 hover:text-indigo-600 focus:outline-hidden focus:text-indigo-600 dark:text-neutral-500 dark:hover:text-indigo-500 dark:focus:text-indigo-500"
                  aria-label="Close"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m15 9-6 6" />
                    <path d="m9 9 6 6" />
                  </svg>
                </button>
              </div>
            </div>
            {/* End Search Input */}
          </div>

          {/* Switch/Toggle */}
          <div className="flex flex-wrap justify-between items-center gap-2">
            <label htmlFor="hs-pro-avdchli" className="flex-1 cursor-pointer text-sm text-gray-500 dark:text-neutral-500">
              Group columns
            </label>
            <label htmlFor="hs-pro-avdchli" className="relative inline-block w-9 h-5 cursor-pointer">
              <input type="checkbox" id="hs-pro-avdchli" className="peer sr-only" />
              <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-indigo-600 dark:bg-neutral-700 dark:peer-checked:bg-indigo-500 peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
              <span className="absolute top-1/2 start-0.5 -translate-y-1/2 size-4 bg-white rounded-full shadow-sm !transition-transform duration-200 ease-in-out peer-checked:translate-x-full dark:bg-neutral-400 dark:peer-checked:bg-white"></span>
            </label>
          </div>
          {/* End Switch/Toggle */}
        </div>
      </div>

      <div className="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
        <div className="min-w-full inline-block align-middle">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
            <thead>
              <tr>
                <th scope="col" className="px-4 py-2">
                  <input
                    type="checkbox"
                    className="shrink-0 border-gray-300 rounded-sm text-indigo-600 focus:ring-indigo-500 checked:border-indigo-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-indigo-500 dark:checked:border-indigo-500 dark:focus:ring-offset-gray-800"
                  />
                </th>

                <th scope="col">
                  <div className="px-5 py-2 text-start">
                    <span className="font-medium text-xs uppercase text-gray-800 dark:text-neutral-200">Status</span>
                  </div>
                </th>

                <th scope="col">
                  <div className="px-5 py-2 text-start">
                    <span className="font-medium text-xs uppercase text-gray-800 dark:text-neutral-200">Source</span>
                  </div>
                </th>

                <th scope="col" className="min-w-72">
                  <div className="px-5 py-2 text-start">
                    <span className="font-medium text-xs uppercase text-gray-800 dark:text-neutral-200">Incident name</span>
                  </div>
                </th>

                <th scope="col">
                  <div className="px-5 py-2 text-start">
                    <span className="font-medium text-xs uppercase text-gray-800 dark:text-neutral-200">Resources</span>
                  </div>
                </th>

                <th scope="col" className="min-w-50">
                  <div className="px-5 py-2 text-start">
                    <span className="font-medium text-xs uppercase text-gray-800 dark:text-neutral-200">Time generated</span>
                  </div>
                </th>

                <th scope="col">
                  <div className="px-5 py-2 text-start">
                    <span className="font-medium text-xs uppercase text-gray-800 dark:text-neutral-200">Severity</span>
                  </div>
                </th>

                <th scope="col" className="min-w-34">
                  <div className="px-5 py-2 text-center">
                    <span className="font-medium text-xs uppercase text-gray-800 dark:text-neutral-200">In audit scope</span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              <tr>
                <td className="size-px whitespace-nowrap text-center px-4.5 py-4">
                  <input
                    type="checkbox"
                    className="shrink-0 border-gray-300 rounded-sm text-indigo-600 focus:ring-indigo-500 checked:border-indigo-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-indigo-500 dark:checked:border-indigo-500 dark:focus:ring-offset-gray-800"
                  />
                </td>
                <td className="size-px px-5 py-1 whitespace-nowrap text-center">
                  <span className="flex items-center gap-x-2">
                    <span className="block size-3 bg-cyan-400 rounded-xs"></span>
                    <span className="text-sm text-gray-600 dark:text-neutral-400">New</span>
                  </span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">ThreatEye</span>
                </td>
                <td className="size-px px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">Port scanning activity</span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">Japan</span>
                </td>
                <td className="size-px px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">7/31/2023, 11:42:29 AM</span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="flex items-center gap-x-2">
                    <span className="flex items-center gap-0.5">
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-orange-400 rounded-full"></span>
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-orange-400 rounded-full"></span>
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-gray-300 rounded-full dark:bg-neutral-600"></span>
                    </span>
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Medium</span>
                  </span>
                </td>
                <td className="size-px px-5 py-1 whitespace-nowrap text-center">
                  <span className="inline-flex shrink-0 justify-center items-center size-4 bg-green-500 text-white rounded-full">
                    <svg
                      className="shrink-0 size-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                </td>
              </tr>

              <tr>
                <td className="size-px whitespace-nowrap text-center px-4.5 py-4">
                  <input
                    type="checkbox"
                    className="shrink-0 border-gray-300 rounded-sm text-indigo-600 focus:ring-indigo-500 checked:border-indigo-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-indigo-500 dark:checked:border-indigo-500 dark:focus:ring-offset-gray-800"
                  />
                </td>
                <td className="size-px px-5 py-1 whitespace-nowrap text-center">
                  <span className="flex items-center gap-x-2">
                    <span className="block size-3 bg-indigo-700 rounded-xs"></span>
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Closed</span>
                  </span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">ThreatEye</span>
                </td>
                <td className="size-px px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">Use of malicious URL detected</span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">Unknown</span>
                </td>
                <td className="size-px px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">7/23/2022, 8:41:47 AM</span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="flex items-center gap-x-2">
                    <span className="flex items-center gap-0.5">
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-red-500 rounded-full"></span>
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-red-500 rounded-full"></span>
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-red-500 rounded-full"></span>
                    </span>
                    <span className="text-sm text-gray-600 dark:text-neutral-400">High</span>
                  </span>
                </td>
                <td className="size-px px-5 py-1 whitespace-nowrap text-center">
                  <span className="inline-flex shrink-0 justify-center items-center size-4 bg-gray-300 text-gray-800 rounded-full dark:bg-neutral-600 dark:text-neutral-200">
                    <svg
                      className="shrink-0 size-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </span>
                </td>
              </tr>

              <tr>
                <td className="size-px whitespace-nowrap text-center px-4.5 py-4">
                  <input
                    type="checkbox"
                    className="shrink-0 border-gray-300 rounded-sm text-indigo-600 focus:ring-indigo-500 checked:border-indigo-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-indigo-500 dark:checked:border-indigo-500 dark:focus:ring-offset-gray-800"
                  />
                </td>
                <td className="size-px px-5 py-1 whitespace-nowrap text-center">
                  <span className="flex items-center gap-x-2">
                    <span className="block size-3 bg-indigo-500 rounded-xs"></span>
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Active</span>
                  </span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">ThreatEye</span>
                </td>
                <td className="size-px px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">Unusual application behavior</span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">Unknown</span>
                </td>
                <td className="size-px px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">4/2/2024, 12:42:38 PM</span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="flex items-center gap-x-2">
                    <span className="flex items-center gap-0.5">
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-gray-300 rounded-full dark:bg-neutral-600"></span>
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-gray-300 rounded-full dark:bg-neutral-600"></span>
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-gray-300 rounded-full dark:bg-neutral-600"></span>
                    </span>
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Informational</span>
                  </span>
                </td>
                <td className="size-px px-5 py-1 whitespace-nowrap text-center">
                  <span className="inline-flex shrink-0 justify-center items-center size-4 bg-gray-300 text-gray-800 rounded-full dark:bg-neutral-600 dark:text-neutral-200">
                    <svg
                      className="shrink-0 size-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </span>
                </td>
              </tr>

              <tr>
                <td className="size-px whitespace-nowrap text-center px-4.5 py-4">
                  <input
                    type="checkbox"
                    className="shrink-0 border-gray-300 rounded-sm text-indigo-600 focus:ring-indigo-500 checked:border-indigo-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-indigo-500 dark:checked:border-indigo-500 dark:focus:ring-offset-gray-800"
                  />
                </td>
                <td className="size-px px-5 py-1 whitespace-nowrap text-center">
                  <span className="flex items-center gap-x-2">
                    <span className="block size-3 bg-cyan-400 rounded-xs"></span>
                    <span className="text-sm text-gray-600 dark:text-neutral-400">New</span>
                  </span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">Preline</span>
                </td>
                <td className="size-px px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">Suspicious login attempt</span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">Unknown</span>
                </td>
                <td className="size-px px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">11/21/2021, 6:17:44 AM</span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="flex items-center gap-x-2">
                    <span className="flex items-center gap-0.5">
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-orange-400 rounded-full"></span>
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-orange-400 rounded-full"></span>
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-gray-300 rounded-full dark:bg-neutral-600"></span>
                    </span>
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Medium</span>
                  </span>
                </td>
                <td className="size-px px-5 py-1 whitespace-nowrap text-center">
                  <span className="inline-flex shrink-0 justify-center items-center size-4 bg-green-500 text-white rounded-full">
                    <svg
                      className="shrink-0 size-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                </td>
              </tr>

              <tr>
                <td className="size-px whitespace-nowrap text-center px-4.5 py-4">
                  <input
                    type="checkbox"
                    className="shrink-0 border-gray-300 rounded-sm text-indigo-600 focus:ring-indigo-500 checked:border-indigo-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-indigo-500 dark:checked:border-indigo-500 dark:focus:ring-offset-gray-800"
                  />
                </td>
                <td className="size-px px-5 py-1 whitespace-nowrap text-center">
                  <span className="flex items-center gap-x-2">
                    <span className="block size-3 bg-indigo-700 rounded-xs"></span>
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Closed</span>
                  </span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">ShieldX</span>
                </td>
                <td className="size-px px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">Unusual application behavior</span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">Germany</span>
                </td>
                <td className="size-px px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">11/9/2023, 5:49:19 AM</span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="flex items-center gap-x-2">
                    <span className="flex items-center gap-0.5">
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-yellow-400 rounded-full"></span>
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-gray-300 rounded-full dark:bg-neutral-600"></span>
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-gray-300 rounded-full dark:bg-neutral-600"></span>
                    </span>
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Low</span>
                  </span>
                </td>
                <td className="size-px px-5 py-1 whitespace-nowrap text-center">
                  <span className="inline-flex shrink-0 justify-center items-center size-4 bg-gray-300 text-gray-800 rounded-full dark:bg-neutral-600 dark:text-neutral-200">
                    <svg
                      className="shrink-0 size-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </span>
                </td>
              </tr>

              <tr>
                <td className="size-px whitespace-nowrap text-center px-4.5 py-4">
                  <input
                    type="checkbox"
                    className="shrink-0 border-gray-300 rounded-sm text-indigo-600 focus:ring-indigo-500 checked:border-indigo-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-indigo-500 dark:checked:border-indigo-500 dark:focus:ring-offset-gray-800"
                  />
                </td>
                <td className="size-px px-5 py-1 whitespace-nowrap text-center">
                  <span className="flex items-center gap-x-2">
                    <span className="block size-3 bg-cyan-400 rounded-xs"></span>
                    <span className="text-sm text-gray-600 dark:text-neutral-400">New</span>
                  </span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">CyberWall</span>
                </td>
                <td className="size-px px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">Data exfiltration behavior</span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">Canada</span>
                </td>
                <td className="size-px px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">3/14/2023, 7:53:42 AM</span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="flex items-center gap-x-2">
                    <span className="flex items-center gap-0.5">
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-red-500 rounded-full"></span>
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-red-500 rounded-full"></span>
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-red-500 rounded-full"></span>
                    </span>
                    <span className="text-sm text-gray-600 dark:text-neutral-400">High</span>
                  </span>
                </td>
                <td className="size-px px-5 py-1 whitespace-nowrap text-center">
                  <span className="inline-flex shrink-0 justify-center items-center size-4 bg-green-500 text-white rounded-full">
                    <svg
                      className="shrink-0 size-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                </td>
              </tr>

              <tr>
                <td className="size-px whitespace-nowrap text-center px-4.5 py-4">
                  <input
                    type="checkbox"
                    className="shrink-0 border-gray-300 rounded-sm text-indigo-600 focus:ring-indigo-500 checked:border-indigo-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-indigo-500 dark:checked:border-indigo-500 dark:focus:ring-offset-gray-800"
                  />
                </td>
                <td className="size-px px-5 py-1 whitespace-nowrap text-center">
                  <span className="flex items-center gap-x-2">
                    <span className="block size-3 bg-cyan-400 rounded-xs"></span>
                    <span className="text-sm text-gray-600 dark:text-neutral-400">New</span>
                  </span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">NetGuard</span>
                </td>
                <td className="size-px px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">Data exfiltration behavior</span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">Singapore</span>
                </td>
                <td className="size-px px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">4/14/2019, 1:25:16 AM</span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="flex items-center gap-x-2">
                    <span className="flex items-center gap-0.5">
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-gray-300 rounded-full dark:bg-neutral-600"></span>
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-gray-300 rounded-full dark:bg-neutral-600"></span>
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-gray-300 rounded-full dark:bg-neutral-600"></span>
                    </span>
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Informational</span>
                  </span>
                </td>
                <td className="size-px px-5 py-1 whitespace-nowrap text-center">
                  <span className="inline-flex shrink-0 justify-center items-center size-4 bg-green-500 text-white rounded-full">
                    <svg
                      className="shrink-0 size-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                </td>
              </tr>

              <tr>
                <td className="size-px whitespace-nowrap text-center px-4.5 py-4">
                  <input
                    type="checkbox"
                    className="shrink-0 border-gray-300 rounded-sm text-indigo-600 focus:ring-indigo-500 checked:border-indigo-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-indigo-500 dark:checked:border-indigo-500 dark:focus:ring-offset-gray-800"
                  />
                </td>
                <td className="size-px px-5 py-1 whitespace-nowrap text-center">
                  <span className="flex items-center gap-x-2">
                    <span className="block size-3 bg-indigo-700 rounded-xs"></span>
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Closed</span>
                  </span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">NetGuard</span>
                </td>
                <td className="size-px px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">Port scanning activity</span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">Germany</span>
                </td>
                <td className="size-px px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">8/2/2020, 7:35:47 AM</span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="flex items-center gap-x-2">
                    <span className="flex items-center gap-0.5">
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-yellow-400 rounded-full"></span>
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-gray-300 rounded-full dark:bg-neutral-600"></span>
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-gray-300 rounded-full dark:bg-neutral-600"></span>
                    </span>
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Low</span>
                  </span>
                </td>
                <td className="size-px px-5 py-1 whitespace-nowrap text-center">
                  <span className="inline-flex shrink-0 justify-center items-center size-4 bg-gray-300 text-gray-800 rounded-full dark:bg-neutral-600 dark:text-neutral-200">
                    <svg
                      className="shrink-0 size-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </span>
                </td>
              </tr>

              <tr>
                <td className="size-px whitespace-nowrap text-center px-4.5 py-4">
                  <input
                    type="checkbox"
                    className="shrink-0 border-gray-300 rounded-sm text-indigo-600 focus:ring-indigo-500 checked:border-indigo-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-indigo-500 dark:checked:border-indigo-500 dark:focus:ring-offset-gray-800"
                  />
                </td>
                <td className="size-px px-5 py-1 whitespace-nowrap text-center">
                  <span className="flex items-center gap-x-2">
                    <span className="block size-3 bg-indigo-700 rounded-xs"></span>
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Closed</span>
                  </span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">CyberWall</span>
                </td>
                <td className="size-px px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">Suspicious login attempt</span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">Germany</span>
                </td>
                <td className="size-px px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">2/19/2023, 4:35:26 PM</span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="flex items-center gap-x-2">
                    <span className="flex items-center gap-0.5">
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-orange-400 rounded-full"></span>
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-orange-400 rounded-full"></span>
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-gray-300 rounded-full dark:bg-neutral-600"></span>
                    </span>
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Medium</span>
                  </span>
                </td>
                <td className="size-px px-5 py-1 whitespace-nowrap text-center">
                  <span className="inline-flex shrink-0 justify-center items-center size-4 bg-gray-300 text-gray-800 rounded-full dark:bg-neutral-600 dark:text-neutral-200">
                    <svg
                      className="shrink-0 size-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </span>
                </td>
              </tr>

              <tr>
                <td className="size-px whitespace-nowrap text-center px-4.5 py-4">
                  <input
                    type="checkbox"
                    className="shrink-0 border-gray-300 rounded-sm text-indigo-600 focus:ring-indigo-500 checked:border-indigo-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-indigo-500 dark:checked:border-indigo-500 dark:focus:ring-offset-gray-800"
                  />
                </td>
                <td className="size-px px-5 py-1 whitespace-nowrap text-center">
                  <span className="flex items-center gap-x-2">
                    <span className="block size-3 bg-cyan-400 rounded-xs"></span>
                    <span className="text-sm text-gray-600 dark:text-neutral-400">New</span>
                  </span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">SafeLink</span>
                </td>
                <td className="size-px px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">Multiple failed logins</span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">Japan</span>
                </td>
                <td className="size-px px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">10/18/2021, 1:06:49 PM</span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="flex items-center gap-x-2">
                    <span className="flex items-center gap-0.5">
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-yellow-400 rounded-full"></span>
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-gray-300 rounded-full dark:bg-neutral-600"></span>
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-gray-300 rounded-full dark:bg-neutral-600"></span>
                    </span>
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Low</span>
                  </span>
                </td>
                <td className="size-px px-5 py-1 whitespace-nowrap text-center">
                  <span className="inline-flex shrink-0 justify-center items-center size-4 bg-green-500 text-white rounded-full">
                    <svg
                      className="shrink-0 size-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                </td>
              </tr>

              <tr>
                <td className="size-px whitespace-nowrap text-center px-4.5 py-4">
                  <input
                    type="checkbox"
                    className="shrink-0 border-gray-300 rounded-sm text-indigo-600 focus:ring-indigo-500 checked:border-indigo-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-indigo-500 dark:checked:border-indigo-500 dark:focus:ring-offset-gray-800"
                  />
                </td>
                <td className="size-px px-5 py-1 whitespace-nowrap text-center">
                  <span className="flex items-center gap-x-2">
                    <span className="block size-3 bg-cyan-400 rounded-xs"></span>
                    <span className="text-sm text-gray-600 dark:text-neutral-400">New</span>
                  </span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">ThreatEye</span>
                </td>
                <td className="size-px px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">Data exfiltration behavior</span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">Japan</span>
                </td>
                <td className="size-px px-5 py-1">
                  <span className="text-sm text-gray-600 dark:text-neutral-400">12/22/2019, 5:19:26 PM</span>
                </td>
                <td className="size-px whitespace-nowrap px-5 py-1">
                  <span className="flex items-center gap-x-2">
                    <span className="flex items-center gap-0.5">
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-red-500 rounded-full"></span>
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-red-500 rounded-full"></span>
                      <span className="shrink-0 w-1 h-3.5 inline-block bg-red-500 rounded-full"></span>
                    </span>
                    <span className="text-sm text-gray-600 dark:text-neutral-400">High</span>
                  </span>
                </td>
                <td className="size-px px-5 py-1 whitespace-nowrap text-center">
                  <span className="inline-flex shrink-0 justify-center items-center size-4 bg-gray-300 text-gray-800 rounded-full dark:bg-neutral-600 dark:text-neutral-200">
                    <svg
                      className="shrink-0 size-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          {/* End Table */}
        </div>
      </div>
      {/* End Table Section */}
      {/* Footer */}
      <div className="py-3 px-5 border-t border-gray-200 dark:border-neutral-800">
        {/* Footer */}
        <div className="grid grid-cols-2 items-center gap-y-2 sm:gap-y-0 sm:gap-x-5">
          <p className="text-sm text-gray-800 dark:text-neutral-200">
            <span className="font-medium">20</span>
            <span className="text-gray-500 dark:text-neutral-500">results</span>
          </p>

          {/* Pagination */}
          <nav className="flex justify-end items-center gap-x-1" aria-label="Pagination">
            <button
              type="button"
              className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-white/10 dark:focus:bg-neutral-700"
              aria-label="Previous"
            >
              <svg
                className="shrink-0 size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span className="sr-only">Previous</span>
            </button>
            <div className="flex items-center gap-x-1">
              <span
                className="min-h-9.5 min-w-9.5 flex justify-center items-center bg-gray-100 text-gray-800 py-2 px-3 text-sm rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:text-white"
                aria-current="page"
              >
                1
              </span>
              <span className="min-h-9.5 flex justify-center items-center text-gray-500 py-2 px-1.5 text-sm dark:text-neutral-500">of</span>
              <span className="min-h-9.5 flex justify-center items-center text-gray-500 py-2 px-1.5 text-sm dark:text-neutral-500">3</span>
            </div>
            <button
              type="button"
              className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-white/10 dark:focus:bg-neutral-700"
              aria-label="Next"
            >
              <span className="sr-only">Next</span>
              <svg
                className="shrink-0 size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </nav>
          {/* End Pagination */}
        </div>
        {/* End Footer */}
      </div>
      {/* End Footer */}
    </BaseDashboardCard>
  );
}
