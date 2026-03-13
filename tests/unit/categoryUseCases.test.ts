import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Category } from "../../core/categories/Category";
import { CreateCategory } from "../../core/categories/CreateCategory";
import { DeleteCategory } from "../../core/categories/DeleteCategory";
import { UpdateCategory } from "../../core/categories/UpdateCategory";
import {
  makeCategoryImageGatewayMock,
  makeCategoryRepositoryMock,
  makeSanityImageRef,
  makeSlugGatewayMock,
} from "../factories/repositoryMocks";

const repo = makeCategoryRepositoryMock();
const imageGateway = makeCategoryImageGatewayMock();
const slugGateway = makeSlugGatewayMock();

const makeImageFile = (name = "categoria.jpg") =>
  new File(["content"], name, { type: "image/jpeg" });

const makeCategory = (overrides: Partial<Category> = {}): Category => ({
  _id: "cat-1",
  title: "Eletrônicos",
  slug: "eletrônicos",
  ...overrides,
});

describe("CreateCategory", () => {
  beforeEach(() => vi.clearAllMocks());

  const useCase = () => new CreateCategory(repo, slugGateway, imageGateway);

  it("cria categoria com todos os campos", async () => {
    const imageRef = makeSanityImageRef("image-ref-123", "img-1");
    vi.mocked(slugGateway.generate).mockResolvedValue("eletrônicos");
    vi.mocked(repo.findBySlug).mockResolvedValue(null);
    vi.mocked(imageGateway.upload).mockResolvedValue(imageRef);
    vi.mocked(repo.create).mockResolvedValue();

    await useCase().execute({
      title: "Eletrônicos",
      description: "Produtos eletrônicos diversos",
      range: 500,
      featured: true,
      image: makeImageFile(),
    });

    expect(slugGateway.generate).toHaveBeenCalledWith("Eletrônicos");
    expect(repo.findBySlug).toHaveBeenCalledWith("eletrônicos");
    expect(imageGateway.upload).toHaveBeenCalled();
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Eletrônicos",
        slug: "eletrônicos",
        description: "Produtos eletrônicos diversos",
        range: 500,
        featured: true,
        image: imageRef,
      }),
    );
  });

  it("cria categoria sem imagem", async () => {
    vi.mocked(slugGateway.generate).mockResolvedValue("roupas");
    vi.mocked(repo.findBySlug).mockResolvedValue(null);
    vi.mocked(imageGateway.upload).mockResolvedValue(undefined);
    vi.mocked(repo.create).mockResolvedValue();

    await useCase().execute({
      title: "Roupas",
      description: "Vestuário",
      range: 200,
      featured: false,
    });

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Roupas",
        slug: "roupas",
        image: undefined,
      }),
    );
  });

  it("usa valores padrão para range e featured", async () => {
    vi.mocked(slugGateway.generate).mockResolvedValue("livros");
    vi.mocked(repo.findBySlug).mockResolvedValue(null);
    vi.mocked(imageGateway.upload).mockResolvedValue(undefined);
    vi.mocked(repo.create).mockResolvedValue();

    await useCase().execute({
      title: "Livros",
      description: "Livros variados",
    });

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Livros", featured: false }),
    );
  });

  it("lança erro quando slug já existe", async () => {
    vi.mocked(slugGateway.generate).mockResolvedValue("eletrônicos");
    vi.mocked(repo.findBySlug).mockResolvedValue(makeCategory());

    await expect(
      useCase().execute({
        title: "Eletrônicos",
        description: "Produtos eletrônicos",
      }),
    ).rejects.toThrow("Slug já existe");

    expect(repo.create).not.toHaveBeenCalled();
  });
});

describe("UpdateCategory", () => {
  beforeEach(() => vi.clearAllMocks());

  const useCase = () => new UpdateCategory(repo, slugGateway, imageGateway);

  it("atualiza categoria com dados válidos", async () => {
    vi.mocked(repo.findById).mockResolvedValue(
      makeCategory({
        description: "Produtos antigos",
        range: 500,
        featured: false,
      }),
    );
    vi.mocked(slugGateway.generate).mockResolvedValue("eletrônicos");
    vi.mocked(imageGateway.upload).mockResolvedValue(undefined);
    vi.mocked(repo.update).mockResolvedValue();

    await useCase().execute("cat-1", {
      title: "Eletrônicos",
      description: "Produtos eletrônicos diversos",
      range: 1000,
      featured: true,
      removeImage: false,
    });

    expect(repo.update).toHaveBeenCalledWith(
      "cat-1",
      expect.objectContaining({
        description: "Produtos eletrônicos diversos",
        range: 1000,
        featured: true,
      }),
    );
  });

  it("gera novo slug quando título muda", async () => {
    vi.mocked(repo.findById).mockResolvedValue(makeCategory());
    vi.mocked(slugGateway.generate).mockResolvedValue("informatica");
    vi.mocked(repo.findBySlug).mockResolvedValue(null);
    vi.mocked(imageGateway.upload).mockResolvedValue(undefined);
    vi.mocked(repo.update).mockResolvedValue();

    await useCase().execute("cat-1", {
      title: "Informática",
      description: "Produtos de informática",
    });

    expect(slugGateway.generate).toHaveBeenCalledWith("Informática");
    expect(repo.update).toHaveBeenCalledWith(
      "cat-1",
      expect.objectContaining({ title: "Informática", slug: "informatica" }),
    );
  });

  it("não gera novo slug se título não muda", async () => {
    vi.mocked(repo.findById).mockResolvedValue(makeCategory());
    vi.mocked(imageGateway.upload).mockResolvedValue(undefined);
    vi.mocked(repo.update).mockResolvedValue();

    await useCase().execute("cat-1", {
      title: "Eletrônicos",
      description: "Nova descrição",
    });

    expect(slugGateway.generate).not.toHaveBeenCalled();
    expect(repo.update).toHaveBeenCalledWith(
      "cat-1",
      expect.objectContaining({ slug: "eletrônicos" }),
    );
  });

  it("faz upload de nova imagem", async () => {
    const imageRef = makeSanityImageRef("image-ref-456", "img-2");
    vi.mocked(repo.findById).mockResolvedValue(
      makeCategory({ _id: "cat-1", title: "Roupas", slug: "roupas" }),
    );
    vi.mocked(slugGateway.generate).mockResolvedValue("roupas");
    vi.mocked(imageGateway.upload).mockResolvedValue(imageRef);
    vi.mocked(repo.update).mockResolvedValue();

    await useCase().execute("cat-1", {
      title: "Roupas",
      description: "Vestuário",
      image: makeImageFile("nova-imagem.jpg"),
    });

    expect(imageGateway.upload).toHaveBeenCalled();
    expect(repo.update).toHaveBeenCalledWith(
      "cat-1",
      expect.objectContaining({ image: imageRef }),
    );
  });

  it("remove imagem quando removeImage é true", async () => {
    vi.mocked(repo.findById).mockResolvedValue(
      makeCategory({ image: makeSanityImageRef("old-ref", "old-img") }),
    );
    vi.mocked(slugGateway.generate).mockResolvedValue("eletrônicos");
    vi.mocked(repo.update).mockResolvedValue();

    await useCase().execute("cat-1", {
      title: "Eletrônicos",
      description: "Vestuário",
      removeImage: true,
    });

    expect(repo.update).toHaveBeenCalledWith(
      "cat-1",
      expect.objectContaining({ image: undefined }),
    );
  });

  it("lança erro quando categoria não existe", async () => {
    vi.mocked(repo.findById).mockResolvedValue(null);

    await expect(
      useCase().execute("cat-inexistente", {
        title: "Qualquer",
        description: "Coisa",
      }),
    ).rejects.toThrow("Categoria não encontrada");

    expect(repo.update).not.toHaveBeenCalled();
  });

  it("lança erro quando novo slug já existe em outra categoria", async () => {
    vi.mocked(repo.findById).mockResolvedValue(makeCategory());
    vi.mocked(slugGateway.generate).mockResolvedValue("informatica");
    vi.mocked(repo.findBySlug).mockResolvedValue(
      makeCategory({ _id: "cat-2", title: "Informática", slug: "informatica" }),
    );

    await expect(
      useCase().execute("cat-1", {
        title: "Informática",
        description: "Produtos",
      }),
    ).rejects.toThrow("Slug já existe");

    expect(repo.update).not.toHaveBeenCalled();
  });
});

describe("DeleteCategory", () => {
  beforeEach(() => vi.clearAllMocks());

  const useCase = () => new DeleteCategory(repo);

  it("deleta categoria existente", async () => {
    vi.mocked(repo.findById).mockResolvedValue(makeCategory());
    vi.mocked(repo.delete).mockResolvedValue();

    await useCase().execute("cat-1");

    expect(repo.delete).toHaveBeenCalledWith("cat-1");
  });

  it("lança erro quando categoria não existe", async () => {
    vi.mocked(repo.findById).mockResolvedValue(null);

    await expect(useCase().execute("cat-inexistente")).rejects.toThrow(
      "Categoria não encontrada",
    );
    expect(repo.delete).not.toHaveBeenCalled();
  });

  it("verifica existência antes de deletar", async () => {
    vi.mocked(repo.findById).mockResolvedValue(null);

    await useCase()
      .execute("cat-123")
      .catch(() => {});

    expect(repo.findById).toHaveBeenCalledWith("cat-123");
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
