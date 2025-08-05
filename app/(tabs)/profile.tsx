import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
  Image,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";
import { useImageUpload } from "../../hooks/useImageUpload";
import { ThemeToggle } from "../../components/ThemeToggle";
import Toast from "react-native-toast-message";

export default function ProfileScreen() {
  const { isDark } = useTheme();
  const { user, signOut, updateAvatar } = useAuth();
  const { profile, loading, error, refreshProfile } = useProfile();
  const { uploading, uploadImage } = useImageUpload();

  // Show loading state
  if (loading && !profile) {
    return (
      <SafeAreaView
        className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <View className="flex-1 justify-center items-center">
          <View
            className={`w-16 h-16 rounded-full ${
              isDark ? "bg-gray-800" : "bg-gray-200"
            } justify-center items-center mb-4`}
          >
            <Ionicons
              name="person-outline"
              size={32}
              color={isDark ? "#6B7280" : "#9CA3AF"}
            />
          </View>
          <Text
            className={`${
              isDark ? "text-white" : "text-gray-900"
            } text-lg font-medium`}
          >
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error && !profile) {
    return (
      <SafeAreaView
        className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <View className="flex-1 justify-center items-center px-8">
          <View
            className={`w-16 h-16 rounded-full ${
              isDark ? "bg-red-900/20" : "bg-red-50"
            } justify-center items-center mb-4`}
          >
            <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
          </View>
          <Text
            className={`${
              isDark ? "text-white" : "text-gray-900"
            } text-lg font-medium mb-2`}
          >
            Unable to load profile
          </Text>
          <Text
            className={`${
              isDark ? "text-gray-400" : "text-gray-600"
            } text-center`}
          >
            {error}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  const handleChangePassword = () => {
    router.push("/change-password");
  };

  const handlePrivacyPolicy = () => {
    router.push("/privacy-policy");
  };

  const handleContactUs = () => {
    router.push("/contact-us");
  };

  const handleChangeProfilePicture = async () => {
    if (!user) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "User not authenticated",
      });
      return;
    }

    try {
      const result = await uploadImage(user.id);

      if (result.success && result.url) {
        // Update the avatar URL in Supabase
        const { error } = await updateAvatar(result.url);

        if (error) {
          Toast.show({
            type: "error",
            text1: "Upload Failed",
            text2: error.message || "Failed to update profile picture",
          });
        } else {
          Toast.show({
            type: "success",
            text1: "Success!",
            text2: "Profile picture updated successfully",
          });

          // Refresh profile to show new image
          refreshProfile();
        }
      } else {
        if (result.error) {
          Toast.show({
            type: "error",
            text1: "Upload Failed",
            text2: result.error,
          });
        }
        // If no error, user probably cancelled
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An unexpected error occurred",
      });
      console.error("Profile picture upload error:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            Alert.alert("Error", "Failed to logout");
          }
        },
      },
    ]);
  };

  const renderProfilePicture = () => {
    const avatarUrl =
      user?.user_metadata?.avatar_url || profile?.profilePicture;
    const userName =
      profile?.name ||
      user?.user_metadata?.full_name ||
      user?.email?.split("@")[0] ||
      "User";

    if (avatarUrl) {
      return (
        <Image
          source={{ uri: avatarUrl }}
          className="w-24 h-24 rounded-full"
          style={{ backgroundColor: isDark ? "#374151" : "#D1D5DB" }}
        />
      );
    }

    return (
      <View
        className={`w-24 h-24 rounded-full ${
          isDark ? "bg-gray-700" : "bg-gray-300"
        } justify-center items-center`}
      >
        <Text
          className={`text-3xl font-bold ${
            isDark ? "text-white" : "text-gray-600"
          }`}
        >
          {userName
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()}
        </Text>
      </View>
    );
  };

  const ProfileStat = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: number;
    icon: string;
  }) => (
    <View
      className={`flex-1 items-center p-4 rounded-xl ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}
    >
      <Ionicons name={icon as any} size={24} color="#D10000" />
      <Text
        className={`text-2xl font-bold mt-2 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        {value}
      </Text>
      <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        {label}
      </Text>
    </View>
  );

  const MenuItem = ({
    icon,
    title,
    onPress,
    showArrow = true,
    textColor = undefined,
  }: {
    icon: string;
    title: string;
    onPress: () => void;
    showArrow?: boolean;
    textColor?: string;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-between p-4 rounded-xl mb-3 ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}
    >
      <View className="flex-row items-center">
        <Ionicons
          name={icon as any}
          size={20}
          color={textColor || (isDark ? "#9CA3AF" : "#6B7280")}
        />
        <Text
          className={`ml-3 text-base font-medium`}
          style={{
            color: textColor || (isDark ? "#FFFFFF" : "#111827"),
          }}
        >
          {title}
        </Text>
      </View>
      {showArrow && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isDark ? "#6B7280" : "#9CA3AF"}
        />
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
        <View className="flex-row items-center justify-between px-4 py-2">
          <Text
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Profile
          </Text>
          <ThemeToggle />
        </View>

        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refreshProfile}
              tintColor={isDark ? "#D10000" : "#D10000"}
            />
          }
        >
          {/* Profile Header */}
          <View
            className={`p-6 rounded-xl mb-6 items-center ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <TouchableOpacity
              onPress={handleChangeProfilePicture}
              className="relative mb-4"
              disabled={uploading}
            >
              {renderProfilePicture()}
              <View
                className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full justify-center items-center ${
                  uploading ? "opacity-50" : ""
                }`}
                style={{ backgroundColor: "#D10000" }}
              >
                {uploading ? (
                  <Ionicons name="hourglass-outline" size={16} color="white" />
                ) : (
                  <Ionicons name="camera" size={16} color="white" />
                )}
              </View>
            </TouchableOpacity>

            <Text
              className={`text-xl font-bold mb-1 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {profile?.name ||
                user?.user_metadata?.full_name ||
                user?.email?.split("@")[0] ||
                "User"}
            </Text>
            <Text
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {user?.email || ""}
            </Text>
            <Text
              className={`text-xs mt-1 ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Member since{" "}
              {profile?.joinedDate?.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              }) ||
                new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
            </Text>
          </View>

          {/* Stats */}
          <View className="flex-row gap-3 mb-6">
            <ProfileStat
              label="Total Tasks"
              value={profile?.totalTasks || 0}
              icon="list-outline"
            />
            <ProfileStat
              label="Completed"
              value={profile?.completedTasks || 0}
              icon="checkmark-done-outline"
            />
            <ProfileStat
              label="Pending"
              value={profile?.pendingTasks || 0}
              icon="time-outline"
            />
          </View>

          {/* Additional Analytics (if profile has extended data) */}
          {profile && profile.averageAiScore > 0 && (
            <View
              className={`p-4 rounded-xl mb-6 ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <View className="flex-row items-center mb-3">
                <Ionicons name="analytics-outline" size={20} color="#D10000" />
                <Text
                  className={`ml-2 text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Task Analytics
                </Text>
              </View>

              <View className="flex-row gap-3">
                <View className="flex-1 items-center">
                  <Text
                    className={`text-xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {profile.averageAiScore}
                  </Text>
                  <Text
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Avg AI Score
                  </Text>
                </View>

                <View className="flex-1 items-center">
                  <Text
                    className={`text-xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {profile.highPriorityTasks}
                  </Text>
                  <Text
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    High Priority
                  </Text>
                </View>

                <View className="flex-1 items-center">
                  <Text
                    className={`text-xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {Math.round(
                      (profile.completedTasks /
                        Math.max(profile.totalTasks, 1)) *
                        100
                    )}
                    %
                  </Text>
                  <Text
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Completion Rate
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Menu Items */}
          <View className="mb-6">
            <MenuItem
              icon="person-outline"
              title="Edit Profile"
              onPress={handleEditProfile}
            />
            <MenuItem
              icon="lock-closed-outline"
              title="Change Password"
              onPress={handleChangePassword}
            />
            <MenuItem
              icon="image-outline"
              title="Change Profile Picture"
              onPress={handleChangeProfilePicture}
            />
            <MenuItem
              icon="shield-checkmark-outline"
              title="Privacy Policy"
              onPress={handlePrivacyPolicy}
            />
            <MenuItem
              icon="mail-outline"
              title="Contact Us"
              onPress={handleContactUs}
            />
          </View>

          {/* Logout */}
          <MenuItem
            icon="log-out-outline"
            title="Logout"
            onPress={handleLogout}
            showArrow={false}
            textColor={isDark ? "#F87171" : "#EF4444"}
          />

          {/* Extra padding for bottom tab */}
          <View className="h-20" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
