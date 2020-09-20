import gql from "graphql-tag";

export const VERIFY_OTP = gql`
  mutation VerifyOtp($otp: String!, $id: ID!) {
    verifyOtp(otp: $otp, id: $id) {
      userId
      token
      email
      fullName
      mobile
    }
  }
`;

export const RESEND_OTP = gql`
  mutation ResendOtp($mobile: String!) {
    resendOtp(mobile: $mobile) {
      _id
    }
  }
`;
