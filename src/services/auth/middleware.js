import { verifyJWT } from "./tools";
import UserModel from "../users/schema";
const errorHandler = async (errorText, value, httpStatusCode) => {
  const err = new Error();
  err.errors = [{ value: value, msg: errorText }];
  err.httpStatusCode = httpStatusCode || 400;
  return err;
};

const authorize = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decoded = await verifyJWT(token);
    const user = await userModel.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    next(await errorHandler(error));
  }
};

export default authorize;
