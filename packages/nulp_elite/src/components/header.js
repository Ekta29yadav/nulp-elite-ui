import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Link from "@mui/material/Link";
import DevicesIcon from "@mui/icons-material/Devices";
import WebIcon from "@mui/icons-material/Web";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import LanguageIcon from "@mui/icons-material/Language";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "i18next";
import { useState } from "react";
import LiveHelpOutlinedIcon from "@mui/icons-material/LiveHelpOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import GTranslateIcon from '@mui/icons-material/GTranslate';

function Header() {
  const { t } = useTranslation();
  const [language, setLanguage] = useState("en");

  const handleChangeLanguage = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    changeLanguage(selectedLanguage);
  };

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      {/* Sidebar Navigation */}
      <Box
        className="xs-hide"
        style={{
          background: "#fff",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {/* Navigation Links */}
        <Box style={{ padding: "10px" }}>
          <DevicesIcon
            style={{
              padding: "0 10px",
              verticalAlign: "middle",
              color: "#424242",
            }}
          />
          <Link
            href="#"
            underline="none"
            style={{
              color: "#424242",
              fontSize: "16px",
              borderRight: "solid 1px #424242",
              paddingRight: "10px",
            }}
          >
            {t("MAIN_CONTENT")}{" "}
          </Link>
        </Box>
        <Box
          style={{
            padding: "0 10px",
            color: "#424242",
            fontSize: "16px",
            borderRight: "solid 1px #424242",
          }}
        >
          <Link
            href="#"
            underline="none"
            style={{ color: "#424242", fontSize: "16px", paddingRight: "10px" }}
          >
            {" "}
            +A
          </Link>{" "}
          <Link
            href="#"
            underline="none"
            style={{ color: "#424242", fontSize: "16px", paddingRight: "10px" }}
          >
            A -{" "}
          </Link>
          <Link
            href="#"
            underline="none"
            style={{ color: "#424242", fontSize: "16px", paddingRight: "10px" }}
          >
            A
          </Link>{" "}
        </Box>
        <Box
          style={{
            padding: "0 10px",
            color: "#424242",
            fontSize: "14px",
            borderRight: "solid 1px #424242",
          }}
        >
          <WebIcon style={{ padding: "0 10px", verticalAlign: "middle" }} />
          <Link
            href="#"
            underline="none"
            style={{ color: "#424242", fontSize: "16px" }}
          >
            {t("SCREEN_READER")}{" "}
          </Link>
        </Box>
         {/* Language Select */}
         <Box sx={{ minWidth: 120,paddingLeft:'10px' }}>
              <FormControl fullWidth size="small" style={{display:'flex',alignItems:'center',flexDirection:'row'}}> 
                {/* <InputLabel id="language-select-label">
                  {t("LANGUAGE")}
                </InputLabel> */}
                <GTranslateIcon/>
                <Select
                  labelId="language-select-label"
                  id="language-select"
                  className="language"
                  style={{ border: "none" }}
                  label={t("LANGUAGE")}
                  value={language}
                  startIcon={<LanguageIcon />}
                  onChange={handleChangeLanguage}
                  inputProps={{ "aria-label": t("SELECT_LANGUAGE") }}
                >
                  <MenuItem value="en">{t("ENGLISH")}</MenuItem>
                  <MenuItem value="hi">{t("HINDI")}</MenuItem>
                </Select>
              </FormControl>
            </Box>
      </Box>

      {/* Top Navigation Bar */}
      <AppBar position="sticky" style={{ background: "#fff" }}>
        <Container
          maxWidth="xl"
          style={{ paddingLeft: "0", paddingTop: "10px", paddingBottom: "8px" }}
        >
          <Toolbar disableGutters>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              className="lg-hide"
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1, paddingLeft: "20px",display:'flex',justifyContent:'space-between' }}>
              <img
                src={require("../assets/logo.png")}
                style={{ maxWidth: "100%" }}
              />
               {/* Language Select */}
         <Box sx={{ minWidth: 120,paddingLeft:'10px' }} className="lg-hide">
              <FormControl fullWidth size="small" style={{display:'flex',alignItems:'center',flexDirection:'row'}}> 
                {/* <InputLabel id="language-select-label">
                  {t("LANGUAGE")}
                </InputLabel> */}
                <GTranslateIcon/>
                <Select
                  labelId="language-select-label"
                  id="language-select"
                  className="language"
                  style={{ border: "none" }}
                  label={t("LANGUAGE")}
                  value={language}
                  startIcon={<LanguageIcon />}
                  onChange={handleChangeLanguage}
                  inputProps={{ "aria-label": t("SELECT_LANGUAGE") }}
                >
                  <MenuItem value="en">{t("ENGLISH")}</MenuItem>
                  <MenuItem value="hi">{t("HINDI")}</MenuItem>
                </Select>
              </FormControl>
            </Box>
            </Box>

            {/* Language Select */}
            <Box>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem>
                  <Link href="/help" textAlign="center" underline="none">
                    <LiveHelpOutlinedIcon
                      style={{ verticalAlign: "bottom", color: "#000" }}
                    />{" "}
                    {t("HELP")}
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link href="/logoff" textAlign="center" underline="none">
                    <LogoutOutlinedIcon
                      style={{ verticalAlign: "bottom", color: "#000" }}
                    />{" "}
                    {t("LOGOUT")}
                  </Link>
                </MenuItem>
              </Menu>
            </Box>

           

            {/* Search Box */}
            <Box
              className="xs-hide"
              style={{
                display: "flex",
                alignItems: "center",
                flexGrow: 3,
                paddingLeft: "40px",
              }}
            >
              <TextField
                placeholder={t("SEARCH")}
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <IconButton type="submit" aria-label="search">
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
            </Box>

            {/* Other Navigation Links */}
            <Box
              className="xs-hide"
              sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}
            >
              <Link
                href="/all"
                underline="none"
                style={{
                  my: 2,
                  color: "#484848",
                  display: "block",
                  margin: "0 20px",
                }}
              >
                <EditNoteOutlinedIcon
                  style={{ padding: "0 10px", verticalAlign: "middle" }}
                />
                {t("CONTENT")}
              </Link>
              <Link
                href="/addConnections"
                underline="none"
                style={{
                  my: 2,
                  color: "#484848",
                  display: "block",
                  margin: "0 20px",
                }}
              >
                <GroupsOutlinedIcon
                  style={{ padding: "0 10px", verticalAlign: "middle" }}
                />
                {t("CONNECTIONS")}
              </Link>

              {/* User Profile */}
              <Tooltip title={t("OPEN_SETTINGS")}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <AccountCircleOutlinedIcon
                    style={{ padding: "0 10px", verticalAlign: "middle" }}
                  />{" "}
                  {t("PROFILE")}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem>
                  <Link href="/profile" textAlign="center">
                    {t("PROFILE")}
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link href="/help" textAlign="center">
                    {t("HELP")}
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link href="/logoff" textAlign="center">
                    {t("LOGOUT")}
                  </Link>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default Header;
