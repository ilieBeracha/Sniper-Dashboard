import { useState, useMemo } from "react";
import { Weapon } from "@/types/weapon";
import { useTheme } from "@/contexts/ThemeContext";
import { Eye, Edit, Search, X, Save, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { useStore } from "zustand";
import { weaponsStore } from "@/store/weaponsStore";
import { performanceStore } from "@/store/performance";
import { SpTable, SpTableColumn } from "@/layouts/SpTable";
import WeaponUsageModal from "./WeaponUsageModal";
import { primitives } from "@/styles/core";

export default function AssetsWeaponsTable({ weapons }: { weapons: Weapon[] }) {
  const weaponsWithIds = weapons.filter((weapon): weapon is Weapon & { id: string } => Boolean(weapon.id));
  const { theme } = useTheme();
  const { updateWeapon } = useStore(weaponsStore);
  const { getWeaponUsageStats } = useStore(performanceStore);
  const [editingWeapon, setEditingWeapon] = useState<Weapon | null>(null);
  const [editForm, setEditForm] = useState<Partial<Weapon>>({});
  const [usageModalOpen, setUsageModalOpen] = useState(false);
  const [selectedWeaponForUsage, setSelectedWeaponForUsage] = useState<Weapon | null>(null);

  const uniqueWeaponTypes = useMemo(() => {
    const types = weaponsWithIds.map((weapon) => weapon.weapon_type).filter(Boolean);
    return [...new Set(types)];
  }, [weaponsWithIds]);

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

  const handleViewUsage = async (weapon: Weapon) => {
    if (!weapon.id) return;
    console.log("AssetsWeaponsTable - handleViewUsage called with weapon:", weapon);
    console.log("AssetsWeaponsTable - weapon.id:", weapon.id);
    setSelectedWeaponForUsage(weapon);
    setUsageModalOpen(true);
    await getWeaponUsageStats(weapon.id);
  };

  const columns: SpTableColumn<Weapon>[] = [
    {
      key: "weapon_type",
      label: "Weapon Type",
      render: (value: string, row: Weapon) => {
        const isEditing = editingWeapon?.id === row.id;
        return isEditing ? (
          <select
            value={editForm.weapon_type || ""}
            onChange={(e) => setEditForm({ ...editForm, weapon_type: e.target.value })}
            className="w-full px-2 py-1 rounded border text-sm"
            style={{
              borderColor: theme === "dark" ? primitives.grey.grey600 : primitives.grey.grey300,
              backgroundColor: theme === "dark" ? primitives.grey.grey700 : primitives.white.white,
              color: theme === "dark" ? primitives.white.white : primitives.grey.grey900
            }}
          >
            <option value="">Select type</option>
            {uniqueWeaponTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        ) : (
          <span className="font-medium">{value || "N/A"}</span>
        );
      },
      className: "px-4 py-3",
    },
    {
      key: "serial_number",
      label: "Serial Number",
      render: (value: string, row: Weapon) => {
        const isEditing = editingWeapon?.id === row.id;
        return isEditing ? (
          <input
            type="text"
            value={editForm.serial_number || ""}
            onChange={(e) => setEditForm({ ...editForm, serial_number: e.target.value })}
            className="w-full px-2 py-1 rounded border text-sm"
            style={{
              borderColor: theme === "dark" ? primitives.grey.grey600 : primitives.grey.grey300,
              backgroundColor: theme === "dark" ? primitives.grey.grey700 : primitives.white.white,
              color: theme === "dark" ? primitives.white.white : primitives.grey.grey900
            }}
          />
        ) : (
          <span>{value || "N/A"}</span>
        );
      },
      className: "px-4 py-3",
    },
    {
      key: "mv",
      label: "MV",
      render: (value: string, row: Weapon) => {
        const isEditing = editingWeapon?.id === row.id;
        return isEditing ? (
          <input
            type="number"
            value={editForm.mv || ""}
            onChange={(e) => setEditForm({ ...editForm, mv: e.target.value })}
            className="w-full px-2 py-1 rounded border text-sm"
            style={{
              borderColor: theme === "dark" ? primitives.grey.grey600 : primitives.grey.grey300,
              backgroundColor: theme === "dark" ? primitives.grey.grey700 : primitives.white.white,
              color: theme === "dark" ? primitives.white.white : primitives.grey.grey900
            }}
          />
        ) : (
          <span>{value || "N/A"}</span>
        );
      },
      className: "px-4 py-3",
    },
    {
      key: "created_at",
      label: "Created",
      render: (value: string) => (value ? format(new Date(value), "yyyy-MM-dd HH:mm") : "N/A"),
      className: "px-4 py-3",
      hideOnMobile: true,
    },
  ];

  const filters = [
    {
      key: "weapon_type",
      label: "All Weapon Types",
      type: "select" as const,
      options: uniqueWeaponTypes.map((type) => ({ value: type, label: type })),
    },
  ];

  const actions = (weapon: Weapon) => {
    const isEditing = editingWeapon?.id === weapon.id;
    return (
      <div className="inline-flex gap-2">
        {isEditing ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSaveWeapon();
              }}
              className={`p-2 rounded hover:bg-green-100 dark:hover:bg-green-800/40 ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
              title="Save"
            >
              <Save size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCancelEdit();
              }}
              className={`p-2 rounded hover:bg-red-100 dark:hover:bg-red-800/40 ${theme === "dark" ? "text-red-400" : "text-red-600"}`}
              title="Cancel"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewWeapon(weapon);
              }}
              className={`p-2 rounded hover:bg-indigo-100 dark:hover:bg-indigo-800/40 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}
              title="View Details"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewUsage(weapon);
              }}
              className={`p-2 rounded hover:bg-green-100 dark:hover:bg-green-800/40 ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
              title="Usage Statistics"
            >
              <BarChart3 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditWeapon(weapon);
              }}
              className={`p-2 rounded hover:bg-amber-100 dark:hover:bg-amber-800/40 ${theme === "dark" ? "text-amber-400" : "text-amber-600"}`}
              title="Edit"
            >
              <Edit size={16} />
            </button>
          </>
        )}
      </div>
    );
  };

  if (weaponsWithIds.length === 0) {
    return (
      <div className={`text-center py-12 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
        <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No weapons yet</h3>
        <p className="text-sm">Add your first weapon to get started</p>
      </div>
    );
  }

  return (
    <>
      <SpTable
        data={weaponsWithIds}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search by serial number, type, or MV..."
        searchFields={["serial_number", "weapon_type", "mv"]}
        actions={actions}
        emptyState={
          <div className={`text-center py-12 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No weapons match your filters</h3>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        }
      />

      <WeaponUsageModal
        isOpen={usageModalOpen}
        onClose={() => {
          setUsageModalOpen(false);
          setSelectedWeaponForUsage(null);
        }}
        weapon={selectedWeaponForUsage}
      />
    </>
  );
}
