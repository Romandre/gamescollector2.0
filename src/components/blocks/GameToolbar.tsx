"use client";
import { useState } from "react";

// Components
import { Overlay } from "../design";
import { FiltersModal } from "./FiltersModal";
import { SortingModal } from "./SortingModal";
import Skeleton from "react-loading-skeleton";

// Context
import { useGamesContext } from "@/context";

// Styles
import { css } from "../../../styled-system/css";

// Icons
import { IoFilter } from "react-icons/io5";
import { IoOptions } from "react-icons/io5";

export function GameToolbar() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSortingOpen, setIsSortingOpen] = useState(false);
  const { isSortingLoading, filterInputs } = useGamesContext();
  const activeFiltersNum = Object.values(filterInputs).filter(
    (value) => value !== ""
  ).length;

  return (
    <div className={css({ position: "relative" })}>
      <Overlay
        isOpen={isSortingOpen}
        //isOpen={isFiltersOpen || isSortingOpen}
        setIsOpen={(open) => {
          if (!open) {
            setIsFiltersOpen(false);
            setIsSortingOpen(false);
          }
        }}
      />

      <FiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />

      <SortingModal
        isOpen={isSortingOpen}
        onClose={() => setIsSortingOpen(false)}
      />

      {/* Filters Button */}
      <div
        className={css({
          float: "left",
          mt: { base: 0, md: "3px" },
        })}
      >
        {isSortingLoading ? (
          <Skeleton width={50} className={css({ ml: { base: 0, md: 2 } })} />
        ) : (
          <div
            className={css({ position: "relative", cursor: "pointer" })}
            onClick={() => setIsFiltersOpen(true)}
          >
            <IoFilter
              className={css({
                mx: 1,
                fontSize: 26,
              })}
            />
            {!!activeFiltersNum && (
              <span
                className={css({
                  position: "absolute",
                  display: "flex",
                  top: 0,
                  right: 0,
                  w: 4,
                  h: 4,
                  fontSize: 10,
                  color: "#FFFFFF",
                  justifyContent: "center",
                  bg: "{colors.primary}",
                  borderRadius: "10px",
                  userSelect: "none",
                })}
              >
                {activeFiltersNum}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Sorting Bar */}
      <div
        className={css({
          display: { base: "block", md: "none" },
          float: "right",
          mb: 2,
        })}
      >
        {isSortingLoading ? (
          <Skeleton width={50} />
        ) : (
          <IoOptions
            className={css({
              mx: 2,
              fontSize: 28,
              cursor: "pointer",
            })}
            onClick={() => setIsSortingOpen(true)}
          />
        )}
      </div>
    </div>
  );
}
