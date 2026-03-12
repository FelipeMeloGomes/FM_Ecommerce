import { createClient } from "@sanity/client";
import slugify from "slugify";

const client = createClient({
  projectId: "8vdm88f4",
  dataset: "production",
  apiVersion: "2026-02-13",
  token:
    "skJW8Jp9j9TLbvc34yaScYEUQlpEDmN5bxzBrE5ix4hUGpZoEyUjRhz1rAvcpy5tT9a2IaZBeUVvIZ4w4i6mNnF2Z0wZUyHZQa49pSbMKLWNu2EfOI01EpvSQF8yc5k8Av4n9HwjpL3o6QruSvtniMLGd271vfdovGfjQ9sFYB3lJt78eSAy",
  useCdn: false,
});

const brandDescriptions: Record<string, string> = {
  Apple:
    "Apple é líder global em tecnologia, reconhecida por seus iPhones, iPads, MacBooks e serviços inovadores que combinam design sofisticado e desempenho avançado.",
  Samsung:
    "Samsung oferece uma ampla gama de produtos, desde smartphones e TVs até eletrodomésticos, sempre com inovação tecnológica e alta qualidade.",
  Sony: "Sony é referência em eletrônicos, câmeras, áudio e entretenimento, combinando tecnologia de ponta com design elegante.",
  LG: "LG produz eletrodomésticos, televisores e smartphones que unem inovação, praticidade e qualidade confiável para o dia a dia.",
  Xiaomi:
    "Xiaomi oferece smartphones, smartwatches e dispositivos inteligentes com excelente custo-benefício e tecnologia avançada.",
  Huawei:
    "Huawei desenvolve smartphones, tablets e wearables modernos, com desempenho confiável e câmeras de alta qualidade.",
  HP: "HP é referência em computadores, notebooks e impressoras, oferecendo soluções de alto desempenho para profissionais e consumidores.",
  Dell: "Dell fornece desktops, notebooks e acessórios de informática com confiabilidade, inovação e desempenho para todos os públicos.",
  Philips:
    "Philips é líder em eletrodomésticos e cuidados pessoais, com produtos que combinam tecnologia, design e eficiência energética.",
  Panasonic:
    "Panasonic oferece produtos eletrônicos e eletrodomésticos duráveis e confiáveis, com soluções inovadoras para casa e escritório.",
  Microsoft:
    "Microsoft é gigante de software e tecnologia, com produtos como Windows, Office, Surface e serviços de nuvem inovadores.",
  Asus: "Asus produz notebooks, desktops, placas de vídeo e periféricos de alta performance para gamers e profissionais de tecnologia.",
  Lenovo:
    "Lenovo desenvolve notebooks, desktops e tablets confiáveis, voltados para produtividade, entretenimento e uso pessoal.",
  Acer: "Acer oferece computadores e notebooks com excelente custo-benefício, voltados para estudantes, profissionais e gamers.",
  Intel:
    "Intel é líder mundial em processadores e soluções de computação, oferecendo tecnologia avançada para desktops, notebooks e servidores.",
  Corsair:
    "Corsair é referência em componentes e periféricos gamers, como memórias, fontes, gabinetes e teclados de alto desempenho.",
  Razer:
    "Razer oferece periféricos e laptops gamer de alta performance, combinando design arrojado e tecnologia inovadora.",
  Logitech:
    "Logitech fabrica periféricos, webcams, teclados e mouses com alta confiabilidade e inovação tecnológica.",
  Canon:
    "Canon é referência mundial em câmeras, lentes e impressoras, com produtos de qualidade profissional para fotografia e impressão.",
  Nikon:
    "Nikon desenvolve câmeras e lentes premium para fotógrafos profissionais e entusiastas, com qualidade de imagem excepcional.",
  GoPro:
    "GoPro é famosa por suas câmeras de ação resistentes e versáteis, perfeitas para aventuras e esportes radicais.",
  JBL: "JBL produz caixas de som e fones de ouvido com qualidade sonora superior e design moderno para todos os estilos de vida.",
  Bose: "Bose oferece áudio premium, incluindo fones de ouvido, caixas de som e sistemas de som para casa e profissionais.",
  Sennheiser:
    "Sennheiser é referência em áudio de alta fidelidade, com fones, microfones e sistemas de som profissionais.",
  Amazon:
    "Amazon é líder em e-commerce global, oferecendo uma ampla variedade de produtos e serviços digitais inovadores.",
  Google:
    "Google desenvolve soluções digitais, smartphones, serviços de nuvem e tecnologias inteligentes para usuários e empresas.",
  Motorola:
    "Motorola oferece smartphones confiáveis, com boa performance, câmeras de qualidade e design moderno.",
  OnePlus:
    "OnePlus produz smartphones potentes, rápidos e com design elegante, voltados para performance e experiência premium.",
  Oppo: "Oppo desenvolve smartphones inovadores, com câmeras avançadas e recursos tecnológicos modernos.",
  Vivo: "Vivo fabrica smartphones com bom desempenho, design moderno e tecnologias acessíveis para o dia a dia.",
  Realme:
    "Realme oferece smartphones e gadgets com ótima relação custo-benefício e recursos avançados para jovens e profissionais.",
  Alcatel:
    "Alcatel produz smartphones simples e funcionais, com boa performance para uso básico e diário.",
  Multilaser:
    "Multilaser oferece eletrônicos, periféricos e gadgets acessíveis, com foco em inovação e preço justo.",
  "Positivo Tecnologia":
    "Positivo fabrica notebooks, desktops e tablets acessíveis, voltados para educação e uso doméstico.",
  Intelbras:
    "Intelbras desenvolve soluções de segurança, redes e comunicação confiáveis para residências e empresas.",
  Britânia:
    "Britânia fabrica eletrodomésticos práticos e duráveis, como ventiladores, liquidificadores e outros produtos domésticos.",
  Mondial:
    "Mondial oferece eletroportáteis e utilidades domésticas com qualidade, inovação e segurança para o dia a dia.",
  Cadence:
    "Cadence produz pequenos eletrodomésticos e utilidades para cozinha, com design moderno e funcionalidade prática.",
  Arno: "Arno é referência em eletrodomésticos de cozinha e ventiladores, combinando qualidade, durabilidade e praticidade.",
  "C3 Tech":
    "C3 Tech oferece acessórios eletrônicos, periféricos e gadgets modernos para tecnologia pessoal e profissional.",
  "DL Eletrônicos":
    "DL Eletrônicos fabrica fones, caixas de som e gadgets acessíveis, com bom desempenho e design moderno.",
  König:
    "König produz eletrônicos e periféricos de qualidade, voltados para informática, áudio e entretenimento.",
  Philco:
    "Philco desenvolve eletrodomésticos e produtos eletrônicos para facilitar a rotina doméstica com praticidade.",
  Eletrolux:
    "Eletrolux oferece eletrodomésticos duráveis e confiáveis, voltados para eficiência energética e conforto do lar.",
  Consul:
    "Consul produz eletrodomésticos de cozinha e lavanderia, com qualidade, inovação e praticidade.",
  Brastemp:
    "Brastemp é referência em geladeiras, fogões e eletrodomésticos premium para o dia a dia.",
  Fischer:
    "Fischer fabrica ventiladores e eletroportáteis, proporcionando conforto e bem-estar no lar.",
  Suggar:
    "Suggar oferece eletroportáteis e utensílios de cozinha com design moderno e funcionalidade prática.",
  Walita:
    "Walita fabrica eletrodomésticos e utensílios de cozinha de alta performance e durabilidade.",
  "G-Tech":
    "G-Tech oferece gadgets e eletrônicos inovadores, voltados para praticidade e conectividade.",
  Midea:
    "Midea produz eletrodomésticos e climatizadores modernos, com eficiência energética e design funcional.",
  Oster:
    "Oster fabrica eletroportáteis de qualidade, como liquidificadores, processadores e cafeteiras para o dia a dia.",
  "Black+Decker":
    "Black+Decker oferece ferramentas e eletrodomésticos duráveis e de alta performance para uso doméstico e profissional.",
  KitchenAid:
    "KitchenAid é referência em eletroportáteis premium, incluindo batedeiras, processadores e acessórios para cozinha.",
  "Sony Music":
    "Sony Music oferece produtos e serviços de entretenimento musical de alta qualidade e alcance global.",
  "Sony Pictures":
    "Sony Pictures é referência em produção e distribuição de conteúdo audiovisual, filmes e séries de sucesso.",
  "Canon Brasil":
    "Canon Brasil oferece câmeras, lentes e impressoras com qualidade profissional e suporte local.",
  "Samsung Brasil":
    "Samsung Brasil fornece smartphones, TVs e eletrodomésticos inovadores com garantia nacional.",
  "LG Brasil":
    "LG Brasil oferece eletrodomésticos, celulares e TVs de qualidade, com suporte local e assistência técnica.",
  "Apple Brasil":
    "Apple Brasil comercializa iPhones, iPads, MacBooks e serviços com suporte oficial no país.",
  "Xiaomi Brasil":
    "Xiaomi Brasil oferece smartphones, smartwatches e dispositivos inteligentes com suporte nacional.",
  "Huawei Brasil":
    "Huawei Brasil fornece smartphones e dispositivos modernos com assistência técnica local.",
  "Intelbras Brasil":
    "Intelbras Brasil fornece soluções de segurança, redes e comunicação confiáveis para empresas e residências.",
  "Positivo Brasil":
    "Positivo Brasil oferece notebooks, tablets e desktops acessíveis, ideais para estudo e trabalho.",
  "Multilaser Brasil":
    "Multilaser Brasil produz eletrônicos, periféricos e gadgets com tecnologia prática e preço justo.",
  "HP Brasil":
    "HP Brasil oferece notebooks, desktops e impressoras com suporte nacional e qualidade confiável.",
  "Dell Brasil":
    "Dell Brasil fornece computadores e acessórios de alta performance com suporte local.",
  "Philips Brasil":
    "Philips Brasil oferece eletrodomésticos, cuidados pessoais e iluminação de alta qualidade.",
  "Panasonic Brasil":
    "Panasonic Brasil produz eletrônicos e eletrodomésticos duráveis com suporte nacional.",
  "Lenovo Brasil":
    "Lenovo Brasil oferece notebooks, desktops e tablets confiáveis para uso pessoal e profissional.",
  "Acer Brasil":
    "Acer Brasil produz computadores e notebooks com bom custo-benefício e suporte local.",
  "Asus Brasil":
    "Asus Brasil oferece notebooks, desktops e placas de vídeo com garantia nacional.",
  "Razer Brasil":
    "Razer Brasil fornece periféricos gamer de alta performance e notebooks premium para jogos.",
  "Logitech Brasil":
    "Logitech Brasil oferece periféricos, teclados, mouses e webcams com suporte nacional.",
  "Corsair Brasil":
    "Corsair Brasil fornece componentes e periféricos gamers de qualidade e durabilidade.",
  "Bose Brasil":
    "Bose Brasil oferece sistemas de áudio premium, fones de ouvido e caixas de som com suporte local.",
  "JBL Brasil":
    "JBL Brasil fornece caixas de som e fones de ouvido com qualidade sonora superior e garantia nacional.",
  "GoPro Brasil":
    "GoPro Brasil oferece câmeras de ação resistentes e inovadoras com suporte local.",
  "Motorola Brasil":
    "Motorola Brasil fornece smartphones confiáveis com design moderno e suporte nacional.",
  "OnePlus Brasil":
    "OnePlus Brasil oferece smartphones de alta performance com suporte local.",
  "Oppo Brasil":
    "Oppo Brasil produz smartphones inovadores com garantia nacional.",
  "Vivo Brasil":
    "Vivo Brasil oferece smartphones confiáveis e conectividade de qualidade com suporte local.",
  "Realme Brasil":
    "Realme Brasil fornece smartphones e gadgets com excelente custo-benefício e garantia nacional.",
  "Alcatel Brasil":
    "Alcatel Brasil oferece celulares simples, funcionais e acessíveis para uso diário.",
  "Arno Brasil":
    "Arno Brasil fabrica eletrodomésticos confiáveis e duráveis, voltados para o dia a dia.",
  "Mondial Brasil":
    "Mondial Brasil produz eletroportáteis e ventiladores com qualidade e inovação.",
  "Cadence Brasil":
    "Cadence Brasil oferece pequenos eletrodomésticos práticos, modernos e funcionais.",
  "DL Eletrônicos Brasil":
    "DL Eletrônicos Brasil fornece gadgets, fones e caixas de som com design acessível.",
  "König Brasil":
    "König Brasil produz eletrônicos e periféricos confiáveis com suporte local.",
  "Britânia Brasil":
    "Britânia Brasil fabrica eletrodomésticos práticos e duráveis para o dia a dia.",
  "Multilaser Pro":
    "Multilaser Pro oferece produtos tecnológicos premium com inovação e design moderno.",
  "Philco Tech":
    "Philco Tech produz eletrodomésticos e eletrônicos voltados para conforto e praticidade.",
  "G-Tech Brasil":
    "G-Tech Brasil fornece gadgets e eletrônicos inovadores para casa e escritório.",
};

async function updateDescriptions() {
  for (const title of Object.keys(brandDescriptions)) {
    const slug = slugify(title, { lower: true, strict: true });

    const brand = await client.fetch(
      `*[_type == "brand" && slug.current == $slug][0]`,
      { slug },
    );

    if (brand) {
      if (!brand.description) {
        await client
          .patch(brand._id)
          .set({ description: brandDescriptions[title] })
          .commit();
        console.log(`Descrição adicionada para: ${title}`);
      } else {
        console.log(`Descrição já existe para: ${title}`);
      }
    } else {
      console.log(`Marca não encontrada: ${title}`);
    }
  }

  console.log("Atualização de descrições concluída!");
}

updateDescriptions().catch(console.error);
