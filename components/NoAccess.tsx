import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Logo from "./Logo";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const NoAccess = ({
  details = "Faça login para visualizar os itens do seu carrinho e finalizar a compra.",
}: {
  details?: string;
}) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md border-border/60">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold">
            Bem-vindo de volta!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">{details}</p>
          <SignInButton mode="modal">
            <Button
              className="w-full bg-shop_dark_green hover:bg-shop_btn_dark_green"
              size="lg"
            >
              Entrar
            </Button>
          </SignInButton>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <div className="text-sm text-muted-foreground text-center">
            Não tem uma conta?
          </div>
          <SignUpButton mode="modal">
            <Button variant="outline" className="w-full" size="lg">
              Criar conta
            </Button>
          </SignUpButton>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NoAccess;
