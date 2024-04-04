import { ProductService } from "@modules/products";
import { main } from "./handler";

describe("createProduct handler", () => {
  it("should return success", async () => {
    jest.spyOn(ProductService.prototype, "createProduct").mockImplementation(() =>
      Promise.resolve({
        message: "Success",
      })
    );

    const product = {
      title: "Title",
      description: "Desc",
      price: 20,
    };

    const event = {
      body: JSON.stringify(product),
    };

    const result = await main(event);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(body).toEqual({
      message: "Success",
    });
  });
});
