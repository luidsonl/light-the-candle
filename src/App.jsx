import Candle from "./components/Candle/Candle";
import { CollisionProvider } from "./contexts/CollisionContext";
import './App.css'
import { RenderProvider } from "./contexts/RenderContext";
import MatchStick from "./components/MatchStick/MatchStick";


export default function App(){
    return(
        <RenderProvider>
            <CollisionProvider>
                <Candle  initialPosition={{x: 300, y:100}}/>
                <Candle/>

                <MatchStick initialPosition={{x: 100, y: 500}}/>
            </CollisionProvider>
        </RenderProvider>
    )
}