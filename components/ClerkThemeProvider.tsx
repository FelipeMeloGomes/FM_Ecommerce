"use client";

import { ptBR } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const baseAppearance = {
  variables: {
    borderRadius: "10px",
    fontFamily: "Poppins, sans-serif",
  },
};

const lightAppearance = {
  ...baseAppearance,
  variables: {
    ...baseAppearance.variables,
    colorPrimary: "#063c28",
    colorTextOnPrimaryBackground: "#ffffff",
    colorBackground: "#ffffff",
    colorInputBackground: "#ffffff",
    colorInputText: "#151515",
    colorText: "#151515",
    colorTextSecondary: "#52525b",
    colorDanger: "#dc2626",
    colorSuccess: "#16a34a",
    colorWarning: "#f59e0b",
  },
  elements: {
    rootBox: {
      boxShadow: "0 8px 32px rgba(6, 60, 40, 0.12)",
    },
    card: {
      border: "1px solid #e5e5e5",
      boxShadow: "0 8px 32px rgba(6, 60, 40, 0.08)",
      borderRadius: "16px",
    },
    header: {
      padding: "24px 24px 0",
    },
    headerTitle: {
      color: "#151515",
      fontWeight: "700",
      fontSize: "24px",
    },
    headerSubtitle: {
      color: "#52525b",
      fontSize: "14px",
    },
    socialButtonsBlockButton: {
      border: "1px solid #e5e5e5",
      borderRadius: "8px",
      backgroundColor: "#ffffff",
      "&:hover": {
        backgroundColor: "#f6f6f6",
      },
    },
    formFieldLabel: {
      color: "#151515",
      fontWeight: "500",
    },
    formFieldInput: {
      border: "1px solid #e5e5e5",
      borderRadius: "8px",
      "&:focus": {
        borderColor: "#063c28",
        boxShadow: "0 0 0 3px rgba(6, 60, 40, 0.1)",
      },
    },
    formButtonPrimary: {
      borderRadius: "8px",
      backgroundColor: "#063c28",
      fontWeight: "600",
      "&:hover": {
        backgroundColor: "#052f20",
      },
    },
    formButtonSecondary: {
      borderRadius: "8px",
      border: "1px solid #e5e5e5",
      backgroundColor: "#ffffff",
      "&:hover": {
        backgroundColor: "#f6f6f6",
      },
    },
    footerActionLink: {
      color: "#063c28",
      fontWeight: "500",
      "&:hover": {
        color: "#052f20",
      },
    },
    dividerLine: {
      backgroundColor: "#e5e5e5",
    },
    dividerText: {
      color: "#52525b",
    },
    formFieldInputShowPasswordButton: {
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
    avatarImageUploader: {
      border: "2px dashed #e5e5e5",
    },
    fileDropAreaActionButton: {
      borderRadius: "8px",
    },
    fileDropAreaButton: {
      borderRadius: "8px",
    },
    identityPreviewEditButton: {
      borderRadius: "8px",
    },
    paginationButton: {
      borderRadius: "8px",
    },
    paginationStartButton: {
      borderRadius: "8px",
    },
    paginationPrevButton: {
      borderRadius: "8px",
    },
    paginationNextButton: {
      borderRadius: "8px",
    },
    paginationEndButton: {
      borderRadius: "8px",
    },
  },
};

const darkAppearance = {
  ...baseAppearance,
  variables: {
    ...baseAppearance.variables,
    colorPrimary: "#22c55e",
    colorTextOnPrimaryBackground: "#09090b",
    colorBackground: "#18181b",
    colorInputBackground: "#27272a",
    colorInputText: "#fafafa",
    colorText: "#fafafa",
    colorTextSecondary: "#a1a1aa",
    colorDanger: "#ef4444",
    colorSuccess: "#22c55e",
    colorWarning: "#f59e0b",
  },
  elements: {
    rootBox: {
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
    },
    card: {
      border: "1px solid #27272a",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
      borderRadius: "16px",
      backgroundColor: "#18181b",
    },
    header: {
      padding: "24px 24px 0",
    },
    headerTitle: {
      color: "#fafafa !important",
      fontWeight: "700",
      fontSize: "24px",
    },
    headerSubtitle: {
      color: "#a1a1aa !important",
      fontSize: "14px",
    },
    socialButtonsBlockButton: {
      border: "1px solid #27272a",
      borderRadius: "8px",
      backgroundColor: "#18181b",
    },
    socialButtonsBlockButtonText: {
      color: "#fafafa !important",
    },
    formFieldLabel: {
      color: "#fafafa !important",
      fontWeight: "500",
    },
    formFieldInput: {
      border: "1px solid #27272a",
      borderRadius: "8px",
      backgroundColor: "#18181b",
      color: "#fafafa !important",
    },
    formFieldInputShowPasswordButton: {
      color: "#a1a1aa !important",
    },
    formButtonPrimary: {
      borderRadius: "8px",
      backgroundColor: "#22c55e",
      color: "#09090b !important",
      fontWeight: "600",
    },
    formButtonSecondary: {
      borderRadius: "8px",
      border: "1px solid #27272a",
      backgroundColor: "#18181b",
      color: "#fafafa !important",
    },
    footerActionLink: {
      color: "#22c55e !important",
      fontWeight: "500",
    },
    footerActionText: {
      color: "#a1a1aa !important",
    },
    dividerLine: {
      backgroundColor: "#27272a",
    },
    dividerText: {
      color: "#a1a1aa !important",
    },
    formFieldWarningText: {
      color: "#f59e0b !important",
    },
    formFieldErrorText: {
      color: "#ef4444 !important",
    },
    identityPreviewText: {
      color: "#fafafa !important",
    },
    identityPreviewEditButton: {
      color: "#22c55e !important",
    },
    formFieldText: {
      color: "#fafafa !important",
    },
    otpCodeFieldInput: {
      border: "1px solid #27272a",
      backgroundColor: "#18181b",
      color: "#fafafa !important",
    },
    profileSection: {
      borderBottom: "1px solid #27272a",
    },
    userButtonPopover: {
      border: "1px solid #27272a",
      borderRadius: "12px",
    },
    dropdownMenu: {
      border: "1px solid #27272a",
      borderRadius: "12px",
    },
    formFieldSuccessText: {
      color: "#22c55e !important",
    },
    userButtonPopoverFooter: {
      borderTop: "1px solid #27272a",
    },
    userButtonPopoverHeader: {
      borderBottom: "1px solid #27272a",
    },
    userButtonPopoverActionButton: {
      color: "#fafafa !important",
    },
    userButtonPopoverActionButtonText: {
      color: "#fafafa !important",
    },
    userButtonPopoverActionButtonTextPrimary: {
      color: "#fafafa !important",
    },
    userButtonPopoverLabel: {
      color: "#a1a1aa !important",
    },
    userButtonPopoverLabelText: {
      color: "#a1a1aa !important",
    },
    userButtonMenuItem: {
      color: "#fafafa !important",
    },
    userButtonMenuItemText: {
      color: "#fafafa !important",
    },
    userProfilePage: {
      backgroundColor: "#18181b",
    },
    userProfilePageTitle: {
      color: "#fafafa !important",
    },
    userProfilePageHeaderTitle: {
      color: "#fafafa !important",
    },
    userProfilePageHeaderSubtitle: {
      color: "#a1a1aa !important",
    },
    userProfileSectionTitle: {
      color: "#fafafa !important",
    },
    userProfileSectionTitleText: {
      color: "#fafafa !important",
    },
    userProfileSectionSubtitle: {
      color: "#a1a1aa !important",
    },
    userProfileSectionSubtitleText: {
      color: "#a1a1aa !important",
    },
    userButton: {
      color: "#fafafa !important",
    },
    userButtonIcon: {
      color: "#fafafa !important",
    },
  },
};

export function ClerkThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const appearance =
    mounted && theme === "dark" ? darkAppearance : lightAppearance;

  return (
    <ClerkProvider localization={ptBR} appearance={appearance}>
      {children}
    </ClerkProvider>
  );
}
