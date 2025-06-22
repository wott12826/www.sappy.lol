import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="mb-12 flex h-[10vh] w-full px-[5vw] lg:mb-4">
      {/* Desktop Navigation */}
      <div className="hidden grow flex-row items-center justify-between font-semibold lg:flex">
        <div className="flex flex-row items-center gap-[5vw]">
          <Link href="/">
            <Image
              src="/icon.png"
              alt="Logo"
              width={824}
              height={609}
              className="aspect-[824/609] w-min object-contain h-[8vh]"
              unoptimized
            />
          </Link>
          <nav className="flex grow flex-row gap-[4vw] font-semibold uppercase lg:text-[1.5vw]/[1.5vw] FHD:text-[1vw]/[1vw]">
            <div className="relative flex items-center gap-[4vw]">
              <Link href="/seals" className="hover:text-blue-400 transition-colors">
                seals
              </Link>
              <Link href="/seals/staking" className="hover:text-blue-400 transition-colors">
                staking
              </Link>
              <Link href="/bits" className="hover:text-blue-400 transition-colors">
                bits
              </Link>
            </div>
            <span className="cursor-not-allowed opacity-40">license</span>
          </nav>
        </div>
        <div className="flex flex-row items-center gap-[1vw]">
          {/* Wallet button placeholder */}
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors">
            Connect Wallet
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="flex grow flex-row items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 1024 1024"
            className="text-[5vh] lg:text-[2vw] FHD:text-[1.5vw]"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"></path>
          </svg>
        </button>
        <Link href="/">
          <Image
            src="/icon.png"
            alt="Logo"
            width={824}
            height={609}
            className="aspect-[824/609] w-min object-contain h-[10vh]"
            unoptimized
          />
        </Link>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-[70%] bg-white/10 backdrop-blur-sm p-[5vw]">
            <div className="flex h-[10vh] flex-row items-center justify-between">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="lg:hidden"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 1024 1024"
                  className="text-[5vh] lg:text-[2vw] FHD:text-[1.5vw]"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </button>
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                <Image
                  src="/icon.png"
                  alt="Logo"
                  width={824}
                  height={609}
                  className="aspect-[824/609] w-min object-contain h-[8.5vh]"
                  unoptimized
                />
              </Link>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors">
                Connect
              </button>
            </div>
            <nav className="flex grow flex-col gap-[2vh] pt-[10vh] text-[7vw] font-semibold uppercase">
              <Link href="/seals" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-400 transition-colors">
                seals
              </Link>
              <Link href="/seals/staking" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-400 transition-colors">
                staking
              </Link>
              <Link href="/bits" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-400 transition-colors">
                bits
              </Link>
              <span className="cursor-not-allowed opacity-40">license</span>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
} 