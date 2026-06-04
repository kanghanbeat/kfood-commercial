import { router, type Href } from 'expo-router';
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

  function handleSaveDraft() {
    const hasTitle = draft.title.trim().length > 0;
    const hasFoodName = draft.foodName.trim().length > 0;

    setTitleError(hasTitle ? '' : 'Post title is required.');
    setFoodNameError(hasFoodName ? '' : 'Food name is required.');

    if (!hasTitle || !hasFoodName) {
      setSuccessMessage('');
      return;
    }

    setSuccessMessage('Journal draft saved for review. Photo publishing opens after secure account storage is enabled.');
  }

  function handleCancel() {
    router.replace('/' as Href);
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Shared Upload</Text>
        <Text style={styles.title}>Create K-Food Travel Post</Text>
        <Text style={styles.subtitle}>
          Draft your food-centered travel story with the route details travelers need before visiting.
        </Text>
      </View>

      <AppCard style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>Before you publish</Text>
        <Text style={styles.noticeText}>
          Upload only photos and notes you have the right to share. Do not include private documents, payment details,
          medical information, or identifiable people without permission.
        </Text>
        <Text style={styles.noticeText}>
          Food photos may be reviewed for safety and may be analyzed by server-side AI. AI results are only a reference,
          and reported content can be limited or removed during moderation.
        </Text>
      </AppCard>

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
          label="Photo note"
          onChangeText={(value) => updateDraft('imagePlaceholder', value)}
          placeholder="Optional: describe the food photo"
          value={draft.imagePlaceholder}
        />

        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderTitle}>Photo publishing</Text>
          <Text style={styles.imagePlaceholderText}>
            {draft.imagePlaceholder.trim() || 'Add a short photo note while secure media upload is being prepared.'}
          </Text>
        </View>

        {successMessage ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        <View style={styles.buttonGroup}>
          <AppButton onPress={handleSaveDraft} title="Save Journal Draft" />
          <AppButton onPress={handleCancel} title="Cancel" variant="outline" />
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
  noticeCard: {
    padding: theme.spacing.lg,
    borderColor: '#FED7AA',
    backgroundColor: '#FFF7ED',
  },
  noticeTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  noticeText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.size.caption,
    lineHeight: 20,
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
