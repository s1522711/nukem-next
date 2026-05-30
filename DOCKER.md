# Docker Deployment Guide

## Prerequisites

- Docker and Docker Compose installed on the server
- A reverse proxy (nginx, Caddy, etc.) already running on the same server

## First-time setup

### 1. Generate a session secret

```sh
openssl rand -hex 32
```

Copy the output and replace `change-me-in-production` in `docker-compose.yml`:

```yaml
SESSION_SECRET: your-generated-secret-here
```

### 2. Build and start

```sh
docker compose up -d --build
```

The container will:
1. Apply any schema changes to the database (`prisma db push`)
2. Start the Next.js server on port 3000

The port is bound to `127.0.0.1:3000` — it is only reachable from the server itself, not from the internet.

## Reverse proxy configuration

### nginx

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    # ... your SSL cert config ...

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Caddy

```caddy
yourdomain.com {
    reverse_proxy 127.0.0.1:3000
}
```

## Common commands

| Task | Command |
|---|---|
| Start | `docker compose up -d` |
| Stop | `docker compose down` |
| Rebuild and restart | `docker compose up -d --build` |
| View logs | `docker compose logs -f app` |
| Open a shell in the container | `docker compose exec app sh` |

## Updating the app

```sh
docker compose up -d --build
```

Docker will build a new image and swap the container with zero manual steps. The database volume is preserved across rebuilds.

## Database

The SQLite database is stored in a named Docker volume (`db_data`) mounted at `/data/prod.db` inside the container. It persists across container restarts and rebuilds.

### Backup

```sh
docker compose exec app sh -c 'cp /data/prod.db /data/prod.db.bak'
docker cp $(docker compose ps -q app):/data/prod.db ./prod.db.bak
```

### Restore

```sh
docker cp ./prod.db.bak $(docker compose ps -q app):/data/prod.db
docker compose restart app
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Path to the SQLite file. Keep as `file:/data/prod.db`. |
| `SESSION_SECRET` | Yes | Secret used to sign JWT session tokens. Must be a strong random value. |
| `SECURE_COOKIES` | Yes | Set to `true` — required since users connect over HTTPS via the reverse proxy. |

## Troubleshooting

**Container exits immediately**
Check the logs: `docker compose logs app`

**Session issues / getting logged out**
- Confirm `SESSION_SECRET` is set and has not changed between rebuilds.
- Confirm the reverse proxy is forwarding the `Host` header correctly.

**Database errors on startup**
The entrypoint runs `prisma db push` before starting. If it fails, the schema in `prisma/schema.prisma` may have a conflict with the existing database. Back up and inspect the database, or drop the volume to start fresh:
```sh
docker compose down -v
docker compose up -d --build
```
> **Warning:** `-v` deletes all data in the volume.
