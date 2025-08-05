import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center px-4">
          <View className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
              Oops! Something went wrong
            </Text>
            <Text className="text-gray-600 text-center mb-4">
              The app encountered an unexpected error. Please try restarting the app.
            </Text>
            <TouchableOpacity
              onPress={() => this.setState({ hasError: false })}
              className="bg-red-600 py-3 px-6 rounded-lg"
            >
              <Text className="text-white font-semibold text-center">
                Try Again
              </Text>
            </TouchableOpacity>
            {__DEV__ && this.state.error && (
              <View className="mt-4 p-3 bg-gray-100 rounded">
                <Text className="text-xs text-gray-700">
                  {this.state.error.toString()}
                </Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}