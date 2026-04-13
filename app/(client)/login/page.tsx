"use client";

import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chrome, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import { PasswordInput } from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type LoginInput, loginSchema } from "@/lib/schemas/authSchema";

function LoginPage() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = useCallback(
    async (data: LoginInput) => {
      if (!isLoaded) return;

      setIsSubmitting(true);
      setError("");

      try {
        const result = await signIn.create({
          identifier: data.email,
          password: data.password,
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          router.push("/");
          router.refresh();
        } else {
          setError("Verifique seu email para continuar");
        }
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Email ou senha incorretos",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [isLoaded, signIn, setActive, router],
  );

  const handleGoogleLogin = useCallback(async () => {
    if (!isLoaded) return;

    setIsSubmitting(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/",
        redirectUrlComplete: "/",
      });
    } catch {
      setError("Erro ao fazer login com Google");
      setIsSubmitting(false);
    }
  }, [isLoaded, signIn]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-shop_dark_green" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-card rounded-xl border border-border shadow-sm p-6 md:p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground">
                Bem-vindo de volta!
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Entre com sua conta para continuar
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Continuar com Google
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : undefined}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Senha
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-shop_dark_green hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : undefined}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {error && (
                <p className="text-sm text-destructive text-center bg-destructive/10 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-shop_btn_dark_green hover:bg-shop_btn_dark_green hoverEffect"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Não tem uma conta?{" "}
              <Link
                href="/register"
                className="text-shop_dark_green font-medium hover:underline"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(LoginPage);
