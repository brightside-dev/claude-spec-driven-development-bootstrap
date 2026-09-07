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
