import { Fragment } from "react";
import { Weapon } from "@/types/weapon";
import { useTheme } from "@/contexts/ThemeContext";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AssetsWeaponsTable({ weapons }: { weapons: Weapon[] }) {
  const { theme } = useTheme();
  const weaponsByType = weapons.reduce((acc: { [key: string]: Weapon[] }, weapon) => {
    const type = weapon.weapon_type || "Unspecified";
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(weapon);
    return acc;
  }, {});

  return (
    <div className="">
      <div className={`flow-root rounded-xl border transition-colors duration-200 ${
        theme === 'dark' 
          ? 'bg-black/20 border-white/5' 
          : 'bg-gray-50/50 border-gray-200'
      }`}>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className={`min-w-full divide-y transition-colors duration-200 ${
              theme === 'dark' ? 'divide-white/10' : 'divide-gray-200'
            }`}>
              <thead>
                <tr>
                  <th className={`py-4 pl-6 pr-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-200 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>Serial Number</th>
                  <th className={`px-3 py-4 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-200 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>MV</th>
                  <th className={`px-3 py-4 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-200 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>Created At</th>
                  <th className="relative py-4 pl-3 pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className={`transition-colors duration-200 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {Object.entries(weaponsByType).map(([weaponType, typeWeapons]) => (
                  <Fragment key={weaponType}>
                    <tr className={`border-t transition-colors duration-200 ${
                      theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                    }`}>
                      <th
                        scope="colgroup"
                        colSpan={5}
                        className={`py-3 pl-6 pr-3 text-left text-sm font-medium border-l-2 transition-colors duration-200 ${
                          theme === 'dark' 
                            ? 'bg-blue-500/10 text-blue-200 border-blue-400' 
                            : 'bg-blue-50 text-blue-700 border-blue-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          {weaponType}
                        </div>
                      </th>
                    </tr>
                    {typeWeapons.map((weapon, weaponIdx) => (
                      <tr
                        key={weapon.id}
                        className={classNames(
                          weaponIdx === 0 ? (theme === 'dark' ? "border-white/10" : "border-gray-200") : (theme === 'dark' ? "border-white/5" : "border-gray-100"),
                          `border-t transition-colors duration-200 ${
                            theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                          }`,
                        )}
                      >
                        <td className={`whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium transition-colors duration-200 ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                            {weapon.serial_number}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium border transition-colors duration-200 ${
                            theme === 'dark' 
                              ? 'bg-white/5 text-gray-300 border-white/10' 
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                          }`}>
                            {weapon.mv || "N/A"}
                          </span>
                        </td>
                        <td className={`whitespace-nowrap px-3 py-4 text-sm transition-colors duration-200 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>{new Date(weapon.created_at).toLocaleDateString()}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm">
                          <button className={`px-3 py-1.5 rounded border text-xs font-medium transition-all duration-200 ${
                            theme === 'dark' 
                              ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 hover:text-blue-100 border-blue-500/30 hover:border-blue-500/50' 
                              : 'bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-800 border-blue-200 hover:border-blue-300'
                          }`}>
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
