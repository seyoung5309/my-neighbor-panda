/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState } from "react";

const PandaContext = createContext();

export function PandaProvider({ children }) {
  const [colors, setColors] = useState({
    b: "#040000", // 검은 부분
    w: "#FDF8F0", // 피부
    g: "#7C7C7C", // 눈동자
  });

  return (
    <PandaContext.Provider value={{ colors, setColors }}>
      {children}
    </PandaContext.Provider>  
  );
}

export function usePanda() {
  return useContext(PandaContext);
}