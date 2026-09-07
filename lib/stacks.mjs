// The stack registry. Each entry drives the wizard menu, the variables
// substituted into the base templates, and which overlay directory is copied
// on top of the base. Add a stack by adding an entry here and a matching
// folder under templates/stacks/<id>/.

export const STACKS = [
  {
    id: 'web-nestjs-nuxtjs',
    label: 'Web',
    hint: 'NestJS API + Nuxt 3 frontend (TypeScript)',
    platform: 'Web',
    language: 'TypeScript',
    database: 'MySQL 8 (Docker Compose)',
    devServices: 'docker compose up -d  # MySQL on localhost:3306',
    testCommand: 'pnpm test',
    buildCommand: 'pnpm build',
    runCommand: 'pnpm dev',
    agents: ['nestjs-backend-engineer', 'nuxt-frontend-engineer', 'api-contract-designer'],
  },
  {
    id: 'ios-swift',
    label: 'iOS',
    hint: 'Swift + SwiftUI',
    platform: 'iOS',
    language: 'Swift',
    database: 'Supabase (Postgres) via Supabase CLI',
    devServices: 'supabase start  # local Supabase stack in Docker',
    testCommand: 'xcodebuild test -scheme App -destination "platform=iOS Simulator,name=iPhone 15"',
    buildCommand: 'xcodebuild build -scheme App',
    runCommand: 'open App.xcodeproj  # run in Xcode / Simulator',
    agents: ['swift-ios-engineer', 'swiftui-designer'],
  },
  {
    id: 'android-kotlin',
    label: 'Android',
    hint: 'Kotlin + Jetpack Compose',
    platform: 'Android',
    language: 'Kotlin',
    database: 'Supabase (Postgres) via Supabase CLI',
    devServices: 'supabase start  # local Supabase stack in Docker',
    testCommand: './gradlew test',
    buildCommand: './gradlew assembleDebug',
    runCommand: './gradlew installDebug',
    agents: ['kotlin-android-engineer', 'compose-ui-designer'],
  },
  {
    id: 'desktop-python',
    label: 'Desktop',
    hint: 'Python + PySide6 (Qt) — the easy desktop path',
    platform: 'Desktop',
    language: 'Python',
    database: 'SQLite (embedded file)',
    devServices: 'docker build -t app-ci .  # headless test/CI image (optional)',
    testCommand: 'pytest',
    buildCommand: 'python -m build',
    runCommand: 'python -m app',
    agents: ['python-desktop-engineer', 'python-ui-designer'],
  },
];

export function getStack(id) {
  return STACKS.find((s) => s.id === id);
}
