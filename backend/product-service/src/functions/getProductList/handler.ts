import { formatJSONResponse, formatJSONServerError } from "@libs/api-gateway";
import { ProductService } from "@modules/products";

const getProductList = async () => {
  try {
    const productService = new ProductService({});
    const data = await productService.getProductList();
    return formatJSONResponse(data);
  } catch (err) {
    return formatJSONServerError("Product list server error");
  }
};

export const main = getProductList;
