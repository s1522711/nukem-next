# Running nukem-next on Pterodactyl / Pelican

This guide covers deploying the nukem-next Next.js application on a
[Pterodactyl](https://pterodactyl.io) or [Pelican](https://pelican.dev) panel
using a generic Node.js egg.

---

## Prerequisites

- A Pterodactyl or Pelican panel with at least one Node.js node configured
- Node.js 20+ egg installed on the node (the default "Node.js Generic" egg works)
- SQLite support on the node host (comes with Node.js images by default)
- The application source code uploaded or pulled via the file manager / git

---

## 1. Create the Server

In your panel, create a new server with the following settings:

| Setting | Value |
|---|---|
| Egg | Node.js Generic (or any Node 20+ egg) |
| Docker image | `ghcr.io/pelican-eggs/nodejs:20` (or equivalent) |
| Startup command | `npm run start` |
| Memory | 512 MB minimum, 1 GB recommended |
| Disk | 2 GB minimum |
| CPU | 100% (1 core) minimum |

---

## 2. Environment Variables

Set these in the panel's **Startup** tab under "Variables":

| Variable | Required | Example | Notes |
|---|---|---|---|
| `DATABASE_URL` | Yes | `file:/home/container/data/prod.db` | Path to the SQLite file. Use an absolute path inside the container so it survives restarts. |
| `JWT_SECRET` | Yes | `changeme-use-a-long-random-string` | Signs session tokens. Generate with `openssl rand -hex 32`. |
| `NODE_ENV` | Yes | `production` | Enables Next.js production optimisations. |
| `PORT` | No | `3000` | Port Next.js listens on. Must match the panel's port allocation. |
| `HOSTNAME` | No | `0.0.0.0` | Bind address. Leave as `0.0.0.0` so the panel proxy can reach it. |

> **JWT_SECRET** — if this is not set, session tokens will be unsigned and
> anyone can forge admin cookies. Always set it to a long random value in
> production.

---

## 3. Upload the Source Code

### Option A — via panel file manager

1. Zip the project (excluding `node_modules/`, `.next/`, `dev.db`).
2. Upload the zip through the panel file manager and extract it.

### Option B — via git (recommended)

Add a startup script that clones/pulls on boot. In the egg's startup command
field use:

```bash
git pull --ff-only 2>/dev/null || true && npm run start
```

Or pre-clone into the server's home directory via the panel terminal before
first start.

---

## 4. Install Dependencies and Build

Run these once in the panel **Console** (or via a startup script):

```bash
npm install --production=false
npx prisma generate
npx prisma migrate deploy
npm run build
```

After this the `.next/` directory is present and the app is ready to serve.

### One-time database seed (optional)

If you want the initial product catalogue loaded:

```bash
npm run db:seed
# or directly:
npx tsx prisma/seed.ts
```

---

## 5. Persistent Data Directory

The SQLite database must survive container restarts. The recommended path is
`/home/container/data/prod.db` — this is inside the server's home directory
which Pterodactyl/Pelican mounts as a persistent volume.

Make sure `DATABASE_URL` points there:

```
DATABASE_URL=file:/home/container/data/prod.db
```

Create the directory on first run:

```bash
mkdir -p /home/container/data
```

---

## 6. Startup Command

Set the panel startup command to:

```bash
npm run start
```

`npm run start` runs `next start`, which serves the pre-built `.next/` output.
Do **not** use `npm run dev` in production — it is slower, rebuilds on every
request, and exposes source maps.

If you want the panel to build automatically on each start, use:

```bash
npm run build && npm run start
```

This adds ~60 seconds to startup time but guarantees the running code always
matches what is on disk.

---

## 7. Port Allocation

Allocate one TCP port for the server in the panel. Set that port as the `PORT`
environment variable (default `3000` if unset). The panel's reverse proxy
(nginx/caddy) will forward external HTTPS traffic to this port.

---

## 8. Egg Startup Variables (Pterodactyl egg config)

If you are packaging a custom egg, add these variables to the egg JSON:

```json
[
  {
    "name": "Database URL",
    "env_variable": "DATABASE_URL",
    "default_value": "file:/home/container/data/prod.db",
    "required": true
  },
  {
    "name": "JWT Secret",
    "env_variable": "JWT_SECRET",
    "default_value": "",
    "required": true
  },
  {
    "name": "Node Environment",
    "env_variable": "NODE_ENV",
    "default_value": "production",
    "required": true
  }
]
```

---

## 9. Checklist Before First Start

- [ ] `DATABASE_URL` points to a writable path inside `/home/container/`
- [ ] `JWT_SECRET` is set to a non-empty random string
- [ ] `NODE_ENV=production`
- [ ] `npm install` has been run
- [ ] `npx prisma migrate deploy` has been run (creates tables)
- [ ] `npm run build` has been run (creates `.next/`)
- [ ] Port allocation in panel matches `PORT`

---

## 10. Upgrading

When deploying a new version:

1. Upload/pull new source files.
2. In the panel console:
   ```bash
   npm install --production=false
   npx prisma migrate deploy
   npm run build
   ```
3. Restart the server from the panel.

Migrations are applied with `migrate deploy` (safe for production — never drops
data without an explicit migration).

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `Error: Cannot find module '.prisma/client'` | `prisma generate` not run | Run `npx prisma generate` |
| `Environment variable not found: DATABASE_URL` | Variable not set in panel | Add `DATABASE_URL` to startup variables |
| Port already in use | Another process on the allocated port | Check panel port allocation, restart node |
| White page / 500 after login | `JWT_SECRET` missing or changed | Set/restore `JWT_SECRET`; existing sessions will be invalid |
| SQLite `SQLITE_CANTOPEN` | Data directory does not exist | `mkdir -p /home/container/data` |
| `next: not found` | Build deps not installed | Run `npm install --production=false` (not `--production`) |
