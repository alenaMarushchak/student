const fs = require('fs');
const uuid = require('uuid');
const downloader = require('image-downloader');

class FilesHelper {

    readFile(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, function (err, file) {
                if (err) {
                    return reject(err);
                }

                resolve(file);
            });
        });
    }

    uploadFileByUrl(url, dest) {
        const opts = {url, dest};

        return downloader.image(opts);
    }

    uploadFile(path, bucket, expansion) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, function (err, data) {
                if (err) {
                    return reject(err);
                }

                resolve({data, bucket, expansion});
            });
        }).then(({data, bucket, expansion}) => {
            const path = bucket + uuid.v4() + '.' + expansion;

            return new Promise((resolve, reject) => {
                fs.writeFile(path, data, function (err) {
                    if (err) {
                        return reject(err);
                    }

                    resolve(path);
                });
            });
        });
    }

    deleteFile(path) {
        return new Promise((resolve, reject) => {
            fs.unlink(path, function (err) {
                if (err) {
                    return reject(err);
                }

                resolve();
            })
        });
    }

    deleteFiles(paths) {
        return Promise.all(paths.map(this.deleteFile));
    }

}

module.exports = new FilesHelper();
