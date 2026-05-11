# 🎉 Icebreaker Bingo

A mobile-friendly bingo game for icebreaker activities — parties, team meetups, classrooms, or any group event. Each player gets a randomly shuffled card. Find someone in the room who matches each square, tap it, type their name, and race to get five in a row!

---

## Files

| File | Purpose |
|---|---|
| `index.html` | The bingo game (share this URL with players) |
| `admin.html` | Password-protected phrase editor |
| `password.txt` | SHA-256 hash of the admin password |

---

## How to play

1. Share the game URL with everyone in the group
2. Each player opens it on their phone — the board shuffles randomly for each new visit
3. Mingle! When you find someone who matches a square, tap it and type their name
4. First to get five in a row (across, down, or diagonal) wins 🏆
5. The centre square is a free space

---

## Hosting on GitHub Pages

1. Upload all three files to a GitHub repository
2. Go to **Settings → Pages**
3. Under **Source**, select your branch (e.g. `main`) and folder (`/ root`)
4. Save — your game will be live at `https://yourusername.github.io/reponame/`

---

## Customizing the phrases

Phrases are managed through the password-protected admin page at `/admin.html`.

**To edit phrases:**
1. Go to `https://yourusername.github.io/reponame/admin.html`
2. Enter the admin password
3. Edit any of the 24 phrases
4. Tap **Save phrases** — changes take effect immediately for all new card loads

Phrases are saved to each player's browser (`localStorage`). If a player has never visited the admin page, they always get the latest saved phrases automatically.

**Other options in the admin page:**
- **Export as .txt** — download your phrases as a numbered text file
- **Import from .txt** — bulk-replace all 24 phrases from a text file (one phrase per line)
- **Reset to defaults** — restore the original 25 built-in phrases

---

## Changing the password

The admin password is stored as a SHA-256 hash in `password.txt` — the plaintext password is never saved anywhere in the repository.

To set a new password:

1. Generate a SHA-256 hash of your new password at [https://emn178.github.io/online-tools/sha256.html](https://emn178.github.io/online-tools/sha256.html)
2. Replace the contents of `password.txt` with the new hash
3. Commit and push — the new password is active immediately

---

## Features

- 5×5 randomised bingo grid, shuffled on every new page load
- Seed stored in the URL — reshuffling generates a shareable link for that exact layout
- Tap a square to mark it with a name; tap again to unmark
- Bingo detection across all rows, columns, and both diagonals
- Confetti animation on winning
- Fully mobile-optimised with a bottom-sheet input dialog
- Password-protected admin page with phrase import/export
- No server required — runs entirely as static files

---

## Default phrases

The game ships with these 24 phrases, which can all be replaced via the admin page:

1. Has traveled to 3+ countries
2. Speaks 2+ languages
3. Woke up before 6am today
4. Loves pineapple on pizza
5. Has a pet at home
6. Plays a musical instrument
7. Prefers tea over coffee
8. Binge-watched a series overnight
9. Has met a celebrity
10. Loves spicy food
11. Has run a 5K or more
12. Works from home regularly
13. Has a hidden talent
14. Has lived in another city
15. Is the eldest sibling
16. Can cook a dish by memory
17. Read a book this month
18. Collects something unusual
19. Has gone camping
20. Learned something new this week
21. Is afraid of heights
22. Can solve a Rubik's cube
23. Has dyed their hair before
24. Loves karaoke
