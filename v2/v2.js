document.querySelectorAll('.flip').forEach(f=>f.addEventListener('click',()=>f.classList.toggle('on')));
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!RM&&window.gsap){
 gsap.registerPlugin(ScrollTrigger,SplitText);
 const mm=gsap.matchMedia();
 const go=()=>{
 /* 1. Hero: logo DL como máscara que crece */
 mm.add({d:"(min-width:681px)",m:"(max-width:680px)"},c=>{
  const big=c.conditions.d?"420vh":"620vw";
  gsap.timeline({scrollTrigger:{trigger:".hero-track",start:"top top",end:"bottom bottom",scrub:.5}})
   .to("#maskLayer",{scale:1,duration:.3,ease:"none"})
   .to("#heroIntro",{opacity:0,y:-30,duration:.2},0)
   .to("#maskLayer",{webkitMaskSize:big,maskSize:big,duration:.7,ease:"power2.in"},.15)
   .to("#heroShade",{opacity:.35,duration:.25},.75);
 });
 gsap.to("#arrow",{y:8,repeat:-1,yoyo:true,ease:"sine.inOut",duration:.9});
 /* 2. Manifiesto pinneado letra por letra */
 const st=SplitText.create("#mainText",{type:"words,chars",wordsClass:"word"});
 st.words.forEach(w=>{if(/^(9|años|years|30|DL|traducción|interpretación|translation|interpreting)\.?$/i.test(w.textContent))w.classList.add('hl')});
 gsap.set(st.chars,{opacity:.12});
 const mt=gsap.timeline();
 mt.from("#mainText .hl",{rotateY:90,opacity:0,ease:"back.out(1.7)",stagger:.12,duration:.4})
   .to(st.chars,{opacity:1,stagger:.012,duration:.2},0);
 ScrollTrigger.create({trigger:".manifest",pin:true,start:"top top",end:"+=120%",scrub:.5,animation:mt});
 /* títulos letra por letra */
 document.querySelectorAll("section h2").forEach(h=>{const s=SplitText.create(h,{type:"chars"});
  gsap.from(s.chars,{opacity:0,scale:1.2,y:10,stagger:.02,duration:.5,ease:"power2.out",scrollTrigger:{trigger:h,start:"top 88%"}})});
 /* 3. Servicios: filas con reveal 3D */
 gsap.utils.toArray(".r3d").forEach(r=>{
  gsap.timeline({scrollTrigger:{trigger:r,start:"top 90%",end:"top 55%",scrub:1}})
   .from(r,{opacity:0,x:80,rotateY:-20})
   .from(r.querySelector(".i"),{scale:0,ease:"back.out(2)"},"<.1")
   .from(r.querySelector("h3"),{x:-50,opacity:0},"<.1")
   .from(r.querySelector("p"),{y:30,opacity:0},"<.1");
 });
 /* 4. Ilustración que se ensambla */
 mm.add({d:"(min-width:681px)",m:"(max-width:680px)"},c=>{
  const k=c.conditions.d?1:.5,P={"#p-doc":[-260,60],"#p-lines":[-120,-200],"#p-arrow":[0,220],"#p-bubble":[260,-160],"#p-l2":[300,100],"#p-check":[120,240]};
  const tl=gsap.timeline({scrollTrigger:{trigger:"#build",start:"top 92%",end:"top 35%",scrub:1}});
  Object.entries(P).forEach(([s,[x,y]],i)=>tl.from(s,{x:x*k,y:y*k,scale:0,rotate:i%2?25:-25,opacity:0,transformOrigin:"50% 50%",ease:"back.out(1.4)"},i*.12));
 });
 /* 5. Tarjetas 3D */
 gsap.from(".flip",{rotateY:-90,opacity:0,stagger:.12,duration:1,ease:"back.out(1.4)",scrollTrigger:{trigger:".flips",start:"top 82%"}});
 /* sectores en cascada */
 gsap.from("#sl span",{opacity:0,y:24,stagger:.03,duration:.6,ease:"power2.out",scrollTrigger:{trigger:"#sl",start:"top 85%"}});
 ScrollTrigger.refresh();
 };
 document.fonts.ready.then(go);
 const _t=window.tog;window.tog=function(){_t();ScrollTrigger.refresh()};
}
