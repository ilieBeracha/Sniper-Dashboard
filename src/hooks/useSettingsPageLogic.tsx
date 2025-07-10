import { useState } from "react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";
import { BASE_WEAPONS } from "@/utils/BaseData/BaseWeapons";
import { BASE_EQUIPMENTS } from "@/utils/BaseData/BaseEquipments";
import { User } from "@/types/user";
import { UserDuty } from "@/types/score";
import { Settings as SettingsIcon } from "lucide-react";

export function useSettingsPageLogic() {
  const { user, updateUser } = useStore(userStore);
  const { weapons } = useStore(weaponsStore);
  const { equipments } = useStore(equipmentStore);

  const [formData, setFormData] = useState({
    user_role: user?.user_role || "",
    team_id: user?.team_id || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    user_default_duty: user?.user_default_duty || UserDuty.SNIPER,
    user_default_weapon: user?.user_default_weapon || null,
    user_default_equipment: user?.user_default_equipment || null,
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const tabs = [{ label: "Account", icon: SettingsIcon }];
  const [activeTab, setActiveTab] = useState(tabs[0].label);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!user || !user.id || !user.user_role) {
        console.error("User is missing required properties");
        return;
      }

      console.log(formData);

      await updateUser(formData as Partial<User>);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDutyChange = (duty: UserDuty) => {
    setFormData({ ...formData, user_default_duty: duty });
  };

  const availableWeapons = [...BASE_WEAPONS, ...weapons];
  const availableEquipment = [...BASE_EQUIPMENTS, ...equipments];

  return {
    // Data
    user,
    formData,
    loading,
    saved,
    tabs,
    activeTab,
    setActiveTab,
    availableWeapons,
    availableEquipment,
    
    // Handlers
    handleSave,
    handleFormChange,
    handleDutyChange,
    
    // Enums
    UserDuty,
  };
}