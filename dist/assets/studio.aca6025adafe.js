(() => {
  'use strict';
  document.addEventListener('error', event => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement) || !img.closest('.cover, .dialog-cover')) return;
    img.hidden = true;
    img.parentElement.classList.add('image-unavailable');
  }, true);
  document.querySelectorAll('.cover img').forEach(img => {
    if (img.complete && img.naturalWidth === 0) { img.hidden = true; img.parentElement.classList.add('image-unavailable'); }
  });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const contact = document.querySelector('#briefContact');
  const whatsapp = subject => 'https://wa.me/5554991680204?text=' + encodeURIComponent('Olá Humberto! Vi seu portfólio e quero conversar sobre ' + subject + ' para minha empresa.');
  document.querySelectorAll('[data-service]').forEach(link => { link.href = whatsapp(link.dataset.service); });
  const choices = [...document.querySelectorAll('[data-brief]')];
  function choose(choice) {
    choices.forEach(button => button.setAttribute('aria-pressed', String(button === choice)));
    contact.href = whatsapp(choice.dataset.brief);
  }
  choices.forEach(button => button.addEventListener('click', () => choose(button)));
  choose(choices[0]);
  // Feature detection and reduced-motion preference keep content readable everywhere.
  if ('IntersectionObserver' in window && !reduced.matches) {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); reveal.unobserve(entry.target); }
    }), { threshold: 0.06 });
    document.documentElement.classList.add('motion-ready');
    document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));
    reduced.addEventListener('change', e => { if(e.matches) document.documentElement.classList.remove('motion-ready'); });
  }
  const meter = document.createElement('div');
  meter.className = 'scroll-meter'; meter.setAttribute('aria-hidden', 'true');
  document.body.append(meter);
  const portrait = document.querySelector('.portrait');
  const desktop = matchMedia('(min-width: 1000px)');
  let pending = false;
  function frame() {
    pending = false;
    const distance = document.documentElement.scrollHeight - innerHeight;
    meter.style.transform = 'scaleX(' + (distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0) + ')';
    if (!reduced.matches && desktop.matches) portrait.style.setProperty('--portrait-offset', Math.min(scrollY * 0.035, 20) + 'px');
    else portrait.style.removeProperty('--portrait-offset');
  }
  function schedule(){ if(!pending){pending=true;requestAnimationFrame(frame);} }
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);frame();
})();
