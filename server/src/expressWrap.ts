import Express from 'express'

import {
  EndpointFunction,
  Result,
} from './endpoint'
import { EndpointOptions } from './routeMetadata'

export async function expressWrap(
  req: Express.Request,
  res: Express.Response,
  fn: EndpointFunction,
  options: EndpointOptions 
) {
  const log = console.log // Can move this to the caller if needed

  if (options.authenticated) {
    // authenticate, mod
  }

  const result = await fn(req.body, log)
  output(res, result)
}

function output(res: Express.Response, result: Result) {
  console.log('outputting to express')
  // console.log('context: ', JSON.stringify(context))
  console.log('result: ', JSON.stringify(result))
  if (result.messages) {
    // handle WS messages
  }

  if (result.groupManagementTasks) {
    // handle group management tasks
  }

  // TimerTriggers don't have a res obj. This seems like an okay, if imperfect, guard.
  res.status((result.httpResponse && result.httpResponse.status) || 200)
  res.send(result.httpResponse.body)
}