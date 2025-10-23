import React, { useState, useEffect, useRef } from "react";
import { useCollision } from "../../contexts/CollisionContext";
import { useRender } from "../../contexts/RenderContext";
import Flame from "../Flame/Flame";
import Wick from "../Wick/Wick";
import './Candle.css';

export default function Candle({ initialPosition = { x: 100, y: 100 } }) {
  const [lit, setLit] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);
  const [id, setId] = useState(null);
  const elementRef = useRef(null);
  
  const { isColliding } = useCollision();
  const { createObject, getIdsByType } = useRender();

  const lastPos = useRef(initialPosition);
  const lastTime = useRef(performance.now());
  const lastToggle = useRef(0);

  const allwaysLight = new URLSearchParams(window.location.search).has('light');

  console.log(allwaysLight);

  const handleMouseDown = (e) => {
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
    setIsDragging(true);
  };

  useEffect(() => {
    if (elementRef) {
      createObject(elementRef,{'setLit': setLit}).then((newId) => {
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
        setLit(false);
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
  }, [isDragging, offset]);

  return (
    <div
      data-object-type="candle"
      ref={elementRef}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
      className="candle"
    >
      <div className="wick-box">{(lit || allwaysLight) && <Flame />} <Wick setLit={setLit} /></div>
      <div className="candle-body"></div>
    </div>
  );
}