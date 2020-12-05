const models = require("./models");

module.exports = server => {

    server.get("/signature/:address", (req, res, next) => {
        const address = req.params.address;
        console.log(`Get signature for ${address}`);

        models.signature.findOne({
            where: { address: address }
        }).then((instance) => {
            return res.send(200, instance.get({
                plain: true
            }));
        }).catch((e) => {
            return res.send(404);
        })
    });

    server.post("/signature", (req, res, next) => {

        if (!req.body || !req.body.address) {
            return res.send(401, "address missing");
        }
        if (!req.body || !req.body.signature) {
            return res.send(401, "signature missing");
        }
        if (!req.body || !req.body.message) {
            return res.send(401, "message missing");
        }
        Promise.all([
            models.signature.findOne({
                where: { address: req.body.address }
            })
        ]).then(([instance]) => {
            if (!instance) {
                models.signature
                    .findOrCreate({
                        where: { address: req.body.address },
                        defaults: {
                            message: req.body.message,
                            address: req.body.address,
                            signature: req.body.signature,
                        }
                    })
                    .then(() => {
                        return res.send(200);
                    });
            } else {
                return res.send(401, "Signature already exists");
            }
        });
    });

};

