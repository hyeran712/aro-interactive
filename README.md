# ARO Interactive

ARO 케이터링의 사진과 로고를 활용한 인터랙티브 웹사이트입니다.

- **새 사이트:** https://hyeran712.github.io/aro-interactive/
- **원본 프로젝트:** https://github.com/hyeran712/aro1
- **기존 사이트:** https://hyeran712.github.io/aro1/

원본의 코드와 Git 이력을 복사한 별도 저장소입니다. 새 디자인은 이 저장소에만 적용했습니다.

## 주요 변경

- 차콜 배경과 큰 세리프 타이포그래피
- 기존 요리 사진을 넘기는 메인 슬라이드
- 포인터 움직임에 반응하는 사진과 커서
- 마우스 드래그와 터치로 탐색하는 행사 갤러리
- 선택한 행사 유형으로 갤러리 페이지 이동
- 스크롤에 맞춘 콘텐츠 등장 효과
- 모바일 내비게이션, 키보드 조작과 동작 줄이기 설정 대응
- 상세 주소를 새로고침할 수 있는 해시 라우팅

기존 About, Services, Menu, Gallery, Journal, Process, Contact 페이지와 사진을 유지했습니다.

## 실행

```bash
npm install
npm start
```

개발 서버 주소의 `/aro-interactive/` 경로로 접속합니다.

```bash
npm run build
npm run deploy
```

React 19, React Router, CSS를 사용합니다. 문의 폼은 기존 시안이며 실제 전송은 별도 연동이 필요합니다.
