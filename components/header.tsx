import { Button } from "@mui/material";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
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
      <img src="/logo-darkmode.svg" height={45} alt="App Logo" />
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
