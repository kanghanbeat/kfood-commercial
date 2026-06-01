import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppInput } from '@/components/common/AppInput';
import { ScreenContainer } from '@/components/common/ScreenContainer';
import { theme } from '@/constants/theme';

type UploadDraft = {
  title: string;
  foodName: string;
  region: string;
  travelNote: string;
  imagePlaceholder: string;
};

const emptyDraft: UploadDraft = {
  title: '',
  foodName: '',
  region: '',
  travelNote: '',
  imagePlaceholder: '',
};

type UploadDraftField = keyof UploadDraft;

export default function UploadScreen() {
  const [draft, setDraft] = useState<UploadDraft>(emptyDraft);
  const [titleError, setTitleError] = useState('');
  const [foodNameError, setFoodNameError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  function updateDraft(field: UploadDraftField, value: string) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
    setSuccessMessage('');

    if (field === 'title') {
      setTitleError('');
    }

    if (field === 'foodName') {
      setFoodNameError('');
    }
  }

  function handleSaveMockPost() {
    const hasTitle = draft.title.trim().length > 0;
    const hasFoodName = draft.foodName.trim().length > 0;

    setTitleError(hasTitle ? '' : 'Post title is required.');
    setFoodNameError(hasFoodName ? '' : 'Food name is required.');

    if (!hasTitle || !hasFoodName) {
      setSuccessMessage('');
      return;
    }

    setSuccessMessage('Mock post saved. Real photo upload and Supabase storage will be added later.');
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Shared Upload</Text>
        <Text style={styles.title}>Create K-Food Travel Post</Text>
        <Text style={styles.subtitle}>
          Upload your food-centered travel story. Real photo upload and Supabase storage will be added later.
        </Text>
      </View>

      <AppCard style={styles.formCard}>
        <AppInput
          error={titleError}
          label="Post title"
          onChangeText={(value) => updateDraft('title', value)}
          placeholder="Seoul night market tteokbokki route"
          value={draft.title}
        />
        <AppInput
          error={foodNameError}
          label="Food name"
          onChangeText={(value) => updateDraft('foodName', value)}
          placeholder="Tteokbokki"
          value={draft.foodName}
        />
        <AppInput
          label="Region"
          onChangeText={(value) => updateDraft('region', value)}
          placeholder="Seoul"
          value={draft.region}
        />
        <AppInput
          label="Travel note"
          onChangeText={(value) => updateDraft('travelNote', value)}
          placeholder="What made this stop memorable?"
          value={draft.travelNote}
        />
        <AppInput
          label="Mock image placeholder text"
          onChangeText={(value) => updateDraft('imagePlaceholder', value)}
          placeholder="Optional: describe the food photo"
          value={draft.imagePlaceholder}
        />

        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderTitle}>Photo upload placeholder</Text>
          <Text style={styles.imagePlaceholderText}>
            {draft.imagePlaceholder.trim() || 'No image selected. Image picker will be added later.'}
          </Text>
        </View>

        {successMessage ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        <View style={styles.buttonGroup}>
          <AppButton onPress={handleSaveMockPost} title="Save Mock Post" />
          <AppButton onPress={() => router.back()} title="Cancel" variant="outline" />
        </View>
      </AppCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.sm,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
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
    padding: theme.spacing.lg,
  },
  imagePlaceholder: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.input,
    backgroundColor: theme.colors.background,
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
  },
  imagePlaceholderTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
  },
  imagePlaceholderText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    lineHeight: 20,
  },
  successBox: {
    borderRadius: theme.radius.input,
    backgroundColor: '#ECFDF5',
    padding: theme.spacing.md,
  },
  successText: {
    color: theme.colors.success,
    fontSize: theme.typography.size.caption,
    fontWeight: '700',
    lineHeight: 20,
  },
  buttonGroup: {
    gap: theme.spacing.sm,
  },
});
