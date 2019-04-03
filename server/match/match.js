const ResponseModel = require("../models/Response");
const blossom = require("edmonds-blossom");

const matchFinder = day => {
  const dayMatch = "days." + day;
  const options = {};
  options[dayMatch] = true;
  ResponseModel.find(options, (err, res) => {
    if (err) {
      throw new Error("matching broken");
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
      let notMatched = [];
      results.forEach((result, index) => {
        if (result != -1) {
          const user1 = peopleToMatch[result];
          const user2 = peopleToMatch[index];
          if (!(user1 in matches || user2 in matches)) {
            matches[user1] = user2;
          }
        } else {
          notMatched.push(peopleToMatch[index]);
        }
      });
      while (notMatched.length >= 2) {
        const user1 = notMatched.shift();
        const user2 = notMatched.pop();
        matches[user1] = user2;
      }
      let singleLeft = notMatched.length === 1 ? true : false;
      Object.entries(matches).forEach((match) => {
        let matchString = match[0] + match[1];
        if (singleLeft) {
          singleLeft = false;
          matchString += notMatched.shift();
        }
        console.log(matchString);
      });
    }
  });
};

module.exports = { matchFinder };
