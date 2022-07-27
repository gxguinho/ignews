import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { getSession, useSession } from "next-auth/react";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismic";

jest.mock("next-auth/react");
jest.mock("../../services/prismic.ts");

const posts = {
  slug: 'my-new-post',
  title: 'My new Post',
  content: '<p>Post excerpt</p>',
  updatedAt: '10 de Abril'
}


describe("Post page", () => {
  it("renders correctly", () => {
    render(<Post post={posts} />);

    expect(screen.getByText("My new Post")).toBeInTheDocument();
    expect(screen.getByText("Post excerpt")).toBeInTheDocument();
  });

  it('redirects user if no subscription is found', async () => {

    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockReturnValueOnce(null);

    const response = await getServerSideProps({ params: { slug: "my-new-post" } } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/",
        })
      })
    )

  });

  it('loads initial data', async () => {

    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient);

    getSessionMocked.mockReturnValueOnce({
      activeSubscription: "fake-active-subscription"
    } as any);

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

    const response = await getServerSideProps({ params: { slug: "my-new-post" } } as any);

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
