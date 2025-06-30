import { useCallback, useState } from "react";

export function useModal(initialState: boolean = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const toggleIsOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    setIsOpen,
    toggleIsOpen,
  };
}
