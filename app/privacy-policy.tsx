import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../hooks/useTheme";

export default function PrivacyPolicyScreen() {
  const { isDark } = useTheme();

  const handleBack = () => {
    router.back();
  };

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <View className="mb-6">
      <Text
        className={`text-lg font-bold mb-3 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        {title}
      </Text>
      <Text
        className={`text-sm leading-6 ${
          isDark ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {children}
      </Text>
    </View>
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
            Privacy Policy
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1 px-4 py-6"
          showsVerticalScrollIndicator={false}
        >
          <View
            className={`p-6 rounded-xl mb-6 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <Text
              className={`text-sm mb-4 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Last updated: {new Date().toLocaleDateString()}
            </Text>

            <Section title="Introduction">
              Welcome to TaskFlow AI. We respect your privacy and are committed
              to protecting your personal data. This privacy policy explains how
              we collect, use, and safeguard your information when you use our
              AI-powered task management application.
            </Section>

            <Section title="Information We Collect">
              We collect minimal information necessary to provide our service:
              {"\n\n"}• Task data (titles, descriptions, priorities)
              {"\n"}• Usage data (how you interact with our AI features)
              {"\n"}• Device information (device type, operating system)
              {"\n\n"}We do not collect or store personal information such as
              names, emails, or profile pictures.
            </Section>

            <Section title="How We Use Your Information">
              We use the collected information to:
              {"\n\n"}• Provide and maintain our AI task prioritization service
              {"\n"}• Process and analyze your tasks for intelligent sorting
              {"\n"}• Improve our AI algorithms and user experience
              {"\n"}• Send you important updates and notifications
              {"\n"}• Respond to your questions and support requests
            </Section>

            <Section title="AI and Task Processing">
              Our AI system analyzes your task content to provide intelligent
              prioritization. This involves:
              {"\n\n"}• Processing task titles and descriptions for urgency
              detection
              {"\n"}• Analyzing patterns in your task management behavior
              {"\n"}• Generating priority scores based on content analysis
              {"\n"}• Learning from your interactions to improve recommendations
              {"\n\n"}Your task data is processed securely and is not shared
              with third parties for AI training purposes.
            </Section>

            <Section title="Data Security">
              We implement appropriate security measures to protect your
              personal information:
              {"\n\n"}• Encryption of data in transit and at rest
              {"\n"}• Secure authentication and authorization
              {"\n"}• Regular security audits and updates
              {"\n"}• Access controls and monitoring
            </Section>

            <Section title="Data Sharing">
              We do not sell, trade, or rent your personal information to third
              parties. We may share your information only in the following
              circumstances:
              {"\n\n"}• With your explicit consent
              {"\n"}• To comply with legal obligations
              {"\n"}• To protect our rights and safety
              {"\n"}• With service providers who assist in app operations (under
              strict confidentiality agreements)
            </Section>

            <Section title="Your Rights">
              You have the right to:
              {"\n\n"}• Access your task data
              {"\n"}• Delete your task list at any time
              {"\n"}• Opt out of certain data processing
              {"\n"}• Contact us with privacy concerns
              {"\n\n"}Note: Since we do not collect personal information, there
              is no personal data to export or correct.
            </Section>

            <Section title="Data Retention">
              We retain your task data for as long as you use our service. You
              can delete your task list at any time from your profile settings,
              and we will remove your data immediately.
            </Section>

            <Section title="Children's Privacy">
              Our service is not intended for children under 13. We do not
              knowingly collect personal information from children under 13. If
              you believe we have collected such information, please contact us
              immediately.
            </Section>

            <Section title="Changes to This Policy">
              We may update this privacy policy from time to time. We will
              notify you of any changes by posting the new policy on this page
              and updating the "Last updated" date.
            </Section>

            <Section title="Contact Us">
              If you have any questions about this privacy policy or our data
              practices, please contact us at:
              {"\n\n"}Email: alimcosoft@gmail.com
            </Section>
          </View>

          {/* Extra padding for bottom */}
          <View className="h-20" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
