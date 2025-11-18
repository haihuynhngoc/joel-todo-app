/* eslint-disable no-unused-vars */
import React from 'react';
import { FlatList, StyleSheet, View, RefreshControl } from 'react-native';
import { Todo } from '../types';
import { TodoItem } from './TodoItem';
import { EmptyState } from './EmptyState';
import { theme } from '../styles';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export function TodoList({
  todos,
  onToggle,
  onDelete,
  refreshing = false,
  onRefresh,
}: TodoListProps) {
  if (todos.length === 0) {
    return <EmptyState />;
  }

  return (
    <FlatList
      data={todos}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <TodoItem todo={item} onToggle={onToggle} onDelete={onDelete} />
        </View>
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={true}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },

  itemContainer: {
    marginBottom: theme.spacing.sm,
  },
});
