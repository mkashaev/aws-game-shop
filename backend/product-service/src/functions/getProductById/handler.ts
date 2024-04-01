import { formatJSONResponse, formatJSONNotFoundError } from "@libs/api-gateway";
import { ProductService } from "@modules/products";

const getProductById = async (event) => {
  const productService = new ProductService();

  const productId: string = event.pathParameters?.productId || "";

  const product = productService.getProductById(productId);

  if (!product) {
    return formatJSONNotFoundError(`Product with id: ${productId} is not found`);
  }

  return formatJSONResponse(productService.getProductById(productId));
};

export const main = getProductById;
