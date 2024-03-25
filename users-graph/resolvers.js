const resolvers = {
  User: {
    __resolveReference: (reference) => {
      return {
        id: reference.id,
        name: Math.random().toString(36).substring(2),
      };
    },

    account: (parent, _, ctx) => {
      return { id: parent.accountId, __typename: "Account" };
    },
  },
};

module.exports = resolvers;
