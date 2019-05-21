import template from 'lodash.template'
import { getStyle } from '@pacote/get-style'
import { pixels } from '@pacote/pixels'
import { bindContentScrollHandler } from './events'
import {
  getAvailableRoom,
  getAvailableHeight,
  repositionPopover,
  repositionTooltip,
  CLASS_CONTENT,
  CLASS_WRAPPER
} from './layout'
import { Footnote } from '../types'
import { RawFootnote } from '.'

const CLASS_ACTIVE = 'is-active'
const CLASS_CHANGING = 'is-changing'
const CLASS_SCROLLABLE = 'is-scrollable'

function findPopoverContent(popover: HTMLElement): HTMLElement {
  return popover.querySelector<HTMLElement>('.' + CLASS_CONTENT)!
}

export function createFootnote(footnote: RawFootnote): Footnote {
  return {
    getId: () => footnote.id,

    activate: onActivate => {
      footnote.button.blur()
      footnote.button.setAttribute('aria-expanded', 'true')
      footnote.button.classList.add(CLASS_ACTIVE)

      footnote.button.insertAdjacentHTML('afterend', footnote.content)
      footnote.popover = footnote.button.nextElementSibling as HTMLElement // mutation

      footnote.popover.dataset.footnotePopover = ''
      footnote.popover.dataset.footnoteId = footnote.id

      const content = findPopoverContent(footnote.popover)
      footnote.popover.style.maxWidth = `${document.body.clientWidth}px`
      bindContentScrollHandler(content)

      const maxHeight = getStyle(content, 'maxHeight')
      footnote.maxHeight = Math.round(pixels(maxHeight, content)) // mutation

      if (typeof onActivate === 'function') {
        onActivate(footnote.popover, footnote.button)
      }
    },

    dismiss: () => {
      footnote.button.blur()
      footnote.button.setAttribute('aria-expanded', 'false')
      footnote.button.classList.remove(CLASS_ACTIVE)
    },

    isActive: () => footnote.button.classList.contains(CLASS_ACTIVE),

    isChanging: () => footnote.button.classList.contains(CLASS_CHANGING),

    isHovered: () => footnote.isHovered,

    ready: () => {
      if (footnote.popover) {
        footnote.popover.classList.add(CLASS_ACTIVE)
      }
    },

    remove: () => {
      if (footnote.popover) {
        footnote.popover.parentNode!.removeChild(footnote.popover)
        delete footnote.popover // mutation
      }
    },

    reposition: () => {
      if (footnote.popover) {
        const room = getAvailableRoom(footnote.button)
        const content = findPopoverContent(footnote.popover)
        const maxHeight = Math.min(
          footnote.maxHeight,
          getAvailableHeight(footnote.popover, room)
        )
        content.style.maxHeight = maxHeight + 'px'
        repositionPopover(footnote.popover, room)

        if (footnote.popover.offsetHeight <= content.scrollHeight) {
          footnote.popover.classList.add(CLASS_SCROLLABLE)
        }
      }
    },

    resize: () => {
      if (footnote.popover) {
        const room = getAvailableRoom(footnote.button)
        const content = findPopoverContent(footnote.popover)
        const maxWidth = content.offsetWidth
        const buttonMarginLeft = parseInt(
          getStyle(footnote.button, 'marginLeft'),
          10
        )
        const left =
          -room.leftRelative * maxWidth +
          buttonMarginLeft +
          footnote.button.offsetWidth / 2
        const wrapper = footnote.popover.querySelector<HTMLElement>(
          '.' + CLASS_WRAPPER
        )

        footnote.popover.style.left = left + 'px'

        if (wrapper) {
          wrapper.style.maxWidth = maxWidth + 'px'
        }

        repositionTooltip(footnote.popover, room.leftRelative)
      }
    },

    startChanging: () => {
      footnote.button.classList.add(CLASS_CHANGING)
    },

    stopChanging: () => {
      footnote.button.classList.remove(CLASS_CHANGING)
    },

    startHovering: () => {
      footnote.isHovered = true
    },

    stopHovering: () => {
      footnote.isHovered = false
    },

    unmount: () => {
      footnote.host.parentNode!.removeChild(footnote.host)
    }
  }
}
