import Candle from "./components/Candle/Candle";
import { CollisionProvider } from "./contexts/CollisionContext";
import './App.css'


export default function App(){
    return(
        <CollisionProvider>
            <Candle/>
            <Candle/>
        </CollisionProvider>
    )
}