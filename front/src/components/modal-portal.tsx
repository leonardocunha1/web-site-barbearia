"use client";

import ReactDOM from "react-dom";
import { ModalOverlayOptionsForm, useOverlay } from "@/hooks/useOverlay";
import { Modal } from "./overlay/modal";
import { Drawer } from "./overlay/drawer";
import { OverlayForm } from "./overlay/overlayform";
import { Popover } from "./ui/popover";
import { DynamicFormProps } from "./form/types";
import { ZodTypeAny } from "zod";

export function ModalPortal() {
  const { content, closeModal, isOpen, type, options } = useOverlay();
  const formContent = content as DynamicFormProps<ZodTypeAny>;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;
  if (!isOpen) return null;

  const commonProps = {
    isOpen,
    onClose: () => {
      closeModal();
      options?.onAfterClose?.();
    },
    title: options?.title,
    footer: options?.footer,
    removeCloseButton: options?.removeCloseButton,
    className: options?.className,
    classNames: options?.classNames,
  };

  const renderForm = () => (
    <OverlayForm
      {...formContent}
      onClose={commonProps.onClose}
      title={commonProps.title}
      footer={commonProps.footer}
      removeCloseButton={commonProps.removeCloseButton}
    />
  );

  if (type === "form") {
    const formOptions = options as ModalOverlayOptionsForm | undefined;

    if (formOptions?.renderAs === "drawer") {
      return ReactDOM.createPortal(
        <Drawer {...commonProps}>{renderForm()}</Drawer>,
        modalRoot,
      );
    }

    return ReactDOM.createPortal(
      <Modal {...commonProps}>{renderForm()}</Modal>,
      modalRoot,
    );
  }

  if (type === "modal") {
    return ReactDOM.createPortal(
      <Modal {...commonProps}>{content as React.ReactNode}</Modal>,
      modalRoot,
    );
  }

  if (type === "drawer") {
    return ReactDOM.createPortal(
      <Drawer {...commonProps}>{content as React.ReactNode}</Drawer>,
      modalRoot,
    );
  }

  if (type === "popover") {
    return ReactDOM.createPortal(
      <Popover {...commonProps}>{content as React.ReactNode}</Popover>,
      modalRoot,
    );
  }

  return null;
}
