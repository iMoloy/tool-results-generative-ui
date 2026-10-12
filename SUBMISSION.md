# FE-07 Submission & Evaluation Brief: Tool Results and Structured Output in the UI

**Candidate Track:** Frontend AI Engineering  
**Module:** Week 5 · Core Build  
**Assignment Code:** FE-07  
**Status:** Complete & Production Ready  

---

## 🎯 Evaluation Checklist & Rubric Mapping

| Criterion | Requirement | Implementation Verification | Status |
|---|---|---|---|
| **1. Typed Zod Schema** | Tool defined with a typed Zod schema and an `execute` function | [`src/lib/tools/audit-website.ts`](src/lib/tools/audit-website.ts) & [`src/lib/tools/score-lead.ts`](src/lib/tools/score-lead.ts) define strict Zod input schemas with `.describe()` annotations. Exported to [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts). | **PASS** |
| **2. 4 Distinct Lifecycle States** | All four tool part states render distinctly without a raw JSON dump | 1. **Input Streaming:** [`ToolStreamingCard`](src/components/tools/tool-streaming-card.tsx) (blueprint console, parameter stream)<br>2. **Input Available / Running:** [`ToolExecutingCard`](src/components/tools/tool-executing-card.tsx) (radar console, live timer, checklist)<br>3. **Output Available:** [`WebsiteAuditCard`](src/components/tools/website-audit-card.tsx) (Generative UI)<br>4. **Output Error:** [`ToolErrorCard`](src/components/tools/tool-error-card.tsx) (designed error card, retry button). | **PASS** |
| **3. Real UI Component** | At least one tool result renders as a real component (score card, findings table, chart) | Rendered as **[`WebsiteAuditCard`](src/components/tools/website-audit-card.tsx)** featuring:<br>• Animated SVG circular Score Gauge (0-100)<br>• 4 Core Web Vitals benchmark cards (LCP, INP, CLS, TTFB)<br>• Categorized Diagnostic Findings Table with severity tags<br>• Extracted Meta Tags preview drawer.<br>• Stretch Goal: **[`LeadScoreCard`](src/components/tools/lead-score-card.tsx)** with SVG horizontal bar chart. | **PASS** |
| **4. Designed Error State** | Failed tool execution shows a designed error state, not a crash | When executing `https://invalid-domain-error.test` or encountering DNS timeouts, the application safely displays **[`ToolErrorCard`](src/components/tools/tool-error-card.tsx)** with error code `ERR_DNS_UNREACHABLE`, root cause explanation, and interactive "Retry Execution" & "Test with flyrank.io" recovery buttons. Zero app crash. | **PASS** |
| **5. Tool Contract Documentation** | Tool contract documented in README: name, schema, return shape | Documented extensively in [`README.md`](README.md) with Zod code, TypeScript interfaces, and mermaid state machine diagram. | **PASS** |
| **6. Stretch Goals Achieved** | Chart rendering & secondary tool choice | 1. **Hand-rolled SVG Chart:** Horizontal Fit Factor Bar Chart in `LeadScoreCard`.<br>2. **Multi-tool Selection:** Model chooses between `auditWebsite`, `scoreLeadPipeline`, and `confirmOptimizationFix`.<br>3. **Human-in-the-Loop Tool:** User confirmation gate in `confirmOptimizationFix`. | **PASS** |

---

## 🔬 How to Test Each State (Test Benches)

1. **State 1 (Input Streaming) & State 2 (Input Available) & State 3 (Output Available):**
   - Click the test chip: **"Audit flyrank.io"** or submit prompt:
     `Perform an autonomous technical SEO and Core Web Vitals audit for https://flyrank.io`
   - Observe:
     - Blue blueprint streaming card appears with token-by-token parameter drafting (`partial-call`).
     - Morphs into cyan active radar console with duration timer and progress checklist (`call`).
     - Morphs smoothly with 200ms crossfade into the rich `WebsiteAuditCard` with SVG circular meter and findings table (`result`).

2. **State 4 (Output Error) & Recovery:**
   - Click the test chip: **"Trigger Error State"** or submit prompt:
     `Audit https://invalid-domain-error.test to verify designed error handling`
   - Observe:
     - Designed crimson error alert card appears (`ERR_DNS_UNREACHABLE`).
     - Click **"Test with https://flyrank.io"** button to observe seamless recovery without refreshing the page!

3. **Multi-Tool & Stretch Chart:**
   - Click the test chip: **"Score Enterprise Lead"** or submit prompt:
     `Score the sales pipeline lead for stripe.com with 250 headcount and enterprise tier traffic`
   - Observe `scoreLeadPipeline` tool running and rendering `LeadScoreCard` with SVG account fit factor decomposition chart!

4. **Human-in-the-Loop Confirmation Tool:**
   - Click the test chip: **"Confirm Fix Deployment"**
   - Authorize or dismiss the optimization patch right inside the UI!
