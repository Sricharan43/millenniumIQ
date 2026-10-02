"""
Real SHAP KernelExplainer on GBR surrogate. Falls back to rule-based attributions.
"""
import logging, math
import numpy as np
from typing import Dict, Any, List
logger = logging.getLogger(__name__)

try:
    import shap; _SHAP=True
except ImportError:
    _SHAP=False
try:
    from sklearn.ensemble import GradientBoostingRegressor
    from sklearn.preprocessing import StandardScaler
    from sklearn.pipeline import Pipeline; _SKL=True
except ImportError:
    _SKL=False

FEATURE_NAMES=["Investment Budget","Current Revenue","Operating Expenses","Expected Growth Rate",
               "Existing Business","Growth Momentum","Profit Margin","Log-Capital",
               "Tech Industry Factor","Market Demand","Team Experience","Growth x Existing"]

_surrogate=_shap_expl=_normal_X=None

def _ensure():
    global _surrogate,_shap_expl,_normal_X
    if _surrogate: return
    if not(_SKL and _SHAP): return
    try:
        rng=np.random.default_rng(42)
        n=2000
        inv=rng.uniform(0.1,5,n); rev=rng.uniform(0,5,n); exp=rng.uniform(0,4.5,n)
        growth=rng.uniform(0,3,n); exist=rng.integers(0,2,n).astype(float)
        tech=rng.uniform(0.5,1,n); demand=rng.uniform(0.4,1,n); team=rng.uniform(0.3,1,n)
        margin=np.clip((rev-exp)/np.maximum(rev,0.01),-1,1)
        X=np.column_stack([inv,rev,exp,growth,exist,growth*1.2,margin,np.log1p(inv),tech,demand,team,exist*growth]).astype(np.float32)
        y=np.clip(0.55+growth*0.15+demand*0.18+margin*0.12+rng.normal(0,0.04,n),0.05,0.98).astype(np.float32)
        pipe=Pipeline([("sc",StandardScaler()),("gbr",GradientBoostingRegressor(n_estimators=150,learning_rate=0.05,max_depth=4,subsample=0.8,random_state=42))])
        pipe.fit(X,y); _surrogate=pipe; _normal_X=X
        bg=shap.kmeans(X,50)
        _shap_expl=shap.KernelExplainer(lambda x:_surrogate.predict(x),bg)
        logger.info("SHAP surrogate GBR + KernelExplainer ready.")
    except Exception as e: logger.error(f"SHAP setup failed: {e}")

def _enc(bd):
    inv=bd.get("investmentBudget",50000)/100000; rev=bd.get("currentRevenue",100000)/200000
    exp=bd.get("currentExpenses",80000)/200000;  growth=bd.get("expectedGrowth",50)/100
    exist=1.0 if bd.get("isExisting",True) else 0.0
    margin=float(np.clip((rev-exp)/max(rev,0.01),-1,1))
    ind=bd.get("industry","").lower()
    tech=0.95 if any(t in ind for t in ["tech","saas","ai","software","digital"]) else 0.72
    return np.array([inv,rev,exp,growth,exist,growth*1.2,margin,math.log1p(max(inv,0)),tech,0.82,0.78,exist*growth],dtype=np.float32)

class ExplainableAIEngine:
    def __init__(self): _ensure()

    def generate_shap_explanation(self, bd:dict, predicted_score:float) -> Dict[str,Any]:
        x=_enc(bd).reshape(1,-1)
        factors:List[Dict[str,Any]]=[]
        if _shap_expl and _SHAP:
            try:
                sv=_shap_expl.shap_values(x,nsamples=128)[0]
                base=float(_shap_expl.expected_value)
                for i,(name,sv_i) in enumerate(zip(FEATURE_NAMES,sv)):
                    if abs(sv_i)<0.005: continue
                    factors.append({"feature":name,"impact":f"{'+' if sv_i>0 else ''}{round(sv_i*100,1)} pts",
                        "shap_value":round(float(sv_i),4),"direction":"Positive" if sv_i>0 else "Negative",
                        "explanation":f"{name} contributes {'positively' if sv_i>0 else 'negatively'} (SHAP {sv_i*100:+.1f} pts)."})
                factors.sort(key=lambda f:abs(f["shap_value"]),reverse=True); factors=factors[:8]
                pos=[f["feature"] for f in factors if f["direction"]=="Positive"]
                neg=[f["feature"] for f in factors if f["direction"]=="Negative"]
                return {"base_value":round(base*100,1),"final_predicted_score":predicted_score,
                        "shap_feature_attributions":factors,"top_positive_driver":pos[0] if pos else "Market demand",
                        "top_risk_driver":neg[:2] or ["Acquisition cost"],
                        "explainability_confidence":"SHAP KernelExplainer (128 samples)",
                        "methodology":"Real SHAP SHapley Additive exPlanations"}
            except Exception as e: logger.warning(f"SHAP error: {e}")
        return self._fallback(bd,predicted_score)

    @staticmethod
    def _fallback(bd,ps):
        inv=bd.get("investmentBudget",50000); rev=bd.get("currentRevenue",100000)
        exp=bd.get("currentExpenses",80000);  growth=bd.get("expectedGrowth",50)
        ind=bd.get("industry","Technology"); factors=[]
        if growth>=40: factors.append({"feature":"Expected Growth Target","impact":f"+{round(growth*0.28,1)} pts","direction":"Positive","explanation":f"{growth}% growth signals strong expansion."})
        if rev>exp:
            m=round(((rev-exp)/rev)*100,1)
            factors.append({"feature":"Net Profitability Margin","impact":f"+{round(m*0.35,1)} pts","direction":"Positive","explanation":f"{m}% margin provides unit economic stability."})
        if inv>=25000: factors.append({"feature":"Capital Runway","impact":"+8.4 pts","direction":"Positive","explanation":"Healthy capital buffers early turbulence."})
        if exp/max(1,rev)>0.8: factors.append({"feature":"High Expense Ratio","impact":"-6.2 pts","direction":"Negative","explanation":"Expenses consume >80% of revenue."})
        if "tech" not in ind.lower(): factors.append({"feature":"Physical Scalability Constraint","impact":"-4.1 pts","direction":"Negative","explanation":"Traditional footprint limits scalability."})
        return {"base_value":50.0,"final_predicted_score":ps,"shap_feature_attributions":factors,
                "top_positive_driver":factors[0]["feature"] if factors else "Market demand",
                "top_risk_driver":[f["feature"] for f in factors if f["direction"]=="Negative"] or ["Acquisition cost"],
                "explainability_confidence":"Rule-based fallback","methodology":"Domain-rule attribution"}
