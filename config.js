const configs = {
    dev: {
        environment: "development",
    },

    production: {
        environment: "production",
    }
};
const config = process.env.NODE_ENV
    ? configs[process.env.NODE_ENV]
    : configs.dev;

module.exports = {
    ...config,
    mailgun: {
        apiKey: "9367fb0c9f5b9304f551e3efb2f9d592-9525e19d-df8fe60a",
        domain: "mail.ava.do",
        force_to: "stefaan.ponnet+forced@gmail.com"
    }

    // mailgun: {
    //     apiKey: "49562197a338357bf6a010472f355f11-898ca80e-e82922cb",
    //     domain: "mg.oldblocks.com",
    //     force_to: "stefaan.ponnet+forced@gmail.com"
    // }
};
