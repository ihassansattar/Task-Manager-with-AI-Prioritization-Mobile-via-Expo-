import "react-native-get-random-values";
import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

// Simple debug app to test if basic React Native works
export default function DebugApp() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
          Debug App Working! 🎉
        </Text>
        <Text style={{ fontSize: 16, marginTop: 10, textAlign: 'center' }}>
          If you see this, the basic app structure is working.
        </Text>
      </View>
    </SafeAreaView>
  );
}