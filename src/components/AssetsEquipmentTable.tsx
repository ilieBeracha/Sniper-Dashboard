import { useState, useMemo } from "react";
import { Equipment } from "@/types/equipment";
import { Edit, Save, X } from "lucide-react";
import { format } from "date-fns";
import { useStore } from "zustand";
import { equipmentStore } from "@/store/equipmentStore";
import { SpTable, SpTableColumn } from "@/layouts/SpTable";
import { useTheme } from "@/contexts/ThemeContext";
import { primitives } from "@/styles/core";

export default function AssetsEquipmentTable({ equipments }: { equipments: Equipment[] }) {
  const { theme } = useTheme();
  const { updateEquipment } = useStore(equipmentStore);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [editForm, setEditForm] = useState<Partial<Equipment>>({});

  // Get unique equipment types for filter
  const uniqueEquipmentTypes = useMemo(() => {
    const types = equipments.map((equipment) => equipment.equipment_type).filter(Boolean);
    return [...new Set(types)];
  }, [equipments]);

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

  const columns = [
    {
      key: "equipment_type",
      label: "Equipment Type",
      render: (value: string, row: Equipment) => {
        const isEditing = editingEquipment?.id === row.id;
        return isEditing ? (
          <select
            value={editForm.equipment_type || ""}
            onChange={(e) => setEditForm({ ...editForm, equipment_type: e.target.value })}
            className="w-full px-2 py-2 h-9 rounded border text-sm"
            style={{
              borderColor: theme === "dark" ? primitives.grey.grey600 : primitives.grey.grey300,
              backgroundColor: theme === "dark" ? primitives.grey.grey700 : primitives.white.white,
              color: theme === "dark" ? primitives.white.white : primitives.grey.grey900,
            }}
          >
            <option value="">Select type</option>
            {uniqueEquipmentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        ) : (
          <span className="font-medium">{value || "N/A"}</span>
        );
      },
    },
    {
      key: "serial_number",
      label: "Serial Number",
      render: (value: string, row: Equipment) => {
        const isEditing = editingEquipment?.id === row.id;
        return isEditing ? (
          <input
            type="text"
            value={editForm.serial_number || ""}
            onChange={(e) => setEditForm({ ...editForm, serial_number: e.target.value })}
            className="w-full px-2 py-2 h-9 rounded border text-sm"
            style={{
              borderColor: theme === "dark" ? primitives.grey.grey600 : primitives.grey.grey300,
              backgroundColor: theme === "dark" ? primitives.grey.grey700 : primitives.white.white,
              color: theme === "dark" ? primitives.white.white : primitives.grey.grey900,
            }}
          />
        ) : (
          value || "N/A"
        );
      },
    },
    {
      key: "day_night",
      label: "Day/Night",
      render: (value: string, row: Equipment) => {
        const isEditing = editingEquipment?.id === row.id;
        return isEditing ? (
          <select
            value={editForm.day_night || ""}
            onChange={(e) => setEditForm({ ...editForm, day_night: e.target.value })}
            className="w-full px-2 py-2 h-9 rounded border text-sm"
            style={{
              borderColor: theme === "dark" ? primitives.grey.grey600 : primitives.grey.grey300,
              backgroundColor: theme === "dark" ? primitives.grey.grey700 : primitives.white.white,
              color: theme === "dark" ? primitives.white.white : primitives.grey.grey900,
            }}
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
            {value || "N/A"}
          </span>
        );
      },
    },
    ...(equipments.some((equipment) => equipment.created_at)
      ? [
          {
            key: "created_at",
            label: "Created",
            render: (value: string) => (value ? format(new Date(value), "yyyy-MM-dd HH:mm") : "N/A"),
          },
        ]
      : []),
  ];

  const filters = [
    {
      key: "equipment_type",
      label: "All Equipment Types",
      type: "select" as const,
      options: uniqueEquipmentTypes.map((type) => ({ value: type, label: type })),
    },
    {
      key: "day_night",
      label: "All Day/Night",
      type: "select" as const,
      options: [
        { value: "day", label: "Day" },
        { value: "night", label: "Night" },
      ],
    },
  ];

  const actions = (equipment: Equipment) => {
    const isEditing = editingEquipment?.id === equipment.id;

    return (
      <div className="inline-flex gap-2">
        {isEditing ? (
          <>
            <button onClick={handleSaveEquipment} className={`p-2 rounded  ${theme === "dark" ? "text-green-400" : "text-green-600"}`} title="Save">
              <Save size={16} />
            </button>
            <button onClick={handleCancelEdit} className={`p-2 rounded ${theme === "dark" ? "text-red-400" : "text-red-600"}`} title="Cancel">
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleEditEquipment(equipment)}
              className={`p-2 rounded  ${theme === "dark" ? "text-amber-400" : "text-amber-600"}`}
              title="Edit"
            >
              <Edit size={16} />
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <SpTable
      data={equipments}
      columns={columns as SpTableColumn<Equipment>[]}
      filters={filters}
      searchPlaceholder="Search by serial number, type, or day/night..."
      searchFields={["serial_number", "equipment_type", "day_night"]}
      actions={actions}
      emptyState={
        <div className={`text-center py-12 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          <div className="w-12 h-12 mx-auto mb-4 opacity-50">🔧</div>
          <h3 className="text-lg font-medium mb-2">No equipment yet</h3>
          <p className="text-sm">Add your first equipment to get started</p>
        </div>
      }
    />
  );
}
