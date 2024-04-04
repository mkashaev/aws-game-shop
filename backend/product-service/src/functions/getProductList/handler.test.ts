import { ProductService } from "@modules/products";
import { main } from "./handler";

describe("getProductList handler", () => {
  it("should return products", async () => {
    jest.spyOn(ProductService.prototype, "getProductList").mockImplementation(() =>
      Promise.resolve([
        {
          description: "Short Product Description1",
          id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
          price: 24,
          title: "ProductOne",
        },
      ])
    );

    const result = await main();
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(body).toEqual([
      {
        description: "Short Product Description1",
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
        price: 24,
        title: "ProductOne",
      },
    ]);
  });
});
