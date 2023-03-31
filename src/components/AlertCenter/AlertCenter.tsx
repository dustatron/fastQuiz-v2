import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  Stack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { create } from "zustand";
type Status = "info" | "warning" | "success" | "error" | "loading" | undefined;
type State = {
  hasAlert: boolean;
  message?: string;
  status?: Status;
};
type Action = {
  addError: (message: string) => void;
  addSuccess: (message: string) => void;
  clearError: () => void;
};
export const useAlertStore = create<State & Action>((set) => ({
  hasAlert: false,
  message: "test",
  status: undefined,
  addError: (message: string) =>
    set({ hasAlert: true, message: message, status: "error" }),
  clearError: () => set({ hasAlert: false, message: "", status: undefined }),
  addSuccess: (message: string) =>
    set({ hasAlert: true, message, status: "success" }),
}));

export default function AlertCenter() {
  const { hasAlert, message, clearError } = useAlertStore((state) => ({
    hasAlert: state.hasAlert,
    message: state.message,
    status: state.status,
    clearError: state.clearError,
  }));
  useEffect(() => {
    if (hasAlert) {
      setTimeout(() => {
        clearError();
      }, 5000);
    }
  }, [clearError, hasAlert]);
  if (hasAlert) {
    return (
      <Stack p="2">
        <Alert status={status === "error" ? "error" : "success"}>
          <Stack justifyContent="space-between" direction="row" w="100%">
            <Stack direction="row">
              <AlertIcon />
              <Stack direction="row">
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Stack>
            </Stack>
            <Box>
              <CloseButton
                alignSelf="flex-start"
                position="relative"
                right={-1}
                top={-1}
                onClick={clearError}
              />
            </Box>
          </Stack>
        </Alert>
      </Stack>
    );
  } else {
    return null;
  }
}
