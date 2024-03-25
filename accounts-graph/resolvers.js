const resolvers = {
  Account: {
    __resolveReference: (reference) => {
      return {
        id: reference.id,
        // generate random string number with 5 digits and it should always change on each request
        balance: Math.random().toString(36).substring(2, 7),
      };
    },
  },
};

module.exports = resolvers;
