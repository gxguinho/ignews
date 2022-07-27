import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import Home, { getStaticProps } from "../../pages";
import { stripe } from "../../services/stripe";


jest.mock("next/router");
jest.mock("next-auth/react", () => {
  return {
    useSession: () => [null, false]
  }
});
jest.mock("../../services/stripe.ts");

describe("Home page", () => {
  it("renders correctly", () => {
    render(<Home product={{ id: "fake-price-id", amount: "R$10,00" }} />);


    expect(screen.getByText("for R$10,00 month")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const retriveStripePrincesMocked = mocked(stripe.prices.retrieve);


    retriveStripePrincesMocked.mockResolvedValueOnce({
      id: "fake-price-id",
      unit_amount: 1000
    } as any)

    const response = await getStaticProps({});
    
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            princeId: "fake-price-id",
            amount: "$10.00"
          }
        }
      })
    );
  });

}); 
