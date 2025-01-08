# 💝 Code Style Guidelines

## Principles

- Rely on automation/IDE
- Strive for pragmatism
- Don’t add bells and whistles (newlines, spaces for “beauty”, ordering imports etc.)
- Avoid unnecessary stylistic changes
  - They increase the chance of git conflicts (esp. in imports)
  - They make it harder to review the PR
  - Ultimately, a waste of time

## Functional code style

- Write small functions that do one thing with no side-effects
- Compose small functions to do more things
- Same with components: don’t write giant components, write small composable components
- Prefer `map`/`filter` over `reduce`/`forEach`
- Watch out when using destructive methods like `pop` or `sort` (yes, `sort` is destructive!)
- Avoid initializing things on the module level, prefer to export an init function instead

## Reactive programming

- Keep in mind the React component life-cycle, avoid excessive re-renders
- Glue regular JS functions and events with React using hooks
- Write small `useEffect` hooks that do just one thing and have only necessary dependencies

## Variable/function naming

Infamously, the hardest problem in computer science.

- Components are classes, so their names should be in PascalCase
- Config-like constants should be in UPPER_CASE, e.g. `INFURA_URL`
- Regular `const` variables should be in camelCase
- Avoid prepositions in variable names:
  - ~`restoreFromLocalStorage`~ 🙅
  - `restoreStoredValue` 👍
- Try to name boolean vars with `is`, e.g. `isLoading` vs `loading`
- If something needs to be exported just for unit tests, export it with a `_` prefix, e.g. `_getOnboardConfig`
