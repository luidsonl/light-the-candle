import React, { useEffect, useState } from "react";
import Flame from "../Flame/Flame";
import './Candle.css';

export default function Candle() {

  const[inclination, setInclination] = useState(0);
  const[lit, setLit] = useState(false);

  return (
    <div className="candle">
      <div className="wick-box">
        {lit?(
          <Flame/>
        ): (
          <div className="wick"></div>
        )}
        
        
      </div>
      <div className="candle-body">

      </div>
    </div>
  );
}
