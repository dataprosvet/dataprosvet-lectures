## Context

See `proposal.md` for motivation. The authoritative source is the 541-line teacher script for lecture 1, which already defines an eight-block, 90-minute progression and contains instructor prompts, profile-specific examples, source mapping, and executable checkpoints. The presentation is a supporting classroom artifact, not a new student lecture or a replacement for the script.

The repository has no existing presentation template. The requested visual direction is explicit: topic imagery on one side and concise bullets on the other. That direction makes a custom visual system more appropriate than selecting a generic template. The artifact belongs in `attachments/` and remains dormant because this change does not alter `course.yaml`.

## Goals / Non-Goals

**Goals:**

- Produce a classroom-readable PowerPoint that supports the complete lecture narrative in about 22 slides.
- Make each slide useful during oral explanation by pairing a single claim with one dominant visual.
- Preserve COMMON content and allow the instructor to hide either the PRB or SII profile slide without breaking the story.
- Keep a verifiable chain from lecture claims and visuals to authoritative or permitted sources.
- Deliver a rendered and visually inspected artifact rather than relying on successful file generation alone.

**Non-Goals:**

- Rewrite, shorten, or replace the teacher script, student lecture, or concise notes.
- Teach the detailed HTTP, REST, schema, and OpenAPI material reserved for lecture 2.
- Publish the deck through `course.yaml` or resolve the repository-wide publication-profile decision.
- Add or modify executable teaching code, demonstrations, or either external code repository.
- Build a reusable presentation framework for all nine lectures in this change.

## Decisions

### Use one shared deck with two optional profile slides

The deck will contain the complete COMMON sequence plus one visibly labeled PRB slide and one visibly labeled SII slide. The instructor can hide the non-matching slide before class. This avoids duplicating about twenty shared slides while keeping normative profile content separate.

Alternative considered: two complete decks. Rejected because it would create avoidable drift in the shared API definitions, examples, and fixes.

### Use a 22-slide cumulative narrative

The slide sequence will be:

1. minimal title;
2. opening `/run_model` question;
3. one click crossing system boundaries;
4. consumer versus human beneficiary;
5. API as an explicit promise;
6. API beyond Web API;
7. four contract layers;
8. design begins with the consumer goal;
9. six-field scenario card;
10. implementation-leaking anti-example;
11. contract stability under implementation change;
12. observable versus hidden information;
13. table API versus domain operation;
14. monolith, modular monolith, and microservices;
15. network uncertainty and distributed cost;
16. single-request engineering pipeline;
17. system and model lifecycle;
18. PRB demand forecast;
19. SII image inference;
20. synchronous versus asynchronous interaction;
21. context-diagram exercise and error check;
22. answer, synthesis, and bridge to lecture 2.

This follows the source sequence while combining adjacent ideas where separate slides would repeat the same visual or conclusion.

Alternative considered: one slide for every Markdown subsection. Rejected because it would produce a dense deck with frequent low-value transitions and encourage reading from slides.

### Use an alternating split composition with explicit exceptions

Ordinary content slides will reserve roughly 44% of the canvas for a dominant image or diagram and 56% for the title and concise content. The visual side alternates left and right. The title slide remains minimal; the exercise slide uses a larger workspace diagram; the closing slide resolves the opening question rather than forcing a split layout.

The base visual system will use a warm light background, dark navy text, teal for contract boundaries, orange for warnings or costs, and distinct text labels for `COMMON`, `PRB`, and `SII`. Profile meaning will never depend on color alone. Titles will be at least 35 pt, body text at least 18 pt, and source captions may be smaller only when they remain readable in the verified render.

Alternative considered: dense card grids. Rejected because they compete with the lecturer and reduce projection readability.

### Prefer original diagrams and a small set of licensed photographs

Core abstractions such as consumer → API → provider, the four contract layers, boundary leakage, request pipeline, lifecycle, and sync/async will be redrawn in one visual language. Photographs will be reserved for the opening human context and the two profile examples, where a real-world scene adds meaning. An official architecture or MLOps figure may be used only if its reuse terms are suitable and its density remains legible; otherwise its concept will be paraphrased in an original diagram with attribution.

Candidate sources include the configured Lauret, Newman, and Huyen literature for concepts; official AWS and Google Cloud architecture articles; Wikimedia Commons for a retail scene; and a license-compatible plant-leaf photograph. Each downloaded source will be checked at implementation time for provenance, resolution, and reuse terms rather than relying on search-result thumbnails.

Alternative considered: extracting figures directly from local textbooks. Rejected as the default because local possession does not establish permission to redistribute figures in a tracked deck.

### Keep attribution close to the artifact

Each external visual will have a compact source caption or a clear source entry in speaker notes. A final source list may be added to notes or as a hidden appendix only if needed to preserve readable slides. Original diagrams will cite the conceptual source when materially adapted. This makes the `.pptx` independently auditable without publishing ignored `sources/` files.

### Derive visible copy and notes from different layers of the script

Visible copy will contain definitions, conclusions, decision tests, compact formulas, and short examples. Instructor timing, prompts, expected answers, warnings about misconceptions, and checkpoint commands will move to speaker notes. The implementation will maintain a slide-to-source mapping during authoring so that condensation does not silently omit a lecture block.

### Build, render, inspect, and iterate

Implementation will follow the local presentation workflow: generate the `.pptx`, render every slide to PNG, create a montage, run the overflow checker, visually inspect individual slides where needed, correct issues, and repeat the render and checks. The final delivery will include only the verified PowerPoint and any intentionally tracked support assets; temporary downloads and renders will remain outside the repository.

## Risks / Trade-offs

- [External visual has unclear reuse rights] → Prefer original diagrams and permissively licensed photographs; record the permission basis before embedding.
- [Twenty-two slides compress too much detail] → Keep the script authoritative, move teaching prompts into notes, and allow a small slide-count deviation when readability requires it.
- [Both profile slides imply both profiles are mandatory] → Use explicit PRB/SII labels and notes instructing the teacher to hide the non-matching slide.
- [Alternating layouts become mechanical] → Permit deliberate title, exercise, comparison, and closing exceptions while retaining the dominant side-by-side rhythm.
- [Source captions become unreadably small] → Put full attribution in notes and keep only a compact readable source label on the canvas when necessary.
- [Speaker notes or media are lost by the generation path] → Verify notes and embedded media in the exported `.pptx`, not only in intermediate source data.
- [Presentation drifts from the Markdown after later edits] → Treat the script as the source of truth and record a future maintenance task rather than allowing the deck to become normative.

## Migration Plan

1. Create the deck as a new attachment without changing any existing content.
2. Verify the completed file against the teacher script, profile sources, visual-source log, rendered slides, and repository publication boundary.
3. If the deck fails review, remove or replace only the new attachment and temporary implementation assets; no migration or rollback of existing course content is required.
