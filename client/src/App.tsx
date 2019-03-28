import React, { Component } from "react";
import "./App.css";
import AuthService from "./services/auth.service";
import axios, { AxiosStatic } from "axios";
import {
  Checkbox,
  Stack,
  PrimaryButton,
  DefaultButton,
  Spinner,
  ICheckboxStyles
} from "office-ui-fabric-react";
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import { User } from "msal";
initializeIcons();

interface AppState {
  /** The user from authenticated login */
  user?: User;
  /** True if the login has failed */
  loginFailed?: boolean;
  /** True if server had an error */
  serverError?: boolean
  /** If the user wants a match on Monday */
  mondayChecked?: boolean;
  /** If the user wants a match on Tueday */
  tuesdayChecked?: boolean;
  /** If the user wants a match on Wednesday */
  wednesdayChecked?: boolean;
  /** If the user wants a match on Thursday */
  thursdayChecked?: boolean;
  /** If the user wants a match on Friday */
  fridayChecked?: boolean;
  /** If the data is being loaded from the database */
  loading?: boolean;
}

interface newUser extends User {
  idToken : {
    exp: number
  }
}

class App extends Component<any, AppState> {
  private axiosInstance: AxiosStatic = axios;
  private authService: AuthService;
  
  constructor(props: any) {
    super(props);
    this.state = {
      user: undefined,
      loginFailed: false,
      serverError: false,
      mondayChecked: false,
      tuesdayChecked: false,
      wednesdayChecked: false,
      thursdayChecked: false,
      fridayChecked: false,
      loading: true
    };
    this.axiosInstance = axios;
    this.axiosInstance.defaults.withCredentials = true;
    this.authService = new AuthService();
  }

  componentDidMount() {
    let user: newUser = this.authService.app.getUser() as newUser;
    if (user && user.idToken && !this.isTokenExpired(user.idToken.exp)) {
      this.setState({ user: user });
      this.axiosLogin();
    }
  }

  saveSettings = () => {
    if (this.state.user) {
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
      this.axiosInstance
        .post("/api/responses/create", response)
        .then(res => alert(`Succesfully saved ${JSON.stringify(res)}`))
        .catch(err => alert(`Failed to save settings\n${JSON.stringify(err)}`));
    }
  };

  logout = () => {
    this.authService.logout();
  };

  login = () => {
    this.setState({
      loginFailed: false
    });
    this.authService.login().then(
      (user: User | undefined) => {
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
    this.setState({
      serverError: false
    });
    this.authService.getToken().then((accessToken: string | undefined) => {
      this.axiosInstance.defaults.headers.common = {
        Authorization: `Bearer ${accessToken}`
      };
      this.axiosInstance
        .get("/api/login")
        .then(res => {
          const {
            monday,
            tuesday,
            wednesday,
            thursday,
            friday
          } = res.data.days;
          this.setState({
            mondayChecked: monday,
            tuesdayChecked: tuesday,
            wednesdayChecked: wednesday,
            thursdayChecked: thursday,
            fridayChecked: friday,
            loading: false
          });
        })
        .catch(err => {
          this.setState({ serverError: true, loading: false });
          console.log(err);
        });
    });
  };

  isTokenExpired = (tokenTime: number) => {
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
    const checkboxStyle: ICheckboxStyles = {
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
        "borderColor": "#fff",
        "borderWidth": "2px"
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
          <div key="User">
            <h3 className="h3">Hello {this.state.user.name}</h3>
            <h4 className="h4">Which day(s) would you like to have a lunch buddy?</h4>
          </div>
        </div>
      );
      if (this.state.loading) {
        templates.push(<Spinner key="data spinner" label="Loading Data" />);
      } else if (this.state.serverError) {
        templates.push(
          <h5 key="error" className="error">Error communicating with server, please try at a later time.</h5>
        );
      } else {
        templates.push(
          <div key="content" className="outsideDiv">
            <div key="Checkboxes" className="insideDiv">
              <Stack horizontalAlign="start" verticalAlign="space-evenly" gap={20} padding={10}>
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
      }
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
        templates.push(
          <div key="loginButton">
            <PrimaryButton text="Login with Microsoft" onClick={this.login} />
          </div>
        );
      }
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
