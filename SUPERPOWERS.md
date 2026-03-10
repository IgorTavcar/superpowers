# Superpowers: Complete Architecture & Workflow Reference

> **Version:** 5.0.0 | **Author:** Jesse Vincent ([@obra](https://github.com/obra)) | **License:** MIT
>
> Superpowers is a complete software development workflow system built as a composable skills library for AI coding agents. It automates the full development lifecycle — from brainstorming through implementation, testing, debugging, and code review — enforcing best practices like TDD, systematic debugging, and evidence-based verification without requiring agents to manually invoke workflows.

---

## Table of Contents

1. [Core Philosophy](#1-core-philosophy)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Project Structure](#3-project-structure)
4. [Skills System — The Heart of Superpowers](#4-skills-system--the-heart-of-superpowers)
5. [The Complete Skill Catalog](#5-the-complete-skill-catalog)
6. [Development Workflows](#6-development-workflows)
7. [Agent & Subagent System](#7-agent--subagent-system)
8. [Platform Integration](#8-platform-integration)
9. [Visual Brainstorming Companion](#9-visual-brainstorming-companion)
10. [Document Review System](#10-document-review-system)
11. [Installation & Distribution](#11-installation--distribution)
12. [Testing Infrastructure](#12-testing-infrastructure)
13. [Appendix: Skill Quick-Reference Table](#appendix-skill-quick-reference-table)

---

## 1. Core Philosophy

Superpowers is built on four non-negotiable principles:

| Principle | What It Means |
|-----------|---------------|
| **Test-Driven Development** | Write tests first, always. No production code without a failing test. |
| **Systematic over Ad-Hoc** | Process-driven workflows over guessing. Every skill has explicit steps. |
| **Complexity Reduction** | Simplicity as primary goal. YAGNI (You Aren't Gonna Need It) applied ruthlessly. |
| **Evidence over Claims** | Verify before declaring success. Confidence is not evidence. |

### Instruction Priority Hierarchy

When conflicts arise between sources of instruction:

```
1. User's explicit instructions (CLAUDE.md, AGENTS.md, direct requests)  ← highest
2. Superpowers skills (override default system behavior)
3. Default system prompt                                                  ← lowest
```

If a user's `CLAUDE.md` says "don't use TDD" and the TDD skill says "always use TDD," the user wins.

---

## 2. High-Level Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SUPERPOWERS SYSTEM                                  │
│                                                                             │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐                   │
│  │   Session    │    │    Skills    │    │    Agent     │                   │
│  │   Start      │───▶│   Engine     │───▶│   Dispatch   │                  │
│  │   Hook       │    │              │    │   System     │                  │
│  └─────────────┘    └──────────────┘    └──────────────┘                   │
│        │                    │                   │                           │
│        ▼                    ▼                   ▼                           │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐                   │
│  │  Context     │    │   SKILL.md   │    │  Subagent    │                  │
│  │  Injection   │    │   Files w/   │    │  Roles:      │                  │
│  │  (JSON)      │    │   YAML       │    │  • Implement │                  │
│  │              │    │   Frontmatter│    │  • Review    │                  │
│  └─────────────┘    └──────────────┘    │  • Simulate  │                  │
│                                         └──────────────┘                   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    PLATFORM ADAPTERS                                  │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│  │  │  Claude   │  │  Cursor  │  │  Codex   │  │ OpenCode │            │   │
│  │  │  Code     │  │          │  │          │  │          │            │   │
│  │  │ (native)  │  │ (native) │  │(symlink) │  │(plugin)  │            │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    OPTIONAL COMPONENTS                                │   │
│  │  ┌─────────────────────┐    ┌─────────────────────┐                 │   │
│  │  │  Visual Brainstorm  │    │  Document Review     │                 │   │
│  │  │  Server (WebSocket) │    │  Subagent Loops      │                 │   │
│  │  └─────────────────────┘    └─────────────────────┘                 │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Skill Dependency Graph

This directed graph shows how skills reference and depend on each other:

```
                         ┌────────────────────┐
                         │  using-superpowers  │  ◀── Entry point (injected at session start)
                         │  (always loaded)    │
                         └────────┬───────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼              ▼
            ┌──────────┐  ┌────────────┐  ┌───────────────┐
            │brainstorm│  │ systematic │  │live-docs-     │
            │  -ing    │  │ -debugging │  │lookup         │
            └────┬─────┘  └─────┬──────┘  └───────────────┘
                 │              │
                 ▼              ▼
         ┌──────────────┐  ┌────────────────────┐
         │using-git-    │  │verification-before-│
         │worktrees     │  │completion          │
         └──────┬───────┘  └────────────────────┘
                │
                ▼
         ┌──────────────┐
         │writing-plans │
         └──────┬───────┘
                │
        ┌───────┼────────┐
        ▼       ▼        ▼
  ┌──────────┐ ┌──────┐ ┌──────────────────────┐
  │refining- │ │exec- │ │subagent-driven-      │
  │plans     │ │uting-│ │development           │
  └──────────┘ │plans │ │ (2-stage review)     │
               └──┬───┘ └──────────┬───────────┘
                  │                │
                  │    ┌───────────┼───────────┐
                  │    ▼           ▼           ▼
                  │  ┌──────────┐ ┌──────────┐ ┌───────────────┐
                  │  │request-  │ │receiving-│ │dispatching-   │
                  │  │ing-code- │ │code-     │ │parallel-agents│
                  │  │review    │ │review    │ └───────────────┘
                  │  └──────────┘ └──────────┘
                  │        │
                  ▼        ▼
            ┌──────────────────┐     ┌───────────────┐
            │finishing-a-      │     │security-review│
            │development-branch│◀────│               │
            └──────────────────┘     └───────────────┘

  Standalone / Cross-cutting:
  ┌────────────────────────┐  ┌────────────────────────┐  ┌──────────────┐
  │test-driven-development │  │auditing-ai-generated-  │  │writing-skills│
  │(required by ALL impl)  │  │code                    │  │(meta-skill)  │
  └────────────────────────┘  └────────────────────────┘  └──────────────┘
```

---

## 3. Project Structure

```
superpowers/
├── .claude-plugin/                  # Claude Code plugin metadata
│   ├── plugin.json                  #   Name, version (5.0.0), author, license
│   └── marketplace.json             #   Marketplace registry entry
├── .cursor-plugin/                  # Cursor plugin metadata (v4.3.1)
│   └── plugin.json
├── .codex/                          # Codex installation guide
│   └── INSTALL.md
├── .opencode/                       # OpenCode installation & plugin
│   ├── INSTALL.md
│   └── plugins/superpowers.js       #   ES module plugin for system prompt injection
├── .github/
│   └── FUNDING.yml                  # GitHub sponsorship config
│
├── skills/                          # 18 composable skill modules
│   ├── using-superpowers/           #   Entry point & governance
│   │   ├── SKILL.md
│   │   └── references/codex-tools.md
│   ├── brainstorming/               #   Design refinement workflow
│   │   ├── SKILL.md
│   │   ├── visual-companion.md      #     Browser companion guide
│   │   └── spec-document-reviewer-prompt.md
│   ├── writing-plans/               #   Implementation planning
│   │   ├── SKILL.md
│   │   └── plan-document-reviewer-prompt.md
│   ├── executing-plans/             #   Separate-session plan execution
│   │   └── SKILL.md
│   ├── subagent-driven-development/ #   Same-session subagent execution
│   │   ├── SKILL.md
│   │   ├── implementer-prompt.md
│   │   ├── spec-reviewer-prompt.md
│   │   └── code-quality-reviewer-prompt.md
│   ├── refining-plans/              #   Plan pressure-testing
│   │   ├── SKILL.md
│   │   ├── plan-simulator-prompt.md
│   │   └── plan-fixer-prompt.md
│   ├── test-driven-development/     #   TDD enforcement
│   │   └── SKILL.md
│   ├── systematic-debugging/        #   Root cause analysis
│   │   ├── SKILL.md
│   │   ├── root-cause-tracing.md
│   │   ├── defense-in-depth.md
│   │   └── condition-based-waiting.md
│   ├── verification-before-completion/
│   │   └── SKILL.md
│   ├── requesting-code-review/      #   Pre-review dispatch
│   │   ├── SKILL.md
│   │   └── code-reviewer.md         #     Template for code-reviewer agent
│   ├── receiving-code-review/       #   Handling feedback
│   │   └── SKILL.md
│   ├── dispatching-parallel-agents/ #   Concurrent subagent patterns
│   │   └── SKILL.md
│   ├── using-git-worktrees/         #   Isolated workspace management
│   │   └── SKILL.md
│   ├── finishing-a-development-branch/
│   │   └── SKILL.md
│   ├── security-review/             #   Security-focused code review
│   │   └── SKILL.md
│   ├── auditing-ai-generated-code/  #   AI code audit framework
│   │   └── SKILL.md
│   ├── live-docs-lookup/            #   Real-time API doc fetching
│   │   └── SKILL.md
│   └── writing-skills/              #   Meta-skill for creating skills
│       └── SKILL.md
│
├── agents/                          # Registered agent definitions
│   └── code-reviewer.md             #   Senior code reviewer role
│
├── commands/                        # CLI command definitions (deprecated)
│   ├── brainstorming.md
│   ├── writing-plans.md
│   ├── executing-plans.md
│   └── refine-plans.md
│
├── hooks/                           # Plugin lifecycle hooks
│   ├── hooks.json                   #   SessionStart event config
│   ├── run-hook.cmd                 #   Cross-platform polyglot wrapper
│   └── session-start                #   Context injection script
│
├── lib/                             # Shared libraries
│   ├── skills-core.js               #   Skill discovery & frontmatter extraction
│   └── brainstorm-server/           #   Visual brainstorming companion
│       ├── index.js                 #     Express + WebSocket server
│       ├── helper.js                #     Client-side interaction handler
│       ├── frame-template.html      #     Themed UI wrapper
│       ├── start-server.sh          #     Server launcher
│       ├── stop-server.sh           #     Server cleanup
│       ├── package.json             #     Dependencies (express, ws, chokidar)
│       └── server.test.js           #     Server tests
│
├── tests/                           # Automated test suites
│   ├── claude-code/                 #   Claude Code platform tests
│   ├── brainstorm-server/           #   Visual companion tests
│   ├── explicit-skill-requests/     #   Direct invocation tests
│   ├── skill-triggering/            #   Auto-triggering tests
│   ├── subagent-driven-dev/         #   SDD workflow tests
│   └── opencode/                    #   OpenCode platform tests
│
├── docs/                            # Documentation
│   ├── superpowers/
│   │   ├── specs/                   #   Example design spec documents
│   │   └── plans/                   #   Example implementation plans
│   ├── README.codex.md              #   Codex setup guide
│   ├── README.opencode.md           #   OpenCode setup guide
│   ├── testing.md                   #   Testing methodology
│   └── windows/polyglot-hooks.md    #   Windows compatibility guide
│
├── README.md                        # Main documentation
├── RELEASE-NOTES.md                 # Version history (43KB+)
├── LICENSE                          # MIT License
└── .gitignore
```

---

## 4. Skills System — The Heart of Superpowers

### What Is a Skill?

A skill is a markdown file (`SKILL.md`) with YAML frontmatter that defines a reusable development workflow. Skills are discovered automatically, loaded on demand, and contain explicit step-by-step instructions, hard gates, red flags, and anti-pattern lists.

### Skill File Anatomy

```markdown
---
name: skill-name
description: Use when [condition] - [what it does]
---

## Iron Law / Core Principle
[The one non-negotiable rule]

## When to Use
[Triggers, symptoms, situations]

## Checklist / Workflow
[Step-by-step process with hard gates]

## Key Principles
[Guiding principles]

## Red Flags
[Self-check: if you're thinking this, STOP]

## Common Rationalizations
[Things that sound reasonable but are wrong]
```

### Skill Discovery & Loading

The `lib/skills-core.js` library powers skill discovery:

```javascript
// Core functions:
extractFrontmatter(filePath)     // Parse YAML frontmatter from SKILL.md
findSkillsInDir(dir, type, depth) // Recursive skill discovery
resolveSkillPath(name, sp, personal) // Resolve with shadowing
stripFrontmatter(content)        // Remove YAML for delivery
checkForUpdates(repoDir)         // Git-based update detection
```

**Skill Resolution Priority (shadowing):**
1. Personal skills (`~/.claude/skills/[name]/`) — user overrides
2. Superpowers skills (`[plugin-root]/skills/[name]/`) — library defaults
3. `superpowers:` prefix forces the superpowers namespace

### Skill Invocation: The 1% Rule

The `using-superpowers` skill (loaded at every session start) establishes:

> **If there is even a 1% chance a skill might apply, you ABSOLUTELY MUST invoke it.**

This is enforced through a "rationalization table" — common thoughts that signal you're avoiding skill use:

| Thought | Reality |
|---------|---------|
| "This is just a simple question" | Questions are tasks. Check for skills. |
| "I need more context first" | Skill check comes BEFORE clarifying questions. |
| "Let me explore the codebase first" | Skills tell you HOW to explore. Check first. |
| "I can check git/files quickly" | Files lack conversation context. Check for skills. |
| "This doesn't need a formal skill" | If a skill exists, use it. |
| "The skill is overkill" | Simple things become complex. Use it. |
| "I'll just do this one thing first" | Check BEFORE doing anything. |

### Skill Types

| Type | Enforcement | Examples |
|------|-------------|---------|
| **Rigid** | Follow exactly. Don't adapt away discipline. | TDD, debugging, verification |
| **Flexible** | Adapt principles to context. | Patterns, references |

### Session Start: How Skills Bootstrap

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  User starts │     │ hooks.json   │     │ session-start│
│  a session   │────▶│ SessionStart │────▶│ (bash script)│
│              │     │ event fires  │     │              │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │ Reads SKILL.md│
                                          │ from using-   │
                                          │ superpowers   │
                                          └──────┬───────┘
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │ Strips YAML  │
                                          │ frontmatter  │
                                          │ Escapes JSON │
                                          └──────┬───────┘
                                                  │
                                                  ▼
                                          ┌──────────────────────┐
                                          │ Outputs JSON:        │
                                          │ hookSpecificOutput.  │
                                          │ additionalContext =  │
                                          │ <EXTREMELY_IMPORTANT>│
                                          │ using-superpowers    │
                                          │ skill content        │
                                          │ </EXTREMELY_IMPORTANT>│
                                          └──────────────────────┘
```

The `hooks/session-start` script:
1. Reads `skills/using-superpowers/SKILL.md`
2. Strips YAML frontmatter
3. Escapes content for JSON embedding
4. Outputs it as `hookSpecificOutput.additionalContext`
5. Claude Code injects this into the system prompt
6. Every session starts with the governance skill loaded

---

## 5. The Complete Skill Catalog

### 5.1 Using Superpowers (Entry Point)

**File:** `skills/using-superpowers/SKILL.md`
**Purpose:** Foundation skill — establishes how to find and use all other skills
**Loaded:** Automatically at every session start via SessionStart hook

**Key concepts:**
- 1% rule: invoke skills preemptively
- Instruction priority hierarchy (user > skills > system prompt)
- Skill priority: process skills first, then implementation skills
- SUBAGENT-STOP gate: prevents subagents from re-invoking the full workflow
- Rationalization table for self-checking

---

### 5.2 Brainstorming

**File:** `skills/brainstorming/SKILL.md`
**Purpose:** Turn rough ideas into fully formed, approved designs through Socratic dialogue
**Trigger:** Before any creative work — features, components, behavior changes

**Hard Gate:** NO implementation without approved design first

**Workflow:**

```
┌──────────────────┐
│ Explore project  │
│ context (files,  │
│ docs, commits)   │
└────────┬─────────┘
         ▼
┌──────────────────┐     ┌──────────────────┐
│ Visual questions │─yes─▶│ Offer visual     │
│ ahead?           │      │ companion        │
└────────┬─────────┘      │ (own message)    │
    no   │                └────────┬─────────┘
         ▼                         │
┌──────────────────┐◀──────────────┘
│ Ask clarifying   │
│ questions (one   │
│ at a time)       │
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Propose 2-3      │
│ approaches with  │
│ trade-offs       │
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Present design   │◀──┐
│ in sections,     │   │ revise
│ get approval     │───┘
└────────┬─────────┘
    approved
         ▼
┌──────────────────┐
│ Write spec to    │
│ docs/superpowers/│
│ specs/           │
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Dispatch spec    │◀──┐
│ document reviewer│   │ issues found
│ subagent         │───┘
└────────┬─────────┘
    approved (max 5 iterations)
         ▼
┌──────────────────┐
│ Invoke           │
│ writing-plans    │
│ skill            │
└──────────────────┘
```

**Key principles:**
- One question at a time (never overwhelm)
- Multiple choice preferred when possible
- Always explore 2-3 alternatives before settling
- Design for isolation and clarity (each unit: what does it do, how do you use it, what does it depend on?)
- Scope assessment: flag multi-subsystem requests early, decompose into sub-projects
- Save spec to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`

---

### 5.3 Writing Plans

**File:** `skills/writing-plans/SKILL.md`
**Purpose:** Create detailed, actionable implementation plans from approved specs
**Trigger:** Have approved spec/requirements for multi-step task

**Key output:** Plan saved to `docs/superpowers/plans/YYYY-MM-DD-<feature>.md`

**Plan structure:**
```markdown
# Feature Name Implementation Plan

## Goal
[One sentence]

## Architecture
[System overview, key components]

## Tech Stack
[Languages, frameworks, dependencies]

## File Structure
[Files and their responsibilities — mapped BEFORE tasks]

## Tasks

### Task 1: [Description]
**Step 1:** Write failing test
  [Exact test code]
**Step 2:** Run test, verify fails
  [Exact command]
**Step 3:** Write minimal implementation
  [Implementation code]
**Step 4:** Run test, verify passes
  [Command]
**Step 5:** Commit
  [Message]
```

**Iron law:** Every task follows mandatory 5-step TDD order:
1. Write failing test (include code)
2. Run test, verify it fails correctly
3. Write minimal implementation
4. Run test, verify it passes
5. Commit

**Constraints:**
- ~120 lines max per plan
- Max 10 tasks per response
- Tasks should be 2-5 minutes each
- Exact file paths, concrete snippets, exact commands
- Assume engineer has zero context

**After writing:** Dispatches plan-document-reviewer subagent (chunk-by-chunk review, max 5 iterations)

---

### 5.4 Executing Plans

**File:** `skills/executing-plans/SKILL.md`
**Purpose:** Execute written plans in a separate session with review checkpoints
**Trigger:** Have written plan, want to execute in parallel session
**Best for:** Platforms without subagent support, or when you want human oversight

**Workflow:**
1. Load and review plan critically — raise concerns before starting
2. Create todo list from tasks
3. Execute tasks sequentially: mark in-progress → follow steps exactly → verify → mark complete
4. When all done: invoke `finishing-a-development-branch`

**When to stop:** Blocker hit, plan has critical gaps, instruction unclear, verification fails repeatedly

---

### 5.5 Subagent-Driven Development (SDD)

**File:** `skills/subagent-driven-development/SKILL.md`
**Purpose:** Execute plans with fresh subagent per task + two-stage review after each
**Trigger:** Implementing plans with mostly independent tasks in current session
**Best for:** Platforms with subagent support (Claude Code, Codex)

**Hard Gate:** DO NOT mark task complete without BOTH reviewer subagents

**Per-task workflow:**

```
┌──────────────────┐
│ Controller reads  │
│ plan, extracts   │
│ all tasks        │
└────────┬─────────┘
         ▼
┌──────────────────┐
│ For each task:   │
│                  │
│ 1. Dispatch      │
│    implementer   │──────────┐
│    subagent      │          │
└──────────────────┘          ▼
                     ┌──────────────────┐
                     │ Implementer:     │
                     │ • Ask questions  │
                     │ • Implement      │
                     │ • Write tests    │
                     │ • Commit         │
                     │ • Self-review    │
                     │ • Report status  │
                     └────────┬─────────┘
                              │
                     ┌────────┴─────────┐
                     │ Status?          │
                     ├─ DONE            │
                     ├─ DONE_WITH_      │
                     │  CONCERNS        │
                     ├─ NEEDS_CONTEXT   │──▶ Provide info, re-dispatch
                     └─ BLOCKED         │──▶ Assess, upgrade model, or escalate
                              │
                              ▼
                     ┌──────────────────┐
                     │ 2. Dispatch spec │◀──┐
                     │    compliance    │   │ issues
                     │    reviewer      │───┘
                     └────────┬─────────┘
                         compliant
                              ▼
                     ┌──────────────────┐
                     │ 3. Dispatch code │◀──┐
                     │    quality       │   │ issues
                     │    reviewer      │───┘
                     └────────┬─────────┘
                         approved
                              ▼
                     ┌──────────────────┐
                     │ Mark task        │
                     │ complete         │
                     └──────────────────┘
```

**Three subagent roles per task:**

| Role | Template | Purpose |
|------|----------|---------|
| **Implementer** | `implementer-prompt.md` | Build it, test it, commit it |
| **Spec Reviewer** | `spec-reviewer-prompt.md` | Verify it matches the spec (nothing more, nothing less) |
| **Code Quality Reviewer** | `code-quality-reviewer-prompt.md` | Verify it's well-built (clean, tested, maintainable) |

**Model selection guidance:**
- Cheap/fast models: mechanical tasks (1-2 files)
- Standard models: integration work (multi-file)
- Capable models: architecture, design, review

---

### 5.6 Refining Plans

**File:** `skills/refining-plans/SKILL.md`
**Purpose:** Pressure-test plans before execution via simulation and iterative fixing
**Trigger:** Plan written and needs stress-testing, or plan has known gaps

**Process (max 5 iterations):**

```
┌──────────────────┐
│ Phase 1: Detect  │
│ domain (backend, │
│ frontend, etc.)  │
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Phase 2: Loop    │
│                  │
│ Dispatch plan-   │──▶ Simulate plan execution
│ simulator        │    Surface gaps & issues
│                  │
│ No critical/     │──▶ CONVERGED → Phase 3
│ important issues │
│                  │
│ Issues found:    │
│ Dispatch plan-   │──▶ Apply targeted patches
│ fixer            │
│                  │
│ Same concern     │──▶ ESCALATE to human
│ persists         │
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Phase 3: Report  │
│ & offer options: │
│ 1. SDD (this     │
│    session)      │
│ 2. Parallel      │
│    session       │
│ 3. Refine again  │
└──────────────────┘
```

---

### 5.7 Test-Driven Development

**File:** `skills/test-driven-development/SKILL.md`
**Purpose:** Enforce RED-GREEN-REFACTOR cycle
**Trigger:** Always — for new features, bug fixes, refactoring, behavior changes

**Iron Law:** NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST

```
        ┌─────┐
    ┌──▶│ RED │ Write one minimal failing test
    │   └──┬──┘ • One behavior per test
    │      │    • Watch it FAIL (mandatory)
    │      ▼
    │   ┌───────┐
    │   │ GREEN │ Write minimal code to pass
    │   └──┬────┘ • Simplest possible
    │      │      • No features beyond test
    │      │      • Watch it PASS (mandatory)
    │      ▼
    │   ┌──────────┐
    └───│ REFACTOR │ Clean up (keep green)
        └──────────┘ • Remove duplication
                     • Improve names
                     • Extract helpers
```

**Boundary coverage (test FIRST):** zero/empty, one, limits, type edges, state transitions

**Common rationalizations that mean "start over with TDD":**
- "Too simple to test"
- "I'll test after"
- "Tests after achieve same goals"

**Red flags:**
- Code written before test
- Test passes immediately (proves nothing)
- Can't explain why test failed

---

### 5.8 Systematic Debugging

**File:** `skills/systematic-debugging/SKILL.md`
**Purpose:** Find root cause before fixing any bug
**Trigger:** Any bug, test failure, unexpected behavior, performance problem

**Iron Law:** NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST

**Four mandatory phases:**

```
Phase 1: ROOT CAUSE INVESTIGATION
├── Read error messages completely
├── Reproduce consistently (exact steps)
├── Check recent changes (git diff)
├── Gather evidence at system boundaries
└── Trace data flow backward

Phase 2: PATTERN ANALYSIS
├── Find working examples in codebase
├── Compare working vs broken completely
├── List every difference
└── Understand dependencies and assumptions

Phase 3: HYPOTHESIS & TESTING
├── Form specific hypothesis: "X is root cause because Y"
├── Test minimally (one variable at a time)
├── Verify: yes → Phase 4, no → new hypothesis
└── If 3+ fixes failed → ESCALATE

Phase 4: IMPLEMENTATION
├── Create FAILING test case (mandatory TDD)
├── Implement single fix addressing root cause
├── Verify fix works, no regressions
└── Commit
```

**Supporting techniques (sub-files):**
- `root-cause-tracing.md` — trace bugs backward through call stack
- `defense-in-depth.md` — add validation at multiple layers
- `condition-based-waiting.md` — replace timeouts with condition polling

---

### 5.9 Verification Before Completion

**File:** `skills/verification-before-completion/SKILL.md`
**Purpose:** Run fresh verification BEFORE claiming work is complete
**Trigger:** Before ANY success/completion claim, commits, PRs

**Iron Law:** NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE

**Gate function:**
```
1. IDENTIFY → What command proves the claim?
2. RUN      → Execute FULL command (fresh, complete)
3. READ     → Full output, check exit code, count failures
4. VERIFY   → Does output confirm the claim?
5. CLAIM    → Make the claim WITH evidence
```

**Common failures:**

| Claim | Required Evidence |
|-------|------------------|
| "Tests pass" | Test output showing 0 failures (not previous run) |
| "Linter clean" | Linter output with 0 errors (not "should pass") |
| "Build succeeds" | Build command exit 0 |
| "Bug fixed" | Original symptom now passes |
| "Agent completed" | VCS diff shows changes (not agent report) |

---

### 5.10 Requesting Code Review

**File:** `skills/requesting-code-review/SKILL.md`
**Purpose:** Dispatch code-reviewer subagent to catch issues before merge
**Trigger:** After each task in SDD, after major features, before merge

**Workflow:**
1. Get git SHAs: `BASE_SHA=$(git rev-parse HEAD~1)`, `HEAD_SHA=$(git rev-parse HEAD)`
2. Dispatch code-reviewer subagent with template
3. Template includes: what was implemented, plan reference, SHAs, description
4. Act on feedback by severity:
   - **Critical** → Fix immediately, blocks progress
   - **Important** → Fix before proceeding
   - **Minor** → Note for later

---

### 5.11 Receiving Code Review

**File:** `skills/receiving-code-review/SKILL.md`
**Purpose:** Handle feedback with technical evaluation, not emotion
**Trigger:** When receiving review feedback from humans, GitHub, subagents

**Response pattern:**
```
1. READ      → Complete feedback without reacting
2. UNDERSTAND → Restate requirement in own words
3. VERIFY    → Check against codebase reality
4. EVALUATE  → Technically sound for THIS codebase?
5. RESPOND   → Technical acknowledgment or reasoned pushback
6. IMPLEMENT → One item at a time, test each
```

**Forbidden responses:**
- "You're absolutely right!" (performative)
- "Great point!" (performative)
- "Let me implement that now" (before verification)

**When to push back:**
- Breaks existing functionality
- Reviewer lacks full context
- Violates YAGNI
- Technically incorrect for this stack
- Conflicts with architectural decisions

---

### 5.12 Security Review

**File:** `skills/security-review/SKILL.md`
**Purpose:** Catch injection, auth, data exposure, dependency, and config vulnerabilities
**Trigger:** Before merging, marking PRs ready, claiming implementation complete

**Iron Law:** NO MERGE WITHOUT SECURITY CHECKLIST COMPLETION

**Checklist categories (ALL must be checked):**
1. **Input Validation** — sanitization, no string concat in SQL/shell/HTML, path traversal
2. **Authentication & Authorization** — auth checks on every endpoint, no privilege escalation
3. **Data Exposure** — no hardcoded secrets, sensitive data excluded from logs, PII encrypted
4. **Dependencies** — CVE checks, minimal permissions, lock files committed
5. **Configuration** — debug disabled for prod, CORS restricted, security headers present

---

### 5.13 Dispatching Parallel Agents

**File:** `skills/dispatching-parallel-agents/SKILL.md`
**Purpose:** Coordinate 2+ independent tasks worked on concurrently
**Trigger:** 3+ test failures across different files, multiple independent subsystems broken

**Decision tree:**
```
Multiple failures?
├── Related? → Single agent investigates all
└── Independent? → Can they work in parallel?
    ├── Yes → Dispatch one agent per domain
    └── No (shared state) → Sequential
```

**Agent prompt structure:**
- Specific scope (one test file or subsystem)
- Clear goal (imperative: "fix X", not "X needs fixing")
- Autonomy level (what may agent do without asking?)
- Constraints (don't change other code)
- Expected output format

**Hard gate:** Run full test suite after all agents complete, before reporting done

---

### 5.14 Using Git Worktrees

**File:** `skills/using-git-worktrees/SKILL.md`
**Purpose:** Create isolated workspace on new branch before implementation
**Trigger:** Starting feature work that needs isolation

**Directory priority:**
1. CLAUDE.md preference (if specified)
2. Existing convention in project (`.worktrees/` or `worktrees/`)
3. Global default: `~/.config/superpowers/worktrees/<project>/`
4. Ask user

**Workflow:**
1. Check CLAUDE.md for location preference
2. Reuse existing worktree directory if found
3. Create worktree with new branch
4. Auto-detect and run project setup (`npm install`, `cargo build`, etc.)
5. Run project tests to verify clean baseline
6. Report location and test status

---

### 5.15 Finishing a Development Branch

**File:** `skills/finishing-a-development-branch/SKILL.md`
**Purpose:** Guide completion of development work with structured options
**Trigger:** Implementation complete, all tests pass

**Workflow:**
1. **Verify tests** — run full suite; if any fail → STOP
2. **Determine base branch** — `git merge-base HEAD main`
3. **Present exactly 4 options:**

| Option | Action |
|--------|--------|
| **1. Merge** | Checkout base → pull latest → merge → verify tests → delete branch → cleanup worktree |
| **2. PR** | Push branch → create PR with `gh` → confirm → keep worktree |
| **3. Keep** | Report branch kept, worktree preserved |
| **4. Discard** | Require typed "discard" confirmation → delete branch → cleanup worktree |

---

### 5.16 Live Docs Lookup

**File:** `skills/live-docs-lookup/SKILL.md`
**Purpose:** Fetch current AI SDK/API documentation before answering
**Trigger:** Building with Anthropic, OpenAI, or Google AI SDKs

**Why it exists:** AI platforms change constantly. Training data has a cutoff. A 30-second doc check prevents hours of wasted implementation.

**Process:**
1. Detect provider from imports/env vars/model names
2. Fetch relevant live docs (always start with models page)
3. Surface brief summary (5-10 bullets of what's relevant/surprising)
4. Proceed with grounded context

**Provider doc URLs maintained for:** Anthropic (14 endpoints), OpenAI (8 endpoints), Google/Gemini (6 endpoints)

---

### 5.17 Auditing AI-Generated Code

**File:** `skills/auditing-ai-generated-code/SKILL.md`
**Purpose:** Audit AI-generated code (Cursor, Claude Code, "vibe coding") for production readiness
**Trigger:** Code from AI tools needs production assessment, feels fragile

**Seven audit dimensions (evaluate ALL):**

| # | Dimension | Common AI Failures |
|---|-----------|-------------------|
| 1 | Architecture & Design | Business logic in handlers/UI, god objects |
| 2 | Consistency & Maintainability | Mixed paradigms, copy-paste logic |
| 3 | Robustness & Error Handling | Silent catch, unhandled edge cases |
| 4 | Production Risks | Hardcoded URLs, N+1 queries, blocking I/O |
| 5 | Security & Safety | Unsanitized input, secrets in source |
| 6 | Dead or Hallucinated Code | Non-existent imports, wrong API versions (**most common**) |
| 7 | Technical Debt Hotspots | Deep nesting, 5+ param functions |

**Production Readiness Score:**
- 0-30: Not deployable
- 31-50: High risk, significant rework
- 51-70: Low-stakes/internal only
- 71-85: Production-viable with targeted fixes
- 86-100: Production-ready

---

### 5.18 Writing Skills (Meta-Skill)

**File:** `skills/writing-skills/SKILL.md`
**Purpose:** Create and test new skills; document proven techniques
**Trigger:** Creating new skills, editing existing skills

**Core principle:** Writing skills IS TDD for process documentation

**TDD for skills:**
1. **RED:** Run pressure scenario WITHOUT skill → document baseline behavior
2. **GREEN:** Write skill addressing violations → run WITH skill → verify compliance
3. **REFACTOR:** Close loopholes → re-test until bulletproof

**Skill types:**
- **Technique:** Concrete method with steps (e.g., condition-based-waiting)
- **Pattern:** Way of thinking about problems (e.g., test-invariants)
- **Reference:** API docs, syntax guides

**Claude Search Optimization (CSO):** The description field is critical — it determines when Claude's skill-matching fires. Use concrete triggers/symptoms, NOT workflow summaries.

---

## 6. Development Workflows

### 6.1 The Primary Workflow: Idea → Production

This is the "golden path" — the complete workflow from an idea to merged code:

```
USER: "I want to build X"
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ PHASE 1: DESIGN                                         │
│                                                         │
│ ┌───────────────┐    ┌──────────────┐                  │
│ │ brainstorming  │───▶│ Approved     │                  │
│ │ (Socratic Q&A, │    │ Design Spec  │                  │
│ │  2-3 options,  │    │ (reviewed by │                  │
│ │  visual comp.) │    │  subagent)   │                  │
│ └───────────────┘    └──────┬───────┘                  │
│                             │                           │
│ ┌───────────────┐    ┌──────┴───────┐                  │
│ │ writing-plans  │───▶│ Approved     │                  │
│ │ (TDD tasks,    │    │ Plan Doc     │                  │
│ │  exact code,   │    │ (reviewed by │                  │
│ │  2-5 min each) │    │  subagent)   │                  │
│ └───────────────┘    └──────┬───────┘                  │
└─────────────────────────────┼───────────────────────────┘
                              │
         ┌────────────────────┘
         ▼
┌─────────────────────────────────────────────────────────┐
│ PHASE 2: SETUP                                          │
│                                                         │
│ ┌───────────────────┐                                  │
│ │ using-git-worktrees│                                  │
│ │ (isolated branch,  │                                  │
│ │  setup, test       │                                  │
│ │  baseline)         │                                  │
│ └──────────┬────────┘                                  │
└────────────┼────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│ PHASE 3: IMPLEMENTATION                                 │
│                                                         │
│ ┌──────────────────────────────────────────────────┐   │
│ │ subagent-driven-development (per task):           │   │
│ │                                                    │   │
│ │  ┌──────────────┐  TDD  ┌──────────────┐         │   │
│ │  │ Implementer  │──────▶│ Spec Review  │         │   │
│ │  │ (test-first, │       │ (compliance) │         │   │
│ │  │  commit)     │       └──────┬───────┘         │   │
│ │  └──────────────┘              │                  │   │
│ │                         ┌──────┴───────┐         │   │
│ │                         │ Code Quality │         │   │
│ │                         │ Review       │         │   │
│ │                         └──────┬───────┘         │   │
│ │                                │                  │   │
│ │                         ┌──────┴───────┐         │   │
│ │                         │ Task Complete│         │   │
│ │                         └──────────────┘         │   │
│ └──────────────────────────────────────────────────┘   │
│                                                         │
│ Final: Dispatch code reviewer for entire implementation │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│ PHASE 4: COMPLETION                                     │
│                                                         │
│ ┌───────────────┐    ┌──────────────┐                  │
│ │ security-     │───▶│ verification-│                  │
│ │ review        │    │ before-      │                  │
│ │               │    │ completion   │                  │
│ └───────────────┘    └──────┬───────┘                  │
│                             │                           │
│ ┌──────────────────────────┐│                           │
│ │ finishing-a-development- ││                           │
│ │ branch                   │◀                           │
│ │ (merge/PR/keep/discard)  │                           │
│ └──────────────────────────┘                           │
└─────────────────────────────────────────────────────────┘
```

---

### 6.2 The Debugging Workflow

```
USER: "This is broken" / test failure / unexpected behavior
         │
         ▼
┌──────────────────────────────┐
│ systematic-debugging         │
│                              │
│ Phase 1: Root Cause          │
│   Read errors → Reproduce → │
│   Check changes → Trace     │
│                              │
│ Phase 2: Pattern Analysis    │
│   Working examples →         │
│   Compare differences        │
│                              │
│ Phase 3: Hypothesis          │
│   "X because Y" → Test →    │
│   Verify (max 3 attempts)    │
│                              │
│ Phase 4: Fix                 │
│   Write failing test (TDD) →│
│   Implement fix → Verify    │
└──────────┬───────────────────┘
           ▼
┌──────────────────────────────┐
│ verification-before-         │
│ completion                   │
│                              │
│ IDENTIFY → RUN → READ →     │
│ VERIFY → CLAIM with evidence │
└──────────────────────────────┘
```

---

### 6.3 The Code Review Workflow

```
┌──────────────────────────────────────────────────────────┐
│ After implementation task completes:                      │
│                                                           │
│ ┌──────────────┐     ┌──────────────┐                    │
│ │ requesting-   │────▶│ code-reviewer │                   │
│ │ code-review   │     │ agent runs   │                   │
│ │ (get SHAs,    │     │              │                   │
│ │  fill template│     │ Returns:     │                   │
│ │  dispatch)    │     │ • Critical   │                   │
│ └──────────────┘     │ • Important  │                   │
│                       │ • Suggestions│                   │
│                       └──────┬───────┘                   │
│                              │                            │
│                       ┌──────┴───────┐                   │
│                       │ receiving-    │                   │
│                       │ code-review   │                   │
│                       │              │                   │
│                       │ READ →       │                   │
│                       │ UNDERSTAND → │                   │
│                       │ VERIFY →     │                   │
│                       │ EVALUATE →   │                   │
│                       │ RESPOND →    │                   │
│                       │ IMPLEMENT    │                   │
│                       └──────────────┘                   │
└──────────────────────────────────────────────────────────┘
```

---

### 6.4 The Parallel Agent Workflow

```
Multiple independent failures detected (e.g., 6 test failures across 3 files)
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│ dispatching-parallel-agents                               │
│                                                           │
│ Identify independent domains:                             │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│ │ Domain A │  │ Domain B │  │ Domain C │               │
│ │ (file1)  │  │ (file2)  │  │ (file3)  │               │
│ └────┬─────┘  └────┬─────┘  └────┬─────┘               │
│      │              │              │                      │
│      ▼              ▼              ▼                      │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│ │ Agent 1  │  │ Agent 2  │  │ Agent 3  │  ← concurrent │
│ │ (scope:  │  │ (scope:  │  │ (scope:  │               │
│ │  file1)  │  │  file2)  │  │  file3)  │               │
│ └────┬─────┘  └────┬─────┘  └────┬─────┘               │
│      │              │              │                      │
│      └──────────────┼──────────────┘                     │
│                     ▼                                     │
│              ┌──────────────┐                             │
│              │ Integrate    │                             │
│              │ results,     │                             │
│              │ verify no    │                             │
│              │ conflicts    │                             │
│              └──────┬───────┘                             │
│                     ▼                                     │
│              ┌──────────────┐                             │
│              │ Run FULL     │  ← hard gate               │
│              │ test suite   │                             │
│              └──────────────┘                             │
└──────────────────────────────────────────────────────────┘

Real-world impact: 6 failures × 3 files → 3 agents → solved in time of 1
```

---

### 6.5 The Plan Refinement Workflow

```
Written plan exists but needs stress-testing
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│ refining-plans (max 5 iterations)                         │
│                                                           │
│ Phase 1: Domain Detection                                 │
│   backend / frontend / infra / data / ML / devops / full  │
│                                                           │
│ Phase 2: Iteration Loop                                   │
│   ┌──────────────┐                                       │
│   │ Plan         │ "Walk through plan as if implementing" │
│   │ Simulator    │ → findings: critical / important / minor│
│   └──────┬───────┘                                       │
│          │                                                │
│     No issues? ──▶ CONVERGED                              │
│          │                                                │
│   ┌──────┴───────┐                                       │
│   │ Plan Fixer   │ Apply minimal patches                  │
│   └──────┬───────┘                                       │
│          │                                                │
│   Same concern persists? ──▶ ESCALATE to human            │
│          │                                                │
│   Plan drifted? ──▶ ESCALATE to human                     │
│          │                                                │
│          └──▶ Re-run simulator                            │
│                                                           │
│ Phase 3: Handoff                                          │
│   1. SDD (this session)                                   │
│   2. Parallel session (executing-plans)                    │
│   3. Refine again                                         │
└──────────────────────────────────────────────────────────┘
```

---

### 6.6 The AI Code Audit Workflow

```
AI-generated code needs production assessment
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│ auditing-ai-generated-code                                │
│                                                           │
│ Pre-Audit:                                                │
│   What does it do? → What stack? → Dependency manifest?   │
│                                                           │
│ Evaluate ALL 7 dimensions:                                │
│   1. Architecture & Design                                │
│   2. Consistency & Maintainability                         │
│   3. Robustness & Error Handling                          │
│   4. Production Risks                                     │
│   5. Security & Safety                                    │
│   6. Dead or Hallucinated Code  ← #1 AI failure mode     │
│   7. Technical Debt Hotspots                              │
│                                                           │
│ Output:                                                   │
│   Critical Issues → High-Risk → Maintainability →         │
│   Production Readiness Score (XX/100) →                   │
│   Refactoring Priorities (S/M/L effort)                   │
└──────────────────────────────────────────────────────────┘
```

---

### 6.7 The Branch Completion Workflow

```
Implementation complete, tests pass
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│ finishing-a-development-branch                            │
│                                                           │
│ Step 1: Verify tests (HARD GATE)                          │
│   npm test / cargo test / pytest / go test ./...          │
│   Tests fail? → STOP, report failures                     │
│                                                           │
│ Step 2: Determine base branch                             │
│   git merge-base HEAD main                                │
│                                                           │
│ Step 3: Present 4 options                                 │
│   ┌─────────────────────────────────────────────────┐    │
│   │ 1. Merge locally                                 │    │
│   │ 2. Push and create PR                            │    │
│   │ 3. Keep branch as-is                             │    │
│   │ 4. Discard (requires typed "discard")            │    │
│   └─────────────────────────────────────────────────┘    │
│                                                           │
│ Step 4: Execute chosen option                             │
│ Step 5: Cleanup worktree (options 1, 2, 4)               │
└──────────────────────────────────────────────────────────┘
```

---

### 6.8 The Skill Creation Workflow

```
Want to create a new skill
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│ writing-skills (TDD for process documentation)            │
│                                                           │
│ RED Phase:                                                │
│   Create pressure scenarios                               │
│   Run WITHOUT skill → document baseline failures          │
│   Identify patterns in failures                           │
│                                                           │
│ GREEN Phase:                                              │
│   Write SKILL.md with:                                    │
│     YAML frontmatter (name + description)                 │
│     Overview → When to Use → Core Pattern →               │
│     Quick Reference → Common Mistakes                     │
│   Run WITH skill → verify compliance                      │
│                                                           │
│ REFACTOR Phase:                                           │
│   Identify new rationalizations                           │
│   Add explicit counters                                   │
│   Build rationalization table                             │
│   Create red flags list                                   │
│   Re-test until bulletproof                               │
│                                                           │
│ Token budgets:                                            │
│   Getting-started: <150 words                             │
│   Frequently-loaded: <200 words                           │
│   Others: <500 words                                      │
└──────────────────────────────────────────────────────────┘
```

---

## 7. Agent & Subagent System

### Registered Agents

Superpowers defines one registered agent in `agents/code-reviewer.md`:

**Senior Code Reviewer**
- Model: `inherit` (uses same model as caller)
- Triggered after major project step completion
- Reviews against original plan and coding standards
- Responsibilities: plan alignment, code quality, architecture, documentation, issue identification
- Issue severity: Critical (must fix) → Important (should fix) → Suggestions (nice to have)

### Subagent Roles (Ephemeral)

These are NOT separate agent registrations. They are prompt templates dispatched via the Task tool:

```
┌───────────────────────────────────────────────────────────────┐
│                    SUBAGENT DISPATCH PATTERNS                  │
│                                                                │
│  Subagent-Driven Development:                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  │
│  │  Implementer   │  │ Spec Reviewer  │  │ Code Quality   │  │
│  │  (build it)    │  │ (matches spec?)│  │ Reviewer       │  │
│  │                │  │                │  │ (well-built?)  │  │
│  │  implementer-  │  │ spec-reviewer- │  │ code-quality-  │  │
│  │  prompt.md     │  │ prompt.md      │  │ reviewer-      │  │
│  │                │  │                │  │ prompt.md      │  │
│  └────────────────┘  └────────────────┘  └────────────────┘  │
│                                                                │
│  Plan Refinement:                                             │
│  ┌────────────────┐  ┌────────────────┐                       │
│  │ Plan Simulator │  │ Plan Fixer     │                       │
│  │ (find gaps)    │  │ (patch gaps)   │                       │
│  │                │  │                │                       │
│  │ plan-simulator-│  │ plan-fixer-    │                       │
│  │ prompt.md      │  │ prompt.md      │                       │
│  └────────────────┘  └────────────────┘                       │
│                                                                │
│  Document Review:                                             │
│  ┌────────────────┐  ┌────────────────┐                       │
│  │ Spec Document  │  │ Plan Document  │                       │
│  │ Reviewer       │  │ Reviewer       │                       │
│  │                │  │                │                       │
│  │ spec-document- │  │ plan-document- │                       │
│  │ reviewer-      │  │ reviewer-      │                       │
│  │ prompt.md      │  │ prompt.md      │                       │
│  └────────────────┘  └────────────────┘                       │
│                                                                │
│  Parallel Agents:                                             │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  │
│  │   Agent 1      │  │   Agent 2      │  │   Agent N      │  │
│  │ (domain scope) │  │ (domain scope) │  │ (domain scope) │  │
│  └────────────────┘  └────────────────┘  └────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

### Implementer Status Protocol

When an implementer subagent reports back, it uses one of four statuses:

| Status | Controller Action |
|--------|-------------------|
| `DONE` | Proceed to spec compliance review |
| `DONE_WITH_CONCERNS` | Read concerns; proceed if not correctness/scope issues |
| `NEEDS_CONTEXT` | Provide missing info, re-dispatch |
| `BLOCKED` | Assess blocker, upgrade model capability, or escalate to human |

---

## 8. Platform Integration

Superpowers supports four AI coding platforms with a single codebase:

### Platform Comparison

```
┌──────────────────────────────────────────────────────────────────────┐
│                    PLATFORM INTEGRATION MAP                           │
│                                                                       │
│  Feature            Claude Code    Cursor    Codex      OpenCode     │
│  ─────────────────  ───────────    ──────    ─────      ────────     │
│  Install method     Marketplace    Market    Symlink    Plugin+Sym   │
│  Plugin system      Native         Native    None       JS module    │
│  Skill discovery    Native         Native    Native     Native       │
│  Subagent support   Task tool      Task      spawn_     @mention     │
│                                              agent                    │
│  Task tracking      TodoWrite      Todo      update_    update_plan  │
│                                    Write     plan                     │
│  Session hook       hooks.json     hooks     N/A        Plugin       │
│                                    .json                 transform   │
│  Version            5.0.0          4.3.1     5.0.0      5.0.0       │
└──────────────────────────────────────────────────────────────────────┘
```

### Claude Code Integration (Primary)

**Installation:**
```bash
# Official marketplace
/plugin install superpowers@claude-plugins-official

# Community marketplace
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

**Hook system:** `hooks/hooks.json` → `hooks/session-start` → JSON output with `hookSpecificOutput.additionalContext`

**Tools used by skills:**
- `Skill` — load skill content
- `Task` — dispatch subagents
- `TodoWrite` — progress tracking
- `Read`, `Write`, `Edit`, `Bash` — file operations
- `WebFetch` — live docs lookup

### Cursor Integration

**Installation:**
```
/add-plugin superpowers
```

Plugin defined in `.cursor-plugin/plugin.json` (currently v4.3.1). Same hook system as Claude Code.

### Codex Integration

**Installation:**
```bash
git clone https://github.com/obra/superpowers.git ~/.codex/superpowers
ln -s ~/.codex/superpowers/skills ~/.agents/skills/superpowers
```

**Tool mapping** (from `references/codex-tools.md`):

| Skill Reference | Codex Equivalent |
|----------------|------------------|
| `Task` (dispatch subagent) | `spawn_agent` |
| Multiple `Task` calls | Multiple `spawn_agent` calls |
| Task returns result | `wait` |
| `TodoWrite` | `update_plan` |
| `Skill` tool | Skills load natively |

Requires `collab = true` in `~/.codex/config.toml` for subagent features.

### OpenCode Integration

**Installation:**
```bash
git clone https://github.com/obra/superpowers.git ~/.config/opencode/superpowers
ln -s ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js ~/.config/opencode/plugins/superpowers.js
ln -s ~/.config/opencode/superpowers/skills ~/.config/opencode/skills/superpowers
```

**Plugin:** `.opencode/plugins/superpowers.js` — ES module that:
1. Reads `using-superpowers` skill content
2. Strips frontmatter
3. Injects via `experimental.chat.system.transform` into system prompt
4. Includes OpenCode-specific tool mapping

---

## 9. Visual Brainstorming Companion

An optional browser-based companion for showing mockups, diagrams, and visual options during brainstorming.

### Architecture

```
┌──────────────────────────────────────────────────────────┐
│                                                           │
│  Terminal (conversation)          Browser (visuals)        │
│  ┌───────────────────┐           ┌───────────────────┐   │
│  │ Agent asks         │           │ Superpowers        │   │
│  │ questions, gets    │           │ Brainstorming      │   │
│  │ text responses     │           │                    │   │
│  └─────────┬─────────┘           │ ┌──────────────┐  │   │
│            │                      │ │ Mockup /     │  │   │
│            │  Write HTML ────────▶│ │ Diagram /    │  │   │
│            │                      │ │ Options      │  │   │
│            │                      │ └──────────────┘  │   │
│            │                      │                    │   │
│            │  Read .events ◀──────│ Click events       │   │
│            │                      │ (via WebSocket)    │   │
│            │                      └───────────────────┘   │
│  ┌─────────┴─────────┐                                    │
│  │ Agent merges       │                                    │
│  │ terminal text +    │                                    │
│  │ browser events     │                                    │
│  └───────────────────┘                                    │
│                                                           │
│  Server: Express + WebSocket (random port 49152-65535)     │
│  File watching: chokidar (serves newest .html in dir)     │
│  Theme: Dark/light with "Superpowers Brainstorming" header│
└──────────────────────────────────────────────────────────┘
```

### The Loop

1. **Write HTML** fragment to `screen_dir` (e.g., `layout.html`)
   - Server auto-wraps in themed frame template
   - No `<html>`, CSS, or scripts needed
2. **Tell user** what to expect, remind them of URL
3. **End turn** — user responds in terminal and/or clicks in browser
4. **Read `.events`** file (JSON lines with click data)
5. **Merge** terminal text + browser events
6. **Iterate** (new file for changes) or advance to next question

### Available CSS Classes

```html
<!-- A/B/C options (single or multi-select) -->
<div class="options" data-multiselect>
  <div class="option" data-choice="a" onclick="toggleSelect(this)">
    <div class="letter">A</div>
    <div class="content"><h3>Title</h3><p>Description</p></div>
  </div>
</div>

<!-- Visual design cards -->
<div class="cards">
  <div class="card" data-choice="x" onclick="toggleSelect(this)">...</div>
</div>

<!-- Mockup container -->
<div class="mockup">
  <div class="mockup-header">Preview: Dashboard</div>
  <div class="mockup-body"><!-- content --></div>
</div>

<!-- Side-by-side comparison -->
<div class="split">
  <div class="mockup"><!-- left --></div>
  <div class="mockup"><!-- right --></div>
</div>

<!-- Wireframe building blocks -->
<div class="mock-nav">Logo | Home | About</div>
<div class="mock-sidebar">Navigation</div>
<div class="mock-content">Main content</div>
<button class="mock-button">Action</button>
```

### Event Format

```jsonl
{"type":"click","choice":"a","text":"Option A - Simple Layout","timestamp":1706000101}
{"type":"click","choice":"c","text":"Option C - Complex Grid","timestamp":1706000108}
```

---

## 10. Document Review System

Automated review loops using subagent dispatch ensure specs and plans are complete before implementation begins.

### Spec Document Review

Triggered after brainstorming writes the design spec.

**Reviewer checks:**
- TODOs, placeholders, incomplete sections
- Missing error handling and edge cases
- Internal contradictions
- Ambiguous requirements
- Over-engineering (YAGNI violations)
- Scope appropriate for single plan
- Units with clear boundaries

**Output:** `Approved` or `Issues Found` with specific locations and recommendations

**Loop:** Fix issues → re-dispatch reviewer → repeat until approved (max 5 iterations)

### Plan Document Review

Triggered after writing-plans creates the implementation plan. Reviews chunk-by-chunk.

**Reviewer checks:**
- Spec alignment (every requirement → task)
- Task decomposition quality
- TDD order compliance
- File structure clarity
- Chunk size (<1000 lines)
- Markdown syntax

**Same loop pattern:** max 5 iterations, escalate to human if unresolvable

---

## 11. Installation & Distribution

### Distribution Model

Superpowers is **source-distributed** — no compilation, bundling, or transpilation. Skills are loaded directly from `SKILL.md` files on demand.

```
Distribution Channels:
┌──────────────────────────────────────────────────────┐
│                                                       │
│  Claude Code        Cursor            Manual          │
│  Official           Marketplace       Git Clone       │
│  Marketplace                                          │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐   │
│  │ /plugin  │      │ /add-    │      │ git      │   │
│  │ install  │      │ plugin   │      │ clone    │   │
│  │ super-   │      │ super-   │      │ + symlink│   │
│  │ powers   │      │ powers   │      │          │   │
│  └──────────┘      └──────────┘      └──────────┘   │
│       │                 │                 │           │
│       ▼                 ▼                 ▼           │
│  ┌──────────────────────────────────────────────┐    │
│  │           Same skill files                    │    │
│  │           Same hook system                    │    │
│  │           Same agent definitions              │    │
│  └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

### Update Mechanism

```bash
# Claude Code / Cursor
/plugin update superpowers

# Codex / OpenCode (git-based)
cd ~/.codex/superpowers && git pull        # Codex
cd ~/.config/opencode/superpowers && git pull  # OpenCode
```

The `checkForUpdates()` function in `skills-core.js` runs `git fetch` with a 3-second timeout to detect available updates without blocking.

### Cross-Platform Hook System

The `hooks/run-hook.cmd` file is a **polyglot script** — valid syntax in both Windows CMD and Unix bash:

```
Windows CMD:  run-hook.cmd session-start
              └─▶ Finds bash.exe (Git for Windows / MSYS2 / Cygwin)
              └─▶ Executes hooks/session-start via bash

Unix/macOS:   run-hook.cmd session-start
              └─▶ bash directly executes hooks/session-start
```

This eliminates the need for separate Windows scripts while maintaining a single codebase.

---

## 12. Testing Infrastructure

### Test Organization

```
tests/
├── claude-code/                  # Platform-specific tests
│   ├── run-skill-tests.sh        #   Test runner (--verbose, --test, --timeout)
│   └── test-document-review-     #   End-to-end document review tests
│       system.sh
├── brainstorm-server/            # Visual companion integration tests
├── explicit-skill-requests/      # Direct skill invocation verification
├── skill-triggering/             # Auto-triggering behavior tests
├── subagent-driven-dev/          # SDD workflow integration tests
└── opencode/                     # OpenCode platform tests
```

### Test Runner

```bash
# Run all tests
./tests/claude-code/run-skill-tests.sh

# Run specific test with verbose output
./tests/claude-code/run-skill-tests.sh --test document-review --verbose

# With custom timeout (default: 5 minutes)
./tests/claude-code/run-skill-tests.sh --timeout 600
```

### Testing Methodology

Documented in `docs/testing.md`:

- **Integration tests** verify end-to-end skill behavior
- **Session files** use JSONL format with usage tracking
- **Token analysis** via Python script for cost monitoring
- **Writing new tests:** Template provided for consistent structure

### Skill Testing (TDD for Process)

From `writing-skills`:

1. **RED:** Run pressure scenario WITHOUT skill → document baseline
2. **GREEN:** Write skill → run WITH skill → verify compliance
3. **REFACTOR:** Close loopholes, add counters, re-test

Pressure scenarios include: academic questions + time pressure + sunk cost + exhaustion

---

## Appendix: Skill Quick-Reference Table

| # | Skill | Iron Law / Core Rule | When to Use |
|---|-------|---------------------|-------------|
| 1 | **using-superpowers** | 1% chance → MUST invoke | Every session start |
| 2 | **brainstorming** | No implementation without approved design | Before any creative work |
| 3 | **writing-plans** | Every task follows 5-step TDD order | Have approved spec |
| 4 | **executing-plans** | Follow plan steps exactly | Execute in separate session |
| 5 | **subagent-driven-development** | Both reviewers required per task | Execute with subagents |
| 6 | **refining-plans** | Max 5 iterations, then escalate | Plan needs stress-testing |
| 7 | **test-driven-development** | No production code without failing test | Always (features, fixes, refactors) |
| 8 | **systematic-debugging** | No fixes without root cause investigation | Any bug or unexpected behavior |
| 9 | **verification-before-completion** | No claims without fresh evidence | Before any completion claim |
| 10 | **requesting-code-review** | Review early, review often | After tasks, before merge |
| 11 | **receiving-code-review** | Technical evaluation, not performative agreement | When receiving feedback |
| 12 | **security-review** | No merge without security checklist | Before merging any code |
| 13 | **dispatching-parallel-agents** | Full test suite after all agents | 2+ independent failures |
| 14 | **using-git-worktrees** | Verify clean test baseline | Before implementation |
| 15 | **finishing-a-development-branch** | Verify tests before offering options | Implementation complete |
| 16 | **live-docs-lookup** | Always fetch models page first | Building with AI SDKs |
| 17 | **auditing-ai-generated-code** | Evaluate all 7 dimensions | AI code needs assessment |
| 18 | **writing-skills** | TDD for process documentation | Creating/editing skills |

---

*Generated from Superpowers v5.0.0 source code analysis. For the latest information, see the [GitHub repository](https://github.com/obra/superpowers).*
