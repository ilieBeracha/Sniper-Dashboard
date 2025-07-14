import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Users, Target, Crosshair, Settings, Send, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useStore } from "zustand";
import { TrainingStore } from "@/store/trainingStore";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";
import { teamStore } from "@/store/teamStore";
import BaseButton from "@/components/base/BaseButton";
import Header from "@/Headers/Header";
import { userStore } from "@/store/userStore";
import { useParams } from "react-router-dom";

interface SessionData {
  assignment_id: string;
  dayPeriod: string;
  timeToFirstShot: number | null;
  note: string;
  squad_id: string;
}

interface Participant {
  userId: string;
  name: string;
  userDuty: string;
  position: string;
  weaponId: string;
  equipmentId: string;
}

interface TargetEngagement {
  userId: string;
  shotsFired: number;
  targetHits: number;
}

interface Target {
  id: string;
  distance: number;
  windStrength: number | null;
  windDirection: number | null;
  mistakeCode: string;
  engagements: TargetEngagement[];
}

export default function ImprovedSessionStats() {
  const { theme } = useTheme();
  const { id } = useParams();

  const { user } = useStore(userStore);
  const { training, loadTrainingById } = useStore(TrainingStore);
  const { weapons } = useStore(weaponsStore);
  const { equipments } = useStore(equipmentStore);
  const { members } = useStore(teamStore);

  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    (async () => {
      if (id) {
        await loadTrainingById(id);
      }
    })();
  }, [id]);

  // Track scroll position to update active section
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const sections = container.querySelectorAll('[id^="session-"], [id^="participants"], [id^="targets"], [id^="engagements"], [id^="summary"]');

    // Check if we're at the bottom of the container
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;

    if (isAtBottom) {
      // If at bottom, activate the last section
      setActiveSection(sections.length - 1);
    } else {
      // Otherwise use the normal detection logic
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        if (rect.top >= containerRect.top && rect.top <= containerRect.top + 200) {
          setActiveSection(index);
        }
      });
    }
  };

  // State management
  const [sessionData, setSessionData] = useState<SessionData>({
    assignment_id: "",
    dayPeriod: "",
    timeToFirstShot: null,
    note: "",
    squad_id: "",
  });

  const [participants, setParticipants] = useState<Participant[]>([
    {
      userId: user?.id || "",
      name: user?.first_name || user?.last_name || user?.email || "",
      userDuty: user?.user_role || "Sniper",
      position: "Lying",
      weaponId: user?.user_default_weapon || "",
      equipmentId: user?.user_default_equipment || "",
    },
  ]);

  const [targets, setTargets] = useState<Target[]>([
    {
      id: "target-1",
      distance: 300,
      windStrength: 5,
      windDirection: 90,
      mistakeCode: "",
      engagements: [
        {
          userId: "1",
          shotsFired: 10,
          targetHits: 8,
        },
      ],
    },
  ]);

  const trainingAssignments = training?.assignment_sessions || [];
  const teamMembers = members || [];
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Validation functions for each section
  const validateSessionConfig = () => {
    return sessionData.assignment_id && sessionData.dayPeriod && sessionData.timeToFirstShot !== null;
  };

  const validateParticipants = () => {
    if (participants.length === 0) return false;
    return participants.every((p) => {
      if (p.userDuty === "Sniper") {
        return p.weaponId !== "";
      }
      return p.equipmentId !== "";
    });
  };

  const validateTargets = () => {
    return targets.length > 0;
  };

  const validateEngagements = () => {
    if (targets.length === 0) return false;
    const snipers = participants.filter((p) => p.userDuty === "Sniper");
    if (snipers.length === 0) return false;

    // Check if at least one engagement has been recorded
    return targets.some((target) => target.engagements.some((e) => e.shotsFired > 0));
  };

  const getSectionValidationStatus = (sectionIndex: number) => {
    switch (sectionIndex) {
      case 0:
        return validateSessionConfig();
      case 1:
        return validateParticipants();
      case 2:
        return validateTargets();
      case 3:
        return validateEngagements();
      case 4:
        return validateSessionConfig() && validateParticipants() && validateTargets() && validateEngagements();
      default:
        return false;
    }
  };

  const sections = [
    { id: "session-config", title: "Session Configuration", icon: Settings, description: "Basic information" },
    { id: "participants", title: "Team Participants", icon: Users, description: "Team members" },
    { id: "targets", title: "Training Targets", icon: Target, description: "Target setup" },
    { id: "engagements", title: "Target Engagements", icon: Crosshair, description: "Performance data" },
    { id: "summary", title: "Summary", icon: CheckCircle2, description: "Review & submit" },
  ];

  // Helper functions
  const updateSessionData = (field: keyof SessionData, value: any) => {
    setSessionData((prev) => ({ ...prev, [field]: value }));
  };

  const updateParticipant = (userId: string, field: keyof Participant, value: any) => {
    setParticipants((prev) => prev.map((p) => (p.userId === userId ? { ...p, [field]: value } : p)));
  };

  const addParticipant = (memberId: string) => {
    const member = teamMembers.find((m) => m.id === memberId);
    if (member && !participants.find((p) => p.userId === member.id)) {
      const newParticipant: Participant = {
        userId: member.id,
        name: member.first_name || member.last_name ? `${member.first_name || ""} ${member.last_name || ""}`.trim() : member.email,
        userDuty: "Sniper",
        position: "Lying",
        weaponId: "",
        equipmentId: "",
      };
      setParticipants((prev) => [...prev, newParticipant]);
    }
  };

  const addSquad = () => {
    const squadMembers = teamMembers?.filter(
      (member: any) => member.squad_id === user?.squad_id && !participants.find((p: any) => p.userId === member.id),
    );

    squadMembers.forEach((member: any) => {
      const newParticipant: Participant = {
        userId: member.id,
        name: member.first_name || member.last_name ? `${member.first_name || ""} ${member.last_name || ""}`.trim() : member.email,
        userDuty: "Sniper",
        position: "Lying",
        weaponId: "",
        equipmentId: "",
      };
      setParticipants((prev) => [...prev, newParticipant]);
    });
  };

  const removeParticipant = (userId: string) => {
    // Prevent removing the current user
    if (userId === user?.id) return;
    setParticipants((prev) => prev.filter((p) => p.userId !== userId));
  };

  const addTarget = () => {
    const newTarget: Target = {
      id: `target-${Date.now()}`,
      distance: 100,
      windStrength: null,
      windDirection: null,
      mistakeCode: "",
      engagements: [],
    };
    setTargets((prev) => [...prev, newTarget]);
  };

  const updateTarget = (targetId: string, field: keyof Target, value: any) => {
    setTargets((prev) => prev.map((t) => (t.id === targetId ? { ...t, [field]: value } : t)));
  };

  const removeTarget = (targetId: string) => {
    setTargets((prev) => prev.filter((t) => t.id !== targetId));
  };

  const updateEngagement = (targetId: string, userId: string, field: "shotsFired" | "targetHits", value: number) => {
    setTargets((prev) =>
      prev.map((target) => {
        if (target.id !== targetId) return target;

        const existingEngagement = target.engagements.find((e) => e.userId === userId);
        if (existingEngagement) {
          return {
            ...target,
            engagements: target.engagements.map((e) => (e.userId === userId ? { ...e, [field]: value } : e)),
          };
        } else {
          return {
            ...target,
            engagements: [
              ...target.engagements,
              {
                userId,
                shotsFired: field === "shotsFired" ? value : 0,
                targetHits: field === "targetHits" ? value : 0,
              },
            ],
          };
        }
      }),
    );
  };

  const handleSubmit = () => {
    // Validation
    const errors: string[] = [];
    if (!sessionData.assignment_id) errors.push("Training Assignment is required");
    if (!sessionData.dayPeriod) errors.push("Time Period is required");
    if (!sessionData.timeToFirstShot) errors.push("Time to First Shot is required");

    setValidationErrors(errors);

    if (errors.length === 0) {
      // Submit logic here
      console.log("Submitting session data:", { sessionData, participants, targets });
    }
  };

  const SectionHeader = ({ section }: { section: any }) => (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-gray-100 dark:bg-zinc-800/50 rounded-lg">
          <section.icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </div>
        <div>
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">{section.title}</h2>
          <p className="text-gray-500 dark:text-zinc-500 text-xs">{section.description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark bg-[#121212]" : "bg-gray-100"}`}>
      {/* Header */}
      <Header />

      {/* Progress Indicator */}
      <div className="fixed top-20 right-4 z-10 flex flex-col gap-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-3 rounded-lg shadow-lg">
        {/* <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Progress</div> */}
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" })}
          >
            <div className="relative">
              <div
                className={`w-3 h-3 rounded-full transition-all ${
                  index < activeSection
                    ? getSectionValidationStatus(index)
                      ? "bg-green-500"
                      : "bg-yellow-500"
                    : index === activeSection
                      ? getSectionValidationStatus(index)
                        ? "bg-indigo-600 scale-125"
                        : "bg-yellow-500 scale-125"
                      : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                {index < activeSection && getSectionValidationStatus(index) && <CheckCircle2 className="w-3 h-3 text-white absolute inset-0" />}
              </div>
              {index < sections.length - 1 && (
                <div
                  className={`absolute top-3 left-1/2 -translate-x-1/2 w-0.5 h-6 transition-all ${
                    index < activeSection ? (getSectionValidationStatus(index) ? "bg-green-500" : "bg-yellow-500") : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              )}
            </div>
            <div className="hidden lg:block">
              <div
                className={`text-xs transition-all ${
                  index === activeSection ? "text-indigo-600 dark:text-indigo-400 font-medium" : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {section.title}
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-500">{section.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="max-w-6xl mx-auto px-4 py-4 lg:py-12 space-y-24 snap-y snap-mandatory h-[calc(100vh-5rem)] overflow-y-auto scroll-smooth"
        onScroll={handleScroll}
      >
        {/* Session Configuration */}
        <div id="session-config" className="snap-start scroll-mt-4 min-h-[85vh] space-y-4">
          <SectionHeader section={sections[0]} />
          <Card className="border-0 shadow-sm dark:shadow-black/20 bg-white dark:bg-[#1A1A1A]">
            <CardContent className="px-4  ">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div className="space-y-3">
                  <Label htmlFor="assignment" className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Training Assignment <span className="text-red-500">*</span>
                  </Label>
                  <select
                    value={sessionData.assignment_id}
                    onChange={(e) => updateSessionData("assignment_id", e.target.value)}
                    className="w-full h-10 px-3 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white transition-all"
                  >
                    <option value="">Select assignment type</option>
                    {trainingAssignments.map((assignment) => (
                      <option key={assignment.id} value={assignment.id}>
                        {assignment.assignment_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="dayPeriod" className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Time Period <span className="text-red-500">*</span>
                  </Label>
                  <select
                    value={sessionData.dayPeriod}
                    onChange={(e) => updateSessionData("dayPeriod", e.target.value)}
                    className="w-full h-10 px-3 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white transition-all"
                  >
                    <option value="">Select time period</option>
                    <option value="day">Day Training</option>
                    <option value="night">Night Training</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="timeToFirstShot" className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Time to First Shot (seconds) <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-3">
                    <Input
                      id="timeToFirstShot"
                      type="number"
                      placeholder="Enter response time"
                      value={sessionData.timeToFirstShot || ""}
                      onChange={(e) => updateSessionData("timeToFirstShot", e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full h-10 border-gray-300 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-zinc-800 dark:text-white transition-all"
                    />
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">Quick presets:</span>
                      {[3, 5, 10].map((seconds) => (
                        <Button
                          key={seconds}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateSessionData("timeToFirstShot", seconds)}
                          className="h-8 px-4 text-sm border-gray-300 dark:border-white/10 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all"
                        >
                          {seconds}s
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 lg:col-span-2">
                  <Label htmlFor="notes" className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Session Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any relevant notes about the training session, weather conditions, special circumstances..."
                    className="w-full min-h-[120px] border-gray-300 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-zinc-800 dark:text-white resize-none transition-all"
                    value={sessionData.note}
                    onChange={(e) => updateSessionData("note", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Step Teaser */}
        </div>

        {/* Participants   */}
        <div id="participants" className="snap-start scroll-mt-4 min-h-[85vh] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <SectionHeader section={sections[1]} />
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={addSquad}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <Users className="w-4 h-4" />
                <span>Add Squad</span>
              </button>
              <select
                className="h-10 px-3 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white w-full sm:w-auto"
                onChange={(e) => {
                  if (e.target.value) {
                    addParticipant(e.target.value);
                    e.target.value = "";
                  }
                }}
              >
                <option value="">+ Add Member</option>
                {teamMembers
                  .filter((member) => !participants.find((p) => p.userId === member.id))
                  .map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.first_name || member.last_name ? `${member.first_name || ""} ${member.last_name || ""}`.trim() : member.email}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <Card className="border-0 shadow-sm dark:shadow-black/20 bg-white dark:bg-[#1A1A1A] py-2">
            <CardContent className="px-2">
              <div className="space-y-4">
                {participants.map((participant, index) => (
                  <div
                    key={participant.userId}
                    className="border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-zinc-900/30 rounded-lg p-4"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {participant.name}
                            {participant.userId === user?.id && <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(You)</span>}
                          </h4>
                        </div>
                      </div>
                      {participant.userId !== user?.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeParticipant(participant.userId)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    {/* Horizontal Form Layout */}
                    <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                      {/* Role */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Role</label>
                        <select
                          value={participant.userDuty}
                          onChange={(e) => updateParticipant(participant.userId, "userDuty", e.target.value)}
                          className="w-full h-10 px-2 text-xs  border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
                        >
                          <option value="Sniper">Sniper</option>
                          <option value="Spotter">Spotter</option>
                        </select>
                      </div>

                      {/* Position */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Position</label>
                        <select
                          value={participant.position}
                          onChange={(e) => updateParticipant(participant.userId, "position", e.target.value)}
                          className="w-full h-10 px-2  text-xs  border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
                        >
                          <option value="Lying">Prone</option>
                          <option value="Standing">Standing</option>
                          <option value="Sitting">Sitting</option>
                          <option value="Operational">Operational</option>
                        </select>
                      </div>

                      {/* Weapon/Equipment */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
                          {participant.userDuty === "Sniper" ? "Weapon" : "Equipment"}
                        </label>
                        <select
                          value={participant.userDuty === "Sniper" ? participant.weaponId : participant.equipmentId}
                          onChange={(e) =>
                            updateParticipant(participant.userId, participant.userDuty === "Sniper" ? "weaponId" : "equipmentId", e.target.value)
                          }
                          className="w-full h-10 px-2 text-xs  border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
                        >
                          <option value="">Select</option>
                          {participant.userDuty === "Sniper"
                            ? weapons.map((weapon) => (
                                <option key={weapon.id} value={weapon.id || ""}>
                                  {weapon.weapon_type}
                                </option>
                              ))
                            : equipments.map((equipment) => (
                                <option key={equipment.id} value={equipment.id || ""}>
                                  {equipment.equipment_type}
                                </option>
                              ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {participants.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-lg ">
                  <Users className="w-14 h-14 mx-auto text-gray-400 dark:text-zinc-600 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No team members added</h3>
                  <p className="text-gray-600 dark:text-zinc-400 mb-6">Add participants to start building your training team</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Targets */}
        <div id="targets" className="snap-start scroll-mt-4 min-h-[85vh] space-y-4">
          <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <SectionHeader section={sections[2]} />
            <button
              onClick={addTarget}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600 w-full sm:w-auto"
            >
              <Target className="w-4 h-4" />
              <span>Add Target</span>
            </button>
          </div>
          <Card className="border-0 shadow-sm dark:shadow-black/20 bg-white dark:bg-[#1A1A1A] py-2">
            <CardContent className="px-2 ">
              <div className="space-y-4 lg:space-y-6">
                {targets.map((target, index) => (
                  <div
                    key={target.id}
                    className="border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-zinc-900/30 rounded-lg p-4 lg:p-6"
                  >
                    <div className="flex  sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-zinc-700 dark:to-zinc-800 rounded-lg flex items-center justify-center text-base font-medium text-gray-700 dark:text-gray-300 flex-shrink-0 shadow-sm">
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white text-lg">Target #{index + 1}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTarget(target.id)}
                        className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors self-start sm:self-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                      <div className="space-y-3 lg:col-span-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-base font-medium text-gray-700 dark:text-gray-300">Distance (meters)</Label>
                          <span className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">{target.distance}m</span>
                        </div>
                        <div className="space-y-2">
                          <input
                            type="range"
                            value={target.distance}
                            onChange={(e) => updateTarget(target.id, "distance", parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400"
                            min="100"
                            max="900"
                            step="25"
                          />
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>100m</span>
                            <span>300m</span>
                            <span>500m</span>
                            <span>700m</span>
                            <span>900m</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm sm:text-xs lg:text-base font-medium text-gray-700 dark:text-gray-300">Wind Speed (m/s)</Label>
                          <Input
                            type="number"
                            placeholder="Optional"
                            value={target.windStrength || ""}
                            onChange={(e) => updateTarget(target.id, "windStrength", e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full h-10 border-gray-300 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-zinc-800 dark:text-white transition-all"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm sm:text-xs lg:text-base font-medium text-gray-700 dark:text-gray-300">Wind Direction (°)</Label>
                          <Input
                            type="number"
                            placeholder="0-360°"
                            min="0"
                            max="360"
                            value={target.windDirection || ""}
                            onChange={(e) => updateTarget(target.id, "windDirection", e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full h-10 border-gray-300 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-zinc-800 dark:text-white transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 lg:col-span-2">
                        <Label className="text-base sm:text-xs lg:text-base font-medium text-gray-700 dark:text-gray-300">Mistake Code</Label>
                        <Input
                          placeholder="Optional"
                          value={target.mistakeCode}
                          onChange={(e) => updateTarget(target.id, "mistakeCode", e.target.value)}
                          className="w-full h-10 border-gray-300 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-zinc-800 dark:text-white transition-all"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {targets.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-lg ">
                    <Target className="w-14 h-14 mx-auto text-gray-400 dark:text-zinc-600 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No targets configured</h3>
                    <p className="text-gray-600 dark:text-zinc-400 mb-6">Add targets to define your shooting range setup</p>
                    <BaseButton onClick={addTarget} style="default">
                      <Plus className="w-5 h-5 mr-2" />
                      Add First Target
                    </BaseButton>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Engagements */}
        <div id="engagements" className="snap-start scroll-mt-4 min-h-[85vh] space-y-4">
          <SectionHeader section={sections[3]} />
          <Card className="border-0 shadow-sm dark:shadow-black/20 bg-white dark:bg-[#1A1A1A]">
            <CardContent className="px-2 ">
              <div className="space-y-6 lg:space-y-8">
                {targets.map((target, targetIndex) => (
                  <div key={target.id}>
                    <div className=" border-b border-gray-200 dark:border-white/10 p-4 lg:p-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <span>
                            Target #{targetIndex + 1} - {target.distance}m
                          </span>
                          {(target.windStrength || target.windDirection) && (
                            <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                              (Wind: {target.windStrength || 0}m/s at {target.windDirection || 0}°)
                            </span>
                          )}
                        </div>
                      </h3>
                    </div>
                    <div className="p-4 lg:p-6">
                      <div className="space-y-4 lg:space-y-6">
                        {participants
                          .filter((p) => p.userDuty === "Sniper")
                          .map((participant) => {
                            const engagement = target.engagements.find((e) => e.userId === participant.userId);

                            return (
                              <div key={participant.userId}>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                                  <div className="flex items-center space-x-3">
                                    <Badge
                                      variant="secondary"
                                      className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-0"
                                    >
                                      Sniper
                                    </Badge>
                                    <div className="min-w-0 flex-1">
                                      <p className="font-medium text-gray-900 dark:text-white truncate">{participant.name}</p>
                                      <p className="text-sm text-gray-600 dark:text-zinc-400">{participant.position} position</p>
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    <Label className="text-base font-medium text-gray-700 dark:text-gray-300">Shots Fired</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      placeholder="0"
                                      value={engagement?.shotsFired || ""}
                                      onChange={(e) => updateEngagement(target.id, participant.userId, "shotsFired", parseInt(e.target.value) || 0)}
                                      className="w-full h-10 border-gray-300 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-zinc-800 dark:text-white transition-all"
                                    />
                                  </div>

                                  <div className="space-y-3">
                                    <Label className="text-base font-medium text-gray-700 dark:text-gray-300">Target Hits</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      placeholder="Optional"
                                      value={engagement?.targetHits || ""}
                                      onChange={(e) => updateEngagement(target.id, participant.userId, "targetHits", parseInt(e.target.value) || 0)}
                                      className="w-full h-10 border-gray-300 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-zinc-800 dark:text-white transition-all"
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                        {participants.filter((p) => p.userDuty === "Sniper").length === 0 && (
                          <div className="text-center py-8 text-gray-500 dark:text-zinc-400">
                            <Crosshair className="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-zinc-600" />
                            <p>No snipers assigned. Add participants with sniper role to record engagements.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {targets.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-lg bg-gray-50/50 dark:bg-zinc-800">
                    <Target className="w-14 h-14 mx-auto text-gray-400 dark:text-zinc-600 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No targets to engage</h3>
                    <p className="text-gray-600 dark:text-zinc-400">Configure targets above to record engagements</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div id="summary" className="snap-start scroll-mt-4 min-h-[70vh] space-y-4">
          <SectionHeader section={sections[4]} />
          <Card className="border-0 shadow-sm dark:shadow-black/20 bg-white dark:bg-[#1A1A1A]">
            <CardContent className="px-2 py-4 lg:py-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                <div className="border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-zinc-900/30 rounded-lg p-4 lg:p-6 text-center hover:shadow-md transition-shadow">
                  <div className="text-3xl font-light text-gray-900 dark:text-white mb-1">{participants.length}</div>
                  <div className="text-base text-gray-600 dark:text-zinc-400">Participants</div>
                </div>

                <div className="border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-zinc-900/30 rounded-lg p-4 lg:p-6 text-center hover:shadow-md transition-shadow">
                  <div className="text-3xl font-light text-gray-900 dark:text-white mb-1">{targets.length}</div>
                  <div className="text-base text-gray-600 dark:text-zinc-400">Targets</div>
                </div>

                <div className="border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-zinc-900/30 rounded-lg p-4 lg:p-6 text-center hover:shadow-md transition-shadow">
                  <div className="text-3xl font-light text-gray-900 dark:text-white mb-1">
                    {targets.reduce((total, target) => total + target.engagements.reduce((sum, eng) => sum + (eng.shotsFired || 0), 0), 0)}
                  </div>
                  <div className="text-base text-gray-600 dark:text-zinc-400">Total Shots</div>
                </div>

                <div className="border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-zinc-900/30 rounded-lg p-4 lg:p-6 text-center hover:shadow-md transition-shadow">
                  <div className="text-3xl font-light text-gray-900 dark:text-white mb-1">
                    {targets.reduce((total, target) => total + target.engagements.reduce((sum, eng) => sum + (eng.targetHits || 0), 0), 0)}
                  </div>
                  <div className="text-base text-gray-600 dark:text-zinc-400">Total Hits</div>
                </div>
              </div>

              <div className="text-center">
                <BaseButton onClick={handleSubmit} style="purple" padding="px-8 lg:px-12 py-3" className="shadow-lg hover:shadow-xl transition-all">
                  <Send className="w-6 h-6 mr-2" />
                  Submit Training Session
                </BaseButton>
                <p className="text-base text-gray-500 dark:text-zinc-400 mt-4">
                  Once submitted, this data will be permanently saved to your training records.
                </p>
              </div>
            </CardContent>
            {validationErrors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-4 lg:p-6 backdrop-blur-sm">
                <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-3">Please fix the following errors:</h3>
                <ul className="space-y-2">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
                      <span className="text-red-500 dark:text-red-400 mt-0.5">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
          {/* Validation Errors */}
        </div>
      </div>
    </div>
  );
}
