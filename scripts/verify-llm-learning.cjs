// Run with an installed Playwright on NODE_PATH. No dependency changes to the blog.
// LLM_LAB_BASE_URL may point to a local build or the published site.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.LLM_LAB_BASE_URL || 'http://127.0.0.1:8854';
const output = process.env.LLM_LAB_EVIDENCE_DIR;
(async () => {
  const browser = await chromium.launch({ headless: true,
    ...(process.env.CHROME_PATH ? {executablePath: process.env.CHROME_PATH} : {}) });
  const page = await browser.newPage({viewport:{width:1100,height:1000}});
  const errors = [], failures = [], requests = [];
  page.on('pageerror', e=>errors.push(e.message));
  page.on('response', r=>{if(r.status()>=400)failures.push(r.status()+' '+r.url())});
  page.on('request', r=>requests.push(r.url()));
  const slug = '/en/posts/inside-llm-weights-activations-training/';
  await page.goto(base+slug);
  assert((await page.locator('h1').innerText()).includes('Inside an LLM'));
  const frames = page.locator('iframe[data-llm-lab]');
  assert.equal(await frames.count(),3);
  for (const frame of await frames.all()) await frame.scrollIntoViewIfNeeded();
  const atlas = page.frameLocator('iframe[src$="all-layers.html"]');
  const qkv = page.frameLocator('iframe[src$="query-key-value.html"]');
  const train = page.frameLocator('iframe[src$="training.html"]');
  await atlas.locator('#full-model-atlas[data-ready="true"]').waitFor();
  await qkv.locator('#qkv-vector-view[data-ready="true"]').waitFor();
  await train.locator('#token-training-motion[data-ready="true"]').waitFor();
  for(const model of ['0','1','2']) {
    await atlas.locator('#atlas-model').selectOption(model);
    await atlas.locator('#atlas-layer').selectOption('0');
    const n = await atlas.locator('#atlas-layer option').count();
    assert(n>12);
    await atlas.locator('#atlas-layer').selectOption(String(model==='0'?27:model==='1'?11:23));
    assert(await atlas.locator('#atlas-unit option').count()>0);
    await atlas.locator('#atlas-measure').selectOption('weight');
    const detail = await atlas.locator('#atlas-detail').innerText();
    await atlas.locator('#atlas-token').evaluate(e=>{e.value=0;e.dispatchEvent(new Event('input'))});
    assert.equal(await atlas.locator('#atlas-detail').innerText(),detail);
    const link=await atlas.locator('#atlas-raw').getAttribute('href');
    assert(link.endsWith('-weights.json')&&!link.includes('127.0'));
    await qkv.locator('#qkv-model').selectOption(model);
    await qkv.locator('#qkv-stage').selectOption('raw');
    const raw=await qkv.locator('#qkv-selected').innerText();
    await qkv.locator('#qkv-stage').selectOption('attention');
    assert.notEqual(await qkv.locator('#qkv-selected').innerText(),raw);
    await qkv.locator('#qkv-embedding summary').click();
    await qkv.locator('#qkv-embedding-plots rect').nth(750).waitFor({state:'attached'});
    assert(await qkv.locator('#qkv-embedding-plots rect').count()>750);
    await qkv.locator('#qkv-embedding summary').click();
    if(model!=='1') {
      await qkv.locator('#qkv-query').selectOption('0');
      await qkv.locator('#qkv-key').selectOption('3');
      assert((await qkv.locator('#qkv-score').innerText()).includes('future position masked'));
    }
    await train.locator('#tt-model').selectOption(model);
    const before=await train.locator('#tt-values').innerText();
    for(let step=0;step<7;step++) {
      await train.locator('#tt-step').evaluate((e,i)=>{e.value=i;e.dispatchEvent(new Event('input'))},step);
      assert((await train.locator('#tt-step-label').innerText()).startsWith((step+1)+' / 7'));
    }
    assert.notEqual(await train.locator('#tt-values').innerText(),before);
  }
  await atlas.locator('#atlas-play').click();
  await page.waitForTimeout(1700);
  assert(Number(await atlas.locator('#atlas-token').inputValue())>0);
  await atlas.locator('#atlas-play').click();
  await train.locator('#tt-play').click();
  await page.waitForTimeout(300);
  assert.equal(await train.locator('#tt-play').innerText(),'Pause');
  await train.locator('#tt-play').click();
  if(output) {fs.mkdirSync(output,{recursive:true});await page.screenshot({path:output+'/desktop.png',fullPage:true})}
  const bounds=[];
  for(const width of [360,768]) {
    await page.setViewportSize({width,height:1000});
    await page.waitForTimeout(300);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    for(const frame of page.frames().filter(f=>f!==page.mainFrame())) {
      const r=await frame.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,
        clipped:[...document.querySelectorAll('svg text')].map(e=>{const b=e.getBoundingClientRect(),p=e.closest('svg').getBoundingClientRect();return {text:e.textContent,left:b.left-p.left,right:b.right-p.left,width:p.width}}).filter(b=>b.left < -1||b.right>b.width+1)}));
      bounds.push({url:frame.url(),...r});
      assert(r.scroll<=r.width+1,JSON.stringify(r));
      assert.equal(r.clipped.length,0,JSON.stringify(r.clipped));
    }
  }
  if(output)await page.screenshot({path:output+'/mobile.png',fullPage:true});
  await page.emulateMedia({reducedMotion:'reduce'});
  await train.locator('#tt-step').evaluate(e=>{e.value=0;e.dispatchEvent(new Event('input'))});
  await train.locator('#tt-play').click();
  assert.equal(await train.locator('#tt-step').inputValue(),'1');
  await page.goto(base+'/ja/posts/inside-llm-weights-activations-training/');
  assert((await page.locator('h1').innerText()).includes('LLMの内側'));
  await page.goto(base+'/en/');
  assert(await page.locator('a[href*="inside-llm-weights-activations-training"]').count()>0);
  assert.equal(errors.length,0,errors.join('\n'));assert.equal(failures.length,0,failures.join('\n'));
  assert(!requests.some(u=>/localhost:8853|127\.0\.0\.1:8853|cdn\.jsdelivr\.net/.test(u)));
  const result={status:'PASS',base,three_models:true,all_layers:true,seven_training_stages:true,token_playback:true,qkv_stages:true,causal_masks:true,full_embeddings:true,english_and_japanese:true,mobile_svg_bounds:bounds,errors,failures};
  if(output)fs.writeFileSync(output+'/browser-verification.json',JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
