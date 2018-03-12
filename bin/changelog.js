#!/usr/bin/env node
const fs = require('fs');

const { join } = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const gitlog = promisify(require('gitlog'));

const outputFile = join(process.cwd(), 'changelog.json');
const changelog = require('../');

async function main() {
  let output;
  let since;
  try {
    output = JSON.parse(await readFile(outputFile));
    // Have to add a second onto the date otherwise it'll include
    // the last commit that was made as well
    since = new Date(output[0].date);
    since.setSeconds(since.getSeconds() + 1);
    since = since.toISOString();
  } catch (e) {
    output = [];
    since = null;
  }

  const commits = await gitlog({ repo: process.cwd(), fields: ['subject', 'authorDate', 'body'], since });

  await writeFile(outputFile, JSON.stringify(changelog(commits).concat(output), null, 2));
}

main().catch((e) => {
  console.error(e); // eslint-disable-line no-console
  process.exit(1);
});
