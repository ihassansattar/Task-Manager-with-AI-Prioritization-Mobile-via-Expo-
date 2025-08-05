import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useTheme } from "../../hooks/useTheme";
import { useTasks } from "../../hooks/useTasks";
import Toast from "react-native-toast-message";

export default function AddTaskScreen() {
  const { isDark } = useTheme();
  const { createTask, loading, isCreating } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const titleInputRef = useRef<TextInput>(null);

  useFocusEffect(
    useCallback(() => {
      // Focus the title input when the screen comes into view
      titleInputRef.current?.focus();
    }, [])
  );

  const handleSubmit = async () => {
    if (!title.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter a task title",
      });
      return;
    }

    // Prevent multiple submissions
    if (isCreating) {
      return;
    }

    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
      });

      Toast.show({
        type: "success",
        text1: "Task Created!",
        text2: "Your task has been added successfully",
      });
      // Reset form and navigate back
      setTitle("");
      setDescription("");
      router.back();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "An unexpected error occurred",
      });
    }
  };

  const handleCancel = () => {
    // Prevent navigation during loading
    if (isCreating) {
      Toast.show({
        type: "info",
        text1: "Please Wait",
        text2: "Task is being processed. Please wait for it to complete.",
      });
      return;
    }

    if (title.trim() || description.trim()) {
      Alert.alert(
        "Discard Task?",
        "Are you sure you want to discard this task?",
        [
          { text: "Keep Editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
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
            onPress={handleCancel}
            disabled={isCreating}
            className={`p-2 rounded-full ${
              isCreating
                ? isDark
                  ? "bg-gray-700 opacity-50"
                  : "bg-gray-200 opacity-50"
                : isDark
                ? "bg-gray-800"
                : "bg-white"
            }`}
          >
            <Ionicons
              name="close"
              size={24}
              color={
                isCreating
                  ? isDark
                    ? "#6B7280"
                    : "#9CA3AF"
                  : isDark
                  ? "white"
                  : "black"
              }
            />
          </TouchableOpacity>

          <Text
            className={`text-lg font-semibold pl-12 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Add Task
          </Text>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isCreating || !title.trim()}
            className={`px-4 py-2 rounded-full flex-row items-center ${
              isCreating || !title.trim() 
                ? isDark 
                  ? "bg-gray-700" 
                  : "bg-gray-300" 
                : "bg-red-600"
            }`}
            style={{
              opacity: isCreating || !title.trim() ? 0.6 : 1.0
            }}
          >
            {isCreating && (
              <ActivityIndicator
                size="small"
                color={isDark ? "#9CA3AF" : "white"}
                style={{ marginRight: 8 }}
              />
            )}
            <Text
              className={`font-medium ${
                isCreating || !title.trim() 
                  ? isDark 
                    ? "text-gray-400" 
                    : "text-gray-500" 
                  : "text-white"
              }`}
            >
              {isCreating ? "AI Analyzing..." : "Add Task"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
        >
          {/* AI Priority Info / Loading Indicator */}
          {isCreating ? (
            <View
              className={`p-4 rounded-xl mb-6 ${
                isDark
                  ? "bg-blue-900/20 border border-blue-800"
                  : "bg-blue-50 border border-blue-200"
              }`}
            >
              <View className="flex-row items-center mb-3">
                <ActivityIndicator size="small" color="#3B82F6" />
                <Text
                  className={`ml-2 font-medium ${
                    isDark ? "text-blue-300" : "text-blue-800"
                  }`}
                >
                  AI Analyzing Task...
                </Text>
              </View>
              <Text
                className={`text-sm ${isDark ? "text-blue-200" : "text-blue-700"}`}
              >
                Our AI is analyzing your task content and determining the optimal priority level. This usually takes a few seconds.
              </Text>
              <View className="flex-row items-center mt-2">
                <Ionicons name="time-outline" size={16} color="#3B82F6" />
                <Text
                  className={`text-xs ml-1 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  Please wait, do not navigate away
                </Text>
              </View>
            </View>
          ) : (
            <View
              className={`p-4 rounded-xl mb-6 ${
                isDark
                  ? "bg-red-900/20 border border-red-800"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <View className="flex-row items-center mb-2">
                <Ionicons name="sparkles" size={20} color="#D10000" />
                <Text
                  className={`ml-2 font-medium ${
                    isDark ? "text-red-300" : "text-red-800"
                  }`}
                >
                  AI Prioritization
                </Text>
              </View>
              <Text
                className={`text-sm ${isDark ? "text-red-200" : "text-red-700"}`}
              >
                Our AI will analyze your task and automatically assign the optimal
                priority based on urgency and importance.
              </Text>
            </View>
          )}

          {/* Task Title */}
          <View className="mb-6">
            <Text
              className={`text-base font-medium mb-3 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Task Title *
            </Text>
            <TextInput
              ref={titleInputRef}
              value={title}
              onChangeText={setTitle}
              placeholder="What needs to be done?"
              placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
              className={`p-4 rounded-xl border text-base ${
                isCreating
                  ? isDark
                    ? "bg-gray-900 border-gray-600 text-gray-400"
                    : "bg-gray-100 border-gray-200 text-gray-500"
                  : isDark
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              multiline
              textAlignVertical="top"
              style={{ minHeight: 50 }}
              editable={!isCreating}
            />
          </View>

          {/* Task Description */}
          <View className="mb-6">
            <Text
              className={`text-base font-medium mb-3 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Description (Optional)
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Add more details about this task..."
              placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
              className={`p-4 rounded-xl border text-base ${
                isCreating
                  ? isDark
                    ? "bg-gray-900 border-gray-600 text-gray-400"
                    : "bg-gray-100 border-gray-200 text-gray-500"
                  : isDark
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              multiline
              textAlignVertical="top"
              style={{ minHeight: 120 }}
              editable={!isCreating}
            />
          </View>

          {/* AI Priority Info */}
          {title.trim() && (
            <View
              className={`p-4 rounded-xl mb-6 ${
                isDark
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text
                  className={`font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  AI Priority Analysis
                </Text>
                <View className="px-3 py-1 rounded-full bg-blue-100 border border-blue-200">
                  <Text className="text-xs font-medium text-blue-800">
                    Smart
                  </Text>
                </View>
              </View>
              <Text
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Our AI will analyze your task content, context, and urgency to
                automatically assign the optimal priority level when you save
                the task.
              </Text>
              <View className="flex-row items-center mt-2">
                <Ionicons name="bulb-outline" size={16} color="#D10000" />
                <Text
                  className={`text-xs ml-1 ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Add more details for better AI analysis
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
