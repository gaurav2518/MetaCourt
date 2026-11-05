import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, Alert } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "juror" | "admin">("user"); // Debug role helper
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      await login({ email, password, role });
    } catch (err) {
      Alert.alert("Login Failed", err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.title}>MetaCourt</Text>
          <Text style={styles.subtitle}>Decentralized Dispute Resolution</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#64748b"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#64748b"
            secureTextEntry
            autoCapitalize="none"
          />

          {/* Development Role Selector Helper */}
          <Text style={styles.label}>Choose Workspace Role (Local Dev Helper)</Text>
          <View style={styles.roleContainer}>
            {(["user", "juror", "admin"] as const).map((r) => (
              <Pressable
                key={r}
                style={[styles.roleButton, role === r && styles.roleButtonActive]}
                onPress={() => setRole(r)}
              >
                <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
                  {r.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.button} onPress={handleLogin} disabled={submitting}>
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/register" asChild>
            <Pressable>
              <Text style={styles.linkText}>Register</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#06b6d4",
    marginTop: 8,
  },
  form: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    color: "#ffffff",
    fontSize: 16,
  },
  roleContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  roleButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  roleButtonActive: {
    backgroundColor: "rgba(6, 182, 212, 0.15)",
    borderColor: "#06b6d4",
  },
  roleText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#94a3b8",
  },
  roleTextActive: {
    color: "#06b6d4",
  },
  button: {
    backgroundColor: "#0891b2",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginTop: 28,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#94a3b8",
  },
  linkText: {
    color: "#06b6d4",
    fontWeight: "bold",
  },
});
