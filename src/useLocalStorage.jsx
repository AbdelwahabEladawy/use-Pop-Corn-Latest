import { useEffect, useState } from "react";

import React from "react";

export default function useLocalStorage(initialState, key) {
  const [value, setValue] = useState(function () {
    const stored = localStorage.getItem(key);

    return stored ? JSON.parse(stored) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);
  return [value, setValue];
}

// export default function useLocalStorage(initialState, key) {
//   const [value, setValue] = useState(function () {
//     const stored = localStorage.getItem(key);
//     return stored ? JSON.parse(stored) : initialState;
//   });
//   useEffect(() => {
//     localStorage.setItem(key, JSON.stringify(value));
//   }, [value, key]);
//   return [value, setValue];
// }
