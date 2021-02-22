const axios = require('axios');
const catchAsync = require('./catchAsync');

const sendSMS = catchAsync(async (message, recipient) => {
  const url = `http://www.smslive247.com/http/index.aspx?cmd=sendquickmsg&owneremail=${encodeURIComponent(
    process.env.SMS_ACCOUNT_EMAIL
  )}&subacct=${encodeURIComponent(
    process.env.SMS_SUBACCOUNT
  )}&subacctpwd=${encodeURIComponent(
    process.env.SMS_SUBACCOUNT_PASSWORD
  )}&message=${encodeURIComponent(message)}&sender=${encodeURIComponent(
    process.env.SMS_SENDER
  )}&sendto=${encodeURIComponent(recipient)}`;

  await axios.get(url);
});

module.exports = sendSMS;
