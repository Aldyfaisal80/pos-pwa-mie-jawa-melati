# Comprehensive Multi-Agent Health & Status Audit

This orchestration plan outlines the approach for a deep, system-wide health and status check utilizing three distinct agents as per the `@[/orchestrate]` and `@[/webapp-testing]` workflows.

## Goal Description

To holistically evaluate the project's health, covering code quality, security vulnerabilities, bundle performance, and end-to-end (E2E) webapp reliability. We will leverage the automated scripts provided by the agent skill set across multiple specialized perspectives.

## User Review Required

> [!IMPORTANT]
> The development server is recorded as running (`http://localhost:3000`). The `test-engineer` will use this active instance to run the Playwright browser tests.
> Are there any specific routes, authentication flows, or priority modules you want the E2E tests to focus on, or should we let the agent perform automatic discovery?

> [!WARNING]
> Running the complete suite of audits (especially Playwright E2E and Bundle Analyzer) may temporarily consume high CPU resources on your local machine.

## Proposed Changes (Parallel Agent Execution)

Upon approval, we will proceed to **Phase 2 (Implementation)** and spin up the following agents strictly in parallel to fetch reports:

### 1. 🛡️ `security-auditor`
Focuses on project vulnerabilities, outdated dependencies, and security best practices.
- **Task:** Run dependency and vulnerability scans.
- **Execution:**
  - `python .agent/skills/vulnerability-scanner/scripts/dependency_analyzer.py .`
  - `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .`

### 2. 🧪 `test-engineer`
Focuses on typing, linting, unit tests, and the requested deep webapp-testing.
- **Task:** Audit codebase formatting, type safety, and execute Playwright tests against `http://localhost:3000`.
- **Execution:**
  - `python .agent/skills/lint-and-validate/scripts/lint_runner.py .`
  - `python .agent/skills/testing-patterns/scripts/test_runner.py .`
  - `python .agent/skills/webapp-testing/scripts/playwright_runner.py http://localhost:3000`

### 3. ⚡ `performance-optimizer`
Focuses on application speed, package sizes, and Core Web Vitals.
- **Task:** Conduct a bundle size analysis and basic Lighthouse emulation.
- **Execution:**
  - `python .agent/skills/performance-profiling/scripts/bundle_analyzer.py .`
  - `python .agent/skills/performance-profiling/scripts/lighthouse_audit.py .`

## Final Synthesis
All agents will return their findings to the `orchestrator`, which will then deliver a unified **🎼 Orchestration Report** containing the final Pass/Fail verdicts and key findings.
