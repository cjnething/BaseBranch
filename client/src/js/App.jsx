// app.jsx
var React = require('react');
window.React = React;
var injectTapEventPlugin = require("react-tap-event-plugin");
var mui = require('material-ui');

//Components
var RaisedButton = mui.RaisedButton;
var NavBar = require('./components/NavBar.jsx');
var GraphView = require('./components/GraphView.jsx');
var NodeView = require('./components/NodeView.jsx');
var NewResourceView = require('./components/NewResourceView.jsx');
var SearchBarView = require('./components/SearchBarView.jsx');
var Paper = mui.Paper;
var NewTopicForm = require('./components/NewTopicForm.jsx');


injectTapEventPlugin();


var Main = React.createClass({
  render: function(){
    return (
      <div>
      <div className="full">
        <NavBar />
      </div>
      <div className="button-nav-container">
        <RaisedButton linkButton={true} href="./graph.html">
          <span className="mui-raised-button-label">Graph View Test Button</span>
        </RaisedButton>
      </div>
        <SearchBarView />
      </div>
    );
  }
});

React.render(<Main />, document.getElementById('app'));
