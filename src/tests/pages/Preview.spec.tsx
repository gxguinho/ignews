import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Preview, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismic";

jest.mock("next-auth/react");
jest.mock("../../services/prismic.ts");
jest.mock("next/router");

const posts = {
  slug: 'my-new-post',
  title: 'My new Post',
  content: '<p>Post excerpt</p>',
  updatedAt: '10 de Abril'
}


describe("Preview page", () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "loading"
    });

    render(<Preview post={posts} />);

    expect(screen.getByText("My new Post")).toBeInTheDocument();
    expect(screen.getByText("Post excerpt")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it('redirects user to full post when user is subscribed', async () => {

    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: true,
        expires: "fake-expires"
      },
      status: "loading"
    } as any);

    useRouterMocked.mockImplementationOnce(() => ({ push: pushMock } as any));

    render(<Preview post={posts} />);

    expect(pushMock).toHaveBeenCalledWith("/posts/my-new-post");

  });

  it('loads initial data', async () => {

    const getPrismicClientMocked = mocked(getPrismicClient);
   
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{
            type: "heading", text: "My new Post"
          }],
          content: [{
            type: "paragraph", text: "Post excerpt"
          }],
        },
        last_publication_date: "04-01-2021"
      })
    } as any);

    const response = await getStaticProps({ params: { slug: "my-new-post" } } as any);
    
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new Post',
            content: '<p>Post excerpt</p>',
            updatedAt: '01 de abril de 2021'
          }
        }
      })
    )

  });
}); 
