
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="http://www.praythedice.com">
    <img src="https://zupimages.net/up/21/37/k2df.png" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">Pray the dice</h1>

  <p align="center">
    A web tabletop app for roleplaying games.
    <br />
    <a href="https://github.com/Qboussard/beyond-the-dice/issues">Report Bug</a>
    ·
    <a href="https://github.com/Qboussard/beyond-the-dice/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Beyond desktop][product-screenshot]](https://example.com)

This project is a digital version of Aria's role-playing game from [Games of roles](https://game-of-roles.com/). 
The project aims to allow everyone to play where and when they want, on desktop or mobile.
Create your campaign your characters and play.

### Built With

The application is on the React framework thanks to the service of Firebase
* [React](https://fr.reactjs.org/)
* [Firebase](https://firebase.google.com/)


<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

1. Create a project on Firebase
2. Get the Firebase config and create a .env file on the root
```console
REACT_APP_API_KEY=""
REACT_APP_AUTHDOMAIN=""
REACT_APP_PROJECT_ID=""
REACT_APP_STORAGEBUCKET=""
REACT_APP_MESSAGING_SENDER_ID=""
REACT_APP_APP_ID=""
REACT_APP_MEASUREMENT_ID=""
REACT_APP_DATABASE=""
```
3. Activate the Firebase auth configuration for google on "Sign-in method"
4. Change the rules of Cloud Firestore for :
```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth.uid != null;
    }
  }
}
```
5. Change the rules of Real Time Database for :
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

### Installation

1. Clone the repo
   ```console
   git clone https://github.com/Qboussard/beyond-the-dice.git
   ```
2. Install NPM packages
   ```console
   yarn install
   ```

### Start and use

Start the server
  ```console
  yarn start
  ```


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


<!-- LICENSE 
## License

Distributed under the MIT License. See `LICENSE` for more information.
-->


<!-- CONTACT -->
## Contact

Boussard Quentin - [@Gaviil_](https://twitter.com/Gaviil_)
Project Link: [https://github.com/Qboussard/beyond-the-dice](https://github.com/Qboussard/beyond-the-dice)



<!-- ACKNOWLEDGEMENTS 
## Acknowledgements
* [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [Img Shields](https://shields.io)
* [Choose an Open Source License](https://choosealicense.com)
* [GitHub Pages](https://pages.github.com)
* [Animate.css](https://daneden.github.io/animate.css)
* [Loaders.css](https://connoratherton.com/loaders)
* [Slick Carousel](https://kenwheeler.github.io/slick)
* [Smooth Scroll](https://github.com/cferdinandi/smooth-scroll)
* [Sticky Kit](http://leafo.net/sticky-kit)
* [JVectorMap](http://jvectormap.com)
* [Font Awesome](https://fontawesome.com)
-->




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/Qboussard/beyond-the-dice.svg?style=for-the-badge
[contributors-url]: https://github.com/Qboussard/beyond-the-dice/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Qboussard/beyond-the-dice.svg?style=for-the-badge
[forks-url]: https://github.com/Qboussard/beyond-the-dice/network/members
[stars-shield]: https://img.shields.io/github/stars/Qboussard/beyond-the-dice.svg?style=for-the-badge
[stars-url]: https://github.com/Qboussard/beyond-the-dice/stargazers
[issues-shield]: https://img.shields.io/github/issues/Qboussard/beyond-the-dice.svg?style=for-the-badge
[issues-url]: https://github.com/Qboussard/beyond-the-dice/issues
[product-screenshot]:https://zupimages.net/up/21/37/f0b1.png
