import { useState, useMemo } from "react";
import { Weapon } from "@/types/weapon";
import { useTheme } from "@/contexts/ThemeContext";
import { Eye, Edit, Search, X, Save } from "lucide-react";
import { format } from "date-fns";
import { useStore } from "zustand";
import { weaponsStore } from "@/store/weaponsStore";

export default function AssetsWeaponsTable({ weapons }: { weapons: Weapon[] }) {
  const { theme } = useTheme();
  const { updateWeapon } = useStore(weaponsStore);
  const [editingWeapon, setEditingWeapon] = useState<Weapon | null>(null);
  const [editForm, setEditForm] = useState<Partial<Weapon>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [weaponTypeFilter, setWeaponTypeFilter] = useState("");

  // Get unique weapon types for filter
  const uniqueWeaponTypes = useMemo(() => {
    const types = weapons.map((weapon) => weapon.weapon_type).filter(Boolean);
    return [...new Set(types)];
  }, [weapons]);

  // Filter weapons based on search and filters
  const filteredWeapons = useMemo(() => {
    return weapons.filter((weapon) => {
      const matchesSearch =
        searchTerm === "" ||
        weapon.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        weapon.weapon_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        weapon.mv?.toString().includes(searchTerm);

      const matchesType = weaponTypeFilter === "" || weapon.weapon_type === weaponTypeFilter;

      return matchesSearch && matchesType;
    });
  }, [weapons, searchTerm, weaponTypeFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setWeaponTypeFilter("");
  };

  const hasActiveFilters = searchTerm || weaponTypeFilter;

  const handleEditWeapon = (weapon: Weapon) => {
    setEditingWeapon(weapon);
    setEditForm(weapon);
  };

  const handleSaveWeapon = async () => {
    if (!editingWeapon?.id) return;

    try {
      await updateWeapon(editingWeapon.id, editForm);
      setEditingWeapon(null);
      setEditForm({});
    } catch (error) {
      console.error("Error updating weapon:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingWeapon(null);
    setEditForm({});
  };

  const handleViewWeapon = (weapon: Weapon) => {
    console.log("Viewing weapon:", weapon);
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
                placeholder="Search by serial number, type, or MV..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors duration-200 text-sm ${
                  theme === "dark"
                    ? "border-zinc-700 bg-zinc-800 text-white placeholder-gray-400 focus:border-purple-400"
                    : "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-purple-500"
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              />
            </div>

            {/* Weapon Type Filter */}
            <select
              value={weaponTypeFilter}
              onChange={(e) => setWeaponTypeFilter(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm transition-colors duration-200 ${
                theme === "dark"
                  ? "border-zinc-700 bg-zinc-800 text-white focus:border-purple-400"
                  : "border-gray-300 bg-white text-gray-900 focus:border-purple-500"
              } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
            >
              <option value="">All Weapon Types</option>
              {uniqueWeaponTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
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
            Showing {filteredWeapons.length} of {weapons.length} weapons
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
              <th className="px-4 py-3">Weapon Type</th>
              <th className="px-4 py-3">Serial Number</th>
              <th className="px-4 py-3">MV</th>
              {weapons.some((weapon) => weapon.created_at) && <th className="px-4 py-3">Created</th>}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWeapons.map((weapon, index) => {
              const isLastRow = index === filteredWeapons.length - 1;
              const isEditing = editingWeapon?.id === weapon.id;

              return (
                <tr
                  key={weapon.id}
                  className={`transition-colors border-b ${
                    isLastRow ? "border-transparent" : theme === "dark" ? "border-zinc-800/50" : "border-gray-100"
                  } ${theme === "dark" ? "hover:bg-zinc-800/50" : "hover:bg-gray-50"}`}
                >
                  <td className="px-4 py-3 font-medium">
                    {isEditing ? (
                      <select
                        value={editForm.weapon_type || ""}
                        onChange={(e) => setEditForm({ ...editForm, weapon_type: e.target.value })}
                        className={`w-full px-2 py-1 rounded border text-sm ${
                          theme === "dark" ? "border-zinc-600 bg-zinc-700 text-white" : "border-gray-300 bg-white text-gray-900"
                        }`}
                      >
                        <option value="">Select type</option>
                        {uniqueWeaponTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    ) : (
                      weapon.weapon_type || "N/A"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.serial_number || ""}
                        onChange={(e) => setEditForm({ ...editForm, serial_number: e.target.value })}
                        className={`w-full px-2 py-1 rounded border text-sm ${
                          theme === "dark" ? "border-zinc-600 bg-zinc-700 text-white" : "border-gray-300 bg-white text-gray-900"
                        }`}
                      />
                    ) : (
                      weapon.serial_number || "N/A"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editForm.mv || ""}
                        onChange={(e) => setEditForm({ ...editForm, mv: e.target.value })}
                        className={`w-full px-2 py-1 rounded border text-sm ${
                          theme === "dark" ? "border-zinc-600 bg-zinc-700 text-white" : "border-gray-300 bg-white text-gray-900"
                        }`}
                      />
                    ) : (
                      weapon.mv || "N/A"
                    )}
                  </td>

                  {weapon.created_at && <td className="px-4 py-3">{format(new Date(weapon.created_at), "yyyy-MM-dd HH:mm")}</td>}
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSaveWeapon}
                            className={`p-2 rounded hover:bg-green-100 dark:hover:bg-green-800/40 ${
                              theme === "dark" ? "text-green-400" : "text-green-600"
                            }`}
                            title="Save"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className={`p-2 rounded hover:bg-red-100 dark:hover:bg-red-800/40 ${theme === "dark" ? "text-red-400" : "text-red-600"}`}
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleViewWeapon(weapon)}
                            className={`p-2 rounded hover:bg-indigo-100 dark:hover:bg-indigo-800/40 ${
                              theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                            }`}
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditWeapon(weapon)}
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
      {filteredWeapons.length === 0 && weapons.length > 0 && (
        <div className={`text-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No weapons match your current filters</p>
        </div>
      )}
    </div>
  );
}
