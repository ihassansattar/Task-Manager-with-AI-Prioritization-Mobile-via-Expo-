import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../hooks/useTheme";

export default function ChangePasswordScreen() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      Alert.alert(
        "Error",
        "New password must be different from current password"
      );
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", "Password changed successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }, 1000);
  };

  const updateFormData = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleShowPassword = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const PasswordInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    field,
    autoFocus = false,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    field: "current" | "new" | "confirm";
    autoFocus?: boolean;
  }) => (
    <View>
      <Text
        className={`text-sm font-medium mb-2 ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label}
      </Text>
      <View className="relative">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
          className={`p-4 pr-12 rounded-xl border text-base ${
            isDark
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
          secureTextEntry={!showPasswords[field]}
          autoFocus={autoFocus}
        />
        <TouchableOpacity
          onPress={() => toggleShowPassword(field)}
          className="absolute right-4 top-4"
        >
          <Ionicons
            name={showPasswords[field] ? "eye-off" : "eye"}
            size={20}
            color={isDark ? "#9CA3AF" : "#6B7280"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between p-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className={`p-2 rounded-full ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDark ? "white" : "black"}
            />
          </TouchableOpacity>
          <Text
            className={`text-xl font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Change Password
          </Text>
          <View className="w-10" />
        </View>

        <View className="flex-1 px-6">
          {/* Form */}
          <View className="mb-8 flex flex-col gap-4">
            <PasswordInput
              label="Current Password"
              value={formData.currentPassword}
              onChangeText={(value) => updateFormData("currentPassword", value)}
              placeholder="Enter current password"
              field="current"
              autoFocus
            />

            <PasswordInput
              label="New Password"
              value={formData.newPassword}
              onChangeText={(value) => updateFormData("newPassword", value)}
              placeholder="Enter new password"
              field="new"
            />

            <PasswordInput
              label="Confirm New Password"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData("confirmPassword", value)}
              placeholder="Confirm new password"
              field="confirm"
            />
          </View>

          {/* Password Requirements */}
          <View
            className={`p-4 rounded-xl mb-6 ${
              isDark ? "bg-gray-800" : "bg-red-50"
            }`}
          >
            <Text
              className={`text-sm font-medium mb-2 ${
                isDark ? "text-red-400" : "text-red-700"
              }`}
            >
              Password Requirements:
            </Text>
            <Text
              className={`text-xs ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              • At least 6 characters long{"\n"}• Different from current
              password{"\n"}• Use a strong, unique password
            </Text>
          </View>

          {/* Change Password Button */}
          <TouchableOpacity
            onPress={handleChangePassword}
            disabled={loading}
            className={`py-4 rounded-xl mb-6 ${loading ? "opacity-50" : ""}`}
            style={{ backgroundColor: "#D10000" }}
          >
            <Text className="text-white text-lg font-semibold text-center">
              {loading ? "Changing Password..." : "Change Password"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
