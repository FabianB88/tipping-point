# Artwork-log

Wat er bij GPT Work is aangevraagd, in welke chat, en wat ervan is goedgekeurd. Beide Claude-chats lezen en schrijven dit bestand. Zet nieuwe aanvragen onderaan, met datum.

## Let op: Work-limiet

Op 2026-10-01 rond 13:00 meldde ChatGPT "Je gebruik voor Work is voorlopig op", reset om 15:49. Batch 3 en 4 stopten vóór het inpakken; de losse beelden staan wel in het Uitvoer-paneel van die chats. Niet upgraden, geen credits kopen. Na de reset: in dezelfde chat vragen om de zip alsnog te maken ("Bundel alle gemaakte PNG's met de exacte bestandsnamen in tipping-point-batch3-fx-ui.zip").

## Batch 1: vos en vijanden — BINNEN en goedgekeurd

Chat "Game sprites maken". Zip `tipping-point-batch1.zip` uitgepakt in `assets/gpt/batch1` (21 PNG's). Alles bruikbaar en op niveau: `vos_ref`, `vos_delen`, `vos_ren_1..6` (door tools/assets.py tot één sheet `vos_ren` gemaakt, baseline gelijk), `vos_sprong`, `vos_val`, `vos_slide`, `vos_muur`, `vos_slinger` (zonder touw, dat tekent de engine), `vos_geraakt`, `vos_winst`, `vijand_bulldozer`, `vijand_zaagrobot`, `vijand_gifblob`, `vijand_smog`, `vijand_olie`, `vijand_vat`.

## Batch 2: bosgebied — BINNEN en goedgekeurd

Chat "Write environment art files". Zip `tipping-point-batch2-bos.zip` in `assets/gpt/batch2` (15 PNG's). Parallaxlagen `bos_lucht|ver|midden|dichtbij|voor` (zijranden vervagen; assets.py snijdt 6 procent af en spiegelt), `bos_tegels` (tegelblad, door assets.py geknipt tot `tegel_*`; middenstukken zijn niet naadloos, dus batch 4 blijft gewenst), `bos_boostplaat`, `bos_krat`, `bos_obstakel_1..6`, `front_bos`.

## Batch 3: effecten, items en UI — BINNEN (19:11)

Chat "Maak game assets zipbestand". 24 beelden staan in het Uitvoer-paneel (fx_stof, fx_rook, fx_vuur, fx_explosie, fx_plons, fx_gifbel, fx_gifwolk, fx_inslag, fx_boost, item_eikel, item_krat, item_grijphaak, item_raket, item_val, item_schild, item_peper, item_sneeuwbal, item_olie, item_magneet, logo, ui_knoppen, ui_hud, ui_plekken, ui_pijlen). Na de reset alsnog ingepakt en uitgepakt in `assets/gpt/batch3`. De fx-rasters zijn door assets.py tot 8-frame sheets geknipt. `ui_knoppen`, `ui_hud` en `ui_pijlen` zijn bladen: de engine verwacht losse `ui_knop` en `ui_paneel`, dus die moeten nog uit het blad geknipt worden (nog te doen).

## Batch 4: naadloze tegels — BINNEN (19:30)

Chat "Tegels maken zippen". Tien stukken in `assets/gpt/batch4`: `tegel_grond`, `tegel_vulling`, `tegel_muur`, `tegel_plafond`, `tegel_platform`, `tegel_platform_links|rechts`, `tegel_rand_links|rechts`, `tegel_helling`. Deze winnen van de uit het blad geknipte stukken (batch 4 > batch 2 in assets.py). Nog controleren in het spel of de naden echt onzichtbaar zijn.

## Batch 5: uil — AANGEVRAAGD (2026-10-02, 00:07 na de dagreset)

Nieuwe chat op chatgpt.com, Work-modus, model GPT-5.6 Sol (de standaard GPT-6 Astra is bewust uitgezet). `vos_ref.png` als stijlreferentie meegestuurd. Gevraagd: `uil_ref`, `uil_ren_1..6`, `uil_sprong`, `uil_val`, `uil_slide`, `uil_muur`, `uil_slinger`, `uil_geraakt`, `uil_winst` in `tipping-point-batch5-uil.zip`. Daarna op dezelfde manier bever (batch 6) en ijsbeer (batch 7). De engine pakt `<rol>_ref` en `<rol>_ren` automatisch op zodra assets.py gedraaid is.

## Nog niet aangevraagd

Bever, ijsbeer en raptor (prompts A5 t/m A7 in GPT-PROMPTS.md); industrieterrein, kust en oertijd (C2 t/m C4, D, E, F); portretten (G4); vijanden triceratops en pterosaurus. Tot de dieren er zijn krijgen de bots de vos met een eigen kleurzweem (`TP.ROLLEN.*.tint`).

## Gratis packs

Zie `assets/BRONNEN.md`. Gebruikt in de game: Kenney particle-pack (stof, vonken, strepen), Kenney audio (impact, interface, digital, jingles), lettertypen Lilita One en Titan One. Niet gebruikt (stijl past niet naast de vos): GameArt2D dino/robot/tileset/GUI, Bevouliin monster, Glitch-omgevingen.
