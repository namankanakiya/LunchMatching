const ResponseModel = require("../models/Response");
const blossom = require("edmonds-blossom");

const matchFinder = day => {
  const dayMatch = "days." + day;
  const options = {};
  options[dayMatch] = true;
  ResponseModel.find(options, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      let peopleToMatch = {};
      let graphEdges = [];
      const amountPeople = res.length;
      res.forEach((person, index) => {
        peopleToMatch[index] = person.email;
      });
      res.forEach((person, index) => {
        for (i = 0; i < amountPeople; i++) {
          if (
            person.email !== peopleToMatch[i] &&
            !person.matches.includes(peopleToMatch[i])
          ) {
            graphEdges.push([index, i]);
          }
        }
      });
      const results = blossom(graphEdges, 1);
      let matches = {};
      results.forEach((result, index) => {
        const user1 = peopleToMatch[result];
        const user2 = peopleToMatch[index];
        if (!(user1 in matches || user2 in matches)) {
          matches[user1] = user2;
        }
      });
      console.log(matches);
    }
  });
};

module.exports = { matchFinder };
