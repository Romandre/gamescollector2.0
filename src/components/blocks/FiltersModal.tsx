"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

// Components
import { SectionTitle, Button, Select } from "../design";
import Skeleton from "react-loading-skeleton";

// Hooks
import { useQuery } from "@tanstack/react-query";

// Context
import { useGamesContext } from "@/context";

// Utils
import { getYearsArray } from "@/utils/yearsArray";
import { convertToPlural, getYearTimestamps } from "@/utils/filtersFormatter";

// Types
import { FilterOptions, FilterTypes } from "@/types";

// Styles
import { css } from "../../../styled-system/css";

// Icons
import { RxCrossCircled } from "react-icons/rx";

const fetchFilterOptions = async (type: FilterTypes, input: string) => {
  const pluralizedType = convertToPlural(type);
  const filterCondition = input ? `& name ~ *"${input}"*` : "";
  const queryCondition = `where name !~ *"archive"* ${filterCondition};`;
  const query = `query ${pluralizedType} "Options" { fields id, name; ${queryCondition} limit 500; };`;
  const response = await axios.get("/api/filters", { params: { query } });
  return response.data;
};

const allYears = getYearsArray();

const filterHeight = 50;

const Filter = ({
  type,
  options,
}: {
  type: FilterTypes;
  options?: string[];
}) => {
  const isYear = type === "year";
  const [availableOptions, setAvailableOptions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const { handleFilter, filterInputs, setFilterInputs, isSortingLoading } =
    useGamesContext();
  const filterRef = useRef(null);
  const contextFilterValue = filterInputs[type];
  const filterId = `${type}-filter`;

  const { data, isLoading /* isError, error */ } = useQuery({
    queryKey: ["game", filterId, inputValue],
    queryFn: () => fetchFilterOptions(type, inputValue),
    enabled: !options,
  });

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (options) {
      const filteredOptions = options.filter((option) =>
        option.includes(value)
      );

      if (!value.trim()) setIsOpen(false);

      if (value && filteredOptions.length) {
        setAvailableOptions(filteredOptions);
        setIsOpen(true);
      } else {
        setAvailableOptions(options);
        setIsOpen(false);
      }
    }
  };

  const applyFilter = (value: string) => {
    setFilterInputs({ ...filterInputs, [type]: value });
    setIsOpen(false);

    let gamesFilter = "";
    if (value) {
      if (isYear) {
        const timestamps = getYearTimestamps(value);
        gamesFilter = `first_release_date > ${timestamps.startOfYear} & first_release_date < ${timestamps.endOfYear}`;
      } else {
        const isCompany = type === "company";
        const pluralizedType = isCompany
          ? "involved_companies.company"
          : convertToPlural(type);
        gamesFilter = `${pluralizedType} = (${data.find((item: FilterOptions) => item.name === value).id})`;
      }
    }

    handleFilter(type, gamesFilter);
  };

  useEffect(() => {
    if (options) setAvailableOptions(options);
    if (data) {
      setAvailableOptions(data.map((filter: FilterOptions) => filter.name));
    }
  }, [options, data]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // @ts-expect-error contains can't be used for 'never'
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setInputValue(contextFilterValue);
  }, [contextFilterValue]);

  return (
    <div
      id={filterId}
      ref={filterRef}
      className={css({ w: "full", h: "full" })}
    >
      {isSortingLoading ? (
        <Skeleton height={filterHeight} />
      ) : (
        <Select
          options={availableOptions}
          inputValue={inputValue || contextFilterValue}
          inputLabel={type}
          inputHeight={filterHeight}
          onInputChange={handleInputChange}
          onOptionClick={applyFilter}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isLoading={isLoading}
          isSorted={isYear}
        />
      )}
    </div>
  );
};

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FiltersModal({ isOpen, onClose }: FiltersModalProps) {
  const { isSortingLoading, filterInputs, resetFilters } = useGamesContext();
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div
      className={`modal ${css({
        position: { base: "fixed", lg: "absolute" },
        display: isOpen ? "block" : "none",
        w: { base: "70%", lg: "400px" },
        maxW: "400px",
        h: { base: "100dvh", lg: "auto" },
        top: { base: 0, lg: 8 },
        left: { base: 0, lg: -1 },
        py: { base: "72px", lg: 4 },
        pl: { base: 4, lg: 4 },
        px: 4,
        boxShadow: { lg: "4px 6px 6px rgba(0, 0, 0, 0.8)" },
        borderRadius: { lg: "8px" },
        animation: "fade-in 0.3s",
        zIndex: 998,
      })}`}
      ref={modalRef}
    >
      <div className={css({ display: "block" })}>
        {isSortingLoading ? (
          <Skeleton width={100} height={30} className={css({ mt: 1 })} />
        ) : (
          <SectionTitle>Filters</SectionTitle>
        )}
      </div>

      <div
        className={css({
          display: "flex",
          gap: 8,
          py: 5,
          alignItems: "start",
          flexDirection: "column",
        })}
      >
        <Filter type="year" options={allYears} />
        <Filter type="genre" />
        <Filter type="platform" />
        <Filter type="company" />
        <Button onClick={onClose}>Show games</Button>
        {!!Object.values(filterInputs).some((item) => !!item) && (
          <span
            className={css({
              display: "flex",
              alignItems: "center",
              color: "var(--colors-primary)",
              cursor: "pointer",
            })}
            onClick={resetFilters}
          >
            <RxCrossCircled className={css({ mr: 2, fontSize: 24 })} /> Clear
            all filters
          </span>
        )}
      </div>
    </div>
  );
}
