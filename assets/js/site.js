(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const ZAP = '5548991917749';

  /* temporadas: as datas da bio do Instagram. Passou a data final, a cidade some sozinha. */
  const AGENDA = [
    { cidade: 'Lajeado e Porto Alegre', uf: 'RS', ini: '2026-10-24', fim: '2026-10-31' },
    { cidade: 'São Paulo', uf: 'SP', ini: '2026-11-06', fim: '2026-11-15' },
    { cidade: 'Florianópolis', uf: 'SC', ini: '2026-11-18', fim: '2026-11-24' },
  ];
  const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const dia = s => { const [a, m, d] = s.split('-').map(Number); return new Date(a, m - 1, d); };
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  const datas = t => {
    const a = dia(t.ini), b = dia(t.fim);
    return a.getMonth() === b.getMonth() ? `${a.getDate()} a ${b.getDate()} de ${MES[b.getMonth()]}` : `${a.getDate()} de ${MES[a.getMonth()]} a ${b.getDate()} de ${MES[b.getMonth()]}`;
  };
  const abertas = AGENDA.filter(t => dia(t.fim) >= hoje);
  const lista = $('#lista-agenda');
  lista.innerHTML = abertas.length ? abertas.map((t, i) => {
    const agora = dia(t.ini) <= hoje;
    const tag = agora ? 'Atendendo agora' : i === 0 ? 'Próxima temporada' : 'Agenda aberta';
    return `<li class="${agora ? 'agora' : i === 0 ? 'prox' : ''}"><span class="ag-tag"><svg><use href="#estrela"/></svg>${tag}</span>
      <h3>${t.cidade}<span class="ag-uf">${t.uf}</span></h3><p class="ag-datas">${datas(t)}</p></li>`;
  }).join('') : '<li class="agenda-vazia">As próximas datas saem em breve no Instagram.</li>';
  if (abertas.length) {
    const p = $('#hero-prox'), t = abertas[0];
    $('span', p).innerHTML = `${dia(t.ini) <= hoje ? 'Agora em' : 'Próxima temporada:'} <b>${t.cidade}</b>, ${datas(t)}`;
    p.hidden = false;
  }
  const sel = $('#sel-cidade');
  sel.innerHTML = abertas.map(t => `<option value="${t.cidade} (${datas(t)})">${t.cidade}</option>`).join('') + '<option>Outra cidade</option>';

  /* nav sólida ao rolar + barra de orçamento no celular */
  const nav = $('.nav'), barra = $('.barra-dm'), hero = $('.hero'), orc = $('#orcamento');
  let naOrc = false;
  new IntersectionObserver(([e]) => { naOrc = e.isIntersecting; rolou(); }).observe(orc);
  const rolou = () => {
    nav.classList.toggle('solida', scrollY > 20);
    barra.classList.toggle('on', scrollY > hero.offsetHeight * .7 && !naOrc);
  };
  addEventListener('scroll', rolou, { passive: true }); rolou();

  /* link ativo */
  const links = $$('.nav-links a');
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('ativo', a.hash === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(a => { const s = $(a.hash); s && io.observe(s); });

  /* menu */
  const bm = $('.nav-menu'), menu = $('#menu');
  const abreMenu = on => {
    bm.setAttribute('aria-expanded', on); menu.hidden = !on;
    document.body.style.overflow = on ? 'hidden' : '';
  };
  bm.addEventListener('click', () => abreMenu(menu.hidden));
  $$('a', menu).forEach(a => a.addEventListener('click', () => abreMenu(false)));

  /* fundo: mármore espelhado, ao vivo no desktop (WebGL) e MP4 em loop no toque */
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fundo = $('.hero-fundo'), cv = $('.fundo-gl', fundo), hv = $('.fundo-vid', fundo);
  const toque = matchMedia('(hover: none), (pointer: coarse), (max-width: 760px)').matches;
  const tocaVideo = (v, src) => {
    if (calmo) return;
    v.src = src;
    v.addEventListener('playing', () => v.classList.add('on'), { once: true });
    new IntersectionObserver(([e]) => e.isIntersecting ? v.play().catch(() => {}) : v.pause()).observe(v.parentElement);
  };
  /* eixo do espelho: no centro da foto do hero */
  const eixo = () => { const f = $('.hero-foto').getBoundingClientRect(); return Math.min(.85, Math.max(.5, (f.left + f.width / 2) / innerWidth)); };
  const vivo = () => {
    let T;
    try { T = marmoreGL(cv); } catch (e) { T = null; }
    if (!T) return;
    /* resolução real da tela (até 2x); se o quadro passar de ~22 ms em média, baixa em degraus */
    const CICLO = 30000;
    let esc = Math.min(devicePixelRatio || 1, 2), ex = eixo();
    const ajusta = () => { T.tamanho(Math.round(fundo.clientWidth * esc), Math.round(fundo.clientHeight * esc)); ex = eixo(); };
    ajusta(); addEventListener('resize', ajusta);
    let ve = true, ult = 0, soma = 0, n = 0, t0 = performance.now();
    new IntersectionObserver(([e]) => { ve = e.isIntersecting; ult = 0; }).observe(fundo);
    const quadro = t => {
      requestAnimationFrame(quadro);
      if (!ve || document.hidden) { ult = 0; return; }
      if (ult) { soma += t - ult; n++; }
      ult = t;
      if (n === 40) {
        if (soma / n > 22 && esc > .6) { esc = Math.max(.6, esc * .8); ajusta(); }
        soma = 0; n = 0;
      }
      T.desenhar(((t - t0) % CICLO) / CICLO * 6.283185307179586, ex);
      cv.classList.add('on');
    };
    if (calmo) { T.desenhar(0, ex); cv.classList.add('on'); } else requestAnimationFrame(quadro);
  };
  if (toque) tocaVideo(hv, innerWidth > innerHeight ? 'assets/video/marmore-deitado.mp4' : 'assets/video/marmore-celular.mp4');
  else vivo();
  $$('.fim-fundo .fundo-vid').forEach(v => tocaVideo(v, v.dataset.src));

  /* hero: fotos passam sozinhas */
  const fotos = $$('.hero-quadro img'), tit = $('.hero-tit'), cont = $('.hero-cont b'), bar = $('.hero-barra i');
  const nomes = ['Ornamental nas costas', 'Peito em preto e vermelho', 'Catedral desconstruída', 'Freehand vermelho no ombro', 'Pescoço, cicatrizado'];
  let hi = 0;
  const corre = () => { bar.classList.remove('corre'); void bar.offsetWidth; bar.classList.add('corre'); };
  const troca = () => {
    fotos[hi].classList.remove('on');
    hi = (hi + 1) % fotos.length;
    fotos[hi].classList.add('on');
    tit.textContent = nomes[hi]; cont.textContent = hi + 1;
    corre();
  };
  if (!calmo) { corre(); setInterval(() => { if (!document.hidden) troca(); }, 6000); }

  /* disponíveis */
  fetch('assets/img/disp/titulos.json?v=2').then(r => r.json()).then(t => {
    $('#disp').innerHTML = t.map((n, i) => `<li><div><img src="assets/img/disp/${String(i + 1).padStart(2, '0')}.webp" alt="Desenho disponível: ${n}" loading="lazy" width="480" height="853"></div><p>${n}</p></li>`).join('');
  });

  /* portfólio */
  const grade = $('#grade'), mais = $('#mais');
  let obras = [], filtro = 'todos', limite = 16;
  const visiveis = () => obras.filter(o => filtro === 'todos' || o.cat === filtro);
  const desenha = () => {
    const l = visiveis();
    grade.innerHTML = l.slice(0, limite).map((o, i) => `
      <li style="animation-delay:${(i % 16) * 30}ms"><button data-id="${o.id}" aria-label="Ver fotos: ${o.titulo}">
        <div class="obra-img"><img src="assets/img/obras/${o.id}.webp" alt="${o.titulo}" loading="lazy" width="720" height="900">${o.fotos.length > 1 ? `<span class="qtd">${o.fotos.length} fotos</span>` : ''}</div>
        <p class="obra-leg"><span>${o.ano}</span>${o.titulo}</p>
      </button></li>`).join('');
    mais.parentElement.hidden = l.length <= limite;
  };
  const filtra = f => {
    filtro = f; limite = 16;
    $$('.filtros button').forEach(b => b.setAttribute('aria-selected', b.dataset.f === f));
    desenha();
  };
  $$('.filtros button').forEach(b => b.addEventListener('click', () => filtra(b.dataset.f)));
  $$('.estilo').forEach(a => a.addEventListener('click', () => filtra(a.dataset.ir)));
  mais.addEventListener('click', () => { limite += 16; desenha(); });
  fetch('assets/obras.json?v=2').then(r => r.json()).then(d => { obras = d; desenha(); });

  /* galeria */
  const gal = $('#galeria'), gimg = $('.gal-fig img', gal), gtit = $('.gal-tit', gal), gcont = $('.gal-cont', gal), gig = $('.gal-ig', gal);
  let atual = null, gi = 0, volta = null;
  const mostra = () => {
    gimg.src = `assets/img/obras/${atual.fotos[gi]}.webp`;
    gimg.alt = atual.titulo;
    gtit.textContent = atual.titulo;
    gcont.textContent = atual.fotos.length > 1 ? `${gi + 1} de ${atual.fotos.length}` : '';
    $$('.gal-seta', gal).forEach(b => b.hidden = atual.fotos.length < 2);
  };
  const abre = (o, el) => {
    atual = o; gi = 0; volta = el; mostra();
    gig.href = `https://www.instagram.com/p/${o.ig}/`;
    gal.hidden = false; document.body.style.overflow = 'hidden'; $('.gal-fechar').focus();
  };
  const fecha = () => { gal.hidden = true; document.body.style.overflow = ''; volta && volta.focus(); };
  const passa = d => { gi = (gi + d + atual.fotos.length) % atual.fotos.length; mostra(); };
  grade.addEventListener('click', e => {
    const b = e.target.closest('button[data-id]'); if (!b) return;
    abre(obras.find(o => o.id === b.dataset.id), b);
  });
  $('.gal-fechar').addEventListener('click', fecha);
  $('.gal-ant').addEventListener('click', () => passa(-1));
  $('.gal-prox').addEventListener('click', () => passa(1));
  gal.addEventListener('click', e => { if (e.target === gal) fecha(); });
  addEventListener('keydown', e => {
    if (gal.hidden) return;
    if (e.key === 'Escape') fecha();
    if (e.key === 'ArrowLeft') passa(-1);
    if (e.key === 'ArrowRight') passa(1);
  });
  let tx = null;
  gal.addEventListener('touchstart', e => tx = e.touches[0].clientX, { passive: true });
  gal.addEventListener('touchend', e => {
    if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 40 && atual.fotos.length > 1) passa(dx < 0 ? 1 : -1);
  });

  /* orçamento: monta o texto e abre o WhatsApp */
  const form = $('#form-orc'), erro = $('#orc-erro');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const nome = (d.nome || '').trim();
    erro.hidden = !!nome;
    if (!nome) { form.nome.focus(); return; }
    const linhas = [
      `Oi, Laura! Sou ${nome} e vim pelo seu site.`,
      `Quero orçar uma tattoo a partir de ${d.tipo}.`,
      `Cidade: ${d.cidade}`,
      d.local.trim() && `Lugar do corpo: ${d.local.trim()}`,
      d.tamanho.trim() && `Tamanho: ${d.tamanho.trim()}`,
      d.ideia.trim() && `Ideia: ${d.ideia.trim()}`,
    ].filter(Boolean);
    open(`https://wa.me/${ZAP}?text=${encodeURIComponent(linhas.join('\n'))}`, '_blank', 'noopener');
  });
})();
