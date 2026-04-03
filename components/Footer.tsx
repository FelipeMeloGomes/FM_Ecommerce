import Container from "./Container";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <Container>
        <div className="py-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Logo className="text-lg" />
              <span className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Todos os direitos reservados.
              </span>
            </div>
            <SocialMedia />
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
