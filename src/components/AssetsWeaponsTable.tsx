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
    <div className=" px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="mt-8 flow-root bg-[#1E1E1E]  rounded-lg">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className=" p-3">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-3">Serial Number</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Team ID</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">MV</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Created At</th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className=" text-white">
                {Object.entries(weaponsByType).map(([weaponType, typeWeapons]) => (
                  <Fragment key={weaponType}>
                    <tr className="border-t border-gray-700">
                      <th scope="colgroup" colSpan={5} className="bg-[#161616] py-2 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-3">
                        {weaponType}
                      </th>
                    </tr>
                    {typeWeapons.map((weapon, weaponIdx) => (
                      <tr key={weapon.id} className={classNames(weaponIdx === 0 ? "border-gray-700" : "border-gray-800", "border-t")}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-3">{weapon.serial_number}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{weapon.team_id}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{weapon.mv || "N/A"}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{new Date(weapon.created_at).toLocaleDateString()}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                          <a href="#" className="text-indigo-400 hover:text-indigo-200">
                            Edit<span className="sr-only">, {weapon.serial_number}</span>
                          </a>
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
