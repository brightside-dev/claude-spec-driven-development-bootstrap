// The scaffolding engine. Copies the base template tree, then the selected
// stack overlay, substituting a fixed allowlist of {{VARS}} in file *contents*
// and replacing the __PROJECT__ token in file/dir *names* with the project
// namespace. Only allowlisted keys are substituted, so literal {{...}} in a
// template (e.g. a code sample) is left untouched.

import { promises as fs } from 'node:fs';
import path from 'node:path';

export function buildVars({ projectName, projectTitle, stack, date }) {
  return {
    PROJECT_NAME: projectName,
    PROJECT_TITLE: projectTitle,
    FRAMEWORK_NAME: 'Claude Spec-Driven Development',
    STACK_ID: stack.id,
    STACK_LABEL: stack.label,
    STACK_HINT: stack.hint,
    PLATFORM: stack.platform,
    LANGUAGE: stack.language,
    DATABASE: stack.database,
    DEV_SERVICES: stack.devServices,
    TEST_COMMAND: stack.testCommand,
    BUILD_COMMAND: stack.buildCommand,
    RUN_COMMAND: stack.runCommand,
    STACK_AGENTS: stack.agents.join(', '),
    DATE: date,
  };
}

function substitute(content, vars) {
  return content.replace(/\{\{([A-Z_]+)\}\}/g, (match, key) =>
    key in vars ? vars[key] : match,
  );
}

function renamePathToken(segment, vars) {
  return segment.replace(/__PROJECT__/g, vars.PROJECT_NAME);
}

async function copyTree(srcDir, destRoot, vars) {
  let entries;
  try {
    entries = await fs.readdir(srcDir, { withFileTypes: true });
  } catch {
    return; // overlay dir may not exist for a given stack
  }
  for (const entry of entries) {
    const src = path.join(srcDir, entry.name);
    const destName = renamePathToken(entry.name, vars);
    if (entry.isDirectory()) {
      await copyTree(src, path.join(destRoot, destName), vars);
    } else {
      const raw = await fs.readFile(src, 'utf8');
      const out = substitute(raw, vars);
      const destPath = path.join(destRoot, destName);
      await fs.mkdir(path.dirname(destPath), { recursive: true });
      await fs.writeFile(destPath, out, 'utf8');
    }
  }
}

export async function scaffoldProject({ templatesDir, stackId, vars, targetDir }) {
  await fs.mkdir(targetDir, { recursive: true });
  await copyTree(path.join(templatesDir, 'base'), targetDir, vars);
  await copyTree(path.join(templatesDir, 'stacks', stackId), targetDir, vars);
}

export async function dirIsNonEmpty(dir) {
  try {
    const entries = await fs.readdir(dir);
    return entries.length > 0;
  } catch {
    return false;
  }
}
