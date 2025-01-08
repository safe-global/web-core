# Releasing to Production

The code is being actively developed on the `main` branch. Pull requests are made against this branch.

When we want to make a release, we create a new branch from `main` called `mobile-release/vX.Y.Z` where `X.Y.Z` is the
version number of the release.

This will trigger a new build on the CI/CD pipeline, which will build the app and submit it to the internal distribution
lanes in App Store and Google Play Store.

The release has to be tested by QA and once approved can be promoted to the production lane.

## Triggering Maestro E2E tests

On the release PR add the github label `eas-build-ios:build-and-maestro-test` to trigger the e2e tests in Expo CI.
