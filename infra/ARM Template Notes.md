# ARM Template Notes

Some scrambled notes on deployment, for future-Emilia or anyone else who touches our devops. (I'm sorry!)

## ASWA and Azure Functions

I tried to unify our ASWA and Functions set up.

- We can't use the built-in magical functions because they only support HTTP triggers (and we need SignalR triggers, timer triggers, and likely soon PubSub triggers).
- The "byo functions" option where you link a function app would work, but requires all dev accounts to use a paid plan, which is annoying.
- For now, we just manually add CORS entries based on the completed URL of the ASWA. This means getting the dependency chain right.

## GitHub Environments

I'm deeply unhappy with how we handle deploy environments. The main repo has a separate set of variables for e.g. `STAGING_[some secret name]`. The actual underlying problem is the confusion whereby any forks from volunteer devs are stuck in the same boat of "manual prod deploys, automatic staging deploys", which they probably don't want, and they can't change without making upstream PRs annoying.

We could refactor this to use GitHub environments. I don't think it saves us anything other than moving around some variable names, as it then un-DRYs my shared logic for prod vs staging deploys.

## apj notes 2025-05

Notes from Andrew Janke from working on the template in 2025.

### Multiple Azure Tenants

If your Azure user belongs to multiple Azure tenants (directories), the tenant you deploy to is whichever one you currently have selected in the Azure Portal in your browser! It's controlled by the "Switch directory" link under your user menu in the upper right.

It may not be obvious which tenant you're working in. Pay attention to the Subscription field when you're doing the deployment.

### Deploying from a Branch

You can deploy resources using the ARM template from a branch or alternate repo, like if you're working on changes to the ARM template and they haven't been merged to main yet. To do this, you need to construct the Azure deployment URL, using the URL to your alternate ARM template location in the encoded parameter part of the URL. The URL behind the "Deploy to Azure" button in the `README` etc. are pointing to the ARM template on `main` in the main `Roguelike-Celebration/azure-mud` repo; you need to change it to your repo and branch. Then open that URL in a browser.

The regular URL for `main` is like this.

```
https://portal.azure.com#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FRoguelike-Celebration%2Fazure-mud%2Fmain%2Finfra%2Ftemplate.json
```

After `raw.githubusercontent.com`, the parts are:

* `Roguelike-Celebration` = GitHub user or org name that's the repo owner
* `azure-mud` = repo name
* `main` = branch name
  * If using a branch besides `main`, it needs to be specified as `refs/heads/<branch>`.
  * Slashes need to be URL-escaped as `%2F`.

Substitute those as appropriate. For example, to deploy from Andrew's `apjanke/rlc-azure-mud` repo, on the `apj/ARM-deployment-stuff` branch, you'd get:

```
https://portal.azure.com#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fapjanke%2Frlc-azure-mud%2Frefs%2Fheads%2Fapj%2FARM-deployment-stuff%2Finfra%2Ftemplate.json
```

You can also grab the alternate ARM template URL directly from the GitHub website. Go to the GitHub website, find the ARM template file in your branch, click the "Raw" view button, and grab the URL of the page you're now looking at. (It should start with `https://raw.githubusercontent.com`.) Then URL-escape it, and use the resulting string as what goes after the `Template/uri/` in that `portal.azure.com` URL.

This has to be a something that has been pushed to GitHub. Azure can't see your local repo clone.

### Resource Groups

You may be limited to a single instance per resource group, or (resource group, app name) combination. The ARM template uses a hash of the resource group id for constructing resource names. If you do multiple deployments to the same resource group and app name, it'll end up with the same name for some resource groups, and will update existing resources instead of creating new ones. This isn't necessarily a bug; it's just something to be aware of. It allows for idempotently updating existing resources, and is just how ARM templates work.

### Region vs. Resource Group

The web page interface for doing a deployment shows a Region dropdown, even if you haven't specified a `region` parameter. Our ARM template _ignores_ this Region dropdown, and uses the region from the resource group instead. This matters! Because the Static Web Apps service is only supported in a couple regions, like East US 2 and West US 2, not regular East US or West US. So you must use an RG in that region, and the template interface won't tell you if your RG is in the wrong region, or that the Region dropdown is being ignored. Getting this wrong will give you a validation failure.

If you create a new RG as part of the template deployment, then I think (but am not sure) that that new RG is created in the region specified by the template's Region dropdown. In which case things will work if you have the right region selected. But I'm not sure.

### SignalR apiVersion

The SignalR resource definition uses an `apiVersion` of `2020-07-01-preview`. It's a bit odd to still use a preview version of something after the GA has been released. But there may be a reason for this. This item is set to use a Free tier SKU, and also defines network ACLs in its properties. The Free tier of SignalR doesn't seem to support network ACLs. If I update the apiVersion to e.g. `2024-03-01`, then my deployment fails validation, complaining that "free tier does not support network ACLs". Using the `2020-07-01-preview` apiVersion may be a way around that; looks to me like it's just ignoring the network ACL specification.

### Naming and suffixes

The resource names in this current version of the ARM template mostly use resource name suffixes based on Azure's Cloud Adoption Framework's [Abbreviation recommendations for Azure resources](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations). A couple of the suffixes in older versions of this template differed, using "-ai" instead of "-appi" for Application Insights, and "-pubsub" instead of "-wps" for WebPubSub. Given the broad use of "AI" to mean "artificial intelligence", and our related use of Cognitive Services, the previous "-ai" suffix seemed confusing to me. The current names use "-aswa" instead of Azure's recommended "-stapp" for Static Web Apps, because that abbreviation is pretty widespread in our documentation, and "stapp" just sounds weird to me.
