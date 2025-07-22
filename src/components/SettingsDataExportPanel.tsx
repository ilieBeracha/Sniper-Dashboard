export default function SettingsDataExportPanel() {
  return (
    <>
      <main className="px-4  sm:px-6 lg:flex-auto lg:px-0 ">
        <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
          <div>
            <h2 className="text-base/7 font-semibold text-gray-900">Profile</h2>
            <p className="mt-1 text-sm/6 text-gray-500">This information will be displayed publicly so be careful what you share.</p>

            <dl className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm/6">
              <div className="py-6 sm:flex">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Full name</dt>
                <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div className="text-gray-900">Tom Cook</div>
                  <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Update
                  </button>
                </dd>
              </div>
              <div className="py-6 sm:flex">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Email address</dt>
                <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div className="text-gray-900">tom.cook@example.com</div>
                  <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Update
                  </button>
                </dd>
              </div>
              <div className="py-6 sm:flex">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Title</dt>
                <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div className="text-gray-900">Human Resources Manager</div>
                  <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Update
                  </button>
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-base/7 font-semibold text-gray-900">Bank accounts</h2>
            <p className="mt-1 text-sm/6 text-gray-500">Connect bank accounts to your account.</p>

            <ul role="list" className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm/6">
              <li className="flex justify-between gap-x-6 py-6">
                <div className="font-medium text-gray-900">TD Canada Trust</div>
                <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Update
                </button>
              </li>
              <li className="flex justify-between gap-x-6 py-6">
                <div className="font-medium text-gray-900">Royal Bank of Canada</div>
                <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Update
                </button>
              </li>
            </ul>

            <div className="flex border-t border-gray-100 pt-6">
              <button type="button" className="text-sm/6 font-semibold text-indigo-600 hover:text-indigo-500">
                <span aria-hidden="true">+</span> Add another bank
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-base/7 font-semibold text-gray-900">Integrations</h2>
            <p className="mt-1 text-sm/6 text-gray-500">Connect applications to your account.</p>

            <ul role="list" className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm/6">
              <li className="flex justify-between gap-x-6 py-6">
                <div className="font-medium text-gray-900">QuickBooks</div>
                <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Update
                </button>
              </li>
            </ul>

            <div className="flex border-t border-gray-100 pt-6">
              <button type="button" className="text-sm/6 font-semibold text-indigo-600 hover:text-indigo-500">
                <span aria-hidden="true">+</span> Add another application
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-base/7 font-semibold text-gray-900">Language and dates</h2>
            <p className="mt-1 text-sm/6 text-gray-500">Choose what language and date format to use throughout your account.</p>

            <dl className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm/6">
              <div className="py-6 sm:flex">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Language</dt>
                <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div className="text-gray-900">English</div>
                  <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Update
                  </button>
                </dd>
              </div>
              <div className="py-6 sm:flex">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Date format</dt>
                <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div className="text-gray-900">DD-MM-YYYY</div>
                  <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Update
                  </button>
                </dd>
              </div>
              <div className="flex pt-6">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Automatic timezone</dt>
                <dd className="flex flex-auto items-center justify-end">
                  <div className="group relative inline-flex w-8 shrink-0 rounded-full bg-gray-200 p-px inset-ring inset-ring-gray-900/5 outline-offset-2 outline-indigo-600 transition-colors duration-200 ease-in-out has-checked:bg-indigo-600 has-focus-visible:outline-2 dark:bg-white/5 dark:inset-ring-white/10 dark:outline-indigo-500 dark:has-checked:bg-indigo-500">
                    <span className="size-4 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-checked:translate-x-3.5" />
                    <input
                      defaultChecked
                      name="automatic-timezone"
                      type="checkbox"
                      aria-label="Automatic timezone"
                      className="absolute inset-0 appearance-none focus:outline-hidden"
                    />
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </>
  );
}
