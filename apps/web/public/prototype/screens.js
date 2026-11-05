/* ---------- render ---------- */
function render(){
  spFailCheck();
  pzCheck();
  judgeToday();
  save();
  if(pzActive()){$('app').innerHTML=pzHTML();$('ov').innerHTML='';$('pmod').innerHTML=V.judge?judgeHTML():'';pzStart();return}
  pzStop();
  document.documentElement.dataset.strict=S.strict?'on':'off';
  $('pmod').innerHTML=V.judge?judgeHTML():(V.pen?penModalHTML():'');
  const pages={home,quests,ai:aiPage,dungeons,health,stats};
  const nav=[['home','⌂','Home'],['quests','☑','Directives'],['ai','✦','AI'],['plus','＋',''],['dungeons','◎','Missions'],['health','♥','Health'],['stats','▮','Stats']];
  $('app').innerHTML=pages[V.p]()+(V.p==='ai'?chatBarHTML():'')+notesHTML()+'<nav class="nav" aria-label="Main">'+nav.map(n=>n[0]==='plus'?'<button class="fab" data-a="plus" aria-label="Create">＋</button>':'<button class="'+(V.p===n[0]?'on':'')+'" data-a="go" data-i="'+n[0]+'" '+(V.p===n[0]?'aria-current="page"':'')+'><span class="ic2" aria-hidden="true">'+n[1]+'</span>'+n[2]+'</button>').join('')+'</nav>';
  if(S.justJudged){S.justJudged=false;const el=document.getElementById('pend');if(el)el.scrollIntoView({behavior:'smooth',block:'center'})}
  const o=V.ov;
  if(!o){$('ov').innerHTML='';return}
  if(o.k==='sheet'){$('ov').innerHTML='<div class="sheet" data-a="close"><div>'+ovHTML()+'</div></div>';return}
  $('ov').innerHTML='<div class="ov" role="dialog" aria-modal="true"><div>'+ovHTML()+'</div></div>';
}
function act(a,i,el){sfx('tap');
  switch(a){
    case 'go':V.p=i;V.ov=null;break;
    case 'plus':V.ov={k:'sheet'};break;
    case 'open':V.ov={k:i};if(i==='nq'){V.nf={ty:'daily',fr:'all',days:[],stat:'',xp:15}}FV={};break;
    case 'close':V.ov=null;FV={};break;
    case 'tq':toggleQ(i);break;
    case 'qd':V.ov={k:'detail',id:i};V.mo=0;break;
    case 'endq':{const q=S.quests.find(x=>x.id===i);if(q){q.end=true;toast('Quest conquered.')}V.ov=null;break}
    case 'delq':if(confirm('Delete this quest and its history?')){S.quests=S.quests.filter(q=>q.id!==i);S.log=S.log.filter(e=>e.q!==i);V.ov=null}break;
    case 'sel':V.sel=i;break;
    case 'ex':V.ex[i]=!V.ex[i];break;
    case 'mo':V.mo+=+i;break;
    case 'af':V.af=i;break;
    case 'alloc':if(S.pts>0&&S.stats[i]!=null){S.pts--;S.stats[i]++}break;
    case 'reb':useRebound();break;
    case 'pen':S.penDay=dt(0);toast('Penalty cleared. Tomorrow is a fresh start.');break;
    case 'emg':emg();break;
    case 'jcq':jcq();break;
    case 'lbt':toast('Leaderboards need an online account. Your progress stays in this browser.');break;
    case 'dtab':V.dtab=i;break;
    case 'claim':claimMile(+i);break;
    case 'aisend':runAI();break;
    case 'addskill':addSkillManual();break;
    case 'claim1':claimReward(i);break;
    case 'penlog':{const t=(FV.pproof||'').trim();if(t.length<10){toast('Describe what you did, 10+ characters.');break}S.log.push({d:S.penaltyDate,q:'strict',k:'penserved',xp:0});rlogAdd('Strict penalty served');FV.pproof='';V.pen=false;toast('Penalty logged.');break}
    case 'penclose':V.pen=false;break;
    case 'claimall':claimAll();break;
    case 'dismiss':S.infoNotes=(S.infoNotes||[]).filter(x=>x.id!==i);break;
    case 'dismissall':S.infoNotes=[];break;
    case 'hf':V.hf=i;break;
    case 'pzsubmit':{const t=(FV.pzproof||'').trim();if(t.length<10){toast('Describe the completed directive, 10+ characters.');break}S.pz.done=true;hist('penalty','Survival directive completed: '+S.pz.task,0);pzCheck();FV.pzproof='';toast('Survival directive logged.');break}
    case 'judgeack':V.judge=false;break;
    case 'mic':dictate();break;
    case 'send':runAI();break;
    case 'startdetox':S.detox={s:dt(0),days:3,paid:false};rlogAdd('Detox started');toast('3-day detox started. Screens under 3 hours, logged nightly.');break;
    case 'detoxclaim':if(S.detox&&!S.detox.paid){S.detox.paid=true;gainXp(40);rlogAdd('Detox cleared: +40 XP');toast('[Detox] Cleared. +40 XP.')}break;
    case 'revertday':revertToday();break;
    case 'penserve':penServe(i);break;
    case 'mksp':mkSpecial();break;
    case 'spenter':spEnter(i);break;
    case 'spstep':spStep(i,+el.dataset.p);break;
    case 'spreport':V.ov={k:'report',id:i};FV={};break;
    case 'spsubmit':spSubmit(i);break;
    case 'starttimer':if(!S.timer){S.timer={q:i,start:Date.now()};toast('Timer started. Stay on it.')}break;
    case 'stoptimer':stopTimer();break;
    case 'cat':V.cat=i;break;
    case 'join':join(i);break;
    case 'dci':dCheck(i);break;
    case 'ph':togglePh(i,+el.dataset.p);break;
    case 'fty':V.nf.ty=i;break;
    case 'ffr':V.nf.fr=i;break;
    case 'fday':{const x=V.nf.days.indexOf(+i);x<0?V.nf.days.push(+i):V.nf.days.splice(x,1);break}
    case 'fst':V.nf.stat=i;break;
    case 'fxp':V.nf.xp=+i;break;
    case 'mkq':mkQuest();break;
    case 'mkl':mkList();break;
    case 'mkd':mkDungeon();break;
    case 'saveci':saveCheck();break;
    case 'buy':buy(+i);break;
    case 'addr':addReward();break;
    case 'arise':arise();break;
    case 'basedone':finishBase(false);break;
    case 'skipbase':finishBase(true);break;
    case 'accounts':V.ov={k:'localAccount'};FV={};break;
    case 'cancelAccounts':V.ov=null;FV={};break;
    case 'createLocalProfile':{
      if(!$('localConsent').checked){toast('Confirm browser storage consent before creating a profile.');break}
      try{
        const previousSave=HunterStorage.loadLegacyState();
        const result=HunterStorage.createProfile({
          name:FV.localProfileName||$('localProfileName').value,
          initialState:previousSave||S,
          localConsent:true,
          cloudConsent:!!($('cloudConsent')&&$('cloudConsent').checked)
        });
        S=Object.assign(FRESH(),result.state);
        if(window.HunterDB&&HunterDB.enabled)HunterDB.setUserId(result.profile.id);
        V.ov=S.base?null:{k:'base'};FV={};
        toast('Local profile created in this browser.');
      }catch(error){
        console.error('Could not create local profile.',error);
        toast(error.message||'Could not create a profile in this browser.');
      }
      break;
    }
    case 'useLocalProfile':{
      try{
        const result=HunterStorage.activateProfile(i);
        S=Object.assign(FRESH(),result.state||{});
        S.name=result.profile.name;
        if(window.HunterDB&&HunterDB.enabled)HunterDB.setUserId(result.profile.id);
        V.ov=S.base?null:{k:'base'};FV={};
        toast('Local profile selected.');
      }catch(error){
        console.error('Could not select local profile.',error);
        toast(error.message||'Could not select that profile.');
      }
      break;
    }
    case 'sessionOnly':
      HunterStorage.setSessionOnly();V.ov=S.base?null:{k:'base'};FV={};
      toast('Continuing without saving progress on this device.');
      break;
    case 'forgetLocalProfile':
      if(confirm('Delete this profile and its saved browser data? This cannot be undone.')){
        try{
          HunterStorage.forgetActiveProfile();
          S=FRESH();V.ov={k:'localAccount'};FV={};
          toast('Local profile data deleted.');
        }catch(error){
          console.error('Could not delete the local profile.',error);
          toast('Could not delete this profile from browser storage.');
        }
      }
      break;
    case 'rerun':V.ov={k:'base'};FV={};break;
    case 'exp':{const t=$('io');if(t)t.value=JSON.stringify(S);return}
    case 'imp':{try{const t=$('io').value,o=JSON.parse(t);if(!o||!o.quests||!o.stats)throw 0;S=Object.assign(FRESH(),o);toast('Backup imported.')}catch(e){toast('That backup text is not valid.')}break}
    case 'rst':if(confirm('Erase all progress? This cannot be undone.')){S=FRESH();V.ov=null;toast('Reset. Your Player starts fresh.')}break;
  }
  if(a!=='exp')chk();
  render();
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-a]');if(!b)return;
  if(b.classList.contains('sheet')&&e.target!==b)return;
  if(b.tagName==='INPUT'&&b.type==='checkbox'){ if(b.dataset.a==='ph'||b.dataset.a==='spstep'){act(b.dataset.a,b.dataset.i,b)} return }
  act(b.dataset.a,b.dataset.i,b);
});
document.addEventListener('input',e=>{const t=e.target;if(t.id)FV[t.id]=t.value});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.id)FV[t.id]=t.value;
  if(t.id==='per'){V.per=t.value;render();return}
  if(t.id==='nm'){S.name=t.value.trim()||'Player';save();render();return}
  if(t.id.indexOf('r_')===0){S.rules[t.id.slice(2)]=t.checked;save();return}
  if(t.id==='dial'){S.dial=+t.value;save();return}
  if(t.id==='sound'){S.sound=t.checked;save();if(t.checked)sfx('claim');return}
  if(t.id==='strict'){S.strict=t.checked;save();render();return}
  if(t.id==='pause'){S.pause=t.checked;save();render();return}
  if(t.id==='cloudSync'){
    try{
      const enabled=HunterStorage.setCloudConsent(t.checked);
      const profile=HunterStorage.activeProfile();
      if(window.HunterDB&&HunterDB.enabled){
        HunterDB.setUserId(profile.id);
        if(enabled)HunterDB.pushDebounced(S);
      }
      toast(enabled?'Database sync enabled for this profile.':'Database sync disabled for this profile.');
    }catch(error){
      console.error('Could not update database sync consent.',error);
      toast('Could not update database sync consent.');
      render();
    }
    return;
  }
  if(t.id==='nlist'||t.id==='dtp'){FV[t.id]=t.value;return}
  if(t.dataset.c!==undefined){const k=RANKS[S.rank];S.std[k]=S.std[k]||[];S.std[k][t.dataset.c]=Object.assign({},S.std[k][t.dataset.c],{c:t.checked});save();return}
  if(t.dataset.e!==undefined){const k=RANKS[S.rank];S.std[k]=S.std[k]||[];S.std[k][t.dataset.e]=Object.assign({},S.std[k][t.dataset.e],{e:t.value});save();return}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&V.ov){V.ov=null;FV={};render()}if(e.target.id==='aimsg'&&e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();act('aisend')}});
if(!S.firstDay)S.firstDay=dt(0);
if(S.pz&&!S.pz.resolved&&S.pz.date<=S.firstDay){S.pz.resolved=true}
SILENT=true;try{settle()}catch(e){}
applyStrictCheck();
if(!S.achInit){achList().forEach(a=>{if(a.f(ctx()))S.ach[a.id]=true});S.achInit=true}
chk();SILENT=false;
if(!HunterStorage.activeProfile()&&!HunterStorage.sessionOnly())V.ov={k:'localAccount'};
else if(!S.base&&!V.ov)V.ov={k:'base'};
(async()=>{
  try{
    const profile=HunterStorage.activeProfile();
    if(window.HunterDB&&HunterDB.enabled&&profile&&profile.cloudConsent){
      HunterDB.setUserId(profile.id);
      const remote=await HunterDB.pull();
      if(remote&&(remote.savedAt||0)>(S.savedAt||0)){S=Object.assign(FRESH(),remote);toast('Synced from your database.')}
    }
  }catch(e){console.error('Database sync failed.',e);toast('Database unavailable. Local profile data is unchanged.')}
  render();
})();
