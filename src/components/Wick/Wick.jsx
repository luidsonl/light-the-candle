import './Wick.css';
import { useState, useEffect, useRef } from 'react';
import { useCollision } from "../../contexts/CollisionContext";
import { useRender } from "../../contexts/RenderContext";

export default function Wick({setLit}){

    const [isReady, setIsReady] = useState(false);
    const [id, setId] = useState()
    const elementRef = useRef(null);

    const { isColliding } = useCollision();
    const { createObject, getIdsByType } = useRender();

    useEffect(() => {
    if (elementRef) {
        createObject(elementRef,{'setLit': setLit}).then((newId) => {
        setId(newId);
        setIsReady(true);
        });
    }
    }, []);

    return (
        <div 
            className="wick"
            data-object-type="wick"
            ref={elementRef}    
        ></div>
    );
}