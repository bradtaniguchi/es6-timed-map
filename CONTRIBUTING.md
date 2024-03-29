# Contributing

## Installation

Clone the repository.

```
git clone https://github.com/bradtaniguchi/es6-timed-map.git
cd es6-timed-map
```

Install required Node.js version in your machine as mentioned in .nvmrc

or

If you have nvm installed, run the command

```
nvm use
```

Install the dependencies

```
npm install
```

## Summary

Contributing to this library can be done using any environment of your choice. Currently development is focused on using node.js, further details are on the way.
Anyone can currently do the following:

- open issues for features or bugs
- open pull request(s) for existing issues
- update documentation for this project

Direct contributions to the code **require opening an issue first to discuss the feature**, since the project is still a work in progress.

## Linting the code

To lint the code use the command:

```bash
npm run lint
```

## Running tests

To run tests just use the command:

```bash
npm run test
```

to keep tests in "watch" mode pass the flag `watch`:

```bash
npm run test -- --watch
```

## Building code

To build the code use the command:

```bash
npm run build
```

## Testing against local sandbox

After building the library, to test it run `npm link es6-timed-map` ([see](https://docs.npmjs.com/cli/v7/commands/npm-link)).

## Building docs

Docs are managed by [typedoc](https://typedoc.org/) and can be built using the following:

```bash
npm run build:docs
```

Then they can be viewed via http-server with:

```bash
npm run serve:docs
```

### nodejs

Currently, to manually check go into the `sandbox/nodejs` folder and run the `sandbox.js` file by running `npm start`. it should print out the following output:

```
first-value
second-value
```

Other tests will be added, and these instructions may change and be updated.

## Release steps

The following steps are primarily taken by maintainers, and are provided more as memory refreshers than
steps available to all contributors.

1. Create a version via `npm version <major|minor|patch>`
2. Push to the repo, including tags `git push origin master/main --tags`
3. Create a release via github see [docs](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
4. This should trigger the `on-release` workflow that will release the code to npm. (and github if we ever figure that out)

## External Resources

If your new to open source, or would like to contribute to this project and aren't sure how, here are some external resources and guides to help:

- https://www.digitalocean.com/community/tutorials/hacktoberfest-contributor-s-guide-how-to-find-and-contribute-to-open-source-projects
- http://opensource.guide/how-to-contribute/
- https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/github-flow

## Have Questions?

Feel free to open an issue asking for help/support [here](https://github.com/bradtaniguchi/es6-timed-map)
