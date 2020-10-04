import gql from "graphql-tag";

export const SIGNUP_USING_NUM = gql`
  mutation CreateDriver($mobNumber: String!) {
    createDriver(driverInput: { mobile: $mobNumber }) {
      _id
    }
  }
`;
