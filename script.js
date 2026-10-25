const cover=document.getElementById('cover');
const envelope=document.getElementById('envelope');
const openEnvelopeBtn=document.getElementById('openEnvelope');
const enterBtn=document.getElementById('enterBtn');
const coverHint=document.getElementById('coverHint');
const app=document.getElementById('invitationApp');
const slides=[...document.querySelectorAll('.slide')];
const progressBar=document.getElementById('progressBar');
const counter=document.getElementById('counter');
const prevTop=document.getElementById('prevTop');
const nextBtns=document.querySelectorAll('.next-btn');
const prevBtns=document.querySelectorAll('.prev-btn');
const music=document.getElementById('music');
const musicToggle=document.getElementById('musicToggle');
const petals=document.getElementById('petals');
const specialMessageBtn=document.getElementById('specialMessageBtn');
const specialMessage=document.getElementById('specialMessage');
const ribbonCard=document.getElementById('ribbonCard');
const ribbonStatus=document.getElementById('ribbonStatus');
const detailCards=document.querySelectorAll('.detail-card');
const wishButtons=document.querySelectorAll('.wish-grid button');
const wishOutput=document.getElementById('wishOutput');
const giftBtn=document.getElementById('giftBtn');
const giftMessage=document.getElementById('giftMessage');
const confirmBtn=document.getElementById('confirmBtn');
const restartBtn=document.getElementById('restartBtn');
// Pon aquí el WhatsApp de quien recibe las confirmaciones (código de país + número, sin + ni espacios). Ej: '51987654321'
const WHATSAPP_NUMBER='51947641381';
let confirmed=false,guestName='',guests=1,typed=false;
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let currentSlide=0;
let envelopeOpened=false;
let touchStartX=0,touchStartY=0;

function updateSlide(index){
  const maxSlide=confirmed?slides.length-1:slides.length-2;
  currentSlide=Math.max(0,Math.min(index,maxSlide));
  slides.forEach((slide,i)=>slide.classList.toggle('active',i===currentSlide));
  const scene=slides[currentSlide].dataset.scene||'intro';
  app.dataset.scene=scene;
  slides.forEach((slide,i)=>slide.setAttribute('aria-hidden',i===currentSlide?'false':'true'));
  counter.textContent=`${currentSlide+1} / ${slides.length}`;
  progressBar.style.width=`${((currentSlide+1)/slides.length)*100}%`;
  prevTop.style.visibility=currentSlide===0?'hidden':'visible';
  window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});
  if(currentSlide===slides.length-1)spawnPetals(26);
}

function spawnPetals(amount=8){
  const items=['🌸','💗','🎀','BFLY','✨'];
  for(let i=0;i<amount;i++){
    setTimeout(()=>{
      const item=document.createElement('span');
      item.className='petal';
      const pick=items[Math.floor(Math.random()*items.length)];
      if(pick==='BFLY'){item.innerHTML=`<i class="bfly${Math.random()<.5?' lila':''}"></i>`}else{item.textContent=pick}
      item.style.left=Math.random()*100+'vw';
      item.style.fontSize=(14+Math.random()*16)+'px';
      item.style.animationDuration=(4+Math.random()*4)+'s';
      petals.appendChild(item);
      setTimeout(()=>item.remove(),8500);
    },i*80);
  }
}

function openEnv(){
  if(envelopeOpened)return;
  envelopeOpened=true;
  envelope.classList.add('open');
  coverHint.textContent='Tu carta ya está abierta ✨';
  enterBtn.classList.remove('hidden');
  spawnPetals(10);
}
openEnvelopeBtn.addEventListener('click',e=>{e.stopPropagation();openEnv()});
envelope.addEventListener('click',openEnv);

enterBtn.addEventListener('click',async()=>{
  cover.classList.add('hidden');
  app.classList.remove('hidden');
  app.setAttribute('aria-hidden','false');
  updateSlide(0);
  try{music.volume=.62;await music.play();musicToggle.textContent='⏸';}catch(e){musicToggle.textContent='▶';}
  spawnPetals(14);
});

nextBtns.forEach(btn=>btn.addEventListener('click',()=>updateSlide(currentSlide+1)));
prevBtns.forEach(btn=>btn.addEventListener('click',()=>updateSlide(currentSlide-1)));
prevTop.addEventListener('click',()=>updateSlide(currentSlide-1));

function typeText(el,text){
  if(reduce){el.textContent=text;return}
  el.textContent='';let i=0;
  const t=setInterval(()=>{el.textContent+=text[i++];if(i>=text.length)clearInterval(t)},24);
}
specialMessageBtn.addEventListener('click',()=>{
  specialMessage.classList.add('show');spawnPetals(8);
  if(!typed){typed=true;typeText(specialMessage,specialMessage.dataset.text)}
});
function openRibbon(){
  if(ribbonCard.classList.contains('open'))return;
  ribbonCard.classList.add('open');ribbonStatus.textContent='Mensaje abierto 💗';spawnPetals(8);
}
ribbonCard.addEventListener('click',openRibbon);
ribbonCard.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openRibbon()}});

detailCards.forEach(card=>card.addEventListener('click',()=>{card.classList.add('revealed');card.querySelector('small').textContent=card.dataset.value;spawnPetals(4)}));
const wishCount=document.getElementById('wishCount'),wishDone=document.getElementById('wishDone');
wishButtons.forEach(btn=>btn.addEventListener('click',()=>{
  wishOutput.textContent=btn.dataset.wish;
  wishOutput.classList.remove('swap');void wishOutput.offsetWidth;wishOutput.classList.add('swap');
  btn.classList.add('done');spawnPetals(4);
  const n=document.querySelectorAll('.wish-grid button.done').length;
  wishCount.textContent=`${n} / ${wishButtons.length} deseos guardados`;
  if(n===wishButtons.length&&!wishDone.classList.contains('show')){wishDone.classList.add('show');spawnPetals(24)}
}));
giftBtn.addEventListener('click',()=>{giftMessage.classList.toggle('show');spawnPetals(6)});

const nameInput=document.getElementById('guestName'),guestCountEl=document.getElementById('guestCount');
const extraNames=document.getElementById('extraNames');
function renderExtras(){
  const old=[...extraNames.querySelectorAll('input')].map(i=>i.value);
  extraNames.innerHTML='';
  for(let i=0;i<guests-1;i++){
    const inp=document.createElement('input');
    inp.type='text';inp.maxLength=40;inp.className='extra-name';
    inp.placeholder=`Nombre de la persona ${i+2}`;
    inp.setAttribute('aria-label',`Nombre de la persona ${i+2}`);
    inp.value=old[i]||'';
    extraNames.appendChild(inp);
  }
}
document.getElementById('plusGuest').addEventListener('click',()=>{guests=Math.min(10,guests+1);guestCountEl.textContent=guests;renderExtras()});
document.getElementById('minusGuest').addEventListener('click',()=>{guests=Math.max(1,guests-1);guestCountEl.textContent=guests;renderExtras()});
confirmBtn.addEventListener('click',()=>{
  guestName=nameInput.value.trim();
  const saludo=guestName?`¡Hola! Soy ${guestName}.`:'¡Hola!';
  const extras=[...extraNames.querySelectorAll('input')].map(i=>i.value.trim()).filter(Boolean);
  const todos=[guestName,...extras].filter(Boolean);
  const lista=todos.length>1?todos.slice(0,-1).join(', ')+' y '+todos[todos.length-1]:'';
  const quienes=guests===1?'Asistiré con mucho gusto.':`Asistiremos ${guests} personas${lista?': '+lista:''}, con mucho gusto.`;
  const msg=`${saludo} Con mucha alegría confirmo mi asistencia al Baby Shower de Almudena, el sábado 14 de noviembre a las 7:00 p. m. ${quienes} ¡Gracias por invitarme a un momento tan especial, nos vemos pronto!`;
  document.getElementById('waBtn').href=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  const nombres=todos.length>1?todos.slice(0,-1).join(', ')+' y '+todos[todos.length-1]:(todos[0]||'');
  document.getElementById('thanksTitle').textContent=nombres?`¡Gracias, ${nombres}!`:'¡Gracias por acompañarnos!';
  window.open(document.getElementById('waBtn').href,'_blank','noopener');
  confirmed=true;spawnPetals(22);updateSlide(slides.length-1);
});
// calendario (.ics)
document.querySelectorAll('.cal-btn').forEach(b=>b.addEventListener('click',()=>{
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Baby Shower Almudena//ES','BEGIN:VEVENT','UID:babyshower-almudena-2026@invitacion','DTSTAMP:20261022T000000Z','DTSTART:20261115T000000Z','DTEND:20261115T030000Z','SUMMARY:Baby Shower de Almudena','LOCATION:Urb. Posada del Sol 2da etapa\\, H3 lote 03 - Menorca','DESCRIPTION:Te esperamos con mucho cariño 💗','END:VEVENT','END:VCALENDAR'].join('\r\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));a.download='baby-shower-almudena.ics';document.body.appendChild(a);a.click();a.remove();
  b.textContent='📅 ¡Agregado! ✓';
}));
// compartir
document.getElementById('shareBtn').addEventListener('click',async()=>{
  const data={title:'Baby Shower de Almudena',text:'Estás invitado/a al baby shower de Almudena 💗',url:location.href};
  try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(location.href);document.getElementById('shareBtn').textContent='💌 ¡Enlace copiado! ✓'}}catch(e){}
});
// las conejitas responden al toque
document.querySelectorAll('.bunny-top,.mini-bunny,.thanks-bunny').forEach(i=>i.addEventListener('click',()=>spawnPetals(6)));
// ===== Armario del código de vestimenta =====
(function(){
  const w=document.getElementById('wardrobe'),panel=w.closest('.panel-dress');
  const combos=[...document.querySelectorAll('#combos .combo')];
  const LOOKS={white:['#ffffff','#d9c3a0'],beige:['#d9c3a0','#ffffff']};
  let open=false;
  function toggle(force){
    open=typeof force==='boolean'?force:!open;
    w.classList.toggle('open',open);w.setAttribute('aria-expanded',open);
    if(open)spawnPetals(12);
  }
  w.addEventListener('click',e=>{
    if(open&&e.target.closest('.w-bunny')){spawnPetals(6);return}
    toggle();
  });
  w.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}});
  combos.forEach(b=>b.addEventListener('click',()=>{
    combos.forEach(x=>x.classList.toggle('sel',x===b));
    const [m,a]=LOOKS[b.dataset.look];
    panel.style.setProperty('--main',m);panel.style.setProperty('--accent',a);
    if(!open)toggle(true);else spawnPetals(5);
  }));
})();

restartBtn.addEventListener('click',()=>{updateSlide(0);window.scrollTo({top:0,behavior:'smooth'});spawnPetals(10)});

musicToggle.addEventListener('click',async()=>{
  if(music.paused){try{await music.play();musicToggle.textContent='⏸'}catch(e){}}
  else{music.pause();musicToggle.textContent='▶'}
});

function updateCountdown(){
  const target=new Date('2026-11-14T19:00:00-05:00');
  let diff=target-new Date(); if(diff<0)diff=0;
  const days=Math.floor(diff/86400000); diff%=86400000;
  const hours=Math.floor(diff/3600000); diff%=3600000;
  const minutes=Math.floor(diff/60000); diff%=60000;
  const seconds=Math.floor(diff/1000);
  document.getElementById('days').textContent=days;
  document.getElementById('hours').textContent=hours;
  document.getElementById('minutes').textContent=minutes;
  document.getElementById('seconds').textContent=String(seconds).padStart(2,'0');
}
updateCountdown(); setInterval(updateCountdown,1000);

app.addEventListener('touchstart',e=>{
  if(e.target.closest('button,a,[role="button"],input,textarea,select,.arena'))return;
  touchStartX=e.changedTouches[0].screenX;touchStartY=e.changedTouches[0].screenY;
},{passive:true});
app.addEventListener('touchend',e=>{
  if(app.classList.contains('hidden')||e.target.closest('button,a,[role="button"],input,textarea,select,.arena'))return;
  const dx=e.changedTouches[0].screenX-touchStartX;
  const dy=e.changedTouches[0].screenY-touchStartY;
  if(Math.abs(dx)<70||Math.abs(dx)<Math.abs(dy)*1.25)return;
  if(dx<0)updateSlide(currentSlide+1);
  else if(dx>0&&currentSlide>0)updateSlide(currentSlide-1);
},{passive:true});

document.addEventListener('keydown',e=>{
  if(app.classList.contains('hidden')||e.target.closest('input,textarea'))return;
  if(e.key==='ArrowRight')updateSlide(currentSlide+1);
  if(e.key==='ArrowLeft')updateSlide(currentSlide-1);
});

updateSlide(0);
