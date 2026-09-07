# stack rules — Desktop (Python + PySide6 / Qt)

Always loaded. The {{STACK_LABEL}} conventions for {{PROJECT_TITLE}}.

## Shape

```
app/
  __main__.py     # entry point
  ui/             # widgets / windows (the view)
  viewmodels/     # presentation logic, no Qt imports where avoidable
  core/           # domain logic, services, persistence
tests/
```

- Test: `{{TEST_COMMAND}}`
- Build: `{{BUILD_COMMAND}}` (PyInstaller for a shippable binary)
- Run: `{{RUN_COMMAND}}`
- Python 3.11+, PySide6 (Qt). Dependencies in a virtualenv; pin them.
- Database: **{{DATABASE}}**. No server, no container - it is a file next to the app.

## Persistence (SQLite)

- Local state lives in an embedded SQLite file (e.g. `app.db`), opened from
  `core/` via the stdlib `sqlite3`. It is single-user desktop storage - there is
  no DB server and no Docker DB container.
- Keep the DB file out of git (`*.db` is gitignored). Ship schema setup/migration
  as code the app runs on first launch, not as a manual step.

## Docker (headless test/CI only)

- The GUI is **not** run in Docker (a Qt app needs a display; X11 forwarding is
  painful and not worth it). The `Dockerfile` builds a headless image only for
  running tests and linters in CI, with `QT_QPA_PLATFORM=offscreen`.
- Locally, run and test on the host in a virtualenv. Use the image when you want
  the exact CI environment: `{{DEV_SERVICES}}` then `docker run --rm app-ci`.

## Architecture

- **Keep logic out of widgets.** The domain logic in `core/` has **no Qt import**,
  so it can be tested without a display. Widgets are a thin view over it.
- **Signals/slots** connect UI events to logic — don't call business functions
  straight from a button handler that also does the work.
- **Long work goes off the UI thread** (`QThread` / `QThreadPool` / a worker
  object). Never freeze the event loop; the UI must stay responsive.
- Type-hint everything; treat the code as if `mypy` runs (it should).

## Python style

- PEP 8, `black`-formatted, `ruff`-clean.
- Small functions, one job each. Dataclasses for plain data.
- Handle errors explicitly; never `except:` bare. No mutable default arguments.

## Packaging

- A `pyproject.toml` is the source of truth for deps and metadata.
- The app runs with `{{RUN_COMMAND}}` from a clean virtualenv, or nobody else can
  run it.
