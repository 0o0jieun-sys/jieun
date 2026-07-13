# Vercel Hobby Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 개인 연습용 Next.js 프로젝트를 GitHub 비공개 저장소에 올리고 Vercel Hobby와 연결해 `main` 브랜치 자동 배포를 완성한다.

**Architecture:** 로컬 `C:\vibecoding\my-shop`을 Git 저장소의 루트로 사용하고 GitHub `0o0jieun-sys/my-shop`에 푸시한다. 현재 로컬에 연결 흔적이 있는 Vercel `my-shop` 프로젝트가 계정 `0o0jieun-7396`의 프로젝트인지 확인한 후 GitHub 저장소를 연결하며, 이후 모든 프로덕션 배포는 `main` 브랜치 푸시로 실행한다.

**Tech Stack:** Next.js 16.2.10, React 19.2.4, Node.js 20.9 이상, npm, Git for Windows, Git Credential Manager 2.8.0, GitHub private repository, Vercel CLI 55.0.0, Vercel Hobby

## Global Constraints

- 배포 용도는 개인 연습 및 테스트 전용이다.
- GitHub 저장소는 `0o0jieun-sys/my-shop` 비공개 저장소로 생성한다.
- 최초에는 Vercel이 제공하는 무료 `*.vercel.app` 주소만 사용한다.
- `.env*`, `.vercel`, `node_modules`, `.next`, 개발 로그, 인증 키는 GitHub에 커밋하지 않는다.
- 비밀번호, 인증 코드, 액세스 토큰을 터미널 기록·대화·저장소에 남기지 않는다.
- 상업용 공개, 별도 도메인, 결제 기능, 운영 데이터베이스는 이 계획의 범위가 아니다.
- UI를 변경하지 않으므로 Pencil 문서 수정은 하지 않는다.

---

### Task 1: 저장소 추적 대상 정리

**Files:**
- Modify: `C:\vibecoding\my-shop\.gitignore`
- Test: Git의 ignore 규칙

**Interfaces:**
- Consumes: 기존 Next.js `.gitignore` 규칙
- Produces: `dev-server*.log` 파일을 Git 추적 대상에서 제외하는 규칙

- [ ] **Step 1: 현재 개발 로그가 제외되지 않는 상태 확인**

Run:

```powershell
git check-ignore dev-server.log
```

Expected: 출력이 없고 종료 코드가 `1`이다.

- [ ] **Step 2: `.gitignore`에 로컬 개발 서버 로그 규칙 추가**

파일 끝의 TypeScript 규칙 다음에 아래 내용을 추가한다.

```gitignore

# local development server logs
dev-server*.log
```

- [ ] **Step 3: 세 로그 파일이 모두 제외되는지 확인**

Run:

```powershell
git check-ignore dev-server.log dev-server.err.log dev-server.out.log
```

Expected:

```text
dev-server.log
dev-server.err.log
dev-server.out.log
```

- [ ] **Step 4: 저장소 비밀·빌드 산출물 제외 규칙 확인**

Run:

```powershell
git check-ignore .vercel/project.json node_modules/next/package.json .next/BUILD_ID
```

Expected: `.vercel/project.json`, `node_modules/next/package.json`, `.next/BUILD_ID`가 모두 출력된다.

- [ ] **Step 5: `.gitignore` 커밋**

Run:

```powershell
git add .gitignore
git commit -m "chore: ignore local development logs"
```

Expected: `1 file changed`가 포함된 새 커밋이 생성된다.

---

### Task 2: 로컬 품질 검사와 프로젝트 기준선 커밋

**Files:**
- Add: `C:\vibecoding\my-shop\app\**`
- Add: `C:\vibecoding\my-shop\components\**`
- Add: `C:\vibecoding\my-shop\lib\**`
- Add: `C:\vibecoding\my-shop\public\**`
- Add: `C:\vibecoding\my-shop\scripts\**`
- Add: `C:\vibecoding\my-shop\docs\**`
- Add: `C:\vibecoding\my-shop\package.json`
- Add: `C:\vibecoding\my-shop\package-lock.json`
- Add: `C:\vibecoding\my-shop\next.config.ts`
- Add: `C:\vibecoding\my-shop\tsconfig.json`
- Add: `C:\vibecoding\my-shop\postcss.config.mjs`
- Add: `C:\vibecoding\my-shop\eslint.config.mjs`
- Add: project documentation and design reference files in the repository root
- Test: ESLint, Next.js production build, staged-file audit

**Interfaces:**
- Consumes: Task 1의 ignore 규칙과 `package-lock.json`
- Produces: 로컬에서 검증된 `main` 브랜치 프로젝트 기준선

- [ ] **Step 1: 잠금 파일 기준으로 의존성 상태 확인**

Run:

```powershell
npm ci
```

Expected: 종료 코드 `0`이며 dependency installation error가 없다.

- [ ] **Step 2: ESLint 검사 실행**

Run:

```powershell
npm run lint
```

Expected: 종료 코드 `0`이며 ESLint error가 없다.

- [ ] **Step 3: Vercel과 동일한 프로덕션 빌드 검사**

Run:

```powershell
npm run build
```

Expected: 종료 코드 `0`이고 Next.js가 production build 완료 메시지를 출력한다.

- [ ] **Step 4: 프로젝트 파일 스테이징**

Run:

```powershell
git add .
git diff --cached --name-only
```

Expected: 소스·설정·문서 파일이 표시되고 `.env`, `.vercel`, `node_modules`, `.next`, `dev-server*.log`는 표시되지 않는다.

- [ ] **Step 5: 금지 파일이 스테이징되지 않았는지 기계적으로 확인**

Run:

```powershell
$forbidden = git diff --cached --name-only | Select-String -Pattern '(^|/)(\.env|\.vercel|node_modules|\.next)(/|$)|dev-server.*\.log$|\.pem$'
if ($forbidden) { $forbidden; throw 'Forbidden file is staged.' }
```

Expected: 출력 없이 정상 종료한다.

- [ ] **Step 6: 프로젝트 기준선 커밋**

Run:

```powershell
git commit -m "chore: add initial Next.js project"
git status --short
```

Expected: 커밋이 생성되고 `git status --short` 출력이 비어 있다.

---

### Task 3: GitHub 비공개 저장소 생성과 첫 푸시

**Files:**
- Modify: local Git configuration `remote.origin.url`
- External: GitHub repository `https://github.com/0o0jieun-sys/my-shop`
- Test: remote URL, upstream branch, repository visibility

**Interfaces:**
- Consumes: Task 2의 검증된 `main` 브랜치
- Produces: GitHub 비공개 원격 저장소와 추적 중인 `origin/main`

- [ ] **Step 1: Git Credential Manager에 GitHub 계정이 등록되어 있는지 확인**

Run:

```powershell
git credential-manager github list
```

Expected: `0o0jieun-sys`가 표시된다. 표시되지 않으면 다음 단계에서 로그인한다.

- [ ] **Step 2: 계정이 없을 때 GitHub 로그인 실행**

Run:

```powershell
git credential-manager github login
```

Expected: GitHub 인증 화면이 열리고, 사용자가 `0o0jieun-sys`로 승인한 뒤 명령이 종료 코드 `0`으로 끝난다. 비밀번호와 인증 코드는 터미널에 직접 입력하거나 대화에 전달하지 않는다.

- [ ] **Step 3: GitHub 웹에서 빈 비공개 저장소 생성**

브라우저에서 `https://github.com/new`을 열고 다음 값을 사용한다.

```text
Owner: 0o0jieun-sys
Repository name: my-shop
Description: Personal Next.js practice project
Visibility: Private
Add a README file: Off
Add .gitignore: None
Choose a license: None
```

Expected: 저장소 주소가 `https://github.com/0o0jieun-sys/my-shop`이고 `Private` 표시가 보인다.

- [ ] **Step 4: 원격 저장소 등록**

Run:

```powershell
git remote add origin https://github.com/0o0jieun-sys/my-shop.git
git remote -v
```

Expected: fetch와 push URL이 모두 `https://github.com/0o0jieun-sys/my-shop.git`이다.

- [ ] **Step 5: `main` 브랜치 첫 푸시**

Run:

```powershell
git push -u origin main
```

Expected: `main -> main`이 표시되고 로컬 `main`이 `origin/main`을 추적한다.

- [ ] **Step 6: 로컬과 원격 동기화 상태 확인**

Run:

```powershell
git status -sb
```

Expected:

```text
## main...origin/main
```

---

### Task 4: Vercel 계정·프로젝트 확인과 GitHub 연결

**Files:**
- Read only: `C:\vibecoding\my-shop\.vercel\project.json`
- External: Vercel account `0o0jieun-7396`
- External: Vercel project `my-shop`
- Test: Vercel identity, project access, Git connection

**Interfaces:**
- Consumes: Task 3의 `https://github.com/0o0jieun-sys/my-shop.git`
- Produces: Vercel `my-shop` 프로젝트와 GitHub 저장소의 자동 배포 연결

- [ ] **Step 1: Vercel CLI 로그인 계정 확인**

Run:

```powershell
vercel.cmd whoami
```

Expected: `0o0jieun-7396`이 출력된다. 로그인되어 있지 않으면 다음 단계에서 로그인한다.

- [ ] **Step 2: 로그인이 없거나 다른 계정일 때 Vercel 로그인 실행**

Run:

```powershell
vercel.cmd login
```

Expected: Vercel 인증 화면에서 사용자가 직접 승인한 뒤 `Congratulations! You are now logged in.` 메시지가 표시된다. 인증 코드나 토큰은 대화에 전달하지 않는다.

- [ ] **Step 3: 기존 로컬 연결의 Vercel 프로젝트 접근 확인**

Run:

```powershell
vercel.cmd project inspect my-shop
```

Expected: 프로젝트 이름 `my-shop`과 현재 계정의 프로젝트 정보가 표시된다.

- [ ] **Step 4: 기존 프로젝트가 계정에 없을 때만 개인 프로젝트 재연결**

Step 3이 `Project not found` 또는 권한 오류로 끝난 경우에만 실행한다.

Run:

```powershell
$target = (Resolve-Path -LiteralPath .vercel).Path
$expected = Join-Path (Get-Location).Path '.vercel'
if ($target -ne $expected) { throw "Unexpected delete target: $target" }
Remove-Item -Recurse -Force -LiteralPath $target
vercel.cmd link --yes --project my-shop
```

Expected: 개인 계정 아래 `my-shop` 프로젝트가 연결되고 새 `.vercel/project.json`이 생성된다. 삭제 대상은 반드시 `C:\vibecoding\my-shop\.vercel`로 확인한 뒤 실행한다.

- [ ] **Step 5: Vercel 프로젝트에 GitHub 저장소 연결**

Run:

```powershell
vercel.cmd git connect https://github.com/0o0jieun-sys/my-shop.git
```

Expected: GitHub 연동 승인이 이미 있으면 연결 성공 메시지가 출력된다. 승인이 없으면 Vercel이 제시하는 GitHub 권한 승인 화면에서 `0o0jieun-sys/my-shop` 저장소 접근만 허용한 뒤 명령을 다시 실행해 성공시킨다.

- [ ] **Step 6: 프로젝트 설정 확인**

Run:

```powershell
vercel.cmd project inspect my-shop
```

Expected: Framework가 Next.js로 인식되고 프로젝트가 계정 `0o0jieun-7396`에서 조회된다.

---

### Task 5: Git 푸시 자동 배포와 공개 URL 검증

**Files:**
- Modify: `C:\vibecoding\my-shop\README.md`
- Test: GitHub push, Vercel deployment status, HTTP 200

**Interfaces:**
- Consumes: Task 4의 GitHub-Vercel 연결
- Produces: `main` 브랜치 푸시로 생성된 Ready 상태 배포와 접근 가능한 `*.vercel.app` URL

- [ ] **Step 1: README에 연습 배포 방식 기록**

`README.md` 끝에 아래 내용을 추가한다.

```markdown

## Practice deployment

This personal practice project is automatically deployed to Vercel from the `main` branch.
```

- [ ] **Step 2: 문서 변경 커밋**

Run:

```powershell
git add README.md
git commit -m "docs: note Vercel practice deployment"
```

Expected: README 한 파일을 변경한 커밋이 생성된다.

- [ ] **Step 3: 자동 배포를 시작하는 Git 푸시**

Run:

```powershell
git push
```

Expected: 새 커밋이 `origin/main`에 푸시되고 Vercel에서 새 배포가 시작된다.

- [ ] **Step 4: Vercel 배포 상태 확인**

Run:

```powershell
vercel.cmd list my-shop --limit 5
```

Expected: 가장 최근 production 배포가 `Ready` 상태로 표시된다. `Building`이면 10초 간격으로 최대 6회 같은 명령을 다시 실행한다. 6회 후에도 `Building`이면 장시간 빌드로 보고 Vercel Build Logs를 확인하며, `Error`이면 Build Logs의 최초 오류를 로컬에서 재현한다.

- [ ] **Step 5: 최신 Ready 배포 URL을 자동으로 추출하고 HTTP 상태 확인**

Run:

```powershell
$result = vercel.cmd list my-shop --status READY --limit 1 --format json | ConvertFrom-Json
$item = if ($result.deployments) { @($result.deployments)[0] } else { @($result)[0] }
$hostName = [string]$item.url
$deploymentUrl = if ($hostName.StartsWith('https://')) { $hostName } else { "https://$hostName" }
$response = Invoke-WebRequest -Uri $deploymentUrl -UseBasicParsing
$deploymentUrl
$response.StatusCode
```

Expected: `https://`로 시작하는 Vercel URL과 상태 코드 `200`이 출력된다.

- [ ] **Step 6: 최종 동기화 상태와 최근 커밋 확인**

Run:

```powershell
git status -sb
git log --oneline -5
```

Expected: `main...origin/main`에 ahead/behind 표시가 없고 최근 커밋에 `docs: note Vercel practice deployment`가 포함된다.

## Completion Criteria

- GitHub `0o0jieun-sys/my-shop`가 비공개 저장소이다.
- 로컬 lint와 production build가 성공한다.
- Vercel 프로젝트가 계정 `0o0jieun-7396`에서 조회된다.
- GitHub `main` 푸시가 Vercel production 배포를 자동 생성한다.
- 최신 배포가 Ready이며 `*.vercel.app` URL이 HTTP 200으로 응답한다.
- 비밀정보, 빌드 결과물, 개발 로그가 GitHub 커밋에 포함되지 않는다.
