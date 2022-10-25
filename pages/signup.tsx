import {
  Card,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Check, Error as ErrorIcon } from "@mui/icons-material";
import { debounce } from "lodash";
import {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { UserContext } from "../components/userProvider";
import { useRouter } from "next/router";

export default function Signup() {
  const { push } = useRouter();
  const { user, refetchUser } = useContext(UserContext);
  useEffect(() => {
    if (user) {
      push("/");
    }
  }, [user]);

  const inputRef = useRef<HTMLInputElement>();
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const [userName, setUserName] = useState<string>("");
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(false);

  const [isValidUserName, setIsValidUserName] = useState<boolean>();

  const [hasDebouncePassed, setHasDebouncedPassed] = useState<boolean>();
  const [hasCheckedUserNameTaken, setHasCheckedUserNameTaken] =
    useState<boolean>(false);
  const [isUserNameAvailable, setisUserNameAvailable] =
    useState<boolean>(false);

  const checkisUserNameAvailable = useCallback(
    debounce(async (userName: string) => {
      setHasDebouncedPassed(true);
      setHasCheckedUserNameTaken(false);
      try {
        const response = await fetch(
          `/api/v1/users/username/${userName.toLowerCase()}`
        );
        if (response.status === 404) {
          setisUserNameAvailable(true);
        } else if (response.status === 200) {
          setisUserNameAvailable(false);
        } else {
          throw new Error(response.statusText);
        }
      } catch (err) {
        console.error("Could not fetch user");
      }
      setHasCheckedUserNameTaken(true);
    }, 500),
    [setHasDebouncedPassed, setHasCheckedUserNameTaken, setisUserNameAvailable]
  );

  const updateUserName = (userName: string) => {
    checkisUserNameAvailable.cancel();
    setUserName(userName);
    setHasDebouncedPassed(false);
    const newIsValidUserName =
      /^[a-zA-Z0-9]+$/.test(userName) &&
      userName.length >= 3 &&
      userName.length <= 20;
    setIsValidUserName(newIsValidUserName);
    if (newIsValidUserName) {
      checkisUserNameAvailable(userName);
    }
  };

  let errorText: string | null = null;
  if (userName) {
    if (!isValidUserName) {
      errorText = "Username must be 3-20 alphanumeric characters.";
    } else if (
      hasDebouncePassed &&
      hasCheckedUserNameTaken &&
      !isUserNameAvailable
    ) {
      errorText = "Username is taken. Please choose another.";
    }
  }

  let inputAdornment: ReactElement | null = null;
  if (isValidUserName) {
    if (!hasDebouncePassed || !hasCheckedUserNameTaken) {
      inputAdornment = <CircularProgress style={{ height: 20, width: 20 }} />;
    } else if (isUserNameAvailable) {
      inputAdornment = <Check color="success" />;
    } else {
      inputAdornment = <ErrorIcon color="error" />;
    }
  }

  const isConfirmDisabled =
    !isValidUserName ||
    !hasDebouncePassed ||
    !hasCheckedUserNameTaken ||
    !isUserNameAvailable ||
    !hasAcceptedTerms;

  const [isSubmitting, setIsSubmitting] = useState<boolean>();
  const onSubmit = async () => {
    if (isConfirmDisabled) {
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/v1/users`, {
        method: "post",
        body: JSON.stringify({ displayName: userName }),
      });
      if (response.status !== 201) {
        throw new Error(response.statusText);
      }
      refetchUser();
    } catch (err) {
      console.error("Could not create user");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <a href="/">
        <img src="/logo-darkmode.png" height={65} alt="App Logo" />
      </a>
      <Card
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 30,
          padding: "20px 30px",
          width: 400,
        }}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <Typography style={{ fontWeight: 700, marginBottom: 10 }}>
            Pick a username.
          </Typography>
          <Typography style={{ marginBottom: 30 }}>
            This will be visible to others, so make it good!
          </Typography>
          <TextField
            inputRef={inputRef}
            label="Username"
            variant="outlined"
            style={{ width: "100%" }}
            value={userName}
            onChange={(event) => updateUserName(event.target.value)}
            InputProps={{
              endAdornment: inputAdornment ? (
                <InputAdornment position="end">{inputAdornment}</InputAdornment>
              ) : undefined,
            }}
            error={!!errorText}
            helperText={errorText ?? " "}
            autoFocus
            required
          />
          <FormControlLabel
            style={{ marginTop: 10 }}
            control={
              <Checkbox
                value={hasAcceptedTerms}
                onChange={(event) => setHasAcceptedTerms(event.target.checked)}
              />
            }
            label={
              <>
                I agree to the{" "}
                <a href="/terms" target="_blank">
                  Terms and Conditions
                </a>
                .
              </>
            }
          />
          <LoadingButton
            type="submit"
            variant="contained"
            style={{ width: "100%", marginTop: 10 }}
            size="large"
            disabled={isConfirmDisabled || isSubmitting}
            loading={isSubmitting}
          >
            Complete Signup
          </LoadingButton>
        </form>
      </Card>
    </div>
  );
}
