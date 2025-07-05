import { useState, useMemo } from "react";
import { Equipment } from "@/types/equipment";
import { useTheme } from "@/contexts/ThemeContext";
import { Eye, Edit, Search, X, Save } from "lucide-react";
import { format } from "date-fns";
import { useStore } from "zustand";
import { equipmentStore } from "@/store/equipmentStore";

export default function AssetsEquipmentTable({ equipments }: { equipments: Equipment[] }) {
  const { theme } = useTheme();
  const { updateEquipment } = useStore(equipmentStore);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [editForm, setEditForm] = useState<Partial<Equipment>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [equipmentTypeFilter, setEquipmentTypeFilter] = useState("");
  const [dayNightFilter, setDayNightFilter] = useState("");

  // Get unique equipment types for filter
  const uniqueEquipmentTypes = useMemo(() => {
    const types = equipments.map((equipment) => equipment.equipment_type).filter(Boolean);
    return [...new Set(types)];
  }, [equipments]);

  // Filter equipments based on search and filters
  const filteredEquipments = useMemo(() => {
    return equipments.filter((equipment) => {
      const matchesSearch =
        searchTerm === "" ||
        equipment.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipment.equipment_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipment.day_night?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = equipmentTypeFilter === "" || equipment.equipment_type === equipmentTypeFilter;
      const matchesDayNight = dayNightFilter === "" || equipment.day_night === dayNightFilter;

      return matchesSearch && matchesType && matchesDayNight;
    });
  }, [equipments, searchTerm, equipmentTypeFilter, dayNightFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setEquipmentTypeFilter("");
    setDayNightFilter("");
  };

  const hasActiveFilters = searchTerm || equipmentTypeFilter || dayNightFilter;

  const handleEditEquipment = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setEditForm(equipment);
  };

  const handleSaveEquipment = async () => {
    if (!editingEquipment?.id) return;
    
    try {
      await updateEquipment(editingEquipment.id, editForm);
      setEditingEquipment(null);
      setEditForm({});
    } catch (error) {
      console.error("Error updating equipment:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingEquipment(null);
    setEditForm({});
  };

  const handleViewEquipment = (equipment: Equipment) => {
    console.log("Viewing equipment:", equipment);
  };

  return (
    <div
      className={`rounded-xl border transition-colors duration-200 ${
        theme === "dark" ? "border-zinc-800 bg-zinc-900/50" : "border-gray-200 bg-white"
      }`}
    >
      {/* Filters Section */}
      <div className={`p-4 border-b transition-colors duration-200 ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
        <div className="gap-4">
          {/* Filter Controls */}
          <div className="gap-3 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by serial number, type, or day/night..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors duration-200 text-sm ${
                  theme === "dark"
                    ? "border-zinc-700 bg-zinc-800 text-white placeholder-gray-400 focus:border-purple-400"
                    : "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-purple-500"
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              />
            </div>
            
            {/* Equipment Type Filter */}
            <select
              value={equipmentTypeFilter}
              onChange={(e) => setEquipmentTypeFilter(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm transition-colors duration-200 ${
                theme === "dark"
                  ? "border-zinc-700 bg-zinc-800 text-white focus:border-purple-400"
                  : "border-gray-300 bg-white text-gray-900 focus:border-purple-500"
              } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
            >
              <option value="">All Equipment Types</option>
              {uniqueEquipmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {/* Day/Night Filter */}
            <select
              value={dayNightFilter}
              onChange={(e) => setDayNightFilter(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm transition-colors duration-200 ${
                theme === "dark"
                  ? "border-zinc-700 bg-zinc-800 text-white focus:border-purple-400"
                  : "border-gray-300 bg-white text-gray-900 focus:border-purple-500"
              } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
            >
              <option value="">All Day/Night</option>
              <option value="day">Day</option>
              <option value="night">Night</option>
            </select>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  theme === "dark" ? "bg-zinc-700 text-gray-300 hover:bg-zinc-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Showing {filteredEquipments.length} of {equipments.length} equipments
            {hasActiveFilters && " (filtered)"}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className={`min-w-full text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
          <thead
            className={`text-xs uppercase border-b transition-colors duration-200 ${
              theme === "dark" ? "border-zinc-800 bg-zinc-800/50" : "border-gray-200 bg-gray-50"
            }`}
          >
            <tr>
              <th className="px-4 py-3">Equipment Type</th>
              <th className="px-4 py-3">Serial Number</th>
              <th className="px-4 py-3">Day/Night</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEquipments.map((equipment, index) => {
              const isLastRow = index === filteredEquipments.length - 1;
              const isEditing = editingEquipment?.id === equipment.id;

              return (
                <tr
                  key={equipment.id}
                  className={`transition-colors border-b ${
                    isLastRow ? "border-transparent" : theme === "dark" ? "border-zinc-800/50" : "border-gray-100"
                  } ${theme === "dark" ? "hover:bg-zinc-800/50" : "hover:bg-gray-50"}`}
                >
                  <td className="px-4 py-3 font-medium">
                    {isEditing ? (
                      <select
                        value={editForm.equipment_type || ""}
                        onChange={(e) => setEditForm({ ...editForm, equipment_type: e.target.value })}
                        className={`w-full px-2 py-1 rounded border text-sm ${
                          theme === "dark"
                            ? "border-zinc-600 bg-zinc-700 text-white"
                            : "border-gray-300 bg-white text-gray-900"
                        }`}
                      >
                        <option value="">Select type</option>
                        {uniqueEquipmentTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    ) : (
                      equipment.equipment_type || "N/A"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.serial_number || ""}
                        onChange={(e) => setEditForm({ ...editForm, serial_number: e.target.value })}
                        className={`w-full px-2 py-1 rounded border text-sm ${
                          theme === "dark"
                            ? "border-zinc-600 bg-zinc-700 text-white"
                            : "border-gray-300 bg-white text-gray-900"
                        }`}
                      />
                    ) : (
                      equipment.serial_number || "N/A"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <select
                        value={editForm.day_night || ""}
                        onChange={(e) => setEditForm({ ...editForm, day_night: e.target.value })}
                        className={`w-full px-2 py-1 rounded border text-sm ${
                          theme === "dark"
                            ? "border-zinc-600 bg-zinc-700 text-white"
                            : "border-gray-300 bg-white text-gray-900"
                        }`}
                      >
                        <option value="">Select</option>
                        <option value="day">Day</option>
                        <option value="night">Night</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border transition-colors duration-200 ${
                          theme === "dark" ? "bg-white/5 text-gray-300 border-white/10" : "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        {equipment.day_night || "N/A"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{format(new Date(equipment.created_at), "yyyy-MM-dd HH:mm")}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSaveEquipment}
                            className={`p-2 rounded hover:bg-green-100 dark:hover:bg-green-800/40 ${
                              theme === "dark" ? "text-green-400" : "text-green-600"
                            }`}
                            title="Save"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className={`p-2 rounded hover:bg-red-100 dark:hover:bg-red-800/40 ${
                              theme === "dark" ? "text-red-400" : "text-red-600"
                            }`}
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleViewEquipment(equipment)}
                            className={`p-2 rounded hover:bg-indigo-100 dark:hover:bg-indigo-800/40 ${
                              theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                            }`}
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditEquipment(equipment)}
                            className={`p-2 rounded hover:bg-amber-100 dark:hover:bg-amber-800/40 ${
                              theme === "dark" ? "text-amber-400" : "text-amber-600"
                            }`}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredEquipments.length === 0 && equipments.length > 0 && (
        <div className={`text-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No equipments match your current filters</p>
        </div>
      )}
    </div>
  );
}