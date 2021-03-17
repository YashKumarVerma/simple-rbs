export const getSignature = (signature: any, propertyKey: string, args: any): string => {
  const head = `${signature.name}.${propertyKey}`.toLowerCase()
  let tail = '::'

  args.forEach((element: any) => {
    if (typeof element === 'object') {
      tail += Object.keys(element).reduce((r, k) => r.concat(element[k]), [])
    } else {
      tail += `${element}`
    }
  })
  return `${head}${tail}`
}
