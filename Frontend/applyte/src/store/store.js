import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAuthSlice } from "./userSlice";

export const Store = create(
    persist(
        (...a) => ({
            ...createAuthSlice(...a)
        }),
        {name: "auth-storage"}
    )
)