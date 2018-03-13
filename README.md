# @readme/changelog

Changelog generator in use at ReadMe

[![CircleCI](https://circleci.com/gh/readmeio/changelog.svg)](https://circleci.com/gh/readmeio/changelog)

[![](https://d3vv6lp55qjaqc.cloudfront.net/items/1M3C3j0I0s0j3T362344/Untitled-2.png)](https://readme.io)

## Installation

```sh
npm install @readme/changelog --save
```

## Usage
Parses your recent git history for any commits that look like the following:

```
[feature][new] This is a brand new feature!

This is a longer description of the feature
```

This gets parsed out into a commit object like the following:

```json
{
  "type": "new",
  "title": "This is a brand new feature!",
  "date": "2018-03-13 10:42:45 -0700",
  "description": "This is a longer description of the feature"
}
```

If you use the cli, an array of commits will get saved to `changelog.json` in the current working directory.

```sh
$ changelog
```

## Credits
[Dom Harrington](https://github.com/domharrington/)

## License
ISC
