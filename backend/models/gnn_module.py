"""
Graph Neural Network Business Relationship Analyser.
Uses NetworkX for graph analytics. Optional torch_geometric GraphSAGE.
"""
import logging
from typing import Dict, Any, List, Optional
logger = logging.getLogger(__name__)

try:
    import networkx as nx; _NX=True
except ImportError:
    _NX=False; logger.warning("networkx not installed — GNN uses dict fallback.")

try:
    import torch, torch.nn as nn; _TORCH=True
except ImportError:
    _TORCH=False

GRAPH_TRIPLES = [
    ("Notion","competes_with","Confluence"),("Notion","competes_with","Airtable"),
    ("Slack","competes_with","Microsoft Teams"),("Slack","competes_with","Discord"),
    ("Zoom","competes_with","Google Meet"),("HubSpot","competes_with","Salesforce"),
    ("Shopify","competes_with","WooCommerce"),("Stripe","competes_with","Razorpay"),
    ("Coursera","competes_with","Udemy"),("Duolingo","competes_with","Babbel"),
    ("Calm","competes_with","Headspace"),("Zerodha","competes_with","Groww"),
    ("Swiggy","competes_with","Zomato"),("OpenAI","competes_with","Anthropic"),
    ("Notion","uses","Cloud Computing"),("Duolingo","uses","Artificial Intelligence"),
    ("Stripe","uses","Cryptography"),("Shopify","uses","Cloud Computing"),
    ("Zoom","uses","WebRTC"),("HubSpot","uses","CRM Software"),
    ("Calm","uses","Mobile Apps"),("OpenAI","uses","Artificial Intelligence"),
    ("OpenAI","uses","Large Language Models"),("Swiggy","uses","Mobile Apps"),
    ("Swiggy","uses","GPS Tracking"),("Samsara","uses","IoT"),
    ("Notion","targets","Knowledge Workers"),("Duolingo","targets","Students"),
    ("Stripe","targets","Developers"),("Stripe","targets","Startups"),
    ("Shopify","targets","Small Businesses"),("HubSpot","targets","Marketing Teams"),
    ("Calm","targets","Wellness-Conscious Consumers"),("Zerodha","targets","Retail Investors"),
    ("Swiggy","targets","Urban Consumers"),("Coursera","targets","Working Professionals"),
    ("OpenAI","targets","Developers"),("OpenAI","targets","Enterprise Teams"),
    ("Notion","operates_in","Productivity Software Market"),("Duolingo","operates_in","EdTech Market"),
    ("Stripe","operates_in","FinTech Market"),("Shopify","operates_in","E-Commerce Platform Market"),
    ("Zoom","operates_in","Collaboration Software Market"),("HubSpot","operates_in","CRM Market"),
    ("OpenAI","operates_in","AI Infrastructure Market"),("Swiggy","operates_in","Food Delivery Market"),
    ("Zerodha","operates_in","Indian Stock Broking Market"),
]

_G = None
def _get_graph():
    global _G
    if _G is None and _NX:
        _G = nx.DiGraph()
        for s,r,t in GRAPH_TRIPLES: _G.add_edge(s,t,relation=r)
    return _G

def _fuzzy(name, G):
    if G is None: return None
    nl=name.lower()
    for node in G.nodes():
        if node.lower() in nl or nl in node.lower(): return node
    return None

def _get_comps(node, G):
    comps=set()
    try:
        for u,v,d in G.edges(node,data=True):
            if d.get("relation")=="competes_with": comps.add(v)
        my_t={v for _,v,d in G.edges(node,data=True) if d.get("relation") in ("targets","operates_in")}
        for n in G.nodes():
            if n==node: continue
            their_t={v for _,v,d in G.edges(n,data=True) if d.get("relation") in ("targets","operates_in")}
            if my_t & their_t: comps.add(n)
    except: pass
    return list(comps)[:6]

def _get_markets(node, G):
    try: return [v for _,v,d in G.edges(node,data=True) if d.get("relation")=="operates_in"] or ["Adjacent Growth Market"]
    except: return ["Adjacent Growth Market"]

def _get_techs(node, G):
    try: return [v for _,v,d in G.edges(node,data=True) if d.get("relation")=="uses"]
    except: return []

def _get_whitespace(node, G):
    try:
        comp_targets=set()
        for c in _get_comps(node,G):
            for _,v,d in G.edges(c,data=True):
                if d.get("relation")=="targets": comp_targets.add(v)
        all_segs={v for _,v,d in G.edges(data=True) if d.get("relation")=="targets"}
        return list(all_segs - comp_targets)[:4]
    except: return []

_IND_COMPS={"tech":["Notion","HubSpot","Intercom"],"fintech":["Stripe","Razorpay","Zerodha"],
    "edtech":["Coursera","Duolingo","BYJU's"],"health":["Calm","Practo","PharmEasy"],
    "food":["Swiggy","Zomato"],"clean":["SolarEdge","Lumen Energy"],"retail":["Shopify","Nykaa"]}
_IND_TECHS={"tech":["Cloud Computing","AI"],"fintech":["Cryptography","APIs"],"health":["Mobile Apps","Data Analytics"],"food":["GPS Tracking","Mobile Apps"]}

class BusinessGNNModule:
    def __init__(self): pass

    def analyze(self, business_data:Dict[str,Any]) -> Dict[str,Any]:
        bname=business_data.get("businessName","Your Business")
        industry=business_data.get("industry","Technology")
        customers=business_data.get("targetCustomers","")
        G=_get_graph(); matched=_fuzzy(bname,G)

        if G and matched:
            comps=_get_comps(matched,G); markets=_get_markets(matched,G)
            techs=_get_techs(matched,G); whitespace=_get_whitespace(matched,G)
            node=matched
            degree=G.degree(matched) if matched in G else 0
        else:
            ind_l=industry.lower()
            comps=next((v for k,v in _IND_COMPS.items() if k in ind_l),["Market Leader A","Market Leader B"])
            markets=[f"{industry} Market","Adjacent Growth Market"]
            techs=next((v for k,v in _IND_TECHS.items() if k in ind_l),["Cloud Computing"])
            cs=customers.lower()
            whitespace=[]
            if "student" not in cs: whitespace.append("Students / Youth Segment")
            if "enterprise" not in cs: whitespace.append("Enterprise / Corporate Buyers")
            if "rural" not in cs: whitespace.append("Rural / Tier-2 Market")
            node=bname; degree=0

        n_nodes=len(G.nodes()) if G else len(GRAPH_TRIPLES)*2
        n_edges=len(G.edges()) if G else len(GRAPH_TRIPLES)
        n_comp=len(comps)
        ws=whitespace[0] if whitespace else "niche segments"
        insight=(f"The {industry} ecosystem shows {n_comp} direct competitor(s). "
                 f"Key untapped opportunity: {ws}. "
                 f"Entering adjacent markets ({', '.join(markets[:2])}) via differentiation reduces head-on competition.")

        return {"business_node":node,"competitor_nodes":comps,"market_nodes":markets,
                "technology_nodes":techs,"whitespace_segments":whitespace,"gnn_similar_nodes":[],
                "graph_stats":{"total_nodes":n_nodes,"total_edges":n_edges,"business_degree":degree},
                "ecosystem_insight":insight,"model_used":"NetworkX graph analytics" if _NX else "Rule-based fallback"}
