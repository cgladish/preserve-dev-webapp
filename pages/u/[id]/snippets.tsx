import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Layout from "../../../components/layout";
import { UserContext } from "../../../components/userProvider";
import SnippetsPreview from "../../../components/snippetsPreview";
import { User } from "../../../utils/types";
import { useContext } from "react";

const UserSnippets: NextPage = ({ user }: { user: User }) => {
  const { user: signedInUser, isLoading } = useContext(UserContext);
  return (
    <Layout title={`snippets by ${user.username} - Preserve.dev`} withHeader>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <SnippetsPreview
          title={
            isLoading
              ? ""
              : `${
                  signedInUser?.id === user.id ? "Your" : `${user.username}'s`
                } Snippets`
          }
          creatorId={user.id}
        />
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = await fetch(
    `${process.env.APP_URL}/api/v1/users/${params?.id as string}`
  );
  if (response.status === 404) {
    return { notFound: true };
  } else if (response.status !== 200) {
    throw new Error(response.statusText);
  }
  const user = await response.json();
  return {
    props: {
      user,
    },
  };
};

export default UserSnippets;
