export default function DashboardAiAnalysis() {
  return (
    <>
      <h2 className="text-lg font-semibold mb-6 ">Tactical AI Analysis</h2>
      <div className="space-y-4 ">
        {[
          {
            dot: "bg-[#2CB67D]",
            title: "High-Value Target Alert",
            text: "Long-range engagement effectiveness up 14% this quarter. Deploy advanced optics.",
          },
          {
            dot: "bg-[#7F5AF0]",
            title: "Critical Maintenance",
            text: "3 sniper rifles require recalibration. Deviation observed in recent ops.",
          },
          {
            dot: "bg-[#FF8906]",
            title: "Terrain Advantage",
            text: "Urban ops accuracy improved 22% with thermal imaging. Recommend full rollout.",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className=" rounded-lg px-4 py-2 max-h-[40px] overflow-hidden flex items-center "
          >
            <div
              className={`w-3 h-3 rounded-full ${item.dot} mr-3 flex-shrink-0`}
            />
            <div className="truncate text-sm text-white font-medium">
              <span className="truncate">{item.title}</span>
              <span className="text-gray-800 ml-2 hidden ">– {item.text}</span>
            </div>
          </div>
        ))}
        <button className="mt-4 w-full py-3   rounded-lg text-sm font-medium text-white">
          View Full Intelligence Report
        </button>
      </div>
    </>
  );
}
