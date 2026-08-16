// --- VIDEO FALLBACK SYSTEM ---
// If video files are missing, automatically render a premium cyberpunk canvas animation as a placeholder
document.querySelectorAll('video').forEach(function(video) {
  video.addEventListener('error', function() {
    var canvas = document.createElement('canvas');
    canvas.className = video.className;
    canvas.id = video.id;
    if (video.style.cssText) canvas.style.cssText = video.style.cssText;
    
    // Match dimensions of parent or display size
    var rect = video.getBoundingClientRect();
    canvas.width = rect.width || 300;
    canvas.height = rect.height || 300;
    
    var parent = video.parentNode;
    parent.replaceChild(canvas, video);
    
    var ctx = canvas.getContext('2d');
    var frame = 0;
    var isHero = canvas.classList.contains('hero-bg-video');

    function draw() {
      if (!document.body.contains(canvas)) return; // stop when removed from DOM
      
      // Handle resize dynamically
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth || 300;
        canvas.height = canvas.clientHeight || 300;
      }
      
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (isHero) {
        // Hero Background: Draw a digital cyberspace grid flowing forward
        ctx.strokeStyle = 'rgba(154, 75, 255, 0.08)';
        ctx.lineWidth = 1;
        var cols = 16;
        var rows = 12;
        var speed = (frame * 0.5) % 48;
        
        // Horizontal grid lines
        for (var y = speed; y < canvas.height; y += 48) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
        // Vertical grid lines
        for (var x = 0; x < canvas.width; x += canvas.width / cols) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
      } else {
        // Reel Video Items: Draw interactive equalizer waves
        ctx.strokeStyle = 'rgba(154, 75, 255, 0.4)';
        ctx.lineWidth = 1.5;
        
        ctx.beginPath();
        for (var x = 0; x < canvas.width; x += 5) {
          var waveVal = Math.sin(x * 0.03 + frame * 0.08) * Math.cos(x * 0.01 + frame * 0.04);
          var y = canvas.height / 2 + waveVal * (canvas.height * 0.25);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Draw cyber center dots
        ctx.fillStyle = 'rgba(154, 75, 255, 0.1)';
        for (var gx = 10; gx < canvas.width; gx += 30) {
          var gy = canvas.height / 2 + Math.sin(frame * 0.02 + gx) * 15;
          ctx.beginPath();
          ctx.arc(gx, gy, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      frame++;
      requestAnimationFrame(draw);
    }
    
    // Wait slightly to read display dimensions
    setTimeout(draw, 100);
  });
});

// --- CUSTOM PEN CURSOR ---
(function() {
  var cur = document.getElementById("cursor");
  var dot = document.getElementById("cursor-dot");
  var ring = document.getElementById("cursor-ring");
  var mx = 0, my = 0, rx = 0, ry = 0;
  
  if (!cur || !dot || !ring) return;

  document.addEventListener("mousemove", function(e) {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = mx + "px";
    cur.style.top  = my + "px";
    dot.style.left = mx + "px";
    dot.style.top  = my + "px";
  }, { passive: true });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + "px";
    ring.style.top  = ry + "px";
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.addEventListener("mouseleave", function() {
    cur.style.opacity = "0";
    dot.style.opacity = "0";
    ring.style.opacity = "0";
  });
  
  document.addEventListener("mouseenter", function() {
    cur.style.opacity = "1";
    dot.style.opacity = "1";
    ring.style.opacity = "1";
  });

  document.addEventListener("mousedown", function() {
    dot.style.width = "12px";
    dot.style.height = "12px";
    ring.style.width = "48px";
    ring.style.height = "48px";
  });
  
  document.addEventListener("mouseup", function() {
    dot.style.width = "6px";
    dot.style.height = "6px";
    ring.style.width = "32px";
    ring.style.height = "32px";
  });
})();

// --- SEAMLESS TICKER ---
(function() {
  var inner = document.getElementById("tickerInner");
  if (!inner) return;

  function fillTicker() {
    var vw = window.innerWidth;
    while (inner.scrollWidth < vw * 3) {
      var clone = inner.innerHTML;
      inner.innerHTML += clone;
    }
  }
  fillTicker();

  var pos = 0;
  var speed = 0.6; 
  var half = 0;

  function calcHalf() {
    half = inner.scrollWidth / 2;
  }
  calcHalf();

  function tick() {
    pos -= speed;
    if (Math.abs(pos) >= half) {
      pos = 0;
    }
    inner.style.transform = "translateX(" + pos + "px)";
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  window.addEventListener("resize", function() {
    fillTicker();
    calcHalf();
  });
})();

// --- GLITCH TITLE TRIGGER ---
(function() {
  function setup(el) {
    el.setAttribute("data-text", el.textContent.trim());
    function run() {
      el.classList.add("glitching");
      setTimeout(function() {
        el.classList.remove("glitching");
        setTimeout(run, 3000 + Math.random() * 5000);
      }, 620);
    }
    setTimeout(run, 1500 + Math.random() * 4000);
  }
  document.querySelectorAll(".sec-title em, .hero-name .l2").forEach(setup);
})();

// --- HOLOGRAM MODAL ---
function openHolo(wrap) {
  var video = wrap.querySelector("video");
  var img = wrap.querySelector("img");
  var title = wrap.querySelector(".reel-title");
  var modal = document.getElementById("holoModal");
  var holoVid = document.getElementById("holoVideo");
  var holoImg = document.getElementById("holoImage");
  var holoTitle = document.getElementById("holoTitle");
  var holoStatus = document.getElementById("holoStatus");

  // Pause all reel previews (if they support pausing)
  document.querySelectorAll(".reel-video").forEach(function(v) {
    if (v.pause) {
      v.pause();
    }
    var cw = v.closest(".reel-wrap");
    if (cw) cw.classList.remove("playing", "unmuted");
  });

  if (video) {
    holoImg.style.display = "none";
    holoVid.style.display = "block";
    
    if (video.querySelector("source")) {
      holoVid.src = video.querySelector("source").src;
    } else if (video.src) {
      holoVid.src = video.src;
    } else {
      holoVid.src = "";
    }
    
    holoVid.muted = false;
    if (title) holoTitle.textContent = title.textContent.toUpperCase() + ".MOV";
    if (holoStatus) holoStatus.textContent = "● REPRODUZINDO";
    
    modal.classList.add("open");
    document.body.style.overflow = "hidden";

    setTimeout(function() {
      holoVid.play().catch(function(){});
    }, 350);
  } else if (img) {
    holoVid.style.display = "none";
    holoImg.style.display = "block";
    holoImg.src = img.src;
    
    if (title) holoTitle.textContent = title.textContent.toUpperCase() + ".PNG";
    if (holoStatus) holoStatus.textContent = "● VISUALIZANDO";
    
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeHolo() {
  var modal = document.getElementById("holoModal");
  var holoVid = document.getElementById("holoVideo");
  var holoImg = document.getElementById("holoImage");
  modal.classList.remove("open");
  document.body.style.overflow = "";
  setTimeout(function() {
    if (holoVid) {
      holoVid.pause();
      holoVid.src = "";
    }
    if (holoImg) {
      holoImg.src = "";
    }
  }, 300);
}

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closeHolo();
});

// --- TIMELINE INTERACTION ---
(function() {
  var items = document.querySelectorAll(".tl-item");
  var progress = document.getElementById("tlProgress");
  var track = document.querySelector(".tl-track");

  function onScroll() {
    if (!track) return;
    var trackRect = track.getBoundingClientRect();
    var winH = window.innerHeight;

    items.forEach(function(item) {
      var rect = item.getBoundingClientRect();
      var trigger = winH * 0.82;
      if (rect.top < trigger) {
        item.classList.add("visible");
      }
      var mid = winH * 0.45;
      if (rect.top < mid && rect.bottom > mid) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    if (progress) {
      var containerTop = track.getBoundingClientRect().top;
      var containerH = track.offsetHeight;
      var scrolled = Math.max(0, winH * 0.5 - containerTop);
      var pct = Math.min(100, (scrolled / containerH) * 100);
      progress.style.height = pct + "%";
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// --- MOBILE HOVER FALLBACK ---
if ('ontouchstart' in window) {
  document.querySelectorAll(".reel-wrap").forEach(function(wrap) {
    wrap.removeEventListener("mouseenter", null);
    wrap.removeEventListener("mouseleave", null);
  });
}

// --- LANGUAGE DICTIONARY & TOGGLE ---
var currentLang = "pt";

var translations = {
  pt: {
    // Hero
    "hero-tag":       "Designer Gráfico & Web Designer — Cascavel, BR",
    "hero-role":      "<strong>Design Gráfico · Web Design · Social Media</strong><br>Identidade Visual · Landing Pages · UX/UI<br>Disponível para projetos freelance",
    "statLabel1":    "Anos de<br>experiência",
    "statLabel2":    "Projetos<br>entregues",
    "statLabel3":    "Áreas de<br>atuação",
    "scrollTxt":     "Scroll",
    // About
    "aboutTitle":    "O QUE<br><em>EU FAÇO</em><br>DE VERDADE.",
    "aboutText":     "Combino <strong>visual impactante</strong> com raciocínio estratégico. Não crio peças bonitas por acaso — cada entrega foi pensada para <strong>parar o scroll, criar conexão e gerar resultado real</strong>.<br><br>Trabalho com marcas de diferentes nichos desde 2020, desenvolvendo identidades visuais, criativos para anúncios e sistemas digitais que performam. 100% remoto. Sempre no prazo.",
    "infoKeyLoc":    "Localização",
    "infoValLoc":    "Cascavel, Paraná — Brasil",
    "infoKeyAvail":  "Disponibilidade",
    "infoValAvail":  "Freelance Remoto · Nacional & Internacional",
    "infoKeyLang":   "Idiomas",
    "infoValLang":   "Português Nativo · English Intermediate",
    "infoKeyEdu":    "Formação",
    "infoValEdu":    "Design Gráfico — FAG 2025",
    // Skills
    "skName1":       "Branding & Identidade",
    "skName2":       "Web & Interfaces",
    "skName3":       "Marketing & Comunicação",
    "skName4":       "Soft Skills & Gestão",
    "toolsLabel":    "Ferramentas",
    // Selected Projects
    "proj1Cat":      "SaaS · Inteligência de Dados · CRM",
    "proj1Desc":     "Plataforma SaaS de inteligência de dados B2B com base de 30M+ de empresas, CRM Kanban para vendas externas, motor de IA entrevistadora e prospecção ativa em campo.",
    "proj1Link":     "Ver projeto →",
    "proj2Cat":      "Landing Page · Agronegócio · Web Design",
    "proj2Desc":     "Landing page premium de alta conversão para produtor agrícola de sementes e feno em altitude (SC). Visual verde e dourado com curvas orgânicas de colina em SVG e fluxo de cotação via WhatsApp.",
    "proj2Link":     "Ver projeto →",
    "proj3Cat":      "E-commerce · Shopify · Branding · Web Design",
    "proj3Desc":     "Loja virtual e marca de vestuário/lifestyle (\"AAMU | Em todos os movimentos\") desenvolvida em Shopify. Design minimalista com foco na experiência do usuário e alta conversão.",
    "proj3Link":     "Ver projeto →",
    "proj4Cat":      "E-commerce · Plataforma Tray · Industrial",
    "proj4Desc":     "E-commerce completo desenvolvido na plataforma Tray para fabricante de máquinas e equipamentos industriais em aço inox para apicultura, cervejaria e vinicultura.",
    "proj4Link":     "Ver projeto →",
    // Experience
    "exp1Co":        "V4 Company",
    "exp1Role":      "Designer Gráfico",
    "exp1Desc":      "Criação de layouts, peças para redes sociais, materiais publicitários e identidades visuais para campanhas e clientes corporativos de grande porte.",
    "exp2Co":        "EEmovel Agro",
    "exp2Role":      "Designer Gráfico",
    "exp2Desc":      "Produção de peças digitais e materiais impressos para campanhas, mídias sociais e comunicação institucional, fortalecendo a percepção e clareza da marca.",
    "exp3Co":        "Staker",
    "exp3Role":      "Designer da Web",
    "exp3Desc":      "Criação de landing pages, e-mail marketing, sites institucionais e interfaces focadas em experiência do usuário. Otimização de plataformas de e-commerce.",
    // Bottom
    "langName1":     "Português <span class=\"lang-lvl\" id=\"langLvl1\">Nativo</span>",
    "langLvl1":      "Nativo",
    "langName2":     "English <span class=\"lang-lvl\" id=\"langLvl2\">Intermediário</span>",
    "langLvl2":      "Intermediário",
    "eduDegree":     "Tecnólogo em<br>Design Gráfico",
    "eduSchool":     "Centro Universitário FAG",
    "footerName":    "EMANNUEL PETRY",
    "footerCopy":    "© 2026 — Cascavel, BR"
  },
  en: {
    // Hero
    "hero-tag":       "Graphic Designer & Web Designer — Cascavel, Brazil",
    "hero-role":      "<strong>Graphic Design · Web Design · Social Media</strong><br>Visual Identity · Landing Pages · UX/UI<br>Available for freelance projects worldwide",
    "statLabel1":    "Years of<br>experience",
    "statLabel2":    "Projects<br>delivered",
    "statLabel3":    "Areas of<br>expertise",
    "scrollTxt":     "Scroll",
    // About
    "aboutTitle":    "WHAT I<br><em>TRULY DO.</em>",
    "aboutText":     "I combine <strong>impactful visuals</strong> with strategic thinking. I don't create beautiful pieces by chance — every delivery is designed to <strong>stop the scroll, build connection and drive real results</strong>.<br><br>I've worked with brands across different niches since 2020, developing visual identities, ad creatives and digital systems that perform. 100% remote. Always on time.",
    "infoKeyLoc":    "Location",
    "infoValLoc":    "Cascavel, Paraná — Brazil",
    "infoKeyAvail":  "Availability",
    "infoValAvail":  "Remote Freelance · National & International",
    "infoKeyLang":   "Languages",
    "infoValLang":   "Native Portuguese · Intermediate English",
    "infoKeyEdu":    "Education",
    "infoValEdu":    "Graphic Design — FAG 2025",
    // Skills
    "skName1":       "Branding & Identity",
    "skName2":       "Web & Interfaces",
    "skName3":       "Marketing & Communication",
    "skName4":       "Soft Skills & Management",
    "toolsLabel":    "Tools",
    // Selected Projects
    "proj1Cat":      "SaaS · Data Intelligence · CRM",
    "proj1Desc":     "B2B data intelligence SaaS platform featuring 30M+ company records, field-sales Kanban CRM, AI-driven interviewing engine and active prospecting.",
    "proj1Link":     "View project →",
    "proj2Cat":      "Landing Page · Agribusiness · Web Design",
    "proj2Desc":     "High-converting premium landing page for high-altitude seed and hay agricultural producer in Santa Catarina. Green and gold visuals with organic SVG hill curves and WhatsApp quotation flow.",
    "proj2Link":     "View project →",
    "proj3Cat":      "E-commerce · Shopify · Branding · Web Design",
    "proj3Desc":     "Full online store and visual identity for lifestyle/activewear brand (\"AAMU | In all movements\") built on Shopify. Minimalist design focused on user experience and conversion.",
    "proj3Link":     "View project →",
    "proj4Cat":      "E-commerce · Tray Platform · Industrial",
    "proj4Desc":     "Full e-commerce platform built on Tray for industrial stainless steel machinery manufacturer serving apiculture, brewing and winemaking industries.",
    "proj4Link":     "View project →",
    // Experience
    "exp1Co":        "V4 Company",
    "exp1Role":      "Graphic Designer",
    "exp1Desc":      "Created layouts, social media posts, advertising materials and visual identities for campaigns and corporate clients.",
    "exp2Co":        "EEmovel Agro",
    "exp2Role":      "Graphic Designer",
    "exp2Desc":      "Produced digital assets and print materials for marketing campaigns, social media, and institutional communication.",
    "exp3Co":        "Staker",
    "exp3Role":      "Web Designer",
    "exp3Desc":      "Developed landing pages, email templates, institutional websites, and interfaces focusing on user experience.",
    // Bottom
    "langName1":     "Portuguese <span class=\"lang-lvl\" id=\"langLvl1\">Native</span>",
    "langLvl1":      "Native",
    "langName2":     "English <span class=\"lang-lvl\" id=\"langLvl2\">Intermediate</span>",
    "langLvl2":      "Intermediate",
    "eduDegree":     "Associate Degree in<br>Graphic Design",
    "eduSchool":     "Centro Universitário FAG",
    "footerName":    "EMANNUEL PETRY",
    "footerCopy":    "© 2026 — Cascavel, BR"
  }
};

// Map translation keys to DOM elements
var domMap = [
  ["hero-tag",    "#heroTag",          "text"],
  ["hero-role",   "#heroRole",         "html"],
  ["statLabel1",  "#statLabel1",       "html"],
  ["statLabel2",  "#statLabel2",       "html"],
  ["statLabel3",  "#statLabel3",       "html"],
  ["scrollTxt",   "#scrollTxt",        "text"],

  ["aboutTitle",  "#aboutTitle",       "html"],
  ["aboutText",   "#aboutText",        "html"],
  ["infoKeyLoc",  "#infoKeyLoc",       "text"],
  ["infoValLoc",  "#infoValLoc",       "text"],
  ["infoKeyAvail", "#infoKeyAvail",     "text"],
  ["infoValAvail", "#infoValAvail",     "text"],
  ["infoKeyLang",  "#infoKeyLang",      "text"],
  ["infoValLang",  "#infoValLang",      "text"],
  ["infoKeyEdu",   "#infoKeyEdu",       "text"],
  ["infoValEdu",   "#infoValEdu",       "text"],

  ["skName1",     "#skName1",          "text"],
  ["skName2",     "#skName2",          "text"],
  ["skName3",     "#skName3",          "text"],
  ["skName4",     "#skName4",          "text"],
  ["toolsLabel",  "#toolsLabel",       "text"],

  ["proj1Cat",    "#proj1Cat",         "text"],
  ["proj1Desc",   "#proj1Desc",        "text"],
  ["proj1Link",   "#proj1Link",        "text"],
  
  ["proj2Cat",    "#proj2Cat",         "text"],
  ["proj2Desc",   "#proj2Desc",        "text"],
  ["proj2Link",   "#proj2Link",        "text"],
  
  ["proj3Cat",    "#proj3Cat",         "text"],
  ["proj3Desc",   "#proj3Desc",        "text"],
  ["proj3Link",   "#proj3Link",        "text"],
  
  ["proj4Cat",    "#proj4Cat",         "text"],
  ["proj4Desc",   "#proj4Desc",        "text"],
  ["proj4Link",   "#proj4Link",        "text"],

  ["exp1Co",      "#exp1Co",           "text"],
  ["exp1Role",    "#exp1Role",         "text"],
  ["exp1Desc",    "#exp1Desc",         "text"],
  
  ["exp2Co",      "#exp2Co",           "text"],
  ["exp2Role",    "#exp2Role",         "text"],
  ["exp2Desc",    "#exp2Desc",         "text"],
  
  ["exp3Co",      "#exp3Co",           "text"],
  ["exp3Role",    "#exp3Role",         "text"],
  ["exp3Desc",    "#exp3Desc",         "text"],

  ["langTitle",   "#langTitle",        "text"],
  ["langName1",   "#langName1",        "html"],
  ["langName2",   "#langName2",        "html"],
  ["eduTitle",    "#eduTitle",         "text"],
  ["eduDegree",   "#eduDegree",        "html"],
  ["eduSchool",   "#eduSchool",        "text"],

  ["footerName",  "#footerName",       "text"],
  ["footerCopy",  "#footerCopy",       "text"],
];

function applyLang(lang) {
  var t = translations[lang];
  currentLang = lang;

  // Update toggle classes
  document.getElementById("langEN").classList.toggle("active", lang === "en");
  document.getElementById("langPT").classList.toggle("active", lang === "pt");

  // Update Section labels dynamically with number values
  var secLabels = {
    "#aboutSecLabel":      ["01", lang === "en" ? "About" : "Sobre"],
    "#skillsSecLabel":     ["02", lang === "en" ? "Skills" : "Habilidades"],
    "#projSecLabel":       ["03", lang === "en" ? "Projects" : "Projetos"],
    "#reelsSecLabel":      ["04", lang === "en" ? "Social Media" : "Social Media"],
    "#expSecLabel":        ["05", lang === "en" ? "Experience" : "Experiência"],
    "#langSecLabel":       ["06", lang === "en" ? "Languages" : "Idiomas"],
    "#eduSecLabel":        ["07", lang === "en" ? "Education" : "Formação"]
  };
  
  Object.keys(secLabels).forEach(function(sel) {
    var el = document.querySelector(sel);
    if (el) el.innerHTML = "<span class='sec-num'>" + secLabels[sel][0] + "</span> " + secLabels[sel][1];
  });

  // Apply all dictionary keys
  domMap.forEach(function(item) {
    var key = item[0], sel = item[1], prop = item[2];
    var val = t[key];
    if (!val) return;
    var el = document.querySelector(sel);
    if (el) {
      if (prop === "text")       el.textContent = val;
      else if (prop === "html")  el.innerHTML = val;
    }
  });

  // Re-calculate data-text for glitch effects
  document.querySelectorAll(".sec-title em, .hero-name .l2").forEach(function(el) {
    el.setAttribute("data-text", el.textContent.trim());
  });

  // Brief brightness transition flash
  document.body.style.filter = "brightness(0.4)";
  setTimeout(function() { 
    document.body.style.filter = ""; 
    document.body.style.transition = "filter 0.25s"; 
  }, 60);
  setTimeout(function() { 
    document.body.style.transition = ""; 
  }, 350);
}

function toggleLang() {
  applyLang(currentLang === "pt" ? "en" : "pt");
}

document.addEventListener("DOMContentLoaded", function() {
  applyLang("pt");
});

// --- BRAND CREATIVE GALLERY MODAL LOGIC ---
var creativeGroups = {
  portalfort: {
    title: "PORTALFORT",
    category: "V4 Company · E-commerce & Ferramentas",
    items: [
      { src: "img/portalfort_feed1.png", title: "Criativo Feed #01", format: "FEED (1:1)" },
      { src: "img/portalfort_story1.png", title: "Criativo Story #01", format: "STORY (9:16)" },
      { src: "img/portalfort_feed2.png", title: "Criativo Feed #02", format: "FEED (1:1)" },
      { src: "img/portalfort_story2.png", title: "Criativo Story #02", format: "STORY (9:16)" }
    ]
  },
  maplebear: {
    title: "MAPLE BEAR",
    category: "V4 Company · Concurso de Bolsas",
    items: [
      { src: "img/maplebear_feed1.png", title: "Foco em Escassez Feed", format: "FEED (1:1)" },
      { src: "img/maplebear_story1.png", title: "Foco em Escassez Story", format: "STORY (9:16)" },
      { src: "img/maplebear_feed2.png", title: "Contagem Regressiva Feed", format: "FEED (1:1)" },
      { src: "img/maplebear_story2.png", title: "Contagem Regressiva Story", format: "STORY (9:16)" }
    ]
  },
  prontia: {
    title: "PRONTÍA SAÚDE",
    category: "V4 Company · Telemedicina & Saúde",
    items: [
      { src: "img/prontia_feed1.png", title: "Gripe ou Resfriado Feed", format: "FEED (1:1)" },
      { src: "img/prontia_feed2.png", title: "Psicologia Online Feed", format: "FEED (1:1)" },
      { src: "img/prontia_story1.png", title: "Relato de Paciente Story", format: "STORY (9:16)" },
      { src: "img/prontia_story2.png", title: "Médico de Verdade Story", format: "STORY (9:16)" }
    ]
  },
  morocar: {
    title: "MOROCAR",
    category: "V4 Company · Automotivo & B2B",
    items: [
      { src: "img/morocar_feed1.png", title: "Estático B2B Feed", format: "FEED (1:1)" },
      { src: "img/morocar_feed2.png", title: "Daylux Conteiner Feed", format: "FEED (1:1)" },
      { src: "img/morocar_story1.png", title: "Especial Dia das Mães Story", format: "STORY (9:16)" }
    ]
  }
};

var currentGroupKey = null;
var currentGroupIndex = 0;

function openCreativeGallery(groupKey) {
  var group = creativeGroups[groupKey];
  if (!group) return;
  
  currentGroupKey = groupKey;
  currentGroupIndex = 0;

  var modal = document.getElementById("creativeGalleryModal");
  var headTitle = document.getElementById("galHeadTitle");
  var category = document.getElementById("galCategory");

  headTitle.textContent = group.title;
  category.textContent = group.category;

  renderGalleryState();
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function renderGalleryState() {
  var group = creativeGroups[currentGroupKey];
  if (!group || !group.items[currentGroupIndex]) return;

  var item = group.items[currentGroupIndex];
  var mainImg = document.getElementById("galMainImg");
  var caption = document.getElementById("galCaption");
  var badge = document.getElementById("galFormatBadge");
  var thumbsContainer = document.getElementById("galThumbs");

  mainImg.style.opacity = "0";
  mainImg.style.transform = "scale(0.96)";

  setTimeout(function() {
    mainImg.src = item.src;
    caption.textContent = item.title + " (" + (currentGroupIndex + 1) + "/" + group.items.length + ")";
    badge.textContent = item.format;
    mainImg.style.opacity = "1";
    mainImg.style.transform = "scale(1)";
  }, 120);

  // Render Thumbnails
  thumbsContainer.innerHTML = "";
  group.items.forEach(function(itm, idx) {
    var thumb = document.createElement("div");
    thumb.className = "gal-thumb" + (idx === currentGroupIndex ? " active" : "");
    thumb.onclick = function() { selectGalleryItem(idx); };
    
    var tImg = document.createElement("img");
    tImg.src = itm.src;
    tImg.alt = itm.title;

    thumb.appendChild(tImg);
    thumbsContainer.appendChild(thumb);
  });
}

function selectGalleryItem(idx) {
  currentGroupIndex = idx;
  renderGalleryState();
}

function prevGalleryItem() {
  var group = creativeGroups[currentGroupKey];
  if (!group) return;
  currentGroupIndex = (currentGroupIndex - 1 + group.items.length) % group.items.length;
  renderGalleryState();
}

function nextGalleryItem() {
  var group = creativeGroups[currentGroupKey];
  if (!group) return;
  currentGroupIndex = (currentGroupIndex + 1) % group.items.length;
  renderGalleryState();
}

function closeCreativeGallery() {
  var modal = document.getElementById("creativeGalleryModal");
  if (modal) modal.classList.remove("open");
  document.body.style.overflow = "";
}

// Global Keyboard Navigation
document.addEventListener("keydown", function(e) {
  var modal = document.getElementById("creativeGalleryModal");
  if (modal && modal.classList.contains("open")) {
    if (e.key === "ArrowLeft") prevGalleryItem();
    if (e.key === "ArrowRight") nextGalleryItem();
    if (e.key === "Escape") closeCreativeGallery();
  }
});
