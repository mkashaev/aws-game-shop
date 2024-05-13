import { pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { Users } from './Users.schema';
import { relations } from 'drizzle-orm';

export const statusEnum = pgEnum('status', ['OPEN', 'ORDERED']);

export const Carts = pgTable('carts', {
  id: uuid('id')
    .primaryKey()
    .defaultRandom(),
  userId: uuid('user_id')
    .references(() => Users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at')
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull(),
  status: statusEnum('status'),
});

// RELATIONS
export const CartsRelations = relations(Carts, ({ one }) => ({
  user: one(Users, {
    fields: [Carts.userId],
    references: [Users.id],
  }),
}));
