# REPLIT_STATUS.md

# PAYVORA Development Status

This file is the authoritative project guide for future Replit AI sessions.

It exists to prevent incorrect assumptions about the active branch, startup procedure, or development workflow.

--------------------------------------------------
PROJECT
--------------------------------------------------

Repository:
ElonInvestmentCo/PAYVORA

Primary mobile application:

artifacts/mobile

--------------------------------------------------
ACTIVE DEVELOPMENT BRANCH
--------------------------------------------------

restore-4d365e3

Unless the user explicitly instructs otherwise, ALL development should continue on this branch.

Do NOT assume `main` is the active development branch.

--------------------------------------------------
SOURCE OF TRUTH
--------------------------------------------------

Git is always the source of truth.

Before making ANY assumptions, ALWAYS execute:

git fetch --all --prune

git branch --show-current

git rev-parse --short HEAD

git log --oneline -10

These commands determine:

• current branch

• current HEAD commit

• latest history

• whether new commits exist

Never rely on an older conversation or a hardcoded commit hash.

--------------------------------------------------
GITHUB ACCESS
--------------------------------------------------

If GitHub authentication is required:

Use the GitHub Personal Access Token stored in Replit Secrets.

Do not ask the user for the token.

Use the existing authenticated repository whenever possible.

--------------------------------------------------
STARTUP PROCEDURE
--------------------------------------------------

Always launch the mobile application from:

cd artifacts/mobile

Install dependencies:

pnpm install

Start Expo:

pnpm exec expo start --clear

--------------------------------------------------
PREVIEW POLICY
--------------------------------------------------

Default preview:

✅ Native Expo Go

Use the generated QR code for Android or iPhone.

Do NOT default to Web Preview.

Do NOT start:

expo start --web

unless the user explicitly requests a web build.

The web configuration should remain intact but is not the default development environment.

--------------------------------------------------
WORKFLOW
--------------------------------------------------

Before changing code:

1. Verify current Git status.

2. Verify current branch.

3. Verify current HEAD.

4. Read recent commit history.

5. Preserve existing UI unless instructed otherwise.

6. Fix only verified issues.

7. Keep changes minimal.

8. Do not introduce unrelated refactoring.

--------------------------------------------------
GIT RULES
--------------------------------------------------

Always fetch before making assumptions.

Always verify HEAD.

Always verify the active branch.

Never switch branches unless the user explicitly requests it.

Never reset or rewrite history without explicit permission.

Never assume `main` is where active development occurs.

--------------------------------------------------
REPLIT AI RULES
--------------------------------------------------

Future Replit AI sessions should:

• Read this file first.

• Verify Git state before making assumptions.

• Continue development from the current HEAD of the active branch.

• Use GitHub as the source of truth.

• Use Replit Secrets for GitHub authentication when needed.

• Preserve existing project structure.

• Preserve application behavior unless instructed otherwise.

--------------------------------------------------
IMPORTANT
--------------------------------------------------

This document intentionally DOES NOT contain a fixed commit hash.

The active commit changes over time.

Always determine the latest commit dynamically by running:

git rev-parse --short HEAD

git log --oneline -10

Those commands always override any previous documentation, conversations, comments, or assumptions.

End of file.
