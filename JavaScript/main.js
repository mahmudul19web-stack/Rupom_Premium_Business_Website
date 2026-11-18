/* ==========================================================
   RUPOM DIGITAL — MAIN JAVASCRIPT
   Author: Mahmudul Haq Rupom
   JS map: 01 selectors 02 mobile navigation 03 theme
   04 scroll reveal 05 active nav 06 dynamic footer year
   ========================================================== */
/* 01. Cache the controls used by this script */
const menuBtn=document.getElementById('menuBtn');
const navLinks=document.getElementById('navLinks');
const themeBtn=document.getElementById('themeBtn');

/* 02. Mobile menu open/close behaviour */
menuBtn.addEventListener('click',()=>{
  const opened=navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded',String(opened));
  menuBtn.innerHTML=opened?'<i class="fa-solid fa-xmark"></i>':'<i class="fa-solid fa-bars"></i>';
});
navLinks.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  navLinks.classList.remove('open');
  menuBtn.setAttribute('aria-expanded','false');
  menuBtn.innerHTML='<i class="fa-solid fa-bars"></i>';
}));

/* 03. Day/night mode; remember the visitor's last selection */
function setTheme(theme){
  const light=theme==='light';
  document.body.classList.toggle('light',light);
  themeBtn.innerHTML=light?'<i class="fa-solid fa-moon"></i>':'<i class="fa-solid fa-sun"></i>';
  themeBtn.setAttribute('aria-label',light?'Switch to dark mode':'Switch to light mode');
}
setTheme(localStorage.getItem('rupom-business-theme')||'dark');
themeBtn.addEventListener('click',()=>{
  const next=document.body.classList.contains('light')?'dark':'light';
  setTheme(next);
  localStorage.setItem('rupom-business-theme',next);
});

/* 04. Reveal content as sections enter the viewport */
const revealElements=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  const revealObserver=new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}
    });
  },{threshold:.12});
  revealElements.forEach(element=>revealObserver.observe(element));
}else{
  revealElements.forEach(element=>element.classList.add('visible'));
}

/* 05. Add an active class to the navigation item for the visible section */
const observedSections=document.querySelectorAll('main section[id]');
if('IntersectionObserver' in window){
  const sectionObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      navLinks.querySelectorAll('a[href^="#"]').forEach(link=>{
        link.classList.toggle('active',link.getAttribute('href')==='#'+entry.target.id);
      });
    });
  },{rootMargin:'-40% 0px -50% 0px'});
  observedSections.forEach(section=>sectionObserver.observe(section));
}

/* 06. Keep the copyright year up to date */
document.getElementById('year').textContent=new Date().getFullYear();

/* 07. Scroll progress indicator — shows how far the visitor has travelled */
const progressBar=document.getElementById('scrollProgress');
function updateScrollProgress(){
  const scrollable=document.documentElement.scrollHeight-window.innerHeight;
  const progress=scrollable>0?(window.scrollY/scrollable)*100:0;
  progressBar.style.width=progress+'%';
}
window.addEventListener('scroll',updateScrollProgress,{passive:true});
updateScrollProgress();

/* 08. Soft cursor spotlight for desktop screens */
const cursorGlow=document.getElementById('cursorGlow');
if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
  window.addEventListener('pointermove',event=>{
    cursorGlow.style.left=event.clientX+'px';
    cursorGlow.style.top=event.clientY+'px';
    cursorGlow.style.opacity='1';
  },{passive:true});
  document.addEventListener('pointerleave',()=>cursorGlow.style.opacity='0');
}

/* 09. 3D tilt interaction for feature cards and the hero photograph */
const tiltCards=document.querySelectorAll('.tilt-card');
if(window.matchMedia('(hover:hover) and (pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  tiltCards.forEach(card=>{
    card.addEventListener('pointermove',event=>{
      const bounds=card.getBoundingClientRect();
      const x=(event.clientX-bounds.left)/bounds.width;
      const y=(event.clientY-bounds.top)/bounds.height;
      const rotateY=(x-.5)*7;
      const rotateX=(.5-y)*6;
      card.style.transform=`perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      card.style.setProperty('--mx',`${x*100}%`);
      card.style.setProperty('--my',`${y*100}%`);
    });
    card.addEventListener('pointerleave',()=>{
      card.style.transform='';
      card.style.setProperty('--mx','50%');
      card.style.setProperty('--my','50%');
    });
  });
}

/* 10. Pointer-following warm highlight inside interactive cards */
document.querySelectorAll('.magnetic-card').forEach(card=>{
  card.addEventListener('pointermove',event=>{
    const bounds=card.getBoundingClientRect();
    card.style.setProperty('--mx',`${event.clientX-bounds.left}px`);
    card.style.setProperty('--my',`${event.clientY-bounds.top}px`);
  });
});

/* 11. Small staggered entrance delays make sections feel more intentional */
document.querySelectorAll('.services .service,.steps .step,.work-grid .work-card').forEach((item,index)=>{
  item.style.transitionDelay=`${(index%4)*75}ms`;
});
