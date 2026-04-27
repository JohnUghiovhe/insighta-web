import Link from "next/link";

type PaginationProps = {
  pathname: string;
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
};

const buildHref = (pathname: string, searchParams: Record<string, string | undefined>, page: number) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value && key !== "page") {
      params.set(key, value);
    }
  }
  params.set("page", String(page));
  return `${pathname}?${params.toString()}`;
};

export function Pagination({ pathname, currentPage, totalPages, searchParams }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <span className="pagination-status">
        Page {currentPage} of {totalPages}
      </span>
      <div className="pagination-actions">
        <Link aria-disabled={currentPage <= 1} className="button button-ghost" href={buildHref(pathname, searchParams, Math.max(1, currentPage - 1))}>
          Previous
        </Link>
        <Link aria-disabled={currentPage >= totalPages} className="button" href={buildHref(pathname, searchParams, Math.min(totalPages, currentPage + 1))}>
          Next
        </Link>
      </div>
    </div>
  );
}