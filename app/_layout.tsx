import "react-native-get-random-values";
import "../global.css";
import { Stack } from "expo-router";
import React, { useEffect, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "../hooks/useTheme";
import { AuthProvider } from "../hooks/useAuth";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "green" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "400",
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
};

function AppContent() {
  const { isDark } = useTheme();
  const backgroundColor = isDark ? "#121212" : "#FFFFFF";

  const onLayoutRootView = useCallback(async () => {
    // This tells the splash screen to hide immediately
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  return (
    <>
      <StatusBar
        style={isDark ? "light" : "dark"}
        backgroundColor={backgroundColor}
        translucent={Platform.OS === "android"}
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="privacy-policy" />
        <Stack.Screen name="contact-us" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen name="change-password" />
      </Stack>
      <Toast config={toastConfig} />
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
