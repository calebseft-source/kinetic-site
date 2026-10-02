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

  // A mouse wheel only scrolls up and down, so on the strip it drives the
  // sideways scroll instead; the arrows step one screenshot at a time.
  var strip = document.getElementById('strip');
  if (strip) {
    strip.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      var atStart = strip.scrollLeft <= 0 && e.deltaY < 0;
      var atEnd = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 1 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      strip.scrollLeft += e.deltaY;
    }, { passive: false });
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
