import { AuthenticatedEndpointFunction, LogFn, Message } from '../endpoint'
import { minimizeUser, updateUserProfile, User } from '../user'
import generators from '../generators'
import { v4 as uuid } from 'uuid'

const orderNewDrink: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  let thisDrinkSkeleton: string

  const oldItem = user.item

  const drinkVessels = generators.drinkVessels
  const drinkContents = generators.drinkContents
  const drinkNames = generators.drinkNames
  const drinkSkeletons = generators.drinkSkeletons

  const thisDrinkVessel = drinkVessels.generate()
  const thisDrinkContent = drinkContents.generate()
  const thisDrinkName = drinkNames.generate()
  /* These three variables need to be put into the database to be retrieved when someone orders an existing drink. */
  thisDrinkSkeleton = drinkSkeletons.generate()

  thisDrinkSkeleton = thisDrinkSkeleton.replace('-drinkVessel-', thisDrinkVessel)
  thisDrinkSkeleton = thisDrinkSkeleton.replace('-drinkContent-', thisDrinkContent)
  thisDrinkSkeleton = thisDrinkSkeleton.replace('-drinkName-', thisDrinkName)
  thisDrinkSkeleton = thisDrinkSkeleton.replace('-userName-', user.realName)

  const item = thisDrinkName

  const actionString = (item ? `picks up ${item}.` : `drops ${oldItem}.`)

  const newProfile = await updateUserProfile(user.id, { item })

  const messages: Message[] = [
    {
      userId: user.roomId,
      target: 'privateCommand',
      arguments: [thisDrinkSkeleton]
    },
    {
      userId: user.roomId,
      target: 'emote',
      arguments: [uuid(), user.id, actionString]
    },
    {
      target: 'usernameMap',
      arguments: [{ [user.id]: minimizeUser(newProfile) }]
    }
  ]

  return {
    messages,
    httpResponse: { status: 200 }
  }
}

export default orderNewDrink
