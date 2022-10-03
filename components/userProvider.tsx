import { useUser } from "@auth0/nextjs-auth0";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";

export type User = {
  id: string;
  username: string;
  displayName: string;
};
export const UserContext = createContext<{
  user?: User;
  isLoading: boolean;
  refetchUser: () => Promise<void>;
}>({
  isLoading: true,
  refetchUser: () => Promise.resolve(),
});

export default function UserProvider({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  const { push } = useRouter();
  const { user: auth0User, isLoading: isLoadingAuth0User } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | undefined>(undefined);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/users/me");
      if (response.ok) {
        const fetchedUser = await response.json();
        setUser(fetchedUser);
      } else if (response.status === 401) {
        // User hasn't been created yet
        push("/signup");
      } else {
        throw new Error(response.statusText);
      }
    } catch (err) {
      console.error("Unable to fetch user");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (auth0User) {
      fetchUser();
    } else if (!isLoadingAuth0User) {
      setIsLoading(false);
    }
  }, [auth0User, isLoadingAuth0User]);

  return (
    <UserContext.Provider value={{ user, isLoading, refetchUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}
