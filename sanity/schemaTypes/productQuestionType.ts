import { defineField, defineType } from "sanity";

export const productQuestionType = defineType({
  name: "productQuestion",
  title: "Pergunta sobre Produto",
  type: "document",
  fields: [
    defineField({
      name: "product",
      title: "Produto",
      type: "reference",
      to: [{ type: "product" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "userId",
      title: "ID do Usuário",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customerName",
      title: "Nome do Cliente",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customerImage",
      title: "Foto do Cliente",
      type: "url",
    }),
    defineField({
      name: "productName",
      title: "Nome do Produto",
      type: "string",
    }),
    defineField({
      name: "question",
      title: "Pergunta",
      type: "text",
      validation: (Rule) => Rule.required().min(10),
    }),
    defineField({
      name: "answer",
      title: "Resposta",
      type: "text",
    }),
    defineField({
      name: "answered",
      title: "Respondido",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "createdAt",
      title: "Data de Criação",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "productName",
      subtitle: "question",
    },
  },
});
