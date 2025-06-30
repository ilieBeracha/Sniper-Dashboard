import { format, parseISO } from "date-fns";
import { Table, TableBody, TableHeader, TableRow, TableCell } from "@/ui/table";
import BaseDashboardCard from "@/components/BaseDashboardCard";
import { Badge } from "@/components/ui/badge";

interface TrainingScoresTableProps {
  scores: any[];
  onScoreClick: (score: any) => void;
}

export default function TrainingScoresTable({ scores, onScoreClick }: TrainingScoresTableProps) {
  return (
    <BaseDashboardCard header="Scores" withBtn>
      <div className="rounded-xl overflow-x-auto">
        <Table className="w-full min-w-[800px] border-separate border-spacing-0">
          <TableHeader>
            <TableRow className="border-b border-white/10 text-xs font-medium uppercase tracking-wider text-gray-400">
              <TableCell
                isHeader
                className="text-left py-3 sm:text-sm md:text-base px-3 md:py-4 md:px-6 font-semibold text-gray-300 whitespace-nowrap"
              >
                Assignment
              </TableCell>
              <TableCell
                isHeader
                className="text-left py-3 sm:text-sm md:text-base px-3 md:py-4 md:px-6 font-semibold text-gray-300 whitespace-nowrap"
              >
                Participant
              </TableCell>
              <TableCell
                isHeader
                className="text-left py-3 sm:text-sm md:text-base px-3 md:py-4 md:px-6 font-semibold text-gray-300 whitespace-nowrap"
              >
                Squad
              </TableCell>
              <TableCell
                isHeader
                className="text-left py-3 sm:text-sm md:text-base px-3 md:py-4 md:px-6 font-semibold text-gray-300 whitespace-nowrap"
              >
                Position
              </TableCell>
              <TableCell
                isHeader
                className="text-left py-3 sm:text-sm md:text-base px-3 md:py-4 md:px-6 font-semibold text-gray-300 whitespace-nowrap"
              >
                Day/Night
              </TableCell>
              <TableCell
                isHeader
                className="text-left py-3 sm:text-sm md:text-base px-3 md:py-4 md:px-6 font-semibold text-gray-300 whitespace-nowrap"
              >
                Target Eliminated
              </TableCell>
              <TableCell
                isHeader
                className="text-left py-3 sm:text-sm md:text-base px-3 md:py-4 md:px-6 font-semibold text-gray-300 whitespace-nowrap"
              >
                Time to Shot
              </TableCell>
              <TableCell
                isHeader
                className="text-left py-3 sm:text-sm md:text-base px-3 md:py-4 md:px-6 font-semibold text-gray-300 whitespace-nowrap"
              >
                Date
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scores.map((score: any) => (
              <TableRow
                key={score.id}
                onClick={() => onScoreClick(score)}
                className="border-b border-gray-700/30 hover:bg-gray-800/40 transition-colors cursor-pointer"
              >
                <TableCell className="py-3 px-3 md:py-4 md:px-6 text-sm md:text-sm text-gray-100 whitespace-nowrap">
                  <div className="max-w-[120px] md:max-w-none truncate">{score.assignment_session?.assignment?.assignment_name || "N/A"}</div>
                </TableCell>
                <TableCell className="py-3 px-3 md:py-4 md:px-6 text-sm md:text-sm text-gray-100 whitespace-nowrap">
                  <div className="max-w-[100px] md:max-w-none truncate">
                    {score.score_participants?.[0]?.user
                      ? `${score.score_participants[0].user.first_name} ${score.score_participants[0].user.last_name}`
                      : "N/A"}
                  </div>
                </TableCell>
                <TableCell className="py-3 px-3 md:py-4 md:px-6 text-sm md:text-sm text-gray-100 whitespace-nowrap">
                  <div className="max-w-[80px] md:max-w-none truncate">{score.score_participants?.[0]?.user?.squad?.squad_name || "N/A"}</div>
                </TableCell>
                <TableCell className="py-3 px-3 md:py-4 md:px-6 text-sm md:text-sm text-gray-100 capitalize whitespace-nowrap">
                  {score.position || "N/A"}
                </TableCell>
                <TableCell className="py-3 px-3 md:py-4 md:px-6 text-sm md:text-sm text-gray-100 capitalize whitespace-nowrap">
                  {score.day_night || "N/A"}
                </TableCell>
                <TableCell className="py-3 px-3 md:py-4 md:px-6 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${
                      score.target_eliminated ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {score.target_eliminated ? "Yes" : <Badge variant="secondary">No</Badge>}
                  </span>
                </TableCell>
                <TableCell className="py-3 px-3 md:py-4 md:px-6 text-sm md:text-sm text-gray-100 whitespace-nowrap">
                  {score.time_until_first_shot ? `${score.time_until_first_shot}s` : "N/A"}
                </TableCell>
                <TableCell className="py-3 px-3 md:py-4 md:px-6 text-sm md:text-sm text-gray-100 whitespace-nowrap">
                  {format(parseISO(score.created_at), "dd MMM yyyy")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </BaseDashboardCard>
  );
}
