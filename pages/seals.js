import Head from 'next/head'
import Link from 'next/link'
import Script from 'next/script'
import { FaTwitter, FaMediumM } from 'react-icons/fa';
import { useState } from 'react';

const scoopItems = [
    { title: 'Spectre Tee Drop', image: '/images/seals/scoop-spectre-tee.png', tag: 'Apparel' },
    { title: 'Playtesting IRL', image: '/images/seals/scoop-playtesting.png', tag: 'Gaming' },
    { title: 'Two Year Anniversary', image: '/images/seals/scoop-anniversary.png', tag: 'Moment' },
    { title: 'Rare Evo', image: '/images/seals/scoop-rare-evo.png', tag: 'Event' },
];

const innovationsItems = [
    {
        num: '001',
        title: 'WE WANTED TO INNOVATE MEMES.',
        description: 'So we made',
        buttonText: 'Meme Machine',
        link: '#',
        image: '/images/seals/innovations-meme-machine.png'
    },
    {
        num: '002',
        title: 'WE WANTED TO CREATE THE NEXT GENERATION OF ENTERTAINMENT',
        description: '',
        buttonText: 'PIXL PETS',
        link: '#',
        image: '/images/seals/innovations-pixl-pets.png'
    },
    {
        num: '003',
        title: 'WE WANTED TO TRAILBLAZE ONCHAIN',
        list: [
            'Rarity-Based Staking',
            'Onchain ERC20 Marketplace',
            'First-ever Bitcoin ordinals ARG experience'
        ],
        image: '/images/seals/3.png'
    }
]

// Новый компонент на основе скриншотов
export default function MonkzRedesign() {
  // Массив превью и видео/картинок
  const previews = [
    { thumb: '/images/seals/1.png', media: '/images/seals/firebird.mp4', type: 'video' },
    { thumb: '/images/seals/2.png', media: '/images/seals/gameplay-trailer.mp4', type: 'video' },
    { thumb: '/images/seals/1.png', media: '/images/seals/pet.mp4', type: 'video' },
  ];
  // Если появятся видео, замените media и type на 'video'
  // Пример: { thumb: '/images/seals/1.png', media: '/videos/game1.mp4', type: 'video' }
  const [activeIdx, setActiveIdx] = useState(0);
  const handleVideoEnd = () => {
    setActiveIdx((prev) => (prev + 1) % previews.length);
  };

  return (
    <>
      <Head>
        <title>Sappy Monkz</title>
        <meta name="description" content="The coolest thing on the internet." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Боковые социальные иконки */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col space-y-4">
        <a href="#" className="text-white p-2 rounded-full bg-black/50 hover:bg-white hover:text-black transition-colors"><FaTwitter /></a>
        <a href="#" className="text-white p-2 rounded-full bg-black/50 hover:bg-white hover:text-black transition-colors"><FaMediumM /></a>
      </div>

      <div className="bg-white text-black">
        <main>
          {/* LANDING SECTION */}
          <section id="landing" className="relative overflow-hidden px-[5vw] md:px-[7.5vw] 2xl:px-[10vw] h-[max(100svh,100vw/3840*1771)] bg-[#374CFF]/90 @container">
            <header className="mb-12 flex h-[10vh] w-full lg:mb-4">
              <div className="absolute inset-x-0 top-[5vh] z-50 hidden w-full items-center justify-between px-[5vw] text-[1vw] font-semibold tracking-[0.1vw] text-white lg:flex">
                <nav className="flex w-[40%] justify-between">
                  <a href="/" className="w-min relative mt-[0.5vw] hover:text-gray-300">MONKZ</a>
                  <a href="/dashboard" className="w-min relative mt-[0.5vw] hover:text-gray-300">DASHBOARD</a>
                </nav>
                <a href="/seals">
                  <img alt="Logo" loading="lazy" width="824" height="609" decoding="async" data-nimg="1" 
                       className="aspect-[824/609] w-min object-contain absolute left-1/2 top-1/2 h-[8vh] -translate-x-1/2 -translate-y-1/2" 
                       src="/images/seals/logo.png" />
                </a>
                <a className="flex w-min items-center justify-start rounded-[18px] bg-white px-6 py-2.5 shadow-lg hover:bg-gray-300 text-[1.2vw]" 
                   href="/seals/staking">
                  <svg xmlns="http://www.w3.org/2000/svg" width="187" height="29" fill="none" viewBox="0 0 187 29">
                    <path stroke="#000" d="m18.778 20.5 7.11-6m0 0-7.11-6m7.11 6H1m8.889 6V22c0 1.194.562 2.338 1.562 3.182 1 .844 2.357 1.318 3.771 1.318h12.445c1.414 0 2.77-.474 3.77-1.318C32.439 24.338 33 23.194 33 22V7c0-1.193-.562-2.338-1.562-3.182-1-.844-2.357-1.318-3.771-1.318H15.222c-1.414 0-2.77.474-3.771 1.318-1 .844-1.562 1.989-1.562 3.182v1.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    <path stroke="url(#paint0_radial_1090_625)" d="m18.778 20.5 7.11-6m0 0-7.11-6m7.11 6H1m8.889 6V22c0 1.194.562 2.338 1.562 3.182 1 .844 2.357 1.318 3.771 1.318h12.445c1.414 0 2.77-.474 3.77-1.318C32.439 24.338 33 23.194 33 22V7c0-1.193-.562-2.338-1.562-3.182-1-.844-2.357-1.318-3.771-1.318H15.222c-1.414 0-2.77.474-3.771 1.318-1 .844-1.562 1.989-1.562 3.182v1.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    <path fill="#3566DF" d="M57.015 7.595c1.408 0 2.644.275 3.707.826a5.81 5.81 0 0 1 2.477 2.362c.59 1.011.884 2.19.884 3.534 0 1.344-.295 2.522-.884 3.533-.576.999-1.402 1.774-2.477 2.324-1.063.55-2.299.826-3.707.826H52.33V7.595zm-.096 11.12c1.409 0 2.497-.384 3.265-1.153.768-.768 1.152-1.85 1.152-3.245 0-1.396-.384-2.484-1.152-3.265-.768-.794-1.856-1.191-3.265-1.191h-1.901v8.854zm19.317-.27h-5.34L70.014 21H67.19l4.82-13.424h3.131L79.961 21H77.12zm-.73-2.15-1.94-5.608-1.94 5.608zm12.806 4.84c-.934 0-1.78-.16-2.535-.48-.742-.32-1.331-.782-1.767-1.384-.435-.601-.659-1.312-.672-2.131h2.881c.038.55.23.986.576 1.306.359.32.845.48 1.46.48.627 0 1.12-.147 1.479-.442.358-.307.537-.704.537-1.19 0-.398-.121-.724-.365-.98a2.444 2.444 0 0 0-.922-.595c-.358-.154-.857-.32-1.497-.5-.871-.256-1.582-.505-2.132-.749a3.952 3.952 0 0 1-1.402-1.133c-.384-.512-.576-1.19-.576-2.036 0-.793.198-1.485.595-2.074.397-.589.954-1.037 1.67-1.344.718-.32 1.537-.48 2.46-.48 1.382 0 2.502.339 3.36 1.018.87.665 1.35 1.6 1.44 2.804h-2.957a1.496 1.496 0 0 0-.596-1.134c-.358-.307-.838-.46-1.44-.46-.525 0-.947.134-1.268.403-.307.269-.46.66-.46 1.171 0 .359.115.66.345.903.243.23.538.422.884.576.358.141.858.307 1.498.5.87.256 1.58.512 2.132.768.55.256 1.024.64 1.42 1.152.398.512.596 1.184.596 2.017 0 .716-.186 1.382-.557 1.997-.371.615-.915 1.107-1.632 1.479-.717.358-1.569.537-2.555.537m20.115-13.54V21h-2.688v-5.704h-5.743V21h-2.688V7.595h2.688v5.512h5.743V7.595zm12.173 6.53a3.01 3.01 0 0 1 1.863 1.133c.486.614.729 1.318.729 2.112 0 .717-.179 1.351-.537 1.901-.346.538-.852.96-1.518 1.268-.665.307-1.453.461-2.362.461h-5.781V7.595h5.531c.91 0 1.691.147 2.344.441.665.295 1.165.705 1.498 1.23a3.18 3.18 0 0 1 .518 1.786c0 .78-.211 1.434-.634 1.959-.409.525-.96.896-1.651 1.114m-4.917-1h2.458c.641 0 1.133-.14 1.479-.422.346-.294.519-.71.519-1.248s-.173-.954-.519-1.248c-.346-.295-.838-.442-1.479-.442h-2.458zm2.708 5.686c.653 0 1.159-.154 1.517-.461.372-.308.557-.743.557-1.306 0-.576-.192-1.025-.576-1.345-.384-.332-.903-.499-1.556-.499h-2.65v3.61zm15.087 2.323c-1.254 0-2.407-.294-3.457-.883a6.61 6.61 0 0 1-2.496-2.44c-.615-1.049-.922-2.233-.922-3.552 0-1.306.307-2.478.922-3.515a6.568 6.568 0 0 1 2.496-2.458c1.05-.589 2.203-.883 3.457-.883 1.268 0 2.42.294 3.457.883a6.439 6.439 0 0 1 2.478 2.458c.614 1.037.922 2.209.922 3.515 0 1.319-.308 2.503-.922 3.553a6.479 6.479 0 0 1-2.478 2.439c-1.05.589-2.202.883-3.457.883m0-2.4c.807 0 1.517-.18 2.132-.538a3.808 3.808 0 0 0 1.44-1.575c.346-.678.519-1.466.519-2.362 0-.896-.173-1.677-.519-2.343-.345-.679-.825-1.197-1.44-1.556-.615-.358-1.325-.537-2.132-.537-.806 0-1.523.179-2.151.537-.614.359-1.094.877-1.44 1.556-.346.666-.519 1.447-.519 2.343 0 .896.173 1.684.519 2.362a3.821 3.821 0 0 0 1.44 1.575c.628.358 1.345.538 2.151.538m18.997-.288h-5.339L146.253 21h-2.823l4.82-13.424h3.131L156.201 21h-2.842zm-.73-2.151-1.939-5.608-1.94 5.608zM166.837 21l-2.957-5.224h-1.268V21h-2.689V7.595h5.032c1.037 0 1.921.185 2.651.557.729.358 1.273.851 1.632 1.479.371.614.557 1.306.557 2.074 0 .883-.256 1.683-.768 2.4-.512.704-1.274 1.191-2.286 1.46L169.949 21zm-4.225-7.24h2.247c.73 0 1.274-.173 1.633-.519.358-.358.537-.851.537-1.479 0-.614-.179-1.088-.537-1.42-.359-.347-.903-.52-1.633-.52h-2.247zm16.221-6.165c1.409 0 2.644.275 3.707.826a5.806 5.806 0 0 1 2.477 2.362c.589 1.011.884 2.19.884 3.534 0 1.344-.295 2.522-.884 3.533-.576.999-1.401 1.774-2.477 2.324-1.063.55-2.298.826-3.707.826h-4.686V7.595zm-.096 11.12c1.409 0 2.497-.384 3.265-1.153.768-.768 1.153-1.85 1.153-3.245 0-1.396-.385-2.484-1.153-3.265-.768-.794-1.856-1.191-3.265-1.191h-1.901v8.854z"></path>
                    <path fill="url(#paint1_radial_1090_625)" d="M57.015 7.595c1.408 0 2.644.275 3.707.826a5.81 5.81 0 0 1 2.477 2.362c.59 1.011.884 2.19.884 3.534 0 1.344-.295 2.522-.884 3.533-.576.999-1.402 1.774-2.477 2.324-1.063.55-2.299.826-3.707.826H52.33V7.595zm-.096 11.12c1.409 0 2.497-.384 3.265-1.153.768-.768 1.152-1.85 1.152-3.245 0-1.396-.384-2.484-1.152-3.265-.768-.794-1.856-1.191-3.265-1.191h-1.901v8.854zm19.317-.27h-5.34L70.014 21H67.19l4.82-13.424h3.131L79.961 21H77.12zm-.73-2.15-1.94-5.608-1.94 5.608zm12.806 4.84c-.934 0-1.78-.16-2.535-.48-.742-.32-1.331-.782-1.767-1.384-.435-.601-.659-1.312-.672-2.131h2.881c.038.55.23.986.576 1.306.359.32.845.48 1.46.48.627 0 1.12-.147 1.479-.442.358-.307.537-.704.537-1.19 0-.398-.121-.724-.365-.98a2.444 2.444 0 0 0-.922-.595c-.358-.154-.857-.32-1.497-.5-.871-.256-1.582-.505-2.132-.749a3.952 3.952 0 0 1-1.402-1.133c-.384-.512-.576-1.19-.576-2.036 0-.793.198-1.485.595-2.074.397-.589.954-1.037 1.67-1.344.718-.32 1.537-.48 2.46-.48 1.382 0 2.502.339 3.36 1.018.87.665 1.35 1.6 1.44 2.804h-2.957a1.496 1.496 0 0 0-.596-1.134c-.358-.307-.838-.46-1.44-.46-.525 0-.947.134-1.268.403-.307.269-.46.66-.46 1.171 0 .359.115.66.345.903.243.23.538.422.884.576.358.141.858.307 1.498.5.87.256 1.58.512 2.132.768.55.256 1.024.64 1.42 1.152.398.512.596 1.184.596 2.017 0 .716-.186 1.382-.557 1.997-.371.615-.915 1.107-1.632 1.479-.717.358-1.569.537-2.555.537m20.115-13.54V21h-2.688v-5.704h-5.743V21h-2.688V7.595h2.688v5.512h5.743V7.595zm12.173 6.53a3.01 3.01 0 0 1 1.863 1.133c.486.614.729 1.318.729 2.112 0 .717-.179 1.351-.537 1.901-.346.538-.852.96-1.518 1.268-.665.307-1.453.461-2.362.461h-5.781V7.595h5.531c.91 0 1.691.147 2.344.441.665.295 1.165.705 1.498 1.23a3.18 3.18 0 0 1 .518 1.786c0 .78-.211 1.434-.634 1.959-.409.525-.96.896-1.651 1.114m-4.917-1h2.458c.641 0 1.133-.14 1.479-.422.346-.294.519-.71.519-1.248s-.173-.954-.519-1.248c-.346-.295-.838-.442-1.479-.442h-2.458zm2.708 5.686c.653 0 1.159-.154 1.517-.461.372-.308.557-.743.557-1.306 0-.576-.192-1.025-.576-1.345-.384-.332-.903-.499-1.556-.499h-2.65v3.61zm15.087 2.323c-1.254 0-2.407-.294-3.457-.883a6.61 6.61 0 0 1-2.496-2.44c-.615-1.049-.922-2.233-.922-3.552 0-1.306.307-2.478.922-3.515a6.568 6.568 0 0 1 2.496-2.458c1.05-.589 2.203-.883 3.457-.883 1.268 0 2.42.294 3.457.883a6.439 6.439 0 0 1 2.478 2.458c.614 1.037.922 2.209.922 3.515 0 1.319-.308 2.503-.922 3.553a6.479 6.479 0 0 1-2.478 2.439c-1.05.589-2.202.883-3.457.883m0-2.4c.807 0 1.517-.18 2.132-.538a3.808 3.808 0 0 0 1.44-1.575c.346-.678.519-1.466.519-2.362 0-.896-.173-1.677-.519-2.343-.345-.679-.825-1.197-1.44-1.556-.615-.358-1.325-.537-2.132-.537-.806 0-1.523.179-2.151.537-.614.359-1.094.877-1.44 1.556-.346.666-.519 1.447-.519 2.343 0 .896.173 1.684.519 2.362a3.821 3.821 0 0 0 1.44 1.575c.628.358 1.345.538 2.151.538m18.997-.288h-5.339L146.253 21h-2.823l4.82-13.424h3.131L156.201 21h-2.842zm-.73-2.151-1.939-5.608-1.94 5.608zM166.837 21l-2.957-5.224h-1.268V21h-2.689V7.595h5.032c1.037 0 1.921.185 2.651.557.729.358 1.273.851 1.632 1.479.371.614.557 1.306.557 2.074 0 .883-.256 1.683-.768 2.4-.512.704-1.274 1.191-2.286 1.46L169.949 21zm-4.225-7.24h2.247c.73 0 1.274-.173 1.633-.519.358-.358.537-.851.537-1.479 0-.614-.179-1.088-.537-1.42-.359-.347-.903-.52-1.633-.52h-2.247zm16.221-6.165c1.409 0 2.644.275 3.707.826a5.806 5.806 0 0 1 2.477 2.362c.589 1.011.884 2.19.884 3.534 0 1.344-.295 2.522-.884 3.533-.576.999-1.401 1.774-2.477 2.324-1.063.55-2.298.826-3.707.826h-4.686V7.595zm-.096 11.12c1.409 0 2.497-.384 3.265-1.153.768-.768 1.153-1.85 1.153-3.245 0-1.396-.385-2.484-1.153-3.265-.768-.794-1.856-1.191-3.265-1.191h-1.901v8.854z"></path>
                    <defs>
                      <radialGradient id="paint0_radial_1090_625" cx="0" cy="0" r="1" gradientTransform="matrix(28.50004 -16.50003 22.00001 38 4.181 23)" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#0A264F"></stop>
                        <stop offset="1" stopColor="#3563DD"></stop>
                      </radialGradient>
                      <radialGradient id="paint1_radial_1090_625" cx="0" cy="0" r="1" gradientTransform="matrix(-42.99989 37.0001 -57.12496 -66.3881 127.68 14)" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#518CFF"></stop>
                        <stop offset="1" stopColor="#0075FF" stopOpacity="0"></stop>
                      </radialGradient>
                    </defs>
                  </svg>
                </a>
              </div>
              <div className="relative z-50 mt-[5vh] flex grow flex-row items-center lg:hidden">
                <button type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:r1:" data-state="closed" className="lg:hidden text-white">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="text-[5vh] lg:text-[2vw] FHD:text-[1.5vw]" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"></path>
                  </svg>
                </button>
                <a href="/seals">
                  <img alt="Logo" loading="lazy" width="824" height="609" decoding="async" data-nimg="1" 
                       className="aspect-[824/609] w-min object-contain absolute inset-1/2 h-[8.5vh] -translate-x-1/2 -translate-y-1/2" 
                       src="/images/seals/logo.png" />
                </a>
              </div>
            </header>
            
            <div className="absolute inset-0">
              <img alt="placeholder" loading="lazy" width="3840" height="2160" decoding="async" data-nimg="1" 
                   className="h-full w-full mix-blend-soft-light object-cover" 
                   src="/images/seals/seal-camping.png" />
              <div className="absolute bottom-[-2%] left-[5%] z-20 aspect-[1366/1460] w-[31.2%]">
                <img alt="placeholder" loading="lazy" decoding="async" data-nimg="fill" 
                     className="scale-105 animate-pulse" 
                     style={{position: "absolute", height: "100%", width: "100%", inset: "0px"}} 
                     sizes="35%" 
                     src="/images/seals/seal-glow.png" />
                <img alt="placeholder" loading="lazy" decoding="async" data-nimg="fill" 
                     style={{position: "absolute", height: "100%", width: "100%", inset: "0px"}} 
                     sizes="35%" 
                     src="/images/seals/seal.png" />
              </div>
            </div>
            
            <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[#031534] from-35% via-[#08277bcc] via-70% to-[#0e29fb00] sm:from-25% sm:via-55%"></div>
            
            <div className="absolute top-[13vh] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center justify-center aspect-[21/9] h-[50vh] max-w-[90vw] @container">
              <h1 className="text-5xl md:text-7xl font-black uppercase text-center mb-4 text-white">COOLEST THING ON THE INTERNET</h1>
              <p className="text-2xl md:text-3xl text-center mb-1 font-semibold text-white">Where chaos meets character.</p>
              <p className="text-2xl md:text-3xl text-center font-semibold text-white">Monkz are here.</p>
            </div>
          </section>

          {/* GAMING */}
          <section id="gaming" className="relative flex flex-col items-center justify-center py-24 px-4 md:px-12 bg-white overflow-hidden">
            {/* Заголовок с SVG-подчёркиванием */}
            <div className="relative w-full max-w-6xl mx-auto mb-12">
              <h2 className="section-title font-black uppercase text-black text-left leading-none" style={{fontSize: 'clamp(3rem, 6vw, 5rem)', fontFamily: 'Inter, Satoshi, sans-serif'}}>THE MONKZ ARE INNOVATING GAMING.</h2>
              <svg className="absolute left-0 bottom-[-18px] w-full h-6" viewBox="0 0 600 32" fill="none"><path d="M10 22C60 10 200 10 300 22C400 34 540 34 590 22" stroke="#00C2FF" strokeWidth="8" strokeLinecap="round"/></svg>
            </div>
            <div className="relative z-20 flex flex-row items-start w-full max-w-6xl mx-auto gap-12">
              {/* Левая панель с превью */}
              <div className="thumbs flex flex-col items-center gap-4 pt-4">
                {previews.map((item, idx) => (
                  <div key={idx} className={`thumb cursor-pointer w-16 h-16 mb-2 ${activeIdx === idx ? 'outline outline-2 outline-[#00d0ff]' : 'outline outline-2 outline-transparent'} flex items-center justify-center bg-white shadow-md`} onClick={() => setActiveIdx(idx)}>
                    {item.type === 'video' ? (
                      <video src={item.media} className="object-cover w-full h-full" muted loop={false} autoPlay playsInline preload="metadata" onEnded={handleVideoEnd} />
                    ) : (
                      <img src={item.thumb} className="object-cover w-full h-full" alt={`Preview ${idx+1}`} />
                    )}
                  </div>
                ))}
              </div>
              {/* Центральный видео/картинка-блок */}
              <div className="gameplay-box relative rounded-xl overflow-hidden shadow-2xl w-[420px] h-[280px] flex items-center justify-center">
                {previews[activeIdx].type === 'video' ? (
                  <video src={previews[activeIdx].media} autoPlay muted loop={false} playsInline className="object-cover w-full h-full" onEnded={handleVideoEnd} />
                ) : (
                  <img src={previews[activeIdx].media} alt="Gameplay" className="object-cover w-full h-full" />
                )}
                <button className="play-btn absolute bottom-3 left-3 bg-black text-white px-4 py-2 font-bold rounded-md text-base shadow">{activeIdx === 0 ? 'VISUAL' : 'GAMEPLAY'}</button>
              </div>
              {/* Info-card polygon */}
              <div className="info-card relative bg-[#0d1d3c] text-white max-w-md p-8 ml-4" style={{clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)'}}>
                <p className="mb-4">We're bringing <span className="highlight bg-[#00d0ff] text-black px-1 rounded">fresh ideas</span> and daring features into long-loved genres, creating thousand hour experiences that are too fun to put down.</p>
                <p className="mb-4">Our mission is to bring spirit back into gaming and power back into the hands of players by breaking free from the traditional player ⇔ publisher ⇔ developer relationship. In the process, we'll be <span className="highlight bg-[#00d0ff] text-black px-1 rounded">creating beloved and memorable</span> IPs that last a lifetime.</p>
                <a href="#" className="learn-more bg-white text-black px-6 py-3 rounded-full font-semibold inline-block mt-4 transition hover:bg-[#00cfff]">Learn More →</a>
              </div>
            </div>
          </section>

          {/* INNOVATIONS */}
          <section id="innovations" className="relative bg-gradient-to-br from-[#162447] via-[#1a2b4b] to-[#0c1b2e] py-32 px-4 sm:px-8 lg:px-16 overflow-hidden">
            {/* Фоновый номер */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 select-none pointer-events-none z-0">
              <span className="text-white/10 font-black text-[16vw] leading-none">03</span>
            </div>
            {/* Заголовок */}
            <h2 className="relative z-10 text-center text-6xl md:text-8xl font-extrabold uppercase tracking-tight mb-24 text-white drop-shadow-[0_0_32px_#fff,0_0_8px_#00c2ff]">
              INNOVATIONS?
            </h2>
            {/* Контентные блоки */}
            <div className="relative z-10 flex flex-col items-center gap-32">
              {/* 1. Meme Machine */}
              <div className="relative flex flex-col items-end w-full max-w-3xl mx-auto">
                {/* Кавычка сверху слева */}
                <svg className="absolute -top-8 -left-8 w-12 h-12 text-cyan-300 opacity-60" viewBox="0 0 48 48" fill="none"><path d="M20 8C12 8 8 16 8 24c0 8 4 16 12 16v-8c-4 0-4-8-4-8s0-8 4-8V8z" fill="currentColor"/></svg>
                <div className="flex flex-row-reverse items-center gap-12">
                  {/* Hex image */}
                  <div className="relative w-48 h-48 flex-shrink-0 drop-shadow-2xl">
                    <div className="absolute inset-0 z-0" style={{clipPath:'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0 50%)',background:'linear-gradient(135deg,#00c2ff33 60%,#fff0 100%)'}}></div>
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                      <img src="/images/seals/1.png" alt="Game Thumbnail 1" className="w-32 h-32 object-contain" />
                    </div>
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full z-20" fill="none"><polygon points="25,7 75,7 100,50 75,93 25,93 0,50" stroke="#00C2FF" strokeWidth="4" fill="none"/></svg>
                  </div>
                  <div className="bg-[#1a2b4b]/80 rounded-2xl p-10 shadow-2xl max-w-xl relative">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">WE WANTED TO INNOVATE MEMES.</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-300">So we made</span>
                      <a href="#" className="ml-2 px-4 py-2 rounded-full bg-[#00C2FF] text-black font-bold text-sm shadow hover:bg-cyan-300 transition">✎ Meme Machine</a>
                    </div>
                  </div>
                </div>
                {/* Кавычка снизу справа */}
                <svg className="absolute -bottom-8 right-0 w-12 h-12 text-cyan-300 opacity-60" viewBox="0 0 48 48" fill="none"><path d="M28 40c8 0 12-8 12-16 0-8-4-16-12-16v8c4 0 4 8 4 8s0 8-4 8v8z" fill="currentColor"/></svg>
              </div>
              {/* 2. PIXL PETS */}
              <div className="relative flex flex-col items-start w-full max-w-3xl mx-auto">
                <div className="flex flex-row items-center gap-12">
                  {/* Hex image */}
                  <div className="relative w-48 h-48 flex-shrink-0 drop-shadow-2xl">
                    <div className="absolute inset-0 z-0" style={{clipPath:'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0 50%)',background:'linear-gradient(135deg,#00c2ff33 60%,#fff0 100%)'}}></div>
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                      <img src="/images/seals/2.png" alt="Game Thumbnail 2" className="w-32 h-32 object-contain" />
                    </div>
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full z-20" fill="none"><polygon points="25,7 75,7 100,50 75,93 25,93 0,50" stroke="#00C2FF" strokeWidth="4" fill="none"/></svg>
                  </div>
                  <div className="bg-[#1a2b4b]/80 rounded-2xl p-10 shadow-2xl max-w-xl relative">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">WE WANTED TO CREATE THE NEXT GENERATION OF ENTERTAINMENT</h3>
                    <a href="#" className="px-4 py-2 rounded-full bg-[#00C2FF] text-black font-bold text-sm shadow hover:bg-cyan-300 transition">✎ PIXL PETS</a>
                  </div>
                </div>
              </div>
              {/* 3. Trailblaze Onchain */}
              <div className="relative flex flex-col items-end w-full max-w-3xl mx-auto">
                <div className="flex flex-row-reverse items-center gap-12">
                  {/* Hex image */}
                  <div className="relative w-48 h-48 flex-shrink-0 drop-shadow-2xl">
                    <div className="absolute inset-0 z-0" style={{clipPath:'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0 50%)',background:'linear-gradient(135deg,#00c2ff33 60%,#fff0 100%)'}}></div>
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                      <img src="/images/seals/3.png" alt="Game Poster" className="w-32 h-32 object-contain" />
                    </div>
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full z-20" fill="none"><polygon points="25,7 75,7 100,50 75,93 25,93 0,50" stroke="#00C2FF" strokeWidth="4" fill="none"/></svg>
                  </div>
                  <div className="bg-[#1a2b4b]/80 rounded-2xl p-10 shadow-2xl max-w-xl relative">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">WE WANTED TO TRAILBLAZE ONCHAIN</h3>
                    <ul className="list-disc list-inside text-cyan-100 space-y-1 mb-2">
                      <li>Rarity-Based Staking</li>
                      <li>Onchain ERC20 Marketplace</li>
                      <li>First-ever Bitcoin ordinals ARG experience</li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Финал секции */}
              <div className="flex flex-col items-center mt-20">
                <div className="flex items-center gap-4">
                  <img src="/images/seals/seal_stamp.png" alt="Seal Stamp" className="w-16 h-16 object-contain" />
                  <span className="text-3xl md:text-4xl font-extrabold text-white tracking-wide drop-shadow-[0_0_16px_#00c2ff]">AND MORE TO COME!</span>
                </div>
              </div>
            </div>
            {/* Абстрактные узоры/декор */}
            <div className="pointer-events-none absolute inset-0 z-0">
              <img src="/images/seals/gradient-overlays.png" alt="Innovations BG Grid" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            </div>
          </section>

          {/* FLYWHEEL */}
          <section id="flywheel" className="bg-gradient-to-r from-white to-[#eef5ff] py-24 px-6 sm:px-8 lg:px-12" style={{backgroundImage: "url('/images/seals/halftone-pattern.png')"}}>
              <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                  <div>
                      <img src="/images/seals/flywheel.png" alt="Flywheel Diagram" />
                  </div>
                  <div className="relative">
                      <span className="text-black/10 absolute -left-16 -top-8 text-9xl font-black">04</span>
                      <h2 className="text-4xl font-black uppercase mb-6">THE FLYWHEEL</h2>
                      <div className="space-y-4 text-gray-700">
                          <p>Our mission is simple: grow MONKZ — the community, the vibe, the culture.</p>
                          <p>We'll do that by creating wild experiences with our community — through games, memes, deep lore, animations, and whatever else feels right. We're building worlds powered by fun, with MONKZ as the shared identity across it all — flying under one decentralized banner.</p>
                      </div>
                  </div>
              </div>
          </section>

          {/* FOOTER */}
          <section className="bg-gradient-to-b from-blue-500 to-black text-white text-center py-24 px-6 sm:px-8 lg:px-12">
              <div className="flex justify-center space-x-4 mb-16">
                  <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                  <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                  <div className="w-4 h-4 border-2 border-white rounded-full"></div>
              </div>
              <h2 className="text-6xl font-black uppercase tracking-tighter mb-8">
                  wow we didn't expect you<br/>here...
              </h2>
              <img src="/images/seals/chilling-bro.png" alt="Seal in a bathtub" className="mx-auto h-64"/>
           </section>
        </main>
      </div>
    </>
  )
} 
