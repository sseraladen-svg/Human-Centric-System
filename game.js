const KEY='hunter.v3';
const $=id=>document.getElementById(id);
const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const ymd=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const dt=o=>{const d=new Date();d.setDate(d.getDate()-(o||0));return ymd(d)};
const addD=(s,n)=>{const d=new Date(s+'T00:00');d.setDate(d.getDate()+n);return ymd(d)};
const diff=(a,b)=>Math.round((new Date(a+'T00:00')-new Date(b+'T00:00'))/864e5);
const wdOf=s=>new Date(s+'T00:00').getDay();
const STATS=['INT','STR','VIT','SENSE','CHA','WEALTH'];
const SN={INT:'Intelligence',STR:'Strength',VIT:'Vitality',SENSE:'Sense',CHA:'Charisma',WEALTH:'Wealth'};
const RANKS=['E','D','C','B','A','S','X'];
const TITLE=['Active','Consistent','Skilled','Reliable Professional','Leader','System Builder','Monarch'];
const FLOOR=[6,10,16,24,34,48];
const STD={
E:['I do what I said I would do, even when I do not feel like it','My sleep and wake routine is kept and logged honestly','A basic workout habit exists'],
D:['Routines run without negotiation','I recover fast after a miss, never two in a row','A daily deep-work block happens without a willpower fight'],
C:['I focus deeply for hours and finish what I start','One real skill shown by shipped output','Projects get completed, not abandoned'],
B:['Commitments kept and deadlines met','Hard days still completed under pressure','First real income or professional role in progress'],
A:['I make hard decisions and take feedback without ego','I mentor or help others (verifiable)','Public presence: writing, talks or open source'],
S:['A venture or product with real users or revenue','Delegation and automation in place','Money managed deliberately: budget, savings, investments','Monarch Trial: my net worth and company targets (write the numbers)']};
const SKILLS=[['Deep Focus','SENSE'],['Speed Reading','INT'],['Problem Solving','INT'],['Public Speaking','CHA'],['Negotiation','CHA'],['Cold Outreach','CHA'],['Strength Training','STR'],['Sleep Discipline','VIT'],['Budgeting','WEALTH'],['Investing','WEALTH']];
const DUNGEONS=[
{id:'g0',t:'Build your AI/ML resume',d:'One page, LaTeX. Projects framed as experience.',r:0,days:3,xp:300,cat:'Career',type:'std'},
{id:'g1',t:'Set up GitHub and LinkedIn',d:'Public profiles with your best projects pinned.',r:0,days:3,xp:300,cat:'Career',type:'std'},
{id:'g2',t:'Learn Something New Daily for 30 Days',d:'Learn one new thing every single day.',r:1,days:30,xp:1500,cat:'Learning',type:'std'},
{id:'g3',t:'Quit Social Media for 7 Days',d:'Delete the apps. A missed day fails the dungeon.',r:2,days:7,xp:800,cat:'Digital Detox',type:'double'},
{id:'g4',t:'Phone-Free First Hour for 14 Days',d:'No screen for the first hour after waking.',r:1,days:14,xp:800,cat:'Digital Detox',type:'std'},
{id:'g5',t:'No Sugar for 14 Days',d:'Cut added sugar completely.',r:3,days:14,xp:1000,cat:'Addiction',type:'std'},
{id:'g6',t:'Move 30 Minutes Daily for 30 Days',d:'Any workout counts. Just move.',r:3,days:30,xp:1200,cat:'Fitness',type:'std'},
{id:'g7',t:'Ship a Project in 14 Days',d:'Working, deployed, linked on your profile.',r:3,days:14,xp:1500,cat:'Career',type:'std'},
{id:'g8',t:'Red Gate: Cold Outreach to 10 People',d:'Message 10 people you have been avoiding.',r:4,days:7,xp:1200,cat:'Career',type:'gate'},
{id:'g9',t:'Monthly Boss: Land an Internship',d:'Clear all three phases to claim the loot.',r:3,days:30,xp:3000,cat:'Boss',type:'boss',ph:['Prepare resume and portfolio','Apply to 20 roles','Clear 3 interviews']},
{id:'g10',t:'Monthly Boss: Ship a Public Product',d:'Three phases from MVP to launch.',r:4,days:30,xp:4000,cat:'Boss',type:'boss',ph:['Build the MVP','Get 10 real users','Publish a launch post']}];
const EMG=[['Solve 3 coding problems in 1 hour','INT',100],['20 minutes of exercise, right now','STR',60],['Send 3 outreach messages','CHA',120],['45 minutes of deep work, phone away','SENSE',90],['Clean and organize your workspace','VIT',50],['Write tomorrow’s plan','WEALTH',50]];

const FRESH=()=>({name:'Player',sp:[],cskills:[],indep:{},claimed:{},maxLv:null,resetV4:false,strict:false,stab:100,hist:[],sound:true,penaltyDate:'',strictMsg:'',strictTask:'',aiLast:null,aiDay:null,rules:{autoGate:true,autoFocus:true,autoRebound:true,autoVit:true},rlog:[],timer:null,gates:[],mats:0,focusMin:0,xp:0,gold:0,pts:0,focus:'',stats:Object.fromEntries(STATS.map(s=>[s,5])),rank:0,stam:100,tok:0,tokMile:0,dial:1,pause:false,base:false,settled:dt(1),hidden:false,comeback:false,penDay:'',
lists:[],
quests:[],
log:[],ci:{},ach:{},dj:{},cd:[],std:{},jf:null,skills:{},shadows:[],inv:[],
shop:[{t:'A treat',c:150},{t:'Game night',c:300},{t:'A full day off',c:800}]});

function load(){try{const r=localStorage.getItem(KEY);if(r)return Object.assign(FRESH(),JSON.parse(r))}catch(e){}return FRESH()}
function save(){S.savedAt=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}if(window.HunterDB)HunterDB.pushDebounced(S)}
let S=load();
(S.cskills||[]).forEach(c=>{if(!SKILLS.some(x=>x[0]===c.name))SKILLS.push([c.name,c.stat])});
if(!S.resetV4){S.xp=0;S.pts=0;S.maxLv=0;S.claimed={};S.resetV4=true}
let V={p:'home',ov:null,per:'week',sel:'all',af:'All',dtab:'my',cat:'All',mo:0,ex:{},nf:null};
let FV={};

/* ---------- helpers ---------- */
function toast(m){const t=$('toast');t.textContent=m;t.style.display='block';clearTimeout(toast.h);toast.h=setTimeout(()=>t.style.display='none',2600)}
const START=[0];for(let i=0;i<50;i++)START.push(START[i]+40+5*i);
const lvlStart=L=>L<=50?START[L]:START[50]+(L-50)*500;
const lvlSize=L=>L<50?40+5*L:500;
const diminish=()=>1/(1+lvl()/40);
const lvl=()=>{if(S.xp>=START[50])return 50+Math.floor((S.xp-START[50])/500);let L=0;while(L<50&&S.xp>=START[L+1])L++;return L};
function gainXp(n){if(S.maxLv==null)S.maxLv=lvl();S.xp=Math.max(0,S.xp+n);const a=lvl(),b=S.maxLv;if(a>b){let p=0;for(let l=b+1;l<=a;l++)p+=2+Math.floor(l/5);S.maxLv=a;S.pts+=p;tr('Level','Level '+a+' · +'+p+'% growth');hist('level','Reached level '+a,0);levelFx(b,a);toast('+'+p+'% stat growth.')}}
const isDone=(id,d)=>S.log.some(e=>e.q===id&&e.d===d&&e.k==='done');
const hasK=(id,d,k)=>S.log.some(e=>e.q===id&&e.d===d&&e.k===k);
const dueOn=(q,d)=>q.ty==='daily'&&q.created<=d&&(q.fr==='all'||q.days.includes(wdOf(d)));
const allD=()=>DUNGEONS.concat(S.cd);

function dayState(d){
  const due=S.quests.filter(q=>dueOn(q,d));
  if(!due.length)return 'none';
  if(S.log.some(e=>e.d===d&&e.k==='rebound'))return 'ok';
  if(S.log.some(e=>e.d===d&&e.k==='slip'))return 'miss';
  if(due.every(q=>isDone(q.id,d)))return 'ok';
  return d===dt(0)?'pending':'miss';
}
function streak(){let n=0;for(let i=0;i<800;i++){const s=dayState(dt(i));if(s==='miss')break;if(s==='ok')n++}return n}
function bestStreak(){let first=dt(0);S.quests.forEach(q=>{if(q.created<first)first=q.created});let best=0,run=0,d=first;for(let i=0;i<800&&d<=dt(0);i++){const s=dayState(d);if(s==='miss')run=0;else if(s==='ok'){run++;best=Math.max(best,run)}d=addD(d,1)}return best}
const mult=()=>{const s=streak();return s>=100?1.5:s>=30?1.25:s>=7?1.1:1};
const skLv=n=>1+Math.min(9,Math.floor((S.skills[n]||0)/5));
function skBonus(stat){const l=SKILLS.filter(s=>s[1]===stat).map(s=>skLv(s[0]));return 1+0.02*((l.length?Math.max(...l):1)-1)}
function practice(stat,n){SKILLS.filter(s=>s[1]===stat).forEach(s=>{S.skills[s[0]]=(S.skills[s[0]]||0)+(n||1)})}
const doneDates=()=>{const m={};S.log.forEach(e=>{if(e.k==='done')m[e.d]=(m[e.d]||0)+1});return m};
function lastDoneBefore(d){const ds=S.log.filter(e=>e.k==='done'&&e.d<d).map(e=>e.d).sort();return ds[ds.length-1]||''}
function awayDays(){const l=lastDoneBefore(dt(0));return l?diff(dt(0),l):0}
function penaltyDue(){let n=0;for(let i=1;i<60;i++){if(dayState(dt(i))==='miss')n++;else if(dayState(dt(i))==='ok')break;}return n>=3&&S.penDay!==dt(0)?n:0}
function reboundAvail(){const y=dt(1);return S.tok>0&&S.log.some(e=>e.d===y&&e.k==='slip')}
function expires(q){if(q.ty==='emerg')return 'Today only';if(!q.tl)return '';const[h,m]=q.tl.split(':').map(Number);const e=new Date();e.setHours(h,m,0,0);const mins=Math.round((e-new Date())/6e4);return mins>0?Math.floor(mins/60)+'h '+(mins%60)+'m':'Expired'}

/* ---------- engine ---------- */
function settle(){
  const y=dt(1);let g=0;
  while(S.settled<y&&g++<120){
    const d=addD(S.settled,1);
    S.quests.forEach(q=>{
      if(dueOn(q,d)&&q.created<=d&&!isDone(q.id,d)&&!hasK(q.id,d,'slip')){const x=S.pause?0:-q.xp;S.log.push({d,q:q.id,k:'slip',xp:x});gainXp(x)}
      if(q.ty==='emerg'&&q.created===d&&!q.end){const x=S.pause?0:-Math.round(q.xp/2);S.log.push({d,q:q.id,k:'emslip',xp:x});gainXp(x);q.end=true}
    });
    allD().forEach(t=>{const j=S.dj[t.id];if(!j||j.done||j.fail||t.type!=='double')return;if(j.s<d&&j.days.indexOf(d)<0){j.fail=true;const x=S.pause?0:-100;S.log.push({d,q:t.id,k:'dfail',xp:x});gainXp(x)}});
    const dueA=S.quests.filter(q=>dueOn(q,d));
    if(dueA.length){let dl=0;dueA.forEach(q=>{if(!isDone(q.id,d))dl-=q.tl?8:2});if(dl===0)dl=3;S.stab=Math.max(0,Math.min(100,(S.stab==null?100:S.stab)+dl))}
    S.settled=d;
  }
  { const y2=dt(1); const mq=S.quests.filter(q=>q.ty==='daily'&&dueOn(q,y2)&&!isDone(q.id,y2)); if(mq.length)pzCreate(y2,mq[0].stat); }
  gatesAuto();
  const st=streak(),mile=Math.floor(st/7);
  if(mile<S.tokMile)S.tokMile=mile;
  if(S.rules.autoRebound&&mile>S.tokMile){const n=mile-S.tokMile;S.tok+=n;S.tokMile=mile;toast('[Rebound Token] +'+n+'. Use one to forgive a missed day.')}
}
function toggleQ(id){
  if(pzActive())return;
  const q=S.quests.find(x=>x.id===id);if(!q)return;const d=dt(0);
  if(q.ty==='penalty'){
    const e=S.log.find(x=>x.q===id&&x.d===d&&x.k==='pen');
    if(e){S.log=S.log.filter(x=>x!==e);gainXp(-e.xp)}
    else{const x=S.pause?0:-q.xp;S.log.push({d,q:id,k:'pen',xp:x});gainXp(x);toast('[Penalty] '+q.t+(x?' '+x+' XP':''))}
    return;
  }
  const e=S.log.find(x=>x.q===id&&x.d===d&&x.k==='done');
  if(e){S.log=S.log.filter(x=>x!==e);gainXp(-e.xp);S.gold=Math.max(0,S.gold-10);S.stats[q.stat]=Math.max(5,S.stats[q.stat]-1);if(q.ty!=='daily')q.end=false;return}
  if(q.xp>=25&&S.stam<20){toast('Low stamina. Rest or check in tonight before hard quests.');return}
  const x=Math.max(1,Math.round(q.xp*mult()*skBonus(q.stat)*diminish()*fxMult()*debuffMult()))+Math.min(10,S.shadows.length)*2;
  const prev=lastDoneBefore(d);
  S.log.push({d,q:id,k:'done',xp:x,stat:q.stat});gainXp(x);S.gold+=10;S.stats[q.stat]+=1;practice(q.stat);
  if(q.ty!=='daily')q.end=true;
  if(prev&&diff(d,prev)>=3&&!S.comeback){S.comeback=true;S.log.push({d,q:'comeback',k:'bonus',xp:50});gainXp(50);toast('[Comeback] Title earned. +50 XP')}
  if(!S.hidden&&streak()>=3){S.hidden=true;S.quests.push({id:'h'+Date.now(),t:'Hidden: do one act of service nobody asked for',ty:'hidden',xp:150,stat:'CHA',fr:'all',days:[],tl:'',created:d,end:false,list:''});toast('[Hidden Quest] Unlocked.')}
  hist('done',q.t,x);sfx('complete');toast('[Quest Complete] '+q.t+' +'+x+' XP');
  gatesAuto();
}
function useRebound(){
  const y=dt(1);if(S.tok<1){toast('No rebound tokens yet. Earn one per 7-day streak.');return}
  const slips=S.log.filter(e=>e.d===y&&e.k==='slip');if(!slips.length){toast('Nothing to forgive yesterday.');return}
  slips.forEach(e=>{S.log=S.log.filter(x=>x!==e);gainXp(-e.xp)});
  S.log.push({d:y,q:'rebound',k:'rebound',xp:0});S.tok--;toast('[Rebound] Yesterday is forgiven. Tokens left: '+S.tok);
}
function emg(){
  if(S.quests.some(q=>q.ty==='emerg'&&!q.end)){toast('An emergency quest is already active.');return}
  const p=EMG[Math.floor(Math.random()*EMG.length)];
  S.quests.push({id:'e'+Date.now(),t:p[0],ty:'emerg',xp:p[2],stat:p[1],fr:'all',days:[],tl:'',created:dt(0),end:false,list:''});
  toast('[Emergency Quest] Finish today or lose '+Math.round(p[2]/2)+' XP.');
}
function jcq(){
  const r=S.rank;if(r>=6){toast('You are already Monarch.');return}
  const k=RANKS[r],c=S.std[k]||[],bad=[];
  STD[k].forEach((t,i)=>{const x=c[i]||{};if(!x.c||(x.e||'').trim().length<8)bad.push('Standard: "'+t+'". Tick it and add evidence (8+ characters).')});
  STATS.forEach(s=>{if(S.stats[s]<FLOOR[r])bad.push(SN[s]+' is '+S.stats[s]+', needs '+FLOOR[r])});
  if(bad.length){S.jf=bad;toast('Job Change Quest failed. See what is missing.');return}
  S.jf=null;S.rank=r+1;S.log.push({d:dt(0),q:'rank',k:'bonus',xp:200});gainXp(200);toast('[Tier Up] '+tier(S.rank)+': '+TITLE[S.rank]+'. +200 XP');
}
function join(id){
  const t=allD().find(x=>x.id===id);if(!t||S.dj[id])return;
  if(t.r>S.rank&&!confirm('This dungeon is above your rank. The System warns you: you are under-prepared. Enter anyway?'))return;
  S.dj[id]={s:dt(0),days:[],done:false,fail:false,ph:(t.ph||[]).map(()=>false)};V.dtab='my';toast('Mission entered.');
}
function finish(t,id){
  const j=S.dj[id];if(j.done)return;j.done=true;
  const x=t.type==='double'?t.xp*2:t.xp;S.log.push({d:dt(0),q:id,k:'dclear',xp:x});gainXp(x);
  const r=Math.random(),loot=r<.6?['Common',50]:r<.9?['Rare',120]:['Epic',250];S.gold+=loot[1];
  hist('dungeon',t.t,x);sfx('complete');toast('[Mission Cleared] '+t.t+' +'+x+' XP. '+loot[0]+' loot, +'+loot[1]+' gold.');
}
function dCheck(id){
  const t=allD().find(x=>x.id===id),j=S.dj[id];if(!t||!j||j.done||j.fail)return;const d=dt(0);
  if(j.days.indexOf(d)>=0){toast('Already checked in today.');return}
  j.days.push(d);if(j.days.length>=t.days)finish(t,id);else toast('Check-in saved. '+(t.days-j.days.length)+' days left.');
}
function togglePh(id,p){const t=allD().find(x=>x.id===id),j=S.dj[id];if(!t||!j||j.done)return;j.ph[p]=!j.ph[p];if(j.ph.every(Boolean))finish(t,id)}
function mkQuest(){
  const t=(FV.nt||'').trim(),nf=V.nf;
  if(!t){toast('Give the quest a title.');return}
  if(!nf.stat){toast('Pick a stat this quest trains.');return}
  S.quests.push({id:'q'+Date.now(),t,ty:nf.ty,xp:nf.xp,stat:nf.stat,fr:nf.fr,days:nf.days.slice(),tl:FV.ntl||'',created:dt(0),end:false,list:FV.nlist||''});
  V.ov=null;FV={};toast('Quest created.');
}
function mkList(){const n=(FV.ln||'').trim();if(!n){toast('Name the list.');return}if(S.lists.indexOf(n)<0)S.lists.push(n);V.ov=null;FV={};toast('List created.')}
function mkDungeon(){
  const t=(FV.dn||'').trim();if(!t){toast('Give the mission a title.');return}
  const type=FV.dtp||'std';const id='c'+Date.now();
  S.cd.push({id,t,d:'Custom mission.',r:S.rank,days:Math.max(1,+(FV.dd||14)),xp:Math.max(100,+(FV.dx||800)),cat:'Custom',type,ph:type==='boss'?['Phase 1','Phase 2','Phase 3']:undefined});
  V.ov=null;V.cat='All';V.dtab='ex';FV={};toast('Mission created.');
}
function saveCheck(){
  const sl=FV.sl,sc=FV.sc;if(sl===undefined||sl===''||sc===undefined||sc===''){toast('Enter your sleep and screen hours.');return}
  const d=dt(0),first=!S.ci[d];S.ci[d]={sl:+sl,sc:+sc,rf:(FV.rf||'').trim()};
  if(first){const h=+sl;S.stam=Math.max(0,Math.min(100,S.stam+(h>=7?25:h<5?-30:-10)))}
  autoVit();
  V.ov=null;FV={};toast('Check-in saved. Stamina '+S.stam+'.');
}
function buy(i){const s=S.shop[i];if(!s)return;if(S.gold>=s.c){S.gold-=s.c;S.inv.push(s.t+' ('+dt(0)+')');toast('Bought: '+s.t+'. You earned it.')}else toast('Not enough gold yet.')}
function addReward(){const t=(FV.rt||'').trim();if(!t){toast('Name the reward.');return}S.shop.push({t,c:Math.max(1,+(FV.rc||200))});FV.rt='';toast('Reward added.')}
function arise(){
  const n=(FV.sn||'').trim(),e=(FV.se||'').trim();
  if(!n){toast('Name the alter.');return}if(e.length<8){toast('Write the proof: what it does and what it saves you (8+ characters).');return}
  S.shadows.push({n,e,d:dt(0)});S.log.push({d:dt(0),q:'shadow',k:'shadow',xp:100});gainXp(100);FV.sn='';FV.se='';toast('[Arise] '+n+' joined your army. +100 XP');
}
function finishBase(skip){
  if(!skip){
    const sl=+(FV.bs||7),wo=+(FV.bw||1),dh=+(FV.bd||1),weak=FV.bweak||'VIT';
    if(sl>=7)S.stats.VIT+=2;if(wo>=3)S.stats.STR+=2;if(dh>=2)S.stats.SENSE+=2;
    S.focus=weak;S.dial=+(FV.bdial||1);S.stam=sl>=7?90:sl<5?50:70;
  }
  S.base=true;V.ov=null;FV={};toast(skip?'Skipped. You can run the assessment again from Menu.':'Baseline set. Your starting stats are ready.');
}
function ctx(){return{xp:S.xp,lv:lvl(),bs:bestStreak(),cn:S.log.filter(e=>e.k==='done').length,qn:S.quests.length,dn:S.log.filter(e=>e.k==='dclear').length}}
function achList(){const A=[];
for(let n=2;n<=52;n++)A.push({id:'L'+n,c:'Level',t:'Level '+n,d:'Reach level '+n,x:20+n*5,f:c=>c.lv>=n});
[100,250,500,1000,2500,5000,10000,25000,50000].forEach(v=>A.push({id:'X'+v,c:'XP',t:v+' XP',d:'Earn '+v+' total XP',x:Math.round(v/20)+10,f:c=>c.xp>=v}));
[3,7,14,30,50,100,200,365].forEach(v=>A.push({id:'S'+v,c:'Streak',t:v+' Day Streak',d:'Reach a '+v+' day streak',x:v,f:c=>c.bs>=v}));
[1,10,50,100,250,500].forEach(v=>A.push({id:'A'+v,c:'Activity',t:v+' Completions',d:'Complete '+v+' quests',x:v+10,f:c=>c.cn>=v}));
[1,5,10,25].forEach(v=>A.push({id:'Q'+v,c:'Quests',t:v+' Quests',d:'Create '+v+' quests',x:v*5+10,f:c=>c.qn>=v}));
[1,3,5,10].forEach(v=>A.push({id:'D'+v,c:'Missions',t:v+' Missions Cleared',d:'Clear '+v+' missions',x:v*20+20,f:c=>c.dn>=v}));
return A}
function chk(){const A=achList();for(let k=0;k<6;k++){let hit=false;const c=ctx();A.forEach(a=>{if(!S.ach[a.id]&&a.f(c)){S.ach[a.id]=true;S.log.push({d:dt(0),q:a.id,k:'ach',xp:a.x});gainXp(a.x);hit=true;toast('[Achievement] '+a.t+' +'+a.x+' XP')}});if(!hit)break}}
function titlesOf(){const c=ctx(),o=[TITLE[0]];if(S.rank>0)o.push(TITLE[S.rank]);
if(c.cn>=10)o.push('Shipper');if(c.bs>=7)o.push('Iron Mind');if(S.quests.some(q=>q.ty==='goal'&&q.end))o.push('Closer');if(S.comeback)o.push('Comeback');
if(allD().some(t=>t.type==='double'&&S.dj[t.id]&&S.dj[t.id].done))o.push('Risk Taker');
if(allD().some(t=>t.type==='boss'&&S.dj[t.id]&&S.dj[t.id].done))o.push('Boss Slayer');
return[...new Set(o)]}
function report(){
  const T=S.dial|0,L=[],days=[1,2,3,4,5,6,7].map(i=>dt(i));
  if(S.pause)return['System paused. No penalties or reports while paused.'];
  S.quests.filter(q=>q.ty==='daily'&&!q.end).forEach(q=>{let n=0,m=0;days.forEach(d=>{if(d<q.created)return;n++;if(!isDone(q.id,d))m++});
    if(n>=4&&m>=3)L.push([q.t+' was missed '+m+' of the last '+n+' days. Worth looking at why.',q.t+' skipped '+m+' of '+n+' days. You are not busy, you are avoiding it.',q.t+' skipped '+m+' of '+n+' days. Stop negotiating with yourself and do it.'][T])});
  const cks=days.map(d=>S.ci[d]).filter(Boolean);
  if(cks.length>=4){const sl=cks.reduce((a,c)=>a+c.sl,0)/cks.length,sc=cks.reduce((a,c)=>a+c.sc,0)/cks.length;
    if(sl<5)return['Sleep is averaging '+sl.toFixed(1)+' hours. Rest comes first, so the System is easing off. If this has been wearing on you, talk to someone you trust.'];
    if(sc>=5)L.push(['Screen time averages '+sc.toFixed(1)+' hours. That is a lot of focus spent elsewhere.','Screen time averages '+sc.toFixed(1)+' hours. That time is coming out of your goals.','Screen time averages '+sc.toFixed(1)+' hours. Your phone is winning.'][T]);
    if(sl<6.5)L.push('Sleep averages '+sl.toFixed(1)+' hours. Vitality is the base of every other stat.');
    const ex=(cks.map(c=>c.rf||'').join(' ').match(/tired|busy|later|tomorrow|no time/gi)||[]).length;
    if(ex>=3)L.push(['Your reflections mention tired, busy, later or tomorrow '+ex+' times. Notice the pattern.','Your reflections mention tired, busy, later or tomorrow '+ex+' times. That is a pattern, not a reason.','Excuse words appear '+ex+' times in your reflections. Stop writing the story and do the work.'][T]);
  }
  const pd=penaltyDue();if(pd)L.push('Penalty Quest: 45 minutes of focused work with your phone out of the room, then a hard workout. '+pd+' days in a row missed.');
  const sk=streak();if(sk>=3)L.push(sk+' days in a row with real output. Keep the standard.');
  if(!L.length)L.push(cks.length<4?'Not enough data yet. Close at least 4 days of check-ins.':'No red flags this week. Keep the standard.');
  return L;
}

/* ---------- views ---------- */
const expChips=q=>{const e=expires(q);return e&&e!=='Expired'?'<span class="chip or">⏱ '+esc(e)+'</span>':e==='Expired'?'<span class="chip rd">Expired</span>':''};
function qRow(q){
  const d=dt(0),done=q.ty==='penalty'?hasK(q.id,d,'pen'):(q.ty==='daily'?isDone(q.id,d):(q.end||false));
  const tag=q.ty==='penalty'?'<span class="chip rd">⚠ Penalty</span><span class="chip rd">−'+q.xp+' XP</span>':
    '<span class="chip ac">'+(q.ty==='daily'?'⟳ Daily':q.ty==='goal'?'⚑ Goal':q.ty==='emerg'?'‼ Emergency':'✦ Hidden')+'</span><span class="chip '+(q.xp>=25?'or':'gr')+'">+'+q.xp+' XP</span><span class="chip">'+esc(q.stat)+'</span>'+expChips(q);
  return '<div class="q'+(done?' done':'')+'"><button class="box" data-a="tq" data-i="'+q.id+'" aria-label="Complete '+esc(q.t)+'" aria-pressed="'+done+'">'+(done?'✓':'')+'</button><button class="qbody" data-a="qd" data-i="'+q.id+'"><div class="qt">'+esc(q.t)+'</div><div class="chips">'+tag+'</div></button><span class="chev" aria-hidden="true">›</span></div>';
}
function listCard(name){
  const qs=S.quests.filter(q=>q.list===name&&!q.end||q.list===name&&q.ty==='penalty'),d=dt(0);
  const act=qs.filter(q=>q.ty==='daily'?dueOn(q,d):true);
  const dn=act.length&&act.every(q=>q.ty==='penalty'?true:(q.ty==='daily'?isDone(q.id,d):q.end));
  const open=V.ex[name];
  return '<div class="cd"><button class="row" style="width:100%;background:none;border:0;color:var(--ink);padding:0;font:inherit;cursor:pointer" data-a="ex" data-i="'+esc(name)+'" aria-expanded="'+!!open+'"><span style="width:60px;height:60px;border-radius:50%;border:5px solid var(--ac);display:grid;place-items:center;font-size:24px;color:var(--at);flex:none">'+(dn?'✓':'')+'</span><span style="flex:1;text-align:left"><b style="font-size:23px;font-weight:600">'+esc(name)+'</b><br><span class="mu">'+act.length+' quests</span></span><span class="mu" style="font-size:22px">'+(open?'⌃':'⌄')+'</span></button>'+(open?'<div style="margin-top:14px">'+act.map(qRow).join('')+'</div>':'')+'</div>';
}
function home(){
  const d=dt(0),L=lvl(),inL=S.xp-lvlStart(L),lsz=lvlSize(L),st=streak(),td=S.quests.filter(q=>dueOn(q,d)),dn=td.filter(q=>isDone(q.id,d)).length;
  const xpToday=S.log.filter(e=>e.d===d).reduce((a,e)=>a+e.xp,0);
  const pd=penaltyDue(),away=awayDays(),reb=reboundAvail();
  const active=S.quests.filter(q=>q.ty!=='daily'&&!q.end&&q.ty!=='penalty');
  const pens=S.quests.filter(q=>q.ty==='penalty');
  const tiles=[['Today XP','+'+xpToday,'⚡'],['Streak',st+' days','🔥'],['Total XP',S.xp,'★']];
  return '<div class="row sb"><div class="row"><div class="av" aria-hidden="true">⚔</div><div><div class="at" style="font-weight:600">Welcome back, Player</div><div style="font-size:30px;font-weight:600;line-height:1.1">'+esc(S.name)+'</div></div></div><button class="ico" data-a="open" data-i="menu" aria-label="Menu">☰</button></div>'
  +'<div class="row" style="margin:16px 0 14px"><button class="pill" style="flex:1" data-a="open" data-i="rank">↗ Level Path</button><button class="pill" style="flex:1" data-a="lbt">🏆 Leaderboard</button></div>'
  +'<div class="cd"><div class="row"><div class="lvl"><small>LEVEL</small><b>'+L+'</b></div><div style="flex:1"><div class="at" style="font-size:13px;letter-spacing:.18em;font-weight:700">PLAYER '+tier(S.rank)+'</div><div style="font-size:23px;font-weight:600;margin-top:4px">STATUS: '+TITLE[S.rank].toUpperCase()+'</div><div class="hint">Tier changes only by Job Change Quest.</div></div></div>'
  +'<div class="row sb" style="margin-top:16px"><b style="font-size:22px">'+inL+' XP</b><span class="mu">'+lsz+' XP to next</span></div><div class="bar" role="progressbar" aria-valuenow="'+inL+'" aria-valuemin="0" aria-valuemax="'+lsz+'"><i style="width:'+(inL/lsz*100)+'%"></i></div>'
  +'<div class="row sb" style="margin-top:14px"><span class="mu">Stamina '+S.stam+'/100</span><span class="or" style="font-weight:600">Gold '+S.gold+'</span></div><div class="bar o"><i style="width:'+S.stam+'%"></i></div>'
  +(S.stam<30?'<div class="note r">Low stamina. Rest before hard quests. Check in tonight.</div>':'')+'</div>'
  +'<div class="grid4" style="margin-bottom:14px"><button class="pill" data-a="open" data-i="ci">☾ Check-in</button><button class="pill" data-a="open" data-i="shop">🛒 Shop</button><button class="pill" data-a="open" data-i="shd">✦ Alters</button><button class="pill" data-a="emg">‼ Emergency</button></div>'
  +(pd?'<div class="cd" style="border-color:var(--rd)"><b class="rd" style="font-size:19px">⚠ Penalty Quest</b><div class="mu" style="margin-top:6px">'+pd+' days in a row missed. 45 minutes of focused work with your phone out of the room, then a hard workout.</div><button class="btn" data-a="pen">Clear the penalty</button></div>':'')
  +(reb?'<div class="cd"><b style="font-size:18px">Rebound Token ready ('+S.tok+')</b><div class="mu" style="margin:6px 0 8px">Forgive yesterday\'s miss. No XP lost.</div><button class="btn ghost" data-a="reb">Use token on yesterday</button></div>':'')
  +(away>=3&&!S.comeback&&Object.keys(doneDates()).length?'<div class="cd" style="border-color:var(--or)"><b style="font-size:19px">↺ Reawakening Quest</b><div class="mu" style="margin-top:6px">You have been away '+away+' days. Complete one core quest today to restore momentum and earn the Comeback title.</div></div>':'')
  +todayTools()+penaltiesCard()+claimCard()+gateCards()+timerCard()+'<div class="cd"><div class="row sb"><b style="font-size:22px;font-weight:500">Today’s Progress</b><span class="chip">'+dn+'/'+td.length+'</span></div><div class="bar"><i style="width:'+(td.length?dn/td.length*100:0)+'%"></i></div></div>'
  +'<div class="row" style="margin-bottom:14px">'+tiles.map(t=>'<div class="tile"><span aria-hidden="true">'+t[2]+'</span><b>'+esc(t[1])+'</b><span class="mu">'+t[0]+'</span></div>').join('')+'</div>'
  +'<div class="cd"><div class="row wrap">'+titlesOf().map(t=>'<span class="chip ac">'+esc(t)+'</span>').join('')+'</div></div>'
  +'<div class="cd" style="border-color:var(--ac)"><div class="row"><span>🧠</span><b style="font-size:18px">System report</b></div>'+report().map(l=>'<div class="note" style="margin-top:8px">'+esc(l)+'</div>').join('')+'</div>'
  
  +'<div class="sec"><span class="ico" style="width:36px;height:36px;font-size:16px">⚡</span>Quests</div>'
  +(td.map(qRow).join('')||'')
  +active.map(qRow).join('')
  +pens.map(qRow).join('')
  +(!td.length&&!active.length&&!pens.length?'<div class="cd mu">No quests yet. Use + to create one.</div>':'');
}
function quests(){
  const act=V.sel!=='done',d=dt(0);
  const list=S.quests.filter(q=>act?!q.end||q.ty==='penalty'||q.ty==='daily':q.end);
  const daily=list.filter(q=>q.ty==='daily'&&!q.list&&(!act||dueOn(q,d)));
  const goals=list.filter(q=>q.ty==='goal'&&!q.list);
  const special=list.filter(q=>(q.ty==='hidden'||q.ty==='emerg')&&!q.list);
  const pens=list.filter(q=>q.ty==='penalty'&&!q.list);
  const done=S.log.filter(e=>e.d===d&&e.k==='done');
  return '<h1>Directives</h1><div class="seg" role="tablist"><button role="tab" aria-selected="'+act+'" class="'+(act?'on':'')+'" data-a="sel" data-i="all">Active</button><button role="tab" aria-selected="'+!act+'" class="'+(act?'':'on')+'" data-a="sel" data-i="done">Done</button></div>'
  +(act?(S.lists.length?'<div class="sec"><span class="ico" style="width:36px;height:36px;font-size:16px">≡</span>Quest Lists<span class="cnt">'+S.lists.length+'</span></div>'+S.lists.map(listCard).join(''):'')
   +'<div class="sec"><span class="ico" style="width:36px;height:36px;font-size:16px">⟳</span>Mandatory Protocols<span class="cnt">'+daily.length+'</span></div>'+(daily.map(qRow).join('')||'<div class="cd mu">No daily quests due today.</div>')
   +(goals.length?'<div class="sec"><span class="ico" style="width:36px;height:36px;font-size:16px">⚑</span>Goals<span class="cnt">'+goals.length+'</span></div>'+goals.map(qRow).join(''):'')
   +spList('quest')+(special.length?'<div class="sec"><span class="ico" style="width:36px;height:36px;font-size:16px">✦</span>Special<span class="cnt">'+special.length+'</span></div>'+special.map(qRow).join(''):'')
   +(pens.length?'<div class="sec"><span class="ico" style="width:36px;height:36px;font-size:16px">⚠</span>Penalties<span class="cnt">'+pens.length+'</span></div>'+pens.map(qRow).join(''):'')
   :'<div class="sec">Completed</div>'+(list.length?list.map(qRow).join(''):'<div class="cd mu">Nothing completed yet.</div>')+'<div class="sec">Today</div>'+(done.length?done.map(e=>{const q=S.quests.find(x=>x.id===e.q);return q?'<div class="cd row sb"><span>'+esc(q.t)+'</span><span class="gr">+'+e.xp+' XP</span></div>':''}).join(''):'<div class="cd mu">No quests completed today.</div>'));
}
function radar(){const mx=Math.max(48,...STATS.map(s=>S.stats[s]));let pts=[],g='';
  STATS.forEach((s,i)=>{const an=(-90+i*60)*Math.PI/180,rr=(S.stats[s]/mx)*100;pts.push([140+rr*Math.cos(an),130+rr*Math.sin(an)]);
  g+='<line x1="140" y1="130" x2="'+(140+100*Math.cos(an))+'" y2="'+(130+100*Math.sin(an))+'" style="stroke:var(--bd)"/><text x="'+(140+122*Math.cos(an))+'" y="'+(135+116*Math.sin(an))+'" style="fill:var(--mu)" font-size="14" text-anchor="middle">'+s+'</text>'});
  return '<svg viewBox="0 0 280 270" width="100%" role="img" aria-label="Stat radar">'+g+'<polygon points="'+pts.map(p=>p.join(',')).join(' ')+'" style="fill:var(--ac);stroke:var(--ac)" fill-opacity=".3" stroke-width="2.5"/>'+pts.map(p=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4" style="fill:var(--ac)"/>').join('')+'</svg>'}
function line(v,lb,col,pj){const W=340,H=200,x0=34,x1=W-12,top=20,bt=H-34;const nums=v.filter(x=>x!=null);const mx=Math.max(3,...nums,pj||0);
  const X=i=>x0+i*(x1-x0)/(v.length-1),Y=a=>bt-(a/mx)*(bt-top);let s='<svg viewBox="0 0 '+W+' '+H+'" width="100%" role="img" aria-label="Trend chart">';
  [0,1,2,3].forEach(t=>{const a=mx*t/3,y=Y(a);s+='<line x1="'+x0+'" x2="'+x1+'" y1="'+y+'" y2="'+y+'" style="stroke:var(--bd)" stroke-dasharray="4 5"/><text x="4" y="'+(y+5)+'" style="fill:var(--mu)" font-size="13">'+Math.round(a)+'</text>'});
  lb.forEach((l,i)=>{s+='<text x="'+X(i)+'" y="'+(H-8)+'" style="fill:var(--mu)" font-size="13" text-anchor="middle">'+l+'</text>'});
  const P=[];v.forEach((a,i)=>{if(a!=null)P.push([X(i),Y(a)])});
  if(P.length>1){const dd=P.map((p,i)=>(i?'L':'M')+p[0]+','+p[1]).join(' ');s+='<path d="'+dd+' L'+P[P.length-1][0]+','+bt+' L'+P[0][0]+','+bt+'Z" style="fill:'+col+'" opacity=".2"/><path d="'+dd+'" fill="none" style="stroke:'+col+'" stroke-width="3" stroke-linejoin="round"/>'}
  if(pj!=null&&P.length){const L=P[P.length-1];s+='<line x1="'+L[0]+'" y1="'+L[1]+'" x2="'+x1+'" y2="'+Y(pj)+'" style="stroke:'+col+'" stroke-width="2.5" stroke-dasharray="6 6"/>'}
  P.forEach(p=>{s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="5" style="fill:var(--cd);stroke:'+col+'" stroke-width="3"/>'});
  return s+'</svg>'}
function heat(map){let h='<div class="heat" role="img" aria-label="Activity heatmap">';
  for(let r=0;r<7;r++)for(let c=0;c<18;c++){const o=125-(c*7+r);const n=o<0?0:(map[dt(o)]||0);h+='<i class="'+(n?'l'+Math.min(4,n):'')+'" title="'+dt(o)+': '+n+'"></i>'}
  return h+'</div>'}
function stats(){
  const per=V.per,since=per==='week'?dt(6):per==='month'?dt(29):'0000-00-00';
  const L=S.log.filter(e=>e.d>=since),cn=L.filter(e=>e.k==='done').length,px=L.reduce((a,e)=>a+e.xp,0);
  const dm=doneDates();
  const vel=(()=>{let due=0,got=0;for(let i=0;i<7;i++){const d=dt(i);S.quests.forEach(q=>{if(dueOn(q,d)){due++;if(isDone(q.id,d))got++}})}return due?Math.round(got/due*100):0})();
  const vl=vel<40?['Slacking','rd','var(--rd)']:vel<75?['Steady','or','#f59e0b']:['Surging','gr','#10b981'];
  const days=[];for(let i=6;i>=0;i--)days.push(dt(i));
  const daily=days.map(d=>S.log.filter(e=>e.d===d).reduce((a,e)=>a+e.xp,0));
  let c=0;const cum=daily.map(x=>(c+=x));const avg=cum[6]/7;
  const labs=days.map(d=>'SMTWTFS'[wdOf(d)]);
  const af=V.af,fl=achList().filter(a=>af==='All'||a.c===af),un=Object.keys(S.ach).length,total=achList().length;
  const bestS=bestStreak();
  return histHTML()+'<div class="row sb" style="margin-bottom:14px"><h1 style="margin:0">Statistics</h1><select id="per" aria-label="Period" style="width:auto">'+['week','month','all'].map(p=>'<option value="'+p+'"'+(per===p?' selected':'')+'>'+({week:'This Week',month:'This Month',all:'All Time'})[p]+'</option>').join('')+'</select></div>'
  +'<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:14px">'+[['XP',px,'⚡'],['Level',lvl(),'↗'],['Best streak',bestS,'🔥'],['Completed',cn,'✓']].map(t=>'<div class="tile"><span aria-hidden="true">'+t[2]+'</span><b>'+t[1]+'</b><span class="mu">'+t[0]+'</span></div>').join('')+'</div>'
  +'<div class="cd"><div class="row sb"><b style="font-size:20px">Activity</b><span class="mu">'+Object.keys(dm).length+' active days</span></div><div style="margin-top:14px">'+heat(dm)+'</div></div>'
  +'<div class="cd"><div class="row sb"><b style="font-size:20px">Attributes</b><span class="chip ac">'+S.pts+'% to allocate</span></div>'+radar()
  +STATS.map(s=>'<div class="row sb" style="margin-top:10px"><span><b>'+s+'</b> <span class="mu">'+SN[s]+'</span></span><span class="row"><b style="font-size:20px">'+S.stats[s]+'</b>'+(S.pts>0?'<button class="pill" data-a="alloc" data-i="'+s+'" aria-label="Add 1% to '+s+'">+1%</button>':'')+'</span></div>').join('')
  +(S.focus?'<div class="hint" style="margin-top:12px">Focus stat from your baseline: '+esc(S.focus)+'</div>':'')+'</div>'
  +addSkillCard()+'<div class="cd"><b style="font-size:20px">Skills</b>'+SKILLS.map(s=>{const u=S.skills[s[0]]||0,lv=skLv(s[0]);return'<div class="row sb" style="margin-top:12px"><span>'+esc(s[0])+' <span class="mu">'+s[1]+'</span></span><span class="chip">Lv '+lv+(S.indep&&S.indep[s[0]]?' · Independent':'')+'</span></div><div class="bar"><i style="width:'+(u%5)*20+'%"></i></div>'}).join('')+'</div>'
  
  +'<div class="cd"><div class="row sb"><b style="font-size:20px">XP Trajectory</b><span class="chip ac">+'+px+' XP</span></div>'+line(cum,labs,'var(--ac)',cum[6]+Math.round(avg))+'<div class="hint" style="text-align:center">— Current projection</div></div>'
  +reportsHTML()+'<div class="row sb" style="margin:22px 0 10px"><h2 style="margin:0">Achievements</h2><span class="chip ac">'+un+'/'+total+'</span></div>'
  +'<div class="pillsc">'+['All','Level','XP','Streak','Activity','Quests','Missions'].map(c=>'<button class="pill'+(af===c?' on':'')+'" data-a="af" data-i="'+c+'">'+c+'</button>').join('')+'</div>'
  +'<div class="grid3">'+fl.map(a=>{const got=!!S.ach[a.id];return'<div class="ach'+(got?' u':' l')+'"><div style="font-size:24px" aria-hidden="true">'+(got?'★':'🔒')+'</div><b style="font-size:15px;font-weight:600">'+esc(a.t)+'</b><small>'+esc(a.d)+'</small><span class="chip '+(got?'gr':'or')+'" style="font-size:12px">+'+a.x+' XP</span></div>'}).join('')+'</div>';
}
function dungeons(){
  const my=Object.keys(S.dj);
  let h='<h1>Missions</h1><div class="seg" role="tablist"><button role="tab" class="'+(V.dtab==='my'?'on':'')+'" data-a="dtab" data-i="my">My Missions</button><button role="tab" class="'+(V.dtab==='ex'?'on':'')+'" data-a="dtab" data-i="ex">Explore Missions</button></div>';
  if(V.dtab==='my'){
    h+=gateCards()+spList('dungeon');
    h+=my.length?my.map(id=>{const t=allD().find(x=>x.id===id),j=S.dj[id];if(!t)return'';const st=j.done?'Conquered':j.fail?'Failed':'Active';
      const prog=t.type==='boss'?j.ph.filter(Boolean).length+'/'+t.ph.length+' phases':j.days.length+'/'+t.days+' days';
      const pct=t.type==='boss'?j.ph.filter(Boolean).length/t.ph.length*100:j.days.length/t.days*100;
      return'<div class="cd"><div class="row sb wrap"><span class="chip '+(j.done?'gr':j.fail?'rd':'ac')+'">'+st+'</span><span class="chip">'+esc(t.type==='boss'?'Boss':t.type==='double'?'Double':t.type==='gate'?'Red Gate':tier(t.r))+'</span></div><b style="font-size:21px;font-weight:600;display:block;margin-top:10px">'+esc(t.t)+'</b><div class="hint">'+esc(t.d)+'</div><div class="bar"><i style="width:'+pct+'%"></i></div><div class="row sb" style="margin-top:8px"><span class="mu">'+prog+'</span><span class="or" style="font-weight:600">+'+(t.type==='double'?t.xp*2:t.xp)+' XP</span></div>'
        +(t.type==='boss'&&!j.done&&!j.fail?t.ph.map((p,i)=>'<label class="row" style="margin-top:10px;cursor:pointer"><input type="checkbox" data-a="ph" data-i="'+id+'" data-p="'+i+'"'+(j.ph[i]?' checked':'')+'><span>'+esc(p)+'</span></label>').join(''):'')
        +(t.type!=='boss'&&!j.done&&!j.fail?'<button class="btn" data-a="dci" data-i="'+id+'">'+(j.days.indexOf(dt(0))>=0?'Checked in today':'Check in today')+'</button>':'')+'</div>'}).join(''):'<div class="cd mu">No active dungeons. Open Explore to enter one.</div>';
  } else {
    const cats=['All'].concat([...new Set(allD().map(t=>t.cat))]);
    h+='<div class="pillsc">'+cats.map(c=>'<button class="pill'+(V.cat===c?' on':'')+'" data-a="cat" data-i="'+esc(c)+'">'+esc(c)+'</button>').join('')+'</div><div class="cr">';
    allD().filter(t=>V.cat==='All'||t.cat===V.cat).forEach(t=>{const j=S.dj[t.id];const tagTxt=t.type==='boss'?'BOSS':t.type==='double'?'DOUBLE':t.type==='gate'?'RED GATE':tier(t.r).toUpperCase();
      h+='<div class="dcard"><div class="row sb"><span class="tag">'+tagTxt+'</span><span class="tag">▭ '+t.days+' DAYS</span></div><div class="dinner" style="margin-top:14px"><h3>'+esc(t.t)+'</h3><div style="opacity:.92;font-size:17px">'+esc(t.d)+'</div>'+(t.r>S.rank?'<div style="color:var(--or);margin-top:8px;font-weight:600">Under-prepared for your rank</div>':'')+'<div class="row sb" style="margin-top:18px"><b style="color:var(--or);font-size:22px">★ +'+(t.type==='double'?t.xp*2:t.xp)+' XP</b><button class="ico" style="background:var(--ac);color:#fff" data-a="join" data-i="'+t.id+'" aria-label="'+(j?'Joined':'Join')+' '+esc(t.t)+'">'+(j?'✓':'→')+'</button></div></div></div>'});
    h+='</div><button class="op" data-a="open" data-i="nd"><span class="ico">＋</span><span><b>Create custom dungeon</b><span class="mu">Your own mission</span></span></button>';
  }
  return h;
}
function rankView(){
  const r=S.rank,k=RANKS[r],c=S.std[k]||[];
  let h='<div class="row"><button class="ico" data-a="close" aria-label="Close">✕</button><b style="font-size:24px;font-weight:600">Level Path</b></div>'
  +'<div class="cd" style="margin-top:14px"><b style="font-size:20px">Level '+lvl()+'</b><div class="hint">Level measures effort. Tier measures who you have become. No timers.</div></div>'
  +'<div class="cd">'+RANKS.map((x,i)=>'<div class="row sb" style="padding:8px 0;border-bottom:1px solid var(--bd)"><span><b>'+tier(i)+'</b> · '+TITLE[i]+'</span><span class="chip '+(i<r?'gr':i===r?'ac':'')+'">'+(i<r?'Passed':i===r?'Current':'Locked')+'</span></div>').join('')+'</div>';
  if(r>=6)return h+'<div class="cd"><b style="font-size:22px">X rank reached</b><div class="hint">Monarch. Keep every stat at standard.</div></div>';
  h+='<h2>'+tier(r)+' Standard</h2><div class="hint">Prove each trait with evidence, and keep every stat at '+FLOOR[r]+' or more.</div>';
  STD[k].forEach((t,i)=>{const x=c[i]||{};h+='<div class="cd"><label class="row" style="align-items:flex-start;cursor:pointer"><input type="checkbox" data-c="'+i+'"'+(x.c?' checked':'')+' style="margin-top:4px"><span>'+esc(t)+'</span></label><input data-e="'+i+'" style="margin-top:10px" aria-label="Evidence" placeholder="Evidence: what did you actually do or ship?" value="'+esc(x.e||'')+'"></div>'});
  h+='<div class="cd"><div class="grid3">'+STATS.map(s=>'<div style="text-align:center"><div class="mu" style="font-size:13px">'+s+'</div><b class="'+(S.stats[s]>=FLOOR[r]?'gr':'rd')+'" style="font-size:22px">'+S.stats[s]+'</b><div class="hint">need '+FLOOR[r]+'</div></div>').join('')+'</div></div>';
  if(S.jf)h+='<div class="cd" style="border-color:var(--rd)"><b class="rd" style="font-size:18px">Job Change Quest failed</b>'+S.jf.map(x=>'<div class="note r" style="margin-top:8px">'+esc(x)+'</div>').join('')+'<div class="hint" style="margin-top:8px">Retry whenever you are ready. No deadline.</div></div>';
  return h+'<button class="btn" data-a="jcq">Take the Job Change Quest</button>';
}
const sel=(id,opts,def)=>{const v=FV[id]!==undefined?FV[id]:def;return '<select id="'+id+'">'+opts.map(o=>'<option value="'+esc(o[0])+'"'+(String(v)===String(o[0])?' selected':'')+'>'+esc(o[1])+'</option>').join('')+'</select>'};
const fv=(id,def)=>FV[id]!==undefined?FV[id]:def;
function ovHTML(){
  const o=V.ov;if(!o)return'';
  const close='<div class="row sb"><button class="ico" data-a="close" aria-label="Close">✕</button></div>';
  if(o.k==='rank')return rankView();
  if(o.k==='menu')return'<div class="row"><button class="ico" data-a="close" aria-label="Close">✕</button><b style="font-size:24px;font-weight:600">Menu</b></div>'
    +'<label class="l" for="nm">Player name</label><input id="nm" value="'+esc(S.name)+'">'
    +'<label class="l" for="dial">Honesty dial</label>'+sel('dial',[[0,'Normal'],[1,'Hard'],[2,'Savage']],S.dial)
    +'<label class="row" style="margin-top:14px;cursor:pointer"><input type="checkbox" id="pause"'+(S.pause?' checked':'')+'> <span>Pause the System (no penalties or reports)</span></label>'
    +'<button class="btn ghost" data-a="rerun">Run baseline assessment again</button>'
    +'<label class="row" style="margin-top:14px;cursor:pointer"><input type="checkbox" id="sound"'+(S.sound!==false?' checked':'')+'> <span>Sound effects</span></label><label class="row" style="margin-top:14px;cursor:pointer"><input type="checkbox" id="strict"'+(S.strict?' checked':'')+'> <span>Hardcore mode: strict penalties and dark theme</span></label>'+rulesHTML()+'<label class="l" for="io">Backup</label><textarea id="io" rows="4" aria-label="Backup data"></textarea>'
    +'<div class="grid2" style="margin-top:10px"><button class="btn ghost" data-a="exp">Show backup</button><button class="btn ghost" data-a="imp">Import</button></div>'
    +'<button class="btn danger" data-a="rst">Reset everything</button>'
    +'<div class="hint" style="margin-top:14px">Your data lives in this browser. Leaderboards need an online account, which this version does not have.</div>';
  if(o.k==='base')return'<h2 style="margin-top:0">Baseline Assessment</h2><div class="hint">An honest starting point. Your answers set your starting stats and dial.</div>'
    +'<label class="l" for="bs">Average sleep per night</label>'+sel('bs',[[5,'Under 5 hours'],[6,'5 to 6.5 hours'],[7,'7 to 8 hours'],[8,'8+ hours']],7)
    +'<label class="l" for="bw">Workouts per week</label>'+sel('bw',[[0,'None'],[1,'1 to 2'],[3,'3 to 4'],[5,'5 or more']],1)
    +'<label class="l" for="bd">Deep-work hours per day</label>'+sel('bd',[[0,'Under 1'],[1,'1 hour'],[2,'2 or more']],1)
    +'<label class="l" for="bweak">Weakest stat right now</label>'+sel('bweak',STATS.map(s=>[s,SN[s]]),'VIT')
    +'<label class="l" for="bdial">Honesty dial</label>'+sel('bdial',[[0,'Normal'],[1,'Hard'],[2,'Savage']],1)
    +'<button class="btn" data-a="basedone">Set my starting point</button><button class="btn ghost" data-a="skipbase">Skip for now</button>';
  if(o.k==='ci'){const d=dt(0),p=S.ci[d]||{};return'<div class="row"><button class="ico" data-a="close" aria-label="Close">✕</button><b style="font-size:24px;font-weight:600">Night check-in</b></div>'
    +'<label class="l" for="sl">Sleep last night (hours)</label><input id="sl" type="number" step="0.5" min="0" max="16" value="'+esc(fv('sl',p.sl!=null?p.sl:''))+'">'
    +'<label class="l" for="sc">Screen time today (hours)</label><input id="sc" type="number" step="0.5" min="0" max="24" value="'+esc(fv('sc',p.sc!=null?p.sc:''))+'">'
    +'<label class="l" for="rf">Reflection: one win, one lesson, tomorrow’s top quest</label><textarea id="rf" rows="4">'+esc(fv('rf',p.rf||''))+'</textarea>'
    +'<div class="hint" style="margin-top:8px">7+ hours of sleep restores stamina. Under 5 drains it.</div><button class="btn" data-a="saveci">Save check-in</button>'}
  if(o.k==='shop')return'<div class="row"><button class="ico" data-a="close" aria-label="Close">✕</button><b style="font-size:24px;font-weight:600">Shop</b></div><p class="or" style="font-size:22px;font-weight:600">Gold: '+S.gold+'</p>'
    +S.shop.map((s,i)=>'<div class="cd row sb"><div><b style="font-size:19px;font-weight:600">'+esc(s.t)+'</b><div class="mu">'+s.c+' gold</div></div><button class="pill" data-a="buy" data-i="'+i+'" '+(S.gold<s.c?'disabled':'')+'>Buy</button></div>').join('')
    +'<label class="l" for="rt">New reward</label><input id="rt" value="'+esc(fv('rt',''))+'" placeholder="Reward name"><label class="l" for="rc">Cost in gold</label><input id="rc" type="number" min="1" value="'+esc(fv('rc',200))+'"><button class="btn" data-a="addr">Add reward</button>'
    +(S.inv.length?'<h2>Inventory</h2>'+S.inv.map(x=>'<div class="mu" style="padding:4px 0">'+esc(x)+'</div>').join(''):'');
  if(o.k==='shd')return'<div class="row"><button class="ico" data-a="close" aria-label="Close">✕</button><b style="font-size:24px;font-weight:600">Alters</b></div><div class="hint">An alter is a habit or tool you have mastered, now running with little effort. Each alter adds +2 XP to every completed quest (up to 10).</div>'
    +S.shadows.map(s=>'<div class="cd"><b style="font-size:19px;font-weight:600">'+esc(s.n)+'</b><div class="mu">'+esc(s.e)+'</div></div>').join('')
    +'<label class="l" for="sn">Alter name</label><input id="sn" value="'+esc(fv('sn',''))+'" placeholder="e.g. Morning workout routine">'
    +'<label class="l" for="se">Proof: what it does and what it saves you</label><input id="se" value="'+esc(fv('se',''))+'">'
    +'<button class="btn" data-a="arise">Arise</button>';
  if(o.k==='nq'){const nf=V.nf;
    return'<div class="row"><button class="ico" data-a="close" aria-label="Close">✕</button><b style="font-size:24px;font-weight:600">New Quest</b></div>'
    +'<label class="l" for="nt">Title</label><input id="nt" value="'+esc(fv('nt',''))+'" placeholder="What will you do?">'
    +'<div class="grid3" style="margin-top:14px">'+[['daily','Daily'],['goal','Goal'],['penalty','Penalty']].map(x=>'<button class="pill'+(nf.ty===x[0]?' on':'')+'" data-a="fty" data-i="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>'
    +'<div class="hint" style="margin-top:6px">'+({daily:'Repeats every day you choose.',goal:'One-time achievement. Ends when done.',penalty:'Subtracts XP when you take the penalty.'})[nf.ty]+'</div>'
    +'<label class="l">Frequency</label><div class="grid3">'+[['all','Everyday'],['days','Specific days']].map(x=>'<button class="pill'+(nf.fr===x[0]?' on':'')+'" data-a="ffr" data-i="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>'
    +(nf.fr==='days'?'<div class="grid4" style="margin-top:10px">'+'SMTWTFS'.split('').map((x,i)=>'<button class="pill'+(nf.days.indexOf(i)>=0?' on':'')+'" data-a="fday" data-i="'+i+'" aria-label="Day '+i+'">'+x+'</button>').join('')+'</div>':'')
    +'<label class="l" for="ntl">Time limit (optional)</label><input id="ntl" type="time" value="'+esc(fv('ntl',''))+'">'
    +'<label class="l">Stat this quest trains</label><div class="grid3">'+STATS.map(s=>'<button class="pill'+(nf.stat===s?' on':'')+'" data-a="fst" data-i="'+s+'">'+s+'</button>').join('')+'</div>'
    +'<label class="l" for="nlist">Quest list</label>'+sel('nlist',[['','None']].concat(S.lists.map(l=>[l,l])),'')
    +'<label class="l">XP reward</label><div class="sec" style="justify-content:center;margin:0"><b class="at" style="font-size:52px">+'+nf.xp+'</b><span class="mu" style="font-size:22px">XP</span></div><div class="grid3" style="margin-top:10px">'+[5,10,15,20,25,30].map(x=>'<button class="pill'+(nf.xp===x?' on':'')+'" data-a="fxp" data-i="'+x+'">'+x+'</button>').join('')+'</div>'
    +'<button class="btn" data-a="mkq">Create Quest</button>'}
  if(o.k==='ns')return'<div class="row"><button class="ico" data-a="close" aria-label="Close">✕</button><b style="font-size:24px;font-weight:600">Special</b></div><div class="hint">Set a real deadline. Missing it fails the mission and costs XP.</div>'
    +'<label class="l" for="sp_kind">Kind</label>'+sel('sp_kind',[['quest','Special quest'],['dungeon','Special dungeon (steps)']],'quest')
    +'<label class="l" for="sp_t">Title</label><input id="sp_t" value="'+esc(fv('sp_t',''))+'" placeholder="What must be done">'
    +'<label class="l" for="sp_why">Why it matters</label><textarea id="sp_why" rows="3">'+esc(fv('sp_why',''))+'</textarea>'
    +'<label class="l" for="sp_due">Deadline</label><input id="sp_due" type="datetime-local" value="'+esc(fv('sp_due',''))+'">'
    +'<label class="l" for="sp_xp">XP reward</label>'+sel('sp_xp',[['150','150'],['300','300'],['600','600'],['1000','1000']],'300')
    +'<label class="l" for="sp_stat">Stat it trains</label>'+sel('sp_stat',STATS.map(x=>[x,x]),'INT')
    +'<label class="l" for="sp_steps">Steps (dungeon only, one per line)</label><textarea id="sp_steps" rows="4">'+esc(fv('sp_steps',''))+'</textarea>'
    +'<button class="btn" data-a="mksp">Create special</button>';
  if(o.k==='report'){const sp=(S.sp||[]).find(x=>x.id===o.id);if(!sp){V.ov=null;return''}
    return'<div class="row"><button class="ico" data-a="close" aria-label="Close">✕</button><b style="font-size:22px;font-weight:600">Clear report</b></div><div class="cd"><b style="font-size:19px">'+esc(sp.t)+'</b></div>'
    +'<div class="hint">Recorded to your timeline. Vague answers are rejected.</div>'
    +'<label class="l" for="rw">What did you actually do? (proof)</label><textarea id="rw" rows="3">'+esc(fv('rw',''))+'</textarea>'
    +'<label class="l" for="rwy">Why did it matter?</label><textarea id="rwy" rows="3">'+esc(fv('rwy',''))+'</textarea>'
    +'<label class="l" for="ri">What will you improve next time?</label><textarea id="ri" rows="3">'+esc(fv('ri',''))+'</textarea>'
    +'<button class="btn" data-a="spsubmit" data-i="'+sp.id+'">File report and claim XP</button>';}
  if(o.k==='detail')return detail(o.id);
  if(o.k==='nl')return'<div class="row"><button class="ico" data-a="close" aria-label="Close">✕</button><b style="font-size:24px;font-weight:600">New Quest List</b></div><label class="l" for="ln">List name</label><input id="ln" value="'+esc(fv('ln',''))+'" placeholder="e.g. Health"><button class="btn" data-a="mkl">Create list</button>';
  if(o.k==='nd')return'<div class="row"><button class="ico" data-a="close" aria-label="Close">✕</button><b style="font-size:24px;font-weight:600">Custom Mission</b></div>'
    +'<label class="l" for="dn">Title</label><input id="dn" value="'+esc(fv('dn',''))+'" placeholder="Describe the mission">'
    +'<label class="l" for="dtp">Type</label>'+sel('dtp',[['std','Standard'],['double','Double (2x XP, a missed day fails)'],['gate','Red Gate (fear challenge)'],['boss','Monthly Boss (3 phases)']],'std')
    +'<label class="l" for="dd">Days</label><input id="dd" type="number" min="1" max="365" value="'+esc(fv('dd',14))+'">'
    +'<label class="l" for="dx">XP reward</label><input id="dx" type="number" min="100" step="100" value="'+esc(fv('dx',800))+'">'
    +'<button class="btn" data-a="mkd">Create dungeon</button>';
  if(o.k==='sheet')return'<div class="row sb" style="margin-bottom:6px"><b style="font-size:24px;font-weight:600">Create New</b><button class="ico" data-a="close" aria-label="Close">✕</button></div>'
    +[['nq','⚡','Normal Quest','Daily, goal or penalty quest'],['ns','⏳','Special (deadline)','Special quest or mission you create'],['nl','≡','Quest List','Group related quests'],['nd','🧭','Mission','Special missions']].map(x=>'<button class="op" data-a="open" data-i="'+x[0]+'"><span class="ico">'+x[1]+'</span><span><b>'+x[2]+'</b><span class="mu">'+x[3]+'</span></span><span class="at" style="margin-left:auto">›</span></button>').join('');
  return'';
}
function detail(id){
  const q=S.quests.find(x=>x.id===id);if(!q){V.ov=null;return''}
  const pn=q.ty==='penalty',k=pn?'pen':'done',ev=S.log.filter(e=>e.q===id&&e.k===k),map={};ev.forEach(e=>map[e.d]=1);
  const total=ev.reduce((a,e)=>a+Math.abs(e.xp),0);
  const v=[],lb=[];for(let i=6;i>=0;i--){const d=dt(i);v.push(map[d]?1:0);lb.push('SMTWTFS'[wdOf(d)])}
  const base=new Date();base.setDate(1);base.setMonth(base.getMonth()+V.mo);const y=base.getFullYear(),m=base.getMonth();
  const first=new Date(y,m,1).getDay(),nd=new Date(y,m+1,0).getDate();
  let cal='';for(let j=0;j<first;j++)cal+='<i class="n"></i>';
  for(let j=1;j<=nd;j++){const ds=y+'-'+pad(m+1)+'-'+pad(j);let c='';if(ds>=q.created&&ds<dt(0))c=pn?(map[ds]?'f':''):(map[ds]?'s':'f');cal+='<i class="'+c+'">'+(c==='f'?'✕':c==='s'?'✓':j)+'</i>'}
  let cur=0;for(let i=0;i<400;i++){const d=dt(i);if(map[d])cur++;else if(i>0)break}
  let best=0,run=0,dd=q.created;for(let i=0;i<800&&dd<=dt(0);i++){if(map[dd]){run++;best=Math.max(best,run)}else run=0;dd=addD(dd,1)}
  return'<div class="row sb"><button class="ico" data-a="close" aria-label="Back">‹</button><b style="font-size:22px;font-weight:600;flex:1;margin-left:8px">Quest Details</b><button class="ico" data-a="delq" data-i="'+id+'" aria-label="Delete quest">🗑</button></div>'
  +'<div class="row" style="margin:16px 0"><span class="chip">'+(pn?'PENALTY':q.ty==='goal'?'GOAL':q.ty==='emerg'?'EMERGENCY':q.ty==='hidden'?'HIDDEN':'DAILY')+'</span><span class="chip '+(pn?'rd':'or')+'">'+(pn?'−':'+')+q.xp+' XP</span><span class="chip">'+esc(q.stat)+'</span></div>'
  +'<div class="cd"><b style="font-size:28px;font-weight:600">'+esc(q.t)+'</b></div>'
  +'<h2>Analytics</h2><div class="grid3">'+[[pn?'⚠':'✓',ev.length,pn?'times':'completions',pn?'rd':'gr'],[pn?'↘':'⚡',total,pn?'XP lost':'XP earned',pn?'rd':'at'],['🛡',cur,'day streak','gr']].map(x=>'<div class="tile" style="text-align:center"><span class="'+x[3]+'">'+x[0]+'</span><b>'+x[1]+'</b><span class="mu">'+x[2]+'</span></div>').join('')+'</div>'
  +'<h2>Trend</h2><div class="cd"><b style="font-size:19px">'+(pn?'Slips, last 7 days':'Completions, last 7 days')+'</b>'+line(v,lb,pn?'var(--rd)':'var(--ac)',null)+'</div>'
  +'<h2>Activity</h2><div class="cd"><div class="row sb"><b style="font-size:19px">Quest activity</b><span class="mu">'+ev.length+' total</span></div><div style="margin-top:14px">'+heat(map)+'</div></div>'
  +'<h2>History</h2><div class="cd"><div class="row sb"><span class="mu">Current '+cur+' · Best '+best+'</span></div><div class="row sb" style="margin:12px 0"><button class="ico" data-a="mo" data-i="-1" aria-label="Previous month">‹</button><b style="font-size:20px;font-weight:600">'+base.toLocaleString('en',{month:'long',year:'numeric'})+'</b><button class="ico" data-a="mo" data-i="1" aria-label="Next month">›</button></div>'
  +'<div class="cal" style="margin-bottom:8px">'+'SMTWTFS'.split('').map(x=>'<span class="mu" style="font-size:13px;font-weight:600">'+x+'</span>').join('')+'</div><div class="cal">'+cal+'</div>'
  +'<div class="row" style="justify-content:center;margin-top:14px;font-size:14px"><span class="chip rd">✕ '+(pn?'slipped':'missed')+'</span><span class="chip ac">✓ '+(pn?'held':'done')+'</span></div></div>'
  +(q.end?'':'<button class="btn" data-a="endq" data-i="'+id+'">🏆 End quest (conquered)</button>');
}

function rlogAdd(m){S.rlog.unshift({d:dt(0),m});S.rlog=S.rlog.slice(0,30)}
function lootRoll(src){
  const r=Math.random();const tier=r<.6?'Common':r<.9?'Rare':'Epic';const g=r<.6?50:r<.9?120:250;const mt=r<.6?1:r<.9?2:4;
  S.gold+=g;S.mats=(S.mats||0)+mt;let extra='';
  if(r>=.9&&Math.random()<.5){const n='Alter of '+src.slice(0,40);S.shadows.push({n,e:'Extracted automatically from '+src,d:dt(0)});extra=' Alter added: '+n+'.';rlogAdd('Alter added from '+src)}
  rlogAdd('Loot '+tier+' from '+src);
  toast('[Loot] '+tier+'. +'+g+' gold, +'+mt+' materials.'+extra);
}
function gatesAuto(){
  if(!S.gates)S.gates=[];const today=dt(0);
  S.gates.filter(g=>!g.done&&!g.fail).forEach(g=>{
    let hit=0,miss=0;
    for(let i=0;i<=diff(today,g.s);i++){const d=addD(g.s,i);
      if(S.log.some(e=>e.d===d&&e.k==='done'&&e.stat===g.stat))hit++;else if(d<today)miss++;}
    g.hit=hit;
    if(miss>=g.maxMiss){g.fail=true;const x=S.pause?0:-g.pen;S.log.push({d:today,q:g.id,k:'dfail',xp:x});gainXp(x);rlogAdd('Gate collapsed: '+g.t);toast('[Gate Failed] '+g.t+'. '+(x?x+' XP.':''));return}
    if(hit>=g.target){g.done=true;S.log.push({d:today,q:g.id,k:'dclear',xp:g.xp});gainXp(g.xp);hist('gate',g.t,g.xp);rlogAdd('Gate cleared: '+g.t);lootRoll(g.t)}
  });
  if(S.rules.autoGate&&!S.gates.some(g=>!g.done&&!g.fail)){
    const w=STATS.slice().sort((a,b)=>S.stats[a]-S.stats[b])[0];const dbl=Math.random()<.5;
    S.gates.push({id:'g'+Date.now(),t:'Gate: '+SN[w]+' training',stat:w,target:5,maxMiss:2,xp:dbl?800:400,pen:200,
      mod:dbl?'Double reward. Two missed days and the gate collapses.':'Two missed days and the gate collapses.',s:today,hit:0,done:false,fail:false});
    rlogAdd('Generated a gate from your weakest stat: '+SN[w]);toast('[Gate] Appeared. Train '+SN[w]+' to clear it.');
  }
}
function autoVit(){
  if(!S.rules.autoVit)return;const last=Object.keys(S.ci).sort().slice(-2).map(k=>S.ci[k]);
  if(last.length<2||!last.every(c=>c.sl<6))return;
  if(S.quests.some(q=>q.id==='rec'))return;
  S.quests.push({id:'rec',t:'Recovery: 20 minute walk, screens off by 10pm',ty:'daily',xp:20,stat:'VIT',fr:'all',days:[],tl:'',created:dt(0),end:false,list:''});
  rlogAdd('Added a recovery quest after two short-sleep nights');toast('[Warning] Two short nights. Recovery quest added.');
}
function stopTimer(){
  const t=S.timer;if(!t)return;S.timer=null;const q=S.quests.find(x=>x.id===t.q);if(!q)return;
  const mins=Math.floor((Date.now()-t.start)/6e4);S.focusMin=(S.focusMin||0)+mins;const tgt=q.tm||25;
  if(mins>=tgt&&S.rules.autoFocus){
    if(isDone(q.id,dt(0))){toast('Already done today.');return}
    rlogAdd('Focus timer completed '+q.t+' ('+mins+' min)');toggleQ(q.id);
  } else toast('Logged '+mins+' min. Target is '+tgt+' min.');
}
function timerCard(){
  const d=dt(0);
  if(S.timer){const q=S.quests.find(x=>x.id===S.timer.q);const m=Math.floor((Date.now()-S.timer.start)/6e4);
    return '<div class="cd" style="border-color:var(--ac)"><div class="row sb"><b style="font-size:19px">Focus timer · '+esc(q?q.t:'Quest')+'</b><span class="chip ac">'+m+' min</span></div><div class="hint" style="margin-top:6px">Target '+((q&&q.tm)||25)+' min. Stopping after the target completes the quest automatically.</div><button class="btn" data-a="stoptimer">Stop and log</button></div>';}
  const opts=S.quests.filter(q=>q.ty==='daily'&&dueOn(q,d)&&!isDone(q.id,d));
  if(!opts.length)return '';
  return '<div class="cd"><b style="font-size:19px">Focus timer</b><div class="hint" style="margin:4px 0 8px">Start a quest timer. Stop after the target and the quest completes itself.</div><div class="grid2">'+opts.slice(0,4).map(q=>'<button class="pill" data-a="starttimer" data-i="'+q.id+'">▶ '+esc(q.t)+'</button>').join('')+'</div></div>';
}
function gateCards(){
  const act=(S.gates||[]).filter(g=>!g.done&&!g.fail);if(!act.length)return '';
  return act.map(g=>{const pct=Math.min(100,g.hit/g.target*100);
    return '<div class="cd" style="border-color:var(--or)"><div class="row sb wrap"><span class="chip or">GATE</span><span class="chip">'+esc(g.stat)+'</span></div><b style="font-size:20px;font-weight:600;display:block;margin-top:10px">'+esc(g.t)+'</b><div class="hint" style="margin-top:4px">'+esc(g.mod)+'</div><div class="bar"><i style="width:'+pct+'%"></i></div><div class="row sb" style="margin-top:8px"><span class="mu">'+g.hit+'/'+g.target+' qualifying days</span><span class="or" style="font-weight:600">+'+g.xp+' XP</span></div><div class="hint" style="margin-top:6px">Counts automatically from your '+esc(SN[g.stat])+' quests.</div></div>';
  }).join('');
}
function rulesHTML(){
  const R=[['autoGate','Generate a gate from your weakest stat'],['autoFocus','Focus timer completes its quest at the target time'],['autoRebound','Grant a rebound token every 7-day streak'],['autoVit','Add a recovery quest after two short-sleep check-ins']];
  return '<div class="cd"><b style="font-size:19px">Automation rules</b>'+R.map(r=>'<label class="row" style="margin-top:10px;cursor:pointer"><input type="checkbox" id="r_'+r[0]+'"'+(S.rules[r[0]]?' checked':'')+'><span>'+r[1]+'</span></label>').join('')+'<div class="hint" style="margin-top:14px">Recent rule actions</div>'+(S.rlog.length?S.rlog.slice(0,8).map(x=>'<div class="mu" style="font-size:14px;margin-top:4px">'+x.d+' · '+esc(x.m)+'</div>').join(''):'<div class="mu" style="font-size:14px">None yet.</div>')+'</div>';
}
setInterval(()=>{if((S.timer||(S.sp||[]).some(x=>x.status==="entered"||x.status==="open"))&&!V.ov)render()},30000);

let SILENT=false;
function levelFx(from,to){if(SILENT)return;sfx('levelup');
  const n=Math.min(to-from,6),el=$('lvfx');
  el.innerHTML='<div class="lv-frame"><div class="lv-tag">[ SYSTEM ]</div>'+Array.from({length:n},(_,i)=>'<div class="lv-line" style="animation-delay:'+(i*0.45)+'s">Leveled up..</div>').join('')+'<div class="lv-sub" style="animation-delay:'+(n*0.45)+'s">Level '+to+'</div></div>';
  el.style.display='flex';el.onclick=()=>{el.style.display='none'};
  clearTimeout(levelFx.h);levelFx.h=setTimeout(()=>{el.style.display='none'},n*450+2000);
}
function timeLeft(due){const ms=new Date(due)-new Date();if(isNaN(ms))return 'No deadline';if(ms<0)return 'Overdue';const h=Math.floor(ms/36e5),d=Math.floor(h/24);return d>0?d+'d '+(h%24)+'h left':h+'h '+Math.floor(ms%36e5/6e4)+'m left'}
function spFailCheck(){(S.sp||[]).forEach(s=>{if((s.status==='open'||s.status==='entered')&&new Date(s.due)<new Date()){s.status='failed';const x=S.pause?0:-100;S.log.push({d:dt(0),q:s.id,k:'dfail',xp:x});gainXp(x);rlogAdd('Deadline missed: '+s.t);toast('[Failed] '+s.t+'. The deadline passed. '+(x?x+' XP.':''))}})}
function mkSpecial(){
  const t=(FV.sp_t||'').trim(),why=(FV.sp_why||'').trim(),due=FV.sp_due||'',kind=FV.sp_kind||'quest';
  if(!t){toast('Name the special quest or mission.');return}
  if(why.length<8){toast('Write why it matters (8+ characters). The System needs a reason.');return}
  if(!due||isNaN(new Date(due))){toast('Set a deadline.');return}
  if(new Date(due)<new Date()){toast('That deadline is already in the past.');return}
  const steps=kind==='dungeon'?(FV.sp_steps||'').split('\n').map(x=>x.trim()).filter(Boolean).map(x=>({t:x,d:false})):[];
  if(kind==='dungeon'&&steps.length<2){toast('A special mission needs at least 2 steps.');return}
  S.sp=S.sp||[];S.sp.push({id:'sp'+Date.now(),kind,t,why,due,xp:Math.max(50,+(FV.sp_xp||300)),stat:FV.sp_stat||'INT',status:'open',steps,report:null,created:dt(0)});
  V.ov=null;FV={};rlogAdd('Special '+kind+' created: '+t);toast('[Special] '+t+' is active. The deadline is set.');
}
function spEnter(id){const sp=S.sp.find(x=>x.id===id);if(!sp||sp.status!=='open')return;sp.status='entered';sp.enteredAt=Date.now();rlogAdd('Entered special mission: '+sp.t);toast('Mission entered. The clock is running.')}
function spStep(id,p){const sp=S.sp.find(x=>x.id===id);if(!sp||sp.status!=='entered'||!sp.steps[p])return;sp.steps[p].d=!sp.steps[p].d}
function spSubmit(id){
  const sp=S.sp.find(x=>x.id===id);if(!sp)return;
  const w=(FV.rw||'').trim(),y=(FV.rwy||'').trim(),im=(FV.ri||'').trim();
  if(w.length<10){toast('Say what you actually did (10+ characters). Proof is required.');return}
  if(y.length<10){toast('Say why it mattered (10+ characters).');return}
  if(im.length<10){toast('Say what you will improve next time (10+ characters).');return}
  if(sp.kind==='dungeon'&&!sp.steps.every(s=>s.d)){toast('Finish every step before filing the clear.');return}
  sp.status='cleared';sp.report={w,y,im,d:dt(0)};
  S.log.push({d:dt(0),q:sp.id,k:'dclear',xp:sp.xp,stat:sp.stat});gainXp(sp.xp);
  S.stats[sp.stat]=(S.stats[sp.stat]||5)+1;
  hist('clear',sp.t,sp.xp);rlogAdd('Cleared: '+sp.t);V.ov=null;FV={};toast('[Cleared] '+sp.t+' +'+sp.xp+' XP. Report filed.');
}
function spCard(sp){
  const left=timeLeft(sp.due),isDun=sp.kind==='dungeon';
  const badge=sp.status==='entered'?'<span class="chip or">In progress</span>':'<span class="chip ac">'+(isDun?'Special mission':'Special quest')+'</span>';
  let h='<div class="cd"><div class="row sb wrap">'+badge+'<span class="chip '+(left==='Overdue'?'rd':'or')+'">⏱ '+left+'</span></div><b style="font-size:20px;font-weight:600;display:block;margin-top:10px">'+esc(sp.t)+'</b><div class="hint" style="margin-top:6px">Why: '+esc(sp.why)+'</div><div class="row sb" style="margin-top:8px"><span class="chip gr">+'+sp.xp+' XP</span><span class="chip">'+esc(sp.stat)+'</span></div>';
  if(isDun&&sp.status==='entered')h+=sp.steps.map((st,i)=>'<label class="row" style="margin-top:10px;cursor:pointer"><input type="checkbox" data-a="spstep" data-i="'+sp.id+'" data-p="'+i+'"'+(st.d?' checked':'')+'><span>'+esc(st.t)+'</span></label>').join('');
  if(sp.status==='open'&&isDun)h+='<button class="btn" data-a="spenter" data-i="'+sp.id+'">Enter dungeon</button>';
  if(sp.status==='open'&&!isDun)h+='<button class="btn" data-a="spreport" data-i="'+sp.id+'">Complete and file report</button>';
  if(sp.status==='entered')h+='<button class="btn" data-a="spreport" data-i="'+sp.id+'"'+(sp.steps.every(x=>x.d)?'':' disabled')+'>Clear mission and file report</button>';
  return h+'</div>';
}
function spList(kind){const L=(S.sp||[]).filter(x=>x.kind===kind&&(x.status==='open'||x.status==='entered'));return L.map(spCard).join('')}
function reportsHTML(){
  const r=(S.sp||[]).filter(x=>x.report);
  if(!r.length)return'<div class="cd mu">Special reports appear here: what you did, why it mattered, and what to improve.</div>';
  return'<div class="sec">Reports<span class="cnt">'+r.length+'</span></div>'+r.map(x=>'<div class="cd"><b style="font-size:19px;font-weight:600">'+esc(x.t)+'</b><div class="hint" style="margin-top:8px"><b>What:</b> '+esc(x.report.w)+'</div><div class="hint"><b>Why:</b> '+esc(x.report.y)+'</div><div class="hint"><b>Improve:</b> '+esc(x.report.im)+'</div><div class="mu" style="font-size:13px;margin-top:6px">'+x.report.d+'</div></div>').join('');
}

const MILE=()=>{const m=[];for(let L=5;L<=50;L+=5)m.push(L);for(let L=60;L<=100;L+=10)m.push(L);return m};
function claimMile(m){
  if(S.claimed[m]||lvl()<m)return;
  S.claimed[m]=true;const g=m*20,pts=m/5;S.gold+=g;S.pts+=pts;
  const r=Math.random(),tier=r<.6?'Common':r<.9?'Rare':'Epic',mt=r<.6?1:r<.9?2:4;S.mats=(S.mats||0)+mt;
  hist('chest','Level '+m+' chest',g);rlogAdd('Opened level '+m+' chest: +'+g+' gold, +'+pts+'% stat growth, '+tier+' materials');
  toast('[Chest] Level '+m+'. +'+g+' gold, +'+pts+'% stat growth, '+tier+' materials.');
}
function claimCard(){
  const ready=MILE().filter(m=>lvl()>=m&&!S.claimed[m]);
  if(ready.length)return'<div class="cd" style="border-color:var(--or)"><b style="font-size:19px">Chests ready</b>'+ready.map(m=>'<div class="row sb" style="margin-top:10px"><span>Level '+m+' chest</span><button class="pill" data-a="claim" data-i="'+m+'">Open</button></div>').join('')+'</div>';
  const nx=MILE().find(m=>lvl()<m);
  return nx?'<div class="cd"><div class="row sb"><b style="font-size:18px">Next chest: Level '+nx+'</b><span class="chip ac">'+(nx-lvl())+' to go</span></div><div class="hint" style="margin-top:6px">Each level now gives more stat growth than the one before. Chests add gold and materials.</div></div>':'';
}

let aiBusy=false;
function applyAI(o){
  const d=dt(0);
  if(!S.aiDay||S.aiDay.d!==d)S.aiDay={d,xp:0,st:{}};
  const ev=['accepted','partial','none'].indexOf(o.evidence)>=0?o.evidence:'none';
  const m=o.metrics||{};
  const num=k=>{const v=+m[k];return isFinite(v)&&v>0?v:0};
  const study=num('study_min'),ex=num('exercise_min'),foc=num('focus_min'),sl=num('sleep_hours'),out=num('outreach_count'),inc=num('income_inr'),bld=num('build_count');
  const calc={INT:0,STR:0,VIT:0,SENSE:0,CHA:0,WEALTH:0};let xp=0;
  if(study){xp+=Math.min(90,study*0.5);calc.INT+=Math.floor(study/30)}
  if(bld){xp+=Math.min(30,bld*10);calc.INT+=Math.floor(bld)}
  if(ex){xp+=Math.min(60,ex*0.5);calc.STR+=Math.floor(ex/30)}
  if(foc){xp+=Math.min(60,foc*0.4);calc.SENSE+=Math.floor(foc/60)}
  if(sl>=7){xp+=10;calc.VIT+=1}
  if(out){xp+=Math.min(90,out*15);calc.CHA+=Math.floor(out)}
  if(inc){xp+=Math.min(200,inc/100);calc.WEALTH+=Math.floor(inc/1000)}
  xp=Math.min(150,Math.round(xp));
  if(ev==='none')xp=0;else if(ev==='partial')xp=Math.min(xp,50);
  xp=Math.min(xp,Math.max(0,300-S.aiDay.xp));
  const gained={};
  STATS.forEach(s=>{const used=S.aiDay.st[s]||0;const add=ev==='none'?0:Math.min(calc[s],Math.max(0,8-used));if(add>0){gained[s]=add;S.aiDay.st[s]=used+add;(S.pending=S.pending||[]).push({id:'p'+Date.now()+s,kind:'stat',key:s,amount:add,label:s+' growth',detail:'+'+add+'% '+SN[s]+' growth'})}});
  const closed=[];
  if(ev!=='none'&&Array.isArray(o.closeQuestIds))o.closeQuestIds.forEach(id=>{const q=S.quests.find(x=>x.id===id);if(q&&q.ty==='daily'&&dueOn(q,d)&&!isDone(q.id,d)){S.log.push({d,q:id,k:'done',xp:0,stat:q.stat,ai:true});closed.push(q.t);tr('Quest closed',q.t)}});
  if(xp>0){S.aiDay.xp+=xp;(S.pending=S.pending||[]).push({id:'p'+Date.now()+'xp',kind:'xp',amount:xp,label:'XP',detail:'+'+xp+' XP'})}
  gatesAuto();chk();
  const missing=(Array.isArray(o.missing)?o.missing:[]).slice(0,6).map(x=>({metric:String(x.metric||'').slice(0,40),ask:String(x.ask||'').slice(0,160)}));
  tr('Evidence',ev+' · '+xp+' XP total');const res={d,trace:TR.slice(),reply:String(o.reply||'').slice(0,300),evidence:ev,xp,stats:gained,closed,missing,avoidance:String(o.avoidance||'').slice(0,300)};
  hist('judge',res.reply||ev,xp);S.aiLast=res;flushTR();sfx('notify');rlogAdd('Judged report: '+ev+', +'+xp+' XP'+(closed.length?', closed '+closed.length:''));
  return res;
}
function systemPanel(){
  const r=S.aiLast;
  return''
  +(r?'<div class="note" style="margin-top:12px">'+esc(r.reply)+'</div><div class="row wrap" style="margin-top:8px"><span class="chip">Evidence: '+r.evidence+'</span><span class="chip gr">+'+r.xp+' XP</span>'+Object.keys(r.stats).map(x=>'<span class="chip">'+x+' +'+r.stats[x]+'</span>').join('')+(r.closed.length?'<span class="chip">Closed: '+esc(r.closed.join(', '))+'</span>':'')+'</div>'
  +(r.missing&&r.missing.length?'<div class="hint" style="margin-top:10px">Needed: '+r.missing.map(x=>esc(x.metric)+' ('+esc(x.ask)+')').join('; ')+'</div>':'')
  +(r.avoidance?'<div class="note r" style="margin-top:10px">'+esc(r.avoidance)+'</div>':''):'')
  +'</div>';
}

const PEN={INT:'1 hour of study with no screen',STR:'20 minutes of exercise before anything else',VIT:'Lights out 30 minutes earlier tonight',SENSE:'45 minutes of phone-free focus',CHA:'Send one outreach message before any build work',WEALTH:'Send one sales message to a real prospect'};
function penaltiesCard(){
  const y=dt(1);
  const open=S.quests.filter(q=>dueOn(q,y)&&!isDone(q.id,y)&&!S.log.some(e=>e.d===y&&e.q===q.id&&e.k==='penserved'));
  if(!open.length)return'';
  return'<div class="cd" style="border-color:var(--rd)"><b style="font-size:19px" class="rd">Yesterday’s penalties</b>'+open.map(q=>'<div class="note r" style="margin-top:10px"><b>'+esc(q.t)+'</b> was not completed. Penalty: '+esc(PEN[q.stat]||'extra focused work')+'.<div style="margin-top:8px"><button class="pill" data-a="penserve" data-i="'+q.id+'">Penalty served</button></div></div>').join('')+'</div>';
}
function penServe(id){const y=dt(1);S.log.push({d:y,q:id,k:'penserved',xp:0});rlogAdd('Penalty served for yesterday');toast('Penalty served. Yesterday is closed.')}
function todayTools(){return'<div class="row wrap" style="margin-bottom:14px"><button class="pill" data-a="revertday">↺ Revert today to not completed</button></div>'}
function revertToday(){
  const d=dt(0),dn=S.log.filter(e=>e.d===d&&e.k==='done');
  if(!dn.length){toast('Nothing is completed today.');return}
  dn.forEach(e=>{S.log=S.log.filter(x=>x!==e);gainXp(-(e.xp||0));if(e.stat)S.stats[e.stat]=Math.max(5,(S.stats[e.stat]||5)-1)});
  rlogAdd('Reverted '+dn.length+' completion(s) today');toast('Today is reset to not completed. Tick again to earn.');
}

const KW={CHA:/outreach|message|mail|email|dm|call|pitch|meeting|network|cold|speak|talk/i,WEALTH:/sale|sold|income|invoice|paid|client|revenue|₹|\brs\b|inr/i,STR:/gym|workout|exercise|run|push-?up|squat|lift|walk/i,VIT:/sleep|slept|rest|meditat|nap/i,SENSE:/focus|deep work|pomodoro/i};
function statFor(text){const t=String(text);for(const k of ['CHA','WEALTH','STR','VIT','SENSE']){if(KW[k].test(t))return k}return 'INT'}
function localParse(text){
  const t=String(text).toLowerCase(),m={};
  const mn=t.match(/(\d+(?:\.\d+)?)\s*(?:min|mins|minutes|m)\b/),hr=t.match(/(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|hour|hours)\b/);
  const minutes=(mn?+mn[1]:0)+(hr?+hr[1]*60:0);
  const sl=t.match(/slept\s*(?:for\s*)?(\d+(?:\.\d+)?)/);if(sl)m.sleep_hours=+sl[1];
  const ou=t.match(/(\d+)\s*(?:outreach|messages?|mails?|emails?|dms?|calls?|cold)/);if(ou)m.outreach_count=+ou[1];
  const inc=t.match(/(?:₹|rs\.?|inr)\s*([\d,]+)/);if(inc)m.income_inr=+inc[1].replace(/,/g,'');
  const bd=t.match(/(\d+)\s*(?:builds?|commits?|deploy\w*|features?)/);if(bd)m.build_count=+bd[1];else if(/(shipped|deployed|pushed|committed)/.test(t))m.build_count=1;
  if(minutes){const c=statFor(t);if(c==='STR')m.exercise_min=minutes;else if(c==='SENSE')m.focus_min=minutes;else m.study_min=minutes}
  const tp=t.match(/(?:learned|learnt|studied|practi[sc]ed|read|finished)\s+(?:about\s+|on\s+|the\s+)?([a-z][a-z0-9+#.\- ]{2,40}?)(?=\s+(?:for|today|this|in|at)\b|[,.;]|$)/);
  if(tp)m.topic=tp[1].trim();
  return m;
}
function localJudge(text){const m=localParse(text),has=Object.keys(m).length>0,proof=/https?:\/\/|screenshot|commit|github|link|\d/i.test(text);return{m,has,proof,confident:has&&proof}}
function practiceSkill(name,n){S.skills[name]=(S.skills[name]||0)+(n||1);tr('Skill',name+' +'+(n||1)+' practice · level '+skLv(name));S.indep=S.indep||{};if(S.skills[name]>=10&&!S.indep[name]){S.indep[name]=true;S.pts+=2;tr('Independent',name+' · +2% growth');rlogAdd('Independent skill: '+name);toast('[Skill] '+name+' is now independent. +2% growth.')}}
function addSkillCard(){return'<div class="cd"><b style="font-size:19px">Add a skill</b><div class="hint">Skills you build or learn. Practice levels them up from your reports.</div><label class="l" for="sk_name">Skill name</label><input id="sk_name" value="'+esc(fv('sk_name',''))+'" placeholder="e.g. Retrieval-augmented generation"><label class="l" for="sk_stat">Stat</label>'+sel('sk_stat',STATS.map(x=>[x,SN[x]]),'INT')+'<button class="btn" data-a="addskill">Add skill</button></div>'}
function addSkillManual(){
  const n=(FV.sk_name||'').trim().replace(/\s+/g,' ').slice(0,40),st=FV.sk_stat||'INT';
  if(n.length<2){toast('Name the skill.');return}
  if(SKILLS.some(x=>x[0].toLowerCase()===n.toLowerCase())){toast('That skill already exists.');return}
  S.cskills=S.cskills||[];S.cskills.push({name:n,stat:st});SKILLS.push([n,st]);S.pts+=1;FV.sk_name='';
  rlogAdd('New skill added: '+n+' ('+st+'), +1%');toast('[New Skill] '+n+' added. +1% growth.');
}
function markSkill(ns){
  const n=String(ns.name||'').trim().slice(0,40),st=STATS.indexOf(ns.stat)>=0?ns.stat:'INT';
  if(n.length<2||SKILLS.some(x=>x[0].toLowerCase()===n.toLowerCase()))return;
  S.cskills=S.cskills||[];S.cskills.push({name:n,stat:st});SKILLS.push([n,st]);S.pts+=1;
  hist('skill','New skill: '+n+' ('+st+')',0);tr('New skill',n+' ('+st+') · +1% growth');rlogAdd('System marked new skill: '+n+' ('+st+')');toast('[New Skill] '+n+' marked by the System. +1% growth.');
}
function learnTopic(topic,text,m){
  const name=topic.replace(/\b\w/g,c=>c.toUpperCase()).slice(0,40);
  let sk=SKILLS.find(x=>x[0].toLowerCase()===name.toLowerCase());
  if(!sk){markSkill({name,stat:statFor(text)});sk=SKILLS.find(x=>x[0].toLowerCase()===name.toLowerCase())}
  if(sk)practiceSkill(sk[0],Math.max(1,Math.round((m.study_min||0)/30)));
}
function localApply(text,L,ev){
  TR=[];
  const m=L.m,t=text.toLowerCase(),d=dt(0);
  const closeQuestIds=S.quests.filter(q=>q.ty==='daily'&&dueOn(q,d)&&!isDone(q.id,d)&&q.t.toLowerCase().split(/\s+/).filter(w=>w.length>=4).some(w=>t.includes(w))).map(q=>q.id);
  if(m.topic)learnTopic(m.topic,text,m);
  return applyAI({evidence:ev,metrics:m,closeQuestIds,missing:[],reply:ev==='accepted'?'Recorded. Evidence accepted by rule.':'Recorded with partial evidence. Add a link or a number for full XP.',avoidance:''});
}
function runAI(){
  const msg=(FV.aimsg||'').trim();
  if(msg.length<8){toast('Describe what you did, with a number or a link.');return}
  const L=localJudge(msg);
  if(!L.has){if(window.HunterAI&&HunterAI.enabled){aiCall(msg);return}toast('Not enough detail to judge. Add a number: minutes, hours, messages, rupees or builds.');return}
  localApply(msg,L,L.proof?'accepted':'partial');S.justJudged=true;
  FV.aimsg='';
}

const lastN=n=>{const a=[];for(let i=0;i<n;i++)a.push(dt(i));return a};
function dayCompletion(d){const due=S.quests.filter(q=>dueOn(q,d));if(!due.length)return null;return due.filter(q=>isDone(q.id,d)).length/due.length}
function stability(){return Math.max(0,Math.min(100,Math.round(S.stab==null?100:S.stab)))}
function detoxDaysCount(days){return days.filter(d=>S.ci[d]&&S.ci[d].sc<=3).length}
function healthScore(){
  const d7=lastN(7),cks=d7.map(d=>S.ci[d]).filter(Boolean);
  const sl=cks.length?cks.reduce((a,c)=>a+c.sl,0)/cks.length:null;
  const sc=cks.length?cks.reduce((a,c)=>a+c.sc,0)/cks.length:null;
  const sleepS=sl==null?0.5:sl>=7?1:sl<=4?0:(sl-4)/3;
  const screenS=sc==null?0.5:sc<=6?1:sc>=11?0:(11-sc)/5;
  const workDays=d7.filter(d=>S.log.some(e=>e.d===d&&e.k==='done'&&e.stat==='STR')).length;
  const physical=Math.round(100*(0.4*sleepS+0.3*Math.min(1,workDays/3)+0.3*screenS));
  const txt=cks.map(c=>c.rf||'').join(' ');
  const exN=(txt.match(/tired|busy|later|tomorrow|no time|skip/gi)||[]).length;
  const excS=cks.length?Math.max(0,Math.min(1,(5-exN)/4)):0.5;
  const focusDays=d7.filter(d=>S.log.some(e=>e.d===d&&e.k==='done'&&e.stat==='SENSE')).length;
  const mental=Math.round(100*(0.4*excS+0.3*Math.min(1,focusDays/4)+0.3*Math.min(1,detoxDaysCount(d7)/3)));
  return{physical,mental,health:Math.round((physical+mental)/2),sl,sc,workDays,exN,crisis:/hopeless|worthless|suicid|kill myself|end it all|can'?t go on/i.test(txt)};
}
function fxMult(){const st=stability(),h=healthScore().health;return Math.round(Math.max(0.7,Math.min(1.2,0.7+0.3*st/100+0.2*h/100))*100)/100}
function realityLines(st,h){
  const T=S.dial|0,L=[],pk=(a,b,c)=>[a,b,c][T];
  if(h.crisis){L.push('Your recent reflections describe hopelessness. Quests stay open, but talk to someone now. Tele-MANAS (India, free, 24/7): 14416 or 1-800-891-4416.');return L}
  if(st>=80)L.push(pk('Stability is strong. Keep the checkpoints.','Stability is strong. That is what consistent work looks like.','Stability is high. It is the baseline you must hold, not a reward.'));
  else if(st>=50)L.push(pk('Stability is mixed. Some checkpoints slipped.','Stability is mixed: some checkpoints hit, some missed.','Stability '+st+'. Half your checkpoints are slipping. That is a pattern, not a rough patch.'));
  else L.push(pk('Stability is low. Missed checkpoints are compounding.','Stability is low. Each missed checkpoint makes the next harder to start.','Stability '+st+'. You are dropping out of your own system. Each missed checkpoint was a choice.'));
  if(h.sl!=null&&h.sl<6.5)L.push(pk('Sleep is averaging '+h.sl.toFixed(1)+' hours. That lowers focus and recovery.','Sleep averages '+h.sl.toFixed(1)+' hours. You pay for it in focus and mood the next day.','You sleep '+h.sl.toFixed(1)+' hours. You cannot out-work a body running on fumes.'));
  if(h.sc!=null&&h.sc>=8)L.push(pk('Screen time averages '+h.sc.toFixed(1)+' hours. That time is not going to your goals.','Screen time averages '+h.sc.toFixed(1)+' hours. Those are the hours your missions need.','Screen time averages '+h.sc.toFixed(1)+' hours. The phone is running your day.'));
  if(h.workDays<2)L.push(pk('Two or fewer workout days this week. Aim for three.','Workout days this week: '+h.workDays+'. Physical stability is slipping.','Workout days this week: '+h.workDays+'. Your body is the first thing you stopped keeping.'));
  if(h.exN>=3)L.push(pk('Excuse words appear '+h.exN+' times in your reflections this week.','Your reflections repeat excuses ('+h.exN+' this week). Name the real reason, not the story.','Excuse words: '+h.exN+' this week. "Tired" is not a reason to skip the System.'));
  if(st>=80&&h.health>=70)L.push(pk('Good: stability and health are both high. XP is multiplied.','Good. You are holding the line, and the XP multiplier reflects it.','Good. Keep both high, or the multiplier drops with them.'));
  return L;
}
function effectList(st,h){
  const e=[];
  e.push(st>=70?'Good: stability at 70+ keeps every quest reward multiplied up.':'Bad: stability under 70 lowers every quest reward.');
  e.push(h.health>=70?'Good: health at 70+ keeps the multiplier at its upper range.':'Bad: health under 70 pulls the multiplier down.');
  e.push('Current quest reward multiplier: ×'+fxMult().toFixed(2)+' (range 0.70 to 1.20).');
  return e;
}
function projection(st,h){
  const net=S.log.filter(e=>lastN(7).includes(e.d)).reduce((a,e)=>a+(e.xp||0),0);
  const avg=net/7,eff=fxMult(),rate=st>=80?0.02:-((100-st)/100)*0.12;
  return{week:Math.round(net),month:Math.round(avg*30),year:Math.round(avg*365),eff,risk:st<40?'High':st<60?'Medium':'Low',m3:eff*Math.pow(1+rate,3)};
}
function detoxCard(){
  const det=S.detox;
  if(!det)return'<div class="note" style="margin-top:14px"><b>Detox system</b><div class="hint" style="margin-top:6px">A 3-day reset. Days count only when the check-in shows screen time of 3 hours or less.</div><button class="btn" data-a="startdetox">Start 3-day detox</button></div>';
  const days=[];for(let i=0;i<det.days;i++)days.push(addD(det.s,i));
  const done=days.filter(x=>x<=dt(0)&&S.ci[x]&&S.ci[x].sc<=3).length;
  const over=dt(0)>addD(det.s,det.days-1);
  return'<div class="note" style="margin-top:14px"><b>Detox: '+done+'/'+det.days+' days proven</b><div class="hint" style="margin-top:6px">Physical: 20-minute walk, screens off an hour before bed, lights out by 23:00. Mental: first hour phone-free, one notifications-off block, three honest lines in tonight\'s reflection.</div>'
  +(done>=det.days&&!det.paid?'<button class="btn" data-a="detoxclaim">Claim detox reward (+40 XP)</button>':(over&&done<det.days?'<div class="hint" style="margin-top:8px;color:var(--rd)">Window ended with '+done+' proven days. Start again when ready.</div>':''))+'</div>';
}
function healthSection(){
  const st=stability(),h=healthScore(),pr=projection(st,h);
  const bar=(v,l)=>'<div class="row sb" style="margin-top:12px"><span>'+l+'</span><b>'+v+'/100</b></div><div class="bar"><i style="width:'+v+'%"></i></div>';
  return'<div class="cd" style="border-color:var(--ac)">'+stabRing(st,'STABILITY METER')+'<div class="row sb"><b style="font-size:21px">Health &amp; Discipline</b><span class="chip '+(st>=70?'gr':st>=50?'or':'rd')+'">Stability '+st+'%</span></div>'
  +bar(st,'Stability meter (starts 100%, drops on missed timed quests)')+bar(h.physical,'Physical health (sleep, training, screen time)')+bar(h.mental,'Mental health (reflections, focus, detox)')
  +'<div class="note" style="margin-top:12px"><b>Reality check</b>'+realityLines(st,h).map(l=>'<div style="margin-top:6px">'+esc(l)+'</div>').join('')+'</div>'
  +'<div class="sec" style="font-size:17px;margin:14px 0 6px">Effects</div>'+effectList(st,h).map(x=>'<div class="hint">• '+esc(x)+'</div>').join('')
  +'<div class="sec" style="font-size:17px;margin:14px 0 6px">Projection at current pace</div><div class="grid2">'+[['Weekly XP',pr.week],['Monthly XP',pr.month],['Yearly XP',pr.year],['Drop-out risk',pr.risk]].map(x=>'<div class="tile"><b style="font-size:22px">'+x[1]+'</b><span class="mu">'+x[0]+'</span></div>').join('')+'</div>'
  +'<div class="hint" style="margin-top:8px">Multiplier now ×'+pr.eff.toFixed(2)+'. In 3 months at this stability: ×'+pr.m3.toFixed(2)+'.</div>'
  +detoxCard()+'</div>';
}

function health(){return(S.strict?'<div class="note r" style="margin-bottom:12px">'+esc(realityCheck())+'</div>':'')+'<h1>Discipline</h1><div class="hint" style="margin-bottom:8px">Stability, health, reality check and detox. Updated from your checkpoints and check-ins.</div>'+healthSection()}
function stabRing(v,l){const r=54,c=2*Math.PI*r,o=c*(1-v/100);return'<div style="display:flex;justify-content:center;margin:6px 0 12px"><svg width="170" height="170" viewBox="0 0 140 140" role="img" aria-label="'+l+' '+v+' percent"><circle cx="70" cy="70" r="54" fill="none" style="stroke:var(--c2)" stroke-width="12"/><circle cx="70" cy="70" r="54" fill="none" style="stroke:'+stabColor(v)+'" stroke-width="12" stroke-linecap="round" stroke-dasharray="'+c+'" stroke-dashoffset="'+o+'" transform="rotate(-90 70 70)"/><text x="70" y="68" text-anchor="middle" font-size="30" font-weight="700" style="fill:var(--ink)">'+v+'%</text><text x="70" y="92" text-anchor="middle" font-size="11" style="fill:var(--mu)">'+l+'</text></svg><div class="hint" style="text-align:center">Red under 40 · Amber 40 to 69 · Green 70 and above</div></div>'}
function ctxLite(){const d=dt(0);return{level:lvl(),stats:S.stats,streak:streak(),today:S.quests.filter(q=>dueOn(q,d)).map(q=>({id:q.id,t:q.t,done:isDone(q.id,d)}))}}
async function aiCall(msg){
  TR=[];
  try{
    toast('The AI is judging...');
    const out=await HunterAI.judge(msg,ctxLite());
    if(!out){toast('The AI returned nothing usable.');return}
    if(out.newSkill&&out.newSkill.name)markSkill(out.newSkill);
    applyAI(out);S.justJudged=true;FV.aimsg='';render();
  }catch(e){toast('AI unavailable ('+e.message+'). Rules still work.')}
}
let TR=[];
function tr(k,v){TR.push({k,v:String(v)})}
function traceHTML(){
  const r=S.aiLast;if(!r||!r.trace||!r.trace.length)return'';
  const anim=!r.shown;r.shown=true;
  return'<div class="cd sys" style="margin-top:12px"><b class="sys-h">[ JUDGMENT TRACE ]</b>'+r.trace.map((t,i)=>'<div class="tr'+(anim?'':' tr-still')+'" style="'+(anim?'animation-delay:'+(i*0.4)+'s':'')+'"><span class="tr-k">'+esc(t.k)+'</span><span class="tr-v">'+esc(t.v)+'</span></div>').join('')+'</div>';
}
function charterHTML(){
  const c=window.AI_CHARTER;if(!c)return'';
  const li=a=>a.map(x=>'<div class="hint">• '+esc(x)+'</div>').join('');
  const h=t=>'<div class="sec" style="font-size:16px;margin:12px 0 4px">'+t+'</div>';
  return'<details class="cd"><summary style="cursor:pointer;font-size:19px;font-weight:600">AI charter: how the judge must behave</summary>'
  +h('Role')+'<div class="hint">'+esc(c.role)+'</div>'+h('Reads')+li(c.reads)+h('Writes (only these)')+li(c.writes)+h('Never')+li(c.forbidden)+h('Flow')+li(c.flow)+h('Connections')+li(c.connections)
  +'<div class="hint" style="margin-top:10px">Caps: '+Object.keys(c.caps).map(k=>k+' '+c.caps[k]).join(' · ')+'</div><div class="hint" style="margin-top:8px">Fail-safe: '+esc(c.failSafe)+'</div>'
  +'<div class="hint" style="margin-top:8px">To add another AI: write a provider in js/ai.js that returns the same JSON and keeps these caps. The app uses it with no other change.</div></details>';
}
function aiPage(){
  const on=!!(window.HunterAI&&HunterAI.enabled);
  return'<h1>AI</h1><div class="cd"><b style="font-size:18px">Judge status</b><div class="hint" style="margin-top:6px">'+(on?'AI connected. Used only when the rules cannot read a report.':'Rules only. Add an AI key or endpoint in config.js to enable AI for reports the rules cannot read.')+'</div></div>'
  +charterHTML()+systemPanel()+pendingBarHTML();
}
function flushTR(){
  S.infoNotes=(S.infoNotes||[]).concat(TR.map((t,i)=>({id:'n'+Date.now()+i,k:t.k,v:t.v,shown:false}))).slice(-8);
  TR=[];
}
function claimReward(id){
  const it=(S.pending||[]).find(x=>x.id===id);if(!it)return;
  S.pending=S.pending.filter(x=>x!==it);TR=[];
  if(it.kind==='xp'){S.log.push({d:dt(0),q:'ai',k:'ai',xp:it.amount});gainXp(it.amount)}
  if(it.kind==='stat'){S.stats[it.key]+=it.amount;practice(it.key,it.amount);tr(SN[it.key]+' claimed','+'+it.amount+'% · now '+S.stats[it.key])}
  hist('claim',it.detail,it.kind==='xp'?it.amount:0);sfx('claim');rlogAdd('Claimed '+it.label+': '+it.detail);flushTR();toast('Claimed: '+it.detail);
}
function claimAll(){(S.pending||[]).slice().forEach(x=>claimReward(x.id))}
function notesHTML(){return''}
function pendingBarHTML(){
  const P=S.pending||[],I=S.infoNotes||[];
  if(!P.length&&!I.length)return'';
  const chips=P.map(x=>'<span class="chip ac">'+esc(x.detail)+'</span>').join('');
  return'<div class="pend" id="pend"><div class="pend-row"><span class="pend-t">Pending</span><div class="pend-chips">'+(chips||'<span class="mu">Nothing to claim</span>')+'</div>'+(P.length?'<button class="btn pend-btn" data-a="claimall">Claim all ('+P.length+')</button>':'')+'</div>'
  +(I.length?'<div class="pend-log">'+I.slice(-6).map(x=>'<span class="chip">'+esc(x.k)+': '+esc(x.v)+'</span>').join('')+'<button class="pill" data-a="dismissall">Clear log</button></div>':'')+'</div>';
}
const PEN_TASKS=['Send one outreach message to a real prospect. Paste its first line in the box.','Work 45 minutes with your phone outside the room. Describe the result.','Do 20 minutes of exercise. Describe what you did.','Write the next concrete step for your most stalled project and send it to one person. Describe it.'];
function applyStrictCheck(){
  if(!S.strict)return;
  const y=dt(1);if(S.penaltyDate===y)return;
  const due=S.quests.filter(q=>dueOn(q,y));if(!due.length)return;
  const missed=due.filter(q=>!isDone(q.id,y)).length;if(!missed)return;
  gainXp(-20);S.penaltyDate=y;S.strictTask=PEN_TASKS[Math.floor(Math.random()*PEN_TASKS.length)];
  S.strictMsg=missed+' core quest(s) missed on '+y+'. Penalty: -20 XP.';
  hist('penalty','Missed '+missed+' core quest(s) on '+y,-20);sfx('fail');rlogAdd('Strict penalty: -20 XP for '+y);V.pen=true;
}
function penModalHTML(){
  return'<div class="pbox"><b class="rd">[ SYSTEM ]</b><div style="margin-top:8px">'+esc(S.strictMsg)+'</div><div style="margin-top:12px;font-weight:600">'+esc(S.strictTask)+'</div><textarea id="pproof" rows="3" placeholder="Describe what you did (10+ characters)">'+esc(FV.pproof||'')+'</textarea><div class="row" style="margin-top:12px"><button class="btn" data-a="penlog">Log penalty served</button><button class="pill" data-a="penclose">Close</button></div><div class="hint" style="margin-top:12px">If you are struggling beyond a task, talk to someone now. Tele-MANAS (India, free, 24/7): 14416.</div></div>';
}
function realityCheck(){
  const d=lastN(14);let tot=0,done=0;
  d.forEach(x=>S.quests.filter(q=>dueOn(q,x)).forEach(q=>{tot++;if(isDone(q.id,x))done++}));
  if(!tot)return'Not enough data yet. Complete at least one core quest.';
  const pct=Math.round(done/tot*100);
  return'You completed '+done+' of '+tot+' core quests in 14 days ('+pct+'%). '+(pct<70?'Below the 70% line. You missed '+(tot-done)+'. Finish one core quest today.':'At or above the 70% line. Hold it.');
}

function hist(kind,text,xp){
  S.hist=S.hist||[];
  S.hist.unshift({d:dt(0),time:new Date().toTimeString().slice(0,5),kind,text:String(text).slice(0,160),xp:Math.round(xp||0)});
  if(S.hist.length>500)S.hist.length=500;
}
const HIST_FILTER={done:['done','dungeon','clear','gate'],claim:['claim','chest'],judge:['judge'],level:['level'],penalty:['penalty']};
function histHTML(){
  const f=V.hf||'all',H=S.hist||[];
  const list=H.filter(x=>f==='all'||(HIST_FILTER[f]||[]).indexOf(x.kind)>=0).slice(0,60);
  const names={all:'All',done:'Completed',claim:'Claimed',judge:'Judged',level:'Levels',penalty:'Penalties'};
  const tabs=Object.keys(names).map(c=>'<button class="pill'+(f===c?' on':'')+'" data-a="hf" data-i="'+c+'">'+names[c]+'</button>').join('');
  const rows=list.length?list.map(x=>'<div class="hrow"><span class="hd">'+esc(x.d)+' '+esc(x.time||'')+'</span><span class="hk">'+esc(x.kind)+'</span><span class="ht">'+esc(x.text)+'</span><span class="hx '+(x.xp<0?'rd':'gr')+'">'+(x.xp?(x.xp>0?'+':'')+x.xp+' XP':'')+'</span></div>').join(''):'<div class="hint">Nothing recorded for this filter yet.</div>';
  return'<div class="cd"><div class="row sb"><b style="font-size:20px">History</b><span class="chip">'+H.length+' entries</span></div><div class="pillsc" style="margin-top:10px">'+tabs+'</div>'+rows+'</div>';
}
let SFX_CTX=null;
function sfx(name){
  if(!S.sound)return;
  try{
    SFX_CTX=SFX_CTX||new(window.AudioContext||window.webkitAudioContext)();
    const c=SFX_CTX;if(c.state==='suspended')c.resume();
    const t0=c.currentTime;
    const out=c.createBiquadFilter();out.type='lowpass';out.frequency.value=1800;out.connect(c.destination);
    const note=(f,st,dur,vol,type)=>{const o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t0+st);g.gain.setValueAtTime(0.0001,t0+st);g.gain.exponentialRampToValueAtTime(vol,t0+st+0.05);g.gain.exponentialRampToValueAtTime(0.0001,t0+st+dur);o.connect(g);g.connect(out);o.start(t0+st);o.stop(t0+st+dur+0.05)};
    if(name==='tap'){note(660,0,0.04,0.012,'triangle')}
    else if(name==='notify'){note(523.25,0,0.9,0.04);note(659.25,0.14,1.1,0.03)}
    else if(name==='complete'){note(392,0,0.8,0.035);note(493.88,0.16,1.0,0.03)}
    else if(name==='claim'){note(440,0,0.9,0.035)}
    else if(name==='fail'){note(146.83,0,1.4,0.04,'triangle')}
    else if(name==='levelup'){note(130.81,0,2.6,0.045,'triangle');note(196,0.4,2.4,0.035);note(261.63,0.8,2.8,0.03)}
  }catch(e){}
}
function stabColor(v){return v<40?'#c0392b':v<70?'#d68910':'#1e8449'}
function speak(text){
  if(!('speechSynthesis' in window)||!text){toast(text?'Voice output is not supported in this browser.':'No reply to read yet.');return}
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);u.rate=0.95;u.pitch=0.8;u.lang='en-IN';
  speechSynthesis.speak(u);
}
let REC=null,LISTENING=false;
function chatBarHTML(){
  const mic='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
  const chev='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>';
  const enter='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 5v7a3 3 0 0 1-3 3H6"/><path d="M10 11l-4 4 4 4"/></svg>';
  return'<div class="chatfix"><div class="chatbar"><textarea id="aimsg" rows="1" aria-label="Write what you did">'+esc(fv('aimsg',''))+'</textarea><div class="cbtns"><button class="mic'+(LISTENING?' listening':'')+'" data-a="mic" aria-label="Voice input" title="Voice input">'+mic+'</button><button class="send" data-a="send" aria-label="Send (Enter)" title="Send (Enter)">'+enter+'</button></div></div></div>';
}
function dictate(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){toast('Dictation needs Chrome or Edge.');return}
  if(REC){REC.stop();REC=null;LISTENING=false;render();return}
  REC=new SR();REC.lang='en-IN';REC.interimResults=false;
  REC.onresult=e=>{FV.aimsg=((FV.aimsg||'')+' '+e.results[0][0].transcript).trim();REC=null;LISTENING=false;render()};
  REC.onerror=()=>{REC=null;LISTENING=false;render();toast('Voice input stopped.')};
  REC.onend=()=>{REC=null;LISTENING=false;render()};
  REC.start();LISTENING=true;render();
}
const tier=i=>'Tier '+(i+1);
const PZ_MS=24*36e5;
const pzActive=()=>!!(S.pz&&!S.pz.resolved);
function pzCreate(date,stat){
  if(S.pause||pzActive()||(S.pzDates||[]).indexOf(date)>=0)return;
  if(!S.firstDay||date<=S.firstDay)return;
  S.pzDates=(S.pzDates||[]).concat(date);
  S.pz={id:'pz'+date,date,stat,start:Date.now(),exp:Date.now()+PZ_MS,task:PEN_TASKS[Math.floor(Math.random()*PEN_TASKS.length)],done:false,resolved:false};
  rlogAdd('Penalty Zone opened for '+date);
}
function pzCheck(){
  const p=S.pz;if(!p||p.resolved)return;
  if(p.done){p.resolved=true;return}
  if(Date.now()>=p.exp){
    const cur=S.stats[p.stat]||5,x=Math.max(5,cur-3);
    S.stats[p.stat]=x;p.resolved=true;
    hist('penalty',p.stat+' reduced '+cur+' to '+x+' (survival directive not completed in 24 h)',0);
    rlogAdd('Penalty Zone expired: '+p.stat+' −3');
  }
}
function pzLeft(){const ms=Math.max(0,S.pz.exp-Date.now());const h=Math.floor(ms/36e5),m=Math.floor(ms%36e5/6e4),sec=Math.floor(ms%6e4/1e3);return[h,m,sec].map(v=>String(v).padStart(2,'0')).join(':')}
function pzHTML(){const p=S.pz;return'<div class="pz"><div class="pz-h">PENALTY ZONE</div><div class="pz-s">'+esc(p.date)+' · MANDATORY DIRECTIVE NOT EXECUTED</div><div class="pz-clock" id="pzclock">'+pzLeft()+'</div><div class="pz-l">SURVIVAL DIRECTIVE</div><div class="pz-t">'+esc(p.task)+'</div><textarea id="pzproof" rows="3" placeholder="Describe the completed directive (10+ characters)">'+esc(FV.pzproof||'')+'</textarea><button class="btn" data-a="pzsubmit">Submit proof</button><div class="pz-l">UNRESOLVED AFTER 24 H: '+esc(p.stat)+' −3, PERMANENT</div><div class="hint">If you are struggling beyond a task, talk to someone now. Tele-MANAS (India, free, 24/7): 14416 or 1-800-891-4416.</div></div>'}
let PZ_T=null,PZ_H=null;
function pzStart(){
  if(!PZ_T)PZ_T=setInterval(()=>{const c=$('pzclock');if(c)c.textContent=pzLeft()},1000);
  if(!PZ_H&&navigator.vibrate)PZ_H=setInterval(()=>navigator.vibrate([90,160,90,900]),1300);
}
function pzStop(){clearInterval(PZ_T);PZ_T=null;clearInterval(PZ_H);PZ_H=null}
function judgeToday(){
  const d=dt(0);if(new Date().getHours()<8||S.judged===d)return;
  S.judged=d;const ci=S.ci[d]||{},sl=ci.sl,sc=ci.sc;
  const lines=['SLEEP LAST NIGHT: '+(sl==null?'NO DATA':sl+' H'),'SCREEN TIME TODAY: '+(sc==null?'NO DATA':sc+' H')];
  let m=1;
  if(sl!=null&&sl<6){m=Math.min(m,0.8);lines.push('DEBUFF: SLEEP UNDER 6 H. XP ×0.80 TODAY.')}
  if(sc!=null&&sc>8){m=Math.min(m,0.9);lines.push('DEBUFF: SCREEN OVER 8 H. XP ×0.90 TODAY.')}
  if(m===1)lines.push('NO DEBUFF TODAY.');
  S.debuff={date:d,mult:m};S.judgeLines=lines;V.judge=true;
}
function debuffMult(){return S.debuff&&S.debuff.date===dt(0)?S.debuff.mult:1}
function judgeHTML(){return'<div class="pz"><div class="pz-h">[ SYSTEM JUDGEMENT ]</div>'+(S.judgeLines||[]).map(l=>'<div class="pz-t">'+esc(l)+'</div>').join('')+'<button class="btn" data-a="judgeack">Acknowledge</button></div>'}
