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
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { loginSchema, LoginFormData } from "../../lib/validations";

export default function LoginScreen() {
  const { isDark } = useTheme();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    if (Object.keys(errors).length > 0) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fix the errors below",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn(data.email, data.password);

      if (error) {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: error.message,
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Welcome back!",
          text2: "Login successful",
        });
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
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

        <View className="flex-1 px-6 justify-center -mt-32">
          {/* App Icon and Title */}
          <View className="items-center mb-8">
            <Image
              source={require("../../assets/app.png")}
              className="w-32 h-32 rounded-2xl mb-4"
              resizeMode="contain"
            />
            <Text
              className={`text-3xl font-bold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Welcome Back
            </Text>
            <Text
              className={`text-lg ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Sign in to TaskFlow AI
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4 mb-8 flex flex-col gap-4">
            {/* Email Input */}
            <View>
              <Text
                className={`text-sm font-medium mb-1  ${
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
                  />
                )}
              />
              {errors.email && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View>
              <Text
                className={`text-sm font-medium mb-1  ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Password
              </Text>
              <View className="relative">
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter your password"
                      placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                      className={`p-4 pr-12 rounded-xl border text-base ${
                        errors.password
                          ? isDark
                            ? "border-red-400 bg-red-900/20 text-white"
                            : "border-red-500 bg-red-50 text-red-800"
                          : isDark
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      secureTextEntry={!showPassword}
                    />
                  )}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4"
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color={isDark ? "#9CA3AF" : "#6B7280"}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </Text>
              )}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => router.push("/(auth)/forget-password")}
              className="self-end"
            >
              <Text
                className="text-sm font-medium"
                style={{ color: "#D10000" }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            className={`py-4 rounded-xl mb-6 ${loading ? "opacity-50" : ""}`}
            style={{ backgroundColor: "#D10000" }}
          >
            <Text className="text-white text-lg font-semibold text-center">
              {loading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center">
            <Text className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/signup")}>
              <Text className="font-medium" style={{ color: "#D10000" }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
