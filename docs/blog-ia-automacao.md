# Blog IA — automação pontual (VPS + n8n)

## Por que não GitHub Actions schedule?

O `cron` do GitHub **não é pontual** (atrasa minutos/horas e em repos novos pode falhar).
Para 07:30 e 18:00 em ponto, a automação roda **no VPS**.

## Arquitetura

```
cron do VPS (CRON_TZ=America/Sao_Paulo)
  └─ scripts/blog-cron.sh
       ├─ node scripts/publish-ai-news.mjs   # gera post + capa
       ├─ docker build iaxlab-site:latest
       └─ docker service update iaxlab_site  # site no ar

opcional: n8n (workflow.iaxlab.top)
  └─ Schedule 07:30 / 18:00 (timezone America/Sao_Paulo)
       └─ HTTP POST → http://172.17.0.1:3921/blog/publish
            └─ mesmo blog-cron.sh
```

## 1) Cron no VPS (recomendado — mais confiável)

Arquivos:
- `/root/iaxlab-site/scripts/blog-cron.sh`
- `/root/iaxlab-site/.env` com `XAI_API_KEY=...`

Crontab (`crontab -e`):

```cron
CRON_TZ=America/Sao_Paulo
30 7 * * * /root/iaxlab-site/scripts/blog-cron.sh morning
0 18 * * * /root/iaxlab-site/scripts/blog-cron.sh evening
```

Log: `/var/log/iaxlab-blog.log`

Teste manual:

```bash
/root/iaxlab-site/scripts/blog-cron.sh manual
tail -f /var/log/iaxlab-blog.log
```

## 2) n8n (opcional, se quiser orquestrar na UI)

1. Garanta o webhook no host:
   ```bash
   systemctl status iaxlab-blog-webhook
   curl -s http://127.0.0.1:3921/health
   ```
2. Em `https://workflow.iaxlab.top`:
   - Importe `n8n/blog-ia-workflow.json`
   - Variável/credencial: `BLOG_CRON_TOKEN` (mesmo valor do `.env`)
   - Timezone do workflow: `America/Sao_Paulo`
   - Ative o workflow

O n8n **não** precisa de API xAI: ele só dispara o job no VPS.

## Variáveis em `/root/iaxlab-site/.env`

```bash
XAI_API_KEY=xai-...
XAI_MODEL=grok-4.3
XAI_IMAGE_MODEL=grok-imagine-image
BLOG_CRON_TOKEN=um-token-longo-aleatorio
```

`chmod 600 /root/iaxlab-site/.env`

## GitHub

Workflow de schedule **desativado**.
`workflow_dispatch` fica só para teste no repositório (não substitui o deploy no ar).
