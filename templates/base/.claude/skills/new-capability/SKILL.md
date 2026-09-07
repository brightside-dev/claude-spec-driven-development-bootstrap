---
name: new-capability
description: Scaffold a brand-new capability spec for {{PROJECT_TITLE}} — a fresh folder under spec/specs/ with a numbered-requirements skeleton. Use when starting a feature area that does not exist yet.
---

# New capability

Create the canonical spec for a capability that does not exist yet.

## Steps

1. Ask for the capability name if not given. Kebab-case it (e.g. `user-auth`).
2. Create `spec/specs/<capability>/spec.md` with this skeleton:

```markdown
# <Capability> — specification

_What this capability is responsible for, in one paragraph._

## Requirements

### R-1.1  <short behaviour title>
- WHEN <trigger / precondition>
- THEN <observable outcome>
- Test: <how this is proven>

### R-1.2  <...>
```

3. Add a one-line entry to `spec/project.md` under a "Capabilities" list.
4. Stop and show it. Do **not** implement — capabilities become real through the
   `/{{PROJECT_NAME}}` loop, not by editing code directly.
```
