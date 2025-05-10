import { useStore } from "zustand";
import SearchableCheckboxList from "./SearchableCheckboxList";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";
import { ScoreFormValues } from "@/hooks/useScoreForm";
import { Users, Package } from "lucide-react";
import TrainingPageScoreFormModalUserParticipant from "./TrainingPageScoreFormModal/TrainingPageScoreFormModalUserParticipant";
import { useEffect } from "react";
import { userStore } from "@/store/userStore";

interface Step2Props {
  formValues: ScoreFormValues;
  setFormValues: (values: ScoreFormValues) => void;
  formattedMembers: { id: string; label: string }[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function TrainingPageScoreFormModalStep2({ formValues, setFormValues, formattedMembers, searchTerm, setSearchTerm }: Step2Props) {
  const { weapons } = useStore(weaponsStore);
  const { equipments } = useStore(equipmentStore);
  const { user } = useStore(userStore);

  useEffect(() => {
    if (user?.id && !formValues.participants.includes(user.id)) {
      setFormValues({
        ...formValues,
        participants: [user.id, ...formValues.participants],
      });
    }
  }, [user]);

  function onChangeUserDuty(duty: string, id: string) {
    const newFormValues = {
      ...formValues,
      duties: { ...formValues.duties, [id]: duty },
    };

    if (duty === "Sniper") {
      newFormValues.weapons = { ...formValues.weapons, [id]: null };
      newFormValues.equipment = { ...formValues.equipment, [id]: null };
    } else if (duty === "Spotter") {
      newFormValues.equipment = { ...formValues.equipment, [id]: null };
      newFormValues.weapons = { ...formValues.weapons, [id]: null };
    }

    setFormValues(newFormValues);
  }

  return (
    <div className="w-full">
      {/* Participants Selection */}
      <div className="mb-6 to-indigo-950/90">
        <div className="flex items-center gap-2 mb-3">
          <Users className="text-indigo-400 drop-shadow-glow" size={18} />
          <h2 className="text-base font-semibold text-indigo-200">Squad Members</h2>
        </div>
        <SearchableCheckboxList
          items={formattedMembers}
          selectedIds={formValues.participants}
          setSelectedIds={(ids) => setFormValues({ ...formValues, participants: ids })}
          searchTerm={searchTerm}
          setSearchTerm={(term) => setSearchTerm(term)}
          searchPlaceholder="Search members..."
          emptyMessage="No users available"
          maxHeight={180}
          showBadges
        />
      </div>

      {/* Participant Loadouts */}
      {formValues?.participants?.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Package className="text-green-400 drop-shadow-glow" size={18} />
            <h3 className="text-base font-semibold text-green-200 drop-shadow-md">Participant Loadouts</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-green-700/40 via-indigo-700/30 to-transparent ml-3"></div>
          </div>

          {formValues?.participants?.map((id: string) => {
            return (
              <TrainingPageScoreFormModalUserParticipant
                member={formattedMembers?.find((m) => m.id === id)}
                userDuty={formValues?.duties?.[id]}
                onChangeUserDuty={onChangeUserDuty}
                id={id}
                formValues={formValues}
                setFormValues={setFormValues}
                weapons={weapons}
                equipment={equipments}
              />
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {formValues?.participants?.length === 0 && (
        <div className="text-center py-8 bg-gradient-to-br from-indigo-900/20 via-zinc-900/30 to-indigo-950/20 rounded-xl border border-indigo-800/30 shadow">
          <Users className="h-10 w-10 text-indigo-600 mx-auto mb-3 drop-shadow-glow" />
          <p className="text-indigo-300 mb-1">No participants selected</p>
          <p className="text-indigo-400 text-sm">Select squad members from the list above to configure their loadouts</p>
        </div>
      )}
    </div>
  );
}
