import { mockFoodLabels } from '@/data/mockFoodLabels';
import { routeFoodImageLabel } from '@/utils/routeFoodImageLabel';
import type { FoodLabelAnalysisResult } from '@/types/foodLabel';

function cloneAnalysisResult(label: FoodLabelAnalysisResult, imageUri: string): FoodLabelAnalysisResult {
  const now = new Date().toISOString();

  return {
    ...label,
    id: `${label.id}-analysis-${Date.now()}`,
    imageId: imageUri.trim() || label.imageId,
    foodNameCandidates: label.foodNameCandidates.map((candidate) => ({ ...candidate })),
    ingredientCandidates: label.ingredientCandidates.map((candidate) => ({ ...candidate })),
    regionCandidates: label.regionCandidates.map((candidate) => ({ ...candidate })),
    selectedIngredients: label.selectedIngredients ? [...label.selectedIngredients] : undefined,
    tags: [...label.tags],
    routeStatus: routeFoodImageLabel(label.confidenceScore),
    reviewStatus: 'pending',
    modelProvider: 'mock',
    modelVersion: 'mock-food-vision-v1',
    createdAt: now,
    updatedAt: now,
  };
}

export async function analyzeFoodImageMock(imageUri: string): Promise<FoodLabelAnalysisResult> {
  const sourceIndex = Math.abs(imageUri.length) % mockFoodLabels.length;
  const sourceLabel = mockFoodLabels[sourceIndex] ?? mockFoodLabels[0];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cloneAnalysisResult(sourceLabel, imageUri));
    }, 700);
  });
}
