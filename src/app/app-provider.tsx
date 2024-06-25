"use client"
import { clientSessionToken } from "@/lib/https"
import { AccountType } from "@/schemaValidations/account.schema"
import { createContext, useContext, useState } from "react"
import React from "react"

const AppContext = createContext<{
  user: AccountType | null;
  setUser: React.Dispatch<React.SetStateAction<AccountType | null>>;
}>({
  user: null,
  setUser: () => null,
});

export const useAppContext = () => useContext(AppContext);
export default function SetSeesionToken({
  children,
  initialSessionToken = "",
  user : userProps = null,
}: {
  children: React.ReactNode,
  initialSessionToken?: string,
  user: AccountType | null,
}) {
  const [user, setUser] = useState<AccountType | null>(userProps)
  useState(() => {
    if (typeof window !== "undefined") {
      clientSessionToken.value = initialSessionToken
    }
  })
  return <AppContext.Provider value={{ user, setUser }}>{children}</AppContext.Provider>
}
