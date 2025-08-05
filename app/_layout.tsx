import '../global.css';
import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeContext, useThemeState } from '../hooks/useTheme';
import { AuthProvider } from '../hooks/useAuth';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'green' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
    />
  ),
  error: (props) => (
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

export default function RootLayout() {
  const themeState = useThemeState();
  const backgroundColor = themeState.isDark ? '#121212' : '#FFFFFF';

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeContext.Provider value={themeState}>
          <StatusBar style={themeState.isDark ? 'light' : 'dark'} backgroundColor={backgroundColor} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          <Toast config={toastConfig} />
        </ThemeContext.Provider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
