import { Button } from "@mui/material";
import { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";

export default function Header() {
  useEffect(() => {
    (async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ping`);
    })();
  });
  const { user, error, isLoading } = useUser();
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
      {user ? (
        <div>
          {user.email}
          <a href="/api/auth/logout">
            <Button variant="contained">Sign out</Button>
          </a>
        </div>
      ) : (
        <div>
          <a href="/api/auth/login">
            <Button variant="contained">Sign in</Button>
          </a>
        </div>
      )}
    </div>
  );
}
