const axios = require('axios');

module.exports = async (app = require('express')()) => {
    app.get('/', async (request, response) => {
        try {
            const { url } = request.query;
            const axiosResponse = await axios.default({
                method: 'get',
                url
              });
            return axiosResponse.data.pipe(response);
        } catch (error) {
            return response.send(JSON.stringify(error));
        }
    });
    app.post('/', async (request, response) => {
        try {
            const { url } = request.query;
            const axiosResponse = await axios.default.post(url, request.body);
            return response.send(axiosResponse.data);
        } catch (error) {
            return response.send(JSON.stringify(error));
        }
    });
    app.get('/download-file/', async (request, response) => {
        try {
            const { url, filename } = request.query;
            if (!url) {
                return response.send('');
            }
            let originalname = filename;
            if (!originalname) {
                const chunks = url.split('/');
                originalname = chunks[chunks.length - 1];
            }
            const fileResponse = await axios.default.get(decodeURIComponent(url), { responseType: 'arraybuffer' });
            const body = Buffer.from(fileResponse.data, 'binary');
            const file = {
                name: originalname,
                body
            };
            const encodedFileName = encodeURIComponent(file.name).replace(/['()]/g, escape).replace(/\*/g, '%2A').replace(/%(?:7C|60|5E)/g, unescape);
            response.set({ 'Content-Disposition': `attachment; filename*=UTF-8''${encodedFileName}` });
            return response.send(file.body);
        } catch (error) {
            return response.send(JSON.stringify(error));
        }
    });
}
