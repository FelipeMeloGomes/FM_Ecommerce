import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateProduct } from "../../core/products/CreateProduct";
import { DeleteProduct } from "../../core/products/DeleteProduct";
import type { Product } from "../../core/products/Product";
import { UpdateProduct } from "../../core/products/UpdateProduct";
import {
  makeProductImageGatewayMock,
  makeProductRepositoryMock,
  makeSanityImageRef,
  makeSlugGatewayMock,
  makeSlugServiceMock,
} from "../factories/repositoryMocks";

const repo = makeProductRepositoryMock();
const imageGateway = makeProductImageGatewayMock();
const slugGateway = makeSlugGatewayMock();

const makeExistingProduct = (overrides: Partial<Product> = {}): Product => ({
  _id: "prod-1",
  name: "Produto Antigo",
  slug: "produto-antigo",
  description: "Descrição",
  price: 100,
  discount: 0,
  stock: 10,
  weight: 1,
  width: 10,
  height: 10,
  length: 10,
  isFeatured: false,
  images: [],
  ...overrides,
});

const baseInput = {
  name: "Produto",
  description: "Descrição",
  price: 100,
  discount: 0,
  stock: 10,
  weight: 1,
  width: 10,
  height: 10,
  length: 10,
  isFeatured: false,
  categories: [] as { _type: "reference"; _ref: string; _key: string }[],
  brand: undefined as undefined,
};

describe("CreateProduct", () => {
  beforeEach(() => vi.clearAllMocks());

  const useCase = () =>
    new CreateProduct(repo, slugGateway as never, imageGateway);

  it("cria produto com dados válidos", async () => {
    const imageRef = makeSanityImageRef("image-ref-123", "image-1");
    vi.mocked(slugGateway.generate).mockResolvedValue("produto-teste");
    vi.mocked(repo.findBySlug).mockResolvedValue(null);
    vi.mocked(imageGateway.uploadMany).mockResolvedValue([imageRef]);
    vi.mocked(repo.create).mockResolvedValue();

    await useCase().execute({
      ...baseInput,
      name: "Produto Teste",
      price: 100,
      discount: 10,
      stock: 50,
      weight: 1.5,
      width: 10,
      height: 20,
      length: 30,
      status: "new",
      variant: "gadget",
      isFeatured: true,
      categories: [{ _type: "reference", _ref: "cat-1" }],
      brand: { _type: "reference", _ref: "brand-1" },
      imageFiles: [new File([], "image.jpg")],
    });

    expect(slugGateway.generate).toHaveBeenCalledWith("Produto Teste");
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Produto Teste",
        slug: "produto-teste",
        price: 100,
        discount: 10,
        stock: 50,
        isFeatured: true,
        categories: [{ _type: "reference", _ref: "cat-1" }],
        brand: { _type: "reference", _ref: "brand-1" },
      }),
    );
  });

  it("lança erro quando slug já existe", async () => {
    vi.mocked(slugGateway.generate).mockResolvedValue("produto-existente");
    vi.mocked(repo.findBySlug).mockResolvedValue({
      _id: "prod-1",
      name: "Produto Existente",
      slug: "produto-existente",
    } as Product);

    await expect(
      useCase().execute({ ...baseInput, name: "Produto Existente" }),
    ).rejects.toThrow("Slug já existe");
  });

  it("cria produto sem imagens", async () => {
    vi.mocked(slugGateway.generate).mockResolvedValue("produto-sem-imagem");
    vi.mocked(repo.findBySlug).mockResolvedValue(null);
    vi.mocked(imageGateway.uploadMany).mockResolvedValue([]);
    vi.mocked(repo.create).mockResolvedValue();

    await useCase().execute({
      ...baseInput,
      name: "Produto Sem Imagem",
      imageFiles: [],
    });

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ images: [] }),
    );
  });
});

describe("UpdateProduct", () => {
  beforeEach(() => vi.clearAllMocks());

  const useCase = () => new UpdateProduct(repo, imageGateway);

  it("atualiza produto com dados válidos", async () => {
    vi.mocked(repo.findById).mockResolvedValue(makeExistingProduct());
    vi.mocked(imageGateway.uploadMany).mockResolvedValue([]);
    vi.mocked(repo.update).mockResolvedValue();

    await useCase().execute({
      id: "prod-1",
      ...baseInput,
      name: "Produto Antigo",
      description: "Nova descrição",
      price: 150,
      discount: 20,
      stock: 30,
      status: "hot",
      variant: "appliances",
      isFeatured: true,
      categories: [{ _type: "reference", _ref: "cat-1", _key: "key-1" }],
      brand: { _type: "reference", _ref: "brand-1" },
      existingImages: [],
      newImageFiles: [],
      slugService: makeSlugServiceMock("produto-antigo") as never,
    });

    expect(repo.update).toHaveBeenCalledWith(
      "prod-1",
      expect.objectContaining({
        description: "Nova descrição",
        price: 150,
        discount: 20,
        stock: 30,
        status: "hot",
        isFeatured: true,
      }),
    );
  });

  it("gera novo slug quando nome muda", async () => {
    vi.mocked(repo.findById).mockResolvedValue(makeExistingProduct());
    vi.mocked(imageGateway.uploadMany).mockResolvedValue([]);
    vi.mocked(repo.update).mockResolvedValue();
    const slugService = makeSlugServiceMock("novo-produto");

    await useCase().execute({
      id: "prod-1",
      ...baseInput,
      name: "Novo Produto",
      existingImages: [],
      newImageFiles: [],
      slugService: slugService as never,
    });

    expect(slugService.generate).toHaveBeenCalledWith("Novo Produto");
    expect(repo.update).toHaveBeenCalledWith(
      "prod-1",
      expect.objectContaining({ slug: "novo-produto" }),
    );
  });

  it("lança erro quando produto não existe", async () => {
    vi.mocked(repo.findById).mockResolvedValue(null);

    await expect(
      useCase().execute({
        id: "prod-inexistente",
        ...baseInput,
        existingImages: [],
        newImageFiles: [],
        slugService: makeSlugServiceMock() as never,
      }),
    ).rejects.toThrow("Produto não encontrado");
  });
});

describe("DeleteProduct", () => {
  beforeEach(() => vi.clearAllMocks());

  const useCase = () => new DeleteProduct(repo);

  it("deleta produto existente", async () => {
    vi.mocked(repo.findById).mockResolvedValue(makeExistingProduct());
    vi.mocked(repo.delete).mockResolvedValue();

    await useCase().execute("prod-1");

    expect(repo.findById).toHaveBeenCalledWith("prod-1");
    expect(repo.delete).toHaveBeenCalledWith("prod-1");
  });

  it("lança erro quando produto não existe", async () => {
    vi.mocked(repo.findById).mockResolvedValue(null);

    await expect(useCase().execute("prod-inexistente")).rejects.toThrow(
      "Produto não encontrado",
    );
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
