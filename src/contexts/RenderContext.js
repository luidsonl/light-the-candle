import { createContext, useState, useCallback, useContext } from "react";
import ObjectAbstraction from "../objects/ObjectAbstraction";

const RenderContext = createContext();

export function RenderProvider({ children }) {
  const [nextId, setNextId] = useState(1);
  const [objects, setObjects] = useState({});

  const createObject = useCallback((obj) => {
    return new Promise((resolve) => {
      setNextId((prev) => {
        const newId = prev;
        
        setObjects((prevObjects) => {
          const updatedObjects = {
            ...prevObjects,
            [newId]: new ObjectAbstraction(obj),
          };
          queueMicrotask(() => resolve(newId));
          
          return updatedObjects;
        });
        
        return prev + 1;
      });
    });
  }, []);

  const getById = useCallback((id) => {
    return objects[id];
  }, [objects]);

  const deleteObject = useCallback((id) => {
    setObjects((prevObjects) => {
      const { [id]: _, ...rest } = prevObjects;
      return rest;
    });
  }, []);

  const getAllObjects = useCallback(() => {
    return objects;
  }, [objects]);

  const getIdsByType = useCallback((type) => {
    return Object.entries(objects)
      .filter(([_, obj]) => obj.getType() === type)
      .map(([id]) => parseInt(id));
  }, [objects]);

  const updateObject = useCallback((id, updates) => {
    setObjects((prevObjects) => {
      const existingObj = prevObjects[id];
      if (!existingObj) return prevObjects;

      return {
        ...prevObjects,
        [id]: {
          ...existingObj,
          ...updates
        }
      };
    });
  }, []);

  const clearAllObjects = useCallback(() => {
    setObjects({});
    setNextId(1);
  }, []);

  return (
    <RenderContext.Provider value={{ 
      objects, 
      createObject, 
      deleteObject, 
      getById, 
      getAllObjects,
      getIdsByType,
      updateObject,
      clearAllObjects,
      objectCount: Object.keys(objects).length
    }}>
      {children}
    </RenderContext.Provider>
  );
}

export const useRender = () => {
  const context = useContext(RenderContext);
  if (!context) {
    throw new Error("useRender must be used within a RenderProvider");
  }
  return context;
};