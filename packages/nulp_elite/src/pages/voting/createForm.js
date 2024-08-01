import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Footer from "components/Footer";
import Header from "components/header";
import Container from "@mui/material/Container";
import NoResult from "pages/content/noResultFound";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import ToasterCommon from "../ToasterCommon";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import MenuItem from "@mui/material/MenuItem";
import FloatingChatIcon from "components/FloatingChatIcon";
import { BorderRight } from "@mui/icons-material";
import * as util from "../../services/utilService";
import { Autocomplete, ListItemText } from "@mui/material";
import PollOutlinedIcon from "@mui/icons-material/PollOutlined";
import dayjs from "dayjs";
import Toast from "pages/Toast";

const createForm = () => {
  const [toasterOpen, setToasterOpen] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { state: editData } = location;
  const [title, setTitle] = useState(editData?.title || "");
  const [description, setDescription] = useState(editData?.description || "");
  const [pollType, setPollType] = useState(editData?.pollType || "");
  const [startDate, setStartDate] = useState(
    editData?.start_date ? dayjs(editData.start_date) : null
  );
  const [endDate, setEndDate] = useState(
    editData?.end_date ? dayjs(editData.end_date) : null
  );

  const [visibility, setVisibility] = useState(
    editData?.visibility || "public"
  );
  const [organisationName, setOrganisationName] = useState(
    editData?.organisationName || ""
  );
  const [selectedOption, setSelectedOption] = useState(
    editData?.selectedOption || ""
  );
  const [userList, setUserList] = useState(editData?.userList || []);
  const [fields, setFields] = useState(
    () =>
      editData?.poll_options?.map((option, index) => ({
        id: index + 1,
        value: option,
      })) || [
        { id: 1, value: "" },
        { id: 2, value: "" },
      ]
  );

  const urlConfig = require("../../configs/urlConfig.json");
  const userId = util.userId();
  const [userData, setUserData] = useState([]);

  const [globalSearchQuery, setGlobalSearchQuery] = useState(
    location.state?.globalSearchQuery || undefined
  );
  const [orgUserList, setOrgUserList] = useState([]);
  const [orgList, setOrgList] = useState([]);
  const [searchQuery, setSearchQuery] = useState(globalSearchQuery || "");
  const [userListFinal, setUserListFinal] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(
    "Select or Search Organization"
  );
  const [orgOffset, setOrgOffset] = useState(0);
  const [isFetchingMoreOrgs, setIsFetchingMoreOrgs] = useState(false);
  const currentDateTime = new Date();
  // Check if startDate is in the past
  const isStartDateInPast = startDate && new Date(startDate) < currentDateTime;

  useEffect(() => {
    const initialOrg = orgList.find((org) => org.orgName === organisationName);
    setSelectedOrg(initialOrg || null);
  }, [organisationName, orgList]);

  const loadMoreOrgs = async () => {
    setIsFetchingMoreOrgs(true);
    const newOffset = orgOffset + 100;
    await getOrgDetail(searchQuery, newOffset);
    setOrgOffset(newOffset);
    setIsFetchingMoreOrgs(false);
  };

  useEffect(() => {
    fetchData();
    const userIds = userList.map((item) => item.userId);
    setUserListFinal(userIds);
  }, [userList]);

  const handleInputChange = (id, event) => {
    const newFields = fields.map((field) => {
      if (field.id === id) {
        return { ...field, value: event.target.value };
      }
      return field;
    });
    setFields(newFields);
  };

  const addField = () => {
    const newId = fields.length ? fields[fields.length - 1].id + 1 : 1;
    setFields([...fields, { id: newId, value: "" }]);
  };

  const handleDeleteField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleRadioChange = (event) => {
    setVisibility(event.target.value);
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };
  useEffect(() => {
    // Ensure selectedOrg is updated when organisationName changes
    const initialOrg = orgList.find((org) => org.orgName === organisationName);
    setSelectedOrg(initialOrg || null);
  }, [organisationName, orgList]);

  const handleOrgChange = async (event, value) => {
    console.log("eve", value.rootOrgId);
    await getOrgUser(value.rootOrgId);
    setSelectedOrg(value);
  };

  const handleUserChange = (event, newValue) => {
    setUserList(newValue);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (selectedOption === "option1") {
        try {
          const users = await getOrgUser(
            userData?.result?.response?.rootOrg?.id
          );
          const userIds = users.map((item) => item.userId);
          setUserListFinal(userIds);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      }
    };

    fetchUsers();
  }, [userData, selectedOption]);
  const isFormValid = () => {
    return (
      title.length >= 10 &&
      description.length >= 100 &&
      startDate !== null &&
      endDate !== null
    );
  };

  const handleSubmit = async () => {
    const pollOptions = fields.map((field) => field.value);
    let data;
    if (visibility === "private") {
      data = {
        title,
        description,
        visibility,
        poll_options: pollOptions,
        poll_type: pollType,
        status: "Live",
        start_date: startDate,
        end_date: endDate,
        user_list: userListFinal,
      };
    } else {
      data = {
        title,
        description,
        visibility,
        poll_options: pollOptions,
        poll_type: pollType,
        status: "Live",
        start_date: startDate,
        end_date: endDate,
        user_list: userList,
      };
    }
    try {
      const response = await fetch(`${urlConfig.URLS.POLL.CREATE}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        setToasterMessage("Poll created successfully!");
        setToasterOpen(true);
        navigate("/webapp/pollDashboard"); // Redirect to success page
      } else {
        throw new Error("Failed to create poll");
      }
    } catch (error) {
      // setToasterMessage(error.message);
      setToasterOpen(true);
    }
  };

  const handleUpdate = async () => {
    const pollOptions = fields.map((field) => field.value);
    const currentDateTime = new Date();
    const startDateTime = new Date(startDate);

    const data = {
      title,
      description,
      poll_options: pollOptions,
      poll_type: pollType,
      start_date: startDate,
      end_date: endDate,
    };
    // Check if currentDateTime is greater than startDateTime
    if (currentDateTime > startDateTime) {
      delete data.start_date;
    }

    try {
      const response = await fetch(
        `${urlConfig.URLS.POLL.UPDATE}?poll_id=${editData.poll_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        setToasterMessage("Poll updated successfully!");
        setToasterOpen(true);
        navigate("/webapp/pollDashboard");
      } else {
        throw new Error("Failed to update poll");
      }
    } catch (error) {
      // setToasterMessage(error.message);
      setToasterOpen(true);
    }
  };
  const fetchData = async () => {
    try {
      const url = `${urlConfig.URLS.LEARNER_PREFIX}${urlConfig.URLS.USER.GET_PROFILE}${userId}?fields=${urlConfig.params.userReadParam.fields}`;
      const response = await fetch(url);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getOrgUser = async (rootOrgId) => {
    const requestBody = {
      request: {
        filters: {
          status: "1",
          rootOrgId: rootOrgId,
        },
        sort_by: {
          lastUpdatedOn: "desc",
        },
      },
    };

    try {
      const url = `${urlConfig.URLS.LEARNER_PREFIX}${urlConfig.URLS.ADMIN.USER_SEARCH}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(t("FAILED_TO_FETCH_DATA"));
      }

      let responseData = await response.json();
      const users = responseData?.result?.response?.content || [];
      setOrgUserList(users);
      return users;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getOrgDetail = async (searchQuery = "", offset = 0) => {
    const requestBody = {
      request: {
        query: searchQuery,
        filters: {},
        limit: 100,
        offset: offset,
      },
    };

    try {
      const url = `${urlConfig.URLS.LEARNER_PREFIX}${urlConfig.URLS.ADMIN.ORG_SEARCH}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(t("FAILED_TO_FETCH_DATA"));
      }

      const responseData = await response.json();
      const newOrgs = responseData?.result?.response?.content || [];
      setOrgList((prevOrgs) => [...prevOrgs, ...newOrgs]);
      return responseData?.result?.response?.content || [];
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    isFormValid();
    setOrganisationName(userData?.result?.response?.rootOrg?.orgName);
  }, [title, description, startDate, endDate, userData]);

  const roleNames =
    userData?.result?.response?.roles?.map((role) => role.role) || [];
  const isAdmin =
    roleNames.includes("SYSTEM_ADMINISTRATION") ||
    roleNames.includes("ORG_ADMIN");
  const isContentCreator = roleNames.includes("CONTENT_CREATOR");

  useEffect(() => {
    if (isContentCreator) {
      getOrgUser(userData?.result?.response?.rootOrg?.id);
    } else if (isAdmin) {
      getOrgDetail(userData?.result?.response?.rootOrg?.id);
    }
  }, [isContentCreator, isAdmin, userData]);

  return (
    <div>
      <Header globalSearchQuery={globalSearchQuery} />
      {toasterMessage && <Toast response={toasterMessage} type="success" />}

      <Container
        maxWidth="xl"
        role="main"
        className="xs-pb-20 createForm min-472"
        style={{ paddingTop: "0" }}
      >
        <Box sx={{background:'#fff',boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',padding:'30px',
    marginTop: '30px'
}}>
        <Box className="voting-text1">
          <Box className="h3-title pl-5 xs-py-10">
            <PollOutlinedIcon
              style={{ paddingRight: "10px", verticalAlign: "middle" }}
            />
            {editData ? "Edit Poll" : "Poll Creation"}
          </Box>


        </Box>

        <Grid
          container
          spacing={2}
          className="pt-8 mt-2 custom-event-container"
          style={{ paddingTop: "0" }}
        >
          <Grid item xs={12} md={4} lg={7} className="lg-pl-0">
            <TextField
              label={
                <span>
                  Title<span className="red"> *</span>
                </span>
              }
              id="title"
              variant="outlined"
              className="mb-20"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={title.length > 0 && title.length < 10}
              helperText={
                title.length > 0 && title.length < 10
                  ? "Title must be at least 10 characters"
                  : ""
              }
            />
            <TextField
              label={
                <span>
                  Description<span className="red"> *</span>
                </span>
              }
              id="description"
              multiline
              rows={4}
              className="mb-20"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={description.length > 0 && description.length < 100}
              helperText={
                description.length > 0 && description.length < 100
                  ? "Description must be at least 100 characters"
                  : ""
              }
            />
          
            <TextField
              id="poll_type"
              label="Poll Type"
              className="mb-20"
              multiline
              maxRows={4}
              value={pollType}
              onChange={(e) => setPollType(e.target.value)}
            />{" "}
              <Alert severity="info" className="mt-15" sx={{marginBottom:'30px'}}>
              Poll will be published Based on Start Date
            </Alert>
            <Box className="mb-20">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label={
                    <span>
                      Start Date<span className="red"> *</span>
                    </span>
                  }
                  required
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  disabled={isStartDateInPast} // Disable if startDate is in the past
                />
              </LocalizationProvider>
            </Box>
            <Box className="mb-20">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label={
                    <span>
                      End Date<span className="red"> *</span>
                    </span>
                  }
                  required
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                />
              </LocalizationProvider>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} lg={5}>
            <Box sx={{marginLeft:'30px'}}>
            <FormControl style={{ width: "100%" }}>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Visibility<span style={{ color: "red" }}>*</span>
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={visibility}
                onChange={handleRadioChange}
                className="mb-20"
              >
                <FormControlLabel
                  value="public"
                  control={<Radio />}
                  label="Public"
                  disabled={Boolean(editData)}
                />
                <FormControlLabel
                  value="private"
                  control={<Radio />}
                  label="Invite only"
                  disabled={Boolean(editData)}
                />
              </RadioGroup>

              {visibility === "private" && (
                <Box
                  style={{
                    background: "#f4d88b",
                    borderRadius: "10px",
                    padding: "15px",
                  }}
                >
                  <div>
                    {isContentCreator ? (
                      <TextField
                        label="Organization"
                        value={organisationName}
                        variant="outlined"
                        fullWidth
                        disabled
                      />
                    ) : isAdmin ? (
                      <Autocomplete
                        options={orgList}
                        getOptionLabel={(option) => option.orgName}
                        value={selectedOrg}
                        onChange={handleOrgChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select or Search Organization"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                        ListboxProps={{
                          onScroll: (event) => {
                            const listboxNode = event.currentTarget;
                            if (
                              listboxNode.scrollTop +
                              listboxNode.clientHeight ===
                              listboxNode.scrollHeight
                            ) {
                              if (!isFetchingMoreOrgs) {
                                loadMoreOrgs();
                              }
                            }
                          },
                        }}
                      />
                    ) : null}

                    <RadioGroup
                      row
                      aria-labelledby="nested-radio-buttons-group-label"
                      name="nested-radio-buttons-group"
                      value={selectedOption}
                      onChange={handleSelectChange}
                      className="mt-15"
                    >
                      <FormControlLabel
                        value="option1"
                        control={<Radio />}
                        label="All Users"
                      />
                      <FormControlLabel
                        value="option2"
                        control={<Radio />}
                        label="Select Users"
                      />
                    </RadioGroup>

                    {selectedOption === "option2" && (
                      <Autocomplete
                        multiple
                        options={orgUserList}
                        getOptionLabel={(option) =>
                          `${option.firstName} ${option.lastName || " "}`
                        }
                        value={userList}
                        onChange={handleUserChange}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox
                              checked={selected}
                              onChange={() => {
                                const isSelected = userList.includes(option);
                                const newSelectedUsers = isSelected
                                  ? userList.filter(
                                    (user) => user.userId !== option.userId
                                  )
                                  : [...userList, option];
                                setUserList(newSelectedUsers);
                              }}
                            />
                            <ListItemText
                              primary={`${option.firstName} ${option.lastName || " "
                                }`}
                            />
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label="Select Users"
                            placeholder="Search users"
                          />
                        )}
                        renderTags={(selected, getTagProps) =>
                          selected.map((user, index) => (
                            <ListItemText
                              key={user.userId}
                              primary={`${user.firstName} ${user.lastName}`}
                              {...getTagProps({ index })}
                            />
                          ))
                        }
                      />
                    )}
                  </div>
                </Box>
              )}
            </FormControl>

            <FormGroup className="d-flex" style={{ flexFlow: "row" }}>
              <Box className="voting-textfield">
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Poll Options<span style={{ color: "red" }}>*</span>
                  {/* <TextField
                    id="outlined-basic"
                    label="Options"
                    variant="outlined"
                    className="w-86 mt-20"
                  /> */}
                </FormLabel>
                <Box>
                  {fields.map((field, index) => (
                    <Box key={field.id} display="flex" alignItems="center">
                      <Box>
                        <TextField
                          label={`Option ${field.id}`}
                          value={field.value}
                          onChange={(e) => handleInputChange(field.id, e)}
                          multiline
                          maxRows={4}
                          margin="normal"
                          style={{ flex: 1, width: "100%" }}
                        />
                      </Box>
                      <Box>
                        {index >= 2 && (
                          <Button
                            type="button"
                            style={{
                              width: "10%",
                              height: "55px",
                              color: "#0e7a9c",
                            }}
                            onClick={() => handleDeleteField(field.id)}
                          >
                            <DeleteOutlineOutlinedIcon
                              style={{
                                fontSize: "30px",
                                color: "#0e7a9c",
                                cursor: "pointer",
                              }}
                            />
                          </Button>
                        )}
                      </Box>
                      <Box>
                        {index === fields.length - 1 && (
                          <Button
                            type="button"
                            style={{
                              width: "10%",
                              height: "55px",
                              color: "#0e7a9c",
                            }}
                            onClick={addField}
                          >
                            <AddOutlinedIcon />
                          </Button>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </FormGroup>
            </Box>
          </Grid>
        </Grid>

        <Box
          style={{
            marginTop: "8px",
            marginBottom: "20px",
            textAlign: "right",
          }}
        >
          {/* <Button
            type="button"
            className="custom-btn-primary"
            style={{ width: "10%" }}
            onClick={handleSubmit}
            disabled={!isFormValid()}
          >
            Submit
          </Button> */}
          <Button
            type="button"
            className="custom-btn-primary"
            style={{ width: "10%" }}
            onClick={editData ? handleUpdate : handleSubmit}
            disabled={!isFormValid()}
          >
            {editData ? "Update" : "Create"}
          </Button>
        </Box>
        </Box>
      </Container>
      <FloatingChatIcon />
      <Footer />
    </div>
  );
};

export default createForm;
