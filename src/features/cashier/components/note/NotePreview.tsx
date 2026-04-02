interface NotePreviewProps {
  previewNote: string;
  onClearAll: () => void;
}

export const NotePreview = ({ previewNote, onClearAll }: NotePreviewProps) => {
  if (!previewNote) return null;

  return (
    <div className="bg-muted/30 rounded-lg border p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
          Hasil Catatan (Struk)
        </p>
        <button
          onClick={onClearAll}
          className="text-destructive text-[10px] font-medium hover:underline"
        >
          Hapus semua
        </button>
      </div>
      <div className="text-foreground bg-background border-border/50 rounded border p-2 text-sm font-medium wrap-break-word">
        {previewNote}
      </div>
    </div>
  );
};
