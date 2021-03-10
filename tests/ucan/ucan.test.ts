import { loadWebnativePage } from '../helpers/page'


describe('UCAN', () => {
  beforeEach(async () => {
    await loadWebnativePage()
  })

  it('can build a UCAN', async () => {
    const isValid = await page.evaluate(async () => {
      const ucan = await webnative.ucan.build({
        audience: await randomRsaDid(),
        issuer: await webnative.did.ucan()
      })

      return webnative.ucan.isValid(ucan)
    })

    expect(isValid).toBe(true)
  })

  it('can validate a UCAN with a valid proof', async () => {
    const isValid = await page.evaluate(async () => {
      const storeA = webnative.keystore.create()
      const storeB = webnative.keystore.create()
  
      await webnative.keystore.set(storeB)
      const issB = await webnative.did.ucan()
  
      // Proof
      await webnative.keystore.set(storeA)
      const issA = await webnative.did.ucan()
      const prf = await webnative.ucan.build({
        audience: issB,
        issuer: issA
      })
  
      // Shell
      await webnative.keystore.set(storeB)
      const ucan = await webnative.ucan.build({
        audience: await randomRsaDid(),
        issuer: issB,
        proofs: [ prf ]
      })
  
      // Validate
      return webnative.ucan.isValid(ucan)
    })

    expect(isValid).toBe(true)
  })

  it('can validate a UCAN with a sessionKey fact', async() => {
    const isValid = await page.evaluate(async () => {
      const sessionKey = 'RANDOM KEY'
      const ucan = await webnative.ucan.build({
        issuer: await webnative.did.ucan(),
        audience: await randomRsaDid(),
        lifetimeInSeconds: 60 * 5, // 5 minutes
        facts: [{ sessionKey }]
      })

      return webnative.ucan.isValid(ucan)
    })

    expect(isValid).toBe(true)
  })
});
