import Joi from "joi";

export const schema = Joi.object({
    firstName: Joi.string()
        .trim()
        .label("First Name")
        .required(),
    lastName: Joi.string()
        .trim()
        .label("Last Name")
        .required(),
    username: Joi.string()
        .trim()
        .alphanum()
        .lowercase()
        .label("username")
        .required(),
    email: Joi.string()
        .trim()
        .lowercase()
        .label("Email")
        .email()
        .required(),
    password: Joi.string()
        .required()
        .min(3)
        .max(30)
        .label("password"),
    passwordConf: Joi.any().equal(Joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' }),
});
