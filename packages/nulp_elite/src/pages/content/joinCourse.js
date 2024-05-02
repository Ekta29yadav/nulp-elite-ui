import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Footer from "components/Footer";
import Header from "components/header";
import Container from "@mui/material/Container";
import FloatingChatIcon from "../../components/FloatingChatIcon";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import Grid from "@mui/material/Grid";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import Alert from "@mui/material/Alert";
import * as util from "../../services/utilService";

import data from "../../assets/courseHierarchy.json";
const JoinCourse = () => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState();
  const [batchData, setBatchData] = useState();
  const [userCourseData, setUserCourseData] = useState({});
  const [showEnrollmentSnackbar, setShowEnrollmentSnackbar] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const { contentId } = location.state || {};
  const _userId = util.userId(); // Assuming util.userId() is defined

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/course/v1/hierarchy/${contentId}?orgdetails=orgName,email&licenseDetails=name,description,url`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch course data");
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    const fetchBatchData = async () => {
      setError(null);
      try {
        const response = await axios.post(
          "http://localhost:3000/learner/course/v1/batch/list",
          {
            request: {
              filters: {
                status: "1",
                courseId: contentId,
                enrollmentType: "open",
              },
              sort_by: {
                createdDate: "desc",
              },
            },
          }
        );
        const responseData = response.data;
        if (
          responseData.result.response &&
          responseData.result.response.content
        ) {
          const batchDetails = responseData.result.response.content[0];
          setBatchData({
            startDate: batchDetails.startDate,
            endDate: batchDetails.endDate,
            enrollmentEndDate: batchDetails.enrollmentEndDate,
            batchId: batchDetails.batchId,
          });
        } else {
          console.error("Batch data not found in response");
        }
      } catch (error) {
        console.error("Error fetching batch data:", error);
        setError(error.message);
      }
    };

    fetchData();
    fetchBatchData();
    checkEnrolledCourse();
  }, []);

  const handleGoBack = () => {
    navigate(-1); // Navigate back in history
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleLinkClick = () => {
    navigate("/player");
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowEnrollmentSnackbar(false);
  };

  const isEnrolled = () => {
    return (
      userCourseData &&
      userCourseData.courses &&
      userCourseData.courses.some((course) => course.contentId === contentId)
    );
  };

  const renderActionButton = () => {
    if (isEnrolled() || enrolled) {
      return (
        <Button
          onClick={handleLinkClick}
          variant="contained"
          style={{ background: "#9ACD32", color: "#fff", left: "160px" }}
        >
          {t("START_LEARNING")}
        </Button>
      );
    } else {
      if (
        (batchData?.enrollmentEndDate &&
          new Date(batchData.enrollmentEndDate) < new Date()) ||
        (!batchData?.enrollmentEndDate &&
          batchData?.endDate &&
          new Date(batchData.endDate) < new Date())
      ) {
        return (
          <Typography
            variant="h7"
            style={{
              margin: "12px 0",
              display: "block",
              fontSize: "14px",
              color: "red",
            }}
          >
            {t("BATCH_EXPIRED_MESSAGE")}
          </Typography>
        );
      } else {
        const today = new Date();
        let lastDayOfEnrollment = null;

        if (batchData?.enrollmentEndDate) {
          const enrollmentEndDate = new Date(batchData.enrollmentEndDate);
          if (!isNaN(enrollmentEndDate.getTime())) {
            lastDayOfEnrollment = enrollmentEndDate;
          }
        }

        const isLastDayOfEnrollment =
          lastDayOfEnrollment &&
          lastDayOfEnrollment.toDateString() === today.toDateString();

        const isExpired =
          lastDayOfEnrollment &&
          lastDayOfEnrollment < formatDate(today) &&
          !isLastDayOfEnrollment;

        if (isExpired) {
          return (
            <Typography
              variant="h7"
              style={{
                margin: "12px 0",
                display: "block",
                fontSize: "14px",
                color: "red",
              }}
            >
              {t("BATCH_EXPIRED_MESSAGE")}
            </Typography>
          );
        }

        return (
          <Button
            onClick={handleJoinCourse}
            disabled={isExpired} // Only disable if expired (not on last day)
            variant="contained"
            style={{
              background: isExpired ? "#ccc" : "#004367",
              color: "#fff",
              left: "160px",
            }}
          >
            {t("JOIN_COURSE")}
          </Button>
        );
      }
    }
  };

  const handleJoinCourse = async () => {
    try {
      const url = "http://localhost:3000/learner/course/v1/enrol";
      const requestBody = {
        request: {
          courseId: contentId,
          userId: _userId,
          batchId: batchData?.batchId,
        },
      };
      const response = await axios.post(url, requestBody);
      if (response.status === 200) {
        setEnrolled(true);
        setShowEnrollmentSnackbar(true);
      }
    } catch (error) {
      console.error("Error enrolling in the course:", error);
    }
  };

  return (
    <div>
      <Header />
      <Snackbar
        open={showEnrollmentSnackbar}
        // autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ mt: 2 }}
        >
          {t("ENROLLMENT_SUCCESS_MESSAGE")}
        </MuiAlert>
      </Snackbar>

      <Container maxWidth="xxl" role="main" className="container-pb">
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4} lg={4} className="sm-p-25">
            <Grid container spacing={2}>
              <Grid item xs={8} className="xs-p-0">
                <Link
                  onClick={handleGoBack}
                  style={{
                    display: "block",
                    display: "flex",
                    fontSize: "14px",
                    paddingTop: "15px",
                    marginBottom: "10px",
                    color: "rgb(0, 67, 103)",
                  }}
                >
                  <ArrowBackOutlinedIcon
                    style={{ width: "0.65em", height: "0.65em" }}
                  />{" "}
                  {t("BACK")}
                </Link>
                <Breadcrumbs
                  aria-label="breadcrumb"
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  <Link
                    underline="hover"
                    href=""
                    aria-current="page"
                    color="#484848"
                  >
                    {userData?.result?.content?.name}
                  </Link>
                </Breadcrumbs>
              </Grid>
              <Grid item xs={4}>
                <Link
                  href="#"
                  style={{
                    textAlign: "right",
                    marginTop: "20px",
                    display: "block",
                  }}
                ></Link>
              </Grid>
            </Grid>

            <Box>
              <Typography
                variant="h7"
                style={{
                  margin: "12px 0 12px 0",
                  display: "block",
                  fontSize: "13px",
                }}
              >
                {t("RELEVANT_FOR")}:
                <Button
                  size="small"
                  style={{
                    background: "#ffefc2",
                    color: "#484848",
                    fontSize: "12px",
                    margin: "0 10px",
                    textTransform: "capitalize",
                  }}
                >
                  {userData?.result?.content?.children[0]?.children[0]?.board}
                </Button>
                <Button
                  size="small"
                  style={{
                    background: "#ffefc2",
                    color: "#484848",
                    fontSize: "12px",
                    textTransform: "capitalize",
                  }}
                >
                  {" "}
                  {
                    userData?.result?.content?.children[0]?.children[0]
                      .gradeLevel?.[0]
                  }
                </Button>
              </Typography>
            </Box>
            <Box
              style={{
                background: "#fee9dd",
                padding: "10px",
                borderRadius: "10px",
                color: "#484848",
              }}
            >
              <Typography
                variant="h7"
                style={{
                  margin: "0 0 9px 0",
                  display: "block",
                  fontSize: "16px",
                }}
              >
                {t("BATCH_DETAILS")}:
              </Typography>
              <Box
                style={{
                  background: "#fff",
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                <Typography
                  variant="h7"
                  style={{
                    fontWeight: "500",
                    margin: "9px 0",
                    display: "block",
                    fontSize: "14px",
                  }}
                >
                  {t("BATCH_START_DATE")}: {formatDate(batchData?.startDate)}
                </Typography>
                <Typography
                  variant="h7"
                  style={{
                    fontWeight: "500",
                    margin: "9px 0",
                    display: "block",
                    fontSize: "14px",
                  }}
                >
                  {t("BATCH_END_DATE")}: {formatDate(batchData?.endDate)}
                </Typography>
                <Typography
                  variant="h7"
                  style={{
                    fontWeight: "500",
                    margin: "9px 0",
                    display: "block",
                    fontSize: "14px",
                  }}
                >
                  {t("LAST_DATE_FOR_ENROLLMENT")}:{" "}
                  {formatDate(batchData?.enrollmentEndDate)}
                </Typography>
              </Box>
            </Box>
            {renderActionButton()}
            <Box>
              <Typography
                variant="h7"
                style={{
                  fontWeight: "700",
                  margin: "9px 0",
                  display: "block",
                  fontSize: "14px",
                }}
              >
                {t("DESCRIPTION")}:
              </Typography>
              <Typography
                variant="h7"
                className="twoLineEllipsis"
                style={{
                  margin: "9px 0",
                  display: "block",
                  fontSize: "14px",
                }}
              >
                {userData?.result?.content?.description}
              </Typography>
            </Box>

            <Accordion
              defaultExpanded
              style={{
                background: "#fee9dd",
                borderRadius: "10px",
                marginTop: "10px",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                {t("COURSES_MODULE")}
              </AccordionSummary>
              <AccordionDetails>
                {userData?.result?.content?.children.map((faqIndex) => (
                  <Accordion
                    key={faqIndex.id}
                    style={{ borderRadius: "10px", margin: "10px 0" }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${faqIndex.id}-content`}
                      id={`panel${faqIndex.id}-header`}
                    >
                      {faqIndex.name}
                    </AccordionSummary>
                    {faqIndex.children.map((faqIndexname) => (
                      <AccordionDetails style={{ paddingLeft: "35px" }}>
                        <SummarizeOutlinedIcon />

                        <Link
                          href="#"
                          key={faqIndexname.id}
                          style={{ verticalAlign: "super" }}
                          onClick={handleLinkClick}
                        >
                          {faqIndexname.name}
                        </Link>
                      </AccordionDetails>
                    ))}
                  </Accordion>
                ))}
              </AccordionDetails>
            </Accordion>
            <Accordion
              style={{
                background: "#fee9dd",
                borderRadius: "10px",
                marginTop: "10px",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                {t("CERTIFICATION_CRITERIA")}
              </AccordionSummary>
              <AccordionDetails style={{ background: "#fff" }}>
                <ul>
                  <li>{t("THE_COMPLETION_CERTIFICATE")}</li>
                  <li>{t("THE_CERTIFICATE_WILL_BE_ISSUES")}</li>
                </ul>
              </AccordionDetails>
            </Accordion>
            <Accordion
              style={{
                background: "#fee9dd",
                borderRadius: "10px",
                marginTop: "10px",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                {t("OTHER_DETAILS")}
              </AccordionSummary>
              <AccordionDetails style={{ background: "#fff" }}>
                <Typography
                  variant="h7"
                  style={{
                    fontWeight: "500",
                    margin: "9px 0",
                    display: "block",
                    fontSize: "14px",
                  }}
                >
                  {t("CREATED_ON")}:{" "}
                  {userData &&
                    userData.result &&
                    formatDate(userData.result.content.children[0].createdOn)}
                </Typography>
                <Typography
                  variant="h7"
                  style={{
                    fontWeight: "500",
                    margin: "9px 0",
                    display: "block",
                    fontSize: "14px",
                  }}
                >
                  {t("UPDATED_ON")}:{" "}
                  {userData &&
                    userData.result &&
                    formatDate(
                      userData.result.content.children[0].lastUpdatedOn
                    )}
                </Typography>
                <Typography
                  variant="h7"
                  style={{
                    fontWeight: "500",
                    margin: "9px 0",
                    display: "block",
                    fontSize: "14px",
                  }}
                >
                  {t("CREDITS")}:
                </Typography>
                <Typography
                  variant="h7"
                  style={{
                    fontWeight: "500",
                    margin: "9px 0",
                    display: "block",
                    fontSize: "14px",
                  }}
                >
                  {t("LICENSE_TERMS")}:{" "}
                  {userData?.result?.content?.licenseDetails?.name}
                  {t("FOR_DETAILS")}:{" "}
                  <a
                    href={userData?.result?.content?.licenseDetails?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {userData?.result?.content?.licenseDetails?.url}
                  </a>
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid
            item
            xs={8}
            className="xs-hide"
            style={{ borderLeft: "solid 1px #898989" }}
          >
            <Box
              sx={{
                background: "#EEEEEE",
                textAlign: "center",
                color: "#464665",
                fontSize: "18px",
                height: "600px",
              }}
            >
              <Box sx={{ transform: "translate(0%, 550%)" }}>
                {t("START_LEARNING")}
                <Box style={{ fontSize: "14px" }}>
                  {t("JOIN_THE_COURSE_SELECT_MODULE")}
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <FloatingChatIcon />
      <Footer />
    </div>
  );
};

export default JoinCourse;
