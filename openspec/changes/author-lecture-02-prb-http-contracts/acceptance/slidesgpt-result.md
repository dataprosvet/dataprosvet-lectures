# SlidesGPT attempt — 2026-09-14

The user approved Markdown r2 and requested a minimalist SlidesGPT deck. Task 4.9 is complete; tasks 5.1–5.3 remain open.

PNG upload succeeded after the user enabled VPN. Upload responses did not include reusable visual URLs, even for the nine-page PDF visual package. The create request therefore included nine inline image data URLs and all 37 slides with speaker notes, using zurich-light.

The connector reported 30 slides created: presentation_id `pres_e2e4951c02571c3142020acc4ae6b489`, deck_id `93ded51291ee`. Adding slides 31–37 to the same presentation failed with INVALID_ARGUMENT and an explicit 30-slide session limit.

The returned view URL https://slidesgpt.com/view/93ded51291ee compiled to https://slidesgpt.com/presentation/RaPmaILwmUxafXd4P25v. Browser inspection found only eight slides, corresponding to source slides 1, 2, 8, 11, 19, 20, 23 and 30. The required HTTP illustrations and cats were absent. Slide 2 contained an unrequested Unsplash photograph. A screenshot confirmed the eight-slide sidebar.

This is an incomplete service trial, not a review-ready presentation. No final PPTX was exported. All local source materials are preserved. Request content without inline images is in slidesgpt-request.json; the connector response is in slidesgpt-response.json. Completing the approved 37-slide deck requires a different assembly method or a separately agreed SlidesGPT workflow.
