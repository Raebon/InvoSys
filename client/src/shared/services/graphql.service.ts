import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";

@Injectable({
  providedIn: "root",
})
export class GraphqlService {
  constructor(private apollo: Apollo) {}

  public invalidateCache() {
    this.apollo.client.cache.reset();
  }
}
