import { describe, expect, it } from 'vitest'
import { scanText } from './privacy-check.mjs'

const scan = (text, file = 'a.md', extraTerms = []) => scanText({ file, text, extraTerms })

describe('privacy check', () => {
  it('passes clean text and GitHub no-reply addresses', () => {
    expect(scan('Hello\nname <1+x@users.noreply.github.com>')).toEqual([])
  })
  it('flags other email addresses with file:line', () => {
    expect(scan('ok\nwrite to a.b@gmail.com')).toEqual([expect.stringMatching(/^a\.md:2: email/)])
  })
  it('flags real home paths but not placeholders', () => {
    expect(scan('/Users/jane/Documents')).toHaveLength(1)
    expect(scan('C:\\Users\\jane\\x')).toHaveLength(1)
    expect(scan('C:/Users/x/Wards')).toEqual([])
  })
  it('flags .local hostnames but not settings.local.json', () => {
    expect(scan('ssh janes-macbook.local')).toHaveLength(1)
    expect(scan('.claude/settings.local.json')).toEqual([])
  })
  it('flags banned names case-insensitively, except on allowlisted files', () => {
    expect(scan('see amboss and OPENEVIDENCE and white book')).toHaveLength(3)
    expect(scan('Never name AMBOSS', 'CLAUDE.md')).toEqual([])
  })
  it('flags private terms from the optional local file', () => {
    expect(scan('Dr Smith', 'a.md', ['smith'])).toHaveLength(1)
  })
})
