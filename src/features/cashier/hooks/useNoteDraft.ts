import { useState, useEffect, useMemo } from "react";
import {
  buildNote,
  parseNote,
  getRelevantGroups,
  isDrinkCategory,
  EXCLUSIVE_CONFLICTS,
} from "../utils/noteLogic";

interface UseNoteDraftOptions {
  open: boolean;
  initialNote: string;
  qty: number;
  categoryName?: string;
}

export const useNoteDraft = ({
  open,
  initialNote,
  qty,
  categoryName,
}: UseNoteDraftOptions) => {
  const isDrink = isDrinkCategory(categoryName);
  const relevantGroups = useMemo(() => getRelevantGroups(isDrink), [isDrink]);
  const allRelevantTags = useMemo(
    () => relevantGroups.flatMap((g) => g.tags),
    [relevantGroups],
  );

  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [freeText, setFreeText] = useState("");
  const [applyQty, setApplyQty] = useState(qty);

  useEffect(() => {
    if (!open) return;
    const parsed = parseNote(initialNote, allRelevantTags);
    setSelectedTags(parsed.selected);
    setFreeText(parsed.freeText);
    setApplyQty(qty);
  }, [open, initialNote, qty, allRelevantTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        const conflicts = EXCLUSIVE_CONFLICTS[tag] ?? [];
        conflicts.forEach((c) => next.delete(c));
        next.add(tag);
      }
      return next;
    });
  };

  const clearAll = () => {
    setSelectedTags(new Set());
    setFreeText("");
  };

  const previewNote = buildNote(selectedTags, freeText);

  return {
    isDrink,
    relevantGroups,
    selectedTags,
    freeText,
    applyQty,
    previewNote,
    setFreeText,
    setApplyQty,
    toggleTag,
    clearAll,
    buildCurrentNote: () => buildNote(selectedTags, freeText),
  };
};
