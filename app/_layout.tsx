import '../global.css';
import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeContext, useThemeState } from '../hooks/useTheme';
import { AuthProvider } from '../hooks/useAuth';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  const themeState = useThemeState();

  return (
    <AuthProvider>
      <ThemeContext.Provider value={themeState}>
        <StatusBar style={themeState.isDark ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <Toast />
      </ThemeContext.Provider>
    </AuthProvider>
  );
}