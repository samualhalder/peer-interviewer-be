import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const generateAccessToken = (id: String, email: String, name: String) => {
  const key = process.env.JWT_SECRET as string;
  const token = jwt.sign({ id: id, email: email, name: name }, key, {
    expiresIn: "1D",
  });
  return token;
};

export { generateAccessToken };
