export default function ExpenseFilter({
  showPersonal,
  showTeam,
  onPersonalChange,
  onTeamChange,
}) {
  return (
    <div
      className="
        bg-[#1C1C1E]
        border
        border-[#2C2C2E]

        rounded-2xl

        px-5
        py-4

        h-full

        flex
        flex-col
        justify-center

        gap-3
      "
    >
      <p className="text-xs text-[#A0A0A0]">
        Display
      </p>

      <label
        className="
          flex
          items-center
          gap-3

          cursor-pointer
          select-none
        "
      >
        <input
          type="checkbox"
          checked={showPersonal}
          onChange={(e) =>
            onPersonalChange(
              e.target.checked
            )
          }
          className="
            checkbox
            checkbox-warning
            checkbox-sm
          "
        />

        <span className="text-sm">
          My Expense
        </span>
      </label>

      <label
        className="
          flex
          items-center
          gap-3

          cursor-pointer
          select-none
        "
      >
        <input
          type="checkbox"
          checked={showTeam}
          onChange={(e) =>
            onTeamChange(
              e.target.checked
            )
          }
          className="
            checkbox
            checkbox-warning
            checkbox-sm
          "
        />

        <span className="text-sm">
          Team Expense
        </span>
      </label>
    </div>
  );
}