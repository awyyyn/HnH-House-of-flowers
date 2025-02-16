import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
	currentPage: number;
	totalItems: number;
	pageSize: number;
	onPageChange: (page: number) => void;
}

export default function PaginationControls({
	currentPage,
	totalItems,
	pageSize,
	onPageChange,
}: PaginationControlsProps) {
	const totalPages = Math.ceil(totalItems / pageSize);

	const generatePagination = () => {
		const siblings = 1; // Show 1 sibling on each side
		const pages = [];

		// Always show first page
		pages.push(1);

		if (currentPage > 3) {
			pages.push("leftEllipsis");
		}

		// Calculate range around current page
		const rangeStart = Math.max(2, currentPage - siblings);
		const rangeEnd = Math.min(totalPages - 1, currentPage + siblings);

		for (let i = rangeStart; i <= rangeEnd; i++) {
			pages.push(i);
		}

		if (currentPage < totalPages - 2) {
			pages.push("rightEllipsis");
		}

		// Always show last page
		if (totalPages > 1) {
			pages.push(totalPages);
		}

		return pages;
	};

	const paginationRange = generatePagination();

	if (currentPage === 0 || paginationRange.length < 2) {
		return null;
	}

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						onClick={(e) => {
							e.preventDefault();
							if (currentPage > 1) onPageChange(currentPage - 1);
						}}
					/>
				</PaginationItem>
				{paginationRange.map((pageNumber, index) => {
					if (pageNumber === "leftEllipsis" || pageNumber === "rightEllipsis") {
						return <PaginationEllipsis key={`ellipsis-${index}`} />;
					}

					return (
						<PaginationItem key={pageNumber}>
							<PaginationLink
								onClick={(e) => {
									e.preventDefault();
									onPageChange(pageNumber as number);
								}}
								isActive={pageNumber === currentPage}>
								{pageNumber}
							</PaginationLink>
						</PaginationItem>
					);
				})}
				<PaginationItem>
					<PaginationNext
						onClick={(e) => {
							e.preventDefault();
							if (currentPage < totalPages) onPageChange(currentPage + 1);
						}}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
