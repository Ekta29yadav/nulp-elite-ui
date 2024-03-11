import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import URLSConfig from "../configs/urlConfig.json";
import { post, get } from "@shiksha/common-lib";

const Certificate = () => {
  const [data, setData] = useState({});
  const [bathId, setbatchId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [organisationIds, setOrganisationIds] = useState("");
  useEffect(() => {
    validateCertificate();
    fetchCertificatePreferences();
    getBatchDetails();
  }, []);
  const headers = {
    "content-type": "Application/json",
  };

  const validateCertificate = async () => {
    try {
      const url =
        "http://localhost:3000/learner/" +
        URLSConfig.URLS.USER.VALIDATE_CERTIFICATE;
      const response = await post(url, data);
      console.log(response.data.result);
      setData(response.data.result);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchCertificatePreferences = async () => {
    try {
      const url =
        "http://localhost:3000/learner/" +
        URLSConfig.URLS.TENANT_PREFERENCE.READ;
      const response = await post(url, data);
      console.log(response.data.result);
      setData(response.data.result);
    } catch (error) {
      setError(error.message);
    }
  };

  const getBatchDetails = async () => {
    try {
      const url =
        "http://localhost:3000/learner/" +
        URLSConfig.URLS.BATCH.GET_DETAILS +
        "/" +
        `${bathId}`;
      const response = await get(url);
      console.log(response.data.result);
      setData(response.data.result);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFilterChange = (field, value) => {
    // Handle filter change logic here
  };

  return (
    <Box textAlign="center" padding="10">
      <Heading as="h1" size="2xl" marginBottom="4">
        Welcome to Our Learning Portal Content
      </Heading>
      <Text fontSize="xl" marginBottom="8">
        Enhance your knowledge and skills with our diverse range of courses and
        content.
      </Text>
      <Button colorScheme="blue" size="lg" onClick={validateCertificate}>
        Get User Data
      </Button>

      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {Object.keys(data).map((key) => (
        <div key={key}>
          <p>
            {key}: {JSON.stringify(data[key])}
          </p>
        </div>
      ))}
    </Box>
  );
};

export default Certificate;
