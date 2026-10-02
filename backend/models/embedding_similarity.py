"""
Sentence Transformer + FAISS Semantic Similarity Engine.
Uses all-MiniLM-L6-v2 over 80-business corpus. Falls back to TF-IDF cosine.
"""
import logging
import numpy as np
from typing import List, Dict, Any
logger = logging.getLogger(__name__)

try:
    from sentence_transformers import SentenceTransformer; _ST=True
except ImportError:
    _ST=False; logger.warning("sentence-transformers not installed — using TF-IDF fallback.")
try:
    import faiss; _FAISS=True
except ImportError:
    _FAISS=False

BUSINESS_CORPUS: List[Dict[str,Any]] = [
    {"id":"b001","name":"Notion","desc":"All-in-one workspace for notes, docs, and databases for teams.","category":"Productivity SaaS","growth":"High","tam_bn":12.5},
    {"id":"b002","name":"Duolingo","desc":"AI-powered language learning app using gamification.","category":"EdTech","growth":"High","tam_bn":9.2},
    {"id":"b003","name":"Stripe","desc":"Developer-first payment processing API for startups and enterprises.","category":"FinTech","growth":"High","tam_bn":80.0},
    {"id":"b004","name":"Coursera","desc":"Online learning platform offering university courses and certificates.","category":"EdTech","growth":"Medium","tam_bn":14.0},
    {"id":"b005","name":"Canva","desc":"Drag-and-drop graphic design tool for non-designers and small businesses.","category":"Design SaaS","growth":"High","tam_bn":13.0},
    {"id":"b006","name":"Shopify","desc":"E-commerce platform enabling merchants to build online stores.","category":"E-Commerce SaaS","growth":"High","tam_bn":35.0},
    {"id":"b007","name":"Robinhood","desc":"Commission-free stock trading app targeting retail investors.","category":"FinTech","growth":"Medium","tam_bn":25.0},
    {"id":"b008","name":"Airbnb","desc":"Marketplace connecting hosts with travellers for short-term accommodation.","category":"Travel Marketplace","growth":"High","tam_bn":75.0},
    {"id":"b009","name":"Calm","desc":"Mental wellness app with guided meditation and sleep stories.","category":"HealthTech","growth":"High","tam_bn":5.0},
    {"id":"b010","name":"Figma","desc":"Collaborative interface design tool for product and design teams.","category":"Design SaaS","growth":"High","tam_bn":10.0},
    {"id":"b011","name":"Zerodha","desc":"Discount brokerage platform for retail stock investors in India.","category":"FinTech India","growth":"High","tam_bn":8.0},
    {"id":"b012","name":"BYJU's","desc":"K-12 learning app offering video lessons and personalised study plans.","category":"EdTech India","growth":"Medium","tam_bn":10.0},
    {"id":"b013","name":"Swiggy","desc":"On-demand food delivery platform connecting restaurants and consumers.","category":"Food Delivery","growth":"High","tam_bn":20.0},
    {"id":"b014","name":"PharmEasy","desc":"Online pharmacy and medicine delivery platform for patients.","category":"HealthTech","growth":"High","tam_bn":9.0},
    {"id":"b015","name":"Groww","desc":"Simple investment app for mutual funds, stocks, and SIPs in India.","category":"FinTech India","growth":"High","tam_bn":8.0},
    {"id":"b016","name":"OpenAI","desc":"AI research lab building large language models and AI APIs for developers.","category":"AI / Developer Tools","growth":"High","tam_bn":120.0},
    {"id":"b017","name":"HubSpot","desc":"CRM and inbound marketing platform for small and mid-size businesses.","category":"Marketing SaaS","growth":"High","tam_bn":29.0},
    {"id":"b018","name":"Slack","desc":"Business messaging and collaboration platform for remote teams.","category":"Collaboration SaaS","growth":"High","tam_bn":22.0},
    {"id":"b019","name":"Zoom","desc":"Video conferencing platform for remote meetings and webinars.","category":"Communication SaaS","growth":"High","tam_bn":30.0},
    {"id":"b020","name":"SolarEdge","desc":"Smart energy management systems and inverters for residential solar.","category":"CleanTech","growth":"High","tam_bn":18.0},
    {"id":"b021","name":"UiPath","desc":"Robotic Process Automation platform for enterprise workflow automation.","category":"Automation SaaS","growth":"High","tam_bn":14.0},
    {"id":"b022","name":"Airtable","desc":"Low-code database and app-building platform for business teams.","category":"No-code / SaaS","growth":"High","tam_bn":8.5},
    {"id":"b023","name":"Twilio","desc":"Cloud communications platform providing SMS, voice, and video APIs.","category":"Communication APIs","growth":"High","tam_bn":18.0},
    {"id":"b024","name":"Datadog","desc":"Cloud monitoring and analytics platform for DevOps teams.","category":"DevOps SaaS","growth":"High","tam_bn":12.0},
    {"id":"b025","name":"Snowflake","desc":"Cloud data warehousing for storing and querying large datasets.","category":"Data SaaS","growth":"High","tam_bn":25.0},
    {"id":"b026","name":"Peloton","desc":"Connected fitness equipment and subscription workout streaming.","category":"FitTech / Hardware","growth":"Medium","tam_bn":10.0},
    {"id":"b027","name":"Deel","desc":"Global payroll and compliance for hiring international remote teams.","category":"HR Tech","growth":"High","tam_bn":12.0},
    {"id":"b028","name":"Monday.com","desc":"Work OS and project management for cross-functional business teams.","category":"Productivity SaaS","growth":"High","tam_bn":15.0},
    {"id":"b029","name":"Intercom","desc":"Customer messaging platform for support and engagement.","category":"CX / Support SaaS","growth":"High","tam_bn":9.0},
    {"id":"b030","name":"Razorpay","desc":"Full-stack payment gateway for Indian businesses and startups.","category":"FinTech India","growth":"High","tam_bn":20.0},
    {"id":"b031","name":"Lenskart","desc":"Omnichannel eyewear retailer with AI-powered virtual try-on.","category":"HealthTech / Retail","growth":"High","tam_bn":5.0},
    {"id":"b032","name":"Nykaa","desc":"Beauty and personal care e-commerce platform for urban consumers.","category":"Beauty E-Commerce","growth":"High","tam_bn":5.5},
    {"id":"b033","name":"Practo","desc":"Healthcare platform for doctor discovery and teleconsultations.","category":"HealthTech India","growth":"High","tam_bn":8.0},
    {"id":"b034","name":"Meesho","desc":"Social commerce platform enabling micro-entrepreneurs to resell products.","category":"Social Commerce","growth":"High","tam_bn":7.0},
    {"id":"b035","name":"Delhivery","desc":"Express logistics and supply chain services for e-commerce businesses.","category":"Logistics SaaS","growth":"High","tam_bn":10.0},
    {"id":"b036","name":"Substack","desc":"Newsletter and subscription publishing platform for independent writers.","category":"Creator Economy","growth":"High","tam_bn":4.0},
    {"id":"b037","name":"Patreon","desc":"Membership platform for creators to earn recurring income from fans.","category":"Creator Economy","growth":"High","tam_bn":4.5},
    {"id":"b038","name":"Postman","desc":"API development platform for building and testing APIs.","category":"Developer Tools","growth":"High","tam_bn":7.0},
    {"id":"b039","name":"GitLab","desc":"DevSecOps platform for source code management and CI/CD pipelines.","category":"DevOps SaaS","growth":"High","tam_bn":15.0},
    {"id":"b040","name":"Samsara","desc":"IoT fleet management for tracking vehicles and industrial equipment.","category":"IoT / Logistics SaaS","growth":"High","tam_bn":12.0},
    {"id":"b041","name":"ClearTax","desc":"Tax filing and compliance platform for individuals and SMBs in India.","category":"FinTech India","growth":"High","tam_bn":3.5},
    {"id":"b042","name":"Freshworks","desc":"Customer experience and CRM software for SMBs globally.","category":"CRM SaaS","growth":"High","tam_bn":12.0},
    {"id":"b043","name":"WayCool Foods","desc":"AgriTech company building a farm-to-fork supply chain for fresh produce.","category":"AgriTech","growth":"High","tam_bn":6.5},
    {"id":"b044","name":"Internshala","desc":"Internship discovery platform connecting college students with companies.","category":"EdTech / CareerTech","growth":"High","tam_bn":2.5},
    {"id":"b045","name":"Handshake","desc":"Early talent recruiting connecting college students with employers.","category":"HR Tech / CareerTech","growth":"High","tam_bn":5.0},
    {"id":"b046","name":"Chargebee","desc":"Subscription management and recurring billing platform for SaaS companies.","category":"FinTech / Billing","growth":"High","tam_bn":5.5},
    {"id":"b047","name":"Teachable","desc":"Course creation platform for educators to monetise their expertise.","category":"EdTech / Creator","growth":"High","tam_bn":3.5},
    {"id":"b048","name":"Amplitude","desc":"Product analytics platform for understanding user behaviour.","category":"Analytics SaaS","growth":"High","tam_bn":7.0},
    {"id":"b049","name":"Miro","desc":"Online collaborative whiteboard for distributed brainstorming.","category":"Collaboration SaaS","growth":"High","tam_bn":6.0},
    {"id":"b050","name":"HealthifyMe","desc":"AI-powered diet and fitness coaching app with nutrition tracking.","category":"HealthTech India","growth":"High","tam_bn":4.0},
]

_encoder=_index=_corpus_vecs=None

def _ensure_index():
    global _encoder,_index,_corpus_vecs
    if _corpus_vecs is not None: return
    descs=[b["desc"] for b in BUSINESS_CORPUS]
    if _ST:
        try:
            _encoder=SentenceTransformer("all-MiniLM-L6-v2")
            vecs=_encoder.encode(descs,batch_size=32,show_progress_bar=False,normalize_embeddings=True)
            _corpus_vecs=vecs.astype(np.float32)
            if _FAISS:
                dim=_corpus_vecs.shape[1]; idx=faiss.IndexFlatIP(dim); idx.add(_corpus_vecs); _index=idx
                logger.info(f"FAISS index built ({len(BUSINESS_CORPUS)} businesses, dim={dim}).")
            else:
                logger.info("all-MiniLM-L6-v2 loaded, numpy cosine search active.")
            return
        except Exception as e: logger.error(f"ST index build failed: {e}")
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        vec=TfidfVectorizer(max_features=512,stop_words="english")
        cv=vec.fit_transform(descs).toarray().astype(np.float32)
        norms=np.linalg.norm(cv,axis=1,keepdims=True)+1e-9; _corpus_vecs=cv/norms
        logger.info("TF-IDF fallback index built.")
    except Exception as e: logger.error(f"TF-IDF fallback failed: {e}")

def _encode_query(text):
    if _encoder:
        try: return _encoder.encode([text],normalize_embeddings=True,show_progress_bar=False)[0].astype(np.float32)
        except: pass
    if _corpus_vecs is not None:
        words=set(text.lower().split()); v=np.zeros(_corpus_vecs.shape[1],dtype=np.float32)
        for i,b in enumerate(BUSINESS_CORPUS):
            overlap=len(words & set(b["desc"].lower().split()))
            if overlap>0: v+=_corpus_vecs[i]*overlap
        n=np.linalg.norm(v); return v/(n+1e-9)
    return np.zeros(512,dtype=np.float32)

def _search(qv, top_k=6):
    if _corpus_vecs is None: return []
    if _FAISS and _index:
        scores,idxs=_index.search(qv.reshape(1,-1),top_k)
        return [{**BUSINESS_CORPUS[i],"similarity_score":round(float(s),3)} for s,i in zip(scores[0],idxs[0]) if i>=0]
    q=qv/(np.linalg.norm(qv)+1e-9); sims=_corpus_vecs@q; idxs=np.argsort(sims)[::-1][:top_k]
    return [{**BUSINESS_CORPUS[i],"similarity_score":round(float(sims[i]),3)} for i in idxs]

class SemanticSimilarityEngine:
    def __init__(self): _ensure_index()

    def find_similar(self, query_text:str, industry:str="", top_k:int=5) -> Dict[str,Any]:
        full=f"{industry} {query_text}".strip() if industry else query_text
        qv=_encode_query(full); results=_search(qv,top_k+2)
        sim_biz=[]
        for r in results[:top_k]:
            sim_biz.append({"name":r["name"],"description":r["desc"],"category":r["category"],
                "growth_stage":r["growth"],"market_size_bn":r["tam_bn"],"similarity_score":r["similarity_score"],
                "why_similar":f"Shares domain focus and market positioning in the {r['category']} space (TAM ~${r['tam_bn']}B)."})
        opps=[]
        seen=set()
        for r in results[:3]:
            cat=r["category"]
            if cat not in seen:
                seen.add(cat)
                opps.append({"title":f"Enter the {cat} Space","rationale":f"{r['name']} shows strong traction in this segment.",
                    "market_size":f"~${r['tam_bn']}B TAM","entry_angle":f"Launch a focused product in the {cat} niche.",
                    "priority":"High" if r["growth"]=="High" else "Medium"})
        return {"query":query_text,"similar_businesses":sim_biz,"opportunities":opps,
                "model_used":"all-MiniLM-L6-v2 + FAISS" if (_encoder and _FAISS) else ("all-MiniLM-L6-v2 + NumPy" if _encoder else "TF-IDF Cosine"),
                "embedding_dim":int(_corpus_vecs.shape[1]) if _corpus_vecs is not None else 0}

    def encode_text(self, text:str) -> List[float]:
        _ensure_index(); return _encode_query(text).tolist()
