import { Tabs } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from "../../context/AuthContext";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();

  const themeColors = Colors[colorScheme ?? "light"];

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#020617" }}>
        <ActivityIndicator size="large" color="#06b6d4" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.tint,
        tabBarInactiveTintColor: "#64748b",
        headerShown: true,
        headerStyle: {
          backgroundColor: "#0f172a",
          borderBottomWidth: 1,
          borderBottomColor: "#1e293b",
        },
        headerTitleStyle: {
          fontWeight: "bold",
          color: "#ffffff",
        },
        tabBarStyle: {
          backgroundColor: "#0f172a",
          borderTopWidth: 1,
          borderTopColor: "#1e293b",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      {/* Home Welcome Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />,
        }}
      />

      {/* Complainant Cases Tab */}
      <Tabs.Screen
        name="complainant"
        options={{
          title: "My Cases",
          tabBarIcon: ({ color }) => <MaterialIcons name="folder-shared" size={24} color={color} />,
          href: user?.role === "user" || user?.role === "juror" ? "/complainant" : null,
        }}
      />

      {/* Opposite Party Tab */}
      <Tabs.Screen
        name="opposite-party"
        options={{
          title: "Claims Against Me",
          tabBarIcon: ({ color }) => <MaterialIcons name="gavel" size={24} color={color} />,
          href: user?.role === "user" || user?.role === "juror" ? "/opposite-party" : null,
        }}
      />

      {/* Juror Tab */}
      <Tabs.Screen
        name="juror"
        options={{
          title: "Juror Queue",
          tabBarIcon: ({ color }) => <MaterialIcons name="rate-review" size={24} color={color} />,
          href: user?.role === "juror" ? "/juror" : null,
        }}
      />

      {/* Admin Tab */}
      <Tabs.Screen
        name="admin"
        options={{
          title: "Admin Panel",
          tabBarIcon: ({ color }) => <MaterialIcons name="admin-panel-settings" size={24} color={color} />,
          href: user?.role === "admin" ? "/admin" : null,
        }}
      />

      {/* Default Explore Tab (Hidden) */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null, // hides this tab completely from navigation bar
        }}
      />
    </Tabs>
  );
}
