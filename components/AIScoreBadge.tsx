import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

interface AIScoreBadgeProps {
  score: number;
  priority: 'low' | 'medium' | 'high';
  showScore?: boolean;
}

export const AIScoreBadge: React.FC<AIScoreBadgeProps> = ({ 
  score, 
  priority, 
  showScore = true 
}) => {
  const { isDark } = useTheme();

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#EF4444'; // Red for high priority
    if (score >= 40) return '#F59E0B'; // Amber for medium priority
    return '#10B981'; // Green for low priority
  };

  const getScoreIcon = (score: number) => {
    if (score >= 70) return 'flame';
    if (score >= 40) return 'flash';
    return 'leaf';
  };

  const scoreColor = getScoreColor(score);
  const scoreIcon = getScoreIcon(score);

  if (!showScore && score === 0) return null;

  return (
    <View className="flex-row items-center">
      {showScore && (
        <View 
          className="flex-row items-center px-2 py-1 rounded-full mr-2"
          style={{ backgroundColor: `${scoreColor}20` }}
        >
          <Ionicons 
            name={scoreIcon} 
            size={12} 
            color={scoreColor} 
          />
          <Text 
            className="text-xs font-medium ml-1"
            style={{ color: scoreColor }}
          >
            {score}
          </Text>
        </View>
      )}
    </View>
  );
};