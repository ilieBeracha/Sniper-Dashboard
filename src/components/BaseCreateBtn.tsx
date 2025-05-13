import { PlusCircleIcon } from "lucide-react";
import { Button } from "./common";

export default function BaseCreateBtn({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick} variant="secondary" size="sm" leftIcon={<PlusCircleIcon className="w-4 h-4" />}>
      Create
    </Button>
  );
}
