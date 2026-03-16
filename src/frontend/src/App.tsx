import { Toaster } from "@/components/ui/sonner";
import { Copy, Delete, Square, Trash2, Volume2, VolumeX } from "lucide-react";
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

// ── SPEECH ────────────────────────────────────────────────────────────────────

const VIRAMA = "\u0BCD"; // ்

// ங series — use English phonetics for clear TTS pronunciation
const PRONUNCIATION_OVERRIDES: Record<string, { text: string; lang: string }> =
  {
    ங்: { text: "ng", lang: "en-US" },
    "ங\u0BBE": { text: "ngaa", lang: "en-US" },
    "ங\u0BBF": { text: "ngi", lang: "en-US" },
    "ங\u0BC0": { text: "ngii", lang: "en-US" },
    "ங\u0BC1": { text: "ngu", lang: "en-US" },
    "ங\u0BC2": { text: "nguu", lang: "en-US" },
    "ங\u0BC6": { text: "nge", lang: "en-US" },
    "ங\u0BC7": { text: "ngee", lang: "en-US" },
    "ங\u0BC8": { text: "ngai", lang: "en-US" },
    "ங\u0BCA": { text: "ngo", lang: "en-US" },
    "ங\u0BCB": { text: "ngoo", lang: "en-US" },
    "ங\u0BCC": { text: "ngau", lang: "en-US" },
  };

function getPronunciation(char: string): { text: string; lang: string } {
  const normalized = char.normalize("NFC");
  const override = PRONUNCIATION_OVERRIDES[normalized];
  if (override) return override;
  if (normalized.endsWith(VIRAMA)) {
    return { text: normalized.slice(0, normalized.length - 1), lang: "ta-IN" };
  }
  return { text: normalized, lang: "ta-IN" };
}

function useSpeech() {
  const speak = useCallback((char: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const { text, lang } = getPronunciation(char);
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang;
    utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  }, []);
  return { speak };
}

// ── FLASH CARD ────────────────────────────────────────────────────────────────

function FlashCard({ char, flashKey }: { char: string; flashKey: number }) {
  return (
    <div
      data-ocid="keyboard.flashcard"
      className="relative flex items-center justify-center w-full h-full rounded-2xl overflow-hidden"
      style={{
        background: "oklch(0.95 0.12 85)",
        border: "3px solid oklch(0.82 0.18 75)",
        boxShadow:
          "inset 0 2px 8px oklch(0.7 0.15 75 / 0.3), 0 4px 16px oklch(0.7 0.15 75 / 0.2)",
      }}
    >
      <div
        className="absolute top-2 right-2 w-6 h-6 rounded-full opacity-25"
        style={{ background: "oklch(0.85 0.2 70)" }}
      />
      <AnimatePresence mode="wait">
        {char ? (
          <motion.div
            key={flashKey}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="tamil-text font-bold select-none"
            style={{
              fontSize: "clamp(48px, 8vw, 120px)",
              lineHeight: 1,
              color: "oklch(0.35 0.18 30)",
              textShadow: "0 3px 0 oklch(0.7 0.18 70 / 0.4)",
            }}
          >
            {char}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div
              className="tamil-text select-none"
              style={{
                fontSize: "clamp(28px, 5vw, 56px)",
                color: "oklch(0.65 0.12 75)",
              }}
            >
              அ
            </div>
            <p
              className="tamil-text mt-1"
              style={{
                fontSize: "clamp(8px, 1.2vw, 11px)",
                color: "oklch(0.6 0.08 70)",
              }}
            >
              விசையை அழுத்துங்கள்
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── KEYBOARD ROW ──────────────────────────────────────────────────────────────────

interface KeyRowProps {
  rowIdx: number;
  leftCells: (string | null)[];
  consonants: (string | null)[];
  selectedConsonant: string | null;
  isComboMode: boolean;
  onLeftKey: (rowIdx: number, colIdx: number) => void;
  onConsonant: (root: string) => void;
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
  const leftKeyStyle = (active: boolean): React.CSSProperties => ({
    background: active ? "oklch(0.88 0.18 275)" : "oklch(0.98 0.1 88)",
    color: active ? "oklch(0.15 0.1 270)" : "oklch(0.3 0.12 55)",
    border: `1.5px solid ${active ? "oklch(0.72 0.2 275)" : "oklch(0.8 0.16 80)"}`,
    fontWeight: 700,
  });

  const consonantKeyStyle = (
    root: string | null,
    isSelected: boolean,
  ): React.CSSProperties => ({
    background: isSelected
      ? "oklch(0.62 0.22 25)"
      : root === null
        ? "oklch(0.65 0.22 30)"
        : "oklch(0.97 0.07 185)",
    color: isSelected || root === null ? "white" : "oklch(0.22 0.1 200)",
    border: `1.5px solid ${
      isSelected
        ? "oklch(0.52 0.2 25)"
        : root === null
          ? "oklch(0.52 0.2 28)"
          : "oklch(0.76 0.14 185)"
    }`,
    fontWeight: 700,
    transform: isSelected ? "translateY(1px)" : undefined,
    boxShadow: isSelected ? "none" : undefined,
  });

  return (
    <div className="flex gap-1 flex-1">
      {[0, 1, 2].map((colIdx) => {
        const cell = leftCells[colIdx] ?? null;
        return (
          <button
            key={`left-col-${colIdx}`}
            type="button"
            data-ocid={`keyboard.left_key.${rowIdx * 3 + colIdx + 1}`}
            onClick={() => onLeftKey(rowIdx, colIdx)}
            disabled={!cell}
            className="flex-1 flex items-center justify-center rounded-xl tamil-text
              shadow-key active:shadow-key-active active:translate-y-px
              transition-all duration-75 select-none cursor-pointer
              disabled:opacity-30 disabled:cursor-default"
            style={{
              ...leftKeyStyle(isComboMode),
              fontSize: "clamp(13px, 2.2vw, 22px)",
            }}
          >
            {cell ?? ""}
          </button>
        );
      })}

      <div
        className="w-px flex-none"
        style={{ background: "oklch(0.8 0.08 200)" }}
      />

      {consonants.map((root) =>
        root === null ? (
          <button
            key="backspace"
            type="button"
            data-ocid="keyboard.backspace_button"
            onClick={onBackspace}
            className="flex-1 flex items-center justify-center rounded-xl
              shadow-key active:shadow-key-active active:translate-y-px
              transition-all duration-75 select-none cursor-pointer"
            style={consonantKeyStyle(null, false)}
          >
            <Delete className="w-4 h-4" />
          </button>
        ) : (
          <button
            key={root}
            type="button"
            data-ocid={`keyboard.consonant_key.${root}`}
            onClick={() => onConsonant(root)}
            className="flex-1 flex items-center justify-center rounded-xl tamil-text
              shadow-key active:shadow-key-active active:translate-y-px
              transition-all duration-75 select-none cursor-pointer"
            style={{
              ...consonantKeyStyle(root, selectedConsonant === root),
              fontSize: "clamp(12px, 2vw, 20px)",
            }}
          >
            {root}
          </button>
        ),
      )}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────

export default function App() {
  const [text, setText] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [flashChar, setFlashChar] = useState("");
  const [flashKey, setFlashKey] = useState(0);
  const [selectedConsonant, setSelectedConsonant] = useState<string | null>(
    null,
  );
  const pendingRootRef = useRef<string | null>(null);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textScrollRef = useRef<HTMLDivElement>(null);
  const { speak } = useSpeech();

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

  const showFlash = useCallback((char: string) => {
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    setFlashChar(char);
    setFlashKey((k) => k + 1);
    flashTimeoutRef.current = setTimeout(() => setFlashChar(""), 1500);
  }, []);

  const fireChar = useCallback(
    (char: string) => {
      setText((prev) => prev + char);
      if (soundOn) speak(char);
      showFlash(char);
    },
    [soundOn, speak, showFlash],
  );

  const handleLeftKey = useCallback(
    (rowIdx: number, colIdx: number) => {
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
          setSelectedConsonant(null);
          pendingRootRef.current = null;
        }
      } else {
        const vowel = VOWEL_GRID[rowIdx]?.[colIdx];
        if (vowel) fireChar(vowel);
      }
    },
    [selectedConsonant, fireChar, soundOn, speak, showFlash],
  );

  const handleConsonant = useCallback(
    (root: string) => {
      fireChar(root);
      setSelectedConsonant(root);
      pendingRootRef.current = root;
    },
    [fireChar],
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
    setFlashChar("");
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

  const year = new Date().getFullYear();

  const leftCells: (string | null)[][] = selectedConsonant
    ? (() => {
        const combos = getComboCells(selectedConsonant);
        return VOWEL_GRID.map((_, rowIdx) =>
          [0, 1, 2].map((colIdx) => combos[rowIdx * 3 + colIdx] ?? null),
        );
      })()
    : VOWEL_GRID;

  return (
    <div
      className="h-screen w-screen overflow-hidden flex flex-col"
      style={{ background: "oklch(0.97 0.04 95)" }}
    >
      <Toaster position="top-center" />

      {/* ── TOP BAR ── */}
      <header
        className="flex-none flex items-center gap-2 px-3"
        style={{
          height: "44px",
          background: "oklch(0.62 0.22 25)",
          boxShadow: "0 2px 8px oklch(0.5 0.2 25 / 0.4)",
        }}
      >
        <span
          className="font-display text-white select-none flex-none"
          style={{ fontSize: "16px" }}
        >
          🎵
        </span>
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
      </header>

      {/* ── MAIN CONTENT ── */}
      <div
        className="flex-1 overflow-hidden flex flex-col"
        style={{ minHeight: 0 }}
      >
        {/* Text display */}
        <div
          className="flex-none flex gap-2 px-2 pt-2 pb-1"
          style={{ height: "28%" }}
        >
          <div
            className="flex-none"
            style={{ width: "clamp(80px, 22%, 160px)" }}
          >
            <FlashCard char={flashChar} flashKey={flashKey} />
          </div>
          <div
            className="flex-1 flex flex-col rounded-2xl overflow-hidden"
            style={{
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
              ref={textScrollRef}
              className="flex-1 overflow-y-auto overflow-x-hidden p-2 keyboard-scroll"
              style={{ wordBreak: "break-all" }}
            >
              <AnimatePresence mode="wait">
                {text ? (
                  <motion.div
                    key="text"
                    className="tamil-text"
                    style={{
                      fontSize: "clamp(16px, 2.8vw, 28px)",
                      lineHeight: 1.5,
                      color: "oklch(0.2 0.05 260)",
                    }}
                  >
                    {text}
                    <span
                      className="inline-block w-0.5 h-5 ml-0.5 animate-pulse align-middle"
                      style={{ background: "oklch(0.62 0.22 25)" }}
                    />
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
          </div>
        </div>

        {/* ── KEYBOARD ── */}
        <div className="flex-1 px-2 pb-1" style={{ minHeight: 0 }}>
          {selectedConsonant && (
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

          <div className="flex flex-col gap-1 h-full">
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
              className="flex gap-1"
              style={{ height: "clamp(32px, 8%, 52px)" }}
            >
              <button
                type="button"
                data-ocid="keyboard.space_button"
                onClick={() => {
                  setSelectedConsonant(null);
                  pendingRootRef.current = null;
                  setText((prev) => `${prev} `);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl
                  shadow-key active:shadow-key-active active:translate-y-px
                  transition-all duration-75 select-none cursor-pointer font-bold tamil-text"
                style={{
                  background: "oklch(0.78 0.16 265)",
                  color: "white",
                  border: "1.5px solid oklch(0.62 0.2 260)",
                  fontSize: "clamp(10px, 1.6vw, 14px)",
                }}
              >
                <span style={{ fontSize: "1.2em" }}>␣</span> தமிழ்
              </button>
              <button
                type="button"
                data-ocid="keyboard.aytham_button"
                onClick={() => {
                  setSelectedConsonant(null);
                  pendingRootRef.current = null;
                  fireChar("ஃ");
                }}
                className="flex items-center justify-center rounded-xl tamil-text
                  shadow-key active:shadow-key-active active:translate-y-px
                  transition-all duration-75 select-none cursor-pointer font-bold"
                style={{
                  background: "oklch(0.78 0.18 265)",
                  color: "white",
                  border: "1.5px solid oklch(0.62 0.2 260)",
                  fontSize: "clamp(13px, 2.2vw, 22px)",
                  minWidth: "clamp(36px, 7%, 60px)",
                }}
              >
                ஃ
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedConsonant(null);
                  pendingRootRef.current = null;
                  setText((prev) => `${prev}\n`);
                }}
                className="flex items-center justify-center rounded-xl
                  shadow-key active:shadow-key-active active:translate-y-px
                  transition-all duration-75 select-none cursor-pointer font-bold"
                style={{
                  background: "oklch(0.6 0.18 160)",
                  color: "white",
                  border: "1.5px solid oklch(0.48 0.17 160)",
                  fontSize: "clamp(12px, 2vw, 18px)",
                  minWidth: "clamp(44px, 9%, 72px)",
                }}
              >
                ↵
              </button>
            </div>
          </div>
        </div>

        <div
          className="flex-none text-center py-0.5"
          style={{ fontSize: "9px", color: "oklch(0.6 0.06 250)" }}
        >
          © {year}{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </div>
      </div>
    </div>
  );
}
