import { ScoreFormValues } from "@/hooks/useScoreForm";
import { Assignment } from "@/types/training";

interface Step1Props {
    formValues: ScoreFormValues;
    setFormValues: (values: ScoreFormValues) => void;
    assignmentSessions: Assignment[];
}

export default function TrainingPageScoreFormModalStep1({ formValues, setFormValues, assignmentSessions }: Step1Props) {
    const requiredFields = {
        day_night: "select",
        position: "select",
        distance: "number",
        shots_fired: "number",
        target_hit: "number",
    };

    const optionalFields = {
        target_eliminated: "boolean",
        first_shot_hit: "boolean",
        wind_strength: "number",
        wind_direction: "number",
        time_until_first_shot: "number",
        note: "text",
    };


    const renderField = (field: string, type: string) => (
        <div key={field}>
            <label className="block text-sm text-gray-400 capitalize mb-1.5">
                {field.replace(/_/g, " ")}
            </label>
            {type === "select" ? (
                <select
                    value={(formValues[field as keyof ScoreFormValues] as any) || ""}
                    onChange={(e) => setFormValues({ ...formValues, [field]: e.target.value })}
                    className="w-full rounded-md bg-white/5 px-3 py-2.5 text-white ring-1 ring-white/10 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="">Select {field.replace(/_/g, " ")}</option>
                    {

                        field === "assignment_session_id" ? (
                            assignmentSessions?.map((assignment: Assignment) => (
                                <option key={assignment.id} value={assignment.id}>
                                    {assignment.assignment_name}
                                </option>
                            ))
                        ) : field === "position" ? (
                            <>
                                <option value="lying">Lying</option>
                                <option value="standing">Standing</option>
                                <option value="sitting">Sitting</option>
                                <option value="operational">Operational</option>
                            </>
                        ) : field === "day_night" ? (
                            <>
                                <option value="day">Day</option>
                                <option value="night">Night</option>
                            </>
                        ) : field === "mistake" ? (
                            <>
                                <option value="missed">Missed</option>
                                <option value="wrong target">Wrong Target</option>
                                <option value="slow reaction">Slow Reaction</option>
                            </>
                        ) : (
                            <option value="">No options</option>
                        )}
                </select>
            ) : (
                type === "boolean" ?
                    <select
                        value={(formValues as any)[field] || ""}
                        onChange={(e) => setFormValues({ ...formValues, [field]: e.target.value })}
                        className="w-full rounded-md bg-white/5 px-3 py-2.5 text-white ring-1 ring-white/10 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">Select {field.replace(/_/g, " ")}</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                    :
                    <input
                        type={type}
                        value={(formValues as any)[field] || ""}
                        onChange={(e) => setFormValues({ ...formValues, [field]: e.target.value })}
                        className="w-full rounded-md bg-white/5 px-3 py-2.5 text-white ring-1 ring-white/10 focus:ring-indigo-500 sm:text-sm"
                    />
            )}
        </div>
    );

    return (
        <div className="grid grid-cols-2 gap-6">
            <div>
                <label className="block text-sm text-gray-400 mb-1.5">Assignment</label>
                <select
                    value={formValues.assignment_session_id}
                    onChange={(e) => setFormValues({ ...formValues, assignment_session_id: e.target.value })}
                    className="w-full rounded-md bg-white/5 px-3 py-2.5 text-white ring-1 ring-white/10 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="">Select assignment</option>
                    {assignmentSessions.map((session: Assignment) => (
                        <option key={session.id} value={session.id}>
                            {session.assignment.assignment_name}
                        </option>
                    ))}
                </select>
            </div>

            {Object.entries(requiredFields).map(([field, type]) => renderField(field, type))}

            <div className="col-span-2 h-4" />

            <div className="col-span-2 grid grid-cols-2 gap-4">
                {Object.entries(optionalFields).map(([field, type]) => renderField(field, type))}
            </div>
        </div>
    );
}
