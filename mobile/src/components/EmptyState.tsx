import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles';

export function EmptyState() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>No todos yet!</Text>
      <Text style={styles.subtitle}>Add your first todo to get started</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxl,
  },

  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    textAlign: 'center',
    opacity: 0.8,
  },
});
