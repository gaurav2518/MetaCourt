import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { user, logout, setMockRole } = useAuth();
  const router = useRouter();

  const handleRoleToggle = async (role: "user" | "juror" | "admin") => {
    setMockRole(role);
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/(tabs)/admin";
    if (user.role === "juror") return "/(tabs)/juror";
    return "/(tabs)/complainant";
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>Welcome back,</Text>
          <Text style={styles.name}>{user?.name || "Gaurav"}!</Text>
          <Text style={styles.subtitle}>MetaCourt Blockchain Justice System</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user?.email || "you@example.com"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Active Role:</Text>
            <Text style={[styles.value, styles.roleValue]}>{(user?.role || "user").toUpperCase()}</Text>
          </View>
        </View>

        {/* Development Workspace Helpers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Local Development Helpers</Text>
          <Text style={styles.sectionDescription}>
            Change your role below to simulate and test dashboard tab visibility and dynamic features on mobile.
          </Text>

          <View style={styles.roleGrid}>
            {(["user", "juror", "admin"] as const).map((r) => {
              const isActive = user?.role === r;
              return (
                <Pressable
                  key={r}
                  style={[styles.roleBtn, isActive && styles.roleBtnActive]}
                  onPress={() => handleRoleToggle(r)}
                >
                  <Text style={[styles.roleBtnText, isActive && styles.roleBtnTextActive]}>
                    {r.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable style={styles.primaryBtn} onPress={() => router.push(getDashboardPath() as any)}>
          <MaterialIcons name="dashboard" size={20} color="#ffffff" />
          <Text style={styles.primaryBtnText}>Go to Workspace Dashboard</Text>
        </Pressable>

        <Pressable style={styles.logoutBtn} onPress={logout}>
          <MaterialIcons name="logout" size={20} color="#f43f5e" />
          <Text style={styles.logoutBtnText}>Logout Session</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
    marginTop: 16,
  },
  welcomeTitle: {
    fontSize: 20,
    color: "#94a3b8",
  },
  name: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#06b6d4",
    marginTop: 8,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    color: "#64748b",
    fontSize: 14,
  },
  value: {
    color: "#cbd5e1",
    fontSize: 14,
    fontWeight: "500",
  },
  roleValue: {
    color: "#06b6d4",
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "rgba(6, 182, 212, 0.03)",
    borderColor: "rgba(6, 182, 212, 0.1)",
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#06b6d4",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 13,
    color: "#94a3b8",
    lineHeight: 18,
    marginBottom: 16,
  },
  roleGrid: {
    flexDirection: "row",
    gap: 8,
  },
  roleBtn: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  roleBtnActive: {
    backgroundColor: "rgba(6, 182, 212, 0.15)",
    borderColor: "#06b6d4",
  },
  roleBtnText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#94a3b8",
  },
  roleBtnTextActive: {
    color: "#06b6d4",
  },
  primaryBtn: {
    backgroundColor: "#0891b2",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  primaryBtnText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 15,
  },
  logoutBtn: {
    backgroundColor: "transparent",
    borderColor: "rgba(244, 63, 94, 0.2)",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  logoutBtnText: {
    color: "#f43f5e",
    fontWeight: "bold",
    fontSize: 15,
  },
});
