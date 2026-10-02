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
  if (reel) reel.addEventListener('canplay', function () { reel.classList.add('live'); });
})();
