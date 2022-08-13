const AppError = require("./../utilities/AppError");
const User = require("./../models/userModel");
const Code = require("./../models/codeModel");
const { catchErrorAsync } = require("./../utilities/catchError");
const Email = require("./../utilities/mail");

const sign_up = catchErrorAsync(async (req, res, next) => {
  const randomCode = Math.round(Math.random() * 900000 + 100000);

  if (req.body.email) {
    const user = {
      email: req.body.email,
    };
    await Email(user, randomCode)();

    const codeSave = await Code.create({
      email_or_phone: user.email,
      code: randomCode,
    });
  }
  res.status(200).json({
    status: "Succes",
    message: "Emailingizga kod jo'natildi",
  });
});

module.exports = { sign_up };
