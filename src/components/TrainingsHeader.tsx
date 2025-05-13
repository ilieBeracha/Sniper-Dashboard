import { IsMobile } from "@/utils/isMobile";
import { Button } from "./common";

export default function TrainingsHeader({
  setIsOpen,
  kanbanView,
  setKanbanView,
}: {
  setIsOpen: (open: boolean) => void;
  kanbanView: boolean;
  setKanbanView: (view: boolean) => void;
}) {
  return (
    <div className=" mb-2 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <div className="flex space-x-4 w-full justify-between items-center">
        <Button onClick={() => setIsOpen(true)}>Create Training</Button>
      </div>
      {IsMobile ? (
        <></>
      ) : (
        <div className="flex items-center gap-2">
          <Button onClick={() => setKanbanView(false)} variant={!kanbanView ? "primary" : "secondary"} size="sm">
            List
          </Button>
          <Button onClick={() => setKanbanView(true)} variant={kanbanView ? "primary" : "secondary"} size="sm">
            Board
          </Button>
        </div>
      )}
    </div>
  );
}
