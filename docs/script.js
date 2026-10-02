// The top bar hides on the first screen, where the big wordmark already is,
// and comes back on a solid ground once the page scrolls past it.
(function () {
  var bar = document.querySelector('.top');
  var hero = document.querySelector('.hero');
  function update() {
    var past = window.scrollY > hero.offsetHeight - 80;
    bar.classList.toggle('hidden', !past);
    bar.classList.toggle('solid', past);
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();

  // The reel only shows once it can actually play, so a missing or slow file
  // leaves the hero plain rather than a broken frame.
  var reel = document.getElementById('reel');
  if (reel) reel.addEventListener('canplay', function () {
    reel.classList.add('live');
    hero.classList.add('reel-live');
  });

  // The wheel is left to the page. The strip moves by its arrows, a trackpad,
  // shift plus wheel, or by dragging it with the mouse.
  var strip = document.getElementById('strip');
  if (strip) {
    var dragging = false, startX = 0, startLeft = 0, moved = false;
    strip.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true; moved = false; startX = e.clientX; startLeft = strip.scrollLeft;
      strip.style.scrollBehavior = 'auto';
      strip.setPointerCapture(e.pointerId);
    });
    strip.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      strip.scrollLeft = startLeft - dx;
    });
    function release() { dragging = false; strip.style.scrollBehavior = ''; }
    strip.addEventListener('pointerup', release);
    strip.addEventListener('pointercancel', release);
    strip.addEventListener('click', function (e) { if (moved) e.preventDefault(); }, true);
    function step(dir) {
      var first = strip.querySelector('figure');
      var w = first ? first.getBoundingClientRect().width + 20 : strip.clientWidth * .8;
      strip.scrollBy({ left: dir * w, behavior: 'smooth' });
    }
    document.getElementById('prev').addEventListener('click', function () { step(-1); });
    document.getElementById('next').addEventListener('click', function () { step(1); });
  }

  // Stills take turns behind the mark, seven seconds each, until the reel runs.
  var slides = document.querySelectorAll('.slide');
  var current = 0;
  if (slides.length) {
    slides[0].classList.add('on');
    setInterval(function () {
      if (hero.classList.contains('reel-live')) return;
      slides[current].classList.remove('on');
      current = (current + 1) % slides.length;
      slides[current].classList.add('on');
    }, 7000);
  }
})();
