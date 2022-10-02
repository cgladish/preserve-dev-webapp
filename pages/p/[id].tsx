import Layout from "../../components/layout";
import utilStyles from "../../styles/utils.module.css";
import { GetStaticPaths, GetStaticProps } from "next";
import axios from "axios";
import path from "path";

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
    >
      howdy
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
  const response = await axios.get<Snippet>(
    `${process.env.API_URL}/snippets/${params.id as string}`
  );
  return {
    props: {
      snippet: response.data,
    },
  };
};
