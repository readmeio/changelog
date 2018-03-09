/* eslint-env mocha */
const assert = require('assert');

const generateChangelog = require('../');

const { parseCommit } = generateChangelog;

describe('@readme/changelog', () => {
  it('should return with an array of parsed commit objects', () => {
    assert.deepEqual(generateChangelog([
      {
        subject: '[feature][new] This is a cool new feature',
        authorDate: '2018-03-07 16:56:43 -0800',
      },
      {
        subject: '[feature][improvement] This is some *markdown* content',
        body: 'Here\'s a longer description of this feature!\nYou can use it like this',
        authorDate: '2018-03-05 16:56:43 -0800',
      },
      {
        subject: 'some other change',
        authorDate: '2018-03-01 16:56:43 -0800',
      },
      {
        subject: '[feature] This is an uncategorised feature',
        authorDate: '2018-02-20 16:56:43 -0800',
      },
    ]), [
      {
        type: 'new',
        date: '2018-03-07 16:56:43 -0800',
        description: '',
        title: 'This is a cool new feature',
      },
      {
        type: 'improvement',
        date: '2018-03-05 16:56:43 -0800',
        title: 'This is some *markdown* content',
        description: 'Here\'s a longer description of this feature!\nYou can use it like this',
      },
      {
        type: null,
        description: '',
        date: '2018-02-20 16:56:43 -0800',
        title: 'This is an uncategorised feature',
      },
    ]);
  });
});

describe('#parseCommit()', () => {
  it('should ignore commits without [feature]', () => {
    assert.equal(parseCommit({
      subject: 'commit message',
    }), undefined);
  });

  it('should return type of change', () => {
    assert.equal(parseCommit({
      subject: '[feature][new] change',
    }).type, 'new');
  });

  it('should return with no type if no type', () => {
    assert.equal(parseCommit({
      subject: '[feature] change',
    }).type, null);
  });

  it('should return with date', () => {
    const date = '2018-03-01 16:56:43 -0800';
    assert.equal(parseCommit({
      subject: '[feature][new] change',
      authorDate: date,
    }).date, date);
  });

  it('should return first line of commit as a title', () => {
    const title = 'This is the *title* of the commit';
    assert.equal(parseCommit({
      subject: `[feature][new] ${title}`,
    }).title, title);
  });

  it('should return the body as the description', () => {
    const body = 'This is the commit body\nwhich may contain new lines\nand [markdown](http://readme.io)';
    assert.equal(parseCommit({
      subject: '[feature][new] change',
      body,
    }).description, body);
  });

  it('should strip other fields', () => {
    assert.equal(parseCommit({
      subject: '[feature][new] change',
      status: ['M'],
    }).status, undefined);
    assert.equal(parseCommit({
      subject: '[feature][new] change',
      files: ['file.js'],
    }).files, undefined);
  });
});
