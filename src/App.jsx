import Candle from "./components/Candle/Candle";
import { CollisionProvider } from "./contexts/CollisionContext";
import './App.css'
import { RenderProvider } from "./contexts/RenderContext";


export default function App(){
    return(
        <RenderProvider>
            <CollisionProvider>
                <Candle/>
                <Candle/>
            </CollisionProvider>
        </RenderProvider>
    )
}