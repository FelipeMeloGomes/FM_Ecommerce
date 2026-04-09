"use client";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import type { ErrorInfo, ReactNode } from "react";
// biome-ignore lint/correctness/noUnusedImports: React used in JSX
import React, { Component } from "react";
import { Button } from "./ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-card border border-border rounded-xl p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">
                Algo deu errado
              </h2>
              <p className="text-sm text-muted-foreground">
                Não se preocupe, nossos técnicos já foram notificados.
              </p>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="text-left bg-muted p-3 rounded-lg text-xs overflow-auto max-h-32">
                <summary className="font-medium cursor-pointer mb-1">
                  Detalhes do erro
                </summary>
                <pre className="whitespace-pre-wrap break-all">
                  {this.state.error.message}
                  {"\n\n"}
                  {this.state.error.stack?.split("\n").slice(0, 5).join("\n")}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={this.handleRetry}
                variant="default"
                className="flex-1 bg-shop_dark_green hover:bg-shop_btn_dark_green"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar novamente
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Página inicial
                </Link>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface AsyncErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface AsyncErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class AsyncErrorBoundary extends Component<
  AsyncErrorBoundaryProps,
  AsyncErrorBoundaryState
> {
  constructor(props: AsyncErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): AsyncErrorBoundaryState {
    return { hasError: true, error };
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-card border border-border rounded-xl p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">
                Erro ao carregar conteúdo
              </h2>
              <p className="text-sm text-muted-foreground">
                Houve um problema ao buscar os dados. Por favor, tente
                novamente.
              </p>
            </div>

            <Button
              onClick={this.handleRetry}
              className="w-full bg-shop_dark_green hover:bg-shop_btn_dark_green"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Recarregar página
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface SectionErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

export function SectionErrorBoundary({
  children,
  fallback,
  className,
}: SectionErrorBoundaryProps): ReactNode {
  return (
    <ErrorBoundary
      fallback={
        fallback ?? (
          <div
            className={`p-4 bg-muted/50 rounded-lg text-center ${className ?? ""}`}
          >
            <p className="text-sm text-muted-foreground">
              Esta seção não pôde ser carregada.
            </p>
          </div>
        )
      }
    >
      {children}
    </ErrorBoundary>
  );
}
