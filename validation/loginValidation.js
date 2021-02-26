const Joi = require("joi");

const logSchema = Joi.object({
    logUsername: Joi.string()
        .trim()
        .alphanum()
        .lowercase()
        .label("username")
        .required(),
    logPassword: Joi.string()
        .min(3)
        .max(30)
        .label("password")
        .required(),
});

module.exports = {
    logSchema
}
