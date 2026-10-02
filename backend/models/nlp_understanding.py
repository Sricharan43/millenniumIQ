"""
Transformer NLP Business Idea Understanding Engine.
Uses facebook/bart-large-mnli zero-shot classification.
Falls back to rule-based NLU.
"""
import re, logging
from typing import Dict, Any, List
logger = logging.getLogger(__name__)

_zero_shot = None
def _get_zs():
    global _zero_shot
    if _zero_shot is None:
        try:
            from transformers import pipeline as hfp
            _zero_shot=hfp("zero-shot-classification",model="facebook/bart-large-mnli",multi_label=True)
            logger.info("bart-large-mnli zero-shot pipeline loaded.")
        except Exception as e:
            logger.warning(f"Zero-shot model unavailable: {e}")
            _zero_shot="FALLBACK"
    return _zero_shot

INDUSTRY_LABELS=["Technology / SaaS","EdTech / Education","FinTech / Finance","HealthTech / Healthcare",
    "E-Commerce / Retail","CleanTech / Sustainability","Food & Beverage","Real Estate / PropTech",
    "Media & Entertainment","Logistics / Supply Chain","AgriTech / Agriculture","Manufacturing"]
BIZ_TYPE_LABELS=["B2B SaaS Platform","B2C Mobile App","Marketplace / Two-sided Platform","E-Commerce Store",
    "Professional Services","Hardware / IoT Product","Content / Media Business","FinTech Service","Physical Retail / F&B"]
CUSTOMER_LABELS=["Students / Young Adults","Small & Medium Businesses","Enterprise / Corporate","Freelancers / Solopreneurs",
    "Consumers / General Public","Healthcare Professionals","Farmers / Rural Communities","Developers / Tech Teams"]
TECH_LABELS=["Artificial Intelligence / ML","Blockchain / Web3","Cloud Computing","Mobile / iOS / Android",
    "IoT / Hardware","Big Data / Analytics","Cybersecurity","No significant technology component"]
MODEL_LABELS=["Subscription / SaaS Recurring Revenue","Transaction / Commission Fee","Freemium with paid upgrades",
    "One-time product sale","Advertising / Sponsored content","Consulting / Project-based"]

def _classify(text, labels, top_k=3):
    p=_get_zs()
    if p=="FALLBACK": return []
    try:
        r=p(text[:512],candidate_labels=labels,multi_label=True)
        pairs=sorted(zip(r["labels"],r["scores"]),key=lambda x:-x[1])
        return [{"label":l,"confidence":round(s,3)} for l,s in pairs[:top_k]]
    except Exception as e:
        logger.warning(f"Zero-shot error: {e}"); return []

_STOPWORDS={"a","an","the","and","or","but","in","on","at","to","for","of","with","by","from","is","are",
    "was","were","be","been","i","we","you","he","she","it","they","my","our","that","this","which",
    "want","build","create","make","help","use","can","into","as","than","more","also","about","need","like","get"}

def _keywords(text):
    words=re.findall(r"\b[A-Za-z][a-z]{2,}\b",text)
    seen=set(); kws=[]
    for w in words:
        lw=w.lower()
        if lw not in _STOPWORDS and lw not in seen and len(lw)>3:
            seen.add(lw); kws.append(w)
    return kws[:20]

def _entities(text):
    kws=_keywords(text)
    TECH_KWS={"ai","ml","blockchain","cloud","mobile","iot","api","saas","platform","app","software","data","analytics"}
    MKT_KWS={"market","growth","demand","trend","consumer","customer","user","client","business","startup"}
    PROB_KWS={"problem","challenge","issue","pain","gap","need","difficulty","inefficiency"}
    e={"technologies":[],"markets":[],"problems":[],"other":[]}
    for kw in kws:
        lw=kw.lower()
        if lw in TECH_KWS: e["technologies"].append(kw)
        elif lw in MKT_KWS: e["markets"].append(kw)
        elif lw in PROB_KWS: e["problems"].append(kw)
        else: e["other"].append(kw)
    return e

_HIGH_GROWTH=["ai","machine learning","sustainability","remote work","digital health","fintech","edtech","cloud","automation","web3","creator economy"]

_IND_RULES=[
    (["saas","software","api","platform","tech","ai","ml","data","cloud"],"Technology / SaaS"),
    (["edtech","education","learn","student","course","tutor","university"],"EdTech / Education"),
    (["fintech","finance","payment","loan","bank","invest","credit","insurance"],"FinTech / Finance"),
    (["health","medical","doctor","patient","hospital","wellness"],"HealthTech / Healthcare"),
    (["ecommerce","shop","retail","store","fashion","apparel","marketplace"],"E-Commerce / Retail"),
    (["solar","green","sustainable","renewable","clean","energy"],"CleanTech / Sustainability"),
    (["food","restaurant","coffee","delivery","catering","beverage"],"Food & Beverage"),
    (["logistics","supply","shipping","warehouse","transport","freight"],"Logistics / Supply Chain"),
    (["agri","farm","crop","agriculture","livestock","rural"],"AgriTech / Agriculture"),
]

def _rule_ind(text):
    t=text.lower()
    for kws,label in _IND_RULES:
        if any(k in t for k in kws): return label
    return "Technology / SaaS"

def _rule_bt(text):
    t=text.lower()
    if any(k in t for k in ["marketplace","platform","two-sided","connect"]): return "Marketplace / Two-sided Platform"
    if any(k in t for k in ["b2b","enterprise","corporate"]): return "B2B SaaS Platform"
    if any(k in t for k in ["app","mobile","consumer","user"]): return "B2C Mobile App"
    if any(k in t for k in ["shop","store","ecommerce","sell","retail"]): return "E-Commerce Store"
    return "Professional Services"

def _rule_cust(text):
    t=text.lower()
    if any(k in t for k in ["student","university","school","learn"]): return "Students / Young Adults"
    if any(k in t for k in ["small business","smb","startup","entrepreneur"]): return "Small & Medium Businesses"
    if any(k in t for k in ["enterprise","corporate","b2b"]): return "Enterprise / Corporate"
    return "Consumers / General Public"

def _rule_tech(text):
    t=text.lower()
    if any(k in t for k in ["ai","machine learning","nlp","neural","gpt"]): return "Artificial Intelligence / ML"
    if any(k in t for k in ["blockchain","crypto","web3"]): return "Blockchain / Web3"
    if any(k in t for k in ["iot","hardware","sensor","device"]): return "IoT / Hardware"
    if any(k in t for k in ["mobile","ios","android"]): return "Mobile / iOS / Android"
    return "Cloud Computing"

def _rule_model(text):
    t=text.lower()
    if any(k in t for k in ["subscription","monthly","recurring","saas"]): return "Subscription / SaaS Recurring Revenue"
    if any(k in t for k in ["freemium","free tier","upgrade","premium"]): return "Freemium with paid upgrades"
    if any(k in t for k in ["commission","marketplace","transaction fee"]): return "Transaction / Commission Fee"
    return "One-time product sale"

class BusinessNLPUnderstanding:
    def understand(self, text:str, existing_industry:str="", existing_customers:str="") -> Dict[str,Any]:
        full=f"{existing_industry}. {text}" if existing_industry else text
        if existing_customers: full=f"{full} Targeting: {existing_customers}."
        p=_get_zs(); use=p!="FALLBACK"

        if use:
            ir=_classify(full,INDUSTRY_LABELS,2); industry=ir[0]["label"] if ir else _rule_ind(full); iconf=ir[0]["confidence"] if ir else 0.72
            btr=_classify(full,BIZ_TYPE_LABELS,2); btype=btr[0]["label"] if btr else _rule_bt(full)
            csr=_classify(full,CUSTOMER_LABELS,3); customers=[r["label"] for r in csr] if csr else [_rule_cust(full)]
            tr=_classify(full,TECH_LABELS,3); techs=[r["label"] for r in tr if r["confidence"]>0.25] or [_rule_tech(full)]
            mr=_classify(full,MODEL_LABELS,2); models=[r["label"] for r in mr if r["confidence"]>0.20] or [_rule_model(full)]
        else:
            industry=_rule_ind(full); iconf=0.72; btype=_rule_bt(full)
            customers=[_rule_cust(full)]; techs=[_rule_tech(full)]; models=[_rule_model(full)]

        entities=_entities(text); kws=_keywords(text)[:12]
        signals=[s.title() for s in _HIGH_GROWTH if s in full.lower()]
        problem=""
        for sent in re.split(r"[.!?]",text):
            if any(w in sent.lower() for w in ["problem","challenge","help","solve","need","gap","difficult"]):
                problem=sent.strip(); break
        if not problem: problem=f"Address unmet needs in the {industry} market"

        return {
            "extracted_industry":industry,"industry_confidence":round(iconf,3),
            "business_type":btype,"target_customers":customers,
            "technologies_identified":techs,"business_models":models,
            "problem_statement":problem,"key_entities":entities,
            "opportunity_keywords":kws,"market_growth_signals":signals,
            "model_used":"bart-large-mnli (zero-shot)" if use else "Rule-based NLU fallback",
        }
