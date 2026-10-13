(function () {
  "use strict";

  // ---------- Configuración de la clínica ----------
  var CONFIG = {
    name: "Clínica Dr. Javier Sola",
    placeId: "ChIJXzx4KLMSRw0R9agcX3SkseQ",
    phone: "+34983397841",
    phoneLabel: "983 39 78 41"
  };
  var REVIEW_URL = "https://search.google.com/local/writereview?placeid=" + CONFIG.placeId;

  // ---------- Iconos ----------
  var I = {
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.6l2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.3l-5.9 3.2 1.3-6.5L2.5 9.4l6.6-.8z"/></svg>',
    info: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 11v6M12 7.5v.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    ext: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>'
  };
  function stars(n, cls) {
    var out = "";
    for (var i = 0; i < 5; i++) out += I.star.replace("<svg", '<svg class="' + (i < n ? (cls || "") : "") + '"');
    return out;
  }

  // ---------- Dispositivo ----------
  var ua = navigator.userAgent || "";
  var isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/i.test(ua);

  function accountText() {
    if (isAndroid) {
      return "Su móvil Android ya tiene una cuenta de Google. Lo normal es que <strong>no tenga que hacer nada</strong>: Google la usará sola.";
    }
    if (isIOS) {
      return "En el iPhone, Google puede pedirle que <strong>entre con su correo de Gmail</strong> y su contraseña. Si no la recuerda, pida ayuda en recepción.";
    }
    return "Google puede pedirle que <strong>entre con su cuenta</strong> (su correo de Gmail y su contraseña). Si no la recuerda, pida ayuda en recepción.";
  }

  // ---------- Pantallas ----------
  var SCREENS = {
    welcome: {
      step: 0,
      say: "Gracias por su visita. Le ayudamos a dejar su opinión en Google en tres pasos muy sencillos. Pulse el botón Empezar.",
      html: function () {
        return '' +
          '<div class="hero-stars">' + stars(5) + '</div>' +
          '<h1 class="center">Gracias por su visita</h1>' +
          '<p class="lead center">Le ayudamos a dejar su opinión en Google en <strong>3 pasos muy sencillos</strong>. Solo le llevará un minuto.</p>' +
          '<div class="note">' + I.info + '<div>Su opinión ayuda a otros pacientes a conocernos. ¡Muchas gracias!</div></div>' +
          '<div class="actions">' +
            '<button class="btn btn--primary btn--big" data-go="account">Empezar ' + I.arrow + '</button>' +
            '<a class="link center" href="' + REVIEW_URL + '" target="_blank" rel="noopener" data-open>Ya sé hacerlo: ir directo a Google</a>' +
          '</div>';
      }
    },

    account: {
      step: 1,
      say: function () {
        return "Paso 1 de 3. Su cuenta de Google. " + strip(accountText()) + " Pulse Siguiente.";
      },
      html: function () {
        return '' +
          '<p class="step-label">Paso 1 de 3</p>' +
          '<h1>Su cuenta de Google</h1>' +
          '<p class="lead">Para publicar una opinión, Google necesita saber quién la escribe.</p>' +
          '<div class="card"><div class="note" style="background:none;padding:0">' + I.info + '<div>' + accountText() + '</div></div></div>' +
          '<div class="actions">' +
            '<button class="btn btn--primary" data-go="howto">Siguiente ' + I.arrow + '</button>' +
            '<button class="btn btn--ghost" data-back>Atrás</button>' +
          '</div>';
      }
    },

    howto: {
      step: 2,
      say: "Paso 2 de 3. Qué verá en Google. Uno: toque las estrellas. Dos: escriba unas palabras, o pulse el micrófono del teclado y hable. Tres: pulse Publicar. Pulse Siguiente.",
      html: function () {
        return '' +
          '<p class="step-label">Paso 2 de 3</p>' +
          '<h1>Qué verá en Google</h1>' +
          '<div class="mock" aria-hidden="true">' +
            '<div class="mock__title">' + CONFIG.name + '</div>' +
            '<div><span class="tag">1</span><span class="mock__stars" style="display:inline-flex;vertical-align:middle">' + stars(5, "lit") + '</span></div>' +
            '<div style="display:flex;align-items:center"><span class="tag">2</span><div class="mock__box" style="flex:1">Comparta detalles de su experiencia…<span class="mock__mic">' + I.mic + '</span></div></div>' +
            '<div style="display:flex;align-items:center;justify-content:flex-end"><span class="tag">3</span><span class="mock__send">Publicar</span></div>' +
          '</div>' +
          '<ol class="howto">' +
            '<li><span class="num">1</span><div><strong>Toque las estrellas</strong> que quiera dar.</div></li>' +
            '<li><span class="num">2</span><div><strong>Escriba unas palabras</strong>. Si le cuesta, pulse el <strong>micrófono</strong> del teclado y hable.</div></li>' +
            '<li><span class="num">3</span><div>Pulse <strong>Publicar</strong>. ¡Y listo!</div></li>' +
          '</ol>' +
          '<div class="actions">' +
            '<button class="btn btn--primary" data-go="go">Siguiente ' + I.arrow + '</button>' +
            '<button class="btn btn--ghost" data-back>Atrás</button>' +
          '</div>';
      }
    },

    go: {
      step: 3,
      say: "Paso 3 de 3. Ya está todo preparado. Pulse el botón grande para abrir Google y dejar su opinión. Cuando termine, vuelva a esta página.",
      html: function () {
        return '' +
          '<p class="step-label">Paso 3 de 3</p>' +
          '<h1>¡Todo preparado!</h1>' +
          '<p class="lead">Pulse el botón grande. Se abrirá Google con las estrellas de nuestra clínica.</p>' +
          '<div class="actions" style="margin-top:8px">' +
            '<a class="btn btn--primary btn--big pulse" href="' + REVIEW_URL + '" target="_blank" rel="noopener" data-open>' + I.ext + ' Abrir Google y dejar mi opinión</a>' +
          '</div>' +
          '<div class="note">' + I.info + '<div>Cuando termine, vuelva a esta pantalla.</div></div>' +
          '<div class="actions">' +
            '<button class="btn btn--ghost" data-back>Atrás</button>' +
          '</div>';
      }
    },

    thanks: {
      step: 4,
      say: "¡Muchas gracias por su opinión! Si ha tenido algún problema, llámenos o pregunte en recepción y le ayudamos.",
      html: function () {
        return '' +
          '<div class="thanks-icon">' + I.star + '</div>' +
          '<h1 class="center">¡Muchas gracias!</h1>' +
          '<p class="lead center">Su opinión nos ayuda mucho a nosotros y a otros pacientes.</p>' +
          '<div class="card">' +
            '<p style="margin:0"><strong>¿Algún problema?</strong> Pregunte en recepción o llámenos al <a class="call" href="tel:' + CONFIG.phone + '">' + CONFIG.phoneLabel + '</a> y le ayudamos.</p>' +
          '</div>' +
          '<div class="actions">' +
            '<a class="btn btn--primary" href="tel:' + CONFIG.phone + '">' + I.phone + ' Llamar a la clínica</a>' +
            '<a class="btn btn--ghost" href="' + REVIEW_URL + '" target="_blank" rel="noopener" data-open>Volver a abrir Google</a>' +
          '</div>';
      }
    }
  };

  // ---------- Utilidades ----------
  function strip(html) { var d = document.createElement("div"); d.innerHTML = html; return d.textContent || ""; }
  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }

  // ---------- Lectura en voz alta ----------
  var canSpeak = "speechSynthesis" in window;
  var listening = store("qr-listen") === "1";
  var voice = null;
  function pickVoice() {
    if (!canSpeak) return;
    var vs = speechSynthesis.getVoices();
    voice = vs.filter(function (v) { return /^es-ES/i.test(v.lang); })[0] ||
            vs.filter(function (v) { return /^es/i.test(v.lang); })[0] || null;
  }
  if (canSpeak) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }

  function speak(text) {
    if (!canSpeak || !text) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "es-ES"; u.rate = 0.92;
    if (voice) u.voice = voice;
    speechSynthesis.speak(u);
  }
  function currentSay() {
    var s = SCREENS[current].say;
    return typeof s === "function" ? s() : s;
  }

  var btnListen = document.getElementById("btn-listen");
  if (!canSpeak) btnListen.hidden = true;
  btnListen.setAttribute("aria-pressed", String(listening));
  btnListen.addEventListener("click", function () {
    listening = !listening;
    btnListen.setAttribute("aria-pressed", String(listening));
    store("qr-listen", listening ? "1" : "0");
    if (listening) speak(currentSay()); else if (canSpeak) speechSynthesis.cancel();
  });

  // ---------- Tamaño de letra ----------
  var btnSize = document.getElementById("btn-size");
  function applySize(big) {
    document.documentElement.classList.toggle("big", big);
    btnSize.setAttribute("aria-pressed", String(big));
  }
  applySize(store("qr-big") === "1");
  btnSize.addEventListener("click", function () {
    var big = !document.documentElement.classList.contains("big");
    applySize(big);
    store("qr-big", big ? "1" : "0");
  });

  // ---------- Navegación ----------
  var main = document.getElementById("main");
  var bars = document.querySelectorAll("#progress span");
  var progress = document.getElementById("progress");
  var current = "welcome";
  var openedGoogle = false;

  function render(name) {
    current = SCREENS[name] ? name : "welcome";
    var sc = SCREENS[current];
    main.innerHTML = '<section class="screen">' + sc.html() + '</section>';
    progress.classList.toggle("hidden", sc.step === 0 || sc.step === 4);
    for (var i = 0; i < bars.length; i++) bars[i].classList.toggle("on", i < sc.step);
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
    if (listening) speak(currentSay());
  }

  function go(name) {
    history.pushState({ s: name }, "", "#" + name);
    render(name);
  }

  main.addEventListener("click", function (e) {
    var t = e.target.closest("[data-go],[data-back],[data-open]");
    if (!t) return;
    if (t.hasAttribute("data-go")) go(t.getAttribute("data-go"));
    else if (t.hasAttribute("data-back")) history.back();
    else if (t.hasAttribute("data-open")) {
      openedGoogle = true;
      if (canSpeak) speechSynthesis.cancel();
    }
  });

  window.addEventListener("popstate", function (e) {
    render((e.state && e.state.s) || "welcome");
  });

  // Al volver de Google, mostrar el agradecimiento
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && openedGoogle && current !== "thanks") {
      openedGoogle = false;
      go("thanks");
    }
  });

  // Arranque: siempre desde el principio
  history.replaceState({ s: "welcome" }, "", location.pathname + location.search);
  render("welcome");
})();
