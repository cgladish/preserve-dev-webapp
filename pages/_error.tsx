import { NextPage, NextPageContext } from "next";

interface Props {
  statusCode?: number;
}

const Error: NextPage<Props> = ({ statusCode }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        fontSize: 28,
        color: "#eee",
        background: "#222",
      }}
    >
      {statusCode && <h1 style={{ marginBottom: 20 }}>{statusCode}</h1>}
      <p>
        {statusCode === 404
          ? "Content not found"
          : "An error occured. Please try again later"}
      </p>
    </div>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
