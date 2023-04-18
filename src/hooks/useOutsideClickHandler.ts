import React, { useRef, useEffect } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
export default function useOutsideClickHandler(ref: React.RefObject<HTMLElement>, onOutsize: () => void) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsize();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onOutsize]);
}