import React, { Component } from "react";
import Particles from "react-particles-js";

import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Logo from "./components/Logo/Logo";
import Navigation from "./components/Navigation/Navigation";
import Rank from "./components/Rank/Rank";
import Register from "./components/Register/Register";
import Signin from "./components/Signin/Signin";
import "./App.css";

const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  user: {
    entries: "",
    email: "",
    id: "",
    joined: "",
    name: ""
  }
};

const particleOptions = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  calculateFaceLocation = data => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box || null;
    const image = document.getElementById("InputImage");
    const width = Number(image.width);
    const height = Number(image.height);

    if (clarifaiFace) {
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - clarifaiFace.right_col * width,
        bottomRow: height - clarifaiFace.bottom_row * height
      };
    } else {
      return {
        leftCol: 0,
        topRow: 0,
        rightCol: 0,
        bottomRow: 0
      };
    }
  };

  displayFaceBox = box => {
    this.setState({ box });
  };

  loadUser = data => {
    this.setState({
      user: {
        entries: data.entries,
        email: data.email,
        id: data.id,
        joined: data.joined,
        name: data.name
      }
    });
  };

  onInputChange = event => {
    this.setState({ input: event.target.value });
  };

  onPictureSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/imageurl`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/image`, {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(console.log);
        }

        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch(error => console.log(error));
  };

  onRouteChange = route => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route });
  };

  render() {
    const { isSignedIn, imageUrl, box, route } = this.state;

    return (
      <div className="App">
        <Particles className="particles" params={particleOptions} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onPictureSubmit={this.onPictureSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : route === "register" ? (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        ) : (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
