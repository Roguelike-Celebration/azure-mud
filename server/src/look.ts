import { DB } from './database.js'
import { Result } from './endpoint.js'

export async function look (target: string): Promise<Result> {
  const profile = await DB.getUser(target)

  return {
    httpResponse: {
      status: 200,
      body: { user: profile }
    }
  }
}
