import { Fragment } from "react";
import { Equipment } from "@/types/equipment";
import { useTheme } from "@/contexts/ThemeContext";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AssetsEquipmentTable({ equipments }: { equipments: Equipment[] }) {
  const { theme } = useTheme();
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
                  }`}>Day/Night</th>
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
                {Object.entries(equipmentsByType).map(([equipmentType, typeEquipments]) => (
                  <Fragment key={equipmentType}>
                    <tr className={`border-t transition-colors duration-200 ${
                      theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                    }`}>
                      <th
                        scope="colgroup"
                        colSpan={6}
                        className={`py-3 pl-6 pr-3 text-left text-sm font-medium border-l-2 transition-colors duration-200 ${
                          theme === 'dark' 
                            ? 'bg-emerald-500/10 text-emerald-200 border-emerald-400' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-400'
                        }`}
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
                          equipmentIdx === 0 
                            ? (theme === 'dark' ? "border-white/10" : "border-gray-200") 
                            : (theme === 'dark' ? "border-white/5" : "border-gray-100"),
                          `border-t transition-colors duration-200 ${
                            theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                          }`,
                        )}
                      >
                        <td className={`whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium transition-colors duration-200 ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0"></div>
                            {equipment.serial_number}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium border transition-colors duration-200 ${
                            theme === 'dark' 
                              ? 'bg-white/5 text-gray-300 border-white/10' 
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                          }`}>
                            {equipment.day_night || "N/A"}
                          </span>
                        </td>
                        <td className={`whitespace-nowrap px-3 py-4 text-sm transition-colors duration-200 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>{new Date(equipment.created_at).toLocaleDateString()}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm">
                          <button className={`px-3 py-1.5 rounded border text-xs font-medium transition-all duration-200 ${
                            theme === 'dark' 
                              ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 hover:text-emerald-100 border-emerald-500/30 hover:border-emerald-500/50' 
                              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 hover:text-emerald-800 border-emerald-200 hover:border-emerald-300'
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
