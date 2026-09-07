#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  intro, outro, text, select, confirm, spinner, isCancel, cancel, note, log,
} from '@clack/prompts';
import pc from 'picocolors';

import { STACKS, getStack } from '../lib/stacks.mjs';
import { buildVars, scaffoldProject, dirIsNonEmpty } from '../lib/scaffold.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TEMPLATES = path.join(ROOT, 'templates');

const bail = (value) => {
  if (isCancel(value)) {
    cancel('Setup cancelled. Nothing was written.');
    process.exit(0);
  }
  return value;
};

const banner = () => {
  const line = pc.dim('─'.repeat(52));
  console.log('');
  console.log('  ' + pc.bgCyan(pc.black(' CSDD ')) + '  ' + pc.bold('Claude Spec-Driven Development'));
  console.log('  ' + line);
  console.log('  ' + pc.dim('Scaffold agents, skills, commands & a spec workflow'));
  console.log('  ' + pc.dim('tailored to your stack.'));
  console.log('');
};

const toSlug = (s) =>
  s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

async function main() {
  banner();
  intro(pc.cyan(' Let\'s set up your project '));

  const projectTitle = bail(
    await text({
      message: 'Project name?',
      placeholder: 'project1',
      validate: (v) => (!v || !v.trim() ? 'Give it a name.' : undefined),
    }),
  );
  const projectName = toSlug(projectTitle);

  const stackId = bail(
    await select({
      message: 'Which stack are you building on?',
      options: STACKS.map((s) => ({
        value: s.id,
        label: `${pc.bold(s.label)}  ${pc.dim('· ' + s.hint)}`,
      })),
    }),
  );
  const stack = getStack(stackId);

  const targetInput = bail(
    await text({
      message: 'Where should it be created?',
      placeholder: `./${projectName}`,
      defaultValue: `./${projectName}`,
    }),
  );
  const targetDir = path.resolve(process.cwd(), targetInput || `./${projectName}`);

  if (await dirIsNonEmpty(targetDir)) {
    const proceed = bail(
      await confirm({
        message: `${pc.yellow(targetDir)} is not empty. Write into it anyway?`,
        initialValue: false,
      }),
    );
    if (!proceed) {
      cancel('Stopped so nothing gets overwritten.');
      process.exit(0);
    }
  }

  const doGit = bail(
    await confirm({ message: 'Initialise a git repository?', initialValue: true }),
  );

  note(
    [
      `${pc.dim('Project')}    ${pc.bold(projectTitle)}  ${pc.dim('(command: /' + projectName + ')')}`,
      `${pc.dim('Stack')}      ${stack.label} ${pc.dim('· ' + stack.hint)}`,
      `${pc.dim('Language')}   ${stack.language}`,
      `${pc.dim('Database')}   ${stack.database}`,
      `${pc.dim('Location')}   ${targetDir}`,
      `${pc.dim('Agents')}     ${['spec-architect', 'spec-engineer', 'spec-reviewer', 'spec-qa', ...stack.agents].join(', ')}`,
    ].join('\n'),
    'About to create',
  );

  const go = bail(await confirm({ message: 'Looks good?', initialValue: true }));
  if (!go) {
    cancel('No worries. Run it again when you\'re ready.');
    process.exit(0);
  }

  const s = spinner();
  s.start('Generating your spec-driven workspace');

  const vars = buildVars({
    projectName,
    projectTitle,
    stack,
    date: new Date().toISOString().slice(0, 10),
  });

  await scaffoldProject({ templatesDir: TEMPLATES, stackId, vars, targetDir });

  if (doGit) {
    spawnSync('git', ['init', '-q'], { cwd: targetDir });
  }
  s.stop(pc.green('Workspace ready.'));

  log.success(`Created ${pc.bold(projectTitle)} at ${pc.dim(targetDir)}`);

  note(
    [
      `${pc.cyan('cd')} ${path.relative(process.cwd(), targetDir) || '.'}`,
      `${pc.cyan(stack.devServices)}`,
      `${pc.cyan('claude')}                       ${pc.dim('# open Claude Code here')}`,
      '',
      `${pc.bold('Then, inside Claude Code:')}`,
      `  ${pc.green('/' + projectName)} ${pc.dim('<describe what you want to build>')}`,
      '',
      `${pc.dim('Every command is namespaced under')} ${pc.bold('/' + projectName)}${pc.dim(':')}`,
      `  ${pc.green('/' + projectName + ':propose')}    ${pc.dim('capture intent as a spec')}`,
      `  ${pc.green('/' + projectName + ':plan')}       ${pc.dim('architect the change')}`,
      `  ${pc.green('/' + projectName + ':implement')}  ${pc.dim('build it, phase by phase')}`,
      `  ${pc.green('/' + projectName + ':review')}     ${pc.dim('review against the spec')}`,
      `  ${pc.green('/' + projectName + ':archive')}    ${pc.dim('fold the delta into specs')}`,
    ].join('\n'),
    'Next steps',
  );

  outro(pc.green('Happy spec-driven building.'));
}

main().catch((err) => {
  console.error(pc.red('\nSetup failed:'), err.message);
  process.exit(1);
});
