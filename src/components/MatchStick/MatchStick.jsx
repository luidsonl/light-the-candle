import Flame from "../Flame/Flame";
import { MatchStickHead } from "../MathStickHead/MatchStickHead";
import './MatchStick.css'
import React, { useState, useEffect, useRef } from "react";
import { useCollision } from "../../contexts/CollisionContext";
import { useRender } from "../../contexts/RenderContext";


export default function MatchStick({initialPosition = { x: 100, y: 100 }}){

    const [lit, setLit] = useState(false);
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isReady, setIsReady] = useState(false);
    const [id, setId] = useState(null);
    const elementRef = useRef(null);
    
    const { isColliding, getIdsByType } = useCollision();
    const { createObject } = useRender();

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
            const newPosition = ({ x: e.clientX - offset.x, y: e.clientY - offset.y });
            setPosition(newPosition);
            if (Math.sqrt(((position.x - newPosition.x)**2) + ((position.y - newPosition.y)**2)) > 200){
                setLit((prev)=>!prev);
            }
        };
    
        const handleMouseUp = () => setIsDragging(false);
    
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    
        return () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };
      }, [isDragging, offset]);

    return(
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
    )
}