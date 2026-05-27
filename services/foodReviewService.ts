import type { FoodLabelAnalysisResult, FoodLabelEditableFields } from '@/types/foodLabel';
import type { FoodLabelReviewLog, ReviewAction } from '@/types/review';

let reviewLogs: FoodLabelReviewLog[] = [];

function getEditableFields(label: FoodLabelAnalysisResult): FoodLabelEditableFields {
  return {
    selectedFoodName: label.selectedFoodName,
    selectedIngredients: label.selectedIngredients ? [...label.selectedIngredients] : undefined,
    selectedRegionName: label.selectedRegionName,
    category: label.category,
    tags: [...label.tags],
  };
}

export function createReviewLog(
  foodLabelId: string,
  reviewerId: string,
  action: ReviewAction,
  previousData?: FoodLabelEditableFields,
  updatedData?: FoodLabelEditableFields,
  reason?: string,
): FoodLabelReviewLog {
  const log: FoodLabelReviewLog = {
    id: `review-log-${Date.now()}-${reviewLogs.length + 1}`,
    foodLabelId,
    reviewerId,
    action,
    previousData,
    updatedData,
    reason,
    createdAt: new Date().toISOString(),
  };

  reviewLogs = [log, ...reviewLogs];
  return log;
}

export function approveFoodLabel(label: FoodLabelAnalysisResult, reviewerId: string): FoodLabelAnalysisResult {
  const previousData = getEditableFields(label);
  const updatedLabel: FoodLabelAnalysisResult = {
    ...label,
    selectedIngredients: label.selectedIngredients ? [...label.selectedIngredients] : undefined,
    tags: [...label.tags],
    reviewStatus: 'approved',
    updatedAt: new Date().toISOString(),
  };

  createReviewLog(label.id, reviewerId, 'approved', previousData, getEditableFields(updatedLabel));
  return updatedLabel;
}

export function editFoodLabel(
  label: FoodLabelAnalysisResult,
  updates: FoodLabelEditableFields,
  reviewerId: string,
): FoodLabelAnalysisResult {
  const previousData = getEditableFields(label);
  const updatedLabel: FoodLabelAnalysisResult = {
    ...label,
    selectedFoodName: updates.selectedFoodName ?? label.selectedFoodName,
    selectedIngredients: updates.selectedIngredients ? [...updates.selectedIngredients] : label.selectedIngredients,
    selectedRegionName: updates.selectedRegionName ?? label.selectedRegionName,
    category: updates.category ?? label.category,
    tags: updates.tags ? [...updates.tags] : [...label.tags],
    reviewStatus: 'edited',
    updatedAt: new Date().toISOString(),
  };

  createReviewLog(label.id, reviewerId, 'edited', previousData, getEditableFields(updatedLabel));
  return updatedLabel;
}

export function rejectFoodLabel(
  label: FoodLabelAnalysisResult,
  reviewerId: string,
  reason?: string,
): FoodLabelAnalysisResult {
  const previousData = getEditableFields(label);
  const updatedLabel: FoodLabelAnalysisResult = {
    ...label,
    selectedIngredients: label.selectedIngredients ? [...label.selectedIngredients] : undefined,
    tags: [...label.tags],
    reviewStatus: 'rejected',
    updatedAt: new Date().toISOString(),
  };

  createReviewLog(label.id, reviewerId, 'rejected', previousData, getEditableFields(updatedLabel), reason);
  return updatedLabel;
}

export function getReviewLogs(): FoodLabelReviewLog[] {
  return reviewLogs.map((log) => ({
    ...log,
    previousData: log.previousData
      ? {
          ...log.previousData,
          selectedIngredients: log.previousData.selectedIngredients
            ? [...log.previousData.selectedIngredients]
            : undefined,
          tags: log.previousData.tags ? [...log.previousData.tags] : undefined,
        }
      : undefined,
    updatedData: log.updatedData
      ? {
          ...log.updatedData,
          selectedIngredients: log.updatedData.selectedIngredients ? [...log.updatedData.selectedIngredients] : undefined,
          tags: log.updatedData.tags ? [...log.updatedData.tags] : undefined,
        }
      : undefined,
  }));
}

export function resetReviewLogs(): void {
  reviewLogs = [];
}
