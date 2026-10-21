import { describe, expect, it } from 'vitest'
import { getEmailjsConfig } from '@/lib/emailjs'

describe('getEmailjsConfig', () => {
  it('returns null when any variable is missing', () => {
    expect(getEmailjsConfig('', 'tpl', 'key')).toBeNull()
    expect(getEmailjsConfig('svc', '', 'key')).toBeNull()
    expect(getEmailjsConfig('svc', 'tpl', '')).toBeNull()
  })

  it('returns the config when all variables are set', () => {
    expect(getEmailjsConfig('svc', 'tpl', 'key')).toEqual({
      serviceId: 'svc',
      templateId: 'tpl',
      publicKey: 'key'
    })
  })
})
