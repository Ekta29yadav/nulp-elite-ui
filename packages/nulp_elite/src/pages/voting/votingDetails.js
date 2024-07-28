import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Footer from "components/Footer";
import Header from "components/header";
import Container from "@mui/material/Container";
import FloatingChatIcon from "../../components/FloatingChatIcon";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import LinearProgress from "@mui/material/LinearProgress";

import ToasterCommon from "../ToasterCommon";
import VerifiedIcon from "@mui/icons-material/Verified";
import axios from "axios";
const data = require("./polls-detail.json");
const urlConfig = require("../../configs/urlConfig.json");

import {
  FacebookShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  FacebookIcon,
  WhatsappIcon,
  LinkedinIcon,
  TwitterIcon,
} from "react-share";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AddConnections from "pages/connections/AddConnections";
// import { Button } from "native-base";
import { maxWidth } from "@shiksha/common-lib";
import * as util from "../../services/utilService";
import moment from "moment";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const VotingDetails = () => {
  const [progress, setProgress] = useState(10);
  const [open, setOpen] = useState(false);
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [userVote, setUserVote] = useState([]);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterOpen, setToasterOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const shareUrl = window.location.href; // Current page URL
  const userId = util.userId();
  const [pollResult, setPollResult] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const queryString = location.search;
  const pollId = queryString.startsWith("?do_") ? queryString.slice(1) : null;

  useEffect(() => {
    if (pollId) {
      fetchPoll(pollId);
      fetchUserVote(pollId);
    }
  }, [pollId]);

  const fetchPoll = async (pollId) => {
    try {
      const response = await axios.get(
        `${urlConfig.URLS.POLL.GET_POLL}?poll_id=${pollId}`
      );
      setPoll(response.data.result.poll);
      setPollResult(response.data.result.result);
    } catch (error) {
      console.error("Error fetching poll", error);
    }
  };

  const fetchUserVote = async (pollId) => {
    try {
      const response = await axios.get(
        `${urlConfig.URLS.POLL.GET_USER_POLL}?poll_id=${pollId}&user_id=${userId}`
      );
      setUserVote(response.data.result);
    } catch (error) {
      console.error("Error fetching user vote", error);
    }
  };
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleVoteSubmit = async () => {
    const data = {
      poll_id: pollId,
      user_id: userId,
      poll_submitted: true,
      poll_result: selectedOption,
    };

    try {
      await axios.post(`${urlConfig.URLS.POLL.USER_CREATE}`, data);
      setToasterMessage("Vote submitted successfully");
      setToasterOpen(true);
      fetchUserVote(pollId);
    } catch (error) {
      console.error("Error submitting vote", error);
    }
  };

  const handleVoteUpdate = async () => {
    const data = {
      poll_id: pollId,
      user_id: userId,
      poll_submitted: true,
      poll_result: selectedOption,
    };

    try {
      await axios.put(`${urlConfig.URLS.POLL.USER_UPDATE}`, data);
      setToasterMessage("Vote updated successfully");
      setToasterOpen(true);
      fetchUserVote(pollId);
    } catch (error) {
      console.error("Error updating vote", error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const formatTimeToIST = (timeString) => {
    let dateObject = new Date(timeString);
    if (isNaN(dateObject.getTime())) {
      const [hours, minutes] = timeString.split(":");
      dateObject = new Date();
      dateObject.setHours(hours);
      dateObject.setMinutes(minutes);
      dateObject.setSeconds(0);
    }
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };
  };

  const handleGoBack = () => {
    navigate(-1);
  };
  const totalVotes = pollResult?.reduce((sum, option) => sum + option.count, 0);

  const getProgressValue = (count) =>
    totalVotes > 0 ? (count / totalVotes) * 100 : 0;

  return (
    <div>
      <Header />
      {toasterMessage && <ToasterCommon response={toasterMessage} />}

      {poll && (
        <Container maxWidth="xl" role="main" className=" xs-pb-20 mt-12">
          <Breadcrumbs
            aria-label="breadcrumb"
            className="h6-title mt-15 pl-28 xss-pb-0"
            style={{ padding: "0 0 20px 20px" }}
          >
            <Link
              underline="hover"
              style={{ maxHeight: "inherit" }}
              onClick={handleGoBack}
              color="#004367"
              href="/webapp/votingList"
            >
              {t("LIVE_POLLS")}
            </Link>
            <Link
              underline="hover"
              href=""
              aria-current="page"
              className="h6-title oneLineEllipsis"
            >
              {poll.title}
            </Link>
          </Breadcrumbs>
          <Grid
            container
            spacing={2}
            className="bg-whitee custom-event-container mb-20 xs-container"
          >
            <Grid item xs={3} md={6} lg={2} className="lg-pl-5 xs-pl-0">
              <img
                src={require("assets/default.png")}
                className="eventCardImg"
                alt="App Icon"
              />
              {/* <Box>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="female"
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="No"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Maybe"
                  />
                </RadioGroup>
              </FormControl>
              <Box>
                <Button type="button" className="custom-btn-primary">
                  {t("SUBMIT_VOTE")}
                </Button>
              </Box>
            </Box> */}
            </Grid>
            {userVote && userVote?.length > 0 ? (
              <Grid item xs={9} md={6} lg={6} className="lg-pl-60 xs-pl-30">
                <Box width="100%"></Box>
                <Typography
                  gutterBottom
                  className="mt-10  h1-title mb-20 ellsp"
                >
                  {poll.title}
                </Typography>

                <Box className="pr-5">
                  <span className=" h3-custom-title"> Voting Ended On</span>
                  <TodayOutlinedIcon
                    className="h3-custom-title pl-10 mt-10"
                    style={{ verticalAlign: "middle" }}
                  />
                  <span className="h3-custom-title ">
                    {moment(poll.end_date).format(
                      "dddd, MMMM Do YYYY, h:mm:ss a"
                    )}
                  </span>
                </Box>
                <Box className="pr-5 my-20">
                  <span className=" h3-custom-title"> Your Vote</span>
                  <VerifiedIcon
                    className="h3-custom-title pl-10 mt-10 icon-blue"
                    style={{ verticalAlign: "middle" }}
                  />
                  <span className="h3-custom-title ">
                    {userVote[0]?.poll_result}
                  </span>
                </Box>

                <Box sx={{ width: "100%" }} className="xs-hide">
                  {pollResult && (
                    <div>
                      {pollResult?.map((option, index) => (
                        <Box
                          key={index}
                          sx={{ width: "100%" }}
                          className={`voting-option my-10 progress${index}`}
                        >
                          <span
                            className="h3-custom-title"
                            style={{ paddingRight: "33px" }}
                          >
                            {option.poll_option}
                          </span>
                          <LinearProgressWithLabel
                            value={getProgressValue(option.count)}
                          />
                        </Box>
                      ))}
                    </div>
                  )}
                  <Box className="mt-20">
                    <Button
                      type="button"
                      className="custom-btn-primary"
                      onClick={handleClickOpen}
                    >
                      {t("SHARE_RESULTS")}
                      <ShareOutlinedIcon
                        style={{ color: "#fff", paddingLeft: "10px" }}
                      />
                    </Button>
                  </Box>
                </Box>
              </Grid>
            ) : (
              <Grid item xs={9} md={6} lg={6} className="lg-pl-60 xs-pl-30">
                <Typography
                  gutterBottom
                  className="mt-10  h1-title mb-20 xs-pl-15"
                >
                  {poll.title}
                </Typography>
                <Box className="pr-5 h3-custom-title">
                  <span className=" h3-custom-title"> Live until</span>
                  <TodayOutlinedIcon
                    className="h3-custom-title pl-10 mt-10"
                    style={{ verticalAlign: "middle" }}
                  />
                  {moment(poll.end_date).format(
                    "dddd, MMMM Do YYYY, h:mm:ss a"
                  )}
                </Box>
                <Box>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="Poll"
                      value={selectedOption}
                      onChange={handleOptionChange}
                      name="radio-buttons-group"
                    >
                      {poll?.poll_options?.map((option, index) => (
                        <FormControlLabel
                          key={index}
                          value={option}
                          control={<Radio />}
                          label={option}
                        />
                      ))}
                    </RadioGroup>
                    <Box>
                      {userVote?.length > 0 ? (
                        <Button
                          type="button"
                          className="custom-btn-primary"
                          onClick={handleVoteUpdate}
                          disabled={!selectedOption} // Disable the button if no option is selected
                        >
                          {t("UPDATE_VOTE")}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          className="custom-btn-primary"
                          onClick={handleVoteSubmit}
                          disabled={!selectedOption} // Disable the button if no option is selected
                        >
                          {t("SUBMIT_VOTE")}
                        </Button>
                      )}
                    </Box>
                  </FormControl>
                </Box>
              </Grid>
            )}
            <BootstrapDialog
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={open}
            >
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
              <DialogContent dividers>
                <Grid
                  container
                  spacing={2}
                  className="custom-event-container mb-20 mt-15"
                  style={{ paddingRight: "10px" }}
                >
                  <Grid item xs={9} md={6} lg={9}>
                    <Typography
                      gutterBottom
                      className="mt-10  h1-title mb-20 xs-pl-15 ellsp"
                    >
                      {poll.title}
                    </Typography>

                    <Box className="pr-5">
                      <span className=" h3-custom-title"> Voting Ended On</span>
                      <TodayOutlinedIcon
                        className="h3-custom-title pl-10 mt-10"
                        style={{ verticalAlign: "middle" }}
                      />
                      <span className="h3-custom-title ">
                        {moment(poll.end_date).format(
                          "dddd, MMMM Do YYYY, h:mm:ss a"
                        )}
                      </span>
                    </Box>
                  </Grid>
                  <Grid item xs={3} md={6} lg={3}>
                    <img
                      src={require("assets/default.png")}
                      className="appicon"
                      alt="App Icon"
                    />
                  </Grid>
                  <Box style={{ paddingLeft: "18px", width: "100%" }}>
                    <Box sx={{ width: "100%" }}>
                      {pollResult?.map((option, index) => (
                        <Box
                          key={index}
                          sx={{ width: "100%" }}
                          className={`voting-option my-10 progress${index}`}
                        >
                          <span
                            className="h3-custom-title"
                            style={{ paddingRight: "33px" }}
                          >
                            {option.poll_option}
                          </span>
                          <LinearProgressWithLabel
                            value={getProgressValue(option.count)}
                          />
                        </Box>
                      ))}
                      {/* <Box className="mt-20">
                          <Button
                            type="button"
                            className="custom-btn-primaryy"
                            onClick={handleClickOpen}
                          >
                            {t("SHARE_RESULTS")}{" "}
                            <ShareOutlinedIcon
                              style={{ color: "#fff", paddingLeft: "10px" }}
                            />
                          </Button>
                        </Box> */}
                    </Box>
                  </Box>
                </Grid>
              </DialogContent>
            </BootstrapDialog>
            <Grid item xs={6} md={6} lg={4} className="text-right xs-hide">
              <Box className="xs-hide">
                <FacebookShareButton url={shareUrl} className="pr-5">
                  <FacebookIcon size={32} round={true} />
                </FacebookShareButton>
                <WhatsappShareButton url={shareUrl} className="pr-5">
                  <WhatsappIcon size={32} round={true} />
                </WhatsappShareButton>
                <LinkedinShareButton url={shareUrl} className="pr-5">
                  <LinkedinIcon size={32} round={true} />
                </LinkedinShareButton>
                <TwitterShareButton url={shareUrl} className="pr-5">
                  <img
                    src={require("../../assets/twitter.png")}
                    alt="Twitter"
                    style={{ width: 32, height: 32 }}
                  />
                </TwitterShareButton>
              </Box>
            </Grid>
            <Box className="lg-hide" sx={{ width: "100%" }}>
              <Box sx={{ width: "100%" }}>
                {pollResult?.map((option, index) => (
                  <Box
                    key={index}
                    sx={{ width: "100%" }}
                    className={`voting-option my-10 progress${index}`}
                  >
                    <span
                      className="h3-custom-title"
                      style={{ paddingRight: "33px" }}
                    >
                      {option.poll_option}
                    </span>
                    <LinearProgressWithLabel
                      value={getProgressValue(option.count)}
                    />
                  </Box>
                ))}
              </Box>
              {/* <Box className="mt-20">
                  <Button type="button" className="custom-btn-primaryy">
                    {t("SHARE_RESULTS")}{" "}
                    <ShareOutlinedIcon
                      style={{ color: "#fff", paddingLeft: "10px" }}
                    />
                  </Button>
                </Box> */}
            </Box>
            <Box style={{ display: "block", width: "100%" }}></Box>
            <Box
              className="h2-title pl-20 mb-20 mt-20"
              style={{ fontWeight: "600" }}
            >
              {t("About survey")}
            </Box>
            <Box
              className="event-h2-title  pl-20 mb-20"
              style={{ fontWeight: "400" }}
            >
              {poll.description}
            </Box>
            <Box className="lg-hide ml-20">
              <FacebookShareButton url={shareUrl} className="pr-5">
                <FacebookIcon size={32} round={true} />
              </FacebookShareButton>
              <WhatsappShareButton url={shareUrl} className="pr-5">
                <WhatsappIcon size={32} round={true} />
              </WhatsappShareButton>
              <LinkedinShareButton url={shareUrl} className="pr-5">
                <LinkedinIcon size={32} round={true} />
              </LinkedinShareButton>
              <TwitterShareButton url={shareUrl} className="pr-5">
                <img
                  src={require("../../assets/twitter.png")}
                  alt="Twitter"
                  style={{ width: 32, height: 32 }}
                />
              </TwitterShareButton>
            </Box>
          </Grid>
        </Container>
      )}
      <FloatingChatIcon />

      <Footer />
    </div>
  );
};

export default VotingDetails;
