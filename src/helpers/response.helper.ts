import { Response } from "express";

class ResponseHandler {
  private response: Response;
  private statusCode: number;
  private textMessage: string | boolean;
  private result: unknown;
  private errorStatus: boolean;
  private pagination: unknown;

  constructor(res: Response) {
    if (!res) {
      throw new Error(
        "Express Response object is required to initialize Response Handler"
      );
    }

    this.response = res;
    this.statusCode = 200;
    this.textMessage = false;
    this.result = undefined;
    this.errorStatus = false;
    this.pagination = undefined;
  }

  // Set the HTTP status code
  status(code: number): this {
    this.statusCode = code;
    return this;
  }

  // Set the response body data
  body(data: unknown): this {
    this.result = data;
    return this;
  }

  // Set a success message
  message(text: string): this {
    this.textMessage = text;
    return this;
  }

  // Set an error message
  error(text: string): this {
    this.textMessage = text;
    this.errorStatus = true;
    return this;
  }

  // Set pagination details
  paginate(pageObj: unknown): this {
    this.pagination = pageObj;
    return this;
  }

  // Send the final response
  send(): Response {
    const obj = {
      error: this.errorStatus,
      message: this.textMessage || "",
      result: this.result ?? null,
      pagination: this.pagination,
    };

    return this.response.status(this.statusCode).send(obj);
  }
}

// Utility function to create a ResponseHandler instance
const ResponseWrapper = (res: Response): ResponseHandler => {
  return new ResponseHandler(res);
};

export default ResponseWrapper;
