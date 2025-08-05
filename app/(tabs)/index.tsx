import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Platform,
  StatusBar,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../../hooks/useTheme";
import { useTasks } from "../../hooks/useTasks";
import { ThemeToggle } from "../../components/ThemeToggle";
import { TaskItem } from "../../components/TaskItem";
import { Task } from "../../types/task";

export default function TaskListScreen() {
  const { isDark } = useTheme();
  const {
    tasks,
    loading,
    error,
    toggleTaskComplete,
    deleteTask,
    refreshTasks,
  } = useTasks();
  const [activeTab, setActiveTab] = useState<"pending" | "completed">(
    "pending"
  );

  const pendingTasks = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => (b.aiPriorityScore || 0) - (a.aiPriorityScore || 0));
  const completedTasks = tasks
    .filter((task) => task.completed)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const currentTasks = activeTab === "pending" ? pendingTasks : completedTasks;

  const handleToggleComplete = async (id: string) => {
    try {
      await toggleTaskComplete(id);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const onRefresh = async () => {
    await refreshTasks();
  };

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-8">
      <View
        className={`w-20 h-20 rounded-full ${
          isDark ? "bg-gray-800" : "bg-gray-100"
        } justify-center items-center mb-4`}
      >
        <Ionicons
          name={
            activeTab === "pending" ? "list-outline" : "checkmark-done-outline"
          }
          size={32}
          color={isDark ? "#6B7280" : "#9CA3AF"}
        />
      </View>
      <Text
        className={`text-xl font-semibold mb-2 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        {activeTab === "pending" ? "No pending tasks" : "No completed tasks"}
      </Text>
      <Text
        className={`text-center ${isDark ? "text-gray-400" : "text-gray-600"}`}
      >
        {activeTab === "pending"
          ? "Add your first task to get started with AI-powered prioritization"
          : "Complete some tasks to see them here"}
      </Text>
    </View>
  );

  const renderTask = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onToggleComplete={handleToggleComplete}
      onDelete={handleDeleteTask}
    />
  );

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <View
        className="flex-1"
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-2">
          <View className="flex-row items-center">
            <Image
              source={require("../../assets/app.png")}
              className="w-12 h-12 rounded-lg mr-3"
              resizeMode="contain"
            />
            <View>
              <Text
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                TaskFlow AI
              </Text>
              <Text
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {pendingTasks.length} pending, {completedTasks.length} completed
              </Text>
            </View>
          </View>
          <ThemeToggle />
        </View>

        {/* Tab Buttons */}
        <View
          className={`flex-row mx-4 mb-4 p-1 rounded-xl ${
            isDark ? "bg-gray-800" : "bg-gray-200"
          }`}
        >
          <TouchableOpacity
            onPress={() => setActiveTab("pending")}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === "pending" ? "bg-red-600" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "pending"
                  ? "text-white"
                  : isDark
                  ? "text-gray-300"
                  : "text-gray-600"
              }`}
            >
              Pending ({pendingTasks.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("completed")}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === "completed" ? "bg-red-600" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "completed"
                  ? "text-white"
                  : isDark
                  ? "text-gray-300"
                  : "text-gray-600"
              }`}
            >
              Completed ({completedTasks.length})
            </Text>
          </TouchableOpacity>
        </View>

        {error && <Text className="text-red-500">{error}</Text>}
        {!loading && !error && currentTasks.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={currentTasks}
            renderItem={renderTask}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingTop: 0, paddingBottom: 100 }}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={onRefresh}
                tintColor={isDark ? "#D10000" : "#D10000"}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Floating Action Button */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/add-task")}
          className="absolute bottom-6 right-6 w-14 h-14 rounded-full justify-center items-center shadow-lg"
          style={{
            backgroundColor: "#D10000",
            shadowColor: "#D10000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
