import React, { useContext } from "react";
import Bucket from "../types/Bucket";

export interface AppState {
  files: File[];
  setFiles: (files: File[]) => void;
  receiverId: string;
  setReceiverId: (id: string) => void;
  buckets: Bucket[];
}

export const AppStateContext = React.createContext<AppState | null>(null);

export const useAppState = () => useContext(AppStateContext) as AppState;
