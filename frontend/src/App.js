import React, { Component } from "react";
import "./App.css";
import AuthService from "./services/auth.service";
import axios from "axios";
import {
  Checkbox,
  Stack,
  PrimaryButton,
  DefaultButton,
  Spinner
} from "office-ui-fabric-react";
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
initializeIcons();

class App extends Component {
  constructor() {
    super();
    this.axiosInstance = axios;
    this.authService = new AuthService();
    this.state = {
      user: null,
      apiCallFailed: false,
      loginFailed: false,
      mondayChecked: false,
      tuesdayChecked: false,
      wednesdayChecked: false,
      thursdayChecked: false,
      fridayChecked: false
    };
  }

  componentDidMount() {
    let user = this.authService.app.getUser();
    if (user && user.idToken && !this.isTokenExpired(user.idToken.exp)) {
      this.setState({ user: user });
      this.axiosLogin();
    } else {
      this.login();
    }
  }

  saveSettings = () => {
    const response = {
      name: this.state.user.name,
      email: this.state.user.displayableId,
      days: {
        monday: this.state.mondayChecked,
        tuesday: this.state.tuesdayChecked,
        wednesday: this.state.wednesdayChecked,
        thursday: this.state.thursdayChecked,
        friday: this.state.fridayChecked
      }
    };
    axios
      .post("/api/responses/create", response)
      .then(res => alert(`Succesfully saved ${JSON.stringify(res)}`))
      .catch(err => alert(`Failed to save settings\n${JSON.stringify(err)}`));
  };

  logout = () => {
    this.authService.logout();
  };

  login = () => {
    this.setState({
      loginFailed: false
    });
    this.authService.login().then(
      user => {
        if (user) {
          this.setState({
            user: user
          });
          this.axiosLogin();
        } else {
          this.setState({
            loginFailed: true
          });
        }
      },
      () => {
        this.setState({
          loginFailed: true
        });
      }
    );
  };

  axiosLogin = () => {
    this.authService.getToken().then(accessToken => {
      this.axiosInstance.defaults.headers.common = {
        Authorization: `Bearer ${accessToken}`
      };
      this.axiosInstance
        .get("/api/login")
        .then(res => {
          const {monday, tuesday, wednesday, thursday, friday} = res.data[0].days;
          this.setState({
            mondayChecked: monday,
            tuesdayChecked: tuesday,
            wednesdayChecked: wednesday,
            thursdayChecked: thursday,
            fridayChecked: friday
          });
          console.log(res);
        })
        .catch(err => this.setState({ loginFailed: true, user: null }));
    });
  };

  isTokenExpired = tokenTime => {
    const nowDate = new Date();
    return tokenTime ? tokenTime < nowDate.getTime() / 1000 : true;
  };

  render() {
    const buttonStyle = {
      fontSize: "28px",
      paddingRight: "32px",
      paddingLeft: "32px",
      height: "64px"
    };
    const checkboxStyle = {
      root: {
        marginRight: 10
      },
      text: {
        fontSize: "28px",
        color: "#fff",
        textShadow: "0 0 25px rgba(0,0,0,0.7)",
        fontWeight: "bolder"
      },
      checkbox: {
        "border-color": "#fff",
        "border-width": "2px"
      }
    };
    let templates = [];
    const {
      mondayChecked,
      tuesdayChecked,
      wednesdayChecked,
      thursdayChecked,
      fridayChecked
    } = this.state;
    if (this.state.user) {
      templates.push(
        <div key="all things">
          <div key="loggedIn">
            <h3 className="h3">Hello {this.state.user.name}</h3>
          </div>
          <div key="Checkboxes">
            <Stack horizontal horizontalAlign="center" gap={5} padding={10}>
              <Checkbox
                label="Monday"
                checked={mondayChecked}
                onChange={this._mondayUpdate}
                styles={checkboxStyle}
              />
              <Checkbox
                label="Tuesday"
                checked={tuesdayChecked}
                onChange={this._tuesdayUpdate}
                styles={checkboxStyle}
              />
              <Checkbox
                label="Wednesday"
                checked={wednesdayChecked}
                onChange={this._wednesdayUpdate}
                styles={checkboxStyle}
              />
              <Checkbox
                label="Thursday"
                checked={thursdayChecked}
                onChange={this._thursdayUpdate}
                styles={checkboxStyle}
              />
              <Checkbox
                label="Friday"
                checked={fridayChecked}
                onChange={this._fridayUpdate}
                styles={checkboxStyle}
              />
            </Stack>
          </div>
          <div key="submitButton">
            <Stack horizontal padding={10} horizontalAlign="center" gap={5}>
              <PrimaryButton
                text="Submit"
                onClick={this.saveSettings}
                style={buttonStyle}
              />
              <DefaultButton
                text="Logout"
                onClick={this.logout}
                style={buttonStyle}
              />
            </Stack>
          </div>
        </div>
      );
    } else {
      if (this.state.loginFailed) {
        templates.push(
          <div key="loggedIn">
            <div>
              <PrimaryButton text="Login with Microsoft" onClick={this.login} />
            </div>
            <strong key="loginFailed">Login unsuccessful</strong>
          </div>
        );
      } else {
        templates.push(<Spinner label="Logging In" />);
      }
    }
    if (this.state.apiCallFailed) {
      templates.push(
        <strong key="apiCallFailed">Graph API call unsuccessful</strong>
      );
    }
    return <div className="App">{templates}</div>;
  }

  _mondayUpdate = () => {
    this.setState({ mondayChecked: !this.state.mondayChecked });
  };

  _tuesdayUpdate = () => {
    this.setState({ tuesdayChecked: !this.state.tuesdayChecked });
  };

  _wednesdayUpdate = () => {
    this.setState({ wednesdayChecked: !this.state.wednesdayChecked });
  };

  _thursdayUpdate = () => {
    this.setState({ thursdayChecked: !this.state.thursdayChecked });
  };

  _fridayUpdate = () => {
    this.setState({ fridayChecked: !this.state.fridayChecked });
  };
}

export default App;
