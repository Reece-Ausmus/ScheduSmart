import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppBar, IconButton, Menu, Toolbar } from "@mui/material";
import { orange } from "@mui/material/colors";
import send_request from "./requester";
import { flaskURL, user_id } from "../config";

const theme = createTheme({
  palette: {
    primary: orange,
    secondary: {
      main: "#ab5600",
    },
  },
});

export default function DataPage() {
  return <h1>Data Page</h1>;
}
