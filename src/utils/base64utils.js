module.exports = {
    parseB64: (data) => {
        const buff = Buffer.from(data, 'base64');
        return buff.toString('utf-8');
    }
}