LISTADO\_PARTIDOS
=================

_Transforming Sports Data into Engaging Insights_

![last-commit](https://img.shields.io/github/last-commit/nimpedrojo/listado_partidos?style=flat&logo=git&logoColor=white&color=0080ff) ![repo-top-language](https://img.shields.io/github/languages/top/nimpedrojo/listado_partidos?style=flat&color=0080ff) ![repo-language-count](https://img.shields.io/github/languages/count/nimpedrojo/listado_partidos?style=flat&color=0080ff)

_Built with the tools and technologies:_

![Express](https://img.shields.io/badge/Express-000000.svg?style=flat&logo=Express&logoColor=white) ![JSON](https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white) ![npm](https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white) ![TOML](https://img.shields.io/badge/TOML-9C4121.svg?style=flat&logo=TOML&logoColor=white) ![Cheerio](https://img.shields.io/badge/Cheerio-E88C1F.svg?style=flat&logo=Cheerio&logoColor=white)  
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black) ![Nodemon](https://img.shields.io/badge/Nodemon-76D04B.svg?style=flat&logo=Nodemon&logoColor=white) ![Puppeteer](https://img.shields.io/badge/Puppeteer-40B5A4.svg?style=flat&logo=Puppeteer&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED.svg?style=flat&logo=Docker&logoColor=white)

  

* * *

Table of Contents
-----------------

*   [Overview](#overview)
*   [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
    *   [Usage](#usage)
    *   [Testing](#testing)

* * *

Overview
--------

Listado\_partidos is a versatile developer tool designed to automate the collection and presentation of football match data. It provides a backend API built with Node.js and Express, leveraging headless Chrome (via Puppeteer) and HTML parsing libraries to fetch, process, and render match schedules within specified date ranges.

**Why listado\_partidos?**

This project streamlines sports data workflows by offering:

*   🧩 **Flexible Data Retrieval:** Automates fetching match info from federation websites using headless browsers.
*   🎨 **Dynamic HTML Generation:** Produces styled, structured reports and tables for easy visualization.
*   🚀 **Multi-Platform Deployment:** Supports deployment on Fly.io, Heroku, and Docker for scalable, reliable hosting.
*   🔧 **Modular Architecture:** Includes utilities for browser automation, templating, and data parsing, enabling seamless integration.
*   ⚙️ **Customizable & Extensible:** Designed for developers to adapt and extend for various sports data applications.

* * *

Getting Started
---------------

### Prerequisites

This project requires the following dependencies:

*   **Programming Language:** JavaScript
*   **Package Manager:** Npm
*   **Container Runtime:** Docker

### Installation

Build listado\_partidos from the source and install dependencies:

1.  **Clone the repository:**
    
        ❯ git clone https://github.com/nimpedrojo/listado_partidos
        
    
2.  **Navigate to the project directory:**
    
        ❯ cd listado_partidos
        
    
3.  **Install the dependencies:**
    

**Using [docker](https://www.docker.com/):**

    ❯ docker build -t nimpedrojo/listado_partidos .
    

**Using [npm](https://www.npmjs.com/):**

    ❯ npm install
    

### Usage

Run the project with:

**Using [docker](https://www.docker.com/):**

    docker run -it {image_name}
    

**Using [npm](https://www.npmjs.com/):**

    npm start
    

### Testing

Listado\_partidos uses the {**test\_framework**} test framework. Run the test suite with:

**Using [docker](https://www.docker.com/):**

    echo 'INSERT-TEST-COMMAND-HERE'
    

**Using [npm](https://www.npmjs.com/):**

    npm test
    

* * *

[⬆ Return](#top)

* * *
