# Contributing

Thanks for your interest in Icebreaker Bingo! The easiest and most welcome way to contribute
right now is by submitting a **phrase pack** — a themed set of 24 icebreaker phrases for a
specific audience or occasion — or a **translation** of an existing pack into another language.

You don't need to touch any application code to do this.

---

## Submitting a phrase pack

A phrase pack is a set of exactly 24 short, fun, inclusive icebreaker phrases for a particular
group or occasion — for example a school class, a corporate offsite, a wedding, or a youth camp.
The built-in default set (see `config.js`) is a good example of the tone and specificity to aim
for: short, concrete, and relatable to the people who'll actually be reading them off a bingo
card ("Has typed OTW while still at home" rather than "Is often late").

1. Create a new file under `phrase-packs/`, named for the audience, e.g.
   `phrase-packs/corporate-offsite.json`.
2. Use this shape:

   ```json
   {
     "name": "Corporate Offsite",
     "language": "en",
     "description": "For a mixed-department team offsite or all-hands.",
     "phrases": [
       "Has worked at 3+ companies",
       "Has been on this team for less than 6 months",
       "... 22 more phrases ..."
     ]
   }
   ```

3. Guidelines for phrases:
   - Exactly 24 phrases, no more, no less.
   - Short — under 8 words each — and phrased as a statement, not a question (players are
     matching people to statements, e.g. "Owns a Casio watch", not "Do you own a Casio watch?").
   - Specific and relatable to the stated audience rather than generic small talk.
   - Inclusive and safe for mixed company — nothing that assumes income, relationship status,
     religion, physical ability, or similar, unless the pack is explicitly themed for a context
     where that's appropriate and said so in `description`.
   - No duplicates within the pack, and please check it doesn't just re-skin an existing pack.

4. Open a pull request with your new file. In the description, say a bit about who the pack is
   for and where you'd use it — that context helps with review.

Note: `phrase-packs/singapore-school-life.json` is the one pack that's actually wired in — it's
fetched at runtime as the automatic default for any host with no saved phrases yet (see
`getDefaultPhrases()` in `config.js`). Every other pack in this directory isn't loaded by the app
itself yet; hosts currently write or AI-generate their own 24 phrases from scratch, or copy one of
these packs into the dashboard's phrase box by hand. Accepted packs are curated here as a growing
library, and may inform a future in-app "choose a starter pack" picker.

---

## Submitting a translation

Translations are welcome for any existing phrase pack, including the default set. A translation
should adapt the *intent* of each phrase for the target language and culture, not translate it
word-for-word — a phrase that's natural and specific in English may need to become a different
(but equivalent) phrase to land the same way in another language.

1. Copy the pack you're translating and name the new file with a language suffix, e.g.
   `phrase-packs/singapore-school.es.json` for a Spanish translation of
   `phrase-packs/singapore-school.json`.
2. Use the same JSON shape as above, with `"language"` set to the appropriate
   [BCP 47](https://en.wikipedia.org/wiki/IETF_language_tag) tag (`"es"`, `"pt-BR"`, `"zh-Hans"`,
   etc.) and `"phrases"` containing your translated/adapted set of 24.
3. Keep the same `"name"` and reference the original pack's filename in `"description"` so it's
   easy to tell which pack it's a translation of.

The app's interface itself (buttons, labels, instructions) is English-only for now — translation
contributions are scoped to phrase content, not a full UI localization, which would be a larger
change to the codebase.

---

## Other contributions

Bug reports and small fixes (typos, broken links, CSS glitches) are welcome via issues or pull
requests. For anything larger — new features, schema changes, changes to the auth or session
flow — please open an issue first to discuss the approach before writing code, since this is a
small static app with no test suite to catch regressions, and changes to `config.js`,
`supabase/`, or RLS policies affect a live deployment.
