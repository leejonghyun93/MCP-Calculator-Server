#!/usr/bin/env node

/**
 * RAG + 데이터처리 기능이 추가된 고급 MCP 서버
 * AI Developer/Engineer 채용공고 맞춤형 포트폴리오
 */

class AdvancedMCPServer {
  constructor() {
    this.currentRequestId = null;
    this.knowledgeBase = new Map(); // RAG용 지식베이스
    this.dataStore = new Map(); // 데이터 저장소
    this.initializeKnowledgeBase();
    this.setupStdio();
    this.logMessage('🚀 Advanced MCP Server (RAG + Data Processing) 시작됨');
  }

  initializeKnowledgeBase() {
    // 수학/AI 지식베이스 초기화
    const knowledge = {
      '삼각함수': {
        definition: '삼각함수는 각의 크기와 삼각형의 변의 길이 사이의 관계를 나타내는 함수입니다.',
        formulas: ['sin²θ + cos²θ = 1', 'tan θ = sin θ / cos θ', 'sin(30°) = 1/2, cos(30°) = √3/2'],
        applications: '물리학, 공학, 컴퓨터 그래픽스에서 주기적 현상 분석에 사용'
      },
      'RAG': {
        definition: 'Retrieval-Augmented Generation - 검색 증강 생성 모델로, 외부 지식베이스를 검색하여 더 정확한 답변을 생성하는 AI 기법',
        components: ['Retriever (검색기)', 'Generator (생성기)', 'Knowledge Base (지식베이스)'],
        applications: 'QA 시스템, 챗봇, 문서 요약, 전문가 시스템'
      },
      '벡터임베딩': {
        definition: '텍스트나 데이터를 고차원 벡터 공간으로 변환하여 의미적 유사도를 계산할 수 있게 하는 기술',
        methods: ['Word2Vec', 'GloVe', 'BERT', 'Sentence Transformers'],
        applications: '검색 시스템, 추천 시스템, 유사도 계산'
      },
      '미적분': {
        definition: '함수의 변화율과 누적을 다루는 수학 분야',
        concepts: ['도함수 (변화율)', '적분 (누적)', '극한', '연속성'],
        formulas: ['d/dx(x²) = 2x', '∫x dx = x²/2 + C', 'lim(h→0) [f(x+h)-f(x)]/h']
      }
    };

    Object.entries(knowledge).forEach(([key, value]) => {
      this.knowledgeBase.set(key.toLowerCase(), value);
    });

    this.logMessage(`📚 지식베이스 초기화 완료: ${this.knowledgeBase.size}개 항목`);
  }

  setupStdio() {
    let buffer = '';
    
    process.stdin.on('data', (chunk) => {
      buffer += chunk.toString();
      
      let newlineIndex;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);
        
        if (line.trim()) {
          try {
            const request = JSON.parse(line);
            this.handleRequest(request);
          } catch (error) {
            this.logMessage(`JSON 파싱 오류: ${error.message}`);
            this.sendError(-32700, 'Parse error', null);
          }
        }
      }
    });

    process.stdin.on('end', () => {
      this.logMessage('stdin 종료됨');
    });
  }

  logMessage(message) {
    process.stderr.write(`[${new Date().toISOString()}] ${message}\n`);
  }

  handleRequest(request) {
    this.logMessage(`요청 받음: ${request.method} (id: ${request.id})`);
    this.currentRequestId = request.id;

    try {
      switch (request.method) {
        case 'initialize':
          this.handleInitialize(request);
          break;
        case 'tools/list':
          this.handleToolsList(request);
          break;
        case 'tools/call':
          this.handleToolCall(request);
          break;
        case 'notifications/initialized':
          this.logMessage('초기화 완료 알림 받음');
          break;
        default:
          this.sendError(-32601, `Method not found: ${request.method}`, request.id);
      }
    } catch (error) {
      this.logMessage(`요청 처리 오류: ${error.message}`);
      this.sendError(-32603, 'Internal error', request.id);
    }
  }

  handleInitialize(request) {
    const response = {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: 'advanced-calculator-rag-server',
          version: '2.0.0'
        }
      }
    };
    this.sendResponse(response);
    this.logMessage('초기화 응답 전송됨');
  }

  handleToolsList(request) {
    const tools = [
      {
        name: 'calculate',
        description: '기본 수학 계산을 수행합니다. 연산 과정도 함께 설명합니다.',
        inputSchema: {
          type: 'object',
          properties: {
            expression: {
              type: 'string',
              description: '계산할 수학 표현식'
            },
            explain: {
              type: 'boolean',
              description: '계산 과정 설명 여부',
              default: false
            }
          },
          required: ['expression']
        }
      },
      {
        name: 'advanced_math',
        description: '고급 수학 함수 계산 (삼각함수, 로그, 미적분 등)',
        inputSchema: {
          type: 'object',
          properties: {
            function: {
              type: 'string',
              enum: ['sin', 'cos', 'tan', 'log', 'ln', 'factorial', 'sqrt', 'abs', 'derivative', 'integral'],
              description: '수행할 수학 함수'
            },
            value: {
              type: 'number',
              description: '함수에 입력할 값'
            }
          },
          required: ['function', 'value']
        }
      },
      {
        name: 'rag_search',
        description: 'RAG 시스템으로 수학/AI 지식베이스를 검색합니다',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: '검색할 질의 (예: "삼각함수", "RAG", "미적분")'
            },
            detailed: {
              type: 'boolean',
              description: '상세 정보 포함 여부',
              default: true
            }
          },
          required: ['query']
        }
      },
      {
        name: 'data_analysis',
        description: '데이터 분석 및 통계 계산을 수행합니다',
        inputSchema: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: { type: 'number' },
              description: '분석할 숫자 데이터 배열'
            },
            analysis_type: {
              type: 'string',
              enum: ['basic_stats', 'correlation', 'regression', 'distribution'],
              description: '수행할 분석 유형',
              default: 'basic_stats'
            }
          },
          required: ['data']
        }
      },
      {
        name: 'ai_chatbot_response',
        description: 'AI 챗봇 스타일의 교육적 수학 설명을 생성합니다',
        inputSchema: {
          type: 'object',
          properties: {
            topic: {
              type: 'string',
              description: '설명할 수학 주제'
            },
            level: {
              type: 'string',
              enum: ['beginner', 'intermediate', 'advanced'],
              description: '설명 난이도',
              default: 'intermediate'
            }
          },
          required: ['topic']
        }
      }
    ];

    const response = {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        tools: tools
      }
    };
    
    this.sendResponse(response);
    this.logMessage(`🔧 도구 목록 전송됨: ${tools.length}개 도구`);
  }

  handleToolCall(request) {
    const { name, arguments: args } = request.params;
    this.logMessage(`🔧 도구 호출: ${name}, 인수: ${JSON.stringify(args)}`);

    try {
      switch (name) {
        case 'calculate':
          this.handleCalculate(request, args.expression, args.explain);
          break;
        case 'advanced_math':
          this.handleAdvancedMath(request, args.function, args.value);
          break;
        case 'rag_search':
          this.handleRAGSearch(request, args.query, args.detailed);
          break;
        case 'data_analysis':
          this.handleDataAnalysis(request, args.data, args.analysis_type);
          break;
        case 'ai_chatbot_response':
          this.handleAIChatbotResponse(request, args.topic, args.level);
          break;
        default:
          this.sendError(-32602, `Unknown tool: ${name}`, request.id);
      }
    } catch (error) {
      this.logMessage(`도구 호출 오류: ${error.message}`);
      this.sendError(-32603, `처리 오류: ${error.message}`, request.id);
    }
  }

  handleCalculate(request, expression, explain = false) {
    this.logMessage(`🧮 계산 수행: ${expression}`);
    
    try {
      const safeExpression = this.sanitizeExpression(expression);
      const processedExpression = this.processExpression(safeExpression);
      const result = Function(`"use strict"; return (${processedExpression})`)();
      
      let responseText = `🧮 계산 결과: ${expression} = ${result}`;
      
      if (explain) {
        responseText += `\n\n📖 계산 과정:\n`;
        responseText += `1. 입력 표현식: ${expression}\n`;
        responseText += `2. 처리된 표현식: ${processedExpression}\n`;
        responseText += `3. 최종 결과: ${result}\n`;
        
        if (expression.includes('sqrt')) {
          responseText += `4. 제곱근 설명: √${expression.match(/sqrt\(([^)]+)\)/)?.[1]} = ${result}`;
        }
      }
      
      this.sendToolResponse(request, responseText);
      
    } catch (error) {
      throw new Error(`잘못된 수학 표현식: ${expression}`);
    }
  }

  handleRAGSearch(request, query, detailed = true) {
    this.logMessage(`🔍 RAG 검색: ${query}`);
    
    // 유사도 기반 검색 시뮬레이션
    const searchResults = [];
    const queryLower = query.toLowerCase();
    
    for (const [key, value] of this.knowledgeBase) {
      const similarity = this.calculateSimilarity(queryLower, key);
      if (similarity > 0.3) {
        searchResults.push({ key, value, similarity });
      }
    }
    
    searchResults.sort((a, b) => b.similarity - a.similarity);
    const topResult = searchResults[0];
    
    if (!topResult) {
      this.sendToolResponse(request, `🔍 RAG 검색 결과: "${query}"에 대한 정보를 찾을 수 없습니다.`);
      return;
    }
    
    let responseText = `🔍 RAG 검색 결과 (유사도: ${(topResult.similarity * 100).toFixed(1)}%)\n\n`;
    responseText += `📚 주제: ${topResult.key}\n`;
    responseText += `📖 정의: ${topResult.value.definition}\n`;
    
    if (detailed) {
      if (topResult.value.formulas) {
        responseText += `\n🔢 공식/개념:\n${topResult.value.formulas.map(f => `• ${f}`).join('\n')}\n`;
      }
      if (topResult.value.components) {
        responseText += `\n🏗️ 구성요소:\n${topResult.value.components.map(c => `• ${c}`).join('\n')}\n`;
      }
      if (topResult.value.methods) {
        responseText += `\n⚙️ 주요 방법:\n${topResult.value.methods.map(m => `• ${m}`).join('\n')}\n`;
      }
      responseText += `\n🎯 활용분야: ${topResult.value.applications}`;
    }
    
    this.sendToolResponse(request, responseText);
  }

  handleDataAnalysis(request, data, analysisType = 'basic_stats') {
    this.logMessage(`📊 데이터 분석: ${analysisType}, 데이터 크기: ${data.length}`);
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('유효한 데이터 배열이 필요합니다');
    }
    
    let responseText = `📊 데이터 분석 결과 (${analysisType})\n\n`;
    responseText += `📈 데이터 크기: ${data.length}개\n`;
    
    switch (analysisType) {
      case 'basic_stats':
        const stats = this.calculateBasicStats(data);
        responseText += `📊 기본 통계:\n`;
        responseText += `• 평균: ${stats.mean.toFixed(4)}\n`;
        responseText += `• 중앙값: ${stats.median.toFixed(4)}\n`;
        responseText += `• 표준편차: ${stats.stdDev.toFixed(4)}\n`;
        responseText += `• 최솟값: ${stats.min}\n`;
        responseText += `• 최댓값: ${stats.max}\n`;
        responseText += `• 합계: ${stats.sum}\n`;
        break;
        
      case 'distribution':
        const dist = this.analyzeDistribution(data);
        responseText += `📊 분포 분석:\n`;
        responseText += `• 왜도 (Skewness): ${dist.skewness.toFixed(4)}\n`;
        responseText += `• 첨도 (Kurtosis): ${dist.kurtosis.toFixed(4)}\n`;
        responseText += `• Q1 (25%): ${dist.q1.toFixed(4)}\n`;
        responseText += `• Q3 (75%): ${dist.q3.toFixed(4)}\n`;
        break;
        
      default:
        responseText += `분석 유형 "${analysisType}"는 현재 지원되지 않습니다.`;
    }
    
    this.sendToolResponse(request, responseText);
  }

  handleAIChatbotResponse(request, topic, level = 'intermediate') {
    this.logMessage(`🤖 AI 챗봇 응답 생성: ${topic} (${level})`);
    
    // RAG에서 관련 정보 검색
    const searchResults = [];
    const topicLower = topic.toLowerCase();
    
    for (const [key, value] of this.knowledgeBase) {
      const similarity = this.calculateSimilarity(topicLower, key);
      if (similarity > 0.2) {
        searchResults.push({ key, value, similarity });
      }
    }
    
    let responseText = `🤖 AI 수학 튜터의 설명\n\n`;
    responseText += `📚 주제: ${topic}\n`;
    responseText += `🎯 난이도: ${level}\n\n`;
    
    if (searchResults.length > 0) {
      const bestMatch = searchResults[0];
      responseText += `💡 ${bestMatch.key}에 대해 설명해드리겠습니다!\n\n`;
      responseText += `${bestMatch.value.definition}\n\n`;
      
      if (level === 'beginner') {
        responseText += `🔰 초보자를 위한 쉬운 설명:\n`;
        responseText += `이 개념은 일상생활에서도 많이 사용되는 중요한 개념이에요. `;
        responseText += `차근차근 하나씩 배워보시면 어렵지 않습니다!\n\n`;
      } else if (level === 'advanced') {
        responseText += `🎓 고급 설명:\n`;
        if (bestMatch.value.formulas) {
          responseText += `주요 공식들:\n${bestMatch.value.formulas.map(f => `• ${f}`).join('\n')}\n\n`;
        }
      }
      
      responseText += `🎯 실제 활용: ${bestMatch.value.applications}\n\n`;
      responseText += `📝 더 궁금한 점이 있으시면 언제든 물어보세요!`;
    } else {
      responseText += `죄송하지만 "${topic}"에 대한 정보를 찾을 수 없습니다. `;
      responseText += `다른 수학 주제에 대해 물어보시거나, 구체적인 계산 문제를 요청해주세요!`;
    }
    
    this.sendToolResponse(request, responseText);
  }

  calculateBasicStats(data) {
    const sorted = [...data].sort((a, b) => a - b);
    const n = data.length;
    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    
    const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    
    const median = n % 2 === 0 
      ? (sorted[n/2 - 1] + sorted[n/2]) / 2
      : sorted[Math.floor(n/2)];
    
    return {
      mean,
      median,
      stdDev,
      min: Math.min(...data),
      max: Math.max(...data),
      sum
    };
  }

  analyzeDistribution(data) {
    const stats = this.calculateBasicStats(data);
    const n = data.length;
    const sorted = [...data].sort((a, b) => a - b);
    
    // 사분위수 계산
    const q1Index = Math.floor(n * 0.25);
    const q3Index = Math.floor(n * 0.75);
    const q1 = sorted[q1Index];
    const q3 = sorted[q3Index];
    
    // 왜도와 첨도 계산 (단순화된 버전)
    const skewness = data.reduce((acc, val) => 
      acc + Math.pow((val - stats.mean) / stats.stdDev, 3), 0) / n;
    const kurtosis = data.reduce((acc, val) => 
      acc + Math.pow((val - stats.mean) / stats.stdDev, 4), 0) / n - 3;
    
    return { skewness, kurtosis, q1, q3 };
  }

  calculateSimilarity(query, key) {
    const queryWords = query.split(' ');
    const keyWords = key.split(' ');
    
    let matches = 0;
    queryWords.forEach(qWord => {
      keyWords.forEach(kWord => {
        if (kWord.includes(qWord) || qWord.includes(kWord)) {
          matches++;
        }
      });
    });
    
    return matches / Math.max(queryWords.length, keyWords.length);
  }

  handleAdvancedMath(request, func, value) {
    this.logMessage(`🔬 고급 수학 함수 호출: ${func}(${value})`);
    
    let result;
    let explanation = '';
    
    switch (func) {
      case 'sin':
        result = Math.sin(value);
        explanation = `사인 함수는 삼각함수의 하나로, 단위원에서 y좌표값입니다.`;
        break;
      case 'cos':
        result = Math.cos(value);
        explanation = `코사인 함수는 삼각함수의 하나로, 단위원에서 x좌표값입니다.`;
        break;
      case 'derivative':
        // 간단한 도함수 계산 시뮬레이션 (x^2의 도함수는 2x)
        result = 2 * value; // f(x) = x^2라고 가정
        explanation = `f(x) = x²의 도함수 f'(x) = 2x를 계산했습니다.`;
        break;
      case 'integral':
        // 간단한 적분 계산 시뮬레이션
        result = Math.pow(value, 3) / 3; // ∫x²dx = x³/3
        explanation = `∫x²dx = x³/3 공식을 사용했습니다.`;
        break;
      default:
        // 기존 함수들
        switch (func) {
          case 'tan': result = Math.tan(value); break;
          case 'log': result = Math.log10(value); break;
          case 'ln': result = Math.log(value); break;
          case 'sqrt': result = Math.sqrt(value); break;
          case 'abs': result = Math.abs(value); break;
          case 'factorial': result = this.factorial(value); break;
          default:
            throw new Error(`지원하지 않는 함수: ${func}`);
        }
    }

    let responseText = `🔬 고급 수학 계산: ${func}(${value}) = ${result}`;
    if (explanation) {
      responseText += `\n\n📚 설명: ${explanation}`;
    }
    
    this.sendToolResponse(request, responseText);
  }

  sanitizeExpression(expression) {
    const allowed = /^[0-9+\-*/().\s^sqrtabsincostanlg]+$/;
    if (!allowed.test(expression)) {
      throw new Error('허용되지 않은 문자가 포함되어 있습니다');
    }
    return expression.trim();
  }

  processExpression(expression) {
    return expression
      .replace(/\^/g, '**')
      .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
      .replace(/abs\(([^)]+)\)/g, 'Math.abs($1)')
      .replace(/sin\(([^)]+)\)/g, 'Math.sin($1)')
      .replace(/cos\(([^)]+)\)/g, 'Math.cos($1)')
      .replace(/tan\(([^)]+)\)/g, 'Math.tan($1)')
      .replace(/log\(([^)]+)\)/g, 'Math.log10($1)')
      .replace(/ln\(([^)]+)\)/g, 'Math.log($1)');
  }

  factorial(n) {
    if (n < 0 || !Number.isInteger(n)) {
      throw new Error('팩토리얼은 음이 아닌 정수에 대해서만 정의됩니다');
    }
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  sendToolResponse(request, text) {
    const response = {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        content: [
          {
            type: 'text',
            text: text
          }
        ]
      }
    };
    this.sendResponse(response);
  }

  sendResponse(response) {
    const responseStr = JSON.stringify(response);
    process.stdout.write(responseStr + '\n');
    this.logMessage(`📤 응답 전송: ${response.result ? 'success' : 'error'}`);
  }

  sendError(code, message, id) {
    const error = {
      jsonrpc: '2.0',
      id: id,
      error: {
        code: code,
        message: message
      }
    };
    this.sendResponse(error);
    this.logMessage(`❌ 오류 전송: ${message}`);
  }
}

// 예외 처리
process.on('uncaughtException', (error) => {
  process.stderr.write(`Uncaught Exception: ${error.message}\n`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  process.stderr.write(`Unhandled Rejection: ${reason}\n`);
  process.exit(1);
});

// 서버 시작
const server = new AdvancedMCPServer();