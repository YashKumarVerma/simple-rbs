/* eslint-disable func-names */
/* eslint-disable consistent-return */
/**
 * @author Yash Kumar Verma <yk.verma2000@gmail.com>
 * @description Original method to cache the results of a function call in a single line
 * @github : yashkumarverma
 * @todo: publish the method as a npm module
 */
import config from 'config'
import { queryCache } from './query'
import { setCache } from './set'
import { getSignature } from './resolver'
import { logger } from '../logger/winston'

/**
 * @decorator
 * Place before a serive method to agressively cache the results, implemented
 * via redis and decorators
 */
function Cache() {
  /**
   * @description Decorator to cache the function behavior
   * @param target the class instance that is cached, i.e. the service class which
   * contains the methods that need to be cached
   * @param name name of the method on which the decorator is placed. This function is
   * bypassed via cache if the same parameter entry exists in memory
   * @param descriptor Object containing the method itself and method details
   */
  return function (target: any, name: string, descriptor: PropertyDescriptor): any {
    /** get original function  */
    const original = descriptor.value
    const enable: boolean = config.get('cache.enable')

    /** if caching is disabled globally, then end operation right away */
    if (!enable) {
      return
    }

    /** executing the method to get the result */
    descriptor.value = async function (...args: any[]) {
      const functionSignature = getSignature(target, name, args)
      const cacheLookup = await queryCache(functionSignature)
      /** run original method if cache miss and return data */
      if (cacheLookup === null) {
        const result = await original.apply(this, args)

        /** update entry in cache */
        logger.info(`Attempting to set cache for ${functionSignature}`)
        setCache(functionSignature, result)
        return result
      }

      /** else return cache result */
      return JSON.parse(cacheLookup)
    }

    return descriptor
  }
}

export { Cache }
