# Tipping Point: prompts voor het artwork

Dit is de lijst met alles wat GPT moet maken. De prompts zijn Engels omdat beeldgeneratie daar het best op reageert.

## Zo werk je

1. Start per onderdeel (personages, bos, industrie, kust, oertijd, UI) een nieuwe chat.
2. Plak als eerste bericht het STIJLBLOK hieronder.
3. Maak eerst prompt A1 (de vos). Dat beeld is de stijlreferentie: upload het aan het begin van elke volgende chat met de zin "Match the style of this image exactly."
4. Sla elk beeld op onder de bestandsnaam die bij de prompt staat, in `tipping-point/assets/`.
5. Keur streng. Wijkt de lijndikte, de belichting of het kleurpalet af van de vos, laat het opnieuw maken.

## STIJLBLOK (eerste bericht van elke chat)

```
You are the art director for a 2D side-scrolling arcade racing game called "Tipping Point".
Every image you make in this chat must follow this style exactly:

- Hand-painted 2D cartoon game art at the quality level of a premium mobile runner game.
- Bold, readable silhouettes. Slightly exaggerated proportions: big heads, expressive eyes, chunky limbs.
- Outline: dark warm brown (never pure black), varying thickness, thicker on the outside of the shape.
- Shading: soft cel shading with three tones (base, shadow, highlight) plus a thin warm rim light.
- Light always comes from the top left.
- Palette: saturated and warm. Lush greens, burnt orange, deep teal, cream. Danger colours are fiery orange, toxic lime green and flood blue.
- Strict side view (profile), characters face RIGHT.
- No text, no watermark, no border, no ground shadow, no background unless I ask for one.
- Never pixel art, never 3D render, never photorealistic, never flat clip-art.
- Sprites: transparent background, subject centred, fully inside the frame with a small margin.

Confirm you understand, then wait for my asset requests.
```

## A. Personages

Per dier drie soorten beelden: een referentieblad, een blad met losse lichaamsdelen (daarmee animeer ik rennen en idle in de engine), en losse sleutelposes.

**A1. Vos, referentie** — `vos_ref.png`, 1024x1024
```
Character design of a red fox, the hero of the game. Athletic, quick, a little cocky, determined expression, a small singed patch on the tail tip from the wildfire. Full body, side view facing right, neutral standing pose. Transparent background.
```

**A2. Vos, lichaamsdelen** — `vos_delen.png`, 1536x1024
```
Sprite parts sheet of the same fox for cut-out animation. Separate pieces laid out with clear gaps, not overlapping, each complete where it would be hidden by another piece: head, torso, tail, front leg upper, front leg lower with paw, back leg upper, back leg lower with paw, two ear variants, three eye variants (open, blink, hurt), two mouth variants (closed, open shouting). Side view facing right. Transparent background.
```

**A3. Vos, sleutelposes** — elk 1024x1024, transparant
```
The same fox, side view facing right, [POSE]. Transparent background.
```
Vul voor [POSE] één voor één in en sla op onder de naam erachter:
- `mid-air jump, rising, legs tucked, ears back` → `vos_sprong.png`
- `falling, legs stretched down, arms up, fur blown upward` → `vos_val.png`
- `sliding low along the ground on its side, one leg forward, dust-ready pose` → `vos_slide.png`
- `clinging to a vertical wall on its right side, sliding down, looking back over its shoulder` → `vos_muur.png`
- `swinging from a rope held in one raised front paw, body stretched out behind, at full speed` → `vos_slinger.png`
- `tumbling after a hit, dizzy, eyes spiralling` → `vos_geraakt.png`
- `celebrating victory, jumping with one fist up` → `vos_winst.png`
- `full sprint contact pose, body low and stretched, maximum speed` → `vos_sprint.png`

**A4 tot A7. Andere dieren.** Herhaal A1, A2 en A3 met dezelfde poses. Vervang "red fox" door de beschrijving en `vos_` door het voorvoegsel.
- Uil (`uil_`): `a barn owl who runs on long legs with wings used like arms, wise but anxious, round glasses-like face markings`
- Bever (`bever_`): `a sturdy beaver, stubborn builder type, big flat tail, buck teeth, a twig tucked behind one ear`
- IJsbeer (`ijsbeer_`): `a young polar bear, big and gentle but powerful, slightly thin, fur damp from melting ice`
- Raptor voor de oertijd (`raptor_`): `a small feathered velociraptor, quick and nervous, teal and orange feathers`

## B. Vijanden en gevaren die rondlopen

Elk 1024x1024, transparant, zijaanzicht. Vijanden kijken naar LINKS, want ze komen je tegemoet.

```
Enemy sprite for the game, side view facing LEFT, [BESCHRIJVING]. Transparent background.
```
- `a grumpy cartoon bulldozer with an angry face in the windshield, tracks, raised blade, puffing black exhaust` → `vijand_bulldozer.png`
- `a small logging robot on two legs with a spinning chainsaw arm, yellow and rusty, menacing eyes` → `vijand_zaagrobot.png`
- `a bouncing toxic slime blob, glowing lime green, bubbling, skull-shaped bubble inside, gleeful evil grin` → `vijand_gifblob.png`
- `a living smog cloud creature, dirty purple-grey, coughing, small glowing eyes, wisps trailing behind` → `vijand_smog.png`
- `an oil slick monster rising from a puddle, glossy black with rainbow sheen, dripping arms` → `vijand_olie.png`
- `a leaking rolling toxic barrel with stubby legs, hazard symbol shape (no text), green ooze` → `vijand_vat.png`
- `a floating clump of plastic waste shaped like a jellyfish, bottles and bags, sad angry face` → `vijand_plastic.png`
- `a charging triceratops in panic, wide eyes, kicking up dust` → `vijand_triceratops.png`
- `a pterosaur swooping down with open beak` → `vijand_pterosaurus.png`

Vraag per vijand daarna een tweede beeld: `Same enemy, second animation frame: [squashed mid-bounce / wheels turned / wings down].` → zelfde naam met `_2`.

## C. Omgevingen

Elk gebied heeft vijf lagen. Allemaal 1536x1024, en de linker- en rechterrand moeten op elkaar aansluiten zodat de laag herhaald kan worden.

Vaste zin die je achter elke laagprompt zet:
```
Wide game background layer, side view. The left edge and the right edge must match seamlessly so the image tiles horizontally. No characters, no text.
```

### C1. Bos met bosbrand (`bos_`)
- `Layer 1, sky: late afternoon sky turning orange and smoky toward the left, soft clouds, distant smoke columns. Fully opaque.` → `bos_lucht.png`
- `Layer 2, far: distant forested mountains in hazy blue-green, faint orange glow behind the ridges. Transparent above the mountain line.` → `bos_ver.png`
- `Layer 3, middle: a dense forest of tall pines and broad oaks, some tree stumps and a logged clearing with cut trunks. Transparent background above and between treetops.` → `bos_midden.png`
- `Layer 4, near: large tree trunks, hanging vines, ferns, a few glowing embers drifting. Transparent background.` → `bos_dichtbij.png`
- `Layer 5, foreground: dark silhouetted leaves, branches and grass blades framing the bottom and top edge only, heavily blurred. Transparent background.` → `bos_voor.png`

### C2. Industrial waste site met gifwolk (`industrie_`)
- `Layer 1, sky: sickly yellow-grey polluted sky, thick smog bands, dim sun disk. Fully opaque.` → `industrie_lucht.png`
- `Layer 2, far: skyline of factories, cooling towers and chimneys pouring smoke, hazy silhouette. Transparent above the skyline.` → `industrie_ver.png`
- `Layer 3, middle: rusty storage tanks, pipelines, cranes, a mountain of scrap and tyres. Transparent background.` → `industrie_midden.png`
- `Layer 4, near: leaking pipes, stacked toxic barrels, chain-link fence, warning lights, puddles of glowing green ooze. Transparent background.` → `industrie_dichtbij.png`
- `Layer 5, foreground: dark silhouetted pipes, cables and barbed wire along the top and bottom edge only, blurred. Transparent background.` → `industrie_voor.png`

### C3. Kust met overstroming (`kust_`)
- `Layer 1, sky: dramatic storm sky, dark teal clouds, shafts of light, rain streaks. Fully opaque.` → `kust_lucht.png`
- `Layer 2, far: rough sea horizon with huge swells and a lighthouse, wind turbines far out. Transparent above the horizon line.` → `kust_ver.png`
- `Layer 3, middle: a seaside town with colourful houses half under water, tilted street lamps, a broken dyke. Transparent background.` → `kust_midden.png`
- `Layer 4, near: flooded street details: floating cars, sandbags, bent traffic signs, rooftops, debris. Transparent background.` → `kust_dichtbij.png`
- `Layer 5, foreground: dark silhouetted reeds, ropes and splashing wave tips along the bottom edge only, blurred. Transparent background.` → `kust_voor.png`

### C4. Oertijd met vulkaan (`oertijd_`)
- `Layer 1, sky: prehistoric sunset sky, ash clouds, a bright meteor streak. Fully opaque.` → `oertijd_lucht.png`
- `Layer 2, far: erupting volcano and jagged mountains, lava glow, sauropod silhouettes. Transparent above the mountain line.` → `oertijd_ver.png`
- `Layer 3, middle: giant ferns, cycads and tree ferns, a herd of dinosaurs fleeing in the distance. Transparent background.` → `oertijd_midden.png`
- `Layer 4, near: huge roots, bones, mossy boulders, bubbling tar pit edges. Transparent background.` → `oertijd_dichtbij.png`
- `Layer 5, foreground: dark silhouetted giant leaves and vines along the top and bottom edge only, blurred. Transparent background.` → `oertijd_voor.png`

## D. Bouwstenen van de baan

Per gebied één blad, 1536x1024, transparant. Hiermee bouw ik platforms, hellingen, wanden en plafonds.

```
Platformer tileset sheet for the [GEBIED] level, side view. Separate pieces on a transparent background with clear gaps, each piece tileable with its neighbours: flat ground top (left end, middle, right end), ground fill block, 30-degree slope up, 30-degree slope down, vertical wall (for wall jumping), thin floating platform (left, middle, right), ceiling piece, ceiling piece with a glowing hook point for a grappling hook, a speed boost pad with arrow shapes (no text).
```
Vul voor [GEBIED] in en sla op:
- `burning forest: earth, roots, moss, logs, charred edges` → `bos_tegels.png`
- `industrial waste site: rusty steel, concrete, grating, pipes` → `industrie_tegels.png`
- `flooded coastal town: brick, wet wood, roof tiles, sandbags` → `kust_tegels.png`
- `prehistoric jungle: volcanic rock, bones, giant roots` → `oertijd_tegels.png`

## E. Obstakels en props

Elk 1024x1024, transparant, zijaanzicht.
```
Game obstacle sprite, side view, [BESCHRIJVING]. Transparent background.
```
- Bos: `a fallen burning tree trunk`, `a pile of logged trunks with a chainsaw stuck in it`, `a burning bush`, `a snare trap`, `a hanging vine loop (grapple point)` → `bos_obstakel_1.png` tot `_5`
- Industrie: `a stack of leaking toxic barrels`, `a pool of bubbling green waste with fumes`, `a spinning industrial fan`, `a crusher press`, `a dangling crane hook (grapple point)` → `industrie_obstakel_1.png` tot `_5`
- Kust: `a floating car`, `a broken wooden jetty`, `a whirlpool drain`, `a tangle of fishing nets and plastic`, `a swinging harbour buoy chain (grapple point)` → `kust_obstakel_1.png` tot `_5`
- Oertijd: `a lava geyser`, `a tar pit`, `a rolling boulder`, `giant ribcage bones forming an arch`, `a hanging jungle liana (grapple point)` → `oertijd_obstakel_1.png` tot `_5`

## F. Het front

Per gebied één beeld, 1024x1536 (staand), transparant aan de rechterkant. Dit is de muur die van links komt.
```
A towering wall of [FRONT] advancing from left to right, filling the full height, solid and dense on the left edge, breaking into loose shapes on the right edge. Menacing, with a hint of a monstrous face in the shapes. Transparent background on the right.
```
- `wildfire flames and black smoke` → `front_bos.png`
- `toxic lime-green gas and chemical foam` → `front_industrie.png`
- `a tidal wave carrying debris` → `front_kust.png`
- `a pyroclastic ash cloud with lava` → `front_oertijd.png`

## G. Items, pickups en UI

**G1. Itemiconen** — elk 512x512, transparant
```
Game item icon, chunky and glossy, centred, [ITEM]. Transparent background.
```
`golden acorn (coin)`, `wooden item crate with a leaf emblem`, `grappling hook with rope`, `acorn rocket`, `sticky honey trap`, `leaf shield bubble`, `chili pepper speed boost`, `freezing snowball`, `banana peel style slip trap made of an oil puddle` → `item_eikel.png`, `item_krat.png`, enzovoort.

**G2. Logo** — `logo.png`, 1536x1024, transparant
```
Game logo artwork with the words "TIPPING POINT" in chunky hand-lettered cartoon type, tilted as if about to fall over, the letter O replaced by a small Earth with flames on the left side. Transparent background.
```

**G3. UI-blad** — `ui.png`, 1536x1024, transparant
```
Game UI kit sheet in a carved wood and leaf style: large button (normal and pressed), small round button, wide panel frame, narrow panel frame, progress bar frame with separate fill, round portrait frame, first-second-third-fourth place badges as shapes with numerals 1 2 3 4, a star, a padlock. Separate pieces with clear gaps. Transparent background.
```

**G4. Portretten** — per dier 512x512, `portret_vos.png` enzovoort
```
Head-and-shoulders portrait of the same [DIER], three-quarter view, confident grin. Transparent background.
```

## Wat ik zelf maak in de engine

Vonken, rook, stof, spatwater, snelheidslijnen, de lichtgloed van het front en het touw van de grijphaak. Die hoeven dus niet van GPT te komen.

## Volgorde

Begin met A1 (vos), dan C1, D en F voor het bos, en daarna B. Met die set bouw ik het eerste gebied volledig af voordat de andere drie gebieden aan de beurt zijn.
