import React, { useState, useEffect } from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Modal as BaseModal, makeStyles } from "@material-ui/core";
import { styled, css } from "@mui/system";
import PropTypes from "prop-types";
import { Button } from "@mui/base/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Search from "components/search";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import * as util from "../../services/utilService";
import Header from "components/header";
import Footer from "components/Footer";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useTranslation } from "react-i18next";
import { useStore } from "configs/zustandStore";
import { Link as RouterLink } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Popover from "@mui/material/Popover";
import { Container } from "@mui/material";
import Alert from "@mui/material/Alert";
import Filter from "components/filter";
const axios = require("axios");
const designations = require("../../configs/designations.json");
const urlConfig = require("../../configs/urlConfig.json");
import Autocomplete from "@mui/material/Autocomplete";
import ToasterCommon from "../ToasterCommon";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import Grid from "@mui/material/Grid";
import Chat from "./chat";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
// Define modal styles
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: "100%",
    maxWidth: 600, // Adjust as needed
    borderRadius: 10, // Add rounded corners
    borderTopLeftRadius: 0, // Ensure modal appears attached to the bottom
    borderTopRightRadius: 0,
  },
}));

const AddConnections = () => {
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [showChat, setShowChat] = useState(false);
  const [buttonText, setButtonText] = useState("Invite");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState("Tab1");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [userSearchData, setUserSearchData] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [textValue, setTextValue] = useState(
    "Hello ..., I would like to connect with you regarding some queries i had in your course."
  );
  const [invitationAcceptedUsers, setInvitationAcceptedUsers] = useState();
  const [invitationNotAcceptedUsers, setInvitationNotAcceptedUsers] =
    useState();
  const [loggedInUserId, setLoggedInUserId] = useState();
  const location = useLocation();
  const [invitationReceiverByUser, setInvitationReceivedUserByIds] = useState();
  const [userChat, setUserChat] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState(false);
  const { t } = useTranslation();
  const setData = useStore((state) => state.setData);
  const [totalPages, setTotalPages] = useState(1);
  const [userQuerySearchData, setUserQuerySearchData] = useState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userInfo, setUserInfo] = useState();
  const [expandedMessageId, setExpandedMessageId] = useState(null);
  const [designationsList, setDesignationsList] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [userIds, setUserIds] = useState([]);
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [toasterOpen, setToasterOpen] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [showTableTwo, setShowTableTwo] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const navigate = useNavigate();
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const showErrorMessage = (msg) => {
    setToasterMessage(msg);
    setTimeout(() => {
      setToasterMessage("");
    }, 2000);
    setToasterOpen(true);
  };
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getChat = async (userId) => {
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams({
      sender_id: loggedInUserId,
      receiver_id: userId,
      is_accepted: true,
    });

    try {
      const url = `${
        urlConfig.URLS.DIRECT_CONNECT.GET_CHATS
      }?${params.toString()}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        showErrorMessage(t("FAILED_TO_FETCH_CHAT"));
        throw new Error(t("FAILED_TO_FETCH_CHAT"));
      }

      const responseData = await response.json();
      console.log("getChat", responseData.result);
      return responseData.result;
    } catch (error) {
      console.error("Error fetching data:", error);
      showErrorMessage(t("FAILED_TO_FETCH_CHAT"));
    } finally {
      setIsLoading(false);
    }
  };

  const getChatRequest = async (userId) => {
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams({
      sender_id: loggedInUserId,
      receiver_id: userId,
      is_accepted: false,
      is_read: false,
    });

    try {
      const url = `${
        urlConfig.URLS.DIRECT_CONNECT.GET_CHATS
      }?${params.toString()}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        showErrorMessage(t("FAILED_TO_FETCH_CHAT"));
        throw new Error(t("FAILED_TO_FETCH_CHAT"));
      }

      const responseData = await response.json();
      console.log("getChatRequest", responseData.result);
      return responseData.result;
    } catch (error) {
      showErrorMessage(t("FAILED_TO_FETCH_CHAT"));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopoverClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? "simple-popover" : undefined;

  const handlePageChange = (event, newValue) => {
    setCurrentPage(newValue);
  };

  useEffect(() => {
    setDesignationsList(designations);
    if (activeTab === "Tab2") {
      handleSearch();
    }
  }, [currentPage]);

  useEffect(() => {
    const _userId = util.userId();
    setLoggedInUserId(_userId);
    fetchUserInfo(_userId);
  }, []);

  const toggleChat = () => {
    setShowChat(!showChat);
    setButtonText(showChat ? t("INVITE") : t("SEND_INVITATION"));
  };

  useEffect(() => {
    onMyConnection();
  }, [loggedInUserId]);

  function handleClick(event) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsModalOpen(false);
  };

  const handleSearch = async (selectedUserId = "") => {
    setIsLoading(true);
    setUserSearchData([]);
    setUserFilter([]);

    let filters = {
      status: "1",
    };
    if (selectedUserId) {
      filters.userId = selectedUserId;
    }
    const requestBody = {
      request: {
        filters: filters,
        // query: searchQuery,
        limit: 10,
        offset: 10 * (currentPage - 1),
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
        showErrorMessage(t("FAILED_TO_FETCH_DATA"));
        throw new Error(t("FAILED_TO_FETCH_DATA"));
      }

      let responseData = await response.json();
      setTotalPages(Math.ceil(responseData?.result?.response?.count / 10));
      console.log("responseData", responseData);
      console.log(
        "user list of all type user",
        invitationAcceptedUsers,
        invitationNotAcceptedUsers,
        invitationReceiverByUser
      );
      const allTypeOfUsers = [
        ...(invitationAcceptedUsers || []),
        ...(invitationNotAcceptedUsers || []),
        ...(invitationReceiverByUser || []),
      ]
        .filter((e) => e.userId)
        .map((e) => e.userId);
      console.log("allTypeOfUsers", allTypeOfUsers);
      const responseUserData = responseData?.result?.response?.content?.filter(
        function (el) {
          return !allTypeOfUsers.includes(el.userId);
        }
      );
      const userInfoPromises = responseUserData.map((item) =>
        fetchUserInfo(item.id)
      );
      const userInfoList = await Promise.all(userInfoPromises);

      // Add designation and bio to each item
      responseUserData.forEach((item, index) => {
        item.designation = userInfoList[index].designation || "";
        item.bio = userInfoList[index].bio || "";
      });
      console.log("responseUserData", responseUserData);
      setUserSearchData(responseUserData);
      setUserFilter(responseUserData);
      console.log("responseSearchData", responseData);
    } catch (error) {
      showErrorMessage(t("FAILED_TO_FETCH_DATA"));
    } finally {
      setIsLoading(false);
    }
  };

  const onUserQuerySearch = async () => {
    setIsLoading(true);
    setError(null);
    setUserQuerySearchData([]);
    const requestBody = {
      request: {
        filters: {
          status: "1",
        },
        query: searchQuery,
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
        showErrorMessage(t("FAILED_TO_FETCH_DATA"));
        throw new Error(t("FAILED_TO_FETCH_DATA"));
      }

      let responseData = await response.json();

      // Fetch user info for all items concurrently
      const content = responseData?.result?.response?.content || [];
      const userInfoPromises = content.map((item) => fetchUserInfo(item.id));
      const userInfoList = await Promise.all(userInfoPromises);

      // Add designation add bio to each item
      content.forEach((item, index) => {
        item.designation = userInfoList[index].designation || "";
        item.bio = userInfoList[index].bio || "";
      });
      setUserQuerySearchData(content);
    } catch (error) {
      console.error("Error fetching data:", error);
      showErrorMessage(t("FAILED_TO_FETCH_DATA"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserClick = (selectedUser) => {
    setSelectedUser(selectedUser);
  };
  const handleTextareaChange = (event) => {
    setTextValue(event.target.value);
  };

  const handleSendClick = async () => {
    try {
      await sendChatRequestToUser(selectedUser.userId);
      handleClose();
      setShowModal(true);
    } catch (error) {
      console.error("Error sending chat request:", error);
      showErrorMessage(t("FAILED_TO_FETCH_DATA"));
    }
  };

  const userClick = (selectedUser) => {
    setSelectedUser(selectedUser);
    setShowChatModal(true);
  };
  const getConnections = async () => {
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams({
      sender_id: loggedInUserId,
      receiver_id: loggedInUserId,
      is_connection: true,
    });

    try {
      const url = `${
        urlConfig.URLS.DIRECT_CONNECT.GET_CHATS
      }?${params.toString()}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        showErrorMessage(t("FAILED_TO_FETCH_CHAT"));
        throw new Error(t("FAILED_TO_FETCH_CHAT"));
      }
      setInvitationReceivedUserByIds([]);
      setInvitationAcceptedUsers([]);
      setInvitationNotAcceptedUsers([]);
      const responseData = await response.json();
      console.log("getConnections", responseData.result);

      const invitationNotAcceptedUserIds = responseData.result
        .filter((res) => !res.is_accepted && res.sender_id === loggedInUserId)
        .map((res) => res.receiver_id);

      const sender = responseData.result
        .filter((res) => res.is_accepted && res.receiver_id === loggedInUserId)
        .map((res) => res.sender_id);
      const receiver = responseData.result
        .filter((res) => res.is_accepted && res.sender_id === loggedInUserId)
        .map((res) => res.receiver_id);
      const invitationAcceptedUserIds = sender.concat(receiver);

      const invitationReceivedUserIds = responseData.result
        .filter(
          (res) =>
            !res.is_accepted &&
            res.receiver_id == loggedInUserId &&
            res.sender_id !== loggedInUserId
        )
        .map((res) => res.sender_id);

      invitationReceivedUserIds.length > 0 &&
        getInvitationReceivedUserByIds(invitationReceivedUserIds);
      invitationNotAcceptedUserIds.length > 0 &&
        getInvitationNotAcceptedUserByIds(invitationNotAcceptedUserIds);
      invitationAcceptedUserIds.length > 0 &&
        getInvitationAcceptedUserByIds(invitationAcceptedUserIds);
    } catch (error) {
      console.error("Error fetching data:", error);

      showErrorMessage(t("FAILED_TO_FETCH_CHAT"));
    } finally {
      setIsLoading(false);
    }
  };

  const getInvitationNotAcceptedUserByIds = async (userIds) => {
    setIsLoading(true);
    setError(null);
    setInvitationNotAcceptedUsers([]);

    const requestBody = {
      request: {
        filters: {
          status: "1",
          userId: userIds,
        },
        // query: searchQuery,
        // pageNumber: currentPage,
        // pageSize: pageSize,
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
        showErrorMessage(t("FAILED_TO_FETCH_DATA"));
        throw new Error(t("FAILED_TO_FETCH_DATA"));
      }

      const responseData = await response.json();
      const content = responseData?.result?.response?.content || [];
      const userInfoPromises = content.map((item) => fetchUserInfo(item.id));
      const userInfoList = await Promise.all(userInfoPromises);

      // Add designation and bio to each item
      content.forEach((item, index) => {
        item.designation = userInfoList[index].designation || "";
        item.bio = userInfoList[index].bio || "";
      });
      setInvitationNotAcceptedUsers(content);
      handleOpen();
      handleClose();

      console.log(
        "InvitationNotAcceptedUsers",
        responseData.result.response.content
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      showErrorMessage(t("FAILED_TO_FETCH_DATA"));
    } finally {
      setIsLoading(false);
    }
    console.log("invitationNotAcceptedUsers", invitationNotAcceptedUsers);
  };

  const getInvitationAcceptedUserByIds = async (userIds) => {
    setIsLoading(true);
    setError(null);
    setInvitationAcceptedUsers([]);

    const requestBody = {
      request: {
        filters: {
          status: "1",
          userId: userIds,
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
        showErrorMessage(t("FAILED_TO_FETCH_DATA"));
        throw new Error(t("FAILED_TO_FETCH_DATA"));
      }

      const responseData = await response.json();
      const userList = responseData?.result?.response?.content || [];

      const userListWithChat = await Promise.all(
        userList.map(async (item) => {
          const userChat = await getChat(item.id);

          if (userChat?.length > 0) {
            // Find the latest chat message
            const latestChat = userChat.reduce((latest, current) => {
              return new Date(current.timestamp) > new Date(latest.timestamp)
                ? current
                : latest;
            });

            const allRead = userChat.every((chat) => {
              if (loggedInUserId !== chat.sender_id) {
                return chat.is_read;
              }
              return true;
            });
            item = {
              ...item,
              latestChat: latestChat.message,
              isRead: allRead,
            };
          } else {
            item = { ...item, latestChat: null, isRead: true };
          }

          return item;
        })
      );

      const userInfoPromises = userListWithChat.map((item) =>
        fetchUserInfo(item.id)
      );
      const userInfoList = await Promise.all(userInfoPromises);

      // Add designation and bio to each item
      userListWithChat.forEach((item, index) => {
        item.designation = userInfoList[index].designation || "";
        item.bio = userInfoList[index].bio || "";
      });

      setInvitationAcceptedUsers(userListWithChat || []);
      console.log(
        "InvitationAcceptedUsers",
        responseData.result.response.content
      );
    } catch (error) {
      showErrorMessage(t("FAILED_TO_FETCH_DATA"));
    } finally {
      setIsLoading(false);
    }
  };

  const getInvitationReceivedUserByIds = async (userIds) => {
    setIsLoading(true);
    setError(null);
    setInvitationReceivedUserByIds([]);
    const requestBody = {
      request: {
        filters: {
          status: "1",
          userId: userIds,
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
        showErrorMessage(t("FAILED_TO_FETCH_DATA"));
        throw new Error(t("FAILED_TO_FETCH_DATA"));
      }

      const responseData = await response.json();
      const content = responseData?.result?.response?.content || [];

      const userListWithChat = await Promise.all(
        content.map(async (item) => {
          const userChat = await getChatRequest(item.id);
          if (userChat?.length > 0) {
            item = { ...item, messageRequest: userChat[0]?.message };
          }
          return item;
        })
      );

      const userInfoPromises = userListWithChat.map((item) =>
        fetchUserInfo(item.id)
      );
      const userInfoList = await Promise.all(userInfoPromises);

      userListWithChat.forEach((item, index) => {
        item.designation = userInfoList[index].designation || "";
        item.bio = userInfoList[index].bio || "";
      });

      setInvitationReceivedUserByIds(userListWithChat);
      handleOpen();
      handleClose();
      console.log(
        "getInvitationReceivedUserByIds",
        responseData.result.response.content
      );
    } catch (error) {
      showErrorMessage(t("FAILED_TO_FETCH_DATA"));
    } finally {
      setIsLoading(false);
    }
  };

  const onMyConnection = () => {
    if (loggedInUserId) {
      getConnections();
    }
  };

  const handleAcceptedChatOpen = (userId, name, designation) => {
    const dataToSend = {
      userId: userId,
      fullName: name,
      designation: designation,
    };
    localStorage.setItem("userId", userId);
    localStorage.setItem("chatName", name);
    localStorage.setItem("designation", designation);
    setData(dataToSend);
    setSelectedUserName(name);
    getUserChat(userId);
    setIsModalOpen(true);
    setOpen(true);
    // return <Navigate to={`/message`} />;
  };

  const handleCloseChatHistoryModal = () => {
    setOpen(false);
  };

  const handleNotAcceptedChatOpen = () => {
    getUserChatNotAccepted();
  };

  const acceptChat = (userId) => {
    acceptChatInvitation(userId);
  };

  const rejectChat = (userId) => {
    rejectChatInvitation(userId);
  };

  const acceptChatInvitation = async (userId) => {
    setIsLoading(true);
    setError(null);

    const requestBody = {
      sender_id: userId,
      receiver_id: loggedInUserId,
    };

    try {
      const url = `${urlConfig.URLS.DIRECT_CONNECT.ACCEPT_CHAT}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        showErrorMessage(t("FAILED_TO_FETCH_DATA"));
        throw new Error(t("FAILED_TO_FETCH_DATA"));
      }

      const responseData = await response.json();
      console.log("acceptChatInvitation", responseData.result);
      onMyConnection();
    } catch (error) {
      showErrorMessage(t("FAILED_TO_FETCH_DATA"));
    } finally {
      setIsLoading(false);
    }
  };

  const rejectChatInvitation = async (userId) => {
    setIsLoading(true);
    setError(null);
    const requestBody = {
      sender_id: userId,
      receiver_id: loggedInUserId,
    };

    try {
      const url = `${urlConfig.URLS.DIRECT_CONNECT.REJECT_CHAT}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        showErrorMessage(t("FAILED_TO_FETCH_DATA"));
        throw new Error(t("FAILED_TO_FETCH_DATA"));
      }

      const responseData = await response.json();
      console.log("rejectChatInvitation", responseData.result);
      onMyConnection();
    } catch (error) {
      console.error("Error fetching data:", error);
      showErrorMessage(t("FAILED_TO_FETCH_DATA"));
    } finally {
      setIsLoading(false);
    }
  };

  const getUserChat = async (userId) => {
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams({
      sender_id: loggedInUserId,
      receiver_id: loggedInUserId,
      is_accepted: true,
      is_connection: true,
    });

    try {
      const url = `${
        urlConfig.URLS.DIRECT_CONNECT.GET_CHATS
      }?${params.toString()}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        showErrorMessage(t("FAILED_TO_FETCH_CHAT"));
        throw new Error(t("FAILED_TO_FETCH_CHAT"));
      }

      const responseData = await response.json();
      console.log("getUserChat", responseData.result);
      const userChats = responseData.result.filter(
        (res) =>
          (res.sender_id === loggedInUserId && res.receiver_id === userId) ||
          (res.sender_id === userId && res.receiver_id === loggedInUserId)
      );
      setUserChat(userChats);
    } catch (error) {
      console.error("Error fetching data:", error);

      showErrorMessage(t("FAILED_TO_FETCH_CHAT"));

      // Open the toaster
    } finally {
      setIsLoading(false);
    }
  };

  const sendChatRequestToUser = async (userId) => {
    setIsLoading(true);
    setError(null);

    const requestBody = {
      sender_id: loggedInUserId,
      receiver_id: userId,
      message: textValue,
      sender_email: "sender@gmail.com",
      receiver_email: "receiver@gmail.com",
    };

    try {
      const url = `${urlConfig.URLS.DIRECT_CONNECT.SEND_CHATS}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        showErrorMessage(t("FAILED_TO_FETCH_DATA"));
        throw new Error(t("FAILED_TO_FETCH_DATA"));
      }
      setSelectedUser("");
      console.log("sentChatRequest", response);
    } catch (error) {
      console.error("Error fetching data:", error);
      showErrorMessage(t("FAILED_TO_FETCH_DATA"));
    } finally {
      setIsLoading(false);
    }
  };

  const onClickSearchedUser = (selectedUserId) => {
    // handlePopoverClose();
    const allTypeOfUsers = [
      ...(invitationAcceptedUsers || []),
      ...(invitationNotAcceptedUsers || []),
      ...(invitationReceiverByUser || []),
    ];
    if (activeTab === "Tab1") {
      if (
        allTypeOfUsers &&
        allTypeOfUsers.find((user) => user.userId === selectedUserId)
      ) {
        emptyOtherSectionsFromMyConnection(selectedUserId);
      } else {
        handleTabClick("Tab2");
        setValue("2");
        handleSearch(selectedUserId);
      }
    } else {
      if (
        allTypeOfUsers &&
        allTypeOfUsers.find((user) => user.userId === selectedUserId)
      ) {
        emptyOtherSectionsFromMyConnection(selectedUserId);
        handleTabClick("Tab1");
        setValue("1");
      } else {
        handleSearch(selectedUserId);
      }
    }
  };

  const emptyOtherSectionsFromMyConnection = (selectedUserId) => {
    if (
      invitationReceiverByUser &&
      invitationReceiverByUser.find((user) => user.userId === selectedUserId)
    ) {
      setInvitationReceivedUserByIds(
        invitationReceiverByUser.filter(
          (user) => user.userId === selectedUserId
        )
      );
      setInvitationAcceptedUsers([]);
      setInvitationNotAcceptedUsers([]);
    } else if (
      invitationAcceptedUsers &&
      invitationAcceptedUsers.find((user) => user.userId === selectedUserId)
    ) {
      setInvitationAcceptedUsers(
        invitationAcceptedUsers.filter((user) => user.userId === selectedUserId)
      );
      setInvitationReceivedUserByIds([]);
      setInvitationNotAcceptedUsers([]);
    } else if (
      invitationNotAcceptedUsers &&
      invitationNotAcceptedUsers.find((user) => user.userId === selectedUserId)
    ) {
      setInvitationNotAcceptedUsers(
        invitationNotAcceptedUsers.filter(
          (user) => user.userId === selectedUserId
        )
      );
      setInvitationAcceptedUsers([]);
      setInvitationReceivedUserByIds([]);
    }
  };
  const fetchUserInfo = async (userId) => {
    try {
      const url = `${urlConfig.URLS.POFILE_PAGE.USER_READ}`;
      const response = await axios.post(
        url,
        { user_ids: [userId] },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setUserInfo(response.data.result);
      return response.data.result[0] || {};
    } catch (error) {
      showErrorMessage(t("FAILED_TO_FETCH_DATA"));
      console.error(error);
    }
  };

  useEffect(() => {
    if (searchQuery.length >= 3) {
      onUserQuerySearch(searchQuery);
    }
  }, [searchQuery]);
  const handleShowFullMessage = (itemId) => {
    setExpandedMessageId(itemId === expandedMessageId ? null : itemId);
  };
  const handleDesignationFilter = async (event) => {
    const userDesignation = await handleFilter(event);

    setUserIds(userDesignation);
    let filters = {
      status: "1",
    };
    if (userDesignation && userDesignation?.length > 0) {
      filters.userId = userDesignation;
    }
    const responseUserData = await handleFilterChange(filters);
    setUserSearchData(responseUserData);
  };

  const handleUserNameFilter = async (event) => {
    let filters = {
      status: "1",
    };
    if (event) {
      filters.firstName = event;
    }
    const responseUserData = await handleFilterChange(filters);
    setUserSearchData(responseUserData);
  };

  const handleFilter = async (event) => {
    try {
      const url = `${urlConfig.URLS.POFILE_PAGE.USER_READ}`;
      const response = await axios.post(
        url,
        { designations: event },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setUserInfo(response.data.result);
      const newIds = response.data.result.map((item) => item.user_id);
      return newIds;
    } catch (error) {
      console.error(error);
      showErrorMessage(t("FAILED_TO_FETCH_DATA"));
    }
  };

  const handleFilterChange = async (filters) => {
    setIsLoading(true);
    setError(null);
    setUserSearchData([]);

    const requestBody = {
      request: {
        filters: filters,
        limit: 10,
        offset: 10 * (currentPage - 1),
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
        showErrorMessage(t("FAILED_TO_FETCH_DATA"));
        throw new Error(t("FAILED_TO_FETCH_DATA"));
      }

      let responseData = await response.json();
      setTotalPages(Math.ceil(responseData?.result?.response?.count / 10));
      const responseUserData = responseData?.result?.response?.content;
      const userInfoPromises = responseUserData.map((item) =>
        fetchUserInfo(item.id)
      );
      const userInfoList = await Promise.all(userInfoPromises);

      // Add designation and bio to each item
      responseUserData.forEach((item, index) => {
        item.designation = userInfoList[index].designation || "";
        item.bio = userInfoList[index].bio || "";
      });

      setUserSearchData(responseUserData);
      return responseUserData;
    } catch (error) {
      showErrorMessage(t("FAILED_TO_FETCH_DATA"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!autocompleteOpen) {
      setOptions([]);
    }
  }, [autocompleteOpen]);

  const fetchOptions = async (searchQuery) => {
    const requestBody = {
      request: {
        filters: {
          status: "1",
        },
        query: searchQuery,
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
        throw new Error("Failed to fetch data");
      }

      let responseData = await response.json();
      return responseData?.result?.response?.content || [];
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = async (event, newInputValue) => {
    setInputValue(newInputValue);
    if (newInputValue.length >= 3) {
      const fetchedOptions = await fetchOptions(newInputValue);
      setOptions(fetchedOptions);
      setAutocompleteOpen(true);
    } else {
      setAutocompleteOpen(false);
    }
  };

  const getOptionLabel = (option) =>
    `${option.firstName}${option.lastName ? ` ${option.lastName}` : ""}`;

  const handleOnSelectSearchedUser = (event, user) => {
    onClickSearchedUser(user?.userId);
    console.log("Selected Option:", user);
  };
  const handleButtonClick = () => {
    setSelectedChatUser(null);
    setShowTableTwo(true);
  };
  const handleBackClick = () => {
    setShowTableTwo(false);
    handleTabClick("Tab1");
    setCurrentPage(1);
    onMyConnection();
    setSelectedChatUser(null);
  };
  const showMessages = (creatorId) => {
    if (isMobile) {
      navigate("/chat", {
        state: { senderUserId: loggedInUserId, receiverUserId: creatorId },
      });
    } else {
      setSelectedChatUser({
        senderUserId: loggedInUserId,
        receiverUserId: creatorId,
      });
      setSelectedUserId(creatorId);
    }
  };

  const handleRejectClick = () => {
    setOpen(true);
  };

  const handleConfirmReject = (userId) => {
    rejectChat(userId);
    setOpen(false);
  };

  return (
    <Box>
      <Header />
      {toasterMessage && <ToasterCommon response={toasterMessage} />}
      <Container maxWidth="xxl" role="main" className="pt-0 xs-p-0 xs-pb-75">
        {error && (
          <Alert severity="error" className="my-10">
            {error}
          </Alert>
        )}

        <Box textAlign="center" padding="10">
          <Box>
            {/* <input
              label="Search for a user..."
              type="text"
              onChange={(e) => {
                const value = e.target.value.trim();
                setSearchQuery(value);
                if (value.length >= 3) {
                  handlePopoverClick(e);
                }
              }}
              style={{
                width: "99%",
                margin: "20px 0",
                marginRight: "0.5rem",
                padding: "10px 0 10px 0",
                borderRadius: "4px",
                border: "1px solid #CACACA",
              }}
            />
          </Box> */}

            <Grid container spacing={2} className="pt-8 xs-p-0">
              <Grid
                item
                xs={12}
                md={4}
                lg={4}
                className="sm-p-25 left-container mt-2 pr-16 xs-shadow-none"
              >
                <Box
                  className="d-flex my-15"
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box className="h4-title">{t("CONNECTION")}</Box>
                  {!showTableTwo ? (
                    <Button
                      type="button"
                      className="custom-btn-default xs-mr-10"
                      onClick={() => {
                        setCurrentPage(1);
                        handleSearch();
                        handleButtonClick();
                      }}
                    >
                      {t("ADD_NEW")}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className="viewAll xs-mr-10"
                      onClick={handleBackClick}
                    >
                      {t("BACK")}
                    </Button>
                  )}
                </Box>
                <TabContext value={value} className="addConnection">
                  {!showTableTwo ? (
                    <>
                      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <TabList
                          onChange={handleChange}
                          aria-label="lab API tabs example"
                        >
                          <Tab
                            label="My Connections"
                            value="1"
                            style={{ fontSize: "12px", color: "#484848" }}
                            onClick={() => {
                              handleTabClick("Tab1");
                              setCurrentPage(1);
                              onMyConnection();
                            }}
                          />
                          <Tab
                            label={`Connection Requests (${
                              invitationReceiverByUser?.length || 0
                            })`}
                            value="2"
                            style={{ fontSize: "12px", color: "#484848" }}
                            onClick={() => {
                              handleTabClick("Tab2");
                            }}
                          />
                          <Tab
                            label="Block Users"
                            value="3"
                            style={{ fontSize: "12px", color: "#484848" }}
                          />
                        </TabList>
                      </Box>

                      <TabPanel value="1" style={{ padding: "0" }}>
                        <Box className="scroll-45">
                          {invitationReceiverByUser &&
                            invitationReceiverByUser.length === 0 &&
                            invitationAcceptedUsers &&
                            invitationAcceptedUsers.length === 0 &&
                            invitationNotAcceptedUsers &&
                            invitationNotAcceptedUsers.length === 0 && (
                              <Box>
                                <p>{t("NO_USERS_FOUND")}</p>
                              </Box>
                            )}

                          {invitationAcceptedUsers &&
                            invitationAcceptedUsers.map((item) => (
                              <List
                                sx={{}}
                                style={{ color: "green", cursor: "pointer" }}
                                className="connection-tab"
                                key={item.userId}
                              >
                                <ListItem
                                  onClick={() => {
                                    showMessages(item.userId);
                                  }}
                                  className="bg-blue"
                                  style={{
                                    fontWeight:
                                      item.userId === selectedUserId
                                        ? "bold"
                                        : "normal",
                                    color:
                                      item.userId === selectedUserId
                                        ? "black"
                                        : "inherit",
                                  }}
                                >
                                  <ListItemText
                                    primary={
                                      <span
                                        style={{
                                          color:
                                            item.userId === selectedUserId
                                              ? "black"
                                              : item.isRead === false
                                              ? "black"
                                              : "black",
                                          fontWeight:
                                            item.userId === selectedUserId
                                              ? "bold"
                                              : item.isRead === false
                                              ? "bold"
                                              : "normal",
                                        }}
                                      >
                                        {`${item.firstName} ${
                                          item.lastName ? item.lastName : " "
                                        } |  ${item.designation}`}
                                      </span>
                                    }
                                    secondary={item.latestChat}
                                    onClick={() =>
                                      handleAcceptedChatOpen(
                                        item.userId,
                                        `${item.firstName}${
                                          item.lastName
                                            ? ` ${item.lastName}`
                                            : ""
                                        }`,
                                        item.designation
                                      )
                                    }
                                  />
                                </ListItem>
                                <Divider />
                              </List>
                            ))}

                          {invitationNotAcceptedUsers &&
                            invitationNotAcceptedUsers?.map((item) => (
                              <List
                                sx={{}}
                                style={{ fontSize: "14px", cursor: "pointer" }}
                                onClick={() => userClick(item)}
                                className="connection-tab"
                              >
                                <ListItem>
                                  <ListItemText
                                    primary={`${item.firstName} ${
                                      item.lastName ? item.lastName : ""
                                    } | ${item.designation}`}
                                  />
                                </ListItem>
                                <Box className="left-bx">
                                  <custom-chip>{t("REQUEST_SENT")}</custom-chip>
                                </Box>
                                <Divider />
                              </List>
                            ))}
                          <div>
                            {showChatModal && (
                              <Modal
                                open={showChatModal}
                                onClose={handleCloseModal}
                                aria-labelledby="modal-title"
                                aria-describedby="modal-desc"
                                className="sx-bottom"
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "flex-end",
                                  pt: "10vh",
                                  p: "0",
                                }}
                              >
                                <ModalContent sx={{ width: 400 }} style={{}}>
                                  <div style={{ textAlign: "center" }}>
                                    <h2
                                      style={{
                                        fontSize: "14px",
                                        textAlign: "center",
                                        padding: "13px",
                                      }}
                                    >
                                      {t("INVITATION_NOT_ACCEPTED")}
                                    </h2>
                                    <Button
                                      onClick={(e) => {
                                        setShowChatModal(false);
                                      }}
                                      className="custom-btn-primary"
                                    >
                                      {t("CLOSE")}
                                    </Button>
                                  </div>
                                </ModalContent>
                              </Modal>
                            )}
                          </div>
                        </Box>
                      </TabPanel>
                      <TabPanel value="2">
                        <Box className="scroll">
                          {invitationReceiverByUser &&
                            invitationReceiverByUser?.map((item) => (
                              <List
                                sx={{}}
                                style={{ color: "gray", cursor: "pointer" }}
                              >
                                <ListItem
                                  key={item.userId}
                                  className="connection-tab"
                                >
                                  <ListItemText
                                    style={{ fontSize: "14px", color: "#000" }}
                                    primary={`${item.firstName}${
                                      item.lastName ? ` ${item.lastName}` : ""
                                    } | ${item.designation}`}
                                    secondary={
                                      item.messageRequest.length > 20 ? (
                                        <div
                                          style={{
                                            border: "1px solid #ddd",
                                            padding: "3px 10px",
                                            borderRadius: "5px",
                                            color: "#00000080",
                                            fontSize: "12px",
                                            marginTop: "10px",
                                          }}
                                        >
                                          {expandedMessageId === item.userId
                                            ? item.messageRequest
                                            : `${item.messageRequest.substring(
                                                0,
                                                20
                                              )}`}
                                          <span
                                            style={{
                                              color: "#0E7A9C",
                                              cursor: "pointer",
                                            }}
                                            onClick={() =>
                                              handleShowFullMessage(item.userId)
                                            }
                                          >
                                            {" "}
                                            {expandedMessageId === item.userId
                                              ? "read less"
                                              : "read more"}
                                          </span>
                                        </div>
                                      ) : (
                                        item.messageRequest
                                      )
                                    }
                                  />
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      marginTop: "10px",
                                    }}
                                  >
                                    <Link
                                      href="#"
                                      underline="none"
                                      color="#004367"
                                      onClick={() => acceptChat(item.userId)}
                                      style={{ marginLeft: "10px" }}
                                    >
                                      <CheckCircleOutlineIcon
                                        style={{
                                          fontSize: "22px",
                                          color: "#484848",
                                        }}
                                      />
                                    </Link>
                                    <span style={{ margin: "0 5px" }}></span>
                                    <Link
                                      href="#"
                                      underline="none"
                                      color="#7d7a7a"
                                      onClick={handleRejectClick}
                                    >
                                      <CancelOutlinedIcon
                                        style={{
                                          fontSize: "22px",
                                          color: "#484848",
                                        }}
                                      />
                                    </Link>

                                    <Dialog open={open} onClose={handleClose}>
                                      <DialogTitle>
                                        {"Are you sure?"}
                                      </DialogTitle>
                                      <DialogContent>
                                        <DialogContentText>
                                          {t(
                                            "ARE_YOU_SURE_YOU_WANT_TO_REJECT_THIS_REQUEST"
                                          )}
                                        </DialogContentText>
                                      </DialogContent>
                                      <DialogActions>
                                        <Button
                                          type="button"
                                          className="custom-btn-primary"
                                          onClick={handleClose}
                                        >
                                          {t("CANCEL")}
                                        </Button>
                                        <Button
                                          onClick={() =>
                                            handleConfirmReject(item.userId)
                                          }
                                          type="button"
                                          className="custom-btn-primary"
                                          autoFocus
                                        >
                                          {t("OK")}
                                        </Button>
                                      </DialogActions>
                                    </Dialog>
                                  </div>
                                </ListItem>

                                <Divider />
                              </List>
                            ))}
                        </Box>
                      </TabPanel>
                      <TabPanel value="3">
                        <Box className="scroll">{t("BLOCK_USER_LIST")}</Box>
                      </TabPanel>
                    </>
                  ) : (
                    <Box>
                      <Box
                        display="flex"
                        my={3}
                        justifyContent="center"
                        style={{ borderBottom: "solid 1px #ddd" }}
                      >
                        <Box className="h5-title xs-text-left">
                          {t("ADD_NEW_CONNECTION")}
                        </Box>
                      </Box>
                      <Autocomplete
                        id="autocomplete-input"
                        open={autocompleteOpen}
                        onClose={() => {
                          setAutocompleteOpen(false);
                        }}
                        options={options}
                        noOptionsText={t("NO_USERS_FOUND")}
                        getOptionLabel={getOptionLabel} // Adjust this based on your API response structure
                        getOptionKey={(option) => option.userId}
                        onChange={handleOnSelectSearchedUser}
                        inputValue={inputValue}
                        onInputChange={handleInputChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Search for a User"
                            className="searchUser"
                            variant="outlined"
                          />
                        )}
                      />
                      <div>
                        <Popover
                          id={id}
                          open={openPopover}
                          anchorEl={anchorEl}
                          onClose={handlePopoverClose}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                        >
                          <Typography sx={{ p: 2 }}>
                            {userQuerySearchData &&
                              userQuerySearchData?.length > 0 &&
                              userQuerySearchData?.map((item) => (
                                <List
                                  sx={{}}
                                  style={{ color: "gray", cursor: "pointer" }}
                                >
                                  <ListItem>
                                    <ListItemText
                                      primary={`${item.firstName}${
                                        item.lastName ? ` ${item.lastName}` : ""
                                      }`}
                                      secondary={`${item.designation}`}
                                      onClick={() =>
                                        onClickSearchedUser(item.userId)
                                      }
                                    />
                                  </ListItem>
                                  <Divider />
                                </List>
                              ))}
                            {(!userQuerySearchData ||
                              userQuerySearchData.length === 0) && (
                              <Box>
                                <p>{t("NO_USERS_FOUND")}</p>
                              </Box>
                            )}
                          </Typography>
                        </Popover>
                      </div>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                        className="filter-domain my-20 connection-tab"
                      >
                        {/* {userFilter && (
                          <Filter
                            options={userFilter.map((user) => user.firstName)}
                            label="Filter by Name"
                            onChange={handleUserNameFilter}
                            className="w-30"
                          />
                        )} */}

                        <Filter
                          options={designationsList}
                          label="Filter by Designation"
                          onChange={handleDesignationFilter}
                          // isMulti={false}
                          className="w-30"
                        />
                      </Box>
                      <Box className="scroll">
                        {userSearchData &&
                          userSearchData?.map((item) => (
                            <List
                              key={item.id} // Add key prop to each List element
                              sx={{ fontSize: "14px" }}
                              onClick={() => handleUserClick(item)}
                            >
                              <ListItem>
                                <ListItemText
                                  className="inviteText"
                                  primary={`${item.firstName}${
                                    item.lastName ? ` ${item.lastName}` : ""
                                  }`}
                                  secondary={`${item.designation}`}
                                />
                                {item.id !== loggedInUserId && ( // Conditionally render the link
                                  <Link
                                    className="invite-text"
                                    color="primary"
                                    // onClick={handleOpen}
                                    onClick={() => {
                                      showMessages(item.userId);
                                    }}
                                  >
                                    {t("INVITE")}
                                  </Link>
                                )}
                              </ListItem>
                              <Divider />
                            </List>
                          ))}
                      </Box>
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                      />
                    </Box>
                  )}
                </TabContext>
              </Grid>

              <Grid
                item
                xs={12}
                md={8}
                lg={8}
                className="pt-8 pb-20 xs-hide addConnectChat pl-0"
              >
                {!isMobile && (
                  <Box className="text-center">
                    {!selectedChatUser ? (
                      <Box className="center-container">
                        <ForumOutlinedIcon style={{ fontSize: "100px" }} />
                        <Box className="demo-chat">
                          {t("START_A_CONVERSATION")}
                        </Box>
                        <Box className="demo-text">
                          {t("CLICK_ON_ANY_CONTACT")}
                        </Box>
                      </Box>
                    ) : (
                      <Chat
                        senderUserId={selectedChatUser.senderUserId}
                        receiverUserId={selectedChatUser.receiverUserId}
                      />
                    )}
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

const Backdrop = React.forwardRef((props, ref) => {
  const { open, ...other } = props;
  return (
    <Fade in={open}>
      <div ref={ref} {...other} />
    </Fade>
  );
});

Backdrop.propTypes = {
  open: PropTypes.bool,
};

const blue = {
  200: "#99CCFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0066CC",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
};

const ModalContent = styled("div")(
  ({ theme }) => css`
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"};
    padding: 0px;
    color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};

    & .modal-title {
      margin: 0;
      line-height: 1.5rem;
      margin-bottom: 8px;
    }

    & .modal-description {
      margin: 0;
      line-height: 1.5rem;
      font-weight: 400;
      color: ${theme.palette.mode === "dark" ? grey[400] : grey[800]};
      margin-bottom: 4px;
    }
  `
);

const TriggerButton = styled(Button)(
  ({ theme }) => css`
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 150ms ease;
    cursor: pointer;

    }
  `
);

export default AddConnections;
