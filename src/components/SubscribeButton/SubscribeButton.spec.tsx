import { render, screen, fireEvent } from "@testing-library/react";
import { SubscribeButton } from ".";
import { mocked } from 'jest-mock'
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from "next/router";


jest.mock("next-auth/react");

jest.mock("next/router");

describe("SubscribeButton component", () => {
  it("renders correctly", () => {

    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "loading"
    });

    render(
      <SubscribeButton />
    );

    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
  });


  it("redirects user to sign in when not authenticate", () => {
    
    const useSessionMocked = mocked(useSession);
    const signInMocked = mocked(signIn);
    
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "loading"
    });

    
    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it("redirects to posts when user already has a subscription", () => {
    
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);
    
    const pushMock = jest.fn();
    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: "John Doe",
        },
        activeSubscription: true,
        expires: "fake-expires"
      },
      status: "loading"
    } as any);

    useRouterMocked.mockImplementationOnce(() => ({ push: pushMock } as any));

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalledWith("/posts");
  });
});

