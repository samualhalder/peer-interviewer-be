import loggerHelper from "../helpers/logger.helper";
import ResponseWrapper from "../helpers/response.helper";

const errorHandler = (err: any, req: any, res: any, next: any) => {
  try {
    const status = err.status || 500;
    const message = err.message || 500;
    loggerHelper.error(err);
    ResponseWrapper(res).status(status).message(message).send();
  } catch (error) {
    console.log("err h", error);
  }
};

export default errorHandler;
