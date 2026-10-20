"""Gera as imagens do site a partir de _ref/ig (posts, avatar) e _ref/hl/disponiveis (destaque).
Uso: python tools/processar.py"""
import json, os
from PIL import Image, ImageOps
AQUI = os.path.dirname(os.path.abspath(__file__))
R = os.path.join(AQUI, '..', '..', '_ref')
A = os.path.join(AQUI, '..', 'assets', 'img')
for d in ('obras', 'disp', 'arte'): os.makedirs(f'{A}/{d}', exist_ok=True)

# (post, categoria, título, foto de capa, desvio vertical do recorte 0..1)
OBRAS = [
 ('DWRUYXigC0D','orn','Ornamental nas costas',1,.45),
 ('DXXCObCkVSK','free','Peito em preto e vermelho, freestyle',2,.35),
 ('DUHBfS4kTfX','arq','Catedral desconstruída',1,.4),
 ('DbJa2VUlJIe','orn','Ornamental do tronco às coxas',1,.4),
 ('DcJMqeWkTay','orn','Pescoço, cicatrizado',1,.5),
 ('DPtaPZVDXot','free','Freehand vermelho no ombro',1,.4),
 ('DbV-FNwIB1w','orn','Ornamental sob medida',2,.4),
 ('DF7trYWRcb2','arq','Mordor',1,.45),
 ('DNTnmZnxpSk','atro','Araucária, atropelo nas costas',1,.4),
 ('DSaI6qFjWiS','orn','Ornamental na lombar',1,.5),
 ('DcRKf7HoFBH','orn','Pescoço e rosto',2,.35),
 ('C_3qnwqvwad','free','Freehand nas costas',1,.4),
 ('DTVzEC_EQ_R','orn','Peito em preto e vermelho',1,.4),
 ('DYpRdlmkVFG','atro','Atropelo no pescoço',2,.3),
 ('DHGvIQUssh5','orn','Projeto especial da Geórgia',2,.45),
 ('DQIFuWbEQbj','orn','Clavículas, decalque e freehand',1,.35),
 ('C5j8Y0rsUbP','arq','Castelo',1,.5),
 ('DTBu5hnDeE6','free','Freehand com a cobra',2,.4),
 ('DBPaoEhR8OE','atro','Blast over',1,.45),
 ('DRxoPVhkS5J','orn','Encaixe simétrico nos ombros',3,.4),
 ('DC47f1sRHh1','orn','Vermelho no peito',1,.4),
 ('DdcTmvQlHmC','free','Freehand no braço',1,.5),
 ('DSBV39xjSbW','free','Primeira sessão, freestyle',1,.4),
 ('DRQNNpzkfL5','orn','Ornamental delicado',1,.5),
 ('DVHcWWkkWAz','orn','Disponível adaptado ao corpo',1,.45),
 ('DFS6FnURxpA','bicho','Lacraia em três sessões',1,.4),
 ('DJR0CmOxiqT','orn','Inspirado em Bring Me The Horizon',1,.4),
 ('DRfskDHEVAV','free','Freehand no antebraço',2,.4),
 ('DOwb7dTj1Ih','orn','Ornamental no ombro',1,.4),
 ('C1NETJgL_Ks','bicho','Sereia esqueleto',1,.4),
 ('DaDX5IPxDSM','free','Freehand nas costas, Floripa',1,.4),
 ('DGf7SFwRnkg','orn','Espelhado na lateral do joelho',1,.45),
 ('DKKQcQ9Ax9d','orn','Palma da mão',1,.5),
 ('DJzcdJiR-w8','atro','Cover-up',1,.5),
 ('DFu1vfhx6aD','orn','Bring Me The Horizon no peito',1,.45),
 ('DC0Et0aMwBS','free','Do quadril à perna',1,.45),
 ('CtZ-R5SL_T4','bicho','Lacraia no ombro',1,.4),
 ('DNEQ8CJxcnA','orn','Coração na lombar',1,.55),
 ('DPm_7Mqjcr1','orn','Ornamental no esterno',1,.4),
 ('C_TQB3tR7l9','free','Freehand na palma',1,.5),
 ('DKp4l0XRyiX','atro','Preenchendo espaços vazios',1,.45),
 ('DQ_placeholder','skip','',1,.5),
 ('DbQz39OxmYB','orn','Um dos primeiros ornamentais',1,.45),
 ('CqREP8rrPwJ','bicho','Jacaré',1,.4),
 ('DRLAJjWkYzx','orn','Ornamental na coxa',1,.4),
 ('C9FuKxhsO2G','orn','Encaixe pro braço',1,.5),
 ('CplFJs3OQ_v','atro','Cover-up pretinho',1,.45),
 ('DLdVCcGxuvy','bicho','Double Face',1,.45),
 ('C8k47HCsrrl','orn','Ornamental no abdômen',1,.5),
 ('DVe2D3cDWAw','orn','Vermelho na nuca',1,.5),
 ('C2XUJ5qrM-d','bicho','Lacraia nas costas',1,.4),
 ('CthtFm8rMpX','free','Sessão noturna',1,.4),
 ('DNGoE5ARoFs','orn','Flash na nuca',1,.5),
 ('C57ARyts3cD','orn','Projeto de mãos',1,.5),
 ('CaawwZrrJu9','bicho','Reflexões',1,.45),
 ('C1ShW9wg_8W','atro','Cover-up no braço',1,.5),
 ('C5RHIH2AeEl','orn','Ornamental na perna',1,.45),
 ('DBwFXTpxD53','orn','Corações',1,.55),
 ('CftwZ2iLQW1','free','Orquídea no freehand',1,.4),
 ('Cr60Q7RLk6q','bicho','Escorpião',1,.4),
 ('CWeTaKWLedR','bicho','Estudo de hachuras',1,.45),
 ('CrWTojlsXTv','bicho','Casa na árvore',1,.4),
 ('DYAnuSZiqRu','bicho','Curinga',1,.4),
 ('CzuNPa9vHML','bicho','Olho',1,.4),
 ('CHi1EILL8O-','bicho','Desenho de 2018',1,.45),
]
OBRAS = [o for o in OBRAS if o[1] != 'skip']
HERO = [('DWRUYXigC0D',1,.45),('DXXCObCkVSK',2,.35),('DUHBfS4kTfX',1,.4),('DPtaPZVDXot',1,.4),('DcJMqeWkTay',1,.5)]
# destaque "Disponíveis": (posição na folha de contato, título); a 23 tem a tarja "Reservado" e ficou de fora
DISP = [(2,'Par de asas'),(4,'Dois ornamentais'),(7,'Sugestões de encaixe'),(6,'Lacraias'),(8,'Peitoral'),(9,'Quadril e coxas'),
        (1,'Lateral da coxa'),(11,'Costas inteiras'),(12,'Aranha'),(13,'Aranhas'),(15,'Nuca'),(16,'Sob o busto'),
        (18,'Abdômen com estrelas'),(19,'Abdômen, variação'),(20,'Ornamental floral'),(21,'Pescoço e cabeça'),
        (24,'Perna em preto chapado'),(22,'Costas, do pescoço à lombar')]
# além da tatuagem: (arquivo, título, técnica)
ARTE = [('C9m31d1gmHX_1','Jasmim','Acrílica sobre tela'),('DAosSMevMMU_1','Máscara de vestir','Cerâmica fria sobre gesso'),
        ('CvLL_ITL18d_2','Inseto cosmopolita','Bordado à mão'),('Cfe0DW-PlXZ_3','Luiza','Acrílica sobre tela'),
        ('C-LnhNJvgoX_1','Primeira máscara','Cerâmica fria'),('CoyAPzKLGz9_1','Encomenda pra Islândia','Bordado à mão'),
        ('C3NYha1gIM3_1','Estudo','Acrílica sobre papel')]

def corta(im, ar, dy=.5):
    w, h = im.size
    if w/h > ar: nw = int(h*ar); x = (w-nw)//2; return im.crop((x,0,x+nw,h))
    nh = int(w/ar); y = int((h-nh)*dy); return im.crop((0,y,w,y+nh))
def salva(im, p, w, q=80):
    im = im.convert('RGB')
    if im.width > w: im = im.resize((w, round(im.height*w/im.width)), Image.LANCZOS)
    im.save(p, 'WEBP', quality=q, method=6)

dados = json.load(open(f'{R}/ig/dados.json', encoding='utf8'))
posts = {p['sc']: p for p in dados['posts']}
img = lambda sc, k: ImageOps.exif_transpose(Image.open(f'{R}/ig/img/{sc}_{k}.jpg'))
saida = []
for i, (sc, cat, tit, capa, dy) in enumerate(OBRAS, 1):
    p = posts[sc]; fotos = []
    for k in range(1, len(p['imgs']) + 1):
        f = f'{R}/ig/img/{sc}_{k}.jpg'
        if not os.path.exists(f): continue
        im = img(sc, k)
        if k == capa: salva(corta(im, 4/5, dy), f'{A}/obras/{i:02d}.webp', 720, 78)
        salva(im, f'{A}/obras/{i:02d}-{k}.webp', 1280, 80); fotos.append(f'{i:02d}-{k}')
    import datetime
    saida.append({'id': f'{i:02d}', 'cat': cat, 'titulo': tit, 'fotos': fotos,
                  'ano': datetime.date.fromtimestamp(p['taken']).year, 'ig': sc})
json.dump(saida, open(os.path.join(AQUI, '..', 'assets', 'obras.json'), 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))

for i, (sc, k, dy) in enumerate(HERO, 1):
    salva(corta(img(sc, k), 4/5, dy), f'{A}/hero-{i}.webp', 900, 82)

fs = sorted(os.listdir(f'{R}/hl/disponiveis'))
for i, (pos, tit) in enumerate(DISP, 1):
    salva(corta(Image.open(f'{R}/hl/disponiveis/{fs[pos-1]}'), 9/16), f'{A}/disp/{i:02d}.webp', 480, 84)
json.dump([t for _, t in DISP], open(f'{A}/disp/titulos.json', 'w', encoding='utf8'), ensure_ascii=False)

for i, (f, tit, tec) in enumerate(ARTE, 1):
    salva(corta(ImageOps.exif_transpose(Image.open(f'{R}/ig/img/{f}.jpg')), 4/5, .45), f'{A}/arte/{i}.webp', 720, 80)

# fechamento de costas com o @invocad0 (capa do vídeo, 2268x4032)
salva(corta(img('DXckoYbB9Sa', 1), 4/5, .42), f'{A}/destaque.webp', 1000, 82)

av = Image.open(f'{R}/ig/avatar.jpg'); salva(av, f'{A}/laura.webp', 900, 84)
print(len(saida), 'obras;', len(DISP), 'disponíveis;', len(ARTE), 'artes')
