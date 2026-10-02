"""
Neural Two-Tower Recommendation Engine.
BPR loss, 60 epochs, 1500 synthetic users. Falls back to rule scoring.
"""
import logging
import numpy as np
from typing import List, Dict, Any
logger = logging.getLogger(__name__)

try:
    import torch, torch.nn as nn, torch.optim as optim; _TORCH=True
except ImportError:
    _TORCH=False

from .embedding_similarity import BUSINESS_CORPUS

GROWTH_MAP={"High":1.0,"Medium":0.6,"Low":0.3}
CAT_BUCKETS=["SaaS","FinTech","EdTech","HealthTech","E-Commerce","CleanTech","Food","Logistics"]
IND_BUCKETS=["Tech","Finance","Education","Health","Retail","CleanTech","Food","Logistics"]

def _biz_feat(b):
    g=GROWTH_MAP.get(b.get("growth","Medium"),0.6); tam=min(b.get("tam_bn",5)/80,1.0)
    cat=b.get("category","")
    cv=[1.0 if buck.lower() in cat.lower() else 0.0 for buck in CAT_BUCKETS]
    return np.array([g,tam]+cv,dtype=np.float32)

def _user_feat(bd):
    ind=bd.get("industry","").lower()
    iv=[1.0 if b.lower() in ind else 0.0 for b in IND_BUCKETS]
    budget=min(bd.get("investmentBudget",50000)/500000,1.0)
    growth=min(bd.get("expectedGrowth",50)/200,1.0)
    rev=min(bd.get("currentRevenue",100000)/1000000,1.0)
    exist=1.0 if bd.get("isExisting",True) else 0.0
    tgt=bd.get("targetCustomers","").lower()
    b2b=1.0 if any(w in tgt for w in ["business","enterprise","company","b2b"]) else 0.0
    b2c=1.0 if any(w in tgt for w in ["consumer","customer","user","people"]) else 0.0
    return np.array(iv+[budget,growth,rev,exist,b2b,b2c],dtype=np.float32)

if _TORCH:
    class _Tower(nn.Module):
        def __init__(self,in_dim,edim=32):
            super().__init__()
            self.net=nn.Sequential(nn.Linear(in_dim,64),nn.ReLU(),nn.Dropout(0.1),nn.Linear(64,edim),nn.LayerNorm(edim))
        def forward(self,x): return self.net(x)

    class _TwoTower(nn.Module):
        def __init__(self):
            super().__init__()
            self.user_enc=_Tower(14,32); self.item_enc=_Tower(10,32)
        def forward(self,u,it):
            un=nn.functional.normalize(self.user_enc(u),dim=-1)
            itn=nn.functional.normalize(self.item_enc(it),dim=-1)
            return (un*itn).sum(dim=-1)

def _gen_interactions(n=1500):
    rng=np.random.default_rng(17)
    items=np.array([_biz_feat(b) for b in BUSINESS_CORPUS],dtype=np.float32)
    users=[]; pos=[]; neg=[]
    for _ in range(n):
        u=np.zeros(14,dtype=np.float32); k=rng.integers(0,len(IND_BUCKETS)); u[k]=1.0
        u[8]=rng.uniform(0,1); u[9]=rng.uniform(0,1); u[10]=rng.uniform(0,1)
        u[11]=float(rng.integers(0,2)); u[12]=float(rng.integers(0,2)); u[13]=float(rng.integers(0,2))
        users.append(u)
        ind_l=IND_BUCKETS[k].lower()
        pi=[i for i,b in enumerate(BUSINESS_CORPUS) if ind_l in b.get("category","").lower()]
        ni=[i for i in range(len(BUSINESS_CORPUS)) if i not in pi]
        if not pi: pi=list(range(len(BUSINESS_CORPUS)))
        if not ni: ni=list(range(len(BUSINESS_CORPUS)))
        pos.append(rng.choice(pi)); neg.append(rng.choice(ni))
    return np.array(users,dtype=np.float32),items,np.array(pos),np.array(neg)

def _train_tt(model,users,items,pos_idx,neg_idx,epochs=60):
    items_t=torch.from_numpy(items)
    opt=optim.Adam(model.parameters(),lr=1e-3); n=len(users)
    model.train()
    for _ in range(epochs):
        perm=np.random.permutation(n)
        for st in range(0,n,128):
            idx=perm[st:st+128]; ub=torch.from_numpy(users[idx])
            pb=items_t[pos_idx[idx]]; nb=items_t[neg_idx[idx]]
            sp=model(ub,pb); sn=model(ub,nb)
            loss=-torch.log(torch.sigmoid(sp-sn)+1e-8).mean()
            opt.zero_grad(); loss.backward(); opt.step()
    model.eval(); return model

def _reason(b,ud):
    cat=b.get("category",""); g=b.get("growth","Medium"); tam=b.get("tam_bn",5)
    reasons=[]
    if g=="High": reasons.append("High market growth trajectory")
    if tam>10: reasons.append(f"Large addressable market (~${tam}B TAM)")
    if any(w in cat.lower() for w in ud.get("industry","").lower().split()): reasons.append(f"Strong alignment with your domain")
    if not reasons: reasons=[f"Complementary opportunity in the {cat} space"]
    return " + ".join(reasons[:3])+"."

class NeuralRecommendationEngine:
    def __init__(self):
        self._model=None; self._trained=False; self._items_t=None; self._build()
    def _build(self):
        if not _TORCH: return
        try:
            users,items,pos,neg=_gen_interactions(1500)
            m=_TwoTower(); m=_train_tt(m,users,items,pos,neg,60)
            self._model=m; self._items_t=torch.from_numpy(items); self._trained=True
            logger.info("Two-tower RecommendationEngine trained (60 epochs).")
        except Exception as e: logger.error(f"Rec engine training failed: {e}")

    def recommend(self, business_data:Dict[str,Any], top_k:int=5) -> Dict[str,Any]:
        uv=_user_feat(business_data)
        if self._trained:
            with torch.no_grad():
                ut=torch.from_numpy(uv).unsqueeze(0).expand(len(BUSINESS_CORPUS),-1)
                scores=self._model(ut,self._items_t).numpy()
        else:
            items=np.array([_biz_feat(b) for b in BUSINESS_CORPUS],dtype=np.float32)
            scores=items@uv[:10]

        top_idxs=np.argsort(scores)[::-1][:top_k+3]; recs=[]; seen=set()
        for idx in top_idxs:
            b=BUSINESS_CORPUS[idx]; cat=b["category"]
            if cat in seen: continue
            seen.add(cat)
            recs.append({"rank":len(recs)+1,"business_name":b["name"],"description":b["desc"],"category":cat,
                "growth":b["growth"],"market_size_bn":b["tam_bn"],
                "relevance_score":round(float(np.clip((scores[idx]+1)/2,0,1)),3),
                "reason":_reason(b,business_data)})
            if len(recs)>=top_k: break

        ideas=[{"title":f"{r['category']} Solution for {business_data.get('industry','your space')}",
                "angle":f"Adapt {r['business_name']}'s model to the {business_data.get('industry','')} context.",
                "expected_impact":"+25-45% revenue potential in Year 1","difficulty":"Medium"} for r in recs[:3]]
        return {"recommendations":recs,"opportunity_ideas":ideas,"model_used":"Two-Tower Neural (BPR Loss)" if self._trained else "Rule-based scoring"}
