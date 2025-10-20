import { render } from "@testing-library/react";
import Candle from "./Candle";

test("encontra elemento por classe", () => {
  const { container } = render(<Candle />);
  const wick = container.querySelector(".wick");
  expect(wick).toBeInTheDocument();
});