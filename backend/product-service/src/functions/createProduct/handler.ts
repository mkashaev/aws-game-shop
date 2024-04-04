import {
  formatJSONPayloadError,
  formatJSONResponse,
  formatJSONServerError,
} from "@libs/api-gateway";
import { ProductService } from "@modules/products";
import { ProductPut } from "@modules/products/types";
import * as Joi from "joi";

const schema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  price: Joi.number().integer().required(),
}).required();

const createProduct = async (event) => {
  try {
    const product: ProductPut = JSON.parse(event.body);

    const { error } = schema.validate(product);

    if (error) {
      return formatJSONPayloadError(error.details[0].message);
    }

    const productService = new ProductService({});
    console.log("1");
    const data = await productService.createProduct(product);
    return formatJSONResponse(data);
  } catch (err) {
    return formatJSONServerError("Product list server error");
  }
};

export const main = createProduct;
