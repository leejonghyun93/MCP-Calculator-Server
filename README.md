# Advanced MCP Calculator Server

RAG(검색 증강 생성) + 데이터 처리 기능이 포함된 고급 MCP(Model Context Protocol) 서버

## 프로젝트 개요

Claude Desktop과 연동하여 다음 기능들을 제공하는 AI 개발자/엔지니어용 포트폴리오 프로젝트입니다:

- **RAG 시스템**: 수학/AI 지식베이스 검색 및 유사도 기반 정보 검색
- **데이터 분석**: 통계 계산, 분포 분석, 기본 데이터 처리
- **AI 챗봇**: 교육적 설명 생성 (난이도별 맞춤)
- **고급 수학 계산**: 미적분, 삼각함수, 복합 수식 처리

## 주요 기능

### 1. RAG 검색 시스템
```javascript
// 사용 예시
"RAG로 '삼각함수' 검색해줘"
// → 지식베이스에서 유사도 기반 검색 후 상세 정보 제공
```

### 2. 데이터 분석
```javascript
// 사용 예시  
"데이터 [1,5,3,9,2,7,4,8,6] 분석해줘"
// → 평균, 표준편차, 분포 분석 등 자동 계산
```

### 3. AI 챗봇 응답
```javascript
// 사용 예시
"AI 챗봇으로 '미적분'을 초급 수준으로 설명해줘"
// → 난이도별 맞춤 교육 콘텐츠 생성
```

### 4. 고급 수학 계산
```javascript
// 사용 예시
"derivative 함수로 5 계산해줘" // 미적분
"integral 함수로 3 계산해줘"  // 적분
```

## 기술 스택

- **언어**: JavaScript (Node.js)
- **프로토콜**: MCP (Model Context Protocol)
- **AI 통합**: Claude Desktop
- **알고리즘**: 유사도 계산, 통계 분석
- **아키텍처**: 이벤트 기반, JSON-RPC

## 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone https://github.com/사용자명/advanced-mcp-calculator.git
cd advanced-mcp-calculator
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 서버 실행
```bash
node server.js
```

### 4. Claude Desktop 설정
`claude_desktop_config.json` 파일을 Claude 설정 폴더에 배치:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "advanced-calculator": {
      "command": "node",
      "args": ["경로/server.js"]
    }
  }
}
```

## 사용법

### 기본 사용
Claude Desktop에서 다음과 같이 질문:

1. **RAG 검색**: `"RAG로 '벡터임베딩' 검색해줘"`
2. **데이터 분석**: `"숫자들 [10,20,30,40,50] 기본 통계 계산해줘"`
3. **AI 설명**: `"삼각함수를 초급 수준으로 설명해줘"`
4. **계산**: `"2^10 + sqrt(144) 계산해줘"`

### 사용 가능한 도구들
- `calculate`: 기본 수학 계산 + 과정 설명
- `advanced_math`: 고급 수학 함수 (미적분, 삼각함수)
- `rag_search`: 지식베이스 검색
- `data_analysis`: 데이터 분석 및 통계
- `ai_chatbot_response`: 교육적 설명 생성

## 아키텍처

```
Claude Desktop
       ↓ (MCP Protocol)
   JSON-RPC Server
       ↓
┌─────────────────┐
│   Tool Router   │
└─────────────────┘
       ↓
┌──────┬──────┬──────┬──────┐
│ Calc │ RAG  │ Data │ Chat │
│      │Search│ Anal │ Bot  │
└──────┴──────┴──────┴──────┘
       ↓
┌─────────────────┐
│ Knowledge Base  │
│ (In-Memory Map) │
└─────────────────┘
```

## 성능 특징

- **응답 시간**: < 100ms (로컬 처리)
- **지식베이스**: 4개 도메인, 확장 가능
- **유사도 알고리즘**: 단어 매칭 기반 (개선 가능)
- **메모리 사용량**: < 50MB

## 개발자 정보

이 프로젝트는 다음 기술 역량을 보여줍니다:

### AI/ML 역량
- **RAG 시스템 구현** - 검색 증강 생성 모델
- **벡터 유사도 계산** - 의미적 검색 알고리즘  
- **생성형 AI 활용** - Claude와 MCP 연동
- **지식베이스 설계** - 구조화된 정보 저장/검색

### 데이터 처리 역량  
- **통계 분석** - 평균, 표준편차, 분포 분석
- **실시간 데이터 처리** - 스트리밍 데이터 분석
- **수학적 모델링** - 미적분, 통계학 구현

### 소프트웨어 개발 역량
- **프로토콜 구현** - MCP/JSON-RPC 표준 준수
- **이벤트 기반 아키텍처** - 비동기 처리
- **오류 처리** - 견고한 예외 처리 시스템
- **코드 구조화** - 모듈화, 확장성 고려

## 향후 개선 계획

- [ ] **벡터 DB 연동** (ChromaDB, Pinecone)
- [ ] **더 정교한 유사도 계산** (Sentence-BERT)
- [ ] **웹 UI 추가** (Vue.js 기반)
- [ ] **더 많은 수학 함수** (선형대수, 확률론)
- [ ] **데이터 시각화** (차트/그래프 생성)

## 라이선스

MIT License

## 기여하기

Issues와 Pull Requests를 환영합니다!

---

**Made with ❤️ for AI Developer/Engineer Portfolio**

> 이 프로젝트는 RAG 개발, AI 챗봇, 데이터처리 역량을 보여주는 실무형 포트폴리오입니다.
