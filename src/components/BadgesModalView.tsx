import React, { DragEventHandler, useLayoutEffect, useState } from 'react'
import { DispatchContext } from '../App'

import '../../style/badges.css'

import BadgeView from './BadgeView'

import { Badge } from '../../server/src/badges'
import { EquipBadgeAction } from '../Actions'
import { equipBadge } from '../networking'
import { find, first, isNumber, uniq } from 'lodash'

interface Props {
  unlockedBadges: Badge[]
  equippedBadges: Badge[]
  unlockableBadges?: Badge[]
}

export default function BadgesModalView (props: Props) {
  const [selectedEquippedIndex, setSelectedEquippedIndex] = useState<number|undefined>(undefined)
  const [selectedBadge, setSelectedBadge] = useState<Badge|undefined>(undefined)

  const dispatch = React.useContext(DispatchContext)

  const dragStart = (e) => {
    const index = e.target.closest('[data-index]').dataset.index
    const badge = props.unlockedBadges[index]
    e.dataTransfer.setData('text/plain', JSON.stringify(badge))
    e.dataTransfer.dropEffect = 'copy'

    // By default, the drag preview is the element being dragged
    // In our case, the tooltip messes with the size and it looks weird.
    // This gives us a drag preview element that is *just* the emoji
    const emoji = document.querySelector(`#badges .badge-text-${badge.emoji}`)
    e.dataTransfer.setDragImage(emoji, 0, 0)
  }

  // Without the dragover event being prevented, the drop event won't fire
  const dragOver = (e) => {
    e.preventDefault()
  }

  const drop = (e) => {
    let data: string
    try {
      data = e.dataTransfer.getData('text/plain')
      const badge = JSON.parse(data)
      const index = parseInt(e.currentTarget.dataset.index)
      dispatch(EquipBadgeAction(badge, index))
      equipBadge(badge, index)

      setSelectedBadge(undefined)
      setSelectedEquippedIndex(undefined)
    } catch (err) {
      // I wasn't able to repro the error, but it sounded like for some reason the getData was coming back empty.
      // This will at least help us debug if it pops up again
      console.log(err)
      console.log('tried to parse: ' + data)
    }
  }

  const selectEquippedBadge = (e) => {
    const index = parseInt(e.currentTarget.dataset.index)
    if (selectedEquippedIndex === index) {
      setSelectedEquippedIndex(undefined)
      return
    }

    setSelectedEquippedIndex(index)

    if (isNumber(index) && selectedBadge) {
      dispatch(EquipBadgeAction(selectedBadge, index))
      equipBadge(selectedBadge, index)
      setSelectedBadge(undefined)
      setSelectedEquippedIndex(undefined)
    }
  }

  const rightClickUnequipBadge = (e) => {
    e.preventDefault()
    const index = parseInt(e.currentTarget.dataset.index)
    setSelectedEquippedIndex(undefined)

    if (isNumber(index)) {
      dispatch(EquipBadgeAction(undefined, index))
      equipBadge(undefined, index)
      setSelectedBadge(undefined)
      setSelectedEquippedIndex(undefined)
    }
  }

  const selectUnlockedBadge = (e) => {
    const index = parseInt(e.currentTarget.dataset.index)
    const badge = props.unlockedBadges[index]

    if (selectedBadge === badge) {
      setSelectedBadge(undefined)
      return
    }

    setSelectedBadge(badge)

    if (isNumber(selectedEquippedIndex) && badge) {
      dispatch(EquipBadgeAction(badge, selectedEquippedIndex))
      equipBadge(badge, selectedEquippedIndex)
      setSelectedBadge(undefined)
      setSelectedEquippedIndex(undefined)
    }
  }

  const keyDownOnEquipped = (e) => {
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'Spacebar') {
      selectEquippedBadge(e)
    } else if ((e.key === 'Backspace' || e.key === 'Delete') && isNumber(selectedEquippedIndex)) {
      dispatch(EquipBadgeAction(undefined, selectedEquippedIndex))
      equipBadge(undefined, selectedEquippedIndex)
    }
  }

  const keyDownOnUnlocked = (e) => {
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'Spacebar') {
      selectUnlockedBadge(e)
    }
  }

  // If there's a badge in the right position but not the left, a[0] is undefined
  // Running array.map on an array with undefined values skips the undefineds
  // This means we need a for loop instead of a map.
  const rawEquippedBadges = uniq(props.equippedBadges || [])
  const equippedBadges = []
  for (let i = 0; i < Math.max(rawEquippedBadges.length, 2); i++) {
    const b = rawEquippedBadges[i]

    equippedBadges.push(
      <div
        aria-pressed={i === selectedEquippedIndex}
        className={`selected-badge ${i === selectedEquippedIndex ? 'selected' : ''}`}
        data-index={i}
        key={`selected-${i}`}
        onClick={selectEquippedBadge}
        onContextMenu={rightClickUnequipBadge}
        onDrop={drop}
        onDragOver={dragOver}
        onKeyDown={keyDownOnEquipped}
        role='button'
        tabIndex={0}>
        {rawEquippedBadges[i] && <BadgeView key={`equipped-${i}`} badge={b} />}
      </div>
    )
  }

  // TODO: Can you see description with screen reader?
  // If we have perf issues, we can map-ify unlockedBadges like on the server
  const lockedBadges = uniq(props.unlockableBadges || []).filter(b => {
    return !find(props.unlockedBadges, (c) => c.emoji === b.emoji)
  }).map((b) => {
    return (
      <span
        aria-pressed={selectedBadge === b}
        className='locked-badge' draggable={true}
        key={b.emoji}
      >
        <BadgeView badge={{ ...b, emoji: '🔒' }} />
      </span>
    )
  })

  const unlockedBadges = (props.unlockedBadges || []).map((b, i) => {
    return (
      <span
        aria-pressed={selectedBadge === b}
        className={`unlocked-badge${selectedBadge === b ? ' selected' : ''}`} draggable={true}
        key={b.emoji}
        data-index={i}
        onClick={selectUnlockedBadge}
        onDragStart={dragStart}
        onKeyDown={keyDownOnUnlocked}
        role='button'
        tabIndex={0}
      >
        <BadgeView badge={b} />
      </span>
    )
  })

  // keyboard navigation: move the focus to the first unlocked badge after mount
  useLayoutEffect(() => {
    const firstUnlockedBadge: HTMLElement = document.querySelectorAll('.all span.unlocked-badge')[0] as HTMLElement
    firstUnlockedBadge.contentEditable = 'true' // hack to force the focus ring to be visible
    firstUnlockedBadge.focus()
    firstUnlockedBadge.contentEditable = 'false' // hack to force the focus ring to be visible
  }, [])

  return (
    <div id='badges'>
      <h1>Your Badges</h1>
      <div className="badge-sections">
        <section className="equipped">
          <h2>Equipped</h2>
          {equippedBadges}
          <div>(right-click or highlight & press delete to unequip)</div>
        </section>
        <section className="all">
          <h2>All</h2>
          {lockedBadges}
          {unlockedBadges}
        </section>
      </div>
    </div>
  )
}
