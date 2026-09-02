## 1. Source and Preservation Baseline

- [x] 1.1 Record the pre-change Git status and checksums for `course.yaml`, `lectures-teacher/001_api-interface-layer-and-lifecycle.md`, and the related student lecture and notes so later verification can prove they were not replaced or shortened.
- [x] 1.2 Build a slide-to-source map for the proposed 22-slide sequence, linking every slide to the relevant teacher-script block, timing, central claim, interaction, and speaker-note material.
- [x] 1.3 Verify COMMON coverage against both curriculum plans and verify the PRB and SII example content against their matching RPDs, explicitly preserving the known PRB wording decision and the lecture 2 boundary.

## 2. Visual Research and Design System

- [x] 2.1 Select the small set of external photographs or figures, open each original source rather than a search thumbnail, and record the creator, source URL, permission basis, required attribution, and usable resolution.
- [x] 2.2 Replace any visual with unclear permission or insufficient resolution with an original diagram or a clearly licensed alternative before it enters the deck.
- [x] 2.3 Define the 16:9 custom slide system with warm light background, dark navy text, teal contract accents, orange warning accents, explicit COMMON/PRB/SII labels, alternating 44/56 split layouts, and approved typography minimums.
- [x] 2.4 Define reusable original diagram treatments for consumer/provider boundaries, contract layers, implementation leakage, architecture contexts, request pipeline, lifecycle, and sync/async without copying textbook figures.

## 3. Presentation Authoring

- [x] 3.1 Create the minimal title slide and slides 2–7 covering the opening anti-example, one-click system chain, consumer distinction, API definition, API breadth, and four contract layers.
- [x] 3.2 Create slides 8–13 covering consumer-goal design, the six-field scenario card, implementation leakage, contract stability, observable versus hidden information, and table API versus domain operation.
- [x] 3.3 Create slides 14–17 covering monolith/modular-monolith/microservice trade-offs, network uncertainty, the single-request engineering pipeline, and the longer system/model lifecycle.
- [x] 3.4 Create the explicitly labeled PRB slide for CRM demand forecasting, including sales or reference data, forecast result, model/version context, BI use, and ERP planning without importing SII requirements.
- [x] 3.5 Create the explicitly labeled SII slide for plant-image inference, including image input, preprocessing, CV model, result metadata, feedback, and lifecycle without importing PRB requirements.
- [x] 3.6 Create slides 20–22 covering sync versus async, the context-diagram/error-correction interactive, the resolved opening question, summary algorithm, and bridge to lecture 2.
- [x] 3.7 Add concise Russian speaker notes for timing, lecturer prompts, expected answers, optional profile handling, misconceptions, and relevant demonstration checkpoints while keeping instructor-only guidance off the visible canvas.
- [x] 3.8 Add compact visible source labels where readable and complete visual/concept attribution in speaker notes so every external or materially adapted visual is independently auditable.
- [x] 3.9 Export the authored deck to `attachments/001_api-interface-layer-and-lifecycle.pptx` with embedded media and without adding support files to `sources/` or the publication manifest.

## 4. Technical and Visual Verification

- [x] 4.1 Render every slide to PNG, create a full-deck montage, and verify the expected slide count, narrative order, alternating image sides, profile labels, and overall visual consistency.
- [x] 4.2 Run the presentation overflow checker and correct every clipped object, off-canvas element, broken image, unintended title wrap, unreadable caption, and body text below the approved minimum.
- [x] 4.3 Inspect profile, pipeline, lifecycle, comparison, exercise, and closing slides individually at full resolution for balance, contrast, arrow and label clarity, and projection readability.
- [x] 4.4 Open the exported PowerPoint structure and verify that speaker notes, embedded media, hyperlinks or source URLs, and Russian text survived export.
- [x] 4.5 Re-render the corrected `.pptx`, rebuild the montage, and rerun automated checks; retain the artifact only when the second pass is clean.

## 5. Cross-Profile and Content Review

- [x] 5.1 Review the full deck against the slide-to-source map and confirm that every required lecture block is represented, the opening question is resolved, and lecture 2 topics are not taught prematurely.
- [x] 5.2 Test a PRB delivery by hiding the SII slide and confirm that the remaining COMMON plus PRB sequence is complete, correctly scoped, and internally coherent.
- [x] 5.3 Test an SII delivery by hiding the PRB slide and confirm that the remaining COMMON plus SII sequence is complete, correctly scoped, and internally coherent.
- [x] 5.4 Confirm that no profile distinction depends on color alone and that all visible claims, diagrams, and speaker-note explanations remain compatible with the matching normative source.

## 6. Repository and Publication Boundary

- [x] 6.1 Compare the post-change checksums and Git diff with the preservation baseline and confirm that the teacher script, student lecture, concise notes, seminars, homeworks, and external code links were not replaced, shortened, or otherwise modified.
- [x] 6.2 Confirm that `course.yaml` is unchanged, `sources/` remains ignored and unpublished, and the only intended educational artifact is the dormant instructor attachment under `attachments/`.
- [x] 6.3 Run strict OpenSpec validation for `create-lecture-1-presentation` and report the verified PowerPoint path, render results, visual-source audit, profile checks, and any intentionally retained limitations.
