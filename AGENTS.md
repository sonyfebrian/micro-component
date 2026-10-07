# Codex Project Instructions

## Project Context

Before starting any task, read `CLAUDE.md` first.

`CLAUDE.md` is the primary source of project context and contains information
about the architecture, tech stack, conventions, business rules, and previous
analysis.

Do not perform a full repository scan if the required information is already
available in `CLAUDE.md`.

## Working Rules

When receiving a task:

1. Read `CLAUDE.md`.
2. Understand the requested task.
3. Identify only the files relevant to the task.
4. Inspect those files to verify the current implementation.
5. Do not scan unrelated directories or files.
6. Reuse existing project patterns and conventions.
7. Do not introduce new architecture, dependencies, or patterns unless required.
8. Before making significant changes, explain the intended approach briefly.

## Existing Analysis

Assume that architectural analysis documented in `CLAUDE.md` has already been
performed.

Do not repeat the same analysis unless:
- the information appears outdated,
- the implementation conflicts with `CLAUDE.md`,
- or the current task requires deeper investigation.

## Handoff

If `TASK_HANDOFF.md` exists, read it after `CLAUDE.md`.

Use it to understand:
- the current task,
- completed work,
- previous decisions,
- relevant files,
- and the next implementation step.

Continue from that state instead of restarting the task from scratch.