import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";
import { useTheme } from "../../hooks/useTheme";
import { forgetPasswordSchema, ForgetPasswordFormData } from "../../lib/validations";

export default function ForgetPasswordScreen() {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordFormData>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgetPasswordFormData) => {
    if (Object.keys(errors).length > 0) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fix the errors below",
      });
      return;
    }

    setLoading(true);

    // Simulate password reset process
    setTimeout(() => {
      setLoading(false);
      Toast.show({
        type: "success",
        text1: "Reset Link Sent",
        text2: "If an account with this email exists, we've sent you a password reset link.",
      });
      router.back();
    }, 1000);
  };

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
        </View>

        <View className="flex-1 px-6 justify-center">
          {/* Title */}
          <View className="mb-8">
            <Text
              className={`text-3xl font-bold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Reset Password
            </Text>
            <Text
              className={`text-lg ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Enter your email to receive a reset link
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4 mb-8 flex flex-col gap-4">
            {/* Email Input */}
            <View>
              <Text
                className={`text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter your email"
                    placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                    className={`p-4 rounded-xl border text-base ${
                      errors.email
                        ? isDark
                          ? "border-red-400 bg-red-900/20 text-white"
                          : "border-red-500 bg-red-50 text-red-800"
                        : isDark
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoFocus
                  />
                )}
              />
              {errors.email && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </Text>
              )}
            </View>
          </View>

          {/* Reset Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            className={`py-4 rounded-xl mb-6 ${loading ? "opacity-50" : ""}`}
            style={{ backgroundColor: "#D10000" }}
          >
            <Text className="text-white text-lg font-semibold text-center">
              {loading ? "Sending..." : "Send Reset Link"}
            </Text>
          </TouchableOpacity>

          {/* Back to Login */}
          <View className="flex-row justify-center">
            <Text className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Remember your password?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
              <Text className="font-medium" style={{ color: "#D10000" }}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
