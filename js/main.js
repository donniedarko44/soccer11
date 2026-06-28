// hero mijenjanje
const hero=document.getElementById('hero');
// Scroll arrow na sekciji 1
const scrollArrow = document.getElementById('scroll-arrow');
if (scrollArrow) {
  scrollArrow.addEventListener('click', () => {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
  });
}
const header=document.getElementById('header');
const heroObs=new IntersectionObserver(([e])=>{
  header.classList.toggle('solid', !e.isIntersecting);
},{threshold:0.05});
heroObs.observe(hero);

const obs=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),i*70);obs.unobserve(e.target);}
  });
},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

function handleForm(e){
  e.preventDefault();
  const btn=e.target.querySelector('.form-submit');
  btn.textContent='Message Sent ✓';
  btn.style.background='#2a6e22';
  setTimeout(()=>{btn.textContent='Send Message';btn.style.background='';e.target.reset();},3000);
}

// sirina subtitlea, da bude matching
function matchSubtitleWidth() {
  const top = document.querySelector('.logo-wordmark-top');
  const sub = document.querySelector('.logo-wordmark-sub');
  if (!top || !sub) return;
  const topW = top.getBoundingClientRect().width;
  sub.style.width = topW + 'px';
  sub.style.display = 'flex';
  sub.style.justifyContent = 'space-between';
}
document.fonts.ready.then(matchSubtitleWidth);
window.addEventListener('resize', matchSubtitleWidth);