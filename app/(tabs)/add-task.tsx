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
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../../hooks/useTheme";
import { useTasks } from "../../hooks/useTasks";
import Toast from "react-native-toast-message";
import { Task } from "../../types/task";

export default function AddTaskScreen() {
  const { isDark } = useTheme();
  const { createTask } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter a task title",
      });
      return;
    }

    setLoading(true);

    try {
      const { task, error } = await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        // Priority will be determined by AI
      });

      if (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error,
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Task Created!",
          text2: "Your task has been added successfully",
        });
        // Force refresh of the main screen
        router.back();
      }
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
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
            className={`p-2 rounded-full ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <Ionicons
              name="close"
              size={24}
              color={isDark ? "white" : "black"}
            />
          </TouchableOpacity>

          <Text
            className={`text-lg font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Add Task
          </Text>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading || !title.trim()}
            className={`px-4 py-2 rounded-full ${
              loading || !title.trim() ? "bg-gray-300" : "bg-red-600"
            }`}
          >
            <Text
              className={`font-medium ${
                loading || !title.trim() ? "text-gray-500" : "text-white"
              }`}
            >
              {loading ? "AI Analyzing..." : "Add Task"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
        >
          {/* AI Priority Info */}
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
              value={title}
              onChangeText={setTitle}
              placeholder="What needs to be done?"
              placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
              className={`p-4 rounded-xl border text-base ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              autoFocus
              multiline
              textAlignVertical="top"
              style={{ minHeight: 50 }}
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
                isDark
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              multiline
              textAlignVertical="top"
              style={{ minHeight: 120 }}
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
                Our AI will analyze your task content, context, and urgency to automatically assign the optimal priority level when you save the task.
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
