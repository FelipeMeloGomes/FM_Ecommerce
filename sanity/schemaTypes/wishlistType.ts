import { HeartIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const wishlistType = defineType({
  name: "wishlist",
  title: "Wishlist",
  type: "document",
  icon: HeartIcon,
  fields: [
    defineField({
      name: "clerkUserId",
      title: "Clerk User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "product" }],
        },
      ],
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "clerkUserId",
      items: "items",
    },
    prepare({ title, items }) {
      return {
        title: `Wishlist: ${title}`,
        subtitle: `${items?.length || 0} produtos`,
      };
    },
  },
});
