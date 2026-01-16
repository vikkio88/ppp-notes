export const stringCleaner = {
  rmHtml(str: string) {
    return str
      .replace(/<br.+?>/gm, "\n")
      .replace(/<(?:.|\n)*?>/gm, "")
      .replace(/&\w+;/gm, " ");
  },
  booleanize(str: string, fallback = false) {
    if (!str) {
      return fallback;
    }

    return str.toLowerCase() === "yes" ? true : false;
  },
  isValidURL(str: string) {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+:]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  },
};
