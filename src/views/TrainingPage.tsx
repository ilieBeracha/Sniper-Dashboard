import { useParams } from "react-router-dom";

export default function TrainingPage() {
  const params = useParams();
  const { id } = params;
  return (
    <div className="min-h-screen from-[#1E1E20] text-gray-100 px-6 md:px-16 lg:px-28 py-8 md:py-12">
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Training Page {id}</h1>
        <p>This is the training page where you can manage and view training sessions.</p>
      </div>
    </div>
  );
}
