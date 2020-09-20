import gql from "graphql-tag";

export const SIGNUP_USING_NUM = gql`
  mutation CreateUser($mobNumber: String!) {
    createUser(userInput: { mobile: $mobNumber }) {
      _id
    }
  }
`;
