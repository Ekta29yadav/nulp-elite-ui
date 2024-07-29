import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ToasterCommon from "../pages/ToasterCommon";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import { useTranslation } from "react-i18next";

const VotingDrawerFilter = ({ onFilterChange }) => {
  const [status, setStatus] = useState(["Live"]);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterOpen, setToasterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStartDate, setStartDate] = useState(null);
  const [selectedEndDate, setEndDate] = useState(null);
  const { t } = useTranslation();

  const [state, setState] = useState({
    left: false,
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const showErrorMessage = (msg) => {
    setToasterMessage(msg);
    setTimeout(() => {
      setToasterMessage("");
    }, 2000);
    setToasterOpen(true);
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setStartDate(null);
    setEndDate(null);
    setStatus([]);
    onFilterChange({
      searchTerm: "",
      selectedStartDate: null,
      selectedEndDate: null,
      status: [],
    });
  };

  const handleFilterChange = () => {
    onFilterChange({
      searchTerm,
      selectedStartDate,
      selectedEndDate,
      status,
    });
  };

  useEffect(() => {
    handleFilterChange();
  }, [searchTerm, selectedStartDate, selectedEndDate, status]);

  const handleStatusChange = (event) => {
    const value = event.target.value;
    setStatus((prevStatus) =>
      event.target.checked
        ? [...prevStatus, value]
        : prevStatus.filter((status) => status !== value)
    );
  };

  return (
    <>
      {toasterMessage && <ToasterCommon response={toasterMessage} />}

      <Box className="header-bg-blue p-15 filter-bx xs-hide">
        <Box className="d-flex jc-bw" style={{ paddingTop: "10px" }}>
          <Box className="filter-title">Filter By:</Box>
          <Button
            type="button"
            className="viewAll mb-20"
            onClick={handleClearAll}
          >
            Clear all
          </Button>
        </Box>

        <FormControl>
          <InputLabel htmlFor="outlined-adornment-search">
            Search for a Poll
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="toggle search visibility">
                  <SearchOutlinedIcon />
                </IconButton>
              </InputAdornment>
            }
            label="Search poll"
          />
        </FormControl>
        <Box className="filter-text mt-15">Select Date Range</Box>
        <Box className="mt-9 dateRange">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Date From"
              value={selectedStartDate}
              onChange={(newValue) => setStartDate(newValue)}
            />
            <DatePicker
              label="Select Date To"
              value={selectedEndDate}
              onChange={(newValue) => setEndDate(newValue)}
            />
          </LocalizationProvider>
        </Box>
        <Box>
          <FormControl>
            <Box className="filter-text mt-15">Poll Status</Box>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={status.includes("Live")}
                    onChange={handleStatusChange}
                  />
                }
                label="Live"
                value="Live"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={status.includes("Closed")}
                    onChange={handleStatusChange}
                  />
                }
                label="Closed"
                value="Closed"
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
    </>
  );
};

export default VotingDrawerFilter;
