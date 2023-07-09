"use client";

import * as React from "react";

import {
  useStoreModalActions,
  useStoreModalIsOpen,
} from "@/components/store/store-modal";

export default function SetupPage() {
  const isOpen = useStoreModalIsOpen();
  const { open } = useStoreModalActions();

  // TODO: should be temporary to persist modal state for dev purposes.
  React.useEffect(() => {
    if (!isOpen) {
      open();
    }
  }, [isOpen, open]);

  return <section className="p-5"></section>;
}
