import { format, parseISO } from "date-fns";
import { Table, TableBody, TableHeader, TableRow, TableCell } from "@/ui/table";
import BaseDashboardCard from "@/components/BaseDashboardCard";
import { Edit, Eye } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface TrainingScoresTableProps {
  scores: any[];
  onScoreClick: (score: any) => void;
  onEditClick: (score: any) => void;
  newlyAddedScoreId?: string | null;
}

export default function TrainingScoresTable({ scores, onScoreClick, onEditClick, newlyAddedScoreId }: TrainingScoresTableProps) {
  const { theme } = useTheme();

  return (
    <BaseDashboardCard header="Scores" withBtn>
      <div className="rounded-xl overflow-x-auto">
        <Table className="w-full min-w-[800px] border-separate border-spacing-0">
          <TableHeader>
            <TableRow
              className={`border-b text-xs font-medium uppercase tracking-wider transition-colors duration-200 ${
                theme === "dark" ? "border-white/10 text-gray-400" : "border-gray-200 text-gray-600"
              }`}
            >
              <TableCell
                isHeader
                className={`text-left py-3 sm:text-sm md:text-base px-3 md:py-4 md:px-6 font-semibold whitespace-nowrap transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Assignment
              </TableCell>
              <TableCell
                isHeader
                className={`text-left py-3 sm:text-sm md:text-base px-3 md:py-4 md:px-6 font-semibold whitespace-nowrap transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Participant
              </TableCell>
              <TableCell
                isHeader
                className={`text-left py-3 sm:text-sm md:text-base px-3 md:py-4 md:px-6 font-semibold whitespace-nowrap transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Squad
              </TableCell>
              <TableCell
                isHeader
                className={`text-left py-3 sm:text-sm md:text-base px-3 md:py-4 md:px-6 font-semibold whitespace-nowrap transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Position
              </TableCell>
              <TableCell
                isHeader
                className={`text-left py-3 sm:text-sm md:text-base px-3 md:py-4 md:px-6 font-semibold whitespace-nowrap transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Day/Night
              </TableCell>
              <TableCell
                isHeader
                className={`text-left py-3 sm:text-sm md:text-base px-3 md:py-4 md:px-6 font-semibold whitespace-nowrap transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Target Eliminated
              </TableCell>
              <TableCell
                isHeader
                className={`text-left py-3 sm:text-sm md:text-base px-3 md:py-4 md:px-6 font-semibold whitespace-nowrap transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Time to Shot
              </TableCell>
              <TableCell
                isHeader
                className={`text-left py-3 sm:text-sm md:text-base px-3 md:py-4 md:px-6 font-semibold whitespace-nowrap transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Date
              </TableCell>
              <TableCell
                isHeader
                className={`text-center py-3 sm:text-sm md:text-base px-3 md:py-4 md:px-6 font-semibold whitespace-nowrap transition-colors duration-200 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scores.map((score: any) => {
              const isNewlyAdded = newlyAddedScoreId === score.id;
              return (
                <TableRow
                  key={score.id}
                  className={`border-b transition-all duration-500 ${
                    isNewlyAdded
                      ? "bg-indigo-500/20 border-indigo-400/50 animate-pulse"
                      : theme === "dark"
                        ? "border-gray-700/30 hover:bg-gray-800/40"
                        : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <TableCell
                    className={`py-3 px-3 md:py-4 md:px-6 text-sm md:text-sm whitespace-nowrap transition-colors duration-200 ${
                      theme === "dark" ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    <div className="max-w-[120px] md:max-w-none truncate">{score.assignment_session?.assignment?.assignment_name || "N/A"}</div>
                  </TableCell>
                  <TableCell
                    className={`py-3 px-3 md:py-4 md:px-6 text-sm md:text-sm whitespace-nowrap transition-colors duration-200 ${
                      theme === "dark" ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    <div className="max-w-[100px] md:max-w-none truncate">
                      {score.score_participants?.[0]?.user
                        ? `${score.score_participants[0].user.first_name} ${score.score_participants[0].user.last_name}`
                        : "N/A"}
                    </div>
                  </TableCell>
                  <TableCell
                    className={`py-3 px-3 md:py-4 md:px-6 text-sm md:text-sm whitespace-nowrap transition-colors duration-200 ${
                      theme === "dark" ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    <div className="max-w-[80px] md:max-w-none truncate">{score.score_participants?.[0]?.user?.squad?.squad_name || "N/A"}</div>
                  </TableCell>
                  <TableCell
                    className={`py-3 px-3 md:py-4 md:px-6 text-sm md:text-sm capitalize whitespace-nowrap transition-colors duration-200 ${
                      theme === "dark" ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {score.position || "N/A"}
                  </TableCell>
                  <TableCell
                    className={`py-3 px-3 md:py-4 md:px-6 text-sm md:text-sm capitalize whitespace-nowrap transition-colors duration-200 ${
                      theme === "dark" ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {score.day_night || "N/A"}
                  </TableCell>
                  <TableCell className="py-3 px-3 md:py-4 md:px-6 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${
                        score.target_eliminated
                          ? theme === "dark"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-green-100 text-green-700"
                          : theme === "dark"
                            ? "bg-red-500/20 text-red-300"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {score.target_eliminated ? "Yes" : "No"}
                    </span>
                  </TableCell>
                  <TableCell
                    className={`py-3 px-3 md:py-4 md:px-6 text-sm md:text-sm whitespace-nowrap transition-colors duration-200 ${
                      theme === "dark" ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {score.time_until_first_shot ? `${score.time_until_first_shot}s` : "N/A"}
                  </TableCell>
                  <TableCell
                    className={`py-3 px-3 md:py-4 md:px-6 text-sm md:text-sm whitespace-nowrap transition-colors duration-200 ${
                      theme === "dark" ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {format(parseISO(score.created_at), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="py-3 px-3 md:py-4 md:px-6 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onScoreClick(score);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          theme === "dark"
                            ? "hover:bg-indigo-600/20 text-indigo-400 hover:text-indigo-300"
                            : "hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700"
                        }`}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditClick(score);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          theme === "dark"
                            ? "hover:bg-amber-600/20 text-amber-400 hover:text-amber-300"
                            : "hover:bg-amber-100 text-amber-600 hover:text-amber-700"
                        }`}
                        title="Edit Score"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </BaseDashboardCard>
  );
}
