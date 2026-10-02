"use client";
import { useExperience } from "@/stores/experience";
import { chapters } from "./motion";
export function ChapterProgress() {
  const current = useExperience((s) => s.chapter);
  return (
    <nav className="chapter-progress" aria-label="Chapter progress">
      {chapters.map((chapter, i) => (
        <a
          href={`#${chapter.id}`}
          key={chapter.key}
          aria-current={current === chapter.key ? "location" : undefined}
          aria-label={`${i + 1}. ${chapter.label}`}
        >
          <span>{String(i + 1).padStart(2, "0")}</span>
          <i />
          <b>{chapter.label}</b>
        </a>
      ))}
    </nav>
  );
}
