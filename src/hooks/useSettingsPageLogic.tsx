import { useState, useEffect } from "react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";
import { BASE_WEAPONS } from "@/utils/BaseData/BaseWeapons";
import { BASE_EQUIPMENTS } from "@/utils/BaseData/BaseEquipments";
import { User } from "@/types/user";
import { Team } from "@/types/team";
import { Squad } from "@/types/squad";
import { UserDuty } from "@/types/score";
import { Settings as SettingsIcon } from "lucide-react";
import { getTeamById, updateTeamName } from "@/services/teamService";
import { getSquadById, updateSquadName } from "@/services/squadService";

export function useSettingsPageLogic() {
  const { user, updateUser, fetchUserFromDB } = useStore(userStore);
  const { weapons } = useStore(weaponsStore);
  const { equipments } = useStore(equipmentStore);

  const [team, setTeam] = useState<Team | null>(null);
  const [squad, setSquad] = useState<Squad | null>(null);
  const [emailError, setEmailError] = useState<string>("");

  const [formData, setFormData] = useState({
    user_role: user?.user_role || "",
    team_id: user?.team_id || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    team_name: "",
    squad_name: "",
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

  // Fetch team and squad data when user changes
  useEffect(() => {
    const fetchRelatedData = async () => {
      if (user?.team_id) {
        const teamData = await getTeamById(user.team_id);
        setTeam(teamData);
      }
      if (user?.squad_id) {
        const squadData = await getSquadById(user.squad_id);
        setSquad(squadData);
      }
    };
    fetchRelatedData();
  }, [user?.team_id, user?.squad_id]);

  // Update formData when user, team, or squad changes
  useEffect(() => {
    if (user) {
      setFormData({
        user_role: user.user_role || "",
        team_id: user.team_id || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        team_name: team?.team_name || "",
        squad_name: squad?.squad_name || "",
        user_default_duty: user.user_default_duty || UserDuty.SNIPER,
        user_default_weapon: user.user_default_weapon || null,
        user_default_equipment: user.user_default_equipment || null,
      });
    }
  }, [user, team, squad]);

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

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFormChange = async (field: string, value: any) => {
    // Update local state first
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Handle email validation
    if (field === "email") {
      if (!isValidEmail(value)) {
        setEmailError("Please enter a valid email address");
        return; // Don't save invalid email
      } else {
        setEmailError("");
      }
    }
    
    // Handle team name updates
    if (field === "team_name" && user?.team_id) {
      try {
        const updatedTeam = await updateTeamName(user.team_id, value);
        if (updatedTeam) {
          setTeam(updatedTeam);
        }
      } catch (error) {
        console.error("Error updating team name:", error);
        // Revert local state
        setFormData(prev => ({ ...prev, team_name: team?.team_name || "" }));
      }
      return;
    }
    
    // Handle squad name updates
    if (field === "squad_name" && user?.squad_id) {
      try {
        const updatedSquad = await updateSquadName(user.squad_id, value);
        if (updatedSquad) {
          setSquad(updatedSquad);
        }
      } catch (error) {
        console.error("Error updating squad name:", error);
        // Revert local state
        setFormData(prev => ({ ...prev, squad_name: squad?.squad_name || "" }));
      }
      return;
    }
    
    // Handle other user fields
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
    emailError,

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
