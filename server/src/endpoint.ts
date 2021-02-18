import { User } from './user'

/**
 * Instead of being tied to a single server implementation (e.g. Azure Functions + Azure SignalR Service),
 * each server endpoint function confirms to an interface of inputs/outputs.
 *
 * The million types in this file are definining that shared interface.
 * (Right now, it pretty closely maps to what Azure SignalR Service expects)
 */

export interface GroupManagementTask {
    action: 'add' | 'remove' | 'removeAll',
    userId: string,
    groupId: string
}

interface HttpResponse {
    status: number
    body?: any
}

// TODO: Right now, this interface is identical to Azure SignalR Service
// It may be valuable to eventually refactor this.
interface PrivateMessage {
    userId: string
    target: string
    arguments: any[]
}

interface GroupMessage {
    groupId: string
    target: string
    arguments: any[]
}

interface GlobalMessage {
    target: string,
    arguments: any[]
}

export type LogFn = (...string) => void
export type EndpointFunction = (inputs: any, log: LogFn) => Promise<Result>
export type AuthenticatedEndpointFunction = (user: User, inputs: any, log: LogFn) => Promise<Result>

export type Message = PrivateMessage | GroupMessage | GlobalMessage

export function isPrivateMessage (m: Message): m is PrivateMessage {
  return (m as PrivateMessage).userId !== undefined
}

export function isGroupMessage (m: Message): m is GroupMessage {
  return (m as GroupMessage).groupId !== undefined
}

export interface Result {
    messages?: Message[]
    groupManagementTasks?: GroupManagementTask[],
    httpResponse?: HttpResponse
}
