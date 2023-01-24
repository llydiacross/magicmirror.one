//works with local storage to save and load data we will use in the react application
export class StorageController {
  public values: any;
  public pagePreferences: any;
  //private
  private fields: any;
  /**
   * Constructor
   */
  constructor() {
    //define new keys here
    this.fields = {
      transactions: {}, //all of your transactions
      tokens: {}, //cached tokens from the block chain,
      previews: {},
      stickers: {},
      requests: {},
      preload: {},
      paths: {},
      tokenURI: {},
      images: {},
      deployments: {},
      offers: {},
      transfers: {},
      redemptionRequests: {},
      awaitingCollection: {},
      pagePrefrences: {},
    };
    this.values = {};
    this.pagePreferences = {};
  }

  /**
   *
   * @param {string|number} key
   * @param {*} value
   */
  setGlobalPreference(key, value) {
    let pref = { ...this.getGlobalPreferences() };
    pref[key] = value;
    this.values.pagePrefrences["global"] = pref;
    this.saveData();
  }

  /**
   *
   * @param {string|number} key
   * @returns
   */
  getGlobalPreference(key) {
    if (!this.values.pagePrefrences) return null;
    return this.getGlobalPreferences()[key];
  }

  /**
   *
   * @param {string|number} key
   * @returns
   */
  isGlobalPreference(key) {
    if (!this.values.pagePrefrences) return false;

    return this.getGlobalPreferences()[key] === true;
  }

  /**
   *
   * @returns
   */
  getGlobalPreferences() {
    if (!this.values.pagePrefrences) return;

    return this.values.pagePrefrences["global"] || {};
  }

  /**
   * Removes ? and # tags from a url so we just get the folder/page
   * @returns
   */
  getLocationHref() {
    let location = window.location.href;
    let split = location.split("?"); //no get
    if (split[1] !== undefined) location = split[0];
    split = location.split("#"); //no href
    if (split[1] !== undefined) location = split[0];

    if (location.at(-1) !== "/") return location + "/";

    return location;
  }

  /**
   *
   * @param {string} key
   * @param {*} value
   * @param {*} id
   */
  setPagePreference(key, value, id = null) {
    if (id !== null && typeof id !== "string")
      id = id.id || id.name || "default";
    else if (
      id === null ||
      (typeof id === "string" && id.toLowerCase() === "global")
    )
      id = this.getLocationHref();

    console.log(
      "Saving page prefrence for page id '" +
        (id === null ? "global" : id) +
        "' key of: " +
        key,
      "storage"
    );

    if (this.values.pagePrefrences[id] === undefined)
      this.values.pagePrefrences[id] = {};

    this.values.pagePrefrences[id][key] = value;
    this.saveData();
  }

  /**
   *
   * @param {string} key
   * @param {string} id
   * @returns
   */
  getPagePreference(key, id = null, log = true) {
    if (id !== null && typeof id !== "string")
      id = id.id || id.name || "default";
    else if (
      id === null ||
      (typeof id === "string" && id.toLowerCase() === "global")
    )
      id = this.getLocationHref();

    if (log)
      console.log(
        "Reading page prefrence for page id '" +
          (id === null ? "global" : id) +
          "' key of: " +
          key,
        "storage"
      );

    if (this.values.pagePrefrences[id] === undefined) return undefined;

    return this.values.pagePrefrences[id][key];
  }

  /**
   *
   * @param {string} key
   * @param {string} id
   * @returns
   */
  isPageReference(key, id = null) {
    return this.getPagePreference(key, id) === true;
  }

  /**
   * trurns true if the key exists, and is not null. use existsAndNotEmpty if using arrays/objects
   * @param {string} key
   * @param {bool} nullCheck
   * @returns
   */
  exists(key, nullCheck = true) {
    return (
      this.values[key] !== undefined &&
      (!nullCheck ? true : this.values[key] !== undefined)
    );
  }

  /**
   * Returns true only if the key exists and the length of entries inside of the key is not zero. Will
   * return false if the key is not an array, or an object.
   * @param {string} key
   * @returns
   */
  existsAndNotEmpty(key) {
    if (!this.exists(key)) return false;

    if (
      typeof this.values[key] !== "object" &&
      this.values[key] instanceof Array === false
    )
      return false;

    if (Object.entries(this.values[key]).length === 0) return false;

    return true;
  }

  /**
   * Must be called before Controller.load()
   */
  loadSavedData() {
    console.log("Loading storaged data from local storage", "storage");
    for (let [key, val] of Object.entries(this.fields)) {
      this.values[key] = null;
      let item = localStorage.getItem(key);

      if (item === null && typeof val !== "object") continue;
      else if (item === null && typeof val === "object") {
        this.values[key] = {};
        continue;
      }

      switch (typeof val) {
        case "object":
          this.values[key] = JSON.parse(item);
          break;
        case "boolean":
          this.values[key] = item === "false" ? false : Boolean(item);
          break;
        case "number":
          this.values[key] = parseInt(item);
          break;
        default:
          this.values[key] = item;
      }
    }
  }

  /**
   * Wipes the storage clean. Does not save.
   */
  wipe() {
    console.log("Wiping storage", "storage");
    for (let [key] of Object.entries(this.fields)) {
      this.values[key] = {};
    }
  }

  /**
   * Sets item to value
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    console.log("Setting " + key, "storage");
    if (this.values[key] === undefined)
      throw new Error("trying to set an undefined value");

    this.values[key] = value;
    this.saveData();
  }

  /**
   * saves all the data inside of fields to local storage and packs objects accordingly
   */
  saveData() {
    console.log("Saving storage data", "storage");
    for (let [key, val] of Object.entries(this.fields)) {
      let item = this.values[key];
      if (typeof val === "object") {
        if (item === null) item = {};

        item = JSON.stringify(item);
      }

      //save
      localStorage.setItem(key, item);
    }
  }
}

const storage = new StorageController();
export default storage;
