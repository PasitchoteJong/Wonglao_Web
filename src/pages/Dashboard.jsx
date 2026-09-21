import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ExpenseChart from "../components/dashboard/ExpenseChart.jsx";
import ExpenseFilter from "../components/dashboard/ExpenseFilter.jsx";
import DashboardSettingsModal from "../components/dashboard/DashboardSettingsModal.jsx";

import LeftWeekArrowIcon from "../components/icons/LeftWeekArrowIcon.jsx";
import RightWeekArrowIcon from "../components/icons/RightWeekArrowIcon.jsx";

import {
  addDays,
  addWeeks,
  DAY_SHORT,
  formatWeekRange,
  isCurrentWeek,
  startOfWeekSunday,
} from "../utils/dashboardDate.js";

export default function Dashboard() {
  const navigate = useNavigate();

  // ========================================
  // WEEK
  // ========================================

  const [weekStart, setWeekStart] = useState(() =>
    startOfWeekSunday(new Date())
  );

  // ========================================
  // FILTER
  // ========================================

  const [showPersonal, setShowPersonal] = useState(true);
  const [showTeam, setShowTeam] = useState(false);

  // ========================================
  // SETTINGS
  // ========================================

  const [settingsOpen, setSettingsOpen] =
    useState(false);

  const [chartType, setChartType] =
    useState("bar");

  const [personalColor, setPersonalColor] =
    useState("#F8B500");

  const [teamColor, setTeamColor] =
    useState("#3B82F6");

  /*
    false
    = My Expense กราฟเดียวใช้สี 7 วัน

    true
    = User เคยเลือกสีเอง
      ให้ใช้ personalColor
  */

  const [
    personalColorCustomized,
    setPersonalColorCustomized,
  ] = useState(false);

  const [showValues, setShowValues] =
    useState(true);

  const [valueMode, setValueMode] =
    useState("currency");

  // ========================================
  // COLOR
  // ========================================

  const handlePersonalColorChange = (
    color
  ) => {
    setPersonalColor(color);

    setPersonalColorCustomized(true);
  };

  const handleResetPersonalColor = () => {
    setPersonalColor("#F8B500");

    setPersonalColorCustomized(false);
  };

  // ========================================
  // MOCK DATA
  // ========================================

  const data = useMemo(() => {
    const today = new Date();

    today.setHours(
      23,
      59,
      59,
      999
    );

    const days = [];

    for (
      let index = 0;
      index < 7;
      index++
    ) {
      const date = addDays(
        weekStart,
        index
      );

      /*
        สร้าง 7 วัน Sun - Sat เสมอ

        ถ้าวันนั้นยังมาไม่ถึง
        value = null

        Recharts จะยังแสดงช่องของวัน
        แต่จะไม่วาด Bar
      */

      const isFuture =
        date > today;

      const seed =
        date.getDate() +
        date.getMonth() * 31 +
        date.getFullYear();

      const personal =
        isFuture
          ? null
          : 100 +
            ((seed * 37) %
              900);

      const team =
        isFuture
          ? null
          : 200 +
            ((seed * 53) %
              1500);

      days.push({
        date:
          date.toISOString(),

        label: `${
          DAY_SHORT[
            date.getDay()
          ]
        } ${date.getDate()}`,

        personal,

        team,
      });
    }

    return days;
  }, [weekStart]);

  // ========================================
  // FILTER LOGIC
  // ========================================

  const handlePersonalChange = (
    checked
  ) => {
    /*
      ป้องกันไม่ให้ปิดทั้งคู่

      ถ้าต้องการให้ปิดได้หมด
      ค่อยเอา if นี้ออกภายหลัง
    */

    if (
      !checked &&
      !showTeam
    ) {
      return;
    }

    setShowPersonal(
      checked
    );
  };

  const handleTeamChange = (
    checked
  ) => {
    if (
      !checked &&
      !showPersonal
    ) {
      return;
    }

    setShowTeam(
      checked
    );
  };

  // ========================================
  // WEEK NAVIGATION
  // ========================================

  const handlePreviousWeek =
    () => {
      setWeekStart(
        (prev) =>
          addWeeks(
            prev,
            -1
          )
      );
    };

  const handleNextWeek =
    () => {
      setWeekStart(
        (prev) =>
          addWeeks(
            prev,
            1
          )
      );
    };

  // ========================================
  // SUMMARY
  // ========================================

  const personalTotal =
    data.reduce(
      (sum, item) =>
        sum +
        Number(
          item.personal || 0
        ),
      0
    );

  const teamTotal =
    data.reduce(
      (sum, item) =>
        sum +
        Number(
          item.team || 0
        ),
      0
    );

  return (
    <>
      <div
        className="
          min-h-screen

          bg-black
          text-white

          px-5
          py-7

          font-sans
        "
      >
        <div className="max-w-6xl mx-auto">

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
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <button
                type="button"
                onClick={() =>
                  navigate("/")
                }
                className="
                  w-11
                  h-11

                  rounded-xl

                  bg-[#1C1C1E]

                  border
                  border-[#2C2C2E]

                  flex
                  items-center
                  justify-center

                  text-xl

                  hover:border-[#F8B500]
                  hover:text-[#F8B500]
                  hover:scale-105

                  active:scale-95

                  transition-all
                "
              >
                ←
              </button>

              <div>
                <h1
                  className="
                    text-2xl
                    font-bold
                  "
                >
                  Dashboard
                </h1>

                <p
                  className="
                    text-sm
                    text-[#A0A0A0]
                  "
                >
                  Weekly Expenses
                </p>
              </div>
            </div>

            {/* SETTINGS */}

            <button
              type="button"
              onClick={() =>
                setSettingsOpen(
                  true
                )
              }
              className="
                w-11
                h-11

                rounded-xl

                bg-[#1C1C1E]

                border
                border-[#2C2C2E]

                flex
                items-center
                justify-center

                text-xl

                hover:border-[#F8B500]
                hover:text-[#F8B500]
                hover:scale-105

                active:scale-95

                transition-all
              "
            >
              ⚙
            </button>
          </div>

          {/* ========================================
              TOP CARDS
          ========================================= */}

          <div
            className="
              grid
              grid-cols-1

              md:grid-cols-[1fr_1fr_0.8fr]

              gap-4

              mt-7
            "
          >

            {/* COLUMN 1 : MY EXPENSE */}

            <div className="md:col-start-1">
              {showPersonal && (
                <SummaryCard
                  title="My Expense"
                  amount={
                    personalTotal
                  }
                  color={
                    personalColorCustomized
                      ? personalColor
                      : "#F8B500"
                  }
                />
              )}
            </div>


            {/* COLUMN 2 : TEAM EXPENSE */}

            <div className="md:col-start-2">
              {showTeam && (
                <SummaryCard
                  title="Team Expense"
                  amount={
                    teamTotal
                  }
                  color={
                    teamColor
                  }
                />
              )}
            </div>


            {/* COLUMN 3 : CHECKBOX */}

            <div className="md:col-start-3">
              <ExpenseFilter
                showPersonal={
                  showPersonal
                }
                showTeam={
                  showTeam
                }
                onPersonalChange={
                  handlePersonalChange
                }
                onTeamChange={
                  handleTeamChange
                }
              />
            </div>

          </div>

          {/* ========================================
              CHART CARD
          ========================================= */}

          <div
            className="
              relative

              mt-6

              bg-[#1C1C1E]

              border
              border-[#2C2C2E]

              rounded-3xl

              px-4
              sm:px-6
              md:px-8

              pt-6
              pb-6

              overflow-hidden
            "
          >

            {/* ========================================
                TITLE
            ========================================= */}

            <div
              className="
                relative
                mb-4
                min-h-[32px]
              "
            >

              {/* TITLE CENTER */}

              <h2
                className="
                  text-lg
                  sm:text-xl

                  font-bold
                  text-center

                  px-20
                "
              >
                Expenses (
                {formatWeekRange(
                  weekStart
                )}
                )
              </h2>


              {/* THIS WEEK */}

              {isCurrentWeek(
                weekStart
              ) && (
                <span
                  className="
                    absolute

                    right-0
                    top-1/2
                    -translate-y-1/2

                    px-3
                    py-1

                    rounded-full

                    bg-[#F8B500]/10
                    text-[#F8B500]

                    text-xs
                    font-semibold
                  "
                >
                  This Week
                </span>
              )}

            </div>

            {/* ========================================
                CHART AREA
            ========================================= */}

            <div
              className="
                relative

                px-7
                sm:px-12
              "
            >

              {/* LEFT WEEK BUTTON */}

              <button
                type="button"
                onClick={
                  handlePreviousWeek
                }
                aria-label="Previous week"
                className="
                  absolute

                  left-[-6px]
                  sm:left-0

                  top-1/2
                  -translate-y-1/2

                  z-20

                  text-[#A0A0A0]

                  transition-all
                  duration-200

                  hover:text-[#F8B500]
                  hover:scale-110

                  active:scale-95
                "
              >
                <LeftWeekArrowIcon
                  className="
                    w-9
                    h-9

                    sm:w-11
                    sm:h-11
                  "
                />
              </button>


              {/* ========================================
                  EXPENSE CHART
              ========================================= */}

              <ExpenseChart
                data={data}

                chartType={
                  chartType
                }

                showPersonal={
                  showPersonal
                }

                showTeam={
                  showTeam
                }

                personalColor={
                  personalColor
                }

                teamColor={
                  teamColor
                }

                personalColorCustomized={
                  personalColorCustomized
                }

                showValues={
                  showValues
                }

                valueMode={
                  valueMode
                }
              />


              {/* RIGHT WEEK BUTTON */}

              <button
                type="button"
                onClick={
                  handleNextWeek
                }
                aria-label="Next week"
                className="
                  absolute

                  right-[-6px]
                  sm:right-0

                  top-1/2
                  -translate-y-1/2

                  z-20

                  text-[#A0A0A0]

                  transition-all
                  duration-200

                  hover:text-[#F8B500]
                  hover:scale-110

                  active:scale-95
                "
              >
                <RightWeekArrowIcon
                  className="
                    w-9
                    h-9

                    sm:w-11
                    sm:h-11
                  "
                />
              </button>

            </div>

          </div>

        </div>
      </div>

      {/* ========================================
          SETTINGS MODAL
      ========================================= */}

      <DashboardSettingsModal
        open={
          settingsOpen
        }

        onClose={() =>
          setSettingsOpen(
            false
          )
        }

        chartType={
          chartType
        }

        setChartType={
          setChartType
        }

        personalColor={
          personalColor
        }

        setPersonalColor={
          handlePersonalColorChange
        }

        personalColorCustomized={
          personalColorCustomized
        }

        onResetPersonalColor={
          handleResetPersonalColor
        }

        teamColor={
          teamColor
        }

        setTeamColor={
          setTeamColor
        }

        showValues={
          showValues
        }

        setShowValues={
          setShowValues
        }

        valueMode={
          valueMode
        }

        setValueMode={
          setValueMode
        }
      />
    </>
  );
}


// ========================================
// SUMMARY CARD
// ========================================

function SummaryCard({
  title,
  amount,
  color,
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

        transition-all
        duration-200

        hover:-translate-y-1
        hover:scale-[1.02]

        hover:border-[#3A3A3C]
      "
    >
      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        <span
          className="
            w-3
            h-3

            rounded-full
          "
          style={{
            backgroundColor:
              color,
          }}
        />

        <p
          className="
            text-sm
            text-[#A0A0A0]
          "
        >
          {title}
        </p>
      </div>

      <p
        className="
          text-2xl
          sm:text-3xl

          font-bold

          mt-3
        "
      >
        ฿
        {Number(
          amount
        ).toLocaleString(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        )}
      </p>
    </div>
  );
}