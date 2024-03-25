import { formatJSONResponse } from "@libs/api-gateway";
import { ProductService } from "@modules/products";

const getProductList = async (event) => {
  const productService = new ProductService();
  const data = productService.getProductList();

  return formatJSONResponse({
    data,
    event,
  });
};

export const main = getProductList;
