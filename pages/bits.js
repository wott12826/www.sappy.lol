import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

export default function Bits() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Bits – Sappy Seals</title>
        <meta name="description" content="Track your bits and loyalty multiplier" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold">Sappy</Link>
            <nav className="flex space-x-6">
              <Link href="/seals" className="hover:text-blue-400 transition-colors">seals</Link>
              <Link href="/seals/staking" className="hover:text-blue-400 transition-colors">staking</Link>
              <Link href="/bits" className="hover:text-blue-400 transition-colors">bits</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">license</span>
            <Image
              src="/icon.png"
              alt="Logo"
              width={50}
              height={50}
              className="rounded-full"
              unoptimized
            />
          </div>
        </header>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Stake Seals and participate to earn
            <span className="inline-flex items-center gap-2 bg-blue-500 px-3 py-1 rounded-full ml-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 51 59" className="h-6">
                <path fill="#E6E6E6" d="m25.398 0 25.358 14.64-25.358 14.641L.038 14.641z"></path>
                <path fill="silver" d="m.04 14.64 25.358 14.641v29.281L.04 43.922z"></path>
                <path fill="#9A9A9A" d="m25.398 29.281 25.358-14.64v29.28L25.398 58.563z"></path>
                <path fill="#4D4D4D" d="m25.502 13.644 13.494 7.79L25.5 29.227l-13.494-7.791z"></path>
                <path fill="#262626" d="m12.006 21.435 13.495 7.791v15.582l-13.495-7.791z"></path>
                <path fill="#000" d="m25.502 29.226 13.494-7.791v15.582L25.5 44.808z"></path>
              </svg>
              BITS
            </span>
          </h1>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">TOTAL BITS</h2>
            <div className="flex items-center justify-center gap-4 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 51 59" className="h-16">
                <path fill="#E6E6E6" d="m25.398 0 25.358 14.64-25.358 14.641L.038 14.641z"></path>
                <path fill="silver" d="m.04 14.64 25.358 14.641v29.281L.04 43.922z"></path>
                <path fill="#9A9A9A" d="m25.398 29.281 25.358-14.64v29.28L25.398 58.563z"></path>
                <path fill="#4D4D4D" d="m25.502 13.644 13.494 7.79L25.5 29.227l-13.494-7.791z"></path>
                <path fill="#262626" d="m12.006 21.435 13.495 7.791v15.582l-13.495-7.791z"></path>
                <path fill="#000" d="m25.502 29.226 13.494-7.791v15.582L25.5 44.808z"></path>
              </svg>
              <div className="font-mono text-6xl">00000</div>
            </div>
            <p className="text-center text-gray-400 mb-6">(Score x Loyalty Multiplier)</p>
            
            <Link href="/seals/staking" className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="15" fill="none" viewBox="0 0 13 15" className="h-4">
                <path fill="#E6E6E6" d="m6.4.73 6.352 3.491L6.4 7.714.05 4.22z"></path>
                <path fill="silver" d="M.049 4.222 6.4 7.714v6.985L.049 11.207z"></path>
                <path fill="#9A9A9A" d="m6.4 7.714 6.352-3.492v6.985L6.4 14.699z"></path>
                <path fill="#4D4D4D" d="m6.427 3.984 3.38 1.858-3.38 1.859-3.38-1.859z"></path>
                <path fill="#262626" d="m3.046 5.842 3.38 1.859v3.717l-3.38-1.859z"></path>
                <path fill="#000" d="m6.427 7.7 3.38-1.857V9.56l-3.38 1.858z"></path>
              </svg>
              <span>Stake seals to earn.</span>
            </Link>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center border-t border-gray-600 pt-4">
                <h3 className="text-lg font-bold mb-2">SEALS STAKED</h3>
                <p className="text-3xl font-bold">0</p>
                <p className="text-sm text-gray-400">(Number of seals at the farm)</p>
              </div>
              <div className="text-center border-t border-gray-600 pt-4">
                <h3 className="text-lg font-bold mb-2">BITS SCORE</h3>
                <p className="text-3xl font-bold text-blue-400">TBA</p>
                <p className="text-sm text-gray-400">(Total score weighted by rarity)</p>
              </div>
              <div className="text-center border-t border-gray-600 pt-4">
                <h3 className="text-lg font-bold mb-2">LOYALTY MULTIPLIER</h3>
                <p className="text-3xl font-bold text-blue-400">TBA</p>
                <p className="text-sm text-gray-400">(Increases over time)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Background Text */}
        <div className="fixed -bottom-8 -left-8 text-[15vw] font-black text-gray-800 opacity-20 pointer-events-none">
          <div className="flex">
            <span>B</span>
            <span>I</span>
            <span>T</span>
            <span>S</span>
          </div>
        </div>
      </main>
    </div>
  )
} 