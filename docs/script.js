// The top bar sits over the video on the hero and takes a solid ground once
// the page scrolls past it, so it never fights the section headlines.
(function () {
  var bar = document.querySelector('.top');
  function update() { bar.classList.toggle('solid', window.scrollY > 40); }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
