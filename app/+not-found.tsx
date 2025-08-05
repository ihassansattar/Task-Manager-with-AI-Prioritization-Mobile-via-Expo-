import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { useTheme } from "../hooks/useTheme";

export default function NotFoundScreen() {
  const { isDark } = useTheme();

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <View className="flex-1 justify-center items-center px-8">
        <Text
          className={`text-2xl font-bold mb-4 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Page Not Found
        </Text>
        <Text
          className={`text-center mb-8 ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          The page you're looking for doesn't exist.
        </Text>
        <TouchableOpacity
          onPress={() => router.replace("/")}
          className="py-3 px-6 rounded-xl"
          style={{ backgroundColor: "#D10000" }}
        >
          <Text className="text-white font-semibold">Go Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
