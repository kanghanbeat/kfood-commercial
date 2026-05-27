import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { theme } from '@/constants/theme';

type JournalDraft = {
  title: string;
  story: string;
};

const initialDraft: JournalDraft = {
  title: '',
  story: '',
};

export default function CreateScreen() {
  const [draft, setDraft] = useState<JournalDraft>(initialDraft);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  function updateDraft(field: keyof JournalDraft, value: string) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
    setFeedbackMessage('');
  }

  function handlePreviewJournal() {
    setFeedbackMessage('Journal preview is mocked for Phase 1. Real posting will be connected later.');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Journal</Text>
            <Text style={styles.subtitle}>
              Share your K-Food travel story with photos, places, and local dishes.
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.field}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                onChangeText={(value) => updateDraft('title', value)}
                placeholder="Where did your K-Food adventure begin?"
                placeholderTextColor={theme.colors.textSecondary}
                style={styles.input}
                value={draft.title}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Story</Text>
              <TextInput
                multiline
                onChangeText={(value) => updateDraft('story', value)}
                placeholder="Describe the tastes, atmosphere, and local food routes..."
                placeholderTextColor={theme.colors.textSecondary}
                style={[styles.input, styles.storyInput]}
                textAlignVertical="top"
                value={draft.story}
              />
            </View>

            <View style={styles.helperZone}>
              <Text style={styles.helperTitle}>Future smart tags</Text>
              <Text style={styles.helperText}>Location & Food tags will automatically link here in Phase 2.</Text>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={handlePreviewJournal}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
              <Text style={styles.primaryButtonText}>Preview Journal</Text>
            </Pressable>

            {feedbackMessage ? (
              <View style={styles.feedbackBox}>
                <Text style={styles.feedbackText}>{feedbackMessage}</Text>
              </View>
            ) : null}

            <Text style={styles.footnote}>Post creation is currently mocked for Phase 1 testing.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    alignItems: 'center',
    padding: theme.layout.screenPadding,
    paddingBottom: theme.spacing.xxl,
  },
  container: {
    width: '100%',
    maxWidth: theme.layout.maxContentWidth,
    gap: theme.spacing.lg,
  },
  header: {
    gap: theme.spacing.sm,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.title,
    fontWeight: '700',
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.body,
    lineHeight: 24,
  },
  formCard: {
    width: '100%',
    gap: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    ...theme.shadow,
  },
  field: {
    gap: theme.spacing.sm,
  },
  label: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.input,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  storyInput: {
    minHeight: 150,
    lineHeight: 22,
  },
  helperZone: {
    gap: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.input,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  helperTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  helperText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    lineHeight: 20,
  },
  primaryButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.button,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  primaryButtonText: {
    color: theme.colors.surface,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  feedbackBox: {
    borderRadius: theme.radius.input,
    backgroundColor: '#FFF3ED',
    padding: theme.spacing.md,
  },
  feedbackText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.caption,
    fontWeight: '600',
    lineHeight: 20,
  },
  footnote: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.86,
  },
});
