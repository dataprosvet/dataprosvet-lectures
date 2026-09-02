## Purpose

Defines instructor-facing lecture presentations that faithfully condense authoritative teacher scripts into readable, source-attributed visual aids while preserving COMMON, PRB, and SII scope boundaries.

## ADDED Requirements

### Requirement: Presentation follows the authoritative lecture narrative
The lecture 1 presentation SHALL preserve the learning progression, central question, terminology, examples, and conclusion of `lectures-teacher/001_api-interface-layer-and-lifecycle.md` without replacing or shortening the teacher script itself. It SHALL cover API as a contract boundary, consumer-oriented design, observable contract layers, leakage of implementation details, module and service trade-offs, request pipeline, system lifecycle, synchronous and asynchronous interaction, and the context-diagram exercise. HTTP methods, status-code instruction, REST design, JSON Schema, and OpenAPI SHALL remain outside the explanatory scope reserved for lecture 2, except where an existing anti-example must be shown verbatim for critique.

#### Scenario: Instructor follows the 90-minute lecture sequence
- **WHEN** the instructor advances through the deck in slide order
- **THEN** the slides support the existing eight lecture blocks in the same conceptual order and resolve the opening `/run_model?file=/tmp/input.csv` question before the closing bridge to lecture 2

### Requirement: Visible slides remain concise and lecture-readable
The deck SHALL use a 16:9 canvas and approximately 22 slides, allowing small deviations only when needed for legibility or narrative coherence. Each ordinary content slide SHALL have one primary teaching claim, a topic-relevant image or original diagram on one side, and no more than five short bullets, definitions, formulas, or decision rules on the other side. The image side SHALL alternate across consecutive ordinary content slides. Title, transition, exercise, and closing slides MAY use a different composition when it better serves their teaching purpose.

#### Scenario: Deck is projected in a classroom
- **WHEN** every slide is rendered at standard presentation resolution
- **THEN** titles, bullets, labels, source captions, and diagrams are readable without overflow, clipping, unintended wrapping, or text smaller than the approved presentation minimums

### Requirement: Slide titles express teaching takeaways
Every non-title slide SHALL use a short audience-facing title that communicates the slide's main claim or question. Visible text SHALL be written in Russian, with an English term or abbreviation introduced only when it improves precision and then used consistently.

#### Scenario: Student reviews slide titles only
- **WHEN** a student reads the ordered slide titles without the speaker notes
- **THEN** the titles form a coherent summary from the opening API question through consumer goals, contract boundaries, architectural and lifecycle consequences, and the final answer

### Requirement: COMMON and profile content remain distinguishable
The shared conceptual sequence SHALL be marked or otherwise recognizable as `COMMON`. The PRB demand-forecasting slide SHALL remain a PRB-only business-system example involving CRM, forecasting, sales or reference data, BI, and ERP planning. The SII image-analysis slide SHALL remain an SII-only inference example involving a client, image input, preprocessing, a computer-vision model, result metadata, feedback, and model lifecycle. The deck SHALL NOT present either profile's technology or competency requirements as mandatory for the other profile.

#### Scenario: Instructor prepares one profile cohort
- **WHEN** the instructor hides the non-matching profile slide before class
- **THEN** the remaining deck preserves a complete COMMON narrative and includes only the matching profile's normative example

### Requirement: Visuals are relevant, permitted, and attributed
Every external image or reused figure SHALL have a documented source URL or bibliographic reference and a verified permission basis appropriate for inclusion in the instructor deck. Original diagrams SHALL be clearly distinguishable from reproduced figures and MAY state that they are adapted from named literature. The deck SHALL paraphrase source ideas and SHALL NOT reproduce copyrighted prose or an unlicensed textbook figure merely because it is locally available.

#### Scenario: Visual-source audit
- **WHEN** a reviewer inspects the completed deck and its notes or source slide
- **THEN** each non-original visual can be traced to its source and permission basis, and each adapted conceptual diagram identifies the underlying literature without copying protected prose

### Requirement: Speaker notes preserve delivery context
Slides that correspond to timed explanations, audience questions, mini-interactives, expected answers, demonstrations, or profile selection SHALL include concise speaker notes derived from the teacher script. Speaker notes SHALL keep instructor-only guidance out of the visible student-facing canvas and SHALL identify the relevant lecture block or timing cue where useful.

#### Scenario: Instructor presents without opening the Markdown script
- **WHEN** the instructor uses presenter view
- **THEN** the notes provide enough prompts to conduct the opening question, interface-classification check, architecture discussion, context-diagram exercise, error-correction interactive, and closing transition

### Requirement: Presentation is an instructor attachment, not published course content
The completed PowerPoint file SHALL be stored as `attachments/001_api-interface-layer-and-lifecycle.pptx`. This change SHALL NOT add the presentation to `course.yaml`, expose `sources/`, or modify student-facing lectures, notes, seminars, homeworks, or code-repository links.

#### Scenario: Repository publication validation
- **WHEN** repository paths and `course.yaml` are compared before and after implementation
- **THEN** the new deck exists under `attachments/` while the publication allowlist and all existing educational Markdown remain unchanged

### Requirement: The deck passes visual and structural verification
The final `.pptx` SHALL open successfully, contain no slide-canvas overflow, use embedded or reliably packaged media, and render consistently enough for classroom projection. Verification SHALL include a full slide render, montage inspection, automated overflow checking, and a second render after any correction. The review SHALL also confirm adequate contrast and that profile distinctions are not communicated by color alone.

#### Scenario: Final deck quality gate
- **WHEN** the implementation workflow renders and inspects the final presentation
- **THEN** every slide is present, visually balanced, free of clipped content and broken media, and the rendered montage demonstrates consistent alternating compositions and profile labeling

### Requirement: Visual approval remains separate from technical verification
A lecture presentation SHALL NOT be considered visually approved solely because it opens, renders, and passes automated overflow checks. The current lecture 1 attachment is explicitly recorded as requiring further instructor-led visual revision before it is treated as the final classroom deck, with composition, image selection, information density, and overall teaching appeal reviewed against instructor feedback.

#### Scenario: Current deck is considered for reuse
- **WHEN** the current lecture 1 PowerPoint is reviewed for a future classroom delivery
- **THEN** the review records that visual revision is still required and does not grant final visual approval until the instructor feedback has been addressed
