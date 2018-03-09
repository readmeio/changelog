const regex = /^\[feature\](?:\[(\w*)\])?\s(.*)?/;

function parseCommit(commit) {
  const matches = regex.exec(commit.subject);
  if (!matches) return undefined;

  return {
    title: matches[2],
    type: matches[1],
    date: commit.authorDate,
    description: commit.body || '',
  };
}

module.exports = commits => commits.map(parseCommit).filter(Boolean);

module.exports.parseCommit = parseCommit;
