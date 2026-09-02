## Context

The repository already publishes metadata and `attachments/lecture_1.pdf` for the `api-tech-introduction` lecture. A presentation-derived complete student lecture exists at `lectures/001_api-tech-introduction.md`, but it is not declared in `course.yaml`, and `lecture-notes/` does not yet contain the matching concise product. The presentation covers architectural evolution, CORBA, SOAP/WSDL, REST, gRPC, ML-system structure, scaling, model lifecycle, and RAISA. That breadth overlaps later lectures and includes several deliberately introductory simplifications.

The active `revise-first-two-api-lectures-and-prb-practicals` change introduces `lecture-01-api-interface-layer` as the numbered capability for the teacher script and presentation. This change must extend that capability after the prerequisite change lands or reconcile against its delta before implementation. Creating another lecture-1 capability would violate the repository's numbered-capability rule.

The unresolved publication-profile decision prevents a profile-specific path from being presented as universal. The published texts therefore use a `COMMON` conceptual core, label profile-specific illustrations, and identify the related seminar as PRB-only.

## Goals / Non-Goals

**Goals:**

- Turn the existing presentation-derived Markdown into a complete, independently useful student lecture.
- Add a substantially shorter note optimized for definitions, conceptual relationships, comparison, warnings, and recall.
- Keep both student products aligned with the presentation without allowing slide shorthand to override the RPDs, course sequence, or verified technical sources.
- Publish both texts through the existing lecture-1 manifest entry without changing the presentation or metadata identity.
- Make profile scope, later-lecture boundaries, source priority, and concise-versus-complete differentiation independently verifiable.

**Non-Goals:**

- Revise the teacher script, lecture 1 PDF/PPTX, or lecture 2 presentation.
- Teach detailed HTTP/OpenAPI behavior, perform a full integration-style decision, or specify the final profile architecture.
- Add code examples requiring a course-code branch or change either external repository.
- Resolve the course-wide one-course/two-profile publication decision.

## Decisions

### Extend the numbered lecture capability after its prerequisite change

The delta is stored under `lecture-01-api-interface-layer`, the capability introduced by `revise-first-two-api-lectures-and-prb-practicals`. Implementation starts by confirming that the prerequisite delta is applied or by comparing both deltas and deliberately merging them. This preserves one capability for teacher script, presentation, complete lecture, and brief note.

Alternative considered: create `lecture-01-student-materials` as a new capability. Rejected because two capabilities would own the same numbered lecture and could drift.

### Publish two products with different reading jobs

The complete lecture follows an explanatory path:

```text
architectural tiers
       ↓
need for an explicit contract
       ↓
families of interface technology
       ↓
API inside an ML-system request path
       ↓
model lifecycle and platform context
```

The concise note uses retrieval-oriented structure instead: glossary, compact tier comparison, technology selection cues, one inference path, lifecycle checklist, warnings, and self-check. Its word count is capped at half of the full lecture, and it must not mirror every full-lecture heading.

Alternative considered: mechanically shorten every section of the full lecture. Rejected because that produces a duplicate outline rather than a useful revision aid.

### Treat the PDF as the immediate basis, not the highest authority

`attachments/lecture_1.pdf` determines which ideas the student materials must recognize. Claims are then checked against the two RPDs, curriculum maps, current lecture capability, university methodical material, and relevant architecture/ML sources in the repository hierarchy. Categorical claims such as automatic scalability from adding tiers or universal performance rankings are rewritten as conditional trade-offs. External figures are not copied into Markdown.

Alternative considered: reproduce slide wording exactly for maximum deck correspondence. Rejected because slide copy is compressed, sometimes categorical, and not sufficient as an independent student explanation.

### Bound overlap with later lectures through progressive disclosure

Lecture 1 names REST and gRPC and compares their broad contexts, but it does not teach detailed HTTP semantics, OpenAPI validation, or a full integration-style decision. ML lifecycle and RAISA provide the system context needed to locate an API, but profile-specific architecture synthesis remains lecture 9. Acceptance review maps every paragraph to lecture-1 orientation or moves/removes it when it belongs only to a later unit.

### Publish through the existing manifest identity

The `api-tech-introduction` record keeps its current slug, metadata, sort order, and PDF attachment. The implementation adds only `markdown` and `briefMarkdown`. Filenames follow the required `001_<slug>.md` contract, allowing the publisher to expose one lecture with complete text, revision note, and slides.

### Validate content safety and contract consistency

Validation combines:

- scope review for `COMMON`, `PRB`, and `SII` labels;
- source-role and lecture-boundary review;
- Markdown structure, local-link, and filename checks;
- word-count and heading-overlap checks between complete and concise files;
- secret, personal-data, production-endpoint, and teacher-only-content scans;
- strict OpenSpec and publisher validation.

No executable code is introduced, so external branch validation is not required. Any later addition of runnable code must be planned separately under the course-code repository contract.

## Risks / Trade-offs

- [The active prerequisite change has not yet been archived] -> Require an explicit pre-apply capability check and reconcile deltas before implementation rather than creating a parallel capability.
- [The presentation spans subjects assigned to later lectures] -> Use a topic-depth map and keep those subjects at orientation depth only.
- [The concise note becomes a duplicate of the full lecture] -> Cap its word count at 50 percent and require a recall-oriented structure and coverage checklist.
- [The full lecture overstates slide claims] -> Apply the source hierarchy and qualify architecture and performance statements with conditions.
- [Publishing a dual-profile lecture conflicts with the unresolved course profile model] -> Publish only the `COMMON` path as mandatory and visibly label all profile-specific illustrations and PRB-only seminar links.
- [Adding manifest paths changes the public course] -> Preserve the existing lecture identity and run strict publisher planning and validation before completion.
