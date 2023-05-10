# greddiit
A social media platform similar to Reddiit in which authenticated users can create Groups, make posts, follow each other etc along with chat functionality using web sockets


## Description
A MERN-Stack application that attempts to replicate the functionality of reddit platform. The application is built using the MERN stack and docker. The application is deployed using docker-compose

## Features
- Authentication and Authorization
- Nav Bar with links to different pages
- Home page 
- My Subgreddiits page that contains all the subgreddits you have created
  - Basic details of the subgreddit
  - Delete functionality
- My Subgreddiit home page that shows the 
  - the users of the subgreddit
  - the joining requests
  - the stats page of the subgreddit
  - the reports page of the subgreddit
- Subgreddiits page with search, filter by tags and sort by date,name,followers
- Subgreddiit home page with posts,comments
  - If the post contains a banned keywords it is replaced with *
- User profile page
    - Showing the user profile with edit functionality
    - Showing the followers and the users you are following
- Everytime an API is called the input (if any) is disabled and the loading page is shown
- The saved posts page
- chat functionality using web sockets

## Bonus Features
- Stats page implemented with graphs


## Pre-requisites
- NPM
- NodeJS

## Technologies
- ReactJS
- NodeJS
- ExpressJS
- MongoDB

