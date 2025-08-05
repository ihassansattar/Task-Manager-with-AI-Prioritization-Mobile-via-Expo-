import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../hooks/useTheme";

export default function ContactUsScreen() {
  const { isDark } = useTheme();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleBack = () => {
    router.back();
  };

  const handleSendEmail = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert("Error", "Please fill in both subject and message fields.");
      return;
    }

    const emailBody = `Subject: ${subject}\n\nMessage:\n${message}`;
    const mailtoUrl = `mailto:alimcosoft@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(emailBody)}`;

    Linking.canOpenURL(mailtoUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(mailtoUrl);
        } else {
          Alert.alert("Error", "No email app found on your device.");
        }
      })
      .catch((err) => {
        Alert.alert("Error", "Failed to open email app.");
      });
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Unable to open link.");
    });
  };

  const ContactMethod = ({
    icon,
    title,
    subtitle,
    action,
    onPress,
  }: {
    icon: string;
    title: string;
    subtitle: string;
    action?: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center p-4 rounded-xl mb-4 ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}
    >
      <View
        className={`w-12 h-12 rounded-full justify-center items-center mr-4`}
        style={{ backgroundColor: "#D10000" }}
      >
        <Ionicons name={icon as any} size={24} color="white" />
      </View>
      <View className="flex-1">
        <Text
          className={`text-base font-semibold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </Text>
        <Text
          className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          {subtitle}
        </Text>
      </View>
      {action && (
        <Text className={`text-sm font-medium`} style={{ color: "#D10000" }}>
          {action}
        </Text>
      )}
    </TouchableOpacity>
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
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <TouchableOpacity
            onPress={handleBack}
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
            className={`text-xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Contact Us
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1 px-4 py-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Contact Methods */}
          <View className="mb-8">
            <Text
              className={`text-lg font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Get in Touch
            </Text>

            <ContactMethod
              icon="mail-outline"
              title="Email Support"
              subtitle="alimcosoft@gmail.com"
              action="Send Email"
              onPress={() => handleOpenLink("mailto:alimcosoft@gmail.com")}
            />

            <ContactMethod
              icon="globe-outline"
              title="Website"
              subtitle="www.taskflowai.com"
              action="Visit"
              onPress={() => handleOpenLink("https://www.taskflowai.com")}
            />

            <ContactMethod
              icon="logo-twitter"
              title="Twitter"
              subtitle="@TaskFlowAI"
              action="Follow"
              onPress={() => handleOpenLink("https://twitter.com/TaskFlowAI")}
            />

            <ContactMethod
              icon="logo-linkedin"
              title="LinkedIn"
              subtitle="TaskFlow AI"
              action="Connect"
              onPress={() =>
                handleOpenLink("https://linkedin.com/company/taskflowai")
              }
            />
          </View>

          {/* Contact Form */}
          <View
            className={`p-6 rounded-xl mb-6 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <Text
              className={`text-lg font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Send us a Message
            </Text>

            <View className="mb-4">
              <Text
                className={`text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Subject
              </Text>
              <TextInput
                value={subject}
                onChangeText={setSubject}
                placeholder="Enter subject"
                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                className={`p-4 rounded-xl border text-base ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              />
            </View>

            <View className="mb-6">
              <Text
                className={`text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Message
              </Text>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Tell us how we can help..."
                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                className={`p-4 rounded-xl border text-base ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              />
            </View>

            <TouchableOpacity
              onPress={handleSendEmail}
              className="py-4 px-6 rounded-xl"
              style={{ backgroundColor: "#D10000" }}
            >
              <Text className="text-white text-center font-semibold">
                Send Message
              </Text>
            </TouchableOpacity>
          </View>

          {/* FAQ Section */}
          <View
            className={`p-6 rounded-xl mb-6 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <Text
              className={`text-lg font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Frequently Asked Questions
            </Text>

            <View className="space-y-4">
              <View>
                <Text
                  className={`text-base font-semibold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  How does AI prioritization work?
                </Text>
                <Text
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Our AI analyzes your task content, deadlines, and keywords to
                  automatically assign priority scores and sort tasks by
                  importance. We do not collect or store any personal data.
                </Text>
              </View>

              <View>
                <Text
                  className={`text-base font-semibold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Is my data secure?
                </Text>
                <Text
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Yes, we use industry-standard encryption and security measures
                  to protect your task data. We do not collect any personal
                  information.
                </Text>
              </View>

              <View>
                <Text
                  className={`text-base font-semibold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Can I export my tasks?
                </Text>
                <Text
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  No, there is no export option available. However, you can
                  delete your task list at any time from your profile settings.
                </Text>
              </View>
            </View>
          </View>

          {/* Business Hours */}
          <View
            className={`p-6 rounded-xl mb-6 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <Text
              className={`text-lg font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Support Hours
            </Text>
            <Text
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Monday - Friday: 9:00 AM - 6:00 PM EST
              {"\n"}Saturday: 10:00 AM - 4:00 PM EST
              {"\n"}Sunday: Closed
              {"\n\n"}We typically respond within 24 hours during business days.
            </Text>
          </View>

          {/* Extra padding for bottom */}
          <View className="h-20" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
