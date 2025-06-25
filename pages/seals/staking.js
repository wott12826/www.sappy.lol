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
                        <a><img alt="Logo" loading="lazy" width="824" height="609" decoding="async" className="aspect-[824/609] w-min object-contain h-[8vh] filter invert brightness-200" style={{color: "transparent"}} src="/images/seals/mokz_logo.png" /></a>
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
                        <a><img alt="Logo" loading="lazy" width="824" height="609" decoding="async" className="aspect-[824/609] w-min object-contain h-[6vh] filter invert brightness-200" style={{color: "transparent"}} src="/images/seals/mokz_logo.png" /></a>
                    </Link>
                    <Link href="/" legacyBehavior>
                        <a className="text-white hover:text-gray-300 transition-colors font-semibold text-lg">HOME</a>
                    </Link>
                </div>

                
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
        <div className="mx-auto mt-4 lg:mt-8 w-full max-w-md rounded-2xl bg-white p-4 lg:p-8 shadow-2xl flex flex-col items-center gap-3 lg:gap-4 border border-[#232323] relative">
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
            <h3 className="text-xl lg:text-2xl font-bold mb-1 lg:mb-2 text-black">Staking Calculator</h3>
            <div className="w-full flex flex-col gap-2 lg:gap-3">
                <label className="text-xs lg:text-sm text-gray-700">Amount $MONKZ</label>
                <input
                    type="number"
                    min="0"
                    step="any"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full rounded-lg bg-gray-100 px-3 lg:px-4 py-2 lg:py-3 text-base lg:text-lg text-black border border-gray-300 focus:outline-none focus:border-black transition"
                />
                <label className="text-xs lg:text-sm text-gray-700 mt-1 lg:mt-2">Staking Period</label>
                <select
                    value={period}
                    onChange={e => setPeriod(Number(e.target.value))}
                    className="w-full rounded-lg bg-gray-100 px-3 lg:px-4 py-2 text-black border border-gray-300 focus:outline-none focus:border-black transition text-sm lg:text-base"
                >
                    <option value={7}>7 days</option>
                    <option value={30}>30 days</option>
                    <option value={90}>90 days</option>
                    <option value={180}>180 days</option>
                    <option value={365}>365 days</option>
                </select>
                <label className="text-xs lg:text-sm text-gray-700 mt-1 lg:mt-2">APY (Annual % Yield)</label>
                <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={apy}
                    onChange={e => setApy(Number(e.target.value))}
                    className="w-full rounded-lg bg-gray-100 px-3 lg:px-4 py-2 text-black border border-gray-300 focus:outline-none focus:border-black transition text-sm lg:text-base"
                />
            </div>
            <div className="w-full mt-3 lg:mt-4 bg-gray-100 rounded-lg p-3 lg:p-4 text-black text-xs lg:text-sm flex flex-col gap-1">
                <div className="flex justify-between"><span>Yearly income:</span> <span>{yearIncome.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Monthly income:</span> <span>{monthIncome.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Daily income:</span> <span>{dayIncome.toFixed(4)}</span></div>
                <div className="flex justify-between font-bold text-blue-400"><span>Income for {period} days:</span> <span>{periodIncome.toFixed(2)}</span></div>
            </div>
            <button
                onClick={handleStake}
                className="w-full rounded-lg bg-black hover:bg-gray-900 text-white font-semibold py-2 lg:py-3 mt-2 transition text-sm lg:text-base"
            >
                Stake
            </button>
            {status && !isBlurred && <div className="mt-2 text-xs lg:text-sm text-blue-600">{status}</div>}
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