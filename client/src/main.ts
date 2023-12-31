import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { environment } from "./environments/environment";
import { RootModule } from "./root.module";
import { hmrBootstrap } from "./hmr";

if (environment.production) {
  enableProdMode();
}

const bootstrap = () => {
  return platformBrowserDynamic().bootstrapModule(RootModule);
};

if (environment.hmr) {
  if ((module as any)["hot"]) {
    hmrBootstrap(module, bootstrap); // HMR enabled bootstrap
  } else {
    console.error("HMR is not enabled for webpack-dev-server!");
    console.log("Are you using the --hmr flag for ng serve?");
  }
} else {
  bootstrap(); // Regular bootstrap
}
