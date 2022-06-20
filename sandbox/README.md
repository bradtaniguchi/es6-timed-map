# Sandbox environments

This folder holds "sandbox" environments to manually (and later automatically) test this library in different environments.

## Usage

To use these to test out changes with the library, first in the root folder run:

```
npm link
```

this will create a global link for this package. Then in the nested sandbox folders run:

```bash
npm link es6-timed-map
```

this will link the package with the globally linked version, so any update made to the overall package
will be reflected within the sandbox. (before sure to run `npm run build`)
