import { Button } from "./common";

export default function Header({ setIsOpen }: { setIsOpen: (open: boolean) => void }) {
  return (
    <div className="mb-2 w-full">
      <div className="flex space-x-4 w-full justify-between items-center">
        <Button onClick={() => setIsOpen(true)}>Invite</Button>
        <Button disabled>Generate Intel Report</Button>
      </div>
    </div>
  );
}
