import React from 'react';
import ReactDOM from 'react-dom';
import './assets/index.css';
import App from './containers/App';
import Dex from './containers/Dex';
import * as serviceWorker from './serviceWorker';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

// ReactDOM.render(<App />, document.getElementById('root'));

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

//

ReactDOM.render(
    <Router>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/dex" exact component={Dex} />
      </Switch>
    </Router>,
  document.getElementById('root')
);

serviceWorker.unregister();
