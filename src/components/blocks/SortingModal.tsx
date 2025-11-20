"use client";

// Components
import { Dropdown, Switch } from "../design";

// Contexts
import { useGamesContext } from "@/context";

// Add-ons
import Skeleton from "react-loading-skeleton";

// Styles
import { css } from "../../../styled-system/css";

// Icons
import { HiViewList } from "react-icons/hi";
import { MdViewList } from "react-icons/md";
import { TfiLayoutGrid3Alt } from "react-icons/tfi";

const sortingOptions = ["popularity", "release date", "rating", "alphabet"];

interface SortingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SortingModal({ isOpen, onClose }: SortingModalProps) {
  const {
    view,
    toggleView,
    hintsEnabled,
    showDlcs,
    toggleDlcs,
    toggleHints,
    sorting,
    handleSorting,
    isSortingLoading,
  } = useGamesContext();

  return (
    <div
      className={`modal ${css({
        position: { base: "fixed", md: "relative" },
        top: 0,
        right: 0,
        display: {
          base: isOpen ? "flex" : "none",
          md: !isSortingLoading ? "inline-flex" : "block",
        },
        flexDirection: { base: "column", md: "row" },
        alignItems: { base: "end", md: "center" },
        h: { base: "100dvh", md: 10 },
        pr: { base: 4, md: 2 },
        pl: { base: 4, md: 0 },
        pt: { base: "80px", md: 0 },
        pb: 3,
        float: "right",
        bgColor: { md: "inherit" },
        gap: { base: 8, lg: 12, xl: 16 },
        zIndex: { base: 998, md: "unset" },
        animation: "fade-in 0.3s",
      })}`}
    >
      {!isSortingLoading ? (
        <>
          <Dropdown
            value={sorting}
            label="Sort by:"
            options={sortingOptions}
            onSelect={(option) => {
              handleSorting(sortingOptions.indexOf(option));
            }}
          />
          <Switch
            checked={showDlcs}
            onChange={() => {
              toggleDlcs();
            }}
            label={"Show DLC"}
          />
          <div
            className={css({
              "@media (hover: none)": {
                display: "none",
              },
            })}
          >
            <Switch
              checked={hintsEnabled}
              onChange={() => {
                toggleHints();
              }}
              label={"Hints on hover"}
            />
          </div>
          <div
            className={css({
              display: "flex",
              ml: "auto",
              alignItems: "center",
              gap: { base: 2, xl: 3 },
            })}
          >
            <TfiLayoutGrid3Alt
              className={css({
                fontSize: 20,
                opacity: 0.8,
                color: view === "grid" ? "var(--colors-primary)" : "",
                cursor: "pointer",
              })}
              onClick={() => toggleView("grid")}
            />
            <MdViewList
              className={css({
                fontSize: 29,
                opacity: 0.8,
                color: view === "list" ? "var(--colors-primary)" : "",
                cursor: "pointer",
              })}
              onClick={() => toggleView("list")}
            />
            <HiViewList
              className={css({
                fontSize: 25,
                opacity: 0.8,
                color: view === "list-min" ? "var(--colors-primary)" : "",
                cursor: "pointer",
              })}
              onClick={() => toggleView("list-min")}
            />
          </div>
        </>
      ) : (
        <Skeleton
          className={css({ h: 6, w: "full", verticalAlign: "middle" })}
        />
      )}
    </div>
  );
}
