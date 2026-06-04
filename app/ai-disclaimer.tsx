import { TrustPage } from '@/components/legal/TrustPage';

export default function AiDisclaimerScreen() {
  return (
    <TrustPage
      eyebrow="AI Notice"
      title="AI 음식 분석 안내"
      sections={[
        {
          heading: 'AI 분석의 성격',
          body: [
            'K-Food Travel의 AI 음식 사진 분석은 이미지에서 음식명, 재료, 카테고리, 지역 후보를 추정해 여행 기록 작성을 돕는 참고 기능입니다.',
            'AI 결과는 사진 품질, 조명, 각도, 음식의 형태, 학습 데이터 한계에 따라 부정확하거나 누락되거나 문맥에 맞지 않을 수 있습니다.',
          ],
        },
        {
          heading: '전문 조언이 아님',
          body: [
            'AI 음식 분석은 의료, 영양, 알레르기, 위생, 안전, 법률 또는 전문적인 조언이 아닙니다.',
            '알레르기, 식단 제한, 건강 상태, 종교적·문화적 식사 기준과 관련된 중요한 정보는 음식점, 제조자, 전문가 또는 신뢰할 수 있는 공식 자료를 통해 직접 확인해야 합니다.',
          ],
        },
        {
          heading: '사용자 확인 필요',
          body: [
            '사용자는 AI가 제시한 음식명, 재료, 지역 정보, 추천 문구를 게시 전에 직접 확인하고 수정해야 합니다.',
            'AI 결과가 부정확하거나 부적절하다고 판단되는 경우 /contact 또는 신고 기능을 통해 알려주면 서비스 개선과 검토에 활용될 수 있습니다.',
          ],
        },
      ]}
    />
  );
}
