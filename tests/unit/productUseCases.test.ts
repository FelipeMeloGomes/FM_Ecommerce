import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateProduct } from "../../core/products/CreateProduct";
import { DeleteProduct } from "../../core/products/DeleteProduct";
import type { Product } from "../../core/products/Product";
import type { ProductImageGateway } from "../../core/products/ProductImageGateway";
import type { ProductRepository } from "../../core/products/ProductRepository";
import type { SlugGateway } from "../../core/products/SlugGateway";
import { UpdateProduct } from "../../core/products/UpdateProduct";

const mockRepository: ProductRepository = {
  findAll: vi.fn(),
  findById: vi.fn(),
  findBySlug: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

const mockImageGateway: ProductImageGateway = {
  uploadMany: vi.fn(),
};

const mockSlugGateway: SlugGateway = {
  generate: vi.fn(),
};

describe("CreateProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve criar um produto com dados válidos", async () => {
    vi.mocked(mockSlugGateway.generate).mockResolvedValue("produto-teste");
    vi.mocked(mockRepository.findBySlug).mockResolvedValue(null);
    vi.mocked(mockImageGateway.uploadMany).mockResolvedValue([
      {
        _key: "image-1",
        _type: "image",
        asset: {
          _type: "reference",
          _ref: "image-ref-123",
        },
      },
    ]);
    vi.mocked(mockRepository.create).mockResolvedValue();

    const useCase = new CreateProduct(
      mockRepository,
      mockSlugGateway as unknown as SlugGateway,
      mockImageGateway,
    );

    await useCase.execute({
      name: "Produto Teste",
      description: "Descrição do produto",
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

    expect(mockSlugGateway.generate).toHaveBeenCalledWith("Produto Teste");
    expect(mockRepository.findBySlug).toHaveBeenCalledWith("produto-teste");
    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Produto Teste",
        slug: "produto-teste",
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
      }),
    );
  });

  it("deve lançar erro quando o slug já existe", async () => {
    vi.mocked(mockSlugGateway.generate).mockResolvedValue("produto-existente");
    vi.mocked(mockRepository.findBySlug).mockResolvedValue({
      _id: "prod-1",
      name: "Produto Existente",
      slug: "produto-existente",
    } as Product);

    const useCase = new CreateProduct(
      mockRepository,
      mockSlugGateway as unknown as SlugGateway,
      mockImageGateway,
    );

    await expect(
      useCase.execute({
        name: "Produto Existente",
        description: "Descrição",
        price: 100,
        discount: 0,
        stock: 10,
        weight: 1,
        width: 10,
        height: 10,
        length: 10,
        isFeatured: false,
        categories: [],
        brand: undefined,
      }),
    ).rejects.toThrow("Slug já existe");
  });

  it("deve criar produto sem imagens", async () => {
    vi.mocked(mockSlugGateway.generate).mockResolvedValue("produto-sem-imagem");
    vi.mocked(mockRepository.findBySlug).mockResolvedValue(null);
    vi.mocked(mockImageGateway.uploadMany).mockResolvedValue([]);
    vi.mocked(mockRepository.create).mockResolvedValue();

    const useCase = new CreateProduct(
      mockRepository,
      mockSlugGateway as unknown as SlugGateway,
      mockImageGateway,
    );

    await useCase.execute({
      name: "Produto Sem Imagem",
      description: "Descrição",
      price: 50,
      discount: 0,
      stock: 5,
      weight: 1,
      width: 10,
      height: 10,
      length: 10,
      isFeatured: false,
      categories: [],
      brand: undefined,
      imageFiles: [],
    });

    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        images: [],
      }),
    );
  });
});

describe("UpdateProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve atualizar um produto com dados válidos", async () => {
    vi.mocked(mockRepository.findById).mockResolvedValue({
      _id: "prod-1",
      name: "Produto Antigo",
      slug: "produto-antigo",
      description: "Descrição antiga",
      price: 100,
      discount: 10,
      stock: 50,
      weight: 1,
      width: 10,
      height: 10,
      length: 10,
      isFeatured: false,
      images: [],
    });
    vi.mocked(mockImageGateway.uploadMany).mockResolvedValue([]);
    vi.mocked(mockRepository.update).mockResolvedValue();

    const mockSlugService = {
      generate: vi.fn().mockResolvedValue("produto-antigo"),
    };

    const useCase = new UpdateProduct(mockRepository, mockImageGateway);

    await useCase.execute({
      id: "prod-1",
      name: "Produto Antigo",
      description: "Nova descrição",
      price: 150,
      discount: 20,
      stock: 30,
      weight: 1,
      width: 10,
      height: 10,
      length: 10,
      status: "hot",
      variant: "appliances",
      isFeatured: true,
      categories: [{ _type: "reference", _ref: "cat-1", _key: "key-1" }],
      brand: { _type: "reference", _ref: "brand-1" },
      existingImages: [],
      newImageFiles: [],
      slugService: mockSlugService as never,
    });

    expect(mockRepository.update).toHaveBeenCalledWith(
      "prod-1",
      expect.objectContaining({
        description: "Nova descrição",
        price: 150,
        discount: 20,
        stock: 30,
        status: "hot",
        variant: "appliances",
        isFeatured: true,
        categories: [{ _type: "reference", _ref: "cat-1", _key: "key-1" }],
        brand: { _type: "reference", _ref: "brand-1" },
      }),
    );
  });

  it("deve gerar novo slug quando o nome mudar", async () => {
    vi.mocked(mockRepository.findById).mockResolvedValue({
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
    });
    vi.mocked(mockImageGateway.uploadMany).mockResolvedValue([]);
    vi.mocked(mockRepository.update).mockResolvedValue();

    const mockSlugService = {
      generate: vi.fn().mockResolvedValue("novo-produto"),
    };

    const useCase = new UpdateProduct(mockRepository, mockImageGateway);

    await useCase.execute({
      id: "prod-1",
      name: "Novo Produto",
      description: "Descrição",
      price: 100,
      discount: 0,
      stock: 10,
      weight: 1,
      width: 10,
      height: 10,
      length: 10,
      isFeatured: false,
      categories: [],
      existingImages: [],
      newImageFiles: [],
      slugService: mockSlugService as never,
    });

    expect(mockSlugService.generate).toHaveBeenCalledWith("Novo Produto");
    expect(mockRepository.update).toHaveBeenCalledWith(
      "prod-1",
      expect.objectContaining({
        slug: "novo-produto",
      }),
    );
  });

  it("deve lançar erro quando produto não existir", async () => {
    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    const mockSlugService = {
      generate: vi.fn(),
    };

    const useCase = new UpdateProduct(mockRepository, mockImageGateway);

    await expect(
      useCase.execute({
        id: "prod-inexistente",
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
        categories: [],
        existingImages: [],
        newImageFiles: [],
        slugService: mockSlugService as never,
      }),
    ).rejects.toThrow("Produto não encontrado");
  });
});

describe("DeleteProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve deletar um produto existente", async () => {
    vi.mocked(mockRepository.findById).mockResolvedValue({
      _id: "prod-1",
      name: "Produto",
      slug: "produto",
      description: "",
      price: 100,
      discount: 0,
      stock: 10,
      weight: 1,
      width: 10,
      height: 10,
      length: 10,
      isFeatured: false,
      images: [],
    });
    vi.mocked(mockRepository.delete).mockResolvedValue();

    const useCase = new DeleteProduct(mockRepository);

    await useCase.execute("prod-1");

    expect(mockRepository.findById).toHaveBeenCalledWith("prod-1");
    expect(mockRepository.delete).toHaveBeenCalledWith("prod-1");
  });

  it("deve lançar erro quando produto não existir", async () => {
    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    const useCase = new DeleteProduct(mockRepository);

    await expect(useCase.execute("prod-inexistente")).rejects.toThrow(
      "Produto não encontrado",
    );
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });
});
