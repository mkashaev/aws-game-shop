import { formatJSONResponse, formatJSONServerError } from "@libs/api-gateway";
import { ProductService } from "@modules/products";

const getAvailableProducts = async () => {
  try {
    const productService = new ProductService({});
    const data = await productService.getAvailableProducts();

    console.log({ data });

    return formatJSONResponse(data);
  } catch (err) {
    return formatJSONServerError("Available product list server error");
  }
};

export const main = getAvailableProducts;
