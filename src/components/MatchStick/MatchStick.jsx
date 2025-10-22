import Flame from "../Flame/Flame";
import { MatchStickHead } from "../MathStickHead/MatchStickHead";
import "./MatchStick.css";
import React, { useState, useEffect, useRef } from "react";
import { useCollision } from "../../contexts/CollisionContext";
import { useRender } from "../../contexts/RenderContext";

export default function MatchStick({ initialPosition = { x: 100, y: 100 } }) {
  const [lit, setLit] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);
  const [id, setId] = useState(null);
  const elementRef = useRef(null);

  const { isColliding, getIdsByType } = useCollision();
  const { createObject } = useRender();

  const lastPos = useRef(initialPosition);
  const lastTime = useRef(performance.now());
  const lastToggle = useRef(0);

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
      const now = performance.now();
      const newPosition = {
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      };

      const dx = newPosition.x - lastPos.current.x;
      const dy = newPosition.y - lastPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const deltaTime = now - lastTime.current;

      const speed = (distance / deltaTime) * 1000;
      const timeSinceLastToggle = now - lastToggle.current;

      if (speed > 2000 && timeSinceLastToggle > 500) {
        setLit((prev) => !prev);
        lastToggle.current = now;
      }

      lastPos.current = newPosition;
      lastTime.current = now;

      setPosition(newPosition);
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, offset, isReady]);

  return (
    <div
      data-object-type="matchstick"
      ref={elementRef}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
      className="matchstick"
    >
      <div className="wick-box">{lit ? <Flame /> : <MatchStickHead />}</div>
      <div className="matchstick-body"></div>
    </div>
  );
}
