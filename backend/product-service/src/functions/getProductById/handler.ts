import {
  formatJSONResponse,
  formatJSONNotFoundError,
  formatJSONServerError,
} from "@libs/api-gateway";
import { ProductService } from "@modules/products";

const getProductById = async (event) => {
  console.log("Event: ", event);
  try {
    const productId: string = event.pathParameters?.productId || "";

    const productService = new ProductService({});
    const product = await productService.getProductById(productId);

    if (!product) {
      return formatJSONNotFoundError(`Product with id: ${productId} is not found`);
    }
    return formatJSONResponse(product);
  } catch (err) {
    return formatJSONServerError("Product by id server error");
  }
};

export const main = getProductById;
