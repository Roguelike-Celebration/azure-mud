import { Result } from './endpoint'
import DB from './cosmosdb'

export async function look (target: string): Promise<Result> {
  const profile = await DB.getPublicUser(target)

  return {
    httpResponse: {
      status: 200,
      body: { user: profile }
    }
  }
}
