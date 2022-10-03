import { Button } from "@mui/material";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Header() {
  const { data: session } = useSession();
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/v1/ping`);
    })();
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 60,
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: "space-between",
      }}
    >
      <a href="/">
        <img src="/logo-darkmode.svg" height={45} alt="App Logo" />
      </a>
      {session ? (
        <div>
          {session.user.email}
          <Button variant="contained" onClick={() => signOut()}>
            Sign out
          </Button>
        </div>
      ) : (
        <div>
          <Button variant="contained" onClick={() => signIn()}>
            Sign in
          </Button>
        </div>
      )}
    </div>
  );
}
