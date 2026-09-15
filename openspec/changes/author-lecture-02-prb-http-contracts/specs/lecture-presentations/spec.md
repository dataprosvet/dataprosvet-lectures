## MODIFIED Requirements

### Requirement: Presentation targets the sole PRB course scope
The deck SHALL present one coherent PRB narrative. The demand-forecasting slide SHALL remain a business-system example involving CRM, forecasting, sales or reference data, BI, and ERP planning. AI/ML or inference content MAY support that business-system explanation where appropriate. The deck SHALL NOT require selection between profile variants or present another program's technology or competency requirements as mandatory for PRB.

#### Scenario: Instructor prepares the PRB cohort
- **WHEN** the instructor prepares the deck for class
- **THEN** the deck already contains a complete PRB narrative and does not require hiding another profile's slides

### Requirement: Speaker notes preserve delivery context
Slides that correspond to timed explanations, audience questions, mini-interactives, expected answers, or demonstrations SHALL include concise speaker notes derived from the teacher script. Speaker notes SHALL keep instructor-only guidance out of the visible student-facing canvas and SHALL identify the relevant lecture block or timing cue where useful.

#### Scenario: Instructor presents without opening the Markdown script
- **WHEN** the instructor uses presenter view
- **THEN** the notes provide enough prompts to conduct the opening question, interface-classification check, architecture discussion, context-diagram exercise, error-correction interactive, and closing transition

### Requirement: The deck passes visual and structural verification
The final `.pptx` SHALL open successfully, contain no slide-canvas overflow, use embedded or reliably packaged media, and render consistently enough for classroom projection. Verification SHALL include a full slide render, montage inspection, automated overflow checking, and a second render after any correction. The review SHALL also confirm adequate contrast and that instructional distinctions are not communicated by color alone.

#### Scenario: Final deck quality gate
- **WHEN** the implementation workflow renders and inspects the final presentation
- **THEN** every slide is present, visually balanced, free of clipped content and broken media, and the rendered montage demonstrates consistent alternating compositions and a coherent PRB narrative
