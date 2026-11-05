#!/usr/bin/env python3
"""Export the JUN-853 measured fragments to the existing static blog.

Usage: python3 scripts/export-llm-learning.py RESEARCH_WORKSPACE VISUALIZE_SKILL_DIR
The source fragments and measurements remain unchanged. No models are executed.
"""
from pathlib import Path
import argparse, hashlib, html, json, re, shutil, subprocess, sys

args = argparse.ArgumentParser()
args.add_argument('workspace', type=Path)
args.add_argument('visualize_skill', type=Path)
opt = args.parse_args()
root = Path(__file__).resolve().parents[1]
out = root / 'apps/astro/public/assets/posts/inside-llm'
out.mkdir(parents=True, exist_ok=True)

# Translate labels only; JSON data blocks are excluded from replacements.
translations = {
 '全層の重みと、文章を通したときの活性値':'All-layer weights and measured activations',
 '全層のhead・expert・共有テンソルを立体配置。ドラッグで回転、ホイールで拡大。各立体を選択すると実測値を表示します。':'All layers, heads, experts and shared tensors. Drag to rotate; scroll to zoom; select a unit to inspect.',
 '実推論の出力RMS':'Measured output RMS', '保存weightのRMS':'Stored weight RMS', 'MoEの選択重み':'MoE routing weight',
 '復元ステップ':'Reconstruction pass', '色の指標':'Color measure', '入力トークン':'Input token', '入力文 ':'Sentence ',
 '層を選択':'Layer', '重み単位を選択':'Weight unit', '選択した立体の全係数を確認':'Download tensor / head / expert index (JSON)',
 'ドラッグ：回転　ホイール：拡大':'Drag: rotate · scroll: zoom',
 '全係数から求めたweight RMS':'Weight RMS across all coefficients', '実top-8選択重み':'Measured top-8 gate weight',
 'Q/K/V＝投影出力RMS、O＝head context RMS、expert＝選択重み×出力のRMS':'Q/K/V: projection RMS; O: context RMS; expert: RMS of gate × output',
 '（モデル内固定・非線形色）、灰色：0／該当観測なし':' (fixed within model; nonlinear). Gray: zero / unobserved',
 '横：head / expert番号　縦：層　奥行：Q・K・V・O／expert入出力／router／共有テンソル。各立体は全係数を集約した単位です。':'X: head / expert. Y: layer. Z: Q/K/V/O, expert matrices, router, shared tensors. Each unit aggregates its full coefficient region.',
 '観測対象外':'Unobserved', ' 格納係数を走査（共有の重複・bufferを含む）':' stored scalars scanned (including tied duplicates / buffers)',
 '実際の復元結果：':'Measured reconstruction: ', '実際の次トークン予測：':'Measured next-token prediction: ',
 'token IDは固定。学習で変わるのは重み。':'Token IDs stay fixed; training changes weights',
 'tokenizerのIDから埋め込みを選び、全層を計算し、正解との誤差を逆伝播して実重みを更新するアニメーション':'Animation of token IDs, embedding lookup, all layers, prediction, backpropagation and measured weight updates',
 '矢印の移動は模式表現。数値は実測した更新前・更新後。途中の補間は学習ログではありません。':'Motion is schematic. Endpoint values are measured; interpolation is not a recorded training trajectory.',
 '文字をtoken IDへ変換':'Text → token IDs', 'IDで埋め込み行を選ぶ':'Look up an embedding row', 'ベクトルを全層に通す':'Pass vectors through all layers',
 '語彙の各IDへ点数・確率を出す':'Score vocabulary IDs', '正解と比較し、勾配を逆伝播':'Compare with target; backpropagate',
 '埋め込みと最終層の係数を更新':'Update selected weights', '同じIDでも、活性と予測が変わる':'Same IDs; changed activations and prediction',
 '実測した1例・1step：埋め込み1行＋最終層の一部を更新。通常の事前学習では、他の層も更新します。':'Measured one-example, one-step update: one embedding row + part of the final layer. Full pretraining also updates other layers.',
 '文字 ↔ IDの辞書':'Text ↔ ID', '学習中もIDは同じ':'IDs stay fixed', '入力の埋め込み E':'Embedding E', '入力の埋め込み':'Embedding E',
 '選ぶ行：':'Row: ', '更新するのは行の数値':'Row values change', '渡るのはベクトル':'Pass vectors', '中間層にID表はない':'No ID table here',
 '最後の一部だけ学習':'Partial final update', '出力：語彙の各ID':'Vocabulary IDs', '正解ID ':'Target ID ',
 '入出力で重み共有':'Tied input / output', '出力行列は入力と別':'Separate output W', 'IDではなく、ベクトル':'Hidden vectors',
 '入力Eと重みを共有':'Tied to embedding E', '入力Eとは別の行列':'Separate from E', '最終層：32中8 expert':'Last layer: 8 / 32 experts',
 '誤差から勾配を計算':'Loss → gradient', '固定weightも、勾配を前の層へ通す':'Gradients pass through frozen layers',
 '色：活性（青）／学習する係数と勾配（別色）。行列・矢印は模式図。':'Color: activations / updated weights and gradients. Geometry is schematic.',
 '正解tokenの確率 ':'Target probability ', '予測損失 ':'Prediction loss ', ' は固定':' stays fixed', '正解：':'Target: ',
 '実係数':'Coefficient', '学習前':'Before', '現在':'Current', '学習例':'Example', '一時停止':'Pause', 'もう一度再生':'Replay', '再生':'Play', '前へ':'Previous', '次へ':'Next',
 'Embeddingから作るQuery・Key・Value':'Query, Key and Value from the input representation',
 'Query側のtoken':'Query token', '照合するKey・Value側のtoken':'Key / Value token', '観測する段階':'Measurement stage',
 'WQ・WK・WVによる線形投影の直後':'Immediately after WQ / WK / WV', 'Attentionへ渡る値（正規化・位置情報の反映後）':'Attention inputs (after normalization / RoPE)',
 'Q — 照合するQuery':'Q — Query', 'K — 照合されるKey':'K — Key', 'V — 合成する内容Value':'V — Value',
 'Queryの全成分':'All Query components', 'Keyの全成分':'All Key components', 'Valueの全成分':'All Value components',
 'このQueryが各Keyに割り当てたAttention':'Attention from this Query to every Key',
 '実モデルのAttention重み。棒を選ぶと対応するKey・Valueを表示します':'Measured attention weights. Select a bar to inspect its Key and Value.',
 '第0層・1 head分の全成分。縦軸の範囲は図ごとに異なります。照合には正規化・位置情報反映後のQ/Kを使用。Vには位置回転を加えません。':'Layer 0, one head, every component. Each plot has its own vertical scale. Attention uses transformed Q/K; V has no RoPE.',
 '実照合スコア ':'Scaled QK score ', '（将来位置をmask）':' (future position masked)', 'このVの成分寄与 ':'This V component contribution ',
 '全V合成後のhead出力RMS ':'Combined head context RMS ', '成分番号（全 ':'Component (all ', ' 成分）':' components)',
 '成分を選択':'Select component', '成分番号':'Component', 'Key側のtoken位置':'Key token position',
 'Embeddingの全':'Embedding: all ', '元のToken Embedding全成分（':'Full token embedding (', '次元）':' dimensions)',
 'Q側':'Query', 'K/V側':'Key / Value', '第0層 · 入力 ':'Layer 0 · input ', '成分 → Q ':' dimensions → Q ',
 '本 / K・V 各':' heads / K,V ', '本 · 1本 ':' heads · ', '成分 · Q head ':' dimensions · Q head ',
 '表示エラー：':'Display error: ', '実値':'Value', '成分 ':'Component ', '成分':' components', '入力 ':'Input ',
 '｜色：':' | color: ', '係数':' coefficients', 'モデル':'Model', '全 ':'All ', '全':'All ', '層':' layers', '行 × ':' × ', '列':'',
}

inputs = [
 ('full_output/full-model-activation-atlas.html', 'all-layers.html', 'All-layer activation atlas'),
 ('training_output/token-id-and-training.html', 'training.html', 'Token IDs and training'),
 ('qkv_output/query-key-value.html', 'query-key-value.html', 'Query, Key and Value'),
]
manifest = {'date':'2026-11-05', 'source_fragments':{}, 'files':{}, 'display_scope':{'atlas':'all layers / heads / experts, aggregated regions', 'training':'one example, one partial SGD step', 'qkv':'layer 0, every head / token / component'}}
for rel, name, title in inputs:
    source = opt.workspace / rel
    # First materialize the supported standalone export; then adapt its fragment
    # to the blog's same-origin static shell (no Codex host or nested srcdoc).
    intermediate = opt.workspace / ('public-export-' + name)
    subprocess.run([sys.executable, str(opt.visualize_skill/'scripts/render.py'), str(source), str(intermediate), '--force', '--title', title], check=True, stdout=subprocess.DEVNULL)
    fragment = source.read_text()
    manifest['source_fragments'][rel] = hashlib.sha256(source.read_bytes()).hexdigest()
    blocks = []
    def protect(match):
        blocks.append(match[0]); return f'__DATA_BLOCK_{len(blocks)-1}__'
    fragment = re.sub(r'<script[^>]*type="application/json"[^>]*>.*?</script>', protect, fragment, flags=re.S)
    for old, new in sorted(translations.items(), key=lambda pair:-len(pair[0])):
        fragment = fragment.replace(old, new)
    for i, block in enumerate(blocks): fragment = fragment.replace(f'__DATA_BLOCK_{i}__', block)
    fragment = re.sub(r'function remember\(\)\{[^\n]*\}', 'function remember(){}', fragment)
    fragment = fragment.replace('window.openai?.widgetState?.privateContent||{}', '{}').replace('window.openai?.widgetState||{}', '{}')
    fragment = re.sub(r"window.addEventListener\('openai:set_globals',.*?\);", '', fragment)
    fragment = fragment.replace("q('atlas-raw').href='http://127.0.0.1:8853/raw?model='+encodeURIComponent(model.tag)+'&node='+selected", "q('atlas-raw').href=model.tag+'-weights.json'")
    fragment = fragment.replace('https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js', 'd3-7.9.0.min.js')
    if name == 'training.html':
        fragment = fragment.replace('o.textContent=v.title;', "o.textContent=['Qwen · next-token prediction','MDLM · masked reconstruction','Granite MoE · expert routing'][i];")
        fragment = fragment.replace("text(core.x-5,375,'Gradients", "text(core.x-5,405,'Gradients")
    if name == 'all-layers.html':
        fragment = fragment.replace('<input class="form-range"', '<button class="btn" id="atlas-play" type="button">Play token samples</button><input class="form-range"', 1)
        marker = "setModel(Math.max(0,Math.min(data.models.length-1,modelIndex)))"
        playback = """
let timer=0;
function stopPlayback(){clearInterval(timer);timer=0;q('atlas-play').textContent='Play token samples'}
q('atlas-play').addEventListener('click',()=>{if(timer){stopPlayback();return}token.value=0;updateToken();if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;q('atlas-play').textContent='Pause';timer=setInterval(()=>{if(+token.value>=+token.max){stopPlayback();return}token.value=+token.value+1;updateToken()},750)});
modelSelect.addEventListener('change',stopPlayback);passSelect.addEventListener('change',stopPlayback);token.addEventListener('input',stopPlayback);document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPlayback()});
"""
        fragment = fragment.replace(marker, playback + marker)
    # Exported UI is English. The opaque scientific JSON remains byte-for-byte.
    ui = re.sub(r'<script[^>]*type="application/json"[^>]*>.*?</script>', '', fragment, flags=re.S)
    if re.search(r'[\u3040-\u30ff\u3400-\u9fff]', ui):
        raise ValueError('Untranslated UI in '+name+': '+str(re.findall(r'[^\n]*[\u3040-\u30ff\u3400-\u9fff][^\n]*', ui)))
    assert 'window.openai' not in fragment and '127.0.0.1' not in fragment
    stylesheet = (opt.visualize_skill/'assets/visualize.css').read_text()
    document = '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>'+html.escape(title)+'</title><style>'+stylesheet+'\nbody{margin:0;padding:16px;box-sizing:border-box}*{box-sizing:border-box}h2{font-size:1.2rem}h3{font-size:1rem}.viz-controls{display:flex;flex-wrap:wrap;gap:12px}.viz-controls>label{flex:1;min-width:150px}.form-select{max-width:100%}.text-small{line-height:1.5}code{white-space:normal;overflow-wrap:anywhere}</style></head><body>'+fragment+'''<script>
let resizePending=false;function reportSize(){if(resizePending)return;resizePending=true;requestAnimationFrame(()=>{resizePending=false;parent.postMessage({type:'llm-lab-resize',height:document.body.scrollHeight+24},location.origin)})}new ResizeObserver(reportSize).observe(document.body);reportSize();
</script></body></html>'''
    (out/name).write_text(document)

for sub, names in {
 'full_output':['qwen-weights.json','mdlm-weights.json','granite-weights.json','coverage-verification.json','environment.json','full-model-3d.png'],
 'training_output':['qwen-training.json','mdlm-training.json','granite-training.json','training-verification.json'],
 'qkv_output':['numerical-verification.json','query-key-value-full-components.png'],
}.items():
    for name in names: shutil.copyfile(opt.workspace/sub/name, out/name)
for file in out.iterdir():
    if file.is_file() and file.name!='manifest.json': manifest['files'][file.name]={'bytes':file.stat().st_size,'sha256':hashlib.sha256(file.read_bytes()).hexdigest()}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Exported', len(inputs), 'static labs to', out)
