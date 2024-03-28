import React, { useState, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { LineChart } from "@mui/x-charts/LineChart";

const CheckboxList = ({ columns, habits }) => {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [totalValues, setTotalValues] = useState({});

  useEffect(() => {
    updateChartData();
    calculateTotals();
  }, [selectedColumns, habits]);

  const handleCheckboxChange = (columnName) => {
    if (selectedColumns.includes(columnName)) {
      setSelectedColumns(selectedColumns.filter((col) => col !== columnName));
    } else {
      setSelectedColumns([...selectedColumns, columnName]);
    }
  };

  const updateChartData = () => {
    if (!habits) return;

    const data = habits.map((habit) => {
      const habitData = {};
      selectedColumns.forEach((column) => {
        habitData[column] = parseFloat(habit[column]);
      });
      return habitData;
    });

    setChartData(data);
  };

  const calculateTotals = () => {
    if (!habits) return;

    const totals = {};
    selectedColumns.forEach((column) => {
      const total = habits.reduce((accumulator, habit) => {
        return accumulator + parseFloat(habit[column]);
      }, 0);
      totals[column] = total;
    });

    setTotalValues(totals);
  };

  const getUnitForColumn = (column) => {
    // return context-dependent units for each selected variable
    const units = {
      calories: "kcal",
      carbs: "g",
      fat: "g",
      protein: "g",
      sodium: "mg",
      sugar: "g",
    };
    return units[column] || "";
  }

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "75%", marginRight: "20px" }}>
        {chartData.length > 0 && (
          <LineChart
            data={chartData}
            xAxis={[
              {
                scaleType: "point",
                data: habits.map((habit) => habit.itemName),
              },
            ]}
            series={selectedColumns.map((column) => ({
              data: chartData.map((habit) => habit[column]),
              label: column,
            }))}
            width={900}
            height={500}
          />
        )}
      </div>
      <div style={{ width: "25%" }}>
        <div>
          {selectedColumns.map((column) => (
            <h3 key={column}>
              Total {column}: {totalValues[column]} {'(' + getUnitForColumn(column) + ')'}
            </h3>
          ))}
        </div>
        <FormGroup>
          {columns.map(
            (column) =>
              column.field !== "itemName" && (
                <FormControlLabel
                  key={column.field}
                  control={
                    <Checkbox
                      checked={selectedColumns.includes(column.field)}
                      onChange={() => handleCheckboxChange(column.field)}
                    />
                  }
                  label={column.headerName}
                />
              ),
          )}
        </FormGroup>
      </div>
    </div>
  );
};

export default CheckboxList;
