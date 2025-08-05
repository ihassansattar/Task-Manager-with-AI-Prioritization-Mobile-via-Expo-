import React from 'react';
import { View, Text } from 'react-native';
import { Task } from '../types/task';

interface PriorityBadgeProps {
  priority: Task['priority'];
}

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const getBadgeStyle = () => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 border-red-200';
      case 'medium':
        return 'bg-orange-100 border-orange-200';
      case 'low':
        return 'bg-green-100 border-green-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  const getTextStyle = () => {
    switch (priority) {
      case 'high':
        return 'text-red-800';
      case 'medium':
        return 'text-orange-800';
      case 'low':
        return 'text-green-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <View className={`px-2 py-1 rounded-full border ${getBadgeStyle()}`}>
      <Text className={`text-xs font-medium capitalize ${getTextStyle()}`}>
        {priority}
      </Text>
    </View>
  );
};