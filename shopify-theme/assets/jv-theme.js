document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-jv-menu-open]').forEach(function (b) {
    b.addEventListener('click', function () { document.body.classList.add('jv-menu-open'); });
  });
  document.querySelectorAll('[data-jv-menu-close]').forEach(function (b) {
    b.addEventListener('click', function () { document.body.classList.remove('jv-menu-open'); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.body.classList.remove('jv-menu-open');
  });

  document.querySelectorAll('[data-jv-acc-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (window.matchMedia('(min-width: 820px)').matches) return;
      btn.closest('.foot-col').classList.toggle('is-open');
    });
  });

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
  }
});
