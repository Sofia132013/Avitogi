import { BrandMark } from "./brand-mark"

export function Header() {
  return (
    <header className='mx-auto flex max-w-7xl items-center justify-between px-5 py-7 md:px-8'>
      <BrandMark className='z-10' />
    </header>
  )
}
