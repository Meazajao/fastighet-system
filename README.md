# Fastighet — Ärendehanteringssystem

> Modernt system för felanmälningar och fastighetsunderhåll i Stockholm Stad.

🌐 **Live:** [fastighet-system.vercel.app](https://fastighet-system.vercel.app)

---

## Skärmdumpar

### Login
![Login](https://github.com/user-attachments/assets/052b6142-3057-4e21-888e-ea4a244b1bfc)

### Hyresgäst — Dashboard
![Dashboard](https://github.com/user-attachments/assets/d0037e37-51b7-4a55-857d-670928521e5b)

### Admin — Översikt
![Admin](https://github.com/user-attachments/assets/33f54a36-75b7-4881-97bb-c536855a80f5)

---

## Funktioner

- 🔐 Inloggning & registrering med e-postbekräftelse
- 📝 Skapa felanmälningar med bild
- 📊 Följ ärendestatus i realtid
- 💬 Chatt mellan hyresgäst och admin
- 🔔 Realtids-notifikationer
- 👥 Adminpanel med filter och sökning

---

## Tech Stack

- **Next.js 16** — Frontend + API
- **Supabase** — Auth + Databas
- **Prisma** — ORM
- **Socket.io** — Realtid
- **Tailwind CSS v4** — Styling
- **Vercel** — Hosting
- **Render** — Socket.io server

---

## Kom igång

```bash
git clone https://github.com/ditt-repo/fastighet-system.git
cd fastighet-system
npm install
cp .env.example .env.local
npm run dev
```

### Miljövariabler (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=
```

---

## Deploy

| Tjänst | Plattform | URL |
|--------|-----------|-----|
| Next.js | Vercel | fastighet-system.vercel.app |
| Socket.io | Render | fastighet-socket.onrender.com |
| Databas | Supabase | — |

---

## Skapad av

**Meaza** · Stockholm · 2026