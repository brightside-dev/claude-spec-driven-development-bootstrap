# stack rules — iOS (Swift + SwiftUI)

Always loaded. The {{STACK_LABEL}} conventions for {{PROJECT_TITLE}}.

## Shape

```
App/
  Sources/
    Features/     # one folder per feature: View + ViewModel + Model
    Core/         # networking, persistence, shared services
  Tests/
```

- Test: `{{TEST_COMMAND}}`
- Build: `{{BUILD_COMMAND}}`
- Run: `{{RUN_COMMAND}}`
- Swift 5.9+, SwiftUI, targeting a current iOS version. Swift Package Manager for
  dependencies.

## Architecture

- **MVVM.** Views are declarative and dumb; `ViewModel` (an `ObservableObject` or
  `@Observable`) holds state and logic. Models are plain value types.
- **Value types by default.** `struct` over `class` unless you need reference
  semantics or identity.
- **Concurrency is async/await + actors.** No completion-handler pyramids for new
  code. Isolate shared mutable state in an actor.
- **Dependencies are injected**, so a ViewModel can be tested without the network.

## SwiftUI

- Small composable views; extract a subview before a `body` gets long.
- State ownership is explicit: `@State` local, `@Binding` passed down,
  `@StateObject`/`@Observable` owned, `@EnvironmentObject` shared.
- Never block the main actor with slow work.

## Safety

- No force-unwraps (`!`) in shipping code — use `guard let` / `if let`.
- Errors are typed and thrown, not swallowed.
