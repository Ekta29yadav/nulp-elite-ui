// Profile.js

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Footer from "components/Footer";
import Header from "components/header";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SimCardDownloadOutlinedIcon from "@mui/icons-material/SimCardDownloadOutlined";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import data from "../../assets/certificates.json";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Card from "@mui/material/Card";
import FloatingChatIcon from "../../components/FloatingChatIcon";
import * as util from "../../services/utilService";
import axios from "axios";
import NoResult from "pages/content/noResultFound";
import Alert from "@mui/material/Alert";
import ToasterCommon from "../ToasterCommon";
import { Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import html2pdf from "html2pdf.js";

const Certificate = () => {
  const { t } = useTranslation();
  const [certData, setCertData] = useState(null);
  const [otherCertData, setOtherCertData] = useState([]);
  const [error, setError] = useState(null);
  const urlConfig = require("../../configs/urlConfig.json");
  const [toasterOpen, setToasterOpen] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const navigate = useNavigate();
  const [svgData, setSvgData] = useState("");
  const svgContainerRef = useRef(null);

  const showErrorMessage = (msg) => {
    setToasterMessage(msg);
    setTimeout(() => {
      setToasterMessage("");
    }, 2000);
    setToasterOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const _userId = util.userId();
        const request = {
          request: {
            _source: [
              "data.badge.issuer.name",
              "pdfUrl",
              "data.issuedOn",
              "data.badge.name",
            ],
            query: {
              bool: {
                must: [
                  {
                    match_phrase: {
                      "recipient.id": _userId,
                    },
                  },
                ],
              },
            },
          },
        };
        const url = `${urlConfig.URLS.LEARNER_PREFIX}${urlConfig.URLS.CERTIFICATE.CERT_SEARCH}`;
        const response = await axios.post(url, request);
        const data = response.data;
        setCertData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        showErrorMessage(t("FAILED_TO_FETCH_DATA"));
      }

      try {
        const _userId = util.userId();
        const request = {
          filters: {
            recipient: { id: { eq: _userId } },
          },
        };
        const url = `${urlConfig.URLS.LEARNER_PREFIX}${urlConfig.URLS.CERTIFICATE.CERTIF_SEARCH}`;
        const response = await axios.post(url, request);
        const data = response.data;
        setOtherCertData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        showErrorMessage(t("FAILED_TO_FETCH_DATA"));
      }
    };

    fetchData();
  }, []);

  const getCertificate = async (template, osid, certificateName) => {
    setError(null);
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${urlConfig.URLS.LEARNER_PREFIX}${urlConfig.URLS.USER.DOWNLOAD_CERTIFICATE}/${osid}`,
        withCredentials: true,
        headers: {
          Accept: "image/svg+xml",
          "Content-Type": "application/json, text/plain",
          template: template,
        },
      };

      const response = await axios.request(config);
      if (response.data) {
        setSvgData(response.data);
        await handleDownloadPdf(certificateName);
      }
    } catch (error) {
      console.error("Error fetching user certificate:", error);
      showErrorMessage(t("FAILED_TO_FETCH_DATA"));
    }
  };
  const getCertificateReport = async (id, certificateName) => {
    setError(null);
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${urlConfig.URLS.LEARNER_PREFIX}${urlConfig.URLS.USER.DOWNLOAD_CERTIFICATE_REPORT}/${id}`,
        withCredentials: true,
        headers: {
          Accept: "image/svg+xml",
          "Content-Type": "application/json, text/plain",
        },
      };

      const response = await axios.request(config);
      if (response.data) {
        setSvgData(response.data.result.printUri);
        await handleDownloadPdf(certificateName);
      }
    } catch (error) {
      console.error("Error fetching user certificate:", error);
      showErrorMessage(t("FAILED_TO_FETCH_DATA"));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };
  const handleGoBack = () => {
    navigate(-1);
  };
  useEffect(() => {
    if (svgData.startsWith("data:image/svg+xml,")) {
      const encodedSvg = svgData.slice("data:image/svg+xml,".length);
      const decodedSvgContent = decodeURIComponent(encodedSvg);
      setSvgData(decodedSvgContent);
    }
  }, [svgData]);

  const handleDownloadPdf = async (certificateName) => {
    const element = svgContainerRef.current;

    if (element) {
      const opt = {
        margin: 0,
        filename: `${certificateName}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      html2pdf().set(opt).from(element).save();
    }
  };
  return (
    <div>
      <Box className="lg-hide">
        <Header />
      </Box>
      {toasterMessage && <ToasterCommon response={toasterMessage} />}
      <Container
        maxWidth="xxl"
        role="main"
        className="container-pb mb-20  xs-pb-75"
      >
        {error && (
          <Alert severity="error" className="my-10">
            {error}
          </Alert>
        )}
        <Box textAlign="center" padding="10" className="xs-pt-15">
          <Box
            sx={{ fontSize: "18px", color: "#484848" }}
            className="lg-hide text-left my-15"
          >
            {t("MY_PROFILE")}
          </Box>
          <Box className="d-flex jc-bw alignItems-center lg-mb-20">
            <Box style={{ display: "flex", alignItems: "end" }}>
              <DescriptionOutlinedIcon style={{ paddingRight: "10px" }} />{" "}
              {t("DOWNLOAD_CERTIFICATES")}
            </Box>
            <Link
              type="button"
              href="/profile"
              className="viewAll xs-cert-btn"
              // onClick={handleGoBack}
            >
              {t("BACK_TO_LEARNNG")}
            </Link>
          </Box>
          <Card
            style={{ padding: "20px", textAlign: "left" }}
            className="xs-cert-bx"
          >
            <Grid container spacing={2} style={{ textAlign: "left" }}>
              {(!certData || certData.result.response.content.length === 0) &&
              otherCertData.length === 0 ? (
                <NoResult />
              ) : (
                <>
                  {certData &&
                    certData.result.response.content &&
                    certData.result.response.content.map((certificate) => (
                      <Grid item xs={12} md={4} key={certificate._id}>
                        <Card
                          sx={{
                            marginTop: "10px",
                            padding: "10px",
                            borderRadius: "10px",
                            border: "solid 1px #EFEFEF",
                            boxShadow: "none",
                            color: "#484848",
                          }}
                        >
                          <Typography
                            className="twoLineEllipsis"
                            variant="subtitle1"
                            color="text.secondary"
                            component="div"
                            style={{
                              fontSize: "14px",
                              paddingBottom: "0",
                              height: "42px",
                              fontWeight: "600",
                            }}
                          >
                            {certificate._source.data.badge.name}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            component="div"
                            style={{ fontSize: "12px" }}
                          >
                            {t("CERTIFICATE_GIVEN_BY")}:{" "}
                            {certificate._source.data.badge.issuer.name}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            component="div"
                            style={{ fontSize: "12px" }}
                          >
                            {t("CERTIFICATE_ISSUE_DATE")}:{" "}
                            {formatDate(certificate._source.data.issuedOn)}
                          </Typography>
                          <Box
                            style={{
                              display: "flex",
                              alignItems: "end",
                              color: "#1976d2",
                            }}
                            className="text-green"
                          >
                            <SimCardDownloadOutlinedIcon />
                            <Link
                              href={certificate._source.pdfUrl} // Corrected usage of pdfUrl
                              underline="none"
                              style={{
                                fontSize: "12px",
                                marginTop: "15px",
                                display: "block",
                              }}
                              key={certificate._id} // Add key prop
                              onClick={() => {
                                getCertificateReport(
                                  certificate._id,
                                  certificate._source.data.badge.name
                                );
                              }}
                            >
                              {t("CERTIFICATES")}
                            </Link>
                            <div
                              ref={svgContainerRef}
                              dangerouslySetInnerHTML={{ __html: svgData }}
                            />
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  {otherCertData.map((certificate) => (
                    <Grid item xs={12} md={4} key={certificate.osid}>
                      <Card
                        sx={{
                          marginTop: "10px",
                          padding: "10px",
                          borderRadius: "10px",
                          border: "solid 1px #EFEFEF",
                          boxShadow: "none",
                          color: "#484848",
                        }}
                      >
                        <Typography
                          className="twoLineEllipsis"
                          variant="subtitle1"
                          color="text.secondary"
                          component="div"
                          style={{
                            fontSize: "14px",
                            paddingBottom: "0",
                            height: "42px",
                            fontWeight: "600",
                          }}
                        >
                          {certificate.training.name}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          component="div"
                          style={{ fontSize: "12px" }}
                        >
                          {t("CERTIFICATE_GIVEN_BY")}: {certificate.issuer.name}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          component="div"
                          style={{ fontSize: "12px" }}
                        >
                          {t("CERTIFICATE_ISSUE_DATE")}:{" "}
                          {formatDate(certificate.osCreatedAt)}
                        </Typography>
                        <Box
                          style={{
                            display: "flex",
                            alignItems: "end",
                            color: "#1976d2",
                          }}
                          className="text-green"
                        >
                          <SimCardDownloadOutlinedIcon />
                          <Link
                            href={certificate.pdfUrl}
                            underline="none"
                            style={{
                              fontSize: "12px",
                              marginTop: "15px",
                              display: "block",
                            }}
                            key={certificate.osid}
                            onClick={() => {
                              getCertificate(
                                certificate.templateUrl,
                                certificate.osid,
                                certificate.training.name
                              );
                            }}
                          >
                            {t("CERTIFICATES")}
                          </Link>
                          <div
                            ref={svgContainerRef}
                            dangerouslySetInnerHTML={{ __html: svgData }}
                          />
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </>
              )}
            </Grid>
          </Card>
        </Box>
      </Container>
      <FloatingChatIcon />
      <Box className="lg-hide">
        <Footer />
      </Box>
    </div>
  );
};

export default Certificate;
