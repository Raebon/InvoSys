import { gql } from "apollo-angular";

export const DELETE_INVOICE = gql`
  mutation DeleteInvoice($input: String!) {
    invoice {
      deleteInvoice(input: $input) {
        success
        message
      }
    }
  }
`;
