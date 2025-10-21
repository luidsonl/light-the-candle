import { createContext, useState, useContext } from "react";

const CollisionContext = createContext();

export function CollisionProvider({ children }) {


  return (
    <CollisionContext.Provider >
      {children}
    </CollisionContext.Provider>
  );
}

export const useCollision = () => useContext(CollisionContext);
