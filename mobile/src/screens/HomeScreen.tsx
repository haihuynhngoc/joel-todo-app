import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useTodos } from '../hooks/useTodos';
import { AddTodoForm } from '../components/AddTodoForm';
import { TodoList } from '../components/TodoList';
import { theme } from '../styles';

export function HomeScreen() {
  const {
    todos,
    loading,
    refreshing,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearError,
    fetchTodos,
    refreshTodos,
  } = useTodos();

  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (error) {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }

      errorTimeoutRef.current = setTimeout(() => {
        clearError();
      }, 5000);
    }

    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [error, clearError]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Todos</Text>
      </View>

      <AddTodoForm onAdd={addTodo} loading={loading} />

      {error && (
        <View style={styles.errorContainer}>
          <View style={styles.errorContent}>
            <Text style={styles.errorText}>{error}</Text>
            <View style={styles.errorActions}>
              <TouchableOpacity onPress={fetchTodos} style={styles.retryButton} activeOpacity={0.7}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={clearError} activeOpacity={0.7}>
                <Text style={styles.errorDismiss}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {loading && todos.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading todos...</Text>
        </View>
      ) : (
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          refreshing={refreshing}
          onRefresh={refreshTodos}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },

  header: {
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },

  title: {
    fontSize: 32,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    letterSpacing: -0.8,
  },

  errorContainer: {
    backgroundColor: theme.colors.danger,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },

  errorContent: {
    flexDirection: 'column',
  },

  errorText: {
    color: theme.colors.background,
    fontSize: theme.fontSize.md,
    marginBottom: theme.spacing.sm,
  },

  errorActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },

  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 36,
    borderRadius: theme.borderRadius / 2,
    borderWidth: 1,
    borderColor: theme.colors.background,
    justifyContent: 'center',
  },

  retryButtonText: {
    color: theme.colors.background,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },

  errorDismiss: {
    color: theme.colors.background,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    textDecorationLine: 'underline',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },

  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
  },
});
