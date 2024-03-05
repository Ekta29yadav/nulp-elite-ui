import React from "react";
import "./App.css";

import { Layout,IconByName,SearchLayout,FilterButton,overrideColorTheme } from "@shiksha/common-lib";
import Sample from "pages/Sample";
import Home from "pages/Home";
import Courses from "pages/Courses";
import Contents from "pages/Contents";
import { NativeBaseProvider,Box, Stack, VStack,Text, HStack, Button,
  Actionsheet,ScrollView } from "native-base";
import { Link , useParams} from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DEFAULT_THEME, initializeI18n,H2, } from "@shiksha/common-lib";
import { useTranslation } from 'react-i18next'

function App() {
  const [search, setSearch] = React.useState(true);
  const [searchState, setSearchState] = React.useState(false);
  // const theme = extendTheme(DEFAULT_THEME);
  const colors = '';  
  const [sortArray, setSortArray] = React.useState([]);
  
  const routes = [
    {
      moduleName: "nulp_elite",
      path: "/",
      component: Home,
    },{
      moduleName: "nulp_elite",
      path: "/Contents",
      component: Contents,
    },{
      moduleName: "nulp_elite",
      path: "/Courses",
      component: Courses,
    },,{
      moduleName: "nulp_elite",
      path: "/Sample",
      component: Sample,
    },
  {
    moduleName: "nulp_elite",
    path: "/profile",
    component: Profile,
  }

  ];

  return(
    <NativeBaseProvider >
      <Router routes={routes}>
    <Layout
      _header={{
        title: "User Name",
        // isEnableSearchBtn: true,
        subHeading: "Hello",
        iconComponent: (
          <Link
            to="/Courses"
            style={{ color: "rgb(63, 63, 70)", textDecoration: "none" }}
          >
             <IconByName name='Notification2LineIcon' />
          </Link>
        ),
      }}
      subHeader={
      
        <Link
          to="/"
          style={{ color: "rgb(63, 63, 70)", textDecoration: "none" }}
        >
          <HStack space="4" justifyContent="space-between">
            <VStack>
            <SearchLayout
        {...{
          search,
          setSearch,
          // minStringLenght: 3,
          notFoundMessage: "TYPE_TO_START_SEARCHING_LEARNING",
          onCloseSearch: setSearchState,
        }}
      >
      </SearchLayout>
            </VStack>
          </HStack>
         </Link>
      }
      _subHeader={{ bg: "rgb(248, 117, 88)" }}
      _footer={{
        menues: [
          {
            title: "Search",
            icon: "SearchLineIcon",
            route: "/Contents",
          },
          {
            title: "HOME",
            icon: "Home4LineIcon",
            route: "/",
          },
          {
            title: "Courses",
            icon: "BookOpenLineIcon",
            route: "/Courses",
          },
          {
            title: "AccountCircleLineIcon",
            icon: "TeamLineIcon",
            route: "/profile",
          }
        ],
      }}
    >

    
    <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Contents" element={<Contents />} />
          <Route path="/Courses" element={<Courses />} />
          <Route path="/Sample" element={<Sample />} />
    </Routes>
    

    </Layout>
    </Router>
    </NativeBaseProvider>
  // <NativeBaseProvider ><Router><Sample /></Router> </NativeBaseProvider>

  ); 
  // <NativeBaseProvider > <Sample /></NativeBaseProvider>;

  // <AppShell routes={routes} AuthComponent={LoginComponent} />;
}



export default App;
