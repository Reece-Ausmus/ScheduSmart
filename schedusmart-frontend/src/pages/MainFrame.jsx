import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { debounce } from "@mui/material/utils";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CheckBox, LaptopWindowsRounded } from "@material-ui/icons";
import Grid from "@mui/material/Grid";
import Joyride from "react-joyride";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Link, Navigate } from "react-router-dom";
import moment from "moment";
import { orange, grey } from "@mui/material/colors";
import parse from "autosuggest-highlight/parse";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useHotkeys } from "react-hotkeys-hook";
import { flaskURL, user_id } from "../config";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Weather from "./Weather";
import languageData from "../components/language.json";
import Timezone from "./Timezone";
import EmailForm from "../components/Email";
import Dashboard from "./Dashboard";
import Calendar from "./Calendar";
import send_request from "./requester";
import chatBox from "../components/ChatBox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import SetupCourses from "./SetupCourses";
import { GoogleMap, Marker } from "@react-google-maps/api";
// Google map
const GOOGLE_MAPS_API_KEY = "AIzaSyBE_-PEMobIdPsVtpmFOrTm7u-CAB9QGRM";
function loadScript(src, position, id) {
  if (!position) {
    return;
  }
  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}
const autocompleteService = { current: null };

const theme = createTheme({
  palette: {
    primary: orange,
    secondary: {
      main: "#ab5600",
    },
  },
});

const steps = [
  {
    target: "#calendar-button",
    content: "Navigate back to the calendar page here.",
    disableBeacon: true, // automate to start the tours
  },
  {
    target: "#change-calendar",
    content: "Update your calendar view here.",
  },
  {
    target: "#weather-container",
    content: "The current weather. Location can be changed in settings.",
  },
  {
    target: "#habits-button",
    content: "Track your calories and health here.",
  },
  {
    target: "#notes-button",
    content: "Keep track of your notes here.",
  },
  {
    target: "#task-manager",
    content: "Manage your assignments and tasks here.",
  },
  {
    target: "#profile-menu",
    content: "Access settings or sign out in your profile menu.",
  },
  {
    target: "#timezone-select",
    content: "Update your timezone here.",
  },
];

export default function MainFrame() {
  const [selectMode, setSelectMode] = useState(1);
  const [eventFilter, setEventFilter] = useState("all");
  const [selectedCalendars, setSelectedCalendars] = useState([]);
  const [calendarList, setCalendarList] = useState([]);

  const [goToTaskManager, setGoToTaskManager] = useState(false);
  const [allEventsArray, setAllEventsArray] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const today = new Date();

  useEffect(() => {
    const fetchInitializeData = async () => {
      let dataOfDefaultMode = await send_request("/get_calendar_default_mode", {
        user_id: user_id,
      });
      if (dataOfDefaultMode.type == undefined) dataOfDefaultMode.type = 1;
      let dataOfUser = await send_request("/user_data", {
        user_id: user_id,
      });
      setTaskList(dataOfUser.task_list);
      setSelectMode(dataOfDefaultMode.type);
      console.log("data", dataOfUser);
      if (dataOfUser.language != undefined) {
        setLanguage(dataOfUser.language);
      }
      const newCalendars = dataOfUser.calendars;
      const updatedCalendarList = [...calendarList];

      for (const calendarName in newCalendars) {
        const name = newCalendars[calendarName];
        if (calendarName === "Tasks") {
          sessionStorage.setItem("taskCalendarId", name["calendar_id"]);
        }
        updatedCalendarList.push({
          calendar_id: name["calendar_id"],
          name: calendarName,
        });
      }
      setCalendarList(updatedCalendarList);
    };

    fetchInitializeData();
  }, []);
  const [language, setLanguage] = useState(0);

  function CalendarList() {
    const [invitations, setInvitations] = useState([]);

    // add event consts
    const [events, setEvents] = useState([]);
    const [showEventPopup, setShowEventPopup] = useState(false);
    const [eventName, setEventName] = useState("");
    const [eventStartDate, setEventStartDate] = useState("");
    const [eventEndDate, setEventEndDate] = useState("");
    const [eventStartTime, setEventStartTime] = useState("");
    const [eventEndTime, setEventEndTime] = useState("");
    const [eventLocation, setEventLocation] = useState(null);
    const [eventConferencingLink, setEventConferencingLink] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventEmailInvitations, setEventEmailInvitations] = useState([]);
    const [eventType, setEventType] = useState("");
    const [eventRepetitionType, setEventRepetitionType] = useState("none");
    const [eventCustomFrequencyValue, setEventCustomFrequencyValue] =
      useState(1);
    const [eventCustomFrequencyUnit, setEventCustomFrequencyUnit] =
      useState("");
    const [eventSelectedDays, setEventSelectedDays] = useState([]); // Array to store selected days
    const [eventCalendar, setEventCalendar] = useState("");
    const [LocationSettings, setLocationSettings] = useState("text");
    useEffect(() => {
      const fetchDefaultsettings = async () => {
        let dataOfDefaultsettings = await send_request(
          "/get_location_default_settings",
          { user_id: user_id }
        );
        if (dataOfDefaultsettings.type == undefined) return;
        setLocationSettings(dataOfDefaultsettings.type);
      };
      fetchDefaultsettings();
    }, []);

    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);
    const loaded = useRef(false);
    const [showMap, setShowMap] = useState(false);
    const [showDetails, setDetails] = useState(null);
    const [marker, setMarker] = useState(null);
    const map = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&fields=geometry`;

    // const handleDetails = async (placeId) => {
    //   const response = await fetch(`https://maps.googleapis.com/maps/api/js?place_id=${placeId}&fields=geometry&key=${GOOGLE_MAPS_API_KEY}`);
    //   console.log(response);
    //   const data = await response.json();
    //   const location = data.result.geometry.location;
    //   const latitude = location.lat;
    //   const longitude = location.lng;
    //   console.log(latitude, longitude);
    // };

    const handleShowMap = () => {
      setShowMap(!showMap);
    };
    const PlaceId = 0;
    if (typeof window !== "undefined" && !loaded.current) {
      if (!document.querySelector("#google-maps")) {
        loadScript(map, document.querySelector("head"), "google-maps");
      }

      loaded.current = true;
    }
    const fetch = useMemo(
      () =>
        debounce((request, callback) => {
          if (autocompleteService.current) {
            try {
              autocompleteService.current.getPlacePredictions(
                request,
                callback
              );
            } catch (error) {}
          }
        }, 400),
      []
    );
    useEffect(() => {
      let active = true;

      if (!autocompleteService.current && window.google) {
        autocompleteService.current =
          new window.google.maps.places.AutocompleteService();
      }
      if (!autocompleteService.current) {
        return undefined;
      }

      if (inputValue === "") {
        setOptions(value ? [value] : []);
        return undefined;
      }

      fetch({ input: inputValue }, (results) => {
        if (active) {
          let newOptions = [];

          if (value) {
            newOptions = [value];
          }

          if (results) {
            newOptions = [...newOptions, ...results];
          }

          setOptions(newOptions);
        }
      });

      return () => {
        active = false;
      };
    }, [eventLocation, inputValue, fetch]);

    // const fetchPlaceDetails = (placeId) => {
    //   fetch(`https://maps.googleapis.com/maps/api/js?place_id=${placeId}&fields=geometry&key=${GOOGLE_MAPS_API_KEY}`)
    //     .then(response => response.json())
    //     .then(data => {
    //       const location = data.result.geometry.location;
    //       setDetails({ lat: location.lat, lng: location.lng });
    //     })
    //     .catch(error => {
    //       console.error('Error fetching place details:', error);
    //     });
    // };

    const renderLocationInput = () => {
      if (LocationSettings === "text") {
        return (
          <input
            type="text"
            id="eventLocation"
            value={eventLocation}
            onChange={handleEventLocationChange}
          />
        );
      } else if (LocationSettings === "map") {
        return (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Autocomplete
              id="google-map-demo"
              sx={{ width: 300 }}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.description
              }
              filterOptions={(x) => x}
              options={options}
              autoComplete
              size="small"
              includeInputInList
              filterSelectedOptions
              value={value}
              noOptionsText="No locations"
              onChange={(event, newValue) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
                setEventLocation(newValue.description);
                // handleDetails(newValue.place_id);
                console.log(newValue);
                // setSelectedLocation(newValue ? { lat: newValue.geometry.location.lat(), lng: newValue.geometry.location.lng() } : null);
              }}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Add a location" fullWidth />
              )}
              renderOption={(props, option) => {
                const matches =
                  option.structured_formatting.main_text_matched_substrings ||
                  [];

                const parts = parse(
                  option.structured_formatting.main_text,
                  matches.map((match) => [
                    match.offset,
                    match.offset + match.length,
                  ])
                );

                return (
                  <li {...props}>
                    <Grid container alignItems="center">
                      <Grid item sx={{ display: "flex", width: 44 }}>
                        <LocationOnIcon sx={{ color: "text.secondary" }} />
                      </Grid>
                      <Grid
                        item
                        sx={{
                          width: "calc(100% - 44px)",
                          wordWrap: "break-word",
                        }}
                      >
                        {parts.map((part, index) => (
                          <Box
                            key={index}
                            component="span"
                            sx={{
                              fontWeight: part.highlight ? "bold" : "regular",
                            }}
                          >
                            {part.text}
                          </Box>
                        ))}
                        <Typography variant="body2" color="text.secondary">
                          {option.structured_formatting.secondary_text}
                        </Typography>
                      </Grid>
                    </Grid>
                  </li>
                );
              }}
            />
            <Button
              variant="contained"
              style={{ marginLeft: "20px", height: "80%" }}
              onClick={handleShowMap}
            >
              map
            </Button>
            <Dialog
              open={showMap}
              onClose={() => setShowMap(false)}
              PaperProps={{
                style: {
                  width: "80%",
                  maxWidth: "800px",
                  height: "80%",
                  maxHeight: "500px",
                },
              }}
            >
              <DialogTitle>Map</DialogTitle>
              <DialogContent>
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "400px" }}
                  center={
                    showDetails
                      ? showDetails
                      : { lat: 40.42705717062981, lng: -86.91647096088887 }
                  }
                  zoom={15}
                ></GoogleMap>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowMap(false)}>Close</Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      }
    };

    // shortcut to control popup event
    useHotkeys("Shift+a", () => {
      toggleEventPopup();
    });

    const toggleEventPopup = () => {
      setShowEventPopup(!showEventPopup);
    };

    const handleEventNameChange = (e) => {
      setEventName(e.target.value);
    };

    const handleEventStartDateChange = (e) => {
      setEventStartDate(e.target.value);
    };

    const handleEventEndDateChange = (e) => {
      setEventEndDate(e.target.value);
    };

    const handleEventStartTimeChange = (e) => {
      setEventStartTime(e.target.value);
    };

    const handleEventEndTimeChange = (e) => {
      setEventEndTime(e.target.value);
    };

    const handleEventConferencingLinkChange = (e) => {
      setEventConferencingLink(e.target.value);
    };

    const handleEventLocationChange = (e) => {
      setEventLocation(e.target.value);
    };

    const handleEventDescriptionChange = (e) => {
      setEventDescription(e.target.value);
    };

    const handleEventEmailInvitationsChange = (e) => {
      setEventEmailInvitations(
        e.target.value.split(",").map((email) => email.trim())
      );
    };

    const handleEventRepetitionChange = (type) => {
      setEventRepetitionType(type);
    };

    const handleEventCustomFrequencyValueChange = (intVal) => {
      const value = parseInt(intVal.target.value, 10);
      setEventCustomFrequencyValue(value);
    };

    const handleEventCustomFrequencyUnitChange = (e) => {
      setEventCustomFrequencyUnit(e.target.value);
    };

    const handleEventCalendarChange = (e) => {
      setEventCalendar(e.target.value);
    };

    const handleEventDayToggle = (day) => {
      // Toggle the selected day
      setEventSelectedDays((prevDays) =>
        prevDays.includes(day)
          ? prevDays.filter((d) => d !== day)
          : [...prevDays, day]
      );
    };

    const handleCreateEventButton = () => {
      setEventName("");
      setEventStartDate("");
      setEventEndDate("");
      setEventStartTime("");
      setEventEndTime("");
      setEventConferencingLink("");
      setEventLocation("");
      setEventDescription("");
      setEventEmailInvitations([]);
      setEventType("event");
      setEventRepetitionType("none");
      setEventCustomFrequencyValue(1);
      setEventCustomFrequencyUnit("");
      setEventSelectedDays([]);
      setEventCalendar("");
      toggleEventPopup();
    };

    const handleCreateAvailabilityButton = () => {
      setEventName("");
      setEventStartDate("");
      setEventEndDate("");
      setEventStartTime("");
      setEventEndTime("");
      setEventConferencingLink("");
      setEventLocation("");
      setEventDescription("");
      setEventEmailInvitations([]);
      setEventType("availability");
      setEventRepetitionType("none");
      setEventCustomFrequencyValue(1);
      setEventCustomFrequencyUnit("");
      setEventSelectedDays([]);
      setEventCalendar(
        calendarList.find((cal) => cal.name === "Availability")?.calendar_id
      );
      toggleEventPopup();
    };

    const handleCreateEvent = async () => {
      const new_event = {
        name: eventName,
        desc: eventDescription,
        start_time: eventStartTime,
        end_time: eventEndTime,
        start_date: eventStartDate,
        end_date: eventEndDate,
        conferencing_link: eventConferencingLink,
        location: eventLocation,
        calendar: calendarList.find((cal) => cal.name === eventCalendar)
          ?.calendar_id,
        repetition_type: eventRepetitionType,
        repetition_unit: eventCustomFrequencyUnit,
        repetition_val: eventCustomFrequencyValue,
        selected_days: eventSelectedDays,
        user_id: user_id,
        emails: eventEmailInvitations,
        type: eventType,
      };

      const create_event_response = await send_request(
        "/create_event",
        new_event
      );
      if (create_event_response["error"] !== undefined) {
        alert(create_event_response["error"]);
      } else {
        console.log("Event created successfully");
        new_event["event_id"] = create_event_response["event_id"];
        setEvents([...events, new_event]);
      }

      setEventName("");
      setEventStartDate("");
      setEventEndDate("");
      setEventStartTime("");
      setEventEndTime("");
      setEventConferencingLink("");
      setEventLocation("");
      setEventDescription("");
      setEventEmailInvitations([]);
      setEventType("");
      setEventRepetitionType("none");
      setEventCustomFrequencyUnit("");
      setEventCustomFrequencyValue(1);
      setEventCalendar("");
      toggleEventPopup();
    };

    const addInvites = async (eid) => {
      const new_invite = {
        event_id: eid,
        emails: eventEmailInvitations,
        user_id: user_id,
      };
      const response = await send_request("/invite_users_to_event", new_invite);
      if (!response.ok) {
        alert("Something went wrong, refresh your website!");
        return;
      } else {
        switch (response.status) {
          case 201:
            console.log("Invitations added successfully");
            break;
          case 205:
            alert("Email invitations not sent!");
            break;
          case 206:
            alert("Missing information!");
            break;
        }
      }
    };

    const [showSeeInvitationsPopup, setShowSeeInvitationsPopup] =
      useState(false);

    const [invitationFilter, setInvitationFilter] = useState("all");

    const handleAcceptInvitation = async (invitation) => {
      const response = await fetch(flaskURL + "/accept_invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id,
          event_id: invitation.event_id,
        }),
        credentials: "include",
      });
      if (!response.ok) {
        alert("Something went wrong, refresh your website!");
        return;
      } else {
        switch (response.status) {
          case 201:
            console.log("Invitation accepted successfully");
            setInvitations((prevInvitations) =>
              prevInvitations.map((inv) =>
                inv.event_id === invitation.event_id
                  ? { ...inv, status: "accepted" }
                  : inv
              )
            );
            break;
          case 205:
            alert("Invitation not accepted!");
            break;
          case 206:
            alert("Missing information!");
            break;
        }
      }
    };

    const handleDeclineInvitation = async (invitation) => {
      const response = await fetch(flaskURL + "/decline_invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id,
          event_id: invitation.event_id,
        }),
        credentials: "include",
      });
      if (!response.ok) {
        alert("Something went wrong, refresh your website!");
        return;
      } else {
        switch (response.status) {
          case 201:
            console.log("Invitation declined successfully");
            setInvitations((prevInvitations) =>
              prevInvitations.filter(
                (inv) => inv.event_id !== invitation.event_id
              )
            );
            break;
          case 205:
            alert("Invitation not declined!");
            break;
          case 206:
            alert("Missing information!");
            break;
        }
      }
    };

    const handleSeeInvitationsOpen = () => {
      get_invitations();
      toggleSeeInvitationsPopup();
    };

    const handleSeeInvitationsClose = () => {
      toggleSeeInvitationsPopup();
    };

    const toggleSeeInvitationsPopup = () => {
      setShowSeeInvitationsPopup(!showSeeInvitationsPopup);
    };

    const get_invitations = async () => {
      const response = await fetch(flaskURL + "/get_invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user_id }),
        credentials: "include",
      });
      if (!response.ok) {
        alert("Something went wrong, refresh your website!");
        return;
      } else {
        switch (response.status) {
          case 201:
            console.log("Invitations retrieved successfully");
            const responseData = await response.json();
            const new_invitations = responseData["invitations"];
            const updatedInvitations = Object.entries(new_invitations).map(
              ([event_id, { status, event_info }]) => ({
                event_id,
                status,
                ...event_info,
              })
            );
            const uniqueInvitations = updatedInvitations.filter(
              (invitation) =>
                !invitations.some((inv) => inv.event_id === invitation.event_id)
            );
            setInvitations((prevInvitations) => [
              ...prevInvitations,
              ...uniqueInvitations,
            ]);
            break;
          case 205:
            alert("Invitations not retrieved!");
            break;
          case 206:
            alert("Missing information!");
            break;
        }
      }
    };

    // Define new states
    const [newCalendarName, setNewCalendarName] = useState("");

    // Function to handle the creation of a new calendar
    const handleCreateCalendar = async () => {
      console.log("this is called, new calendar", newCalendarName);
      if (!newCalendarName.localeCompare("")) {
        alert("Please enter a calendar name!");
        return;
      }
      const regex = /[\\"\t\n\'\\\x00-\x1F\x7F]/g;
      if (regex.test(newCalendarName)) {
        alert("Calendar name includes prohibited characters!");
        return;
      }
      const calendarExists = calendarList.some(
        (calendar) => calendar.name === newCalendarName
      );
      if (calendarExists) {
        alert("A calendar with the same name already exists.");
        setNewCalendarName("");
        return;
      }
      const new_calendar = {
        newCalendarName: newCalendarName,
        user_id: user_id,
      };
      const createCalendarRet = await send_request(
        "/create_calendar",
        new_calendar
      );
      if (createCalendarRet["error"] !== undefined) {
        alert(createCalendarRet["error"] + "\ntry again!");
      } else {
        setCalendarList([
          ...calendarList,
          {
            calendar_id: createCalendarRet["calendar_id"],
            name: newCalendarName,
          },
        ]);
      }

      // Clear the input field after creating the calendar
      setNewCalendarName("");
    };

    // Function to handle the selection of a calendar
    const handleCalendarSelection = (calendar) => {
      // Toggle the selection of the calendar
      setSelectedCalendars((prevSelected) =>
        prevSelected.some((cal) => cal.calendar_id === calendar["calendar_id"])
          ? prevSelected.filter(
              (cal) => cal.calendar_id !== calendar["calendar_id"]
            )
          : [...prevSelected, calendar]
      );
    };

    /*if (loading) {
      return <div>Loading...</div>;
    }*/

    const [semesterName, setSemesterName] = useState("");
    const [semesterStartDate, setSemesterStartDate] = useState("");
    const [semesterEndDate, setSemesterEndDate] = useState("");
    const [showSemesterPopup, setShowSemesterPopup] = useState(false);

    const handleSetupCourses = () => {
      setShowSemesterPopup(!showSemesterPopup);
    };

    const handleSemesterSelection = async (e) => {
      e.preventDefault();
      //TODO: validate inputs
      const new_calendar = {
        newCalendarName: semesterName,
        user_id: user_id,
      };
      const response = await fetch(flaskURL + "/create_calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(new_calendar),
        credentials: "include",
      });
      if (!response.ok) {
        alert("Something went wrong, refresh your website!");
        return;
      } else {
        switch (response.status) {
          case 201:
            console.log("Calendar created successfully");
            const responseData = await response.json();
            setCalendarList([
              ...calendarList,
              {
                calendar_id: responseData["calendar_id"],
                name: semesterName,
              },
            ]);
            // TODO need to include start and end dates in session storage as well
            sessionStorage.setItem(
              "semester",
              JSON.stringify({
                calendar_id: responseData["calendar_id"],
                name: semesterName,
                start_date: semesterStartDate,
                end_date: semesterEndDate,
              })
            );
            window.location.href = "./setupcourses";
            break;
          case 205:
            alert("Calendar not created!");
            break;
          case 206:
            alert("Missing information!");
            break;
          case 207:
            alert("Calendar not added to user!");
            break;
        }
      }
      setShowSemesterPopup(!showSemesterPopup);
    };

    const handleCancelSemester = () => {
      setShowSemesterPopup(!showSemesterPopup);
    };

    const handleSemesterStartDateChange = (e) => {
      setSemesterStartDate(e.target.value);
    };

    const handleSemesterEndDateChange = (e) => {
      setSemesterEndDate(e.target.value);
    };

    const [amountOfTime, setAmountOfTime] = useState("");
    const [showClosestAvailablePopup, setShowClosestAvailablePopup] =
      useState(false);

    const handleClosestAvailable = () => {
      setShowClosestAvailablePopup(!showClosestAvailablePopup);
    };

    const handleFindClosestAvailable = async (e) => {
      console.log(amountOfTime);
      e.preventDefault();

      const user_time = {
        timeAmount: amountOfTime,
        user_id: user_id,
      };

      const response = await send_request("/find_closest_available", user_time);

      if (response.username == undefined) {
        console.log("Something went wrong!");
      } else {
        console.log("find time range!");
        const message =
          "You have an extraordinary session during " + response.time;

        // TODO: send email
        EmailForm(response.username, response.email, message);

        // create event
        const calendar_id = sessionStorage.getItem("taskCalendarId");
        var temp = response.time.split(" ");
        console.log(calendar_id);

        const new_event = {
          name: "extraordinary session",
          desc: eventDescription,
          start_time: temp[1],
          end_time: temp[4],
          start_date: temp[0],
          end_date: temp[3],
          location: "",
          calendar: calendar_id,
          repetition_type: "none",
          repetition_unit: "",
          repetition_val: 1,
          selected_days: [],
          user_id: user_id,
          emails: [],
          type: eventType,
        };

        const create_event_response = await send_request(
          "/create_event",
          new_event
        );
        if (create_event_response["error"] !== undefined) {
          alert(create_event_response["error"]);
        } else {
          console.log("Event created successfully");
          new_event["event_id"] = create_event_response["event_id"];
          setEvents([...events, new_event]);
        }
      }

      setShowClosestAvailablePopup(!showClosestAvailablePopup);
    };

    const handleCancelClosestAvailable = () => {
      setShowClosestAvailablePopup(!showClosestAvailablePopup);
    };

    return (
      <ThemeProvider theme={theme}>
        <div className="calendar-list">
          {/* Create Calendar button and input */}
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <TextField
              type="text"
              label="create_calendar"
              variant="outlined"
              value={newCalendarName}
              placeholder="Enter new calendar name"
              onChange={(e) => setNewCalendarName(e.target.value)}
              style={{ width: "200px" }}
              size="small"
            />
            <div className="add_button">
              <Button
                variant="contained"
                onClick={handleCreateCalendar}
                style={{ marginLeft: "10px" }}
              >
                {languageData[language][0].main_frame.create_calendar}
              </Button>
            </div>
            <div className="add_button">
              <Button
                variant="contained"
                onClick={handleCreateEventButton}
                style={{ marginLeft: "10px" }}
              >
                {languageData[language][0].main_frame.create_event}
              </Button>
            </div>
            <div className="add_button">
              <Button
                variant="contained"
                onClick={handleCreateAvailabilityButton}
                style={{ marginLeft: "10px" }}
              >
                {languageData[language][0].main_frame.create_avaliability}
              </Button>
            </div>
            {showEventPopup && (
              <div className="popup">
                <div className="popup-content">
                  <h2>Add {eventType}</h2>
                  <div>
                    <div className="formgroup">
                      <label htmlFor="eventName">
                        {languageData[language][0].main_frame.event_name}
                      </label>
                      <input
                        type="text"
                        id="eventName"
                        value={eventName}
                        onChange={handleEventNameChange}
                      />
                    </div>
                    <div className="formgroup">
                      <label htmlFor="eventStartDate">
                        {languageData[language][0].main_frame.startDate}
                      </label>
                      <input
                        type="date"
                        id="eventStartDate"
                        value={eventStartDate}
                        onChange={handleEventStartDateChange}
                      />
                      <label htmlFor="eventEndDate">
                        {languageData[language][0].main_frame.end_date}
                      </label>
                      <input
                        type="date"
                        id="eventEndDate"
                        value={eventEndDate}
                        onChange={handleEventEndDateChange}
                      />
                    </div>
                    <div className="formgroup">
                      <label htmlFor="eventStartTime">
                        {languageData[language][0].main_frame.startTime}
                      </label>
                      <input
                        type="time"
                        id="eventStartTime"
                        value={eventStartTime}
                        onChange={handleEventStartTimeChange}
                      />
                      <label htmlFor="eventEndTime">
                        {languageData[language][0].main_frame.endTime}
                      </label>
                      <input
                        type="time"
                        id="eventEndTime"
                        value={eventEndTime}
                        onChange={handleEventEndTimeChange}
                      />
                    </div>
                    {eventType === "event" && (
                      <div>
                        <div className="formgroup">
                          <label htmlFor="eventLocation">
                            {languageData[language][0].main_frame.eventLocation}
                          </label>
                          {renderLocationInput()}
                        </div>
                        <div className="formgroup">
                          <label htmlFor="eventConferencingLink">
                            {
                              languageData[language][0].main_frame
                                .conferencingLink
                            }
                          </label>
                          <input
                            type="text"
                            id="eventConferencingLink"
                            value={eventConferencingLink}
                            onChange={handleEventConferencingLinkChange}
                          />
                        </div>
                      </div>
                    )}
                    <div className="formgroup">
                      <label htmlFor="eventDescription">
                        {languageData[language][0].main_frame.eventDescription}
                      </label>
                      <textarea
                        id="eventDescription"
                        value={eventDescription}
                        onChange={handleEventDescriptionChange}
                        rows="4"
                        cols="50"
                      />
                    </div>

                    {eventType === "event" && (
                      <div>
                        <div className="formgroup">
                          <label htmlFor="eventEmailInvitations">
                            {languageData[language][0].main_frame.inviteEmail}
                          </label>
                          <input
                            type="text"
                            id="eventEmailInvitations"
                            value={eventEmailInvitations}
                            onChange={handleEventEmailInvitationsChange}
                          />
                        </div>

                        <div className="formgroup">
                          <label htmlFor="eventCalendar">
                            {languageData[language][0].main_frame.calendar}
                          </label>
                          <select
                            id="eventCalendar"
                            value={eventCalendar}
                            onChange={handleEventCalendarChange}
                            className="calendar_option"
                          >
                            <option value="">
                              {
                                languageData[language][0].main_frame
                                  .selectCalendar
                              }
                            </option>
                            {calendarList.map((cal) => (
                              <option key={cal.id} value={cal.id}>
                                {cal.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                    <div className="event-repetition-form">
                      <h2>
                        {languageData[language][0].main_frame.eventRepetition}
                      </h2>
                      <div className="repetition-options">
                        <button
                          type="button"
                          onClick={() => handleEventRepetitionChange("none")}
                        >
                          {languageData[language][0].main_frame.none}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEventRepetitionChange("daily")}
                        >
                          {languageData[language][0].main_frame.daily}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEventRepetitionChange("weekly")}
                        >
                          {languageData[language][0].main_frame.weekly}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEventRepetitionChange("monthly")}
                        >
                          {languageData[language][0].main_frame.monthly}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEventRepetitionChange("yearly")}
                        >
                          {languageData[language][0].main_frame.yearly}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEventRepetitionChange("custom")}
                        >
                          {languageData[language][0].main_frame.custome}
                        </button>
                      </div>
                      {eventRepetitionType === "custom" && (
                        <div className="custom-repetition">
                          <label htmlFor="customFrequency">
                            {languageData[language][0].main_frame.repeatEvery}
                          </label>
                          <input
                            type="number"
                            id="eventCustomFrequencyValue"
                            value={eventCustomFrequencyValue}
                            onChange={handleEventCustomFrequencyValueChange}
                            min={1}
                          />
                          <select
                            id="eventCustomFrequencyUnit"
                            value={eventCustomFrequencyUnit}
                            onChange={handleEventCustomFrequencyUnitChange}
                          >
                            <option value="days">
                              {languageData[language][0].main_frame.days}
                            </option>
                            <option value="weeks">
                              {languageData[language][0].main_frame.weeks}
                            </option>
                            <option value="months">
                              {languageData[language][0].main_frame.months}
                            </option>
                            <option value="years">
                              {languageData[language][0].main_frame.years}
                            </option>
                          </select>
                        </div>
                      )}
                    </div>
                    <button
                      className="formbutton fb1"
                      onClick={handleCreateEvent}
                    >
                      {languageData[language][0].main_frame.add}
                    </button>
                    <button
                      className="formbutton fb2"
                      onClick={toggleEventPopup}
                    >
                      {languageData[language][0].main_frame.cancel}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/*SetupCourses*/}
            <div className="add_button">
              <Button
                variant="contained"
                onClick={handleSetupCourses}
                style={{ marginLeft: "10px" }}
              >
                {languageData[language][0].main_frame.setUpCourse}
              </Button>
            </div>
            {showSemesterPopup && (
              <div className="popup">
                <div className="popup-content">
                  <div className="formgroup">
                    <label htmlFor="semesterName">
                      {languageData[language][0].main_frame.semester}
                    </label>
                    <input
                      type="text"
                      id="semesterName"
                      value={semesterName}
                      onChange={(e) => setSemesterName(e.target.value)}
                    />
                  </div>
                  <div className="formgroup">
                    <label htmlFor="semesterStartDate">
                      {languageData[language][0].main_frame.startDate}
                    </label>
                    <input
                      type="date"
                      id="semesterStartDate"
                      value={semesterStartDate}
                      onChange={handleSemesterStartDateChange}
                    />
                    <label htmlFor="semesterEndDate">
                      {languageData[language][0].main_frame.end_date}
                    </label>
                    <input
                      type="date"
                      id="semesterEndDate"
                      value={semesterEndDate}
                      onChange={handleSemesterEndDateChange}
                    />
                  </div>
                  <button
                    className="formbutton fb1"
                    onClick={handleSemesterSelection}
                  >
                    {languageData[language][0].main_frame.add}
                  </button>
                  <button
                    className="formbutton fb2"
                    onClick={handleCancelSemester}
                  >
                    {languageData[language][0].main_frame.cancel}
                  </button>
                </div>
              </div>
            )}

            {/* See Invitations */}
            <div className="add_button">
              <Button
                variant="contained"
                onClick={handleSeeInvitationsOpen}
                style={{ marginLeft: "10px" }}
              >
                {languageData[language][0].main_frame.seeInvitation}
              </Button>
            </div>
            {showSeeInvitationsPopup && (
              <div className="popup">
                <div className="popup-content">
                  <h2>{languageData[language][0].main_frame.invitations}</h2>
                  <div className="formgroup">
                    <label htmlFor="invitationFilter">
                      {languageData[language][0].main_frame.filter}
                    </label>
                    <select
                      id="invitationFilter"
                      value={invitationFilter}
                      onChange={(e) => setInvitationFilter(e.target.value)}
                    >
                      <option value="all">
                        {languageData[language][0].main_frame.all}
                      </option>
                      <option value="pending">
                        {languageData[language][0].main_frame.pending}
                      </option>
                      <option value="accepted">
                        {languageData[language][0].main_frame.Accepted}
                      </option>
                    </select>
                  </div>
                  <div className="formgroup">
                    {invitations
                      .filter((invitation) => {
                        if (invitationFilter === "all") {
                          return true;
                        } else if (invitationFilter === "pending") {
                          return invitation.status === "pending";
                        } else if (invitationFilter === "accepted") {
                          return invitation.status === "accepted";
                        }
                      })
                      .map((invitation) => (
                        <div key={invitation.id}>
                          <h3>{invitation.name}</h3>
                          <p>{invitation.description}</p>
                          <p>
                            {languageData[language][0].main_frame.startDate +
                              invitation.startDate}
                          </p>
                          <p>
                            {languageData[language][0].main_frame.end_date +
                              invitation.endDate}
                          </p>
                          <p>
                            {languageData[language][0].main_frame.startTime +
                              invitation.startTime}
                          </p>
                          <p>
                            {languageData[language][0].main_frame.endTime +
                              invitation.endTime}
                          </p>
                          <p>
                            {languageData[language][0].main_frame.status +
                              invitation.status}
                          </p>
                          <button
                            className="formbutton fb1"
                            onClick={() => handleAcceptInvitation(invitation)}
                          >
                            {languageData[language][0].main_frame.accept}
                          </button>
                          <button
                            className="formbutton fb1"
                            onClick={() => handleDeclineInvitation(invitation)}
                          >
                            {languageData[language][0].main_frame.decline}
                          </button>
                        </div>
                      ))}
                  </div>
                  <div className="formgroup">
                    <button
                      className="formbutton fb1"
                      onClick={handleSeeInvitationsClose}
                    >
                      {languageData[language][0].main_frame.close}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/*find closest available*/}
          <div className="add_button">
            <Button
              variant="contained"
              onClick={handleClosestAvailable}
              style={{ marginLeft: "10px" }}
            >
              {languageData[language][0].main_frame.findClosestAvailable}
            </Button>
          </div>
          {showClosestAvailablePopup && (
            <div className="popup">
              <div className="popup-content">
                <h2>
                  {
                    languageData[language][0].main_frame
                      .findClosestAvailableTime
                  }
                </h2>
                <div className="formgroup">
                  <label htmlFor="amountOfTime">
                    {languageData[language][0].main_frame.amountOfTime}
                  </label>
                  <input
                    type="text"
                    id="amountOfTime"
                    value={amountOfTime}
                    onChange={(e) => setAmountOfTime(e.target.value)}
                  />
                </div>
                <button
                  className="formbutton fb1"
                  onClick={handleFindClosestAvailable}
                >
                  {languageData[language][0].main_frame.add}
                </button>
                <button
                  className="formbutton fb2"
                  onClick={handleCancelClosestAvailable}
                >
                  {languageData[language][0].main_frame.cancel}
                </button>
              </div>
            </div>
          )}

          {/* List of existing calendars */}
          <ul style={{ display: "flex", listStyle: "none", padding: 0 }}>
            {/* <Typography variant="body1" style={{ marginLeft: "10px" }}>Calendar list:</Typography> */}
            {calendarList.map((calendar) => (
              <li key={calendar["calendar_id"]}>
                <Checkbox
                  id={calendar["calendar_id"]}
                  checked={selectedCalendars.some(
                    (cal) => cal.calendar_id === calendar["calendar_id"]
                  )}
                  onChange={() => handleCalendarSelection(calendar)}
                  inputProps={{ "aria-label": "controlled" }}
                />
                <label htmlFor={calendar["calendar_id"]}>
                  {calendar["name"]}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </ThemeProvider>
    );
  }

  const d = moment();
  const [currentTime, setCurrentTime] = useState(d);

  function calendarControlFlowButtonPackage() {
    // next
    useHotkeys("Shift+n", () => {
      setCurrentTime(moment(currentTime.add(1, "days")));
      updateToday(1);
    });

    // prev
    useHotkeys("Shift+p", () => {
      setCurrentTime(moment(currentTime.subtract(1, "days")));
      updateToday(-1);
    });
    console.log("here", languageData[language][0].main_frame.days);
    return (
      <div>
        <h2 className="detailInfo">{currentTime.format("YYYY/MM/DD")}</h2>
        <div>
          <div className="buttonGroup" id="change-calendar">
            <div className="buttonGroupSelect">
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="zoom">Zoom Meetings</option>
              </select>
            </div>
            <button
              style={{
                backgroundColor: selectMode == 1 ? "#cfcfcf" : "#2d2d2d",
              }}
              className="modeButton"
              id="1"
              onClick={() => {
                setSelectMode(1);
              }}
            >
              {languageData[language][0].main_frame.days}
            </button>
            <button
              className="modeButton"
              style={{
                backgroundColor: selectMode == 2 ? "#cfcfcf" : "#2d2d2d",
              }}
              id="2"
              onClick={() => {
                setSelectMode(2);
              }}
            >
              {languageData[language][0].main_frame.weeks}
            </button>
            <button
              className="modeButton"
              style={{
                backgroundColor: selectMode == 3 ? "#cfcfcf" : "#2d2d2d",
              }}
              id="3"
              onClick={() => {
                setSelectMode(3);
              }}
            >
              {languageData[language][0].main_frame.months}
            </button>
            <button
              className="modeButton"
              style={{
                backgroundColor: selectMode == 4 ? "#cfcfcf" : "#2d2d2d",
              }}
              id="4"
              onClick={() => {
                setSelectMode(4);
              }}
            >
              {languageData[language][0].main_frame.years}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // shortcuts
  useHotkeys("Shift+d", () => setSelectMode(1));
  useHotkeys("Shift+w", () => setSelectMode(2));
  useHotkeys("Shift+m", () => setSelectMode(3));
  useHotkeys("Shift+y", () => setSelectMode(4));

  ////////////////////////////Calendar Events//////////////////////////

  function compareDates(date1, date2) {
    if (date1 > date2) {
      return 1;
    } else if (date1 < date2) {
      return -1;
    } else {
      return 0;
    }
  }

  function addDaysToSpecificDate(date, a) {
    const newDate = new Date(date.getTime() + a * 24 * 60 * 60 * 1000);
    return newDate;
  }

  function addMonthsToSpecificDate(date, a) {
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth() + a,
      date.getDate() + 1
    );
    return newDate;
  }

  function addYearsToSpecificDate(date, a) {
    const newDate = new Date(
      date.getFullYear() + a,
      date.getMonth(),
      date.getDate() + 1
    );
    return newDate;
  }

  function checkEventOverlap(event1, event2) {
    const [year1, month1, day1] = event1.start_date.split("-").map(Number);
    const [hour1, min1] = event1.start_time.split(":").map(Number);
    const [year2, month2, day2] = event1.end_date.split("-").map(Number);
    const [hour2, min2] = event1.end_time.split(":").map(Number);

    const [year3, month3, day3] = event2.start_date.split("-").map(Number);
    const [hour3, min3] = event2.start_time.split(":").map(Number);
    const [year4, month4, day4] = event2.end_date.split("-").map(Number);
    const [hour4, min4] = event2.end_time.split(":").map(Number);

    const startDate1 = new Date(year1, month1 - 1, day1, hour1, min1, 0);
    const endDate1 = new Date(year2, month2 - 1, day2, hour2, min2, 0);
    const startDate2 = new Date(year3, month3 - 1, day3, hour3, min3, 0);
    const endDate2 = new Date(year4, month4 - 1, day4, hour4, min4, 0);

    return startDate1 < endDate2 && startDate2 < endDate1;
  }

  function eventParser(event, id_number, boundary) {
    const eventArray = [];
    const breaks = [];
    if (event.type === "break") {
      breaks.push(event);
    }
    if (event.type === "course") {
      for (let b of breaks) {
        if (checkEventOverlap(event, b)) {
          return eventArray;
        }
      }
    }

    let id = id_number;
    let event_name = event.name;
    let fb_event_id = event.event_id;

    const [year1, month1, day1] = event.start_date.split("-").map(Number);
    const [hour1, min1] = event.start_time.split(":").map(Number);
    const [year2, month2, day2] = event.end_date.split("-").map(Number);
    const [hour2, min2] = event.end_time.split(":").map(Number);

    let firstStartDate = new Date(year1, month1 - 1, day1, hour1, min1, 0);
    firstStartDate.setMinutes(
      firstStartDate.getMinutes() - firstStartDate.getTimezoneOffset()
    );
    let firstEndDate = new Date(year2, month2 - 1, day2, hour2, min2, 0);
    firstEndDate.setMinutes(
      firstEndDate.getMinutes() - firstEndDate.getTimezoneOffset()
    );

    let startDate = addDaysToSpecificDate(firstStartDate, 0);
    let endDate = addDaysToSpecificDate(firstEndDate, 0);
    let counter = 1; //Default will add 1

    //console.log(event.repetition_type);

    if (event.repetition_type === "none") {
      eventArray.push({
        id: id,
        fb_event_id: fb_event_id,
        text: event_name,
        start: startDate.toISOString().slice(0, 19),
        end: endDate.toISOString().slice(0, 19),
      });
      id++;
    } else if (event.repetition_type === "daily") {
      while (compareDates(startDate, boundary) == -1) {
        eventArray.push({
          id: id,
          fb_event_id: fb_event_id,
          text: event_name,
          start: startDate.toISOString().slice(0, 19),
          end: endDate.toISOString().slice(0, 19),
        });
        id++;
        startDate = addDaysToSpecificDate(firstStartDate, counter);
        endDate = addDaysToSpecificDate(firstEndDate, counter);
        counter++;
      }
    } else if (event.repetition_type === "weekly") {
      counter = 7;
      while (compareDates(startDate, boundary) == -1) {
        eventArray.push({
          id: id,
          fb_event_id: fb_event_id,
          text: event_name,
          start: startDate.toISOString().slice(0, 19),
          end: endDate.toISOString().slice(0, 19),
        });
        id++;
        startDate = addDaysToSpecificDate(firstStartDate, counter);
        endDate = addDaysToSpecificDate(firstEndDate, counter);
        counter += 7;
      }
    } else if (event.repetition_type === "monthly") {
      while (compareDates(startDate, boundary) == -1) {
        eventArray.push({
          id: id,
          fb_event_id: fb_event_id,
          text: event_name,
          start: startDate.toISOString().slice(0, 19),
          end: endDate.toISOString().slice(0, 19),
        });
        id++;
        startDate = addMonthsToSpecificDate(firstStartDate, counter);
        endDate = addMonthsToSpecificDate(firstEndDate, counter);
        counter++;
      }
    } else if (event.repetition_type === "yearly") {
      while (compareDates(startDate, boundary) == -1) {
        eventArray.push({
          id: id,
          fb_event_id: fb_event_id,
          text: event_name,
          start: startDate.toISOString().slice(0, 19),
          end: endDate.toISOString().slice(0, 19),
        });
        id++;
        startDate = addYearsToSpecificDate(firstStartDate, counter);
        endDate = addYearsToSpecificDate(firstEndDate, counter);
        counter++;
      }
    } else if (event.repetition_type === "custom") {
      counter = event.repetition_val;
      while (compareDates(startDate, boundary) == -1) {
        eventArray.push({
          id: id,
          fb_event_id: fb_event_id,
          text: event_name,
          start: startDate.toISOString().slice(0, 19),
          end: endDate.toISOString().slice(0, 19),
        });
        id++;
        if (event.repetition_unit === "days") {
          startDate = addDaysToSpecificDate(firstStartDate, counter);
          endDate = addDaysToSpecificDate(firstEndDate, counter);
          counter += event.repetition_val;
        } else if (event.repetition_unit === "weeks") {
          startDate = addDaysToSpecificDate(firstStartDate, 7 * counter);
          endDate = addDaysToSpecificDate(firstEndDate, 7 * counter);
          counter += event.repetition_val;
        } else if (event.repetition_unit === "months") {
          startDate = addMonthsToSpecificDate(firstStartDate, counter);
          endDate = addMonthsToSpecificDate(firstEndDate, counter);
          counter += event.repetition_val;
        } else {
          startDate = addYearsToSpecificDate(firstStartDate, counter);
          endDate = addYearsToSpecificDate(firstEndDate, counter);
          counter += event.repetition_val;
        }
      }
    } else {
      console.log("Error occurs: repetition type not parse correctly");
    }

    return eventArray;
  }

  useEffect(() => {
    const fetchEvents = () => {
      if (selectedCalendars == undefined || selectedCalendars.length == 0) {
        setAllEventsArray([]);
        return;
      }

      const eventsArray = [];
      //const today = new Date();
      const today = new Date();
      const localDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      selectedCalendars.map(async (calendar) => {
        let events = await send_request("/get_events", {
          calendar_id: calendar.calendar_id,
          event_filter: eventFilter,
        });

        if (events.data != undefined) {
          // have to do all the breaks first
          // to make sure courses are properly checked for overlap
          events.data.sort((a, b) => {
            if (a.type === "break" && b.type !== "break") {
              return -1;
            } else if (a.type !== "break" && b.type === "break") {
              return 1;
            } else {
              return 0;
            }
          });

          for (let i = 0; i < events.data.length; i++) {
            eventsArray.push(
              ...eventParser(
                events.data[i],
                eventsArray.length,
                addDaysToSpecificDate(localDay, 7)
              )
            );
          }
        }
      });
      setAllEventsArray(eventsArray);
    };
    fetchEvents();
  }, [selectedCalendars, eventFilter]);

  ///////////////////Task handle///////////////////////////////////
  const taskSortFunction = (a, b) => {
    try {
      return a.date.localeCompare(b.date);
    } catch (e) {
      return 0;
    }
  };
  const generateTaskListHTML = (arr) => {
    if (!arr || arr == undefined) {
      return (
        <div className="taskBar">
          <p>
            {languageData[language][0].main_frame.allTasksHaveBeenCompleted}
          </p>
        </div>
      );
    }
    arr.sort(taskSortFunction);
    arr.map((task) => {
      console.log("task: ", task.title);
    });
    return arr.map(
      (task) =>
        !task.completed && (
          <div className="taskBar" onClick={() => {}}>
            <p className="taskName">{task.date.slice(5, 10)}</p>
            <p className="taskName">{task.title}</p>
            <Checkbox
              edge="end"
              onChange={(e) => {
                changeStatusOfTask(task, e.target.checked);
              }}
              defaultChecked={false}
            />
          </div>
        )
    );
  };

  const changeStatusOfTask = async (task, statusOfTask) => {
    const currentTime = new Date().toLocaleString(undefined, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    console.log(statusOfTask);
    task = {
      ...task,
      completed_time: currentTime,
      completed: statusOfTask,
      user_id: user_id,
    };

    console.log(task);
    let res = await send_request("/mark_done", task);
    console.log(res.message);
  };

  // handle drag & drop
  const [goToDragAndDrop, setGoToDragAndDrop] = React.useState(false);

  if (goToDragAndDrop) {
    return (
      <>
        <Navigate to="/draganddrop" />
      </>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="container">
        {goToTaskManager && <Navigate to="/taskmanager" />}
        <Joyride
          steps={steps}
          continuous={true}
          styles={{
            options: {
              arrowColor: "#2d2d2d",
              backgroundColor: "#2d2d2d",
              overlayColor: "rgba(45, 45, 45, .3)",
              primaryColor: "#2d2d2d",
              textColor: "#ffffff",
            },
            spotlight: {
              backgroundColor: "transparent",
            },
          }}
          // show the progress
          showProgress={true}
          // user can skip the tours
          showSkipButton={true}
        />

        <div>{Dashboard()}</div>
        {/* <Card variant="outlined" style={{ height: '100px' }}>
          <CardContent> */}
        <Box display="flex" justifyContent="space-between">
          <Weather />
          <Timezone />
        </Box>
        {/* Parent container for CalendarList and calendar_container */}
        <div className="main-calendar-content">
          {/* CalendarList component */}
          <div className="calendar-list-container">
            <CalendarList />
          </div>

          {/* calendar_container */}
          <div className="calender_container">
            <div className="calender_container_controlbar">
              {/*<div>{changeDate()}</div>*/}
              <div>{calendarControlFlowButtonPackage()}</div>
            </div>
            <div className="main_calnedar_box">
              {Calendar(selectMode, allEventsArray, currentTime)}
            </div>
          </div>
        </div>
        <div className="task_container">
          <div className="task_upperbar">
            <h1 className="task_title">
              {languageData[language][0].main_frame.task}
            </h1>
            <button
              className="modeButton"
              onClick={() => {
                setGoToTaskManager(true);
              }}
            >
              {languageData[language][0].main_frame.detail}
            </button>
          </div>
          <div className="ToDoList">{generateTaskListHTML(taskList)}</div>
        </div>
      </div>
    </ThemeProvider>
  );
}
