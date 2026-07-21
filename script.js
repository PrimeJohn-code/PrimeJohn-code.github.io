(() => {
  "use strict";
  document.documentElement.dataset.js = "ready";
  const translations = {
    en:{about:"About",projects:"Projects",games:"Games",contact:"Contact",value:"Those who dream, wear their dreams into reality.",case:"Explore the case study",inquiry:"Start an inquiry"},
    ko:{about:"소개",projects:"프로젝트",games:"게임",contact:"문의",value:"꿈을 꾸는 사람은 그 꿈을 현실로 닳아가게 합니다.",case:"사례 보기",inquiry:"문의 시작"},
    zh:{about:"简介",projects:"项目",games:"游戏",contact:"联系",value:"心怀梦想的人，让梦想成为现实。",case:"查看案例",inquiry:"开始咨询"},
    ja:{about:"プロフィール",projects:"プロジェクト",games:"ゲーム",contact:"お問い合わせ",value:"夢見る人は、その夢を現実へと磨き上げる。",case:"事例を見る",inquiry:"お問い合わせ"},
    es:{about:"Perfil",projects:"Proyectos",games:"Juegos",contact:"Contacto",value:"Quien sueña convierte sus sueños en realidad.",case:"Ver el caso",inquiry:"Iniciar consulta"},
    fr:{about:"Profil",projects:"Projets",games:"Jeux",contact:"Contact",value:"Celles et ceux qui rêvent façonnent leurs rêves en réalité.",case:"Voir l’étude",inquiry:"Démarrer une demande"},
    de:{about:"Profil",projects:"Projekte",games:"Spiele",contact:"Kontakt",value:"Wer träumt, macht seine Träume zur Wirklichkeit.",case:"Fallstudie ansehen",inquiry:"Anfrage starten"},
    it:{about:"Profilo",projects:"Progetti",games:"Giochi",contact:"Contatti",value:"Chi sogna trasforma i sogni in realtà.",case:"Vedi il caso",inquiry:"Inizia una richiesta"},
    pt:{about:"Perfil",projects:"Projetos",games:"Jogos",contact:"Contato",value:"Quem sonha transforma seus sonhos em realidade.",case:"Ver o caso",inquiry:"Iniciar consulta"},
    nl:{about:"Profiel",projects:"Projecten",games:"Games",contact:"Contact",value:"Wie droomt, maakt dromen werkelijkheid.",case:"Bekijk de case",inquiry:"Start een aanvraag"}
  };
  const language = document.querySelector("#language-select");
  const applyLanguage = (code) => { const t = translations[code] || translations.en; document.querySelectorAll("[data-i18n]").forEach((element) => { const key = element.dataset.i18n.split(".").pop(); if (t[key]) element.textContent = t[key]; }); document.documentElement.lang = code; localStorage.setItem("primejohn-language", code); };
  const savedLanguage = localStorage.getItem("primejohn-language") || "en"; language.value = savedLanguage; applyLanguage(savedLanguage); language.addEventListener("change", () => applyLanguage(language.value));
  const navLinks = [...document.querySelectorAll("[data-nav]")]; const sections = navLinks.map((link) => document.querySelector(`#${link.dataset.nav}`)).filter(Boolean);
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) navLinks.forEach((link) => link.setAttribute("aria-current", link.dataset.nav === entry.target.id ? "true" : "false")); }), { rootMargin:"-35% 0px -55% 0px" }); sections.forEach((section) => observer.observe(section));
})();
