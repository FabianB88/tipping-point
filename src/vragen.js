// Vragen voor de start van een run. Goed antwoord = power-up.
// v = vraag, a = antwoorden, goed = index van het juiste antwoord, uitleg = één zin na het antwoord.
window.VRAGEN = [
  {
    v: 'Wat is een kantelpunt in het klimaat?',
    a: ['Een drempel waarna een verandering zichzelf versterkt', 'De warmste dag van het jaar', 'Het moment dat de uitstoot daalt'],
    goed: 0,
    uitleg: 'Voorbij een kantelpunt gaat de verandering vanzelf door, ook als de oorzaak stopt.'
  },
  {
    v: 'Smeltend ijs maakt de aarde donkerder. Wat is het gevolg?',
    a: ['Er wordt meer zonlicht weerkaatst', 'Er wordt meer warmte opgenomen, dus smelt er nog meer', 'Het heeft geen effect op de temperatuur'],
    goed: 1,
    uitleg: 'Dit is een versterkende terugkoppeling: het gevolg maakt de oorzaak groter.'
  },
  {
    v: 'Hoeveel planetaire grenzen onderscheiden wetenschappers?',
    a: ['Drie', 'Negen', 'Twintig'],
    goed: 1,
    uitleg: 'Het zijn er negen, waaronder klimaat, biodiversiteit, stikstof en zoetwater.'
  },
  {
    v: 'Welke stap staat het hoogst op de R-ladder?',
    a: ['Recyclen', 'Repareren', 'Refuse: iets niet gebruiken of maken'],
    goed: 2,
    uitleg: 'Hoe hoger op de ladder, hoe minder grondstoffen: voorkomen gaat boven hergebruik, hergebruik boven recyclen.'
  },
  {
    v: 'Een bedrijf wil vergroenen, maar de concurrent niet. Wat is het dilemma?',
    a: ['Groen produceren is altijd goedkoper', 'Wie als eerste investeert heeft hogere kosten en kan klanten verliezen', 'Concurrenten mogen niet samenwerken aan duurzaamheid'],
    goed: 1,
    uitleg: 'Daarom helpen gelijke regels voor iedereen: dan verliest de koploper niet van de achterblijver.'
  },
  {
    v: 'Wat valt onder scope 3 van de CO2-uitstoot van een bedrijf?',
    a: ['De uitstoot van de eigen schoorsteen', 'De ingekochte stroom', 'De uitstoot in de keten: leveranciers en gebruik door klanten'],
    goed: 2,
    uitleg: 'Scope 3 is bij de meeste bedrijven veruit het grootste deel van de uitstoot.'
  },
  {
    v: 'Waarom kan een bosbrand de opwarming versterken?',
    a: ['Het bos stoot bij verbranding de opgeslagen CO2 weer uit', 'Rook koelt de aarde blijvend af', 'As maakt de bodem vruchtbaarder'],
    goed: 0,
    uitleg: 'Meer warmte geeft meer droogte en branden, en die branden geven weer meer CO2.'
  },
  {
    v: 'Wat is het rebound-effect?',
    a: ['Zuiniger apparaten leiden tot meer gebruik, waardoor de winst deels verdwijnt', 'CO2 die terugkaatst in de atmosfeer', 'Afval dat na recycling opnieuw afval wordt'],
    goed: 0,
    uitleg: 'Een zuinige auto rijdt goedkoper, dus rijden mensen er meer mee.'
  },
  {
    v: 'Wat is een koolstofbudget?',
    a: ['Het bedrag dat een land aan klimaatbeleid uitgeeft', 'De hoeveelheid CO2 die nog uitgestoten kan worden binnen een temperatuurgrens', 'De prijs van een ton CO2'],
    goed: 1,
    uitleg: 'Het budget raakt op: hoe later de uitstoot daalt, hoe steiler de daling moet zijn.'
  },
  {
    v: 'Waarom blijven gifstoffen als PFAS zo lang een probleem?',
    a: ['Ze breken in de natuur nauwelijks af en hopen zich op in de voedselketen', 'Ze verdampen binnen een paar dagen', 'Ze komen alleen in fabrieken voor'],
    goed: 0,
    uitleg: 'Elk dier hoger in de keten krijgt een hogere dosis binnen dan zijn prooi.'
  }
];

window.FEITEN = [
  'Bosbranden zijn van alle tijden, maar door hitte en droogte duurt het brandseizoen nu langer.',
  'Een bos dat vaak brandt, kan omslaan naar savanne. Dat is een kantelpunt: het komt niet vanzelf terug.',
  'Dieren kunnen vaak wel vluchten voor vuur, maar niet voor het verdwijnen van hun leefgebied daarna.',
  'Het grootste deel van de bosbranden wereldwijd wordt door mensen aangestoken of veroorzaakt.',
  'Gifstoffen in water en bodem verzwakken dieren al lang voordat een ramp hen bereikt.'
];
