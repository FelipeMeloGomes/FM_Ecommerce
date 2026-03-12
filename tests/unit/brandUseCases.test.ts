import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Brand } from "../../core/brands/Brand";
import { CreateBrand } from "../../core/brands/CreateBrand";
import {
  makeBrandImageGatewayMock,
  makeBrandRepositoryMock,
  makeSanityImageRef,
  makeSlugGatewayMock,
} from "../factories/repositoryMocks";

const makeImageFile = (name = "marca.jpg") =>
  new File(["content"], name, { type: "image/jpeg" });

const makeBrand = (overrides: Partial<Brand> = {}): Brand => ({
  _id: "brand-1",
  title: "Nike",
  slug: "nike",
  ...overrides,
});

describe("CreateBrand", () => {
  let repo: ReturnType<typeof makeBrandRepositoryMock>;
  let imageGateway: ReturnType<typeof makeBrandImageGatewayMock>;
  let slugGateway: ReturnType<typeof makeSlugGatewayMock>;

  beforeEach(() => {
    repo = makeBrandRepositoryMock();
    imageGateway = makeBrandImageGatewayMock();
    slugGateway = makeSlugGatewayMock();
  });

  const useCase = () => new CreateBrand(repo, slugGateway, imageGateway);

  it("cria marca com todos os campos", async () => {
    const file = makeImageFile();
    const imageRef = makeSanityImageRef("image-ref-123", "img-1");

    vi.mocked(slugGateway.generate).mockResolvedValue("nike");
    vi.mocked(repo.findBySlug).mockResolvedValue(null);
    vi.mocked(imageGateway.upload).mockResolvedValue(imageRef);
    vi.mocked(repo.create).mockResolvedValue();

    await useCase().execute({
      title: "Nike",
      description: "Marca de esportes",
      imageFile: file,
    });

    expect(slugGateway.generate).toHaveBeenCalledWith("Nike");
    expect(repo.findBySlug).toHaveBeenCalledWith("nike");
    expect(imageGateway.upload).toHaveBeenCalledWith(file);
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Nike",
        slug: "nike",
        description: "Marca de esportes",
        image: imageRef,
      }),
    );
  });

  it("cria marca sem imagem", async () => {
    vi.mocked(slugGateway.generate).mockResolvedValue("adidas");
    vi.mocked(repo.findBySlug).mockResolvedValue(null);
    vi.mocked(imageGateway.upload).mockResolvedValue(undefined);
    vi.mocked(repo.create).mockResolvedValue();

    await useCase().execute({
      title: "Adidas",
      description: "Marca de esportes",
    });

    expect(imageGateway.upload).toHaveBeenCalledWith(undefined);
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Adidas",
        slug: "adidas",
        image: undefined,
      }),
    );
  });

  it("cria marca sem descrição", async () => {
    vi.mocked(slugGateway.generate).mockResolvedValue("puma");
    vi.mocked(repo.findBySlug).mockResolvedValue(null);
    vi.mocked(imageGateway.upload).mockResolvedValue(undefined);
    vi.mocked(repo.create).mockResolvedValue();

    await useCase().execute({
      title: "Puma",
    });

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Puma",
        slug: "puma",
        description: undefined,
      }),
    );
  });

  it("lança erro quando slug já existe", async () => {
    vi.mocked(slugGateway.generate).mockResolvedValue("nike");
    vi.mocked(repo.findBySlug).mockResolvedValue(makeBrand());

    await expect(
      useCase().execute({
        title: "Nike",
        description: "Marca de esportes",
      }),
    ).rejects.toThrow("Slug já existe");

    expect(repo.create).not.toHaveBeenCalled();
  });

  it("propaga erro do slugGateway", async () => {
    vi.mocked(slugGateway.generate).mockRejectedValue(
      new Error("Serviço indisponível"),
    );

    await expect(useCase().execute({ title: "Nike" })).rejects.toThrow(
      "Serviço indisponível",
    );
  });
});
