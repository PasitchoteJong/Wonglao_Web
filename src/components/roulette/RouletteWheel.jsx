import { useEffect, useState } from "react";

const RouletteWheel = ({
    participants,
    winner,
    isSpinning,
    onFinish
}) => {

    const [rotation, setRotation] =
        useState(0);


    useEffect(() => {

        if (!winner || !isSpinning) {
            return;
        }

        /*
            ตรงนี้จะคำนวณว่า
            winner อยู่ Slice ไหน

            แล้วคำนวณองศาให้ Wheel
            หมุนไปหยุดตรง winner
        */

    }, [
        winner,
        isSpinning,
        participants
    ]);


    return (
        <div className="
            flex
            flex-col
            items-center
            justify-center
            gap-6
        ">

            <div className="relative">

                {/* Pointer */}

                <div className="
                    absolute
                    -top-4
                    left-1/2
                    -translate-x-1/2
                    z-20
                ">
                    ▼
                </div>


                {/* Wheel */}

                <div
                    className="
                        w-[350px]
                        h-[350px]
                        rounded-full
                        border-8
                        border-base-content
                        relative
                        overflow-hidden
                    "
                    style={{
                        transform:
                            `rotate(${rotation}deg)`,
                        transition:
                            isSpinning
                                ? "transform 5s cubic-bezier(0.15, 0.8, 0.25, 1)"
                                : "none"
                    }}
                >

                    {/* 
                        Dynamic Wheel
                        จะใส่ SVG Slice ตรงนี้
                    */}

                    <div className="
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                    ">

                        <div className="
                            w-24
                            h-24
                            rounded-full
                            bg-base-100
                            flex
                            items-center
                            justify-center
                            font-bold
                        ">
                            SPIN
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default RouletteWheel;