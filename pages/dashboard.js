import Head from 'next/head'
import Link from 'next/link'

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard - Sappy</title>
        <meta name="description" content="Sappy Dashboard - Manage your account and view analytics." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/" className="text-2xl font-bold text-black uppercase tracking-wide">
                  SAPPY
                </Link>
              </div>
              
              {/* Navigation */}
              <nav className="hidden md:block">
                <ul className="flex space-x-8">
                  <li>
                    <Link href="/" className="text-black uppercase font-medium hover:text-gray-600 transition-colors">
                      HOME
                    </Link>
                  </li>
                  <li>
                    <Link href="/seals" className="text-black uppercase font-medium hover:text-gray-600 transition-colors">
                      SEALS
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="text-black uppercase font-medium hover:text-gray-600 transition-colors">
                      DASHBOARD
                    </Link>
                  </li>
                  <li>
                    <Link href="/omnia" className="text-black uppercase font-medium hover:text-gray-600 transition-colors">
                      OMNIA
                    </Link>
                  </li>
                  <li>
                    <Link href="/mememachine" className="text-black uppercase font-medium hover:text-gray-600 transition-colors">
                      MEME MACHINE
                    </Link>
                  </li>
                </ul>
              </nav>
              
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button className="text-black">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-8 leading-tight">
              DASHBOARD
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Coming soon. This is where you'll manage your Sappy account and view analytics.
            </p>
            <div className="bg-gray-100 p-8 rounded-lg">
              <p className="text-gray-500">Dashboard features are under development.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">
                © Sappy Brands LLC 2025. All rights reserved.
              </p>
              <div className="flex space-x-4">
                {/* Twitter Icon */}
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                {/* Magic Eden Icon */}
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
} 