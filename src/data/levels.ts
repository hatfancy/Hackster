import type { Level } from '../types/game';

/**
 * All 10 puzzle levels for HACK//BREAK.
 * Each level is carefully designed with unique mechanics,
 * unambiguous clues, and verified correct answers.
 */
export const LEVELS: Level[] = [
  // ═══════════════════════════════════════════════════════
  // LEVEL 1 — Caesar Cipher
  // Answer: ACCESS GRANTED
  // ═══════════════════════════════════════════════════════
  {
    id: 1,
    title: 'CIPHER GATE',
    subtitle: 'Caesar Cipher Decryption',
    briefing:
      "INCOMING TRANSMISSION — SECTOR 7\n\nAgent, we've intercepted a message from Helix Corp's external comm relay. It's scrambled using the oldest encryption known: the Caesar cipher. The metadata reveals the shift value. Your first mission starts now.",
    difficulty: 'Beginner',
    type: 'caesar-cipher',
    timeLimit: 120,
    baseScore: 500,
    xpReward: 100,
    objective: 'Decrypt the Caesar-cipher message and enter the hidden password.',
    instructions:
      'A Caesar cipher shifts each letter by a fixed number of positions in the alphabet. ' +
      'The intercepted message was shifted FORWARD by 3. To decode it, shift each letter BACK by 3. ' +
      'Numbers, spaces, and punctuation are unchanged.',
    clues: [
      'Ciphertext: DFFHVV JUDQWHG',
      'Shift value: 3 (shift each letter 3 positions backward in the alphabet)',
      'Example: D → A (D is 4th letter, 4−3=1=A)',
      'The decoded message is two words separated by a space.',
    ],
    answer: 'ACCESS GRANTED',
    hints: [
      {
        id: 1,
        text: 'Work letter by letter: D→A, F→C, F→C, H→E, V→S, V→S. That gives you the first word.',
        penaltySeconds: 15,
      },
      {
        id: 2,
        text: 'First word = ACCESS. Now decode JUDQWHG: J→G, U→R, D→A, Q→N, W→T, H→E, G→D.',
        penaltySeconds: 15,
      },
      {
        id: 3,
        text: 'Full answer: ACCESS GRANTED',
        penaltySeconds: 15,
      },
    ],
    solutionExplanation:
      'Caesar shift −3: D→A, F→C, F→C, H→E, V→S, V→S = ACCESS. J→G, U→R, D→A, Q→N, W→T, H→E, G→D = GRANTED. Full answer: ACCESS GRANTED.',
  },

  // ═══════════════════════════════════════════════════════
  // LEVEL 2 — Riddle Password
  // Answer: MAP
  // ═══════════════════════════════════════════════════════
  {
    id: 2,
    title: 'RIDDLE LOCK',
    subtitle: 'Logic Riddle Password',
    briefing:
      "INCOMING TRANSMISSION — HELIX CORP INNER NET\n\nThe secondary lock protecting Helix Corp's employee directory isn't a cipher — it's a riddle. Their security team thought they were being clever. Let's prove them wrong.",
    difficulty: 'Easy',
    type: 'riddle',
    timeLimit: 110,
    baseScore: 600,
    xpReward: 150,
    objective: 'Solve the riddle to reveal the one-word secret password.',
    instructions:
      'Read the riddle carefully and enter the single-word answer. The answer is the password that unlocks the directory.',
    clues: [
      'RIDDLE: I have cities, but no houses live there.',
      'I have mountains, but no trees grow there.',
      'I have water, but no fish swim there.',
      'I have roads, but no cars drive there. What am I?',
    ],
    answer: 'MAP',
    hints: [
      {
        id: 1,
        text: 'It is a flat object that represents real-world places without containing them.',
        penaltySeconds: 15,
      },
      {
        id: 2,
        text: 'Travellers carry this item everywhere, yet it never moves on its own.',
        penaltySeconds: 15,
      },
      {
        id: 3,
        text: 'The answer is MAP.',
        penaltySeconds: 15,
      },
    ],
    solutionExplanation:
      "A MAP contains depictions of cities, mountains, water, and roads — but none of the real things. Travellers carry maps, yet maps don't move. Password: MAP.",
  },

  // ═══════════════════════════════════════════════════════
  // LEVEL 3 — Binary to ASCII
  // Answer: KEY
  // ═══════════════════════════════════════════════════════
  {
    id: 3,
    title: 'BINARY BREACH',
    subtitle: 'Binary-to-ASCII Translation',
    briefing:
      "INCOMING TRANSMISSION — HELIX CORP DATASTORE\n\nDeep in the Helix Corp datastore, we found a locked partition. The access token is stored as raw binary. Each 8-bit group maps to one ASCII character. You'll need to convert it manually.",
    difficulty: 'Easy',
    type: 'binary',
    timeLimit: 130,
    baseScore: 700,
    xpReward: 175,
    objective: 'Translate the binary message into readable ASCII text.',
    instructions:
      'Convert each 8-bit binary group to its decimal value, then find the corresponding ASCII character. ' +
      'The decimal-to-letter mapping: A=65, B=66 … Z=90. ' +
      'Each group is separated by a space. The answer is a short English word in CAPITALS.',
    clues: [
      'Binary: 01001011  01000101  01011001',
      'Group 1: 01001011 = 64+8+2+1 = 75',
      'Group 2: 01000101 = 64+4+1 = 69',
      'Group 3: 01011001 = 64+16+8+1 = 89',
    ],
    answer: 'KEY',
    hints: [
      {
        id: 1,
        text: 'ASCII 75 = K (the 11th letter, since A=65). Decode the next two groups the same way.',
        penaltySeconds: 15,
      },
      {
        id: 2,
        text: '75=K, 69=E (69−64=5th position from A=64... A=65 so 69−64=5, but E is the 5th letter: 65+4=69=E), 89=Y (65+24=89, 24th letter=Y).',
        penaltySeconds: 15,
      },
      {
        id: 3,
        text: 'K + E + Y = KEY.',
        penaltySeconds: 15,
      },
    ],
    solutionExplanation:
      '01001011=75=K, 01000101=69=E, 01011001=89=Y. Together: KEY — the datastore access token.',
  },

  // ═══════════════════════════════════════════════════════
  // LEVEL 4 — Logic Security Door  → PRO HACKER rank
  // Answer: GAMMA
  // ═══════════════════════════════════════════════════════
  {
    id: 4,
    title: 'LOGIC LABYRINTH',
    subtitle: 'Security Door Logic Puzzle',
    briefing:
      "INCOMING TRANSMISSION — HELIX CORP VAULT ANTECHAMBER\n\nYou've reached the vault antechamber. The security door uses a deductive logic lock — three guards, exactly one liar, and one of them holds the key. Reason it out and name the key-holder.",
    difficulty: 'Intermediate',
    type: 'logic-door',
    timeLimit: 110,
    baseScore: 800,
    xpReward: 200,
    rankUnlocked: 'PRO HACKER',
    objective: 'Name the guard who holds the vault key. Enter ALPHA, BETA, or GAMMA.',
    instructions:
      'Three guards each made one statement. Exactly ONE guard is lying. ' +
      'All others tell the truth. Determine which guard holds the vault key and enter their name.',
    clues: [
      'Guard ALPHA says: "I do not have the key."',
      'Guard BETA  says: "ALPHA is telling the truth."',
      'Guard GAMMA says: "BETA has the key."',
      'Exactly ONE of the three guards is lying.',
    ],
    answer: 'GAMMA',
    hints: [
      {
        id: 1,
        text: 'If ALPHA has the key → ALPHA lies (says he doesn\'t). Then BETA says ALPHA is truthful — also a lie. Two liars = impossible.',
        penaltySeconds: 15,
      },
      {
        id: 2,
        text: "If BETA has the key → ALPHA is truthful. BETA says ALPHA is truthful — also true. GAMMA says BETA has the key — also true. Zero liars = impossible.",
        penaltySeconds: 15,
      },
      {
        id: 3,
        text: 'If GAMMA has the key → ALPHA is truthful. BETA says ALPHA is truthful — true. GAMMA says "BETA has the key" — FALSE (GAMMA has it). Exactly one liar ✓. Answer: GAMMA.',
        penaltySeconds: 15,
      },
    ],
    solutionExplanation:
      'Logic test: ALPHA having key → 2 liars (invalid). BETA having key → 0 liars (invalid). GAMMA having key → only GAMMA lies (says BETA has it, but GAMMA has it). Exactly 1 liar ✓. Key holder: GAMMA.',
  },

  // ═══════════════════════════════════════════════════════
  // LEVEL 5 — Morse Code
  // Answer: STORM
  // ═══════════════════════════════════════════════════════
  {
    id: 5,
    title: 'SIGNAL STATIC',
    subtitle: 'Morse Code Decryption',
    briefing:
      "INCOMING TRANSMISSION — ENCRYPTED RADIO BAND\n\nHelix Corp transmits keywords on old radio frequencies using Morse code. They think nobody listens to radio anymore. We do. Decode this transmission.",
    difficulty: 'Intermediate',
    type: 'morse-code',
    timeLimit: 100,
    baseScore: 900,
    xpReward: 225,
    objective: 'Decode the Morse code transmission and enter the keyword.',
    instructions:
      'Decode the Morse code. A dot (.) is a short signal; a dash (−) is a long signal. ' +
      'Letter groups are separated by a single space. Enter the word in CAPITAL letters.',
    clues: [
      'Transmission: ... - --- .-. --',
      'Morse reference: S=..., T=-, O=---, R=.-., M=--',
      'Groups in order: ...  |  -  |  ---  |  .-.  |  --',
      'Five letters form a single English word.',
    ],
    answer: 'STORM',
    hints: [
      {
        id: 1,
        text: '... = S (three dots). - = T (one dash). --- = O (three dashes).',
        penaltySeconds: 15,
      },
      {
        id: 2,
        text: '.-. = R (dot-dash-dot). -- = M (two dashes). So far: S, T, O, R, M.',
        penaltySeconds: 15,
      },
      {
        id: 3,
        text: 'The word is STORM.',
        penaltySeconds: 15,
      },
    ],
    solutionExplanation:
      'Morse decode: ... = S, - = T, --- = O, .-. = R, -- = M. Combined: STORM — the radio channel keyword.',
  },

  // ═══════════════════════════════════════════════════════
  // LEVEL 6 — Numeric Pattern (Firewall bypass)
  // Answer: 96
  // ═══════════════════════════════════════════════════════
  {
    id: 6,
    title: 'FIREWALL FRACTURE',
    subtitle: 'Numeric Pattern Bypass',
    briefing:
      "INCOMING TRANSMISSION — HELIX CORP FIREWALL NODE\n\nThe firewall cycles access codes using a mathematical pattern. Predict the next number and inject it before the firewall resets. You have one shot.",
    difficulty: 'Intermediate',
    type: 'pattern',
    timeLimit: 90,
    baseScore: 1000,
    xpReward: 250,
    objective: 'Identify the pattern and enter the next number in the sequence.',
    instructions:
      'Analyse the sequence of firewall codes. Determine the rule that links each number to the next, then calculate and enter the NEXT number.',
    clues: [
      'Sequence: 3, 6, 12, 24, 48, ?',
      'Compare consecutive pairs: 3→6, 6→12, 12→24, 24→48.',
      'What single operation transforms each number into the next?',
      'Enter only the number — no spaces or extra characters.',
    ],
    answer: '96',
    hints: [
      {
        id: 1,
        text: '3 × 2 = 6. Does the same rule hold? 6 × 2 = 12. Yes — each number is doubled.',
        penaltySeconds: 15,
      },
      {
        id: 2,
        text: 'The pattern is ×2 each step: 3, 6, 12, 24, 48. So 48 × 2 = ?',
        penaltySeconds: 15,
      },
      {
        id: 3,
        text: '48 × 2 = 96.',
        penaltySeconds: 15,
      },
    ],
    solutionExplanation:
      'Geometric progression with common ratio 2. Each term doubles: 3→6→12→24→48→96. The next firewall code is 96.',
  },

  // ═══════════════════════════════════════════════════════
  // LEVEL 7 — Atbash Substitution Cipher
  // Answer: SHELLO
  // ═══════════════════════════════════════════════════════
  {
    id: 7,
    title: 'PHANTOM CIPHER',
    subtitle: 'Atbash Substitution Cipher',
    briefing:
      "INCOMING TRANSMISSION — PHANTOM DIVISION RELAY\n\nThe Phantom Division uses an Atbash substitution cipher — the alphabet is reversed so A=Z, B=Y, C=X, and so on. We have their ciphertext. Decode it to infiltrate their relay.",
    difficulty: 'Hard',
    type: 'substitution-cipher',
    timeLimit: 110,
    baseScore: 1200,
    xpReward: 300,
    objective: 'Decode the Atbash-encrypted password and enter it.',
    instructions:
      'In the Atbash cipher, each letter is replaced by its alphabetical mirror: A↔Z, B↔Y, C↔X, D↔W … M↔N. ' +
      'Apply this mapping to each letter of the ciphertext. Enter the decoded word in CAPITAL letters.',
    clues: [
      'Ciphertext: HSVOOL',
      'Atbash alphabet: A=Z B=Y C=X D=W E=V F=U G=T H=S I=R J=Q K=P L=O M=N',
      '                 N=M O=L P=K Q=J R=I S=H T=G U=F V=E W=D X=C Y=B Z=A',
      'Decode each letter of HSVOOL using the mapping above.',
    ],
    answer: 'SHELLO',
    hints: [
      {
        id: 1,
        text: 'H↔S (H is the 8th letter; its mirror is the 19th = S). S↔H (19th mirrors to 8th = H).',
        penaltySeconds: 15,
      },
      {
        id: 2,
        text: 'H=S, S=H, V=E, O=L, O=L, L=O. Apply all six.',
        penaltySeconds: 15,
      },
      {
        id: 3,
        text: 'HSVOOL decoded = SHELLO.',
        penaltySeconds: 15,
      },
    ],
    solutionExplanation:
      'Atbash mirror: H(8)↔S(19), S(19)↔H(8), V(22)↔E(5), O(15)↔L(12), O(15)↔L(12), L(12)↔O(15). HSVOOL → SHELLO. The Phantom relay password is SHELLO.',
  },

  // ═══════════════════════════════════════════════════════
  // LEVEL 8 — Multi-Step Decryption  → ELITE HACKER rank
  // Answer: UWZGP
  // ═══════════════════════════════════════════════════════
  {
    id: 8,
    title: 'LABYRINTH CORE',
    subtitle: 'Three-Layer Decryption',
    briefing:
      "INCOMING TRANSMISSION — LABYRINTH CORE SYSTEM\n\nYou've reached the Labyrinth Core. The access code is protected by a three-layer encryption chain. Each layer's output feeds the next. Miss one step and the chain fails entirely. This is where ELITE hackers are forged.",
    difficulty: 'Hard',
    type: 'multi-step',
    timeLimit: 150,
    baseScore: 1500,
    xpReward: 400,
    rankUnlocked: 'ELITE HACKER',
    objective: 'Complete all three decryption steps and enter the final result.',
    instructions:
      'Three steps, in order. Each step uses the result of the previous one.\n\n' +
      'STEP 1 — Number-to-letter: Convert each number using A=1, B=2, … Z=26.\n' +
      'STEP 2 — Reverse: Reverse the word from Step 1.\n' +
      'STEP 3 — Caesar +2: Shift each letter in the Step 2 result forward by 2 (A→C, Y→A, Z→B).\n\n' +
      'Enter the FINAL 5-letter result after Step 3.',
    clues: [
      'STEP 1 input: 14  5  24  21  19',
      'A=1, B=2 … N=14, E=5, X=24, U=21, S=19',
      'Step 1 gives a 5-letter word. Step 2 reverses it. Step 3 applies Caesar +2.',
      'Work methodically through each step.',
    ],
    answer: 'UWZGP',
    hints: [
      {
        id: 1,
        text: 'Step 1: 14=N, 5=E, 24=X, 21=U, 19=S → NEXUS',
        penaltySeconds: 15,
      },
      {
        id: 2,
        text: 'Step 2: Reverse NEXUS → SUXEN',
        penaltySeconds: 15,
      },
      {
        id: 3,
        text: 'Step 3: S+2=U, U+2=W, X+2=Z, E+2=G, N+2=P → UWZGP',
        penaltySeconds: 15,
      },
    ],
    solutionExplanation:
      'Step 1: 14→N, 5→E, 24→X, 21→U, 19→S = NEXUS. Step 2: Reverse = SUXEN. Step 3: Caesar+2 (S→U, U→W, X→Z, E→G, N→P) = UWZGP. The Labyrinth Core master code is UWZGP.',
  },

  // ═══════════════════════════════════════════════════════
  // LEVEL 9 — Word Riddle + Encoding
  // Answer: 21
  // ═══════════════════════════════════════════════════════
  {
    id: 9,
    title: 'RECURSIVE ENIGMA',
    subtitle: 'Riddle + Encoding Chain',
    briefing:
      "INCOMING TRANSMISSION — RECURSIVE ENIGMA NODE\n\nYou're deeper than anyone has gone. The Recursive Enigma node guards the APEX gateway. Its code hides inside a riddle — and the riddle's answer must then be encoded mathematically. Non-linear thinking at its finest.",
    difficulty: 'Expert',
    type: 'sequence',
    timeLimit: 140,
    baseScore: 1800,
    xpReward: 500,
    objective: 'Solve the riddle, then apply the encoding rule and enter the numeric result.',
    instructions:
      'PART 1 — Solve the riddle to get a WORD.\n' +
      'PART 2 — Count the letters in that word. Multiply the letter count by 7. Subtract 14.\n' +
      'Enter the final NUMBER (no letters).',
    clues: [
      'RIDDLE: I am an odd number. Remove one letter from my name and I become even. What number am I?',
      'Hint: Think about the WORD that names this number, not the digit.',
      'Encoding rule: letter_count × 7 − 14',
      'Enter only the numeric answer.',
    ],
    answer: '21',
    hints: [
      {
        id: 1,
        text: 'The riddle answer is a number-word. Which number word, when you remove a single letter, spells "EVEN"?',
        penaltySeconds: 15,
      },
      {
        id: 2,
        text: 'SEVEN → remove the S → EVEN. SEVEN has 5 letters.',
        penaltySeconds: 15,
      },
      {
        id: 3,
        text: '5 letters × 7 = 35. 35 − 14 = 21. Answer: 21',
        penaltySeconds: 15,
      },
    ],
    solutionExplanation:
      'The riddle answer is SEVEN (an odd number; remove "S" → "EVEN"). SEVEN has 5 letters. Encoding: 5 × 7 = 35, 35 − 14 = 21. The node access code is 21.',
  },

  // ═══════════════════════════════════════════════════════
  // LEVEL 10 — FINAL BOSS — Combined Mechanics
  // Answer: ARO6
  // ═══════════════════════════════════════════════════════
  {
    id: 10,
    title: 'APEX PROTOCOL',
    subtitle: 'FINAL BOSS — Combined Mechanics',
    briefing:
      "INCOMING TRANSMISSION — APEX SYSTEM — PRIORITY ALPHA\n\nThis is it. The APEX system — Helix Corp's crown jewel. A sentient firewall monitors every keystroke. The 4-character master key is assembled from four sub-challenges, each testing a skill you've mastered. One wrong move triggers a full lockdown. The fate of the free net rests with you.\n\n// GODSPEED, HACKER. //",
    difficulty: 'Master',
    type: 'final-boss',
    timeLimit: 180,
    baseScore: 3000,
    xpReward: 1000,
    rankUnlocked: 'MASTER HACKER',
    objective: 'Solve all four sub-challenges and assemble the 4-character APEX master key.',
    instructions:
      'Solve each sub-challenge. Take EXACTLY ONE character from each result as directed. ' +
      'Assemble the four characters IN ORDER (no spaces) for your final answer.\n\n' +
      'SUB-1 (Binary): Decode 01000001. Take that ASCII letter.\n' +
      'SUB-2 (Caesar −2): Decode "TGMF" by shifting each letter BACK 2. Take the FIRST letter of the result.\n' +
      'SUB-3 (Riddle): "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind." — One word. Take the LAST letter of the answer.\n' +
      'SUB-4 (Pattern): Find the next number in 5, 10, 20, 40, 80, ?. Take the TENS digit of that number.',
    clues: [
      'SUB-1: 01000001 in binary. 64+1=65. ASCII 65 = ?  (Remember: A=65)',
      'SUB-2: T−2=R, G−2=E, M−2=K, F−2=D → result = REKD. First letter = R.',
      'SUB-3: ECHO speaks without mouth, hears without ears, has no body, comes alive with wind. Last letter of ECHO = ?',
      'SUB-4: Each term doubles: 80×2=160. Tens digit of 160 = 6.',
    ],
    answer: 'ARO6',
    hints: [
      {
        id: 1,
        text: 'SUB-1: 65 = A (A is ASCII 65). SUB-2: TGMF back-shifted 2 = REKD, first letter R.',
        penaltySeconds: 15,
      },
      {
        id: 2,
        text: 'SUB-3: The riddle describes an ECHO. Last letter of ECHO = O.',
        penaltySeconds: 15,
      },
      {
        id: 3,
        text: 'SUB-4: 80×2=160, tens digit = 6. Assemble: A + R + O + 6 = ARO6.',
        penaltySeconds: 15,
      },
    ],
    solutionExplanation:
      'SUB-1: 01000001=65=A. SUB-2: T(20)−2=R(18), G(7)−2=E(5), M(13)−2=K(11), F(6)−2=D(4) → REKD, first letter R. SUB-3: ECHO (speaks/hears/lives without physical form, comes alive with wind), last letter O. SUB-4: 5×2 pattern: 80×2=160, tens digit 6. APEX master key: A-R-O-6 → ARO6.',
  },
];

export function getLevelById(id: number): Level | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function getNextLevel(currentId: number): Level | undefined {
  return LEVELS.find((l) => l.id === currentId + 1);
}
