import type { CandidateLabel, FoodLabelAnalysisResult, GoldFoodDatasetItem } from '@/types/foodLabel';

function getTopCandidate(candidates: CandidateLabel[]): CandidateLabel | undefined {
  return [...candidates].sort((a, b) => b.confidence - a.confidence)[0];
}

export function createGoldDatasetCandidate(
  label: FoodLabelAnalysisResult,
  reviewerId: string,
): GoldFoodDatasetItem {
  const topFoodName = getTopCandidate(label.foodNameCandidates)?.name ?? 'Unknown Food';
  const topRegion = getTopCandidate(label.regionCandidates)?.name;
  const foodName = label.selectedFoodName ?? topFoodName;
  const ingredients = label.selectedIngredients ?? label.ingredientCandidates.map((candidate) => candidate.name);
  const now = new Date().toISOString();

  return {
    id: `gold-candidate-${label.id}-${Date.now()}`,
    sourceImageId: label.imageId,
    sourceFoodLabelId: label.id,
    approvedByReviewerId: reviewerId,
    foodName,
    normalizedFoodName: foodName.toLowerCase().trim(),
    ingredients: [...ingredients],
    regionName: label.selectedRegionName ?? topRegion,
    category: label.category,
    tags: [...label.tags],
    confidenceScore: label.confidenceScore,
    isHumanVerified: true,
    status: 'candidate',
    createdAt: now,
    updatedAt: now,
  };
}
