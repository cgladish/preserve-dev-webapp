import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Layout from "../../../components/layout";
import { UserContext } from "../../../components/userProvider";
import SnippetsPreview from "../../../components/snippetsPreview";
import { User } from "../../../utils/types";
import { useContext } from "react";
import { Typography } from "@mui/material";

const UserSnippets: NextPage = ({ user }: { user: User }) => {
  return (
    <Layout title={`snippets by ${user.username}`} withHeader>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <div className="recent-snippets" style={{ marginTop: 20 }}>
          <Typography variant="h4" style={{ fontWeight: 700 }}>
            {user?.displayName}
          </Typography>
        </div>
        <SnippetsPreview title="Created Snippets" creatorId={user.id} />
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
    `${process.env.API_URL}/users/${params?.id as string}`
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
