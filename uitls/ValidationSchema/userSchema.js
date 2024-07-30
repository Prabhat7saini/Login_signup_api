const yup = require('yup');

const signUPSchema = yup.object().shape({
    firstName: yup.string()
        .required('First Name is required')
        .matches(/^[A-Za-z]+$/, 'First Name can only contain alphabetic characters'),

    lastName: yup.string()
        .required('Last Name is required')
        .matches(/^[A-Za-z]+$/, 'Last Name can only contain alphabetic characters'),
    password: yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
});

const LoginSchema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
});
const otpSchema=yup.object({
    email: yup.string().email('Invalid email').required('Email is required'),
})
function validateSchema(schema) {
    return async (req, res, next) => {
        try {
            await schema.validate(req.body, { abortEarly: false });
            next(); // Validation passed, proceed to the next middleware or route handler
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                // Yup validation error
                const validationErrors = error.inner.map(err => ({
                    field: err.path,
                    message: err.message,
                }));
                return res.status(422).json({ errors: validationErrors });
            }
            next(error); // Forward other errors to the error handler middleware
        }
    };
}

module.exports = {
    signUPSchema,
    LoginSchema,
    otpSchema,
    validateSchema,
};
