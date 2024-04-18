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
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import { Gauge } from "@mui/x-charts/Gauge";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { BarChart } from "@mui/x-charts/BarChart";
import Dashboard from "./Dashboard";
import languageLibrary from "../components/language.json";
import send_request from "./requester.jsx";
import { red, orange, yellow, green, blue, purple, pink } from "@mui/material/colors";
import { useLocation } from 'react-router-dom';


const Colors = [
  { id: 0, value: { primary: red[500], secondary: red[400] }, label: "Red" },
  { id: 1, value: { primary: orange[300], secondary: orange[200] }, label: "Orange" },
  { id: 2, value: { primary: yellow[300], secondary: yellow[200] }, label: "Yellow" },
  { id: 3, value: { primary: green[200], secondary: green[100] }, label: "Green" },
  { id: 4, value: { primary: blue[200], secondary: blue[100] }, label: "Blue" },
  { id: 5, value: { primary: purple[200], secondary: purple[100] }, label: "Purple" },
  { id: 6, value: { primary: pink[200], secondary: pink[100] }, label: "Pink" },
];



// const theme = createTheme({
//   palette: {
//     primary: {
//       main: orange[500],
//     },
//     secondary: {
//       main: "#ab5600",
//     },
//   },
//   components: {
//     MuiBarChart: {
//       styleOverrides: {
//         root: {
//           backgroundColor: "gray",
//         },
//       },
//     },
//   },
// });



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
  const location = useLocation();
let Color;
if (location.state == null) {
  Color = localStorage.getItem('system_color');
}
else {
  Color = location.state.color_choice;
}
const theme = createTheme({
  palette: {
    primary: {
      main: Colors[Color].value.primary,
    },
    secondary: {
      main: Colors[Color].value.secondary,
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: "gray",
        },
      },
    },
  },
});
  const [timeFilter, setTimeFilter] = useState(0);
  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
  };

  const [noEvents, setNoEvents] = useState(false);

  const [eventTypeData, setEventTypeData] = useState([0, 0, 0, 0]);
  const [eventTypeAvg, setEventTypeAvg] = useState([0, 0, 0, 0]);

  const [busiestTime, setBusiestTime] = useState(0);
  const [language, setLanguage] = useState(0);

  const fetchInitializeData = async () => {
    let dataOfUser = await send_request("/user_data", {
      "user_id": user_id,
    });
    if (dataOfUser.language != undefined) {
      setLanguage(dataOfUser.language);
    }
  };
  const generateCSV = () => {
    const timeFilterOptions = [
      "All",
      "Past 7 Days",
      "Past 30 Days",
      "Past Year",
    ];
    const timeFilterFormatted = timeFilterOptions[timeFilter];

    const eventTypeLabels = ["Event", "Availability", "Course", "Break"];
    const eventTypeDataFormatted = eventTypeData
      .map((value, index) => ({
        label: eventTypeLabels[index],
        value: value,
      }))
      .map((obj) => `${obj.label}: ${obj.value}`);

    const eventTypeAvgFormatted = eventTypeAvg
      .map((value, index) => ({
        label: eventTypeLabels[index],
        value: value,
      }))
      .map((obj) => `${obj.label}: ${obj.value}`);

    const busiestTimeFormatted = `${Math.floor(busiestTime / 100)
      .toString()
      .padStart(2, "0")}:${(busiestTime % 100).toString().padStart(2, "0")}`;

    const csvData = [
      ["Time Filter", timeFilterFormatted],
      ["Event Type Data", ...eventTypeDataFormatted],
      ["Event Type Averages (min)", ...eventTypeAvgFormatted],
      ["Busiest Time", busiestTimeFormatted],
    ];
    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    try {
      saveAs(blob, "event-data.csv");
    } catch (error) {
      console.error("Error generating CSV:", error);
      alert("An error occurred while generating the CSV.");
    }
  };

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
            const busiestCount = eventDataResponse["busiest_count"];
            if (busiestCount > 0) {
              const busiestTime = parseInt(
                eventDataResponse["busiest_time"].replace(":", "")
              );
              setBusiestTime(busiestTime);
            }
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
    fetchInitializeData();
  }, [timeFilter]);
  let languageData = languageLibrary[language][0].dataPage;
  return (
    <ThemeProvider theme={theme}>
      <div>{Dashboard(language)}</div>
      <Container component="main" maxWidth="lg" style={{ marginLeft: "0px" }}>
        <Box sx={{ minWidth: 120, maxWidth: 300 }}>
          <Typography
            component="h1"
            variant="h5"
            style={{ marginBottom: "20px", marginTop: "20px" }}
          >
            {languageData.dataDashboard}
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel id="timeFilterLabel">{languageData.timePeriod}</InputLabel>
            <Select
              labelId="timeFilterLabel"
              id="timeFilterSelect"
              value={timeFilter}
              label="Time Filter"
              onChange={handleTimeFilterChange}
            >
              <MenuItem value={0}>{languageData.all}</MenuItem>
              <MenuItem value={7}>{languageData.past7Day}</MenuItem>
              <MenuItem value={30}>{languageData.past30Day}</MenuItem>
              <MenuItem value={365}>{languageData.pastYear}</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={generateCSV}>
            Export as CSV
          </Button>
        </Box>
        {noEvents && (
          <Typography
            component="h1"
            variant="h5"
            style={{ marginBottom: "20px", marginTop: "20px" }}
          >
            {languageData.noEventFound}
          </Typography>
        )}
        {!noEvents && (
          <Box sx={{ minWidth: 120, maxWidth: 500 }}>
            <Typography
              component="h2"
              variant="h5"
              style={{ marginBottom: "20px", marginTop: "20px" }}
            >
              {languageData.eventTypeDistribution}
            </Typography>
            <BarChart
              width={500}
              height={300}
              colors={[orange[500], orange[200]]}
              series={[
                {
                  data: eventTypeData,
                  label: languageData.numberOfEvent,
                  id: "eventTypeId",

                  yAxisKey: "leftAxisId",
                },
                {
                  data: eventTypeAvg,
                  label: languageData.averageLength,
                  id: "avgTypeId",

                  yAxisKey: "rightAxisId",
                },
              ]}
              xAxis={[
                {
                  data: [languageData.event, languageData.availability, languageData.course, languageData.break],
                  scaleType: "band",
                },
              ]}
              yAxis={[{ id: "leftAxisId" }, { id: "rightAxisId" }]}
              rightAxis="rightAxisId"
            />
            <Gauge
              width={250}
              height={200}
              value={busiestTime}
              valueMin={0}
              valueMax={2359}
              startAngle={-110}
              endAngle={110}
              text={languageData.businessTime + `${Math.floor(busiestTime / 100)
                .toString()
                .padStart(2, "0")}:${(busiestTime % 100)
                .toString()
                .padStart(2, "0")}`}
            />
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}
