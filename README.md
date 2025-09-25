# Advanced MCP Calculator Server with TensorFlow Integration

RAG(검색 증강 생성) + 데이터 처리 + TensorFlow ML 기능이 포함된 고급 MCP(Model Context Protocol) 서버

## 프로젝트 개요

Claude Desktop과 연동하여 다음 기능들을 제공하는 AI 개발자/엔지니어용 실무형 포트폴리오 프로젝트입니다:

- **RAG 시스템**: 수학/AI 지식베이스 검색 및 유사도 기반 정보 검색
- **TensorFlow 통합**: 텍스트 임베딩, 분류, 시퀀스 예측, 고급 통계 분석
- **데이터 분석**: 통계 계산, 분포 분석, 실시간 데이터 처리
- **AI 챗봇**: 교육적 설명 생성 (난이도별 맞춤)
- **고급 수학 계산**: 미적분, 삼각함수, 복합 수식 처리

## 주요 기능

### 1. TensorFlow 기반 ML 기능
```javascript
// TensorFlow 텍스트 임베딩
"TensorFlow로 '미적분' 텍스트 임베딩 생성해줘"
// → 100차원 벡터 임베딩 생성

// 텍스트 유사도 계산
"TensorFlow로 '삼각함수'와 'sin cos tan' 유사도 계산해줘"
// → 코사인 유사도 기반 정확한 텍스트 유사성 측정

// 수치 시퀀스 예측
"TensorFlow로 [2,4,6,8] 시퀀스 다음 값 예측해줘"
// → 패턴 분석 및 다음 값 예측

// 텍스트 분류
"TensorFlow로 'integral calculus' 텍스트 분류해줘"
// → 수학/과학/일반 카테고리 자동 분류
```

### 2. RAG 검색 시스템
```javascript
// 지식베이스 검색
"RAG로 '벡터임베딩' 검색해줘"
// → 유사도 기반 검색 후 상세 정보 제공
```

### 3. 고급 데이터 분석
```javascript
// TensorFlow 기반 통계 분석
"TensorFlow로 [1,5,3,9,2,7,4,8,6] 데이터 통계 분석해줘"
// → TensorFlow 함수를 활용한 고급 통계 계산
```

### 4. AI 챗봇 응답
```javascript
// 교육적 설명 생성
"AI 챗봇으로 '미적분'을 초급 수준으로 설명해줘"
// → 난이도별 맞춤 교육 콘텐츠 생성
```

## 기술 스택

### 백엔드 아키텍처
- **JavaScript (Node.js)**: MCP 서버 구현
- **Python + TensorFlow 2.20**: 머신러닝 서버
- **Flask**: Python 웹 서버 프레임워크
- **scikit-learn**: 추가 ML 알고리즘

### 프로토콜 및 통신
- **MCP (Model Context Protocol)**: Claude Desktop 연동
- **JSON-RPC**: 표준 원격 프로시저 호출
- **HTTP REST API**: Python-JavaScript 서버 간 통신

### AI/ML 기술
- **TensorFlow**: 딥러닝 및 수치 계산
- **벡터 임베딩**: 텍스트 의미 표현
- **코사인 유사도**: 텍스트 유사성 측정
- **시계열 예측**: 수치 패턴 분석

## 시스템 아키텍처

```
Claude Desktop
       ↓ (MCP Protocol)
JavaScript MCP Server (Node.js)
       ↓ (HTTP REST API)
Python TensorFlow Server (Flask)
       ↓
┌─────────────────────────────────────────┐
│            TensorFlow 2.20              │
│  ┌─────────┬─────────┬─────────────────┐│
│  │Embedding│Text Cls │Sequence Predict ││
│  └─────────┴─────────┴─────────────────┘│
└─────────────────────────────────────────┘
```

## 설치 및 실행

### 시스템 요구사항
- Node.js v16 이상
- Python 3.8 이상
- Claude Desktop 최신 버전

### 1. 프로젝트 설정
```bash
git clone https://github.com/사용자명/advanced-mcp-calculator.git
cd advanced-mcp-calculator
```

### 2. Python 환경 설정
```bash
# 가상환경 생성 및 활성화
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Python 의존성 설치
pip install tensorflow flask numpy scikit-learn
```

### 3. JavaScript 의존성 설치
```bash
npm install
```

### 4. 서버 실행

**Python TensorFlow 서버 시작:**
```bash
python ml_server.py
# 출력: TensorFlow ML Server 시작: http://localhost:5000
```

**JavaScript MCP 서버 시작:**
```bash
node server.js
# 출력: Advanced MCP Server (RAG + Data Processing + TensorFlow) 시작됨
```

### 5. Claude Desktop 설정
`%APPDATA%\Claude\claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "advanced-calculator": {
      "command": "node",
      "args": ["C:/전체경로/server.js"]
    }
  }
}
```

## 사용법

### TensorFlow 기능 테스트
1. **텍스트 임베딩**: `"TensorFlow로 '머신러닝' 임베딩 생성해줘"`
2. **유사도 계산**: `"TensorFlow로 '딥러닝'과 '신경망' 유사도 계산해줘"`
3. **시퀀스 예측**: `"TensorFlow로 [10,20,30,40] 다음 값 예측해줘"`
4. **텍스트 분류**: `"TensorFlow로 'derivative of function' 분류해줘"`
5. **통계 분석**: `"TensorFlow로 [1,2,3,4,5] 통계 분석해줘"`

### 사용 가능한 도구들
- `tensorflow_embedding`: TensorFlow 기반 텍스트 임베딩
- `ml_similarity`: 머신러닝 텍스트 유사도 계산
- `text_classification`: 텍스트 카테고리 분류
- `sequence_prediction`: 수치 시퀀스 예측
- `tensorflow_analysis`: TensorFlow 기반 통계 분석
- `rag_search`: RAG 지식베이스 검색
- `data_analysis`: 기본 데이터 분석
- `ai_chatbot_response`: 교육적 설명 생성

## 성능 및 특징

### 기술적 성능
- **응답 시간**: < 200ms (TensorFlow 처리 포함)
- **임베딩 차원**: 100차원 벡터
- **지식베이스**: 4개 도메인 (수학, AI, 벡터, 미적분)
- **동시 처리**: 비동기 HTTP 통신
- **메모리 사용량**: 
  - JavaScript 서버: < 50MB
  - Python TensorFlow 서버: < 200MB

### 확장성 설계
- 모듈화된 아키텍처
- RESTful API 설계
- 독립적인 언어별 서버
- 표준 프로토콜 준수

## 개발자 역량 증명

### AI/ML 전문성
- **TensorFlow 2.20 활용**: 실제 딥러닝 프레임워크 사용
- **텍스트 임베딩**: 고차원 벡터 공간 변환
- **시퀀스 모델링**: 패턴 인식 및 예측
- **RAG 시스템**: 검색 증강 생성 구현

### 풀스택 개발 능력
- **다중 언어**: JavaScript, Python
- **프레임워크**: Node.js, Flask, TensorFlow
- **통신 프로토콜**: MCP, JSON-RPC, HTTP REST
- **비동기 처리**: Promise, async/await

### 소프트웨어 아키텍처
- **마이크로서비스**: 언어별 독립 서버
- **API 설계**: RESTful 인터페이스
- **오류 처리**: 견고한 예외 처리
- **로깅**: 구조화된 디버깅 시스템

## 향후 확장 계획

### 기술적 개선
- [ ] 실제 BERT 모델 통합 (Sentence-BERT)
- [ ] 벡터 데이터베이스 연동 (ChromaDB, Pinecone)
- [ ] GPU 가속 처리
- [ ] 배치 처리 최적화

### 기능 확장
- [ ] 더 많은 ML 모델 (분류, 회귀, 클러스터링)
- [ ] 실시간 데이터 스트리밍
- [ ] 웹 대시보드 (React/Vue.js)
- [ ] 모델 파인튜닝 인터페이스

### 인프라 개선
- [ ] Docker 컨테이너화
- [ ] Kubernetes 배포
- [ ] CI/CD 파이프라인
- [ ] 모니터링 및 알람

## 파일 구조

```
advanced-mcp-calculator/
├── server.js              # JavaScript MCP 서버
├── ml_server.py           # Python TensorFlow 서버
├── package.json           # Node.js 설정
├── requirements.txt       # Python 의존성
├── claude_desktop_config.json  # Claude 설정 예시
├── README.md             # 프로젝트 문서
└── SETUP_GUIDE.md       # 설치 가이드
```

**Built for AI Developer/Engineer Portfolio**

이 프로젝트는 실무에서 요구되는 RAG 개발, TensorFlow 활용, 데이터 처리, AI 챗봇 개발 역량을 종합적으로 보여주는 포트폴리오입니다.
