const header=document.getElementById('header');
window.addEventListener('scroll',()=>{
  header.classList.toggle('scrolled',window.scrollY>30);
  const heroBg=document.querySelector('.hero-bg');
  if(heroBg) heroBg.style.transform=`scale(1.03) translateY(${window.scrollY*.035}px)`;
});

const revealItems=document.querySelectorAll('.intro-copy,.projects-head,.project-card,.project-quote,.services-title,.service-list article,.manifesto-copy,.contact>*');
revealItems.forEach(el=>el.classList.add('reveal'));

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.1});

revealItems.forEach(el=>observer.observe(el));

document.querySelectorAll('.project-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    const img=card.querySelector('img');
    img.style.transform=`scale(1.055) translate(${x*-8}px,${y*-8}px)`;
  });
  card.addEventListener('mouseleave',()=>{
    card.querySelector('img').style.transform='';
  });
});

const modal=document.getElementById('demoModal');
const openModal=e=>{
  e.preventDefault();
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
};
const closeModal=()=>{
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
};

document.querySelectorAll('.demo-action').forEach(el=>el.addEventListener('click',openModal));
document.querySelector('.modal-close').addEventListener('click',closeModal);
document.querySelector('.modal-ok').addEventListener('click',closeModal);
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});