import { useEffect } from "react";

export default function useKey(action, key) {
  useEffect(() => {
    function CallBack(e) {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        action();
      }
    }
    document.addEventListener("keydown", CallBack);
    return function () {
      document.removeEventListener("keydown", CallBack);
    };
  }, [action, key]);
}
