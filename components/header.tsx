import { Button, Menu, MenuItem, Typography } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useContext, useRef, useState } from "react";
import { UserContext } from "../components/userProvider";

export default function Header() {
  const { user } = useContext(UserContext);
  const menuAnchorRef = useRef<HTMLDivElement>();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
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
      )}
    </div>
  );
}
