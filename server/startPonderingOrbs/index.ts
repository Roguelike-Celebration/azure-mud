import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest, connection): Promise<void> {
    if (req.headers.userId !== "orbWizard") {
        context.res = {
            status: 401,
            body: "Unauthorized"
        }
        return;
    }

    // This never gets undone, but the fact this group always exists is ~fine~
    context.bindings.actions.push({
        actionName: "addUserToGroup",
        userId: req.headers.userId,
        group: "orbMessages"
      })

    context.res = { body: connection }
    context.done()    
};

export default httpTrigger;