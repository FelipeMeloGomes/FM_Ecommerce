"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Heart } from "lucide-react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GuestWishlistPromptProps {
  productCount?: number;
}

export function GuestWishlistPrompt({
  productCount = 0,
}: GuestWishlistPromptProps) {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
        <div className="w-full max-w-md">
          <Card className="border-border/60">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 p-4 rounded-full bg-shop_dark_green/10">
                <Heart className="w-12 h-12 text-shop_dark_green" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Sua lista de favoritos
              </CardTitle>
              <CardDescription className="pt-2">
                {productCount > 0
                  ? "Você tem itens salvos localmente. Faça login para sincronizar com sua conta."
                  : "Salve seus produtos favoritos para não perder de vista!"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <SignInButton mode="modal">
                <Button
                  className="w-full bg-shop_dark_green hover:bg-shop_btn_dark_green"
                  size="lg"
                >
                  Entrar
                </Button>
              </SignInButton>
              <div className="text-sm text-center text-muted-foreground">
                Não tem uma conta?
              </div>
              <SignUpButton mode="modal">
                <Button variant="outline" className="w-full" size="lg">
                  Criar Conta
                </Button>
              </SignUpButton>
              {productCount > 0 && (
                <p className="text-xs text-center text-muted-foreground pt-2">
                  Seus {productCount} item(s) favorito(s) estão salvos
                  localmente e serão migrados para sua conta ao fazer login.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
