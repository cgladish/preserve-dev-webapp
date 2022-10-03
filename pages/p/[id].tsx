import Layout from "../../components/layout";
import { GetStaticPaths, GetStaticProps } from "next";

type Message = {
  id: string;
  content: string;
  sentAt: string;
  appSpecificDataJson: string | null;
  authorUsername: string;
  authorIdentifier: string | null;
  authorAvatarUrl: string | null;
};
type Snippet = {
  id: string;
  public: boolean;
  title: string | null;
  appSpecificDataJson: string | null;
  views: number;
  creatorId: string;
  appId: string;
  messages: Message[];
};

export default function Preservette({ snippet }: { snippet: Snippet }) {
  return (
    <Layout
      title={snippet.title ? `${snippet.title} - Preserve.dev` : "Preserve.dev"}
      withHeader
    >
      {snippet.title}
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = await fetch(
    `${process.env.APP_URL}/api/v1/snippets/${params.id as string}`
  );
  const snippet = await response.json();
  return {
    props: {
      snippet,
    },
  };
};
