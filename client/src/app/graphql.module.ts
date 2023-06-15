import { APOLLO_OPTIONS, ApolloModule } from "apollo-angular";
import { HttpLink } from "apollo-angular/http";
import { NgModule, isDevMode } from "@angular/core";
import { ApolloClientOptions, InMemoryCache } from "@apollo/client/core";

let uri: string = "https://invo-sys.onrender.com/4000";

if (isDevMode()) {
  console.log("Development!");
  uri = "http://localhost:4000/";
} else {
  console.log("Production!");
  uri = "https://invo-sys.onrender.com/4000";
}

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
