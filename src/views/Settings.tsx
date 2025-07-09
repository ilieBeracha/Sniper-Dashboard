import { useState, useEffect } from "react";
import { useStore } from "zustand";
import { useTheme } from "@/contexts/ThemeContext";
import { userStore } from "@/store/userStore";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";
import Header from "@/Headers/Header";
import BaseInput from "@/components/BaseInput";
import BaseButton from "@/components/BaseButton";
import { User, Settings as SettingsIcon, Shield, Target, Crosshair } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { BASE_WEAPONS } from "@/utils/BaseData/BaseWeapons";
import { BASE_EQUIPMENTS } from "@/utils/BaseData/BaseEquipments";

const Settings = () => {
  const { theme } = useTheme();
const { user, setUser } = useStore(userStore);
  const { weapons } = useStore(weaponsStore);
  const { equipments } = useStore(equipmentStore);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    defaultRole: "sniper" as "sniper" | "spotter",
    defaultWeapon: "",
    defaultEquipment: "",
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        defaultRole: "sniper",
        defaultWeapon: "",
        defaultEquipment: "",
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

const handleSave = async () => {
    setLoading(true);
    try {
        if (!user || !user.id || !user.user_role) {
            console.error("User is missing required properties");
            return;
        }

        setUser({
            ...user,
            id: user.id, // ensure it's passed explicitly and is a string
            user_role: user.user_role, // required too
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
        });

        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    } catch (error) {
        console.error('Error saving settings:', error);
    } finally {
        setLoading(false);
    }
};

  const availableWeapons = [...BASE_WEAPONS, ...weapons];
  const availableEquipment = [...BASE_EQUIPMENTS, ...equipments];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === "dark" ? "bg-[#121212]" : "bg-gray-50"}`}>
      <Header title="Settings">
        <div className="flex items-center gap-2">
          <BaseButton
            // variant="purple"
            onClick={handleSave}
            disabled={loading}
            className="text-sm"
          >
            {loading ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </BaseButton>
        </div>
      </Header>

      <main className="px-4 md:px-6 py-4 2xl:px-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className={`p-4 rounded-2xl mb-6 ${theme === "dark" ? "bg-zinc-900/50 border border-zinc-800" : "bg-white border border-gray-100"}`}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <SettingsIcon className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>Settings</h2>
              <div className="text-xs text-gray-400">Manage your account settings and preferences</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Settings */}
          <div className={`p-6 rounded-2xl ${theme === "dark" ? "bg-zinc-900/50 border border-zinc-800" : "bg-white border border-gray-100"}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <User className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>Profile Information</h3>
            </div>

            <div className="space-y-4">
              <BaseInput
                label="First Name"
                value={formData.first_name}
                onChange={(e) => handleInputChange("first_name", e.target.value)}
                placeholder="Enter your first name"
              />

              <BaseInput
                label="Last Name"
                value={formData.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                placeholder="Enter your last name"
              />

              <BaseInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Role Settings */}
          <div className={`p-6 rounded-2xl ${theme === "dark" ? "bg-zinc-900/50 border border-zinc-800" : "bg-white border border-gray-100"}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Shield className="w-4 h-4 text-green-400" />
              </div>
              <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>Default Role</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Select Default Role</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleInputChange("defaultRole", "sniper")}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                      formData.defaultRole === "sniper"
                        ? "border-purple-500 bg-purple-500/10"
                        : theme === "dark"
                          ? "border-gray-700 hover:border-gray-600"
                          : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <Target className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                    <div className={`text-sm font-medium ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>Sniper</div>
                  </button>
                  <button
                    onClick={() => handleInputChange("defaultRole", "spotter")}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                      formData.defaultRole === "spotter"
                        ? "border-purple-500 bg-purple-500/10"
                        : theme === "dark"
                          ? "border-gray-700 hover:border-gray-600"
                          : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <Crosshair className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                    <div className={`text-sm font-medium ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>Spotter</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Equipment/Weapon Settings */}
          <div className={`p-6 rounded-2xl ${theme === "dark" ? "bg-zinc-900/50 border border-zinc-800" : "bg-white border border-gray-100"}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Target className="w-4 h-4 text-orange-400" />
              </div>
              <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                {formData.defaultRole === "sniper" ? "Default Weapon" : "Default Equipment"}
              </h3>
            </div>

            <div className="space-y-4">
              {formData.defaultRole === "sniper" ? (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Select Default Weapon
                  </label>
                  <select
                    value={formData.defaultWeapon}
                    onChange={(e) => handleInputChange("defaultWeapon", e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 ${
                      theme === "dark"
                        ? "bg-zinc-800 border-gray-700 text-gray-300 focus:border-gray-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-gray-500"
                    }`}
                  >
                    <option value="">Select a weapon</option>
                    {availableWeapons.map((weapon) => (
                      <option key={weapon.id} value={weapon.id}>
                        {weapon.weapon_type}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Select Default Equipment
                  </label>
                  <select
                    value={formData.defaultEquipment}
                    onChange={(e) => handleInputChange("defaultEquipment", e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 ${
                      theme === "dark"
                        ? "bg-zinc-800 border-gray-700 text-gray-300 focus:border-gray-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-gray-500"
                    }`}
                  >
                    <option value="">Select equipment</option>
                    {availableEquipment.map((eq) => (
                      <option key={eq.id} value={eq.id}>
                        {eq.equipment_type} ({eq.day_night})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
