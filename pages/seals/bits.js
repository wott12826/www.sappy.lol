import Head from 'next/head'
import Link from 'next/link'

const StakingHeader = () => (
    <header className="sticky top-0 z-50 bg-[#0e0e0e]/80 backdrop-blur-md">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex justify-between items-center h-20">
                <div className="flex-shrink-0">
                    <Link href="/seals" className="text-2xl font-bold uppercase tracking-wide text-white">
                        Sappy Seals
                    </Link>
                </div>
                <nav className="hidden lg:flex items-center space-x-10 text-lg text-gray-300">
                    <Link href="/seals/staking" className="hover:text-white">STAKING</Link>
                    <Link href="/seals/bits" className="text-white underline">BITS</Link>
                    <Link href="/seals/the-archives" className="hover:text-white">THE ARCHIVES</Link>
                    <Link href="#" className="hover:text-white">LICENSE</Link>
                </nav>
                <div className="flex items-center space-x-4">
                    <button className="text-white text-2xl">☀️</button>
                    <button className="bg-white text-black font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-200 transition-colors">
                        CONNECT
                    </button>
                </div>
            </div>
        </div>
    </header>
);

export default function Bits() {
  return (
    <>
      <Head>
        <title>Bits - Sappy Seals</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-[#0e0e0e] text-white font-inter flex flex-col">
        <StakingHeader />

        <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">
                    Stake Seals and participate to earn{' '}
                    <span className="text-blue-400">BITS</span>
                </h1>

                <div className="max-w-md mx-auto bg-gray-900/50 border border-gray-700 rounded-2xl p-8 mt-8">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            Cube Icon
                        </div>
                        <p className="text-sm text-gray-400">TOTAL BITS</p>
                        <p className="text-5xl font-bold tracking-wider">816,841</p>
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors mb-6">
                        Stake seals to earn
                    </button>

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold">0</p>
                            <p className="text-xs text-gray-500">SEALS STAKED</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">TBA</p>
                            <p className="text-xs text-gray-500">BITS SCORE</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">TBA</p>
                            <p className="text-xs text-gray-500">LOYALTY MULTIPLIER</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
      </div>
    </>
  )
} 