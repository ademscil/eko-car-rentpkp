document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.nav-toggle');
  toggles.forEach(btn => {
    const nav = btn.nextElementSibling && btn.nextElementSibling.classList.contains('nav-collapsible')
      ? btn.nextElementSibling
      : document.querySelector('.nav');
    if (!nav) return;

    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.classList.toggle('open', open);
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('open');
      });
    });
  });
});
