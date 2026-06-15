/* ===== FINAL ROUTING + GAME QA PATCH (appended) ===== */
(function(){
  const $ = id => document.getElementById(id);
  const layer = () => $('layer') || document.querySelector('.layer');
  const esc = s => String(s ?? '').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const js = s => String(s ?? '').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,' ');
  const shuffleLocal = a => { a=[...a]; for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; };
  const speakSafe = txt => { try{ if(typeof speak==='function') speak(String(txt)); }catch(e){} };
  const assetSafe = f => { try{ return typeof asset==='function' ? asset(f) : f; }catch(e){return f;} };
  const setBg = name => { try{ if(typeof bg==='function') bg(name); }catch(e){} };
  const getP = () => { const p=layer(); if(!p) throw new Error('Layer missing'); return p; };
  function wingOf(room){ return ['pattern','compare','count','teen','shape','bakery'].includes(room)?'math':['sound','reading','rhyme','word','sight'].includes(room)?'reading':'adventure'; }
  function wingLabel(wing){ return wing==='math'?'Math Kingdom':wing==='reading'?'Reading Wing':'Adventure Wing'; }
  function roomTitle(room){
    const map={sound:['✨','Sound Sort Forest'],compare:['🐊','Alligator Lagoon'],count:['🪙','Dragon Count'],teen:['🔟','Teen Builder'],pattern:['🌷','Pattern Garden'],shape:['🔷','Shape Castle'],bakery:['🧁','Royal Bakery'],clock:['🕰️','Clock Tower'],messenger:['📞','Messenger'],map:['🗺️','Arrow Path'],reading:['📚','Reading Adventure'],rhyme:['💎','Rhyming Treasure'],word:['🔤','Spelling Tower'],sight:['👑','Sight Word Ballroom']};
    if(map[room]) return map[room];
    try{let r=(window.rooms||[]).find(x=>x[0]===room); if(r) return [r[1],r[2]];}catch(e){}
    return ['⭐',room];
  }
  function ensureState(){
    window.state = window.state || {};
    state.unlocked = state.unlocked || {};
    state.completed = state.completed || {};
    ['sound','compare','count','teen','pattern','shape','clock','reading','rhyme','word','map','messenger'].forEach(r=>{ if(!state.unlocked[r]) state.unlocked[r]=1; if(!state.completed[r]) state.completed[r]=[]; });
  }
  function saveState(){ try{ if(typeof save==='function') save(); else localStorage.setItem('princessCastleAcademy',JSON.stringify(state)); }catch(e){} }
  ensureState();

  const style=document.createElement('style'); style.id='finalRoutingGamePatchStyle'; style.textContent=`
    .panel.cleanPanel,.levelsPanelFix{overflow:auto!important;max-height:calc(100vh - 150px)!important;padding-bottom:28px!important;}
    .levels{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(145px,1fr))!important;gap:14px!important;align-items:stretch!important;padding:8px 6px 36px!important;}
    .levelCard{min-height:132px!important;overflow:hidden!important;}
    .mapGridMenu{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))!important;gap:22px!important;justify-items:center!important;max-width:min(900px,96vw)!important;margin:0 auto!important;padding:6px 0 20px!important;}
    .mapTile{width:155px!important;height:155px!important;min-width:155px!important;min-height:155px!important;white-space:normal!important;overflow:hidden!important;}
    .qaActivity2{height:calc(100vh - 132px);max-height:calc(100vh - 132px);overflow:hidden;background-size:cover;background-position:center;border:6px solid #fff0a6;border-radius:26px;padding:8px;display:grid;place-items:center;}
    .qaCard2{background:rgba(255,255,255,.76);border:6px solid #d69cff;border-radius:30px;padding:12px;margin:0 auto;max-width:min(870px,94vw);width:min(870px,94vw);text-align:center;box-shadow:0 10px 0 #7b20c9;color:#3d1c56;}
    .qaPrompt{font-size:clamp(1.2rem,3.8vw,2.25rem);font-weight:900;background:rgba(255,255,255,.86);border:4px solid #e1c2ff;border-radius:22px;padding:8px;margin:6px auto 10px;}
    .soundGameFull{position:relative;height:calc(100vh - 132px);max-height:calc(100vh - 132px);background-size:cover;background-position:center;border:6px solid #fff0a6;border-radius:26px;overflow:hidden;}
    .soundSparkFixed{position:absolute;width:58px;height:58px;border-radius:50%;border:5px solid #f8c5ff;background:radial-gradient(circle,#fff 0%,#fff9d9 52%,#ffd8ff 100%);box-shadow:0 0 18px #ffbaff;display:grid;place-items:center;z-index:3;}
    .soundSparkFixed::after{content:'✨';font-size:26px;}
    .soundCardFixed{position:absolute;left:50%;top:42%;transform:translate(-50%,-50%);z-index:5;background:#fffbe8;border:5px solid #b844df;border-radius:22px;padding:14px 26px;font-size:clamp(1.5rem,4vw,2.2rem);font-weight:900;box-shadow:0 8px 0 #7b20c9;}
    .soundDockFixed{position:absolute;left:0;right:0;bottom:0;background:rgba(255,255,255,.42);padding:8px 10px;z-index:4;}
    .soundChestRow{display:flex;justify-content:center;gap:12px;flex-wrap:nowrap}.soundChest{min-width:150px;height:78px}.soundHintFixed{font-weight:900;text-align:center;text-shadow:0 1px #fff;margin-top:4px;}
    .numberLineFixed{display:flex;justify-content:center;gap:3px;overflow:hidden;width:100%;margin-bottom:6px}.nlBtn{width:31px;height:31px;border-radius:50%;border:3px solid #b86bee;background:#fff;font-weight:900;color:#40205c}.nlBtn.hit{background:#ffe25b;border-color:#d3a900}.compareNumsFixed{font-size:clamp(2.2rem,7vw,4.8rem);font-weight:900;margin:6px;display:flex;justify-content:center;gap:38px;align-items:center}.gatorRowFixed{display:flex;justify-content:center;gap:26px}.gatorBtnFixed{width:230px;height:120px;border:5px solid #b86bee;border-radius:22px;background:#fff;box-shadow:0 7px 0 #7c35c8;display:grid;place-items:center;overflow:hidden}.gatorBtnFixed img{max-width:84%;max-height:84%;object-fit:contain;}
    .coinAreaFixed{position:relative;height:245px;border:3px solid #ead95d;border-radius:20px;margin:8px auto;max-width:720px;background:rgba(255,255,255,.28)}.coinFixed{position:absolute;border:0;background:transparent;font-size:32px}.answerBtnsFixed{display:flex;justify-content:center;gap:8px;flex-wrap:wrap}.answerBtnsFixed button{min-width:54px;height:46px;border-radius:18px;background:#fff8c8;border:4px solid #b86bee;font-weight:900;font-size:1.3rem;color:#40205c;box-shadow:0 5px 0 #7c35c8;}
    .baseTenPic2{display:flex;justify-content:center;align-items:flex-end;gap:10px;min-height:110px}.tenRod2{width:32px;height:110px;background:#33bee9;border:3px solid #244d5a;border-radius:4px;display:grid;grid-template-rows:repeat(10,1fr);overflow:hidden}.tenRod2 span{border-bottom:1px solid #244d5a}.oneCubeWrap2{display:flex;flex-wrap:wrap;gap:6px;max-width:120px}.oneCube2{width:26px;height:26px;background:#33bee9;border:3px solid #244d5a;border-radius:4px}.teenChoices2{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.teenChoice2{min-height:148px;background:#fff8c8;border:5px solid #b86bee;border-radius:22px;box-shadow:0 7px 0 #7c35c8;font-weight:900;color:#40205c;}.teenFrame2{display:grid;grid-template-columns:repeat(5,54px);gap:8px;justify-content:center;margin:8px auto}.teenCell2{width:54px;height:54px;border-radius:14px;border:4px solid #b86bee;background:#fff;box-shadow:0 5px 0 #7c35c8}.teenCell2.prefilled{background:#ffe36b}.teenCell2.filled{background:#bff2ff}.patternLine2{font-size:clamp(2.3rem,6vw,4rem);display:flex;justify-content:center;gap:18px;align-items:center;margin:8px 0}.patternBlank2{border:5px dashed #9b4de3;border-radius:18px;padding:8px 20px;background:#fff9}.patternChoice2{font-size:2rem;min-height:90px;background:#fff8c8;border:5px solid #b86bee;border-radius:22px;box-shadow:0 7px 0 #7c35c8;font-weight:900;color:#40205c;}
    @media (max-height:650px){.qaCard2{transform:scale(.9);transform-origin:center}.soundChest{height:68px}.qaPrompt{font-size:clamp(1.05rem,3.2vw,1.8rem)}.coinAreaFixed{height:185px}.teenFrame2{grid-template-columns:repeat(5,46px)}.teenCell2{width:46px;height:46px}.answerBtnsFixed button{height:40px;min-width:48px}.mapTile{width:135px!important;height:135px!important;min-width:135px!important;min-height:135px!important}.levels{grid-template-columns:repeat(auto-fit,minmax(128px,1fr))!important}.levelCard{min-height:115px!important;font-size:.95rem!important}}
  `; document.head.appendChild(style);

  function bar2(room,title,progress=''){
    return `<div class="bar"><button class="btn wingBack" onclick="showLevels('${room}')">⬅️ Levels</button><div class="barTitle">${title}</div><div class="progressPill">${progress||''}</div></div>`;
  }
  window.bar = bar2;

  function completeModal(room,i,replay){
    ensureState(); try{ state.completed[room][i]=true; state.unlocked[room]=Math.max(state.unlocked[room]||1,i+2); saveState(); }catch(e){}
    const arr=window.levels?.[room]||[]; const next=i+1; const hasNext=next<arr.length && !/bonus|mixed/i.test(String(arr[next]?.[0]||''));
    const nextAction=hasNext?`startLevel('${room}',${next})`:`showLevels('${room}')`;
    const nextLabel=hasNext?'➡️ Next Level':'⬅️ Back to Levels';
    document.body.insertAdjacentHTML('beforeend',`<div class="modal"><div class="card"><h2>⭐ Great Job! ⭐</h2><div class="prompt">You earned 💎 +1</div><button class="btn" onclick="this.closest('.modal').remove();${replay}">🔄 Play Again</button><button class="btn" onclick="this.closest('.modal').remove();${nextAction}">${nextLabel}</button></div></div>`);
  }
  window.levelCompleteModal = completeModal;
  window.complete = function(room,i){ try{addGem&&addGem();}catch(e){} completeModal(room,i,`startLevel('${room}',${i})`); };

  const soundData = window.soundLevels || (typeof soundLevels!=='undefined'?soundLevels:null) || window.soundLevels_PATCH || (typeof soundLevels_PATCH!=='undefined'?soundLevels_PATCH:[]);
  if(soundData.length){ window.levels.sound = soundData.map(x=>[x[0]]); }
  if(!window.levels.compare) window.levels.compare=[['1–5'],['1–10'],['10–15'],['1–15'],['10–20'],['1–20'],['Mixed Review']];
  if(!window.levels.count) window.levels.count=[['Line Count 1–10'],['Scattered Count 1–10'],['Count 1–20'],['Skip Count by 2s'],['Skip Count by 5s'],['Skip Count by 10s'],['Mixed Review']];
  if(!window.levels.teen) window.levels.teen=[['Tens Frames'],['Make a Ten'],['Count Teen Numbers'],['Match Teen Numbers'],['Base-10 Intro'],['Build Base-10'],['Mixed Review']];
  if(!window.levels.pattern) window.levels.pattern=[['AB Patterns','AB'],['ABB Patterns','ABB'],['AAB Patterns','AAB'],['ABC Patterns','ABC'],['Mixed Review','MIX']];

  window.showWing=function(kind){
    setBg(kind==='reading'?'reading':kind==='math'?'bakery':'clock');
    const title=kind==='reading'?'📚 Reading Wing':kind==='math'?'🔢 Math Kingdom':'🌎 Adventure Wing';
    const tile=(room,icon,label,action)=>`<button class="btn mapTile" onclick="${action||`showLevels('${room}')`}"><span class="big">${icon}</span><span>${label}</span></button>`;
    let buttons='';
    if(kind==='reading') buttons=[tile('sight','👑','Sight Word Ballroom',`showLevels('sight')`),tile('reading','📚','Reading Adventure'),tile('rhyme','💎','Rhyming Treasure'),tile('sound','✨','Sound Sort Forest'),tile('word','🔤','Spelling Tower')].join('');
    else if(kind==='math') buttons=[tile('bakery','🧁','Royal Bakery','startBakery()'),tile('pattern','🌷','Pattern Garden'),tile('compare','🐊','Alligator Lagoon'),tile('count','🪙','Dragon Count'),tile('teen','🔟','Teen Builder'),tile('shape','🔷','Shape Castle')].join('');
    else buttons=[tile('clock','🕰️','Clock Tower'),tile('messenger','📞','Messenger'),tile('map','🗺️','Arrow Path')].join('');
    getP().innerHTML=`<div class="bar levelOnly"><div class="barTitle">${title}</div></div><div class="panel cleanPanel"><div class="mapGridMenu">${buttons}</div></div>`;
    try{updateTop&&updateTop()}catch(e){}
  };

  window.showLevels=function(room){
    ensureState();
    if(room==='sight' && typeof showBallroomHome==='function') return showBallroomHome();
    if(room==='bakery' && typeof startBakery==='function') return startBakery();
    if(room==='shape' && typeof showShapeHub==='function') return showShapeHub();
    const [ic,label]=roomTitle(room); const arr=window.levels?.[room]||[];
    setBg(room==='sound'?'rhyme':room==='pattern'?'pattern':wingOf(room)==='math'?'home':wingOf(room)==='reading'?'reading':'clock');
    const unlocked=state.unlocked[room]||1;
    getP().innerHTML=`<div class="bar"><button class="btn wingBack" onclick="showWing('${wingOf(room)}')">⬅️ ${wingLabel(wingOf(room)).split(' ')[0]}</button><div class="barTitle">${ic} ${label}</div><div></div></div><div class="panel cleanPanel levelsPanelFix"><div class="levels">${arr.map((l,i)=>{let locked=i>=unlocked;let done=!!state.completed?.[room]?.[i];return `<button class="levelCard ${locked?'locked':''} ${done?'completedPink':''}" ${locked?'disabled':''} onclick="startLevel('${room}',${i})"><div style="font-size:2rem">${done?'✅':locked?'🔒':ic}</div><b>${/bonus|mixed/i.test(String(l[0]))?'Bonus':'Level '+(i+1)}</b><div>${esc(l[0])}</div>${locked?'<div>Locked</div>':''}</button>`}).join('')}</div></div>`;
  };

  window.startLevel=function(room,i){
    if(room==='sound') return startSoundQA(i);
    if(room==='compare') return startCompareQA(i);
    if(room==='count') return startCountQA(i);
    if(room==='teen') return startTeenQA(i);
    if(room==='pattern') return startPatternQA(i);
    if(room==='clock' && typeof startClock==='function') return startClock(i);
    if(room==='reading' && typeof startReading==='function') return startReading(i);
    if(room==='rhyme' && typeof startRhyme==='function') return startRhyme(i);
    if(room==='word' && typeof startWord==='function') return startWord(i);
    if(room==='map' && typeof startMap==='function') return startMap(i);
    if(room==='messenger' && typeof startMessenger==='function') return startMessenger(i);
    if(room==='shape' && typeof showShapeHub==='function') return showShapeHub();
  };

  // SOUND SORT
  const sndPos=[[13,22],[32,17],[53,27],[75,19],[88,39],[20,58],[43,65],[68,55]];
  function soundKey(word,targets){let w=String(word).toUpperCase();for(let t of targets){let T=String(t).toUpperCase();if(T.length===1 && w.startsWith(T))return t;if(['SH','CH','TH','WH','PH','ST','SP','SL','SM','TR','DR','BR','CR','CL','FL'].includes(T)&&w.startsWith(T))return t;if(['CK','NG','NK','ING','ED'].includes(T)&&w.endsWith(T))return t;if(['AI','AY','EE','EA','OA','OW','IGH','IE'].includes(T)&&w.includes(T))return t;}return targets[0];}
  window.startSoundQA=function(i){setBg('rhyme'); const d=soundData[i]||soundData[0]; window.sndQA={i,targets:d[1],words:shuffleLocal(d[2]).slice(0,8),done:{},active:null,count:0}; renderSoundQA();};
  window.startSound=window.startSoundQA;
  window.renderSoundQA=function(){const d=soundData[sndQA.i]||soundData[0]; const spark=sndQA.words.map((w,i)=>sndQA.done[i]?'':`<button class="soundSparkFixed" onclick="showSoundCardQA(${i})" style="left:${sndPos[i%sndPos.length][0]}%;top:${sndPos[i%sndPos.length][1]}%"></button>`).join(''); const card=(sndQA.active!==null&&!sndQA.done[sndQA.active])?`<button class="soundCardFixed" onclick="speakSafe('${js(sndQA.words[sndQA.active])}')">${esc(sndQA.words[sndQA.active])}</button>`:''; const chests=sndQA.targets.map(t=>`<button class="chest soundChest" onclick="trySoundChestQA('${js(t)}')"><span class="chestLabel">${esc(t)}</span></button>`).join(''); getP().innerHTML=bar2('sound',`✨ ${esc(d[0])}`,`${sndQA.count}/8`)+`<div class="soundGameFull" style="background-image:url(${assetSafe('rhyme.jpg')})">${spark}${card}<div class="soundDockFixed"><div class="soundChestRow">${chests}</div><div class="soundHintFixed">Tap a sparkle. Then tap the matching sound chest.</div><div class="msg" id="soundMsg"></div></div></div>`;};
  window.showSoundCardQA=function(i){sndQA.active=i;speakSafe(sndQA.words[i]);renderSoundQA();};
  window.trySoundChestQA=function(t){if(sndQA.active===null){let m=$('soundMsg');if(m)m.textContent='Tap a sparkle first.';return;}let right=soundKey(sndQA.words[sndQA.active],sndQA.targets);if(String(right)===String(t)){sndQA.done[sndQA.active]=true;sndQA.active=null;sndQA.count++;try{addCoin&&addCoin()}catch(e){} if(sndQA.count>=sndQA.words.length){try{addGem&&addGem()}catch(e){} completeModal('sound',sndQA.i,`startSoundQA(${sndQA.i})`)}else renderSoundQA();}else{let m=$('soundMsg');if(m)m.textContent='Try another chest.';}};

  // COMPARE / ALLIGATOR
  const cmpRanges=[[1,5],[1,10],[10,15],[1,15],[10,20],[1,20],[1,20]];
  window.startCompareQA=function(i){setBg('home');let [lo,hi]=cmpRanges[i]||[1,20];let qs=[];while(qs.length<8){let a=lo+Math.floor(Math.random()*(hi-lo+1)),b=lo+Math.floor(Math.random()*(hi-lo+1));if(a!==b)qs.push({a,b});}window.cmpQA={i,q:0,qs,marked:[]};renderCompareQA();}; window.startCompare=window.startCompareQA;
  function gatorImg(sym){return sym==='>'?'gt_gator.png':sym==='<'?'lt_gator.png':'eq_gator.png';}
  window.renderCompareQA=function(){let q=cmpQA.qs[cmpQA.q],ready=cmpQA.marked.includes(q.a)&&cmpQA.marked.includes(q.b);getP().innerHTML=bar2('compare',`🐊 ${esc((levels.compare[cmpQA.i]||['Compare'])[0])}`,`${cmpQA.q+1}/8`)+`<div class="qaActivity2"><div class="qaCard2"><div class="numberLineFixed">${Array.from({length:20},(_,k)=>k+1).map(n=>`<button class="nlBtn ${cmpQA.marked.includes(n)?'hit':''}" onclick="tapCompareQA(${n})">${n}</button>`).join('')}</div><div class="qaPrompt">${ready?'Which number is larger? The alligator will eat the larger number.':'Tap both numbers on the number line.'}</div><div class="compareNumsFixed"><span>${q.a}</span><span>?</span><span>${q.b}</span></div>${ready?`<div class="gatorRowFixed"><button class="gatorBtnFixed" onclick="chooseCompareQA('>')"><img src="${gatorImg('>')}"></button><button class="gatorBtnFixed" onclick="chooseCompareQA('<')"><img src="${gatorImg('<')}"></button></div>`:''}<div class="msg" id="cmpMsg"></div></div></div>`;};
  window.tapCompareQA=function(n){let q=cmpQA.qs[cmpQA.q];if((n===q.a||n===q.b)&&!cmpQA.marked.includes(n))cmpQA.marked.push(n);renderCompareQA();};
  window.chooseCompareQA=function(sym){let q=cmpQA.qs[cmpQA.q],ans=q.a>q.b?'>':'<';if(sym===ans){try{addCoin&&addCoin()}catch(e){} cmpQA.q++;cmpQA.marked=[];if(cmpQA.q>=8){try{addGem&&addGem()}catch(e){} completeModal('compare',cmpQA.i,`startCompareQA(${cmpQA.i})`)}else renderCompareQA();}else{let m=$('cmpMsg');if(m)m.textContent='Try again.';}};

  // DRAGON COUNT
  window.startCountQA=function(i){setBg('home');window.cntQA={i,q:0};newCountQA();}; window.startCount=window.startCountQA;
  function countCfg(i){return [{max:10,skip:1,line:true},{max:10,skip:1},{max:20,skip:1},{max:20,skip:2},{max:20,skip:5},{max:20,skip:10},{max:20,skip:1}][i]||{max:10,skip:1};}
  function newCountQA(){let c=countCfg(cntQA.i),choices=[];if(c.skip===1){for(let n=1;n<=c.max;n++)choices.push(n)}else{for(let n=c.skip;n<=c.max;n+=c.skip)choices.push(n)}cntQA.target=choices[Math.floor(Math.random()*choices.length)];cntQA.hit=0;cntQA.groups=Array.from({length:Math.max(1,cntQA.target/c.skip)},(_,k)=>({x:c.line?12+k*8:10+Math.random()*78,y:c.line?42:14+Math.random()*58,done:false,label:'🪙'.repeat(c.skip)}));renderCountQA();}
  window.renderCountQA=function(){let c=countCfg(cntQA.i);getP().innerHTML=bar2('count',`🪙 ${esc((levels.count[cntQA.i]||['Count'])[0])}`,`${cntQA.q+1}/8`)+`<div class="qaActivity2"><div class="qaCard2"><div class="qaPrompt">${cntQA.hit<cntQA.groups.length?'Tap each coin while you count.':'How many coins did you count?'}</div><div class="coinAreaFixed">${cntQA.groups.map((g,i)=>`<button class="coinFixed" style="left:${g.x}%;top:${g.y}%" onclick="tapCountQA(${i})">${g.done?'✅':g.label}</button>`).join('')}</div>${cntQA.hit===cntQA.groups.length?`<div class="answerBtnsFixed">${Array.from({length:c.max},(_,k)=>k+1).map(n=>`<button onclick="answerCountQA(${n})">${n}</button>`).join('')}</div>`:''}<div class="msg" id="cntMsg"></div></div></div>`;};
  window.tapCountQA=function(i){let g=cntQA.groups[i];if(!g||g.done)return;g.done=true;cntQA.hit++;speakSafe(String(cntQA.hit*countCfg(cntQA.i).skip));renderCountQA();};
  window.answerCountQA=function(n){if(n===cntQA.target){try{addCoin&&addCoin()}catch(e){} cntQA.q++;if(cntQA.q>=8){try{addGem&&addGem()}catch(e){} completeModal('count',cntQA.i,`startCountQA(${cntQA.i})`)}else newCountQA();}else{let m=$('cntMsg');if(m)m.textContent='Try again.';}};

  // TEEN BUILDER
  window.startTeenQA=function(i){setBg('home');window.teenQA={i,q:0,recent:[],filled:new Set(),locked:new Set()};newTeenQA();}; window.startTeen=window.startTeenQA;
  function teenTargetQA(){let vals=Array.from({length:9},(_,k)=>k+11).filter(n=>!(teenQA.recent||[]).slice(-4).includes(n));let n=vals[Math.floor(Math.random()*vals.length)]||11;teenQA.recent=[...(teenQA.recent||[]),n].slice(-6);return n;}
  function baseTen(n){n=Number(n)||0;let rod='<div class="tenRod2">'+Array.from({length:10},()=>'<span></span>').join('')+'</div>';let cubes='<div class="oneCubeWrap2">'+Array.from({length:n%10},()=>'<div class="oneCube2"></div>').join('')+'</div>';return `<div class="baseTenPic2">${rod.repeat(Math.floor(n/10))}${cubes}</div>`;}
  function newTeenQA(){teenQA.filled=new Set();teenQA.locked=new Set();teenQA.target=teenTargetQA();if(teenQA.i===1){teenQA.base=3+Math.floor(Math.random()*6);teenQA.target=10;teenQA.locked=new Set(Array.from({length:teenQA.base},(_,k)=>k));teenQA.filled=new Set(teenQA.locked);}renderTeenQA();}
  window.renderTeenQA=function(){let i=teenQA.i,title=(levels.teen[i]||['Teen Builder'])[0]; if(i===1){let cells=Array.from({length:10},(_,k)=>`<button class="teenCell2 ${teenQA.locked.has(k)?'prefilled':teenQA.filled.has(k)?'filled':''}" onclick="toggleTeenQA(${k})">${teenQA.filled.has(k)?'🪙':''}</button>`).join('');getP().innerHTML=bar2('teen','🔟 Make a Ten',`${teenQA.q+1}/8`)+`<div class="qaActivity2"><div class="qaCard2"><div class="qaPrompt">Fill the frame to make 10.</div><div><b>${teenQA.base}+?=10</b></div><div class="teenFrame2">${cells}</div><button class="btn" onclick="checkTeenQA()">✅ Check</button><div class="msg" id="teenMsg"></div></div></div>`;return;} let target=teenQA.target, opts=shuffleLocal([target,...shuffleLocal(Array.from({length:9},(_,k)=>k+11).filter(n=>n!==target)).slice(0,2)]);getP().innerHTML=bar2('teen',`🔟 ${esc(title)}`,`${teenQA.q+1}/8`)+`<div class="qaActivity2"><div class="qaCard2"><div class="qaPrompt">Which picture shows ${target}?</div><div class="teenChoices2">${opts.map(n=>`<button class="teenChoice2" onclick="chooseTeenQA(${n})">${baseTen(n)}<b>${n}</b></button>`).join('')}</div><div class="msg" id="teenMsg"></div></div></div>`;};
  window.toggleTeenQA=function(k){if(teenQA.locked.has(k))return;teenQA.filled.has(k)?teenQA.filled.delete(k):teenQA.filled.add(k);renderTeenQA();};
  window.checkTeenQA=function(){if(teenQA.filled.size===10) nextTeenQA(); else {let m=$('teenMsg');if(m)m.textContent='Keep filling until there are 10.';}};
  window.chooseTeenQA=function(n){if(n===teenQA.target) nextTeenQA(); else {let m=$('teenMsg');if(m)m.textContent='Try again.';}};
  function nextTeenQA(){try{addCoin&&addCoin()}catch(e){} teenQA.q++; if(teenQA.q>=8){try{addGem&&addGem()}catch(e){} completeModal('teen',teenQA.i,`startTeenQA(${teenQA.i})`)}else newTeenQA();}

  // PATTERN GARDEN
  window.startPatternQA=function(i){setBg('pattern');window.patQA={i,q:0,qs:makePatQA(i)};renderPatternQA();}; window.startPattern=window.startPatternQA;
  function makePatQA(i){let types=['AB','ABB','AAB','ABC','MIX'], type=types[i]||'AB';let icons=[['💎','🌻','🌷'],['🌷','🦋','🍄'],['🌼','🐞','💎'],['🍄','🌻','🦋']];return Array.from({length:5},(_,idx)=>{let [A,B,C]=icons[idx%icons.length];let t=type==='MIX'?['AB','ABB','AAB','ABC'][idx%4]:type;let unit=t==='AB'?[A,B]:t==='ABB'?[A,B,B]:t==='AAB'?[A,A,B]:[A,B,C];let full=[];while(full.length<6)full.push(...unit);full=full.slice(0,6);let ans=full[5],seq=full.slice(0,5);let choices=shuffleLocal([ans+A,A+B,B+ans].filter((v,i,a)=>a.indexOf(v)===i)).slice(0,3);if(!choices.includes(ans))choices[0]=ans;return {seq,ans,choices:shuffleLocal(choices)};});}
  window.renderPatternQA=function(){let q=patQA.qs[patQA.q];getP().innerHTML=bar2('pattern',`🌷 ${(levels.pattern[patQA.i]||['Patterns'])[0]}`,`${patQA.q+1}/${patQA.qs.length}`)+`<div class="qaActivity2"><div class="qaCard2"><div class="qaPrompt">Fix the flower bed.</div><div class="patternLine2">${q.seq.map(esc).join(' ')} <span class="patternBlank2">?</span></div><div class="choices">${q.choices.map(c=>`<button class="patternChoice2" onclick="choosePatternQA('${js(c)}')">${esc(c)}</button>`).join('')}</div><div class="msg" id="patMsg"></div></div></div>`;};
  window.choosePatternQA=function(c){let q=patQA.qs[patQA.q]; if(String(c).includes(q.ans)){try{addCoin&&addCoin()}catch(e){} patQA.q++; if(patQA.q>=patQA.qs.length){try{addGem&&addGem()}catch(e){} completeModal('pattern',patQA.i,`startPatternQA(${patQA.i})`)}else renderPatternQA();}else{let m=$('patMsg');if(m)m.textContent='Try again.';}};

  setTimeout(()=>{try{updateTop&&updateTop()}catch(e){}},150);
})();
/* ===== END FINAL ROUTING + GAME QA PATCH ===== */
