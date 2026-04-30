import { useNavigate } from "react-router-dom";
import tmdb from "../../assets/tmdb.svg"
import JustWatch from "../../assets/JustWatch.svg"
export default function Footer() {
    const navigate = useNavigate();
    return (
        <>
            <footer className='bg-black py-12 px-4 sm:px-6 lg:px-8'>
                <div className='w-full max-w-7xl mx-auto'>
                    <div className="flex flex-wrap justify-between gap-y-12 lg:gap-x-8">
                        <div className="w-full md:w-[45%] lg:w-[35%] flex flex-col items-center md:items-start text-center md:text-left">
                            <div className='w-full max-w-52 h-px mt-8 bg-linear-to-r from-black via-white/25 to-black'></div>
                            <p className='text-sm text-white/60 mt-6 max-w-sm leading-relaxed '>
                                <span>Made for Mihnea  Rusu's Bachelor Theisis.</span>
                                <br />
                               <span>This product uses the TMDB API but is not endorsed or certified by TMDB. <br></br>Watch providers are provided by JustWatch, this product is not endorsed or certified by JustWatch.</span> 
                            </p>
                        </div>
                        <div className="w-full md:w-[45%] lg:w-[15%] flex flex-col items-center md:items-start text-center md:text-left">
                            <h3 className='text-sm text-white font-medium'>Important Links</h3>
                            <div className="flex flex-col gap-2 mt-6">
                                <a onClick={() => { navigate("/") }} className='text-white/60 hover:text-white transition-colors  cursor-pointer'>Home</a>
                                <a onClick={() => { navigate("/about") }} className='text-sm text-white/60 hover:text-white transition-colors cursor-pointer'>About</a>
                                <a href="https://github.com/rusumihnea23" className='text-sm text-white/60 hover:text-white transition-colors '>Portfolio</a>
                            </div>
                        </div>
                        <div className="w-full md:w-[45%] lg:w-[15%] flex flex-col items-center md:items-start text-center md:text-left">
                            <h3 className='text-sm text-white font-medium'>Social Links</h3>
                            <div className="flex flex-col gap-2 mt-6">
                                <a href="https://www.youtube.com/@mihnearusu3257" className='text-sm text-white/60 hover:text-white transition-colors'>Youtube</a>
                                <a href="https://www.linkedin.com/in/mihnea-rusu/" className='text-sm text-white/60 hover:text-white transition-colors'>Linkedin</a>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <img
                                className="w-32 h-32" 
                                src="equilateral.png"
                                alt="triangle with equal sides"
                                srcSet={tmdb}
                            />
                            <img
                                className="w-32 h-32" 
                                src="equilateral.png"
                                alt="triangle with equal sides"
                                srcSet={JustWatch}
                            />
                        </div>

                        <p className='text-xs text-white/60'>© 2026 ASE</p>
                    </div>
                    
                </div>
            </footer>
        </>
    );
};