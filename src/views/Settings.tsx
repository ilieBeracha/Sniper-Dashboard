import { useTheme } from "@/contexts/ThemeContext";
import BaseInput from "@/components/base/BaseInput";
import { User as UserIcon, Settings as SettingsIcon, Shield, Target, Crosshair, Users, Crown } from "lucide-react";
import { SpPage, SpPageBody, SpPageHeader, SpPageTabs } from "@/layouts/SpPage";
import Header from "@/Headers/Header";
import { useSettingsPageLogic } from "@/hooks/useSettingsPageLogic";
import { UserRole } from "@/types/user";

const InfoField = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
        {label}
      </label>
      <div className={`flex items-center gap-3 p-3 rounded-lg border ${
        theme === "dark" 
          ? "bg-zinc-800/50 border-zinc-700 text-gray-200" 
          : "bg-gray-50 border-gray-200 text-gray-900"
      }`}>
        <div className={`flex-shrink-0 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          {icon}
        </div>
        <span className="font-medium">{value || "Not assigned"}</span>
      </div>
    </div>
  );
};

const Settings = () => {
  const { theme } = useTheme();
  const {
    formData,
    user,
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
    emailError,
  } = useSettingsPageLogic();

  const userRole = user?.user_role ?? null;

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
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Settings */}
            <div className={`p-8 rounded-3xl shadow-xl backdrop-blur-sm ${theme === "dark" ? "bg-zinc-900/60 border border-zinc-800/50" : "bg-white/80 border border-gray-200/50"}`}>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-indigo-500/20 border border-blue-500/30 backdrop-blur-sm">
                  <UserIcon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Profile Information</h3>
              </div>

              <div className="space-y-6">
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

                <div className="space-y-2">
                  <BaseInput
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    placeholder="Enter your email"
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm flex items-center gap-2 pl-1">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      {emailError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Team & Squad Information */}
            <div className={`p-8 rounded-3xl shadow-xl backdrop-blur-sm ${theme === "dark" ? "bg-zinc-900/60 border border-zinc-800/50" : "bg-white/80 border border-gray-200/50"}`}>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 border border-green-500/30 backdrop-blur-sm">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Team & Squad</h3>
              </div>

              <div className="space-y-6">
                {/* Team Commander: Show Team Name as editable, no Squad Name */}
                {userRole === UserRole.Commander && (
                  <BaseInput
                    label="Team Name"
                    value={formData.team_name}
                    onChange={(e) => handleFormChange("team_name", e.target.value)}
                    placeholder="Enter your team name"
                  />
                )}

                {/* Squad Commander: Show Team Name as read-only, Squad Name as editable */}
                {userRole === UserRole.SquadCommander && (
                  <>
                    <InfoField
                      label="Team Name"
                      value={formData.team_name}
                      icon={<Crown className="w-4 h-4" />}
                    />
                    <BaseInput
                      label="Squad Name"
                      value={formData.squad_name}
                      onChange={(e) => handleFormChange("squad_name", e.target.value)}
                      placeholder="Enter your squad name"
                    />
                  </>
                )}

                {/* Other roles: Show both Team Name and Squad Name as read-only */}
                {userRole === UserRole.Soldier && (
                  <>
                    <InfoField
                      label="Team Name"
                      value={formData.team_name}
                      icon={<Crown className="w-4 h-4" />}
                    />
                    <InfoField
                      label="Squad Name"
                      value={formData.squad_name}
                      icon={<Users className="w-4 h-4" />}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Role & Equipment Settings Combined */}
            <div className={`lg:col-span-2 p-8 rounded-3xl shadow-xl backdrop-blur-sm ${theme === "dark" ? "bg-zinc-900/60 border border-zinc-800/50" : "bg-white/80 border border-gray-200/50"}`}>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-rose-500/20 border border-purple-500/30 backdrop-blur-sm">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Role & Equipment</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Role Selection */}
                <div className="space-y-4">
                  <label className={`block text-sm font-semibold uppercase tracking-wide ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    Default Role
                  </label>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleDutyChange(UserDuty.SNIPER)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                        formData.user_default_duty === UserDuty.SNIPER
                          ? "border-purple-500 bg-gradient-to-r from-purple-500/20 to-pink-500/20 shadow-lg scale-[1.02]"
                          : theme === "dark"
                            ? "border-gray-700 hover:border-gray-600 hover:bg-zinc-800/50"
                            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        <div className="text-left">
                          <div className={`text-base font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>Sniper</div>
                          <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Primary shooter role</div>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleDutyChange(UserDuty.SPOTTER)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                        formData.user_default_duty === UserDuty.SPOTTER
                          ? "border-purple-500 bg-gradient-to-r from-purple-500/20 to-pink-500/20 shadow-lg scale-[1.02]"
                          : theme === "dark"
                            ? "border-gray-700 hover:border-gray-600 hover:bg-zinc-800/50"
                            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Crosshair className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        <div className="text-left">
                          <div className={`text-base font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>Spotter</div>
                          <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Support observer role</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Equipment/Weapon Selection */}
                <div className="space-y-4">
                  <label className={`block text-sm font-semibold uppercase tracking-wide ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    {formData.user_default_duty === UserDuty.SNIPER ? "Default Weapon" : "Default Equipment"}
                  </label>
                  {formData.user_default_duty === UserDuty.SNIPER ? (
                    <select
                      value={formData.user_default_weapon || ""}
                      onChange={(e) => handleWeaponChange(e.target.value)}
                      className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-200 shadow-sm ${
                        theme === "dark"
                          ? "bg-zinc-800/50 border-zinc-700 text-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                          : "bg-white/50 border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
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
                  ) : (
                    <select
                      value={formData.user_default_equipment || ""}
                      onChange={(e) => handleEquipmentChange(e.target.value)}
                      className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-200 shadow-sm ${
                        theme === "dark"
                          ? "bg-zinc-800/50 border-zinc-700 text-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                          : "bg-white/50 border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SpPageBody>
    </SpPage>
  );
};

export default Settings;
