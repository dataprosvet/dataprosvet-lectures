## REMOVED Requirements

### Requirement: Teacher scripts are stored as internal Markdown materials
**Reason**: Storage and publication requirements are now owned by each numbered lecture capability so that a change identifies the exact lecture affected.
**Migration**: Use `lecture-01-api-interface-layer` and `lecture-02-http-rest-openapi-contracts` for lectures 1 and 2.

### Requirement: Each script supports a complete 90-minute teacher-led lecture
**Reason**: Timing and completeness are unit-specific and move to the numbered lecture capabilities.
**Migration**: Validate each lecture against its numbered capability.

### Requirement: Lecture 1 covers the API interface layer and service lifecycle
**Reason**: The requirement is owned by `lecture-01-api-interface-layer`.
**Migration**: Apply future lecture 1 changes only through that capability.

### Requirement: Lecture 2 covers observable HTTP and data-contract semantics
**Reason**: The requirement is owned by `lecture-02-http-rest-openapi-contracts`.
**Migration**: Apply future lecture 2 changes only through that capability.

### Requirement: Common and profile-specific material is visibly separated
**Reason**: Profile separation is validated within each numbered lecture rather than through an aggregate capability.
**Migration**: Use the corresponding numbered lecture requirement.

### Requirement: RPD traceability and source priority are explicit
**Reason**: Each lecture now has its own source map and matching RPD coverage requirements.
**Migration**: Audit sources through the numbered lecture capability.

### Requirement: Source use is original, safe, and reproducible
**Reason**: Source and safety review remains required but is attached to the exact numbered lecture.
**Migration**: Validate source use through the numbered lecture capability.

