import { formatJSONResponse } from "@libs/api-gateway";
import { ProductService } from "@modules/products";

const getAvailableProducts = async () => {
  const productService = new ProductService();
  const data = productService.getAvailableProducts();

  return formatJSONResponse(data);
};

export const main = getAvailableProducts;
