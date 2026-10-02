"""
Real HuggingFace DistilBERT Transformer Sentiment Analyzer.
Falls back to rule-based scoring if model unavailable.
"""
import re
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)
_pipeline = None

def _get_pipeline():
    global _pipeline
    if _pipeline is None:
        try:
            from transformers import pipeline as hf_pipeline
            _pipeline = hf_pipeline(
                "sentiment-analysis",
                model="distilbert-base-uncased-finetuned-sst-2-english",
                truncation=True, max_length=512,
            )
            logger.info("DistilBERT sentiment pipeline loaded.")
        except Exception as e:
            logger.warning(f"Could not load DistilBERT: {e}. Using rule-based fallback.")
            _pipeline = "FALLBACK"
    return _pipeline

_TOPIC_KEYWORDS = {
    "Product Quality":      ["quality","product","build","material","durable","design","feature","performance"],
    "Pricing & Value":      ["price","cost","expensive","cheap","value","worth","affordable","overpriced"],
    "Customer Support":     ["support","service","help","team","staff","response","agent","assist"],
    "Delivery & Logistics": ["delivery","shipping","ship","fast","slow","arrived","package","courier"],
}
_POS = {"great","love","fast","awesome","excellent","best","good","helpful","easy","amazing",
        "outstanding","fantastic","superb","happy","satisfied","perfect","wonderful","brilliant","reliable"}
_NEG = {"slow","expensive","bad","terrible","broken","worst","fail","poor","bug","awful",
        "horrible","disappointed","late","wrong","useless","frustrating","annoying","overpriced"}

def _topic_scores(text: str) -> Dict[str, int]:
    pipe = _get_pipeline()
    scores: Dict[str, int] = {}
    for topic, keywords in _TOPIC_KEYWORDS.items():
        sentences = re.split(r'[.!?,;]', text)
        relevant  = [s for s in sentences if any(kw in s.lower() for kw in keywords)]
        if not relevant:
            scores[topic] = 72; continue
        snippet = " ".join(relevant)[:256]
        if pipe != "FALLBACK":
            try:
                r = pipe(snippet)[0]
                scores[topic] = int(50 + r["score"]*48) if r["label"]=="POSITIVE" else int(50 - r["score"]*45)
                continue
            except Exception: pass
        pos = sum(1 for w in _POS if w in snippet.lower())
        neg = sum(1 for w in _NEG if w in snippet.lower())
        scores[topic] = max(10, min(98, 70 + pos*5 - neg*8))
    return scores

class TransformerSentimentAnalyzer:
    def analyze_feedback(self, text: str) -> Dict[str, Any]:
        pipe = _get_pipeline()
        sentiment = overall_score = positive_conf = None
        used_model = ""
        if pipe != "FALLBACK":
            try:
                r = pipe(text[:512])[0]
                label, conf = r["label"], r["score"]
                if label == "POSITIVE":
                    sentiment, overall_score = "Positive", round(50 + conf*48, 1)
                    positive_conf = conf
                else:
                    sentiment, overall_score = "Negative", round(50 - conf*45, 1)
                    positive_conf = round(1 - conf, 3)
                used_model = "DistilBERT (distilbert-base-uncased-finetuned-sst-2-english)"
            except Exception as e:
                logger.warning(f"Inference error: {e}")
                pipe = "FALLBACK"
        if pipe == "FALLBACK":
            t = text.lower()
            pos_c = sum(1 for w in _POS if w in t)
            neg_c = sum(1 for w in _NEG if w in t)
            if pos_c > neg_c:
                sentiment, overall_score, positive_conf = "Positive", round(70+pos_c*4,1), round(0.70+pos_c*0.04,3)
            elif neg_c > pos_c:
                sentiment, overall_score, positive_conf = "Negative", round(35-neg_c*5,1), round(0.35-neg_c*0.05,3)
            else:
                sentiment, overall_score, positive_conf = "Neutral", 50.0, 0.5
            overall_score = max(5.0, min(98.0, overall_score))
            positive_conf = max(0.05, min(0.98, positive_conf))
            used_model = "Rule-based fallback"
        topic_scores = _topic_scores(text)
        sorted_t = sorted(topic_scores.items(), key=lambda x: x[1], reverse=True)
        return {
            "sentiment": sentiment,
            "overall_sentiment_score": min(98.0, max(5.0, overall_score)),
            "positive_confidence": positive_conf,
            "topic_ratings": topic_scores,
            "key_drivers": {
                "positive_highlights": [f"{k} rated highly ({v}/100)" for k,v in sorted_t[:2]],
                "negative_friction": [f"{k} needs attention ({v}/100)" for k,v in sorted_t[-2:] if v<65] or ["No friction detected"],
            },
            "model_architecture": used_model,
        }
