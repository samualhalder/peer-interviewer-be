import { Request, Response } from "express";
import HttpError from "../helpers/httpError.helper";
import ResponseWrapper from "../helpers/response.helper";

class UploadControllerClass {
  uploadImage = async (req: Request, res: Response) => {
    if (!req.file) {
      throw new HttpError(400, "No file selected");
    }
    ResponseWrapper(res).status(200).body({ url: req.file.path }).send();
  };
}

export const UploadController = new UploadControllerClass();
