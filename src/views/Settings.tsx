import { useTheme } from "@/contexts/ThemeContext";
import BaseInput from "@/components/base/BaseInput";
import { User as UserIcon, Settings as SettingsIcon, Shield, Target, Crosshair, Users, Crown, Download } from "lucide-react";
import { SpPage, SpPageBody, SpPageHeader, SpPageTabs } from "@/layouts/SpPage";
import Header from "@/Headers/Header";
import { useSettingsPageLogic } from "@/hooks/useSettingsPageLogic";
import { useTabs } from "@/hooks/useTabs";
import { UserRole } from "@/types/user";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import SettingsDataExportPanel from "@/components/SettingsDataExportPanel";

const InfoField = ({ label, value, icon }: { label: string; value: string | null | undefined; icon: React.ReactNode }) => {
  const { theme } = useTheme();

  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{label}</label>
      <div
        className={`flex items-center gap-3 p-3 rounded-lg border ${
          theme === "dark" ? "bg-zinc-800/30 border-zinc-700 text-gray-200" : "bg-gray-50 border-gray-200 text-gray-900"
        }`}
      >
        <div className={`flex-shrink-0 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{icon}</div>
        <span className="font-medium">{value || "Not assigned"}</span>
      </div>
    </div>
  );
};

export default function Settings() {
  const { theme } = useTheme();
  const { user } = useStore(userStore);
  const {
    formData,

    availableWeapons,
    availableEquipment,
    handleFormChange,
    handleDutyChange,
    UserDuty,
    emailError,
    handleWeaponChange,
    handleEquipmentChange,
  } = useSettingsPageLogic();

  const { tabs, activeTab, handleTabChange } = useTabs({
    tabs: [
      { id: "account", label: "Account", icon: SettingsIcon },
      { id: "export", label: "Export", icon: Download },
    ],
  });

  const userRole = user?.user_role ?? null;

  return (
    <SpPage>
      <Header breadcrumbs={[{ label: "Settings", link: "/settings" }]} />
      <SpPageHeader title="Settings" subtitle="Manage your account settings and preferences" icon={SettingsIcon} />
      <SpPageTabs tabs={tabs} activeTab={activeTab.id} onChange={handleTabChange} />
      <SpPageBody>
        {activeTab.id === "export" && <SettingsDataExportPanel />}
        {activeTab.id === "account" && (
          <div className="max-w-5xl mx-auto">
            <div className="space-y-6">
              {/* Profile & Team Information Combined */}
              <div className={`p-6 rounded-xl border ${theme === "dark" ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Profile Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <UserIcon className="w-5 h-5 text-blue-500" />
                      <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Profile Information</h3>
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
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Users className="w-5 h-5 text-green-500" />
                      <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Team & Squad</h3>
                    </div>

                    <div className="space-y-4">
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
                          <InfoField label="Team Name" value={formData.team_name} icon={<Crown className="w-4 h-4" />} />
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
                          <InfoField label="Team Name" value={formData.team_name} icon={<Crown className="w-4 h-4" />} />
                          <InfoField label="Squad Name" value={formData.squad_name} icon={<Users className="w-4 h-4" />} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Role & Equipment Settings */}
              <div className={`p-6 rounded-xl border ${theme === "dark" ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"}`}>
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-5 h-5 text-purple-500" />
                  <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Role & Equipment</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Role Selection */}
                  <div className="space-y-3">
                    <label className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Default Role</label>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleDutyChange(UserDuty.SNIPER)}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 ${
                          formData.user_default_duty === UserDuty.SNIPER
                            ? "border-purple-500 bg-purple-50 text-purple-900 dark:bg-purple-900/20 dark:text-purple-200"
                            : theme === "dark"
                              ? "border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50 text-gray-200"
                              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-900"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Target className="w-4 h-4 flex-shrink-0" />
                          <div className="text-left">
                            <div className="font-medium">Sniper</div>
                            <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Primary shooter role</div>
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleDutyChange(UserDuty.SPOTTER)}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 ${
                          formData.user_default_duty === UserDuty.SPOTTER
                            ? "border-purple-500 bg-purple-50 text-purple-900 dark:bg-purple-900/20 dark:text-purple-200"
                            : theme === "dark"
                              ? "border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50 text-gray-200"
                              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-900"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Crosshair className="w-4 h-4 flex-shrink-0" />
                          <div className="text-left">
                            <div className="font-medium">Spotter</div>
                            <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Support observer role</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Equipment/Weapon Selection */}
                  <div className="space-y-3">
                    <label className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      {formData.user_default_duty === UserDuty.SNIPER ? "Default Weapon" : "Default Equipment"}
                    </label>
                    {formData.user_default_duty === UserDuty.SNIPER ? (
                      <select
                        value={formData.user_default_weapon || ""}
                        onChange={(e) => handleWeaponChange(e.target.value)}
                        className={`w-full px-3 py-3 rounded-lg border transition-all duration-200 ${
                          theme === "dark"
                            ? "bg-zinc-800/50 border-zinc-700 text-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                            : "bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        }`}
                      >
                        <option value="">Select a weapon</option>
                        {(() => {
                          const groupedWeapons = availableWeapons
                            .filter((weapon) => weapon.serial_number && weapon.serial_number.trim() !== "")
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
                        className={`w-full px-3 py-3 rounded-lg border transition-all duration-200 ${
                          theme === "dark"
                            ? "bg-zinc-800/50 border-zinc-700 text-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                            : "bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        }`}
                      >
                        <option value="">Select equipment</option>
                        {(() => {
                          const groupedEquipment = availableEquipment
                            .filter((eq) => eq.serial_number && eq.serial_number.trim() !== "")
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
                                <option disabled={!eq.serial_number} key={eq.id} value={eq.id}>
                                  {eq.serial_number ? `SN: ${eq.serial_number}` : "No serial number"}
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
        )}
      </SpPageBody>
    </SpPage>
  );
}
