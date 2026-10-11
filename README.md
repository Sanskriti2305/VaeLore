<div align="center">

# Vaelore

### A cozy home for every reader.

Step into a warm 3D library, pick a cat companion, take a book off the shelf, and read it page by page — free, instantly, no sign-up.

<br>

[**Visit Vaelore →**](https://vae-lore.vercel.app/)

<!-- Replace the line above with: [**Visit Vaelore →**](https://your-site.vercel.app) -->

<br>

**Built entirely by voice with [Wispr Flow](https://wisprflow.ai)**

</div>

---

<!-- Screenshots: add images or a short GIF here (the room, the book cover, the page turn, a shared shelf). -->
<!-- ![The Vaelore library](docs/room.png) -->

## Reading, made into a place

Free classic literature is everywhere, but it's rarely a joy to read. Most sites give you a plain list of titles and a long wall of text.

**Vaelore turns your reading life into somewhere you want to spend time.** Your To Read, Reading and Read shelves live in a warm, candle-lit library you can walk through. Pull a book from the shelf, carry it to the armchair by the fireplace, open it from its cover, and turn the pages like a real book — with a small cat keeping you company.

Thousands of public-domain classics. No ads in your way, no paywall, no account required to begin.

---

## What makes Vaelore special

| | |
|---|---|
| **A library you can walk through** | Look around in every direction, climb a rolling ladder, and sit wherever you like: armchairs, a sofa, the window seat, or a cushion on the floor. |
| **A book that feels like a book** | Start at the closed cover, open it, and turn pages with a smooth 3D page-turn and the sound of paper. Flip the book over to read the back cover. |
| **A companion in every room** | Choose Biscuit, Mochi or Sootie — three hand-built 3D cats with their own looks, walks, and moods. |
| **Yours from the first minute** | Start as a guest instantly. Save your shelf with Google whenever you're ready. |
| **Made to be shared** | Send a friend a link to your shelf and show them what you're reading. |

---

## Features

### The library
- Three shelves — **To Read, Reading, Read** — that fill from the bottom up, with ladders for the top rows
- Pick up a book, carry it, and **read it from any seat** in the room
- **Jump to anywhere** — shelves, kitchen, tea corner, window, sofa — or view the whole room, top-down, or straight at the shelves
- A living room: swaying curtains, drifting autumn leaves, a crackling fireplace, fairy lights, a visiting bird
- Little rituals: brew coffee, have tea, take cake from the fridge, and sweep the dust off the shelves
- A **cozy level** that grows as you read and settle in

### The reader
- Opens on the **real book cover** (from Open Library when available)
- Realistic **page-turn animation** with sound — click a page edge, or use the arrow keys
- **Two-page spread or one page at a time**, plus **full screen**
- **Bookmarks** with a ribbon, **highlights** in yellow, green and pink, a notes panel, and a progress bar
- Your place is saved automatically

### Getting started
- **Guest by default** — no sign-up wall
- A short welcome: choose your interests, add books you've read or want to read (**type or speak**), and get recommendations
- **Voice search** with the microphone button
- **Share my shelf** — a public, read-only link

---

## Made for readers of every kind

- **Lovers of the classics** who want free, legal books in a beautiful place
- **Students and teachers** — highlights, bookmarks and a clean reader for assigned reading
- **Cozy-game fans** who enjoy calm, atmospheric worlds
- **Anyone with limited access to books** — everything is free public-domain literature
- **Voice-first users** — search and add books by speaking
- **Readers on any device** — single-page reading on phones, and calmer visuals for anyone who prefers **reduced motion**
- **Book clubs and friends** — shareable shelves make recommendations easy

---

## Built by voice with Wispr Flow

> **Vaelore was designed and built entirely by speaking, using [Wispr Flow](https://wisprflow.ai).**

Wispr Flow made building a project this ambitious genuinely easy:

- **Ideas moved at the speed of thought.** The look, the mood, the shelves, the cats and the page-turn feel could be described out loud, in full, instead of squeezed into short typed prompts.
- **Iteration was effortless.** Spotting something to improve and saying it took seconds, so *describe → build → look → refine* stayed fast and fluid.
- **Creative direction came naturally.** Atmosphere, colour and feeling are easier to express in speech — exactly what a cozy product needs.
- **Focus stayed on the product.** Less friction between thinking and making meant more energy for what makes Vaelore special.

A full 3D scene, accounts, a database and a polished reader — built with a voice.

---

## How it works

```
React · Vite · Tailwind CSS · Three.js
        │
        ├── 3D library and cats ......... Three.js (all models built in code)
        ├── Reader ...................... cleans Project Gutenberg text, reflows it into
        │                                 fixed pages so page numbers never change
        ├── Accounts and shelves ........ Supabase: anonymous sign-in, Postgres,
        │                                 Row Level Security
        ├── Covers and book search ...... Open Library
        └── Book text ................... Project Gutenberg, loaded on demand through
                                          a small function on your own host and cached
```

**Privacy and security.** Each person can read and write only their own shelf, bookmarks and highlights. A shared shelf is readable by anyone with its link and editable only by its owner. No secrets are stored in the repository.

---

## Run it locally

You'll need **Node.js 18+** and a free [Supabase](https://supabase.com) project.

```bash
npm install
```

1. In Supabase, open **SQL Editor** and run `supabase/schema.sql`.
2. In **Authentication → Sign In / Providers**, switch on **Allow anonymous sign-ins**.
3. Copy `.env.example` to `.env` and add your project URL and public **anon** key:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
4. Start the app:
   ```bash
   npm run dev
   ```
   Open **http://localhost:5173**.

While the dev server is running, a book is fetched the first time you open it. To pre-load the starter books, run `npm run books`.

**Optional — Google sign-in.** To let people keep their shelf with Google, enable the Google provider in Supabase and turn on manual linking. Guest reading works without it.

---

## Good to know

- **Which books open?** Any book in the catalog that has a Project Gutenberg number. Titles added only as records during sign-up (from Open Library search) can't be opened — add books to your shelf from **Find a book**.
- **Covers** come from Open Library; when one isn't available, Vaelore draws a cover for the book.
- **Devices.** Reading works everywhere, including phones. The 3D library is best experienced on a computer.
- **Starter catalog.** A small starter set is included; run `npm run catalog` to build a larger one from Project Gutenberg.

---

## Frequently asked questions

**Is it free?**
Every book is free public-domain literature, and you can start reading without creating an account.

**Do I need to sign up?**
No. You begin as a guest. Choose "Save My Shelf" when you want to keep your library across devices.

**Where do the books come from?**
[Project Gutenberg](https://www.gutenberg.org) — English-language books whose authors died in 1965 or earlier. Text is shown courtesy of Project Gutenberg, with a link to its license in the reader.

**Can I share what I'm reading?**
Yes. "Share my shelf" creates a link anyone can open to see your shelves.

**Can I read on my phone?**
Yes — the reader switches to a single-page layout.

---

## Roadmap

- **Reading cafés** — partner spaces and cozy meetups for readers
- **Community groups** — shared reading rooms, book clubs and group highlights
- **Make it yours** — decorate your library with furniture, rugs and wall art
- **More companions** — new cats and unlockable accessories
- **More languages and sources**
- **Offline reading**

---

## Credits

- **Books** — text courtesy of [Project Gutenberg](https://www.gutenberg.org/policy/license.html). The license notice is kept in `LICENSE-GUTENBERG.txt` and shown in the reader.
- **Covers and book search** — [Open Library](https://openlibrary.org)
- **3D** — [Three.js](https://threejs.org) · **Backend** — [Supabase](https://supabase.com) · **Hosting** — [Vercel](https://vercel.com)
- **Fonts** — Playfair Display and Lora
- **Voice** — built with [Wispr Flow](https://wisprflow.ai)

---

<div align="center">

**Vaelore** — *a heaven for book readers.*

Built entirely by voice with [Wispr Flow](https://wisprflow.ai)

Author: `Sanskriti Shukla`

</div>
