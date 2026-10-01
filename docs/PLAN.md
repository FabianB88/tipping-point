# Tipping Point: plan

Snelle arcade-racegame voor desktop. Dieren racen tegen elkaar terwijl achter hen een ramp oprukt. Mechaniek van SpeedRunners, vormgeving op het niveau van Banana Kong en Torchlight 2. Spelplezier 80 procent, leren 20 procent.

## De lat

- Geen pixel art, geen tijdelijke vormen in wat de opdrachtgever te zien krijgt. Debugweergave bestaat alleen voor eigen tests (toets F3) en staat standaard uit.
- Eén stijl in beeld: het GPT-artwork is leidend. Gratis packs alleen waar ze er naast de vos niet uitspringen (verre parallaxlagen, particle-texturen).
- Gamefeel-volgorde: reactie op invoer, beweging, camera, botsfeedback, particles, geluid, screenshake.

## Beweging en natuurkunde

Eigen kinematische controller, geen Arcade- of Matter-physics. Reden: hellingen met momentum, wall-jumps en een slinger voelen alleen goed als elke regel zelf is afgestemd. Vaste stap van 1/120 s, meerdere substappen per frame.

- Rennen: versnelling 2600 px/s², topsnelheid 950 px/s, omdraaien extra snel. Loslaten remt met 1800 px/s².
- Hellingen: snelheid volgt de raaklijn. Bergaf krijg je 60 procent van de zwaartekrachtcomponent erbij, bergop gaat die eraf. Een slide bergaf is de snelste manier van het level.
- Springen: 1150 px/s omhoog, ingedrukt houden verlaagt de zwaartekracht de eerste 0,18 s. Coyote-tijd 0,1 s en een invoerbuffer van 0,12 s zodat de sprong nooit "niet pakt". Dubbele sprong 1000 px/s.
- Wall-jump: tegen een muur in de lucht glijd je met maximaal 320 px/s omlaag; springen geeft 950 omhoog en 720 van de muur af, kijkrichting draait om.
- Slide: hitbox half zo hoog, minder wrijving. Nodig onder lage takken.
- Grijphaak: knop vasthouden zoekt het dichtstbijzijnde ankerpunt binnen 720 px in een kegel vooruit en omhoog. Touwlengte vast op het moment van vastgrijpen, slingeren met zwaartekracht en afgedempte snelheid, loslaten geeft 10 procent bonus op de snelheid.
- Botsing met obstakel of vijand: 0,5 s verdoofd, snelheid naar 30 procent. Op een vijand springen schakelt hem uit en geeft een hupje.
- Rakelings missen (binnen 12 px passeren zonder raken): geluid en 0,4 s lichte boost.
- Boostplaat: snelheid naar minimaal 1400 px/s gedurende 0,8 s.

## Camera en front

- De camera volgt de koploper met vooruitkijken in de rijrichting. Hij zoomt uit tot 0,7 om het peloton in beeld te houden en zoomt weer in als het bijeenkomt.
- Het front is de linkerrand van het beeld. Wie met zijn hele lichaam links uit beeld raakt, wordt gepakt en ligt eruit, met een ingezoomde kill-cam van een halve seconde.
- Dat betekent: de koploper bepaalt het tempo. Vooruit rennen is aanvallen.

## Baanopbouw

- Een baan is een reeks handgebouwde stukken (chunks) in `src/banen/`. Elk stuk is data: rechthoeken (grond, muren, plafonds), hellingen, doorlaatbare platforms, ankerpunten, boostplaten, kratten, vijanden, obstakels, decor, en per route de "cues" voor bots.
- Elke baan heeft drie routes: veilig (laag, langzaam, vol vijanden), gevaarlijk (midden, sneller, hoge sprongen) en expert (hoog, alleen met haak en wall-jumps).
- De baan is een lus. Na het laatste stuk begint het eerste opnieuw; het front wordt elke ronde sneller, zodat een ronde altijd eindigt.
- Toeval alleen in sfeer (vonken, vallende blaadjes) en in de inhoud van kratten, nooit in de baan zelf.

## Bots

- Bots gebruiken precies dezelfde controller als de speler; alleen de invoer komt van de AI. Daardoor kunnen echte spelers later naadloos invallen.
- Per stuk baan staan cues: op x-positie, welke actie, voor welke route. Een bot met vaardigheid s (0,6 tot 0,95) kiest de route die bij s past, voert elke cue uit met kans s en een timingfout tot 80 ms.
- Rubberband: wie ver achterligt rent 6 procent sneller, wie ver voorligt 3 procent langzamer. Nooit genoeg om een goede run te verpesten.
- Bots gebruiken items als er een tegenstander binnen bereik voor hen is.

## Items en schieten

Kratten geven één item. Vooraf goed beantwoorde vraag geeft een item bij de start.

- Eikelraket: schiet vooruit, raakt de eerste tegenstander, verdoving.
- Honingval: blijft liggen, wie erin stapt is 0,8 s traag.
- Olieplas: wie eroverheen rent verliest grip en draait om.
- Chilipeper: 2 s turbo.
- Bladschild: eerste treffer telt niet.
- Sneeuwbal: bevriest één tegenstander 0,7 s.
- Magneet: trekt de speler 1,5 s naar het dichtstbijzijnde ankerpunt of eikel.

Schieten (zonder item) is een zwak eikelschot met afkoeltijd: het zet rondlopende vijanden uit en duwt tegenstanders iets terug. Zo is er altijd iets te doen met de schietknop.

## Rondes en wedstrijd

- Ronde eindigt als er één dier over is. Eerste met drie ronden wint de wedstrijd.
- Tussen rondes drie seconden stand, dan direct opnieuw. Herstart na een gewonnen of verloren ronde onder een seconde.
- Timer, tussentijd per baanstuk en persoonlijk record per baan (afstand en beste rondetijd) in localStorage.

## Schermen

Menu (logo, wereld kiezen, rollen zichtbaar), Vraag (10 tot 15 s, één vraag, beloning), Race, Rondestand, Einde (wedstrijdstand, één feit over de ramp, opnieuw of menu).

## Rollen

Begin met de vos, af. Vos-kracht: dash van 0,4 s met onkwetsbaarheid, afkoeltijd 8 s. Daarna uil (ziet cues en een voorspelling van het front), bever (plaatst tijdelijk platform), ijsbeer (beukt door obstakels, vangt één klap op).

## Werelden

1. Bosbrand (eerst): vallende brandende bomen, rook, instortende grond, houtkapmachines. Front = vuurmuur.
2. Luchtvervuiling: vliegende dieren boven een industrieterrein, luchtstromen als levelontwerp. Voorstel voor vliegmechaniek volgt apart.
3. Overstroming: stijgend water, onderste route loopt tijdens de ronde onder. Voorstel voor zwemmechaniek volgt apart.
4. Uitsterven: dinosaurussen, baan gaat in fasen kapot (aardbevingen, lava, meteorieten, ondergang).

## Techniek

- Phaser 3.90 lokaal, één `index.html`, modules in `src/` zonder bundler (gewone scripts in vaste volgorde).
- Interne resolutie 1920x1080, geschaald met FIT. Artwork wordt op 1024 px aangeleverd, personage circa 150 px hoog in beeld.
- Artwork laden via `assets/manifest.json`, gemaakt door `tools/assets.py`. Dat script scant `assets/gpt/*` en `assets/spel`, snijdt lege randen weg, zet ren-frames op één spritesheet met gelijke baseline en knipt fx-rasters tot atlassen. Nieuw of vervangen bestand: script opnieuw draaien, geen codewijziging.
- Voorrang bij laden: `assets/spel` (bewerkt) boven `assets/gpt/batchN` boven `assets/gratis`.
- Geluid: Kenney-audio (CC0) voor impact en interface, gesynthetiseerd vuurgeruis via WebAudio. Muziek later.
- Multiplayer later: alle spelers zijn `Renner`-objecten met een invoerbron (toetsenbord, bot, later netwerk). Vaste stap maakt lockstep mogelijk.

## Semi-2.5D

De parallax krijgt vijf lagen plus een voorgrondlaag die sneller beweegt dan de speler, en de baanstukken krijgen een lichte dieptelaag (zijkanten van platforms donkerder, schaduw van de speler op de grond, haakpunten die iets voor de baan hangen). Dat geeft diepte zonder 3D.

## Risico's

- GPT levert geen perfect sluitende renframes: oplossing is de delen-sheet (cut-out animatie in code) als de frames niet bruikbaar zijn.
- Tegelblad van GPT kan niet naadloos zijn: tegels worden dan losse "platformstukken" met eigen uiteinden in plaats van een raster.
- Parallaxlagen kunnen niet herhaalbaar zijn: script spiegelt de laag dan (A, A-gespiegeld) zodat de naad verdwijnt.
- Eigen physics kost afstemtijd: daarom komt eerst het bewegen, getest zonder artwork.

## Aannames

- Wedstrijd is best-of-five. Drie bots standaard.
- Baan 1 van wereld 1 is 24 stukken lang (ongeveer 70 seconden per lus bij topsnelheid).
- Rollen zijn puur cosmetisch tot de vos goed voelt.
