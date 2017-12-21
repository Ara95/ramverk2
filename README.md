[![BCH compliance](https://bettercodehub.com/edge/badge/Ara95/ramverk2?branch=master)](https://bettercodehub.com/)


[![CircleCI](https://circleci.com/gh/Ara95/ramverk2.svg?style=svg)](https://circleci.com/gh/Ara95/ramverk2)

[![Maintainability](https://api.codeclimate.com/v1/badges/ee57af7666d651cfb49c/maintainability)](https://codeclimate.com/github/Ara95/ramverk2/maintainability)

[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/Ara95/ramverk2/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/Ara95/ramverk2/?branch=master)

[![Build Status](https://scrutinizer-ci.com/g/Ara95/ramverk2/badges/build.png?b=master)](https://scrutinizer-ci.com/g/Ara95/ramverk2/build-status/master)


## Set up all docker-containers
docker-compose up -d

# Single container
docker-compose up -d [container]

## Testing docker
make test1
make test2
make test3

## Install
npm install

## Start server
### Make sure MongoDB is started on your pc if you want the database to work.
npm start

## Test
make test
npm test
