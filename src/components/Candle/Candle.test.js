import { render, waitFor } from "@testing-library/react";
import Candle from "./Candle";
import { CollisionProvider } from "../../contexts/CollisionContext";

test("encontra elemento por classe", async () => {
  const { container } = render(
    <CollisionProvider>
      <Candle />
    </CollisionProvider>
  );
  
  await waitFor(() => {
    const wick = container.querySelector(".wick");
    expect(wick).toBeInTheDocument();
  });
});