# Next.js Boilerplate

이 Boilerplate는 다음 기술들을 사용하여 간단한 CRUD 애플리케이션을 구축합니다:

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React-Query](https://react-query.tanstack.com/)
- [Recoil](https://recoiljs.org/)
- [Prisma](https://www.prisma.io/)
- [React Hook Form](https://react-hook-form.com/)
- [React-Table](https://react-table.tanstack.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## 살펴 보기

CodeSandbox 에서도 체험해 볼 수 있습니다: [CodeSandbox](https://codesandbox.io/p/github/ATG-AMS/ams-next-boilerplate/main?layout=%257B%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522clmm6s76o000i3p6e1ektveg6%2522%252C%2522sizes%2522%253A%255B70%252C30%255D%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522id%2522%253A%2522clmm6s76n000e3p6e4hob719l%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522SHELLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522id%2522%253A%2522clmm6s76o000g3p6exqs9hio9%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522DEVTOOLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522id%2522%253A%2522clmm6s76o000h3p6el2jn4kwa%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%252C%2522sizes%2522%253A%255B50%252C50%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522clmm6s76n000e3p6e4hob719l%2522%253A%257B%2522id%2522%253A%2522clmm6s76n000e3p6e4hob719l%2522%252C%2522activeTabId%2522%253A%2522clmm6wkq801cn3p6eas1uw1tv%2522%252C%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clmm6s76n000d3p6eva8rwu2v%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522FILE%2522%252C%2522filepath%2522%253A%2522%252FREADME.md%2522%257D%252C%257B%2522type%2522%253A%2522FILE%2522%252C%2522filepath%2522%253A%2522%252F.codesandbox%252Ftasks.json%2522%252C%2522id%2522%253A%2522clmm6vzk6015s3p6ed8gk56uc%2522%252C%2522mode%2522%253A%2522permanent%2522%257D%252C%257B%2522type%2522%253A%2522FILE%2522%252C%2522filepath%2522%253A%2522%252F.env%2522%252C%2522id%2522%253A%2522clmm6wkq801cn3p6eas1uw1tv%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522state%2522%253A%2522IDLE%2522%257D%252C%257B%2522type%2522%253A%2522FILE%2522%252C%2522filepath%2522%253A%2522%252Fpackage.json%2522%252C%2522id%2522%253A%2522clmm6zpc602gu3p6ef18g0q5a%2522%252C%2522mode%2522%253A%2522temporary%2522%257D%255D%257D%252C%2522clmm6s76o000h3p6el2jn4kwa%2522%253A%257B%2522id%2522%253A%2522clmm6s76o000h3p6el2jn4kwa%2522%252C%2522activeTabId%2522%253A%2522clmm6zais02b03p6e5nzqa0ey%2522%252C%2522tabs%2522%253A%255B%257B%2522type%2522%253A%2522TASK_PORT%2522%252C%2522taskId%2522%253A%2522dev%2522%252C%2522port%2522%253A3000%252C%2522id%2522%253A%2522clmm6sqq800li3p6eqbkisnop%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522path%2522%253A%2522%252F%2522%257D%252C%257B%2522type%2522%253A%2522UNASSIGNED_PORT%2522%252C%2522port%2522%253A3000%252C%2522id%2522%253A%2522clmm6zais02b03p6e5nzqa0ey%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522path%2522%253A%2522%252F%2522%257D%255D%257D%252C%2522clmm6s76o000g3p6exqs9hio9%2522%253A%257B%2522id%2522%253A%2522clmm6s76o000g3p6exqs9hio9%2522%252C%2522activeTabId%2522%253A%2522clmm6s76o000f3p6eg1u1vozy%2522%252C%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clmm6s76o000f3p6eg1u1vozy%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522TERMINAL%2522%252C%2522shellId%2522%253A%2522clmm6s7de0020e6ep1jo4h0ca%2522%257D%252C%257B%2522type%2522%253A%2522TASK_LOG%2522%252C%2522taskId%2522%253A%2522dev%2522%252C%2522id%2522%253A%2522clmm6sol900hz3p6e31pe1dcl%2522%252C%2522mode%2522%253A%2522permanent%2522%257D%255D%257D%257D%252C%2522showDevtools%2522%253Atrue%252C%2522showShells%2522%253Atrue%252C%2522showSidebar%2522%253Atrue%252C%2522sidebarPanelSize%2522%253A15%257D)

또는 Github Codespace를 이용해서 살펴 볼 수 있습니다 :
        ![Screenshot 2023-09-17 at 4 55 48 PM](https://github.com/ATG-AMS/ams-next-boilerplate/assets/137207424/ac7376c0-3079-4e05-a63e-58ad9c06f269)

> :warning:
> **CRUD**가 제대로 작동하지 않는다면 `.env` 에서 `NEXT_PUBLIC_API_URI`를 환경에 맞게 수정해주세요.

## 설치 방법

```bash
git clone https://github.com/ATG-AMS/ams-next-boilerplate.git
cd ams-next-boilerplate
npm install
```

## 사용 방법

1. Prisma의 데이터베이스 설정(`DATABASE_URL`)과 요청 서버(`NEXT_PUBLIC_API_URI`)을 /.env에서 확인하고 필요한 설정을 조정하세요.
2. 데이터베이스 마이그레이션: ( :warning: 필요한 경우에만)

    ```bash
    npx prisma migrate dev --name="<마이그레이션 명>"
    ```

3. Next.js 개발 서버 실행:

    ```bash
    npm run dev # default Next.js bundler
    # 또는
    npm run turbo # (experimental) Next.js Turbopack
    ```

## 기능

Table을 이용한 간단한 CRUD를 체험해볼 수 있습니다.
- CRUD 연산: 간단한 CRUD 작업을 위한 API 엔드포인트 및 프론트엔드 구성.
- State Management: Recoil을 사용한 상태 관리.
- Data Fetching: React-Query를 사용하여 데이터 가져오기 및 캐싱.
- Database Integration: Prisma를 사용하여 데이터베이스 연동.
- UI Components: @shadcn/ui 컴포넌트를 사용하여 모던한 UI 구성.

## 기여

프로젝트에 기여하고 싶으시면, PR을 열어 주세요!
