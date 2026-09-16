import { useEffect, useState } from "react";

const RouletteWheel = ({ participants = [], winner, isSpinning, onFinish }) => {
  const [rotation, setRotation] = useState(0);

  const participantCount = participants.length;

  useEffect(() => {
    if (!winner || !isSpinning) {
      return;
    }

    if (participantCount < 2) {
      return;
    }

    const winnerIndex = participants.findIndex(
      (participant) => participant.Id === winner.Id,
    );

    if (winnerIndex === -1) {
      console.error("Winner is not found in roulette participants", winner);
      return;
    }

    const sliceAngle = 360 / participantCount;

    // Calculate the center angle of the winner slice.
    const winnerAngle = winnerIndex * sliceAngle + sliceAngle / 2;

    // Get current rotation.
    const currentRotation = rotation % 360;

    // Move winner slice to the pointer at the top.
    const targetOffset = 360 - winnerAngle - currentRotation;

    // Add 5 full rotations before stopping.
    const extraRotation = 360 * 5;

    const targetRotation = rotation + extraRotation + targetOffset;

    setRotation(targetRotation);

    const timer = setTimeout(() => {
      onFinish();
    }, 5200);

    return () => {
      clearTimeout(timer);
    };
  }, [winner, isSpinning]);

  if (participantCount < 2) {
    return null;
  }

  const colors = [
    "#ff6384",
    "#36a2eb",
    "#ffcd56",
    "#4bc0c0",
    "#9966ff",
    "#ff9f40",
    "#66bb6a",
    "#ab47bc",
    "#ef5350",
    "#42a5f5",
  ];

  const sliceAngle = 360 / participantCount;

  const wheelGradient = participants
    .map((_, index) => {
      const start = index * sliceAngle;

      const end = (index + 1) * sliceAngle;

      const color = colors[index % colors.length];

      return `${color} ${start}deg ${end}deg`;
    })
    .join(", ");

  return (
    <div
      className="
                flex
                flex-col
                items-center
                justify-center
                gap-6
            "
    >
      <div
        className="
                    relative
                    w-[380px]
                    h-[380px]
                "
      >
        {/* Pointer */}

        <div
          className="
                        absolute
                        -top-5
                        left-1/2
                        -translate-x-1/2
                        z-30
                        text-3xl
                    "
        >
          ▼
        </div>

        {/* Rotating Wheel + Names */}

        <div
          className="
                        absolute
                        inset-0
                    "
          style={{
            transform: `rotate(${rotation}deg)`,

            transition: isSpinning
              ? "transform 5s cubic-bezier(0.15, 0.8, 0.25, 1)"
              : "none",
          }}
        >
          {/* Wheel */}

          <div
            className="
                            absolute
                            inset-0
                            rounded-full
                            border-8
                            border-base-content
                            shadow-xl
                        "
            style={{
              background: `conic-gradient(${wheelGradient})`,
            }}
          />

          {/* Participant Names */}

          <div
            className="
                            absolute
                            inset-0
                            z-10
                        "
          >
            {participants.map((participant, index) => {
              const angle = index * sliceAngle + sliceAngle / 2 - 90;

              const radius = 135;

              const x =
                50 + Math.cos((angle * Math.PI) / 180) * (radius / 190) * 50;

              const y =
                50 + Math.sin((angle * Math.PI) / 180) * (radius / 190) * 50;

              return (
                <div
                  key={participant.Id}
                  className="
                                            absolute
                                            -translate-x-1/2
                                            -translate-y-1/2
                                            max-w-[90px]
                                            text-center
                                        "
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                >
                  <span
                    className="
                                                block
                                                text-white
                                                font-bold
                                                text-sm
                                                leading-tight
                                                drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]
                                                break-words
                                            "
                  >
                    {participant.DisplayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center */}

        <div
          className="
                        absolute
                        left-1/2
                        top-1/2
                        -translate-x-1/2
                        -translate-y-1/2
                        z-20
                        w-24
                        h-24
                        rounded-full
                        bg-base-100
                        border-4
                        border-base-content
                        flex
                        items-center
                        justify-center
                        font-bold
                        shadow-lg
                    "
        >
          SPIN
        </div>
      </div>
    </div>
  );
};

export default RouletteWheel;
