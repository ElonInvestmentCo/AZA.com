# REPLIT_STATUS.md

# Current Development Baseline

## Active Development Branch

restore-4d365e3

## Repository

ElonInvestmentCo/AZA.com

## Mobile App

artifacts/mobile

## Before Doing Anything

Always verify the current repository state first by running:

git fetch --all --prune
git branch --show-current
git rev-parse --short HEAD
git log --oneline -5

The output of these commands is the source of truth.

Do NOT assume that `main` is the active development branch.

## Startup

cd artifacts/mobile
pnpm install
pnpm exec expo start --clear

Always preview using Expo Go (native mobile QR code).

Do not default to the web preview unless explicitly requested.

## Git Rules

- Always work on the `restore-4d365e3` branch unless explicitly instructed otherwise.
- Always fetch before making assumptions.
- Always verify the current HEAD before making changes.
- Do not switch to `main` unless explicitly instructed.
- Use GitHub as the source of truth.
- If GitHub authentication is required, use the GitHub token stored in Replit Secrets.

## Important

This document intentionally does **not** hardcode a commit hash because the latest commit changes over time.

Always determine the current commit by running:

git rev-parse --short HEAD
git log --oneline -5