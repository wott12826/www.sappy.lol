import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// Recreating the page based on the screenshot and original HTML structure.
// Using Tailwind CSS classes and the newly configured plugins and theme colors.

const StakingHeader = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    return (
        <header className="mb-12 flex h-[10vh] w-full px-[5vw] lg:mb-4">
            <div className="hidden grow flex-row items-center justify-between font-semibold lg:flex">
                <div className="flex flex-row items-center gap-[5vw]">
                    <Link href="/seals" legacyBehavior>
                        <a><img alt="Logo" loading="lazy" width="824" height="609" decoding="async" className="aspect-[824/609] w-min object-contain h-[8vh]" style={{color: "transparent"}} src="/images/seals/mokz_logo.png" /></a>
                    </Link>
                    <Link href="/" legacyBehavior>
                        <a className="text-white hover:text-gray-300 transition-colors font-semibold uppercase lg:text-[1.5vw]/[1.5vw] FHD:text-[1vw]/[1vw]">HOME</a>
                    </Link>
                    <nav className="flex grow flex-row gap-[4vw] font-semibold uppercase lg:text-[1.5vw]/[1.5vw] FHD:text-[1vw]/[1vw]">
                        <div className="relative flex items-center gap-[4vw]">
                            <Link href="/seals/staking" legacyBehavior><a className="text-white">STAKING</a></Link>
                            <div className="absolute -bottom-1 h-1 rounded-full bg-white transition-all duration-300" style={{ left: '0px', width: '75px' }}></div>
                        </div>
                    </nav>
                </div>
            </div>
            
            {/* Мобильная навигация */}
            <div className="flex lg:hidden w-full items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/seals" legacyBehavior>
                        <a><img alt="Logo" loading="lazy" width="824" height="609" decoding="async" className="aspect-[824/609] w-min object-contain h-[6vh]" style={{color: "transparent"}} src="/images/seals/mokz_logo.png" /></a>
                    </Link>
                    <Link href="/" legacyBehavior>
                        <a className="text-white hover:text-gray-300 transition-colors font-semibold text-lg">HOME</a>
                    </Link>
                </div>
                <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-white p-2"
                >
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
                        <path d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"></path>
                    </svg>
                </button>
                
                {/* Мобильное меню */}
                {mobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm text-white p-6 mt-4 rounded-lg z-50">
                        <nav className="flex flex-col space-y-4">
                            <Link href="/seals" legacyBehavior>
                                <a className="text-lg font-semibold hover:text-gray-300 transition-colors">MONKZ</a>
                            </Link>
                            <Link href="/seals/staking" legacyBehavior>
                                <a className="text-lg font-semibold text-blue-400">STAKING</a>
                            </Link>
                            <Link href="/" legacyBehavior>
                                <a className="text-lg font-semibold hover:text-gray-300 transition-colors">HOME</a>
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

const StatsBar = () => (
    <div className="mx-auto w-[95%] lg:w-[90%] max-w-md rounded-full bg-white font-mono text-black @container/stats">
        <div className="flex w-full items-center justify-between px-[6cqw] lg:px-[8cqw] py-[2cqw] lg:py-[3cqw]">
            <div className="flex flex-col items-center gap-[0.5cqw] lg:gap-[1cqw]">
                <p className="whitespace-nowrap text-[2cqw]/[2cqw] lg:text-[2.5cqw]/[2.5cqw] uppercase text-gray-500">total bits</p>
                <span className="flex items-center gap-[0.5cqw] lg:gap-[1cqw]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 51 59" className="h-[0.6em] lg:h-[0.8em] flex-none">
                        <path fill="#E6E6E6" d="m25.398 0 25.358 14.64-25.358 14.641L.038 14.641z"></path>
                        <path fill="silver" d="m.04 14.64 25.358 14.641v29.281L.04 43.922z"></path>
                        <path fill="#9A9A9A" d="m25.398 29.281 25.358-14.64v29.28L25.398 58.563z"></path>
                        <path fill="#4D4D4D" d="m25.502 13.644 13.494 7.79L25.5 29.227l-13.494-7.791z"></path>
                        <path fill="#262626" d="m12.006 21.435 13.495 7.791v15.582l-13.495-7.791z"></path>
                        <path fill="#000" d="m25.502 29.226 13.494-7.791v15.582L25.5 44.808z"></path>
                    </svg>
                    <div className="text-[3cqw]/[3cqw] lg:text-[4cqw]/[4cqw]">36,626.7</div>
                </span>
            </div>
            <div className="h-[4cqw] lg:h-[6cqw] w-px bg-black"></div>
            <div className="flex flex-col items-center gap-[0.5cqw] lg:gap-[1cqw]">
                <p className="whitespace-nowrap text-[1.5cqw]/[1.5cqw] lg:text-[2.5cqw]/[2.5cqw] uppercase text-gray-500">LOYALTY MULTIPLIER</p>
                <span className="flex items-center gap-[0.5cqw] lg:gap-[1cqw]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 51 59" className="h-[0.6em] lg:h-[0.8em] flex-none">
                        <path fill="#E6E6E6" d="m25.398 0 25.358 14.64-25.358 14.641L.038 14.641z"></path>
                        <path fill="silver" d="m.04 14.64 25.358 14.641v29.281L.04 43.922z"></path>
                        <path fill="#9A9A9A" d="m25.398 29.281 25.358-14.64v29.28L25.398 58.563z"></path>
                        <path fill="#4D4D4D" d="m25.502 13.644 13.494 7.79L25.5 29.227l-13.494-7.791z"></path>
                        <path fill="#262626" d="m12.006 21.435 13.495 7.791v15.582l-13.495-7.791z"></path>
                        <path fill="#000" d="m25.502 29.226 13.494-7.791v15.582L25.5 44.808z"></path>
                    </svg>
                    <div className="text-[3cqw]/[3cqw] lg:text-[4cqw]/[4cqw]">TBA</div>
                </span>
            </div>
            <div className="h-[4cqw] lg:h-[6cqw] w-px bg-black"></div>
            <div className="flex flex-col items-center gap-[0.5cqw] lg:gap-[1cqw]">
                <p className="whitespace-nowrap text-[1.5cqw]/[1.5cqw] lg:text-[2.5cqw]/[2.5cqw] uppercase text-gray-500">current rate</p>
                <span className="flex items-center gap-[0.5cqw] lg:gap-[1cqw]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 51 59" className="h-[0.6em] lg:h-[0.8em] flex-none">
                        <path fill="#E6E6E6" d="m25.398 0 25.358 14.64-25.358 14.641L.038 14.641z"></path>
                        <path fill="silver" d="m.04 14.64 25.358 14.641v29.281L.04 43.922z"></path>
                        <path fill="#9A9A9A" d="m25.398 29.281 25.358-14.64v29.28L25.398 58.563z"></path>
                        <path fill="#4D4D4D" d="m25.502 13.644 13.494 7.79L25.5 29.227l-13.494-7.791z"></path>
                        <path fill="#262626" d="m12.006 21.435 13.495 7.791v15.582l-13.495-7.791z"></path>
                        <path fill="#000" d="m25.502 29.226 13.494-7.791v15.582L25.5 44.808z"></path>
                    </svg>
                    <div className="text-[3cqw]/[3cqw] lg:text-[4cqw]/[4cqw]">TBA</div>
                </span>
            </div>
        </div>
    </div>
);

const Filters = () => (
    <div className="flex w-full flex-col lg:flex-row flex-wrap items-start lg:items-center gap-3 lg:gap-6">
        <div className="flex flex-row gap-2 lg:gap-[min(1.5vw,14px)] text-xs lg:text-sm font-medium w-full lg:w-auto">
            <button type="button" className="flex items-center gap-1 lg:gap-[0.7em] rounded-full px-3 lg:px-[1.2em] py-2 lg:py-[0.5em] font-poppins bg-white text-black text-xs lg:text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="12" fill="none" viewBox="0 0 19 12" className="h-3 w-3 lg:h-[1em] lg:w-[1em]">
                    <path fill="currentColor" stroke="currentColor" strokeWidth="0.031" d="M6.645 5.782c-1.61-.45-4.071-4.264-4.324-3.401-.08.59.821 1.817.528 1.75S1 3.731 1 4.106s.325.537 1.801 1.45c4.14 5.9 8.191 6.228 10.4 4.602 2.21-1.625 3.384-5.622 3.508-6.052.123-.43.672-.35 1.2-.95.529-.6-1.369-2.576-2.81-2.076-1.44.5-3.819 4.027-4.948 4.527s-1.897.625-3.506.175Z"></path>
                </svg>
                ALL
            </button>
            <button type="button" className="flex items-center gap-1 lg:gap-[0.7em] rounded-full px-3 lg:px-[1.2em] py-2 lg:py-[0.5em] font-poppins bg-[#3f3f3f] text-white text-xs lg:text-sm">STAKED</button>
            <button type="button" className="flex items-center gap-1 lg:gap-[0.7em] rounded-full px-3 lg:px-[1.2em] py-2 lg:py-[0.5em] font-poppins bg-[#3f3f3f] text-white text-xs lg:text-sm">UNSTAKED</button>
        </div>
        <div className="flex h-8 lg:h-6 items-center justify-end gap-2 text-gray-500 w-full lg:w-auto lg:ml-auto">
            <select className="h-full cursor-pointer rounded-lg border-r-4 border-transparent bg-gray-800 pl-2 font-inter text-xs text-white">
                <option value="default">DEFAULT</option>
                <option value="id">ID</option>
                <option value="unclaimedPixl">EARNED</option>
                <option value="dailyRate">RATE</option>
            </select>
            <button type="button" className="flex aspect-square h-full items-stretch justify-stretch active:text-gray-400 disabled:text-gray-600" disabled>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="h-full w-full" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z"></path></svg>
            </button>
            <button type="button" className="flex aspect-square h-full items-stretch justify-stretch active:text-gray-400 disabled:text-gray-600">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="h-full w-full" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M4 2v2H2V2zm1 12v-2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m5 10v-2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1M9 2v2H7V2zm5 0v2h-2V2zM4 7v2H2V7zm5 0v2H7V7zm5 0h-2v2h2zM4 12v2H2v-2zm5 0v2H7v-2zm5 0v2h-2v-2zM12 1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm-1 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm1 4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1z"></path></svg>
            </button>
        </div>
    </div>
);

const StakingWidget = () => {
    const [amount, setAmount] = useState('');
    const [period, setPeriod] = useState(30); // дней
    const [apy, setApy] = useState(12); // годовая доходность, %
    const [status, setStatus] = useState('');
    const [isBlurred, setIsBlurred] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');

    // Целевая дата: 25.06.2025 UTC
    const targetDate = new Date('2025-06-25T00:00:00.000Z');

    // Функция для расчета оставшегося времени
    const calculateTimeLeft = () => {
        const now = new Date();
        const difference = targetDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
        return '0d 0h 0m 0s';
    };

    // Обновление времени каждую секунду
    useEffect(() => {
        if (isBlurred) {
            const timer = setInterval(() => {
                setTimeLeft(calculateTimeLeft());
            }, 1000);

            // Автоматическое исчезновение через 10 секунд
            const hideTimer = setTimeout(() => {
                setIsBlurred(false);
            }, 10000);

            return () => {
                clearInterval(timer);
                clearTimeout(hideTimer);
            };
        }
    }, [isBlurred]);

    // Расчеты доходности
    const amt = Number(amount) > 0 ? Number(amount) : 0;
    const yearIncome = amt * (apy / 100);
    const monthIncome = yearIncome / 12;
    const dayIncome = yearIncome / 365;
    const periodIncome = amt * (apy / 100) * (period / 365);

    const handleStake = () => {
        setIsBlurred(true);
        setTimeLeft(calculateTimeLeft());
    };

    return (
        <div className="mx-auto mt-4 lg:mt-8 w-full max-w-md rounded-2xl bg-[#181818] p-4 lg:p-8 shadow-2xl flex flex-col items-center gap-3 lg:gap-4 border border-[#232323] relative">
            {isBlurred && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
                    <div className="text-center text-white p-6">
                        <div className="text-2xl lg:text-3xl font-bold mb-2">Coming Soon</div>
                        <div className="text-lg lg:text-xl text-blue-400 mb-2">25.06.2025 UTC</div>
                        <div className="text-sm lg:text-base text-gray-300">Time remaining:</div>
                        <div className="text-lg lg:text-xl font-mono text-yellow-400">{timeLeft}</div>
                    </div>
                </div>
            )}
            <h3 className="text-xl lg:text-2xl font-bold mb-1 lg:mb-2">Staking Calculator</h3>
            <div className="w-full flex flex-col gap-2 lg:gap-3">
                <label className="text-xs lg:text-sm text-gray-300">Amount</label>
                <input
                    type="number"
                    min="0"
                    step="any"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full rounded-lg bg-[#222] px-3 lg:px-4 py-2 lg:py-3 text-base lg:text-lg text-white border border-[#333] focus:outline-none focus:border-blue-400 transition"
                />
                <label className="text-xs lg:text-sm text-gray-300 mt-1 lg:mt-2">Staking Period</label>
                <select
                    value={period}
                    onChange={e => setPeriod(Number(e.target.value))}
                    className="w-full rounded-lg bg-[#222] px-3 lg:px-4 py-2 text-white border border-[#333] focus:outline-none focus:border-blue-400 transition text-sm lg:text-base"
                >
                    <option value={7}>7 days</option>
                    <option value={30}>30 days</option>
                    <option value={90}>90 days</option>
                    <option value={180}>180 days</option>
                    <option value={365}>365 days</option>
                </select>
                <label className="text-xs lg:text-sm text-gray-300 mt-1 lg:mt-2">APY (Annual % Yield)</label>
                <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={apy}
                    onChange={e => setApy(Number(e.target.value))}
                    className="w-full rounded-lg bg-[#222] px-3 lg:px-4 py-2 text-white border border-[#333] focus:outline-none focus:border-blue-400 transition text-sm lg:text-base"
                />
            </div>
            <div className="w-full mt-3 lg:mt-4 bg-[#222] rounded-lg p-3 lg:p-4 text-white text-xs lg:text-sm flex flex-col gap-1">
                <div className="flex justify-between"><span>Yearly income:</span> <span>{yearIncome.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Monthly income:</span> <span>{monthIncome.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Daily income:</span> <span>{dayIncome.toFixed(4)}</span></div>
                <div className="flex justify-between font-bold text-blue-400"><span>Income for {period} days:</span> <span>{periodIncome.toFixed(2)}</span></div>
            </div>
            <button
                onClick={handleStake}
                className="w-full rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 lg:py-3 mt-2 transition text-sm lg:text-base"
            >
                Stake
            </button>
            {status && !isBlurred && <div className="mt-2 text-xs lg:text-sm text-blue-300">{status}</div>}
        </div>
    );
};

const BackgroundText = () => (
    <div className="text-[8vw] lg:text-[15.625vw] font-black text-[#323232] fixed -bottom-[1vw] lg:-bottom-[2vw] -left-[0.5vw] lg:-left-[1vw] -z-10 h-fit leading-none" style={{ transform: 'none' }}>
        <div className="inline-flex items-end overflow-hidden">
            <div className="flex items-end">
                <span className="inline-flex items-center justify-center transition-all duration-700 ease-in-out">S</span>
                <span className="inline-flex items-center justify-center transition-all duration-700 ease-in-out">T</span>
                <span className="inline-flex items-center justify-center transition-all duration-700 ease-in-out">A</span>
                <span className="inline-flex items-center justify-center transition-all duration-700 ease-in-out">K</span>
                <span className="inline-flex items-center justify-center transition-all duration-700 ease-in-out">I</span>
                <span className="inline-flex items-center justify-center transition-all duration-700 ease-in-out">N</span>
                <span className="inline-flex items-center justify-center transition-all duration-700 ease-in-out">G</span>
            </div>
        </div>
    </div>
);


export default function StakingPage() {
    return (
        <>
            <Head>
                <title>Staking – Sappy Seals</title>
                <link rel="icon" href="/images/seals/Monkz_logo.png" />
            </Head>
            <div className="dark bg-[#111] text-white font-poppins" style={{colorScheme: 'dark'}}>
                <div className="flex min-h-screen w-screen flex-col py-[3vh] lg:py-[5vh]" style={{minHeight: '100dvh'}}>
                    <StakingHeader/>
                    <main className="flex w-screen grow flex-col overflow-hidden">
                        <div className="flex flex-col justify-center gap-2 lg:gap-3 px-[3vw] lg:px-[5vw] pb-[3vw] lg:pb-[5vw] lg:gap-6 lg:px-[10vw] lg:pb-[1vw]">
                            <StatsBar />
                            <Filters />
                            <StakingWidget />
                        </div>
                        <BackgroundText />
                    </main>
                </div>
            </div>
        </>
    )
}