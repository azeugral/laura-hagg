/* Fundo do hero: mármore escuro que se mexe devagar, espelhado num eixo como um ornamental.
   Nada é desenhado: a pedra é ruído com domínio torcido, os veios claros são cristas finas do mesmo fluxo,
   os veios de tinta preta cortam a pedra, e um fio vermelho raro passa por eles, como as linhas vermelhas
   das tattoos dela. O espelho no eixo vertical dá a simetria sem desenhar forma nenhuma.
   marmoreGL(canvas, {eixo}) -> {tamanho(w,h), desenhar(fase, eixo)}; fase em [0, 2π) fecha o loop sem emenda.
   O mesmo shader gera os MP4 do celular (tools/gerar_video.py). */
(function (g) {
  const VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
  const FS = `
precision highp float;
uniform vec2 uRes; uniform float uFase; uniform float uEixo;
uniform vec3 uPedra; uniform vec3 uVeio; uniform vec3 uSangue;
#define TAU 6.28318530718

float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float ruido(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<6;i++){s+=a*ruido(p);p=rot(.6)*p*2.02+vec2(1.7,9.2);a*=.5;}return s;}
/* cristas finas: 1-|2n-1| elevado, oitavas cada vez mais finas */
float crista(vec2 p){float s=0.,a=.6,pe=1.;
  for(int i=0;i<4;i++){float n=1.-abs(ruido(p)*2.-1.);n=pow(n,4.);s+=a*n*(.35+.65*pe);pe=n;p=rot(-.5)*p*2.1+vec2(3.1,.7);a*=.55;}
  return s;}

void main(){
  vec2 fc=gl_FragCoord.xy;
  float esc=min(uRes.x,uRes.y);
  vec2 c=vec2(cos(uFase),sin(uFase));
  float ex=uEixo*uRes.x;
  vec2 p=vec2(abs(fc.x-ex),fc.y-.5*uRes.y)/esc;

  /* fluxo da pedra: desce devagar e se torce (offsets em círculo = loop) */
  vec2 q=p*1.3+vec2(0.,.18)*sin(uFase);
  vec2 w=vec2(fbm(q+c*.22),fbm(q+vec2(5.2,1.3)-c.yx*.22));
  vec2 w2=vec2(fbm(q+w*1.5+vec2(1.7,9.2)+c*.24),fbm(q+w*1.5+vec2(8.3,2.8)-c*.24));
  float f0=fbm(q+w2*1.4);
  float zona=exp(-p.x*p.x*1.3)*smoothstep(1.3,.05,abs(p.y));

  /* nuvem da pedra: cinza quente, mais densa perto do eixo */
  float nuvem=smoothstep(.22,.82,f0*(.66+.5*zona)+zona*.12);
  /* veios claros do mármore, finos e esticados pelo fluxo */
  float vc=crista(q*1.6+w2*1.9+c*.1);
  float claro=smoothstep(.38,.95,vc)*(.3+.7*nuvem);
  float fino=smoothstep(.5,1.,crista(q*3.2+w2*2.4-c*.12))*nuvem;
  /* tinta preta: cristas largas do mesmo fluxo */
  float tinta=smoothstep(.38,.7,crista(q*.95+w2*1.2-c*.14))*smoothstep(.05,.45,nuvem);
  /* fio vermelho: uma crista estreita que só aparece onde a tinta encosta */
  float rv=crista(q*1.25+w*2.2+c*.18);
  float fv=(1.-smoothstep(.0,.018,abs(rv-.55)))*smoothstep(.55,.75,fbm(q*.7-w2+c.yx*.2))*smoothstep(.1,.5,zona);

  vec3 col=uPedra;
  col+=uVeio*.34*pow(nuvem,1.4)*(.3+.7*zona);
  col+=uVeio*claro*.75*(.35+.65*zona);
  col+=uVeio*fino*.85*(.3+.7*zona);
  col*=1.-clamp(tinta*.9,0.,.94);
  col+=uSangue*fv*(1.-tinta*.5)*1.3;

  /* dither (interleaved gradient noise): tira o degrau do gradiente escuro sem desenhar padrão */
  vec2 gq=fc+vec2(5.588,2.37)*floor(fract(uFase*7.)*64.);
  col+=(fract(52.9829189*fract(dot(gq,vec2(.06711056,.00583715))))-.5)*.01;
  col=1.-exp(-col*1.25);
  gl_FragColor=vec4(max(col,0.),1.);
}`;

  g.marmoreGL = function (cv, op = {}) {
    const gl = cv.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: !!op.preserveDrawingBuffer, powerPreference: 'low-power' });
    if (!gl) return null;
    const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(o); return o; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr); gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    const u = n => gl.getUniformLocation(pr, n);
    const uR = u('uRes'), uF = u('uFase'), uE = u('uEixo');
    const cor = h => [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16) / 255);
    gl.uniform3fv(u('uPedra'), cor(op.pedra || '#0c0b0b'));
    gl.uniform3fv(u('uVeio'), cor(op.veio || '#efe9df'));
    gl.uniform3fv(u('uSangue'), cor(op.sangue || '#c4161c'));
    return {
      tamanho(w, h) { cv.width = w; cv.height = h; },
      desenhar(fase, eixo) {
        gl.viewport(0, 0, cv.width, cv.height);
        gl.uniform2f(uR, cv.width, cv.height); gl.uniform1f(uF, fase); gl.uniform1f(uE, eixo ?? op.eixo ?? .5);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
    };
  };
})(window);
