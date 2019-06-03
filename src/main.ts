import "./styles.scss";

import "./scripts/polyfil";

import store from "./scripts/store";
import svg4everybody from "svg4everybody";

class Main {
  constructor() {
    this.main();
  }
  main() {
    store.subscribe(() => {
      console.log(`state: changed.`, store.getState());
    });

    svg4everybody();
  }
}

new Main();
