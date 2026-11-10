/* DL Servicios Lingüísticos — asistente WhatsApp (demo, 100% en el navegador) */
(function(){
const EN=()=>document.documentElement.lang==='en';
const t=(es,en)=>EN()?en:es;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=s=>esc(s).replace(/\*(.+?)\*/g,'<b>$1</b>');
const now=()=>{const d=new Date();return d.toLocaleTimeString(EN()?'en-US':'es-MX',{hour:'numeric',minute:'2-digit'})};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const TICK='<svg class="tk" viewBox="0 0 16 11"><path d="M11.07.65l-.73-.6a.4.4 0 0 0-.56.06L4.83 6.2 2.2 3.86a.4.4 0 0 0-.56.02l-.6.66a.4.4 0 0 0 .02.56l3.42 3.06a.4.4 0 0 0 .57-.04L11.13 1.2a.4.4 0 0 0-.06-.55z"/><path d="M15.07.65l-.73-.6a.4.4 0 0 0-.56.06L8.83 6.2l-.86-.77-.98 1.2 1.5 1.34a.4.4 0 0 0 .57-.04L15.13 1.2a.4.4 0 0 0-.06-.55z"/></svg>';
const LOGO=(document.querySelector('meta[name=dl-mark]')||{}).content||'../assets/fav-180.png';
const SVG={back:'<svg viewBox="0 0 24 24"><path d="M12 4l1.4 1.4L7.8 11H20v2H7.8l5.6 5.6L12 20l-8-8z"/></svg>',
video:'<svg viewBox="0 0 24 24"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11z"/></svg>',
phone:'<svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
reset:'<svg viewBox="0 0 24 24"><path d="M17.65 6.35A8 8 0 1 0 19.73 14h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"/></svg>',
send:'<svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>'};

function Chat(host,opts){
  this.host=host;this.opts=opts||{};this.build();this.reset(true);
}
Chat.prototype.build=function(){
  const h=this.host;h.classList.add('dlc');
  h.innerHTML=`<div class="dlc-top">${this.opts.back?`<button class="bk" aria-label="Cerrar chat">${SVG.back}</button>`:''}
  <div class="dlc-av"><img src="${LOGO}" alt=""></div>
  <div class="dlc-id"><b>DL Servicios Lingüísticos</b><small class="st"></small></div>
  <div class="dlc-ic"><button class="rs" aria-label="Reiniciar demo" title="Reiniciar demo">${SVG.reset}</button><button tabindex="-1" aria-hidden="true">${SVG.video}</button><button tabindex="-1" aria-hidden="true">${SVG.phone}</button></div></div>
  <div class="dlc-body" role="log" aria-live="polite"></div>
  <div class="dlc-demo"></div>
  <form class="dlc-bar"><label class="dlc-in"><span aria-hidden="true">🙂</span><input type="text" autocomplete="off" enterkeyhint="send" aria-label="Mensaje"></label><button class="dlc-send" aria-label="Enviar">${SVG.send}</button></form>`;
  this.body=h.querySelector('.dlc-body');this.st=h.querySelector('.st');this.inp=h.querySelector('input');this.demo=h.querySelector('.dlc-demo');
  h.querySelector('form').addEventListener('submit',e=>{e.preventDefault();const v=this.inp.value.trim();if(!v)return;this.inp.value='';this.typed(v)});
  h.querySelector('.rs').addEventListener('click',()=>{this.reset();this.start()});
  if(this.opts.back)h.querySelector('.bk').addEventListener('click',()=>this.opts.back());
};
Chat.prototype.reset=function(silent){
  this.gen=(this.gen||0)+1;this.q=Promise.resolve();this.wait=null;this.d={};this.last=null;this.started=false;
  this.body.innerHTML=`<div class="dlc-day"><span>${t('Hoy','Today')}</span></div><div class="dlc-sys">🔒 ${t('Demo interactiva: así respondería el asistente de DL a tus clientes. Pruébalo como si fueras uno.','Interactive demo: this is how DL’s assistant would answer your clients. Try it as if you were one.')}</div>`;
  this.st.textContent=t('en línea','online');this.inp.placeholder=t('Escribe un mensaje','Type a message');
  this.demo.style.opacity='';this.demo.textContent=t('Demo · puedes escribir o tocar los botones','Demo · type or tap the buttons');
};
Chat.prototype.start=function(){if(this.started)return;this.started=true;this.menu(true)};
Chat.prototype.scroll=function(){const b=this.body;requestAnimationFrame(()=>b.scrollTo({top:b.scrollHeight,behavior:'smooth'}))};
Chat.prototype.add=function(side,html,cls){
  const first=this.last!==side;this.last=side;
  const m=document.createElement('div');m.className=`m ${side}${first?' first':''}`;
  m.innerHTML=`<div class="bb2 ${cls||''}">${html}<span class="meta">${now()}${side==='out'?TICK:''}</span></div>`;
  this.body.appendChild(m);this.scroll();return m;
};
Chat.prototype.sys=function(txt,ok){const g=this.gen;this.q=this.q.then(async()=>{await sleep(350);if(g!==this.gen)return;const d=document.createElement('div');d.className='dlc-sys'+(ok?' ok':'');d.innerHTML=fmt(txt);this.body.appendChild(d);this.last=null;this.scroll()});return this};
/* bot message: text, optional buttons [[label,fn],...] */
Chat.prototype.say=function(txt,btns,o){
  const g=this.gen;o=o||{};
  this.q=this.q.then(async()=>{
    if(g!==this.gen)return;
    await sleep(o.pause||250);if(g!==this.gen)return;
    this.st.textContent=t('escribiendo…','typing…');
    const ty=document.createElement('div');ty.className='m in typing'+(this.last!=='in'?' first':'');ty.innerHTML='<div class="bb2"><span class="dots"><i></i><i></i><i></i></span></div>';
    this.body.appendChild(ty);this.scroll();
    await sleep(Math.min(650+String(txt).length*14,1900));
    ty.remove();if(g!==this.gen)return;
    this.st.textContent=t('en línea','online');
    this.add('in',o.html?txt:fmt(txt),o.cls);
    if(btns&&btns.length)this.buttons(btns,o.grid);
  });
  return this;
};
Chat.prototype.buttons=function(btns,grid){
  const w=document.createElement('div');w.className='btns'+(grid?' grid':'');
  btns.forEach(([l,fn])=>{const b=document.createElement('button');b.type='button';b.textContent=l;
    b.onclick=()=>{if(w.classList.contains('used'))return;w.classList.add('used');b.classList.add('pick');this.wait=null;this.user(l);fn.call(this,l)};w.appendChild(b)});
  this.body.appendChild(w);this.last=null;this.scroll();
};
Chat.prototype.lock=function(){this.body.querySelectorAll('.btns:not(.used)').forEach(w=>w.classList.add('used'))};
Chat.prototype.user=function(txt,html){
  this.lock();this.demo.style.opacity='0';const m=this.add('out',html?txt:esc(txt));const tk=m.querySelector('.tk');
  setTimeout(()=>tk&&tk.classList.add('rd'),900);
};
Chat.prototype.ask=function(txt,fn,btns){this.say(txt,btns);this.wait=fn;return this};
Chat.prototype.typed=function(v){
  this.user(v);const n=v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  if(/^(menu|inicio|empezar|start|main menu)\b/.test(n)){this.wait=null;return this.menu()}
  if(/(persona|humano|asesor|agente|lorena|lore\b|human|someone|real person|agent)/.test(n)){this.wait=null;return this.human()}
  if(this.wait){const f=this.wait;this.wait=null;return f.call(this,v)}
  this.route(n);
};
Chat.prototype.route=function(n){
  if(/(precio|costo|cuanto|cobran|tarifa|price|cost|how much|rate)/.test(n))return this.price();
  if(/(perito|certificad|oficial|apostill|acta|sworn|certified|official|birth)/.test(n)){this.d.tipo=t('Oficial / para trámite','Official / for procedures');return this.officialNote(()=>this.pair(()=>this.docType()))}
  if(/(interpret|simultane|consecutiv|congreso|evento|junta|conference|meeting|event)/.test(n))return this.interp();
  if(/(traduc|translat|documento|contrato|manual)/.test(n))return this.trad();
  if(/(archivo|pdf|word|adjunt|enviar doc|file|upload|attach)/.test(n))return this.doc();
  if(/(horario|hora|abren|cierran|telefono|correo|email|contacto|ubicacion|direccion|pago|hours|open|phone|contact|address|pay)/.test(n))return this.hours();
  if(/(subtitul|transcrip|revision|correccion|equipo|cabina|subtitl|transcript|proofread|equipment)/.test(n))return this.others();
  if(/(urgente|hoy|manana|urgent|today|tomorrow|asap)/.test(n))return this.say(t('Entiendo que es urgente ⚡ Te ayudo a dejar tu solicitud lista para que el equipo la vea con prioridad.','Got it, it’s urgent ⚡ Let me get your request ready so the team sees it first.'),this.mainBtns());
  if(/(gracias|thank)/.test(n))return this.say(t('¡Con gusto! 😊 Aquí estoy para lo que necesites.','You’re welcome! 😊 I’m here whenever you need me.'),[[t('Menú principal','Main menu'),this.menu]]);
  if(/^(hola|buen|hey|hi|hello|que tal)/.test(n))return this.menu();
  this.say(t('Mmm, no estoy seguro de haber entendido 🤔 Elige una opción o escribe, por ejemplo, *“traducción”*, *“interpretación”* o *“hablar con una persona”*.','Hmm, I’m not sure I got that 🤔 Pick an option or type, for example, *“translation”*, *“interpreting”* or *“talk to a person”*.'),this.mainBtns());
};
Chat.prototype.mainBtns=function(){return [
  [t('📄 Cotizar traducción','📄 Translation quote'),this.trad],
  [t('🎧 Cotizar interpretación','🎧 Interpreting quote'),this.interp],
  [t('📎 Enviar documento para cotizar','📎 Send a document for a quote'),this.doc],
  [t('✨ Otros servicios','✨ Other services'),this.others],
  [t('🕘 Horario y contacto','🕘 Hours & contact'),this.hours],
  [t('👤 Hablar con una persona','👤 Talk to a person'),this.human]]};
Chat.prototype.menu=function(first){
  this.d={};
  if(first===true){
    this.say(t('¡Hola! 👋 Gracias por escribir a *DL Servicios Lingüísticos*.','Hi! 👋 Thanks for contacting *DL Servicios Lingüísticos*.'),null,{pause:500});
    this.say(t('Soy el asistente virtual. Te ayudo a cotizar tu traducción o interpretación en minutos, a cualquier hora. ¿Qué necesitas hoy?','I’m the virtual assistant. I can help you get a translation or interpreting quote in minutes, any time. What do you need today?'),this.mainBtns());
  }else this.say(t('¿En qué más te ayudo? 😊','What else can I help you with? 😊'),this.mainBtns());
};
/* ---- traducción ---- */
Chat.prototype.trad=function(){
  this.d.serv=t('Traducción','Translation');
  const pick=l=>{this.d.tipo=l.replace(/^\S+\s/,'');if(/oficial|official/i.test(l))this.officialNote(()=>this.pair(()=>this.docType()));else this.pair(()=>this.docType())};
  this.say(t('¡Perfecto! 📄 ¿Qué tipo de traducción necesitas?','Great! 📄 What kind of translation do you need?'),[
    [t('🏛️ Oficial / para trámite','🏛️ Official / for procedures'),pick],[t('⚖️ Legal','⚖️ Legal'),pick],[t('⚙️ Técnica','⚙️ Technical'),pick],
    [t('💊 Médica o farmacéutica','💊 Medical / pharma'),pick],[t('📊 Financiera','📊 Financial'),pick],[t('📝 Otra / no estoy seguro','📝 Other / not sure'),pick]]);
};
Chat.prototype.officialNote=function(next){
  this.d.serv=this.d.serv||t('Traducción','Translation');
  this.say(t('Anotado 🏛️ Para trámites, el equipo te confirma si tu documento necesita traducción por perito y en qué formato lo debes entregar.','Noted 🏛️ For official procedures, the team will confirm whether your document needs a sworn translation and the format you need.'));
  next();
};
Chat.prototype.pair=function(next){
  const set=l=>{this.d.par=l;next()};
  this.say(t('¿De qué idioma a qué idioma?','From which language into which?'),[
    [t('Español → Inglés','Spanish → English'),set],[t('Inglés → Español','English → Spanish'),set],
    [t('🌍 Otro par de idiomas','🌍 Another language pair'),()=>this.ask(t('Escríbeme el par, por ejemplo: *francés → español*','Type the pair, e.g. *French → Spanish*'),v=>set(v.slice(0,40)))]]);
};
Chat.prototype.docType=function(){
  this.ask(t('¿Qué documento es? Escríbelo con tus palabras (por ejemplo: *acta de nacimiento*, *contrato*, *manual técnico*).','What document is it? Describe it in your own words (e.g. *birth certificate*, *contract*, *technical manual*).'),
    v=>{this.d.doc=v.slice(0,60);this.pages()});
};
Chat.prototype.pages=function(){
  const set=l=>{this.d.pags=l;this.deadline()};
  this.say(t('¿Cuántas páginas tiene, más o menos?','About how many pages is it?'),[[t('1 a 5','1–5'),set],[t('6 a 20','6–20'),set],[t('Más de 20','More than 20'),set],[t('No sé','Not sure'),set]],{grid:true});
  this.wait=v=>{const n=v.match(/\d+/);this.d.pags=n?n[0]+t(' págs.',' pages'):v.slice(0,30);this.deadline()};
};
Chat.prototype.deadline=function(after){
  after=after||(()=>this.attach());
  const set=l=>{this.d.fecha=l;if(/urgente|urgent/i.test(l))this.say(t('Lo marco como *urgente* ⚡ para que el equipo lo vea primero.','I’ll flag it as *urgent* ⚡ so the team sees it first.'));after()};
  this.say(t('¿Para cuándo lo necesitas?','When do you need it?'),[[t('Sin prisa','No rush'),set],[t('Esta semana','This week'),set],[t('⚡ Urgente (24–48 h)','⚡ Urgent (24–48 h)'),set]]);
  this.wait=v=>set(v.slice(0,40));
};
Chat.prototype.attach=function(){
  this.say(t('¿Quieres mandarme el documento ahora? Así la cotización sale exacta 👌','Want to send me the document now? That way the quote is exact 👌'),[
    [t('📎 Adjuntar documento','📎 Attach document'),()=>this.fakeFile(()=>this.name())],[t('Lo envío después','I’ll send it later'),()=>{this.d.archivo=t('Pendiente','Pending');this.name()}]]);
};
Chat.prototype.fakeFile=function(next){
  const base=(this.d.doc||t('documento','document')).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'').slice(0,28)||'documento';
  const name=base+'.pdf';this.d.archivo='✅ '+name;
  setTimeout(()=>{
    const m=this.add('out',`<div class="file"><i>PDF</i><div>${esc(name)}<small>PDF · 1.2 MB</small></div></div>`);const tk=m.querySelector('.tk');setTimeout(()=>tk&&tk.classList.add('rd'),900);
  },150);
  this.say(t('¡Recibido! ✅ Ya quedó guardado con tu solicitud.','Got it! ✅ It’s saved with your request.'),null,{pause:700});
  next();
};
Chat.prototype.name=function(){
  this.ask(t('Por último, ¿a nombre de quién hago la cotización?','Last thing: who should I address the quote to?'),v=>{
    this.d.nombre=v.replace(/^(soy|me llamo|mi nombre es|i am|i'm|my name is)\s+/i,'').slice(0,40);
    this.ask(t(`Mucho gusto, *${this.d.nombre.split(' ')[0]}* 😊 ¿Me compartes un correo para enviarte la cotización formal? (o escribe *no*)`,`Nice to meet you, *${this.d.nombre.split(' ')[0]}* 😊 Can you share an email for the formal quote? (or type *no*)`),
      v2=>{this.d.correo=/@/.test(v2)?v2.slice(0,50):t('Solo WhatsApp','WhatsApp only');this.summary()});
  });
};
Chat.prototype.summary=function(){
  const d=this.d,L=[[t('Servicio','Service'),d.serv],[t('Tipo','Type'),d.tipo],[t('Modalidad','Mode'),d.modo],[t('Evento','Event'),d.evento],[t('Idiomas','Languages'),d.par],[t('Documento','Document'),d.doc],[t('Páginas','Pages'),d.pags],[t('Fecha','Date'),d.fecha],[t('Sede','Venue'),d.sede],[t('Equipo','Equipment'),d.equipo],[t('Detalle','Details'),d.det],[t('Archivo','File'),d.archivo],[t('Nombre','Name'),d.nombre],[t('Correo','Email'),d.correo]].filter(r=>r[1]);
  const html=`<div class="sum"><h4>📋 ${t('Resumen de tu solicitud','Your request summary')}</h4><table>${L.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}</table></div>`;
  this.say(html,null,{html:true,cls:'sum'});
  this.say(t(`¡Listo, ${d.nombre.split(' ')[0]}! 🙌 Ya le pasé tu solicitud a *Lorena*. Ella la revisa y te envía el *precio y la fecha de entrega* por este mismo chat.`,`All set, ${d.nombre.split(' ')[0]}! 🙌 I’ve passed your request to *Lorena*. She’ll review it and send you the *price and delivery date* right here.`));
  this.sys(t('🔔 Lorena recibió un aviso con este resumen','🔔 Lorena got a notification with this summary'),true);
  this.say(t('Horario de atención: lunes a viernes, 9:00 a 18:00. Si escribiste fuera de horario, tu solicitud ya está en la fila para primera hora. ¿Algo más?','Office hours: Monday to Friday, 9:00 am to 6:00 pm. If you wrote after hours, your request is already first in line. Anything else?'),
    [[t('Menú principal','Main menu'),this.menu],[t('👤 Hablar con una persona','👤 Talk to a person'),this.human]]);
};
/* ---- interpretación ---- */
Chat.prototype.interp=function(){
  this.d.serv=t('Interpretación','Interpreting');
  const pick=l=>{this.d.tipo=l.replace(/^\S+\s/,'');this.mode()};
  const b=[[t('🎙️ Simultánea','🎙️ Simultaneous'),pick],[t('🗣️ Consecutiva','🗣️ Consecutive'),pick]];
  this.say(t('¡Claro! 🎧 ¿Qué tipo de interpretación necesitas?','Sure! 🎧 What kind of interpreting do you need?'),b.concat([[t('🤔 No sé cuál me conviene','🤔 Not sure which one'),()=>{
    this.say(t('Te explico rápido:\n*Simultánea:* el intérprete traduce en tiempo real, ideal para congresos y eventos grandes (se usa cabina y receptores).\n*Consecutiva:* el intérprete habla después de cada intervención, ideal para juntas, entrevistas y visitas.','Quick explanation:\n*Simultaneous:* the interpreter speaks in real time, ideal for conferences and large events (booth and receivers).\n*Consecutive:* the interpreter speaks after each speaker, ideal for meetings, interviews and visits.'));
    this.say(t('¿Cuál se parece más a lo que necesitas?','Which one sounds closer to what you need?'),[[t('🎙️ Simultánea','🎙️ Simultaneous'),pick],[t('🗣️ Consecutiva','🗣️ Consecutive'),pick]]);}]]));
};
Chat.prototype.mode=function(){
  const set=l=>{this.d.modo=l.replace(/^\S+\s/,'');const pres=/presencial|in person/i.test(l);
    if(pres&&/simult/i.test(this.d.tipo))this.say(t('¿Necesitas también el *equipo de interpretación* (cabina y receptores)? También lo rentamos.','Do you also need the *interpreting equipment* (booth and receivers)? We rent it too.'),[[t('Sí','Yes'),e=>{this.d.equipo=e;this.event(pres)}],[t('No','No'),e=>{this.d.equipo=e;this.event(pres)}],[t('No sé','Not sure'),e=>{this.d.equipo=e;this.event(pres)}]],{grid:true});
    else this.event(pres)};
  this.say(t('¿Será presencial o remota?','In person or remote?'),[[t('📍 Presencial','📍 In person'),set],[t('💻 Remota (Zoom, Teams…)','💻 Remote (Zoom, Teams…)'),set]]);
};
Chat.prototype.event=function(pres){
  const set=l=>{this.d.evento=l.replace(/^\S+\s/,'');this.ask(t('¿Qué fecha y cuánto dura? (por ejemplo: *25 de noviembre, 4 horas*)','What date and how long? (e.g. *November 25, 4 hours*)'),v=>{this.d.fecha=v.slice(0,50);this.pair(()=>pres?this.ask(t('¿En qué ciudad o sede será?','Which city or venue?'),v2=>{this.d.sede=v2.slice(0,50);this.name()}):this.name())})};
  this.say(t('¿Qué tipo de evento es?','What kind of event is it?'),[[t('🎤 Congreso o conferencia','🎤 Conference'),set],[t('🤝 Junta de negocios','🤝 Business meeting'),set],[t('⚖️ Audiencia o trámite legal','⚖️ Hearing / legal matter'),set],[t('📌 Otro','📌 Other'),set]]);
};
/* ---- documento ---- */
Chat.prototype.doc=function(){
  this.d.serv=t('Traducción','Translation');
  this.say(t('📎 ¡Perfecto! Mándame tu archivo por aquí (PDF, Word o foto) y lo dejo listo para cotizar.','📎 Great! Send me your file here (PDF, Word or photo) and I’ll get it ready for a quote.'),[
    [t('📎 Adjuntar archivo (demo)','📎 Attach file (demo)'),()=>{this.d.doc=t('Contrato','Contract');this.fakeFile(()=>this.pair(()=>this.deadline(()=>this.name())))}]]);
};
/* ---- otros ---- */
Chat.prototype.others=function(){
  const pick=(l,txt)=>{this.d.serv=l.replace(/^\S+\s/,'');this.say(txt);this.ask(t('Cuéntame brevemente qué necesitas (idiomas, duración del audio o video, páginas, fecha…).','Tell me briefly what you need (languages, audio/video length, pages, date…).'),v=>{this.d.det=v.slice(0,80);this.name()})};
  this.say(t('Además de traducción e interpretación, en DL también hacemos:','Besides translation and interpreting, DL also offers:'),[
    [t('✍️ Revisión y corrección','✍️ Proofreading & editing'),l=>pick(l,t('Revisamos traducciones existentes para que suenen naturales ✍️','We review existing translations so they read naturally ✍️'))],
    [t('🎧 Transcripción','🎧 Transcription'),l=>pick(l,t('Convertimos audio y video a texto 🎧','We turn audio and video into text 🎧'))],
    [t('🎬 Subtitulaje','🎬 Subtitling'),l=>pick(l,t('Subtítulos para videos, cursos y contenido digital 🎬','Subtitles for videos, courses and digital content 🎬'))],
    [t('🎛️ Renta de equipo de interpretación','🎛️ Interpreting equipment rental'),l=>pick(l,t('Equipo para interpretación simultánea en tus eventos 🎛️','Simultaneous interpreting equipment for your events 🎛️'))]]);
};
/* ---- horario / contacto ---- */
Chat.prototype.hours=function(){
  this.say(t('🕘 *Horario de atención*\nLunes a viernes, 9:00 a 18:00\n\n📞 (55) 5413-9266\n✉️ lorena@dlsl.com.mx\n💳 Efectivo, tarjeta, transferencia y PayPal','🕘 *Office hours*\nMonday to Friday, 9:00 am to 6:00 pm\n\n📞 +52 55 5413 9266\n✉️ lorena@dlsl.com.mx\n💳 Cash, card, wire transfer and PayPal'));
  this.say(t('Y por aquí te atiendo *24/7* 🌙 Si escribes fuera de horario, dejo tu solicitud lista para que el equipo te responda a primera hora.','And I’m here *24/7* 🌙 If you write after hours, I’ll leave your request ready so the team replies first thing.'),
    [[t('📄 Cotizar traducción','📄 Translation quote'),this.trad],[t('🎧 Cotizar interpretación','🎧 Interpreting quote'),this.interp],[t('Menú principal','Main menu'),this.menu]]);
};
/* ---- precio ---- */
Chat.prototype.price=function(){
  this.say(t('El precio depende del idioma, la especialidad, el número de páginas y la urgencia, por eso preferimos darte una cifra exacta y no una al aire 😉 Con unos datos te preparamos tu cotización.','The price depends on the language, field, page count and urgency, so we’d rather give you an exact figure than a guess 😉 With a few details we’ll prepare your quote.'),
    [[t('📄 Cotizar traducción','📄 Translation quote'),this.trad],[t('🎧 Cotizar interpretación','🎧 Interpreting quote'),this.interp],[t('📎 Enviar documento para cotizar','📎 Send a document for a quote'),this.doc]]);
};
/* ---- persona ---- */
Chat.prototype.human=function(){
  this.say(t('¡Claro! 🙂 Ya le avisé a *Lorena* para que te atienda personalmente.','Of course! 🙂 I’ve let *Lorena* know so she can help you personally.'));
  this.sys(t('🔔 Lorena recibió un aviso: un cliente quiere hablar con ella','🔔 Lorena got a notification: a client wants to talk to her'),true);
  this.ask(t('En horario de oficina te responde en breve; si no, a primera hora del siguiente día hábil. Mientras, ¿quieres adelantarme de qué se trata? Así ya llega con el contexto.','During office hours she’ll reply shortly; otherwise, first thing the next business day. Meanwhile, want to tell me what it’s about? That way she has the context.'),
    v=>{this.say(t('Gracias, se lo paso tal cual ✅ En un momento te escribe.','Thanks, I’ll pass it on as is ✅ She’ll write to you soon.'),[[t('Menú principal','Main menu'),this.menu]])});
};

/* ---------- montaje ---------- */
const chats=[];
// inline (sección)
const inl=document.getElementById('dlcInline');
if(inl){const c=new Chat(inl);chats.push(c);
  const io=new IntersectionObserver(e=>{if(e[0].isIntersecting){c.start();io.disconnect()}},{threshold:.35});io.observe(inl);}
// flotante
const fab=document.getElementById('waFab'),panel=document.getElementById('waPanel'),tip=document.getElementById('waTip');
let pc=null;
function openP(){if(!pc){pc=new Chat(panel.querySelector('.dlc-host'),{back:closeP});chats.push(pc)}
  panel.classList.add('open');fab.classList.remove('ping');tip&&tip.classList.remove('on');fab.setAttribute('aria-expanded','true');
  if(matchMedia('(max-width:600px)').matches)document.body.classList.add('chat-lock');
  setTimeout(()=>pc.start(),250);}
function closeP(){panel.classList.remove('open');document.body.classList.remove('chat-lock');fab.setAttribute('aria-expanded','false')}
window.dlOpenChat=openP;
if(fab){fab.addEventListener('click',()=>panel.classList.contains('open')?closeP():openP());
  document.querySelectorAll('[data-open-chat]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openP()}));
  addEventListener('keydown',e=>{if(e.key==='Escape')closeP()});
  setTimeout(()=>{if(!panel.classList.contains('open')){fab.classList.add('ping');tip&&tip.classList.add('on')}},4500);
  if(tip){tip.addEventListener('click',e=>{if(e.target.classList.contains('x')){tip.classList.remove('on');return}openP()})}}
// idioma: reinicia los chats en el idioma elegido
const _tog=window.tog;if(typeof _tog==='function'){window.tog=function(){_tog();chats.forEach(c=>{const was=c.started;c.reset();if(was)c.start()})}}
if(location.hash==='#chat')openP();
})();
