---
date: 2026-06-08
topic: competitive-programming-harness
---

# Competitive Programming Agent Harness

## Summary

A full fork of the pi agent harness, stripped to terminal-only, that accepts competitive programming problems through an interactive form (title, statement, input/output examples with explanations) and returns finished solutions via LLM. No judge connections — just problem-in, code-out.

---

## Problem Frame

Competitive programmers solve problems by reading a statement, reasoning about the approach, writing code, and testing against examples. When using LLMs as a tool, this workflow is fragmented: users manually copy problem text into chat interfaces, lose context between sessions, and have no structured way to present examples with their semantic meaning. Existing coding agent harnesses (pi, OpenCode, Aider) are designed for general software engineering — they have no concept of a "problem statement," "test cases," or "example explanations." A purpose-built harness collapses the entire problem-to-solution loop into a single interactive session, giving the LLM structured input that produces better solutions than raw text pasted into a chat.

---

## Actors

- A1. User: A competitive programmer or student who enters problems and receives solutions.
- A2. LLM: The language model that reasons about the problem and generates code. Connected via pi's unified model API.

---

## Key Flows

- F1. Solve a problem
  - **Trigger:** User starts a new problem session in the terminal
  - **Actors:** A1, A2
  - **Steps:** User enters title; user pastes problem statement; user adds one or more input/output examples, each with an optional explanation of why the output follows from the input; user toggles explanation mode if desired; harness sends structured problem to LLM; LLM returns solution code (and optionally, approach explanation); user receives output
  - **Outcome:** User has a complete, runnable solution to the problem
  - **Covered by:** R1, R2, R3, R4, R5, R6

- F2. Iterate on a solution
  - **Trigger:** User wants to refine the solution or add constraints
  - **Actors:** A1, A2
  - **Steps:** User provides feedback or additional examples; harness sends updated context to LLM; LLM returns revised solution
  - **Outcome:** Updated solution that addresses the user's feedback
  - **Covered by:** R7

---

## Requirements

**Problem entry**

- R1. The harness provides an interactive terminal form that prompts the user to enter: a title, a problem statement, and one or more input/output examples.
- R2. Each input/output example has an optional explanation field where the user describes why the output follows from the input.
- R3. The user can add as many input/output examples as they want during a session.
- R4. The form accepts multi-line input for the problem statement and for each example's input, output, and explanation fields (pasted or typed).

**Solution generation**

- R5. The harness sends the structured problem (title, statement, all examples with explanations) to the LLM as a single prompt and returns the generated solution code.
- R6. The user can toggle whether the LLM includes an explanation of its approach alongside the code. The default is code-only.
- R7. After receiving a solution, the user can provide feedback or additional examples and request a revised solution in the same session, preserving full context.

**Terminal interface**

- R8. The harness uses pi's TUI components for the interactive form — structured fields, multi-line text areas, and example list management rendered as a terminal UI, not plain text prompts.
- R9. The harness strips all non-essential pi packages (Slack integration, vLLM pods, web UI) from the fork. Agent runtime, tool system, unified model API, and TUI components are retained.

---

## Acceptance Examples

- AE1. **Covers R1, R2, R3, R4.** User starts the harness, is prompted for a title ("Two Sum"), pastes a problem statement (multi-line), adds first example (input: `[2,7,11,15], target=9`; output: `[0,1]`; explanation: "indices 0 and 1 sum to 9"), adds second example (input: `[3,2,4], target=6`; output: `[1,2]`; explanation: "indices 1 and 2 sum to 6"), then signals they're done adding examples.
- AE2. **Covers R5, R6.** After entering the problem from AE1, the harness sends the structured problem to the LLM. With explanation mode off, the terminal displays only a complete Python function `twoSum(nums, target)` that solves the problem.
- AE3. **Covers R6.** Same problem as AE1, but with explanation mode on. The terminal displays the solution code followed by a brief explanation of the approach (e.g., "hash map approach, O(n) time, O(n) space") and notes the key insight.
- AE4. **Covers R7.** After receiving the solution from AE2, the user says "use a two-pointer approach instead if possible, or explain why hash map is better." The harness re-sends the full problem context plus the user's feedback to the LLM and returns a revised response.
- AE5. **Covers R9.** The forked repo builds and runs with the retained packages. Running `dotpp solve` launches the interactive problem-entry form as a TUI with structured fields. No Slack, vLLM, or web server components are present.

---

## Success Criteria

- A user can enter a competitive programming problem through the interactive form and receive a working solution in under 2 minutes of interaction time.
- The solution code is syntactically valid and runnable in the target language.
- When explanation mode is enabled, the explanation accurately reflects the code's approach and complexity.
- The fork builds and runs with only the retained core packages — no dead imports, no missing dependency errors from removed packages.
- Multi-line input (problem statements, code examples) works correctly without truncation or formatting loss.

---

## Scope Boundaries

### Deferred for later

- **Judge/platform connections:** No API integration with Codeforces, LeetCode, AtCoder, or other competitive programming platforms. Problems are entered manually.
- **Test execution:** The harness does not compile or run the generated solution. The user runs it themselves.
- **Contest simulator:** Timed mock contests with a problem bank, scoring, and ranking are not in this version.
- **Coaching mode:** Interactive hints, complexity analysis during problem-solving, and guided problem walkthroughs are deferred.
- **Problem bank and progress tracking:** No local database of solved problems, no spaced repetition, no weak-area tracking.
- **Multiple LLM providers per session:** The harness connects to one configured LLM provider per session. Switching providers requires reconfiguration.

### Outside this product's identity

- **Competitive programming platform clone:** This is a problem-solving tool, not a platform. It does not host contests, manage accounts, or maintain leaderboards.
- **General-purpose coding agent:** The harness is scoped to competitive programming problems. It does not do general software engineering tasks (refactoring, debugging existing code, writing tests for a codebase).
- **Code execution sandbox:** The harness returns code; it does not provide a safe execution environment. Running untrusted generated code is outside scope.

---

## Key Decisions

- **Full fork over minimal fork or extension:** The user wants to own the entire codebase and strip it down, not keep pi as a dependency. This gives maximum control but means tracking upstream changes manually.
- **Interactive form over file input:** More natural for the primary use case — entering a problem you're reading from a browser. File input can be added later without architectural changes.
- **Optional explanation over always-on:** Sometimes you just want the code quickly; sometimes you need to understand the approach. The toggle keeps both workflows fast.
- **Explanation field on examples is optional per example:** Some examples are self-explanatory; others need context. Making it optional per example avoids forcing the user to explain trivial cases while enabling explanation where it matters.
- **Strip non-core packages at fork time:** Removing Slack, vLLM, and web UI reduces build complexity and prevents dead-code confusion. The retained set is: agent runtime, tool system, unified model API, and TUI components.

---

## Dependencies / Assumptions

- The pi agent harness (earendil-works/pi) is available under MIT license and can be forked freely.
- Pi's unified model API supports the LLM providers the user intends to use (at minimum: Claude and GPT-4).
- The user has API keys configured for at least one supported LLM provider.
- Pi's TUI components can support the interactive form pattern (structured fields, multi-line text areas) without major rewrites.

---

## Outstanding Questions

### Resolve Before Planning

(none — all resolved)

### Deferred to Planning

- [Affects R5][Needs research] What prompt engineering strategy produces the best competitive programming solutions? This affects the skill/prompt template design but doesn't block requirements.
- [Affects R5][Needs research] How does pi's prompt caching interact with multi-turn problem-solving sessions? The user may want to iterate on solutions without re-sending the full problem context each time.
- [Affects R9][Technical] Which pi packages are strictly required for the core agent loop, and which can be safely removed without breaking the build? Requires examining the package dependency graph.
