import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      className={`p-2 rounded-full ${
        theme === "dark" ? "bg-gray-800" : "bg-gray-100"
      }`}
    >
      <Ionicons
        name={theme === "dark" ? "sunny" : "moon"}
        size={20}
        color={theme === "dark" ? "#FCD34D" : "#374151"}
      />
    </TouchableOpacity>
  );
};
