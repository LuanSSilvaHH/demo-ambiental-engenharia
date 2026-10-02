const items=document.querySelectorAll('.statement,.gallery-head,.gallery-card,.gallery-note,.service-grid article,.process-title,.steps>div,.cta>div');
items.forEach(el=>el.classList.add('reveal'));

const io=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
},{threshold:.1});

items.forEach(el=>io.observe(el));

window.addEventListener('scroll',()=>{
  const photo=document.querySelector('.hero-photo');
  if(photo) photo.style.transform=`scale(1.04) translateY(${window.scrollY*.035}px)`;
});

const modal=document.getElementById('demoModal');
const closeModal=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true')};
const openModal=(event)=>{
  event.preventDefault();
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
};

document.querySelectorAll('.demo-action').forEach(link=>link.addEventListener('click',openModal));
document.querySelector('.modal-close').addEventListener('click',closeModal);
document.querySelector('.modal-ok').addEventListener('click',closeModal);
modal.addEventListener('click',event=>{if(event.target===modal)closeModal()});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeModal()});