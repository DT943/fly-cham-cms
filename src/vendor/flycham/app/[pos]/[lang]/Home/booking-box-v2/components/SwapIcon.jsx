import React, { useState } from "react";
import { ArrowsDownUp, ArrowsLeftRight } from "@phosphor-icons/react";

const SwapIcon = ({ isMobile }) => {
    //   const [hovered, setHovered] = useState(false);

    return (
        <div
            className="w-12 h-12 rounded-full bg-white hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center cursor-pointer"
        //   onMouseEnter={() => setHovered(true)}
        //   onMouseLeave={() => setHovered(false)}
        >
            {isMobile ? <ArrowsDownUp
                weight="regular"
                size={20}
                className="text-[#1E1E1E]"
            /> : <ArrowsLeftRight
                weight="regular"
                size={20}
                className="text-[#1E1E1E]"
            />
            }

        </div>
    );
};

export default SwapIcon;
