import Container from "./Container";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <Container>
        <div className="py-6 border-t text-center text-sm text-gray-600">
          <div>
            © {new Date().getFullYear()} <Logo className="text-sm" />. Todos os
            direitos reservados.
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
