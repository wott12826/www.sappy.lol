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
                    <Link href="/seals/bits" className="hover:text-white">BITS</Link>
                    <Link href="/seals/the-archives" className="text-white underline">THE ARCHIVES</Link>
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

export default function TheArchives() {
  return (
    <>
      <Head>
        <title>The Archives - Sappy Seals</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-[#0e0e0e] text-white font-inter flex flex-col">
        <StakingHeader />

        <main className="flex-grow flex items-center justify-center">
            <div className="text-center max-w-2xl w-full">
                <h1 className="text-4xl font-bold mb-8">
                    Explore and discover 
                    <span className="bg-gradient-to-r from-yellow-400 to-green-400 text-transparent bg-clip-text"> Seals.</span>
                </h1>

                <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8 mb-6">
                    <p className="text-gray-400 mb-2">YOUR COLLECTION</p>
                    <div className="w-24 h-24 bg-gray-800 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <p>Laying Seal</p>
                    </div>
                    <p>Oops! Looks like you don't have any seals :(</p>
                    <button className="text-blue-400 underline hover:text-blue-500">Connect your wallet</button>
                    <p>and try again.</p>
                </div>

                <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8">
                    <p className="text-gray-400 mb-4">ENTER A SEAL NUMBER (1 – 10,000)</p>
                    <input 
                        type="text" 
                        placeholder="Seal Number"
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 mb-4"
                    />
                    <button className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                        3D Preview
                    </button>
                </div>
            </div>
        </main>
      </div>
    </>
  )
} 