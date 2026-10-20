// Interacciones compartidas por todas las páginas de Ruth Chavac.
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const bookingForm = document.getElementById('bookingForm');
const formMessage = document.getElementById('formMessage');
const dateInput = document.getElementById('fecha');
const backToTop = document.getElementById('backToTop');
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const now = new Date();
const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
if (dateInput) dateInput.min = localToday;

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    menuToggle.textContent = isOpen ? '×' : '☰';
  });
  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
    menuToggle.textContent = '☰';
  }));
}

document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => {
    try { sessionStorage.setItem('ruthChavacServicio', link.dataset.service); } catch (_) {}
  });
});
const serviceSelect = document.getElementById('servicio');
if (serviceSelect) {
  try {
    const selected = sessionStorage.getItem('ruthChavacServicio');
    if (selected) { serviceSelect.value = selected; sessionStorage.removeItem('ruthChavacServicio'); }
  } catch (_) {}
}

if (bookingForm && formMessage && dateInput) {
  bookingForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;
    const formData = new FormData(bookingForm);
    const request = {
      nombre: String(formData.get('nombre')).trim(),
      telefono: String(formData.get('telefono')).trim(),
      correo: String(formData.get('correo') || '').trim(),
      servicio: formData.get('servicio'),
      fecha: formData.get('fecha'),
      horario: formData.get('horario'),
      modalidad: formData.get('modalidad'),
      creado: new Date().toISOString()
    };
    try {
      const requests = JSON.parse(localStorage.getItem('ruthChavacSolicitudes') || '[]');
      requests.push(request);
      localStorage.setItem('ruthChavacSolicitudes', JSON.stringify(requests));
      formMessage.textContent = `Gracias, ${request.nombre}. La solicitud de demostración quedó guardada en este navegador para el ${request.fecha}. No se ha enviado a la clínica ni es una cita confirmada.`;
      formMessage.classList.add('visible');
      bookingForm.reset();
      dateInput.min = localToday;
    } catch (_) {
      formMessage.textContent = 'El navegador no permitió guardar la solicitud. Contacta directamente a la clínica.';
      formMessage.classList.add('visible');
    }
  });
}
if (backToTop) {
  window.addEventListener('scroll', () => backToTop.classList.toggle('visible', window.scrollY > 500));
  backToTop.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
}
