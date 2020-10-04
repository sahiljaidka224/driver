import gql from "graphql-tag";

export const UPLOAD_DOC = gql`
  mutation UploadDocuments($file: Upload!, $name: String!) {
    uploadDriverDocs(file: $file, name: $name) {
      filename
      mimetype
      encoding
      url
    }
  }
`;
