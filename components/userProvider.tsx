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
  refetchUser: () => Promise<void>;
}>({
  refetchUser: () => Promise.resolve(),
});

export default function UserProvider({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  const { push } = useRouter();
  const { user: auth0User } = useUser();
  const [user, setUser] = useState<User | undefined>(undefined);
  const fetchUser = async () => {
    try {
      const response = await fetch("/api/v1/users/me");
      if (response.ok) {
        const fetchedUser = await response.json();
        return setUser(fetchedUser);
      }
      if (response.status !== 401) {
        throw new Error(response.statusText);
      }
      // User hasn't been created yet
      push("/signup");
    } catch (err) {
      console.error("Unable to fetch user");
    }
  };
  useEffect(() => {
    if (!auth0User) {
      return;
    }
    fetchUser();
  }, [auth0User]);

  return (
    <UserContext.Provider value={{ user, refetchUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}
