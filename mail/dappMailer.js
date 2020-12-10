const rp = require('request-promise');
const dappMailerConfig = require('./dappMailerConfig.json');
const config = require('../config');

const sendMail = (signerAddress, signature) => {
  const { mailTo, termsAndConditionsHash } = config;
  const data = {
    template: 'cstk',
    subject: 'CS Token - User Has Signed T&C',
    secretIntro: `Account ${signerAddress} has signed the terms and condition (ipfs ${termsAndConditionsHash})"!`,
    text: `
        <p>
          Account <em>${signerAddress}</em> has signed the T&C
          <br>
          Message: "I agree with Terms and Conditions corresponding to IPFS hash ${termsAndConditionsHash}"
          <br>
          Signature: "${signature}"
        </p>
      `,

    recipient: mailTo,
    cta: 'T&C Alert',
    ctaRelativeUrl: '/tandc',
    unsubscribeType: 'notification-receiver',
    unsubscribeReason:
      'You receive this email from CS Token Dapp because your email is set by admin',
  };

  const { dappMailerUrl, dappMailerSecret } = dappMailerConfig;

  rp({
    method: 'POST',
    url: `${dappMailerUrl}/send`,
    headers: {
      Authorization: dappMailerSecret,
    },
    form: data,
    json: true,
  })
    .then((res) => {
      console.info(`email sent to ${mailTo}: `, res);
    })
    .catch((err) => {
      console.error(`error sending email to ${mailTo}`, err);
    });
};

module.exports = sendMail;
