import React, { useState, useEffect } from "react";
import { flaskURL, user_id } from "../config";
import { ResponsiveChartContainer, BarPlot } from "@mui/x-charts";
import { saveAs } from "file-saver";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { orange } from "@mui/material/colors";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { BarChart } from "@mui/x-charts/BarChart";
import Dashboard from "./Dashboard";

const theme = createTheme({
  palette: {
    primary: {
      main: orange[500],
    },
    secondary: {
      main: "#ab5600",
    },
  },
  components: {
    MuiBarChart: {
      styleOverrides: {
        root: {
          backgroundColor: "gray",
        },
      },
    },
  },
});

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const xLabels = [
  "Page A",
  "Page B",
  "Page C",
  "Page D",
  "Page E",
  "Page F",
  "Page G",
];

export default function SimpleBarChart() {
  const [timeFilter, setTimeFilter] = useState(0);
  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
  };

  // when time filter is updated, get new data
  useEffect(() => {
    const getEventData = async () => {
      const response = await fetch(flaskURL + "/get_user_events_data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user_id, time_filter: timeFilter }),
        credentials: "include",
      });
      if (!response.ok) {
        alert("Something went wrong, refresh your website!");
        return;
      } else {
        switch (response.status) {
          case 201:
            console.log("Event data retrieved successfully");
            const eventDataResponse = await response.json();
            console.log(eventDataResponse);
            break;
          case 205:
            alert("Event Data not retrieved!");
            break;
          case 206:
            alert("Missing information!");
            break;
        }
      }
    };

    getEventData();
  }, [timeFilter]);

  return (
    <ThemeProvider theme={theme}>
      <div>{Dashboard()}</div>
      <Box sx={{ minWidth: 120, maxWidth: 300 }}>
        <Typography
          component="h1"
          variant="h5"
          style={{ marginBottom: "20px", marginTop: "20px" }}
        >
          Data Dashboard
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="timeFilterLabel">Time Period</InputLabel>
          <Select
            labelId="timeFilterLabel"
            id="timeFilterSelect"
            value={timeFilter}
            label="Time Filter"
            onChange={handleTimeFilterChange}
          >
            <MenuItem value={0}>All</MenuItem>
            <MenuItem value={7}>Past 7 Days</MenuItem>
            <MenuItem value={30}>Past 30 Days</MenuItem>
            <MenuItem value={365}>Past Year</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <BarChart
        width={500}
        height={300}
        series={[{ data: uData, label: "uv", id: "uvId" }]}
        xAxis={[{ data: xLabels, scaleType: "band" }]}
      />
    </ThemeProvider>
  );
}
