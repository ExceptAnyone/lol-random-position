# 롤 포지션 랜덤 배치

친구들 이름을 입력하고 버튼을 누르면 탑 / 정글 / 미드 / 원딜 / 서폿 포지션에 랜덤으로 배치해주는 웹페이지입니다. (React + Vite)

- 입력한 이름은 `sessionStorage`에 저장되어 새로고침해도 유지됩니다. (탭을 닫으면 초기화)
- 5명 미만이면 남는 포지션은 비워둡니다.

## 로컬 실행

```bash
npm install
npm run dev
```

## Vercel 배포

Vercel에서 이 저장소를 Import 하면 Vite 프로젝트로 자동 인식됩니다.

- Build Command: `npm run build`
- Output Directory: `dist`
