## Why

The complete teacher script for lecture 1 is suitable for preparation and delivery, but it does not provide a concise visual aid that can remain on screen while the instructor explains the material. A dedicated slide deck will make the 90-minute lecture easier to follow while preserving the script as the authoritative teaching source.

## What Changes

- Add a Russian-language PowerPoint presentation for lecture 1 with scope `COMMON` and clearly separated optional `PRB` and `SII` slides.
- Structure the deck as a 16:9 teaching aid of approximately 22 slides aligned with the existing 90-minute lecture sequence.
- Use an alternating split layout: a topic-relevant image or original diagram on one side and short bullets with definitions, conclusions, formulas, or decision rules on the other.
- Add speaker notes where the teacher script contains timing, prompts, expected answers, or explanations that should not crowd the visible slide.
- Use licensed or otherwise permitted external visuals and original redrawn diagrams, with source attribution recorded in the deck; do not reproduce copyrighted passages or textbook figures without a suitable basis.
- Store the presentation under `attachments/` as a tracked instructor support artifact. Do not declare it in `course.yaml` as part of this change.
- Keep the existing teacher script, student lecture, concise notes, code repositories, and publication contract unchanged.

## Capabilities

### New Capabilities

- `lecture-presentations`: Defines observable content, profile separation, visual composition, attribution, accessibility, and verification requirements for instructor-facing lecture slide decks.

### Modified Capabilities

None.

## Impact

- Adds a new `.pptx` artifact under `attachments/` and may add locally stored, license-compatible visual assets needed by that deck.
- Uses `lectures-teacher/001_api-interface-layer-and-lifecycle.md` as the authoritative narrative and timing source.
- Uses the matching PRB and SII RPDs as normative sources and the configured API-design, microservices, and ML-systems literature as explanatory sources.
- Does not change executable course code, API contracts, student or teacher code repositories, published Markdown, or `course.yaml`.
- The unresolved publication-profile decision remains unresolved and does not affect this dormant instructor attachment; any later public release requires a separate reviewed publication decision.
- The known PRB RPD wording mismatch remains relevant: the presentation must preserve the detailed business-solution meaning rather than importing SII obligations into PRB.
