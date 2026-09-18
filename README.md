# SPIRELINE — Parkour Oʻyini: Konsepsiya va Texnik Hujjat

Birinchi shaxs parkour oʻyini uchun toʻliq **Game Design & Technical Document** — interaktiv veb
koʻrinishida. Hujjat 8 boʻlimdan iborat: vizyon, harakat mexanikasi, level dizayni, oʻyin sikli,
texnik arxitektura, audio, ishlab chiqarish rejasi va debug tooling.

## Tuzilma

| Yoʻl | Tavsif |
| --- | --- |
| `/` | Tematik landing sahifa: High Concept, Core Fantasy, 3 ta USP, Kaskad zonalari, hujjat tuzilmasi |
| `/hujjat` | Toʻliq GDD: chap tomonda sticky mundarija, scroll-spy, interaktiv vositalar |

## Hujjat boʻlimlari

1. **Asosiy Vizyon va Identitet** — pasport, high concept, core fantasy, 3 USP, raqobat tahlili, 4 dizayn ustuni
2. **Harakat Mexanikasi va Dinamika** — fizika asoslari, 14 harakat katalogi, Kinetik Zaryad, momentum qoidalari, coyote/buffer, Flow State, game juice
3. **Level Design va Yoʻl Topish** — Tracer Language, signposting qoidalari, Risk vs Reward, 12 toʻsiq katalogi, blockout metrikasi
4. **Oʻyin Sikli va Rivojlanish** — 4 sikl qatlami, Line Grade formulasi, 8 qayta oʻynash tizimi, skill tree
5. **Texnik Arxitektura** — HFSM state machine, 9 probeli skaner, reachability solver, 41 parametr, UE5/Unity realizatsiyasi, ghost tarmogʻi, QA
6. **Audio va Atmosfera** — 4 qatlamli adaptiv musiqa, intensivlik xaritasi, nafas tizimi, 8 sirtli foley matritsasi, miks arxitekturasi
7. **Ishlab Chiqarish Rejasi** — 22 oylik reja, jamoa tarkibi, xatar reyestri, tezkor cheat sheet
8. **Gameplay Debug HUD va Dev Tooling** — 8 panel, dunyo chizmalari, tugma/konsol katalogi, telemetriya va friction tahlili, ship xavfsizligi, qabul mezonlari

## Interaktiv vositalar

- **Flow Simulator** (2.8) — tezlikni oʻzgartirib, KC tiklash, FOV, musiqa qatlami va BPM ni koʻring
- **Reachability Kalkulyatori** (5.5) — gravitatsiya, sakrash kuchi va tezlik → boʻshliq masofasi, SVG trayektoriya

## Texnik stack

React 18 · TypeScript · Vite 6 · Tailwind CSS 4 · React Router 6

```bash
bun install
bun run dev        # dev server
bun run typecheck  # tsc -b --noEmit
```

Dev server `0.0.0.0` ga bogʻlanadi va `PORT` muhit oʻzgaruvchisini oladi; HMR platforma talabiga
koʻra oʻchirilgan (`server.hmr: false`).
