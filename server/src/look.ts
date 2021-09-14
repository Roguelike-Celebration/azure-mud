import { Result } from './endpoint'
import { DB } from './database'

export async function look (target: string): Promise<Result> {
  const profile = await DB.getUser(target)

  return {
    httpResponse: {
      status: 200,
      body: { user: profile }
    }
  }
}
