
import PageManager from './page-manager';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

export default class Checkout extends PageManager {
  constructor(context) {
    super(context)
    this.context = context
    this.token = context.storefrontAPIToken
    this.client = new ApolloClient({
      headers: {
        Authorization: `Bearer ${this.token}`,
        'X-Bc-Customer-Id': 259
      },
    });
  }
  async onReady() {
    console.log(this.context)
    const getCustomerGroup = await this.client.query({
      query: gql`
      query CustomerInformation {
        customer {
          firstName
          lastName
        }
      }`
    });
    console.log(getCustomerGroup.data)
  }
}