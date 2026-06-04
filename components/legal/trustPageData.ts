export type TrustPageLink = {
  title: string;
  href:
    | '/about'
    | '/contact'
    | '/privacy'
    | '/terms'
    | '/content-policy'
    | '/report-policy'
    | '/ai-disclaimer'
    | '/cookie-policy';
};

export const trustPageLinks: TrustPageLink[] = [
  { title: '서비스 소개', href: '/about' },
  { title: '문의', href: '/contact' },
  { title: '개인정보 처리방침', href: '/privacy' },
  { title: '이용약관', href: '/terms' },
  { title: '콘텐츠 정책', href: '/content-policy' },
  { title: '신고 및 삭제 정책', href: '/report-policy' },
  { title: 'AI 안내', href: '/ai-disclaimer' },
  { title: '쿠키 정책', href: '/cookie-policy' },
];
