import { useMemo } from "react";
import { Equipment } from "@/types/equipment";
import { format } from "date-fns";
import { SpTable, SpTableColumn } from "@/layouts/SpTable";
import { useTheme } from "@/contexts/ThemeContext";

export default function AssetsEquipmentTable({ equipments, onDeleteEquipment }: { equipments: Equipment[]; onDeleteEquipment: (equipment: Equipment) => void }) {
  const { theme } = useTheme();

  // Get unique equipment types for filter
  const uniqueEquipmentTypes = useMemo(() => {
    const types = equipments.map((equipment) => equipment.equipment_type).filter(Boolean);
    return [...new Set(types)];
  }, [equipments]);

  const handleEditEquipment = (equipment: Equipment) => {
    // TODO: Implement edit modal or navigation
    console.log("Edit equipment:", equipment);
  };

  const columns: SpTableColumn<Equipment>[] = [
    {
      key: "equipment_type",
      label: "Equipment Type",
      render: (value: string) => <span className="font-medium">{value || "N/A"}</span>,
      className: "px-4 py-3",
    },
    {
      key: "serial_number",
      label: "Serial Number",
      render: (value: string) => value || "N/A",
      className: "px-4 py-3",
    },
    {
      key: "day_night",
      label: "Day/Night",
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium border transition-colors duration-200 ${
            theme === "dark" ? "bg-white/5 text-gray-300 border-white/10" : "bg-gray-100 text-gray-700 border-gray-200"
          }`}
        >
          {value || "N/A"}
        </span>
      ),
      className: "px-4 py-3",
    },
    ...(equipments.some((equipment) => equipment.created_at)
      ? [
          {
            key: "created_at" as const,
            label: "Created",
            render: (value: string) => (value ? format(new Date(value), "yyyy-MM-dd HH:mm") : "N/A"),
            className: "px-4 py-3",
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

  return (
    <SpTable
      data={equipments}
      columns={columns}
      filters={filters}
      searchPlaceholder="Search by serial number, type, or day/night..."
      searchFields={["serial_number", "equipment_type", "day_night"]}
      actions={{
        onEdit: handleEditEquipment,
        onDelete: onDeleteEquipment,
      }}
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
