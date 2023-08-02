import { gql } from "apollo-angular";

export const GET_LAST_THREE_MONTHS_REVENUE = gql`
  query GetRevenueLastThreeMonths {
    invoice {
      getRevenueLastThreeMonths {
        month
        revenue
      }
    }
  }
`;
