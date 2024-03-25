import { ProductService } from "@modules/products";
import { main } from "./handler";

describe("getProductById handler", () => {
  it("should return product by Id", async () => {
    jest.spyOn(ProductService.prototype, "getProductById").mockImplementation(() => ({
      description: "Short Product Description1",
      id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
      price: 24,
      title: "ProductOne",
    }));

    const event = {
      pathParameters: { productId: "7567ec4b-b10c-48c5-9345-fc73c48a80aa" },
    };

    const result = await main(event);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(body.data).toEqual({
      description: "Short Product Description1",
      id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
      price: 24,
      title: "ProductOne",
    });
  });

  it("should return not found error", async () => {
    jest.spyOn(ProductService.prototype, "getProductById").mockImplementation(() => null);

    const event = {
      pathParameters: { productId: "7567ec4b-b10c-48c5-9345-fc73c48a80aa" },
    };

    const result = await main(event);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(404);
    expect(body.message).toBe("Product with id: 7567ec4b-b10c-48c5-9345-fc73c48a80aa is not found");
  });
});
