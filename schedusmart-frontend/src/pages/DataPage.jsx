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

const uData = [4000, 3000, 2000, 2780];
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

  const [noEvents, setNoEvents] = useState(false);

  const [eventTypeData, setEventTypeData] = useState([0, 0, 0, 0]);
  const [eventTypeAvg, setEventTypeAvg] = useState([0, 0, 0, 0]);

  // when time filter is updated, get new data
  useEffect(() => {
    const getEventData = async () => {
      const response = await fetch(flaskURL + "/get_user_events_data", {
        method: "POST",
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
            //console.log("Event data retrieved successfully");
            const eventDataResponse = await response.json();
            const numEvents = eventDataResponse["num_events"];
            if (numEvents === 0) {
              setNoEvents(true);
              return;
            }
            const eventTypes = eventDataResponse["event_types"];
            const eventAvgs = eventDataResponse["average_lengths"];
            setEventTypeData([
              eventTypes["event"].length,
              eventTypes["availability"].length,
              eventTypes["course"].length,
              eventTypes["break"].length,
            ]);
            setEventTypeAvg([
              eventAvgs["event"],
              eventAvgs["availability"],
              eventAvgs["course"],
              eventAvgs["break"],
            ]);
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
      <Container component="main" maxWidth="lg" style={{ marginLeft: "0px" }}>
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
        {noEvents && (
          <Typography
            component="h1"
            variant="h5"
            style={{ marginBottom: "20px", marginTop: "20px" }}
          >
            No events found
          </Typography>
        )}
        {!noEvents && (
          <Box sx={{ minWidth: 120, maxWidth: 500 }}>
            <Typography
              component="h2"
              variant="h5"
              style={{ marginBottom: "20px", marginTop: "20px" }}
            >
              Event Type Distribution
            </Typography>
            <BarChart
              width={500}
              height={300}
              colors={[orange[500], orange[200]]}
              series={[
                {
                  data: eventTypeData,
                  label: "Number of Events",
                  id: "eventTypeId",

                  yAxisKey: "leftAxisId",
                },
                {
                  data: eventTypeAvg,
                  label: "Average Length (minutes)",
                  id: "avgTypeId",

                  yAxisKey: "rightAxisId",
                },
              ]}
              xAxis={[
                {
                  data: ["Event", "Availability", "Course", "Break"],
                  scaleType: "band",
                },
              ]}
              yAxis={[{ id: "leftAxisId" }, { id: "rightAxisId" }]}
              rightAxis="rightAxisId"
            />
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}
