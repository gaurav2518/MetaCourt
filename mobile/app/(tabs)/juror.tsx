import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JurorDashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Juror Workspace</Text>
          <Text style={styles.subtitle}>Review dispute evidence and cast your vote</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Case Assignment Queue</Text>
          <Text style={styles.cardText}>No cases currently assigned for review.</Text>
        </View>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#94a3b8",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#06b6d4",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#cbd5e1",
  },
});
