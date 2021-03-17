import config from 'config'
import { sign } from 'jsonwebtoken'
import { client } from '../database/redis'
import { logger } from '../logger/winston'
import { getSignature } from './resolver'

function Cache(...args: any) {
  const enabled: boolean = config.get('cache.enable')

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const original = descriptor.value

      if(typeof original === 'function'){
        const paramNames = 
      }
    const signature = getSignature(target, propertyKey, args)
    console.log('propertyKey', propertyKey)
  }
}

export { Cache }
