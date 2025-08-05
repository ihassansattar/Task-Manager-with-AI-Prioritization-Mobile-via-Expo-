import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { Task } from "../types/task";
import { PriorityBadge } from "./PriorityBadge";
import { AIScoreBadge } from "./AIScoreBadge";
import { format } from "date-fns";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem = ({
  task,
  onToggleComplete,
  onDelete,
}: TaskItemProps) => {
  const { isDark } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleDelete = () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDelete(task.id),
      },
    ]);
  };

  return (
    <View
      className={`mx-4 mb-3 p-4 rounded-xl ${
        isDark
          ? "bg-gray-800 border border-gray-700"
          : "bg-white shadow-sm border border-gray-200"
      }`}
    >
      {/* Main Task Row */}
      <View className="flex-row gap-3 items-start space-x-3">
        {/* Checkbox */}
        <TouchableOpacity
          onPress={() => onToggleComplete(task.id)}
          className={`w-6 h-6 rounded-full border-2 justify-center items-center ${
            task.completed
              ? "border-red-600"
              : isDark
              ? "border-gray-500"
              : "border-gray-300"
          }`}
          style={task.completed ? { backgroundColor: "#D10000" } : {}}
        >
          {task.completed && (
            <Ionicons name="checkmark" size={16} color="white" />
          )}
        </TouchableOpacity>

        {/* Task Content */}
        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          className="flex-1"
        >
          <View className="flex-row items-center justify-between mb-2">
            <Text
              className={`flex-1 text-base font-medium mr-2 ${
                task.completed
                  ? isDark
                    ? "text-gray-500 line-through"
                    : "text-gray-400 line-through"
                  : isDark
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              {task.title}
            </Text>
            <View className="flex-row items-center">
              {task.aiPriorityScore && task.aiPriorityScore > 0 && (
                <AIScoreBadge 
                  score={task.aiPriorityScore} 
                  priority={task.priority}
                  showScore={true}
                />
              )}
              <PriorityBadge priority={task.priority} />
            </View>
          </View>

          {/* Description (if expanded) */}
          {expanded && task.description && (
            <Text
              className={`text-sm mb-2 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {task.description}
            </Text>
          )}

          {/* Created Date */}
          <Text
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Created {format(task.createdAt, "MMM d, yyyy")}
          </Text>
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity
          onPress={handleDelete}
          className={`p-2 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
        >
          <Ionicons
            name="trash-outline"
            size={16}
            color={isDark ? "#EF4444" : "#DC2626"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
