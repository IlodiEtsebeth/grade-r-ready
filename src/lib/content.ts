// Bilingual checklist & activity content, generated from the approved
// translation review spreadsheet. `en`/`af` pairs are looked up via the
// current language from LanguageProvider; see src/lib/language.tsx.

export type ChecklistStatus = "not_started" | "developing" | "mastered";

type Bi = { en: string; af: string };

export type ChecklistItem = { id: string; label: Bi; hint: Bi };
export type ChecklistCategory = {
  id: string;
  name: Bi;
  tone: "sungold" | "aloe" | "ochre";
  items: ChecklistItem[];
};

export const CATEGORIES: ChecklistCategory[] = [
  {
    id: "social",
    name: { en: "Social & emotional", af: "Sosiale & Emosionele Vaardighede" },
    tone: "sungold",
    items: [
      {
        id: "social-1",
        label: {
          en: "Separates from parent with confidence",
          af: "Skei met selfvertroue van ouers",
        },
        hint: {
          en: "Drop-off at school",
          af: "Kan maklik skei van ouers wanneer afgelaai word by die skool",
        },
      },
      {
        id: "social-2",
        label: { en: "Plays and shares with other children", af: "Speel en deel met ander maats" },
        hint: { en: "Playdates, park", af: "Kan maklik ander maats benader" },
      },
      {
        id: "social-3",
        label: { en: "Waits for a turn", af: "Wag vir 'n beurt" },
        hint: {
          en: "Games at home",
          af: "Kan beurt afwag wanneer dit kom by speletjies by die huis, of wanneer ek my beurt moet wag om te praat.",
        },
      },
      {
        id: "social-4",
        label: { en: "Talks about how they feel", af: "Praat oor hoe hulle voel" },
        hint: { en: "Happy, sad, cross", af: "Bly, hartseer, kwaad" },
      },
      {
        id: "social-5",
        label: { en: "Asks a grown-up for help", af: "Vra 'n grootmens vir hulp" },
        hint: { en: "When stuck", af: "Kan vir hulp vra wanneer hulle sukkel met 'n taak." },
      },
      {
        id: "social-6",
        label: { en: "Sits still for a short story", af: "Stil sit vir 'n kort storie" },
        hint: { en: "About 10 minutes", af: "Omtrent 10 minute" },
      },
    ],
  },
  {
    id: "language",
    name: { en: "Language & early literacy", af: "Taal en Vroeë geletterdheid" },
    tone: "aloe",
    items: [
      {
        id: "lang-1",
        label: { en: "Follows 2-step instructions", af: "Volg 2-stap-instruksies" },
        hint: { en: "Fetch your shoes and sit down", af: "Gaan haal jou skoene en sit op die mat" },
      },
      {
        id: "lang-2",
        label: { en: "Recognises own name", af: "Herken eie naam" },
        hint: { en: "On a lunchbox or page", af: "Op 'n kosblik of bladsy" },
      },
      {
        id: "lang-3",
        label: { en: "Tells a short story in order", af: "Vertel 'n kort storie in volgorde" },
        hint: { en: "What happened today", af: "Wat vandag gebeur het by die skool" },
      },
      {
        id: "lang-4",
        label: { en: "Hears rhyming words", af: "Kan rymwoorde uitken" },
        hint: { en: "Cat, hat, mat", af: "kat, mat, vat" },
      },
      {
        id: "lang-5",
        label: { en: "Knows some letter sounds", af: "Kan sommige beginklanke uitken" },
        hint: { en: "Starts with 's'", af: "Herken of hoor die eerste klanke van woorde" },
      },
      {
        id: "lang-6",
        label: {
          en: "Holds a book the right way and turns pages",
          af: "Hou 'n boek reg vas en kan blaai van voor na agter",
        },
        hint: {
          en: "Story time",
          af: "Watter kant van die boek is bo, Kyk na prente van links na regs",
        },
      },
      {
        id: "lang-7",
        label: { en: "Tries to write own name", af: "Probeer eie naam skryf" },
        hint: { en: "Even if wobbly", af: "Al is dit bewerig" },
      },
    ],
  },
  {
    id: "numeracy",
    name: { en: "Early numeracy", af: "Getalbegrip" },
    tone: "ochre",
    items: [
      {
        id: "num-1",
        label: {
          en: "Counts objects up to 10",
          af: "Kan my vinger gebruik om 10 voorwerpe te tel",
        },
        hint: { en: "Snacks, blocks", af: "Blokkies, lekkergoed of speelgoed" },
      },
      {
        id: "num-2",
        label: { en: "Recognises numbers 1 to 10", af: "Herken getalsimbole van 1 tot 10" },
        hint: { en: "On a page", af: "Op 'n bladsy of in 'n boek" },
      },
      {
        id: "num-3",
        label: {
          en: "Sorts objects by colour or size",
          af: "Sorteer voorwerpe volgens kleur of grootte",
        },
        hint: { en: "Beads, socks", af: "Krale, sokkies of blokkies" },
      },
      {
        id: "num-4",
        label: { en: "Copies a simple pattern", af: "Kan vorm en kleurpatrone uitbrei en kopieer" },
        hint: {
          en: "Red, blue, red, blue",
          af: "Rooi, blou, rooi, blou - Patrone is baie belangrik vir wanneer ek begin lees",
        },
      },
      {
        id: "num-5",
        label: { en: "Knows basic shapes", af: "Ken basiese vorms" },
        hint: { en: "Circle, square, triangle", af: "Sirkel, vierkant, driehoek, reghoek" },
      },
      {
        id: "num-6",
        label: { en: "Understands more, less and same", af: "Verstaan meer, minder en dieselfde" },
        hint: {
          en: "Sharing snacks",
          af: 'Deel van peuselhappies, maak gebruik van woorde soos " Ek het meer ", "Ons het dieselfde" , "Ek het minder"',
        },
      },
    ],
  },
  {
    id: "motor",
    name: { en: "Motor skills", af: "Motoriese vaardighede" },
    tone: "sungold",
    items: [
      {
        id: "motor-1",
        label: { en: "Holds a pencil or crayon correctly", af: "Hou 'n potlood of kryt reg vas " },
        hint: {
          en: "Between fingers",
          af: "Knyp die potlood liggies vas tussen jou duim en wysvinger, en laat dit gemaklik op die kant van jou middelvinger rus",
        },
      },
      {
        id: "motor-2",
        label: {
          en: "Uses scissors to cut along a line",
          af: "Gebruik 'n skêr om langs 'n lyn te sny",
        },
        hint: { en: "With supervision", af: "Duim wys na bo terwyl skêr oop en toemaak." },
      },
      {
        id: "motor-3",
        label: {
          en: "Draws a person with head, body and legs",
          af: "Teken 'n persoon met kop, lyf, arms en bene",
        },
        hint: {
          en: "Family picture",
          af: "Prentjies begin baie meer detail kry en gee graag kleur aan my tekeninge",
        },
      },
      {
        id: "motor-4",
        label: { en: "Catches and throws a ball", af: "Vang en gooi 'n bal" },
        hint: { en: "Outside play", af: "Buitespel" },
      },
      {
        id: "motor-5",
        label: { en: "Hops on one foot and balances", af: "Hop op een voet en balanseer" },
        hint: { en: "Short games", af: "Kort speletjies" },
      },
      {
        id: "motor-6",
        label: { en: "Threads beads or buttons", af: "Ryg krale of knope" },
        hint: { en: "Fine motor practice", af: "Gebruik albei hande " },
      },
    ],
  },
  {
    id: "independence",
    name: { en: "Independence & routines", af: "Selfstandigheid en Roetines" },
    tone: "aloe",
    items: [
      {
        id: "ind-1",
        label: {
          en: "Washes hands and uses the toilet on their own",
          af: "Was hande en gebruik die toilet op my eie",
        },
        hint: { en: "Daily routine", af: "Daaglikse roetine" },
      },
      {
        id: "ind-2",
        label: { en: "Packs away toys", af: "Pak speelgoed weg" },
        hint: { en: "After playing", af: "Na speeltyd" },
      },
      {
        id: "ind-3",
        label: {
          en: "Dresses and puts on shoes",
          af: "Kan self aantrek en verskeie take vir myself doen",
        },
        hint: { en: "Buttons and velcro", af: "Knope vasmaak, skoene aantrek" },
      },
      {
        id: "ind-4",
        label: {
          en: "Opens own lunchbox and eats on their own",
          af: "Maak eie kosblik oop en toe",
        },
        hint: { en: "Lunch time", af: "Etenstyd" },
      },
      {
        id: "ind-5",
        label: { en: "Looks after own bag and jersey", af: "Pas persoonlike besittings op" },
        hint: { en: "Coming home", af: "Skooltas, kosblik, bottels of klere" },
      },
      {
        id: "ind-6",
        label: { en: "Follows a morning routine", af: "Volg 'n oggendroetine" },
        hint: { en: "Wake, dress, eat", af: "Word wakker, trek aan, eet" },
      },
    ],
  },
];

export const ALL_ITEMS = CATEGORIES.flatMap((c) =>
  c.items.map((i) => ({ ...i, categoryId: c.id, categoryName: c.name })),
);

export type Activity = { id: string; title: Bi; detail: Bi; minutes: number; skill: Bi };
export type ActivityWeek = { week: number; theme: Bi; activities: Activity[] };

export const WEEKS: ActivityWeek[] = [
  {
    week: 1,
    theme: { en: "Listening and looking", af: "Luister en Praat" },
    activities: [
      {
        id: "w1-a1",
        title: { en: "Read a short story together", af: "Lees saam 'n kort storie" },
        detail: {
          en: "Read a picture book, then ask who, what and where questions.",
          af: "Lees 'n prenteboek en vra dan wie-, wat- en waar-vrae.",
        },
        minutes: 15,
        skill: { en: "Language", af: "Taal" },
      },
      {
        id: "w1-a2",
        title: { en: "Count the snacks", af: "Tel die peuselhappies" },
        detail: {
          en: "Count out 10 snacks or blocks together, then take some away and count again.",
          af: "Tel saam 10 peuselhappies of blokkies uit, vat 3 weg en tel weer. ",
        },
        minutes: 10,
        skill: { en: "Numeracy", af: "Getalbegrip" },
      },
      {
        id: "w1-a3",
        title: { en: "Two-step instruction game", af: "Geluidspatrone" },
        detail: {
          en: "Give playful two-step instructions like 'hop twice and touch your nose'.",
          af: "Klap hande 3 keer en vra kind moet die naboots. Hierdie patrone kan moeiliker gemaak word soos wat kind ontwikkel",
        },
        minutes: 10,
        skill: { en: "Listening", af: "Luistervaardighede" },
      },
    ],
  },
  {
    week: 2,
    theme: { en: "Name and letters", af: "Naam en Klanke" },
    activities: [
      {
        id: "w2-a1",
        title: { en: "Trace your name", af: "Skryf oor jou naam" },
        detail: {
          en: "Write your child's name in dots and let them trace over it three times.",
          af: "Skryf jou kind se naam in stippellyntjies en laat hulle dit drie keer oortrek.",
        },
        minutes: 10,
        skill: { en: "Writing", af: "Skryfwerk" },
      },
      {
        id: "w2-a2",
        title: { en: "Name hunt", af: "Beginklank van naam" },
        detail: {
          en: "Look for the first letter of their name on packets, signs and books.",
          af: "Soek na die eerste letter van hulle naam op pakkies, tekens en boeke.",
        },
        minutes: 10,
        skill: { en: "Literacy", af: "Geletterdheid" },
      },
      {
        id: "w2-a3",
        title: { en: "Rhyme time", af: "Rympies" },
        detail: {
          en: "Say a word and take turns finding words that rhyme with it.",
          af: "Sê 'n woord en neem beurte om woorde te vind wat daarmee rym.( kat-vat, dak-rak, muis-huis, das-kas )",
        },
        minutes: 10,
        skill: { en: "Language", af: "Taal" },
      },
    ],
  },
  {
    week: 3,
    theme: { en: "Cutting and colouring", af: "Knip en kleure" },
    activities: [
      {
        id: "w3-a1",
        title: { en: "Cut along the lines", af: "Knip op die lyn" },
        detail: {
          en: "Draw straight and wavy lines on paper for your child to cut along.",
          af: "Teken reguit en gegolfde lyne op papier vir jou kind om te knip.",
        },
        minutes: 15,
        skill: { en: "Motor", af: "Motories" },
      },
      {
        id: "w3-a2",
        title: { en: "Colour inside the shape", af: "Kleur binne die vorm" },
        detail: {
          en: "Draw big shapes and colour them in without going over the lines.",
          af: "Teken groot vorms en kleur dit in sonder om oor die lyne te gaan.",
        },
        minutes: 10,
        skill: { en: "Motor", af: "Motories" },
      },
      {
        id: "w3-a3",
        title: { en: "Shape hunt at home", af: "Vormsoektog by die huis" },
        detail: {
          en: "Find circles, squares and triangles around the house.",
          af: "Soek sirkels, vierkante, reghoeke en driehoeke rondom die huis en gesels oor hoe elkeen lyk.",
        },
        minutes: 10,
        skill: { en: "Numeracy", af: "Vorms" },
      },
    ],
  },
  {
    week: 4,
    theme: { en: "Sorting and patterns", af: "Sortering en patrone" },
    activities: [
      {
        id: "w4-a1",
        title: { en: "Sort the washing", af: "Sorteer die wasgoed" },
        detail: {
          en: "Sort socks or blocks by colour, then by size.",
          af: "Sorteer sokkies of blokkies volgens kleur, dan volgens grootte.",
        },
        minutes: 10,
        skill: { en: "Numeracy", af: "Syfervaardigheid" },
      },
      {
        id: "w4-a2",
        title: { en: "Copy my pattern", af: "Kopieer my patroon" },
        detail: {
          en: "Make a bead or block pattern and ask your child to copy it.",
          af: "Maak 'n kraal- of blokkiespatroon en vra jou kind om dit te kopieer.",
        },
        minutes: 10,
        skill: { en: "Numeracy", af: "Syfervaardigheid" },
      },
      {
        id: "w4-a3",
        title: { en: "Story of my day", af: "Storie van my dag" },
        detail: {
          en: "Ask your child to tell you three things that happened, in order.",
          af: "Vra jou kind om drie dinge te vertel wat gebeur het, in volgorde.",
        },
        minutes: 10,
        skill: { en: "Language", af: "Taal" },
      },
    ],
  },
  {
    week: 5,
    theme: { en: "School routines", af: "Skoolroetines" },
    activities: [
      {
        id: "w5-a1",
        title: { en: "Play school", af: "Speel skool " },
        detail: {
          en: "Role-play the school day: bell, sitting on the mat, packing away.",
          af: "Rolspeel die skooldag: die klok lui, sit op die mat, eet tyd, opruim tyd, storie tyd.",
        },
        minutes: 15,
        skill: { en: "Social", af: "Sosiaal" },
      },
      {
        id: "w5-a2",
        title: { en: "Pack my own bag", af: "Pak my eie tas" },
        detail: {
          en: "Let your child pack and carry their bag on their own.",
          af: "Laat jou kind self hulle tas pak en dra.",
        },
        minutes: 10,
        skill: { en: "Independence", af: "Selfstandigheid" },
      },
      {
        id: "w5-a3",
        title: { en: "Lunchbox practice", af: "Kosblik-oefening" },
        detail: {
          en: "Practise opening the lunchbox and bottle without help.",
          af: "Oefen om die kosblik en bottel sonder hulp oop te maak en toe te maak.",
        },
        minutes: 10,
        skill: { en: "Independence", af: "Selfstandigheid" },
      },
    ],
  },
  {
    week: 6,
    theme: { en: "Numbers everywhere", af: "Syfers" },
    activities: [
      {
        id: "w6-a1",
        title: { en: "Number spotting", af: "Syfers soektog" },
        detail: {
          en: "Look for numbers 1 to 10 on doors, cars and packets.",
          af: "Soek syfers 1 tot 10 op deure, karre en pakkies. ",
        },
        minutes: 10,
        skill: { en: "Numeracy", af: "Syfervaardigheid" },
      },
      {
        id: "w6-a2",
        title: { en: "More, less or same", af: "Meer, minder of dieselfde" },
        detail: {
          en: "Share snacks into two piles and ask which has more.",
          af: 'Deel 10 lekkergoed in 3 bakkies, vra vrae soos "watter bakkie het meer?", "Watter bakkie het die minste?" "Hoe kan ons dit deel dat ek en jy dieselfde het?"',
        },
        minutes: 10,
        skill: { en: "Numeracy", af: "Syfervaardigheid" },
      },
      {
        id: "w6-a3",
        title: { en: "Count and jump", af: "Tel en spring" },
        detail: {
          en: "Count out loud while jumping, clapping or stamping.",
          af: "Tel hardop terwyl jy spring, klap of voete stamp. Tel vorentoe en agtertoe.",
        },
        minutes: 10,
        skill: { en: "Motor", af: "Motories" },
      },
    ],
  },
  {
    week: 7,
    theme: { en: "Talking and feelings", af: "Gevoelens & Emosies" },
    activities: [
      {
        id: "w7-a1",
        title: { en: "Feelings faces", af: "My emosies" },
        detail: {
          en: "Draw happy, sad and cross faces and talk about when we feel them.",
          af: "Teken bly, hartseer en kwaad gesigte en praat oor wanneer ons dit voel, en ook wat ons kan doen as ons kwaad of hartseer voel.",
        },
        minutes: 10,
        skill: { en: "Social", af: "Sosiaal" },
      },
      {
        id: "w7-a2",
        title: { en: "Take turns game", af: "Ek kan my beurt wag" },
        detail: {
          en: "Play a simple board or card game and practise waiting for a turn.",
          af: "Speel 'n eenvoudige bord- of kaartspeletjie en oefen om vir 'n beurt te wag.",
        },
        minutes: 15,
        skill: { en: "Social", af: "Sosiaal" },
      },
      {
        id: "w7-a3",
        title: { en: "Story questions", af: "Storievrae" },
        detail: {
          en: "Read a story and ask what your child thinks happens next.",
          af: "Lees 'n storie en vra wat jou kind dink volgende gaan gebeur, vra ook vrae van hoe die karakters voel in die storie bv. bly, bang, kwaad of skaam",
        },
        minutes: 10,
        skill: { en: "Language", af: "Taal" },
      },
    ],
  },
  {
    week: 8,
    theme: { en: "Hands and fingers", af: "Handjies en vingertjies" },
    activities: [
      {
        id: "w8-a1",
        title: { en: "Thread the beads", af: "Ryg van krale" },
        detail: {
          en: "Thread beads, pasta or buttons onto string.",
          af: "Ryg krale, pasta of knope met tou, wol of skoenveters.",
        },
        minutes: 10,
        skill: { en: "Motor", af: "Motories" },
      },
      {
        id: "w8-a2",
        title: { en: "Pencil grip practice", af: "Potloodgreep-oefening" },
        detail: {
          en: "Draw a family picture, checking the pencil grip stays comfortable.",
          af: "Teken 'n gesinsprentjie en let op dat die potloodgreep gemaklik bly.( Lyfie sit regop, en gebruik nie skouer of arm om mee te teken of skryf nie)",
        },
        minutes: 10,
        skill: { en: "Motor", af: "Motories" },
      },
      {
        id: "w8-a3",
        title: { en: "Tear and paste", af: "Skeur en plak" },
        detail: {
          en: "Tear paper into small pieces and paste them into a picture.",
          af: "Skeur papier in klein stukkies en plak dit in 'n prentjie.",
        },
        minutes: 15,
        skill: { en: "Motor", af: "Motories" },
      },
    ],
  },
  {
    week: 9,
    theme: { en: "First sounds", af: "Eerste klanke" },
    activities: [
      {
        id: "w9-a1",
        title: { en: "Sound of the day", af: "Klank van die dag" },
        detail: {
          en: "This week's sounds are s, a, t, i, p, n — the first sounds taught in Grade R. Pick one each day and find three things that start with it.",
          af: "Hierdie week se klanke is kort klinkers a, e, o, i, u.  Kies elke dag een en soek drie dinge wat daarmee begin.",
        },
        minutes: 10,
        skill: { en: "Literacy", af: "Geletterdheid" },
      },
      {
        id: "w9-a2",
        title: { en: "Clap the syllables", af: "Klap die lettergrepe" },
        detail: {
          en: "Clap out the parts of family names and food words.",
          af: 'Klap die lettergrepe van gesinsname en kosname uit.("mam-ma" - 2 lettergrepe, "ta-ma-tie" - 3 lettergrepe)',
        },
        minutes: 10,
        skill: { en: "Literacy", af: "Geletterdheid" },
      },
      {
        id: "w9-a3",
        title: { en: "Write it in sand", af: "Skryf in die sand" },
        detail: {
          en: "Write the letters s, a, t, i, p, n in sand, flour or on a steamy window.",
          af: "Skryf die kort klinkers a, e, o, i, u in sand of meel.",
        },
        minutes: 10,
        skill: { en: "Writing", af: "Skryfwerk" },
      },
      {
        id: "w9-a4",
        title: { en: "Build a word", af: "Skryf en teken" },
        detail: {
          en: "Using only s, a, t, i, p, n, say a simple word out loud — like sat, tap, pin or nap — and help your child sound it out and find the matching letters.",
          af: "Gebruik die 5 kort klinkers en skryf saam 'n woord neer en vra kind om bypassende prent te teken bv. a-appel, e- emmer, o-olifant, u-uil, i-ink. (Klinkers kan ook in die middel van 'n 3-letter woord wees)",
        },
        minutes: 10,
        skill: { en: "Literacy", af: "Geletterdheid" },
      },
    ],
  },
  {
    week: 10,
    theme: { en: "Getting ready alone", af: "Ek kan dit alleen doen" },
    activities: [
      {
        id: "w10-a1",
        title: { en: "Dress myself race", af: "Aantrek kompetisie" },
        detail: {
          en: "Time your child getting dressed and putting on shoes.",
          af: "Hou tyd terwyl jou kind aantrek en skoene aansit.",
        },
        minutes: 10,
        skill: { en: "Independence", af: "Selfstandigheid" },
      },
      {
        id: "w10-a2",
        title: { en: "Bathroom on my own", af: "Badkamer roetine" },
        detail: {
          en: "Practise the full routine: toilet, flush, wash and dry hands.",
          af: "Oefen die volledige roetine: toilet, spoel, was en droog hande.",
        },
        minutes: 10,
        skill: { en: "Independence", af: "Selfstandigheid" },
      },
      {
        id: "w10-a3",
        title: { en: "Pack away timer", af: "Opruim-tydhouer" },
        detail: {
          en: "Set a 5 minute timer and pack away all toys together.",
          af: "Stel 'n 5-minuut-tydhouer en pak saam al die speelgoed weg.",
        },
        minutes: 10,
        skill: { en: "Independence", af: "Selfstandigheid" },
      },
    ],
  },
  {
    week: 11,
    theme: { en: "Putting it together", af: "Ek kan die volgende doen" },
    activities: [
      {
        id: "w11-a1",
        title: { en: "Write my whole name", af: "Skryf my hele naam" },
        detail: {
          en: "Write the full name without tracing, then celebrate the attempt.",
          af: "Skryf my volle naam sonder sukkel",
        },
        minutes: 10,
        skill: { en: "Writing", af: "Skryfwerk" },
      },
      {
        id: "w11-a2",
        title: { en: "Count to 20", af: "Tel tot 20 of verder" },
        detail: {
          en: "Count objects past 10 and see how far your child can go.",
          af: "Tel voorwerpe verby 10 en kyk hoe ver jou kind kan gaan.",
        },
        minutes: 10,
        skill: { en: "Numeracy", af: "Syfervaardigheid" },
      },
      {
        id: "w11-a3",
        title: { en: "Retell the story", af: "Ek kan 'n storie oor vertel" },
        detail: {
          en: "Read a story, then let your child retell it in their own words.",
          af: "Lees 'n storie en laat jou kind dit dan in hulle eie woorde weer vertel.",
        },
        minutes: 15,
        skill: { en: "Language", af: "Taal" },
      },
    ],
  },
  {
    week: 12,
    theme: { en: "Ready for Grade 1", af: "Gereed vir Graad 1" },
    activities: [
      {
        id: "w12-a1",
        title: { en: "Big school talk", af: "Gesels oor Graad 1" },
        detail: {
          en: "Talk about what Grade 1 will be like and answer any worries.",
          af: "Gesels oor hoe Graad 1 gaan wees en beantwoord enige bekommernisse. ",
        },
        minutes: 10,
        skill: { en: "Social", af: "Sosiaal" },
      },
      {
        id: "w12-a2",
        title: { en: "Full morning practice", af: "Volledige oggendroetine" },
        detail: {
          en: "Do a full morning routine on their own: dress, eat, pack, go.",
          af: "Doen 'n volledige oggendroetine: eet, aantrek, tandeborsel, hare kam en gesig was, pak tas. (Berei jou kind voor vir hoe die oggenroetine gaan werk.)",
        },
        minutes: 15,
        skill: { en: "Independence", af: "Selfstandigheid" },
      },
      {
        id: "w12-a3",
        title: { en: "Show what I can do", af: "Wys wat ek kan doen" },
        detail: {
          en: "Let your child show off name writing, counting and cutting.",
          af: "Laat jou kind wys hoe hulle naam skryf, tel en knip. ",
        },
        minutes: 15,
        skill: { en: "Review", af: "Hersiening" },
      },
    ],
  },
];

export const ALL_ACTIVITIES = WEEKS.flatMap((w) =>
  w.activities.map((a) => ({ ...a, week: w.week })),
);

export const TOTAL_ITEMS = ALL_ITEMS.length;
export const TOTAL_ACTIVITIES = ALL_ACTIVITIES.length;

export function readinessScore(statuses: Record<string, ChecklistStatus>) {
  let points = 0;
  for (const item of ALL_ITEMS) {
    const s = statuses[item.id];
    if (s === "mastered") points += 1;
    else if (s === "developing") points += 0.5;
  }
  return Math.round((points / TOTAL_ITEMS) * 100);
}

export type ReadinessKey = "ready" | "developing" | "needs_support";

/** Stable key for the readiness band — use with `t("readiness.<key>", lang)` to display it. */
export function readinessKey(score: number): ReadinessKey {
  if (score >= 80) return "ready";
  if (score >= 45) return "developing";
  return "needs_support";
}

/** Week 1 starts the Monday of the week the parent joined; capped at 12. */
export function currentWeek(startDate: string | null | undefined) {
  if (!startDate) return 1;
  const start = new Date(startDate);
  const diffDays = Math.floor((Date.now() - start.getTime()) / 86400000);
  return Math.min(12, Math.max(1, Math.floor(diffDays / 7) + 1));
}
