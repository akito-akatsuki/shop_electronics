import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";

import { useStore } from "./store";

// ------------ Components ---------------
import Header from "./components/headerPage";
import HomePage from "./components/homePage";
import AuthPage from "./components/loginPage";
import BillPage from "./components/billPage";

// ---------------------------------------

function MainContent() {
  const [state, dispatch] = useStore();

  return (
    <>
      {state.isLogin && <AuthPage />}
      <Header />
      <div className="page-container">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/auth" component={HomePage} />
          <Route exact path="/bill" component={BillPage} />
        </Switch>
      </div>
    </>
  );
}

export default MainContent;
