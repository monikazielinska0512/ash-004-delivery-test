# ASH-004 synthetic delivery fixture

Private disposable static fixture. No platform source, customer data or credentials belong here.

Run offline verifier regressions with `node --test scripts/verify.test.mjs`. They make no network requests.

GitHub Actions is disabled while the included private Actions quota is exhausted. The manual author/check workflows are prepared source only; provider checks and review permissions still require separate live verification.

CircleCI runs the same offline tests on a small Docker executor using Node 22.14.0. No dependency installation, deployment, external API credential or GitHub write token is needed. These regressions mock provider responses; a green CI result does not prove protected merge enforcement.
