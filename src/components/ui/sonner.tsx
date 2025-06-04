import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      duration={5000}
      closeButton
      style={
        {
          "--normal-bg": "rgba(30, 41, 59, 0.95)", // Dark blue-gray with transparency
          "--normal-text": "rgb(219, 234, 254)", // text-blue-100
          "--normal-border": "rgba(147, 197, 253, 0.3)", // blue-300 with transparency
          "--success-bg": "rgba(34, 197, 94, 0.2)", // green success with transparency
          "--success-text": "rgb(187, 247, 208)", // text-green-200
          "--success-border": "rgba(34, 197, 94, 0.4)", // green border
          "--error-bg": "rgba(239, 68, 68, 0.2)", // red error with transparency
          "--error-text": "rgb(254, 202, 202)", // text-red-200
          "--error-border": "rgba(239, 68, 68, 0.4)", // red border
          "--info-bg": "rgba(59, 130, 246, 0.2)", // blue info with transparency
          "--info-text": "rgb(191, 219, 254)", // text-blue-200
          "--info-border": "rgba(59, 130, 246, 0.4)", // blue border
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          background: "var(--normal-bg)",
          color: "var(--normal-text)",
          border: "1px solid var(--normal-border)",
          backdropFilter: "blur(8px)",
          borderRadius: "12px",
        },
        classNames: {
          success: "bg-green-500/20 text-green-200 border-green-500/40",
          error: "bg-red-500/20 text-red-200 border-red-500/40",
          info: "bg-blue-500/20 text-blue-200 border-blue-500/40",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
