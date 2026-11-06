import { DB } from './database'
import { Result } from './endpoint'

export async function look (target: string): Promise<Result> {
  const profile = await DB.getUser(target)

  return {
    httpResponse: {
      status: 200,
      body: { user: profile }
    }
  }
}
