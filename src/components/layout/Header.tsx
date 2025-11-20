// Components
import { supabaseClient } from "@/utils/supabase/server";
import { SearchInput } from "../design";
import { HeaderActions } from "../blocks";
import Link from "next/link";
import Image from "next/image";

// Styles
import { css } from "../../../styled-system/css";

export async function Header() {
  const supabase = await supabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div
      className={css({
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        w: "100%",
        zIndex: 2,
      })}
    >
      <div
        className={`header
        ${css({
          display: "flex",
          maxW: "800px",
          w: "auto",
          h: "65px",
          mx: { base: 2, md: 0 },
          my: 3,
          px: { base: 4, sm: 2, md: 0 },
          justifyContent: "center",
          alignItems: "center",
          overflow: "visible",
          border: "1px solid rgba(62, 56, 94, 0.8)",
          borderRadius: "8px",
        })}`}
      >
        <div
          className={css({
            display: "flex",
            justifyContent: "center",
            flexBasis: { base: "96px", sm: "140px" },
            flexShrink: 0,
          })}
        >
          <Link
            href="/"
            className={css({
              position: "relative",
              display: "block",
              h: "full",
            })}
          >
            <Image
              src="/logo.png"
              alt="logo"
              width={0}
              height={0}
              blurDataURL="/logo.png"
              style={{ width: "76px", height: "44px" }}
              priority
            />
          </Link>
        </div>
        <SearchInput
          className={css({
            h: "100%",
            w: "100%",
            px: 10,
          })}
        />
        <HeaderActions user={user} />
      </div>
    </div>
  );
}
