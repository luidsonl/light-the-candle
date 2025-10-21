import React, { useState } from "react";
import Flame from "../Flame/Flame";
import DraggableObject from "../DraggableObject/DraggableObject";
import './Candle.css';
import Wick from "../Wick/Wick";

export default function Candle({id}) {
  const [lit, setLit] = useState(false);

  return (
    <DraggableObject id={id}>
      <div className="candle">
        <div className="wick-box">{lit ? <Flame /> : <Wick/>}</div>
        <div className="candle-body"></div>
      </div>
    </DraggableObject>
  );
}
