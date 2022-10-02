import { NextPage } from "next";

const Error404: NextPage = () => {
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
      <h1 style={{ marginBottom: 20 }}>404</h1>
      <p>Content not found</p>
    </div>
  );
};

export default Error404;
