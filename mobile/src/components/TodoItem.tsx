/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';
import { Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Todo } from '../types';
import { theme } from '../styles';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const checkboxScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animateCheckbox = () => {
    Animated.sequence([
      Animated.timing(checkboxScale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(checkboxScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleToggle = () => {
    animateCheckbox();
    onToggle(todo.id);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        todo.completed && styles.containerCompleted,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={handleToggle}
        style={styles.checkbox}
        activeOpacity={0.6}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: todo.completed }}
        accessibilityLabel={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      >
        <Animated.View
          style={[
            styles.checkboxInner,
            todo.completed && styles.checkboxInnerChecked,
            {
              transform: [{ scale: checkboxScale }],
            },
          ]}
        >
          {todo.completed && <Text style={styles.checkmark}>✓</Text>}
        </Animated.View>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleToggle} style={styles.textContainer} activeOpacity={0.7}>
        <Text style={[styles.text, todo.completed && styles.textCompleted]} numberOfLines={3}>
          {todo.text}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleDelete}
        style={styles.deleteButton}
        activeOpacity={0.6}
        accessibilityRole="button"
        accessibilityLabel={`Delete "${todo.text}"`}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 12,
    marginHorizontal: theme.spacing.lg,
  },

  containerCompleted: {
    opacity: 0.5,
  },

  checkbox: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },

  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxInnerChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  checkmark: {
    color: theme.colors.background,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
  },

  textContainer: {
    flex: 1,
    paddingVertical: theme.spacing.xs,
  },

  text: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: theme.fontSize.md * 1.5,
  },

  textCompleted: {
    color: theme.colors.textMuted,
    textDecorationLine: 'line-through',
  },

  deleteButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },

  deleteButtonText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.danger,
    fontWeight: theme.fontWeight.semibold,
  },
});
