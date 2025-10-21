import React, { useState, useEffect, useRef } from "react";
import { useCollision } from "../../contexts/CollisionContext";

export default function DraggableObject({ children, initialPosition = { x: 100, y: 100 }, objectType }) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);
  const [id, setId] = useState(null);
  const elementRef = useRef(null);
  const {createObject, objects} = useCollision()

  const handleMouseDown = (e) => {
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
    setIsDragging(true);
  };

  useEffect(() => {
    if (elementRef) {
      createObject(elementRef).then((newId) => {
        setId(newId);
        setIsReady(true);
      });
    }
  }, []);

  useEffect(() => {
    if (!isDragging || !isReady) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    console.log(objects);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, offset]);

  return (
    <div
      data-object-type={objectType ?? 'DraggableObject'}
      ref={elementRef}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
    >
      <>
      {id}
      {React.Children.only(children)}
      </>
      
    </div>
  );
}
