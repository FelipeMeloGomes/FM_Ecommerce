import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { ReadonlyURLSearchParams } from "next/navigation";
import * as nextNavigation from "next/navigation";
import { describe, expect, it, vi } from "vitest";
import { AdminSearch } from "@/components/ui/admin-search";

const mockRouter: AppRouterInstance = {
  replace: vi.fn(),
  push: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

const mockSearchParams = (q?: string) =>
  new URLSearchParams(q ? `q=${q}` : "") as unknown as ReadonlyURLSearchParams;

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(() => mockSearchParams()),
  usePathname: vi.fn(() => "/admin/produtos"),
  useRouter: vi.fn(() => mockRouter),
}));

const items = [
  { _id: "1", name: "Tenis Nike Air", description: "Corrida" },
  { _id: "2", name: "Camiseta Adidas", description: "Academia" },
  { _id: "3", name: "Bone Puma", description: "Casual" },
];

describe("AdminSearch — filtragem local", () => {
  it("exibe todos os itens quando o input esta vazio", () => {
    render(
      <AdminSearch items={items} searchKeys={["name"]} onFilter={vi.fn()} />,
    );

    expect(screen.getByText("3 de 3 resultados")).toBeInTheDocument();
  });

  it("filtra itens pelo campo name ao digitar", async () => {
    const user = userEvent.setup();

    render(
      <AdminSearch items={items} searchKeys={["name"]} onFilter={vi.fn()} />,
    );

    await user.type(screen.getByPlaceholderText("Buscar..."), "Nike");

    expect(screen.getByText("1 de 3 resultados")).toBeInTheDocument();
  });

  it("filtra sem diferenciar maiusculas e minusculas", async () => {
    const user = userEvent.setup();

    render(
      <AdminSearch items={items} searchKeys={["name"]} onFilter={vi.fn()} />,
    );

    await user.type(screen.getByPlaceholderText("Buscar..."), "nike");

    expect(screen.getByText("1 de 3 resultados")).toBeInTheDocument();
  });

  it("filtra ignorando acentos", async () => {
    const user = userEvent.setup();

    render(
      <AdminSearch items={items} searchKeys={["name"]} onFilter={vi.fn()} />,
    );

    await user.type(screen.getByPlaceholderText("Buscar..."), "tenis");

    expect(screen.getByText("1 de 3 resultados")).toBeInTheDocument();
  });

  it("filtra em multiplos campos quando searchKeys tem mais de um", async () => {
    const user = userEvent.setup();

    render(
      <AdminSearch
        items={items}
        searchKeys={["name", "description"]}
        onFilter={vi.fn()}
      />,
    );

    await user.type(screen.getByPlaceholderText("Buscar..."), "Corrida");

    expect(screen.getByText("1 de 3 resultados")).toBeInTheDocument();
  });

  it("exibe todos os itens quando o input e limpo apos uma busca", async () => {
    const user = userEvent.setup();

    render(
      <AdminSearch items={items} searchKeys={["name"]} onFilter={vi.fn()} />,
    );

    const input = screen.getByPlaceholderText("Buscar...");
    await user.type(input, "Nike");
    await user.clear(input);

    expect(screen.getByText("3 de 3 resultados")).toBeInTheDocument();
  });
});

describe("AdminSearch — contador de resultados", () => {
  it("exibe '3 de 3 resultados' quando nao ha filtro", () => {
    render(
      <AdminSearch items={items} searchKeys={["name"]} onFilter={vi.fn()} />,
    );

    expect(screen.getByText("3 de 3 resultados")).toBeInTheDocument();
  });

  it("exibe '1 de 3 resultados' apos filtrar por um termo", async () => {
    const user = userEvent.setup();

    render(
      <AdminSearch items={items} searchKeys={["name"]} onFilter={vi.fn()} />,
    );

    await user.type(screen.getByPlaceholderText("Buscar..."), "Nike");

    expect(screen.getByText("1 de 3 resultados")).toBeInTheDocument();
  });
});

describe("AdminSearch — botao X", () => {
  it("nao exibe o botao X quando o input esta vazio", () => {
    render(
      <AdminSearch items={items} searchKeys={["name"]} onFilter={vi.fn()} />,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("exibe o botao X quando ha texto digitado", async () => {
    const user = userEvent.setup();

    render(
      <AdminSearch items={items} searchKeys={["name"]} onFilter={vi.fn()} />,
    );

    await user.type(screen.getByPlaceholderText("Buscar..."), "Nike");

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("limpa o input ao clicar no botao X", async () => {
    const user = userEvent.setup();

    render(
      <AdminSearch items={items} searchKeys={["name"]} onFilter={vi.fn()} />,
    );

    await user.type(screen.getByPlaceholderText("Buscar..."), "Nike");
    await user.click(screen.getByRole("button"));

    expect(screen.getByPlaceholderText("Buscar...")).toHaveValue("");
    expect(screen.getByText("3 de 3 resultados")).toBeInTheDocument();
  });
});

describe("AdminSearch — botao Novo", () => {
  it("renderiza o link com o href correto quando createHref e passado", () => {
    render(
      <AdminSearch
        items={items}
        searchKeys={["name"]}
        onFilter={vi.fn()}
        createLabel="Novo produto"
        createHref="/admin/produtos/novo"
      />,
    );

    expect(screen.getByRole("link", { name: /novo produto/i })).toHaveAttribute(
      "href",
      "/admin/produtos/novo",
    );
  });

  it("nao renderiza o botao quando createHref nao e passado", () => {
    render(
      <AdminSearch items={items} searchKeys={["name"]} onFilter={vi.fn()} />,
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});

describe("AdminSearch — URL search params", () => {
  it("preenche o input com o valor de ?q= ao montar", () => {
    vi.mocked(nextNavigation.useSearchParams).mockReturnValue(
      mockSearchParams("Nike"),
    );

    render(
      <AdminSearch items={items} searchKeys={["name"]} onFilter={vi.fn()} />,
    );

    expect(screen.getByPlaceholderText("Buscar...")).toHaveValue("Nike");
  });

  it("chama onFilter com os itens filtrados ao montar com ?q= na URL", () => {
    vi.mocked(nextNavigation.useSearchParams).mockReturnValue(
      mockSearchParams("Nike"),
    );

    const onFilter = vi.fn();

    render(
      <AdminSearch items={items} searchKeys={["name"]} onFilter={onFilter} />,
    );

    expect(onFilter).toHaveBeenCalledWith([items[0]]);
  });

  it("atualiza a URL com ?q= apos o debounce ao digitar", async () => {
    const replace = vi.fn();
    vi.mocked(nextNavigation.useRouter).mockReturnValue({
      ...mockRouter,
      replace,
    });

    render(
      <AdminSearch
        items={items}
        searchKeys={["name"]}
        onFilter={vi.fn()}
        debounceMs={0}
      />,
    );

    await userEvent.type(screen.getByPlaceholderText("Buscar..."), "Nike");

    expect(replace).toHaveBeenCalledWith(expect.stringContaining("q=Nike"));
  });

  it("remove ?q= da URL ao limpar o input com o botao X", async () => {
    const replace = vi.fn();
    vi.mocked(nextNavigation.useRouter).mockReturnValue({
      ...mockRouter,
      replace,
    });

    render(
      <AdminSearch
        items={items}
        searchKeys={["name"]}
        onFilter={vi.fn()}
        debounceMs={0}
      />,
    );

    await userEvent.type(screen.getByPlaceholderText("Buscar..."), "Nike");
    await userEvent.click(screen.getByRole("button"));

    expect(replace).toHaveBeenLastCalledWith(expect.not.stringContaining("q="));
  });
});
