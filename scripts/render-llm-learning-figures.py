#!/usr/bin/env python3
"""Render English scientific figures from the original JUN-853 measurements.
Usage: python3 scripts/render-llm-learning-figures.py RESEARCH_WORKSPACE
Requires NumPy and Matplotlib, without model execution or network access.
"""
from pathlib import Path
import argparse, json, hashlib
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import colors, cm

p=argparse.ArgumentParser();p.add_argument('workspace',type=Path);args=p.parse_args()
out=Path(__file__).resolve().parents[1]/'apps/astro/public/assets/posts/inside-llm'
plt.rcParams.update({'font.size':10,'figure.facecolor':'#f6f4ef','axes.facecolor':'#f6f4ef','text.color':'#172c40'})
cases=[('qwen','Qwen3-0.6B'),('mdlm','MDLM-OWT'),('granite','Granite 3.1 1B-A400M')]
def source(tag):
    return tuple(json.loads((args.workspace/'full_output'/f'{tag}-{kind}.json').read_text()) for kind in ['weights','trace'])
def activation(n,tr,t):
    l,r,u=n['layer'],n['role'],n['unit']
    if n['kind']=='head':return tr['head_context_rms'][str(l)][u][t] if r=='o' else tr['projection_rms'][str(l)][r][u][t]
    if n['kind']=='expert':return tr['expert_weighted_output_rms'][str(l)][u][t]
    if n['kind']=='router':return tr['router_weight'][str(l)][u][t]
    key=n['tensor'].rsplit('.',1)[0] if n['tensor'].endswith(('.weight','.bias','.embedding')) else n['tensor']
    v=tr['module_rms'].get(key)
    return None if v is None else v[0 if len(v)==1 else t]
def position(n,w,counters):
    l,u,r=n['layer'],n['unit'],n['role']
    if n['kind']=='head':
        h=w['heads'] if r in ['q','o'] else w['kv_heads'];x=(u-(h-1)/2)*.72;z={'q':-6,'k':-4.5,'v':-3,'o':-1.5}[r]
    elif n['kind'] in ['expert','router']:
        x=(u-(w['experts']-1)/2)*.72;z=4.2 if n['kind']=='router' else (1 if r=='in' else 2.6)
    else:
        i=counters.get(l,0);counters[l]=i+1;x=(i%7-3)*.8;z=6+(i//7)*1.3
    return x,z,l

fig=plt.figure(figsize=(20,10));fig.suptitle('Inside an LLM: all-layer weights and measured activations',x=.04,y=.96,ha='left',fontsize=23)
fig.text(.04,.91,'Input: The capital of France is Paris. The capital of Japan is Tokyo.     Selected position: France',fontsize=12)
fig.text(.04,.87,'All layers, heads, experts and shared tensors. Each mark aggregates a whole coefficient region; coordinates express architecture.',fontsize=11)
for col,(tag,title) in enumerate(cases):
    w,t=source(tag);tr=t['passes'][0]['trace'];tok=next(i for i,x in enumerate(t['tokens']) if 'France' in x);cnt={}
    pts=np.array([position(n,w,cnt) for n in w['nodes']]);vals=np.array([activation(n,tr,tok) or 0 for n in w['nodes']])
    ax=fig.add_subplot(1,3,col+1,projection='3d');norm=colors.LogNorm(vmin=max(.001,float(vals[vals>0].min())),vmax=float(vals.max()))
    palette=plt.get_cmap('YlOrRd')(norm(np.maximum(vals,.001)));palette[vals==0]=[.72,.75,.77,.35]
    ax.scatter(pts[:,0],pts[:,1],pts[:,2],c=palette,marker='s',s=8,depthshade=False,rasterized=True);ax.view_init(19,-60);ax.set_box_aspect((1,.7,1.35))
    ax.set_xlabel('Head / expert index (centered)');ax.set_ylabel('Matrix role');ax.set_zlabel('Layer');ax.set_zticks(np.arange(0,w['layers'],4))
    ax.set_title(f"{title}\n{w['layers']} layers / {w['layers']*w['heads']} Q heads"+(f" / {w['layers']*w['experts']} experts" if w['experts'] else ''),fontsize=12,pad=15)
    cb=fig.colorbar(cm.ScalarMappable(norm=norm,cmap='YlOrRd'),ax=ax,shrink=.45,pad=.03);cb.set_label('Output RMS / model-specific log scale',fontsize=8)
    ax.text2D(0,-.24,f"{w['tensor_count']} tensors / {w['stored_coefficients']:,} stored scalars\n{len(w['nodes']):,} complete regions shown",transform=ax.transAxes,fontsize=10)
fig.subplots_adjust(left=.025,right=.97,top=.78,bottom=.19,wspace=.15)
fig.text(.04,.06,'Q/K/V: projection RMS. O: head context RMS. Expert: gate-weighted output RMS. Gray: zero / unobserved. RMS is not causal importance.',fontsize=11)
fig.text(.04,.025,'Qwen includes duplicated tied embedding/head storage. MDLM: first conditional reconstruction pass. Original coefficients: pinned Hugging Face checkpoints.',fontsize=10)
fig.savefig(out/'full-model-3d.png',dpi=150);plt.close(fig)

fig,axes=plt.subplots(3,3,figsize=(16,10));fig.suptitle('Layer 0: every component of Query, Key and Value',x=.05,ha='left',fontsize=21)
for col,(tag,title) in enumerate(cases):
    m=json.loads((args.workspace/'qkv_output'/f'{tag}-qkv.json').read_text());a=np.load(args.workspace/'qkv_output'/f'{tag}-all-qkv.npz');token=next(i for i,t in enumerate(m['tokens']) if 'France' in t)
    for row,(role,name,color) in enumerate([('q','Query','#287bac'),('k','Key','#c57b39'),('v','Value','#328a66')]):
        ax=axes[row,col];v=a['l0_'+role+'_raw'][0,token];ax.plot(np.arange(len(v)),v,color=color,lw=1);ax.axhline(0,color='#a6adb3',lw=.6);ax.set_xlim(0,len(v)-1)
        ax.set_xlabel(f'Component (all {len(v)} dimensions)');ax.set_ylabel(name+' value');ax.spines[['top','right']].set_visible(False)
        if row==0:ax.set_title(title+f"\ntoken {token} / ID {m['ids'][token]} / head 0",fontsize=12)
fig.subplots_adjust(left=.06,right=.98,bottom=.12,top=.86,hspace=.5,wspace=.32)
fig.text(.05,.055,'Raw WQ/WK/WV projections, before Q/K normalization and RoPE. Vertical scales differ across plots.',fontsize=11)
fig.text(.05,.025,'Same input sentence; MDLM masks Paris/Tokyo. All vector components shown, without PCA, smoothing or value normalization.',fontsize=10)
fig.savefig(out/'query-key-value-full-components.png',dpi=160);plt.close(fig)
# Keep the public download manifest consistent with the English renders.
manifest=json.loads((out/'manifest.json').read_text())
for name in ['full-model-3d.png','query-key-value-full-components.png']:
    file=out/name;manifest['files'][name]={'bytes':file.stat().st_size,'sha256':hashlib.sha256(file.read_bytes()).hexdigest()}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
