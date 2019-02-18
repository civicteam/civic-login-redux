This project uses [npm audit](https://docs.npmjs.com/cli/audit) to scan dependencies for vulnerabilities
and automatically install any compatible updates to vulnerable dependencies.
The security audit is also integrated into the project's CI pipeline via [audit-ci](https://github.com/IBM/audit-ci) command
which fails the build if there is any vulnerability found.
It is possible to ignore specific errors by whitelisting them in [audit-ci config.](./audit-ci.json).

## NPM audit whitelist
Whenever you whitelist a specific advisory it is required to refer it here and justify the whitelisting.

### Advisories

| #    | Level | Module | Title | Explanation |
|------|-------|---------|------|-------------|
| 577 | Low | lodash | Prototype Pollution| required by babel-preset-env  |
| 782 | Moderate | lodash | Prototype Pollution | required by babel-preset-env - appears to be a duplicate of 577 |
| 786 | Low | braces | "Regular Expression Denial of Service | dependency of babel-cli (latest version) |

