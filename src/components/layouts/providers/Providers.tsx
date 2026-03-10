import { ThemeProvider } from "./ThemeProvider";

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};
