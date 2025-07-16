import { useTheme } from "@/contexts/ThemeContext";
import BaseInput from "@/components/base/BaseInput";
import { User as UserIcon, Settings as SettingsIcon, Shield, Target, Crosshair } from "lucide-react";
import { SpPage, SpPageBody, SpPageHeader, SpPageTabs } from "@/layouts/SpPage";
import Header from "@/Headers/Header";
import { useSettingsPageLogic } from "@/hooks/useSettingsPageLogic";

const Settings = () => {
  const { theme } = useTheme();
  const {
    formData,
    tabs,
    activeTab,
    setActiveTab,
    availableWeapons,
    availableEquipment,
    handleFormChange,
    handleDutyChange,
    handleWeaponChange,
    handleEquipmentChange,
    UserDuty,
  } = useSettingsPageLogic();

  return (
    <SpPage>
      <Header />
      <SpPageHeader
        breadcrumbs={[
          { label: "Dashboard", link: "/" },
          { label: "Settings", link: "/settings" },
        ]}
        title="Settings"
        subtitle="Manage your account settings and preferences"
        icon={<SettingsIcon />}
      />
      <SpPageTabs tabs={tabs} activeTab={activeTab} onChange={(tab) => setActiveTab(tab as string)} />
      <SpPageBody>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Settings */}
          <div className={`p-6 rounded-2xl ${theme === "dark" ? "bg-zinc-900/50 border border-zinc-800" : "bg-white border border-gray-100"}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <UserIcon className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>Profile Information</h3>
            </div>

            <div className="space-y-4">
              <BaseInput
                label="First Name"
                value={formData.first_name}
                onChange={(e) => handleFormChange("first_name", e.target.value)}
                placeholder="Enter your first name"
              />

              <BaseInput
                label="Last Name"
                value={formData.last_name}
                onChange={(e) => handleFormChange("last_name", e.target.value)}
                placeholder="Enter your last name"
              />

              <BaseInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
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
                    onClick={() => handleDutyChange(UserDuty.SNIPER)}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                      formData.user_default_duty === UserDuty.SNIPER
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
                    onClick={() => handleDutyChange(UserDuty.SPOTTER)}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                      formData.user_default_duty === UserDuty.SPOTTER
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
                {formData.user_default_duty === UserDuty.SNIPER ? "Default Weapon" : "Default Equipment"}
              </h3>
            </div>

            <div className="space-y-4">
              {formData.user_default_duty === UserDuty.SNIPER ? (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Select Default Weapon
                  </label>
                  <select
                    value={formData.user_default_weapon || ""}
                    onChange={(e) => handleWeaponChange(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 shadow-sm ${
                      theme === "dark"
                        ? "bg-zinc-800 border-zinc-700 text-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        : "bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    }`}
                  >
                    <option value="">Select a weapon</option>
                    {(() => {
                      const groupedWeapons = availableWeapons
                        .filter(weapon => weapon.serial_number && weapon.serial_number.trim() !== '')
                        .reduce(
                          (acc, weapon) => {
                            if (!acc[weapon.weapon_type]) {
                              acc[weapon.weapon_type] = [];
                            }
                            acc[weapon.weapon_type].push(weapon);
                            return acc;
                          },
                          {} as Record<string, typeof availableWeapons>,
                        );

                      return Object.entries(groupedWeapons).map(([type, weapons]) => (
                        <optgroup key={type} label={type}>
                          {weapons.map((weapon) => (
                            <option key={weapon.id} value={weapon.id}>
                              SN: {weapon.serial_number}
                            </option>
                          ))}
                        </optgroup>
                      ));
                    })()}
                  </select>
                </div>
              ) : (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Select Default Equipment
                  </label>
                  <select
                    value={formData.user_default_equipment || ""}
                    onChange={(e) => handleEquipmentChange(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 shadow-sm ${
                      theme === "dark"
                        ? "bg-zinc-800 border-zinc-700 text-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        : "bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    }`}
                  >
                    <option value="">Select equipment</option>
                    {(() => {
                      const groupedEquipment = availableEquipment
                        .filter(eq => eq.serial_number && eq.serial_number.trim() !== '')
                        .reduce(
                          (acc, eq) => {
                            if (!acc[eq.equipment_type]) {
                              acc[eq.equipment_type] = [];
                            }
                            acc[eq.equipment_type].push(eq);
                            return acc;
                          },
                          {} as Record<string, typeof availableEquipment>,
                        );

                      return Object.entries(groupedEquipment).map(([type, equipment]) => (
                        <optgroup key={type} label={type}>
                          {equipment.map((eq) => (
                            <option key={eq.id} value={eq.id}>
                              SN: {eq.serial_number}
                            </option>
                          ))}
                        </optgroup>
                      ));
                    })()}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </SpPageBody>
    </SpPage>
  );
};

export default Settings;
