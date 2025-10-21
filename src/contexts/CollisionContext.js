import { createContext, useState, useContext, useCallback } from "react";
import ObjectAbstraction from "../utils/ObjectAbstraction";

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
            [newId]: new ObjectAbstraction(obj),
          };
          queueMicrotask(() => resolve(newId));
          
          return updatedObjects;
        });
        
        return prev + 1;
      });
    });
  }, []);

  const getById = (id)=>{
    return objects[id];
  }

  const deleteObject = useCallback((id) => {
    setObjects((prevObjects) => {
      const { [id]: _, ...rest } = prevObjects;
      return rest;
    });
  }, []);

  const isColliding = useCallback((objId, targetIds) => {
    console.log(objId);
    console.log(targetIds);

    const obj = objects[objId];
    if (!obj) return [];

    const objRect = obj.getRect();
    const collisions = [];

    for (const targetId of targetIds) {
      const target = objects[targetId];
      if (!target || targetId === objId) continue;

      const targetRect = target.getRect();

      const isColliding = !(
        objRect.right < targetRect.left ||
        objRect.left > targetRect.right ||
        objRect.bottom < targetRect.top ||
        objRect.top > targetRect.bottom
      );

      if (isColliding) {
        collisions.push(targetId);
      }
    }

    return collisions;
  }, [objects]);

  const getIdsByType = useCallback((type) => {
    return Object.entries(objects)
      .filter(([_, obj]) => obj.getType() === type)
      .map(([id]) => parseInt(id));
  }, [objects]);



  return (
    <CollisionContext.Provider value={{ objects, createObject, deleteObject, getById, isColliding, getIdsByType }}>
      {children}
    </CollisionContext.Provider>
  );
}

export const useCollision = () => useContext(CollisionContext);