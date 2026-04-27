# Contributing Guide

Thank you for contributing to this project. Please follow the guidelines below to keep the workflow clean and consistent.

## Branching Strategy

- `main` — stable, production-ready code. Do not push directly.
- `dev` — active development branch. Branch off from here.
- Feature branches — named as `feature/short-description` (e.g. `feature/add-login-api`).
- Bug fix branches — named as `fix/short-description` (e.g. `fix/model-loading-error`).

```
main
 └── dev
      ├── feature/your-feature
      └── fix/your-bugfix
```

## Workflow

1. Branch off from `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature
   ```

2. Make your changes, commit with clear messages:
   ```bash
   git add .
   git commit -m "feat: add preprocessing pipeline"
   ```

3. Push your branch and open a Pull Request against `dev`:
   ```bash
   git push origin feature/your-feature
   ```

4. Request a review before merging.

## Commit Message Format

Use short, descriptive prefixes:

| Prefix | When to use |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `chore:` | Tooling, config, dependencies |
| `docs:` | Documentation only |
| `refactor:` | Code restructuring, no behavior change |

## Pull Request Rules

- Keep PRs focused — one feature or fix per PR.
- Include a short description of what changed and why.
- Make sure the app runs before opening a PR.
- Do not merge your own PR without a review.

## Code Style

- Python: follow PEP 8. Use a formatter (e.g. `ruff format`).
- JavaScript/JSX: follow the existing component patterns.
- Keep functions small and names descriptive.
