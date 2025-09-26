import {StatusCodes} from "http-status-codes";
import {customErrorResponse} from "../utils/common/response.object.js";

export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);
            next();
        } catch (error) {
            let explanation = [];
            let errorMessage = '';
            error.errors.forEach((key) => {
                explanation.push(key.message);
                errorMessage += ' : ' + key.message;
            });
            res.status(StatusCodes.BAD_REQUEST).json(customErrorResponse({
                message: 'Validation error' + errorMessage,
                explanation: explanation,
            }))
        }
    }
}