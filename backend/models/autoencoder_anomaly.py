"""
PyTorch Autoencoder Anomaly Detector.
Architecture: 8->16->8->4 (encoder), 4->8->16->8 (decoder, Sigmoid output).
Trained on 2000 normal financial snapshots, 100 epochs. 95th-pct threshold.
"""
import logging
import numpy as np
from typing import Dict, Any, List, Optional
logger = logging.getLogger(__name__)

try:
    import torch, torch.nn as nn, torch.optim as optim; _TORCH=True
except ImportError:
    _TORCH=False

FEATURE_NAMES=["Revenue Growth Rate","Expense Ratio","Cash Flow Margin",
    "Customer Acquisition Cost (norm)","Monthly Burn Rate (norm)",
    "Revenue Volatility","Gross Margin","Investment Utilisation"]

if _TORCH:
    class _AE(nn.Module):
        def __init__(self):
            super().__init__()
            self.encoder=nn.Sequential(nn.Linear(8,16),nn.BatchNorm1d(16),nn.ReLU(),nn.Linear(16,8),nn.ReLU(),nn.Linear(8,4))
            self.decoder=nn.Sequential(nn.Linear(4,8),nn.ReLU(),nn.Linear(8,16),nn.BatchNorm1d(16),nn.ReLU(),nn.Linear(16,8),nn.Sigmoid())
        def forward(self,x): z=self.encoder(x); return self.decoder(z),z

def _gen_normal(n=2000):
    rng=np.random.default_rng(42)
    return np.column_stack([rng.uniform(0.05,0.80,n),rng.uniform(0.40,0.85,n),rng.uniform(0.05,0.35,n),
        rng.uniform(0.10,0.60,n),rng.uniform(0.10,0.50,n),rng.uniform(0.02,0.15,n),
        rng.uniform(0.30,0.80,n),rng.uniform(0.40,0.95,n)]).astype(np.float32)

def _train_ae(model,X,epochs=100):
    from torch.utils.data import TensorDataset,DataLoader
    dl=DataLoader(TensorDataset(torch.from_numpy(X)),batch_size=64,shuffle=True)
    opt=optim.Adam(model.parameters(),lr=1e-3,weight_decay=1e-4)
    sch=optim.lr_scheduler.StepLR(opt,step_size=30,gamma=0.5)
    crit=nn.MSELoss(); model.train()
    for _ in range(epochs):
        for (xb,) in dl:
            opt.zero_grad(); r,_=model(xb); l=crit(r,xb); l.backward(); opt.step()
        sch.step()
    model.eval(); return model

def _threshold(model,X):
    with torch.no_grad():
        r,_=model(torch.from_numpy(X))
        errs=((r-torch.from_numpy(X))**2).mean(dim=1).numpy()
    return float(np.percentile(errs,95))

def _encode_snap(bd,hist=None):
    rev=max(bd.get("currentRevenue",100000),1); exp=max(bd.get("currentExpenses",80000),1)
    inv=max(bd.get("investmentBudget",50000),1); grow=bd.get("expectedGrowth",50)/100
    er=float(np.clip(exp/rev,0,2)); cf=float(np.clip((rev-exp)/rev,-1,1))
    gm=float(np.clip(1-er*0.7,0,1)); iu=float(np.clip(rev/(inv+1),0,1))
    burn=float(np.clip((exp/12)/(inv+1),0,1)); cac=float(np.clip(inv/(rev+1)*0.3,0,1))
    if hist and len(hist)>=3:
        arr=np.array(hist,dtype=float); mr=arr.mean()
        rv=float(np.clip(arr.std()/(mr+1),0,1)); rg=float(np.clip((arr[-1]-arr[0])/(arr[0]+1),-1,3)/3)
    else:
        rv=0.06; rg=float(np.clip(grow,0,1))
    return np.array([rg,er/2,max(cf,0),cac,burn,rv,gm,iu],dtype=np.float32)

def _anomaly_desc(i,val,nm):
    name=FEATURE_NAMES[i]; d=val-nm
    mits={0:("Investigate revenue surge — validate not one-time." if d>0 else "Revenue growth below benchmark — review funnel."),
          1:("High expense ratio — audit fixed costs." if d>0 else "Very low expenses may indicate under-investment."),
          2:("Strong cash flow — reinvest into growth." if d>0 else "Negative cash flow — tighten collections."),
          3:("CAC spike — review paid channels." if d>0 else "Low CAC — verify attribution accuracy."),
          4:("Burn rate high — implement zero-based budgeting." if d>0 else "Low burn may indicate underinvestment."),
          5:("High revenue volatility — diversify customer base." if d>0 else "Unusually stable — could indicate stagnation."),
          6:("Margin expansion — protect pricing power." if d>0 else "Margin compression — review COGS."),
          7:("High investment utilisation — strong capital efficiency." if d>0 else "Low ROI — reallocate to higher-yield initiatives.")}
    return {"metric":name,"value":round(float(val),3),"normal_range":f"{max(0,round(nm-0.15,2))} – {round(nm+0.15,2)}",
            "direction":"unusually high" if d>0 else "unusually low","risk_type":"Overspend" if d>0 else "Underperformance",
            "severity":"High" if abs(d)>0.25 else "Moderate","recommendation":mits.get(i,"Review metric vs industry benchmarks.")}

class AnomalyDetector:
    def __init__(self):
        self._model=None; self._threshold=0.05; self._normal_X=None; self._trained=False; self._build()
    def _build(self):
        if not _TORCH: return
        try:
            X=_gen_normal(2000); self._normal_X=X; m=_AE(); m=_train_ae(m,X,100)
            self._model=m; self._threshold=_threshold(m,X); self._trained=True
            logger.info(f"AnomalyDetector trained. Threshold={self._threshold:.4f}")
        except Exception as e: logger.error(f"Autoencoder training failed: {e}")

    def detect(self, business_data:Dict[str,Any], historical_revenues:Optional[List[float]]=None) -> Dict[str,Any]:
        x=_encode_snap(business_data,historical_revenues)
        anomalies=[]; score=0.0; rerr=0.0; latent=[]

        if self._trained:
            with torch.no_grad():
                xt=torch.from_numpy(x).unsqueeze(0)
                r,z=self._model(xt)
                rn=r.squeeze(0).numpy(); zn=z.squeeze(0).numpy()
            pfe=(rn-x)**2; rerr=float(pfe.mean()); latent=zn.tolist()
            nm=self._normal_X.mean(axis=0) if self._normal_X is not None else x
            for i,e in enumerate(pfe):
                if e>(self._threshold/len(x))*1.5: anomalies.append(_anomaly_desc(i,float(x[i]),float(nm[i])))
            score=float(np.clip(rerr/(self._threshold+1e-9),0,1))
        else:
            nm=np.array([0.35,0.65,0.18,0.30,0.25,0.07,0.55,0.68])
            ns=np.array([0.15,0.12,0.08,0.12,0.10,0.04,0.12,0.14])
            zs=np.abs((x-nm)/(ns+1e-9))
            for i,z in enumerate(zs):
                if z>2.0: anomalies.append(_anomaly_desc(i,float(x[i]),float(nm[i])))
            score=float(np.clip(zs.max()/3.0,0,1))

        is_anom=score>0.5 or len(anomalies)>=2
        sev="Critical" if score>0.8 else "High" if score>0.6 else "Moderate" if score>0.35 else "Normal"
        n=len(anomalies); metrics=", ".join(a["metric"] for a in anomalies[:3])
        summary=(f"{sev} anomaly detected across {n} metric(s): {metrics}. Immediate review recommended." if is_anom
                 else "All financial metrics within normal ranges — no significant anomalies detected.")
        return {"is_anomalous":is_anom,"anomaly_score":round(score,3),"severity":sev,
                "reconstruction_error":round(rerr,5),"anomaly_threshold":round(self._threshold,5) if self._trained else 0.05,
                "detected_anomalies":anomalies,"latent_representation":[round(v,4) for v in latent],
                "financial_snapshot":{FEATURE_NAMES[i]:round(float(x[i]),3) for i in range(len(x))},
                "overall_summary":summary,"model_used":"PyTorch Autoencoder (8->4->8)" if self._trained else "Z-score Fallback"}
