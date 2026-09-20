import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";

// ========================================
// DEFAULT 7-DAY COLORS
// ========================================

const DAY_COLORS = [
  "#F94144",
  "#F3722C",
  "#F8961E",
  "#F9C74F",
  "#90BE6D",
  "#43AA8B",
  "#577590",
];

export default function ExpenseChart({
  data = [],

  chartType,

  showPersonal,
  showTeam,

  personalColor,
  teamColor,

  personalColorCustomized,

  showValues,
  valueMode,
}) {
  // ========================================
  // TOTAL
  // ========================================

  const personalTotal = data.reduce(
    (sum, item) => sum + Number(item.personal || 0),
    0,
  );

  const teamTotal = data.reduce((sum, item) => sum + Number(item.team || 0), 0);

  // ========================================
  // Y SCALE
  // ========================================

  const allValues = data.flatMap((item) => {
    const values = [];

    if (showPersonal && item.personal !== null) {
      values.push(Number(item.personal || 0));
    }

    if (showTeam && item.team !== null) {
      values.push(Number(item.team || 0));
    }

    return values;
  });

  const maxValue = Math.max(...allValues, 0);

  const suggestedMax = maxValue * 1.2;

  const yMax = Math.ceil(suggestedMax / 500) * 500 || 500;

  // ========================================
  // FORMAT VALUE
  // ========================================

  const formatValue = (value, type) => {
    if (value === null || value === undefined) {
      return "";
    }

    if (valueMode === "currency") {
      return `฿${Number(value).toLocaleString()}`;
    }

    const total = type === "personal" ? personalTotal : teamTotal;

    if (!total) {
      return "0%";
    }

    return `${((Number(value) / total) * 100).toFixed(0)}%`;
  };

  // ========================================
  // PIE
  // ========================================

  if (chartType === "pie") {
    return (
      <PieExpenseChart
        data={data}
        showPersonal={showPersonal}
        showTeam={showTeam}
        personalColor={personalColor}
        teamColor={teamColor}
        personalColorCustomized={personalColorCustomized}
        showValues={showValues}
        formatValue={formatValue}
      />
    );
  }

  // ========================================
  // LINE
  // ========================================

  if (chartType === "line") {
    return (
      <div className="relative">
        <AxisTitleY />

        <ResponsiveContainer width="100%" height={380}>
          <LineChart
            data={data}
            margin={{
              top: 35,
              right: 25,
              bottom: 35,
              left: 20,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#2C2C2E"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              stroke="#A0A0A0"
              tickLine={false}
              axisLine={{
                stroke: "#52525B",
              }}
            />

            <YAxis
              stroke="#A0A0A0"
              tickLine={false}
              domain={[0, yMax]}
              tickFormatter={(value) => Number(value).toLocaleString()}
              axisLine={{
                stroke: "#52525B",
              }}
            />

            <Tooltip
              contentStyle={{
                background: "#1C1C1E",

                border: "1px solid #2C2C2E",

                borderRadius: "12px",
              }}
              formatter={(value, name) => [
                `฿${Number(value).toLocaleString()}`,

                name,
              ]}
            />

            {showPersonal && showTeam && <Legend />}

            {/* MY EXPENSE */}

            {showPersonal && (
              <Line
                name="My Expense"
                type="monotone"
                dataKey="personal"
                stroke={personalColor}
                strokeWidth={3}
                connectNulls={false}
                dot={{
                  r: 5,
                  fill: personalColor,
                }}
                activeDot={{
                  r: 7,
                }}
              >
                {showValues && (
                  <LabelList
                    dataKey="personal"
                    position="top"
                    formatter={(value) => formatValue(value, "personal")}
                  />
                )}
              </Line>
            )}

            {/* TEAM EXPENSE */}

            {showTeam && (
              <Line
                name="Team Expense"
                type="monotone"
                dataKey="team"
                stroke={teamColor}
                strokeWidth={3}
                connectNulls={false}
                dot={{
                  r: 5,
                  fill: teamColor,
                }}
                activeDot={{
                  r: 7,
                }}
              >
                {showValues && (
                  <LabelList
                    dataKey="team"
                    position="top"
                    formatter={(value) => formatValue(value, "team")}
                  />
                )}
              </Line>
            )}
          </LineChart>
        </ResponsiveContainer>

        
      </div>
    );
  }

  // ========================================
  // BAR
  // ========================================

  return (
    <div className="relative">
      <AxisTitleY />

      <ResponsiveContainer width="100%" height={380}>
        <BarChart
          data={data}
          margin={{
            top: 35,
            right: 25,
            bottom: 35,
            left: 20,
          }}
          barGap={8}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#2C2C2E"
            vertical={false}
          />

          <XAxis
            dataKey="label"
            stroke="#A0A0A0"
            tickLine={false}
            axisLine={{
              stroke: "#52525B",
            }}
          />

          <YAxis
            stroke="#A0A0A0"
            domain={[0, yMax]}
            tickLine={false}
            tickFormatter={(value) => Number(value).toLocaleString()}
            axisLine={{
              stroke: "#52525B",
            }}
          />

          <Tooltip
            cursor={{
              fill: "rgba(255,255,255,0.04)",
            }}
            contentStyle={{
              background: "#1C1C1E",

              border: "1px solid #2C2C2E",

              borderRadius: "12px",
            }}
            formatter={(value, name) => [
              `฿${Number(value).toLocaleString()}`,

              name,
            ]}
          />

          {/* ========================================
              LEGEND
          ========================================= */}

          {showPersonal && showTeam && <Legend />}

          {/* ========================================
              MY EXPENSE BAR
          ========================================= */}

          {showPersonal && (
            <Bar
              name="My Expense"
              dataKey="personal"
              fill={personalColor}
              radius={[7, 7, 0, 0]}
            >
              {/* ========================================
                  DEFAULT 7 COLORS

                  ใช้เมื่อ:
                  - มี My Expense อย่างเดียว
                  - User ยังไม่เคย Set สี
              ========================================= */}

              {!showTeam &&
                !personalColorCustomized &&
                data.map((entry, index) => (
                  <Cell
                    key={entry.date}
                    fill={DAY_COLORS[index % DAY_COLORS.length]}
                  />
                ))}

              {/* VALUES */}

              {showValues && (
                <LabelList
                  dataKey="personal"
                  position="top"
                  formatter={(value) => formatValue(value, "personal")}
                />
              )}
            </Bar>
          )}

          {/* ========================================
              TEAM EXPENSE BAR
          ========================================= */}

          {showTeam && (
            <Bar
              name="Team Expense"
              dataKey="team"
              fill={teamColor}
              radius={[7, 7, 0, 0]}
            >
              {showValues && (
                <LabelList
                  dataKey="team"
                  position="top"
                  formatter={(value) => formatValue(value, "team")}
                />
              )}
            </Bar>
          )}
        </BarChart>
      </ResponsiveContainer>

      
    </div>
  );
}

// ========================================
// Y LABEL
// ========================================

function AxisTitleY() {
  return (
    <div
      className="
        absolute

        left-2
        top-0

        z-10

        text-xs
        sm:text-sm

        font-medium

        text-[#A0A0A0]

        pointer-events-none
      "
    >
      Amount spent per day (฿/Day)
    </div>
  );
}


// ========================================
// PIE
// ========================================

function PieExpenseChart({
  data,

  showPersonal,
  showTeam,

  personalColor,
  teamColor,

  personalColorCustomized,

  showValues,

  formatValue,
}) {
  const charts = [];

  if (showPersonal) {
    charts.push({
      key: "personal",
      title: "My Expense",
      color: personalColor,
    });
  }

  if (showTeam) {
    charts.push({
      key: "team",
      title: "Team Expense",
      color: teamColor,
    });
  }

  return (
    <div
      className={`
        grid
        gap-5

        ${charts.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}
      `}
    >
      {charts.map((chart) => (
        <div
          key={chart.key}
          className="
              h-[350px]
            "
        >
          <p
            className="
                text-center

                text-sm
                font-semibold

                mb-2
              "
          >
            {chart.title}
          </p>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  background: "#1C1C1E",

                  border: "1px solid #2C2C2E",

                  borderRadius: "12px",
                }}
                formatter={(value) => `฿${Number(value).toLocaleString()}`}
              />

              <Pie
                data={data}
                dataKey={chart.key}
                nameKey="label"
                cx="50%"
                cy="47%"
                outerRadius={105}
                label={
                  showValues
                    ? ({ value }) => formatValue(value, chart.key)
                    : false
                }
              >
                {data.map((entry, index) => {
                  /*
                        Personal Pie อย่างเดียว

                        ถ้าไม่ได้ Customize
                        → 7 สี

                        ถ้า Customize
                        → สี User
                      */

                  let fill = chart.color;

                  if (
                    chart.key === "personal" &&
                    !showTeam &&
                    !personalColorCustomized
                  ) {
                    fill = DAY_COLORS[index % DAY_COLORS.length];
                  }

                  return <Cell key={entry.date} fill={fill} />;
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}
