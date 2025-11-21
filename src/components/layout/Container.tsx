import { ReactNode } from "react";
import { css } from "../../../styled-system/css";

export function Container({ children }: { children: ReactNode }) {
  return (
    <div className={css({ maxW: "1200px", m: "0 auto", p: 3, pt: {base: "5.5rem", sm: 24} })}>
      {children}
    </div>
  );
}
