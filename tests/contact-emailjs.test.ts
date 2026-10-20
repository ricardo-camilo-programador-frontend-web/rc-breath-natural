import { describe, expect, it } from 'vitest'
import { getEmailjsConfig } from '@/lib/emailjs'

describe('getEmailjsConfig', () => {
  it('returns null when any variable is missing', () => {
    expect(getEmailjsConfig(undefined, 'tpl', 'key')).toBeNull()
    expect(getEmailjsConfig('svc', undefined, 'key')).toBeNull()
    expect(getEmailjsConfig('svc', 'tpl', undefined)).toBeNull()
    expect(getEmailjsConfig()).toBeNull()
  })

  it('returns the config when all variables are set', () => {
    expect(getEmailjsConfig('svc', 'tpl', 'key')).toEqual({
      serviceId: 'svc',
      templateId: 'tpl',
      publicKey: 'key'
    })
  })
})
