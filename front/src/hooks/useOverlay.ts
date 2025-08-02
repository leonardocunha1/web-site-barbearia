import { DynamicFormProps } from '@/components/form/types'
import { ClassValue } from 'class-variance-authority/types'
import React from 'react'
import { ZodTypeAny } from 'zod'
import { create } from 'zustand'

export type OverlayTypes = 'modal' | 'popover' | 'confirm' | 'drawer' | 'form'

type ModalOverlayOptionsBase = {
  title?: React.ReactNode
  footer?: React.ReactNode
  size?: 'full' | 'semi-full' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'
  side?: 'right' | 'left'
  classNames?: {
    content?: string
    modal?: string
    header?: string
  }
  useMobileViewer?: boolean
  onAfterClose?: () => void
  event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  typeFormModal?: boolean
  className?: ClassValue
  drawerType?: 'normal' | 'special'
  removeCloseButton?: boolean
}

export type ModalOverlayOptionsForm = ModalOverlayOptionsBase & {
  type: 'form'
  renderAs?: 'modal' | 'drawer'
}

type ModalOverlayOptionsOther<T extends OverlayTypes> = ModalOverlayOptionsBase & {
  type: Exclude<T, 'form'>
}

export type ModalOverlayOptions<T extends OverlayTypes> = T extends 'form'
  ? ModalOverlayOptionsForm
  : ModalOverlayOptionsOther<T>

type ContentType<T extends OverlayTypes> = T extends 'form'
  ? DynamicFormProps<ZodTypeAny>
  : React.ReactNode | null

export interface ModalStore<T extends OverlayTypes> {
  isOpen: boolean
  options?: ModalOverlayOptions<T>
  type: T
  open: (content: ContentType<T>, options?: ModalOverlayOptions<T>) => void
  closeModal: () => void

  content: ContentType<T>
}

export const useOverlay = create<ModalStore<OverlayTypes>>((set, get) => ({
  isOpen: false,
  content: null,
  type: 'drawer',
  options: undefined,
  open: (content, options) => {
    if (get().isOpen === true) {
      get().closeModal()
      setTimeout(() => {
        set({
          isOpen: true,
          content,
          options,
          type: options?.type ?? 'drawer',
        })
      }, 200)
      return
    }
    set({
      isOpen: true,
      content,
      options,
      type: options?.type ?? 'drawer',
    })
  },
  closeModal: () =>
    set({
      isOpen: false,
      content: null,
      options: undefined,
      type: 'drawer',
    }),
}))
