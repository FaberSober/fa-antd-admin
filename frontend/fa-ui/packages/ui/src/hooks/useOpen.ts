import { useState } from "react";

export default function useOpen(openDefault: boolean = false): [
  open: boolean,
  show: () => void,
  hide: () => void,
] {
  const [open, setOpen] = useState<boolean>(openDefault);

  const show = () => {
    setOpen(true)
  }
  const hide = () => {
    setOpen(false)
  }

  return [
    open,
    show,
    hide,
  ]
}
