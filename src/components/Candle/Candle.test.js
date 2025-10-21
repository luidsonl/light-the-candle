import { render, waitFor } from "@testing-library/react";
import Candle from "./Candle";
import { CollisionProvider } from "../../contexts/CollisionContext";
import { RenderProvider } from "../../contexts/RenderContext";

test("encontra elemento por classe", async () => {
  const { container } = render(
    <RenderProvider>
      <CollisionProvider>
        <Candle />
      </CollisionProvider>
    </RenderProvider>
    
  );
  
  await waitFor(() => {
    const wick = container.querySelector(".wick");
    expect(wick).toBeInTheDocument();
  });
});