import { gql } from "apollo-angular";

export const SEARCH_CUSTOMERS = gql`
  query SearchCustomers($text: String) {
    customer {
      searchCustomers(text: $text) {
        count
        rows {
          id
          firstName
          lastName
          email
        }
      }
    }
  }
`;
