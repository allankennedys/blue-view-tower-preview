# Blue View Tower — Landing Page

Landing page do empreendimento **Blue View Tower (FG Empreendimentos)** em Balneário Camboriú.  
Disponível em três idiomas: Português (`/`), Inglês (`/en/`) e Espanhol (`/es/`).

---

## Estrutura de arquivos

```
lp-blue-view-tower/
├── index.html          ← Versão em Português (principal)
├── en/
│   └── index.html      ← Versão em Inglês
├── es/
│   └── index.html      ← Versão em Espanhol
├── style.css           ← Todos os estilos da página
├── script.js           ← Toda a lógica (carrosséis, formulário, vídeo, contadores)
└── assets/
    ├── obra.webp                            ← Imagem de fundo do hero
    ├── LOGO BRANCA S.FUNDO.webp             ← Logo (header e rodapé)
    ├── f.avicon.png                         ← Favicon (ícone da aba)
    ├── altimetria-blueview-animacao02.webm  ← Vídeo imersivo (formato principal)
    ├── altimetria-blueview-animacao02.mp4   ← Vídeo imersivo (fallback)
    ├── PB_TIPO_A_OPCAO_02.webp              ← Planta Tipo A
    ├── PB_TIPO_B_OPCAO_01.webp              ← Planta Tipo B
    ├── one-tower-1.webp                     ← Portfólio FG: One Tower
    ├── Titanium-Tower-20.webp               ← Portfólio FG: Titanium Tower
    ├── infinity.webp                        ← Portfólio FG: Infinity Coast
    ├── blue-coast.webp                      ← Portfólio FG: Blue Coast Tower
    ├── [outras imagens de seções]
    └── imagens/                             ← Fotos da galeria principal
        ├── 23_113_01_FACHADA_FINAL (1).webp
        ├── 23_113_03_FACHADA_NOTURNA_FINAL.webp
        ├── 23_113_04_EMBASAMENTO_ESQUINA_FINAL (1).webp
        ├── 23_113_05_FOTOMONTAGEM_FINAL.webp
        ├── 23_113_11_FESTAS_FINAL.webp
        ├── 23_113_15_PISCINA_COBERTA_FINAL.webp
        ├── 23_113_16_ACADEMIA_FINAL.webp
        ├── 23_113_21_JOGOS_R00.webp
        ├── 23_113_23_HALL_ENTRADA_TERREO_FINAL.webp
        ├── 23_113_32_FACHADA_ADICIONAL_FINAL.webp
        ├── 23_113_34_FACHADA_DIURNA_INSERCAO_FINAL_V2.webp
        └── 23_113_35_EMBASAMENTO_NOTURNO_FINAL.webp
```

> **Importante:** qualquer alteração no `index.html` principal precisa ser replicada manualmente em `en/index.html` e `es/index.html`, traduzindo o texto para o idioma correspondente.

---

## Como alterar o número do WhatsApp

O número aparece **6 vezes em cada arquivo HTML** (18 ocorrências no total).  
Número atual: `5547991356151` → `+55 47 99135-6151`

**Formato da URL:** `https://wa.me/[CÓDIGO DO PAÍS][DDD][NÚMERO SEM ESPAÇO]`  
**Exemplo:** `https://wa.me/5547999999999`

### Onde aparece em cada index.html:
1. Botão "Falar com Especialista" no **Hero**
2. Botão "Garantir minha unidade" na seção de **Urgência**
3. Overlay "Acessar planta" no card **Duplex/Cobertura** (Tipologias)
4. Botão "Receber todas as plantas" abaixo das **Tipologias**
5. Botão "Ou fale no WhatsApp" dentro do **Formulário**
6. **Botão flutuante** do WhatsApp (canto inferior)

Para trocar: use **Ctrl+H** (localizar e substituir) no seu editor e substitua  
`5547991356151` pelo novo número nos três arquivos.

---

## Como alterar o Google Analytics

O ID `G-YF5QJES6KQ` aparece **2 vezes em cada arquivo HTML**.

Para trocar: substitua `G-YF5QJES6KQ` pelo seu ID nos três arquivos.  
Para **desativar** o rastreamento: remova os dois blocos `<script>` do Google Analytics no `<head>` de cada arquivo.

---

## Como alterar a imagem do hero (fundo)

**Arquivo atual:** `assets/obra.webp`  
**Resolução recomendada:** 1920×1080px ou maior  
**Formatos aceitos:** `.webp` (preferido), `.jpg`

Aparece em 2 lugares por arquivo HTML:
- `<link rel="preload" as="image" href="/assets/obra.webp">` no `<head>`
- `<img src="/assets/obra.webp" class="hero-media">` no body

---

## Como alterar o vídeo imersivo

**Arquivos atuais:**
- `assets/altimetria-blueview-animacao02.webm` (formato principal — melhor compressão)
- `assets/altimetria-blueview-animacao02.mp4` (fallback para navegadores mais antigos)

**Para trocar o vídeo:**
1. Coloque os novos arquivos na pasta `assets/`
2. Abra `script.js` e localize o comentário `/* ALTERAR: Arquivos de vídeo */`
3. Substitua os nomes nos dois `<source src="...">` dentro da template string

**Para trocar a imagem de capa (thumbnail) do vídeo:**  
Arquivo atual: `assets/23_113_32_FACHADA_ADICIONAL_FINAL.webp`  
Procure por `video-thumb` nos HTMLs e troque o `src`.

---

## Como atualizar o progresso da obra

Na seção **"Estágio da obra"**, cada etapa tem dois lugares para atualizar:

```html
<circle class="donut-fill" cx="50" cy="50" r="40" data-pct="40"/>
```
e
```html
<span class="donut-pct">40%</span>
```

**Para atualizar:** altere o valor em `data-pct` e o texto no `<span class="donut-pct">` para o mesmo número. Repita nos 3 arquivos HTML.

**Para alterar as datas de início/entrega**, procure por:
```
<span><em>Início:</em> Fev/2024</span>
<span><em>Entrega:</em> Dez/2028</span>
```

---

## Como adicionar/remover fotos da galeria principal

A galeria está na seção `id="galeria"` em cada arquivo HTML.

**Para adicionar uma foto:**
1. Coloque o arquivo `.webp` na pasta `assets/imagens/`
2. Duplique uma linha `<img>` dentro do `<div class="carousel-track">` e troque o `src` e o `alt`

**Para remover:** apague a linha `<img>` correspondente.  
**Para reordenar:** mova as linhas `<img>` para a ordem desejada.

> Repita nos 3 arquivos HTML.

---

## Como adicionar/remover fotos do carrossel de lazer

Seção `id="lazer"`, dentro de `<div id="lazerCarousel">`. Mesma lógica da galeria.

**Fotos atuais (pasta `assets/`):**
- `23_113_23_HALL_ENTRADA_TERREO_FINAL.webp` — Hall de Entrada
- `23_113_16_ACADEMIA_FINAL.webp` — Academia
- `23_113_21_JOGOS_R00.webp` — Sala de Jogos
- `23_113_15_PISCINA_COBERTA_FINAL.webp` — Piscina
- `23_113_11_FESTAS_FINAL.webp` — Salão de Festas
- `23_113_26_BANHEIRO_MASTER_TIPO_FINAL (1).webp` — Banheiro Master

---

## Como adicionar/remover projetos do portfólio FG

Na seção `id="fg"`, dentro do `<div class="carousel-track">`:

**Para adicionar um projeto:**
```html
<figure class="portfolio-slide">
  <img src="assets/NOME_DA_FOTO.webp" alt="Nome do Projeto" loading="lazy">
  <figcaption>Nome do Projeto</figcaption>
</figure>
```

**Para remover:** apague o bloco `<figure>` correspondente.

---

## Como adicionar/remover uma tipologia (planta)

Na seção `id="plantas"`, dentro de `<div class="typo-track typo-grid">`:

**Card aberto** (planta visível):
```html
<article class="typo-card open">
  <span class="typo-tag">Tipo X · N unid.</span>
  <h3>000 m²<small>descrição</small></h3>
  <ul>
    <li>Xº ao Yº pavimento</li>
    <li>N suítes · N vagas</li>
    <li>A partir de R$ 000.000</li>
  </ul>
  <img src="assets/NOME_DA_PLANTA.webp" alt="Planta Tipo X" class="plant-preview" loading="lazy">
</article>
```

**Card bloqueado** (planta via WhatsApp):
```html
<article class="typo-card locked">
  <span class="typo-tag">Tipo X</span>
  <h3>000 m²</h3>
  <ul>
    <li>Item 1</li>
  </ul>
  <a href="https://wa.me/5547991356151" class="lock-overlay" aria-label="Ver planta pelo WhatsApp">
    <span class="lock-icon" aria-hidden="true"></span>
    <p>Acessar planta pelo WhatsApp</p>
  </a>
</article>
```

---

## Como trocar o mapa do Google Maps

Na seção `id="localizacao"`, localize o `<iframe class="map">` e troque o `src`:

1. Acesse [maps.google.com](https://maps.google.com)
2. Pesquise o endereço
3. Clique em **Compartilhar** → **Incorporar um mapa**
4. Copie a URL do atributo `src` e cole no iframe

---

## Como alterar o logo

**Arquivo atual:** `assets/LOGO BRANCA S.FUNDO.webp`

Aparece em 2 lugares em cada HTML:
- **Header** (topo): `<img src="assets/LOGO BRANCA S.FUNDO.webp">`
- **Rodapé**: `<img src="/assets/LOGO BRANCA S.FUNDO.webp">`

Nos arquivos `en/` e `es/`, o header usa `../assets/`.

---

## Como adicionar um novo idioma

1. Crie uma nova pasta (ex: `fr/`)
2. Copie `en/index.html` para `fr/index.html`
3. Traduza todos os textos
4. Adicione `<a href="/fr/" class="lang">FR</a>` no seletor de idioma dos 3 HTMLs existentes
5. Ajuste o link ativo (`class="lang active"`) em `fr/index.html`

---

## Formulário de contato

O formulário **não envia dados para nenhum servidor** — exibe apenas uma mensagem de sucesso na tela.

Para integrar com um CRM ou serviço externo (ex: HubSpot, RD Station, Mailchimp):  
Adicione `action="URL_DO_SEU_ENDPOINT"` na tag `<form id="leadForm">` e consulte a documentação do serviço.
