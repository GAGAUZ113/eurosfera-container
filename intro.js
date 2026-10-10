/* Заставка при первом входе: логотип, слоган, вход со звуком или без. Показывается один раз. */
(function () {
  var root = document.documentElement, box = document.querySelector('.intro');
  if (!box) return;
  if (!root.classList.contains('intro-on')) { box.remove(); return; }

  var go = box.querySelector('.intro__go'), mute = box.querySelector('.intro__mute'), left = false;
  /* Озвученного слогана может не быть — тогда не обещаем звук: остаётся одна кнопка «Войти» */
  var hasSound = false, probe = new Audio(); probe.preload = 'metadata';
  probe.addEventListener('loadedmetadata', function () { hasSound = true; });
  probe.addEventListener('error', function () { go.querySelector('span').textContent = 'Войти'; mute.hidden = true; });
  probe.src = 'audio/intro.mp3';
  function enter(withSound) {
    if (left) return; left = true;
    try { localStorage.setItem('es_intro_seen', String(Date.now())); } catch (e) {}
    if (withSound && hasSound) {
      var a = new Audio('audio/intro.mp3');          // озвученный слоган; файла нет — входим молча
      a.volume = 0.95;
      var p = a.play(); if (p && p.catch) p.catch(function () {});
    }
    box.classList.add('is-leaving');
    root.classList.remove('intro-on');               // страница снова прокручивается
    root.classList.add('js-wait');                     // заголовок появится своей анимацией
    setTimeout(function () { root.classList.remove('js-wait'); }, 2600);   // страховка, если анимации нет
    window.dispatchEvent(new Event('intro:done'));
    setTimeout(function () { box.remove(); }, 1500);
  }
  go.addEventListener('click', function () { enter(true); });
  mute.addEventListener('click', function () { enter(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') enter(false); });
})();
