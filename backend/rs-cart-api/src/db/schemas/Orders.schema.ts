import { integer, json, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { Carts, statusEnum } from './Carts.schema';
import { Users } from './Users.schema';
import { relations } from 'drizzle-orm';

export const Orders = pgTable('orders', {
  id: uuid('id')
    .primaryKey()
    .defaultRandom(),
  userId: uuid('user_id')
    .references(() => Users.id, { onDelete: 'cascade' })
    .notNull(),
  cartId: uuid('cart_id')
    .references(() => Carts.id, { onDelete: 'cascade' })
    .notNull(),
  payment: json('payment'),
  delivery: json('delivery'),
  comments: text('comments'),
  status: statusEnum('status'),
  total: integer('total').default(0),
});

// RELATIONS
export const OrdersRelations = relations(Orders, ({ one }) => ({
  user: one(Users, {
    fields: [Orders.userId],
    references: [Users.id],
  }),
  cart: one(Carts, {
    fields: [Orders.cartId],
    references: [Carts.id],
  }),
}));
