import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Link,
  Alert,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, Navigate } from "react-router-dom";
import image from "../../assets/bg.png";
import { useStore } from "configs/zustandStore";
const axios = require("axios");
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import { Dialog, DialogContent, DialogActions } from "@material-ui/core";

const Otp = () => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(""); // State to store OTP value
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true); // State to manage resend button disabled state
  const [remainingTime, setRemainingTime] = useState(60); // State to hold the remaining time
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [goToOtp, setGoToOtp] = useState(false);
  const dataStore = useStore((state) => state.data);
  const captchaResponse = dataStore.captchaResponse;
  const [open, setOpen] = useState(false);
  const [tncConfig, setTncConfig] = useState();
  const [tncConfigVersion, setTncConfigVersion] = useState();
  const [birthYear, setBirthYear] = useState(2000);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const storedUserData = dataStore.userData;
    if (storedUserData) {
      setUserData(storedUserData);
      setBirthYear(storedUserData.age);
      const latestVersion = JSON.parse(dataStore.tncConfig).latestVersion;
      setTncConfigVersion(latestVersion);
      const url = JSON.parse(dataStore.tncConfig)[latestVersion]?.url || "";
      setTncConfig(url);
    }
  }, [dataStore.userData, dataStore.tncConfig]);
  useEffect(() => {
    let timer;
    if (!resendDisabled) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime === 1) {
            setResendDisabled(true); // Disable resend button when timer expires
            clearInterval(timer); // Clear the timer
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [resendDisabled]);

  useEffect(() => {
    setResendDisabled(false); // Enable resend button
  }, []);

  useEffect(() => {
    if (remainingTime === 0) {
      setResendDisabled(true);
      setRemainingTime(60);
    }
  }, [remainingTime]);

  const handleLogin = () => {
    if (otp.length === 6) {
      verifyUser();
    }
  };

  const handleOtpChange = (value) => {
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLinkClick = () => {
    setOpen(true);
  };

  const verifyUser = async () => {
    setIsLoading(true);
    setError(null);

    const url = `https://nulp.niua.org/learner/otp/v1/verify`;
    const requestBody = {
      request: {
        key: userData && userData.email,
        type: "email",
        otp: otp,
      },
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to verify OTP");
      }

      const data = await response.json();
      await signupUser(data.reqData);
      acceptTermsAndConditions();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signupUser = async (reqData) => {
    setIsLoading(true);
    setError(null);

    const url = "http://localhost:3000/learner/user/v2/signup";
    const requestBody = {
      params: {
        source: "portal",
        signupType: "self",
      },
      request: {
        firstName: userData.name,
        password: userData.password,
        birthYear: userData.birthYear,
        email: userData.email,
        emailVerified: true,
        reqData: reqData,
      },
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to signup");
      }

      const data = await response.json();
      setGoToOtp(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (goToOtp) {
    return <Navigate to="/all" />;
  }

  const acceptTermsAndConditions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://nulp.niua.org/user/v2/accept/tnc",
        {
          request: {
            version: tncConfigVersion,
            identifier: userData.email,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to verify terms&condition");
      }

      const data = response.data;
      console.log("acceptTermsAndConditionsresponse:", data.result);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const generateOtp = async (email) => {
    const url = `http://localhost:3000/learner/anonymous/otp/v1/generate?captchaResponse=${captchaResponse}`;
    const requestBody = {
      request: {
        key: email,
        type: "email",
        templateId: "wardLoginOTP",
      },
    };
    try {
      const response = await axios.post(url, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to resend OTP");
      }

      const data = response.data;
    } catch (error) {
      console.log(error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  const resendOtp = () => {
    generateOtp(userData.email);
    setResendDisabled(false); // Enable resend button
  };
  const age = new Date().getFullYear() - birthYear;
  const tncText =
    age < 18 ? (
      <span>
        As a parent/guardian I understand & accept the NULP Terms of Use agree
        my child to register on NULP with the given information.
      </span>
    ) : (
      <span>
        I am 18+ years old and understand and accept the NULP Terms of Use
      </span>
    );
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  return (
    <>
      <Container
        maxWidth="sm"
        style={{
          textAlign: "center",
          backgroundPosition: "2px 426px",
          height: "100vh",
          // backgroundImage: `url(${image})`,
          // backgroundRepeat: "no-repeat",
          // backgroundSize: "contain",
        }}
      >
        <Box my={4}>
          <img src={require("../../assets/logo.png")} alt="Logo" />
        </Box>
        <Typography
          style={{ fontWeight: "600", fontSize: "16px", marginBottom: "40px" }}
        >
          {t("REGISTER")}
        </Typography>

        <Alert severity="info" style={{ textAlign: "left" }}>
          {t("PLEASE_ENTER_THE_VERFICATION_CODE_RECEIVED")}
        </Alert>
        <Typography
          style={{
            fontWeight: "400",
            fontSize: "12px",
            textAlign: "left",
            margin: "35px 0 10px 0",
          }}
        >
          {t("VERIFICATION_CODE")}
        </Typography>

        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="otp"
          label="OTP"
          name="otp"
          value={otp}
          onChange={(e) => handleOtpChange(e.target.value)}
          autoFocus
          inputProps={{ maxLength: 6 }}
        />

        <Button
          onClick={resendOtp}
          disabled={!resendDisabled}
          style={{
            textAlign: "right",
            fontSize: "10px",
            display: "block",
            marginTop: "10px",
          }}
        >
          {resendDisabled
            ? t("RESEND_OTP")
            : `Resend OTP in ${remainingTime}s`}
        </Button>
        <FormGroup style={{ flexDirection: "row", alignItems: "center",flexFlow:"row" }}>
          <FormControlLabel
            style={{ marginRight: "0" }}
            control={
              <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
            }
          />{" "}
          <Link href="#" onClick={handleLinkClick}>
            {" "}
            <span style={{ color: "#FF0000", marginLeft: "2px" }}>*</span>
            {tncText}
          </Link>
        </FormGroup>
        <Dialog open={open} onClose={handleClose} maxWidth="xxl" className="sm-w-700"
>
          <DialogContent>
            <h1 style={{fontSize:'22px'}}>Terms and Conditions  </h1>
            <iframe
              title="Terms and Conditions"
              src={tncConfig}
              style={{ width: "100%", height: "80vh", border: "none" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Box pt={4}>
          <Button
            onClick={handleLogin}
            disabled={!isChecked || otp.length < 5}
            style={{
              background:
                !isChecked || otp.length < 5
                  ? "rgba(0, 67, 103, 0.5)"
                  : "#004367",
              borderRadius: "10px",
              color: "#fff",
              padding: "10px 71px",
              fontWeight: "600",
              fontSize: "14px",
              margin: "20px 0 20px 0",
            }}
          >
            {t("SUBMIT")}
          </Button>
        </Box>
        <Box style={{ display: "flex", alignItems: "center" }}></Box>
        <Box py={1}>
          <Typography
            variant="h1"
            style={{
              fontWeight: "400",
              fontSize: "12px",
            }}
          >
            {t("ALREADY_HAVE_AN_ACCOUNT")}{" "}
            <Link href={`http://localhost:3000/all${window.location.search}`}>
              {t("LOGIN")}
            </Link>
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default Otp;
