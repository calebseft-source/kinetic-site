// The hero reel only shows once it can actually play, so a missing or slow
// file leaves the hero plain rather than a broken frame.
(function () {
  var reel = document.getElementById('reel');
  if (reel) reel.addEventListener('canplay', function () { reel.classList.add('live'); });

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
})();
