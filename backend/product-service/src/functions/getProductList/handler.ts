import { formatJSONResponse } from "@libs/api-gateway";
import { ProductService } from "@modules/products";

const getProductList = async () => {
  const productService = new ProductService();
  const data = productService.getProductList();

  return formatJSONResponse(data);
};

export const main = getProductList;
