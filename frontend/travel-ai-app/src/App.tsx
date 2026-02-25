import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TripPlannerPage from './pages/TripPlannerPage';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={LandingPage} />
        <Route path="/trip-planner" component={TripPlannerPage} />
      </Switch>
    </Router>
  );
};

export default App;