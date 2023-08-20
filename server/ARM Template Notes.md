Some scrambled notes on deployment, for future-Emilia or anyone else who touches our devops (I'm sorry!)

## ASWA and Azure Functions
I tried to unify our ASWA and Functions set up.
- We can't use the built-in magical functions because they only support HTTP triggers (and we need SignalR triggers, timer triggers, and likely soon PubSub triggeres)
- The "byo functions" option where you link a function app would work, but requires all dev accounts to use a paid plan, which is annoying
- For now, we just manually add CORS entries based on the completed URL of the ASWA. This means getting the dependency chain right

## GitHub Environments
I'm deeply unhappy with how we handle deploy environments. The main repo has a separate set of variables for e.g. `STAGING_[some secret name]`. The actual underlying problem is the confusion whereby any forks from volunteer devs are stuck in the same boat of "manual prod deploys, automatic staging deploys", which they probably don't want, and they can't change without making upstream PRs annoying.

We could refactor this to use GitHub environments. I don't think it saves us anything other than moving around some variable names, as it then un-DRYs my shared logic for prod vs staging deploys.