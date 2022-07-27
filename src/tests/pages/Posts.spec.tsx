import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import Posts, { getStaticProps, Post } from "../../pages/posts";
import { getPrismicClient } from "../../services/prismic";

jest.mock("../../services/prismic.ts");

const posts = [
  {
    slug: 'my-new-post',
    title: 'My new Post',
    excerpt: 'Post excerpt',
    updatedAt: '10 de Abril'
  }
] as Post[]

describe("Posts page", () => {
  it("renders correctly", () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText("My new Post")).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: "my-new-post",
            data: {
              title: [{
                type: "heading", text: "My new Post"
              }],
              content: [{
                type: "paragraph", text: "Post excerpt"
              }]
            },
            last_publication_date: "10-01-2021"
          }
        ]
      })
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'my-new-post',
            title: 'My new Post',
            excerpt: 'Post excerpt',
            updatedAt: '01 de outubro de 2021'
          }]
        }
      })
    )

  });
}); 
