import { Toaster } from "@/components/ui/sonner";
import {
  Copy,
  Delete,
  Edit3,
  Square,
  Trash2,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ── DATA ──────────────────────────────────────────────────────────────────────

const VOWEL_GRID: string[][] = [
  ["அ", "ஆ", "இ"],
  ["ஈ", "உ", "ஊ"],
  ["எ", "ஏ", "ஐ"],
  ["ஒ", "ஓ", "ஔ"],
];

const ROW_KEYS = ["க-row", "த-row", "ல-row", "ஷ-row"];

const CONSONANT_GRID: (string | null)[][] = [
  ["க", "ங", "ச", "ஞ", "ட", "ண"],
  ["த", "ந", "ப", "ம", "ய", "ர"],
  ["ல", "வ", "ழ", "ள", "ற", "ன"],
  ["ஷ", "ஸ", "ஜ", "ஹ", "க்ஷ", null],
];

const COMBOS: Record<string, string[]> = {
  க: ["க்", "கா", "கி", "கீ", "கு", "கூ", "கெ", "கே", "கை", "கொ", "கோ", "கௌ"],
  ங: [
    "ங்",
    "ங\u0BBE",
    "ங\u0BBF",
    "ங\u0BC0",
    "ங\u0BC1",
    "ங\u0BC2",
    "ங\u0BC6",
    "ங\u0BC7",
    "ங\u0BC8",
    "ங\u0BCA",
    "ங\u0BCB",
    "ங\u0BCC",
  ],
  ச: ["ச்", "சா", "சி", "சீ", "சு", "சூ", "செ", "சே", "சை", "சொ", "சோ", "சௌ"],
  ஞ: ["ஞ்", "ஞா", "ஞி", "ஞீ", "ஞு", "ஞூ", "ஞெ", "ஞே", "ஞை", "ஞொ", "ஞோ", "ஞௌ"],
  ட: ["ட்", "டா", "டி", "டீ", "டு", "டூ", "டெ", "டே", "டை", "டொ", "டோ", "டௌ"],
  ண: ["ண்", "ணா", "ணி", "ணீ", "ணு", "ணூ", "ணெ", "ணே", "ணை", "ணொ", "ணோ", "ணௌ"],
  த: ["த்", "தா", "தி", "தீ", "து", "தூ", "தெ", "தே", "தை", "தொ", "தோ", "தௌ"],
  ந: ["ந்", "நா", "நி", "நீ", "நு", "நூ", "நெ", "நே", "நை", "நொ", "நோ", "நௌ"],
  ப: ["ப்", "பா", "பி", "பீ", "பு", "பூ", "பெ", "பே", "பை", "பொ", "போ", "பௌ"],
  ம: ["ம்", "மா", "மி", "மீ", "மு", "மூ", "மெ", "மே", "மை", "மொ", "மோ", "மௌ"],
  ய: ["ய்", "யா", "யி", "யீ", "யு", "யூ", "யெ", "யே", "யை", "யொ", "யோ", "யௌ"],
  ர: ["ர்", "ரா", "ரி", "ரீ", "ரு", "ரூ", "ரெ", "ரே", "ரை", "ரொ", "ரோ", "ரௌ"],
  ல: ["ல்", "லா", "லி", "லீ", "லு", "லூ", "லெ", "லே", "லை", "லொ", "லோ", "லௌ"],
  வ: ["வ்", "வா", "வி", "வீ", "வு", "வூ", "வெ", "வே", "வை", "வொ", "வோ", "வௌ"],
  ழ: ["ழ்", "ழா", "ழி", "ழீ", "ழு", "ழூ", "ழெ", "ழே", "ழை", "ழொ", "ழோ", "ழௌ"],
  ள: ["ள்", "ளா", "ளி", "ளீ", "ளு", "ளூ", "ளெ", "ளே", "ளை", "ளொ", "ளோ", "ளௌ"],
  ற: ["ற்", "றா", "றி", "றீ", "று", "றூ", "றெ", "றே", "றை", "றொ", "றோ", "றௌ"],
  ன: ["ன்", "னா", "னி", "னீ", "னு", "னூ", "னெ", "னே", "னை", "னொ", "னோ", "னௌ"],
  ஷ: ["ஷ்", "ஷா", "ஷி", "ஷீ", "ஷு", "ஷூ", "ஷெ", "ஷே", "ஷை", "ஷொ", "ஷோ", "ஷௌ"],
  ஸ: ["ஸ்", "ஸா", "ஸி", "ஸீ", "ஸு", "ஸூ", "ஸெ", "ஸே", "ஸை", "ஸொ", "ஸோ", "ஸௌ"],
  ஜ: ["ஜ்", "ஜா", "ஜி", "ஜீ", "ஜு", "ஜூ", "ஜெ", "ஜே", "ஜை", "ஜொ", "ஜோ", "ஜௌ"],
  ஹ: ["ஹ்", "ஹா", "ஹி", "ஹீ", "ஹு", "ஹூ", "ஹெ", "ஹே", "ஹை", "ஹொ", "ஹோ", "ஹௌ"],
  க்ஷ: [
    "க்ஷ்",
    "க்ஷா",
    "க்ஷி",
    "க்ஷீ",
    "க்ஷு",
    "க்ஷூ",
    "க்ஷெ",
    "க்ஷே",
    "க்ஷை",
    "க்ஷொ",
    "க்ஷோ",
    "க்ஷௌ",
  ],
};

function getComboCells(root: string): string[] {
  return COMBOS[root] ?? [];
}

// ── ENGLISH KEYBOARD DATA ──────────────────────────────────────────────────────

const EN_ROW1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const EN_ROW2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const EN_ROW3 = ["Z", "X", "C", "V", "B", "N", "M"];

const EN_ROW_COLORS = [
  "oklch(0.88 0.10 250)",
  "oklch(0.88 0.10 165)",
  "oklch(0.88 0.14 60)",
];
const EN_ROW_TEXT = [
  "oklch(0.22 0.12 250)",
  "oklch(0.20 0.10 170)",
  "oklch(0.25 0.14 45)",
];

// ── NUMBERS KEYBOARD DATA ─────────────────────────────────────────────────────

const NUM_ROW1 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const NUM_ROW2 = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
const NUM_ROW3 = ["-", "+", "=", "_", "/", "?", ".", ",", ":", ";"];

const NUM_ROW_COLORS = [
  "oklch(0.90 0.10 320)",
  "oklch(0.88 0.12 280)",
  "oklch(0.88 0.10 220)",
];
const NUM_ROW_TEXT = [
  "oklch(0.22 0.12 320)",
  "oklch(0.22 0.12 270)",
  "oklch(0.22 0.10 220)",
];

// ── MODE TYPE ─────────────────────────────────────────────────────────────────

type KeyboardMode = "tamil" | "english" | "numbers";

function nextMode(m: KeyboardMode): KeyboardMode {
  if (m === "tamil") return "english";
  if (m === "english") return "numbers";
  return "tamil";
}

function modeLabel(m: KeyboardMode): string {
  if (m === "tamil") return "த";
  if (m === "english") return "EN";
  return "123";
}

// ── FIREWORK BURST ANIMATION ──────────────────────────────────────────────────

const PARTICLE_COLORS = [
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#FF6BFF",
  "#FF9A3C",
  "#FF6BB5",
  "#00D4AA",
  "#B48EFF",
  "#FF4500",
];

interface BurstItem {
  id: number;
  x: number;
  y: number;
}

interface FlyingItem {
  id: number;
  char: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

function FireworkBurst({
  burst,
  onComplete,
}: {
  burst: BurstItem;
  onComplete: (id: number) => void;
}) {
  const particleCount = 12;
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * 360 + Math.random() * 20 - 10;
    const distance = 50 + Math.random() * 70;
    const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length];
    const size = 8 + Math.random() * 8;
    return { angle, distance, color, size, id: i };
  });

  return (
    <>
      {particles.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const dx = Math.cos(rad) * p.distance;
        const dy = Math.sin(rad) * p.distance;
        return (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{
              x: dx,
              y: dy,
              scale: [1, 1.3, 0],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 0.55,
              ease: "easeOut",
              delay: i * 0.008,
            }}
            onAnimationComplete={
              i === 0 ? () => onComplete(burst.id) : undefined
            }
            style={{
              position: "fixed",
              left: burst.x,
              top: burst.y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: p.color,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              zIndex: 9999,
              boxShadow: `0 0 6px ${p.color}`,
            }}
          />
        );
      })}
      {/* Center flash pop */}
      <motion.div
        initial={{ scale: 0, opacity: 0.9 }}
        animate={{ scale: 2.5, opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{
          position: "fixed",
          left: burst.x,
          top: burst.y,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "white",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
    </>
  );
}

function WanderingMonkey({ isJumping }: { isJumping: boolean }) {
  const [posX, setPosX] = useState(20);
  const directionRef = useRef(1);

  useEffect(() => {
    const tick = () => {
      const d = directionRef.current;
      setPosX((prev) => {
        const next = prev + d * (3 + Math.random() * 4);
        if (next > 85 || next < 5) {
          directionRef.current = -d;
          return Math.max(5, Math.min(85, prev));
        }
        return next;
      });
    };
    const interval = setInterval(tick, 600 + Math.random() * 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      style={{
        position: "absolute",
        bottom: 2,
        left: `${posX}%`,
        fontSize: "clamp(14px, 2vw, 20px)",
        pointerEvents: "none",
        zIndex: 10,
        userSelect: "none",
        lineHeight: 1,
      }}
      animate={
        isJumping
          ? { y: [-20, 0], rotate: [0, -15, 15, 0], scale: [1.4, 1] }
          : { y: [0, -3, 0] }
      }
      transition={
        isJumping
          ? { duration: 0.4, ease: "easeOut" }
          : {
              duration: 0.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }
      }
    >
      🐒
    </motion.div>
  );
}

function FlyingLetter({
  item,
  onComplete,
}: {
  item: FlyingItem;
  onComplete: (id: number) => void;
}) {
  return (
    <motion.div
      initial={{
        x: item.startX,
        y: item.startY,
        scale: 4.5,
        opacity: 1,
        rotate: 0,
      }}
      animate={{
        x: item.endX,
        y: item.endY,
        scale: 0.4,
        opacity: [1, 1, 0],
        rotate: [0, -10, 10, 0],
      }}
      transition={{
        duration: 0.42,
        ease: [0.2, 0.8, 0.6, 1],
      }}
      onAnimationComplete={() => onComplete(item.id)}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        fontSize: "clamp(32px, 5vw, 56px)",
        fontWeight: 900,
        color: "oklch(0.55 0.28 25)",
        pointerEvents: "none",
        zIndex: 9998,
        transformOrigin: "center",
        textShadow:
          "0 2px 8px rgba(255,100,0,0.6), 0 0 20px rgba(255,200,0,0.4)",
        lineHeight: 1,
      }}
      className="tamil-text"
    >
      {item.char}
    </motion.div>
  );
}

// ── SPEECH ────────────────────────────────────────────────────────────────────

const VIRAMA = "\u0BCD"; // ்

const NGA_PRONUNCIATIONS: Record<string, { text: string; lang: string }> = {
  "\u0B99": { text: "nga.", lang: "en-US" },
  "\u0B99\u0BCD": { text: "ng.", lang: "en-US" },
  "\u0B99\u0BBE": { text: "ngaa.", lang: "en-US" },
  "\u0B99\u0BBF": { text: "ngi.", lang: "en-US" },
  "\u0B99\u0BC0": { text: "ngii.", lang: "en-US" },
  "\u0B99\u0BC1": { text: "ngu.", lang: "en-US" },
  "\u0B99\u0BC2": { text: "nguu.", lang: "en-US" },
  "\u0B99\u0BC6": { text: "nge.", lang: "en-US" },
  "\u0B99\u0BC7": { text: "ngee.", lang: "en-US" },
  "\u0B99\u0BC8": { text: "ngai.", lang: "en-US" },
  "\u0B99\u0BCA": { text: "ngo.", lang: "en-US" },
  "\u0B99\u0BCB": { text: "ngoo.", lang: "en-US" },
  "\u0B99\u0BCC": { text: "ngau.", lang: "en-US" },
};

function getPronunciation(char: string): {
  text: string;
  lang: string;
  rate?: number;
} {
  const normalized = char.normalize("NFC");
  if (normalized in NGA_PRONUNCIATIONS) {
    return { ...NGA_PRONUNCIATIONS[normalized], rate: 0.75 };
  }
  if (normalized.endsWith(VIRAMA)) {
    return { text: normalized.slice(0, normalized.length - 1), lang: "ta-IN" };
  }
  return { text: normalized, lang: "ta-IN" };
}

function useSpeech() {
  const speak = useCallback((char: string, forceLang?: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const { text, lang, rate } = forceLang
      ? { text: char, lang: forceLang, rate: 0.9 }
      : getPronunciation(char);
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang;
    utt.rate = rate ?? 0.9;
    window.speechSynthesis.speak(utt);
  }, []);
  return { speak };
}

// ── REFERENCE TEXT BOX ────────────────────────────────────────────────────────

interface ReferenceBoxProps {
  referenceText: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (text: string) => void;
  onClear: () => void;
}

function ReferenceBox({
  referenceText,
  isEditing,
  onEdit,
  onSave,
  onClear,
}: ReferenceBoxProps) {
  const [draft, setDraft] = useState(referenceText);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) {
      setDraft(referenceText);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [isEditing, referenceText]);

  return (
    <div
      data-ocid="reference.panel"
      className="flex-none flex flex-col"
      style={{
        background: "oklch(0.98 0.06 280)",
        border: "2px solid oklch(0.80 0.14 280)",
        borderRadius: "12px",
        margin: "4px 8px 2px",
        overflow: "hidden",
        height: "22%",
        flex: "none",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-1.5 px-2 py-0.5 flex-none"
        style={{
          background: "oklch(0.72 0.18 280)",
          borderBottom: "1px solid oklch(0.62 0.2 280)",
        }}
      >
        <span
          className="tamil-text font-bold flex-1"
          style={{ fontSize: "clamp(9px, 1.2vw, 11px)", color: "white" }}
        >
          📖 பார்க்க வேண்டிய வாக்கியம்
        </span>
        {!isEditing && (
          <button
            type="button"
            data-ocid="reference.edit_button"
            onClick={onEdit}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-white hover:bg-white/20 transition-all"
            style={{ fontSize: "clamp(8px, 1.1vw, 10px)" }}
          >
            <Edit3 className="w-3 h-3" />
            <span>தட்டு / Paste</span>
          </button>
        )}
        {referenceText && !isEditing && (
          <button
            type="button"
            data-ocid="reference.clear_button"
            onClick={onClear}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-white hover:bg-white/20 transition-all"
            style={{ fontSize: "clamp(8px, 1.1vw, 10px)" }}
          >
            <X className="w-3 h-3" />
          </button>
        )}
        {isEditing && (
          <>
            <button
              type="button"
              data-ocid="reference.save_button"
              onClick={() => onSave(draft)}
              className="flex items-center gap-1 px-2 py-0.5 rounded font-bold transition-all hover:bg-white/20"
              style={{ fontSize: "clamp(8px, 1.1vw, 10px)", color: "white" }}
            >
              சேமி ✓
            </button>
            <button
              type="button"
              data-ocid="reference.cancel_button"
              onClick={() => onSave(referenceText)}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded text-white hover:bg-white/20 transition-all"
              style={{ fontSize: "clamp(8px, 1.1vw, 10px)" }}
            >
              <X className="w-3 h-3" />
            </button>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            data-ocid="reference.textarea"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="இங்கே வாக்கியங்களை paste செய்யுங்கள்..."
            className="w-full h-full resize-none tamil-text outline-none px-2 py-1"
            style={{
              background: "transparent",
              fontSize: "clamp(15px, 2.5vw, 26px)",
              fontWeight: 700,
              lineHeight: 1.4,
              color: "oklch(0.2 0.08 280)",
              minHeight: "40px",
            }}
          />
        ) : (
          <div
            data-ocid="reference.display"
            className="w-full h-full overflow-y-auto px-2 py-1"
            style={{ wordBreak: "break-all" }}
          >
            {referenceText ? (
              <p
                className="tamil-text"
                style={{
                  fontSize: "clamp(15px, 2.5vw, 26px)",
                  lineHeight: 1.4,
                  color: "oklch(0.2 0.08 280)",
                  fontWeight: 700,
                }}
              >
                {referenceText}
              </p>
            ) : (
              <p
                className="tamil-text"
                style={{
                  fontSize: "clamp(10px, 1.5vw, 14px)",
                  color: "oklch(0.65 0.08 280)",
                  fontStyle: "italic",
                }}
              >
                மேலே உள்ள &quot;தட்டு / Paste&quot; பட்டனை அழுத்தி வாக்கியங்களை
                சேர்க்கவும்
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── KEYBOARD ROW ──────────────────────────────────────────────────────────────────

const LEFT_COL_BG = [
  "oklch(0.94 0.09 70)",
  "oklch(0.91 0.11 60)",
  "oklch(0.94 0.09 80)",
];
const LEFT_COL_BG_ACTIVE = [
  "oklch(0.82 0.18 275)",
  "oklch(0.78 0.20 275)",
  "oklch(0.82 0.18 275)",
];

const CONS_COL_BG = [
  "oklch(0.94 0.08 195)",
  "oklch(0.90 0.10 190)",
  "oklch(0.94 0.08 195)",
  "oklch(0.90 0.10 190)",
  "oklch(0.94 0.08 195)",
  "oklch(0.90 0.10 190)",
];

interface KeyRowProps {
  rowIdx: number;
  leftCells: (string | null)[];
  consonants: (string | null)[];
  selectedConsonant: string | null;
  isComboMode: boolean;
  onLeftKey: (rowIdx: number, colIdx: number, rect: DOMRect) => void;
  onConsonant: (root: string, rect: DOMRect) => void;
  onBackspace: () => void;
}

function KeyRow({
  rowIdx,
  leftCells,
  consonants,
  selectedConsonant,
  isComboMode,
  onLeftKey,
  onConsonant,
  onBackspace,
}: KeyRowProps) {
  const leftTotal = 3;

  const leftKeyBg = (colIdx: number, active: boolean) =>
    active ? LEFT_COL_BG_ACTIVE[colIdx] : LEFT_COL_BG[colIdx];

  const leftKeyColor = (active: boolean) =>
    active ? "oklch(0.15 0.1 270)" : "oklch(0.3 0.12 55)";

  const consonantBg = (
    colIdx: number,
    isSelected: boolean,
    isNull: boolean,
  ) => {
    if (isSelected) return "oklch(0.62 0.22 25)";
    if (isNull) return "oklch(0.65 0.22 30)";
    return CONS_COL_BG[colIdx] ?? "oklch(0.94 0.08 195)";
  };

  const consonantColor = (isSelected: boolean, isNull: boolean) => {
    if (isSelected || isNull) return "white";
    return "oklch(0.22 0.1 200)";
  };

  const rowIsFirst = rowIdx === 0;
  const rowIsLast = rowIdx === CONSONANT_GRID.length - 1;

  const cornerRadiusLeft = {
    borderTopLeftRadius: rowIsFirst ? "10px" : "0",
    borderBottomLeftRadius: rowIsLast ? "10px" : "0",
  };
  const cornerRadiusRight = {
    borderTopRightRadius: rowIsFirst ? "10px" : "0",
    borderBottomRightRadius: rowIsLast ? "10px" : "0",
  };

  return (
    <div
      className="flex flex-1"
      style={{
        borderBottom: rowIsLast
          ? "none"
          : "1px solid oklch(0.78 0.08 180 / 0.6)",
      }}
    >
      {/* Left vowel/combo panel */}
      {[0, 1, 2].map((colIdx) => {
        const cell = leftCells[colIdx] ?? null;
        const isFirst = colIdx === 0;
        const isLastInLeft = colIdx === leftTotal - 1;
        return (
          <motion.button
            key={`left-col-${colIdx}`}
            type="button"
            data-ocid={`keyboard.left_key.${rowIdx * 3 + colIdx + 1}`}
            onClick={(e) =>
              onLeftKey(rowIdx, colIdx, e.currentTarget.getBoundingClientRect())
            }
            disabled={!cell}
            whileTap={{ scale: 0.82 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="flex-1 flex items-center justify-center tamil-text
              transition-colors duration-75 select-none cursor-pointer
              disabled:opacity-30 disabled:cursor-default"
            style={{
              background: leftKeyBg(colIdx, isComboMode),
              color: leftKeyColor(isComboMode),
              fontWeight: 700,
              fontSize: "clamp(15px, 2.6vw, 26px)",
              borderRight: isLastInLeft
                ? "none"
                : "1px solid oklch(0.82 0.12 70 / 0.7)",
              ...(isFirst ? cornerRadiusLeft : {}),
            }}
          >
            {cell ?? ""}
          </motion.button>
        );
      })}

      {/* Vertical divider between left and right panels */}
      <div
        className="flex-none"
        style={{ width: "3px", background: "oklch(0.72 0.14 180 / 0.8)" }}
      />

      {/* Right consonant panel */}
      {consonants.map((root, colIdx) => {
        const isSelected = selectedConsonant === root;
        const isNull = root === null;
        const isLastInRight = colIdx === consonants.length - 1;

        if (isNull) {
          return (
            <motion.button
              key="backspace"
              type="button"
              data-ocid="keyboard.backspace_button"
              onClick={onBackspace}
              whileTap={{ scale: 0.82 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              className="flex-1 flex items-center justify-center
                transition-colors duration-75 select-none cursor-pointer"
              style={{
                background: "oklch(0.65 0.22 30)",
                color: "white",
                ...(isLastInRight ? cornerRadiusRight : {}),
              }}
            >
              <Delete className="w-5 h-5" />
            </motion.button>
          );
        }

        return (
          <motion.button
            key={root}
            type="button"
            data-ocid={`keyboard.consonant_key.${root}`}
            onClick={(e) =>
              onConsonant(root, e.currentTarget.getBoundingClientRect())
            }
            whileTap={{ scale: 0.82 }}
            animate={isSelected ? { scale: [1, 1.18, 1] } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="flex-1 flex items-center justify-center tamil-text
              transition-colors duration-75 select-none cursor-pointer"
            style={{
              background: consonantBg(colIdx, isSelected, false),
              color: consonantColor(isSelected, false),
              fontWeight: 700,
              fontSize: "clamp(15px, 2.6vw, 26px)",
              borderLeft:
                colIdx === 0 ? "none" : "1px solid oklch(0.82 0.08 190 / 0.6)",
              ...(isLastInRight ? cornerRadiusRight : {}),
            }}
          >
            {root}
          </motion.button>
        );
      })}
    </div>
  );
}

// ── ENGLISH KEYBOARD COMPONENT ────────────────────────────────────────────────

interface EnglishKeyboardProps {
  isShift: boolean;
  onKey: (char: string, rect: DOMRect) => void;
  onBackspace: () => void;
  onToggleShift: () => void;
}

function EnglishKeyboard({
  isShift,
  onKey,
  onBackspace,
  onToggleShift,
}: EnglishKeyboardProps) {
  const transform = (k: string) => (isShift ? k : k.toLowerCase());

  const renderRow = (
    keys: string[],
    rowIdx: number,
    extraRight?: React.ReactNode,
  ) => (
    <div
      key={`en-row-${rowIdx}`}
      className="flex flex-1"
      style={{
        borderBottom:
          rowIdx < 2 ? "1px solid oklch(0.80 0.06 220 / 0.5)" : "none",
      }}
    >
      {keys.map((k, colIdx) => (
        <motion.button
          key={k}
          type="button"
          data-ocid={`keyboard.en_key.${rowIdx * 10 + colIdx + 1}`}
          onClick={(e) =>
            onKey(transform(k), e.currentTarget.getBoundingClientRect())
          }
          whileTap={{ scale: 0.82 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="flex-1 flex items-center justify-center font-bold
            transition-colors duration-75 select-none cursor-pointer"
          style={{
            background: EN_ROW_COLORS[rowIdx] ?? EN_ROW_COLORS[0],
            color: EN_ROW_TEXT[rowIdx] ?? EN_ROW_TEXT[0],
            fontSize: "clamp(13px, 2.2vw, 22px)",
            borderLeft:
              colIdx === 0 ? "none" : "1px solid oklch(0.82 0.06 230 / 0.5)",
          }}
        >
          {transform(k)}
        </motion.button>
      ))}
      {extraRight}
    </div>
  );

  return (
    <div
      className="flex flex-col h-full"
      style={{
        border: "2px solid oklch(0.72 0.10 220)",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      {renderRow(EN_ROW1, 0)}
      {renderRow(EN_ROW2, 1)}
      {/* Row 3: Shift + Z–M + Backspace */}
      <div className="flex flex-1">
        <motion.button
          type="button"
          data-ocid="keyboard.en_shift_button"
          onClick={onToggleShift}
          whileTap={{ scale: 0.82 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="flex items-center justify-center font-bold
            transition-colors duration-75 select-none cursor-pointer"
          style={{
            background: isShift
              ? "oklch(0.62 0.22 250)"
              : "oklch(0.82 0.10 60)",
            color: isShift ? "white" : "oklch(0.25 0.14 45)",
            fontSize: "clamp(11px, 1.8vw, 17px)",
            minWidth: "clamp(36px, 6%, 58px)",
            borderRight: "1px solid oklch(0.78 0.08 60 / 0.5)",
            borderBottomLeftRadius: "8px",
          }}
        >
          ⇧
        </motion.button>
        {EN_ROW3.map((k, colIdx) => (
          <motion.button
            key={k}
            type="button"
            data-ocid={`keyboard.en_key.${20 + colIdx + 1}`}
            onClick={(e) =>
              onKey(transform(k), e.currentTarget.getBoundingClientRect())
            }
            whileTap={{ scale: 0.82 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="flex-1 flex items-center justify-center font-bold
              transition-colors duration-75 select-none cursor-pointer"
            style={{
              background: EN_ROW_COLORS[2],
              color: EN_ROW_TEXT[2],
              fontSize: "clamp(13px, 2.2vw, 22px)",
              borderLeft: "1px solid oklch(0.82 0.08 60 / 0.5)",
            }}
          >
            {transform(k)}
          </motion.button>
        ))}
        <motion.button
          type="button"
          data-ocid="keyboard.en_backspace_button"
          onClick={onBackspace}
          whileTap={{ scale: 0.82 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="flex items-center justify-center
            transition-colors duration-75 select-none cursor-pointer"
          style={{
            background: "oklch(0.65 0.22 30)",
            color: "white",
            minWidth: "clamp(36px, 6%, 58px)",
            borderLeft: "1px solid oklch(0.55 0.2 30 / 0.5)",
            borderBottomRightRadius: "8px",
          }}
        >
          <Delete className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}

// ── NUMBERS KEYBOARD COMPONENT ────────────────────────────────────────────────

interface NumbersKeyboardProps {
  onKey: (char: string, rect: DOMRect) => void;
  onBackspace: () => void;
}

function NumbersKeyboard({ onKey, onBackspace }: NumbersKeyboardProps) {
  const rows = [NUM_ROW1, NUM_ROW2, NUM_ROW3];

  return (
    <div
      className="flex flex-col h-full"
      style={{
        border: "2px solid oklch(0.72 0.10 300)",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      {rows.map((row, rowIdx) => (
        <div
          key={`num-row-${row[0]}`}
          className="flex flex-1"
          style={{
            borderBottom:
              rowIdx < 2 ? "1px solid oklch(0.80 0.06 300 / 0.5)" : "none",
          }}
        >
          {row.map((k, colIdx) => (
            <motion.button
              key={k}
              type="button"
              data-ocid={`keyboard.num_key.${rowIdx * 10 + colIdx + 1}`}
              onClick={(e) => onKey(k, e.currentTarget.getBoundingClientRect())}
              whileTap={{ scale: 0.82 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              className="flex-1 flex items-center justify-center font-bold
                transition-colors duration-75 select-none cursor-pointer"
              style={{
                background: NUM_ROW_COLORS[rowIdx] ?? NUM_ROW_COLORS[0],
                color: NUM_ROW_TEXT[rowIdx] ?? NUM_ROW_TEXT[0],
                fontSize: "clamp(13px, 2.2vw, 22px)",
                borderLeft:
                  colIdx === 0
                    ? "none"
                    : "1px solid oklch(0.82 0.06 290 / 0.5)",
                ...(rowIdx === 0 && colIdx === 0
                  ? { borderTopLeftRadius: "8px" }
                  : {}),
                ...(rowIdx === 0 && colIdx === row.length - 1
                  ? { borderTopRightRadius: "8px" }
                  : {}),
              }}
            >
              {k}
            </motion.button>
          ))}
          {rowIdx === 2 && (
            <motion.button
              type="button"
              data-ocid="keyboard.num_backspace_button"
              onClick={onBackspace}
              whileTap={{ scale: 0.82 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              className="flex items-center justify-center
                transition-colors duration-75 select-none cursor-pointer"
              style={{
                background: "oklch(0.65 0.22 30)",
                color: "white",
                minWidth: "clamp(36px, 6%, 58px)",
                borderLeft: "1px solid oklch(0.55 0.2 30 / 0.5)",
                borderBottomRightRadius: "8px",
              }}
            >
              <Delete className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      ))}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────

export default function App() {
  const [text, setText] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [selectedConsonant, setSelectedConsonant] = useState<string | null>(
    null,
  );
  const [referenceText, setReferenceText] = useState("");
  const [isEditingReference, setIsEditingReference] = useState(false);
  const [keyboardMode, setKeyboardMode] = useState<KeyboardMode>("tamil");
  const [isShift, setIsShift] = useState(true);

  // Animation state
  const [bursts, setBursts] = useState<BurstItem[]>([]);
  const [flyingLetters, setFlyingLetters] = useState<FlyingItem[]>([]);
  const [monkeyJumping, setMonkeyJumping] = useState(false);

  const pendingRootRef = useRef<string | null>(null);
  const textScrollRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLDivElement>(null);
  const idCounterRef = useRef(0);
  const { speak } = useSpeech();

  const nextId = useCallback(() => {
    idCounterRef.current += 1;
    return idCounterRef.current;
  }, []);

  const removeBurst = useCallback((id: number) => {
    setBursts((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const removeFlyingLetter = useCallback((id: number) => {
    setFlyingLetters((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const triggerAnimations = useCallback(
    (char: string, rect: DOMRect) => {
      const id = nextId();
      const bx = rect.left + rect.width / 2;
      const by = rect.top + rect.height / 2;

      setBursts((prev) => [...prev, { id, x: bx, y: by }]);
      setMonkeyJumping(true);
      setTimeout(() => setMonkeyJumping(false), 500);

      if (textAreaRef.current) {
        const taRect = textAreaRef.current.getBoundingClientRect();
        const endX = taRect.right - taRect.width * 0.12;
        const endY = taRect.top + taRect.height / 2;
        const flyId = nextId();
        setFlyingLetters((prev) => [
          ...prev,
          {
            id: flyId,
            char,
            startX: bx,
            startY: by,
            endX,
            endY,
          },
        ]);
      }
    },
    [nextId],
  );

  useEffect(() => {
    const orientationAny = screen.orientation as any;
    if (screen.orientation && typeof orientationAny.lock === "function") {
      orientationAny.lock("landscape").catch(() => {});
    }
    const screenAny = screen as any;
    if (typeof screenAny.lockOrientation === "function") {
      screenAny.lockOrientation("landscape");
    } else if (typeof screenAny.mozLockOrientation === "function") {
      screenAny.mozLockOrientation("landscape");
    } else if (typeof screenAny.msLockOrientation === "function") {
      screenAny.msLockOrientation("landscape");
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on text change
  useEffect(() => {
    if (textScrollRef.current) {
      textScrollRef.current.scrollLeft = textScrollRef.current.scrollWidth;
    }
  }, [text]);

  const showFlash = useCallback((_char: string) => {}, []);

  const fireChar = useCallback(
    (char: string, lang?: string) => {
      setText((prev) => prev + char);
      if (soundOn) speak(char, lang);
      showFlash(char);
    },
    [soundOn, speak, showFlash],
  );

  const handleLeftKey = useCallback(
    (rowIdx: number, colIdx: number, rect: DOMRect) => {
      const idx = rowIdx * 3 + colIdx;
      if (selectedConsonant) {
        const combos = getComboCells(selectedConsonant);
        const combo = combos[idx];
        if (combo) {
          const root = pendingRootRef.current;
          if (root) {
            setText((prev) => {
              if (prev.endsWith(root)) {
                return prev.slice(0, prev.length - root.length) + combo;
              }
              return prev + combo;
            });
          } else {
            setText((prev) => prev + combo);
          }
          if (soundOn) speak(combo);
          showFlash(combo);
          triggerAnimations(combo, rect);
          setSelectedConsonant(null);
          pendingRootRef.current = null;
        }
      } else {
        const vowel = VOWEL_GRID[rowIdx]?.[colIdx];
        if (vowel) {
          fireChar(vowel);
          triggerAnimations(vowel, rect);
        }
      }
    },
    [selectedConsonant, fireChar, soundOn, speak, showFlash, triggerAnimations],
  );

  const handleConsonant = useCallback(
    (root: string, rect: DOMRect) => {
      fireChar(root);
      triggerAnimations(root, rect);
      setSelectedConsonant(root);
      pendingRootRef.current = root;
    },
    [fireChar, triggerAnimations],
  );

  const backspace = useCallback(() => {
    setSelectedConsonant(null);
    pendingRootRef.current = null;
    setText((prev) => {
      const arr = [...prev];
      arr.pop();
      return arr.join("");
    });
  }, []);

  const clearAll = useCallback(() => {
    setText("");
    setSelectedConsonant(null);
    pendingRootRef.current = null;
  }, []);

  const copyToClipboard = useCallback(async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    toast.success("நகலெடுக்கப்பட்டது!", { description: "Copied!" });
  }, [text]);

  const toggleSound = useCallback(() => {
    setSoundOn((prev) => {
      const next = !prev;
      if (!next) window.speechSynthesis?.cancel();
      return next;
    });
  }, []);

  const handleListen = useCallback(() => {
    if (!("speechSynthesis" in window) || !text) return;
    if (isListening) {
      window.speechSynthesis.cancel();
      setIsListening(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "ta-IN";
    utt.rate = 0.85;
    utt.onend = () => setIsListening(false);
    utt.onerror = () => setIsListening(false);
    setIsListening(true);
    window.speechSynthesis.speak(utt);
  }, [text, isListening]);

  const handleReferenceSave = useCallback((val: string) => {
    setReferenceText(val);
    setIsEditingReference(false);
  }, []);

  const handleReferenceClear = useCallback(() => {
    setReferenceText("");
    setIsEditingReference(false);
  }, []);

  const switchMode = useCallback(() => {
    setKeyboardMode((prev) => {
      const next = nextMode(prev);
      setSelectedConsonant(null);
      pendingRootRef.current = null;
      return next;
    });
  }, []);

  const handleEnglishKey = useCallback(
    (char: string, rect: DOMRect) => {
      fireChar(char, "en-US");
      triggerAnimations(char, rect);
      if (isShift) setIsShift(false);
    },
    [fireChar, isShift, triggerAnimations],
  );

  const handleNumberKey = useCallback(
    (char: string, rect: DOMRect) => {
      fireChar(char, "en-US");
      triggerAnimations(char, rect);
    },
    [fireChar, triggerAnimations],
  );

  const year = new Date().getFullYear();

  const leftCells: (string | null)[][] = selectedConsonant
    ? (() => {
        const combos = getComboCells(selectedConsonant);
        return VOWEL_GRID.map((_, rowIdx) =>
          [0, 1, 2].map((colIdx) => combos[rowIdx * 3 + colIdx] ?? null),
        );
      })()
    : VOWEL_GRID;

  // Bottom action row shared buttons
  const langToggleButton = (
    <motion.button
      key="lang-toggle"
      type="button"
      data-ocid="keyboard.lang_toggle"
      onClick={switchMode}
      whileTap={{ scale: 0.82 }}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
      className="flex items-center justify-center font-bold
        transition-colors duration-75 select-none cursor-pointer"
      style={{
        background: "oklch(0.75 0.18 50)",
        color: "white",
        fontSize: "clamp(11px, 1.8vw, 16px)",
        minWidth: "clamp(36px, 6.5%, 58px)",
        borderRight: "1px solid oklch(0.62 0.16 50 / 0.6)",
        borderBottomLeftRadius: "8px",
      }}
    >
      🌐 {modeLabel(keyboardMode)}
    </motion.button>
  );

  return (
    <div
      className="h-screen w-screen overflow-hidden flex flex-col"
      style={{ background: "oklch(0.97 0.04 95)" }}
    >
      <Toaster position="top-center" />

      {/* ── ANIMATIONS OVERLAY ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <AnimatePresence>
          {bursts.map((burst) => (
            <FireworkBurst
              key={burst.id}
              burst={burst}
              onComplete={removeBurst}
            />
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {flyingLetters.map((item) => (
            <FlyingLetter
              key={item.id}
              item={item}
              onComplete={removeFlyingLetter}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* ── TOP BAR ── */}
      <motion.header
        className="flex-none flex items-center gap-2 px-3"
        animate={{
          background: [
            "oklch(0.62 0.22 25)",
            "oklch(0.60 0.22 60)",
            "oklch(0.58 0.22 140)",
            "oklch(0.58 0.22 230)",
            "oklch(0.60 0.22 290)",
            "oklch(0.62 0.22 330)",
            "oklch(0.62 0.22 25)",
          ],
        }}
        transition={{
          duration: 9,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        style={{
          height: "44px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
        }}
      >
        <motion.span
          className="font-display text-white select-none flex-none"
          animate={{ rotate: [0, 15, -15, 10, -5, 0] }}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 4,
          }}
          style={{ fontSize: "18px" }}
        >
          🎵
        </motion.span>
        <h1
          className="tamil-text font-bold text-white flex-none"
          style={{ fontSize: "clamp(12px, 1.8vw, 17px)" }}
        >
          தமிழ் விசைப்பலகை
        </h1>
        <div className="flex-1" />

        <button
          type="button"
          data-ocid="keyboard.sound_toggle"
          onClick={toggleSound}
          aria-label={soundOn ? "Mute" : "Unmute"}
          className="flex-none flex items-center gap-1 px-2 py-1 rounded-lg text-white transition-all hover:bg-white/20 active:bg-white/30"
          style={{ fontSize: "clamp(10px, 1.5vw, 13px)" }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {soundOn ? (
              <motion.span
                key="on"
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.7 }}
              >
                <Volume2 className="w-4 h-4" />
              </motion.span>
            ) : (
              <motion.span
                key="off"
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.7 }}
              >
                <VolumeX className="w-4 h-4" />
              </motion.span>
            )}
          </AnimatePresence>
          <span className="hidden sm:inline">{soundOn ? "ஒலி" : "முடக்கு"}</span>
        </button>

        <button
          type="button"
          data-ocid="keyboard.copy_button"
          onClick={copyToClipboard}
          disabled={!text}
          className="flex-none flex items-center gap-1 px-2 py-1 rounded-lg text-white hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          style={{ fontSize: "clamp(10px, 1.5vw, 13px)" }}
        >
          <Copy className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">நகல்</span>
        </button>

        <button
          type="button"
          data-ocid="keyboard.clear_button"
          onClick={clearAll}
          disabled={!text}
          className="flex-none flex items-center gap-1 px-2 py-1 rounded-lg bg-white/20 text-white hover:bg-white/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          style={{ fontSize: "clamp(10px, 1.5vw, 13px)" }}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">அழி</span>
        </button>

        <motion.button
          type="button"
          data-ocid="keyboard.listen_button"
          onClick={handleListen}
          disabled={!text}
          whileTap={{ scale: 0.95 }}
          className={`flex-none flex items-center gap-1 px-3 py-1 rounded-lg font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
            isListening ? "listen-pulse" : ""
          }`}
          style={{
            fontSize: "clamp(10px, 1.5vw, 14px)",
            background: isListening
              ? "oklch(0.55 0.22 330)"
              : "oklch(0.72 0.18 275)",
            color: "white",
            boxShadow: "0 2px 0 oklch(0.45 0.2 275 / 0.5)",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isListening ? (
              <motion.span
                key="stop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span className="tamil-text">நிறுத்து</span>
              </motion.span>
            ) : (
              <motion.span
                key="listen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span className="tamil-text">கேளுங்கள்</span>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.header>

      {/* ── REFERENCE TEXT BOX ── */}
      <ReferenceBox
        referenceText={referenceText}
        isEditing={isEditingReference}
        onEdit={() => setIsEditingReference(true)}
        onSave={handleReferenceSave}
        onClear={handleReferenceClear}
      />

      {/* ── MAIN CONTENT ── */}
      <div
        className="flex-1 overflow-hidden flex flex-col"
        style={{ minHeight: 0 }}
      >
        {/* Text display */}
        <div
          className="flex-none flex gap-2 px-2 pt-1 pb-1"
          style={{ height: "28%" }}
        >
          <div
            className="flex-1 flex flex-col rounded-2xl overflow-hidden"
            style={{
              position: "relative",
              border: "2px solid oklch(0.82 0.1 250)",
              background: "oklch(1 0 0)",
              boxShadow: "inset 0 2px 6px oklch(0.7 0.06 250 / 0.15)",
            }}
          >
            <div
              className="px-2 py-0.5 flex-none"
              style={{
                background: "oklch(0.88 0.12 185)",
                borderBottom: "1px solid oklch(0.78 0.14 185)",
              }}
            >
              <span
                className="tamil-text font-bold"
                style={{
                  fontSize: "clamp(9px, 1.2vw, 12px)",
                  color: "oklch(0.25 0.1 200)",
                }}
              >
                உங்கள் உரை
              </span>
            </div>
            <div
              data-ocid="keyboard.textarea"
              ref={(el) => {
                (textScrollRef as any).current = el;
                (textAreaRef as any).current = el;
              }}
              className="flex-1 overflow-y-auto overflow-x-hidden p-2 keyboard-scroll"
              style={{ wordBreak: "break-all" }}
            >
              <AnimatePresence mode="wait">
                {text ? (
                  <motion.div
                    key="text"
                    className="tamil-text"
                    style={{
                      fontSize: "clamp(14px, 2.4vw, 24px)",
                      lineHeight: 1.5,
                      color: "oklch(0.2 0.05 260)",
                    }}
                  >
                    {text}
                    {/* Sparkle cursor */}
                    <motion.span
                      animate={{
                        scale: [1, 1.35, 0.9, 1.2, 1],
                        rotate: [0, 20, -15, 10, 0],
                        opacity: [1, 0.8, 1, 0.9, 1],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                      className="inline-block ml-0.5 align-middle"
                      style={{ fontSize: "0.75em" }}
                    >
                      ✨
                    </motion.span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex items-center justify-center"
                  >
                    <p
                      className="tamil-text text-center"
                      style={{
                        fontSize: "clamp(11px, 1.6vw, 16px)",
                        color: "oklch(0.7 0.06 250)",
                      }}
                    >
                      இங்கே தட்டச்சு செய்யுங்கள்...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <WanderingMonkey isJumping={monkeyJumping} />
          </div>
        </div>

        {/* ── KEYBOARD ── */}
        <div className="flex-1 px-2 pb-1" style={{ minHeight: 0 }}>
          {/* Tamil mode hint */}
          {keyboardMode === "tamil" && selectedConsonant && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-1 rounded-lg py-0.5"
              style={{
                background: "oklch(0.88 0.18 275)",
                fontSize: "clamp(9px, 1.4vw, 12px)",
              }}
            >
              <span
                className="tamil-text font-bold"
                style={{ color: "oklch(0.2 0.12 270)" }}
              >
                {selectedConsonant} — இணைக்க ஒரு உயிர் தேர்வு செய்க
              </span>
            </motion.div>
          )}

          {/* ── TAMIL KEYBOARD ── */}
          {keyboardMode === "tamil" && (
            <div
              className="flex flex-col h-full"
              style={{
                border: "2px solid oklch(0.72 0.12 180)",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              {CONSONANT_GRID.map((cRow, rowIdx) => (
                <KeyRow
                  key={ROW_KEYS[rowIdx]}
                  rowIdx={rowIdx}
                  leftCells={leftCells[rowIdx]}
                  consonants={cRow}
                  selectedConsonant={selectedConsonant}
                  isComboMode={!!selectedConsonant}
                  onLeftKey={handleLeftKey}
                  onConsonant={handleConsonant}
                  onBackspace={backspace}
                />
              ))}

              {/* Bottom action row */}
              <div
                className="flex flex-none"
                style={{
                  height: "clamp(36px, 9%, 56px)",
                  borderTop: "2px solid oklch(0.72 0.12 180)",
                }}
              >
                {langToggleButton}
                <motion.button
                  type="button"
                  data-ocid="keyboard.period_button"
                  onClick={(e) => {
                    fireChar(".");
                    triggerAnimations(
                      ".",
                      e.currentTarget.getBoundingClientRect(),
                    );
                  }}
                  whileTap={{ scale: 0.82 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="flex items-center justify-center
                    transition-colors duration-75 select-none cursor-pointer font-bold"
                  style={{
                    background: "oklch(0.65 0.22 220)",
                    color: "white",
                    fontSize: "clamp(16px, 2.4vw, 24px)",
                    minWidth: "clamp(40px, 7%, 64px)",
                    borderRight: "1px solid oklch(0.55 0.22 220 / 0.6)",
                  }}
                >
                  🔵.
                </motion.button>
                <motion.button
                  type="button"
                  data-ocid="keyboard.comma_button"
                  onClick={(e) => {
                    fireChar(",");
                    triggerAnimations(
                      ",",
                      e.currentTarget.getBoundingClientRect(),
                    );
                  }}
                  whileTap={{ scale: 0.82 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="flex items-center justify-center
                    transition-colors duration-75 select-none cursor-pointer font-bold"
                  style={{
                    background: "oklch(0.65 0.22 145)",
                    color: "white",
                    fontSize: "clamp(16px, 2.4vw, 24px)",
                    minWidth: "clamp(40px, 7%, 64px)",
                    borderRight: "1px solid oklch(0.55 0.22 145 / 0.6)",
                  }}
                >
                  🟢,
                </motion.button>
                <motion.button
                  type="button"
                  data-ocid="keyboard.space_button"
                  onClick={() => {
                    setSelectedConsonant(null);
                    pendingRootRef.current = null;
                    setText((prev) => `${prev} `);
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="flex-1 flex items-center justify-center gap-1.5
                    transition-colors duration-75 select-none cursor-pointer font-bold tamil-text"
                  style={{
                    background: "oklch(0.78 0.16 265)",
                    color: "white",
                    fontSize: "clamp(10px, 1.5vw, 14px)",
                    borderRight: "1px solid oklch(0.62 0.16 250 / 0.6)",
                  }}
                >
                  🌟 <span style={{ fontSize: "1.2em" }}>␣</span> சரவணன் பர்வித்
                  அதிதீரன்
                </motion.button>
                <motion.button
                  type="button"
                  data-ocid="keyboard.aytham_button"
                  onClick={(e) => {
                    setSelectedConsonant(null);
                    pendingRootRef.current = null;
                    fireChar("ஃ");
                    triggerAnimations(
                      "ஃ",
                      e.currentTarget.getBoundingClientRect(),
                    );
                  }}
                  whileTap={{ scale: 0.82 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="flex items-center justify-center tamil-text
                    transition-colors duration-75 select-none cursor-pointer font-bold"
                  style={{
                    background: "oklch(0.72 0.20 30)",
                    color: "white",
                    fontSize: "clamp(15px, 2.4vw, 24px)",
                    minWidth: "clamp(40px, 8%, 64px)",
                    borderRight: "1px solid oklch(0.60 0.20 30 / 0.6)",
                  }}
                >
                  ஃ
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => {
                    setSelectedConsonant(null);
                    pendingRootRef.current = null;
                    setText((prev) => `${prev}\n`);
                  }}
                  whileTap={{ scale: 0.82 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="flex items-center justify-center
                    transition-colors duration-75 select-none cursor-pointer font-bold"
                  style={{
                    background: "oklch(0.55 0.20 145)",
                    color: "white",
                    fontSize: "clamp(14px, 2.2vw, 20px)",
                    minWidth: "clamp(48px, 10%, 80px)",
                    borderBottomRightRadius: "8px",
                  }}
                >
                  ✅
                </motion.button>
              </div>
            </div>
          )}

          {/* ── ENGLISH KEYBOARD ── */}
          {keyboardMode === "english" && (
            <div className="flex flex-col h-full" style={{ minHeight: 0 }}>
              <div className="flex-1" style={{ minHeight: 0 }}>
                <EnglishKeyboard
                  isShift={isShift}
                  onKey={handleEnglishKey}
                  onBackspace={backspace}
                  onToggleShift={() => setIsShift((s) => !s)}
                />
              </div>
              {/* English bottom action row */}
              <div
                className="flex flex-none mt-0"
                style={{
                  height: "clamp(36px, 9%, 56px)",
                  border: "2px solid oklch(0.72 0.10 220)",
                  borderTop: "none",
                  borderBottomLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                  overflow: "hidden",
                  marginTop: "-2px",
                }}
              >
                {langToggleButton}
                <motion.button
                  type="button"
                  data-ocid="keyboard.en_space_button"
                  onClick={() => setText((prev) => `${prev} `)}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="flex-1 flex items-center justify-center gap-1.5
                    transition-colors duration-75 select-none cursor-pointer font-bold"
                  style={{
                    background: "oklch(0.78 0.10 220)",
                    color: "white",
                    fontSize: "clamp(10px, 1.5vw, 14px)",
                    borderRight: "1px solid oklch(0.65 0.10 220 / 0.6)",
                  }}
                >
                  <span style={{ fontSize: "1.2em" }}>␣</span> Space
                </motion.button>
                <motion.button
                  type="button"
                  data-ocid="keyboard.en_enter_button"
                  onClick={() => setText((prev) => `${prev}\n`)}
                  whileTap={{ scale: 0.82 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="flex items-center justify-center
                    transition-colors duration-75 select-none cursor-pointer font-bold"
                  style={{
                    background: "oklch(0.6 0.18 160)",
                    color: "white",
                    fontSize: "clamp(14px, 2.2vw, 20px)",
                    minWidth: "clamp(48px, 10%, 80px)",
                  }}
                >
                  ↵
                </motion.button>
              </div>
            </div>
          )}

          {/* ── NUMBERS KEYBOARD ── */}
          {keyboardMode === "numbers" && (
            <div className="flex flex-col h-full" style={{ minHeight: 0 }}>
              <div className="flex-1" style={{ minHeight: 0 }}>
                <NumbersKeyboard
                  onKey={handleNumberKey}
                  onBackspace={backspace}
                />
              </div>
              {/* Numbers bottom action row */}
              <div
                className="flex flex-none"
                style={{
                  height: "clamp(36px, 9%, 56px)",
                  border: "2px solid oklch(0.72 0.10 300)",
                  borderTop: "none",
                  borderBottomLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                  overflow: "hidden",
                  marginTop: "-2px",
                }}
              >
                {langToggleButton}
                <motion.button
                  type="button"
                  data-ocid="keyboard.num_space_button"
                  onClick={() => setText((prev) => `${prev} `)}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="flex-1 flex items-center justify-center gap-1.5
                    transition-colors duration-75 select-none cursor-pointer font-bold"
                  style={{
                    background: "oklch(0.78 0.10 300)",
                    color: "white",
                    fontSize: "clamp(10px, 1.5vw, 14px)",
                    borderRight: "1px solid oklch(0.65 0.10 300 / 0.6)",
                  }}
                >
                  <span style={{ fontSize: "1.2em" }}>␣</span> Space
                </motion.button>
                <motion.button
                  type="button"
                  data-ocid="keyboard.num_enter_button"
                  onClick={() => setText((prev) => `${prev}\n`)}
                  whileTap={{ scale: 0.82 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="flex items-center justify-center
                    transition-colors duration-75 select-none cursor-pointer font-bold"
                  style={{
                    background: "oklch(0.6 0.18 160)",
                    color: "white",
                    fontSize: "clamp(14px, 2.2vw, 20px)",
                    minWidth: "clamp(48px, 10%, 80px)",
                  }}
                >
                  ↵
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
      <footer
        className="flex-none text-center py-0.5"
        style={{
          fontSize: "clamp(7px, 1vw, 10px)",
          color: "oklch(0.6 0.06 50)",
          background: "oklch(0.94 0.03 80)",
        }}
      >
        © {year}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          style={{ color: "oklch(0.55 0.12 250)" }}
        >
          Built with ❤️ using caffeine.ai
        </a>
      </footer>
    </div>
  );
}
