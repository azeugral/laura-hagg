# Laura Hagg · site

Site de apresentação da tatuadora Laura Hagg ([@hagg.tt](https://www.instagram.com/hagg.tt/)), de Lajeado-RS.
Publicado em https://azeugral.github.io/laura-hagg/ (com `noindex` até a aprovação).

## Identidade

- **Paleta:** breu `#0c0b0b`, pedra `#141312`, gesso `#ece7df`, cinza `#9d978e` e sangue `#c4161c` / `#e0262c`.
  O gesso e o cinza vêm das estátuas de mármore que ela usa nos mockups do destaque "Disponíveis". O vermelho vem das linhas vermelhas das tattoos.
- **Fontes:** Bodoni Moda (títulos e marca), IBM Plex Sans (texto) e JetBrains Mono (rótulos).
- **Fundo do hero:** `assets/js/marmore.js` é mármore negro gerado em shader, espelhado num eixo atrás da foto, como um ornamental simétrico. Tem veios claros, tinta preta e um fio vermelho fino.
  No desktop roda ao vivo (WebGL, até 2x de DPR). Em tela de toque toca o MP4 de `tools/gerar_video.py`.
- **Botões:** retos, com um filete gravado por dentro. No hover o filete encosta na borda e o fundo vira vermelho.

## Ferramentas

- `python tools/processar.py`: gera portfólio, hero, disponíveis, artes e retrato a partir de `../_ref`. As listas `OBRAS`, `HERO`, `DISP` e `ARTE` ficam no topo do arquivo.
- `python tools/gerar_video.py`: gera o pôster `marmore.webp` e os vídeos `marmore-celular.mp4` e `marmore-deitado.mp4`. Com `--so-poster`, gera só o pôster.
- `python tools/marca.py`: gera os favicons e o `og.jpg`.
- **Agenda:** a lista `AGENDA` fica no topo de `assets/js/site.js`. Uma cidade sai sozinha depois da data final.

## CONFIRMAR com a cliente

- [ ] **Estúdios da temporada:** em qual estúdio ela atende em Lajeado/POA (24 a 31/10), SP (6 a 15/11) e Floripa (18 a 24/11). Hoje o site mostra só cidade e datas.
- [ ] **Casa Feia:** confirmar se é a casa fixa em São Paulo hoje. O texto diz "hoje atende no @cas4feia", com base nos posts de 2026.
- [ ] **Torttto:** o texto diz que ela "ajudou a construir" o espaço, a partir da legenda "junto com a construção do nosso @torttto___".
- [ ] **Início em 2018 em Florianópolis:** vem do post "esse foi o meu primeiro trampo na minha sensei" (jan/2018).
- [ ] **WhatsApp 48 99191-7749:** é o número da bio. Confirmar se é o canal de orçamento ou se ela prefere a DM.
- [ ] **Disponíveis:** as imagens vêm do destaque em 480 px. Pedir os arquivos em alta e a lista de quais ainda estão livres. O desenho com tarja "Reservado" ficou de fora.
- [ ] **Além da pele:** confirmar se aceita encomendas de pintura, bordado e cerâmica. Num post de 2023 ela escreveu "aceito mais encomendas".
- [ ] **Foto do Sobre:** hoje é o avatar do Instagram. Pedir um retrato, se ela quiser.
- [ ] **Fotos com nudez parcial** no portfólio (tapa-mamilo, roupa íntima): confirmar se ela está de acordo com todas no site.
- [ ] **Domínio** próprio e retirar o `noindex`.
