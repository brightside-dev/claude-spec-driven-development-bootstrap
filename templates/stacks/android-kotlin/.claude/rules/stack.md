# stack rules — Android (Kotlin + Jetpack Compose)

Always loaded. The {{STACK_LABEL}} conventions for {{PROJECT_TITLE}}.

## Shape

```
app/
  src/main/java/<pkg>/
    feature/      # one package per feature: Screen + ViewModel + state
    core/         # network, data, di
  src/test/       # unit tests
  src/androidTest/# instrumented / UI tests
```

- Test: `{{TEST_COMMAND}}`
- Build: `{{BUILD_COMMAND}}`
- Run: `{{RUN_COMMAND}}`
- Kotlin, Jetpack Compose, Gradle (Kotlin DSL).
- Backend: **{{DATABASE}}**. Start the local stack with `{{DEV_SERVICES}}`.

## Backend (Supabase)

- Local dev runs the full Supabase stack in Docker via the Supabase CLI. Config
  lives in `supabase/config.toml`; `supabase start` boots Postgres + Auth +
  Storage + Studio, `supabase stop` tears it down.
- Install the CLI once (`brew install supabase/tap/supabase`, or see the docs for
  other platforms), then `supabase start`. `supabase status` prints the local API
  URL and anon key the app uses.
- Add the `supabase-kt` (supabase-community) libraries via Gradle. Read the API
  URL and anon key from `local.properties` / build config - never commit
  production keys.
- Schema changes are **migrations** in `supabase/migrations/` (`supabase migration
  new <name>`), applied with `supabase db reset`. The DB is the source of truth,
  not ad-hoc changes in Studio.

## Architecture

- **MVVM + unidirectional data flow.** The `ViewModel` exposes immutable UI state
  via `StateFlow`; the Composable observes it and sends events up. State flows
  down, events flow up.
- **Coroutines + Flow** for async. Scope work to `viewModelScope`; never block the
  main thread.
- **Repository pattern** for data; the ViewModel talks to repositories, not to the
  network or database directly.
- **Dependency injection** (Hilt or manual) so ViewModels are testable.

## Compose

- Stateless composables that take state + lambdas; hoist state to the ViewModel.
- `remember` / `rememberSaveable` deliberately; survive configuration changes.
- Preview composables for each screen state.
- Accessibility: content descriptions, touch targets, semantics.

## Safety

- Prefer `val` and immutable data classes. Handle nullability — no `!!` in
  shipping code. Model results as a sealed `Result`/state type, not exceptions
  crossing layers.
