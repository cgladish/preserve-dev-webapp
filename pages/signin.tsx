import { Button, Card } from "@mui/material";
import { GetServerSideProps } from "next";
import { signIn, getCsrfToken, getProviders } from "next-auth/react";
import Image from "next/image";

export default function Signin({
  providers,
}: {
  providers: Awaited<ReturnType<typeof getProviders>>;
}) {
  const googleProvider = Object.values(providers).find(
    ({ name }) => name === "Google"
  );
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <a href="/">
        <img src="/logo-darkmode.svg" height={70} alt="App Logo" />
      </a>
      <Card
        style={{
          marginTop: 20,
          width: 250,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "20px",
          paddingBottom: "20px",
        }}
      >
        {googleProvider && (
          <button
            onClick={() => signIn(googleProvider.id)}
            style={{ all: "initial", cursor: "pointer" }}
          >
            <img src={"/signin-buttons/google.png"} width={200} />
          </button>
        )}
      </Card>
      <div style={{ height: 100 }} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
};
