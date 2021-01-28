const generateMarkdown = require("./utils/generateMarkdown")

const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");

// Get user details from GitHub
function getUser(userName) {
    return axios
        .get(
            `https://api.github.com/users/${userName}`
        )
        .catch(err => {
            console.log(`User not found`);
            process.exit(1);
        });
}

// Ask for project details for README file
function userInputs() {
    inquirer
        .prompt([{
            type: "input",
            message: "What is your Github username?",
            name: "userName"
        },
        {
            type: "input",
            message: "What is your email address?",
            name: "userEmail",
        },
        {
            type: "input",
            message: "What is your project title?",
            name: "projectTitle",
        },
        {
            type: "input",
            message: "What is the description of this project?",
            name: "projectDescription",
        }
        
    ])

        // Get user avatar and generate markdown (without creating a README file)
        .then((inquirerResponses) => {
            getUser(inquirerResponses.userName)
                .then((githubResponse) => {
                    // Add user avatar to project details
                    inquirerResponses.avatarURL = githubResponse.data.avatar_url
                    // Parse the README details to create markdown version
                    let markdownReadme = generateMarkdown(inquirerResponses);
                    // Parse the markdown README version to write it to file
                    writeToFile('README.md', markdownReadme);
                })
        })

}

// Create a README file from markdown README version
function writeToFile(file, data) {
    fs.writeFile(file, data, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Success!");
    })
}

userInputs()