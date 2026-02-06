const toggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");
const links = document.querySelectorAll("#navbar a");

toggle.addEventListener("click", () => {
  navbar.classList.toggle("active");
  toggle.classList.toggle("open");
  toggle.textContent = navbar.classList.contains("active") ? "✖" : "☰";
});

// Close menu when link clicked
links.forEach(link => {
  link.addEventListener("click", () => {
    navbar.classList.remove("active");
    toggle.classList.remove("open");
    toggle.textContent = "☰";
  });
});


// Gallery lightbox
(function(){
  const gallery = Array.from(document.querySelectorAll('.gallery-item img'));
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  let idx = 0;

  if(!gallery.length || !lb) return;

  function open(index){
    idx = index;
    lbImg.src = gallery[idx].src;
    lbImg.alt = gallery[idx].alt || '';
    lb.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function close(){
    lb.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }
  function showNext(delta){
    idx = (idx + delta + gallery.length) % gallery.length;
    lbImg.src = gallery[idx].src;
    lbImg.alt = gallery[idx].alt || '';
  }

  gallery.forEach((img, i) => img.addEventListener('click', () => open(i)));
  closeBtn.addEventListener('click', close);
  nextBtn.addEventListener('click', () => showNext(1));
  prevBtn.addEventListener('click', () => showNext(-1));
  lb.addEventListener('click', (e) => { if(e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if(lb.getAttribute('aria-hidden') === 'false'){
      if(e.key === 'Escape') close();
      if(e.key === 'ArrowRight') showNext(1);
      if(e.key === 'ArrowLeft') showNext(-1);
    }
  });
})();

// Booking form logic
(function(){
  const form = document.getElementById('booking-form');
  const modal = document.getElementById('booking-modal');
  const modalClose = document.getElementById('booking-modal-close');
  const confirmBtn = document.getElementById('booking-confirm-btn');
  const cancelBtn = document.getElementById('booking-cancel-btn');
  const summary = document.getElementById('booking-summary');
  const toast = document.getElementById('booking-success');

  if(!form) return;

  // set min date to today
  const dateInput = document.getElementById('date');
  if(dateInput){
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  function openModal(html){
    summary.innerHTML = html;
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const booking = {
      name: data.get('name'),
      phone: data.get('phone'),
      email: data.get('email') || '—',
      date: data.get('date'),
      time: data.get('time'),
      guests: data.get('guests'),
      requests: data.get('requests') || '—'
    };

    const html = `
      <p><strong>Name:</strong> ${booking.name}</p>
      <p><strong>Phone:</strong> ${booking.phone}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Date:</strong> ${booking.date} <strong>Time:</strong> ${booking.time}</p>
      <p><strong>Guests:</strong> ${booking.guests}</p>
      <p><strong>Requests:</strong> ${booking.requests}</p>
    `;
    openModal(html);
  });

  modalClose.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  confirmBtn.addEventListener('click', () => {
    // simulate save (store in localStorage)
    try {
      const data = new FormData(form);
      const entry = Object.fromEntries(data.entries());
      const key = 'bj_bookings';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push({ ...entry, createdAt: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (err) {
      console.warn('Could not save booking', err);
    }

    closeModal();
    toast.hidden = false;
    toast.textContent = 'Booking confirmed — thank you!';
    form.reset();
    // hide toast after 3s
    setTimeout(() => { toast.hidden = true; }, 3000);
  });

  // keyboard accessibility (close modal with Esc)
  document.addEventListener('keydown', (e) => {
    if(modal && modal.getAttribute('aria-hidden') === 'false' && e.key === 'Escape') closeModal();
  });
})();
