/* eslint-env mocha */

const cp = require('child_process');
const os = require('os');
const moment = require('moment');
const assert = require('assert');
const rimraf = require('rimraf');
const which = require('which');
const { mkdtempSync } = require('fs');
const { resolve, join } = require('path');

const gitExecutable = which.sync('git');

function spawn(cmd, args, opts) {
  const { stderr, stdout } = cp.spawnSync(cmd, args, opts);

  if (stderr && stderr.toString()) throw new Error(stderr.toString());
}

function makeCommits(cwd, msg = '', date = moment()) {
  const opts = {
    cwd,
    env: {
      GIT_COMMITTER_DATE: date.toISOString(),
      GIT_AUTHOR_DATE: date.toISOString(),
    },
  };

  spawn(gitExecutable, ['init'], opts);
  spawn(gitExecutable, ['commit', '-m', `[feature][new] new feature ${msg}`, '--allow-empty'], opts);
  spawn(gitExecutable, ['commit', '-m', `non-changelog worthy commit ${msg}`, '--allow-empty'], opts);
  spawn(gitExecutable, ['commit', '-m', `[feature][fixed] fixed bug feature ${msg}`, '--allow-empty'], opts);
}

function spawnChangelog(cwd) {
  const { stderr, stdout } = cp.spawnSync(resolve(__dirname, '..', 'bin', 'changelog.js'), [], { cwd });

  if (stderr.toString()) throw new Error(stderr.toString());
  if (stdout.toString()) console.log('output', stdout.toString()); // eslint-disable-line no-console
}

describe('bin', () => {
  let cwd;
  beforeEach(() => {
    cwd = mkdtempSync(join(os.tmpdir(), 'changelog-'));
    makeCommits(cwd, '1', moment().subtract(1, 'day'));
  });

  afterEach(() => {
    rimraf.sync(cwd);
  });

  it('should write to changelog.json if it does not exist', () => {
    spawnChangelog(cwd);

    // eslint-disable-next-line global-require, import/no-dynamic-require
    const changelog = require(join(cwd, 'changelog.json'));
    assert.equal(changelog.length, 2);
  });

  it('should prefix output to changelog.json: newest first', () => {
    spawnChangelog(cwd);
    makeCommits(cwd, '2', moment());
    spawnChangelog(cwd);

    // eslint-disable-next-line global-require, import/no-dynamic-require
    const changelog = require(join(cwd, 'changelog.json'));

    assert.equal(changelog.length, 4);
  });

  it('should only return commits later than the latest', () => {
    spawnChangelog(cwd);

    // Make some older commits than the initial set, these shouldnt be included
    makeCommits(cwd, '2', moment().subtract(2, 'day'));

    spawnChangelog(cwd);

    // eslint-disable-next-line global-require, import/no-dynamic-require
    const changelog = require(join(cwd, 'changelog.json'));

    assert.equal(changelog.length, 2);
  });
});
