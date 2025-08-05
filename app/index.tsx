import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { ThemeToggle } from "../components/ThemeToggle";

export default function SplashScreen() {
  const { isDark } = useTheme();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/(tabs)");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <SafeAreaView
        className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <View className="flex-1 justify-center items-center">
          <Image
            source={require("../assets/app.png")}
            className="w-48 h-48 rounded-3xl mb-4"
            resizeMode="contain"
          />
          <Text
            className={`text-lg ${
              isDark ? "text-white" : "text-gray-900"
            } flex justify-center items-center`}
          >
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <View
        className="flex-1"
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <View className="absolute top-14 right-4 z-10">
          <ThemeToggle />
        </View>

        <View className="flex-1 justify-center items-center px-8">
          {/* App Logo/Icon */}
          <Image
            source={require("../assets/app.png")}
            className="w-48 h-48 rounded-3xl mb-8"
            resizeMode="contain"
          />

          {/* App Name and Subtitle */}
          <Text
            className={`text-4xl font-bold mb-3 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            TaskFlow AI
          </Text>
          <Text
            className={`text-lg text-center mb-12 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Smart task prioritization powered by AI
          </Text>

          {/* Action Buttons */}
          <View className="w-full space-y-8 flex flex-col gap-4">
            <TouchableOpacity
              onPress={() => router.push("/(auth)/login")}
              className="py-4 px-8 rounded-xl shadow-lg"
              style={{ backgroundColor: "#D10000" }}
            >
              <Text className="text-white text-lg font-semibold text-center">
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/signup")}
              className={`py-4 px-8 rounded-xl border-2 bg-transparent`}
              style={{ borderColor: "#D10000" }}
            >
              <Text
                className="text-lg font-semibold text-center"
                style={{ color: "#D10000" }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
