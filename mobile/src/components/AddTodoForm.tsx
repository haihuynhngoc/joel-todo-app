/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../styles';

interface AddTodoFormProps {
  onAdd: (text: string) => Promise<void>;
  loading?: boolean;
}

export function AddTodoForm({ onAdd, loading = false }: AddTodoFormProps) {
  const [text, setText] = useState('');

  const MAX_LENGTH = 500;

  const isInputEmpty = text.trim().length === 0;

  const isButtonDisabled = isInputEmpty || loading;

  const handleAdd = async () => {
    const trimmedText = text.trim();

    if (trimmedText.length === 0) {
      return;
    }

    try {
      await onAdd(trimmedText);
      setText('');
    } catch {
      // Error handled by useTodos hook
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="What needs to be done?"
        placeholderTextColor={theme.colors.textMuted}
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleAdd}
        returnKeyType="done"
        maxLength={MAX_LENGTH}
        multiline={false}
        accessibilityLabel="New todo text"
        accessibilityHint={`Maximum ${MAX_LENGTH} characters`}
      />

      <TouchableOpacity
        style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
        onPress={handleAdd}
        disabled={isButtonDisabled}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Add todo"
        accessibilityState={{ disabled: isButtonDisabled }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.background} />
        ) : (
          <Text style={[styles.buttonText, isButtonDisabled && styles.buttonTextDisabled]}>
            Add
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
    gap: theme.spacing.md,
  },

  input: {
    flex: 1,
    height: 48,
    backgroundColor: theme.colors.backgroundAlt,
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },

  button: {
    height: 48,
    paddingHorizontal: 24,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonDisabled: {
    backgroundColor: theme.colors.disabled,
    opacity: 0.5,
  },

  buttonText: {
    color: theme.colors.background,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },

  buttonTextDisabled: {
    color: theme.colors.textMuted,
  },
});
