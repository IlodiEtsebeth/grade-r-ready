export type ChecklistStatus = "not_started" | "developing" | "mastered";

export type ChecklistItem = { id: string; label: string; hint: string };
export type ChecklistCategory = {
  id: string;
  name: string;
  tone: "sungold" | "aloe" | "ochre";
  items: ChecklistItem[];
};

export const CATEGORIES: ChecklistCategory[] = [
  {
    id: "social",
    name: "Social & emotional",
    tone: "sungold",
    items: [
      { id: "social-1", label: "Separates from parent with confidence", hint: "Drop-off at school" },
      { id: "social-2", label: "Plays and shares with other children", hint: "Playdates, park" },
      { id: "social-3", label: "Waits for a turn", hint: "Games at home" },
      { id: "social-4", label: "Talks about how they feel", hint: "Happy, sad, cross" },
      { id: "social-5", label: "Asks a grown-up for help", hint: "When stuck" },
      { id: "social-6", label: "Sits still for a short story", hint: "About 10 minutes" },
    ],
  },
  {
    id: "language",
    name: "Language & early literacy",
    tone: "aloe",
    items: [
      { id: "lang-1", label: "Follows 2-step instructions", hint: "Fetch your shoes and sit down" },
      { id: "lang-2", label: "Recognises own name", hint: "On a lunchbox or page" },
      { id: "lang-3", label: "Tells a short story in order", hint: "What happened today" },
      { id: "lang-4", label: "Hears rhyming words", hint: "Cat, hat, mat" },
      { id: "lang-5", label: "Knows some letter sounds", hint: "Starts with 'b'" },
      { id: "lang-6", label: "Holds a book the right way and turns pages", hint: "Story time" },
      { id: "lang-7", label: "Tries to write own name", hint: "Even if wobbly" },
    ],
  },
  {
    id: "numeracy",
    name: "Early numeracy",
    tone: "ochre",
    items: [
      { id: "num-1", label: "Counts objects up to 10", hint: "Snacks, blocks" },
      { id: "num-2", label: "Recognises numbers 1 to 10", hint: "On a page" },
      { id: "num-3", label: "Sorts objects by colour or size", hint: "Beads, socks" },
      { id: "num-4", label: "Copies a simple pattern", hint: "Red, blue, red, blue" },
      { id: "num-5", label: "Knows basic shapes", hint: "Circle, square, triangle" },
      { id: "num-6", label: "Understands more, less and same", hint: "Sharing snacks" },
    ],
  },
  {
    id: "motor",
    name: "Motor skills",
    tone: "sungold",
    items: [
      { id: "motor-1", label: "Holds a pencil or crayon correctly", hint: "Between fingers" },
      { id: "motor-2", label: "Uses scissors to cut along a line", hint: "With supervision" },
      { id: "motor-3", label: "Draws a person with head, body and legs", hint: "Family picture" },
      { id: "motor-4", label: "Catches and throws a ball", hint: "Outside play" },
      { id: "motor-5", label: "Hops on one foot and balances", hint: "Short games" },
      { id: "motor-6", label: "Threads beads or buttons", hint: "Fine motor practice" },
    ],
  },
  {
    id: "independence",
    name: "Independence & routines",
    tone: "aloe",
    items: [
      { id: "ind-1", label: "Washes hands and uses the toilet on their own", hint: "Daily routine" },
      { id: "ind-2", label: "Packs away toys", hint: "After playing" },
      { id: "ind-3", label: "Dresses and puts on shoes", hint: "Buttons and velcro" },
      { id: "ind-4", label: "Opens own lunchbox and eats on their own", hint: "Lunch time" },
      { id: "ind-5", label: "Looks after own bag and jersey", hint: "Coming home" },
      { id: "ind-6", label: "Follows a morning routine", hint: "Wake, dress, eat" },
    ],
  },
];

export const ALL_ITEMS = CATEGORIES.flatMap((c) =>
  c.items.map((i) => ({ ...i, categoryId: c.id, categoryName: c.name })),
);

export type Activity = { id: string; title: string; detail: string; minutes: number; skill: string };
export type ActivityWeek = { week: number; theme: string; activities: Activity[] };

export const WEEKS: ActivityWeek[] = [
  {
    week: 1,
    theme: "Listening and looking",
    activities: [
      { id: "w1-a1", title: "Read a short story together", detail: "Read a picture book, then ask who, what and where questions.", minutes: 15, skill: "Language" },
      { id: "w1-a2", title: "Count the snacks", detail: "Count out 10 snacks or blocks together, then take some away and count again.", minutes: 10, skill: "Numeracy" },
      { id: "w1-a3", title: "Two-step instruction game", detail: "Give playful two-step instructions like 'hop twice and touch your nose'.", minutes: 10, skill: "Listening" },
    ],
  },
  {
    week: 2,
    theme: "Name and letters",
    activities: [
      { id: "w2-a1", title: "Trace your name", detail: "Write your child's name in dots and let them trace over it three times.", minutes: 10, skill: "Writing" },
      { id: "w2-a2", title: "Name hunt", detail: "Look for the first letter of their name on packets, signs and books.", minutes: 10, skill: "Literacy" },
      { id: "w2-a3", title: "Rhyme time", detail: "Say a word and take turns finding words that rhyme with it.", minutes: 10, skill: "Language" },
    ],
  },
  {
    week: 3,
    theme: "Cutting and colouring",
    activities: [
      { id: "w3-a1", title: "Cut along the lines", detail: "Draw straight and wavy lines on paper for your child to cut along.", minutes: 15, skill: "Motor" },
      { id: "w3-a2", title: "Colour inside the shape", detail: "Draw big shapes and colour them in without going over the lines.", minutes: 10, skill: "Motor" },
      { id: "w3-a3", title: "Shape hunt at home", detail: "Find circles, squares and triangles around the house.", minutes: 10, skill: "Numeracy" },
    ],
  },
  {
    week: 4,
    theme: "Sorting and patterns",
    activities: [
      { id: "w4-a1", title: "Sort the washing", detail: "Sort socks or blocks by colour, then by size.", minutes: 10, skill: "Numeracy" },
      { id: "w4-a2", title: "Copy my pattern", detail: "Make a bead or block pattern and ask your child to copy it.", minutes: 10, skill: "Numeracy" },
      { id: "w4-a3", title: "Story of my day", detail: "Ask your child to tell you three things that happened, in order.", minutes: 10, skill: "Language" },
    ],
  },
  {
    week: 5,
    theme: "School routines",
    activities: [
      { id: "w5-a1", title: "Play school", detail: "Role-play the school day: bell, sitting on the mat, packing away.", minutes: 15, skill: "Social" },
      { id: "w5-a2", title: "Pack my own bag", detail: "Let your child pack and carry their bag on their own.", minutes: 10, skill: "Independence" },
      { id: "w5-a3", title: "Lunchbox practice", detail: "Practise opening the lunchbox and bottle without help.", minutes: 10, skill: "Independence" },
    ],
  },
  {
    week: 6,
    theme: "Numbers everywhere",
    activities: [
      { id: "w6-a1", title: "Number spotting", detail: "Look for numbers 1 to 10 on doors, cars and packets.", minutes: 10, skill: "Numeracy" },
      { id: "w6-a2", title: "More, less or same", detail: "Share snacks into two piles and ask which has more.", minutes: 10, skill: "Numeracy" },
      { id: "w6-a3", title: "Count and jump", detail: "Count out loud while jumping, clapping or stamping.", minutes: 10, skill: "Motor" },
    ],
  },
  {
    week: 7,
    theme: "Talking and feelings",
    activities: [
      { id: "w7-a1", title: "Feelings faces", detail: "Draw happy, sad and cross faces and talk about when we feel them.", minutes: 10, skill: "Social" },
      { id: "w7-a2", title: "Take turns game", detail: "Play a simple board or card game and practise waiting for a turn.", minutes: 15, skill: "Social" },
      { id: "w7-a3", title: "Story questions", detail: "Read a story and ask what your child thinks happens next.", minutes: 10, skill: "Language" },
    ],
  },
  {
    week: 8,
    theme: "Hands and fingers",
    activities: [
      { id: "w8-a1", title: "Thread the beads", detail: "Thread beads, pasta or buttons onto string.", minutes: 10, skill: "Motor" },
      { id: "w8-a2", title: "Pencil grip practice", detail: "Draw a family picture, checking the pencil grip stays comfortable.", minutes: 10, skill: "Motor" },
      { id: "w8-a3", title: "Tear and paste", detail: "Tear paper into small pieces and paste them into a picture.", minutes: 15, skill: "Motor" },
    ],
  },
  {
    week: 9,
    theme: "Letter sounds",
    activities: [
      { id: "w9-a1", title: "Sound of the day", detail: "Pick one letter sound and find three things that start with it.", minutes: 10, skill: "Literacy" },
      { id: "w9-a2", title: "Clap the syllables", detail: "Clap out the parts of family names and food words.", minutes: 10, skill: "Literacy" },
      { id: "w9-a3", title: "Write it in sand", detail: "Write letters in sand, flour or on a steamy window.", minutes: 10, skill: "Writing" },
    ],
  },
  {
    week: 10,
    theme: "Getting ready alone",
    activities: [
      { id: "w10-a1", title: "Dress myself race", detail: "Time your child getting dressed and putting on shoes.", minutes: 10, skill: "Independence" },
      { id: "w10-a2", title: "Bathroom on my own", detail: "Practise the full routine: toilet, flush, wash and dry hands.", minutes: 10, skill: "Independence" },
      { id: "w10-a3", title: "Pack away timer", detail: "Set a 5 minute timer and pack away all toys together.", minutes: 10, skill: "Independence" },
    ],
  },
  {
    week: 11,
    theme: "Putting it together",
    activities: [
      { id: "w11-a1", title: "Write my whole name", detail: "Write the full name without tracing, then celebrate the attempt.", minutes: 10, skill: "Writing" },
      { id: "w11-a2", title: "Count to 20", detail: "Count objects past 10 and see how far your child can go.", minutes: 10, skill: "Numeracy" },
      { id: "w11-a3", title: "Retell the story", detail: "Read a story, then let your child retell it in their own words.", minutes: 15, skill: "Language" },
    ],
  },
  {
    week: 12,
    theme: "Ready for Grade 1",
    activities: [
      { id: "w12-a1", title: "Big school talk", detail: "Talk about what Grade 1 will be like and answer any worries.", minutes: 10, skill: "Social" },
      { id: "w12-a2", title: "Full morning practice", detail: "Do a full morning routine on their own: dress, eat, pack, go.", minutes: 15, skill: "Independence" },
      { id: "w12-a3", title: "Show what I can do", detail: "Let your child show off name writing, counting and cutting.", minutes: 15, skill: "Review" },
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

export function readinessLabel(score: number) {
  if (score >= 80) return "Ready";
  if (score >= 45) return "Developing";
  return "Needs support";
}

/** Week 1 starts the Monday of the week the parent joined; capped at 12. */
export function currentWeek(startDate: string | null | undefined) {
  if (!startDate) return 1;
  const start = new Date(startDate);
  const diffDays = Math.floor((Date.now() - start.getTime()) / 86400000);
  return Math.min(12, Math.max(1, Math.floor(diffDays / 7) + 1));
}

export const STATUS_LABEL: Record<ChecklistStatus, string> = {
  not_started: "Not started",
  developing: "Developing",
  mastered: "Mastered",
};
