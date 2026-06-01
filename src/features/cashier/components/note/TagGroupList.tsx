import type { TagGroup } from "../../utils/noteLogic";

interface TagGroupListProps {
  groups: TagGroup[];
  selectedTags: Set<string>;
  onToggle: (tag: string) => void;
}

export const TagGroupList = ({
  groups,
  selectedTags,
  onToggle,
}: TagGroupListProps) => (
  <div className="space-y-4">
    {groups.map((group) => (
      <div key={group.label}>
        <p className="text-muted-foreground mb-2 text-[10px] font-bold tracking-wider uppercase">
          {group.label}
        </p>
        <div className="flex flex-wrap gap-2">
          {group.tags.map((tag) => {
            const isActive = selectedTags.has(tag);
            return (
              <button
                key={tag}
                onClick={() => onToggle(tag)}
                className={`rounded-md border px-3 py-1.5 text-xs font-semibold shadow-sm transition-all select-none active:scale-95 ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-primary/20"
                    : "bg-background border-border text-foreground hover:bg-muted"
                } `}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);
