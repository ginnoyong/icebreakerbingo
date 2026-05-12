https://ginnoyong.github.io/icebreakerbingo/

# 🎉 Icebreaker Bingo

A mobile-friendly bingo game for icebreaker activities. Players scan a QR code, get a randomly shuffled card, and find people in the room who match each square. First to get five in a row wins.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | The bingo game — share this with players |
| `admin.html` | Edit the 24 bingo phrases |

---

## How to play

1. The host shares the game URL or players scan the QR code on screen
2. Each player opens it on their phone — the board shuffles randomly for each new visit
3. Mingle! Find someone who matches a square, tap it, and type their name
4. First to get five in a row (across, down, or diagonal) wins 🏆
5. The centre square is a free space

---

## Customizing phrases

Go to `/admin.html`, edit the text area (one phrase per line, or separated by semicolons), and tap **Save phrases**. Changes are stored in Supabase and take effect on all devices immediately — no redeployment needed.

There are always exactly **24 phrases** (the 25th square is the free space).

---

## Tech stack

- **Frontend:** Vanilla HTML, CSS, JavaScript — no frameworks
- **Database:** [Supabase](https://supabase.com) — phrases are stored and served from a Supabase Postgres database
- **Hosting:** GitHub Pages — fully static, no server required

---

## How it works

`index.html` fetches the current phrases from Supabase on load, then shuffles them into a unique card using a seed stored in the URL. Sharing the same URL gives everyone the same shuffled layout; a fresh visit generates a new one.

`admin.html` reads the current phrases from Supabase into a text area and writes them back on save via a `PATCH` request.

---

## Setup (if forking this repo)

1. Create a [Supabase](https://supabase.com) project
2. Run this in the SQL Editor:

```sql
create table phrases (
  id integer primary key,
  data jsonb not null
);

insert into phrases (id, data) values (1, '["Phrase 1","Phrase 2"]'::jsonb);
```

3. Go to **Project Settings → API** and copy your **Project URL** and **anon public key**
4. Replace `SUPABASE_URL` and `SUPABASE_KEY` in both `index.html` and `admin.html`
5. Push to GitHub and enable GitHub Pages under **Settings → Pages**
