## Context

See `proposal.md` for motivation. The current repository has complete teacher scripts for lectures 1 and 2, a technically valid but not yet visually approved lecture 1 deck, no lecture 2 deck, and PRB/SII variants embedded in the first three seminar and homework families. The new profile decision is asymmetric by material type: both RPDs remain authoritative for lectures, while only the PRB RPD and PRB curriculum map govern practical works and homeworks in this change.

The implementation must preserve teacher scripts as internal source-of-truth materials, keep presentation attachments dormant, avoid changing the publication manifest, and avoid expanding into student-facing full lectures or code-repository work. Local RPDs and books may be read for authoring but remain ignored and unpublished.

## Goals / Non-Goals

**Goals:**

- Make each numbered learning unit independently specifiable and reviewable.
- Produce two teachable, source-audited lecture scripts and two classroom-ready decks.
- Preserve a shared conceptual lecture core while making profile examples removable without narrative damage.
- Convert practical works and homeworks 1–3 to unambiguous PRB-only materials.
- Make source roles, version choices, defects, and author-created extensions visible to future maintainers.

**Non-Goals:**

- Create or publish full student lectures or concise notes.
- Resolve the one-course/two-profile publication decision.
- Edit lectures 3–9 or practical works and homeworks 4–12.
- Modify either private code repository or promise that an existing branch already satisfies revised content.
- Reproduce figures or long passages from locally available copyrighted books.

## Decisions

### Numbered capabilities own all unit-specific behavior

Each lecture number owns its teacher script and presentation in one capability because they teach the same outcomes and must remain synchronized. Each practical work and homework owns a separate capability because they are separate student interactions and files, even though homework completes the same RPD outcome and shares a `seminar/<number>-...` code branch.

`openspec/config.yaml` will record both the granularity rule and the new profile boundary. The intended context text states that lectures are `COMMON` plus distinct `PRB`/`SII` material, while course practical works, seminar meetings, homeworks, and their assessment evidence are `PRB` unless a later reviewed change explicitly reintroduces an SII practical track. The intended `rules.specs` entry requires one capability per numbered material and exact affected file paths.

Alternative considered: keep aggregate `teacher-lecture-scripts`, `lecture-presentations`, and profiled practical/homework capabilities. Rejected because a delta against them cannot show which numbered unit changed and encourages unrelated requirements to move together.

### Source research uses a per-claim role matrix

Before rewriting, each lecture receives a matrix with columns for claim/topic, profile scope, normative RPD location, RPD-listed source, official technical source, author-selected explanation, stable locator, and intended use. The implementation will verify primary pages rather than rely on bibliography titles alone.

The hierarchy is:

1. matching RPD for required coverage and profile meaning;
2. matching derived curriculum map for course placement;
3. university methodical guide for local teaching structure;
4. RPD-listed books and articles for explanation;
5. official standards and documentation for protocol/version accuracy;
6. author-selected literature for additional pedagogy.

The OpenAPI material will pin the taught 3.1 patch version. HTTP semantics will use the current official RFC family. The incorrect article DOI in the RPD will be recorded as a source defect, preserving the RPD wording alongside the verified DOI rather than silently substituting it.

Alternative considered: cite only the local books already used by the scripts. Rejected because it would not satisfy the request to recover RPD-listed sources and would leave moving technical references unaudited.

### Reformatting means progressive disclosure, not unconditional expansion

Lecture 1 will keep its eight-block progression but strengthen transitions, definitions, profile selection cues, and the relationship among request lifecycle, product/model lifecycle, and architecture choice. Redundant source lists and repeated summaries may be consolidated only after a preservation comparison proves no required idea is lost.

Lecture 2 will separate:

- live core: HTTP message anatomy; methods/statuses; safety/idempotency; resource and representation model; essential REST constraints; validation; a coherent OpenAPI walkthrough; compatibility;
- optional live depth: conditional requests, richer pagination and format trade-offs;
- reference/appendix: additional method edge cases, research context, extended schemas, and secondary format examples.

The optional and appendix layers remain useful but do not compete with the 90-minute core.

Alternative considered: split lecture 2 into two numbered lectures. Rejected because the approved nine-lecture sequence and RPD allocation treat this as one lecture.

### Lecture examples share concepts, not profile payloads

Both lectures use a stable `COMMON` conceptual vocabulary: consumer, provider, contract, request, response, error envelope, `request_id`, API/schema/model versions, and compatibility. PRB examples use forecasting, data upload, CRM/BI/ERP integration, and tabular formats. SII examples use inference, image or binary/reference payloads, preprocessing, result metadata, and model lifecycle.

Practical works and homeworks use only the PRB domain. Any SII alternative, SII acceptance criterion, or phrase suggesting a profile choice is removed from those six materials. The lectures may still link to the PRB practicals, but must say explicitly that those course activities are PRB-only rather than imply dual-profile delivery.

Alternative considered: keep hidden SII variants in teacher-only notes for possible reuse. Rejected for this change because hidden variants would leave scope ambiguous and would not be independently specified.

### The two presentations use one revised visual language

The lecture 1 deck is revised first and becomes the approved visual reference for lecture 2 only after instructor-facing visual findings are resolved. Both decks use one claim per slide, concise Russian copy, readable code/protocol excerpts, explicit textual profile labels, and speaker notes for timing, interactions, expected answers, and `[Sources]` blocks.

The implementation follows the presentation workflow: inspect the complete source deck; preserve its editable master/layout structure while revising inherited elements; build the lecture 2 deck with the approved visual language; render every slide; inspect each slide and a montage; run overflow and structural checks; inspect notes, placeholders, media, and source records; then repeat after corrections. External visuals require a stable source and permission basis; original diagrams are preferred for API abstractions.

Alternative considered: generate lecture 2 immediately from the current lecture 1 deck. Rejected because the current main spec explicitly withholds final visual approval.

### Existing aggregate requirements are removed rather than duplicated

Delta specs remove the old unit-specific requirements from `teacher-lecture-scripts` and `lecture-presentations`. Archival therefore leaves the numbered capabilities as the only owners of lectures 1 and 2. General conventions remain in `openspec/config.yaml`, where they apply consistently to future numbered capabilities.

Alternative considered: copy requirements into numbered capabilities and leave the aggregate specs untouched. Rejected because conflicting future edits could satisfy one capability while violating the other.

## Risks / Trade-offs

- [Removing aggregate requirements makes historical specs look sparse] → Preserve the migration explanation in the archived change and keep durable cross-unit conventions in `config.yaml`.
- [Lecture 2 optional material is mistaken for required live coverage] → Use explicit labels and validate that the core alone forms a continuous 90-minute path.
- [PRB-only practicals conflict with existing dual-profile code branches or wording] → Limit this change to course materials; record branch mismatches as follow-up work instead of mutating external repositories implicitly.
- [RPD bibliography contains stale, incorrect, or inaccessible references] → Record verification status and defects; use stable official or legally accessible alternatives for technical accuracy without claiming they were listed verbatim in the RPD.
- [A source-rich lecture becomes citation-heavy] → Keep full source mapping in the teacher script and speaker notes; visible slides retain only compact attribution where needed.
- [Presentation redesign damages editable structure or notes] → Preserve the original deck, edit a copy through the approved presentation workflow, and verify final PPTX structure as well as rendered images.
- [Profile examples drift into shared requirements] → Run separate `COMMON`, `PRB`, and `SII` coverage checks for lectures and a negative SII-content check for all six practical/homework files.

## Migration Plan

1. Record checksums, Git status, file inventory, source locators, and rendered lecture 1 deck as the preservation baseline.
2. Add the profile-scope and capability-granularity decisions to `openspec/config.yaml` without changing unrelated course context.
3. Build and verify source matrices for lectures 1 and 2, including source defects and stable technical-version links.
4. Reformat lecture 1, then lecture 2, comparing required coverage and profile meaning with the baseline after each revision.
5. Revise the lecture 1 deck and obtain a clean visual/structural QA result; use that approved language to create and verify lecture 2.
6. Convert practical works and homeworks 1–3 to PRB-only scope and run cross-file consistency, safety, and negative SII checks.
7. Run strict OpenSpec validation and preservation checks proving `course.yaml`, out-of-scope content, and code repositories were not changed.

Rollback is file-scoped: restore the preserved versions of each affected Markdown or presentation artifact and revert only the added `config.yaml` decisions if acceptance fails. The original lecture 1 deck is retained until the revised copy passes final verification.
