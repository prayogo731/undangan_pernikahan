/* ===== PENGATURAN (ganti di sini) ===== */
const TANGGAL = new Date('2026-12-20T08:00:00+07:00'); // tanggal & jam akad
const ALAMAT = 'Sasana Kriya, Taman Mini Indonesia Indah, Jakarta Timur, DKI Jakarta, Indonesia';
const WA = '6285609800406'; // 085609800406 format internasional
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Fallback gambar jika file belum ada */
$$('img').forEach(i => i.addEventListener('error', () => i.classList.add('noimg')));

/* Kelopak mawar berjatuhan (jumlah dibatasi agar ringan) */
function petals(box, n) {
  if (reduce) return;
  for (let i = 0; i < n; i++) {
    const p = document.createElement('span');
    p.className = 'petal';
    p.style.cssText = `left:${Math.random() * 100}%;--x:${Math.random() * 160 - 80}px;--r:${360 + Math.random() * 540}deg;` +
      `animation-duration:${7 + Math.random() * 8}s;animation-delay:${-Math.random() * 12}s;` +
      `transform:scale(${.6 + Math.random() * .9});opacity:${.5 + Math.random() * .5}`;
    box.appendChild(p);
  }
}
$$('.petals').forEach(b => petals(b, matchMedia('(max-width:767px)').matches ? 14 : 26));

/* Ripple pada tombol */
document.addEventListener('click', e => {
  const b = e.target.closest('.btn'); if (!b) return;
  const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), d = document.createElement('span');
  d.className = 'ripple';
  d.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
  b.appendChild(d); setTimeout(() => d.remove(), 600);
});

/* Musik (baru jalan setelah klik pengguna) */
const bgm = $('#bgm'), mBtn = $('#music');
function setMusic(on) {
  if (on) bgm.play().then(() => { mBtn.classList.add('play'); $('#musicIco').textContent = '❚❚'; }).catch(() => {});
  else { bgm.pause(); mBtn.classList.remove('play'); $('#musicIco').textContent = '▶'; }
}
mBtn.onclick = () => setMusic(bgm.paused);

/* Buka undangan – transisi sinematik */
$('#openBtn').onclick = () => {
  $('#opening').classList.add('out');
  document.body.classList.remove('locked');
  window.scrollTo(0, 0);
  setMusic(true);
  if (window.gsap && !reduce) {
    gsap.from('#hero .hero-bg', { scale: 1.4, duration: 2.4, ease: 'power3.out' });
    gsap.from('#hero .hero-txt', { y: 60, opacity: 0, duration: 1.8, delay: .8, ease: 'power3.out' });
  }
  setTimeout(() => $('#opening').style.display = 'none', 1700);
};

/* Menu mobile */
$('#navBtn').onclick = () => $('#navList').classList.toggle('on');
$$('#navList a').forEach(a => a.onclick = () => $('#navList').classList.remove('on'));

/* Scroll reveal (Intersection Observer) */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .15 });
$$('[data-r]').forEach(el => io.observe(el));

/* Progress bar + parallax */
let tick = false;
addEventListener('scroll', () => {
  if (tick) return; tick = true;
  requestAnimationFrame(() => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    $('#progress').style.width = (y / h * 100) + '%';
    if (!reduce) $$('[data-px]').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) el.style.transform = `translateY(${(r.top - innerHeight / 2) * -el.dataset.px}px)`;
    });
    tick = false;
  });
}, { passive: true });

/* Kartu 3D tilt */
if (!reduce && matchMedia('(hover:hover)').matches) $$('.tilt').forEach(c => {
  c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    c.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-6px)`;
  });
  c.addEventListener('mouseleave', () => c.style.transform = '');
});

/* Countdown */
const pad = n => String(n).padStart(2, '0');
function countdown() {
  const d = TANGGAL - new Date();
  if (d <= 0) { $('#cd').style.display = 'none'; $('#cdMsg').textContent = 'Hari bahagia telah tiba 🌹'; return; }
  $('#cdD').textContent = pad(Math.floor(d / 864e5));
  $('#cdH').textContent = pad(Math.floor(d / 36e5 % 24));
  $('#cdM').textContent = pad(Math.floor(d / 6e4 % 60));
  $('#cdS').textContent = pad(Math.floor(d / 1e3 % 60));
  if (!reduce) $('#cdS').animate([{transform:'scale(1.3)',color:'#fff'},{transform:'none'}],{duration:350});
}
countdown(); setInterval(countdown, 1000);

/* Google Maps – iframe & tombol memakai alamat yang sama */
const q = encodeURIComponent(ALAMAT);
$('#mapFrame').src = `https://www.google.com/maps?q=${q}&output=embed`;
$('#mapView').href = `https://www.google.com/maps/search/?api=1&query=${q}`;
$('#mapDir').href = `https://www.google.com/maps/dir/?api=1&destination=${q}`;

/* Lightbox galeri */
const figs = $$('.gallery img'); let cur = 0;
const lb = $('#lb');
const show = i => { cur = (i + figs.length) % figs.length; $('#lbImg').src = figs[cur].src; };
figs.forEach((im, i) => im.parentElement.onclick = () => { show(i); lb.classList.add('on'); });
$('#lbX').onclick = () => lb.classList.remove('on');
$('#lbP').onclick = () => show(cur - 1);
$('#lbN').onclick = () => show(cur + 1);
lb.onclick = e => { if (e.target === lb) lb.classList.remove('on'); };
addEventListener('keydown', e => {
  if (!lb.classList.contains('on')) return;
  if (e.key === 'Escape') lb.classList.remove('on');
  if (e.key === 'ArrowLeft') show(cur - 1);
  if (e.key === 'ArrowRight') show(cur + 1);
});

/* RSVP + Doa (satu pesan WhatsApp) */
const box = $('#guests'); let gid = 0;
function addGuest() {
  if ($$('.g-row', box).length >= 5) return msg('Maksimal 5 nama tamu.');
  const id = ++gid, row = document.createElement('div');
  row.className = 'g-row';
  row.innerHTML = `<input type="text" placeholder="Nama tamu" maxlength="40" aria-label="Nama tamu">
  <label><input type="radio" name="s${id}" value="HADIR"><span>HADIR</span></label>
  <label><input type="radio" name="s${id}" value="TIDAK HADIR"><span>TIDAK HADIR</span></label>
  <button type="button" class="g-del">HAPUS NAMA</button>`;
  $('.g-del', row).onclick = () => {
    if ($$('.g-row', box).length <= 1) return msg('Minimal 1 nama tamu.');
    row.remove();
  };
  box.appendChild(row); msg('');
}
function msg(t) { $('#formMsg').textContent = t; }
$('#addGuest').onclick = addGuest; addGuest();

$('#sendWA').onclick = () => {
  const rows = $$('.g-row', box), list = [];
  for (const [i, r] of rows.entries()) {
    const nama = $('input[type=text]', r).value.trim(), st = $('input[type=radio]:checked', r);
    if (!nama) return msg(`Nama tamu ke-${i + 1} belum diisi.`);
    if (!st) return msg(`Status kehadiran untuk "${nama}" belum dipilih.`);
    list.push(`${i + 1}. Nama: ${nama}\n   Kehadiran: ${st.value}`);
  }
  const doa = $('#doa').value.trim();
  if (!doa) return msg('Ucapan dan doa belum diisi.');
  msg('');
  const text = `Assalamu'alaikum.\n\nSaya ingin mengonfirmasi undangan pernikahan.\n\nDAFTAR TAMU:\n\n${list.join('\n\n')}\n\nUCAPAN DAN DOA:\n\n${doa}\n\nTerima kasih.`;
  // WhatsApp terbuka; pengguna menekan kirim sendiri
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  msg('WhatsApp dibuka. Silakan tekan tombol kirim di sana.');
};

/* ===== ANIMASI TAMBAHAN ===== */
if (!reduce) {
  // Daun mawar melayang
  $$('.petals').forEach(b => { for (let i = 0; i < 6; i++) { const l = document.createElement('span'); l.className = 'leaf';
    l.style.cssText = `left:${Math.random()*100}%;--x:${Math.random()*200-100}px;--r:${Math.random()*720}deg;animation-duration:${10+Math.random()*8}s;animation-delay:${-Math.random()*14}s`; b.appendChild(l); } });
  // Hati melayang naik di section burgundy & footer
  $$('.sec.burg,#footer').forEach(s => { const w = document.createElement('div'); w.className = 'hearts';
    for (let i = 0; i < 8; i++) { const h = document.createElement('span'); h.textContent = '♥';
      h.style.cssText = `left:${Math.random()*100}%;animation-delay:${-Math.random()*10}s;animation-duration:${8+Math.random()*6}s;font-size:${10+Math.random()*16}px`; w.appendChild(h); } s.prepend(w); });
  // Ornamen mawar di pojok section ivory
  $$('.sec.ivory').forEach((s, i) => { s.insertAdjacentHTML('afterbegin', `<svg class="rose float cr ${i % 2 ? 'cr-l' : 'cr-r'}"><use href="#rose"/></svg>`); });
  // Ledakan kelopak saat klik/sentuh
  document.addEventListener('pointerdown', e => { for (let i = 0; i < 10; i++) { const p = document.createElement('span'); p.className = 'burst';
    p.style.left = e.clientX + 'px'; p.style.top = e.clientY + 'px'; document.body.appendChild(p);
    const a = Math.PI * 2 * i / 10, d = 40 + Math.random() * 50;
    p.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(a)*d}px),calc(-50% + ${Math.sin(a)*d+30}px)) rotate(${Math.random()*360}deg) scale(.3)`, opacity: 0 }],
      { duration: 900, easing: 'ease-out' }).onfinish = () => p.remove(); } });
  // Tombol magnetik
  $$('.btn').forEach(b => { b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect();
    b.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.15}px,${(e.clientY-r.top-r.height/2)*.25}px)`; });
    b.addEventListener('mouseleave', () => b.style.transform = ''); });
}
// Judul muncul huruf per huruf
$$('.title').forEach(t => { t.innerHTML = [...t.textContent].map((c, i) => `<span class="ch" style="--i:${i}">${c === ' ' ? '&nbsp;' : c}</span>`).join(''); });
