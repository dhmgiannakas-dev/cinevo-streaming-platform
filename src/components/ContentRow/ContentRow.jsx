import { useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MovieCard from "../MovieCard/MovieCard";
import SeriesCard from "../SeriesCard/SeriesCard";
import "./ContentRow.css";

function ContentRow({ title, items, type }) {
  const rowRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function checkScroll() {
    const row = rowRef.current;

    if (!row) return;

    setCanScrollLeft(row.scrollLeft > 0);

    setCanScrollRight(
      row.scrollLeft + row.clientWidth < row.scrollWidth - 1
    );
  }

  function scrollLeft() {
    const row = rowRef.current;

    if (!row) return;

    row.scrollBy({
      left: -row.clientWidth * 0.8,
      behavior: "smooth",
    });
  }

  function scrollRight() {
    const row = rowRef.current;

    if (!row) return;

    row.scrollBy({
      left: row.clientWidth * 0.8,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    checkScroll();

    window.addEventListener("resize", checkScroll);

    return () => {
      window.removeEventListener("resize", checkScroll);
    };
  }, [items]);

  return (
    <section className="content-row">
      <h2>{title}</h2>

      <div className="content-row-wrapper">

        {/* =========================
            LEFT ARROW
        ========================= */}

        {canScrollLeft && (
          <IconButton
            className="content-row-arrow content-row-arrow-left"
            onClick={scrollLeft}
            aria-label={`Scroll ${title} left`}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        )}

        {/* =========================
            CONTENT
        ========================= */}

        <div
          className="content-row-items"
          ref={rowRef}
          onScroll={checkScroll}
        >
          {items.map((item) =>
            type === "movie" ? (
              <MovieCard
                key={item.id}
                movie={item}
              />
            ) : (
              <SeriesCard
                key={item.id}
                tv={item}
              />
            )
          )}
        </div>

        {/* =========================
            RIGHT ARROW
        ========================= */}

        {canScrollRight && (
          <IconButton
            className="content-row-arrow content-row-arrow-right"
            onClick={scrollRight}
            aria-label={`Scroll ${title} right`}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        )}
      </div>
    </section>
  );
}

export default ContentRow;