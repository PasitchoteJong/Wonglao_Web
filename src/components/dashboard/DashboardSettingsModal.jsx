export default function DashboardSettingsModal({
  open,
  onClose,

  chartType,
  setChartType,

  personalColor,
  setPersonalColor,

  personalColorCustomized,
  onResetPersonalColor,

  teamColor,
  setTeamColor,

  showValues,
  setShowValues,

  valueMode,
  setValueMode,
}) {

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0

        z-[100]

        bg-black/70
        backdrop-blur-sm

        flex
        items-center
        justify-center

        p-4
      "
      onClick={
        onClose
      }
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className="
          bg-[#1C1C1E]

          border
          border-[#2C2C2E]

          rounded-3xl

          w-full
          max-w-lg

          p-6

          max-h-[90vh]
          overflow-y-auto
        "
      >

        {/* ========================================
            HEADER
        ========================================= */}

        <div
          className="
            flex
            justify-between
            items-center
          "
        >
          <div>
            <h2
              className="
                text-xl
                font-bold
              "
            >
              Chart Settings
            </h2>

            <p
              className="
                text-sm
                text-[#A0A0A0]
                mt-1
              "
            >
              Customize your expense chart
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="
              w-10
              h-10

              rounded-xl

              bg-[#2C2C2E]

              hover:text-[#F8B500]
              hover:scale-105

              active:scale-95

              transition-all
            "
          >
            ✕
          </button>
        </div>


        {/* ========================================
            CHART TYPE
        ========================================= */}

        <div className="mt-7">

          <p
            className="
              font-semibold
              mb-3
            "
          >
            Chart Type
          </p>

          <div
            className="
              grid
              grid-cols-3
              gap-3
            "
          >

            <ChartTypeButton
              title="Bar"

              active={
                chartType ===
                "bar"
              }

              onClick={() =>
                setChartType(
                  "bar"
                )
              }
            >
              <BarPreview />
            </ChartTypeButton>


            <ChartTypeButton
              title="Line"

              active={
                chartType ===
                "line"
              }

              onClick={() =>
                setChartType(
                  "line"
                )
              }
            >
              <LinePreview />
            </ChartTypeButton>


            <ChartTypeButton
              title="Pie"

              active={
                chartType ===
                "pie"
              }

              onClick={() =>
                setChartType(
                  "pie"
                )
              }
            >
              <PiePreview />
            </ChartTypeButton>

          </div>
        </div>


        {/* ========================================
            COLORS
        ========================================= */}

        <div className="mt-7">

          <div
            className="
              flex
              justify-between
              items-center

              mb-3
            "
          >
            <p className="font-semibold">
              Chart Colors
            </p>

            {!personalColorCustomized && (
              <span
                className="
                  text-xs
                  text-[#F8B500]
                "
              >
                7-Day Colors
              </span>
            )}
          </div>


          <div className="space-y-3">

            {/* MY EXPENSE COLOR */}

            <ColorSetting
              label="My Expense"

              value={
                personalColor
              }

              onChange={
                setPersonalColor
              }
            />


            {/* TEAM COLOR */}

            <ColorSetting
              label="Team Expense"

              value={
                teamColor
              }

              onChange={
                setTeamColor
              }
            />

          </div>


          {/* ========================================
              RESET MY EXPENSE COLORS
          ========================================= */}

          <button
            type="button"

            onClick={
              onResetPersonalColor
            }

            className="
              w-full

              mt-4

              px-4
              py-3

              rounded-xl

              border
              border-[#3A3A3C]

              bg-[#252527]

              text-sm
              font-semibold

              text-[#A0A0A0]

              transition-all
              duration-200

              hover:border-[#F8B500]
              hover:text-[#F8B500]

              hover:scale-[1.01]

              active:scale-[0.98]
            "
          >
            Reset to 7-Day Colors
          </button>


          {!personalColorCustomized && (
            <p
              className="
                text-xs
                text-[#A0A0A0]

                text-center

                mt-2
              "
            >
              My Expense uses a different color for each day
            </p>
          )}

        </div>


        {/* ========================================
            SHOW VALUES
        ========================================= */}

        <div
          className="
            mt-7

            flex
            justify-between
            items-center
          "
        >
          <div>

            <p className="font-semibold">
              Show Values
            </p>

            <p
              className="
                text-xs
                text-[#A0A0A0]
                mt-1
              "
            >
              Display values on the chart
            </p>

          </div>

          <input
            type="checkbox"

            className="
              toggle
              toggle-warning
            "

            checked={
              showValues
            }

            onChange={(e) =>
              setShowValues(
                e.target.checked
              )
            }
          />

        </div>


        {/* ========================================
            VALUE FORMAT
        ========================================= */}

        {showValues && (
          <div className="mt-6">

            <p
              className="
                font-semibold
                mb-3
              "
            >
              Value Format
            </p>

            <div
              className="
                grid
                grid-cols-2
                gap-3
              "
            >

              <button
                type="button"

                onClick={() =>
                  setValueMode(
                    "currency"
                  )
                }

                className={`
                  p-3

                  rounded-xl

                  border

                  transition-all

                  ${
                    valueMode ===
                    "currency"

                      ? `
                        border-[#F8B500]
                        bg-[#F8B500]/10
                        text-[#F8B500]
                      `

                      : `
                        border-[#2C2C2E]
                        bg-[#2C2C2E]
                      `
                  }
                `}
              >
                ฿ Currency
              </button>


              <button
                type="button"

                onClick={() =>
                  setValueMode(
                    "percent"
                  )
                }

                className={`
                  p-3

                  rounded-xl

                  border

                  transition-all

                  ${
                    valueMode ===
                    "percent"

                      ? `
                        border-[#F8B500]
                        bg-[#F8B500]/10
                        text-[#F8B500]
                      `

                      : `
                        border-[#2C2C2E]
                        bg-[#2C2C2E]
                      `
                  }
                `}
              >
                % Percentage
              </button>

            </div>

          </div>
        )}


        {/* ========================================
            SAVE
        ========================================= */}

        <button
          type="button"

          onClick={
            onClose
          }

          className="
            btn

            w-full

            mt-8

            bg-[#F8B500]
            hover:bg-[#E0A300]

            border-none

            text-black
            font-bold

            rounded-xl
          "
        >
          Save Settings
        </button>

      </div>
    </div>
  );
}


// ========================================
// CHART TYPE BUTTON
// ========================================

function ChartTypeButton({
  title,
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"

      onClick={
        onClick
      }

      className={`
        rounded-2xl

        border

        p-3

        transition-all

        hover:scale-105

        ${
          active

            ? `
              border-[#F8B500]
              bg-[#F8B500]/10
              text-[#F8B500]
            `

            : `
              border-[#2C2C2E]
              bg-[#252527]
              text-[#A0A0A0]
            `
        }
      `}
    >

      <div className="h-16">
        {children}
      </div>

      <p
        className="
          text-sm
          mt-2
        "
      >
        {title}
      </p>

    </button>
  );
}


// ========================================
// COLOR SETTING
// ========================================

function ColorSetting({
  label,
  value,
  onChange,
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between

        bg-[#252527]

        rounded-xl

        p-3
      "
    >
      <span className="text-sm">
        {label}
      </span>

      <input
        type="color"

        value={
          value
        }

        onChange={(e) =>
          onChange(
            e.target.value
          )
        }

        className="
          w-10
          h-10

          bg-transparent

          border-none

          cursor-pointer
        "
      />
    </div>
  );
}


// ========================================
// BAR PREVIEW
// ========================================

function BarPreview() {
  return (
    <svg
      viewBox="0 0 100 60"
      className="w-full h-full"
    >
      <rect
        x="12"
        y="30"
        width="12"
        height="25"
        fill="currentColor"
      />

      <rect
        x="34"
        y="18"
        width="12"
        height="37"
        fill="currentColor"
      />

      <rect
        x="56"
        y="8"
        width="12"
        height="47"
        fill="currentColor"
      />

      <rect
        x="78"
        y="24"
        width="12"
        height="31"
        fill="currentColor"
      />
    </svg>
  );
}


// ========================================
// LINE PREVIEW
// ========================================

function LinePreview() {
  return (
    <svg
      viewBox="0 0 100 60"
      className="w-full h-full"
    >
      <polyline
        points="
          5,48
          27,30
          48,38
          70,12
          95,22
        "

        fill="none"

        stroke="currentColor"

        strokeWidth="5"

        strokeLinecap="round"

        strokeLinejoin="round"
      />
    </svg>
  );
}


// ========================================
// PIE PREVIEW
// ========================================

function PiePreview() {
  return (
    <svg
      viewBox="0 0 100 60"
      className="w-full h-full"
    >
      <circle
        cx="50"
        cy="30"
        r="23"

        fill="none"

        stroke="currentColor"

        strokeWidth="13"

        strokeDasharray="
          85 60
        "
      />
    </svg>
  );
}