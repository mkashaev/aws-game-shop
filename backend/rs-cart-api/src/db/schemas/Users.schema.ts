import { relations } from 'drizzle-orm';
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { Carts } from './Carts.schema';

export const Users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .defaultRandom(),
  name: text('name'),
  password: text('password'),
});

// RELATIONS
export const UsersRelations = relations(Users, ({ one }) => ({
  cart: one(Carts),
}));
