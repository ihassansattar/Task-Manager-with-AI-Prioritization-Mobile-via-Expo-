import React, { useState, useEffect } from "react";
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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { useImageUpload } from "../hooks/useImageUpload";
import { editProfileSchema, EditProfileFormData } from "../lib/validations";

export default function EditProfileScreen() {
  const { isDark } = useTheme();
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: "",
    },
  });

  // Set initial form values when user data loads
  useEffect(() => {
    if (user) {
      const currentName = user.user_metadata?.full_name || 
                         user.email?.split('@')[0] || 
                         '';
      setValue('name', currentName);
    }
  }, [user, setValue]);

  const onSubmit = async (data: EditProfileFormData) => {
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
      console.log('Updating profile with data:', data);
      
      const { error } = await updateProfile({
        full_name: data.name.trim(),
      });

      if (error) {
        Toast.show({
          type: "error",
          text1: "Update Failed",
          text2: error.message || "Failed to update profile",
        });
        console.error('Profile update error:', error);
      } else {
        Toast.show({
          type: "success",
          text1: "Profile Updated!",
          text2: "Your profile has been updated successfully",
        });
        console.log('Profile updated successfully');
        router.back();
      }
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An unexpected error occurred",
      });
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while user data is not available
  if (!user) {
    return (
      <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <View className="flex-1 justify-center items-center">
          <View
            className={`w-16 h-16 rounded-full ${
              isDark ? "bg-gray-800" : "bg-gray-200"
            } justify-center items-center mb-4`}
          >
            <Ionicons name="person-outline" size={32} color={isDark ? "#6B7280" : "#9CA3AF"} />
          </View>
          <Text className={`${isDark ? "text-white" : "text-gray-900"} text-lg font-medium`}>
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
            Edit Profile
          </Text>
          <View className="w-10" />
        </View>

        <View className="flex-1 px-6">
          {/* Form */}
          <View className="mb-8 flex flex-col gap-4">
            {/* Name Input */}
            <View>
              <Text
                className={`text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Full Name
              </Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter your full name"
                    placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                    className={`p-4 rounded-xl border text-base ${
                      errors.name
                        ? isDark
                          ? "border-red-400 bg-red-900/20 text-white"
                          : "border-red-500 bg-red-50 text-red-800"
                        : isDark
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    autoCapitalize="words"
                    autoFocus
                  />
                )}
              />
              {errors.name && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </Text>
              )}
            </View>

            {/* Email Input (Read-only) */}
            <View>
              <Text
                className={`text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email
              </Text>
              <View className="relative">
                <TextInput
                  value={user?.email || ""}
                  placeholder="Email address"
                  placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                  className={`p-4 pr-12 rounded-xl border text-base ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-400"
                      : "bg-gray-100 border-gray-200 text-gray-500"
                  }`}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={false}
                />
                <View className="absolute right-4 top-4">
                  <Ionicons
                    name="lock-closed"
                    size={20}
                    color={isDark ? "#9CA3AF" : "#6B7280"}
                  />
                </View>
              </View>
              <Text
                className={`text-xs mt-1 ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Email cannot be changed
              </Text>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            className={`py-4 rounded-xl mb-6 ${loading ? "opacity-50" : ""}`}
            style={{ backgroundColor: "#D10000" }}
          >
            <Text className="text-white text-lg font-semibold text-center">
              {loading ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
