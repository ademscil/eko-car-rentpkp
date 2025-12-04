let fadeObserver;

document.addEventListener('DOMContentLoaded', () => {
  initFadeObserver();
  observeFadeItems(document.querySelectorAll('.fade-up'));
  createFloatingWhatsapp();
  initNavToggle();

  // Dynamic car rendering from JSON so client can CRUD via CMS
  fetch('data/cars.json')
    .then(res => res.json())
    .then(data => {
      const cars = data.cars || [];
      renderCars('home-fleet', cars, ['home'], 6);
      renderCars('lepas-kunci-grid', cars, ['lepas-kunci']);
    })
    .catch(() => {
      const home = document.getElementById('home-fleet');
      if (home) home.innerHTML = '<div class="card car-card muted">Gagal memuat armada.</div>';
      const lepas = document.getElementById('lepas-kunci-grid');
      if (lepas) lepas.innerHTML = '<div class="card car-card muted">Gagal memuat armada.</div>';
    });
});

function initFadeObserver() {
  if (!('IntersectionObserver' in window)) {
    return;
  }
  fadeObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -60px 0px'
    }
  );
}

function observeFadeItems(items) {
  if (!items) return;
  items.forEach(item => {
    const delay = item.getAttribute('data-delay');
    if (delay) item.style.transitionDelay = delay;
    if (fadeObserver) {
      fadeObserver.observe(item);
    } else {
      item.classList.add('visible');
    }
  });
}

function initNavToggle() {
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
}

function renderCars(targetId, cars, categories = [], limit) {
  const container = document.getElementById(targetId);
  if (!container) return;

  const filtered = categories.length
    ? cars.filter(car => Array.isArray(car.categories) && car.categories.some(cat => categories.includes(cat)))
    : cars;

  const items = typeof limit === 'number' ? filtered.slice(0, limit) : filtered;

  if (!items.length) {
    container.innerHTML = '<div class="card car-card muted">Armada akan segera ditambahkan.</div>';
    return;
  }

  container.innerHTML = '';
  items.forEach((car, idx) => {
    const card = document.createElement('div');
    card.className = 'card car-card fade-up';
    card.setAttribute('data-delay', (idx * 0.08).toString() + 's');

    const img = document.createElement('img');
    img.src = car.image || 'https://via.placeholder.com/400x250?text=Armada';
    img.alt = car.alt || `Sewa ${car.name || 'armada'} di Pangkalpinang`;
    card.appendChild(img);

    const title = document.createElement('h3');
    title.textContent = car.name || 'Armada';
    card.appendChild(title);

    const spec = document.createElement('div');
    spec.className = 'spec';
    const transmisi = car.transmission ? `${car.transmission} - ` : '';
    const kapasitas = car.capacity || '';
    const fitur = car.feature ? ` - ${car.feature}` : '';
    spec.textContent = `${transmisi}${kapasitas}${fitur}`;
    card.appendChild(spec);

    const price = document.createElement('div');
    price.className = 'price-tag';
    price.textContent = car.price_display || 'Hubungi untuk harga';
    card.appendChild(price);

    const waLink = document.createElement('a');
    waLink.className = 'btn btn-primary';
    const text = car.whatsapp_text || `Halo saya ingin sewa ${car.name || 'armada'}`;
    waLink.href = `https://wa.me/6281374701066?text=${encodeURIComponent(text)}`;
    waLink.target = '_blank';
    waLink.rel = 'noopener';
    waLink.textContent = 'Order via WhatsApp';
    card.appendChild(waLink);

    container.appendChild(card);

    observeFadeItems([card]);
  });
}

function createFloatingWhatsapp() {
  const existing = document.querySelector('.wa-floating');
  if (existing) return;

  const btn = document.createElement('a');
  btn.href = 'https://wa.me/6281374701066?text=Halo%20saya%20ingin%20sewa%20mobil%20di%20Bangka';
  btn.target = '_blank';
  btn.rel = 'noopener';
  btn.className = 'wa-floating';
  btn.innerHTML = '<svg class="wa-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><path d="M15.999 2.667c-7.362 0-13.333 5.971-13.333 13.333 0 2.351.613 4.651 1.776 6.667L2.666 29.333l6.882-1.74a13.274 13.274 0 0 0 6.451 1.707h.002c7.362 0 13.333-5.971 13.333-13.333 0-3.561-1.387-6.906-3.907-9.426A13.264 13.264 0 0 0 16 2.667Zm6.278 18.8c-.261.736-1.525 1.397-2.1 1.488-.538.085-1.21.122-1.958-.122-.451-.144-1.03-.334-1.778-.65-3.128-1.353-5.163-4.505-5.32-4.72-.158-.215-1.272-1.695-1.272-3.235 0-1.54.808-2.295 1.094-2.61.286-.315.62-.393.827-.393.206 0 .413 0 .595.01.192.01.446-.072.698.532.261.629.889 2.173.967 2.332.077.158.129.344.025.558-.103.215-.154.344-.308.53-.154.187-.324.417-.461.56-.154.154-.314.322-.135.63.179.308.797 1.312 1.71 2.124 1.177 1.05 2.17 1.375 2.478 1.53.308.154.487.128.666-.077.179-.205.768-.896.973-1.205.205-.308.41-.257.698-.154.29.103 1.83.865 2.144 1.022.313.157.52.235.595.367.077.133.077.768-.182 1.504Z" fill="#fff"/></svg><span>Hubungi Kami</span>';
  document.body.appendChild(btn);
}
