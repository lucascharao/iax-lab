# Blog IA — automação de notícias

Publica **1 notícia de IA** às **07:30** e **18:00** (horário de Brasília), com:

- texto editorial em PT-BR + fontes/links + data  
- capa horizontal (16:9) via API de imagem xAI  
- **anti-repetição** por URL da fonte + fingerprint  

Página no site: [`/blog`](https://iaxlab.top/blog)

---

## Precisa de n8n?

**Não é obrigatório.**

| Opção | Quando usar |
|--------|-------------|
| **GitHub Actions** (já no repo) | Mais simples: cron 2x/dia, grava no repo, redeploy do site |
| **n8n** | Se você já orquestra APIs no n8n e prefere fluxo visual |
| **Cron local / VPS** | `node scripts/publish-ai-news.mjs` no crontab |

As duas opções usam o **mesmo script**: `scripts/publish-ai-news.mjs`.

---

## O que você precisa fornecer

1. **`XAI_API_KEY`** — chave da API xAI (Grok)  
   - Texto do artigo: Chat Completions  
   - Capa: Images Generations (se a conta tiver acesso)  
2. (Opcional) modelos: `XAI_MODEL` (padrão `grok-4.3`), `XAI_IMAGE_MODEL` (padrão `grok-imagine-image`)  
3. Se o deploy **não** for automático no `git push`, um passo extra no CI de deploy  

> **Grok CLI (Imagine no TUI)** é interativo — para automação 2x/dia a **API xAI** é o caminho certo. O CLI não roda bem headless em cron.

---

## Setup GitHub Actions (recomendado)

1. Repo → **Settings → Secrets and variables → Actions**  
2. Secret: `XAI_API_KEY` = sua chave  
3. (Opcional) Variables: `XAI_MODEL`, `XAI_IMAGE_MODEL`  
4. O workflow `.github/workflows/ai-blog.yml` já agenda:  
   - `30 10 * * *` → 07:30 BRT  
   - `0 21 * * *` → 18:00 BRT  
5. Teste manual: **Actions → Blog IA → Run workflow**

Fluxo do Action:

```
RSS (Google News IA + TechCrunch + Verge)
  → filtra URLs nunca publicadas
  → Grok escreve artigo PT-BR
  → gera capa 16:9
  → grava public/blog/*
  → git commit + push
```

Garanta que o deploy (Docker/Caddy/host) rode no push da branch principal.

---

## Setup n8n (opcional)

### Fluxo sugerido

1. **Cron** — `30 7 * * *` e `0 18 * * *` (timezone `America/Sao_Paulo`)  
2. **Execute Command** (ou SSH no servidor do repo):

```bash
cd /caminho/iax-lab && XAI_API_KEY=*** node scripts/publish-ai-news.mjs
```

3. **Git** — commit/push se o script rodou com sucesso  
4. **Deploy** — webhook do seu host, se necessário  

### Alternativa: n8n só orquestra HTTP

Se preferir nós nativos:

1. HTTP Request → RSS / Google News  
2. Function → dedupe contra `https://iaxlab.top/blog/index.json`  
3. HTTP Request → `https://api.x.ai/v1/chat/completions`  
4. HTTP Request → `https://api.x.ai/v1/images/generations`  
5. GitHub node → criar/atualizar arquivos em `public/blog/`  

O script do repo já faz 1–5 de forma estável; n8n só precisa **disparar** o script.

### Credenciais no n8n

- Header `Authorization: Bearer {{$credentials.xai.apiKey}}`  
- Ou env `XAI_API_KEY` no host do n8n  

Envie a API quando for plugar — **não** commite a chave no Git.

---

## Anti-repetição

`public/blog/index.json` guarda:

- `publishedSourceUrls` — URL canônica da fonte  
- `publishedFingerprints` — hash de URL+título  

Se não houver notícia nova, o script **sai 0 sem publicar** (não repete).

---

## Rodar local

```bash
# dry-run (não grava)
DRY_RUN=1 XAI_API_KEY=xai-... node scripts/publish-ai-news.mjs

# publicar de verdade
XAI_API_KEY=xai-... SLOT=manual node scripts/publish-ai-news.mjs
```

---

## Estrutura de arquivos

```
public/blog/
  index.json              # lista + fingerprints
  posts/{slug}.json       # artigo completo
  covers/{slug}.jpg|svg   # capa horizontal
```

Rotas do site:

- `/blog` — grade de notícias  
- `/blog/:slug` — post com capa, texto, fontes e data  
