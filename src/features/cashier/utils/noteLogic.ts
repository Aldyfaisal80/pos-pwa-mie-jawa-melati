// ─── Tag Groups ───────────────────────────────────────────────────────────────

export interface TagGroup {
  label: string;
  tags: string[];
  for: ("food" | "drink" | "universal")[];
}

export const TAG_GROUPS: TagGroup[] = [
  {
    label: "Tingkat Kepedasan",
    tags: ["Tidak Pedas", "Sedang", "Pedas", "Pedas Banget"],
    for: ["food"],
  },
  {
    label: "Porsi",
    tags: ["Bungkus", "Pisah", "Kuah Sedikit", "Kuah Banyak"],
    for: ["food"],
  },
  {
    label: "Minuman",
    tags: ["Hangat", "Kurang Manis", "Tanpa Gula", "Extra Es", "Sedikit Es"],
    for: ["drink"],
  },
  {
    label: "Tambahan",
    tags: ["Sambal Extra", "Kecap Extra", "No Bawang", "No MSG"],
    for: ["food", "universal"],
  },
];

// Mutual exclusion pairs — selecting one removes the others
export const EXCLUSIVE_CONFLICTS: Record<string, string[]> = {
  "Tidak Pedas": ["Sedang", "Pedas", "Pedas Banget"],
  Sedang: ["Tidak Pedas", "Pedas", "Pedas Banget"],
  Pedas: ["Tidak Pedas", "Sedang", "Pedas Banget"],
  "Pedas Banget": ["Tidak Pedas", "Sedang", "Pedas"],
  "Tanpa Gula": ["Kurang Manis"],
  "Kurang Manis": ["Tanpa Gula"],
  "Extra Es": ["Sedikit Es"],
  "Sedikit Es": ["Extra Es"],
};

export const MAX_FREE_TEXT = 150;

export const isDrinkCategory = (cat?: string): boolean => {
  if (!cat) return false;
  const lower = cat.toLowerCase();
  return (
    lower.includes("minum") ||
    lower.includes("drink") ||
    lower.includes("es ") ||
    lower === "es" ||
    lower.includes("jus") ||
    lower.includes("teh") ||
    lower.includes("kopi") ||
    lower.includes("susu") ||
    lower.includes("air")
  );
};

export const getRelevantGroups = (isDrink: boolean): TagGroup[] =>
  TAG_GROUPS.filter(
    (g) =>
      g.for.includes("universal") ||
      (isDrink ? g.for.includes("drink") : g.for.includes("food")),
  );

export const buildNote = (selected: Set<string>, freeText: string): string => {
  const parts = [...selected];
  if (freeText.trim()) parts.push(freeText.trim());
  return parts.join(", ");
};

export const parseNote = (
  note: string,
  allTags: string[],
): { selected: Set<string>; freeText: string } => {
  if (!note.trim()) return { selected: new Set(), freeText: "" };

  const selected = new Set<string>();
  const remaining: string[] = [];

  const parts = note.split(",").map((p) => p.trim());
  for (const part of parts) {
    const matched = allTags.find((t) => t.toLowerCase() === part.toLowerCase());
    if (matched) {
      selected.add(matched);
    } else if (part) {
      remaining.push(part);
    }
  }

  return { selected, freeText: remaining.join(", ") };
};
