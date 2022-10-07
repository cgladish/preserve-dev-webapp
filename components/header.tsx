import { Button, Menu, MenuItem, Typography } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useContext, useRef, useState } from "react";
import { UserContext } from "../components/userProvider";
import { useTheme } from "@mui/material";

export default function Header() {
  const theme = useTheme();
  const { user, isLoading } = useContext(UserContext);
  const menuAnchorRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 70,
        paddingLeft: 30,
        paddingRight: 20,
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        background: "rgba(20, 20, 20, 0.8)",
        backdropFilter: "blur(5px)",
        zIndex: 1000,
        borderBottom: "1px solid #333",
      }}
    >
      <a href="/">
        <img id="logo" src="/logo-darkmode.svg" height={45} alt="App Logo" />
        <img id="logo-small" src="/favicon.ico" height={45} alt="App Logo" />
      </a>
      {!isLoading &&
        (user ? (
          <>
            <div
              ref={menuAnchorRef}
              style={{
                display: "flex",
                justifyContent: "center",
                marginRight: 20,
                cursor: "pointer",
              }}
              onClick={() => setIsMenuOpen(true)}
            >
              <Typography>{user.displayName}</Typography>
              {isMenuOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </div>
            <Menu
              anchorEl={menuAnchorRef.current}
              open={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <a href={`/u/${user.id}/snippets`} style={{ color: "unset" }}>
                <MenuItem>Your Snippets</MenuItem>
              </a>
              <a href="/api/auth/logout" style={{ color: "unset" }}>
                <MenuItem>Sign out</MenuItem>
              </a>
            </Menu>
          </>
        ) : (
          <div>
            <a href="/api/auth/login">
              <Button variant="text">Sign in</Button>
            </a>
          </div>
        ))}
    </div>
  );
}
