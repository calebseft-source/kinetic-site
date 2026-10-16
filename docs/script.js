// Product page: the tier buttons select, the stepper counts. Nothing is
// bought here yet, so the numbers stay on the page.
(function () {
  var tiers = document.querySelectorAll('.tier');
  tiers.forEach(function (t) {
    t.addEventListener('click', function () {
      tiers.forEach(function (o) { o.classList.remove('on'); });
      t.classList.add('on');
    });
  });
  var qty = document.getElementById('qty');
  document.querySelectorAll('.qbtn').forEach(function (b) {
    b.addEventListener('click', function () {
      var n = parseInt(qty.textContent, 10) + parseInt(b.dataset.qty, 10);
      qty.textContent = Math.max(1, Math.min(10, n));
    });
  });

  // The gallery strip moves by trackpad, shift plus wheel, or dragging it.
  // The plain wheel is left to the page.
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
  }
})();
