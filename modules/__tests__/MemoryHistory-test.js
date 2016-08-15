import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import MemoryHistory from '../MemoryHistory'
import * as RenderTestSequences from './RenderTestSequences'

describe('MemoryHistory', () => {
  let node
  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  describe('push', () => {
    it('emits a new location', (done) => {
      const children = RenderTestSequences.PushEmitsANewLocation(done)
      render(<MemoryHistory children={children}/>, node)
    })

    describe('with state', () => {
      it('uses a key', (done) => {
        const children = RenderTestSequences.PushWithStateUsesAKey(done)
        render(<MemoryHistory children={children}/>, node)
      })
    })
  })

  describe('replace', () => {
    it('emits a new location', (done) => {
      const children = RenderTestSequences.ReplaceEmitsANewLocation(done)
      render(<MemoryHistory children={children}/>, node)
    })

    it('changes the key', (done) => {
      const children = RenderTestSequences.ReplaceChangesTheKey(done)
      render(<MemoryHistory children={children}/>, node)
    })
  })

  describe('pop', () => {
    it('emits a new location', (done) => {
      const children = RenderTestSequences.PopEmitsANewLocation(done)
      render(<MemoryHistory children={children}/>, node)
    })
  })

  describe('block', () => {
    it('blocks a push', (done) => {
      const children = RenderTestSequences.BlocksAPush(done)
      render(<MemoryHistory children={children}/>, node)
    })

    it('blocks the back button (or go(-1))', (done) => {
      const children = RenderTestSequences.BlocksTheBackButton(done)
      render(<MemoryHistory children={children}/>, node)
    })

    it('blocks the forward button (or go(1))', (done) => {
      const children = RenderTestSequences.BlocksTheForwardButton(done)
      render(<MemoryHistory children={children}/>, node)
    })
  })
})