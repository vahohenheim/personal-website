import { ReactNode } from 'react';

export const BackgroundComponent = ({ children }: { children : ReactNode }) => {
    return (
        <div className="relative">
            <div className="absolute min-w-screen min-h-screen w-full h-full z-0 bg-background overflow-hidden before:content-[''] before:absolute before:min-w-screen before:min-h-screen before:w-full before:h-full before:z-[1] before:bg-[url('/grid.svg')] before:bg-center after:content-[''] after:absolute after:min-w-screen after:min-h-screen after:w-full after:h-full after:bg-[hsla(var(--background)_/_92%)]">
                <div className="absolute w-[395px] h-[260px] left-[30px] top-[-20px] bg-[#16B08D] blur-[150px]"></div>
                <div className="absolute w-[365px] h-[480px] right-[100px] top-[140px] bg-[#E95EA1] blur-[150px]"></div>
                <div className="absolute w-[361px] h-[270px] right-[270px] top-[420px] bg-[#348DCE] blur-[150px]"></div>
                <div className="absolute w-[277px] h-[255px] left-[43px] top-[910px] bg-[#6ECE34] blur-[150px]"></div>
                <div className="absolute w-[277px] h-[255px] left-[653px] top-[1490px] bg-[#8D8D8D] blur-[150px]"></div>
                <div className="absolute w-[365px] h-[480px] right-[100px] top-[1800px] bg-[#E95EA1] blur-[150px]"></div>
                <div className="absolute w-[365px] h-[480px] left-[100px] top-[2400px] bg-[#348DCE] blur-[150px]"></div>
            </div>
            <div className="relative z-[1]">
                {children}
            </div>
        </div>

    )
}