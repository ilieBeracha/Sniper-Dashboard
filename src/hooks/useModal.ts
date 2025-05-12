import { useCallback, useState } from "react";

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    setIsOpen,
    toggleIsOpen,
  };
}
