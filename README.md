# ARO Interactive

밝은 스톤 톤 배경에 한 접시를 크게 보여주는 ARO 케이터링 홈페이지입니다.

- [새 사이트](https://hyeran712.github.io/aro-interactive/)
- [원본 프로젝트](https://github.com/hyeran712/aro1)
- [기존 사이트](https://hyeran712.github.io/aro1/)

원본 aro1을 복사한 별도 저장소입니다. 디자인 변경은 이 저장소에만 적용합니다.

## 구성

- 한 화면에 요리 한 접시, 짧은 메뉴명과 전환 버튼 표시
- 스테이크, 생선, 파스타, 샐러드, 새우를 스크롤·화살표·선택 점으로 탐색
- 모바일 스와이프와 키보드 방향키 지원
- 오른쪽 메뉴에서 상세 페이지 접근
- 단일 화면에서 스크롤할 때 다섯 요리가 순환
- 동작 줄이기 설정 지원

기존 메뉴·행사 사진과 상세 페이지를 활용합니다. 메인용 접시 이미지는 기존 사진을 바탕으로 배경 제거 도구를 통해 준비했습니다. 원본 사진은 `public/images/menu`에 그대로 있습니다.

## 실행

```bash
npm install
npm start
```

개발 서버의 `/aro-interactive/` 경로에서 확인합니다.

```bash
npm run build
npm run deploy
```

React 19, React Router, CSS를 사용합니다. 문의 폼의 실제 접수는 별도 연동이 필요합니다.
