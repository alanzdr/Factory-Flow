import { JSDOM } from "jsdom";

class DomModule {
  url;
  initializated = false;
  dom: JSDOM | null = null;

  constructor(url: string) {
    this.url = url;
  }

  private async initialize() {
    const siteResponse = await fetch(this.url);
    const siteText = await siteResponse.text();

    if (!siteText) {
      throw new Error("Page content not found");
    }

    const bodyContent = siteText;

    const virtualDom = new JSDOM(bodyContent);

    return virtualDom;
  }

  private async getDOM() {
    if (!this.initializated) {
      this.dom = await this.initialize();
      this.initializated = true;
    }
    return this.dom as JSDOM;
  }

  public async getDocument() {
    if (!this.initializated || this.dom == null) {
      this.dom = await this.getDOM();
    }
    return (this.dom as JSDOM).window.document;
  }

  public async getPageLinks() {
    const document = await this.getDocument();

    const links = document.querySelectorAll("a");
    const urls = [];

    for (const link of links) {
      urls.push(link.href);
    }

    return urls;
  }

  public async getSelectValues(selector: string) {
    const document = await this.getDocument();

    const select = document.querySelector(selector);
    if (!select) {
      return null;
    }

    const options = select.querySelectorAll("option");
    const values = [];

    for (const option of options) {
      if (option.value) {
        values.push(option.value);
      }
    }

    return values;
  }

  public async getPageTitle() {
    const document = await this.getDocument();
    return document.title;
  }

  public async querySelectorAll(selector: string) {
    const document = await this.getDocument();
    return document.querySelectorAll(selector);
  }

  public async querySelector(selector: string) {
    const document = await this.getDocument();
    return document.querySelector(selector);
  }
}

export default DomModule;
