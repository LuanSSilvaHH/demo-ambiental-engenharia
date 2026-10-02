const items=document.querySelectorAll('.statement,.service-grid article,.process-title,.steps>div,.cta>div');
items.forEach(el=>el.classList.add('reveal'));
const io=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target)}})
},{threshold:.12});
items.forEach(el=>io.observe(el));

window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  document.querySelector('.sun').style.transform=`translateY(${y*.08}px)`;
});