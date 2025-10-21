import { createContext, useCallback, useContext } from "react";
import { useRender } from "./RenderContext";

const CollisionContext = createContext();

export function CollisionProvider({ children }) {
  const { getAllObjects } = useRender();

  const isColliding = useCallback((objId, targetIds) => {
    const objects = getAllObjects();
    const obj = objects[objId];
    
    if (!obj) {
      console.warn(`Object with id ${objId} not found`);
      return [];
    }

    const objRect = obj.getRect();
    if (!objRect) {
      console.warn(`Object with id ${objId} has no rect`);
      return [];
    }

    const collisions = [];

    for (const targetId of targetIds) {
      const target = objects[targetId];
      if (!target || targetId === objId) continue;

      const targetRect = target.getRect();
      if (!targetRect) continue;

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
  }, [getAllObjects]);

  const isCollidingWithAny = useCallback((objId, targetType) => {
    const objects = getAllObjects();
    const obj = objects[objId];
    if (!obj) return false;

    const objRect = obj.getRect();
    if (!objRect) return false;

    for (const [targetId, target] of Object.entries(objects)) {
      if (targetId === objId.toString()) continue;
      
      if (!targetType || target.getType() === targetType) {
        const targetRect = target.getRect();
        if (!targetRect) continue;

        const colliding = !(
          objRect.right < targetRect.left ||
          objRect.left > targetRect.right ||
          objRect.bottom < targetRect.top ||
          objRect.top > targetRect.bottom
        );

        if (colliding) return true;
      }
    }

    return false;
  }, [getAllObjects]);

  const isPointColliding = useCallback((point, targetIds) => {
    const objects = getAllObjects();
    const collisions = [];

    for (const targetId of targetIds) {
      const target = objects[targetId];
      if (!target) continue;

      const targetRect = target.getRect();
      if (!targetRect) continue;

      const isColliding = (
        point.x >= targetRect.left &&
        point.x <= targetRect.right &&
        point.y >= targetRect.top &&
        point.y <= targetRect.bottom
      );

      if (isColliding) {
        collisions.push(targetId);
      }
    }

    return collisions;
  }, [getAllObjects]);

  const findCollisions = useCallback((objId) => {
    const objects = getAllObjects();
    const obj = objects[objId];
    if (!obj) return [];

    const objRect = obj.getRect();
    if (!objRect) return [];

    const collisions = [];

    for (const [targetId, target] of Object.entries(objects)) {
      if (targetId === objId.toString()) continue;

      const targetRect = target.getRect();
      if (!targetRect) continue;

      const isColliding = !(
        objRect.right < targetRect.left ||
        objRect.left > targetRect.right ||
        objRect.bottom < targetRect.top ||
        objRect.top > targetRect.bottom
      );

      if (isColliding) {
        collisions.push({
          id: parseInt(targetId),
          object: target,
          type: target.getType()
        });
      }
    }

    return collisions;
  }, [getAllObjects]);

  return (
    <CollisionContext.Provider value={{ 
      isColliding,
      isCollidingWithAny,
      isPointColliding,
      findCollisions
    }}>
      {children}
    </CollisionContext.Provider>
  );
}

export const useCollision = () => {
  const context = useContext(CollisionContext);
  if (!context) {
    throw new Error("useCollision must be used within a CollisionProvider");
  }
  return context;
};