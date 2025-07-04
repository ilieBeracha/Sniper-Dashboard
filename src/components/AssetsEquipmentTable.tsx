import { Fragment } from "react";
import { Equipment } from "@/types/equipment";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AssetsEquipmentTable({ equipments }: { equipments: Equipment[] }) {
  const equipmentsByType = equipments.reduce((acc: { [key: string]: Equipment[] }, equipment) => {
    const type = equipment.equipment_type || "Unspecified";
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(equipment);
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
                  <th className="px-3 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Day/Night</th>
                  <th className="px-3 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Created At</th>
                  <th className="relative py-4 pl-3 pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="text-white">
                {Object.entries(equipmentsByType).map(([equipmentType, typeEquipments]) => (
                  <Fragment key={equipmentType}>
                    <tr className="border-t border-white/10">
                      <th
                        scope="colgroup"
                        colSpan={6}
                        className="bg-emerald-500/10 py-3 pl-6 pr-3 text-left text-sm font-medium text-emerald-200 border-l-2 border-emerald-400"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                          {equipmentType}
                        </div>
                      </th>
                    </tr>
                    {typeEquipments.map((equipment, equipmentIdx) => (
                      <tr
                        key={equipment.id}
                        className={classNames(
                          equipmentIdx === 0 ? "border-white/10" : "border-white/5",
                          "border-t hover:bg-white/5 transition-colors duration-200",
                        )}
                      >
                        <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-white">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0"></div>
                            {equipment.serial_number}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className="px-2 py-1 bg-white/5 text-gray-300 rounded text-xs font-medium border border-white/10">
                            {equipment.day_night || "N/A"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{new Date(equipment.created_at).toLocaleDateString()}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm">
                          <button className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 hover:text-emerald-100 rounded border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-200 text-xs font-medium">
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
