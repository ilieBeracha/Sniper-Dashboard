import { Fragment } from "react";
import { Weapon } from "@/types/weapon";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AssetsWeaponsTable({ weapons }: { weapons: Weapon[] }) {
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
      <div className="flow-root bg-black/20 rounded-xl border border-white/5">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-white/10">
              <thead>
                <tr>
                  <th className="py-4 pl-6 pr-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Serial Number</th>
                  <th className="px-3 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Team ID</th>
                  <th className="px-3 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-300">MV</th>
                  <th className="px-3 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Created At</th>
                  <th className="relative py-4 pl-3 pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="text-white">
                {Object.entries(weaponsByType).map(([weaponType, typeWeapons]) => (
                  <Fragment key={weaponType}>
                    <tr className="border-t border-white/10">
                      <th
                        scope="colgroup"
                        colSpan={5}
                        className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 py-3 pl-6 pr-3 text-left text-sm font-medium text-indigo-300 border-l-4 border-indigo-500"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                          {weaponType}
                        </div>
                      </th>
                    </tr>
                    {typeWeapons.map((weapon, weaponIdx) => (
                      <tr
                        key={weapon.id}
                        className={classNames(
                          weaponIdx === 0 ? "border-white/10" : "border-white/5",
                          "border-t hover:bg-white/5 transition-colors duration-200",
                        )}
                      >
                        <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-white">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full flex-shrink-0"></div>
                            {weapon.serial_number}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md text-xs font-medium border border-blue-500/30">
                            {weapon.team_id}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${
                              weapon.mv
                                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                            }`}
                          >
                            {weapon.mv || "N/A"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{new Date(weapon.created_at).toLocaleDateString()}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm">
                          <button className="px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 hover:text-indigo-200 rounded-lg border border-indigo-500/30 hover:border-indigo-500/50 transition-all duration-200 text-xs font-medium">
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
