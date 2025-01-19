const stringCleaner = {
    rmHtml(string) {
        return string.replace(/<br.+?>/gm, '\n').replace(/<(?:.|\n)*?>/gm, '').replace(/&\w+;/gm, ' ');
    },
    booleanize(string, fallback = false) {
        if (!string) {
            return fallback;
        }

        return string.toLowerCase() === 'yes' ? true : false;
    },
    isValidURL(str) {
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+:]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    }
};

module.exports = stringCleaner;