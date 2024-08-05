"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	type BreadcrumbLinkProps,
} from "@chakra-ui/react";

export default function BreadcrumbWrapper({
	children,
	breadcrumbs = children,
}: {
	children?: BreadcrumbLinkProps[];
	breadcrumbs?: BreadcrumbLinkProps[];
}) {
	return (
		(children || breadcrumbs) && (
			<Breadcrumb>
				{(breadcrumbs || children || []).map((link, n) => (
					<BreadcrumbItem key={link.key || link.href || n}>
						<BreadcrumbLink
							{...link}
							{...(link.isCurrentPage ? { color: "gray.500" } : {})}
						/>
					</BreadcrumbItem>
				))}
			</Breadcrumb>
		)
	);
}
