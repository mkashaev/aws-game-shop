import { integer, pgTable, uuid } from 'drizzle-orm/pg-core';
import { Carts } from './Carts.schema';
import { relations } from 'drizzle-orm';

export const CartItems = pgTable('cart_items', {
  cartId: uuid('cart_id')
    .primaryKey()
    .references(() => Carts.id, { onDelete: 'cascade' })
    .notNull(),
  productId: uuid('product_id').defaultRandom(),
  count: integer('count').default(0),
});

// RELATIONS
export const CartItemsRelations = relations(CartItems, ({ one }) => ({
  cart: one(Carts, {
    fields: [CartItems.cartId],
    references: [Carts.id],
  }),
}));
