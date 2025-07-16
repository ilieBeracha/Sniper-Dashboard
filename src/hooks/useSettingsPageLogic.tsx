import { useState, useEffect } from "react";
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
  const { user, updateUser, fetchUserFromDB } = useStore(userStore);
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

  // Fetch fresh user data on component mount
  useEffect(() => {
    const fetchData = async () => {
      await fetchUserFromDB();
    };
    fetchData();
  }, [fetchUserFromDB]);

  // Update formData when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        user_role: user.user_role || "",
        team_id: user.team_id || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        user_default_duty: user.user_default_duty || UserDuty.SNIPER,
        user_default_weapon: user.user_default_weapon || null,
        user_default_equipment: user.user_default_equipment || null,
      });
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const tabs = [{ id: "account", label: "Account", icon: SettingsIcon }];
  const [activeTab, setActiveTab] = useState(tabs[0].id);

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

  const handleFormChange = async (field: string, value: any) => {
    // Update local state first
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Then save to DB and update store
    try {
      await updateUser({ [field]: value });
    } catch (error) {
      console.error("Error auto-saving field:", field, error);
      // On error, revert local state to match store
      if (user) {
        setFormData(prev => ({ ...prev, [field]: user[field as keyof User] }));
      }
    }
  };

  const handleDutyChange = async (duty: UserDuty) => {
    // Update local state first
    const newFormData = { 
      ...formData, 
      user_default_duty: duty,
      user_default_weapon: duty === UserDuty.SPOTTER ? null : formData.user_default_weapon,
      user_default_equipment: duty === UserDuty.SNIPER ? null : formData.user_default_equipment,
    };
    setFormData(newFormData);
    
    // Prepare update data for DB
    const updateData: Partial<User> = { user_default_duty: duty };
    if (duty === UserDuty.SNIPER) {
      updateData.user_default_equipment = null;
    } else if (duty === UserDuty.SPOTTER) {
      updateData.user_default_weapon = null;
    }
    
    // Then save to DB and update store
    try {
      await updateUser(updateData);
    } catch (error) {
      console.error("Error auto-saving duty change:", error);
      // On error, revert local state to match store
      if (user) {
        setFormData(prev => ({ 
          ...prev, 
          user_default_duty: user.user_default_duty || UserDuty.SNIPER,
          user_default_weapon: user.user_default_weapon || null,
          user_default_equipment: user.user_default_equipment || null,
        }));
      }
    }
  };

  const handleWeaponChange = async (weaponId: string) => {
    // Update local state first
    setFormData(prev => ({ ...prev, user_default_weapon: weaponId }));
    
    // Then save to DB and update store
    try {
      await updateUser({ user_default_weapon: weaponId });
    } catch (error) {
      console.error("Error auto-saving weapon change:", error);
      // On error, revert local state to match store
      if (user) {
        setFormData(prev => ({ ...prev, user_default_weapon: user.user_default_weapon || null }));
      }
    }
  };

  const handleEquipmentChange = async (equipmentId: string) => {
    // Update local state first
    setFormData(prev => ({ ...prev, user_default_equipment: equipmentId }));
    
    // Then save to DB and update store
    try {
      await updateUser({ user_default_equipment: equipmentId });
    } catch (error) {
      console.error("Error auto-saving equipment change:", error);
      // On error, revert local state to match store
      if (user) {
        setFormData(prev => ({ ...prev, user_default_equipment: user.user_default_equipment || null }));
      }
    }
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
    handleWeaponChange,
    handleEquipmentChange,

    // Enums
    UserDuty,
  };
}
