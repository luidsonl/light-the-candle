import { createContext, useState, useContext, useCallback } from "react";

const CollisionContext = createContext();

export function CollisionProvider({ children }) {
  const [nextId, setNextId] = useState(1);
  const [objects, setObjects] = useState({});

  const createObject = useCallback((obj) => {
    return new Promise((resolve) => {
      setNextId((prev) => {
        const newId = prev;
        
        setObjects((prevObjects) => {
          const updatedObjects = {
            ...prevObjects,
            [newId]: { ...obj },
          };
          queueMicrotask(() => resolve(newId));
          
          return updatedObjects;
        });
        
        return prev + 1;
      });
    });
  }, []);

  return (
    <CollisionContext.Provider value={{ objects, createObject }}>
      {children}
    </CollisionContext.Provider>
  );
}

export const useCollision = () => useContext(CollisionContext);