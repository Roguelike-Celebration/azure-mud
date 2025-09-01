# ARM Template Notes

Some scrambled notes on deployment, for future-Emilia or anyone else who touches our devops. (I'm sorry!)

## ASWA and Azure Functions

I tried to unify our ASWA and Functions set up.

- We can't use the built-in magical functions because they only support HTTP triggers (and we need SignalR triggers, timer triggers, and likely soon PubSub triggeres)
- The "byo functions" option where you link a function app would work, but requires all dev accounts to use a paid plan, which is annoying
- For now, we just manually add CORS entries based on the completed URL of the ASWA. This means getting the dependency chain right

## GitHub Environments

I'm deeply unhappy with how we handle deploy environments. The main repo has a separate set of variables for e.g. `STAGING_[some secret name]`. The actual underlying problem is the confusion whereby any forks from volunteer devs are stuck in the same boat of "manual prod deploys, automatic staging deploys", which they probably don't want, and they can't change without making upstream PRs annoying.

We could refactor this to use GitHub environments. I don't think it saves us anything other than moving around some variable names, as it then un-DRYs my shared logic for prod vs staging deploys.

## apj notes 2025-05

Notes from Andrew Janke from working on the template in 2025.

### Resource Groups

You may be limited to a single instance per resource group, or (resource group, app name) combination. The ARM template uses a hash of the resource group id for constructing resource names. If you do multiple deployments to the same resource group and app name, it'll end up with the same name for some resource groups, and will update existing resources instead of creating new ones. This isn't necessarily a bug; it's just something to be aware of. It allows for idempotently updating existing resources, and is just how ARM templates work.

### Region vs. Resource Group

The web page interface for doing a deployment shows a Region dropdown, even if you haven't specified a `region` parameter. Our ARM template ignores this Region dropdown, and uses the region from the resource group instead. This matters! Because the Static Web Apps service is only supported in a couple regions, like East US 2 and West US 2, not regular East US or West US. So you must use an RG in that region, and the template interface won't tell you if your RG is in the wrong region, or that the Region dropdown is being ignored. Getting this wrong will give you a validation failure.

### SignalR apiVersion

The SignalR resource definition uses an `apiVersion` of `2020-07-01-preview`. It's a bit odd to still use a preview version of something after the GA has been released. But there may be a reason for this. This item is set to use a Free tier SKU, and also defines network ACLs in its properties. The Free tier of SignalR doesn't seem to support network ACLs. If I update the apiVersion to e.g. `2024-03-01`, then my deployment fails validation, complaining that "free tier does not support network ACLs". Using the `2020-07-01-preview` apiVersion may be a way around that; looks to me like it's just ignoring the network ACL specification.
