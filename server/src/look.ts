import { Result } from './endpoint'
import DB from './redis'

export async function look (target: string): Promise<Result> {
  const profile = await DB.getPublicUser(target)

  return {
    httpResponse: {
      status: 200,
      body: { user: profile }
    }
  }
}
