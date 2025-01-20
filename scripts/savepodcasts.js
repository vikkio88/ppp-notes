const Downloader = require("nodejs-file-downloader");
const { podcasts } = require('./output/shows_2021-12-30T09.26.05.581Z.json');

const main = async () => {

    console.log('Start saving podcasts');
    const total = podcasts.length;

    for (const index in podcasts) {
        const pod = podcasts[index];
        console.log(`saving ${parseInt(index) + 1} / ${total}`);
        const fileName = `${pod.title.replace(/ +/gm, '_').replace(/"+/gm, '')}.mp3`;
        const down = new Downloader({
            url: pod.fileUrl,
            directory: './downloads',
            fileName
        });

        await down.download();
        console.log(`\t saved in downloads/${fileName}`);
    }

    process.exit(0);
};

main();