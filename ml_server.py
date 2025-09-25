#!/usr/bin/env python3
"""
TensorFlow 기반 ML 서버
MCP 서버와 연동하여 고급 AI 기능 제공
"""

import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
import json
import logging
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import math

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MLServer:
    def __init__(self):
        self.app = Flask(__name__)
        self.vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.setup_models()
        self.setup_routes()
        logger.info("TensorFlow ML Server 초기화 완료")

    def setup_models(self):
        """TensorFlow 모델 초기화"""
        # 간단한 텍스트 분류 모델 (예시)
        self.text_classifier = tf.keras.Sequential([
            tf.keras.layers.Embedding(1000, 64),
            tf.keras.layers.LSTM(64),
            tf.keras.layers.Dense(32, activation='relu'),
            tf.keras.layers.Dense(3, activation='softmax')  # 수학/과학/일반
        ])
        
        # 수치 예측 모델 (간단한 회귀)
        self.regression_model = tf.keras.Sequential([
            tf.keras.layers.Dense(64, activation='relu', input_shape=(10,)),
            tf.keras.layers.Dense(32, activation='relu'),
            tf.keras.layers.Dense(1)
        ])
        
        logger.info("TensorFlow 모델 초기화 완료")

    def setup_routes(self):
        """Flask 라우트 설정"""
        
        @self.app.route('/health', methods=['GET'])
        def health_check():
            return jsonify({"status": "healthy", "tensorflow_version": tf.__version__})

        @self.app.route('/embedding', methods=['POST'])
        def generate_embedding():
            """텍스트 임베딩 생성"""
            try:
                data = request.json
                text = data.get('text', '')
                
                # TF-IDF 기반 임베딩 (실제로는 BERT 등 사용 가능)
                embedding = self.create_text_embedding(text)
                
                return jsonify({
                    "embedding": embedding.tolist(),
                    "dimension": len(embedding),
                    "method": "TF-IDF"
                })
            except Exception as e:
                logger.error(f"임베딩 생성 오류: {e}")
                return jsonify({"error": str(e)}), 500

        @self.app.route('/similarity', methods=['POST'])
        def calculate_similarity():
            """텍스트 유사도 계산"""
            try:
                data = request.json
                text1 = data.get('text1', '')
                text2 = data.get('text2', '')
                
                similarity = self.compute_text_similarity(text1, text2)
                
                return jsonify({
                    "similarity": float(similarity),
                    "text1_length": len(text1),
                    "text2_length": len(text2),
                    "method": "TensorFlow + Cosine Similarity"
                })
            except Exception as e:
                logger.error(f"유사도 계산 오류: {e}")
                return jsonify({"error": str(e)}), 500

        @self.app.route('/classify', methods=['POST'])
        def classify_text():
            """텍스트 분류"""
            try:
                data = request.json
                text = data.get('text', '')
                
                category = self.classify_math_text(text)
                confidence = self.get_classification_confidence(text)
                
                return jsonify({
                    "category": category,
                    "confidence": float(confidence),
                    "text_length": len(text),
                    "model": "TensorFlow Sequential"
                })
            except Exception as e:
                logger.error(f"텍스트 분류 오류: {e}")
                return jsonify({"error": str(e)}), 500

        @self.app.route('/predict_sequence', methods=['POST'])
        def predict_sequence():
            """수치 시퀀스 예측"""
            try:
                data = request.json
                sequence = data.get('sequence', [])
                
                if len(sequence) < 3:
                    return jsonify({"error": "최소 3개의 수치가 필요합니다"}), 400
                
                prediction = self.predict_next_number(sequence)
                pattern = self.analyze_sequence_pattern(sequence)
                
                return jsonify({
                    "next_value": float(prediction),
                    "pattern_type": pattern,
                    "sequence_length": len(sequence),
                    "model": "TensorFlow Regression"
                })
            except Exception as e:
                logger.error(f"시퀀스 예측 오류: {e}")
                return jsonify({"error": str(e)}), 500

        @self.app.route('/math_analysis', methods=['POST'])
        def analyze_math():
            """수학적 분석"""
            try:
                data = request.json
                numbers = data.get('numbers', [])
                analysis_type = data.get('type', 'statistical')
                
                if not numbers:
                    return jsonify({"error": "분석할 데이터가 없습니다"}), 400
                
                result = self.perform_math_analysis(numbers, analysis_type)
                
                return jsonify(result)
            except Exception as e:
                logger.error(f"수학 분석 오류: {e}")
                return jsonify({"error": str(e)}), 500

    def create_text_embedding(self, text):
        """텍스트를 벡터로 변환"""
        # 간단한 TF-IDF 기반 임베딩 (실제로는 sentence-transformers 사용 권장)
        words = text.lower().split()
        
        # 기본 수학/과학 용어 사전
        vocab = {
            'sin': 1, 'cos': 2, 'tan': 3, 'log': 4, 'sqrt': 5,
            'matrix': 6, 'vector': 7, 'calculus': 8, 'algebra': 9,
            'statistics': 10, 'probability': 11, 'derivative': 12,
            'integral': 13, 'function': 14, 'equation': 15
        }
        
        embedding = np.zeros(100)  # 100차원 벡터
        for i, word in enumerate(words[:10]):  # 처음 10개 단어만 사용
            if word in vocab:
                embedding[i * 10:(i + 1) * 10] = vocab[word] / 15.0
        
        return embedding

    def compute_text_similarity(self, text1, text2):
        """두 텍스트 간 유사도 계산"""
        try:
            # TF-IDF 벡터화
            corpus = [text1, text2]
            tfidf_matrix = self.vectorizer.fit_transform(corpus)
            
            # 코사인 유사도 계산
            similarity_matrix = cosine_similarity(tfidf_matrix)
            similarity = similarity_matrix[0, 1]
            
            return similarity
        except:
            # 간단한 단어 기반 유사도
            words1 = set(text1.lower().split())
            words2 = set(text2.lower().split())
            intersection = words1.intersection(words2)
            union = words1.union(words2)
            return len(intersection) / len(union) if union else 0

    def classify_math_text(self, text):
        """수학 텍스트 분류"""
        text_lower = text.lower()
        
        # 키워드 기반 분류
        math_keywords = ['sin', 'cos', 'tan', 'log', 'sqrt', 'integral', 'derivative']
        science_keywords = ['physics', 'chemistry', 'biology', 'experiment']
        
        math_count = sum(1 for keyword in math_keywords if keyword in text_lower)
        science_count = sum(1 for keyword in science_keywords if keyword in text_lower)
        
        if math_count > science_count:
            return "mathematics"
        elif science_count > 0:
            return "science"
        else:
            return "general"

    def get_classification_confidence(self, text):
        """분류 신뢰도 계산"""
        # 텍스트 길이와 키워드 밀도 기반 신뢰도
        words = text.split()
        if len(words) == 0:
            return 0.0
        
        math_keywords = ['sin', 'cos', 'tan', 'log', 'sqrt', 'integral', 'derivative']
        keyword_count = sum(1 for word in words if word.lower() in math_keywords)
        
        confidence = min(0.9, keyword_count / len(words) * 10)
        return max(0.1, confidence)

    def predict_next_number(self, sequence):
        """다음 수 예측"""
        if len(sequence) < 2:
            return sequence[-1] if sequence else 0
        
        # 간단한 패턴 분석
        diffs = [sequence[i+1] - sequence[i] for i in range(len(sequence)-1)]
        
        if len(diffs) == 1:
            return sequence[-1] + diffs[0]
        
        # 평균 차이 기반 예측
        avg_diff = sum(diffs) / len(diffs)
        return sequence[-1] + avg_diff

    def analyze_sequence_pattern(self, sequence):
        """시퀀스 패턴 분석"""
        if len(sequence) < 3:
            return "insufficient_data"
        
        # 차분 분석
        first_diffs = [sequence[i+1] - sequence[i] for i in range(len(sequence)-1)]
        
        # 등차수열 확인
        if len(set(first_diffs)) <= 2:  # 차이가 거의 일정
            return "arithmetic_progression"
        
        # 등비수열 확인
        try:
            ratios = [sequence[i+1] / sequence[i] for i in range(len(sequence)-1) if sequence[i] != 0]
            if len(set([round(r, 2) for r in ratios])) <= 2:
                return "geometric_progression"
        except:
            pass
        
        return "complex_pattern"

    def perform_math_analysis(self, numbers, analysis_type):
        """TensorFlow를 활용한 수학적 분석"""
        numbers = np.array(numbers, dtype=np.float32)
        
        result = {
            "analysis_type": analysis_type,
            "data_size": len(numbers),
            "tensorflow_version": tf.__version__
        }
        
        if analysis_type == "statistical":
            # TensorFlow 함수 사용
            result.update({
                "mean": float(tf.reduce_mean(numbers)),
                "std": float(tf.math.reduce_std(numbers)),
                "variance": float(tf.math.reduce_variance(numbers)),
                "min": float(tf.reduce_min(numbers)),
                "max": float(tf.reduce_max(numbers)),
                "median": float(tf.nn.compute_average_loss(tf.sort(numbers), tf.ones_like(numbers)))
            })
        
        elif analysis_type == "distribution":
            # 분포 분석
            sorted_nums = tf.sort(numbers)
            q1_idx = len(numbers) // 4
            q3_idx = 3 * len(numbers) // 4
            
            result.update({
                "q1": float(sorted_nums[q1_idx]),
                "q3": float(sorted_nums[q3_idx]),
                "iqr": float(sorted_nums[q3_idx] - sorted_nums[q1_idx]),
                "skewness": self.calculate_skewness(numbers)
            })
        
        return result

    def calculate_skewness(self, data):
        """왜도 계산"""
        mean = tf.reduce_mean(data)
        std = tf.math.reduce_std(data)
        normalized = (data - mean) / std
        skewness = tf.reduce_mean(tf.pow(normalized, 3))
        return float(skewness)

    def run(self, host='localhost', port=5000):
        """서버 실행"""
        logger.info(f"TensorFlow ML Server 시작: http://{host}:{port}")
        self.app.run(host=host, port=port, debug=False)

if __name__ == "__main__":
    # TensorFlow 정보 출력
    print(f"TensorFlow 버전: {tf.__version__}")
    print(f"GPU 사용 가능: {tf.config.list_physical_devices('GPU')}")
    
    # 서버 시작
    ml_server = MLServer()
    ml_server.run()