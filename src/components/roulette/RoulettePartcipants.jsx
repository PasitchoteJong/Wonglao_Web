const RouletteParticipants = ({
    members = [],
    isOwner,
    onEligibilityChange
}) => {

    const sortedMembers = [
        ...members.filter(
            (member) =>
                member.RouletteEligible
        ),

        ...members.filter(
            (member) =>
                !member.RouletteEligible
        )
    ];

    return (
        <div className="card bg-base-200 shadow">

            <div className="card-body">

                <h2 className="card-title">
                    Participants
                </h2>

                <div className="space-y-2">

                    {sortedMembers.map(
                        (member) => {

                            const eligible =
                                member.RouletteEligible;

                            return (
                                <div
                                    key={member.Id}
                                    className={`
                                        flex
                                        items-center
                                        justify-between
                                        p-3
                                        rounded-lg
                                        bg-base-100
                                        transition-all
                                        ${
                                            !eligible
                                                ? "opacity-40"
                                                : ""
                                        }
                                    `}
                                >

                                    <div className="
                                        flex
                                        items-center
                                        gap-3
                                    ">

                                        <div className="
                                            w-10
                                            h-10
                                            rounded-full
                                            bg-neutral
                                            text-neutral-content
                                            flex
                                            items-center
                                            justify-center
                                            font-bold
                                        ">
                                            {member.DisplayName
                                                ?.charAt(0)
                                                ?.toUpperCase()}
                                        </div>

                                        <span>
                                            {
                                                member.DisplayName
                                            }
                                        </span>

                                    </div>

                                    <input
                                        type="checkbox"
                                        className="
                                            checkbox
                                            checkbox-primary
                                        "
                                        checked={
                                            eligible
                                        }
                                        disabled={
                                            !isOwner
                                        }
                                        onChange={(e) =>
                                            onEligibilityChange(
                                                member.Id,
                                                e.target.checked
                                            )
                                        }
                                    />

                                </div>
                            );
                        }
                    )}

                </div>

            </div>

        </div>
    );
};

export default RouletteParticipants;