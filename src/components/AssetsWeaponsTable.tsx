import { useMemo } from "react";
import { Weapon } from "@/types/weapon";
import { useTheme } from "@/contexts/ThemeContext";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { SpTable, SpTableColumn } from "@/layouts/SpTable";
import WeaponUsageModal from "./WeaponUsageModal";

export default function AssetsWeaponsTable({
  weapons,
  onDeleteWeapon,
  onEditWeapon,
}: {
  weapons: Weapon[];
  onDeleteWeapon: (weapon: Weapon) => void;
  onEditWeapon: (weapon: Weapon) => void;
}) {
  const { theme } = useTheme();
  const weaponsWithIds = weapons.filter((weapon): weapon is Weapon & { id: string } => Boolean(weapon?.id));

  const uniqueWeaponTypes = useMemo(() => {
    const types = weaponsWithIds.map((weapon) => weapon.weapon_type).filter(Boolean);
    return [...new Set(types)];
  }, [weaponsWithIds]);

  const columns: SpTableColumn<Weapon>[] = [
    {
      key: "weapon_type",
      label: "Weapon Type",
      render: (value: string) => {
        return <span className="font-medium">{value || "N/A"}</span>;
      },
      className: "px-4 py-3",
    },
    {
      key: "serial_number",
      label: "Serial Number",
      render: (value: string) => {
        return <span>{value || "N/A"}</span>;
      },
      className: "px-4 py-3",
    },
    {
      key: "mv",
      label: "MV",
      render: (value: string) => {
        return <span>{value || "N/A"}</span>;
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
        actions={{
          onEdit: onEditWeapon,
          onDelete: onDeleteWeapon,
        }}
        emptyState={
          <div className={`text-center py-12 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No weapons match your filters</h3>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        }
      />

      <WeaponUsageModal isOpen={false} onClose={() => {}} weapon={null} />
    </>
  );
}
