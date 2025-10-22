import React, { useState, useEffect } from 'react';

import './Flame.css';  

export default function Flame({flameSize= 3}){


  return (
    <div
      className="flame"
      style={{
        '--flame-size': flameSize * 0.1,
      }}
    >
        
      <div className="flame-glow">
        <div className="flame-inner"></div>
      </div>
    </div>
  );
};