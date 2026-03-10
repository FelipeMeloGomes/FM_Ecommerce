import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Category } from "../../core/categories/Category";
import type { CategoryImageGateway } from "../../core/categories/CategoryImageGateway";
import type { CategoryRepository } from "../../core/categories/CategoryRepository";
import { CreateCategory } from "../../core/categories/CreateCategory";
import { DeleteCategory } from "../../core/categories/DeleteCategory";
import { UpdateCategory } from "../../core/categories/UpdateCategory";
import type { SlugGateway } from "../../core/products/SlugGateway";

const mockRepository: CategoryRepository = {
  findAll: vi.fn(),
  findById: vi.fn(),
  findBySlug: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

const mockImageGateway: CategoryImageGateway = {
  upload: vi.fn(),
};

const mockSlugGateway: SlugGateway = {
  generate: vi.fn(),
};

describe("CreateCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve criar uma categoria com dados válidos", async () => {
    vi.mocked(mockSlugGateway.generate).mockResolvedValue("eletrônicos");
    vi.mocked(mockRepository.findBySlug).mockResolvedValue(null);
    vi.mocked(mockImageGateway.upload).mockResolvedValue({
      _key: "img-1",
      _type: "image",
      asset: {
        _type: "reference",
        _ref: "image-ref-123",
      },
    });
    vi.mocked(mockRepository.create).mockResolvedValue();

    const useCase = new CreateCategory(
      mockRepository,
      mockSlugGateway,
      mockImageGateway,
    );

    const imageFile = new File(["content"], "categoria.jpg", {
      type: "image/jpeg",
    });

    await useCase.execute({
      title: "Eletrônicos",
      description: "Produtos eletrônicos diversos",
      range: 500,
      featured: true,
      imageFile,
    });

    expect(mockSlugGateway.generate).toHaveBeenCalledWith("Eletrônicos");
    expect(mockRepository.findBySlug).toHaveBeenCalledWith("eletrônicos");
    expect(mockImageGateway.upload).toHaveBeenCalledWith(imageFile);
    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Eletrônicos",
        slug: "eletrônicos",
        description: "Produtos eletrônicos diversos",
        range: 500,
        featured: true,
        image: {
          _key: "img-1",
          _type: "image",
          asset: {
            _type: "reference",
            _ref: "image-ref-123",
          },
        },
      }),
    );
  });

  it("deve criar categoria sem imagem", async () => {
    vi.mocked(mockSlugGateway.generate).mockResolvedValue("roupas");
    vi.mocked(mockRepository.findBySlug).mockResolvedValue(null);
    vi.mocked(mockImageGateway.upload).mockResolvedValue(undefined);
    vi.mocked(mockRepository.create).mockResolvedValue();

    const useCase = new CreateCategory(
      mockRepository,
      mockSlugGateway,
      mockImageGateway,
    );

    await useCase.execute({
      title: "Roupas",
      description: "Vestuário em geral",
      range: 200,
      featured: false,
    });

    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Roupas",
        slug: "roupas",
        image: undefined,
      }),
    );
  });

  it("deve usar valores padrão para range e featured", async () => {
    vi.mocked(mockSlugGateway.generate).mockResolvedValue("livros");
    vi.mocked(mockRepository.findBySlug).mockResolvedValue(null);
    vi.mocked(mockImageGateway.upload).mockResolvedValue(undefined);
    vi.mocked(mockRepository.create).mockResolvedValue();

    const useCase = new CreateCategory(
      mockRepository,
      mockSlugGateway,
      mockImageGateway,
    );

    await useCase.execute({
      title: "Livros",
      description: "Livros variados",
    });

    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Livros",
        featured: false,
      }),
    );
  });

  it("deve lançar erro quando slug já existe", async () => {
    vi.mocked(mockSlugGateway.generate).mockResolvedValue("eletrônicos");
    vi.mocked(mockRepository.findBySlug).mockResolvedValue({
      _id: "cat-1",
      title: "Eletrônicos",
      slug: "eletrônicos",
    } as Category);

    const useCase = new CreateCategory(
      mockRepository,
      mockSlugGateway,
      mockImageGateway,
    );

    await expect(
      useCase.execute({
        title: "Eletrônicos",
        description: "Produtos eletrônicos",
      }),
    ).rejects.toThrow("Slug já existe");

    expect(mockRepository.create).not.toHaveBeenCalled();
  });
});

describe("UpdateCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve atualizar uma categoria com dados válidos", async () => {
    const existingCategory: Category = {
      _id: "cat-1",
      title: "Eletrônicos",
      slug: "eletrônicos",
      description: "Produtos antigos",
      range: 500,
      featured: false,
    };

    vi.mocked(mockRepository.findById).mockResolvedValue(existingCategory);
    vi.mocked(mockSlugGateway.generate).mockResolvedValue("eletrônicos");
    vi.mocked(mockImageGateway.upload).mockResolvedValue(undefined);
    vi.mocked(mockRepository.update).mockResolvedValue();

    const useCase = new UpdateCategory(
      mockRepository,
      mockSlugGateway,
      mockImageGateway,
    );

    await useCase.execute("cat-1", {
      title: "Eletrônicos",
      description: "Produtos eletrônicos diversos",
      range: 1000,
      featured: true,
      removeImage: false,
    });

    expect(mockRepository.update).toHaveBeenCalledWith(
      "cat-1",
      expect.objectContaining({
        title: "Eletrônicos",
        description: "Produtos eletrônicos diversos",
        range: 1000,
        featured: true,
      }),
    );
  });

  it("deve gerar novo slug quando o título mudar", async () => {
    const existingCategory: Category = {
      _id: "cat-1",
      title: "Eletrônicos",
      slug: "eletrônicos",
    };

    vi.mocked(mockRepository.findById).mockResolvedValue(existingCategory);
    vi.mocked(mockSlugGateway.generate).mockResolvedValue("informatica");
    vi.mocked(mockRepository.findBySlug).mockResolvedValue(null);
    vi.mocked(mockImageGateway.upload).mockResolvedValue(undefined);
    vi.mocked(mockRepository.update).mockResolvedValue();

    const useCase = new UpdateCategory(
      mockRepository,
      mockSlugGateway,
      mockImageGateway,
    );

    await useCase.execute("cat-1", {
      title: "Informática",
      description: "Produtos de informática",
    });

    expect(mockSlugGateway.generate).toHaveBeenCalledWith("Informática");
    expect(mockRepository.findBySlug).toHaveBeenCalledWith("informatica");
    expect(mockRepository.update).toHaveBeenCalledWith(
      "cat-1",
      expect.objectContaining({
        title: "Informática",
        slug: "informatica",
      }),
    );
  });

  it("não deve gerar novo slug se o título não mudar", async () => {
    const existingCategory: Category = {
      _id: "cat-1",
      title: "Eletrônicos",
      slug: "eletrônicos",
    };

    vi.mocked(mockRepository.findById).mockResolvedValue(existingCategory);
    vi.mocked(mockImageGateway.upload).mockResolvedValue(undefined);
    vi.mocked(mockRepository.update).mockResolvedValue();

    const useCase = new UpdateCategory(
      mockRepository,
      mockSlugGateway,
      mockImageGateway,
    );

    await useCase.execute("cat-1", {
      title: "Eletrônicos",
      description: "Nova descrição",
    });

    expect(mockSlugGateway.generate).not.toHaveBeenCalled();
    expect(mockRepository.update).toHaveBeenCalledWith(
      "cat-1",
      expect.objectContaining({
        slug: "eletrônicos",
      }),
    );
  });

  it("deve fazer upload de nova imagem", async () => {
    const existingCategory: Category = {
      _id: "cat-1",
      title: "Roupas",
      slug: "roupas",
    };

    vi.mocked(mockRepository.findById).mockResolvedValue(existingCategory);
    vi.mocked(mockSlugGateway.generate).mockResolvedValue("roupas");
    vi.mocked(mockImageGateway.upload).mockResolvedValue({
      _key: "img-2",
      _type: "image",
      asset: {
        _type: "reference",
        _ref: "image-ref-456",
      },
    });
    vi.mocked(mockRepository.update).mockResolvedValue();

    const useCase = new UpdateCategory(
      mockRepository,
      mockSlugGateway,
      mockImageGateway,
    );

    const imageFile = new File(["content"], "nova-imagem.jpg", {
      type: "image/jpeg",
    });

    await useCase.execute("cat-1", {
      title: "Roupas",
      description: "Vestuário",
      imageFile,
    });

    expect(mockImageGateway.upload).toHaveBeenCalledWith(imageFile);
    expect(mockRepository.update).toHaveBeenCalledWith(
      "cat-1",
      expect.objectContaining({
        image: {
          _key: "img-2",
          _type: "image",
          asset: {
            _type: "reference",
            _ref: "image-ref-456",
          },
        },
      }),
    );
  });

  it("deve remover imagem quando removeImage é true", async () => {
    const existingCategory: Category = {
      _id: "cat-1",
      title: "Roupas",
      slug: "roupas",
      image: {
        _key: "old-img",
        _type: "image",
        asset: {
          _type: "reference",
          _ref: "old-ref",
        },
      },
    };

    vi.mocked(mockRepository.findById).mockResolvedValue(existingCategory);
    vi.mocked(mockSlugGateway.generate).mockResolvedValue("roupas");
    vi.mocked(mockRepository.update).mockResolvedValue();

    const useCase = new UpdateCategory(
      mockRepository,
      mockSlugGateway,
      mockImageGateway,
    );

    await useCase.execute("cat-1", {
      title: "Roupas",
      description: "Vestuário",
      removeImage: true,
    });

    expect(mockRepository.update).toHaveBeenCalledWith(
      "cat-1",
      expect.objectContaining({
        image: undefined,
      }),
    );
  });

  it("deve lançar erro quando categoria não existir", async () => {
    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    const useCase = new UpdateCategory(
      mockRepository,
      mockSlugGateway,
      mockImageGateway,
    );

    await expect(
      useCase.execute("cat-inexistente", {
        title: "Qualquer",
        description: "Coisa",
      }),
    ).rejects.toThrow("Categoria não encontrada");

    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it("deve lançar erro quando novo slug já existe em outra categoria", async () => {
    const existingCategory: Category = {
      _id: "cat-1",
      title: "Eletrônicos",
      slug: "eletrônicos",
    };

    const conflictingCategory: Category = {
      _id: "cat-2",
      title: "Informática",
      slug: "informatica",
    };

    vi.mocked(mockRepository.findById).mockResolvedValue(existingCategory);
    vi.mocked(mockSlugGateway.generate).mockResolvedValue("informatica");
    vi.mocked(mockRepository.findBySlug).mockResolvedValue(conflictingCategory);

    const useCase = new UpdateCategory(
      mockRepository,
      mockSlugGateway,
      mockImageGateway,
    );

    await expect(
      useCase.execute("cat-1", {
        title: "Informática",
        description: "Produtos",
      }),
    ).rejects.toThrow("Slug já existe");

    expect(mockRepository.update).not.toHaveBeenCalled();
  });
});

describe("DeleteCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve deletar uma categoria existente", async () => {
    const category: Category = {
      _id: "cat-1",
      title: "Eletrônicos",
      slug: "eletrônicos",
    };

    vi.mocked(mockRepository.findById).mockResolvedValue(category);
    vi.mocked(mockRepository.delete).mockResolvedValue();

    const useCase = new DeleteCategory(mockRepository);

    await useCase.execute("cat-1");

    expect(mockRepository.delete).toHaveBeenCalledWith("cat-1");
  });

  it("deve lançar erro quando categoria não existir", async () => {
    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    const useCase = new DeleteCategory(mockRepository);

    await expect(useCase.execute("cat-inexistente")).rejects.toThrow(
      "Categoria não encontrada",
    );

    expect(mockRepository.delete).not.toHaveBeenCalled();
  });

  it("deve verificar existência antes de deletar", async () => {
    vi.mocked(mockRepository.findById).mockResolvedValue(null);

    const useCase = new DeleteCategory(mockRepository);

    try {
      await useCase.execute("cat-123");
    } catch (_e) {
      // erro esperado
    }

    expect(mockRepository.findById).toHaveBeenCalledWith("cat-123");
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });
});
